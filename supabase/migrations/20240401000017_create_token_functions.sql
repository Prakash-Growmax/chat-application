-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS calculate_token_cost;
DROP FUNCTION IF EXISTS deduct_tokens;

-- Create function to calculate token cost
CREATE OR REPLACE FUNCTION calculate_token_cost(
    p_action_type TEXT,
    p_content_length INTEGER
) RETURNS INTEGER AS $$
DECLARE
    base_cost INTEGER;
BEGIN
    -- Define base costs for different action types
    base_cost := CASE p_action_type
        WHEN 'text_question' THEN 1
        WHEN 'complex_query' THEN 2
        WHEN 'data_visualization' THEN 5
        ELSE 1
    END;
    
    -- Calculate total cost based on content length
    RETURN base_cost * p_content_length;
END;
$$ LANGUAGE plpgsql;

-- Create function to deduct tokens
CREATE OR REPLACE FUNCTION deduct_tokens(
    p_user_id UUID,
    p_chat_id TEXT,
    p_action_type TEXT,
    p_content_length INTEGER,
    p_context_data JSONB DEFAULT '{}'::jsonb
) RETURNS INTEGER AS $$
DECLARE
    v_token_cost INTEGER;
    v_current_usage INTEGER;
    v_plan_limit INTEGER;
    v_plan TEXT;
BEGIN
    -- Calculate token cost
    v_token_cost := calculate_token_cost(p_action_type, p_content_length);
    
    -- Get current usage and plan
    SELECT token_usage, plan INTO v_current_usage, v_plan
    FROM subscriptions
    WHERE user_id = p_user_id;
    
    -- Set plan limit
    v_plan_limit := CASE v_plan
        WHEN 'single' THEN 1000
        WHEN 'team' THEN 5000
        WHEN 'pro' THEN 2147483647  -- Max INT for "unlimited"
        ELSE 1000
    END;
    
    -- Check if user has enough tokens
    IF (v_current_usage + v_token_cost) > v_plan_limit THEN
        RAISE EXCEPTION 'Insufficient tokens';
    END IF;
    
    -- Update token usage
    UPDATE subscriptions
    SET 
        token_usage = token_usage + v_token_cost,
        updated_at = NOW()
    WHERE user_id = p_user_id;
    
    -- Log token usage
    INSERT INTO token_usage_logs (
        user_id,
        request_timestamp,
        tokens_used,
        model_name,
        request_type,
        status
    ) VALUES (
        p_user_id,
        NOW(),
        v_token_cost,
        'gpt-3.5-turbo',
        p_action_type,
        'success'
    );
    
    RETURN v_token_cost;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION calculate_token_cost TO authenticated;
GRANT EXECUTE ON FUNCTION deduct_tokens TO authenticated;
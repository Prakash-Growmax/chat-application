-- Add token cost configuration table
CREATE TABLE token_costs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  action_type TEXT NOT NULL UNIQUE,
  base_cost INTEGER NOT NULL,
  multiplier FLOAT DEFAULT 1.0,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add detailed token usage tracking
CREATE TABLE token_usage_details (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  tokens_used INTEGER NOT NULL,
  context_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_token_usage_details_user_id ON token_usage_details(user_id);
CREATE INDEX idx_token_usage_details_chat_id ON token_usage_details(chat_id);
CREATE INDEX idx_token_usage_details_created_at ON token_usage_details(created_at);

-- Add RLS policies
ALTER TABLE token_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_usage_details ENABLE ROW LEVEL SECURITY;

-- Users can read token costs
CREATE POLICY "Everyone can read token costs"
  ON token_costs FOR SELECT
  TO PUBLIC
  USING (true);

-- Users can only view their own token usage details
CREATE POLICY "Users can view their own token usage details"
  ON token_usage_details FOR SELECT
  USING (auth.uid() = user_id);

-- Insert default token costs
INSERT INTO token_costs (action_type, base_cost, multiplier, description) VALUES
  ('text_question', 1, 1.0, 'Basic text question'),
  ('complex_query', 1, 2.0, 'Complex analysis query'),
  ('data_visualization', 10, 1.0, 'Generate data visualization'),
  ('file_analysis', 5, 1.0, 'Initial CSV file analysis');

-- Function to calculate token cost
CREATE OR REPLACE FUNCTION calculate_token_cost(
  p_action_type TEXT,
  p_content_length INTEGER
)
RETURNS INTEGER AS $$
DECLARE
  v_base_cost INTEGER;
  v_multiplier FLOAT;
  v_total_cost INTEGER;
BEGIN
  SELECT base_cost, multiplier INTO v_base_cost, v_multiplier
  FROM token_costs
  WHERE action_type = p_action_type;
  
  IF v_base_cost IS NULL THEN
    RAISE EXCEPTION 'Invalid action type: %', p_action_type;
  END IF;
  
  v_total_cost := CEIL(v_base_cost * p_content_length * v_multiplier);
  RETURN v_total_cost;
END;
$$ LANGUAGE plpgsql;

-- Function to deduct tokens
CREATE OR REPLACE FUNCTION deduct_tokens(
  p_user_id UUID,
  p_chat_id UUID,
  p_action_type TEXT,
  p_content_length INTEGER,
  p_context_data JSONB DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  v_token_cost INTEGER;
  v_current_usage INTEGER;
  v_plan_limit INTEGER;
BEGIN
  -- Calculate token cost
  v_token_cost := calculate_token_cost(p_action_type, p_content_length);
  
  -- Get current usage and plan limit
  SELECT 
    s.token_usage,
    CASE s.plan
      WHEN 'single' THEN 1000
      WHEN 'team' THEN 5000
      WHEN 'pro' THEN 2147483647 -- Max INT for "unlimited"
    END
  INTO v_current_usage, v_plan_limit
  FROM subscriptions s
  WHERE user_id = p_user_id;
  
  -- Check if user has enough tokens
  IF (v_current_usage + v_token_cost) > v_plan_limit THEN
    RAISE EXCEPTION 'Insufficient tokens';
  END IF;
  
  -- Update token usage
  UPDATE subscriptions
  SET token_usage = token_usage + v_token_cost
  WHERE user_id = p_user_id;
  
  -- Log token usage
  INSERT INTO token_usage_details (
    user_id,
    chat_id,
    action_type,
    tokens_used,
    context_data
  ) VALUES (
    p_user_id,
    p_chat_id,
    p_action_type,
    v_token_cost,
    p_context_data
  );
  
  RETURN v_token_cost;
END;
$$ LANGUAGE plpgsql;
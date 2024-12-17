-- Drop existing table if it exists
DROP TABLE IF EXISTS token_usage_logs;

-- Create token_usage_logs table
CREATE TABLE token_usage_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    request_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    tokens_used INTEGER NOT NULL CHECK (tokens_used >= 0),
    model_name VARCHAR(50) NOT NULL,
    request_type VARCHAR(20) NOT NULL,
    status VARCHAR(10) DEFAULT 'success' CHECK (status IN ('success', 'failed', 'pending')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for common query patterns
CREATE INDEX idx_token_usage_logs_user_id ON token_usage_logs(user_id);
CREATE INDEX idx_token_usage_logs_request_timestamp ON token_usage_logs(request_timestamp);
CREATE INDEX idx_token_usage_logs_status ON token_usage_logs(status);
CREATE INDEX idx_token_usage_logs_model ON token_usage_logs(model_name);

-- Enable Row Level Security
ALTER TABLE token_usage_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own token usage logs"
    ON token_usage_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own token usage logs"
    ON token_usage_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Add table comment
COMMENT ON TABLE token_usage_logs IS 'Tracks token usage for API requests';

-- Add column comments
COMMENT ON COLUMN token_usage_logs.id IS 'Auto-incrementing primary key';
COMMENT ON COLUMN token_usage_logs.user_id IS 'Reference to auth.users table';
COMMENT ON COLUMN token_usage_logs.request_timestamp IS 'When the request was made';
COMMENT ON COLUMN token_usage_logs.tokens_used IS 'Number of tokens consumed';
COMMENT ON COLUMN token_usage_logs.model_name IS 'Name of the AI model used';
COMMENT ON COLUMN token_usage_logs.request_type IS 'Type of request made';
COMMENT ON COLUMN token_usage_logs.status IS 'Status of the request';
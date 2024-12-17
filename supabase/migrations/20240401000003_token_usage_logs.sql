-- Create token usage logs table
CREATE TABLE token_usage_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  chat_id TEXT NOT NULL,
  action_type TEXT NOT NULL,
  tokens_used INTEGER NOT NULL,
  content_length INTEGER NOT NULL,
  metadata JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_token_usage_logs_user_id ON token_usage_logs(user_id);
CREATE INDEX idx_token_usage_logs_chat_id ON token_usage_logs(chat_id);
CREATE INDEX idx_token_usage_logs_timestamp ON token_usage_logs(timestamp);

-- Enable RLS
ALTER TABLE token_usage_logs ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Users can view their own token usage logs"
  ON token_usage_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own token usage logs"
  ON token_usage_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);
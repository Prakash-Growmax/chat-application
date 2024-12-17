-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create subscriptions table
CREATE TABLE subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('single', 'team', 'pro')),
  token_usage INTEGER DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create token usage logs table
CREATE TABLE token_usage_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tokens INTEGER NOT NULL,
  action TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_token_usage_logs_user_id ON token_usage_logs(user_id);
CREATE INDEX idx_token_usage_logs_timestamp ON token_usage_logs(timestamp);

-- Add RLS policies
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_usage_logs ENABLE ROW LEVEL SECURITY;

-- Users can only read their own subscription
CREATE POLICY "Users can read their own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Only authenticated users can view their token usage logs
CREATE POLICY "Users can view their own token usage logs"
  ON token_usage_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for updating updated_at
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default subscription for new users
CREATE OR REPLACE FUNCTION create_default_subscription()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id, plan, status)
  VALUES (NEW.id, 'single', 'active');
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for creating default subscription
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_subscription();
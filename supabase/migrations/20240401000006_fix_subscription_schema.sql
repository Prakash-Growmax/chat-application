-- Drop existing tables if they exist
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS token_usage_logs CASCADE;

-- Create subscriptions table with correct schema
CREATE TABLE subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  plan TEXT NOT NULL DEFAULT 'single' CHECK (plan IN ('single', 'team', 'pro')),
  token_usage INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create token usage logs
CREATE TABLE token_usage_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  tokens INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_plan ON subscriptions(plan);
CREATE INDEX idx_token_usage_logs_user_id ON token_usage_logs(user_id);
CREATE INDEX idx_token_usage_logs_created_at ON token_usage_logs(created_at);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_usage_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription"
  ON subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their token usage logs"
  ON token_usage_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Function to create default subscription
CREATE OR REPLACE FUNCTION create_default_subscription()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.subscriptions (
    user_id,
    plan,
    token_usage,
    status
  ) VALUES (
    NEW.id,
    'single',
    0,
    'active'
  ) ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_subscription();
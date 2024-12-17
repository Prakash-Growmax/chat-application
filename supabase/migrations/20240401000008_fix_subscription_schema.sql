-- Drop existing subscriptions table if it exists
DROP TABLE IF EXISTS subscriptions CASCADE;

-- Create subscriptions table with correct schema
CREATE TABLE subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  plan TEXT NOT NULL DEFAULT 'single',
  token_usage INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_plan CHECK (plan IN ('single', 'team', 'pro')),
  CONSTRAINT valid_status CHECK (status IN ('active', 'cancelled', 'suspended'))
);

-- Create indexes for better performance
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_plan ON subscriptions(plan);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- Enable Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription"
  ON subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to handle updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create default subscription for new users
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
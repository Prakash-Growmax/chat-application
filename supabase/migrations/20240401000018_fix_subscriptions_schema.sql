-- Drop existing tables if they exist
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

-- Create indexes
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_plan ON subscriptions(plan);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable read access for authenticated users"
    ON subscriptions FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Enable insert access for authenticated users"
    ON subscriptions FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update access for authenticated users"
    ON subscriptions FOR UPDATE
    TO authenticated
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
$$ LANGUAGE plpgsql;

-- Create trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_default_subscription();
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

-- Create organizations table
CREATE TABLE organizations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    plan TEXT NOT NULL CHECK (plan IN ('single', 'team', 'pro')),
    token_usage INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create organization_members table
CREATE TABLE organization_members (
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (organization_id, user_id)
);

-- Create token_usage_logs table
CREATE TABLE token_usage_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    tokens INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_organizations_owner_id ON organizations(owner_id);
CREATE INDEX idx_token_usage_logs_user_id ON token_usage_logs(user_id);
CREATE INDEX idx_token_usage_logs_org_id ON token_usage_logs(organization_id);

-- Enable Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_usage_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own subscription"
    ON subscriptions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their organizations"
    ON organizations FOR SELECT
    USING (
        auth.uid() = owner_id OR
        auth.uid() IN (
            SELECT user_id FROM organization_members
            WHERE organization_id = id
        )
    );

CREATE POLICY "Users can view organization members"
    ON organization_members FOR SELECT
    USING (
        auth.uid() IN (
            SELECT user_id FROM organization_members
            WHERE organization_id = organization_members.organization_id
        )
    );

CREATE POLICY "Users can view their token usage logs"
    ON token_usage_logs FOR SELECT
    USING (
        auth.uid() = user_id OR
        auth.uid() IN (
            SELECT user_id FROM organization_members
            WHERE organization_id = token_usage_logs.organization_id
            AND role IN ('owner', 'admin')
        )
    );

-- Function to create default subscription for new users
CREATE OR REPLACE FUNCTION create_default_subscription()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.subscriptions (user_id, plan, status)
    VALUES (NEW.id, 'single', 'active');
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to create default subscription
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_default_subscription();
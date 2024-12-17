-- Drop existing tables and start fresh
DROP TABLE IF EXISTS organization_members CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;

-- Create organizations table with simplified structure
CREATE TABLE organizations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    plan TEXT NOT NULL DEFAULT 'single',
    token_usage INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create organization_members table with simplified structure
CREATE TABLE organization_members (
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (organization_id, user_id)
);

-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;

-- Simple ownership-based policies for organizations
CREATE POLICY "organizations_select_policy" ON organizations
    FOR SELECT USING (
        owner_id = auth.uid() OR
        id IN (SELECT organization_id FROM organization_members WHERE user_id = auth.uid())
    );

CREATE POLICY "organizations_insert_policy" ON organizations
    FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "organizations_update_policy" ON organizations
    FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "organizations_delete_policy" ON organizations
    FOR DELETE USING (owner_id = auth.uid());

-- Simple membership policies for organization_members
CREATE POLICY "members_select_policy" ON organization_members
    FOR SELECT USING (
        organization_id IN (
            SELECT id FROM organizations WHERE owner_id = auth.uid()
        ) OR user_id = auth.uid()
    );

CREATE POLICY "members_insert_policy" ON organization_members
    FOR INSERT WITH CHECK (
        organization_id IN (SELECT id FROM organizations WHERE owner_id = auth.uid())
    );

CREATE POLICY "members_delete_policy" ON organization_members
    FOR DELETE USING (
        organization_id IN (SELECT id FROM organizations WHERE owner_id = auth.uid())
    );

-- Create indexes
CREATE INDEX idx_organizations_owner_id ON organizations(owner_id);
CREATE INDEX idx_org_members_user_id ON organization_members(user_id);
CREATE INDEX idx_org_members_org_id ON organization_members(organization_id);

-- Function to automatically add owner as member
CREATE OR REPLACE FUNCTION add_owner_as_member()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO organization_members (organization_id, user_id)
    VALUES (NEW.id, NEW.owner_id)
    ON CONFLICT (organization_id, user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-adding owner
CREATE TRIGGER on_organization_created
    AFTER INSERT ON organizations
    FOR EACH ROW
    EXECUTE FUNCTION add_owner_as_member();
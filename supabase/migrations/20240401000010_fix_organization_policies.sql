-- Drop existing policies
DROP POLICY IF EXISTS "Users can view organizations" ON organizations;
DROP POLICY IF EXISTS "Users can view organization members" ON organization_members;
DROP POLICY IF EXISTS "Organization owners can manage members" ON organization_members;

-- Fix organizations table structure
ALTER TABLE organizations DROP CONSTRAINT IF EXISTS organizations_pkey CASCADE;
ALTER TABLE organizations ADD PRIMARY KEY (id);
ALTER TABLE organizations ALTER COLUMN owner_id SET NOT NULL;

-- Fix organization_members table structure
ALTER TABLE organization_members DROP CONSTRAINT IF EXISTS organization_members_pkey CASCADE;
ALTER TABLE organization_members ADD PRIMARY KEY (organization_id, user_id);
ALTER TABLE organization_members ALTER COLUMN role SET NOT NULL;
ALTER TABLE organization_members ADD CONSTRAINT valid_role CHECK (role IN ('owner', 'admin', 'member'));

-- Create improved RLS policies for organizations
CREATE POLICY "Users can view their organizations"
    ON organizations FOR SELECT
    USING (
        owner_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM organization_members
            WHERE organization_id = organizations.id
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage their owned organizations"
    ON organizations FOR ALL
    USING (owner_id = auth.uid())
    WITH CHECK (owner_id = auth.uid());

-- Create improved RLS policies for organization_members
CREATE POLICY "Users can view members of their organizations"
    ON organization_members FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM organizations
            WHERE id = organization_members.organization_id
            AND (
                owner_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM organization_members om
                    WHERE om.organization_id = organization_members.organization_id
                    AND om.user_id = auth.uid()
                )
            )
        )
    );

CREATE POLICY "Owners and admins can manage organization members"
    ON organization_members FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM organizations o
            INNER JOIN organization_members om
            ON o.id = om.organization_id
            WHERE o.id = organization_members.organization_id
            AND om.user_id = auth.uid()
            AND (o.owner_id = auth.uid() OR om.role = 'admin')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM organizations o
            INNER JOIN organization_members om
            ON o.id = om.organization_id
            WHERE o.id = organization_members.organization_id
            AND om.user_id = auth.uid()
            AND (o.owner_id = auth.uid() OR om.role = 'admin')
        )
    );

-- Create function to automatically add owner as member
CREATE OR REPLACE FUNCTION add_owner_as_member()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO organization_members (organization_id, user_id, role)
    VALUES (NEW.id, NEW.owner_id, 'owner');
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to add owner as member
DROP TRIGGER IF EXISTS on_organization_created ON organizations;
CREATE TRIGGER on_organization_created
    AFTER INSERT ON organizations
    FOR EACH ROW
    EXECUTE FUNCTION add_owner_as_member();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_org_members_user_id ON organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_org_members_org_id ON organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_organizations_owner_id ON organizations(owner_id);
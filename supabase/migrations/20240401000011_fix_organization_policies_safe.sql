-- Function to check if a policy exists
CREATE OR REPLACE FUNCTION policy_exists(policy_name text, table_name text) 
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE policyname = policy_name
        AND tablename = table_name
    );
END;
$$ LANGUAGE plpgsql;

DO $$ 
BEGIN
    -- Drop existing policies if they exist
    IF policy_exists('Users can view organizations', 'organizations') THEN
        DROP POLICY "Users can view organizations" ON organizations;
    END IF;
    
    IF policy_exists('Users can view organization members', 'organization_members') THEN
        DROP POLICY "Users can view organization members" ON organization_members;
    END IF;
    
    IF policy_exists('Organization owners can manage members', 'organization_members') THEN
        DROP POLICY "Organization owners can manage members" ON organization_members;
    END IF;

    -- Fix table structures
    ALTER TABLE organizations DROP CONSTRAINT IF EXISTS organizations_pkey CASCADE;
    ALTER TABLE organizations ADD PRIMARY KEY (id);
    ALTER TABLE organizations ALTER COLUMN owner_id SET NOT NULL;

    ALTER TABLE organization_members DROP CONSTRAINT IF EXISTS organization_members_pkey CASCADE;
    ALTER TABLE organization_members ADD PRIMARY KEY (organization_id, user_id);
    ALTER TABLE organization_members ALTER COLUMN role SET NOT NULL;
    ALTER TABLE organization_members DROP CONSTRAINT IF EXISTS valid_role;
    ALTER TABLE organization_members ADD CONSTRAINT valid_role CHECK (role IN ('owner', 'admin', 'member'));

    -- Create new policies
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
                WHERE o.id = organization_members.organization_id
                AND (
                    o.owner_id = auth.uid() OR
                    EXISTS (
                        SELECT 1 FROM organization_members om
                        WHERE om.organization_id = o.id
                        AND om.user_id = auth.uid()
                        AND om.role = 'admin'
                    )
                )
            )
        );

    -- Create or replace function for adding owner as member
    CREATE OR REPLACE FUNCTION add_owner_as_member()
    RETURNS TRIGGER AS $$
    BEGIN
        INSERT INTO organization_members (organization_id, user_id, role)
        VALUES (NEW.id, NEW.owner_id, 'owner')
        ON CONFLICT (organization_id, user_id) DO NOTHING;
        RETURN NEW;
    END;
    $$ language 'plpgsql';

    -- Create trigger if it doesn't exist
    DROP TRIGGER IF EXISTS on_organization_created ON organizations;
    CREATE TRIGGER on_organization_created
        AFTER INSERT ON organizations
        FOR EACH ROW
        EXECUTE FUNCTION add_owner_as_member();

    -- Create indexes if they don't exist
    CREATE INDEX IF NOT EXISTS idx_org_members_user_id ON organization_members(user_id);
    CREATE INDEX IF NOT EXISTS idx_org_members_org_id ON organization_members(organization_id);
    CREATE INDEX IF NOT EXISTS idx_organizations_owner_id ON organizations(owner_id);

END $$;

-- Clean up the helper function
DROP FUNCTION IF EXISTS policy_exists(text, text);
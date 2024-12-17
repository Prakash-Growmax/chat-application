-- Drop existing policies
DROP POLICY IF EXISTS "organizations_select_policy" ON organizations;
DROP POLICY IF EXISTS "organizations_insert_policy" ON organizations;
DROP POLICY IF EXISTS "organizations_update_policy" ON organizations;
DROP POLICY IF EXISTS "organizations_delete_policy" ON organizations;
DROP POLICY IF EXISTS "members_select_policy" ON organization_members;
DROP POLICY IF EXISTS "members_insert_policy" ON organization_members;
DROP POLICY IF EXISTS "members_delete_policy" ON organization_members;

-- Create improved policies for organizations
CREATE POLICY "organizations_select_policy" ON organizations
    FOR SELECT USING (
        owner_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM organization_members
            WHERE organization_id = id AND user_id = auth.uid()
        )
    );

CREATE POLICY "organizations_insert_policy" ON organizations
    FOR INSERT WITH CHECK (
        auth.uid() = owner_id AND
        EXISTS (
            SELECT 1 FROM subscriptions
            WHERE user_id = auth.uid() AND status = 'active'
        )
    );

CREATE POLICY "organizations_update_policy" ON organizations
    FOR UPDATE USING (
        owner_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM organization_members
            WHERE organization_id = id AND user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "organizations_delete_policy" ON organizations
    FOR DELETE USING (owner_id = auth.uid());

-- Create improved policies for organization members
CREATE POLICY "members_select_policy" ON organization_members
    FOR SELECT USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM organizations
            WHERE id = organization_id AND owner_id = auth.uid()
        )
    );

CREATE POLICY "members_insert_policy" ON organization_members
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM organizations
            WHERE id = organization_id AND owner_id = auth.uid()
        )
    );

CREATE POLICY "members_delete_policy" ON organization_members
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM organizations
            WHERE id = organization_id AND owner_id = auth.uid()
        )
    );

-- Add function to validate organization limits
CREATE OR REPLACE FUNCTION check_organization_limit()
RETURNS TRIGGER AS $$
DECLARE
    org_count INTEGER;
    plan_limit INTEGER;
    user_plan TEXT;
BEGIN
    -- Get user's plan
    SELECT plan INTO user_plan
    FROM subscriptions
    WHERE user_id = NEW.owner_id;

    -- Set plan limit
    plan_limit := CASE user_plan
        WHEN 'single' THEN 1
        WHEN 'team' THEN 3
        WHEN 'pro' THEN 2147483647  -- Max INT for "unlimited"
        ELSE 1
    END;

    -- Count existing organizations
    SELECT COUNT(*) INTO org_count
    FROM organizations
    WHERE owner_id = NEW.owner_id;

    IF org_count >= plan_limit THEN
        RAISE EXCEPTION 'Organization limit reached for current plan';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for organization limit
DROP TRIGGER IF EXISTS check_org_limit ON organizations;
CREATE TRIGGER check_org_limit
    BEFORE INSERT ON organizations
    FOR EACH ROW
    EXECUTE FUNCTION check_organization_limit();
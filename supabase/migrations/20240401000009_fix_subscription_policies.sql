-- Drop existing RLS policies
DROP POLICY IF EXISTS "Users can view their own subscription" ON subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscription" ON subscriptions;
DROP POLICY IF EXISTS "System can create default subscriptions" ON subscriptions;

-- Create comprehensive RLS policies
CREATE POLICY "Users can view their own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription"
  ON subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "System can create default subscriptions"
  ON subscriptions FOR INSERT
  WITH CHECK (
    -- Allow inserts for authenticated users creating their own subscription
    (auth.uid() = user_id) OR
    -- Allow system-level operations (for triggers)
    (auth.uid() IS NULL)
  );

-- Ensure proper indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan ON subscriptions(plan);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
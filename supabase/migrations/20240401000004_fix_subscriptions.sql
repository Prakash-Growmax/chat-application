-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS create_default_subscription();

-- Recreate the function with proper error handling
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

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_subscription();

-- Add unique constraint on user_id
ALTER TABLE subscriptions
  DROP CONSTRAINT IF EXISTS subscriptions_user_id_key,
  ADD CONSTRAINT subscriptions_user_id_key UNIQUE (user_id);

-- Add missing columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'subscriptions' AND column_name = 'status') 
  THEN
    ALTER TABLE subscriptions ADD COLUMN status TEXT NOT NULL DEFAULT 'active';
  END IF;
END $$;

-- Create or update policies
DROP POLICY IF EXISTS "Users can manage their own subscription" ON subscriptions;
CREATE POLICY "Users can manage their own subscription"
  ON subscriptions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan ON subscriptions(plan);
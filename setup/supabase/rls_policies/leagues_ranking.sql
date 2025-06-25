-- =============================================================================
-- ROW LEVEL SECURITY POLICIES FOR leagues_ranking TABLE
-- =============================================================================

-- Enable RLS on leagues_ranking table (if not already enabled)
ALTER TABLE leagues_ranking ENABLE ROW LEVEL SECURITY;

-- Policy to allow all authenticated users to view league rankings (excluding deleted accounts)
CREATE POLICY "Anyone can view league rankings" ON leagues_ranking
  FOR SELECT
  TO authenticated
  USING (
    NOT EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND raw_user_meta_data->>'account_deleted' = 'true'
    )
  );

-- Policy to allow users to insert their own league ranking entries (excluding deleted accounts)
CREATE POLICY "Users can insert their own league ranking entries" ON leagues_ranking
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id 
    AND NOT EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND raw_user_meta_data->>'account_deleted' = 'true'
    )
  );

-- Policy to allow users to update their own league ranking entries (excluding deleted accounts)
CREATE POLICY "Users can update their own league ranking entries" ON leagues_ranking
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id 
    AND NOT EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND raw_user_meta_data->>'account_deleted' = 'true'
    )
  )
  WITH CHECK (
    auth.uid() = user_id 
    AND NOT EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND raw_user_meta_data->>'account_deleted' = 'true'
    )
  ); 
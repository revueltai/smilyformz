-- =============================================================================
-- ROW LEVEL SECURITY POLICIES FOR game_sessions TABLE
-- =============================================================================

-- Enable RLS on game_sessions table (if not already enabled)
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to insert their own game sessions (excluding deleted accounts)
CREATE POLICY "Users can insert their own game sessions" ON game_sessions
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

-- Policy to allow users to view their own game sessions (excluding deleted accounts)
CREATE POLICY "Users can view their own game sessions" ON game_sessions
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id 
    AND NOT EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND raw_user_meta_data->>'account_deleted' = 'true'
    )
  );

-- Policy to allow users to update their own game sessions (excluding deleted accounts)
CREATE POLICY "Users can update their own game sessions" ON game_sessions
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

-- Policy to allow users to delete their own game sessions (excluding deleted accounts)
CREATE POLICY "Users can delete their own game sessions" ON game_sessions
  FOR DELETE
  TO authenticated
  USING (
    auth.uid() = user_id 
    AND NOT EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND raw_user_meta_data->>'account_deleted' = 'true'
    )
  ); 
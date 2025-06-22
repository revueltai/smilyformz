-- =============================================================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================================================

-- Row Level Security Policies for game_sessions table

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

-- Row Level Security Policies for global_ranking table (if needed)

-- Enable RLS on global_ranking table (if not already enabled)
ALTER TABLE global_ranking ENABLE ROW LEVEL SECURITY;

-- Policy to allow all authenticated users to view global rankings (excluding deleted accounts)
CREATE POLICY "Anyone can view global rankings" ON global_ranking
  FOR SELECT
  TO authenticated
  USING (
    NOT EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND raw_user_meta_data->>'account_deleted' = 'true'
    )
  );

-- Policy to allow users to insert their own ranking entries (excluding deleted accounts)
CREATE POLICY "Users can insert their own ranking entries" ON global_ranking
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

-- Policy to allow users to update their own ranking entries (excluding deleted accounts)
CREATE POLICY "Users can update their own ranking entries" ON global_ranking
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
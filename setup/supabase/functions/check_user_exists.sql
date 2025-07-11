-- =============================================================================
-- FUNCTION: check_user_exists
-- =============================================================================

-- Function: check_user_exists
-- 
-- Parameters:
--   p_email TEXT - The email address to check (optional)
--   p_username TEXT - The username/display_name to check (optional)
-- 
-- Returns: BOOLEAN - TRUE if user exists, FALSE otherwise
-- 
-- Description:
--   This function checks if a user exists in the auth.users table by either
--   email address or username (stored as display_name in raw_user_meta_data).
--   At least one parameter must be provided.
-- 
-- Examples:
--   -- Check by email
--   SELECT check_user_exists('user@example.com', NULL);
--   
--   -- Check by username
--   SELECT check_user_exists(NULL, 'username');
--   
--   -- Check by both
--   SELECT check_user_exists('user@example.com', 'username');

-- Uncomment if running as standalone SQL script
-- CREATE OR REPLACE FUNCTION check_user_exists(
--   p_email TEXT DEFAULT NULL,
--   p_username TEXT DEFAULT NULL
-- )
-- RETURNS BOOLEAN
-- LANGUAGE plpgsql
-- SECURITY DEFINER
-- AS $$

BEGIN
  -- Check if user exists by email (including deleted accounts)
  IF p_email IS NOT NULL AND EXISTS (
    SELECT 1 FROM auth.users WHERE email = p_email
  ) THEN
    RETURN TRUE;
  END IF;
  
  -- Check if user exists by username (including deleted accounts)
  IF p_username IS NOT NULL AND EXISTS (
    SELECT 1 FROM auth.users WHERE raw_user_meta_data->>'display_name' = p_username
  ) THEN
    RETURN TRUE;
  END IF;
  
  -- User doesn't exist
  RETURN FALSE;
END;

-- Uncomment if running as standalone SQL script
-- $$; 

-- Grant execute permission to authenticated users for check_user_exists
-- GRANT EXECUTE ON FUNCTION check_user_exists(TEXT, TEXT) TO authenticated;

-- Grant execute permission to anon users for check_user_exists (needed for signup)
-- GRANT EXECUTE ON FUNCTION check_user_exists(TEXT, TEXT) TO anon;
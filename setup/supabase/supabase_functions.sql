-- =============================================================================
-- SUPABASE DATABASE FUNCTIONS
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
CREATE OR REPLACE FUNCTION check_user_exists(
  p_email TEXT DEFAULT NULL,
  p_username TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- Function: delete_user_data
-- 
-- Parameters:
--   p_user_id UUID - The UUID of the user to delete
-- 
-- Returns: JSON - Object containing success status, message, and deletion details
-- 
-- Description:
--   This function performs a complete user data cleanup:
--   1. Validates that the user exists
--   2. Deletes all game sessions for the user
--   3. Deletes all global ranking entries for the user
--   4. Marks the account as deleted in user metadata with timestamp
-- 
--   The function uses SECURITY DEFINER to run with elevated privileges,
--   allowing it to delete data and update auth.users table.
-- 
-- Returns JSON structure:
--   {
--     "success": boolean,
--     "message": string,
--     "deleted_game_sessions": integer,
--     "deleted_at": string (ISO timestamp),
--     "error": string (only if success is false)
--   }
-- 
-- Examples:
--   -- Delete user data
--   SELECT delete_user_data('123e4567-e89b-12d3-a456-426614174000');
-- 
-- Error Conditions:
--   - "User not found" if the user_id doesn't exist
--   - Database errors if deletion fails
CREATE OR REPLACE FUNCTION delete_user_data(
  p_user_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count INTEGER := 0;
  result JSON;
BEGIN
  -- Check if user exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = p_user_id) THEN
    RETURN json_build_object(
      'success', false,
      'error', 'User not found'
    );
  END IF;

  -- Delete game sessions
  DELETE FROM game_sessions WHERE user_id = p_user_id;
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- Delete global ranking entries
  DELETE FROM global_ranking WHERE user_id = p_user_id;
  
  -- Update user metadata to mark account as deleted
  UPDATE auth.users 
  SET raw_user_meta_data = raw_user_meta_data || 
    json_build_object(
      'account_deleted', true,
      'deleted_at', now()::text
    )::jsonb
  WHERE id = p_user_id;
  
  -- Return success result
  result := json_build_object(
    'success', true,
    'message', 'User data deleted successfully',
    'deleted_game_sessions', deleted_count,
    'deleted_at', now()::text
  );
  
  RETURN result;
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;

-- Function to check if a user account has been deleted
CREATE OR REPLACE FUNCTION is_account_deleted(
  p_user_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user exists and account is marked as deleted
  RETURN EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = p_user_id 
    AND raw_user_meta_data->>'account_deleted' = 'true'
  );
END;
$$;

-- Function to validate account status before login (email only check)
CREATE OR REPLACE FUNCTION validate_account_status(
  p_email TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_record RECORD;
BEGIN
  -- Check if user exists and get their deletion status
  SELECT id, raw_user_meta_data->>'account_deleted' as account_deleted 
  INTO user_record 
  FROM auth.users 
  WHERE email = p_email;
  
  -- If user doesn't exist, return generic response (don't reveal if email exists)
  IF user_record IS NULL THEN
    RETURN json_build_object(
      'valid', true,
      'message', 'Proceed with login'
    );
  END IF;
  
  -- Check if account is deleted
  IF user_record.account_deleted = 'true' THEN
    RETURN json_build_object(
      'valid', false,
      'error', 'Account has been deleted'
    );
  END IF;
  
  -- Account exists and is not deleted
  RETURN json_build_object(
    'valid', true,
    'message', 'Account is valid for login'
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'valid', true,
      'message', 'Proceed with login'
    );
END;
$$;

-- =============================================================================
-- PERMISSIONS
-- =============================================================================

-- Grant execute permission to authenticated users for check_user_exists
GRANT EXECUTE ON FUNCTION check_user_exists(TEXT, TEXT) TO authenticated;

-- Grant execute permission to anon users for check_user_exists (needed for signup)
GRANT EXECUTE ON FUNCTION check_user_exists(TEXT, TEXT) TO anon;

-- Grant execute permission to authenticated users for delete_user_data
GRANT EXECUTE ON FUNCTION delete_user_data(UUID) TO authenticated;

-- Grant execute permission to authenticated users for is_account_deleted
GRANT EXECUTE ON FUNCTION is_account_deleted(UUID) TO authenticated;

-- Grant execute permission to anon users for validate_account_status (needed for login)
GRANT EXECUTE ON FUNCTION validate_account_status(TEXT) TO anon; 
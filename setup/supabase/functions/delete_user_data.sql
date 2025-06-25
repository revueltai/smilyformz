-- =============================================================================
-- FUNCTION: delete_user_data
-- =============================================================================

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
--   3. Deletes all league ranking entries for the user
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
  
  -- Delete league ranking entries
  DELETE FROM leagues_ranking WHERE user_id = p_user_id;
  
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

-- Grant execute permission to authenticated users for delete_user_data
GRANT EXECUTE ON FUNCTION delete_user_data(UUID) TO authenticated;
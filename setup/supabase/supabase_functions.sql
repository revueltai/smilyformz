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

-- Function: cleanup_deleted_users (Cron Job)
-- 
-- Parameters:
--   p_retention_days INTEGER - Number of days to wait before permanent deletion (default: 30)
-- 
-- Returns: JSON - Object containing cleanup statistics
-- 
-- Description:
--   This function permanently removes users who have been marked as deleted
--   and have exceeded the retention period. It's designed to be run as a cron job.
-- 
--   The function:
--   1. Finds users marked as deleted with deletion timestamp older than retention period
--   2. Permanently deletes them from auth.users table
--   3. Returns statistics about the cleanup operation
-- 
-- Returns JSON structure:
--   {
--     "success": boolean,
--     "message": string,
--     "users_deleted": integer,
--     "execution_time": string (ISO timestamp),
--     "retention_days": integer,
--     "error": string (only if success is false)
--   }
-- 
-- Examples:
--   -- Run cleanup with default 30-day retention
--   SELECT cleanup_deleted_users();
--   
--   -- Run cleanup with 7-day retention
--   SELECT cleanup_deleted_users(7);
-- 
-- Cron Job Setup:
--   This function should be scheduled to run daily or weekly using Supabase's cron jobs.
--   Example cron schedule: '0 2 * * *' (daily at 2 AM)
CREATE OR REPLACE FUNCTION cleanup_deleted_users(
  p_retention_days INTEGER DEFAULT 30
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_users_count INTEGER := 0;
  retention_date TIMESTAMP;
  result JSON;
BEGIN
  -- Calculate retention date
  retention_date := now() - INTERVAL '1 day' * p_retention_days;
  
  -- Delete users marked as deleted and older than retention period
  DELETE FROM auth.users 
  WHERE raw_user_meta_data->>'account_deleted' = 'true'
    AND (raw_user_meta_data->>'deleted_at')::TIMESTAMP < retention_date;
  
  GET DIAGNOSTICS deleted_users_count = ROW_COUNT;
  
  -- Return cleanup statistics
  result := json_build_object(
    'success', true,
    'message', 'Deleted users cleanup completed',
    'users_deleted', deleted_users_count,
    'execution_time', now()::text,
    'retention_days', p_retention_days,
    'retention_date', retention_date::text
  );
  
  RETURN result;
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM,
      'execution_time', now()::text,
      'retention_days', p_retention_days
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

-- Grant execute permission to service_role for cleanup_deleted_users (cron job)
GRANT EXECUTE ON FUNCTION cleanup_deleted_users(INTEGER) TO service_role;

-- =============================================================================
-- CRON JOB SETUP
-- =============================================================================

-- Note: To set up the cron job in Supabase, you need to:
-- 1. Go to your Supabase dashboard
-- 2. Navigate to Database > Functions
-- 3. Create a new cron job with the following settings:
--    - Name: cleanup_deleted_users_job
--    - Schedule: '0 2 * * *' (daily at 2 AM UTC)
--    - Function: cleanup_deleted_users()
--    - Timeout: 300 seconds
--
-- Alternative schedules:
--   - '0 2 * * 0' (weekly on Sunday at 2 AM)
--   - '0 2 1 * *' (monthly on the 1st at 2 AM)
--   - '0 */6 * * *' (every 6 hours)
--
-- You can also run the function manually for testing:
--   SELECT cleanup_deleted_users(7); -- Clean up users deleted more than 7 days ago

-- =============================================================================
-- SUPABASE CRON SETUP (Updated)
-- =============================================================================

-- To set up the cron job using Supabase Cron:
-- 
-- 1. Enable the Cron Postgres Module:
--    - Go to your Supabase dashboard
--    - Navigate to Settings > Integrations
--    - Enable the "Cron" Postgres Module
--
-- 2. Create a new Cron Job:
--    - Go to Database > Cron Jobs
--    - Click "Create a new job"
--    - Choose "Database Functions" as the job type
--    - Select the cleanup_deleted_users function
--    - Set the schedule using standard cron syntax or natural language
--
-- 3. Recommended Schedule Options:
--    - Daily at 2 AM: "0 2 * * *"
--    - Weekly on Sunday: "0 2 * * 0" 
--    - Monthly on 1st: "0 2 1 * *"
--    - Every 6 hours: "0 */6 * * *"
--    - Natural language: "daily at 2am" or "weekly on sunday"
--
-- 4. Job Configuration:
--    - Name: cleanup_deleted_users_job
--    - Function: cleanup_deleted_users()
--    - Parameters: Leave empty for default 30-day retention
--    - Timeout: 300 seconds
--    - Retry on failure: Enabled (recommended)
--
-- 5. Monitor and Debug:
--    - View job history in the Cron Jobs dashboard
--    - Check logs in the Logs Explorer for detailed execution results
--    - Monitor job performance and success rates
--
-- Manual Testing:
--   You can test the function manually in the SQL Editor:
--   SELECT cleanup_deleted_users(7); -- Clean up users deleted more than 7 days ago 
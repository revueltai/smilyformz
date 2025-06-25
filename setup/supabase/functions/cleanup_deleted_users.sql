-- =============================================================================
-- FUNCTION: cleanup_deleted_users (Cron Job)
-- =============================================================================

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

-- Grant execute permission to service_role for cleanup_deleted_users (cron job)
GRANT EXECUTE ON FUNCTION cleanup_deleted_users(INTEGER) TO service_role;

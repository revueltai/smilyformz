-- =============================================================================
-- FUNCTION: is_account_deleted
-- =============================================================================

-- Function to check if a user account has been deleted
-- 
-- Parameters:
--   p_user_id UUID - The UUID of the user to check
-- 
-- Returns: BOOLEAN - True if the account is deleted, false otherwise
-- 
-- Description: 
--   This function checks if a user account has been marked as deleted.
--   It returns true if the account is deleted, false otherwise.
-- 
-- Returns: BOOLEAN - True if the account is deleted, false otherwise
-- 
-- Example:   
--   SELECT is_account_deleted('123e4567-e89b-12d3-a456-426614174000');
-- 
-- Returns: TRUE
-- 
-- Error Conditions:
--   - "User not found" if the user_id doesn't exist

-- Needed if running as standalone SQL script
-- CREATE OR REPLACE FUNCTION is_account_deleted(
--   p_user_id UUID
-- )
-- RETURNS BOOLEAN
-- LANGUAGE plpgsql
-- SECURITY DEFINER
-- AS $$

BEGIN
  -- Check if user exists and account is marked as deleted
  RETURN EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = p_user_id 
    AND raw_user_meta_data->>'account_deleted' = 'true'
  );
END;

-- Uncomment if running as standalone SQL script
-- $$;

-- Grant execute permission to authenticated users for is_account_deleted
GRANT EXECUTE ON FUNCTION is_account_deleted(UUID) TO authenticated;
-- =============================================================================
-- FUNCTION: is_account_deleted
-- =============================================================================

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

-- Grant execute permission to authenticated users for is_account_deleted
GRANT EXECUTE ON FUNCTION is_account_deleted(UUID) TO authenticated;
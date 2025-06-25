-- =============================================================================
-- FUNCTION: validate_account_status
-- =============================================================================

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

-- Grant execute permission to anon users for validate_account_status (needed for login)
GRANT EXECUTE ON FUNCTION validate_account_status(TEXT) TO anon;

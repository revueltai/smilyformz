-- Function to check if a user exists by email or username
CREATE OR REPLACE FUNCTION check_user_exists(
  p_email TEXT DEFAULT NULL,
  p_username TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user exists by email
  IF p_email IS NOT NULL AND EXISTS (
    SELECT 1 FROM auth.users WHERE email = p_email
  ) THEN
    RETURN TRUE;
  END IF;
  
  -- Check if user exists by username (display_name in raw_user_meta_data)
  IF p_username IS NOT NULL AND EXISTS (
    SELECT 1 FROM auth.users WHERE raw_user_meta_data->>'display_name' = p_username
  ) THEN
    RETURN TRUE;
  END IF;
  
  -- User doesn't exist
  RETURN FALSE;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION check_user_exists(TEXT, TEXT) TO authenticated;

-- Grant execute permission to anon users (if needed for signup)
GRANT EXECUTE ON FUNCTION check_user_exists(TEXT, TEXT) TO anon; 
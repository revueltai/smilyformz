# Supabase Setup Guide

## Deploying the check_user_exists Function

### Option 1: Using Supabase Dashboard (Recommended)

1. **Access Supabase Dashboard**

   - Go to your Supabase project dashboard
   - Navigate to the **SQL Editor** section

2. **Create the Function**
   - Copy the contents of `supabase_functions.sql`
   - Paste it into the SQL Editor
   - Click **Run** to execute the function creation

### Option 2: Using Supabase CLI

1. **Install Supabase CLI** (if not already installed)

   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**

   ```bash
   supabase login
   ```

3. **Link your project**

   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

4. **Deploy the function**
   ```bash
   supabase db push
   ```

### Function Details

The `check_user_exists` function:

- **Parameters**:

  - `p_email` (TEXT, optional): Email to check
  - `p_username` (TEXT, optional): Username to check (stored as `display_name` in user metadata)

- **Returns**: BOOLEAN - `TRUE` if user exists, `FALSE` otherwise

- **Security**: Uses `SECURITY DEFINER` to run with elevated privileges to access `auth.users` table

- **Permissions**: Granted to both `authenticated` and `anon` roles

### Usage in Your Application

The function is already integrated into your `SupabaseService` class:

```typescript
// Check if user exists by email
const exists = await supabase.checkUserExists('user@example.com', null)

// Check if user exists by username
const exists = await supabase.checkUserExists(null, 'username')

// Check if user exists by both email and username
const exists = await supabase.checkUserExists('user@example.com', 'username')
```

### Testing the Function

You can test the function directly in the Supabase SQL Editor:

```sql
-- Test with email
SELECT check_user_exists('test@example.com', NULL);

-- Test with username
SELECT check_user_exists(NULL, 'testuser');

-- Test with both
SELECT check_user_exists('test@example.com', 'testuser');
```

### Notes

- The function checks the `auth.users` table which is part of Supabase Auth
- Usernames are stored in the `raw_user_meta_data` JSON field as `display_name`
- The function is designed to work with your existing authentication flow
- Both parameters are optional, so you can check for either email or username independently

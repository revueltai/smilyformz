# Supabase Setup Guide

## Deploying the Database Functions

### Option 1: Using Supabase Dashboard (Recommended)

1. **Access Supabase Dashboard**

   - Go to your Supabase project dashboard
   - Navigate to the **SQL Editor** section

2. **Create the Function**

   - Copy the contents of `supabase_functions.sql`
   - Paste it into the SQL Editor
   - Click **Run** to execute the function creation

3. **Set up Row Level Security Policies**
   - Copy the contents of `rls_policies.sql`
   - Paste it into the SQL Editor
   - Click **Run** to execute the RLS policies creation

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

4. **Deploy the function and policies**
   ```bash
   supabase db push
   ```

## Row Level Security (RLS) Policies

The `rls_policies.sql` file contains the necessary Row Level Security policies for:

### game_sessions table

- **INSERT**: Users can insert their own game sessions
- **SELECT**: Users can view their own game sessions
- **UPDATE**: Users can update their own game sessions
- **DELETE**: Users can delete their own game sessions

### leagues_ranking table

- **SELECT**: Anyone can view global rankings
- **INSERT**: Users can insert their own ranking entries
- **UPDATE**: Users can update their own ranking entries

These policies ensure that:

- Users can only access their own data
- Game sessions are properly secured
- Global rankings are viewable by all authenticated users
- Data integrity is maintained

## Function Details

### check_user_exists Function

- **Parameters**:

  - `p_email` (TEXT, optional): Email to check
  - `p_username` (TEXT, optional): Username to check (stored as `display_name` in user metadata)

- **Returns**: BOOLEAN - `TRUE` if user exists, `FALSE` otherwise

- **Security**: Uses `SECURITY DEFINER` to run with elevated privileges to access `auth.users` table

- **Permissions**: Granted to both `authenticated` and `anon` roles

## User Data Management

User preferences and settings are now stored directly in the auth user metadata instead of a separate `user_data` table. This approach provides:

- **Simplified architecture**: No need for additional database tables or triggers
- **Automatic synchronization**: User metadata is always available with the auth session
- **Reduced complexity**: Fewer database operations and API calls
- **Better performance**: No additional queries needed to load user preferences

## How It Works

1. **User signs up**: User account is created with metadata including country, language, and avatar defaults
2. **User confirms email**: User metadata is immediately available
3. **User updates settings**: Changes are stored directly in auth user metadata via `auth.updateUser()`
4. **Automatic sync**: User preferences are always available from the auth session

## Usage in Your Application

The function is already integrated into your `SupabaseService` class:

```typescript
// Check if user exists by email
const exists = await supabase.checkUserExists('user@example.com', null)

// Check if user exists by username
const exists = await supabase.checkUserExists(null, 'username')

// Check if user exists by both email and username
const exists = await supabase.checkUserExists('user@example.com', 'username')
```

User settings are managed through the auth user metadata:

```typescript
// Update user settings
await userStore.updateUserSettings({
  music: true,
  sound: false,
  language: 'es',
  avatar_shape: 'star',
  avatar_color: '#FF0000',
})
```

## Testing the Function

You can test the function directly in the Supabase SQL Editor:

```sql
-- Test check_user_exists with email
SELECT check_user_exists('test@example.com', NULL);

-- Test check_user_exists with username
SELECT check_user_exists(NULL, 'testuser');

-- Test check_user_exists with both
SELECT check_user_exists('test@example.com', 'testuser');
```

## Notes

- The `check_user_exists` function checks the `auth.users` table which is part of Supabase Auth
- Usernames are stored in the `raw_user_meta_data` JSON field as `display_name`
- User preferences (country, language, avatar, music, sound) are stored in auth user metadata
- This approach eliminates the need for a separate `user_data` table and associated triggers
- User settings are automatically available whenever the user is authenticated

# Mock Data Scripts

This folder contains SQL scripts for generating dummy/mock data for development and testing purposes.

## ⚠️ Development Only

**These scripts should ONLY be used in development/testing environments!**

They include production safety checks to prevent accidental execution in production.

## Files

- **[insert_dummy_users.sql](./insert_dummy_users.sql)**: Creates dummy users with realistic profiles
- **[insert_dummy_data.sql](./insert_dummy_data.sql)**: Creates dummy game sessions and league rankings

## Quick Start

### Option 1: Everything at Once (Recommended)

```sql
-- Run in Supabase SQL Editor
SELECT insert_all_dummy_data(200, 5);
```

### Option 2: Step by Step

```sql
-- Step 1: Create users
SELECT insert_dummy_users(200);

-- Step 2: Create game data
SELECT insert_all_dummy_data(200, 5);
```

## What Gets Created

### Dummy Users

- **200 users** with usernames: Player001, Player002, ..., Player200
- **Emails**: player001@dummy.com, player002@dummy.com, ..., player200@dummy.com
- **Password**: `password123` (for all users)
- **Random data**: countries, league levels, avatar settings
- **Settings**: music and sound enabled by default

### Game Data

- **~1000 game sessions** (5 per user on average)
- **League ranking entries** based on highest scores
- **Realistic scores**: 100 to 50,000 points
- **Realistic durations**: 30 seconds to 30 minutes

## Verification Queries

```sql
-- Count users
SELECT COUNT(*) as total_users FROM auth.users WHERE email LIKE '%@dummy.com';

-- Count game sessions
SELECT COUNT(*) as total_sessions FROM game_sessions gs
JOIN auth.users u ON gs.user_id = u.id
WHERE u.email LIKE '%@dummy.com';

-- Count league rankings
SELECT COUNT(*) as total_entries FROM leagues_ranking lr
JOIN auth.users u ON lr.user_id = u.id
WHERE u.email LIKE '%@dummy.com';

-- Top 10 players
SELECT
  lr.position,
  u.raw_user_meta_data->>'display_name' as username,
  u.raw_user_meta_data->>'country' as country,
  u.raw_user_meta_data->>'league_level' as league_level,
  MAX(CAST(gs.score AS INTEGER)) as highest_score
FROM leagues_ranking lr
JOIN auth.users u ON lr.user_id = u.id
LEFT JOIN game_sessions gs ON u.id = gs.user_id
WHERE u.email LIKE '%@dummy.com'
GROUP BY lr.position, u.raw_user_meta_data, lr.position
ORDER BY lr.position
LIMIT 10;
```

## Cleanup

To remove all dummy data:

```sql
-- Remove league rankings
DELETE FROM leagues_ranking WHERE user_id IN (
  SELECT id FROM auth.users WHERE email LIKE '%@dummy.com'
);

-- Remove game sessions
DELETE FROM game_sessions WHERE user_id IN (
  SELECT id FROM auth.users WHERE email LIKE '%@dummy.com'
);

-- Remove users
DELETE FROM auth.users WHERE email LIKE '%@dummy.com';
```

## Safety Features

- **Production Check**: Functions check environment and block execution in production
- **Service Role**: Functions run with elevated permissions for data creation
- **Error Handling**: Comprehensive error handling and rollback
- **Documentation**: Clear usage instructions and cleanup procedures

## Integration

These scripts work with the main Supabase functions in `../supabase_functions.sql` and RLS policies in `../rls_policies.sql`.

# Game Sessions CSV Import Tools

This directory contains tools to help you import game sessions data into your Supabase database.

## Problem

The original CSV file contains placeholder user IDs that don't exist in your database, causing foreign key constraint violations when importing.

## Solutions

### Option 1: Use the SQL Script (Recommended)

1. **First, run the dummy users script to create test users:**

   ```sql
   SELECT insert_dummy_users(50);
   ```

2. **Get the actual user IDs:**

   ```sql
   -- Run this in your Supabase SQL Editor
   SELECT
     id,
     email,
     raw_user_meta_data->>'display_name' as username
   FROM auth.users
   WHERE raw_user_meta_data->>'account_deleted' IS NULL
   ORDER BY created_at DESC;
   ```

3. **Update the CSV file** with the real user IDs from step 2

4. **Import the updated CSV** into your `game_sessions` table

### Option 2: Use the Python Script

1. **Install required packages:**

   ```bash
   pip install supabase pandas
   ```

2. **Set your Supabase credentials:**

   ```bash
   export SUPABASE_URL="your-supabase-url"
   export SUPABASE_KEY="your-supabase-anon-key"
   ```

3. **Run the script:**

   ```bash
   python generate_csv_with_real_users.py
   ```

4. **Import the generated CSV** into your `game_sessions` table

### Option 3: Use the Database Function

If you prefer to use the existing database function:

```sql
-- This will create game sessions for existing dummy users
SELECT insert_dummy_game_sessions(5);
```

## File Descriptions

- `game_sessions_data.csv` - Original CSV with placeholder user IDs (needs updating)
- `get_user_ids.sql` - SQL script to retrieve actual user IDs from database
- `generate_csv_with_real_users.py` - Python script to generate CSV with real user IDs
- `insert_dummy_data.sql` - Original database function for creating dummy data

## CSV Format

The CSV should have the following columns:

- `id` - UUID for the game session
- `created_at` - ISO timestamp (e.g., "2024-01-15T10:30:00Z")
- `user_id` - UUID from auth.users table
- `score` - Game score as string
- `duration` - Game duration in seconds as string

## Troubleshooting

**Foreign Key Constraint Error:**

- Make sure you have users in your `auth.users` table
- Verify that the `user_id` values in your CSV exist in the database
- Check that users are not marked as deleted (`account_deleted` is not 'true')

**No Users Found:**

- Run the dummy users script first: `SELECT insert_dummy_users(50);`
- Or create real user accounts through your application

**Import Issues:**

- Ensure CSV format is correct (comma-separated, proper headers)
- Check that all required fields are present
- Verify data types match the table schema

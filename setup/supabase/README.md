# Supabase Setup

This folder contains all Supabase-related setup files and documentation for the project.

## Files

### Core Setup Files

- **[supabase_functions.sql](./supabase_functions.sql)**: SQL functions for user authentication and data management (refactored to use "leagues" terminology)
- **[rls_policies.sql](./rls_policies.sql)**: Row Level Security policies for database tables (refactored to use "leagues" terminology)
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**: Complete setup and deployment guide

### Mock Data (Development Only)

- **[mocks/](./mocks/)**: Folder containing dummy data scripts for development/testing
  - **[README.md](./mocks/README.md)**: Detailed documentation for mock data scripts

## Functions Included

### Production Functions

- `check_user_exists(p_email, p_username)`: Checks if a user exists by email or username
- `delete_user_data(p_user_id)`: Deletes all user data and marks account as deleted
- `is_account_deleted(p_user_id)`: Checks if a user account has been deleted
- `validate_account_status(p_email)`: Validates account status before login
- `cleanup_deleted_users(p_retention_days)`: Cron job function to permanently delete old deleted accounts

# Supabase Setup

This folder contains all Supabase-related setup files and documentation for the project.

## Files

### Core Setup Files

- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**: Complete setup and deployment guide

### Functions (Organized)

- **[functions/](./functions/)**: Folder containing individual function files
  - **[README.md](./functions/README.md)**: Documentation for all functions

### RLS Policies (Organized)

- **[rls_policies/](./rls_policies/)**: Folder containing Row Level Security policies by table
  - **[index.sql](./rls_policies/index.sql)**: Main entry point to apply all policies
  - **[game_sessions.sql](./rls_policies/game_sessions.sql)**: Policies for game_sessions table
  - **[leagues_ranking.sql](./rls_policies/leagues_ranking.sql)**: Policies for leagues_ranking table

### Mock Data (Development Only)

- **[mocks/](./mocks/)**: Folder containing dummy data scripts for development/testing
  - **[README.md](./mocks/README.md)**: Detailed documentation for mock data scripts

## Cron Jobs

The project includes 2 automated cron jobs for data maintenance:

### 1. Update League Rankings

- **Function**: `update_league_rankings()`
- **Purpose**: Updates the `leagues_ranking` table with top players per league
- **Frequency**: Recommended daily or weekly
- **Parameters**: Number of top players per league (default: 100)
- **Manual Execution**: `SELECT update_league_rankings(100);`

### 2. Cleanup Deleted Users

- **Function**: `cleanup_deleted_users()`
- **Purpose**: Removes data for users who have marked their accounts as deleted
- **Frequency**: Recommended weekly
- **Manual Execution**: `SELECT cleanup_deleted_users();`

### Setting Up Cron Jobs

To set up these cron jobs in Supabase:

1. Go to your Supabase Dashboard
2. Navigate to **Database** → **Functions**
3. Click on **Cron Jobs**
4. Add new cron jobs with the following schedules:
   - League rankings: `0 2 * * *` (daily at 2 AM)
   - User cleanup: `0 3 * * 0` (weekly on Sunday at 3 AM)

### Manual Execution

You can run these functions manually anytime in the SQL Editor:

```sql
-- Update league rankings
SELECT update_league_rankings(100);

-- Cleanup deleted users
SELECT cleanup_deleted_users();
```

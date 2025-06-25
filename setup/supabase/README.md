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

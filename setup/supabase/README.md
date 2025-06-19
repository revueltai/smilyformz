# Supabase Setup

This folder contains all Supabase-related setup files and documentation for the project.

## Files

- **[supabase_functions.sql](./supabase_functions.sql)**: SQL functions for user authentication and data management
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**: Complete setup and deployment guide

## Quick Start

1. Copy the contents of `supabase_functions.sql`
2. Paste into your Supabase Dashboard SQL Editor
3. Click "Run" to deploy the functions
4. Follow the detailed guide in `SUPABASE_SETUP.md` for testing and usage

## Functions Included

- `check_user_exists(p_email, p_username)`: Checks if a user exists by email or username

## Integration

These functions are already integrated into your `SupabaseService` class in `src/services/Supabase.service.ts`.

# Setup Guide

This guide covers the complete setup process for the Falling Shapes game, including database configuration, environment variables, and deployment instructions.

## Table of Contents

- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Deployment](#deployment)
- [Security](#security)

## Environment Setup

### Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Development overrides
VITE_APP_ENV=development
VITE_DEBUG_MODE=false
```

### Environment Variable Details

| Variable                 | Description                 | Required | Example                                |
| ------------------------ | --------------------------- | -------- | -------------------------------------- |
| `VITE_SUPABASE_URL`      | Your Supabase project URL   | Yes      | `https://your-project.supabase.co`     |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes      | `foobar1NiIsInR5cCI6IkpXVCJ9...`       |
| `VITE_APP_ENV`           | Application environment     | No       | `development`, `staging`, `production` |
| `VITE_DEBUG_MODE`        | Enable debug logging        | No       | `true`, `false`                        |

### Getting Supabase Credentials

1. **Go to your Supabase Dashboard**

   - Visit [supabase.com](https://supabase.com)
   - Sign in to your account

2. **Select your project**

   - Choose the project you want to use

3. **Get your credentials**
   - Go to **Settings** → **API**
   - Copy the **Project URL** and **anon public** key
   - Add them to your `.env` file

## Database Setup

### 1. Deploy Database Functions

Run the SQL functions in your Supabase SQL Editor:

```sql
-- Copy and paste the contents of setup/supabase/supabase_functions.sql
-- This creates all the necessary database functions
```

### 2. Deploy RLS Policies

Run the RLS policies in your Supabase SQL Editor:

```sql
-- Copy and paste the contents of setup/supabase/rls_policies.sql
-- This sets up Row Level Security for all tables
```

### 3. Verify Setup

Test the database functions:

```sql
-- Test user existence check
SELECT check_user_exists('test@example.com', NULL);

-- Test account deletion check
SELECT is_account_deleted('user-uuid-here');

-- Test account validation
SELECT validate_account_status('test@example.com');
```

## Deployment

### Vercel Deployment

1. **Connect your repository**

   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository

2. **Configure environment variables**

   - Go to **Settings** → **Environment Variables**
   - Add all required environment variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     - `VITE_APP_ENV` (optional)
     - `VITE_DEBUG_MODE` (optional)

3. **Deploy**
   - Vercel will automatically deploy on push to main branch
   - Preview deployments are created for pull requests

### Environment-Specific Configurations

#### Development

```bash
VITE_APP_ENV=development
VITE_DEBUG_MODE=true
```

#### Production

```bash
VITE_APP_ENV=production
VITE_DEBUG_MODE=false
```

## Security

### Database Security

- **Row Level Security (RLS)** is enabled on all tables
- **Database functions** use `SECURITY DEFINER` for elevated privileges
- **Account deletion** is handled server-side with proper validation

### Environment Security

- **Never commit** `.env` files to version control
- **Use different keys** for development and production
- **Rotate keys** regularly in production

### Best Practices

1. **Use HTTPS** in production
2. **Enable CORS** properly for your domain
3. **Monitor** database access logs
4. **Regular backups** of your Supabase database

## Troubleshooting

### Common Issues

#### "MissingSupabaseConfig" Error

- Check that your `.env` file exists and has the correct variables
- Verify that variable names start with `VITE_`
- Restart your development server after changing environment variables

#### Database Function Errors

- Ensure all SQL functions are deployed in Supabase
- Check that RLS policies are properly configured
- Verify user permissions in Supabase

#### Authentication Issues

- Check that your Supabase project has Auth enabled
- Verify that your API keys are correct
- Ensure your domain is allowed in Supabase Auth settings

### Getting Help

1. **Check the logs** in your browser's developer console
2. **Verify Supabase logs** in your project dashboard
3. **Test database functions** directly in Supabase SQL Editor
4. **Check environment variables** are properly set

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Vue.js Deployment Guide](https://vuejs.org/guide/best-practices/production-deployment.html)

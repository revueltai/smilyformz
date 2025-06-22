# SmilyFormz

A game where you need to match shapes and colors while avoiding hitting the wrong ones.

## Quick Start

### Prerequisites

- Node.js 18+ or Bun
- Supabase account

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd fallingshapes
   ```

2. **Install dependencies**

   ```bash
   bun install
   # or
   npm install
   ```

3. **Set up environment variables**

   ```bash
   # Copy the example environment file
   cp .env.example .env

   # Edit .env with your Supabase credentials
   # Get these from your Supabase project dashboard
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. **Set up the database**

   - Go to your Supabase project dashboard
   - Run the SQL from `setup/supabase/supabase_functions.sql`
   - Run the SQL from `setup/supabase/rls_policies.sql`

5. **Start development server**
   ```bash
   bun dev
   # or
   npm run dev
   ```

## Development

### Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

### Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

### Available Scripts

```bash
# Development
bun dev                    # Start development server
bun build                  # Build for production
bun preview                # Preview production build

# Testing
bun test:unit             # Run unit tests with Vitest
bun test:ui               # Run tests with UI

# Code Quality
bun lint                  # Lint with ESLint
bun type-check            # Type check with vue-tsc
```

## Deployment

### Environment Variables

| Variable                 | Description                 | Required |
| ------------------------ | --------------------------- | -------- |
| `VITE_SUPABASE_URL`      | Your Supabase project URL   | Yes      |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes      |
| `VITE_APP_ENV`           | Application environment     | No       |
| `VITE_DEBUG_MODE`        | Enable debug logging        | No       |

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

## Database Setup

The application requires a Supabase database with the following setup:

1. **Database Functions**: Run `setup/supabase/supabase_functions.sql`
2. **RLS Policies**: Run `setup/supabase/rls_policies.sql`
3. **Tables**: `game_sessions`, `global_ranking`

See [setup/README.md](setup/README.md) for detailed database setup instructions.

## Features

- 🎮 **Game Mechanics**: Match shapes and colors to score points
- 👤 **User Authentication**: Sign up, login, and account management
- 🏆 **Global Rankings**: Compete with players worldwide
- 🎨 **Avatar Customization**: Create your unique character
- 🌍 **Multi-language Support**: Multiple language options
- 📱 **Responsive Design**: Works on desktop and mobile
- 🔒 **Secure**: Row Level Security and server-side validation

## Architecture

- **Frontend**: Vue 3 + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Styling**: Tailwind CSS
- **Testing**: Vitest
- **Deployment**: Vercel/Netlify ready

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For setup help, see [setup/README.md](setup/README.md) for detailed instructions.

# Logistics Data Collection App

## Deployment to Vercel

### Prerequisites

1. A PostgreSQL database (you can use services like Neon, Supabase, or Vercel Postgres)
2. A Vercel account

### Environment Variables

You need to set the following environment variable in your Vercel project:

- `APP_DATABASE_URL`: PostgreSQL connection string (e.g., `postgresql://user:password@host:port/database`)

### Deployment Steps

1. **Push to GitHub**: Ensure your code is pushed to a GitHub repository

2. **Import to Vercel**: 
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**:
   - In the project settings, go to "Environment Variables"
   - Add `APP_DATABASE_URL` with your PostgreSQL connection string

4. **Deploy**:
   - Vercel will automatically build and deploy your application
   - The build command is already configured in package.json
   - The API functions are in the `/api` directory

### Database Setup

Before deploying, ensure your database is set up:

1. Create a PostgreSQL database
2. Run migrations locally against your production database:
   ```bash
   cd backend
   APP_DATABASE_URL="your-production-db-url" pnpm db:migrate
   ```

### Troubleshooting

If you encounter issues:

1. **Check Vercel Function Logs**: Go to your Vercel project dashboard > Functions tab to see logs
2. **Verify Environment Variables**: Ensure `APP_DATABASE_URL` is correctly set in Vercel
3. **Database Connectivity**: Ensure your database allows connections from Vercel's IP addresses

## Local Development

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. Run migrations:
   ```bash
   cd backend
   pnpm db:migrate
   ```

4. Start development servers:
   ```bash
   # Backend
   cd backend
   pnpm dev

   # Frontend (in another terminal)
   cd frontend
   pnpm dev
   ```

# Supabase Setup Guide

This guide will help you set up Supabase for your restaurant management system, starting with local development and then moving to production.

## 🚀 Local Development Setup

### Prerequisites
- Node.js 18+ and pnpm
- Docker Desktop running
- Supabase CLI installed

### 1. Install Dependencies
```bash
pnpm add @supabase/supabase-js
```

### 2. Initialize Supabase Project
```bash
supabase init
```

### 3. Start Local Supabase Instance
```bash
supabase start
```

This will start:
- **Database**: PostgreSQL on port 54322
- **API**: REST API on port 54321
- **Studio**: Web interface on port 54323
- **Storage**: S3-compatible storage on port 54321
- **Auth**: Authentication service on port 54321

### 4. Environment Variables
The `.env` file contains your local Supabase credentials:
```
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
JWT_SECRET=your_jwt_secret_here
```

### 5. Database Schema
The initial schema includes:
- **users**: User management with roles
- **restaurants**: Restaurant information
- **menu_items**: Menu items with categories and pricing
- **tables**: Table management with capacity and status
- **reservations**: Booking system
- **orders**: Order management
- **order_items**: Order line items

### 6. Apply Database Schema
```bash
supabase db reset
```

This will:
- Create all tables
- Set up indexes and constraints
- Insert sample data

### 7. Test the Connection
Navigate to: `http://localhost:8080/supabase-test`

This page will:
- Test the Supabase connection
- Display sample users and menu items
- Verify the database schema is working

## 🌐 Production Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and API keys

### 2. Update Environment Variables
Create a `.env.production` file:
```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
```

### 3. Push Schema to Production
```bash
supabase link --project-ref your-project-ref
supabase db push
```

### 4. Update Row Level Security (RLS)
Enable RLS policies for production security:
```sql
-- Example RLS policy for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);
```

## 🔧 Development Workflow

### Starting Development
```bash
# Terminal 1: Start Supabase
supabase start

# Terminal 2: Start React app
npm run dev
```

### Database Changes
1. Create new migration: `supabase migration new migration_name`
2. Edit the SQL file in `supabase/migrations/`
3. Apply: `supabase db reset` (local) or `supabase db push` (production)

### Viewing Data
- **Supabase Studio**: http://localhost:54323
- **Database**: Connect with any PostgreSQL client to localhost:54322

## 📁 Project Structure

```
spark-landing/
├── supabase/
│   ├── config.toml          # Supabase configuration
│   ├── migrations/          # Database migrations
│   └── seed.sql            # Sample data
├── client/
│   ├── lib/
│   │   └── supabase.ts     # Supabase client configuration
│   └── pages/
│       └── SupabaseTest.tsx # Test page for connection
└── .env                     # Environment variables
```

## 🧪 Testing

### Test Page
Visit `/supabase-test` to verify:
- ✅ Database connection
- ✅ Sample data loading
- ✅ Schema validation

### API Testing
Test your Supabase API endpoints:
```bash
curl "http://127.0.0.1:54321/rest/v1/users" \
  -H "apikey: your_anon_key" \
  -H "Authorization: Bearer your_anon_key"
```

## 🚨 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   supabase stop --project-id your-project-id
   supabase start
   ```

2. **Database Connection Failed**
   - Check if Docker is running
   - Verify ports aren't blocked
   - Check `.env` file configuration

3. **Migration Errors**
   ```bash
   supabase db reset --debug
   ```

4. **TypeScript Errors**
   ```bash
   npm run typecheck
   ```

### Useful Commands
```bash
# View logs
supabase logs

# Stop services
supabase stop

# Reset database
supabase db reset

# Generate types (when available)
supabase gen types typescript --local > types.ts
```

## 🔐 Security Notes

- Never commit `.env` files to version control
- Use environment variables for sensitive data
- Enable RLS policies in production
- Regularly rotate API keys

## 📚 Next Steps

1. **Authentication**: Implement user signup/login
2. **Real-time**: Add real-time subscriptions for live updates
3. **Storage**: Set up file uploads for menu images
4. **Edge Functions**: Create serverless functions for complex logic
5. **Monitoring**: Set up logging and performance monitoring

## 🆘 Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)

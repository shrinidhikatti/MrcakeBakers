# PostgreSQL Setup Guide for MrCakeBakers

## Why PostgreSQL?

SQLite is great for development but not suitable for production. PostgreSQL offers:
- Better concurrency handling
- ACID compliance
- Advanced features (JSON, full-text search)
- Better scalability
- Production-ready performance

## Setup Instructions

### Option 1: Local PostgreSQL Installation

#### macOS (using Homebrew)
```bash
# Install PostgreSQL
brew install postgresql@16

# Start PostgreSQL service
brew services start postgresql@16

# Create database
createdb mrcake_production
```

#### Ubuntu/Debian
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database
sudo -u postgres createdb mrcake_production
sudo -u postgres psql -c "CREATE USER mrcake WITH PASSWORD 'your_secure_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE mrcake_production TO mrcake;"
```

### Option 2: Cloud PostgreSQL (Recommended for Production)

#### Neon (Free tier available)
1. Visit https://neon.tech
2. Create a new project
3. Copy the connection string

#### Supabase (Free tier available)
1. Visit https://supabase.com
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string

#### Railway (Free tier available)
1. Visit https://railway.app
2. Create new project > Add PostgreSQL
3. Copy the connection string

#### Render (Free tier available)
1. Visit https://render.com
2. New > PostgreSQL
3. Copy the internal/external connection string

## Database Migration

### 1. Update Environment Variables

Create or update `.env` file:

```env
# For local PostgreSQL
DATABASE_URL="postgresql://username:password@localhost:5432/mrcake_production"

# For cloud PostgreSQL (example from Neon)
DATABASE_URL="postgresql://user:password@ep-cool-name.region.aws.neon.tech/mrcake?sslmode=require"
```

### 2. Update Prisma Schema

The schema has already been updated to use PostgreSQL:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 3. Run Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Create and run migrations
npx prisma migrate dev --name init_postgresql

# Seed the database (optional)
npx prisma db seed
```

### 4. Verify Connection

```bash
# Open Prisma Studio to verify
npx prisma studio
```

## Data Migration from SQLite

If you have existing SQLite data to migrate:

### Option A: Manual Export/Import

```bash
# Export SQLite data
sqlite3 prisma/dev.db .dump > backup.sql

# Convert and import to PostgreSQL
# (You may need to manually adjust SQL syntax)
psql -U username -d mrcake_production -f backup.sql
```

### Option B: Using Prisma (Recommended)

1. Keep SQLite config temporarily
2. Export data using a script:

```typescript
// scripts/migrate-data.ts
import { PrismaClient as SqlitePrisma } from '@prisma/client';
import { PrismaClient as PostgresPrisma } from '@prisma/client';

const sqlite = new SqlitePrisma({
  datasources: { db: { url: 'file:./dev.db' } }
});

const postgres = new PostgresPrisma({
  datasources: { db: { url: process.env.DATABASE_URL } }
});

async function migrateData() {
  // Migrate users
  const users = await sqlite.user.findMany();
  for (const user of users) {
    await postgres.user.create({ data: user });
  }

  // Repeat for other models...
  console.log('Migration complete!');
}

migrateData();
```

3. Run the migration script
4. Switch to PostgreSQL config

## Environment-Specific Configuration

### Development
```env
DATABASE_URL="postgresql://localhost/mrcake_dev"
```

### Staging
```env
DATABASE_URL="postgresql://user:pass@staging-db.example.com/mrcake_staging"
```

### Production
```env
DATABASE_URL="postgresql://user:pass@prod-db.example.com/mrcake_prod?sslmode=require"
```

## Security Best Practices

1. **Use SSL/TLS** - Always add `?sslmode=require` to production URLs
2. **Strong Passwords** - Use generated passwords, not simple ones
3. **Limit Connections** - Configure connection pooling
4. **Regular Backups** - Set up automated backups
5. **Monitor Performance** - Use database monitoring tools

## Connection Pooling

For production, add Prisma connection pool configuration:

```env
# Recommended for serverless environments
DATABASE_URL="postgresql://...?connection_limit=5&pool_timeout=10"
```

Update `schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")

  // For production
  connection_limit = 10
}
```

## Troubleshooting

### Connection Issues
```bash
# Test connection
psql $DATABASE_URL

# Check if PostgreSQL is running
pg_isready
```

### Migration Errors
```bash
# Reset database (CAUTION: Deletes all data)
npx prisma migrate reset

# Force push schema (for prototyping)
npx prisma db push --force-reset
```

### Performance Issues
```sql
-- Check slow queries
SELECT * FROM pg_stat_statements ORDER BY total_exec_time DESC LIMIT 10;

-- Add indexes if needed
CREATE INDEX idx_orders_user_id ON "Order"("userId");
CREATE INDEX idx_products_category_id ON "Product"("categoryId");
```

## Production Checklist

- [ ] PostgreSQL database created
- [ ] Connection string added to environment variables
- [ ] SSL/TLS enabled
- [ ] Migrations run successfully
- [ ] Seed data added (if needed)
- [ ] Connection pooling configured
- [ ] Backups configured
- [ ] Monitoring set up
- [ ] Performance tested

## Support

For issues:
1. Check Prisma docs: https://www.prisma.io/docs
2. PostgreSQL docs: https://www.postgresql.org/docs/
3. GitHub Issues: Create an issue in the repository

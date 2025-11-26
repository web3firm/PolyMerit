# PolyMerit Deployment Guide

This guide walks you through deploying PolyMerit to production on various platforms.

## Table of Contents
- [Vercel Deployment](#vercel-deployment-recommended)
- [Docker Deployment](#docker-deployment)
- [Manual Server Deployment](#manual-server-deployment)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Post-Deployment](#post-deployment)

---

## Vercel Deployment (Recommended)

Vercel is the easiest way to deploy PolyMerit, with zero configuration needed.

### Prerequisites
- GitHub/GitLab/Bitbucket account
- Vercel account (free tier available)
- PostgreSQL database (Neon, Supabase, or Railway)

### Steps

1. **Push Code to Git**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   In Vercel dashboard, add these variables:
   ```
   DATABASE_URL=your_postgresql_url
   NEXT_PUBLIC_BUILDER_ADDRESS=your_address (optional)
   POLYMARKET_API_KEY=your_key (optional)
   POLYMARKET_SECRET=your_secret (optional)
   POLYMARKET_PASSPHRASE=your_passphrase (optional)
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - Your site will be live at `your-project.vercel.app`

### Custom Domain
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

---

## Docker Deployment

Deploy PolyMerit using Docker for full control.

### Dockerfile

Create `Dockerfile` in project root:
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build application
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXT_PUBLIC_BUILDER_ADDRESS=${NEXT_PUBLIC_BUILDER_ADDRESS}
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=polymerit
      - POSTGRES_PASSWORD=your_secure_password
      - POSTGRES_DB=polymerit
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

volumes:
  postgres_data:
```

### Deploy

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop
docker-compose down
```

---

## Manual Server Deployment

Deploy to any VPS (DigitalOcean, Linode, AWS EC2, etc.)

### Requirements
- Ubuntu 22.04+ or similar
- Node.js 18+
- PostgreSQL 14+
- Nginx (recommended)
- PM2 (process manager)

### Step-by-Step

1. **Install Dependencies**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs

   # Install PostgreSQL
   sudo apt install -y postgresql postgresql-contrib

   # Install PM2
   sudo npm install -g pm2

   # Install Nginx
   sudo apt install -y nginx
   ```

2. **Setup Database**
   ```bash
   sudo -u postgres psql
   ```
   ```sql
   CREATE DATABASE polymerit;
   CREATE USER polymerit WITH ENCRYPTED PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE polymerit TO polymerit;
   \q
   ```

3. **Clone and Setup Project**
   ```bash
   cd /var/www
   git clone https://github.com/web3firm/PolyMerit.git
   cd PolyMerit

   # Install dependencies
   npm install

   # Setup environment
   cp .env.example .env
   nano .env  # Edit with your values

   # Generate Prisma Client
   npx prisma generate
   npx prisma db push

   # Build application
   npm run build
   ```

4. **Start with PM2**
   ```bash
   pm2 start npm --name "polymerit" -- start
   pm2 save
   pm2 startup  # Follow instructions
   ```

5. **Configure Nginx**
   Create `/etc/nginx/sites-available/polymerit`:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

   Enable site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/polymerit /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

6. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

## Environment Variables

### Required

```env
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
```

### Optional (for Builder/Affiliate features)

```env
NEXT_PUBLIC_BUILDER_ADDRESS="0x..."
POLYMARKET_API_KEY="..."
POLYMARKET_SECRET="..."
POLYMARKET_PASSPHRASE="..."
```

### Production Recommendations

```env
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

---

## Database Setup

### Neon (Recommended - Free Tier)

1. Go to [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Add to `DATABASE_URL`

### Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings → Database
4. Use "Connection pooling" for production

### Railway

1. Go to [railway.app](https://railway.app)
2. Create new project → Add PostgreSQL
3. Copy `DATABASE_URL` from variables

### Run Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Or use migrations
npx prisma migrate deploy
```

---

## Post-Deployment

### Health Checks

Visit these URLs to verify deployment:
- `https://your-domain.com` - Homepage
- `https://your-domain.com/scanner` - Market scanner
- `https://your-domain.com/api/markets` - API test

### Monitoring

#### PM2 Dashboard
```bash
pm2 monit
pm2 logs polymerit
```

#### Vercel Analytics
Automatically included in Vercel deployments

### Performance Optimization

1. **Enable caching in Nginx**
   ```nginx
   location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
   }
   ```

2. **Enable compression**
   Already enabled in Next.js build

3. **Database connection pooling**
   Use connection pooling in production:
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/db?pgbouncer=true&connection_limit=10"
   ```

### Backup Strategy

#### Database Backups
```bash
# Manual backup
pg_dump -U polymerit polymerit > backup_$(date +%Y%m%d).sql

# Restore
psql -U polymerit polymerit < backup_20241125.sql
```

#### Automated Backups (Cron)
```bash
crontab -e
```
Add:
```
0 2 * * * pg_dump -U polymerit polymerit > /backups/polymerit_$(date +\%Y\%m\%d).sql
```

---

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection Issues
```bash
# Test connection
npx prisma db pull

# Regenerate client
npx prisma generate
```

### Port Already in Use
```bash
# Find process
lsof -i :3000

# Kill process
kill -9 PID
```

---

## Scaling

### Horizontal Scaling
- Deploy to multiple Vercel regions (automatic)
- Use load balancer for manual deployments

### Database Scaling
- Enable connection pooling
- Use read replicas for heavy read workloads
- Consider managed database services

### CDN
- Vercel automatically uses edge network
- For manual deployments, use Cloudflare or AWS CloudFront

---

## Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Database password strong
- [ ] CORS configured properly
- [ ] Rate limiting enabled (via Vercel or Nginx)
- [ ] Regular security updates
- [ ] Monitoring and logging enabled

---

## Support

For deployment issues:
- GitHub Issues: [github.com/web3firm/PolyMerit/issues](https://github.com/web3firm/PolyMerit/issues)
- Email: support@polymerit.app
- Discord: [Join our community](https://discord.gg/polymerit)

---

**Happy Deploying! 🚀**

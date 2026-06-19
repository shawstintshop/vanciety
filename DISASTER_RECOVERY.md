# Vanciety — Disaster Recovery & Backup Plan

**Purpose**: Ensure zero-downtime recovery for Vanciety with thousands of active members.

---

## 1. Pre-Deployment Protection

### Automated Tests Before Every Deploy

Create `.github/workflows/pre-deploy-checks.yml`:

```yaml
name: Pre-Deploy Checks

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 10
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm run lint
      - run: pnpm run typecheck
      - run: pnpm run build
      - run: pnpm run test
      
  smoke-test:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 10
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm run build
      - name: Start server and test
        run: |
          npx serve dist -l 3000 &
          sleep 5
          curl -f http://localhost:3000 || exit 1
          curl -s http://localhost:3000 | grep -q "Vanciety" || exit 1
```

**Prevents**: White-page bugs, build failures, broken imports from reaching production.

---

## 2. Git-Based Rollback System

### Tag Every Production Deploy

Add to deployment script:

```bash
#!/bin/bash
# deploy-production.sh

set -e

# Get current commit
COMMIT=$(git rev-parse --short HEAD)
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
TAG="prod-${TIMESTAMP}-${COMMIT}"

# Tag this deploy
git tag -a "$TAG" -m "Production deploy: $TIMESTAMP"
git push origin "$TAG"

# Deploy to Vercel
vercel --prod --yes

echo "✅ Deployed and tagged: $TAG"
echo "To rollback: git checkout $TAG && vercel --prod --yes"
```

### One-Command Rollback

```bash
# List recent production tags
git tag -l "prod-*" | tail -10

# Rollback to specific tag
git checkout prod-20260620-010500-4e545d0
vercel --prod --yes
```

**Recovery time**: < 2 minutes

---

## 3. Vercel Deployment Protection

### Enable Vercel Production Protection

1. Go to Vercel project settings → Deployment Protection
2. Enable "Production Branch Protection"
3. Require passing checks before production deploy
4. Enable "Skew Protection" (prevents old clients from breaking)

### Vercel Instant Rollback

Vercel keeps all deployments. Rollback via dashboard:

1. Go to: https://vercel.com/shaws-projects-76e5aff9/primary-app/deployments
2. Click on last known-good deployment
3. Click "Promote to Production"

**Recovery time**: 30 seconds (no rebuild required)

---

## 4. Database Backups (Supabase)

### Automated Daily Backups

Supabase Pro includes:
- Daily automated backups (7-day retention on Free, 30-day on Pro)
- Point-in-time recovery (Pro only)
- Manual backups on demand

### Manual Backup Before Major Changes

```bash
# Install Supabase CLI if not already
brew install supabase/tap/supabase

# Login
supabase login

# Link to project
cd /Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app
supabase link --project-ref vfrxntxjigtgutevijmb

# Create manual backup (Pro only)
# For Free tier: export critical tables manually
supabase db dump --data-only -f backups/vanciety-$(date +%Y%m%d).sql

# Backup user data specifically
psql $DATABASE_URL -c "COPY (SELECT * FROM auth.users) TO STDOUT" > backups/users-$(date +%Y%m%d).csv
```

### Critical Tables to Monitor

- `auth.users` — User accounts
- `locations` — Map data
- `youtube_videos` — Video library
- `forum_posts` — Community content
- `marketplace_items` — Listings
- `user_locations` — GPS data
- `gps_sharing_settings` — Privacy settings

### Weekly Backup Script

Create `scripts/backup-database.sh`:

```bash
#!/bin/bash
set -e

BACKUP_DIR="/Volumes/AI-DATA/PROJECTS/VANCIETY/backups/database"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

mkdir -p "$BACKUP_DIR"

# Export critical tables
supabase db dump --data-only -f "$BACKUP_DIR/full-$TIMESTAMP.sql"

# Compress
gzip "$BACKUP_DIR/full-$TIMESTAMP.sql"

# Keep last 30 days
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +30 -delete

echo "✅ Backup complete: $BACKUP_DIR/full-$TIMESTAMP.sql.gz"
```

Run weekly via cron or Hermes scheduled job.

---

## 5. Multi-Region Redundancy

### Deploy to Multiple Vercel Regions

Vercel auto-deploys to edge regions, but for critical redundancy:

1. **Primary**: `primaryapp.vercel.app` (current)
2. **Backup domain**: Deploy same repo to `vanciety-backup.vercel.app`
3. **DNS failover**: Use Cloudflare DNS with health checks

### Cloudflare DNS Failover

If primaryapp.vercel.app goes down, auto-switch to backup:

1. Add both deployments to Cloudflare DNS
2. Enable Load Balancing with health checks
3. Set primary as default, backup as failover

**Cost**: Cloudflare Pro ($20/mo) or Business ($200/mo)

---

## 6. Monitoring & Alerts

### Vercel Monitoring (Built-in)

Enable in Vercel dashboard:
- Real User Monitoring (RUM)
- Error tracking
- Performance vitals
- Uptime monitoring

### External Uptime Monitoring

Use UptimeRobot (free tier):
- Monitor: `https://primaryapp.vercel.app`
- Check interval: 5 minutes
- Alert channels: Email + SMS to 253-318-1658

Setup:
1. Go to https://uptimerobot.com
2. Add HTTP(s) monitor for primaryapp.vercel.app
3. Set alert contacts
4. Enable "Check for keyword: Vanciety" (detects white-page)

### Supabase Monitoring

Monitor database health:
- Supabase Dashboard → Reports
- Enable email alerts for:
  - High CPU usage
  - Database connection errors
  - Storage approaching limits

---

## 7. Code Quality Guards

### Pre-Commit Hooks

Install Husky to prevent bad commits:

```bash
cd /Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app
pnpm add -D husky lint-staged

# Initialize husky
npx husky init

# Add pre-commit hook
cat > .husky/pre-commit << 'EOF'
#!/bin/sh
pnpm run lint
pnpm run typecheck
EOF

chmod +x .husky/pre-commit
```

### TypeScript Strict Mode

Enable in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true
  }
}
```

**Prevents**: Runtime errors like the BrowserRouter/useNavigate bug.

---

## 8. Emergency Rollback Playbook

### If Production Goes Down

**Step 1**: Immediate rollback via Vercel dashboard (30 seconds)
- Go to: https://vercel.com/shaws-projects-76e5aff9/primary-app/deployments
- Find last known-good deployment
- Click "Promote to Production"

**Step 2**: If Vercel dashboard is down, use CLI:

```bash
# Get last good deployment
vercel ls --prod | head -5

# Rollback to specific deployment ID
vercel rollback <deployment-url> --prod
```

**Step 3**: If entire Vercel is down, deploy to backup:

```bash
# Deploy to Netlify as emergency backup
npx netlify deploy --prod --dir=dist
```

**Step 4**: Notify users via:
- Status page update
- Twitter/X post
- Email to members (if implemented)

---

## 9. Backup Deployment Targets

### Configure Netlify as Backup

Create `netlify.toml`:

```toml
[build]
  command = "pnpm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "22"
```

### Emergency Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Link site
netlify link

# Deploy
netlify deploy --prod
```

**Recovery time**: < 5 minutes

---

## 10. Database Recovery Procedures

### Restore from Backup

```bash
# Restore full database
psql $DATABASE_URL < backups/vanciety-20260619.sql

# Restore specific table
psql $DATABASE_URL -c "COPY locations FROM STDIN" < backups/locations-20260619.csv
```

### Point-in-Time Recovery (Supabase Pro)

Via Supabase dashboard:
1. Go to Database → Backups
2. Select restore point
3. Create new project from backup
4. Update DNS to point to new project

**Recovery time**: 15-30 minutes

---

## 11. Monthly Disaster Recovery Test

**Schedule**: First Monday of every month

**Test procedure**:

1. Create test deployment
2. Trigger intentional failure
3. Execute rollback procedure
4. Measure recovery time
5. Document any issues
6. Update this playbook

**Goal**: Rollback in < 5 minutes, zero data loss

---

## 12. Contact Information

**Emergency contacts**:
- SHAW: 253-318-1658 (Telegram)
- Vercel Support: support@vercel.com
- Supabase Support: support@supabase.io

**Critical URLs**:
- Production: https://primaryapp.vercel.app
- Vercel Dashboard: https://vercel.com/shaws-projects-76e5aff9/primary-app
- Supabase Dashboard: https://supabase.com/dashboard/project/vfrxntxjigtgutevijmb
- GitHub Repo: https://github.com/shawstintshop/vanciety

---

## Summary

**Prevention**:
- ✅ Pre-deploy checks (lint, build, typecheck)
- ✅ Git tags for every production deploy
- ✅ TypeScript strict mode
- ✅ Pre-commit hooks

**Recovery**:
- ✅ 30-second Vercel rollback
- ✅ Git-based rollback (2 minutes)
- ✅ Netlify backup deployment (5 minutes)
- ✅ Database backups (daily automated + weekly manual)

**Monitoring**:
- ✅ Vercel built-in monitoring
- ✅ UptimeRobot external checks
- ✅ Supabase health alerts
- ✅ Email + SMS notifications

**Target**: 99.9% uptime, < 5 minute recovery time, zero data loss.

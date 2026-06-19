# Vanciety — Quick Reference

## Emergency Rollback (Production Down)

**Fastest (30 seconds):**
1. Go to: https://vercel.com/shaws-projects-76e5aff9/primary-app/deployments
2. Click last known-good deployment
3. Click "Promote to Production"

**Via CLI (2 minutes):**
```bash
# List recent tags
git tag -l "prod-*" | tail -5

# Rollback
git checkout prod-YYYYMMDD-HHMMSS-<commit>
vercel --prod --yes
```

---

## Safe Production Deploy

```bash
cd /Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app
./scripts/deploy-production.sh
```

This script:
- ✅ Checks working directory is clean
- ✅ Runs lint + typecheck + build
- ✅ Tags deployment with timestamp
- ✅ Deploys to Vercel
- ✅ Prints rollback command

---

## Database Backup

**Manual backup:**
```bash
./scripts/backup-database.sh
```

**Automatic:** Every Monday 2am via Hermes cron (SMS notification)

**Restore:**
```bash
cd /Volumes/AI-DATA/PROJECTS/VANCITY/backups/database
gunzip < vanciety-data-YYYYMMDD-HHMMSS.sql.gz | psql $DATABASE_URL
```

---

## Key URLs

- **Production**: https://primaryapp.vercel.app
- **Vercel Dashboard**: https://vercel.com/shaws-projects-76e5aff9/primary-app
- **Supabase Dashboard**: https://supabase.com/dashboard/project/vfrxntxjigtgutevijmb
- **GitHub**: https://github.com/shawstintshop/vanciety

---

## Commands

```bash
# Local dev
npm run dev -- --port 8080

# Build check
npm run build

# Lint check
npm run lint

# Safe production deploy
./scripts/deploy-production.sh

# Database backup
./scripts/backup-database.sh

# List production tags
git tag -l "prod-*" | tail -10
```

---

See **DISASTER_RECOVERY.md** for complete procedures.

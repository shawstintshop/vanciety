#!/bin/bash
# Weekly database backup script

set -e

BACKUP_DIR="/Volumes/AI-DATA/PROJECTS/VANCITY/backups/database"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

echo "💾 Vanciety Database Backup"
echo "==========================="

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
  echo "❌ Supabase CLI not installed. Install with: brew install supabase/tap/supabase"
  exit 1
fi

# Ensure we're linked to the project
cd /Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app

if [ ! -f .supabase/config.toml ]; then
  echo "⚠️  Not linked to Supabase project. Run: supabase link --project-ref vfrxntxjigtgutevijmb"
  exit 1
fi

# Export database schema and data
echo "📤 Exporting database..."
supabase db dump --data-only -f "$BACKUP_DIR/vanciety-data-$TIMESTAMP.sql"
supabase db dump --schema -f "$BACKUP_DIR/vanciety-schema-$TIMESTAMP.sql"

# Compress backups
echo "🗜️  Compressing backups..."
gzip "$BACKUP_DIR/vanciety-data-$TIMESTAMP.sql"
gzip "$BACKUP_DIR/vanciety-schema-$TIMESTAMP.sql"

# Calculate sizes
DATA_SIZE=$(du -h "$BACKUP_DIR/vanciety-data-$TIMESTAMP.sql.gz" | cut -f1)
SCHEMA_SIZE=$(du -h "$BACKUP_DIR/vanciety-schema-$TIMESTAMP.sql.gz" | cut -f1)

# Clean up old backups (keep last 30 days)
echo "🧹 Cleaning up old backups..."
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +30 -delete

echo ""
echo "✅ Backup complete!"
echo "   Data: $BACKUP_DIR/vanciety-data-$TIMESTAMP.sql.gz ($DATA_SIZE)"
echo "   Schema: $BACKUP_DIR/vanciety-schema-$TIMESTAMP.sql.gz ($SCHEMA_SIZE)"
echo ""
echo "To restore:"
echo "   gunzip < $BACKUP_DIR/vanciety-data-$TIMESTAMP.sql.gz | psql \$DATABASE_URL"

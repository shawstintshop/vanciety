#!/usr/bin/env bash
set -euo pipefail
cd /Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app
LOG=/tmp/vanciety_vercel_deploy.log

load_env() {
  local file="$1"
  [ -f "$file" ] || return 0
  while IFS= read -r line || [ -n "$line" ]; do
    [[ "$line" =~ ^[[:space:]]*$ ]] && continue
    [[ "$line" =~ ^[[:space:]]*# ]] && continue
    [[ "$line" != *=* ]] && continue
    local key="${line%%=*}"
    local val="${line#*=}"
    val="${val%\"}"; val="${val#\"}"; val="${val%\'}"; val="${val#\'}"
    export "$key=$val"
  done < "$file"
}

load_env .env

{
  echo '=== Vanciety Vercel deploy ==='
  date
  echo 'Project root: /Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app'
  echo 'Target Vercel project: vanciety'
  echo

  if ! npx --yes vercel@latest whoami >/dev/null 2>&1; then
    echo 'Vercel CLI is not logged in. Follow the login prompt/link.'
    npx --yes vercel@latest login
  fi

  echo 'Deploying current local Vite app to Vercel production...'
  npx --yes vercel@latest deploy \
    --prod \
    --yes \
    --project vanciety \
    --build-env VITE_SUPABASE_URL="$VITE_SUPABASE_URL" \
    --build-env VITE_SUPABASE_ANON_KEY="$VITE_SUPABASE_ANON_KEY"

  echo
  echo 'VERCEL_DEPLOY_COMPLETE'
} 2>&1 | tee "$LOG"

echo
echo "Log saved to $LOG"
echo 'Leave this Terminal open. Travis will inspect the deploy URL and verify routes.'
read -r -p 'Press Enter to close after Travis says verification is done... '

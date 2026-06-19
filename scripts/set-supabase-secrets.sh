#!/usr/bin/env bash
set -euo pipefail
cd /Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app

echo 'Vanciety Supabase secret setup'
echo 'Values are hidden while typing and are not written to project docs.'
read -r -s -p 'ANTHROPIC_API_KEY: ' ANTHROPIC_API_KEY
echo
read -r -s -p 'YOUTUBE_API_KEY: ' YOUTUBE_API_KEY
echo

supabase secrets set \
  ANTHROPIC_API_KEY="$ANTHROPIC_API_KEY" \
  YOUTUBE_API_KEY="$YOUTUBE_API_KEY" \
  --project-ref vfrxntxjigtgutevijmb

unset ANTHROPIC_API_KEY YOUTUBE_API_KEY

echo
echo 'Secret names now configured:'
supabase secrets list --project-ref vfrxntxjigtgutevijmb

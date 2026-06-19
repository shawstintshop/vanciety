# Vanciety Supabase Secret Setup

Use this only when you have the provider keys ready. Do not paste keys into Telegram or project docs.

## Required secrets

- `ANTHROPIC_API_KEY` — enables `vanciety-ai-concierge`
- `YOUTUBE_API_KEY` — enables `fetch-youtube-videos`

## Safe interactive setup

Run:

```bash
cd /Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app
chmod 700 scripts/set-supabase-secrets.sh
scripts/set-supabase-secrets.sh
```

The script prompts for values with hidden input, sets Supabase Edge Function secrets on project `vfrxntxjigtgutevijmb`, unsets local shell variables, and prints secret names only.

## Manual command pattern

If setting manually, do not print the values:

```bash
read -r -s -p 'ANTHROPIC_API_KEY: ' ANTHROPIC_API_KEY; echo
read -r -s -p 'YOUTUBE_API_KEY: ' YOUTUBE_API_KEY; echo
supabase secrets set \
  ANTHROPIC_API_KEY="$ANTHROPIC_API_KEY" \
  YOUTUBE_API_KEY="$YOUTUBE_API_KEY" \
  --project-ref vfrxntxjigtgutevijmb
unset ANTHROPIC_API_KEY YOUTUBE_API_KEY
```

Verify secret names only:

```bash
supabase secrets list --project-ref vfrxntxjigtgutevijmb
```

Do not print secret values. Do not commit `.env` files.

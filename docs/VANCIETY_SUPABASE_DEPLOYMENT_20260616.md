# Vanciety Supabase Deployment — 2026-06-16

## Result

Vanciety Supabase backend deployment completed for the safe production path.

## Project

- Supabase project: Vanciety
- Project ref: `vfrxntxjigtgutevijmb`
- Region: us-east-1

## Backups

- `/Users/darrinshaw/Hermes-Backups/Vanciety-supabase-before-live-deploy-20260616-115943.tar.gz`

## Edge Functions Deployed

| Function | Status | Notes |
|---|---:|---|
| `fetch-youtube-videos` | ACTIVE | JWT required |
| `vanciety-ai-concierge` | ACTIVE | JWT required |

Unauthenticated function probes returned `401`, confirming JWT enforcement.

## Schema Migration Applied

Applied one safe migration from temp deploy folder:

- `/tmp/vanciety_safe_deploy/supabase/migrations/20260616220000_vanciety_safe_production_schema.sql`

The normal app migration folder was not pushed because dry-run showed it would apply 19 historical migrations, including fake/demo seed migrations and the old unsafe public/exact GPS migration.

## Tables Verified Present

Service-role REST checks returned HTTP 200 for:

- `locations`
- `forum_posts`
- `forum_replies`
- `marketplace_items`
- `youtube_videos`
- `user_locations`
- `van_locations`
- `gps_sharing_settings`

Verified public content seeded after schema deployment:

- `locations`: 5 verified source/location anchors
- `youtube_videos`: 13 verified YouTube/video anchors
- `forum_posts`: 0 rows intentionally; no fake forum activity inserted
- `marketplace_items`: 0 rows intentionally; no fake listings inserted

Seed script:

- `scripts/seed-verified-supabase.ts`
- npm command: `npm run supabase:seed-verified`

## RLS / Privacy Verification

Anonymous write probes were blocked with RLS errors for:

- `van_locations`
- `gps_sharing_settings`
- `user_locations`
- `youtube_videos`

Friend Finder live location model:

- member-only read policy on `van_locations`
- default visibility: `friends_only`
- default precision: `approximate`
- `upsert_van_location()` forces rounded area coordinates
- speed, heading, and accuracy are stripped before storage
- anonymous writes blocked

## Local App Verification

Commands run from `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app`:

```bash
npm run build
npm run lint
npm run dev -- --host 127.0.0.1 --port 5173
```

Results:

- Build: pass
- Lint: pass with 13 existing warnings, 0 errors
- Local server: `http://127.0.0.1:5173/`

Routes verified HTTP 200:

- `/`
- `/map`
- `/forum`
- `/marketplace`
- `/videos`
- `/friend-finder`
- `/gps`
- `/ai`

## Remaining Blockers

- `ANTHROPIC_API_KEY` is not set as a Supabase Edge Function secret, so AI Concierge will return configured/unavailable until the server-side key is added. Safe helper: `npm run supabase:set-secrets`.
- `YOUTUBE_API_KEY` is not set as a Supabase Edge Function secret, so YouTube sync will not fetch live videos until the server-side key is added. Safe helper: `npm run supabase:set-secrets`.
- Public domain/DNS deployment still needs final hosting/domain configuration.
- Supabase CLI warns local `supabase/config.toml` auth settings differ from the linked project. This was not changed during this deployment.

## Security Notes

- No API keys, database passwords, or service-role key values were written into this report.
- The database password was entered only into local Terminal prompts.
- Historical unsafe migrations were intentionally not pushed.

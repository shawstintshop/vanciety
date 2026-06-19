# Vanciety Primary App — Project Status

App root: `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app`
Supabase project: `Vanciety` / `vfrxntxjigtgutevijmb`
Last verified: 2026-06-16

## Current State

Vanciety local app and Supabase backend are connected and operational for the safe production path.

## Completed Backend Work — 2026-06-16

- Supabase CLI login verified.
- Vanciety project access verified.
- Edge Functions deployed:
  - `fetch-youtube-videos`
  - `vanciety-ai-concierge`
- Both functions are ACTIVE and reject unauthenticated calls with HTTP 401.
- Safe production schema migration applied from temp deploy folder:
  - `/tmp/vanciety_safe_deploy/supabase/migrations/20260616220000_vanciety_safe_production_schema.sql`
- Historical local migrations were intentionally not pushed because dry-run showed fake/demo seed migrations and the old unsafe public/exact GPS migration.
- Live Supabase tables verified present:
  - `locations`
  - `forum_posts`
  - `forum_replies`
  - `marketplace_items`
  - `youtube_videos`
  - `user_locations`
  - `van_locations`
  - `gps_sharing_settings`
- Verified public seed content inserted:
  - `locations`: 5 verified source/location anchors
  - `youtube_videos`: 13 verified videos
  - `forum_posts`: 0 rows intentionally; no fake forum activity
  - `marketplace_items`: 0 rows intentionally; no fake listings
- Anonymous writes blocked by RLS for GPS/location/video write paths.

## Friend Finder Security State

- Default location visibility: `friends_only`
- Default precision: `approximate`
- `upsert_van_location()` forces rounded area coordinates
- Speed, heading, and accuracy are stripped before storage
- Anonymous writes blocked
- Public exact GPS path not deployed

## Local Verification

Commands:

```bash
npm run build
npm run lint
npm run dev -- --host 127.0.0.1 --port 5173
```

Results:

- Build: passed
- Lint: passed with 0 errors / 13 existing warnings
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

## Useful Commands

```bash
npm run supabase:seed-verified
npm run supabase:set-secrets
```

## Remaining Blockers

1. Supabase Edge Function secrets still needed:
   - `ANTHROPIC_API_KEY`
   - `YOUTUBE_API_KEY`
2. Public hosting/domain/DNS still needs final configuration for `vanciety.com`.
3. Supabase local `config.toml` auth settings differ from remote auth settings; this was not changed during the safe deploy.
4. Forum and marketplace remain empty until real users/content are added.

## Detailed Report

See:

`docs/VANCIETY_SUPABASE_DEPLOYMENT_20260616.md`

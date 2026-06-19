# Vanciety — Security Checklist

Updated: 2026-06-15 23:56:36

## Detected security surfaces

- Auth: Supabase Auth via `src/contexts/AuthContext.tsx`
- Database: Supabase/Postgres with RLS migrations
- Location privacy: Friend Finder / GPS / legacy member locations
- Edge Functions: YouTube ingestion, AI Concierge
- AI: Anthropic via server-side Edge Function only
- Payments: None verified
- Storage/uploads: Not implemented in local migrations
- Analytics: Not implemented in local migrations

## Phase 3B security status

| Surface | Status |
|---|---|
| Dirty work preserved outside repo | DONE |
| `.env` / `.env.local` ignored | PASS |
| Supabase client env-driven | PASS |
| Friend Finder direct exact/public GPS | STATIC FIX PREPARED |
| Legacy `user_locations` exact-public exposure | STATIC FIX PREPARED |
| YouTube public content direct writes | STATIC FIX PREPARED |
| Edge Function JWT config | STATIC FIX PREPARED |
| Local Supabase DB lint/reset | BLOCKED — Docker/local DB unavailable |
| Live RLS verification | BLOCKED |
| Production launch | BLOCKED |

## Blockers

- Supabase migrations are prepared but not applied locally/live.
- Docker daemon is not running, so local Supabase cannot start/lint/reset.
- Project is not linked, so `supabase migration list` cannot compare local/remote migrations.
- Anonymous/authenticated RLS behavior is not live-verified.
- Admin role model is missing.
- Membership/paywall schema is missing.
- Moderation/admin workflows are missing.
- Edge Function rate limits are missing.

## Baseline rules

- No secrets in docs, commits, screenshots, or client bundles.
- `.env.example` required for projects using env vars.
- API keys must be server-side.
- Auth/database policies must be verified before public launch.
- Production launch remains blocked until Supabase/RLS verification is complete.

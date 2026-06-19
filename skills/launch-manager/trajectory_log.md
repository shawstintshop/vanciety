# Vanciety — launch-manager trajectory log

No task trajectories recorded yet. Add entries only after real work.

## Phase 3 Cycle 1 — Vanciety Friend Finder security hardening — 2026-06-15 23:27:24

Task: locally mitigate GPS/Friend Finder exact/public location exposure.
Evidence:
- Baseline `npm run build`: PASS.
- Baseline `npm run lint`: PASS with 13 pre-existing warnings.
- Final `npm run typecheck`: PASS.
- Final `npm run build`: PASS.
- Final `npm run lint`: PASS with 13 warnings, 0 errors.
Outcome:
- Safe defaults changed to `friends_only` + `approximate`.
- Legacy public/exact settings normalized at runtime before save/send.
- Member map hook fetches approximate member/event rows only and rounds coordinates before UI rendering.
- New Supabase migration prepared to drop public location policy and harden RPCs.
Skill edit proposed: none.
Skill edit promoted: none.
Remaining blocker: live Supabase migration/RLS verification still required.

## Final review update — 2026-06-15 23:37:36

Independent review status: PASS after follow-up fixes.

Review fixes applied:
- Removed active `event` / `private` GPS sharing UI options.
- Runtime sharing now forces `friends_only` + `approximate`.
- Client fetch now filters only `friends_only`, `approximate`, non-expired rows.
- New migration drops direct `van_locations` INSERT/UPDATE policies so active writes must go through `upsert_van_location()`.
- New migration normalizes all existing van location rows to area-level coordinates and strips motion/accuracy fields.
- Function execution is revoked from `PUBLIC`/`anon` and granted to `authenticated`.

Final local gates:
- `npm run typecheck`: PASS
- `npm run build`: PASS
- `npm run lint`: PASS with 13 pre-existing warnings, 0 errors
- Independent final narrow security review: PASS

Still not production-complete:
- The Supabase migration was not applied live.
- Anonymous/authenticated RLS behavior must be verified against a controlled Supabase environment before launch.

## Phase 3B — Supabase/RLS verification + safe commit isolation — 2026-06-15 23:58:32

### Result

Static Supabase/RLS verification completed. Local/live Supabase verification remains blocked because Docker/local Postgres is unavailable and the project is not linked for migration comparison.

### Dirty work preservation

External records saved at:

- `/Volumes/AI-DATA/PROJECTS/_safety_backups/vanciety_phase3b/git_status_short.txt`
- `/Volumes/AI-DATA/PROJECTS/_safety_backups/vanciety_phase3b/git_status_porcelain.txt`
- `/Volumes/AI-DATA/PROJECTS/_safety_backups/vanciety_phase3b/unstaged_dirty_work.patch`
- `/Volumes/AI-DATA/PROJECTS/_safety_backups/vanciety_phase3b/staged_dirty_work.patch`

### Supabase CLI checks

- `supabase --version`: 2.33.9
- `supabase status`: BLOCKED, Docker daemon unavailable
- `supabase db lint`: BLOCKED, local Postgres `127.0.0.1:54322` refused connection
- `supabase migration list`: BLOCKED, project not linked
- `supabase db reset --local`: NOT RUN because local DB was not clearly available

### Critical fixes prepared locally

- Added `supabase/migrations/20260615235000_deprecate_exact_user_locations.sql` to disable legacy exact-public `user_locations` path.
- Added `supabase/migrations/20260615235500_harden_youtube_video_writes.sql` to remove direct authenticated writes to public video records.
- Updated `src/hooks/useRealtimePresence.tsx` to use secured `van_locations` / `upsert_van_location()` path instead of exact `user_locations` direct writes.
- Updated `supabase/config.toml` to require JWT verification for service-key/AI-key Edge Functions.
- Updated Supabase/RLS docs.

### Validation gates

- `npm run typecheck`: PASS
- `npm run build`: PASS
- `npm run lint`: PASS with 13 warnings, 0 errors
- `npm test || true`: missing script, NOT PASSING
- `npx playwright test || true`: no tests found, NOT PASSING
- Secret scan on changed diff: PASS, no added secret values found
- Location privacy grep: PASS, no legacy exact/public markers in active src/new migrations

### Launch blocker status

Production launch remains BLOCKED until migrations are applied to a safe local/staging Supabase environment and RLS is verified with anonymous/authenticated clients.

## Phase 3B commit isolation update — 2026-06-16 00:04:54

Safe commit was not created. Final independent security review could not run after the Realtime presence fix because the reviewer API returned `HTTP 429: usage limit reached`. For this RLS/security-sensitive change, commit is blocked fail-closed until review can be rerun.

Additional Phase 3B fix after review:
- Removed Realtime presence location sharing from `useRealtimePresence.tsx`.
- Hook now relies on RLS-protected `van_locations` reads and `upsert_van_location()` writes only.

Validation after fix:
- `npm run typecheck`: PASS
- `npm run build`: PASS
- `npm run lint`: PASS with 13 warnings, 0 errors
- Presence/location blocker scans: PASS

Commit status: NOT COMMITTED.

# Vanciety — documentation trajectory log

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

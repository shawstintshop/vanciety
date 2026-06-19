# Vanciety — Launch Blockers

Generated: 2026-06-15 23:13:55

## Project-level blockers

- Supabase credentials/RLS/auth verification not complete
- AI Concierge Edge Function deployment/key must be server-side only
- GPS/Friend Finder location privacy remains launch-critical
- Dirty repo/uncommitted changes must be preserved before deploy
- Missing formal test script

## Agent-owned blocker matrix

| Agent | Blockers owned |
|---|---|
| Executive Product Agent | Supabase credentials/RLS/auth verification not complete<br>AI Concierge Edge Function deployment/key must be server-side only<br>GPS/Friend Finder location privacy remains launch-critical |
| Architecture Agent | Supabase credentials/RLS/auth verification not complete<br>AI Concierge Edge Function deployment/key must be server-side only<br>GPS/Friend Finder location privacy remains launch-critical |
| Frontend Agent | Supabase credentials/RLS/auth verification not complete<br>AI Concierge Edge Function deployment/key must be server-side only<br>GPS/Friend Finder location privacy remains launch-critical |
| UX/UI Design Agent | Supabase credentials/RLS/auth verification not complete<br>AI Concierge Edge Function deployment/key must be server-side only<br>GPS/Friend Finder location privacy remains launch-critical |
| Backend/API Agent | Supabase credentials/RLS/auth verification not complete<br>AI Concierge Edge Function deployment/key must be server-side only<br>GPS/Friend Finder location privacy remains launch-critical |
| Database Agent | Security/auth/database checks must be verified before launch claims<br>Supabase credentials/RLS/auth verification not complete<br>AI Concierge Edge Function deployment/key must be server-side only<br>GPS/Friend Finder location privacy remains launch-critical |
| Auth/Security Agent | Security/auth/database checks must be verified before launch claims<br>Supabase credentials/RLS/auth verification not complete<br>AI Concierge Edge Function deployment/key must be server-side only<br>GPS/Friend Finder location privacy remains launch-critical |
| AI Integration Agent | AI calls require server-side keys, guardrails, evals, and budget caps<br>Supabase credentials/RLS/auth verification not complete<br>AI Concierge Edge Function deployment/key must be server-side only<br>GPS/Friend Finder location privacy remains launch-critical |
| Payments/Memberships Agent | Payment/membership flows require provider dashboard/webhook verification<br>Supabase credentials/RLS/auth verification not complete<br>AI Concierge Edge Function deployment/key must be server-side only<br>GPS/Friend Finder location privacy remains launch-critical |
| Admin Dashboard Agent | Supabase credentials/RLS/auth verification not complete<br>AI Concierge Edge Function deployment/key must be server-side only<br>GPS/Friend Finder location privacy remains launch-critical |
| Mobile/iOS Agent | Supabase credentials/RLS/auth verification not complete<br>AI Concierge Edge Function deployment/key must be server-side only<br>GPS/Friend Finder location privacy remains launch-critical |
| Marketing/SEO Agent | Supabase credentials/RLS/auth verification not complete<br>AI Concierge Edge Function deployment/key must be server-side only<br>GPS/Friend Finder location privacy remains launch-critical |
| Analytics/Growth Agent | Supabase credentials/RLS/auth verification not complete<br>AI Concierge Edge Function deployment/key must be server-side only<br>GPS/Friend Finder location privacy remains launch-critical |
| QA/Test Agent | Launch readiness blocked until build/lint/test/mobile/accessibility gates are run<br>Supabase credentials/RLS/auth verification not complete<br>AI Concierge Edge Function deployment/key must be server-side only<br>GPS/Friend Finder location privacy remains launch-critical |
| DevOps/Deployment Agent | Production/staging/rollback/monitoring not verified in Phase 2<br>Supabase credentials/RLS/auth verification not complete<br>AI Concierge Edge Function deployment/key must be server-side only<br>GPS/Friend Finder location privacy remains launch-critical |
| Customer Support Automation Agent | Supabase credentials/RLS/auth verification not complete<br>AI Concierge Edge Function deployment/key must be server-side only<br>GPS/Friend Finder location privacy remains launch-critical |
| Compliance/Privacy Agent | Terms/privacy/refund/AUP/AI disclaimer must match actual product surfaces<br>Supabase credentials/RLS/auth verification not complete<br>AI Concierge Edge Function deployment/key must be server-side only<br>GPS/Friend Finder location privacy remains launch-critical |
| Performance/Scaling Agent | Supabase credentials/RLS/auth verification not complete<br>AI Concierge Edge Function deployment/key must be server-side only<br>GPS/Friend Finder location privacy remains launch-critical |
| Documentation Agent | Supabase credentials/RLS/auth verification not complete<br>AI Concierge Edge Function deployment/key must be server-side only<br>GPS/Friend Finder location privacy remains launch-critical |
| Launch Manager Agent | Supabase credentials/RLS/auth verification not complete<br>AI Concierge Edge Function deployment/key must be server-side only<br>GPS/Friend Finder location privacy remains launch-critical |

## Rule

No agent may mark its discipline launch-ready until its validation gate passes and evidence is recorded in `trajectory_log.md` or the blocker is moved to resolved with proof.

## SkillOpt blocker ownership

Every blocker is owned by a discipline agent connected to its `best_skill.md`.

| Agent | best_skill.md | Validation gate |
|---|---|---|
| Executive Product Agent | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/product/best_skill.md` | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/product/validation_gate.md` |
| Architecture Agent | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/architecture/best_skill.md` | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/architecture/validation_gate.md` |
| Frontend Agent | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/frontend/best_skill.md` | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/frontend/validation_gate.md` |
| UX/UI Design Agent | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/design/best_skill.md` | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/design/validation_gate.md` |
| Backend/API Agent | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/backend/best_skill.md` | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/backend/validation_gate.md` |
| Database Agent | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/database/best_skill.md` | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/database/validation_gate.md` |
| Auth/Security Agent | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/security/best_skill.md` | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/security/validation_gate.md` |
| AI Integration Agent | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/ai/best_skill.md` | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/ai/validation_gate.md` |
| Payments/Memberships Agent | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/payments/best_skill.md` | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/payments/validation_gate.md` |
| Admin Dashboard Agent | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/admin/best_skill.md` | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/admin/validation_gate.md` |
| Mobile/iOS Agent | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/mobile-ios/best_skill.md` | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/mobile-ios/validation_gate.md` |
| Marketing/SEO Agent | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/marketing-seo/best_skill.md` | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/marketing-seo/validation_gate.md` |
| Analytics/Growth Agent | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/analytics/best_skill.md` | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/analytics/validation_gate.md` |
| QA/Test Agent | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/qa/best_skill.md` | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/qa/validation_gate.md` |
| DevOps/Deployment Agent | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/devops/best_skill.md` | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/devops/validation_gate.md` |
| Customer Support Automation Agent | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/support/best_skill.md` | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/support/validation_gate.md` |
| Compliance/Privacy Agent | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/compliance-privacy/best_skill.md` | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/compliance-privacy/validation_gate.md` |
| Performance/Scaling Agent | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/performance/best_skill.md` | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/performance/validation_gate.md` |
| Documentation Agent | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/documentation/best_skill.md` | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/documentation/validation_gate.md` |
| Launch Manager Agent | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/launch-manager/best_skill.md` | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/launch-manager/validation_gate.md` |

## Phase 3 Cycle 1 blocker update — 2026-06-15 23:27:24

- **GPS/Friend Finder location privacy**: locally mitigated in frontend and migration files, but remains a launch blocker until Supabase migration `20260615232500_secure_friend_finder_member_areas.sql` is applied and verified.
- **Supabase credentials/RLS/auth verification**: still blocked because live Supabase credentials/authenticated test context were not used in this cycle.
- **TypeScript blocker**: improved by adding `npm run typecheck`; current typecheck passes.
- **Lint blocker**: no new lint errors; 13 warnings remain pre-existing.

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

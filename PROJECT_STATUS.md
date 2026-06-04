# Vanciety Primary App — Project Status

App root: /Volumes/AI-DATA/PROJECTS/vanciety_platform/code/primary_app

## Completed Work

### VAN-001 — Topo Hydration Script + Van Cards UI
- Status: completed and committed
- Commit: 55d1b8b
- Topo hydration script created: scripts/ingestLocations.ts
- VanCard component created: src/components/VanCard.tsx
- VanCards page created: src/pages/VanCards.tsx
- Route /van-cards registered in src/App.tsx
- package.json script added: ingest:locations
- Dependencies installed: dotenv ^17.4.2, tsx ^4.22.4

## Build / Lint State

- npm run build: PASSED (vite v5.4.19, ~1.7s, dist/ emitted)
- npm run lint: FAILS — 98 pre-existing repo-wide issues (84 errors, 14 warnings)
- New VAN-001 files are lint-clean. The 98 issues live in AuthContext, Forum, Marketplace, Videos, useRealtimeVanLocations, supabase edge function, tailwind.config.ts — all pre-dating VAN-001.

## Ingestion State

- npm run ingest:locations has NOT been run yet.
- Current blocker: missing SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in local environment.
- .env.example added with blank placeholders (VAN-002).

## Open Tasks

- VAN-002 — Protect Env + Add Project Status (completed, commit 904d4cc)
- VAN-003 — Untrack .env and prepare key rotation (completed, this commit)
  - .env removed from git tracking via `git rm --cached .env`
  - local .env file preserved on disk
  - .gitignore protects .env, .env.local, .env.*.local going forward
  - Key rotation required: .env existed in prior commit history (commit 0d11b88). Any real Supabase keys committed there should be rotated in the Supabase dashboard before ingestion runs.
  - Do not run ingestion until Supabase keys are rotated/confirmed safe.
- VAN-004 — Rotate Supabase keys / confirm secrets safe (manual, owner: Shaw)
- Future — Lint cleanup pass on the 98 pre-existing issues (separate worker mission)

## Next Recommended Task

Add real SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to a local untracked .env, run `npm run ingest:locations`, then verify /map and /van-cards render hydrated topo data end-to-end.

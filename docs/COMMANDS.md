# Vanciety — Commands

Updated: 2026-06-15 23:27:24

| Command type | Command | Phase 3 status |
|---|---|---|
| Dev | `npm run dev` | available; not run in Phase 3 because user said do not restart projects |
| Build | `npm run build` | PASS in Phase 3 cycle 1 |
| Typecheck | `npm run typecheck` | PASS in Phase 3 cycle 1 |
| Lint | `npm run lint` | PASS with 13 pre-existing warnings, 0 errors |
| Test | `npm test` | NOT CONFIGURED |
| E2E | `npx playwright test` | NOT AVAILABLE; Playwright is not installed |
| Preview | `npm run preview` | available; not run because no restart requested |
| News update | `npm run news:update` | available; not relevant to security cycle |
| Location ingest | `npm run ingest:locations` | available; not relevant to security cycle |

## Notes

- `typecheck` script was added in Phase 3 cycle 1: `tsc --noEmit`.
- No live Supabase migration was applied in this cycle.
- No dev server was restarted.

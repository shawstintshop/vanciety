# Environment Variables — Phase 3B

Generated: 2026-06-15 23:56:36

## Existing env files detected by filename only

Detected files:

- `.env`
- `.env.local`
- `.env.example`

Safety rule: `.env` and `.env.local` were **not read** and must not be committed.

`.gitignore` includes:

```gitignore
.env
.env.local
.env.*.local
```

## `.env.example` keys

From `.env.example`:

```text
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Client-side variables

Used by `src/integrations/supabase/client.ts`:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Rules:

- These are browser-exposed by design.
- Only the Supabase anon/publishable key belongs here.
- No service role key can be used in Vite/browser code.

## Server-side / Edge Function variables

Detected from Edge Functions:

### `fetch-youtube-videos`

- `YOUTUBE_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Phase 3B config change:

- `supabase/config.toml` now sets `verify_jwt = true` for this function.

### `vanciety-ai-concierge`

- `ANTHROPIC_API_KEY`
- `ANTHROPIC_MODEL` optional, default `claude-sonnet-4-6`

Phase 3B config change:

- `supabase/config.toml` now explicitly sets `verify_jwt = true` for this function.

## Required before public launch

- Confirm Edge Function secrets are set in Supabase dashboard/CLI without exposing values.
- Add rate limiting for AI and YouTube functions.
- Verify service role key never appears in browser bundles, docs, commits, logs, or screenshots.
- Verify `.env` and `.env.local` are not staged.

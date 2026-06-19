# Vanciety Launch Verification — 2026-06-17

## Result

SHAW completed the secret setup correctly. Supabase now has the required Edge Function secret names.

## Verified Supabase Secrets

Names present in Supabase project `vfrxntxjigtgutevijmb`:

- `ANTHROPIC_API_KEY`
- `YOUTUBE_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- related Supabase managed secrets

Only names/digests were checked. No secret values were printed or written here.

## Verified Supabase Functions

| Function | Status | Version |
|---|---:|---:|
| `fetch-youtube-videos` | ACTIVE | 3 |
| `vanciety-ai-concierge` | ACTIVE | 3 |

## Public Site/DNS Verification

| URL | Result | Finding |
|---|---:|---|
| `https://vanciety.com/` | 404 | Still points to Wix/Pepyaka, not the new Vanciety app |
| `https://www.vanciety.com/` | 404 | Still points to Wix DNS/CDN, not the new Vanciety app |
| `https://vanciety.vercel.app/` | 200 | Live, but appears to be a different/older Next.js Vanciety deployment |

`vanciety.vercel.app` is not the current local Vite app because:

- `/forum` returns 404
- `/videos` returns 404
- `/friend-finder` returns 404
- `/gps` returns 404
- `/ai` returns 404
- HTML contains Next.js app markers, not Vite `/assets/index-*` build markers

## DNS Currently Observed

`vanciety.com` A records:

- `185.230.63.107`
- `185.230.63.186`
- `185.230.63.171`

`www.vanciety.com` CNAME chain:

- `cdn1.wixdns.net`
- `td-ccm-neg-87-45.wixdns.net`

This confirms the domain is still on Wix.

## Fix Needed

The current local app has not been deployed to the public domain yet.

Two valid paths:

### Path A — Vercel local deploy

Requires Vercel login from this desktop/CLI.

```bash
cd /Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app
npx vercel@latest login
npx vercel@latest --prod
```

Then attach domain in Vercel:

https://vercel.com/dashboard/domains

### Path B — Vercel GitHub deploy

Requires committing/pushing the current local Vite app changes to GitHub and importing the correct repo/project root in Vercel.

Repo:

https://github.com/shawstintshop/vanciety

Vercel new project:

https://vercel.com/new

## Safety Fix Applied Locally

Updated `.gitignore` so local/private artifacts are not accidentally committed:

- `supabase/.temp/`
- `.hermes_sprinter_crawl/`
- `test-results/`

## Next Exact User Action

Log into Vercel CLI or Vercel dashboard. The current machine has GitHub auth, but Vercel CLI has no credentials yet.

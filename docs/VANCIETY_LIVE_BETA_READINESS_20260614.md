# Vanciety Live + Beta Readiness Report

Generated: 2026-06-14
Project path: `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app`
Local URL: `http://127.0.0.1:5173/`

## Summary

Vanciety is locally running and beta-testable. The visible nav/logo issue is fixed: the header now uses a tiny van/truck icon and the browser favicon is a Vanciety van SVG.

The public live launch is not complete yet because DNS/hosting and Supabase deployment access are still blocked by external account configuration.

## Files changed in this pass

- `src/components/Header.tsx` — replaced generic V logo with a tiny van/truck icon from lucide-react.
- `src/components/Hero.tsx` — fixed mobile spacing under fixed header and hid scroll indicator on mobile so it no longer overlaps stat cards.
- `index.html` — added Vanciety van SVG favicon/apple-touch icon.
- `public/vanciety-van-favicon.svg` — new Vanciety van icon.
- `public/CNAME` — added `vanciety.com` for GitHub Pages style deployment.
- `public/_redirects` — added Netlify redirect rules from SprinterSociety domains to Vanciety.
- `docs/beta-testing/mobile-check-20260614-114814/` — mobile screenshots captured after fix.

## Backup

Created before edits:

`/Users/darrinshaw/Hermes-Backups/Vanciety-before-live-beta-nav-van-20260614-114349.tar.gz`

## Local verification

### Build

Command:

```bash
npm run build
```

Result: PASS

Notes:

- Vite build completed successfully.
- Warning remains: JS chunk larger than 500 kB. This is not a build failure; code splitting is a future optimization.

### Lint

Command:

```bash
npm run lint
```

Result: PASS with warnings

Warnings:

- 13 existing ESLint warnings.
- 0 errors.

### Local server

Server running:

`http://127.0.0.1:5173/`

Background process:

`proc_82f1c93f89f4`

### Route checks

All returned HTTP 200 using a mobile Safari user-agent:

- `/`
- `/videos`
- `/news`
- `/map`
- `/forum`
- `/marketplace`
- `/vendors`
- `/gps`
- `/van-cards`
- `/auth`
- `/van-intelligence`
- `/friend-finder`
- `/ai`
- `/vanciety-van-favicon.svg`

### Mobile render checks

Playwright Chromium mobile screenshots captured at 390x844:

- `docs/beta-testing/mobile-check-20260614-114814/home-mobile.png`
- `docs/beta-testing/mobile-check-20260614-114814/friend-finder-mobile.png`

Observed:

- Header renders cleanly on mobile.
- Tiny van icon is visible in the top-left nav.
- Home hero badge no longer tucks under the fixed header.
- Mobile scroll indicator no longer overlaps stat cards.
- Friend Finder clearly presents members-only / privacy-focused / city-area-only positioning.

## Domain/DNS verification

Checked live DNS/HTTP:

### `vanciety.com`

- A records: `185.230.63.171`, `185.230.63.107`, `185.230.63.186`
- HTTPS result: 404 Not Found
- Current host appears to be Wix-era DNS/hosting, not the current Vanciety build.

### `www.vanciety.com`

- CNAME: `cdn1.wixdns.net`, `td-ccm-neg-87-45.wixdns.net`
- A record: `34.149.87.45`
- HTTPS result: 404 Not Found
- Current host appears to be Wix-era DNS/hosting.

### `sprintersociety.com`

- A record: `185.158.133.1`
- HTTPS result: 403 Forbidden
- Not pointed at the current Vanciety app.

### `www.sprintersociety.com`

- A record: `185.158.133.1`
- HTTPS result: 403 Forbidden
- Not pointed at the current Vanciety app.

## Hosting/deployment status

### GitHub

Repo:

`https://github.com/shawstintshop/vanciety`

GitHub auth is available locally through `gh`.

Current local branch state:

- Branch: `main`
- Status: `ahead 50, behind 1`
- Many local modified/untracked files exist.

Important: do not force-push until the local branch divergence is resolved cleanly.

### GitHub Pages

A workflow exists:

`.github/workflows/deploy.yml`

It is configured to deploy GitHub Pages on push to `main` or `claude/*`.

GitHub Pages API currently returned 404, meaning Pages is not enabled/configured for the repo yet or the API cannot access it.

### Netlify

`netlify.toml` exists and is build-ready:

- build command: `npm run build`
- publish: `dist`
- SPA redirect configured

But Netlify CLI is not installed/authenticated locally.

## Supabase status

Local Supabase config:

`supabase/config.toml`

Project ID:

`vfrxntxjigtgutevijmb`

Local env files have Supabase URL/service/anon keys present, but secrets were not printed.

### Live Supabase REST checks

Existing tables reachable:

- `profiles`
- `vendors`
- `vendor_clicks`
- `vendor_offers`
- `vendor_owners`
- `demo_members`
- `member_locations`

Missing/not exposed tables currently returning 404:

- `locations`
- `forum_posts`
- `marketplace_items`
- `youtube_videos`
- `van_locations`
- `gps_sharing_settings`

Edge function status:

- `vanciety-ai-concierge` returned 404, not deployed.

Supabase CLI status:

- CLI is installed.
- CLI is not logged in / access token missing.
- Docker is not running, so local Supabase stack cannot start.

## Live launch blockers

1. DNS is not pointed to the current app host.
2. GitHub Pages is not enabled/configured for the repo yet.
3. Local Git branch is diverged: ahead 50, behind 1.
4. Many local changes are dirty/uncommitted; they need review/commit before deployment.
5. Supabase CLI lacks access token/login, so migrations/functions cannot be deployed from here yet.
6. Supabase live schema is partial; multiple app-expected tables/functions are missing.
7. The old unsafe GPS migration must not be deployed as-is. Friend Finder must use the `member_locations`/coarse-location pattern.
8. Netlify CLI is not installed/authenticated if Netlify is the intended host.

## Exact next commands for SHAW / operator

### If using GitHub Pages

1. Resolve branch divergence:

```bash
cd /Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app
git status -sb
git fetch origin
```

2. Review changes before commit:

```bash
git diff --stat
git diff -- src/components/Header.tsx src/components/Hero.tsx index.html public/vanciety-van-favicon.svg public/CNAME public/_redirects
```

3. Enable GitHub Pages for the repo using GitHub Actions as source in GitHub settings, or API if available.

4. Push a clean branch and watch the workflow.

### If using Netlify

1. Install/login Netlify CLI or connect GitHub repo through Netlify dashboard.
2. Attach domains:

- `vanciety.com`
- `www.vanciety.com`
- `sprintersociety.com`
- `www.sprintersociety.com`

3. Use included `_redirects` to redirect SprinterSociety to Vanciety.

### DNS target once host is chosen

Do not leave these domains on the current Wix/old host records.

- Point `vanciety.com` and `www.vanciety.com` to the final host.
- Point `sprintersociety.com` and `www.sprintersociety.com` to the same host or to a redirect host that 301s to `https://vanciety.com/`.

### Supabase deployment

Required:

```bash
supabase login
supabase link --project-ref vfrxntxjigtgutevijmb
```

Then deploy only safe migrations/functions after replacing unsafe GPS migration logic.

## Beta test checklist

### Public/mobile smoke test

- [x] Home route loads locally.
- [x] Friend Finder route loads locally.
- [x] Mobile screenshots captured.
- [x] Header/nav visible at mobile width.
- [x] Tiny van icon visible.
- [x] Friend Finder privacy messaging visible.
- [ ] Public hosted domain loads current app.
- [ ] SprinterSociety redirects to Vanciety.

### Account/Supabase beta test

- [ ] Sign up new beta user.
- [ ] Sign in/out.
- [ ] Confirm profile row created.
- [ ] Confirm member-only Friend Finder gating.
- [ ] Confirm no exact location exposed publicly.
- [ ] Confirm forum table exists and posting works.
- [ ] Confirm marketplace table exists and posting works.
- [ ] Confirm AI edge function deployed or guide-mode fallback is acceptable.

## Current recommendation

The app is locally beta-testable now.

For live launch, use Netlify or GitHub Pages for the frontend, but first resolve the dirty/diverged Git state. Use Supabase only for backend/auth/database/functions; the current Supabase deployment access is not enough to deploy migrations/functions from this machine yet.

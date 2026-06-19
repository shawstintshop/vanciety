# Vanciety — Exact Launch Links and Steps

Last verified: 2026-06-16
Project root: `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app`
Supabase project: `vfrxntxjigtgutevijmb`
GitHub repo: `https://github.com/shawstintshop/vanciety`

## Current verified state

- Supabase schema: deployed
- Supabase tables: verified
- Edge Functions: deployed and ACTIVE
- Verified public seed content: inserted
- Local build/lint/routes: pass
- Remaining user-only items: provider API keys and public domain deployment

## Step 1 — Add Anthropic key for AI Concierge

Open:

https://console.anthropic.com/settings/keys

Create/copy one key for Vanciety.

Then on desktop run:

```bash
cd /Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app
npm run supabase:set-secrets
```

When prompted, paste the Anthropic key into `ANTHROPIC_API_KEY`.

Billing/spend check:

https://console.anthropic.com/settings/billing

Recommended:

- Use one key labeled `Vanciety Supabase Edge Functions`.
- Set the lowest practical monthly spend limit.
- Do not paste the key into chat/docs.

## Step 2 — Add YouTube Data API key for video sync

Open YouTube Data API page:

https://console.cloud.google.com/apis/library/youtube.googleapis.com

If needed, select/create a Google Cloud project for Vanciety, then enable `YouTube Data API v3`.

Open credentials page:

https://console.cloud.google.com/apis/credentials

Create API key:

- Credential type: API key
- Name/label: `Vanciety YouTube Data API`
- API restrictions: restrict to `YouTube Data API v3`
- Application restrictions: safest server-side option depends on Google Console availability; if unsure, leave unrestricted short-term, then restrict after live verification.

Then on desktop run:

```bash
cd /Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app
npm run supabase:set-secrets
```

When prompted, paste the YouTube key into `YOUTUBE_API_KEY`.

## Step 3 — Verify Supabase secret names only

Open Supabase functions/settings:

https://supabase.com/dashboard/project/vfrxntxjigtgutevijmb/settings/functions

CLI verify:

```bash
cd /Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app
supabase secrets list --project-ref vfrxntxjigtgutevijmb
```

Required names:

- `ANTHROPIC_API_KEY`
- `YOUTUBE_API_KEY`

Do not print secret values.

## Step 4 — Verify Edge Functions

Open:

https://supabase.com/dashboard/project/vfrxntxjigtgutevijmb/functions

Expected functions:

- `fetch-youtube-videos`
- `vanciety-ai-concierge`

Expected status:

- ACTIVE

## Step 5 — Deploy public site

The app has both Vercel and Netlify config.

Recommended: Vercel first because `vercel.json` is already set for SPA rewrites.

Open Vercel import:

https://vercel.com/new

Import GitHub repo:

https://github.com/shawstintshop/vanciety

Project settings:

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`
- Root directory: if Vercel asks, use the repo root that contains `package.json`; if the GitHub repo contains this app at a subpath, select that subpath.

Set Vercel environment variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Values come from local `.env`, but do not paste them into docs/chat.

## Step 6 — Attach domain `vanciety.com`

Open Vercel domains:

https://vercel.com/dashboard/domains

Add:

- `vanciety.com`
- `www.vanciety.com`

Follow Vercel DNS instructions exactly.

If domain DNS is managed elsewhere, update DNS records at that provider.

Typical Vercel DNS records:

- Apex/root `vanciety.com`: A record to Vercel’s provided IP, commonly `76.76.21.21`
- `www`: CNAME to Vercel’s provided target, commonly `cname.vercel-dns.com`

Use the values Vercel shows, not guessed values, if different.

## Step 7 — Production verification after deploy

After Vercel gives a live URL:

```bash
curl -I https://YOUR-VERCEL-URL/
curl -I https://YOUR-VERCEL-URL/map
curl -I https://YOUR-VERCEL-URL/videos
curl -I https://YOUR-VERCEL-URL/ai
```

After domain cutover:

```bash
curl -I https://vanciety.com/
curl -I https://www.vanciety.com/
```

Expected:

- HTTP 200 or 30x to canonical domain
- HTTPS valid
- `/map`, `/videos`, `/ai` load without blank screen

## Alternate deployment path — Netlify

Open:

https://app.netlify.com/start

The repo contains `netlify.toml` with:

- build command: `npm run build`
- publish directory: `dist`
- SPA redirect to `/index.html`

Netlify domains:

https://app.netlify.com/teams/overview/dns

Use Netlify only if Vercel account/repo access blocks deployment.

## Do not do

- Do not paste API keys into Telegram.
- Do not commit `.env` or `.env.local`.
- Do not push the historical Supabase migration folder.
- Do not insert fake forum posts/listings/members.

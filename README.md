# Vanciety — Van Life Community Platform

**Live Site:** https://primaryapp.vercel.app
**Repo:** https://github.com/shawstintshop/vanciety

Vanciety is the van life community platform for Sprinter van owners and enthusiasts. Connect with fellow adventurers, discover hidden camp spots, stream van build content, and find your community on the road.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS + shadcn/ui |
| Backend | Supabase (PostgreSQL, Auth, Realtime) |
| Routing | React Router v6 |
| Maps | Leaflet / OpenStreetMap (free, no API key) |
| Hosting | Vercel (auto-deploy on push) |

---

## Commands

```bash
npm run dev        # Dev server on port 8080
npm run build      # Production build
npm run lint       # ESLint check
npm run preview    # Preview production build

# Data imports
npm run import:videos     # Import YouTube videos to Supabase
npm run import:locations  # Import locations to Supabase
npm run import:products   # Import products to Supabase
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in values:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

---

## Project Structure

```
src/
├── pages/          # Route-level pages
├── components/     # Shared UI components
├── contexts/       # Auth context
├── hooks/          # Custom hooks
├── integrations/   # Supabase client + types
└── data/           # Static data files
supabase/
├── migrations/     # SQL schema migrations
└── functions/      # Edge functions (YouTube sync)
scripts/            # Data import scripts
public/             # Static assets
```

---

## Deployment

Push to `main` → Vercel auto-deploys in ~44 seconds.

```bash
git add -A && git commit -m "your message" && git push origin main
```

---

## Supabase

Project ref: `vfrxntxjigtgutevijmb`
Dashboard: https://supabase.com/dashboard/project/vfrxntxjigtgutevijmb

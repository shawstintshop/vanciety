# Vanciety Status

**Production**: https://primaryapp.vercel.app ✅ LIVE  
**Repo**: https://github.com/shawstintshop/vanciety  
**Last verified**: 2026-06-20 01:05 PST

## Current State

**WORKING** — Site is live and rendering correctly.

## Recent Fix (2026-06-20 01:05)

**Issue**: White page on production and local dev — React failing to boot silently.

**Root cause**: `AuthProvider` was wrapping `BrowserRouter` in App.tsx. `AuthProvider` calls `useNavigate()` which requires being inside a Router context. This caused React to fail silently during initialization.

**Fix**: Moved `BrowserRouter` to wrap `AuthProvider` instead:
```tsx
<QueryClientProvider client={queryClient}>
  <BrowserRouter>
    <AuthProvider>
      {/* rest of app */}
    </AuthProvider>
  </BrowserRouter>
</QueryClientProvider>
```

**Commit**: `4e545d0` — "fix: move BrowserRouter outside AuthProvider to fix useNavigate error"

**Deployed**: Vercel production, 16s build time

## Verification

- ✅ Local dev server: http://localhost:8080
- ✅ Production: https://primaryapp.vercel.app
- ✅ Homepage renders with hero, nav, Vanny AI widget, feature cards
- ✅ No console errors
- ✅ React initializing correctly

## Tech Stack

- React 18 + TypeScript
- Vite 5.4.21
- React Router v6
- Supabase (vfrxntxjigtgutevijmb)
- Tailwind CSS
- Deployed on Vercel

## Environment

- `VITE_SUPABASE_URL` — ✅ set in Vercel production
- `VITE_SUPABASE_ANON_KEY` — ✅ set in Vercel production

## Build Commands

```bash
npm run dev -- --port 8080    # Local dev server
npm run build                  # Production build
npm run lint                   # ESLint check
git push                       # Auto-deploys to Vercel
npx vercel --prod             # Manual production deploy
```

## Next Actions

1. **Content**: Import more YouTube videos, map sources, events, vendors
2. **Products table**: Apply products schema migration to Supabase
3. **Stripe integration**: Premium membership payments
4. **Design refinement**: Per SHAW's design preferences (centered hero, less busy, clear nav)
5. **Old content cleanup**: Archive/delete old SprinterSociety/Vanciety duplicates

## Known Issues

None blocking. Site is production-ready.

## Important Files

- `/src/App.tsx` — Main app component, routing
- `/src/contexts/AuthContext.tsx` — Supabase auth provider
- `/src/integrations/supabase/client.ts` — Supabase client config
- `/src/pages/Index.tsx` — Homepage
- `vercel.json` — Vercel deployment config
- `.env` — Local environment variables (not committed)
- `.env.example` — Environment variable template

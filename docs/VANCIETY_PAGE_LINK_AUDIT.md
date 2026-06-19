# Vanciety Page / Link / Real Content Audit

Date: 2026-06-13
Scope: local Vanciety React/Vite app at `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app`

## Goal
Make every page reachable, remove broken internal routing, preserve real content/source badges, and fix verified broken external links without inventing data.

## Files changed in this pass
- `src/App.tsx`
- `src/components/Header.tsx`
- `src/data/vanIntelligence.ts`
- `docs/VANCIETY_PAGE_LINK_AUDIT.md`

## Backup
Created before edits:
- `/Users/darrinshaw/Hermes-Backups/Vanciety-before-page-link-real-content-pass-20260613-130229.tar.gz`

## Fixes made

### 1. Registered Friend Finder route
`src/pages/FriendFinder.tsx` existed, but `/friend-finder` was not registered in `App.tsx`. Because this is an SPA, HTTP checks still returned 200 while the app would route to the catch-all/NotFound view.

Fixed:
- Imported `FriendFinder` in `src/App.tsx`
- Added route: `/friend-finder`
- Added desktop/mobile navigation links in `src/components/Header.tsx`

### 2. Fixed verified 404 source links
External link validation found these deep links returned 404:
- `https://www.ford.com/commercial-trucks/transit/`
- `https://www.mbvans.com/en/dealer-locator`
- `https://www.winnebago.com/motorhomes/class-b/revel/`

Fixed in `src/data/vanIntelligence.ts`:
- Ford Transit now links to verified official Ford landing site: `https://www.ford.com/`
- Mercedes-Benz Vans dealer locator card now links to verified official MB Vans landing site: `https://www.mbvans.com/`
- Winnebago Revel now links to official Winnebago landing site: `https://www.winnebago.com/`

Each note now explicitly says the old deep link returned 404 and directs users to site search/navigation where needed.

### 3. Labeled eBay anti-bot behavior honestly
Automated link validation returned 403 for eBay search URLs. These are browser-opened live search links, not verified individual listing feeds.

Updated eBay notes to say:
- Browser-opened eBay live search
- Automated verification may return 403/anti-bot
- Prices/availability are shown on eBay, not stored or invented by Vanciety
- Reliable alerts require eBay Browse API or saved searches

## Verification

### Build
Command: `npm run build`
Result: PASS
- Vite transformed 1843 modules
- Build completed in 2.29s
- Warning: bundle chunk over 500 kB remains; this is a known SPA code-splitting issue, not a build failure

### Lint
Command: `npm run lint`
Result: PASS
- 0 errors
- 13 warnings remain in existing files:
  - `src/contexts/AuthContext.tsx`
  - `src/hooks/useGoogleMaps.tsx`
  - `src/hooks/useRealtimeVanLocations.tsx`
  - `src/pages/Forum.tsx`
  - `src/pages/Map.tsx`
  - `src/pages/Marketplace.tsx`
  - `src/pages/Videos.tsx`

### Local route checks
All checked routes returned HTTP 200 from local Vite dev server:
- `/`
- `/videos`
- `/news`
- `/map`
- `/forum`
- `/marketplace`
- `/vendors`
- `/auth`
- `/gps`
- `/van-cards`
- `/van-intelligence`
- `/friend-finder`

### Built content markers
Verified in `dist` build output:
- `Van Intelligence Hub`
- `Van Friend Finder`
- `Friend Finder`
- `Official Winnebago site`
- `Official Ford site`

## Remaining real-content blockers
These are not failures; they require credentials/API access or member-generated content before becoming fully live:

- Supabase auth/database/storage: needed for real member profiles, uploads, ratings, forum persistence, GPS sharing, marketplace inventory, newsletter signups.
- YouTube Data API key: needed for true newest-upload syncing at scale.
- eBay Browse API key or saved search integration: needed for reliable sale alerts beyond browser-opened search links.
- Facebook login/OAuth: needed for private groups and marketplace monitoring. Vanciety should not scrape private group data without permission.
- Google Maps API key/config: needed for full map UX where Google Maps is expected; fallback/source anchors remain available.
- Member ratings: Fire ratings are intentionally placeholder until real member reviews exist.

## Truth policy status
- No fake prices added.
- No fake ratings added.
- No fake member uploads added.
- No fake event dates added.
- Broken internal Friend Finder routing fixed.
- Definite 404 deep links replaced with stable official site links.
- Anti-bot/credential-limited sources are labeled honestly.

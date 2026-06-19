# Vanciety Van Intelligence Hub — Build Report

**Date:** 2026-06-13  
**Branch:** main  
**Build result:** ✅ 0 errors, 13 pre-existing warnings (all in unchanged files)

---

## Changed Files

### New files

| File | Purpose |
|------|---------|
| `src/pages/VanIntelligence.tsx` | Main Van Intelligence Hub page at `/van-intelligence` |
| `src/components/SourceBadge.tsx` | Reusable source badge component (handles all badge types) |
| `src/components/FireRating.tsx` | 🔥 fire rating component (score + placeholder mode) |
| `src/components/VanIntelligenceCard.tsx` | Generic intelligence card with badge, note, tags, and link |

### Modified files

| File | Change |
|------|--------|
| `src/data/vanIntelligence.ts` | Added `ProductCategory` + `productCategories` (13 categories), `ManufacturerEntry` + `manufacturerEntries` (6 entries) |
| `src/App.tsx` | Added `VanIntelligence` import + `/van-intelligence` route |
| `src/components/Header.tsx` | Added `Brain` icon import + "Van Intel" nav link (desktop + mobile) |

---

## Page Sections

The `/van-intelligence` page contains 8 source-badged sections:

| Section ID | Title | Data source |
|------------|-------|-------------|
| `#events` | Events & Shows | `verifiedEvents` (6 OFFICIAL entries) |
| `#marketplace` | Deals & Marketplace | `marketplaceSources` (6 entries: LIVE_SEARCH / OFFICIAL / AUTH_REQUIRED) |
| `#products` | Products & Accessories | `productCategories` (13 taxonomy categories, LIVE_SEARCH / OFFICIAL) |
| `#vendors` | Builders, Dealers & Manufacturers | `manufacturerEntries` (6) + `verifiedVendors` (5) + `mechanicDealerSources` (2) |
| `#forums` | Forums & Groups | `forumSources` (7 entries: PUBLIC_FORUM / PUBLIC_SOCIAL / PRIVATE_SOURCE) |
| `#videos` | Video Library | `verifiedVideos` (13 VERIFIED entries) |
| `#builds` | Member Builds & Uploads | Honest USER_GATED / SUPABASE placeholder |
| `#newsletter` | Newsletter CTA | SUPABASE placeholder (disabled form, backend not live) |

---

## Source Badge Coverage

All content on the page is explicitly badged. Badge types in use:

| Badge | Meaning | Used for |
|-------|---------|---------|
| `OFFICIAL` | Official org/site fetched live | Events, manufacturers, Starlink |
| `VERIFIED` | Validated source | YouTube videos (oEmbed-validated) |
| `LIVE_SEARCH` | Live search/index URL, results not verified here | eBay links, Craigslist, Google Maps mechanic search |
| `PUBLIC_FORUM` | Publicly readable forum | Sprinter Source, ClassBforum, iRV2 |
| `PUBLIC_SOCIAL` | Public social, may be rate-limited | Reddit subreddits |
| `AUTH_REQUIRED` | Login required | Facebook Marketplace |
| `PRIVATE_SOURCE` | Private group, explicit permission needed | Facebook Groups |
| `USER_GATED` | Requires user login/submission | Member builds upload section |
| `SUPABASE` | Backend connection required | Member builds, newsletter form |

---

## Fire Rating System

`FireRating` component supports:
- `score={n}` renders n filled 🔥 out of `max` (default 5)
- `placeholder={true}` renders greyed-out 🔥🔥🔥🔥🔥 with "No ratings collected yet" — used throughout since no ratings data exists yet

All vendor, builder, product, and manufacturer cards show `placeholder` mode — no fake ratings.

---

## Verified Build Checks

- `npm run build` — ✅ Pass (0 errors, 0 new warnings)
- `npm run lint` — ✅ Pass (0 errors; 13 pre-existing warnings in AuthContext, hooks, Forum, Map, Marketplace, Videos — unchanged files)
- No secrets, API keys, or private credentials added
- No fake prices, fake events, fake sale prices, or invented metrics
- No files deleted

---

## Known Blockers / Future Work

| Area | Status | Notes |
|------|--------|-------|
| Member Build Uploads | `USER_GATED` placeholder | Needs Supabase Storage + upload UI + moderation queue |
| Newsletter Backend | `SUPABASE` placeholder | Form disabled; needs email delivery service wired |
| Fire Ratings | Placeholder only | Needs Supabase `ratings` table + user submission flow |
| eBay live listings | `LIVE_SEARCH` links only | Real-time listing data needs eBay Browse API key |
| Facebook Groups | `AUTH_REQUIRED` / `PRIVATE_SOURCE` | Requires Facebook login session — not feasible without OAuth |
| YouTube newest uploads | Verified seed data only | Real-time newest needs YouTube Data API v3 key (`YOUTUBE_API_KEY`) |
| Product rankings | Placeholder | Needs community rating data to populate FireRating scores |
| Mechanic directory | 2 entries (locator links) | Needs member-submitted mechanic reviews + Supabase table |

---

## Chunk Size Warning

`dist/assets/index-CqPDcCaX.js` is 701 kB (203 kB gzip) — above Vite's 500 kB soft warning threshold.
This is a pre-existing issue across the entire SPA (not introduced by this PR). Route-level code splitting via `React.lazy()` would address it but is out of scope here.

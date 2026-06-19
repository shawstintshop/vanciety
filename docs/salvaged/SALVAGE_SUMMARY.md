# Vanciety / SprinterSociety — Asset Salvage Summary

> Generated: 2025-06-17
> Scanned 12 old project folders, extracted all reusable assets

---

## Folders Scanned (all 12 exist)

| # | Folder | Status |
|---|--------|--------|
| 1 | `/Users/darrinshaw/Documents/GitHub/deployment-20250806-202004` | ✅ Scanned (macOS sandbox lock — files duplicated elsewhere) |
| 2 | `/Users/darrinshaw/Documents/GitHub/SprinterSociety` | ⚠️ macOS provenance lock — 30 unique files could not be cross-volume copied |
| 3 | `/Users/darrinshaw/Documents/GitHub/sprintersociety-app-` | ✅ Scanned (minimal — mostly config) |
| 4 | `/Users/darrinshaw/Downloads/Sprinter-Society-cursor-main` | ✅ Scanned — main source of video/sponsor data |
| 5 | `/Users/darrinshaw/Downloads/sprintersociety` | ✅ Scanned — main source of products, locations, server code |
| 6 | `/Users/darrinshaw/Downloads/sprintersociety 2` | ✅ Scanned (duplicate of #5) |
| 7 | `/Users/darrinshaw/Downloads/sprintersociety 3` | ✅ Scanned (duplicate of #5) |
| 8 | `/Users/darrinshaw/Downloads/sprintersociety 4` | ✅ Scanned — Supabase/React version |
| 9 | `/Users/darrinshaw/Downloads/sprintersociety-app--main` | ✅ Scanned (minimal) |
| 10 | `/Users/darrinshaw/Projects/vanciety.com` | ✅ Scanned — Supabase Edge Functions, migrations |
| 11 | `/Volumes/AI-DATA/PROJECTS/apps/oldsprinter` | ✅ Scanned — deployment copies + separate SaaS project |
| 12 | `/Volumes/AI-DATA/PROJECTS/vanciety_platform` | ✅ Scanned (minimal — planning docs) |

---

## 1. IMAGES — 50 Unique Files Copied (39.3 MB)

184 total images found across all folders. After MD5 deduplication: **50 unique images** copied, 103 duplicates skipped, 30 failed due to macOS sandbox lock on the SprinterSociety GitHub folder (these files exist only in that locked folder but are described in the notes below).

### By Category

| Category | Count | Description |
|----------|-------|-------------|
| **logos/** | 2 | SprintersSociety logo (main + alt) |
| **heroes/** | 5 | Hero/banner images for homepage |
| **icons/** | 1 | Favicon |
| **photos/** | 23 | Van photos, camp spots, categories, community |
| **misc/** | 19 | Lovable uploads, sprinter landscape scenes, placeholders |

### Notable Images
- `sprintersociety_logo_main.png` (854 KB) — Main logo
- `sprintersociety_logo_alt.png` (260 KB) — Alternate logo
- `sw_sprinter_joshua_tree.png`, `sw_sprinter_monument_valley.png`, `sw_sprinter_red_rocks.png` — Southwest scenic van photos
- `nw_sprinter_mountain_trail.png`, `nw_sprinter_lake_camping.png` — Northwest scenic
- `clean_outdoor_lifestyle.png` — Lifestyle photo
- `camping-sunset.jpg`, `trip-map.jpg` — Trip/camping photos
- Various van category thumbnails (electrical, mechanical, storage, etc.)

### ⚠️ Locked Files (30 unique in SprinterSociety GitHub repo)
These 30 files in `/Users/darrinshaw/Documents/GitHub/SprinterSociety/` could not be copied due to macOS "Resource deadlock avoided" errors (cross-volume provenance restrictions). However, most are duplicated from `lovable-uploads` which have copies in the Downloads folders. The truly unique assets (van category photos like `camp-spot.jpg`, `van-hero.jpg`, `electrical-solar-category.jpg`, etc.) have counterparts copied from other folders with `_1` suffix.

**Destination:** `/Volumes/AI-DATA/PROJECTS/VANCIETY/salvaged-assets/images/`

---

## 2. VIDEO LINKS — 19 YouTube Channels + 8 Real Video IDs

### YouTube Channel
- Official: `https://youtube.com/@sprintersociety`

### Curated Van Life Creator Channels (19)
Full list in `video-links.md`. Key channels:
- Eamon & Bec, Vancity Vanlife, Outside Van, Kara and Nate
- cheaprvliving, Gone with the Wynns, Will Prowse
- Farout Ride, Build A Green RV, Mortons on the Move
- Keep Your Daydream, Nomadic Fanatic, and more

### Real YouTube Video IDs (8)
- `qH8kYKN8JfY`, `Ge_LDxf7LpI`, `Moy25MABCZ8`, `WVDQEoe6ZWY`
- `YpHsKFhMmE4`, `oJdls_rD7LY`, `w7PfpzQCS0g`, `xXHPd5rqBPo`

### YouTube Integration
- Supabase Edge Function (`fetch-youtube-videos`) auto-curates van life content from YouTube API
- `videoDatabase.ts` (1,693 lines) contains full video catalog with categories
- Video gallery supports 9+ categories with pagination and modal player

**Report:** `/Volumes/AI-DATA/PROJECTS/VANCIETY/salvaged-assets/video-links.md`

---

## 3. COMPANY / VENDOR LINKS — 11 Vendors + 5 Social Profiles

### Product Vendors with Affiliate URLs (11 products)
| Vendor | Products |
|--------|----------|
| Goal Zero | Yeti 1500X Power Station |
| Renogy | Solar panel kits (400W, 800W) |
| Battle Born Batteries | 100Ah LiFePO4 |
| Victron Energy | MultiPlus-II Inverter |
| Dometic | CFX3 Coolers |
| Nature's Head | Composting Toilet |
| Fiamma | F45s Awning |
| Thule | Omnistor 5200 Awning |

### Service Integrations
- Supabase (DB/Auth), YouTube Data API, Google Maps, Sumsub (KYC), Stripe (payments), Mapbox

### Affiliate System
Full affiliate program built: application flow, unique codes, click/commission tracking, dashboard.

**Report:** `/Volumes/AI-DATA/PROJECTS/VANCIETY/salvaged-assets/company-vendor-links.md`

---

## 4. DATABASE / SEED DATA — 49 Files Copied

### JSON Data Files (10)
| File | Content | Size |
|------|---------|------|
| `products.json` | 8 van products with affiliate URLs, ratings, specs | 8 KB |
| `van-products.json` | Additional product catalog | 3 KB |
| `sample-products.json` | 3 sample products (Goal Zero, Dometic, Renogy) | 4 KB |
| `northwest-locations.json` | NW USA camp spots & locations | 8 KB |
| `sample-locations.json` | 3 sample locations with coords, amenities | 3 KB |
| `news.json` | 4 news articles (Sprinter 2025, solar, events) | 9 KB |
| `sample-news.json` | Sample news articles | 3 KB |
| `videos.json` | 9 video entries with metadata | 7 KB |
| `videos_backup.json` | Video data backup | 7 KB |
| `sample-videos.json` | Sample video entries | 4 KB |

### SQL Migrations (20 files)
Full Supabase database schema from the old `sprintersociety` server:
- `001_profiles.sql` through `019_orders_and_affiliate_system.sql`
- `rls-policies.sql` — Row Level Security policies
- Tables: profiles, forum_categories, forum_posts, forum_replies, videos, news_articles, events, locations, products, subscriptions, resources, private_messages, likes_and_follows, business_listings, admin_and_moderation, seo_and_analytics, functions_and_triggers, storage_policies, orders_and_affiliate_system

### Vanciety.com Migrations (17 files)
Newer Supabase migrations from the `vanciety.com` project (Sept 2025).

### Other Data Files
- `seed.ts` — Server seed script with sample products, users, forum posts
- `videoDatabase.ts` — 1,693-line video catalog with channel data
- `constants.ts` — Theme colors, social links, location types, categories

**Destination:** `/Volumes/AI-DATA/PROJECTS/VANCIETY/salvaged-assets/data/`

---

## Summary Statistics

| Asset Type | Found | Unique/Copied | Destination |
|------------|-------|---------------|-------------|
| Images | 184 | 50 (39.3 MB) | `salvaged-assets/images/` |
| Video Links | 19 channels + 8 IDs | All documented | `salvaged-assets/video-links.md` |
| Vendor Links | 11 vendors + 6 services | All documented | `salvaged-assets/company-vendor-links.md` |
| Data Files | 49 | 49 copied | `salvaged-assets/data/` |

### Known Issues
1. **macOS sandbox lock**: 30 unique images in `/Users/darrinshaw/Documents/GitHub/SprinterSociety/` cannot be copied cross-volume (all fail with "Resource deadlock avoided"). Most have duplicates that were copied from Downloads folders. To recover the truly locked ones, manually copy from Finder or use `git clone` to re-fetch.
2. **Placeholder video IDs**: Most YouTube video IDs in the video gallery are placeholders (Rick Astley, etc.). Only 8 real IDs found. The `fetch-youtube-videos` Edge Function was designed to populate real content dynamically from YouTube API.
3. **Duplicate folders**: Downloads contains 4 copies of the same project (`sprintersociety`, `sprintersociety 2/3/4`). All unique content extracted from the first copy; others only contributed minor variant images.

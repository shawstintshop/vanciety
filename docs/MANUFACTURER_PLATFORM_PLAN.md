# Vanciety Manufacturer Platform — Plan

> Status: concept / planning. Branch: `feature/manufacturer-platform`. Not deployed.

## Vision (from Shaw)

Make Vanciety the **central hub** for van manufacturers (Sprinter conversions, vanlife, overland) and the people who buy from them. Each manufacturer gets a **dedicated, self-editable webpage** with:
- Full profile: name, location, website, socials, all brand details
- Product catalog (with sales/promos)
- Customer **ratings + comments**
- Self-service editing anytime
- **AI assistance** (Vanny) to help them manage their page/content
- **Social media post** integration tied back to Vanciety
- A **paid subscription**: concept pricing ~$499/mo or ~$1,900/yr (prices TBD)

Win-win: brands get a storefront + leads + AI/social tooling; buyers get one trusted hub.

## What already exists (reuse, don't rebuild)

- **Vendor platform** — `src/pages/Vendors.tsx` (467 lines), `src/pages/VendorSignup.tsx` (600 lines), with pricing tiers, a signup wizard, and **live** `vendors` / `vendor_products` / `vendor_reviews` tables. The manufacturer concept is the same shape; reuse its UI patterns and component structure.
- **Manufacturer migration** — `supabase/migrations/20260620021000_manufacturer_platform.sql` defines `manufacturer_profiles`, `manufacturer_products`, `manufacturer_subscriptions`, `manufacturer_analytics` with RLS. **Not yet applied** to the live DB (and depends on `has_role()` + `profiles.user_role`, which aren't live — needs reconciliation before applying).
- **AI** — `AIVanConcierge` / `VoiceVanny` (Vanny) components already exist to extend for manufacturer assistance.

### Vendors vs Manufacturers — decision
These are two lanes in the IA vision ("Brands" vs "Hire Help"). Recommendation: **manufacturers = product brands** (make/sell gear & vans), **vendors = service providers** (installs, repairs). Build manufacturers on the dedicated `manufacturer_*` model, reusing vendor UI patterns. Revisit merging later if they converge.

## Data model (from existing migration)

- `manufacturer_profiles` — business info, address (+ lat/lng for the map), branding (logo/banner/colors), description, specialties, verification status, subscription plan/status, plan limits (max_products, analytics_enabled, etc.)
- `manufacturer_products` — catalog: name/slug, category, pricing, images, specs, status, featured, view/click/inquiry counts
- `manufacturer_subscriptions` — Stripe records (plan, status, period, amount)
- `manufacturer_analytics` — view/click/inquiry/purchase events

## Pricing (concept — to finalize)

| Tier | Price (concept) | Includes |
|---|---|---|
| Pro Brand Page | ~$499/mo or ~$1,900/yr | Dedicated editable page, product catalog, ratings/comments, basic analytics, AI assist |
| (future) Enterprise | TBD | Featured placement, advanced analytics, priority support, more products/images |

Annual ($1,900) ≈ 3.2 months free vs monthly — good incentive. Validate against willingness-to-pay before locking in.

## Phased build sequence

**Phase 1 — Directory + pages (MVP, this session, seed data, NO prod DB)**
- Seed data file of real Sprinter/vanlife/overland manufacturers (name, location, lat/lng, website, socials, details, products).
- `/manufacturers` directory: searchable/filterable grid of brand cards.
- `/manufacturers/:slug` detail page: profile, products, ratings + comments (UI; local/seed for now).
- Nav entry ("Brands") + homepage chip already points here.
- Map layer: expose manufacturer locations to the merged map (lat/lng in seed data).

**Phase 2 — Accounts + self-editing**
- Apply a reconciled `manufacturer_platform` migration to the live DB (resolve `has_role`/`profiles.user_role` deps).
- Manufacturer signup/claim flow (reuse VendorSignup wizard pattern).
- Authenticated self-edit of profile + products; image uploads (Supabase Storage).
- Persist ratings/comments to DB with RLS (auth'd users comment; one rating per user).

**Phase 3 — Monetization**
- Stripe subscriptions ($499/mo, $1,900/yr); gate page publish/features by `subscription_status`.
- Plan limits enforcement (max products/images, analytics, featured).

**Phase 4 — AI + social + analytics**
- Vanny-assisted page/content/product copy generation.
- Social post composer tied to Vanciety (scheduled posts, share-to-socials).
- Manufacturer analytics dashboard (views/clicks/inquiries).

## MVP scope delivered this session
- Real manufacturer seed data, `/manufacturers` directory, `/manufacturers/:slug` detail with ratings + comments UI, nav wiring, and map-ready locations. Billing/auth-editor/AI/social are Phase 2+.

## Open questions for Shaw
1. Final pricing + tiers (is $499/mo the only tier, or Free/Pro/Enterprise like vendors?)
2. Manufacturers vs vendors — keep separate (recommended) or merge?
3. Which payment processor (Stripe assumed)?
4. Social platforms to integrate first (IG/FB/TikTok/YouTube)?
5. Verification process for claiming a brand page?

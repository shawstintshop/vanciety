# VANCIETY BUILD ROADMAP

Phase 0 output. Do not build until this discovery package is reviewed or accepted.

Generated: 2026-06-12T17:03:19.321647

## Recommended primary codebase
- `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app`
- Use staged source imports and discovered docs as migration references only. Do not treat Lovable or old Sprinter folders as source of truth.

## Recommended database architecture
- Supabase as primary backend: Auth, profiles, van cards, forums, marketplace listings, vendors, GPS opt-in locations, messages, event bookmarks, media metadata.
- PostgreSQL normalized tables with Row Level Security on all user-owned/community data.
- Supabase Storage for user-uploaded van, gear, listing, and profile images.
- Supabase Edge Functions for YouTube sync/oEmbed validation, Google Maps config proxy if needed, notifications, and payment/webhook isolation.
- Public verified fallback data remains in a typed source layer for videos, events, vendors, maps, and builder links when live tables are empty or unauthenticated.
- Payments/Stripe stay disabled until account, products, legal flow, and webhooks are verified.

## Recommended migration plan
1. Freeze PHASE 0 docs as discovery baseline.
2. Select canonical routes and merge old route ideas into Vanciety names.
3. Migrate verified content first: videos, events, vendors, camp/map resources, how-to categories.
4. Migrate frontend pages next: Camp Spots, How-To, Mods/Gear, Events, Dashboard, Messages/Member Network.
5. Wire backend tables/hooks with RLS and honest empty states.
6. Validate build/lint/routes locally.
7. Only then prepare deployment/DNS for vanciety.com.

## Recommended build order
1. Information architecture and navigation cleanup.
2. Verified source/content layer expansion.
3. Videos + category routes.
4. Events + camp/map resources.
5. Vendors/builders/mechanics/installers directory.
6. How-To/Mods/Gear knowledge hub.
7. Marketplace listings.
8. Forum/member network/messages.
9. Van Cards + user dashboard.
10. GPS/realtime opt-in features.
11. Backend hardening, RLS, storage, edge functions.
12. Deployment, analytics, monitoring.

## Critical missing components
- Authenticated Google Drive export/search is blocked until OAuth token exists.
- Supabase project credentials/login and production schema verification are incomplete.
- Public domain/hosting status for vanciety.com is not verified operational.
- Business/vendor directory needs final verification and ownership/affiliate rules.
- Payment/Stripe flow needs legal/product/business model decision.
- Member messaging/notifications need abuse/spam/privacy design.
- GPS requires explicit opt-in, privacy controls, and safe data retention policy.

## Estimated completion roadmap
- Phase 0 Discovery: complete with this document set.
- Phase 1 Architecture/IA: 0.5–1 day.
- Phase 2 Content migration and verified data layer: 1–2 days.
- Phase 3 Frontend pages/routes: 2–4 days.
- Phase 4 Supabase backend/RLS/storage/functions: 2–4 days depending on credentials.
- Phase 5 QA/local verification/deployment prep: 1–2 days.
- Phase 6 Public deployment/DNS/payment hardening: depends on account access and business decisions.

## Totals
- Total repositories found: 25
- Total folders inspected: 11160
- Total files indexed: 58208
- Total source roots with matches: 813
- Total content assets found: 21538
- Total features found: 41

## Raw machine-readable reports
- `/Volumes/AI-DATA/PROJECTS/VANCIETY/source_consolidation/phase0/20260612-170000`
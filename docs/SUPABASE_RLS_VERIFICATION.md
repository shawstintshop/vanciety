# Supabase RLS Verification — Phase 3B

Generated: 2026-06-15 23:56:36
Project: `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app`

## Verification scope

Static local verification from:

- `supabase/config.toml`
- `supabase/migrations/*.sql`
- `src/integrations/supabase/client.ts`
- `src/hooks/useVanLocation.tsx`
- `src/hooks/useRealtimeVanLocations.tsx`
- `src/hooks/useRealtimePresence.tsx`
- `supabase/functions/*/index.ts`

Live/local Supabase verification was attempted but blocked:

- Supabase CLI installed: `2.33.9`
- `supabase status`: failed because Docker daemon is not running
- `supabase db lint`: failed because local Postgres at `127.0.0.1:54322` refused connection
- `supabase migration list`: failed because project is not linked
- `supabase db reset --local`: **NOT RUN** because local Docker/Postgres was not available

## Summary

| Area | Status |
|---|---|
| Friend Finder exact/public GPS exposure | STATIC FIX PREPARED |
| Legacy `user_locations` exact-public path | STATIC FIX PREPARED in Phase 3B |
| YouTube public content writes by any authenticated user | STATIC FIX PREPARED in Phase 3B |
| Edge Function JWT config | STATIC FIX PREPARED in Phase 3B |
| Live RLS proof | BLOCKED |
| Production launch | BLOCKED |


## Table: profiles

Table: `profiles`  
RLS enabled: Yes, migration `20250915212510_8344a6cb-0b6e-4aa8-b157-e405b6f98128.sql`  
Policies found: public SELECT; owner INSERT; owner UPDATE  
User read rule: Public read of profile fields (`display_name`, `avatar_url`, `bio`, `location`, `van_type`, `instagram_handle`)  
User write rule: `auth.uid() = user_id` for insert/update  
Business owner rule: Not applicable  
Admin rule: None found  
Public exposure: Profile/public community-card fields are public  
Risk: Medium — public profile fields are acceptable only if the product treats them as intentional public profile data  
Verification status: STATIC PASS / LIVE NOT VERIFIED  
Required fix: Add privacy controls before adding private profile fields.

## Table: forum_posts

Table: `forum_posts`  
RLS enabled: Yes  
Policies found: public SELECT; authenticated owner INSERT; owner UPDATE  
User read rule: Public read of forum posts  
User write rule: `auth.uid() = user_id` for insert/update  
Business owner rule: Not applicable  
Admin rule: None found  
Public exposure: Forum content is public  
Risk: Medium — user-generated posts are public; moderation/admin workflow not verified  
Verification status: STATIC PASS / LIVE NOT VERIFIED  
Required fix: Add moderation/admin policies before production community launch.

## Table: marketplace_items

Table: `marketplace_items`  
RLS enabled: Yes  
Policies found: public SELECT; authenticated owner INSERT; owner UPDATE  
User read rule: Public read of listings  
User write rule: `auth.uid() = user_id` for insert/update  
Business owner rule: Not applicable  
Admin rule: None found  
Public exposure: Listings are public marketing/marketplace data  
Risk: Medium — contact/payment/sensitive seller info must not be added to public row fields without separate policy  
Verification status: STATIC PASS / LIVE NOT VERIFIED  
Required fix: Add moderation/admin policies and payment-safe workflow before live marketplace launch.

## Table: vendors

Table: `vendors`  
RLS enabled: Yes  
Policies found: public SELECT; authenticated owner INSERT; owner UPDATE  
User read rule: Public read of vendor directory records  
User write rule: `auth.uid() = user_id` for insert/update  
Business owner rule: Business owner inferred by `user_id`; owner can update own vendor profile  
Admin rule: None found  
Public exposure: Vendor name/category/location/site/contact fields are public  
Risk: Medium — verified flag has no admin-only enforcement in current policies  
Verification status: STATIC WARNING / LIVE NOT VERIFIED  
Required fix: Add admin/server-side verification control before allowing `verified=true` changes in production.

## Table: youtube_videos

Table: `youtube_videos`  
RLS enabled: Yes  
Policies found: public SELECT; old authenticated manage policy; Phase 3B migration drops direct manage policy  
User read rule: Public read only  
User write rule: No direct client write after migration `20260615235500_harden_youtube_video_writes.sql`  
Business owner rule: Not applicable  
Admin rule: Server-side ingestion through Edge Function/service role only  
Public exposure: Video metadata is intentionally public  
Risk: Low after migration; was Medium before Phase 3B because any authenticated user could manage videos  
Verification status: STATIC FIX PREPARED / LIVE NOT VERIFIED  
Required fix: Apply migration and verify direct authenticated insert/update/delete fails.

## Table: locations

Table: `locations`  
RLS enabled: Yes  
Policies found: public SELECT; owner INSERT; owner UPDATE  
User read rule: Public map/location data  
User write rule: `auth.uid() = user_id` for insert/update  
Business owner rule: Not applicable  
Admin rule: None found  
Public exposure: Public map pins include lat/lng for campsites/events/businesses  
Risk: Medium — public pins are acceptable for non-private/public POI data only; seeded/sample data must be removed/verified before launch  
Verification status: STATIC WARNING / LIVE NOT VERIFIED  
Required fix: Ensure no private member/home/driveway exact locations are stored as public `locations` rows.

## Table: user_locations

Table: `user_locations`  
RLS enabled: Yes  
Policies found: old public exact SELECT and own manage policy; Phase 3B migration drops both  
User read rule: Own deprecated row only after migration  
User write rule: No direct INSERT/UPDATE after migration `20260615235000_deprecate_exact_user_locations.sql`  
Business owner rule: Not applicable  
Admin rule: None found  
Public exposure: Public exact exposure removed by Phase 3B migration  
Risk: High before Phase 3B; Low/Deprecated after migration  
Verification status: STATIC FIX PREPARED / LIVE NOT VERIFIED  
Required fix: Apply migration and verify anonymous/authenticated non-owner cannot read exact rows.

## Table: van_locations

Table: `van_locations`  
RLS enabled: Yes  
Policies found: old public exact SELECT/direct owner writes; Phase 3 migration drops public/direct insert/update and creates authenticated approximate SELECT  
User read rule: Authenticated users can read `friends_only` + `approximate` + active rows only  
User write rule: Active writes must go through `upsert_van_location()` RPC; direct insert/update policy intentionally not recreated  
Business owner rule: Not applicable  
Admin rule: None found  
Public exposure: None intended after Phase 3 migration  
Risk: Low after Phase 3 migration; live verification still required  
Verification status: STATIC FIX PREPARED / LIVE NOT VERIFIED  
Required fix: Apply migration and verify anonymous deny, authenticated approximate-only read, direct insert/update deny, owner delete works.

## Table: gps_sharing_settings

Table: `gps_sharing_settings`  
RLS enabled: Yes  
Policies found: owner SELECT/INSERT/UPDATE  
User read rule: `auth.uid() = user_id`  
User write rule: `auth.uid() = user_id`; Phase 3 migration normalizes defaults to `friends_only` + `approximate`  
Business owner rule: Not applicable  
Admin rule: None found  
Public exposure: None intended  
Risk: Low after Phase 3 migration  
Verification status: STATIC FIX PREPARED / LIVE NOT VERIFIED  
Required fix: Apply migration and verify old public/exact defaults are normalized.

## Table: memberships

Table: `memberships`  
RLS enabled: Table not found in migrations  
Policies found: None  
User read rule: Not implemented  
User write rule: Not implemented  
Business owner rule: Not implemented  
Admin rule: Not implemented  
Public exposure: None from local schema because table absent  
Risk: Future blocker — membership/paywall is not implemented/verified  
Verification status: ABSENT / BLOCKED FOR MEMBERSHIP LAUNCH  
Required fix: Add membership schema/RLS before paid/member gating launch.

## Table: businesses / ads / admin / support / AI conversations / uploaded files / analytics

Table: `businesses`, `ads`, `admin`, `support`, `ai_conversations`, `uploaded_files`, `analytics_events`  
RLS enabled: Tables not found in migrations  
Policies found: None  
User read rule: Not implemented  
User write rule: Not implemented  
Business owner rule: Not implemented  
Admin rule: Not implemented  
Public exposure: None from local schema because tables absent  
Risk: Future blocker — these product surfaces are not production-ready because schema/policies do not exist  
Verification status: ABSENT / NOT IMPLEMENTED  
Required fix: Create schemas and RLS before launching those features.


## Required live verification commands

Run only after local Docker/Supabase is safe or against a staging project:

```bash
supabase status
supabase db lint
supabase migration list
supabase db reset --local
```

Then verify with anonymous and authenticated clients that:

- anonymous cannot read `van_locations`
- anonymous cannot execute `upsert_van_location`, `nearby_member_van_areas`, or `nearby_vans`
- authenticated users can only read approximate active member-area rows
- authenticated direct insert/update to `van_locations` fails
- authenticated owner can use `upsert_van_location()`
- authenticated owner can delete own `van_locations` row
- anonymous/non-owner cannot read exact `user_locations`
- direct authenticated writes to `youtube_videos` fail

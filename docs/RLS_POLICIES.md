# RLS Policies — Phase 3B Static Inventory

Generated: 2026-06-15 23:56:36

## Source of truth used

Static migration files under:

`/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/supabase/migrations/`

## Current policy model after Phase 3B migrations are applied

| Table | Intended read | Intended write | Public exposure | Status |
|---|---|---|---|---|
| `profiles` | Public profile card fields | owner insert/update | intentional public profile fields | STATIC WARNING |
| `forum_posts` | Public forum posts | owner insert/update | intentional public community content | STATIC WARNING |
| `marketplace_items` | Public listing data | owner insert/update | intentional public listing content | STATIC WARNING |
| `vendors` | Public vendor directory | owner insert/update | intentional public business directory | STATIC WARNING |
| `youtube_videos` | Public video metadata | server/service role only after Phase 3B | intentional public marketing content | STATIC FIX PREPARED |
| `locations` | Public non-private map pins | owner insert/update | intentional public POI/event/business pins | STATIC WARNING |
| `user_locations` | owner-only deprecated row after Phase 3B | no direct insert/update after Phase 3B | none intended | STATIC FIX PREPARED |
| `van_locations` | authenticated approximate active member areas after Phase 3 | RPC only for active writes | none intended for anonymous | STATIC FIX PREPARED |
| `gps_sharing_settings` | owner-only | owner-only | none intended | STATIC FIX PREPARED |

## Phase 3B policy fixes prepared

### `user_locations`

Migration:

`supabase/migrations/20260615235000_deprecate_exact_user_locations.sql`

Prepared fixes:

- rounds existing rows to area-level grid
- sets existing rows `is_public=false`
- sets existing rows `status='offline'`
- drops public exact read policy
- drops direct owner manage policy
- recreates owner SELECT only
- recreates owner DELETE only
- does not recreate INSERT/UPDATE

### `youtube_videos`

Migration:

`supabase/migrations/20260615235500_harden_youtube_video_writes.sql`

Prepared fixes:

- keeps public SELECT
- drops `Only authenticated users can manage videos`
- does not recreate client write policies
- requires server/service-role ingestion path for writes

### `van_locations`

Migration:

`supabase/migrations/20260615232500_secure_friend_finder_member_areas.sql`

Prepared fixes:

- drops public exact read policy
- drops direct insert/update policies
- authenticates approximate member-area read
- forces writes through `upsert_van_location()` RPC
- revokes function execute from `PUBLIC`/`anon`
- grants function execute to `authenticated`

## Remaining RLS work

- Live/local Supabase RLS behavior must be verified after Docker/Supabase is available.
- Admin role model is not implemented.
- Moderation/admin workflows are not implemented for forum, marketplace, vendor verification, or location verification.
- Membership/paywall schema is not implemented.
- Storage/upload buckets are not implemented.
- AI conversation persistence is not implemented.
- Analytics tables are not implemented.

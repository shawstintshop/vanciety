# VANCIETY VAN HUB WEBSITE SPEC

## Page/module name

Working name: **Van Intelligence Hub**

This should become a major section of Vanciety, not a random blog page. It should feed multiple areas of the site: Home, Videos, Events, Marketplace, Vendors, Map, Forum, Van Cards, Member Builds, and Newsletter.

## Primary promise

“Everything Sprinter van owners need: events, builds, videos, products, mechanics, marketplace deals, trip ideas, groups, and trusted community rankings — organized in one place.”

## Core navigation sections

1. **Today**
   - newest verified YouTube video
   - newest marketplace listings
   - new deals/sales
   - upcoming events this week
   - newest member builds

2. **Events & Shows**
   - calendar view
   - map view
   - this week / this month / this season
   - van expos, overland expos, Revel rallies, meetups, trips

3. **Deals & Marketplace**
   - Sprinter vans for sale
   - Revel vans for sale
   - custom vans
   - parts/accessories
   - eBay sales
   - retailer sales
   - used parts
   - saved searches / alerts

4. **Videos & Builds**
   - latest YouTube videos
   - build tours
   - tips/tricks/help
   - electrical/solar
   - stereo/audio
   - tires/wheels
   - accessories
   - van tours
   - trips/adventures

5. **Vendors & Mechanics**
   - mechanics by region
   - builders/upfitters
   - installers
   - dealers
   - tire shops
   - audio/stereo shops
   - Mercedes/Sprinter specialists
   - fire ratings and reviews

6. **Forums & Groups**
   - public forums
   - private group index
   - best threads
   - common fixes
   - owner reports
   - buyer warnings

7. **Member Builds**
   - upload images/videos
   - build profiles
   - van cards
   - event albums
   - product reviews
   - before/after

8. **Newsletter**
   - daily brief
   - weekly outlook
   - this month’s shows
   - best deals
   - newest videos
   - top community posts

## Data model concepts

### Source

- id
- name
- source_type: official / marketplace / forum / social / video / vendor / member / ai_summary
- url
- access_status: public / auth_required / private / blocked / unknown
- update_frequency
- last_checked_at
- trust_level

### VanItem

Generic indexed item for events, listings, videos, products, forum threads, businesses, and member uploads.

- id
- title
- item_type
- source_id
- source_url
- source_badge
- category
- tags
- vehicle_fitment
- price
- location
- starts_at
- ends_at
- published_at
- first_seen_at
- last_seen_at
- thumbnail_url
- summary
- status
- ranking_score
- fire_rating_average
- fire_rating_count

### BusinessProfile

- id
- name
- type: mechanic / installer / builder / dealer / vendor / manufacturer / shop
- address
- city
- state
- country
- phone
- website
- map_url
- specialties
- source_badge
- fire_rating_average
- review_count

### MemberUpload

- id
- member_id
- van_card_id
- title
- media_type
- media_url
- thumbnail_url
- category
- tags
- moderation_status
- created_at

### FireRating

- id
- user_id
- target_type
- target_id
- fire_score: 1-5
- review_text
- created_at

## AI integration points

Use AI where it helps organization, not where it invents facts.

1. Categorize new listings/videos/events.
2. Summarize forum threads into concise takeaways with source URLs.
3. Detect vehicle fitment: Sprinter / Revel / Transit / Promaster / universal.
4. Detect product category: tires, stereo, solar, racks, suspension, interior, plumbing, heating/AC.
5. Generate daily/weekly newsletter drafts from verified items.
6. Flag duplicates and stale/dead listings.
7. Suggest related content: videos ↔ products ↔ forum threads ↔ vendors.

## UI design requirements

- Top-tier professional design.
- Clean layout, strong filtering, no clutter.
- Subtle topo-contour background detail only.
- Fire ratings instead of star ratings.
- Cards should show source badge and freshness.
- Calendar should support week/month/list view.
- Marketplace should support saved searches and alert badges.
- Video library should show newest verified video on home page.
- Member upload areas should be simple and mobile-first.

## MVP implementation order

1. Create source registry and static verified seed data.
2. Add Van Intelligence Hub page shell with filters and categories.
3. Add Events calendar/list using verified public event sources.
4. Add Marketplace/Deals feed using public search links and manually verified seed items.
5. Add Videos category page with verified YouTube IDs and latest-video slot.
6. Add Vendors/Mechanics directory model and UI.
7. Add FireRating component and rating schema.
8. Add Member Builds upload model and moderation queue.
9. Add scheduled watcher outputs into data pipeline.
10. Add newsletter generation and archive page.

## Non-negotiables

- No fake prices.
- No fake events.
- No fake reviews.
- No fake listings.
- No fake ratings.
- If a source requires login, show `AUTH_REQUIRED`.
- If availability cannot be verified, show `UNKNOWN`.
- Always preserve source links.

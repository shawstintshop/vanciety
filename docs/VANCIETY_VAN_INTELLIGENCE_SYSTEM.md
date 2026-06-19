# VANCIETY VAN INTELLIGENCE SYSTEM

## Mission

Vanciety should become the central operating system for Sprinter van owners, Revel owners, van builders, overland travelers, vendors, mechanics, installers, events, marketplace deals, YouTube videos, forums, groups, trips, and community knowledge.

The system should continuously discover, organize, categorize, rank, and publish useful van-related information into the proper Vanciety website areas.

## Full-time agent role

Agent name: **Vanciety Van Intelligence Agent**

Primary responsibilities:

1. Monitor public web sources for new Sprinter/van/overland events, sales, videos, forum threads, and marketplace listings.
2. Track Sprinter van products and accessories across official retailers, eBay, marketplaces, and community sale posts.
3. Organize every item by category, vehicle relevance, source, freshness, and verification status.
4. Feed website sections with structured data.
5. Produce a daily/weekly newsletter brief.
6. Flag login/API blockers for private sources like Facebook Groups, private forums, eBay saved searches, Google Drive, and YouTube API.
7. Never invent prices, dates, ratings, or availability.

## Website areas this should feed

### 1. Home page

- Newest verified YouTube upload for van life / Sprinter / van builds / van tours / tips / tricks / accessories.
- This week’s major events and shows.
- Hot deals / new listings.
- Top-rated vendors/mechanics/products using Vanciety fire rating.
- Fresh community uploads.

### 2. Events / Shows / Trips

Content types:

- Van expos
- Overland expos
- Adventure van events
- Mercedes Sprinter meetups
- Revel rallies
- Regional van-life gatherings
- Trips, routes, adventures, caravans
- Camping/boondocking meetups

Fields:

- title
- date range
- location
- official URL
- source badge
- category
- region
- cost/ticket URL if verified
- add-to-calendar action
- related vendors/builders
- related videos

### 3. Marketplace / Deals

Content types:

- Sprinter vans for sale
- Revel vans for sale
- custom vans for sale
- accessories
- tires
- stereos/audio
- racks/ladders
- solar/electrical
- fridges
- heaters
- water/plumbing
- seats/interiors
- suspension
- wheels
- used parts
- eBay sales
- Facebook Marketplace leads
- forum classifieds

Fields:

- item title
- price
- seller/source
- URL
- condition
- location
- vehicle fitment
- category
- first seen
- last seen
- price history if available
- urgency / deal score
- source badge

### 4. Forums / Groups / Community

Source types:

- Sprinter Source
- Revel forums/groups
- van-life forums
- overland forums
- Reddit communities
- Facebook groups, if authenticated access is available
- manufacturer communities

Fields:

- group/forum name
- URL
- topic category
- access status: public / login required / private / unknown
- useful thread links
- Vanciety import recommendation

### 5. Vendors / Mechanics / Installers / Dealers

Entity types:

- Mercedes Sprinter mechanics
- Sprinter service centers
- local mechanics
- upfitters
- van builders
- installers
- audio/stereo installers
- tire shops
- suspension specialists
- electrical/solar installers
- dealers
- manufacturers

Fields:

- business name
- category
- address
- service area
- phone/email if public
- official website
- map link
- verified source
- member fire rating
- review count
- notes

### 6. YouTube / Media Library

Categories:

- Newest uploads
- Sprinter vans
- Revel
- van builds
- van tours
- tips/tricks/help
- stereo/audio
- tires/wheels
- accessories
- solar/electrical
- plumbing
- heating/AC
- storage/interiors
- marketplace reviews
- event recaps
- trips/adventures

Rules:

- Validate YouTube IDs before showing.
- Do not use fake/demo IDs.
- Store channel, title, published date, thumbnail, category, and source query.
- Home page should always show the newest verified relevant video.

### 7. Member Build Gallery

Member-generated content:

- van build photos
- video uploads/links
- event photos
- trip/adventure logs
- product reviews
- mechanic reviews
- vendor reviews

Requirements:

- Auth required for upload.
- Supabase Storage or equivalent for images/videos/thumbnails.
- Moderation queue before public display.
- Attribution and member profile link.

## Fire rating system

Replace star ratings with tiny fire icons.

Scale:

- 1 fire: poor / not recommended
- 2 fires: below average
- 3 fires: solid / usable
- 4 fires: strong recommendation
- 5 fires: FIRE / top-tier

UI label examples:

- `🔥🔥🔥🔥🔥 FIRE`
- `🔥🔥🔥🔥 Recommended`
- `🔥🔥🔥 Solid`

Fire ratings apply to:

- products
- mechanics
- vendors
- dealers
- installers
- builders
- listings
- forum answers
- camp spots
- routes/trips
- videos

## Source truth rules

- Public official source = `OFFICIAL`.
- Marketplace/listing URL = `LIVE_LISTING` until unavailable.
- User-added item = `MEMBER_SUBMITTED`.
- Login-only source = `AUTH_REQUIRED`.
- Private Facebook group = `PRIVATE_SOURCE` unless the user grants access.
- AI summary = `AI_SUMMARY` and must point to real source URLs.
- Unknown date/price/address stays `UNKNOWN`.

## Login/API needs

Likely needed for complete coverage:

- Facebook Groups / Marketplace access.
- eBay saved searches or Browse API for reliable deal/listing monitoring.
- YouTube Data API for newest uploads by query/channel at scale.
- Google Calendar if Vanciety publishes event calendars.
- Supabase login/project access for website persistence.
- Google Drive OAuth if source files are in Drive.

## Build principle

The website must be professional, clean, top-designer quality, and deeply useful. The intelligence system should be structured first, then surfaced into Vanciety pages with source badges, filters, maps, calendars, fire ratings, and member uploads.

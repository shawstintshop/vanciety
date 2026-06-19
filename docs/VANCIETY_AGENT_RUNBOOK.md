# VANCIETY AGENT RUNBOOK

## Agent: Vanciety Van Intelligence Agent

This is the full-time monitoring and organization lane for all Sprinter/van/overland content.

## Operating rules

1. Verified data only.
2. Keep source links on every item.
3. Do not invent prices, dates, ratings, addresses, availability, or event details.
4. If login/API access is required, mark `AUTH_REQUIRED` and report it.
5. Private Facebook groups or member-only communities are not scraped unless the user explicitly grants access.
6. Do not build or publish unreviewed data into production.
7. Daily newsletter should separate confirmed items from leads.

## Recurring jobs

### Every 4 hours: Van Intelligence Watcher

Purpose:

- Find new listings, sales, events, forum threads, videos, and vendor updates.
- Prioritize freshness and time-sensitive deals.
- Report notable changes.

Scan targets:

- eBay Sprinter/Revel searches
- official event calendars
- public van marketplaces
- public forums
- YouTube queries
- official vendor/builder sites

Output:

- concise Telegram update
- source links
- blocked sources/login notes

### Daily: Van Newsletter Brief

Purpose:

- Summarize what is new this week/month.
- Pull together events, deals, videos, forum threads, products, vendors, and member-upload needs.

Output sections:

1. This week’s events.
2. This month’s events.
3. Newest verified videos.
4. Hot deals / new listings.
5. Forum/community topics.
6. Vendor/mechanic updates.
7. Build/product categories to update.
8. Login/API blockers.

## Website build lane

The agent feeds Vanciety, but website changes should happen in a controlled build lane:

1. Expand source registry.
2. Convert source outputs into typed data.
3. Build Van Intelligence Hub UI.
4. Add Events calendar.
5. Add Marketplace/Deals pages.
6. Add FireRating component.
7. Add Member Build upload flow.
8. Add YouTube latest-video home module.
9. Add newsletter archive page.
10. Verify build/lint/routes.

## Required future integrations

- eBay Browse API or saved search automation.
- YouTube Data API.
- Facebook login/manual export path for groups/marketplace.
- Supabase database tables and RLS.
- Supabase Storage for member media uploads.
- Google Calendar/ICS generation for event pages.
- Optional email provider for newsletter delivery.

## Login/access requests to ask user for

Ask only when needed:

- Facebook account/session for private groups and Marketplace.
- eBay account/API keys or saved-search access for real-time sale alerts.
- YouTube API key for scalable newest-video monitoring.
- Supabase access token/project credentials.
- Google OAuth for Drive/Calendar/Docs if private source docs or calendar publishing are needed.

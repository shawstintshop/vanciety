# Vanciety Affiliate / Revenue Program Join Checklist

Generated: 2026-06-14

Purpose: join and track the affiliate, commerce, email, social, analytics, and print-on-demand accounts needed for the Vanciety daily briefing / product / merch revenue engine.

Rules:
- Do not store passwords, API keys, OAuth tokens, or full payout/banking details in this repo.
- Store only public program links, approved tracking IDs, and non-sensitive status.
- Disclose affiliate links clearly on Vanciety and in social/email posts.
- Do not post to private groups or scrape private group data without permission and group-rule review.

## Priority 1 — Join first

### Amazon Associates
- Join: https://affiliate-program.amazon.com/
- Status: received and configured locally as `VANCIETY_AMAZON_AFFILIATE_TAG` in ignored `.env.local`.
- Use for: broad van gear, solar, batteries, kitchen, storage, tint/privacy, safety, tools.
- Local note: old Sprinter Society downloads reference `sprintersociety-20`; current provided Vanciety tag is configured locally. Verify inside Amazon Associates before heavy publishing.

### eBay Partner Network
- Join: https://partnernetwork.ebay.com/
- Use for: van parts, used gear, OEM parts, accessories, marketplace/deal content.
- Env placeholder: `VANCIETY_EBAY_CAMPAIGN_ID=`

### AvantLink
- Join: https://www.avantlink.com/
- Use for: outdoor/overland brands, specialty gear, independent merchants.

### Impact
- Join: https://impact.com/
- Use for: large brand partner programs and possible REI/retail programs.

### CJ Affiliate
- Join: https://www.cj.com/
- Use for: retail/travel/service affiliate programs.

### Awin / ShareASale
- Awin: https://www.awin.com/us/
- ShareASale now redirects into Awin onboarding: https://www.awin.com/us/getting-started-sas
- Use for: smaller brands, lifestyle products, ecommerce programs.

### Rakuten Advertising
- Join: https://rakutenadvertising.com/
- Use for: retail programs and brand-direct partnerships.

## Priority 2 — Van / travel / outdoor programs to check

### Backcountry
- Program page: https://www.backcountry.com/sc/affiliate-program
- Use for: outdoor gear, camp gear, clothing, packs, recovery/travel gear.
- Automated check may return 403; open in browser.

### Outdoorsy
- Program page: https://www.outdoorsy.com/affiliate
- Use for: RV/van rentals and travel content.
- Automated check may return 403; open in browser.

### RVshare
- Start: https://rvshare.com/affiliate
- If unavailable, search inside CJ/Impact/PartnerStack or browser-search `RVshare affiliate program`.

### Harvest Hosts
- Start: https://harvesthosts.com/affiliate-program/
- If unavailable, search browser or affiliate networks for current partner program.

### The Dyrt
- Start: https://thedyrt.com/affiliates
- Use for: camping and trip-planning content.
- Automated check may fail; open in browser.

### iOverlander
- Site: https://ioverlander.com/
- Use for: source/reference only unless a partner program exists. Do not scrape private/user-sensitive location data.

## Priority 3 — Power / battery / van gear brands

### BLUETTI
- Join: https://www.bluettipower.com/pages/affiliate-program
- Use for: portable power, solar generators, battery content.

### EcoFlow
- Start: https://www.ecoflow.com/us/affiliate-program
- If unavailable, search inside Impact / CJ / PartnerStack or browser-search `EcoFlow affiliate program`.

### Renogy
- Start: https://www.renogy.com/affiliate-program
- If unavailable, search browser or affiliate networks for current partner program.

### Battle Born Batteries
- Start: https://battlebornbatteries.com/affiliate-program/
- If unavailable, search browser or affiliate networks for current partner program.

### Victron Energy
- Site: https://www.victronenergy.com/
- Note: usually distributor/dealer-driven. Use reputable dealer affiliate programs if available; do not imply official affiliate status unless verified.

## Print-on-demand / merch

### Printful
- https://www.printful.com/
- Good for quality-control, Shopify/Etsy integrations, apparel, hats, stickers, mugs.

### Printify
- https://printify.com/
- Good for broad product catalog and price testing.

### Fourthwall
- https://fourthwall.com/
- Good for creator storefronts, merch drops, memberships, digital products.

### Gelato
- https://www.gelato.com/
- Good for global print network and some wall-art/poster products.

## Email / audience tools

### Beehiiv
- https://www.beehiiv.com/
- Good for newsletter growth and sponsorship/ad-network path.

### ConvertKit / Kit
- https://kit.com/
- Good for creator email funnels and digital products.

### Mailchimp
- https://mailchimp.com/
- Good general email marketing; less creator-native than Beehiiv/Kit.

## Google / tracking / commerce APIs

There is no current Google Affiliate Network equivalent to join. The likely Google-related systems are:

### Google Ads API
- Docs: https://developers.google.com/google-ads/api/docs/get-started/introduction
- Use for: ads reporting/automation after ad account setup.

### Google Merchant Center
- Start: https://business.google.com/us/merchant-center/
- Use for: product feed / Google Shopping presence if Vanciety sells merch/products.

### Content API for Shopping
- Docs: https://developers.google.com/shopping-content/guides/quickstart
- Use for: programmatic product feed management after Merchant Center setup.

### Google Analytics
- Start: https://analytics.google.com/
- Use for: conversion tracking, revenue attribution, audience behavior.

### Google Tag Manager
- Start: https://tagmanager.google.com/
- Use for: click/conversion tracking tags without code redeploys.

## Existing local findings

- Empty affiliate doc placeholders found:
  - `/Volumes/AI-DATA/PROJECTS/creative/VanlifeTopo/AFFILIATE_LINKS.md`
  - `/Volumes/AI-DATA/PROJECTS/vanciety_platform/content/topo/AFFILIATE_LINKS.md`
- Old Sprinter Society website downloads mention Amazon tag `sprintersociety-20`; verify in Amazon Associates before using.
- Old Sprinter Society downloads include affiliate dashboard/link tracking ideas that can be migrated later.
- No verified local `Google affiliate API` credential was found. Google-related local hits were mostly Google Maps, Google AI/Vision notes, Google Cloud/OAuth, Google Ads/Merchant/Shopping docs, and build artifacts. Do not assume any key is active until checked in Google Cloud Console.

## Next implementation tasks

1. Add affiliate config env variables to Vanciety `.env.example`.
2. Add affiliate disclosure component/footer.
3. Build `src/data/affiliatePartners.ts` with program status and approved tracking IDs.
4. Build click tracking table/event for affiliate clicks.
5. Wire `scripts/update-van-news.mjs` to use approved affiliate tags only.
6. Add admin/editor UI for product links and disclosure status.
7. Connect email capture provider.
8. Connect POD provider/storefront.

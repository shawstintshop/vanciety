# Vanciety / SprinterSociety — Company, Vendor & Partner Links

> Extracted from all old project folders on 2025-06-17

## Official Social Media Accounts
| Platform | URL |
|----------|-----|
| Instagram | https://instagram.com/sprintersociety |
| YouTube | https://youtube.com/@sprintersociety |
| Facebook | https://facebook.com/sprintersociety |
| Twitter/X | https://twitter.com/sprintersociety |
| TikTok | https://tiktok.com/@sprintersociety |

## Product Vendors & Affiliate Links

### Power & Solar
| Company | Product | Affiliate URL |
|---------|---------|--------------|
| Goal Zero | Yeti 1500X Portable Power Station | https://goalzero.com/shop/power-stations/goal-zero-yeti-1500x-portable-power-station/ |
| Goal Zero | Yeti 1500X (alt) | https://www.goalzero.com/yeti-1500x |
| Renogy | 400W Solar Panel Kit | https://renogy.com/400-watt-solar-panel-kit/ |
| Renogy | 800W Solar Kit | https://www.renogy.com/800-watt-solar-kit |
| Battle Born Batteries | 100Ah 12V LiFePO4 Battery | https://battlebornbatteries.com/product/100ah-12v-lifepo4-deep-cycle-battery/ |
| Victron Energy | MultiPlus-II | https://victronenergy.com/inverters-chargers/multiplus-ii |

### Appliances & Accessories
| Company | Product | Affiliate URL |
|---------|---------|--------------|
| Dometic | CFX3 55IM Cooler | https://dometic.com/en-us/us/products/food-and-beverage/coolers/electric-coolers/dometic-cfx3-55im-_-110311 |
| Dometic | CFX3 95DZ | https://www.dometic.com/cfx3-95dz |
| Nature's Head | Composting Toilet | https://natureshead.net/ |

### Awnings & Exterior
| Company | Product | Affiliate URL |
|---------|---------|--------------|
| Fiamma | F45s Cassette Awning | https://fiamma.com/en/awnings/cassette-awnings/f45s |
| Thule | Omnistor 5200 | https://thule.com/en-us/rv/awnings/thule-omnistor-5200-_-307684 |

## API / Service Integrations
| Service | Purpose | Notes |
|---------|---------|-------|
| Supabase | Database & Auth | Primary backend (both old and new) |
| YouTube Data API v3 | Video content fetching | Edge Function for auto-curating van life videos |
| Google Maps | Directions & mapping | Used in InteractiveMapComponent |
| Sumsub | Identity verification | KYC/identity service (api.sumsub.com) |
| Stripe | Payments | Subscription & e-commerce |
| Mapbox | Interactive maps | Location/camp spot mapping |

## Location Types & Categories (from constants.ts)
The platform defined these location/business types:
- Camp Spots
- Parking (urban/stealth)
- Van-Friendly Business
- Driveway Surfing (member driveways for overnight parking)

## Affiliate System
The old platform had a full affiliate system:
- Users could apply to become affiliates
- Unique affiliate codes generated (`SS` prefix)
- Commission tracking per click/conversion
- Dashboard for affiliate stats
- Product affiliate URLs embedded in product listings

## Source Files
- `/Downloads/sprintersociety/src/utils/constants.ts` — Social links, location types, theme
- `/Downloads/sprintersociety/dist/data/products.json` — Product catalog with affiliate URLs
- `/Downloads/sprintersociety/dist/data/sample-products.json` — Sample product data
- `/Downloads/sprintersociety/server/src/routes/affiliates.ts` — Affiliate system routes
- `/Downloads/sprintersociety/server/src/scripts/seed.ts` — Seed data with products/affiliates

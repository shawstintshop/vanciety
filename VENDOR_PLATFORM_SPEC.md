# SHAW - URGENT VENDOR PLATFORM SPEC

## What You Need (Based on Your Message)

### 1. Vendor Self-Service Signup
- Vendors can create accounts
- Upload business info
- Pay subscription (monthly)
- Get verified by admin

### 2. Categories (All Van Life)
- Van Builders (custom conversions)
- Manufacturers (vehicle makers - Mercedes, Ford, RAM)
- Parts & Components (Victron, Dometic, MaxxAir, etc.)
- Tours & Experiences (guided van life tours)
- Rentals (rent-a-van services)
- Upfitters & Installers (professional install services)
- Accessories & Gear (camping, solar, water systems)
- Amazon Affiliate Links (related products with commission)
- Services (insurance, registration, consultation)
- Dealerships (selling complete vans)

### 3. What Vendors Can Upload
- Business logo
- Product/service images (unlimited)
- Videos (YouTube embeds or uploads)
- Product descriptions
- Pricing
- Contact info
- Website/shop links
- Location/service areas

### 4. Latest Tech Stack (Simple, Fast, Secure)
✅ **Already have:**
- Supabase (PostgreSQL database - industry standard, secure)
- Row Level Security (RLS) - enterprise-grade security
- Real-time subscriptions
- Built-in auth (email, OAuth)
- Storage for images/videos
- Edge Functions for webhooks

✅ **Need to add:**
- Stripe for payments (industry standard, PCI compliant)
- Cloudinary or Supabase Storage for media (images/videos)
- AI integration options:
  - OpenAI GPT-4 Vision for auto-categorization
  - Claude for product description generation
  - Replicate for image optimization
  - Perplexity for market research

### 5. Signup Flow
1. Vendor visits /vendors/signup
2. Creates account (email + password or Google OAuth)
3. Fills business form (name, category, description)
4. Uploads logo + initial images
5. Chooses subscription tier (Basic $49, Pro $149, Enterprise $249)
6. Stripe Checkout → pays
7. Redirects to dashboard
8. Admin verifies business (manual check)
9. Goes live on /vendors page

### 6. AI Features To Add
- **Auto-categorization**: Upload product image → AI suggests category
- **Description generator**: AI writes compelling product descriptions
- **Image optimization**: Auto-resize, compress, format conversion
- **SEO optimization**: AI generates meta tags, alt text
- **Competitor analysis**: AI research similar vendors
- **Price recommendations**: AI suggests competitive pricing

## Immediate Build Plan

**Phase 1 (TODAY - Next 3 hours):**
1. Fix broken /vendors page (make it load)
2. Create vendor signup form
3. Create vendor dashboard (basic)
4. Stripe integration (payment flow)
5. Image upload to Supabase Storage
6. Admin verification interface

**Phase 2 (TOMORROW):**
7. AI auto-categorization (OpenAI Vision API)
8. AI description generator
9. Video upload/embed support
10. Amazon affiliate link tracking
11. Analytics dashboard
12. Public vendor profiles

## Questions for SHAW

1. **Pricing tiers** - Still $49/149/249 or different?
2. **Admin verification** - Manual or auto-approve?
3. **Commission** - Take % of sales or flat monthly fee only?
4. **Amazon affiliate** - Your affiliate ID or vendors bring their own?
5. **AI features** - Which ones are must-have vs nice-to-have?

## Current Status

- ❌ /vendors page broken (white screen)
- ✅ Database schema ready (manufacturer tables exist)
- ✅ Newsletter working
- ✅ Supabase connected
- ⏳ Need to build signup flow + dashboard
- ⏳ Need Stripe integration
- ⏳ Need AI integrations

**I'll start building now. Tell me:**
- Pricing tiers?
- Auto-approve or manual verification?
- Which AI features are priority?

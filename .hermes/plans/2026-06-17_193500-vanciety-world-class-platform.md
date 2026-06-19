# Vanciety World-Class Platform — Master Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan phase-by-phase.

**Goal:** Transform Vanciety from a functional community site into the world's #1 Sprinter van platform — award-winning design, natural flow, endless depth, full-service marketplace, AI concierge, and total member ecosystem.

**Current State:** 16 pages, 21 custom components, 49 UI components, 8 hooks, 2 Supabase edge functions, 19 DB migrations, Vite+React+Supabase+Tailwind/shadcn stack.

**Architecture:** React 18 SPA, Supabase backend (Postgres, Auth, Realtime, Edge Functions, Storage), Vite build, Tailwind CSS + shadcn/ui, React Router v6.

---

## Phase 1: Homepage Flow & Design Psychology (Priority 1)
*Make visitors never want to leave. Every scroll reveals value.*

### 1.1 Hero Section Redesign
- Full-viewport cinematic hero with parallax van image
- Animated headline with typing effect: "Your Van. Your Community. Your Life."
- Single clear CTA: "Join the Community" (green, high contrast)
- Subtle scroll indicator arrow animation
- **Files:** `src/components/Hero.tsx`, `src/index.css`

### 1.2 Section Flow Architecture
Design each homepage section to flow naturally into the next using visual psychology:

| Section | Purpose | Flow Trigger |
|---|---|---|
| Hero | Emotional hook | Scroll arrow |
| Vanny Welcome | AI concierge intro, personalized greeting | Auto-appear after 2s |
| Featured Videos | Immediate value — "Watch how others did it" | Content cards |
| Interactive Map Preview | "See where the community is" | Hover hotspots |
| How-To Categories | "Fix anything on your van" | Category grid |
| Parts & Products | "Get everything you need" | Product cards with ratings |
| Events & Meetups | "Meet your people" | Event timeline |
| Member Stories | Social proof | Testimonials carousel |
| Vendor Partners | Trust signals | Logo strip |
| Premium CTA | Conversion | Sticky bottom bar |

- **Files:** `src/pages/Index.tsx` (complete rewrite of section ordering)
- **New Components:**
  - `src/components/home/SectionTransition.tsx` — smooth fade/slide between sections
  - `src/components/home/ScrollProgress.tsx` — thin progress bar at top
  - `src/components/home/VannyWelcome.tsx` — AI concierge popup/sidebar

### 1.3 Navigation Redesign
- Sticky header with blur backdrop
- Logo left, nav center, auth/profile right
- Mobile: hamburger with full-screen overlay
- Active page indicator with animated underline
- Notification bell for logged-in users
- **Files:** `src/components/Header.tsx`

### 1.4 Typography & Spacing System
- Establish 8px grid system
- Define type scale (hero: 64px, h1: 48px, h2: 36px, h3: 24px, body: 16px)
- Consistent section padding (py-24 desktop, py-16 mobile)
- **Files:** `src/index.css`, `tailwind.config.ts`

---

## Phase 2: Vanny — AI Concierge (Priority 1)
*Every visitor gets a personal guide.*

### 2.1 Vanny Chat Widget
- Floating chat bubble (bottom-right, branded green)
- Slide-up chat panel with Vanciety branding
- Welcome message for new visitors: "Hey! I'm Vanny, your van life assistant."
- Quick-action chips: "Find parts", "How to fix...", "Find events near me", "Help me sign up"
- **New Files:**
  - `src/components/vanny/VannyChatWidget.tsx`
  - `src/components/vanny/VannyChatPanel.tsx`
  - `src/components/vanny/VannyMessage.tsx`
  - `src/components/vanny/VannyQuickActions.tsx`
  - `src/hooks/useVannyChat.tsx`

### 2.2 Vanny Intelligence
- Uses existing `vanciety-ai-concierge` Supabase edge function
- Personalized suggestions based on browsing history (localStorage)
- Context-aware: knows which page user is on
- Can search products, videos, vendors, events
- Signup assistance flow
- **Files:** `supabase/functions/vanciety-ai-concierge/index.ts` (enhance)

### 2.3 Vanny Onboarding Flow
- First-time visitor detection
- 3-step guided tour: "What's your van?", "What are you looking for?", "Join the community"
- Stores preferences for personalized feed
- **New Files:**
  - `src/components/vanny/VannyOnboarding.tsx`
  - `src/hooks/useOnboarding.tsx`

---

## Phase 3: Content Ecosystem — Videos, How-To, Documents (Priority 1)
*Endless depth. Every question answered.*

### 3.1 Video Library Overhaul
- Category-matched video sections (electrical, plumbing, mechanical, builds, reviews, tips)
- Each category page shows: curated videos, related parts, related how-to articles
- Video player with chapter markers
- Import 70KB video database from salvaged assets
- **Files:** `src/pages/Videos.tsx` (major enhancement)
- **New Files:**
  - `src/pages/VideoCategory.tsx`
  - `src/components/video/VideoCategoryGrid.tsx`
  - `src/components/video/VideoPlayer.tsx`
  - `src/components/video/RelatedParts.tsx`

### 3.2 How-To Knowledge Base
- Comprehensive how-to articles organized by system (electrical, plumbing, mechanical, interior, exterior)
- Each article: step-by-step instructions, images, video embeds, tool list, parts list with buy links
- Mercedes-specific technical documents and PDFs
- Real mechanic video embeds
- **New Pages:**
  - `src/pages/HowTo.tsx`
  - `src/pages/HowToArticle.tsx`
- **New Components:**
  - `src/components/howto/ToolList.tsx`
  - `src/components/howto/PartsList.tsx`
  - `src/components/howto/StepByStep.tsx`
- **DB:** New `how_to_articles` table

### 3.3 Document Library
- Mercedes service manuals, wiring diagrams, spec sheets
- Member-uploaded PDFs and guides
- Downloadable 3D print files (.stl)
- **New Page:** `src/pages/Documents.tsx`
- **DB:** New `documents` table with file storage via Supabase Storage

### 3.4 Complete Tool Database
- Every tool needed for every job, organized by category
- Links to buy, ratings, member reviews
- "What tools do I need for [job]?" quick lookup
- **New Page:** `src/pages/Tools.tsx`
- **DB:** New `tools` table

---

## Phase 4: Parts & Products Marketplace (Priority 1)
*Buy everything for your van in one place.*

### 4.1 Aftermarket Parts Directory
- Every van manufacturer and aftermarket parts maker
- Categories: electrical, solar, plumbing, mechanical, interior, exterior, storage, accessories
- Each product: images, videos, ratings, reviews, buy links, compatibility info
- Import product data from salvaged assets
- **New Pages:**
  - `src/pages/Parts.tsx`
  - `src/pages/PartDetail.tsx`
  - `src/pages/PartCategory.tsx`
- **New Components:**
  - `src/components/parts/ProductCard.tsx`
  - `src/components/parts/ProductRating.tsx`
  - `src/components/parts/CompatibilityBadge.tsx`
  - `src/components/parts/PriceComparison.tsx`
- **DB:** New `products`, `product_reviews`, `product_categories` tables

### 4.2 Member Buy/Sell/Trade
- Members list their own van products
- 3D print files for sale (phone mounts, fender flares, custom parts)
- Secure transactions via Stripe
- Seller ratings and reviews
- **New Pages:**
  - `src/pages/MemberListings.tsx`
  - `src/pages/CreateListing.tsx`
  - `src/pages/ListingDetail.tsx`
- **DB:** New `member_listings`, `transactions`, `seller_reviews` tables
- **Integration:** Stripe Connect for member payouts

### 4.3 Rental Marketplace
- Members rent out tools, equipment, roof racks, etc.
- Availability calendar
- Location-based search
- **New Page:** `src/pages/Rentals.tsx`
- **DB:** New `rentals`, `rental_bookings` tables

---

## Phase 5: Events & Community (Priority 2)
*Meet your people. Never miss a gathering.*

### 5.1 Events Platform
- Every van event, meetup, rally, expo worldwide
- Calendar view, map view, list view
- RSVP, ticket links, directions
- Member-created events
- Past event galleries
- **Files:** `src/pages/News.tsx` → rename/split into `Events.tsx` + `News.tsx`
- **New Components:**
  - `src/components/events/EventCard.tsx`
  - `src/components/events/EventCalendar.tsx`
  - `src/components/events/EventMap.tsx`
- **DB:** Enhance `events` table with RSVP, tickets, gallery

### 5.2 Hire Anyone Platform
- Members offer services: mechanic work, electrical installs, custom builds, photography
- Service provider profiles with portfolio, ratings, location
- Booking/messaging system
- **New Pages:**
  - `src/pages/Services.tsx`
  - `src/pages/ServiceProviderProfile.tsx`
- **DB:** New `service_providers`, `service_bookings` tables

### 5.3 Enhanced Forum
- Threaded discussions with rich text, images, video embeds
- Categories matching all site sections
- Reputation system (badges, points)
- **Files:** `src/pages/Forum.tsx` (major enhancement)
- **DB:** Enhance `forum_posts` with threading, reputation

---

## Phase 6: Security & Member Experience (Priority 2)
*Trust is everything.*

### 6.1 Security Hardening
- CSP headers (use salvaged security libraries)
- Rate limiting on all API endpoints
- Input validation/sanitization
- Two-factor authentication option
- **New Files:**
  - `src/lib/security/csp.ts` (enhance existing)
  - `src/lib/security/rateLimit.ts`
  - `src/lib/security/validation.ts`

### 6.2 Member Profiles
- Rich profiles: van details, build photos, location, badges
- Activity feed
- Follower/following system
- **New Pages:**
  - `src/pages/Profile.tsx`
  - `src/pages/EditProfile.tsx`
- **DB:** Enhance `profiles` table

### 6.3 Notification System
- In-app notifications for replies, mentions, events, new products
- Email digest option
- Push notifications (PWA)
- **New Files:**
  - `src/components/notifications/NotificationBell.tsx`
  - `src/components/notifications/NotificationPanel.tsx`
- **DB:** New `notifications` table

---

## Phase 7: SEO, Performance & Polish (Priority 3)
*Award-winning quality.*

### 7.1 Performance
- Code splitting per route (React.lazy)
- Image optimization (WebP/AVIF, lazy loading, srcset)
- Service worker for offline support
- Lighthouse score target: 95+ all categories

### 7.2 SEO
- Meta tags per page
- Open Graph / Twitter cards
- Structured data (JSON-LD) for products, events, articles
- Sitemap generation
- Blog/content pages for organic traffic

### 7.3 Design Polish
- Micro-animations (Framer Motion)
- Loading skeletons for all data-driven sections
- Dark/light mode toggle
- Responsive perfection at every breakpoint
- Accessibility (WCAG 2.1 AA)

---

## Execution Order

| Priority | Phase | Estimated Tasks | Impact |
|---|---|---|---|
| **NOW** | Phase 1: Homepage Flow | 15 tasks | First impression, retention |
| **NOW** | Phase 2: Vanny AI | 10 tasks | Engagement, onboarding |
| **NOW** | Phase 3: Content | 20 tasks | Depth, SEO, time-on-site |
| **NOW** | Phase 4: Marketplace | 25 tasks | Revenue, member value |
| **NEXT** | Phase 5: Events & Community | 15 tasks | Community, retention |
| **NEXT** | Phase 6: Security & Profiles | 12 tasks | Trust, member identity |
| **LATER** | Phase 7: Polish & Performance | 10 tasks | Awards, speed, SEO |

---

## Data Imports from Salvaged Assets

| Source File | Target | Phase |
|---|---|---|
| `videoDatabase.ts` (70KB) | Supabase `youtube_videos` table | Phase 3 |
| `products.json`, `van-products.json` | Supabase `products` table | Phase 4 |
| `northwest-locations.json`, `sample-locations.json` | Supabase `locations` table | Phase 1 |
| `news.json` | Supabase `events` table | Phase 5 |
| `salvaged-assets/images/` | Supabase Storage + public/ | Phase 1 |
| Company/vendor links | Supabase `vendors` table | Phase 4 |
| SQL migrations | Reference for schema design | All phases |

---

## Tech Decisions

- **Payments:** Stripe Connect (member marketplace payouts)
- **AI:** Supabase Edge Functions + OpenAI API (Vanny)
- **File Storage:** Supabase Storage (images, PDFs, 3D files)
- **Search:** Supabase full-text search (pg_trgm + tsvector)
- **Real-time:** Supabase Realtime (chat, notifications, presence)
- **Animations:** Framer Motion
- **Forms:** React Hook Form + Zod (already in stack)
- **Rich Text:** TipTap editor (forum posts, articles)

---

## Success Metrics

- Time on site: 10+ minutes average
- Bounce rate: under 25%
- Pages per session: 5+
- Member conversion: 15% of visitors sign up
- Lighthouse: 95+ all categories
- Zero security incidents

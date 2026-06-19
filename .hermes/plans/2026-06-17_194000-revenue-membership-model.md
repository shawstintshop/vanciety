# Vanciety Revenue & Membership Model

## Membership Tiers

### Free (Explorer)
- Browse all content, videos, how-to guides
- View map and camp spots
- Read forum posts
- View marketplace listings
- Vanny AI — 5 questions/day
- Access to all free YouTube content matched to categories
- View vendor directory and product ratings
- View events calendar

### Member ($4.99/mo or $39.99/yr — save 33%)
- Everything in Free, plus:
- Post in forums, reply to threads
- Create marketplace listings (buy/sell/trade) — 10/month
- Access member-only camp spot reviews and GPS coordinates
- Vanny AI — unlimited
- Member profile with van card
- Friend finder and messaging
- GPS tracking and meetup features
- Member-only discounts from partner vendors (10-25% off)
- Early access to events and meetup RSVPs
- Download how-to PDFs and Mercedes documents
- Upload and share 3D print files (free sharing)

### Pro ($14.99/mo or $119.99/yr — save 33%)
- Everything in Member, plus:
- Unlimited marketplace listings
- Sell products and 3D print files (Vanciety takes 5% transaction fee)
- Featured listings in marketplace (3/month included)
- Priority Vanny AI with van-specific diagnostics
- Create and promote events
- Hire-me profile (offer services to other members)
- Advanced analytics on your listings and posts
- Pro badge on profile
- Access to wholesale vendor pricing (where available)
- Priority customer support

### Vendor Partner ($49.99/mo or $399.99/yr)
- Company profile page with branding
- List unlimited products in parts directory
- Featured placement in relevant categories
- Analytics dashboard (views, clicks, conversions)
- Vanciety affiliate program access
- Sponsored content slots (2/month)
- Event sponsorship opportunities
- Direct messaging from members
- Vendor verified badge
- Product review management

---

## Revenue Streams

### 1. Subscriptions (Primary)
- Member: $4.99/mo
- Pro: $14.99/mo  
- Vendor: $49.99/mo

### 2. Transaction Fees
- Pro member marketplace sales: 5% fee
- Free/Member marketplace: not allowed to sell, must upgrade to Pro
- Rental bookings: 8% service fee

### 3. Affiliate Program
- Use our own affiliate system (Supabase-tracked)
- Members share referral links to products → earn 3% commission
- Vanciety earns 5-15% from vendor affiliate programs (Goal Zero, Renogy, Dometic, etc.)
- Track clicks, conversions, payouts in dashboard

### 4. Advertising (Non-intrusive)
- Vendor Partner sponsored content in relevant sections only
- "Sponsored" badge clearly marked
- Native-feeling product recommendations (not banner ads)
- Newsletter sponsorship slots

### 5. Events
- Free to list community meetups
- Paid event promotion: $9.99 to feature an event
- Ticketed events: 3% service fee on ticket sales
- Fundraiser events: 0% fee (free for community causes)

### 6. Premium Content
- Exclusive Mercedes technical documents
- Expert mechanic video courses
- Professional build guides with blueprints

---

## Discount Strategy — "Always More Value Than Price"

### Member Perks That Feel Massive
- Partner vendor discounts (10-25% off) that alone exceed the membership cost
- Example: 15% off a $200 solar panel = $30 saved, membership is $4.99
- Free how-to content that would cost $50+ elsewhere
- Community pricing on events and meetups

### How We Present Value
- On signup page: "Members saved an average of $347 this month on parts and gear"
- On product pages: "Member Price: $169 (You save $31)" with crossed-out retail price
- On checkout: "Your membership has saved you $X total"

### Free Content That Keeps People Coming Back
- All YouTube video library (thousands of videos)
- Basic how-to articles
- Forum reading
- Event calendar browsing
- Map exploration
- Vendor directory
- Product comparisons and ratings
- News feed

---

## Signup Flow — "30 Seconds to Member"

### Step 1: One-Click Auth
- Google sign-in (one tap)
- Apple sign-in
- Email + password (fallback)
- No email verification required to start browsing as member

### Step 2: Quick Profile (Optional, can skip)
- "What's your van?" (dropdown: Sprinter 144, 170, Revel, Transit, Promaster, Other)
- "What are you into?" (checkboxes: Builds, Travel, Electrical, Mechanical, Events)
- Skip button always visible

### Step 3: Instant Access
- Immediately see member content
- Vanny welcomes them personally
- First member discount code appears

### Upgrade Prompts (Natural, Not Pushy)
- When viewing a member-only feature: soft modal with benefits list
- After 3rd forum visit: "Join the conversation" inline prompt
- After viewing 5 products: "Unlock member pricing" banner
- Never block content completely — always show a preview

---

## Implementation in Phases

### Phase 1 (Now): Free + Member tiers, signup flow, basic discounts
### Phase 2 (Next): Pro tier, marketplace transactions, Stripe Connect
### Phase 3 (Later): Vendor Partner tier, affiliate program, analytics dashboards

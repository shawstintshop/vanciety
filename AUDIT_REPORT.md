# Vanciety Production Audit Report

Generated: 2026-06-20
Auditor: Senior Database Engineer (Travis/SHAW)

---

## Executive Summary

**Status**: Vanciety is currently running in DEMO mode with mixed real/fake data.

**Critical Gaps**:
1. No user role system (manufacturer, coordinator, admin)
2. No manufacturer advertising platform or payments
3. No event submission/approval workflow
4. Several pages use hardcoded data instead of database
5. No Stripe integration for paid features

**Recommendation**: Implement complete production schema with role-based access, manufacturer self-service platform, and payment integration before launching to thousands of members.

---

## Page-by-Page Audit

### ✅ `/videos` — **REAL DATA** (Partial)

**Status**: Using real Supabase data with fallback

**Database**: `youtube_videos` table  
**Queries**:
- `select('*').from('youtube_videos').order('published_at')`
- Filters by category, search
- Fetches from database, falls back to hardcoded `verifiedVideos` if query fails

**Issues**:
- Fallback to hardcoded data (src/data/vancietyVerified.ts) when database is empty
- No video approval workflow
- No featured/premium video placements for manufacturers

**Needs**:
- Remove hardcoded fallback once database is populated
- Add manufacturer-sponsored video slots
- Video submission queue for coordinators

---

### ⚠️ `/marketplace` — **PARTIAL REAL DATA**

**Status**: Uses real database but likely empty, has hardcoded fallback links

**Database**: `marketplace_items` table  
**Queries**:
- `select('*, profiles!marketplace_items_user_id_fkey(display_name)').from('marketplace_items')`
- User can create listings (INSERT)
- Joins with profiles table

**Issues**:
- Table likely empty (no seed data found)
- Hardcoded "Trusted Market Links" to Van Viewer and Facebook
- No manufacturer product catalog
- No payment/checkout integration
- No featured listings for paid advertisers

**Needs**:
- Manufacturer product catalog (separate from user marketplace)
- Stripe checkout for product purchases
- Featured listings for paying manufacturers
- Admin moderation queue

---

### ✅ `/forum` — **REAL DATA**

**Status**: Fully connected to database

**Database**: `forum_posts`, `forum_replies` tables  
**Queries**:
- `select('*, profiles!forum_posts_user_id_fkey(display_name)').from('forum_posts')`
- User can create posts (INSERT)
- Category filtering works

**Issues**:
- Table likely empty (no seed posts)
- No moderator tools
- No admin role enforcement
- No manufacturer forum presence/sponsorship

**Needs**:
- Seed data (5-10 initial community posts)
- Admin moderation interface
- Manufacturer-sponsored forum sections
- Pin/feature posts for coordinators

---

### ❌ `/vendors` — **FAKE DATA (Hardcoded)**

**Status**: 100% hardcoded, NO database connection

**Database**: NONE  
**Data Source**: `src/data/vancietyVerified.ts` → `verifiedVendors` array

**Issues**:
- Completely hardcoded vendor list
- No database table for vendors
- No self-service manufacturer signup
- No payment for vendor listings
- No analytics for vendors

**Critical**: This is the manufacturer platform — must be database-driven with self-service signup and payment.

**Needs**:
- `manufacturer_profiles` table
- `manufacturer_products` table
- `manufacturer_subscriptions` table (Stripe)
- Self-service dashboard for manufacturers
- Payment integration for listing fees
- Analytics dashboard (views, clicks, leads)

---

### ❌ `/news` (Events) — **FAKE DATA (Hardcoded)**

**Status**: 100% hardcoded, NO database connection

**Database**: NONE  
**Data Source**: `src/data/vancietyVerified.ts` → `verifiedEvents` array

**Issues**:
- Completely hardcoded event list
- No database table for events
- No coordinator submission workflow
- No admin approval system
- No RSVP tracking

**Critical**: Event coordinators need ability to submit events for approval.

**Needs**:
- `events` table with approval workflow
- Event coordinator role
- Admin approval interface
- Public event calendar (approved events only)
- RSVP system for members

---

### ⚠️ `/map` — **MIXED DATA**

**Status**: Uses real database with hardcoded fallback

**Database**: `locations` table  
**Queries**:
- `select('*').from('locations')`
- Fallback to `verifiedLocations` array

**Issues**:
- Hardcoded fallback locations
- No user-submitted location workflow
- No location approval system
- No manufacturer location markers (dealer/service/shop)

**Needs**:
- Remove hardcoded fallback
- User location submission with moderation
- Manufacturer location pins (paid feature)
- Location types: user-submitted, manufacturer, verified

---

### ❌ `/auth` — **NO ROLE SYSTEM**

**Status**: Basic Supabase auth, NO roles

**Database**: `auth.users` (Supabase built-in)  
**Missing**: User roles, profile types, manufacturer accounts

**Issues**:
- No role distinction (member vs manufacturer vs coordinator vs admin)
- No manufacturer onboarding flow
- No payment during signup
- No business verification

**Critical**: Must implement role-based access before production.

**Needs**:
- `profiles` table with `user_role` enum
- Manufacturer signup flow with business details
- Stripe payment for manufacturer accounts
- Admin approval for coordinators
- Role-based routing and page protection

---

### ⚠️ `/profile` — **EXISTS BUT LIMITED**

**Status**: Basic profile page, no role-specific features

**Issues**:
- No manufacturer dashboard
- No coordinator event management
- No admin panel
- No subscription status display

**Needs**:
- Role-specific dashboards
- Manufacturer: products, analytics, billing
- Coordinator: event submissions, RSVP lists
- Admin: moderation queue, user management

---

## Database Schema Gaps

### Missing Tables

1. **`manufacturer_profiles`** — Business details, verification status, subscription tier
2. **`manufacturer_products`** — Product catalog, images, pricing, featured status
3. **`manufacturer_subscriptions`** — Stripe subscription records, billing history
4. **`event_submissions`** — Coordinator event submissions pending approval
5. **`event_rsvps`** — Member event registrations
6. **`user_roles`** — Role management (member, manufacturer, coordinator, admin)
7. **`moderation_queue`** — Admin approval workflow for content
8. **`analytics_events`** — Track views, clicks, conversions for manufacturers

### Missing Role System

No `user_role` enum in profiles table. Current schema does not distinguish between:
- Regular members (free)
- Premium members (paid subscription)
- Manufacturers (business accounts with product listings)
- Event coordinators (can submit events)
- Admins/Moderators (full access)

### Missing RLS Policies

Current RLS policies cover basic user data, but missing:
- Manufacturer-only access to product management
- Coordinator-only access to event submissions
- Admin-only access to moderation queue
- Public read access to approved content only

---

## Payment Integration Gaps

**Current State**: NO payment integration

**Missing**:
1. Stripe account setup
2. Subscription products (Stripe)
3. Manufacturer listing fees
4. Premium member subscriptions
5. One-time event listing fees
6. Webhook handling for payment events
7. Billing portal for manufacturers

---

## Security Issues

1. **No role-based access control** — Any authenticated user can access any feature
2. **No content moderation** — User-submitted content goes live immediately
3. **No rate limiting** — Vulnerable to spam/abuse
4. **No business verification** — Anyone can claim to be a manufacturer

---

## Recommendations by Priority

### Priority 1: Role System (CRITICAL)

**Timeline**: 1-2 days  
**Impact**: Blocks all other features

1. Add `user_role` enum to profiles table
2. Create role-based RLS policies
3. Update auth flow to assign roles during signup
4. Implement role-based routing in React app

### Priority 2: Manufacturer Platform (HIGH)

**Timeline**: 3-5 days  
**Impact**: Primary revenue source

1. Create manufacturer database schema
2. Build self-service signup flow
3. Integrate Stripe for subscription payments
4. Create manufacturer dashboard (products, analytics, billing)
5. Add featured product slots on homepage/marketplace

### Priority 3: Event Management (HIGH)

**Timeline**: 2-3 days  
**Impact**: Content generation, community engagement

1. Create events database schema
2. Build coordinator submission form
3. Create admin approval interface
4. Replace hardcoded events with database queries
5. Add public event calendar

### Priority 4: Content Moderation (MEDIUM)

**Timeline**: 2-3 days  
**Impact**: Quality control, legal protection

1. Create moderation queue
2. Build admin moderation interface
3. Add approval workflow for user-submitted content
4. Implement reporting system

### Priority 5: Remove Hardcoded Data (MEDIUM)

**Timeline**: 1 day  
**Impact**: Production-ready state

1. Seed database with initial data
2. Remove all hardcoded fallbacks
3. Verify all pages use real database queries

---

## Production Readiness Checklist

- [ ] User role system implemented
- [ ] Manufacturer self-service platform
- [ ] Stripe payment integration
- [ ] Event coordinator workflow
- [ ] Admin moderation tools
- [ ] All hardcoded data removed
- [ ] Database fully seeded
- [ ] RLS policies for all tables
- [ ] Rate limiting enabled
- [ ] Content moderation active
- [ ] Analytics tracking implemented
- [ ] Email notifications configured
- [ ] Terms of Service + Privacy Policy
- [ ] Business verification process
- [ ] Load testing with 1000+ users

---

## Next Steps

1. Review audit with SHAW
2. Prioritize features
3. Design complete database schema
4. Implement role system first (blocks everything else)
5. Build manufacturer platform (revenue)
6. Build event management (content)
7. Remove hardcoded data
8. Full QA testing
9. Soft launch with limited users
10. Scale to thousands

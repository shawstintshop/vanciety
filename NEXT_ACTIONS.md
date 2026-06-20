# Vanciety Next Actions

**Last Updated**: 2026-06-20 02:15 PST

## IMMEDIATE - Decide Path Forward

**SHAW Decision Required**:

Do you want to:
1. **Apply migrations now** and start building (7-10 day path to production-ready)
2. **Review audit first** then decide on implementation approach
3. **Prioritize differently** (specify what's most important)

---

## If Proceeding with Full Implementation

### Priority 1: Database Foundation (CRITICAL - BLOCKS EVERYTHING)

**Timeline**: 1-2 days  
**Depends on**: Nothing  
**Blocks**: All other features

- [ ] Apply database migrations to Supabase
  ```bash
  cd /Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app
  supabase db push
  ```
- [ ] Generate TypeScript types from new schema
  ```bash
  supabase gen types typescript --project-id vfrxntxjigtgutevijmb > src/integrations/supabase/types.ts
  ```
- [ ] Update `AuthContext.tsx` to detect and store user role
- [ ] Add role-based route protection in `App.tsx`
- [ ] Test RLS policies work correctly

**Success Criteria**:
- All tables exist in Supabase
- TypeScript knows about new types
- User role is available in auth context
- RLS prevents unauthorized access

---

### Priority 2: Manufacturer Platform (HIGH - PRIMARY REVENUE)

**Timeline**: 3-5 days  
**Depends on**: Priority 1  
**Revenue Impact**: Direct monetization

#### Day 1: Stripe Setup
- [ ] Create Stripe account (or use existing)
- [ ] Create subscription products (Basic $49, Professional $149, Enterprise $499)
- [ ] Add Stripe keys to `.env.local` and Vercel
- [ ] Install `@stripe/stripe-js` npm package
- [ ] Create Stripe webhook handler (Supabase Edge Function)

#### Day 2: Manufacturer Signup
- [ ] Create `src/pages/ManufacturerSignup.tsx`
- [ ] Build business registration form
- [ ] Add document upload for verification
- [ ] Implement Stripe checkout flow
- [ ] Redirect to dashboard after payment

#### Day 3-4: Manufacturer Dashboard
- [ ] Create `src/pages/ManufacturerDashboard.tsx`
- [ ] Build product CRUD interface
- [ ] Add image upload (Supabase Storage)
- [ ] Create analytics charts (views, clicks, inquiries)
- [ ] Add billing management (Stripe Customer Portal)

#### Day 5: Update Vendors Page
- [ ] Replace hardcoded `verifiedVendors` with database query
- [ ] Query `manufacturer_profiles` + `manufacturer_products`
- [ ] Filter by `verification_status = 'verified'` AND `subscription_status = 'active'`
- [ ] Add featured manufacturer section
- [ ] Test product display and links

**Success Criteria**:
- Manufacturers can signup and pay
- Products appear on /vendors page
- Analytics track views and clicks
- Billing portal works
- No hardcoded vendor data remains

---

### Priority 3: Event Management (HIGH - CONTENT GENERATION)

**Timeline**: 2-3 days  
**Depends on**: Priority 1  
**Impact**: Community engagement, event discovery

#### Day 1: Coordinator Workflow
- [ ] Create `src/pages/CoordinatorApplication.tsx`
- [ ] Create `src/pages/EventSubmission.tsx`
- [ ] Build event submission form
- [ ] Add image upload for events
- [ ] Implement date/time picker with timezone

#### Day 2: Admin Approval
- [ ] Create `src/pages/AdminDashboard.tsx`
- [ ] Build event moderation interface
- [ ] Add approve/reject buttons
- [ ] Test auto-creation of public event on approval

#### Day 3: Update News Page
- [ ] Replace hardcoded `verifiedEvents` with database query
- [ ] Query `events` table (approved events only)
- [ ] Add event filters (category, date, location)
- [ ] Add RSVP functionality
- [ ] Test event display and RSVP

**Success Criteria**:
- Coordinators can submit events
- Admin can approve/reject
- Approved events appear on /news page
- Users can RSVP
- No hardcoded event data remains

---

### Priority 4: Admin Panel (MEDIUM - OPERATIONS)

**Timeline**: 2 days  
**Depends on**: Priority 1  
**Impact**: Content moderation, user management

- [ ] Create full admin dashboard
- [ ] Manufacturer verification interface
- [ ] Event approval queue
- [ ] Coordinator application review
- [ ] User role management
- [ ] Content moderation tools

**Success Criteria**:
- Admin can manage all content
- Approval workflows work end-to-end
- User roles can be changed
- Moderation actions are logged

---

### Priority 5: Remove All Hardcoded Data (MEDIUM - PRODUCTION READY)

**Timeline**: 1 day  
**Depends on**: Priority 2, 3  
**Impact**: Production cleanliness

- [ ] Seed database with real initial data (5-10 manufacturers, 10-20 events)
- [ ] Remove all `src/data/vancietyVerified.ts` references
- [ ] Remove fallback arrays from all pages
- [ ] Verify all pages query database only
- [ ] Delete hardcoded data files

**Success Criteria**:
- No hardcoded data files remain
- All pages use real database queries
- Database has sufficient seed data
- Site works without fallbacks

---

### Priority 6: Testing & Launch Prep (HIGH - BEFORE LAUNCH)

**Timeline**: 1-2 days  
**Depends on**: All above  
**Impact**: Production readiness

- [ ] Full QA testing of all user flows
- [ ] Role-based access testing (member, manufacturer, coordinator, admin)
- [ ] Payment integration testing (test + live mode)
- [ ] Performance testing (page load times)
- [ ] Security audit (RLS policies, XSS, SQL injection)
- [ ] Load testing with simulated 1000+ users
- [ ] Disaster recovery drill (backup + restore + rollback)

**Success Criteria**:
- All user flows work correctly
- Payments process without errors
- Pages load in < 2 seconds
- RLS prevents unauthorized access
- Rollback works in < 5 minutes

---

## Quick Wins (Can Do Immediately)

These don't depend on database migrations:

- [ ] Update homepage copy to explain member/manufacturer/coordinator roles
- [ ] Add "Become a Manufacturer" CTA to homepage
- [ ] Add "Submit an Event" CTA to news page
- [ ] Create landing page explaining manufacturer benefits
- [ ] Draft Terms of Service and Privacy Policy
- [ ] Set up Google Analytics or Plausible
- [ ] Create manufacturer onboarding email templates

---

## Files Created (Ready to Use)

1. **`AUDIT_REPORT.md`** — Complete page-by-page analysis
2. **`IMPLEMENTATION_PLAN.md`** — Full 10-day roadmap with commands
3. **`supabase/migrations/20260620020000_user_roles_and_profiles.sql`** — Role system
4. **`supabase/migrations/20260620021000_manufacturer_platform.sql`** — Manufacturer tables
5. **`supabase/migrations/20260620022000_event_management.sql`** — Event workflow

---

## Decision Points

### Now
- Review audit report
- Approve/modify database schema
- Decide on Stripe pricing
- Set timeline expectations

### Before Day 3
- Finalize Stripe subscription tiers
- Decide on manufacturer verification process
- Define event approval criteria

### Before Day 8
- Determine seed data strategy
- Plan soft launch beta user list
- Set success metrics for launch

---

## Next Command (If Proceeding)

```bash
cd /Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app
supabase db push
```

This will apply all three migrations to your Supabase database.

**STOP**: Do NOT run this until SHAW approves the database schema.

# Vanciety Production Implementation Plan

**Timeline**: 7-10 days to production-ready  
**Goal**: Real database, real users, real manufacturer platform, real payments

---

## Phase 1: Database & Role System (Days 1-2)

### Day 1: Apply Migrations

**Files created**:
- `supabase/migrations/20260620020000_user_roles_and_profiles.sql`
- `supabase/migrations/20260620021000_manufacturer_platform.sql`
- `supabase/migrations/20260620022000_event_management.sql`

**Commands**:
```bash
cd /Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app

# Apply migrations to Supabase
supabase db push

# Verify tables created
supabase db dump --schema-only -f schema_backup.sql
```

**Verification**:
- [ ] All tables created in Supabase
- [ ] RLS policies active
- [ ] Functions created (get_user_role, has_role)
- [ ] Indexes in place

### Day 2: Update TypeScript Types

**Generate types from Supabase**:
```bash
supabase gen types typescript --project-id vfrxntxjigtgutevijmb > src/integrations/supabase/types.ts
```

**Update auth context**:
- Add role detection after login
- Store user_role in context
- Protect routes based on role

**Files to update**:
- `src/contexts/AuthContext.tsx`
- `src/App.tsx` (add role-based routing)
- `src/hooks/useAuth.ts` (add role helpers)

---

## Phase 2: Manufacturer Platform (Days 3-5)

### Day 3: Manufacturer Signup Flow

**Create components**:
```
src/pages/ManufacturerSignup.tsx
src/components/manufacturer/BusinessInfoForm.tsx
src/components/manufacturer/VerificationUpload.tsx
```

**Features**:
- Business registration form
- Tax ID collection (encrypted)
- Business verification document upload
- Redirect to payment after signup

**Add route**:
```tsx
<Route path="/manufacturer/signup" element={<ManufacturerSignup />} />
```

### Day 4: Stripe Integration

**Install Stripe**:
```bash
npm install @stripe/stripe-js
```

**Setup**:
1. Create Stripe account
2. Get API keys (test + production)
3. Create subscription products:
   - Basic: $49/month (10 products, basic analytics)
   - Professional: $149/month (50 products, full analytics)
   - Enterprise: $499/month (unlimited, priority support)

**Create Stripe webhook handler** (Supabase Edge Function):
```typescript
// supabase/functions/stripe-webhook/index.ts
```

**Add to .env**:
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**Supabase secrets**:
```bash
supabase secrets set STRIPE_SECRET_KEY=sk_test_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
```

### Day 5: Manufacturer Dashboard

**Create dashboard**:
```
src/pages/ManufacturerDashboard.tsx
src/components/manufacturer/ProductList.tsx
src/components/manufacturer/ProductForm.tsx
src/components/manufacturer/AnalyticsChart.tsx
src/components/manufacturer/BillingPanel.tsx
```

**Features**:
- Product CRUD (create, edit, delete)
- Image upload (Supabase Storage)
- Analytics dashboard (views, clicks, inquiries)
- Billing management (Stripe portal)
- Subscription status display

**Add routes**:
```tsx
<Route path="/dashboard/manufacturer" element={<ManufacturerDashboard />} />
<Route path="/dashboard/manufacturer/products/new" element={<ProductForm />} />
<Route path="/dashboard/manufacturer/products/:id" element={<ProductForm />} />
```

---

## Phase 3: Event Management (Days 6-7)

### Day 6: Coordinator Application & Event Submission

**Create components**:
```
src/pages/CoordinatorApplication.tsx
src/pages/EventSubmission.tsx
src/components/events/EventForm.tsx
```

**Features**:
- Coordinator application form
- Event submission form with address autocomplete
- Image upload for events
- Date/time picker with timezone support

**Add routes**:
```tsx
<Route path="/coordinator/apply" element={<CoordinatorApplication />} />
<Route path="/coordinator/submit-event" element={<EventSubmission />} />
```

### Day 7: Admin Moderation

**Create admin panel**:
```
src/pages/AdminDashboard.tsx
src/components/admin/ManufacturerApproval.tsx
src/components/admin/EventApproval.tsx
src/components/admin/CoordinatorApproval.tsx
src/components/admin/UserManagement.tsx
```

**Features**:
- Pending manufacturer verification review
- Event submission approval/rejection
- Coordinator application approval
- User role management
- Content moderation queue

**Add route**:
```tsx
<Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
```

---

## Phase 4: Update Existing Pages (Days 8-9)

### Day 8: Remove Hardcoded Data

**Update pages to use real database**:

**`/vendors` page**:
- Replace `verifiedVendors` array with manufacturer_profiles + manufacturer_products query
- Add featured manufacturer spotlight section
- Filter by verified + active subscription

**`/news` (events) page**:
- Replace `verifiedEvents` array with events table query
- Add event filters (category, date range, location)
- Add RSVP functionality

**Seed database**:
```sql
-- Insert initial manufacturers
-- Insert initial products
-- Insert initial events
```

### Day 9: Update Marketplace & Forum

**Marketplace**:
- Add manufacturer product listings section
- Separate user-to-user marketplace from manufacturer catalog
- Add "Featured Products" section for paying manufacturers

**Forum**:
- Add moderator tools (pin, lock, delete)
- Add admin badge display
- Add manufacturer sponsor badges

---

## Phase 5: Testing & Launch (Day 10)

### Testing Checklist

**Role System**:
- [ ] Member signup works
- [ ] Manufacturer signup → payment → dashboard
- [ ] Coordinator application → admin approval → submission access
- [ ] Admin has full access to all panels

**Manufacturer Platform**:
- [ ] Stripe payment processes correctly
- [ ] Products appear on /vendors page
- [ ] Analytics track views/clicks
- [ ] Billing portal accessible
- [ ] Subscription upgrades/downgrades work

**Event Management**:
- [ ] Coordinators can submit events
- [ ] Admin can approve/reject events
- [ ] Approved events appear on /news page
- [ ] Users can RSVP to events
- [ ] Event organizers see RSVP lists

**Data Integrity**:
- [ ] All pages use real database data
- [ ] No hardcoded fallbacks remain
- [ ] RLS policies prevent unauthorized access
- [ ] All forms validate input
- [ ] Images upload to Supabase Storage

**Performance**:
- [ ] Pages load in < 2 seconds
- [ ] Database queries optimized with indexes
- [ ] Images lazy-load
- [ ] No N+1 queries

**Security**:
- [ ] RLS policies tested for each role
- [ ] Stripe webhook signature verified
- [ ] Admin routes protected
- [ ] SQL injection prevented (parameterized queries)
- [ ] XSS prevented (sanitized user input)

### Soft Launch

1. Deploy to production with feature flags
2. Invite 10-20 beta manufacturers
3. Monitor for errors/bugs
4. Collect feedback
5. Iterate based on feedback
6. Full public launch

---

## Required Environment Variables

**Vercel Production**:
```bash
VITE_SUPABASE_URL=https://vfrxntxjigtgutevijmb.supabase.co
VITE_SUPABASE_ANON_KEY=<anon_key>
VITE_STRIPE_PUBLISHABLE_KEY=<stripe_pk>
```

**Supabase Secrets**:
```bash
STRIPE_SECRET_KEY=<stripe_sk>
STRIPE_WEBHOOK_SECRET=<webhook_secret>
ANTHROPIC_API_KEY=<for_ai_concierge>
YOUTUBE_API_KEY=<for_video_sync>
```

---

## Stripe Products to Create

**Manufacturer Subscriptions**:

1. **Basic** - $49/month
   - 10 products
   - 5 images per product
   - Basic analytics
   - Email support

2. **Professional** - $149/month
   - 50 products
   - 10 images per product
   - Full analytics
   - 2 featured products
   - Priority support

3. **Enterprise** - $499/month
   - Unlimited products
   - Unlimited images
   - Advanced analytics
   - 5 featured products
   - Dedicated account manager

**Event Listing Fees** (one-time):
- Free for verified coordinators
- $25 for one-time event submission (non-coordinators)

---

## Database Seeding

**Initial seed data** (run after migrations):

```sql
-- Create admin account
INSERT INTO profiles (id, email, display_name, user_role)
VALUES (
  '<your_user_id>',
  'shaw@vanciety.com',
  'Shaw (Admin)',
  'admin'
);

-- Seed sample manufacturer
-- Seed sample products
-- Seed sample events
-- (Real data, not fake)
```

---

## Post-Launch Monitoring

**Metrics to track**:
- New manufacturer signups per day
- Active subscriptions
- Monthly recurring revenue (MRR)
- Event submissions per week
- User engagement (forum posts, marketplace listings)
- Page views per manufacturer product
- Conversion rate (view → inquiry)

**Tools**:
- Vercel Analytics (built-in)
- Stripe Dashboard (revenue, subscriptions)
- Supabase Dashboard (database usage, RLS performance)
- Custom analytics dashboard (manufacturer_analytics table)

---

## Success Criteria

Before declaring production-ready:

- [ ] 10+ verified manufacturers with active subscriptions
- [ ] 50+ real products in catalog
- [ ] 20+ approved events in calendar
- [ ] 100+ registered members
- [ ] < 2% payment failure rate
- [ ] < 5 minute average admin approval time
- [ ] Zero RLS security holes
- [ ] 99.9% uptime (per Vercel)
- [ ] All hardcoded data removed
- [ ] Complete disaster recovery system tested

---

## Next Steps

1. Review this plan with SHAW
2. Prioritize features
3. Apply database migrations
4. Start Phase 1 (Role System)
5. Continue through phases
6. Test thoroughly
7. Soft launch
8. Scale to thousands of members

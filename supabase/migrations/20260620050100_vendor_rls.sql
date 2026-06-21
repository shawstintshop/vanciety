-- ============================================================================
-- Vanciety Vendor / Company System — RLS policies
-- Pattern: public reads published/active rows; owners manage their own company's
-- rows; admins have full access; leads/analytics are write-open, read-restricted.
-- Idempotent: DROP POLICY IF EXISTS before each CREATE POLICY.
-- ============================================================================

-- ── Helper functions ────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION is_admin(uid uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = uid AND raw_user_meta_data->>'role' = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION owns_company(cid uuid, uid uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM companies
    WHERE id = cid AND owner_user_id = uid
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- ── Enable RLS ──────────────────────────────────────────────────────────────
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_ai_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_content_jobs ENABLE ROW LEVEL SECURITY;

-- ── COMPANIES ───────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Public can view published companies" ON companies;
CREATE POLICY "Public can view published companies" ON companies
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Owners can view their own company" ON companies;
CREATE POLICY "Owners can view their own company" ON companies
  FOR SELECT USING (owner_user_id = auth.uid());

DROP POLICY IF EXISTS "Owners can update their own company" ON companies;
CREATE POLICY "Owners can update their own company" ON companies
  FOR UPDATE USING (owner_user_id = auth.uid());

DROP POLICY IF EXISTS "Authenticated users can create company" ON companies;
CREATE POLICY "Authenticated users can create company" ON companies
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admins have full company access" ON companies;
CREATE POLICY "Admins have full company access" ON companies
  FOR ALL USING (is_admin(auth.uid()));

-- ── COMPANY PAGES ───────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Public can view published pages" ON company_pages;
CREATE POLICY "Public can view published pages" ON company_pages
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Owners can manage their pages" ON company_pages;
CREATE POLICY "Owners can manage their pages" ON company_pages
  FOR ALL USING (owns_company(company_id, auth.uid()));

DROP POLICY IF EXISTS "Admins can manage all pages" ON company_pages;
CREATE POLICY "Admins can manage all pages" ON company_pages
  FOR ALL USING (is_admin(auth.uid()));

-- ── PRODUCTS ────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Public can view published products" ON company_products;
CREATE POLICY "Public can view published products" ON company_products
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Owners can manage their products" ON company_products;
CREATE POLICY "Owners can manage their products" ON company_products
  FOR ALL USING (owns_company(company_id, auth.uid()));

DROP POLICY IF EXISTS "Admins can manage all products" ON company_products;
CREATE POLICY "Admins can manage all products" ON company_products
  FOR ALL USING (is_admin(auth.uid()));

-- ── SERVICES ────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Public can view active services" ON company_services;
CREATE POLICY "Public can view active services" ON company_services
  FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS "Owners can manage their services" ON company_services;
CREATE POLICY "Owners can manage their services" ON company_services
  FOR ALL USING (owns_company(company_id, auth.uid()));

DROP POLICY IF EXISTS "Admins can manage all services" ON company_services;
CREATE POLICY "Admins can manage all services" ON company_services
  FOR ALL USING (is_admin(auth.uid()));

-- ── EVENTS ──────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Public can view published company events" ON company_events;
CREATE POLICY "Public can view published company events" ON company_events
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Owners can manage their events" ON company_events;
CREATE POLICY "Owners can manage their events" ON company_events
  FOR ALL USING (owns_company(company_id, auth.uid()));

DROP POLICY IF EXISTS "Admins can manage all company events" ON company_events;
CREATE POLICY "Admins can manage all company events" ON company_events
  FOR ALL USING (is_admin(auth.uid()));

-- ── VIDEOS ──────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Public can view company videos" ON company_videos;
CREATE POLICY "Public can view company videos" ON company_videos
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Owners can manage their videos" ON company_videos;
CREATE POLICY "Owners can manage their videos" ON company_videos
  FOR ALL USING (owns_company(company_id, auth.uid()));

DROP POLICY IF EXISTS "Admins can manage all videos" ON company_videos;
CREATE POLICY "Admins can manage all videos" ON company_videos
  FOR ALL USING (is_admin(auth.uid()));

-- ── REVIEWS ─────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Public can view approved reviews" ON company_reviews;
CREATE POLICY "Public can view approved reviews" ON company_reviews
  FOR SELECT USING (status = 'approved');

DROP POLICY IF EXISTS "Authenticated users can submit reviews" ON company_reviews;
CREATE POLICY "Authenticated users can submit reviews" ON company_reviews
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Owners can view all reviews for their company" ON company_reviews;
CREATE POLICY "Owners can view all reviews for their company" ON company_reviews
  FOR SELECT USING (owns_company(company_id, auth.uid()));

DROP POLICY IF EXISTS "Admins can manage all reviews" ON company_reviews;
CREATE POLICY "Admins can manage all reviews" ON company_reviews
  FOR ALL USING (is_admin(auth.uid()));

-- ── LEADS (private — only owner and admin can read) ─────────────────────────
DROP POLICY IF EXISTS "Owners can view their leads" ON company_leads;
CREATE POLICY "Owners can view their leads" ON company_leads
  FOR SELECT USING (owns_company(company_id, auth.uid()));

DROP POLICY IF EXISTS "Anyone can submit a lead" ON company_leads;
CREATE POLICY "Anyone can submit a lead" ON company_leads
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Owners can update lead status" ON company_leads;
CREATE POLICY "Owners can update lead status" ON company_leads
  FOR UPDATE USING (owns_company(company_id, auth.uid()));

DROP POLICY IF EXISTS "Admins can manage all leads" ON company_leads;
CREATE POLICY "Admins can manage all leads" ON company_leads
  FOR ALL USING (is_admin(auth.uid()));

-- ── PROMOTIONS ──────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Public can view published promotions" ON company_promotions;
CREATE POLICY "Public can view published promotions" ON company_promotions
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Owners can manage their promotions" ON company_promotions;
CREATE POLICY "Owners can manage their promotions" ON company_promotions
  FOR ALL USING (owns_company(company_id, auth.uid()));

DROP POLICY IF EXISTS "Admins can manage all promotions" ON company_promotions;
CREATE POLICY "Admins can manage all promotions" ON company_promotions
  FOR ALL USING (is_admin(auth.uid()));

-- ── FAQS ────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Public can view company faqs" ON company_faqs;
CREATE POLICY "Public can view company faqs" ON company_faqs
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Owners can manage their faqs" ON company_faqs;
CREATE POLICY "Owners can manage their faqs" ON company_faqs
  FOR ALL USING (owns_company(company_id, auth.uid()));

DROP POLICY IF EXISTS "Admins can manage all faqs" ON company_faqs;
CREATE POLICY "Admins can manage all faqs" ON company_faqs
  FOR ALL USING (is_admin(auth.uid()));

-- ── DOCUMENTS ───────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Public can view company documents" ON company_documents;
CREATE POLICY "Public can view company documents" ON company_documents
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Owners can manage their documents" ON company_documents;
CREATE POLICY "Owners can manage their documents" ON company_documents
  FOR ALL USING (owns_company(company_id, auth.uid()));

DROP POLICY IF EXISTS "Admins can manage all documents" ON company_documents;
CREATE POLICY "Admins can manage all documents" ON company_documents
  FOR ALL USING (is_admin(auth.uid()));

-- ── ANALYTICS ───────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Anyone can insert analytics" ON company_analytics_events;
CREATE POLICY "Anyone can insert analytics" ON company_analytics_events
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Owners can view their analytics" ON company_analytics_events;
CREATE POLICY "Owners can view their analytics" ON company_analytics_events
  FOR SELECT USING (owns_company(company_id, auth.uid()));

DROP POLICY IF EXISTS "Admins can view all analytics" ON company_analytics_events;
CREATE POLICY "Admins can view all analytics" ON company_analytics_events
  FOR SELECT USING (is_admin(auth.uid()));

-- ── AI PROFILES (owner + admin only) ────────────────────────────────────────
DROP POLICY IF EXISTS "Owners can manage their ai profile" ON company_ai_profiles;
CREATE POLICY "Owners can manage their ai profile" ON company_ai_profiles
  FOR ALL USING (owns_company(company_id, auth.uid()));

DROP POLICY IF EXISTS "Admins can manage all ai profiles" ON company_ai_profiles;
CREATE POLICY "Admins can manage all ai profiles" ON company_ai_profiles
  FOR ALL USING (is_admin(auth.uid()));

-- ── AI CONTENT JOBS (owner + admin only) ────────────────────────────────────
DROP POLICY IF EXISTS "Owners can manage their ai jobs" ON ai_content_jobs;
CREATE POLICY "Owners can manage their ai jobs" ON ai_content_jobs
  FOR ALL USING (owns_company(company_id, auth.uid()));

DROP POLICY IF EXISTS "Admins can manage all ai jobs" ON ai_content_jobs;
CREATE POLICY "Admins can manage all ai jobs" ON ai_content_jobs
  FOR ALL USING (is_admin(auth.uid()));

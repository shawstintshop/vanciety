-- ============================================================================
-- Vanciety Vendor / Company System — core schema
-- Every van-related company gets a hosted mini-site inside Vanciety.
-- Idempotent: IF NOT EXISTS everywhere; never drops existing tables.
-- ============================================================================

-- COMPANIES (master vendor profile)
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id uuid REFERENCES auth.users ON DELETE SET NULL,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  legal_name text,
  tagline text,
  description text,
  short_description text,
  category text,
  subcategories text[],
  business_type text,
  logo_url text,
  hero_image_url text,
  gallery_urls text[],
  website_url text,
  custom_domain text,
  vanciety_subdomain text,
  contact_email text,
  contact_phone text,
  support_email text,
  sales_email text,
  address_line_1 text,
  address_line_2 text,
  city text,
  state text,
  postal_code text,
  country text DEFAULT 'USA',
  latitude numeric,
  longitude numeric,
  service_area text,
  serves_nationwide boolean DEFAULT false,
  verified boolean DEFAULT false,
  claimed boolean DEFAULT false,
  featured boolean DEFAULT false,
  subscription_tier text DEFAULT 'free',
  subscription_status text DEFAULT 'inactive',
  stripe_customer_id text,
  stripe_subscription_id text,
  status text DEFAULT 'draft',
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS companies_slug_idx ON companies(slug);
CREATE INDEX IF NOT EXISTS companies_category_idx ON companies(category);
CREATE INDEX IF NOT EXISTS companies_verified_idx ON companies(verified);
CREATE INDEX IF NOT EXISTS companies_featured_idx ON companies(featured);
CREATE INDEX IF NOT EXISTS companies_status_idx ON companies(status);

-- COMPANY PAGES (customizable pages per vendor site)
CREATE TABLE IF NOT EXISTS company_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies ON DELETE CASCADE,
  title text NOT NULL,
  slug text NOT NULL,
  page_type text NOT NULL, -- home|about|products|services|gallery|videos|events|reviews|contact|support|custom
  content jsonb,
  seo_title text,
  seo_description text,
  ai_generated boolean DEFAULT false,
  status text DEFAULT 'draft',
  sort_order int DEFAULT 0,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(company_id, slug)
);

-- COMPANY PRODUCTS
CREATE TABLE IF NOT EXISTS company_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  sku text,
  brand text,
  category text,
  subcategory text,
  description text,
  short_description text,
  price numeric,
  sale_price numeric,
  currency text DEFAULT 'USD',
  image_url text,
  gallery_urls text[],
  product_url text,
  affiliate_url text,
  amazon_url text,
  fitment jsonb, -- {van_make, van_model, year_start, year_end, wheelbase, roof_height, notes}
  specs jsonb,
  installation_difficulty text,
  install_time_minutes int,
  warranty text,
  shipping_info text,
  in_stock boolean DEFAULT true,
  featured boolean DEFAULT false,
  status text DEFAULT 'draft',
  seo_title text,
  seo_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS company_products_company_idx ON company_products(company_id);
CREATE INDEX IF NOT EXISTS company_products_category_idx ON company_products(category);
CREATE INDEX IF NOT EXISTS company_products_status_idx ON company_products(status);

-- COMPANY SERVICES
CREATE TABLE IF NOT EXISTS company_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  category text,
  description text,
  price_starting_at numeric,
  price_type text, -- fixed|quote|hourly|per_foot
  duration_minutes int,
  image_url text,
  service_area text,
  requires_quote boolean DEFAULT true,
  booking_url text,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS company_services_company_idx ON company_services(company_id);

-- COMPANY EVENTS
CREATE TABLE IF NOT EXISTS company_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies ON DELETE CASCADE,
  title text NOT NULL,
  slug text NOT NULL,
  description text,
  event_type text,
  start_at timestamptz,
  end_at timestamptz,
  timezone text,
  venue_name text,
  address text,
  city text,
  state text,
  postal_code text,
  latitude numeric,
  longitude numeric,
  image_url text,
  ticket_url text,
  price numeric,
  capacity int,
  featured boolean DEFAULT false,
  status text DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS company_events_company_idx ON company_events(company_id);

-- COMPANY VIDEOS
CREATE TABLE IF NOT EXISTS company_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  video_url text NOT NULL,
  youtube_video_id text,
  thumbnail_url text,
  video_type text, -- install|review|tour|promo|interview
  tags text[],
  featured boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS company_videos_company_idx ON company_videos(company_id);

-- COMPANY REVIEWS
CREATE TABLE IF NOT EXISTS company_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users ON DELETE SET NULL,
  product_id uuid REFERENCES company_products ON DELETE SET NULL,
  rating int CHECK (rating >= 1 AND rating <= 5),
  title text,
  body text,
  reviewer_name text,
  verified_customer boolean DEFAULT false,
  source text DEFAULT 'vanciety',
  status text DEFAULT 'pending', -- pending|approved|rejected
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS company_reviews_company_idx ON company_reviews(company_id);
CREATE INDEX IF NOT EXISTS company_reviews_status_idx ON company_reviews(status);

-- COMPANY LEADS
CREATE TABLE IF NOT EXISTS company_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users ON DELETE SET NULL,
  name text,
  email text,
  phone text,
  message text,
  lead_type text DEFAULT 'general', -- general|product_question|service_quote|install_request|event_inquiry|support|partnership
  product_id uuid REFERENCES company_products ON DELETE SET NULL,
  service_id uuid REFERENCES company_services ON DELETE SET NULL,
  event_id uuid REFERENCES company_events ON DELETE SET NULL,
  source_url text,
  status text DEFAULT 'new', -- new|contacted|qualified|closed|spam
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS company_leads_company_idx ON company_leads(company_id);
CREATE INDEX IF NOT EXISTS company_leads_status_idx ON company_leads(status);

-- COMPANY PROMOTIONS
CREATE TABLE IF NOT EXISTS company_promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  promo_code text,
  discount_type text, -- percent|fixed|free_shipping|bogo
  discount_value numeric,
  starts_at timestamptz,
  ends_at timestamptz,
  image_url text,
  target_url text,
  status text DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS company_promotions_company_idx ON company_promotions(company_id);

-- COMPANY FAQS
CREATE TABLE IF NOT EXISTS company_faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies ON DELETE CASCADE,
  question text NOT NULL,
  answer text NOT NULL,
  category text,
  sort_order int DEFAULT 0,
  ai_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS company_faqs_company_idx ON company_faqs(company_id);

-- COMPANY DOCUMENTS
CREATE TABLE IF NOT EXISTS company_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  document_url text NOT NULL,
  document_type text, -- install_guide|warranty|manual|fitment_chart|spec_sheet
  tags text[],
  ai_indexed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS company_documents_company_idx ON company_documents(company_id);

-- COMPANY ANALYTICS
CREATE TABLE IF NOT EXISTS company_analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies ON DELETE CASCADE,
  event_type text NOT NULL, -- page_view|product_view|service_view|lead_submit|outbound_click|phone_click|email_click|affiliate_click|video_play|promotion_click
  page_url text,
  referrer text,
  user_id uuid REFERENCES auth.users ON DELETE SET NULL,
  session_id text,
  product_id uuid,
  service_id uuid,
  event_id uuid,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS analytics_company_idx ON company_analytics_events(company_id);
CREATE INDEX IF NOT EXISTS analytics_event_type_idx ON company_analytics_events(event_type);
CREATE INDEX IF NOT EXISTS analytics_created_idx ON company_analytics_events(created_at);

-- COMPANY AI PROFILES
CREATE TABLE IF NOT EXISTS company_ai_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies ON DELETE CASCADE UNIQUE,
  ai_name text,
  brand_voice text,
  sales_instructions text,
  support_instructions text,
  marketing_instructions text,
  disallowed_claims text[],
  preferred_cta text,
  knowledge_summary text,
  last_generated_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- AI CONTENT JOBS
CREATE TABLE IF NOT EXISTS ai_content_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies ON DELETE CASCADE,
  job_type text NOT NULL, -- generate_company_homepage|generate_product_description|generate_seo_metadata|generate_faqs|generate_social_posts|generate_email_campaign|generate_event_promo|summarize_reviews|generate_support_answers
  status text DEFAULT 'pending', -- pending|processing|complete|failed
  input jsonb,
  output jsonb,
  error text,
  created_by uuid REFERENCES auth.users ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

CREATE INDEX IF NOT EXISTS ai_content_jobs_company_idx ON ai_content_jobs(company_id);

-- Vanciety Production Schema - Manufacturer Platform
-- Migration: 20260620021000_manufacturer_platform.sql
--
-- Implements:
-- 1. Manufacturer business profiles
-- 2. Product catalog with images
-- 3. Subscription management
-- 4. Analytics tracking

-- Manufacturer profiles (extends user profiles)
CREATE TABLE manufacturer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Business information
  business_name TEXT NOT NULL,
  business_type TEXT, -- LLC, Corp, Sole Proprietor, etc.
  tax_id TEXT, -- EIN or business tax ID (encrypted)
  website_url TEXT,
  phone TEXT,
  
  -- Address
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'US',
  
  -- Branding
  logo_url TEXT,
  banner_url TEXT,
  brand_colors JSONB DEFAULT '[]'::jsonb,
  
  -- Business details
  description TEXT,
  specialties TEXT[],
  service_areas TEXT[],
  years_in_business INTEGER,
  
  -- Verification
  verification_status TEXT DEFAULT 'pending', -- pending, verified, rejected
  verified_at TIMESTAMPTZ,
  verification_documents JSONB DEFAULT '[]'::jsonb,
  
  -- Subscription
  subscription_plan TEXT DEFAULT 'basic', -- basic, professional, enterprise
  subscription_status TEXT DEFAULT 'inactive',
  stripe_subscription_id TEXT UNIQUE,
  subscription_started_at TIMESTAMPTZ,
  subscription_ends_at TIMESTAMPTZ,
  trial_ends_at TIMESTAMPTZ,
  
  -- Features allowed by plan
  max_products INTEGER DEFAULT 10,
  max_images_per_product INTEGER DEFAULT 5,
  featured_products_count INTEGER DEFAULT 0,
  analytics_enabled BOOLEAN DEFAULT FALSE,
  priority_support BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_website CHECK (website_url IS NULL OR website_url ~* '^https?://'),
  CONSTRAINT unique_user_manufacturer UNIQUE(user_id)
);

-- Manufacturer products
CREATE TABLE manufacturer_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  manufacturer_id UUID NOT NULL REFERENCES manufacturer_profiles(id) ON DELETE CASCADE,
  
  -- Product details
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  
  -- Categorization
  category TEXT NOT NULL,
  subcategory TEXT,
  tags TEXT[],
  
  -- Pricing
  price_usd DECIMAL(10, 2),
  price_display TEXT, -- "Starting at $X" or "Call for quote"
  price_type TEXT DEFAULT 'fixed', -- fixed, range, quote
  
  -- Availability
  in_stock BOOLEAN DEFAULT TRUE,
  stock_quantity INTEGER,
  
  -- Product URLs
  product_url TEXT,
  purchase_url TEXT,
  
  -- Images
  images JSONB DEFAULT '[]'::jsonb, -- Array of {url, alt, is_primary}
  primary_image_url TEXT,
  
  -- Specifications
  specifications JSONB DEFAULT '{}'::jsonb,
  dimensions JSONB DEFAULT '{}'::jsonb,
  weight_lbs DECIMAL(10, 2),
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  
  -- Status
  status TEXT DEFAULT 'draft', -- draft, active, archived
  is_featured BOOLEAN DEFAULT FALSE,
  featured_until TIMESTAMPTZ,
  
  -- Analytics
  view_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  inquiry_count INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  
  CONSTRAINT unique_manufacturer_slug UNIQUE(manufacturer_id, slug)
);

-- Manufacturer subscriptions (Stripe integration)
CREATE TABLE manufacturer_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  manufacturer_id UUID NOT NULL REFERENCES manufacturer_profiles(id) ON DELETE CASCADE,
  
  -- Stripe data
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  stripe_price_id TEXT NOT NULL,
  stripe_product_id TEXT NOT NULL,
  
  -- Subscription details
  plan_name TEXT NOT NULL, -- basic, professional, enterprise
  status TEXT NOT NULL, -- active, past_due, canceled, incomplete, trialing
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMPTZ,
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  
  -- Billing
  amount_usd DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'usd',
  interval TEXT NOT NULL, -- month, year
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product analytics events
CREATE TABLE manufacturer_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  manufacturer_id UUID NOT NULL REFERENCES manufacturer_profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES manufacturer_products(id) ON DELETE CASCADE,
  
  -- Event details
  event_type TEXT NOT NULL, -- view, click, inquiry, purchase
  event_data JSONB DEFAULT '{}'::jsonb,
  
  -- User context (optional, for logged-in users)
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Request context
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_event_type CHECK (event_type IN ('view', 'click', 'inquiry', 'purchase', 'share'))
);

-- Indexes
CREATE INDEX idx_manufacturer_profiles_user_id ON manufacturer_profiles(user_id);
CREATE INDEX idx_manufacturer_profiles_verification_status ON manufacturer_profiles(verification_status);
CREATE INDEX idx_manufacturer_profiles_subscription_status ON manufacturer_profiles(subscription_status);

CREATE INDEX idx_manufacturer_products_manufacturer_id ON manufacturer_products(manufacturer_id);
CREATE INDEX idx_manufacturer_products_category ON manufacturer_products(category);
CREATE INDEX idx_manufacturer_products_status ON manufacturer_products(status);
CREATE INDEX idx_manufacturer_products_featured ON manufacturer_products(is_featured, featured_until);
CREATE INDEX idx_manufacturer_products_slug ON manufacturer_products(slug);

CREATE INDEX idx_manufacturer_subscriptions_manufacturer_id ON manufacturer_subscriptions(manufacturer_id);
CREATE INDEX idx_manufacturer_subscriptions_stripe_id ON manufacturer_subscriptions(stripe_subscription_id);
CREATE INDEX idx_manufacturer_subscriptions_status ON manufacturer_subscriptions(status);

CREATE INDEX idx_manufacturer_analytics_manufacturer_id ON manufacturer_analytics(manufacturer_id);
CREATE INDEX idx_manufacturer_analytics_product_id ON manufacturer_analytics(product_id);
CREATE INDEX idx_manufacturer_analytics_event_type ON manufacturer_analytics(event_type);
CREATE INDEX idx_manufacturer_analytics_created_at ON manufacturer_analytics(created_at DESC);

-- Updated_at triggers
CREATE TRIGGER update_manufacturer_profiles_updated_at
  BEFORE UPDATE ON manufacturer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_manufacturer_products_updated_at
  BEFORE UPDATE ON manufacturer_products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_manufacturer_subscriptions_updated_at
  BEFORE UPDATE ON manufacturer_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE manufacturer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE manufacturer_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE manufacturer_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE manufacturer_analytics ENABLE ROW LEVEL SECURITY;

-- Manufacturer profiles: Public read for verified, owner + admin write
CREATE POLICY "Public can view verified manufacturer profiles"
  ON manufacturer_profiles FOR SELECT
  USING (verification_status = 'verified');

CREATE POLICY "Manufacturers can manage own profile"
  ON manufacturer_profiles FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all manufacturer profiles"
  ON manufacturer_profiles FOR ALL
  USING (has_role('admin'));

-- Products: Public read for active, owner + admin write
CREATE POLICY "Public can view active products"
  ON manufacturer_products FOR SELECT
  USING (
    status = 'active' AND
    EXISTS (
      SELECT 1 FROM manufacturer_profiles mp
      WHERE mp.id = manufacturer_id
        AND mp.verification_status = 'verified'
        AND mp.subscription_status = 'active'
    )
  );

CREATE POLICY "Manufacturers can manage own products"
  ON manufacturer_products FOR ALL
  USING (
    manufacturer_id IN (
      SELECT id FROM manufacturer_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all products"
  ON manufacturer_products FOR ALL
  USING (has_role('admin'));

-- Subscriptions: Owner + admin only
CREATE POLICY "Manufacturers can view own subscriptions"
  ON manufacturer_subscriptions FOR SELECT
  USING (
    manufacturer_id IN (
      SELECT id FROM manufacturer_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all subscriptions"
  ON manufacturer_subscriptions FOR SELECT
  USING (has_role('admin'));

-- Analytics: Owner + admin read
CREATE POLICY "Manufacturers can view own analytics"
  ON manufacturer_analytics FOR SELECT
  USING (
    manufacturer_id IN (
      SELECT id FROM manufacturer_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all analytics"
  ON manufacturer_analytics FOR SELECT
  USING (has_role('admin'));

-- Public can insert analytics events (anonymous tracking)
CREATE POLICY "Anyone can insert analytics events"
  ON manufacturer_analytics FOR INSERT
  WITH CHECK (true);

-- Comments
COMMENT ON TABLE manufacturer_profiles IS 'Business profiles for manufacturers/vendors';
COMMENT ON TABLE manufacturer_products IS 'Product catalog for manufacturers';
COMMENT ON TABLE manufacturer_subscriptions IS 'Stripe subscription records for manufacturers';
COMMENT ON TABLE manufacturer_analytics IS 'Analytics events for manufacturer products (views, clicks, inquiries)';

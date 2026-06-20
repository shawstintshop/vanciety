-- Vendor Platform: Enhanced vendors table + vendor_media + vendor_products
-- Supports: self-service signup, image/video uploads, categories, affiliate links

-- Drop and recreate vendors table with full platform support
ALTER TABLE IF EXISTS vendors ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE IF EXISTS vendors ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';
ALTER TABLE IF EXISTS vendors ADD COLUMN IF NOT EXISTS videos TEXT[] DEFAULT '{}';
ALTER TABLE IF EXISTS vendors ADD COLUMN IF NOT EXISTS services TEXT[] DEFAULT '{}';
ALTER TABLE IF EXISTS vendors ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE IF EXISTS vendors ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free';
ALTER TABLE IF EXISTS vendors ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active';
ALTER TABLE IF EXISTS vendors ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE IF EXISTS vendors ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;
ALTER TABLE IF EXISTS vendors ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;
ALTER TABLE IF EXISTS vendors ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE IF EXISTS vendors ADD COLUMN IF NOT EXISTS contact_phone TEXT;
ALTER TABLE IF EXISTS vendors ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}';
ALTER TABLE IF EXISTS vendors ADD COLUMN IF NOT EXISTS service_areas TEXT[] DEFAULT '{}';
ALTER TABLE IF EXISTS vendors ADD COLUMN IF NOT EXISTS price_range TEXT;
ALTER TABLE IF EXISTS vendors ADD COLUMN IF NOT EXISTS year_established INTEGER;
ALTER TABLE IF EXISTS vendors ADD COLUMN IF NOT EXISTS certifications TEXT[] DEFAULT '{}';
ALTER TABLE IF EXISTS vendors ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE IF EXISTS vendors ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE IF EXISTS vendors ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE IF EXISTS vendors ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE IF EXISTS vendors ADD COLUMN IF NOT EXISTS click_count INTEGER DEFAULT 0;

-- Vendor products / affiliate links
CREATE TABLE IF NOT EXISTS vendor_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  sale_price DECIMAL(10,2),
  images TEXT[] DEFAULT '{}',
  affiliate_url TEXT,
  affiliate_source TEXT, -- 'amazon', 'direct', 'ebay', etc.
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  in_stock BOOLEAN DEFAULT TRUE,
  featured BOOLEAN DEFAULT FALSE,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vendor reviews
CREATE TABLE IF NOT EXISTS vendor_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT,
  images TEXT[] DEFAULT '{}',
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vendor analytics
CREATE TABLE IF NOT EXISTS vendor_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'view', 'click', 'contact', 'product_view', 'affiliate_click'
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_vendors_category ON vendors(category);
CREATE INDEX IF NOT EXISTS idx_vendors_status ON vendors(status);
CREATE INDEX IF NOT EXISTS idx_vendors_slug ON vendors(slug);
CREATE INDEX IF NOT EXISTS idx_vendors_featured ON vendors(featured);
CREATE INDEX IF NOT EXISTS idx_vendor_products_vendor ON vendor_products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_products_category ON vendor_products(category);
CREATE INDEX IF NOT EXISTS idx_vendor_reviews_vendor ON vendor_reviews(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_analytics_vendor ON vendor_analytics(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_analytics_type ON vendor_analytics(event_type);

-- RLS Policies
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_analytics ENABLE ROW LEVEL SECURITY;

-- Vendors: anyone can read active vendors, owners can update their own
DROP POLICY IF EXISTS "Anyone can view active vendors" ON vendors;
CREATE POLICY "Anyone can view active vendors" ON vendors FOR SELECT USING (status = 'active' OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create vendor profiles" ON vendors;
CREATE POLICY "Users can create vendor profiles" ON vendors FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Owners can update their vendor" ON vendors;
CREATE POLICY "Owners can update their vendor" ON vendors FOR UPDATE USING (auth.uid() = user_id);

-- Products: anyone can read, vendor owners can manage
DROP POLICY IF EXISTS "Anyone can view products" ON vendor_products;
CREATE POLICY "Anyone can view products" ON vendor_products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Vendor owners can manage products" ON vendor_products;
CREATE POLICY "Vendor owners can manage products" ON vendor_products FOR ALL USING (
  EXISTS (SELECT 1 FROM vendors WHERE vendors.id = vendor_products.vendor_id AND vendors.user_id = auth.uid())
);

-- Reviews: anyone can read, authenticated users can write
DROP POLICY IF EXISTS "Anyone can view reviews" ON vendor_reviews;
CREATE POLICY "Anyone can view reviews" ON vendor_reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can write reviews" ON vendor_reviews;
CREATE POLICY "Authenticated users can write reviews" ON vendor_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Analytics: vendor owners can read, anyone can insert (tracking)
DROP POLICY IF EXISTS "Anyone can track analytics" ON vendor_analytics;
CREATE POLICY "Anyone can track analytics" ON vendor_analytics FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Vendor owners can view analytics" ON vendor_analytics;
CREATE POLICY "Vendor owners can view analytics" ON vendor_analytics FOR SELECT USING (
  EXISTS (SELECT 1 FROM vendors WHERE vendors.id = vendor_analytics.vendor_id AND vendors.user_id = auth.uid())
);

-- Trigger to auto-generate slug from business name
CREATE OR REPLACE FUNCTION generate_vendor_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := LOWER(REGEXP_REPLACE(REGEXP_REPLACE(NEW.business_name, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
    -- Handle duplicates by appending random chars
    IF EXISTS (SELECT 1 FROM vendors WHERE slug = NEW.slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)) THEN
      NEW.slug := NEW.slug || '-' || SUBSTR(gen_random_uuid()::text, 1, 6);
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS vendor_slug_trigger ON vendors;
CREATE TRIGGER vendor_slug_trigger BEFORE INSERT OR UPDATE ON vendors
FOR EACH ROW EXECUTE FUNCTION generate_vendor_slug();

-- Update timestamp trigger for vendor_products
CREATE OR REPLACE FUNCTION update_vendor_product_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS vendor_product_updated ON vendor_products;
CREATE TRIGGER vendor_product_updated BEFORE UPDATE ON vendor_products
FOR EACH ROW EXECUTE FUNCTION update_vendor_product_timestamp();

SELECT 'Vendor platform migration complete!' as status;

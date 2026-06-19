-- Business listings for the maps
CREATE TABLE business_listings (
  id SERIAL PRIMARY KEY,
  business_name VARCHAR(255) NOT NULL,
  description TEXT,
  business_type VARCHAR(100), -- rv_dealer, parts_supplier, repair_shop, campground, etc.
  owner_id UUID REFERENCES auth.users(id),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  website_url TEXT,
  business_hours JSONB,
  amenities TEXT[],
  services TEXT[],
  price_range VARCHAR(20), -- $, $$, $$$, $$$$
  image_urls TEXT[],
  logo_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_premium_listing BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  rating_average DECIMAL(3, 2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  premium_expires_at TIMESTAMP WITH TIME ZONE,
  listing_priority INTEGER DEFAULT 0, -- Higher number = higher priority in search
  social_links JSONB,
  seo_title VARCHAR(255),
  seo_description TEXT,
  slug VARCHAR(255) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business reviews
CREATE TABLE business_reviews (
  id SERIAL PRIMARY KEY,
  business_id INTEGER REFERENCES business_listings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  review_text TEXT,
  service_date DATE,
  images TEXT[],
  pros TEXT[],
  cons TEXT[],
  would_recommend BOOLEAN,
  helpful_count INTEGER DEFAULT 0,
  is_verified_customer BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business categories for filtering
CREATE TABLE business_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  parent_category_id INTEGER REFERENCES business_categories(id),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- Business category assignments
CREATE TABLE business_category_assignments (
  id SERIAL PRIMARY KEY,
  business_id INTEGER REFERENCES business_listings(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES business_categories(id),
  UNIQUE(business_id, category_id)
);

-- Insert default business categories
INSERT INTO business_categories (name, slug, description, icon, sort_order) VALUES
('RV Dealers', 'rv-dealers', 'New and used RV dealerships', 'truck', 1),
('Parts & Accessories', 'parts-accessories', 'Van and RV parts suppliers', 'package', 2),
('Repair Shops', 'repair-shops', 'Van and RV repair services', 'wrench', 3),
('Campgrounds', 'campgrounds', 'RV-friendly campgrounds and parks', 'tent', 4),
('Solar Installers', 'solar-installers', 'Solar system installation services', 'sun', 5),
('Custom Builders', 'custom-builders', 'Van conversion specialists', 'hammer', 6),
('Fuel Stations', 'fuel-stations', 'Diesel and propane stations', 'fuel', 7),
('Dump Stations', 'dump-stations', 'Waste dump and water fill stations', 'droplet', 8),
('Laundromats', 'laundromats', 'Laundry and shower facilities', 'washing-machine', 9),
('WiFi Spots', 'wifi-spots', 'Reliable internet access points', 'wifi', 10);

-- Indexes
CREATE INDEX idx_business_listings_location ON business_listings(latitude, longitude);
CREATE INDEX idx_business_listings_type ON business_listings(business_type);
CREATE INDEX idx_business_listings_premium ON business_listings(is_premium_listing, listing_priority DESC);
CREATE INDEX idx_business_listings_slug ON business_listings(slug);
CREATE INDEX idx_business_reviews_business ON business_reviews(business_id);
CREATE INDEX idx_business_category_assignments_business ON business_category_assignments(business_id);
CREATE INDEX idx_business_category_assignments_category ON business_category_assignments(category_id);

-- Enable RLS
ALTER TABLE business_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_category_assignments ENABLE ROW LEVEL SECURITY;

-- Policies for business listings
CREATE POLICY "Active business listings are viewable by everyone" ON business_listings
  FOR SELECT USING (is_active = true);
  
CREATE POLICY "Authenticated users can create business listings" ON business_listings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  
CREATE POLICY "Business owners can update their listings" ON business_listings
  FOR UPDATE USING (auth.uid() = owner_id);

-- Policies for business reviews
CREATE POLICY "Approved business reviews are viewable by everyone" ON business_reviews
  FOR SELECT USING (is_approved = true);
  
CREATE POLICY "Authenticated users can create business reviews" ON business_reviews
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  
CREATE POLICY "Users can update their own business reviews" ON business_reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- Policies for business categories
CREATE POLICY "Business categories are viewable by everyone" ON business_categories
  FOR SELECT USING (is_active = true);

-- Policies for category assignments
CREATE POLICY "Category assignments are viewable by everyone" ON business_category_assignments
  FOR SELECT USING (true);
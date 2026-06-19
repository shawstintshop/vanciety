-- Camp spots, secret locations, and driveway surfers
CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  location_type VARCHAR(50) NOT NULL, -- camp_spot, secret_spot, driveway_surfer, business
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  address TEXT,
  amenities TEXT[],
  cost VARCHAR(100),
  contact_info JSONB,
  website_url TEXT,
  image_urls TEXT[],
  added_by UUID REFERENCES auth.users(id),
  is_verified BOOLEAN DEFAULT false,
  is_premium_only BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  rating_average DECIMAL(3, 2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Location reviews
CREATE TABLE location_reviews (
  id SERIAL PRIMARY KEY,
  location_id INTEGER REFERENCES locations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  visit_date DATE,
  images TEXT[],
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(location_id, user_id)
);

-- Indexes
CREATE INDEX idx_locations_type ON locations(location_type);
CREATE INDEX idx_locations_coordinates ON locations(latitude, longitude);
CREATE INDEX idx_locations_premium ON locations(is_premium_only);
CREATE INDEX idx_location_reviews_location ON location_reviews(location_id);

-- Enable RLS
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_reviews ENABLE ROW LEVEL SECURITY;

-- Policies for locations
CREATE POLICY "Public locations are viewable by everyone" ON locations
  FOR SELECT USING (is_active = true AND (is_premium_only = false OR auth.role() = 'authenticated'));
  
CREATE POLICY "Premium locations for authenticated users" ON locations
  FOR SELECT USING (is_active = true AND is_premium_only = true AND auth.role() = 'authenticated');
  
CREATE POLICY "Authenticated users can add locations" ON locations
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  
CREATE POLICY "Users can update their own locations" ON locations
  FOR UPDATE USING (auth.uid() = added_by);

-- Policies for reviews
CREATE POLICY "Approved reviews are viewable by everyone" ON location_reviews
  FOR SELECT USING (is_approved = true);
  
CREATE POLICY "Authenticated users can add reviews" ON location_reviews
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  
CREATE POLICY "Users can update their own reviews" ON location_reviews
  FOR UPDATE USING (auth.uid() = user_id);
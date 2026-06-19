-- E-commerce products and affiliate links
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  short_description VARCHAR(500),
  price DECIMAL(10, 2),
  sale_price DECIMAL(10, 2),
  sku VARCHAR(100) UNIQUE,
  category VARCHAR(100),
  subcategory VARCHAR(100),
  brand VARCHAR(100),
  affiliate_url TEXT,
  affiliate_commission_rate DECIMAL(5, 4),
  amazon_asin VARCHAR(20),
  image_urls TEXT[],
  features TEXT[],
  specifications JSONB,
  is_featured BOOLEAN DEFAULT false,
  is_daily_deal BOOLEAN DEFAULT false,
  deal_expires_at TIMESTAMP WITH TIME ZONE,
  inventory_count INTEGER DEFAULT 0,
  is_in_stock BOOLEAN DEFAULT true,
  rating_average DECIMAL(3, 2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  meta_title VARCHAR(255),
  meta_description TEXT,
  slug VARCHAR(255) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product reviews
CREATE TABLE product_reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  review_text TEXT,
  pros TEXT[],
  cons TEXT[],
  verified_purchase BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  images TEXT[],
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cart items for users
CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Indexes
CREATE INDEX idx_products_category ON products(category, subcategory);
CREATE INDEX idx_products_featured ON products(is_featured, created_at DESC);
CREATE INDEX idx_products_deals ON products(is_daily_deal, deal_expires_at);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_product_reviews_product ON product_reviews(product_id);
CREATE INDEX idx_cart_items_user ON cart_items(user_id);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Policies for products
CREATE POLICY "Active products are viewable by everyone" ON products
  FOR SELECT USING (is_active = true);

-- Policies for product reviews
CREATE POLICY "Approved reviews are viewable by everyone" ON product_reviews
  FOR SELECT USING (is_approved = true);
  
CREATE POLICY "Authenticated users can add reviews" ON product_reviews
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  
CREATE POLICY "Users can update their own reviews" ON product_reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- Policies for cart
CREATE POLICY "Users can view their own cart" ON cart_items
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can add to their cart" ON cart_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update their cart" ON cart_items
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete from their cart" ON cart_items
  FOR DELETE USING (auth.uid() = user_id);
-- Orders system
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  stripe_payment_intent_id VARCHAR(255),
  stripe_charge_id VARCHAR(255),
  order_number VARCHAR(100) UNIQUE,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  total_amount DECIMAL(10, 2) NOT NULL,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  shipping_amount DECIMAL(10, 2) DEFAULT 0,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'USD',
  customer_email VARCHAR(255),
  customer_phone VARCHAR(20),
  shipping_address JSONB,
  billing_address JSONB,
  notes TEXT,
  tracking_number VARCHAR(255),
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  product_sku VARCHAR(100),
  product_image_url TEXT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_at_time DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  affiliate_commission_rate DECIMAL(5, 4),
  affiliate_commission_amount DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Affiliate tracking
CREATE TABLE affiliates (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  affiliate_code VARCHAR(50) UNIQUE NOT NULL,
  company_name VARCHAR(255),
  contact_name VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  website_url TEXT,
  commission_rate DECIMAL(5, 4) DEFAULT 0.05, -- 5% default
  payment_method VARCHAR(50) DEFAULT 'paypal',
  payment_details JSONB,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'suspended', 'rejected')),
  total_earnings DECIMAL(10, 2) DEFAULT 0,
  total_sales DECIMAL(10, 2) DEFAULT 0,
  total_clicks INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Affiliate clicks tracking
CREATE TABLE affiliate_clicks (
  id SERIAL PRIMARY KEY,
  affiliate_id INTEGER REFERENCES affiliates(id),
  product_id INTEGER REFERENCES products(id),
  user_id UUID REFERENCES auth.users(id),
  ip_address INET,
  user_agent TEXT,
  referrer_url TEXT,
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),
  converted BOOLEAN DEFAULT false,
  conversion_value DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Affiliate commissions
CREATE TABLE affiliate_commissions (
  id SERIAL PRIMARY KEY,
  affiliate_id INTEGER REFERENCES affiliates(id),
  order_id INTEGER REFERENCES orders(id),
  order_item_id INTEGER REFERENCES order_items(id),
  product_id INTEGER REFERENCES products(id),
  commission_rate DECIMAL(5, 4) NOT NULL,
  commission_amount DECIMAL(10, 2) NOT NULL,
  sale_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Manufacturers/Partners
CREATE TABLE manufacturers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  contact_email VARCHAR(255),
  partnership_tier VARCHAR(50) DEFAULT 'standard', -- premium, standard, basic
  commission_rate DECIMAL(5, 4) DEFAULT 0.03,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coupons and discounts
CREATE TABLE coupons (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  discount_type VARCHAR(20) CHECK (discount_type IN ('percentage', 'fixed_amount')),
  discount_value DECIMAL(10, 2) NOT NULL,
  minimum_order_amount DECIMAL(10, 2),
  maximum_discount_amount DECIMAL(10, 2),
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  applicable_categories TEXT[],
  applicable_products INTEGER[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wishlist
CREATE TABLE wishlists (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  product_id INTEGER REFERENCES products(id),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Insert sample manufacturers
INSERT INTO manufacturers (name, slug, description, partnership_tier, commission_rate, is_featured) VALUES
('Mercedes-Benz', 'mercedes-benz', 'Luxury sprinter vans and commercial vehicles', 'premium', 0.05, true),
('Winnebago Revel', 'winnebago-revel', 'Adventure-ready motorhomes built on Mercedes Sprinter chassis', 'premium', 0.04, true),
('Owl Vans', 'owl-vans', 'Custom van conversions and adventure vehicles', 'standard', 0.06, true),
('Goal Zero', 'goal-zero', 'Portable power solutions for off-grid adventures', 'standard', 0.08, false),
('Dometic', 'dometic', 'Mobile living solutions - refrigeration, awnings, air conditioning', 'premium', 0.05, false),
('Yakima', 'yakima', 'Cargo management and outdoor gear transportation', 'standard', 0.07, false);

-- Add manufacturer_id to products table
ALTER TABLE products ADD COLUMN manufacturer_id INTEGER REFERENCES manufacturers(id);

-- Indexes
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);
CREATE INDEX idx_affiliates_code ON affiliates(affiliate_code);
CREATE INDEX idx_affiliate_clicks_affiliate ON affiliate_clicks(affiliate_id);
CREATE INDEX idx_affiliate_clicks_product ON affiliate_clicks(product_id);
CREATE INDEX idx_affiliate_commissions_affiliate ON affiliate_commissions(affiliate_id);
CREATE INDEX idx_affiliate_commissions_status ON affiliate_commissions(status);
CREATE INDEX idx_manufacturers_slug ON manufacturers(slug);
CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_wishlists_user ON wishlists(user_id);

-- Generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number = 'SS' || TO_CHAR(NEW.created_at, 'YYYYMMDD') || LPAD(NEW.id::TEXT, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION generate_order_number();

-- RLS Policies
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE manufacturers ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- Orders policies
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Order items policies
CREATE POLICY "Users can view order items for their orders" ON order_items
  FOR SELECT USING (
    order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
  );

-- Affiliate policies
CREATE POLICY "Users can view their affiliate data" ON affiliates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can apply to be affiliates" ON affiliates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their affiliate profile" ON affiliates
  FOR UPDATE USING (auth.uid() = user_id);

-- Public data policies
CREATE POLICY "Manufacturers are viewable by everyone" ON manufacturers
  FOR SELECT USING (is_active = true);

CREATE POLICY "Active coupons are viewable by everyone" ON coupons
  FOR SELECT USING (is_active = true);

-- Wishlist policies
CREATE POLICY "Users can manage their wishlist" ON wishlists
  FOR ALL USING (auth.uid() = user_id);
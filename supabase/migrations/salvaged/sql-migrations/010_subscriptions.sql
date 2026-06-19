-- Premium membership subscriptions
CREATE TABLE plans (
  id SERIAL PRIMARY KEY,
  price_id VARCHAR(255) UNIQUE NOT NULL,
  plan_type VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  price INTEGER NOT NULL, -- Price in cents
  currency VARCHAR(3) DEFAULT 'usd',
  interval VARCHAR(20) DEFAULT 'month', -- month, year
  features TEXT[],
  monthly_limit INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  stripe_subscription_id VARCHAR(255) UNIQUE NOT NULL,
  stripe_customer_id VARCHAR(255) NOT NULL,
  price_id VARCHAR(255) NOT NULL REFERENCES plans(price_id),
  status VARCHAR(50) NOT NULL, -- active, canceled, past_due, incomplete, etc.
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  canceled_at TIMESTAMP WITH TIME ZONE,
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default plans
INSERT INTO plans (price_id, plan_type, name, price, features, monthly_limit) VALUES
('price_premium_monthly', 'premium', 'Premium Monthly', 999, 
 ARRAY['Access to secret camp spots', 'Premium video content', 'Advanced forum features', 'Driveway surfer network', 'Event priority booking'], 
 100),
('price_basic_monthly', 'basic', 'Basic Monthly', 499, 
 ARRAY['Basic forum access', 'Public camp spots', 'Standard video content'], 
 25);

-- Orders for tracking purchases
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed, refunded
  total_amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'usd',
  shipping_address JSONB,
  billing_address JSONB,
  customer_email VARCHAR(255),
  order_items JSONB, -- Store cart items as JSON
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items for detailed tracking
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price_at_time DECIMAL(10, 2) NOT NULL,
  product_name VARCHAR(255),
  product_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_stripe ON orders(stripe_payment_intent_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- Enable RLS
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policies for plans
CREATE POLICY "Active plans are viewable by everyone" ON plans
  FOR SELECT USING (is_active = true);

-- Policies for subscriptions
CREATE POLICY "Users can view their own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Policies for orders
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can view their own order items" ON order_items
  FOR SELECT USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));
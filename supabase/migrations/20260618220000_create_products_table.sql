-- Create products table for van life gear and equipment
CREATE TABLE IF NOT EXISTS public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  sale_price numeric(10,2),
  category text NOT NULL,
  brand text,
  images text[],
  features text[],
  is_featured boolean DEFAULT false,
  is_daily_deal boolean DEFAULT false,
  affiliate_url text,
  rating numeric(2,1) DEFAULT 0,
  review_count integer DEFAULT 0,
  sku text UNIQUE NOT NULL,
  stock_quantity integer DEFAULT 0,
  weight text,
  dimensions text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

-- Create indexes
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_brand ON public.products(brand);
CREATE INDEX idx_products_featured ON public.products(is_featured) WHERE is_featured = true;
CREATE INDEX idx_products_daily_deal ON public.products(is_daily_deal) WHERE is_daily_deal = true;
CREATE INDEX idx_products_sku ON public.products(sku);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

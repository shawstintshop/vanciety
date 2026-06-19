-- News articles and blog posts
CREATE TABLE news_articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author_id UUID REFERENCES auth.users(id),
  featured_image_url TEXT,
  category VARCHAR(100),
  tags TEXT[],
  view_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  seo_title VARCHAR(255),
  seo_description TEXT,
  slug VARCHAR(255) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_news_articles_category ON news_articles(category);
CREATE INDEX idx_news_articles_published ON news_articles(is_published, published_at DESC);
CREATE INDEX idx_news_articles_featured ON news_articles(is_featured, published_at DESC);
CREATE INDEX idx_news_articles_slug ON news_articles(slug);

-- Enable RLS
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Published articles are viewable by everyone" ON news_articles
  FOR SELECT USING (is_published = true);
  
CREATE POLICY "Authenticated users can create articles" ON news_articles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  
CREATE POLICY "Users can update their own articles" ON news_articles
  FOR UPDATE USING (auth.uid() = author_id);
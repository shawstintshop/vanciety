-- Resources and how-to guides
CREATE TABLE resources (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  category VARCHAR(100),
  subcategory VARCHAR(100),
  difficulty_level VARCHAR(20), -- beginner, intermediate, advanced
  estimated_time INTEGER, -- Time in minutes
  tools_required TEXT[],
  materials_needed TEXT[],
  cost_estimate VARCHAR(100),
  author_id UUID REFERENCES auth.users(id),
  featured_image_url TEXT,
  gallery_images TEXT[],
  video_url TEXT,
  pdf_url TEXT,
  external_links TEXT[],
  tags TEXT[],
  is_premium BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  rating_average DECIMAL(3, 2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  seo_title VARCHAR(255),
  seo_description TEXT,
  slug VARCHAR(255) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resource ratings
CREATE TABLE resource_ratings (
  id SERIAL PRIMARY KEY,
  resource_id INTEGER REFERENCES resources(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(resource_id, user_id)
);

-- Resource bookmarks/favorites
CREATE TABLE resource_bookmarks (
  id SERIAL PRIMARY KEY,
  resource_id INTEGER REFERENCES resources(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(resource_id, user_id)
);

-- Default resource categories
INSERT INTO resources (title, description, content, category, difficulty_level, author_id, is_published) VALUES
('Sprinter Van Electrical Basics', 'Complete guide to understanding your Sprinter\'s electrical system', 'Comprehensive guide content here...', 'Electrical', 'beginner', null, true),
('Solar Panel Installation Guide', 'Step-by-step solar installation for Mercedes Sprinters', 'Detailed installation guide...', 'Solar', 'intermediate', null, true),
('Fresh Water System Setup', 'Installing a complete fresh water system in your van', 'Water system installation guide...', 'Plumbing', 'intermediate', null, true),
('Van Build Planning Checklist', 'Ultimate checklist for planning your van conversion', 'Complete planning checklist...', 'Planning', 'beginner', null, true),
('Budget Van Build Guide', 'How to build a van on a tight budget', 'Budget-friendly build strategies...', 'Budget', 'beginner', null, true);

-- Indexes
CREATE INDEX idx_resources_category ON resources(category, subcategory);
CREATE INDEX idx_resources_featured ON resources(is_featured, created_at DESC);
CREATE INDEX idx_resources_premium ON resources(is_premium);
CREATE INDEX idx_resources_slug ON resources(slug);
CREATE INDEX idx_resource_ratings_resource ON resource_ratings(resource_id);
CREATE INDEX idx_resource_bookmarks_user ON resource_bookmarks(user_id);

-- Enable RLS
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_bookmarks ENABLE ROW LEVEL SECURITY;

-- Policies for resources
CREATE POLICY "Published free resources are viewable by everyone" ON resources
  FOR SELECT USING (is_published = true AND is_premium = false);
  
CREATE POLICY "Premium resources for authenticated users" ON resources
  FOR SELECT USING (is_published = true AND is_premium = true AND auth.role() = 'authenticated');
  
CREATE POLICY "Authenticated users can create resources" ON resources
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  
CREATE POLICY "Users can update their own resources" ON resources
  FOR UPDATE USING (auth.uid() = author_id);

-- Policies for ratings
CREATE POLICY "Resource ratings are viewable by everyone" ON resource_ratings
  FOR SELECT USING (true);
  
CREATE POLICY "Authenticated users can rate resources" ON resource_ratings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  
CREATE POLICY "Users can update their own ratings" ON resource_ratings
  FOR UPDATE USING (auth.uid() = user_id);

-- Policies for bookmarks
CREATE POLICY "Users can view their own bookmarks" ON resource_bookmarks
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Authenticated users can bookmark resources" ON resource_bookmarks
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  
CREATE POLICY "Users can remove their own bookmarks" ON resource_bookmarks
  FOR DELETE USING (auth.uid() = user_id);
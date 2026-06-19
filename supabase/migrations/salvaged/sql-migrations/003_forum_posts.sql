-- Forum posts and discussions
CREATE TABLE forum_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id),
  category_id INTEGER REFERENCES forum_categories(id),
  tags TEXT[],
  view_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_forum_posts_category ON forum_posts(category_id);
CREATE INDEX idx_forum_posts_author ON forum_posts(author_id);
CREATE INDEX idx_forum_posts_activity ON forum_posts(last_activity_at DESC);
CREATE INDEX idx_forum_posts_featured ON forum_posts(is_featured, created_at DESC);

-- Enable RLS
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Posts are viewable by everyone" ON forum_posts
  FOR SELECT USING (true);
  
CREATE POLICY "Authenticated users can create posts" ON forum_posts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  
CREATE POLICY "Users can update their own posts" ON forum_posts
  FOR UPDATE USING (auth.uid() = author_id);
  
CREATE POLICY "Users can delete their own posts" ON forum_posts
  FOR DELETE USING (auth.uid() = author_id);
-- Forum post replies and nested comments
CREATE TABLE forum_replies (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES forum_posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id),
  content TEXT NOT NULL,
  parent_reply_id INTEGER REFERENCES forum_replies(id),
  likes_count INTEGER DEFAULT 0,
  is_solution BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_forum_replies_post ON forum_replies(post_id);
CREATE INDEX idx_forum_replies_author ON forum_replies(author_id);
CREATE INDEX idx_forum_replies_parent ON forum_replies(parent_reply_id);

-- Enable RLS
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Replies are viewable by everyone" ON forum_replies
  FOR SELECT USING (true);
  
CREATE POLICY "Authenticated users can create replies" ON forum_replies
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  
CREATE POLICY "Users can update their own replies" ON forum_replies
  FOR UPDATE USING (auth.uid() = author_id);
  
CREATE POLICY "Users can delete their own replies" ON forum_replies
  FOR DELETE USING (auth.uid() = author_id);
-- Likes system for posts, videos, resources, etc.
CREATE TABLE likes (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  likeable_type VARCHAR(50) NOT NULL, -- forum_post, forum_reply, video, news_article, resource
  likeable_id INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, likeable_type, likeable_id)
);

-- User follows system
CREATE TABLE user_follows (
  id SERIAL PRIMARY KEY,
  follower_id UUID REFERENCES auth.users(id),
  following_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Notifications system
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  type VARCHAR(50) NOT NULL, -- like, follow, reply, mention, event_reminder, system
  title VARCHAR(255) NOT NULL,
  message TEXT,
  related_type VARCHAR(50), -- forum_post, event, etc.
  related_id INTEGER,
  action_url TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User activity tracking
CREATE TABLE user_activity (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  activity_type VARCHAR(50) NOT NULL, -- login, post_created, video_uploaded, location_added
  activity_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_likes_user ON likes(user_id);
CREATE INDEX idx_likes_likeable ON likes(likeable_type, likeable_id);
CREATE INDEX idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX idx_user_follows_following ON user_follows(following_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX idx_user_activity_user ON user_activity(user_id, created_at DESC);

-- Enable RLS
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

-- Policies for likes
CREATE POLICY "Likes are viewable by everyone" ON likes
  FOR SELECT USING (true);
  
CREATE POLICY "Authenticated users can like content" ON likes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  
CREATE POLICY "Users can unlike their own likes" ON likes
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for follows
CREATE POLICY "Follows are viewable by everyone" ON user_follows
  FOR SELECT USING (true);
  
CREATE POLICY "Authenticated users can follow others" ON user_follows
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  
CREATE POLICY "Users can unfollow" ON user_follows
  FOR DELETE USING (auth.uid() = follower_id);

-- Policies for notifications
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Policies for activity
CREATE POLICY "Users can view their own activity" ON user_activity
  FOR SELECT USING (auth.uid() = user_id);
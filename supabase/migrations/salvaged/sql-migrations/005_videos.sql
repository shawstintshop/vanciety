-- Video library with YouTube integration and internal storage
CREATE TABLE videos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  youtube_url TEXT,
  youtube_video_id VARCHAR(50),
  internal_video_url TEXT,
  thumbnail_url TEXT,
  category VARCHAR(100),
  tags TEXT[],
  duration INTEGER, -- Duration in seconds
  view_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  uploaded_by UUID REFERENCES auth.users(id),
  is_featured BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_videos_category ON videos(category);
CREATE INDEX idx_videos_featured ON videos(is_featured, created_at DESC);
CREATE INDEX idx_videos_premium ON videos(is_premium);
CREATE INDEX idx_videos_youtube_id ON videos(youtube_video_id);

-- Video categories enum-like constraint
ALTER TABLE videos ADD CONSTRAINT videos_category_check 
  CHECK (category IN ('Van Builds', 'Tech Tips', 'Camping Adventures', 'Vanlife Tours', 
                     'How-Tos', 'Product Reviews', 'Overland Expeditions', '4x4 Mods', 
                     'Revel Van Specifics', 'Solar Installation', 'Interior Design'));

-- Enable RLS
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Videos are viewable by everyone" ON videos
  FOR SELECT USING (is_approved = true);
  
CREATE POLICY "Authenticated users can upload videos" ON videos
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  
CREATE POLICY "Users can update their own videos" ON videos
  FOR UPDATE USING (auth.uid() = uploaded_by);
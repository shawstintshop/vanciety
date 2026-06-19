-- Forum categories for organizing discussions
CREATE TABLE forum_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  slug VARCHAR(100) UNIQUE,
  icon VARCHAR(50),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  post_count INTEGER DEFAULT 0,
  last_post_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO forum_categories (name, description, slug, icon, sort_order) VALUES
('Van Builds', 'Share your van build progress and get advice', 'van-builds', 'wrench', 1),
('Technical Help', 'Get help with electrical, plumbing, and mechanical issues', 'technical-help', 'tool', 2),
('Routes & Destinations', 'Share your favorite routes and hidden gems', 'routes-destinations', 'map', 3),
('Gear & Equipment', 'Discuss van life gear and equipment reviews', 'gear-equipment', 'package', 4),
('Community & Meetups', 'Connect with other vanlifers and organize meetups', 'community-meetups', 'users', 5),
('Newbie Questions', 'Ask questions if you\'re new to van life', 'newbie-questions', 'help-circle', 6),
('Solar & Electrical', 'Everything about van electrical systems', 'solar-electrical', 'zap', 7),
('Budget Van Life', 'Tips for van life on a budget', 'budget-van-life', 'dollar-sign', 8);

-- Enable RLS
ALTER TABLE forum_categories ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Categories are viewable by everyone" ON forum_categories
  FOR SELECT USING (true);
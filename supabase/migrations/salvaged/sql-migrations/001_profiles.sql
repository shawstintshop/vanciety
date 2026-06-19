-- User profiles with vanlife-specific information
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  display_name VARCHAR(100),
  bio TEXT,
  avatar_url TEXT,
  location VARCHAR(255),
  van_type VARCHAR(100),
  van_year INTEGER,
  van_description TEXT,
  is_verified BOOLEAN DEFAULT false,
  verification_status VARCHAR(50) DEFAULT 'pending',
  is_premium BOOLEAN DEFAULT false,
  premium_expires_at TIMESTAMP WITH TIME ZONE,
  social_links JSONB,
  contact_preferences JSONB DEFAULT '{"email_notifications": true, "forum_mentions": true, "event_updates": true}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on username for faster lookups
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_premium ON profiles(is_premium, premium_expires_at);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);
  
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
  
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
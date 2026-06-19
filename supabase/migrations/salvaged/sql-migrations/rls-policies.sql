-- Row Level Security Policies for Sprintersociety.com
-- Run these after creating the main schema

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Videos policies
CREATE POLICY "Videos are viewable by everyone"
  ON videos FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert videos"
  ON videos FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own videos"
  ON videos FOR UPDATE
  USING (auth.uid() = uploaded_by);

-- News articles policies
CREATE POLICY "News articles are viewable by everyone"
  ON news_articles FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert articles"
  ON news_articles FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own articles"
  ON news_articles FOR UPDATE
  USING (auth.uid() = author_id);

-- Forum posts policies
CREATE POLICY "Forum posts are viewable by everyone"
  ON forum_posts FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert posts"
  ON forum_posts FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own posts"
  ON forum_posts FOR UPDATE
  USING (auth.uid() = author_id);

-- Forum replies policies
CREATE POLICY "Forum replies are viewable by everyone"
  ON forum_replies FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert replies"
  ON forum_replies FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own replies"
  ON forum_replies FOR UPDATE
  USING (auth.uid() = author_id);

-- Locations policies
CREATE POLICY "Public locations are viewable by everyone"
  ON locations FOR SELECT
  USING (NOT is_premium_only OR EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND is_premium = true
  ));

CREATE POLICY "Authenticated users can insert locations"
  ON locations FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own locations"
  ON locations FOR UPDATE
  USING (auth.uid() = submitted_by);

-- Events policies
CREATE POLICY "Public events are viewable by everyone"
  ON events FOR SELECT
  USING (NOT is_premium_only OR EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND is_premium = true
  ));

CREATE POLICY "Authenticated users can insert events"
  ON events FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own events"
  ON events FOR UPDATE
  USING (auth.uid() = organizer_id);

-- Messages policies
CREATE POLICY "Users can view their own messages"
  ON messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Authenticated users can send messages"
  ON messages FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = sender_id);

CREATE POLICY "Users can update their own sent messages"
  ON messages FOR UPDATE
  USING (auth.uid() = sender_id);

-- Subscriptions policies
CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions"
  ON subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
  ON subscriptions FOR UPDATE
  USING (auth.uid() = user_id);
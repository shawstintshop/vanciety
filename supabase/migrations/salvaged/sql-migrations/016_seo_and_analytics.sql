-- SEO and analytics tracking
CREATE TABLE page_views (
  id SERIAL PRIMARY KEY,
  page_path VARCHAR(500) NOT NULL,
  user_id UUID REFERENCES auth.users(id), -- Can be null for anonymous users
  session_id VARCHAR(100),
  referrer_url TEXT,
  user_agent TEXT,
  ip_address INET,
  country VARCHAR(2),
  device_type VARCHAR(20), -- desktop, mobile, tablet
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Popular search terms
CREATE TABLE search_analytics (
  id SERIAL PRIMARY KEY,
  search_term VARCHAR(255) NOT NULL,
  search_type VARCHAR(50), -- videos, forum, products, resources, locations
  user_id UUID REFERENCES auth.users(id),
  results_count INTEGER,
  clicked_result_id INTEGER,
  clicked_result_type VARCHAR(50),
  searched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site statistics aggregated daily
CREATE TABLE daily_stats (
  id SERIAL PRIMARY KEY,
  stat_date DATE UNIQUE NOT NULL,
  total_page_views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  new_users INTEGER DEFAULT 0,
  forum_posts INTEGER DEFAULT 0,
  forum_replies INTEGER DEFAULT 0,
  video_uploads INTEGER DEFAULT 0,
  product_views INTEGER DEFAULT 0,
  event_rsvps INTEGER DEFAULT 0,
  premium_signups INTEGER DEFAULT 0,
  revenue_cents INTEGER DEFAULT 0, -- Daily revenue in cents
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email newsletter subscriptions
CREATE TABLE newsletter_subscriptions (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id), -- Can be null for non-registered users
  subscription_status VARCHAR(20) DEFAULT 'active', -- active, unsubscribed, bounced
  subscription_source VARCHAR(50), -- homepage, forum, checkout, etc.
  interests TEXT[], -- van_builds, events, products, news
  confirmed_at TIMESTAMP WITH TIME ZONE,
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email campaign tracking
CREATE TABLE email_campaigns (
  id SERIAL PRIMARY KEY,
  campaign_name VARCHAR(255) NOT NULL,
  subject_line VARCHAR(255),
  content_html TEXT,
  content_text TEXT,
  sent_to_count INTEGER DEFAULT 0,
  open_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  unsubscribe_count INTEGER DEFAULT 0,
  bounce_count INTEGER DEFAULT 0,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- A/B testing framework
CREATE TABLE ab_tests (
  id SERIAL PRIMARY KEY,
  test_name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT false,
  variants JSONB, -- Store test variants configuration
  success_metric VARCHAR(50), -- conversion_rate, signup_rate, etc.
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- A/B test assignments for users
CREATE TABLE ab_test_assignments (
  id SERIAL PRIMARY KEY,
  test_id INTEGER REFERENCES ab_tests(id),
  user_id UUID REFERENCES auth.users(id),
  session_id VARCHAR(100), -- For anonymous users
  variant VARCHAR(50) NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  converted BOOLEAN DEFAULT false,
  converted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX idx_page_views_date ON page_views(viewed_at);
CREATE INDEX idx_page_views_path ON page_views(page_path);
CREATE INDEX idx_page_views_user ON page_views(user_id);
CREATE INDEX idx_search_analytics_term ON search_analytics(search_term);
CREATE INDEX idx_search_analytics_date ON search_analytics(searched_at);
CREATE INDEX idx_daily_stats_date ON daily_stats(stat_date);
CREATE INDEX idx_newsletter_email ON newsletter_subscriptions(email);
CREATE INDEX idx_ab_test_assignments_test ON ab_test_assignments(test_id);
CREATE INDEX idx_ab_test_assignments_user ON ab_test_assignments(user_id);

-- Enable RLS
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_test_assignments ENABLE ROW LEVEL SECURITY;

-- Analytics policies (mostly admin-only, some user access)
CREATE POLICY "Only admins can view page views" ON page_views
  FOR SELECT USING (EXISTS (SELECT 1 FROM admin_roles ar WHERE ar.user_id = auth.uid() AND ar.is_active = true));

CREATE POLICY "Only admins can view search analytics" ON search_analytics
  FOR SELECT USING (EXISTS (SELECT 1 FROM admin_roles ar WHERE ar.user_id = auth.uid() AND ar.is_active = true));

CREATE POLICY "Only admins can view daily stats" ON daily_stats
  FOR SELECT USING (EXISTS (SELECT 1 FROM admin_roles ar WHERE ar.user_id = auth.uid() AND ar.is_active = true));

CREATE POLICY "Users can view their own newsletter subscription" ON newsletter_subscriptions
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscriptions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own subscription" ON newsletter_subscriptions
  FOR UPDATE USING (auth.uid() = user_id OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Only admins can view email campaigns" ON email_campaigns
  FOR SELECT USING (EXISTS (SELECT 1 FROM admin_roles ar WHERE ar.user_id = auth.uid() AND ar.is_active = true));

CREATE POLICY "Only admins can view A/B tests" ON ab_tests
  FOR SELECT USING (EXISTS (SELECT 1 FROM admin_roles ar WHERE ar.user_id = auth.uid() AND ar.is_active = true));

CREATE POLICY "Users can view their own A/B test assignments" ON ab_test_assignments
  FOR SELECT USING (auth.uid() = user_id);
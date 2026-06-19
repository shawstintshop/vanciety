-- Admin and moderation system
CREATE TABLE admin_roles (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  role VARCHAR(50) NOT NULL, -- super_admin, admin, moderator, content_reviewer
  permissions JSONB, -- Specific permissions for the role
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Content moderation queue
CREATE TABLE moderation_queue (
  id SERIAL PRIMARY KEY,
  content_type VARCHAR(50) NOT NULL, -- forum_post, forum_reply, video, review, etc.
  content_id INTEGER NOT NULL,
  reported_by UUID REFERENCES auth.users(id),
  reason VARCHAR(100),
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, escalated
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  admin_notes TEXT,
  action_taken VARCHAR(100), -- approved, content_removed, user_warned, user_suspended
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User suspensions and bans
CREATE TABLE user_suspensions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  suspended_by UUID REFERENCES auth.users(id),
  reason TEXT NOT NULL,
  suspension_type VARCHAR(20), -- warning, temporary, permanent
  starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System settings and configuration
CREATE TABLE system_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type VARCHAR(20), -- string, number, boolean, json
  description TEXT,
  is_public BOOLEAN DEFAULT false, -- Whether this setting can be viewed by non-admins
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('site_name', 'Sprinter Society', 'string', 'Website name', true),
('site_description', 'The ultimate community for Mercedes Sprinter van enthusiasts', 'string', 'Site description for SEO', true),
('premium_price_monthly', '9.99', 'number', 'Monthly premium membership price', true),
('max_file_upload_size', '10485760', 'number', 'Maximum file upload size in bytes (10MB)', false),
('forum_posts_per_page', '20', 'number', 'Number of forum posts per page', true),
('require_email_verification', 'true', 'boolean', 'Require email verification for new accounts', false),
('allow_user_registration', 'true', 'boolean', 'Allow new user registrations', true),
('maintenance_mode', 'false', 'boolean', 'Enable maintenance mode', false),
('google_analytics_id', '', 'string', 'Google Analytics tracking ID', false),
('stripe_publishable_key', '', 'string', 'Stripe publishable key', false);

-- Admin activity log
CREATE TABLE admin_activity_log (
  id SERIAL PRIMARY KEY,
  admin_id UUID REFERENCES auth.users(id),
  action VARCHAR(100) NOT NULL,
  target_type VARCHAR(50), -- user, post, business, etc.
  target_id INTEGER,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_admin_roles_user ON admin_roles(user_id);
CREATE INDEX idx_moderation_queue_status ON moderation_queue(status, created_at);
CREATE INDEX idx_user_suspensions_user ON user_suspensions(user_id);
CREATE INDEX idx_user_suspensions_active ON user_suspensions(is_active, expires_at);
CREATE INDEX idx_admin_activity_log_admin ON admin_activity_log(admin_id, created_at DESC);

-- Enable RLS
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_suspensions ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;

-- Admin policies (restrictive - only admins can access)
CREATE POLICY "Only admins can view admin roles" ON admin_roles
  FOR SELECT USING (EXISTS (SELECT 1 FROM admin_roles ar WHERE ar.user_id = auth.uid() AND ar.is_active = true));

CREATE POLICY "Only admins can view moderation queue" ON moderation_queue
  FOR SELECT USING (EXISTS (SELECT 1 FROM admin_roles ar WHERE ar.user_id = auth.uid() AND ar.is_active = true));

CREATE POLICY "Only admins can view suspensions" ON user_suspensions
  FOR SELECT USING (EXISTS (SELECT 1 FROM admin_roles ar WHERE ar.user_id = auth.uid() AND ar.is_active = true));

CREATE POLICY "Public settings are viewable by everyone" ON system_settings
  FOR SELECT USING (is_public = true);

CREATE POLICY "Only admins can view all settings" ON system_settings
  FOR SELECT USING (EXISTS (SELECT 1 FROM admin_roles ar WHERE ar.user_id = auth.uid() AND ar.is_active = true));

CREATE POLICY "Only admins can view activity logs" ON admin_activity_log
  FOR SELECT USING (EXISTS (SELECT 1 FROM admin_roles ar WHERE ar.user_id = auth.uid() AND ar.is_active = true));
-- Newsletter/Waitlist System for Van Show
-- Migration: 20260620030000_newsletter_system.sql
-- 
-- Implements:
-- 1. Newsletter signups (email + SMS opt-in)
-- 2. Broadcast messages (send daily van news)
-- 3. Admin management

-- Newsletter subscribers
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Contact info
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  
  -- Opt-in preferences
  email_opt_in BOOLEAN DEFAULT TRUE,
  sms_opt_in BOOLEAN DEFAULT FALSE,
  
  -- Interest tracking
  interest TEXT[], -- 'member', 'manufacturer', 'coordinator', 'general'
  source_page TEXT,
  referral_code TEXT,
  
  -- Status
  status TEXT DEFAULT 'active', -- active, unsubscribed, bounced
  verified_email BOOLEAN DEFAULT FALSE,
  verified_phone BOOLEAN DEFAULT FALSE,
  
  -- Engagement
  open_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  last_engaged_at TIMESTAMPTZ,
  
  -- User association (optional, for logged-in users)
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  
  -- Compliance
  ip_address INET,
  user_agent TEXT,
  consent_timestamp TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT valid_phone CHECK (phone IS NULL OR phone ~ '^\+?[1-9]\d{1,14}$'),
  CONSTRAINT valid_status CHECK (status IN ('active', 'unsubscribed', 'bounced'))
);

-- Broadcast messages (daily van news, launch announcements)
CREATE TABLE newsletter_broadcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Message content
  subject TEXT NOT NULL,
  body_text TEXT NOT NULL,
  body_html TEXT,
  preview_text TEXT,
  
  -- Delivery settings
  channel TEXT DEFAULT 'email', -- email, sms, both
  segment TEXT DEFAULT 'all', -- all, members, manufacturers, coordinators
  
  -- Scheduling
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  status TEXT DEFAULT 'draft', -- draft, scheduled, sending, sent, failed
  
  -- Stats
  total_recipients INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  bounced_count INTEGER DEFAULT 0,
  unsubscribed_count INTEGER DEFAULT 0,
  
  -- Sender
  sent_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_channel CHECK (channel IN ('email', 'sms', 'both')),
  CONSTRAINT valid_status CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'failed'))
);

-- Broadcast delivery tracking
CREATE TABLE newsletter_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  broadcast_id UUID NOT NULL REFERENCES newsletter_broadcasts(id) ON DELETE CASCADE,
  subscriber_id UUID NOT NULL REFERENCES newsletter_subscribers(id) ON DELETE CASCADE,
  
  -- Delivery
  channel TEXT NOT NULL, -- email, sms
  status TEXT DEFAULT 'pending', -- pending, sent, delivered, bounced, failed
  
  -- Engagement
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ,
  
  -- Error tracking
  error_message TEXT,
  bounce_reason TEXT,
  
  -- External tracking
  external_id TEXT, -- Provider message ID (SendGrid, Twilio, etc.)
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_broadcast_subscriber UNIQUE(broadcast_id, subscriber_id, channel),
  CONSTRAINT valid_channel CHECK (channel IN ('email', 'sms')),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'sent', 'delivered', 'bounced', 'failed'))
);

-- Indexes for performance
CREATE INDEX idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_subscribers_phone ON newsletter_subscribers(phone);
CREATE INDEX idx_newsletter_subscribers_status ON newsletter_subscribers(status);
CREATE INDEX idx_newsletter_subscribers_email_opt_in ON newsletter_subscribers(email_opt_in) WHERE email_opt_in = TRUE;
CREATE INDEX idx_newsletter_subscribers_sms_opt_in ON newsletter_subscribers(sms_opt_in) WHERE sms_opt_in = TRUE;
CREATE INDEX idx_newsletter_subscribers_created_at ON newsletter_subscribers(created_at DESC);

CREATE INDEX idx_newsletter_broadcasts_status ON newsletter_broadcasts(status);
CREATE INDEX idx_newsletter_broadcasts_scheduled_for ON newsletter_broadcasts(scheduled_for);
CREATE INDEX idx_newsletter_broadcasts_sent_at ON newsletter_broadcasts(sent_at DESC);

CREATE INDEX idx_newsletter_deliveries_broadcast_id ON newsletter_deliveries(broadcast_id);
CREATE INDEX idx_newsletter_deliveries_subscriber_id ON newsletter_deliveries(subscriber_id);
CREATE INDEX idx_newsletter_deliveries_status ON newsletter_deliveries(status);

-- Updated_at trigger
CREATE TRIGGER update_newsletter_subscribers_updated_at
  BEFORE UPDATE ON newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_newsletter_broadcasts_updated_at
  BEFORE UPDATE ON newsletter_broadcasts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_broadcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_deliveries ENABLE ROW LEVEL SECURITY;

-- Public can subscribe (anonymous signup)
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (true);

-- Subscribers can view/update own subscription
CREATE POLICY "Subscribers can view own subscription"
  ON newsletter_subscribers FOR SELECT
  USING (email = current_setting('request.jwt.claims', true)::json->>'email' OR id = auth.uid());

CREATE POLICY "Subscribers can update own subscription"
  ON newsletter_subscribers FOR UPDATE
  USING (email = current_setting('request.jwt.claims', true)::json->>'email' OR id = auth.uid());

-- Admins can manage everything
CREATE POLICY "Admins can manage all subscribers"
  ON newsletter_subscribers FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND user_role = 'admin'
    )
  );

CREATE POLICY "Admins can manage broadcasts"
  ON newsletter_broadcasts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND user_role = 'admin'
    )
  );

CREATE POLICY "Admins can view deliveries"
  ON newsletter_deliveries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND user_role = 'admin'
    )
  );

-- Function to get active subscribers by segment
CREATE OR REPLACE FUNCTION get_active_subscribers(segment_filter TEXT DEFAULT 'all')
RETURNS SETOF newsletter_subscribers AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM newsletter_subscribers
  WHERE status = 'active'
    AND email_opt_in = TRUE
    AND (
      segment_filter = 'all'
      OR segment_filter = ANY(interest)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record broadcast open
CREATE OR REPLACE FUNCTION record_broadcast_open(
  p_broadcast_id UUID,
  p_subscriber_id UUID
)
RETURNS VOID AS $$
BEGIN
  -- Update delivery record
  UPDATE newsletter_deliveries
  SET opened_at = NOW(),
      status = 'delivered'
  WHERE broadcast_id = p_broadcast_id
    AND subscriber_id = p_subscriber_id
    AND opened_at IS NULL;
  
  -- Update broadcast stats
  UPDATE newsletter_broadcasts
  SET opened_count = opened_count + 1
  WHERE id = p_broadcast_id;
  
  -- Update subscriber engagement
  UPDATE newsletter_subscribers
  SET open_count = open_count + 1,
      last_engaged_at = NOW()
  WHERE id = p_subscriber_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record broadcast click
CREATE OR REPLACE FUNCTION record_broadcast_click(
  p_broadcast_id UUID,
  p_subscriber_id UUID
)
RETURNS VOID AS $$
BEGIN
  -- Update delivery record
  UPDATE newsletter_deliveries
  SET clicked_at = NOW()
  WHERE broadcast_id = p_broadcast_id
    AND subscriber_id = p_subscriber_id
    AND clicked_at IS NULL;
  
  -- Update broadcast stats
  UPDATE newsletter_broadcasts
  SET clicked_count = clicked_count + 1
  WHERE id = p_broadcast_id;
  
  -- Update subscriber engagement
  UPDATE newsletter_subscribers
  SET click_count = click_count + 1,
      last_engaged_at = NOW()
  WHERE id = p_subscriber_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments
COMMENT ON TABLE newsletter_subscribers IS 'Newsletter/waitlist subscribers with email and SMS opt-in';
COMMENT ON TABLE newsletter_broadcasts IS 'Broadcast messages for daily van news and announcements';
COMMENT ON TABLE newsletter_deliveries IS 'Delivery tracking for newsletter broadcasts';

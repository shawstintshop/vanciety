# Manual Migration Guide - Newsletter System

**SHAW - Run this in Supabase Dashboard**

## Step 1: Open SQL Editor

1. Go to: https://supabase.com/dashboard/project/vfrxntxjigtgutevijmb/sql/new
2. Copy/paste the SQL below
3. Click "RUN"

## Step 2: Newsletter System Migration

```sql
-- Newsletter/Waitlist System for Van Show
-- Creates tables for email/SMS collection and daily van news broadcasts

-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  email_opt_in BOOLEAN DEFAULT TRUE,
  sms_opt_in BOOLEAN DEFAULT FALSE,
  interest TEXT[],
  source_page TEXT,
  referral_code TEXT,
  status TEXT DEFAULT 'active',
  verified_email BOOLEAN DEFAULT FALSE,
  verified_phone BOOLEAN DEFAULT FALSE,
  open_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  last_engaged_at TIMESTAMPTZ,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  ip_address INET,
  user_agent TEXT,
  consent_timestamp TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT valid_phone CHECK (phone IS NULL OR phone ~ '^\+?[1-9]\d{1,14}$'),
  CONSTRAINT valid_status CHECK (status IN ('active', 'unsubscribed', 'bounced'))
);

-- Enable RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Public can subscribe
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (true);

-- Indexes
CREATE INDEX idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_subscribers_status ON newsletter_subscribers(status);
CREATE INDEX idx_newsletter_subscribers_created_at ON newsletter_subscribers(created_at DESC);

-- Success message
SELECT 'Newsletter system created successfully!' as status;
```

## Step 3: Verify

Run this query to verify table exists:

```sql
SELECT COUNT(*) as ready FROM information_schema.tables 
WHERE table_name = 'newsletter_subscribers';
```

Should return `ready = 1`

## Step 4: Test Insert

```sql
INSERT INTO newsletter_subscribers (email, phone, email_opt_in, sms_opt_in, interest, source_page)
VALUES ('test@vanciety.com', '+12065551234', true, true, ARRAY['member', 'general'], 'test');

SELECT * FROM newsletter_subscribers ORDER BY created_at DESC LIMIT 1;
```

## Done!

Once this runs successfully, the newsletter signup will work on the live site.

You can view signups anytime:

```sql
SELECT email, phone, interest, source_page, created_at 
FROM newsletter_subscribers 
ORDER BY created_at DESC;
```

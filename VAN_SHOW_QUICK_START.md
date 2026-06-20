# Van Show Quick Start - Newsletter System

**STATUS**: Code pushed, Vercel building now

---

## For The Van Show (TODAY)

### Step 1: Apply Database Migration (5 minutes)

**You need to do this once** - creates newsletter_subscribers table in Supabase.

1. Open: https://supabase.com/dashboard/project/vfrxntxjigtgutevijmb/sql/new
2. Copy/paste this SQL:

```sql
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  email_opt_in BOOLEAN DEFAULT TRUE,
  sms_opt_in BOOLEAN DEFAULT FALSE,
  interest TEXT[],
  source_page TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_agent TEXT,
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (true);

CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_created ON newsletter_subscribers(created_at DESC);

SELECT 'Newsletter system ready!' as status;
```

3. Click **RUN**
4. Should see: `status = "Newsletter system ready!"`

### Step 2: Wait for Vercel Deploy (~2 minutes)

Vercel is auto-deploying now. Check: https://vercel.com/shaws-projects-76e5aff9/primary-app/deployments

When complete, visit: https://primaryapp.vercel.app

You should see newsletter signup at bottom of homepage.

### Step 3: Test Signup

1. Go to homepage
2. Scroll to newsletter section
3. Enter test email
4. Check it works

### Step 4: View Signups Anytime

Run this in Supabase SQL editor:

```sql
SELECT 
  email, 
  phone, 
  interest, 
  source_page, 
  created_at 
FROM newsletter_subscribers 
ORDER BY created_at DESC;
```

---

## What People Will See at the Show

**Homepage** (https://primaryapp.vercel.app):
- All current features work
- NEW: Newsletter signup card at bottom
- Form asks for email + phone
- Checkboxes for email/SMS opt-in
- Interest badges (Community, Products, Events, News)
- Success message after signup

**Mobile optimized** - looks great on phone

---

## What You Can Say

> "Vanciety is launching soon - sign up here and we'll text/email you when we go live, plus daily van news, events, and community updates."

> "We're building a full manufacturer directory, event calendar, and member features. Join early to help shape it."

---

## After The Show

I have 3 senior engineers building in parallel RIGHT NOW:

1. **Manufacturer Platform** - Self-service signup, Stripe payments, product dashboard
2. **Event System** - Coordinator submissions, admin approval, public calendar
3. **Admin Tools** - Broadcast newsletters, manage signups, content moderation

Timeline: 7-10 days to full production launch.

---

## Troubleshooting

**Newsletter signup not showing?**
- Clear browser cache
- Check Vercel deployment finished
- Try incognito mode

**SQL migration failed?**
- Table might already exist (that's OK!)
- Check for error message
- DM me the error

**Need to send test broadcast?**
- Wait for admin panel (building now)
- Or I can send manual SQL query

---

## Van Show Checklist

- [ ] SQL migration applied in Supabase
- [ ] Vercel deployment complete
- [ ] Tested newsletter signup works
- [ ] Can view signups in Supabase
- [ ] Site loads fast on mobile
- [ ] Ready to show people!

**You're good to go!** 🚐

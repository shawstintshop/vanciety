-- Vanciety Production Schema - Event Management & Coordinator Workflow
-- Migration: 20260620022000_event_management.sql
--
-- Implements:
-- 1. Event submissions with approval workflow
-- 2. Event coordinator role management
-- 3. RSVP tracking
-- 4. Public event calendar

-- Event submissions (coordinator workflow)
CREATE TABLE event_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submitted_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Event details
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  
  -- Date and time
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  timezone TEXT DEFAULT 'America/Los_Angeles',
  is_multi_day BOOLEAN DEFAULT FALSE,
  
  -- Location
  venue_name TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT,
  country TEXT DEFAULT 'US',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Event details
  category TEXT NOT NULL, -- rally, expo, meetup, workshop, gathering
  subcategory TEXT,
  tags TEXT[],
  expected_attendance INTEGER,
  
  -- Registration
  registration_required BOOLEAN DEFAULT FALSE,
  registration_url TEXT,
  registration_deadline TIMESTAMPTZ,
  max_attendees INTEGER,
  cost_info TEXT, -- "Free", "$50", "Varies", etc.
  
  -- Contact
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  organizer_website TEXT,
  
  -- Media
  image_url TEXT,
  additional_images JSONB DEFAULT '[]'::jsonb,
  
  -- Approval workflow
  status TEXT DEFAULT 'pending', -- pending, approved, rejected, changes_requested
  reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  admin_notes TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  
  CONSTRAINT valid_dates CHECK (end_date IS NULL OR end_date >= start_date),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'rejected', 'changes_requested'))
);

-- Public events (approved events only)
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES event_submissions(id) ON DELETE SET NULL,
  
  -- Event details (copied from submission)
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  
  -- Date and time
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  timezone TEXT DEFAULT 'America/Los_Angeles',
  is_multi_day BOOLEAN DEFAULT FALSE,
  
  -- Location
  venue_name TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT,
  country TEXT DEFAULT 'US',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Event details
  category TEXT NOT NULL,
  subcategory TEXT,
  tags TEXT[],
  expected_attendance INTEGER,
  
  -- Registration
  registration_required BOOLEAN DEFAULT FALSE,
  registration_url TEXT,
  registration_deadline TIMESTAMPTZ,
  max_attendees INTEGER,
  cost_info TEXT,
  
  -- Contact
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  organizer_website TEXT,
  
  -- Media
  image_url TEXT,
  additional_images JSONB DEFAULT '[]'::jsonb,
  
  -- Source tracking
  source_badge TEXT DEFAULT 'COMMUNITY', -- COMMUNITY, VERIFIED, OFFICIAL
  submitted_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Engagement
  view_count INTEGER DEFAULT 0,
  rsvp_count INTEGER DEFAULT 0,
  
  -- Status
  status TEXT DEFAULT 'active', -- active, past, canceled
  is_featured BOOLEAN DEFAULT FALSE,
  featured_until TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_dates CHECK (end_date IS NULL OR end_date >= start_date)
);

-- Event RSVPs
CREATE TABLE event_rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- RSVP details
  status TEXT DEFAULT 'going', -- going, maybe, not_going
  guests_count INTEGER DEFAULT 0,
  
  -- Contact (optional, for organizers)
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  
  -- Notes
  notes TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_event_user_rsvp UNIQUE(event_id, user_id),
  CONSTRAINT valid_status CHECK (status IN ('going', 'maybe', 'not_going'))
);

-- Coordinator applications
CREATE TABLE coordinator_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Application details
  organization_name TEXT,
  organization_type TEXT, -- Individual, Club, Business, Nonprofit
  years_organizing INTEGER,
  past_events_description TEXT,
  
  -- References
  references JSONB DEFAULT '[]'::jsonb, -- Array of {name, email, relationship}
  
  -- Social/website
  website_url TEXT,
  social_links JSONB DEFAULT '{}'::jsonb,
  
  -- Approval
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_user_application UNIQUE(user_id),
  CONSTRAINT valid_application_status CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Indexes
CREATE INDEX idx_event_submissions_submitted_by ON event_submissions(submitted_by);
CREATE INDEX idx_event_submissions_status ON event_submissions(status);
CREATE INDEX idx_event_submissions_start_date ON event_submissions(start_date);

CREATE INDEX idx_events_start_date ON events(start_date DESC);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_featured ON events(is_featured, featured_until);
CREATE INDEX idx_events_location ON events(city, state);

CREATE INDEX idx_event_rsvps_event_id ON event_rsvps(event_id);
CREATE INDEX idx_event_rsvps_user_id ON event_rsvps(user_id);
CREATE INDEX idx_event_rsvps_status ON event_rsvps(status);

CREATE INDEX idx_coordinator_applications_user_id ON coordinator_applications(user_id);
CREATE INDEX idx_coordinator_applications_status ON coordinator_applications(status);

-- Updated_at triggers
CREATE TRIGGER update_event_submissions_updated_at
  BEFORE UPDATE ON event_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_rsvps_updated_at
  BEFORE UPDATE ON event_rsvps
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coordinator_applications_updated_at
  BEFORE UPDATE ON coordinator_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE event_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE coordinator_applications ENABLE ROW LEVEL SECURITY;

-- Event submissions: Coordinators can submit, admins can review
CREATE POLICY "Coordinators can view own submissions"
  ON event_submissions FOR SELECT
  USING (submitted_by = auth.uid() OR has_role('admin'));

CREATE POLICY "Coordinators can create submissions"
  ON event_submissions FOR INSERT
  WITH CHECK (
    has_role('coordinator') OR has_role('admin')
  );

CREATE POLICY "Coordinators can update own pending submissions"
  ON event_submissions FOR UPDATE
  USING (submitted_by = auth.uid() AND status = 'pending');

CREATE POLICY "Admins can update any submission"
  ON event_submissions FOR UPDATE
  USING (has_role('admin'));

-- Events: Public read for active events
CREATE POLICY "Public can view active events"
  ON events FOR SELECT
  USING (status = 'active' AND start_date >= NOW() - INTERVAL '7 days');

CREATE POLICY "Admins can manage all events"
  ON events FOR ALL
  USING (has_role('admin'));

-- RSVPs: Users manage own RSVPs
CREATE POLICY "Users can view own RSVPs"
  ON event_rsvps FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create RSVPs"
  ON event_rsvps FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own RSVPs"
  ON event_rsvps FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own RSVPs"
  ON event_rsvps FOR DELETE
  USING (user_id = auth.uid());

-- Event organizers can view RSVPs for their events
CREATE POLICY "Event organizers can view RSVPs"
  ON event_rsvps FOR SELECT
  USING (
    event_id IN (
      SELECT id FROM events WHERE submitted_by = auth.uid()
    ) OR has_role('admin')
  );

-- Coordinator applications
CREATE POLICY "Users can view own application"
  ON coordinator_applications FOR SELECT
  USING (user_id = auth.uid() OR has_role('admin'));

CREATE POLICY "Users can create application"
  ON coordinator_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pending application"
  ON coordinator_applications FOR UPDATE
  USING (user_id = auth.uid() AND status = 'pending');

CREATE POLICY "Admins can manage all applications"
  ON coordinator_applications FOR ALL
  USING (has_role('admin'));

-- Function to auto-create public event from approved submission
CREATE OR REPLACE FUNCTION create_event_from_submission()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create event when submission is approved
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    INSERT INTO events (
      submission_id,
      name,
      description,
      short_description,
      start_date,
      end_date,
      timezone,
      is_multi_day,
      venue_name,
      address_line1,
      address_line2,
      city,
      state,
      zip_code,
      country,
      latitude,
      longitude,
      category,
      subcategory,
      tags,
      expected_attendance,
      registration_required,
      registration_url,
      registration_deadline,
      max_attendees,
      cost_info,
      contact_name,
      contact_email,
      contact_phone,
      organizer_website,
      image_url,
      additional_images,
      source_badge,
      submitted_by,
      published_at
    ) VALUES (
      NEW.id,
      NEW.name,
      NEW.description,
      NEW.short_description,
      NEW.start_date,
      NEW.end_date,
      NEW.timezone,
      NEW.is_multi_day,
      NEW.venue_name,
      NEW.address_line1,
      NEW.address_line2,
      NEW.city,
      NEW.state,
      NEW.zip_code,
      NEW.country,
      NEW.latitude,
      NEW.longitude,
      NEW.category,
      NEW.subcategory,
      NEW.tags,
      NEW.expected_attendance,
      NEW.registration_required,
      NEW.registration_url,
      NEW.registration_deadline,
      NEW.max_attendees,
      NEW.cost_info,
      NEW.contact_name,
      NEW.contact_email,
      NEW.contact_phone,
      NEW.organizer_website,
      NEW.image_url,
      NEW.additional_images,
      'COMMUNITY',
      NEW.submitted_by,
      NOW()
    );
    
    -- Update submission with published timestamp
    NEW.published_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_create_event_from_approval
  BEFORE UPDATE ON event_submissions
  FOR EACH ROW
  EXECUTE FUNCTION create_event_from_submission();

-- Comments
COMMENT ON TABLE event_submissions IS 'Event submissions from coordinators pending admin approval';
COMMENT ON TABLE events IS 'Public event calendar (approved events only)';
COMMENT ON TABLE event_rsvps IS 'User RSVPs for events';
COMMENT ON TABLE coordinator_applications IS 'Applications to become an event coordinator';

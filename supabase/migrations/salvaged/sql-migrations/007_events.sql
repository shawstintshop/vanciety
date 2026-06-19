-- Events and meetups
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_type VARCHAR(50) DEFAULT 'meetup',
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location_name VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  address TEXT,
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  cost DECIMAL(10, 2) DEFAULT 0,
  organizer_id UUID REFERENCES auth.users(id),
  featured_image_url TEXT,
  is_premium_only BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  tags TEXT[],
  external_url TEXT,
  contact_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event attendees junction table
CREATE TABLE event_attendees (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  status VARCHAR(20) DEFAULT 'attending', -- attending, maybe, not_attending
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Indexes
CREATE INDEX idx_events_date ON events(start_date);
CREATE INDEX idx_events_location ON events(latitude, longitude);
CREATE INDEX idx_events_organizer ON events(organizer_id);
CREATE INDEX idx_event_attendees_event ON event_attendees(event_id);
CREATE INDEX idx_event_attendees_user ON event_attendees(user_id);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;

-- Policies for events
CREATE POLICY "Published events are viewable by everyone" ON events
  FOR SELECT USING (is_published = true);
  
CREATE POLICY "Authenticated users can create events" ON events
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  
CREATE POLICY "Organizers can update their events" ON events
  FOR UPDATE USING (auth.uid() = organizer_id);

-- Policies for event attendees
CREATE POLICY "Event attendees are viewable by everyone" ON event_attendees
  FOR SELECT USING (true);
  
CREATE POLICY "Authenticated users can RSVP" ON event_attendees
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  
CREATE POLICY "Users can update their own RSVP" ON event_attendees
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete their own RSVP" ON event_attendees
  FOR DELETE USING (auth.uid() = user_id);
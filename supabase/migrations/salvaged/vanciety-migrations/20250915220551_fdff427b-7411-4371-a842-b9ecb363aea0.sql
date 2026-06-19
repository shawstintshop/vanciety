-- Create locations table for camping spots and points of interest
CREATE TABLE public.locations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  type text NOT NULL DEFAULT 'campsite', -- campsite, poi, meetup, vendor, etc.
  amenities text[],
  user_id uuid,
  verified boolean DEFAULT false,
  rating numeric(2,1) DEFAULT 0,
  reviews_count integer DEFAULT 0,
  images text[],
  contact_info jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Locations are viewable by everyone" 
ON public.locations 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create locations" 
ON public.locations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own locations" 
ON public.locations 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_locations_updated_at
BEFORE UPDATE ON public.locations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create spatial index for better performance
CREATE INDEX idx_locations_coordinates ON public.locations USING btree (latitude, longitude);
CREATE INDEX idx_locations_type ON public.locations(type);

-- Insert some sample van life locations
INSERT INTO public.locations (name, description, latitude, longitude, type, amenities) VALUES
('Moab BLM Camping', 'Free dispersed camping with stunning red rock views. Popular with van lifers and rock climbers.', 38.5733, -109.5498, 'campsite', ARRAY['free_camping', 'scenic_views', 'hiking', 'rock_climbing']),
('Big Sur McWay Falls Area', 'Iconic California coastal camping with waterfall views. Limited spots, arrive early.', 36.1596, -121.6735, 'campsite', ARRAY['ocean_views', 'waterfalls', 'hiking', 'photography']),
('Quartzsite, Arizona', 'Winter van life mecca with huge gatherings. Thousands of vans congregate here annually.', 33.6639, -114.2251, 'meetup', ARRAY['community', 'workshops', 'vendors', 'solar_power']),
('Olympic National Forest WA', 'Dense forests and mountain views. Multiple dispersed camping areas throughout.', 47.8021, -123.5964, 'campsite', ARRAY['forests', 'mountains', 'hiking', 'free_camping']),
('Sedona Red Rock Country', 'Spiritual desert camping among incredible red rock formations.', 34.8697, -111.7610, 'campsite', ARRAY['red_rocks', 'spiritual', 'hiking', 'photography']),
('Alabama Hills California', 'Dramatic mountain backdrop used in countless movies. Free camping available.', 36.6059, -118.1289, 'campsite', ARRAY['mountains', 'free_camping', 'photography', 'stargazing']);

-- Insert some van-friendly businesses  
INSERT INTO public.locations (name, description, latitude, longitude, type, amenities) VALUES
('Harvest Hosts Network', 'Network of farms and wineries offering overnight parking for self-contained RVs.', 38.2904, -122.4580, 'vendor', ARRAY['overnight_parking', 'wine_tasting', 'farm_fresh', 'networking']),
('Flying J Travel Centers', 'Van-friendly truck stops with amenities across the country.', 39.7392, -104.9903, 'vendor', ARRAY['fuel', 'showers', 'laundry', 'wifi', 'food']);
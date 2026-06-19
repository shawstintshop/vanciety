-- Update ALL existing location types to match new system
UPDATE public.locations 
SET type = 'business' 
WHERE type = 'vendor';

UPDATE public.locations 
SET type = 'campsite' 
WHERE type NOT IN ('campsite', 'meetup', 'business');

-- Now we can safely add the constraint
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'locations_type_check'
  ) THEN
    ALTER TABLE public.locations ADD CONSTRAINT locations_type_check 
    CHECK (type IN ('campsite', 'driveway', 'event', 'business', 'poi', 'meetup'));
  END IF;
END $$;

-- Create user_locations table for live member tracking
CREATE TABLE IF NOT EXISTS public.user_locations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  last_seen timestamp with time zone NOT NULL DEFAULT now(),
  is_public boolean DEFAULT true,
  status text DEFAULT 'traveling',
  message text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security for user locations
ALTER TABLE public.user_locations ENABLE ROW LEVEL SECURITY;

-- Create policies for user locations (only if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_locations' 
    AND policyname = 'Users can view public locations'
  ) THEN
    CREATE POLICY "Users can view public locations" 
    ON public.user_locations 
    FOR SELECT 
    USING (is_public = true OR auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_locations' 
    AND policyname = 'Users can manage their own location'
  ) THEN
    CREATE POLICY "Users can manage their own location" 
    ON public.user_locations 
    FOR ALL 
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create trigger for automatic timestamp updates (only if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'update_user_locations_updated_at'
  ) THEN
    CREATE TRIGGER update_user_locations_updated_at
    BEFORE UPDATE ON public.user_locations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Create indexes (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_user_locations_coordinates ON public.user_locations(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_user_locations_user_id ON public.user_locations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_locations_last_seen ON public.user_locations(last_seen DESC);
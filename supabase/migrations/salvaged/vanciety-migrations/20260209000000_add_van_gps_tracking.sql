-- =============================================================
-- Van GPS Tracking - Phase 5
-- =============================================================
-- Adds real-time van location sharing with granular privacy
-- controls, PostGIS geo-queries, and auto-expiry.
-- =============================================================

-- 1. Enable PostGIS (idempotent — safe to run multiple times)
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Sharing-mode enum
DO $$ BEGIN
  CREATE TYPE sharing_visibility AS ENUM (
    'public',        -- visible on main map to everyone
    'friends_only',  -- visible only to accepted friends
    'event',         -- visible to participants of a specific event
    'private'        -- only for hosting / direct requests
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE sharing_precision AS ENUM (
    'exact',         -- precise lat/lng
    'approximate'    -- city-level obfuscation (~5 km jitter)
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 3. Core table: van_locations
CREATE TABLE IF NOT EXISTS van_locations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- PostGIS geography point (SRID 4326 = WGS84 / standard GPS)
  geom          geography(Point, 4326) NOT NULL,

  -- Raw coordinates for easy client reads (kept in sync with geom)
  latitude      DOUBLE PRECISION NOT NULL,
  longitude     DOUBLE PRECISION NOT NULL,

  -- Motion data from Geolocation API
  speed         DOUBLE PRECISION,   -- m/s, NULL when stationary
  heading       DOUBLE PRECISION,   -- degrees from true north
  accuracy      DOUBLE PRECISION,   -- meters

  -- Sharing controls
  visibility    sharing_visibility NOT NULL DEFAULT 'public',
  precision     sharing_precision  NOT NULL DEFAULT 'exact',
  expires_at    TIMESTAMPTZ,        -- NULL = no expiry

  -- User-facing status
  status        TEXT DEFAULT 'traveling',
  message       TEXT,

  -- Timestamps
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indices for fast geo and user lookups
CREATE INDEX IF NOT EXISTS idx_van_locations_geom
  ON van_locations USING GIST (geom);

CREATE INDEX IF NOT EXISTS idx_van_locations_user
  ON van_locations (user_id);

CREATE INDEX IF NOT EXISTS idx_van_locations_visibility
  ON van_locations (visibility);

CREATE INDEX IF NOT EXISTS idx_van_locations_expires
  ON van_locations (expires_at)
  WHERE expires_at IS NOT NULL;

-- 4. GPS sharing preferences (per-user settings)
CREATE TABLE IF NOT EXISTS gps_sharing_settings (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Master toggle
  sharing_enabled   BOOLEAN NOT NULL DEFAULT false,

  -- Defaults applied when sharing is toggled on
  default_visibility  sharing_visibility NOT NULL DEFAULT 'public',
  default_precision   sharing_precision  NOT NULL DEFAULT 'exact',
  default_duration    TEXT NOT NULL DEFAULT 'until_off',  -- forever | 24h | 1_week | until_off | custom

  -- Auto-pause after N hours of no movement (0 = disabled)
  auto_pause_hours    INT NOT NULL DEFAULT 8,

  -- Update interval in seconds
  update_interval_sec INT NOT NULL DEFAULT 30,

  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Row Level Security -----------------------------------------------

ALTER TABLE van_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE gps_sharing_settings ENABLE ROW LEVEL SECURITY;

-- van_locations policies
CREATE POLICY "Public locations readable by anyone"
  ON van_locations FOR SELECT
  USING (
    visibility = 'public'
    AND (expires_at IS NULL OR expires_at > now())
  );

CREATE POLICY "Users can read own locations"
  ON van_locations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own locations"
  ON van_locations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own locations"
  ON van_locations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own locations"
  ON van_locations FOR DELETE
  USING (auth.uid() = user_id);

-- gps_sharing_settings policies
CREATE POLICY "Users can read own GPS settings"
  ON gps_sharing_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own GPS settings"
  ON gps_sharing_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own GPS settings"
  ON gps_sharing_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- 6. Realtime — broadcast INSERT/UPDATE on van_locations
ALTER PUBLICATION supabase_realtime ADD TABLE van_locations;

-- 7. Helper: upsert van location (called from client)
CREATE OR REPLACE FUNCTION upsert_van_location(
  p_user_id     UUID,
  p_lat         DOUBLE PRECISION,
  p_lng         DOUBLE PRECISION,
  p_speed       DOUBLE PRECISION DEFAULT NULL,
  p_heading     DOUBLE PRECISION DEFAULT NULL,
  p_accuracy    DOUBLE PRECISION DEFAULT NULL,
  p_visibility  sharing_visibility DEFAULT 'public',
  p_precision   sharing_precision  DEFAULT 'exact',
  p_expires_at  TIMESTAMPTZ DEFAULT NULL,
  p_status      TEXT DEFAULT 'traveling',
  p_message     TEXT DEFAULT NULL
)
RETURNS van_locations
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  result van_locations;
  effective_lat DOUBLE PRECISION := p_lat;
  effective_lng DOUBLE PRECISION := p_lng;
BEGIN
  -- Apply city-level obfuscation when precision = 'approximate'
  IF p_precision = 'approximate' THEN
    effective_lat := p_lat + (random() - 0.5) * 0.09;  -- ~5 km jitter
    effective_lng := p_lng + (random() - 0.5) * 0.09;
  END IF;

  INSERT INTO van_locations (
    user_id, geom, latitude, longitude,
    speed, heading, accuracy,
    visibility, precision, expires_at,
    status, message, updated_at
  ) VALUES (
    p_user_id,
    ST_SetSRID(ST_MakePoint(effective_lng, effective_lat), 4326)::geography,
    effective_lat, effective_lng,
    p_speed, p_heading, p_accuracy,
    p_visibility, p_precision, p_expires_at,
    p_status, p_message, now()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    geom        = ST_SetSRID(ST_MakePoint(effective_lng, effective_lat), 4326)::geography,
    latitude    = effective_lat,
    longitude   = effective_lng,
    speed       = EXCLUDED.speed,
    heading     = EXCLUDED.heading,
    accuracy    = EXCLUDED.accuracy,
    visibility  = EXCLUDED.visibility,
    precision   = EXCLUDED.precision,
    expires_at  = EXCLUDED.expires_at,
    status      = EXCLUDED.status,
    message     = EXCLUDED.message,
    updated_at  = now()
  RETURNING * INTO result;

  RETURN result;
END;
$$;

-- Add unique constraint needed for upsert
ALTER TABLE van_locations
  ADD CONSTRAINT van_locations_user_unique UNIQUE (user_id);

-- 8. Helper: find vans within N meters of a point
CREATE OR REPLACE FUNCTION nearby_vans(
  p_lat     DOUBLE PRECISION,
  p_lng     DOUBLE PRECISION,
  p_radius  DOUBLE PRECISION DEFAULT 80467  -- 50 miles in meters
)
RETURNS SETOF van_locations
LANGUAGE sql STABLE
AS $$
  SELECT *
  FROM van_locations
  WHERE visibility = 'public'
    AND (expires_at IS NULL OR expires_at > now())
    AND ST_DWithin(
      geom,
      ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography,
      p_radius
    )
  ORDER BY geom <-> ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography;
$$;

-- 9. Cleanup: auto-delete expired locations (run via pg_cron or scheduled Edge Function)
CREATE OR REPLACE FUNCTION cleanup_expired_van_locations()
RETURNS void
LANGUAGE sql
AS $$
  DELETE FROM van_locations
  WHERE expires_at IS NOT NULL AND expires_at < now();
$$;

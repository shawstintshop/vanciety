-- =============================================================
-- Vanciety Friend Finder Security Hardening
-- =============================================================
-- Purpose:
-- - Remove public-readable van location access.
-- - Default GPS sharing to members-only approximate areas.
-- - Prevent client-supplied public/exact settings from becoming active rows.
-- - Keep Friend Finder useful without exposing exact coordinates.
--
-- Safety:
-- - This file is staged locally only until applied through a controlled Supabase
--   migration workflow.
-- - Does not require secrets.
-- - Does not drop tables or delete user rows.
-- =============================================================

-- 1. Safe defaults for new GPS settings and new van location rows.
ALTER TABLE IF EXISTS gps_sharing_settings
  ALTER COLUMN default_visibility SET DEFAULT 'friends_only',
  ALTER COLUMN default_precision SET DEFAULT 'approximate';

ALTER TABLE IF EXISTS van_locations
  ALTER COLUMN visibility SET DEFAULT 'friends_only',
  ALTER COLUMN precision SET DEFAULT 'approximate';

-- 2. Normalize existing risky rows/settings when this migration is applied.
UPDATE gps_sharing_settings
SET
  default_visibility = 'friends_only'::sharing_visibility,
  default_precision = CASE
    WHEN default_precision = 'exact' THEN 'approximate'::sharing_precision
    ELSE default_precision
  END,
  updated_at = now()
WHERE default_visibility <> 'friends_only'
   OR default_precision = 'exact';

UPDATE van_locations
SET
  visibility = 'friends_only'::sharing_visibility,
  precision = 'approximate'::sharing_precision,
  latitude = (round((latitude * 20)::numeric) / 20.0)::double precision,
  longitude = (round((longitude * 20)::numeric) / 20.0)::double precision,
  geom = ST_SetSRID(
    ST_MakePoint(
      (round((longitude * 20)::numeric) / 20.0)::double precision,
      (round((latitude * 20)::numeric) / 20.0)::double precision
    ),
    4326
  )::geography,
  speed = NULL,
  heading = NULL,
  accuracy = NULL,
  updated_at = now()
WHERE true;

-- 3. Replace public read policy with authenticated member-area read policy.
DROP POLICY IF EXISTS "Public locations readable by anyone" ON van_locations;
DROP POLICY IF EXISTS "Authenticated members can read approximate active van areas" ON van_locations;
DROP POLICY IF EXISTS "Users can insert own locations" ON van_locations;
DROP POLICY IF EXISTS "Users can update own locations" ON van_locations;

CREATE POLICY "Authenticated members can read approximate active van areas"
  ON van_locations FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND precision = 'approximate'
    AND visibility = 'friends_only'
    AND (expires_at IS NULL OR expires_at > now())
  );

-- No direct client INSERT/UPDATE policy is recreated here.
-- Active location writes must go through upsert_van_location(), which verifies
-- auth.uid(), forces members-only visibility, rounds coordinates, and strips
-- motion/accuracy fields before storing.

-- Direct INSERT/UPDATE policies are intentionally not recreated.
-- The legacy owner DELETE policy remains so members can stop sharing/remove their row.
-- Client UI must still render area-level coordinates only.

-- 4. Harden location upsert so client input cannot force public/exact sharing.
CREATE OR REPLACE FUNCTION upsert_van_location(
  p_user_id     UUID,
  p_lat         DOUBLE PRECISION,
  p_lng         DOUBLE PRECISION,
  p_speed       DOUBLE PRECISION DEFAULT NULL,
  p_heading     DOUBLE PRECISION DEFAULT NULL,
  p_accuracy    DOUBLE PRECISION DEFAULT NULL,
  p_visibility  sharing_visibility DEFAULT 'friends_only',
  p_precision   sharing_precision  DEFAULT 'approximate',
  p_expires_at  TIMESTAMPTZ DEFAULT NULL,
  p_status      TEXT DEFAULT 'traveling',
  p_message     TEXT DEFAULT NULL
)
RETURNS van_locations
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result van_locations;
  safe_visibility sharing_visibility := 'friends_only'::sharing_visibility;
  safe_precision sharing_precision := 'approximate'::sharing_precision;
  area_lat DOUBLE PRECISION := (round((p_lat * 20)::numeric) / 20.0)::double precision;
  area_lng DOUBLE PRECISION := (round((p_lng * 20)::numeric) / 20.0)::double precision;
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'not authorized to update this van location';
  END IF;

  INSERT INTO van_locations (
    user_id, geom, latitude, longitude,
    speed, heading, accuracy,
    visibility, precision, expires_at,
    status, message, updated_at
  ) VALUES (
    p_user_id,
    ST_SetSRID(ST_MakePoint(area_lng, area_lat), 4326)::geography,
    area_lat, area_lng,
    NULL, NULL, NULL,
    safe_visibility, safe_precision, p_expires_at,
    p_status, p_message, now()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    geom        = ST_SetSRID(ST_MakePoint(area_lng, area_lat), 4326)::geography,
    latitude    = area_lat,
    longitude   = area_lng,
    speed       = NULL,
    heading     = NULL,
    accuracy    = NULL,
    visibility  = safe_visibility,
    precision   = safe_precision,
    expires_at  = EXCLUDED.expires_at,
    status      = EXCLUDED.status,
    message     = EXCLUDED.message,
    updated_at  = now()
  RETURNING * INTO result;

  RETURN result;
END;
$$;

-- 5. Authenticated approximate nearby lookup for Friend Finder.
CREATE OR REPLACE FUNCTION nearby_member_van_areas(
  p_lat     DOUBLE PRECISION,
  p_lng     DOUBLE PRECISION,
  p_radius  DOUBLE PRECISION DEFAULT 80467
)
RETURNS SETOF van_locations
LANGUAGE sql
STABLE
SECURITY INVOKER
AS $$
  SELECT *
  FROM van_locations
  WHERE auth.uid() IS NOT NULL
    AND visibility = 'friends_only'
    AND precision = 'approximate'
    AND (expires_at IS NULL OR expires_at > now())
    AND ST_DWithin(
      geom,
      ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography,
      p_radius
    )
  ORDER BY geom <-> ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography;
$$;

-- Backward-compatible function name, now secured to the same member-area rules.
CREATE OR REPLACE FUNCTION nearby_vans(
  p_lat     DOUBLE PRECISION,
  p_lng     DOUBLE PRECISION,
  p_radius  DOUBLE PRECISION DEFAULT 80467
)
RETURNS SETOF van_locations
LANGUAGE sql
STABLE
SECURITY INVOKER
AS $$
  SELECT *
  FROM nearby_member_van_areas(p_lat, p_lng, p_radius);
$$;

REVOKE EXECUTE ON FUNCTION upsert_van_location(UUID, DOUBLE PRECISION, DOUBLE PRECISION, DOUBLE PRECISION, DOUBLE PRECISION, DOUBLE PRECISION, sharing_visibility, sharing_precision, TIMESTAMPTZ, TEXT, TEXT) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION nearby_member_van_areas(DOUBLE PRECISION, DOUBLE PRECISION, DOUBLE PRECISION) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION nearby_vans(DOUBLE PRECISION, DOUBLE PRECISION, DOUBLE PRECISION) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION upsert_van_location(UUID, DOUBLE PRECISION, DOUBLE PRECISION, DOUBLE PRECISION, DOUBLE PRECISION, DOUBLE PRECISION, sharing_visibility, sharing_precision, TIMESTAMPTZ, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION nearby_member_van_areas(DOUBLE PRECISION, DOUBLE PRECISION, DOUBLE PRECISION) TO authenticated;
GRANT EXECUTE ON FUNCTION nearby_vans(DOUBLE PRECISION, DOUBLE PRECISION, DOUBLE PRECISION) TO authenticated;

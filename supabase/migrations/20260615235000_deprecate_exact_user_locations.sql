-- =============================================================
-- Vanciety Legacy user_locations Privacy Hardening
-- =============================================================
-- Purpose:
-- - Deprecate the legacy exact-coordinate user_locations sharing path.
-- - Remove public-readable exact member locations.
-- - Prevent client direct writes to user_locations going forward.
-- - Preserve existing rows without deleting data, but make them private/offline.
--
-- Active Friend Finder location writes should use:
-- - upsert_van_location(...)
-- - nearby_member_van_areas(...)
-- from 20260615232500_secure_friend_finder_member_areas.sql
-- =============================================================

-- 1. Normalize existing legacy rows without deleting them.
UPDATE public.user_locations
SET
  latitude = (round((latitude * 20)::numeric) / 20.0)::double precision,
  longitude = (round((longitude * 20)::numeric) / 20.0)::double precision,
  is_public = false,
  status = 'offline',
  updated_at = now()
WHERE true;

-- 2. Remove exact/public legacy policies.
DROP POLICY IF EXISTS "Users can view public locations" ON public.user_locations;
DROP POLICY IF EXISTS "Users can manage their own location" ON public.user_locations;
DROP POLICY IF EXISTS "Users can read own deprecated user location" ON public.user_locations;
DROP POLICY IF EXISTS "Users can delete own deprecated user location" ON public.user_locations;

-- 3. Keep owner read/delete only for cleanup or account removal support.
-- No INSERT or UPDATE policy is recreated. Direct client writes to this exact-coordinate
-- legacy table are intentionally disabled.
CREATE POLICY "Users can read own deprecated user location"
  ON public.user_locations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own deprecated user location"
  ON public.user_locations FOR DELETE
  USING (auth.uid() = user_id);

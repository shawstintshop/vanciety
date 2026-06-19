-- =============================================================
-- Vanciety YouTube Public Content RLS Hardening
-- =============================================================
-- Purpose:
-- - Keep youtube_videos publicly readable as marketing/source content.
-- - Remove direct client-side write/manage access for all authenticated users.
-- - Require server-side ingestion path/service role for video updates.
--
-- Safety:
-- - Does not delete video rows.
-- - Does not change public SELECT behavior.
-- =============================================================

DROP POLICY IF EXISTS "Only authenticated users can manage videos" ON public.youtube_videos;

-- No INSERT/UPDATE/DELETE policy is recreated here.
-- The fetch-youtube-videos Edge Function may update rows with the service role
-- after function auth/rate limiting is deployed and verified.

-- ============================================================
-- pg_cron setup for daily content feed refresh
-- Run AFTER deploying the fetch-vanlife-content Edge Function
-- ============================================================

-- Enable pg_cron extension (may already be enabled)
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Schedule daily fetch at 6am UTC
-- Replace <PROJECT_REF> with your Supabase project ref (e.g. vfrxntxjigtgutevijmb)
-- Replace <ANON_KEY> with your Supabase anon key
SELECT cron.schedule(
  'fetch-vanlife-content-daily',
  '0 6 * * *',
  $$
  SELECT net.http_post(
    url := 'https://vfrxntxjigtgutevijmb.supabase.co/functions/v1/fetch-vanlife-content',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb,
    body := '{}'::jsonb
  )
  $$
);

-- To run immediately (first-time population):
-- SELECT net.http_post(
--   url := 'https://vfrxntxjigtgutevijmb.supabase.co/functions/v1/fetch-vanlife-content',
--   headers := '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb,
--   body := '{}'::jsonb
-- );

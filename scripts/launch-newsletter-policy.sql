-- Minimal launch fix: allow anonymous newsletter signups
-- The live `newsletter_subscribers` table exists but has RLS enabled with no
-- permissive INSERT policy, so the public signup form returns 42501.
-- This adds ONLY the anonymous-insert policy. No schema/table changes.
-- Safe to re-run (idempotent via DROP POLICY IF EXISTS).
-- Apply in Supabase Dashboard → SQL Editor, or via psql/CLI with the DB password.

alter table public.newsletter_subscribers enable row level security;

drop policy if exists "Anyone can subscribe to newsletter" on public.newsletter_subscribers;
create policy "Anyone can subscribe to newsletter"
  on public.newsletter_subscribers
  for insert
  with check (true);

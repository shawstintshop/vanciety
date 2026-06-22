-- ============================================================
-- Member Waves — lightweight "hey" notification system
-- Supports the Roadside Wave, Driveway Host, and Area Guide
-- connection modes on the Find Members page.
--
-- Privacy rules:
--   - Only authenticated members can insert/select their own waves
--   - from_user_id and to_user_id must be valid auth.users
--   - No exact location data is stored here — only the message
-- ============================================================

create table if not exists public.member_waves (
  id            uuid primary key default gen_random_uuid(),
  from_user_id  uuid not null references auth.users(id) on delete cascade,
  to_user_id    uuid not null references auth.users(id) on delete cascade,
  message       text not null check (char_length(message) <= 200),
  is_read       boolean not null default false,
  created_at    timestamptz not null default now()
);

-- Index for inbox queries (to_user_id + unread)
create index if not exists member_waves_to_user_idx
  on public.member_waves (to_user_id, is_read, created_at desc);

-- Index for sent waves (from_user_id)
create index if not exists member_waves_from_user_idx
  on public.member_waves (from_user_id, created_at desc);

-- RLS
alter table public.member_waves enable row level security;

-- Members can send waves (insert their own from_user_id)
create policy "members can send waves"
  on public.member_waves for insert
  with check (auth.uid() = from_user_id);

-- Members can read waves sent to them
create policy "members can read their inbox"
  on public.member_waves for select
  using (auth.uid() = to_user_id or auth.uid() = from_user_id);

-- Members can mark their received waves as read
create policy "members can mark waves read"
  on public.member_waves for update
  using (auth.uid() = to_user_id)
  with check (auth.uid() = to_user_id);

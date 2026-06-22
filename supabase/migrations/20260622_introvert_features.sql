-- ============================================================
-- Introvert Features Migration — Vanciety
-- Run in Supabase SQL Editor
-- Tables: quiet_zones, trip_journals, campfire_posts,
--         campfire_reactions, resource_spots, icebreaker_answers
-- Profile columns: availability_signal, dnd_until, travel_style,
--                  contact_pref, read_receipts_enabled
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. Extend profiles table with introvert-friendly fields
-- ─────────────────────────────────────────────────────────────
alter table public.profiles
  add column if not exists availability_signal text
    check (availability_signal in ('open', 'resting', 'on_the_road', null))
    default null,
  add column if not exists dnd_until timestamptz default null,
  add column if not exists travel_style text
    check (travel_style in ('solo', 'social', 'flexible', null))
    default null,
  add column if not exists contact_pref text
    check (contact_pref in ('wave_only', 'message_only', 'no_contact', 'open', null))
    default null,
  add column if not exists read_receipts_enabled boolean not null default false;

-- ─────────────────────────────────────────────────────────────
-- 2. quiet_zones — crowd-sourced quiet parking areas
-- ─────────────────────────────────────────────────────────────
create table if not exists public.quiet_zones (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  label        text not null check (char_length(label) <= 80),
  description  text check (char_length(description) <= 300),
  lat          double precision not null,
  lng          double precision not null,
  -- snapped to ~3km grid for privacy
  area_lat     double precision not null,
  area_lng     double precision not null,
  upvotes      integer not null default 0,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now()
);

create index if not exists quiet_zones_area_idx
  on public.quiet_zones (area_lat, area_lng, is_active);

alter table public.quiet_zones enable row level security;

create policy "anyone can read active quiet zones"
  on public.quiet_zones for select
  using (is_active = true);

create policy "members can add quiet zones"
  on public.quiet_zones for insert
  with check (auth.uid() = user_id);

create policy "owners can update their quiet zones"
  on public.quiet_zones for update
  using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- 3. trip_journals — async travel logs
-- ─────────────────────────────────────────────────────────────
create table if not exists public.trip_journals (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  title           text not null check (char_length(title) <= 120),
  body            text not null check (char_length(body) <= 5000),
  location_label  text check (char_length(location_label) <= 100),
  -- no exact coords stored — label only
  cover_emoji     text check (char_length(cover_emoji) <= 8) default '🚐',
  reactions_enabled boolean not null default true,
  comments_enabled  boolean not null default false,
  is_published    boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists trip_journals_user_idx
  on public.trip_journals (user_id, created_at desc);
create index if not exists trip_journals_published_idx
  on public.trip_journals (is_published, created_at desc);

alter table public.trip_journals enable row level security;

create policy "published journals are public"
  on public.trip_journals for select
  using (is_published = true);

create policy "owners can read all their journals"
  on public.trip_journals for select
  using (auth.uid() = user_id);

create policy "members can create journals"
  on public.trip_journals for insert
  with check (auth.uid() = user_id);

create policy "owners can update journals"
  on public.trip_journals for update
  using (auth.uid() = user_id);

create policy "owners can delete journals"
  on public.trip_journals for delete
  using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- 4. journal_reactions — single emoji reaction per user per journal
-- ─────────────────────────────────────────────────────────────
create table if not exists public.journal_reactions (
  id          uuid primary key default gen_random_uuid(),
  journal_id  uuid not null references public.trip_journals(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  emoji       text not null check (char_length(emoji) <= 8),
  created_at  timestamptz not null default now(),
  unique (journal_id, user_id)
);

alter table public.journal_reactions enable row level security;

create policy "anyone can read reactions"
  on public.journal_reactions for select using (true);

create policy "members can react"
  on public.journal_reactions for insert
  with check (auth.uid() = user_id);

create policy "members can change their reaction"
  on public.journal_reactions for update
  using (auth.uid() = user_id);

create policy "members can remove their reaction"
  on public.journal_reactions for delete
  using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- 5. campfire_posts — async community boards (Campfire)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.campfire_posts (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  board        text not null check (board in (
    'solo_tips', 'stealth_camping', 'gear_reviews',
    'van_builds', 'routes', 'mental_health', 'newbie', 'general'
  )),
  title        text not null check (char_length(title) <= 120),
  body         text not null check (char_length(body) <= 3000),
  is_pinned    boolean not null default false,
  reply_count  integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists campfire_posts_board_idx
  on public.campfire_posts (board, created_at desc);

alter table public.campfire_posts enable row level security;

create policy "anyone can read campfire posts"
  on public.campfire_posts for select using (true);

create policy "members can post to campfire"
  on public.campfire_posts for insert
  with check (auth.uid() = user_id);

create policy "owners can update their posts"
  on public.campfire_posts for update
  using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- 6. campfire_replies — threaded replies on campfire posts
-- ─────────────────────────────────────────────────────────────
create table if not exists public.campfire_replies (
  id        uuid primary key default gen_random_uuid(),
  post_id   uuid not null references public.campfire_posts(id) on delete cascade,
  user_id   uuid not null references auth.users(id) on delete cascade,
  body      text not null check (char_length(body) <= 1000),
  created_at timestamptz not null default now()
);

create index if not exists campfire_replies_post_idx
  on public.campfire_replies (post_id, created_at asc);

alter table public.campfire_replies enable row level security;

create policy "anyone can read replies"
  on public.campfire_replies for select using (true);

create policy "members can reply"
  on public.campfire_replies for insert
  with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- 7. resource_spots — utility resource sharing board
-- ─────────────────────────────────────────────────────────────
create table if not exists public.resource_spots (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  category     text not null check (category in (
    'water', 'dump_station', 'overnight_parking',
    'mechanic', 'propane', 'laundry', 'wifi', 'other'
  )),
  label        text not null check (char_length(label) <= 100),
  description  text check (char_length(description) <= 400),
  city         text not null check (char_length(city) <= 80),
  state_region text check (char_length(state_region) <= 80),
  country      text not null default 'US' check (char_length(country) <= 4),
  is_free      boolean not null default true,
  upvotes      integer not null default 0,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now()
);

create index if not exists resource_spots_category_idx
  on public.resource_spots (category, is_active, upvotes desc);
create index if not exists resource_spots_city_idx
  on public.resource_spots (city, is_active);

alter table public.resource_spots enable row level security;

create policy "anyone can read active resource spots"
  on public.resource_spots for select
  using (is_active = true);

create policy "members can add resource spots"
  on public.resource_spots for insert
  with check (auth.uid() = user_id);

create policy "owners can update their spots"
  on public.resource_spots for update
  using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- 8. icebreaker_answers — weekly one-question matching
-- ─────────────────────────────────────────────────────────────
create table if not exists public.icebreaker_answers (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  week_key    text not null check (char_length(week_key) <= 10), -- e.g. '2026-W25'
  question    text not null check (char_length(question) <= 200),
  answer      text not null check (char_length(answer) <= 300),
  is_opted_in boolean not null default true,
  created_at  timestamptz not null default now(),
  unique (user_id, week_key)
);

create index if not exists icebreaker_week_idx
  on public.icebreaker_answers (week_key, is_opted_in);

alter table public.icebreaker_answers enable row level security;

create policy "opted-in answers visible to members"
  on public.icebreaker_answers for select
  using (is_opted_in = true and auth.uid() is not null);

create policy "members can submit answers"
  on public.icebreaker_answers for insert
  with check (auth.uid() = user_id);

create policy "members can update their answer"
  on public.icebreaker_answers for update
  using (auth.uid() = user_id);

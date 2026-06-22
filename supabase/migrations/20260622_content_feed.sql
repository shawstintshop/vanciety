-- ============================================================
-- Content Feed Migration — Vanciety
-- Stores auto-fetched vanlife content: YouTube, news, products,
-- how-tos, stealth spots, overland content
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. content_feed — stores all fetched content items
-- ─────────────────────────────────────────────────────────────
create table if not exists public.content_feed (
  id            uuid primary key default gen_random_uuid(),
  source_id     text not null,  -- unique ID from source (YouTube video ID, article URL hash)
  category      text not null check (category in (
    'youtube', 'news', 'products', 'how_to', 'stealth', 'overland', 'builds', 'camping'
  )),
  title         text not null check (char_length(title) <= 300),
  description   text check (char_length(description) <= 1000),
  url           text not null,
  thumbnail_url text,
  author        text check (char_length(author) <= 120),
  source_name   text check (char_length(source_name) <= 80),
  published_at  timestamptz,
  fetched_at    timestamptz not null default now(),
  is_active     boolean not null default true,
  unique (source_id, category)
);

create index if not exists content_feed_category_idx
  on public.content_feed (category, published_at desc, is_active);
create index if not exists content_feed_published_idx
  on public.content_feed (published_at desc, is_active);
create index if not exists content_feed_fetched_idx
  on public.content_feed (fetched_at desc);

alter table public.content_feed enable row level security;

-- Anyone can read active feed items (public content)
create policy "anyone can read active feed items"
  on public.content_feed for select
  using (is_active = true);

-- Only service role can insert/update (Edge Function uses service role)
create policy "service role can manage feed"
  on public.content_feed for all
  using (auth.role() = 'service_role');

-- ─────────────────────────────────────────────────────────────
-- 2. Extend profiles with feed preferences
-- ─────────────────────────────────────────────────────────────
alter table public.profiles
  add column if not exists feed_categories text[] not null default
    array['youtube', 'news', 'products', 'how_to', 'stealth', 'overland', 'builds', 'camping'];

-- ─────────────────────────────────────────────────────────────
-- 3. feed_fetch_log — track when fetches ran and their status
-- ─────────────────────────────────────────────────────────────
create table if not exists public.feed_fetch_log (
  id           uuid primary key default gen_random_uuid(),
  ran_at       timestamptz not null default now(),
  items_added  integer not null default 0,
  items_total  integer not null default 0,
  status       text not null check (status in ('success', 'partial', 'error')),
  error_msg    text
);

alter table public.feed_fetch_log enable row level security;

create policy "anyone can read fetch log"
  on public.feed_fetch_log for select using (true);

create policy "service role can write fetch log"
  on public.feed_fetch_log for all
  using (auth.role() = 'service_role');

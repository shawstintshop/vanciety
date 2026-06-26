-- ============================================================
-- manufacturer_reviews — user reviews keyed by manufacturer slug
-- RLS: anyone reads; auth users insert their own; owner updates/deletes
-- ============================================================
create table if not exists public.manufacturer_reviews (
  id                 uuid primary key default gen_random_uuid(),
  manufacturer_slug  text not null,
  user_id            uuid not null references auth.users(id) on delete cascade,
  rating             int  not null check (rating between 1 and 5),
  body               text not null check (char_length(body) <= 2000),
  author_name        text,
  created_at         timestamptz not null default now()
);

create index if not exists manufacturer_reviews_slug_idx
  on public.manufacturer_reviews (manufacturer_slug, created_at desc);

alter table public.manufacturer_reviews enable row level security;

create policy "anyone can read manufacturer reviews"
  on public.manufacturer_reviews for select using (true);

create policy "authenticated users can insert their review"
  on public.manufacturer_reviews for insert
  with check (auth.uid() = user_id);

create policy "owners can update their review"
  on public.manufacturer_reviews for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "owners can delete their review"
  on public.manufacturer_reviews for delete
  using (auth.uid() = user_id);

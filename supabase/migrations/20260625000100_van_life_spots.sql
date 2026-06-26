-- ============================================================
-- van_life_spots — community-submitted map spots
-- RLS: anyone reads; authenticated users insert their own; owner deletes
-- ============================================================
create table if not exists public.van_life_spots (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  lat         double precision not null,
  lng         double precision not null,
  type        text not null default 'other',
  description text,
  added_by    uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now()
);

create index if not exists van_life_spots_created_idx on public.van_life_spots (created_at desc);

alter table public.van_life_spots enable row level security;

create policy "anyone can read van life spots"
  on public.van_life_spots for select using (true);

create policy "authenticated users can insert spots"
  on public.van_life_spots for insert
  with check (auth.uid() = added_by);

create policy "owners can delete their spots"
  on public.van_life_spots for delete
  using (auth.uid() = added_by);

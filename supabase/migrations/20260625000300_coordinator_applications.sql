-- ============================================================
-- coordinator_applications — event coordinator applications
-- RLS: anyone (incl. anon) may submit; reads restricted to service role/admins
-- ============================================================
create table if not exists public.coordinator_applications (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  email             text not null,
  region            text,
  experience        text,
  social_links      text,
  organization_type text,
  status            text not null default 'pending',
  created_at        timestamptz not null default now()
);

create index if not exists coordinator_applications_status_idx
  on public.coordinator_applications (status, created_at desc);

alter table public.coordinator_applications enable row level security;

-- Public submission allowed (form is open to non-members)
create policy "anyone can submit a coordinator application"
  on public.coordinator_applications for insert
  with check (true);

-- No public SELECT policy → only service role (admin/edge functions) can read.

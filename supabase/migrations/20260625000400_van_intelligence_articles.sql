-- ============================================================
-- van_intelligence_articles — repair/research knowledge base
-- Backs the Van Intelligence hub. Public read; writes via service role only.
-- ============================================================
create table if not exists public.van_intelligence_articles (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  category   text not null,
  body       text not null,
  tags       text[] not null default '{}',
  source_url text,
  created_at timestamptz not null default now()
);

create index if not exists van_intelligence_articles_category_idx
  on public.van_intelligence_articles (category, created_at desc);

alter table public.van_intelligence_articles enable row level security;

-- Public read access — knowledge base is open to everyone
create policy "anyone can read van intelligence articles"
  on public.van_intelligence_articles for select using (true);

-- No public INSERT/UPDATE/DELETE policy → only the service role (admin/edge
-- functions / seed scripts) can write. Content stays curated and verified.

-- ── Seed: verified, real repair-research articles ──────────────────────────
insert into public.van_intelligence_articles (title, category, body, tags, source_url)
values
  (
    'Sprinter OM642 V6 Diesel EGR Cleaning',
    'engine',
    'Symptoms that point to EGR flow or soot buildup: rough idle, hesitation, reduced power or limp mode, an EGR fault code, buck/judder under acceleration, or a fault that returns after clearing codes. Workflow: scan and confirm codes; open the factory parts/service reference for your exact engine; watch one real teardown before touching the van; remove the EGR assembly and inspect for heavy carbon, sticky movement, cracked seals, or coolant/electrical issues; clean only the passages meant to be cleaned (never soak the electronics); reinstall with a new gasket, clear codes, and road test. If the fault returns, stop cleaning and move to deeper diagnosis or replacement.',
    array['egr','om642','diesel','cleaning','limp-mode'],
    'https://static.nhtsa.gov/odi/tsbs/2025/MC-11016423-0001.pdf'
  ),
  (
    'Verify Parts Before You Buy: Mercedes Sprinter EGR Path',
    'parts',
    'Always confirm your exact engine and model year before ordering EGR hardware. Use the manufacturer parts lookup to confirm the correct valve, gasket, and related emission components for the Sprinter 2500 V6 diesel path, then cross-check against your VIN. Manufacturer diagrams prevent ordering the wrong revision of a part that looks identical.',
    array['parts','egr','sprinter','vin','emissions'],
    'https://mbparts.mbusa.com/v-2019-mercedes-benz-sprinter-2500--base--3-0l-v6-diesel/emission-system--egr-system'
  ),
  (
    'Diagnose First, Replace Second: A Facts-First Repair Method',
    'diagnosis',
    'Use facts first: factory references, manufacturer diagrams, real teardown videos, and forum evidence from owners with the same engine. Decide whether to clean, replace, or diagnose deeper only after the symptom is matched to a known cause. If a fault is electrical or returns after cleaning, replace or diagnose deeper instead of repeating the same cleaning.',
    array['diagnosis','method','troubleshooting'],
    'https://mbworld.org/forums/diesel-forum/690387-om642-egr-intake-cleaning.html'
  );

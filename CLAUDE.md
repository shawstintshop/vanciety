# CLAUDE.md — SprinterSociety-NEW

## Project Overview

SprinterSociety is a **van life community platform** (SPA) for Sprinter van owners and enthusiasts. It provides video content, interactive maps, forums, a marketplace, news/events, and a vendor directory. The goal is to be the top Sprinter van community website/app.

**Repository**: `shawstintshop/vanciety`

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 18 + TypeScript 5.8 |
| **Build Tool** | Vite 5.4 (SWC compiler) |
| **Routing** | React Router v6 (client-side) |
| **Styling** | Tailwind CSS 3.4 + shadcn/ui + Radix UI |
| **Backend** | Supabase (PostgreSQL, Auth, Realtime, Edge Functions) |
| **Server State** | TanStack React Query 5 |
| **Forms** | React Hook Form + Zod validation |
| **Maps** | Google Maps JS API |
| **Icons** | Lucide React |
| **Notifications** | Sonner toast library |
| **Charts** | Recharts |

---

## Commands

```bash
npm run dev        # Start dev server on port 8080
npm run build      # Production build
npm run build:dev  # Development build
npm run lint       # ESLint check
npm run preview    # Preview production build locally
```

No test runner is configured. No CI/CD pipelines exist.

---

## Project Structure

```
/
├── src/
│   ├── App.tsx                    # Root component — all routes defined here
│   ├── main.tsx                   # React entry point
│   ├── index.css                  # Global styles, CSS variables, theme colors
│   ├── components/
│   │   ├── Header.tsx             # Site navigation header
│   │   ├── Hero.tsx               # Landing page hero section
│   │   ├── VideoCarousel.tsx      # YouTube video carousel
│   │   ├── VideoEmbedSection.tsx  # Video embedding component
│   │   ├── MapPreview.tsx         # Map preview on landing page
│   │   ├── FallbackMap.tsx        # Static fallback when Maps API unavailable
│   │   ├── PremiumSection.tsx     # Premium features CTA
│   │   ├── GPSSettings.tsx        # GPS tracking settings panel with privacy controls
│   │   ├── LiveLocationTracker.tsx # Headless geolocation watcher component
│   │   └── ui/                    # 50+ shadcn/ui components (auto-generated)
│   ├── pages/
│   │   ├── Index.tsx              # Home / landing page
│   │   ├── Auth.tsx               # Sign in / Sign up
│   │   ├── Videos.tsx             # YouTube video directory
│   │   ├── Map.tsx                # Interactive map with locations
│   │   ├── Forum.tsx              # Community discussion board
│   │   ├── Marketplace.tsx        # Buy/sell marketplace
│   │   ├── News.tsx               # Events and news
│   │   ├── Vendors.tsx            # Service provider directory
│   │   ├── GPSTracking.tsx        # GPS tracking settings page
│   │   └── NotFound.tsx           # 404 page
│   ├── hooks/
│   │   ├── useAuth.tsx            # Auth context hook re-export
│   │   ├── useGoogleMaps.tsx      # Google Maps initialization
│   │   ├── useRealtimePresence.tsx # Real-time member location tracking
│   │   ├── useVanLocation.tsx     # Van GPS tracking state & geolocation watcher
│   │   ├── useRealtimeVanLocations.tsx # Subscribe to live van location updates
│   │   ├── useYouTubeSync.tsx     # Auto-sync YouTube videos (24h interval)
│   │   ├── use-mobile.tsx         # Mobile breakpoint detection
│   │   └── use-toast.ts           # Toast notification hook
│   ├── contexts/
│   │   └── AuthContext.tsx        # Global auth state (user, session, signIn/Up/Out)
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts          # Supabase client singleton (DO NOT edit manually)
│   │       └── types.ts           # Auto-generated database types (DO NOT edit manually)
│   ├── lib/
│   │   ├── googleMaps.ts          # Maps config, custom map styles
│   │   └── utils.ts               # cn() utility (clsx + tailwind-merge)
│   ├── types/
│   │   └── google-maps.d.ts       # Google Maps type augmentations
│   └── assets/                    # Static images/media
├── supabase/
│   ├── config.toml                # Supabase project config (project ID)
│   ├── functions/
│   │   └── fetch-youtube-videos/  # Deno edge function — YouTube API integration
│   └── migrations/                # 15 SQL migration files (schema + RLS policies)
├── public/                        # Static assets served at root
├── index.html                     # HTML entry point
├── vite.config.ts                 # Vite config (path alias @/ → src/)
├── tailwind.config.ts             # Tailwind config (custom theme, shadcn/ui)
├── tsconfig.json                  # TS config (path alias @/ → src/)
├── eslint.config.js               # ESLint flat config (typescript-eslint)
├── postcss.config.js              # PostCSS (tailwind + autoprefixer)
└── .component.json                # shadcn/ui component configuration
```

---

## Architecture

### App Initialization (src/App.tsx)

Provider hierarchy (outermost to innermost):
1. `QueryClientProvider` — React Query cache
2. `AuthProvider` — Supabase auth state
3. `TooltipProvider` — Radix tooltip context
4. `Toaster` + `Sonner` — Notification systems
5. `BrowserRouter` + `Routes` — Client-side routing

### Routes

| Path | Page | Auth Required |
|------|------|--------------|
| `/` | Index (landing) | No |
| `/videos` | YouTube video directory | No |
| `/map` | Interactive Google Map | Partial (write ops) |
| `/forum` | Community forum | Partial (posting) |
| `/marketplace` | Buy/sell listings | Partial (posting) |
| `/news` | Events/news feed | No |
| `/vendors` | Vendor directory | No |
| `/auth` | Sign in / Sign up | No |
| `/gps` | GPS tracking settings | Yes |
| `*` | 404 Not Found | No |

### State Management

- **Server state**: React Query for all Supabase data fetching and caching
- **Auth state**: React Context (`AuthContext`) wrapping Supabase auth listeners
- **Local state**: React `useState`/`useEffect` for component-level state
- **Real-time**: Supabase Realtime channels for presence and database changes

### Data Flow

1. Components call Supabase client directly or via React Query hooks
2. Supabase handles auth, database CRUD, and real-time subscriptions
3. Edge functions handle server-side operations (YouTube API sync)
4. Toast notifications (Sonner) provide user feedback

---

## Database Schema (Supabase/PostgreSQL)

### Core Tables

**profiles** — User profiles (auto-created on signup)
- `id` (UUID, FK to auth.users), `display_name` (text)

**locations** — Map pins for campsites, businesses, meetups
- `id`, `name`, `description`, `latitude`, `longitude`
- `type` (campsite | driveway | meetup | business | event | poi)
- `amenities` (text[]), `rating` (numeric), `images` (text[])
- `contact_info` (JSONB), `verified` (boolean), `user_id` (FK)
- RLS: public read, authenticated create/update/delete own

**forum_posts** — Community discussion threads
- `id`, `user_id` (FK), `title`, `content`, `category`
- `likes_count`, `replies_count`, `created_at`, `updated_at`

**youtube_videos** — Synced YouTube content
- `youtube_id` (unique), `title`, `description`, `thumbnail_url`
- `channel_title`, `channel_id`, `published_at`, `duration`
- `view_count`, `like_count`, `category`, `tags` (text[])
- Categories: builds, electrical, plumbing, maintenance, camping, tips, offroad, reviews, mods, van-life

**user_locations** — Real-time member presence
- `user_id`, `latitude`, `longitude`, `status`, `message`
- `is_public` (boolean), `last_seen` (timestamp)

**van_locations** — GPS-tracked van positions (PostGIS)
- `id`, `user_id` (FK, unique constraint for upsert)
- `geom` (geography Point 4326 — PostGIS), `latitude`, `longitude`
- `speed`, `heading`, `accuracy` (from Geolocation API)
- `visibility` (public | friends_only | event | private)
- `precision` (exact | approximate — city-level obfuscation)
- `expires_at` (auto-expiry), `status`, `message`
- RLS: public locations readable by anyone; users CRUD own records
- PostGIS functions: `upsert_van_location()`, `nearby_vans(lat, lng, radius)`

**gps_sharing_settings** — Per-user GPS preferences
- `user_id` (unique), `sharing_enabled`, `default_visibility`
- `default_precision`, `default_duration`, `auto_pause_hours`
- `update_interval_sec`

### Row-Level Security (RLS)

All tables use RLS. General pattern:
- **SELECT**: Public (anyone can read)
- **INSERT/UPDATE/DELETE**: Authenticated users, restricted to own records via `auth.uid()`

---

## Supabase Edge Functions

### fetch-youtube-videos (Deno)

- Fetches van life videos from YouTube Data API v3
- Searches 5 query variations (builds, solar, plumbing, camping, tips)
- Auto-categorizes by content keywords
- Deduplicates against existing `youtube_videos` table entries
- Triggered by `useYouTubeSync` hook on a 24-hour interval
- **Required secrets**: `YOUTUBE_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

---

## Styling Conventions

### Theme System

Colors defined as CSS custom properties in `src/index.css` using HSL values:
- **Primary**: Forest green (`150 40% 25%`)
- **Secondary**: Sunset orange (`25 85% 55%`)
- **Accent**: Mountain blue (`210 60% 45%`)

Custom gradients: `gradient-hero`, `gradient-card`, `gradient-sunset`, `gradient-forest`
Custom shadows: `shadow-glow`, `shadow-card`, `shadow-hero`

### Dark Mode

- Tailwind dark mode via `class` strategy
- Toggle with `next-themes`
- Full CSS variable swap in `.dark` selector

### Component Styling

- Use Tailwind utility classes inline
- Use `cn()` from `@/lib/utils` for conditional class merging
- shadcn/ui components use CVA (class-variance-authority) for variants
- All custom colors reference CSS variables, not hardcoded values

---

## Key Conventions for AI Assistants

### File Organization

- **New pages** go in `src/pages/` and must be registered in `src/App.tsx` routes (above the `*` catch-all)
- **Reusable components** go in `src/components/`
- **UI primitives** (shadcn/ui) live in `src/components/ui/` — avoid editing these directly
- **Custom hooks** go in `src/hooks/`
- **Supabase integration files** in `src/integrations/supabase/` are auto-generated — do not edit `client.ts` or `types.ts` manually

### Import Aliases

Use `@/` path alias for all imports from `src/`:
```typescript
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
```

### TypeScript

- `tsconfig.json` has `strictNullChecks: false` and `noImplicitAny: false`
- Use TypeScript for all new files (`.ts` / `.tsx`)
- Database types available from `@/integrations/supabase/types`

### ESLint

- Flat config format (eslint.config.js)
- `@typescript-eslint/no-unused-vars` is disabled
- React hooks linting enabled
- React Refresh export validation enabled

### Authentication Pattern

```typescript
import { useAuth } from "@/contexts/AuthContext";
// or
import { useAuth } from "@/hooks/useAuth";

const { user, session, signIn, signUp, signOut, loading } = useAuth();
```

### Supabase Queries

```typescript
import { supabase } from "@/integrations/supabase/client";

// Fetch data
const { data, error } = await supabase.from("locations").select("*");

// Insert with auth
const { error } = await supabase.from("locations").insert({ ... });

// Real-time subscription
const channel = supabase.channel("my-channel")
  .on("postgres_changes", { event: "*", schema: "public", table: "locations" }, callback)
  .subscribe();
```

### Adding shadcn/ui Components

The project uses shadcn/ui with the `default` style and `slate` base color. Components are in `src/components/ui/`. To conceptually add new ones, follow the shadcn/ui patterns already established in the codebase.

### Environment Variables

- All client-side env vars must use `VITE_` prefix
- Current vars: `VITE_SUPABASE_PROJECT_ID`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_URL`
- Supabase client is initialized in `src/integrations/supabase/client.ts` using environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- Edge function secrets are stored in Supabase dashboard, not in `.env`

---

## Known Gaps / Areas for Improvement

1. **No testing infrastructure** — No test runner, no test files. Consider adding Vitest.
2. **No CI/CD** — No GitHub Actions workflows. Build/lint not automated.
3. **No `.env.example`** — New contributors lack env var documentation.
4. **Limited error boundaries** — No React error boundaries for graceful failure handling.
5. **No SSR/SSG** — Pure client-side SPA; no server-side rendering.
6. **No API rate limiting** — Edge functions lack rate limiting.
7. **TypeScript strictness is low** — `strictNullChecks` and `noImplicitAny` both off.

---

## Development Workflow

1. Install dependencies: `npm install`
2. Set up environment variables in `.env` (see Environment Variables section)
3. Run dev server: `npm run dev` (serves on `http://localhost:8080`)
4. Lint before committing: `npm run lint`
5. Build for production: `npm run build`
6. Database changes: Add SQL migrations in `supabase/migrations/`

---

## Van GPS Tracking (Phase 5)

### Overview

Real-time van location sharing using browser Geolocation API. Users opt-in to share their Sprinter's position, visible on the main map with privacy controls.

### Architecture Flow

```
Browser Geolocation API (watchPosition)
  → useVanLocation hook (throttles updates)
    → Supabase RPC: upsert_van_location()
      → van_locations table (PostGIS Point)
        → Supabase Realtime broadcast
          → useRealtimeVanLocations hook
            → Map markers update in real-time
```

### Key Files

| File | Purpose |
|------|---------|
| `src/hooks/useVanLocation.tsx` | Manages GPS state, geolocation watcher, settings persistence |
| `src/hooks/useRealtimeVanLocations.tsx` | Subscribes to live van_locations changes via Supabase Realtime |
| `src/components/GPSSettings.tsx` | Full settings UI with privacy controls, emergency stop |
| `src/components/LiveLocationTracker.tsx` | Headless component — auto-starts tracking when enabled |
| `src/pages/GPSTracking.tsx` | GPS settings page at `/gps` |
| `src/pages/Map.tsx` | Updated with "Live Vans" filter and real-time van markers |
| `supabase/migrations/20260209000000_add_van_gps_tracking.sql` | PostGIS schema, RLS, functions |

### Privacy Controls

- **Visibility**: public / friends_only / event / private
- **Precision**: exact or approximate (~5km city-level obfuscation)
- **Duration**: until_off / 24h / 1_week / forever
- **Auto-pause**: Configurable hours of inactivity before auto-stop
- **Emergency Stop**: One-tap delete all location data

### PostGIS Setup

PostGIS must be enabled in the Supabase dashboard (Database → Extensions → postgis → Enable) before the migration will work. The migration creates:
- `van_locations` table with `geography(Point, 4326)` column
- `gps_sharing_settings` table
- `upsert_van_location()` function (handles obfuscation)
- `nearby_vans()` function (ST_DWithin proximity search)
- `cleanup_expired_van_locations()` function (for cron cleanup)

### Hardware Tracker Support (Future)

The UI includes a "Hardware GPS Trackers" section with recommended devices (Bouncie, Spytec GL300, LandAirSea 54). Webhook/API integration for hardware trackers is planned for a future phase.

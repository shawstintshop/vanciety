# Vanciety Top Design Engineer Pass — 2026-06-14

## Status

Implemented and verified locally.

Backup before this pass:

`/Users/darrinshaw/Hermes-Backups/Vanciety-before-top-design-engineer-pass-20260614-194325.tar.gz`

Local verified URL:

`http://127.0.0.1:5173/`

## Design direction applied

The attached topo reference was translated into a premium Vanciety system rather than a single repeated wallpaper:

- Dark charcoal base with cream/tan topo contour lines.
- Low-contrast dotted trail lines and route-line geometry.
- Page-specific accent palettes so each route has a different feel while staying cohesive.
- Subtle pointer-responsive global topo glow with reduced-motion support.
- Section-level topo variants so each content block is visually distinct.
- Badge/patch-inspired logo mark with van icon, contour lines, and route dots.

## New / major design system files

- `src/components/VancietyLogo.tsx`
  - New code-based Vanciety logo/brand mark.
  - No external logo dependency.

- `src/components/SiteFooter.tsx`
  - New global footer with visible navigation links, source policy, feedback link, and logo.

- `src/components/VancietyTopoSystem.tsx`
  - Global pointer-aware topo layers.
  - Contour wash, elevation rings, route line, badge grain, and pointer glow.

- `src/index.css`
  - Page theme variables:
    - `vanciety-page--home`
    - `vanciety-page--map`
    - `vanciety-page--friends`
    - `vanciety-page--intel`
    - `vanciety-page--videos`
    - `vanciety-page--news`
    - `vanciety-page--forum`
    - `vanciety-page--marketplace`
    - `vanciety-page--vendors`
    - `vanciety-page--gps`
    - `vanciety-page--cards`
    - `vanciety-page--auth`
    - `vanciety-page--ai`
  - Hero topo treatment.
  - Alternating section topo treatments.
  - Card/panel topo treatment.
  - Link/focus visibility rules.

## Header / footer / visibility

- Header now uses the Vanciety logo mark.
- Header active route states are visible.
- Desktop navigation supports all primary routes.
- Mobile header uses compact logo, sign-in, and menu controls.
- Footer is globally mounted through `src/App.tsx`, so every route has visible footer navigation.
- Footer links cover Explore, Community, and Intelligence areas.

## Per-page visual theme coverage

- Home: hero canyon/topo composition, AI guide, videos, briefing, map preview, beta access.
- Map: blue/green map-grid/topo theme, source map fallback, verified source sidebar.
- Friend Finder: security/community theme with approximate-only privacy copy.
- Van Intelligence: amber/blue research theme with source sections.
- Videos: warmer media/content theme.
- News: event/update theme with verified event cards.
- Forum: community/discussion theme.
- Marketplace: commerce/gear theme.
- Vendors: service/shop theme.
- GPS: privacy/control theme.
- Van Cards: member identity/card theme.
- Auth: focused sign-in theme.
- AI Concierge: purple/amber AI guidance theme.
- NotFound: branded recovery page with logo and route links.

## Function / real-data handling

- No invented live counts or fake member activity were added.
- AI remains page-aware and source-aware.
- AI fallback copy now uses visitor-facing “guide mode” language instead of exposing provider or Edge Function details.
- Map starts with verified source anchors immediately so the page does not show a broken blank map while Supabase/Google Maps are unavailable.
- Google Maps unavailable state now shows the approximate Vanciety map preview and real source/member list.
- Fallback map no longer displays exact latitude/longitude when a marker is selected.
- GPS settings no longer display exact latitude/longitude; the UI says city/area only and exact GPS hidden.
- Friend Finder still states members-only, city/area-only, no exact location.

## Verification

Build:

```bash
npm run build
```

Result: PASS.

Lint:

```bash
npm run lint
```

Result: PASS with 0 errors and 13 existing warnings.

Routes verified HTTP 200:

- `/`
- `/map`
- `/friend-finder`
- `/van-intelligence`
- `/videos`
- `/news`
- `/forum`
- `/marketplace`
- `/vendors`
- `/gps`
- `/van-cards`
- `/auth`
- `/ai`

Screenshot set:

`docs/site-detail-pass/top-design-engineer-20260614/`

Representative screenshots inspected:

- `home-desktop.png`
- `map-desktop-final-2.png`
- `friend-finder-mobile.png`
- `ai-desktop.png`

## Remaining blockers for truly live production behavior

These are not design blockers, but they affect live production claims:

1. Google Maps requires a valid browser Maps key/config for the full interactive map.
2. Supabase production schema still needs the safe approximate-only GPS/member-location migration before public launch.
3. AI Concierge live generated answers require the deployed Supabase Edge Function and server-side provider key.
4. Public domains/DNS still need to point to the deployed Vanciety app.
5. Git branch divergence/pending local changes must be resolved before pushing/deploying.

## Notes

This pass prioritized the product website experience and did not add fake data, fake live activity, fake inventory, or fake event claims.

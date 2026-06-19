# Vanciety Site Detail + Topo Design Pass

Generated: 2026-06-14

## User request

Check each Vanciety page for wording/images and add subtle interactive topo-map designs across the entire site, using the attached Vanciety badge/patch reference as design direction.

## Reference images

- Topo-map reference: `/Users/darrinshaw/.hermes/image_cache/img_686c14279501.jpg`
- Vanciety badge/patch reference: `/Users/darrinshaw/.hermes/image_cache/img_6357059a6c50.jpg`

## Backup

Created before edits:

`/Users/darrinshaw/Hermes-Backups/Vanciety-before-sitewide-topo-wording-pass-20260614-185825.tar.gz`

## Files changed

- `src/App.tsx`
  - Added global `VancietyTopoSystem` overlay.
  - Wrapped routes in `vanciety-content-shell`.

- `src/components/VancietyTopoSystem.tsx`
  - New site-wide subtle interactive topo layer component.
  - Tracks pointer position with CSS variables for low-motion parallax/glow.
  - Respects reduced-motion preference.

- `src/index.css`
  - Added multiple topo design treatments:
    - contour wash
    - elevation rings
    - route-line accents
    - low-opacity badge grain
    - pointer glow
    - hoverable card/panel topo accents
    - badge/patch-inspired linework accent
  - Tuned opacity down after screenshot review so the effect remains subtle.

- `src/components/Hero.tsx`
  - Added badge/patch-inspired linework accent to the home hero.

- `src/components/DailyVanBriefing.tsx`
  - Added topo panel treatment.
  - Replaced visitor-facing implementation wording with public-facing copy.

- `src/pages/Map.tsx`
  - Added topo panel treatment to map header.
  - Changed search placeholder from coordinate-focused wording to city/area/source wording.
  - Changed map hero copy to “view opt-in member areas” instead of tracking live Sprinters.
  - Generalized Live Sprinters labels to Live Van Members / Van member.

- `src/pages/VanCards.tsx`
  - Added topo panel treatment to page header.

- `src/pages/VanIntelligence.tsx`
  - Generalized hero copy from Sprinter/Revel-only to broader van-life travelers/builders/owners.

- `src/pages/Videos.tsx`
  - Generalized hero copy from off-road Sprinter-only to off-road van content.

- `src/data/aiConcierge.ts`
  - Generalized AI helper examples from Sprinter/Revel-only language to broader van language.

- `docs/VANCIETY_VISUAL_DIRECTION.md`
  - Added the latest Vanciety badge/patch reference and implementation rules.

## Page/wording review performed

Reviewed searchable public wording across:

- Home / `Index.tsx` + `Hero.tsx`
- Videos
- News
- Map
- Forum
- Marketplace
- Vendors
- GPS
- Van Cards
- Friend Finder
- Van Intelligence
- AI Concierge
- Shared components: Header, DailyVanBriefing, AIVanConcierge, FireRating

Changes made where visitor copy was too implementation-focused, coordinate-focused, or too Sprinter-only.

Notes:

- Some verified source titles still contain “Sprinter” or “Revel” because those are real public video/source names. Those were left intact.
- Developer comments containing words like “placeholder” or “truth rules” are not visitor-visible and were left alone.

## Visual implementation details

The site now has multiple topo designs, not one repeated background:

1. **Contour wash** — faint map contour lines across pages.
2. **Elevation rings** — large subtle circular map forms.
3. **Route lines** — thin low-opacity travel route diagonals.
4. **Badge grain** — tiny weathered patch texture from the attached badge style.
5. **Pointer glow** — quiet interactive glow following pointer movement.
6. **Panel topo accents** — card/section hover treatments.
7. **Badge linework** — hero accent inspired by circular patch/rope/border composition.

## Verification

Build:

```bash
npm run build
```

Result: PASS

Lint:

```bash
npm run lint
```

Result: PASS with 13 existing warnings / 0 errors.

Known build note:

- Vite reports bundle chunk larger than 500 kB. Existing optimization item; not introduced by this pass.

## Route checks

Last full route pass before screenshots returned HTTP 200 for:

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

## Screenshot verification

Final screenshots:

`docs/site-detail-pass/topo-check-20260614-190621/`

Captured desktop + mobile for:

- home
- map
- friend-finder
- van-intelligence
- videos
- marketplace
- vendors

Visual review summary:

- Home desktop: readable; topo texture visible but toned down after first pass.
- Map mobile: readable; privacy-safe wording; no exact-coordinate search emphasis.
- Friend Finder mobile: member-only/city-area-only privacy message remains clear.
- Videos desktop: general Vanciety/van wording; topo is readable behind cards.

## Remaining design polish ideas

Not required for this pass, but useful next:

1. Create an official vector Vanciety badge/patch mark from the attached reference.
2. Add a dark-mode topo variant for future app/dashboard surfaces.
3. Add page-specific hero images for News, Vendors, Marketplace, and Forum using verified/outdoor/van imagery.
4. Reduce bundle size with route-level lazy loading before public launch.

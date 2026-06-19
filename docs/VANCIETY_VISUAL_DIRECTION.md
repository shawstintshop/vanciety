# VANCIETY VISUAL DIRECTION

## Topographic background motif

Source references from user:

- `/Users/darrinshaw/.hermes/image_cache/img_686c14279501.jpg` — topo-map pattern reference.
- `/Users/darrinshaw/.hermes/image_cache/img_6357059a6c50.jpg` — Vanciety vintage badge/patch reference with van, mountains, campfire, forest, banner, rope border, and weathered texture.

The Vanciety interface should use a **topographic contour-map pattern** as a subtle visual motif.

## Intent

- The topo map design is a **small background detail**, not the entire design.
- It should support the Vanciety identity: van-life, mapping, travel, outdoor navigation, camping, and overland exploration.
- It should feel clean, premium, calm, and useful — not loud or gimmicky.

## Design standard

Vanciety must feel like it was designed by a top-tier professional website designer: incredibly clean, polished, calm, premium, and interactive in subtle ways. The site should not feel like a template, Lovable prototype, generic AI output, or busy outdoors blog. Every motion/detail should serve clarity and confidence.

Reference design quality bars:

- **Linear / Vercel:** precision, spacing, restrained dark-mode polish.
- **Apple / BMW:** premium whitespace, calm hierarchy, professional finish.
- **Stripe / Framer:** tasteful gradients, smooth motion, high-end landing-page craft.
- **Supabase / Raycast:** dark technical surfaces, clean product UI, subtle glow.

## Design requirements

### Badge / patch identity from latest reference

Use the attached Vanciety patch as brand texture inspiration, not as a literal site background:

- circular adventure badge feel, but simplified in the UI
- evergreen linework with cream/sand negative space
- warm bronze/orange accent for sun, route, fire, and CTA energy
- van + mountain + forest + campfire cues where useful
- rope/stitched border language translated into thin card borders, pill outlines, and section dividers
- weathered ink/grain used at very low opacity only
- large confident Vanciety wordmark energy, but keep web typography clean and modern

Implemented web treatments should remain subtle:

- site-wide contour wash
- elevation-ring accents
- route-line accents
- low-opacity badge grain
- pointer-responsive glow/parallax
- card/hero panel topo highlights on hover

- Use unique Vanciety colors, not a plain copied gray topo background.
- Suggested palette directions:
  - Deep evergreen / forest
  - Charcoal / near-black
  - Sand / warm off-white
  - Burnt orange or bronze accent
  - Muted sky/route blue only where useful for map or GPS context
- The topo pattern should appear as:
  - low-opacity background texture
  - card/section detail
  - map page atmosphere
  - dashboard panel accent
  - hover/motion layer
  - loading/transition detail

## Motion / interaction ideas

Use subtle motion only:

- slow drifting contour layer behind hero or dashboard cards
- parallax response on mouse movement or scroll
- route-line pulse on map/camp pages
- contour lines lightly brighten on hover around cards/buttons
- animated gradient mask moving through the topo lines
- GPS/location pulse that feels like a map signal, not a flashy animation

## Guardrails

- Do not let the topo pattern overpower content readability.
- Do not make the whole UI a map graphic.
- Do not use fake location pins or fake live movement.
- Motion must be optional/subtle and should respect reduced-motion preferences.
- Keep the design family-friendly, calm, and simple enough for a non-technical user.

## Best Vanciety placements

1. Home hero background texture.
2. Map / camp spots page header.
3. Van Cards background accent.
4. Vendor and builder directory cards.
5. Dashboard panels.
6. Empty states for maps, GPS, and route planning.
7. Section dividers between content blocks.

## Implementation note for future build phase

When implementation begins, create the topo motif as an SVG/CSS background system rather than a single static image. Prefer CSS variables for theme colors and support dark/light variants. Use low opacity and progressive enhancement for motion.

# Unified Map Plan — one map, three layer toggles

> Design produced by the architecture pass. Branch: `feature/manufacturer-platform`.

## Decision: ONE map at `/map` with multi-select layer toggles (not two maps)
`Map.tsx` already owns the only Leaflet instance, tiles, controls, sidebar, and `EventDetailPanel`. Two maps would duplicate ~530 lines and can't share viewport/zoom. Use one `L.layerGroup()` per layer, add/remove on toggle.

## Three layers
| Layer | Icon | Click | Data |
|---|---|---|---|
| Events (default on) | black Revel van on light chip (existing) | `EventDetailPanel` | `DEMO_EVENTS` + `events` table |
| Live Members (auth only) | glowing green van (`VAN_MARKERS.friend`) | presence card (approx area, last seen, no directions) | `useRealtimeVanLocations(enabled)` |
| Manufacturers | brand pin / logo chip | navigate `/manufacturers/:slug` + log analytics | `MANUFACTURERS` seed (has lat/lng) → later `manufacturer_profiles` |

## Toggle UI
New multi-select row **above** the event-category pills, each with a live count badge. Event-category pills only render when Events layer is on. Live Members toggle disabled w/ tooltip when signed out.

## Anti-churn (key)
- Split the single marker effect into **three independent effects** (one per layer group) so a realtime member update doesn't rebuild event markers.
- `useMemo` the `filteredEvents`; hoist the event `L.icon` to a module constant.
- Gate the realtime hook: `useRealtimeVanLocations(activeLayers.members && !!user)` — no subscription until the layer is on.

## Routing
- `/map` is the superset/canonical.
- Add `/events` → renders `<Map>` with events-only (or redirect `/map?layer=events`).
- Seed `activeLayers` from `?layer=` via `useSearchParams`; brand directory "See on map" → `/map?layer=manufacturers&focus=:slug`.

## Build sequence (small commits)
1. Refactor markers into layer groups (no behavior change) — hoist icon, memoize filteredEvents.
2. Add layer-toggle UI row; gate category pills on events layer.
3. Manufacturers layer from `MANUFACTURERS` seed; click → `/manufacturers/:slug`.
4. (DB later) add lat/lng to `manufacturer_profiles`; swap seed→query.
5. Live members layer via `useRealtimeVanLocations`; signed-out disabled state.
6. Member presence card component.
7. Wire share-location FAB to `useRealtimePresence`.
8. `?layer=` seeding + `/events` route.
9. Polish: layer-aware count badge, mobile overflow, lint+build.

## Notes
- `manufacturer_profiles` migration lacks lat/lng — the seed data (`src/data/manufacturers.ts`) already includes coordinates, so the manufacturers layer can ship before the DB column exists.
- Prefer `useRealtimeVanLocations` (carries `display_name`) for the layer; reserve `useRealtimePresence` for the share-my-location action.

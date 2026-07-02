# Vanciety Production Audit Report - 2026-07-02

## 1. Environment Verification
- **Full Path:** `/Users/darrinshaw/Projects/vanciety-real`
- **Branch:** `main`
- **Remote:** `https://github.com/shawstintshop/vanciety`
- **Confirmation:** This is the primary production repository. All changes will be committed and pushed here.

---

## 2. Technical Audit (Delta from vite_react_shadcn_ts base)

### Critical (Must Fix)
1. **Auth Integration Strategy:** The current `AuthContext` in `src/contexts` uses client-side Supabase. Needs verification of RLS policies for sensitive tables (GPS, AI conversations).
2. **Missing Production Tables:** The Vite repo lacks the `ai_*` tables identified in the temporary audit. These must be added to the Supabase schema properly.
3. **Broken Vana Routing:** `src/lib/vanaRouter.ts` is purely keyword-based (score-based). It needs a true multi-agent classification layer.
4. **Site Header/Branding:** Mixed branding between "Sprinter Society" and "Vanciety". Needs unification.

### High Priority
1. **Realtime GPS bloat:** `LiveLocationTracker.tsx` and `useRealtimeVanLocations.tsx` need auditing for message frequency and DB write efficiency.
2. **Missing Feature Integration:** The new Assistant, Builder, and Admin pages must be merged into the `src/pages` structure.
3. **AI Task System:** No mechanism for agents to log "missing answers" in the current Vite project.

---

## 3. Immediate Implementation Plan (Critical/High)

- **Step 1:** Apply Supabase migrations for AI tables (v2).
- **Step 2:** Refactor `src/lib/vanaRouter.ts` to include multi-agent support (Vana, Builder, Mechanic, etc.).
- **Step 3:** Implement production AI assistant UI in `src/pages/AIConcierge.tsx` (or new `/assistant`).
- **Step 4:** Unified Navigation across all components.

---

## 4. CHANGELOG & TODO
Linked to:
- `CHANGELOG.md`
- `TODO.md`

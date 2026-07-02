# Changelog
All notable changes to the Vanciety platform will be documented in this file.

## [Unreleased] - 2026-07-02

### Added
- **AI Admin Dashboard:** Created `src/pages/AIAdmin.tsx` for monitoring AI tasks and reports.
- **Admin Routing:** Wired `/admin/ai` into `App.tsx` and the primary `Header` dropdown for authorized users.
- **Auth Middleware (Refactored):** Implemented `@supabase/ssr` based middleware for route protection (Vite compatible).
- **AI Schema:** Added comprehensive database schema for multi-agent AI architecture.
- **AI Routing API:** Initial implementation of the assistant routing layer.
- **AI Components:** Added `AIChat` component and specialized Assistant/Admin pages.
- **Navigation:** Updated Navbar with Vanciety branding and new feature links.

### Changed
- **Branding:** Renamed "Sprinter Society" references to "Vanciety" in navigation and Header components.
- **Supabase Client:** Refactored `src/lib/supabase.ts` to use Vite environment variable handling and type safety.

### Fixed
- **Build Errors:** Resolved multiple TypeScript 'never' type errors and missing module declarations.
- **Linting:** Cleaned up unused imports in various components.

# Vanciety — Full-Time Discipline Agent Assignments

Generated: 2026-06-15 23:13:55

Phase 2 assignment only. No large code implementation started.

## Agent ownership matrix

| Agent | SkillOpt discipline | Skill path | Owns | Status |
|---|---|---|---|---|
| Executive Product Agent | `product` | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/product/best_skill.md` | Product requirements; User roles; Feature matrix; User flows; Launch scope; Roadmap | assigned full-time discipline owner; no implementation started in Phase 2 |
| Architecture Agent | `architecture` | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/architecture/best_skill.md` | Architecture; System diagram; Data flow; Tech stack decisions; Repo structure | assigned full-time discipline owner; no implementation started in Phase 2 |
| Frontend Agent | `frontend` | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/frontend/best_skill.md` | Public pages; Auth pages; Dashboards; Components; Forms; Responsive layout | assigned full-time discipline owner; no implementation started in Phase 2 |
| UX/UI Design Agent | `design` | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/design/best_skill.md` | Design system; Mobile flow; Desktop flow; Accessibility; Conversion quality | assigned full-time discipline owner; no implementation started in Phase 2 |
| Backend/API Agent | `backend` | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/backend/best_skill.md` | APIs; Validation; Webhooks; Background jobs; Server-side permissions | assigned full-time discipline owner; no implementation started in Phase 2 |
| Database Agent | `database` | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/database/best_skill.md` | Schema; Migrations; Indexes; RLS; Seed data; Backups | assigned full-time discipline owner; no implementation started in Phase 2 |
| Auth/Security Agent | `security` | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/security/best_skill.md` | Authentication; Authorization; RBAC; Secrets; Headers; Rate limits; OWASP checks; Threat model | assigned full-time discipline owner; no implementation started in Phase 2 |
| AI Integration Agent | `ai` | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/ai/best_skill.md` | AI gateway; Prompts; RAG; Evals; Guardrails; Cost controls; Human handoff | assigned full-time discipline owner; no implementation started in Phase 2 |
| Payments/Memberships Agent | `payments` | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/payments/best_skill.md` | Stripe; Checkout; Subscriptions; Billing portal; Webhooks; Feature gating | assigned full-time discipline owner; no implementation started in Phase 2 |
| Admin Dashboard Agent | `admin` | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/admin/best_skill.md` | Admin dashboard; User management; Business management; Ad approvals; Support review; Audit logs | assigned full-time discipline owner; no implementation started in Phase 2 |
| Mobile/iOS Agent | `mobile-ios` | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/mobile-ios/best_skill.md` | Mobile-first UX; PWA; iOS-safe layout; Touch controls; Future app path | assigned full-time discipline owner; no implementation started in Phase 2 |
| Marketing/SEO Agent | `marketing-seo` | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/marketing-seo/best_skill.md` | SEO; Sitemap; Robots.txt; Schema; Landing pages; Business ad sales copy | assigned full-time discipline owner; no implementation started in Phase 2 |
| Analytics/Growth Agent | `analytics` | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/analytics/best_skill.md` | Event tracking; Funnel tracking; Growth dashboard; Conversion metrics | assigned full-time discipline owner; no implementation started in Phase 2 |
| QA/Test Agent | `qa` | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/qa/best_skill.md` | Unit tests; Integration tests; E2E tests; Accessibility tests; Mobile tests; Launch blockers | assigned full-time discipline owner; no implementation started in Phase 2 |
| DevOps/Deployment Agent | `devops` | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/devops/best_skill.md` | CI/CD; Staging; Production; Monitoring; Rollback; Backups | assigned full-time discipline owner; no implementation started in Phase 2 |
| Customer Support Automation Agent | `support` | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/support/best_skill.md` | Support flows; Ticketing; AI handoff; Knowledge base; Support analytics | assigned full-time discipline owner; no implementation started in Phase 2 |
| Compliance/Privacy Agent | `compliance-privacy` | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/compliance-privacy/best_skill.md` | Terms; Privacy; Cookie policy; Refund policy; Acceptable use; AI disclaimer | assigned full-time discipline owner; no implementation started in Phase 2 |
| Performance/Scaling Agent | `performance` | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/performance/best_skill.md` | Lighthouse; Load testing; Caching; Image optimization; Database performance | assigned full-time discipline owner; no implementation started in Phase 2 |
| Documentation Agent | `documentation` | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/documentation/best_skill.md` | README; Setup docs; Commands; Operations runbook; Known limitations | assigned full-time discipline owner; no implementation started in Phase 2 |
| Launch Manager Agent | `launch-manager` | `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/launch-manager/best_skill.md` | Final go-live report; Launch checklist; Post-launch monitoring; Known blockers | assigned full-time discipline owner; no implementation started in Phase 2 |

## Executive Product Agent

**Mission:** Own product readiness for Vanciety and keep that discipline launch-safe, documented, tested, and connected to SkillOpt.

**Owned files/folders:**
- `docs/PROJECT_INDEX.md`
- `docs/LAUNCH_CHECKLIST.md`
- `docs/SKILLOPT_PLAN.md`

**Owned product flows:**
- Product requirements
- User roles
- Feature matrix
- User flows
- Launch scope
- Roadmap

**Security responsibilities:**
- Protect secrets and credentials
- Do not expose API keys/client secrets
- Verify auth/permissions before launch claims
- Record risks in LAUNCH_BLOCKERS.md

**Testing responsibilities:**
- Define required tests for owned surface
- Run or request relevant build/lint/typecheck/test gates before launch
- Document failed/blocked gates honestly
- Update validation gate evidence

**Current status:** assigned full-time discipline owner; no implementation started in Phase 2

**Blockers:**
- Supabase credentials/RLS/auth verification not complete
- AI Concierge Edge Function deployment/key must be server-side only
- GPS/Friend Finder location privacy remains launch-critical

**Validation gate:** `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/product/validation_gate.md`

**SkillOpt skill path:** `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/product/best_skill.md`

**Launch-readiness checklist:**
- [ ] Read SkillOpt best_skill.md
- [ ] Confirm owned files/folders exist or document UNKNOWN
- [ ] Confirm blockers for discipline
- [ ] Define validation command/review gate
- [ ] Do not promote launch-ready until gate passes

## Architecture Agent

**Mission:** Own architecture readiness for Vanciety and keep that discipline launch-safe, documented, tested, and connected to SkillOpt.

**Owned files/folders:**
- `docs/PROJECT_INDEX.md`
- `docs/COMMANDS.md`
- `docs/SECURITY_CHECKLIST.md`

**Owned product flows:**
- Architecture
- System diagram
- Data flow
- Tech stack decisions
- Repo structure

**Security responsibilities:**
- Protect secrets and credentials
- Do not expose API keys/client secrets
- Verify auth/permissions before launch claims
- Record risks in LAUNCH_BLOCKERS.md

**Testing responsibilities:**
- Define required tests for owned surface
- Run or request relevant build/lint/typecheck/test gates before launch
- Document failed/blocked gates honestly
- Update validation gate evidence

**Current status:** assigned full-time discipline owner; no implementation started in Phase 2

**Blockers:**
- Supabase credentials/RLS/auth verification not complete
- AI Concierge Edge Function deployment/key must be server-side only
- GPS/Friend Finder location privacy remains launch-critical

**Validation gate:** `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/architecture/validation_gate.md`

**SkillOpt skill path:** `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/architecture/best_skill.md`

**Launch-readiness checklist:**
- [ ] Read SkillOpt best_skill.md
- [ ] Confirm owned files/folders exist or document UNKNOWN
- [ ] Confirm blockers for discipline
- [ ] Define validation command/review gate
- [ ] Do not promote launch-ready until gate passes

## Frontend Agent

**Mission:** Own frontend readiness for Vanciety and keep that discipline launch-safe, documented, tested, and connected to SkillOpt.

**Owned files/folders:**
- `src/`
- `app/`
- `pages/`
- `components/`
- `public/`

**Owned product flows:**
- Public pages
- Auth pages
- Dashboards
- Components
- Forms
- Responsive layout

**Security responsibilities:**
- Protect secrets and credentials
- Do not expose API keys/client secrets
- Verify auth/permissions before launch claims
- Record risks in LAUNCH_BLOCKERS.md

**Testing responsibilities:**
- Define required tests for owned surface
- Run or request relevant build/lint/typecheck/test gates before launch
- Document failed/blocked gates honestly
- Update validation gate evidence

**Current status:** assigned full-time discipline owner; no implementation started in Phase 2

**Blockers:**
- Supabase credentials/RLS/auth verification not complete
- AI Concierge Edge Function deployment/key must be server-side only
- GPS/Friend Finder location privacy remains launch-critical

**Validation gate:** `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/frontend/validation_gate.md`

**SkillOpt skill path:** `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/frontend/best_skill.md`

**Launch-readiness checklist:**
- [ ] Read SkillOpt best_skill.md
- [ ] Confirm owned files/folders exist or document UNKNOWN
- [ ] Confirm blockers for discipline
- [ ] Define validation command/review gate
- [ ] Do not promote launch-ready until gate passes

## UX/UI Design Agent

**Mission:** Own design readiness for Vanciety and keep that discipline launch-safe, documented, tested, and connected to SkillOpt.

**Owned files/folders:**
- `src/`
- `app/`
- `components/`
- `public/`
- `docs/`

**Owned product flows:**
- Design system
- Mobile flow
- Desktop flow
- Accessibility
- Conversion quality

**Security responsibilities:**
- Protect secrets and credentials
- Do not expose API keys/client secrets
- Verify auth/permissions before launch claims
- Record risks in LAUNCH_BLOCKERS.md

**Testing responsibilities:**
- Define required tests for owned surface
- Run or request relevant build/lint/typecheck/test gates before launch
- Document failed/blocked gates honestly
- Update validation gate evidence

**Current status:** assigned full-time discipline owner; no implementation started in Phase 2

**Blockers:**
- Supabase credentials/RLS/auth verification not complete
- AI Concierge Edge Function deployment/key must be server-side only
- GPS/Friend Finder location privacy remains launch-critical

**Validation gate:** `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/design/validation_gate.md`

**SkillOpt skill path:** `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/design/best_skill.md`

**Launch-readiness checklist:**
- [ ] Read SkillOpt best_skill.md
- [ ] Confirm owned files/folders exist or document UNKNOWN
- [ ] Confirm blockers for discipline
- [ ] Define validation command/review gate
- [ ] Do not promote launch-ready until gate passes

## Backend/API Agent

**Mission:** Own backend readiness for Vanciety and keep that discipline launch-safe, documented, tested, and connected to SkillOpt.

**Owned files/folders:**
- `api/`
- `server/`
- `functions/`
- `supabase/functions/`
- `packages/api/`

**Owned product flows:**
- APIs
- Validation
- Webhooks
- Background jobs
- Server-side permissions

**Security responsibilities:**
- Protect secrets and credentials
- Do not expose API keys/client secrets
- Verify auth/permissions before launch claims
- Record risks in LAUNCH_BLOCKERS.md

**Testing responsibilities:**
- Define required tests for owned surface
- Run or request relevant build/lint/typecheck/test gates before launch
- Document failed/blocked gates honestly
- Update validation gate evidence

**Current status:** assigned full-time discipline owner; no implementation started in Phase 2

**Blockers:**
- Supabase credentials/RLS/auth verification not complete
- AI Concierge Edge Function deployment/key must be server-side only
- GPS/Friend Finder location privacy remains launch-critical

**Validation gate:** `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/backend/validation_gate.md`

**SkillOpt skill path:** `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/backend/best_skill.md`

**Launch-readiness checklist:**
- [ ] Read SkillOpt best_skill.md
- [ ] Confirm owned files/folders exist or document UNKNOWN
- [ ] Confirm blockers for discipline
- [ ] Define validation command/review gate
- [ ] Do not promote launch-ready until gate passes

## Database Agent

**Mission:** Own database readiness for Vanciety and keep that discipline launch-safe, documented, tested, and connected to SkillOpt.

**Owned files/folders:**
- `supabase/`
- `firebase.json`
- `firestore.rules`
- `migrations/`
- `packages/db/`

**Owned product flows:**
- Schema
- Migrations
- Indexes
- RLS
- Seed data
- Backups

**Security responsibilities:**
- Protect secrets and credentials
- Do not expose API keys/client secrets
- Verify auth/permissions before launch claims
- Record risks in LAUNCH_BLOCKERS.md

**Testing responsibilities:**
- Define required tests for owned surface
- Run or request relevant build/lint/typecheck/test gates before launch
- Document failed/blocked gates honestly
- Update validation gate evidence

**Current status:** assigned full-time discipline owner; no implementation started in Phase 2

**Blockers:**
- Security/auth/database checks must be verified before launch claims
- Supabase credentials/RLS/auth verification not complete
- AI Concierge Edge Function deployment/key must be server-side only
- GPS/Friend Finder location privacy remains launch-critical

**Validation gate:** `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/database/validation_gate.md`

**SkillOpt skill path:** `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/database/best_skill.md`

**Launch-readiness checklist:**
- [ ] Read SkillOpt best_skill.md
- [ ] Confirm owned files/folders exist or document UNKNOWN
- [ ] Confirm blockers for discipline
- [ ] Define validation command/review gate
- [ ] Do not promote launch-ready until gate passes

## Auth/Security Agent

**Mission:** Own security readiness for Vanciety and keep that discipline launch-safe, documented, tested, and connected to SkillOpt.

**Owned files/folders:**
- `docs/SECURITY_CHECKLIST.md`
- `.env.example`
- `.gitignore`
- `supabase/`
- `firebase.json`

**Owned product flows:**
- Authentication
- Authorization
- RBAC
- Secrets
- Headers
- Rate limits
- OWASP checks
- Threat model

**Security responsibilities:**
- Protect secrets and credentials
- Do not expose API keys/client secrets
- Verify auth/permissions before launch claims
- Record risks in LAUNCH_BLOCKERS.md

**Testing responsibilities:**
- Define required tests for owned surface
- Run or request relevant build/lint/typecheck/test gates before launch
- Document failed/blocked gates honestly
- Update validation gate evidence

**Current status:** assigned full-time discipline owner; no implementation started in Phase 2

**Blockers:**
- Security/auth/database checks must be verified before launch claims
- Supabase credentials/RLS/auth verification not complete
- AI Concierge Edge Function deployment/key must be server-side only
- GPS/Friend Finder location privacy remains launch-critical

**Validation gate:** `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/security/validation_gate.md`

**SkillOpt skill path:** `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/security/best_skill.md`

**Launch-readiness checklist:**
- [ ] Read SkillOpt best_skill.md
- [ ] Confirm owned files/folders exist or document UNKNOWN
- [ ] Confirm blockers for discipline
- [ ] Define validation command/review gate
- [ ] Do not promote launch-ready until gate passes

## AI Integration Agent

**Mission:** Own ai readiness for Vanciety and keep that discipline launch-safe, documented, tested, and connected to SkillOpt.

**Owned files/folders:**
- `supabase/functions/`
- `api/`
- `ai/`
- `prompts/`
- `docs/`

**Owned product flows:**
- AI gateway
- Prompts
- RAG
- Evals
- Guardrails
- Cost controls
- Human handoff

**Security responsibilities:**
- Protect secrets and credentials
- Do not expose API keys/client secrets
- Verify auth/permissions before launch claims
- Record risks in LAUNCH_BLOCKERS.md

**Testing responsibilities:**
- Define required tests for owned surface
- Run or request relevant build/lint/typecheck/test gates before launch
- Document failed/blocked gates honestly
- Update validation gate evidence

**Current status:** assigned full-time discipline owner; no implementation started in Phase 2

**Blockers:**
- AI calls require server-side keys, guardrails, evals, and budget caps
- Supabase credentials/RLS/auth verification not complete
- AI Concierge Edge Function deployment/key must be server-side only
- GPS/Friend Finder location privacy remains launch-critical

**Validation gate:** `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/ai/validation_gate.md`

**SkillOpt skill path:** `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/ai/best_skill.md`

**Launch-readiness checklist:**
- [ ] Read SkillOpt best_skill.md
- [ ] Confirm owned files/folders exist or document UNKNOWN
- [ ] Confirm blockers for discipline
- [ ] Define validation command/review gate
- [ ] Do not promote launch-ready until gate passes

## Payments/Memberships Agent

**Mission:** Own payments readiness for Vanciety and keep that discipline launch-safe, documented, tested, and connected to SkillOpt.

**Owned files/folders:**
- `stripe/`
- `api/`
- `webhooks/`
- `docs/`
- `src/`

**Owned product flows:**
- Stripe
- Checkout
- Subscriptions
- Billing portal
- Webhooks
- Feature gating

**Security responsibilities:**
- Protect secrets and credentials
- Do not expose API keys/client secrets
- Verify auth/permissions before launch claims
- Record risks in LAUNCH_BLOCKERS.md

**Testing responsibilities:**
- Define required tests for owned surface
- Run or request relevant build/lint/typecheck/test gates before launch
- Document failed/blocked gates honestly
- Update validation gate evidence

**Current status:** assigned full-time discipline owner; no implementation started in Phase 2

**Blockers:**
- Payment/membership flows require provider dashboard/webhook verification
- Supabase credentials/RLS/auth verification not complete
- AI Concierge Edge Function deployment/key must be server-side only
- GPS/Friend Finder location privacy remains launch-critical

**Validation gate:** `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/payments/validation_gate.md`

**SkillOpt skill path:** `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/payments/best_skill.md`

**Launch-readiness checklist:**
- [ ] Read SkillOpt best_skill.md
- [ ] Confirm owned files/folders exist or document UNKNOWN
- [ ] Confirm blockers for discipline
- [ ] Define validation command/review gate
- [ ] Do not promote launch-ready until gate passes

## Admin Dashboard Agent

**Mission:** Own admin readiness for Vanciety and keep that discipline launch-safe, documented, tested, and connected to SkillOpt.

**Owned files/folders:**
- `admin/`
- `dashboard/`
- `src/pages/`
- `app/admin/`
- `docs/`

**Owned product flows:**
- Admin dashboard
- User management
- Business management
- Ad approvals
- Support review
- Audit logs

**Security responsibilities:**
- Protect secrets and credentials
- Do not expose API keys/client secrets
- Verify auth/permissions before launch claims
- Record risks in LAUNCH_BLOCKERS.md

**Testing responsibilities:**
- Define required tests for owned surface
- Run or request relevant build/lint/typecheck/test gates before launch
- Document failed/blocked gates honestly
- Update validation gate evidence

**Current status:** assigned full-time discipline owner; no implementation started in Phase 2

**Blockers:**
- Supabase credentials/RLS/auth verification not complete
- AI Concierge Edge Function deployment/key must be server-side only
- GPS/Friend Finder location privacy remains launch-critical

**Validation gate:** `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/admin/validation_gate.md`

**SkillOpt skill path:** `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/admin/best_skill.md`

**Launch-readiness checklist:**
- [ ] Read SkillOpt best_skill.md
- [ ] Confirm owned files/folders exist or document UNKNOWN
- [ ] Confirm blockers for discipline
- [ ] Define validation command/review gate
- [ ] Do not promote launch-ready until gate passes

## Mobile/iOS Agent

**Mission:** Own mobile/ios readiness for Vanciety and keep that discipline launch-safe, documented, tested, and connected to SkillOpt.

**Owned files/folders:**
- `ios/`
- `android/`
- `app.json`
- `*.xcodeproj`
- `src/`
- `docs/`

**Owned product flows:**
- Mobile-first UX
- PWA
- iOS-safe layout
- Touch controls
- Future app path

**Security responsibilities:**
- Protect secrets and credentials
- Do not expose API keys/client secrets
- Verify auth/permissions before launch claims
- Record risks in LAUNCH_BLOCKERS.md

**Testing responsibilities:**
- Define required tests for owned surface
- Run or request relevant build/lint/typecheck/test gates before launch
- Document failed/blocked gates honestly
- Update validation gate evidence

**Current status:** assigned full-time discipline owner; no implementation started in Phase 2

**Blockers:**
- Supabase credentials/RLS/auth verification not complete
- AI Concierge Edge Function deployment/key must be server-side only
- GPS/Friend Finder location privacy remains launch-critical

**Validation gate:** `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/mobile-ios/validation_gate.md`

**SkillOpt skill path:** `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/mobile-ios/best_skill.md`

**Launch-readiness checklist:**
- [ ] Read SkillOpt best_skill.md
- [ ] Confirm owned files/folders exist or document UNKNOWN
- [ ] Confirm blockers for discipline
- [ ] Define validation command/review gate
- [ ] Do not promote launch-ready until gate passes

## Marketing/SEO Agent

**Mission:** Own marketing/seo readiness for Vanciety and keep that discipline launch-safe, documented, tested, and connected to SkillOpt.

**Owned files/folders:**
- `public/`
- `src/pages/`
- `app/`
- `docs/`
- `sitemap.xml`
- `robots.txt`

**Owned product flows:**
- SEO
- Sitemap
- Robots.txt
- Schema
- Landing pages
- Business ad sales copy

**Security responsibilities:**
- Protect secrets and credentials
- Do not expose API keys/client secrets
- Verify auth/permissions before launch claims
- Record risks in LAUNCH_BLOCKERS.md

**Testing responsibilities:**
- Define required tests for owned surface
- Run or request relevant build/lint/typecheck/test gates before launch
- Document failed/blocked gates honestly
- Update validation gate evidence

**Current status:** assigned full-time discipline owner; no implementation started in Phase 2

**Blockers:**
- Supabase credentials/RLS/auth verification not complete
- AI Concierge Edge Function deployment/key must be server-side only
- GPS/Friend Finder location privacy remains launch-critical

**Validation gate:** `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/marketing-seo/validation_gate.md`

**SkillOpt skill path:** `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/marketing-seo/best_skill.md`

**Launch-readiness checklist:**
- [ ] Read SkillOpt best_skill.md
- [ ] Confirm owned files/folders exist or document UNKNOWN
- [ ] Confirm blockers for discipline
- [ ] Define validation command/review gate
- [ ] Do not promote launch-ready until gate passes

## Analytics/Growth Agent

**Mission:** Own analytics readiness for Vanciety and keep that discipline launch-safe, documented, tested, and connected to SkillOpt.

**Owned files/folders:**
- `analytics/`
- `src/`
- `app/`
- `docs/`

**Owned product flows:**
- Event tracking
- Funnel tracking
- Growth dashboard
- Conversion metrics

**Security responsibilities:**
- Protect secrets and credentials
- Do not expose API keys/client secrets
- Verify auth/permissions before launch claims
- Record risks in LAUNCH_BLOCKERS.md

**Testing responsibilities:**
- Define required tests for owned surface
- Run or request relevant build/lint/typecheck/test gates before launch
- Document failed/blocked gates honestly
- Update validation gate evidence

**Current status:** assigned full-time discipline owner; no implementation started in Phase 2

**Blockers:**
- Supabase credentials/RLS/auth verification not complete
- AI Concierge Edge Function deployment/key must be server-side only
- GPS/Friend Finder location privacy remains launch-critical

**Validation gate:** `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/analytics/validation_gate.md`

**SkillOpt skill path:** `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/analytics/best_skill.md`

**Launch-readiness checklist:**
- [ ] Read SkillOpt best_skill.md
- [ ] Confirm owned files/folders exist or document UNKNOWN
- [ ] Confirm blockers for discipline
- [ ] Define validation command/review gate
- [ ] Do not promote launch-ready until gate passes

## QA/Test Agent

**Mission:** Own qa readiness for Vanciety and keep that discipline launch-safe, documented, tested, and connected to SkillOpt.

**Owned files/folders:**
- `tests/`
- `e2e/`
- `__tests__/`
- `docs/LAUNCH_CHECKLIST.md`
- `docs/LAUNCH_BLOCKERS.md`

**Owned product flows:**
- Unit tests
- Integration tests
- E2E tests
- Accessibility tests
- Mobile tests
- Launch blockers

**Security responsibilities:**
- Protect secrets and credentials
- Do not expose API keys/client secrets
- Verify auth/permissions before launch claims
- Record risks in LAUNCH_BLOCKERS.md

**Testing responsibilities:**
- Define required tests for owned surface
- Run or request relevant build/lint/typecheck/test gates before launch
- Document failed/blocked gates honestly
- Update validation gate evidence

**Current status:** assigned full-time discipline owner; no implementation started in Phase 2

**Blockers:**
- Launch readiness blocked until build/lint/test/mobile/accessibility gates are run
- Supabase credentials/RLS/auth verification not complete
- AI Concierge Edge Function deployment/key must be server-side only
- GPS/Friend Finder location privacy remains launch-critical

**Validation gate:** `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/qa/validation_gate.md`

**SkillOpt skill path:** `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/qa/best_skill.md`

**Launch-readiness checklist:**
- [ ] Read SkillOpt best_skill.md
- [ ] Confirm owned files/folders exist or document UNKNOWN
- [ ] Confirm blockers for discipline
- [ ] Define validation command/review gate
- [ ] Do not promote launch-ready until gate passes

## DevOps/Deployment Agent

**Mission:** Own devops readiness for Vanciety and keep that discipline launch-safe, documented, tested, and connected to SkillOpt.

**Owned files/folders:**
- `.github/`
- `vercel.json`
- `netlify.toml`
- `firebase.json`
- `Dockerfile`
- `docs/COMMANDS.md`

**Owned product flows:**
- CI/CD
- Staging
- Production
- Monitoring
- Rollback
- Backups

**Security responsibilities:**
- Protect secrets and credentials
- Do not expose API keys/client secrets
- Verify auth/permissions before launch claims
- Record risks in LAUNCH_BLOCKERS.md

**Testing responsibilities:**
- Define required tests for owned surface
- Run or request relevant build/lint/typecheck/test gates before launch
- Document failed/blocked gates honestly
- Update validation gate evidence

**Current status:** assigned full-time discipline owner; no implementation started in Phase 2

**Blockers:**
- Production/staging/rollback/monitoring not verified in Phase 2
- Supabase credentials/RLS/auth verification not complete
- AI Concierge Edge Function deployment/key must be server-side only
- GPS/Friend Finder location privacy remains launch-critical

**Validation gate:** `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/devops/validation_gate.md`

**SkillOpt skill path:** `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/devops/best_skill.md`

**Launch-readiness checklist:**
- [ ] Read SkillOpt best_skill.md
- [ ] Confirm owned files/folders exist or document UNKNOWN
- [ ] Confirm blockers for discipline
- [ ] Define validation command/review gate
- [ ] Do not promote launch-ready until gate passes

## Customer Support Automation Agent

**Mission:** Own support readiness for Vanciety and keep that discipline launch-safe, documented, tested, and connected to SkillOpt.

**Owned files/folders:**
- `support/`
- `docs/`
- `src/`
- `app/`

**Owned product flows:**
- Support flows
- Ticketing
- AI handoff
- Knowledge base
- Support analytics

**Security responsibilities:**
- Protect secrets and credentials
- Do not expose API keys/client secrets
- Verify auth/permissions before launch claims
- Record risks in LAUNCH_BLOCKERS.md

**Testing responsibilities:**
- Define required tests for owned surface
- Run or request relevant build/lint/typecheck/test gates before launch
- Document failed/blocked gates honestly
- Update validation gate evidence

**Current status:** assigned full-time discipline owner; no implementation started in Phase 2

**Blockers:**
- Supabase credentials/RLS/auth verification not complete
- AI Concierge Edge Function deployment/key must be server-side only
- GPS/Friend Finder location privacy remains launch-critical

**Validation gate:** `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/support/validation_gate.md`

**SkillOpt skill path:** `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/support/best_skill.md`

**Launch-readiness checklist:**
- [ ] Read SkillOpt best_skill.md
- [ ] Confirm owned files/folders exist or document UNKNOWN
- [ ] Confirm blockers for discipline
- [ ] Define validation command/review gate
- [ ] Do not promote launch-ready until gate passes

## Compliance/Privacy Agent

**Mission:** Own compliance/privacy readiness for Vanciety and keep that discipline launch-safe, documented, tested, and connected to SkillOpt.

**Owned files/folders:**
- `docs/`
- `public/`
- `src/`
- `app/`

**Owned product flows:**
- Terms
- Privacy
- Cookie policy
- Refund policy
- Acceptable use
- AI disclaimer

**Security responsibilities:**
- Protect secrets and credentials
- Do not expose API keys/client secrets
- Verify auth/permissions before launch claims
- Record risks in LAUNCH_BLOCKERS.md

**Testing responsibilities:**
- Define required tests for owned surface
- Run or request relevant build/lint/typecheck/test gates before launch
- Document failed/blocked gates honestly
- Update validation gate evidence

**Current status:** assigned full-time discipline owner; no implementation started in Phase 2

**Blockers:**
- Terms/privacy/refund/AUP/AI disclaimer must match actual product surfaces
- Supabase credentials/RLS/auth verification not complete
- AI Concierge Edge Function deployment/key must be server-side only
- GPS/Friend Finder location privacy remains launch-critical

**Validation gate:** `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/compliance-privacy/validation_gate.md`

**SkillOpt skill path:** `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/compliance-privacy/best_skill.md`

**Launch-readiness checklist:**
- [ ] Read SkillOpt best_skill.md
- [ ] Confirm owned files/folders exist or document UNKNOWN
- [ ] Confirm blockers for discipline
- [ ] Define validation command/review gate
- [ ] Do not promote launch-ready until gate passes

## Performance/Scaling Agent

**Mission:** Own performance readiness for Vanciety and keep that discipline launch-safe, documented, tested, and connected to SkillOpt.

**Owned files/folders:**
- `src/`
- `app/`
- `public/`
- `docs/`
- `package.json`

**Owned product flows:**
- Lighthouse
- Load testing
- Caching
- Image optimization
- Database performance

**Security responsibilities:**
- Protect secrets and credentials
- Do not expose API keys/client secrets
- Verify auth/permissions before launch claims
- Record risks in LAUNCH_BLOCKERS.md

**Testing responsibilities:**
- Define required tests for owned surface
- Run or request relevant build/lint/typecheck/test gates before launch
- Document failed/blocked gates honestly
- Update validation gate evidence

**Current status:** assigned full-time discipline owner; no implementation started in Phase 2

**Blockers:**
- Supabase credentials/RLS/auth verification not complete
- AI Concierge Edge Function deployment/key must be server-side only
- GPS/Friend Finder location privacy remains launch-critical

**Validation gate:** `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/performance/validation_gate.md`

**SkillOpt skill path:** `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/performance/best_skill.md`

**Launch-readiness checklist:**
- [ ] Read SkillOpt best_skill.md
- [ ] Confirm owned files/folders exist or document UNKNOWN
- [ ] Confirm blockers for discipline
- [ ] Define validation command/review gate
- [ ] Do not promote launch-ready until gate passes

## Documentation Agent

**Mission:** Own documentation readiness for Vanciety and keep that discipline launch-safe, documented, tested, and connected to SkillOpt.

**Owned files/folders:**
- `README.md`
- `docs/`
- `CHANGELOG.md`
- `STATUS.md`

**Owned product flows:**
- README
- Setup docs
- Commands
- Operations runbook
- Known limitations

**Security responsibilities:**
- Protect secrets and credentials
- Do not expose API keys/client secrets
- Verify auth/permissions before launch claims
- Record risks in LAUNCH_BLOCKERS.md

**Testing responsibilities:**
- Define required tests for owned surface
- Run or request relevant build/lint/typecheck/test gates before launch
- Document failed/blocked gates honestly
- Update validation gate evidence

**Current status:** assigned full-time discipline owner; no implementation started in Phase 2

**Blockers:**
- Supabase credentials/RLS/auth verification not complete
- AI Concierge Edge Function deployment/key must be server-side only
- GPS/Friend Finder location privacy remains launch-critical

**Validation gate:** `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/documentation/validation_gate.md`

**SkillOpt skill path:** `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/documentation/best_skill.md`

**Launch-readiness checklist:**
- [ ] Read SkillOpt best_skill.md
- [ ] Confirm owned files/folders exist or document UNKNOWN
- [ ] Confirm blockers for discipline
- [ ] Define validation command/review gate
- [ ] Do not promote launch-ready until gate passes

## Launch Manager Agent

**Mission:** Own launch/manager readiness for Vanciety and keep that discipline launch-safe, documented, tested, and connected to SkillOpt.

**Owned files/folders:**
- `docs/LAUNCH_CHECKLIST.md`
- `docs/LAUNCH_BLOCKERS.md`
- `docs/AGENT_STATUS.md`

**Owned product flows:**
- Final go-live report
- Launch checklist
- Post-launch monitoring
- Known blockers

**Security responsibilities:**
- Protect secrets and credentials
- Do not expose API keys/client secrets
- Verify auth/permissions before launch claims
- Record risks in LAUNCH_BLOCKERS.md

**Testing responsibilities:**
- Define required tests for owned surface
- Run or request relevant build/lint/typecheck/test gates before launch
- Document failed/blocked gates honestly
- Update validation gate evidence

**Current status:** assigned full-time discipline owner; no implementation started in Phase 2

**Blockers:**
- Supabase credentials/RLS/auth verification not complete
- AI Concierge Edge Function deployment/key must be server-side only
- GPS/Friend Finder location privacy remains launch-critical

**Validation gate:** `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/launch-manager/validation_gate.md`

**SkillOpt skill path:** `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/skills/launch-manager/best_skill.md`

**Launch-readiness checklist:**
- [ ] Read SkillOpt best_skill.md
- [ ] Confirm owned files/folders exist or document UNKNOWN
- [ ] Confirm blockers for discipline
- [ ] Define validation command/review gate
- [ ] Do not promote launch-ready until gate passes

## SkillOpt Protocol

Each agent must follow this protocol before changing implementation:

1. Read current `best_skill.md`.
2. Perform assigned audit or bounded task.
3. Log trajectory in `trajectory_log.md`.
4. Identify missed requirement or failure.
5. Propose bounded skill edit.
6. Run validation gate from `validation_gate.md`.
7. Promote edit only if validation passes and improves future work.
8. Put rejected edits in `rejected_edits.md`.
9. Update `docs/AGENT_STATUS.md`.

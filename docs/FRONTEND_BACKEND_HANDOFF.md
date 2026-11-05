# SaaS001 Frontend and Backend Handoff

Updated: 5 November 2026

## Current product flow

1. Landing page introduces SaaS001 and its evidence-first positioning.
2. User enters the shared light minimal-modern theme.
3. User starts the workspace.
4. A branded orbit loader polls the audit status endpoint.
5. The workspace opens with the intake-to-report journey when the audit completes.
6. Intake values persist in browser `localStorage`.
7. The user can review profile fields, approve competitors, inspect opportunities, complete a 30-day plan, and export Markdown.

The current application is a local demo. It does not claim to crawl a live website, authenticate a user, or persist data to a server.

## Frontend components

| Component or surface | Location | Status | Backend dependency |
| --- | --- | --- | --- |
| Landing page | `app/page.tsx`, `.landing*` styles | Complete | None |
| Light theme | `app/page.tsx`, `.landing*` and workspace styles | Complete | None |
| Audit-aware loader | `app/page.tsx`, `.loading-*` styles | Complete for demo API | Replace in-memory status with durable worker status |
| Workspace shell | `app/page.tsx`, `.sidebar`, `.topbar` styles | Complete | Auth session and workspace query |
| Overview dashboard | `Overview` | Complete with typed fixture data | Audit summary API |
| Business intake | `Intake` | Complete with local persistence | Project and profile API |
| Profile review | `Profile` | Complete as demo | Evidence and profile APIs |
| Competitor approval | `Competitors` | Complete as demo | Discovery, candidate, and decision APIs |
| Opportunity Finder | `Opportunities` | Complete with hypothesis scores | Opportunity ranking service |
| Action plan | `ActionPlan` | Complete as local state | Plan/task APIs |
| Report snapshot | `Report` | Complete with Markdown export | Immutable report snapshot and export API |
| Icons and controls | `lucide-react` plus custom CSS | Complete | None |
| Shadcn-style primitives | Buttons, panels, badges, inputs, toggles, status labels | Implemented in local CSS | Extract to shared components when routes split |

## Frontend work still recommended

- Split the single client route into App Router pages once server data exists.
- Extract `Button`, `Badge`, `Card`, `Input`, `Progress`, `Tabs`, `Sheet`, and `Toast` into shared components.
- Add loading, error, empty, partial-data, and retry states to each server-backed surface.
- Replace fixture counts and scores with typed API responses.
- Add Playwright checks for mobile navigation, theme switching, loader completion, intake persistence, approval changes, and export.
- Respect `prefers-reduced-motion` for the orbit loader and page motion.
- Add an authenticated account menu and organization switcher.

## Backend build order

### Phase 1: foundation

- Add PostgreSQL and Drizzle configuration.
- Current partial implementation: `src/lib/db/schema.ts`, `src/lib/db/client.ts`, `src/lib/audit/repository.ts`, and `db/migrations/0001_audit_foundation.sql` provide the first projects/audits persistence boundary.
- Apply the SQL migration against a PostgreSQL database before setting `DATABASE_URL` in a hosted environment.
- Add migrations for organizations, memberships, projects, business profiles, audits, crawl pages, evidence, competitors, decisions, findings, opportunities, plans, tasks, snapshots, provider usage, and audit events.
- Add authentication and server-side organization/project authorization.
- Add repository and service modules so UI routes never write SQL directly.
- Add a demo mode that is explicitly read-only and requires no credentials.
- Current partial implementation: in-memory audit jobs expose a demo-only lifecycle without database persistence.

### Phase 2: audit and evidence

- Implement `POST /api/projects/:projectId/audits` to create an idempotent audit job.
- Implement `GET /api/audits/:auditId/status` for queued, running, partial, failed, and completed states.
- Current partial implementation: `POST /api/audit/start` and `GET /api/audit/:id/status` support queued, running, and completed states through PostgreSQL when configured, with an explicit in-memory demo fallback.
- Implement bounded HTTP crawling with SSRF, DNS, redirect, robots, timeout, content-size, and page-count controls.
- Store immutable evidence with URL, retrieved time, excerpt, classification, confidence, method, and entity reference.
- Add deterministic metadata, headings, canonical, schema, internal-link, FAQ, pricing, and public-social checks.

### Phase 3: decision workflow

- Implement candidate discovery with manual/mock mode first.
- Add optional provider adapters behind server-only interfaces and budgets.
- Require human approval before competitor comparisons.
- Calculate explainable relevance and opportunity hypotheses only from supported inputs.
- Persist plan tasks and immutable report snapshots.
- Generate Markdown and safe CSV without making provider calls during export.

## Suggested API contract

```text
POST /api/projects/:projectId/audits
GET  /api/audits/:auditId/status
GET  /api/audits/:auditId/profile
PATCH /api/projects/:projectId/profile
GET  /api/audits/:auditId/competitors
POST /api/audits/:auditId/competitors
PATCH /api/competitors/:competitorId/decision
GET  /api/audits/:auditId/opportunities
POST /api/audits/:auditId/plans
PATCH /api/plan-tasks/:taskId
GET  /api/audits/:auditId/report
GET  /api/audits/:auditId/export?format=markdown|csv
```

All endpoints must enforce authenticated organization and project ownership on the server. Never trust a project ID supplied by the browser.

## Environment variables and API keys

### Required for a hosted deployment

```env
DATABASE_URL=
AUTH_SECRET=
APP_URL=
```

Apply `db/migrations/0001_audit_foundation.sql` before using `DATABASE_URL`. Use a secret manager in production. Do not commit `.env` files or print values in logs.

### Optional provider integrations

```env
TAVILY_API_KEY=
OPENROUTER_API_KEY=
OLLAMA_BASE_URL=http://localhost:11434
GOOGLE_SEARCH_CONSOLE_CLIENT_ID=
GOOGLE_SEARCH_CONSOLE_CLIENT_SECRET=
GOOGLE_SEARCH_CONSOLE_REDIRECT_URI=
```

Provider rules:

- Keep all provider calls server-side.
- Keep mock/manual mode functional with no provider key.
- Add request budgets, cache keys, rate limits, timeout handling, and usage logging.
- Set `ALLOW_PAID_MODELS=false` and `ALLOW_PAID_SEARCH=false` by default.
- Never fall back silently to paid providers after a free quota failure.
- Treat API keys as deployment secrets, not frontend environment variables.
- Recheck provider pricing, terms, quotas, and commercial use before launch.

## Deployment gate

Before a public deployment, pass all of these checks:

- `npm run lint`
- `npm run build`
- Database migrations run from a clean database.
- Authentication and tenant isolation tests pass.
- SSRF and redirect tests pass.
- Audit retries and partial failures are visible in the UI.
- Exports require authorization and use stored snapshots.
- No API key appears in browser bundles or logs.
- A fixture audit works with no paid provider keys.
- Backups, retention, deletion, and provider terms are documented.
- Mobile and desktop browser checks pass.

## Current release status

**Status: Demo-ready, persistence boundary started, not production-ready.**

Frontend demo and interaction flow are implemented, and the loader now uses a server-side audit contract with PostgreSQL support and a demo fallback. Authentication, tenant authorization, the live crawl pipeline, full SSRF/DNS/robots controls, provider controls, and deployment security gates remain before a public P0 release.

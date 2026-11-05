# SaaS001 Implementation Plan

**Project:** AI-powered Growth Intelligence & Marketing SaaS  
**Started:** 5 November 2026  
**Tech Stack:** Next.js 15 App Router · TypeScript Strict · Tailwind CSS · PostgreSQL · Drizzle ORM  

---

## Phase 0 — Repository Audit & Lead Alignment ✅

- [x] Inspect repository (empty Git repo, no existing code)
- [x] Choose tech stack: Next.js App Router + TypeScript + Tailwind + Drizzle + Zod
- [x] Create IMPLEMENTATION_PLAN.md
- [x] Create docs/architecture.md
- [x] Create docs/requirements-gap.md
- [x] Create docs/decisions.md
- [x] Scaffold project with create-next-app

**Exit gate:** ✅ Accurate repo map, requirement traceability, no product code changed.

---

## Phase 1 — Product UX & Vertical-Aware Onboarding ✅

- [x] Landing page with product value proposition (`/`)
- [x] Onboarding wizard (`/onboarding` - URL, vertical, market, audience, price range, stage, goal, budget, 25km local radius)
- [x] Workspace shell & navigation (`AppShell`, `Sidebar`, `Header`)
- [x] Business profile review screen (`/profile`)
- [x] Competitor review/approval screen (`/competitors` - approve/reject/expand relevance breakdown)
- [x] Benchmark comparison view screen (`/comparisons` - observable signals only)
- [x] SEO & AEO Analysis findings screen (`/seo` - code-level evidence & suggested fixes)
- [x] Opportunities list screen (`/opportunities` - ranked priority score, effort/cost bands)
- [x] 30-Day Action plan screen (`/plan` - interactive sprint checklist)
- [x] Report & export snapshot screen (`/report` - Markdown export)
- [x] Responsive layout with mobile/desktop accessibility
- [x] Typed fixtures and live UI validation
- [x] Production build pass without errors

**Exit gate:** ✅ Complete mock E2E P0 journey works on mobile and desktop.

---

## Phase 2 & 3 Foundation Built 🔄
- [x] Drizzle ORM Schema (`src/lib/db/schema.ts`) covering all canonical domain entities
- [x] SSRF URL Validator with private network & metadata IP blocking (`src/lib/crawler/url-validator.ts`)
- [x] Safe Bounded Crawler using Cheerio (`src/lib/crawler/safe-crawler.ts`)
- [x] Deterministic SEO & Schema checker (`src/lib/analysis/seo-checks.ts`)
- [x] REST API endpoints (`/api/audit/start`, `/api/audit/[id]/status`)

---

## Phase 2 — Auth, Tenancy, Persistence & Job Framework 🔲

- [ ] Authentication (NextAuth.js with credential + OAuth providers)
- [ ] Organization/project ownership model
- [ ] Database schema & migrations (Drizzle)
- [ ] All canonical entities (business_profiles, audits, evidence, competitors, etc.)
- [ ] Repository/service interfaces (no SQL in components)
- [ ] Tenant isolation at service + API boundaries
- [ ] Idempotent audit job states (queued/running/partial/failed/completed)
- [ ] Demo mode (read-only, no DB)
- [ ] Migration/seed scripts
- [ ] Ownership/isolation tests

**Exit gate:** Persistence, migration, ownership tests and demo mode work.

---

## Phase 3 — Secure Crawler & Provenance 🔲

- [ ] Safe bounded crawler (Cheerio + optional Playwright)
- [ ] SSRF protections (loopback/private/metadata IP blocking)
- [ ] robots.txt / sitemap.xml compliance
- [ ] Content/time/page caps (25 HTML pages, 3 JS-rendered)
- [ ] Structured extraction (title, description, headings, schema, links, prices, etc.)
- [ ] Immutable provenance records with evidence classification
- [ ] Job progress persistence & UI exposure
- [ ] Test fixtures for malformed/unreachable/redirect/robots scenarios

**Exit gate:** Bounded crawl → persisted traceable evidence; unsafe URLs rejected.

---

## Phase 4 — Business/Brand Intelligence & Vertical Packs 🔲

- [ ] Transform crawl evidence + intake into structured business profile
- [ ] Deterministic rules-first extraction
- [ ] Optional ModelGateway-assisted synthesis
- [ ] Evidence & unknown states on every field
- [ ] Edit/confirm flows with versioning
- [ ] Typed vertical-pack interface
- [ ] Configure one initial vertical (D2C/e-commerce proposed)
- [ ] Test sparse websites and contradictory values

**Exit gate:** Confirmed profile guides discovery; unsupported data remains unknown.

---

## Phase 5 — Deterministic SEO/AEO & Basic Market Observations 🔲

- [ ] Metadata, canonicals, headings, crawlability checks
- [ ] Internal links and structured data analysis
- [ ] Answer-first/FAQ structure detection
- [ ] Content clarity heuristics
- [ ] Evidence-backed findings with URL, confidence, rule version
- [ ] Basic offering/pricing/social signal capture
- [ ] Findings UI
- [ ] Tests on fixtures without API keys

**Exit gate:** Evidence-backed findings without invented metrics.

---

## Phase 6 — Competitor Discovery, Classification & User Approval 🔲

- [ ] SearchProvider interface (mock/manual + optional Tavily)
- [ ] Query generation from confirmed profile
- [ ] 25km default for local; service geography for non-local
- [ ] Deduplication across domains/sources
- [ ] Classification: relationship (direct/indirect/substitute/aspirational) × scale
- [ ] Weighted relevance scoring (configurable hypotheses)
- [ ] User approve/reject/edit/manual-add workflow
- [ ] Tests for normalization, quota failure, radius, manual edits

**Exit gate:** Credible source-backed competitor shortlist; manual mode works without Tavily.

---

## Phase 7 — Shared ModelGateway, Cost Accounting & Competitor Comparison 🔲

- [ ] Single server-side ModelGateway
- [ ] Provider adapters: mock, Ollama, OpenRouter
- [ ] Cache with stable keys (task/model/prompt version)
- [ ] Budget/kill switch controls
- [ ] Compare approved competitors on observable dimensions
- [ ] Evidence-linked comparisons with source/timestamp/confidence
- [ ] Provider status/usage dashboard
- [ ] Tests for limits/cache/429/prompt injection

**Exit gate:** Evidence-linked comparisons with 0 API-key operation.

---

## Phase 8 — Opportunity Finder & Actionable Growth Plan 🔲

- [ ] Opportunity generation from goals + evidence + competitor gaps
- [ ] Categories: visibility, positioning, content, CX, market
- [ ] Each opportunity: evidence, gap, action, effort/cost, hypothesis, priority
- [ ] Configurable priority weights (impact 30, evidence 25, gap 20, fit 15, feasibility 10)
- [ ] 30-day starter action plan with task statuses
- [ ] Evidence traceability for all items
- [ ] Tests for traceability, unknown data, vertical fit

**Exit gate:** Report answers "What should I do next and why?" with sourced tasks.

---

## Phase 9 — P0 Report, Validation, Security & Deployment Gate 🔲

- [ ] Aggregated executive report (no provider re-calls)
- [ ] Export: Markdown + CSV (PDF optional)
- [ ] Immutable audit snapshots
- [ ] Full E2E tests (fixture + permitted real site)
- [ ] Security: tenant isolation, auth, SSRF, rate limits, schema validation
- [ ] Responsive UX & accessibility check
- [ ] Deployment documentation (build, migrate, secrets, workers)
- [ ] First-run README & pilot checklist
- [ ] Record all failing/untested checks

**Exit gate:** P0 can be demoed and piloted honestly; critical gates pass.

---

## Phase 10 — P1 Deeper Intelligence & Recurring Insight 🔲 (P1)

- [ ] Review sentiment from permitted sources
- [ ] AEO/GEO sampled prompt testing
- [ ] Content/backlink gap analysis
- [ ] Recurring competitor-change snapshots
- [ ] Google Search Console OAuth (owner-authorized)
- [ ] Optional strategist request workflow

**Exit gate:** At least one P1 capability improves pilot-user decisions.

---

## Phase 11 — Connected Strategy & Creative Studio 🔲 (Post-MVP)

- [ ] Growth Strategy Studio
- [ ] Creative Studio (captions, hooks, ad copy, briefs)
- [ ] Versioned prompt templates via ModelGateway
- [ ] Human edit/approval/export flows

**Exit gate:** Creatives are brand-specific, editable, source-contextual.

---

## Phase 12 — P2 Creators, Performance, Agencies & Commercial 🔲 (P2)

- [ ] Creator discovery from permitted sources
- [ ] Campaign/task tracking
- [ ] Organization/team roles & agency views
- [ ] Configurable plan entitlements (Free/Starter/Growth/Agency)
- [ ] Billing integration (after willingness-to-pay validation)

**Exit gate:** Creator data compliant, outcomes distinguishable from guesses, multi-tenant controls pass.


SaaS001 — Product & Engineering Master Plan
Status: Proposed for development-lead review
Version: 1.0 — 5 November 2026
Product: AI-powered growth intelligence and marketing SaaS
Implementation environment: Existing Git repository, implemented phase by phase using Google Antigravity
Source of truth: Client AI Growth Operating System PRD v1.0 and Value Proposition Canvas v1.0. The existing ANTIGRAVITY_PHASE_PROMPTS.md is an engineering starting point, not an overriding product specification.
Naming note: Retain SaaS001 as the project identifier. “AI Growth Operating System” is language in the client's documents describing the product vision; do not rename the codebase or market it as an operating system without the lead/client's approval.
1. Executive decision
Build a focused SaaS MVP, not seven independent AI tools. A business submits its website and market context, reviews a structured profile and proposed competitors, then receives evidence-linked comparisons, ranked growth opportunities and an actionable/exportable plan. Later studios reuse the same profile, evidence, competitor set, priorities and execution data.
MVP definition: Business intake → website evidence → editable business profile → competitor discovery and human approval → comparisons + basic SEO/social signals → Opportunity Finder → prioritized action plan → export.
Operating principles: preserve running code; open-source/local-first; optional quota-limited external APIs; deterministic extraction before AI; never invent market data; strict tenant isolation; cost and evidence transparency; one implementation phase per Antigravity run with review gates.
What changes from the existing SearchLens proposal
Dimension
Existing Markdown starting point
Client expectation
Decision
Positioning
SearchLens SEO/GEO/AEO research workspace
Integrated growth intelligence and marketing SaaS
Use SaaS001 product context; retain SEO/AEO/GEO as a module, not sole product
Intake
URL and market
Website, vertical, audience, location/market, price range, stage, goal, budget
Extend onboarding and editable profile
Competitor model
Search candidates; direct/indirect/alternative
Direct, indirect, substitute, aspirational; scale from local to international
Adopt client taxonomy and approval workflow
Local discovery
Market filter
Adjustable 25 km default for local businesses
Implement only when local context applies
Scoring
General relevance heuristics
Proposed weighted competitor relevance and opportunity prioritization
Make weights configurable, explainable hypotheses
Comparisons
Keywords, SEO, AI visibility
Offering, pricing, sentiment, search, social, vertical evidence
Build available-evidence comparisons; show unavailable
Output
Research reports and fixes
Growth opportunities, priorities, next actions
Opportunity Finder becomes central MVP result
Execution
Mostly postponed
Strategy, brand-aware creative, creators, performance
Introduce shared contracts now; full studios in P1/P2
Trust
Evidence labels
Observed/estimated/inferred/unavailable, source/date/confidence
Apply across all material claims
Commercial
Primarily research workspace
Free audit, paid tiers, agency, managed services
Design extensible entitlement model; defer charging until approved
Requirements traceability
Client requirement
Planned phase
Release
Business onboarding, profile and multi-vertical framework
1, 2, 4
P0
Safe crawling, evidence and basic site comparison
3, 5
P0
Hybrid competitor discovery, approve/reject/edit/manual add
6
P0
Direct/indirect/substitute/aspirational plus geographic scale
6
P0
Basic offering/pricing/SEO/observable social analysis
5, 7
P0
Evidence-backed Opportunity Finder and action plan
8
P0
Exportable report and MVP validation
9
P0
Review sentiment, expanded GEO/AEO, backlinks, change monitoring
10
P1
Search Console integration, recurring checks, strategist add-on
10
P1
Brand-aware Creative Studio
11
Connected expansion, after P0
Creator discovery, campaigns, performance, agencies/teams
12
P2
Security, auth, tenancy, metering and deployment
2 onward; 9 release gate
P0 prerequisite for public launch
Scope discipline: The client explicitly places creator discovery, campaign/performance features and agency/team features in P2; creative is part of the product vision, but not a required in-depth P0 workflow. Do not let these delay the first useful report.
2. MVP user journey & acceptance contract
User signs in (or uses explicitly labelled local demo mode), creates a business/project and enters website URL, vertical, target geography, audience, price position, business stage, growth goal and approximate marketing budget.
Bounded crawl extracts publicly available pages; profile suggestions include source links and confidence; user edits/confirms missing fields.
Competitor discovery proposes a manageable set; user approves, rejects, edits or manually adds candidates. Classify relationship and scale separately. Local discovery starts at 25 km, adjustable; non-local businesses use their actual service geographies.
Compare confirmed competitors on dimensions where sources exist: offerings, visible prices, positioning, basic SEO, visible public social signals, selected vertical-specific attributes. Never pretend to know private performance or revenue.
Show an evidence-backed list of growth opportunities, each with observation, gap, reasoning, specific action, estimated effort/cost band, outcome hypothesis, priority and destination/workflow.
Generate a short, understandable growth action plan with task statuses and evidence references; export/share via file. Report clearly states limitations, timestamps and sampled coverage.
MVP exit: A real, permitted public website can progress from intake to export with traceable data and no required paid API; user correction survives reload; nonexistent/blocked data is shown as unknown; unauthorized user cannot view another tenant's project.
3. Architecture: retain first, replace only if justified
Preferred only if compatible with the repository: Next.js App Router + TypeScript strict + Tailwind, PostgreSQL (local/Supabase Postgres) via existing ORM or Drizzle, Zod schemas, Cheerio, optional restricted Playwright, PostgreSQL-backed jobs/queue or existing worker system, Vitest and Playwright E2E. Preserve any working equivalent approved by the lead. No migration for cosmetic preference.
Next.js client + server routes
   ↓ authentication + organization/project authorization
Domain services / validated job orchestration
   ├─ BusinessProfile / BrandContext / VerticalPack
   ├─ SafeCrawler → EvidenceRepository → DeterministicChecks
   ├─ SearchProvider → CandidateDiscovery → HumanReview
   ├─ CompetitorAnalysis / OpportunityRanker / PlanBuilder
   ├─ ReportExporter / AuditSnapshots
   └─ Optional studios (strategy, creative, creators, performance)
   ↓ shared access layers
PostgreSQL + job status + cache + usage ledger
   ↑
Provider adapters: mock/local; optional Tavily; optional model via local Ollama or OpenRouter
Canonical domain/data objects
users, organizations or equivalent workspace ownership, memberships, projects, business_profiles, vertical_packs (config/version), brand_context, audits, crawl_pages, evidence_sources, competitor_candidates, competitor_decisions, competitor_comparisons, seo_aeo_findings, social_observations, opportunities, growth_plans, plan_tasks, report_snapshots, provider_usage, search_cache, model_cache, audit_events; P1/P2: prompt_runs, integrations, campaigns, creative_assets, creator_profiles, outcome_events, team_roles.
Every material Evidence object should capture url/provider, retrieved_at, excerpt/field, classification = observed|estimated|inferred|unavailable, confidence, method/version and relevant entity link. User-confirmed edits must be distinguished from scraped/AI-suggested values. Raw third-party data retention and redistribution must comply with provider terms.
Vertical packs: shared typed interface plus specific comparison/check rules, starting with one lead-approved vertical. The client lists D2C/e-commerce, local businesses, B2B/SaaS, education/coaching and professional services/clinics as candidates, not all mandatory at launch. A second vertical is a validation test, not a claim of full coverage.
Product calculations (initial, configurable hypotheses)
Competitor relevance: offering overlap 25%, audience 25%, geography 20%, price positioning 15%, business model 10%, acquisition channel 5%. Compute only on supported comparable inputs; show dimensions, unknown fields and rationale, not fake precision. User can override classification. Separate relationship direct|indirect|substitute|aspirational from scale local|city_district|regional|national|international.
Opportunity priority: potential customer impact 30%, evidence 25%, competitive gap 20%, business/budget fit 15%, feasibility 10%. These are hypotheses in the client PRD, not validated benchmarks. Show components, assumptions and confidence; low-quality inputs should downgrade or block numerical priority rather than produce an authoritative score.
4. Cost policy: open-source first, honest about hosted free tiers
Capability
Default (zero marginal API bill)
Optional hosted/provider
Guardrail
Crawl & metadata
HTTP fetch + Cheerio, robots/sitemap, schema parsing; restricted Playwright when essential
None necessary
SSRF/DNS/redirect protections; page/time/size caps; robots compliance
SEO/AEO
Transparent local rules, content structure and trust-signal checks
Google PageSpeed Insights (select pages)
Label rules as heuristics; do not confuse lab tests with search rankings
Search/discovery
Known manually provided competitors, permitted public sources, cached results, mock fixtures
Tavily behind SearchProvider
No scrape circumvention; optional credentials; rate caps and stale indicators
Business summarization/classification
Rules, templates, small local Ollama model if hardware permits
OpenRouter currently available free models via private gateway
Zero guarantees about free availability; cache/dedupe/budget; no paid fallback
Embeddings/dedup
Optional local embeddings and lexical similarity
None needed for MVP
Avoid vector DB unless retrieval need is proven
Search demand metrics
Not measured
Verified owner's Google Search Console (P1) or approved paid provider
No invented volume, CPC, traffic, rankings, market share
Social/creators
User-provided business URLs and permitted public/professional contact paths
Approved platform APIs in P2
Never bypass login, collect private contacts or imply complete coverage
Reporting
Markdown/CSV/HTML exports
PDF only if justified
Render from stored data; no new provider calls on export
Database
Local Postgres development
Supabase free tier if compatible
Pausing, quotas, storage and backup obligations must be reviewed
Background work
DB-backed durable job execution or existing worker
Hosted job infrastructure later
Avoid fragile long-running requests on serverless hosts
Free-provider verification (as checked 5 Nov 2026; recheck before setup): Tavily advertises a free Researcher allowance of 1,000 API credits/month, but different operations consume different credits and the allowance can change: https://www.tavily.com/pricing. Their published policy permits commercial customer-facing SaaS use subject to conditions: https://help.tavily.com/articles/5880393096-permitted-use-customer-applications. OpenRouter's free-model routes have rate caps (its pricing page currently advertises 50 requests/day for an account without purchased credits), and free models may become unavailable: https://openrouter.ai/pricing. Google Search Console API is free but quota-limited and restricted to authorized property data: https://developers.google.com/webmaster-tools/pricing. No provider free tier is a production SLA. Open-source software may still require paid CPU/GPU, hosting, storage and maintenance.
Mandatory provider policy: all calls server-side; provider interfaces, mock adapters, caching and per-audit/day limits; centralized ModelGateway; ALLOW_PAID_MODELS=false, ALLOW_PAID_SEARCH=false, kill switch; opt-in and operator configuration for spend; budget dashboard reports app-recorded usage and provider-reported usage separately; 429/quota exhaustion causes honest degradation, never a secret paid fallback. Do not create multiple provider accounts to evade free limits.
Starting internal budgets (configurable engineering defaults, not provider quotas): crawl ≤25 HTML pages/audit; browser-render ≤3 pages/audit; search calls ≤8/audit; compact LLM tasks ≤3/audit; independent concurrency, timeout and monthly-project caps. Validate quality before tuning.
5. Security, trust and operating rules (apply every phase)
Repo safety: inspect branch, Git status, dependencies, environment variable names, existing code and lead instructions. Preserve user changes. No force push, destructive reset, secret exposure or unapproved dependency replacement.
Tenant isolation: enforce session, organization/project ownership and server-side authorization on every data route, export, background job and integration; no public multi-tenant deployment before tests pass.
Crawler SSRF controls: HTTP(S) only; deny loopback/private/link-local/reserved/multicast/metadata hosts and IPs; validate DNS resolution and each redirect; block rebinding where practical; restrict ports, content types, content length, redirects, timeouts and concurrency. Respect robots and site terms. Never bypass protections.
Prompt injection: treat crawled/web content as hostile task data; never follow embedded instructions or render unsanitized HTML; restrict output and validate schemas.
Compliance: comply with privacy and provider terms; least-privilege OAuth; server-only encrypted tokens where needed; clear retention and deletion; avoid exposing personal creator contact data.
Truthfulness: show actual sources, dates, status, methods and uncertainty. Mark demo/estimated/inferred/unavailable values. Never guarantee SEO rankings, AI citations, leads, revenue or ROI.
Reliability: idempotent jobs, stage persistence, retryable failures, audit log, bounded retries, cache TTL/invalidation, rate limits and visible errors.
Quality gate: every phase runs applicable lint, typecheck, test, build and targeted browser checks; update IMPLEMENTATION_PLAN.md; note files modified, test output, blocked items, API consumption and next steps; STOP until the developer approves the next phase.
6. Implementation phases and Antigravity prompts
How to run: Attach this plan.md and the two client DOCX files to the Antigravity workspace (or place copies under docs/requirements/). Start with Phase 0, not all prompts simultaneously. Each phase below is copy/paste-ready, but its first instruction to read this file is mandatory. Antigravity must keep a task-by-task IMPLEMENTATION_PLAN.md checklist reflecting actual progress. No claim that a phase is done without its exit gate.
Phase 0 — Repository audit & lead alignment (no features)
Goal: Determine what already exists; produce a non-destructive gap map. Release: Planning.
You are the lead implementation engineer for SaaS001. Execute PHASE 0 ONLY. Read plan.md, the two client documents (PRD and Value Proposition Canvas), ANTIGRAVITY_PHASE_PROMPTS.md, README, repo instructions, Git status and source tree. Client requirements override earlier speculative scope; preserve any explicit lead-approved technical decisions and existing working code.

Inventory framework, scripts, routes, UI, design conventions, DB/ORM, auth, tests, crawlers, provider code, model gateway, cache, cost controls, data models, deployment, uncommitted work and remotes. Inspect env variable NAMES ONLY. Do not invoke paid APIs, modify application logic, install dependencies, commit or push.

Create IMPLEMENTATION_PLAN.md (checkboxes + stage gates), docs/architecture.md, docs/requirements-gap.md and docs/decisions.md. Gap report must classify each requirement as implemented/partial/missing/not-needed-for-MVP and map it to the phase and P0/P1/P2. Identify the smallest possible code changes; identify the existing tech stack and constraints. Propose first vertical for lead approval, marking it OPEN until approved.

Run safe existing checks when feasible. Report facts vs assumptions; list changed docs, local run/test commands and blockers. STOP after Phase 0 for human review.
Exit: Accurate repo map and requirement traceability exist; no product code changed.
Phase 1 — Product UX and vertical-aware onboarding
Goal: Reuse existing design and routes, implement the client journey in UI. Release: P0.
Execute SaaS001 PHASE 1 ONLY. Read plan.md, IMPLEMENTATION_PLAN.md and Phase 0 findings. Preserve current UI components/design language and route conventions; do not reskin or rename the repository by default. Implement landing/onboarding, workspace shell, business profile review, competitor review, comparison, opportunities, plan and report screens using clearly marked typed fixtures. Intake: URL, vertical, market/location, audience, price range, business stage, primary goal, budget. For local verticals show editable 25-km competitor radius; for nonlocal verticals show service geography instead. Make every input accessible and persistent in local form state for this UI phase.

Design the primary sequence: Intake → Profile → Competitor approval → Compare → Opportunities → Action plan → Report. The shared SEO/AEO/GEO research workspace is a subarea, not the home product. Provide loading, error, empty, unknown, demo and partial-data states. Preserve responsive styles and keyboard accessibility. Any action not yet wired must be visibly disabled or labeled demo. No real external calls, schema migration or paid services.

Run available checks, update IMPLEMENTATION_PLAN.md and report changed routes. STOP.
Exit: Complete, coherent mock end-to-end P0 journey works on mobile and desktop; no dead-looking interactive buttons.
Phase 2 — Auth, tenancy, persistence & job framework
Goal: Durable and ownership-safe data foundation. Release: P0.
Execute SaaS001 PHASE 2 ONLY. Read plan.md and existing DB/auth patterns. Reuse functional auth/ORM; if absent, propose and implement a minimal well-maintained auth provider with secure sessions and organization/project ownership appropriate to the existing stack. Add validated DB entities and migrations for business profiles, vertical config, audits, pages, evidence, competitors/decisions, findings, opportunities, plans/tasks, report snapshots, jobs and provider usage/cache. Avoid premature P2 schemas unless a small versioned contract is useful.

Create repository/service interfaces so React components never write SQL. Enforce tenant ownership at service and API boundaries, including exports and background tasks. Provide idempotent audit-job states queued/running/partial/failed/completed, retries, persisted stage and error metadata. Keep demo mode explicitly read-only without DB/credentials. Do not print or overwrite secrets. Add migration/seed/setup docs and ownership/isolation tests. Do not deploy publicly before auth gates pass. Run checks and STOP.
Exit: Persistence, migration, ownership tests and honest demo mode work.
Phase 3 — Secure crawler & provenance
Goal: Public website evidence without model or search fees. Release: P0.
Execute SaaS001 PHASE 3 ONLY. Build or adapt the existing safe bounded crawler using Cheerio and restricted optional Playwright. Enforce URL/DNS/redirect SSRF checks, robots, sitemap, content/time/page caps, user-agent transparency, retry control and legal access boundaries from plan.md. Default cap 25 HTML pages/audit, optional max 3 JS-rendered pages; no third-party search/LLM calls.

Extract title, description, canonical, headings, schema types, relevant visible text, links, image alt summaries, available pricing and product/service clues, location/contact, timestamps and warnings. Write structured immutable provenance records (URLs, excerpts, observed date, collection method); reject unsupported claims. Persist job progress/partial failures and expose progress in UI. Test malformed/unreachable sites, redirects to internal IPs, robots, dedup, size and timeout limits using local fixtures. STOP.
Exit: Bounded permitted crawl → persisted, traceable evidence; unsafe URLs rejected.
Phase 4 — Business/brand intelligence & vertical packs
Goal: Editable confirmed business truth, not generic AI guesswork. Release: P0.
Execute SaaS001 PHASE 4 ONLY. Transform actual crawl evidence + user intake into a structured business profile: name, category, vertical, offerings, audience, positioning, differentiation, model, price clues, geography, stage, budget, goals and brand voice. Use deterministic rules first; optional compact ModelGateway-assisted synthesis only if an approved gateway is already available, otherwise defer AI to Phase 7 without blocking this phase. Evidence and unknown states on every field. Provide edit/confirm flows, versioning and user-origin provenance.

Implement a typed vertical-pack interface: competitor factors, comparison dimensions, question templates and relevance rules. Configure one lead-selected initial vertical; clearly note which other verticals are unsupported/experimental. Never assume every industry has comparable KPIs. Verify edits survive refresh and are used downstream. Test sparse websites and contradictory user/site values. STOP.
Exit: Confirmed profile is complete enough to guide discovery; unsupported data remains unknown.
Phase 5 — Deterministic SEO/AEO & basic market observations
Goal: Low-cost, honest site intelligence. Release: P0.
Execute SaaS001 PHASE 5 ONLY. Reuse existing SearchLens SEO/AEO modules when possible; do not rebuild. Add deterministic, explainable checks for metadata, canonicals, headings, crawlability, internal links, visible structured data, basic answer-first/FAQ structure and content clarity. Label checks as observations/heuristics, never search-engine performance measurements. Record URL, exact evidence, confidence, rule version, severity and suggested fix.

For basic offering, public pricing and social analysis, capture only lawful, permitted, verifiable signals (publicly linked social profiles, visible publicly accessible content where allowed). If content is inaccessible, show unavailable; no login bypass or broad scraper. Scope to the chosen vertical and compare only like-for-like observations. Expose findings in UI and test on fixtures without API keys. STOP.
Exit: Working evidence-backed site/offer/observable social findings without invented metrics.
Phase 6 — Competitor discovery, classification & user approval
Goal: Primary client differentiator. Release: P0.
Execute SaaS001 PHASE 6 ONLY. Implement SearchProvider with mock/manual option and optional Tavily server adapter. Use cached, quota-limited searches only when explicitly configured; live search is not required for demo/manual mode. Generate queries from confirmed category, audience, offering and market. Default discovery radius 25 km for local businesses; allow override. Nonlocal businesses use service/delivery geographies. Deduplicate candidates across domains/sources.

Store source, date, confidence and relationship (direct, indirect, substitute, aspirational) separately from scale (local/neighborhood, city/district, regional, national, international). Implement proposed weighted relevance factors from plan.md as configurable hypotheses and expose WHY a result was suggested; report missing fields and allow classification overrides. Users must approve, reject, edit and manually add candidates before benchmark comparisons. Directories/publishers may be sources but not automatically direct competitors. Test domain normalization, quota failure, radius filtering, manual edits and persisted decisions. STOP.
Exit: User can approve a credible source-backed competitor shortlist, and manual mode remains useful without Tavily.
Phase 7 — Shared ModelGateway, cost accounting & competitor comparison
Goal: Efficient optional AI and real comparisons. Release: P0.
Execute SaaS001 PHASE 7 ONLY. Reuse or implement a single server-side ModelGateway. Providers: local/mock first, Ollama optional on capable host, OpenRouter free-model adapter optional. No feature or browser may call external LLM providers directly. Flow: deterministic decision → compact verified evidence bundle → stable cache key including task/model/prompt version → budgets/kill switch → model → schema validation → logged result. Paid features off by default; never automatically fall back to paid after free quota failures.

Compare only user-approved competitors on observable offering, positioning, pricing/public offers, website trust/SEO, public social signals and chosen vertical fields. Preserve sources, timestamps, inferred/observed flags, confidence and missing comparisons. Never invent revenue, sales, traffic, keyword volume, ranking or market share. Prefer batched classification over per-page model calls. Add provider-status/usage screen, mock tests for limits/cache/429/prompt injection, and stable error handling. STOP.
Exit: Validated, evidence-linked comparisons with 0 API-key operation; model calls never bypass cost controls.
Phase 8 — Opportunity Finder & actionable growth plan
Goal: Turn research into decisions. Release: P0.
Execute SaaS001 PHASE 8 ONLY. Build Opportunity Finder from confirmed business goals, evidence, competitor gaps and observed SEO/social/offer signals. Categories: visibility, positioning, content, customer experience and market. Each opportunity must include observed evidence, gap, business reason, specific action, estimated effort/cost band with assumptions, expected-outcome HYPOTHESIS, ranked priority, execution destination and proof/acceptance criterion.

Use configurable client hypothesis weights: impact 30, evidence 25, gap 20, business/budget fit 15, feasibility 10. Penalize insufficient evidence; show components and allow manual reordering. Transform selected opportunities into a 30-day starter action plan with realistic tasks, owner placeholder, effort, budget fit and statuses. Do not present an unverified ROI forecast. All action items must trace back to evidence; add tests for traceability, unknown data and business/vertical fit. STOP.
Exit: The first report answers “What should I do next and why?” with auditably sourced tasks.
Phase 9 — P0 report, validation, security & deployment gate
Goal: Release a trustworthy minimum product, not a mocked marketing demo. Release: P0 gate.
Execute SaaS001 PHASE 9 ONLY. Aggregate stored results without rerunning providers. Create executive report: profile, confirmed competitors, comparisons, SEO/social evidence, top opportunities, 30-day plan, evidence index, timestamps, missing-data limitations and optional provider/usage details. Export readable Markdown + safe CSV; add PDF only if supported and approved. Make one completed audit an immutable snapshot; subsequent runs must not mutate history.

Run full E2E tests with fixture/mock mode and a permitted real public site; verify project/tenant isolation, auth on all routes/exports, crawler SSRF, rate limits, schema validation, key leakage, error handling, responsive UX, content accessibility, usage controls, backups/retention/deletion and dependency risks. Document deployment build/start, DB migration, secrets, scheduled/worker execution and free-tier limitations. Create a reproducible first-run README and a pilot-test checklist. Record all actual failing/untested checks; NO production-ready claim until critical gates pass. Update checklist and STOP.
Exit: P0 product can be demoed and piloted honestly; if gates fail, mark NOT READY and fix before expanding.
Phase 10 — P1 deeper intelligence & recurring insight
Goal: Grow accuracy and repeat value only after P0 pilot evidence. Release: P1.
Execute SaaS001 PHASE 10 ONLY after lead approves P0 pilot learnings. Add selected deeper features in this order, only where access and signal quality justify them: (1) review sentiment from permitted sources, (2) AEO/GEO sampled prompt testing with exact model/provider/time and citation limitations, (3) content/backlink gap analysis through legitimate measured sources, (4) recurring competitor-change snapshots and weekly checks, (5) owner-authorized Google Search Console OAuth, (6) optional strategist request workflow. Do not treat third-party LLM samples as actual ChatGPT/Gemini rankings; do not fabricate backlink/traffic counts.

Each integration must be optional, rights/quotas checked, cached, testable with mocks and disabled if absent. Test longitudinal comparability and user-owned property access. Reprioritize based on adoption and customer feedback. STOP.
Exit: At least one P1 capability improves pilot-user decisions and has lawful, reliable input data; others remain documented backlog.
Phase 11 — Connected Strategy & Creative Studio
Goal: Assist execution using shared intelligence; not a standalone text generator. Release: Post-MVP expansion (schedule by lead based on validated demand).
Execute SaaS001 PHASE 11 ONLY. Build Growth Strategy Studio to turn prioritized opportunities into campaign objectives, budget allocations, schedule, owner tasks and a 30-day roadmap. Build a limited Creative Studio supporting lead-approved initial formats (e.g. captions, hooks, short scripts, carousel outlines, ad copy/briefs) using user-confirmed brand tone, audience, offering, competitor evidence, channel, funnel stage and campaign objective.

Use versioned prompt templates through ModelGateway, enforce budgets and explicit demo/AI-generated labels, enable human edits/approval and export, and store input evidence references. Do not auto-post ads, silently spend media budget or claim generated creatives are validated marketing assets. Run blind comparison of generic vs context-backed creative for pilot users before declaring differentiation. STOP.
Exit: Generated strategy/creatives are brand-specific, editable, source-contextual and tied to actual opportunities.
Phase 12 — P2 creators, performance, agencies & commercial expansion
Goal: Build only after data/legal access and unit economics are demonstrated. Release: P2.
Execute SaaS001 PHASE 12 ONLY after lead approves P2 scope and data-provider terms. Implement creator discovery using allowed public/licensed/API sources with verification dates, relevance criteria, source links and permitted business-contact paths only; do not collect private contacts or circumvent platform restrictions. Add approved campaign/task tracking and measured user-provided/connected outcomes so performance feedback can improve later opportunities. Extend organization/team roles and agency multi-client views with strict tenant boundaries.

Add configurable plan entitlements for limited free audit, Starter, Growth and agency tiers; optional separately priced strategist/video/creator coordination services. Do not activate billing, live outreach or third-party paid APIs without explicit commercial approval. Measure support cost, provider cost, conversion, retention and service margins; document compliance and integration limitations. STOP.
Exit: Creator data is compliant, actual outcomes are distinguishable from guesses, multi-tenant controls pass, commercial economics are measured.
7. Validation and success measures
Client-proposed hypotheses to test
Competitor approval rate: initial hypothesis ≥75% of top suggestions approved.
Classification agreement: initial hypothesis ≥80% agreement with user judgment.
Time to useful report: around five minutes where data sources permit; don't promise it for slow/blocked sites.
Evidence coverage: material observations and recommendations linked to sources.
Activation: completed onboarding plus opportunity review.
Action adoption: saved, assigned or completed recommended actions.
Retention/paid conversion: proof that customers return and will pay for recurring guidance.
These are targets for validation, not known results or contractual performance obligations. Track API cost and infrastructure cost per completed useful report, search/model cache hit rates, failure rate and data freshness.
Suggested low-cost pilot (requires lead/client approval)
Choose one vertical based on 5–10 short customer discovery interviews; record urgency and willingness to pay.
Run 3–5 concierge competitor/opportunity reports with manual verification, then compare to SaaS001 output.
Have customers approve competitor suggestions and rank the usefulness of recommended next actions.
Test whether contextual creative (later phase) beats generic AI output on edit burden and preference.
Expand to a second vertical only after first-vertical usefulness is demonstrated.
8. Lead approval / open decisions
Decision
Recommendation
Status
Initial vertical
Choose 1 (D2C, local services or B2B SaaS are candidates) after interviews
OPEN
Existing repo technology
Keep what works; Next.js/TS/Postgres is fallback, not mandate
REPO AUDIT
Authentication provider & hosting
Select from existing code/constraints; complete before public release
OPEN
Supported search geography/source access
Confirm permitted provider, country and expected coverage
OPEN
First evidence dimensions
Offering, public pricing, basic SEO, observable social
PROPOSED P0
GEO providers / prompt sampling
P1 only; qualify scope and cost
DEFERRED
First creative formats
Decide after P0 user validation
DEFERRED
Creator datasets and usage rights
Legal/provider feasibility gate
P2 OPEN
Pricing and subscription payment
Validate willingness-to-pay before billing integration
OPEN
Launch metrics & supported SLA
Define after profiling actual workloads
OPEN
9. Review protocol for every phase
Before starting: confirm previous phase exit criteria, Git working tree status and lead approval. During: implement only requested phase, preserve existing changes, document assumptions, inspect data sources and budgets. After: provide (a) feature summary, (b) exact files changed, (c) decisions made, (d) tests/commands and actual results, (e) cost/API calls and quota impact, (f) limitations/security risks, (g) items needing lead signoff. Do not automatically start the next phase or push without permission.
10. Source notes
Client source 1: AI Growth Operating System — Product Requirements Document v1.0, 5 Nov 2026. Governs architecture as a product concept, P0/P1/P2 scope, onboarding, competitor taxonomy and weighted hypotheses, source transparency, studios, trust and success metrics.
Client source 2: AI Growth Operating System — Value Proposition Canvas v1.0, 5 Nov 2026. Governs positioning, pains/gains, differentiation hypotheses, critical assumptions and the recommended narrow entry point (website → approved competitors → evidence-backed growth priorities).
Engineering starting point: ANTIGRAVITY_PHASE_PROMPTS.md (“SearchLens”). Reuse its useful Next.js/TypeScript, crawler, SEO/AEO, search provider, server-only ModelGateway, cache/budget, report and test patterns without treating its narrower SEO framing as the client's full scope.
External provider verification (5 Nov 2026): https://www.tavily.com/pricing, https://help.tavily.com/articles/5880393096-permitted-use-customer-applications, https://openrouter.ai/pricing, https://developers.google.com/webmaster-tools/pricing. Pricing, limits, model catalog, terms and deployment constraints must be rechecked at implementation time.

# BRD → SDD Derivation

This file defines how to derive a Solution Design Document from a Business Requirements Document. It is the bit specific to `sdd-unifier` — it does not exist in `brd-unifier`.

The default workflow shape is **SoW → BRD → SDD**, with one SDD per BRD per SoW. This file covers the BRD → SDD step specifically.

---

## One fact, one home (no duplication)

Every fact has exactly one owning document and section. The SDD **references** BRD content — it never restates it:

1. **Reference + delta, never copy.** Business content (glossary terms, scope items, assumptions, wishlist, UC flows) stays in the BRD. The SDD section links to the owning BRD chunk (`../brd-[project-slug]/NN-....md` § heading) and adds ONLY its own delta: new technical terms, solution-level scope refinements, technical assumptions, architectural wishlist items.
2. **Reference UCs by ID.** Per-service Business Logic cites `UC-NN` (with the link) for the behavioural contract and writes only the technical realisation — never a restated Main Flow.
3. **Derived views declare their source.** Sections that consolidate (Actors from personas, §16 roles from the matrix, §17 targets from NFRs) are views, not copies: they transform to a different altitude and name the source row/UC they derive from.
4. **Scalar facts live once.** Counts, versions, dates, and targets are stated in their owning section and referenced elsewhere — a restated number is a drift bug waiting to happen.
5. **Restated upstream content is a review defect.** The reviewer flags it as Type `Duplication` with the reference-based rewrite as the Recommended Answer.
6. **Standalone export is the only exception.** When the user explicitly asks for a self-contained SDD for an external party (vendor, formal review), the merge step MAY inline the referenced BRD sections — marked `> Inlined from BRD §X for standalone distribution` so the owning home stays clear.

---

## What the BRD gives you (read this BEFORE walking the field mapping)

The BRD (`brd-unifier` output) is **business-language only** — it states the WHAT. Everything technical is this skill's job. The BRD's load-bearing inputs for derivation:

| BRD input | Where it lives | How it steers the SDD |
|---|---|---|
| **User journeys & use cases (UC-NN)** | Chunked: `05-user-journeys-overview.md` + `06a-use-cases-[persona].md`, `06b-…`; combined: `# User Journeys & Use Cases` | The core behavioural contract. Each UC has an actor, detailed Main Flow steps, alternate/exception flows, business rules, and acceptance criteria. UCs seed §7.2 Use Case Diagram, drive service decomposition, and fill per-service Business Logic. |
| **Users & Use Cases Matrix** | Chunked: `07-users-use-cases-matrix.md`; combined: `# Users & Use Cases Matrix` | The authorization contract: persona × UC with Yes/- cells and conditional footnotes. Seeds §7.1 Actors, the §16 Centralized User Roles & Authorities catalogue, per-service authorization notes in §15.X Security/Constraints, and role definitions in §11 Cross-Cutting Security. |
| **Technical Inputs for the SDD** | Chunked: `12-appendix-and-wishlist.md` § Technical Inputs; combined: `# Appendix` § Technical Inputs | Source technical mandates parked **verbatim** by brd-unifier (named technologies, protocols, architecture rules, concrete technical targets). Highest-fidelity technical signal: seeds §6 Ecosystem Overview and **overrides CLAUDE.md defaults** where they conflict. May be absent — then CLAUDE.md defaults + architect input carry §6. |
| **Business-language NFRs** | Chunked: `10-nfrs.md`; combined: `# Non-Functional Requirements` | The BRD states the what ("highly available", "handles seasonal peaks") with business measures. The SDD **quantifies** each into technical targets (§17) and realisation decisions (§8, §11) — every quantification the BRD doesn't imply is `[NEEDS CLARIFICATION: ...]` or an architect ask. NFRs are also evidence for the ecosystem selection recommendations (SKILL.md Step 3b). |
| **Business-level integrations** | Chunked: `08-integrations.md`; combined: `# Integrations` | Partner, purpose, information exchanged, direction, criticality. The SDD **enriches** each row with protocol, format, auth, timeout, retries, fallback (§12) — all SDD-only fields. |

**Legacy BRDs (pre-restructure template):** older BRDs may carry a `Specs` section (`12-specs.md` / `# Specs`) and/or a `Technical Implementation Expectations` section, and FR-NN blocks instead of UC-NN. Consume them: Specs.Tech Stack / Technical Implementation Expectations rows go verbatim into §6 (they override CLAUDE.md defaults); Specs.Roadmap informs §13 phasing; Specs.Project Type answers the intake question; FR blocks map like UC blocks (the `How` plays the role of the Main Flow). Note "legacy BRD sections consumed" in the handoff summary. The Specs section is **owned by `lld-unifier` now** — it is never authored into the SDD, regardless of whether the BRD had one.

---

## What derivation is, and is not

**Derivation IS:**

- Reading the BRD in full.
- Auto-filling SDD sections that have direct BRD analogues (Glossary, Personas → Actors, Integrations, Scope, NFRs context).
- Producing an SDD skeleton with all section headings present, in template order.
- Flagging SDD-only sections (Architecture Style, ADRs, Cross-cutting overrides per service, Operations Runbook procedures) with `[NEEDS CLARIFICATION: ...]` markers naming the specific decision needed.
- Falling back to the platform doctrine (EDA + DDD + hexagonal) and user CLAUDE.md defaults (Java 21, Spring Boot 3.5+, PostgreSQL 17+, UUIDv7, Kafka, Keycloak, microservices-first, Angular 17+ standalone) for the Ecosystem Overview when the BRD's parked technical inputs don't override — always confirmed through the ecosystem selection flow (SKILL.md Step 3b).

**Derivation IS NOT:**

- Inventing technical decisions the architect hasn't made.
- Producing per-service detailed specs from use cases alone. UCs describe behaviour; per-service detailed specs describe implementation choices (DB schema, API list, event model). The leap requires architect input.
- Fabricating performance numbers from business-language NFRs. Business measures carry over as context; the technical targets in §14 need architect input or explicit derivation flags.
- A finished SDD. The output is an architect-ready skeleton.

---

## Detecting BRD input form

The BRD can arrive in two forms:

### Chunked form (brd-unifier output)

The user points the skill at a folder. Recognise it by:

- Folder path matches `brd-*/` (kebab-case slug after `brd-`).
- Contains 14+ files with names like `00-cover-and-changelog.md`, `01-executive-summary-and-context.md`, `02-glossary-assumptions-facts.md`, `03-definitions-and-domain-concepts.md`, `04-scope-and-personas.md`, `05-user-journeys-overview.md`, `06a-use-cases-*.md` (one or more), `07-users-use-cases-matrix.md`, `08-integrations.md`, `09-reporting-and-analytics.md`, `10-nfrs.md`, `11-summary-and-uiux.md`, `12-appendix-and-wishlist.md`, `13-open-items-and-clarifications.md`. Newer BRDs also carry delivery chunks: `14-todo.md` always, and `15-implementation.md`, `16-uat-bat-test-cases.md`, `17-for-ppt.md` only once the BRD's to-do has been fully cleared (see the reading order below for how each is treated). (Legacy chunked BRDs use `05-fr-overview.md`, `06a-fr-*.md`, `07-integrations.md`, `10-summary-uiux-tech.md`, `12-specs.md` — same logical reading order.)
- Each file begins with `<!-- CHUNK: NN ... PART OF: BRD — ... -->`.

**Reading order:** numeric (00, 01, 02, 03, 03a, 03b, 04, 05, 06a, 06b, 06c, 07, 08, 09, 10, 11, 12, 13). Multi-letter chunks (`06a`, `06b`) are read alphabetically within their numeric prefix.

**Unfinished BRD.** If `brd-master.md` shows a generation part that is `Pending` or `In progress` (brd-unifier writes BRDs in parts), the BRD is not finished. Stop, tell the user which part is missing, and do not derive an SDD from it.

**Delivery chunks (14-17) are not BRD requirements.** They are derived from chunks 00-13 by `brd-unifier` and never add a requirement:

- **Skip** `14-todo.md` (product-manager checklist) and `17-for-ppt.md` (presentation and video brief) entirely. They are also never part of a merged or combined BRD.
- Read `15-implementation.md` and `16-uat-bat-test-cases.md` **as input context only**, after chunk 13, when they exist (see the field mapping table). They are absent until the BRD's to-do is cleared; their absence is not a gap. In a combined or merged BRD they are the `# Implementation Plan` section and the `# UAT/BAT Test Cases` section (in a merged file the second heading carries the project name: `# [Project Name] - UAT/BAT Test Cases`).
- Read 15 and 16 as current only when `brd-master.md` shows them `Up to date`. A `Stale` or `Provisional` one is read with care and named in the handoff.
- If a delivery chunk and the BRD body disagree, the body wins; note the discrepancy in the handoff.

A legacy unnumbered `uat-bat-test-cases.md` in a BRD folder gets the same treatment as chunk 16.

**Treat as one logical BRD.** Do not produce one SDD per chunk. Read all chunks first, build a unified mental map, then write one SDD.

### Combined form (single BRD .md file)

The user points the skill at a single `.md` file. Recognise it by:

- Filename starts with `BRD-` (e.g., `BRD-WalletManagement-v1.0.md`) OR the file's section headings match the BRD template (5+ of: Executive Summary, Background, Business Objectives, Glossary, Assumptions / Constraints, Facts, Challenges, Dependencies, Definitions & Important Details, Project Scope, Personas, User Journeys & Use Cases, Users & Use Cases Matrix, Integrations, Reporting / Analytics, Non-Functional Requirements, Summary, UI/UX Expectations — or their legacy equivalents Functional Requirements / Technical Implementation Expectations).

**Read in full** before writing anything.

### When both forms exist for the same project

Prefer the chunked form (it is the editable source-of-truth in the user's workflow). If both are clearly the same BRD at the same version, use the chunked one. If the versions differ, use the higher version and note the discrepancy in the handoff.

---

## Field mapping table

This is the authoritative mapping. Each row says: BRD source section → SDD destination section + a note on transformation.

| BRD section | SDD destination | Transformation note |
|---|---|---|
| Cover & Changelog | §0 Cover & Changelog (regenerated) | New SDD has its own version (v1.0). Add a "Related BRD" line pointing at the source BRD's filename / chunk folder. New Changes Log entry: "Initial SDD draft, derived from BRD v[X.X] via sdd-unifier." |
| Executive Summary (BRD) | §1 Executive Summary (SDD) | Recast as **technical** summary. Drop business framing; lead with what the system *is technically*, the architecture style at a glance (placeholder if undecided), and the key technology pillars. The BRD's exec summary becomes input, not output — and later distils into the LLD's Specs Mission (lld-unifier reads §1 for it). |
| Background and Context / Problem Statement | §1 Executive Summary context paragraph | Optional — only carry if it informs technical decisions. Otherwise leave to the Related-BRD link in the cover. |
| Business Objectives | §1 Executive Summary "Key technical bets and trade-offs" | Translate each business objective into a technical implication (e.g., "300+ tenants by Y2" → "horizontal scalability is a primary NFR; multi-tenancy strategy is a critical decision"). |
| Glossary | §5 Glossary | **Reference + delta.** One line linking the BRD glossary (`../brd-[slug]/02-glossary-assumptions-facts.md`), then ONLY new SDD-specific technical terms (architecture style names, infra components). Business terms are not restated. |
| Assumptions / Constraints | §3 Assumptions | **Reference + delta.** Link the BRD assumptions; list ONLY new technical assumptions. A BRD assumption that is really a risk becomes a §4 Risk row referencing the BRD assumption by number. |
| Facts | Distributed: §1 Executive Summary, §6 Ecosystem Overview, §8.1 Architecture Style.Why | Facts often carry technical implications. Classify each into the section it most informs. |
| Challenges | §4 Risks | Convert each challenge to a risk row: assign Likelihood (L/M/H), Impact (L/M/H), Mitigation (paraphrase from BRD if stated; otherwise `[NEEDS CLARIFICATION: mitigation strategy for R-NN]`), Owner (`[NEEDS CLARIFICATION: risk owner]`). |
| Dependencies | §12 Integrations + §4 Risks (for hard dependencies) | Each external dependency becomes an Integration row. If the BRD marked a dependency as Hard with a real concern, also add it to Risks. |
| Definitions & Important Details | Distributed: §6 Ecosystem Overview hints, §13/§15 per-service Business Logic & DB Modeling cues | The BRD's deep-dive section and the highest-value source for decomposition. Domain concepts often map to bounded contexts (services — DDD default). Business lifecycles map to per-service `Business Logic → State machine` and often imply domain events for the §14 event catalog. Concept structures inform per-service DB Modeling (conceptually — the schema is architect work). |
| Project Scope (In Scope / Out of Scope) | §2 Scope (In / Out) | **Reference + delta.** Link the BRD scope; state only the solution-design-level refinements (technical items in/out, phasing boundaries). BRD scope items are cited by their bullet, not restated. |
| Personas / Actors | §7.1 Actors | Each persona becomes an Actor row. Add `Type (Human / System)` classification — usually all BRD personas are Human; supplement with System actors derived from Integrations (each external system that calls in is also a System actor). |
| User Journeys (per-persona narratives) | §7.2 Use Case Diagram input + §8.4 Workflow Diagrams | Each journey seeds a workflow diagram candidate (inline Mermaid). The BRD's Summarized Workflow is the first §8.4 diagram to re-express technically. |
| Use Case Summary + Detailed UC blocks (UC-NN) | §7.2 Use Case Diagram (UC IDs only) + distributed: §15.X per-service Business Logic, API list, Event Model | Each UC keeps its ID into the SDD's use case model — **cited by ID + link, never restated**. The UC's Main Flow + Alternate/Exception Flows inform the Business Logic of the service that owns it (write the technical realisation, reference `UC-NN` for the behavioural steps); Acceptance Criteria translate to API contract notes and possibly event names (which land in the §14 catalog); exception flows seed error-handling design. **This is the heaviest derivation work** and produces partial content + many flags. |
| Users & Use Cases Matrix | §7.1 Actors (roles), §16 Centralized User Roles & Authorities, §11 Cross-Cutting Security (role model), §15.X per-service Constraints/Security notes | The authorization source of truth. Roles = personas; permissions = Yes cells (+ conditional footnotes → attribute-based rules). The matrix seeds the §16 role catalogue, capability matrix, and grant-authority table. Every service owning a UC gets the authorization note for that UC's allowed personas. Conditional footnotes ("own region only") become explicit authorization rules — flag each for the architect to place (token claim, row-level filter, etc.). |
| Integrations (BRD, business-level) | §12 Integrations (SDD) | Carry partner, purpose, information, direction, criticality. **Enrich each row with SDD-only fields**: Protocol, Data Format, Auth, Timeout, Rate Limit, Retries & Backoff, Fallback. Check the BRD's parked Technical Inputs first (the source may have stated mechanisms); each remaining field becomes `[NEEDS CLARIFICATION: ...]`. |
| Reporting / Analytics | Distributed: §15.X per-service Output (where the report is served from), §17 Performance & Capacity context | Each report becomes an Output row in the service that produces it. Reporting frequency/audience inform §17 load estimates. Analytics-style consumers often become universal subscribers in the §14 event hub. |
| Non-Functional Requirements (business language) | §17 Performance & Capacity + §11 Cross-Cutting Concerns + §8 architecture drivers | The BRD gives the what + business measure ("no more than X minutes of disruption per month"). The SDD **quantifies and realises**: translate each business measure into technical targets (availability %, latency budgets, capacity) — derive where arithmetic allows, otherwise `[NEEDS CLARIFICATION: technical target for NFR-NN]`. Security/privacy NFRs inform §11 defaults; availability/scalability NFRs are §8.1 architecture-style drivers. |
| Summary (BRD) | §1 Executive Summary closing paragraph (optional) | Often redundant; only carry if it adds a technical angle. |
| UI/UX Expectations | §11 Cross-Cutting Concerns notes (UX standards) + §6 Frontend Stack context | UX standards (error-message expectations, table/export standards, locale) inform §11 where they touch the backend (e.g., error envelope design must support plain-language messages). Frontend technology is NOT in the BRD — take it from parked Technical Inputs, CLAUDE.md defaults, or architect input. |
| Appendix § Technical Inputs for the SDD | §6 Ecosystem Overview (primary), §9 Principles, §12 Integrations enrichment, §17 targets | **Read first among technical sources.** Verbatim source mandates: named technologies → §6 rows (override CLAUDE.md defaults; shown as `BRD-mandated` / locked in the ecosystem selection flow); architecture rules → §9 Principles or §8.1; integration mechanisms → §12 enrichment; concrete technical targets → §17. Note each consumed row in the handoff. |
| Appendix (other rows) | §20 Appendix | Carry references; add SDD-specific rows (OpenAPI specs path, event schemas, ADR repo, threat model, capacity plan). |
| Wishlist | §21 Wishlist | **Reference + delta.** Link the BRD wishlist; list ONLY architectural/platform-level future enhancements the SDD adds. |
| Open Items & Clarifications (BRD chunk 13) | Input context only | Read the BRD's resolved/deferred items — deferred business decisions often become SDD risks or flags. Do not copy the section; the SDD gets its own reviewer pass (chunk 17). |
| Implementation Plan (BRD chunk 15 / `# Implementation Plan`) | Input context only | Business-level delivery order of the use cases. Its Dependency problems and `Provisional` / `Blocked` tasks often become §4 Risks or flags, and the task ordering is context when ordering §13 Services Decomposition. Never copy tasks and never treat a task as an architectural decision: the plan states the what, the SDD decides the how. |
| UAT/BAT Test Cases (BRD chunk 16 / `# UAT/BAT Test Cases`) | Input context only | Business acceptance expectations. Context for §18 Environments (UAT) and for the §17 stress-testing scenarios; technical test cases belong to the SDD, so nothing is copied. `(Provisional)` cases point at business decisions still open. |
| Product Manager To-Do (BRD chunk 14) and Presentation & Video Brief (BRD chunk 17) | Ignored | Working and presentation artifacts, not requirements. Do not read them as BRD content. |

---

## SDD-only sections (always need architect input)

These sections have no BRD analogue and always produce `[NEEDS CLARIFICATION: ...]` markers when deriving from a BRD alone:

### §6 Ecosystem Overview (partial — see CLAUDE.md fallback)

The BRD's parked Technical Inputs may pre-fill some rows. Rows the BRD typically doesn't have:

- Service Mesh / Ingress
- Caching tier
- Object Storage
- Secrets Management specifics
- API Gateway specifics
- CI/CD platform
- Observability stack specifics

For each missing row, fall back to user CLAUDE.md defaults if applicable, otherwise: `[NEEDS CLARIFICATION: <component> + version + topology]`.

### §8.1 Architecture Style

Default: microservices + EDA (event-driven async backbone) + DDD bounded contexts + hexagonal (ports & adapters) — the platform doctrine, confirmed in the ecosystem selection flow. If the BRD's technical inputs imply something else, flag: `[NEEDS CLARIFICATION: confirm architecture style — doctrine default vs source-implied alternative.]`

### §8.2 / §8.3 / §8.4 / §8.5 Diagrams

The BRD's Summarized Workflow may seed §8.4 Workflow Diagrams. Otherwise:

- §8.2 Context Diagram: derivable from Integrations + Personas → draw the Mermaid, flag for architect verification.
- §8.3 High-Level Architecture: needs architect input. `[NEEDS CLARIFICATION: layer composition, primary components, async backbone topology.]`
- §8.5 Sequence Diagrams: needs architect input per critical interaction. List each candidate sequence as `[NEEDS CLARIFICATION: sequence diagram for <flow name> — see BRD UC-NN.]`

### §10 Architectural Decisions (ADRs)

Always `[NEEDS CLARIFICATION: ...]` per intended ADR. List candidate decisions:

- Choice of architecture style (linked to §8.1).
- Choice of message broker (Kafka vs SNS+SQS vs RabbitMQ).
- Choice of multi-tenancy strategy.
- Choice of API style (REST vs gRPC vs GraphQL) per service.
- Choice of synchronous vs event-driven for cross-service calls.
- Authorization enforcement approach for the Users & Use Cases Matrix (role claims, policy engine, per-service checks).

### §11 Cross-Cutting Concerns (defaults)

Many of these have CLAUDE.md defaults — apply them and note "default per CLAUDE.md". The role model comes from the BRD's Users & Use Cases Matrix. For per-service overrides under §15.X:

`[NEEDS CLARIFICATION: any service-specific override of the default DB engine / multi-tenancy strategy / deployment strategy / observability instrumentation.]`

### §14 Centralized Event Hub

The BRD never names topics or events — this section is architect work seeded by derivation. The EDA doctrine plus UC flows imply the candidate events (state changes in UC Main Flows), and BRD integrations imply provider webhooks (which are NOT bus events). Produce: the envelope + topology skeleton with doctrine defaults (outbox, at-least-once, inbox dedup), candidate topic-per-service rows for the proposed decomposition, candidate event names per UC state change (each flagged `candidate`), and `[NEEDS CLARIFICATION: ...]` on payload contracts. The catalog firms up as the per-service Event Models are decided, then reconciles per SKILL.md Step 6a.

### §15.X per-service detailed specs

The biggest gap. From the BRD, for each service identified in §13:

- **Boundaries** — derive from UC ownership; flag for confirmation.
- **Input** — derive from Integrations and UCs (user actions, events consumed); always partial.
- **Business Logic** — derive from UC Main Flows and business rules; usually substantial but lacks state-machine detail. Flag state machines explicitly.
- **Output** — derive from UCs and Reporting; partial.
- **Integrations (per service)** — derive from system-level Integrations table; flag direction and failure handling.
- **DB Modeling** — `[NEEDS CLARIFICATION: ERD, table list, column types, constraints, indexes, retention. The BRD describes concepts conceptually but does not commit to a relational schema.]`
- **API Standards + List of APIs** — `[NEEDS CLARIFICATION: full API list in OpenAPI form. The BRD's UCs imply APIs but do not specify request/response shapes.]`
- **Event Model + Messaging Infra** — `[NEEDS CLARIFICATION: event names, producers, consumers, schema, delivery guarantee. The BRD's UCs imply async behaviour but do not commit to topic / payload structure.]` Whatever is decided must match the §14 catalog verbatim (both published and consumed tables).
- **Constraints** — derive from BRD Assumptions + UC Business Rules & Constraints + matrix authorization notes.
- **Error Handling** — seed from UC Exception Flows (what the user must experience); the technical policy (error envelope schema, retries, poison-message strategy) is `[NEEDS CLARIFICATION: ...]`.
- **Observability** — apply CLAUDE.md defaults; flag service-specific metrics.
- **Compliance** — derive from BRD Challenges and any explicit compliance language; flag GDPR/PCI/ISO applicability per service.
- **Deployment Strategy** — apply CLAUDE.md defaults; flag service-specific overrides.
- **Future Enhancements** — carry from BRD's per-UC Future Enhancements where the UC maps to this service.

### §16 Centralized User Roles & Authorities

Seeded directly from the BRD's Users & Use Cases Matrix — the strongest BRD-derivable of the platform catalogues. Personas → user types/roles; Yes cells → capabilities; conditional footnotes → attribute-based rules; invite/create UCs → the grant-authority table. Flag for the architect: permission token naming, the resolution model (where each gate is enforced), and the implementation seed.

### §17 Performance & Capacity

- §17.1 Load Estimates: derivable from BRD business measures + Reporting frequencies; partial. Flag missing year-over-year projections.
- §17.2 Throughput Targets: `[NEEDS CLARIFICATION: per-service sustained RPS, peak RPS, p50/p95/p99 latency targets. The BRD's business-language NFRs don't give per-service technical granularity.]`
- §17.3 Peak Scenarios: derive triggers from BRD NFR business expectations ("seasonal peaks of N times normal traffic") where stated; multipliers and duration usually `[NEEDS CLARIFICATION: ...]`.
- §17.4 Stress Testing Strategy: `[NEEDS CLARIFICATION: tooling, environments, scenario set, acceptance criteria, cadence.]`

### §18 Environments

`[NEEDS CLARIFICATION: per-environment data refresh policy, sizing rules, feature flag defaults, DNS naming, secrets strategy. The BRD does not specify the environment model.]`

### §19 Operations Runbook

Always entirely `[NEEDS CLARIFICATION: ...]`. The BRD never specifies operational procedures. Produce the section heading and the standard sub-sections (Restart, Clear Cache, Replay DLQ, Rotate Secrets, DB Failover, Tenant Incident Response) as empty templates with the marker.

### §22 End-to-End System Design (authored last among body sections)

Not derived from the BRD — a faithful consolidation of the completed §13/§14/§15/§16 per SKILL.md Step 6a. In a derivation skeleton, produce the section structure with counts marked `[pending reconciliation]`.

### Specs (NOT an SDD section)

The constitution-grade Specs (Mission, Tech Stack, Roadmap, Project Type) is owned by `lld-unifier` and synthesised at LLD time from the SDD body. Do not author it here.

---

## Workflow when deriving from BRD

1. **Detect the BRD form** (chunked / combined) per "Detecting BRD input form" above.
2. **Read the BRD in full.** For chunked: read all chunks in numeric order. For combined: read end-to-end. Read Appendix § Technical Inputs for the SDD and the Users & Use Cases Matrix with particular care — they are the technical and authorization contracts.
3. **Build a unified mental map.** What's the system? Who uses it and for what (personas × UCs)? What are the bounded contexts (likely services)? What technical mandates are parked? What business qualities must the design realise?
4. **Identify the service decomposition.** This is the most-important inferred decision. From UC groupings / domain concepts, propose a service list. If the mapping is clean, use it. If not, flag and ask once: "Proposed service decomposition: [list]. Confirm or revise before I generate per-service chunks?"
5. **Run the ecosystem selection flow** (SKILL.md Step 3b): parked Technical Inputs (locked), then CLAUDE.md defaults + doctrine (EDA/DDD/hexagonal), presented for accept-all or item-by-item walkthrough with BRD-evidence recommendations.
6. **Walk the field mapping table** above, filling each SDD section.
7. **Produce SDD-only section skeletons** with `[NEEDS CLARIFICATION: ...]` markers per the "SDD-only sections" list above.
8. **Draw the derivable Mermaid diagrams inline** (Context, parts of HL Architecture, Workflow per critical journey), each with a prose Summary; flag undecided diagrams as `[NEEDS CLARIFICATION: diagram pending architect input]`.
9. **Write output** per the chosen mode (chunks / combined).
10. **Reconcile contracts and author chunk 16** per SKILL.md Step 6a, then run the reviewer pass (chunk 17) and the acceptance loop.
11. **Surface a structured handoff summary**: file paths, chunk count, Mermaid diagram count, ecosystem selection outcome, count of `[NEEDS CLARIFICATION: ...]` markers grouped by section, list of service-decomposition assumptions made, list of parked Technical Inputs consumed and CLAUDE.md defaults applied.

---

## Service decomposition heuristics

The BRD almost never names "services" explicitly. Inferring the service list is the highest-value derivation step.

**Strong signals (a service likely exists):**

- A persona journey with a clear bounded-context name ("Wallet Management", "Notification Dispatch", "Billing") — or a cluster of UCs around one domain concept.
- A domain concept in §3 that owns its own business lifecycle.
- An external integration that owns a clear surface (e.g., the payment-gateway integration → likely a dedicated payment service).
- An NFR business expectation that isolates one area (e.g., "money movements are never lost or duplicated" → the ledger is its own service).

**Weak signals (might not be a service):**

- A single UC (one use case ≠ one service).
- A domain concept that's a value object (no lifecycle, no ownership).
- A reporting requirement (often consumed-from rather than owned-by a service).

**When unclear:** propose a decomposition based on bounded contexts in §3 Definitions & Important Details and the UC-to-persona groupings, and explicitly flag it as a derivation assumption in the handoff: "Proposed services: [list]. This was inferred from §3 domain concepts and UC groupings. Confirm or revise."

Default to **fewer**, larger services rather than premature micro-decomposition. Per the user's CLAUDE.md: "Reach for a modular monolith only when the bounded context is genuinely small and stable" — but also "default to microservices for new services". The tension is resolved by starting with one service per stable bounded context, not one service per use case.

---

## Concrete example

Given a brd-unifier output at `./brd-wallet-management/` containing:

- 14 chunks following the canonical BRD chunk map.
- `02-glossary-assumptions-facts.md` defining "Wallet", "Reseller", "Tenant", "Ledger".
- `03-definitions-and-domain-concepts.md` describing wallet lifecycle, reseller hierarchy, ledger anatomy (business terms).
- `04-scope-and-personas.md` with personas Tenant Admin, Reseller, Finance Operator.
- `05-user-journeys-overview.md` + `06a-use-cases-tenant-admin.md` (UC-01..04), `06b-use-cases-reseller.md` (UC-05..07), `06c-use-cases-finance-operator.md` (UC-08..09).
- `07-users-use-cases-matrix.md` — 3 personas × 9 UCs, with a footnote "own sub-resellers only" on UC-06.
- `08-integrations.md` listing Payment Gateway (collect payments/refunds), Notification partner (customer messages), Audit archive (regulatory record-keeping) — business purpose only.
- `10-nfrs.md` with business expectations: always available for payments, grows to 300 tenants, money movements never lost.
- `12-appendix-and-wishlist.md` § Technical Inputs parking the SoW's "Backend must be Java 21 / Spring Boot; PostgreSQL" mandate.

Derived SDD service decomposition (proposed, flagged for confirmation):

- **wallet-core** (owns Wallet, Ledger; absorbs UC-01..04, UC-08..09's ledger reads).
- **reseller-management** (owns Reseller hierarchy; absorbs UC-05..07; enforces the "own sub-resellers only" matrix footnote).
- **reporting-aggregator** (owns reporting projections; serves chunk 09's reports — likely a read-side service consuming events from the other two).

§6 Ecosystem Overview: Java 21 / Spring Boot and PostgreSQL from the parked Technical Inputs (source-mandated); remaining rows from CLAUDE.md defaults, each noted.

§15.1 wallet-core gets:
- Boundaries (derived from UC ownership).
- Business Logic (derived from UC-01..04 Main Flows; wallet lifecycle from §3 flagged as a state machine to formalise).
- Constraints (derived from BRD Assumptions + UC business rules + matrix authorization notes).
- DB Modeling: `[NEEDS CLARIFICATION: full ERD and tables for wallet, ledger entry, reseller-association.]`
- API list: `[NEEDS CLARIFICATION: REST endpoints with OpenAPI shapes — implied by UC-01..04 acceptance criteria but not concretely specified.]`
- Event Model: `[NEEDS CLARIFICATION: events emitted by wallet-core (e.g., wallet.created, ledger.entry.recorded). The BRD implies async behaviour but does not name events.]`

…and so on for each service.

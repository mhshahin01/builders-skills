# Chunking Strategy

The CHUNKS mode produces multiple `.md` files, one per logical template-section grouping. This file defines the canonical chunk map, when to deviate, the cross-chunk contract-consistency rules, and how merge handling works.

The chunk skeletons are embedded in this skill folder under `chunks/` — they are the authoritative source for section structure inside each chunk.

---

## Principles

1. **A chunk is a unit of reading, not a unit of storage.** Each chunk groups sections that a reader would read in one sitting.
2. **Never split by size.** Line count is irrelevant. A 30-line chunk and a 600-line chunk can both be correct.
3. **Related sections stay together.** Executive Summary + Scope + Risks all answer "what are we building and what could go wrong?" — they belong in one chunk (chunk 01).
4. **Per-service detailed specs are split by service.** This is the SDD's biggest variable — split point is `§17.X` per service. One chunk per service: `13a-service-[slug].md`, `13b-service-[slug].md`, etc.
5. **Every chunk is self-describing.** First lines are an HTML comment block identifying it.
6. **The centralized catalogues are contract registries.** Chunk 10 (event hub) owns topic names, event names, and payload contracts; chunk 12 owns roles and permission tokens. Per-service chunks conform to them verbatim — see § Contract consistency below.

---

## Canonical chunk map

| # | Filename | Embedded skeleton | Content (template sections) | Typical size |
|---|---|---|---|---|
| 00 | `00-cover-and-changelog.md` | `chunks/00-cover-and-changelog.md` | Title block (name, version, status, author, reviewers, approvers, date, related BRD), Changes Log, Table of Contents, Figures index, Tables index. | Small |
| 01 | `01-executive-summary-scope-risks.md` | `chunks/01-executive-summary-scope-risks.md` | §1 Executive Summary, §2 Scope (In/Out), §3 Assumptions, §4 Risks (with likelihood/impact/mitigation/owner), §5 Glossary. | Medium |
| 02 | `02-ecosystem-overview.md` | `chunks/02-ecosystem-overview.md` | §6 Ecosystem Overview — full platform stack table (architecture doctrine, compute, runtime, mesh, RDBMS, cache, broker, storage, IAM, secrets, gateway, CI/CD, observability, backend, frontend, BI). Plus ecosystem-level rules (EDA / DDD / hexagonal defaults, timezone, ID strategy, service auth, secrets handling). Filled via the interactive ecosystem selection flow (SKILL.md). | Medium |
| 03 | `03-users-and-use-cases.md` | `chunks/03-users-and-use-cases.md` | §7 Actors table, Use Case Diagram (inline Mermaid). | Small |
| 04 | `04-architecture-style-and-diagrams.md` | `chunks/04-architecture-style-and-diagrams.md` | §8.1 Architecture Style (What/Why/How), §8.2 Context Diagram, §8.3 High-Level Architecture Diagram (inline Mermaid). | Medium |
| 05 | `05-workflows-and-sequences.md` | `chunks/05-workflows-and-sequences.md` | §8.4 Workflow Diagrams (one per critical flow), §8.5 Sequence Diagrams (one per critical interaction) — inline Mermaid. | Medium–Large |
| 06 | `06-principles-and-decisions.md` | `chunks/06-principles-and-decisions.md` | §9 Architecture Principles table, §10 Architectural Decisions (ADR summary table). | Medium |
| 07 | `07-cross-cutting-concerns.md` | `chunks/07-cross-cutting-concerns.md` | §11 Cross-Cutting Concerns defaults: DB Modeling, Multi-Tenancy, Deployment, Observability, Configuration, Security. | Medium |
| 08 | `08-integrations.md` | `chunks/08-integrations.md` | §12 Integrations table — every external integration with protocol, mode, trigger, auth, timeout, rate limit, retries, fallback. | Small–Medium |
| 09 | `09-services-summary.md` | `chunks/09-services-summary.md` | §13 Services Decomposition summary table (one row per service). | Small |
| 10 | `10-events-hub.md` | `chunks/10-events-hub.md` | §14 Centralized Event Hub — hub topology decision (+ Mermaid), standard event envelope, topic registry, platform event catalog (per producing service), cross-cutting event guarantees, universal subscribers & doctrines, consistency notes, payload contract samples + coverage matrix. **The platform contract registry.** | Medium–Large |
| 11 | `11-api-contracts.md` | `chunks/11-api-contracts.md` | §15 Service Integration API Contracts — the API contract registry: platform conventions (URI versioning, standard headers, RFC 9457 error model and standard error codes, auth, idempotency, resilience), the contract index, one `API-NN` block per synchronous integration (endpoint, security and auth, headers, parameters, body, responses, error codes, behaviour), coverage matrix, drift register, and the external contracts awaiting the user. External contracts are `TBD - external` until the user supplies the provider documentation. **The API contract registry.** | Medium–Large |
| 12 | `12-centralized-user-roles.md` | `chunks/12-centralized-user-roles.md` | §16 Centralized User Roles & Authorities — user types, role catalogue, capability matrix, grant/invitation authority, role→services matrix, lifecycle/revocation rules, Mermaid diagrams, permission × role matrix, implementation seed & drift register. | Medium–Large |
| 13a, 13b, … | `13a-service-[slug].md` | `chunks/13a-service-detailed-template.md` | §17.X Detailed Service Spec — one chunk per service. Each chunk contains the full per-service block (Boundaries, Input, Business Logic, Output, Integrations, DB Modeling with ERD/Tables/Migrations/Retention/Archival/Encryption, Multi-tenancy specs, API standards + List of APIs, Event Model (published + consumed) + Messaging Infra, Constraints, Error Handling, Observability, Developer Notes, Service-Level Diagrams, Compliance, Deployment Strategy, Future Enhancements). | Large each |
| 14 | `14-performance-and-capacity.md` | `chunks/14-performance-and-capacity.md` | §18 Performance & Capacity (Load Estimates, Throughput Targets per service, Peak Scenarios, Stress Testing Strategy). | Medium |
| 15 | `15-environments.md` | `chunks/15-environments.md` | §19 Environments table (Dev, SIT, UAT, Prod) + per-environment specifics. | Small |
| 16 | `16-operations-runbook.md` | `chunks/16-operations-runbook.md` | §20 Operations Runbook (Common Operations procedures, Diagnostics Cheatsheet, On-Call). | Medium |
| 17 | `17-appendix-and-wishlist.md` | `chunks/17-appendix-and-wishlist.md` | §21 Appendix (BRD link, OpenAPI specs, event schemas, ADR repo, threat model, capacity plan, runbooks, diagrams source), §22 Wishlist. | Small |
| 18 | `18-open-items-and-clarifications.md` | `chunks/18-open-items-and-clarifications.md` | **Open Items & Clarifications** (§23) — output of the post-generation cleared-context reviewer pass. Architecture-level gaps, missing scenarios, ADR ambiguities, and cross-chunk contract mismatches. Each item carries options AND a concrete **Recommended Answer** with the **Why** behind it (evidence + tradeoff), ready to apply. Generated *after* the body by an independent reviewer; never authored by the same context that wrote the SDD. Followed by the user review-and-accept loop (see SKILL.md). | Small–Medium |
| 19 | `19-e2e-system-design.md` | `chunks/19-e2e-system-design.md` | §24 End-to-End System Design — service landscape, system context, layered architecture, producer→topic→consumer fan-out maps, sync REST edges, key sagas, plus normative references into §14/§16 (one fact, one home: nothing owned by chunks 10/11 is restated). All inline Mermaid. **Gated: written only after chunk 18 is cleared** (SKILL.md step 8b, conditions E1-E4); it consolidates the final reconciled and reviewed state of 09/10/11/12/13x. | Medium–Large |

Total typical chunk count: **19 + N services** (so 21–25 for a typical multi-service system; chunk 19 appears once the e2e gate opens), plus the regenerated `[project-slug]-sdd-master.md` index.

`[project-slug]-sdd-master.md` (skeleton: `chunks/sdd-master.md`) is the master index pointing at the chunks. Regenerate it per project and write it into the output folder alongside the chunks. In `parts` generation it also holds the Generation Progress table (`parts-mode.md`).

`decision-log.md` is a **companion file**, not a numbered chunk: the decision register (ecosystem selection record, clarification Q&A, decision history). Created on first use, linked from `[project-slug]-sdd-master.md`, never merged. Structure: the `decision-log.md` reference in this skill folder.

**Parts.** In `parts` generation the chunks are written in three parts: 00-09, then `13x` + 10 + 12 + 11, then 14-18 with 19 behind the e2e gate (`parts-mode.md`).

**Specs is not an SDD chunk.** The constitution-grade `Specs` (Mission, Tech Stack, Roadmap, Project Type) is owned by `lld-unifier` and lives with the LLD (`./lld-[project-slug]/17-specs.md`), synthesised from this SDD's body. Legacy SDDs may still carry a `15-specs.md` — treat it as read-only input for the LLD, not part of this template.

---

## The 13a chunk pattern (per-service detailed spec)

Section 17 of the SDD is the heaviest section — it contains a full detailed spec block for every service in the system. Each spec is roughly 200–400 lines.

In CHUNKS mode, each service gets its own file:

```
13a-service-wallet-core.md
13b-service-payment-processor.md
13c-service-notification-dispatcher.md
...
```

Naming:
- Two-character prefix (`13a`, `13b`, `13c`, …, `13z`, then `13aa`, `13ab` if you have more than 26 services — extremely unlikely).
- Slug in kebab-case, derived from the service name.
- The file `chunks/13a-service-detailed-template.md` is the **template** for any service spec — copy its structure when adding a new service.
- The chunk letter maps to the section number: `13a` → §17.1, `13b` → §17.2, …

Order: services are numbered in the order they appear in the §13 Services Decomposition summary table (chunk 09).

Stability: once the user has seen the service list, letters are never renumbered or reused. A service added later takes the next free letter and is appended to 09; a merged or removed service keeps its 09 row with its status (`Merged into [service]` / `Removed: [reason]`) and has no chunk. The §17.X number keeps following the letter (`13c` → §17.3), so a gap in §17 numbering is expected.

Reading order: summary (09) → event hub (10) → API contracts (11) → roles (12) → per-service specs (13a, 13b, …). The registries come first so each service spec reads against settled contracts; the generation order still drafts the service specs first (SKILL.md step 6).

---

## Contract consistency (chunks 10 / 11 / 12 / 13x / 19)

The key goal is a smooth implementation: the LLD and implementers must read ONE consistent contract surface. Rules:

1. **Chunk 10 is the event contract registry.** Topic names, event names, envelope fields, and payload contracts are canonical there. Every `13x` chunk's Event Model (published AND consumed tables) must match it character-for-character.
2. **Consumer lists are reconciled from both sides.** A producer's published table and every consumer's consumed table must agree. Where a producer under-lists its consumers, chunk 10 shows the reconciled set and footnotes the source.
3. **Every consumed event has exactly one producer.** An event consumed in any `13x` chunk that no service publishes is a generation error — fix it or flag it.
4. **Chunk 12 is the role/permission registry.** Role names and permission tokens in per-service authorization notes and in chunk 11's contracts must match its catalogue verbatim.
5. **Chunk 11 is the API contract registry.** Every synchronous integration has an `API-NN` there; method and URI in every `13x` List of APIs match it verbatim; headers, body, responses, and error codes live only there. External contracts stay `TBD - external` until the user supplies the provider documentation, never invented.
6. **Chunk 19 consolidates, never invents, and comes last.** Counts, names, and edges in the e2e chunk must trace to chunks 09/10/11/12/13x, and it is written only once chunk 18 is cleared (SKILL.md step 8b).
7. **Divergences are flagged, never silently reconciled.** Unresolvable mismatches land in chunk 10 §14.8 (events), chunk 11 §15.5 (APIs), or chunk 12 §16.12 (roles) with a pointer, and the reviewer pass (chunk 18) treats any remaining mismatch as a Contract mismatch OI.

Generation order that makes this cheap: draft the per-service Event Models and List of APIs → consolidate into chunk 10 → back-propagate fixes into the `13x` chunks → chunk 12 (roles) → chunk 11 (API contracts) → reconcile (SKILL.md step 6a) → review (chunk 18) → chunk 19 last, behind the e2e gate.

---

## Chunk header (mandatory)

Every chunk begins with this HTML comment block:

```markdown
<!--
CHUNK: 13a
TITLE: Service Detailed Spec — Wallet Core
PROJECT: Wallet Management Service
VERSION: 1.0
PART OF: SDD — Wallet Management Service
-->

# 17.1 Wallet Core

...
```

Heading levels inside a chunk preserve the template's numbering (`# 17.1`, `## Boundaries`, etc.) so merge handling is trivial — no demotion or promotion needed.

---

## When to deviate from the canonical map

Deviate, and note the deviation in the final handoff summary, when:

1. **A template section is genuinely empty** for this project (e.g., a backend-only system has no Frontend Stack row in Ecosystem Overview, or a single-service system has no §13 decomposition table). Keep the section, write `Not applicable for this release.`
2. **Workflow / sequence chunk explodes.** If §8.4 + §8.5 together exceed ~600 lines, split: `05a-workflows.md` and `05b-sequences.md`.
3. **The event hub explodes.** If the catalog + payload contracts together exceed ~800 lines, split into `10-events-hub.md` (§14.1–14.8: topology, envelope, topic registry, catalog, guarantees, doctrines, consistency notes) and `10-events-hub-contracts.md` (§14.9 payload contracts + coverage matrix). Both sort before `13a-…`. Note the split in the handoff summary.
4. **A single service is so complex it warrants splitting.** Rare, but if one service's detailed spec exceeds ~800 lines (large state machines, many APIs, many events), split into `13a1-service-foo-data.md` and `13a2-service-foo-events.md`. Note in the handoff summary.
5. **Operations Runbook becomes a living artefact.** If the runbook is under heavy active iteration during incidents, split: `16a-runbook-procedures.md` and `16b-runbook-diagnostics.md`.
6. **A purely synchronous system** (no eventing at all — rare under the EDA default) keeps chunk 10 with its heading and writes `Not applicable for this release; the platform has no asynchronous backbone.` plus the ADR that justified deviating from the EDA default.

Do NOT deviate to merge per-service chunks for the sake of fewer files. Per-service chunks are the most-edited files in an SDD; keeping them separate is the whole point.

---

## Skip rules (sections that are optional per the template)

- **Figures / Tables index** on the cover chunk — include an empty skeleton; populate as Mermaid figures and tables are added.
- **Optional Miro link slots** below Mermaid diagrams — only when a real board exists; never placeholder Miro links. See `mermaid-diagrams.md`.
- **Compliance sub-section per service** — include the heading; if no specific regulation applies (`GDPR`, `PCI-DSS`, `ISO 27001`), write "Not applicable for this service." Don't omit silently.
- **State machine** under Business Logic — only include if the service is genuinely stateful with named states. Stateless services don't need this sub-section.
- **Event-Driven Architecture sub-section per service** — include the heading; if the service is purely synchronous, write "Not applicable; this service does not produce or consume events." (and make sure chunk 10 lists it under consumer-only or non-participant services).

---

## Merge handling (chunks → combined)

On merge, chunks are concatenated in file-sort order: 00, 01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12, 13a, 13b, 13c, …, 14, 15, 16, 17, 18, then 19 if it exists.

Steps:

1. Strip the `<!-- CHUNK: ... -->` comment from each chunk.
2. Concatenate with a single blank line between chunks.
3. Deduplicate the repeated `# 17. Detailed Service Specs` parent heading (keep only the first).
4. Regenerate the Table of Contents in chunk 00 against the merged heading outline.
5. Regenerate the Figures and Tables indices.
6. Check the §17.X service blocks follow chunk-letter order (13a → §17.1, 13b → §17.2, …). Keep the letter-to-number mapping; do not close gaps left by merged or removed services.
7. Write to `SDD-[ProjectName]-v[X.X]-MERGED.md` alongside the chunks.
8. Never include `[project-slug]-sdd-master.md` or `decision-log.md` in the merged file.

Original chunks are kept.

---

## Re-chunk handling (combined → chunks)

When asked to split a combined SDD into chunks:

1. Read the combined file fully.
2. Identify section boundaries by `# 1.`, `# 2.`, … headings.
3. Group sections per the chunk map.
4. **Section 17 needs special handling**: identify each `## 17.X` block and split into a separate chunk file `13a-service-[slug].md`, `13b-service-[slug].md`, …
5. For each chunk, prepend the `<!-- CHUNK: ... -->` comment block.
6. Heading levels stay as-is (the template uses absolute numbering like `# 1.`, `## 1.1`, so no demotion is needed).
7. Write each chunk file.
8. Keep the original combined file.
9. **Legacy combined SDDs** (pre-restructure: §13.1/§13.2.X services, §14 performance, §19 Specs, §20 Open Items) are renumbered into the current map during re-chunking; a Specs section is NOT carried into the SDD chunks — hand it to the LLD folder (or flag it) per the Specs note above.

---

## Earlier chunk map (before API contracts)

SDDs written with the earlier map use `10a…` service chunks (§15), `11` roles (§16), `12`-`15` performance to appendix (§17-§21), `16-e2e-system-design.md` (§22), and `17-open-items-and-clarifications.md` (§23), with no API contracts chunk. On a resume, targeted update, or re-chunk of such a folder:

1. Rename the files to the current map (`10x` → `13x`, 11 → 12, 12-15 → 14-17, 17 → 18, 16-e2e → 19-e2e), renumber the headings and `§` references (§15 → §17, §17-§21 → §18-§22, §22 → §24), and repoint the `MASTER:` / PREV / NEXT footers. This is not a content change.
2. Create `11-api-contracts.md` from the skeleton: add an `API-NN` block for every synchronous integration already described in chunks 08 and `13x`, mark external ones `TBD - external`, and flag gaps. Record the migration in the Changes Log.
3. The existing e2e chunk becomes `Stale` and is refreshed through SKILL.md step 8b, gate included.

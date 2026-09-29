# Chunking Strategy

The CHUNKS shape produces multiple `.md` files, one per logical template-section grouping. This file defines the canonical chunk map, the per-service split rules, and how merge / re-chunk handling works.

The chunk skeletons are embedded in this skill folder under `chunks/` — they are the authoritative source for section structure inside each chunk.

---

## Principles

1. **A chunk is a unit of reading, not a unit of storage.** Each chunk groups sections that a reader (or AI implementer) would consume together.
2. **Never split by size.** Line count is irrelevant. A 60-line chunk and a 600-line chunk can both be correct.
3. **Per-service implementation chunks are the load-bearing split.** Each service has its own file at `04-implementation/<service-slug>.md` so an implementer can focus on one service without bouncing.
4. **Cross-service sagas live with the orchestrator service.** Choreography-style sagas are documented per-step in each participating service's file (with cross-references).
5. **Frontend chunk is conditional.** `14-frontend.md` is only generated when the LLD scope has a UI surface. Otherwise it is omitted (not stubbed).
6. **Every chunk is self-describing.** First lines are an HTML comment block identifying it.

---

## Canonical chunk map

| # | Filename | Embedded skeleton | Content (template sections) | Typical size |
|---|---|---|---|---|
| — | `[project-slug]-lld-master.md` | `chunks/lld-master.md` | Master index — links to all chunks; reading order tables; cross-doc nav; the Related SDD line sdd-unifier finds this LLD by. Regenerated per project. | Small |
| 00 | `00-metadata.md` | `chunks/00-metadata.md` | Title block, mode, version, status, author, reviewers, approvers, date, Related BRD(s) (each with its key from the SDD's Source BRDs register), Related SDD (its master), source code path, Changes Log, confidence flag summary. | Small |
| 01 | `01-purpose-and-scope.md` | `chunks/01-purpose-and-scope.md` | §1 Purpose, §2 Scope, §3 Assumptions, §4 Glossary. | Small |
| 02 | `02-context.md` | `chunks/02-context.md` | §5 Context — bounded context, upstream / downstream, cross-service dependency diagram, shared conventions. | Small |
| 03 | `03-architecture.md` | `chunks/03-architecture.md` | §6 Architecture overview — component topology (Mermaid), deployment topology, runtime stack, architectural style as operationalised. | Medium |
| 04 | `04-implementation/<service>.md` | `chunks/04-implementation-template.md` | §7 Per-service implementation. **One chunk per service** (the load-bearing split). Contains: responsibility, class & interface map, method pseudocode, design patterns applied, DI graph, transaction boundaries, error handling, use-case workflows (one `### KEY/UC-NN: Title` block with its traceability line per owned use case). | Large each |
| 05 | `05-data-model.md` | `chunks/05-data-model.md` | §8 Data model — ERD, tables, indexes, multi-tenancy strategy, Flyway plan, retention, encryption. | Medium |
| 06 | `06-api-contracts.md` | `chunks/06-api-contracts.md` | §9 API contracts — endpoint inventory, request/response, auth, pagination, OpenAPI snippets. | Medium |
| 07 | `07-event-contracts.md` | `chunks/07-event-contracts.md` | §10 Event contracts — Kafka topic inventory, schemas, producer/consumer specs, DLQ strategy. | Medium |
| 08 | `08-state-and-rules.md` | `chunks/08-state-and-rules.md` | §11 State machines, cross-service business rules, algorithm pseudocode. | Small–Medium |
| 09 | `09-cross-cutting.md` | `chunks/09-cross-cutting.md` | §12 Cross-cutting — auth/tenant, idempotency, Resilience4j defaults, outbox, saga, RFC 9457 errors, logging, tracing (with the `use_case` attribute), config, health. | Medium |
| 10 | `10-operations.md` | `chunks/10-operations.md` | §13 Operations — config, health, RED metrics, logs, tracing, dashboards, alerts, runbook procedures, on-call. | Medium |
| 11 | `11-security.md` | `chunks/11-security.md` | §14 Security — data classification, PII inventory, secrets, auth decisions, threat notes, compliance. | Small–Medium |
| 12 | `12-performance.md` | `chunks/12-performance.md` | §15 Performance — SLOs, caching, hot-path indexes, bulkheads, peak scenarios, load test. | Small–Medium |
| 13 | `13-testing.md` | `chunks/13-testing.md` | §16 Testing — pyramid, unit, integration (Testcontainers), contract, e2e (Playwright), data strategy, CI gates, e2e spec traceability (specs tagged with use case and test case IDs). | Small |
| 14 | `14-frontend.md` | `chunks/14-frontend.md` | §17 Frontend (CONDITIONAL — Angular module/component tree, signals/store, routing with each route's BRD screen and use cases, PrimeNG, i18n, RTL, a11y). | Small–Medium |
| 15 | `15-open-questions.md` | `chunks/15-open-questions.md` | §18 Open questions, drift index, confidence flag index, decisions pending. | Small (grows with iteration) |
| 16 | `16-references.md` | `chunks/16-references.md` | §19 References — source documents (with the upstream state the use-case trace was built from), ADRs, OpenAPI, event schemas, runbooks, threat model, externals, and the use-case traceability index (§19.9, the production-bug entry point). | Small–Medium |
| 17 | `17-specs.md` | `chunks/17-specs.md` | **Specs** (§20) — constitution-grade summary (Mission, Tech Stack, Roadmap, Project Type), **owned by this skill**, authored AFTER the LLD body. Synthesised from the source SDD (Mission ← SDD §1, Tech Stack ← SDD §6 verbatim with version pins, Roadmap ← SDD §13 + BRD UC ownership) plus the Project Type from intake. Direct input for speckit `/constitution`. Legacy chains carried it at the SDD (`15-specs.md`) or BRD (`12-specs.md`) — consume those as input, author this as canonical. | Small |
| 18 | `18-open-items-and-clarifications.md` | `chunks/18-open-items-and-clarifications.md` | **Open Items & Clarifications** — output of the post-generation cleared-context reviewer pass. Implementation-level gaps, missing edge cases, pattern misapplications, error path concerns. Each item carries options. Generated *after* the body by an independent reviewer. Complements (does not replace) chunk 15, which is the author-generated index of inline `> Confirm:` / `> TODO:` flags. | Small–Medium |

Total typical chunk count: **19 + N services - 1 (if no UI)** ≈ **20–24 for a typical 3-service system with UI**.

`[project-slug]-lld-master.md` (skeleton: `chunks/lld-master.md`) is the master index pointing at the chunks. Regenerate it per project.

**Use-case traceability (from-sdd and hybrid).** Every BRD ID keeps the key from the SDD's Source BRDs register, so use cases from different BRDs never collide. Each active use case gets one workflow block in its owner's `04-implementation/<service>.md`; 14 §17.3 maps routes to its screens, 13 §16.8 tags e2e specs with its test cases, and 09 §12.8 names it at runtime (`use_case`). The index in 16 §19.9 is a consolidated view: it reads each column from its home and states nothing its homes do not state. SKILL.md step 6a checks it in both directions, together with every link and anchor (`sdd-to-lld.md` § Use-case traceability).

---

## The per-service split (chunk 04)

Section §7 of the LLD is the heaviest section — it contains a full implementation deep-dive for every service in the system. Each spec is roughly 300–600 lines.

In CHUNKS shape, each service gets its own file inside the `04-implementation/` folder:

```
04-implementation/
├── wallet-core.md
├── payment-processor.md
├── notification-dispatcher.md
└── ...
```

**Naming:**

- Folder: `04-implementation/` (always — even for single-service projects, for consistency).
- Filename: `<service-slug>.md` (kebab-case derived from service name).
- The file `chunks/04-implementation-template.md` is the **template** for any service spec — copy its structure when adding a new service.

**Order:** services are listed alphabetically by slug in `[project-slug]-lld-master.md`. The order does not imply hierarchy.

**Cross-service sagas:** the saga narrative lives in the orchestrator service's file. Other participating services have a brief cross-reference (`> Participates in saga SAGA-NN — see 04-implementation/<orchestrator>.md`) plus their own step detail.

---

## Chunk header (mandatory)

Every chunk begins with this HTML comment block:

```markdown
<!--
CHUNK: 04
TITLE: Per-Service Implementation - [Service Name]
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: 03, 09
PART OF: LLD - [Project Name]
-->

# 7. Per-Service Implementation - [Service Name]

...
```

Heading levels inside a chunk preserve the template's numbering (`# 7.`, `## 7.1`, etc.) so merge handling is trivial — no demotion or promotion needed.

---

## When to deviate from the canonical map

Deviate, and note the deviation in the final handoff summary, when:

1. **A template section is genuinely empty** for this project (e.g., no UI → omit `14-frontend.md` entirely; no events → keep `07-event-contracts.md` but write `Not applicable; this project is purely synchronous.`)
2. **A single service is so complex it warrants splitting.** Rare. If one service's file exceeds ~1000 lines, split into `04-implementation/<service>-data.md` and `04-implementation/<service>-events.md`. Note in the handoff.
3. **Operations runbook becomes a living artefact.** If the runbook is under heavy active iteration, split: `10a-operations-procedures.md` and `10b-operations-diagnostics.md`.

Do NOT deviate to merge per-service chunks. Per-service chunks are the most-edited files in an LLD; keeping them separate is the whole point.

---

## Skip rules (sections that are conditional / optional)

- **`14-frontend.md`** — omit when no UI exists. Do not stub.
- **State machine subsection per service** — only include if the service is genuinely stateful with named states. Stateless services don't need this sub-section.
- **Cross-service saga subsection** — only include in the orchestrator's file. Choreography sagas don't need a central narrative; they live as sequence steps in each service's workflows.
- **PII inventory rows** — only include if PII actually exists. Empty PII inventory is itself a meaningful answer; mark "No PII handled by this LLD's services."

---

## Merge handling (chunks → combined)

On merge, chunks are concatenated in numeric order: 00, 01, 02, 03, 04 (per-service: alphabetical), 05, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15, 16, 17, 18.

Steps:

1. Strip each chunk's `<!-- CHUNK: ... -->` HTML comment block.
2. Concatenate with a single blank line between chunks.
3. For chunk 04, concatenate the per-service files in alphabetical order; each becomes a `## 7.N <Service Name>` block.
4. Renumber `## 7.N` headings sequentially after concatenation.
5. Regenerate the section ToC in chunk 00 metadata.
6. Write to `./LLD-[ProjectName]-v[X.X]-MERGED.md` alongside the chunks.
7. Keep the original chunks.

---

## Re-chunk handling (combined → chunks)

When asked to split a combined LLD into chunks:

1. Read the combined file fully.
2. Identify section boundaries by `# 1.`, `# 2.`, … headings.
3. Group sections per the canonical chunk map.
4. **Section §7 needs special handling:** identify each `## 7.N <Service Name>` block and split into a separate file `04-implementation/<service-slug>.md`.
5. For each chunk, prepend the `<!-- CHUNK: ... -->` comment block.
6. Heading levels stay as-is.
7. Write each chunk file.
8. Keep the original combined file.

---

## Targeted regeneration

When the user asks to update a specific chunk or service:

- "Regenerate the data model" → rewrite `05-data-model.md` only; bump the LLD version.
- "Update the wallet-core service" → rewrite `04-implementation/wallet-core.md` only; bump the LLD version; cross-check `08-state-and-rules.md` for related state-machine changes.
- "Re-run from-code on the now-built service Y" → re-dispatch agents on Y; rewrite `04-implementation/Y.md`; remove the `> TODO: not yet built` placeholder from any other place where Y was referenced.
- "Refresh the trace", or an upstream change (BRD chunk 16 written, screens or mockups changed, SDD §7.3 changed, a new BRD or BRD version) → rewrite only what `sdd-to-lld.md` § Use-case traceability › Refresh triggers names (the 04 lines, 14 § 17.3, 13 § 16.8, 16 § 19.1 and § 19.9); rerun SKILL.md step 6a; bump the LLD version.

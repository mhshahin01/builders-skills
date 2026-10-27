# Chunking Strategy

The CHUNKS mode produces multiple `.md` files, one per logical template-section grouping. This file defines the canonical chunk map, the per-service split rules, and how merge / re-chunk handling works.

The chunk skeletons are embedded in this skill folder under `chunks/`: they are the authoritative source for section structure inside each chunk.

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
| - | `[project-slug]-lld-master.md` | `chunks/lld-master.md` | Master index: links to all chunks; reading order tables; cross-doc nav; the Related SDD line sdd-unifier finds this LLD by. Regenerated per project. | Small |
| 00 | `00-metadata.md` | `chunks/00-metadata.md` | Title block, direction, version, status, author, reviewers, approvers, date, Related BRD(s) (each with its key from the SDD's Source BRDs register), Related SDD (its master), source code path, Changes Log, confidence flag summary. | Small |
| 01 | `01-purpose-and-scope.md` | `chunks/01-purpose-and-scope.md` | §1 Purpose, §2 Scope, §3 Assumptions, §4 Glossary. | Small |
| 02 | `02-context.md` | `chunks/02-context.md` | §5 Context: bounded context, upstream / downstream, cross-service dependency diagram, shared conventions. | Small |
| 03 | `03-architecture.md` | `chunks/03-architecture.md` | §6 Architecture overview: component topology (Mermaid), deployment topology, runtime stack, architectural style as operationalised. | Medium |
| 03a | `03a-libraries-and-conventions.md` | `chunks/03a-libraries-and-conventions.md` | §6.5 Libraries & Coding Conventions, a continuation of §6 with no `# 6.` heading of its own: §6.5.1 libraries by concern (each row `Approved` or `Proposed - needs approval`), §6.5.2 coding conventions, §6.5.3 per-service deltas. Service files and chunks 09, 13, and 14 cite its rows. An LLD written before it existed has none. | Medium |
| 04 | `04-implementation/<service>.md` | `chunks/04-implementation-template.md` | §7 Per-service implementation. **One chunk per service** (the load-bearing split). Contains: responsibility, class & interface map, method pseudocode, design patterns applied, DI graph, transaction boundaries, error handling, use-case workflows (one `### KEY/UC-NN: Title` block with its traceability line per owned use case). | Large each |
| 05 | `05-data-model.md` | `chunks/05-data-model.md` | §8 Data model: ERD, tables, indexes, multi-tenancy strategy, Flyway plan, retention, encryption. | Medium |
| 06 | `06-api-contracts.md` | `chunks/06-api-contracts.md` | §9 API contracts: endpoint inventory (with each endpoint's SDD §15 `API-NN`), a complete block per endpoint and port (request, responses, errors, idempotency, auth), pagination, OpenAPI snippets, in-process port contracts (§9.6, modular monolith only). | Large |
| 07 | `07-event-contracts.md` | `chunks/07-event-contracts.md` | §10 Event contracts: broker topic inventory, schemas, producer/consumer specs, DLQ strategy (integration events), in-process domain events (§10.6, modular monolith only). | Medium |
| 08 | `08-state-and-rules.md` | `chunks/08-state-and-rules.md` | §11 State machines, cross-service business rules, algorithm pseudocode. | Small to Medium |
| 09 | `09-cross-cutting.md` | `chunks/09-cross-cutting.md` | §12 Cross-cutting: auth/tenant, idempotency, Resilience4j defaults, outbox, saga, RFC 9457 errors, logging, tracing (with the `use_case` attribute), config, health. | Medium |
| 10 | `10-operations.md` | `chunks/10-operations.md` | §13 Operations: config, health, RED metrics, logs, tracing, dashboards, alerts, runbook procedures, on-call. | Medium |
| 11 | `11-security.md` | `chunks/11-security.md` | §14 Security: data classification, PII inventory, secrets, auth decisions, threat notes, compliance. | Small to Medium |
| 12 | `12-performance.md` | `chunks/12-performance.md` | §15 Performance: SLOs, caching, hot-path indexes, bulkheads, peak scenarios, load test. | Small to Medium |
| 13 | `13-testing.md` | `chunks/13-testing.md` | §16 Testing: pyramid, unit, integration (Testcontainers), contract, e2e (Playwright), data strategy, CI gates, e2e spec traceability (specs tagged with use case and test case IDs). | Small |
| 14 | `14-frontend.md` | `chunks/14-frontend.md` | §17 Frontend (CONDITIONAL: Angular module/component tree, signals/store, routing with each route's BRD screen and use cases, PrimeNG, i18n, RTL, a11y). | Small to Medium |
| 15 | `15-open-questions.md` | `chunks/15-open-questions.md` | §18 Open questions, drift index, confidence flag index, decisions pending, confidence summary, policy findings. | Small (grows with iteration) |
| 16 | `16-references.md` | `chunks/16-references.md` | §19 References: source documents (with the upstream state the use-case trace was built from), ADRs, OpenAPI, event schemas, runbooks, threat model, externals, and the use-case traceability index (§19.9, the production-bug entry point). | Small to Medium |
| 17 | `17-specs.md` | `chunks/17-specs.md` | **Specs** (§20): constitution-grade summary (Mission, Tech Stack, Roadmap, Project Type), **owned by this skill**, authored AFTER the LLD body. Synthesised from the source SDD (Mission ← SDD §1, Tech Stack ← SDD §6 verbatim with version pins as the stack approval settled it, Roadmap ← SDD §13 + BRD UC ownership) plus the Project Type from intake. Direct input for speckit `/constitution`. Legacy chains carried it at the SDD (`15-specs.md`) or BRD (`12-specs.md`): consume those as input, author this as canonical. | Small |
| 18 | `18-open-items-and-clarifications.md` | `chunks/18-open-items-and-clarifications.md` | **Open Items & Clarifications**: output of the post-generation cleared-context reviewer pass. Implementation-level gaps, missing edge cases, pattern misapplications, error path concerns. Each item carries options. Generated *after* the body by an independent reviewer. Complements (does not replace) chunk 15, which is the author-generated index of inline `> Confirm:` / `> TODO:` flags. | Small to Medium |
| 19 | `19-for-ppt.md` | `chunks/19-for-ppt.md` | **Implementation Deck Brief** (derived chunk, not an LLD section): a presentation brief of the implementation design for a deck-generating agent. After a title slide, seven focus areas (clean code practices, code architecture, API statistics, API contracts, database design, database practices, and integrations and failover), then key decisions and open points, and next steps. **Written only on request, after chunk 18 is cleared** (SKILL.md step 7c). **Excluded from merge and combined output** (what else it stays outside: SKILL.md step 7c item 7). Rules: `deck-brief-rules.md`. | Medium |

Total typical chunk count: **20 + N services - 1 (if no UI)** ≈ **21 to 25 for a typical 3-service system with UI**. Chunk 19 (the deck brief) is not counted: it exists only after a request (SKILL.md step 7c).

`[project-slug]-lld-master.md` (skeleton: `chunks/lld-master.md`) is the master index pointing at the chunks. Regenerate it per project.

`decision-log.md` is a **companion file**, not a numbered chunk: the decision log (the stack approval and its overrides, the clarification answers, the delegations, the decision history). It lives in `./lld-[project-slug]/` next to the master, is created on first use, is linked from `[project-slug]-lld-master.md`, and is never merged. Structure and rules: the `decision-log.md` reference in this skill folder.

`19-for-ppt.md` is a **derived chunk**, not an LLD section: a presentation brief of the finished LLD, written only on request once chunk 18 is cleared (SKILL.md step 7c). It cites chunks 00 to 18 and the decision log by link, reads the SDD §15.2 where an API statistic needs it, and adds no requirement and no design. Its header says `MERGE: Excluded`; everything else it stays outside (the version rules and the Changes Log) is stated once, in SKILL.md step 7c item 7. Rules: `deck-brief-rules.md`.

**Use-case traceability (from-sdd, hybrid, and from-code with an SDD).** Every BRD ID keeps the key from the SDD's Source BRDs register, so use cases from different BRDs never collide. Each active use case gets one workflow block in its owner's `04-implementation/<service>.md`; 14 §17.3 maps routes to its screens, 13 §16.8 tags e2e specs with its test cases, and 09 §12.8 names it at runtime (`use_case`). The index in 16 §19.9 is a consolidated view: it reads each column from its home and states nothing its homes do not state. SKILL.md step 6a checks it in both directions, together with every link and anchor (`sdd-to-lld.md` § Use-case traceability).

---

## The per-service split (chunk 04)

Section §7 of the LLD is the heaviest section: it contains a full implementation deep-dive for every service in the system. Each spec is roughly 300 to 600 lines.

In CHUNKS mode, each service gets its own file inside the `04-implementation/` folder:

```
04-implementation/
├── wallet-core.md
├── payment-processor.md
├── notification-dispatcher.md
└── ...
```

**Naming:**

- Folder: `04-implementation/` (always, even for single-service projects, for consistency).
- Filename: `<service-slug>.md` (kebab-case derived from service name).
- The file `chunks/04-implementation-template.md` is the **template** for any service spec: copy its structure when adding a new service.

**Order:** services are listed alphabetically by slug in `[project-slug]-lld-master.md`. The order does not imply hierarchy.

**Modules:** in a modular monolith or hybrid core, each SDD §13 row of Type `module` gets its own file here, exactly like a service (`sdd-to-lld.md` field mapping).

**Cross-service sagas:** the saga narrative lives in the orchestrator service's file. Other participating services have a brief cross-reference (`> Participates in saga SAGA-NN - see 04-implementation/<orchestrator>.md`) plus their own step detail.

---

## Chunk header (mandatory)

Every chunk begins with this HTML comment block:

```markdown
<!--
CHUNK: 04
TITLE: Per-Service Implementation - [Service Name]
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: 03, 03a, 09
PART OF: LLD - [Project Name]
-->

# 7. Per-Service Implementation - [Service Name]

...
```

Heading levels inside a chunk follow the template's numbering (`# 7.`, `## 7.1`, etc.). Most chunks keep their headings when merged; the per-service files, the Specs chunk, and the Open Items chunk change level or number (§ Heading map).

---

## When to deviate from the canonical map

Deviate, and note the deviation in the final handoff summary, when:

1. **A template section is genuinely empty** for this project (e.g., no UI → omit `14-frontend.md` entirely; no events → keep `07-event-contracts.md` but write `Not applicable; this project is purely synchronous.`)
2. **A single service is so complex it warrants splitting.** Rare. If one service's file exceeds ~1000 lines, split into `04-implementation/<service>-data.md` and `04-implementation/<service>-events.md`. Note in the handoff.
3. **Operations runbook becomes a living artefact.** If the runbook is under heavy active iteration, split: `10a-operations-procedures.md` and `10b-operations-diagnostics.md`.

Do NOT deviate to merge per-service chunks. Per-service chunks are the most-edited files in an LLD; keeping them separate is the whole point.

---

## Skip rules (sections that are conditional / optional)

- **`14-frontend.md`**: omit when no UI exists. Do not stub.
- **State machine subsection per service**: only include if the service is genuinely stateful with named states. Stateless services don't need this sub-section.
- **Cross-service saga subsection**: only include in the orchestrator's file. Choreography sagas don't need a central narrative; they live as sequence steps in each service's workflows.
- **PII inventory rows**: only include if PII actually exists. Empty PII inventory is itself a meaningful answer; mark "No PII handled by this LLD's services."

---

## Heading map (chunks ↔ combined)

Conversion is reversible: merge applies this map, and re-chunk applies it backwards. A heading not listed keeps its level and number.

| Chunks | Combined |
|---|---|
| `03a-libraries-and-conventions.md`: `## 6.5 Libraries & Coding Conventions`; `### 6.5.1 Libraries by Concern`; `### 6.5.2 Coding Conventions (Clean Code)`; `### 6.5.3 Per-Service Deltas` | The same headings, unchanged, after `## 6.4` under the one `# 6. Architecture Overview` |
| `04-implementation/<service>.md`: `# 7. Per-Service Implementation - [Service Name]` | `## 7.N [Service Name]`, under one `# 7. Per-Service Implementation` |
| In a service file: `## 7.K [Title]` (7.1 Responsibility … 7.8 Use-Case Workflows) | `### [Title]`: the number is dropped; on re-chunk, K is the title's position in the template |
| In a service file: every `###` heading (`### Controllers`, `### Pattern: Outbox`, `### KEY/UC-NN: Title`, `### Participates in …`) | The same text one level deeper (`####`) |
| `17-specs.md`: `# Specs`; `## 1. Mission` … `## 4. Project Type` | `# 20. Specs`; `## 20.1 Mission` … `## 20.4 Project Type` |
| `18-open-items-and-clarifications.md`: `# Open Items & Clarifications`; `## How to read each item`; `## Open Items`; `## Resolution Log`; `## Reviewer Notes` | `# 21. Open Items & Clarifications`; `## 21.1 How to read each item`; `## 21.2 Open Items`; `## 21.3 Resolution Log`; `## 21.4 Reviewer Notes` |
| `### OI-NN: …` | Unchanged |
| None: chunks navigate through the master index | `## Table of Contents` after the Changes Log, combined only: built on merge, dropped on re-chunk |

**Links.** Every relative link is written from the location of the file that holds it (`sdd-to-lld.md` § The link, rule 2): `../` from a chunk or a merged file (both sit in `lld-[project-slug]/`), `../../` from a service file, `./` from a combined LLD at the project root. On merge (§ Merge handling, step 5), a link to a file outside the LLD keeps working: as it is from a chunk, with one `../` dropped from a service file. A link between two LLD chunks becomes a same-file anchor (`./refund-service.md#refundsuc-04-approve--reject-refund` → `#refundsuc-04-approve--reject-refund`). On re-chunk, each link to a file outside the LLD is rebased from the combined file's location to the chunk or service file that now holds it, and each same-file anchor between chunks becomes a file link again. Recompute each anchor from the heading as it stands in the target file: a heading repeated across services in the combined file (`### Responsibility`) takes GitHub's `-1`, `-2`, … suffixes in document order. `decision-log.md` is never merged, so for these link rules it is a file outside the LLD: a link to it is rebased like any other, on merge and on re-chunk alike, and never becomes a same-file anchor.

**Navigation.** The master index and the chunk footers (`<!-- MASTER: … | PREV: … | NEXT: … -->`) exist only in chunks: drop them on merge and rebuild them on re-chunk (master: `[project-slug]-lld-master.md`). The combined file's `## Table of Contents` exists only in the combined file: regenerate it on merge and drop it on re-chunk.

---

## Merge handling (chunks → combined)

On merge, chunks are concatenated in numeric order: 00, 01, 02, 03, 03a, 04 (per-service: alphabetical), 05, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15, 16, 17, 18. `decision-log.md` is not a chunk and is never merged: the merged file holds the design, and the log keeps the decision history. Chunk 19 (`19-for-ppt.md`) is never merged either: skip every chunk whose header says `MERGE: Excluded`. It stays a separate file next to the merged one, and its links to the chunk files keep working because the chunks are kept.

Steps:

1. Strip each chunk's `<!-- CHUNK: ... -->` HTML comment block and its footer.
2. Concatenate with a single blank line between chunks. Chunk 03a follows chunk 03 and continues §6: its `## 6.5` comes after `## 6.4`, under the one `# 6. Architecture Overview`. An LLD without 03a merges without it.
3. For chunk 04, write `# 7. Per-Service Implementation` once, then each per-service file in alphabetical order as a `## 7.N <Service Name>` block, numbered in that order, with its headings mapped per § Heading map.
4. Map the Specs and Open Items headings to §20 and §21 (§ Heading map).
5. Keep links to files outside the LLD working (a link from a service file drops one `../`), turn links between LLD chunks into same-file anchors, and recompute anchors (§ Heading map, Links).
6. Regenerate the combined file's `## Table of Contents` after the Changes Log.
7. Write to `./lld-[project-slug]/LLD-[ProjectName]-v[X.X]-MERGED.md`, next to the chunks, so their links to files outside the LLD keep working (step 5). A merged file an earlier run wrote at the project root stays where it is; new merges go inside the folder.
8. Keep the original chunks.

---

## Re-chunk handling (combined → chunks)

When asked to split a combined LLD into chunks:

1. Read the combined file fully.
2. Identify section boundaries by `# 1.`, `# 2.`, … headings.
3. Group sections per the canonical chunk map. Section §6 splits at `## 6.5`: `## 6.1` to `## 6.4` go to `03-architecture.md`, and `## 6.5` with its sub-sections goes to `03a-libraries-and-conventions.md`. A combined LLD with no `## 6.5` writes no 03a.
4. **Section §7 needs special handling:** split each `## 7.N <Service Name>` block into `04-implementation/<service-slug>.md` and map its headings back (§ Heading map): the block heading becomes `# 7. Per-Service Implementation - <Service Name>`, each `### [Title]` becomes `## 7.K [Title]`, and each `####` becomes `###`.
5. Map §20 and §21 back to the Specs and Open Items chunks (§ Heading map).
6. Rebase links and recompute anchors (§ Heading map).
7. For each chunk, prepend the `<!-- CHUNK: ... -->` comment block and append its footer. Its VERSION is the combined file's version for chunk 00, and for any other chunk the version of the newest Changes Log row whose `Chunks:` list names it or one of its sections (a per-service file: its own §7.N service block), else the version of the earliest Changes Log row; when no row has a `Chunks:` list (an LLD older than that rule), the combined file's version, noted in the handoff (SKILL.md § Output conventions). Write the master `[project-slug]-lld-master.md`, which replaces the combined `## Table of Contents` (dropped). Its **Deck brief (chunk 19):** line reads the state on the status line of `./lld-[project-slug]/19-for-ppt.md` when that file exists, else `Locked - not written; <reason>`, the reason being the open items of chunk 18, or "not requested" when it is cleared.
8. Write each chunk file.
9. Keep the original combined file. Keep `19-for-ppt.md` where it is if it exists (combined mode wrote it into `./lld-[project-slug]/`), and repoint its links from the combined file to the new chunk files, as step 6 rebases anchors. Re-point the `Rule home:` links of `decision-log.md` the same way (a link change, bumps nothing).

---

## Targeted regeneration

When the user asks to update a specific chunk or service, the request is one update with one version bump, even when it runs several of the rewrites below (SKILL.md § Output conventions, Versions):

- "Regenerate the data model" → rewrite `05-data-model.md` only; bump the LLD version.
- "Update the libraries" or "change a convention" → rewrite `03a-libraries-and-conventions.md` and every chunk that cites a changed row (chunks 09, 13, and 14, and the `04-implementation/<service>.md` files that use the library), as SKILL.md step 9 says for a changed stack row (a library row goes through the stack approval, SKILL.md step 3a); bump the LLD version.
- "Update the wallet-core service" → rewrite `04-implementation/wallet-core.md` only; bump the LLD version; cross-check `08-state-and-rules.md` for related state-machine changes.
- "Re-run from-code on the now-built service Y" → re-dispatch agents on Y; rewrite `04-implementation/Y.md`; remove the not-yet-built placeholder from any other place where Y was referenced.
- "Refresh the trace", or an upstream change the user names or SKILL.md step 3c finds (BRD chunk 16 written, screens or mockups changed, SDD §7.3 changed, a new BRD or BRD version) → rewrite only what `sdd-to-lld.md` § Use-case traceability › Refresh triggers names (the 04 lines, 14 § 17.3, 13 § 16.8, 16 § 19.1 and § 19.9, and the chunk 18 items and flags the change answers); rerun SKILL.md step 6a; bump the LLD version.
- "The SDD has a new version", or SKILL.md step 3c finds one → update only the LLD chunks mapped (`sdd-to-lld.md` § Field mapping table; how far: § Use-case traceability › Refresh triggers) from the SDD chunks its Changes Log rows list since the version in 16 § 19.1 (SKILL.md step 3c), plus 16 § 19.1, this LLD's Child LLDs row in the SDD, and the chunk 18 items and flags the change answers (`sdd-to-lld.md` § Use-case traceability › Refresh triggers); rerun SKILL.md step 6a when the trace applies, and step 6b when a changed SDD chunk feeds the Specs (§1, §6, §13); bump the LLD version.
- "Make the deck brief" or "refresh the deck" → SKILL.md step 7c, gated by chunk 18: write or rewrite `19-for-ppt.md` only, and the master's Deck brief line; no version bump and no Changes Log row. With chunk 18 not cleared nothing is written: the state reads `Locked` (`Stale` when the chunk exists) and the open items are listed.

Any rewrite above that changes a chunk `19-for-ppt.md` cites also marks an existing chunk 19 `Stale`, by its own rule (SKILL.md step 7c item 5).

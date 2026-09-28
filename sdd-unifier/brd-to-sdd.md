# BRD → SDD Derivation

This file defines how to derive a Solution Design Document from a Business Requirements Document. It is the bit specific to `sdd-unifier` — it does not exist in `brd-unifier`.

The workflow shape is **SoW → BRD(s) → SDD → LLD(s)**. An SDD derives from one or more BRDs (its parents), and one or more LLDs may derive from it (its children). This file covers the BRD → SDD step specifically.

---

## One fact, one home (no duplication)

Every fact has exactly one owning document and section. The SDD **references** BRD content — it never restates it:

1. **Reference + delta, never copy.** Business content (glossary terms, scope items, assumptions, wishlist, UC flows) stays in the BRD. The SDD section links to the owning BRD chunk (`../brd-[project-slug]/NN-....md` § heading, with the BRD key in the link text, e.g. `[REFUNDS 02 § Glossary](...)`) and adds ONLY its own delta: new technical terms, solution-level scope refinements, technical assumptions, architectural wishlist items.
2. **Reference UCs by ID.** Per-service Business Logic cites `KEY/UC-NN` (with the link) for the behavioural contract and writes only the technical realisation — never a restated Main Flow. BRD keys: § Source BRDs and lineage. The link format and where each use case is traced: § Use-case traceability.
3. **Derived views declare their source.** Sections that consolidate (Actors from personas, §16 roles from the matrix, §18 targets from NFRs) are views, not copies: they transform to a different altitude and name the source row/UC they derive from.
4. **Scalar facts live once.** Counts, versions, dates, and targets are stated in their owning section and referenced elsewhere — a restated number is a drift bug waiting to happen.
5. **Restated upstream content is a review defect.** The reviewer flags it as Type `Duplication` with the reference-based rewrite as the Recommended Answer.
6. **Standalone export is the only exception.** When the user explicitly asks for a self-contained SDD for an external party (vendor, formal review), the merge step MAY inline the referenced BRD sections — marked `> Inlined from BRD §X for standalone distribution` so the owning home stays clear.

---

## Source BRDs and lineage

An SDD has one or more parent BRDs and zero or more child LLDs. Both are listed in chunk 00 § Document Lineage (in COMBINED mode, in the cover section). The master points there instead of repeating them.

### Source BRDs (parents)

| Key | BRD | Version | Link | Covers |
|---|---|---|---|---|
| REFUNDS | Refunds Portal | 1.0 | [refunds-portal-brd-master.md](../brd-refunds-portal/refunds-portal-brd-master.md) | Refund requests, decisions, and payouts |

1. **One row per source BRD**, in the order the user gave them. Every BRD must be finished: a BRD whose master shows a part `Pending` or `In progress` stops the derivation (§ Detecting BRD input form); name the BRD and the missing part.
2. **Key.** A short name for the BRD, in capitals, taken from its project name: one or two words joined by a hyphen, for example `REFUNDS`, `WALLET`, `RESELLER-PORTAL`. Unique within the SDD. Propose the keys in one line before part 1; once the user has seen them they never change and are never reused.
3. **Every BRD reference carries its key, even when there is only one BRD:** `[REFUNDS/UC-04](...)`, `REFUNDS/NFR-02`, `REFUNDS/TI-01`, and chunk references such as `[REFUNDS 10 § NFRs](...)`. SDD-owned IDs (`API-NN`, `ADR-NN`, `AP-NN`, `INT-NN`, `OI-NN`, risk IDs) carry no key.
4. **Version.** The BRD version the SDD was derived from, or last reconciled against. A newer BRD version is a targeted update (§ Changes after the SDD exists).
5. **Link.** The BRD's master file (chunked BRD) or its combined file. Every link into that BRD starts from the same location.

### Child LLDs (children)

| LLD | Scope (§13 services) | Direction | Version | Link |
|---|---|---|---|---|
| Refunds Core | refund-service, payout-service | from-sdd | 1.0 | [refunds-core-lld-master.md](../lld-refunds-core/refunds-core-lld-master.md) |

1. **Written by lld-unifier.** When lld-unifier derives an LLD from this SDD (from-sdd or hybrid), it adds its own row, or updates it on a later run, matched by the Link. That row is the only thing another skill writes into the SDD.
2. **Checked by sdd-unifier** on every run on an existing SDD (resume, targeted update, e2e refresh, handoff): each Link resolves and each scope service is a row in §13. A sibling `lld-*` folder whose master file (the `*lld-master.md` in that folder) has a **Related SDD** line linking to this SDD's master, but has no row, gets one; its Link points at that master file. A row whose LLD is gone, or whose scope names a merged or removed service, stays and gets a `[NEEDS CLARIFICATION: ...]`; it is never deleted silently.
3. **Before any LLD exists**, the table has one row: `None yet`.
4. **A use case reaches its LLD through its owner:** the §7.3 Owner, then the Child LLDs row whose scope names that service.

### Cross-BRD reconciliation (two or more BRDs)

Read every source BRD in full before writing anything, then check them against each other before the architecture questionnaire. Nothing is resolved silently:

| Overlap | Rule |
|---|---|
| The same persona in two BRDs | One actor only if it is the same role; its §7.1 Description names the personas it unifies (`REFUNDS Customer, WALLET Wallet Holder`). Same name but a different role: two actors. |
| The same term with two meanings | A §5 Glossary row per meaning, each citing its BRD, plus a `[NEEDS CLARIFICATION: ...]`. |
| The same partner | One §12 row that cites each BRD's integration row. |
| Different measures for the same quality | A §18 target per scope (per BRD or per service), or a `[NEEDS CLARIFICATION: ...]`. |
| Conflicting technical mandates | Not locked. Asked right after this reconciliation, before the architecture questionnaire (one question per conflict, both sources shown), so the questionnaire and the ecosystem selection build on the answer. Recommend, in this order: an option that meets both BRDs (for example, scoping each mandate to the services that realise its BRD, when the architecture gives each service its own store); otherwise the option that matches the CLAUDE.md defaults, with the other mandate as the alternative and its tradeoff; otherwise no recommendation, saying why. The choice becomes an ADR and a `decision-log.md` entry, and the ecosystem selection shows the row as decided. |
| A dependency between BRDs (one BRD's rule needs another BRD's data or event, such as points taken back when a purchase is refunded) | The realisation is designed like any cross-service flow (§8.4, events, API contracts) and cites both BRDs; a gap in how the data reaches the other side is a `[NEEDS CLARIFICATION: ...]` and a §4 risk. |
| The same behaviour in two use cases | Each keeps its own §7.3 row (the same owner and entry point are allowed), and the overlap becomes an open item for the BRD owners. The SDD never merges BRD use cases. |
| Conflicting drivers (one BRD an MVP, another at scale) | The architecture questionnaire recommends the walkthrough and names the conflict (SKILL.md step 3b). |

### Changes after the SDD exists

| Request | What the skill does |
|---|---|
| "Add BRD <path>" | Register it (a new key, shown to the user) and read it in full. Run the cross-BRD reconciliation, then derive the delta: its use cases get owner services (existing or new) and §7.3 rows; its integrations, qualities, and mandates go through the rules above. Rerun step 6a, mark chunk 19 `Stale`, and bump the version with a Changes Log row. |
| "BRD <KEY> has a new version" | Update the register's Version, then apply what changed in the BRD: new use cases get owners and rows; rows now `Merged into` or `Removed` change status; a re-titled use case gets its new title and anchor; changed rules, integrations, and qualities flow to their sections. Same step 6a rerun, `Stale` marking, and version bump. |

---

## Use-case traceability (UC-NN links)

These rules apply when the SDD's source BRDs are brd-unifier output. Legacy BRDs with `FR-NN` blocks follow the same rules, with `FR-NN` in place of `UC-NN`. For an SDD with no source BRD, §7.3 keeps its heading and reads `Not applicable - no source BRD.`, and the rest of this section does not apply.

### The link

Every use case the SDD cites is a Markdown link, keyed by its BRD, to that use case's heading in the BRD:

`[REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)`

1. **File.** The BRD file that holds the use case's heading (`## UC-04: ...` in a chunked BRD, `#### UC-04: ...` in a combined one). Find it by reading the BRD, never from a file-name pattern: a small BRD may hold its use cases in `05-user-journeys-and-use-cases.md`.
2. **Path.** Relative from the SDD file to that BRD's location in the Source BRDs register. SDD chunks and a merged SDD sit in `./sdd-[project-slug]/`, so a sibling chunked BRD is `../brd-[project-slug]/...` and a sibling combined BRD is `../BRD-[ProjectName]-v[X.X].md`. A combined SDD sits next to those folders, so the same targets are `./brd-[project-slug]/...` and `./BRD-[ProjectName]-v[X.X].md`.
3. **Anchor.** Built from the heading text with GitHub's rules: lowercase it, drop every character that is not a letter, digit, space, hyphen, or underscore, and turn each space into a hyphen. Hyphens are never merged: `UC-04: Approve / Reject Refund` gives `#uc-04-approve--reject-refund`. Build it from the heading in the BRD file, never from a title in a table.
4. **Parts of a use case.** After the link, name the part with brd-unifier's citation grammar: `step 5` (Main Flow step), `A1` or `E2` (alternate or exception flow), `BR-2` (2nd business rule), `AC-3` (3rd acceptance criterion). Example: `[REFUNDS/UC-04](...) E1`.
5. **Merged or removed use cases.** A use case the BRD Use Case Summary marks `Merged into UC-NN` or `Removed: [reason]` has no detailed block. Link it to the BRD Use Case Summary: `05-user-journeys-overview.md#use-case-summary`.
6. **Diagrams.** Inside Mermaid blocks a use case is the plain keyed ID in a quoted label (`UC04(("REFUNDS/UC-04"))`), with no link. The links live in the text around the diagram and in §7.3.
7. **The IDs belong to the BRD.** The SDD cites them exactly as the BRD writes them, behind the BRD's key. It never renumbers a use case, never reuses an ID, and never creates one. Behaviour the design needs that no BRD use case covers is a `Missing scenario` open item (chunk 18), not a new `UC-NN`. Platform behaviour with no business use case (for example, key rotation) carries no UC reference.
8. **Links inside the SDD.** In §7.3, the owner service links to its `13x` chunk and a flow links to its §8.4 or §8.5 heading in chunk 05. In COMBINED mode these are anchors to the headings in the same file.

### Where the use cases are cited

| Chunk and place | What it cites | Role |
|---|---|---|
| 09 §13, column `Use cases (BRD)` | The BRD use cases the service owns | Home of ownership. Every active use case has exactly one owner service. |
| 05 §8.4 and §8.5, a `**Use cases:**` line under each diagram heading | The use cases the diagram shows, or `None - platform flow` | Home of flow coverage |
| `13x` List of APIs | Nothing new: its method and path are the entry points §7.3 names | Home of entry points |
| `13x` Business Logic and Error Handling | Each owned use case with the part it realises (`step 5`, `A1`, `E1`, `BR-2`, `AC-3`) | The technical realisation. Never a restated Main Flow. |
| 10 §14.5, the "when" in "what · when · why" | The use case step that fires the event | Home of use case to event |
| 11 §15.2 `Use case ref` and each contract's Purpose | The use case the call serves | Home of use case to API contract |
| 12 §16.10 Source | The use case or BRD matrix row a capability traces to | Home of use case to capability |
| 19 §24.8, a `**Use cases:**` line under each saga | The use cases the saga realises | A view. Traces to §7.3. |
| 03 §7.3 | All of the above, one row per BRD use case | The consolidated view (below) |

### §7.3 Use Case Traceability

One row per BRD use case, including the rows a BRD marks `Merged into` or `Removed`. Rows are grouped by source BRD, in the order of the Source BRDs register, under a group row that names the BRD (data source) with its version and a link to its master, for example `| **[Refunds Portal v1.0](../brd-refunds-portal/refunds-portal-brd-master.md) (REFUNDS)** | | | | | | | |`. Inside a group, rows follow that BRD's Use Case Summary. It is a consolidated view: every column is read from its home, and it never states a mapping that its home does not state.

| Column | Read from | Content |
|---|---|---|
| Use case (BRD) | BRD Use Case Summary | `[KEY/UC-NN](link)` |
| Title | BRD Use Case Summary | The short title, exactly as the BRD writes it |
| Owner (§17.X) | 09 `Use cases (BRD)` | The owner service, linked to its `13x` chunk once that chunk exists (plain text before) |
| Entry points | `13x` List of APIs | Method and path exactly as that list writes them, with the service named when it is not the owner; or the trigger (`Schedule: [name]`, `Event: [EVENT_NAME]`) |
| Flows (§8.4 / §8.5) | 05 `**Use cases:**` lines | Links to the workflow and sequence headings, or `-` |
| APIs (§15) | 11 §15.2 `Use case ref` | The `API-NN` IDs, or `-` |
| Events (§14) | 10 §14.5 "when" | The event names, or `-` |
| Status | BRD Use Case Summary | `Active`, `Merged into UC-NN`, or `Removed` |

- **Parts.** Part 1 writes every row with Use case, Title, Owner, Flows, and Status. Entry points, APIs, and Events read `Pending (part 2)` until part 2 fills them, right after chunk 11 and before step 6a. A `whole` run and COMBINED mode fill every column in one pass.
- **Gaps are markers, never blanks.** An active use case with no owner or no entry point gets `[NEEDS CLARIFICATION: ...]` in that cell, for example `[NEEDS CLARIFICATION: owner service for REFUNDS/UC-07]`. These markers keep the e2e gate shut (SKILL.md step 8b, E3). Flows, APIs, and Events may be `-`.
- **Merged or removed rows** show `-` in every mapping column.

### Checks

SKILL.md step 6a runs these checks; the parts exit checklists and the handoff report them.

1. Every use case of every source BRD has exactly one §7.3 row, under its BRD's group, with its title and status as the BRD states them. No row cites an ID its BRD does not have.
2. Every active use case has exactly one owner in 09 (or a marker in its Owner cell), and every use case in a 09 `Use cases (BRD)` cell has its §7.3 row naming that service.
3. The owner service's `13x` Business Logic cites every use case it owns.
4. Each entry point exists, exactly as written, in the List of APIs of the service it names. Flows match the 05 `**Use cases:**` lines, APIs match §15.2, and Events match the §14.5 citations, in both directions.
5. Every UC link resolves: the file exists at that relative path, and the anchor equals the one built from the real heading in that file.
6. Every BRD reference in the SDD carries a key from the Source BRDs register, and its link points into that BRD's location.

### SDDs derived before these rules

An SDD derived from a brd-unifier BRD that has no § Document Lineage or no §7.3 was written before these rules. On its next resume or targeted update, do what was asked, then offer once to add them: the Source BRDs register with a key for its BRD, the key on every BRD reference, the Child LLDs table, the 09 column, §7.3, the `**Use cases:**` lines, and links on the existing UC references. If the user accepts, it is a content change (version bump and a Changes Log row). Never add it without asking.

---

## What the BRD gives you (read this BEFORE walking the field mapping)

Each BRD (`brd-unifier` output) is **business-language only** — it states the WHAT. Everything technical is this skill's job. With several source BRDs, every input below is read from each of them and cited with its BRD key. The BRD's load-bearing inputs for derivation:

| BRD input | Where it lives | How it steers the SDD |
|---|---|---|
| **User journeys & use cases (UC-NN)** | Chunked: `05-user-journeys-overview.md` + `06a-use-cases-[persona].md`, `06b-…`; combined: `# User Journeys & Use Cases` | The core behavioural contract. Each UC has an actor, detailed Main Flow steps, alternate/exception flows, business rules, and acceptance criteria. UCs seed §7.2 Use Case Diagram, drive service decomposition (each gets one owner service in §13), fill per-service Business Logic, and are traced one row each in §7.3 (§ Use-case traceability). |
| **Users & Use Cases Matrix** | Chunked: `07-users-use-cases-matrix.md`; combined: `# Users & Use Cases Matrix` | The authorization contract: persona × UC with Yes/- cells and conditional footnotes. Seeds §7.1 Actors, the §16 Centralized User Roles & Authorities catalogue, per-service authorization notes in §17.X Security/Constraints, and role definitions in §11 Cross-Cutting Security. |
| **Technical Inputs for the SDD** | Chunked: `12-appendix-and-wishlist.md` § Technical Inputs; combined: `# Appendix` § Technical Inputs | Source technical mandates parked **verbatim** by brd-unifier (named technologies, protocols, architecture rules, concrete technical targets). Highest-fidelity technical signal: seeds §6 Ecosystem Overview and **overrides CLAUDE.md defaults** where they conflict. May be absent — then CLAUDE.md defaults + architect input carry §6. |
| **Business-language NFRs** | Chunked: `10-nfrs.md`; combined: `# Non-Functional Requirements` | The BRD states the what ("highly available", "handles seasonal peaks") with business measures. The SDD **quantifies** each into technical targets (§18) and realisation decisions (§8, §11) — every quantification the BRD doesn't imply is `[NEEDS CLARIFICATION: ...]` or an architect ask. NFRs are also evidence for the ecosystem selection recommendations (SKILL.md Step 3b). |
| **Business-level integrations** | Chunked: `08-integrations.md`; combined: `# Integrations` | Partner, purpose, information exchanged, direction, criticality. The SDD **enriches** each row with protocol, format, auth, timeout, retries, fallback (§12) — all SDD-only fields. |

**Legacy BRDs (pre-restructure template):** older BRDs may carry a `Specs` section (`12-specs.md` / `# Specs`) and/or a `Technical Implementation Expectations` section, and FR-NN blocks instead of UC-NN. Consume them: Specs.Tech Stack / Technical Implementation Expectations rows go verbatim into §6 (they override CLAUDE.md defaults); Specs.Roadmap informs §13 phasing; Specs.Project Type answers the intake question; FR blocks map like UC blocks (the `How` plays the role of the Main Flow). Note "legacy BRD sections consumed" in the handoff summary. The Specs section is **owned by `lld-unifier` now** — it is never authored into the SDD, regardless of whether the BRD had one.

---

## What derivation is, and is not

**Derivation IS:**

- Reading the BRD in full.
- Auto-filling SDD sections that have direct BRD analogues (Glossary, Personas → Actors, Integrations, Scope, NFRs context).
- Producing an SDD skeleton with all section headings present, in template order.
- Flagging SDD-only sections (Architecture Style, ADRs, Cross-cutting overrides per service, Operations Runbook procedures) with `[NEEDS CLARIFICATION: ...]` markers naming the specific decision needed.
- Taking the architecture style from the architecture questionnaire (SKILL.md step 3b), then falling back to user CLAUDE.md defaults for the stack, adapted to that style (Java 21, Spring Boot 3.5+, PostgreSQL 17+, UUIDv7, Kafka, Keycloak, Angular 17+ standalone) for the Ecosystem Overview when the BRD's parked technical inputs don't override — always confirmed through the ecosystem selection flow (SKILL.md Step 3b).

**Derivation IS NOT:**

- Inventing technical decisions the architect hasn't made.
- Producing per-service detailed specs from use cases alone. UCs describe behaviour; per-service detailed specs describe implementation choices (DB schema, API list, event model). The leap requires architect input.
- Fabricating performance numbers from business-language NFRs. Business measures carry over as context; the technical targets in §14 need architect input or explicit derivation flags.
- A finished SDD. The output is an architect-ready skeleton.

---

## Detecting BRD input form

Each source BRD arrives in one of two forms; detect each one on its own:

### Chunked form (brd-unifier output)

The user points the skill at a folder. Recognise it by:

- Folder path matches `brd-*/` (kebab-case slug after `brd-`).
- Contains 14+ files with names like `00-cover-and-changelog.md`, `01-executive-summary-and-context.md`, `02-glossary-assumptions-facts.md`, `03-definitions-and-domain-concepts.md`, `04-scope-and-personas.md`, `05-user-journeys-overview.md`, `06a-use-cases-*.md` (one or more), `07-users-use-cases-matrix.md`, `08-integrations.md`, `09-reporting-and-analytics.md`, `10-nfrs.md`, `11-summary-and-uiux.md`, `12-appendix-and-wishlist.md`, `13-open-items-and-clarifications.md`. Newer BRDs also carry delivery chunks: `14-todo.md` always, and `15-implementation.md`, `16-uat-bat-test-cases.md`, `17-for-ppt.md` only once the BRD's to-do has been fully cleared (see the reading order below for how each is treated). (Legacy chunked BRDs use `05-fr-overview.md`, `06a-fr-*.md`, `07-integrations.md`, `10-summary-uiux-tech.md`, `12-specs.md` — same logical reading order.)
- Each file begins with `<!-- CHUNK: NN ... PART OF: BRD — ... -->`.

**Reading order:** numeric (00, 01, 02, 03, 03a, 03b, 04, 05, 06a, 06b, 06c, 07, 08, 09, 10, 11, 12, 13). Multi-letter chunks (`06a`, `06b`) are read alphabetically within their numeric prefix.

**Unfinished BRD.** If `[project-slug]-brd-master.md` shows a generation part that is `Pending` or `In progress` (brd-unifier writes BRDs in parts), the BRD is not finished. Stop, tell the user which part is missing, and do not derive an SDD from it.

**Delivery chunks (14-17) are not BRD requirements.** They are derived from chunks 00-13 by `brd-unifier` and never add a requirement:

- **Skip** `14-todo.md` (product-manager checklist) and `17-for-ppt.md` (presentation and video brief) entirely. They are also never part of a merged or combined BRD.
- Read `15-implementation.md` and `16-uat-bat-test-cases.md` **as input context only**, after chunk 13, when they exist (see the field mapping table). They are absent until the BRD's to-do is cleared; their absence is not a gap. In a combined or merged BRD they are the `# Implementation Plan` section and the `# UAT/BAT Test Cases` section (in a merged file the second heading carries the project name: `# [Project Name] - UAT/BAT Test Cases`).
- Read 15 and 16 as current only when `[project-slug]-brd-master.md` shows them `Up to date`. A `Stale` or `Provisional` one is read with care and named in the handoff.
- If a delivery chunk and the BRD body disagree, the body wins; note the discrepancy in the handoff.

A legacy unnumbered `uat-bat-test-cases.md` in a BRD folder gets the same treatment as chunk 16.

**The BRD decision register (`decision-log.md`) is not a BRD requirement.** It is brd-unifier's decision history. Do not map it into any SDD section and do not import its narration. Read it only to understand why a BRD rule exists when that matters for a design choice (for example, to write the context of an ADR); the rule itself is always cited from the BRD chunk that is its `Rule home`. The SDD keeps its own `decision-log.md` for SDD decisions.

**Treat each BRD as one logical BRD.** Do not produce one SDD per chunk. Read all chunks of every source BRD first, build one unified mental map, then write one SDD.

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
| Cover & Changelog | §0 Cover & Changelog (regenerated) | New SDD has its own version (v1.0). Fill § Document Lineage: one Source BRDs row per BRD (key, name, version, link to its master or combined file, what it covers) and the Child LLDs table (`None yet`). New Changes Log entry: "Initial SDD draft, derived from [KEY] v[X.X] (and [KEY] v[X.X]) via sdd-unifier." |
| Executive Summary (BRD) | §1 Executive Summary (SDD) | Recast as **technical** summary. Drop business framing; lead with what the system *is technically*, the architecture style at a glance (placeholder if undecided), and the key technology pillars. The BRD's exec summary becomes input, not output — and later distils into the LLD's Specs Mission (lld-unifier reads §1 for it). |
| Background and Context / Problem Statement | §1 Executive Summary context paragraph | Optional — only carry if it informs technical decisions. Otherwise leave to the Related-BRD link in the cover. |
| Business Objectives | §1 Executive Summary "Key technical bets and trade-offs" | Translate each business objective into a technical implication (e.g., "300+ tenants by Y2" → "horizontal scalability is a primary NFR; multi-tenancy strategy is a critical decision"). |
| Glossary | §5 Glossary | **Reference + delta.** One line linking the BRD glossary (`../brd-[slug]/02-glossary-assumptions-facts.md`), then ONLY new SDD-specific technical terms (architecture style names, infra components). Business terms are not restated. |
| Assumptions / Constraints | §3 Assumptions | **Reference + delta.** Link the BRD assumptions; list ONLY new technical assumptions. A BRD assumption that is really a risk becomes a §4 Risk row referencing the BRD assumption by number. |
| Facts | Distributed: §1 Executive Summary, §6 Ecosystem Overview, §8.1 Architecture Style.Why | Facts often carry technical implications. Classify each into the section it most informs. |
| Challenges | §4 Risks | Convert each challenge to a risk row: assign Likelihood (L/M/H), Impact (L/M/H), Mitigation (paraphrase from BRD if stated; otherwise `[NEEDS CLARIFICATION: mitigation strategy for R-NN]`), Owner (`[NEEDS CLARIFICATION: risk owner]`). |
| Dependencies | §12 Integrations + §4 Risks (for hard dependencies) | Each external dependency becomes an Integration row. If the BRD marked a dependency as Hard with a real concern, also add it to Risks. |
| Definitions & Important Details | Distributed: §6 Ecosystem Overview hints, §13/§17 per-service Business Logic & DB Modeling cues | The BRD's deep-dive section and the highest-value source for decomposition. Domain concepts often map to bounded contexts (services — DDD default). Business lifecycles map to per-service `Business Logic → State machine` and often imply domain events for the §14 event catalog. Concept structures inform per-service DB Modeling (conceptually — the schema is architect work). |
| Project Scope (In Scope / Out of Scope) | §2 Scope (In / Out) | **Reference + delta.** Link the BRD scope; state only the solution-design-level refinements (technical items in/out, phasing boundaries). BRD scope items are cited by their bullet, not restated. |
| Personas / Actors | §7.1 Actors | Each persona becomes an Actor row. Add `Type (Human / System)` classification — usually all BRD personas are Human; supplement with System actors derived from Integrations (each external system that calls in is also a System actor). |
| User Journeys (per-persona narratives) | §7.2 Use Case Diagram input + §8.4 Workflow Diagrams | Each journey seeds a workflow diagram candidate (inline Mermaid). The BRD's Summarized Workflow is the first §8.4 diagram to re-express technically. |
| Use Case Summary + Detailed UC blocks (UC-NN) | §7.2 Use Case Diagram (UC IDs only) + §7.3 Use Case Traceability (one row per UC) + §13 `Use cases (BRD)` column (owner service) + distributed: §17.X per-service Business Logic, API list, Event Model | Each UC keeps its ID into the SDD's use case model — **cited by ID + link, never restated** (link format and tracing rules: § Use-case traceability). The UC's Main Flow + Alternate/Exception Flows inform the Business Logic of the service that owns it (write the technical realisation, reference `UC-NN` for the behavioural steps); Acceptance Criteria translate to API contract notes and possibly event names (which land in the §14 catalog); exception flows seed error-handling design. **This is the heaviest derivation work** and produces partial content + many flags. |
| Users & Use Cases Matrix | §7.1 Actors (roles), §16 Centralized User Roles & Authorities, §11 Cross-Cutting Security (role model), §17.X per-service Constraints/Security notes | The authorization source of truth. Roles = personas; permissions = Yes cells (+ conditional footnotes → attribute-based rules). The matrix seeds the §16 role catalogue, capability matrix, and grant-authority table. Every service owning a UC gets the authorization note for that UC's allowed personas. Conditional footnotes ("own region only") become explicit authorization rules — flag each for the architect to place (token claim, row-level filter, etc.). |
| Integrations (BRD, business-level) | §12 Integrations (SDD) | Carry partner, purpose, information, direction, criticality. **Enrich each row with SDD-only fields**: Protocol, Data Format, Auth, Timeout, Rate Limit, Retries & Backoff, Fallback. Check the BRD's parked Technical Inputs first (the source may have stated mechanisms); each remaining field becomes `[NEEDS CLARIFICATION: ...]`. |
| Integrations (BRD, business-level) | §15 Service Integration API Contracts | Every integration the BRD names that is called synchronously gets an `API-NN` contract. The BRD names the partner and purpose only, so an external partner's contract is `TBD - external` with a `[TBD - EXTERNAL: ...]` marker (URI, headers, body, error codes, auth) for the user to complete from the provider's documentation. Internal service-to-service contracts are designed by the architect or flagged. Never invent a provider's API. |
| Reporting / Analytics | Distributed: §17.X per-service Output (where the report is served from), §18 Performance & Capacity context | Each report becomes an Output row in the service that produces it. Reporting frequency/audience inform §18 load estimates. Analytics-style consumers often become universal subscribers in the §14 event hub. |
| Non-Functional Requirements (business language) | §18 Performance & Capacity + §11 Cross-Cutting Concerns + §8 architecture drivers | The BRD gives the what + business measure ("no more than X minutes of disruption per month"). The SDD **quantifies and realises**: translate each business measure into technical targets (availability %, latency budgets, capacity) — derive where arithmetic allows, otherwise `[NEEDS CLARIFICATION: technical target for NFR-NN]`. Security/privacy NFRs inform §11 defaults; availability/scalability NFRs are §8.1 architecture-style drivers. |
| Summary (BRD) | §1 Executive Summary closing paragraph (optional) | Often redundant; only carry if it adds a technical angle. |
| UI/UX Expectations | §11 Cross-Cutting Concerns notes (UX standards) + §6 Frontend Stack context | UX standards (error-message expectations, table/export standards, locale) inform §11 where they touch the backend (e.g., error envelope design must support plain-language messages). Frontend technology is NOT in the BRD — take it from parked Technical Inputs, CLAUDE.md defaults, or architect input. |
| Appendix § Technical Inputs for the SDD | §6 Ecosystem Overview (primary), §9 Principles, §12 Integrations enrichment, §18 targets | **Read first among technical sources.** Verbatim source mandates: named technologies → §6 rows (override CLAUDE.md defaults; shown as `BRD-mandated` / locked in the ecosystem selection flow); architecture rules → §9 Principles or §8.1; integration mechanisms → §12 enrichment; concrete technical targets → §18. Note each consumed row in the handoff. |
| Appendix (other rows) | §21 Appendix | Carry references; add SDD-specific rows (OpenAPI specs path, event schemas, ADR repo, threat model, capacity plan). |
| Wishlist | §22 Wishlist | **Reference + delta.** Link the BRD wishlist; list ONLY architectural/platform-level future enhancements the SDD adds. |
| Open Items & Clarifications (BRD chunk 13) | Input context only | Read the BRD's resolved/deferred items — deferred business decisions often become SDD risks or flags. Do not copy the section; the SDD gets its own reviewer pass (chunk 17). |
| Implementation Plan (BRD chunk 15 / `# Implementation Plan`) | Input context only | Business-level delivery order of the use cases. Its Dependency problems and `Provisional` / `Blocked` tasks often become §4 Risks or flags, and the task ordering is context when ordering §13 Services Decomposition. Never copy tasks and never treat a task as an architectural decision: the plan states the what, the SDD decides the how. |
| UAT/BAT Test Cases (BRD chunk 16 / `# UAT/BAT Test Cases`) | Input context only | Business acceptance expectations. Context for §19 Environments (UAT) and for the §18 stress-testing scenarios; technical test cases belong to the SDD, so nothing is copied. `(Provisional)` cases point at business decisions still open. |
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
- §8.5 Sequence Diagrams: needs architect input per critical interaction. List each candidate sequence under its own heading with its `**Use cases:**` line, and the body `[NEEDS CLARIFICATION: sequence diagram for <flow name> - see the use cases above.]`

### §10 Architectural Decisions (ADRs)

Always `[NEEDS CLARIFICATION: ...]` per intended ADR. List candidate decisions:

- Choice of architecture style (linked to §8.1).
- Choice of message broker (Kafka vs SNS+SQS vs RabbitMQ).
- Choice of multi-tenancy strategy.
- Choice of API style (REST vs gRPC vs GraphQL) per service.
- Choice of synchronous vs event-driven for cross-service calls.
- Authorization enforcement approach for the Users & Use Cases Matrix (role claims, policy engine, per-service checks).

### §11 Cross-Cutting Concerns (defaults)

Many of these have CLAUDE.md defaults — apply them and note "default per CLAUDE.md". The role model comes from the BRD's Users & Use Cases Matrix. For per-service overrides under §17.X:

`[NEEDS CLARIFICATION: any service-specific override of the default DB engine / multi-tenancy strategy / deployment strategy / observability instrumentation.]`

### §14 Centralized Event Hub

The BRD never names topics or events — this section is architect work seeded by derivation. The EDA doctrine plus UC flows imply the candidate events (state changes in UC Main Flows), and BRD integrations imply provider webhooks (which are NOT bus events). Produce: the envelope + topology skeleton with doctrine defaults (outbox, at-least-once, inbox dedup), candidate topic-per-service rows for the proposed decomposition, candidate event names per UC state change (each flagged `candidate`), and `[NEEDS CLARIFICATION: ...]` on payload contracts. The catalog firms up as the per-service Event Models are decided, then reconciles per SKILL.md Step 6a.

### §17.X per-service detailed specs

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
- **Error Handling** — seed from UC Exception Flows (what the user must experience), each cited as `[KEY/UC-NN](link) E1`; the technical policy (error envelope schema, retries, poison-message strategy) is `[NEEDS CLARIFICATION: ...]`.
- **Observability** — apply CLAUDE.md defaults; flag service-specific metrics.
- **Compliance** — derive from BRD Challenges and any explicit compliance language; flag GDPR/PCI/ISO applicability per service.
- **Deployment Strategy** — apply CLAUDE.md defaults; flag service-specific overrides.
- **Future Enhancements** — carry from BRD's per-UC Future Enhancements where the UC maps to this service.

### §16 Centralized User Roles & Authorities

Seeded directly from the BRD's Users & Use Cases Matrix — the strongest BRD-derivable of the platform catalogues. Personas → user types/roles; Yes cells → capabilities; conditional footnotes → attribute-based rules; invite/create UCs → the grant-authority table. Flag for the architect: permission token naming, the resolution model (where each gate is enforced), and the implementation seed.

### §18 Performance & Capacity

- §18.1 Load Estimates: derivable from BRD business measures + Reporting frequencies; partial. Flag missing year-over-year projections.
- §18.2 Throughput Targets: `[NEEDS CLARIFICATION: per-service sustained RPS, peak RPS, p50/p95/p99 latency targets. The BRD's business-language NFRs don't give per-service technical granularity.]`
- §18.3 Peak Scenarios: derive triggers from BRD NFR business expectations ("seasonal peaks of N times normal traffic") where stated; multipliers and duration usually `[NEEDS CLARIFICATION: ...]`.
- §18.4 Stress Testing Strategy: `[NEEDS CLARIFICATION: tooling, environments, scenario set, acceptance criteria, cadence.]`

### §19 Environments

`[NEEDS CLARIFICATION: per-environment data refresh policy, sizing rules, feature flag defaults, DNS naming, secrets strategy. The BRD does not specify the environment model.]`

### §20 Operations Runbook

Always entirely `[NEEDS CLARIFICATION: ...]`. The BRD never specifies operational procedures. Produce the section heading and the standard sub-sections (Restart, Clear Cache, Replay DLQ, Rotate Secrets, DB Failover, Tenant Incident Response) as empty templates with the marker.

### §24 End-to-End System Design (gated: written only after §23 is cleared)

Not derived from the BRD — a faithful consolidation of the completed §13/§14/§15/§16/§17, written only through SKILL.md step 8b once the open items (§23) are cleared. A derivation skeleton full of clarification markers keeps the gate shut, so this section is normally absent from a first derivation; the handoff says so.

### Specs (NOT an SDD section)

The constitution-grade Specs (Mission, Tech Stack, Roadmap, Project Type) is owned by `lld-unifier` and synthesised at LLD time from the SDD body. Do not author it here.

---

## Workflow when deriving from BRD

1. **Detect each BRD's form** (chunked / combined) per "Detecting BRD input form" above, and propose a key for each BRD (§ Source BRDs and lineage).
2. **Read every BRD in full.** For chunked: read all chunks in numeric order. For combined: read end-to-end. Read Appendix § Technical Inputs for the SDD and the Users & Use Cases Matrix with particular care — they are the technical and authorization contracts. With two or more BRDs, run the cross-BRD reconciliation (§ Source BRDs and lineage) before going on.
3. **Build a unified mental map.** What's the system? Who uses it and for what (personas × UCs, across every BRD)? What are the bounded contexts (likely services)? What technical mandates are parked? What business qualities must the design realise?
4. **Identify the service decomposition.** This is the most-important inferred decision. From UC groupings / domain concepts, propose a service list, and give every active use case of every BRD exactly one owner service (it goes into the §13 `Use cases (BRD)` column). If the mapping is clean, use it. If not, flag and ask once: "Proposed service decomposition: [list]. Confirm or revise before I generate per-service chunks?"
5. **Run the architecture questionnaire** (SKILL.md step 3b, `architecture-questionnaire.md`): drivers from the BRD (stage, teams, load), then style, communication, data ownership, tenancy, and deployment, each recommended from those drivers; accept all or walk through. **Then run the ecosystem selection flow** (SKILL.md step 3c): parked Technical Inputs (locked), then CLAUDE.md defaults adapted to the chosen style, presented for accept-all or item-by-item walkthrough with BRD-evidence recommendations.
6. **Walk the field mapping table** above, filling each SDD section.
7. **Produce SDD-only section skeletons** with `[NEEDS CLARIFICATION: ...]` markers per the "SDD-only sections" list above.
8. **Draw the derivable Mermaid diagrams inline** (Context, parts of HL Architecture, Workflow per critical journey), each with a prose Summary; flag undecided diagrams as `[NEEDS CLARIFICATION: diagram pending architect input]`.
9. **Write output** per the chosen mode (chunks / combined).
10. **Reconcile contracts** (chunks 10, 11, 12 against the `13x` chunks) and the use-case traceability (§7.3 against 09, 05, 10, 11, `13x`, and the BRD) per SKILL.md step 6a, then run the reviewer pass (chunk 18) and the acceptance loop, then check the e2e gate (step 8b): chunk 19 is written only if it is open.
11. **Surface a structured handoff summary**: file paths, chunk count, Mermaid diagram count, ecosystem selection outcome, count of `[NEEDS CLARIFICATION: ...]` markers grouped by section, list of service-decomposition assumptions made, list of parked Technical Inputs consumed and CLAUDE.md defaults applied, and the use-case traceability line (SKILL.md step 9).

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

- **wallet-core** (owns Wallet, Ledger; owner of UC-01..04 and of the ledger reads UC-08..09).
- **reseller-management** (owns Reseller hierarchy; owner of UC-05..07; enforces the "own sub-resellers only" matrix footnote).
- **reporting-aggregator** (owns reporting projections; serves chunk 09's reports — likely a read-side service consuming events from the other two). It owns no use case, so its §13 `Use cases (BRD)` cell reads `None - serves the BRD chunk 09 reports`.

§0 Document Lineage: one Source BRDs row, key `WALLET` (Wallet Management, v1.0, linked to `../brd-wallet-management/wallet-management-brd-master.md`); Child LLDs `None yet`. Every BRD reference below carries the key.

§6 Ecosystem Overview: Java 21 / Spring Boot and PostgreSQL from the parked Technical Inputs (source-mandated); remaining rows from CLAUDE.md defaults, each noted.

§7.3 Use Case Traceability, the group row and two rows once part 2 has filled them (in part 1, Entry points, APIs, and Events read `Pending (part 2)` and the owner is plain text):

| Use case (BRD) | Title | Owner (§17.X) | Entry points | Flows (§8.4 / §8.5) | APIs (§15) | Events (§14) | Status |
|---|---|---|---|---|---|---|---|
| **[Wallet Management v1.0](../brd-wallet-management/wallet-management-brd-master.md) (WALLET)** | | | | | | | |
| [WALLET/UC-02](../brd-wallet-management/06a-use-cases-tenant-admin.md#uc-02-top-up-a-wallet) | Top Up a Wallet | [wallet-core](./13a-service-wallet-core.md) | `POST /v1/wallets/{walletId}/top-ups` | [§8.4.1](./05-workflows-and-sequences.md#841-workflow-wallet-top-up) | API-02 | `WALLET_TOPPED_UP` | Active |
| [WALLET/UC-06](../brd-wallet-management/06b-use-cases-reseller.md#uc-06-invite-a-sub-reseller) | Invite a Sub-Reseller | [reseller-management](./13b-service-reseller-management.md) | `POST /v1/resellers/{resellerId}/invitations` | - | - | `SUB_RESELLER_INVITED` | Active |

If a Reseller Portal BRD is added later ("add BRD"), it is registered as `RESELLER`, gets its own group in §7.3, and its `UC-01` never collides with `WALLET/UC-01`.

§17.1 wallet-core gets:
- Boundaries (derived from UC ownership).
- Business Logic (derived from WALLET/UC-01..04 Main Flows, each cited as a link with the steps it realises, e.g. `[WALLET/UC-02](../brd-wallet-management/06a-use-cases-tenant-admin.md#uc-02-top-up-a-wallet) steps 3-5`; wallet lifecycle from §3 flagged as a state machine to formalise).
- Constraints (derived from BRD Assumptions + UC business rules + matrix authorization notes).
- DB Modeling: `[NEEDS CLARIFICATION: full ERD and tables for wallet, ledger entry, reseller-association.]`
- API list: `[NEEDS CLARIFICATION: REST endpoints with OpenAPI shapes — implied by UC-01..04 acceptance criteria but not concretely specified.]`
- Event Model: `[NEEDS CLARIFICATION: events emitted by wallet-core (e.g., wallet.created, ledger.entry.recorded). The BRD implies async behaviour but does not name events.]`

…and so on for each service.

# SDD → LLD Field Mapping (FROM-SDD direction)

This file defines how to derive a Low-Level Design from a Solution Design Document. It is the equivalent of `brd-to-sdd.md` in `sdd-unifier`, but one stage further down the chain: SoW → BRD → SDD → **LLD**.

The default workflow shape is **SoW → BRD → SDD → LLD**, with one LLD per SDD.

---

## One fact, one home (no duplication)

Every fact has exactly one owning document and section. The LLD **references** SDD content. It never restates it:

1. **Reference + delta, never copy.** Design-level content (scope, assumptions, glossary, NFR targets, ADRs, principles) stays in the SDD. The LLD section links to the owning SDD chunk (`../sdd-[sdd-slug]/NN-....md` § heading) and adds ONLY the implementation-level delta.
2. **Contract names must match; contract bodies are not restated.** Topic names, event names, `API-NN` contract names and URIs, and role/permission tokens in the LLD match SDD §14/§15/§16 character-for-character (that is consistency, not duplication). Payload contracts, API contract bodies, and role catalogues are NOT copied. The LLD references SDD §14.9 / §15 / §16 (or the schema registry) and adds only implementation detail: consumer groups, serialization, DLQ config, retry policy, enforcement points.
3. **Derived views declare their source.** The LLD's §6.3 Runtime Stack, §8.2 Tables (and the §8.1 ERD of their keys and relationships), the §9.6 Idempotency and Transaction cells, §12.3 Resilience instances, §13.1 Configuration defaults, §13.7 Alerts, and §15 SLO rows restate the SDD values the implementer needs (SDD §6, the `13x` DB Modeling, the §15 contract or §12 integration that sets each port behaviour and resilience value, the SDD section that sets each default, the SDD section that raises each alert, §18): each row names its source (a Source column pointing at the SDD; in §9.6, the API ID cell's link to the contract); a value that disagrees with the SDD is drift to flag, never a silent local truth.
4. **Scalar facts live once.** Version pins, targets, and counts are owned upstream (SDD §6/§18) or by the LLD's own Specs chunk: referenced everywhere else, or restated in a derived view (rule 3), row by row with its source.
5. **Restated upstream content outside rule 3's sourced derived views is a review defect.** The reviewer flags it as Type `Duplication` with the reference-based rewrite as the Recommendation.
6. **Standalone export also permits inlining.** When the user explicitly asks for a self-contained LLD for distribution, the merge step MAY inline referenced SDD sections, marked `> Inlined from SDD §X for standalone distribution`.
7. **IDs belong to their document.** Use case, test case, screen, and mockup IDs are the BRD's; service names, `API-NN`, and event names are the SDD's. The LLD cites them exactly and never creates, renumbers, or re-titles one (§ Use-case traceability).

---

## Use-case traceability (BRD → SDD → LLD)

These rules apply when the SDD derives from brd-unifier BRD(s): in from-sdd and hybrid, and in from-code when an SDD path is given for cross-reference. They carry the SDD's own rules (sdd-unifier `brd-to-sdd.md` § Use-case traceability) one level down. The SDD traces each BRD use case to its owner service and entry points (§7.3). The LLD traces it on to its workflow block, the routes and screens that start it, the UAT/BAT cases that accept it, the e2e specs that automate those cases, and the `use_case` attribute that names it at runtime. The goal: from a production bug on a page, or from a failing UAT case, a reader reaches the use case, its LLD workflow, its SDD §7.3 row, its BRD heading, its test cases, and its mockup in a few clicks.

**When they do not apply.** Pure from-code (no SDD), or an SDD whose §7.3 reads `Not applicable - no source BRD.`: every traceability slot reads `Not applicable - no source SDD` or `Not applicable - no source BRD`, workflow headings name the flow (`### Workflow: [name]`), and the rest of this section is skipped. The LLD never makes up a use case ID to fill the gap.

**Scope.** "In scope" means owned by an SDD §13 service (or module) this LLD covers (SKILL.md step 3b).

**Behaviour no use case covers.** A scheduled job, a BRD chunk 09 report, or an NFR-driven process that the BRD or SDD asks for, but that no BRD use case covers, gets a `### Workflow: [name]` block in its owner's file, never a made-up use case. Directly under its heading: `> **Traceability:** No BRD use case - realises [link to the BRD 09 section, the KEY/NFR-NN, or SDD §17.X] · Entry points: [method and path, or the trigger, as the SDD writes them]`. It carries no `@UseCase` and has no 16 §19.9 row; a route that serves it follows § Frontend routes.

### Homes

One home per mapping. The LLD cites the homes it does not own and adds only its own delta (the last four rows).

| Mapping | Home | Cited in the LLD |
|---|---|---|
| Use case ID, title, status | BRD Use Case Summary (chunk 05) and the use case heading (chunk 06x) | 04 headings, 16 §19.9 |
| Use case → owner service, entry points | SDD §7.3, which reads SDD 09 and each `13x` List of APIs | 04 traceability line |
| Use case → UAT/BAT test cases | BRD chunk 16: each case's `Related UC`, checked against its Traceability Matrix | 04 line, 13 §16.8, 16 §19.9 |
| Screen (its chunk 14 row) → use cases | BRD chunk 14 Mockup coverage: one row per screen or flow, the screen reference, keyed `MK-NN` (a BRD written before `MK-NN` keys it by a screen ID) | 14 §17.3, 04 line, 16 §19.9 |
| Screen ID with no chunk 14 row → use cases | The BRD text, only where it carries a screen ID from its source (brd-unifier never defines one) | Same places as an `MK-NN` |
| Use case → LLD workflow block | LLD 04: one `### KEY/UC-NN: Title` block per active use case, in its owner's file | 16 §19.9 |
| Route → screen, component | LLD 14 §17.3 | 04 line, 16 §19.9 |
| E2E spec → use cases, test cases | LLD 13 §16.8 | 16 §19.9 |
| Entry point → `use_case` attribute | LLD 09 §12.7 and §12.8 (the mechanism); the values are the entry points of the 04 lines | 04 annotations, 10 |

BRD chunk 14 is a working artifact: the LLD reads its Mockup coverage rows (the screen reference: the screen or flow and its use cases; the Figma link is reached through the row) only, never as requirements. From chunk 16 it reads test case IDs, their `Related UC`, and their feature-area headings; it never restates a test case.

### Upstream documents and their state

1. **SDD.** From intake (SKILL.md step 3). It must be finished: if its master shows a generation part `Pending` or `In progress`, or §7.3 still reads `Pending (part 2)`, stop, name the missing part, and do not derive. A shut E2E gate (`Locked`, or `Stale`) does not stop the LLD: items the SDD still holds open or `Decided - pending application` reach it as flags (§ Field mapping table, the 18 Open Items row), and 16 §19.1 and the handoff name the gate state.
2. **BRD(s).** From the SDD's Source BRDs register (chunk 00 § Document Lineage; the cover section of a combined SDD). Without a register, from the SDD cover's `Related BRD` line; otherwise ask. A register link is written from the SDD's location: rebuild the path from the LLD file that holds each citation.
3. **BRD delivery chunks.** Read their state from the BRD master's delivery rows (or `14-todo.md` § Downstream outputs). Chunk 16 absent or `Locked`: every test case slot reads `Pending (BRD 16 not written)`. `Stale` or `Provisional`: cite it, and name the state in 16 §19.1 and the handoff.
4. **Record the state** the trace was built from in 16 §19.1 (SDD version, BRD versions, the state of BRD chunks 14 and 16, each as this LLD last read it), so a later run can see what changed.
5. **Upstream changes since the last run.** On an existing LLD, SKILL.md step 3c compares the state in 16 §19.1 (the SDD version, the BRD versions, the state of BRD chunk 16) with the SDD, its Source BRDs register, and each BRD master, and each BRD's chunk 14 Mockup coverage rows with 14 §17.3, and makes one offer for every refresh the changes fire (§ Refresh triggers); a BRD newer than the SDD's register is named, and its trace refresh waits for the SDD (SKILL.md step 3c). It never refreshes silently.

### IDs and keys

1. **IDs belong to their document.** Use case IDs, test case IDs (`TC-[AREA]-NN`), screen IDs, `MK-NN`, and NFR IDs (`NFR-NN`) belong to the BRD; service names, `API-NN`, and event names belong to the SDD. The LLD cites them exactly as written. It never creates, renumbers, or re-titles one. Behaviour the LLD needs that no BRD use case covers is never a new `UC-NN`: when the BRD or SDD asks for it, it gets a `### Workflow:` block (Behaviour no use case covers, above); otherwise it is an open question (`> Confirm:`, indexed in chunk 15; the reviewer raises it as a `Missing scenario` open item). Platform behaviour (sign-in, health checks, key rotation) carries no use case.
2. **Every BRD ID carries its BRD's key**, even with a single BRD, copied exactly from the SDD's Source BRDs register: `REFUNDS/UC-04`, `REFUNDS/TC-DEC-01`, `REFUNDS/MK-02`, `REFUNDS/NFR-02`. Headings, route data, e2e tags, and `use_case` values carry the key as well. Each ID in a list carries its own key: `REFUNDS/NFR-01, REFUNDS/NFR-02`, never `REFUNDS/NFR-01, NFR-02`. The BRD writes its own IDs plain; the key is added only when citing. A plain `UC-04` is never correct, with one exception: an SDD written before the register existed has no key to copy. Then cite plain IDs, flag it once in chunk 15 (`> Confirm: the SDD has no Source BRDs register; BRD IDs are cited without keys`), and suggest upgrading the SDD in the handoff (sdd-unifier offers to add the lineage).
3. **A keyed heading keeps its key:** `### REFUNDS/UC-04: Approve / Reject Refund`, whose anchor is `#refundsuc-04-approve--reject-refund`.

### The link

`[REFUNDS/UC-04](../../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)`

1. **File.** The BRD file that holds the heading. Find it by reading the BRD, never from a file-name pattern: a small BRD may hold its use cases in `05-user-journeys-and-use-cases.md`.
2. **Path.** Relative to the LLD file that holds the link. LLD chunks sit in `./lld-[project-slug]/` and per-service files one level deeper, so a sibling chunked BRD is `../brd-[brd-slug]/...` from a chunk, `../../brd-[brd-slug]/...` from `04-implementation/<service>.md`, and `./brd-[brd-slug]/...` from a combined LLD. SDD links follow the same rule. In the templates, `[project-slug]` is this LLD's slug, `[sdd-slug]` and `[brd-slug]` are the SDD's and each BRD's (they usually differ), and `[other-slug]` is a sibling LLD's.
3. **Anchor.** Build it from the real heading with GitHub's rules: lowercase it; drop every character that is not a letter, digit, space, hyphen, or underscore; turn each space into a hyphen; never merge hyphens. A heading repeated in one file gets `-1`, `-2`, ... on its later copies. `UC-04: Approve / Reject Refund` gives `#uc-04-approve--reject-refund`; the SDD heading `7.3 Use Case Traceability (BRD → SDD)` gives `#73-use-case-traceability-brd--sdd`. Never build an anchor from a title in a table.
4. **Targets.**

   | Cited ID | Links to |
   |---|---|
   | Active use case | Its `UC-NN: Title` heading in the BRD (level 2 in a chunked BRD, level 4 in a combined one) |
   | Merged or removed use case | The `## Use Case Summary` heading (`#use-case-summary`) in the BRD file that holds it: `05-user-journeys-overview.md` in a chunked BRD, `05-user-journeys-and-use-cases.md` in a small one, or the combined file |
   | SDD §7.3 | The §7.3 heading in SDD chunk 03, or in the combined SDD |
   | Test case | The BRD chunk 16 feature-area heading (`## N. [Feature area] (...)`) that holds it |
   | A screen with a chunk 14 Mockup coverage row (the screen reference), cited by that row's ID: its `MK-NN`, or the screen ID that keys it in a BRD written before `MK-NN` | BRD chunk 14 `### Mockup coverage` (`14-todo.md#mockup-coverage`) |
   | A screen ID with no chunk 14 row (only where the BRD text carries one) | The BRD heading whose text carries it |
   | LLD workflow block | The `### KEY/UC-NN: Title` heading in the owner's `04-implementation/<service>.md` (a same-file anchor in a combined LLD) |

   The chunk 14 row wins: a current row (`MK-01`, with the source's screen ID in its Screen / flow cell) is cited as the `MK-NN`, never by that screen ID.

5. **Parts of a use case** follow the link in brd-unifier's grammar: `step 5`, `A1`, `E1`, `BR-n`, `AC-n`. Example: `[REFUNDS/UC-04](...) E1`. `BR-n` and `AC-n` are positions, so they always carry a short label, as brd-unifier writes them: `[REFUNDS/UC-04](...) AC-3: customer is notified`.
6. **Test cases one by one.** List every test case ID, never a range: `REFUNDS/TC-DEC-01..04` hides `REFUNDS/TC-DEC-03` from a search.
7. **Mermaid.** Plain keyed IDs inside diagrams, in a quoted label where the syntax needs one (`UC04(("REFUNDS/UC-04"))`, `Note over Client,Controller: REFUNDS/UC-04 step 3`), never a link. The links live in the text around the diagram.

### Where the LLD traces a use case

| Chunk and place | What it holds |
|---|---|
| 04 service header, `Owns use cases (SDD 09):` | The use cases SDD 09 gives this service |
| 04 §7.8, `### KEY/UC-NN: Title` + `**Traceability:**` line | One block per active use case, in its owner's file |
| 04 §7.8, `### Participates in KEY/UC-NN: Title` | Another service's part of the use case (a saga step, a consumer), pointing to the owner's block. Never a second UC block. |
| 04 §7.8, `### Workflow: [name]` + `**Traceability:** No BRD use case` line | A job, report, or NFR-driven process that no use case covers (Behaviour no use case covers, above), in its owner's file |
| 04 §7.2 Class & Interface Map | The `@UseCase` annotation on each entry point the 04 line names |
| 09 §12.7 and §12.8 | The `use_case` log field and span attribute |
| 13 §16.8 | E2E specs with their use case and test case tags |
| 14 §17.3 | Every route with its screen and use cases, and the route data that carries them at runtime |
| 16 §19.1 | The upstream state the trace was built from |
| 16 §19.9 | The use-case traceability index (the consolidated view) |

Heading levels in this section are the chunked ones. A combined LLD nests each service's headings one level deeper under its `## 7.N` block, so a workflow block is `#### KEY/UC-NN: Title` there (`chunking.md` § Heading map).

### The traceability line (04 §7.8)

Directly under each `### KEY/UC-NN: Title` heading (the SDD's key, then the BRD's ID and title, exactly): one line, fields in this order, separated by ` · `.

`> **Traceability:** BRD [REFUNDS/UC-04](../../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) · SDD [§7.3](../../sdd-refunds-portal/03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) · Owner: refund-service · Entry points: POST /v1/refunds/{refundId}/decision · UAT/BAT: [REFUNDS/TC-DEC-01](../../brd-refunds-portal/16-uat-bat-test-cases.md#2-refund-decisions-uc-04-mk-02), [REFUNDS/TC-DEC-02](...) · Screens: [REFUNDS/MK-02](../../brd-refunds-portal/14-todo.md#mockup-coverage) via /manager/refunds/:refundId`

| Field | Read from | Content |
|---|---|---|
| BRD | BRD use case heading | The use case link |
| SDD | SDD §7.3 heading | The same link in every block |
| Owner | §7.3 Owner | The service name, exactly |
| Entry points | §7.3 Entry points | Method and path, or the trigger (`Schedule: [name]`, `Event: [EVENT_NAME]`), exactly as §7.3 writes them, with the service named when it is not the owner. Nothing more: the contract stays in chunk 06 and the SDD. |
| UAT/BAT | BRD chunk 16 | Every non-retired case whose `Related UC` names this use case, one by one, with `(Provisional)` kept after the ID. Otherwise `Pending (BRD 16 not written)` or `None - BRD coverage gap`. |
| Screens | LLD 14 §17.3 | `[KEY/MK-NN](...) via /route` (or the screen ID the BRD text carries) for each 14 §17.3 route whose Use cases cell names the use case; `Not applicable - no UI` when chunk 14 is omitted |

### Frontend routes (14 §17.3)

- Every route has a row. `Screen (BRD)` holds the screen reference of the screen or flow the route implements, cited and linked as § The link, Targets says (the chunk 14 row wins); else `None - platform page` for pages no BRD use case needs (sign-in, not found, the shell). A route that serves a `### Workflow:` block (such as a BRD chunk 09 report page) reads `None - no BRD screen ([link to what the block realises])` in both BRD columns and carries no route data. When its screen has a chunk 14 row, the row wins: `Screen (BRD)` cites it, `Use cases (BRD)` reads `None - no BRD use case ([link to what the block realises])`, and its route data carries `screen` only.
- `Use cases (BRD)` is read from the BRD for that screen, never guessed from the route: the use cases its chunk 14 row lists, or, for a screen ID with no chunk 14 row, those whose UI/UX section names the screen.
- The route path and component are the LLD's own design choice (`> Confirm:` in from-sdd, per `confidence-rules.md`).
- Every active use case with a screen the actor sees has at least one route. A use case with neither a screen ID nor an `MK-NN` keeps its routes and gets `> Confirm: no screen ID or MK-NN in the BRD for KEY/UC-NN`.
- Runtime context: each route that implements a BRD screen declares `screen`. It also declares `useCases` when the BRD names use cases for it, for example `data: { screen: 'REFUNDS/MK-02', useCases: ['REFUNDS/UC-04'] }`. A Workflow route with no BRD use case carries `screen` only. The global `ErrorHandler` and frontend telemetry read the deepest active route, attach its `screen`, and attach `use_case` only when that route has `useCases`.

### E2E specs (13 §16.8)

- One spec per BRD use case, named from its key and BRD title: `e2e/refunds-uc-04-approve-reject-refund.spec.ts`. The key keeps two BRDs' `UC-01` apart.
- Every test carries its keyed use case and test case IDs as tags: Playwright `test('...', { tag: ['@REFUNDS/UC-04', '@REFUNDS/TC-DEC-01'] }, ...)`; a backend REST harness (JUnit 5) uses `@Tag("REFUNDS/UC-04")` and `@Tag("REFUNDS/TC-DEC-01")`. A failing UAT case or a production regression re-runs with `npx playwright test --grep "@REFUNDS/TC-DEC-01"`, or with the JUnit Platform tag filter (the `groups` parameter of Maven Surefire or Failsafe).
- A test case with no spec goes on the `Not automated:` line with its reason (a `(BAT observation)` case, a manual-only check). Nothing is left out silently.
- While BRD chunk 16 is not written, specs carry use case tags only; test case tags are added on refresh.

### The use_case attribute (09 §12.7, §12.8)

- Every entry point §7.3 lists for an in-scope use case (REST method, event listener, scheduled job) carries a project annotation, `@UseCase("REFUNDS/UC-04")`. An `Event:` or `Schedule:` trigger that §7.3 lists for a use case is an entry point too, so its listener or job carries the annotation. One aspect puts `use_case` into the log MDC and onto the server or consumer span, and clears it afterwards.
- The value is the use case ID as §7.3 writes it, with its key. An entry point §7.3 lists under several use cases carries all of them in one string, in §7.3 order, joined by commas without spaces (`REFUNDS/UC-02,REFUNDS/UC-04`); the span attribute, the log field, and frontend telemetry all use this form. Find one use case's requests by matching a whole comma-delimited token, never by equality (it misses shared entry points) or a substring (it also matches a longer ID that contains the one searched for): `(^|,)REFUNDS/UC-04(,|$)`.
- Platform endpoints (health, actuator, sign-in) carry none.
- A use case ID is not tenant data or PII, so it is allowed at INFO.
- It is an LLD convention: flag it `> Confirm:` unless SDD §11.4 Observability or the owner's `13x` Observability already settles it.

### The index (16 §19.9)

The production-bug entry point. One row per SDD §7.3 row, in the same order and BRD groups (repeating §7.3's group rows), merged and removed use cases included. It is a consolidated view: each column is read from its home, and it never states a mapping its home does not state.

| Column | Read from | Content |
|---|---|---|
| Use case (BRD) | §7.3 | The use case link |
| Title | §7.3 (the BRD's title) | Exactly as written |
| SDD §7.3 | §7.3 heading | The link |
| LLD workflow | 04 headings | A link to the `### KEY/UC-NN` heading, labelled with the owner service. `Not in this LLD - owner: [service]` when the owner is out of scope, linked to that LLD when the SDD's Child LLDs table names one. `Not built yet - [service]`, linked to its placeholder, when the owner has no code yet. |
| Screens (BRD) | 14 §17.3 | `MK-NN` (or a screen ID the BRD text carries), linked |
| Routes (LLD) | 14 §17.3 | Route paths |
| UAT/BAT test cases (BRD) | BRD chunk 16 | As in the 04 line |
| E2E specs (LLD) | 13 §16.8 | Spec files |
| Status | §7.3 | `Active`, `Merged into KEY/UC-NN` (keyed), or `Removed`, copied from SDD §7.3 |

Merged and removed rows show `-` in every mapping column. With no UI, Screens and Routes read `Not applicable - no UI`.

### Upstream gaps

Flag what is missing upstream; never fill it.

| Situation | What the LLD writes |
|---|---|
| BRD chunk 16 absent or `Locked` (its delivery gate is shut) | `Pending (BRD 16 not written)` in every test case slot; specs tagged with use case IDs only |
| BRD chunk 16 `Stale` or `Provisional` | Cite it; name the state in 16 §19.1 and the handoff |
| A use case with no case in chunk 16 | `None - BRD coverage gap` |
| A use case's screen with no `MK-NN` row in BRD chunk 14 and no screen ID in the BRD text | `> Confirm: no screen ID or MK-NN in the BRD for KEY/UC-NN` |
| Chunk 16's Traceability Matrix disagrees with a case's `Related UC` | Cite the `Related UC` and add a `> Confirm:` naming both: a BRD inconsistency, not the LLD's to resolve |
| SDD without § Document Lineage (no Source BRDs register) | Plain BRD IDs, flagged once (§ IDs and keys); the handoff suggests upgrading the SDD |
| SDD without §7.3 (derived before it existed) | Owner from SDD 09 (its `Use cases (BRD)` column, or the Business Logic that cites the use case) plus the BRD, and entry points from the owner's `13x` List of APIs, each `> Confirm:`; the SDD field reads `Not in this SDD (older SDD) - see [SDD 09](...)`. The handoff suggests upgrading the SDD: sdd-unifier offers to add §7.3 and the lineage on its next run. |
| A `[NEEDS CLARIFICATION: ...]` the LLD depends on, in a §7.3 cell or in any other SDD section (a §5 term, a `13x` rule) | Carry it as a `> TODO:` that cites the SDD section; never resolve it in the LLD. An unknown §7.3 owner means no workflow block yet; the index row shows the gap. |
| §7.3 still `Pending (part 2)` | Stop: the SDD is unfinished |

### Checks (SKILL.md step 6a)

1. Every active §7.3 use case in scope has exactly one `### KEY/UC-NN: Title` block (`####` in a combined LLD), in its owner's file or §7 block, with the SDD's key and the BRD's ID and title. An owner with no code yet (a placeholder, `transform-detection.md` § Partial-code resolution) lists the use case as not built instead. No heading, line, route, tag, or index row cites an ID its document does not have. Every `### Workflow:` block for behaviour the BRD or SDD asks for that no use case covers has the `No BRD use case - realises [link]` line and no index row; a from-code block for an entry point nothing asks for carries its `> Confirm:` instead.
2. Each line's Owner and Entry points equal §7.3; its test cases equal chunk 16's `Related UC`; its Screens equal the 14 §17.3 rows that name the use case.
3. Every 14 §17.3 route has a Screen and a Use cases cell, or `None - platform page`, or `None - no BRD screen ([link])` for a route that serves a `### Workflow:` block (when its screen has a chunk 14 row: that row as Screen and `None - no BRD use case ([link])` as Use cases); each screen's use cases equal the BRD's; every active use case with a screen the actor sees has a route; every route with a BRD screen has its own `data` entry in the 14 §17.3 route configuration, and it matches its row.
4. The index has one row per §7.3 row, in the same order and groups, and every cell equals its home, in both directions.
5. Every 13 §16.8 tag names a use case or test case the BRD has; every non-retired case of an in-scope use case has a spec or a `Not automated` reason.
6. Every entry point a use case's 04 line names carries `@UseCase` with the §7.3 value; one a `### Workflow:` line names carries none.
7. Every link resolves: the file exists at that relative path, and the anchor equals the one built from the real heading in that file.
8. Every BRD ID, including each ID in a list, carries a key from the SDD's Source BRDs register, and its link points into that BRD's location.

### Refresh triggers

| Upstream change | What the LLD refreshes |
|---|---|
| BRD chunk 16 written or refreshed | 04 UAT/BAT fields, 13 §16.8 tags, 16 §19.9, 16 §19.1 |
| BRD chunk 14 `MK-NN` rows or their use cases, or screen IDs in the BRD text, change (a Figma link change alone needs no refresh: the LLD links the chunk 14 row, which carries the current link) | 14 §17.3 rows and route data, 04 Screens fields, 16 §19.9 |
| SDD §7.3 changes (owner, entry points, a new, merged, or removed use case) | 04 blocks and `@UseCase` annotations, 16 §19.9 |
| A new BRD version, or a new BRD (a new key), once the SDD's Source BRDs register names it (SKILL.md step 3c) | All of the above |
| A new SDD version | The LLD chunks mapped (§ Field mapping table) from the SDD chunks its Changes Log rows list since the version in 16 §19.1 (SKILL.md step 3c), plus 16 §19.1 and this LLD's Child LLDs row; the Specs are re-synthesised (SKILL.md step 6b) when a changed SDD chunk feeds them (§1, §6, §13) |

Each refresh is a targeted regeneration: the "refresh the trace" or "the SDD has a new version" row of the table under SKILL.md step 9, next to its "regenerate chunk N" row. One request is one update: one bump and one Changes Log row, even when it runs several of these refreshes (SKILL.md § Output conventions, Versions).

**How far a new SDD version reaches.** For each field mapping row whose SDD source the change touched, the row's LLD destinations are compared with that whole source as it stands now, not only with what changed: all that the row's SDD section cell names in the listed chunk (every HTTP contract of §15, not only the one the Changes Log row names). The change is carried. Each destination is judged by the part of that source the row sends to it; a link to the LLD place that states that part carries it. What else a destination misses or states differently is brought in line when the SDD settles it, or flagged (`> Confirm:` or `> TODO:`) when it needs a choice. The other destinations of a listed SDD chunk are checked for the change only. The SDD Changes Log row names the sections it changed; when it does not, every row of a listed chunk counts as touched. Everything else stays, applied answers and flags included, unless the change answers them (Open items the change settles, below).

**Open items the change settles.** A refresh checks chunk 18 against the change. An `Open` or `Deferred` item it answers becomes `Resolved`, with a Resolution Log row `Settled by SDD v[X.X]` (or `[KEY] v[X.X]`) that links the section that answers it. An item it answers in part stays `Open`, and its Resolution Log row names the settled part. A `Resolved` item whose resolution the change overturns keeps its status when the change decides the new design, with a Resolution Log row `Superseded by SDD v[X.X]` (or `[KEY] v[X.X]`); when the change leaves a choice open, it goes back to `Open`, with its Concern updated and a Resolution Log row `Reopened by SDD v[X.X]` (or `[KEY] v[X.X]`). A `Resolved` item that the change confirms, by answering a flag its Resolution Log row names, keeps its status, with a Resolution Log row `Settled by SDD v[X.X]` (or `[KEY] v[X.X]`) that names the removed flag and links the section that answers it. It checks the flags chunk 15 indexes the same way, wherever they sit: a `> TODO:` or `> Confirm:` the change answers is removed, its text states the answer by linking the section that gives it, and its chunk and chunk 15 are listed under `Chunks:`.

The update ends with the delta review (SKILL.md step 7, On an update), and with the application check when answers were applied (SKILL.md step 7, Answers in the same update).

---

## SDD lineage (Child LLDs)

Every LLD that reads an SDD registers in it (SKILL.md step 6c): from-sdd, hybrid, partial, and from-code when an SDD path is given, whether or not the SDD has a source BRD. When the SDD has § Document Lineage with a Child LLDs table (chunk 00 `## Document Lineage` > `### Child LLDs (children)`, or the same section in the cover of a combined SDD), this LLD adds its own row there on the first run, or updates that row on a later run, matched by Link. It never touches other rows, and writes nothing else into the SDD: this is the only write outside the LLD folder. An SDD without that table (written before it existed) gets no row; the handoff suggests upgrading it through sdd-unifier.

| Column | Value |
|---|---|
| LLD | This LLD's project name |
| Scope (§13 services) | The SDD §13 services (and modules) this LLD covers, named as §13 writes them; never an item that is not a §13 row, such as a frontend or a shared library |
| Direction | This run's mode: `from-sdd`, `hybrid`, `partial`, or `from-code` |
| Version | This LLD's version |
| SDD version | The SDD version this LLD's content reflects, as 16 § 19.1 records it: the SDD's current version after a build or an accepted refresh, which clears sdd-unifier's out-of-date note; the older one when the user declined the refresh (SKILL.md step 3c), with that note kept |
| Link | This LLD's `[project-slug]-lld-master.md` (or its combined file), relative to the SDD file, e.g. `[refunds-core-lld-master.md](../lld-refunds-core/refunds-core-lld-master.md)` |

The row replaces `None yet`, and the handoff names the change. sdd-unifier marks a row whose SDD version is older than the SDD's current version as out of date; the next LLD run offers the refresh (SKILL.md step 3c). The LLD master's `Related SDD` line links to the SDD master: sdd-unifier finds unregistered sibling LLDs through it.

---

## Specs ownership & synthesis (this skill owns the Specs chunk)

The constitution-grade `Specs` (Mission, Tech Stack, Roadmap, Project Type) is **owned by `lld-unifier`** and lives with the LLD as chunk `17-specs.md` (combined: `# 20. Specs`). It is synthesised AFTER the LLD body from the SDD, per SKILL.md step 6b:

| Specs sub-section | Synthesised from | Consumed by |
|---|---|---|
| **1. Mission** | SDD §1 Executive Summary (2-3 sentences, core idea only) | speckit `/constitution` |
| **2. Tech Stack** | SDD §6 Ecosystem Overview (verbatim with version pins, one bullet per tier) | speckit `/constitution` + this skill's `pattern-rules.md` (stack-appropriate pattern selection) + the master index's "Tech Stack snapshot" (`[project-slug]-lld-master.md`, chunks shape) and §6.3 Runtime Stack |
| **3. Roadmap** | SDD §13 services (and the BRD use cases each owns) grouped into 3-6 delivery phases | speckit `/constitution` + delivery planning |
| **4. Project Type** | SDD §1 `**Project Type:**` line (recorded at SDD intake) or asked here if absent | The direction decision (see `transform-detection.md`): greenfield → from-sdd; brownfield → from-code / hybrid |

Tech Stack and Project Type are also **inputs to LLD generation itself**: resolve them from the SDD body FIRST (before generating), then formalise them into the Specs chunk after the body is written.

**Legacy chains:** older SDDs carried the Specs at `../sdd-[sdd-slug]/15-specs.md` / `# 19. Specs`, and pre-restructure BRDs at `../brd-[brd-slug]/12-specs.md` / `# Specs`. If a legacy Specs exists, consume it as read-only input (its Tech Stack pins win over CLAUDE.md defaults; if it disagrees with SDD §6, flag the drift) and still produce the LLD-owned `17-specs.md` as the canonical copy going forward.

**If no SDD is reachable** (pure from-code direction), synthesise the Specs from the code-derived facts: Mission from the discovered system purpose (flag `> Confirm:`), Tech Stack from the actual dependencies (high confidence), Roadmap `Not applicable - reverse-engineered LLD`, Project Type Brownfield.

---

## What derivation IS

- Reading the SDD in full (and BRD if linked).
- Auto-filling LLD sections that have direct SDD analogues (Bounded Context, Architecture overview, Data Model skeleton, API endpoints, Event topics).
- Applying CLAUDE.md design rules aggressively per `pattern-rules.md` (constructor injection, records DTOs, idempotency on money writes, outbox for state changes, sagas for cross-service, Resilience4j, multi-tenant indexes, RFC 9457 errors, OpenAPI versioning, Flyway migrations).
- Producing a per-service implementation chunk (`04-implementation/<service>.md`) that is **implementation-ready** for an AI implementer to pick up.
- Tracing every BRD use case end to end (§ Use-case traceability): its workflow block, the routes and screens that start it, its UAT/BAT test cases, the e2e specs that automate them, and the `use_case` attribute on its entry points.
- Flagging gaps with `> Confirm: ...` (medium confidence) or `> TODO: <best-guess> - verify` (low confidence).

## What derivation IS NOT

- Creating, renumbering, or re-titling a use case, test case, screen ID, or `MK-NN`. Those IDs are the BRD's.
- Inventing class names that aren't implied by the SDD or by CLAUDE.md naming conventions.
- Inventing performance numbers from thin air. SLO targets carry from SDD §18; if the SDD didn't pin them, the LLD flags them.
- Inventing concrete OpenAPI schemas if the SDD didn't pin request / response shapes. The LLD proposes shapes per CLAUDE.md REST conventions and flags them for confirmation.
- Producing complete pseudocode for every method. Only non-trivial methods get pseudocode; CRUD methods are described by signature alone.

---

## Detecting SDD input form

The SDD can arrive in two forms:

### Chunked form (sdd-unifier output)

Recognise it by:

- Folder path matches `sdd-*/`.
- Contains files named `00-cover-and-changelog.md`, `01-executive-summary-scope-risks.md`, `02-ecosystem-overview.md`, `03-users-and-use-cases.md`, `04-architecture-style-and-diagrams.md`, `05-workflows-and-sequences.md`, `06-principles-and-decisions.md`, `07-cross-cutting-concerns.md`, `08-integrations.md`, `09-services-summary.md`, `10-events-hub.md`, `11-api-contracts.md`, `12-centralized-user-roles.md`, `13a-service-*.md` (one per service), `18-open-items-and-clarifications.md`, and `19-e2e-system-design.md` once the SDD's e2e gate is open. (SDDs from the earlier map use `10a-service-*.md`, `11-centralized-user-roles.md`, and `16-e2e-system-design.md` with no API contracts chunk; legacy chunked SDDs lack the registries and may carry `15-specs.md`. Same logical reading order.)
- Each file begins with `<!-- CHUNK: NN ... PART OF: SDD - ... -->`.

**Reading order:** numeric (00, 01, 02, …), with multi-letter chunks read alphabetically within their numeric prefix.

**Treat as one logical SDD.** Read all chunks first, build a unified mental map, then write one LLD.

**Where the trace starts.** Chunk 00 § Document Lineage holds the Source BRDs register (BRD keys and locations) and the Child LLDs table; chunk 03 §7.3 holds the use case traceability; chunk 09 holds ownership (`Use cases (BRD)`). SDDs written before these rules lack some of them: § Use-case traceability › Upstream gaps.

### Combined form (single SDD .md file)

Recognise by `SDD-` filename prefix or matching template structure.

Read in full before writing anything.

---

## Field mapping table

This is the authoritative mapping. Each row says: SDD source section → LLD destination chunk + transformation note.

| SDD section | LLD destination | Transformation note |
|---|---|---|
| 00 Cover & Changelog | `00-metadata.md` | New LLD has its own version (v1.0). Add a "Related SDD" line linking the SDD master (`[sdd-slug]-sdd-master.md`), or the combined SDD file. New Changes Log entry: "Initial LLD draft, derived from SDD v[X.X] via lld-unifier. Mode: from-sdd. Chunks: none (initial build)" |
| 00 § Document Lineage (Source BRDs, Child LLDs) | `00-metadata.md` Related BRD(s) + `16-references.md` § 19.1 | The Source BRDs register gives each BRD's key and location (§ Use-case traceability › IDs and keys). The Child LLDs table receives this LLD's own row, and nothing else (§ SDD lineage). |
| 01 Executive Summary | `01-purpose-and-scope.md` § 1 Purpose | Recast as **implementation-purpose** statement: what the LLD enables a developer to do (not the technical-summary framing of the SDD). |
| 01 Scope (In/Out) | `01-purpose-and-scope.md` § 2 Scope | **Reference + delta.** Link SDD §2; state only the LLD's narrowing (which services/sub-scope this LLD covers) and implementation-level exclusions. |
| 01 Assumptions | `01-purpose-and-scope.md` § 3 Assumptions | **Reference + delta.** Link SDD §3; list ONLY LLD-specific implementation assumptions. |
| 01 Risks | (Not directly carried: surface in `15-open-questions.md` if any risk affects implementation choices) | The LLD does not duplicate the SDD risk register. |
| 01 Glossary | `01-purpose-and-scope.md` § 4 Glossary | **Reference + delta.** Link SDD §5 (which itself links the BRD glossary); list ONLY LLD-specific terms (pattern names, transaction-policy names, class-suffix conventions). |
| 02 Ecosystem Overview | `03-architecture.md` § 6.3 Runtime Stack | **Derived view with declared source.** The runtime stack table keeps its Source column pointing at SDD §6 rows; a pin that disagrees with SDD §6 is drift to flag, not a local override. |
| 03 §7.1 Actors, §7.2 Use Case Diagram | (Context for `11-security.md` and the workflow blocks) | Not redrawn in the LLD. |
| 03 §7.3 Use Case Traceability | `04-implementation/<owner>.md` § 7.8 (one `### KEY/UC-NN: Title` block and traceability line per active use case) + `16-references.md` § 19.9 (index, one row per §7.3 row) | **The trace spine.** Owner and entry points are cited exactly as §7.3 writes them, never restated further. Rules: § Use-case traceability. |
| 04 Architecture Style | `03-architecture.md` § 6.4 Architectural Style - As Operationalised | The LLD doesn't restate the style; it operationalises it (the topic naming SDD §14.4 fixes, schema registry choice, outbox-table convention, saga style per case). |
| 04 Context Diagram | `02-context.md` § 5.4 Cross-Service Dependencies | Convert to a Mermaid `graph LR` showing services + external systems. Optional Miro link if the SDD's Context Diagram is on Miro. |
| 04 High-Level Architecture | `03-architecture.md` § 6.1 Component Topology | Convert to Mermaid `graph TB`. |
| 05 Workflows | `04-implementation/<service>.md` § 7.8 Use-Case Workflows (per service) | The SDD describes flows at system level; the LLD refines per service with idempotency points, outbox emission points, retry/timeout choices, sequence diagrams (Mermaid). |
| 05 Sequence Diagrams | `04-implementation/<service>.md` § 7.8 (sequence subsection per use case) | Convert to inline Mermaid `sequenceDiagram`. Optional Miro link if the SDD's diagram is on Miro. |
| 06 Architecture Principles | (Inherited: referenced from `03-architecture.md`) | The LLD doesn't restate principles; it follows them. |
| 06 Architectural Decisions (ADRs) | `16-references.md` § 19.2 (cross-link only) | The LLD links to ADRs but doesn't duplicate them. |
| 07 Cross-Cutting Concerns | `09-cross-cutting.md` (entire chunk) | Each SDD default expands into the concrete LLD configuration: e.g., "Multi-tenancy: schema-per-tenant for high-volume" → `09-cross-cutting.md` § 12.1 + concrete index strategy in `05-data-model.md` § 8.4. |
| 08 Integrations | `06-api-contracts.md` (downstream REST) + `07-event-contracts.md` (downstream events) + `04-implementation/<svc>.md` (per-service Resilience4j config in `09-cross-cutting.md` § 12.3) | Each integration row becomes either an outbound API call (with timeout, retry, circuit breaker config) or an event subscription. |
| 09 Services Decomposition (§13) | `[project-slug]-lld-master.md` (table of services) + one `04-implementation/<service>.md` file per row | This is **the** structural mapping: one SDD service = one LLD per-service file. A row of Type `module` (a modular monolith or hybrid core) reads as a service here: one `04-implementation/<module>.md` per module. The `Use cases (BRD)` column becomes the file's `Owns use cases (SDD 09):` header line. |
| 10 Centralized Event Hub (§14.1-§14.9, integration events on the broker) | `07-event-contracts.md` § 10.1-10.5 (topic inventory + producer/consumer implementation specs) + `09-cross-cutting.md` (outbox/inbox, delivery guarantees) | **Names match; bodies are referenced.** Topic and event names must match SDD §14 character-for-character. Payload contracts are NOT restated: each event row links to its SDD §14.9 contract (or the schema registry) and the LLD adds only implementation detail: consumer group naming, serialization, DLQ config, retry/redrive policy. |
| 10 §14.10 In-Process Domain Events (modular monolith or hybrid core) | `07-event-contracts.md` § 10.6 In-Process Domain Events + the publishing and listening classes in each module's 04 file | **Names match; payloads are referenced.** The Delivery value (durable or in memory), and per event its name, publisher module, listener modules, transaction phase, DTO, and When, as §14.10 writes them. No topic, consumer group, or DLQ: the event never leaves the process. A durable Delivery line takes the outbox as its publication log (`09-cross-cutting.md` § 12.4); an in-memory one takes none. In a modular monolith with no integration events, the §14.7 doctrines, the §14.8 notes, and the §14.9.0 value objects that apply to the §14.10 events are read here too. A microservices SDD gives `Not applicable - no in-process events`. |
| 11 Service Integration API Contracts (§15), HTTP contracts (Type Internal, External) | `06-api-contracts.md` § 9.1 (its `API ID (§15)` column) + the client (caller side) or controller (provider side) in the owner's 04 file + per-service § 7.7 error mapping | **Contract names and URIs match; contract bodies are referenced.** Each SDD `API-NN` maps to the LLD endpoint and client that implement it; the LLD adds implementation detail (client class, DTO records, Resilience4j config) and never re-specifies headers, body, or error codes. An SDD contract still `TBD - external` stays a `> TODO:` in the LLD until the SDD is updated. |
| 11 Service Integration API Contracts (§15), Type `Internal (in-process)` (modular monolith or hybrid core) | `06-api-contracts.md` § 9.6 In-Process Port Contracts + the owner's 04 § 7.2 port and adapter | **Names match; bodies are referenced.** `API-NN`, port interface, operation, request and response DTO records, raised errors with their `errorCode`, the Behaviour rows (Idempotency, Transaction), permission token, and the implementing adapter. No method, URI, headers, status codes, or resilience config: the call never leaves the process. The token is checked at the port (04 § 7.2 Authorization, Kind Port). |
| 12 Centralized User Roles (§16) | `11-security.md` (authZ decisions) + `09-cross-cutting.md` § 12.1 (authentication and tenant resolution) + per-service § 7.2 `### Authorization` (each entry point's permission token and enforcement point) | **Names match; catalogue is referenced.** Role names and permission tokens must match SDD §16 character-for-character, but the catalogue/matrix is not restated: the LLD references SDD §16 and adds only the enforcement implementation; the implementation seed (§16.12) becomes the role/permission migration + fixture plan. |
| 19 E2E System Design (§24, gated; may be absent until the SDD open items are cleared) | `02-context.md` § 5.4 Cross-Service Dependencies + saga narratives in `04-implementation/<orchestrator>.md` | The reconciled fan-out map and saga views orient the per-service derivation; behind a `Stale` gate line, chunks 02 to `13x` win where chunk 19 differs. The HTTP edges of §24.7 become outbound API calls with resilience config; its in-process edges become port calls (06 § 9.6) with no resilience config. |
| 13a (per service) Boundaries | `04-implementation/<svc>.md` § 7.1 Responsibility | Reframe from boundary statement to responsibility statement. |
| 13a Input | `06-api-contracts.md` (REST inbound; in-process ports in § 9.6) + `07-event-contracts.md` (event consumers; in-process listeners in § 10.6) | Inbound REST and event consumers each become rows in the contracts chunks; cross-referenced from the per-service file. |
| 13a Business Logic | `04-implementation/<svc>.md` § 7.2 Class & Interface Map + § 7.3 Method-Level Pseudocode + § 7.4 Design Patterns Applied | The SDD's business-logic prose becomes the LLD's class/interface map and pattern application. **This is the heaviest derivation step.** |
| 13a State Machine (Business Logic subsection) | `08-state-and-rules.md` § 11.1 Aggregate State Machines | Convert to Mermaid `stateDiagram-v2`. |
| 13a Output | `06-api-contracts.md` (REST outbound; port calls in § 9.6) + `07-event-contracts.md` (event producers; in-process publishers in § 10.6) | Same as Input but for outputs. |
| 13a Integrations (per service) | `04-implementation/<svc>.md` (cross-reference to `06-api-contracts.md` outbound calls) + Resilience4j config in `09-cross-cutting.md` § 12.3 | |
| 13a DB Modeling | `05-data-model.md` § 8.2 Tables (in this service's schema) + § 8.3 Indexes + § 8.5 Migration Plan + § 8.6 Retention & Archival + § 8.7 Encryption + the owner's `04-implementation/<svc>.md` § 7.3 and § 7.8 (the job that applies the Retention Policy or Archival) | **Derived view with declared source** (§ One fact, one home, rule 3): § 8.2 restates the Tables Design rows, each with a Source link to its row; § 8.3, § 8.5, § 8.6, and § 8.7 link the SDD parts they implement (the indexes Tables Design names, Migration Strategy, Retention Policy and Archival, Data Encryption) and add only the implementation delta. The § 8.1 `erDiagram` follows the SDD's ERD: entities, keys, and relationships only, with no line cap; the columns stay in § 8.2. The job that applies the Retention Policy or Archival (its deletion order, locks, and batches) is pseudocode in the owner's 04 § 7.3, with a `### Workflow:` block in § 7.8 (§ Use-case traceability, Behaviour no use case covers); § 8.6 links it. A value that differs from the SDD is drift to flag. |
| 13a Multi-Tenancy Specifications | `05-data-model.md` § 8.4 Multi-Tenancy Strategy (per-service row) | |
| 13a API Standards + List of APIs | `06-api-contracts.md` § 9.1 Endpoint Inventory + § 9.2 Request/Response Shapes + § 9.5 OpenAPI snippets | Per-service endpoint table; OpenAPI generation is downstream (LLD references `[path/openapi.yaml]` and lists snippets). |
| 13a Event Model + Messaging Infra | `07-event-contracts.md` § 10.1 Topic Inventory + § 10.2 Event Schemas + § 10.3 Producer Specs + § 10.4 Consumer Specs | Per-topic detail. Cross-check against SDD §14 (the contract registry): a divergence between a per-service Event Model and §14 is flagged as drift, never silently resolved. |
| 13a Constraints | `04-implementation/<svc>.md` § 7.7 Error Handling (constraints that surface as exceptions) + `09-cross-cutting.md` (constraints that are platform rules) | |
| 13a Error Handling | `04-implementation/<svc>.md` § 7.7 Error Handling (per-exception RFC 9457 mapping) | Each error becomes a row in the per-service error table. |
| 13a Observability | `10-operations.md` § 13.3 Metrics (per-service custom metrics) + `09-cross-cutting.md` § 12.7-12.8 (`use_case`) | If it already names a use case attribute, it settles the LLD convention; otherwise the convention is flagged `> Confirm:`. |
| 13a Developer Notes | `04-implementation/<svc>.md` § 7.4 Design Patterns Applied + `13-testing.md` § 16 (test strategy) | |
| 13a Service-Level Diagrams (Flow Chart, Sequence) | `04-implementation/<svc>.md` § 7.8 Use-Case Workflows (Mermaid sequence per use case) | |
| 13a Compliance | `11-security.md` § 14.6 Compliance | |
| 13a Deployment Strategy | `03-architecture.md` § 6.2 Deployment Topology (per-service replicas / strategy if overrides exist) | |
| 13a Future Enhancements | (Carried: surface in `15-open-questions.md` § 18.4 Decisions Pending if any inform near-term implementation) | |
| 14 Performance & Capacity (§18) | `12-performance.md` (entire chunk) | **Reference + delta.** SLO rows reference the owning SDD §18 target (per-row link); the LLD adds ONLY the *meeting-the-targets* detail (caching, hot-path indexes, bulkhead sizes). |
| 14 §18.5 NFR Targets | The LLD place that realises each target in this LLD's scope, read from its Realised in cell: for a §18 row, the `12-performance.md` § 15.1 row or meeting-the-targets detail; otherwise where the LLD builds that section (a §11 default in `09-cross-cutting.md`, an ADR where its decision is implemented, a §17.X section in the owner's 04 file) | **Reference + delta**, as the row above: each links the §18.5 row (BRD NFR, technical target) it realises. |
| 15 Environments (§19) | `10-operations.md` § 13.1 Configuration | **Derived view with declared source** (§ One fact, one home, rule 3): per-environment config rows, each Default restating the SDD value (§19, or the `13x` section that sets it) with a Source link. A value that differs from the SDD is drift to flag. |
| 16 Operations Runbook (§20) | `10-operations.md` § 13.8 Runbook Procedures | The SDD's runbook procedures carry; the LLD enriches with concrete commands once code exists. From SDD alone, runbook procedures may be skeleton-form with `> TODO: concrete commands once code exists - verify`. |
| Alerts the SDD raises (§11.4 Alerting, or any other SDD section that raises one: a §12 integration row, a §15 error row, a `13x` section) and the §20 procedure each one triggers | `10-operations.md` § 13.7 Alerts | **Derived view with declared source** (§ One fact, one home, rule 3): one row per alert, with the metric and threshold that implement its SDD condition, a Source link to the place that raises it, and an Action cell that links its §20 procedure, or a `> TODO:` when §20 has none. A change to any of these sources touches this row. |
| 17 Appendix (§21) and Wishlist (§22) | `16-references.md` (entire chunk) | Carry references; add LLD-specific rows. The wishlist is not carried: an item that informs near-term implementation goes to `15-open-questions.md` § 18.4, as for 13a Future Enhancements. |
| 18 Open Items & Clarifications (§23) | (Input context only: not carried) | Read the SDD's open, decided, and deferred items. A decided item reaches the LLD through the chunks its application changed, which the same Changes Log row lists. An open or deferred item that an implementation choice depends on becomes a `> Confirm:` or `> TODO:` that cites it, by the tiers of `confidence-rules.md`. A `Decided - pending application` item that one depends on becomes a `> TODO:` that cites it: the body follows the SDD text as it stands, and the flag gives the decided option as its best guess, to verify once sdd-unifier applies it (a pending decision is not yet SDD design text). Do not copy the section: the LLD gets its own reviewer pass (chunk 18), and a refresh checks that chunk against the change (§ Use-case traceability › Refresh triggers). |
| 01 §1, 02 §6, 09 §13 (the Specs inputs) | `17-specs.md` (Mission, Tech Stack, Roadmap) | Re-synthesised as a whole per § Specs ownership & synthesis and SKILL.md step 6b, after the body; never mapped field by field. |

### BRD inputs (reached through the SDD)

The BRD is located through the SDD (§ Use-case traceability › Upstream documents). The LLD reads these parts of it; nothing is restated.

| BRD source | LLD destination | Note |
|---|---|---|
| 05 Use Case Summary + `06x` use case headings | `04-implementation/<owner>.md` § 7.8 headings and links + `16-references.md` § 19.9 | IDs and titles exactly as the BRD writes them. Merged or removed rows link to the Use Case Summary. |
| 14 Mockup coverage | `14-frontend.md` § 17.3 `Screen (BRD)` and `Use cases (BRD)` + the Screens field of the 04 line | The rows (one per screen or flow: the screen reference, keyed `MK-NN`, or by a screen ID in a BRD written before `MK-NN`), and the use cases each one lists (the Figma links stay in the BRD row). A working artifact, never read as requirements. |
| 11 UI/UX, and each use case's UI/UX section | Same places, only for a screen ID from the BRD's source that has no chunk 14 row | Screen IDs exactly as the BRD text carries them (brd-unifier never defines one), with the use cases that name them |
| 16 UAT/BAT Test Cases | The UAT/BAT field of the 04 line + `13-testing.md` § 16.8 + `16-references.md` § 19.9 | Test case IDs, their `Related UC`, and their feature-area headings. While the chunk is locked: `Pending (BRD 16 not written)`. |
| 00-04 and 12 (purpose, scope, glossary) | `01-purpose-and-scope.md` | Supplementary context only, referenced, never restated |

---

## LLD-only sections (always need architect / SDD-blind input)

These sections have no direct SDD analogue and always produce `> TODO: <best-guess> - verify` markers when deriving from SDD alone:

### `04-implementation/<service>.md` § 7.2 Class & Interface Map (concrete names)

The SDD describes business logic; class names are an implementation choice. Apply CLAUDE.md naming defaults:

- Controllers: `<Domain>Controller`
- Service interfaces: `<Domain>Service`
- Service impls: `<Domain>ServiceImpl`
- Repositories: `<Domain>Repository`
- Domain types: records (CLAUDE.md), suffixed `Dto` (inbound), `Response` (outbound), or unsuffixed (entity).

Flag with `> Confirm: class names follow CLAUDE.md conventions; verify with team`.

### `04-implementation/<service>.md` § 7.3 Method-Level Pseudocode

Only non-trivial methods get pseudocode. The owner's `13x` Business Logic, with the use case parts it cites, seeds the pseudocode. Flag low-confidence inferences with `> TODO: <pseudocode best-guess> - verify with [KEY]/UC-NN`.

### `04-implementation/<service>.md` § 7.6 Transaction Boundaries

Defaults per CLAUDE.md (constructor injection, `@Transactional` REQUIRED, READ_COMMITTED). Per-method overrides require code-or-architect input: flag with `> Confirm: transaction propagation default applied; verify per method`.

### `06-api-contracts.md` § 9.2 Request / Response Shapes

The SDD's "List of APIs" gives method + path + summary. Concrete request / response shapes need either OpenAPI source or architect input: propose a shape per CLAUDE.md REST conventions (records, validation annotations) and flag.

### `12-performance.md` § 15.2 Caching Strategy

The SDD names hot-path concerns; the LLD chooses the cache. From SDD alone, propose a cache only if a SDD performance target requires one (e.g., GET p99 < 50ms with 1000 RPS implies a cache). Otherwise: `> TODO: caching strategy - verify`.

### `12-performance.md` § 15.5 Peak Scenarios

Carry from SDD §18.3 if pinned; otherwise: `> TODO: peak scenarios - verify with SDD §18.3`.

### `14-frontend.md` (if applicable)

The SDD's UI/UX expectations seed the frontend chunk. Concrete component tree, signal/store boundaries, PrimeNG component selections need either existing code or architect input: propose per CLAUDE.md frontend defaults and flag.

Route paths, and which BRD screen each route implements, are the LLD's own choice: propose them and flag `> Confirm:`. The use cases a screen serves are the BRD's and are read, never proposed (§ Use-case traceability › Frontend routes).

---

## Workflow when deriving from SDD

1. **Detect the SDD form** (chunked / combined) per "Detecting SDD input form" above.
2. **Read the SDD in full.** Numeric order for chunks, end-to-end for combined. Stop if it is unfinished (§ Use-case traceability › Upstream documents).
3. **Read the BRD(s)** found through the SDD: the use case, screen, mockup, and test case IDs the trace cites (§ BRD inputs), plus purpose / scope / glossary as supplementary content.
4. **Build a unified mental map.** What's the system? What services exist? What patterns are pinned? What are the performance targets? Which use cases does each in-scope service own?
5. **Walk the field mapping table** above, filling each LLD chunk.
6. **Apply CLAUDE.md design rules** per `pattern-rules.md`. Every applied pattern carries the triggering rule + rationale.
7. **Generate `04-implementation/<service>.md`** per service. This is the heaviest work.
8. **Trace the use cases** per § Use-case traceability: the 04 lines, 14 §17.3, 13 §16.8, 16 §19.1 and §19.9, and the `use_case` attribute. Then run the checks (SKILL.md step 6a).
9. **Apply confidence rules** per `confidence-rules.md`. Every inference carries `> Confirm:` (medium) or `> TODO: <best-guess> - verify` (low).
10. **Index every flag** in `15-open-questions.md`.
11. **Write output** per the chosen shape (chunks / combined).
12. **Synthesise the Specs chunk** (`17-specs.md`) per § Specs ownership & synthesis above and SKILL.md step 6b. Then register this LLD in the SDD's Child LLDs table (§ SDD lineage; SKILL.md step 6c).
13. **Run the cleared-context review** (SKILL.md step 7).
14. **Surface a structured handoff summary**: file paths, chunk count, service count, pattern application count, confidence flag counts (`> Confirm:` and `> TODO:`), Specs status, and the use-case traceability line (SKILL.md step 8).

# Triage: sdd-templates

Scope: sdd-unifier chunk 19, events (chunk 10), API contracts (chunk 11), the 13a template, the Mermaid rules, and the modular-monolith template gaps. Files were read as they are on `fix/unifier-fix-round` (de3baec); sdd-unifier has no uncommitted change.

Conventions in this report:
- In quoted text, `\u2014` stands for the em dash character that is in the file, so this report holds none.
- Each M and S fix is a list of edits. Each edit names one file and gives an exact `current` block (unique in that file) and its `new` block. Edits on the same file touch different lines, so their order does not matter.
- Line numbers are from the files as read; run evidence is from `_fixtures/chain/run-2026-10-01-e2e/` ("the e2e run") and `_fixtures/scenarios/lld-modular-monolith/run/` ("the 3d run").
- `brd-unifier/mermaid-diagrams.md` gained a one-line fix-round change at line 150 while this triage ran; the lines cited here (154, 156, 163) did not move, and D12.2's `current` block still matches. All 41 `current` blocks were checked by script against the working tree: each is unique in its file, also after the earlier edits are applied in order.

## Summary

- Status (24 assigned items): Present 23, Not a skill issue 1 (V1-SRC), Fixed 0, Partly fixed 0. Two Present items have one part Not reproducible: D13 (the `13a-service-` prefix) and T6 (`end` in an `else` label).
- Class (23 Present): M 4 (D13, V-1, W5, W6), S 10 (D4, D12, TD1, TD4, T5, T6, W1, W4, W8, W9), D 9 (8 decisions: TD2 is decided with D5).
- Skipped as owned elsewhere: T5's "no rule for chunk 19's VERSION" (version-bump family).
- New items: 2, both M (N-1, N-2).

D items:
- S2-3: the ~30-line Mermaid cap fits flows and sequences, not layered views or ERDs. Recommend: cap workflows and sequences only; an ERD shows keys and relationships only.
- D5 (with TD2): the in-process contract block has no idempotency or transaction field. Recommend: a two-row Behaviour table.
- D6: §14.10 cannot say an in-process publication is durable. Recommend: one Delivery line above the §14.10 table, no new column.
- TD3: the BRD NFR-to-target table has no home in §18. Recommend: append §18.5 NFR Targets, with no renumbering.
- W2: §24.2 and §24.3 repeat §8.2 and §8.3 against the chunk's own no-duplication rule. Recommend: cite §8.2 and §8.3 and draw only what they add; §24.5 and §24.8 stay chunk 19's own views.
- W3: the §24.1 Archetype and Phase cells have no source. Recommend: state the derivation in the §24.1 comment; no table change.
- W7: the faithfulness sources stop at 09-13x, and a Proposed ADR can become a doctrine's home. Recommend: widen the sources to 02-13x and accept only §14.7 or an Accepted ADR as a doctrine home; the gate is unchanged.
- V1-8B3: step 8b.3 checks counts and sync edges only. Recommend: a cleared-context, read-only faithfulness review of chunk 19 whose mismatches are fixed before the gate line reads `Open - Up to date`.

## Items

### S2-3: Mermaid blocks over the ~30-line guideline (W9's size part folded in)

- Status: Present.
- Evidence: `sdd-unifier/mermaid-diagrams.md:58` "Keep diagrams scoped \u2014 split anything beyond ~30 lines into happy-path + error-path diagrams." The prescribed split only fits flows and sequences. check_mermaid on the e2e run: 6 blocks over, namely §8.3 (`04:53`, flowchart, 41 lines), §24.3 (`19:79`, flowchart, 41), three ERDs (`13a:93` 37, `13b:84` 35, `13d:67` 58) and one sequence (`05:110`, 36). `run-2026-09-30`: 4 over, the same kinds. The 58-line 13d ERD repeats every column of its Tables Design. `lld-unifier/mermaid-diagrams.md:45` has the same rule; the LLD runs have 0 blocks over.
- Class: D
- Fix (options):
  - A. Cap by kind. Workflows and sequences keep "about 30 lines, else split into happy path and error path". Layered views (§8.3, §24.3) and ERDs have no cap, and an ERD shows entities, keys, and relationships only; the other columns stay in Tables Design. Tradeoff: clears 5 of the 6 overruns at their cause and removes a copy of Tables Design; ERDs visibly lose their non-key columns.
  - B. Exempt layered views and ERDs, with no ERD content rule. Tradeoff: smallest change; ERDs stay as long as their tables (58 lines).
  - C. Raise the cap to about 45 lines for every kind. Tradeoff: one number; still short of the 58-line ERD, and looser for sequences.
  - D. Keep the rule and split structural views (an ERD per aggregate, a layered view per layer group). Tradeoff: no rule change; more figures, and a split layered view hides the cross-layer edges it exists to show.
  - Recommendation: A. The overruns are structural views the split rule never fit, and a keys-only ERD follows one fact, one home.
- Files (A): `sdd-unifier/mermaid-diagrams.md` (Block conventions, the size bullet); `sdd-unifier/chunks/13a-service-detailed-template.md` and `sdd-unifier/TEMPLATE-COMBINED.md` §17 (a comment under Entity Relationship: keys and relationships only); CROSS-SKILL `lld-unifier/mermaid-diagrams.md:45` only if one wording is wanted in both skills; fixture follow-up `_fixtures/checkers/check_mermaid.py` (skip ERDs and layered views).

### D4: chunk 10 §14.2-§14.9 when the only events are in-process, and the e2e event count

- Status: Present.
- Evidence: `sdd-unifier/chunking.md:135` deviation rule 6 covers only "A purely synchronous system (no eventing at all \u2014 rare under the EDA default)". `sdd-unifier/chunks/10-events-hub.md:29` "In a modular monolith or a hybrid core, domain events between modules are IN scope: catalogue them in §14.10, apart from the integration events on the broker." No text says what §14.2-§14.9 hold when there is no integration event; only the reverse case has wording (`10-events-hub.md:238` "A microservices SDD writes "Not applicable - no in-process events""). The 3d run improvised section by section (its `10-events-hub.md:36-104`). The count part (`19-e2e-system-design.md:32` has no in-process row, so six in-process events read 0) is fixed under T5.
- Class: S
- Recommended: the wording the module chunks already use (`13a-service-detailed-template.md:185` "Not applicable - no integration events"), keeping §14.7 and §14.8 because they still apply to §14.10 (`sdd-quality.md:181` flags in-process divergences in §14.8). Why: one wording across chunks 10 and 13x, and it matches the LLD's own rule (`lld-unifier/chunks/07-event-contracts.md:12` "a modular monolith with none writes `Not applicable - no broker`").
- Fix: D4.1, D4.2, D4.3.

**Edit D4.1** `sdd-unifier/chunks/10-events-hub.md`
current:
```text
In a modular monolith or a hybrid core, domain events between modules are IN scope: catalogue them in §14.10, apart from the integration events on the broker.
```
new:
```text
In a modular monolith or a hybrid core, domain events between modules are IN scope: catalogue them in §14.10, apart from the integration events on the broker.
A modular monolith with no integration events answers the four questions for its §14.10 events here and keeps the §14.2 to §14.9 headings, each reading `Not applicable - no integration events (in-process domain events: §14.10).`, except §14.7 and §14.8, which still apply to the §14.10 events, and §14.9.0, which may hold value objects the §14.10 DTOs share. It writes no §14.9.X event headings, and §14.9.99 states 0 integration events.
```

**Edit D4.2** `sdd-unifier/TEMPLATE-COMBINED.md`
current:
```text
In a modular monolith or a hybrid core, domain events between modules are IN scope: catalogue them in §14.10, apart from the integration events on the broker.
```
new:
```text
In a modular monolith or a hybrid core, domain events between modules are IN scope: catalogue them in §14.10, apart from the integration events on the broker.
A modular monolith with no integration events answers the four questions for its §14.10 events here and keeps the §14.2 to §14.9 headings, each reading `Not applicable - no integration events (in-process domain events: §14.10).`, except §14.7 and §14.8, which still apply to the §14.10 events, and §14.9.0, which may hold value objects the §14.10 DTOs share. It writes no §14.9.X event headings, and §14.9.99 states 0 integration events.
```

**Edit D4.3** `sdd-unifier/chunking.md`
current:
```text
plus the ADR that justified deviating from the EDA default.
```
new:
```text
plus the ADR that justified deviating from the EDA default. A modular monolith whose only events are in-process domain events is not this case: it fills §14.10, and the §14.1 comment of the chunk 10 skeleton says what §14.2 to §14.9 hold.
```

- Files: `sdd-unifier/chunks/10-events-hub.md`, `sdd-unifier/TEMPLATE-COMBINED.md`, `sdd-unifier/chunking.md`.

### D5: the in-process contract block has no transaction or idempotency field (TD2 is the same decision)

- Status: Present.
- Evidence: `sdd-unifier/chunks/11-api-contracts.md:199-229`: the `Internal (in-process)` block has "Port and authorization" (port, operation, DTOs, authorization, tenant context), "DTO fields", and "Errors raised"; only the HTTP block has a Behaviour table (`11-api-contracts.md:161-171`: idempotency, timeout, retries, circuit breaker, rate limit, pagination, fallback). The 3d run added a Behaviour table to its in-process API-01 (Idempotency, Transaction, Side effects, Timeout and retries).
- Class: D
- Fix (options):
  - A. Add a two-row **Behaviour** table to the in-process block: Idempotency (the key, and what a repeat returns) and Transaction (joins the caller's transaction, or runs in its own). Tradeoff: covers what the run needed; two more fields to fill, review, and carry to the LLD.
  - B. Add the same two rows to the existing "Port and authorization" table. Tradeoff: no new table; behaviour mixed into the identity table.
  - C. The run's fuller table (also Side effects, and "Timeout and retries: Not applicable"). Tradeoff: complete; boilerplate rows on every port.
  - D. No change; Purpose carries it. Tradeoff: nothing to change; the LLD § 9.6 row has no field to read, and runs keep differing.
  - Recommendation: A. Idempotency and transaction participation are the two facts a port call needs that the HTTP Behaviour table gives remote calls; timeouts and retries do not apply in process.
- Files (A): `sdd-unifier/chunks/11-api-contracts.md` (API-03 block); `sdd-unifier/TEMPLATE-COMBINED.md` §15.3 API-03; the in-process field lists in `sdd-unifier/SKILL.md:99` (principle 16), `:238` (step 6a.6), `:259` (step 7 brief) and `:274` (Cover at minimum), `sdd-unifier/sdd-quality.md:185`, `sdd-unifier/chunking.md:35`, `sdd-unifier/architecture-questionnaire.md:78`; CROSS-SKILL `lld-unifier/sdd-to-lld.md:309` and `lld-unifier/chunks/06-api-contracts.md` § 9.6 (the fields the LLD maps).

### D6: §14.10 cannot express a durable in-process publication

- Status: Present.
- Evidence: `sdd-unifier/chunks/10-events-hub.md:241` "| Event | Publisher module | Listener modules | When | Transaction phase (before commit / after commit) | Payload (DTO) | Notes |", and the same column at `13a-service-detailed-template.md:179`: the phase says when a listener runs, not whether the publication survives a stop between commit and delivery. The 3d run added eight "Delivery rules" above its §14.10 table; the e2e run wrote "after commit" and put durability in Notes and §11.1 ("Recorded in the durable publication log (§11.1) in the PAID transaction and replayed until the listener completes"). The LLD maps the phase to `@TransactionalEventListener` (`lld-unifier/chunks/07-event-contracts.md` § 10.6 Convention), which is not durable by itself.
- Class: D
- Fix (options):
  - A. One **Delivery** line above the §14.10 table, stated once for the deployable: durable (recorded in the publisher's transaction in a publication log, whose home is §11.1, and redelivered until each listener completes) or in memory (lost if the process stops before a listener runs). The Transaction phase column keeps its two values. Tradeoff: no table change; matches how the mechanism is configured (per deployable, not per event).
  - B. A Delivery column (durable / in memory) in §14.10 and in the 13a in-process table. Tradeoff: per-event precision; two template tables change shape, plus the step 6a.4 and LLD mapping lists.
  - C. New values for the column, such as `after commit (durable)`. Tradeoff: no new column; two properties in one cell.
  - D. No change; Notes and §11.1 carry it. Tradeoff: nothing to change; the two runs already differ.
  - Recommendation: A. Durability is a property of the publication mechanism, so one line says it once; a column would repeat the same value on every row.
- Files (A): `sdd-unifier/chunks/10-events-hub.md` §14.10 (comment and the line); `sdd-unifier/TEMPLATE-COMBINED.md` §14.10; CROSS-SKILL `lld-unifier/sdd-to-lld.md:307` (the LLD reads the Delivery line with the phase) and `lld-unifier/chunks/07-event-contracts.md` § 10.6 Convention; coordinate with E4 (the LLD outbox item, owned by another checker).

### D12: the syntax quick reference points outside the skill folder

- Status: Present.
- Evidence: `sdd-unifier/mermaid-diagrams.md:69` "See `../lld-unifier/mermaid-diagrams.md` § Mermaid syntax quick reference for the dialect cheatsheet (...) \u2014 the conventions are shared across the unifier skills." `README.md:468` "Each skill must be a folder containing its `SKILL.md` (plus any reference files), zipped and uploaded individually". The same pointer is at `brd-unifier/mermaid-diagrams.md:163`.
- Class: S
- Recommended: keep the path as an optional extra and say the rules do not depend on it. Why: nothing is copied, so nothing drifts between skills, and a standalone upload loses nothing it needs once W9 puts the one convention the SDD relies on (the async arrow) in its own file.
- Fix: D12.1, D12.2 (CROSS-SKILL).

**Edit D12.1** `sdd-unifier/mermaid-diagrams.md`
current:
```text
See `../lld-unifier/mermaid-diagrams.md` § Mermaid syntax quick reference for the dialect cheatsheet (`sequenceDiagram`, `classDiagram`, `stateDiagram-v2`, `erDiagram`, `flowchart`) \u2014 the conventions are shared across the unifier skills.
```
new:
```text
The rules above do not depend on another skill. When `../lld-unifier/mermaid-diagrams.md` exists (lld-unifier installed next to this skill), its § Mermaid syntax quick reference has a cheatsheet for the dialects used here (`sequenceDiagram`, `classDiagram`, `stateDiagram-v2`, `erDiagram`, `flowchart`).
```

**Edit D12.2 (CROSS-SKILL)** `brd-unifier/mermaid-diagrams.md`
current:
```text
See `../lld-unifier/mermaid-diagrams.md` § Mermaid syntax quick reference for the dialect cheatsheet \u2014 the conventions are shared across the unifier skills.
```
new:
```text
The rules above do not depend on another skill. When `../lld-unifier/mermaid-diagrams.md` exists (lld-unifier installed next to this skill), its § Mermaid syntax quick reference has a dialect cheatsheet.
```

- Files: `sdd-unifier/mermaid-diagrams.md`, `brd-unifier/mermaid-diagrams.md`.

### D13: module wording for Published and Consumed events; the `13a-service-` prefix

- Status: Present (the wording). The prefix part is Not reproducible: `sdd-unifier/architecture-questionnaire.md:78` says "Each `13x` chunk is a **module spec** on the same template: "service" reads as "module"", and `sdd-unifier/chunking.md:70-74` fixes the `13a-service-[slug].md` name. A rename would be a file-layout change with no defect behind it.
- Evidence: `sdd-unifier/chunks/13a-service-detailed-template.md:161-173`: "**Published events:**" and "**Consumed events:**" give no wording for a module with no integration events, while the sibling Messaging Infra does (`:185` "A module with no integration events writes "Not applicable - no integration events"."). The 3d run wrote its own "None: no integration events in this release (ADR-02)." under both.
- Class: M
- Fix: D13.1, D13.2 (the Messaging Infra wording, extended to the two tables above it).

**Edit D13.1** `sdd-unifier/chunks/13a-service-detailed-template.md`
current:
```text
#### Event Model
```
new:
```text
#### Event Model

<!-- Published events and Consumed events list integration events on the broker only. A module with no integration events writes "Not applicable - no integration events" under each. -->
```

**Edit D13.2** `sdd-unifier/TEMPLATE-COMBINED.md`
current:
```text
#### Event Model
```
new:
```text
#### Event Model

<!-- Published events and Consumed events list integration events on the broker only. A module with no integration events writes "Not applicable - no integration events" under each. -->
```

- Files: `sdd-unifier/chunks/13a-service-detailed-template.md`, `sdd-unifier/TEMPLATE-COMBINED.md`.

### TD1: 13b Error Handling bullets replaced by an accepted answer (3d template deviation)

- Status: Present.
- Evidence: `sdd-unifier/chunks/13a-service-detailed-template.md:206-212` has seven fixed bullets (Synchronous APIs, Validation errors, Domain errors, Auth errors, Server errors, Async consumers, Poison messages) and no rule for one that does not apply; `:14` "Each service follows the exact same structure for predictability and grep-ability." The 3d run's 13b (the payout module, reached through a port only) kept three of the bullets and added "Port errors" after OI-22 was accepted.
- Class: S
- Should the template allow it: no. Recommended: keep every bullet, say "Not applicable" for one that does not apply, and put a module's port errors under Synchronous APIs. Why: the template's own grep-ability rule, and the pattern `sdd-unifier/chunking.md:145` already uses ("write "Not applicable for this service." Don't omit silently."). A general step 8.3 rule that an accepted answer never reshapes the template would be a review-policy change (D); it is not proposed here.
- Fix: TD1.1, TD1.2.

**Edit TD1.1** `sdd-unifier/chunks/13a-service-detailed-template.md`
current:
```text
<!-- Derive-from-BRD: tie each domain error to the exception flow it realises,
```
new:
```text
<!-- Keep every bullet; a bullet that does not apply reads `Not applicable - [reason]`. In a module, the errors its in-process ports raise go under Synchronous APIs. Derive-from-BRD: tie each domain error to the exception flow it realises,
```

**Edit TD1.2** `sdd-unifier/TEMPLATE-COMBINED.md`
current:
```text
<!-- Derive-from-BRD: tie each domain error to the exception flow it realises,
```
new:
```text
<!-- Keep every bullet; a bullet that does not apply reads `Not applicable - [reason]`. In a module, the errors its in-process ports raise go under Synchronous APIs. Derive-from-BRD: tie each domain error to the exception flow it realises,
```

- Files: `sdd-unifier/chunks/13a-service-detailed-template.md`, `sdd-unifier/TEMPLATE-COMBINED.md`.

### TD2: a Behaviour table added to the in-process API-01 (3d template deviation)

- Status: Present (the D5 gap).
- Evidence: see D5.
- Class: D
- Should the template allow it: yes, in the form chosen under D5 (recommended: D5 option A, a two-row Behaviour table).
- Fix: decided with D5.
- Files: as D5.

### TD3: an NFR-to-target table before §18.1 (3d template deviation)

- Status: Present.
- Evidence: `sdd-unifier/chunks/14-performance-and-capacity.md:12-40` holds Load Estimates, per-service Throughput Targets, Peak Scenarios, and Stress Testing, with no place for a target that is not throughput or latency (availability, integrity, lag). `sdd-unifier/brd-to-sdd.md:244` asks the SDD to "translate each business measure into technical targets (availability %, latency budgets, capacity)", and `brd-to-sdd.md:15` asks a derived view to "name the source row/UC they derive from". Two of four saved runs added an unnumbered NFR-to-target table before §18.1 (`run-new` `14:14` "| BRD NFR | Technical target | Realised by |", the 3d run `14:14` "| NFR | Technical target | Realised in |"); `run-2026-09-30` and the e2e run did not.
- Class: D
- Should the template allow it: yes; the quantification needs one home.
- Fix (options):
  - A. Append §18.5 NFR Targets (`| BRD NFR | Technical target | Realised in |`, one row per keyed NFR of every source BRD). Tradeoff: one place to check that every NFR is quantified; it reads last, but nothing is renumbered, so the LLD links to `#182-throughput-targets-per-service` (`lld-unifier/chunks/12-performance.md:17`) keep working.
  - B. The same table unnumbered before §18.1, as the runs wrote it. Tradeoff: reads first; no anchor of its own.
  - C. Insert it as §18.1 and renumber 18.1-18.4. Tradeoff: reads first, with a number; breaks every §18.2 and §18.3 reference, the LLD's included.
  - D. No table; each target sits in the §18 or §11 row that realises it, citing the NFR. Tradeoff: nothing to change; no single check that every NFR is quantified, and runs keep differing.
  - Recommendation: A. It gives the quantification a home without breaking the LLD's §18.2 and §18.3 links.
- Files (A): `sdd-unifier/chunks/14-performance-and-capacity.md`; `sdd-unifier/TEMPLATE-COMBINED.md` §18; `sdd-unifier/chunks/sdd-master.md:156-159` (an 18.5 row); `sdd-unifier/brd-to-sdd.md:244` and § "§18 Performance & Capacity" (`:327-332`); `sdd-unifier/chunking.md:38` (row 14); optional CROSS-SKILL `lld-unifier/sdd-to-lld.md` (map §18.5 into LLD 12).

### TD4: §14.9.1 repurposed as "Integration event contracts - Not applicable" (3d template deviation)

- Status: Present (the D4 gap).
- Evidence: the 3d run's `10-events-hub.md:100-102` ("### 14.9.1 Integration event contracts", then "Not applicable for this release: no integration events."); the template's §14.9.1 is a per-event heading (`sdd-unifier/chunks/10-events-hub.md:214` "### 14.9.1 `[EVENT_NAME]` - [status]").
- Class: S
- Should the template allow it: no. With no integration event there is no per-event heading. Why: D4.1 says so ("It writes no §14.9.X event headings, and §14.9.99 states 0 integration events.").
- Fix: D4.1, D4.2.
- Files: as D4.

### V-1: §24.7 lists the external contracts as synchronous edges

- Status: Present.
- Evidence: `sdd-unifier/chunks/19-e2e-system-design.md:135` "<!-- The whole-system view of every service-to-service synchronous call." (scope: service to service) and `:33` "| Synchronous HTTP edges | [N] | §24.7 |" (scope unstated); `sdd-unifier/SKILL.md:302` "external systems appear in the e2e design at the system-context level only". The e2e run listed its four External outbound contracts in §24.7 and counted "Synchronous HTTP edges 4". check_e2e on the saved run gives 5 problems, all this one ("§24.7 HTTP rows 4 vs §15.2 internal HTTP contracts 0", and four "§24.7 cites API-0N, which is not an internal contract in §15.2"). The template comment, SKILL.md, and the checker agree that §24.7 holds internal contracts only; no text says so outright, or says what §24.7 holds when there is none.
- Class: M
- Fix: V-1.1 to V-1.4.

**Edit V-1.1** `sdd-unifier/chunks/19-e2e-system-design.md`
current:
```text
<!-- The whole-system view of every service-to-service synchronous call.
```
new:
```text
<!-- The whole-system view of every service-to-service synchronous call: one row per §15.2 contract of Type Internal or Internal (in-process), and no other row. External contracts are not rows here. With no such contract, write `None: no synchronous call between services (external contracts: §15.2).` in place of the table.
```

**Edit V-1.2** `sdd-unifier/TEMPLATE-COMBINED.md`
current:
```text
<!-- The whole-system view of every service-to-service synchronous call.
```
new:
```text
<!-- The whole-system view of every service-to-service synchronous call: one row per §15.2 contract of Type Internal or Internal (in-process), and no other row. External contracts are not rows here. With no such contract, write `None: no synchronous call between services (external contracts: §15.2).` in place of the table.
```

**Edit V-1.3** `sdd-unifier/chunks/19-e2e-system-design.md`
current:
```text
| Synchronous HTTP edges | [N] | §24.7 |
```
new:
```text
| Synchronous HTTP edges between services | [N] | §24.7 |
```

**Edit V-1.4** `sdd-unifier/TEMPLATE-COMBINED.md`
current:
```text
| Synchronous HTTP edges | [N] | §24.7 |
```
new:
```text
| Synchronous HTTP edges between services | [N] | §24.7 |
```

- Files: `sdd-unifier/chunks/19-e2e-system-design.md`, `sdd-unifier/TEMPLATE-COMBINED.md`. (check_e2e matches the row by its start, "Synchronous HTTP edges", so the new label still reads.)

### T5: chunk 19 template gaps for a hybrid

- Status: Present (the Counts row and 24.5.2). The VERSION part is skipped: the version-bump family, owned by another checker.
- Evidence: `sdd-unifier/chunks/19-e2e-system-design.md:28-35`: Counts at a Glance has no in-process events row (the e2e run added "| In-process domain events | 1 (`RefundPaid`) | §14.10 (chunk 10) |"); `:98` "One sub-section per delivery phase." while 24.5.1 and 24.5.2 are fixed headings, and `sdd-unifier/chunking.md:130` keeps an empty section as "Not applicable for this release."; the e2e run's 24.5.2 line (its `19:152`) carried V1's one Wrong claim, "The one planned change to this map, the extraction of loyalty-service". `sdd-unifier/SKILL.md:305` and `sdd-unifier/sdd-quality.md:191` check the counts against §13, §14.4, and §14.9 only.
- Class: S
- Recommended: an "In-process domain events" row sourced from §14.10 and checked like the others, and a fixed Not applicable line for a single-phase 24.5.2. Why: §24.5 and §24.7 already label in-process edges and count in-process port calls, so the events were the one dimension left out; a fixed line keeps an empty section from inviting new claims.
- Fix: T5.1 to T5.6. The SKILL.md 8b.3 counts sentence is edited in W1.1.

**Edit T5.1** `sdd-unifier/chunks/19-e2e-system-design.md`
current:
```text
| Distinct published events | [N] | §14.9 coverage matrix (chunk 10) |
```
new:
```text
| Distinct published events | [N] | §14.9 coverage matrix (chunk 10) |
| In-process domain events | [N] | §14.10 (chunk 10) |
```

**Edit T5.2** `sdd-unifier/TEMPLATE-COMBINED.md`
current:
```text
| Distinct published events | [N] | §14.9 coverage matrix (chunk 10) |
```
new:
```text
| Distinct published events | [N] | §14.9 coverage matrix (chunk 10) |
| In-process domain events | [N] | §14.10 (chunk 10) |
```

**Edit T5.3** `sdd-unifier/chunks/19-e2e-system-design.md`
current:
```text
The exhaustive matrix stays in §14.5; this is the navigable visual.
```
new:
```text
The exhaustive matrix stays in §14.5; this is the navigable visual. With one delivery phase, 24.5.2 reads `Not applicable for this release: one delivery phase.` and nothing more.
```

**Edit T5.4** `sdd-unifier/TEMPLATE-COMBINED.md`
current:
```text
The exhaustive matrix stays in §14.5; this is the navigable visual.
```
new:
```text
The exhaustive matrix stays in §14.5; this is the navigable visual. With one delivery phase, 24.5.2 reads `Not applicable for this release: one delivery phase.` and nothing more.
```

**Edit T5.5** `sdd-unifier/sdd-quality.md`
current:
```text
**Test (e2e):** do the counts in §24 "Counts at a glance" match §13 (services), §14.4 (topics), and §14.9 coverage (events) exactly?
```
new:
```text
**Test (e2e):** do the counts in §24 "Counts at a Glance" match §13 (services), §14.4 (topics), §14.9 coverage (events), and §14.10 (in-process domain events) exactly?
```

**Edit T5.6** `sdd-unifier/SKILL.md`
current:
```text
chunk 19 was written (service, topic, event, sync-edge, and saga counts)
```
new:
```text
chunk 19 was written (service, topic, event, in-process event, sync-edge, and saga counts)
```

- Files: `sdd-unifier/chunks/19-e2e-system-design.md`, `sdd-unifier/TEMPLATE-COMBINED.md`, `sdd-unifier/sdd-quality.md`, `sdd-unifier/SKILL.md`.

### T6: Mermaid validated by reading only; `end` in an `else` label

- Status: Present (the validation method is unstated). The `end` concern is Not reproducible: in Mermaid's sequence grammar an `else` label and a message after `:` are read to the end of the line, so `end` inside them is text; the known trap is a node or participant named `end` (`brd-unifier/mermaid-diagrams.md:154` "Never use `end` as an ID."). Not confirmed with a parser: none is installed here, and installing one is a new dependency.
- Evidence: `sdd-unifier/mermaid-diagrams.md:63` "1. Validate every emitted Mermaid block parses (syntactically) before writing." and `sdd-unifier/SKILL.md:179` "Validate every emitted Mermaid block parses" name no method, so a session without a parser can only read. `brd-unifier/mermaid-diagrams.md:156` already states the fallback: "If a Mermaid parser or renderer is available in the session, parse every block with it (...); otherwise check each block line by line against the examples in this file."
- Class: S
- Recommended: state the brd-unifier fallback in the SDD file. Why: the chain already uses this wording, and it makes the step true in a session with no parser.
- Fix: T6.1.

**Edit T6.1** `sdd-unifier/mermaid-diagrams.md`
current:
```text
1. Validate every emitted Mermaid block parses (syntactically) before writing.
```
new:
```text
1. Validate every emitted Mermaid block parses (syntactically) before writing: with a Mermaid parser when one is available in the session, otherwise by checking each block line by line against the examples in the chunk templates.
```

- Files: `sdd-unifier/mermaid-diagrams.md`.

### W1: §24.7 scope, the direction of the 8b.3 check, and "system-context level"

- Status: Present.
- Evidence: the scope and the empty case: see V-1. `sdd-unifier/SKILL.md:305` "and every sync edge against §15.2" (one direction; `_fixtures/checkers/check_e2e.py:263-274` checks both). `sdd-unifier/SKILL.md:302` "external systems appear in the e2e design at the system-context level only": the e2e run repeated the phrase in its Faithfulness list (its `19:45`) while drawing the externals in §24.3, §24.7, and both sagas, which V1 rated misleading; the phrase can be read as a place (§24.2 only) or as a level of detail.
- Class: S
- Recommended: check §24.7 against §15.2 both ways (this part alone is M: the template calls §24.7 "every" service-to-service call), and read "system-context level" as a level of detail (a named box with its API IDs, no contract fields), not as a place. Why: E3 uses the phrase only to explain why provider TBDs do not block, and the sagas that call a provider stay complete.
- Fix: W1.1, W1.2 (W1.1 also carries T5's §14.10 count).

**Edit W1.1** `sdd-unifier/SKILL.md`
current:
```text
then check the counts in "Counts at a Glance" against §13, §14.4, and §14.9 coverage, and every sync edge against §15.2.
```
new:
```text
then check the counts in "Counts at a Glance" against §13, §14.4, §14.9 coverage, and §14.10, and check §24.7 against §15.2 both ways: each row cites an Internal or Internal (in-process) contract, and each such contract has a row.
```

**Edit W1.2** `sdd-unifier/SKILL.md`
current:
```text
`[TBD - EXTERNAL: ...]` markers do not block: external systems appear in the e2e design at the system-context level only.
```
new:
```text
`[TBD - EXTERNAL: ...]` markers do not block: the e2e design shows an external system only as a named box with its API IDs, never with contract fields.
```

- Files: `sdd-unifier/SKILL.md`.

### W2: NO_DUPLICATION_RULE against the required diagrams

- Status: Present.
- Evidence: `sdd-unifier/chunks/19-e2e-system-design.md:11` "This chunk shows only what no other chunk shows (the whole-system fan-out maps and saga views).", yet the template requires §24.2 System Context (`:51`) and §24.3 Layered High-Level Architecture (`:63`), which §8.2 and §8.3 also draw (`04-architecture-style-and-diagrams.md:37`, `:53`). `sdd-unifier/SKILL.md:93` (principle 10): the consolidation chunks are views that "reference \u2014 never mirror \u2014 each other". The copies already drift: in the e2e run §8.3 labels the core database "refund and loyalty schemas" (its `04:70`) and §24.3 "refund, loyalty, and core_events schemas" (its `19:97`). The overlap of §24.5 with §14.2.2 and of §24.8 with §8.5 sits on the other side: the rule names fan-out maps and sagas as chunk 19's own.
- Class: D
- Fix (options):
  - A. Context and layers by reference: §24.2 and §24.3 cite §8.2 and §8.3 and draw only what they add (for example, the module grouping, topics, and DLQs); when they add nothing, the sub-section is the pointer and its Summary. §24.5 and §24.8 stay chunk 19's own views. Tradeoff: no duplicated picture to drift; chunk 19 is no longer a stand-alone map, and readers follow two links to chunk 04.
  - B. Diagrams are views: the rule covers normative text and tables; §24 may redraw §8.2 and §8.3 from the reconciled state, each Summary naming the figure it overlaps. Tradeoff: chunk 19 stays the "one self-contained system map" (`sdd-master.md:186`); two copies of each picture can drift (already seen).
  - C. Drop §24.2 and §24.3 from the template. Tradeoff: simplest; loses the whole-system pictures where §8.3 shows only clusters (large platforms).
  - Recommendation: A. It keeps the skill's one fact, one home rule and removes the drift V1 found, at the cost of two links.
- Files (A): `sdd-unifier/chunks/19-e2e-system-design.md` (header NO_DUPLICATION_RULE, §24.2 and §24.3 comments); `sdd-unifier/TEMPLATE-COMBINED.md` §24 (lead paragraph, §24.2, §24.3); `sdd-unifier/sdd-quality.md:191` (Test e2e); `sdd-unifier/chunks/sdd-master.md:186` ("one self-contained system map"); fixture follow-up `_fixtures/checkers/check_e2e.py:276-282` (its §24.2 external-system check would follow the pointer to §8.2).

### W3: the §24.1 Archetype and Phase cells have no source; "key family"

- Status: Present.
- Evidence: `sdd-unifier/chunks/19-e2e-system-design.md:45` "<!-- One row per service: archetype (domain / reusable-generic / edge / read-model / orchestrator), phase, key family, sync surface, async surface." with no definitions; the table (`:47`) has no Key family column, and key family belongs to §14.4 (`:168`). Chunk 09's table (`09-services-summary.md:14`) has no archetype or phase column, and §14.4's Phase is per topic. FAITHFULNESS_RULE: `:10`.
- Class: D. The key-family sub-fix (W3.1, W3.2) is M and holds under every option, so it can be applied now.
- Fix (options):
  - A. Add Archetype and Phase columns to the 09 §13 table, with the vocabulary defined in its comment; §24.1 copies them. Tradeoff: full traceability; a 14-column table, filled in every SDD even when chunk 19 is never written.
  - B. Keep the §24.1 columns and state the derivation in its comment: each archetype defined in a few words and chosen from the service's 09 Responsibility; Phase from the §14.4 Phase of the topics it owns, else of those it consumes, else the single release phase. Tradeoff: no table change; the archetype stays a judgment, now a stated one.
  - C. Drop Archetype and Phase from §24.1 (heading "Service Landscape"); §24.5 keeps the phase split from §14.4. Tradeoff: simplest and fully faithful; loses the archetype view that helps large platforms with reusable services.
  - Recommendation: B. V1 rated these cells cosmetic; a stated derivation closes the faithfulness gap without widening chunk 09.
- Files (B): `sdd-unifier/chunks/19-e2e-system-design.md` and `sdd-unifier/TEMPLATE-COMBINED.md` (the §24.1 comment).

**Edit W3.1 (M, any option)** `sdd-unifier/chunks/19-e2e-system-design.md`
current:
```text
phase, key family, sync surface, async surface.
```
new:
```text
phase, sync surface, async surface.
```

**Edit W3.2 (M, any option)** `sdd-unifier/TEMPLATE-COMBINED.md`
current:
```text
phase, key family, sync surface, async surface.
```
new:
```text
phase, sync surface, async surface.
```

### W4: Counts at a Glance

- Status: Present.
- Evidence: `sdd-unifier/chunks/19-e2e-system-design.md:32-33`: no in-process events row, and "Synchronous HTTP edges" with no scope.
- Class: S
- Fix: T5.1 and T5.2 (the row), V-1.3 and V-1.4 (the label). No edit of its own.
- Files: as T5 and V-1.

### W5: "24.5.1 Phase 1 Core" collides with the hybrid core deployable

- Status: Present.
- Evidence: `sdd-unifier/chunks/19-e2e-system-design.md:100` "### 24.5.1 Phase 1 Core"; in a hybrid, "core" names the core deployable (the e2e run's §24.1: "module of `refunds-platform-core`"). No file links the heading: only the two templates contain it.
- Class: M
- Fix: W5.1, W5.2 ("Domains", parallel to "24.5.2 Phase 2+ Domains").

**Edit W5.1** `sdd-unifier/chunks/19-e2e-system-design.md`
current:
```text
### 24.5.1 Phase 1 Core
```
new:
```text
### 24.5.1 Phase 1 Domains
```

**Edit W5.2** `sdd-unifier/TEMPLATE-COMBINED.md`
current:
```text
### 24.5.1 Phase 1 Core
```
new:
```text
### 24.5.1 Phase 1 Domains
```

- Files: `sdd-unifier/chunks/19-e2e-system-design.md`, `sdd-unifier/TEMPLATE-COMBINED.md`.

### W6: fixed wording that breaks for an in-process edge

- Status: Present.
- Evidence: `sdd-unifier/chunks/19-e2e-system-design.md:94` "... topic → per-consumer queue with inbox dedup and DLQ." and `:170` "- **Cross-cutting guarantees every edge inherits:** §14.6."; chunk 10 scopes both to broker events: `10-events-hub.md:61` "Integration events on the broker only. The in-process domain events of §14.10 do not use this mechanism." and `:162` "The invariants every integration-event edge on the broker inherits (the in-process domain events of §14.10 are outside them)"; its §14.2.1 diagram says "Queue / group" (`:73`). The newer chunk 10 scoping is right; the chunk 19 lines predate it.
- Class: M
- Fix: W6.1 to W6.6 (W6.3 and W6.4 also give §24.4 the D4 wording for a monolith with no broker).

**Edit W6.1** `sdd-unifier/chunks/19-e2e-system-design.md`
current:
```text
per-consumer queue with inbox dedup and DLQ.
```
new:
```text
per-consumer queue or consumer group with inbox dedup and DLQ. In-process domain events (§14.10) do not use it.
```

**Edit W6.2** `sdd-unifier/TEMPLATE-COMBINED.md`
current:
```text
per-consumer queue with inbox dedup and DLQ.
```
new:
```text
per-consumer queue or consumer group with inbox dedup and DLQ. In-process domain events (§14.10) do not use it.
```

**Edit W6.3** `sdd-unifier/chunks/19-e2e-system-design.md`
current:
```text
One prose sentence + the pointer.
```
new:
```text
One prose sentence + the pointer. A modular monolith with no integration events writes `Not applicable - no integration events (in-process domain events: §14.10).` instead.
```

**Edit W6.4** `sdd-unifier/TEMPLATE-COMBINED.md`
current:
```text
One prose sentence + the pointer.
```
new:
```text
One prose sentence + the pointer. A modular monolith with no integration events writes `Not applicable - no integration events (in-process domain events: §14.10).` instead.
```

**Edit W6.5** `sdd-unifier/chunks/19-e2e-system-design.md`
current:
```text
- **Cross-cutting guarantees every edge inherits:** §14.6.
```
new:
```text
- **Cross-cutting guarantees every broker event edge inherits:** §14.6 (in-process domain events: §14.10).
```

**Edit W6.6** `sdd-unifier/TEMPLATE-COMBINED.md`
current:
```text
- **Cross-cutting guarantees every edge inherits:** §14.6.
```
new:
```text
- **Cross-cutting guarantees every broker event edge inherits:** §14.6 (in-process domain events: §14.10).
```

- Files: `sdd-unifier/chunks/19-e2e-system-design.md`, `sdd-unifier/TEMPLATE-COMBINED.md`.

### W7: the faithfulness sources, and a Proposed ADR as a doctrine's home

- Status: Present.
- Evidence: `sdd-unifier/chunks/19-e2e-system-design.md:10` "Every count, name, and edge must trace to chunks 09, 10, 11, 12, and 13x.", while §24.2 and §24.3 draw users, the gateway, IAM, and external systems (chunks 02, 03, 08), §24.8 consolidates §8.5 (05), and §24.6 points to "(§14.7 / ADR)" (`:129`; ADRs live in 06); `:6` DEPENDS_ON already lists 04 and 05. `sdd-unifier/SKILL.md:302` (E3) checks 09-13x and 03 §7.3 only, so the e2e run's doctrine 8 names ADR-08, which is Proposed with an open marker (its `06:40`; `_fixtures/notes/step4-findings.md:85`).
- Class: D
- Fix (options):
  - A. Widen the source list to what the chunk reads (02 to 08, and 09 to 13x) and accept a doctrine home only in §14.7 or an Accepted ADR; a doctrine whose ADR is still Proposed is left out of §24.6 and named in the Faithfulness list. The gate is unchanged. Tradeoff: faithful and settled; an unsettled doctrine waits for its ADR.
  - B. A, plus E3 extended to chunk 06 (no marker in an ADR and no Proposed ADR). Tradeoff: chunk 19 only on a settled ADR set; the gate shuts more often (the e2e run would have stayed Locked on ADR-04 and ADR-08).
  - C. Widen the source list only. Tradeoff: smallest; a Proposed ADR can still be cited as a doctrine home.
  - Recommendation: A. It closes the hole where it bites (§24.6) without changing the gate.
- Files (A): `sdd-unifier/chunks/19-e2e-system-design.md` (DEPENDS_ON, FAITHFULNESS_RULE, §24.6 comment, Sources); `sdd-unifier/TEMPLATE-COMBINED.md` §24 (§24.6 comment, Sources); `sdd-unifier/SKILL.md:305` ("a faithful consolidation of 09, 10, 11, 12, and `13x`"); `sdd-unifier/chunking.md:93` (Contract consistency rule 6); `sdd-unifier/parts-mode.md:108`; `sdd-unifier/brd-to-sdd.md:344`; `sdd-unifier/chunks/sdd-master.md:186` and `:215`.

### W8: no selection rule for the §24.8 sagas

- Status: Present.
- Evidence: `sdd-unifier/chunks/19-e2e-system-design.md:143` "One sub-section per load-bearing cross-service flow" with no criterion. The e2e run chose "the two cross-service flows that carry money and points" and called the rest "single-hop event fan-outs"; its §24.8.2 is an in-process module flow, which the comment neither includes nor excludes.
- Class: S
- Recommended: a flow that changes the business state of two or more §13 rows (services or modules), where a message sent or an audit record is not business state; a qualifying flow that is not drawn is named in the Faithfulness list. Why: it selects exactly the run's two flows, and counting modules keeps sagas in a modular monolith.
- Fix: W8.1, W8.2.

**Edit W8.1** `sdd-unifier/chunks/19-e2e-system-design.md`
current:
```text
<!-- One sub-section per load-bearing cross-service flow: orchestrator (or choreography), participants, happy path, compensation path.
```
new:
```text
<!-- One sub-section per load-bearing cross-service flow: a flow that changes the business state of two or more §13 rows, services or modules (a message sent or an audit record written is not business state). A qualifying flow that is not drawn is named in the Faithfulness list. Each sub-section: orchestrator (or choreography), participants, happy path, compensation path.
```

**Edit W8.2** `sdd-unifier/TEMPLATE-COMBINED.md`
current:
```text
<!-- One sub-section per load-bearing cross-service flow: orchestrator (or choreography), participants, happy path, compensation path.
```
new:
```text
<!-- One sub-section per load-bearing cross-service flow: a flow that changes the business state of two or more §13 rows, services or modules (a message sent or an audit record written is not business state). A qualifying flow that is not drawn is named in the Faithfulness list. Each sub-section: orchestrator (or choreography), participants, happy path, compensation path.
```

- Files: `sdd-unifier/chunks/19-e2e-system-design.md`, `sdd-unifier/TEMPLATE-COMBINED.md`.

### W9: async arrows in sequence diagrams (the size part is in S2-3)

- Status: Present.
- Evidence: `sdd-unifier/chunks/19-e2e-system-design.md:155` "A--)O: EVENT_A" is, with its TEMPLATE-COMBINED copy, the only `--)` in the five skills; `sdd-unifier/mermaid-diagrams.md` states no arrow convention, and the chunk 05 template has no async example. The e2e run drew Kafka publications with `->>` (its `19:197` "R->>K: REFUND_APPROVED, relayed after commit", `05:125`) and in-process events with `-)` (its `05:136`, `19:209`, and the LLD's `04-implementation/refund-service.md:994`); `lld-unifier/mermaid-diagrams.md:79` "A-)B: asynchronous call (no response expected)".
- Class: S
- Recommended: `-)` for every asynchronous message. Why: the shared quick reference and every async arrow the runs drew use it; only the template differs.
- Fix: W9.1 to W9.3.

**Edit W9.1** `sdd-unifier/mermaid-diagrams.md`
current:
```text
- Use named participants / meaningful node ids; annotate alt-paths for error scenarios.
```
new:
```text
- Use named participants / meaningful node ids; annotate alt-paths for error scenarios.
- In sequence diagrams, a synchronous call is `->>` and its reply `-->>`; an asynchronous message (an event or a queued job) is `-)`.
```

**Edit W9.2** `sdd-unifier/chunks/19-e2e-system-design.md`
current:
```text
  A--)O: EVENT_A
```
new:
```text
  A-)O: EVENT_A
```

**Edit W9.3** `sdd-unifier/TEMPLATE-COMBINED.md`
current:
```text
  A--)O: EVENT_A
```
new:
```text
  A-)O: EVENT_A
```

- Files: `sdd-unifier/mermaid-diagrams.md`, `sdd-unifier/chunks/19-e2e-system-design.md`, `sdd-unifier/TEMPLATE-COMBINED.md`.

### V1-8B3: step 8b.3 validates counts and sync edges only (is a faithfulness check missing?)

- Status: Present. Yes, a faithfulness check is missing.
- Evidence: `sdd-unifier/SKILL.md:305` "Validate every Mermaid block, then check the counts in "Counts at a Glance" against §13, §14.4, and §14.9 coverage, and every sync edge against §15.2." The step 7 reviewer runs before chunk 19 exists (`SKILL.md:248` "chunks 00-17 exist, chunk 19 does not yet"), so on a first write no review reads it. V1, a cleared-context read of about 17 minutes, found 17 mismatches, 1 wrong and 3 misleading (`_fixtures/notes/step4-findings.md:82-85`); the run's 8b.3 checks passed all 17, and check_e2e caught only V-1.
- Class: D
- Fix (options):
  - A. Self-check: after writing, the same agent re-reads every chunk 19 claim (table cell, edge label, Summary sentence, Faithfulness bullet) against its source and fixes or removes what the sources do not say. Tradeoff: no new step and no cost; the authoring context anchors on its own reading, which is why step 7 uses a fresh agent.
  - B. A cleared-context faithfulness review at 8b.3: a read-only subagent compares chunk 19 with its sources (the W7 list) and labels each mismatch wrong, misleading, or cosmetic; the agent fixes chunk 19 before the gate line reads `Open - Up to date`, lists source-chunk problems in the handoff (never fixed inside chunk 19), and reports the counts. Tradeoff: one subagent per write or refresh; catches what V1 caught; fixes in place, so E1 stays met.
  - C. Send chunk 19 through step 7, its findings becoming OIs. Tradeoff: reuses the existing review; new OIs reopen E1 and mark the chunk Stale right after it is written, a loop.
  - D. No change; rely on business-reviewer-unifier. Tradeoff: no cost; errors ship until someone runs it.
  - Recommendation: B. Step 7's own reason (the author anchors on its choices) applies to chunk 19, which no review reads today, and fixing in place avoids C's loop.
- Files (B): `sdd-unifier/SKILL.md` step 8b.3 and step 9 (the E2E gate line reports the review); `sdd-unifier/README.md:67` (workflow step 8); `sdd-unifier/parts-mode.md:108` (exit checklist).

### V1-SRC: the source-chunk problems V1 found (not chunk 19)

- Status: Not a skill issue. §17.1 Submit re-reading the receipt through API-01 (13a:42, 13a:350) against §8.5.1, §12 INT-03, and §15.3; §8.3's core database label without `core_events` (04:70); §14.2.2 Figure 10 drawing every edge: all run content in `_fixtures/chain/run-2026-10-01-e2e/sdd-refunds-platform`, for the fixture fix-or-accept list (`UNIFIER-ENHANCEMENTS.md` § Step 5, "SDD content left wrong by the runs").

## New items

### N-1: two texts for the Mermaid fallback marker

- Status: Present.
- Evidence: `sdd-unifier/SKILL.md:179` "`[NEEDS CLARIFICATION: Mermaid syntax error \u2014 review]`" against `sdd-unifier/mermaid-diagrams.md:64` "`[NEEDS CLARIFICATION: Mermaid syntax error \u2014 review and fix]`". Both are also copy-verbatim lines of the em dash item.
- Class: M
- Fix: N-1.1, N-1.2 (the fuller text, with a colon in place of the em dash; coordinate with the em dash cleanup, which covers these lines too).

**Edit N-1.1** `sdd-unifier/SKILL.md`
current:
```text
`[NEEDS CLARIFICATION: Mermaid syntax error \u2014 review]`
```
new:
```text
`[NEEDS CLARIFICATION: Mermaid syntax error: review and fix]`
```

**Edit N-1.2** `sdd-unifier/mermaid-diagrams.md`
current:
```text
`[NEEDS CLARIFICATION: Mermaid syntax error \u2014 review and fix]`
```
new:
```text
`[NEEDS CLARIFICATION: Mermaid syntax error: review and fix]`
```

- Files: `sdd-unifier/SKILL.md`, `sdd-unifier/mermaid-diagrams.md`.

### N-2: the 13a "Not applicable" wording for a microservice's in-process table

- Status: Present.
- Evidence: `sdd-unifier/chunks/13a-service-detailed-template.md:177` "A microservice writes "Not applicable"." against `sdd-unifier/chunks/10-events-hub.md:238` "A microservices SDD writes "Not applicable - no in-process events"" and the LLD mapping (`lld-unifier/sdd-to-lld.md:307` "A microservices SDD gives `Not applicable - no in-process events`").
- Class: M
- Fix: N-2.1, N-2.2.

**Edit N-2.1** `sdd-unifier/chunks/13a-service-detailed-template.md`
current:
```text
A microservice writes "Not applicable". -->
```
new:
```text
A microservice writes "Not applicable - no in-process events". -->
```

**Edit N-2.2** `sdd-unifier/TEMPLATE-COMBINED.md`
current:
```text
A microservice writes "Not applicable". -->
```
new:
```text
A microservice writes "Not applicable - no in-process events". -->
```

- Files: `sdd-unifier/chunks/13a-service-detailed-template.md`, `sdd-unifier/TEMPLATE-COMBINED.md`.

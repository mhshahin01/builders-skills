# Triage: lld

## Summary

Scope: lld-unifier step 2 items L2-5 to L2-10k, step 3 E1 to E12 (3d) and L2, L3, L6 to L10 (3c), step 4 C1-1, C1-3, C1-6, C1-7, C1-8, C1-10, and the five C1 SDD inconsistencies.

Notes for the fixer:
- No lld-unifier file has changed since b3cf5a2 (2026-09-30), which is an ancestor of 86cab74, the step 2 run's base. So no item was fixed by later work. The working tree was clean on `fix/unifier-fix-round` when read.
- `python _fixtures/checkers/check_refs.py lld-unifier sdd-unifier`: 182 references, 0 problems.
- In quoted current text, `[em dash]` stands for the U+2014 character. This file contains none.
- Every quoted "current" string was checked with a script: it occurs exactly once in its file, or the stated number of times where the fix says "replace all".

Counts per Status (42 entries: 41 IDs plus one entry for the five C1 SDD inconsistencies):
- Present: 41 (L2-10j is narrower than logged; see its entry)
- Fixed: 0
- Partly fixed: 0
- Not reproducible: 0
- Not a skill issue: 1 (the five C1 SDD inconsistencies)

Counts per Class (the 41 Present IDs):
- M: 12 (L2-7, L2-8, L2-10e, L2-10g, L2-10i, E1, E5, E8, L9, L10, C1-1, C1-6)
- S: 12 (L2-5, L2-10a, L2-10c, L2-10f, L2-10j, E6, E9, E11, E12, L2, L7, C1-3)
- D: 17 IDs, 9 distinct decisions (L2-6, L2-9, L2-10b = E2 = L8 = C1-7, L2-10d = E7, L2-10h, L2-10k = E3 = C1-8, E4, E10 = L6 = C1-10, L3)

New items: 2 (N-1 M, N-2 M).

D items, one line each:
1. L2-6: give non-use-case jobs and BRD reports a home. Recommend A: `### Workflow: [name]` blocks in a traced LLD with a "No BRD use case" line, and a `None - no BRD screen` route value.
2. L2-9: where per-instance Resilience4j settings live. Recommend A: an instance table under the defaults table in 09 § 12.3.
3. L2-10b (= E2, L8, C1-7): link target when a screen has a chunk 14 row and a screen ID. Recommend A: the chunk 14 row wins (`14-todo.md#mockup-coverage`).
4. L2-10d (= E7): `@UseCase` on listeners and jobs that realise later use-case steps. Recommend B: tag them as the LLD's own delta.
5. L2-10h: missing version pins at step 6b. Recommend A: never ask in the LLD; flag in § 6.3 and send it to SDD §6.
6. L2-10k (= E3, C1-8): "Direct lift" against one fact, one home. Recommend A: 05 tables and 10 § 13.1 defaults become derived views with a Source per row.
7. E4: outbox for provider writes and durable in-process events in a modular monolith. Recommend A: widen the Outbox rule to any side effect that must not be lost.
8. E10 (= L6, C1-10): the § 18.5 summary has no unit and misses sections. Recommend A: count open flags only, with a row for every section.
9. L3: a new SDD version and a BRD change fire two triggers with one offer. Recommend A: step 3c also compares the BRD state in 16 § 19.1 and makes one offer.

## Items

### L2-5: 4 of 8 routes have no route data, and the run's own check missed it
- Status: Present.
- Evidence: lld-unifier/chunks/14-frontend.md:58 "**Use-case context at runtime.** Every route that implements a BRD screen carries it in its route data, so a frontend error report names the screen and the use case:", followed by one example route only (14-frontend.md:60-66). lld-unifier/sdd-to-lld.md:178 (Check 3) "every route's `data` matches its row." The e2e run wrote `data` for 4 routes and covered the other 4 with "The other BRD-screen routes follow the same pattern with the values of the table" (_fixtures/chain/run-2026-10-01-e2e/lld-refunds-platform/14-frontend.md, § 17.3), so its step 6a passed while check_trace reports "no route data" for 4 routes.
- Class: S. Recommended: one route-config entry with its own `data` per table row that has a BRD screen. Why: Check 3 and the fixture checker already assume it, and the implementer gets a complete route config. The alternative (the table is the only home, drop the per-route check) leaves Check 3 with nothing to check.
- Fix:
  1. lld-unifier/chunks/14-frontend.md / current: "**Use-case context at runtime.** Every route that implements a BRD screen carries it in its route data, so a frontend error report names the screen and the use case:" / new: "**Use-case context at runtime.** Every route that implements a BRD screen carries it in its route data, so a frontend error report names the screen and the use case. The route configuration lists each such route with its own `data` entry, one per table row with a BRD screen; a sentence that summarises the rest does not count:"
  2. lld-unifier/TEMPLATE-COMBINED.md / current: same as 1 / new: same as 1.
  3. lld-unifier/sdd-to-lld.md / current: "every route's `data` matches its row." / new: "every route with a BRD screen has its own `data` entry in the 14 §17.3 route configuration, and it matches its row."
- Files: lld-unifier/chunks/14-frontend.md, lld-unifier/TEMPLATE-COMBINED.md, lld-unifier/sdd-to-lld.md.

### L2-6: reports and watchdog jobs have no home in 04 or § 17.3
- Status: Present.
- Evidence: lld-unifier/chunks/04-implementation-template.md:294 "one subsection per active use case this service owns (SDD §7.3 Owner)"; :303 "No source BRD, or pure from-code: heading "### Workflow: [Flow name]" ...". lld-unifier/chunks/14-frontend.md:46 allows only an MK-NN, a screen ID, or "None - platform page". Yet lld-unifier/agent-orchestration.md:152 already heads unmatched entry points `### Workflow: [name]` in from-code with an SDD, so the directions disagree. The e2e run invented both: "### Workflow: Payout watchdog" with "> **Traceability:** No BRD use case - realises [REFUNDS/NFR-01](...)" (refund-service.md:1008-1010), and a § 17.3 cell "None - no BRD screen (the [REFUNDS 09](...) report; not a platform page)". check_trace flags that route.
- Class: D.
- Options:
  - A. Allow `### Workflow: [name]` in a BRD-traced LLD for behaviour no use case covers (scheduled jobs, BRD chunk 09 reports, NFR-driven processes). Its line: `> **Traceability:** No BRD use case - realises [link to the BRD 09 section, the NFR-NN, or SDD §17.X] · Entry points: [...]`. No `@UseCase`, no § 19.9 row. A § 17.3 route that serves it reads `None - no BRD screen ([link])` in both BRD columns and carries no route data. Tradeoff: a second block kind and a third cell value; it matches the from-code rule and what both runs wrote.
  - B. Keep § 7.8 for use cases only. Jobs and reports live in § 7.3 pseudocode and 10 § 13.8; their routes read `None - platform page`. Tradeoff: no new text, but a BRD report page is labelled a platform page and a job's failure handling has no block.
  - C. Treat each as a Missing scenario: `> Confirm:` plus a reviewer open item asking the BRD owner for a use case. Tradeoff: a report may get a use case upstream; a watchdog job never will.
- Recommendation: A. Why: every behaviour the BRD or SDD requires gets a home without inventing a use case, and from-sdd then matches the existing from-code rule.
- Files: lld-unifier/chunks/04-implementation-template.md (294, 303), lld-unifier/chunks/14-frontend.md (46-48), lld-unifier/sdd-to-lld.md (§ Use-case traceability intro, § Where the LLD traces a use case, § Frontend routes, § Checks 1 and 3), lld-unifier/TEMPLATE-COMBINED.md (194, 203, 494-496), lld-unifier/SKILL.md:230 (step 6a check list). Outside the skill: _fixtures/checkers/check_trace.py (route rule).

### L2-7: Child LLDs Scope listed "Angular web app" (= C1-6)
- Status: Present.
- Evidence: lld-unifier/sdd-to-lld.md:206 "| Scope (§13 services) | The services this LLD covers (§2.1 In Scope) |"; sdd-to-lld.md:29 "**Scope.** "In scope" means owned by a service this LLD covers (§2.1 In Scope)."; lld-unifier/chunks/01-purpose-and-scope.md:21 lets § 2.1 list "[Service / module / feature]". lld-unifier/SKILL.md:154 (step 3b) defines scope as "The §13 services (and modules, Type `module`) this LLD covers". The e2e row still reads "refund-service, loyalty-service, payout-service, notification-service; Angular web app" (_fixtures/chain/run-2026-10-01-e2e/sdd-refunds-platform/00-cover-and-changelog.md:36). SDD side: sdd-unifier/brd-to-sdd.md:45 checks that "each scope service is a row in §13" but sets a marker only for "a merged or removed service".
- Class: M. The column header and step 3b both say § 13; the "(§2.1 In Scope)" pointer is the odd one out.
- Fix:
  1. lld-unifier/sdd-to-lld.md / current: "| Scope (§13 services) | The services this LLD covers (§2.1 In Scope) |" / new: "| Scope (§13 services) | The SDD §13 services (and modules) this LLD covers, named as §13 writes them; never an item that is not a §13 row, such as a frontend or a shared library |"
  2. lld-unifier/sdd-to-lld.md / current: "**Scope.** "In scope" means owned by a service this LLD covers (§2.1 In Scope)." / new: "**Scope.** "In scope" means owned by an SDD §13 service (or module) this LLD covers (SKILL.md step 3b)."
  3. CROSS-SKILL sdd-unifier/brd-to-sdd.md / current: "A row whose LLD is gone, or whose scope names a merged or removed service, stays and gets a `[NEEDS CLARIFICATION: ...]`; it is never deleted silently." / new: "A row whose LLD is gone, or whose scope names a merged or removed service or anything that is not a §13 row, stays and gets a `[NEEDS CLARIFICATION: ...]`; it is never deleted silently."
- Files: lld-unifier/sdd-to-lld.md; CROSS-SKILL sdd-unifier/brd-to-sdd.md. The fixture row is corrected by the next LLD run, which rewrites its own row.

### L2-8: the 09 § 12.8 example became `REFUNDS/UC-010`
- Status: Present.
- Evidence: lld-unifier/chunks/09-cross-cutting.md:112 "or a substring (`UC-01` would match `UC-010`)"; the same text at lld-unifier/TEMPLATE-COMBINED.md:377 and lld-unifier/sdd-to-lld.md:135. The keying rule (sdd-to-lld.md:60) made the run write "`REFUNDS/UC-01` would match `REFUNDS/UC-010`" (run-2026-10-01-e2e 09-cross-cutting.md:146), an ID the BRD does not have; check_lld_trace reports it as unknown.
- Class: M.
- Fix (the same current and new in each file):
  1. lld-unifier/chunks/09-cross-cutting.md / current: "or a substring (`UC-01` would match `UC-010`)" / new: "or a substring (it also matches a longer ID that contains the one searched for)"
  2. lld-unifier/TEMPLATE-COMBINED.md / current: same / new: same.
  3. lld-unifier/sdd-to-lld.md / current: same / new: same.
- Files: lld-unifier/chunks/09-cross-cutting.md, lld-unifier/TEMPLATE-COMBINED.md, lld-unifier/sdd-to-lld.md.

### L2-9: 09 § 12.3 dropped the "Pattern | Default config | Override mechanism" table
- Status: Present. The template still has the table; the rules disagree on where per-instance settings live, and the runs resolved it by replacing the table.
- Evidence: lld-unifier/chunks/09-cross-cutting.md:41-46 (defaults table only). lld-unifier/sdd-to-lld.md:304 and :317 send per-service Resilience4j config to "`09-cross-cutting.md` § 12.3". lld-unifier/pattern-rules.md:136 "FROM-SDD detection: `09-cross-cutting.md` § 12.3 + per-call config in `04-implementation/<service>.md`." lld-unifier/chunks/09-cross-cutting.md:11 "Per-service overrides live in `04-implementation/<service>.md`." Runs: run-new kept the defaults table plus an instance table; run-2026-09-30 and run-2026-10-01-e2e replaced it with an instance table.
- Class: D.
- Options:
  - A. Keep the defaults table and add an instance table under it in § 12.3: Instance | Caller (service, API ID) | Timeout | Retry | Circuit breaker | Bulkhead | Source, with `Default` where a cell equals the defaults row. Point pattern-rules.md:136 and 09:11 at it. Tradeoff: one place for every resilience setting; chunk 09 grows.
  - B. Defaults only in § 12.3; each instance's settings in the caller's 04 file, as pattern-rules.md and 09:11 say; change sdd-to-lld.md:304 and :317. Tradeoff: settings sit with their caller, but there is no single view for operations, and the 04 template needs a slot.
  - C. Instance table only, the defaults as its first row (what the last two runs wrote). Tradeoff: compact; the Override mechanism column goes.
- Recommendation: A. Why: two mapping rows and the baseline run already put instance settings in § 12.3, and the defaults row lets a cell say `Default` instead of repeating values.
- Files: lld-unifier/chunks/09-cross-cutting.md (§ 12.3 and line 11), lld-unifier/TEMPLATE-COMBINED.md (§12.3, line 348), lld-unifier/pattern-rules.md:136.

### L2-10a: Screens field vs § Checks 2 (= E6)
- Status: Present.
- Evidence: lld-unifier/sdd-to-lld.md:115 Screens field "for each route that starts the use case"; sdd-to-lld.md:177 Check 2 "its Screens equal the 14 §17.3 rows that name the use case". The same "starts" wording is at lld-unifier/chunks/04-implementation-template.md:301 and lld-unifier/TEMPLATE-COMBINED.md:201. The runs follow Check 2: REFUNDS/UC-03 lists both `/refunds` and `/refunds/:refundRequestId` (run-2026-10-01-e2e refund-service.md).
- Class: S. Recommended: define the field by the route's Use cases cell, as Check 2 does. Why: that cell is read from the BRD, so the set is derivable and checkable, while "starts" is a judgement no input states; the runs and check_trace already use it.
- Fix:
  1. lld-unifier/sdd-to-lld.md / current: "for each route that starts the use case;" / new: "for each 14 §17.3 route whose Use cases cell names the use case;"
  2. lld-unifier/chunks/04-implementation-template.md / current: "and each route that starts the use case;" / new: "and each § 17.3 route whose Use cases cell names the use case;"
  3. lld-unifier/TEMPLATE-COMBINED.md / current: "and each route that starts the use case;" / new: "and each §17.3 route whose Use cases cell names the use case;"
- Files: lld-unifier/sdd-to-lld.md, lld-unifier/chunks/04-implementation-template.md, lld-unifier/TEMPLATE-COMBINED.md.

### L2-10b: link target for screen-ID mockup rows (= E2, L8, C1-7)
- Status: Present.
- Evidence: lld-unifier/sdd-to-lld.md:78-79 Targets: "`MK-NN` (the screen reference) | BRD chunk 14 `### Mockup coverage` (`14-todo.md#mockup-coverage`)" and "Screen ID (only where the BRD text carries one) | The BRD heading whose text carries it"; sdd-to-lld.md:40-41 give each kind its own home with no precedence. brd-unifier now keys every row `MK-NN` and puts a source screen ID in the Screen / flow cell (brd-unifier/chunks/14-todo.md:181), but older BRDs key rows by the screen ID (the fixture's SCR-01, SCR-02, LP-01, LP-02). The e2e run linked LP-01 to `06a-use-cases-member.md#uiux` and SCR-01 to `11-summary-and-uiux.md#screens` although each has a chunk 14 row.
- Class: D.
- Options:
  - A. Chunk 14 row first. A screen with a Mockup coverage row is cited by that row's ID and linked to `14-todo.md#mockup-coverage`, whether the ID is an `MK-NN` or, in a BRD written before `MK-NN`, a screen ID. The BRD heading target applies only to a screen ID with no chunk 14 row. A current row (`MK-01` with the source's screen ID in its Screen / flow cell) is cited as the `MK-NN`. Tradeoff: one target per screen; the run's SCR and LP links change.
  - B. Screen ID first: a screen ID always links to the BRD heading that carries it; chunk 14 only for `MK-NN`. Tradeoff: matches the runs; in a current BRD one screen can carry two references (the MK-NN and the source ID).
  - C. A legacy row is a gap: `> Confirm:` and a handoff suggestion to upgrade the BRD to `MK-NN` rows; links follow B meanwhile. Tradeoff: pushes the fix to brd-unifier; every legacy BRD gets flags.
- Recommendation: A. Why: § Homes makes chunk 14 the home of screen to use cases and of the Figma link, and brd-unifier calls the `MK-NN` row "the BRD's screen reference".
- Files: lld-unifier/sdd-to-lld.md (§ Homes rows 40-41, § The link Targets rows 78-79, § Frontend routes line 119, § BRD inputs rows 342-343), lld-unifier/chunks/14-frontend.md:46, lld-unifier/chunks/04-implementation-template.md:301, lld-unifier/TEMPLATE-COMBINED.md (201, 494), lld-unifier/code-extraction.md:71. Outside the skill: _fixtures/checkers/check_trace.py (screen-ID rule). Tied to the step 6 decision on upgrading the fixture BRDs to `MK-NN` rows.

### L2-10c: a hybrid core with no in-process contracts
- Status: Present.
- Evidence: lld-unifier/chunks/04-implementation-template.md:93 "A microservices SDD writes "Not applicable - no in-process contracts"."; the same sentence at lld-unifier/chunks/06-api-contracts.md:124 and twice in lld-unifier/TEMPLATE-COMBINED.md (171, 302). A hybrid or modular-monolith SDD whose § 15 has no `Internal (in-process)` contract, and a separate deployable of a hybrid, have no stated wording. Both runs reused the microservices text with an explanation (run-2026-09-30 and run-2026-10-01-e2e, 06 § 9.6 and each 04 Ports table).
- Class: S. Recommended: the wording applies whenever there is no such contract. Why: it is what both runs wrote, and nothing else changes.
- Fix (the same new text in each place):
  1. lld-unifier/chunks/04-implementation-template.md / current: "A microservices SDD writes "Not applicable - no in-process contracts"." / new: "With no SDD §15 `Internal (in-process)` contract here (a microservices SDD, a separate deployable of a hybrid, or a core whose modules call no port), write "Not applicable - no in-process contracts"."
  2. lld-unifier/chunks/06-api-contracts.md / current: same as 1 / new: same as 1.
  3. lld-unifier/TEMPLATE-COMBINED.md / current: same as 1 (2 occurrences, lines 171 and 302: replace all) / new: same as 1.
- Files: lld-unifier/chunks/04-implementation-template.md, lld-unifier/chunks/06-api-contracts.md, lld-unifier/TEMPLATE-COMBINED.md. The § 10.6 events sentence ("A microservices SDD writes "Not applicable - no in-process events"", chunks/07-event-contracts.md:97, TEMPLATE-COMBINED.md:324, sdd-to-lld.md:307) has the same gap; the parallel edit is optional.

### L2-10d: listeners and jobs get no `@UseCase` (= E7)
- Status: Present.
- Evidence: lld-unifier/sdd-to-lld.md:134 "Every entry point §7.3 lists for an in-scope use case (REST method, event listener, scheduled job) carries a project annotation, `@UseCase("REFUNDS/UC-04")`." sdd-unifier/brd-to-sdd.md:115 fills § 7.3 Entry points with the method and path "or the trigger", so a listener that realises a later step is never listed. lld-unifier/chunks/04-implementation-template.md:374 (Participates in) "Entry points here: [`Event: [EVENT_NAME]` as SDD §7.3 names it / None]". § Upstream gaps (sdd-to-lld.md:162-172) has no row for this. The e2e run: "`PayoutEventListener` ... no `@UseCase` because SDD §7.3 lists no event entry point" (refund-service.md:43), so REFUNDS/UC-04 step 7 logs carry no `use_case`.
- Class: D.
- Options:
  - A. Keep § 7.3 entry points only, and say so: a listener or job that realises a later step carries no `@UseCase`; its logs join the use case through the trace of the request that started it. Tradeoff: no new rule; a `use_case` log search misses the async steps.
  - B. Extend: a listener or job that a workflow block names (the owner's steps or a Participates in block) also carries `@UseCase` with that use case. The LLD states it as its own delta, flagged with the rest of the convention. Tradeoff: triage by `use_case` is complete; Check 6 and the value set grow beyond § 7.3.
  - C. Upstream: sdd-unifier § 7.3 lists every trigger that realises a step (CROSS-SKILL); the LLD rule stays. Tradeoff: one home for the mapping; a bigger § 7.3 and an SDD template change.
- Recommendation: B. Why: async steps are where production failures surface, and the LLD already names those classes in its workflow blocks.
- Files: lld-unifier/sdd-to-lld.md (§ The use_case attribute first bullet, § Checks 6), lld-unifier/chunks/04-implementation-template.md (45, 374), lld-unifier/chunks/09-cross-cutting.md:110 (Attribute row), lld-unifier/TEMPLATE-COMBINED.md (167, 248, 375), lld-unifier/SKILL.md:230 (step 6a check list).

### L2-10e: `tenantId` on every log line vs the global defaults, and its field names vs SDD § 11.4 (= E8)
- Status: Present.
- Evidence: lld-unifier/chunks/09-cross-cutting.md:89 "| Mandatory fields | `ts`, `level`, `service`, `traceId`, `spanId`, `tenantId` (never PII), `event`, `attrs` |" (the same row at lld-unifier/TEMPLATE-COMBINED.md:362). The same chunk says at :91 "| Level for tenant context | DEBUG (never INFO per CLAUDE.md) |" and at :23 "`tenant_id` never logged at INFO ... | CLAUDE.md hard rule |". How the skill states and cites the defaults: SKILL.md:89 (principle 10, "the user's standing technical defaults"), SKILL.md:37 (`CLAUDE.md` defaults, or AGENTS.md outside Claude Code), pattern-rules.md:122 and :215 quote "Never log tenant_id, reseller_id, or PII at INFO level". The global defaults also ask for "structured JSON logs with correlation id and tenant context"; the field list has no correlation id. The run took SDD § 11.4's own names (`trace_id`, `correlation_id`, `tenant_ref`; run-2026-09-30/sdd-refunds-platform/07-cross-cutting-concerns.md:47).
- Class: M. The global rule, cited in the same table, is clearly right, and SDD § 11.4 owns the names (sdd-to-lld.md § One fact, one home).
- Fix:
  1. lld-unifier/chunks/09-cross-cutting.md / current: "| Mandatory fields | `ts`, `level`, `service`, `traceId`, `spanId`, `tenantId` (never PII), `event`, `attrs` |" / new: "| Mandatory fields | The SDD §11.4 Logging fields, verbatim; when it names none: `ts`, `level`, `service`, `traceId`, `spanId`, `correlationId`, `event`, `attrs`. No PII at INFO; the tenant ID only at DEBUG (Level for tenant context) |"
  2. lld-unifier/TEMPLATE-COMBINED.md / current: same as 1 / new: same as 1.
- Files: lld-unifier/chunks/09-cross-cutting.md, lld-unifier/TEMPLATE-COMBINED.md.

### L2-10f: `processed_at` vs `published_at`
- Status: Present.
- Evidence: the LLD templates name the outbox table `outbox` (lld-unifier/chunks/09-cross-cutting.md:53) and its column `processed_at` (chunks/04-implementation-template.md:146, :193; chunks/05-data-model.md:57, :74, :105; chunks/09-cross-cutting.md:56-57; chunks/10-operations.md:108; chunks/13-testing.md:68). The SDD's 13x DB Modeling named it `outbox_event.published_at` (_fixtures/chain/run-2026-09-30/sdd-refunds-platform/13a-service-refund.md:150), and the runs followed the SDD. No rule says which name wins.
- Class: S. Recommended: the SDD's names win; the template's are defaults. Why: SKILL.md:359 never invents table columns, and sdd-to-lld.md:318 maps the SDD tables into 05.
- Fix:
  1. lld-unifier/chunks/09-cross-cutting.md / current: "- **Table:** `outbox` per service schema (see `05-data-model.md`)." / new: "- **Table:** `outbox` per service schema (see `05-data-model.md`). When SDD `13x` DB Modeling names the outbox table or its columns (for example `outbox_event.published_at`), use the SDD names everywhere in this LLD; `outbox` and `processed_at` apply only when it names none."
  2. lld-unifier/TEMPLATE-COMBINED.md / current: "Integration events on the broker only; the in-process domain events of §10.6 use no outbox." / new: "Integration events on the broker only; the in-process domain events of §10.6 use no outbox. Table and column names follow SDD `13x` DB Modeling when it names them (`outbox` and `processed_at` otherwise)."
- Files: lld-unifier/chunks/09-cross-cutting.md, lld-unifier/TEMPLATE-COMBINED.md.

### L2-10g: PAYOUT_REFUSED
- Status: Present.
- Evidence: lld-unifier/chunks/09-cross-cutting.md:76 "(`VALIDATION_FAILED`, `PAYOUT_REFUSED`)": a domain code from one sample project sits in a table cell the agent copies. The runs replaced it with a code from their own SDD (`REFUND_WINDOW_PASSED`). Elsewhere the templates use the placeholder `[DOMAIN_CODE]` (lld-unifier/chunks/06-api-contracts.md:130).
- Class: M.
- Fix: lld-unifier/chunks/09-cross-cutting.md / current: "(`VALIDATION_FAILED`, `PAYOUT_REFUSED`)" / new: "(`VALIDATION_FAILED`, `[DOMAIN_CODE]`)"
- Files: lld-unifier/chunks/09-cross-cutting.md.

### L2-10h: step 6b version pins
- Status: Present.
- Evidence: lld-unifier/SKILL.md:239 "Missing version pin → **AskUserQuestion**." Against SKILL.md:359 "Never invents class names, method signatures, table columns, topic names, or version pins to fill a section. Missing detail → confidence flag."; sdd-to-lld.md:16 (pins are owned by SDD §6 or the Specs chunk); sdd-to-lld.md:160 "Flag what is missing upstream; never fill it." Root README.md:425 lists "a missing version pin" under "It asks you", and README.md:58 says of the tech defaults "The SDD proposes them and you confirm them". The question also comes after the body, whose § 6.3 already carries the gap. Runs: the e2e 03 § 6.3 kept one `> TODO:` ("record them in SDD §6"), and 17-specs.md says "version not pinned".
- Class: D.
- Options:
  - A. Never ask in the LLD. A pin missing from SDD §6 is an upstream gap: § 6.3 carries one `> TODO:`, the Specs Tech Stack points to it, and the handoff suggests pinning it in SDD §6 through sdd-unifier. Tradeoff: one question fewer; the pin stays open until the SDD is updated.
  - B. Ask once, at step 3a (where the stack is resolved), for every missing pin. Record an answer in § 6.3 with Source "user; SDD §6 silent" and suggest the SDD update; "not pinned yet" keeps the `> TODO:`. Tradeoff: real pins sooner; the LLD holds a pin the SDD lacks.
  - C. Keep the 6b question, add a fallback (no answer keeps the § 6.3 `> TODO:`), and copy any answer back into § 6.3. Tradeoff: smallest change; the body is edited after the Specs step, and the one-home tension stays.
- Recommendation: A. Why: the SDD is where the user confirms pins, and the global defaults' "verify or ask" for version numbers is already met there.
- Files: lld-unifier/SKILL.md:239, lld-unifier/sdd-to-lld.md § Upstream gaps (the L7 row covers it), lld-unifier/chunks/17-specs.md (Tech Stack comment), root README.md:425.

### L2-10i: backticked flags in the chunk 10 to 12 templates
- Status: Present.
- Evidence: lld-unifier/chunks/10-operations.md:76 "> `> TODO: dashboard URLs - verify`"; lld-unifier/chunks/11-security.md:28, :63, :74; lld-unifier/chunks/12-performance.md:23, :56. Each wraps the flag in inline code inside a blockquote, so copied as written it is not a `> TODO:` or `> Confirm:` line, and the chunk 15 grep (confidence-rules.md:154) misses it. The runs stripped the backticks.
- Class: M.
- Fix: apply the E12 edits; they also remove the backticks. Only if E12 is declined, the minimal edit in each of the six lines is current "> `> X`" / new "> X", for example lld-unifier/chunks/10-operations.md / current: "> `> TODO: dashboard URLs - verify`" / new: "> TODO: dashboard URLs - verify".
- Files: lld-unifier/chunks/10-operations.md, lld-unifier/chunks/11-security.md, lld-unifier/chunks/12-performance.md. TEMPLATE-COMBINED.md has no counterpart (those sections are bare headings there).

### L2-10j: § 7.2 has no Listener or Job rows
- Status: Present, narrower than logged. The § 7.2 Authorization table already has Listener and Job rows (lld-unifier/chunks/04-implementation-template.md:100-101, there since b3cf5a2, before the step 2 run). The gap is the class tables: only `### Controllers` lists entry-point classes.
- Evidence: lld-unifier/chunks/04-implementation-template.md:39-43 (Controllers: Class | Endpoints | Notes) and :45 (every entry point, "REST method, event listener, scheduled job", carries `@UseCase`). The e2e run put `PayoutEventListener` and `PayoutWatchdogJob` in the Controllers table (refund-service.md:43-44).
- Class: S. Recommended: list listeners and jobs in the Controllers table with their trigger. Why: no table shape change, and it is what the run did. Renaming the table to "Entry points" is the alternative, but that is a heading change.
- Fix:
  1. lld-unifier/chunks/04-implementation-template.md / current: "> **Convention:** every entry point a § 7.8 traceability line names (REST method, event listener, scheduled job) carries `@UseCase("[KEY]/UC-NN")` with that use case's keyed ID (`09-cross-cutting.md` § 12.8). Platform endpoints carry none." / new: "> **Convention:** every entry point a § 7.8 traceability line names (REST method, event listener, scheduled job) carries `@UseCase("[KEY]/UC-NN")` with that use case's keyed ID (`09-cross-cutting.md` § 12.8). Platform endpoints carry none. Event listeners and scheduled jobs that are entry points go in the Controllers table too, with their trigger in the Endpoints cell (`Event: [EVENT_NAME]`, `Schedule: [name]`)."
  2. lld-unifier/TEMPLATE-COMBINED.md / current: "- Controllers, Services, ServiceImpls, Repositories, Domain types (records), Method signatures" / new: "- Controllers (with the event listeners and scheduled jobs that are entry points, their trigger as the endpoint), Services, ServiceImpls, Repositories, Domain types (records), Method signatures"
- Files: lld-unifier/chunks/04-implementation-template.md, lld-unifier/TEMPLATE-COMBINED.md. If L2-10d option B is taken, the first sentence of the 04 convention changes too.

### L2-10k: "Direct lift" vs one fact, one home (= E3, C1-8)
- Status: Present.
- Evidence: lld-unifier/sdd-to-lld.md:318 "| 13a DB Modeling | `05-data-model.md` § 8.2 Tables ... | Direct lift; the SDD's ERD becomes the LLD's Mermaid `erDiagram`. |", against sdd-to-lld.md:13 (rule 1, "Reference + delta, never copy") and :16 (rule 4, "Scalar facts live once"). Rule 3 (:15) allows derived views with a Source column only for § 6.3 and the § 15 SLO rows. C1-8: lld-unifier/chunks/10-operations.md:14 (§ 13.1 Default column) needs the SDD's values (PT6H, the 15-minute cron, PT5M), and sdd-to-lld.md:331 maps SDD § 19 to "Per-environment config rows".
- Class: D.
- Options:
  - A. Extend rule 3 (derived views declare their source) to the 05 tables and ERD and to the 10 § 13.1 defaults. They restate the SDD values the implementer needs, each row with a Source link; a value that differs from the SDD is drift to flag. Tradeoff: a complete implementer view; two template tables gain a Source column.
  - B. Reference only: 05 lists only LLD-added columns and indexes and links the SDD tables; 10 § 13.1 Default cells link the SDD value. Tradeoff: strictly one home; the implementer reads two documents for one table.
  - C. Keep "Direct lift" for 05 and name 10 § 13.1 an exception in rule 4, with no Source column. Tradeoff: least text; copies drift unchecked.
- Recommendation: A. Why: the derived-view rule already exists for this case (§ 6.3, § 15), and a Source per row makes every copy checkable.
- Files: lld-unifier/sdd-to-lld.md (rules 3 and 4, lines 15-16; field mapping rows 318 and 331), lld-unifier/chunks/05-data-model.md (§ 8.2 Source column), lld-unifier/chunks/10-operations.md (§ 13.1 Source column), lld-unifier/SKILL.md:92 (principle 13, one clause).

### E1: TODO flag format with an em dash
- Status: Present.
- Evidence: lld-unifier/SKILL.md:87 "Low: emit + `> TODO: <best-guess> [em dash] verify`" (also :91 and :204); lld-unifier/confidence-rules.md:40, :48, :61, :150, :169-171; lld-unifier/sdd-to-lld.md:242, :332, :351, :367, :379, :383, :403; the same flag strings in agent-orchestration.md:185, code-extraction.md:57, :58, :89, :92, lld-quality.md:236, mermaid-diagrams.md:186, transform-detection.md:141. Against lld-unifier/chunks/lld-master.md:110 and chunks/00-metadata.md:51 "`> TODO: <best-guess> - verify`" and SKILL.md:350 (no em dash characters in generated documents). The runs wrote " - verify".
- Class: M.
- Fix: in each flag string, replace " [em dash] " with " - " ([em dash] = U+2014):
  1. lld-unifier/SKILL.md (lines 87, 91, 204; replace all, 3) / current: "`> TODO: <best-guess> [em dash] verify`" / new: "`> TODO: <best-guess> - verify`"
  2. lld-unifier/confidence-rules.md (line 40) / current: "`> Confirm: [reason for medium confidence [em dash] what to verify]`" / new: "`> Confirm: [reason for medium confidence - what to verify]`"
  3. lld-unifier/confidence-rules.md (lines 48, 61, 150, 169, 170; replace all, 5) / current: "<best-guess> [em dash] verify" / new: "<best-guess> - verify"
  4. lld-unifier/confidence-rules.md (line 171) / current: "`> TODO: not derivable from inputs [em dash] please specify`" / new: "`> TODO: not derivable from inputs - please specify`"
  5. lld-unifier/sdd-to-lld.md (lines 242, 351, 403; replace all, 3) / current: "<best-guess> [em dash] verify" / new: "<best-guess> - verify"
  6. lld-unifier/sdd-to-lld.md (line 332) / current: "`> TODO: concrete commands once code exists [em dash] verify`" / new: "`> TODO: concrete commands once code exists - verify`"
  7. lld-unifier/sdd-to-lld.md (line 367) / current: "`> TODO: <pseudocode best-guess> [em dash] verify with [KEY]/UC-NN`" / new: "`> TODO: <pseudocode best-guess> - verify with [KEY]/UC-NN`"
  8. lld-unifier/sdd-to-lld.md (line 379) / current: "`> TODO: caching strategy [em dash] verify`" / new: "`> TODO: caching strategy - verify`"
  9. lld-unifier/sdd-to-lld.md (line 383) / current: "`> TODO: peak scenarios [em dash] verify with SDD §18.3`" / new: "`> TODO: peak scenarios - verify with SDD §18.3`"
  10. lld-unifier/agent-orchestration.md (line 185) / current: "`> TODO: <best-guess> [em dash] verify`" / new: "`> TODO: <best-guess> - verify`"
  11. lld-unifier/code-extraction.md (line 57) / current: "`> TODO: SLO targets [em dash] verify with SDD §18 or production data`" / new: "`> TODO: SLO targets - verify with SDD §18 or production data`"
  12. lld-unifier/code-extraction.md (line 58) / current: "`> TODO: threat notes [em dash] verify with security review or threat model`" / new: "`> TODO: threat notes - verify with security review or threat model`"
  13. lld-unifier/code-extraction.md (line 89) / current: "`> Confirm: pseudocode derived from method body [em dash] verify against current code`" / new: "`> Confirm: pseudocode derived from method body - verify against current code`"
  14. lld-unifier/code-extraction.md (line 92) / current: "`> TODO: business rule narrative inferred from variable names + branches [em dash] verify`" / new: "`> TODO: business rule narrative inferred from variable names + branches - verify`"
  15. lld-unifier/lld-quality.md (line 236) / current: "`> TODO: <best-guess> [em dash] verify`" / new: "`> TODO: <best-guess> - verify`"
  16. lld-unifier/mermaid-diagrams.md (line 186) / current: "`> TODO: Mermaid syntax error [em dash] please review and fix.`" / new: "`> TODO: Mermaid syntax error - please review and fix.`"
  17. lld-unifier/transform-detection.md (line 141) / current: "`> TODO: <best-guess> [em dash] verify`" / new: "`> TODO: <best-guess> - verify`"
- Files: lld-unifier/SKILL.md, confidence-rules.md, sdd-to-lld.md, agent-orchestration.md, code-extraction.md, lld-quality.md, mermaid-diagrams.md, transform-detection.md. Left to the general em dash cleanup: the prose em dashes on the same lines (for example the confidence-rules.md:48 heading), and the Roadmap string "Not applicable [em dash] reverse-engineered LLD" at SKILL.md:240 and sdd-to-lld.md:231, which also disagrees with chunks/17-specs.md:57 ("Not applicable - reverse-engineered LLD.").

### E2: screen-ID-keyed mockup rows, link target
- Status: Present (= L2-10b).
- Evidence: see L2-10b.
- Class: D.
- Fix: see L2-10b; decide once.
- Files: see L2-10b.

### E3: "Direct lift" vs one fact, one home
- Status: Present (= L2-10k).
- Evidence: see L2-10k.
- Class: D.
- Fix: see L2-10k; decide once.
- Files: see L2-10k.

### E4: outbox in a modular monolith
- Status: Present.
- Evidence: lld-unifier/pattern-rules.md:34 (Outbox trigger: "the service emits one or more events (Kafka, SNS, etc.)"); lld-unifier/chunks/09-cross-cutting.md:52 (§ 12.4 scope is broker events; in-process events "use no outbox"); lld-unifier/lld-quality.md:88; lld-unifier/sdd-to-lld.md:307 ("No topic, consumer group, DLQ, or outbox"); lld-unifier/SKILL.md:202. No rule covers a provider write after a state change (the 3d SDD's ADR-09 dispatch tables) or an in-process event that must survive a crash. Runs: the 3d run wrote "no outbox table" in 10 and "Outbox pattern applied (dispatch table)" in the payout and notification files (step3-findings.md 3d LLD stage); the e2e run invented "Pattern: In-process domain event with durable publication log" (refund-service.md:605) and an `event_publication` table.
- Class: D.
- Options:
  - A. Widen the Outbox rule to any side effect that must follow a state change and must not be lost: a broker event, a provider write, or an in-process event the SDD marks durable (an ADR, or the § 14.10 phase). Same roles (a record written in the aggregate's transaction, a separate deliverer, one active instance) and the same delivery contract, with "acknowledged" meaning the broker ack, the provider's success response, or the listener's commit. Tradeoff: one rule and one vocabulary; the scope lines in several files change.
  - B. Keep Outbox for broker events and add two named variants, a provider dispatch table and an event publication log, each with its own delivery rules. Tradeoff: explicit, but more text and three names for one shape.
  - C. No LLD rule: apply whatever the SDD's ADR says and cite it. Tradeoff: no new text; runs keep inventing pattern names and contradicting themselves.
- Recommendation: A. Why: it is the same dual-write risk the global outbox rule exists for, and one rule keeps 09, 10, and the 04 files consistent. It should follow the SDD side's decision on a durable § 14.10 phase (D6, another checker).
- Files: lld-unifier/pattern-rules.md (§ Outbox trigger, roles, delivery contract), lld-unifier/chunks/09-cross-cutting.md (§ 12.4 Scope bullet), lld-unifier/lld-quality.md:88, lld-unifier/chunks/07-event-contracts.md:97-98, lld-unifier/sdd-to-lld.md:307, lld-unifier/SKILL.md:202, lld-unifier/chunks/04-implementation-template.md (§ Pattern: Outbox roles), lld-unifier/TEMPLATE-COMBINED.md (324, 352).

### E5: a sequence diagram per workflow vs "When NOT to draw"
- Status: Present.
- Evidence: lld-unifier/chunks/04-implementation-template.md:294 "Each workflow has: the traceability line, control flow, sequence diagram (Mermaid), ..." (the same at lld-unifier/TEMPLATE-COMBINED.md:194; lld-quality.md:116 "- Sequence diagram (Mermaid) with all participants."), against lld-unifier/mermaid-diagrams.md:174 "One-step workflows [em dash] no sequence diagram (the description is the diagram)." and :175 (pure CRUD endpoints, no per-endpoint sequence diagram).
- Class: M. The specific exception is clearly meant to win (mermaid-diagrams.md:177: "The skill leans toward fewer, more meaningful diagrams").
- Fix:
  1. lld-unifier/chunks/04-implementation-template.md / current: "Each workflow has: the traceability line, control flow, sequence diagram (Mermaid), idempotency points, outbox emission points, retry/timeout choices." / new: "Each workflow has: the traceability line, control flow, sequence diagram (Mermaid; none for a one-step workflow or a pure CRUD endpoint, per `mermaid-diagrams.md` § When NOT to draw), idempotency points, outbox emission points, retry/timeout choices."
  2. lld-unifier/TEMPLATE-COMBINED.md / current: same as 1 / new: same as 1.
  3. lld-unifier/lld-quality.md / current: "- Sequence diagram (Mermaid) with all participants." / new: "- Sequence diagram (Mermaid) with all participants, unless `mermaid-diagrams.md` § When NOT to draw says none."
- Files: lld-unifier/chunks/04-implementation-template.md, lld-unifier/TEMPLATE-COMBINED.md, lld-unifier/lld-quality.md.

### E6: Screens field vs § Checks 2
- Status: Present (= L2-10a).
- Evidence: see L2-10a.
- Class: S.
- Fix: see L2-10a; apply once.
- Files: see L2-10a.

### E7: modules with no REST surface; listeners and jobs get no `@UseCase`
- Status: Present (= L2-10d for `@UseCase`; = L2-10j for the class table). The Participates in block already says what to write when a module has no entry point (chunks/04-implementation-template.md:374, "None").
- Evidence: see L2-10d and L2-10j.
- Class: D (the `@UseCase` part; the class-table part is S under L2-10j).
- Fix: see L2-10d (decide) and L2-10j (apply).
- Files: see L2-10d and L2-10j.

### E8: § 12.7 `tenantId` on every log line; field names vs SDD § 11.4
- Status: Present (= L2-10e).
- Evidence: see L2-10e.
- Class: M.
- Fix: see L2-10e; apply once.
- Files: see L2-10e.

### E9: "TTL 24h" stated as fact
- Status: Present.
- Evidence: lld-unifier/chunks/09-cross-cutting.md:32 "| TTL | 24 hours |"; lld-unifier/chunks/06-api-contracts.md:28 "with TTL 24h"; lld-unifier/chunks/05-data-model.md:62, :106; lld-unifier/chunks/04-implementation-template.md:358. Neither the global defaults nor the SDD templates set an idempotency TTL, so the value is an LLD default with no flag, and it is stated in four chunks (sdd-to-lld.md:16, rule 4, scalar facts live once).
- Class: S. Recommended: keep 24 hours as a flagged LLD default in § 12.2 and point to it elsewhere. Why: it follows "Missing detail → confidence flag" (SKILL.md:359) and rule 4 with the smallest change.
- Fix:
  1. lld-unifier/chunks/09-cross-cutting.md / current: "| TTL | 24 hours |" / new: "| TTL | [The SDD's TTL when it states one; otherwise 24 hours, an LLD default flagged `> Confirm:`] |"
  2. lld-unifier/chunks/06-api-contracts.md / current: "The dedup tuple is `(tenant_id, idempotency_key)` with TTL 24h." / new: "The dedup tuple and the TTL are in `09-cross-cutting.md` § 12.2."
  3. lld-unifier/chunks/05-data-model.md / current: "| NOT NULL | TTL 24h via partial cleanup |" / new: "| NOT NULL | Deleted after the `09-cross-cutting.md` § 12.2 TTL |"
  4. lld-unifier/chunks/05-data-model.md / current: "| `idempotency_record` | 24 hours | Cleanup job (delete) | N/A |" / new: "| `idempotency_record` | The `09-cross-cutting.md` § 12.2 TTL | Cleanup job (delete) | N/A |"
  5. lld-unifier/chunks/04-implementation-template.md / current: "TTL 24h on the cached record" / new: "the cached record kept for the `09-cross-cutting.md` § 12.2 TTL"
- Files: lld-unifier/chunks/09-cross-cutting.md, chunks/06-api-contracts.md, chunks/05-data-model.md, chunks/04-implementation-template.md. TEMPLATE-COMBINED.md: § 12.2 is a bare heading, no edit.

### E10: § 18.5 has no rows for § 6 or the Specs flags; "High-confidence rows" undefined (= L6, C1-10)
- Status: Present.
- Evidence: lld-unifier/chunks/15-open-questions.md:55-71: columns "High-confidence rows | Medium-confidence rows | Low-confidence rows", rows only for sections 7 to 17, no unit, and no meaning for "High". lld-unifier/confidence-rules.md:156 "The summary table in § 18.5 (counts per section) is updated on each regeneration." Sections 1 to 6 (for example the § 6.3 `> TODO:`) and the Specs (§ 20) can hold flags but have no row. The e2e run invented a unit: "Unit: one table, pseudocode block, diagram, or workflow block. High = carried from the SDD or a CLAUDE.md hard rule with no flag." (run-2026-10-01-e2e 15-open-questions.md:125).
- Class: D.
- Options:
  - A. Count flags only: drop the High column; Medium and Low count the open `> Confirm:` and `> TODO:` flags per section; rows for § 1 to § 6, § 7 per service, § 8 to § 17, and § 20 Specs. Tradeoff: mechanical and equal to the § 18.2 and § 18.3 rows; loses a "how much is solid" signal.
  - B. Keep High, define the unit (one table, pseudocode block, diagram, or workflow block; High = a unit with no flag), and add the missing rows. Tradeoff: keeps the signal; counting stays a judgement and runs will differ.
  - C. Drop § 18.5; the 00 Confidence Flag Summary already gives the totals. Tradeoff: least work; no per-section view, and a heading leaves the template.
- Recommendation: A. Why: a count a grep can check cannot be invented, which the skill forbids everywhere else.
- Files: lld-unifier/chunks/15-open-questions.md (§ 18.5 table and convention), lld-unifier/confidence-rules.md:156, lld-unifier/TEMPLATE-COMBINED.md:540 (heading only; add a one-line note if the shape changes).

### E11: 7.N numbering is alphabetical in the LLD (refund = 7.4) but SDD § 17.1
- Status: Present. A rule exists (lld-unifier/chunking.md:73 "services are listed alphabetically by slug"; :153, merge numbers them in that order), but nothing ties the two numberings together.
- Evidence: the modular-monolith scenario master lists "7.4 refund (module)" (_fixtures/scenarios/lld-modular-monolith/run/lld-refunds-platform/refunds-platform-lld-master.md:59) while refund is SDD § 17.1; inside each service file `## 7.1 Responsibility` also uses 7.1. The 04 header already cites "[SDD §13 row and §17.X Boundaries]" (chunks/04-implementation-template.md:15).
- Class: S. Recommended: keep the alphabetical rule and show the SDD section in each master row. Why: no renumbering of existing LLDs. Reordering by SDD § 13 is the alternative, a D-sized change.
- Fix:
  1. lld-unifier/chunks/lld-master.md / current: "<!-- Add one row per service below: -->" / new: "<!-- Add one row per service below, in alphabetical order by slug (chunking.md § The per-service split), naming the service's SDD section so the two numberings are not confused: -->"
  2. lld-unifier/chunks/lld-master.md / current: "<!-- | 7.1 [Service Name] | [04-implementation/[service-slug].md](./04-implementation/[service-slug].md) | -->" / new: "<!-- | 7.N [Service Name] (SDD §17.X) | [04-implementation/[service-slug].md](./04-implementation/[service-slug].md) | -->"
- Files: lld-unifier/chunks/lld-master.md.

### E12: boilerplate flags inflate the counts
- Status: Present.
- Evidence: lld-unifier/chunks/10-operations.md:76, chunks/11-security.md:28, :63, :74, and chunks/12-performance.md:23, :56 emit a flag unconditionally. lld-unifier/confidence-rules.md makes the same claims conditional: :109 SLO targets High when SDD § 18 pins per-endpoint targets; :111 "PII column inventory | Medium | SDD §17.X Data Encryption lists them (PII columns) → upgrade to High"; :113 peak scenarios "SDD §18.3 lists them → upgrade to High". The e2e run emitted them anyway (10-operations.md:119, 11-security.md:35, :82, :93, 12-performance.md:32).
- Class: S. Recommended: turn each into a comment that says when to write the flag. Why: confidence-rules.md is the single authority on flags (SKILL.md:87), and high-confidence content emits clean.
- Fix (each also fixes L2-10i on that line):
  1. lld-unifier/chunks/10-operations.md / current: "> `> TODO: dashboard URLs - verify`" / new: "<!-- While the dashboard URLs are unknown, write: > TODO: dashboard URLs - verify -->"
  2. lld-unifier/chunks/11-security.md / current: "> `> Confirm: PII inventory is complete - verify with security review`" / new: "<!-- Unless SDD §17.X lists the PII columns (confidence-rules.md), write: > Confirm: PII inventory is complete - verify with security review -->"
  3. lld-unifier/chunks/11-security.md / current: "> `> TODO: full threat model - verify or replace with link to threat model doc`" / new: "<!-- Unless a threat model document exists (link it in 16-references.md § 19.6), write: > TODO: full threat model - verify or replace with link to threat model doc -->"
  4. lld-unifier/chunks/11-security.md / current: "> `> Confirm: compliance applicability per project - verify with legal/compliance`" / new: "<!-- Unless the SDD settles each regulation's applicability, write: > Confirm: compliance applicability per project - verify with legal/compliance -->"
  5. lld-unifier/chunks/12-performance.md / current: "> `> Confirm: SLO targets - verify with SDD §18.2 Throughput Targets`" / new: "<!-- Unless SDD §18.2 pins a target for every row (confidence-rules.md), write: > Confirm: SLO targets - verify with SDD §18.2 Throughput Targets -->"
  6. lld-unifier/chunks/12-performance.md / current: "> `> TODO: peak scenarios - verify with SDD §18.3`" / new: "<!-- Unless SDD §18.3 lists the peak scenarios (confidence-rules.md), write: > TODO: peak scenarios - verify with SDD §18.3 -->"
  7. lld-unifier/chunks/12-performance.md / current: "rows inferred from a service-level SDD target fall under the `> Confirm:` below." / new: "rows inferred from a service-level SDD target carry the SLO `> Confirm:` described in the comment below."
- Files: lld-unifier/chunks/10-operations.md, chunks/11-security.md, chunks/12-performance.md. TEMPLATE-COMBINED.md has no counterpart.

### L2: Specs on a refresh (= C1-3)
- Status: Present.
- Evidence: lld-unifier/SKILL.md:315 (the "the SDD has a new version" row: mapped chunks, 16 § 19.1, the Child LLDs row, step 6a; no step 6b), although SKILL.md:234 calls step 6b mandatory. sdd-to-lld.md:193 (the matching Refresh trigger) is the same. The § Field mapping table (sdd-to-lld.md:284-333) maps SDD 01, 02, and 09 to 01, 03 § 6.3, the master, and 04, never to 17; the Specs sources live only in § Specs ownership & synthesis (220-225). Runs differ: the 3c run updated 17 (Mission), the C1 run left 17 at 1.0.
- Class: S. Recommended: re-synthesise 17 on a refresh only when a changed SDD chunk feeds it. Why: the refresh stays targeted, and the Specs still equals § 6.3 (step 6b.2's cross-check).
- Fix:
  1. lld-unifier/sdd-to-lld.md / current: "| 17 Appendix (§21) | `16-references.md` (entire chunk) | Carry references; add LLD-specific rows. |" / new: that same row, then a new row on the next line: "| 01 §1, 02 §6, 09 §13 (the Specs inputs) | `17-specs.md` (Mission, Tech Stack, Roadmap) | Re-synthesised as a whole per § Specs ownership & synthesis and SKILL.md step 6b, after the body; never mapped field by field. |"
  2. lld-unifier/SKILL.md / current: "the LLD chunks mapped from the changed SDD chunks, 16 § 19.1, and this LLD's Child LLDs row (its SDD version); then step 6a when the trace applies; bump version." / new: "the LLD chunks mapped from the changed SDD chunks, 16 § 19.1, and this LLD's Child LLDs row (its SDD version); then step 6a when the trace applies, and step 6b when a changed SDD chunk feeds the Specs (§1, §6, §13); bump version."
- Files: lld-unifier/sdd-to-lld.md, lld-unifier/SKILL.md. The Refresh triggers row (sdd-to-lld.md:193) needs no edit: it already covers "the LLD chunks mapped (§ Field mapping table)", which then includes 17.

### L3: two triggers, one offer
- Status: Present.
- Evidence: lld-unifier/SKILL.md:158 (step 3c compares only the SDD version); lld-unifier/sdd-to-lld.md:192-193 (two rows: "A new BRD version, or a new BRD (a new key)" and "A new SDD version"); sdd-to-lld.md:54 records the BRD versions and the chunk 14 and 16 states in 16 § 19.1 "so a later run can see what changed", but no step reads them back; SKILL.md:314-315 (two step 9 rows, each with its own step 6a and bump). Root README.md:197 tells the user to say both. The C1 run merged them into one regeneration, one step 6a, and one bump on its own, and it found LOYALTY chunk 16 only through step 3b.
- Class: D.
- Options:
  - A. One offer: step 3c also compares the BRD versions and the chunk 14 and 16 states in 16 § 19.1 with the SDD's Source BRDs register and each BRD master; any change joins the same offer; one regeneration, one step 6a, one bump. Tradeoff: nothing is missed and the user says one thing; step 3c reads more files.
  - B. No new detection; when both requests apply in one run (the user asks for both, or the SDD Changes Log row names a new BRD version), merge them: one regeneration, one step 6a, one bump. Tradeoff: a small change; a BRD-only change (chunk 16 written) still waits for "refresh the trace".
  - C. Keep them separate and say so: the SDD refresh never touches the trace, and both apply as two bumps. Tradeoff: no change; the hand-off needs two requests and two versions.
- Recommendation: A. Why: 16 § 19.1 already records that state for this purpose, and the business-reviewer hand-off would then need one request instead of two.
- Files: lld-unifier/SKILL.md (step 3c line 158; step 9 rows 314-315), lld-unifier/sdd-to-lld.md (§ Upstream documents item 5, line 55; § Refresh triggers 185-195), root README.md:196-197 (and the hand-off at :199 if it is simplified), lld-unifier/README.md:56.

### L6: § 18.5 confidence summary unit vs per-section counts
- Status: Present (= E10).
- Evidence: see E10.
- Class: D.
- Fix: see E10; decide once.
- Files: see E10.

### L7: SDD markers outside § 7.3 have no rule
- Status: Present.
- Evidence: lld-unifier/sdd-to-lld.md:171 "| A §7.3 cell holding `[NEEDS CLARIFICATION: ...]` | Carry it as a `> TODO:` in the LLD. ..." is the only marker row; sdd-to-lld.md:308 says the same for `TBD - external` contracts. An SDD § 5 term marker had no rule and the 3c run carried it as `> Confirm:`; the e2e run carried SDD § 6 markers as `> TODO:`.
- Class: S. Recommended: one row for any SDD marker the LLD depends on, carried as `> TODO:`. Why: both existing rules (§ 7.3 cells, `TBD - external`) already use `> TODO:`, and an SDD gap makes the dependent LLD content a best guess.
- Fix: lld-unifier/sdd-to-lld.md / current: "| A §7.3 cell holding `[NEEDS CLARIFICATION: ...]` | Carry it as a `> TODO:` in the LLD. An unknown owner means no workflow block yet; the index row shows the gap. |" / new: "| A `[NEEDS CLARIFICATION: ...]` the LLD depends on, in a §7.3 cell or in any other SDD section (a §5 term, a `13x` rule) | Carry it as a `> TODO:` that cites the SDD section; never resolve it in the LLD. An unknown §7.3 owner means no workflow block yet; the index row shows the gap. |"
- Files: lld-unifier/sdd-to-lld.md.

### L8: link target of a mockup row keyed by a screen ID
- Status: Present (= L2-10b).
- Evidence: see L2-10b.
- Class: D.
- Fix: see L2-10b; decide once.
- Files: see L2-10b.

### L9: chunking.md § Targeted regeneration has no "new SDD version" bullet
- Status: Present.
- Evidence: lld-unifier/chunking.md:178-186 lists four bullets (data model, a service, re-run from-code, refresh the trace); SKILL.md:315 and sdd-to-lld.md:193 define the "new SDD version" refresh.
- Class: M.
- Fix: lld-unifier/chunking.md / current: "(the 04 lines, 14 § 17.3, 13 § 16.8, 16 § 19.1 and § 19.9); rerun SKILL.md step 6a; bump the LLD version." / new: that same text, then a new bullet on the next line: "- "The SDD has a new version", or SKILL.md step 3c finds one → rewrite only the LLD chunks mapped (`sdd-to-lld.md` § Field mapping table) from the SDD chunks its Changes Log names since the version in 16 § 19.1, plus 16 § 19.1 and this LLD's Child LLDs row in the SDD; rerun SKILL.md step 6a when the trace applies; bump the LLD version."
- Files: lld-unifier/chunking.md.

### L10: the offer omitted 10-operations
- Status: Present.
- Evidence: lld-unifier/SKILL.md:158 "name the SDD chunks they changed, and offer a targeted regeneration of the LLD chunks mapped from them" does not ask the offer to list each mapped LLD chunk. The 13a rows of the field mapping reach 10 (sdd-to-lld.md:324, Observability to 10 § 13.3), and the 3c offer left it out.
- Class: M.
- Fix: lld-unifier/SKILL.md / current: "and offer a targeted regeneration of the LLD chunks mapped from them (`sdd-to-lld.md` § Field mapping table;" / new: "and offer a targeted regeneration of the LLD chunks mapped from them, listing each changed SDD chunk with every LLD chunk the field mapping sends it to (`sdd-to-lld.md` § Field mapping table;"
- Files: lld-unifier/SKILL.md.

### C1-1: em dashes in the step 2 question an agent must ask word for word
- Status: Present.
- Evidence: lld-unifier/SKILL.md:105 "Ask exactly this question:", then :109 "> - **`from-code`** [em dash] reverse-engineer an LLD ...", :110 "> - **`from-sdd`** [em dash] forward-design ...", :111 "> - **`hybrid`** [em dash] both inputs available and the code is complete. ...". SKILL.md:350 bans em dashes in generated documents; the C1 run used colons.
- Class: M.
- Fix ([em dash] = U+2014):
  1. lld-unifier/SKILL.md / current: "> - **`from-code`** [em dash] reverse-engineer" / new: "> - **`from-code`**: reverse-engineer"
  2. lld-unifier/SKILL.md / current: "> - **`from-sdd`** [em dash] forward-design" / new: "> - **`from-sdd`**: forward-design"
  3. lld-unifier/SKILL.md / current: "> - **`hybrid`** [em dash] both inputs available and the code is complete." / new: "> - **`hybrid`**: both inputs available and the code is complete."
- Files: lld-unifier/SKILL.md; the second copy of the question in transform-detection.md is N-1. The output-shape prompt at SKILL.md:63-66 has the same em dashes; it belongs to the general em dash cleanup.

### C1-3: step 6b is mandatory but not in the refresh rows; the field mapping maps nothing to 17
- Status: Present (= L2).
- Evidence: see L2.
- Class: S.
- Fix: see L2; apply once.
- Files: see L2.

### C1-6: Child LLDs "Scope (§13 services)" header vs the value rule "§2.1 In Scope"
- Status: Present (= L2-7).
- Evidence: see L2-7.
- Class: M (with the CROSS-SKILL sdd-unifier edit given under L2-7).
- Fix: see L2-7; apply once.
- Files: see L2-7.

### C1-7: LP-01 and LP-02 are both screen IDs and chunk 14 rows; no precedence
- Status: Present (= L2-10b).
- Evidence: see L2-10b.
- Class: D.
- Fix: see L2-10b; decide once.
- Files: see L2-10b.

### C1-8: the 10 § 13.1 configuration table needs concrete SDD defaults
- Status: Present (= L2-10k).
- Evidence: see L2-10k.
- Class: D.
- Fix: see L2-10k; decide once.
- Files: see L2-10k.

### C1-10: no counting method for the § 18.5 High column
- Status: Present (= E10).
- Evidence: see E10.
- Class: D.
- Fix: see E10; decide once.
- Files: see E10.

### C1 SDD inconsistencies (five): PII masking vs § 19, INT-02 dead-letter vs § 17.3, `refund_takeback.refund_reference`, 503 vs 500, Figure 18 vs § 17.2
- Status: Not a skill issue. They are run content in the e2e SDD, and the LLD rightly left them (SKILL.md:231, "Never resolve an upstream disagreement in the LLD"). Fix them in the fixture or accept them with the step 6 rerun.

## New items

### N-1: transform-detection.md restates the step 2 question in different words
- Status: Present.
- Evidence: lld-unifier/SKILL.md:105 "Ask exactly this question:" and :122 "See `transform-detection.md` for the full mode resolution rules". lld-unifier/transform-detection.md:9-15 gives a second version of the question with different wording ("Point me at a path. Uses code-explorer + docs-architect agents."; "both inputs available, code is complete.") and the same em dashes as C1-1.
- Class: M. SKILL.md's "exactly" makes its copy the one to keep.
- Fix: lld-unifier/transform-detection.md / current (lines 9-15, [em dash] = U+2014):
  "After confirming output shape (chunks / combined), ask:

  > **Direction?** [from-code / from-sdd / hybrid]
  >
  > - **`from-code`** [em dash] reverse-engineer an LLD from existing source code. Point me at a path. Uses code-explorer + docs-architect agents.
  > - **`from-sdd`** [em dash] forward-design an LLD from an SDD (and BRD if linked). Greenfield, before any code exists.
  > - **`hybrid`** [em dash] both inputs available, code is complete. Two-pass: generate the from-sdd view, generate the from-code view, then unify into a single LLD with inline drift markers."
  / new: "After confirming output shape (chunks / combined), ask the direction question of SKILL.md step 2, word for word. The shorthands and the suggested defaults follow."
- Files: lld-unifier/transform-detection.md.

### N-2: stray "Outbox" in the Saga heading
- Status: Present.
- Evidence: lld-unifier/pattern-rules.md:86 "### Outbox Saga (cross-service transactions)" heads the Saga rule (the global saga quote, no outbox content). No file links to its anchor.
- Class: M.
- Fix: lld-unifier/pattern-rules.md / current: "### Outbox Saga (cross-service transactions)" / new: "### Saga (cross-service transactions)"
- Files: lld-unifier/pattern-rules.md.

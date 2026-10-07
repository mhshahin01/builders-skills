<!--
CHUNK: 16
TITLE: UAT/BAT Test Cases
PROJECT: [Project Name]
VERSION: [X.X] (baselined against BRD v[X.X])
DATE: [YYYY-MM-DD]
DEPENDS_ON: 02, 05, 06a+ (every use-case chunk), 07, 08, 09, 10, 11, 14, 15
PART OF: BRD - [Project Name]
TYPE: Delivery chunk
GATE: Locked until 14-todo.md is fully cleared (all five steps Complete with evidence, every to-do item Resolved, Deferred does not count, no override) and chunk 15 was written without raising a new open item. Never written or refreshed while the gate is shut. A Stale mark and execution tracking are allowed (delivery-chunks.md § The delivery gate, Re-lock, and § Refresh triggers).
MERGE: Included in the merged / combined BRD. Read by sdd-unifier as input context only.
PURPOSE: Business-level acceptance test cases (UAT/BAT) derived from the BRD use cases (UC-01..UC-NN), NFRs (NFR-01..NFR-NN), and the UI/UX expectations (chunk 11). Technical test cases (API contracts, data schemas, performance harnesses) are owned by the SDD test plan, not this file.
SCOPE NOTE: [Default execution scope. Define any scope tag used in TC Names here, e.g. "Test cases marked (D2) activate with Deliverable 2." State which cases need another team's cooperation.]
RULES: delivery-chunks.md in the brd-unifier skill. One combined UAT/BAT suite; "(BAT observation)" marks NFR acceptance cases judged over the UAT/BAT period rather than by one scripted check; the exit criteria are the BAT sign-off. Each case runs when the tasks and prerequisites in its Needs cell are ready, never per section; a task is Accepted when every case naming it in Related Task passes. Expected results come from the BRD; they are never invented.
-->

# [Project Name] - UAT/BAT Test Cases

**Owner:** [Owner Name: the BRD author from chunk 00, unless the user names someone else] | **Prepared:** [YYYY-MM-DD] | **Baseline:** BRD v[X.X] (all chunks) | **Design reference:** Figma - [Project Name] UI/UX ([n] screens, chunk 11)

**Suite status:** [Up to date / Provisional (TD-NN) / Stale] | **Gate verified:** [YYYY-MM-DD] (see [14-todo.md](./14-todo.md)) | **Flowchart cross-check:** done on [YYYY-MM-DD] | **New items raised while writing this suite:** [0, or TD-NN ...]

**Scope note:** [Default execution scope. Define every scope tag used in a TC Name, e.g. "(D2) = activates with Deliverable 2". Name the cases that need another team's cooperation.]

## How to use this document

- **Testing Result** is filled during execution with one of: `Success`, `Failed`, `Blocked` (cannot execute due to environment/dependency), `Not Run`.
- **Testing Comment** records evidence on failure (what was observed vs expected, screen, day, data used) and any deviation accepted by the business.
- Every test case traces to a UC, NFR or linked owning requirement section, and its Related Task. A report with no UC cites `09 / [Report]`; never invent a UC for it. The traceability matrix and Coverage gaps include section-derived capabilities.
- A test case passes only when its **Success Criteria** is fully met; partial behaviour is `Failed` with a comment.
- **Needs** lists what must be ready before the case can run: the tasks that must have reached `Ready for test` in [15-implementation.md](./15-implementation.md), then the prerequisites below that are not marked (all cases). Those marked (all cases) must be in place before the first case runs. Run each case as soon as its Needs are ready. Do not wait for the rest of its section or for a later wave: sections only group cases for the tester.
- A task is `Accepted` (complete) when every case that names it in Related Task passes (see Task acceptance). Record it in the task's Delivery status in chunk 15. `Ready for test` alone is not complete.
- A test case marked **(Provisional)** has an expected result that is not final yet; its Success Criteria names the to-do item it waits for. Do not sign off on it until that item is resolved and the case is refreshed.

## Test environment and data prerequisites

<!-- Mark a prerequisite that every case needs with (all cases). A case names each other prerequisite it uses in its Needs cell. -->

| # | Prerequisite |
|---|--------------|
| P1 | [UAT environment with the business partners / data sources the use cases need] (all cases) |
| P2 | [Test accounts: one per persona in chunk 04, plus one account with no role] (all cases) |
| P3 | [Data that must exist or accumulate before certain cases can run] |
| P4 | [Ability to stage failures and exceptional situations, with the delivery team] |

---

## 1. [Feature area] ([UC-NN, MK-NN or screen IDs, NFR-NN])

| TC ID | TC Name | TC Description | TC Example | Success Criteria | Related UC | Related Task | Needs | Testing Result | Testing Comment |
|-------|---------|----------------|------------|------------------|-----------|--------------|-------|----------------|-----------------|
| TC-XXX-01 | [Short name - positive] | Verify [the Main Flow outcome for the actor] | [A concrete action with realistic data] | [The observable outcome, in business terms] | UC-NN (AC-1) | TASK-NN | TASK-NN | | |
| TC-XXX-02 | [Short name - alternative] | Verify [alternate flow A1] | [Concrete example] | [Observable outcome] | UC-NN (A1) | TASK-NN | TASK-NN | | |
| TC-XXX-03 | [Short name - negative] | Verify [exception flow E1, a validation failure, or access refused for a role the matrix excludes] | [Concrete example] | [What the user sees and can do next; what did not change] | UC-NN (E1) | TASK-NN | TASK-NN; P4 | | |
| TC-XXX-04 | [Short name - boundary] | Verify [a numeric or time-based rule at, below, and above its limit] | [Values on each side of the limit] | [Outcome on each side] | UC-NN (BR-2) | TASK-NN | TASK-NN | | |
| TC-XXX-05 | [Short name] (Provisional) | Verify [behaviour whose expected result is not final] | [Concrete example] | [Documented expectation so far]. Pending TD-NN | UC-NN (E2) | TASK-NN | TASK-NN | | |
| TC-RPT-01 | [Report check] | Verify [the stated report outcome] | [Concrete report action] | [Source-defined outcome] | [09 / Report](./09-reporting-and-analytics.md) | TASK-NN | TASK-NN; P3 | | |

## 2. [Feature area] ([UC-NN, ...])

| TC ID | TC Name | TC Description | TC Example | Success Criteria | Related UC | Related Task | Needs | Testing Result | Testing Comment |
|-------|---------|----------------|------------|------------------|-----------|--------------|-------|----------------|-----------------|
| TC-YYY-01 | [Short name] | Verify [...] | [...] | [...] | UC-NN | TASK-NN | TASK-NN | | |

<!-- One numbered section per feature area: a group of cases that share a screen or a goal (it may cover several use cases, or none). Order: access first, then the main journey of chunk 05, then administration, then the two closing sections below. Normally one 3-letter area code per section. Sections are for reading: each case runs when its own Needs are ready. Related Task is the task that delivers the screen or step the case checks. Needs lists tasks first, then prerequisites: TASK-05, TASK-02; P4. -->

## [N]. Cross-Cutting UI/UX Standards (chunk 11)

<!-- One case per task that shows the standard, or per group of such tasks in the same wave, checked on their own screens and related to them. When the cross-cutting task has nothing of its own to see, the case on the earliest screens also names it in Related Task: that is its required case. -->

| TC ID | TC Name | TC Description | TC Example | Success Criteria | Related UC | Related Task | Needs | Testing Result | Testing Comment |
|-------|---------|----------------|------------|------------------|-----------|--------------|-------|----------------|-----------------|
| TC-UIX-01 | [Standard name] - [earliest screens] | Verify [a global UI/UX expectation from chunk 11] on [the earliest screens that show it] | [Screens to exercise] | [The standard, observed] | UC-NN | TASK-NN, TASK-NN | TASK-NN, TASK-NN | | |
| TC-UIX-02 | [Standard name] - [later screens] | Verify [the same expectation] on [the screens of a later task] | [Screens to exercise] | [The standard, observed] | UC-NN | TASK-NN | TASK-NN | | |

## [N+1]. NFR Acceptance (NFR-01..NFR-NN)

| TC ID | TC Name | TC Description | TC Example | Success Criteria | Related UC | Related Task | Needs | Testing Result | Testing Comment |
|-------|---------|----------------|------------|------------------|-----------|--------------|-------|----------------|-----------------|
| TC-NFR-01 | [Quality name] | Verify [the business expectation of NFR-NN] | [How it is exercised] | [The business measure from chunk 10] | NFR-NN | TASK-NN | TASK-NN | | |
| TC-NFR-02 | [Quality name] | Verify [an expectation that can only be judged over time] | [What is logged or observed across the UAT period] (BAT observation) | [The business measure from chunk 10] | NFR-NN | TASK-NN | TASK-NN | | |

---

## Traceability Matrix

| BRD Reference | Covered By |
|---------------|-----------|
| UC-01 [Use case title] | TC-XXX-01..05, TC-UIX-01 |
| UC-02 [Use case title] | TC-YYY-01..NN |
| 09 / [Report title] | TC-RPT-01 |
| NFR-01 [Quality] | TC-NFR-01 |

## Task acceptance

<!-- One row per task in chunk 15, in execution order, derived from the Related Task column (retired cases excluded). A task is Accepted (complete) when every required case passes; its Delivery status is recorded in chunk 15, not here. Every task has at least one required case: a task with none goes under Coverage gaps. -->

| Task | Wave | Required cases |
|------|------|----------------|
| TASK-01 [Title] | 1 | TC-XXX-01..05 |
| TASK-02 [Title] | 1 | TC-UIX-01 |
| TASK-03 [Title] | 2 | TC-YYY-01..NN, TC-UIX-01 |

## Provisional and blocked scenarios

<!-- Every test case whose expected result cannot be finalised (a gap found while writing the suite), and every case whose Related Task, or a task in its Needs, is Blocked or not sequenced in chunk 15. If none: "None. Every expected result is grounded in a confirmed requirement." -->

| TC ID | Why the expected result is not final | To-do item | What finalises it |
|-------|--------------------------------------|-----------|-------------------|
| TC-XXX-05 | [The requirement that is unresolved] | [TD-NN](./14-todo.md) | [The decision, then a refresh of this case] |

## Coverage gaps

<!-- A use case, flow, business rule, acceptance criterion, or NFR with no test case, and a task with no required case. Always fill the "Checked" line with real counts, also when there are no gaps. -->

**Checked:** [n] Main Flows, [n] alternate flows, [n] exception flows, [n] acceptance criteria, [n] numeric or time-based rules, [n] NFRs, [n] section-derived capabilities with no UC, [n] flowchart branches, [n] tasks. **Without a case:** [n].

**Counted numeric rules:** [source reference + limit for each distinct rule]. Below/at/above cases do not multiply the rule count. Example: 20 requests/day and a 30-minute deadline = 2 rules.

| BRD Reference | Gap | Reason | To-do item / action |
|---------------|-----|--------|---------------------|
| [UC-NN E2] | [No case yet] | [The exception flow does not say what the actor sees] | [TD-NN](./14-todo.md) |

## Execution summary (fill at the end of the cycle)

| Metric | Count |
|--------|-------|
| Total test cases | [n] |
| Success | |
| Failed | |
| Blocked | |
| Not Run | |

**Exit criteria (BAT sign-off):** all Critical-path cases pass (Recommendation: sections [list], chosen because their use cases carry a Business Objective or sit on the main journey; the product manager confirms the list); no open Failed case without a business-accepted deviation; no `(Provisional)` case left unresolved; [any acceptance evidence the NFRs name, validated by the named persona]; [each dependency of chunk 02 needed before BAT sign-off, by name, in place]; [each dependency needed before go-live, by name and owner, listed for the go-live decision].

<!-- MASTER: [project-slug]-brd-master.md | PREV: 15-implementation.md | NEXT: 17-for-ppt.md -->

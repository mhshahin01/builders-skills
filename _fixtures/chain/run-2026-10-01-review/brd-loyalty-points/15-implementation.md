<!--
CHUNK: 15
TITLE: Implementation Plan
PROJECT: Loyalty Points
VERSION: 1.2
DEPENDS_ON: 02, 03, 05, 06a+ (every use-case chunk), 07, 08, 09, 10, 11, 13, 14
PART OF: BRD - Loyalty Points
TYPE: Delivery chunk
GATE: Locked until 14-todo.md is fully cleared: all five steps Complete with evidence, every to-do item Resolved (Deferred does not count), no override. Never written or refreshed while the gate is shut.
MERGE: Included in the merged / combined BRD. Read by sdd-unifier as input context only.
PURPOSE: One actionable, dependency-ordered plan that consolidates every 06* use case into implementation tasks other agents can pick up: what to do, in what order, and how completion is assessed.
LANGUAGE: Business language only. Tasks describe capabilities to deliver, never technology, architecture, or tooling. The how is owned by the SDD and LLD.
RULES: delivery-chunks.md in the brd-unifier skill. The BRD body is authoritative; this plan cites it and never adds requirements.
-->

# Implementation Plan

> **What this is.** Every use case in chunks 06* turned into scoped tasks with stable IDs, ordered so that no task comes before something it depends on. Shared prerequisites and duplicate work are consolidated once.
>
> **What this is not.** It is not a design. It names what to deliver and how completion is judged; the solution design (SDD) and low-level design (LLD) own the how.

**Plan status:** Stale (the business review of 2026-10-01 changed the BRD body and raised open items; see [14-todo.md](./14-todo.md) § Business review) | **Basis:** BRD v1.2 | **Gate verified:** 2026-10-01 (see [14-todo.md](./14-todo.md)) | **Flowcharts used:** Figure 2 (UC-02); UC-01 has none (fewer than 3 Main Flow steps) | **New items raised while writing this plan:** 0

## How to use this plan

1. Read [loyalty-points-brd-master.md](./loyalty-points-brd-master.md), then the use cases a task cites, before starting the task.
2. Work wave by wave. A task can start once every task in its **Dependencies** has reached `Ready for test`. Their acceptance is not a start condition. A team may choose to wait for that acceptance, except when a required case of the dependency lists this task in its Needs cell (chunk 16): that wait would never end.
3. Tasks listed together in a wave can run in parallel.
4. Record each task's progress in its **Delivery status**: `Not started`, `In progress`, `Ready for test`, then `Accepted`.
   - `Ready for test` (implemented): the delivery team confirms that every expected deliverable is built and ready for testing. Record the date and who confirmed it.
   - `Accepted` (complete): every required case of the task passes. The required cases are the test cases in [16-uat-bat-test-cases.md](./16-uat-bat-test-cases.md) whose Related Task names the task (see its Task acceptance table). Record the date.
5. A task is complete only when it is `Accepted`. Testing does not wait for a wave or a section to finish: each test case runs as soon as the tasks and prerequisites in its Needs cell are ready.
6. A `Provisional (TD-NN)` task may be started, but the part named by its to-do item is not final. A `Blocked` task, and any task that waits for it, must not be started.
7. If the BRD and this plan disagree, the BRD wins. Report the difference; do not resolve it silently.

## Use-case coverage

| Use case | Source chunk | Tasks |
|----------|--------------|-------|
| UC-01 View Points Balance | [06a](./06a-use-cases-member.md#uc-01-view-points-balance) | TASK-03; shared: TASK-01, TASK-02 |
| UC-02 View Points History | [06a](./06a-use-cases-member.md#uc-02-view-points-history) | TASK-04; shared: TASK-01, TASK-02 |

## Execution sequence

| Wave | Tasks (can run in parallel) | Depends on |
|------|-----------------------------|-----------|
| 1 | TASK-01, TASK-02 | None |
| 2 | TASK-03, TASK-04 | Wave 1: TASK-01, TASK-02 |

## Dependency problems

None identified. Checked:

- Cycles: none. Wave 2 depends only on wave 1, and wave 1 depends on nothing.
- Missing prerequisites: none. "The member is signed in" (UC-01 and UC-02 Preconditions) is delivered by the confirmed dependency "Member sign-in" ([02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies)). Purchases come from POS Records and paid refunds from the Refunds Portal ([08](./08-integrations.md#integrations)); both are confirmed dependencies in 02. A member with points (UC-01 AC-1) is produced by TASK-01.
- Blockers: none. No to-do item is open.

| ID | Type | Tasks and use cases affected | Evidence | Needed to unblock | To-do item | Status |
|----|------|------------------------------|----------|-------------------|-----------|--------|
| - | None | - | - | - | - | - |

---

## Tasks

### TASK-01: Record points earned and taken back

| | |
|---|---|
| **Objective** | Every purchase that POS Records reports, and every refund that the Refunds Portal reports as paid, becomes the right points movement. The balance and the history then show the right points. |
| **Scope** | In: points earned on reported branch purchases; points taken back on paid refunds, including refunds of part of a purchase and refunds reported before their purchase; movement dates; no 0-point movements; the balance as the sum of the movements; the timing in NFR-02 and NFR-03. Out: the balance screen (TASK-03); the history screen (TASK-04); sign-in and access (TASK-02). |
| **Type** | Foundation |
| **Wave** | 1 |
| **Source use cases** | [06a / UC-01](./06a-use-cases-member.md#uc-01-view-points-balance), [06a / UC-02](./06a-use-cases-member.md#uc-02-view-points-history) |
| **Source requirements** | [03 / Points movement](./03-definitions-and-domain-concepts.md#points-movement) (Earning, No 0-point movements, Movement date; the balance is the sum of the movements); UC-02 BR-1, BR-3, BR-4; [08 / POS Records, Refunds Portal](./08-integrations.md#integrations); [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies) "POS Records", "Refunds Portal"; [10 / NFR-01, NFR-02, NFR-03](./10-nfrs.md#non-functional-requirements). Foundation evidence: the points movement concept (03) and both partners (08) serve UC-01 and UC-02. |
| **Dependencies** | None |
| **Can run in parallel with** | TASK-02 |
| **Status basis** | Confirmed |
| **Delivery status** | Not started |

**Expected deliverables**

- Points earned on every purchase that POS Records reports: 1 point for each whole 1 EUR spent, and no movement for a purchase that earns 0 points.
- Points taken back on every refund that the Refunds Portal reports as paid, including part refunds: 1 point for each whole 1 EUR refunded, no movement for a refund that takes back 0 points, never more than the purchase earned, and all of them once the whole purchase is refunded.
- A paid refund reported before its purchase is kept and applied when POS Records reports the purchase.
- Each movement carries the purchase date, or the date the refund was paid.
- A balance that always equals the sum of the member's movements.

**Completion criteria** (TASK-01 has nothing of its own to see. Its criteria are checked on the earliest screens that show it: LP-01 in TASK-03 and LP-02 in TASK-04.)

- [ ] 03 / Earning: a 12.60 EUR purchase earns 12 points (UC-02 AC-3)
- [ ] 03 / No 0-point movements, UC-02 BR-3: a 0.99 EUR purchase, or a 0.90 EUR refund that leaves part of the purchase unrefunded, creates no movement
- [ ] 03 / Movement date: purchase date for points earned, refund paid date for points taken back
- [ ] UC-02 BR-1: no points taken back before the Refunds Portal reports the refund as paid
- [ ] UC-02 AC-1: full refund of a 50-point purchase shows -50
- [ ] UC-02 BR-3, AC-6: a 30.50 EUR part refund takes back 30 points; never more than earned; all points once the whole purchase is refunded
- [ ] UC-02 BR-4: a refund reported before its purchase is applied when POS Records reports the purchase
- [ ] NFR-01: the balance equals the sum of the movements; no upheld balance complaint over the UAT/BAT period
- [ ] NFR-02: points taken back show within 1 hour of the Refunds Portal's report, or of POS Records' report if later
- [ ] NFR-03: points earned show within 1 hour of POS Records' report

**Assumptions, open questions, blockers**

- Assumption: none. POS Records same-day reporting and the Refunds Portal are confirmed dependencies ([02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies)).
- Open question: None.
- Blocker: None.

---

### TASK-02: Let signed-in members see only their own points

| | |
|---|---|
| **Objective** | Only a member signed in with their existing loyalty program account sees points, and only their own. |
| **Scope** | In: using the existing member sign-in to know which member is viewing; showing no points to anyone not signed in; showing each member only their own points. Out: joining the program and the sign-in itself ([04 / Out of Scope](./04-scope-and-personas.md#out-of-scope)); the balance and history screens (TASK-03, TASK-04). |
| **Type** | Cross-cutting |
| **Wave** | 1 |
| **Source use cases** | [06a / UC-01](./06a-use-cases-member.md#uc-01-view-points-balance), [06a / UC-02](./06a-use-cases-member.md#uc-02-view-points-history) |
| **Source requirements** | [07 matrix](./07-users-use-cases-matrix.md), footnote (1) "Own points only"; UC-01 BR-1; UC-02 BR-2; UC-01 and UC-02 Preconditions; [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies) "Member sign-in"; [04 / Personas](./04-scope-and-personas.md) Access Level. Cross-cutting evidence: access control from the matrix (07), shared by UC-01 and UC-02. |
| **Dependencies** | None |
| **Can run in parallel with** | TASK-01 |
| **Status basis** | Confirmed |
| **Delivery status** | Not started |

**Expected deliverables**

- Points are shown only after the member signs in with their existing loyalty program account.
- Each member sees only their own balance and history.

**Completion criteria** (TASK-02 has nothing of its own to see. Its criteria are checked on the earliest screens that show it: LP-01 in TASK-03 and LP-02 in TASK-04.)

- [ ] UC-01 and UC-02 Preconditions: no points are shown to a visitor who is not signed in
- [ ] 07 matrix footnote (1), UC-01 BR-1: a member sees only their own balance
- [ ] 07 matrix footnote (1), UC-02 BR-2: a member sees only their own history

**Assumptions, open questions, blockers**

- Assumption: none. The member sign-in is a confirmed dependency ([02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies)).
- Open question: None.
- Blocker: None.

---

### TASK-03: Show the points balance (UC-01)

| | |
|---|---|
| **Objective** | A signed-in member sees their current balance and the date of their last movement on screen LP-01. |
| **Scope** | In: UC-01 steps 1-2, A1, and E1 on LP-01. Out: recording movements (TASK-01); sign-in and access (TASK-02); the history (TASK-04). |
| **Type** | Use-case delivery |
| **Wave** | 2 |
| **Source use cases** | [06a / UC-01](./06a-use-cases-member.md#uc-01-view-points-balance) |
| **Source requirements** | UC-01 Preconditions, steps 1-2, A1, E1, BR-1, AC-1 to AC-3; 03 / Movement date; [11 / UI/UX Expectations](./11-summary-and-uiux.md) (whole numbers; phones and computers); NFR-01; LP-01 ([14 / Mockup coverage](./14-todo.md)) |
| **Dependencies** | TASK-01 (UC-01 AC-1 needs a member with points, and the balance is the sum of the movements, 03); TASK-02 (UC-01 Preconditions: the member is signed in) |
| **Can run in parallel with** | TASK-04 |
| **Status basis** | Confirmed |
| **Delivery status** | Not started |

**Expected deliverables**

- LP-01 shows the balance and the date of the last movement.
- LP-01 shows the no-movements state (A1) and the cannot-be-shown message (E1).

**Completion criteria**

- [ ] UC-01 AC-1: 120 points and the last-movement date are shown
- [ ] UC-01 AC-2: no movements: 0, no date, and how points are earned
- [ ] UC-01 AC-3: points cannot be shown: the try-again message
- [ ] UC-01 Preconditions: no balance on LP-01 for a visitor who is not signed in
- [ ] 07 matrix footnote (1), UC-01 BR-1: only the member's own balance on LP-01
- [ ] 03 / Movement date: the last-movement date on LP-01
- [ ] 11 / Points are whole numbers on LP-01
- [ ] 11 / LP-01 works on phones and computers
- [ ] NFR-01: the balance on LP-01 equals the sum of the member's movements; no upheld balance complaint over the UAT/BAT period

**Assumptions, open questions, blockers**

- Assumption: none.
- Open question: None.
- Blocker: None.

---

### TASK-04: Show the points history (UC-02)

| | |
|---|---|
| **Objective** | A signed-in member sees every points movement, newest first, on screen LP-02, and opens any movement to see the purchase or refund behind it. |
| **Scope** | In: UC-02 steps 1-4, A1, A2, and E1 on LP-02, including how the points rules of TASK-01 show there. Out: recording movements and applying the refund rules (TASK-01); sign-in and access (TASK-02); exporting the history (UC-02 Future Enhancements). |
| **Type** | Use-case delivery |
| **Wave** | 2 |
| **Source use cases** | [06a / UC-02](./06a-use-cases-member.md#uc-02-view-points-history) |
| **Source requirements** | UC-02 Preconditions, steps 1-4, A1, A2, E1, BR-2, AC-1 to AC-8; UC-02 BR-1, BR-3, BR-4 and 03 / Points movement as shown on LP-02; [Figure 2](./06a-use-cases-member.md#flowchart); [11 / UI/UX Expectations](./11-summary-and-uiux.md) (whole numbers, minus sign; phones and computers); NFR-01, NFR-02, NFR-03 as observed on LP-02; LP-02 ([14 / Mockup coverage](./14-todo.md)) |
| **Dependencies** | TASK-01 (the movements listed at UC-02 step 2, including points taken back, A1); TASK-02 (UC-02 Preconditions: the member is signed in) |
| **Can run in parallel with** | TASK-03 |
| **Status basis** | Confirmed |
| **Delivery status** | Not started |

**Expected deliverables**

- LP-02 lists every movement, newest first, with its date, reference, and points.
- Opening a movement shows the purchase or refund it came from: reference, date, amount in EUR, and points.
- LP-02 shows movements of points taken back (A1), the no-movements state (A2), and the cannot-be-shown message at step 2 or step 4 (E1).

**Completion criteria**

- [ ] UC-02 AC-2: three movements, newest first, each with date, reference, and points
- [ ] UC-02 AC-3: a movement of points earned opens the purchase: reference, date, 12.60 EUR, 12 points
- [ ] UC-02 AC-4: a movement of points taken back opens the refund details
- [ ] UC-02 AC-1: -50 movement with the refund reference after a full refund
- [ ] UC-02 AC-6: -30 movement after a 30.50 EUR part refund
- [ ] UC-02 AC-8: no movements: the empty state and how points are earned
- [ ] UC-02 AC-5, AC-7: history or movement cannot be shown: the try-again message
- [ ] UC-02 A1: the flow continues at step 3 (Figure 2)
- [ ] UC-02 Preconditions: no history on LP-02 for a visitor who is not signed in
- [ ] 07 matrix footnote (1), UC-02 BR-2: only the member's own history on LP-02
- [ ] 03 / Earning, No 0-point movements, Movement date, and UC-02 BR-1, BR-3, BR-4, as shown on LP-02
- [ ] NFR-01 (including no upheld balance complaint over the UAT/BAT period), NFR-02, and NFR-03 observed on LP-02
- [ ] 11 / Points are whole numbers, with a minus sign on movements of points taken back
- [ ] 11 / LP-02 works on phones and computers

**Assumptions, open questions, blockers**

- Assumption: none.
- Open question: None.
- Blocker: None.

<!-- MASTER: loyalty-points-brd-master.md | PREV: 14-todo.md | NEXT: 16-uat-bat-test-cases.md -->

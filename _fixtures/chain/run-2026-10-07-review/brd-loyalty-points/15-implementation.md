<!--
CHUNK: 15
TITLE: Implementation Plan
PROJECT: Loyalty Points
VERSION: 1.8
DEPENDS_ON: 02, 03, 05, 06a+ (every use-case chunk), 07, 08, 09, 10, 11, 13, 14
PART OF: BRD - Loyalty Points
TYPE: Delivery chunk
GATE: Locked until 14-todo.md is fully cleared: all five steps Complete with evidence, every to-do item Resolved (Deferred does not count), no override. Never written or refreshed while the gate is shut. A Stale mark and execution tracking are allowed (delivery-chunks.md § The delivery gate, Re-lock, and § Refresh triggers).
MERGE: Included in the merged / combined BRD. Read by sdd-unifier as input context only.
PURPOSE: One actionable, dependency-ordered plan that consolidates every 06* use case into implementation tasks other agents can pick up: what to do, in what order, and how completion is assessed.
LANGUAGE: Business language only. Tasks describe capabilities to deliver, never technology, architecture, or tooling. The how is owned by the SDD and LLD.
RULES: delivery-chunks.md in the brd-unifier skill. The BRD body is authoritative; this plan cites it and never adds requirements.
-->

# Implementation Plan

> **What this is.** Every use case in chunks 06* turned into scoped tasks with stable IDs, ordered so that no task comes before something it depends on. Shared prerequisites and duplicate work are consolidated once.
>
> **What this is not.** It is not a design. It names what to deliver and how completion is judged; the solution design (SDD) and low-level design (LLD) own the how.

**Plan status:** Up to date | **Basis:** BRD v1.8 | **Gate verified:** 2026-10-06 (see [14-todo.md](./14-todo.md)) | **Flowcharts used:** Figures 3-4 | **New items raised while writing this plan:** 0

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
| UC-01 View Points Balance | [06a](./06a-use-cases-member.md#uc-01-view-points-balance) | TASK-07; with TASK-01, TASK-02, TASK-03, TASK-04, TASK-05, TASK-06 |
| UC-02 View Points History | [06a](./06a-use-cases-member.md#uc-02-view-points-history) | TASK-08; with TASK-01, TASK-02, TASK-03, TASK-04, TASK-05, TASK-06 |
| UC-03 Correct a Member's Points | [06b](./06b-use-cases-loyalty-administrator.md#uc-03-correct-a-members-points) | TASK-09; with TASK-01, TASK-02, TASK-03, TASK-05, TASK-06, TASK-10 |

## Execution sequence

| Wave | Tasks (can run in parallel) | Depends on |
|------|-----------------------------|-----------|
| 1 | TASK-01, TASK-02, TASK-03 | None |
| 2 | TASK-04, TASK-05, TASK-06, TASK-07, TASK-08, TASK-09 | Wave 1 |
| 3 | TASK-10 | Wave 2 (TASK-09) and Wave 1 |

## Dependency problems

None identified. Checked:

- Preconditions: UC-01 and UC-02 need a signed-in member, and UC-03 a signed-in Loyalty Administrator. TASK-02 delivers both, with the Confirmed chunk 02 dependencies "Member sign-in and membership" and "Staff sign-in".
- States produced by using the product: the Monthly corrections report lists the corrections made in UC-03, so TASK-10 depends on TASK-09. The corrections shown in UC-02 A3, and the take-backs of purchases named in corrections (UC-03 BR-4, BR-6), use corrections from TASK-09 only in some test cases. They are test needs in the same wave (chunk 16, Needs), not start conditions for TASK-08 or TASK-06.
- The go-live handover and the membership dates: TASK-04 and TASK-05 come after the tasks they build on.
- Include and extend relations: none documented (14 / step 5).
- Cycles: no task depends on a task in its own wave or a later one.
- Missing prerequisites: none. Every precondition has a task or a Confirmed chunk 02 dependency.

---

## Tasks

### TASK-01: Earn points on branch purchases and keep each member's balance

| | |
|---|---|
| **Objective** | Members earn points on the branch purchases POS Records reports, and each member has a points balance made of their movements. |
| **Scope** | In: Earned movements (1 point per 1 EUR paid after discounts, rounded down on each purchase); one earn per purchase however often it is reported; no movement for a purchase that earns 0 points; no points for a purchase made before the go-live date; the balance as the sum of the movements since the member last joined, never below 0. Out: the opening balance (TASK-04), leaving and rejoining (TASK-05), take-backs (TASK-06), corrections (TASK-09), the screens (TASK-07, TASK-08). |
| **Type** | Foundation |
| **Wave** | 1 |
| **Source use cases** | [06a / UC-01](./06a-use-cases-member.md#uc-01-view-points-balance), [06a / UC-02](./06a-use-cases-member.md#uc-02-view-points-history), [06b / UC-03](./06b-use-cases-loyalty-administrator.md#uc-03-correct-a-members-points) |
| **Source requirements** | 03 / Points movement (Overview; Movement types: Earned, Opening balance; Structure); 08 / POS Records; 02 / Assumptions 1 and 2; NFR-01; NFR-03 |
| **Dependencies** | None |
| **Can run in parallel with** | TASK-02, TASK-03 |
| **Status basis** | Confirmed |
| **Delivery status** | Not started |

**Expected deliverables**

- Every member purchase that POS Records reports becomes an Earned movement for that member, with its date, branch, amount paid, and points.
- Each member's points balance, kept as the sum of their movements.
- A purchase reported more than once earns once.

**Completion criteria** (each cites its source; a short label, not the restated text)

- [ ] 03 / Movement types (Earned): a 12.80 EUR purchase earns 12 points, seen on the UC-01 balance
- [ ] 03 / Structure: a purchase reported twice earns once
- [ ] UC-02 AC-24: a purchase that earns 0 points adds no movement
- [ ] UC-02 AC-26: a purchase made before go-live earns nothing
- [ ] NFR-03: points show by the end of the purchase day
- [ ] NFR-01: every test balance matches its movements

**Assumptions, open questions, blockers**

- Assumption: POS Records reports every member purchase by 22:00 branch local time on the day it is made, and every branch closes by 21:00 ([02 / Assumption 1](./02-glossary-assumptions-facts.md#assumptions--constraints)).
- Assumption: purchase and refund references are never reused ([02 / Assumption 2](./02-glossary-assumptions-facts.md#assumptions--constraints)).
- Open question: None.
- Blocker: None. 02 / Dependency "POS Records" (Needed before Build of UC-01) is Confirmed; it is listed under TASK-07.

---

### TASK-02: Know who is signed in, their membership, and what they may see

| | |
|---|---|
| **Objective** | The product knows which member or staff member is signed in, whether a signed-in customer is a member, and the dates a member left or rejoined. Each person sees only what the Users & Use Cases Matrix allows. |
| **Scope** | In: the signed-in member and their member number from Member sign-in and membership; the dates a member left or rejoined; the signed-in staff member and whether they hold the Loyalty Administrator role, from Staff sign-in; access by the matrix (own points only for members; UC-03 for the Loyalty Administrator only). Out: joining the program and the sign-in itself (04 / Out of Scope); what each screen shows (TASK-07 to TASK-10); the leave and rejoin rules (TASK-05). |
| **Type** | Cross-cutting |
| **Wave** | 1 |
| **Source use cases** | [06a / UC-01](./06a-use-cases-member.md#uc-01-view-points-balance), [06a / UC-02](./06a-use-cases-member.md#uc-02-view-points-history), [06b / UC-03](./06b-use-cases-loyalty-administrator.md#uc-03-correct-a-members-points) |
| **Source requirements** | 02 / Dependencies "Member sign-in and membership" and "Staff sign-in"; 08 / Member sign-in and membership; 08 / Staff sign-in; 07 matrix; NFR-07 |
| **Dependencies** | None |
| **Can run in parallel with** | TASK-01, TASK-03 |
| **Status basis** | Confirmed |
| **Delivery status** | Not started |

**Expected deliverables**

- The signed-in member, their member number, and the dates they left or rejoined are known to the product.
- The signed-in staff member and whether they hold the Loyalty Administrator role are known to the product.
- Access follows the Users & Use Cases Matrix.

**Completion criteria** (nothing of its own to see: checked on the earliest screens, the UC-01 balance)

- [ ] UC-01 BR-1 and 07 matrix: a member sees only their own balance
- [ ] UC-01 AC-4: a signed-in customer who is not a member sees no balance
- [ ] NFR-07: one member's attempt to see another member's points fails

**Assumptions, open questions, blockers**

- Assumption: None beyond chunk 02.
- Open question: None.
- Blocker: None. 02 / Dependency "Member sign-in and membership" (Needed before Build of UC-01) and "Staff sign-in" (Needed before Build of UC-03) are Confirmed; they are listed under TASK-07 and TASK-09.

---

### TASK-03: Apply the global UI/UX standards

| | |
|---|---|
| **Objective** | Every screen follows the chunk 11 standards, and the member screens meet NFR-06. |
| **Scope** | In: Primary Color #1F6FEB; Data Tables and Filtration; Error Messages; Responsive Design (desktop, tablet, mobile); Language & Locale (English, DD/MM/YYYY, EUR with two decimals); Points display (minus sign for negative movements); WCAG 2.1 level AA for the UC-01 and UC-02 screens. Out: the content of each screen (TASK-07 to TASK-10). |
| **Type** | Cross-cutting |
| **Wave** | 1 |
| **Source use cases** | [06a / UC-01](./06a-use-cases-member.md#uc-01-view-points-balance), [06a / UC-02](./06a-use-cases-member.md#uc-02-view-points-history), [06b / UC-03](./06b-use-cases-loyalty-administrator.md#uc-03-correct-a-members-points) |
| **Source requirements** | [11 / UI/UX Expectations](./11-summary-and-uiux.md#uiux-expectations); NFR-06; the approved mockups MK-01 to MK-04 ([14 / step 4](./14-todo.md)) |
| **Dependencies** | None |
| **Can run in parallel with** | TASK-01, TASK-02 |
| **Status basis** | Confirmed |
| **Delivery status** | Not started |

**Expected deliverables**

- One set of screen standards that TASK-07 to TASK-10 use.

**Completion criteria** (nothing of its own to see: checked on the earliest screens, the UC-01 balance)

- [ ] 11 / Primary Color, Error Messages, Responsive Design, Language & Locale hold on the UC-01 screens
- [ ] NFR-06: the UC-01 screens meet WCAG 2.1 level AA

**Assumptions, open questions, blockers**

- Assumption: None.
- Open question: None.
- Blocker: None.

---

### TASK-04: Carry over each member's points at go-live

| | |
|---|---|
| **Objective** | The points each member held at the start of the go-live date become their Opening balance movement. |
| **Scope** | In: one Opening balance movement per member, dated on the go-live date, from the go-live handover; none for a member who held 0 points. Out: refunds of purchases made before go-live (TASK-06); the screens (TASK-07, TASK-08). |
| **Type** | Foundation |
| **Wave** | 2 |
| **Source use cases** | [06a / UC-01](./06a-use-cases-member.md#uc-01-view-points-balance), [06a / UC-02](./06a-use-cases-member.md#uc-02-view-points-history) |
| **Source requirements** | 03 / Movement types (Opening balance); 08 / Points balances at go-live; 02 / Dependency "Points balances at go-live"; 02 / Challenges, item 2; 04 / In Scope |
| **Dependencies** | TASK-01 (the opening balance is a movement in the balance TASK-01 keeps; 03 / Structure) |
| **Can run in parallel with** | TASK-05, TASK-06, TASK-07, TASK-08, TASK-09 |
| **Status basis** | Confirmed |
| **Delivery status** | Not started |

**Expected deliverables**

- An Opening balance movement for every member who held points at the start of the go-live date.

**Completion criteria** (nothing of its own to see: checked on the UC-01 balance)

- [ ] 03 / Movement types (Opening balance): a member who held 200 points starts with a balance of 200, dated on the go-live date
- [ ] UC-02 AC-19: a purchase made on the go-live date earns separately
- [ ] UC-02 AC-25: a member who held 0 points gets no Opening balance movement

**Assumptions, open questions, blockers**

- Assumption: None.
- Open question: None.
- Blocker: None. 02 / Dependency "Points balances at go-live" (Marketing team) is Needed before go-live, not before a build; it is named in the chunk 16 exit criteria.

---

### TASK-05: End points when a member leaves, restart them on a rejoin, and keep the history 24 months

| | |
|---|---|
| **Objective** | A member who leaves has no balance; a member who rejoins starts again from the day they rejoin; a former member's history is kept for 24 months, then deleted. |
| **Scope** | In: no balance after leaving; a rejoin starts with no points and counts only the movements from the rejoin day; a rejoin on the day the member left counts from the next day, and the person is a former member until then; a purchase made on or after the rejoin day earns points even when the rejoin is reported late; former-member history is never shown, is kept 24 months after leaving, and is then deleted (a deletion request does not shorten this). Out: refunds of purchases made before the rejoin day (TASK-06, UC-02 BR-7); corrections dated before the rejoin day (TASK-09, UC-03 E5). |
| **Type** | Foundation |
| **Wave** | 2 |
| **Source use cases** | [06a / UC-01](./06a-use-cases-member.md#uc-01-view-points-balance), [06a / UC-02](./06a-use-cases-member.md#uc-02-view-points-history), [06b / UC-03](./06b-use-cases-loyalty-administrator.md#uc-03-correct-a-members-points) |
| **Source requirements** | [03 / Membership end and data retention](./03-definitions-and-domain-concepts.md#membership-end-and-data-retention); 03 / Overview; 08 / Member sign-in and membership; NFR-03 (late rejoin) |
| **Dependencies** | TASK-01 (the balance), TASK-02 (the dates a member left or rejoined) |
| **Can run in parallel with** | TASK-04, TASK-06, TASK-07, TASK-08, TASK-09 |
| **Status basis** | Confirmed |
| **Delivery status** | Not started |

**Expected deliverables**

- Points that end when a member leaves, and a fresh start when they rejoin.
- Former-member history kept for 24 months, never shown, then deleted.

**Completion criteria** (nothing of its own to see: checked on the UC-01 balance)

- [ ] UC-01 E2 and AC-4: a former member sees no balance
- [ ] 03 / Membership end: a member who rejoins starts with 0 points
- [ ] UC-01 AC-6: after a same-day leave and rejoin, no account is shown until the next day
- [ ] UC-02 AC-27: a purchase on the rejoin day earns points when the rejoin is reported late
- [ ] 03 / Membership end: former-member history is deleted 24 months after the member leaves

**Assumptions, open questions, blockers**

- Assumption: None.
- Open question: None.
- Blocker: None.

---

### TASK-06: Take back points when a refund is paid

| | |
|---|---|
| **Objective** | When the Refunds Portal reports a refund as paid, the points the refunded purchase earned are taken back under the UC-02 rules. |
| **Scope** | In: UC-02 BR-1 and BR-3 to BR-8; no movement for a take-back of 0 points; take-backs for purchases named in corrections (UC-03 BR-4, BR-6). Out: showing the movements (TASK-07, TASK-08); entering corrections (TASK-09). |
| **Type** | Foundation |
| **Wave** | 2 |
| **Source use cases** | [06a / UC-02](./06a-use-cases-member.md#uc-02-view-points-history), [06a / UC-01](./06a-use-cases-member.md#uc-01-view-points-balance), [06b / UC-03](./06b-use-cases-loyalty-administrator.md#uc-03-correct-a-members-points) |
| **Source requirements** | 03 / Movement types (Taken back), Structure; UC-02 BR-1, BR-3 to BR-8; UC-03 BR-4, BR-6; 08 / Refunds Portal; 02 / Assumptions 2 and 3; NFR-02 |
| **Dependencies** | TASK-01 (take-backs follow the points a purchase earned), TASK-02 (the rejoin dates UC-02 BR-7 needs) |
| **Can run in parallel with** | TASK-04, TASK-05, TASK-07, TASK-08, TASK-09 |
| **Status basis** | Confirmed |
| **Delivery status** | Not started |

**Expected deliverables**

- A Taken back movement for every paid refund that takes back points, with its refund reference.

**Completion criteria** (nothing of its own to see: checked on the UC-02 history)

- [ ] UC-02 AC-1: a refund of a purchase that earned 50 points shows -50
- [ ] UC-02 AC-2, AC-3, AC-28, AC-29: partial refunds, also with cents
- [ ] UC-02 AC-15, AC-16: a rejected or cancelled refund, or a refund of a purchase that earned nothing, takes back nothing
- [ ] UC-02 AC-17: a refund paid before its purchase shows waits for the purchase
- [ ] UC-02 AC-18, AC-30: a take-back capped at the balance, and the later refund
- [ ] UC-02 AC-13, AC-14: refunds of purchases made before the rejoin day or before go-live
- [ ] UC-03 AC-13, AC-15, AC-16, AC-17: refunds of purchases named in corrections
- [ ] NFR-02: a take-back shows within 1 hour

**Assumptions, open questions, blockers**

- Assumption: the Refunds Portal reports a paid refund within 15 minutes of payment ([02 / Assumption 3](./02-glossary-assumptions-facts.md#assumptions--constraints)).
- Open question: None.
- Blocker: None. 02 / Dependency "Refunds Portal" (Needed before Build of UC-02) is Confirmed; it is listed under TASK-08.

---

### TASK-07: Show the points balance (UC-01)

| | |
|---|---|
| **Objective** | A signed-in member sees their current balance and the date of their newest movement. |
| **Scope** | In: UC-01 Main Flow, A1, E1, E2, BR-1, BR-2; the balance screen (MK-01, screen LP-01). Out: the rules behind the balance (TASK-01, TASK-04, TASK-05, TASK-06). |
| **Type** | Use-case delivery |
| **Wave** | 2 |
| **Source use cases** | [06a / UC-01](./06a-use-cases-member.md#uc-01-view-points-balance) |
| **Source requirements** | UC-01 BR-1, BR-2; 07 matrix; 11 / UI/UX Expectations; NFR-04; NFR-05; NFR-06; MK-01 |
| **Dependencies** | TASK-01, TASK-02, TASK-03 |
| **Can run in parallel with** | TASK-04, TASK-05, TASK-06, TASK-08, TASK-09 |
| **Status basis** | Confirmed |
| **Delivery status** | Not started |

**Expected deliverables**

- The balance screen with its states: default, no points yet, cannot be shown, not a member, loading.

**Completion criteria**

- [ ] UC-01 AC-1: balance and the date of the newest movement
- [ ] UC-01 AC-2: no points yet
- [ ] UC-01 AC-3: the balance cannot be shown
- [ ] UC-01 AC-4: not a member
- [ ] UC-01 AC-5: when the points for a new purchase show
- [ ] UC-01 AC-6: a same-day leave and rejoin
- [ ] 07 matrix: roles marked - are refused on this task's screens
- [ ] 11 / UI/UX Expectations hold on this task's screens
- [ ] NFR-04, NFR-05, NFR-06 business measures observed for the balance

**Assumptions, open questions, blockers**

- Assumption: None.
- Open question: None.
- Blocker: 02 / Dependency "Member sign-in and membership" and 02 / Dependency "POS Records" must be in place before the build of UC-01 starts. Both are Confirmed.

---

### TASK-08: Show the points history (UC-02)

| | |
|---|---|
| **Objective** | A signed-in member sees every movement since they last joined, newest first, and the details of each. |
| **Scope** | In: UC-02 Main Flow, A1 to A5, E1, E2, BR-2; 20 movements per page with no export and no filters; the history screen (MK-02, screen LP-02). Out: the earning and take-back rules (TASK-01, TASK-06); the opening balance (TASK-04); leaving and rejoining (TASK-05); making corrections (TASK-09). |
| **Type** | Use-case delivery |
| **Wave** | 2 |
| **Source use cases** | [06a / UC-02](./06a-use-cases-member.md#uc-02-view-points-history) |
| **Source requirements** | UC-02 BR-2; 07 matrix; 11 / Data Tables, Filtration, Points display; NFR-04; NFR-05; NFR-06; MK-02 |
| **Dependencies** | TASK-01, TASK-02, TASK-03 |
| **Can run in parallel with** | TASK-04, TASK-05, TASK-06, TASK-07, TASK-09 |
| **Status basis** | Confirmed |
| **Delivery status** | Not started |

**Expected deliverables**

- The history screen and the movement detail, with every state of MK-02.

**Completion criteria**

- [ ] UC-02 AC-4: newest first, with date, reference, and points
- [ ] UC-02 AC-5: the details of a purchase or refund movement
- [ ] UC-02 AC-6: no movements yet
- [ ] UC-02 AC-7: the history cannot be shown
- [ ] UC-02 AC-8: where to report a problem
- [ ] UC-02 AC-9, AC-20: a Correction in the list and when opened
- [ ] UC-02 AC-10, AC-21: the Opening balance in the list and when opened
- [ ] UC-02 AC-11: not a member
- [ ] UC-02 AC-12, AC-22, AC-23: the history after a rejoin
- [ ] 11 / Data Tables: 20 movements per page
- [ ] 07 matrix: roles marked - are refused on this task's screens
- [ ] 11 / UI/UX Expectations hold on this task's screens
- [ ] NFR-04, NFR-05, NFR-06 business measures observed for the history

**Assumptions, open questions, blockers**

- Assumption: None.
- Open question: None.
- Blocker: 02 / Dependency "Refunds Portal" must be in place before the build of UC-02 starts. It is Confirmed.

---

### TASK-09: Correct a member's points (UC-03)

| | |
|---|---|
| **Objective** | A Loyalty Administrator finds a member by member number and adds or removes points, or enters a missing purchase, with a reason. |
| **Scope** | In: UC-03 Main Flow, E1 to E6, BR-1 to BR-5, and the entered amount of BR-6; the record of who made each correction and when; the correction screen (MK-03). Out: refunds of purchases named in corrections (TASK-06); the Monthly corrections report (TASK-10). |
| **Type** | Use-case delivery |
| **Wave** | 2 |
| **Source use cases** | [06b / UC-03](./06b-use-cases-loyalty-administrator.md#uc-03-correct-a-members-points) |
| **Source requirements** | UC-03 BR-1 to BR-6; 07 matrix; 11 / UI/UX Expectations; NFR-01; NFR-07; MK-03 |
| **Dependencies** | TASK-01, TASK-02, TASK-03 |
| **Can run in parallel with** | TASK-04, TASK-05, TASK-06, TASK-07, TASK-08 |
| **Status basis** | Confirmed |
| **Delivery status** | Not started |

**Expected deliverables**

- The correction screen with every state of MK-03, and Corrected movements with who made them and when.

**Completion criteria**

- [ ] UC-03 AC-1: a missing purchase entered by its amount paid
- [ ] UC-03 AC-7: a plain removal recorded with who and when
- [ ] UC-03 AC-2, AC-8, AC-14: no member matches, also for a former member and on a same-day rejoin
- [ ] UC-03 AC-3: no reason given
- [ ] UC-03 AC-4: a removal larger than the balance
- [ ] UC-03 AC-5, AC-10: a later report for the same or another member
- [ ] UC-03 AC-6: the purchase already shows
- [ ] UC-03 AC-9: the history since the member rejoined
- [ ] UC-03 AC-11, AC-12: a purchase dated before the rejoin day or before go-live
- [ ] 07 matrix and NFR-07: only the Loyalty Administrator opens this task's screens
- [ ] 11 / UI/UX Expectations hold on this task's screens

**Assumptions, open questions, blockers**

- Assumption: None.
- Open question: None.
- Blocker: 02 / Dependency "Staff sign-in" must be in place before the build of UC-03 starts. It is Confirmed.

---

### TASK-10: Give the Loyalty Administrator the Monthly corrections report

| | |
|---|---|
| **Objective** | The Loyalty Administrator sees every correction made in a month and can export the list. |
| **Scope** | In: the chunk 09 Monthly corrections report (member, points added or removed, reason, who, and when; table with export to CSV and Excel); access for the Loyalty Administrator only; the report screen (MK-04). Out: making corrections (TASK-09). |
| **Type** | Cross-cutting |
| **Wave** | 3 |
| **Source use cases** | [06b / UC-03](./06b-use-cases-loyalty-administrator.md#uc-03-correct-a-members-points) (BR-3 records) |
| **Source requirements** | [09 / Monthly corrections](./09-reporting-and-analytics.md#reporting--analytics); NFR-01; NFR-07; 11 / Data Tables; MK-04 |
| **Dependencies** | TASK-02, TASK-03, TASK-09 (the corrections and their who and when, UC-03 BR-3) |
| **Can run in parallel with** | None |
| **Status basis** | Confirmed |
| **Delivery status** | Not started |

**Expected deliverables**

- The Monthly corrections report, with export to CSV and Excel.

**Completion criteria**

- [ ] 09 / Monthly corrections: every correction of the month, with member, points, reason, who, and when
- [ ] 09 / Monthly corrections: export to CSV and Excel
- [ ] 09 / Monthly corrections; NFR-01: correction counts stay distinct from the owner-held monthly upheld-complaint tally
- [ ] NFR-07: members and staff without the Loyalty Administrator role cannot open the report
- [ ] 11 / UI/UX Expectations hold on the report screen

**Assumptions, open questions, blockers**

- Assumption: None.
- Open question: None.
- Blocker: None.

<!-- MASTER: loyalty-points-brd-master.md | PREV: 14-todo.md | NEXT: 16-uat-bat-test-cases.md -->

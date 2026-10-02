<!--
CHUNK: 14
TITLE: Product Manager To-Do
PROJECT: Refunds Portal
VERSION: 1.1
DEPENDS_ON: all BRD chunks (00 through 13); updated again after 15, 16, 17 are produced
PART OF: BRD - Refunds Portal
TYPE: Delivery chunk - living checklist
MERGE: Excluded. Never part of the merged or combined BRD. Not an input to sdd-unifier.
-->

# Product Manager To-Do

> **What this is.** The ordered list of what still has to happen before this BRD can be treated as final, and what each downstream output is waiting for.

**Last updated:** 2026-10-01 | **BRD version:** 1.1 | **Steps complete:** 2 of 5

---

## Checklist at a glance

| # | Step | Status | Evidence | Unblocks |
|---|------|--------|----------|----------|
| 1 | Resolve open items and clarifications | In progress | The business review of 2026-10-01 raised open items in chunk 13 (see below); OI-01 and the applied review items are closed | Step 2 |
| 2 | Run a consistency check across all BRD chunks | In progress | Run 2, 2026-09-23, 0 open findings; the business review changed chunks after it, so the check must run again | Step 3 |
| 3 | Finalise requirements with the grill-me skill | Complete | PM confirmed session on 2026-09-23 | Steps 4 and 5 |
| 4 | Generate mockups in Figma | In progress | Approved on 2026-09-24; the business review changed screen states (see below), so the affected mockups need an update and a new play-through | The delivery gate |
| 5 | Update the use-case chunks with use-case diagrams and flowcharts | Complete | Skipped for this small BRD with reasons below (2026-09-24) | The delivery gate |

## Business review, 2026-10-01

The business review ([review-comments-tracker.md](../review-comments-tracker.md)) changed the BRD body and raised open items. Steps 1, 2, and 4 are In progress again, the gate is Shut, and chunks 15 and 16 are Stale until the open items are resolved, the consistency check reruns, the mockups are updated, and brd-unifier refreshes them.

| Review point | Chunks changed | Open items raised | What the refresh of 14, 15, and 16 must cover |
|--------------|----------------|-------------------|-----------------------------------------------|
| BO-03 | 06b UC-04 E1, AC-2; 06a UC-02 step 4; 13 | OI-03 | SCR-02 and MK-03: a payout-delayed state; TC-DEC-04 also checks that the customer is told the payout is delayed; a case for UC-02 step 4 showing a delayed payout |
| BO-05 | 02 Dependencies; 13 (OI-04) | Dependency confirmations 1 to 3 in 02 | 15: TASK-01 and TASK-03 depend on the confirmations in 02 (Provisional until confirmed); 16 P1 names the notification partner's test environment |
| BO-06 | 00 cover (In Review); 13 (OI-05; OI-03 extended); this chunk (G6) | OI-06 to OI-11 | 15 and 16 follow the outcomes of OI-06 (refused cash receipts, card-paid cap), OI-07 (look-up check and limit), OI-08 (staff accounts), OI-09 (how the manager is told), OI-10 (keeping periods), OI-11 (no native app); tasks touched by an open item are Provisional until it closes |
| BO-07 | 02 Legal clearances; 13 (OI-12) | Legal clearances L1 to L5 in 02 (go-live; L4 before TASK-03) | 16 Exit criteria: L1 to L5 confirmed before BAT sign-off; 15: TASK-03 waits for L4 |
| BO-11 | 13 | OI-13 | If OI-13 adds customer care and head office: new personas in 04 and 07, NFR-04 amended, and their screens, tasks, and cases |
| BO-12 | 02 Assumptions / Constraints 3; 13 (OI-14) | OI-15 | 15: the build waves are not the rollout; the plan notes that go-live follows constraint 3 and the OI-15 rollout plan |
| SME-01 | 13 | OI-16 | If OI-16 adds a goods-returned step: 03 lifecycle, 05 journey, UC-04 flow and criteria, MK-03 states, TASK-03, and the TC-DEC cases |
| SME-02 | 13 | OI-17 | If OI-17 adds an outbound flow or a finance report: a row in 08, 09, a task, and cases |
| SME-03 | 13 | OI-18 | If OI-18 splits the reasons: UC-01 reasons, a faulty-goods path, SCR-01 states, TASK-01, and cases; TC-REQ-01's example reason "Damaged" belongs to the faulty path |
| SME-04 | 01 Objective 2; 04 Out of Scope; 13 (OI-19) | OI-20 | Objective 2 covers portal requests only; if OI-20 adds a Store Associate, a persona, use case, matrix column, screens, a task, and cases |
| SME-05 | 06b UC-04 Business Rules & Constraints (new last rule); 13 (OI-21) | OI-22 | TASK-03 and a TC-DEC case: a manager cannot decide a request made from their own customer account; MK-03 refusal state; OI-22's outcome adds deadlines, reminders, deputies, and a limit |
| SME-06 | 03 lifecycle; 04 Project Scope; 05 Customer Journey; 06b UC-04 step 7; 06a UC-02 step 4; 02 Dependencies 1; 13 (OI-23) | More facts to confirm in 02 Dependencies 1 | TC-DEC-01 checks the payout reference and the "some days" wording in the Paid message; SCR-02 Paid state shows the payout reference; a case for UC-02 step 4 on a Paid request |
| SME-08 | 13 | OI-24 | If OI-24 adds policy rules: UC-01 business rules and criteria, SCR-01 states (excluded item, gift receipt, part of a line), TASK-01, and cases |
| PM-04 | 03; 04 In Scope; 05 Customer Journey; 06a UC-01 Preconditions; this chunk (sign-in and registration mockup row); 13 (OI-25) | - | A sign-in and registration screen with its mockup; TASK-01 delivers customer registration; 16 P2 creates customers by self-registration, including one with no mobile number; cases for registration with email verification and for SMS skipped when there is no mobile number |
| PM-05 | 01 How the objectives are measured; 04 In Scope (refund reports); 09 head-office refund report; 13 (OI-26) | OI-27 | A head-office report screen and mockup (with the role of OI-13); a task and cases for the head-office report; TC-NFR or BAT observation of Objective 1 over the pilot |
| PM-07 | 04 In Scope; 08 Loyalty Points row; 13 (OI-28) | - (launch order: Loyalty Points OI-17) | 15: TASK-03 (or a new task) reports each paid refund to Loyalty Points, and the plan notes that Loyalty Points TASK-01 acceptance waits for TASK-03; 16: a case that a paid refund reaches Loyalty Points |
| PM-10 | 04 In Scope (refund reports); 05; 06b (UC-04 UI/UX, new UC-06); 07; 09; 11 Screens; this chunk (SCR-04 mockup row, UC-06 flowchart row); 13 (OI-29) | - | SCR-04 mockup and play-through; 15: a task for UC-06 (or TASK-03 extended); 16: cases for UC-06 AC-1, AC-2, BR-1 (another branch refused) and the traceability row |
| PM-11 | 10 NFR-02, NFR-03; 13 (OI-30) | - | 16: P1 adds the notification partner test environment; P2 adds a second customer and uses the no-role account (refused everywhere); new cases for NFR-03 (seasonal load, as the SDD stress test runs it), NFR-04 and UC-02 BR-1 (a customer opening another customer request gets no access); TC-NFR-02 judged over a month in live use as well as the UAT period; Coverage gaps counts 4 NFRs, 4 alternate flows, 6 acceptance criteria (before the review changes) and every case added since; 15: NFR-02 and NFR-03 in the task criteria |
| PM-12 | 02 Dependencies 1 (settlement records); 06a UC-01 E2, UC-02 Business Rules and Future Enhancements; 11; 12 Wishlist; 13 (OI-11 applied, OI-31) | - (closes OI-11) | SCR-01 receipt-not-found state names the online shop; TC-REQ-04 checks it; 15 and 16 drop the mobile-app reading of UC-02 |
| PA-02 | 02 Dependencies 1 (whether an accepted payout can still fail or be reversed) | - (dependency confirmation 1, before TASK-03) | 15: TASK-03 waits for the answer; if an accepted payout can fail, a business decision on the customer, the Paid status, and the points taken back is needed first |
| PA-03 | 02 Assumptions / Constraints 1, Dependencies 2 (receipt number format and uniqueness) | - (dependency confirmation 2, before TASK-01) | 16: a case where the customer types the receipt number in another form (lower case, spaces) and the right receipt is found; if receipt numbers repeat across branches, UC-01 and SCR-01 gain the branch |
| PA-09 | 13 (OI-32) | OI-32 | None until OI-32 and Loyalty Points OI-18 are decided |
| DC-08 | 13 (OI-06 linked to Loyalty Points OI-19) | OI-06 (scope widened) | None until OI-06 and Loyalty Points OI-19 are decided |
| DC-12 | 06a, 06b (BR-n and AC-n labelled inline at their current positions) | - | None: every citation keeps its number; new rules and criteria are appended with the next label |

## Delivery gate

| # | Condition | State | What is still open |
|---|-----------|-------|--------------------|
| G1 | Step 1 complete | Not met | Open items in chunk 13: OI-03, OI-06 to OI-10, OI-13, OI-15 to OI-18, OI-20, OI-22, OI-24, OI-27, OI-32; dependency confirmations 1 to 3 in 02 |
| G2 | Step 2 complete | Not met | Consistency check rerun after the business review |
| G3 | Step 3 complete | Met | - |
| G4 | Step 4 complete | Not met | Mockup updates listed under Business review |
| G5 | Step 5 complete | Met | - |
| G6 | This version signed off by its approver (Approved By in the 1.1 row of the Changes Log; business review BO-06) | Not met | Version 1.1, the changes made by the business review of 2026-10-01, has no approver yet |

**Gate:** Shut | **Next action:** Resolve the open items in chunk 13, rerun the consistency check, update the mockups listed above, get the version signed off, then refresh chunks 15 and 16.

## Downstream outputs

| Output | File | State | Waiting for |
|--------|------|-------|-------------|
| Implementation plan | [15-implementation.md](./15-implementation.md) | Stale (business review, 2026-10-01: every point in the Business review table) | The gate, then a refresh covering the Business review table |
| UAT/BAT test cases | [16-uat-bat-test-cases.md](./16-uat-bat-test-cases.md) | Stale (business review, 2026-10-01: every point in the Business review table) | The gate, then a refresh covering the Business review table |
| Presentation and video brief | 17-for-ppt.md | Locked | Not requested yet |

---

## Step 4 - Generate mockups in Figma

| | |
|---|---|
| **Status** | In progress |
| **Evidence** | Play-through confirmed by the PM on 2026-09-24; Figma links recorded in each use case's UI/UX section. The business review of 2026-10-01 changed the states listed under Business review. |

### Mockup coverage

| Mockup | Screen / flow | Use cases | Requirements and decisions to honour | States to cover | Priority | Playable | Breakpoints delivered | Status | Play-through | Figma link |
|--------|---------------|-----------|--------------------------------------|-----------------|----------|----------|-----------------------|--------|--------------|-----------|
| SCR-01 | Refund request form | UC-01 | UC-01 BR-1, BR-2, E2 (online-shop message, business review PM-12); 11 / Amounts show the currency | Default, window passed, receipt not found | P1 | Y | Mobile, tablet, desktop | Update needed (receipt-not-found message) | Confirmed by PM, 2026-09-24, pass (before the update) | https://www.figma.com/proto/RFND01/refunds-portal?node-id=scr-01 |
| SCR-02 | My refund requests (list and request detail) | UC-02, UC-03 | UC-02 BR-1; UC-03 BR-1; UC-02 step 4 (payout delayed, business review BO-03; payout reference once Paid, business review SME-06) | Default, empty, cancelled, already decided, payout delayed, paid (payout reference) | P1 | Y | Mobile, tablet, desktop | Update needed (payout delayed and paid states) | Confirmed by PM, 2026-09-24, pass (before the update) | https://www.figma.com/proto/RFND01/refunds-portal?node-id=scr-02 |
| MK-03 | Branch manager decision screen (screen SCR-03) | UC-04 | UC-04 BR-1, BR-2, BR-3; BR-4 (own request refused, business review SME-05); E1 (payout delayed, business review BO-03) | Default, partial amount, reject with reason, payout delayed (E1), own request refused (BR-4) | P1 | Y | Desktop, tablet, mobile | Update needed (payout delayed and own-request refusal states) | Confirmed by PM, 2026-09-24, pass (before the update) | https://www.figma.com/proto/RFND01/refunds-portal?node-id=mk-03 |
| SCR-04 | Branch refund report | UC-06 | UC-06 BR-1 to BR-3; 11 / Amounts show the currency | Default (one day), no activity (A1) | P2 | N | - | Not started (business review PM-10) | - | - |
| - | Sign-in and registration (screen ID set in 11 at the refresh) | UC-01 precondition | 04 In Scope (customer accounts); 03 Customer account and messages (business review PM-04) | Sign in, register, email verification, no mobile number given | P1 | N | - | Not started (business review PM-04) | - | - |

---

## Step 5 - Update the use-case chunks with use-case diagrams and flowcharts

### Use-case flowcharts (chunks 06*)

| Use case | Chunk | Main Flow steps | Decision points | Flowchart | Status | Figure |
|----------|-------|-----------------|-----------------|-----------|--------|--------|
| UC-01 | [06a](./06a-use-cases-customer.md) | 6 | A1, E1, E2 | Skip - fixture | Skipped | - |
| UC-02 | [06a](./06a-use-cases-customer.md) | 4 | A1 | Skip - fixture | Skipped | - |
| UC-03 | [06a](./06a-use-cases-customer.md) | 5 | E1 | Skip - fixture | Skipped | - |
| UC-04 | [06b](./06b-use-cases-branch-manager.md) | 7 | A1, A2, E1 | Skip - fixture | Skipped | - |
| UC-06 | [06b](./06b-use-cases-branch-manager.md) | 3 | A1 | Skip - fixture | Skipped | - |

<!-- MASTER: refunds-portal-brd-master.md | PREV: 13-open-items-and-clarifications.md | NEXT: 15-implementation.md -->

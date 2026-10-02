<!--
CHUNK: 16
TITLE: UAT/BAT Test Cases
PROJECT: Loyalty Points
VERSION: 1.2 (baselined against BRD v1.2)
DATE: 2026-10-01
DEPENDS_ON: 05, 06a+ (every use-case chunk), 07, 08, 09, 10, 11, 14, 15
PART OF: BRD - Loyalty Points
TYPE: Delivery chunk
GATE: Locked until 14-todo.md is fully cleared (all five steps Complete with evidence, every to-do item Resolved, Deferred does not count, no override) and chunk 15 was written without raising a new open item. Never written or refreshed while the gate is shut.
MERGE: Included in the merged / combined BRD. Read by sdd-unifier as input context only.
PURPOSE: Business-level acceptance test cases (UAT/BAT) derived from the BRD use cases (UC-01..UC-02), NFRs (NFR-01..NFR-03), and the UI/UX expectations (chunk 11). Technical test cases (API contracts, data schemas, performance harnesses) are owned by the SDD test plan, not this file.
SCOPE NOTE: Every case runs in the default scope; no scope tags are used. The refund cases need the Refunds Portal test setup (P1). TC-PTS-07 needs the delivery team to stage refund reports above the purchase amount (P8). TC-BAL-04, TC-HIS-06, and TC-HIS-07 need the delivery team to stage failures (P5). TC-NFR-04 needs the delivery team to hold back a POS Records report (P6).
RULES: delivery-chunks.md in the brd-unifier skill. One combined UAT/BAT suite; "(BAT observation)" marks NFR acceptance cases judged over the UAT/BAT period rather than by one scripted check; the exit criteria are the BAT sign-off. Each case runs when the tasks and prerequisites in its Needs cell are ready, never per section; a task is Accepted when every case naming it in Related Task passes. Expected results come from the BRD; they are never invented.
-->

# Loyalty Points - UAT/BAT Test Cases

**Owner:** Product Team | **Prepared:** 2026-10-01 | **Baseline:** BRD v1.2 (all chunks) | **Design reference:** Figma - Loyalty Points UI/UX (2 screens: LP-01, LP-02; chunk 11)

**Suite status:** Stale (the business review of 2026-10-01 changed the BRD body and raised open items; see [14-todo.md](./14-todo.md) § Business review) | **Gate verified:** 2026-10-01 (see [14-todo.md](./14-todo.md)) | **Flowchart cross-check:** done on 2026-10-01 (Figure 2) | **New items raised while writing this suite:** 0

**Scope note:** Every case runs in the default scope; no scope tags are used. The refund cases need the Refunds Portal test setup (P1). TC-PTS-07 needs the delivery team to stage refund reports above the purchase amount (P8). TC-BAL-04, TC-HIS-06, and TC-HIS-07 need the delivery team to stage failures (P5). TC-NFR-04 needs the delivery team to hold back a POS Records report (P6).

## How to use this document

- **Testing Result** is filled during execution with one of: `Success`, `Failed`, `Blocked` (cannot execute due to environment/dependency), `Not Run`.
- **Testing Comment** records evidence on failure (what was observed vs expected, screen, day, data used) and any deviation accepted by the business.
- Every test case traces to a use case (UC-NN) or NFR, and to the task (TASK-NN) it counts toward: its **Related Task**, the task that delivers the screen or step it checks. The traceability matrix confirms the coverage, and anything not covered is listed under Coverage gaps.
- A test case passes only when its **Success Criteria** is fully met; partial behaviour is `Failed` with a comment.
- **Needs** lists what must be ready before the case can run: the tasks that must have reached `Ready for test` in [15-implementation.md](./15-implementation.md), then the prerequisites below that are not marked (all cases). Those marked (all cases) must be in place before the first case runs. Run each case as soon as its Needs are ready. Do not wait for the rest of its section or for a later wave: sections only group cases for the tester.
- A task is `Accepted` (complete) when every case that names it in Related Task passes (see Task acceptance). Record it in the task's Delivery status in chunk 15. `Ready for test` alone is not complete.
- A test case marked **(Provisional)** has an expected result that is not final yet; its Success Criteria names the to-do item it waits for. Do not sign off on it until that item is resolved and the case is refreshed.

## Test environment and data prerequisites

| # | Prerequisite |
|---|--------------|
| P1 | A UAT environment where purchases reported by POS Records and refunds reported as paid by the Refunds Portal reach Loyalty Points. Testers can create test purchases, raise test refunds, and have them reported as paid, in full or in part. Testers can see when POS Records reported each purchase and when the Refunds Portal reported each refund as paid. (all cases) |
| P2 | Test members, each with an existing loyalty program account: Member A, Member B, Member N, and new members R1 to R12 created as needed; plus a browser where no member is signed in. (all cases) |
| P3 | POS Records has reported Member A's purchases of 50.00 EUR (2026-09-01), 12.60 EUR (2026-09-10), and 58.00 EUR (2026-09-20), a balance of 120 points, and Member B's purchase of 30.00 EUR (30 points). None of them is refunded during testing. |
| P4 | Member N has no points movements. |
| P5 | The delivery team can make the points or the history fail to show, then restore them. |
| P6 | The delivery team can hold back POS Records' report of a test purchase until a set time. |
| P7 | A log of every balance complaint and every balance or movement error found during the UAT/BAT period, with how each was settled. |
| P8 | The delivery team can stage Refunds Portal reports for one purchase that add up to more than its amount. |

---

## 1. Member access (UC-01, UC-02, LP-01, LP-02)

| TC ID | TC Name | TC Description | TC Example | Success Criteria | Related UC | Related Task | Needs | Testing Result | Testing Comment |
|-------|---------|----------------|------------|------------------|-----------|--------------|-------|----------------|-----------------|
| TC-ACC-01 | Visitor sees no balance | Verify that the balance is shown only to a signed-in member | In a browser where no member is signed in, open the points balance | No balance is shown | UC-01 (Preconditions) | TASK-02, TASK-03 | TASK-02, TASK-03 | | |
| TC-ACC-02 | Member sees only their own balance | Verify that a member sees only their own points | Member B signs in and opens the points balance | Member B sees their own 30 points, never Member A's 120 | UC-01 (BR-1), 07 (footnote 1) | TASK-02, TASK-03 | TASK-02, TASK-03; P3 | | |
| TC-ACC-03 | Visitor sees no history | Verify that the history is shown only to a signed-in member | In a browser where no member is signed in, open the points history | No movement is shown | UC-02 (Preconditions) | TASK-02, TASK-04 | TASK-02, TASK-04 | | |
| TC-ACC-04 | Member sees only their own history | Verify that a member sees only their own movements | Member B signs in and opens the points history | Only Member B's 30-point movement is listed; none of Member A's three movements appears | UC-02 (BR-2), 07 (footnote 1) | TASK-02, TASK-04 | TASK-02, TASK-04; P3 | | |

## 2. Points balance (UC-01, LP-01)

| TC ID | TC Name | TC Description | TC Example | Success Criteria | Related UC | Related Task | Needs | Testing Result | Testing Comment |
|-------|---------|----------------|------------|------------------|-----------|--------------|-------|----------------|-----------------|
| TC-BAL-01 | Balance and last-movement date | Verify the member sees their balance and the date of their last movement | Member A signs in and opens their points | The balance shows 120 and the last-movement date shows 2026-09-20 | UC-01 (steps 1-2, AC-1), 03 (Movement date) | TASK-03 | TASK-03; P3 | | |
| TC-BAL-02 | No movements yet | Verify alternate flow A1 | Member N signs in and opens their points | The balance shows 0, no last-movement date is shown, and the screen explains how points are earned | UC-01 (A1, AC-2) | TASK-03 | TASK-03; P4 | | |
| TC-BAL-03 | Balance back to 0 is not A1 | Verify a member whose points were all taken back still sees a last-movement date | Member R1 buys for 20.00 EUR and POS Records reports it; the Refunds Portal then reports the full refund as paid; 1 hour later, Member R1 opens their points | The balance shows 0 and the last-movement date is the date the refund was paid; the A1 explanation is not shown | UC-01 (step 2, A1), 03 (Movement date) | TASK-03 | TASK-03 | | |
| TC-BAL-04 | Points cannot be shown | Verify exception flow E1 | With the points staged to fail, Member A opens their points | The member sees that their points cannot be shown right now and to try again later | UC-01 (E1, AC-3) | TASK-03 | TASK-03; P3, P5 | | |

## 3. Points history (UC-02, LP-02)

| TC ID | TC Name | TC Description | TC Example | Success Criteria | Related UC | Related Task | Needs | Testing Result | Testing Comment |
|-------|---------|----------------|------------|------------------|-----------|--------------|-------|----------------|-----------------|
| TC-HIS-01 | Movements newest first | Verify the history lists every movement, newest first, with date, reference, and points | Member A signs in and opens the points history | Three movements in this order: 2026-09-20 (58 points), 2026-09-10 (12 points), 2026-09-01 (50 points), each with its purchase reference | UC-02 (steps 1-2, AC-2) | TASK-04 | TASK-04; P3 | | |
| TC-HIS-02 | Open a movement of points earned | Verify steps 3-4 for points earned | Member A opens the 2026-09-10 movement | The purchase reference, the date 2026-09-10, 12.60 EUR, and 12 points are shown | UC-02 (steps 3-4, AC-3), 03 (Earning) | TASK-04 | TASK-04; P3 | | |
| TC-HIS-03 | Points taken back after a full refund | Verify alternate flow A1 | Member R2 buys for 50.00 EUR (50 points) and POS Records reports it; the Refunds Portal then reports the full refund as paid; 1 hour later, Member R2 opens the history | A movement of -50 points with the refund reference is listed | UC-02 (A1, AC-1, BR-1) | TASK-01, TASK-04 | TASK-01, TASK-04 | | |
| TC-HIS-04 | Open a movement of points taken back | Verify that A1 continues at step 3 and step 4 shows the refund | Member R2's 50.00 EUR purchase is reported by POS Records, then fully refunded and reported paid; 1 hour later, Member R2 opens the -50 movement | The refund reference, the date the refund was paid, 50.00 EUR, and -50 points are shown | UC-02 (A1, steps 3-4, AC-4) | TASK-04 | TASK-04 | | |
| TC-HIS-05 | No movements yet | Verify alternate flow A2 | Member N signs in and opens the points history | The screen shows that there are no points movements yet and explains how points are earned | UC-02 (A2, AC-8) | TASK-04 | TASK-04; P4 | | |
| TC-HIS-06 | History cannot be shown | Verify exception flow E1 at step 2 | With the history staged to fail, Member A opens the points history | The member sees that their points history cannot be shown right now and to try again later | UC-02 (E1, AC-5) | TASK-04 | TASK-04; P3, P5 | | |
| TC-HIS-07 | Movement cannot be opened | Verify exception flow E1 at step 4 | Member A opens the history; with the history then staged to fail, Member A opens the 2026-09-20 movement | The same try-again message is shown instead of the purchase details | UC-02 (E1, AC-7) | TASK-04 | TASK-04; P3, P5 | | |

## 4. Points earned and taken back (UC-02, LP-02)

| TC ID | TC Name | TC Description | TC Example | Success Criteria | Related UC | Related Task | Needs | Testing Result | Testing Comment |
|-------|---------|----------------|------------|------------------|-----------|--------------|-------|----------------|-----------------|
| TC-PTS-01 | Whole euros earn points - boundary | Verify the earning rule below, at, and above 1 EUR | Member R3 buys for 0.99 EUR, 1.00 EUR, and 12.60 EUR; 1 hour after POS Records reports the last purchase, Member R3 opens the history | The 1.00 EUR purchase shows 1 point and the 12.60 EUR purchase shows 12 points; the 0.99 EUR purchase earns 0 points and shows no movement | UC-02 (step 2), 03 (Earning, No 0-point movements), 08 (POS Records) | TASK-01, TASK-04 | TASK-01, TASK-04 | | |
| TC-PTS-02 | No points taken back before payment | Verify that points are taken back only when the refund is reported as paid | Member R4 buys for 40.00 EUR (40 points); a refund is raised in the Refunds Portal but not paid; 1 hour after POS Records reports the purchase, Member R4 opens the history | Only the 40-point movement is listed; no points are taken back | UC-02 (BR-1), 08 (Refunds Portal) | TASK-01, TASK-04 | TASK-01, TASK-04 | | |
| TC-PTS-03 | Part refund takes back whole euros only - boundary | Verify UC-02 BR-3 above a whole-euro amount | Member R5 buys for 80.00 EUR (80 points) and POS Records reports it; the Refunds Portal then reports a refund of 30.50 EUR for part of it as paid; 1 hour later, Member R5 opens the history | A movement of -30 points with the refund reference is listed | UC-02 (BR-3, AC-6) | TASK-01, TASK-04 | TASK-01, TASK-04 | | |
| TC-PTS-04 | Whole purchase refunded in parts - boundary | Verify that refunds below 1 EUR take back nothing until the whole purchase is refunded | Member R6 buys for 2.70 EUR (2 points) and POS Records reports it; the Refunds Portal then reports three refunds of 0.90 EUR as paid, the last one completing the whole purchase; 1 hour after the last report, Member R6 opens the history | The first two refunds show no movement; the third shows -2 points; 2 points are taken back in total | UC-02 (BR-3), 03 (No 0-point movements) | TASK-01, TASK-04 | TASK-01, TASK-04 | | |
| TC-PTS-05 | Movement dates | Verify the date rule for points earned and points taken back | Member R7 buys for 25.00 EUR on day 1 and POS Records reports it that day; the full refund is paid and reported on day 3; 1 hour later, Member R7 opens the history | The 25-point movement shows the day 1 date and the -25 movement shows the day 3 date | UC-02 (step 2), 03 (Movement date) | TASK-01, TASK-04 | TASK-01, TASK-04 | | |
| TC-PTS-06 | Part refund of whole euros - boundary | Verify UC-02 BR-3 at a whole-euro amount | Member R11 buys for 80.00 EUR (80 points) and POS Records reports it; the Refunds Portal then reports a refund of 30.00 EUR for part of it as paid; 1 hour later, Member R11 opens the history | A movement of -30 points with the refund reference is listed | UC-02 (BR-3) | TASK-01, TASK-04 | TASK-01, TASK-04 | | |
| TC-PTS-07 | Never more than earned - boundary | Verify that points taken back never exceed the points the purchase earned | Member R12 buys for 10.00 EUR (10 points) and POS Records reports it; the Refunds Portal then reports two refunds of 6.00 EUR as paid, 12.00 EUR in total; 1 hour after the second report, Member R12 opens the history | The first refund shows -6 points and the second shows -4 points: 10 points taken back in total, never more than the 10 earned | UC-02 (BR-3) | TASK-01, TASK-04 | TASK-01, TASK-04; P8 | | |

## 5. Cross-Cutting UI/UX Standards (chunk 11)

| TC ID | TC Name | TC Description | TC Example | Success Criteria | Related UC | Related Task | Needs | Testing Result | Testing Comment |
|-------|---------|----------------|------------|------------------|-----------|--------------|-------|----------------|-----------------|
| TC-UIX-01 | Whole numbers - balance | Verify that points show as whole numbers on the balance screen | Member A opens their points | The balance shows 120, with no decimals | UC-01, 11 (whole numbers) | TASK-03 | TASK-03; P3 | | |
| TC-UIX-02 | Whole numbers and minus sign - history | Verify whole numbers, and a minus sign for points taken back, on the history screen | Member R2's 50.00 EUR purchase is reported by POS Records, then fully refunded and reported paid; 1 hour later, Member R2 opens the history | Points show as whole numbers, 50 and -50; the movement of points taken back carries a minus sign | UC-02, 11 (whole numbers, minus sign) | TASK-04 | TASK-04 | | |
| TC-UIX-03 | Phones and computers - balance | Verify that the balance screen works on a phone and on a computer | Member A opens their points on a phone, then on a computer | On both, Member A sees the balance and the last-movement date (UC-01 steps 1-2) | UC-01, 11 (phones and computers) | TASK-03 | TASK-03; P3 | | |
| TC-UIX-04 | Phones and computers - history | Verify that the history screen works on a phone and on a computer | Member A opens the history and one movement on a phone, then on a computer | On both, Member A completes UC-02 steps 1-4 | UC-02, 11 (phones and computers) | TASK-04 | TASK-04; P3 | | |

## 6. NFR Acceptance (NFR-01..NFR-03)

| TC ID | TC Name | TC Description | TC Example | Success Criteria | Related UC | Related Task | Needs | Testing Result | Testing Comment |
|-------|---------|----------------|------------|------------------|-----------|--------------|-------|----------------|-----------------|
| TC-NFR-01 | Balance equals the sum of movements | Verify the business expectation of NFR-01 for one member | Member A opens their points, then the history | The balance, 120, equals the sum of the listed movements: 58 + 12 + 50 | NFR-01, UC-01 (step 2), UC-02 (step 2), 03 (the balance is the sum of the movements) | TASK-01, TASK-03, TASK-04 | TASK-01, TASK-03, TASK-04; P3 | | |
| TC-NFR-02 | No upheld balance complaint | Verify NFR-01 over the UAT/BAT period | Log every balance complaint and every balance or movement error found during UAT/BAT, with how each was settled (BAT observation) | Zero complaints upheld: no balance or movement differs from the member's purchases and refunds under 03 and UC-02, apart from the differences NFR-01 allows | NFR-01 | TASK-01, TASK-03, TASK-04 | TASK-01, TASK-03, TASK-04; P7 | | |
| TC-NFR-03 | Points taken back within 1 hour - boundary | Verify NFR-02 for a purchase that is already reported | Member R8 buys for 30.00 EUR, reported by POS Records the same day; the next day the Refunds Portal reports the full refund as paid at 14:00; Member R8 opens the history at 15:00 | The -30 movement is listed at 15:00, 1 hour after the Refunds Portal's report | NFR-02, UC-02 (BR-1), 08 (Refunds Portal) | TASK-01, TASK-04 | TASK-01, TASK-04 | | |
| TC-NFR-04 | Refund reported before its purchase | Verify that NFR-02 counts from the later report, and UC-02 BR-4 | Member R9 buys for 30.00 EUR at 10:00; POS Records' report is held back until 16:00; the Refunds Portal reports the full refund as paid at 11:00 | No movement shows before 16:00; by 17:00 the history lists the 30-point movement and the -30 movement | NFR-02, NFR-03, UC-02 (BR-4), 08 (POS Records, Refunds Portal) | TASK-01, TASK-04 | TASK-01, TASK-04; P6 | | |
| TC-NFR-05 | Points earned within 1 hour - boundary | Verify NFR-03 | Member R10 buys for 30.00 EUR; POS Records reports it at 10:00; Member R10 opens the history at 11:00 | The 30-point movement is listed at 11:00, 1 hour after POS Records' report | NFR-03, UC-02 (step 2), 08 (POS Records) | TASK-01, TASK-04 | TASK-01, TASK-04 | | |

---

## Traceability Matrix

| BRD Reference | Covered By |
|---------------|-----------|
| UC-01 View Points Balance | TC-ACC-01..02, TC-BAL-01..04, TC-UIX-01, TC-UIX-03, TC-NFR-01 |
| UC-02 View Points History | TC-ACC-03..04, TC-HIS-01..07, TC-PTS-01..07, TC-UIX-02, TC-UIX-04, TC-NFR-01, TC-NFR-03..05 |
| 03 Points movement (Earning, No 0-point movements, Movement date, balance as the sum) | TC-BAL-01, TC-BAL-03, TC-HIS-02, TC-PTS-01, TC-PTS-04..05, TC-NFR-01 |
| 07 Users & Use Cases Matrix (footnote 1) | TC-ACC-02, TC-ACC-04 |
| 08 POS Records | TC-PTS-01, TC-NFR-04..05 |
| 08 Refunds Portal | TC-PTS-02, TC-NFR-03..04 |
| 11 UI/UX Expectations | TC-UIX-01..04 |
| NFR-01 The points balance is always right | TC-NFR-01..02 |
| NFR-02 Points taken back after a refund show quickly | TC-NFR-03..04 |
| NFR-03 Points earned on a purchase show quickly | TC-NFR-04..05 |

## Task acceptance

| Task | Wave | Required cases |
|------|------|----------------|
| TASK-01 Record points earned and taken back | 1 | TC-HIS-03, TC-PTS-01..07, TC-NFR-01..05 |
| TASK-02 Let signed-in members see only their own points | 1 | TC-ACC-01..04 |
| TASK-03 Show the points balance (UC-01) | 2 | TC-ACC-01..02, TC-BAL-01..04, TC-UIX-01, TC-UIX-03, TC-NFR-01..02 |
| TASK-04 Show the points history (UC-02) | 2 | TC-ACC-03..04, TC-HIS-01..07, TC-PTS-01..07, TC-UIX-02, TC-UIX-04, TC-NFR-01..05 |

## Provisional and blocked scenarios

None. Every expected result is grounded in a confirmed requirement.

| TC ID | Why the expected result is not final | To-do item | What finalises it |
|-------|--------------------------------------|-----------|-------------------|
| - | - | - | - |

## Coverage gaps

**Checked:** 2 Main Flows, 3 alternate flows, 2 exception flows, 11 acceptance criteria, 6 numeric or time-based rules (03 Earning, No 0-point movements, Movement date; UC-02 BR-1, BR-3, BR-4), 3 NFRs, 6 flowchart branches (and 3 outcomes), 4 tasks. **Without a case:** 0.

| BRD Reference | Gap | Reason | To-do item / action |
|---------------|-----|--------|---------------------|
| - | None | Every flow, criterion, rule, NFR, flowchart branch and outcome, and task has at least one case | - |

## Execution summary (fill at the end of the cycle)

| Metric | Count |
|--------|-------|
| Total test cases | 31 |
| Success | |
| Failed | |
| Blocked | |
| Not Run | |

**Exit criteria (BAT sign-off):** all Critical-path cases pass (Recommendation: all six sections, because every section holds cases of UC-01 or UC-02, which carry a Business Objective and sit on the Summarized Workflow of chunk 05, and section 6 holds the only UC-02 BR-4 case; the product manager confirms the list); no open Failed case without a business-accepted deviation; no `(Provisional)` case left unresolved; the BAT observation TC-NFR-02 shows zero upheld balance complaints over the UAT/BAT period.

<!-- MASTER: loyalty-points-brd-master.md | PREV: 15-implementation.md | NEXT: 17-for-ppt.md -->

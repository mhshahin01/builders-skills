<!--
CHUNK: 16
TITLE: UAT/BAT Test Cases
PROJECT: Loyalty Points
VERSION: 1.7 (baselined against BRD v1.7)
DATE: 2026-10-06
DEPENDS_ON: 02, 05, 06a+ (every use-case chunk), 07, 08, 09, 10, 11, 14, 15
PART OF: BRD - Loyalty Points
TYPE: Delivery chunk
GATE: Locked until 14-todo.md is fully cleared (all five steps Complete with evidence, every to-do item Resolved, Deferred does not count, no override) and chunk 15 was written without raising a new open item. Never written or refreshed while the gate is shut. A Stale mark and execution tracking are allowed (delivery-chunks.md § The delivery gate, Re-lock, and § Refresh triggers).
MERGE: Included in the merged / combined BRD. Read by sdd-unifier as input context only.
PURPOSE: Business-level acceptance test cases (UAT/BAT) derived from the BRD use cases (UC-01..UC-03), NFRs (NFR-01..NFR-07), and the UI/UX expectations (chunk 11). Technical test cases (API contracts, data schemas, performance harnesses) are owned by the SDD test plan, not this file.
SCOPE NOTE: Every case runs in this release; no scope tag is used. Cases that use prerequisite P4 need the delivery team, with the Store Operations team (POS Records), the Finance team (Refunds Portal), and the Customer Accounts team (membership dates). Cases that use P5 are judged over the UAT/BAT period.
RULES: delivery-chunks.md in the brd-unifier skill. One combined UAT/BAT suite; "(BAT observation)" marks NFR acceptance cases judged over the UAT/BAT period rather than by one scripted check; the exit criteria are the BAT sign-off. Each case runs when the tasks and prerequisites in its Needs cell are ready, never per section; a task is Accepted when every case naming it in Related Task passes. Expected results come from the BRD; they are never invented.
-->

# Loyalty Points - UAT/BAT Test Cases

**Owner:** Product Team | **Prepared:** 2026-10-06 | **Baseline:** BRD v1.7 (all chunks) | **Design reference:** Figma - Loyalty Points UI/UX (4 screens: MK-01 to MK-04, chunk 11)

**Suite status:** Up to date | **Gate verified:** 2026-10-06 (see [14-todo.md](./14-todo.md)) | **Flowchart cross-check:** done on 2026-10-06 | **New items raised while writing this suite:** 0

**Scope note:** Every case runs in this release; no scope tag is used. Cases that use P4 need the delivery team, with the Store Operations team (POS Records), the Finance team (Refunds Portal), and the Customer Accounts team (membership dates): TC-BAL-02, TC-BAL-04, TC-HIS-03 to TC-HIS-12, TC-HIS-16, TC-HIS-18 to TC-HIS-21, TC-HIS-23, TC-HIS-28, TC-COR-12, TC-COR-13, TC-COR-15 to TC-COR-18, TC-NFR-01 to TC-NFR-03, TC-NFR-07. Cases that use P5 are judged over the UAT/BAT period: TC-LOG-01, TC-LOG-02.

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
| P1 | A UAT environment linked to test versions of POS Records, the Refunds Portal, Member sign-in and membership, Staff sign-in, and the go-live balance handover. The go-live date of the test is 01/09/2026. The cases run in October 2026, and the delivery team can set the date and time of the environment (all cases) |
| P2 | Test accounts: Member A with 120 points, whose newest movement is dated 02/10/2026; Members B and M with 1,000 points each from earlier purchases; Member C with no movements; a signed-in customer who is not a member; a Loyalty Administrator; and a staff member without the Loyalty Administrator role (all cases) |
| P3 | Test members with set histories: Member D, who held 200 points at the start of the go-live date and has no other movement; Member J, who also held 200 points then; Member Z, who held 0 points then; Member G, with 21 movements on 3 dates, refunds included; Member E, who left on 01/10/2026; Member F, who bought for 40 EUR on 20/09/2026, left on 25/09/2026, rejoined on 03/10/2026, and bought for 20 EUR that day; Member R, who left on 25/09/2026 and rejoined on 03/10/2026, with no purchase since; Member H, who on 05/10/2026 earned 30 points, left, rejoined, and bought for 50 EUR; Member K with 100 points; Members L, N, and Q with 30 points each; Members S and T with no movements; 10 members with a planned mix of movements; 3 members with movements who have never opened the product |
| P4 | The ability to stage, with the delivery team and the partner owners: purchases and refunds from POS Records and the Refunds Portal (paid, rejected, cancelled, partial, repeated, reported late, dated before go-live); a rejoin reported a day late; a screen that cannot be shown; the passing of time for the retention period |
| P5 | A UAT/BAT period of at least one full calendar month, with an availability log and the Monthly corrections report kept for it |

---

## 1. Access and sign-in (UC-01, UC-02, UC-03, MK-01, MK-02, MK-03, MK-04, NFR-07)

| TC ID | TC Name | TC Description | TC Example | Success Criteria | Related UC | Related Task | Needs | Testing Result | Testing Comment |
|-------|---------|----------------|------------|------------------|-----------|--------------|-------|----------------|-----------------|
| TC-ACC-01 | Own balance only | Verify that a signed-in member sees only their own points balance | Member A (120 points) signs in and opens their points while Member B holds a different balance | Member A sees 120; no figure of Member B is ever shown | UC-01 (BR-1), NFR-07 | TASK-02, TASK-07 | TASK-02, TASK-07 | | |
| TC-ACC-02 | Another member's history refused | Verify that a member cannot open another member's points history | Member A signs in and opens a link to Member B's history | The attempt fails; Member A sees none of Member B's movements | UC-02 (BR-2), NFR-07 | TASK-08 | TASK-08 | | |
| TC-ACC-03 | Member cannot correct points | Verify that a member cannot open the correction screen | Member A signs in and opens the address of the correction screen | The attempt fails; no member's points are shown | UC-03 (07 matrix), NFR-07 | TASK-09 | TASK-09 | | |
| TC-ACC-04 | Staff without the role refused | Verify that a staff member without the Loyalty Administrator role cannot correct points | The staff member without the role signs in and opens the correction screen | The attempt fails; no member's points are shown | UC-03 (07 matrix), NFR-07 | TASK-09 | TASK-09 | | |
| TC-ACC-05 | Report closed to others | Verify that only the Loyalty Administrator can open the Monthly corrections report | Member A, then the staff member without the role, open the October report | Both attempts fail; the Loyalty Administrator opens it | NFR-07 | TASK-10 | TASK-10 | | |

## 2. Points balance (UC-01, MK-01 / LP-01, NFR-03)

| TC ID | TC Name | TC Description | TC Example | Success Criteria | Related UC | Related Task | Needs | Testing Result | Testing Comment |
|-------|---------|----------------|------------|------------------|-----------|--------------|-------|----------------|-----------------|
| TC-BAL-01 | Balance and newest date | Verify that the member sees the current balance and the date of the newest movement | Member A, whose newest movement is dated 02/10/2026, opens their points | The screen shows 120 and 02/10/2026 | UC-01 (AC-1) | TASK-07 | TASK-07 | | |
| TC-BAL-02 | Points for a purchase | Verify that a purchase earns 1 point per 1 EUR paid after discounts, rounded down | Member B buys an item priced 15.00 EUR with a 2.20 EUR discount and pays 12.80 EUR | By the end of the day the balance is 12 points higher | UC-01 (step 2) | TASK-01, TASK-07 | TASK-01, TASK-07; P4 | | |
| TC-BAL-03 | No points yet | Verify that a member with no movements sees a balance of 0 and how points are earned | Member C opens their points | The screen shows 0 and explains how points are earned | UC-01 (A1, AC-2) | TASK-07 | TASK-07 | | |
| TC-BAL-04 | Balance cannot be shown | Verify that the member is told to try again later when the balance cannot be shown | The delivery team makes the balance unavailable; Member A opens their points | A message to try again later; no figure, not 0 and not an old one | UC-01 (E1, AC-3) | TASK-07 | TASK-07; P4 | | |
| TC-BAL-05 | Not a member | Verify that a signed-in customer who is not a member is told they have no loyalty points account | The customer who is not a member signs in and opens their points | The message says there is no loyalty points account; no balance | UC-01 (E2, AC-4) | TASK-02, TASK-07 | TASK-02, TASK-07 | | |
| TC-BAL-06 | When new points show | Verify that the balance screen says when points for a new purchase show | Member A opens their points | The screen says the points show by the end of the purchase day | UC-01 (BR-2, AC-5), NFR-03 | TASK-07 | TASK-07 | | |
| TC-BAL-07 | Opening balance in the balance | Verify that the points held at the start of the go-live date show as the balance | Member D opens their points | The screen shows 200 and 01/09/2026, the go-live date | UC-01 (AC-1) | TASK-04, TASK-07 | TASK-04, TASK-07; P3 | | |
| TC-BAL-08 | Former member | Verify that a member who left sees no balance | Member E signs in and opens their points | The message says there is no loyalty points account; no balance | UC-01 (E2, AC-4) | TASK-05, TASK-07 | TASK-05, TASK-07; P3 | | |
| TC-BAL-09 | Rejoined member starts at 0 | Verify that a member who rejoins starts with no points | Member R, who rejoined on 03/10/2026 and has bought nothing since, opens their points | The screen shows 0 and explains how points are earned | UC-01 (A1) | TASK-05, TASK-07 | TASK-05, TASK-07; P3 | | |
| TC-BAL-10 | Same-day leave and rejoin | Verify that a member who left and rejoined on the same day has no account until the next day | Member H opens their points on the evening of 05/10/2026 | The message says there is no loyalty points account; no balance | UC-01 (AC-6) | TASK-05, TASK-07 | TASK-05, TASK-07; P3 | | |

## 3. Points history (UC-02, MK-02 / LP-02, NFR-02)

| TC ID | TC Name | TC Description | TC Example | Success Criteria | Related UC | Related Task | Needs | Testing Result | Testing Comment |
|-------|---------|----------------|------------|------------------|-----------|--------------|-------|----------------|-----------------|
| TC-HIS-01 | History list | Verify that the history lists the movements newest first with date, reference, and points | Member G opens the history | Newest first; each purchase or refund movement shows its purchase or refund day, its reference, and its points | UC-02 (step 2, AC-4) | TASK-08 | TASK-08; P3 | | |
| TC-HIS-02 | Movement details | Verify the details of a purchase movement and of a refund movement | Member G opens a purchase movement, then a refund movement | Purchase: date, branch, amount paid, points earned. Refund: date, refunded purchase, amount refunded, points taken back | UC-02 (step 4, AC-5) | TASK-08 | TASK-08; P3 | | |
| TC-HIS-03 | Refund takes back points | Verify that a paid refund takes back the points the purchase earned | A purchase of Member B that earned 50 points is refunded in full and the refund is paid | A movement of -50 points with the refund reference | UC-02 (A1, BR-1, AC-1) | TASK-06, TASK-08 | TASK-06, TASK-08; P4 | | |
| TC-HIS-04 | Partial refunds | Verify that each partial refund takes back only its share | A 100 EUR purchase of Member B earned 100 points; 30 EUR is refunded, then the other 70 EUR | A movement of -30, then a movement of -70, each with its own refund reference | UC-02 (BR-3, AC-2, AC-3) | TASK-06, TASK-08 | TASK-06, TASK-08; P4 | | |
| TC-HIS-05 | Partial refunds with cents | Verify partial refunds that leave cents | A 12.80 EUR purchase of Member B earned 12 points; 0.80 EUR is refunded, then another 0.80 EUR | First refund: balance unchanged, no movement. Second refund: a movement of -1 point | UC-02 (BR-3, AC-28, AC-29) | TASK-06, TASK-08 | TASK-06, TASK-08; P4 | | |
| TC-HIS-06 | Rejected or cancelled refund | Verify that a rejected or cancelled refund takes back nothing | For a purchase of Member B that earned 50 points, the Refunds Portal reports one refund as rejected and one as cancelled | The balance does not change; no movement is added | UC-02 (BR-1, AC-15) | TASK-06, TASK-08 | TASK-06, TASK-08; P4 | | |
| TC-HIS-07 | Refund of a purchase that earned nothing | Verify that a refund of a purchase that earned no points takes back nothing | A 0.80 EUR purchase of Member B is refunded and the refund is paid | The balance does not change; no movement is added | UC-02 (BR-4, AC-16) | TASK-06, TASK-08 | TASK-06, TASK-08; P4 | | |
| TC-HIS-08 | Refund paid before its purchase shows | Verify that the take-back waits until the purchase shows | A refund of a 50-point purchase of Member B is paid at 10:00; POS Records reports the purchase at 21:30 | No take-back shows before 21:30; then a movement of -50 with the refund reference and the refund date, by 22:30 | UC-02 (BR-5, AC-17), NFR-02 | TASK-06, TASK-08 | TASK-06, TASK-08; P4 | | |
| TC-HIS-09 | Take-back capped at the balance | Verify that a take-back never takes the balance below 0 | Member S makes a purchase that earns 50 points; a correction removes 30, leaving 20; the purchase is refunded in full and the refund is paid | A movement of -20; the balance is 0 | UC-02 (BR-6, AC-18) | TASK-06, TASK-08 | TASK-06, TASK-08, TASK-09; P3, P4 | | |
| TC-HIS-10 | Later refund after a capped take-back | Verify that a later refund takes back what the cap left | Member T makes a 100 EUR purchase (100 points); a correction removes 80; a 30 EUR refund takes back the 20 left; Member T reaches 200 points and the other 70 EUR is refunded | A movement of -80 | UC-02 (BR-3, BR-6, AC-30) | TASK-06, TASK-08 | TASK-06, TASK-08, TASK-09; P3, P4 | | |
| TC-HIS-11 | Refund of a purchase made before the rejoin day | Verify that a refund of a purchase made before the day the member rejoined takes back nothing | The 40 EUR purchase Member F made on 20/09/2026 is refunded and the refund is paid | The balance does not change; no movement is added | UC-02 (BR-7, AC-13) | TASK-06, TASK-08 | TASK-06, TASK-08, TASK-05; P3, P4 | | |
| TC-HIS-12 | Refund of a purchase made before go-live | Verify that a refund of a purchase made before the go-live date takes back nothing | A purchase Member D made on 20/08/2026, before the go-live date, is refunded and the refund is paid | The balance does not change; no movement is added | UC-02 (BR-8, AC-14) | TASK-06, TASK-08 | TASK-06, TASK-08, TASK-04; P3, P4 | | |
| TC-HIS-13 | No movements yet | Verify the history of a member with no movements | Member C opens the history | The screen shows that there are no movements yet and how points are earned | UC-02 (A2, AC-6) | TASK-08 | TASK-08 | | |
| TC-HIS-14 | Correction in the history | Verify how a correction shows in the list and when opened | A 40-point correction with the reason Missing purchase names purchase P-1001 for Member B; Member B opens the history and the movement | List and detail show the label Correction, the day it was made, 40 points, the reason, and P-1001 | UC-02 (A3, AC-9, AC-20) | TASK-08 | TASK-08, TASK-09 | | |
| TC-HIS-15 | Opening balance in the history | Verify how the opening balance shows in the list and when opened | Member D opens the history and the first movement | The label Opening balance, 01/09/2026, and 200 points; the detail says the points were carried over at go-live | UC-02 (A5, AC-10, AC-21) | TASK-08 | TASK-08, TASK-04; P3 | | |
| TC-HIS-16 | Purchase on the go-live date | Verify that a purchase made on the go-live date earns separately | Member J buys for 50 EUR on 01/09/2026, the go-live date | The Opening balance of 200 and a separate movement of 50 points | UC-02 (AC-19) | TASK-04, TASK-08 | TASK-04, TASK-08; P3, P4 | | |
| TC-HIS-17 | Opening balance of 0 | Verify that a member who held 0 points at go-live gets no Opening balance movement | Member Z opens the history | The screen shows that there are no movements yet and how points are earned | UC-02 (AC-25) | TASK-04, TASK-08 | TASK-04, TASK-08; P3 | | |
| TC-HIS-18 | Earning rule at its limit | Verify the rounding below, at, and above 1 EUR, and that a purchase under 1 EUR adds no movement | Member B makes purchases of 0.80 EUR, 1.00 EUR, and 1.99 EUR | Movements of +1 and +1 only; no movement for the 0.80 EUR purchase; the balance is 2 higher | UC-02 (AC-24) | TASK-01, TASK-08 | TASK-01, TASK-08; P4 | | |
| TC-HIS-19 | Purchase from before go-live reported late | Verify that a purchase made before go-live and reported after it earns nothing | POS Records reports, after go-live, a 30 EUR purchase Member D made on 25/08/2026 | The balance stays 200; no movement is added | UC-02 (AC-26) | TASK-01, TASK-08 | TASK-01, TASK-08, TASK-04; P3, P4 | | |
| TC-HIS-20 | Purchase reported twice | Verify that a purchase earns once however often it is reported | POS Records reports purchase P-2001 (30 EUR) twice for Member B | One movement of +30; the balance rises by 30 once | UC-02 (step 2), NFR-01 | TASK-01, TASK-08 | TASK-01, TASK-08; P4 | | |
| TC-HIS-21 | Refund reported twice | Verify that a refund takes back once however often it is reported | After TC-HIS-20, the Refunds Portal reports paid refund R-3001, which refunds all 30 EUR of P-2001, twice | One movement of -30 | UC-02 (BR-1), NFR-01 | TASK-06, TASK-08 | TASK-06, TASK-08; P4 | | |
| TC-HIS-22 | Report a problem | Verify that the member is told where to report a wrong movement or a missing purchase | Member A opens the history, then one movement; Member C, who has no movements, opens the history | Each of the three screens tells the member to report the problem at any branch | UC-02 (A4, AC-8) | TASK-08 | TASK-08 | | |
| TC-HIS-23 | History cannot be shown | Verify that the member is told to try again later when the history cannot be shown | The delivery team makes the history unavailable; Member A opens it | A message to try again later; no part of the history is shown as complete | UC-02 (E1, AC-7) | TASK-08 | TASK-08; P4 | | |
| TC-HIS-24 | Not a member | Verify that a signed-in customer who is not a member sees no history | The customer who is not a member opens the history | The message says there is no loyalty points account; no history | UC-02 (E2, AC-11) | TASK-08 | TASK-08 | | |
| TC-HIS-25 | History after a rejoin | Verify that a rejoined member sees only the movements from the rejoin day | Member F opens the history | Only movements dated 03/10/2026 or later; the purchase of 20/09/2026 is not shown | UC-02 (step 2, AC-12) | TASK-08 | TASK-08, TASK-05; P3 | | |
| TC-HIS-26 | Same-day rejoin, later that day | Verify that a member who left and rejoined on the same day has no history until the next day | Member H opens the history on the evening of 05/10/2026 | The message says there is no loyalty points account; no history | UC-02 (AC-23) | TASK-05, TASK-08 | TASK-05, TASK-08; P3 | | |
| TC-HIS-27 | Same-day rejoin, next day | Verify that purchases made on the day of a same-day leave and rejoin earn nothing | Member H bought for 50 EUR after rejoining on 05/10/2026 and opens the history on 06/10/2026 | The screen shows that there are no movements yet and how points are earned | UC-02 (AC-22) | TASK-05, TASK-08 | TASK-05, TASK-08; P3 | | |
| TC-HIS-28 | Rejoin reported late | Verify that a purchase on the rejoin day earns when the rejoin is reported a day late | A member who left in September rejoins on 04/10/2026, buys for 50 EUR that day, and the product learns of the rejoin on 05/10/2026 | A movement of +50 dated 04/10/2026, by the end of 05/10/2026 | UC-02 (AC-27), NFR-03 | TASK-05, TASK-08 | TASK-05, TASK-08; P4 | | |
| TC-HIS-29 | 20 movements per page | Verify the page size of the history | Member G opens the history | The first page shows the 20 newest movements; the second page shows the 21st; there is no export and no filter | UC-02 (step 2) | TASK-08 | TASK-08; P3 | | |

## 4. Correct a member's points (UC-03, MK-03)

| TC ID | TC Name | TC Description | TC Example | Success Criteria | Related UC | Related Task | Needs | Testing Result | Testing Comment |
|-------|---------|----------------|------------|------------------|-----------|--------------|-------|----------------|-----------------|
| TC-COR-01 | Correct a missing purchase | Verify that a missing purchase is entered by its amount paid and earns points | Member B's 40.00 EUR purchase P-1001 of 01/10/2026 at Branch 3 earned no points; the Loyalty Administrator enters it with the reason Missing purchase | The correction is recorded; the balance is 40 higher; the history shows +40 with the reason | UC-03 (step 4, BR-4, AC-1) | TASK-09 | TASK-09 | | |
| TC-COR-02 | Remove points | Verify that a plain removal is recorded with who made it and when | Member K has 100 points; the Loyalty Administrator removes 30 with the reason Points added twice | The new balance is 70; the record shows who made it and when; the history shows -30 with the reason | UC-03 (BR-1, BR-3, AC-7) | TASK-09 | TASK-09; P3 | | |
| TC-COR-03 | Add points | Verify that points can be added with a reason | The Loyalty Administrator adds 25 points to Member B with the reason Points taken back twice | The new balance is 25 higher; the history shows +25 with the reason | UC-03 (step 3, step 4) | TASK-09 | TASK-09 | | |
| TC-COR-04 | No member matches | Verify the search result when no member matches | The Loyalty Administrator searches for member number 99999999 | The screen says no member matches; a new search can be made | UC-03 (E1, AC-2) | TASK-09 | TASK-09 | | |
| TC-COR-05 | Former member not found | Verify that a former member is not found | The Loyalty Administrator searches for Member E's member number | The screen says no member matches | UC-03 (E1, AC-8) | TASK-09 | TASK-09, TASK-05; P3 | | |
| TC-COR-06 | Same-day rejoin not found | Verify that a member who left and rejoined on the same day is not found that day | The Loyalty Administrator searches for Member H on the evening of 05/10/2026 | The screen says no member matches | UC-03 (E1, AC-14) | TASK-09 | TASK-09, TASK-05; P3 | | |
| TC-COR-07 | No reason given | Verify that a correction without a reason is refused | The Loyalty Administrator saves a correction of +10 points with no reason | The correction is refused; a reason is asked for; the balance does not change | UC-03 (E2, BR-1, AC-3) | TASK-09 | TASK-09 | | |
| TC-COR-08 | Removal limit | Verify the removal limit below, at, and above the balance | Members L, N, and Q have 30 points each; the Loyalty Administrator removes 29 from L, 30 from N, and 31 from Q | L: recorded, balance 1. N: recorded, balance 0. Q: refused; the screen says 30 is the most | UC-03 (E3, BR-2, AC-4) | TASK-09 | TASK-09; P3 | | |
| TC-COR-09 | Purchase already shows | Verify that a correction for a purchase that already shows is refused | The Loyalty Administrator enters a correction for Member B that names a purchase already shown in Member B's history | The correction is refused; the balance does not change | UC-03 (E4, AC-6) | TASK-09 | TASK-09 | | |
| TC-COR-10 | Purchase before the rejoin day | Verify the rejoin-day limit for a missing purchase | For Member F (rejoined 03/10/2026), missing purchases dated 02/10/2026 and 03/10/2026 are entered | 02/10/2026: refused, balance unchanged. 03/10/2026: recorded | UC-03 (E5, AC-11) | TASK-09 | TASK-09, TASK-05; P3 | | |
| TC-COR-11 | Purchase before go-live | Verify the go-live limit for a missing purchase | For Member B, missing purchases dated 31/08/2026, the day before the go-live date, and 01/09/2026, the go-live date, are entered | 31/08/2026: refused, balance unchanged. 01/09/2026: recorded | UC-03 (E6, AC-12) | TASK-09 | TASK-09 | | |
| TC-COR-12 | Later report for the same member | Verify that a later report of a corrected purchase earns nothing more | After TC-COR-01, POS Records reports P-1001 for Member B | The balance does not change; no new movement is added | UC-03 (BR-4, AC-5) | TASK-09 | TASK-09; P4 | | |
| TC-COR-13 | Reported for another member | Verify that another member earns as usual when POS Records reports the corrected purchase for them | A correction for Member B names P-1002 (40 EUR); POS Records later reports P-1002 for Member M | Member M earns 40 points | UC-03 (BR-5, AC-10) | TASK-09 | TASK-09; P4 | | |
| TC-COR-14 | History since the rejoin | Verify the history the Loyalty Administrator sees for a rejoined member | The Loyalty Administrator finds Member F | Only movements dated 03/10/2026 or later; the purchase of 20/09/2026 is not shown | UC-03 (step 2, AC-9) | TASK-09 | TASK-09, TASK-05; P3 | | |
| TC-COR-15 | Refund of a corrected purchase | Verify that a refund of a corrected missing purchase takes back points under the UC-02 rules | A 40-point correction for Member B names P-1003 (40 EUR), which POS Records never reports; 10 EUR is refunded and the refund is paid | A movement of -10 with the refund reference | UC-03 (BR-4, AC-13) | TASK-06, TASK-08 | TASK-06, TASK-08, TASK-09; P4 | | |
| TC-COR-16 | Refund uses the entered amount | Verify that the entered amount is kept when POS Records reports another amount for the same member | A 40-point correction for Member B names P-1004 (40 EUR); POS Records reports P-1004 for Member B at 50 EUR; 10 EUR is refunded and the refund is paid | A movement of -10 | UC-03 (BR-6, AC-15) | TASK-06, TASK-08 | TASK-06, TASK-08, TASK-09; P4 | | |
| TC-COR-17 | Refund when two members hold the purchase | Verify that a refund takes back points from both members | A correction for Member B names P-1005 (40 EUR); POS Records reports P-1005 for Member M (40 points); the whole 40 EUR is refunded | Member B and Member M each see a movement of -40 | UC-03 (BR-6, AC-16) | TASK-06, TASK-08 | TASK-06, TASK-08, TASK-09; P4 | | |
| TC-COR-18 | Different amounts for the two members | Verify that each member's take-back uses their own amount paid | A correction for Member B names P-1006 (40 EUR); POS Records reports P-1006 for Member M at 50 EUR (50 points); 10 EUR is refunded | Member B and Member M each see a movement of -10 | UC-03 (BR-6, AC-17) | TASK-06, TASK-08 | TASK-06, TASK-08, TASK-09; P4 | | |

## 5. Monthly corrections report (MK-04, NFR-01)

| TC ID | TC Name | TC Description | TC Example | Success Criteria | Related UC | Related Task | Needs | Testing Result | Testing Comment |
|-------|---------|----------------|------------|------------------|-----------|--------------|-------|----------------|-----------------|
| TC-REP-01 | Corrections listed | Verify that the report lists every correction of the month | After the section 4 cases, run in October, the Loyalty Administrator opens the October report | Every correction made in October, those of TC-COR-01 to TC-COR-03 among them, each with the member, the points added or removed, the reason, who made it, and when | UC-03 (BR-3), NFR-01 | TASK-10 | TASK-10 | | |
| TC-REP-02 | A month with no corrections | Verify how a month with no corrections reads | The Loyalty Administrator opens the report for September 2026, a month with no corrections | The report shows no corrections, which reads as no upheld complaints | NFR-01 | TASK-10 | TASK-10 | | |
| TC-REP-03 | Export | Verify the export to CSV and Excel | The Loyalty Administrator exports the October report to CSV and to Excel | Both files hold the same rows as the screen | NFR-01 | TASK-10 | TASK-10 | | |

## 6. Cross-Cutting UI/UX Standards (chunk 11)

| TC ID | TC Name | TC Description | TC Example | Success Criteria | Related UC | Related Task | Needs | Testing Result | Testing Comment |
|-------|---------|----------------|------------|------------------|-----------|--------------|-------|----------------|-----------------|
| TC-UIX-01 | Standards - balance screens | Verify the chunk 11 standards on the UC-01 screens | Open the balance on desktop, tablet, and mobile, also in the cannot-be-shown state | Primary color #1F6FEB; a plain-language error with no codes; usable at all three sizes; English; dates as DD/MM/YYYY | UC-01 | TASK-03, TASK-07 | TASK-03, TASK-07 | | |
| TC-UIX-02 | Standards - history screens | Verify the chunk 11 standards on the UC-02 screens | Open the history and a refund movement on desktop, tablet, and mobile | The UIX-01 standards; negative movements show a minus sign; amounts show in EUR with two decimals | UC-02 | TASK-08 | TASK-08 | | |
| TC-UIX-03 | Standards - correction screens | Verify the chunk 11 standards on the UC-03 screens | Open the correction screen on desktop and mobile, also with a refused correction | The UIX-01 standards hold, and the refusal message says how to fix it | UC-03 | TASK-09 | TASK-09 | | |
| TC-UIX-04 | Standards - report screen | Verify the chunk 11 standards on the Monthly corrections report | Open the October report on desktop and mobile | The UIX-01 standards hold; amounts and dates follow Language & Locale | NFR-01 | TASK-10 | TASK-10 | | |

## 7. NFR Acceptance (NFR-01..NFR-07)

| TC ID | TC Name | TC Description | TC Example | Success Criteria | Related UC | Related Task | Needs | Testing Result | Testing Comment |
|-------|---------|----------------|------------|------------------|-----------|--------------|-------|----------------|-----------------|
| TC-NFR-01 | Balances match their movements | Verify that every test balance matches its movements | The 10 members of P3 with a planned mix of movements: an opening balance, purchases, full and partial refunds, a rejoin, and corrections | Every balance equals what the chunk 03 rules give for its movements | NFR-01 | TASK-01, TASK-07 | TASK-01, TASK-07, TASK-04, TASK-05, TASK-06, TASK-09; P3, P4 | | |
| TC-NFR-02 | Take-back within 1 hour | Verify the time a take-back takes to show | A refund of a purchase of Member B that earned 20 points is paid at 14:00 | The movement of -20 shows by 15:00 | NFR-02 | TASK-06, TASK-08 | TASK-06, TASK-08; P4 | | |
| TC-NFR-03 | Points by the end of the purchase day | Verify the time earned points take to show | Member B buys for 30 EUR at 20:55, just before the 21:00 closing | The +30 movement and the new balance show by 23:59 that day | NFR-03 | TASK-01, TASK-07 | TASK-01, TASK-07; P4 | | |
| TC-NFR-04 | Opening within 2 seconds | Verify the time the balance and the first page of the history take to open | Member G opens the balance and the history 10 times each on desktop, tablet, and mobile | Every opening takes 2 seconds or less | NFR-05 | TASK-07, TASK-08 | TASK-07, TASK-08; P3 | | |
| TC-NFR-05 | First-time member unaided | Verify that a first-time member completes UC-01 and UC-02 without help | The 3 members of P3 who have never opened the product check their balance and open one movement | All three finish without help | NFR-06 | TASK-07, TASK-08 | TASK-07, TASK-08; P3 | | |
| TC-NFR-06 | Accessibility | Verify the UC-01 and UC-02 screens against WCAG 2.1 level AA | Use the balance and history with a keyboard only and with a screen reader | The screens meet WCAG 2.1 level AA | NFR-06 | TASK-03, TASK-07, TASK-08 | TASK-03, TASK-07, TASK-08 | | |
| TC-NFR-07 | Former-member history deleted | Verify that a former member's history is deleted 24 months after they leave, and that a deletion request does not shorten this | The delivery team stages one former member who left 24 months and 1 day ago, and one who left 23 months ago and asked for deletion | The first history no longer exists; the second still exists | NFR-07 | TASK-05 | TASK-05; P4 | | |
| TC-LOG-01 | No upheld complaints | Verify that no balance complaint is upheld in any month of the UAT/BAT period | Read the Monthly corrections report for each month of the period; corrections made by scripted test cases are not complaints (BAT observation) | No correction follows an upheld complaint in any month | NFR-01 | TASK-10 | TASK-10; P5 | | |
| TC-LOG-02 | Availability | Verify the minutes per month in which members cannot open their balance or history | Keep a log of every minute in which the balance or the history cannot be opened, maintenance included, across the period (BAT observation) | No more than 60 minutes in any month | NFR-04 | TASK-07, TASK-08 | TASK-07, TASK-08; P5 | | |

---

## Traceability Matrix

| BRD Reference | Covered By |
|---------------|-----------|
| UC-01 View Points Balance | TC-ACC-01, TC-BAL-01..10, TC-UIX-01 |
| UC-02 View Points History | TC-ACC-02, TC-HIS-01..29, TC-UIX-02 |
| UC-03 Correct a Member's Points | TC-ACC-03, TC-ACC-04, TC-COR-01..18, TC-REP-01, TC-UIX-03 |
| NFR-01 Accuracy | TC-NFR-01, TC-LOG-01, TC-HIS-20, TC-HIS-21, TC-REP-01..03, TC-UIX-04 |
| NFR-02 Timeliness of take-backs | TC-NFR-02, TC-HIS-08 |
| NFR-03 Timeliness of earned points | TC-NFR-03, TC-BAL-06, TC-HIS-28 |
| NFR-04 Availability | TC-LOG-02 |
| NFR-05 Performance | TC-NFR-04 |
| NFR-06 Usability | TC-NFR-05, TC-NFR-06 |
| NFR-07 Security & Privacy | TC-ACC-01..05, TC-NFR-07 |

## Task acceptance

| Task | Wave | Required cases |
|------|------|----------------|
| TASK-01 Earn points on branch purchases and keep each member's balance | 1 | TC-BAL-02, TC-HIS-18, TC-HIS-19, TC-HIS-20, TC-NFR-01, TC-NFR-03 |
| TASK-02 Know who is signed in, their membership, and what they may see | 1 | TC-ACC-01, TC-BAL-05 |
| TASK-03 Apply the global UI/UX standards | 1 | TC-UIX-01, TC-NFR-06 |
| TASK-04 Carry over each member's points at go-live | 2 | TC-BAL-07, TC-HIS-16, TC-HIS-17 |
| TASK-05 End points when a member leaves, restart them on a rejoin, and keep the history 24 months | 2 | TC-BAL-08, TC-BAL-09, TC-BAL-10, TC-HIS-26, TC-HIS-27, TC-HIS-28, TC-NFR-07 |
| TASK-06 Take back points when a refund is paid | 2 | TC-HIS-03..12, TC-HIS-21, TC-COR-15..18, TC-NFR-02 |
| TASK-07 Show the points balance (UC-01) | 2 | TC-ACC-01, TC-BAL-01..10, TC-UIX-01, TC-NFR-01, TC-NFR-03..06, TC-LOG-02 |
| TASK-08 Show the points history (UC-02) | 2 | TC-ACC-02, TC-HIS-01..29, TC-COR-15..18, TC-UIX-02, TC-NFR-02, TC-NFR-04..06, TC-LOG-02 |
| TASK-09 Correct a member's points (UC-03) | 2 | TC-ACC-03, TC-ACC-04, TC-COR-01..14, TC-UIX-03 |
| TASK-10 Give the Loyalty Administrator the Monthly corrections report | 3 | TC-ACC-05, TC-REP-01..03, TC-UIX-04, TC-LOG-01 |

## Provisional and blocked scenarios

None. Every expected result is grounded in a confirmed requirement.

## Coverage gaps

**Checked:** 3 Main Flows, 6 alternate flows, 10 exception flows, 53 acceptance criteria, 10 numeric or time-based rules (the earning rule and its rounding, partial refunds, the balance never below 0, the removal limit, the go-live date, the rejoin day, a rejoin on the day of leaving, a take-back that waits for its purchase, 20 movements per page, 24 months of retention), 7 NFRs, 21 flowchart branches (Figures 3 and 4, plus their 6 outcomes), 10 tasks. **Without a case:** 0.

None. Every use case, flow, rule, acceptance criterion, NFR, flowchart branch, and task has at least one case.

## Execution summary (fill at the end of the cycle)

| Metric | Count |
|--------|-------|
| Total test cases | 78 |
| Success | |
| Failed | |
| Blocked | |
| Not Run | |

**Exit criteria (BAT sign-off):** all Critical-path cases pass (Recommendation: sections 1 to 4, chosen because UC-01, UC-02, and UC-03 carry Business Objectives and UC-01 and UC-02 sit on the main journey of chunk 05; the product manager confirms the list); no open Failed case without a business-accepted deviation; no `(Provisional)` case left unresolved; the Loyalty Administrator confirms TC-LOG-01 (NFR-01) and the Data Protection Officer confirms that members' personal data is handled under the GDPR (NFR-07); no dependency of chunk 02 is needed before BAT sign-off; before go-live: "Points balances at go-live" (Marketing team), listed for the go-live decision.

<!-- MASTER: loyalty-points-brd-master.md | PREV: 15-implementation.md | NEXT: 17-for-ppt.md -->

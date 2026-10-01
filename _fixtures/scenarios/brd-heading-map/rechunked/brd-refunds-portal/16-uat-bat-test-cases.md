<!--
CHUNK: 16
TITLE: UAT/BAT Test Cases
PROJECT: Refunds Portal
VERSION: 1.0 (baselined against BRD v1.0)
DATE: 2026-09-25
DEPENDS_ON: 05, 06a, 06b, 07, 08, 09, 10, 11, 14, 15
PART OF: BRD - Refunds Portal
TYPE: Delivery chunk
GATE: Locked until 14-todo.md is fully cleared (all five steps Complete with evidence, every to-do item Resolved, Deferred does not count, no override) and chunk 15 was written without raising a new open item. Never written or refreshed while the gate is shut.
MERGE: Included in the merged / combined BRD. Read by sdd-unifier as input context only.
PURPOSE: Business-level acceptance test cases (UAT/BAT) derived from the BRD use cases (UC-01..UC-04), NFRs (NFR-01..NFR-04), and the UI/UX expectations (chunk 11). Technical test cases (API contracts, data schemas, performance harnesses) are owned by the SDD test plan, not this file.
SCOPE NOTE: All cases run in the default scope. TC-DEC-04 needs the payment provider's sandbox to refuse a payout (P4).
RULES: delivery-chunks.md in the brd-unifier skill. One combined UAT/BAT suite; "(BAT observation)" marks NFR acceptance cases judged over the UAT/BAT period rather than by one scripted check; the exit criteria are the BAT sign-off. Each case runs when the tasks and prerequisites in its Needs cell are ready, never per section; a task is Accepted when every case naming it in Related Task passes. Expected results come from the BRD; they are never invented.
-->

# Refunds Portal - UAT/BAT Test Cases

**Owner:** Product Team | **Prepared:** 2026-09-25 | **Baseline:** BRD v1.0 (all chunks) | **Design reference:** Figma - Refunds Portal UI/UX (3 screens, chunks 11 and 14)

**Suite status:** Up to date | **Gate verified:** 2026-09-25 (see [14-todo.md](./14-todo.md)) | **New items raised while writing this suite:** 0

**Scope note:** All cases run in the default scope. TC-DEC-04 needs the payment provider's sandbox to refuse a payout (P4).

## How to use this document

- **Testing Result** is filled during execution with one of: `Success`, `Failed`, `Blocked`, `Not Run`.
- Every test case traces to a use case (UC-NN) or NFR, and to the implementation task (TASK-NN) that delivers it ([15-implementation.md](./15-implementation.md)).

## Test environment and data prerequisites

| # | Prerequisite |
|---|--------------|
| P1 | UAT environment connected to the POS records sandbox and the payment provider sandbox |
| P2 | Test accounts: one customer, one branch manager per branch (two branches), one account with no role |
| P3 | Receipts dated 10 days and 31 days before the test day |
| P4 | Ability to make the payment provider sandbox refuse a payout |

---

## 1. Refund Requests (UC-01, UC-02, UC-03, SCR-01, SCR-02)

| TC ID | TC Name | TC Description | TC Example | Success Criteria | Related UC | Related Task | Testing Result | Testing Comment |
|-------|---------|----------------|------------|------------------|-----------|--------------|----------------|-----------------|
| TC-REQ-01 | Submit a refund | Verify a customer can submit a refund within the window | Receipt 10 days old, 2 items, reason "Damaged" (P3) | The request shows as Submitted with a reference number | UC-01 (AC-1) | TASK-01 | | |
| TC-REQ-02 | Refund window passed | Verify a purchase older than 30 days is refused | Receipt 31 days old (P3) | The customer is told the window has passed and can visit the branch | UC-01 (E1, AC-2, BR-1) | TASK-01 | | |
| TC-REQ-03 | Item already refunded | Verify refunded items cannot be selected again | Receipt with one item already refunded | That item is shown but cannot be selected | UC-01 (A1, BR-2) | TASK-01 | | |
| TC-REQ-04 | Receipt not found | Verify an unknown receipt number is handled | Receipt number 000000 | The customer is asked to check the number and try again | UC-01 (E2) | TASK-01 | | |
| TC-REQ-05 | See an approved request | Verify the status and approval date of a request | An approved request | The customer sees Approved with the approval date | UC-02 (AC-1) | TASK-02 | | |
| TC-REQ-06 | No requests yet | Verify the empty list | A customer with no requests | The system says there are no refund requests | UC-02 (A1) | TASK-02 | | |
| TC-REQ-07 | Cancel a request | Verify a Submitted request can be cancelled | A Submitted request, confirm the cancellation | The request becomes Cancelled and the customer gets an email | UC-03 (AC-1) | TASK-02 | | |
| TC-REQ-08 | Cancel after a decision | Verify a decided request cannot be cancelled | A request approved while the customer has it open | The customer is told it can no longer be cancelled | UC-03 (E1, BR-1) | TASK-02 | | |

## 2. Refund Decisions (UC-04, MK-03)

| TC ID | TC Name | TC Description | TC Example | Success Criteria | Related UC | Related Task | Testing Result | Testing Comment |
|-------|---------|----------------|------------|------------------|-----------|--------------|----------------|-----------------|
| TC-DEC-01 | Approve in full | Verify a full approval pays the customer | Submitted request of 50.00 EUR | The payout is sent, the request becomes Paid, and the customer is told | UC-04 (AC-1) | TASK-03 | | |
| TC-DEC-02 | Partial approval limits | Verify the partial amount rule at, below, and above its limits | Request of 50.00 EUR: amounts 0.00, 20.00, 50.00 | 0.00 and 50.00 are refused; 20.00 is accepted with a reason | UC-04 (A1, BR-2) | TASK-03 | | |
| TC-DEC-03 | Reject with a reason | Verify a rejection needs a reason and tells the customer | Reject with reason "Item used" | The request becomes Rejected and the customer sees the reason | UC-04 (A2, BR-3) | TASK-03 | | |
| TC-DEC-04 | Payout keeps failing | Verify the branch manager is told when the payout still fails after one day | Payment provider refuses the payout for a day (P4) | The request stays Approved and the branch manager is told | UC-04 (E1, AC-2) | TASK-03 | | |
| TC-DEC-05 | Other branch refused | Verify a branch manager cannot decide on another branch's request | Branch manager of branch A opens a branch B request | Access is refused | UC-04 (BR-1) | TASK-03 | | |

## 3. Cross-Cutting UI/UX Standards (chunk 11)

| TC ID | TC Name | TC Description | TC Example | Success Criteria | Related UC | Related Task | Testing Result | Testing Comment |
|-------|---------|----------------|------------|------------------|-----------|--------------|----------------|-----------------|
| TC-UIX-01 | Amounts show the currency | Verify every amount shows its currency | Request form, request list, decision screen | Every amount shows EUR | UC-01, UC-02, UC-04 | TASK-01 | | |

## 4. NFR Acceptance (NFR-01, NFR-02)

| TC ID | TC Name | TC Description | TC Example | Success Criteria | Related UC | Related Task | Testing Result | Testing Comment |
|-------|---------|----------------|------------|------------------|-----------|--------------|----------------|-----------------|
| TC-NFR-01 | No lost or double payouts | Verify every approved refund is paid exactly once | Compare approved and paid refunds over the UAT period (BAT observation) | Zero missing or duplicate payouts | NFR-01 | TASK-03 | | |
| TC-NFR-02 | Available at any time | Verify the portal stays available | Availability log kept over the UAT period (BAT observation) | No more than 2 hours of disruption a month | NFR-02 | TASK-01 | | |

---

## Traceability Matrix

| BRD Reference | Covered By |
|---------------|-----------|
| UC-01 Request a Refund | TC-REQ-01..04, TC-UIX-01 |
| UC-02 Track Refund Status (Web and Mobile) | TC-REQ-05..06, TC-UIX-01 |
| UC-03 Cancel a Refund Request | TC-REQ-07..08 |
| UC-04 Approve / Reject Refund | TC-DEC-01..05, TC-UIX-01 |
| NFR-01 | TC-NFR-01 |
| NFR-02 | TC-NFR-02 |

## Provisional and blocked scenarios

None. Every expected result is grounded in a confirmed requirement.

## Coverage gaps

**Checked:** 4 Main Flows, 3 alternate flows, 4 exception flows, 5 acceptance criteria, 2 numeric or time-based rules, 2 NFRs. **Without a case:** 0.

## Execution summary (fill at the end of the cycle)

| Metric | Count |
|--------|-------|
| Total test cases | 16 |

<!-- MASTER: refunds-portal-brd-master.md | PREV: 15-implementation.md | NEXT: 17-for-ppt.md -->

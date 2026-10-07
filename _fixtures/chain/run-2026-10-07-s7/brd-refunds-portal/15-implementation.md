<!--
CHUNK: 15
TITLE: Implementation Plan
PROJECT: Refunds Portal
VERSION: 1.9
DEPENDS_ON: 02, 03, 05, 06a, 06b, 07, 08, 09, 10, 11, 13, 14
PART OF: BRD - Refunds Portal
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

**Plan status:** Up to date | **Basis:** BRD v1.9 | **Gate verified:** 2026-10-06 (see [14-todo.md](./14-todo.md)) | **Flowcharts used:** Figures 4-12 (connected UC-06 and UC-04 views included) | **New items raised while writing this plan:** 0

## How to use this plan

1. Read [refunds-portal-brd-master.md](./refunds-portal-brd-master.md), then the use cases a task cites, before starting the task.
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
| UC-01 Request a Refund | [06a](./06a-use-cases-customer.md#uc-01-request-a-refund) | TASK-01 |
| UC-02 Track Refund Status | [06a](./06a-use-cases-customer.md#uc-02-track-refund-status) | TASK-02 |
| UC-03 Cancel a Refund Request | [06a](./06a-use-cases-customer.md#uc-03-cancel-a-refund-request) | TASK-02 |
| UC-06 Sign Up and Sign In | [06a](./06a-use-cases-customer.md#uc-06-sign-up-and-sign-in) | TASK-04 |
| UC-04 Approve / Reject Refund | [06b](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | TASK-03 |

UC-05 is merged into UC-04 ([05 / Use Case Summary](./05-user-journeys-overview.md#use-case-summary)), so it has no row. The branch refund report ([09](./09-reporting-and-analytics.md#reporting--analytics)) has no use case; TASK-05 delivers it. TASK-01 to TASK-03 keep their IDs from the BRD v1.0 plan, a reference input in [12 / Appendix](./12-appendix-and-wishlist.md#appendix). TASK-04 and TASK-05 are new, so the IDs do not follow the execution order.

## Execution sequence

| Wave | Tasks (can run in parallel) | Depends on |
|------|-----------------------------|-----------|
| 1 | TASK-04 | None |
| 2 | TASK-01 | Wave 1 (TASK-04) |
| 3 | TASK-02, TASK-03 | Wave 2 (TASK-01); TASK-02 also depends on TASK-04 |
| 4 | TASK-05 | Wave 3 (TASK-02, TASK-03) |

## Dependency problems

None identified. Checked:

- Every precondition against what delivers it: the signed-in customer (UC-06, TASK-04); the Submitted request (UC-01, TASK-01); the Payout failed request that UC-04 A3 opens (UC-04 E1, inside TASK-03); branch manager access and covers (set up outside the portal, [02 / Assumption 3](./02-glossary-assumptions-facts.md#assumptions--constraints)); receipts (the Point-of-Sale Records, [02 / Assumption 1](./02-glossary-assumptions-facts.md#assumptions--constraints)).
- The cross-flows UC-03 E1, E2 and UC-04 E2: each handles the other's outcome, but neither main flow depends on the other, so they form no cycle. The test cases that need both tasks name both in their Needs cell (chunk 16).
- The four dependencies in [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies): each is a blocker of the task that delivers its use case (TASK-04, TASK-01, TASK-03) until it is in place. None is a missing prerequisite. TD-03 to TD-05 confirm owners and Needed before for the three pending dependencies. Staff sign-in and branch manager access is Confirmed (test fixture, BO-03; owner Retail IT team), needed before UC-04.

---

## Tasks

### TASK-04: Customer sign-up and sign-in

| | |
|---|---|
| **Objective** | Customers can create an account with a confirmed email address and mobile number, sign in, and get back in when they forget the password. |
| **Scope** | In: UC-06 Main Flow, A1, A3, E1 to E4, Business Rules; the notice at sign-up ([03 / Refund records](./03-definitions-and-domain-concepts.md#refund-records)); the sign-in or sign-up choice that A2 opens. Out: sending a customer who is not signed in to that choice from the request, tracking, and cancelling screens, UC-06 AC-5 (TASK-01, TASK-02); showing only the customer's own requests, UC-06 AC-2 (TASK-02). |
| **Type** | Use-case delivery |
| **Wave** | 1 |
| **Source use cases** | [06a / UC-06](./06a-use-cases-customer.md#uc-06-sign-up-and-sign-in) |
| **Source requirements** | UC-06 BR-1 to BR-4; 03 / Refund records (notice); 08 / Notification Partner; 11 / Error Messages, Responsive Design, Primary Color, Language & Locale; NFR-06; MK-04 (14) |
| **Dependencies** | None |
| **Can run in parallel with** | None (the only task in wave 1) |
| **Status basis** | Confirmed |
| **Delivery status** | Not started |

**Expected deliverables**

- Sign-up with an email address, a mobile number, and a password, confirmed by a code sent to each address (UC-06 steps 1-6; MK-04).
- The notice of how the details are used and how long they are kept, shown before the customer gives them (UC-06 step 2).
- Sign-in with email address and password, and the reset of a forgotten password with a code sent to the account's email address (UC-06 A1, A3).
- The handling of a wrong or expired code, an email address already used, codes that cannot be sent, and a failed sign-in (UC-06 E1 to E4).
- The sign-in or sign-up choice that UC-06 A2 opens.

**Completion criteria** (each cites its source; a short label, not the restated text)

- [ ] UC-06 AC-1: account created, customer signed in
- [ ] UC-06 AC-3: wrong or expired code, new code offered
- [ ] UC-06 AC-4: email address already used, sign-in offered
- [ ] UC-06 AC-6: new code sent and accepted
- [ ] UC-06 AC-7: partner does not answer, try again later
- [ ] UC-06 AC-8: right code entered again, sign-up goes on
- [ ] UC-06 AC-9: another email address, sign-up goes on
- [ ] UC-06 AC-10: forgotten password reset, customer signed in
- [ ] UC-06 AC-11: email address and password do not match, try again
- [ ] UC-06 A1: customer with an account signs in
- [ ] UC-06 step 2: notice shown before the details are given
- [ ] UC-06 BR-1 to BR-4: both addresses confirmed first; one account per email address; a code works 15 minutes; only the latest code works
- [ ] 11 / Error Messages, Responsive Design, Primary Color, Language & Locale hold on this task's screens
- [ ] NFR-06: this task's screens meet WCAG 2.1 level AA

**Assumptions, open questions, blockers**

- Assumption: None.
- Open question: None.
- Blocker: [02 / Dependency "Notification Partner sending email and SMS to customers and branch managers"](./02-glossary-assumptions-facts.md#dependencies) (To be verified; owner MsgHub): needed before the build of UC-06.

---

### TASK-01: Refund requests

| | |
|---|---|
| **Objective** | A signed-in customer can request a refund online for items on a branch receipt, within the refund window, and gets a reference number. |
| **Scope** | In: UC-01 Main Flow, A1, E1 to E5, Business Rules; the email and SMS at submission; telling the Point-of-Sale Records which items are in a request; sending a customer who is not signed in to sign in or sign up when they try to request a refund (UC-06 A2, AC-5). Out: sign-up and sign-in (TASK-04); tracking and cancelling (TASK-02); decisions and payouts (TASK-03); what a cancellation or a decision does to later requests for the same items, UC-01 BR-6 (TASK-02, TASK-03). |
| **Type** | Use-case delivery |
| **Wave** | 2 |
| **Source use cases** | [06a / UC-01](./06a-use-cases-customer.md#uc-01-request-a-refund) |
| **Source requirements** | UC-01 BR-1 to BR-7; UC-06 A2, AC-5; 02 / Assumption 1; 08 / Point-of-Sale Records, Notification Partner; 11 / Language & Locale, Error Messages, Responsive Design, Primary Color; NFR-02, NFR-03, NFR-05, NFR-06; MK-01 (screen SCR-01) |
| **Dependencies** | TASK-04 (UC-01 Preconditions: the customer is signed in, through UC-06) |
| **Can run in parallel with** | None (the only task in wave 2) |
| **Status basis** | Confirmed |
| **Delivery status** | Not started |

**Expected deliverables**

- The refund request form: receipt number and receipt total, items, reason, refund amount, and submission (UC-01 steps 1-5; MK-01, screen SCR-01).
- The receipt check with the Point-of-Sale Records and its outcomes: items not selectable, window passed, receipt not found, not paid by card, receipts cannot be checked, nothing left to refund (UC-01 A1, E1 to E5).
- The Submitted request with its reference number, the email and SMS that tell the customer to bring the items, and the items sent to the Point-of-Sale Records (UC-01 step 6).
- The refund amount and refund window rules (UC-01 BR-1 to BR-7).

**Completion criteria** (each cites its source; a short label, not the restated text)

- [ ] UC-01 AC-1: request recorded as Submitted with a reference number
- [ ] UC-01 AC-2: purchase 31 days old, window passed
- [ ] UC-01 AC-3: purchase made 30 days ago, accepted
- [ ] UC-01 AC-4: item refunded or in a request that is not Cancelled, not selectable
- [ ] UC-01 AC-5: no matching receipt, check and try again
- [ ] UC-01 AC-6: no card payment, card purchases only
- [ ] UC-01 AC-7: records do not answer, try again later
- [ ] UC-01 AC-8: window closed before submission, not recorded
- [ ] UC-01 AC-9: other items still submitted
- [ ] UC-01 AC-10: nothing left to refund, customer told
- [ ] UC-01 AC-11, BR-4: the current card-paid cap counts Approved and Paid amounts only
- [ ] UC-01 BR-3, BR-5: no card details asked; receipt discount split
- [ ] UC-01 step 6: email and SMS sent; Point-of-Sale Records told the items
- [ ] UC-06 AC-5: a customer who is not signed in is asked to sign in or sign up (request)
- [ ] 11 / Language & Locale, Error Messages, Responsive Design, Primary Color hold on this task's screens
- [ ] NFR-05 and NFR-03: a receipt check completes within 3 seconds, also at the seasonal peak
- [ ] NFR-02: no more than 2 hours of disruption a month
- [ ] NFR-06: this task's screens meet WCAG 2.1 level AA

**Assumptions, open questions, blockers**

- Assumption: every purchase has a receipt number the customer can enter ([02 / Assumption 1](./02-glossary-assumptions-facts.md#assumptions--constraints)).
- Open question: None.
- Blocker: [02 / Dependency "Point-of-Sale Records with every branch's receipts, which also stop items in a portal request from being refunded at a branch"](./02-glossary-assumptions-facts.md#dependencies) (To be verified; owner Retail IT team): needed before the build of UC-01.

---

### TASK-02: Request tracking and cancellation

| | |
|---|---|
| **Objective** | A signed-in customer can see each of their refund requests with its history, and cancel a request that is not decided yet. |
| **Scope** | In: UC-02 Main Flow, A1, Business Rules; UC-03 Main Flow, E1, E2, Business Rules; only the customer's own requests (07 footnote 2; UC-06 AC-2); freeing the items of a Cancelled request (UC-03 step 5; UC-01 BR-6); sending a customer who is not signed in to sign in or sign up when they try to track or cancel (UC-06 A2, AC-5). One task for both use cases: UC-03 starts on the UC-02 request detail (screen SCR-02, MK-02), so they cannot be released apart. Out: creating requests (TASK-01); decisions and payouts (TASK-03). |
| **Type** | Use-case delivery |
| **Wave** | 3 |
| **Source use cases** | [06a / UC-02](./06a-use-cases-customer.md#uc-02-track-refund-status), [06a / UC-03](./06a-use-cases-customer.md#uc-03-cancel-a-refund-request) |
| **Source requirements** | UC-02 BR-1; UC-03 BR-1; UC-01 BR-6; UC-06 A2, AC-2, AC-5; 07 footnote 2; 08 / Notification Partner, Point-of-Sale Records; 11 / Data Tables, Language & Locale, Error Messages, Responsive Design, Primary Color; NFR-03, NFR-04, NFR-05, NFR-06; MK-02 (screen SCR-02) |
| **Dependencies** | TASK-04 (UC-02 and UC-03 Preconditions: the customer is signed in), TASK-01 (UC-02 step 2 lists the requests that UC-01 step 6 records; UC-03 Preconditions: the request is Submitted) |
| **Can run in parallel with** | TASK-03 |
| **Status basis** | Confirmed |
| **Delivery status** | Not started |

**Expected deliverables**

- The customer's request list with reference number, amount, and status, and the request detail with its history, dates, and reasons (UC-02 steps 1-4; MK-02, screen SCR-02).
- The message when there are no requests (UC-02 A1).
- The cancel action with its confirmation, the Cancelled status, the email and SMS, and the message to the Point-of-Sale Records (UC-03 steps 1-5).
- The refusal to cancel a request decided in the meantime (UC-03 E1, E2).

**Completion criteria** (each cites its source; a short label, not the restated text)

- [ ] UC-02 AC-1: approved request shows Approved with its date
- [ ] UC-02 AC-2: no requests, the system says so
- [ ] UC-02 step 4: reason shown for a rejection or a partial approval
- [ ] UC-02 BR-1, UC-06 AC-2, 07 footnote 2: only the customer's own requests
- [ ] UC-03 AC-1: confirmed cancellation, Cancelled
- [ ] UC-03 AC-2: decided request, cannot be cancelled
- [ ] UC-03 AC-3: decided while confirming, not cancelled
- [ ] UC-03 step 5: email and SMS; Point-of-Sale Records told the items can be refunded at the branch
- [ ] UC-01 BR-6: items of a Cancelled request can be selected again within the refund window
- [ ] UC-06 AC-5: a customer who is not signed in is asked to sign in or sign up (track, cancel)
- [ ] 11 / Data Tables, Language & Locale, Error Messages, Responsive Design, Primary Color hold on this task's screens
- [ ] NFR-05 and NFR-03: opening a request completes within 3 seconds, also at the seasonal peak
- [ ] NFR-04: a customer sees only their own requests
- [ ] NFR-06: this task's screens meet WCAG 2.1 level AA

**Assumptions, open questions, blockers**

- Assumption: None.
- Open question: None.
- Blocker: None.

---

### TASK-03: Refund decisions and payout

| | |
|---|---|
| **Objective** | A branch manager signs in and approves a Submitted request of their branch, or of a branch they cover, in full or in part, or rejects it with a reason; approved refunds are paid to the original card. |
| **Scope** | In: branch manager sign-in with the access set up outside the portal (UC-04 Preconditions; 02 / Assumption 3; 04 / In Scope); UC-04 Main Flow, A1 to A3, E1, E2, Business Rules, including the daily waiting-requests message and the cover rule; the messages to customers and branch managers; the messages to the Point-of-Sale Records (A2, E1); what a decision does to later requests for the same items (UC-01 BR-6). Out: the branch refund report (TASK-05); cancelling (TASK-02). |
| **Type** | Use-case delivery |
| **Wave** | 3 |
| **Source use cases** | [06b / UC-04](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) |
| **Source requirements** | UC-04 BR-1 to BR-7; UC-01 BR-4, BR-6; 02 / Assumption 3; 03 / Branch ownership, Refund request lifecycle; 07 footnote 1 and the Customer column; 08 / Payment Provider, Notification Partner, Point-of-Sale Records, Staff sign-in and branch manager access; 11 / Data Tables, Language & Locale, Error Messages, Responsive Design, Primary Color; NFR-01, NFR-03, NFR-04, NFR-05, NFR-06; MK-03 |
| **Dependencies** | TASK-01 (UC-04 Preconditions: the request is Submitted, recorded by UC-01 step 6) |
| **Can run in parallel with** | TASK-02 |
| **Status basis** | Confirmed |
| **Delivery status** | Not started |

**Expected deliverables**

- Branch manager sign-in, and the list of Submitted requests of the own branch and covered branches, oldest first, with amount and reason (UC-04 Preconditions, steps 1-2; MK-03).
- Approval in full or in part, the payout to the original card, the Paid status, and the message with the amount paid and, for a partial approval, the reason (UC-04 steps 3-7, A1).
- Rejection with a reason, with its email and SMS and the message to the Point-of-Sale Records (UC-04 A2).
- Payout retries, Payout failed after the time set in E1, its messages, and the view-only Payout failed request (UC-04 E1, A3).
- The refusal to record a decision on a request the customer has cancelled (UC-04 E2).
- The daily waiting-requests message and the cover rule (UC-04 BR-5, BR-6).

**Completion criteria** (each cites its source; a short label, not the restated text)

- [ ] UC-04 AC-1: approval sends the payout and tells the customer
- [ ] UC-04 AC-2: payout still failing after 24 hours, branch manager told
- [ ] UC-04 AC-3: partial approval, customer told the amount and the reason
- [ ] UC-04 AC-4: Payout failed, customer asked to visit the branch
- [ ] UC-04 AC-5: rejection with a reason, customer told by email and SMS
- [ ] UC-04 AC-6: request cancelled meanwhile, decision not recorded
- [ ] UC-04 AC-7: Payout failed request opens for viewing only
- [ ] UC-04 AC-8: later payout try succeeds, request Paid
- [ ] UC-04 AC-9, step 4; UC-01 BR-4: confirmation uses the current card-paid cap
- [ ] UC-04 BR-2, BR-3: partial amount limits; reason required for a rejection
- [ ] UC-04 BR-4: the approval confirms the items are back; incomplete or damaged items lead to A1 or A2
- [ ] UC-04 BR-5, BR-6: daily message on days with waiting requests; a cover decides and gets the branch's messages
- [ ] UC-04 BR-1, 07 footnote 1, NFR-04: own branch or covered branch only
- [ ] 07 matrix: the Customer (marked -) is refused the decision screens
- [ ] UC-01 BR-6: items of a decided request cannot be selected again; after a partial approval every item counts as refunded
- [ ] 08 / Point-of-Sale Records: items freed after A2 and E1
- [ ] NFR-01: no missing or duplicate payouts
- [ ] 11 / Data Tables, Language & Locale, Error Messages, Responsive Design, Primary Color hold on this task's screens
- [ ] NFR-05 and NFR-03: opening a request completes within 3 seconds, also at the seasonal peak
- [ ] NFR-06: this task's screens meet WCAG 2.1 level AA

**Assumptions, open questions, blockers**

- Prerequisite: [08 / Staff sign-in and branch manager access](./08-integrations.md#integrations), with the access data in 02 / Assumption 3. Confirmed as a test fixture (BO-03), owner Retail IT team; needed before the build of UC-04.
- Assumption: branch managers, their branches, their covers, and their email addresses and mobile numbers are set up outside the portal ([02 / Assumption 3](./02-glossary-assumptions-facts.md#assumptions--constraints)).
- Open question: None.
- Blocker: [02 / Dependency "Payment provider support for refunds to the original card"](./02-glossary-assumptions-facts.md#dependencies) (To be verified; owner Payment Provider, CardPay Ltd): needed before the build of UC-04.

---

### TASK-05: Branch refund report

| | |
|---|---|
| **Objective** | A branch manager sees a daily report of their branch's refund requests and can export it. |
| **Scope** | In: the branch refund report as 09 states it: requests per status, amounts paid, average time to decision, and average time from Submitted to Paid, with the branch-local cutoff, status and amount snapshots, sample rules and empty averages in 09; an on-screen table with export to CSV and Excel. Out: the requests, cancellations, and decisions it counts (TASK-01 to TASK-03); branch manager sign-in (TASK-03). |
| **Type** | Cross-cutting |
| **Wave** | 4 |
| **Source use cases** | None. The report has no use case; it counts the requests that UC-01 records and that UC-03 and UC-04 change, which is the evidence for a Cross-cutting task ([09 / Branch refund report](./09-reporting-and-analytics.md#reporting--analytics)). |
| **Source requirements** | 09 / Branch refund report; 01 / Business Objective 1 (the report shows the average time from Submitted to Paid); 11 / Language & Locale, Responsive Design, Primary Color; NFR-06; MK-05 (14) |
| **Dependencies** | TASK-02 (Cancelled requests, UC-03 step 5), TASK-03 (decisions, payouts, and branch manager sign-in, UC-04) |
| **Can run in parallel with** | None (the only task in wave 4) |
| **Status basis** | Confirmed |
| **Delivery status** | Not started |

**Expected deliverables**

- The four report measures using the cutoff, samples and empty averages in 09 (MK-05).
- The export of the report to CSV and Excel (09).

**Completion criteria** (each cites its source; a short label, not the restated text)

- [ ] 09: requests per status, amounts paid, average time to decision, average time from Submitted to Paid
- [ ] 09: cumulative branch-local cutoff; statuses and paid amounts as of that cutoff
- [ ] 09: elapsed-time means over decided and Paid samples; empty samples show no average
- [ ] 01 / Business Objective 1: REFUNDS owner assesses the Paid sample using equal request weights across branches
- [ ] 09: on-screen table with export to CSV and Excel
- [ ] 11 / Language & Locale, Responsive Design, Primary Color hold on the report
- [ ] NFR-06: the report meets WCAG 2.1 level AA

**Assumptions, open questions, blockers**

- Assumption: None.
- Open question: None.
- Blocker: None.

<!-- MASTER: refunds-portal-brd-master.md | PREV: 14-todo.md | NEXT: 16-uat-bat-test-cases.md -->

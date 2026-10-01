# Refunds Portal: Business Requirements Document (BRD)

**Project / Product Name:** Refunds Portal
**Version:** 1.0
**Status:** Approved
**Author:** Product Team
**Date:** 2026-09-22

---

## Changes Log

| Version | Updated Date | Updated By | Reviewed By | Approved By | Update Summary |
|---------|--------------|------------|-------------|-------------|----------------|
| 1.0 | 2026-09-22 | Product Team | Operations Lead | Head of Retail | Initial BRD. |

---

## Table of Contents

- [Executive Summary](#executive-summary)
- [Background and Context](#background-and-context)
- [Business Objectives](#business-objectives)
- [Glossary](#glossary)
- [Assumptions / Constraints](#assumptions--constraints)
- [Facts](#facts)
- [Challenges](#challenges)
- [Dependencies](#dependencies)
- [Definitions & Important Details](#definitions--important-details)
  - [Refund request lifecycle](#refund-request-lifecycle)
  - [Branch ownership](#branch-ownership)
- [Project Scope](#project-scope)
  - [In Scope](#in-scope)
  - [Out of Scope](#out-of-scope)
- [Personas / Actors](#personas--actors)
- [User Journeys & Use Cases](#user-journeys--use-cases)
  - [User Journeys](#user-journeys)
    - [Customer Journey](#customer-journey)
    - [Branch Manager Journey](#branch-manager-journey)
  - [Summarized Workflow](#summarized-workflow)
  - [Use Case Summary](#use-case-summary)
  - [Detailed Use Cases](#detailed-use-cases)
    - [Use Cases - Customer](#use-cases---customer)
      - [UC-01: Request a Refund](#uc-01-request-a-refund)
      - [UC-02: Track Refund Status (Web and Mobile)](#uc-02-track-refund-status-web-and-mobile)
      - [UC-03: Cancel a Refund Request](#uc-03-cancel-a-refund-request)
    - [Use Cases - Branch Manager](#use-cases---branch-manager)
      - [UC-04: Approve / Reject Refund](#uc-04-approve--reject-refund)
- [Users & Use Cases Matrix](#users--use-cases-matrix)
- [Integrations](#integrations)
- [Reporting / Analytics](#reporting--analytics)
- [Non-Functional Requirements](#non-functional-requirements)
- [Summary](#summary)
- [UI/UX Expectations](#uiux-expectations)
  - [Screens](#screens)
- [Appendix](#appendix)
  - [Technical Inputs for the SDD](#technical-inputs-for-the-sdd)
- [Wishlist](#wishlist)
- [Open Items & Clarifications](#open-items--clarifications)
  - [Open Items](#open-items)
    - [OI-01: Partial refunds as a separate use case](#oi-01-partial-refunds-as-a-separate-use-case)
  - [Resolution Log](#resolution-log)
- [Product Manager To-Do](./14-todo.md) (separate file, not part of this merged BRD)
- [Implementation Plan](#implementation-plan)
  - [Waves](#waves)
  - [Use-case coverage](#use-case-coverage)
- [Refunds Portal - UAT/BAT Test Cases](#refunds-portal---uatbat-test-cases)
  - [How to use this document](#how-to-use-this-document)
  - [Test environment and data prerequisites](#test-environment-and-data-prerequisites)
  - [1. Refund Requests (UC-01, UC-02, UC-03, SCR-01, SCR-02)](#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02)
  - [2. Refund Decisions (UC-04, MK-03)](#2-refund-decisions-uc-04-mk-03)
  - [3. Cross-Cutting UI/UX Standards (chunk 11)](#3-cross-cutting-uiux-standards-chunk-11)
  - [4. NFR Acceptance (NFR-01, NFR-02)](#4-nfr-acceptance-nfr-01-nfr-02)
  - [Traceability Matrix](#traceability-matrix)
  - [Provisional and blocked scenarios](#provisional-and-blocked-scenarios)
  - [Coverage gaps](#coverage-gaps)
  - [Execution summary (fill at the end of the cycle)](#execution-summary-fill-at-the-end-of-the-cycle)

---

# Executive Summary

Customers of our retail branches ask for refunds in person today. Staff record requests on paper, managers approve them by phone, and customers wait up to 10 days without knowing where their request stands. The Refunds Portal lets customers request and track refunds online, and lets branch managers approve or reject them in one place. Approved refunds are paid back to the customer's original card through our payment provider.

# Background and Context

About 1,200 refund requests a month reach our 40 branches. 18% of complaints to customer care are about slow or lost refund requests.

# Business Objectives

1. Cut the average time from request to payout from 10 days to 3 days.
2. Stop lost refund requests: every request is recorded and visible to the customer.
3. Give branch managers one place to decide on refunds for their own branch.

---

# Glossary

| Term | Meaning |
|------|---------|
| Refund request | A customer's request to get money back for items bought in a branch. |
| Refund window | The 30 days after purchase during which a refund can be requested. |
| Partial refund | A refund of part of the requested amount. |
| Branch | A physical store. Every purchase belongs to one branch. |
| Payout | The money sent back to the customer's original card. |

# Assumptions / Constraints

1. Every purchase has a receipt number the customer can enter.
2. Payouts go only to the card used for the purchase.

# Facts

1. About 1,200 refund requests a month across 40 branches.
2. Seasonal sales triple the number of requests for about 3 weeks.

# Challenges

1. Paper records get lost, and customers cannot see progress.

# Dependencies

1. The payment provider must support refunds to the original card. (Hard dependency)

---

# Definitions & Important Details

## Refund request lifecycle

A refund request is **Submitted** by the customer. The branch manager then **Approves** it (in full or in part) or **Rejects** it with a reason. An approved request becomes **Paid** once the payout succeeds. A customer can **Cancel** a request while it is still Submitted.

## Branch ownership

Each purchase, and so each refund request, belongs to exactly one branch. Branch managers decide only on their own branch's requests.

---

# Project Scope

Customers request refunds online and follow them until the money is back on their card. Branch managers decide on each request for their branch. Customers are told the outcome at each step.

## In Scope

- Online refund requests for purchases made in branches.
- Refund decisions by branch managers, in full or in part.
- Payout to the customer's original card.
- Customer messages by email and SMS.

## Out of Scope

- Refunds for online-shop purchases (a separate system handles them).
- Cash refunds.

---

# Personas / Actors

| Persona | Role | Key Goals | Access Level |
|---------|------|-----------|-------------|
| Customer | Buyer who wants money back | Request a refund and know where it stands | Own requests only |
| Branch Manager | Runs one branch | Decide quickly on refunds for the branch | Own branch only |

---

# User Journeys & Use Cases

## User Journeys

### Customer Journey

The customer enters the receipt number, picks the items and a reason, and submits the request. They follow the request until the money is back on their card, and can cancel it while it waits for a decision.

### Branch Manager Journey

The branch manager sees the requests waiting for their branch, checks each one, and approves it in full or in part, or rejects it with a reason.

## Summarized Workflow

1. The customer submits a refund request.
2. The branch manager approves or rejects it.
3. On approval, the payout is sent to the customer's original card.
4. The customer is told the outcome at each step.

## Use Case Summary

| UC ID | Use Case | Primary Actor | Description |
|-------|----------|---------------|-------------|
| **Customer** | | | |
| UC-01 | Request a Refund | Customer | The customer asks for money back for items on a receipt, within the refund window. |
| UC-02 | Track Refund Status (Web and Mobile) | Customer | The customer sees where each of their requests stands. |
| UC-03 | Cancel a Refund Request | Customer | The customer withdraws a request that has not been decided yet. |
| **Branch Manager** | | | |
| UC-04 | Approve / Reject Refund | Branch Manager | The branch manager approves a request in full or in part, or rejects it with a reason. |
| UC-05 | Issue Partial Refund | Branch Manager | Merged into UC-04 |

## Detailed Use Cases

All detailed use cases follow this structure:

- **Actor & Goal**: Who performs it, what they want, what triggers it.
- **Why**: The business value of this use case.
- **Preconditions**: What must be true before the use case can start.
- **Main Flow**: Numbered detailed steps - actor action, system response, alternating.
- **Alternate & Exception Flows**: What happens when the path branches or fails, in business terms.
- **Flowchart** (branching use cases only, added once the requirements are final): The main, alternate, and exception paths in one diagram, derived from the narrative.
- **Business Rules & Constraints**: Rules, limits, and conditions that govern the use case.
- **Acceptance Criteria**: Testable conditions that confirm the use case is complete.
- **Future Enhancements**: Low-complexity follow-ups that could ship next.
- **UI/UX**: Wireframes or references to approved Figma designs.

### Use Cases - Customer

---

#### UC-01: Request a Refund

| | |
|---|---|
| **Primary Actor** | Customer |
| **Supporting Actors** | None |
| **Goal** | Get money back for items bought in a branch. |
| **Trigger** | The customer is not happy with items they bought. |

##### Why

Supports Business Objectives 1 and 2: every request is recorded at once and is never lost.

##### Preconditions

- The purchase is within the 30-day refund window.

##### Main Flow

1. The customer enters the receipt number.
2. The system shows the items on the receipt that can still be refunded.
3. The customer selects the items and a reason.
4. The system shows the refund amount.
5. The customer submits the request.
6. The system records the request as Submitted, gives it a reference number, and tells the customer by email and SMS.

##### Alternate & Exception Flows

- **A1 - Some items already refunded:** At step 2, those items are shown but cannot be selected.
- **E1 - Refund window has passed:** At step 2, the system tells the customer the purchase is older than 30 days and that they can visit the branch.
- **E2 - Receipt not found:** At step 2, the system asks the customer to check the number and try again.

##### Business Rules & Constraints

- A refund can be requested only within 30 days of purchase.
- An item can be refunded only once.

##### Acceptance Criteria

- [ ] Given a purchase 10 days old, when the customer submits a request, then it is recorded as Submitted with a reference number.
- [ ] Given a purchase 31 days old, when the customer enters the receipt, then they are told the refund window has passed.

##### Future Enhancements

- None identified at this time.

##### UI/UX

Screen SCR-01 (refund request form). Figma: https://www.figma.com/proto/RFND01/refunds-portal?node-id=scr-01

---

#### UC-02: Track Refund Status (Web and Mobile)

| | |
|---|---|
| **Primary Actor** | Customer |
| **Supporting Actors** | None |
| **Goal** | Know where each refund request stands. |
| **Trigger** | The customer wants an update. |

##### Why

Supports Business Objective 2: customers can see their request at any time.

##### Preconditions

- The customer has at least one refund request.

##### Main Flow

1. The customer opens their refund requests.
2. The system lists each request with its reference number, amount, and status (Submitted, Approved, Rejected, Paid, Cancelled).
3. The customer opens one request.
4. The system shows its history with the date of each status change and, if it was rejected, the reason.

##### Alternate & Exception Flows

- **A1 - No requests yet:** At step 2, the system says there are no refund requests.

##### Business Rules & Constraints

- Customers see only their own requests.

##### Acceptance Criteria

- [ ] Given an approved request, when the customer opens it, then they see Approved with the approval date.

##### Future Enhancements

- Push notifications in the mobile app.

##### UI/UX

Screen SCR-02 (my refund requests: list and request detail). Figma: https://www.figma.com/proto/RFND01/refunds-portal?node-id=scr-02

---

#### UC-03: Cancel a Refund Request

| | |
|---|---|
| **Primary Actor** | Customer |
| **Supporting Actors** | None |
| **Goal** | Withdraw a request they no longer want. |
| **Trigger** | The customer changes their mind. |

##### Why

Saves branch managers from deciding on requests customers no longer want.

##### Preconditions

- The request is Submitted (not decided yet).

##### Main Flow

1. The customer opens a Submitted request.
2. The customer chooses to cancel it.
3. The system asks the customer to confirm.
4. The customer confirms.
5. The system marks the request Cancelled and tells the customer by email.

##### Alternate & Exception Flows

- **E1 - Already decided:** At step 2, if the branch manager has decided in the meantime, the system says the request can no longer be cancelled.

##### Business Rules & Constraints

- Only Submitted requests can be cancelled.

##### Acceptance Criteria

- [ ] Given a Submitted request, when the customer confirms the cancellation, then it becomes Cancelled.

##### Future Enhancements

- None identified at this time.

##### UI/UX

Screen SCR-02 (the cancel action on the request detail). Figma: https://www.figma.com/proto/RFND01/refunds-portal?node-id=scr-02

---

### Use Cases - Branch Manager

---

#### UC-04: Approve / Reject Refund

| | |
|---|---|
| **Primary Actor** | Branch Manager |
| **Supporting Actors** | Payment provider (external business party) |
| **Goal** | Decide on each refund request for the branch. |
| **Trigger** | A request for the branch is waiting for a decision. |

##### Why

Supports Business Objectives 1 and 3.

##### Preconditions

- The request is Submitted and belongs to the branch manager's branch.

##### Main Flow

1. The branch manager opens the list of Submitted requests for their branch.
2. The system lists them, oldest first, with amount and reason.
3. The branch manager opens a request and chooses Approve.
4. The system asks the branch manager to confirm the refund amount.
5. The branch manager confirms.
6. The system marks the request Approved and sends the payout to the customer's original card.
7. When the payout succeeds, the system marks the request Paid and tells the customer by email and SMS.

##### Alternate & Exception Flows

- **A1 - Partial approval:** At step 4, the branch manager lowers the amount and gives a reason; the rest of the flow continues with the lower amount.
- **A2 - Reject:** At step 3, the branch manager chooses Reject and gives a reason; the system marks the request Rejected and tells the customer the reason.
- **E1 - Payout fails:** At step 7, if the payment provider refuses the payout, the request stays Approved, the system tries again, and the branch manager is told if it still fails after one day.

##### Business Rules & Constraints

- Branch managers decide only on requests of their own branch.
- A partial refund amount must be more than 0 and less than the requested amount.
- A rejection always has a reason.

##### Acceptance Criteria

- [ ] Given a Submitted request, when the branch manager approves it, then the payout is sent and the customer is told.
- [ ] Given a payout that still fails after one day, then the branch manager is told.

##### Future Enhancements

- Bulk approval of small refunds.

##### UI/UX

Mockup MK-03 (decision screen; no screen ID in chunk 11 yet). Figma: https://www.figma.com/proto/RFND01/refunds-portal?node-id=mk-03

---

# Users & Use Cases Matrix

> **How to read.** Rows are the use cases; columns are the personas. **Yes** = allowed. **-** = not allowed. A numbered footnote marks conditional access.

| Use Case | Customer | Branch Manager |
|----------|:--------:|:--------------:|
| UC-01 Request a Refund | Yes | - |
| UC-02 Track Refund Status (Web and Mobile) | Yes | - |
| UC-03 Cancel a Refund Request | Yes | - |
| UC-04 Approve / Reject Refund | - | Yes¹ |

¹ Own branch only.

---

# Integrations

| Business System / Partner | Business Purpose | Information Exchanged | Direction | Criticality | Provider / Owner |
|---------------------------|------------------|-----------------------|-----------|-------------|------------------|
| Payment Provider | Send refund payouts to the customer's original card | Payout requests, payout results | Both ways | Critical | CardPay Ltd |
| Notification Partner | Tell customers about their refund by email and SMS | Customer contact details, message content | We send | Important | MsgHub |
| Point-of-Sale Records | Look up the receipt and its items when a customer requests a refund | Receipt number, items, amounts, branch, purchase date | We receive | Critical | Retail IT team |

> Technical integration details (protocols, authentication, data formats, availability targets) are defined in the SDD, not here.

---

# Reporting / Analytics

| Report | Audience | Frequency | Content |
|--------|----------|-----------|---------|
| Branch refund report | Branch Manager | Daily | Requests per status, amounts paid, and average time to decision for the branch |

---

# Non-Functional Requirements

| ID | Requirement | Business measure |
|----|-------------|------------------|
| NFR-01 | Refund money is never lost or paid twice. | Zero missing or duplicate payouts per month. |
| NFR-02 | Customers can use the portal at any time. | No more than 2 hours of disruption a month. |
| NFR-03 | The portal copes with seasonal sales. | 3 times the normal number of requests for 3 weeks, with no slowdown customers notice. |
| NFR-04 | Customer personal data is protected. | Only the customer and their branch's manager can see a request. |

---

# Summary

Customers request and follow refunds online; branch managers decide in one place; approved refunds are paid to the original card; customers hear about every step.

# UI/UX Expectations

- Error messages say what went wrong and what the user can do next.
- Amounts always show the currency.
- The customer screens work on phones and computers.

## Screens

| Screen ID | Screen | Use cases |
|-----------|--------|-----------|
| SCR-01 | Refund request form | UC-01 |
| SCR-02 | My refund requests (list and request detail) | UC-02, UC-03 |

The branch manager's decision screen has no screen ID yet; it is mockup MK-03 in the to-do (chunk 14).

---

# Appendix

| Reference | Description |
|-----------|-------------|
| Store refund policy v3 | The refund rules the branches follow today |

## Technical Inputs for the SDD

> Source technical mandates, parked verbatim for the SDD. Not BRD requirements.

| # | Source | Mandate (verbatim) |
|---|--------|--------------------|
| TI-01 | SoW section 4.2 | "Backend services must be built with Java 21 and Spring Boot." |
| TI-02 | SoW section 4.2 | "Use PostgreSQL for all data." |

# Wishlist

1. Refunds for online-shop purchases.

---

# Open Items & Clarifications

## Open Items

### OI-01: Partial refunds as a separate use case

- **Where:** 06b
- **Status:** Accepted - applied

## Resolution Log

| ID | Resolution Date | Resolved In | Outcome |
|----|-----------------|-------------|---------|
| OI-01 | 2026-09-21 | 06b UC-04 A1; 05 Use Case Summary (UC-05 merged into UC-04) | Accepted recommendation |

---

# Implementation Plan

**Status:** Up to date | **Basis:** BRD v1.0 (see [14-todo.md](./14-todo.md))

## Waves

| Task | Title | Type | Wave | Use cases | Depends on | Status basis |
|------|-------|------|------|-----------|------------|--------------|
| TASK-01 | Refund requests | Use-case delivery | 1 | UC-01 | None | Confirmed |
| TASK-02 | Request tracking and cancellation | Use-case delivery | 2 | UC-02, UC-03 | TASK-01 | Confirmed |
| TASK-03 | Refund decisions and payout | Use-case delivery | 2 | UC-04 | TASK-01 | Confirmed |

## Use-case coverage

Use cases: [06a](#use-cases---customer) (customer) and [06b](#use-cases---branch-manager) (branch manager). Assumptions: [02 / Assumptions](#assumptions--constraints). Acceptance cases: [16-uat-bat-test-cases.md](#refunds-portal---uatbat-test-cases).

| Use case | Tasks |
|----------|-------|
| [UC-01](#uc-01-request-a-refund) | TASK-01 |
| [UC-02](#uc-02-track-refund-status-web-and-mobile) | TASK-02 |
| [UC-03](#uc-03-cancel-a-refund-request) | TASK-02 |
| [UC-04](#uc-04-approve--reject-refund) | TASK-03 |

---

# Refunds Portal - UAT/BAT Test Cases

**Owner:** Product Team | **Prepared:** 2026-09-25 | **Baseline:** BRD v1.0 (all chunks) | **Design reference:** Figma - Refunds Portal UI/UX (3 screens, chunks 11 and 14)

**Suite status:** Up to date | **Gate verified:** 2026-09-25 (see [14-todo.md](./14-todo.md)) | **New items raised while writing this suite:** 0

**Scope note:** All cases run in the default scope. TC-DEC-04 needs the payment provider's sandbox to refuse a payout (P4).

## How to use this document

- **Testing Result** is filled during execution with one of: `Success`, `Failed`, `Blocked`, `Not Run`.
- Every test case traces to a use case (UC-NN) or NFR, and to the implementation task (TASK-NN) that delivers it ([15-implementation.md](#implementation-plan)).

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

<!--
CHUNK: 06a
TITLE: Detailed Use Cases - Customer
PROJECT: Refunds Portal
VERSION: 1.0
DEPENDS_ON: 04, 05
PART OF: BRD - Refunds Portal
SPLIT RULE: One chunk per persona (06a, 06b, ...), in the same persona order as chunk 05. UC IDs stay sequential across the whole BRD, not per chunk.
LANGUAGE: Business language only. Steps describe what the actor does and what the system does for them - never how the system is built. No technology names, protocols, or implementation terminology.
-->

# Detailed Use Cases - Customer

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

---

## UC-01: Request a Refund

| | |
|---|---|
| **Primary Actor** | Customer |
| **Supporting Actors** | None |
| **Goal** | Get money back for items bought in a branch. |
| **Trigger** | The customer is not happy with items they bought. |

### Why

Supports Business Objectives 1 and 2: every request is recorded at once and is never lost.

### Preconditions

- The purchase is within the 30-day refund window.

### Main Flow

1. The customer enters the receipt number.
2. The system shows the items on the receipt that can still be refunded.
3. The customer selects the items and a reason.
4. The system shows the refund amount.
5. The customer submits the request.
6. The system records the request as Submitted, gives it a reference number, and tells the customer by email and SMS.

### Alternate & Exception Flows

- **A1 - Some items already refunded:** At step 2, those items are shown but cannot be selected.
- **E1 - Refund window has passed:** At step 2, the system tells the customer the purchase is older than 30 days and that they can visit the branch.
- **E2 - Receipt not found:** At step 2, the system asks the customer to check the number and try again.

### Business Rules & Constraints

- A refund can be requested only within 30 days of purchase.
- An item can be refunded only once.

### Acceptance Criteria

- [ ] Given a purchase 10 days old, when the customer submits a request, then it is recorded as Submitted with a reference number.
- [ ] Given a purchase 31 days old, when the customer enters the receipt, then they are told the refund window has passed.

### Future Enhancements

- None identified at this time.

### UI/UX

Screen SCR-01 (refund request form). Figma: https://www.figma.com/proto/RFND01/refunds-portal?node-id=scr-01

---

## UC-02: Track Refund Status (Web and Mobile)

| | |
|---|---|
| **Primary Actor** | Customer |
| **Supporting Actors** | None |
| **Goal** | Know where each refund request stands. |
| **Trigger** | The customer wants an update. |

### Why

Supports Business Objective 2: customers can see their request at any time.

### Preconditions

- The customer has at least one refund request.

### Main Flow

1. The customer opens their refund requests.
2. The system lists each request with its reference number, amount, and status (Submitted, Approved, Rejected, Paid, Cancelled).
3. The customer opens one request.
4. The system shows its history with the date of each status change and, if it was rejected, the reason.

### Alternate & Exception Flows

- **A1 - No requests yet:** At step 2, the system says there are no refund requests.

### Business Rules & Constraints

- Customers see only their own requests.

### Acceptance Criteria

- [ ] Given an approved request, when the customer opens it, then they see Approved with the approval date.

### Future Enhancements

- Push notifications in the mobile app.

### UI/UX

Screen SCR-02 (my refund requests: list and request detail). Figma: https://www.figma.com/proto/RFND01/refunds-portal?node-id=scr-02

---

## UC-03: Cancel a Refund Request

| | |
|---|---|
| **Primary Actor** | Customer |
| **Supporting Actors** | None |
| **Goal** | Withdraw a request they no longer want. |
| **Trigger** | The customer changes their mind. |

### Why

Saves branch managers from deciding on requests customers no longer want.

### Preconditions

- The request is Submitted (not decided yet).

### Main Flow

1. The customer opens a Submitted request.
2. The customer chooses to cancel it.
3. The system asks the customer to confirm.
4. The customer confirms.
5. The system marks the request Cancelled and tells the customer by email.

### Alternate & Exception Flows

- **E1 - Already decided:** At step 2, if the branch manager has decided in the meantime, the system says the request can no longer be cancelled.

### Business Rules & Constraints

- Only Submitted requests can be cancelled.

### Acceptance Criteria

- [ ] Given a Submitted request, when the customer confirms the cancellation, then it becomes Cancelled.

### Future Enhancements

- None identified at this time.

### UI/UX

Screen SCR-02 (the cancel action on the request detail). Figma: https://www.figma.com/proto/RFND01/refunds-portal?node-id=scr-02

---

<!-- MASTER: refunds-portal-brd-master.md | PREV: 05-user-journeys-overview.md | NEXT: 06b-use-cases-branch-manager.md -->

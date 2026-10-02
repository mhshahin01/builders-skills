<!--
CHUNK: 06b
TITLE: Detailed Use Cases - Branch Manager
PROJECT: Refunds Portal
VERSION: 1.1
DEPENDS_ON: 04, 05
PART OF: BRD - Refunds Portal
-->

# Detailed Use Cases - Branch Manager

---

## UC-04: Approve / Reject Refund

| | |
|---|---|
| **Primary Actor** | Branch Manager |
| **Supporting Actors** | Payment provider (external business party) |
| **Goal** | Decide on each refund request for the branch. |
| **Trigger** | A request for the branch is waiting for a decision. |

### Why

Supports Business Objectives 1 and 3.

### Preconditions

- The request is Submitted and belongs to the branch manager's branch.

### Main Flow

1. The branch manager opens the list of Submitted requests for their branch.
2. The system lists them, oldest first, with amount and reason.
3. The branch manager opens a request and chooses Approve.
4. The system asks the branch manager to confirm the refund amount.
5. The branch manager confirms.
6. The system marks the request Approved and sends the payout to the customer's original card.
7. When the payment provider accepts the payout, the system marks the request Paid and tells the customer by email and SMS, with the payout reference and that the money can take some days to appear on their card.

### Alternate & Exception Flows

- **A1 - Partial approval:** At step 4, the branch manager lowers the amount and gives a reason; the rest of the flow continues with the lower amount.
- **A2 - Reject:** At step 3, the branch manager chooses Reject and gives a reason; the system marks the request Rejected and tells the customer the reason.
- **E1 - Payout fails:** At step 7, if the payment provider refuses the payout, the request stays Approved and the system tries again. If it still fails one day after the approval, the branch manager is told, and the customer is told by email and SMS that the payout is delayed and that the system keeps trying.

### Business Rules & Constraints

- **BR-1:** Branch managers decide only on requests of their own branch.
- **BR-2:** A partial refund amount must be more than 0 and less than the requested amount.
- **BR-3:** A rejection always has a reason.
- **BR-4:** A branch manager never decides on a refund request they made as a customer.

### Acceptance Criteria

- [ ] **AC-1:** Given a Submitted request, when the branch manager approves it, then the payout is sent and the customer is told.
- [ ] **AC-2:** Given a payout that still fails one day after the approval, then the branch manager is told, and the customer is told that the payout is delayed.

### Future Enhancements

- Bulk approval of small refunds (12 Wishlist, with its owner and decision point).

### UI/UX

Screen SCR-03 (branch manager decision screen; mockup MK-03). Figma: https://www.figma.com/proto/RFND01/refunds-portal?node-id=mk-03

---

## UC-06: View Branch Refund Report

| | |
|---|---|
| **Primary Actor** | Branch Manager |
| **Supporting Actors** | None |
| **Goal** | See how the branch's refunds went on a given day. |
| **Trigger** | The branch manager wants to check the branch's refunds for a day. |

### Why

Supports Business Objectives 1 and 3: the branch manager sees how long decisions take and what was paid (09 Branch refund report).

### Preconditions

- The branch manager is signed in.

### Main Flow

1. The branch manager opens the refund report for their branch.
2. The branch manager chooses a day.
3. The system shows, for that day: the requests submitted that day, counted by their current status; the amount paid that day; and the average time to decision of the requests decided that day.

### Alternate & Exception Flows

- **A1 - No refund activity that day:** At step 3, the system shows zero requests, 0 paid, and no average time to decision.

### Business Rules & Constraints

- **BR-1:** Branch managers see only their own branch's report.
- **BR-2:** A day is a calendar day in the branch's local time.
- **BR-3:** The report is opened on demand for one day at a time; it is not sent to the branch manager.

### Acceptance Criteria

- [ ] **AC-1:** Given a day on which 3 requests were submitted (1 still Submitted, 2 now Approved), 50.00 EUR was paid, and 2 requests were decided after 1 and 3 days, when the branch manager opens that day, then they see Submitted 1 and Approved 2, 50.00 EUR paid, and an average time to decision of 2 days.
- [ ] **AC-2:** Given a day with no refund activity, when the branch manager opens that day, then they see zero requests, 0 paid, and no average time to decision.

### Future Enhancements

- None identified at this time.

### UI/UX

Screen SCR-04 (branch refund report). No mockup yet (14 / Step 4).

<!-- MASTER: refunds-portal-brd-master.md | PREV: 06a-use-cases-customer.md | NEXT: 07-users-use-cases-matrix.md -->

<!--
CHUNK: 06b
TITLE: Detailed Use Cases - Branch Manager
PROJECT: Refunds Portal
VERSION: 1.0
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
7. When the payout succeeds, the system marks the request Paid and tells the customer by email and SMS.

### Alternate & Exception Flows

- **A1 - Partial approval:** At step 4, the branch manager lowers the amount and gives a reason; the rest of the flow continues with the lower amount.
- **A2 - Reject:** At step 3, the branch manager chooses Reject and gives a reason; the system marks the request Rejected and tells the customer the reason.
- **E1 - Payout fails:** At step 7, if the payment provider refuses the payout, the request stays Approved, the system tries again, and the branch manager is told if it still fails after one day.

### Business Rules & Constraints

- Branch managers decide only on requests of their own branch.
- A partial refund amount must be more than 0 and less than the requested amount.
- A rejection always has a reason.

### Acceptance Criteria

- [ ] Given a Submitted request, when the branch manager approves it, then the payout is sent and the customer is told.
- [ ] Given a payout that still fails after one day, then the branch manager is told.

### Future Enhancements

- Bulk approval of small refunds.

### UI/UX

Mockup MK-03 (decision screen; no screen ID in chunk 11 yet). Figma: https://www.figma.com/proto/RFND01/refunds-portal?node-id=mk-03

<!-- MASTER: refunds-portal-brd-master.md | PREV: 06a-use-cases-customer.md | NEXT: 07-users-use-cases-matrix.md -->

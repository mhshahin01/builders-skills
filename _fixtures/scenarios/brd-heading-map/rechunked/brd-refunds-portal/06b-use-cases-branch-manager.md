<!--
CHUNK: 06b
TITLE: Detailed Use Cases - Branch Manager
PROJECT: Refunds Portal
VERSION: 1.0
DEPENDS_ON: 04, 05
PART OF: BRD - Refunds Portal
SPLIT RULE: One chunk per persona (06a, 06b, ...), in the same persona order as chunk 05. UC IDs stay sequential across the whole BRD, not per chunk.
LANGUAGE: Business language only. Steps describe what the actor does and what the system does for them - never how the system is built. No technology names, protocols, or implementation terminology.
-->

# Detailed Use Cases - Branch Manager

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

---

<!-- MASTER: refunds-portal-brd-master.md | PREV: 06a-use-cases-customer.md | NEXT: 07-users-use-cases-matrix.md -->

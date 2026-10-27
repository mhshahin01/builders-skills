<!--
CHUNK: 06b
TITLE: Detailed Use Cases - Branch Manager
PROJECT: Refunds Portal
VERSION: 1.5
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
- **Flowchart** (branching use cases only, added once the requirements are final): The main, alternate, and exception paths in one diagram (or in connected numbered views for a large use case), derived from the narrative.
- **Business Rules & Constraints**: Rules, limits, and conditions that govern the use case.
- **Acceptance Criteria**: Testable conditions that confirm the use case is complete.
- **Future Enhancements**: Low-complexity follow-ups that could ship next.
- **UI/UX**: Wireframes or references to approved Figma designs.

---

## UC-04: Approve / Reject Refund

| | |
|---|---|
| **Primary Actor** | Branch Manager |
| **Supporting Actors** | External: Payment Provider ([08](./08-integrations.md)); External: Loyalty Points ([08](./08-integrations.md)) |
| **Goal** | Decide on each refund request for the branch. |
| **Trigger** | A request for the branch is waiting for a decision. |

### Why

Supports Business Objectives 1 and 3.

### Preconditions

- The request is Submitted and belongs to the branch manager's branch.

### Main Flow

1. The branch manager opens the list of Submitted requests for their branch.
2. The system lists them, oldest first, with amount and reason. Requests that have waited longer than the decision time are marked as late.
3. The branch manager opens a request.
4. The system shows the receipt number, the purchase date, the items requested with their amounts, the total requested amount and the customer's reason.
5. The branch manager chooses Approve.
6. The system asks the branch manager to confirm the refund amount.
7. The branch manager confirms.
8. The system marks the request Approved, tells the customer by email and SMS, and sends the payout to the customer's original card.
9. When the payout succeeds, the system marks the request Paid and tells the customer by email and SMS.

### Alternate & Exception Flows

- **A1 - Partial approval:** At step 6, the branch manager lowers the amount of one or more items and gives a reason. The approved amount is the sum of the item amounts. The rest of the flow continues with the approved amount. The customer is told the approved amount and the reason.
- **A2 - Reject:** At step 5, the branch manager chooses Reject and gives a reason; the system marks the request Rejected and tells the customer the reason by email and SMS.
- **E1 - Payout fails:** At step 9, the payment provider refuses the payout, or the customer's bank sends back a payout after the request is Paid. The request stays Approved, or goes back to Approved if it was Paid. The system tries again. The customer is told the payout is delayed. If the payout still fails after one day, the system tells the branch manager. This message is for information only: the branch manager has no action to take in the portal. **[NEEDS CLARIFICATION: How long does the system keep trying a failed payout before it stops?]** **[NEEDS CLARIFICATION: How is a customer paid when the payout to their original card can never succeed, for example because the card is closed?]**
- **E2 - Cancelled in the meantime:** At step 7, if the customer has cancelled the request, the system tells the branch manager the request was cancelled and records no decision.
- **E3 - Original payment disputed:** At step 4, the system also shows that the customer has disputed the original card payment with their bank. If the branch manager approves, the payout waits as BR-8 says.

### Business Rules & Constraints

- Own branch only: see [03 / Branch ownership](./03-definitions-and-domain-concepts.md#branch-ownership).
- A lowered item amount must be more than 0 and less than that item's requested amount. Once the request is Paid, an item whose amount was not lowered is refunded in full, and a lowered item is partly refunded ([06a / UC-01 BR-7](./06a-use-cases-customer.md#uc-01-request-a-refund)).
- A rejection always has a reason.
- **[NEEDS CLARIFICATION: Must the branch manager also see the customer's earlier refund requests when deciding?]**
- A branch manager decides on a Submitted request within **[NEEDS CLARIFICATION: Within how many days must a branch manager decide on a Submitted request?]**.
- A branch manager cannot decide on a refund request they submitted as a customer. **[NEEDS CLARIFICATION: Who decides on a refund request that a branch manager submits for a purchase at their own branch?]**
- **[NEEDS CLARIFICATION: Above which refund amount, if any, must a second person also approve a refund?]** **[NEEDS CLARIFICATION: If a second approval is required, who provides it, for example an area manager?]**
- If the customer has disputed the original card payment with their bank, the payout waits until the bank decides the dispute. If the bank gives the money back to the customer, the system marks the request Rejected with the reason that the bank has already refunded the payment. If the bank refuses the dispute, the system sends the payout.
- When a request becomes Paid or Rejected, or goes back to Approved after a Paid payout is sent back, the system tells Loyalty Points the outcome ([08 / Loyalty Points](./08-integrations.md)). Before Loyalty Points starts, the system keeps the outcome and sends it when Loyalty Points starts ([04 / Project Scope](./04-scope-and-personas.md#project-scope)).

### Acceptance Criteria

- [ ] Given a Submitted request with no card dispute, when the branch manager approves it, then the payout is sent, and when it succeeds the request is Paid and the customer is told by email and SMS.
- [ ] Given a payout that still fails after one day, then the branch manager is told.
- [ ] Given a request the customer cancels while the branch manager has it open, when the branch manager confirms, then no decision is recorded and no payout is sent.
- [ ] Given a request the branch manager submitted as a customer, when the branch manager opens it, then they cannot approve or reject it.
- [ ] Given an approved request, then the decision record shows the branch manager who approved it, the date and time, and the amount.
- [ ] Given a Submitted request, when the branch manager lowers the amount and gives a reason, then the request is approved for the lower amount and the customer is told the approved amount and the reason.
- [ ] Given a Submitted request, when the branch manager rejects it with a reason, then it is recorded as Rejected and the customer is told the reason by email and SMS.
- [ ] Given a payout the payment provider refuses, then the request stays Approved and the customer is told the payout is delayed.
- [ ] Given a request for two items, when the branch manager lowers the amount of one item, then the approved amount is the full amount of the other item plus the lowered amount.
- [ ] Given a Submitted request, when the branch manager approves it in full, then the customer is told by email and SMS that it is approved, with the approved amount, before it is Paid.
- [ ] Given a Paid request whose payout the customer's bank sends back, then the request goes back to Approved and the customer is told the payout is delayed.
- [ ] Given a request whose original card payment the customer has disputed, when the branch manager approves it, then no payout is sent until the bank decides the dispute.
- [ ] Given a disputed card payment that the bank gives back to the customer, then the request is Rejected and the customer is told the reason by email and SMS.
- [ ] Given a request that becomes Paid or Rejected, or goes back to Approved, then Loyalty Points is told the outcome.
- [ ] Given a request whose original card payment the customer has disputed, when the branch manager opens it, then the dispute is shown.
- [ ] Given a disputed card payment whose dispute the bank refuses, then the payout is sent.
- [ ] Given a request that becomes Paid or Rejected, or goes back to Approved, before Loyalty Points starts, then the outcome is kept, and Loyalty Points is told it when Loyalty Points starts.

### Future Enhancements

- Bulk approval of small refunds.

### UI/UX

Mockup MK-03 (decision screen; no screen ID in chunk 11 yet). Figma: https://www.figma.com/proto/RFND01/refunds-portal?node-id=mk-03

<!-- MASTER: refunds-portal-brd-master.md | PREV: 06a-use-cases-customer.md | NEXT: 07-users-use-cases-matrix.md -->

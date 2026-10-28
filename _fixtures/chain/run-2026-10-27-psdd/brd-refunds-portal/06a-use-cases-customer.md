<!--
CHUNK: 06a
TITLE: Detailed Use Cases - Customer
PROJECT: Refunds Portal
VERSION: 1.5
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
- **Flowchart** (branching use cases only, added once the requirements are final): The main, alternate, and exception paths in one diagram (or in connected numbered views for a large use case), derived from the narrative.
- **Business Rules & Constraints**: Rules, limits, and conditions that govern the use case.
- **Acceptance Criteria**: Testable conditions that confirm the use case is complete.
- **Future Enhancements**: Low-complexity follow-ups that could ship next.
- **UI/UX**: Wireframes or references to approved Figma designs.

---

## UC-01: Request a Refund

| | |
|---|---|
| **Primary Actor** | Customer |
| **Supporting Actors** | External: Point-of-Sale Records ([08](./08-integrations.md)) |
| **Goal** | Get money back for items bought in a branch. |
| **Trigger** | The customer is not happy with items they bought. |

### Why

Supports Business Objectives 1 and 2: every request is recorded at once and is never lost.

### Preconditions

- The customer has proved who they are ([03 / Customer identity](./03-definitions-and-domain-concepts.md#customer-identity)).
- The customer has a receipt number from a branch purchase.

### Main Flow

1. The customer enters the receipt number.
2. The system shows the items on the receipt that can still be refunded.
3. The customer selects the items and a reason.
4. The system shows the refund amount.
5. The customer enters their email address and mobile number.
6. The customer submits the request.
7. The system records the request as Submitted, shows the reference number on screen, and tells the customer by email and SMS.

### Alternate & Exception Flows

- **A1 - Some items already requested or refunded:** At step 2, items that BR-2 blocks are shown but cannot be selected.
- **A2 - Item cannot be refunded:** At step 2, the item is shown with the reason it cannot be refunded, and it cannot be selected.
- **E1 - Refund window has passed:** At step 2, the system tells the customer the purchase is older than 30 days and that they can visit the branch.
- **E2 - Receipt not found:** At step 2, the system asks the customer to check the number and try again.
- **E3 - Contact details not valid:** At step 5, the system asks the customer to correct the email address or mobile number.
- **E4 - Purchase not paid by card:** At step 2, the system tells the customer this purchase cannot be refunded online and that they can visit the branch.
- **E5 - Receipts cannot be checked right now:** At step 2, if Point-of-Sale Records cannot be reached, the system tells the customer it cannot check receipts at the moment and asks them to try again later. It does not say the receipt number is wrong.
- **E6 - Branch not using the portal yet:** At step 2, if the purchase was made at a branch that has not started using the portal, the system tells the customer to ask for the refund at that branch.

### Business Rules & Constraints

- A refund can be requested only within 30 days of purchase.
- An item cannot be put on a new refund request while it is on a request that is Submitted or Approved, or after it has been refunded in full. When a request is Cancelled, its items can be requested again within the refund window. Items on a Rejected request follow the answer to BR-6, and the rest of a partly refunded item follows the answer to BR-7. Each unit counts as one item: a customer who bought 3 of the same product can request a refund for 1, 2 or 3 of them.
- Items that can never be refunded cannot be selected. **[NEEDS CLARIFICATION: Which items or item types can never be refunded under store refund policy v3?]**
- **[NEEDS CLARIFICATION: Must the customer give both an email address and a mobile number, or is one of them enough?]**
- A refund can be requested online only for a purchase paid by card. **[NEEDS CLARIFICATION: How is a purchase paid partly by card and partly another way refunded: only the card part online, or not online at all?]**
- **[NEEDS CLARIFICATION: Can a customer request a refund again for an item whose earlier request was Rejected?]**
- **[NEEDS CLARIFICATION: After a partial refund, can the customer request a refund for the rest of the item's amount?]**
- **[NEEDS CLARIFICATION: Does any consumer law give customers refund rights that differ from the 30-day refund window?]**
- **[NEEDS CLARIFICATION: Do purchases made in some periods (for example the seasonal sales) or some item types have a refund window other than 30 days?]**
- **[NEEDS CLARIFICATION: Must the customer pick the reason from a list that separates a change of mind from a faulty item?]** **[NEEDS CLARIFICATION: Does a faulty item follow a different refund window?]** **[NEEDS CLARIFICATION: Does a faulty item require a different remedy, for example repair or replacement?]**

### Acceptance Criteria

- [ ] Given a purchase 10 days old, when the customer submits a request, then it is recorded as Submitted with a reference number.
- [ ] Given a purchase 31 days old, when the customer enters the receipt, then they are told the refund window has passed.
- [ ] Given Point-of-Sale Records cannot be reached, when the customer enters a valid receipt number, then they are asked to try again later and are not told the number is wrong.
- [ ] Given messages cannot be sent, when the customer submits a request, then it is still recorded as Submitted and the reference number is shown on screen.
- [ ] Given an item that BR-2 blocks, when the customer enters the receipt, then the item is shown but cannot be selected.
- [ ] Given an item that can never be refunded, when the customer enters the receipt, then the item is shown with the reason and cannot be selected.
- [ ] Given a receipt number that does not exist, when the customer enters it, then they are asked to check the number and try again.
- [ ] Given an email address or mobile number that is not valid, when the customer enters it, then they are asked to correct it.
- [ ] Given a purchase not paid by card, when the customer enters the receipt, then they are told it cannot be refunded online and that they can visit the branch.
- [ ] Given a purchase made at a branch that has not started using the portal, when the customer enters the receipt, then they are told to ask for the refund at that branch.

### Future Enhancements

- None identified at this time.

### UI/UX

Mockup MK-01 (screen SCR-01, refund request form). Figma: https://www.figma.com/proto/RFND01/refunds-portal?node-id=scr-01

---

## UC-02: Track Refund Status

| | |
|---|---|
| **Primary Actor** | Customer |
| **Supporting Actors** | None |
| **Goal** | Know where each refund request stands. |
| **Trigger** | The customer wants an update. |

### Why

Supports Business Objective 2: customers can see their request at any time.

### Preconditions

- The customer has proved who they are ([03 / Customer identity](./03-definitions-and-domain-concepts.md#customer-identity)).

### Main Flow

1. The customer opens their refund requests.
2. The system lists each request with its reference number, amount, and status (Submitted, Approved, Rejected, Paid, Cancelled).
3. The customer opens one request.
4. The system shows its history with the date of each status change, the requested and approved amounts, and the reason for a rejection or a partial approval.

### Alternate & Exception Flows

- **A1 - No requests yet:** At step 2, the system says there are no refund requests.

### Business Rules & Constraints

- Own requests only: see [03 / Customer identity](./03-definitions-and-domain-concepts.md#customer-identity).
- A customer sees their requests for as long as [NFR-06](./10-nfrs.md#non-functional-requirements) keeps them.

### Acceptance Criteria

- [ ] Given an approved request, when the customer opens it, then they see Approved with the approval date.
- [ ] Given a partially approved request, when the customer opens it, then they see the requested amount, the approved amount and the reason.
- [ ] Given a customer with no refund requests, when they open their refund requests, then they are told there are none.

### Future Enhancements

- None identified at this time.

### UI/UX

Mockup MK-02 (screen SCR-02, my refund requests: list and request detail). Figma: https://www.figma.com/proto/RFND01/refunds-portal?node-id=scr-02

---

## UC-03: Cancel a Refund Request

| | |
|---|---|
| **Primary Actor** | Customer |
| **Supporting Actors** | External: Loyalty Points ([08](./08-integrations.md)) |
| **Goal** | Withdraw a request they no longer want. |
| **Trigger** | The customer changes their mind. |

### Why

Saves branch managers from deciding on requests customers no longer want.

### Preconditions

- The customer has proved who they are ([03 / Customer identity](./03-definitions-and-domain-concepts.md#customer-identity)).
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
- Own requests only: see [03 / Customer identity](./03-definitions-and-domain-concepts.md#customer-identity).
- When a request is Cancelled, the system tells Loyalty Points the outcome ([08 / Loyalty Points](./08-integrations.md)). Before Loyalty Points starts, the system keeps the outcome and sends it when Loyalty Points starts ([04 / Project Scope](./04-scope-and-personas.md#project-scope)).

### Acceptance Criteria

- [ ] Given a Submitted request, when the customer confirms the cancellation, then it becomes Cancelled.
- [ ] Given a request the branch manager has decided, when the customer chooses to cancel it, then they are told it can no longer be cancelled.
- [ ] Given a request the customer cancels, then Loyalty Points is told the outcome.
- [ ] Given a request the customer cancels before Loyalty Points starts, then the outcome is kept, and Loyalty Points is told it when Loyalty Points starts.

### Future Enhancements

- None identified at this time.

### UI/UX

Mockup MK-02 (screen SCR-02, the cancel action on the request detail). Figma: https://www.figma.com/proto/RFND01/refunds-portal?node-id=scr-02

<!-- MASTER: refunds-portal-brd-master.md | PREV: 05-user-journeys-overview.md | NEXT: 06b-use-cases-branch-manager.md -->

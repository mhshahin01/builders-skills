<!--
CHUNK: 05
TITLE: System Design - Workflow & Sequence Diagrams
PROJECT: Refunds Platform
VERSION: 1.3
DEPENDS_ON: 04
PART OF: SDD - Refunds Platform
-->

## 8.4 Workflow Diagrams

<!-- This chunk continues the System Design section from chunk 04 (Architecture Style & Diagrams). -->

### 8.4.1 Workflow: Refund request lifecycle

**Use cases:** [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund), [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request), [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)

**Figure 4: Refund request lifecycle**

```mermaid
flowchart TD
  A["Customer submits request (REFUNDS/UC-01)"] --> B["refund-request records Submitted and publishes RefundRequestSubmitted"]
  B --> C{"Next action on a Submitted request"}
  C -- "Customer cancels (REFUNDS/UC-03)" --> D["Cancelled, publishes RefundRequestCancelled"]
  C -- "Branch Manager rejects (REFUNDS/UC-04 A2)" --> E["Rejected, publishes RefundRequestRejected"]
  C -- "Branch Manager approves in full or in part (REFUNDS/UC-04)" --> F["Approved, publishes RefundRequestApproved"]
  F --> G["payout sends the payout (§8.4.2)"]
  G --> H["PayoutSucceeded handled: Paid, publishes RefundRequestPaid"]
  G -- "Bank refunded the disputed payment (REFUNDS/UC-04 BR-8)" --> R["PayoutCancelled handled: Rejected, publishes RefundRequestRejected"]
  H -- "Bank sends the payout back (REFUNDS/UC-04 E1)" --> B2["PayoutReturned handled: back to Approved, publishes RefundRequestPayoutReturned"]
  B2 --> G
  D & E & F & H & R & B2 --> N["customer-notification sends the customer message"]
  D & E & H & R & B2 --> L["loyalty-points records the outcome"]
```

**Summary:** A Submitted request ends Cancelled (customer), Rejected (branch manager), or Approved; an approved request becomes Paid when `payout` reports success, becomes Rejected when the customer's bank has refunded a disputed card payment, and a Paid request goes back to Approved when the bank sends the payout back. Every status change publishes one in-process domain event, `customer-notification` sends the message REFUNDS 03 sets for it, and `loyalty-points` is told every outcome REFUNDS 08 names.

### 8.4.2 Workflow: Payout with retries

**Use cases:** [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)

**Figure 5: Payout with retries**

```mermaid
flowchart TD
  A["RefundRequestApproved handled by payout"] --> B["Create one payout for the refund request"]
  B --> HD{"Card dispute open on the original payment, read before every attempt (API-09)"}
  HD -- "Yes" --> HL["Payout Held until the bank decides"]
  HL -- "Bank refused the dispute" --> C
  HL -- "Bank refunded the customer" --> X["Payout Cancelled, publish PayoutCancelled"]
  HD -- "Dispute already refunded to the customer" --> X
  HD -- "No" --> C["Send attempt to CardPay with the round idempotency key (API-01)"]
  C --> D{"Result (API-01 response or API-02 callback)"}
  D -- "Succeeded" --> E["Payout Succeeded, publish PayoutSucceeded"]
  E -- "Bank sends the payout back" --> RT["New round with a new key, publish PayoutReturned"]
  RT --> HD
  D -- "Refused or no answer" --> F["Publish PayoutAttemptFailed on the first failure of the first round"]
  F --> G["Schedule payout-retry queues the next attempt with backoff"]
  G --> H{"Still failing one day after the round first attempt"}
  H -- "Yes, first time in the round" --> I["Publish PayoutStillFailing"]
  H -- "No" --> HD
  I --> J{"Retry stop time reached"}
  J -- "No" --> HD
  J -- "Yes" --> K["Payout Stopped, alert operations"]
```

**Summary:** `payout` creates exactly one payout per approved refund request, reads the original card payment's disputes before every attempt, holds the payout while one is open, and sends attempts to CardPay with the same idempotency key per round until one succeeds; a dispute the bank refunds to the customer cancels a payout that has not paid, and a payout the customer's bank sends back starts a new round with a new key. The first failure tells the customer the payout is delayed, a payout still failing one day after its round's first attempt tells the branch manager, and the retry stop time and the never-succeeds path are open (§17.2).

### 8.4.3 Workflow: Points take-back after a paid refund

**Use cases:** [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history), [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)

**Figure 6: Points take-back after a paid refund**

```mermaid
flowchart TD
  A["RefundRequestPaid handled by loyalty-points"] --> O{"Older than an outcome already recorded for the request (sequence)"}
  O -- "Yes" --> Z4["Recorded in the refund-outcome log, no effect"]
  O -- "No" --> B{"Refund already processed (inbox key)"}
  B -- "Yes" --> Z["No-op"]
  B -- "No" --> S{"Paid before the refund-reporting start date"}
  S -- "Yes" --> Z2
  S -- "No" --> C{"Matching purchase found"}
  C -- "No purchase yet" --> P["Park the take-back until the purchase earns points"]
  P -- "BR-5 wait passes first" --> Z3["loyalty-retention-purge ends it, no movement"]
  C -- "Purchase earned no points" --> Z2["Record refund as processed, no movement"]
  C -- "Earned points" --> D{"Member still in the program"}
  D -- "No" --> Z2
  D -- "Yes" --> E["Take back 1 point per 1 EUR refunded, capped at the points the purchase earned"]
  E --> F["Write taken-back movement dated with the refund paid date"]
  P -- "Purchase arrives and earns points" --> E
```

**Summary:** `loyalty-points` ignores a Paid outcome older than one already recorded for the request, handles each paid refund once, matches it to the purchase that earned points, and writes a taken-back movement of 1 point per 1 EUR refunded, capped at what the purchase earned; a refund paid before its purchase earns points waits and is applied when the purchase arrives, or ends with no movement when the wait of BR-5 passes first, and a refund paid before the refund-reporting start date takes back nothing (§17.4 Take-back). The rules are those of [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-1: paid refund takes points back, BR-3: once per paid refund, BR-4: only purchases that earned points, BR-5: refund paid before earning, BR-6: take-back never exceeds earned, and BR-7: only refunds the Refunds Portal reports; how the purchase is matched is open (§5).

### 8.4.4 Workflow: Earning points from POS purchases

**Use cases:** None - platform flow

**Figure 7: Earning points from POS purchases**

```mermaid
flowchart TD
  A["POS Records delivers a member purchase (API-05)"] --> B{"Purchase reference already received"}
  B -- "Yes" --> Z["No-op"]
  B -- "No" --> C{"Purchase date on or after the start of points and member still in the program"}
  C -- "No" --> Z2["Record purchase, no movement"]
  C -- "Yes" --> D["Write earned movement per the earning rule, dated with the purchase date"]
  D --> E{"Parked take-back for this purchase"}
  E -- "Yes" --> F["Apply the take-back (§8.4.3)"]
  E -- "No" --> G["Done"]
```

**Summary:** Each member purchase from POS Records is recorded once; a purchase on or after the start of points earns points per [LOYALTY 03 § Earning points](../brd-loyalty-points/03-definitions-and-domain-concepts.md#earning-points) as a movement dated with the purchase date, and a parked take-back for it is then applied. How POS Records delivers purchases is open (§17.4 Input).

## 8.5 Sequence Diagrams

### 8.5.1 Sequence: Submit a refund request

**Use cases:** [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund)

**Figure 8: Submit a refund request**

```mermaid
sequenceDiagram
  participant C as Customer web app
  participant RR as refund-request
  participant POS as Point-of-Sale Records
  participant CN as customer-notification
  participant MSG as MsgHub
  C->>RR: GET /v1/receipts/{receiptNumber}/refundable-items
  RR->>POS: receipt lookup (API-04)
  POS-->>RR: receipt, items, payment details
  RR-->>C: items with refundable flag and reason
  C->>RR: POST /v1/refund-requests
  RR->>RR: record Submitted, decision record row, publication log entry
  RR-->>C: 201 with reference number
  RR-)CN: RefundRequestSubmitted
  CN->>RR: CustomerContactPort.getCustomerContact (API-06)
  RR-->>CN: email and mobile number
  CN->>MSG: send email and SMS (API-03)
  alt POS Records unreachable
    RR-->>C: 503 try again later (REFUNDS/UC-01 E5)
  end
```

**Summary:** The customer's receipt lookup goes to Point-of-Sale Records through API-04, and submission records the request and its domain event in one transaction before the reference number is returned. `customer-notification` handles `RefundRequestSubmitted` after commit, reads the contact details through API-06, and sends the email and SMS through API-03; a message failure never affects the request.

### 8.5.2 Sequence: Decide and pay out a refund

**Use cases:** [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)

**Figure 9: Decide and pay out a refund**

```mermaid
sequenceDiagram
  participant BMW as Branch manager web app
  participant RR as refund-request
  participant PO as payout
  participant CARD as CardPay Ltd
  participant CN as customer-notification
  BMW->>RR: POST /v1/refund-requests/{refundRequestId}/decision
  RR->>RR: Approved, decision record row, publication log entry
  RR-->>BMW: 200 Approved
  RR-)PO: RefundRequestApproved
  RR-)CN: RefundRequestApproved
  PO->>CARD: payout request with idempotency key (API-01)
  CARD-->>PO: accepted or result
  CARD->>PO: payout result callback (API-02, if CardPay calls back)
  PO-)RR: PayoutSucceeded
  RR->>RR: Paid, decision record row
  RR-)CN: RefundRequestPaid
  alt payout refused
    PO-)CN: PayoutAttemptFailed
    PO-)CN: PayoutStillFailing after one day
  end
  alt card dispute open on the original payment
    PO->>PO: payout Held until the bank decides (API-09)
    PO-)RR: PayoutCancelled if the bank refunded the customer
    RR-)CN: RefundRequestRejected
  end
  alt payout sent back by the customer bank
    PO-)RR: PayoutReturned
    RR-)CN: RefundRequestPayoutReturned
    PO->>CARD: new round with a new idempotency key (API-01)
  end
```

**Summary:** The branch manager's approval commits the Approved status and `RefundRequestApproved`, which `payout` turns into one CardPay payout and `customer-notification` into the approval message: partial when a unit was lowered, full otherwise. A succeeded payout makes `refund-request` mark the request Paid and publish `RefundRequestPaid`; a refused payout publishes the delay and still-failing events. A payout whose original card payment has an open dispute is held until the bank decides, and is cancelled, with the request Rejected, when the bank refunds the customer; a Paid payout the customer's bank sends back puts the request back to Approved and is paid again in a new round. Whether CardPay returns the result in the API-01 response or through the API-02 callback, and how it reports disputes and payouts sent back, is open (§17.2).

### 8.5.3 Sequence: Take back points for a paid refund

**Use cases:** [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history), [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)

**Figure 10: Take back points for a paid refund**

```mermaid
sequenceDiagram
  participant RR as refund-request
  participant PL as Publication log
  participant LP as loyalty-points
  RR->>PL: RefundRequestPaid recorded in the Paid transaction
  PL-)LP: RefundRequestPaid after commit
  LP->>LP: sequence check, inbox check on refund reference, refund-reporting start date
  LP->>LP: match purchase, cap, write taken-back movement
  LP-->>PL: listener completed
  alt listener fails
    PL-)LP: redelivery until completed
  end
```

**Summary:** `RefundRequestPaid` is recorded in the publication log in the same transaction that marks the refund Paid, then delivered to `loyalty-points`, which ignores it if it is older than an outcome already recorded for the request, and otherwise applies the take-back once per refund reference, unless the refund was paid before the refund-reporting start date, and marks its listener completed; a failed listener is redelivered until it completes, within the LOYALTY/NFR-02 budget (§18.5).

### 8.5.4 Sequence: View own refund requests and points

**Use cases:** [REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status), [LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance), [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history)

**Figure 11: View own refund requests and points**

```mermaid
sequenceDiagram
  participant W as Web app
  participant IAM as Platform IAM
  participant RR as refund-request
  participant LP as loyalty-points
  W->>IAM: OIDC sign-in
  IAM-->>W: access token
  W->>RR: GET /v1/refund-requests
  RR->>RR: check refund.request.read-own, filter by caller
  RR-->>W: own requests with status
  W->>LP: GET /v1/members/me/points-balance
  LP->>LP: check loyalty.points.read-own, filter by member
  LP-->>W: balance, last movement date, timing note
  W->>LP: GET /v1/members/me/points-movements
  LP-->>W: movements newest first
  alt store unavailable
    LP-->>W: 503 try again later, never an empty list or 0
  end
```

**Summary:** After the OIDC sign-in, each read call carries the access token; `refund-request` and `loyalty-points` check the permission token and filter by the signed-in caller, so a caller only ever sees their own requests and points. When the data cannot be read, the API returns an error and never an empty list or a zero balance ([LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance) E1, [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) E1).

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 04-architecture-style-and-diagrams.md | NEXT: 06-principles-and-decisions.md -->

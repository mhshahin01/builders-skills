<!--
CHUNK: 05
TITLE: System Design - Workflow & Sequence Diagrams
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: 04
PART OF: SDD - Refunds Platform
-->

## 8.4 Workflow Diagrams

<!-- This chunk continues the System Design section from chunk 04 (Architecture Style & Diagrams). Event names are the §14.10 registry's; API IDs are §15.2's. -->

### 8.4.1 Workflow: Refund request lifecycle

**Use cases:** [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund), [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request), [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)

```mermaid
flowchart TD
  A["Customer enters receipt number"] --> B{"Receipt lookup API-01"}
  B -- "found, refundable items" --> C["Customer selects items, reason, contact details"]
  B -- "unreachable" --> X1["Try again later - E5"]
  C --> D["Submitted: request, items, decision-record row, publication-log row in one transaction"]
  D --> E{"Branch manager decides"}
  D --> F["Customer cancels while Submitted"]
  F --> G["Cancelled"]
  E -- "approve in full or in part" --> H["Approved: payout requested"]
  E -- "reject with reason" --> I["Rejected"]
  H --> J{"Payout result"}
  J -- "succeeded" --> K["Paid"]
  J -- "refused" --> H
  J -- "dispute refunded by bank" --> I
  K -- "payout sent back" --> H
```

**Summary:** A refund request starts with a receipt lookup, is recorded as Submitted with its decision-record row in one transaction, and is cancelled by the customer or decided by the branch manager; an approved request becomes Paid when its payout succeeds, stays Approved while the payout is retried, becomes Rejected when the bank refunds a disputed payment, and goes back to Approved when a paid payout is sent back.

### 8.4.2 Workflow: Payout, retry, and card dispute

**Use cases:** [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)

```mermaid
flowchart TD
  A["RefundRequestApproved received"] --> B{"Open card dispute on the original payment?"}
  B -- "yes" --> C["Payout on hold until the bank decides"]
  C -- "bank refuses the dispute" --> D
  C -- "bank refunds the customer" --> R["CardDisputeDecided: refunded"]
  B -- "no" --> D["Outbox row: send payout API-04; same key after a timeout, next key generation after a refusal or a return"]
  D --> E{"Result via API-05"}
  E -- "accepted" --> F["PayoutSucceeded"]
  E -- "refused or sent back" --> G["PayoutFailed, schedule retry"]
  G --> H{"Still failing after one day?"}
  H -- "yes, first time" --> I["PayoutStillFailing to branch manager"]
  H -- "no" --> D
  I --> J{"Retry limit reached?"}
  J -- "no" --> D
  J -- "yes" --> K["Stopped: manual result by two payout staff"]
  K --> F
```

**Summary:** An approved refund's payout waits while the original card payment is disputed, is otherwise sent through the outbox with a key built from its own ID, and is retried with backoff when refused or sent back; after one day of failures the branch manager is told, and a payout that reaches the retry limit stops for a manual result recorded and confirmed by two payout staff members.

### 8.4.3 Workflow: Points earned and taken back

**Use cases:** [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history), [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request), [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)

```mermaid
flowchart TD
  A["Member purchase from the purchase feed API-08"] --> B{"Member still in the program and purchase on or after the start of points?"}
  B -- "yes" --> C["Earned movement, purchase date"]
  B -- "no" --> N["No movement"]
  D["Refund outcome event"] --> E{"Outcome"}
  E -- "Rejected or Cancelled" --> F["Recorded, no movement"]
  E -- "Returned to Approved" --> G["Recorded, no movement until LOYALTY states the rule"]
  E -- "Paid" --> H{"Purchase earned points?"}
  H -- "yes" --> I["Taken-back movement, refund paid date, capped at points earned"]
  H -- "not yet" --> J["Pending take-back, up to 30 days"]
  J -- "purchase earns its points" --> I
  J -- "30 days pass" --> N
```

**Summary:** A member purchase earns points as an earned movement; a paid refund takes points back once, capped at what its purchase earned, or waits up to 30 days for a purchase that has not earned yet; rejected, cancelled, and returned outcomes are recorded and add no movement.

## 8.5 Sequence Diagrams

### 8.5.1 Sequence: Submit a refund request

**Use cases:** [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund)

```mermaid
sequenceDiagram
  participant C as Customer browser
  participant RR as refund-request
  participant POS as Point-of-Sale Records
  participant DB as refund_request schema
  participant NT as notification
  participant MH as MsgHub
  C->>RR: GET /v1/receipts/{receiptNumber}/refundable-items
  RR->>POS: API-01 receipt lookup
  POS-->>RR: receipt, items, amounts, branch, date, payment method
  RR-->>C: refundable items, blocked items with reasons, lookupId
  C->>RR: POST /v1/refund-requests with Idempotency-Key and lookupId
  RR->>DB: insert request, items, decision record, publication log
  RR-->>C: 201 Submitted, reference number
  RR-)NT: RefundRequestSubmitted
  Note over NT: listener writes message and outbox rows
  NT->>RR: API-03 CustomerContactPort.findContact by the relay
  NT->>MH: API-07 email and SMS via outbox
```

**Summary:** The customer's receipt lookup calls Point-of-Sale Records synchronously; the submit commits the request, its items, its decision-record row, and its publication-log row in one transaction and answers with the reference number, and only then does the notification module write its messages, whose relay reads the contact details and sends the email and SMS.

### 8.5.2 Sequence: Approve a refund request and pay it out

**Use cases:** [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)

```mermaid
sequenceDiagram
  participant BM as Branch manager browser
  participant RR as refund-request
  participant PO as payout
  participant CP as CardPay Ltd
  participant NT as notification
  BM->>RR: GET /v1/branches/{branchId}/refund-requests/{refundRequestId}
  RR->>PO: API-02 CardDisputePort.findOpenDispute
  PO-->>RR: no open dispute
  RR-->>BM: request, items, dispute status
  BM->>RR: POST /v1/refund-requests/{refundRequestId}/decision approve
  RR-->>BM: 200 Approved
  RR-)NT: RefundRequestApproved
  RR-)PO: RefundRequestApproved
  PO->>CP: API-04 send payout via outbox
  CP-)PO: API-05 payout result accepted
  PO-)RR: PayoutSucceeded
  RR-)NT: RefundRequestPaid
```

**Summary:** The decision screen asks the payout module for an open card dispute; the approval commits the Approved status and answers at once, the payout module sends the payout through its outbox, and the provider's result turns into PayoutSucceeded, which marks the request Paid and tells the customer.

### 8.5.3 Sequence: Payout fails and the branch manager is told

**Use cases:** [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)

```mermaid
sequenceDiagram
  participant CP as CardPay Ltd
  participant PO as payout
  participant RR as refund-request
  participant NT as notification
  participant MH as MsgHub
  CP-)PO: API-05 payout refused or sent back
  PO-)RR: PayoutFailed
  RR-)NT: RefundPayoutDelayed or RefundRequestReturnedToApproved
  NT->>MH: API-07 payout delayed message
  Note over PO: Schedule payout-retry resends with backoff
  PO->>CP: API-04 resend, same key after a timeout, next key generation after a refusal or a return
  Note over PO: failures for more than one day
  PO-)NT: PayoutStillFailing
  NT->>MH: API-07 branch manager message, channel open
```

**Summary:** A refused or returned payout keeps the request Approved (or moves it back from Paid), the customer is told the payout is delayed, and the payout-retry schedule resends with the same key after a timeout and the next key generation after a refusal or a return; once failures last more than one day the branch manager gets an information message.

### 8.5.4 Sequence: Cancel a refund request

**Use cases:** [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request)

```mermaid
sequenceDiagram
  participant C as Customer browser
  participant RR as refund-request
  participant NT as notification
  participant LP as loyalty-points
  C->>RR: POST /v1/refund-requests/{refundRequestId}/cancellation
  alt still Submitted
    RR-->>C: 200 Cancelled
    RR-)NT: RefundRequestCancelled
    RR-)LP: RefundRequestCancelled
  else already decided
    RR-->>C: 409 REFUND_ALREADY_DECIDED
  end
```

**Summary:** A cancellation succeeds only while the request is Submitted, after which the customer is emailed and Loyalty Points records the outcome; a request decided in the meantime answers 409.

### 8.5.5 Sequence: Track refund status

**Use cases:** [REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status)

```mermaid
sequenceDiagram
  participant C as Customer browser
  participant RR as refund-request
  participant DB as refund_request schema
  C->>RR: GET /v1/refund-requests
  RR->>DB: select requests of the token's customer
  RR-->>C: list with reference, amount, status
  C->>RR: GET /v1/refund-requests/{refundRequestId}
  RR->>DB: select request and its decision record
  RR-->>C: history, requested and approved amounts, reasons
```

**Summary:** The customer lists and opens only their own requests; the detail reads the decision record for the history of status changes.

### 8.5.6 Sequence: Points balance and history

**Use cases:** [LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance), [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history)

```mermaid
sequenceDiagram
  participant M as Member browser
  participant LP as loyalty-points
  participant DB as loyalty_points schema
  M->>LP: GET /v1/members/me/points-balance
  LP->>DB: sum of movements, newest movement date
  LP-->>M: balance, last movement date, timing note
  M->>LP: GET /v1/members/me/points-movements
  LP->>DB: movements newest first
  LP-->>M: movements with date, reference, points
  M->>LP: GET /v1/members/me/points-movements/{movementId}
  LP-->>M: purchase or refund details, or details no longer kept
```

**Summary:** The member's balance is the sum of their movements read from the loyalty_points schema, the history lists movements newest first, and a movement's detail shows its purchase or refund, or says that older details are no longer kept.

### 8.5.7 Sequence: Refund outcome to Loyalty Points

**Use cases:** [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history), [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)

```mermaid
sequenceDiagram
  participant RR as refund-request
  participant PUB as Publication log
  participant LP as loyalty-points
  participant DB as loyalty_points schema
  RR->>PUB: RefundRequestPaid recorded in the same transaction
  PUB-)LP: deliver after commit, again until completed
  LP->>DB: inbox insert on event ID, duplicate skipped
  alt Loyalty Points live and purchase earned points
    LP->>DB: taken-back movement, capped
  else purchase not earned yet
    LP->>DB: pending take-back, 30-day wait
  else Loyalty Points not live yet
    LP->>DB: kept in the inbox until go-live
  end
```

**Summary:** A paid refund is recorded in the publication log with its status change and delivered to loyalty-points after commit until the listener completes; the inbox drops duplicates, and the take-back is applied, held for up to 30 days, or kept until Loyalty Points goes live.

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 04-architecture-style-and-diagrams.md | NEXT: 05a-infrastructure-and-network.md -->

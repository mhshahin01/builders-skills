<!--
CHUNK: 05
TITLE: System Design - Workflow & Sequence Diagrams
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: 04
PART OF: SDD - Refunds Platform
-->

## 8.4 Workflow Diagrams

### 8.4.1 Workflow: Refund request lifecycle

**Use cases:** [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund), [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request), [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund), [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history)

**Figure 4: Workflow - Refund request lifecycle**

```mermaid
flowchart TD
  A["Customer enters receipt number"] --> B{"Receipt found and within 30 days?"}
  B -->|No| B1["Customer told why: receipt not found or refund window passed"]
  B -->|Yes| C["Customer selects refundable items and a reason, then submits"]
  C --> D["refund-service records SUBMITTED with a reference number"]
  D --> E["REFUND_SUBMITTED: customer told by email and SMS"]
  E --> F{"Customer cancels before a decision?"}
  F -->|Yes| F1["CANCELLED: REFUND_CANCELLED, customer told by email"]
  F -->|No| G{"Branch manager decision"}
  G -->|Reject with a reason| G1["REJECTED: REFUND_REJECTED, customer told the reason"]
  G -->|Approve in full or in part| H["APPROVED: REFUND_APPROVED, customer told the approved amount"]
  H --> I["payout-service pays back to the original card"]
  I --> J{"Payout confirmed within the retry window (ADR-10)?"}
  J -->|Yes| K["PAID: REFUND_PAID, customer told by email and SMS"]
  K --> L["loyalty-service takes back the purchase's points"]
  J -->|No| M["Stays APPROVED: PAYOUT_FAILED, then REFUND_PAYOUT_FAILED, branch managers emailed and the request flagged in the queue"]
```

**Summary:** A request moves from SUBMITTED to CANCELLED, REJECTED, or APPROVED, and the customer is told at each step, including the approved amount; an approved request becomes PAID when payout-service confirms the payout, which also triggers the customer message and the points take-back for the loyalty member. A payout that is still not confirmed at the end of its retry window (ADR-10) leaves the request APPROVED, flags it in the branch queue, and emails the branch's managers.

### 8.4.2 Workflow: Points movements and member views

**Use cases:** [LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance), [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history)

**Figure 5: Workflow - Points movements and member views**

```mermaid
flowchart TD
  P["POS Records member purchase"] --> EA["EARNED movement for the purchase amount"]
  R["REFUND_PAID from refund-service"] --> T{"EARNED movement for the receipt exists?"}
  T -->|Yes| TB["TAKEN_BACK movement with the refund reference"]
  T -->|Not yet| PK["Take-back parked until the purchase arrives"]
  PK -->|Purchase arrives| TB
  PK -->|"No member purchase by the end of the day after the purchase date"| CL["Parked take-back closed: not a member purchase so far"]
  CL -->|"Purchase arrives later: applied with an alert"| TB
  EA --> BAL[("Balance = sum of movements")]
  TB --> BAL
  M1["Member opens points"] --> V1["Balance and date of the last movement"]
  M2["Member opens history"] --> V2["Movements newest first, each with its purchase or refund"]
  BAL --> V1
  BAL --> V2
```

**Summary:** Earn movements come from the POS Records member purchases and take-back movements from paid refunds; a take-back that arrives before its purchase is parked, then applied or closed, and a closed take-back is still applied, with an alert, if its purchase arrives later. The balance the member sees is the sum of the movements, and the history lists every movement with its purchase or refund reference.

## 8.5 Sequence Diagrams

### 8.5.1 Sequence: Submit a refund request

**Use cases:** [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund)

**Figure 6: Sequence - Submit a refund request**

```mermaid
sequenceDiagram
  actor C as Customer
  participant W as Web app
  participant G as API gateway
  participant R as refund-service
  participant P as POS Records
  participant K as Kafka
  participant N as notification-service
  participant KC as Keycloak
  participant M as MsgHub
  C->>W: enter receipt number
  W->>G: GET /v1/receipts/{receiptNumber}/refundable-items
  G->>R: forward with identity and tenant context
  R->>P: API-01 receipt lookup
  P-->>R: items, amounts, branch, purchase date, payment reference
  alt receipt not found or older than 30 days
    R-->>W: 404 RECEIPT_NOT_FOUND or 422 REFUND_WINDOW_PASSED
  else refundable
    R-->>W: items, already refunded items marked not selectable
  end
  C->>W: select items and reason, submit
  W->>G: POST /v1/refund-requests with Idempotency-Key
  G->>R: forward
  R->>P: API-01 receipt lookup to re-validate
  R->>R: SUBMITTED and outbox row in one transaction
  R-->>W: 201 with the reference number
  R-)K: REFUND_SUBMITTED via the outbox relay
  K-)N: REFUND_SUBMITTED
  N->>KC: API-05 contact lookup by customerId
  N->>M: API-04 send email and SMS
```

**Summary:** refund-service checks the receipt against POS Records twice, once to show the refundable items and once when the request is submitted, so amounts always come from the source. The request and its outbox row commit together, and notification-service turns the resulting event into an email and an SMS after resolving the contact details from Keycloak.

### 8.5.2 Sequence: Refund decision and payout

**Use cases:** [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund), [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history)

**Figure 7: Sequence - Refund decision and payout**

```mermaid
sequenceDiagram
  actor BM as Branch Manager
  participant R as refund-service
  participant K as Kafka
  participant PS as payout-service
  participant CP as CardPay
  participant N as notification-service
  participant L as loyalty-service
  BM->>R: GET /v1/branches/{branchId}/refund-requests
  BM->>R: POST /v1/refund-requests/{refundId}/decision
  alt reject with a reason
    R-)K: REFUND_REJECTED
    K-)N: REFUND_REJECTED, customer told the reason
  else approve in full or in part
    R-)K: REFUND_APPROVED
    K-)PS: REFUND_APPROVED
    K-)N: REFUND_APPROVED, customer told the approved amount
    PS->>CP: API-02 payout to the original card, Idempotency-Key = payout id
    CP->>PS: API-03 payout result
    alt payout confirmed
      PS-)K: PAYOUT_SUCCEEDED
      K-)R: PAYOUT_SUCCEEDED, request marked PAID
      R-)K: REFUND_PAID
      K-)N: REFUND_PAID, email and SMS to the customer
      K-)L: REFUND_PAID, purchase points taken back
    else refused or unreachable for the whole retry window
      PS-)K: PAYOUT_FAILED
      K-)R: PAYOUT_FAILED, stays APPROVED, branch manager alerted
      R-)K: REFUND_PAYOUT_FAILED
      K-)N: REFUND_PAYOUT_FAILED, branch managers emailed
    end
  end
```

**Summary:** The decision is the only synchronous step; everything after it is a choreographed chain of events in which each fact has one publisher. payout-service is the only caller of CardPay and re-publishes nothing about the refund itself: refund-service turns the payout outcome into `REFUND_PAID`, which drives both the customer message and the points take-back, or into `REFUND_PAYOUT_FAILED`, which emails the branch's managers (the API gateway hop is omitted for brevity).

### 8.5.3 Sequence: Track and cancel a refund request

**Use cases:** [REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status-web-and-mobile), [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request)

**Figure 8: Sequence - Track and cancel a refund request**

```mermaid
sequenceDiagram
  actor C as Customer
  participant R as refund-service
  participant K as Kafka
  participant N as notification-service
  C->>R: GET /v1/refund-requests
  R-->>C: own requests with reference number, amount, status
  C->>R: GET /v1/refund-requests/{refundId}
  R-->>C: status history with dates and any rejection reason
  C->>R: POST /v1/refund-requests/{refundId}/cancellation
  alt still SUBMITTED
    R->>R: CANCELLED and outbox row in one transaction
    R-->>C: 200 CANCELLED
    R-)K: REFUND_CANCELLED
    K-)N: REFUND_CANCELLED, email to the customer
  else already decided
    R-->>C: 409 REFUND_ALREADY_DECIDED
  end
```

**Summary:** Tracking is a read of the customer's own requests and their status history. Cancellation succeeds only while the request is SUBMITTED; optimistic locking makes a concurrent branch decision win cleanly, and the customer is told it can no longer be cancelled (the API gateway hop is omitted for brevity).

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 04-architecture-style-and-diagrams.md | NEXT: 06-principles-and-decisions.md -->

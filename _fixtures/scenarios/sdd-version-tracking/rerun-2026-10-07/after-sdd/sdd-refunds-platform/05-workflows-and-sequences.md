<!--
CHUNK: 05
TITLE: System Design - Workflow & Sequence Diagrams
PROJECT: Refunds Platform
VERSION: 1.1
DEPENDS_ON: 04
PART OF: SDD - Refunds Platform
-->

## 8.4 Workflow Diagrams

<!-- This chunk continues the System Design section from chunk 04 (Architecture Style & Diagrams). -->

### 8.4.1 Workflow: Refund lifecycle

**Use cases:** [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund), [REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status-web-and-mobile), [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request), [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)

**Figure 4: Workflow - Refund lifecycle**

```mermaid
flowchart TD
  A["Customer enters the receipt number"] --> B{"Receipt found and within 30 days?"}
  B -->|no| B1["Customer told: receipt not found or window passed"]
  B -->|yes| C["Customer selects items and a reason"]
  C --> D["refund-service records SUBMITTED with a reference number"]
  D --> E["REFUND_SUBMITTED: customer told by email and SMS"]
  D -.->|customer cancels while SUBMITTED| X["CANCELLED: customer told by email"]
  E --> F{"Branch manager decision"}
  F -->|reject with a reason| R["REJECTED: customer told the reason"]
  F -->|approve in full or in part| G["APPROVED: REFUND_APPROVED, customer told by email and SMS"]
  G --> H{"Payout succeeds?"}
  H -->|yes| P["PAID: customer told by email and SMS"]
  H -->|still failing after the retry window| Q["Stays APPROVED: branch manager told"]
  P --> T["Customer tracks status and history at any time"]
```

**Summary:** This re-expresses the [REFUNDS 05 § Summarized Workflow](../brd-refunds-portal/05-user-journeys-overview.md#summarized-workflow) technically: refund-service owns every state change, publishes one integration event per change, and payout-service and notification-service react to those events, so the customer is told at submission, approval or rejection, cancellation, and payment. The customer can read the status and history at every point of the flow.

### 8.4.2 Workflow: Points balance, history, and takeback

**Use cases:** [LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance), [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history), [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)

**Figure 5: Workflow - Points balance, history, and takeback**

```mermaid
flowchart TD
  I["Scheduled import of member purchases from POS Records, API-04"] --> EA["EARNED movement per member purchase"]
  EA --> BAL["Balance = sum of movements"]
  RP["refund-service marks a refund PAID"] -->|RefundPaid in-process| TB{"EARNED movement for the purchase?"}
  TB -->|yes| TK["TAKEN_BACK for the refunded amount, with the refund reference"]
  TB -->|not imported yet| PEND["PENDING_EARN take-back"]
  EA -.->|the same purchase arrives| PEND
  PEND -.->|applied by the import| TK
  PEND -.->|no purchase by the next-day import| NOEARN["NO_EARN, no movement"]
  TK --> BAL
  M["Member opens their points"] --> V1["Balance and date of the last movement"]
  M --> V2["History of movements, newest first"]
  BAL --> V1
```

**Summary:** Points come from two sources: the scheduled import of member purchases earns them, and a paid refund takes back the points of the refunded amount through the in-process `RefundPaid` event. A refund paid before its purchase is imported waits as a pending take-back that the import applies, so the balance is always the sum of the right movements whatever order the two sources arrive in.

## 8.5 Sequence Diagrams

### 8.5.1 Sequence: Submit a refund request

**Use cases:** [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund)

**Figure 6: Sequence - Submit a refund request**

```mermaid
sequenceDiagram
  autonumber
  actor C as Customer
  participant W as Web app
  participant G as API gateway
  participant R as refund-service
  participant P as POS Records
  participant K as Kafka
  participant N as notification-service
  participant M as MsgHub
  C->>W: enter the receipt number
  W->>G: GET /v1/receipts/{receiptNumber}/refundable-items
  G->>R: forward with JWT and tenant context
  R->>P: API-01 look up the receipt
  P-->>R: items, amounts, branch, purchase date
  R-->>W: refundable items with window and already-refunded checks
  C->>W: select items and a reason, then submit
  W->>G: POST /v1/refund-requests with Idempotency-Key
  G->>R: forward
  R->>R: save SUBMITTED, history, and outbox row in one transaction
  R-->>W: 201 with the reference number
  R->>K: relay publishes REFUND_SUBMITTED after commit
  K->>N: REFUND_SUBMITTED
  N->>M: API-03 email and SMS to the customer
```

**Summary:** The customer's receipt is checked against POS Records before anything is stored, and the request, its history, and the outbox row commit together. The customer message leaves asynchronously, so a MsgHub outage never blocks the submission.

### 8.5.2 Sequence: Refund decision and payout

**Use cases:** [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)

**Figure 7: Sequence - Refund decision and payout**

```mermaid
sequenceDiagram
  actor B as Branch Manager
  participant G as API gateway
  participant R as refund-service
  participant K as Kafka
  participant Y as payout-service
  participant C as CardPay
  participant N as notification-service
  participant L as loyalty-service
  B->>G: POST /v1/branches/{branchId}/refund-requests/{refundRequestId}/decision
  G->>R: forward with JWT and branch claim
  alt approve in full or in part
    R->>R: APPROVED and outbox REFUND_APPROVED in one transaction
    R-->>B: 200 with status APPROVED
    R->>K: REFUND_APPROVED
    K->>Y: REFUND_APPROVED
    K->>N: REFUND_APPROVED, then API-03 email and SMS
    Y->>C: API-02 send the payout with an idempotency key
    alt payout succeeds
      C-->>Y: payout accepted
      Y->>K: PAYOUT_SUCCEEDED
      K->>R: PAYOUT_SUCCEEDED
      R->>R: PAID, outbox REFUND_PAID, publication log RefundPaid
      R->>K: REFUND_PAID
      K->>N: REFUND_PAID, then API-03 email and SMS
      R-)L: RefundPaid in process after commit
    else still failing at the end of the retry window
      Y->>K: PAYOUT_FAILED
      K->>R: PAYOUT_FAILED
      R->>R: stays APPROVED, flagged for the branch manager
    end
  else reject with a reason
    R->>R: REJECTED and outbox REFUND_REJECTED
    R->>K: REFUND_REJECTED
    K->>N: REFUND_REJECTED, then API-03 email and SMS
  end
```

**Summary:** The decision commits in refund-service with its outbox row, and notification-service tells the customer the approved amount or the rejection reason; payout-service pays asynchronously and reports the outcome with `PAYOUT_SUCCEEDED` or, at the end of the §17.2 retry window, `PAYOUT_FAILED`. A paid refund reaches the customer through notification-service and loyalty-service through the in-process `RefundPaid` event.

### 8.5.3 Sequence: Points taken back after a refund is paid

**Use cases:** [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history), [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)

**Figure 8: Sequence - Points taken back after a refund is paid**

```mermaid
sequenceDiagram
  participant R as refund-service
  participant PL as Publication log
  participant L as loyalty-service
  actor M as Member
  participant G as API gateway
  R->>PL: RefundPaid recorded in the PAID transaction
  PL->>L: RefundPaid delivered after commit
  L->>L: set the tenant context from tenantId, find the EARNED movement
  alt the purchase earned points
    L->>L: calculate points for paidAmount, insert TAKEN_BACK and update balance atomically
  else the purchase is not imported yet
    L->>L: record a PENDING_EARN take-back for the purchase
  end
  PL->>PL: mark RefundPaid completed once the listener commits
  M->>G: GET /v1/members/me/points/movements
  G->>L: forward with JWT and member_id claim
  L-->>M: movements newest first, including the taken-back points
```

**Summary:** The take-back rule runs in loyalty-service after the refund's Paid transition has committed, under the tenant carried in the event; the publication log redelivers `RefundPaid` if the core stops before the handler completes, and a purchase not imported yet leaves a pending take-back. The member then sees the negative movement with the refund reference in the history.

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 04-architecture-style-and-diagrams.md | NEXT: 06-principles-and-decisions.md -->

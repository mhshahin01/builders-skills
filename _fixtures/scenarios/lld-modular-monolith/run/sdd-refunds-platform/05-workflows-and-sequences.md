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

### 8.4.1 Workflow: Refund request to payout

**Use cases:** [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund), [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request), [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)

**Figure 4: Workflow - Refund request to payout**

```mermaid
flowchart TD
  A["Customer enters the receipt number"] --> B{"Receipt found and purchase within 30 days?"}
  B -- "no" --> B1["Show the reason: not found, or window passed"]
  B -- "yes" --> C["Customer selects refundable items and a reason"]
  C --> D["Request recorded as Submitted with a reference number"]
  D --> N1["Customer told by email and SMS"]
  D --> E{"Customer cancels before a decision?"}
  E -- "yes" --> F["Cancelled, customer told by email"]
  E -- "no" --> G{"Branch manager decides"}
  G -- "reject with a reason" --> H["Rejected, customer told the reason"]
  G -- "approve in full or in part" --> I["Approved, payout instruction committed with the approval"]
  I --> J{"CardPay payout succeeds?"}
  J -- "yes" --> K["Paid, customer told by email and SMS"]
  J -- "no, within 24 h" --> J2["Retry with backoff"]
  J2 --> J
  J -- "no, after 24 h" --> L["Stays Approved, branch manager told"]
```

**Summary:** A refund request is checked against the receipt and the 30-day window, recorded as Submitted, and then either cancelled by the customer or decided by the branch manager; an approval commits the payout instruction, and the payout is retried for up to 24 hours before the branch manager is told. The customer hears about submission, cancellation, rejection, and payment.

### 8.4.2 Workflow: Points take-back after a paid refund

**Use cases:** [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund), [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history)

**Figure 5: Workflow - Points take-back after a paid refund**

```mermaid
flowchart TD
  A["refund marks the request Paid"] --> B["RefundPaid published in process"]
  B --> C["loyalty looks up the earn movement of the purchase reference"]
  C --> D{"Earn movement found?"}
  D -- "yes" --> E["Take-back movement recorded with the refund reference"]
  D -- "no" --> F["Pending take-back kept"]
  F --> G["Member purchase arrives from POS records"]
  G --> E
  E --> H["Balance and history show the negative movement"]
```

**Summary:** When a refund is paid, the `loyalty` module takes back the points earned on that purchase and records the movement with the refund reference, within the one-hour target of LOYALTY/NFR-02; if the purchase has not reached `loyalty` yet, the take-back waits as pending and is applied when the purchase arrives.

## 8.5 Sequence Diagrams

### 8.5.1 Sequence: Refund submission

**Use cases:** [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund)

**Figure 6: Sequence - Refund submission**

```mermaid
sequenceDiagram
  participant C as Customer web app
  participant GW as API gateway
  participant R as refund module
  participant POS as POS Records
  participant N as notification module
  participant MH as MsgHub
  C->>GW: GET refundable items for the receipt number
  GW->>R: forward with token
  R->>POS: API-02 look up receipt
  POS-->>R: receipt lines, amounts, branch, purchase date
  R-->>C: refundable items, or RECEIPT_NOT_FOUND, or REFUND_WINDOW_EXPIRED
  C->>GW: POST refund request with Idempotency-Key
  GW->>R: forward with token
  R->>POS: API-02 re-read receipt
  R->>R: check window and items, save Submitted, publish RefundSubmitted
  R-->>C: 201 Created with reference number
  R--)N: RefundSubmitted after commit
  N->>MH: API-04 email and SMS
```

**Summary:** The customer first reads the refundable lines of a receipt, then submits; the `refund` module re-reads the receipt, re-checks the window and the items, stores the Submitted request, and publishes `RefundSubmitted`, which the `notification` module turns into an email and an SMS after commit.

### 8.5.2 Sequence: Refund decision and payout

**Use cases:** [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)

**Figure 7: Sequence - Refund decision and payout**

```mermaid
sequenceDiagram
  participant BM as Branch manager web app
  participant R as refund module
  participant P as payout module
  participant CP as CardPay
  participant N as notification module
  participant L as loyalty module
  BM->>R: POST decision with Idempotency-Key
  R->>R: check own branch, Submitted, amount or reason rule
  alt reject
    R-->>BM: 200 Rejected
    R--)N: RefundRejected
  else approve in full or in part
    R->>P: API-01 PayoutPort.requestPayout in the same transaction
    P-->>R: PayoutAccepted
    R-->>BM: 200 Approved
    loop dispatcher until success or 24 h
      P->>CP: API-03 send payout, idempotency key payoutId
      CP-->>P: payout result
    end
    alt payout succeeded
      P--)R: PayoutSucceeded
      R->>R: mark Paid, publish RefundPaid
      R--)N: RefundPaid
      R--)L: RefundPaid
    else still failing after 24 h
      P--)N: PayoutFailed
    end
  end
```

**Summary:** A rejection commits and publishes `RefundRejected`; an approval calls `PayoutPort.requestPayout` inside the approval transaction, after which the payout dispatcher sends the payout to CardPay with the payout ID as idempotency key. Success flows back as `PayoutSucceeded`, `refund` marks the request Paid and publishes `RefundPaid` for `notification` and `loyalty`; after 24 hours of failures `PayoutFailed` makes `notification` tell the branch manager.

### 8.5.3 Sequence: Cancel a refund request

**Use cases:** [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request)

**Figure 8: Sequence - Cancel a refund request**

```mermaid
sequenceDiagram
  participant C as Customer web app
  participant R as refund module
  participant N as notification module
  participant MH as MsgHub
  C->>R: POST cancellation with Idempotency-Key
  R->>R: load own request with its version
  alt status is Submitted and no decision committed first
    R->>R: mark Cancelled, publish RefundCancelled
    R-->>C: 200 Cancelled
    R--)N: RefundCancelled
    N->>MH: API-04 email
  else already decided
    R-->>C: 409 REFUND_ALREADY_DECIDED
  end
```

**Summary:** The cancellation is a guarded transition with optimistic locking, so a decision that commits first wins and the customer gets `REFUND_ALREADY_DECIDED`; a successful cancellation publishes `RefundCancelled`, which the `notification` module sends as an email.

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 04-architecture-style-and-diagrams.md | NEXT: 06-principles-and-decisions.md -->

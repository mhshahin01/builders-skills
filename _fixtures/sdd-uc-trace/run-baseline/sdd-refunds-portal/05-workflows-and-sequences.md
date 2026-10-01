<!--
CHUNK: 05
TITLE: System Design - Workflow & Sequence Diagrams
PROJECT: Refunds Portal
VERSION: 1.0
DEPENDS_ON: 04
PART OF: SDD - Refunds Portal
-->

## 8.4 Workflow Diagrams

The behavioural steps are owned by the BRD use cases ([BRD 06a](../brd-refunds-portal/06a-use-cases-customer.md), [BRD 06b](../brd-refunds-portal/06b-use-cases-branch-manager.md)); these workflows show the technical realisation and cite the steps by ID.

### 8.4.1 Workflow: Refund Request Lifecycle (end to end)

**Figure 4: Workflow - Refund Request Lifecycle**

```mermaid
flowchart TD
  A["Customer submits request - UC-01"] --> B{"Receipt found, in window, lines refundable?"}
  B -->|no| B1["Actionable error - UC-01 E1, E2, A1"]
  B -->|yes| C["refund-requests: Submitted, REFUND_REQUEST_SUBMITTED"]
  C --> M1["notifications: email and SMS to customer"]
  C --> D{"Next action on the request"}
  D -->|customer cancels - UC-03| X["Cancelled, REFUND_REQUEST_CANCELLED"]
  D -->|branch manager rejects - UC-04 A2| R["Rejected, REFUND_REQUEST_REJECTED"]
  D -->|branch manager approves in full or in part - UC-04| AP["Approved, REFUND_REQUEST_APPROVED"]
  X --> M2["notifications: email to customer"]
  R --> M3["notifications: reason to customer"]
  AP --> P["payouts: payout to the original card via CardPay"]
  P --> Q{"Payout succeeded?"}
  Q -->|yes| PS["PAYOUT_SUCCEEDED, then refund-requests: Paid, REFUND_REQUEST_PAID"]
  PS --> M4["notifications: email and SMS to customer"]
  Q -->|no| RT["Retry with backoff, request stays Approved - UC-04 E1"]
  RT --> Q
  RT --> ESC["Escalation window passed: PAYOUT_ESCALATED, branch manager told"]
```

**Summary:** This is the [BRD 05 § Summarized Workflow](../brd-refunds-portal/05-user-journeys-overview.md#summarized-workflow) expressed as module state changes and domain events: a submitted request ends Cancelled, Rejected, or Approved, and an approved request ends Paid once its payout succeeds. Every state change publishes an event that drives the next module; a failing payout keeps the request Approved, retries, and escalates to the branch manager.

### 8.4.2 Workflow: Receipt Check and Submission (UC-01)

**Figure 5: Workflow - Receipt Check and Submission**

```mermaid
flowchart TD
  S["Customer enters receipt number"] --> L["refund-requests calls API-01 receipt lookup"]
  L --> F{"Receipt found?"}
  F -->|no| E2["RECEIPT_NOT_FOUND - UC-01 E2"]
  F -->|lookup unavailable| E0["PURCHASE_RECORDS_UNAVAILABLE - try again later"]
  F -->|yes| W{"Within the refund window?"}
  W -->|no| E1["REFUND_WINDOW_EXPIRED - UC-01 E1"]
  W -->|yes| I["Lines with an active or consumed item claim shown as not selectable - UC-01 A1"]
  I --> SEL["Customer selects lines and a reason and sees the amount"]
  SEL --> SUB["Submit with Idempotency-Key"]
  SUB --> RV["Lookup and checks run again on the server"]
  RV --> TX["One transaction: RefundRequest Submitted, item claims, status history, contact snapshot, outbox row"]
  TX --> OK["201 Created with reference number"]
  TX -->|item claim conflict| E3["ITEM_ALREADY_REFUNDED - refresh the item list"]
```

**Summary:** The receipt lookup is always done by the backend, first to show the refundable lines and again at submission, so the client never supplies amounts or eligibility. Submission commits the request, the item claims that enforce the item-once rule, and the outbox row together; a concurrent claim on the same line fails the transaction with an actionable error.

### 8.4.3 Workflow: Payout Dispatch, Retry, and Escalation (UC-04 steps 6-7, E1)

**Figure 6: Workflow - Payout Dispatch, Retry, and Escalation**

```mermaid
flowchart TD
  EV["REFUND_REQUEST_APPROVED delivered to payouts"] --> DUP{"event_id already in inbox?"}
  DUP -->|yes| SKIP["Skip - idempotent no-op"]
  DUP -->|no| CR["One transaction: inbox row, Payout Pending and due now"]
  CR --> DISP["Dispatcher claims the due payout with a row lock"]
  DISP --> CALL["API-03 payout request with the payout id as idempotency key"]
  CALL --> RES{"Outcome"}
  RES -->|success, synchronous or via API-04| OK["Payout Succeeded, outbox PAYOUT_SUCCEEDED"]
  RES -->|refused or no answer| SCH["Payout RetryScheduled, next attempt with backoff and jitter"]
  SCH --> WIN{"Escalation window passed and not yet escalated?"}
  WIN -->|yes| ESC["Record escalation, outbox PAYOUT_ESCALATED"]
  WIN -->|no| DISP
  ESC --> DISP
```

**Summary:** A payout is created once per approved request and dispatched from committed state by a dispatcher that locks the row, so two replicas never send the same attempt. Every attempt reuses the payout id as the idempotency key; failures are retried with backoff, and when the escalation window of UC-04 E1 passes the payout is escalated once while retries continue (the stop condition is flagged in §17.2).

## 8.5 Sequence Diagrams

The sequences use the candidate event names of §14.5 and the contracts of §15. **[NEEDS CLARIFICATION: confirm these sequences once the candidate events (§14.5) are ratified and CardPay's result delivery model (synchronous response or callback, API-03 and API-04) is known.]**

### 8.5.1 Sequence: Submit a Refund Request (UC-01)

**Figure 7: Sequence - Submit a Refund Request**

```mermaid
sequenceDiagram
  autonumber
  actor C as Customer
  participant WEB as refunds-portal-web
  participant GW as API gateway
  participant RR as refund-requests
  participant POS as Point-of-Sale Records
  participant NO as notifications
  participant MH as MsgHub
  C->>WEB: enter receipt number
  WEB->>GW: GET /v1/receipts/{receiptNumber}/refundable-items
  GW->>RR: forward with token, X-Tenant-Id, X-Correlation-Id
  RR->>POS: API-01 look up receipt
  POS-->>RR: lines, amounts, branch, purchase date
  RR-->>WEB: lines with selectable flag, or a problem+json error
  C->>WEB: select lines and a reason, submit
  WEB->>GW: POST /v1/refund-requests with Idempotency-Key
  GW->>RR: forward
  RR->>POS: API-01 look up receipt again
  RR->>RR: one transaction - Submitted, item claims, history, outbox REFUND_REQUEST_SUBMITTED
  RR-->>WEB: 201 Created with reference number
  RR--)NO: REFUND_REQUEST_SUBMITTED after commit
  NO->>RR: API-02 find customer contact
  NO->>MH: API-05 send email and SMS
```

**Summary:** The customer's two calls reach refund-requests through the gateway, and each makes at most one synchronous provider call (the receipt lookup), keeping the one-hop rule. After the request is committed, the relay delivers the event to notifications, which resolves the contact in-process and sends the messages through MsgHub.

### 8.5.2 Sequence: Approve, Pay Out, and Mark Paid (UC-04)

**Figure 8: Sequence - Approve, Pay Out, and Mark Paid**

```mermaid
sequenceDiagram
  autonumber
  actor BM as Branch Manager
  participant GW as API gateway
  participant RR as refund-requests
  participant PO as payouts
  participant CP as CardPay Ltd
  participant NO as notifications
  participant MH as MsgHub
  BM->>GW: POST /v1/branches/{branchId}/refund-requests/{refundRequestId}/decision
  GW->>RR: forward with Idempotency-Key
  RR->>RR: branch scope, Submitted state, amount rule, then Approved and outbox REFUND_REQUEST_APPROVED
  RR-->>BM: 200 OK, status Approved
  RR--)PO: REFUND_REQUEST_APPROVED after commit
  PO->>PO: one transaction - inbox row, Payout Pending
  PO->>CP: API-03 payout request, idempotency key is the payout id
  alt payout confirmed
    CP-->>PO: success, in the response or through API-04
    PO->>PO: Payout Succeeded, outbox PAYOUT_SUCCEEDED
    PO--)RR: PAYOUT_SUCCEEDED
    RR->>RR: Paid, outbox REFUND_REQUEST_PAID
    RR--)NO: REFUND_REQUEST_PAID
    NO->>RR: API-02 find customer contact
    NO->>MH: API-05 send email and SMS
  else refused or no answer
    CP-->>PO: refusal or timeout
    PO->>PO: RetryScheduled, request stays Approved
  end
```

**Summary:** The decision commits Approved and its event in one transaction and answers the branch manager at once; the payout runs asynchronously from committed state. Success travels back as PAYOUT_SUCCEEDED, refund-requests marks the request Paid and publishes the customer-facing fact, and notifications tells the customer; a refusal or timeout only schedules a retry.

### 8.5.3 Sequence: Cancellation Racing a Decision (UC-03 E1)

**Figure 9: Sequence - Cancellation Racing a Decision**

```mermaid
sequenceDiagram
  actor C as Customer
  actor BM as Branch Manager
  participant RR as refund-requests
  participant DB as schema refund_requests
  BM->>RR: decision, request read at version 1
  C->>RR: cancellation, request read at version 1
  RR->>DB: update to Approved where version is 1
  DB-->>RR: 1 row updated, version 2
  RR->>DB: update to Cancelled where version is 1
  DB-->>RR: 0 rows updated
  RR-->>C: 409 REQUEST_NOT_CANCELLABLE
  RR-->>BM: 200 OK, status Approved
```

**Summary:** Optimistic locking on the aggregate version makes the first committed transition win; the losing cancellation receives a conflict that the customer area shows as "the request can no longer be cancelled" (UC-03 E1). The same guard protects a decision that races a cancellation.

<!-- MASTER: refunds-portal-sdd-master.md | PREV: 04-architecture-style-and-diagrams.md | NEXT: 06-principles-and-decisions.md -->

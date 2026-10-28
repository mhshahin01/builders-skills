<!--
CHUNK: 10
TITLE: Centralized Event Hub (Platform Event Catalog & Payload Contracts)
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: 05, 07, 08, 09
RECONCILES_WITH: every per-service chunk (13a, 13b, 13c, 13d) - Event Model sub-sections
PART OF: SDD - Refunds Platform
PURPOSE: Single cross-module catalog of every platform event - name, publisher, listeners, payload, business when - for a modular monolith whose events are all in-process domain events (§14.10).
CONSISTENCY_RULE: Event names, publisher modules, listener modules, and DTO fields here MUST match the per-module chunks character-for-character; a divergence is flagged in §14.8.
-->

# 14. Centralized Event Hub (Platform Event Catalog & Payload Contracts)

> **What this chunk is.** The one place that lists every event on the platform with its publisher, its listeners, its payload, and its business moment. In this modular monolith ([ADR-01](./06-principles-and-decisions.md#10-architectural-decisions)) every event is an in-process domain event between modules of the one deployable (§14.10); no event leaves the process, so the broker sections (§14.2 to §14.6, §14.9 contracts) do not apply in this release.

---

## 14.1 Purpose & Scope

The platform's eventing posture: every module-to-module state change travels as a durable in-process domain event, recorded in the publication log in the publisher's transaction and delivered after commit to each listener at least once ([ADR-02](./06-principles-and-decisions.md#10-architectural-decisions)); synchronous calls between modules are reserved for queries, at most one hop (§15). The four questions, for the §14.10 events:

1. **What events exist:** 11 in-process domain events, 7 published by refund-request and 4 by payout; notification and loyalty-points publish none.
2. **Who publishes and who listens:** §14.10, reconciled from both sides with the Event Models of §17.1 to §17.4.
3. **What each carries:** the DTO of §14.10, with IDs, amounts, references, and timestamps only, no contact details.
4. **Why and when each fires:** the When column of §14.10, cited to the use case step.

Out of scope: events that never leave one module; provider notifications from CardPay Ltd and the purchase feed of Point-of-Sale Records, which are REST callbacks or a feed normalised at their adapters (API-05, API-06, API-08); integration events on a broker, of which there are none in this release.

## 14.2 Hub Topology Decision

Not applicable - no integration events (in-process domain events: §14.10).

### 14.2.1 Async Backbone (the universal per-event mechanism)

Not applicable - no integration events (in-process domain events: §14.10).

### 14.2.2 Hub Topology & Fan-Out Landscape

Not applicable - no integration events (in-process domain events: §14.10).

## 14.3 Standard Event Envelope (every event, every topic)

Not applicable - no integration events (in-process domain events: §14.10).

## 14.4 Topic Registry

Not applicable - no integration events (in-process domain events: §14.10).

## 14.5 Platform Event Catalog

Not applicable - no integration events (in-process domain events: §14.10).

## 14.6 Cross-Cutting Event Guarantees

Not applicable - no integration events (in-process domain events: §14.10).

## 14.7 Universal Subscribers & Cross-Service Doctrines

- **No universal subscriber:** no module listens to every event; listeners are named per event in §14.10.
- **Status-change doctrine:** refund-request alone publishes refund status changes; payout publishes payout facts (`PayoutSucceeded`, `PayoutFailed`, `CardDisputeDecided`) that only refund-request handles, and refund-request turns them into its own status-change events, which the notification and loyalty-points modules handle. No listener of a payout fact other than refund-request changes a refund's status.
- **Personal data doctrine:** no event carries customer contact details or member data beyond identifiers; the notification relay reads contact details through `CustomerContactPort` (API-03) at send time, and no event listener reads them.
- **Outcome doctrine for Loyalty Points:** every refund outcome that Loyalty Points needs ([REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request) BR-3: Loyalty Points is told; [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) BR-9: Loyalty Points is told the outcome) is a refund-request event that loyalty-points keeps in its inbox, also before its go-live. The BRDs rate this flow Important ([REFUNDS 08 § Integrations](../brd-refunds-portal/08-integrations.md#integrations)) and Critical ([LOYALTY 08 § Integrations](../brd-loyalty-points/08-integrations.md#integrations)); the platform runs it as Critical: late take-backs are SEV2 (§20.2), and the publication-log age alert of §11.4 covers it.

## 14.8 Consistency Notes & Open Flags

No divergence is open: every event name, publisher module, listener list, and DTO in the Event Models of §17.1 to §17.4 matches §14.10 from both sides.

## 14.9 Payload Contract Samples

Not applicable - no integration events (in-process domain events: §14.10).

### 14.9.0 Common Value Objects

| Value object | Fields | Used by |
|---|---|---|
| `Money` | `amount decimal(19,4)`, `currency string(ISO-4217)` | `approvedAmount` of `RefundRequestApprovedDto`, `paidAmount` of `RefundRequestPaidDto` and `PayoutSucceededDto`; `approvedAmount` of `ApprovedRefund` (API-09) |

### 14.9.99 Coverage Matrix

0 integration events: no §14.5 catalog row and no payload contract. The 11 in-process domain events of §14.10 carry their DTOs there.

## 14.10 In-Process Domain Events (modular monolith / hybrid core)

**Delivery:** Durable - recorded in the publication log (§11.1) in the publisher's transaction, redelivered until every listener completes.

| Event | Publisher module | Listener modules | When | Transaction phase (before commit / after commit) | Payload (DTO) | Status | Notes |
|---|---|---|---|---|---|---|---|
| `RefundRequestSubmitted` | refund-request | notification | [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) step 7 | after commit | `RefundRequestSubmittedDto`: refundRequestId, referenceNumber, submittedAt, aggregateVersion | candidate | No contact details in the payload |
| `RefundRequestApproved` | refund-request | payout, notification | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 8 | after commit | `RefundRequestApprovedDto`: refundRequestId, referenceNumber, branchId, receiptNumber, originalPaymentRef, approvedAmount, partial, decisionReason, approvedAt, aggregateVersion | candidate | Starts the payout; A1 sets `partial` |
| `RefundRequestRejected` | refund-request | notification, loyalty-points | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) A2 | after commit | `RefundRequestRejectedDto`: refundRequestId, referenceNumber, receiptNumber, reason, rejectedAt, aggregateVersion | candidate | Also fired by `CardDisputeDecided` with a refund to the customer |
| `RefundRequestCancelled` | refund-request | notification, loyalty-points | [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request) step 5 | after commit | `RefundRequestCancelledDto`: refundRequestId, referenceNumber, receiptNumber, cancelledAt, aggregateVersion | candidate | |
| `RefundRequestPaid` | refund-request | notification, loyalty-points | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 9 | after commit | `RefundRequestPaidDto`: refundRequestId, referenceNumber, receiptNumber, paidAmount, paidAt, aggregateVersion | candidate | Fired by `PayoutSucceeded` |
| `RefundRequestReturnedToApproved` | refund-request | notification, loyalty-points | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1 | after commit | `RefundRequestReturnedToApprovedDto`: refundRequestId, referenceNumber, receiptNumber, returnedAt, aggregateVersion | candidate | A paid payout sent back |
| `RefundPayoutDelayed` | refund-request | notification | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1 | after commit | `RefundPayoutDelayedDto`: refundRequestId, referenceNumber, delayedAt, aggregateVersion | candidate | First refusal of a payout; status stays Approved |
| `PayoutSucceeded` | payout | refund-request | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 9 | after commit | `PayoutSucceededDto`: payoutId, refundRequestId, paidAmount, paidAt, manualRecordedBy, manualConfirmedBy, aggregateVersion | candidate | Provider result or confirmed manual result |
| `PayoutFailed` | payout | refund-request | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1 | after commit | `PayoutFailedDto`: payoutId, refundRequestId, kind, failedAt, attempt, aggregateVersion | candidate | `kind`: `REFUSED` or `RETURNED` |
| `PayoutStillFailing` | payout | notification | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1 | after commit | `PayoutStillFailingDto`: payoutId, refundRequestId, branchId, firstFailedAt, aggregateVersion | candidate | Once per payout, after one day of failures |
| `CardDisputeDecided` | payout | refund-request | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) BR-8: payout waits for a card dispute | after commit | `CardDisputeDecidedDto`: disputeId, refundRequestId, outcome, decidedAt, aggregateVersion | candidate | `outcome`: `REFUNDED_TO_CUSTOMER` or `DISPUTE_REFUSED`; reported only if CardPay Ltd can report disputes (§12 INT-01) |

**[NEEDS CLARIFICATION: The DTO field types, required flags, and any further fields of the eleven in-process events beyond the identifiers, amounts, references, and timestamps listed. The BRDs' use cases imply the state changes but do not commit to a payload structure. Owner: Software Architect.]**

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 09-services-summary.md | NEXT: 11-api-contracts.md -->

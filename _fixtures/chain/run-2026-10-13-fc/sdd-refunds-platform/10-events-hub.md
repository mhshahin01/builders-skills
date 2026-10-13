<!--
CHUNK: 10
TITLE: Centralized Event Hub (Platform Event Catalog & Payload Contracts)
PROJECT: Refunds Platform
VERSION: 1.3
DEPENDS_ON: 05, 07, 08, 09
RECONCILES_WITH: every per-service chunk (13a, 13b, 13c, 13d) - Event Model sub-sections
PART OF: SDD - Refunds Platform
PURPOSE: Single cross-module catalog of every platform event - name, publisher, listeners, payload contract, business what/when/why.
CONSISTENCY_RULE: This chunk is the platform contract registry. Event names and DTOs here MUST match the per-module chunks character-for-character. Listener lists are reconciled from BOTH sides. Divergences are flagged in §14.8, never silently reconciled.
-->

# 14. Centralized Event Hub (Platform Event Catalog & Payload Contracts)

> **What this chunk is.** The one place that lists every event on the platform with its publisher, listeners, payload contract, and business meaning. In this release every event is an in-process domain event between modules of the one deployable (§14.10); no event crosses a broker (ADR-02).

---

## 14.1 Purpose & Scope

The platform is a modular monolith (ADR-01): a state change one module needs from another travels as a durable in-process domain event, recorded in the publisher's publication log in the same transaction and delivered to each listener after commit (§11.1, ADR-02). Synchronous calls between modules are port calls (§15), one hop at most.

1. **What events exist:** the in-process domain events of §14.10, published by `refund-request` and `payout`.
2. **Who publishes and who listens:** §14.10, reconciled from both sides against the Event Models of §17.1 to §17.4.
3. **What each event carries:** its fields and their types in §14.10.
4. **Why and when each fires:** the When and Notes columns of §14.10.

Out of scope: events that never leave one module (for example a points movement inside `loyalty-points`); provider callbacks (API-02, API-05, API-09), which are REST calls contracted in §15; the receipt lookup (API-04).

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

- **customer-notification** listens to every refund status event that carries a customer message and to the two payout failure events; it never publishes.
- **loyalty-points** listens to every refund outcome the Refunds Portal reports to Loyalty Points (`RefundRequestPaid`, `RefundRequestRejected`, `RefundRequestCancelled`, `RefundRequestPayoutReturned`: [REFUNDS 08 § Integrations](../brd-refunds-portal/08-integrations.md#integrations)); it never publishes.
- **Refund status doctrine:** only `refund-request` publishes facts about a refund request's status. `payout` publishes payout facts (`PayoutSucceeded`, `PayoutReturned`, `PayoutCancelled`, `PayoutAttemptFailed`, `PayoutStillFailing`) and card dispute facts (`CardPaymentDisputeOpened`, `CardPaymentDisputeClosed`); `refund-request` is the only listener of `PayoutSucceeded`, `PayoutReturned`, and `PayoutCancelled` and re-publishes the domain facts `RefundRequestPaid`, `RefundRequestPayoutReturned`, and `RefundRequestRejected`. Other modules that care about a refund outcome (`loyalty-points`, `customer-notification`) listen to the `refund-request` events, never to the payout facts behind them.
- **Idempotent listeners:** every listener deduplicates on the event id, or on a business key where §17.X states one (`loyalty-points` on the refund reference).
- **Saga doctrine:** every cross-module business flow is a choreographed saga of the in-process events of §14.10; no module orchestrates another. One saga crosses modules in this release, the refund saga ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund), §8.4.1 to §8.4.3):
  1. `refund-request` approves (`RefundRequestApproved`); timeout owner: `refund-request` for the decision time before it (the `late` flag, §17.1).
  2. `payout` pays out (`PayoutSucceeded`, or `PayoutAttemptFailed` and `PayoutStillFailing`), holding the payout while the original card payment has an open card dispute; timeout owner: `payout` for the retry stop time (§17.2, open in REFUNDS).
  3. `refund-request` marks the request Paid (`RefundRequestPaid`); timeout owner: `refund-request` for the approved-to-paid deadline of 3 days (REFUNDS Business Objective 1; alert in §11.4).
  4. `loyalty-points` takes points back; timeout owner: `loyalty-points` for the LOYALTY/NFR-02 budget (§18.5).
  `customer-notification` listens to steps 1 to 3 and never changes the saga. Compensating steps: a payout that has not paid, whose original payment's dispute the bank refunded to the customer, is cancelled (`PayoutCancelled`) and the request becomes Rejected (`RefundRequestRejected`), with no payout ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) BR-8: payout waits for a card dispute); a Paid refund whose payout the customer's bank sends back returns to step 2 (`PayoutReturned`, then `RefundRequestPayoutReturned`: [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1), and what it does to the points taken back in step 4 is open (§17.4 Other refund outcomes). A payout that can never succeed (§17.2 never-succeeds marker) is still open in REFUNDS; its answer adds a compensating step.

## 14.8 Consistency Notes & Open Flags

Full reconciliation achieved: the events of §14.10 match the in-process tables of §17.1 to §17.4 by name, publisher module, listener modules, and DTO name, from both sides. No divergence is open.

| # | Where (chunks) | Divergence | Resolution / flag | Status |
|---|---|---|---|---|
| - | - | None | - | - |

## 14.9 Payload Contract Samples

Not applicable - no integration events (in-process domain events: §14.10).

### 14.9.0 Common Value Objects

| Value object | Fields | Used by |
|---|---|---|
| `Money` | `amount decimal(19,4)`, `currency string(ISO-4217)` | `approvedAmount` (`RefundRequestApprovedDto`), `refundedAmount` (`RefundRequestPaidDto`) and the per-unit amounts of both (§14.10) |

### 14.9.99 Coverage Matrix

0 integration events; the in-process domain events are listed in §14.10.

| Event | Catalog (§14.5) | Contract (§14.9 / registry) | Status |
|---|---|---|---|
| - | - | - | - |

## 14.10 In-Process Domain Events (modular monolith / hybrid core)

**Delivery:** Durable - recorded in the publication log (§11.1) in the publisher's transaction, redelivered until every listener completes.

**Ordering:** none guaranteed; a redelivered event can reach a listener after later events of the same refund request. Every `refund-request` event carries `sequence`, the number of the decision-record row it reports, so a listener can tell an older status from a newer one; `customer-notification` drops stale messages by it (§17.3 Select), and `loyalty-points` applies refund outcomes in its order (§17.4 Other refund outcomes). Every payout event about one payout carries `sequence` too, the number of the payout's status change, so `refund-request` ignores a payout fact older than one it has handled (§17.1 Ordering of payout events). Both card dispute events carry `sequence`, the number of the dispute's state change in `payout`, so `refund-request` ignores a dispute fact older than one it has handled for that dispute (§17.1 Decide).

**Committed payload fields.** Every DTO carries `eventId`, `tenantId`, and `occurredAt` (UTC); every DTO except the two card dispute DTOs also carries `refundRequestId`; every `refund-request` DTO, every payout DTO, and both card dispute DTOs also carry `sequence` (Ordering, above). On top of these:

- `RefundRequestSubmittedDto`, `RefundRequestRejectedDto`, `RefundRequestCancelledDto`, `RefundRequestPayoutReturnedDto`: `referenceNumber` (the LOYALTY refund reference, §5); Rejected also `reason` and `rejectionKind` (`DECISION` for a branch manager's rejection, `DISPUTE_REFUNDED` when the customer's bank refunded the disputed payment).
- `RefundRequestApprovedDto`: `referenceNumber`, `branchId`, `originalPaymentReference` (from the receipt lookup, for the payout and the dispute hold, §17.2), `approvedAmount` (`Money`), the approved amount of each unit, `partial` (true when a unit was lowered) and `reason` (partial only). `payout` keeps `branchId` with the payout, because it does not own the request.
- `RefundRequestPaidDto`: `referenceNumber` (the LOYALTY refund reference, §5), `receiptNumber` (the purchase link of the §5 marker), `paidDate`, `refundedAmount` (`Money`, the approved amount paid back) and the refunded amount of each unit ([LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-1: partial refund takes back 1 point per 1 EUR refunded).
- `PayoutSucceededDto`, `PayoutAttemptFailedDto`, `PayoutReturnedDto`: `payoutId`; `PayoutSucceededDto` also `resolvedBy` and `confirmedBy` (IAM user ids), present only for a payout resolved by hand (§17.2 Send).
- `PayoutCancelledDto`: `payoutId`, `reason` (the customer's bank refunded the disputed payment).
- `PayoutStillFailingDto`: `payoutId`, `branchId` (from the payout, for the recipient lookup of §17.3).
- `CardPaymentDisputeOpenedDto`, `CardPaymentDisputeClosedDto`: `disputeId` (CardPay's), `originalPaymentReference`; Closed also `outcome` (refunded to the customer, or refused).

No payload carries a customer contact detail or a member identifier (§11.6). The receipt number and the amounts in `RefundRequestPaidDto`, and the original-payment reference in the card dispute DTOs, are purchase and payment data: they stay in the publisher's `event_publication.payload` only until the completed row is purged (§11.1), and the operations privileges of §16.4.3 do not include that column.

These are the complete DTOs of this release; a new field is an additive change (AP-10). Field types:

| Field | Type | Notes |
|---|---|---|
| `eventId`, `tenantId`, `refundRequestId`, `payoutId` | UUIDv7 | - |
| `occurredAt` | timestamp | ISO-8601, UTC |
| `sequence` | integer, from 1 | Per refund request (`refund-request` DTOs), per payout (payout DTOs), or per dispute (card dispute DTOs) |
| `referenceNumber`, `receiptNumber`, `branchId`, `originalPaymentReference`, `disputeId` | string | As their source gives them: the reference number sequence of §17.1; POS Records for the receipt, branch, and payment; CardPay for the dispute |
| `reason` | string | The reason as given; in `PayoutCancelledDto`, the code `DISPUTE_REFUNDED` |
| `rejectionKind` | `DECISION` or `DISPUTE_REFUNDED` | `RefundRequestRejectedDto` |
| `approvedAmount`, `refundedAmount` | `Money` (§14.9.0) | - |
| Per-unit amounts | list of `itemLine` (integer), `unitNo` (integer), `amount` (`Money`) | `RefundRequestApprovedDto`, `RefundRequestPaidDto` |
| `partial` | boolean | `RefundRequestApprovedDto` |
| `paidDate` | date | ISO-8601, branch-local |
| `outcome` | `REFUNDED_TO_CUSTOMER` or `REFUSED` | `CardPaymentDisputeClosedDto` |
| `resolvedBy`, `confirmedBy` | string | IAM user ids; `PayoutSucceededDto`, only for a payout resolved by hand |

| Event | Publisher module | Listener modules | When | Transaction phase (before commit / after commit) | Payload (DTO) | Status | Notes |
|---|---|---|---|---|---|---|---|
| `RefundRequestSubmitted` | refund-request | customer-notification | [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) step 7 | after commit | `RefundRequestSubmittedDto`: fields above | candidate | The submission message with the reference number. |
| `RefundRequestApproved` | refund-request | payout, customer-notification | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 8 | after commit | `RefundRequestApprovedDto`: fields above | candidate | `payout` creates the payout; `customer-notification` sends the approval message: partial (A1) or full (step 8). |
| `RefundRequestRejected` | refund-request | customer-notification, loyalty-points | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) A2, BR-8: payout waits for a card dispute | after commit | `RefundRequestRejectedDto`: fields above | candidate | The rejection message with the reason; the outcome Loyalty Points is told, with no take-back. |
| `RefundRequestCancelled` | refund-request | customer-notification, loyalty-points | [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request) step 5 | after commit | `RefundRequestCancelledDto`: fields above | candidate | The cancellation email; the outcome Loyalty Points is told, with no take-back. |
| `RefundRequestPaid` | refund-request | customer-notification, loyalty-points | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 9 | after commit | `RefundRequestPaidDto`: fields above | candidate | The paid message; the take-back of [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-1. |
| `RefundRequestPayoutReturned` | refund-request | customer-notification, loyalty-points | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1 | after commit | `RefundRequestPayoutReturnedDto`: fields above | candidate | A Paid request back to Approved: the back-to-Approved message; the outcome Loyalty Points is told (§17.4). |
| `PayoutSucceeded` | payout | refund-request | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 9 | after commit | `PayoutSucceededDto`: fields above | candidate | `refund-request` marks the request Paid. |
| `PayoutReturned` | payout | refund-request | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1 | after commit | `PayoutReturnedDto`: fields above | candidate | The customer's bank sent a paid payout back; `refund-request` moves the request back to Approved. |
| `PayoutCancelled` | payout | refund-request | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) BR-8: payout waits for a card dispute | after commit | `PayoutCancelledDto`: fields above | candidate | A payout whose original payment's dispute the bank refunded to the customer before the payout paid; `refund-request` marks the request Rejected. |
| `CardPaymentDisputeOpened` | payout | refund-request | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E3 | after commit | `CardPaymentDisputeOpenedDto`: fields above | candidate | `refund-request` shows the open dispute at decision time. |
| `CardPaymentDisputeClosed` | payout | refund-request | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) BR-8: payout waits for a card dispute | after commit | `CardPaymentDisputeClosedDto`: fields above | candidate | `refund-request` marks the dispute closed in its copy. |
| `PayoutAttemptFailed` | payout | customer-notification | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1 | after commit | `PayoutAttemptFailedDto`: fields above | candidate | First failure of a payout's first round: the customer is told it is delayed. |
| `PayoutStillFailing` | payout | customer-notification | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1 | after commit | `PayoutStillFailingDto`: fields above | candidate | Once per round, one day after the round's first attempt: the branch manager is told. |

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 09-services-summary.md | NEXT: 11-api-contracts.md -->

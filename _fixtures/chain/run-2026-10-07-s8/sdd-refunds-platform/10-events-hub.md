<!--
CHUNK: 10
TITLE: Centralized Event Hub (Platform Event Catalog & Payload Contracts)
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: 05, 07, 08, 09
RECONCILES_WITH: every per-service chunk (13a, 13b, ...) - Event Model + Messaging Infra sub-sections
PART OF: SDD - Refunds Platform
PURPOSE: Single cross-service catalog of every platform event - name, producer, consumers, envelope, payload contract, business what/when/why - plus the centralized event-hub topology. Consolidates what is otherwise distributed across the per-service Event Models.
CONSISTENCY_RULE: This chunk is the platform contract registry. Topic names, event names, envelope fields, and payload contracts here MUST match the per-service chunks character-for-character. Consumer lists are reconciled from BOTH sides (each producer's published table AND each consumer's consumed table). Where a per-service spec and this catalog disagree, the divergence is flagged in the Consistency Notes section (§14.8) and fixed on the wrong side, never silently reconciled; a name the user has already seen keeps its registry spelling (SKILL.md principle 14).
-->

# 14. Centralized Event Hub (Platform Event Catalog & Payload Contracts)

> **What this chunk is.** The one place that lists **every event on the platform** with its producer, consumers, key family, payload contract, and business meaning (what / when / why), plus the hub topology that carries them. It is a derived consolidation of the per-service Event Models (each `13x` chunk § Event-Driven Architecture). Downstream LLD generation and implementers read this chunk as the single contract surface - the key goal is a smooth implementation with no producer/consumer mismatches.

---

## 14.1 Purpose & Scope

The platform is a modular monolith with no integration events (ADR-01, ADR-02): every state change that another module needs travels as a durable in-process domain event (§14.10), recorded in the publication log in the publisher's transaction and delivered after commit; synchronous calls between modules are the three ports of §15, one hop deep.

1. **What events exist:** 10 in-process domain events from 2 publishing modules: refund-requests publishes 8 and payouts publishes 2 (§14.10). There are 0 integration events and 0 topics.
2. **Who produces and who consumes each:** the Publisher module and Listener modules columns of §14.10, reconciled with the in-process tables of 13a to 13e.
3. **What each event carries:** one DTO per event (§14.10), sharing the value objects of §14.9.0. Every DTO carries `tenantId` and `correlationId`, so a listener runs in its publisher's tenant without a request (§11.2).
4. **Why and when each fires:** the When column (the use case step that fires it) and the Notes column of §14.10.

Out of scope: steps inside one module that no other module handles; provider callbacks and feeds (API-04, API-07, API-08, API-09), which are inbound HTTP calls (§15), not events; the outside systems' own events.

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

- **notifications** listens to every refund event that needs a message: `RefundRequestSubmitted`, `RefundRequestCancelled`, `RefundRequestRejected`, `RefundPaid`, `RefundPayoutFailed`, `WaitingRequestsSummarised`. It never listens to payouts' events.
- **Outcome re-publication:** the payout outcome events (`PayoutSucceeded`, `PayoutFailedFinally`) are handled only by refund-requests, which publishes the domain facts `RefundPaid` and `RefundPayoutFailed` that other modules handle.
- **Leave the process only from the publication log:** every call to an outside system that follows a state change runs from the publication log (the outbox) after commit, as the listener's first try or by the send job of its module (§11.1), never inside the business transaction (ADR-02); the synchronous exceptions are listed in §8.1.1.
- **No contact details in events:** listeners fetch contact details through API-12 and API-13 when they need them (ADR-05).

## 14.8 Consistency Notes & Open Flags

Full reconciliation achieved: every in-process table of 13a to 13e matches §14.10 by event name, publisher module, listener modules, and payload, from both sides, and each module's Input table lists the events it handles. The register has no row.

| # | Where (chunks) | Divergence | Resolution / flag | Status |
|---|---|---|---|---|

## 14.9 Payload Contract Samples

Not applicable - no integration events (in-process domain events: §14.10).

### 14.9.0 Common Value Objects

| Value object | Fields | Used by |
|---|---|---|
| `Money` | `amount decimal(19,4)`, `currency string(ISO-4217)` | The amounts in the §14.10 DTOs |

### 14.9.99 Coverage Matrix

0 integration events: no row. The 10 in-process domain events are catalogued in §14.10.

## 14.10 In-Process Domain Events (modular monolith / hybrid core)

**Delivery:** Durable - recorded in the publication log (§11.1) in the publisher's transaction, redelivered until every listener completes.

**Contract ownership:** the DTO records of `RefundRequestApproved`, `PayoutSucceeded`, and `PayoutFailedFinally` are declared in the published API package of payouts; refund-requests publishes the first and handles the other two, so refund-requests depends on payouts and payouts on no other module. Every other DTO is declared by its publisher.

| Event | Publisher module | Listener modules | When | Transaction phase (before commit / after commit) | Payload (DTO) | Notes |
|---|---|---|---|---|---|---|
| `RefundRequestSubmitted` | refund-requests | notifications, customer-accounts, refund-requests (POS adapter) | [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) step 6 | after commit | `RefundRequestSubmittedDto`: tenantId, correlationId, refundRequestId, referenceNumber, customerAccountId, branchId, branchCountry, purchaseReference, itemRefs, requestedAmount (Money), businessDate, submittedAt | notifications: customer message; customer-accounts: one more linked request. Carries the branch-local business date and the branch country. |
| `RefundRequestCancelled` | refund-requests | notifications, refund-requests (POS adapter) | [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request) step 5 | after commit | `RefundRequestCancelledDto`: tenantId, correlationId, refundRequestId, referenceNumber, customerAccountId, branchId, branchCountry, businessDate, cancelledAt | Customer message. Carries the branch-local business date and the branch country. |
| `RefundRequestApproved` | refund-requests | payouts | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 6 | after commit | `RefundRequestApprovedDto`: tenantId, correlationId, refundRequestId, referenceNumber, branchId, approvedAmount (Money), originalPaymentReference, approvedAt | Starts the payout |
| `RefundRequestRejected` | refund-requests | notifications, refund-requests (POS adapter) | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) A2 | after commit | `RefundRequestRejectedDto`: tenantId, correlationId, refundRequestId, referenceNumber, customerAccountId, branchId, branchCountry, reason, businessDate, rejectedAt | Customer message with the reason. Carries the branch-local business date and the branch country. |
| `PayoutSucceeded` | payouts | refund-requests | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 7 | after commit | `PayoutSucceededDto`: tenantId, correlationId, payoutId, refundRequestId, paidAmount (Money), succeededAt | refund-requests marks the request Paid |
| `PayoutFailedFinally` | payouts | refund-requests | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1 | after commit | `PayoutFailedFinallyDto`: tenantId, correlationId, payoutId, refundRequestId, attemptCount, failedAt | refund-requests marks the request Payout failed |
| `RefundPaid` | refund-requests | notifications, loyalty-points | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 7 | after commit | `RefundPaidDto`: tenantId, correlationId, refundRequestId, referenceNumber, customerAccountId, branchId, branchCountry, purchaseReference, paidAmount (Money), refundDate, partialReason (optional), paidAt | notifications: customer message with the amount paid; loyalty-points: points take-back ([LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-1: take back on paid refunds). Carries the branch-local business date and the branch country. |
| `RefundPayoutFailed` | refund-requests | notifications, refund-requests (POS adapter) | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1 | after commit | `RefundPayoutFailedDto`: tenantId, correlationId, refundRequestId, referenceNumber, customerAccountId, branchId, branchCountry, businessDate, failedAt | Branch manager, cover, and customer messages. Carries the branch-local business date and the branch country. |
| `WaitingRequestsSummarised` | refund-requests | notifications | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) BR-5: daily waiting-requests message | after commit | `WaitingRequestsSummarisedDto`: tenantId, correlationId, branchId, branchCountry, summaryDate, waitingCount, oldestSubmittedAt | Branch manager and cover message. Carries the branch-local business date and the branch country. |
| `RefundRequestUnlinked` | refund-requests | customer-accounts | None - platform | after commit | `RefundRequestUnlinkedDto`: tenantId, correlationId, refundRequestId, customerAccountId, unlinkedAt | Retention of [REFUNDS 03 § Refund records](../brd-refunds-portal/03-definitions-and-domain-concepts.md#refund-records); one less linked request |

**Field types:** `tenantId`, `correlationId`, `refundRequestId`, `customerAccountId`, and `payoutId` are UUIDs; `referenceNumber`, `branchId`, `purchaseReference`, `originalPaymentReference`, `reason`, and `partialReason` are strings, and `itemRefs` is a list of strings naming receipt lines and units; `branchCountry` is an ISO 3166-1 alpha-2 code; `businessDate`, `refundDate`, and `summaryDate` are branch-local ISO-8601 dates (§6 Time rule); the fields ending in `At` are ISO-8601 UTC timestamps; `waitingCount` and `attemptCount` are integers; `Money` is the value object of §14.9.0.

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 09-services-summary.md | NEXT: 11-api-contracts.md -->

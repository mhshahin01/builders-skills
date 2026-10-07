<!--
CHUNK: 07
TITLE: Event Contracts
PROJECT: Refunds Platform
VERSION: 1.0
PART OF: LLD - Refunds Platform
MODE: from-sdd
-->

# 10. Event Contracts

## 10.1 Topic Inventory

Not applicable - SDD §6 has no broker/integration topics for this release.

## 10.2 Event Schemas

[SDD §14.10](../sdd-refunds-platform/10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core) owns payload fields/types. Use record DTOs exactly as named; no payload copies here. Additive compatibility and a stable serialized publication shape are required across rolling releases.

## 10.3 Producer Specs (per topic)

No topics. An outgoing durable publication is inserted in the aggregate transaction; failures roll back both. Contract package ownership follows SDD AP-11.

## 10.4 Consumer Specs (per topic)

No consumer groups. Stable listener identity + source publication identity drives tenant/listener/event inbox deduplication. Business work and inbox commit together; listener completion follows that commit. Unknown provider outcomes retain work identity.

## 10.5 DLQ Strategy

No broker DLQ. Ten listener failures park inbox work, complete the publication and alert; replay uses the source runbook, never a second business key. PARKED is not silently purged.

## 10.6 In-Process Domain Events (SDD §14.10)

> **Delivery:** Durable - recorded in the publication log (§11.1) in the publisher's transaction, redelivered until every listener completes.

| Event | Publisher module | Listener modules | Transaction phase | Payload (DTO) | When |
| --- | --- | --- | --- | --- | --- |
| [`RefundRequestSubmitted`](../sdd-refunds-platform/10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core) | refund-requests | notifications, customer-accounts, refund-requests (POS adapter) | after commit | RefundRequestSubmittedDto | [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) step 6 |
| [`RefundRequestCancelled`](../sdd-refunds-platform/10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core) | refund-requests | notifications, refund-requests (POS adapter) | after commit | RefundRequestCancelledDto | [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request) step 5 |
| [`RefundRequestApproved`](../sdd-refunds-platform/10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core) | refund-requests | payouts | after commit | RefundRequestApprovedDto | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 6 |
| [`RefundRequestRejected`](../sdd-refunds-platform/10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core) | refund-requests | notifications, refund-requests (POS adapter) | after commit | RefundRequestRejectedDto | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) A2 |
| [`PayoutSucceeded`](../sdd-refunds-platform/10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core) | payouts | refund-requests | after commit | PayoutSucceededDto | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 7 |
| [`PayoutFailedFinally`](../sdd-refunds-platform/10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core) | payouts | refund-requests | after commit | PayoutFailedFinallyDto | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1 |
| [`RefundPaid`](../sdd-refunds-platform/10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core) | refund-requests | notifications, loyalty-points | after commit | RefundPaidDto | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 7 |
| [`RefundPayoutFailed`](../sdd-refunds-platform/10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core) | refund-requests | notifications, refund-requests (POS adapter) | after commit | RefundPayoutFailedDto | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1 |
| [`WaitingRequestsSummarised`](../sdd-refunds-platform/10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core) | refund-requests | notifications | after commit | WaitingRequestsSummarisedDto | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) BR-5: daily waiting-requests message |
| [`RefundRequestUnlinked`](../sdd-refunds-platform/10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core) | refund-requests | customer-accounts | after commit | RefundRequestUnlinkedDto | None - platform |

Contract ownership: `RefundRequestApprovedDto`, `PayoutSucceededDto`, `PayoutFailedFinallyDto` live in payouts API package. Other catalog DTOs belong to publisher. Internal `CustomerAccountClosed` remains customer-accounts-only as [SDD 13a](../sdd-refunds-platform/13a-service-customer-accounts.md#business-logic) specifies; it is not an eleventh central catalog event.


<!-- MASTER: refunds-platform-lld-master.md | PREV: 06-api-contracts.md | NEXT: 08-state-and-rules.md -->

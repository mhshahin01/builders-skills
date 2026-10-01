<!--
CHUNK: 07
TITLE: Event Contracts
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: 04, 05
PART OF: LLD - Refunds Platform
-->

# 10. Event Contracts

> **Broker:** Not applicable - no broker in this release ([SDD §6 Event Broker / Streaming row](../sdd-refunds-platform/02-ecosystem-overview.md#6-ecosystem-overview), ADR-02). § 10.1-10.5 cover integration events on the broker; a modular monolith with none writes `Not applicable - no broker` there, and its in-process domain events are in § 10.6.
>
> **Schema registry:** Not applicable - no broker; the event DTOs are Java records in each publisher's `api` package, changed additively only (SDD §14.10 rule 7, AP-10).
>
> **Serialisation:** JSON (Jackson) in the event publication log, through `PiiEncryptingEventSerializer`, which encrypts the `pii` fields of `ContactPoint` (SDD §14.10 rule 8).

## 10.1 Topic Inventory

Not applicable - no broker (SDD §14.4 Topic Registry: no topics, ADR-02).

## 10.2 Event Schemas

Not applicable - no broker. The in-process DTOs are referenced in § 10.6; their fields stay in [SDD §14.10](../sdd-refunds-platform/10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core) and the value objects in [SDD §14.9.0](../sdd-refunds-platform/10-events-hub.md#1490-common-value-objects).

## 10.3 Producer Specs (per topic)

Not applicable - no broker.

## 10.4 Consumer Specs (per topic)

Not applicable - no broker. In-process listener idempotency is in § 10.6.

## 10.5 DLQ Strategy

Not applicable - no broker and no DLQ (SDD §20.1.3). The equivalent for in-process events: a publication re-delivered the maximum number of times stops being re-delivered, raises `event_publication_stuck_total`, and waits for the runbook procedure RB-02 (`10-operations.md` § 13.8); it is never dropped (SDD §14.10 rule 5).

## 10.6 In-Process Domain Events (SDD §14.10)

| Event | Publisher module | Listener modules | Transaction phase | Payload (DTO) | When |
|-------|------------------|------------------|-------------------|---------------|------|
| [`RefundSubmitted`](../sdd-refunds-platform/10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core) | `refund` | `notification` | after commit | `RefundSubmittedEvent` | [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) step 6 |
| [`RefundCancelled`](../sdd-refunds-platform/10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core) | `refund` | `notification` | after commit | `RefundCancelledEvent` | [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request) step 5 |
| [`RefundRejected`](../sdd-refunds-platform/10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core) | `refund` | `notification` | after commit | `RefundRejectedEvent` | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) A2 |
| [`RefundPaid`](../sdd-refunds-platform/10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core) | `refund` | `notification`, `loyalty` | after commit | `RefundPaidEvent` | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 7 |
| [`PayoutSucceeded`](../sdd-refunds-platform/10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core) | `payout` | `refund` | after commit | `PayoutSucceededEvent` | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 7 |
| [`PayoutFailed`](../sdd-refunds-platform/10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core) | `payout` | `notification` | after commit | `PayoutFailedEvent` | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1 |

> **Convention:** names, phase, DTO, and When match SDD §14.10 verbatim; the LLD adds only the publishing call and the listener classes in each module's 04 file (in the Spring stack, `ApplicationEventPublisher` and `@TransactionalEventListener` with the listed phase).

**Implementation delta** (publishing call, listener classes, listener identity, dedup):

| Event | Publishing call (inside the business transaction) | Listener (identity) | Dedup |
|-------|----------------------------------------------------|---------------------|-------|
| `RefundSubmitted` | `RefundRequestServiceImpl.submit` | `notification` `RefundEventsListener.on` (`notification.refund-submitted`) | Unique (`tenant_id`, `source_event_id`, `channel`, `recipient_key`) |
| `RefundCancelled` | `RefundRequestServiceImpl.cancel` | `notification` `RefundEventsListener.on` (`notification.refund-cancelled`) | Same key |
| `RefundRejected` | `RefundDecisionServiceImpl.decide` | `notification` `RefundEventsListener.on` (`notification.refund-rejected`) | Same key |
| `RefundPaid` | `RefundPaymentServiceImpl.onPayoutSucceeded` | `notification` `RefundEventsListener.on` (`notification.refund-paid`); `loyalty` `RefundPaidListener.on` (`loyalty.refund-paid`) | Notification key; unique (`tenant_id`, `refund_id`) on take-backs and pending take-backs |
| `PayoutSucceeded` | `PayoutDispatchServiceImpl.recordOutcome`, `PayoutReconciliationServiceImpl.reconcile` | `refund` `PayoutSucceededListener.on` (`refund.payout-succeeded`) | Approved to Paid transition and `payoutId` |
| `PayoutFailed` | `PayoutDispatchServiceImpl.recordOutcome` | `notification` `PayoutFailedListener.on` (`notification.payout-failed`) | Notification key per manager |

Every listener is `@ApplicationModuleListener` (asynchronous, after commit, its own transaction), sets `CallContext` from the DTO's `tenantId` and `correlationId`, and treats a violation of its own dedup key as handled (SDD §14.10 rule 3). Every DTO carries `eventId` (UUIDv7), `occurredAt`, `tenantId`, `correlationId` (SDD §14.10 rule 6), generated by the publishing call.

> Confirm: SDD §14.10 gives `PayoutSucceeded` one When (REFUNDS/UC-04 step 7), while SDD §17.2 also publishes it from the daily reconciliation of an Unknown payout; this LLD publishes it from both places in `payout` with the same DTO, so `refund` sees one event type whatever produced it, and a reconciled payout can turn a request Paid days after the approval.

<!-- MASTER: refunds-platform-lld-master.md | PREV: 06-api-contracts.md | NEXT: 08-state-and-rules.md -->

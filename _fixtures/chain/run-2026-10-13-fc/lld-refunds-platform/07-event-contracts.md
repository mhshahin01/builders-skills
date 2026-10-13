<!--
CHUNK: 07
TITLE: Event Contracts
PROJECT: Refunds Platform
VERSION: 1.2
DEPENDS_ON: 04, 05
PART OF: LLD - Refunds Platform
-->

# 10. Event Contracts

> **Broker:** none in this release (SDD [§6 Event Broker row](../sdd-refunds-platform/02-ecosystem-overview.md#6-ecosystem-overview), ADR-02). § 10.1-10.5 read `Not applicable - no broker`; every event is an in-process domain event (§ 10.6).
>
> **Schema registry:** not applicable (no broker). Event DTOs are Java records in each publishing module's `api` package; their JSON form in `event_publication.payload` is the serialised record (Jackson, part of Spring Boot).
>
> **Serialisation:** JSON (Jackson). Each DTO record carries exactly the committed fields of SDD [§14.10](../sdd-refunds-platform/10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core), no more; the version of the DTO a payload was written with is recorded on its publication-log row (`event_publication.schema_version`, from 1), not in the payload. Each DTO record declares `public static final int SCHEMA_VERSION` (a static constant, which Jackson never serialises, so the payload keeps exactly the committed fields); `DomainEventPublisher.publish` reads it from the event's DTO class and writes it to `event_publication.schema_version`; the publisher resolves the constant of every event type of the `ListenerRegistry` once at start-up, and the application does not start when one is missing, so a missing constant never fails a business write; an additive change to a DTO raises the constant by 1 in the same change. Changes are additive; a breaking change is a new event name (SDD [AP-10](../sdd-refunds-platform/06-principles-and-decisions.md#9-architecture-principles)). (1) Payloads are read with the Spring Boot-configured `ObjectMapper` (unknown properties ignored), never a new instance. (2) A field added in a later schema version is nullable in the DTO record, and each listener defines its behaviour when it is absent. (3) No field is removed, renamed, or retyped while an incomplete listener row of an older schema version exists; a breaking change is a new event name (SDD AP-10), and the old listener stays until the old event's incomplete rows reach zero.

## 10.1 Topic Inventory

Not applicable - no broker (SDD §14.4 Topic Registry: not applicable).

## 10.2 Event Schemas

Not applicable - no broker. The in-process event DTOs are in § 10.6.

## 10.3 Producer Specs (per topic)

Not applicable - no broker. Publishing is the publication log of § 10.6 and `09-cross-cutting.md` § 12.4.

## 10.4 Consumer Specs (per topic)

Not applicable - no broker. Listener idempotency is in § 10.6.

## 10.5 DLQ Strategy

Not applicable - no broker. An incomplete listener row plays the DLQ role: it is redelivered with backoff, never dropped, and raises `PublicationListenerLag` after 30 minutes, counted from the later of its event's publication and the switch-on of its product; the listeners of a switched-off product are not counted (SDD [§11.4](../sdd-refunds-platform/07-cross-cutting-concerns.md#114-observability-default), [§20.1.3](../sdd-refunds-platform/16-operations-runbook.md#2013-replay-dlq-messages), `10-operations.md` § 13.7).

## 10.6 In-Process Domain Events (SDD §14.10)

> **Delivery:** Durable, the value of the SDD [§14.10](../sdd-refunds-platform/10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core) Delivery line: recorded in the publisher's publication log in the state change's transaction and redelivered until every listener completes.
>
> **Ordering:** none guaranteed (SDD §14.10 Ordering); every `refund-request` event carries `sequence` (the number of the decision-record row it reports), every payout event the payout's `sequence`, and both card dispute events the dispute's `sequence`. Each listener uses it: `refund-request` keeps `last_payout_sequence` per request and `last_sequence` per dispute copy row; `customer-notification` keeps `refund_status_seen`, creates the messages of a stale status event `SUPERSEDED` (except the submission and approval messages), and sends the status messages of one request in `sequence` order; `loyalty-points` applies the refund outcomes of one request in `sequence` order through its refund-outcome log.

| Event | Publisher module | Listener modules | Transaction phase | Payload (DTO) | When |
|-------|------------------|------------------|-------------------|---------------|------|
| `RefundRequestSubmitted` | `refund-request` | `customer-notification` | after commit | `RefundRequestSubmittedDto` | [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) step 7 |
| `RefundRequestApproved` | `refund-request` | `payout`, `customer-notification` | after commit | `RefundRequestApprovedDto` | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 8 |
| `RefundRequestRejected` | `refund-request` | `customer-notification`, `loyalty-points` | after commit | `RefundRequestRejectedDto` | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) A2, BR-8: payout waits for a card dispute |
| `RefundRequestCancelled` | `refund-request` | `customer-notification`, `loyalty-points` | after commit | `RefundRequestCancelledDto` | [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request) step 5 |
| `RefundRequestPaid` | `refund-request` | `customer-notification`, `loyalty-points` | after commit | `RefundRequestPaidDto` | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 9 |
| `RefundRequestPayoutReturned` | `refund-request` | `customer-notification`, `loyalty-points` | after commit | `RefundRequestPayoutReturnedDto` | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1 |
| `PayoutSucceeded` | `payout` | `refund-request` | after commit | `PayoutSucceededDto` | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 9 |
| `PayoutReturned` | `payout` | `refund-request` | after commit | `PayoutReturnedDto` | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1 |
| `PayoutCancelled` | `payout` | `refund-request` | after commit | `PayoutCancelledDto` | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) BR-8: payout waits for a card dispute |
| `CardPaymentDisputeOpened` | `payout` | `refund-request` | after commit | `CardPaymentDisputeOpenedDto` | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E3 |
| `CardPaymentDisputeClosed` | `payout` | `refund-request` | after commit | `CardPaymentDisputeClosedDto` | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) BR-8: payout waits for a card dispute |
| `PayoutAttemptFailed` | `payout` | `customer-notification` | after commit | `PayoutAttemptFailedDto` | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1 |
| `PayoutStillFailing` | `payout` | `customer-notification` | after commit | `PayoutStillFailingDto` | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1 |

### Implementation delta

| Event | Publishing call | Listener classes (listener id) | Listener dedup |
|-------|-----------------|--------------------------------|----------------|
| `RefundRequestSubmitted` | `RefundRequestServiceImpl.submit` | `RefundEventMessageListener.onSubmitted` (`customer-notification.refund-request-submitted`) | `message (tenant_id, event_id, channel)`; `refund_status_seen` |
| `RefundRequestApproved` | `RefundDecisionServiceImpl.decide` | `RefundRequestApprovedListener.on` (`payout.refund-request-approved`); `RefundEventMessageListener.onApproved` (`customer-notification.refund-request-approved`) | `processed_event` + unique payout per request; `message` key |
| `RefundRequestRejected` | `RefundDecisionServiceImpl.decide` (`DECISION`), `RefundDecisionServiceImpl.rejectForRefundedDispute` (`DISPUTE_REFUNDED`) | `RefundEventMessageListener.onRejected` (`customer-notification.refund-request-rejected`); `RefundRequestRejectedListener.on` (`loyalty-points.refund-request-rejected`) | `message` key; `refund_outcome (tenant_id, event_id)` |
| `RefundRequestCancelled` | `RefundRequestServiceImpl.cancel` | `RefundEventMessageListener.onCancelled` (`customer-notification.refund-request-cancelled`); `RefundRequestCancelledListener.on` (`loyalty-points.refund-request-cancelled`) | `message` key; `refund_outcome` |
| `RefundRequestPaid` | `RefundDecisionServiceImpl.markPaid` | `RefundEventMessageListener.onPaid` (`customer-notification.refund-request-paid`); `RefundRequestPaidListener.on` (`loyalty-points.refund-request-paid`) | `message` key; `refund_outcome`, then the `processed_refund` inbox (refund reference) |
| `RefundRequestPayoutReturned` | `RefundDecisionServiceImpl.returnToApproved` | `RefundEventMessageListener.onPayoutReturned` (`customer-notification.refund-request-payout-returned`); `RefundRequestPayoutReturnedListener.on` (`loyalty-points.refund-request-payout-returned`) | `message` key; `refund_outcome` |
| `PayoutSucceeded` | `PayoutServiceImpl.recordResult`, `PayoutServiceImpl.applyOpenResolutions` | `PayoutSucceededListener.on` (`refund-request.payout-succeeded`) | `processed_event` + `last_payout_sequence` + state check |
| `PayoutReturned` | `PayoutServiceImpl.recordReturn` | `PayoutReturnedListener.on` (`refund-request.payout-returned`) | `processed_event` + `last_payout_sequence` + state check |
| `PayoutCancelled` | `PayoutServiceImpl.createForApproval`, `claimDue`, `applyOpenResolutions`; `CardPaymentDisputeServiceImpl.recordNotice` | `PayoutCancelledListener.on` (`refund-request.payout-cancelled`) | `processed_event` + `last_payout_sequence` + state check |
| `CardPaymentDisputeOpened` | `CardPaymentDisputeServiceImpl.recordNotice` | `CardPaymentDisputeOpenedListener.on` (`refund-request.card-payment-dispute-opened`) | `processed_event` + `card_dispute_copy.last_sequence` |
| `CardPaymentDisputeClosed` | `CardPaymentDisputeServiceImpl.recordNotice` | `CardPaymentDisputeClosedListener.on` (`refund-request.card-payment-dispute-closed`) | `processed_event` + `card_dispute_copy.last_sequence` |
| `PayoutAttemptFailed` | `PayoutServiceImpl.recordResult` and `PayoutServiceImpl.expireLeases` (first failure of round 1, a not-sent attempt and an expired lease included) | `PayoutEventMessageListener.onAttemptFailed` (`customer-notification.payout-attempt-failed`) | `message` key |
| `PayoutStillFailing` | `PayoutServiceImpl.raiseStillFailing` (once per round) | `PayoutEventMessageListener.onStillFailing` (`customer-notification.payout-still-failing`) | `message` key |

**Mechanics:** the publishing call runs `DomainEventPublisher.publish(event)` inside the state change's transaction; it inserts the `event_publication` row (with the DTO class's `SCHEMA_VERSION`) and one `event_publication_listener` row per listener id the `ListenerRegistry` holds for that event type, and registers a `TransactionSynchronization.afterCommit` hook. After commit, `PublicationDispatcher` hands each listener row of an enabled product to an executor task that claims the row, runs the listener in that listener module's own transaction, and then marks the listener row completed in a new transaction in the publisher's schema (`09-cross-cutting.md` § 12.4); the redelivery job retries what the hook did not complete. The `refund-request`, `payout`, and `customer-notification` listeners are dispatched only while `REFUNDS_PORTAL_ENABLED` is on and the `loyalty-points` listeners only while `LOYALTY_POINTS_ENABLED` is on; the rows of a switched-off product wait in the publisher's publication log and are delivered once it is switched on (SDD [§11.1](../sdd-refunds-platform/07-cross-cutting-concerns.md#111-db-modeling-default), [§11.5](../sdd-refunds-platform/07-cross-cutting-concerns.md#115-configuration-management-default)). There is no `@TransactionalEventListener` and no bare after-commit listener: a process stop between commit and dispatch leaves the listener rows for the redelivery job.

### Event DTO fields

The DTO records carry exactly the committed payload fields and field types of SDD [§14.10](../sdd-refunds-platform/10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core) (Committed payload fields), with `Money` per SDD [§14.9.0](../sdd-refunds-platform/10-events-hub.md#1490-common-value-objects); they are not restated here, and the LLD adds no field. A listener receives the DTO with an `EventMetadata` built from the publication-log row, not from the payload: the trace context, the correlation id, the listener id, and the schema version. No payload carries a customer contact detail or a member identifier; the purchase and payment data some payloads carry stay in `event_publication.payload` only until the completed row is purged, and the operations role cannot read that column (SDD [§11.6](../sdd-refunds-platform/07-cross-cutting-concerns.md#116-security-default), [§16.4.3](../sdd-refunds-platform/12-centralized-user-roles.md#1643-platform-plane-operator---outside-tenant-tenancy), `05-data-model.md` § 8.7).

> **Convention:** the Delivery value, event names, publisher and listener modules, phase, DTO names and fields, and When match SDD §14.10 verbatim; the LLD adds only the publishing call, the listener classes and ids, the dedup of each listener, and the publication log.

<!-- MASTER: refunds-platform-lld-master.md | PREV: 06-api-contracts.md | NEXT: 08-state-and-rules.md -->

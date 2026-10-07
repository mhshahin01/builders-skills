<!--
CHUNK: 07
TITLE: Event Contracts
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: 04, 05
PART OF: LLD - Refunds Platform
-->

# 10. Event Contracts

> **Broker:** Apache Kafka ([SDD §6](../sdd-refunds-platform/02-ecosystem-overview.md#6-ecosystem-overview) Event Broker / Streaming row; version NEEDS CLARIFICATION there). § 10.1-10.5 cover integration events on the broker; the core's in-process domain event is in § 10.6.
>
> **Schema registry:** the SDD §6 schema registry (product NEEDS CLARIFICATION there) - additive changes only (CLAUDE.md: backward compatibility on Kafka schemas), enforced by a CI compatibility check ([SDD §14.2](../sdd-refunds-platform/10-events-hub.md#142-hub-topology-decision)).
>
> **Serialisation:** JSON Schema - one subject per event, applied uniformly (SDD §6).

## 10.1 Topic Inventory

| Topic | Producer | Consumers | Key | Partitions | Retention | Cleanup policy |
|-------|----------|-----------|-----|------------|-----------|----------------|
| `refunds-platform-refund-events` | `refund-service` | `payout-service` (`REFUND_APPROVED` only), `notification-service` (all five) | `refundRequestId` | 6 | 7 days | delete |
| `refunds-platform-payout-events` | `payout-service` | `refund-service` | `refundRequestId` | 6 | 7 days | delete |
| `refunds-platform-refund-events.payout-service.dlq` | failed `payout-service` consumer | RB-02 replay (10 § 13.8) | original key | 1 | 7 days (same as the refund topic, ADR-10) | delete |
| `refunds-platform-refund-events.notification-service.dlq` | failed `notification-service` consumer | RB-02 replay | original key | 1 | 7 days (same as the refund topic, ADR-10) | delete |
| `refunds-platform-payout-events.refund-service.dlq` | failed `refund-service` consumer | RB-02 replay | original key | 1 | 30 days (no contact data) | delete |

> **Naming convention:** from an SDD, topic and event names are SDD §14.4 and §14.5 verbatim. From code with no SDD, the names the code uses; a new topic follows `<context>.<entity>.<event-type>` (CLAUDE.md spirit), lowercase, dot-separated.

Topic names, event names, consumer groups, and DLQ names are [SDD §14.4](../sdd-refunds-platform/10-events-hub.md#144-topic-registry), [§14.5](../sdd-refunds-platform/10-events-hub.md#145-platform-event-catalog), and the SDD §17.x Messaging Infra verbatim.

> TODO: partition counts (6 per topic, 1 per DLQ) and retention (7 days for the refund topic and its DLQs, bounded by ADR-10 and the SDD §20.1.3 replay window) are best guesses; the Kafka retention period is NEEDS CLARIFICATION in [SDD §6](../sdd-refunds-platform/02-ecosystem-overview.md#6-ecosystem-overview) - verify with the platform team.

## 10.2 Event Schemas

> **Source:** from an SDD, each event links its SDD §14.9 payload contract and adds only the implementation delta (record class, serializer, registry subject); names match SDD §14 verbatim and the payload stays in the SDD (`sdd-to-lld.md` § One fact, one home). Write the full schema below only from code with no SDD, or for an event the SDD does not define (flagged `> Confirm:`; hybrid: `🆕 code-only`).

Every event carries the [SDD §14.3 envelope](../sdd-refunds-platform/10-events-hub.md#143-standard-event-envelope-every-event-every-topic) as `EventEnvelope<T>` (commons), field names verbatim (`event_id`, `event_type`, `schema_version`, `aggregate_id`, `aggregate_type`, `aggregate_version`, `occurred_at`, `correlation_id`, `causation_id`, `tenant_id`, `payload`). Every payload is `candidate` in SDD §14.5, so producer and consumer are wired against the SDD §14.9 samples until the contracts are ratified.

| Event | Payload contract (SDD) | Producer record | Consumer records | Registry subject |
|-------|------------------------|-----------------|------------------|------------------|
| `REFUND_SUBMITTED` | [§14.9.1](../sdd-refunds-platform/10-events-hub.md#1491-refund_submitted---candidate) | `RefundSubmittedPayload` | notification: read as `JsonNode` by `RefundSubmittedContentMapper` | `refunds-platform-refund-events-REFUND_SUBMITTED` |
| `REFUND_CANCELLED` | [§14.9.2](../sdd-refunds-platform/10-events-hub.md#1492-refund_cancelled---candidate) | `RefundCancelledPayload` | notification: `RefundCancelledContentMapper` | `refunds-platform-refund-events-REFUND_CANCELLED` |
| `REFUND_APPROVED` | [§14.9.3](../sdd-refunds-platform/10-events-hub.md#1493-refund_approved---candidate) | `RefundApprovedPayload` | payout: `RefundApprovedForPayout` (no contact fields); notification: `RefundApprovedContentMapper` | `refunds-platform-refund-events-REFUND_APPROVED` |
| `REFUND_REJECTED` | [§14.9.4](../sdd-refunds-platform/10-events-hub.md#1494-refund_rejected---candidate) | `RefundRejectedPayload` | notification: `RefundRejectedContentMapper` | `refunds-platform-refund-events-REFUND_REJECTED` |
| `REFUND_PAID` | [§14.9.5](../sdd-refunds-platform/10-events-hub.md#1495-refund_paid---candidate) | `RefundPaidPayload` | notification: `RefundPaidContentMapper` | `refunds-platform-refund-events-REFUND_PAID` |
| `PAYOUT_SUCCEEDED` | [§14.9.6](../sdd-refunds-platform/10-events-hub.md#1496-payout_succeeded---candidate) | `PayoutSucceededPayload` | refund: `PayoutSucceededPayload` | `refunds-platform-payout-events-PAYOUT_SUCCEEDED` |
| `PAYOUT_FAILED` | [§14.9.7](../sdd-refunds-platform/10-events-hub.md#1497-payout_failed---candidate) | `PayoutFailedPayload` | refund: `PayoutFailedPayload` | `refunds-platform-payout-events-PAYOUT_FAILED` |

**Implementation delta:** Jackson serializes the envelope (`SNAKE_CASE` for envelope fields, the SDD camelCase for payload fields, `Money.amount` as a JSON number with 4 decimals, instants as ISO-8601 UTC); consumers disable `FAIL_ON_UNKNOWN_PROPERTIES` so additive fields never break them. The producer also sets Kafka headers `event_type`, `correlation_id`, and `traceparent`, so consumers filter and trace before deserializing (ADR-10 requires payout-service to filter by `event_type` before deserializing).

> Confirm: the registry subject naming (`<topic>-<EVENT_TYPE>`), the envelope field casing, and the `event_type` Kafka header are LLD conventions (SDD §14.3 defines the envelope fields, not their transport); verify with the platform team once the registry product is chosen.

> **Convention:** from an SDD, every event carries the SDD §14.3 envelope, field names verbatim, referenced and not restated. From code with no SDD, document the envelope the code uses; it carries an event id, event type, schema version, occurrence time, tenant key, aggregate id, and correlation and causation ids.

## 10.3 Producer Specs (per topic)

| Topic | Producer service | Outbox-emitted? | Acks | Retries | Compression |
|-------|------------------|-----------------|------|---------|-------------|
| `refunds-platform-refund-events` | `refund-service` | Yes (mandatory per CLAUDE.md), `refund.outbox_event` | `all` | Producer `retries` at its default with `enable.idempotence=true`; the relay re-sends unacknowledged rows | snappy |
| `refunds-platform-payout-events` | `payout-service` | Yes, `payout.outbox_event` | `all` | Same | snappy |

`aggregate_version` is the aggregate's `version` after the transition (refund request or payout), so consumers can order facts per aggregate ([SDD §14.6](../sdd-refunds-platform/10-events-hub.md#146-cross-cutting-event-guarantees) item 3). `REFUND_PAID` sets `causation_id` to the `event_id` of the `PAYOUT_SUCCEEDED` that caused it.

> **Outbox is mandatory** for all state-changing integration events (CLAUDE.md); the in-process domain events of § 10.6 do not use it. The producing service writes each event to its outbox table in the same transaction as the state change; a separate publisher sends it to Kafka and marks it processed only after the broker acknowledges (`acks=all`). Delivery is at-least-once. See `09-cross-cutting.md` § 12.4 and `04-implementation/<service>.md` § Pattern: Outbox.

## 10.4 Consumer Specs (per topic)

| Topic | Consumer service | Consumer group | Idempotency strategy | Failure policy |
|-------|------------------|----------------|---------------------|----------------|
| `refunds-platform-refund-events` | `payout-service` | `payout-service` | `RecordFilterStrategy` keeps only `event_type` = `REFUND_APPROVED`; inbox `(tenant_id, payout-service, event_id)`; unique payout per refund | Transient: retry 3 times (1 s, 2 s, 4 s) then DLQ; deserialization or schema failure: DLQ at once |
| `refunds-platform-refund-events` | `notification-service` | `notification-service` | Header filter on the five types; unique `(tenant_id, source_event_id, channel)` in the delivery log (SDD §17.3, no separate inbox) | Same |
| `refunds-platform-payout-events` | `refund-service` | `refund-service` | Inbox `(tenant_id, refund-service, event_id)`; transition guard (only from APPROVED) | Same; unknown request or amount mismatch: DLQ at once (non-retryable) |

Listener containers run with concurrency equal to the partition count and process each partition in order. Spring Kafka's `DefaultErrorHandler` with a `DeadLetterPublishingRecoverer` routes to `<topic>.<consumer group>.dlq`, keeping the original key and the original topic, partition, and offset headers; the recoverer's exception header must not carry payload values (09 § 12.7).

> **Convention per CLAUDE.md:** idempotency on every consumer. Assume at-least-once delivery everywhere: the outbox publisher re-sends an event whose processed update failed, with the same payload and `eventId`.

> TODO: 3 consumer retries at 1 s, 2 s, 4 s before the DLQ is a best guess; the attempts and delays are NEEDS CLARIFICATION in SDD §17.1, §17.2, and §17.3 Error Handling - verify with the operations team.

## 10.5 DLQ Strategy

- **Topic naming:** `<topic>.<consumer group>.dlq` ([SDD §14.4](../sdd-refunds-platform/10-events-hub.md#144-topic-registry)); a DLQ holds only failed copies, never a new event.
- **Retention:** the refund topic's DLQs share its retention (ADR-10: contact data); the payout DLQ keeps 30 days (§ 10.1).
- **Replay tool:** no re-publishing to the source topic ([SDD §14.2](../sdd-refunds-platform/10-events-hub.md#142-hub-topology-decision)): fix the cause, then reset the failed consumer group's offset on the source topic to the DLQ record's original offset, and let the inbox or delivery-log dedup make the replay safe (RB-02, 10 § 13.8).
- **Alerting:** any DLQ record raises an alert (SDD §11.4: DLQ depth above zero), paging for the refund-service and payout-service DLQs (money path), warning for the notification-service DLQ.

## 10.6 In-Process Domain Events (SDD §14.10)

| Event | Publisher module | Listener modules | Transaction phase | Payload (DTO) | When |
|-------|------------------|------------------|-------------------|---------------|------|
| [`RefundPaid`](../sdd-refunds-platform/10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core) | `refund-service` | `loyalty-service` | after commit | `RefundPaidEvent` | REFUNDS/UC-04 step 7; it realises LOYALTY/UC-02 BR-1: points taken back after a refund |

> **Convention:** names, phase, DTO, and When match SDD §14.10 verbatim; the LLD adds only the publishing call and the listener classes in each module's 04 file (in the Spring stack, `ApplicationEventPublisher` and `@TransactionalEventListener` with the listed phase).

**Publishing and listening classes:** `PayoutOutcomeServiceImpl` -> `RefundPaidPublisher` -> `RefundPaidPublisherAdapter` ([refund-service § 7.4](./04-implementation/refund-service.md#pattern-in-process-domain-event-with-durable-publication-log)); `RefundPaidListener` -> `TakebackServiceImpl` ([loyalty-service § 7.4](./04-implementation/loyalty-service.md#pattern-in-process-domain-event-listener-durable-publication-log)). The DTO `RefundPaidEvent` lives in `core-contracts` (03 § 6.1).

**Durable publication log (`core-eventing`), the implementation of SDD §11.1:**

```text
DurableEventPublisher.publish(tenantId, event):          (MANDATORY: inside the publisher's TX)
  for handler in handlers.forType(event.class):          (DomainEventHandler beans, keyed by listenerId)
    insert core_events.event_publication(id, tenantId, eventType, handler.listenerId, toJson(event), publishedAt = now)
  applicationEventPublisher.publishEvent(new PublicationsRecorded(ids))

EventPublicationDispatcher.onRecorded(PublicationsRecorded e):   @TransactionalEventListener(phase = AFTER_COMMIT) + @Async
  for id in e.ids: dispatch(id)

dispatch(id):   TX (REQUIRES_NEW)
  p = publications.findIncompleteForUpdateSkipLocked(id)  -> none: return (already done or taken)
  tenantContext.set(p.tenantId)
  handler(p.listenerId).handle(fromJson(p.payload))
  p.completedAt = now                                     (same TX as the listener's writes)
  on exception: rollback; separate TX: attempt_count + 1, last_attempt_at = now, last_error = exception class only

EventPublicationReplayJob:   @Scheduled every 1 min, advisory lock "event-publication-replay", worker role
  for p in incomplete publications with published_at < now - 1 min: dispatch(p.id)
```

**Delivery:** at-least-once and after commit only (ADR-05); the completion mark commits with the listener's own writes, so a crash before commit leaves the row incomplete and the replay job redelivers it; the listener is idempotent (loyalty § 7.4). An incomplete publication older than 30 minutes raises `EventPublicationStuck` (10 § 13.7), well inside the one-hour LOYALTY/NFR-02 budget.

> Confirm: `core_events.event_publication` is a hand-rolled log (no new dependency, CLAUDE.md) that carries `tenant_id` as SDD §11.2 requires; Spring Modulith's event publication registry is the off-the-shelf alternative but is a new dependency and its table has no `tenant_id` - decide before build.

> TODO: redelivery attempts before the alert are NEEDS CLARIFICATION in [SDD §17.4 Error Handling](../sdd-refunds-platform/13d-service-loyalty.md#error-handling); this LLD replays without limit every minute and alerts on age (30 minutes) instead of on an attempt count - verify.

<!-- MASTER: refunds-platform-lld-master.md | PREV: 06-api-contracts.md | NEXT: 08-state-and-rules.md -->

<!--
CHUNK: 07
TITLE: Event Contracts
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: 04, 05
PART OF: LLD - Refunds Platform
-->

# 10. Event Contracts

> **Broker:** Apache Kafka, one cluster (ADR-02; version not pinned, SDD §6).
>
> **Schema registry:** JSON Schema, additive-only, checked in CI (SDD §6, §14.2; registry product not pinned).
>
> **Serialisation:** JSON. Record value = the SDD §14.3 envelope with `payload{}`; record key = `aggregate_id`; headers `traceparent` (W3C) and `event_type` (for cheap filtering).
>
> **Homes:** topic names, event names, envelope, payload contracts, producers, and consumers are owned by the [SDD Centralized Event Hub](../sdd-refunds-platform/10-events-hub.md#145-platform-event-catalog) and match it character-for-character here. This chunk adds only consumer groups, DLQ configuration, client settings, and the Java records.

## 10.1 Topic Inventory

| Topic | Producer | Consumers | Key | Partitions | Retention | Cleanup policy |
|-------|----------|-----------|-----|------------|-----------|----------------|
| `refunds-platform-refund-events` | refund-service | payout-service, notification-service, loyalty-service | `aggregate_id` (refund id) | TBD (SDD §6) | TBD (SDD §6) | delete |
| `refunds-platform-payout-events` | payout-service | refund-service | `aggregate_id` (payout id) | TBD (SDD §6) | TBD (SDD §6) | delete |
| `refund-service.dlq` | refund-service (failed consumer records) | Operator redrive | original key | TBD | TBD | delete |
| `payout-service.dlq` | payout-service | Operator redrive | original key | TBD | TBD | delete |
| `notification-service.dlq` | notification-service | Operator redrive | original key | TBD | TBD | delete |
| `loyalty-service.dlq` | loyalty-service | Operator redrive | original key | TBD | TBD | delete |

> TODO: best guess 6 partitions per domain topic and 1 per DLQ, retention 7 days for domain topics and 30 days for DLQs; SDD §6 leaves partitions and retention open - verify (retention also sets the inbox and send-log cleanup age, `05-data-model.md` § 8.6).

> **Naming convention:** as SDD §14.2: one topic per producing context, `refunds-platform-<context>-events`; one dead-letter topic per consumer, `<consumer>.dlq`.

## 10.2 Event Schemas

The envelope is [SDD §14.3](../sdd-refunds-platform/10-events-hub.md#143-standard-event-envelope-every-event-every-topic); each payload contract is its SDD §14.9 section. Implementation delta per event:

| Event | Topic | Java payload record | Contract (home) |
|-------|-------|---------------------|-----------------|
| `REFUND_SUBMITTED` | `refunds-platform-refund-events` | `RefundSubmittedPayload` | [§14.9.1](../sdd-refunds-platform/10-events-hub.md#1491-refund_submitted---committed) |
| `REFUND_CANCELLED` | `refunds-platform-refund-events` | `RefundCancelledPayload` | [§14.9.2](../sdd-refunds-platform/10-events-hub.md#1492-refund_cancelled---committed) |
| `REFUND_APPROVED` | `refunds-platform-refund-events` | `RefundApprovedPayload` | [§14.9.3](../sdd-refunds-platform/10-events-hub.md#1493-refund_approved---committed) |
| `REFUND_REJECTED` | `refunds-platform-refund-events` | `RefundRejectedPayload` | [§14.9.4](../sdd-refunds-platform/10-events-hub.md#1494-refund_rejected---committed) |
| `REFUND_PAID` | `refunds-platform-refund-events` | `RefundPaidPayload` | [§14.9.5](../sdd-refunds-platform/10-events-hub.md#1495-refund_paid---committed) |
| `REFUND_PAYOUT_FAILED` | `refunds-platform-refund-events` | `RefundPayoutFailedPayload` | [§14.9.8](../sdd-refunds-platform/10-events-hub.md#1498-refund_payout_failed---committed) |
| `PAYOUT_SUCCEEDED` | `refunds-platform-payout-events` | `PayoutSucceededPayload` | [§14.9.6](../sdd-refunds-platform/10-events-hub.md#1496-payout_succeeded---committed) |
| `PAYOUT_FAILED` | `refunds-platform-payout-events` | `PayoutFailedPayload` | [§14.9.7](../sdd-refunds-platform/10-events-hub.md#1497-payout_failed---committed) |

**Implementation rules:**

- Envelope record `EventEnvelope<P>` (kernel) with the §14.3 fields in snake_case on the wire (`event_id`, `event_type`, `schema_version`, `aggregate_id`, `aggregate_type`, `aggregate_version`, `occurred_at`, `correlation_id`, `causation_id`, `tenant_id`, `payload`); payload fields in the camelCase of §14.9.
- `Money` serialises as `{ "amount": "<decimal string>", "currency": "<ISO-4217>" }`; decimals never travel as JSON numbers.
- `schema_version` is the registry version of the event's subject; producers validate the payload against it before `OutboxEventWriter.append`, consumers validate on read and dead-letter what fails.
- Unknown fields are ignored on read (additive evolution, AP-10); an unknown `event_type` on a topic is skipped.

> Confirm: one registry subject per event type (subject name = the event name) is an LLD proposal; the registry product and its subject-naming strategy are not pinned (SDD §6).

## 10.3 Producer Specs (per topic)

| Topic | Producer service | Outbox-emitted? | Acks | Retries | Compression |
|-------|------------------|-----------------|------|---------|-------------|
| `refunds-platform-refund-events` | refund-service (`OutboxRelay` in the core) | Yes (mandatory, CLAUDE.md and SDD §14.6) | `all` | Client default with `enable.idempotence=true` and `delivery.timeout.ms=120000`; the relay retries a failed batch on its next cycle | none (low volume) |
| `refunds-platform-payout-events` | payout-service (`OutboxRelay`) | Yes | `all` | Same | none |

> **Outbox is mandatory** for every state-changing event (CLAUDE.md). The relay reads `outbox_event` per tenant in `seq` order under the database's advisory lock and deletes each row after the broker acknowledges it (`09-cross-cutting.md` § 12.4). Trace context stored in `outbox_event.headers` continues the originating request's trace (SDD §17.1 Tracing).

## 10.4 Consumer Specs (per topic)

| Topic | Consumer service | Consumer group | Idempotency strategy | Failure policy |
|-------|------------------|----------------|---------------------|----------------|
| `refunds-platform-refund-events` | payout-service (`REFUND_APPROVED`) | `payout-service` | Inbox (`payout-service`, `event_id`) + unique (`tenant_id`, `refund_id`) | 3 retries, exponential backoff 1 s x2 -> `payout-service.dlq`; malformed payload not retried |
| `refunds-platform-refund-events` | notification-service (six refund events) | `notification-service` | Inbox + unique (`tenant_id`, `source_event_id`, `channel`) | Same -> `notification-service.dlq` |
| `refunds-platform-refund-events` | loyalty-service (`REFUND_PAID`) | `loyalty-service` | Inbox + unique (`tenant_id`, `refund_id`) | Same -> `loyalty-service.dlq` |
| `refunds-platform-payout-events` | refund-service (`PAYOUT_SUCCEEDED`, `PAYOUT_FAILED`) | `refund-service` | Inbox (`refund-service`, `event_id`) | Same -> `refund-service.dlq`; unknown refund or invalid transition not retried |

**Listener container settings (Spring for Apache Kafka):** manual offset commit after the database transaction commits (`AckMode.RECORD`, `enable.auto.commit=false`); `DefaultErrorHandler` with `ExponentialBackOffWithMaxRetries(3)` and a `DeadLetterPublishingRecoverer` whose destination resolver returns `<consumer>.dlq`; `addNotRetryableExceptions(MalformedEventException.class, InvalidTransitionException.class, UnknownAggregateException.class)`. Each partition is processed in order; a retrying record blocks its partition, which keeps per-aggregate order until it is dead-lettered.

> Confirm: SDD §14.6 item 3 says refund-service and payout-service "validate transitions with `aggregate_version`"; the LLD validates on the aggregate's state (the consumed-event rules of SDD §17.1 and §17.2), which gives the same result for the two payout events and the single approval event, and logs `aggregate_version`. Verify that no version store is wanted.

> TODO: best guess retry policy of 3 attempts with 1 s initial backoff doubling before dead-lettering; the SDD does not pin consumer retry counts - verify.

## 10.5 DLQ Strategy

- **Topic naming:** `<consumer>.dlq` (SDD §14.6 item 4).
- **Retention:** best guess 30 days (see § 10.1 TODO).
- **Record headers:** the recoverer adds the original topic, partition, offset, and exception class and message; no payload field is logged at INFO.
- **Replay tool:** `DlqRedriveListener` in each consuming deployable: a listener on its own `<consumer>.dlq` with group `<consumer>-redrive` and `autoStartup=false`, started and stopped by an operator through a custom actuator endpoint (`/actuator/dlqredrive`), which passes each record to the same handler; the inbox makes a redrive of an already-applied event a no-op. Records are never republished to the domain topic (SDD §14.6 item 6). Procedure: `10-operations.md` RB-02.
- **Alerting:** DLQ depth above zero raises an alert (SDD §11.4); more than 10 new records in an hour pages.

> Confirm: the redrive mechanism (a stopped listener started through a custom actuator endpoint) is an LLD proposal for the SDD's "redrive into the consumer group only" (§14.6 item 6, §20.1.3 still a template); verify with operations.

<!-- MASTER: refunds-platform-lld-master.md | PREV: 06-api-contracts.md | NEXT: 08-state-and-rules.md -->

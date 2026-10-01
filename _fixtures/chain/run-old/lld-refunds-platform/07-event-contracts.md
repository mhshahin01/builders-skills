<!--
CHUNK: 07
TITLE: Event Contracts
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: 04, 05
PART OF: LLD - Refunds Platform
-->

# 10. Event Contracts

> **Broker:** Apache Kafka, on premises (ADR-02).
>
> **Schema registry:** a JSON Schema registry, additive changes only, checked in CI (SDD §6, §14.2); product open.
>
> **Serialisation:** JSON (SDD §17.1 to §17.4 Messaging Infra).
>
> **Home of the contracts:** topic names, event names, the envelope, and every payload contract are owned by the [SDD Centralized Event Hub (§14)](../sdd-refunds-platform/10-events-hub.md#144-topic-registry). Names below match it character for character; payloads are referenced, not restated. This chunk adds only the implementation: partitions, consumer groups, serialisation mapping, producer and consumer settings, and DLQ handling.

## 10.1 Topic Inventory

| Topic | Producer | Consumers | Key | Partitions | Retention | Cleanup policy |
|-------|----------|-----------|-----|------------|-----------|----------------|
| `refunds-platform-refund-events` | refund-service (outbox relay) | payout-service, notification-service, loyalty-service | `aggregate_id` (refund id) | 6 | 14 days | delete |
| `refunds-platform-payout-events` | payout-service (outbox relay) | refund-service | `aggregate_id` (payout id) | 6 | 14 days | delete |
| `refund-service.dlq` | refund-service consumer | redrive (10.5) | original key | 1 | 30 days | delete |
| `payout-service.dlq` | payout-service consumer | redrive (10.5) | original key | 1 | 30 days | delete |
| `notification-service.dlq` | notification-service consumer | redrive (10.5) | original key | 1 | 30 days | delete |
| `loyalty-service.dlq` | loyalty-service consumer | redrive (10.5) | original key | 1 | 30 days | delete |

> **Naming convention:** SDD §14.2 (`refunds-platform-<context>-events`, one topic per producing context; DLQ `<consumer>.dlq`, SDD §14.6 item 4). This replaces the template's `<context>.<entity>.<event-type>` and `<original-topic>.dlq` defaults.

> TODO: best-guess partition counts and retention (6 partitions, 14 days on the event topics, 30 days on the DLQs) - SDD §6 leaves "partitions and retention per topic" open; verify with the platform team. Topic retention also bounds `inbox_event` and `notification` retention (05 § 8.6).

## 10.2 Event Schemas

The envelope is [SDD §14.3](../sdd-refunds-platform/10-events-hub.md#143-standard-event-envelope-every-event-every-topic) and the payloads are [SDD §14.9](../sdd-refunds-platform/10-events-hub.md#149-payload-contract-samples); neither is restated here. Implementation mapping:

| Event | Payload contract | Java payload record | Producer class (outbox writer caller) | Initial `schema_version` |
|-------|------------------|---------------------|---------------------------------------|--------------------------|
| `REFUND_SUBMITTED` | SDD §14.9.1 | `RefundSubmittedPayload` | `RefundRequestServiceImpl.submit` | `1.0.0` |
| `REFUND_CANCELLED` | SDD §14.9.2 | `RefundCancelledPayload` | `RefundRequestServiceImpl.cancel` | `1.0.0` |
| `REFUND_APPROVED` | SDD §14.9.3 | `RefundApprovedPayload` | `RefundDecisionServiceImpl.decide` | `1.0.0` |
| `REFUND_REJECTED` | SDD §14.9.4 | `RefundRejectedPayload` | `RefundDecisionServiceImpl.decide` | `1.0.0` |
| `REFUND_PAID` | SDD §14.9.5 | `RefundPaidPayload` | `PayoutOutcomeServiceImpl.applyPayoutSucceeded` | `1.0.0` |
| `REFUND_PAYOUT_FAILED` | SDD §14.9.8 | `RefundPayoutFailedPayload` | `PayoutOutcomeServiceImpl.applyPayoutFailed` | `1.0.0` |
| `PAYOUT_SUCCEEDED` | SDD §14.9.6 | `PayoutSucceededPayload` | `PayoutAttemptServiceImpl`, `PayoutResultServiceImpl` | `1.0.0` |
| `PAYOUT_FAILED` | SDD §14.9.7 | `PayoutFailedPayload` | `PayoutAttemptServiceImpl` (window close) | `1.0.0` |

**Serialisation rules:**

- `EventEnvelope<P>` is a record whose JSON names are the SDD §14.3 snake_case names (`event_id`, `event_type`, `schema_version`, `aggregate_id`, `aggregate_type`, `aggregate_version`, `occurred_at`, `correlation_id`, `causation_id`, `tenant_id`, `payload`); payload records keep the SDD §14.9 camelCase names. Both are mapped with explicit Jackson property names, never a global naming strategy, so the two conventions cannot leak into each other.
- `ref(Money)` is `{ "amount": "<decimal string, 4 places>", "currency": "<ISO-4217>" }` (06 § 9.2 decision); `date` is ISO-8601 date; `timestamp` is ISO-8601 UTC with `Z`.
- Payload records are shared as a versioned contracts artefact generated from the registry schemas, so producer and consumers compile against the same field names.
- A payload field marked `pii` or confidential in SDD §14.9 (`customerId`, `decisionReason`, `originalPaymentRef`, `providerPayoutRef`) is never logged; the envelope is logged without `payload` at INFO.

> TODO: not derivable from inputs - registry subject naming (one subject per event type is proposed, for example `refunds-platform-refund-events-REFUND_SUBMITTED`) depends on the registry product, open in SDD §6 - please specify.

> **Convention:** every event carries the full SDD §14.3 envelope; `causation_id` is set when one event causes another (`REFUND_PAID` and `REFUND_PAYOUT_FAILED` carry the `event_id` of the payout event).

## 10.3 Producer Specs (per topic)

| Topic | Producer service | Outbox-emitted? | Acks | Retries | Compression |
|-------|------------------|-----------------|------|---------|-------------|
| `refunds-platform-refund-events` | refund-service | Yes (mandatory per CLAUDE.md) | `all`, idempotent producer | Producer default with a bounded delivery timeout; the relay retries the row on the next poll | snappy |
| `refunds-platform-payout-events` | payout-service | Yes | `all`, idempotent producer | Same | snappy |
| `<consumer>.dlq` | each consumer's error handler | No (error path, not a state change) | `all` | Same | snappy |

Record headers set by the relay: `traceparent` (from `outbox_event.traceparent`, SDD §11.4) and `event_type` (lets a consumer skip types it does not handle before deserialising the payload).

> Confirm: idempotent producer, snappy compression, and the `event_type` header are LLD choices (SDD §14 is silent); verify with the platform team.

> **Outbox is mandatory** for all state-changing events (CLAUDE.md). The publisher reads from the outbox table inside the producing service and writes to Kafka. See `04-implementation/<service>.md` § Pattern: Outbox and 09 § 12.4.

## 10.4 Consumer Specs (per topic)

| Topic | Consumer service | Consumer group | Idempotency strategy | Failure policy |
|-------|------------------|----------------|---------------------|----------------|
| `refunds-platform-refund-events` | payout-service | `payout-service` | Inbox (`tenant_id`, `payout-service`, `event_id`) plus UNIQUE (`tenant_id`, `refund_id`) | Handles `REFUND_APPROVED` only; retry 3x with backoff, then `payout-service.dlq` |
| `refunds-platform-refund-events` | notification-service | `notification-service` | Inbox plus UNIQUE (`tenant_id`, `source_event_id`, `channel`); supersession by `aggregate_version` | All six refund events; retry 3x, then `notification-service.dlq` |
| `refunds-platform-refund-events` | loyalty-service | `loyalty-service` | Inbox plus UNIQUE (`tenant_id`, `refund_id`) on take-backs | `REFUND_PAID` only; retry 3x, then `loyalty-service.dlq` |
| `refunds-platform-payout-events` | refund-service | `refund-service` | Inbox plus status rules plus `last_payout_event_version` | `PAYOUT_SUCCEEDED`, `PAYOUT_FAILED`; retry 3x, then `refund-service.dlq` |

Consumer container settings (every consumer): manual offset commit after the listener transaction commits (record acknowledgement), auto-commit off, one listener container factory per module in the core (03 § 6.2). Error handler: retryable exceptions (database and transient errors) are retried 3 times with exponential backoff (1 s, 2 s, 4 s); non-retryable exceptions (`DeserializationException`, `InvalidEventException`, `UnknownAggregateException`, `InvalidTransitionException`) go to the consumer's DLQ at once. An event type the consumer does not handle is skipped without an inbox row, so new event types can be added without breaking consumers (AP-10).

> Confirm: 3 retries at 1 s, 2 s, 4 s before the DLQ is an LLD proposal (SDD §14.6 fixes only "DLQ with alarm"); verify with the team.

> **Convention per CLAUDE.md:** idempotency on every consumer. Assume at-least-once delivery everywhere.

## 10.5 DLQ Strategy

- **Topic naming:** `<consumer>.dlq` (`refund-service.dlq`, `payout-service.dlq`, `notification-service.dlq`, `loyalty-service.dlq`, SDD §14.6 item 4). The DLQ record keeps the original key, value, and headers, plus the exception class, message, original topic, partition, and offset as headers.
- **Retention:** 30 days (TODO in 10.1).
- **Replay tool:** each consumer has a DLQ redrive listener on its own `.dlq` topic, disabled at startup and started by an operator (runbook RB-02); it feeds each record to the same handler, so the inbox makes a redrive idempotent. Records are never republished to the source topic, which would re-deliver them to the other consumer groups (SDD §14.6 item 6).
- **Alerting:** DLQ depth above zero raises an alarm (SDD §11.4), not the template's ">10 rows in 1h".

> Confirm: the per-consumer redrive listener is an LLD design for SDD §20.1.3 (whose procedure is open); verify with the operations team.

<!-- MASTER: lld-master.md | PREV: 06-api-contracts.md | NEXT: 08-state-and-rules.md -->

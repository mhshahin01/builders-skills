<!--
CHUNK: 07
TITLE: Event Contracts
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: 04, 05
PART OF: LLD - [Project Name]
-->

# 10. Event Contracts

> **Broker:** [SDD §6 Event Broker / Streaming row] (CLAUDE.md default, Kafka on-prem, only when SDD §6 is silent). § 10.1-10.5 cover integration events on the broker; a modular monolith with none writes `Not applicable - no broker` there, and its in-process domain events are in § 10.6.
>
> **Schema registry:** [Confluent / Apicurio / other] - additive changes only (CLAUDE.md: backward compatibility on Kafka schemas).
>
> **Serialisation:** [Avro / JSON Schema] - pick one and apply uniformly.

## 10.1 Topic Inventory

| Topic | Producer | Consumers | Key | Partitions | Retention | Cleanup policy |
|-------|----------|-----------|-----|------------|-----------|----------------|
| `foo.lifecycle.created` | `[service-a]` | `[service-b], [service-c]` | aggregate ID (UUIDv7) | 12 | 7 days | delete |
| `foo.lifecycle.updated` | `[service-a]` | `[service-b]` | aggregate ID | 12 | 7 days | delete |
| `foo.lifecycle.deleted` | `[service-a]` | `[service-b], [service-c]` | aggregate ID | 12 | 7 days | delete |
| `<context>.<entity>.dlq` | (failed consumers) | DLQ replay tool | original key | 3 | 30 days | delete |

> **Naming convention:** from an SDD, topic and event names are SDD §14.4 and §14.5 verbatim. From code with no SDD, the names the code uses; a new topic follows `<context>.<entity>.<event-type>` (CLAUDE.md spirit), lowercase, dot-separated.

## 10.2 Event Schemas

> **Source:** from an SDD, each event links its SDD §14.9 payload contract and adds only the implementation delta (record class, serializer, registry subject); names match SDD §14 verbatim and the payload stays in the SDD (`sdd-to-lld.md` § One fact, one home). Write the full schema below only from code with no SDD, or for an event the SDD does not define (flagged `> Confirm:`; hybrid: `🆕 code-only`).

### `foo.lifecycle.created`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["eventId", "eventType", "occurredAt", "tenantId", "aggregateId", "data"],
  "properties": {
    "eventId":     { "type": "string", "format": "uuid", "description": "UUIDv7" },
    "eventType":   { "type": "string", "const": "foo.created" },
    "eventVersion":{ "type": "string", "default": "v1" },
    "occurredAt":  { "type": "string", "format": "date-time" },
    "tenantId":    { "type": "string", "format": "uuid" },
    "aggregateId": { "type": "string", "format": "uuid" },
    "data": {
      "type": "object",
      "required": ["name", "amount", "status"],
      "properties": {
        "name":   { "type": "string" },
        "amount": { "type": "number" },
        "status": { "type": "string", "enum": ["ACTIVE"] }
      }
    },
    "metadata": {
      "type": "object",
      "properties": {
        "correlationId": { "type": "string" },
        "causationId":   { "type": "string" }
      }
    }
  }
}
```

> **Convention:** from an SDD, every event carries the SDD §14.3 envelope, field names verbatim, referenced and not restated. From code with no SDD, document the envelope the code uses; it carries an event id, event type, schema version, occurrence time, tenant key, aggregate id, and correlation and causation ids.

## 10.3 Producer Specs (per topic)

| Topic | Producer service | Outbox-emitted? | Acks | Retries | Compression |
|-------|------------------|-----------------|------|---------|-------------|
| `foo.lifecycle.created` | `[service-a]` | Yes (mandatory per CLAUDE.md) | `all` | 5 | snappy |
| `foo.lifecycle.updated` | `[service-a]` | Yes | `all` | 5 | snappy |

> **Outbox is mandatory** for all state-changing integration events (CLAUDE.md); the in-process domain events of § 10.6 use it only under a durable Delivery line (§ 10.6). The producing service writes each event to its outbox table in the same transaction as the state change; a separate publisher sends it to Kafka and marks it processed only after the broker acknowledges (`acks=all`). Delivery is at-least-once. See `09-cross-cutting.md` § 12.4 and `04-implementation/<service>.md` § Pattern: Outbox.

## 10.4 Consumer Specs (per topic)

| Topic | Consumer service | Consumer group | Idempotency strategy | Failure policy |
|-------|------------------|----------------|---------------------|----------------|
| `foo.lifecycle.created` | `[service-b]` | `service-b-foo-listener` | `(eventId)` dedup table; idempotent insert into local projection | Retry 3x → DLQ |
| `foo.lifecycle.created` | `[service-c]` | `service-c-foo-listener` | `(aggregateId, occurredAt)` natural key; upsert | Retry 3x → DLQ |

> **Convention per CLAUDE.md:** idempotency on every consumer. Assume at-least-once delivery everywhere: the outbox publisher re-sends an event whose processed update failed, with the same payload and `eventId`.

## 10.5 DLQ Strategy

- **Topic naming:** `<original-topic>.dlq`.
- **Retention:** 30 days.
- **Replay tool:** [name + repo path].
- **Alerting:** any DLQ row triggers a warning; >10 rows in 1h triggers a page.

## 10.6 In-Process Domain Events (SDD §14.10)

<!--
Modular monolith or hybrid core only: one row per SDD §14.10 event, published by one module and handled in process by others. With no SDD §14.10 in-process domain event here (a microservices SDD, a separate deployable of a hybrid, or a core whose modules publish none), write "Not applicable - no in-process events".
These events never touch the broker: no topic, consumer group, or DLQ, and no outbox unless the Delivery line is durable (Convention below). An event that must also leave the deployable is an integration event in § 10.1 (SDD §14.5).
-->

> **Delivery:** [Durable / In memory], the value of the SDD §14.10 Delivery line.

| Event | Publisher module | Listener modules | Transaction phase | Payload (DTO) | When |
|-------|------------------|------------------|-------------------|---------------|------|
| [`[EventName]`](../sdd-[sdd-slug]/10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core) | `[module-a]` | `[module-b], [module-c]` | [after commit] | `[EventDto]` | [The state change that raises it, as §14.10 writes it] |

> **Convention:** the Delivery value, names, phase, DTO, and When match SDD §14.10 verbatim; the LLD adds only the publishing call, the listener classes in each module's 04 file (in the Spring stack, `ApplicationEventPublisher` and `@TransactionalEventListener` with the listed phase), and, for a durable delivery, the publication log. A durable delivery records each publication in the publisher's transaction in that log, the outbox of `09-cross-cutting.md` § 12.4, and redelivers it until each listener commits; it never relies on a bare after-commit listener, which loses the event if the process stops before the listener runs.

<!-- MASTER: [project-slug]-lld-master.md | PREV: 06-api-contracts.md | NEXT: 08-state-and-rules.md -->

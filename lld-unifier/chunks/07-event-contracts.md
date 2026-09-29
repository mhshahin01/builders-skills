<!--
CHUNK: 07
TITLE: Event Contracts
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: 04, 05
PART OF: LLD - [Project Name]
-->

# 10. Event Contracts

> **Broker:** Kafka (CLAUDE.md default for on-prem).
>
> **Schema registry:** [Confluent / Apicurio / other] — additive changes only (CLAUDE.md: backward compatibility on Kafka schemas).
>
> **Serialisation:** [Avro / JSON Schema] — pick one and apply uniformly.

## 10.1 Topic Inventory

| Topic | Producer | Consumers | Key | Partitions | Retention | Cleanup policy |
|-------|----------|-----------|-----|------------|-----------|----------------|
| `foo.lifecycle.created` | `[service-a]` | `[service-b], [service-c]` | aggregate ID (UUIDv7) | 12 | 7 days | delete |
| `foo.lifecycle.updated` | `[service-a]` | `[service-b]` | aggregate ID | 12 | 7 days | delete |
| `foo.lifecycle.deleted` | `[service-a]` | `[service-b], [service-c]` | aggregate ID | 12 | 7 days | delete |
| `<context>.<entity>.dlq` | (failed consumers) | DLQ replay tool | original key | 3 | 30 days | delete |

> **Naming convention (CLAUDE.md spirit):** `<context>.<entity>.<event-type>`. Lowercase, dot-separated.

## 10.2 Event Schemas

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

> **Convention:** every event includes `eventId`, `eventType`, `eventVersion`, `occurredAt`, `tenantId`, `aggregateId`, and a `metadata` block with at least `correlationId` and `causationId`.

## 10.3 Producer Specs (per topic)

| Topic | Producer service | Outbox-emitted? | Acks | Retries | Compression |
|-------|------------------|-----------------|------|---------|-------------|
| `foo.lifecycle.created` | `[service-a]` | Yes (mandatory per CLAUDE.md) | `all` | 5 | snappy |
| `foo.lifecycle.updated` | `[service-a]` | Yes | `all` | 5 | snappy |

> **Outbox is mandatory** for all state-changing events (CLAUDE.md). The producing service writes each event to its outbox table in the same transaction as the state change; a separate publisher sends it to Kafka and marks it processed only after the broker acknowledges (`acks=all`). Delivery is at-least-once. See `09-cross-cutting.md` § 12.4 and `04-implementation/<service>.md` § Pattern: Outbox.

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

<!-- MASTER: [project-slug]-lld-master.md | PREV: 06-api-contracts.md | NEXT: 08-state-and-rules.md -->

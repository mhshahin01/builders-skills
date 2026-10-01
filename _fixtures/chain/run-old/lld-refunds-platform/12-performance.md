<!--
CHUNK: 12
TITLE: Performance
PROJECT: Refunds Platform
VERSION: 1.0
PART OF: LLD - Refunds Platform
-->

# 15. Performance

> **Convention:** targets are owned by [SDD §18](../sdd-refunds-platform/14-performance-and-capacity.md#18-performance--capacity-planning); each SLO row below links its SDD source, and a value the SDD leaves open is flagged, never set here as a local truth. This chunk adds only how the targets are met.

## 15.1 SLOs (per service)

| Service | Endpoint / Operation | Sustained RPS | Peak RPS | p50 | p95 | p99 |
|---------|----------------------|---------------|----------|-----|-----|-----|
| refund-service | Client endpoints (reads) | Open ([SDD §18.2](../sdd-refunds-platform/14-performance-and-capacity.md#182-throughput-targets-per-service)) | 3x sustained (REFUNDS/NFR-03) | Open | Open | Open |
| refund-service | `POST /v1/refund-requests` (one API-01 call inside) | Under 0.05/s even at the seasonal rate ([SDD §18.2](../sdd-refunds-platform/14-performance-and-capacity.md#182-throughput-targets-per-service)) | same | Open | Open | Open |
| loyalty-service | Member endpoints | Open (SDD §18.2) | Open | Open | Open | Open |
| loyalty-service | `REFUND_PAID` to take-back commit | Event-driven | - | - | - | at most 60 min for every matched take-back (LOYALTY/NFR-02, SDD §18) |
| payout-service | Payout attempts | At most one payout per approved request (SDD §18.1) | Retry burst after a CardPay outage (SDD §18.3) | Not applicable | Not applicable | Not applicable |
| notification-service | Event to send | Message volume per SDD §18.1 | 3x during seasonal sales | - | Open (SDD §18.2) | - |
| all client endpoints | Availability | At most 120 disrupted minutes per month, 99.72% (REFUNDS/NFR-02, SDD §18) | - | - | - | - |

> TODO: best-guess latency targets until SDD §18.2 pins them: reads p95 300 ms, p99 800 ms; `POST /v1/refund-requests` and the decision p95 800 ms, p99 2 s (one POS call inside the submit); notification event-to-send p95 60 s - verify with the product owner and set them in SDD §18.2.

## 15.2 Caching Strategy

| Cache | Scope | Eviction | TTL | Invalidation triggers |
|-------|-------|----------|-----|----------------------|
| None in this release | - | - | - | - |

No cache: about 1,200 refund requests a month and read-your-own-data queries need none (SDD §6 Caching, AP-12). The tenant registry and the permission maps are configuration loaded at startup, not caches; contact details must not be cached (SDD §17.3 Avoid).

> **Convention:** caches are tenant-scoped. Cache keys include `tenant_id`. Cross-tenant cache poisoning is impossible by construction.

## 15.3 Hot-Path Indexes

> Cross-references to `05-data-model.md` § 8.3. The indexes that exist specifically for a hot path:

| Index | Query / SLO it serves | Rationale |
|-------|-----------------------|-----------|
| `ix_refund_request_customer` | UC-02 own list (read SLO) | Keyset scan of one customer's rows |
| `ix_refund_request_branch_queue`, `ix_refund_request_branch_failed` | UC-04 branch queue (read SLO) | Both queue sections without a sort |
| `ix_movement_member_history` | UC-02 points history (read SLO) | Keyset scan newest first |
| `uq_movement_earned` | `REFUND_PAID` take-back match (LOYALTY/NFR-02 60 min) | Point lookup by purchase |
| `ix_payout_due` | Scheduler claim | `FOR UPDATE SKIP LOCKED` without a full scan |
| `ix_notification_due` | Dispatch claim (event-to-send) | Same |
| `ix_outbox_event_seq` | Relay poll (end-to-end event latency) | Ordered read per tenant |

## 15.4 Bulkhead & Concurrency

| Concern | Limit | Override mechanism |
|---------|-------|---------------------|
| Per-customer receipt lookups | 10 per rolling hour (SDD §17.1) | API gateway route config |
| Per-tenant and per-user rate limits (other routes) | Open | API gateway config |
| Per-downstream-provider concurrent calls | 09 § 12.3 (`posRecords` 20, `cardPay` 10, `msgHubEmail` 10, `msgHubSms` 10, `keycloakAdmin` 10) | Resilience4j bulkhead instances |
| Per-module DB pool (core) | refund 20 max / 5 min; loyalty 10 max / 2 min | Per-module datasource configuration |
| Per-service DB pool | payout 10 / 2; notification 10 / 2 | `spring.datasource.hikari.maximum-pool-size` |
| Listener concurrency | Equal to the topic partition count per consumer group | Listener container factory per module |
| Outbox relay batch | 100 rows per tenant per poll | `OUTBOX_BATCH_SIZE` |
| Scheduler batches | payout 20, notification 50 claims per tick | `PAYOUT_SCHEDULER_BATCH_SIZE`, `NOTIFICATION_DISPATCH_BATCH_SIZE` |

> TODO: best-guess pool sizes and batch sizes (SDD §11.3 leaves sizing open) - verify under the load test of 15.6.

## 15.5 Peak Scenarios

Scenarios and multipliers are owned by [SDD §18.3](../sdd-refunds-platform/14-performance-and-capacity.md#183-peak-scenarios); implementation mitigations:

| Scenario | Trigger | Multiplier | Duration | Mitigation |
|----------|---------|------------|----------|------------|
| Seasonal sales | Sale season (REFUNDS/NFR-03) | 3x requests and messages (SDD §18.3) | About 3 weeks (SDD §18.3) | HPA on the core and notification-service (notification also on consumer lag); the relay and dispatch batches absorb bursts |
| CardPay recovery after an outage | CardPay back after being unavailable | Open (SDD §18.3) | Open | Jittered persisted backoff spreads due payouts; `cardPay` bulkhead caps concurrency; `SKIP LOCKED` spreads claims across replicas |
| POS member-purchase catch-up | Delayed POS feed delivered | Open (SDD §18.3) | Open | One transaction per purchase; natural-key idempotency; waiting take-backs applied in the earn transaction |

> TODO: peak scenarios - verify with SDD §18.3 (the CardPay backlog and the POS catch-up sizes are open there).

## 15.6 Load-Test Strategy

| Concern | Choice |
|---------|--------|
| Tooling | Open (SDD §18.4) |
| Environments | Open (SDD §18.4: UAT or a dedicated performance environment with provider stubs) |
| Scenario set | SDD §18.4: baseline; 3x seasonal soak; CardPay outage and recovery; Kafka consumer restart with backlog; POS feed catch-up |
| Acceptance criteria | SDD §18.4: §18.2 targets at 3x; zero duplicate payouts and zero lost events; take-back lag within 60 minutes |
| Cadence | Open (SDD §18.4) |

> TODO: not derivable from inputs - the load-test tool, environment, cadence, and result store are open in SDD §18.4 - please specify.

<!-- MASTER: lld-master.md | PREV: 11-security.md | NEXT: 13-testing.md -->

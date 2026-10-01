<!--
CHUNK: 12
TITLE: Performance
PROJECT: Refunds Platform
VERSION: 1.0
PART OF: LLD - Refunds Platform
-->

# 15. Performance

> **Convention:** SLOs and load targets are owned by [SDD §18](../sdd-refunds-platform/14-performance-and-capacity.md#18-performance--capacity-planning) (the BRD NFRs quantified). This chunk references each target per row and adds only what meets it: indexes, bulkheads, pool sizes, and batch sizes.

## 15.1 SLOs (per service)

| Service | Endpoint / Operation | Sustained RPS | Peak RPS | p50 | p95 | p99 |
|---------|----------------------|---------------|----------|-----|-----|-----|
| `refund-service` | All client endpoints | Open ([SDD §18.2](../sdd-refunds-platform/14-performance-and-capacity.md#182-throughput-targets-per-service)) | Open (3x sustained, REFUNDS/NFR-03) | Open | Open | Open |
| `loyalty-service` | All member endpoints | Open (SDD §18.2) | Open | Open | Open | Open |
| `payout-service` | Payout per approved refund | At most one per approved request (SDD §18.2) | Retry burst after a CardPay outage (SDD §18.3) | N/A | N/A | N/A |
| `notification-service` | Event to send | Event-driven (SDD §18.2) | 3x during seasonal sales | N/A | Open (SDD §18.2) | N/A |
| `loyalty-service` | `REFUND_PAID` to take-back commit | Event-driven | - | N/A | N/A | At most 60 minutes for every matched take-back (LOYALTY/NFR-02, SDD §18) |

Availability, payout integrity, and access NFRs (REFUNDS/NFR-01, NFR-02, NFR-04; LOYALTY/NFR-01) are measured as SDD §18 defines them; `10-operations.md` § 13.7 turns each into an alert.

> TODO: every latency and RPS target for the client endpoints is `[NEEDS CLARIFICATION]` in SDD §18.2; best guess p95 below 300 ms for reads and below 800 ms for writes that call POS Records, at 3x the baseline read rate - verify and move the agreed values into SDD §18.2, not here.

## 15.2 Caching Strategy

| Cache | Scope | Eviction | TTL | Invalidation triggers |
|-------|-------|----------|-----|----------------------|
| None | - | - | - | - |

Not applicable for this release: SDD §6 decides "no cache" (about 1,200 refund requests a month and read-your-own-data queries). The web app keeps only in-memory store state per session.

> **Convention:** if a cache is added later, its keys include `tenant_id` and its invalidation is driven by the events of `07-event-contracts.md`.

## 15.3 Hot-Path Indexes

> Cross-references to `05-data-model.md` § 8.3. Indexes that exist specifically for a user-facing query:

| Index | Query / SLO it serves | Rationale |
|-------|-----------------------|-----------|
| `ix_rr_customer` | `GET /v1/refund-requests` (REFUNDS/UC-02), newest first | Keyset pagination on (`submitted_at`, `id`) without a sort |
| `ix_rr_branch_queue` | `GET /v1/branches/{branchId}/refund-requests` (REFUNDS/UC-04) | Both queue segments read in index order |
| `uk_refund_item_active_claim` | `GET .../refundable-items` and `POST /v1/refund-requests` (REFUNDS/UC-01) | Claim lookup by receipt is an index probe |
| `ix_movement_member_history` | `GET /v1/members/me/points-movements` (LOYALTY/UC-02) | Keyset pagination newest first |
| `pk_points_balance` | `GET /v1/members/me/points-balance` (LOYALTY/UC-01) | Single-row read; no aggregation on the request path |

## 15.4 Bulkhead & Concurrency

| Concern | Limit | Override mechanism |
|---------|-------|---------------------|
| Per-user rate limit | Gateway default (open); receipt lookup 10 per customer per rolling hour (SDD §17.1) | API gateway configuration |
| Per-downstream-provider concurrent calls | `pos-receipt` 20; `cardpay` 10; `msghub-email` 10; `msghub-sms` 10; `keycloak-admin` 10 | Resilience4j bulkhead instances (`09-cross-cutting.md` § 12.3) |
| Per-deployable DB pool | Core 20, payout 10, notification 10 (HikariCP maximum) | `spring.datasource.hikari.maximum-pool-size` |
| Outbox relay batch | 100 rows per tenant per cycle | `refunds-platform.outbox.batch-size` |
| Payout scheduler | 10 payouts per tenant per tick; attempt executor of 10 threads (equal to the `cardpay` bulkhead) | `refunds-platform.payout.scheduler.*` |
| Notification dispatcher | 20 rows per tenant per tick; per-channel bulkheads | `refunds-platform.notification.dispatch.*` |
| Kafka listener concurrency | 1 consumer thread per listener per pod; parallelism by partitions and replicas | `spring.kafka.listener.concurrency` |

> TODO: pool and batch sizes are best guesses at the SDD §18.1 volumes (writes under 0.05 per second even at the seasonal rate); verify with the §15.6 load test once read traffic is estimated (SDD §18.1 open).

## 15.5 Peak Scenarios

The scenarios, multipliers, and platform mitigations are SDD §18.3 ([link](../sdd-refunds-platform/14-performance-and-capacity.md#183-peak-scenarios)). LLD delta per scenario:

| Scenario | Trigger | Multiplier | Duration | Mitigation |
|----------|---------|------------|----------|------------|
| Seasonal sales | SDD §18.3 | 3x (SDD §18.3) | About 3 weeks | HPA on the core (CPU) and on notification-service (CPU and `kafka_consumer_lag` of group `notification-service`); per-channel bulkheads keep SMS slowness from starving email |
| CardPay recovery after an outage | SDD §18.3 | Open (SDD §18.3) | Open | Equal-jitter backoff spreads due payouts; claim batch 10 per tick and the `cardpay` bulkhead cap the burst; the half-open circuit probes before full traffic |
| POS member-purchase catch-up | SDD §18.3 | Open (SDD §18.3) | Open | One transaction per purchase; natural-key idempotency; parked and closed take-backs apply as purchases land |

> TODO: peak multipliers for the CardPay recovery and POS catch-up scenarios are open in SDD §18.3 - verify with SDD §18.3 before the load test.

## 15.6 Load-Test Strategy

| Concern | Choice |
|---------|--------|
| Tooling | Open (SDD §18.4); needs approval as a new dependency |
| Environments | Open (SDD §18.4: UAT or a dedicated environment with provider stubs) |
| Scenario set | SDD §18.4: baseline; 3x seasonal soak; CardPay outage and recovery; Kafka consumer restart with backlog; POS feed catch-up |
| Acceptance criteria | SDD §18.4: §18.2 targets at 3x; zero duplicate payouts and zero lost events; take-back lag within 60 minutes |
| Cadence | Open (SDD §18.4) |

<!-- MASTER: refunds-platform-lld-master.md | PREV: 11-security.md | NEXT: 13-testing.md -->

<!--
CHUNK: 12
TITLE: Performance
PROJECT: Refunds Platform
VERSION: 1.0
PART OF: LLD - Refunds Platform
-->

# 15. Performance

> **Convention:** SLOs and load targets carry over from SDD §18. This chunk operationalises them: what cache strategy, what indexes, what query plans, what bulkhead sizes meet the targets.

## 15.1 SLOs (per service)

| Service | Endpoint / Operation | Sustained RPS | Peak RPS | p50 | p95 | p99 | Source |
|---------|----------------------|---------------|----------|-----|-----|-----|--------|
| deployable | Monthly availability of the customer and branch manager APIs, measured at the gateway | - | - | - | - | - | [SDD §18](../sdd-refunds-platform/14-performance-and-capacity.md#18-performance--capacity-planning) REFUNDS/NFR-02 row: 99.7% |
| `payout` | Payout reaches a terminal state | - | - | - | - | 24 h after the first attempt plus one dispatcher cycle | [SDD §18](../sdd-refunds-platform/14-performance-and-capacity.md#18-performance--capacity-planning) REFUNDS/NFR-01 row |
| `loyalty` | Take-back after `RefundPaid` (purchase known) | - | - | - | - | 1 h from `paidAt` (100%) | [SDD §18](../sdd-refunds-platform/14-performance-and-capacity.md#18-performance--capacity-planning) LOYALTY/NFR-02 row |
| `refund` | `POST /v1/refund-requests` (includes the POS re-read) | 1 | 3 | 400ms | 1500ms | 3000ms | LLD target ([SDD §18.2](../sdd-refunds-platform/14-performance-and-capacity.md#182-throughput-targets-per-service) pins none) |
| `refund` | `POST /v1/refund-requests/{refundId}/decision` | 1 | 3 | 100ms | 300ms | 800ms | LLD target (SDD §18.2 pins none) |
| `refund` | `GET` endpoints | 5 | 15 | 50ms | 200ms | 500ms | LLD target (SDD §18.2 pins none) |
| `loyalty` | `GET` endpoints | 5 | 15 | 50ms | 200ms | 500ms | LLD target (SDD §18.2 pins none) |
| `payout`, `notification` | No inbound HTTP | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | SDD §18.2 |

> **Source:** each row links the SDD §18.2 row it derives from. A target the SDD does not pin reads `LLD target` and carries a `> TODO:` best-guess flag (`confidence-rules.md`); rows inferred from a service-level SDD target fall under the `> Confirm:` below.

> TODO: the `refund` and `loyalty` RPS and latency targets are open in SDD §18.2 and REFUNDS/NFR-03; best guess: the LLD targets above (writes far below 1 RPS per SDD §18.2, reads assumed at 5 RPS, peak 3x per REFUNDS/NFR-03) - verify.

> Confirm: SLO targets - verify with SDD §18.2 Throughput Targets.

## 15.2 Caching Strategy

| Cache | Scope | Eviction | TTL | Invalidation triggers |
|-------|-------|----------|-----|----------------------|
| None | - | - | - | - |

No cache in this release (SDD §6 Caching row: about 1,200 requests a month need none). The `points_balance` projection is the read model that keeps balance reads O(1) without a cache (SDD §17.4 Developer Notes).

> **Convention:** caches are tenant-scoped. Cache keys include `tenant_id`. Cross-tenant cache poisoning is impossible by construction.

## 15.3 Hot-Path Indexes

> Cross-references to `05-data-model.md` § Indexes. List the indexes that exist *specifically* to meet a SLO target, with the query they serve.

| Index | Query / SLO it serves | Rationale |
|-------|-----------------------|-----------|
| `idx_refund_customer` | `GET /v1/refund-requests` p95 200ms | Keyset page of one customer without a tenant scan |
| `idx_refund_branch_queue` | `GET /v1/branches/{branchId}/refund-requests` p95 200ms | Submitted requests of one branch, oldest first |
| `uq_refund_item_active` | `POST /v1/refund-requests` p95 1500ms; refundable flags at lookup | Active-line check by receipt without scanning items |
| `idx_movement_member` | `GET /v1/members/me/points-movements` p95 200ms | Newest-first keyset page per member |
| `idx_payout_claim`, `idx_notification_claim` | Dispatcher cycle; payout terminal within 24 h | Claim query touches only due rows |
| `idx_movement_purchase` | Take-back within 1 h (LOYALTY/NFR-02) | Cumulative cap sum per purchase |

## 15.4 Bulkhead & Concurrency

| Concern | Limit | Override mechanism |
|---------|-------|---------------------|
| Per-tenant rate limit | Open; receipt lookups per customer limited at the gateway (14 § 14.5 TODO) | API gateway config |
| Per-downstream-provider concurrent calls | POS 20, CardPay 5, MsgHub 10 | Resilience4j Bulkhead config (see `09-cross-cutting.md` § 12.3) |
| Per-service DB pool | 20 max, 5 min per replica (shared by the four modules) | `spring.datasource.hikari.maximum-pool-size` |
| Dispatcher batch size | Payout 50, notification 100 | `PAYOUT_BATCH_SIZE`, notification batch property |

> TODO: the database pool size is an LLD best guess (no SDD figure); with the POS call outside any transaction (SDD R-06) a pool of 20 per replica covers the 3x peak - verify in the load test.

## 15.5 Peak Scenarios

Carried from [SDD §18.3](../sdd-refunds-platform/14-performance-and-capacity.md#183-peak-scenarios); the LLD adds the mechanism only.

| Scenario | Trigger | Multiplier | Duration | Mitigation |
|----------|---------|------------|----------|------------|
| Seasonal sales | SDD §18.3 | 3x | About 3 weeks | Two or more replicas plus autoscaling (bounds open); dispatchers absorb bursts through their tables |
| CardPay outage | SDD §18.3 | Payout backlog | Up to 24 h | `cardpay` circuit breaker and bulkhead; payouts retry with backoff; `PayoutFailed` after 24 h |
| MsgHub outage | SDD §18.3 | Message backlog | Outage duration | Rows stay pending and retry; refunds unaffected |
| POS records outage | SDD §18.3 | Submissions refused | Outage duration | 503 `UNAVAILABLE`; tracking, decisions, loyalty keep working |

## 15.6 Load-Test Strategy

| Concern | Choice |
|---------|--------|
| Tooling | Open (SDD §18.4) |
| Environments | Open (SDD §18.4: an environment sized like Prod, SIT or UAT) |
| Scenario set | Baseline, 3x seasonal peak, provider outage injection (CardPay, MsgHub, POS), restart during dispatch (SDD §18.4) |
| Acceptance criteria | The § 15.1 targets hold at 3x; no duplicate payout and no lost publication after restarts (SDD §18.4) |
| Cadence | Open (SDD §18.4) |

> TODO: load-test tool, environment, durations, and cadence are open in SDD §18.4; best guess: k6 in UAT, 1 h at 3x, before each seasonal sale and major release - verify.

<!-- MASTER: refunds-platform-lld-master.md | PREV: 11-security.md | NEXT: 13-testing.md -->

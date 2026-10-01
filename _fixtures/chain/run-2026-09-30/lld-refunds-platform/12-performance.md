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

The service-level objectives that SDD §18.2 pins are referenced, not restated: availability of the web app and core APIs, payout correctness, take-back lag, balance correctness, and the seasonal peak rule ([SDD §18.2](../sdd-refunds-platform/14-performance-and-capacity.md#182-throughput-targets-per-service)). Their measurement here: `AvailabilitySLOBurn`, `RefundPayoutOverdue`, the per-payout duplicate proxy on `payout_attempt`, `TakebackLagSLO` (10 § 13.7), and the one-transaction balance update (loyalty-service § 7.6). SDD §18.2 leaves every RPS and latency value NEEDS CLARIFICATION, so the rows below are LLD targets.

| Service | Endpoint / Operation | Sustained RPS | Peak RPS | p50 | p95 | p99 | Source |
|---------|----------------------|---------------|----------|-----|-----|-----|--------|
| `refund-service` | `GET /v1/receipts/{receiptNumber}/refundable-items` (includes API-01) | 1 | 3 | 300ms | 1500ms | 3000ms | LLD target (SDD §18.2 pins none; peak = 3 x sustained per REFUNDS/NFR-03) |
| `refund-service` | `POST /v1/refund-requests` (includes API-01) | 1 | 3 | 400ms | 1500ms | 3000ms | LLD target (SDD §18.2 pins none) |
| `refund-service` | Other refund GET and POST endpoints | 5 | 15 | 50ms | 200ms | 500ms | LLD target (SDD §18.2 pins none) |
| `loyalty-service` | `GET /v1/members/me/points*` | 5 | 15 | 50ms | 200ms | 500ms | LLD target (SDD §18.2 pins none) |
| `payout-service` | `REFUND_APPROVED` to first API-02 attempt | 0.1 msgs/s | 0.3 msgs/s | N/A | 30s end-to-end | 60s | LLD target (SDD §18.2 pins none) |
| `notification-service` | Refund event to accepted message | 0.5 msgs/s | 1.5 msgs/s | N/A | 30s end-to-end | 120s | LLD target (SDD §18.2 pins none) |
| `loyalty-service` | `RefundPaid` to take-back | N/A | N/A | N/A | N/A | 3600s | [SDD §18.2](../sdd-refunds-platform/14-performance-and-capacity.md#182-throughput-targets-per-service) (LOYALTY/NFR-02) |

> **Source:** each row links the SDD §18.2 row it derives from. A target the SDD does not pin reads `LLD target` and carries a `> TODO:` best-guess flag (`confidence-rules.md`); rows inferred from a service-level SDD target fall under the `> Confirm:` below.

> TODO: every RPS and latency row marked `LLD target` is a best guess sized from SDD §18.1 (about 40 requests a day, three times in seasonal sales, at most six messages per request); the latency and throughput targets are NEEDS CLARIFICATION in SDD §18.2 - verify with the product owners and record them there.

> Confirm: SLO targets - verify with SDD §18.2 Throughput Targets

## 15.2 Caching Strategy

| Cache | Scope | Eviction | TTL | Invalidation triggers |
|-------|-------|----------|-----|----------------------|
| None | - | - | - | - |

No cache tier ([SDD §6](../sdd-refunds-platform/02-ecosystem-overview.md#6-ecosystem-overview) Caching: Not applicable; AP-12). The only in-memory, read-mostly data are platform-wide or per-tenant configuration, not tenant data: the realm JWKS (Spring Security's default key refresh), `RolePermissionMapper` and `TenantSettingsRegistry` (loaded at start, changed only by a redeploy, SDD §11.5), and the notification templates (read per send; no cache at this volume).

> **Convention:** caches are tenant-scoped. Cache keys include `tenant_id`. Cross-tenant cache poisoning is impossible by construction.

## 15.3 Hot-Path Indexes

> Cross-references to `05-data-model.md` § Indexes. List the indexes that exist *specifically* to meet a SLO target, with the query they serve.

| Index | Query / SLO it serves | Rationale |
|-------|-----------------------|-----------|
| `ux_refund_item_active_line` | Refundable-items check in the lookup and submit (p95 1500ms including API-01) | Point lookup by receipt; the POS call dominates the budget |
| `ix_refund_request_customer` | `GET /v1/refund-requests` p95 200ms | Tenant and customer range scan, newest first, no sort step |
| `ix_refund_request_branch_queue` | `GET /v1/branches/{branchId}/refund-requests` p95 200ms | Tenant, branch, status range scan, oldest first |
| `ix_points_movement_member` | `GET /v1/members/me/points/movements` p95 200ms | Tenant and member range scan, newest first |
| `ix_outbox_unpublished`, `ix_event_publication_incomplete` | Relay and replay polls every 1 s and 1 min | Partial indexes keep the scanned set to the unpublished rows only |

## 15.4 Bulkhead & Concurrency

| Concern | Limit | Override mechanism |
|---------|-------|---------------------|
| Per-user rate limit (receipt lookup) | 10 a minute and 50 a day (SDD §6 proposal) | API gateway config (09 § 12.1 Confirm on the store) |
| Per-downstream-provider concurrent calls | `posRecords` 10, `posPurchases` 2, `cardPay` 5, `msgHub` 10 | Resilience4j Bulkhead config (see `09-cross-cutting.md` § 12.3) |
| Per-service DB pool | core 20 max / 5 min; payout-service 10 / 2; notification-service 10 / 2 | `spring.datasource.hikari.maximum-pool-size` |
| Outbox publisher batch size | 100 | `OUTBOX_BATCH_SIZE` env var |
| Kafka listener concurrency | Equal to the topic's partition count (6) | `spring.kafka.listener.concurrency` |
| Worker claim batch | `PAYOUT_CLAIM_BATCH` 20 per tick; messages 20 per tick | Env vars (10 § 13.1) |

## 15.5 Peak Scenarios

The scenarios, triggers, and multipliers are pinned in [SDD §18.3](../sdd-refunds-platform/14-performance-and-capacity.md#183-peak-scenarios) and referenced here; the LLD adds how each is met.

| Scenario | Trigger | Multiplier | Duration | Mitigation |
|----------|---------|------------|----------|------------|
| Seasonal sales | SDD §18.3 row 1 | 3x (SDD §18.3) | About 3 weeks (SDD §18.3) | HPA on the core (03 § 6.2); six partitions let consumer replicas scale; idempotent POSTs tolerate client retries |
| Payment provider outage | SDD §18.3 row 2 | Retries per pending payout (SDD §18.3) | Up to the SDD §17.2 retry window | `cardPay` circuit and bulkhead; persisted backoff; `PayoutFailed` and `RefundPayoutOverdue` alerts |
| POS Records outage | SDD §18.3 row 3 | Customer retries (SDD §18.3) | Unknown | `posRecords` circuit answers 503 fast; the import resumes from its cursor |
| Notification partner outage | SDD §18.3 row 4 | Backlog up to the attempt limit (SDD §18.3) | Up to about one hour of backoff (30 s doubling to the 30 min cap, with jitter) before `FAILED` at 8 attempts | `msgHub` circuit; persisted retry; refunds never blocked |

## 15.6 Load-Test Strategy

| Concern | Choice |
|---------|--------|
| Tooling | k6 (scripts in the repository, run from CI) |
| Environments | SIT (smoke), UAT (full peak), sized like production for the run ([SDD §18.4](../sdd-refunds-platform/14-performance-and-capacity.md#184-stress-testing-strategy)) |
| Scenario set | SDD §18.4: baseline, seasonal peak (3x), provider failure injection (payout refusals, POS Records and MsgHub outages) with the provider stubs |
| Acceptance criteria | All SLO targets met under sustained + peak; no lost or duplicate payout; no take-back later than one hour |
| Cadence | Pre-release + ad-hoc on hot-path changes, and before each seasonal sale |

> TODO: k6 is a best guess for the load-testing tool, which is NEEDS CLARIFICATION in SDD §18.4 together with the cadence and the reporting owner - verify with the QA lead.

<!-- MASTER: refunds-platform-lld-master.md | PREV: 11-security.md | NEXT: 13-testing.md -->

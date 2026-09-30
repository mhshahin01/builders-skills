<!--
CHUNK: 12
TITLE: Performance
PROJECT: [Project Name]
VERSION: [X.X]
PART OF: LLD - [Project Name]
-->

# 15. Performance

> **Convention:** SLOs and load targets carry over from SDD §18. This chunk operationalises them: what cache strategy, what indexes, what query plans, what bulkhead sizes meet the targets.

## 15.1 SLOs (per service)

| Service | Endpoint / Operation | Sustained RPS | Peak RPS | p50 | p95 | p99 | Source |
|---------|----------------------|---------------|----------|-----|-----|-----|--------|
| `[service-a]` | `POST /v1/foo` | [N] | [N] | [Nms] | [Nms] | [Nms] | [SDD §18.2](../sdd-[sdd-slug]/14-performance-and-capacity.md#182-throughput-targets-per-service) |
| `[service-a]` | `GET /v1/foo/{id}` | [N] | [N] | [Nms] | [Nms] | [Nms] | [SDD §18.2](../sdd-[sdd-slug]/14-performance-and-capacity.md#182-throughput-targets-per-service) |
| `[service-a]` | `foo.lifecycle.created` consumer | [N msgs/s] | [N msgs/s] | N/A | [Nms end-to-end] | [Nms] | LLD target (SDD §18.2 pins none) |

> **Source:** each row links the SDD §18.2 row it derives from. A target the SDD does not pin reads `LLD target` and carries a `> TODO:` best-guess flag (`confidence-rules.md`); rows inferred from a service-level SDD target fall under the `> Confirm:` below.

> `> Confirm: SLO targets - verify with SDD §18.2 Throughput Targets`

## 15.2 Caching Strategy

| Cache | Scope | Eviction | TTL | Invalidation triggers |
|-------|-------|----------|-----|----------------------|
| `[name]` | [Local / Redis / CDN] | [LRU / Time / None] | [N] | [Trigger] |

> **Convention:** caches are tenant-scoped. Cache keys include `tenant_id`. Cross-tenant cache poisoning is impossible by construction.

## 15.3 Hot-Path Indexes

> Cross-references to `05-data-model.md` § Indexes. List the indexes that exist *specifically* to meet a SLO target, with the query they serve.

| Index | Query / SLO it serves | Rationale |
|-------|-----------------------|-----------|
| `idx_foo_tenant_status` | `GET /v1/foo?status=ACTIVE` p95 < [N]ms | Without this index, full-tenant scan required |

## 15.4 Bulkhead & Concurrency

| Concern | Limit | Override mechanism |
|---------|-------|---------------------|
| Per-tenant rate limit | [N] RPS | API gateway config |
| Per-downstream-provider concurrent calls | [N] | Resilience4j Bulkhead config (see `09-cross-cutting.md` § 12.3) |
| Per-service DB pool | [N max, N min] | `spring.datasource.hikari.maximum-pool-size` |
| Outbox publisher batch size | 100 | `OUTBOX_BATCH_SIZE` env var |

## 15.5 Peak Scenarios

| Scenario | Trigger | Multiplier | Duration | Mitigation |
|----------|---------|------------|----------|------------|
| [Scenario] | [Trigger] | [Nx baseline] | [N min/h] | [Autoscale / Throttle / Queue / Degrade] |

> `> TODO: peak scenarios - verify with SDD §18.3`

## 15.6 Load-Test Strategy

| Concern | Choice |
|---------|--------|
| Tooling | [k6 / Gatling / JMeter] |
| Environments | SIT (smoke), UAT (full peak) |
| Scenario set | [List] |
| Acceptance criteria | All SLO targets met under sustained + peak |
| Cadence | Pre-release + ad-hoc on hot-path changes |

<!-- MASTER: [project-slug]-lld-master.md | PREV: 11-security.md | NEXT: 13-testing.md -->

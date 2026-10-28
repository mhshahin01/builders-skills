<!--
CHUNK: 12
TITLE: Performance
PROJECT: [Project Name]
VERSION: [X.X]
PART OF: LLD - [Project Name]
-->

# 15. Performance

<!-- Light run: the sub-sections of this chunk that carry the light-work flag are named in SKILL.md § Light run. -->

> **Convention:** SLOs and load targets carry over from SDD §18. This chunk operationalises them: what cache strategy, what indexes, what query plans, what bulkhead sizes meet the targets.

## 15.1 SLOs (per service)

| Service | Endpoint / Operation | Sustained RPS | Peak RPS | p50 | p95 | p99 | Source |
|---------|----------------------|---------------|----------|-----|-----|-----|--------|
| `[service-a]` | `POST /v1/foo` | [N] | [N] | [Nms] | [Nms] | [Nms] | [SDD §18.2](../sdd-[sdd-slug]/14-performance-and-capacity.md#182-throughput-targets-per-service) |
| `[service-a]` | `GET /v1/foo/{id}` | [N] | [N] | [Nms] | [Nms] | [Nms] | [SDD §18.2](../sdd-[sdd-slug]/14-performance-and-capacity.md#182-throughput-targets-per-service) |
| `[service-a]` | `foo.lifecycle.created` consumer | [N msgs/s] | [N msgs/s] | N/A | [Nms end-to-end] | [Nms] | LLD target (SDD §18.2 pins none) |

> **Source:** each row links the SDD §18.2 row (or the §18.5 NFR target) it derives from. A target the SDD does not pin reads `LLD target` and carries a `> TODO:` best-guess flag (`confidence-rules.md`); rows inferred from a service-level SDD target carry the SLO `> Confirm:` described in the comment below.

<!-- Unless SDD §18.2 or §18.5 pins a target for every row (confidence-rules.md), write: > Confirm: SLO targets - verify with SDD §18.2 Throughput Targets -->

## 15.2 Caching Strategy

| Cache | Scope | Eviction | TTL | Invalidation triggers |
|-------|-------|----------|-----|----------------------|
| `[name]` | [Local / Redis / CDN] | [LRU / Time / None] | [N] | [Trigger] |

> **Convention:** caches are tenant-scoped. Cache keys include `tenant_id`. Cross-tenant cache poisoning is impossible by construction. When SDD ADR-01 and §8.1 isolate per account with no tenants, the account takes the place of `tenant_id` in this rule and in the table below.

**Derived keys:**

<!-- One row per key a service computes: a cache key, an object or file store key, an artifact or content hash, a dedup key. Identity parts: every input that changes the result, in order, with the owner among them (the tenant, or the account when isolation is per account), so two owners never share a key. Encoding: unambiguous, so two different part lists never give the same key: each part length-prefixed, a structured hash input (for example a canonical JSON array), or fixed-width parts; never parts joined by a separator a part may contain. The idempotency dedup tuple lives in 09 § 12.2; its row here links it. -->

| Key | Used for | Identity parts (in order) | Owner part | Encoding | Source |
|-----|----------|---------------------------|------------|----------|--------|
| `[render-cache]` | [Rendered document artifact] | `tenant_id`, `document_id`, `template_id`, `template_version`, `format` | `tenant_id` | SHA-256 of a canonical JSON array of the parts | [SDD §17.X / LLD] |
| `[object-key]` | [Uploaded file in the object store] | `tenant_id`, `owner_id`, `file_id` | `tenant_id` | Path segments of fixed-format IDs (UUIDs) | [SDD §17.X / LLD] |
| Idempotency dedup | Write retries | [09 § 12.2](./09-cross-cutting.md#122-idempotency) dedup tuple | `tenant_id` | Composite key columns | [09 § 12.2](./09-cross-cutting.md#122-idempotency) |

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
| Per-service DB pool | § 15.4a formula | `spring.datasource.hikari.maximum-pool-size` |
| Outbox publisher batch size | 100 | `OUTBOX_BATCH_SIZE` env var |

## 15.4a Pool Sizing

<!-- One row per pool: database connections, worker or executor threads, HTTP client connections, broker consumer concurrency. Size formula: the sum of the pool's consumers, each with its count (request threads that hold a connection, job workers, a permanently held listener connection, lease extensions, headroom), never a bare number. Value: the formula's result with today's counts. A change to any consumer count recomputes the row. For database pools, add one row that checks pool size times instances against the database connection limit, less its reserved connections. -->

| Pool | Consumers (count each) | Size formula | Value | Setting | Source |
|------|------------------------|--------------|-------|---------|--------|
| DB pool, `[service-a]` | Request threads [R]; job workers [W]; listener [1]; lease extensions [W]; headroom [2] | `R + 2W + 1 + 2` | [N] | `spring.datasource.hikari.maximum-pool-size` | [LLD] |
| DB connection budget | Each instance's DB pool [N] times instances [I] | `N * I <= max_connections - reserved` | [N × I] of [limit] | Database config | [SDD §18 / LLD] |

## 15.4b Derived Timeouts

<!-- One row per timeout computed from another setting (a statement timeout from a job lease, a call timeout from a request deadline). Floor: the lowest value the timeout may take. Start-up check: the service computes the value at start-up and refuses to start when it is below the floor or not below its parent. Inner timeouts are shorter than outer ones (call < request < gateway; statement < lease). With no timeout derived from another setting, write "None - no derived timeouts." -->

| Timeout | Derived from | Formula | Floor | Start-up check | Source |
|---------|--------------|---------|-------|----------------|--------|
| Job statement timeout | Job lease | `lease - [30s]` | [10s] | Refuse start-up when below the floor or not below the lease | [LLD] |

## 15.4c Outbound Clients

<!-- One row per outbound client of every in-scope service, SDK clients included: provider and service HTTP clients, cloud and object store SDKs, secret-store clients, key-set (JWKS) fetchers, mail clients, broker producers. No client runs on a library default with no timeout. Connect and Read are the transport settings of the client. Call timeout and Retries: for a client a 09 § 12.3 instance wraps, the cell names that instance, which holds the values; otherwise the values are here. On timeout: the work is cancelled, not only the wait: the request or socket is aborted and the task stops. A timeout that only stops waiting while the task keeps running does not count. Non-interruptible work (a blocking parse, a native call, a call made under a lock) runs on its own bounded executor, apart from shared pools, so a hung task holds only its own thread; name that executor in the row. -->

| Client | Caller | Target | Kind | Connect | Read | Call timeout | Retries | On timeout | Source |
|--------|--------|--------|------|---------|------|--------------|---------|------------|--------|
| `[providerClient]` | `[service-a]` | [Provider] | HTTP | [2s] | [10s] | 09 § 12.3 `[instanceName]` | 09 § 12.3 `[instanceName]` | Request aborted | [SDD §17.X Integrations] |
| `[objectStoreClient]` | `[service-a]` | [Object store] | SDK | [2s] | [30s] | [60s] | [3, SDK backoff] | Request aborted | [LLD] |
| `[jwksFetcher]` | `[service-a]` | [Token issuer key set] | Key-set fetch | [2s] | [5s] | [5s] | [1] | Fetch aborted; cached keys kept | [LLD] |
| `[secretStoreClient]` | `[service-a]` | [Secret store] | SDK | [2s] | [5s] | [10s] | [2, SDK backoff] | Request aborted; called under a lock, so it runs on its own executor `[secretsExecutor]`, [2] threads | [LLD] |

## 15.5 Peak Scenarios

| Scenario | Trigger | Multiplier | Duration | Mitigation |
|----------|---------|------------|----------|------------|
| [Scenario] | [Trigger] | [Nx baseline] | [N min/h] | [Autoscale / Throttle / Queue / Degrade] |

<!-- Unless SDD §18.3 lists the peak scenarios (confidence-rules.md), write: > TODO: peak scenarios - verify with SDD §18.3 -->

## 15.6 Load-Test Strategy

| Concern | Choice |
|---------|--------|
| Tooling | [k6 / Gatling / JMeter] |
| Environments | SIT (smoke), UAT (full peak) |
| Scenario set | [List] |
| Acceptance criteria | All SLO targets met under sustained + peak |
| Cadence | Pre-release + ad-hoc on hot-path changes |

<!-- MASTER: [project-slug]-lld-master.md | PREV: 11-security.md | NEXT: 13-testing.md -->

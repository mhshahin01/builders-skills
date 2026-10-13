<!--
CHUNK: 12
TITLE: Performance
PROJECT: Refunds Platform
VERSION: 1.1
PART OF: LLD - Refunds Platform
-->

# 15. Performance

> **Convention:** SLOs and load targets come from SDD [§18](../sdd-refunds-platform/14-performance-and-capacity.md#18-performance--capacity-planning). This chunk adds what meets them.

## 15.1 SLOs (per service)

| Service | Endpoint / Operation | Sustained RPS | Peak RPS | p50 | p95 | p99 | Source |
|---------|----------------------|---------------|----------|-----|-----|-----|--------|
| `refund-request` | All endpoints | Open | Open | Open | Open | Open | [SDD §18.2](../sdd-refunds-platform/14-performance-and-capacity.md#182-throughput-targets-per-service) (marker) |
| `refund-request` | `POST /v1/refund-requests` | LLD target 0.1 | LLD target 1 | LLD target 300 ms | LLD target 800 ms | LLD target 1500 ms | LLD target (SDD [§18.2](../sdd-refunds-platform/14-performance-and-capacity.md#182-throughput-targets-per-service) pins none; REFUNDS/NFR-05 seconds open, [§18.5](../sdd-refunds-platform/14-performance-and-capacity.md#185-nfr-targets)) |
| `refund-request` | `GET /v1/receipts/{receiptNumber}/refundable-items` | LLD target 0.1 | LLD target 1 | LLD target 400 ms | LLD target 1000 ms | LLD target 2000 ms | LLD target (SDD [§18.2](../sdd-refunds-platform/14-performance-and-capacity.md#182-throughput-targets-per-service) pins none; includes API-04) |
| `loyalty-points` | All endpoints | Open | Open | Open | Open | Open | [SDD §18.2](../sdd-refunds-platform/14-performance-and-capacity.md#182-throughput-targets-per-service) (marker) |
| `loyalty-points` | Take-back (`RefundRequestPaid` listener, or a parked take-back applied at intake) | N/A | N/A | N/A | N/A | committed within 1 h of the latest of: the refund being paid, the kept outcome reaching `loyalty-points` when Loyalty Points is switched on, and the purchase earning its points within the wait of LOYALTY/UC-02 BR-5: refund paid before earning | [SDD §18.5 LOYALTY/NFR-02](../sdd-refunds-platform/14-performance-and-capacity.md#185-nfr-targets) |
| `payout` | Payout attempts | Not applicable (no inbound user traffic) | - | - | - | - | [SDD §18.2](../sdd-refunds-platform/14-performance-and-capacity.md#182-throughput-targets-per-service) |
| `customer-notification` | Messages | Not applicable (no inbound user traffic) | - | - | - | - | [SDD §18.2](../sdd-refunds-platform/14-performance-and-capacity.md#182-throughput-targets-per-service) |
| `refunds-platform-app` | Whole request path availability (load balancer, IAM sign-in and token issue, deployable, PostgreSQL) | - | - | - | - | 99.72% per 30-day month, planned maintenance included | [SDD §18.5 REFUNDS/NFR-02](../sdd-refunds-platform/14-performance-and-capacity.md#185-nfr-targets) |

> **Source:** each row links the SDD §18.2 row or the §18.5 NFR target it derives from; `LLD target` marks a value the SDD does not pin.

> TODO: every "LLD target" value above is a best guess sized from the SDD §18.1 volumes (about 40 requests a day, 120 at the peak); the per-module targets are the SDD §18.2 [NEEDS CLARIFICATION] and REFUNDS/NFR-05 the SDD §18.5 [NEEDS CLARIFICATION] - verify with the solution architect and the REFUNDS BRD owner.

**NFR targets (SDD [§18.5](../sdd-refunds-platform/14-performance-and-capacity.md#185-nfr-targets)) and where this LLD realises them:**

| BRD NFR | Realised in this LLD | Source |
|---------|----------------------|--------|
| REFUNDS/NFR-01 | One payout per refund request (`ux_payout_refund_request`), one key per payout round, the publication log, and the daily reconciliation with the month-end count ([payout § Workflow: Payout reconciliation](./04-implementation/payout.md#workflow-payout-reconciliation)); `payout_reconciliation_mismatches_total` | SDD §18.5 |
| REFUNDS/NFR-02 | The availability row above; `AvailabilityBurnRate` (`10-operations.md` § 13.7); at least 2 replicas and readiness (`09-cross-cutting.md` § 12.10); the IAM ADR-07 settles must meet the same target | SDD §18.5, ADR-07 |
| REFUNDS/NFR-03 | § 15.5 Seasonal sales | SDD §18.5, §18.3 |
| REFUNDS/NFR-04 | Owner, branch, and own-request gates (`09-cross-cutting.md` § 12.1); `PAYOUT_OPERATOR` gates and operations access (`11-security.md` § 14.4); no personal data in logs (§ 12.7) | SDD §18.5 |
| REFUNDS/NFR-05 | The two `refund-request` LLD target rows above (seconds open) | SDD §18.5 marker |
| REFUNDS/NFR-06 | The retention purge workflows of each module (`05-data-model.md` § 8.6), off until the periods are set | SDD §18.5 |
| REFUNDS/NFR-07 | Nothing built: the target is open | SDD §18.5 marker |
| LOYALTY/NFR-01 | Account row lock, inbox, take-back cap, and the daily balance verification ([loyalty-points § Workflow: Loyalty balance verification](./04-implementation/loyalty-points.md#workflow-loyalty-balance-verification)); `LoyaltyBalanceMismatch` | SDD §18.5 |
| LOYALTY/NFR-02 | The take-back row above; `loyalty_takeback_lag_seconds`, `PublicationListenerLag` at 30 minutes counted from the later of publication and switch-on; § 15.5 Loyalty Points switch-on | SDD §18.5, §11.4 |
| LOYALTY/NFR-03 | The timing note of LOYALTY/UC-01 (flagged in loyalty-points § 7.8) | SDD §18.5 marker |
| LOYALTY/NFR-04 | Met by the REFUNDS/NFR-02 target of the shared deployable meanwhile | SDD §18.5 marker |
| LOYALTY/NFR-05 | Member gate on every loyalty endpoint; another member's movement is 404 | SDD §18.5 |

> TODO: REFUNDS/NFR-07 has no technical target (SDD §18.5 [NEEDS CLARIFICATION]: the countries whose tax law applies, the refund document the customer receives, and a fiscal register or the branch's accounts); best guess: no change to this LLD until answered, and an answer may add a document the platform issues and a fiscal-register or accounting integration (a new SDD §12 row and §15 contract) - verify with the REFUNDS BRD owner.

## 15.2 Caching Strategy

| Cache | Scope | Eviction | TTL | Invalidation triggers |
|-------|-------|----------|-----|----------------------|
| None | - | - | - | - |

No SDD §18 target requires a cache, and SDD §6 Caching is "Not applicable for this release": balances, lists, and the dispute copy are read from module tables at the §18.1 volumes. The IAM's signing keys are cached by Spring Security's JWK set handling (part of Spring Boot) for the one issuer.

> **Convention:** a cache added later is tenant-scoped (key includes `tenant_id`).

## 15.3 Hot-Path Indexes

| Index | Query / SLO it serves | Rationale |
|-------|-----------------------|-----------|
| `ix_refund_request_owner` | `GET /v1/refund-requests` | Owner list, newest first, without a sort |
| `ix_refund_request_branch_submitted` | `GET /v1/branches/{branchId}/refund-requests` | Partial index on `SUBMITTED` keeps the branch list small |
| `ux_refund_request_unit_claim`, `ix_refund_request_unit_receipt` | Receipt lookup and submit | Claim check and eligibility read per receipt |
| Dispute copy on `(tenant_id, original_payment_reference)` (SDD [§17.1 Tables Design](../sdd-refunds-platform/13a-service-refund-request.md#tables-design)) | `GET /v1/branches/{branchId}/refund-requests/{refundRequestId}` (open card dispute), the approved-not-paid gauge snapshot | One indexed lookup per request instead of a scan of the copy |
| `ix_points_movement_account` | `GET /v1/members/me/points-movements`, newest movement date | Index-ordered page |
| `ix_payout_due`, `ix_message_queued`, `ix_epl_due` | `payout-retry`, `message-sender`, redelivery claims | Partial indexes on due rows keep each claim a short scan |

## 15.4 Bulkhead & Concurrency

| Concern | Limit | Override mechanism |
|---------|-------|---------------------|
| Per-caller rate limit | 30 requests a minute per subject on receipt lookup and submit | `REFUND_RATE_LIMIT_PER_MINUTE` |
| Per-downstream-provider concurrent calls | `cardpayPayout` 5, `cardpayRefundRecords` 1, `cardpayDisputeNotices` 1, `msghubSend` 10, `posReceiptLookup` 20, `iamUserQuery` 5 | Resilience4j Bulkhead config (`09-cross-cutting.md` § 12.3) |
| Per-module DB pool | 10 max / 2 min each for `refund-request` and `loyalty-points`; 5 max / 1 min for `payout` and `customer-notification` | `spring.datasource.<module>.hikari.maximum-pool-size` |
| Claim batch sizes | `payout-retry` 20, `message-sender` 50, redelivery 100 | Job configuration |

> TODO: pool sizes, bulkhead sizes, and the rate limit are best guesses for the SDD §18.1 volumes; the rate limit is a value SDD §17.1 leaves to the solution architect - verify after the first load test.

## 15.5 Peak Scenarios

| Scenario | Trigger | Multiplier | Duration | Mitigation |
|----------|---------|------------|----------|------------|
| Seasonal sales | SDD [§18.3](../sdd-refunds-platform/14-performance-and-capacity.md#183-peak-scenarios) | 3x refund requests (REFUNDS/NFR-03) | About 3 weeks | More replicas within the SDD §11.3 bounds; job claims use `SKIP LOCKED`, so senders scale with replicas while bulkheads cap provider concurrency |
| Provider outage recovery | SDD §18.3 | Queued attempts and messages released at once | Until queues drain | Claims are batched (20, 50) with jittered `next_attempt_at`; breakers close through half-open; an open breaker makes no call and burns no attempt |
| POS Records late batch | SDD §18.3 | Depends on the delivery (open) | Open | Intake is per purchase, idempotent, and takes only one purchase lock and one account lock; parked take-backs of the purchases are applied in the same transaction |
| Loyalty Points switch-on | LLD (SDD [§11.1](../sdd-refunds-platform/07-cross-cutting-concerns.md#111-db-modeling-default), [§20.1.8](../sdd-refunds-platform/16-operations-runbook.md#2018-switch-on-a-product-or-start-more-branches)): every refund outcome kept in `refund-request`'s publication log reaches the four `loyalty-points` listeners at once | About 1,200 kept outcomes per month the Refunds Portal ran alone (SDD §18.1) | Minutes: the redelivery job delivers up to 100 rows every 10 s on each replica | Each take-back is one short transaction with the request, purchase, and account locks; LOYALTY/NFR-02 counts from the switch-on, so the drain must end within 1 hour |

## 15.6 Load-Test Strategy

| Concern | Choice |
|---------|--------|
| Tooling | Open: a load-testing tool is a new dependency (SDD [§18.4](../sdd-refunds-platform/14-performance-and-capacity.md#184-stress-testing-strategy)); k6 proposed, needs approval |
| Environments | UAT-sized at minimum (SDD §18.4) |
| Scenario set | Baseline, 3x seasonal peak sustained, provider outage recovery, soak (SDD §18.4); plus the Loyalty Points switch-on drain (LLD, § 15.5) |
| Acceptance criteria | The §18.2 targets once set, REFUNDS/NFR-05, and § 15.1 LLD targets meanwhile; the switch-on drain within LOYALTY/NFR-02 |
| Cadence | Open (SDD §18.4 marker) |

> TODO: tooling, cadence, and reporting are the SDD §18.4 [NEEDS CLARIFICATION] (solution architect) - verify.

<!-- MASTER: refunds-platform-lld-master.md | PREV: 11-security.md | NEXT: 13-testing.md -->

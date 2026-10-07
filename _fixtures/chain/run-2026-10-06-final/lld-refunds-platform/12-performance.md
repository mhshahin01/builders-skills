<!--
CHUNK: 12
TITLE: Performance
PROJECT: Refunds Platform
VERSION: 1.0
PART OF: LLD - Refunds Platform
MODE: from-sdd
-->

# 15. Performance

## 15.1 SLOs (per service)

Sourced derived view; budgets are not invented percentile guarantees.

| Service | Operation / SLI | Target | Qualification | Source |
| --- | --- | --- | --- | --- |
| refund-requests / customer-accounts | Everyday page/receipt/sign-up wait | <=3 s end to end | No inferred percentile | [SDD §18.1; REFUNDS/NFR-05](../sdd-refunds-platform/14-performance-and-capacity.md) |
| loyalty-points | Balance and first history page | <=2 s end to end | No inferred percentile | [SDD §18.1; LOYALTY/NFR-05](../sdd-refunds-platform/14-performance-and-capacity.md) |
| payouts | Missing/duplicate payout | 0 | Business correctness | [SDD §18.1; REFUNDS/NFR-01](../sdd-refunds-platform/14-performance-and-capacity.md) |
| platform / REFUNDS | Unavailability | <=120 minutes/month | Source minute definition | [SDD §18.5; REFUNDS/NFR-02](../sdd-refunds-platform/14-performance-and-capacity.md) |
| platform / LOYALTY | Unavailability | <=60 minutes/month including sign-in brokers | Source minute definition | [SDD §18.5; LOYALTY/NFR-04](../sdd-refunds-platform/14-performance-and-capacity.md) |
| loyalty-points | Paid refund take-back | <=1 hour after later paid/purchase fact | Source dependency timing | [SDD §18; LOYALTY/NFR-02](../sdd-refunds-platform/14-performance-and-capacity.md) |
| loyalty-points | Purchase earned points visible | By end of purchase day | POS delivery by 22:00 branch local | [SDD §18; LOYALTY/NFR-03](../sdd-refunds-platform/14-performance-and-capacity.md) |


> TODO: p50/p95 distributions, sustained/peak RPS, concurrency and LOYALTY volume are unknown in SDD §18 - measure; do not turn end-to-end budgets into module percentile targets.
> TODO: The identity brokers' availability commitment remains a source SDD §18.5 dependency; verify against the 60-minute combined budget.

## 15.2 Caching Strategy

None for this release, per SDD §6. Reads use PostgreSQL; no stale/zero fallback for points. Introduce no cache unless an upstream decision and measured load justify it.

## 15.3 Hot-Path Indexes

§8.2/8.3 own indexes. Test EXPLAIN on tenant/customer/status/submitted_at and tenant/member/movement_date queries, publication-age polling, due worker scans and purchase-key locks. Cross-tenant global indexes are not substituted for tenant-first keys.

## 15.4 Bulkhead & Concurrency

§12.3 owns each provider instance. Codes and event messages have separate slots; payment retries cannot consume user query workers. Transactions and provider I/O never share a long-lived DB transaction. Load tests determine pool size and worker batch size before production configuration is set.

## 15.5 Peak Scenarios

Source REFUNDS approximately 1,200 requests/month across 40 branches, seasonal triple load for about three weeks (SDD §18). No extrapolated LOYALTY throughput. Include same-purchase contention, burst callbacks after outage, event backlog replay and month report export while user reads run.

## 15.6 Load-Test Strategy

SIT/UAT replay source mix with production-like RLS/standby/ingress/brokered sign-in. Measure ingress latency and the source unavailable-minute definition, synthetic quiet-minute probes, pool waits and publication lag. Crash after provider success before local acknowledgement verifies stable attempt/message identity under replay. Report source business invariants beside latency; a fast duplicate payout fails the test.


<!-- MASTER: refunds-platform-lld-master.md | PREV: 11-security.md | NEXT: 13-testing.md -->

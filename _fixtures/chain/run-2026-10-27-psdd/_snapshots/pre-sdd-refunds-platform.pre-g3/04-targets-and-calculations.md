<!--
CHUNK: 04
TITLE: Targets and Calculations
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: 03a-03h
PART OF: Pre-SDD - Refunds Platform
-->

# 4. Targets and Calculations

## 4.1 Targets

**Service level objectives**

| Target | Entry | Value | Status | Register |
|--------|-------|-------|--------|----------|
| Availability, refund journeys | REL-01.1 | 99.9 % | Confirmed | [03c](./03c-register-reliability.md#rel-01) |
| Availability, points screens | REL-01.2 | 99.9 % | Confirmed | [03c](./03c-register-reliability.md#rel-01) |
| SLA to customers against internal SLO | REL-02.1 | TBD | Open | [03c](./03c-register-reliability.md#rel-02) |

**Latency budgets** (measured where CAP-08.1 says: the ingress edge, successful and failed requests measured separately)

| Target | Entry | Value | Status | Register |
|--------|-------|-------|--------|----------|
| P99, everyday portal actions | CAP-07.1 | 2000 ms | Confirmed | [03b](./03b-register-capacity.md#cap-07) |
| P99, points balance and history | CAP-07.2 | 2000 ms | Confirmed | [03b](./03b-register-capacity.md#cap-07) |

**Recovery targets**

| Target | Entry | Value | Status | Register |
|--------|-------|-------|--------|----------|
| Failure scope: loss of a whole region | REL-05.1 | region | Confirmed | [03c](./03c-register-reliability.md#rel-05) |
| Failure scope: loss of one zone | REL-05.2 | az | Confirmed | [03c](./03c-register-reliability.md#rel-05) |
| RTO, whole platform, region loss | REL-03.1 | 14400 s | Confirmed | [03c](./03c-register-reliability.md#rel-03) |
| RTO, whole platform, zone loss | REL-03.2 | 300 s | Confirmed | [03c](./03c-register-reliability.md#rel-03) |
| RPO, all refund and points data, region loss | REL-04.1 | 900 s | Confirmed | [03c](./03c-register-reliability.md#rel-04) |
| RPO, all refund and points data, zone loss | REL-04.2 | 5 s | Confirmed | [03c](./03c-register-reliability.md#rel-04) |

**Capacity drivers**

| Target | Entry | Value | Status | Register |
|--------|-------|-------|--------|----------|
| Points movements per day (primary) | CAP-01.1 | 2000 transactions/day | Confirmed | [03b](./03b-register-capacity.md#cap-01) |
| Refund requests per day | CAP-01.2 | 40 transactions/day | Confirmed | [03b](./03b-register-capacity.md#cap-01) |
| Peak simultaneously active users | CAP-03.1 | 300 peak simultaneously active users (customers, members and branch managers) | Confirmed | [03b](./03b-register-capacity.md#cap-03) |
| Peak factor (seasonal sales) | CAP-04.1 | 3 × | Confirmed | [03b](./03b-register-capacity.md#cap-04) |
| Growth forecast | CAP-05.1 | TBD | Open | [03b](./03b-register-capacity.md#cap-05) |
| New logical data per day | DAT-02.1 | 0.016 GB/day | Confirmed | [03d](./03d-register-data.md#dat-02) |

## 4.2 Calculations

<!-- ENGINE-FRAGMENT: 04-calculations.md -->
| ID | Calculation | Formula | Inputs | Result | Status |
|---|---|---|---|---|---|
| CALC-01 | Average business TPS | daily_transactions / 86400 | CAP-01.1 | 0.0231 txn/s | Estimated |
| CALC-02 | Peak business TPS | average_TPS × peak_factor | CAP-01.1, CAP-04.1 | 0.0694 txn/s | Estimated |
| CALC-03 | Peak API RPS | peak_TPS × calls_per_txn × request_amplification | CAP-01.1, CAP-04.1 | 0.2292 req/s | Estimated |
| CALC-04 | Headroom throughput budget | peak_API_RPS / utilization_fraction | CAP-01.1, CAP-07.1 | 0.3526 req/s | Estimated |
| CALC-05 | Mean requests in flight | peak_API_RPS × mean_latency_ms / 1000 | CAP-07.1 | 0.0275 requests | Estimated |
| CALC-06 | Peak inbound network | peak_RPS × request_KB × 8 / 1000 × overhead | CAP-01.1, INT-08.1 | 0.0088 Mbps | Estimated |
| CALC-07 | Peak outbound network | peak_RPS × response_KB × 8 / 1000 × overhead | CAP-01.1, INT-08.1 | 0.0352 Mbps | Estimated |
| CALC-08 | Combined modeled boundary traffic | inbound_Mbps + outbound_Mbps | INT-08.1 | 0.044 Mbps | Estimated |
| CALC-09 | Daily API payload transfer | avg_API_RPS × 86400 × (request_KB + response_KB) / 1e6 | CAP-01.1 | 0.132 GB/day | Estimated |
| CALC-10 | New logical data per day | daily_txn × stored_KB_per_txn / 1e6 | DAT-01.1 | 0.016 GB/day | Estimated |
| CALC-11 | Retained logical data | starting_GB + daily_new_GB × retention_days | DAT-01.1 | 59.448 GB | Estimated |
| CALC-12 | Planning storage footprint | logical_GB × index_factor × modeled_copies | DAT-01.1 | 166.4544 GB | Estimated |
| CALC-13 | 30-day downtime budget | (1 − availability_pct/100) × 30 × 86400 | REL-01.1 | 2,592 s | Estimated |
| CALC-14 | Annual downtime budget | (1 − availability_pct/100) × 365 × 86400 | REL-01.1 | 31,536 s | Estimated |
| CALC-15 | Hypothetical RPO exposure | peak_TPS × RPO_seconds | REL-04.1, CAP-01.1 | 62.5 txns | Estimated |
| CALC-16 | One-year projected peak API RPS | peak_RPS × (1 + growth_pct/100) | CAP-05.1 | TBD | Open |
| CALC-17 | Ideal migration bulk transfer | migration_GB × 8000 / (effective_Mbps × 3600) | none | TBD | Open |
| CALC-18 | Proposed address block count | 2 ^ (32 − prefix) | INT-08.1 | TBD | Open |
| CALC-19 | Estimated business read TPS | peak_business_TPS × read_percent / 100 | CAP-01.1, DAT-01.1 | TBD | Open |
| CALC-20 | Estimated business write TPS | peak_business_TPS × (100 − read_percent) / 100 | CAP-01.1, DAT-01.1 | TBD | Open |
<!-- /ENGINE-FRAGMENT -->

## 4.3 What the Numbers Mean

- **Capacity:** the platform is sized from the primary transaction type, CAP-01.1 (points movements). CALC-02 (peak business TPS) and CALC-03 (peak API RPS) count only the points movements of CAP-01.1; the peak simultaneously active users of CAP-03.1 are read by no calculation (risk R7); CALC-04 gives the headroom throughput budget at the appendix utilization. The refund requests of CAP-01.2 are not read by the calculations (advisory PRIMARY-ONLY-CAP-01 in chunk 10) and travel to the SDD as their own entry. CALC-16 (one-year projected peak) reads TBD until CAP-05.1 is answered.
- **Latency:** CAP-07.1 and CAP-07.2 set one P99 budget for the everyday screens, measured at the ingress edge (CAP-08.1). CALC-05 (mean requests in flight) uses the appendix mean latency on CAP-07.1, not the P99.
- **Availability and recovery:** REL-01.1 and REL-01.2 give the 30-day downtime budget of CALC-13 and the annual budget of CALC-14; CALC-13 stays inside the 2 hours of disruption a month of REL-08.1 ([REFUNDS/NFR-02](../brd-refunds-portal/10-nfrs.md#non-functional-requirements)). A zone loss recovers within REL-03.2 with a data loss of at most REL-04.2; a region loss recovers within REL-03.1 with a data loss of at most REL-04.1. The rule trace (SLO-15@region, chunk 09) stands: one full-length region outage at REL-03.1 lasts longer than the 30-day downtime budget of CALC-13. Whether a declared region loss counts against REL-01.1 and REL-01.2 is open: their measurement window reads TBD, and the exclusions belong to REL-02.1 (`Open`, Refunds and Loyalty Product Owner, 2026-11-30). CALC-15 gives the transactions exposed at REL-04.1.
- **Data growth and bandwidth:** CALC-10 gives the new logical data per day, CALC-11 the retained logical data over the DAT-06.1 retention, and CALC-12 the planning storage footprint with the appendix index factor and copies. CALC-06 to CALC-09 give the peak boundary traffic and the daily payload transfer from the CAP-06.1 payload sizes. CALC-17, CALC-18, CALC-19 and CALC-20 read TBD: there is no migration, no address prefix (INT-08.1 has none), and no read and write mix (CAP-10.1 is `Open`).

<!-- MASTER: refunds-platform-pre-sdd-master.md | PREV: 03h-register-economics.md | NEXT: 05-target-shape.md -->

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

| Target | Entry | Value | Status | Register |
|--------|-------|-------|--------|----------|
| Availability SLO, Refunds Portal journeys | REL-01.1 | 99.9 % | Confirmed | [03c](./03c-register-reliability.md#rel-01) |
| Availability SLO, member points screens | REL-01.2 | 99.9 % | Confirmed | [03c](./03c-register-reliability.md#rel-01) |
| Customer SLA against internal SLO | REL-02.1 | TBD | Open | [03c](./03c-register-reliability.md#rel-02) |
| P99 latency, Refunds Portal everyday actions | CAP-07.1 | 2,000 ms | Confirmed | [03b](./03b-register-capacity.md#cap-07) |
| P99 latency, member points screens | CAP-07.2 | 2,000 ms | Confirmed | [03b](./03b-register-capacity.md#cap-07) |
| Latency measurement point | CAP-08.1 | Ingress edge; successful and failed requests measured separately | Confirmed | [03b](./03b-register-capacity.md#cap-08) |
| RTO, whole platform, scope region | REL-03.1 | 14,400 s | Confirmed | [03c](./03c-register-reliability.md#rel-03) |
| RTO, whole platform, scope az | REL-03.2 | 300 s | Confirmed | [03c](./03c-register-reliability.md#rel-03) |
| RPO, all refund and points data, scope region | REL-04.1 | 900 s | Confirmed | [03c](./03c-register-reliability.md#rel-04) |
| RPO, all refund and points data, scope az | REL-04.2 | 5 s | Confirmed | [03c](./03c-register-reliability.md#rel-04) |
| Failure scope, loss of a whole region | REL-05.1 | region | Confirmed | [03c](./03c-register-reliability.md#rel-05) |
| Failure scope, loss of one zone | REL-05.2 | az | Confirmed | [03c](./03c-register-reliability.md#rel-05) |
| Daily transactions, points movement | CAP-01.1 | 2,000 transactions/day | Confirmed | [03b](./03b-register-capacity.md#cap-01) |
| Daily transactions, refund request | CAP-01.2 | 40 transactions/day | Confirmed | [03b](./03b-register-capacity.md#cap-01) |
| Peak simultaneously active users | CAP-03.1 | 300 peak simultaneously active users (customers, members and branch managers) | Confirmed | [03b](./03b-register-capacity.md#cap-03) |
| Peak factor, seasonal sales | CAP-04.1 | 3 × | Confirmed | [03b](./03b-register-capacity.md#cap-04) |
| Growth | CAP-05.1 | TBD | Open | [03b](./03b-register-capacity.md#cap-05) |
| New data per day | DAT-02.1 | 0.016 GB/day | Confirmed | [03d](./03d-register-data.md#dat-02) |

## 4.2 Calculations

<!-- ENGINE-FRAGMENT: 04-calculations.md -->
| ID | Calculation | Formula | Inputs | Result | Status |
|---|---|---|---|---|---|
| CALC-01 | Average business TPS | daily_transactions / 86400 | CAP-01.1 | 0.0231 txn/s | Estimated |
| CALC-02 | Peak business TPS | average_TPS × peak_factor | CAP-01.1, CAP-04.1 | 0.0694 txn/s | Estimated |
| CALC-03 | Peak API RPS | peak_TPS × calls_per_txn × request_amplification | CAP-01.1, CAP-04.1, CAP-02.1.callsPerTxn, CAP-02.1.requestFactor | 0.2292 req/s | Estimated |
| CALC-04 | Headroom throughput budget | peak_API_RPS / utilization_fraction | CAP-01.1, CAP-04.1, CAP-02.1.callsPerTxn, CAP-02.1.requestFactor, CAP-04.1.utilization | 0.3526 req/s | Estimated |
| CALC-05 | Mean requests in flight | peak_API_RPS × mean_latency_ms / 1000 | CAP-01.1, CAP-04.1, CAP-02.1.callsPerTxn, CAP-02.1.requestFactor, CAP-07.1.meanLatencyMs | 0.0275 requests | Estimated |
| CALC-06 | Peak inbound network | peak_RPS × request_KB × 8 / 1000 × overhead | CAP-01.1, CAP-04.1, CAP-02.1.callsPerTxn, CAP-02.1.requestFactor, CAP-06.1.requestKB, CAP-06.1.networkOverhead | 0.0088 Mbps | Estimated |
| CALC-07 | Peak outbound network | peak_RPS × response_KB × 8 / 1000 × overhead | CAP-01.1, CAP-04.1, CAP-02.1.callsPerTxn, CAP-02.1.requestFactor, CAP-06.1.responseKB, CAP-06.1.networkOverhead | 0.0352 Mbps | Estimated |
| CALC-08 | Combined modeled boundary traffic | inbound_Mbps + outbound_Mbps | CAP-01.1, CAP-04.1, CAP-02.1.callsPerTxn, CAP-02.1.requestFactor, CAP-06.1.requestKB, CAP-06.1.responseKB, CAP-06.1.networkOverhead | 0.044 Mbps | Estimated |
| CALC-09 | Daily API payload transfer | avg_API_RPS × 86400 × (request_KB + response_KB) / 1e6 | CAP-01.1, CAP-02.1.callsPerTxn, CAP-02.1.requestFactor, CAP-06.1.requestKB, CAP-06.1.responseKB | 0.132 GB/day | Estimated |
| CALC-10 | New logical data per day | daily_txn × stored_KB_per_txn / 1e6 | CAP-01.1, DAT-02.1.storedKB | 0.016 GB/day | Estimated |
| CALC-11 | Retained logical data | starting_GB + daily_new_GB × retention_days | CAP-01.1, DAT-02.1.storedKB, DAT-02.1.initialGB, DAT-02.1.retentionDays | 59.448 GB | Estimated |
| CALC-12 | Planning storage footprint | logical_GB × index_factor × modeled_copies | CAP-01.1, DAT-02.1.storedKB, DAT-02.1.initialGB, DAT-02.1.retentionDays, DAT-02.1.indexFactor, DAT-02.1.copies | 166.4544 GB | Estimated |
| CALC-13 | 30-day downtime budget | (1 − availability_pct/100) × 30 × 86400 | REL-01.1 | 2,592 s | Estimated |
| CALC-14 | Annual downtime budget | (1 − availability_pct/100) × 365 × 86400 | REL-01.1 | 31,536 s | Estimated |
| CALC-15 | Hypothetical RPO exposure | peak_TPS × RPO_seconds | CAP-01.1, CAP-04.1, REL-04.1 | 62.5 txns | Estimated |
| CALC-16 | One-year projected peak API RPS | peak_RPS × (1 + growth_pct/100) | CAP-01.1, CAP-04.1, CAP-02.1.callsPerTxn, CAP-02.1.requestFactor, CAP-05.1 | TBD | Open |
| CALC-17 | Ideal migration bulk transfer | migration_GB × 8000 / (effective_Mbps × 3600) | none | TBD | Open |
| CALC-18 | Proposed address block count | 2 ^ (32 − prefix) | INT-08.1.cidrPrefix | TBD | Open |
| CALC-19 | Estimated business read TPS | peak_business_TPS × read_percent / 100 | CAP-01.1, CAP-04.1, CAP-10.1 | TBD | Open |
| CALC-20 | Estimated business write TPS | peak_business_TPS × (100 − read_percent) / 100 | CAP-01.1, CAP-04.1, CAP-10.1 | TBD | Open |
<!-- /ENGINE-FRAGMENT -->

## 4.3 What the Numbers Mean

- **Capacity:** the calculations size for the busiest transaction type, the points movement (CAP-01.1); the refund requests (CAP-01.2) are carried to the SDD, as the advisory PRIMARY-ONLY-CAP-01 says (chunk 10). Peak business load (CALC-02) and peak API load (CALC-03) are small, and the headroom budget at the utilization target (CALC-04) stays small, so the seasonal tripling (CAP-04.1) is a burst to absorb, not a scale driver. The peak simultaneously active users (CAP-03.1) feed no calculation and land in the SDD's sizing (§18). One-year growth (CALC-16) reads TBD until CAP-05.1 is answered.
- **Latency:** the P99 targets CAP-07.1 and CAP-07.2 are measured at the ingress edge (CAP-08.1). Mean requests in flight (CALC-05) are well under one, so latency is set by the path through the platform and the partners (Point-of-Sale Records for the receipt lookup, INT-03.2 Open), not by queuing.
- **Availability and recovery:** REL-01.1 gives a 30-day downtime budget of CALC-13 and an annual budget of CALC-14. A zone loss recovers within REL-03.2 with at most REL-04.2 of data lost, which local HA covers. A region loss recovers within REL-03.1 with at most REL-04.1 lost; at peak, REL-04.1 exposes the transactions CALC-15 shows, which are rebuilt from payout results and point-of-sale records. One region recovery at REL-03.1 is longer than the CALC-13 budget and the REFUNDS/NFR-02 monthly limit of 2 hours: rule SLO-15@region flags it (chunk 09 § 9.3), and risk R-01 (chunk 10) holds it.
- **Data growth and bandwidth:** new data per day (CALC-10) over the retention horizon of DAT-02.1 gives the retained logical data CALC-11 and, with the index factor and copies, the planning footprint CALC-12. Peak boundary traffic (CALC-08) and daily payload transfer (CALC-09) are small; neither drives the network shape. Read and write load (CALC-19, CALC-20) read TBD until CAP-10.1 is answered.

<!-- MASTER: refunds-platform-pre-sdd-master.md | PREV: 03h-register-economics.md | NEXT: 05-target-shape.md -->

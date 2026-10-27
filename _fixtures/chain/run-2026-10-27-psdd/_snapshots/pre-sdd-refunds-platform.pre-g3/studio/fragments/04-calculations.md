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

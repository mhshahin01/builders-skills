### CAP-01

**Transactions by type: normal and peak TPS, and define what a transaction counts**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| CAP-01.1 | Points movement (earned on a branch purchase, or taken back after a refund) | 2,000 | transactions/day | TBD | TBD | forecast | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T18:30:32.144Z) | Fixture: Product Owner stand-in (test-run policy) | B+E | TBD |
| CAP-01.2 | Refund request | 40 | transactions/day | TBD | TBD | forecast | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T18:30:52.127Z) | Fixture: Product Owner stand-in (test-run policy) | B+E | TBD |

### CAP-02

**API request rate (RPS), reads/writes, retries, fan-out, requests per business transaction**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| CAP-02.1 | TBD | 0.2292 | req/s | TBD | TBD | forecast | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T18:38:17.432Z) | Derived: CALC-03 from CAP-01, CAP-04, CAP-02 | B+E | TBD |

| Entry | Factor | Value | Unit | Status | Source |
|---|---|---|---|---|---|
| CAP-02.1 | callsPerTxn | 3 | calls/txn | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T18:38:17.432Z) | Default: policy appendix v1 |
| CAP-02.1 | requestFactor | 1.1 | × | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T18:38:17.432Z) | Default: policy appendix v1 |

### CAP-03

**DAU/MAU, peak simultaneously active users, sessions and session duration**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| CAP-03.1 | TBD | 300 peak simultaneously active users (customers, members and branch managers) | TBD | TBD | TBD | forecast | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T18:30:52.127Z) | Fixture: Product Owner stand-in (test-run policy) | B+E | TBD |

### CAP-04

**Hourly/daily/weekly peaks, seasonality, campaign and burst size/duration**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| CAP-04.1 | TBD | 3 | × | 3 weeks of seasonal sales | TBD | forecast | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T18:30:52.127Z) | BRD: REFUNDS/NFR-03 | B+E | TBD |

| Entry | Factor | Value | Unit | Status | Source |
|---|---|---|---|---|---|
| CAP-04.1 | utilization | 0.65 | ratio | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T18:38:17.432Z) | Default: policy appendix v1 |

### CAP-05

**Forecasted growth by period and confidence, major future feature/product launches**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| CAP-05.1 | TBD | TBD | %/yr | TBD | TBD | forecast | Open | TBD | B (Refunds and Loyalty Product Owner) | 2026-11-30 |

### CAP-06

**Payload/request/response sizes, file/object sizes, compression assumptions**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| CAP-06.1 | TBD | Requests about 4 KB and responses about 16 KB; receipts are looked up, not uploaded | TBD | TBD | TBD | forecast | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T18:38:16.572Z) | Fixture: Product Owner stand-in (test-run policy) | B+E | TBD |

| Entry | Factor | Value | Unit | Status | Source |
|---|---|---|---|---|---|
| CAP-06.1 | requestKB | 4 | KB/request | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T18:38:16.572Z) | Fixture: Product Owner stand-in (test-run policy) |
| CAP-06.1 | responseKB | 16 | KB/response | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T18:38:16.572Z) | Fixture: Product Owner stand-in (test-run policy) |
| CAP-06.1 | networkOverhead | 1.2 | × | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T18:38:17.432Z) | Default: policy appendix v1 |

### CAP-07

**p50, p95, p99 (and p99.9 if justified) per critical journey; units and observation window**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| CAP-07.1 | Refunds Portal everyday actions (customer and branch manager): entering a receipt number, submitting a request, opening a request list | 2,000 | ms | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T18:30:52.945Z) | Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27) | B+E | TBD |
| CAP-07.2 | Member points balance and history screens (LOYALTY UC-01, UC-02) | 2,000 | ms | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T18:31:03.701Z) | Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27) | B+E | TBD |

| Entry | Factor | Value | Unit | Status | Source |
|---|---|---|---|---|---|
| CAP-07.1 | meanLatencyMs | 120 | ms | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T18:38:17.432Z) | Default: policy appendix v1 |
| CAP-07.2 | meanLatencyMs | TBD | ms | Open | TBD |

### CAP-08

**Define where latency is measured (client end-to-end, ingress, service, batch completion) and what counts as failure**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| CAP-08.1 | TBD | Ingress edge; successful and failed requests measured separately | TBD | TBD | TBD | assumption | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T18:38:17.432Z) | Default: project rule CAP-08 | B+E | TBD |

### CAP-09

**Max queue age, processing deadline, freshness, end-to-end batch completion and backlog recovery target**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| CAP-09.1 | TBD | Points taken back after a paid refund show in the member's balance and history within 1 hour of the refund being paid (LOYALTY/NFR-02). A payout that still fails after 1 day is reported to the branch manager (REFUNDS UC-04 E1). The branch refund report is daily (REFUNDS 09). The time for points earned on a purchase to show is open in the BRD (LOYALTY/NFR-03 proposes the end of the purchase day). | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T18:38:17.432Z) | BRD: LOYALTY/NFR-02; REFUNDS 06b; REFUNDS 09 | B+E | TBD |

### CAP-10

**Read/write mix, hot keys, expensive operations, query/report schedules**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| CAP-10.1 | TBD | TBD | % | TBD | TBD | forecast | Open | TBD | B+E (Refunds and Loyalty Product Owner) | 2026-11-30 |

| Entry | Factor | Value | Unit | Status | Source |
|---|---|---|---|---|---|
| CAP-10.1 | queryShape | TBD | TBD | Open | TBD |

### CAP-11

**Expected request failures/timeouts/retry behavior at dependencies and load-shedding tolerance**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| CAP-11.1 | TBD | When Point-of-Sale Records cannot be reached, the customer is told receipts cannot be checked now and is asked to try again later (REFUNDS UC-01 E5). A refused payout is tried again while the request stays Approved; the customer is told the payout is delayed and the branch manager is told after 1 day (REFUNDS UC-04 E1; how long the retries go on is open). A message that does not reach the customer never stops or changes a refund request (REFUNDS 03). A paid refund the Refunds Portal reports more than once takes points back once (LOYALTY UC-02 BR-3). | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T18:38:17.432Z) | BRD: REFUNDS 06a; REFUNDS 06b; REFUNDS 03; LOYALTY 06a | B+E | TBD |

### CAP-12

**Resource-intensive AI/ML/media jobs if in scope: model size, token/compute demand, jobs and deadlines**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| CAP-12.1 | TBD | N/A: No AI, ML or media jobs are in scope of either BRD. | TBD | TBD | TBD | forecast | N/A | Fixture: Product Owner stand-in (test-run policy) | B+E | TBD |

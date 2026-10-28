### CAP-01

**Transactions by type: normal and peak TPS, and define what a transaction counts**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| CAP-01.1 | Points movement (earned on a branch purchase, or taken back after a refund) | 2000 | transactions/day | TBD | TBD | forecast | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T16:35:16.514Z) | Fixture: Product Owner stand-in (test-run policy) | B+E | TBD |
| CAP-01.2 | Refund request | 40 | transactions/day | TBD | TBD | forecast | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T16:35:16.514Z) | Fixture: Product Owner stand-in (test-run policy) | B+E | TBD |

### CAP-02

**API request rate (RPS), reads/writes, retries, fan-out, requests per business transaction**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| CAP-02.1 | TBD | 0.22916666666666669 | req/s | TBD | TBD | forecast | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:40:33.180Z) | Derived: CALC-03 from CAP-01, CAP-04, CAP-02 | B+E | TBD |

| Entry | Factor | Value | Unit | Status | Source |
|---|---|---|---|---|---|
| CAP-02.1 | callsPerTxn | 3 | calls/txn | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:40:33.180Z) | Default: policy appendix v1 |
| CAP-02.1 | requestFactor | 1.1 | × | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:40:33.180Z) | Default: policy appendix v1 |

### CAP-03

**DAU/MAU, peak simultaneously active users, sessions and session duration**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| CAP-03.1 | TBD | 300 peak simultaneously active users (customers, members and branch managers) | TBD | TBD | TBD | forecast | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T16:35:17.550Z) | Fixture: Product Owner stand-in (test-run policy) | B+E | TBD |

### CAP-04

**Hourly/daily/weekly peaks, seasonality, campaign and burst size/duration**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| CAP-04.1 | TBD | 3 | × | About 3 weeks of seasonal sales | TBD | forecast | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T16:35:17.550Z) | BRD: REFUNDS/NFR-03 | B+E | TBD |

| Entry | Factor | Value | Unit | Status | Source |
|---|---|---|---|---|---|
| CAP-04.1 | utilization | 0.65 | ratio | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:40:33.180Z) | Default: policy appendix v1 |

### CAP-05

**Forecasted growth by period and confidence, major future feature/product launches**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| CAP-05.1 | TBD | TBD | %/yr | TBD | TBD | forecast | Open | TBD | B (Refunds and Loyalty Product Owner) | 2026-11-30 |

### CAP-06

**Payload/request/response sizes, file/object sizes, compression assumptions**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| CAP-06.1 | TBD | Requests about 4 KB and responses about 16 KB; receipts are looked up, not uploaded | TBD | TBD | TBD | forecast | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T16:40:31.980Z) | Fixture: Product Owner stand-in (test-run policy) | B+E | TBD |

| Entry | Factor | Value | Unit | Status | Source |
|---|---|---|---|---|---|
| CAP-06.1 | requestKB | 4 | KB/request | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T16:40:31.980Z) | Fixture: Product Owner stand-in (test-run policy) |
| CAP-06.1 | responseKB | 16 | KB/response | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T16:40:31.980Z) | Fixture: Product Owner stand-in (test-run policy) |
| CAP-06.1 | networkOverhead | 1.2 | × | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:40:33.180Z) | Default: policy appendix v1 |

### CAP-07

**p50, p95, p99 (and p99.9 if justified) per critical journey; units and observation window**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| CAP-07.1 | Everyday portal actions: enter a receipt number, submit a request, open a request list (REFUNDS/NFR-05) | 2000 | ms | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:35:18.594Z) | Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27) | B+E | TBD |
| CAP-07.2 | Open the points balance and the points history (LOYALTY/UC-01, UC-02) | 2000 | ms | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:35:18.594Z) | Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27) | B+E | TBD |

| Entry | Factor | Value | Unit | Status | Source |
|---|---|---|---|---|---|
| CAP-07.1 | meanLatencyMs | 120 | ms | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:40:33.180Z) | Default: policy appendix v1 |
| CAP-07.2 | meanLatencyMs | TBD | ms | Open | TBD |

### CAP-08

**Define where latency is measured (client end-to-end, ingress, service, batch completion) and what counts as failure**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| CAP-08.1 | TBD | Ingress edge; successful and failed requests measured separately | TBD | TBD | TBD | assumption | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:40:33.180Z) | Default: project rule CAP-08 | B+E | TBD |

### CAP-09

**Max queue age, processing deadline, freshness, end-to-end batch completion and backlog recovery target**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| CAP-09.1 | TBD | Points taken back after a paid refund show within 1 hour of the refund being paid; a payout that still fails after one day is reported to the branch manager; the branch refund report is daily. The deadline for points earned on a purchase is not stated. | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:40:33.180Z) | BRD: LOYALTY/NFR-02 | B+E | TBD |

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
| CAP-11.1 | TBD | A refused or sent-back payout stays Approved and is tried again; the customer is told it is delayed, and the branch manager is told after one day. When Point-of-Sale Records cannot be reached, the customer is asked to try again later. A message that does not reach the customer never stops a request. Points or history that cannot be shown ask the member to try again later. How long a failed payout is tried again is not stated. | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:40:33.180Z) | BRD: REFUNDS/UC-04 | B+E | TBD |

### CAP-12

**Resource-intensive AI/ML/media jobs if in scope: model size, token/compute demand, jobs and deadlines**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| CAP-12.1 | TBD | N/A: No AI, ML or media jobs are in scope of either BRD. | TBD | TBD | TBD | forecast | N/A | Fixture: Product Owner stand-in (test-run policy) | B+E | TBD |

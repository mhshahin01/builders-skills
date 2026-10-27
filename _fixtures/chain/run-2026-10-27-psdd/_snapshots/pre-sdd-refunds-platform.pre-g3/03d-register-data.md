<!--
CHUNK: 03d
TITLE: Requirement Register - Data
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: 00, 01, 02
PART OF: Pre-SDD - Refunds Platform
-->

# 3. Requirement Register

## 3.4 Data (DAT-01 to DAT-09)

> How to read the entries: [03a § How to Read the Register](./03a-register-business.md#how-to-read-the-register).

<!-- ENGINE-FRAGMENT: 03d-register-data.md -->
### DAT-01

**Business entities, system of record, ownership and data contracts**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| DAT-01.1 | Refund requests, decisions and payouts | Refund request with its lifecycle (Submitted, Approved, Rejected, Paid, Cancelled), the decision record of every status change, and the payout to the original card; the Refunds Portal records them. | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:40:28.127Z) | BRD: REFUNDS 03 | D+B | TBD |
| DAT-01.2 | Points ledger | Points balance and points movements (earned, taken back) for each member, with the purchase and refund details behind each movement; the balance is the sum of the movements; Loyalty Points keeps them. | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:40:28.127Z) | BRD: LOYALTY 03 | D+B | TBD |

| Entry | Factor | Value | Unit | Status | Source |
|---|---|---|---|---|---|
| DAT-01.1 | storeKind | relational | TBD | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:40:28.127Z) | BRD: REFUNDS 12 (TI-02) |
| DAT-01.2 | storeKind | relational | TBD | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T16:40:27.062Z) | Fixture: Product Owner stand-in (test-run policy) |

### DAT-02

**Starting volume; records/day, GB/day, object size, peak writes and retention horizon**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| DAT-02.1 | TBD | 0.016 | GB/day | TBD | TBD | forecast | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T16:36:02.171Z) | Derived: CALC-10 from CAP-01, DAT-02 | D+B | TBD |

| Entry | Factor | Value | Unit | Status | Source |
|---|---|---|---|---|---|
| DAT-02.1 | storedKB | 8 | KB/txn | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T16:36:01.249Z) | Fixture: Product Owner stand-in (test-run policy) |
| DAT-02.1 | initialGB | 1 | GB | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T16:36:01.249Z) | Fixture: Product Owner stand-in (test-run policy) |
| DAT-02.1 | retentionDays | 3653 | days | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T16:36:01.249Z) | Fixture: Product Owner stand-in (test-run policy) |
| DAT-02.1 | indexFactor | 1.4 | × | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:40:28.127Z) | Default: policy appendix v1 |
| DAT-02.1 | copies | 2 | × | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:40:28.127Z) | Default: policy appendix v1 |

### DAT-03

**Sensitivity classification: PII, financial, confidential, secrets, public**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| DAT-03.1 | TBD | sensitive | TBD | TBD | TBD | hard | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:40:28.127Z) | BRD: REFUNDS/NFR-04 | D+Sec | TBD |

### DAT-04

**Residency, allowed processing/storage/backup locations and cross-border restrictions**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| DAT-04.1 | TBD | yes | TBD | TBD | TBD | hard | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T16:40:27.062Z) | Fixture: Product Owner stand-in (test-run policy) | D+Legal | TBD |

| Entry | Factor | Value | Unit | Status | Source |
|---|---|---|---|---|---|
| DAT-04.1 | primaryLocation | Within the European Union | TBD | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T16:40:27.062Z) | Fixture: Product Owner stand-in (test-run policy) |
| DAT-04.1 | recoveryLocation | Within the European Union, in a second region | TBD | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T16:40:27.062Z) | Fixture: Product Owner stand-in (test-run policy) |

### DAT-05

**Consistency, freshness, correctness, ordering and atomicity by operation**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| DAT-05.1 | Refund requests, decisions and payouts | strong | TBD | TBD | TBD | target | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T16:40:27.062Z) | Fixture: Product Owner stand-in (test-run policy) | B+D | TBD |
| DAT-05.2 | Points ledger | strong | TBD | TBD | TBD | target | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T16:40:27.062Z) | Fixture: Product Owner stand-in (test-run policy) | B+D | TBD |

| Entry | Factor | Value | Unit | Status | Source |
|---|---|---|---|---|---|
| DAT-05.1 | transactionNeed | yes | TBD | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T16:40:27.062Z) | Fixture: Product Owner stand-in (test-run policy) |
| DAT-05.2 | transactionNeed | TBD | TBD | Open | TBD |

### DAT-06

**Retention, records hold, archive, deletion, portability and right-to-erasure requirements**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| DAT-06.1 | TBD | Refund requests, decisions and payout results are kept for 10 years for tax records; customer contact details are deleted 90 days after a request ends; a member's points history is kept while the membership lasts and deleted within 30 days after it ends. | TBD | TBD | TBD | hard | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T16:40:27.062Z) | Fixture: Product Owner stand-in (test-run policy) | D | TBD |

### DAT-07

**Multi-tenancy model, tenant isolation level, noisy-neighbor tolerance, tenants and growth**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| DAT-07.1 | TBD | TBD | TBD | TBD | TBD | target | Open | TBD | B+D (Refunds and Loyalty Product Owner) | 2026-11-30 |

### DAT-08

**Reporting, analytics, batch exports, reconciliation frequency and data latency**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| DAT-08.1 | TBD | A daily branch refund report for each branch manager: requests per status, amounts paid, average time from Submitted to decision and to Paid. A monthly check that no payout is missing or paid twice (owner not stated). Loyalty Points has no reporting in this release. | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:40:28.127Z) | BRD: REFUNDS 09 | B+D | TBD |

### DAT-09

**Restore granularity (tenant/table/whole system), point-in-time needs and recovery verification**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| DAT-09.1 | TBD | TBD | TBD | TBD | TBD | target | Open | TBD | D+Ops (Data Owner, Retail Finance) | 2026-11-30 |
<!-- /ENGINE-FRAGMENT -->

<!-- MASTER: refunds-platform-pre-sdd-master.md | PREV: 03c-register-reliability.md | NEXT: 03e-register-security.md -->

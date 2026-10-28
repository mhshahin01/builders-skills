<!--
CHUNK: 03d
TITLE: Requirement Register - Data
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: 00, 01, 02
PART OF: Pre-SDD - [Project Name]
-->

# 3. Requirement Register

## 3.4 Data (DAT-01 to DAT-09)

> How to read the entries: [03a § How to Read the Register](./03a-register-business.md#how-to-read-the-register).

<!-- The engine renders this register group from the project state (`cli.mjs compute`, fragment `03d-register-data.md`). Paste the fragment unchanged between the markers below, replacing the placeholder rows; never edit it. A wrong value is fixed in the project state through `derive --apply`, then recomputed. The placeholders show the shape the fragment gives: one `### <ROW-ID>` heading per row, in ID order, its bold title, and its entries table. -->

<!-- ENGINE-FRAGMENT: 03d-register-data.md -->
### DAT-01

**Business entities, system of record, ownership and data contracts**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| DAT-01.1 | [journey, scope, dataset, workload or system; blank for a single entry] | [value, or TBD] | [unit] | [window] | [Must / Should / Could] | [hard / target / forecast / assumption] | [Open / Estimated / Confirmed / N/A] | [`BRD: KEY/ID` / `Derived: CALC-NN from <items>` / `Answer: <who>, <date>` / `Default: <appendix or rule>`] | [B / E / D / Sec / Ops / Fin / Legal] | [YYYY-MM-DD] |

### DAT-02

**Starting volume; records/day, GB/day, object size, peak writes and retention horizon**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| DAT-02.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### DAT-03

**Sensitivity classification: PII, financial, confidential, secrets, public**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| DAT-03.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### DAT-04

**Residency, allowed processing/storage/backup locations and cross-border restrictions**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| DAT-04.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### DAT-05

**Consistency, freshness, correctness, ordering and atomicity by operation**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| DAT-05.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### DAT-06

**Retention, records hold, archive, deletion, portability and right-to-erasure requirements**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| DAT-06.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### DAT-07

**Multi-tenancy model, tenant isolation level, noisy-neighbor tolerance, tenants and growth**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| DAT-07.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### DAT-08

**Reporting, analytics, batch exports, reconciliation frequency and data latency**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| DAT-08.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### DAT-09

**Restore granularity (tenant/table/whole system), point-in-time needs and recovery verification**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| DAT-09.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

<!-- /ENGINE-FRAGMENT -->

<!-- MASTER: [slug]-pre-sdd-master.md | PREV: 03c-register-reliability.md | NEXT: 03e-register-security.md -->

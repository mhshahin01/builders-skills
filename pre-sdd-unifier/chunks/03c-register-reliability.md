<!--
CHUNK: 03c
TITLE: Requirement Register - Reliability
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: 00, 01, 02
PART OF: Pre-SDD - [Project Name]
-->

# 3. Requirement Register

## 3.3 Reliability (REL-01 to REL-10)

> How to read the entries: [03a § How to Read the Register](./03a-register-business.md#how-to-read-the-register).

<!-- The engine renders this register group from the project state (`cli.mjs compute`, fragment `03c-register-reliability.md`). Paste the fragment unchanged between the markers below, replacing the placeholder rows; never edit it. A wrong value is fixed in the project state through `derive --apply`, then recomputed. The placeholders show the shape the fragment gives: one `### <ROW-ID>` heading per row, in ID order, its bold title, and its entries table. -->

<!-- ENGINE-FRAGMENT: 03c-register-reliability.md -->
### REL-01

**Availability SLO per user journey; denominator, service window, and measurement period**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| REL-01.1 | [journey, scope, dataset, workload or system; blank for a single entry] | [value, or TBD] | [unit] | [window] | [Must / Should / Could] | [hard / target / forecast / assumption] | [Open / Estimated / Confirmed / N/A] | [`BRD: KEY/ID` / `Derived: CALC-NN from <items>` / `Answer: <who>, <date>` / `Default: <appendix or rule>`] | [B / E / D / Sec / Ops / Fin / Legal] | [YYYY-MM-DD] |

### REL-02

**SLA to customers vs internal SLO; what failures/exclusions count; penalties**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| REL-02.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### REL-03

**RTO per service/journey and disaster scenario: acceptable elapsed time to restored usable service**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| REL-03.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### REL-04

**RPO per dataset/transaction and disaster scenario: acceptable age of last recoverable data point**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| REL-04.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### REL-05

**Scope of recoverable failure: process, node, rack, site, AZ, region, ransomware, vendor failure**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| REL-05.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### REL-06

**Maximum tolerable business interruption, minimum service during degradation, manual fallback and reconciliation**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| REL-06.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### REL-07

**Recovery sequence and dependencies: authentication, payments, ledger, reporting, etc.**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| REL-07.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### REL-08

**Approved planned downtime, maintenance restrictions, deployment and upgrade windows**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| REL-08.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### REL-09

**Frequency and accepted evidence for restore, failover, failback and cyber-recovery drills**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| REL-09.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### REL-10

**Data durability and correctness expectations distinct from availability**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| REL-10.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

<!-- /ENGINE-FRAGMENT -->

<!-- MASTER: [slug]-pre-sdd-master.md | PREV: 03b-register-capacity.md | NEXT: 03d-register-data.md -->

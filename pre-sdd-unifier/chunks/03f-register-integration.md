<!--
CHUNK: 03f
TITLE: Requirement Register - Integration
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: 00, 01, 02
PART OF: Pre-SDD - [Project Name]
-->

# 3. Requirement Register

## 3.6 Integration (INT-01 to INT-09)

> How to read the entries: [03a § How to Read the Register](./03a-register-business.md#how-to-read-the-register).

<!-- The engine renders this register group from the project state (`cli.mjs compute`, fragment `03f-register-integration.md`). Paste the fragment unchanged between the markers below, replacing the placeholder rows; never edit it. A wrong value is fixed in the project state through `derive --apply`, then recomputed. The placeholders show the shape the fragment gives: one `### <ROW-ID>` heading per row, in ID order, its bold title, and its entries table. -->

<!-- ENGINE-FRAGMENT: 03f-register-integration.md -->
### INT-01

**Catalogue of upstream/downstream systems, owner, interface, business criticality**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| INT-01.1 | [journey, scope, dataset, workload or system; blank for a single entry] | [value, or TBD] | [unit] | [window] | [Must / Should / Could] | [hard / target / forecast / assumption] | [Open / Estimated / Confirmed / N/A] | [`BRD: KEY/ID` / `Derived: CALC-NN from <items>` / `Answer: <who>, <date>` / `Default: <appendix or rule>`] | [B / E / D / Sec / Ops / Fin / Legal] | [YYYY-MM-DD] |

### INT-02

**Synchronous API vs event/file/batch, update frequency, order and delivery expectations**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| INT-02.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### INT-03

**External API quotas, latencies, SLAs, maintenance and rate limits**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| INT-03.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### INT-04

**Failure behavior: reject, retry, queue, compensate, or manual handling**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| INT-04.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### INT-05

**Consistency and ordering guarantees, duplicate tolerance, maximum delay**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| INT-05.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### INT-06

**Existing public IP, allowlists, firewall change process, proxies, DNS and certificate dependencies**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| INT-06.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### INT-07

**Client geography, edge locations, remote branches, IoT and intermittent/offline operation**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| INT-07.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### INT-08

**Address ranges, DNS zones, IP overlap, IPv4/IPv6, routing and private connectivity constraints**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| INT-08.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### INT-09

**External SLA dependencies; legal or operational inability to move a peer system**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| INT-09.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

<!-- /ENGINE-FRAGMENT -->

<!-- MASTER: [slug]-pre-sdd-master.md | PREV: 03e-register-security.md | NEXT: 03g-register-operations.md -->

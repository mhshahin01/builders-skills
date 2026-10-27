<!--
CHUNK: 03h
TITLE: Requirement Register - Economics
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: 00, 01, 02
PART OF: Pre-SDD - [Project Name]
-->

# 3. Requirement Register

## 3.8 Economics (ECO-01 to ECO-06)

> How to read the entries: [03a § How to Read the Register](./03a-register-business.md#how-to-read-the-register).

<!-- The engine renders this register group from the project state (`cli.mjs compute`, fragment `03h-register-economics.md`). Paste the fragment unchanged between the markers below, replacing the placeholder rows; never edit it. A wrong value is fixed in the project state through `derive --apply`, then recomputed. The placeholders show the shape the fragment gives: one `### <ROW-ID>` heading per row, in ID order, its bold title, and its entries table. -->

<!-- ENGINE-FRAGMENT: 03h-register-economics.md -->
### ECO-01

**One-time implementation/migration budget and recurring annual/monthly run-cost envelope**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| ECO-01.1 | [journey, scope, dataset, workload or system; blank for a single entry] | [value, or TBD] | [unit] | [window] | [Must / Should / Could] | [hard / target / forecast / assumption] | [Open / Estimated / Confirmed / N/A] | [`BRD: KEY/ID` / `Derived: CALC-NN from <items>` / `Answer: <who>, <date>` / `Default: <appendix or rule>`] | [B / E / D / Sec / Ops / Fin / Legal] | [YYYY-MM-DD] |

### ECO-02

**CapEx/OpEx preferences, currency, commitment period, chargeback unit**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| ECO-02.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### ECO-03

**TCO horizon and required benefits (cost, speed, risk, flexibility)**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| ECO-03.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### ECO-04

**Delivery deadline, acceptable delivery risk, available people and vendor approval duration**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| ECO-04.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### ECO-05

**Environmental/energy footprint goals if applicable, measurement expectations**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| ECO-05.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### ECO-06

**Exit portability expectations, vendor lock-in tolerance and contract termination rights**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| ECO-06.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

<!-- /ENGINE-FRAGMENT -->

<!-- Footer: in quick mode the next chunk is 10-validation-risks-unknowns.md, the only chunk after the register that quick mode writes. -->
<!-- MASTER: [slug]-pre-sdd-master.md | PREV: 03g-register-operations.md | NEXT: 04-targets-and-calculations.md -->

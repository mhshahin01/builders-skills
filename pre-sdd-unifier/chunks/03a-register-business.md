<!--
CHUNK: 03a
TITLE: Requirement Register - Business
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: 00, 01, 02
PART OF: Pre-SDD - [Project Name]
-->

# 3. Requirement Register

## How to Read the Register

<!-- Written once, here in 03a; the other register chunks link this section. Rules: register-and-entries.md. -->

Each register row is a `### <ROW-ID>` heading, its title in bold (the Standard's wording), and its entries table. A row the Standard answers per journey, transaction type, failure scope, dataset, workload, or external system holds several entries; `.1` is the primary entry, which every row has. Downstream documents cite a row or an entry as `PSDD/<ID>` (`PSDD/REL-03.2`), linked to the row heading (`#rel-03`).

| Field | Meaning |
|---|---|
| **Entry** | The row ID, a dot, and the entry number (`REL-03.2`). |
| **Label** | The journey, transaction type, failure scope, dataset, workload, or external system the entry answers; blank for a row with one entry. |
| **Value, Unit, Window** | The value with its unit and observation window. A value the sources do not give reads `TBD`, never zero. |
| **Priority** | Must, Should, or Could. |
| **Kind** | `hard` (a guardrail), `target` (negotiable), `forecast`, or `assumption`. An `Open` hard entry blocks the gate unless a named person grants a time-bound exception (chunk 11). |
| **Status** | `Open`, `Estimated`, `Confirmed` (with who and when), or `N/A` (with a reason). |
| **Source** | `BRD: KEY/ID`, `Derived: CALC-NN from <items>`, `Answer: <who>, <UTC date>`, `Default: <appendix or rule>`, a policy label, or `Import: Studio v2.2`. |
| **Owner, Due** | The owner code (B, E, D, Sec, Ops, Fin, Legal) and, for an `Open` entry, the owner's name and the due date. |

The sizing factors that refine a row (for example the calls per transaction under CAP-02) are listed under that row with their own status and source. The header rows `HDR-01` to `HDR-10` are in chunk 01, and the migration overlay rows `OVL-01` to `OVL-12` in chunk 08.


## 3.1 Business (BUS-01 to BUS-08)

<!-- The engine renders this register group from the project state (`cli.mjs compute`, fragment `03a-register-business.md`). Paste the fragment unchanged between the markers below, replacing the placeholder rows; never edit it. A wrong value is fixed in the project state through `derive --apply`, then recomputed. The placeholders show the shape the fragment gives: one `### <ROW-ID>` heading per row, in ID order, its bold title, and its entries table. -->

<!-- ENGINE-FRAGMENT: 03a-register-business.md -->
### BUS-01

**Problem, business outcome and KPI with baseline, target, deadline**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| BUS-01.1 | [journey, scope, dataset, workload or system; blank for a single entry] | [value, or TBD] | [unit] | [window] | [Must / Should / Could] | [hard / target / forecast / assumption] | [Open / Estimated / Confirmed / N/A] | [`BRD: KEY/ID` / `Derived: CALC-NN from <items>` / `Answer: <who>, <date>` / `Default: <appendix or rule>`] | [B / E / D / Sec / Ops / Fin / Legal] | [YYYY-MM-DD] |

### BUS-02

**Critical user journeys, failure impact and journey priorities**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| BUS-02.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### BUS-03

**In/out of scope; dependencies; MVP versus later phases**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| BUS-03.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### BUS-04

**Revenue/loss or safety impact per outage and per degraded minute**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| BUS-04.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### BUS-05

**Launch date, hard deadlines, blackout/change windows**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| BUS-05.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### BUS-06

**Countries, users, contracts and accessibility/localization commitments**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| BUS-06.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### BUS-07

**Explicit prohibitions / non-goals (e.g., forbidden data movement)**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| BUS-07.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

### BUS-08

**Commercial/legal obligations to customers and penalty conditions**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| BUS-08.1 | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] | [...] |

<!-- /ENGINE-FRAGMENT -->

<!-- MASTER: [slug]-pre-sdd-master.md | PREV: 02-classification-and-path.md | NEXT: 03b-register-capacity.md -->

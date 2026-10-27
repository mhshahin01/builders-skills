<!--
CHUNK: 03a
TITLE: Requirement Register - Business
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: 00, 01, 02
PART OF: Pre-SDD - Refunds Platform
-->

# 3. Requirement Register

## How to Read the Register

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

The sizing factors that refine a row (for example the calls per transaction under CAP-02) are listed under that row with their own status and source. The header rows `HDR-01` to `HDR-10` are in chunk 01. The migration overlay does not apply (02 § 2.4), so this Pre-SDD has no `OVL` rows and no chunk 08.


## 3.1 Business (BUS-01 to BUS-08)

<!-- ENGINE-FRAGMENT: 03a-register-business.md -->
### BUS-01

**Problem, business outcome and KPI with baseline, target, deadline**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| BUS-01.1 | TBD | REFUNDS: cut the average time from request to payout from 10 days to 3 days; stop lost refund requests, so every request is recorded and visible to the customer; give branch managers one place to decide for their own branch; refund complaints fall from 18% of all complaints to customer care (target and date not stated); a share of refund requests made through the portal (target and date not stated). LOYALTY: members trust their points balance (zero upheld balance complaints a month, LOYALTY/NFR-01); members check their points without calling a branch (baseline, target and date not stated). | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:38:52.863Z) | BRD: REFUNDS 01 | B | TBD |

### BUS-02

**Critical user journeys, failure impact and journey priorities**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| BUS-02.1 | Request a refund (REFUNDS/UC-01) | The customer requests a refund for items on a branch receipt within the 30-day refund window; it needs the receipt lookup from Point-of-Sale Records (Critical); when receipts cannot be checked, the customer is asked to try again later. | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:38:52.863Z) | BRD: REFUNDS/UC-01 | B | TBD |
| BUS-02.2 | Track a refund request (REFUNDS/UC-02) | The customer sees each own refund request with its status and history (Business Objective 2). | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:38:52.863Z) | BRD: REFUNDS/UC-02 | B | TBD |
| BUS-02.3 | Cancel a refund request (REFUNDS/UC-03) | The customer cancels an own request while it is Submitted; Loyalty Points is told the outcome. | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:38:52.863Z) | BRD: REFUNDS/UC-03 | B | TBD |
| BUS-02.4 | Approve or reject a refund, and the payout (REFUNDS/UC-04) | The branch manager approves a request in full or in part, or rejects it with a reason; the payout goes to the original card through the Payment Provider (Critical); a failed payout is tried again, and the branch manager is told after one day. | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:38:52.863Z) | BRD: REFUNDS/UC-04 | B | TBD |
| BUS-02.5 | View the points balance (LOYALTY/UC-01) | The member sees the current points balance; when points cannot be shown, the member is asked to try again later and is never shown a balance of 0. | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:38:52.863Z) | BRD: LOYALTY/UC-01 | B | TBD |
| BUS-02.6 | View the points history (LOYALTY/UC-02) | The member sees every points movement, newest first, with the purchase or refund behind it. | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:38:52.863Z) | BRD: LOYALTY/UC-02 | B | TBD |
| BUS-02.7 | Earn points on a branch purchase (LOYALTY 03, no use case) | Points are earned at 1 point per 1 EUR on each branch purchase received from POS Records; a purchase that arrives late keeps its purchase date. | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:38:52.863Z) | BRD: LOYALTY 03 | B | TBD |

### BUS-03

**In/out of scope; dependencies; MVP versus later phases**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| BUS-03.1 | TBD | In scope: online refund requests for branch purchases; customers follow and cancel their own requests; branch manager decisions in full or in part; payout to the original card; email and SMS messages; refund outcomes sent to Loyalty Points; a daily branch refund report (REFUNDS 04). Earning points on branch purchases; points balance and history; taking points back after a paid refund (LOYALTY 04). Out of scope: refunds for online-shop purchases, cash refunds, a customer mobile app (REFUNDS 04); redeeming points, handling points complaints and correcting points by hand (LOYALTY 04). The Refunds Portal starts in a pilot group of branches and Loyalty Points goes live in all branches at once; neither waits for the other. | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:38:52.863Z) | BRD: REFUNDS 04 | B | TBD |

### BUS-04

**Revenue/loss or safety impact per outage and per degraded minute**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| BUS-04.1 | TBD | TBD | TBD | TBD | TBD | target | Open | TBD | B (Refunds and Loyalty Product Owner) | 2026-11-30 |

### BUS-05

**Launch date, hard deadlines, blackout/change windows**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| BUS-05.1 | TBD | TBD | TBD | TBD | TBD | target | Open | TBD | B (Refunds and Loyalty Product Owner) | 2026-11-20 |

### BUS-06

**Countries, users, contracts and accessibility/localization commitments**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| BUS-06.1 | TBD | Customers of 40 retail branches and loyalty members; customer and member screens work in a web browser on phones and computers; purchases are counted in EUR. Not stated: the countries the branches operate in, the languages, the date and number formats, and the accessibility standard. | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:38:52.863Z) | BRD: REFUNDS 02 | B | TBD |

### BUS-07

**Explicit prohibitions / non-goals (e.g., forbidden data movement)**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| BUS-07.1 | TBD | Payouts go only to the card used for the purchase. Non-goals: refunds for online-shop purchases, cash refunds and a customer mobile app; redeeming points, handling points complaints and correcting points by hand. | TBD | TBD | TBD | hard | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:38:52.863Z) | BRD: REFUNDS 02 | B | TBD |

### BUS-08

**Commercial/legal obligations to customers and penalty conditions**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| BUS-08.1 | TBD | No customer-facing contract or penalty applies; payouts follow the refund terms agreed with the payment provider (CardPay Ltd). | TBD | TBD | TBD | hard | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T16:38:51.926Z) | Fixture: Product Owner stand-in (test-run policy) | B | TBD |
<!-- /ENGINE-FRAGMENT -->

<!-- MASTER: refunds-platform-pre-sdd-master.md | PREV: 02-classification-and-path.md | NEXT: 03b-register-capacity.md -->

### REL-01

**Availability SLO per user journey; denominator, service window, and measurement period**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| REL-01.1 | Refunds Portal journeys (customers and branch managers) | 99.9 | % | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T18:31:03.701Z) | Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27) | B | TBD |
| REL-01.2 | Member points balance and history screens (LOYALTY UC-01, UC-02) | 99.9 | % | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T18:31:03.701Z) | Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27) | B | TBD |

### REL-02

**SLA to customers vs internal SLO; what failures/exclusions count; penalties**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| REL-02.1 | TBD | TBD | TBD | TBD | TBD | target | Open | TBD | B (Refunds and Loyalty Product Owner) | 2026-11-30 |

### REL-03

**RTO per service/journey and disaster scenario: acceptable elapsed time to restored usable service**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| REL-03.1 | Whole platform, region loss; scope region | 14,400 | s | TBD | TBD | target | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T18:31:04.552Z) | Fixture: Product Owner stand-in (test-run policy) | B | TBD |
| REL-03.2 | Whole platform, zone loss; scope az | 300 | s | TBD | TBD | target | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T18:31:27.332Z) | Fixture: Product Owner stand-in (test-run policy) | B | TBD |

### REL-04

**RPO per dataset/transaction and disaster scenario: acceptable age of last recoverable data point**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| REL-04.1 | All refund and points data, region loss; scope region | 900 | s | TBD | TBD | target | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T18:31:27.332Z) | Fixture: Product Owner stand-in (test-run policy) | B+D | TBD |
| REL-04.2 | All refund and points data, zone loss; scope az | 5 | s | TBD | TBD | target | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T18:31:27.332Z) | Fixture: Product Owner stand-in (test-run policy) | B+D | TBD |

### REL-05

**Scope of recoverable failure: process, node, rack, site, AZ, region, ransomware, vendor failure**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| REL-05.1 | Loss of a whole region | region | TBD | TBD | TBD | target | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T18:31:27.332Z) | Fixture: Product Owner stand-in (test-run policy) | B+Ops | TBD |
| REL-05.2 | Loss of one zone | az | TBD | TBD | TBD | target | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T18:31:47.307Z) | Fixture: Product Owner stand-in (test-run policy) | B+Ops | TBD |

### REL-06

**Maximum tolerable business interruption, minimum service during degradation, manual fallback and reconciliation**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| REL-06.1 | TBD | A message that does not reach the customer never stops or changes a refund request; the customer can always see the current status (REFUNDS 03). When Point-of-Sale Records cannot be reached, customers are asked to try again later (REFUNDS UC-01 E5). A payout result may be recorded by hand by a staff member and confirmed by a second staff member (REFUNDS 03 Decision record). When points cannot be shown, the member is asked to try again later and no balance is shown (LOYALTY UC-01 E1). The maximum tolerable interruption is not stated beyond REFUNDS/NFR-02. | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T18:38:42.127Z) | BRD: REFUNDS 03; REFUNDS 06a; LOYALTY 06a | B | TBD |

### REL-07

**Recovery sequence and dependencies: authentication, payments, ledger, reporting, etc.**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| REL-07.1 | TBD | TBD | TBD | TBD | TBD | target | Open | TBD | B+Ops (Refunds and Loyalty Product Owner) | 2026-11-30 |

### REL-08

**Approved planned downtime, maintenance restrictions, deployment and upgrade windows**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| REL-08.1 | TBD | Planned maintenance counts toward the limit of 2 hours of disruption a month (REFUNDS/NFR-02) and toward the points-screen limit, whose minutes are open (LOYALTY/NFR-04). No maintenance window is stated. | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T18:38:42.127Z) | BRD: REFUNDS/NFR-02; LOYALTY/NFR-04 | B+Ops | TBD |

### REL-09

**Frequency and accepted evidence for restore, failover, failback and cyber-recovery drills**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| REL-09.1 | TBD | TBD | TBD | TBD | TBD | target | Open | TBD | B+Ops (Refunds and Loyalty Product Owner) | 2026-11-30 |

### REL-10

**Data durability and correctness expectations distinct from availability**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| REL-10.1 | TBD | Refund money is never lost or paid twice: zero missing or duplicate payouts per month, where a payout still being tried again or waiting for a card dispute at month end counts as delayed or waiting, not missing (REFUNDS/NFR-01). The decision record of every status change cannot be changed (REFUNDS 03). Every points movement follows the points rules, with zero upheld balance complaints a month (LOYALTY/NFR-01); each paid refund takes points back once, and the points taken back for a purchase never exceed the points it earned (LOYALTY UC-02 BR-3, BR-6). | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T18:38:42.127Z) | BRD: REFUNDS/NFR-01; LOYALTY/NFR-01 | B+E | TBD |

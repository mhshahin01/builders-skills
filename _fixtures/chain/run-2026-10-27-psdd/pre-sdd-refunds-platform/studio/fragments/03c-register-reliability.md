### REL-01

**Availability SLO per user journey; denominator, service window, and measurement period**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| REL-01.1 | Refund journeys for customers and branch managers (REFUNDS/UC-01 to UC-04) | 99.9 | % | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:35:18.594Z) | Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27) | B | TBD |
| REL-01.2 | Points balance and points history screens (LOYALTY/UC-01, UC-02) | 99.9 | % | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:35:18.594Z) | Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27) | B | TBD |

### REL-02

**SLA to customers vs internal SLO; what failures/exclusions count; penalties**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| REL-02.1 | TBD | TBD | TBD | TBD | TBD | target | Open | TBD | B (Refunds and Loyalty Product Owner) | 2026-11-30 |

### REL-03

**RTO per service/journey and disaster scenario: acceptable elapsed time to restored usable service**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| REL-03.1 | Whole platform, region loss; scope region | 14400 | s | TBD | TBD | target | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T16:36:01.249Z) | Fixture: Product Owner stand-in (test-run policy) | B | TBD |
| REL-03.2 | Whole platform, zone loss; scope az | 300 | s | TBD | TBD | target | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T16:36:01.249Z) | Fixture: Product Owner stand-in (test-run policy) | B | TBD |

### REL-04

**RPO per dataset/transaction and disaster scenario: acceptable age of last recoverable data point**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| REL-04.1 | All refund and points data, region loss; scope region | 900 | s | TBD | TBD | target | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T16:36:01.249Z) | Fixture: Product Owner stand-in (test-run policy) | B+D | TBD |
| REL-04.2 | All refund and points data, zone loss; scope az | 5 | s | TBD | TBD | target | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T16:36:01.249Z) | Fixture: Product Owner stand-in (test-run policy) | B+D | TBD |

### REL-05

**Scope of recoverable failure: process, node, rack, site, AZ, region, ransomware, vendor failure**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| REL-05.1 | Loss of a whole region | region | TBD | TBD | TBD | target | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T16:36:01.249Z) | Fixture: Product Owner stand-in (test-run policy) | B+Ops | TBD |
| REL-05.2 | Loss of one zone | az | TBD | TBD | TBD | target | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T16:36:01.249Z) | Fixture: Product Owner stand-in (test-run policy) | B+Ops | TBD |

### REL-06

**Maximum tolerable business interruption, minimum service during degradation, manual fallback and reconciliation**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| REL-06.1 | TBD | A staff member records a payout result by hand and a second staff member confirms it; a monthly check makes sure no payout is missing or paid twice (its owner is not stated); a customer whose purchase cannot be refunded online can visit the branch. | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:40:35.695Z) | BRD: REFUNDS 03 | B | TBD |

### REL-07

**Recovery sequence and dependencies: authentication, payments, ledger, reporting, etc.**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| REL-07.1 | TBD | TBD | TBD | TBD | TBD | target | Open | TBD | B+Ops (Refunds and Loyalty Product Owner) | 2026-11-30 |

### REL-08

**Approved planned downtime, maintenance restrictions, deployment and upgrade windows**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| REL-08.1 | TBD | Planned maintenance is allowed and counts toward the 2 hours of disruption a month of the refund journeys; for the points screens it counts toward a monthly limit that is not stated. | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:40:35.695Z) | BRD: REFUNDS/NFR-02 | B+Ops | TBD |

### REL-09

**Frequency and accepted evidence for restore, failover, failback and cyber-recovery drills**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| REL-09.1 | TBD | TBD | TBD | TBD | TBD | target | Open | TBD | B+Ops (Refunds and Loyalty Product Owner) | 2026-11-30 |

### REL-10

**Data durability and correctness expectations distinct from availability**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| REL-10.1 | TBD | Refund money is never lost or paid twice: zero missing or duplicate payouts a month. The decision record of every status change cannot be changed. Every points movement follows the points rules; each paid refund takes points back once, even when reported more than once; the balance always equals the sum of the movements. | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:40:35.695Z) | BRD: REFUNDS/NFR-01 | B+E | TBD |

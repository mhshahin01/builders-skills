<!--
CHUNK: 03g
TITLE: Requirement Register - Operations
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: 00, 01, 02
PART OF: Pre-SDD - Refunds Platform
-->

# 3. Requirement Register

## 3.7 Operations (OPS-01 to OPS-08)

> How to read the entries: [03a § How to Read the Register](./03a-register-business.md#how-to-read-the-register).

<!-- ENGINE-FRAGMENT: 03g-register-operations.md -->
### OPS-01

**Support hours, user hours, incident severities, response and escalation commitments**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| OPS-01.1 | TBD | Users can use the Refunds Portal at any time (REFUNDS/NFR-02) and open their points at any time of day, every day (LOYALTY/NFR-04). Support hours, incident severities, response and escalation commitments are not stated. | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T18:38:43.894Z) | BRD: REFUNDS/NFR-02; LOYALTY/NFR-04 | B+Ops | TBD |

### OPS-02

**Team skills, support model, managed-service restrictions and ownership boundaries**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| OPS-02.1 | TBD | TBD | TBD | TBD | TBD | target | Open | TBD | Ops+E (Operations Lead) | 2026-11-30 |

### OPS-03

**Release frequency, rollback tolerance and change-freeze windows**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| OPS-03.1 | TBD | TBD | TBD | TBD | TBD | target | Open | TBD | B+Ops (Refunds and Loyalty Product Owner) | 2026-11-30 |

### OPS-04

**Environments needed: dev, test, perf, stage, prod, DR; isolation and test data rules**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| OPS-04.1 | TBD | dev, test, stage, prod, dr | TBD | TBD | TBD | assumption | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T18:38:43.894Z) | Default: project rule OPS-04 | Ops | TBD |

### OPS-05

**Logging/tracing/metric retention, event cardinality, alerting and forensic search**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| OPS-05.1 | TBD | TBD | TBD | TBD | TBD | target | Open | TBD | Ops (Operations Lead) | 2026-11-30 |

### OPS-06

**Business continuity runbooks, escalation matrix and authority to invoke failover**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| OPS-06.1 | TBD | TBD | TBD | TBD | TBD | target | Open | TBD | B+Ops (Refunds and Loyalty Product Owner) | 2026-11-30 |

### OPS-07

**Changeover, reversibility, customer communication and decommissioning expectations**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| OPS-07.1 | TBD | The Refunds Portal starts in a pilot group of branches and the other branches start after the pilot; until a branch starts, it handles refunds as today (REFUNDS 04; the pilot group, its length and the rollout order are open). Loyalty Points goes live in all branches at once after BAT sign-off (LOYALTY 04). Customers are told about their requests by email and SMS (REFUNDS 03). What happens to paper requests open on the go-live day is open (REFUNDS 04). | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T18:38:43.894Z) | BRD: REFUNDS 04; LOYALTY 04 | B+Ops | TBD |

### OPS-08

**Testing scope: load, soak, chaos/fault injection, DR, security, compliance, accessibility**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| OPS-08.1 | TBD | Business acceptance testing (BAT): the business checks the product and signs it off before go-live (REFUNDS 02 Glossary, LOYALTY 04). Load, soak, DR, security and accessibility test scopes are not stated. | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T18:38:43.894Z) | BRD: REFUNDS 02; LOYALTY 04 | B+Ops | TBD |
<!-- /ENGINE-FRAGMENT -->

<!-- MASTER: refunds-platform-pre-sdd-master.md | PREV: 03f-register-integration.md | NEXT: 03h-register-economics.md -->

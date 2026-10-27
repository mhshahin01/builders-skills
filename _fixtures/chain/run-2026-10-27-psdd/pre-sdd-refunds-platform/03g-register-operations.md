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
| OPS-01.1 | TBD | Users reach the refund journeys and the points screens at any time of day, every day. Support hours, incident severities and escalation are not stated. | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:40:37.794Z) | BRD: REFUNDS/NFR-02 | B+Ops | TBD |

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
| OPS-04.1 | TBD | dev, test, stage, prod, dr | TBD | TBD | TBD | assumption | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:40:37.794Z) | Default: project rule OPS-04 | Ops | TBD |

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
| OPS-07.1 | TBD | The Refunds Portal starts in a pilot group of branches, then the other branches; until a branch starts, it handles refunds as today. The pilot branches, its length, the order of the other branches and the handling of open paper requests are not stated. Loyalty Points goes live in all branches at once after BAT sign-off. | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:40:37.794Z) | BRD: REFUNDS 04 | B+Ops | TBD |

### OPS-08

**Testing scope: load, soak, chaos/fault injection, DR, security, compliance, accessibility**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| OPS-08.1 | TBD | Business acceptance testing before go-live; a seasonal load of 3 times the normal number of requests for 3 weeks while meeting REFUNDS/NFR-05. The accessibility standard is not stated. | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:40:37.794Z) | BRD: REFUNDS/NFR-03 | B+Ops | TBD |
<!-- /ENGINE-FRAGMENT -->

<!-- MASTER: refunds-platform-pre-sdd-master.md | PREV: 03f-register-integration.md | NEXT: 03h-register-economics.md -->

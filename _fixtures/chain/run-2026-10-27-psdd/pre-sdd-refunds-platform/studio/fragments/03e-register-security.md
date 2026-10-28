### SEC-01

**Laws, contracts, certifications and organization policies actually applicable; control mappings**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| SEC-01.1 | TBD | TBD | TBD | TBD | TBD | hard | Open | TBD | Sec+D (Legal Counsel) | 2026-12-15 |

### SEC-02

**Actors, partner identities, workforce, machine principals, customer identity sources**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| SEC-02.1 | TBD | Customers prove who they are before they see receipt items or their requests (method not stated); branch managers act only for their own branch; staff members record and confirm a payout result by hand; members sign in (the sign-in party is not stated). Partners: Payment Provider, Notification Partner, Point-of-Sale Records. | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:40:26.019Z) | BRD: REFUNDS 03 | B+Sec | TBD |

### SEC-03

**Threat/risk classification, acceptable residual risk and adversary concerns**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| SEC-03.1 | TBD | TBD | TBD | TBD | TBD | target | Open | TBD | Sec (Security Lead) | 2026-11-30 |

### SEC-04

**Encryption at rest/in transit, BYOK/HYOK, key custody, rotation, certificate requirements**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| SEC-04.1 | TBD | Customer personal data, payout records and points data are encrypted at rest and in transit; the business holds the keys and rotates them at least once a year. | TBD | TBD | TBD | hard | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T16:40:25.038Z) | Fixture: Product Owner stand-in (test-run policy) | Sec+D | TBD |

### SEC-05

**Audit events, non-repudiation, investigation and evidence retention**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| SEC-05.1 | TBD | Every refund status change is recorded with who made it, the date and time, the amount and the reason; a payout result recorded by hand needs a second staff member to confirm it; nobody can change the record, and it is deleted only when the retention period ends. | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:40:26.019Z) | BRD: REFUNDS 03 | D+Sec | TBD |

### SEC-06

**Vulnerability, patch, pen-test, SBOM/supply-chain and incident reporting obligations**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| SEC-06.1 | TBD | TBD | TBD | TBD | TBD | target | Open | TBD | Sec+Ops (Security Lead) | 2026-11-30 |

### SEC-07

**Required separation of duties, privileged access, break glass and tenant/customer administration**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| SEC-07.1 | TBD | A branch manager decides only for the own branch and never on a request they submitted as a customer; a payout result recorded by hand is confirmed by a second staff member. A second approver above an amount is not stated. | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:40:26.019Z) | BRD: REFUNDS/UC-04 | Sec | TBD |

### SEC-08

**Third-party processor/subprocessor and vendor risk restrictions**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| SEC-08.1 | TBD | TBD | TBD | TBD | TBD | target | Open | TBD | B+Sec (Refunds and Loyalty Product Owner) | 2026-11-30 |

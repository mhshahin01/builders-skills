<!--
CHUNK: 03e
TITLE: Requirement Register - Security
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: 00, 01, 02
PART OF: Pre-SDD - Refunds Platform
-->

# 3. Requirement Register

## 3.5 Security (SEC-01 to SEC-08)

> How to read the entries: [03a § How to Read the Register](./03a-register-business.md#how-to-read-the-register).

<!-- ENGINE-FRAGMENT: 03e-register-security.md -->
### SEC-01

**Laws, contracts, certifications and organization policies actually applicable; control mappings**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| SEC-01.1 | TBD | TBD | TBD | TBD | TBD | hard | Open | TBD | Sec+D (Legal Counsel) | 2026-12-15 |

### SEC-02

**Actors, partner identities, workforce, machine principals, customer identity sources**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| SEC-02.1 | TBD | Customers act only on their own refund requests after proving who they are (method open, REFUNDS 03 Customer identity); branch managers act only on their own branch's requests (REFUNDS 03, 07); staff who record a payout result by hand and the second staff member who confirms it (REFUNDS 03, NFR-04); members see only their own points after signing in (sign-in party open, LOYALTY UC-01; LOYALTY/NFR-05). External parties: CardPay Ltd, MsgHub, Point-of-Sale Records (REFUNDS 08, LOYALTY 08). | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T18:37:24.529Z) | BRD: REFUNDS/NFR-04; LOYALTY/NFR-05 | B+Sec | TBD |

### SEC-03

**Threat/risk classification, acceptable residual risk and adversary concerns**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| SEC-03.1 | TBD | TBD | TBD | TBD | TBD | target | Open | TBD | Sec (Security Lead) | 2026-11-30 |

### SEC-04

**Encryption at rest/in transit, BYOK/HYOK, key custody, rotation, certificate requirements**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| SEC-04.1 | TBD | Customer personal data, payout records and points data are encrypted at rest and in transit; the business holds the keys and rotates them at least once a year. | TBD | TBD | TBD | hard | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T18:37:23.634Z) | Fixture: Product Owner stand-in (test-run policy) | Sec+D | TBD |

### SEC-05

**Audit events, non-repudiation, investigation and evidence retention**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| SEC-05.1 | TBD | Every refund status change is recorded with who made it, the date and time, the amount and the reason; a payout recorded by hand as paid keeps both staff members; nobody can change the record, and it is deleted only when the REFUNDS/NFR-06 retention period ends (REFUNDS 03 Decision record). | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T18:37:24.529Z) | BRD: REFUNDS 03 | D+Sec | TBD |

### SEC-06

**Vulnerability, patch, pen-test, SBOM/supply-chain and incident reporting obligations**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| SEC-06.1 | TBD | TBD | TBD | TBD | TBD | target | Open | TBD | Sec+Ops (Security Lead) | 2026-11-30 |

### SEC-07

**Required separation of duties, privileged access, break glass and tenant/customer administration**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| SEC-07.1 | TBD | A branch manager cannot decide on a refund request they submitted as a customer (REFUNDS UC-04 BR-6); a payout recorded by hand as paid needs a second staff member to confirm it (REFUNDS 03). Whether a second approver is needed above an amount is open (REFUNDS UC-04 BR-7). | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T18:37:24.529Z) | BRD: REFUNDS 06b; REFUNDS 03 | Sec | TBD |

### SEC-08

**Third-party processor/subprocessor and vendor risk restrictions**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| SEC-08.1 | TBD | TBD | TBD | TBD | TBD | target | Open | TBD | B+Sec (Refunds and Loyalty Product Owner) | 2026-11-30 |
<!-- /ENGINE-FRAGMENT -->

<!-- MASTER: refunds-platform-pre-sdd-master.md | PREV: 03d-register-data.md | NEXT: 03f-register-integration.md -->

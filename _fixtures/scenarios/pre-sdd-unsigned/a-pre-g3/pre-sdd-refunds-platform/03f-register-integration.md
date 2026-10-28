<!--
CHUNK: 03f
TITLE: Requirement Register - Integration
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: 00, 01, 02
PART OF: Pre-SDD - Refunds Platform
-->

# 3. Requirement Register

## 3.6 Integration (INT-01 to INT-09)

> How to read the entries: [03a § How to Read the Register](./03a-register-business.md#how-to-read-the-register).

<!-- ENGINE-FRAGMENT: 03f-register-integration.md -->
### INT-01

**Catalogue of upstream/downstream systems, owner, interface, business criticality**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| INT-01.1 | Payment Provider (CardPay Ltd) | Sends refund payouts to the customer's original card; exchanges payout requests, payout results, disputes of the original card payment and their outcome; both ways; critical; owner CardPay Ltd (REFUNDS 08). | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T18:38:03.642Z) | BRD: REFUNDS 08 | B+E | TBD |
| INT-01.2 | Point-of-Sale Records (Retail IT team) | Gives the receipt and its items for a refund request (receipt number, items, amounts, branch, purchase date, how the purchase was paid) and the member purchases that earn points (member, purchase reference, date, branch, amount); we receive; critical; owner Retail IT team (REFUNDS 08, LOYALTY 08). | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T18:38:03.642Z) | BRD: REFUNDS 08; LOYALTY 08 | B+E | TBD |
| INT-01.3 | Notification Partner (MsgHub) | Tells customers about their refund by email and SMS; we send customer contact details and message content; important; owner MsgHub (REFUNDS 08). | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T18:38:03.642Z) | BRD: REFUNDS 08 | B+E | TBD |

### INT-02

**Synchronous API vs event/file/batch, update frequency, order and delivery expectations**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| INT-02.1 | TBD | The receipt lookup answers while the customer enters a receipt number (REFUNDS UC-01 step 2). Refund outcomes (Paid, Rejected, Cancelled, back to Approved) go from the Refunds Portal to Loyalty Points when they happen, and are kept and sent when Loyalty Points starts (REFUNDS 04, 08). Branch purchases of members are known the same day (LOYALTY 02 Assumption 1). Customer messages follow each status change (REFUNDS 03). | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T18:38:03.642Z) | BRD: REFUNDS 06a; REFUNDS 04; LOYALTY 02 | B+E | TBD |

### INT-03

**External API quotas, latencies, SLAs, maintenance and rate limits**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| INT-03.1 | TBD | TBD | TBD | TBD | TBD | target | Open | TBD | B+E (CardPay Ltd) | 2026-11-30 |
| INT-03.2 | Point-of-Sale Records (Retail IT team) | TBD | TBD | TBD | TBD | target | Open | TBD | B+E (Retail IT team) | 2026-11-30 |
| INT-03.3 | Notification Partner (MsgHub) | TBD | TBD | TBD | TBD | target | Open | TBD | B+E (MsgHub) | 2026-11-30 |

### INT-04

**Failure behavior: reject, retry, queue, compensate, or manual handling**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| INT-04.1 | TBD | Point-of-Sale Records unreachable: the customer is asked to try again later and is not told the receipt is wrong (REFUNDS UC-01 E5). Payout refused or sent back: the request stays or goes back to Approved, the payout is tried again, the customer is told it is delayed and the branch manager is told after 1 day (REFUNDS UC-04 E1). Card dispute open: the payout waits for the bank's decision (REFUNDS UC-04 BR-8). A message that fails never stops a request (REFUNDS 03). Loyalty Points not started: the refund outcomes are kept and sent when it starts (REFUNDS 04). | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T18:38:03.642Z) | BRD: REFUNDS 06a; REFUNDS 06b; REFUNDS 03; REFUNDS 04 | B+E | TBD |

### INT-05

**Consistency and ordering guarantees, duplicate tolerance, maximum delay**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| INT-05.1 | TBD | Each paid refund takes points back once, even when the Refunds Portal reports it more than once (LOYALTY UC-02 BR-3). A refund paid before its purchase earned points waits up to 30 days for the purchase (LOYALTY UC-02 BR-5). Points taken back show within 1 hour of the refund being paid (LOYALTY/NFR-02). A late purchase keeps its purchase date (LOYALTY 03). | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T18:38:03.642Z) | BRD: LOYALTY 06a; LOYALTY/NFR-02; LOYALTY 03 | B+E | TBD |

### INT-06

**Existing public IP, allowlists, firewall change process, proxies, DNS and certificate dependencies**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| INT-06.1 | TBD | TBD | TBD | TBD | TBD | target | Open | TBD | E+Sec (Lead Architect, Retail IT) | 2026-11-30 |

### INT-07

**Client geography, edge locations, remote branches, IoT and intermittent/offline operation**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| INT-07.1 | TBD | Customers and members use web browsers on phones and computers (REFUNDS 11, LOYALTY 11); branch managers work in 40 branches (REFUNDS 02 Facts; the devices they use are open, REFUNDS 11). No offline operation is stated. | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T18:38:03.642Z) | BRD: REFUNDS 11; LOYALTY 11; REFUNDS 02 | B+E | TBD |

### INT-08

**Address ranges, DNS zones, IP overlap, IPv4/IPv6, routing and private connectivity constraints**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| INT-08.1 | TBD | public | TBD | TBD | TBD | target | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T18:38:02.759Z) | Fixture: Product Owner stand-in (test-run policy) | E | TBD |

| Entry | Factor | Value | Unit | Status | Source |
|---|---|---|---|---|---|
| INT-08.1 | cidrPrefix | TBD | prefix | Open | TBD |

### INT-09

**External SLA dependencies; legal or operational inability to move a peer system**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| INT-09.1 | TBD | CardPay Ltd's support for refunds to the original card is a hard dependency needed before the build of REFUNDS UC-04; Point-of-Sale Records, owned by the Retail IT team, is a hard dependency of both the receipt lookup (before the build of REFUNDS UC-01) and earning points (REFUNDS 02, LOYALTY 02 Dependencies). | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T18:38:03.642Z) | BRD: REFUNDS 02; LOYALTY 02 | B+E | TBD |
<!-- /ENGINE-FRAGMENT -->

<!-- MASTER: refunds-platform-pre-sdd-master.md | PREV: 03e-register-security.md | NEXT: 03g-register-operations.md -->

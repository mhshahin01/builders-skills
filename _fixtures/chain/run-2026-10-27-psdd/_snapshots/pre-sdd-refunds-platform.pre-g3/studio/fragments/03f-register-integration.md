### INT-01

**Catalogue of upstream/downstream systems, owner, interface, business criticality**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| INT-01.1 | Payment Provider (CardPay Ltd) | Payment Provider, CardPay Ltd: payout requests, payout results, card disputes and their outcome; both ways; Critical. | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:40:30.533Z) | BRD: REFUNDS 08 | B+E | TBD |
| INT-01.2 | Point-of-Sale Records (Retail IT team) | Point-of-Sale Records, Retail IT team: receipt, items, amounts, branch, purchase date and how the purchase was paid, for the refund lookup; member purchases for earning points; we receive; Critical. | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:40:30.533Z) | BRD: REFUNDS 08 | B+E | TBD |
| INT-01.3 | Notification Partner (MsgHub) | Notification Partner, MsgHub: customer contact details and message content for email and SMS; we send; Important. | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:40:30.533Z) | BRD: REFUNDS 08 | B+E | TBD |

### INT-02

**Synchronous API vs event/file/batch, update frequency, order and delivery expectations**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| INT-02.1 | TBD | The receipt lookup runs when the customer enters a receipt number; payout requests and results go both ways with the Payment Provider; refund outcomes go to Loyalty Points at each change to Paid, Rejected, Cancelled or back to Approved, and are kept and sent later while Loyalty Points has not started; branch purchases are known the same day. | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:40:30.533Z) | BRD: REFUNDS 08 | B+E | TBD |

### INT-03

**External API quotas, latencies, SLAs, maintenance and rate limits**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| INT-03.1 | Payment Provider (CardPay Ltd) | TBD | TBD | TBD | TBD | target | Open | TBD | B+E (CardPay Ltd) | 2026-11-30 |
| INT-03.2 | Point-of-Sale Records (Retail IT team) | TBD | TBD | TBD | TBD | target | Open | TBD | B+E (Retail IT team) | 2026-11-30 |
| INT-03.3 | Notification Partner (MsgHub) | TBD | TBD | TBD | TBD | target | Open | TBD | B+E (MsgHub) | 2026-11-30 |

### INT-04

**Failure behavior: reject, retry, queue, compensate, or manual handling**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| INT-04.1 | TBD | A refused or sent-back payout is tried again and the request stays Approved; when Point-of-Sale Records cannot be reached, the customer is asked to try again later; a failed message never stops a request; refund outcomes are kept and sent when Loyalty Points starts; a paid refund whose purchase has not earned points waits up to 30 days. | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:40:30.533Z) | BRD: REFUNDS/UC-04 | B+E | TBD |

### INT-05

**Consistency and ordering guarantees, duplicate tolerance, maximum delay**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| INT-05.1 | TBD | Each paid refund takes points back once, even when it is reported more than once; points taken back show within 1 hour of the refund being paid; a purchase that arrives late keeps its purchase date. | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:40:30.533Z) | BRD: LOYALTY/UC-02 | B+E | TBD |

### INT-06

**Existing public IP, allowlists, firewall change process, proxies, DNS and certificate dependencies**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| INT-06.1 | TBD | TBD | TBD | TBD | TBD | target | Open | TBD | E+Sec (Lead Architect, Retail IT) | 2026-11-30 |

### INT-07

**Client geography, edge locations, remote branches, IoT and intermittent/offline operation**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| INT-07.1 | TBD | Customers and members use a web browser on phones and computers; branch managers work in 40 branches; no offline operation is stated; the devices for the branch manager screens are not stated. | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T16:40:30.533Z) | BRD: REFUNDS 11 | B+E | TBD |

### INT-08

**Address ranges, DNS zones, IP overlap, IPv4/IPv6, routing and private connectivity constraints**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| INT-08.1 | TBD | public | TBD | TBD | TBD | target | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T16:40:29.350Z) | Fixture: Product Owner stand-in (test-run policy) | E | TBD |

| Entry | Factor | Value | Unit | Status | Source |
|---|---|---|---|---|---|
| INT-08.1 | cidrPrefix | TBD | prefix | Open | TBD |

### INT-09

**External SLA dependencies; legal or operational inability to move a peer system**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| INT-09.1 | TBD | TBD | TBD | TBD | TBD | target | Open | TBD | B+E (Refunds and Loyalty Product Owner) | 2026-11-30 |

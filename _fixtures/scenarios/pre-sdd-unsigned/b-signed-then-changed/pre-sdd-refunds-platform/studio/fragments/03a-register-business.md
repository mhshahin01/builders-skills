### BUS-01

**Problem, business outcome and KPI with baseline, target, deadline**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| BUS-01.1 | TBD | Refunds: replace paper records and phone approvals; cut the average time from refund request to payout from 10 days to 3 days; no refund request is lost and every request is visible to the customer; branch managers decide on their own branch's refunds in one place (REFUNDS 01 Business Objectives 1 to 3). The complaint and portal-share targets of objectives 4 and 5 are open in the BRD. Loyalty: members trust their points balance, measured as zero upheld balance complaints a month (LOYALTY 01 Objective 1, LOYALTY/NFR-01), and check their points without calling a branch (LOYALTY 01 Objective 2, targets open in the BRD). | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T18:37:11.845Z) | BRD: REFUNDS 01; LOYALTY 01 | B | TBD |

### BUS-02

**Critical user journeys, failure impact and journey priorities**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| BUS-02.1 | Customer refund journey (REFUNDS UC-01 to UC-03) | The customer proves who they are, enters a branch receipt number, picks the items and a reason, submits the refund request, follows it until the money is back on the card, and cancels it while it is Submitted. Failure impact: a lost request or a customer without status, the cause of 18% of complaints to customer care (REFUNDS 01). | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T18:37:11.845Z) | BRD: REFUNDS 05 | B | TBD |
| BUS-02.2 | Branch manager decision and payout journey (REFUNDS UC-04) | The branch manager decides on each Submitted request of their branch, oldest first: approve in full or in part, or reject with a reason; an approved refund is paid to the customer's original card through the payment provider and the request becomes Paid. Failure impact: refund money lost or paid twice (REFUNDS/NFR-01). | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T18:37:11.845Z) | BRD: REFUNDS 06b | B | TBD |
| BUS-02.3 | Member points journey (LOYALTY UC-01, UC-02) | The member signs in, sees the points balance with the date of the last movement, and opens the history of points movements and the purchase or refund behind each. Failure impact: members call branches about points and lose trust in the balance (LOYALTY 01). | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T18:37:11.845Z) | BRD: LOYALTY 05 | B | TBD |
| BUS-02.4 | Points earned on a branch purchase (LOYALTY 03 Earning points; no use case) | A member earns 1 point per 1 EUR spent on a branch purchase, from the purchases received from POS Records; points are taken back when the Refunds Portal reports a refund as paid. The member takes no action. | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T18:37:11.845Z) | BRD: LOYALTY 03 | B | TBD |

### BUS-03

**In/out of scope; dependencies; MVP versus later phases**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| BUS-03.1 | TBD | In scope: online refund requests for branch purchases; customers follow and cancel their own requests; branch manager decisions in full or in part; payout to the original card; customer messages by email and SMS; refund outcomes sent to Loyalty Points; a daily refund report per branch manager (REFUNDS 04). Earning points on branch purchases; points balance and history for members; taking points back when a refund is paid (LOYALTY 04). Out of scope: online-shop refunds, cash refunds, a customer mobile app (REFUNDS 04); redeeming points, handling points complaints and correcting points by hand (LOYALTY 04). The Refunds Portal starts in a pilot group of branches; each part goes live on its own date (REFUNDS 04, LOYALTY 04). | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T18:37:11.845Z) | BRD: REFUNDS 04; LOYALTY 04 | B | TBD |

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
| BUS-06.1 | TBD | 40 branches (REFUNDS 02 Facts). Customers and branch managers use the Refunds Portal; the customer screens work in a web browser on phones and computers (REFUNDS 11). Members use the points screens on phones and computers (LOYALTY 11). Points are counted in EUR (LOYALTY 02). The countries, languages, currency of the Refunds Portal and the accessibility level are open in the BRDs (REFUNDS/NFR-07, REFUNDS 11, LOYALTY 11). | TBD | TBD | TBD | target | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T18:37:11.845Z) | BRD: REFUNDS 02; REFUNDS 11; LOYALTY 11 | B | TBD |

### BUS-07

**Explicit prohibitions / non-goals (e.g., forbidden data movement)**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| BUS-07.1 | TBD | Payouts go only to the card used for the purchase (REFUNDS 02 Constraint 2). Non-goals: refunds for online-shop purchases, cash refunds and a customer mobile app (REFUNDS 04 Out of Scope); redeeming points, handling member complaints about points and correcting points by hand (LOYALTY 04 Out of Scope). | TBD | TBD | TBD | hard | Confirmed (Policy: test-run policy (set by Product Owner (fixture owner), 2026-10-27), 2026-10-27T18:37:11.845Z) | BRD: REFUNDS 02; REFUNDS 04; LOYALTY 04 | B | TBD |

### BUS-08

**Commercial/legal obligations to customers and penalty conditions**

| Entry | Label | Value | Unit | Window | Priority | Kind | Status | Source | Owner | Due |
|---|---|---|---|---|---|---|---|---|---|---|
| BUS-08.1 | TBD | No customer-facing contract or penalty applies; payouts follow the refund terms agreed with the payment provider (CardPay Ltd). | TBD | TBD | TBD | hard | Confirmed (Fixture: Product Owner stand-in (test-run policy), 2026-10-27T18:37:10.949Z) | Fixture: Product Owner stand-in (test-run policy) | B | TBD |

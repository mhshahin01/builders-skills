| ID | Value | Status | Lands in the SDD |
|---|---|---|---|
| HDR-07.1 | greenfield | Confirmed | Project Type |
| HDR-08.1 | cloud | Confirmed | Q8, §8.3, §8.6 |
| BUS-07.1 | Payouts go only to the card used for the purchase (REFUNDS 02 Constraint 2). Non-goals: refunds for online-shop purchases, cash refunds and a customer mobile app (REFUNDS 04 Out of Scope); redeeming points, handling member complaints about points and correcting points by hand (LOYALTY 04 Out of Scope). | Confirmed | §11 |
| BUS-08.1 | No customer-facing contract or penalty applies; payouts follow the refund terms agreed with the payment provider (CardPay Ltd). | Confirmed | §11 |
| CAP-01.1 | 2,000 transactions/day | Confirmed | §18, Q3 |
| CAP-01.2 | 40 transactions/day | Confirmed | §18, Q3 |
| CAP-02.1 | 0.2292 req/s | Confirmed | §18, Q3 |
| CAP-03.1 | 300 peak simultaneously active users (customers, members and branch managers) | Confirmed | §18, Q3 |
| CAP-04.1 | 3 × | Confirmed | §18, Q3 |
| CAP-05.1 | TBD | Open | §18, Q3 |
| CAP-06.1 | Requests about 4 KB and responses about 16 KB; receipts are looked up, not uploaded | Confirmed | §18, Q3 |
| CAP-07.1 | 1,500 ms | Confirmed | §18, Q3 |
| CAP-07.2 | 2,000 ms | Confirmed | §18, Q3 |
| CAP-08.1 | Ingress edge; successful and failed requests measured separately | Confirmed | §18, §18.5 |
| CAP-09.1 | Points taken back after a paid refund show in the member's balance and history within 1 hour of the refund being paid (LOYALTY/NFR-02). A payout that still fails after 1 day is reported to the branch manager (REFUNDS UC-04 E1). The branch refund report is daily (REFUNDS 09). The time for points earned on a purchase to show is open in the BRD (LOYALTY/NFR-03 proposes the end of the purchase day). | Confirmed | §18, Q3 |
| CAP-10.1 | TBD | Open | §18, Q3 |
| REL-01.1 | 99.9 % | Confirmed | §8.6, §18.5, Q3 |
| REL-01.2 | 99.9 % | Confirmed | §8.6, §18.5, Q3 |
| REL-02.1 | TBD | Open | §18.5, Q3 |
| REL-03.1 | 14,400 s | Confirmed | §8.6, §11, §18.5, §19, §20 |
| REL-03.2 | 300 s | Confirmed | §8.6, §11, §18.5, §19, §20 |
| REL-04.1 | 900 s | Confirmed | §8.6, §11, §18.5, §19, §20 |
| REL-04.2 | 5 s | Confirmed | §8.6, §11, §18.5, §19, §20 |
| REL-05.1 | region | Confirmed | §8.6, §11, §18.5, §19, §20 |
| REL-05.2 | az | Confirmed | §8.6, §11, §18.5, §19, §20 |
| REL-06.1 | A message that does not reach the customer never stops or changes a refund request; the customer can always see the current status (REFUNDS 03). When Point-of-Sale Records cannot be reached, customers are asked to try again later (REFUNDS UC-01 E5). A payout result may be recorded by hand by a staff member and confirmed by a second staff member (REFUNDS 03 Decision record). When points cannot be shown, the member is asked to try again later and no balance is shown (LOYALTY UC-01 E1). The maximum tolerable interruption is not stated beyond REFUNDS/NFR-02. | Confirmed | §20 |
| REL-07.1 | TBD | Open | §20 |
| REL-10.1 | Refund money is never lost or paid twice: zero missing or duplicate payouts per month, where a payout still being tried again or waiting for a card dispute at month end counts as delayed or waiting, not missing (REFUNDS/NFR-01). The decision record of every status change cannot be changed (REFUNDS 03). Every points movement follows the points rules, with zero upheld balance complaints a month (LOYALTY/NFR-01); each paid refund takes points back once, and the points taken back for a purchase never exceed the points it earned (LOYALTY UC-02 BR-3, BR-6). | Confirmed | §8.6, §11, §18.5 |
| DAT-01.1 | Refund request with its items, amounts and lifecycle (Submitted, Approved, Rejected, Paid, Cancelled), and the decision record of every status change (who, when, amount, reason), which nobody can change; the Refunds Portal is the system of record (REFUNDS 03) (storeKind: relational) | Confirmed | §6 Notes, §8.3 |
| DAT-01.2 | Points movements (earned and taken back) with the purchase and refund details behind each, and the points balance as the sum of the movements; Loyalty Points keeps every movement while the member is in the program (LOYALTY 03) (storeKind: relational) | Confirmed | §6 Notes, §8.3 |
| DAT-02.1 | 0.016 GB/day | Confirmed | §18, Q3 |
| DAT-03.1 | sensitive | Confirmed | §11, §6 Notes |
| DAT-04.1 | yes | Confirmed | §8.6, §8.7, §11, §6 Notes |
| DAT-05.1 | strong | Confirmed | §6 Notes, §8.3 |
| DAT-05.2 | strong | Confirmed | §6 Notes, §8.3 |
| DAT-06.1 | Refund requests, decisions and payout results are kept for 10 years for tax records; customer contact details are deleted 90 days after a request ends; a member's points history is kept while the membership lasts and deleted within 30 days after it ends. | Confirmed | §11, §6 Notes |
| DAT-07.1 | TBD | Open | Q7, §11 |
| DAT-08.1 | A daily branch refund report for each branch manager: requests per status, amounts paid, average time from Submitted to decision and to Paid (REFUNDS 09; its period and format are open). A monthly check that no payout is missing or paid twice (REFUNDS/NFR-01; the team that checks is open, REFUNDS 04). Loyalty Points has no reporting in this release (LOYALTY 09). | Confirmed | §18, Q3 |
| DAT-09.1 | TBD | Open | §8.6, §20 |
| SEC-01.1 | TBD | Open | §11, §6 Notes |
| SEC-02.1 | Customers act only on their own refund requests after proving who they are (method open, REFUNDS 03 Customer identity); branch managers act only on their own branch's requests (REFUNDS 03, 07); staff who record a payout result by hand and the second staff member who confirms it (REFUNDS 03, NFR-04); members see only their own points after signing in (sign-in party open, LOYALTY UC-01; LOYALTY/NFR-05). External parties: CardPay Ltd, MsgHub, Point-of-Sale Records (REFUNDS 08, LOYALTY 08). | Confirmed | §11, §6 Notes |
| SEC-03.1 | TBD | Open | §8.7, §11, §6 Notes |
| SEC-04.1 | Customer personal data, payout records and points data are encrypted at rest and in transit; the business holds the keys and rotates them at least once a year. | Confirmed | §8.7, §11, §6 Notes |
| SEC-05.1 | Every refund status change is recorded with who made it, the date and time, the amount and the reason; a payout recorded by hand as paid keeps both staff members; nobody can change the record, and it is deleted only when the REFUNDS/NFR-06 retention period ends (REFUNDS 03 Decision record). | Confirmed | §11, §6 Notes |
| SEC-06.1 | TBD | Open | §11, §6 Notes |
| SEC-07.1 | A branch manager cannot decide on a refund request they submitted as a customer (REFUNDS UC-04 BR-6); a payout recorded by hand as paid needs a second staff member to confirm it (REFUNDS 03). Whether a second approver is needed above an amount is open (REFUNDS UC-04 BR-7). | Confirmed | §8.7, §11, §6 Notes |
| SEC-08.1 | TBD | Open | §11, §6 Notes |
| INT-02.1 | The receipt lookup answers while the customer enters a receipt number (REFUNDS UC-01 step 2). Refund outcomes (Paid, Rejected, Cancelled, back to Approved) go from the Refunds Portal to Loyalty Points when they happen, and are kept and sent when Loyalty Points starts (REFUNDS 04, 08). Branch purchases of members are known the same day (LOYALTY 02 Assumption 1). Customer messages follow each status change (REFUNDS 03). | Confirmed | §6 Notes, §8.3 |
| INT-03.1 | TBD | Open | §8.3, §18 |
| INT-03.2 | TBD | Open | §8.3, §18 |
| INT-03.3 | TBD | Open | §8.3, §18 |
| INT-04.1 | Point-of-Sale Records unreachable: the customer is asked to try again later and is not told the receipt is wrong (REFUNDS UC-01 E5). Payout refused or sent back: the request stays or goes back to Approved, the payout is tried again, the customer is told it is delayed and the branch manager is told after 1 day (REFUNDS UC-04 E1). Card dispute open: the payout waits for the bank's decision (REFUNDS UC-04 BR-8). A message that fails never stops a request (REFUNDS 03). Loyalty Points not started: the refund outcomes are kept and sent when it starts (REFUNDS 04). | Confirmed | §6 Notes, §8.3 |
| INT-05.1 | Each paid refund takes points back once, even when the Refunds Portal reports it more than once (LOYALTY UC-02 BR-3). A refund paid before its purchase earned points waits up to 30 days for the purchase (LOYALTY UC-02 BR-5). Points taken back show within 1 hour of the refund being paid (LOYALTY/NFR-02). A late purchase keeps its purchase date (LOYALTY 03). | Confirmed | §6 Notes, §8.3 |
| INT-06.1 | TBD | Open | §8.7 |
| INT-07.1 | Customers and members use web browsers on phones and computers (REFUNDS 11, LOYALTY 11); branch managers work in 40 branches (REFUNDS 02 Facts; the devices they use are open, REFUNDS 11). No offline operation is stated. | Confirmed | §8.6, §8.7 |
| INT-08.1 | public | Confirmed | §8.3, §8.7, §11 |
| OPS-04.1 | dev, test, stage, prod, dr | Confirmed | §19 |
| OPS-06.1 | TBD | Open | §20 |
| ECO-01.1 | One-time budget 250,000 EUR; run cost up to 12,000 EUR a month | Confirmed | §6 Notes |
| ECO-03.1 | 36 months | Confirmed | §6 Notes |

| Decision | Value |
|---|---|
| Hosting | cloud |
| Topology | Primary + independent recovery location (regional) |
| DR strategy, scope region | Pilot Light (pilot), replication asynchronous |
| DR strategy, scope az | Local HA only · broader DR not scoped (localHA), replication asynchronous |
| Data | kind relational, consistency strong |
| Chosen option | OPT-01 (One primary region with a pilot-light recovery region) |

| Lands in the SDD | Rows |
|---|---|
| Project Type | HDR-07 |
| Q3 | CAP-01, CAP-02, CAP-03, CAP-04, CAP-05, CAP-06, CAP-07, CAP-09, CAP-10, REL-01, REL-02, DAT-02, DAT-08 |
| Q7 | DAT-07 |
| Q8 | HDR-08 |
| §6 Notes | DAT-01, DAT-03, DAT-04, DAT-05, DAT-06, SEC-01, SEC-02, SEC-03, SEC-04, SEC-05, SEC-06, SEC-07, SEC-08, INT-02, INT-04, INT-05, ECO-01, ECO-03 |
| §8.3 | HDR-08, DAT-01, DAT-05, INT-02, INT-03, INT-04, INT-05, INT-08 |
| §8.6 | HDR-08, REL-01, REL-03, REL-04, REL-05, REL-10, DAT-04, DAT-09, INT-07 |
| §8.7 | DAT-04, SEC-03, SEC-04, SEC-07, INT-06, INT-07, INT-08 |
| §11 | BUS-07, BUS-08, REL-03, REL-04, REL-05, REL-10, DAT-03, DAT-04, DAT-06, DAT-07, SEC-01, SEC-02, SEC-03, SEC-04, SEC-05, SEC-06, SEC-07, SEC-08, INT-08 |
| §18 | CAP-01, CAP-02, CAP-03, CAP-04, CAP-05, CAP-06, CAP-07, CAP-08, CAP-09, CAP-10, DAT-02, DAT-08, INT-03 |
| §18.5 | CAP-08, REL-01, REL-02, REL-03, REL-04, REL-05, REL-10 |
| §19 | REL-03, REL-04, REL-05, OPS-04 |
| §20 | REL-03, REL-04, REL-05, REL-06, REL-07, DAT-09, OPS-06 |

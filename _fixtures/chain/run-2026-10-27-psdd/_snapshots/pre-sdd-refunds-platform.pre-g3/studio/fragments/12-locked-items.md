| ID | Value | Status | Lands in the SDD |
|---|---|---|---|
| HDR-07.1 | greenfield | Confirmed | Project Type |
| HDR-08.1 | cloud | Confirmed | Q8, §8.3, §8.6 |
| CAP-01.1 | 2000 transactions/day | Confirmed | §18, Q3 |
| CAP-01.2 | 40 transactions/day | Confirmed | §18, Q3 |
| CAP-02.1 | 0.22916666666666669 req/s | Confirmed | §18, Q3 |
| CAP-03.1 | 300 peak simultaneously active users (customers, members and branch managers) | Confirmed | §18, Q3 |
| CAP-04.1 | 3 × | Confirmed | §18, Q3 |
| CAP-05.1 | TBD | Open | §18, Q3 |
| CAP-06.1 | Requests about 4 KB and responses about 16 KB; receipts are looked up, not uploaded | Confirmed | §18, Q3 |
| CAP-07.1 | 2000 ms | Confirmed | §18, Q3 |
| CAP-07.2 | 2000 ms | Confirmed | §18, Q3 |
| CAP-09.1 | Points taken back after a paid refund show within 1 hour of the refund being paid; a payout that still fails after one day is reported to the branch manager; the branch refund report is daily. The deadline for points earned on a purchase is not stated. | Confirmed | §18, Q3 |
| CAP-10.1 | TBD | Open | §18, Q3 |
| REL-01.1 | 99.9 % | Confirmed | §8.6, §18.5, Q3 |
| REL-01.2 | 99.9 % | Confirmed | §8.6, §18.5, Q3 |
| REL-02.1 | TBD | Open | §18.5, Q3 |
| REL-03.1 | 14400 s | Confirmed | §8.6, §11, §18.5, §19, §20 |
| REL-03.2 | 300 s | Confirmed | §8.6, §11, §18.5, §19, §20 |
| REL-04.1 | 900 s | Confirmed | §8.6, §11, §18.5, §19, §20 |
| REL-04.2 | 5 s | Confirmed | §8.6, §11, §18.5, §19, §20 |
| REL-05.1 | region | Confirmed | §8.6, §11, §18.5, §19, §20 |
| REL-05.2 | az | Confirmed | §8.6, §11, §18.5, §19, §20 |
| REL-06.1 | A staff member records a payout result by hand and a second staff member confirms it; a monthly check makes sure no payout is missing or paid twice (its owner is not stated); a customer whose purchase cannot be refunded online can visit the branch. | Confirmed | §20 |
| REL-07.1 | TBD | Open | §20 |
| DAT-02.1 | 0.016 GB/day | Confirmed | §18, Q3 |
| DAT-03.1 | sensitive | Confirmed | §11, §6 Notes |
| DAT-04.1 | yes | Confirmed | §8.6, §8.7, §11, §6 Notes |
| DAT-05.1 | strong | Confirmed | §6 Notes, §8.3 |
| DAT-05.2 | strong | Confirmed | §6 Notes, §8.3 |
| DAT-06.1 | Refund requests, decisions and payout results are kept for 10 years for tax records; customer contact details are deleted 90 days after a request ends; a member's points history is kept while the membership lasts and deleted within 30 days after it ends. | Confirmed | §11, §6 Notes |
| DAT-07.1 | TBD | Open | Q7, §11 |
| DAT-08.1 | A daily branch refund report for each branch manager: requests per status, amounts paid, average time from Submitted to decision and to Paid. A monthly check that no payout is missing or paid twice (owner not stated). Loyalty Points has no reporting in this release. | Confirmed | §18, Q3 |
| DAT-09.1 | TBD | Open | §8.6, §20 |
| SEC-01.1 | TBD | Open | §11, §6 Notes |
| SEC-02.1 | Customers prove who they are before they see receipt items or their requests (method not stated); branch managers act only for their own branch; staff members record and confirm a payout result by hand; members sign in (the sign-in party is not stated). Partners: Payment Provider, Notification Partner, Point-of-Sale Records. | Confirmed | §11, §6 Notes |
| SEC-03.1 | TBD | Open | §8.7, §11, §6 Notes |
| SEC-04.1 | Customer personal data, payout records and points data are encrypted at rest and in transit; the business holds the keys and rotates them at least once a year. | Confirmed | §8.7, §11, §6 Notes |
| SEC-05.1 | Every refund status change is recorded with who made it, the date and time, the amount and the reason; a payout result recorded by hand needs a second staff member to confirm it; nobody can change the record, and it is deleted only when the retention period ends. | Confirmed | §11, §6 Notes |
| SEC-06.1 | TBD | Open | §11, §6 Notes |
| SEC-07.1 | A branch manager decides only for the own branch and never on a request they submitted as a customer; a payout result recorded by hand is confirmed by a second staff member. A second approver above an amount is not stated. | Confirmed | §8.7, §11, §6 Notes |
| SEC-08.1 | TBD | Open | §11, §6 Notes |
| INT-02.1 | The receipt lookup runs when the customer enters a receipt number; payout requests and results go both ways with the Payment Provider; refund outcomes go to Loyalty Points at each change to Paid, Rejected, Cancelled or back to Approved, and are kept and sent later while Loyalty Points has not started; branch purchases are known the same day. | Confirmed | §6 Notes, §8.3 |
| INT-04.1 | A refused or sent-back payout is tried again and the request stays Approved; when Point-of-Sale Records cannot be reached, the customer is asked to try again later; a failed message never stops a request; refund outcomes are kept and sent when Loyalty Points starts; a paid refund whose purchase has not earned points waits up to 30 days. | Confirmed | §6 Notes, §8.3 |
| INT-05.1 | Each paid refund takes points back once, even when it is reported more than once; points taken back show within 1 hour of the refund being paid; a purchase that arrives late keeps its purchase date. | Confirmed | §6 Notes, §8.3 |
| INT-06.1 | TBD | Open | §8.7 |
| INT-07.1 | Customers and members use a web browser on phones and computers; branch managers work in 40 branches; no offline operation is stated; the devices for the branch manager screens are not stated. | Confirmed | §8.6, §8.7 |
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
| Chosen option | OPT-01 (One primary region with a pilot-light recovery region) |

| Lands in the SDD | Rows |
|---|---|
| Project Type | HDR-07 |
| Q3 | CAP-01, CAP-02, CAP-03, CAP-04, CAP-05, CAP-06, CAP-07, CAP-09, CAP-10, REL-01, REL-02, DAT-02, DAT-08 |
| Q7 | DAT-07 |
| Q8 | HDR-08 |
| §6 Notes | DAT-03, DAT-04, DAT-05, DAT-06, SEC-01, SEC-02, SEC-03, SEC-04, SEC-05, SEC-06, SEC-07, SEC-08, INT-02, INT-04, INT-05, ECO-01, ECO-03 |
| §8.3 | HDR-08, DAT-05, INT-02, INT-04, INT-05, INT-08 |
| §8.6 | HDR-08, REL-01, REL-03, REL-04, REL-05, DAT-04, DAT-09, INT-07 |
| §8.7 | DAT-04, SEC-03, SEC-04, SEC-07, INT-06, INT-07, INT-08 |
| §11 | REL-03, REL-04, REL-05, DAT-03, DAT-04, DAT-06, DAT-07, SEC-01, SEC-02, SEC-03, SEC-04, SEC-05, SEC-06, SEC-07, SEC-08, INT-08 |
| §18 | CAP-01, CAP-02, CAP-03, CAP-04, CAP-05, CAP-06, CAP-07, CAP-09, CAP-10, DAT-02, DAT-08 |
| §18.5 | REL-01, REL-02, REL-03, REL-04, REL-05 |
| §19 | REL-03, REL-04, REL-05, OPS-04 |
| §20 | REL-03, REL-04, REL-05, REL-06, REL-07, DAT-09, OPS-06 |

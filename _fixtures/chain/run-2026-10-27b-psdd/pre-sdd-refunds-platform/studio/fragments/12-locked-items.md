| ID | Measures | Value | Status | Owner | Lands in the SDD |
|---|---|---|---|---|---|
| HDR-07.1 | Change type | greenfield | Confirmed | TBD | Project Type |
| HDR-08.1 | Intended target | cloud | Confirmed | TBD | Q8, §8.3, §8.6 |
| BUS-07.1 | Explicit prohibitions / non-goals (e.g., forbidden data movement) | Payouts go only to the card used for the purchase (REFUNDS 02 Constraint 2). Non-goals: refunds for online-shop purchases, cash refunds and a customer mobile app (REFUNDS 04 Out of Scope); redeeming points, handling member complaints about points and correcting points by hand (LOYALTY 04 Out of Scope). | Confirmed | B | §11 |
| BUS-08.1 | Commercial/legal obligations to customers and penalty conditions | No customer-facing contract or penalty applies; payouts follow the refund terms agreed with the payment provider (CardPay Ltd). | Confirmed | B | §11 |
| CAP-01.1 | Transactions by type: normal and peak TPS, and define what a transaction counts; Points movement (earned on a branch purchase, or taken back after a refund) | 2,000 transactions/day | Confirmed | B+E | §18, Q3 |
| CAP-01.2 | Transactions by type: normal and peak TPS, and define what a transaction counts; Refund request | 40 transactions/day | Confirmed | B+E | §18, Q3 |
| CAP-02.1 | API request rate (RPS), reads/writes, retries, fan-out, requests per business transaction | 0.2292 req/s | Confirmed | B+E | §18, Q3 |
| CAP-03.1 | DAU/MAU, peak simultaneously active users, sessions and session duration | 300 peak simultaneously active users (customers, members and branch managers) | Confirmed | B+E | §18, Q3 |
| CAP-04.1 | Hourly/daily/weekly peaks, seasonality, campaign and burst size/duration | 3 × | Confirmed | B+E | §18, Q3 |
| CAP-05.1 | Forecasted growth by period and confidence, major future feature/product launches | TBD | Open | B (Refunds and Loyalty Product Owner) | §18, Q3 |
| CAP-06.1 | Payload/request/response sizes, file/object sizes, compression assumptions | Requests about 4 KB and responses about 16 KB; receipts are looked up, not uploaded | Confirmed | B+E | §18, Q3 |
| CAP-07.1 | p50, p95, p99 (and p99.9 if justified) per critical journey; units and observation window; Refunds Portal everyday actions (customer and branch manager): entering a receipt number, submitting a request, opening a request list | 2,000 ms | Confirmed | B+E | §18, Q3 |
| CAP-07.2 | p50, p95, p99 (and p99.9 if justified) per critical journey; units and observation window; Member points balance and history screens (LOYALTY UC-01, UC-02) | 2,000 ms | Confirmed | B+E | §18, Q3 |
| CAP-08.1 | Define where latency is measured (client end-to-end, ingress, service, batch completion) and what counts as failure | Ingress edge; successful and failed requests measured separately | Confirmed | B+E | §18, §18.5 |
| CAP-09.1 | Max queue age, processing deadline, freshness, end-to-end batch completion and backlog recovery target | Points taken back after a paid refund show in the member's balance and history within 1 hour of the refund being paid (LOYALTY/NFR-02). A payout that still fails after 1 day is reported to the branch manager (REFUNDS UC-04 E1). The branch refund report is daily (REFUNDS 09). The time for points earned on a purchase to show is open in the BRD (LOYALTY/NFR-03 proposes the end of the purchase day). | Confirmed | B+E | §18, Q3 |
| CAP-10.1 | Read/write mix, hot keys, expensive operations, query/report schedules | TBD | Open | B+E (Refunds and Loyalty Product Owner) | §18, Q3 |
| REL-01.1 | Availability SLO per user journey; denominator, service window, and measurement period; Refunds Portal journeys (customers and branch managers) | 99.9 % | Confirmed | B | §8.6, §18.5, Q3 |
| REL-01.2 | Availability SLO per user journey; denominator, service window, and measurement period; Member points balance and history screens (LOYALTY UC-01, UC-02) | 99.9 % | Confirmed | B | §8.6, §18.5, Q3 |
| REL-02.1 | SLA to customers vs internal SLO; what failures/exclusions count; penalties | TBD | Open | B (Refunds and Loyalty Product Owner) | §18.5, Q3 |
| REL-03.1 | RTO per service/journey and disaster scenario: acceptable elapsed time to restored usable service; Whole platform, region loss; scope region | 14,400 s | Confirmed | B | §8.6, §11, §18.5, §19, §20 |
| REL-03.2 | RTO per service/journey and disaster scenario: acceptable elapsed time to restored usable service; Whole platform, zone loss; scope az | 300 s | Confirmed | B | §8.6, §11, §18.5, §19, §20 |
| REL-04.1 | RPO per dataset/transaction and disaster scenario: acceptable age of last recoverable data point; All refund and points data, region loss; scope region | 900 s | Confirmed | B+D | §8.6, §11, §18.5, §19, §20 |
| REL-04.2 | RPO per dataset/transaction and disaster scenario: acceptable age of last recoverable data point; All refund and points data, zone loss; scope az | 5 s | Confirmed | B+D | §8.6, §11, §18.5, §19, §20 |
| REL-05.1 | Scope of recoverable failure: process, node, rack, site, AZ, region, ransomware, vendor failure; Loss of a whole region | region | Confirmed | B+Ops | §8.6, §11, §18.5, §19, §20 |
| REL-05.2 | Scope of recoverable failure: process, node, rack, site, AZ, region, ransomware, vendor failure; Loss of one zone | az | Confirmed | B+Ops | §8.6, §11, §18.5, §19, §20 |
| REL-06.1 | Maximum tolerable business interruption, minimum service during degradation, manual fallback and reconciliation | A message that does not reach the customer never stops or changes a refund request; the customer can always see the current status (REFUNDS 03). When Point-of-Sale Records cannot be reached, customers are asked to try again later (REFUNDS UC-01 E5). A payout result may be recorded by hand by a staff member and confirmed by a second staff member (REFUNDS 03 Decision record). When points cannot be shown, the member is asked to try again later and no balance is shown (LOYALTY UC-01 E1). The maximum tolerable interruption is not stated beyond REFUNDS/NFR-02. | Confirmed | B | §20 |
| REL-07.1 | Recovery sequence and dependencies: authentication, payments, ledger, reporting, etc. | TBD | Open | B+Ops (Refunds and Loyalty Product Owner) | §20 |
| REL-10.1 | Data durability and correctness expectations distinct from availability | Refund money is never lost or paid twice: zero missing or duplicate payouts per month, where a payout still being tried again or waiting for a card dispute at month end counts as delayed or waiting, not missing (REFUNDS/NFR-01). The decision record of every status change cannot be changed (REFUNDS 03). Every points movement follows the points rules, with zero upheld balance complaints a month (LOYALTY/NFR-01); each paid refund takes points back once, and the points taken back for a purchase never exceed the points it earned (LOYALTY UC-02 BR-3, BR-6). | Confirmed | B+E | §8.6, §11, §18.5 |
| DAT-01.1 | Business entities, system of record, ownership and data contracts; Refund requests, decisions and payouts | Refund request with its items, amounts and lifecycle (Submitted, Approved, Rejected, Paid, Cancelled), and the decision record of every status change (who, when, amount, reason), which nobody can change; the Refunds Portal is the system of record (REFUNDS 03) (storeKind: relational) | Confirmed | D+B | §6 Notes, §8.3 |
| DAT-01.2 | Business entities, system of record, ownership and data contracts; Points ledger | Points movements (earned and taken back) with the purchase and refund details behind each, and the points balance as the sum of the movements; Loyalty Points keeps every movement while the member is in the program (LOYALTY 03) (storeKind: relational) | Confirmed | D+B | §6 Notes, §8.3 |
| DAT-02.1 | Starting volume; records/day, GB/day, object size, peak writes and retention horizon | 0.016 GB/day | Confirmed | D+B | §18, Q3 |
| DAT-03.1 | Sensitivity classification: PII, financial, confidential, secrets, public | sensitive | Confirmed | D+Sec | §11, §6 Notes |
| DAT-04.1 | Residency, allowed processing/storage/backup locations and cross-border restrictions | yes | Confirmed | D+Legal | §8.6, §8.7, §11, §6 Notes |
| DAT-05.1 | Consistency, freshness, correctness, ordering and atomicity by operation | strong | Confirmed | B+D | §6 Notes, §8.3 |
| DAT-05.2 | Consistency, freshness, correctness, ordering and atomicity by operation; Points ledger | strong | Confirmed | B+D | §6 Notes, §8.3 |
| DAT-06.1 | Retention, records hold, archive, deletion, portability and right-to-erasure requirements | Refund requests, decisions and payout results are kept for 10 years for tax records; customer contact details are deleted 90 days after a request ends; a member's points history is kept while the membership lasts and deleted within 30 days after it ends. | Confirmed | D | §11, §6 Notes |
| DAT-07.1 | Multi-tenancy model, tenant isolation level, noisy-neighbor tolerance, tenants and growth | TBD | Open | B+D (Refunds and Loyalty Product Owner) | Q7, §11 |
| DAT-08.1 | Reporting, analytics, batch exports, reconciliation frequency and data latency | A daily branch refund report for each branch manager: requests per status, amounts paid, average time from Submitted to decision and to Paid (REFUNDS 09; its period and format are open). A monthly check that no payout is missing or paid twice (REFUNDS/NFR-01; the team that checks is open, REFUNDS 04). Loyalty Points has no reporting in this release (LOYALTY 09). | Confirmed | B+D | §18, Q3 |
| DAT-09.1 | Restore granularity (tenant/table/whole system), point-in-time needs and recovery verification | TBD | Open | D+Ops (Data Owner, Retail Finance) | §8.6, §20 |
| SEC-01.1 | Laws, contracts, certifications and organization policies actually applicable; control mappings | TBD | Open | Sec+D (Legal Counsel) | §11, §6 Notes |
| SEC-02.1 | Actors, partner identities, workforce, machine principals, customer identity sources | Customers act only on their own refund requests after proving who they are (method open, REFUNDS 03 Customer identity); branch managers act only on their own branch's requests (REFUNDS 03, 07); staff who record a payout result by hand and the second staff member who confirms it (REFUNDS 03, NFR-04); members see only their own points after signing in (sign-in party open, LOYALTY UC-01; LOYALTY/NFR-05). External parties: CardPay Ltd, MsgHub, Point-of-Sale Records (REFUNDS 08, LOYALTY 08). | Confirmed | B+Sec | §11, §6 Notes |
| SEC-03.1 | Threat/risk classification, acceptable residual risk and adversary concerns | TBD | Open | Sec (Security Lead) | §8.7, §11, §6 Notes |
| SEC-04.1 | Encryption at rest/in transit, BYOK/HYOK, key custody, rotation, certificate requirements | Customer personal data, payout records and points data are encrypted at rest and in transit; the business holds the keys and rotates them at least once a year. | Confirmed | Sec+D | §8.7, §11, §6 Notes |
| SEC-05.1 | Audit events, non-repudiation, investigation and evidence retention | Every refund status change is recorded with who made it, the date and time, the amount and the reason; a payout recorded by hand as paid keeps both staff members; nobody can change the record, and it is deleted only when the REFUNDS/NFR-06 retention period ends (REFUNDS 03 Decision record). | Confirmed | D+Sec | §11, §6 Notes |
| SEC-06.1 | Vulnerability, patch, pen-test, SBOM/supply-chain and incident reporting obligations | TBD | Open | Sec+Ops (Security Lead) | §11, §6 Notes |
| SEC-07.1 | Required separation of duties, privileged access, break glass and tenant/customer administration | A branch manager cannot decide on a refund request they submitted as a customer (REFUNDS UC-04 BR-6); a payout recorded by hand as paid needs a second staff member to confirm it (REFUNDS 03). Whether a second approver is needed above an amount is open (REFUNDS UC-04 BR-7). | Confirmed | Sec | §8.7, §11, §6 Notes |
| SEC-08.1 | Third-party processor/subprocessor and vendor risk restrictions | TBD | Open | B+Sec (Refunds and Loyalty Product Owner) | §11, §6 Notes |
| INT-02.1 | Synchronous API vs event/file/batch, update frequency, order and delivery expectations | The receipt lookup answers while the customer enters a receipt number (REFUNDS UC-01 step 2). Refund outcomes (Paid, Rejected, Cancelled, back to Approved) go from the Refunds Portal to Loyalty Points when they happen, and are kept and sent when Loyalty Points starts (REFUNDS 04, 08). Branch purchases of members are known the same day (LOYALTY 02 Assumption 1). Customer messages follow each status change (REFUNDS 03). | Confirmed | B+E | §6 Notes, §8.3 |
| INT-03.1 | External API quotas, latencies, SLAs, maintenance and rate limits | TBD | Open | B+E (CardPay Ltd) | §8.3, §18 |
| INT-03.2 | External API quotas, latencies, SLAs, maintenance and rate limits; Point-of-Sale Records (Retail IT team) | TBD | Open | B+E (Retail IT team) | §8.3, §18 |
| INT-03.3 | External API quotas, latencies, SLAs, maintenance and rate limits; Notification Partner (MsgHub) | TBD | Open | B+E (MsgHub) | §8.3, §18 |
| INT-04.1 | Failure behavior: reject, retry, queue, compensate, or manual handling | Point-of-Sale Records unreachable: the customer is asked to try again later and is not told the receipt is wrong (REFUNDS UC-01 E5). Payout refused or sent back: the request stays or goes back to Approved, the payout is tried again, the customer is told it is delayed and the branch manager is told after 1 day (REFUNDS UC-04 E1). Card dispute open: the payout waits for the bank's decision (REFUNDS UC-04 BR-8). A message that fails never stops a request (REFUNDS 03). Loyalty Points not started: the refund outcomes are kept and sent when it starts (REFUNDS 04). | Confirmed | B+E | §6 Notes, §8.3 |
| INT-05.1 | Consistency and ordering guarantees, duplicate tolerance, maximum delay | Each paid refund takes points back once, even when the Refunds Portal reports it more than once (LOYALTY UC-02 BR-3). A refund paid before its purchase earned points waits up to 30 days for the purchase (LOYALTY UC-02 BR-5). Points taken back show within 1 hour of the refund being paid (LOYALTY/NFR-02). A late purchase keeps its purchase date (LOYALTY 03). | Confirmed | B+E | §6 Notes, §8.3 |
| INT-06.1 | Existing public IP, allowlists, firewall change process, proxies, DNS and certificate dependencies | TBD | Open | E+Sec (Lead Architect, Retail IT) | §8.7 |
| INT-07.1 | Client geography, edge locations, remote branches, IoT and intermittent/offline operation | Customers and members use web browsers on phones and computers (REFUNDS 11, LOYALTY 11); branch managers work in 40 branches (REFUNDS 02 Facts; the devices they use are open, REFUNDS 11). No offline operation is stated. | Confirmed | B+E | §8.6, §8.7 |
| INT-08.1 | Address ranges, DNS zones, IP overlap, IPv4/IPv6, routing and private connectivity constraints | public | Confirmed | E | §8.3, §8.7, §11 |
| OPS-04.1 | Environments needed: dev, test, perf, stage, prod, DR; isolation and test data rules | dev, test, stage, prod, dr | Confirmed | Ops | §19 |
| OPS-06.1 | Business continuity runbooks, escalation matrix and authority to invoke failover | TBD | Open | B+Ops (Refunds and Loyalty Product Owner) | §20 |
| ECO-01.1 | One-time implementation/migration budget and recurring annual/monthly run-cost envelope | One-time budget 250,000 EUR; run cost up to 12,000 EUR a month | Confirmed | B+Fin | §6 Notes |
| ECO-03.1 | TCO horizon and required benefits (cost, speed, risk, flexibility) | 36 months | Confirmed | B+Fin | §6 Notes |

| ID | Measures | Value |
|---|---|---|
| CALC-01 | Average business TPS | 0.0231 txn/s |
| CALC-02 | Peak business TPS | 0.0694 txn/s |
| CALC-03 | Peak API RPS | 0.2292 req/s |
| CALC-04 | Headroom throughput budget | 0.3526 req/s |
| CALC-05 | Mean requests in flight | 0.0275 requests |
| CALC-06 | Peak inbound network | 0.0088 Mbps |
| CALC-07 | Peak outbound network | 0.0352 Mbps |
| CALC-08 | Combined modeled boundary traffic | 0.044 Mbps |
| CALC-09 | Daily API payload transfer | 0.132 GB/day |
| CALC-10 | New logical data per day | 0.016 GB/day |
| CALC-11 | Retained logical data | 59.448 GB |
| CALC-12 | Planning storage footprint | 166.4544 GB |
| CALC-13 | 30-day downtime budget | 2,592 s |
| CALC-14 | Annual downtime budget | 31,536 s |
| CALC-15 | Hypothetical RPO exposure | 62.5 txns |
| CALC-16 | One-year projected peak API RPS | TBD |
| CALC-17 | Ideal migration bulk transfer | TBD |
| CALC-18 | Proposed address block count | TBD |
| CALC-19 | Estimated business read TPS | TBD |
| CALC-20 | Estimated business write TPS | TBD |

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

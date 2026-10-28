**Blockers**

None.

**Conflicts**

None.

**Advisories**

| ID | Message | Owner | Entry |
|---|---|---|---|
| PRIMARY-ONLY-CAP-01 | CAP-01.1 holds 2000 transactions/day. Not read: CAP-01.2 holds 40 transactions/day. The calculations and rules read only CAP-01.1; make the primary entry the one to size for, or carry the others to the SDD. | B+E | CAP-01.1 |
| PRIMARY-ONLY-CAP-07 | CAP-07.1 holds 1500 ms and meanLatencyMs 120 ms. Not read: CAP-07.2 holds 2000 ms. The calculations and rules read only CAP-07.1; make the primary entry the one to size for, or carry the others to the SDD. | B+E | CAP-07.1 |

**Unknowns**

| ID | Question | Entry | Impact | Owner | Due | Status | Resolution |
|---|---|---|---|---|---|---|---|
| QD-01 | How many minutes per month may the points balance and history screens be unavailable, planned maintenance included (LOYALTY/NFR-04)? | REL-01.2 | Confirms or replaces the policy-accepted 99.9 % availability target for the member points journey. | Refunds and Loyalty Product Owner | 2026-11-20 | open | TBD |
| QD-02 | Within how many seconds must an everyday action in the Refunds Portal complete (REFUNDS/NFR-05)? | CAP-07.1 | Confirms or replaces the policy-accepted 2000 ms P99 latency target for the refund actions. | Refunds and Loyalty Product Owner | 2026-11-20 | open | TBD |
| QD-03 | What are the launch dates, hard deadlines and change windows of the Refunds Portal pilot, its rollout, and Loyalty Points (REFUNDS 04, LOYALTY 04)? | BUS-05.1 | Sets the delivery envelope the option comparison reads (delivery time) and the change-freeze windows. | Refunds and Loyalty Product Owner | 2026-11-20 | open | TBD |
| QD-04 | Has CardPay Ltd confirmed refunds to the original card for branch card purchases, with its merchant account model, time limit, needed payment details, and whether it reports card disputes (REFUNDS 02 Dependencies)? | INT-03.1 | Can change how the payout integration works; needed before the build of REFUNDS UC-04. | CardPay Ltd | 2026-11-20 | open | TBD |
| QD-05 | Has the Retail IT team agreed to give the receipt lookup and the member purchase feed, and how soon after a purchase can a receipt be found (REFUNDS 02 Assumption 4 and Dependencies, LOYALTY 02)? | INT-03.2 | Every refund request and every earned point depends on Point-of-Sale Records; needed before the build of REFUNDS UC-01. | Retail IT team | 2026-11-20 | open | TBD |
| QD-06 | Do branch purchases, and so the points movements of CAP-01.1, rise in the seasonal sales by the same factor as refund requests (CAP-04.1, REFUNDS/NFR-03), or by another factor? | CAP-04.1 | Confirms or replaces the peak factor that CALC-02 to CALC-09 apply to the points movements. | Refunds and Loyalty Product Owner | 2026-11-20 | open | TBD |
| QD-07 | Does a declared region disaster count toward the REFUNDS/NFR-02 limit of 2 hours of disruption a month and toward the REL-01.1 availability target? | REL-02.1 | Decides whether REL-03.1 conflicts with REFUNDS/NFR-02 and REL-01.1 (R-01), or whether a region loss is an exclusion of REL-02.1. | Refunds and Loyalty Product Owner | 2026-11-20 | open | TBD |
| QD-08 | Within how many milliseconds must the member points balance and history screens respond (LOYALTY 10 states no performance measure)? | CAP-07.2 | Confirms or replaces the policy-accepted 2000 ms latency target for the member points journey. | Refunds and Loyalty Product Owner | 2026-11-20 | open | TBD |

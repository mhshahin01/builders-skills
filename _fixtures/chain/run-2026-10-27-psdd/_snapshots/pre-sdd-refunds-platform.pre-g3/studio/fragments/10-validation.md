**Blockers**

None.

**Conflicts**

None.

**Advisories**

| ID | Message | Owner | Entry |
|---|---|---|---|
| PRIMARY-ONLY-CAP-01 | CAP-01.1 holds 2000 transactions/day. Not read: CAP-01.2 holds 40 transactions/day. The calculations and rules read only CAP-01.1; make the primary entry the one to size for, or carry the others to the SDD. | B+E | CAP-01.1 |

**Unknowns**

| ID | Question | Entry | Impact | Owner | Due | Status | Resolution |
|---|---|---|---|---|---|---|---|
| QD-01 | What is the launch date of each part, which branches form the Refunds Portal pilot group, how long does the pilot run, and in which order do the other branches start (REFUNDS 04)? When does Loyalty Points go live (LOYALTY 04)? | BUS-05.1 | Sets the delivery envelope (ECO-04) and the rollout (OPS-07); without it the cost and delivery envelope of G3-08 has no date. | Refunds and Loyalty Product Owner | 2026-11-20 | open | TBD |
| QD-02 | Which data-protection law applies to customer personal data and to members' points and purchase data, and which consumer refund rights apply beyond the 30-day refund window (REFUNDS 02, LOYALTY 02 Dependencies)? | SEC-01.1 | Can change residency (DAT-04), retention and erasure (DAT-06) and the security controls; SEC-01.1 is a hard entry and stays Open until it is answered. | Legal Counsel | 2026-11-20 | open | TBD |
| QD-03 | Within how many seconds must an everyday action in the Refunds Portal complete (REFUNDS/NFR-05)? The Pre-SDD takes 2000 ms at P99 as the target until the BRD states it. | CAP-07.1 | Confirms or replaces the P99 target CAP-07.1 that the latency budget and the mean requests in flight (CALC-05) rest on. | Refunds and Loyalty Product Owner | 2026-11-20 | open | TBD |
| QD-04 | How many minutes per month may the points screens be unavailable, planned maintenance included (LOYALTY/NFR-04)? The Pre-SDD takes 99.9% as the target until the BRD states it. | REL-01.2 | Confirms or replaces the availability target REL-01.2 of the points screens. | Refunds and Loyalty Product Owner | 2026-11-20 | open | TBD |
| QD-05 | In which countries do the branches operate, and which languages, date and number formats and accessibility standard apply (REFUNDS/NFR-07, REFUNDS 11, LOYALTY 11)? | BUS-06.1 | Can change the residency (DAT-04), the tax records (BUS-08) and the localization the SDD designs for. | Refunds and Loyalty Product Owner | 2026-11-20 | open | TBD |
| QD-06 | How does a customer prove who they are before the portal shows receipt items or their requests (REFUNDS 03 Customer identity), and which party signs a member in (LOYALTY/UC-01 Preconditions)? | SEC-02.1 | Sets the customer identity sources (SEC-02) and may add an external identity integration (INT-01) that the SDD designs. | Refunds and Loyalty Product Owner | 2026-11-20 | open | TBD |

<!--
CHUNK: 10
TITLE: Validation, Risks and Unknowns
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: 03a-09
PART OF: Pre-SDD - Refunds Platform
-->

# 10. Validation, Risks and Unknowns

## 10.1 Validation and Unknowns

<!-- ENGINE-FRAGMENT: 10-validation.md -->
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
<!-- /ENGINE-FRAGMENT -->

## 10.2 Risks

| Risk | Likelihood | Impact | Mitigation | Owner | Linked IDs |
|------|------------|--------|------------|-------|------------|
| R1: the pilot-light recovery region cannot be scaled up and its data copy promoted inside the region RTO | Medium | High | A recovery drill before go-live, repeated at the frequency REL-09.1 sets; OPT-02 is the fallback shape | Lead Architect, Retail IT | REL-03.1, REL-04.1, REL-09.1, OPT-01 |
| R2: the applicable data-protection law changes residency, retention or controls | Medium | High | Legal Counsel confirms the law by 2026-12-15; EXC-01 expires and is reviewed on its dates | Legal Counsel | SEC-01.1, EXC-01, QD-02, DAT-04.1, DAT-06.1 |
| R3: the payment provider does not support refunds to the original card for branch card purchases, which changes how the payout works | Medium | High | Written confirmation from the payment provider before the SDD fixes the payout integration | Refunds and Loyalty Product Owner | BUS-08.1, INT-01.1, INT-03.1 |
| R4: a partner's availability or limits are below what the journeys need (receipt lookup, payouts, messages) | Medium | Medium | The partner SLAs and quotas are collected before the SDD sizes the integrations | CardPay Ltd, Retail IT team, MsgHub (INT-03 owners) | INT-03.1, INT-03.2, INT-03.3, BUS-02.1 |
| R5: the BRD owners state latency or availability targets that differ from the accepted proposals | Low | Medium | The questions are raised to the Product manager; a change runs a Pre-SDD update | Refunds and Loyalty Product Owner | CAP-07.1, CAP-07.2, REL-01.1, REL-01.2, QD-03, QD-04 |
| R6: refund requests are sized through the primary transaction type only | Low | Low | CAP-01.2 travels to the SDD as its own entry | Refunds and Loyalty Product Owner | CAP-01.1, CAP-01.2, PRIMARY-ONLY-CAP-01 |
| R7: the screen load of the peak simultaneously active users is not sized; CALC-03 counts only points movements | Medium | Medium | The business gives the screen request rate as a CAP-01 entry before the SDD fixes §18; until then the SDD sizes the screens from CAP-03.1 and states its assumption | Refunds and Loyalty Product Owner | CAP-03.1, CAP-01.1, CALC-03, LOAD-04 |

## 10.3 Hard Entries Still Open

| Entry | Owner | Due | Exception |
|-------|-------|-----|-----------|
| SEC-01.1 | Legal Counsel | 2026-12-15 | EXC-01: granted by Product Owner (fixture owner), expires 2027-12-31, review 2027-03-31 |

<!-- MASTER: refunds-platform-pre-sdd-master.md | PREV: 09-decisions.md | NEXT: 11-gate-and-sign-off.md -->

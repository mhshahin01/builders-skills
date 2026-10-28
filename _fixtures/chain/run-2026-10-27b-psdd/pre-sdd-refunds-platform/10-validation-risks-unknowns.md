<!--
CHUNK: 10
TITLE: Validation, Risks and Unknowns
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: 03a-09 (full mode)
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
| QD-01 | How many minutes per month may the points balance and history screens be unavailable, planned maintenance included (LOYALTY/NFR-04)? | REL-01.2 | Confirms or replaces the policy-accepted 99.9 % availability target for the member points journey. | Refunds and Loyalty Product Owner | 2026-11-20 | open | TBD |
| QD-02 | Within how many seconds must an everyday action in the Refunds Portal complete (REFUNDS/NFR-05)? | CAP-07.1 | Confirms or replaces the policy-accepted 2000 ms P99 latency target for the refund actions. | Refunds and Loyalty Product Owner | 2026-11-20 | open | TBD |
| QD-03 | What are the launch dates, hard deadlines and change windows of the Refunds Portal pilot, its rollout, and Loyalty Points (REFUNDS 04, LOYALTY 04)? | BUS-05.1 | Sets the delivery envelope the option comparison reads (delivery time) and the change-freeze windows. | Refunds and Loyalty Product Owner | 2026-11-20 | open | TBD |
| QD-04 | Has CardPay Ltd confirmed refunds to the original card for branch card purchases, with its merchant account model, time limit, needed payment details, and whether it reports card disputes (REFUNDS 02 Dependencies)? | INT-03.1 | Can change how the payout integration works; needed before the build of REFUNDS UC-04. | CardPay Ltd | 2026-11-20 | open | TBD |
| QD-05 | Has the Retail IT team agreed to give the receipt lookup and the member purchase feed, and how soon after a purchase can a receipt be found (REFUNDS 02 Assumption 4 and Dependencies, LOYALTY 02)? | INT-03.2 | Every refund request and every earned point depends on Point-of-Sale Records; needed before the build of REFUNDS UC-01. | Retail IT team | 2026-11-20 | open | TBD |
| QD-06 | Do branch purchases, and so the points movements of CAP-01.1, rise in the seasonal sales by the same factor as refund requests (CAP-04.1, REFUNDS/NFR-03), or by another factor? | CAP-04.1 | Confirms or replaces the peak factor that CALC-02 to CALC-09 apply to the points movements. | Refunds and Loyalty Product Owner | 2026-11-20 | open | TBD |
| QD-07 | Does a declared region disaster count toward the REFUNDS/NFR-02 limit of 2 hours of disruption a month and toward the REL-01.1 availability target? | REL-02.1 | Decides whether REL-03.1 conflicts with REFUNDS/NFR-02 and REL-01.1 (R-01), or whether a region loss is an exclusion of REL-02.1. | Refunds and Loyalty Product Owner | 2026-11-20 | open | TBD |
| QD-08 | Within how many milliseconds must the member points balance and history screens respond (LOYALTY 10 states no performance measure)? | CAP-07.2 | Confirms or replaces the policy-accepted 2000 ms latency target for the member points journey. | Refunds and Loyalty Product Owner | 2026-11-20 | open | TBD |
<!-- /ENGINE-FRAGMENT -->

## 10.2 Risks

| ID | Risk | Likelihood | Impact | Mitigation | Owner | Linked IDs |
|----|------|------------|--------|------------|-------|------------|
| R-01 | One region recovery at REL-03.1 is longer than the 30-day downtime budget of REL-01.1 (CALC-13) and the REFUNDS/NFR-02 limit of 2 hours of disruption a month, so a region loss breaks the monthly availability measure | Low | High | Decide whether a declared region disaster counts toward REFUNDS/NFR-02 and REL-01.1; if it must not break them, tighten REL-03.1 and move the region scope toward OPT-02 | Refunds and Loyalty Product Owner | REL-03.1, REL-01.1, REL-02.1, QD-07, CALC-13, SLO-15@region, REFUNDS/NFR-02 |
| R-02 | The applicable data-protection law is not confirmed; it can add residency, retention or erasure rules after the SDD starts | Medium | High | EXC-01 lets SEC-01.1 pass until 2027-12-31 with a review on 2027-03-31; Legal Counsel confirms by 2026-12-15 | Legal Counsel | SEC-01.1, EXC-01, DAT-04.1, DAT-06.1 |
| R-03 | CardPay Ltd has not confirmed refunds to the original card for branch card purchases; its answer can change the payout integration and the replay of payout results after a region loss | Medium | High | Ask CardPay Ltd before the SDD fixes the payout integration | CardPay Ltd | QD-04, INT-03.1, ADR-DATA-001 |
| R-04 | The Retail IT team has not agreed the receipt lookup and the member purchase feed; every refund request and every earned point depends on Point-of-Sale Records | Medium | High | Agree the lookup and feed before the build of REFUNDS UC-01 | Retail IT team | QD-05, INT-03.2, INT-09.1 |
| R-05 | The pilot-light recovery is unproven until a drill starts the recovery environment and promotes the data copy within REL-03.1 and REL-04.1 | Medium | Medium | Set the drill frequency and evidence (REL-09.1) and run a drill before go-live | Refunds and Loyalty Product Owner | REL-09.1, REL-03.1, REL-04.1, ADR-DR-001 |
| R-06 | The availability and latency targets of the member journey (REL-01.2, CAP-07.2) and the latency target of the refund actions (CAP-07.1) rest on proposals no source states; the BRD owners may set other values | Medium | Low | Answer QD-01, QD-02 and QD-08 through the BRD owners | Refunds and Loyalty Product Owner | REL-01.2, CAP-07.1, CAP-07.2, QD-01, QD-02, QD-08 |
| R-07 | The calculations size only the points movements (CAP-01.1); refund requests (CAP-01.2) and the peak active users (CAP-03.1) are carried to the SDD unsized | Low | Low | The SDD sizes them in §18 | Lead Architect, Retail IT | PRIMARY-ONLY-CAP-01, CAP-01.2, CAP-03.1 |

## 10.3 Hard Entries Still Open

| Entry | Owner | Due | Exception |
|-------|-------|-----|-----------|
| SEC-01.1 | Legal Counsel | 2026-12-15 | EXC-01: granted by Product Owner (fixture owner), expires 2027-12-31, review 2027-03-31 |

<!-- MASTER: refunds-platform-pre-sdd-master.md | PREV: 09-decisions.md | NEXT: 11-gate-and-sign-off.md -->

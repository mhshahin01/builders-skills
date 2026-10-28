<!--
CHUNK: 07
TITLE: Options and Economics
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: 03a-03h, 04, 05
PART OF: Pre-SDD - Refunds Platform
-->

# 7. Options and Economics

## 7.1 Options

<!-- ENGINE-FRAGMENT: 07-options.md -->
| Option | Shape | Hard constraints | TCO (CALC-21) | Weighted score (CALC-22) | Status |
|---|---|---|---|---|---|
| OPT-01 | One primary region with a pilot-light recovery region (hosting cloud, topology regional, dr pilot, data relational, strongly consistent; asynchronous replication across zones (RPO 5 s) and to the recovery region (RPO 15 min), network public) | pass | 414,000 EUR | 3.9231 | chosen |
| OPT-02 | One primary region with a warm-standby recovery region (hosting cloud, topology regional, dr warm, data relational, strongly consistent; asynchronous replication across zones (RPO 5 s) and to the recovery region (RPO 15 min), network public) | pass | 562,800 EUR | 3.5385 | shortlisted |

**Weights**

| Criterion | Weight |
|---|---|
| nfr_fit | 3 |
| one_time_cost | 1 |
| recurring_tco | 2 |
| delivery_time | 1 |
| operability | 2 |
| security_compliance | 2 |
| reversibility | 1 |
| uncertainty | 1 |

Approved by Fixture: Product Owner stand-in (test-run policy) at 2026-10-27T18:40:04.027Z.

**TCO horizon (ECO-03):** 36 months

**Flags:** none

**Scores and costs**

| Option | Item | Value | Status | By | Reason |
|---|---|---|---|---|---|
| OPT-01 | one_time | 180,000 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | TBD |
| OPT-01 | monthly | 6,500 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | TBD |
| OPT-01 | nfr_fit | 4 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | Pilot light meets REL-03.1 and REL-04.1 for scope region and local HA meets REL-03.2 and REL-04.2 for scope az (05 target shape), with less recovery margin than a warm standby. |
| OPT-01 | one_time_cost | 4 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | The recovery region holds replicated data and an idle environment only, so less is built up front than for a running standby. |
| OPT-01 | recurring_tco | 4 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | Only replication and stored data run in the recovery region each month; compute starts at failover (REL-03.1 allows the scale-up time). |
| OPT-01 | delivery_time | 4 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | One running region plus replication and a scripted recovery environment is less to build and test before go-live. |
| OPT-01 | operability | 4 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | One running region to operate day to day; the recovery region needs only its replication watched and its recovery drilled (REL-09). |
| OPT-01 | security_compliance | 4 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | Both regions stay in the European Union (DAT-04.1) and use the same encryption and key custody (SEC-04.1); SEC-01.1 is still open for both options. |
| OPT-01 | reversibility | 4 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | Little runs in the recovery region, so moving to a warm standby later is an additive change. |
| OPT-01 | uncertainty | 3 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | Recovery depends on starting the environment within REL-03.1, which only a drill proves; the drill frequency (REL-09) is open. |
| OPT-02 | one_time | 210,000 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | TBD |
| OPT-02 | monthly | 9,800 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | TBD |
| OPT-02 | nfr_fit | 5 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | A running standby recovers well inside REL-03.1 and meets REL-04.1 for scope region, and local HA meets REL-03.2 and REL-04.2 for scope az. |
| OPT-02 | one_time_cost | 3 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | A second running environment is built and tested up front. |
| OPT-02 | recurring_tco | 2 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | Scaled-down compute runs in the recovery region every month, beyond what REL-03.1 needs. |
| OPT-02 | delivery_time | 3 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | Two running environments to deploy, keep in step and test before go-live. |
| OPT-02 | operability | 3 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | Two running regions to patch, deploy to and watch. |
| OPT-02 | security_compliance | 4 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | Both regions stay in the European Union (DAT-04.1) and use the same encryption and key custody (SEC-04.1); SEC-01.1 is still open for both options. |
| OPT-02 | reversibility | 3 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | More resources are committed in the recovery region, so stepping down later costs more change. |
| OPT-02 | uncertainty | 4 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | The standby runs all the time, so its readiness is visible before a failover is needed. |

**Unknowns**

None.

**Calculations**

| ID | Formula | Substitution | Result |
|---|---|---|---|
| CALC-21@OPT-01 | one_time_cost + horizon_months × monthly_cost | 180,000 + 36 × 6,500 | 414,000 EUR |
| CALC-22@OPT-01 | sum(weight × score) / sum(weight) | (3 × 4 + 1 × 4 + 2 × 4 + 1 × 4 + 2 × 4 + 2 × 4 + 1 × 4 + 1 × 3) / (3 + 1 + 2 + 1 + 2 + 2 + 1 + 1) | 3.9231 score (1 to 5) |
| CALC-21@OPT-02 | one_time_cost + horizon_months × monthly_cost | 210,000 + 36 × 9,800 | 562,800 EUR |
| CALC-22@OPT-02 | sum(weight × score) / sum(weight) | (3 × 5 + 1 × 3 + 2 × 2 + 1 × 3 + 2 × 3 + 2 × 4 + 1 × 3 + 1 × 4) / (3 + 1 + 2 + 1 + 2 + 2 + 1 + 1) | 3.5385 score (1 to 5) |

**Chosen option:** OPT-01 (One primary region with a pilot-light recovery region)
<!-- /ENGINE-FRAGMENT -->

## 7.2 Reading the Comparison

- **Hard-constraint filter:** both options pass. OPT-01 is the engine's target shape (chunk 05); OPT-02 is the credible stronger alternative for the region scope, a warm standby instead of a pilot light. Both keep cloud hosting, the regional topology, local HA for the zone scope, and public network access, so neither fails the hosting, network, or topology and DR checks.
- **Hard entries the engine does not check:**

| Hard entry | OPT-01 | OPT-02 | Evidence |
|------------|--------|--------|----------|
| BUS-07.1 Prohibitions and non-goals | Meets | Meets | Neither shape moves payouts away from the original card or adds an out-of-scope capability |
| BUS-08.1 Obligations to customers | Meets | Meets | No customer contract; payout terms with CardPay Ltd are independent of the recovery shape |
| SEC-01.1 Applicable laws | Open for both | Open for both | Open under EXC-01 (chunk 11); Legal Counsel confirms by 2026-12-15 |
| SEC-04.1 Encryption and key custody | Meets | Meets | Both shapes encrypt at rest and in transit with business-held keys in both regions |
| DAT-03.1 Sensitivity | Meets | Meets | Both shapes keep sensitive data inside the protected boundary (chunk 05 § 5.2.5) |
| DAT-04.1 Residency | Meets | Meets | Both regions are within the European Union (factors primaryLocation, recoveryLocation) |
| DAT-06.1 Retention and erasure | Meets | Meets | Retention and deletion apply to the primary and the recovery copies alike |

  No option is excluded (DT-04 not triggered).
- **Weights:** approved by Fixture: Product Owner stand-in (test-run policy) on 2026-10-27, as the fragment shows; the comparison is weighted, and no flag is raised.
- **TCO:** over the 36-month horizon (ECO-03.1), CALC-21@OPT-01 is lower than CALC-21@OPT-02, because the pilot-light region runs no compute each month. Both one-time costs and both monthly costs sit inside the ECO-01.1 envelope (DT-10 read by a person).
- **Recommended shape:** OPT-01, one primary region with a pilot-light recovery region. It has the higher weighted score (CALC-22@OPT-01 above CALC-22@OPT-02) under the approved weights and meets REL-03.1 and REL-04.1 for the region scope at the lower TCO. It is the chosen option (decisions, fragment above).
- **Cost sensitivities:** the monthly cost drives the TCO difference; a tighter REL-03.1 would move the region scope to a warm standby and its higher monthly cost.
- **Reversal condition:** a business decision that a region loss must recover within the REFUNDS/NFR-02 monthly limit (risk R-01), a tighter REL-03.1 or REL-04.1, or a recovery drill that shows the pilot light cannot start within REL-03.1, reverses the choice toward OPT-02.
- **Pilots and PoCs needed:** a recovery drill that starts the pilot-light environment and promotes the recovery data copy within REL-03.1 and REL-04.1 (REL-09.1, Open).

<!-- MASTER: refunds-platform-pre-sdd-master.md | PREV: 05-target-shape.md | NEXT: 09-decisions.md -->

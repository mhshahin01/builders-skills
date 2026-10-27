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

| Option | Item | Value | Status | By | At | Reason |
|---|---|---|---|---|---|---|
| OPT-01 | one_time | 180,000 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T18:40:04.027Z | TBD |
| OPT-01 | monthly | 6,500 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T18:40:04.027Z | TBD |
| OPT-01 | nfr_fit | 4 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T18:40:04.027Z | Pilot light meets REL-03.1 and REL-04.1 for scope region and local HA meets REL-03.2 and REL-04.2 for scope az (05 target shape), with less recovery margin than a warm standby. |
| OPT-01 | one_time_cost | 4 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T18:40:04.027Z | The recovery region holds replicated data and an idle environment only, so less is built up front than for a running standby. |
| OPT-01 | recurring_tco | 4 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T18:40:04.027Z | Only replication and stored data run in the recovery region each month; compute starts at failover (REL-03.1 allows the scale-up time). |
| OPT-01 | delivery_time | 4 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T18:40:04.027Z | One running region plus replication and a scripted recovery environment is less to build and test before go-live. |
| OPT-01 | operability | 4 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T18:40:04.027Z | One running region to operate day to day; the recovery region needs only its replication watched and its recovery drilled (REL-09). |
| OPT-01 | security_compliance | 4 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T18:40:04.027Z | Both regions stay in the European Union (DAT-04.1) and use the same encryption and key custody (SEC-04.1); SEC-01.1 is still open for both options. |
| OPT-01 | reversibility | 4 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T18:40:04.027Z | Little runs in the recovery region, so moving to a warm standby later is an additive change. |
| OPT-01 | uncertainty | 3 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T18:40:04.027Z | Recovery depends on starting the environment within REL-03.1, which only a drill proves; the drill frequency (REL-09) is open. |
| OPT-02 | one_time | 210,000 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T18:40:04.027Z | TBD |
| OPT-02 | monthly | 9,800 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T18:40:04.027Z | TBD |
| OPT-02 | nfr_fit | 5 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T18:40:04.027Z | A running standby recovers well inside REL-03.1 and meets REL-04.1 for scope region, and local HA meets REL-03.2 and REL-04.2 for scope az. |
| OPT-02 | one_time_cost | 3 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T18:40:04.027Z | A second running environment is built and tested up front. |
| OPT-02 | recurring_tco | 2 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T18:40:04.027Z | Scaled-down compute runs in the recovery region every month, beyond what REL-03.1 needs. |
| OPT-02 | delivery_time | 3 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T18:40:04.027Z | Two running environments to deploy, keep in step and test before go-live. |
| OPT-02 | operability | 3 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T18:40:04.027Z | Two running regions to patch, deploy to and watch. |
| OPT-02 | security_compliance | 4 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T18:40:04.027Z | Both regions stay in the European Union (DAT-04.1) and use the same encryption and key custody (SEC-04.1); SEC-01.1 is still open for both options. |
| OPT-02 | reversibility | 3 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T18:40:04.027Z | More resources are committed in the recovery region, so stepping down later costs more change. |
| OPT-02 | uncertainty | 4 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T18:40:04.027Z | The standby runs all the time, so its readiness is visible before a failover is needed. |

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

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
| OPT-01 | One primary region with a pilot-light recovery region (hosting cloud, topology regional, dr pilot, data relational, strongly consistent; asynchronous to the zone standby and to the recovery region, network public) | pass | 414,000 currency units | 3.7692 | chosen |
| OPT-02 | One primary region with a warm-standby recovery region (hosting cloud, topology regional, dr warm, data relational, strongly consistent; asynchronous to the zone standby and to the recovery region, network public) | pass | 562,800 currency units | 3.5385 | shortlisted |

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

Approved by Fixture: Product Owner stand-in (test-run policy) at 2026-10-27T16:43:01.013Z.

**TCO horizon (ECO-03):** 36 months

**Flags:** none

**Scores and costs**

| Option | Item | Value | Status | By | Reason |
|---|---|---|---|---|---|
| OPT-01 | one_time | 180000 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | TBD |
| OPT-01 | monthly | 6500 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | TBD |
| OPT-01 | nfr_fit | 4 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | Pilot light is the engine strategy for scope region at REL-03.1 and REL-04.1, and local HA covers scope az; it meets the targets with less margin than a running standby. |
| OPT-01 | one_time_cost | 4 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | Only the data copy and a minimal recovery footprint are built in the recovery region, fewer standby parts than a warm standby. |
| OPT-01 | recurring_tco | 4 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | The recovery region runs only the data copy until it is needed, so the monthly run cost stays low. |
| OPT-01 | delivery_time | 4 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | A minimal recovery footprint and its scale-up runbook are quicker to build than a second running environment. |
| OPT-01 | operability | 3 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | Recovery needs the recovery footprint scaled up by runbook within REL-03.1, which the operations team must practise. |
| OPT-01 | security_compliance | 4 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | Both regions sit within the European Union as DAT-04.1 requires, under the same SEC-04.1 controls. |
| OPT-01 | reversibility | 4 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | It can step up to a warm standby later without changing the primary region. |
| OPT-01 | uncertainty | 3 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | That the scale-up fits inside REL-03.1 is not yet proven; it needs a recovery drill (REL-09). |
| OPT-02 | one_time | 210000 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | TBD |
| OPT-02 | monthly | 9800 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | TBD |
| OPT-02 | nfr_fit | 5 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | A running standby recovers scope region well inside REL-03.1 and REL-04.1, and local HA covers scope az. |
| OPT-02 | one_time_cost | 3 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | A second running environment in the recovery region is built up front. |
| OPT-02 | recurring_tco | 2 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | The standby environment runs every month, so the monthly run cost is the higher of the two shapes. |
| OPT-02 | delivery_time | 3 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | Two running environments take longer to build and test than a minimal recovery footprint. |
| OPT-02 | operability | 3 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | Failover is simpler, but two running environments must be kept in step and patched. |
| OPT-02 | security_compliance | 4 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | Both regions sit within the European Union as DAT-04.1 requires, under the same SEC-04.1 controls. |
| OPT-02 | reversibility | 3 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | A running standby is a larger standing commitment to step back from. |
| OPT-02 | uncertainty | 4 | Confirmed | Fixture: Product Owner stand-in (test-run policy) | A running standby is exercised all the time, so recovery inside REL-03.1 rests on more evidence. |

**Unknowns**

None.

**Calculations**

| ID | Formula | Substitution | Result |
|---|---|---|---|
| CALC-21@OPT-01 | one_time_cost + horizon_months × monthly_cost | 180,000 + 36 × 6,500 | 414,000 currency units |
| CALC-22@OPT-01 | sum(weight × score) / sum(weight) | (3 × 4 + 1 × 4 + 2 × 4 + 1 × 4 + 2 × 3 + 2 × 4 + 1 × 4 + 1 × 3) / (3 + 1 + 2 + 1 + 2 + 2 + 1 + 1) | 3.7692 score (1 to 5) |
| CALC-21@OPT-02 | one_time_cost + horizon_months × monthly_cost | 210,000 + 36 × 9,800 | 562,800 currency units |
| CALC-22@OPT-02 | sum(weight × score) / sum(weight) | (3 × 5 + 1 × 3 + 2 × 2 + 1 × 3 + 2 × 3 + 2 × 4 + 1 × 3 + 1 × 4) / (3 + 1 + 2 + 1 + 2 + 2 + 1 + 1) | 3.5385 score (1 to 5) |

**Chosen option:** OPT-01 (One primary region with a pilot-light recovery region)
<!-- /ENGINE-FRAGMENT -->

## 7.2 Reading the Comparison

- **Hard-constraint filter:** OPT-01 and OPT-02 both pass: hosting cloud, network public, topology regional and the DR strategy for scope region raise no conflict. Against the hard entries the engine does not check, both keep payouts to the original card and the non-goals (BUS-07.1), carry no penalty term (BUS-08.1), encrypt with business-held keys (SEC-04.1), protect sensitive data (DAT-03.1), keep both regions within the European Union (DAT-04.1) and can hold the retention of DAT-06.1; SEC-01.1 is `Open` under EXC-01 and applies to both alike. No option is excluded.
- **Weights:** approved by the fixture owner, as the weights table shows; the comparison is weighted and carries no flag.
- **TCO:** over the 36-month horizon of ECO-03.1, CALC-21@OPT-01 is lower than CALC-21@OPT-02, because the recovery region of OPT-01 runs only its data copy until it is needed. Both one-time costs sit inside the one-time budget of ECO-01.1, and both monthly costs inside its monthly run-cost envelope.
- **Recommended shape:** OPT-01, one primary region with a pilot-light recovery region: it has the higher weighted score (CALC-22@OPT-01 against CALC-22@OPT-02) and the lower TCO, and it meets REL-03.1 and REL-04.1 for scope region.
- **Reversal condition:** a recovery drill that cannot bring the pilot-light region into service inside REL-03.1, or a lower REL-03.1 from the business, moves the choice to OPT-02.
- **Pilots and PoCs needed:** a recovery drill of the pilot-light scale-up and the data-copy promotion (REL-09.1 holds its frequency, `Open`).

<!-- MASTER: refunds-platform-pre-sdd-master.md | PREV: 05-target-shape.md | NEXT: 09-decisions.md -->

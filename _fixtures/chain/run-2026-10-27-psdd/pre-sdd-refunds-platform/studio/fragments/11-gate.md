| Gate | Result | Missing |
|---|---|---|
| G0 Initiate | Met | None |
| G1 Discover | Met | None |
| G2 Assess | shortlist | None |
| G3 Approve | Approved with conditions | None |

**Gate label:** G3 Approved with conditions

**Authorized to start the SDD:** Yes

**G3 checklist**

| Line | Text | Status | Reason (N/A) | Ticked by | At |
|---|---|---|---|---|---|
| G3-01 | A named business sponsor and product owner approved the problem, scope and success measures. | Done | TBD | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T17:21:18.226Z |
| G3-02 | The Greenfield/Brownfield × On-prem/Cloud path is recorded (including mixed/hybrid logic where needed). | Done | TBD | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T17:21:18.226Z |
| G3-03 | Source-to-target migration direction is explicit, or `N/A` with reason. | Done | TBD | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T17:21:18.226Z |
| G3-04 | Every critical journey has measurable capacity and performance outcomes, including measurement methodology. | Done | TBD | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T17:21:18.226Z |
| G3-05 | Availability, RTO, RPO, data correctness and tolerated failure scopes have business approval. | Done | TBD | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T17:21:18.226Z |
| G3-06 | Security/privacy/legal/data residency requirements are mapped to owners and feasibility checked. | Done | TBD | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T17:21:18.226Z |
| G3-07 | Integration/dependency graph and network boundary assumptions are validated. | Done | TBD | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T17:21:18.226Z |
| G3-08 | Cost and delivery envelopes, operating model and team capability have owners. | Done | TBD | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T17:21:18.226Z |
| G3-09 | For brownfield, baseline metrics, inventory, constraints and major defects are evidenced. | N/A | Greenfield (HDR-07): there is no existing estate. | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T17:21:18.226Z |
| G3-10 | For migrations, per-workload 7R, dependency waves, data path, fallback and no-return point are documented. | N/A | No migration overlay (HDR-10 none). | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T17:21:18.226Z |
| G3-11 | All hard-constraint conflicts and high risks have been closed or formally accepted by an empowered owner. | Done | TBD | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T17:21:18.226Z |
| G3-12 | The option comparison, recommended path, rationale, open PoCs and proposed ADRs are recorded. | Done | TBD | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T17:21:18.226Z |
| G3-13 | SDD acceptance-test matrix and responsibilities are established. | Done | TBD | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T17:21:18.226Z |
| G3-14 | Required approvals, dates, conditions and next-review trigger are captured. | Done | TBD | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T17:21:18.226Z |

**Sign-off register**

| Role | Name | Decision | At | Comments |
|---|---|---|---|---|
| Business sponsor | Stand-in: Approver (test-run policy, set by Product Owner (fixture owner), 2026-10-27) | Approved with conditions | 2026-10-27T17:21:33.230Z | Counted, stand-in |
| Product owner / business process owner | Stand-in: Approver (test-run policy, set by Product Owner (fixture owner), 2026-10-27) | Approved with conditions | 2026-10-27T17:21:34.199Z | Counted, stand-in |
| Lead / principal architect | Stand-in: Approver (test-run policy, set by Product Owner (fixture owner), 2026-10-27) | Approved with conditions | 2026-10-27T17:21:35.169Z | Counted, stand-in |
| Infrastructure / platform owner | Stand-in: Approver (test-run policy, set by Product Owner (fixture owner), 2026-10-27) | Approved with conditions | 2026-10-27T17:21:36.155Z | Counted, stand-in |
| Network owner | Stand-in: Approver (test-run policy, set by Product Owner (fixture owner), 2026-10-27) | Approved with conditions | 2026-10-27T17:21:37.131Z | Counted, stand-in |
| Security and privacy/compliance | Stand-in: Approver (test-run policy, set by Product Owner (fixture owner), 2026-10-27) | Approved with conditions | 2026-10-27T17:21:38.100Z | Counted, stand-in |
| Data owner | Stand-in: Approver (test-run policy, set by Product Owner (fixture owner), 2026-10-27) | Approved with conditions | 2026-10-27T17:21:39.075Z | Counted, stand-in |
| SRE / operations | Stand-in: Approver (test-run policy, set by Product Owner (fixture owner), 2026-10-27) | Approved with conditions | 2026-10-27T17:21:40.065Z | Counted, stand-in |
| Finance / procurement | Stand-in: Approver (test-run policy, set by Product Owner (fixture owner), 2026-10-27) | Approved with conditions | 2026-10-27T17:21:41.058Z | Counted, stand-in |
| Architecture review authority | Stand-in: Approver (test-run policy, set by Product Owner (fixture owner), 2026-10-27) | Approved with conditions | 2026-10-27T17:21:42.064Z | Counted, stand-in |

**Conditions**

| ID | Condition | Owner | Due |
|---|---|---|---|
| COND-01 | CardPay Ltd confirms in writing that it refunds branch card purchases to the original card, before the SDD fixes the payout integration. | Refunds and Loyalty Product Owner | 2026-12-15 |

**Exceptions**

| ID | Entry | Reason | Granted by | Expires | Review | Valid |
|---|---|---|---|---|---|---|
| EXC-01 | SEC-01.1 | The applicable data-protection law is a hard BRD dependency needed before go-live (REFUNDS 02 and LOYALTY 02 Dependencies), not before the SDD; the SDD may start while Legal Counsel confirms it by 2026-12-15. | Product Owner (fixture owner) | 2027-12-31 | 2027-03-31 | yes |

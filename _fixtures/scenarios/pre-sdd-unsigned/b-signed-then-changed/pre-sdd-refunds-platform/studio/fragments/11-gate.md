| Gate | Result | Missing |
|---|---|---|
| G0 Initiate | Met | None |
| G1 Discover | Met | None |
| G2 Assess | shortlist | None |
| G3 Approve | Review | Sign-off records given on other content (the content hash has changed since): business_sponsor, product_owner_business_process_owner, lead_principal_architect, infrastructure_platform_owner, network_owner, security_and_privacy_compliance, data_owner, sre_operations, finance_procurement, architecture_review_authority; sign again after the review.; Business sponsor has not signed: a stand-in sign-off counts only when nothing else in G3 fails.; Product owner / business process owner has not signed: a stand-in sign-off counts only when nothing else in G3 fails.; Lead / principal architect has not signed: a stand-in sign-off counts only when nothing else in G3 fails.; Infrastructure / platform owner has not signed: a stand-in sign-off counts only when nothing else in G3 fails.; Network owner has not signed: a stand-in sign-off counts only when nothing else in G3 fails.; Security and privacy/compliance has not signed: a stand-in sign-off counts only when nothing else in G3 fails.; Data owner has not signed: a stand-in sign-off counts only when nothing else in G3 fails.; SRE / operations has not signed: a stand-in sign-off counts only when nothing else in G3 fails.; Finance / procurement has not signed: a stand-in sign-off counts only when nothing else in G3 fails.; Architecture review authority has not signed: a stand-in sign-off counts only when nothing else in G3 fails. |

**Gate label:** G2

**Authorized to start the SDD:** No

**G3 checklist**

| Line | Text | Status | Reason (N/A) | Ticked by | At |
|---|---|---|---|---|---|
| G3-01 | A named business sponsor and product owner approved the problem, scope and success measures. | Done | TBD | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T19:10:54.875Z |
| G3-02 | The Greenfield/Brownfield × On-prem/Cloud path is recorded (including mixed/hybrid logic where needed). | Done | TBD | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T19:10:54.875Z |
| G3-03 | Source-to-target migration direction is explicit, or `N/A` with reason. | Done | TBD | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T19:10:54.875Z |
| G3-04 | Every critical journey has measurable capacity and performance outcomes, including measurement methodology. | Done | TBD | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T19:10:54.875Z |
| G3-05 | Availability, RTO, RPO, data correctness and tolerated failure scopes have business approval. | Done | TBD | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T19:10:54.875Z |
| G3-06 | Security/privacy/legal/data residency requirements are mapped to owners and feasibility checked. | Done | TBD | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T19:10:54.875Z |
| G3-07 | Integration/dependency graph and network boundary assumptions are validated. | Done | TBD | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T19:10:54.875Z |
| G3-08 | Cost and delivery envelopes, operating model and team capability have owners. | Done | TBD | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T19:10:54.875Z |
| G3-09 | For brownfield, baseline metrics, inventory, constraints and major defects are evidenced. | N/A | Greenfield (HDR-07): there is no existing estate. | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T19:10:54.875Z |
| G3-10 | For migrations, per-workload 7R, dependency waves, data path, fallback and no-return point are documented. | N/A | No migration overlay (HDR-10 none). | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T19:10:54.875Z |
| G3-11 | All hard-constraint conflicts and high risks have been closed or formally accepted by an empowered owner. | Done | TBD | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T19:10:54.875Z |
| G3-12 | The option comparison, recommended path, rationale, open PoCs and proposed ADRs are recorded. | Done | TBD | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T19:10:54.875Z |
| G3-13 | SDD acceptance-test matrix and responsibilities are established. | Done | TBD | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T19:10:54.875Z |
| G3-14 | Required approvals, dates, conditions and next-review trigger are captured. | Done | TBD | Fixture: Product Owner stand-in (test-run policy) | 2026-10-27T19:10:54.875Z |

**Sign-off register**

| Role | Name | Decision | At | Comments |
|---|---|---|---|---|
| Business sponsor | Stand-in: Approver (test-run policy, set by Product Owner (fixture owner), 2026-10-27) | Approved with conditions | 2026-10-27T19:11:07.918Z | Not counted, stand-in |
| Product owner / business process owner | Stand-in: Approver (test-run policy, set by Product Owner (fixture owner), 2026-10-27) | Approved with conditions | 2026-10-27T19:11:08.860Z | Not counted, stand-in |
| Lead / principal architect | Stand-in: Approver (test-run policy, set by Product Owner (fixture owner), 2026-10-27) | Approved with conditions | 2026-10-27T19:11:09.741Z | Not counted, stand-in |
| Infrastructure / platform owner | Stand-in: Approver (test-run policy, set by Product Owner (fixture owner), 2026-10-27) | Approved with conditions | 2026-10-27T19:11:10.601Z | Not counted, stand-in |
| Network owner | Stand-in: Approver (test-run policy, set by Product Owner (fixture owner), 2026-10-27) | Approved with conditions | 2026-10-27T19:11:11.471Z | Not counted, stand-in |
| Security and privacy/compliance | Stand-in: Approver (test-run policy, set by Product Owner (fixture owner), 2026-10-27) | Approved with conditions | 2026-10-27T19:11:12.344Z | Not counted, stand-in |
| Data owner | Stand-in: Approver (test-run policy, set by Product Owner (fixture owner), 2026-10-27) | Approved with conditions | 2026-10-27T19:11:13.283Z | Not counted, stand-in |
| SRE / operations | Stand-in: Approver (test-run policy, set by Product Owner (fixture owner), 2026-10-27) | Approved with conditions | 2026-10-27T19:11:14.189Z | Not counted, stand-in |
| Finance / procurement | Stand-in: Approver (test-run policy, set by Product Owner (fixture owner), 2026-10-27) | Approved with conditions | 2026-10-27T19:11:15.057Z | Not counted, stand-in |
| Architecture review authority | Stand-in: Approver (test-run policy, set by Product Owner (fixture owner), 2026-10-27) | Approved with conditions | 2026-10-27T19:11:15.930Z | Not counted, stand-in |

**Conditions**

| ID | Condition | Owner | Due |
|---|---|---|---|
| COND-01 | CardPay Ltd confirms in writing that it refunds branch card purchases to the original card, before the SDD fixes the payout integration. | Refunds and Loyalty Product Owner | 2026-12-15 |

**Exceptions**

| ID | Entry | Reason | Granted by | Expires | Review | Valid |
|---|---|---|---|---|---|---|
| EXC-01 | SEC-01.1 | The applicable data-protection law is a hard BRD dependency needed before go-live (REFUNDS 02 and LOYALTY 02 Dependencies), not before the SDD; the SDD may start while Legal Counsel confirms it by 2026-12-15. | Product Owner (fixture owner) | 2027-12-31 | 2027-03-31 | yes |

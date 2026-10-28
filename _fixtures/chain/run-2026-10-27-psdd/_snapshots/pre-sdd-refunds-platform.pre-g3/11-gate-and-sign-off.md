<!--
CHUNK: 11
TITLE: Gate and Sign-off
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: 03a-10
PART OF: Pre-SDD - Refunds Platform
-->

# 11. Gate and Sign-off

## 11.1 Gate Result

<!-- ENGINE-FRAGMENT: 11-gate.md -->
| Gate | Result | Missing |
|---|---|---|
| G0 Initiate | Met | None |
| G1 Discover | Met | None |
| G2 Assess | shortlist | None |
| G3 Approve | Not signed | Business sponsor has not signed.; Product owner / business process owner has not signed.; Lead / principal architect has not signed.; Infrastructure / platform owner has not signed.; Network owner has not signed.; Security and privacy/compliance has not signed.; Data owner has not signed.; SRE / operations has not signed.; Finance / procurement has not signed.; Architecture review authority has not signed.; G3-01 is Open: A named business sponsor and product owner approved the problem, scope and success measures.; G3-02 is Open: The Greenfield/Brownfield × On-prem/Cloud path is recorded (including mixed/hybrid logic where needed).; G3-03 is Open: Source-to-target migration direction is explicit, or `N/A` with reason.; G3-04 is Open: Every critical journey has measurable capacity and performance outcomes, including measurement methodology.; G3-05 is Open: Availability, RTO, RPO, data correctness and tolerated failure scopes have business approval.; G3-06 is Open: Security/privacy/legal/data residency requirements are mapped to owners and feasibility checked.; G3-07 is Open: Integration/dependency graph and network boundary assumptions are validated.; G3-08 is Open: Cost and delivery envelopes, operating model and team capability have owners.; G3-09 is Open: For brownfield, baseline metrics, inventory, constraints and major defects are evidenced.; G3-10 is Open: For migrations, per-workload 7R, dependency waves, data path, fallback and no-return point are documented.; G3-11 is Open: All hard-constraint conflicts and high risks have been closed or formally accepted by an empowered owner.; G3-12 is Open: The option comparison, recommended path, rationale, open PoCs and proposed ADRs are recorded.; G3-13 is Open: SDD acceptance-test matrix and responsibilities are established.; G3-14 is Open: Required approvals, dates, conditions and next-review trigger are captured. |

**Gate label:** G2

**Authorized to start the SDD:** No

**G3 checklist**

| Line | Text | Status | Reason (N/A) | Ticked by | At |
|---|---|---|---|---|---|
| G3-01 | A named business sponsor and product owner approved the problem, scope and success measures. | Open | TBD | TBD | TBD |
| G3-02 | The Greenfield/Brownfield × On-prem/Cloud path is recorded (including mixed/hybrid logic where needed). | Open | TBD | TBD | TBD |
| G3-03 | Source-to-target migration direction is explicit, or `N/A` with reason. | Open | TBD | TBD | TBD |
| G3-04 | Every critical journey has measurable capacity and performance outcomes, including measurement methodology. | Open | TBD | TBD | TBD |
| G3-05 | Availability, RTO, RPO, data correctness and tolerated failure scopes have business approval. | Open | TBD | TBD | TBD |
| G3-06 | Security/privacy/legal/data residency requirements are mapped to owners and feasibility checked. | Open | TBD | TBD | TBD |
| G3-07 | Integration/dependency graph and network boundary assumptions are validated. | Open | TBD | TBD | TBD |
| G3-08 | Cost and delivery envelopes, operating model and team capability have owners. | Open | TBD | TBD | TBD |
| G3-09 | For brownfield, baseline metrics, inventory, constraints and major defects are evidenced. | Open | TBD | TBD | TBD |
| G3-10 | For migrations, per-workload 7R, dependency waves, data path, fallback and no-return point are documented. | Open | TBD | TBD | TBD |
| G3-11 | All hard-constraint conflicts and high risks have been closed or formally accepted by an empowered owner. | Open | TBD | TBD | TBD |
| G3-12 | The option comparison, recommended path, rationale, open PoCs and proposed ADRs are recorded. | Open | TBD | TBD | TBD |
| G3-13 | SDD acceptance-test matrix and responsibilities are established. | Open | TBD | TBD | TBD |
| G3-14 | Required approvals, dates, conditions and next-review trigger are captured. | Open | TBD | TBD | TBD |

**Sign-off register**

| Role | Name | Decision | At | Comments |
|---|---|---|---|---|
| Business sponsor | TBD | Not signed | TBD | Not counted |
| Product owner / business process owner | TBD | Not signed | TBD | Not counted |
| Lead / principal architect | TBD | Not signed | TBD | Not counted |
| Infrastructure / platform owner | TBD | Not signed | TBD | Not counted |
| Network owner | TBD | Not signed | TBD | Not counted |
| Security and privacy/compliance | TBD | Not signed | TBD | Not counted |
| Data owner | TBD | Not signed | TBD | Not counted |
| SRE / operations | TBD | Not signed | TBD | Not counted |
| Finance / procurement | TBD | Not signed | TBD | Not counted |
| Architecture review authority | TBD | Not signed | TBD | Not counted |

**Conditions**

None.

**Exceptions**

| ID | Entry | Reason | Granted by | Expires | Review | Valid |
|---|---|---|---|---|---|---|
| EXC-01 | SEC-01.1 | The applicable data-protection law is a hard BRD dependency needed before go-live (REFUNDS 02 and LOYALTY 02 Dependencies), not before the SDD; the SDD may start while Legal Counsel confirms it by 2026-12-15. | Product Owner (fixture owner) | 2027-12-31 | 2027-03-31 | yes |
<!-- /ENGINE-FRAGMENT -->

## 11.2 SDD Initiation Authorized By

**SDD initiation authorized by:** Not authorized: G3 Not signed; see § 11.1

<!-- MASTER: refunds-platform-pre-sdd-master.md | PREV: 10-validation-risks-unknowns.md | NEXT: 12-sdd-handoff-guide.md -->

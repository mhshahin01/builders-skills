<!--
CHUNK: 09
TITLE: Decisions
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: 03a-03h, 04, 05, 07
PART OF: Pre-SDD - Refunds Platform
-->

# 9. Decisions

## 9.1 Requirement-to-Consequence Trace

| Requirements | Issue | Consequence for the shape | ADR | SDD sections | Validation evidence |
|--------------|-------|---------------------------|-----|--------------|---------------------|
| REL-01, REL-03, REL-05 | Fault domains; active against passive recovery | Two failure scopes: zone loss is covered by local high availability inside the primary region (REL-05.2, REL-03.2); region loss by a pilot-light recovery region (REL-05.1, REL-03.1) | ADR-DR-001 | §8.6, §11, §18.5, §19, §20 | Failover exercise for each scope |
| REL-04, DAT-05 | Synchronous against asynchronous replication | Strong consistency inside the primary region (DAT-05.1, DAT-05.2); asynchronous replication to the zone standby and to the recovery region, because neither REL-04.1 nor REL-04.2 is 0 | ADR-DATA-001 | §8.6, §11, §18.5 | RPO and integrity test per scope |
| ECO-01, ECO-06, BUS-07 | Hosting placement | Provider-hosted cloud with no provider as a hard constraint (HDR-08.1), within the European Union (DAT-04.1), inside the ECO-01.1 envelope | ADR-PLATFORM-001 (hosting part) | Q8, §8.3, §8.6 | Compliance and TCO validation |
| CAP-01, CAP-04, CAP-07 | Workload processing model | Driver for the SDD: low peak rates (CALC-02, CALC-03) with a seasonal factor (CAP-04.1) and one P99 budget for the screens (CAP-07.1, CAP-07.2) | ADR-PERF-001 (SDD) | Q3, §18 | Peak and burst p99 test |
| INT-02, INT-04, INT-05 | Integration reliability | Driver for the SDD: payouts tried again, outcomes kept and sent later, each paid refund taken back once, take-backs within 1 hour | ADR-INT-001 (SDD) | §6 Notes, §8.3 | Fault and replay tests |
| SEC-02, DAT-07 | Identity and tenancy | Driver for the SDD: customer, branch manager, staff and member identities, with the identity method open (QD-06) and the tenancy model open (DAT-07.1) | ADR-IAM-001 (SDD) | Q7, §11 | Isolation and access tests |

## 9.2 Decision Tree

| Rule | Observable condition (Standard § 9.3) | Outcome here | Evidence |
|------|---------------------------------------|--------------|----------|
| DT-01 | Business outcome or owner missing | Not triggered: BUS-01.1 and HDR-02.1 hold values | BUS-01.1, HDR-02.1 |
| DT-02 | User-facing p99 not defined for a latency-critical journey | Not triggered: every CAP-07 entry holds a p99 | CAP-07.1, CAP-07.2 |
| DT-03 | RPO or RTO unknown for critical data or function | Not triggered: each named failure scope holds an RTO and an RPO | REL-05.1, REL-05.2, REL-03.1, REL-03.2, REL-04.1, REL-04.2 |
| DT-04 | Hard residency or compliance restriction excludes an option | Not triggered: both options keep both regions within the European Union; no option is excluded; SEC-01.1 is Open under EXC-01 | DAT-04.1, SEC-01.1, OPT-01, OPT-02 |
| DT-05 | Expected peak exceeds proven capacity | Not triggered: greenfield, no proven capacity to exceed; the peak comes from the calculations and the seasonal load is tested before go-live | CALC-02, CALC-03, OPS-08.1 |
| DT-06 | Tight latency between components would span sites or clouds | Not triggered: one primary region serves; the recovery region is reached only after a declared failover | HDR-08.1, REL-05.1 |
| DT-07 | Target must survive a stated fault domain | Applied: independent failure domains, local high availability for scope az and a recovery region for scope region | REL-05.1, REL-05.2, DR-03@region |
| DT-08 | RPO implies stringent consistency | Applied: replication trade-off in ADR-DATA-001; asynchronous replication, since no RPO is 0 | REL-04.1, REL-04.2, DAT-05.1, DAT-05.2 |
| DT-09 | Target needs unsupported technology or licensing | Not triggered: greenfield, no technology is imposed on the shape | HDR-07.1 |
| DT-10 | Costs, lead times, quotas, or skills violate limits | Applied: each option's TCO read beside the budget envelope; both sit inside it; partner quotas and team skills stay open | ECO-01.1, CALC-21@OPT-01, CALC-21@OPT-02, INT-03.1, OPS-02.1 |
| DT-11 | Migration destination differs from source | Not triggered: no migration overlay | HDR-10.1 |
| DT-12 | A critical decision has more than one viable option | Applied: ADR-DR-001 compares OPT-01 and OPT-02 against the approved weights | OPT-01, OPT-02, CALC-22@OPT-01, CALC-22@OPT-02 |
| DT-13 | Only one feasible option exists | Not triggered: two options pass the hard checks | OPT-01, OPT-02 |
| DT-14 | Mandatory security or DR acceptance cannot be tested | Not triggered: each scope's recovery can be exercised; the verification is in the evidence column of § 9.1 | § 9.1, OPS-08.1 |
| DT-15 | Open high-severity risks not approved | Not triggered: no other blocker and no conflict remain; G3-11 is the formal acceptance at the G3 stop | Chunk 10, chunk 11 |

## 9.3 Rule Trace

<!-- ENGINE-FRAGMENT: 09-rule-trace.md -->
| Rule | Title | Trigger | Assessment | Verification | Rows |
|---|---|---|---|---|---|
| ARCH-01 | Classification & hosting | change=greenfield; target=cloud | Route to GF-CL; migration is a separate overlay. | Confirm target-hosting responsibility and hard platform restrictions. | HDR-07, HDR-08 |
| DR-03@region | Independent region/provider failure | failure scope=region | Assess independent recovery locations plus identity, data, DNS, networks and application dependencies. | Prove full service recovery and RPO after the specified failure scenario. | REL-03, REL-04, REL-05 |
| LOAD-04 | Workload-based capacity planning | peak=0.07 TPS; 0.23 API RPS | Size and benchmark at sustained peak with headroom and failure-mode capacity. | Obtain peak duration, load profile, per-instance P99 throughput, storage IOPS and growth. | CAP-01, CAP-04 |
| DATA-08@az | Near-real-time recovery data | RPO=5 s | Measure replication lag/backup point age against scoped dataset and failure. | Exercise writer failure and measure committed-record recovery point. | REL-04 |
| DB-10 | Per-workload data architecture | type=relational; consistency=strong | Recommend logical data-store pattern; compare provider products and failover semantics. | Validate operations, constraints and benchmarks per workload. | DAT-01, DAT-05 |
| SEC-11 | Data sensitivity/residency | classification=sensitive; geographic restrictions=yes | Cloud regions, DR copies, data transfers, encryption and access must satisfy applicable controls. | Obtain compliance authority, permitted locations, data lineage and control evidence. | DAT-03, DAT-04 |
| SLO-15@region | One outage can consume SLO budget | RTO=4 h; 30-day budget=43.2 min | One full-length, user-visible outage in the measurement window may exceed the availability allowance; not inherently contradictory. | Clarify measurement exclusions and design impact on customer journeys. | REL-01, REL-03 |
<!-- /ENGINE-FRAGMENT -->

## 9.4 Pre-SDD ADRs

### ADR-DR-001: Resilience topology

- **Status:** Proposed (accepted by the G3 sign-off, chunk 11)
- **Owner / reviewers / decision date:** Lead Architect, Retail IT (HDR-04.1) / Architecture Review Board (HDR-05.1) / 2026-10-27
- **Requirement links:** REL-01.1, REL-01.2, REL-03.1, REL-03.2, REL-04.1, REL-04.2, REL-05.1, REL-05.2
- **Business context:** refunds and points must survive the loss of one zone with little interruption and the loss of a whole region within hours, without losing a refund decision or a payout ([REFUNDS/NFR-01](../brd-refunds-portal/10-nfrs.md#non-functional-requirements), [REFUNDS/NFR-02](../brd-refunds-portal/10-nfrs.md#non-functional-requirements)).
- **Hard constraints and agreed targets:** DAT-04.1 (both locations within the European Union); REL-03.1, REL-03.2, REL-04.1, REL-04.2 and REL-05.1, REL-05.2, all Confirmed.
- **Options considered:** OPT-01, one primary region with a pilot-light recovery region; OPT-02, one primary region with a warm-standby recovery region.
- **Evidence:** CALC-13, CALC-14, CALC-15; rules DR-03@region, DATA-08@az, SLO-15@region; CALC-21 and CALC-22 per option.
- **Option comparison:** both share the primary region with local high availability across zones. Infrastructure: OPT-01 keeps a minimal recovery footprint; OPT-02 keeps a running standby. Network: both need a recovery ingress and failover routing. Data: both replicate asynchronously to the recovery region. Security: the same controls and keys in both regions. Reliability: OPT-02 recovers faster than OPT-01; both meet REL-03.1. Operations: OPT-01 needs a practised scale-up runbook; OPT-02 needs two environments kept in step. TCO: OPT-01 is lower (CALC-21). Reversibility: OPT-01 can step up to OPT-02.
- **Decision and rationale:** topology regional, a primary region and an independent recovery region; scope az: local high availability; scope region: pilot light, as chunk 05 states. OPT-01 is chosen for its higher weighted score under the approved weights and its lower TCO, and it meets REL-03.1 and REL-04.1 for scope region.
- **Consequences and residual risks:** recovery from a region loss needs a scale-up that is not yet proven (risk R1, chunk 10).
- **Assumptions and confidence:** the recovery region can be scaled up inside REL-03.1; medium confidence until a drill proves it.
- **Conditions and review trigger:** a failed recovery drill, or a lower REL-03.1, reopens the decision.
- **SDD sections affected / verification:** §8.6, §11, §18.5, §19, §20 / Failover exercise for scope az and scope region.

### ADR-DATA-001: Data replication and consistency

- **Status:** Proposed (accepted by the G3 sign-off, chunk 11)
- **Owner / reviewers / decision date:** Data Owner, Retail Finance / Lead Architect, Retail IT; Architecture Review Board / 2026-10-27
- **Requirement links:** REL-04.1, REL-04.2, DAT-01.1, DAT-01.2, DAT-05.1, DAT-05.2
- **Business context:** a refund decision and its payout change together and are never lost or paid twice; every points movement follows the points rules ([REFUNDS/NFR-01](../brd-refunds-portal/10-nfrs.md#non-functional-requirements), [LOYALTY/NFR-01](../brd-loyalty-points/10-nfrs.md#non-functional-requirements)).
- **Hard constraints and agreed targets:** REL-04.1 and REL-04.2 (Confirmed, neither 0); DAT-05.1 and DAT-05.2 strong; DAT-04.1 residency.
- **Options considered:** synchronous replication against asynchronous replication, for the zone standby and for the recovery region, per workload.
- **Evidence:** CALC-15; rules DATA-08@az and DB-10.
- **Option comparison:** synchronous replication to the recovery region would add cross-region write latency to every refund and points write without being needed, since REL-04.1 is not 0; asynchronous replication keeps writes local and accepts the bounded loss of REL-04.1. Inside the region, REL-04.2 allows asynchronous replication with a lag measured against it.
- **Decision and rationale:** both workloads are relational and strongly consistent inside the primary region; replication to the zone standby and to the recovery region is asynchronous, as chunk 05 states.
- **Consequences and residual risks:** a region loss can lose up to REL-04.1 of writes, rebuilt from payout results and purchase records; the replication lag must be measured (risk R1).
- **Assumptions and confidence:** the payment provider's payout results and the point-of-sale records allow lost minutes to be rebuilt; medium confidence.
- **Conditions and review trigger:** an RPO of 0 for any scope, or a stricter REL-04.2, reopens the decision.
- **SDD sections affected / verification:** §8.6, §11, §18.5 / RPO and integrity test per scope.

### ADR-PLATFORM-001: Hosting choice (hosting part)

- **Status:** Proposed (accepted by the G3 sign-off, chunk 11)
- **Owner / reviewers / decision date:** Lead Architect, Retail IT / Architecture Review Board; Finance Director (HDR-06.1) / 2026-10-27
- **Requirement links:** HDR-08.1, ECO-01.1, ECO-02.1, ECO-06.1, BUS-07.1, DAT-04.1
- **Business context:** a new system with no estate to reuse, and a preference for operating expense (ECO-02.1).
- **Hard constraints:** DAT-04.1 (within the European Union); BUS-07.1 (payouts to the original card, the non-goals); SEC-01.1 Open under EXC-01. No provider is a hard constraint.
- **Options considered:** both options are cloud-hosted (OPT-01, OPT-02); the cloud target was given at classification (HDR-08.1), so no other placement is compared.
- **Evidence:** CALC-21@OPT-01, CALC-21@OPT-02, CALC-22@OPT-01, CALC-22@OPT-02; rule ARCH-01.
- **Option comparison:** the placements share the cloud target; they differ only in the recovery shape (ADR-DR-001).
- **Decision and rationale:** provider-hosted cloud, as chunk 05 states, within the European Union.
- **Left to the SDD:** the provider when not constrained, managed or self-managed, and the products.
- **Consequences and residual risks:** exit portability (ECO-06.1) is open.
- **Assumptions and confidence:** the applicable data-protection law (QD-02) allows cloud hosting within the European Union; medium confidence until Legal Counsel confirms it.
- **Conditions and review trigger:** the answer to QD-02 reopens the decision if it restricts the hosting.
- **SDD sections affected / verification:** Q8, §8.3, §8.6 / Compliance and TCO validation.

## 9.5 SDD ADRs Driven by This Pre-SDD

| SDD ADR | Decides | Driving answers |
|---------|---------|-----------------|
| ADR-PERF-001 Workload processing model | Synchronous or queued processing; compute, cache, and store strategy | CAP-01.1, CAP-01.2, CAP-03.1, CAP-04.1, CAP-07.1, CAP-07.2, CALC-02, CALC-03 (all Confirmed or computed); CAP-03.1 is read by no calculation (risk R7, chunk 10) |
| ADR-INT-001 Integration reliability | The mechanism: broker, outbox, deduplication, or synchronous calls | INT-02.1, INT-04.1, INT-05.1 (Confirmed); INT-03.1 to INT-03.3 (Open) |
| ADR-IAM-001 Identity and tenancy | The identity product, the authorization model, and the schema strategy within the isolation level | SEC-02.1 (Confirmed, identity method open: QD-06); DAT-07.1 (Open) |

<!-- MASTER: refunds-platform-pre-sdd-master.md | PREV: 07-options-and-economics.md | NEXT: 10-validation-risks-unknowns.md -->

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
| REL-01, REL-03, REL-05 | Fault domains; active against passive recovery | Two failure scopes: local HA across zones for the zone scope (REL-03.2) and a pilot-light recovery region for the region scope (REL-03.1); a primary with an independent recovery location | ADR-DR-001 | §8.6, §11, §18.5, §19, §20 | Failover exercise for each scope |
| REL-04, DAT-05 | Synchronous against asynchronous replication | Asynchronous replication across zones within REL-04.2 and to the recovery region within REL-04.1; both workloads strongly consistent in the primary (DAT-05.1, DAT-05.2) | ADR-DATA-001 | §8.6, §11, §18.5 | RPO and integrity test per scope |
| ECO-01, ECO-06, BUS-07 | Hosting placement | Cloud, provider-hosted, no provider as a hard constraint (HDR-08.1); both locations within the European Union (DAT-04.1); exit expectations ECO-06.1 are Open | ADR-PLATFORM-001 (hosting part) | Q8, §8.3, §8.6 | Compliance and TCO validation |
| CAP-01, CAP-04, CAP-07 | Workload processing model | Small interactive load with a seasonal burst (CALC-02, CALC-03, CAP-04.1); P99 targets CAP-07.1 and CAP-07.2 at the ingress edge | ADR-PERF-001 (SDD) | Q3, §18 | Peak and burst p99 test |
| INT-02, INT-04, INT-05 | Integration reliability | Refund outcomes reach Loyalty Points once each and are kept until it starts; payout retries; receipt lookup failure handled without blame on the customer | ADR-INT-001 (SDD) | §6 Notes, §8.3 | Fault and replay tests |
| SEC-02, DAT-07 | Identity and tenancy | Customers, branch managers, staff and members each see only their own scope (SEC-02.1); the tenancy level DAT-07.1 is Open | ADR-IAM-001 (SDD) | Q7, §11 | Isolation and access tests |

## 9.2 Decision Tree

| Rule | Observable condition (Standard § 9.3) | Outcome here | Evidence |
|------|---------------------------------------|--------------|----------|
| DT-01 | Business outcome or owner missing | Not triggered: no DT-01-STOP finding | BUS-01.1, HDR-02.1 |
| DT-02 | User-facing p99 not defined for a latency-critical journey | Not triggered: no DT-02-BLOCK finding; every CAP-07 entry holds a p99 | CAP-07.1, CAP-07.2 |
| DT-03 | RPO or RTO unknown for critical data or function | Not triggered: no DT-03-BLOCK finding; both scopes hold an RTO and an RPO | REL-03.1, REL-03.2, REL-04.1, REL-04.2, REL-05.1, REL-05.2 |
| DT-04 | Hard residency or compliance restriction excludes an option | Not triggered: no option breaks a hard entry; RESIDENCY-region does not fire because both locations are given | DAT-04.1, SEC-01.1 (EXC-01), OPT-01, OPT-02, chunk 07 § 7.2 |
| DT-05 | Expected peak exceeds proven capacity | Not triggered: greenfield, no proven capacity to exceed; the peak is small and the SDD load test proves it | CALC-02, CALC-03, CALC-04 |
| DT-06 | Tight latency between components would span sites or clouds | Not triggered: one primary region; the only cross-boundary calls are to external partners, whose latencies are Open | INT-03.1 to INT-03.3 (Open) |
| DT-07 | Target must survive a stated fault domain | Applied: independent failure domains per scope, local HA for az and a pilot-light recovery region for region | REL-05.1, REL-05.2, chunk 05 § 5.1 |
| DT-08 | RPO implies stringent consistency | Applied: asynchronous replication for both scopes, recorded in ADR-DATA-001; no RPO of zero, so no CONFLICT-rpo0 | REL-04.1, REL-04.2, DAT-05.1, DAT-05.2 |
| DT-09 | Target needs unsupported technology or licensing | Not triggered: greenfield; the parked technical inputs of REFUNDS 12 are left to the SDD | REFUNDS 12 TI-01, TI-02 |
| DT-10 | Costs, lead times, quotas, or skills violate limits | Applied: each option's TCO read against the budget envelope; both fit; lead times and skills are Open | ECO-01.1, CALC-21@OPT-01, CALC-21@OPT-02, OPS-02.1 (Open) |
| DT-11 | Migration destination differs from source | Not triggered: no migration overlay (HDR-10.1 none) | HDR-10.1 |
| DT-12 | A critical decision has more than one viable option | Applied: ADR-DR-001 compares OPT-01 and OPT-02 with approved weights | OPT-01, OPT-02, CALC-22@OPT-01, CALC-22@OPT-02 |
| DT-13 | Only one feasible option exists | Not triggered: two feasible options | OPT-01, OPT-02 |
| DT-14 | Mandatory security or DR acceptance cannot be tested | Not triggered at this gate: production acceptance is after the SDD; the drill frequency and evidence (REL-09.1) and the test scope (OPS-08.1) carry the verification, and G3-13 asks for the acceptance matrix | REL-09.1 (Open), OPS-08.1 |
| DT-15 | Open high-severity risks not approved | Not triggered: no DT-15-BLOCK finding; the open hard entry SEC-01.1 passes under EXC-01. The high-impact risks R-01 to R-04 of chunk 10 § 10.2 are not yet accepted: G3-11 (Open) asks an empowered owner to accept or close them at the sign-off | Chunk 10, chunk 11 |

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
- **Requirement links:** REL-01.1, REL-01.2, REL-03.1, REL-03.2, REL-04.1, REL-04.2, REL-05.1, REL-05.2, REL-10.1
- **Business context:** customers and members use the platform at any time (REFUNDS/NFR-02, LOYALTY/NFR-04), and refund money is never lost or paid twice (REFUNDS/NFR-01). The platform must recover from the loss of one zone and the loss of a whole region.
- **Hard constraints and agreed targets:** DAT-04.1 (both locations within the European Union), Confirmed; REL-01.1, REL-01.2, REL-03.1, REL-03.2, REL-04.1, REL-04.2, REL-05.1, REL-05.2, Confirmed.
- **Options considered:** OPT-01, one primary region with a pilot-light recovery region; OPT-02, one primary region with a warm-standby recovery region. Both use local HA across zones for the zone scope.
- **Evidence:** rules DR-03@region, DATA-08@az, SLO-15@region (§ 9.3); CALC-13, CALC-14, CALC-15 (chunk 04); CALC-21 and CALC-22 per option (chunk 07).
- **Option comparison:** infrastructure, OPT-01 keeps only data and an idle environment in the recovery region, OPT-02 keeps scaled-down compute running; network, the same public ingress and recovery route for both; software and data, the same, with asynchronous replication; security, the same controls in both regions; reliability, OPT-02 recovers with more margin inside REL-03.1, OPT-01 meets it after the environment starts; operations, OPT-01 has one running region, OPT-02 two; TCO, CALC-21@OPT-01 is the lower; migration, none; reversibility, OPT-01 moves to a warm standby by adding capacity.
- **Decision and rationale:** the topology is a primary with an independent recovery location (regional); scope region uses a pilot light and scope az uses local HA, as chunk 05 § 5.1 states. OPT-01 is chosen because it has the higher weighted score under the approved weights (CALC-22@OPT-01) and meets REL-03.1 and REL-04.1 for scope region at the lower TCO.
- **Consequences and residual risks:** the recovery region must be started and verified within REL-03.1, which only a drill proves (R-05); one region recovery at REL-03.1 can exceed the monthly availability budget (R-01).
- **Assumptions and confidence:** the recovery environment can start within REL-03.1; medium confidence until the first drill (REL-09.1 Open).
- **Conditions and review trigger:** reopened when REL-03.1 or REL-04.1 tightens, when the business decides a region loss must stay inside REFUNDS/NFR-02 (R-01), or when a drill misses REL-03.1; then OPT-02 is the fallback.
- **SDD sections affected / verification:** §8.6, §11, §18.5, §19, §20 / Failover exercise per scope

### ADR-DATA-001: Data replication and consistency

- **Status:** Proposed (accepted by the G3 sign-off, chunk 11)
- **Owner / reviewers / decision date:** Data Owner, Retail Finance / Lead Architect, Retail IT; Architecture Review Board / 2026-10-27
- **Requirement links:** REL-04.1, REL-04.2, DAT-01.1, DAT-01.2, DAT-05.1, DAT-05.2, REL-10.1
- **Business context:** a refund decision and its payout result change the request together, and refund money is never lost or paid twice (REFUNDS/NFR-01); every points movement follows the points rules (LOYALTY/NFR-01).
- **Hard constraints and agreed targets:** DAT-03.1, DAT-04.1, DAT-06.1, Confirmed; REL-04.1, REL-04.2, Confirmed.
- **Options considered:** synchronous or asynchronous replication, per scope, for both workloads (refund requests with decisions and payouts; the points ledger).
- **Evidence:** CALC-15; rules DATA-08@az, DB-10 (§ 9.3).
- **Option comparison:** synchronous replication would give a zero recovery point at the cost of write latency on every commit and of availability when the replica is unreachable; asynchronous replication keeps writes local and loses at most the replication lag. REL-04.2 and REL-04.1 are above zero for every scope, so neither workload needs synchronous replication.
- **Decision and rationale:** both workloads are relational and strongly consistent in the primary location, with asynchronous replication across zones within REL-04.2 and to the recovery region within REL-04.1, as chunk 05 § 5.1 states.
- **Consequences and residual risks:** the transactions inside the recovery point of a region loss (CALC-15) are rebuilt from payout results and point-of-sale records; the replication lag must be measured against REL-04.1 and REL-04.2.
- **Assumptions and confidence:** payout results can be read back from the payment provider after a region loss; to be confirmed with CardPay Ltd (QD-04).
- **Conditions and review trigger:** reopened when an RPO reaches zero or when CardPay Ltd cannot report payout results again.
- **SDD sections affected / verification:** §8.6, §11, §18.5 / RPO and integrity test

### ADR-PLATFORM-001: Hosting choice (hosting part)

- **Status:** Proposed (accepted by the G3 sign-off, chunk 11)
- **Owner / reviewers / decision date:** Lead Architect, Retail IT / Architecture Review Board; Finance Director / 2026-10-27
- **Requirement links:** HDR-08.1, ECO-01.1, ECO-02.1, ECO-06.1, BUS-07.1, DAT-04.1
- **Business context:** a new platform with no existing estate (HDR-07.1, HDR-09.1), an operating-expense preference in EUR (ECO-02.1), and a one-time and monthly budget (ECO-01.1).
- **Hard constraints:** DAT-04.1 (within the European Union), BUS-07.1 (payouts to the original card only); SEC-01.1 Open under EXC-01.
- **Options considered:** cloud is the intended target (HDR-08.1, kind target); OPT-01 and OPT-02 are both cloud placements.
- **Evidence:** CALC-21@OPT-01, CALC-21@OPT-02, CALC-22@OPT-01, CALC-22@OPT-02; rule ARCH-01.
- **Option comparison:** both options share the hosting; they differ only in the recovery strategy for the region scope (ADR-DR-001).
- **Decision and rationale:** the hosting target is cloud, provider-hosted public cloud, with no provider as a hard constraint, as chunk 05 § 5.1 states.
- **Left to the SDD:** the provider when not constrained, managed or self-managed, and the products.
- **Consequences and residual risks:** a new third-party service needs the product owner's approval before a design adopts it (project rule); exit expectations (ECO-06.1) are Open.
- **Assumptions and confidence:** a provider can offer two regions within the European Union; high confidence.
- **Conditions and review trigger:** reopened when SEC-01.1 or DAT-04.1 restricts the placement further.
- **SDD sections affected / verification:** Q8, §8.3, §8.6 / Compliance and TCO validation

## 9.5 SDD ADRs Driven by This Pre-SDD

| SDD ADR | Decides | Driving answers |
|---------|---------|-----------------|
| ADR-PERF-001 Workload processing model | Synchronous or queued processing; compute, cache, and store strategy | CAP-01.1, CAP-01.2, CAP-03.1, CAP-04.1, CAP-07.1, CAP-07.2, CAP-08.1, CALC-02, CALC-03, CALC-04 (Confirmed); CAP-05.1, CAP-10.1 (Open) |
| ADR-INT-001 Integration reliability | The mechanism: broker, outbox, deduplication, or synchronous calls | INT-02.1, INT-04.1, INT-05.1 (Confirmed); INT-03.1 to INT-03.3 (Open) |
| ADR-IAM-001 Identity and tenancy | The identity product, the authorization model, and the schema strategy within the isolation level | SEC-02.1, SEC-07.1 (Confirmed); DAT-07.1 (Open) |

<!-- MASTER: refunds-platform-pre-sdd-master.md | PREV: 07-options-and-economics.md | NEXT: 10-validation-risks-unknowns.md -->

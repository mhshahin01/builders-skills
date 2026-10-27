<!--
CHUNK: 09
TITLE: Decisions
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: 03a-03h, 04, 05, 07
PART OF: Pre-SDD - [Project Name]
-->

# 9. Decisions

<!-- The Pre-SDD records the problem and the constraints; an ADR records the choice and why; the SDD describes the implementation (Standard § 10). This chunk states the settled decisions in plain present tense. Who decided, when, and what was offered go in decision-log.md. Shape words only: never a product, a version, or the architecture style. -->

## 9.1 Requirement-to-Consequence Trace

<!-- The Standard's § 10.1 traceability matrix, filled for this project: one row per decision area, with the register entries that drive it (by ID), the architectural issue, the consequence for the shape, the ADR, the SDD sections it lands in (as chunk 12 lists them), and the validation evidence the SDD must produce. Never create an ADR row before the business-approved value it depends on is Confirmed; until then the row names the Open entry. -->

| Requirements | Issue | Consequence for the shape | ADR | SDD sections | Validation evidence |
|--------------|-------|---------------------------|-----|--------------|---------------------|
| REL-01, REL-03, REL-05 | Fault domains; active against passive recovery | [Consequence, citing entry IDs] | ADR-DR-001 | §8.6, §11, §18.5, §19, §20 | Failover exercise |
| REL-04, DAT-05 | Synchronous against asynchronous replication | [Consequence] | ADR-DATA-001 | §8.6, §11, §18.5 | RPO and integrity test |
| ECO-01, ECO-06, BUS-07 | Hosting placement | [Consequence] | ADR-PLATFORM-001 (hosting part) | Q8, §8.3, §8.6 | Compliance and TCO validation |
| CAP-01, CAP-04, CAP-07 | Workload processing model | [Driver for the SDD] | ADR-PERF-001 (SDD) | Q3, §18 | Peak and burst p99 test |
| INT-02, INT-04, INT-05 | Integration reliability | [Driver for the SDD] | ADR-INT-001 (SDD) | §6 Notes, §8.3 | Fault and replay tests |
| SEC-02, DAT-07 | Identity and tenancy | [Driver for the SDD] | ADR-IAM-001 (SDD) | Q7, §11 | Isolation and access tests |

## 9.2 Decision Tree

<!-- The Standard's § 9.3 rules DT-01 to DT-15, one row each, with the outcome in this Pre-SDD. The engine checks DT-01, DT-02, DT-03, DT-11, and DT-15 and reports each STOP or BLOCK as a validation finding (chunk 10): copy the outcome and cite the finding's ID, never restate it from memory. For the other rules, state the architect's response with its evidence. Outcomes: "STOP" or "BLOCK" (with the finding ID), "Applied" (the response taken), or "Not triggered" (why). -->

| Rule | Observable condition (Standard § 9.3) | Outcome here | Evidence |
|------|---------------------------------------|--------------|----------|
| DT-01 | Business outcome or owner missing | [Not triggered / STOP: finding ID] | [Entry IDs] |
| DT-02 | User-facing p99 not defined for a latency-critical journey | [Not triggered / BLOCK: finding ID] | [CAP-07 entries] |
| DT-03 | RPO or RTO unknown for critical data or function | [Not triggered / BLOCK: finding ID] | [REL-03, REL-04, REL-05 entries] |
| DT-04 | Hard residency or compliance restriction excludes an option | [Applied: option removed / Not triggered] | [DAT-04, SEC-01, OPT-NN] |
| DT-05 | Expected peak exceeds proven capacity | [Applied / Not triggered] | [CALC-NN] |
| DT-06 | Tight latency between components would span sites or clouds | [Applied / Not triggered] | [Entry IDs] |
| DT-07 | Target must survive a stated fault domain | [Applied: independent failure domains / Not triggered] | [REL-05 entries] |
| DT-08 | RPO implies stringent consistency | [Applied: replication trade-off in ADR-DATA-001 / Not triggered] | [REL-04, DAT-05] |
| DT-09 | Target needs unsupported technology or licensing | [Applied / Not triggered] | [Entry IDs] |
| DT-10 | Costs, lead times, quotas, or skills violate limits | [Applied / Not triggered] | [ECO entries, CALC-21] |
| DT-11 | Migration destination differs from source | [Not triggered / BLOCK: finding ID / Applied: 7R per workload] | [OVL-04 entries] |
| DT-12 | A critical decision has more than one viable option | [Applied: the ADR compares them] | [OPT-NN] |
| DT-13 | Only one feasible option exists | [Applied: the ADR records the eliminating constraints / Not triggered] | [OPT-NN] |
| DT-14 | Mandatory security or DR acceptance cannot be tested | [BLOCK / Not triggered] | [Verification method of the entries] |
| DT-15 | Open high-severity risks not approved | [Not triggered / BLOCK: finding ID] | [Chunk 10, chunk 11] |

## 9.3 Rule Trace

<!-- The engine renders the recommendation rules that fired, with their IDs, triggers, assessments, verification, and the register rows they cite (fragment `09-rule-trace.md`). Rule IDs keep the Studio's IDs, except LOAD-04 (was CAP-04) and DB-READ-17 (was DB-READ-11). Paste the fragment unchanged between the markers. -->

<!-- ENGINE-FRAGMENT: 09-rule-trace.md -->
| Rule | Title | Trigger | Assessment | Verification | Rows |
|------|-------|---------|------------|--------------|------|
| [Rule ID] | [Title] | [Trigger] | [Candidate] | [Validation] | [Row IDs] |
<!-- /ENGINE-FRAGMENT -->

## 9.4 Pre-SDD ADRs

<!-- The Standard's ADR set splits at the boundary (Pre-SDD settles numbers and shape; the SDD picks products and style). Three ADRs are Pre-SDD decisions: ADR-DR-001, ADR-DATA-001, and the hosting part of ADR-PLATFORM-001. A fourth, ADR-MIG-001, is a Pre-SDD decision only when the migration overlay applies. Each follows the Standard's § 10.2 template, in shape words. An ADR is Proposed until G3 is signed; the G3 sign-off in chunk 11 accepts it, so its Status line does not change at signing. Keep ADRs append-only: a later change supersedes, never silently rewrites. -->

### ADR-DR-001: Resilience topology

- **Status:** Proposed (accepted by the G3 sign-off, chunk 11)
- **Owner / reviewers / decision date:** [Lead architect (HDR-04)] / [Reviewers] / [YYYY-MM-DD]
- **Requirement links:** REL-01, REL-03, REL-05 [and the entries that apply]
- **Business context:** [Why the decision is needed]
- **Hard constraints and agreed targets:** [Entry IDs and their status]
- **Options considered:** [Shapes, for example "one region, multi-AZ" and "two regions, warm standby"; OPT-NN]
- **Evidence:** [CALC-NN, rule IDs, drills]
- **Option comparison:** [Infrastructure, network, software, data, security, reliability, operations, TCO, migration, and reversibility, per option considered, in shape words]
- **Decision and rationale:** [The topology and the DR strategy per failure scope, as chunk 05 states them]
- **Consequences and residual risks:** [Consequences; risks by ID in chunk 10]
- **Assumptions and confidence:** [Assumptions]
- **Conditions and review trigger:** [COND-NN, or the change that reopens it]
- **SDD sections affected / verification:** §8.6, §11, §18.5, §19, §20 / [Failover exercise]

### ADR-DATA-001: Data replication and consistency

- **Status:** Proposed (accepted by the G3 sign-off, chunk 11)
- **Owner / reviewers / decision date:** [Owner] / [Reviewers] / [YYYY-MM-DD]
- **Requirement links:** REL-04, DAT-05 [and the entries that apply]
- **Business context:** [Why]
- **Hard constraints and agreed targets:** [Entry IDs]
- **Options considered:** [Synchronous or asynchronous replication, per workload]
- **Evidence:** [CALC-15, rule IDs]
- **Option comparison:** [The same aspects for synchronous and asynchronous replication, per workload]
- **Decision and rationale:** [The replication shape each RPO needs, per workload, as chunk 05 states it]
- **Consequences and residual risks:** [Write-latency and availability impact]
- **Assumptions and confidence:** [Assumptions]
- **Conditions and review trigger:** [COND-NN, or the change that reopens it]
- **SDD sections affected / verification:** §8.6, §11, §18.5 / [RPO and integrity test]

### ADR-PLATFORM-001: Hosting choice (hosting part)

<!-- Only the hosting part is a Pre-SDD decision: cloud, on-prem, or hybrid, and a named provider only when the business makes it a hard constraint (BUS-07, DAT-04, SEC-01). Managed against self-managed, the provider when it is not constrained, and the products are the SDD's. -->

- **Status:** Proposed (accepted by the G3 sign-off, chunk 11)
- **Owner / reviewers / decision date:** [Owner] / [Reviewers] / [YYYY-MM-DD]
- **Requirement links:** ECO-01, ECO-06, BUS-07, HDR-08 [and the entries that apply]
- **Business context:** [Why]
- **Hard constraints:** [Residency, prohibitions, obligations, by entry ID]
- **Options considered:** [Placements compared; OPT-NN]
- **Evidence:** [CALC-21@OPT-NN, CALC-22@OPT-NN, rule IDs]
- **Option comparison:** [The same aspects for each placement compared, from chunk 07]
- **Decision and rationale:** [The hosting target, as chunk 05 states it]
- **Left to the SDD:** the provider when not constrained, managed or self-managed, and the products.
- **Consequences and residual risks:** [Consequences]
- **Assumptions and confidence:** [Assumptions]
- **Conditions and review trigger:** [COND-NN, or the change that reopens it]
- **SDD sections affected / verification:** Q8, §8.3, §8.6 / [Compliance and TCO validation]

### ADR-MIG-001: Workload 7R and transition

<!-- Exists only when the migration overlay applies (chunk 08 is present); leave this whole ADR out, heading included, when it does not. It is a Pre-SDD decision because the 7R and the transition shape are numbers and shape, not products. Fed by OVL-04 (the 7R per workload) and the cutover items OVL-08, OVL-09, and OVL-10. -->

- **Status:** Proposed (accepted by the G3 sign-off, chunk 11)
- **Owner / reviewers / decision date:** [Migration owner] / [Reviewers] / [YYYY-MM-DD]
- **Requirement links:** OVL-04, OVL-08, OVL-09, OVL-10, DT-11 [and the entries that apply]
- **Business context:** [Why the workloads move, and what the downtime contract (OVL-09) allows]
- **Hard constraints and agreed targets:** [Entry IDs and their status, including the approved cutover window]
- **Options considered:** [The Rs compared per workload, for example "rehost" and "replatform"; OPT-NN]
- **Evidence:** [CALC-17, rule IDs, rehearsals]
- **Option comparison:** [The same aspects for each R compared, per workload, in shape words]
- **Decision and rationale:** [The one primary R per workload (OVL-04), the dependency waves, the cutover mode, the fallback, and the no-return point, as chunk 08 states them]
- **Consequences and residual risks:** [Consequences; risks by ID in chunk 10]
- **Assumptions and confidence:** [Assumptions]
- **Conditions and review trigger:** [COND-NN, or the change that reopens it]
- **SDD sections affected / verification:** Migration plan, data, network / [Rehearsal and reconciliation]

## 9.5 SDD ADRs Driven by This Pre-SDD

<!-- The other ADRs of the Standard's set are SDD decisions: the SDD writes them and cites the Pre-SDD answers that drive them as PSDD/<ID>. List each with those answers, by entry ID and status; never pre-decide them here. -->

| SDD ADR | Decides | Driving answers |
|---------|---------|-----------------|
| ADR-PERF-001 Workload processing model | Synchronous or queued processing; compute, cache, and store strategy | [CAP-01.n, CAP-04.n, CAP-07.n, CALC-NN] |
| ADR-INT-001 Integration reliability | The mechanism: broker, outbox, deduplication, or synchronous calls | [INT-02.n, INT-04.n, INT-05.n] |
| ADR-IAM-001 Identity and tenancy | The identity product, the authorization model, and the schema strategy within the isolation level | [SEC-02.n, DAT-07.n] |

<!-- Footer: when chunk 08 is omitted (no overlay), PREV is 07-options-and-economics.md. -->
<!-- MASTER: [slug]-pre-sdd-master.md | PREV: 08-migration-overlay.md | NEXT: 10-validation-risks-unknowns.md -->

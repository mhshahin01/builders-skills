<!--
CHUNK: 12
TITLE: SDD Handoff Guide
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: 03a-11
PART OF: Pre-SDD - [Project Name]
AUDIENCE: sdd-unifier (the Software Architect). It reads this chunk first, then the master's gate line, then chunk 11, and never this skill's rule files, so the guide is self-contained.
-->

# 12. SDD Handoff Guide

> **What this guide is.** The contract between this Pre-SDD and the SDD that builds on it. The Pre-SDD settles numbers and shape (TPS and RPS, latency budgets, availability, RTO and RPO, data growth, bandwidth, cost; hosting target, fault scope, DR strategy, topology, data-store shape). Once G3 is signed, every item in § 12.2 is **locked** for the SDD: the SDD cites it and designs to it, and never changes it. The SDD picks the products, versions, architecture style, and detailed design (§ 12.4).

<!-- Rules for writing this chunk: handoff-guide.md. Rewrite it after every compute and after every signing (§ 12.1 and § 12.5 change with the gate; writing a signature bumps nothing). Every value comes from the engine fragments; none is restated from memory. -->

## 12.1 Pre-SDD, Gate and Signers

<!-- Copied from the master, chunk 00, and the gate fragment in chunk 11. The Gate row holds the engine's gate label only, as the master's gate line opens with it; the G3 status and the authorization have their own rows, and the master keeps the full gate line. -->

| Item | Value |
|------|-------|
| Pre-SDD | [Project Name], version [X.X] ([master link](./[slug]-pre-sdd-master.md)) |
| Source BRDs | [KEY] v[X.X] ([status]) [one per BRD, as chunk 00 lists them] |
| Gate | [the engine's gate label only: Draft / G0 / G1 / G2 / Blocked / G3 Approved / G3 Approved with conditions] |
| G3 status | [Not signed / Blocked / Review / Approved / Approved with conditions] |
| Authorized to start the SDD | [Yes / No] |
| Signers | [Role: name, decision, YYYY-MM-DD, one per applicable role; a stand-in marked as one; or "Not signed"] |
| Engine | pre-sdd-engine [3.0.0], skill pre-sdd-unifier [1.0.0] |

**How the SDD reads this gate:**

- **G3 Approved or Approved with conditions** (authorized `Yes`, and the master's gate line does not read `Review`): load this Pre-SDD and lock every item in § 12.2.
- **Any other G3 status** (`Not signed`, `Blocked`, or `Review`): the Pre-SDD is not signed. Do not load it. Stop, and raise a handoff request to the E2E Architect (`pre-sdd-unifier`) on `unifier-status.md` that lists what G3 still needs (chunk 11 § 11.1).
- A content change after G3 sends G3 back to `Review` until every applicable role signs again; until then the SDD treats the new version as not signed: a new SDD waits, and an SDD that loaded an earlier signed version keeps that version locked.

## 12.2 Locked Items

<!-- The engine renders the lock list (fragment `12-locked-items.md`): one row per entry of every row in the landing map, in register order, with the entry ID, what it measures (the row's title and the entry's label or scope, in the register's words), the value with its unit (TBD when it has none) and, for a data workload (DAT-01), its store kind, the status, the owner (as the register prints it; the row's owner when the entry has none), and where it lands in the SDD; then the calculations: each `CALC-NN` of chunk 04 with what it measures and its value with its unit (TBD when it is open), in chunk 04's words, which §18 cites; then the target-shape decisions: hosting, topology, the DR strategy per failure scope, the data shape (store kind and consistency), and the chosen option when one is set; then the landing table: each SDD place with the rows that land there, in register order, from the engine's landing map. Paste it unchanged between the markers. -->

<!-- ENGINE-FRAGMENT: 12-locked-items.md -->
| ID | Measures | Value | Status | Owner | Lands in the SDD |
|----|----------|-------|--------|-------|------------------|
| [Entry ID] | [Row title; entry label or scope] | [value and unit, or TBD] | [Status] | [Owner] | [Project Type / Q3 / Q7 / Q8 / §6 Notes / §8.3 / §8.6 / §8.7 / §11 / §18 / §18.5 / §19 / §20] |

| ID | Measures | Value |
|----|----------|-------|
| [CALC-NN] | [Calculation, as chunk 04 names it] | [value and unit, or TBD] |

| Decision | Value |
|----------|-------|
| Hosting | [cloud / onprem / hybrid] |
| Topology | [Topology] |
| DR strategy, scope [scope] | [Strategy] |
| Data | [kind, consistency] |
| Chosen option | [OPT-NN, or none] |

| Lands in the SDD | Rows |
|------------------|------|
| [Project Type / Q3 / Q7 / Q8 / §6 Notes / §8.3 / §8.6 / §8.7 / §11 / §18 / §18.5 / §19 / §20] | [Row IDs, in register order] |
<!-- /ENGINE-FRAGMENT -->

An item that reads `TBD` or `Open` is locked as open: the SDD carries it as an open question that says what it measures and names its owner (the Measures and Owner columns), links it to its register row through its `PSDD/<ID>` link (where its due date stands), and never fills it.

## 12.3 Where Each Item Lands in the SDD

The lock is on numbers and shape, never on the SDD's own questions. Which rows land in each place is the landing table of the locked-items fragment in § 12.2, which the engine renders from its landing map; this section never copies it. How the SDD applies what lands in each place:

| SDD place | How the SDD applies it |
|-----------|------------------------|
| Project Type | Pre-fills the Project Type question with the change type (HDR-07). The Standard's brownfield means a workload or state to preserve; the SDD's means a codebase to extend. When this Pre-SDD is brownfield with no codebase to extend (for example a rewrite with a data migration), the SDD answers Greenfield and carries the migration context. |
| Q3 (load and availability) | The evidence for Q3, cited as `PSDD/<ID>`. Q3 stays the SDD's choice. |
| Q7 (multi-tenancy model) | Q7 is chosen within the isolation level of DAT-07 (tenancy model and isolation level): `single` allows Single tenant; `shared-logical` allows shared schema with `tenant_id`, schema per tenant, or database per tenant; `schema-isolated` allows schema per tenant or database per tenant; `database-isolated` and `deployment-isolated` allow database per tenant. |
| Q8 (deployment target) | The hosting target (cloud, on-prem, or hybrid; a provider only when the business made it a hard constraint) is locked. The runtime option is the SDD's. |
| §6 Notes | Each affected §6 row carries the constraint in its Notes; the data-store row carries the store kind of each data workload (DAT-01), and the product stays the SDD's. A product that breaks a constraint becomes an open item (§ 12.6). |
| §8.3 (high-level architecture) | The diagram follows the hosting, data, integration, and network shape: the data workloads and their store kind (DAT-01), and the external dependencies with the partner quotas, latencies, SLAs, maintenance windows, and rate limits they impose (INT-03). |
| §8.6 (infrastructure architecture) | The deployment topology follows the hosting target, the topology, the availability targets, the failure scopes, the residency, and the client and edge locations: the regions or sites, the zones, and the redundancy cite them as `PSDD/<ID>`. §8.6.4 (backup and disaster recovery) is the home of the RTO and RPO per failure scope, with the DR strategy of each scope and the restore granularity; the §18.5 row of a recovery NFR links there and restates neither figure. The storage redundancy and replication meet the durability and correctness targets (REL-10). |
| §8.7 (network architecture) | The zones, the ingress and egress paths, TLS termination, the network policies, and administrative access follow the network constraints: address ranges and private connectivity, allow-lists, firewall, DNS and proxy dependencies, client and edge locations, where residency lets data flow, the threat posture, encryption in transit, and privileged access, each cited as `PSDD/<ID>`. |
| §11 (cross-cutting concerns) | The defaults follow the DR strategy, the data classification, residency and retention, the isolation level, the security obligations, the business prohibitions and obligations (BUS-07, BUS-08), and the durability and correctness targets (REL-10). |
| §18 (performance and capacity) | §18 cites the `PSDD/CALC-NN` values from the calculations table of § 12.2, each linked to its chunk 04 anchor (§ 12.7), and never recomputes them. It sizes within the partner quotas and latencies (INT-03) and for the peak simultaneously active users (CAP-03), which no calculation reads, and its latency targets are measured where CAP-08 says, with what counts as a failure. |
| §18.5 (NFR targets) | The settled targets; each BRD NFR row cites the entry that quantifies it. A latency target states its measurement point and what counts as a failure (CAP-08); a durability or correctness NFR takes its target from REL-10. |
| §19 (environments) | The environments follow the DR strategy and the environment list. |
| §20 (operations runbook) | The runbook follows the DR strategy, the recovery sequence, the failover authority, and the restore granularity. |

## 12.4 Left to the SDD

The Pre-SDD settles nothing below; the SDD decides each, within the locked items:

- **Products and versions** for every layer, and managed or self-managed.
- **The architecture style** (Q4), **communication** (Q5), and **data ownership** (Q6). The Pre-SDD gives only their drivers.
- **The provider**, when the business did not make one a hard constraint.
- **Detailed DR procedures**, failover mechanics, and the environment layout.
- **Per-service sizing**, the per-service breakdown, and caching.
- **The schema strategy** per service (Q7, within the isolation level), partitioning, and ERDs.
- **The integration mechanism** (broker, outbox, synchronous calls) and the contracts.
- **The identity product** and the authorization model; the network design, firewall rules, and routes; the cost per component.
- **The SDD ADRs** ADR-PERF-001 (workload processing model), ADR-INT-001 (integration reliability), and ADR-IAM-001 (identity and tenancy), each citing the Pre-SDD answers that drive it ([09 § 9.5](./09-decisions.md#95-sdd-adrs-driven-by-this-pre-sdd)). The Pre-SDD ADRs ADR-DR-001, ADR-DATA-001, and the hosting part of ADR-PLATFORM-001 are locked, and so is ADR-MIG-001 (workload 7R and transition) when the migration overlay applies ([09 § 9.4](./09-decisions.md#94-pre-sdd-adrs)).

## 12.5 Conditions, Exceptions and Unknowns

<!-- Copied from the gate fragment (chunk 11) and the validation fragment (chunk 10): every condition of an Approved with conditions sign-off, every time-bound exception, and every unknown that did not block G3, each with its owner and due date. Write "None" under a heading with none. -->

**Conditions** (the SDD shows each open condition as a §4 risk citing `PSDD/COND-NN`):

| ID | Condition | Owner | Due |
|----|-----------|-------|-----|
| COND-01 | [Condition] | [Owner name] | [YYYY-MM-DD] |

**Exceptions** (an `Open` hard entry that a named person let pass G3 until its expiry; the person who granted it owns it, and the expiry is its due date):

| ID | Entry | Granted by (owner) | Expires (due) | Review |
|----|-------|--------------------|---------------|--------|
| EXC-01 | [Entry ID] | [Name] | [YYYY-MM-DD] | [YYYY-MM-DD] |

**Unknowns** (open questions the SDD carries, never fills):

| ID | Question | Entry | Owner | Due |
|----|----------|-------|-------|-----|
| QD-01 | [Question] | [Entry ID, or none] | [Owner name] | [YYYY-MM-DD] |

## 12.6 When the SDD Disagrees

The SDD never edits a locked item, and never edits this Pre-SDD. When it finds a locked item wrong, or in conflict with a source or a design need:

1. It raises an open item in its chunk 18, with `Owner: E2E Architect (pre-sdd-unifier)`, citing the item as `PSDD/<ID>`. Its e2e gate treats the item like any other open item.
2. It raises a handoff request to the E2E Architect on `unifier-status.md`, naming the open item.
3. The E2E Architect decides with the owner: change the item, or keep it with the reason. A change runs one Pre-SDD update with a new version, a review, and the G3 sign-off again.
4. The E2E Architect raises a handoff request back to the Software Architect: "Pre-SDD has a new version", naming the open item, or the decision to keep the item with its reason. The SDD closes its open item on its next run.

## 12.7 Citing This Pre-SDD

Cite every Pre-SDD ID as `PSDD/<ID>`, with a link to where it lives (there is one Pre-SDD per SDD):

- a register row or entry links to its row heading: [PSDD/REL-03.2](../pre-sdd-[slug]/03c-register-reliability.md#rel-03);
- a header row or entry links to its row heading in chunk 01 § 1.1, where the header rows stand: [PSDD/HDR-07.1](../pre-sdd-[slug]/01-business-brief.md#hdr-07);
- a calculation links to [04 § 4.2](../pre-sdd-[slug]/04-targets-and-calculations.md#42-calculations) (`PSDD/CALC-03`), and an option's rows to [07 § 7.1](../pre-sdd-[slug]/07-options-and-economics.md#71-options) (`PSDD/CALC-21@OPT-02`);
- a condition or an exception links to [11 § 11.1](../pre-sdd-[slug]/11-gate-and-sign-off.md#111-gate-result) (`PSDD/COND-01`, `PSDD/EXC-01`);
- an unknown links to [10 § 10.1](../pre-sdd-[slug]/10-validation-risks-unknowns.md#101-validation-and-unknowns) (`PSDD/QD-03`);
- a Pre-SDD ADR links to [09 § 9.4](../pre-sdd-[slug]/09-decisions.md#94-pre-sdd-adrs) (`PSDD/ADR-DR-001`), and a decision rule to [09 § 9.2](../pre-sdd-[slug]/09-decisions.md#92-decision-tree) (`PSDD/DT-07`).

Entry IDs are the row ID, a dot, and the entry number (`REL-03.2`; `.1` is the primary entry). BRD IDs keep their BRD key (`REFUNDS/NFR-03`). An ID is never renumbered or reused.

<!-- In COMBINED mode, the links point into PRE-SDD-[ProjectName]-vX.Y.md (`../PRE-SDD-[ProjectName]-vX.Y.md#rel-03`). -->

<!-- MASTER: [slug]-pre-sdd-master.md | PREV: 11-gate-and-sign-off.md | NEXT: 13-open-items-and-clarifications.md -->

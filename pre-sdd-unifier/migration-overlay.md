# Migration overlay

The migration overlay applies to every existing workload or component that crosses a hosting or platform boundary. So it comes with a brownfield or mixed change type, whatever the target (Standard § 8). It adds twelve fields per workload, one primary 7R strategy per workload, the cutover rules, the wave record, and chunk 08. It never replaces the classification: an on-prem system moving to cloud is `BF-CL` plus the overlay (`classification-and-paths.md`).

Read this file at step 9 when the overlay applies, and at step 8 when stage 2 switches it on.

---

## The switch and the source

The overlay is settled in stage 2, with the classification, by the `set-overlay` op: whether it applies, and the source platform.

- **Who:** a person or a fixture owner sets it. The skill may set it when a source states the migration. In that case it puts the citation in the op's `cite` key (`{ "type": "brd", "text": "BRD: REFUNDS/MIG-01" }`, the same form as `source` on other ops). The engine writes the citation into the history record as its reason. The op's `source` key is the overlay's source platform (below), not a citation. An answer policy never sets it: the engine refuses it.
- **Applies:** it applies when an existing workload changes hosting or platform (the decision tree's "Existing workload changes hosting or platform?", Standard § 9.2). A greenfield Pre-SDD has no existing workload, so it has no overlay.
- **Source:** the exact source, never assumed (Standard § 8, "No source/target assumed"):

| Source | Means |
|---|---|
| `onprem` | An organization-operated data center or private cloud |
| `samecloud` | The same cloud provider, for example region A to region B |
| `othercloud` | Another cloud provider |
| `mixed` | More than one of these |
| `unknown` | Not known yet |

While the overlay applies and the source is `unknown`, the engine raises the blocker `OPEN-migration-source`. HDR-09 (source platforms) and HDR-10 (migration direction) state the same move in the header, and G3-03 needs the direction explicit.

Switching the overlay off keeps its entries; the gates then ignore them. Switching it on again brings them back as they were.

---

## Workloads

The overlay holds a list of workloads, each with an ID `WL-NN` and a name. A new Pre-SDD holds `WL-01` with no name.

- `add-workload` adds the next `WL-NN` (never reused) and gives every OVL row its entry for it. `rename-workload` changes a name. `remove-workload` removes a workload and its entries. Any actor may add, rename, or remove one, since a workload label changes no value and a removal is refused while the workload holds an answer.
- The engine refuses `remove-workload` while any of that workload's OVL entries holds a value or a factor value or is `Confirmed` or `N/A` (mark them `N/A` instead).
- The engine never removes `WL-01`, which holds the primary entries of the OVL rows. Rename it instead.
- The engine refuses to remove the last workload, overlay on or off. Switch the overlay off with `set-overlay` instead.
- Name one workload per component or group the Standard treats as one migration decision: a business capability with its hosts, stores, jobs, integrations, and identity and network dependencies (OVL-03).

Each OVL entry carries its workload ID. Cite an OVL entry by its entry ID (for example `OVL-04.2`); chunk 08 shows the workload beside it.

---

## The overlay fields

One row per field of the Standard's § 8 table, with one entry per workload. OVL entries follow the register's rules: record fields, statuses, sources, and who confirms (`register-and-entries.md`).

| Row | Field | Required response |
|---|---|---|
| OVL-01 | Source → target | Datacenter A to cloud X, cloud X to cloud Y, region A to region B, and so on. No source or target assumed. |
| OVL-02 | Migration objective | Exit date, cost benefit, risk reduction, features, compliance, or capacity. |
| OVL-03 | Workload group | Business capability, hosts, stores, jobs, integrations, and identity and network dependencies; the wave the workload belongs to. |
| OVL-04 | 7R strategy | One decision per workload or component, with alternatives and evidence (§ The seven Rs). |
| OVL-05 | Current-state baseline | Peak demand, p95 and p99, incidents, SLA, RPO and RTO, usage, and costs. |
| OVL-06 | Destination fit | Feature and service compatibility, license, quota, performance, data residency, controls, and operating model. |
| OVL-07 | Transition and data plan | Initial bulk copy, CDC or replication, transformation, consistency, checksum and reconciliation, retained backup. Factor `migrationGB`: the volume to move, in GB. |
| OVL-08 | Network/cutover plan | Link bandwidth, RTT, routing, CIDR conflict, firewall, IP and DNS, certificate, TTL, and load balancer changes. Factor `linkMbps`: the effective link throughput, in Mbps. |
| OVL-09 | Downtime contract | Approved cutover window, acceptable transient data lag, communication, and business sign-off. Factor `cutoverHours`: the approved window, in hours. |
| OVL-10 | Fallback | True rollback or rollforward feasibility, failure triggers, return-to-source data compatibility, and the point of no return. |
| OVL-11 | Acceptance criteria | Journey tests, p99 and load comparison, data integrity, RPO and RTO, security controls, operational readiness, and costs. |
| OVL-12 | Decommission criteria | Owner approval, data, archive, and legal hold, partner notifications, recovery retention, keys and secrets, billing, and access cleanup. |

**When each is asked.** While the overlay applies, stage 2 asks for the owner name and due date of every OVL entry still `Open`, because G1 counts them. Stage 3 takes their values (`stages-and-input.md`).

**The transfer math.** The engine computes the ideal bulk transfer time (`CALC-17`) from `migrationGB` and `linkMbps`. When it exceeds `cutoverHours`, rule `MIG-14` fires: explore an advance bulk load plus CDC and reconciliation, which is not a guaranteed zero-downtime solution. While any of the three is missing, the advisory `MIG-transfer` says the transfer and cutover cannot be estimated. The calculation reads the primary entries (`.1`) only. When another workload's entries hold other values, the engine's `PRIMARY-ONLY-*` advisory names them. The skill then does one of two things: it makes the primary entry the one to size for, or it carries the others in chunk 08 as stated values for the SDD.

---

## The seven Rs

The Standard uses AWS's 7R names as the common vocabulary, whatever the destination (§ 8.1). The destination never forces one technical implementation. OVL-04 holds one primary R per workload; the engine holds it as text, so write the R's name exactly as below.

| R | Meaning | Select when | Consequences |
|---|---|---|---|
| Retire | Shut down an obsolete or redundant capability | No business value is confirmed, and no live or contractual dependency remains | Decommission servers, DNS and network rules, credentials, and flows; archive or delete per policy; migrate the consumers first. |
| Retain | Keep the workload on the source, for now or for good | A legal or technical blocker, an unfavorable business case, limited tolerance, or a pending decision | Keep the source operating; secure hybrid or inter-cloud connectivity if peers move; assign an owner and a reassessment date. |
| Rehost | Lift and shift with minimal application change, normally a VM or OS workload onto destination IaaS | Compatibility is proven, time to exit dominates, and the existing design is acceptable | Recreate compute, network policies, monitoring, licensing, and backup; no automatic fix for technical debt. |
| Relocate | Move a compatible estate or platform at the infrastructure or hypervisor level with minimal change | A supported virtualization or estate relocation path exists and reduces effort | Needs verified platform or hypervisor compatibility, network mapping, and licensing. Not a portable default across clouds. |
| Repurchase | Replace the software or capability with a new commercial product, commonly SaaS | The product fits the required business processes, economics, and controls | Data, identity, and integration migration, vendor exits, network endpoints, workflow retraining; accept the feature gaps. |
| Replatform | Make limited platform changes and keep the core application behavior | A managed service can reduce toil, resolve lifecycle issues, or fit better with modest change | Service feature parity, auth, configuration, drivers, network endpoints, backup semantics, and performance regression testing. |
| Refactor | Substantively change the application design or code to meet the target qualities | The existing architecture cannot meet hard NFRs, portability, scaling, or business change | A larger development and testing scope; new APIs and data ownership, async boundaries, deployment strategy, and cutover complexity. |

The table names categories, never products: a Repurchase or Replatform entry states the shape of the replacement (for example "a managed relational service"), and the SDD picks the product.

**Selection policy** (§ 8.1):
- Evaluate Retire and Retain explicitly for every workload.
- Evaluate Repurchase where functional equivalence is credible.
- Compare the feasible Rehost, Relocate, Replatform, and Refactor on risk, NFRs, time, operational capacity, and TCO.
- No universal priority order or percentage mix: workloads in one portfolio usually get different Rs.
- Refactor may wait until after a first safe migration when the schedule needs it and the interim solution stays compliant and viable.

**Who decides.** The 7R is a decision with alternatives and evidence. The skill pre-fills OVL-04 only where a source states it, with its citation; otherwise the entry stays `Open`. In stage 3 the skill presents the Rs for each workload as options. Each option has its evidence and tradeoff, and the recommended one comes first. A person answers, or an answer policy takes the recommended R. OVL-04's evidence field records the alternatives considered and why each was rejected.

**The ADR.** When the overlay applies, the skill writes ADR-MIG-001 (workload 7R and transition) in chunk 09 § 9.4. OVL-04 and the cutover items OVL-08, OVL-09, and OVL-10 feed it. It uses the same format as ADR-DR-001 and ADR-DATA-001. When the overlay does not apply, the ADR does not exist.

---

## Hazards to check

The hazards for the source and target pair go into the path evidence and the OVL entries they concern. Each one the evidence does not settle is a risk in chunk 10 or an unknown (`QD-NN`). Which section to check depends on the source:

- With source `onprem`, check § 8.2.
- With `othercloud`, check § 8.3.
- With `mixed`, check both.
- With `samecloud`, check the § 8.3 items that still apply inside one provider.

**On-premises to cloud** (§ 8.2):
- physical and virtual servers, OS, legacy databases, shared storage, hardware licenses, unsupported protocols, and hardware dependencies;
- the one-time bulk transfer size against the WAN throughput and the window; offline transfer if justified; secure private or encrypted connectivity;
- cross-environment RTT to retained directory, ERP, payment, database, or partner systems; move tightly coupled dependencies together where feasible;
- overlapping private IP space, firewall allowlists, NAT, routes, DNS, PKI, identity federation, and on-prem license servers;
- landing zone, service quota, and resource policy readiness; region and residency restrictions and the DR design;
- realistic costs: migration factory, parallel run, network links and egress, licenses, re-engineering, testing, decommissioning, and run rate;
- exit the data center or keep a hybrid: explicit future-state ownership, contracts, and a review date.

**Cloud A to cloud B** (§ 8.3):
- inventory the provider-managed dependencies: managed databases, events and queues, functions, IAM, secrets and KMS, observability, APIs, DNS, object storage semantics, CI/CD, and IaC;
- database engine, extension, and version compatibility, object metadata and events, schema and CDC tooling, and the portability of encryption keys and certificates;
- egress and transfer fees, inter-cloud links, synchronization duration, temporary double cloud bills, cross-cloud RTT, rates, and quotas;
- IAM identities and federated tokens do not translate directly; recreate least privilege and the audit controls;
- service SLOs, failure-domain models, backups, regional availability, network controls, and support SLAs may differ between providers;
- what data must stay on the origin for audit or legal retention, and how the old account or cloud is closed safely after cutover;
- prove the move with pilot workloads before the waves; never assume Relocate exists for every managed-service estate.

---

## Cutover rules

The Standard's six migration and cutover rules (§ 8.4), and the OVL rows that record each one per workload:

| Rule | What it requires | Recorded in |
|---|---|---|
| Dependency first | Group tightly coupled workloads when separating them creates unacceptable latency, security, or consistency risk | OVL-03 (the workload group and its wave) |
| Data authority | The system of record in each transition phase, the write freeze or synchronization model, deduplication, and conflict resolution; no uncontrolled bidirectional writes | OVL-07 |
| Explicit cutover mode | Phased or strangler, parallel validation, blue-green traffic switch, or scheduled outage, with why the other modes were rejected | OVL-08, OVL-09 |
| Rollback at each phase | Source reactivation may stop being valid once the target is write-authoritative, unless reverse replication or reconciliation is proven; a DNS switch alone is not a rollback plan | OVL-10 (with the point of no return) |
| Verify before completion | Business journeys, data counts and checksums, transactions, latency and availability under representative load, access controls, billing, and observable operations | OVL-11 |
| Decommission after stabilization | Keep retention and forensics, meet legal holds, remove unused accounts, routes, certificates, credentials, and backups per policy | OVL-12 |

Never promise a zero-downtime migration without evidence that replication, client behavior, schema compatibility, and rollback support it (Standard § 12, item 11).

---

## The wave record

Chunk 08 carries one migration wave record per wave, in the Standard's columns (§ 8.4):

`WAVE_ID | workload IDs | source→target | 7R | dependencies | window | data sync method | cutoff | rollback threshold | approvers | evidence | status | decommission deadline`

The engine holds no wave record, so the record is built only from the OVL entries:

| Column | From |
|---|---|
| WAVE_ID | The wave name the workloads' OVL-03 entries give |
| workload IDs | The `WL-NN` of each workload in the wave |
| source→target | OVL-01 |
| 7R | OVL-04, per workload |
| dependencies | OVL-03 |
| window | OVL-09 |
| data sync method | OVL-07 |
| cutoff, rollback threshold | OVL-10 |
| approvers | OVL-09 (the business sign-off) |
| evidence | Each cited entry's evidence |
| status | The cited entries' statuses |
| decommission deadline | OVL-12 |

Every cell cites the entry it comes from. A cell that no entry gives reads `TBD`, never a guess. The record is a Pre-SDD view of the plan; the cutover readiness gate (G4) and the runbooks come after the SDD.

---

## DT-11

DT-11 is the Standard's rule for a migration destination that differs from the source: evaluate the 7 Rs per workload, with the dependency wave, the cutover, and the rollback (Standard § 9.3).

The engine makes it a blocker. While the overlay applies, each workload whose OVL-04 entry is missing or `Open` gives `DT-11-BLOCK@WL-NN`, and G2 reads `blocker`. A valid exception on that OVL-04 entry, granted by a named person, lifts it (`gates-and-signoff.md` § Exceptions). G2 also needs every workload's OVL-04 to hold a value for a `shortlist`. So an OVL-04 marked `N/A` leaves G2 `incomplete`. An OVL-04 left `Open` under an exception also leaves G2 `incomplete`. The exception lifts the blocker, but G3 cannot reach an approved status until the workload's 7R holds a value.

A workload that stays on its source records its R as `Retain`. A workload listed by mistake is removed while none of its entries is answered yet (never `WL-01`, which is renamed instead).

At G3, line G3-10 asks for the per-workload 7R, the dependency waves, the data path, the fallback, and the no-return point. A person ticks it after reading chunk 08. When the overlay does not apply, the person marks it `N/A` with a reason instead. While the overlay applies, the migration owner is an applicable sign-off role.

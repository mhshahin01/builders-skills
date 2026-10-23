# Worked Pre-SDD | GF-OP | Simple — Employee Training & Certification Portal

**Example ID:** EX-GF-OP-Simple  
**Classification:** Greenfield × On-premises  
**Primary recovery tier:** Simple — Both RPO **12 h** and RTO **12 h** are **greater than 6 hours** for the stated primary failure scope.  
**Migration overlay:** None  
**Version/date:** 1.0 / 2026-10-16  
**Status:** ILLUSTRATIVE WORKED EXAMPLE, **NOT** a real stakeholder-approved Pre-SDD. Every person, product, demand number, target, time allowance, price and budget below is intentionally **invented** for architectural training unless a public reference explicitly substantiates a general service behavior.

**Companion documents:** [Pre-SDD Standard](./Pre-SDD_Architecture_Standard_v1.md) · [Blank Intake](./Pre-SDD_Project_Intake_Template.md) · [Case Index](./PreSDD_Examples_README.md)

## 1. Business brief, responsibility and classification

| Field | Completed fictional business input |
|---|---|
| Business sponsor / sign-off | VP Corporate learning (role is illustrative; no real signature) |
| Product owner / data owner | Product Manager + domain Data Steward (illustrative) |
| Lead architect / design authority | Enterprise Solution Architect + Architecture Review Board (illustrative) |
| Problem/outcome | Reduce manual compliance-tracking effort by 30% in year one |
| Critical journey | Publish a training completion and view assigned courses |
| Population | Corporate employees across two nearby office campuses |
| Source/current estate | None: net-new service |
| Source→target | None → Organization-owned primary data center |
| Path / direction | GF-OP / None |
| Hard placement guardrail | Classified training content must continue to work during Internet disconnection (assumed policy) |
| Deadline | 5 months after initiation |
| Compliance baseline | Confidential employee training records; encrypt in transit and at rest; access logged; country-of-operation residency only |
| Assumed financial exposure | $250/hour of critical-journey outage |

**Why classification is correct.** No pre-existing production system is preserved. All business capabilities and data authority begin at launch. Target placement is Organization-owned primary data center. The migration overlay is recorded separately; it does not create a fifth branch.

## 2. NFR contract, scope and business-impact arithmetic

| Dimension | Fictional business target, exact semantics |
|---|---|
| RPO for primary incident | 12 h for last recoverable committed data |
| RTO for primary incident | 12 h until the business API/journey is usable |
| Incident/fault scope | loss of an application VM or storage host while application-consistent backup remains accessible |
| Separate full site / region disaster | Complete primary-site loss or late-discovered logical corruption: separate RPO 24 h; RTO 48 h using protected backups and an agreed alternate site |
| Availability SLO | 98.00% 30-day critical-journey success; failed/time-out calls counted as errors |
| p50 / p95 / p99 | ≤180 / ≤750 / ≤1600 milliseconds; edge ingress-to-valid-response critical journey |
| Average vs peak | 0.45 TPS during 8 active h/day / 6 TPS for 10 minutes |
| API RPS at peak | 12 external requests/s; each business transaction performs 2 such requests |
| Peak simultaneously active users | 180 (not to be confused with peak in-flight requests) |
| Year-1 demand growth | +25%; validate at 1.25× additional load |
| Data correctness | Restore coherent recoverable records and reconcile permitted RPO loss |
| Support / escalation | Weekday 08:00–18:00 local; on-call not required outside hours |

**Scope is binding:** `loss of an application VM or storage host while application-consistent backup remains accessible`. **Other disasters have different commitments:** Complete primary-site loss or late-discovered logical corruption: separate RPO 24 h; RTO 48 h using protected backups and an agreed alternate site. RTO is elapsed time from loss of the scoped business journey until a verified usable journey returns; RPO is the age of last recoverable committed business data at the incident point. It is wrong to claim site/region/cyber recovery meets 12 h just because a node/rack/zone test does.

**30-day downtime budget:** `(1 - 98.00000/100) × 30 × 24 × 3600 = 51840.0 seconds = 864.00 minutes`. This is an illustrative **end-to-end journey** error budget, not an individual cloud service SLA. One recovery exercise may consume part of it. The worst-case single-incident RTO of 12 h consumes 83.3% of a full 30-day error budget; all other incidents, deployments and dependency failures must fit the remainder for the period SLO to pass.

**Outage impact at the target RTO (linear approximation):** `$250/h × (43,200 s ÷ 3600) = $3,000.00`; actual loss is scenario-specific and may be nonlinear.

## 3. Transparent workload, CPU, network and storage calculations

### 3.1 Workload → CPU and concurrency

- **Transactions/day:** `0.45 avg TPS × 8 active h/day × 3,600 = 12,960 business transactions/day` (not 6 peak TPS all day).
- **Peak API demand:** `6 TPS × 2 external requests/transaction = 12 RPS` (internal RPCs and retries add separate load).
- **Modeled CPU work:** `6 TPS × 40 ms CPU/transaction ÷ 1,000 = 0.24 busy vCPU cores` before overhead and N-1 protection.
- **CPU-only lower bound:** `ceil(0.24 ÷ 0.60 CPU target)` rounded to even vCPU = **2 application vCPU**; memory, replica availability and DB size require independent empirical sizing.
- **Year-1 expansion decision:** +25% peak traffic raises modeled CPU demand from 0.24 to 0.30 busy cores; maintain a 60% modeled CPU ceiling and N-1 fault-domain tolerance by increasing from **2 → 2 app vCPU per domain**, i.e. **0 additional vCPU** overall in the first year. Reserve purchasable on-prem hardware now; capex delivery depends on procurement lead time.
- **Little's Law, in-flight API estimate:** `12 external RPS × 0.300 s assumed **mean** response time = 3.6 in-flight API requests` at peak. These are **not** simultaneous human users; do not use p99 as the average.

### 3.2 Network demand and burst allowance

- **Application payload:** `12 RPS × 12 KiB round-trip/request × 1,024 B/KiB × 8 bits/B ÷ 1,000,000 = 1.18 Mb/s`, measured as total application traffic budget across request + response.
- **Engineering envelope:** `1.18 × 2.5 = 2.95 Mb/s` for illustrative retries, framing and bursts, **not** a physical link guarantee; add TLS, database replication, backups, migration, logging and cross-site flows separately.
- **Placement impact:** Internal reverse proxy; segmented application/database VLANs; two independent switches where available; no Internet ingress; backup transfer to alternate site.

### 3.3 Durable data growth and retention (uncompressed model)

- **Transactional event volume:** `12,960 transactions/day × 4 KiB/event ÷ (1,024 × 1,024) = 0.049 GiB/day`.
- **Additional nontransactional data:** `0.400 GiB/day` (files, attachments, reference data or indexes modeled separately, scenario dependent). Total logical growth **0.449 GiB/day**.
- **12-month no-deletion baseline:** `80 GiB initial + 365 × 0.449 GiB/day = 244.0 GiB`. This is a planning bound; active-data TTL can lower net production size.
- **Retention buffers:** hot 365 days × 0.449 = **164.0 GiB** of new logical data, archive +730 days × 0.449 = **328.1 GiB** (before compression, index amplification, snapshots, backup copies and replica count).
- **Backup cadence:** every 4 hours leaves a maximum schedule-gap data age of 4 hours **only if** every scheduled backup is complete, recoverable, and application-consistent. RPO slack: 8 hours.

### 3.4 Storage footprint, application memory and database IOPS screening

- **DB operations:** assume 6 logical reads and 2 logical writes per business transaction at the peak (a *different* measure from API RPS). `6 TPS × (6 reads + 2 writes) = 48 logical ops/s`. Double this **fictional** demand for index/WAL amplification and bursts: **96 storage operation/s screening envelope**. These do **not** replace real device/service IOPS tests, write latency or database service quotas.
- **Protected hot footprint:** `(initial 80 GiB + last 365 days 164.0 GiB) × 1.40 index/WAL allowance × 1 retained live physical replica(s) × 1.25 free-capacity allowance = ~427 GiB physical-equivalent provisioned`. Archive (328.1 GiB), offsite backup and temporary migration copies are **additional**. Managed cloud storage billing may abstract replicas and must **not** be treated as 1 customer-provisioned disks.
- **Memory envelope (not measured):** `2 application vCPU/domain × 4 GiB/vCPU = 8 GiB/domain` for early VM/pod-request modeling; multiply by 1 fault domains for **8 GiB total** application allocation, excluding DB, message platform, OS and observability. Profile heap/working set before ordering hosts or SKUs.
- **Replica-link demand:** no synchronous 3-way quorum is required by the fictional >6-hour RPO/RTO contract; off-site backups and periodic repair are separately scheduled and metered.
- **Monthly API payload volume, both directions:** `0.45 TPS × 8 h/day × 3,600 × 30 days × 2 calls × 12 KiB ÷ (1,024²) = 8.9 GiB/month`. Only a subset may be *billable egress*; calculate actual inbound/outbound, inter-zone and client/partner traffic from flow telemetry before vendor pricing.

### 3.5 A proposed latency work-budget — not a percentile equation

Allocate the end-to-end p99 **target** into early subsystem work envelopes, solely to guide profiling. **Do not add observed component p99 percentiles to derive end-to-end p99**; concurrent request paths, covariance, queues, errors and retries invalidate that shortcut. Prove the full critical journey under real peak and N-1 fault tests.

| Element | Assumed share of end-to-end target | Engineering work envelope |
|---|---:|---:|
| Edge / auth token checking / transit | 15% | 240.0 ms |
| Application rules and API work | 25% | 400.0 ms |
| Database operations and commits | 40% | 640.0 ms |
| Contention, jitter, retry and test margin | 20% | 320.0 ms |

The design envelopes sum to 1600 ms; they are **planning allowances**, not measured SLI percentiles, and should be revised once distributed tracing exists.

### 3.6 Recovery timing and feasibility

Planned component time budget: **detect and declare incident 30min + provision spare VM and network 45min + restore dataset and files 180min + verify integrity and re-enable traffic 90min = 5.75 hours**, versus RTO **12 h** (modeled margin 6.25 h). These figures are *engineering hypotheses, not measured failover guarantees*; if any single step exceeds its allowance, revise the architecture.

| Failure-recovery step | Hypothetical elapsed budget |
|---|---|
| detect and declare incident | 1800 s |
| provision spare VM and network | 2700 s |
| restore dataset and files | 3 h |
| verify integrity and re-enable traffic | 1.5 h |

**Backup RPO caveat:** frequency alone is insufficient: incomplete or corrupt backup runs can make achieved RPO worse. Restoration throughput, available target capacity and encrypted backup-key access are mandatory measured checkpoints.

## 4. Selected design and architecture diagram

| Layer | Recommended candidate and rationale |
|---|---|
| Infrastructure / compute | Two modest virtual machines and one recoverable SQL database on the existing VMware cluster; spare hypervisor capacity, encrypted backup repository and off-site copies. |
| Network / ingress / segmentation | Internal reverse proxy; segmented application/database VLANs; two independent switches where available; no Internet ingress; backup transfer to alternate site. |
| Software architecture | Modular monolith with a single transactional database; nightly batch reconciliation and standard retry for transient failures. |
| Transactional store and backups | Self-managed PostgreSQL with 4-hourly application-consistent backups; immutable/off-site daily backup copies. |
| Identity | Corporate OIDC/SSO; LDAP bridge only if required |
| External dependencies | Corporate IdP; internal HR course roster (daily import) |
| Security | Confidential employee training records; encrypt in transit and at rest; access logged; country-of-operation residency only |
| Operations | Weekday 08:00–18:00 local; on-call not required outside hours |

```mermaid
flowchart LR
    EMP[Employees / Intranet]
    EDGE[Internal Reverse Proxy]
    APP[Portal VM Pool]
    DB[(PostgreSQL)]
    BACK[Encrypted Local Backup]
    OFF[Off-site Daily Copy]
    EMP --> EDGE
    EDGE --> APP
    APP --> DB
    DB --> BACK
    BACK --> OFF
```

> Diagram depicts a proposed deployment pattern, not a provider-specific implementation guarantee. A full SDD must expand all security groups/firewalls, route paths, subnet CIDRs, AZ/rack anti-affinity, certificates, dependencies, data movement and operational owners.

## 5. Actual requirements → infrastructure, network and software consequences

| Business requirement | Assumed input | Infrastructure decision | Network decision | Software/data decision |
|---|---|---|---|---|
| `CAP-01/02/04` Demand | 6 peak TPS; 12 external RPS | Provision 2 vCPU per fault domain (1 domain(s)) as first-pass CPU-only envelope; prove disk and memory separately | Design for ~2.9 Mb/s modeled application payload headroom; test east-west and failover burst | Bounded queue/retries, rate limits, load sheds noncritical requests |
| `CAP-07` Tail latency | p99 ≤1600 ms | CPU contention and DB IO tracing with p99 under peak | Minimize RTT and cross-datacenter synchronous hops | Index/test hot keys and limit critical sync call fanout |
| `REL-03` RTO | 12 h, scoped loss of an application VM or storage host while application-consistent backup remains accessible | Backup images and restore capacity available by incident start | Document DNS/firewall/spare subnet restoration | Document restore and reconcile runbook |
| `REL-04/10` RPO/correctness | 12 h | Verify <= 4 h recovery-point spacing with application consistency | Off-site protected backup transport | Coherent restore and manual reconciliation |
| `REL-01` Availability | 98.00%; 30d 864.00 min error-budget equivalent | Avoid shared failure domains; align support model | Edge/IdP/DNS dependencies part of end-to-end SLO | Degrade noncritical steps instead of letting the user journey fail |
| `DAT-02/06` Volume | 80 GiB initial + 0.45 GiB/day modeled | Disk/backup capacity includes indexes and replicas, not just raw events | Backup, CDC and bulk-copy link capacity to be sized | Retention, archival, partitions, purge and reconciliation |
| `SEC-02/04` Security | Confidential employee training records; encrypt in transit and at rest; access logged; country-of-operation residency only | Encrypted volumes, secrets and role split | TLS/segmentation, private DB and admin reachability | OIDC, authorization checks, secure logs, tenant isolation if applicable |
| `INT-01/09` Dependencies | Corporate IdP; internal HR course roster (daily import) | Service integration owner and HA gap review | Link reachability and external rate limits | Async adapter/outbox and timeouts |
| `ECO-01/03` TCO | $127,200 3-year model vs $150,000 ceiling | Avoid unnecessary hot redundancy for relaxed RTO | Egress/backups/extra links included in estimates | Decomposition cost and support burden must be justified |


## 6. All 70 master checklist inputs filled for this fictional initiative

The original standard contains **70** inputs. The table below provides a specific assumed answer or explained N/A for each, enabling the architect to practice replacing assumptions with real stakeholder evidence. The corresponding general *three-layer impacts* remain in the [standard](./Pre-SDD_Architecture_Standard_v1.md); case-specific consequences appear in Section 5 above.

### 6.1. Business objectives (8 inputs)

| Req ID / question | Completed example input | Evidence owner / approval status |
|---|---|---|
| `BUS-01` — Problem, business outcome and KPI with baseline, target, deadline | Reduce manual compliance-tracking effort by 30% in year one; business KPI owner: sponsor; baseline: None: net-new service. | Business sponsor/Product; **fictional assumed, not signed** |
| `BUS-02` — Critical user journeys, failure impact and journey priorities | Tier-2 critical journey: Publish a training completion and view assigned courses; outage loss modeled at $250/hour. | Business sponsor/Product; **fictional assumed, not signed** |
| `BUS-03` — In/out of scope; dependencies; MVP versus later phases | In: API/UI, durable core data, operations, SLO tests. Out: unrelated products and historical vendor platform rewrite; project scope is Employee Training & Certification Portal. | Business sponsor/Product; **fictional assumed, not signed** |
| `BUS-04` — Revenue/loss or safety impact per outage and per degraded minute | At-risk value: $250/h = $0.07/s. Business-impact calculation is an *assumption*, not actual loss evidence. | Business sponsor/Product; **fictional assumed, not signed** |
| `BUS-05` — Launch date, hard deadlines, blackout/change windows | Assumed deadline: 5 months after initiation; no deployments during agreed monthly financial/plant/change blackout window. | Business sponsor/Product; **fictional assumed, not signed** |
| `BUS-06` — Countries, users, contracts and accessibility/localization commitments | Users: 4,000; simultaneous active user forecast 180; audience: Corporate employees across two nearby office campuses; localization English-first with accessibility checks. | Business sponsor/Product; **fictional assumed, not signed** |
| `BUS-07` — Explicit prohibitions / non-goals (e.g., forbidden data movement) | Hard placement constraint: Classified training content must continue to work during Internet disconnection (assumed policy); processing/storage in organization-operated location only; no exception assumed. | Business sponsor/Product; **fictional assumed, not signed** |
| `BUS-08` — Commercial/legal obligations to customers and penalty conditions | Internal journey SLO 98.00% on a rolling 30-day window; any contractual penalties and external SLA wording require legal approval; not assumed equal to component SLA. | Business sponsor/Product; **fictional assumed, not signed** |

### 6.2. Capacity and latency (12 inputs)

| Req ID / question | Completed example input | Evidence owner / approval status |
|---|---|---|
| `CAP-01` — Transactions by **type**: normal and peak TPS, and define what a transaction counts | Business transactions defined as **Publish a training completion and view assigned courses**; normal active-hour avg 0.45 TPS and 10-minute peak 6 TPS. | Product + SRE; **fictional assumed, not signed** |
| `CAP-02` — API request rate (RPS), reads/writes, retries, fan-out, requests per business transaction | 2 externally visible API calls/transaction; peak 12 RPS; internal fan-out and retry amplification tested independently. | Product + SRE; **fictional assumed, not signed** |
| `CAP-03` — DAU/MAU, peak *simultaneously active* users, sessions and session duration | 4,000 total accounts; 180 simultaneously active users at peak; stateless HTTP session and OIDC token validation. | Product + SRE; **fictional assumed, not signed** |
| `CAP-04` — Hourly/daily/weekly peaks, seasonality, campaign and burst size/duration | Average active usage 8 h/day; burst for 10 min at 6 TPS; recovery may be scheduled around noncritical hours. | Product + SRE; **fictional assumed, not signed** |
| `CAP-05` — Forecasted growth by period and confidence, major future feature/product launches | Year-1 demand growth +25% over launch; rerun CPU/storage/network model at 1.0× and 1.25× load; review quarterly. | Product + SRE; **fictional assumed, not signed** |
| `CAP-06` — Payload/request/response sizes, file/object sizes, compression assumptions | Request+response byte budget 12 KiB per external API call; durable event/transaction payload 4 KiB (before indexes/replication). | Product + SRE; **fictional assumed, not signed** |
| `CAP-07` — p50, p95, p99 (and p99.9 if justified) *per critical journey*; units and observation window | Ingress-to-response p50 ≤180 ms; p95 ≤750 ms; p99 ≤1600 ms for the critical journey over a 30-day window; separate transient error rate objective. | Product + SRE; **fictional assumed, not signed** |
| `CAP-08` — Define where latency is measured (client end-to-end, ingress, service, batch completion) and what counts as failure | Timestamp at ingress proxy after TLS termination until valid API response; count timed-out/failed calls in error SLI (do not omit failures from availability). | Product + SRE; **fictional assumed, not signed** |
| `CAP-09` — Max queue age, processing deadline, freshness, end-to-end batch completion and backlog recovery target | Daily/report jobs complete within 4 h; async noncritical queue age ≤60 min. | Product + SRE; **fictional assumed, not signed** |
| `CAP-10` — Read/write mix, hot keys, expensive operations, query/report schedules | Assumed 80% reads / 20% writes for the noncritical journeys; verify indexes in profiling. | Product + SRE; **fictional assumed, not signed** |
| `CAP-11` — Expected request failures/timeouts/retry behavior at dependencies and load-shedding tolerance | Retry transient read once; enforce idempotency for create/update; circuit-break noncritical partner calls. | Product + SRE; **fictional assumed, not signed** |
| `CAP-12` — Resource-intensive AI/ML/media jobs if in scope: model size, token/compute demand, jobs and deadlines | No AI/ML/GPU jobs in scope; N/A by design. | Product + SRE; **fictional assumed, not signed** |

### 6.3. Reliability, RPO and RTO (10 inputs)

| Req ID / question | Completed example input | Evidence owner / approval status |
|---|---|---|
| `REL-01` — Availability SLO **per user journey**; denominator, service window, and measurement period | End-to-end 98.00% 30-day availability SLO for Publish a training completion and view assigned courses; excludes only formally accepted maintenance windows (none for complex). | Business continuity + SRE; **fictional assumed, not signed** |
| `REL-02` — SLA to customers vs internal SLO; what failures/exclusions count; penalties | Internal SLO only until customer/employee agreement is approved; monthly downtime budget calculated from 98.00%; component provider SLAs cannot substitute. | Business continuity + SRE; **fictional assumed, not signed** |
| `REL-03` — RTO per service/journey **and disaster scenario**: acceptable elapsed time to restored usable service | RTO **12 h** for loss of an application VM or storage host while application-consistent backup remains accessible; Complete primary-site loss or late-discovered logical corruption: separate RPO 24 h; RTO 48 h using protected backups and an agreed alternate site. | Business continuity + SRE; **fictional assumed, not signed** |
| `REL-04` — RPO per dataset/transaction and disaster scenario: acceptable *age of last recoverable data point* | RPO **12 h** for committed critical data under loss of an application VM or storage host while application-consistent backup remains accessible; scheduled recovery points every 4 h. | Business continuity + SRE; **fictional assumed, not signed** |
| `REL-05` — Scope of recoverable failure: process, node, rack, site, AZ, region, ransomware, vendor failure | Critical scope: loss of an application VM or storage host while application-consistent backup remains accessible; distinct site/region case: Complete primary-site loss or late-discovered logical corruption: separate RPO 24 h; RTO 48 h using protected backups and an agreed alternate site; ransomware handled with immutable backups, not quorum replicas. | Business continuity + SRE; **fictional assumed, not signed** |
| `REL-06` — Maximum tolerable business interruption, minimum service during degradation, manual fallback and reconciliation | Use status/manual ticket or report queue during recovery; staff approve any manual entries and reconcile after restore. | Business continuity + SRE; **fictional assumed, not signed** |
| `REL-07` — Recovery sequence and dependencies: authentication, payments, ledger, reporting, etc. | Recover network + identity → application → database → notifications/reports; verify each business journey. | Business continuity + SRE; **fictional assumed, not signed** |
| `REL-08` — Approved planned downtime, maintenance restrictions, deployment and upgrade windows | One 2-hour planned monthly maintenance window, subject to business approval; backup exercises isolated from production. | Business continuity + SRE; **fictional assumed, not signed** |
| `REL-09` — Frequency and accepted evidence for restore, failover, failback and cyber-recovery drills | Exercise semiannual: inject primary fault, verify RTO/RPO with data commits before/during fault, save logs/traces, and restore an immutable backup. | Business continuity + SRE; **fictional assumed, not signed** |
| `REL-10` — Data durability and correctness expectations distinct from availability | Accepted records must be internally consistent after backup restore; losses within explicitly approved RPO are reconciled manually. | Business continuity + SRE; **fictional assumed, not signed** |

### 6.4. Data and lifecycle (9 inputs)

| Req ID / question | Completed example input | Evidence owner / approval status |
|---|---|---|
| `DAT-01` — Business entities, system of record, ownership and data contracts | System of record for **Publish a training completion and view assigned courses** is the chosen DB after production authority transfer; business data owner approves schema and lifecycle. | Data owner; **fictional assumed, not signed** |
| `DAT-02` — Starting volume; records/day, GB/day, object size, peak writes and retention horizon | Starting data 80 GiB; modeled transactional events/day and additional growth computed in Section 3; event size 4 KiB. | Data owner; **fictional assumed, not signed** |
| `DAT-03` — Sensitivity classification: PII, financial, confidential, secrets, public | Confidential employee training records; encrypt in transit and at rest; access logged; country-of-operation residency only. | Data owner; **fictional assumed, not signed** |
| `DAT-04` — Residency, allowed processing/storage/backup locations and cross-border restrictions | organization-operated location only; temporary migrations/backup targets subject to data-owner approval; no unapproved cross-border copies. | Data owner; **fictional assumed, not signed** |
| `DAT-05` — Consistency, freshness, correctness, ordering and atomicity by operation | Strongly consistent source DB writes; reporting may lag up to a business day; reject duplicate submissions. | Data owner; **fictional assumed, not signed** |
| `DAT-06` — Retention, records hold, archive, deletion, portability and right-to-erasure requirements | Hot data 365 days, archive additional 730 days (fictional policy), then approved deletion unless legal hold; test purge/retention. | Data owner; **fictional assumed, not signed** |
| `DAT-07` — Multi-tenancy model, tenant isolation level, noisy-neighbor tolerance, tenants and growth | Single organization/account partition; no external multi-tenant SLA; role-based data partition enforced. | Data owner; **fictional assumed, not signed** |
| `DAT-08` — Reporting, analytics, batch exports, reconciliation frequency and data latency | Daily reporting and batch extracts; reporting freshness by next business day; any missing acknowledged source record blocks data-integrity acceptance. | Data owner; **fictional assumed, not signed** |
| `DAT-09` — Restore granularity (tenant/table/whole system), point-in-time needs and recovery verification | Restore complete DB and attachments to one coherent recovery point; tenant/row granular restore is a later requirement. | Data owner; **fictional assumed, not signed** |

### 6.5. Security and governance (8 inputs)

| Req ID / question | Completed example input | Evidence owner / approval status |
|---|---|---|
| `SEC-01` — Laws, contracts, certifications and organization policies *actually applicable*; control mappings | Assume baseline internal security and privacy controls; *no special industry certification assumed*; security/legal must validate actual contractual or statutory obligations. | Security/Legal; **fictional assumed, not signed** |
| `SEC-02` — Actors, partner identities, workforce, machine principals, customer identity sources | Access actors: Corporate employees across two nearby office campuses; admin, support operator, service identity and auditor; Corporate OIDC/SSO; LDAP bridge only if required. | Security/Legal; **fictional assumed, not signed** |
| `SEC-03` — Threat/risk classification, acceptable residual risk and adversary concerns | Medium: PII exposure, role bypass, ransomware, and accidental deletion; complete threat model before release. | Security/Legal; **fictional assumed, not signed** |
| `SEC-04` — Encryption at rest/in transit, BYOK/HYOK, key custody, rotation, certificate requirements | TLS 1.2+ or approved equivalent, encryption at rest, rotated service credentials and secrets in managed vault; network/database access least privilege in organization-operated data center. | Security/Legal; **fictional assumed, not signed** |
| `SEC-05` — Audit events, non-repudiation, investigation and evidence retention | Audit create/update/export/read of sensitive records, admin changes and restore invocations; protect logs against tampering. | Security/Legal; **fictional assumed, not signed** |
| `SEC-06` — Vulnerability, patch, pen-test, SBOM/supply-chain and incident reporting obligations | CI SAST/DAST/SBOM, automated dependency scanning, quarterly failover and pen-test scope before production; emergency patch procedure. | Security/Legal; **fictional assumed, not signed** |
| `SEC-07` — Required separation of duties, privileged access, break glass and tenant/customer administration | Separate platform admins, production deployers, data owners and incident commanders; break-glass use audited and time-limited. | Security/Legal; **fictional assumed, not signed** |
| `SEC-08` — Third-party processor/subprocessor and vendor risk restrictions | Third-party providers/IdP reviewed by procurement/security; restrict data sharing and define deletion/export obligations; no assumed certification inheritance. | Security/Legal; **fictional assumed, not signed** |

### 6.6. Integrations and networking (9 inputs)

| Req ID / question | Completed example input | Evidence owner / approval status |
|---|---|---|
| `INT-01` — Catalogue of upstream/downstream systems, owner, interface, business criticality | Dependencies: Corporate IdP; internal HR course roster (daily import); ownership/availability documented per dependency. | Integration + Network; **fictional assumed, not signed** |
| `INT-02` — Synchronous API vs event/file/batch, update frequency, order and delivery expectations | UI→app synchronous API; reporting/notification async or scheduled batch; bounded retry and dead-letter handling. | Integration + Network; **fictional assumed, not signed** |
| `INT-03` — External API quotas, latencies, SLAs, maintenance and rate limits | Assume external email/HR API quota 20 RPS; enqueue excess and measure delivery p99 separately. | Integration + Network; **fictional assumed, not signed** |
| `INT-04` — Failure behavior: reject, retry, queue, compensate, or manual handling | On integration outage: accept local transaction, queue notification, replay within agreed manual SLA. | Integration + Network; **fictional assumed, not signed** |
| `INT-05` — Consistency and ordering guarantees, duplicate tolerance, maximum delay | Best-effort report events, at-least-once delivery; duplicates removed at consumer, no global ordering requirement. | Integration + Network; **fictional assumed, not signed** |
| `INT-06` — Existing public IP, allowlists, firewall change process, proxies, DNS and certificate dependencies | DNS, TLS certificates, partner allowlists and IdP endpoints inventoried; Internal reverse proxy; segmented application/database VLANs; two independent switches where available; no Internet ingress; backup transfer to alternate site. | Integration + Network; **fictional assumed, not signed** |
| `INT-07` — Client geography, edge locations, remote branches, IoT and intermittent/offline operation | Corporate employees across two nearby office campuses; nominal latency measured at ingress, not synthetic zero-RTT localhost; offline/WAN contingency: Classified training content must continue to work during Internet disconnection (assumed policy). | Integration + Network; **fictional assumed, not signed** |
| `INT-08` — Address ranges, DNS zones, IP overlap, IPv4/IPv6, routing and private connectivity constraints | IP addressing & routing: Internal reverse proxy; segmented application/database VLANs; two independent switches where available; no Internet ingress; backup transfer to alternate site.; reject overlapping ranges for source/target connectivity; validate symmetric flows and firewall rules. | Integration + Network; **fictional assumed, not signed** |
| `INT-09` — External SLA dependencies; legal or operational inability to move a peer system | External HR/payroll/email dependency may be unavailable; fail only dependent noncritical functions and queue work. | Integration + Network; **fictional assumed, not signed** |

### 6.7. Operations and delivery (8 inputs)

| Req ID / question | Completed example input | Evidence owner / approval status |
|---|---|---|
| `OPS-01` — Support hours, user hours, incident severities, response and escalation commitments | Weekday 08:00–18:00 local; on-call not required outside hours; incident escalation starts at critical journey failure, not at app host alarm. | Operations/Delivery; **fictional assumed, not signed** |
| `OPS-02` — Team skills, support model, managed-service restrictions and ownership boundaries | Platform/generalist ops + one database owner, documented restore roles and tested escalation. | Operations/Delivery; **fictional assumed, not signed** |
| `OPS-03` — Release frequency, rollback tolerance and change-freeze windows | Biweekly releases; image/IaC rollback for code, database schema recovery separately tested. | Operations/Delivery; **fictional assumed, not signed** |
| `OPS-04` — Environments needed: dev, test, perf, stage, prod, DR; isolation and test data rules | Dev, staging and prod, separate recoverability test environment; masked sample data only. | Operations/Delivery; **fictional assumed, not signed** |
| `OPS-05` — Logging/tracing/metric retention, event cardinality, alerting and forensic search | 30-day searchable logs and 12-month monthly service indicators; alert on backups, errors, p99, CPU and disk. | Operations/Delivery; **fictional assumed, not signed** |
| `OPS-06` — Business continuity runbooks, escalation matrix and authority to invoke failover | Operations duty lead declares incident, restores backup with DBA approval and logs data-loss assessment. | Operations/Delivery; **fictional assumed, not signed** |
| `OPS-07` — Changeover, reversibility, customer communication and decommissioning expectations | Go-live 5 months after initiation; no pre-existing production users to migrate; disaster failback tested. | Operations/Delivery; **fictional assumed, not signed** |
| `OPS-08` — Testing scope: load, soak, chaos/fault injection, DR, security, compliance, accessibility | Peak/soak, 1-year projected load, database restore, security threat model and UAT, including report/export verification. | Operations/Delivery; **fictional assumed, not signed** |

### 6.8. Economics and constraints (6 inputs)

| Req ID / question | Completed example input | Evidence owner / approval status |
|---|---|---|
| `ECO-01` — One-time implementation/migration budget and recurring annual/monthly run-cost envelope | One-time deployment/migration $48,000; modeled recurring $2,200/month; 3-year ceiling $150,000. | Business finance; **fictional assumed, not signed** |
| `ECO-02` — CapEx/OpEx preferences, currency, commitment period, chargeback unit | USD, 36-month TCO, incremental project CapEx plus recurring operations, no financing/tax/provider quote; include labor in monthly allowance. | Business finance; **fictional assumed, not signed** |
| `ECO-03` — TCO horizon and required benefits (cost, speed, risk, flexibility) | 36-month modeled TCO $127,200; headroom under assumed cap $22,800; schedule quarterly forecast review. | Business finance; **fictional assumed, not signed** |
| `ECO-04` — Delivery deadline, acceptable delivery risk, available people and vendor approval duration | Delivery deadline 5 months after initiation; procurement and expertise availability are gated, not assumed to be approved. | Business finance; **fictional assumed, not signed** |
| `ECO-05` — Environmental/energy footprint goals **if applicable**, measurement expectations | No separately approved carbon-intensity requirement; efficiency reviewed during sizing (N/A until sponsor sets KPI). | Business finance; **fictional assumed, not signed** |
| `ECO-06` — Exit portability expectations, vendor lock-in tolerance and contract termination rights | Hardware/VM image export, DB dump and independent backup restore demonstrated; vendor license exit checked. | Business finance; **fictional assumed, not signed** |

## 7. Path-specific technical discovery

**Procurement and physical footprint:** reserve CPU/RAM/storage in existing facility, verify two power feeds or explicit single-power risk, hypervisor licenses, spare-switch inventory, equipment RMA and restoration staffing. **Why not cloud:** Classified training content must continue to work during Internet disconnection (assumed policy). **Disaster boundary:** Complete primary-site loss or late-discovered logical corruption: separate RPO 24 h; RTO 48 h using protected backups and an agreed alternate site.

## 8. Options appraisal and modeled 36-month economics

Cost estimates below are hypothetical line-item allowances, **not vendor quotes**. The monthly figure includes incremental allocated operations/engineering effort, infrastructure/services, network, backups and observability; it does not establish an actual provider price. One-time costs include a procurement allowance on-prem, and migration labor/testing for brownfield where applicable. Excludes taxes, financing, contractual discounts and unapproved headcount assumptions.

**Preferred candidate TCO arithmetic:** $48,000 + 36 × $2,200 + $0 = **$127,200 (36-month illustrative TCO)**; cap $150,000, difference **$22,800**.

**Invented monthly allowance breakdown (sum equals the monthly TCO input):**

| Category | Illustrative monthly spending envelope |
|---|---:|
| Compute, managed runtime and licenses | $770 |
| DB, files, backup and archival | $440 |
| Network, transit, monitoring, security tooling | $330 |
| Allocated on-call, SRE and platform labor | $660 |

**Finance stress test:** if monthly run costs were 25% above this fictional allowance for all 36 months, modeled TCO would be **$147,000** versus $150,000 cap — **within budget at this stress level**. This is not a forecast or an actual vendor quote. The growth-capacity additions from Section 3 require real pricing/availability before sign-off.

| Alternative | Hard constraint | RTO/RPO feasibility at stated scope | Illustrative 36-month cost | Decision |
|---|---|---|---:|---|
| On-prem VMs + scheduled restore | Pass | Within 12 h, if backup/restore tests pass | $127,200 | Recommended: offline requirement |
| Cloud-only managed application | Fail: Internet independence | Not eligible | $100,800 | Excluded by hard constraint |
| Dual-site active-active | Pass | Unnecessary for relaxed recovery | $450,000 | Avoid complexity/cost |

**Architecture decision rule:** hard constraints and critical correctness/recovery come first; cost is compared only among feasible options. Even the preferred candidate needs measurement.

## 9. Migration overlay and 7R decisions

**No source system is being moved across environments in this example.** The seven Rs are **N/A** rather than arbitrarily assigning a cloud migration strategy to a net-new implementation. For same-site brownfield relocation/modernization the analogues replatform/refactor are documented in the ADRs; the source→target cutover remains governed separately.


## 10. Decision Tree — executed outcome for this case

| Gate | Question | Sample outcome |
|---|---|---|
| G1: Business | Named journey, sponsor and business value? | YES as fictional assumption; business re-sign required in real use |
| G2: Classification | Existing workload? hosting path? migration?  | GF-OP; overlay None |
| G3: Hard constraints | Residency, offline operation, deadlines/security eligible? | Concept passes with placement reason: Classified training content must continue to work during Internet disconnection (assumed policy) |
| G4: NFR feasibility | p99 ≤1600 ms; RPO 12 h; RTO 12 h | CONDITIONAL: recovery budget and throughput mathematically plausible, not benchmarked |
| G5: Migration | Cross-platform migration needed? | No: greenfield |
| G6: Economics/operations | Expected 36-month model below cap? staffing? | MODELED PASS: $127,200 < $150,000; vendor quotes / staffing not validated |
| G7: ADRs & tests | Alternatives recorded, measurable tests defined? | YES: ADR candidates and verification plan below |
| G8: Authorization | Real approvals and SLO evidence received? | **NOT YET — cannot approve Pre-SDD on invented inputs** |

```mermaid
flowchart TD
    A[Business sponsor and critical journey defined] --> B{Existing product?}
    B -->|No| C[GF: classify current estate]
    C --> D{Hosting placement}
    D -->|On-prem| E[GF-OP: path checklist]
    E --> F{Critical RPO and RTO feasible?}
    F -->|Requires proof| G[Calculate capacity and verify recovery design]
    G --> H{Migration needed?}
    H -->|No| I[No cross-platform migration]
    I --> J{TCO and constraints pass?}
    J -->|Assumed yes| K[Draft ADRs and acceptance tests]
    K --> L[Pre-SDD gate: conditional pending real evidence]
```

**Example branch trace:** New application: Greenfield → Target must operate without Internet: On-prem → RPO 12 h / RTO 12 h: backup & restore → Cost below assumed ceiling → Provisional decision: GF-OP VM-based.

## 11. Proposed Architecture Decision Records (ADRs) and traceability

| Proposed ADR | Required inputs | Recommended decision | Rejected alternative / consequence | SDD output | Validation evidence |
|---|---|---|---|---|---|
| ADR-GF_OP_Simple-001: Hosting | BUS-05, BUS-07, ECO-01 | Organization-owned primary data center | Alternative placement violates constraints or delivery/economic fit | Deployment view, fault domains, responsibility matrix | Architecture gate and facility/landing-zone checklist |
| ADR-GF_OP_Simple-002: RPO/RTO/DR | REL-01, REL-03, REL-04, REL-05 | Self-managed PostgreSQL with 4-hourly application-consistent backups; immutable/off-site daily backup copies. | Do not promise stronger untested site/region RTO | Recovery design, data authority and runbooks | Scoped recovery ≤12 h and data loss ≤12 h |
| ADR-GF_OP_Simple-003: Scaling | CAP-01, CAP-02, CAP-05, CAP-07 | 2 modeled vCPU/domain; 1 fault domain(s) | Pure average TPS sizing and unmeasured p99 disallowed | Load model, deployment sizing and observability | N-1 peak + year-1 growth, p99 and error SLIs |
| ADR-GF_OP_Simple-004: Networking | INT-01, INT-06, INT-08 | Internal reverse proxy; segmented application/database VLANs; two independent switches where available; no Internet ingress; backup transfer to alternate site. | Avoid undocumented synchronous offsite calls / DNS-only failover | Network zone/CIDR diagram, flow and security matrix | Traffic replay, link-loss exercise, firewall/RTT measurements |
| ADR-GF_OP_Simple-005: Software boundaries | DAT-05, INT-02, REL-10 | Modular monolith with a single transactional database; nightly batch reconciliation and standard retry for transient failures. | Avoid redundant microservices or uncontrolled write authority | Component model, transaction/outbox/error semantics | Replay, idempotency, transaction/contract tests |

**Required trace chain:** `REQ ID → design impact → option/decision → proposed ADR → SDD section → test evidence`. A real ADR remains **Proposed** until reviewed; a design sentence above is not an approved ADR.

## 12. Concrete validation plan and acceptance thresholds

| Test ID | How to test | Pass/fail threshold |
|---|---|---|
| TEST-CAP-01 | Replay peak 6 TPS using 2 API requests/txn for >=30 min, 30-day-like mix and realistic payloads | Throughput ≥6 TPS; p50/p95/p99 ≤180/750/1600 ms; error SLI within approved budget |
| TEST-CAP-02 | Repeat at year-1 demand 8 TPS | Either pass SLO with funded additional capacity or record scaling lead time and milestone |
| TEST-DR-01 | Inject loss of an application VM or storage host while application-consistent backup remains accessible, generate uniquely numbered committed business transactions immediately before/during event | Measured journey interruption ≤12 h and loss age ≤12 h; no acknowledged duplicate effects |
| TEST-DR-02 | Restore from an isolated/immutable backup without trusting primary replicated data | Demonstrate Complete primary-site loss or late-discovered logical corruption: separate RPO 24 h; RTO 48 h using protected backups and an agreed alternate site with exact measured times; document any exception |
| TEST-SEC-01 | Pen-test roles and service identity; verify no unauthorized access, secrets in logs or direct data-tier ingress | No release-blocking findings; auditor retains evidence |
| TEST-OPS-01 | Break DNS/IdP/partner channel, replay retries, verify alerts, runbook and ownership | Critical path unaffected where claimed; noncritical buffering and reconciliation confirmed |

**Evidence capture:** run ID, timestamps, test environment/topology, workload generator parameters, fault command/time, commits sent/acknowledged, first successful post-fault business response, p50/p95/p99 charts, SLI error counts, reconciliation and owner approval. Do not declare pass from an infrastructure health dashboard alone.

## 13. Risks, gaps and assumptions requiring ownership

- [ ] Off-site copy remains usable during ransomware or site loss — owner: Lead architect/SRE/Data owner; severity to be assessed; closing artifact: verified evidence or signed exception.
- [ ] Alternate-site server reservation is real, not theoretical — owner: Lead architect/SRE/Data owner; severity to be assessed; closing artifact: verified evidence or signed exception.
- [ ] IdP outage during Internet isolation requires cached session policy — owner: Lead architect/SRE/Data owner; severity to be assessed; closing artifact: verified evidence or signed exception.
- [ ] Replace all invented traffic, cost, recovery and legal assumptions with named business/data/platform owners and supporting measurements; **this item always blocks production sign-off**.
- [ ] Confirm security/privacy compliance, purchased vendor SKU behavior, regional service parity, RPO/RTO definitions and deployment runbook with actual teams.

## 14. Pre-SDD gate decision and sign-off matrix

**Preliminary architectural recommendation:** use **GF-OP / Simple** path, candidate **On-prem VMs + scheduled restore**, and the DR/correctness strategy in ADR-002. The workload math demonstrates an engineering sizing *hypothesis*, not achieved SLIs.

| Required authority | Sign-off in fictional sample | Real rollout action |
|---|---|---|
| Business sponsor / Product | **Not signed** (training example) | Validate targets, evidence, risk and cost before SDD baseline |
| Data owner / Compliance | **Not signed** (training example) | Validate targets, evidence, risk and cost before SDD baseline |
| Security | **Not signed** (training example) | Validate targets, evidence, risk and cost before SDD baseline |
| Network / Infrastructure / Cloud platform | **Not signed** (training example) | Validate targets, evidence, risk and cost before SDD baseline |
| SRE / Operations | **Not signed** (training example) | Validate targets, evidence, risk and cost before SDD baseline |
| Enterprise Architecture Board | **Not signed** (training example) | Validate targets, evidence, risk and cost before SDD baseline |

**Gate conclusion:** **CONDITIONAL / NOT APPROVED** because the inputs are assumed, not provided and signed by an accountable business team, and the critical SLI/failover/restore evidence has not been measured. An architect following this standard must close the red items or obtain an authorized, time-bound waiver before starting a production SDD.

## 15. Public architecture references (inspiration, not the source of hypothetical sample numbers)

- [Google Cloud: Disaster recovery planning guide](https://docs.cloud.google.com/architecture/dr-scenarios-planning-guide)
- [PostgreSQL: Synchronous replication, quorum and availability trade-offs](https://www.postgresql.org/docs/17/warm-standby.html)

> These references inform available patterns and limitations. They **do not** establish any of the fictional traffic, failure time budgets, budget prices or achieved SLOs in this exercise. Check current service SKU, quota, pricing and service-level guarantees at project time.


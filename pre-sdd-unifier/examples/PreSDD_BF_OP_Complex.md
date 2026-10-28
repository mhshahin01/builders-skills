# Worked Pre-SDD | BF-OP | Complex — Legacy Factory Order Scheduler — Resilience Refactor

**Example ID:** EX-BF-OP-Complex  
**Classification:** Brownfield × On-premises  
**Primary recovery tier:** Complex — Both RPO **2 s** and RTO **8 s** are **strictly less than 10 seconds** for the stated primary failure scope.  
**Migration overlay:** Same-site modernization with data migration  
**Version/date:** 1.0 / 2026-10-16  
**Status:** ILLUSTRATIVE WORKED EXAMPLE, **NOT** a real stakeholder-approved Pre-SDD. Every person, product, demand number, target, time allowance, price and budget below is intentionally **invented** for architectural training unless a public reference explicitly substantiates a general service behavior.

**Companion documents:** [Pre-SDD Standard](./Pre-SDD_Architecture_Standard_v1.md) · [Blank Intake](./Pre-SDD_Project_Intake_Template.md) · [Case Index](./PreSDD_Examples_README.md)

## 1. Business brief, responsibility and classification

| Field | Completed fictional business input |
|---|---|
| Business sponsor / sign-off | VP Operational scheduling (not safety PLC control) (role is illustrative; no real signature) |
| Product owner / data owner | Product Manager + domain Data Steward (illustrative) |
| Lead architect / design authority | Enterprise Solution Architect + Architecture Review Board (illustrative) |
| Problem/outcome | Reduce current 90-second scheduler failover to ≤8 seconds |
| Critical journey | Accept one dispatch order exactly once during rack failure |
| Population | 24/7 factory logistics and inventory dispatch team |
| Source/current estate | Single rack Java monolith + PostgreSQL primary/async replica; peak observed 500 TPS, p99 850 ms, past failover ~90 s; one synchronous ERP RPC |
| Source→target | Legacy on-prem rack A, 650 GiB active database → Three rack-separated on-prem cluster in the same industrial data center |
| Path / direction | BF-OP / Same-site modernization with data migration |
| Hard placement guardrail | IT scheduler must work without external WAN; physical plant control systems stay on site |
| Deadline | 12 months staged modernization |
| Compliance baseline | Internal production data; network isolation from safety controllers; traceable dispatcher permissions |
| Assumed financial exposure | $600,000/hour of critical-journey outage |

**Why classification is correct.** The workload already runs, has legacy state and dependencies, and requires discovery and reversible changes. Target placement is Three rack-separated on-prem cluster in the same industrial data center. The migration overlay is recorded separately; it does not create a fifth branch.

## 2. NFR contract, scope and business-impact arithmetic

| Dimension | Fictional business target, exact semantics |
|---|---|
| RPO for primary incident | 2 s for last recoverable committed data |
| RTO for primary incident | 8 s until the business API/journey is usable |
| Incident/fault scope | loss of one host/rack (including current elected DB writer), other two racks healthy |
| Separate full site / region disaster | Full data-center site loss: RPO 4 h; RTO 36 h (separately designed cold recovery) |
| Availability SLO | 99.99% 30-day critical-journey success; failed/time-out calls counted as errors |
| p50 / p95 / p99 | ≤85 / ≤200 / ≤350 milliseconds; edge ingress-to-valid-response critical journey |
| Average vs peak | 90 TPS during 20 active h/day / 700 TPS for 10 minutes |
| API RPS at peak | 2,100 external requests/s; each business transaction performs 3 such requests |
| Peak simultaneously active users | 230 (not to be confused with peak in-flight requests) |
| Year-1 demand growth | +35%; validate at 1.35× additional load |
| Data correctness | No double authorization/charge and durable acknowledged writes with deduplication |
| Support / escalation | 24×7 on-prem SRE + plant IT incident responders |

**Scope is binding:** `loss of one host/rack (including current elected DB writer), other two racks healthy`. **Other disasters have different commitments:** Full data-center site loss: RPO 4 h; RTO 36 h (separately designed cold recovery). RTO is elapsed time from loss of the scoped business journey until a verified usable journey returns; RPO is the age of last recoverable committed business data at the incident point. It is wrong to claim site/region/cyber recovery meets 8 s just because a node/rack/zone test does.

**30-day downtime budget:** `(1 - 99.99000/100) × 30 × 24 × 3600 = 259.2 seconds = 4.32 minutes`. This is an illustrative **end-to-end journey** error budget, not an individual cloud service SLA. One recovery exercise may consume part of it. The worst-case single-incident RTO of 8 s consumes 3.1% of a full 30-day error budget; all other incidents, deployments and dependency failures must fit the remainder for the period SLO to pass.

**Outage impact at the target RTO (linear approximation):** `$600,000/h × (8 s ÷ 3600) = $1,333.33`; actual loss is scenario-specific and may be nonlinear.

## 3. Transparent workload, CPU, network and storage calculations

### 3.1 Workload → CPU and concurrency

- **Transactions/day:** `90 avg TPS × 20 active h/day × 3,600 = 6,480,000 business transactions/day` (not 700 peak TPS all day).
- **Peak API demand:** `700 TPS × 3 external requests/transaction = 2,100 RPS` (internal RPCs and retries add separate load).
- **Modeled CPU work:** `700 TPS × 14 ms CPU/transaction ÷ 1,000 = 9.80 busy vCPU cores` before overhead and N-1 protection.
- **N-1 domain sizing:** `ceil(9.80 ÷ (2 surviving domains × 0.60 max modeled CPU))`, rounded up to even vCPUs = **10 vCPU per domain**, across 3 zones/racks (**30 allocated vCPU**). Surviving capacity 20 vCPU → estimated 49.0% CPU during peak after one domain loss; this excludes DB/queue CPU, reserves and hypervisor overhead.
- **Year-1 expansion decision:** +35% peak traffic raises modeled CPU demand from 9.80 to 13.23 busy cores; maintain a 60% modeled CPU ceiling and N-1 fault-domain tolerance by increasing from **10 → 12 app vCPU per domain**, i.e. **6 additional vCPU** overall in the first year. Reserve purchasable on-prem hardware now; capex delivery depends on procurement lead time.
- **Little's Law, in-flight API estimate:** `2,100 external RPS × 0.150 s assumed **mean** response time = 315.0 in-flight API requests` at peak. These are **not** simultaneous human users; do not use p99 as the average.

### 3.2 Network demand and burst allowance

- **Application payload:** `2,100 RPS × 6 KiB round-trip/request × 1,024 B/KiB × 8 bits/B ÷ 1,000,000 = 103.22 Mb/s`, measured as total application traffic budget across request + response.
- **Engineering envelope:** `103.22 × 3 = 309.66 Mb/s` for illustrative retries, framing and bursts, **not** a physical link guarantee; add TLS, database replication, backups, migration, logging and cross-site flows separately.
- **Placement impact:** Separate IT/OT VLANs, redundant rack switches and routed VIP/service mesh that does not require DNS TTL change, measured inter-rack RTT <2 ms, asynchronous ERP adapter.

### 3.3 Durable data growth and retention (uncompressed model)

- **Transactional event volume:** `6,480,000 transactions/day × 4 KiB/event ÷ (1,024 × 1,024) = 24.719 GiB/day`.
- **Additional nontransactional data:** `1.000 GiB/day` (files, attachments, reference data or indexes modeled separately, scenario dependent). Total logical growth **25.719 GiB/day**.
- **12-month no-deletion baseline:** `650 GiB initial + 365 × 25.719 GiB/day = 10,037.5 GiB`. This is a planning bound; active-data TTL can lower net production size.
- **Retention buffers:** hot 14 days × 25.719 = **360.1 GiB** of new logical data, archive +365 days × 25.719 = **9,387.5 GiB** (before compression, index amplification, snapshots, backup copies and replica count).
- **Durable replication planning:** one logical event stream modeled at 24.719 GiB/day → **74.158 GiB/day** if 3 physical copies are provisioned. Actual DB/log/queue products differ; do not multiply every store twice.

### 3.4 Storage footprint, application memory and database IOPS screening

- **DB operations:** assume 4 logical reads and 2 logical writes per business transaction at the peak (a *different* measure from API RPS). `700 TPS × (4 reads + 2 writes) = 4,200 logical ops/s`. Double this **fictional** demand for index/WAL amplification and bursts: **8,400 storage operation/s screening envelope**. These do **not** replace real device/service IOPS tests, write latency or database service quotas.
- **Protected hot footprint:** `(initial 650 GiB + last 14 days 360.1 GiB) × 1.40 index/WAL allowance × 3 retained live physical replica(s) × 1.25 free-capacity allowance = ~5,303 GiB physical-equivalent provisioned`. Archive (9,387.5 GiB), offsite backup and temporary migration copies are **additional**. Managed cloud storage billing may abstract replicas and must **not** be treated as 3 customer-provisioned disks.
- **Memory envelope (not measured):** `10 application vCPU/domain × 4 GiB/vCPU = 40 GiB/domain` for early VM/pod-request modeling; multiply by 3 fault domains for **120 GiB total** application allocation, excluding DB, message platform, OS and observability. Profile heap/working set before ordering hosts or SKUs.
- **Write-replication steady-state wire payload:** `700 peak TPS × 4 KiB/event × 2 additional live replicas × 1,024 × 8 ÷ 1e6 = 45.88 Mb/s`, **in addition** to the 103.22 Mb/s API round-trip workload and burst factors. Partition replay or restoring a replica can overwhelm this steady-state figure; reserve repair bandwidth and test link failure.
- **Monthly API payload volume, both directions:** `90 TPS × 20 h/day × 3,600 × 30 days × 3 calls × 6 KiB ÷ (1,024²) = 3,337.1 GiB/month`. Only a subset may be *billable egress*; calculate actual inbound/outbound, inter-zone and client/partner traffic from flow telemetry before vendor pricing.

### 3.5 A proposed latency work-budget — not a percentile equation

Allocate the end-to-end p99 **target** into early subsystem work envelopes, solely to guide profiling. **Do not add observed component p99 percentiles to derive end-to-end p99**; concurrent request paths, covariance, queues, errors and retries invalidate that shortcut. Prove the full critical journey under real peak and N-1 fault tests.

| Element | Assumed share of end-to-end target | Engineering work envelope |
|---|---:|---:|
| Edge / auth token checking / transit | 15% | 52.5 ms |
| Application rules and API work | 25% | 87.5 ms |
| Database operations and commits | 40% | 140.0 ms |
| Contention, jitter, retry and test margin | 20% | 70.0 ms |

The design envelopes sum to 350 ms; they are **planning allowances**, not measured SLI percentiles, and should be revised once distributed tracing exists.

### 3.6 Recovery timing and feasibility

Planned component time budget: **detect failed writer/zone 2s + fence old writer and confirm quorum 2s + health-based dispatch routing 2s + idempotent retry and acknowledgement 1s = 7 seconds**, versus RTO **8 s** (modeled margin 1 s). These figures are *engineering hypotheses, not measured failover guarantees*; if any single step exceeds its allowance, revise the architecture.

| Failure-recovery step | Hypothetical elapsed budget |
|---|---|
| detect failed writer/zone | 2 s |
| fence old writer and confirm quorum | 2 s |
| health-based dispatch routing | 2 s |
| idempotent retry and acknowledgement | 1 s |

**Sub-10s engineering caveat:** node/rack/zone automatic failover is not region-wide DR, DNS-only changes are not a deterministic 8-second mechanism, and application availability must include quorum, token checking and the client retry. Quorum write acknowledgment protects *committed* operations; anything not acknowledged may need outcome lookup plus idempotent retry. Test partitions and failback as well as clean node failure.

## 4. Selected design and architecture diagram

| Layer | Recommended candidate and rationale |
|---|---|
| Infrastructure / compute | Three independent racks, hot capacity for remaining two racks, three DB voting replicas, broker with durable partitions, redundant local power and storage; physical-spare procurement. |
| Network / ingress / segmentation | Separate IT/OT VLANs, redundant rack switches and routed VIP/service mesh that does not require DNS TTL change, measured inter-rack RTT <2 ms, asynchronous ERP adapter. |
| Software architecture | Strangler extraction of dispatch authorization and reservation from monolith; transactional outbox; command deduplication, single-writer ownership and automated fence/retry. |
| Transactional store and backups | Migrate shared PostgreSQL schema into explicit scheduler-owned transactional schema; synchronous quorum replication for accepted orders; CDC during staged migration. |
| Identity | Local IAM/SSO with cacheable issued tokens; privilege separation |
| External dependencies | Local warehouse devices, inventory DB, ERP: replace synchronous ERP call with outbox delivery |
| Security | Internal production data; network isolation from safety controllers; traceable dispatcher permissions |
| Operations | 24×7 on-prem SRE + plant IT incident responders |

```mermaid
flowchart LR
    DEVICE[Warehouse Dispatch Clients]
    PROXY[Health-Aware Local Router]
    OLD[Legacy Monolith: Noncritical Paths]
    NEW[Scheduler Service x 3 Racks]
    DB[(3-Rack Transaction Quorum)]
    OUT[Outbox + Durable Events]
    ERP[Async ERP Adapter]
    DEVICE --> PROXY
    PROXY --> OLD
    PROXY --> NEW
    NEW --> DB
    DB --> OUT
    OUT --> ERP
```

> Diagram depicts a proposed deployment pattern, not a provider-specific implementation guarantee. A full SDD must expand all security groups/firewalls, route paths, subnet CIDRs, AZ/rack anti-affinity, certificates, dependencies, data movement and operational owners.

## 5. Actual requirements → infrastructure, network and software consequences

| Business requirement | Assumed input | Infrastructure decision | Network decision | Software/data decision |
|---|---|---|---|---|
| `CAP-01/02/04` Demand | 700 peak TPS; 2,100 external RPS | Provision 10 vCPU per fault domain (3 domain(s)) as first-pass CPU-only envelope; prove disk and memory separately | Design for ~309.7 Mb/s modeled application payload headroom; test east-west and failover burst | Bounded queue/retries, rate limits, load sheds noncritical requests |
| `CAP-07` Tail latency | p99 ≤350 ms | CPU contention and DB IO tracing with p99 under peak | Minimize RTT and cross-datacenter synchronous hops | Index/test hot keys and limit critical sync call fanout |
| `REL-03` RTO | 8 s, scoped loss of one host/rack (including current elected DB writer), other two racks healthy | Hot pre-warmed capacity and election if <10 sec | Health routed VIP/LB for sub-10s | Idempotent retries and readiness checks |
| `REL-04/10` RPO/correctness | 2 s | Synchronous quorum commit for scoped single fault, plus independent backup | Inter-domain quorum RTT/capacity | Atomic commits and safe replay |
| `REL-01` Availability | 99.99%; 30d 4.32 min error-budget equivalent | Avoid shared failure domains; align support model | Edge/IdP/DNS dependencies part of end-to-end SLO | Degrade noncritical steps instead of letting the user journey fail |
| `DAT-02/06` Volume | 650 GiB initial + 25.72 GiB/day modeled | Disk/backup capacity includes indexes and replicas, not just raw events | Backup, CDC and bulk-copy link capacity to be sized | Retention, archival, partitions, purge and reconciliation |
| `SEC-02/04` Security | Internal production data; network isolation from safety controllers; traceable dispatcher permissions | Encrypted volumes, secrets and role split | TLS/segmentation, private DB and admin reachability | OIDC, authorization checks, secure logs, tenant isolation if applicable |
| `INT-01/09` Dependencies | Local warehouse devices, inventory DB, ERP: replace synchronous ERP call with outbox delivery | Service integration owner and HA gap review | Link reachability and external rate limits | Async adapter/outbox and timeouts |
| `ECO-01/03` TCO | $1,488,000 3-year model vs $1,600,000 ceiling | Avoid unnecessary hot redundancy for relaxed RTO | Egress/backups/extra links included in estimates | Decomposition cost and support burden must be justified |


## 6. All 70 master checklist inputs filled for this fictional initiative

The original standard contains **70** inputs. The table below provides a specific assumed answer or explained N/A for each, enabling the architect to practice replacing assumptions with real stakeholder evidence. The corresponding general *three-layer impacts* remain in the [standard](./Pre-SDD_Architecture_Standard_v1.md); case-specific consequences appear in Section 5 above.

### 6.1. Business objectives (8 inputs)

| Req ID / question | Completed example input | Evidence owner / approval status |
|---|---|---|
| `BUS-01` — Problem, business outcome and KPI with baseline, target, deadline | Reduce current 90-second scheduler failover to ≤8 seconds; business KPI owner: sponsor; baseline: Single rack Java monolith + PostgreSQL primary/async replica; peak observed 500 TPS, p99 850 ms, past failover ~90 s; one synchronous ERP RPC. | Business sponsor/Product; **fictional assumed, not signed** |
| `BUS-02` — Critical user journeys, failure impact and journey priorities | Tier-0 critical journey: Accept one dispatch order exactly once during rack failure; outage loss modeled at $600,000/hour. | Business sponsor/Product; **fictional assumed, not signed** |
| `BUS-03` — In/out of scope; dependencies; MVP versus later phases | In: API/UI, durable core data, operations, SLO tests. Out: unrelated products and historical vendor platform rewrite; project scope is Legacy Factory Order Scheduler — Resilience Refactor. | Business sponsor/Product; **fictional assumed, not signed** |
| `BUS-04` — Revenue/loss or safety impact per outage and per degraded minute | At-risk value: $600,000/h = $166.67/s. Business-impact calculation is an *assumption*, not actual loss evidence. | Business sponsor/Product; **fictional assumed, not signed** |
| `BUS-05` — Launch date, hard deadlines, blackout/change windows | Assumed deadline: 12 months staged modernization; no deployments during agreed monthly financial/plant/change blackout window. | Business sponsor/Product; **fictional assumed, not signed** |
| `BUS-06` — Countries, users, contracts and accessibility/localization commitments | Users: 700; simultaneous active user forecast 230; audience: 24/7 factory logistics and inventory dispatch team; localization English-first with accessibility checks. | Business sponsor/Product; **fictional assumed, not signed** |
| `BUS-07` — Explicit prohibitions / non-goals (e.g., forbidden data movement) | Hard placement constraint: IT scheduler must work without external WAN; physical plant control systems stay on site; processing/storage in organization-operated location only; no exception assumed. | Business sponsor/Product; **fictional assumed, not signed** |
| `BUS-08` — Commercial/legal obligations to customers and penalty conditions | Internal journey SLO 99.99% on a rolling 30-day window; any contractual penalties and external SLA wording require legal approval; not assumed equal to component SLA. | Business sponsor/Product; **fictional assumed, not signed** |

### 6.2. Capacity and latency (12 inputs)

| Req ID / question | Completed example input | Evidence owner / approval status |
|---|---|---|
| `CAP-01` — Transactions by **type**: normal and peak TPS, and define what a transaction counts | Business transactions defined as **Accept one dispatch order exactly once during rack failure**; normal active-hour avg 90 TPS and 10-minute peak 700 TPS. | Product + SRE; **fictional assumed, not signed** |
| `CAP-02` — API request rate (RPS), reads/writes, retries, fan-out, requests per business transaction | 3 externally visible API calls/transaction; peak 2,100 RPS; internal fan-out and retry amplification tested independently. | Product + SRE; **fictional assumed, not signed** |
| `CAP-03` — DAU/MAU, peak *simultaneously active* users, sessions and session duration | 700 total accounts; 230 simultaneously active users at peak; stateless HTTP session and OIDC token validation. | Product + SRE; **fictional assumed, not signed** |
| `CAP-04` — Hourly/daily/weekly peaks, seasonality, campaign and burst size/duration | Average active usage 20 h/day; peak lasts up to 10 min at 700 TPS; incident test sustains peak while one fault domain is down. | Product + SRE; **fictional assumed, not signed** |
| `CAP-05` — Forecasted growth by period and confidence, major future feature/product launches | Year-1 demand growth +35% over launch; rerun CPU/storage/network model at 1.0× and 1.35× load; review quarterly. | Product + SRE; **fictional assumed, not signed** |
| `CAP-06` — Payload/request/response sizes, file/object sizes, compression assumptions | Request+response byte budget 6 KiB per external API call; durable event/transaction payload 4 KiB (before indexes/replication). | Product + SRE; **fictional assumed, not signed** |
| `CAP-07` — p50, p95, p99 (and p99.9 if justified) *per critical journey*; units and observation window | Ingress-to-response p50 ≤85 ms; p95 ≤200 ms; p99 ≤350 ms for the critical journey over a 30-day window; separate transient error rate objective. | Product + SRE; **fictional assumed, not signed** |
| `CAP-08` — Define where latency is measured (client end-to-end, ingress, service, batch completion) and what counts as failure | Timestamp at ingress proxy after TLS termination until valid API response; count timed-out/failed calls in error SLI (do not omit failures from availability). | Product + SRE; **fictional assumed, not signed** |
| `CAP-09` — Max queue age, processing deadline, freshness, end-to-end batch completion and backlog recovery target | Critical transactional path synchronous commit; noncritical notification/export queue age ≤5 min. | Product + SRE; **fictional assumed, not signed** |
| `CAP-10` — Read/write mix, hot keys, expensive operations, query/report schedules | Assumed 70% reads / 30% writes across the API request mix (redemption/charging core still transactional); hot-key and burst skew require measured test. | Product + SRE; **fictional assumed, not signed** |
| `CAP-11` — Expected request failures/timeouts/retry behavior at dependencies and load-shedding tolerance | Client retry limit 2 with exponential jitter; critical write requires idempotency key, timeout budget and explicit replay evidence. | Product + SRE; **fictional assumed, not signed** |
| `CAP-12` — Resource-intensive AI/ML/media jobs if in scope: model size, token/compute demand, jobs and deadlines | No AI/ML/GPU jobs in scope; N/A by design. | Product + SRE; **fictional assumed, not signed** |

### 6.3. Reliability, RPO and RTO (10 inputs)

| Req ID / question | Completed example input | Evidence owner / approval status |
|---|---|---|
| `REL-01` — Availability SLO **per user journey**; denominator, service window, and measurement period | End-to-end 99.99% 30-day availability SLO for Accept one dispatch order exactly once during rack failure; excludes only formally accepted maintenance windows (none for complex). | Business continuity + SRE; **fictional assumed, not signed** |
| `REL-02` — SLA to customers vs internal SLO; what failures/exclusions count; penalties | Internal SLO only until customer/employee agreement is approved; monthly downtime budget calculated from 99.99%; component provider SLAs cannot substitute. | Business continuity + SRE; **fictional assumed, not signed** |
| `REL-03` — RTO per service/journey **and disaster scenario**: acceptable elapsed time to restored usable service | RTO **8 seconds** for loss of one host/rack (including current elected DB writer), other two racks healthy; Full data-center site loss: RPO 4 h; RTO 36 h (separately designed cold recovery). | Business continuity + SRE; **fictional assumed, not signed** |
| `REL-04` — RPO per dataset/transaction and disaster scenario: acceptable *age of last recoverable data point* | RPO **2 seconds** (maximum tolerated committed transaction loss) under loss of one host/rack (including current elected DB writer), other two racks healthy; acknowledged writes target zero lost through quorum durability; in-flight outcomes may require deduplication. | Business continuity + SRE; **fictional assumed, not signed** |
| `REL-05` — Scope of recoverable failure: process, node, rack, site, AZ, region, ransomware, vendor failure | Critical scope: loss of one host/rack (including current elected DB writer), other two racks healthy; distinct site/region case: Full data-center site loss: RPO 4 h; RTO 36 h (separately designed cold recovery); ransomware handled with immutable backups, not quorum replicas. | Business continuity + SRE; **fictional assumed, not signed** |
| `REL-06` — Maximum tolerable business interruption, minimum service during degradation, manual fallback and reconciliation | During isolated rack/zone loss, critical write journey must resume within RTO; asynchronous integrations may queue; read-only status allowed for noncritical screens. | Business continuity + SRE; **fictional assumed, not signed** |
| `REL-07` — Recovery sequence and dependencies: authentication, payments, ledger, reporting, etc. | Recover routing → token validation → transactional core/quorum → event outbox → downstream adapters; no single remote partner blocks critical requests. | Business continuity + SRE; **fictional assumed, not signed** |
| `REL-08` — Approved planned downtime, maintenance restrictions, deployment and upgrade windows | No approved planned outage for critical transactional journey; rolling deployment and backward-compatible schema changes. | Business continuity + SRE; **fictional assumed, not signed** |
| `REL-09` — Frequency and accepted evidence for restore, failover, failback and cyber-recovery drills | Exercise quarterly: inject primary fault, verify RTO/RPO with data commits before/during fault, save logs/traces, and restore an immutable backup. | Business continuity + SRE; **fictional assumed, not signed** |
| `REL-10` — Data durability and correctness expectations distinct from availability | No double-debit, double-order or missing acknowledged transaction under scoped single-fault incident; asynchronous side effects may be replayed exactly-once *effect* via deduplication. | Business continuity + SRE; **fictional assumed, not signed** |

### 6.4. Data and lifecycle (9 inputs)

| Req ID / question | Completed example input | Evidence owner / approval status |
|---|---|---|
| `DAT-01` — Business entities, system of record, ownership and data contracts | System of record for **Accept one dispatch order exactly once during rack failure** is the chosen DB after production authority transfer; business data owner approves schema and lifecycle. | Data owner; **fictional assumed, not signed** |
| `DAT-02` — Starting volume; records/day, GB/day, object size, peak writes and retention horizon | Starting data 650 GiB; modeled transactional events/day and additional growth computed in Section 3; event size 4 KiB. | Data owner; **fictional assumed, not signed** |
| `DAT-03` — Sensitivity classification: PII, financial, confidential, secrets, public | Internal production data; network isolation from safety controllers; traceable dispatcher permissions. | Data owner; **fictional assumed, not signed** |
| `DAT-04` — Residency, allowed processing/storage/backup locations and cross-border restrictions | organization-operated location only; temporary migrations/backup targets subject to data-owner approval; no unapproved cross-border copies. | Data owner; **fictional assumed, not signed** |
| `DAT-05` — Consistency, freshness, correctness, ordering and atomicity by operation | Atomic, durable and linearizable or serializable decision for the core balance/order update, with unique idempotency key; eventually consistent noncritical projections. | Data owner; **fictional assumed, not signed** |
| `DAT-06` — Retention, records hold, archive, deletion, portability and right-to-erasure requirements | Hot data 14 days, archive additional 365 days (fictional policy), then approved deletion unless legal hold; test purge/retention. | Data owner; **fictional assumed, not signed** |
| `DAT-07` — Multi-tenancy model, tenant isolation level, noisy-neighbor tolerance, tenants and growth | Single organization/account partition; no external multi-tenant SLA; role-based data partition enforced. | Data owner; **fictional assumed, not signed** |
| `DAT-08` — Reporting, analytics, batch exports, reconciliation frequency and data latency | Daily audited reconcile of core ledger/transactions, async analytics ≤15 min behind, immutable event/audit export. | Data owner; **fictional assumed, not signed** |
| `DAT-09` — Restore granularity (tenant/table/whole system), point-in-time needs and recovery verification | Recover entire transactional scope plus replay by tenant/partition with point-in-time correctness; separately demonstrate corruption recovery from protected backup. | Data owner; **fictional assumed, not signed** |

### 6.5. Security and governance (8 inputs)

| Req ID / question | Completed example input | Evidence owner / approval status |
|---|---|---|
| `SEC-01` — Laws, contracts, certifications and organization policies *actually applicable*; control mappings | Assume baseline internal security and privacy controls; *no special industry certification assumed*; security/legal must validate actual contractual or statutory obligations. | Security/Legal; **fictional assumed, not signed** |
| `SEC-02` — Actors, partner identities, workforce, machine principals, customer identity sources | Access actors: 24/7 factory logistics and inventory dispatch team; admin, support operator, service identity and auditor; Local IAM/SSO with cacheable issued tokens; privilege separation. | Security/Legal; **fictional assumed, not signed** |
| `SEC-03` — Threat/risk classification, acceptable residual risk and adversary concerns | High: financial correctness / tenant leakage / insider misuse; threat-model fraud, replay, split brain and dependency loss. | Security/Legal; **fictional assumed, not signed** |
| `SEC-04` — Encryption at rest/in transit, BYOK/HYOK, key custody, rotation, certificate requirements | TLS 1.2+ or approved equivalent, encryption at rest, rotated service credentials and secrets in managed vault; network/database access least privilege in organization-operated data center. | Security/Legal; **fictional assumed, not signed** |
| `SEC-05` — Audit events, non-repudiation, investigation and evidence retention | Immutable request ID, actor/tenant, transaction state transition, prior/new balance, reconciliation and failover event retained per assumed policy. | Security/Legal; **fictional assumed, not signed** |
| `SEC-06` — Vulnerability, patch, pen-test, SBOM/supply-chain and incident reporting obligations | CI SAST/DAST/SBOM, automated dependency scanning, quarterly failover and pen-test scope before production; emergency patch procedure. | Security/Legal; **fictional assumed, not signed** |
| `SEC-07` — Required separation of duties, privileged access, break glass and tenant/customer administration | Separate platform admins, production deployers, data owners and incident commanders; break-glass use audited and time-limited. | Security/Legal; **fictional assumed, not signed** |
| `SEC-08` — Third-party processor/subprocessor and vendor risk restrictions | Third-party providers/IdP reviewed by procurement/security; restrict data sharing and define deletion/export obligations; no assumed certification inheritance. | Security/Legal; **fictional assumed, not signed** |

### 6.6. Integrations and networking (9 inputs)

| Req ID / question | Completed example input | Evidence owner / approval status |
|---|---|---|
| `INT-01` — Catalogue of upstream/downstream systems, owner, interface, business criticality | Dependencies: Local warehouse devices, inventory DB, ERP: replace synchronous ERP call with outbox delivery; ownership/availability documented per dependency. | Integration + Network; **fictional assumed, not signed** |
| `INT-02` — Synchronous API vs event/file/batch, update frequency, order and delivery expectations | Core transaction uses synchronous durable commit; partners consume transactional outbox asynchronously; replay handles at-least-once delivery. | Integration + Network; **fictional assumed, not signed** |
| `INT-03` — External API quotas, latencies, SLAs, maintenance and rate limits | Assume external partner max 100 RPS per connector and >1 s p99; keep partner out of transaction path and buffer events. | Integration + Network; **fictional assumed, not signed** |
| `INT-04` — Failure behavior: reject, retry, queue, compensate, or manual handling | On partner outage: do not fail acknowledged core write; queue events, retry with jitter, DLQ after exhausted attempts, reconcile by idempotency ID. | Integration + Network; **fictional assumed, not signed** |
| `INT-05` — Consistency and ordering guarantees, duplicate tolerance, maximum delay | Exactly-once *business effect* via database uniqueness/idempotency; broker may deliver duplicates; ordering enforced per tenant/order key. | Integration + Network; **fictional assumed, not signed** |
| `INT-06` — Existing public IP, allowlists, firewall change process, proxies, DNS and certificate dependencies | DNS, certs, allowlists, backup endpoints and IdP from Local warehouse devices, inventory DB, ERP: replace synchronous ERP call with outbox delivery; stable ingress hostname; DNS-only routing is not a sub-10 s failover plan. | Integration + Network; **fictional assumed, not signed** |
| `INT-07` — Client geography, edge locations, remote branches, IoT and intermittent/offline operation | 24/7 factory logistics and inventory dispatch team; nominal latency measured at ingress, not synthetic zero-RTT localhost; offline/WAN contingency: IT scheduler must work without external WAN; physical plant control systems stay on site. | Integration + Network; **fictional assumed, not signed** |
| `INT-08` — Address ranges, DNS zones, IP overlap, IPv4/IPv6, routing and private connectivity constraints | IP addressing & routing: Separate IT/OT VLANs, redundant rack switches and routed VIP/service mesh that does not require DNS TTL change, measured inter-rack RTT <2 ms, asynchronous ERP adapter.; reject overlapping ranges for source/target connectivity; validate symmetric flows and firewall rules. | Integration + Network; **fictional assumed, not signed** |
| `INT-09` — External SLA dependencies; legal or operational inability to move a peer system | No critical synchronous third-party dependence permitted; support degraded noncritical outputs under external outage. | Integration + Network; **fictional assumed, not signed** |

### 6.7. Operations and delivery (8 inputs)

| Req ID / question | Completed example input | Evidence owner / approval status |
|---|---|---|
| `OPS-01` — Support hours, user hours, incident severities, response and escalation commitments | 24×7 on-prem SRE + plant IT incident responders; incident escalation starts at critical journey failure, not at app host alarm. | Operations/Delivery; **fictional assumed, not signed** |
| `OPS-02` — Team skills, support model, managed-service restrictions and ownership boundaries | Staffed platform + SRE, network engineers and DB owner capable of automated failover and manual fencing; skills proof via run-through. | Operations/Delivery; **fictional assumed, not signed** |
| `OPS-03` — Release frequency, rollback tolerance and change-freeze windows | Weekly small releases, canary rollout; no critical service downtime planned; expand/contract schema change. | Operations/Delivery; **fictional assumed, not signed** |
| `OPS-04` — Environments needed: dev, test, perf, stage, prod, DR; isolation and test data rules | Dev, integration, staging, performance/chaos, production; synthetic or masked test data and isolated DR backup restore. | Operations/Delivery; **fictional assumed, not signed** |
| `OPS-05` — Logging/tracing/metric retention, event cardinality, alerting and forensic search | 30-day metrics/traces, audit logs per retention policy, high-cardinality sampling guarded; alert on p99, error SLI, replication lag and quorum health. | Operations/Delivery; **fictional assumed, not signed** |
| `OPS-06` — Business continuity runbooks, escalation matrix and authority to invoke failover | SRE incident commander authorizes failover; automatic node/zone routing, manual only for site/region disaster; dual-control for writer fencing. | Operations/Delivery; **fictional assumed, not signed** |
| `OPS-07` — Changeover, reversibility, customer communication and decommissioning expectations | Planned go-live 12 months staged modernization; migration transition: Same-site modernization with data migration; source retirement only after data-owner approval. | Operations/Delivery; **fictional assumed, not signed** |
| `OPS-08` — Testing scope: load, soak, chaos/fault injection, DR, security, compliance, accessibility | Peak 1.0×/year-1 1.x× load, one-zone/rack chaos, network partition, persistence/ledger verification, soak and cyber restore. | Operations/Delivery; **fictional assumed, not signed** |

### 6.8. Economics and constraints (6 inputs)

| Req ID / question | Completed example input | Evidence owner / approval status |
|---|---|---|
| `ECO-01` — One-time implementation/migration budget and recurring annual/monthly run-cost envelope | One-time deployment/migration $480,000; modeled recurring $28,000/month; 3-year ceiling $1,600,000. | Business finance; **fictional assumed, not signed** |
| `ECO-02` — CapEx/OpEx preferences, currency, commitment period, chargeback unit | USD, 36-month TCO, incremental project CapEx plus recurring operations, no financing/tax/provider quote; include labor in monthly allowance. | Business finance; **fictional assumed, not signed** |
| `ECO-03` — TCO horizon and required benefits (cost, speed, risk, flexibility) | 36-month modeled TCO $1,488,000; headroom under assumed cap $112,000; schedule quarterly forecast review. | Business finance; **fictional assumed, not signed** |
| `ECO-04` — Delivery deadline, acceptable delivery risk, available people and vendor approval duration | Delivery deadline 12 months staged modernization; procurement and expertise availability are gated, not assumed to be approved. | Business finance; **fictional assumed, not signed** |
| `ECO-05` — Environmental/energy footprint goals **if applicable**, measurement expectations | No separately approved carbon-intensity requirement; efficiency reviewed during sizing (N/A until sponsor sets KPI). | Business finance; **fictional assumed, not signed** |
| `ECO-06` — Exit portability expectations, vendor lock-in tolerance and contract termination rights | Hardware/VM image export, DB dump and independent backup restore demonstrated; vendor license exit checked. | Business finance; **fictional assumed, not signed** |

## 7. Path-specific technical discovery

**Baseline evidence:** Single rack Java monolith + PostgreSQL primary/async replica; peak observed 500 TPS, p99 850 ms, past failover ~90 s; one synchronous ERP RPC. Review vendor versions, service accounts, SQL/procedure inventory, VLANs, backup history, batch jobs, storage IOPS and change outage record. **Target modernization without provider relocation:** Same-site modernization with data migration; migration rollback distinct from ordinary DR.

### Brownfield as-is → to-be gap and inventory

| As-is observation / dependency | Required change / design response |
|---|---|
| Single rack Java monolith + PostgreSQL primary/async replica; peak observed 500 TPS, p99 850 ms, past failover ~90 s; one synchronous ERP RPC | Evaluate measured baseline versus peak 700 TPS, p99 ≤350 ms and RTO 8 s. |
| Current location / data dependency: Legacy on-prem rack A, 650 GiB active database | Inventory DB, scheduled jobs, certificates, directory, SDKs, routing, operator practices and license compatibility. |
| Current failover and old recovery | Introduce Migrate shared PostgreSQL schema into explicit scheduler-owned transactional schema; synchronous quorum replication for accepted orders; CDC during staged migration.; preserve rollback, data lineage and verification evidence. |
| Legacy integration | Local warehouse devices, inventory DB, ERP: replace synchronous ERP call with outbox delivery; isolate or jointly migrate latency-coupled consumers. |

## 8. Options appraisal and modeled 36-month economics

Cost estimates below are hypothetical line-item allowances, **not vendor quotes**. The monthly figure includes incremental allocated operations/engineering effort, infrastructure/services, network, backups and observability; it does not establish an actual provider price. One-time costs include a procurement allowance on-prem, and migration labor/testing for brownfield where applicable. Excludes taxes, financing, contractual discounts and unapproved headcount assumptions.

**Preferred candidate TCO arithmetic:** $320,000 + 36 × $28,000 + $160,000 = **$1,488,000 (36-month illustrative TCO)**; cap $1,600,000, difference **$112,000**.

**Invented monthly allowance breakdown (sum equals the monthly TCO input):**

| Category | Illustrative monthly spending envelope |
|---|---:|
| Compute, managed runtime and licenses | $9,800 |
| DB, files, backup and archival | $5,600 |
| Network, transit, monitoring, security tooling | $4,200 |
| Allocated on-call, SRE and platform labor | $8,400 |

**Finance stress test:** if monthly run costs were 25% above this fictional allowance for all 36 months, modeled TCO would be **$1,740,000** versus $1,600,000 cap — **over budget; renegotiate, redesign or increase cap before final approval**. This is not a forecast or an actual vendor quote. The growth-capacity additions from Section 3 require real pricing/availability before sign-off.

**Reference baseline (fictional):** existing ongoing estate $18,000/month × 36 = $648,000 without new investments. Net candidate difference vs that narrow baseline = $840,000. This is **not** a causal ROI estimate and excludes changing operations and avoided risk.

| Alternative | Hard constraint | RTO/RPO feasibility at stated scope | Illustrative 36-month cost | Decision |
|---|---|---|---:|---|
| Incremental strangler + three-rack quorum | Pass | 8 s possible only after validation | $1,488,000 | Recommended conditionally |
| Keep monolith and add asynchronous replica | Fail: 2 s RPO / 8 s RTO not proven | Observed 90 s today | $690,000 | Rejected |
| Cloud-only rewrite | Fail: plant WAN independence | Cannot meet hard constraint | $1,250,000 | Excluded |

**Architecture decision rule:** hard constraints and critical correctness/recovery come first; cost is compared only among feasible options. Even the preferred candidate needs measurement.

## 9. Migration overlay and 7R decisions

**No source system is being moved across environments in this example.** The seven Rs are **N/A** rather than arbitrarily assigning a cloud migration strategy to a net-new implementation. For same-site brownfield relocation/modernization the analogues replatform/refactor are documented in the ADRs; the source→target cutover remains governed separately.

**Internal migration plan:** inventory procedures/writers → extract read-only projections → bulk baseline sync → forward-CDC/transactional-outbox replay → per-order-writer lease transfer → check last committed order sequence → run 72-hour canary and failover test → decommission old writer. **Rollback:** before new-writer commits, restore old routing; after target-only commits begin, roll forward or use a demonstrated reverse event replay. Planned migration interruption budget 30 minutes (assumed); it is **not** the 8-second runtime rack-failure RTO.


## 10. Decision Tree — executed outcome for this case

| Gate | Question | Sample outcome |
|---|---|---|
| G1: Business | Named journey, sponsor and business value? | YES as fictional assumption; business re-sign required in real use |
| G2: Classification | Existing workload? hosting path? migration?  | BF-OP; overlay Same-site modernization with data migration |
| G3: Hard constraints | Residency, offline operation, deadlines/security eligible? | Concept passes with placement reason: IT scheduler must work without external WAN; physical plant control systems stay on site |
| G4: NFR feasibility | p99 ≤350 ms; RPO 2 s; RTO 8 s | CONDITIONAL: recovery budget and throughput mathematically plausible, not benchmarked |
| G5: Migration | Cross-platform migration needed? | N/A, with internal transition assessed separately |
| G6: Economics/operations | Expected 36-month model below cap? staffing? | MODELED PASS: $1,488,000 < $1,600,000; vendor quotes / staffing not validated |
| G7: ADRs & tests | Alternatives recorded, measurable tests defined? | YES: ADR candidates and verification plan below |
| G8: Authorization | Real approvals and SLO evidence received? | **NOT YET — cannot approve Pre-SDD on invented inputs** |

```mermaid
flowchart TD
    A[Business sponsor and critical journey defined] --> B{Existing product?}
    B -->|Yes| C[BF: classify current estate]
    C --> D{Hosting placement}
    D -->|On-prem| E[BF-OP: path checklist]
    E --> F{Critical RPO and RTO feasible?}
    F -->|Requires proof| G[Calculate capacity and verify recovery design]
    G --> H{Migration needed?}
    H -->|No| I[No cross-platform migration]
    I --> J{TCO and constraints pass?}
    J -->|Assumed yes| K[Draft ADRs and acceptance tests]
    K --> L[Pre-SDD gate: conditional pending real evidence]
```

**Example branch trace:** Existing monolith: Brownfield → Source and target both on-prem → Observed 90 s failover conflicts with 8 s objective → Refactor critical path + three rack state quorum → Migration & failover PoC are blocking.

## 11. Proposed Architecture Decision Records (ADRs) and traceability

| Proposed ADR | Required inputs | Recommended decision | Rejected alternative / consequence | SDD output | Validation evidence |
|---|---|---|---|---|---|
| ADR-BF_OP_Complex-001: Hosting | BUS-05, BUS-07, ECO-01 | Three rack-separated on-prem cluster in the same industrial data center | Alternative placement violates constraints or delivery/economic fit | Deployment view, fault domains, responsibility matrix | Architecture gate and facility/landing-zone checklist |
| ADR-BF_OP_Complex-002: RPO/RTO/DR | REL-01, REL-03, REL-04, REL-05 | Migrate shared PostgreSQL schema into explicit scheduler-owned transactional schema; synchronous quorum replication for accepted orders; CDC during staged migration. | Do not promise stronger untested site/region RTO | Recovery design, data authority and runbooks | Scoped recovery ≤8 s and data loss ≤2 s |
| ADR-BF_OP_Complex-003: Scaling | CAP-01, CAP-02, CAP-05, CAP-07 | 10 modeled vCPU/domain; 3 fault domain(s) | Pure average TPS sizing and unmeasured p99 disallowed | Load model, deployment sizing and observability | N-1 peak + year-1 growth, p99 and error SLIs |
| ADR-BF_OP_Complex-004: Networking | INT-01, INT-06, INT-08 | Separate IT/OT VLANs, redundant rack switches and routed VIP/service mesh that does not require DNS TTL change, measured inter-rack RTT <2 ms, asynchronous ERP adapter. | Avoid undocumented synchronous offsite calls / DNS-only failover | Network zone/CIDR diagram, flow and security matrix | Traffic replay, link-loss exercise, firewall/RTT measurements |
| ADR-BF_OP_Complex-005: Software boundaries | DAT-05, INT-02, REL-10 | Strangler extraction of dispatch authorization and reservation from monolith; transactional outbox; command deduplication, single-writer ownership and automated fence/retry. | Avoid redundant microservices or uncontrolled write authority | Component model, transaction/outbox/error semantics | Replay, idempotency, transaction/contract tests |
| ADR-BF_OP_Complex-006: Modernization | OPS-07, DAT-01, INT-01 | Same-site modernization with data migration | Uncontrolled big-bang replacement or undocumented legacy coupling | As-is/to-be, migration roadmap, decommission plan | Compatibility matrix and reversible rehearsal |

**Required trace chain:** `REQ ID → design impact → option/decision → proposed ADR → SDD section → test evidence`. A real ADR remains **Proposed** until reviewed; a design sentence above is not an approved ADR.

## 12. Concrete validation plan and acceptance thresholds

| Test ID | How to test | Pass/fail threshold |
|---|---|---|
| TEST-CAP-01 | Replay peak 700 TPS using 3 API requests/txn for >=30 min, 30-day-like mix and realistic payloads | Throughput ≥700 TPS; p50/p95/p99 ≤85/200/350 ms; error SLI within approved budget |
| TEST-CAP-02 | Repeat at year-1 demand 945 TPS | Either pass SLO with funded additional capacity or record scaling lead time and milestone |
| TEST-DR-01 | Inject loss of one host/rack (including current elected DB writer), other two racks healthy, generate uniquely numbered committed business transactions immediately before/during event | Measured journey interruption ≤8 s and loss age ≤2 s; no acknowledged duplicate effects |
| TEST-DR-02 | Restore from an isolated/immutable backup without trusting primary replicated data | Demonstrate Full data-center site loss: RPO 4 h; RTO 36 h (separately designed cold recovery) with exact measured times; document any exception |
| TEST-SEC-01 | Pen-test roles and service identity; verify no unauthorized access, secrets in logs or direct data-tier ingress | No release-blocking findings; auditor retains evidence |
| TEST-OPS-01 | Break DNS/IdP/partner channel, replay retries, verify alerts, runbook and ownership | Critical path unaffected where claimed; noncritical buffering and reconciliation confirmed |

**Evidence capture:** run ID, timestamps, test environment/topology, workload generator parameters, fault command/time, commits sent/acknowledged, first successful post-fault business response, p50/p95/p99 charts, SLI error counts, reconciliation and owner approval. Do not declare pass from an infrastructure health dashboard alone.

## 13. Risks, gaps and assumptions requiring ownership

- [ ] Observed old monolith may still own writes unless every write path is traced — owner: Lead architect/SRE/Data owner; severity to be assessed; closing artifact: verified evidence or signed exception.
- [ ] CDC snapshot/cutover requires authoritative single-writer switch — owner: Lead architect/SRE/Data owner; severity to be assessed; closing artifact: verified evidence or signed exception.
- [ ] DB election could exceed 8 seconds — owner: Lead architect/SRE/Data owner; severity to be assessed; closing artifact: verified evidence or signed exception.
- [ ] Local directory/time shared dependencies can defeat rack independence — owner: Lead architect/SRE/Data owner; severity to be assessed; closing artifact: verified evidence or signed exception.
- [ ] Replace all invented traffic, cost, recovery and legal assumptions with named business/data/platform owners and supporting measurements; **this item always blocks production sign-off**.
- [ ] Confirm security/privacy compliance, purchased vendor SKU behavior, regional service parity, RPO/RTO definitions and deployment runbook with actual teams.

## 14. Pre-SDD gate decision and sign-off matrix

**Preliminary architectural recommendation:** use **BF-OP / Complex** path, candidate **Incremental strangler + three-rack quorum**, and the DR/correctness strategy in ADR-002. The workload math demonstrates an engineering sizing *hypothesis*, not achieved SLIs.

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

- [PostgreSQL: Synchronous replication, quorum and availability trade-offs](https://www.postgresql.org/docs/17/warm-standby.html)
- [Microsoft Azure: Mission-critical design principles](https://learn.microsoft.com/en-us/azure/well-architected/mission-critical/mission-critical-design-principles)
- [Google Cloud: Disaster recovery planning guide](https://docs.cloud.google.com/architecture/dr-scenarios-planning-guide)

> These references inform available patterns and limitations. They **do not** establish any of the fictional traffic, failure time budgets, budget prices or achieved SLOs in this exercise. Check current service SKU, quota, pricing and service-level guarantees at project time.


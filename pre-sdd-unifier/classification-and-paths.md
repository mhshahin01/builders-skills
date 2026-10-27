# Classification and paths

Every Pre-SDD is classified once, in stage 1, by the Standard's matrix: the change type crossed with the intended target (Standard § 1.1). The classification picks the path, and the path decides which evidence stage 3 collects, which outputs the write-up carries, and whether chunk 06 exists. The migration overlay sits on top of any path and decides whether chunk 08 exists. The recovery tier only points at the closest worked example.

Read this file at step 7 (stage 1 classifies) and at step 9 (stage 3 assesses the path). The method is in `reference/Pre-SDD_Architecture_Standard_v1.md` § 1.1, § 7, § 8 and § 9.2, and in `reference/Pre-SDD_Quick_Discovery_Guide.md` § 3. The Standard wins when they disagree.

---

## The two classification rows

Two header rows hold the classification. Both are stage 1 rows and critical rows, so G3 needs each entry confirmed by a person with who and when (`gates-and-signoff.md`).

| Row | Asks | Values | Meaning |
|---|---|---|---|
| HDR-07 | Change type: is there an existing workload or state to preserve? | `greenfield`, `brownfield`, `mixed` | Greenfield is a net-new solution. Brownfield enhances, rebuilds, or migrates an existing one. Mixed needs decomposing (below). |
| HDR-08 | Intended target: who hosts and runs it? | `onprem`, `cloud`, `hybrid`, `undecided` | On-prem is organization-operated, including a self-run private cloud in the organization's own facility. Cloud is provider-hosted, public or hosted-private (say which in the entry's evidence). |

Two more header rows describe a brownfield source: HDR-09 (source platforms, text) and HDR-10 (migration direction: `none`, `onprem-to-cloud`, `cloud-to-cloud`, `cloud-to-onprem`, `same-platform`, `mixed`). The operating-control boundary (IaaS, PaaS, SaaS) is recorded in the entry's evidence, never as a product.

Pre-fill both rows only where a BRD states them (`prefill-and-derivation.md`), as `Estimated` with the citation. Otherwise they stay `Open` and stage 1 asks them, using the Quick Discovery Guide's two questions: "Is the workload greenfield, brownfield, or mixed? What exists today?" and "Is the target on-premises, provider-hosted cloud, hybrid, or undecided? Which choices are permitted or prohibited?"

---

## The path code

The engine derives the path code from HDR-07 and HDR-08 (`classify` in `studio/src/engine.js`). Chunk 02 takes it from the engine's classification fragment; never work it out by hand. The only path codes the prose names itself are the parts of a mixed decomposition (below).

| HDR-07 | HDR-08 | Path code |
|---|---|---|
| greenfield | onprem | `GF-OP` |
| greenfield | cloud | `GF-CL` |
| brownfield | onprem | `BF-OP` |
| brownfield | cloud | `BF-CL` |
| greenfield or brownfield | hybrid | `GF-OP + GF-CL` or `BF-OP + BF-CL` |
| `mixed`, or not held | any | `Unclassified` |
| any | `undecided`, or not held | `Unclassified` |

`Unclassified` is not a fifth path. G3-02 ("The Greenfield/Brownfield × On-prem/Cloud path is recorded") needs a recorded path, so the special cases below settle it before G3: an undecided target is compared and then set, and a mixed change type is decomposed in chunk 02.

---

## Special cases

The Standard's ambiguities, and what the skill does with each:

- **Target undecided.** The target is not forced. HDR-08 holds `undecided` and the path reads `Unclassified` until the placements are compared. Stage 3 compares the eligible placements as options, one per hosting value the person allows (`onprem`, `cloud`, `hybrid`: `options-and-economics.md`). After the comparison, the person sets HDR-08 to the chosen placement, and the engine classifies.
- **Hybrid.** Two deployment sub-assessments, one on-prem and one cloud, plus a boundary analysis: the cross-boundary integration, data, network, security, and DR, and one consolidated architecture decision. Chunk 02 states which components sit on each side and why. Hybrid is a composition of the two extensions, not a hidden fifth path. No worked example covers hybrid, so a hybrid Pre-SDD gets no example pointer.
- **Mixed change type.** The Standard says "Mixed (decompose)". First ask whether one change type fits the system this Pre-SDD covers: a new product that only integrates a legacy platform is greenfield (next case), and HDR-07 then takes that value. When the system truly holds both new and existing parts, HDR-07 stays `mixed` and chunk 02 records the decomposition: each part, its change type, and its target, named by the same matrix (for example GF-CL for the new components and BF-CL for the existing ones). The engine cannot express a mixed path, so its code reads `Unclassified`; G3-02 accepts the recorded decomposition ("including mixed/hybrid logic where needed"). The existing parts get chunk 06.
- **A new product on a legacy platform.** Greenfield for the new product (HDR-07 `greenfield`), with a brownfield dependency assessment of the legacy integrations. The assessment lives in the INT rows (INT-01 per external system, INT-03, INT-09) and in chunk 02's path evidence. It does not make the Pre-SDD brownfield, and it does not add chunk 06.
- **An existing application moving cloud to cloud, or on-prem to cloud.** `BF-CL` plus the migration overlay (cloud-to-cloud or on-prem-to-cloud). The overlay never replaces the classification.
- **Migration inside one platform or data center.** `BF-OP` (or `BF-CL` inside one provider) can still need the migration overlay when a workload crosses a hosting or platform boundary (Standard § 7, path BF-OP).

---

## Per-path evidence and required outputs

All four paths use the whole register. Stage 3 adds the selected path's evidence below (Standard § 7). Never use a path to skip source-system dependency discovery.

For each evidence line, chunk 02's path evidence records what the BRDs and the answers give, by citation, or the unknown (`QD-NN`) that holds the gap. The required outputs come from the chunks that hold them: capacity in 04, the shape and its diagrams in 05, the existing estate in 06, costs in 07, migration in 08, ADR candidates in 09, risks in 10. A required output that would name a product, a version, or a provider that is not a hard constraint (a licensed software matrix, a service eligibility matrix) belongs to the SDD: the Pre-SDD records the constraint it must meet as a register entry, and chunk 12 lists it as left to the SDD (`handoff-guide.md`).

### GF-OP: greenfield, on-prem

Evidence:
- the business reason for on-prem (residency, latency to a site, procurement, existing capital, disconnected operation, policy); challenge an unsupported claim;
- the sites: facility uptime, power, cooling, racks, physical security, hardware lead time and replacement cycle;
- the platform standards: virtualization or container standards, OS and hypervisor support, hardware redundancy, shared storage, backup, monitoring, and licensing constraints;
- the network: LAN and WAN, internal and external DNS, L4 and L7 appliances, firewalls, carrier links, internet exposure, east-west segmentation, the IP plan;
- site-level DR: the recovery site and its owner, distance and RTT, intersite bandwidth, backup isolation, restore tests, recovery team coverage;
- the hardware scale ceiling and purchase lead time against the burst forecasts, spares and service contracts.

Trade-off: site and data control and asset reuse, against longer capacity lead times, physical failure domains, equipment refresh, and DR-site cost.

Required outputs: physical and logical site diagram, capacity and procurement plan, fault-domain and DR model, WAN and LAN flows, licensed software matrix, run costs, deployment standard, risk acceptance.

### GF-CL: greenfield, cloud

Evidence:
- the business justification and constraints for regions, providers, operating model, data residency, cloud contract, billing ownership, and exit policy;
- landing-zone readiness: organization and account structure, identity, guardrails, audit, policy, key management, cost tagging, network hub or transit, baseline observability;
- the compute envelope: managed or serverless, VMs, containers, accelerated workloads, with the workloads' characteristics, portability, and staff skills;
- the network: private and public endpoints, ingress, WAF, CDN, NAT and egress, DNS, IPv4 and IPv6, inter-region costs, connectivity to partners and on-prem systems;
- service limits, regional service availability, quotas, permitted managed services, and the shared-responsibility boundary;
- resilience against node, AZ, and region failure, multi-region needs, replication and egress costs, identity, keys, and DNS recovery, and DR tests.

Trade-off: elasticity, managed operations, and time to value, against recurring consumption cost, quotas, dependencies, egress, and platform coupling. Cloud by itself does not satisfy HA, RTO, RPO, or security.

Required outputs: landing-zone gap analysis, region and provider options, service eligibility matrix, network and identity boundary diagram, rough-order TCO, operating model, portability ADR candidates.

### BF-OP: brownfield, on-prem target

Evidence:
- the current-state architecture and dependency graph, from verified runtime traffic, not diagrams alone;
- the existing hardware, OS, middleware, databases, vendor support end dates, licenses, hypervisor, storage topology, site DR, and network appliances;
- historical traffic and latency percentiles, real incidents, availability, saturation, failover outcomes, and the existing SLO gaps;
- the current subnet, CIDR, DNS, firewall, and policy inventory, undocumented partner connectivity, certificate and IP dependencies;
- the data model, undocumented batch jobs, file exchange, stored procedures, orphan integrations, and access paths;
- change tolerance, ownership, test coverage, release fragility, provisioning constraints, compatibility, and technical debt.

Decide: keep and improve in place, consolidate, relocate to newer on-prem hardware, replatform, refactor, or retire. Do not reproduce a critical defect by copying the existing environment.

Required outputs: as-is and to-be deltas, observed baseline against the target gap, component disposition and sequencing, operational impact, interim hybrid dependencies if any, rollback and decommission evidence.

### BF-CL: brownfield, cloud target

Evidence:
- everything from the BF-OP evidence, plus the exact source: on-prem, the same cloud or provider, another cloud or provider, or mixed (the overlay's source: `migration-overlay.md`);
- the target landing zone, account structure, identity federation, key ownership, tenant isolation, network and cost guardrails, platform ownership;
- managed-service and protocol compatibility, container, OS, and VM portability, proprietary storage, event, and API semantics, service quotas;
- the dependencies that stay in the source and would become latency-sensitive cross-environment calls, with the network RTT and the egress forecast;
- data conversion, mapping, system-of-record ownership, replication and backfill, consistency, and cutover and rollback feasibility;
- policy, licensing, and vendor transfer, cross-region and cross-cloud encryption and routing, egress and exit fees, the hybrid run window, and support capabilities.

Decide: the 7R strategy per workload, whether migration and modernization happen together or in stages, the wave grouping, connectivity, source retirement, and post-migration SLO verification. The fastest technical move is not always the best long-term platform.

Required outputs: baseline and target gap analysis, full dependency graph, 7R workbook, data migration plan, transition network design, phased cutover and rollback, dual-run costs, tests, source decommission criteria.

---

## The migration overlay

The overlay is independent of the path (Standard § 8). It applies when an existing workload or component crosses a hosting or platform boundary, which the decision tree asks as "Existing workload changes hosting or platform?" (Standard § 9.2). So it comes with a brownfield or mixed change type, whatever the target; a greenfield Pre-SDD has no existing workload, and no overlay.

- **The switch** is settled in stage 2, with the classification: whether it applies and the source platform (`set-overlay`). A person or a fixture owner sets it; the skill may set it with its citation in `cite`; an answer policy never does. Until it is switched on, the OVL rows are not part of the gates.
- **What it adds:** the overlay rows OVL-01 to OVL-12 per workload `WL-NN`, one primary R per workload (7R), the cutover rules, and chunk 08. Rules: `migration-overlay.md`.
- **Agreement with the header:** HDR-10 states the direction. When HDR-10 is `none`, the overlay does not apply; when the overlay applies, HDR-10 names its direction. A disagreement between them is a gap to raise at the G1 review stop, never settled silently. G3-03 asks for the direction explicitly, or `N/A` with a reason.

---

## The recovery tier and the closest worked example

The recovery tier is not a mode. It only picks the closest of the eight worked examples in `examples/` (design § 6.3).

The engine computes it from the failure scopes it assesses (`recoveryTier` in `studio/src/engine.js`). Each scope's RTO and RPO are the smallest held REL-03 and REL-04 values for that scope, or with no scope named.

| Tier | When |
|---|---|
| `Complex` | At least one named failure scope has both its RTO and its RPO under 10 seconds. |
| `Simple` | There is at least one failure scope, and every scope has both its RTO and its RPO over 6 hours (21600 seconds). |
| None | Anything else. A scope whose RTO or RPO is not held never counts toward `Simple`. |

The engine then names the closest example from the path code and the tier (`closestExample`): `PreSDD_<GF|BF>_<CL|OP>_<Simple|Complex>.md`, for example `PreSDD_GF_CL_Complex.md`. It names none for a hybrid or unclassified path, or when there is no tier.

How the skill uses the pointer:
- Chunk 02 names the example, with a link to `examples/<file>` and the one-line reason (path and tier). A light run leaves the pointer out (`SKILL.md` § Light run): the classification fragment then reads "Not given in a light run" for the closest worked example.
- The example shows the reasoning, not the answers. Never copy a value, a sizing, a cost, or a recovery timing from it: every example number is invented (`examples/PreSDD_Examples_README.md`), and a business number the sources do not give stays `Open`.
- Before pointing a reader at an example section, check `examples/ERRATA.md`, which lists the verified issues in the examples.
- An 8-second RTO at zone or rack level is not an 8-second site or region recovery. Each example states its full-site or region RTO and RPO separately.

---

## When chunks 06 and 08 exist

| Chunk | Exists when | Holds |
|---|---|---|
| `06-existing-estate.md` | Full mode, and HDR-07 holds `brownfield` or `mixed` | The brownfield inventory, as-is and to-be, the observed baseline, and the major defects (the BF-OP evidence above), for the existing parts. G3-09 reads it. |
| `08-migration-overlay.md` | Full mode, and the migration overlay applies | The overlay rows per workload, the 7R per workload, the cutover rules, the transfer math, and the wave record (`migration-overlay.md`). G3-10 reads it. |

An omitted chunk is omitted, not stubbed, and quick mode writes neither (`chunking.md`).

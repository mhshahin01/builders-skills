<!--
CHUNK: 02
TITLE: Classification and Path
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: 01
PART OF: Pre-SDD - Refunds Platform
-->

# 2. Classification and Path

## 2.1 Classification

<!-- ENGINE-FRAGMENT: 02-classification.md -->
| Item | Value | Source |
|---|---|---|
| Change type (HDR-07) | greenfield | Fixture: Product Owner stand-in (test-run policy) |
| Intended target (HDR-08) | cloud | Fixture: Product Owner stand-in (test-run policy) |
| Path code | GF-CL | Engine |
| Migration overlay | does not apply, source unknown | Project state (register.overlay) |
| Recovery tier | none | Engine |
| Closest worked example | none | Engine |
<!-- /ENGINE-FRAGMENT -->

## 2.2 Path Evidence

The path is GF-CL: a net-new solution (HDR-07.1; refunds are on paper and by phone today, HDR-09.1) on provider-hosted public cloud with no provider as a hard constraint (HDR-08.1).

| Evidence the path needs (Standard § 7) | What this Pre-SDD holds | Where |
|----------------------------------------|-------------------------|-------|
| Business justification and constraints for regions, providers, operating model, residency, cloud contract, billing ownership, exit policy | Cloud is the intended target with no provider constraint; data stays within the European Union with the recovery copy in a second region; operating expense is preferred, in EUR; exit portability is open | HDR-08.1, DAT-04.1, ECO-02.1, ECO-06.1 (Open) |
| Landing-zone readiness: organization and account structure, identity, guardrails, audit, policy, key management, cost tagging, network hub, baseline observability | Key custody by the business with yearly rotation; audit of every refund status change; landing-zone readiness, logging retention and team skills are open | SEC-04.1, SEC-05.1, OPS-02.1 (Open), OPS-05.1 (Open) |
| Compute envelope: managed or serverless, VMs, containers, accelerated workloads, portability, staff skills | Small, steady interactive load with a seasonal burst; no AI, ML or media jobs; the compute model is left to the SDD (ADR-PERF-001) | CALC-02, CALC-03, CAP-04.1, CAP-12.1 (N/A), [09 § 9.5](./09-decisions.md#95-sdd-adrs-driven-by-this-pre-sdd) |
| Network: private and public endpoints, ingress, WAF, CDN, NAT and egress, DNS, IPv4 and IPv6, inter-region costs, partner and on-prem connectivity | Public access for customers and members; three external partners (CardPay Ltd, Point-of-Sale Records, MsgHub); address ranges, allow-lists and DNS dependencies are open | INT-08.1, INT-01.1 to INT-01.3, INT-06.1 (Open) |
| Service limits, regional availability, quotas, permitted managed services, shared-responsibility boundary | Partner quotas and SLAs are open; no managed service is permitted or prohibited by the BRDs; a new third-party service needs the product owner's approval (project rule) | INT-03.1 to INT-03.3 (Open), QD-04, QD-05 |
| Resilience against node, AZ and region failure, multi-region needs, replication and egress costs, identity, keys and DNS recovery, DR tests | Two failure scopes: zone (local HA) and region (pilot light), asynchronous replication for both; DR drill frequency and recovery sequence are open | REL-05.1, REL-05.2, [05 § 5.1](./05-target-shape.md#51-shape), REL-07.1 (Open), REL-09.1 (Open) |

**Required outputs of the path:**

- Landing-zone gap analysis: left to the SDD within SEC-04.1 and SEC-05.1; its open inputs are OPS-02.1 and OPS-05.1.
- Region and provider options: chunk 07 § 7.1 (OPT-01, OPT-02); the provider is the SDD's (no hard constraint).
- Service eligibility matrix: left to the SDD (it would name products); the constraint it must meet is DAT-04.1 and SEC-01.1 ([12 § 12.4](./12-sdd-handoff-guide.md#124-left-to-the-sdd)).
- Network and identity boundary diagram: chunk 05 § 5.2.2 and § 5.2.5.
- Rough-order TCO: chunk 07 § 7.1 (CALC-21@OPT-01, CALC-21@OPT-02).
- Operating model: OPS-01.1; support hours and severities are open.
- Portability ADR candidates: ADR-PLATFORM-001 (hosting part), [09 § 9.4](./09-decisions.md#94-pre-sdd-adrs); exit expectations ECO-06.1 are open.

## 2.3 Hybrid Boundary

Not applicable: the target is not hybrid.

## 2.4 Migration Overlay

Not applicable: no workload crosses a hosting or platform boundary. The change type is greenfield and the migration direction is none (HDR-10.1).

## 2.5 Closest Worked Example

The engine names no closest worked example: the recovery tier is none, so no example matches both the path and a tier.

<!-- MASTER: refunds-platform-pre-sdd-master.md | PREV: 01-business-brief.md | NEXT: 03a-register-business.md -->

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

| Evidence the path needs (Standard § 7) | What this Pre-SDD holds | Where |
|----------------------------------------|-------------------------|-------|
| Business justification and constraints for regions, providers, operating model, residency, contract, billing and exit | Cloud target with no provider as a hard constraint; residency within the European Union for both locations; operating expense preferred in EUR; exit portability not stated | HDR-08.1, DAT-04.1, ECO-02.1, ECO-06.1 (Open) |
| Landing-zone readiness: accounts, identity, guardrails, audit, keys, cost tagging, network hub, observability | Business-held keys rotated at least yearly; identity sources partly open; logging retention and threat classification open | SEC-04.1, SEC-02.1, QD-06, OPS-05.1 (Open), SEC-03.1 (Open) |
| Compute envelope: workload characteristics, portability, staff skills | Peak business and API rates from the calculations; team skills open | CALC-02, CALC-03, OPS-02.1 (Open) |
| Network: endpoints, ingress, edge, egress, DNS, inter-region cost, partner connectivity | Public access for customers, members and branch managers; three external partners; existing addresses and allow-lists open | INT-08.1, INT-01.1 to INT-01.3, INT-06.1 (Open) |
| Service limits, regional availability, quotas, permitted services, shared responsibility | Partner quotas and SLAs open; permitted services left to the SDD | INT-03.1 to INT-03.3 (Open), SEC-08.1 (Open) |
| Resilience against node, zone and region failure, replication, egress, identity, keys and DNS recovery, DR tests | Scopes region and az with their RTO and RPO; pilot light for region, local HA for az; drill frequency open | REL-05.1, REL-05.2, REL-03.1, REL-03.2, REL-04.1, REL-04.2, REL-09.1 (Open) |

**Required outputs of the path:**

- Landing-zone gap analysis: left to the SDD; the constraints it must meet are SEC-04.1 and DAT-04.1 ([12 § 12.4](./12-sdd-handoff-guide.md#124-left-to-the-sdd)).
- Region and provider options: [07 § 7.1](./07-options-and-economics.md#71-options) compares the recovery shapes; the provider is left to the SDD.
- Service eligibility matrix: left to the SDD (it names products); SEC-08.1 holds the open vendor restrictions.
- Network and identity boundary diagram: [05 § 5.2.2](./05-target-shape.md#522-network); identity sources wait on QD-06.
- Rough-order TCO: [07 § 7.1](./07-options-and-economics.md#71-options) (CALC-21@OPT-01, CALC-21@OPT-02).
- Operating model: OPS-01.1, with OPS-02.1 and OPS-06.1 open.
- Portability ADR candidates: ECO-06.1 is open; [09 § 9.4](./09-decisions.md#94-pre-sdd-adrs) records the hosting part of ADR-PLATFORM-001.

## 2.3 Hybrid Boundary

Not applicable: the target is not hybrid.

## 2.4 Migration Overlay

Not applicable: no workload crosses a hosting or platform boundary. HDR-09.1 confirms there is no source platform and HDR-10.1 reads none; the fragment's `source unknown` is the unset source field of the overlay (`register.overlay.source`), not an open question.

## 2.5 Closest Worked Example

The engine names no closest worked example: the recovery tier in § 2.1 reads none for the RTO and RPO of both failure scopes (REL-03.1 and REL-04.1 for scope region, REL-03.2 and REL-04.2 for scope az).

<!-- MASTER: refunds-platform-pre-sdd-master.md | PREV: 01-business-brief.md | NEXT: 03a-register-business.md -->

<!--
CHUNK: 06
TITLE: Existing Estate
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: 02, 03a-03h
WRITTEN: full mode, brownfield or mixed (HDR-07). Omitted otherwise, never stubbed.
PART OF: Pre-SDD - [Project Name]
-->

# 6. Existing Estate

<!-- The brownfield inventory, as-is and to-be (Standard § 7, the BF-OP and BF-CL extensions, and § 14 D). There is no engine fragment here: every value is cited by the register entry that holds it (for example HDR-09 for the source platforms, CAP-07 for an observed latency, OVL-05 for a migration baseline), and a number no entry holds is not written. Evidence is cited by reference (a BRD section, a telemetry export, an inventory file). A gap is flagged as **[NEEDS CLARIFICATION: <specific question>]** and raised as an unknown (QD-NN). -->

## 6.1 Inventory

<!-- Components, owners, and the last-verified dependency graph, based on runtime traffic, not on diagrams alone. Shape words only: name a component by its role (for example "the settlement batch", "the customer store"), never by a product or version. -->

| Component | Role | Owner | Dependencies | Evidence |
|-----------|------|-------|--------------|----------|
| [Component] | [Role] | [Owner] | [Components it calls or feeds] | [Reference] |

## 6.2 Observed Baseline

<!-- Source workload patterns, latency percentiles, availability, incidents, saturation, and cost, each cited by the register entry that holds it. The gap between the observed baseline and the target is stated by ID (for example "CAP-07.1 target against the observed value in OVL-05.1"). -->

| Measure | Observed (entry) | Target (entry) | Gap |
|---------|------------------|----------------|-----|
| [Measure] | [Entry ID] | [Entry ID] | [Gap in words, or "None"] |

## 6.3 Constraints and Support Status

<!-- Licences, support end dates, network and address constraints (INT-06, INT-08), undocumented jobs and integrations, change tolerance, and technical debt that limit the target. Cite each by entry or evidence reference. -->

- [Constraint, with its entry ID or evidence]

## 6.4 As-Is and To-Be

<!-- The delta from the current estate to the target shape (chunk 05): what is kept, improved, consolidated, relocated, replatformed, refactored, or retired, per component. Do not reproduce a critical defect by copying the current environment. With the migration overlay, the per-workload 7R lives in chunk 08; this section names the component disposition only. -->

| Component | As-is | To-be | Disposition |
|-----------|-------|-------|-------------|
| [Component] | [Current shape] | [Target shape] | [Keep / Improve / Consolidate / Relocate / Replatform / Refactor / Retire] |

<!-- MASTER: [slug]-pre-sdd-master.md | PREV: 05-target-shape.md | NEXT: 07-options-and-economics.md -->

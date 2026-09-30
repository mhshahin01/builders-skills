<!--
CHUNK: 09
TITLE: Services Decomposition Summary
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: 04, 07
PART OF: SDD - [Project Name]
-->

# 13. Services Decomposition (Summary)

<!-- Type: `service` (its own deployable) or `module` (inside the single deployable of a modular monolith or hybrid core; architecture-questionnaire.md § Effect on the SDD). Status: `Active`, `Merged into [service]`, or `Removed: [reason]`; a merged or removed row stays in place, keeps its §17.X number, and has no 13x chunk (parts-mode.md, What every part does, step 4). Use cases (BRD), derive-from-BRD: the BRD use cases this service owns, from any source BRD, each keyed and linked to its BRD heading, e.g. [REFUNDS/UC-04](...) (brd-to-sdd.md § Use-case traceability). This column is the home of ownership: every active BRD use case has exactly one owner here, and §7.3 (chunk 03) reads it. A service that owns no use case writes "None - [what it serves]", e.g. "None - serves the BRD chunk 09 reports". A merged or removed service row writes "-". With no source BRD, write "-". -->

| Service | Type | Overview | Responsibility | Use cases (BRD) | Owns DB | Input | Output | Business Logic (Summary) | Integrations | Characteristics | Status |
|---------|------|----------|----------------|-----------------|---------|-------|--------|--------------------------|--------------|--------------------|--------|
| [Service Name] | [service / module] | [One-line] | [Responsibility] | [[KEY/UC-NN](BRD link), [KEY/UC-NN](BRD link)] | [DB name / schema] | [Inputs] | [Outputs] | [Summary] | [Integrations] | [Characteristics] | Active |
| [Service Name] | [service / module] | [One-line] | [Responsibility] | [None - what it serves] | [DB name / schema] | [Inputs] | [Outputs] | [Summary] | [Integrations] | [Characteristics] | [Active / Merged into [service] / Removed: [reason]] |

<!-- MASTER: [project-slug]-sdd-master.md | PREV: 08-integrations.md | NEXT: 10-events-hub.md -->

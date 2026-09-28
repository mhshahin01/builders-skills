<!--
CHUNK: 09
TITLE: Services Decomposition Summary
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: 04, 07
PART OF: SDD - [Project Name]
-->

# 13. Services Decomposition (Summary)

<!-- Use cases (BRD), derive-from-BRD: the BRD use cases this service owns, from any source BRD, each keyed and linked to its BRD heading, e.g. [REFUNDS/UC-04](...) (brd-to-sdd.md § Use-case traceability). This column is the home of ownership: every active BRD use case has exactly one owner here, and §7.3 (chunk 03) reads it. A service that owns no use case writes "None - [what it serves]", e.g. "None - serves the BRD chunk 09 reports". A merged or removed service row writes "-". With no source BRD, write "-". -->

| Service | Overview | Responsibility | Use cases (BRD) | Owns DB | Input | Output | Business Logic (Summary) | Integrations | Characteristics |
|---------|----------|----------------|-----------------|---------|-------|--------|--------------------------|--------------|--------------------|
| [Service Name] | [One-line] | [Responsibility] | [[KEY/UC-NN](BRD link), [KEY/UC-NN](BRD link)] | [DB name / schema] | [Inputs] | [Outputs] | [Summary] | [Integrations] | [Characteristics] |
| [Service Name] | [One-line] | [Responsibility] | [None - what it serves] | [DB name / schema] | [Inputs] | [Outputs] | [Summary] | [Integrations] | [Characteristics] |

<!-- MASTER: [project-slug]-sdd-master.md | PREV: 08-integrations.md | NEXT: 10-events-hub.md -->

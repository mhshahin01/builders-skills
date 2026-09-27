<!--
CHUNK: 08
TITLE: Integrations
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: 05, 03
PART OF: BRD - [Project Name]
LANGUAGE: Business language only. Name the business system or partner and the business purpose of the integration (e.g., "Integration with Payment Gateway"). Protocols, data formats, authentication, and SLAs are technical design - they are owned by the SDD.
-->

# Integrations

<!-- Business systems and partners this product exchanges information with, and why. State the what; the SDD defines the how. -->

| Business System / Partner | Business Purpose | Information Exchanged | Direction | Criticality | Provider / Owner |
|---------------------------|------------------|-----------------------|-----------|-------------|------------------|
| [e.g., Payment Gateway] | [e.g., Collect customer payments and process refunds] | [e.g., Payment requests, confirmations, refund status] | [We send / We receive / Both ways] | [Critical / Important / Nice-to-have] | [Provider name or owning team] |
| [External System 2] | [Purpose] | [Information] | [Direction] | [Criticality] | [Owner] |

> Technical integration details (protocols, authentication, data formats, availability targets) are defined in the SDD, not here.

<!-- MASTER: [project-slug]-brd-master.md | PREV: 07-users-use-cases-matrix.md | NEXT: 09-reporting-and-analytics.md -->

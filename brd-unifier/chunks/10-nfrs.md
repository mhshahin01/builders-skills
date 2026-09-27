<!--
CHUNK: 10
TITLE: Non-Functional Requirements
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: 01
PART OF: BRD - [Project Name]
LANGUAGE: Business language only. State WHAT quality the business expects (highly available, scalable, fast, secure) and how the business would recognise it. HOW it is achieved (architecture, clustering, replication, technology) is owned by the SDD.
-->

# Non-Functional Requirements

<!-- The what, not the how. A business measure is still concrete ("no more than 1 hour of disruption per month", "peak season checkout stays fast") - it is just expressed in terms the business can verify. Never invent measures; missing measure -> [NEEDS CLARIFICATION: ...]. -->

| NFR ID | Quality | Business Expectation (the what) | Business Measure |
|--------|---------|--------------------------------|------------------|
| NFR-01 | Availability | [e.g., The service is available around the clock; customers are never blocked from paying] | [e.g., No more than X minutes of disruption per month] |
| NFR-02 | Scalability | [e.g., Growth to X tenants / Y customers over Z years without degraded experience] | [e.g., Seasonal peaks of N times normal traffic handled without slowdown] |
| NFR-03 | Performance | [e.g., Screens respond immediately; reports are ready within moments] | [e.g., Everyday actions complete within N seconds] |
| NFR-04 | Security & Privacy | [e.g., Customer data is visible only to authorised users; regulatory data stays in-country] | [e.g., Access outside the Users & Use Cases Matrix is impossible] |
| NFR-05 | Usability | [e.g., A new operator completes core tasks without training] | [e.g., Task X completed unaided by a first-time user] |

> The technical realisation of each NFR (targets like uptime percentages, latency budgets, capacity plans, and the architecture that achieves them) is defined in the SDD, not here.

<!-- MASTER: [project-slug]-brd-master.md | PREV: 09-reporting-and-analytics.md | NEXT: 11-summary-and-uiux.md -->

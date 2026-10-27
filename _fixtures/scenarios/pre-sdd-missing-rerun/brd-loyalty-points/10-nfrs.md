<!--
CHUNK: 10
TITLE: Non-Functional Requirements
PROJECT: Loyalty Points
VERSION: 1.7
DEPENDS_ON: 01
PART OF: BRD - Loyalty Points
LANGUAGE: Business language only. State WHAT quality the business expects (highly available, scalable, fast, secure) and how the business would recognise it. HOW it is achieved (architecture, clustering, replication, technology) is owned by the SDD.
-->

# Non-Functional Requirements

**Table 7 - Non-Functional Requirements**

| NFR ID | Quality | Business Expectation (the what) | Business Measure |
|--------|---------|--------------------------------|------------------|
| NFR-01 | Accuracy | Every points movement follows the rules in [03 / Points movement](./03-definitions-and-domain-concepts.md#points-movement) and [UC-02 / Business Rules & Constraints](./06a-use-cases-member.md#business-rules--constraints-1). | Zero balance complaints upheld per month, as counted by the team that handles points complaints. |
| NFR-02 | Timeliness | Points taken back after a refund show in the member's balance and history. | Within 1 hour of the refund being paid. For a refund paid on the day the Refunds Portal starts to report refund outcomes, within 1 hour of the Refunds Portal reporting it as paid. In both cases, if the purchase earns its points after that moment, within 1 hour of the purchase earning them. This holds only while the purchase earns them within the wait set in [UC-02 BR-5](./06a-use-cases-member.md#business-rules--constraints-1). |
| NFR-03 | Timeliness | Points earned on a purchase show in the member's balance and history. | **[NEEDS CLARIFICATION: proposed: by the end of the day of the purchase, matching Assumption 1; confirm or replace]** |
| NFR-04 | Availability | Members can open their points balance and history at any time of day, every day. | **[NEEDS CLARIFICATION: How many minutes per month may the points screens be unavailable, planned maintenance included?]** |
| NFR-05 | Security & Privacy | A member's points balance, points history and purchase details are visible only to that member. | No member can see another member's points, history or purchase details. |

> The technical realisation of each NFR (targets like uptime percentages, latency budgets, capacity plans, and the architecture that achieves them) is defined in the SDD, not here.

<!-- MASTER: loyalty-points-brd-master.md | PREV: 09-reporting-and-analytics.md | NEXT: 11-summary-and-uiux.md -->

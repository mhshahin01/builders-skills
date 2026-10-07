<!--
CHUNK: 10
TITLE: Non-Functional Requirements
PROJECT: Loyalty Points
VERSION: 1.5
DEPENDS_ON: 01
PART OF: BRD - Loyalty Points
LANGUAGE: Business language only. State WHAT quality the business expects (highly available, scalable, fast, secure) and how the business would recognise it. HOW it is achieved (architecture, clustering, replication, technology) is owned by the SDD.
-->

# Non-Functional Requirements

| NFR ID | Quality | Business Expectation (the what) | Business Measure |
|--------|---------|--------------------------------|------------------|
| NFR-01 | Accuracy | Each member's points balance matches their movements under the rules in chunk 03: the opening balance, the purchases and refunds reported for them so far, and any corrections. | Zero balance complaints upheld per month, counted in the Monthly corrections report (chunk 09). In acceptance tests, every test balance matches its opening balance, purchases, refunds, and corrections. |
| NFR-02 | Timeliness | Points taken back after a refund show to the member. | Within 1 hour of the refund being paid, or within 1 hour of the purchase showing in the history if that is later. |
| NFR-03 | Timeliness | Points earned on a purchase show to the member on the day of the purchase. | By the end of the purchase day (branch local time). If this product learns that the member rejoined only after that day, by the end of the day it learns of the rejoin. |
| NFR-04 | Availability | Members can check their points at any time of day, every day (Business Objective 2). | No more than 60 minutes per month in which members cannot open their balance (UC-01) or their history (UC-02), planned maintenance included. |
| NFR-05 | Performance | Opening the balance or the history feels immediate to members. | The balance and the first page of the history open within 2 seconds. |
| NFR-06 | Usability | Members check their balance and history without help, including members who use assistive tools or only a keyboard. | A first-time member completes UC-01 and UC-02 unaided; the screens of UC-01 and UC-02 meet WCAG 2.1 level AA. |
| NFR-07 | Security & Privacy | Members' points, purchases, and refunds are visible only to the people the Users & Use Cases Matrix (chunk 07) allows. The Monthly corrections report is visible only to the Loyalty Administrator (chunk 09). Members' personal data is handled under the GDPR. The Data Protection Officer owns these rules. | No access outside the Users & Use Cases Matrix and the chunk 09 audience is possible. In acceptance tests, every attempt by one member to see another member's points fails. Every attempt by a staff member without the Loyalty Administrator role to open UC-03 or the Monthly corrections report also fails. |

> The technical realisation of each NFR (targets like uptime percentages, latency budgets, capacity plans, and the architecture that achieves them) is defined in the SDD, not here.

<!-- MASTER: loyalty-points-brd-master.md | PREV: 09-reporting-and-analytics.md | NEXT: 11-summary-and-uiux.md -->

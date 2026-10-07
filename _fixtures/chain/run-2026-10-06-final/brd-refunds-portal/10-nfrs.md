<!--
CHUNK: 10
TITLE: Non-Functional Requirements
PROJECT: Refunds Portal
VERSION: 1.4
DEPENDS_ON: 01
PART OF: BRD - Refunds Portal
LANGUAGE: Business language only. State WHAT quality the business expects (highly available, scalable, fast, secure) and how the business would recognise it. HOW it is achieved (architecture, clustering, replication, technology) is owned by the SDD.
-->

# Non-Functional Requirements

| NFR ID | Quality | Business Expectation (the what) | Business Measure |
|--------|---------|--------------------------------|------------------|
| NFR-01 | Reliability | Refund money is never lost or paid twice. | Zero missing or duplicate payouts per month. |
| NFR-02 | Availability | Customers can use the portal at any time. | No more than 2 hours of disruption a month, planned or unplanned. A partner outage that the portal handles with its own message (UC-01 E4, UC-04 E1, UC-06 E3) does not count. |
| NFR-03 | Scalability | The portal copes with seasonal sales. | The seasonal peak in [02 / Facts](./02-glossary-assumptions-facts.md#facts) (Fact 2), with everyday actions still within the NFR-05 time. |
| NFR-04 | Security & Privacy | Customer personal data is protected. | Only the customer, their branch's manager, and a branch manager covering that branch can see a request. |
| NFR-05 | Performance | Screens respond at once for customers and branch managers. | Everyday actions, such as checking a receipt or opening a request, complete within 3 seconds. |
| NFR-06 | Accessibility | Customers and branch managers with disabilities can use the portal, including with a screen reader or with a keyboard only. | Every screen meets WCAG 2.1 level AA. |

> The technical realisation of each NFR (targets like uptime percentages, latency budgets, capacity plans, and the architecture that achieves them) is defined in the SDD, not here.

<!-- MASTER: refunds-portal-brd-master.md | PREV: 09-reporting-and-analytics.md | NEXT: 11-summary-and-uiux.md -->

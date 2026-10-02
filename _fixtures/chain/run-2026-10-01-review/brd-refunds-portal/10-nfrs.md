<!--
CHUNK: 10
TITLE: Non-Functional Requirements
PROJECT: Refunds Portal
VERSION: 1.1
DEPENDS_ON: 01, 05
PART OF: BRD - Refunds Portal
-->

# Non-Functional Requirements

| ID | Requirement | Business measure |
|----|-------------|------------------|
| NFR-01 | Refund money is never lost or paid twice. | Zero missing or duplicate payouts per month. |
| NFR-02 | Customers can use the portal at any time. | No more than 2 hours a month in which customers cannot submit, track, or cancel a request, or branch managers cannot decide on one, whatever the cause, partner outages and planned maintenance included; measured over each month in live use. |
| NFR-03 | The portal copes with seasonal sales. | At 3 times the normal number of requests, sustained for 3 weeks, every customer and branch manager action responds as quickly as at the normal number. |
| NFR-04 | Customer personal data is protected. | Only the customer and their branch's manager can see a request. |

<!-- MASTER: refunds-portal-brd-master.md | PREV: 09-reporting-and-analytics.md | NEXT: 11-summary-and-uiux.md -->

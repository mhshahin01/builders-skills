<!--
CHUNK: 10
TITLE: Non-Functional Requirements
PROJECT: Loyalty Points
VERSION: 1.1
DEPENDS_ON: 01, 05
PART OF: BRD - Loyalty Points
-->

# Non-Functional Requirements

| ID | Requirement | Business measure |
|----|-------------|------------------|
| NFR-01 | The points balance is always right. | Zero balance complaints upheld per month. A complaint is upheld when the balance or a movement shown to the member does not match their purchases and refunds under the rules in 03 and UC-02. A difference is not a mismatch when it comes from a purchase that POS Records has not reported yet, from points earned within the NFR-03 hour, or from points taken back within the NFR-02 hour. |
| NFR-02 | Points taken back after a refund show quickly. | Within 1 hour of the Refunds Portal reporting the refund as paid, or within 1 hour of POS Records reporting the purchase if that is later. |
| NFR-03 | Points earned on a purchase show quickly. | Within 1 hour of POS Records reporting the purchase. |

<!-- MASTER: loyalty-points-brd-master.md | PREV: 09-reporting-and-analytics.md | NEXT: 11-summary-and-uiux.md -->

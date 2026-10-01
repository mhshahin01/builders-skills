<!--
CHUNK: 09
TITLE: Services Decomposition Summary
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: 04, 07
PART OF: SDD - Refunds Platform
-->

# 13. Services Decomposition (Summary)

Four bounded contexts in three deployables (ADR-01). "Module" rows run inside the core deployable `refunds-platform-core`; "service" rows are separate deployables. The `Use cases (BRD)` column is the home of use-case ownership: every active use case of both source BRDs has exactly one owner here.

| Service | Overview | Responsibility | Use cases (BRD) | Owns DB | Input | Output | Business Logic (Summary) | Integrations | Characteristics |
|---------|----------|----------------|-----------------|---------|-------|--------|--------------------------|--------------|--------------------|
| refund-service | Refund request lifecycle, from submission to paid | Receipt checks, refund requests and items, cancellation, branch decisions, payout outcome tracking, daily branch report | [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund), [REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status-web-and-mobile), [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request), [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | Schema `refund` in the core database | REST from the web app; `PAYOUT_SUCCEEDED`, `PAYOUT_FAILED`; POS receipt data (API-01) | REST responses; `REFUND_SUBMITTED`, `REFUND_CANCELLED`, `REFUND_APPROVED`, `REFUND_REJECTED`, `REFUND_PAID`, `REFUND_PAYOUT_FAILED` | State machine SUBMITTED -> CANCELLED / REJECTED / APPROVED -> PAID; 30-day window and one-refund-per-item rules; own-records and own-branch gates | POS Records (INT-03); Kafka | Module of `refunds-platform-core`; stateful; low write volume |
| payout-service | Pays approved refunds back to the original card | One payout per approved refund, CardPay attempts, retry window (ADR-10), payout outcome facts | None - pays approved refunds back to the original card | Database `payout` | `REFUND_APPROVED`; CardPay payout results (API-03) | `PAYOUT_SUCCEEDED`, `PAYOUT_FAILED` | Payout state machine with idempotent provider calls (ADR-10) | CardPay (INT-01); Kafka | Service (own deployable); money-critical; provider failure isolated |
| notification-service | Customer and branch manager messages for refund outcomes | Email and SMS to the customer for each refund event that the BRD says the customer is told about, and email to a branch's managers when a payout fails | None - sends refund messages to customers and branch managers | Database `notification` | `REFUND_SUBMITTED`, `REFUND_CANCELLED`, `REFUND_APPROVED`, `REFUND_REJECTED`, `REFUND_PAID`, `REFUND_PAYOUT_FAILED` | Messages through MsgHub (API-04) | Template per event, contact lookup at send time (ADR-09), one message per event and channel | MsgHub (INT-02); Keycloak Admin API (INT-04); Kafka | Service (own deployable); stateless apart from the send log; scales with seasonal peaks |
| loyalty-service | Members' points ledger | Earn movements from POS purchases, take-back movements on paid refunds, balance and history reads | [LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance), [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) | Schema `loyalty` in the core database | REST from the web app; POS member purchases (API-06); `REFUND_PAID` | REST responses | Append-only movements; balance kept equal to the sum of movements; take-back on `REFUND_PAID` ([LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-1) | POS Records (INT-03); Kafka | Module of `refunds-platform-core`; ledger; no events published |

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 08-integrations.md | NEXT: 10-events-hub.md -->

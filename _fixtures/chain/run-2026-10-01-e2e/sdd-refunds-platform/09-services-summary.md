<!--
CHUNK: 09
TITLE: Services Decomposition Summary
PROJECT: Refunds Platform
VERSION: 1.2
DEPENDS_ON: 04, 07
PART OF: SDD - Refunds Platform
-->

# 13. Services Decomposition (Summary)

Hybrid style (ADR-01): two modules in the `refunds-platform-core` deployable and two extracted services. The `Use cases (BRD)` column is the home of use-case ownership; §7.3 reads it.

| Service | Type | Overview | Responsibility | Use cases (BRD) | Owns DB | Input | Output | Business Logic (Summary) | Integrations | Characteristics | Status |
|---------|------|----------|----------------|-----------------|---------|-------|--------|--------------------------|--------------|--------------------|--------|
| refund-service | module (`refunds-platform-core`) | The refund bounded context, from request to paid. | Owns refund requests, their items, status history, decisions, and the branch report. | [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund), [REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status-web-and-mobile), [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request), [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | Core database, schema `refund` | REST from the web app; `PAYOUT_SUCCEEDED`, `PAYOUT_FAILED`; the payout watchdog schedule | REST responses; `REFUND_SUBMITTED`, `REFUND_CANCELLED`, `REFUND_APPROVED`, `REFUND_REJECTED`, `REFUND_PAID`; in-process `RefundPaid` | Refund request state machine with the 30-day window, one refund per item, own-branch decisions, and partial amounts. | POS Records (API-01); Kafka; loyalty-service (in process) | Stateful; write-light, read-heavy for tracking; seasonal peaks of three times the normal volume | Active |
| payout-service | service | The payout bounded context. | Owns payouts and payout attempts; pays each approved refund exactly once through the payment provider. | None - pays approved refunds and reports the payout results | Payout database | `REFUND_APPROVED`; retry schedule | `PAYOUT_SUCCEEDED`, `PAYOUT_FAILED` | One payout per refund, provider idempotency key, retries until paid, reporting a failure at the end of its retry window (§17.2). | Payment Provider CardPay (API-02); Kafka | Stateful; money-critical; isolated from the portal's failure domain | Active |
| notification-service | service | The customer messaging bounded context. | Owns message templates and the delivery log; sends customer email and SMS. | None - sends the customer email and SMS messages | Notification database | `REFUND_SUBMITTED`, `REFUND_APPROVED`, `REFUND_CANCELLED`, `REFUND_REJECTED`, `REFUND_PAID` | Messages through MsgHub; delivery log | One message per event and channel, template per event type, retries with an attempt limit. | Notification Partner MsgHub (API-03); Kafka | Consumer-only on the broker; fan-out to email and SMS | Active |
| loyalty-service | module (`refunds-platform-core`) | The loyalty points bounded context. | Owns member purchases, points movements, member balances, and the purchase import cursor; takes points back after a paid refund. | [LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance), [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) | Core database, schema `loyalty` | REST from the web app; member purchases from POS Records; in-process `RefundPaid` | REST responses | Whole-euro points per reported purchase, immutable movements (earned, taken back) with no 0-point movement, take-backs per refunded whole euro capped at what the purchase earned, balance as the sum of movements kept in the same transaction. | POS Records (API-04); refund-service (in process) | Stateful ledger; low volume; extraction trigger in ADR-01 | Active |

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 08-integrations.md | NEXT: 10-events-hub.md -->

<!--
CHUNK: 09
TITLE: Services Decomposition Summary
PROJECT: Refunds Platform
VERSION: 1.1
DEPENDS_ON: 04, 07
PART OF: SDD - Refunds Platform
-->

# 13. Services Decomposition (Summary)

All four rows are modules of the one deployable (ADR-01); each owns one schema of the shared PostgreSQL database.

| Service | Type | Overview | Responsibility | Use cases (BRD) | Owns DB | Input | Output | Business Logic (Summary) | Integrations | Characteristics | Status |
|---------|------|----------|----------------|-----------------|---------|-------|--------|--------------------------|--------------|--------------------|--------|
| refund | module | Refund request lifecycle | Refund requests, their items and status history, branch managers' decisions, the branch refund report | [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund), [REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status-web-and-mobile), [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request), [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | schema `refund` | REST from customers and branch managers; `PayoutSucceeded` | REST responses; `RefundSubmitted`, `RefundCancelled`, `RefundRejected`, `RefundPaid`; API-01 calls | Submitted, then Cancelled, Rejected, or Approved, then Paid; 30-day window and items-once rules; own-branch decisions | POS Records (INT-03, API-02); `payout` (API-01) | Stateful, user-facing, low volume | Active |
| payout | module | Payout execution | Payouts of approved refunds to the original card, with attempts and retries | None - pays approved refunds through the payment provider | schema `payout` | `PayoutPort.requestPayout` (API-01) | `PayoutSucceeded`, `PayoutFailed`; API-03 calls | Pending, then Succeeded, or Retrying for up to 24 h, then Failed (refused) or Unknown (unresolved, reconciled daily) | CardPay (INT-01, API-03) | Money-critical (REFUNDS/NFR-01); background dispatcher; provider bulkhead | Active |
| notification | module | Customer and branch manager messages | Email and SMS records and their delivery | None - sends refund messages to customers and payout alerts to branch managers | schema `notification` | `RefundSubmitted`, `RefundCancelled`, `RefundRejected`, `RefundPaid`, `PayoutFailed` | API-04 calls | One message record per event, recipient, and channel, sent by a dispatcher with retries | MsgHub (INT-02, API-04) | Fan-out listener; never blocks a refund | Active |
| loyalty | module | Points ledger | Members' points movements, balances, and pending take-backs | [LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance), [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) | schema `loyalty` | REST from members; member purchases from POS Records; `RefundPaid` | REST responses | Earn on member purchases; take back on `RefundPaid`; balance is the sum of movements | POS Records (INT-03, purchase intake) | Append-only ledger; read-heavy | Active |

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 08-integrations.md | NEXT: 10-events-hub.md -->

<!--
CHUNK: 09
TITLE: Services Decomposition Summary
PROJECT: Refunds Portal
VERSION: 1.0
DEPENDS_ON: 04, 07
PART OF: SDD - Refunds Portal
-->

# 13. Services Decomposition (Summary)

The backend is one deployable (ADR-01), so each row is a **module**: a bounded context with its own schema, packaged in the same deployable. Each module's detailed spec is its `13x` chunk (`13a` is §17.1). The modules were inferred from the [BRD Definitions & Important Details](../brd-refunds-portal/03-definitions-and-domain-concepts.md#definitions--important-details) (the refund request lifecycle and branch ownership), the use-case groupings, the two external surfaces of [BRD Integrations](../brd-refunds-portal/08-integrations.md#integrations) that own a clear responsibility (payouts, messages), and NFR-01, which isolates the money movement.

| Service | Overview | Responsibility | Use cases (BRD) | Owns DB | Input | Output | Business Logic (Summary) | Integrations | Characteristics |
|---------|----------|----------------|-----------------|---------|-------|--------|--------------------------|--------------|--------------------|
| refund | Refund request context: receipt eligibility, request lifecycle, decisions, daily branch report ([§17.1](./13a-service-refund.md)) | Source of truth for refund requests, their items, status history, decisions, and customer contact snapshot; enforces own-request and own-branch access | [UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund), [UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status-web-and-mobile), [UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request), [UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | Schema `refund` | REST calls from the SPA; events `PAYOUT_SUCCEEDED`, `PAYOUT_ESCALATED` | REST responses; events `REFUND_REQUEST_SUBMITTED`, `REFUND_REQUEST_CANCELLED`, `REFUND_APPROVED`, `REFUND_REJECTED`, `REFUND_PAID`, `REFUND_PAYOUT_ESCALATED`; the daily branch report | Checks receipts against POS Records and the refund window; records requests with a reference number; runs the request state machine with optimistic locking; re-publishes payout outcomes as refund facts | POS Records (INT-01, API-01) | Stateful (state machine); the only module with user-facing endpoints; synchronous dependency on POS Records |
| payout | Payout context: pays each approved refund back to the original card ([§17.2](./13b-service-payout.md)) | Source of truth for payouts, payout attempts, and provider results; guarantees one payout per refund request (NFR-01) | None - executes the payouts of approved refund requests | Schema `payout` | Event `REFUND_APPROVED`; payout results from CardPay (API-03); retry and escalation schedules | Payout calls to CardPay (API-02); events `PAYOUT_SUCCEEDED`, `PAYOUT_ESCALATED` | Creates one payout per approved request; calls CardPay with a stable idempotency key; retries with backoff; resolves unknown outcomes before retrying; escalates when the window passes | CardPay (INT-02, API-02, API-03) | Stateful (state machine); moves money; asynchronous to users; idempotent |
| notification | Notification context: customer and branch-manager messages ([§17.3](./13c-service-notification.md)) | Source of truth for messages and delivery attempts | None - sends the customer and branch-manager messages | Schema `notification` | Events `REFUND_REQUEST_SUBMITTED`, `REFUND_REQUEST_CANCELLED`, `REFUND_REJECTED`, `REFUND_PAID`, `REFUND_PAYOUT_ESCALATED` | Email and SMS through MsgHub (API-04) | Maps each event to its messages; one message per event and channel; retries; dead-letters after the last attempt | MsgHub (INT-03, API-04) | Consumer only (publishes no event); asynchronous; idempotent |

<!-- MASTER: refunds-portal-sdd-master.md | PREV: 08-integrations.md | NEXT: 10-events-hub.md -->

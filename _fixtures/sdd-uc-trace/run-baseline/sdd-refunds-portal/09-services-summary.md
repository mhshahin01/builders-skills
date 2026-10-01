<!--
CHUNK: 09
TITLE: Services Decomposition Summary
PROJECT: Refunds Portal
VERSION: 1.0
DEPENDS_ON: 04, 07
PART OF: SDD - Refunds Portal
-->

# 13. Services Decomposition (Summary)

The architecture is a modular monolith (ADR-01): each row is a **module** of the one backend deployable `refunds-portal-backend`, with its own bounded context and PostgreSQL schema. "Service" in §13 and §17 reads as "module". Row order sets the §17 numbering (`13a` is §17.1).

| Service | Overview | Responsibility | Owns DB | Input | Output | Business Logic (Summary) | Integrations | Characteristics |
|---------|----------|----------------|---------|-------|--------|--------------------------|--------------|--------------------|
| refund-requests | The refund request lifecycle, from receipt check to Paid, Rejected, or Cancelled, and the branch decision queue | UC-01, UC-02, UC-03, UC-04 (the decision), and the branch refund report of [BRD 09](../brd-refunds-portal/09-reporting-and-analytics.md). Owns the refund request, its items, status history, item claims, and the customer contact snapshot | Schema `refund_requests` in database `refunds_portal` | REST calls from the customer and branch-manager areas; payout events (§14.5.2); in-process contact queries from notifications (API-02) | REST responses and the branch report; lifecycle events (§14.5.1); contact query results (API-02) | Receipt eligibility (refund window, item-once rule through item claims), the lifecycle state machine with optimistic locking, owner and branch scope on every read and write | INT-03 Point-of-Sale Records (API-01) | Module in the core deployable; stateful aggregate; synchronous customer path with at most one provider hop |
| payouts | Pays each approved refund to the original card exactly once | UC-04 steps 6-7 and E1; NFR-01. Owns the payout and its attempt log | Schema `payouts` in database `refunds_portal` | Refund request lifecycle events (§14.5.1); CardPay result callbacks (API-04); the retry scheduler | Payout requests and status queries to CardPay (API-03, API-06); payout events (§14.5.2) | One payout per approved request, idempotent dispatch from committed state, retries with backoff and jitter, one escalation when the UC-04 E1 window passes (ADR-08) | INT-01 CardPay Ltd (API-03, API-04, API-06) | Module in the core deployable; stateful aggregate; fully asynchronous; money-critical |
| notifications | Tells customers, and branch managers for escalated payouts, what happened to a refund | The messages of UC-01 step 6, UC-03 step 5, UC-04 step 7, UC-04 A2, and UC-04 E1. Owns the message dispatch log and the message templates | Schema `notifications` in database `refunds_portal` | Refund request lifecycle and payout events (§14.5); contact query results (API-02) | Message requests to MsgHub (API-05); no events | Message plan per event, contact resolution through API-02, template rendering per locale, idempotent dispatch with retries | INT-02 MsgHub (API-05) | Module in the core deployable; consumer-only; asynchronous |

BRD use-case coverage: UC-01 → refund-requests, notifications; UC-02 → refund-requests; UC-03 → refund-requests, notifications; UC-04 → refund-requests, payouts, notifications; UC-05 is merged into UC-04 ([BRD 05 § Use Case Summary](../brd-refunds-portal/05-user-journeys-overview.md#use-case-summary)). No module owns an entity another module owns; identities live in the IAM (§16).

<!-- MASTER: refunds-portal-sdd-master.md | PREV: 08-integrations.md | NEXT: 10-events-hub.md -->

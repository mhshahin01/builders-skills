<!--
CHUNK: 13d
TITLE: Detailed Service Spec - loyalty-points
PROJECT: Refunds Platform
VERSION: 1.3
DEPENDS_ON: 09, 07, 10 (event hub - in-process event names must match chunk 10 verbatim), 11 (API contracts - integration endpoints carry their API ID and match chunk 11 verbatim), 12 (roles - permission tokens match chunk 12 verbatim)
PART OF: SDD - Refunds Platform
-->

# 17. Detailed Service Specs

---

## 17.4 loyalty-points

### What

The `loyalty-points` module of `refunds-platform-app` owns the loyalty points bounded context: each member's points movements (earned on branch purchases, taken back after paid refunds), the balance as their sum ([LOYALTY 03 § Points movement](../brd-loyalty-points/03-definitions-and-domain-concepts.md#points-movement)), and the member's view of both.

### Boundaries

- **Owns:** points accounts (one per member), points movements, the purchases received from POS Records with their details, the processed-refund inbox, the refund-outcome log, the take-backs parked until their purchase arrives or the parking period ends, and a copy of each member's leave date (the membership source of §16.6 owns the record).
- **Does not own:** refund requests and payouts (`refund-request`, `payout`), member sign-in and membership records (platform IAM and the membership source of §16.6), receipts in POS Records.
- **Upstream consumers:** the web app (member screens); POS Records delivering purchases, if it pushes them (API-05; push or fetch open, Input).
- **Downstream dependencies:** the refund outcomes from `refund-request`: `RefundRequestPaid`, `RefundRequestRejected`, `RefundRequestCancelled`, and `RefundRequestPayoutReturned`.

### Input

| Type | Source | Description |
|------|--------|-------------|
| REST | Member web app | Balance, history, movement detail (List of APIs). |
| REST (external; inbound push or outbound fetch) | POS Records | Member purchases (API-05). If `loyalty-points` fetches, a `Schedule` row for the fetch job replaces this row, and the job runs per tenant (§11.2). **[NEEDS CLARIFICATION: Does POS Records send each member purchase to Loyalty Points as it happens, or does Loyalty Points fetch the day's purchases, and on what schedule? Owner: Retail IT team (POS Records).]** |
| Event | refund-request | `RefundRequestPaid` takes points back ([LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-1: paid refund takes points back; [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) BR-9: Loyalty Points told the outcome). |
| Event | refund-request | `RefundRequestRejected` is recorded with no movement ([LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-1: rejected or cancelled takes back nothing; [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) BR-9: Loyalty Points told the outcome). |
| Event | refund-request | `RefundRequestCancelled` is recorded with no movement ([LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-1: rejected or cancelled takes back nothing; [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request) BR-3: Loyalty Points told on cancellation). |
| Event | refund-request | `RefundRequestPayoutReturned` is recorded; its effect on points is open (Take-back) ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) BR-9: Loyalty Points told the outcome). |
| Schedule | loyalty-balance-verification | Daily balance check (LOYALTY/NFR-01); platform job, no use case. |
| Schedule | loyalty-retention-purge | Removes purchase and refund details past their retention period and the history of members who left (Retention Policy), and ends parked take-backs that waited the parking period with no movement (Take-back); platform job, no use case. |

### Business Logic

**Purchase intake and earning** ([LOYALTY 03 § Earning points](../brd-loyalty-points/03-definitions-and-domain-concepts.md#earning-points), [LOYALTY 03 § Start of points](../brd-loyalty-points/03-definitions-and-domain-concepts.md#start-of-points)). Each purchase is recorded once, keyed by `(tenant_id, purchase_reference)`; a repeated delivery changes nothing. A purchase earns an `Earned` movement per the earning rule of [LOYALTY 03 § Earning points](../brd-loyalty-points/03-definitions-and-domain-concepts.md#earning-points), dated with the purchase date, when the purchase date is on or after the start of points and the member is still in the program when the purchase arrives; otherwise the purchase is recorded with no movement. A purchase that arrives after its purchase day still earns its points and keeps its purchase date. After the earned movement, any take-back parked for that purchase is applied in the same transaction. **[NEEDS CLARIFICATION: How are points rounded for a purchase amount that is not a whole number of euros, and from which date do purchases earn points, with or without an opening balance from an earlier program? LOYALTY 03 § Earning points and § Start of points leave these open. Owner: LOYALTY BRD owner.]**

**Take-back** ([LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-1: paid refund takes points back, BR-3: once per paid refund, BR-4: only purchases that earned points, BR-5: refund paid before earning, BR-6: take-back never exceeds earned, BR-7: only refunds the Refunds Portal reports, A1). The `RefundRequestPaid` listener first applies the ordering rule of Other refund outcomes: a Paid outcome older than one already recorded for the request is recorded in the refund-outcome log with no effect and does not enter the processed-refund inbox. Otherwise it inserts the refund reference into the processed-refund inbox, keyed by `(tenant_id, refund_reference)`; a repeated report of the same paid refund stops there (BR-3). A refund paid before the refund-reporting start date (the setting of §11.5, compared as branch-local dates) is recorded as processed with no movement (BR-7: refund paid before reporting starts takes back nothing). Otherwise the listener matches the refund to its purchase (§5 marker) and:

- if the purchase has not arrived yet, parks the take-back (BR-5). Every refund of a purchase that is not a member's parks too, because POS Records sends only member purchases, so a parked take-back ends with no movement once the wait that BR-5 sets has passed since the refund was paid; the `loyalty-retention-purge` job ends them;
- if the purchase earned no points, or the member left before the refund was paid, records no movement (BR-4; [LOYALTY 03 § Member leaves the loyalty program](../brd-loyalty-points/03-definitions-and-domain-concepts.md#member-leaves-the-loyalty-program));
- otherwise writes a `TakenBack` movement dated with the date the refund was paid, with the refund reference, for the points to take back, capped so that the take-backs of one purchase never exceed what it earned (BR-6).

The points to take back are 1 per 1 EUR of the refunded amount (the amount paid back), rounded as earning is rounded (the rounding marker above), within the BR-6 cap ([LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-1: partial refund takes back 1 point per 1 EUR refunded), so a full refund takes back what the purchase earned. The listener completes within the LOYALTY/NFR-02 budget (§18.5).

**Other refund outcomes** ([LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-1: rejected or cancelled takes back nothing). Every outcome listener records the outcome and its `sequence` in the refund-outcome log, keyed by `(tenant_id, event_id)`; the `RefundRequestRejected`, `RefundRequestCancelled`, and `RefundRequestPayoutReturned` outcomes add no movement. A Rejected outcome is recorded with its `rejectionKind`; a yes to the §5 dispute marker adds the take-back for `DISPUTE_REFUNDED` and the receipt number, amount, and date it needs to `RefundRequestRejectedDto`. `loyalty-points` records the time it is first switched on (§11.5), for the LOYALTY/NFR-02 measure. Every outcome listener, the `RefundRequestPaid` one included, applies the outcomes of one refund request in `sequence` order (§14.10 Ordering): an outcome older than one already recorded for that request is recorded with no effect. While Loyalty Points is switched off, the outcomes wait in the publication log of `refund-request` and reach these listeners when it is switched on (§11.3). **[NEEDS CLARIFICATION: When the Refunds Portal reports that a Paid refund went back to Approved because the customer's bank sent the payout back, does Loyalty Points give back the points it took back, and does the refund take them back again when it is paid again? [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-1: paid refund takes points back and BR-3: once per paid refund, and [LOYALTY 08 § Integrations](../brd-loyalty-points/08-integrations.md#integrations) names only the paid, rejected and cancelled outcomes. Owner: LOYALTY BRD owner.]**

**Concurrency.** Purchase intake and the take-back listener both take a transaction-scoped PostgreSQL advisory lock on the hash of `(tenant_id, purchase_reference)` before they read or write the purchase or a parked take-back, so each sees the other's commit. Every movement locks the member's points account row (`SELECT ... FOR UPDATE`) and updates the balance in the same transaction. A daily `loyalty-balance-verification` job compares each account's balance with the sum of its movements and raises an operations alert on any difference.

**Balance** ([LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance) steps 1-2, A1, E1, BR-1, BR-2, BR-3). The account row holds the balance, updated in the same transaction as each movement, kept equal to the sum of the movements by the account row lock and checked daily by `loyalty-balance-verification`. `GET /v1/members/me/points-balance` returns the balance, the date of the newest movement (BR-3: last movement date), a `hasMovements` flag (A1: explanation only when there is no movement), and the timing note of BR-2 (purchases within LOYALTY/NFR-03, take-backs within LOYALTY/NFR-02); the web app also shows, with every balance, the line of step 2 that points cannot be used yet ([LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance) AC-9: points cannot be used yet line), as fixed screen text, not a response field. When the store cannot be read it returns 503, never a balance of 0 (E1).

**History** ([LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) steps 1-4, A2, E1). `GET /v1/members/me/points-movements` lists movements newest first with date, purchase or refund reference, and points, plus the same timing note; `GET /v1/members/me/points-movements/{movementId}` returns the purchase details (purchase date, branch, purchase reference, amount in EUR, points) or the refund details (paid date, refund reference, purchase reference, refunded amount in EUR, points taken back). Details purged by retention return the movement with a `detailsAvailable: false` flag (A2). A failed read returns 503, never an empty list (E1).

**Membership** ([LOYALTY 03 § Member leaves the loyalty program](../brd-loyalty-points/03-definitions-and-domain-concepts.md#member-leaves-the-loyalty-program), [LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance) AC-7: person who left sees no balance). The membership source of §16.6 owns joining and leaving; `loyalty-points` keeps a copy of each member's leave date, used only to close the account and to apply LOYALTY 03: a purchase that arrives after the leave date earns no points (arrival time, as LOYALTY 03 sets it), and a refund paid after the leave date takes back no points (the paid date). A member who left gets 403 `MEMBERSHIP_ENDED` on every endpoint; their account is closed and no later purchase or refund changes it. The source of membership, the member identifier, and how late the leave date can reach `loyalty-points` are open (§16.6 marker).

**Corrections.** Loyalty Points has no correction movement. **[NEEDS CLARIFICATION: How is a member's balance corrected when a complaint about points is upheld, given that there is no correction movement? LOYALTY 03 § Points movement leaves it open, and the answer may add an entry point to loyalty-points. Owner: LOYALTY BRD owner.]**

### Output

| Type | Destination | Description |
|------|-------------|-------------|
| REST response | Web app | Balance, history, movement detail. |
| REST response | POS Records | Acknowledgement of a purchase delivery (API-05), if POS Records pushes; if `loyalty-points` fetches, it sends the fetch request instead. |

### Integrations

| Integration | Direction | Protocol | Purpose | Contract | Failure Handling |
|-------------|-----------|----------|---------|----------|------------------|
| POS Records | Inbound push or outbound fetch (open, §17.4 Input), sync | HTTPS | Member purchases | API-05 (§15) | Idempotent on the purchase reference; late purchases still earn |
| refund-request | Inbound, async in-process | Domain events | Refund outcomes | `RefundRequestPaid`, `RefundRequestRejected`, `RefundRequestCancelled`, `RefundRequestPayoutReturned` (§14.10) | Inbox on the refund reference for paid refunds, outcome log on the event id; publication log redelivery |

### DB Modeling

#### Entity Relationship

The concepts are the points account, the points movement, the received purchase, the processed refund, the refund outcome, and the parked take-back. **[NEEDS CLARIFICATION: ERD, table list, column types, constraints, and indexes for the points account, movements, received purchases, processed refunds, refund outcomes, and parked take-backs. The BRD describes the concepts but does not commit to a relational schema. Owner: solution architect.]**

#### Tables Design

Per the Entity Relationship marker. Fixed so far: unique keys `(tenant_id, purchase_reference)`, `(tenant_id, refund_reference)`, and `(tenant_id, event_id)` on the refund-outcome log; the daily balance verification against the sum of movements; `tenant_id` leads every key and index.

#### Migration Strategy

- **Tool:** per ADR-10 (Proposed); versioned SQL scripts for schema `loyalty_points`.
- **Backward compatibility:** additive; expand-and-contract (AP-10).
- **Data backfill:** an opening-balance load, if the §17.4 Business Logic marker requires one, is a one-time versioned script.
- **Rollback:** roll forward with a corrective script.

#### Retention Policy

- All tables: **[NEEDS CLARIFICATION: How long are the purchase and refund details behind a movement kept, and how long after a member leaves is their history deleted? LOYALTY 03 § Keeping points history and § Member leaves the loyalty program leave both open. Owner: LOYALTY BRD owner.]** Movements stay while the member is in the program; details are purged after their period, leaving date, reference, and points (A2).

#### Archival

- **Cold storage:** not applicable for this release.
- **Format:** not applicable.
- **Schedule:** not applicable.
- **Restore SLA:** not applicable.

#### Data Encryption

- **At rest:** storage encryption of the PostgreSQL offering (§6).
- **In transit:** TLS 1.2+ to PostgreSQL and on API-05.
- **Key management:** the hosting environment's key service.
- **PII columns:** member identifier and purchase details; masked in non-production environments.

### Multi-Tenancy Specifications

- **Strategy override:** none.
- **Tenant filter:** mandatory `tenant_id` predicate; member filter from the access token.
- **Cross-tenant queries:** none.

### API Standards

- **Style:** REST, JSON (ADR-04).
- **Versioning:** URI prefix `/v1`.
- **Authentication:** OIDC access token for member endpoints; the provider scheme on API-05 (`TBD - external`).
- **Idempotency:** reads only for members; API-05 idempotent on the purchase reference.
- **Pagination:** cursor-based on the history.
- **Error envelope:** §15.1 error model.

#### List of APIs (Swagger-friendly)

These endpoints are proposals for the use cases' entry points; their request and response fields are open. **[NEEDS CLARIFICATION: Request and response fields of each loyalty-points member endpoint; the use cases' acceptance criteria imply them but do not specify them. Owner: solution architect.]**

| Method | Path | Summary | Request Body | Response | Permission token (§16) | API ID (§15) |
|--------|------|---------|--------------|----------|------------------------|--------------|
| GET | `/v1/members/me/points-balance` | Own balance, last movement date, timing note | - | `PointsBalance` | `loyalty.points.read-own` | - |
| GET | `/v1/members/me/points-movements` | Own movements, newest first | - | `PointsMovementPage` | `loyalty.points.read-own` | - |
| GET | `/v1/members/me/points-movements/{movementId}` | Details behind one movement | - | `PointsMovementDetail` | `loyalty.points.read-own` | - |
| TBD | TBD | Receive member purchases from POS Records (only if POS Records pushes; a fetch has no inbound endpoint) | `TBD - external` | `TBD - external` | - | API-05 |

### Event-Driven Architecture (If Applicable)

#### Event Model

**Published events:** Not applicable - no integration events.

**Consumed events:** Not applicable - no integration events.

**In-process domain events (modules only):**

| Event | Publisher module | Listener modules | Transaction phase (before commit / after commit) | Payload (DTO) | Notes |
|---|---|---|---|---|---|
| `RefundRequestPaid` | refund-request | customer-notification, loyalty-points | after commit | `RefundRequestPaidDto`: fields per §14.10 | Handled here: take-back |
| `RefundRequestRejected` | refund-request | customer-notification, loyalty-points | after commit | `RefundRequestRejectedDto`: fields per §14.10 | Handled here: outcome recorded, no movement |
| `RefundRequestCancelled` | refund-request | customer-notification, loyalty-points | after commit | `RefundRequestCancelledDto`: fields per §14.10 | Handled here: outcome recorded, no movement |
| `RefundRequestPayoutReturned` | refund-request | customer-notification, loyalty-points | after commit | `RefundRequestPayoutReturnedDto`: fields per §14.10 | Handled here: outcome recorded; effect on points open (Other refund outcomes) |

#### Messaging Infra

Not applicable - no integration events.

### Constraints

- [LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance): role `MEMBER`, token `loyalty.points.read-own`, own points only ([LOYALTY 07](../brd-loyalty-points/07-users-use-cases-matrix.md#users--use-cases-matrix) footnote 1).
- [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history): role `MEMBER`, token `loyalty.points.read-own`, own points only (footnote 1).
- Movements are never updated, except detail columns cleared by the retention purge, and never deleted except by the retention purge, which deletes the history of a member who left once its period ends ([LOYALTY 03 § Member leaves the loyalty program](../brd-loyalty-points/03-definitions-and-domain-concepts.md#member-leaves-the-loyalty-program)).
- The balance always equals the sum of the movements (LOYALTY/NFR-01).

### Error Handling

- **Synchronous APIs:** §15.1 error model.
- **Validation errors:** API-05 purchases that fail validation are refused and logged for the POS Records owner: with 400 `VALIDATION_FAILED` if POS Records pushes them; skipped and counted if `loyalty-points` fetches them.
- **Domain errors:** [LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance) E1 and [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) E1 -> 503 `UNAVAILABLE`, never a 0 balance or an empty list; a member who left -> 403 `MEMBERSHIP_ENDED`.
- **Auth errors:** 401 `UNAUTHENTICATED`; another member's movement id -> 404 `NOT_FOUND`.
- **Server errors:** 500 `INTERNAL_ERROR` with the correlation id.
- **Async consumers:** each outcome listener first applies outcomes in `sequence` order (Other refund outcomes); the `RefundRequestPaid` listener is then idempotent on the refund reference inbox, the other outcome listeners on the event id.
- **Poison messages:** per §17.1 (publication log redelivery, 30-minute alert, within the LOYALTY/NFR-02 budget (§18.5)).

### Observability & Monitoring

#### Logging

- JSON per §11.4, with `movement_id` and the internal ids of the received purchase and the processed refund; never the purchase reference or the refund reference (purchase data, §11.6).
- No member name or purchase details.
- Retention per the logging backend (§6).

#### Metrics

| Metric | Type | Labels | Purpose |
|--------|------|--------|---------|
| `loyalty_movements_total` | counter | `kind` | Earned, taken back |
| `loyalty_takeback_lag_seconds` | histogram | - | From the latest of the `RefundRequestPaid` event's `occurredAt`, the time Loyalty Points was switched on (for an outcome kept while it was off), and, for a parked take-back, the commit of the purchase's earned movement, to the take-back committed (LOYALTY/NFR-02, §18.5); a parked take-back that ends with no movement is not observed |
| `loyalty_parked_takebacks` | gauge | - | Take-backs waiting for their purchase |
| `loyalty_purchase_intake_total` | counter | `outcome` | Earned, no points, duplicate |

#### Tracing

- Spans per endpoint, per purchase delivery, and per listener.
- 100% sampling (§11.4).

### Developer Notes

- **Recommended patterns:** aggregate `PointsAccount` appends movements and keeps the balance; the take-back cap is computed from the purchase's earned and taken-back totals inside the same transaction.
- **Avoid:** recomputing a balance from another module's data; any movement kind other than Earned and TakenBack.
- **Testing:** one test per LOYALTY acceptance criterion, including the duplicate paid refund, the refund paid before earning, and the cap; integration tests against a real PostgreSQL.

### Service-Level Diagrams

#### Implementation Flow Chart

Not applicable: the take-back and earning flows are §8.4.3 and §8.4.4.

#### Sequence Diagram (Service-Internal)

Not applicable: the take-back sequence is §8.5.3.

### Compliance

- **GDPR:** per the §17.1 Compliance marker.
- **PCI-DSS:** not applicable.
- **ISO 27001 / SOC 2:** not applicable for this release.
- **Local regulations:** none stated.

### Deployment Strategy

- **Service-specific override:** none (one deployable, §11.3).
- **Replicas:** per §11.3.
- **Strategy:** per §11.3.
- **Health checks:** per §11.3.
- **Rollback:** previous image.

### Future Enhancements

- Export the history ([LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) Future Enhancements).
- Tell the member when points are taken back after a refund ([LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) Future Enhancements); this release sends no message ([LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-8: no message on take-back).

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 13c-service-customer-notification.md | NEXT: 14-performance-and-capacity.md -->

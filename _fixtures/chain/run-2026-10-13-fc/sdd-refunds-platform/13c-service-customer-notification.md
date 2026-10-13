<!--
CHUNK: 13c
TITLE: Detailed Service Spec - customer-notification
PROJECT: Refunds Platform
VERSION: 1.3
DEPENDS_ON: 09, 07, 10 (event hub - in-process event names must match chunk 10 verbatim), 11 (API contracts - integration endpoints carry their API ID and match chunk 11 verbatim), 12 (roles - permission tokens match chunk 12 verbatim)
PART OF: SDD - Refunds Platform
-->

# 17. Detailed Service Specs

---

## 17.3 customer-notification

### What

The `customer-notification` module of `refunds-platform-app` owns the messaging bounded context: it turns refund and payout events into the email and SMS messages that [REFUNDS 03 § Customer messages](../brd-refunds-portal/03-definitions-and-domain-concepts.md#customer-messages) sets out, plus the branch-manager alert for a payout still failing, and sends them through MsgHub. A message that cannot be sent never stops or changes a refund request.

### Boundaries

- **Owns:** message records (one per message and channel), their send attempts and outcomes, and the message templates.
- **Does not own:** customer contact details (read from `refund-request` through API-06 at send time and not stored), branch manager accounts (platform IAM), refund and payout state.
- **Upstream consumers:** none; the module has no user-facing API.
- **Downstream dependencies:** MsgHub (API-03); `CustomerContactPort` (API-06); the platform IAM for the branch managers of a branch (API-08).

### Input

| Type | Source | Description |
|------|--------|-------------|
| Event | refund-request | `RefundRequestSubmitted`: submission message ([REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) step 7). |
| Event | refund-request | `RefundRequestApproved`: approval message, partial ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) A1) or full ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 8). |
| Event | refund-request | `RefundRequestRejected`: rejection message ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) A2, BR-8: dispute refunded by the bank). |
| Event | refund-request | `RefundRequestCancelled`: cancellation email ([REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request) step 5). |
| Event | refund-request | `RefundRequestPaid`: paid message ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 9). |
| Event | refund-request | `RefundRequestPayoutReturned`: back-to-Approved message, saying the payout is delayed ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1). |
| Event | payout | `PayoutAttemptFailed`: payout-delayed message ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1). |
| Event | payout | `PayoutStillFailing`: branch-manager alert ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1). |
| Schedule | message-sender | Sends queued messages and retries failed sends; platform job. |
| Schedule | notification-retention-purge | Removes rows past the retention period (Retention Policy); platform job, no use case. |

### Business Logic

**Select.** Each listener (deduplicated on the event id) creates one message record per channel, keyed by `(tenant_id, event_id, channel)`, with status `Queued`. Channels follow REFUNDS 03 Customer messages: email and SMS for every status change except Cancelled (email only). Specific rules:

- `RefundRequestApproved` produces the partial-approval message, with the approved amount and the reason, when the approval lowered at least one unit ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) A1), and otherwise the full-approval message, with the approved amount ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 8: customer told on approval).
- `PayoutAttemptFailed` produces the payout-delayed message by email and SMS ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) AC-8: customer told payout is delayed). When the newest refund status the module has seen for the request (its highest `sequence`, below) is Paid, the payout-delayed message is created as `Superseded`, so the order in which the two events arrive does not matter.
- `RefundRequestPayoutReturned` produces the back-to-Approved message, saying the payout is delayed, by email and SMS ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) AC-11: customer told payout is delayed after a Paid payout is sent back). From then on the newest status is Approved again, so later payout failure messages of the request are created normally.
- `PayoutStillFailing` produces one email to each enabled staff account that holds `BRANCH_MANAGER` with the request's `branch_id`, read at send time through `StaffDirectoryPort` (API-08) and never stored. When no such account exists, the message is marked `Failed` and an operations alert names the branch and the refund request, so the alert still reaches a person ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) AC-2: still failing after one day); who covers an absent branch manager follows §16.4. When the IAM cannot be reached, the send is retried like a MsgHub failure, within the INT-02 bounds. The message makes one MsgHub call per recipient, with the idempotency key a name-based UUID (RFC 9562 version 5) with the message id as namespace and the recipient's IAM user id as name, the same on every retry; each recipient's outcome is kept on the message's send attempts by IAM user id, never by address; the message is `Sent` once every recipient's call has succeeded, and a retry sends only to the recipients without a successful call.
- `RefundRequestPaid` also marks every payout-delayed message and every still-failing alert of the same refund request that is `Queued` or `Sending` as `Superseded`, and a `PayoutStillFailing` that arrives while the newest refund status seen for the request is Paid creates its alert as `Superseded`; the `message-sender` never sends a `Superseded` message.
- Stale status messages: the module keeps the highest `sequence` it has seen per refund request (§14.10 Ordering). The `message-sender` sends the status messages of one refund request in `sequence` order: it claims a status message only when no status message of the same refund request with a lower `sequence` is `Queued` or `Sending`, so the submission and approval messages go before any later status message ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) AC-10: customer told of a full approval before Paid). A refund status event whose `sequence` is lower than the highest seen creates its message as `Superseded`, except the submission message and the approval message, which carry what no later message repeats (the reference number, [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) step 7; the approved amount and the partial-approval reason, [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) AC-6: customer told the approved amount and the reason) and are always sent.
- The `PayoutAttemptFailed`, `PayoutStillFailing`, `RefundRequestPaid`, and `RefundRequestPayoutReturned` listeners all take a transaction-scoped PostgreSQL advisory lock on the hash of `(tenant_id, refund_request_id)` before they read or write the message records of that refund request, so each sees the other's commit.

**Send.** The `message-sender` job claims queued messages with `FOR UPDATE SKIP LOCKED` (the status messages of one refund request in `sequence` order, Select), reads the customer's email address and mobile number through `CustomerContactPort` (API-06) at send time, and calls MsgHub (API-03) outside any database transaction with the message id as the idempotency key (per recipient for the branch-manager alert, Select). A failed send is retried with exponential backoff and jitter within the INT-02 bounds; a message that still fails is marked `Failed` and counted, and nothing is reported back to `refund-request` ([REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) AC-4: request recorded even if messages fail). A contact detail the customer did not give skips that channel. The claim commits the message as `Sending` with a lease of the MsgHub call timeout (INT-02) + 1 minute; an expired lease returns the message to `Queued`. While MsgHub's idempotency support is unconfirmed (API-03), a duplicate message after a crash is accepted. When a MsgHub call returns, the sender records the outcome on the message's send attempts and changes the message status only if it is still `Sending`, so a message a listener marked `Superseded` meanwhile stays `Superseded` and is never retried; an expired lease returns a message to `Queued` only if it is still `Sending`. A call already in flight when its message is superseded can still reach the recipient; this is accepted, because a sent message cannot be recalled.

**Language and wording.** Message texts are templates per message type and channel. **[NEEDS CLARIFICATION: Which languages and wording do the customer messages use? REFUNDS 11 § UI/UX Expectations leaves the languages open. Owner: REFUNDS BRD owner.]**

### Output

| Type | Destination | Description |
|------|-------------|-------------|
| REST call | MsgHub | Send an email or an SMS (API-03). |
| In-process port call | refund-request | Contact details (API-06). |
| Outbound call | Platform IAM | Branch managers of a branch (API-08). |

### Integrations

| Integration | Direction | Protocol | Purpose | Contract | Failure Handling |
|-------------|-----------|----------|---------|----------|------------------|
| MsgHub | Outbound, sync | HTTPS | Send email and SMS | API-03 (§15) | Retry per INT-02; `Failed` after the bounds; never blocks a refund |
| refund-request | Outbound, sync in-process | Port call | Customer contact details | API-06 (§15) | `RefundRequestNotFound` or `ContactDetailsErased` marks the message `Failed` |
| Platform IAM | Outbound, sync | Per ADR-07 | Branch managers of a branch for the still-failing alert | API-08 (§15) | `StaffDirectoryUnavailable` is retried within the INT-02 bounds; an empty list marks the message `Failed` with an operations alert |
| refund-request, payout | Inbound, async in-process | Domain events | Messages to send | `RefundRequestSubmitted`, `RefundRequestApproved`, `RefundRequestRejected`, `RefundRequestCancelled`, `RefundRequestPaid`, `RefundRequestPayoutReturned`, `PayoutAttemptFailed`, `PayoutStillFailing` (§14.10) | Publication log redelivery |

### DB Modeling

#### Entity Relationship

The concepts are the message and its send attempts. **[NEEDS CLARIFICATION: ERD, table list, column types, constraints, and indexes for the message and its send attempts. The BRD describes the messages but does not commit to a relational schema. Owner: solution architect.]**

#### Tables Design

Per the Entity Relationship marker. Fixed so far: the unique key `(tenant_id, event_id, channel)`; no column holds an email address or mobile number.

#### Migration Strategy

- **Tool:** per ADR-10 (Proposed); versioned SQL scripts for schema `customer_notification`.
- **Backward compatibility:** additive; expand-and-contract (AP-10).
- **Data backfill:** separate batched script.
- **Rollback:** roll forward with a corrective script.

#### Retention Policy

- All tables: the refund-request period of the §17.1 Retention Policy marker (REFUNDS/NFR-06), applied by the `notification-retention-purge` job.

#### Archival

- **Cold storage:** not applicable for this release.
- **Format:** not applicable.
- **Schedule:** not applicable.
- **Restore SLA:** not applicable.

#### Data Encryption

- **At rest:** storage encryption of the PostgreSQL offering (§6).
- **In transit:** TLS 1.2+ to PostgreSQL, MsgHub and the platform IAM (API-08).
- **Key management:** the hosting environment's key service.
- **PII columns:** none stored; contact details pass through memory only.

### Multi-Tenancy Specifications

- **Strategy override:** none.
- **Tenant filter:** the tenant of the event, or of the per-tenant run of each `Schedule` job in Input (§11.2); MsgHub credentials per tenant.
- **Cross-tenant queries:** none.

### API Standards

- **Style:** not applicable: no inbound API.
- **Versioning:** not applicable.
- **Authentication:** not applicable; the module calls API-06 as `NOTIFICATION_DISPATCHER`.
- **Idempotency:** message id as the MsgHub idempotency key; for the branch-manager alert, the name-based UUID of the message id and the recipient's IAM user id (Select).
- **Pagination:** not applicable.
- **Error envelope:** not applicable.

#### List of APIs (Swagger-friendly)

Not applicable: the module exposes no endpoint.

### Event-Driven Architecture (If Applicable)

#### Event Model

**Published events:** Not applicable - no integration events.

**Consumed events:** Not applicable - no integration events.

**In-process domain events (modules only):**

| Event | Publisher module | Listener modules | Transaction phase (before commit / after commit) | Payload (DTO) | Notes |
|---|---|---|---|---|---|
| `RefundRequestSubmitted` | refund-request | customer-notification | after commit | `RefundRequestSubmittedDto`: fields per §14.10 | Handled here |
| `RefundRequestApproved` | refund-request | payout, customer-notification | after commit | `RefundRequestApprovedDto`: fields per §14.10 | Handled here: partial and full approval messages |
| `RefundRequestRejected` | refund-request | customer-notification, loyalty-points | after commit | `RefundRequestRejectedDto`: fields per §14.10 | Handled here |
| `RefundRequestCancelled` | refund-request | customer-notification, loyalty-points | after commit | `RefundRequestCancelledDto`: fields per §14.10 | Handled here: email only |
| `RefundRequestPaid` | refund-request | customer-notification, loyalty-points | after commit | `RefundRequestPaidDto`: fields per §14.10 | Handled here |
| `RefundRequestPayoutReturned` | refund-request | customer-notification, loyalty-points | after commit | `RefundRequestPayoutReturnedDto`: fields per §14.10 | Handled here: back-to-Approved message |
| `PayoutAttemptFailed` | payout | customer-notification | after commit | `PayoutAttemptFailedDto`: fields per §14.10 | Handled here |
| `PayoutStillFailing` | payout | customer-notification | after commit | `PayoutStillFailingDto`: fields per §14.10 | Handled here: branch manager |

#### Messaging Infra

Not applicable - no integration events.

### Constraints

- No user role calls `customer-notification`.
- The module holds the `NOTIFICATION_DISPATCHER` role and its token `refund.contact.read` for API-06 (§16.3).
- A message failure never changes a refund request ([REFUNDS 03 § Customer messages](../brd-refunds-portal/03-definitions-and-domain-concepts.md#customer-messages)).

### Error Handling

- **Synchronous APIs:** not applicable - no inbound API; errors raised by API-06 and API-08 are handled as in Integrations.
- **Validation errors:** a contact detail MsgHub rejects as invalid marks that channel's message `Failed` with no retry.
- **Domain errors:** not applicable - the module makes no business decision.
- **Auth errors:** a MsgHub authentication failure opens the circuit breaker and alerts operations.
- **Server errors:** MsgHub 5xx and timeouts are retried per INT-02.
- **Async consumers:** listeners are idempotent on `(event_id, channel)`.
- **Poison messages:** per §17.1 (publication log redelivery, 30-minute alert).

### Observability & Monitoring

#### Logging

- JSON per §11.4, with `message_id`, `event_id`, and `channel`.
- No email address, mobile number, or message text.
- Retention per the logging backend (§6).

#### Metrics

| Metric | Type | Labels | Purpose |
|--------|------|--------|---------|
| `messages_total` | counter | `type`, `channel`, `outcome` | Sent, failed |
| `message_queue_age_seconds` | gauge | `channel` | Oldest queued message |
| `msghub_call_seconds` | histogram | `outcome` | Provider latency |

#### Tracing

- Spans per send; the trace continues from the event.
- 100% sampling (§11.4).

### Developer Notes

- **Recommended patterns:** a `MessageGateway` port with the MsgHub adapter behind it; templates selected by message type and channel.
- **Avoid:** storing contact details; calling MsgHub inside a database transaction; feeding a send result back into a refund.
- **Testing:** one test per row of REFUNDS 03 Customer messages; integration tests for duplicate events and MsgHub outages.

### Service-Level Diagrams

#### Implementation Flow Chart

Not applicable: the logic fits the Select and Send rules above.

#### Sequence Diagram (Service-Internal)

Not applicable: the send path is part of §8.5.1.

### Compliance

- **GDPR:** per the §17.1 Compliance marker; no personal data is stored here.
- **PCI-DSS:** not applicable.
- **ISO 27001 / SOC 2:** not applicable for this release.
- **Local regulations:** rules for sending SMS follow the law named in the §17.1 Compliance marker.

### Deployment Strategy

- **Service-specific override:** none (one deployable, §11.3).
- **Replicas:** per §11.3; the job runs on any replica.
- **Strategy:** per §11.3.
- **Health checks:** per §11.3; MsgHub availability is not part of readiness.
- **Rollback:** previous image; queued messages resume.

### Future Enhancements

- Push notifications for the customer mobile app on the wishlist ([REFUNDS 12 § Wishlist](../brd-refunds-portal/12-appendix-and-wishlist.md#wishlist)).

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 13b-service-payout.md | NEXT: 13d-service-loyalty-points.md -->

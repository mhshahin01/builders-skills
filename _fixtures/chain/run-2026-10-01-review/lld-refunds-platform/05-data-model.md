<!--
CHUNK: 05
TITLE: Data Model
PROJECT: Refunds Platform
VERSION: 1.1
DEPENDS_ON: 04
PART OF: LLD - Refunds Platform
-->

# 8. Data Model

> **Per-service ownership:** each service owns its own private PostgreSQL schema (CLAUDE.md default). This chunk covers all schemas in the LLD scope.

The SDD owns the concepts, every column a rule relies on, the keys, and the indexes behind each query and worker ([SDD §17.1](../sdd-refunds-platform/13a-service-refund.md#tables-design), [§17.2](../sdd-refunds-platform/13b-service-payout.md#tables-design), [§17.3](../sdd-refunds-platform/13c-service-notification.md#tables-design), [§17.4](../sdd-refunds-platform/13d-service-loyalty.md#tables-design) Tables Design); it leaves column lengths, check wording, plan-driven indexes, and the `Idempotency-Key` store to this chunk, which never changes a key, a uniqueness rule, or a tenant rule. Every row below marks its source: `SDD` (pinned there) or `LLD` (added here).

> Confirm: every column, type, length, and index marked `LLD` below is this LLD's completion of the SDD Tables Design; verify with the team before the first migration.

## 8.1 Entity Relationship (system-wide)

**Core database, schema `refund`** (SDD Figure 15):

```mermaid
erDiagram
  REFUND_REQUEST ||--|{ REFUND_ITEM : contains
  REFUND_REQUEST ||--|{ REFUND_STATUS_HISTORY : records
  REFUND_REQUEST {
    uuid id PK
    uuid tenant_id
    varchar reference_number UK
    uuid customer_id
    varchar branch_id
    varchar receipt_number
    varchar status
    numeric approved_amount
    timestamptz closed_at
  }
  REFUND_ITEM {
    uuid id PK
    uuid refund_request_id FK
    varchar pos_item_line_id
    boolean active
  }
  REFUND_STATUS_HISTORY {
    uuid id PK
    uuid refund_request_id FK
    varchar from_status
    varchar to_status
  }
  REFUND_REFERENCE_COUNTER {
    uuid tenant_id PK
    bigint last_value
  }
```

**Summary:** a refund request holds its selected POS lines and one history row per transition, and `closed_at` starts its retention clocks; the per-tenant counter issues reference numbers. The outbox, inbox, idempotency, and role-permission tables stand alone (§ 8.2).

**Core database, schemas `loyalty` and `core_events`** (SDD Figure 24):

```mermaid
erDiagram
  MEMBER_BALANCE ||--o{ POINTS_MOVEMENT : sums
  MEMBER_PURCHASE ||--o{ POINTS_MOVEMENT : "earned or taken back"
  MEMBER_PURCHASE |o--o{ REFUND_TAKEBACK : "refunded by"
  REFUND_TAKEBACK |o--o| POINTS_MOVEMENT : creates
  MEMBER_PURCHASE {
    uuid id PK
    varchar purchase_reference UK
    varchar receipt_number UK
    numeric amount
    int points_earned
  }
  POINTS_MOVEMENT {
    uuid id PK
    varchar member_id FK
    varchar movement_type
    int points
  }
  REFUND_TAKEBACK {
    uuid refund_request_id PK
    varchar receipt_number
    numeric refunded_amount
    varchar status
  }
  EVENT_PUBLICATION {
    uuid id PK
    varchar listener_id
    timestamptz completed_at
  }
```

**Summary:** each reported member purchase gives at most one earned movement, and each handled refund of it may create one take-back movement; the balance is the sum of a member's movements. `core_events.event_publication` belongs to no module and records each `RefundPaid` until its listener completes.

**Payout database (schema `payout`) and notification database (schema `notification`)** (SDD Figures 19 and 22):

```mermaid
erDiagram
  PAYOUT ||--o{ PAYOUT_ATTEMPT : has
  MESSAGE_TEMPLATE ||--o{ NOTIFICATION_MESSAGE : renders
  PAYOUT {
    uuid id PK
    uuid refund_request_id UK
    varchar status
    timestamptz failure_reported_at
    timestamptz succeeded_at
  }
  PAYOUT_ATTEMPT {
    uuid id PK
    uuid payout_id FK
    int attempt_number
    varchar outcome
  }
  MESSAGE_TEMPLATE {
    uuid id PK
    varchar event_type
    varchar channel
    varchar locale
  }
  NOTIFICATION_MESSAGE {
    uuid id PK
    uuid source_event_id
    varchar channel
    timestamptz claimed_until
    timestamptz final_at
  }
```

**Summary:** one payout per refund with one row per provider call; one message per source event and channel, rendered from a versioned template. The two databases are separate and share nothing.

## 8.2 Tables (per service)

**Audit columns (SDD §11.1):** every table below also carries `created_at`, `created_by`, `updated_at`, `updated_by` (UTC; actor is the token subject or the deployable name); aggregates carry `version bigint NOT NULL DEFAULT 0`. They are not repeated per table.

### Service: `refund-service` - schema `refund`

| Table | Column | Type | Constraints | Notes |
|-------|--------|------|-------------|-------|
| `refund_request` | `id` | `uuid` | PK | SDD; UUIDv7 |
| `refund_request` | `tenant_id` | `uuid` | NOT NULL | SDD |
| `refund_request` | `reference_number` | `varchar(13)` | UNIQUE (`tenant_id`, `reference_number`) | SDD; `RF-` and 10 digits |
| `refund_request` | `customer_id` | `uuid` | NOT NULL | SDD; token subject |
| `refund_request` | `customer_email`, `customer_mobile` | `text` | NULL allowed | SDD (pii); at least one is present at submission, checked in `submit`, not by a constraint, because the retention job and the erasure job clear both |
| `refund_request` | `branch_id` | `varchar(32)` | NOT NULL | SDD; length LLD |
| `refund_request` | `receipt_number` | `varchar(64)` | NOT NULL | SDD; length LLD |
| `refund_request` | `request_reason` | `text` | NOT NULL | SDD (REFUNDS/UC-01 step 3; shown at REFUNDS/UC-04 step 2); 1 to 500 characters through `SubmitRefundRequest` |
| `refund_request` | `status` | `varchar(16)` | NOT NULL, CHECK in the five states | SDD |
| `refund_request` | `requested_amount`, `approved_amount` | `numeric(19,4)` | `approved_amount` > 0 and <= `requested_amount` | SDD |
| `refund_request` | `currency` | `char(3)` | NOT NULL | SDD |
| `refund_request` | `decided_at` | `timestamptz` | NULL until decided | SDD |
| `refund_request` | `decision_reason`, `decided_by` | `text`, `varchar(64)` | NULL until decided | LLD (the reason also lands in history) |
| `refund_request` | `paid_amount`, `paid_at`, `payout_id` | `numeric(19,4)`, `timestamptz`, `uuid` | NULL until PAID | SDD |
| `refund_request` | `payout_failing_since`, `payout_outcome_overdue_since` | `timestamptz` | NULL allowed | SDD |
| `refund_request` | `closed_at` | `timestamptz` | NULL until `CANCELLED`, `REJECTED`, or `PAID` | SDD; the retention clocks |
| `refund_item` | `id`, `tenant_id`, `refund_request_id` | `uuid` | PK `id`; FK `refund_request_id` | SDD |
| `refund_item` | `receipt_number`, `pos_item_line_id` | `varchar(64)` | Partial UNIQUE (`tenant_id`, `receipt_number`, `pos_item_line_id`) WHERE `active` | SDD (REFUNDS/UC-01 BR-2: one refund per item) |
| `refund_item` | `description`, `amount` | `varchar(255)`, `numeric(19,4)` | NOT NULL; `amount` > 0 | SDD (from API-01); length LLD |
| `refund_item` | `active` | `boolean` | NOT NULL | SDD |
| `refund_status_history` | `id`, `tenant_id`, `refund_request_id`, `from_status` | `uuid`, `uuid`, `uuid`, `varchar(16)` | PK; NOT NULL; FK; `from_status` NULL on the first row | SDD |
| `refund_status_history` | `to_status`, `reason`, `changed_at`, `changed_by` | `varchar(16)`, `text`, `timestamptz`, `varchar(64)` | NOT NULL except `reason` | SDD |
| `refund_reference_counter` | `tenant_id`, `last_value` | `uuid`, `bigint` | PK `tenant_id`; NOT NULL; `last_value` >= 0 | SDD |
| `idempotency_record` | `tenant_id`, `caller_subject`, `idempotency_key` | `uuid`, `varchar(64)`, `varchar(64)` | PK (all three) | LLD (09 § 12.2; SDD §17.1 leaves the store to the LLD) |
| `idempotency_record` | `request_hash`, `response_status`, `response_body`, `expires_at` | `char(64)`, `int`, `jsonb`, `timestamptz` | NOT NULL | LLD |
| `outbox_event` | `event_id`, `tenant_id`, `topic`, `payload`, `published_at` | `uuid`, `uuid`, `varchar(128)`, `jsonb`, `timestamptz` | PK `event_id`; `published_at` NULL until the broker acknowledges | SDD |
| `outbox_event` | `aggregate_id`, `event_type`, `message_key`, `occurred_at`, `traceparent` | `uuid`, `varchar(64)`, `uuid`, `timestamptz`, `varchar(64)` | NOT NULL except `traceparent` | SDD (`message_key` is the `refundRequestId`); lengths LLD |
| `inbox_message` | `tenant_id`, `consumer`, `event_id`, `processed_at` | `uuid`, `varchar(64)`, `uuid`, `timestamptz` | PK (`tenant_id`, `consumer`, `event_id`) | SDD |
| `role_permission` | `role`, `permission` | `varchar(32)`, `varchar(64)` | PK (`role`, `permission`) | SDD §16.12.1 seed (seven tokens); no `tenant_id` (platform catalogue) |

### Service: `loyalty-service` - schema `loyalty`

| Table | Column | Type | Constraints | Notes |
|-------|--------|------|-------------|-------|
| `member_purchase` | `id` | `uuid` | PK | SDD; UUIDv7 |
| `member_purchase` | `tenant_id`, `purchase_reference` | `uuid`, `varchar(64)` | UNIQUE (`tenant_id`, `purchase_reference`) | SDD; a re-import is a no-op; length LLD |
| `member_purchase` | `receipt_number` | `varchar(64)` | NOT NULL; UNIQUE (`tenant_id`, `receipt_number`) | SDD; the take-back match key |
| `member_purchase` | `member_id`, `amount`, `currency`, `purchased_at` | `varchar(64)`, `numeric(19,4)`, `char(3)`, `timestamptz` | NOT NULL; `amount` > 0 | SDD (from API-04) |
| `member_purchase` | `points_earned`, `reported_at` | `int`, `timestamptz` | NOT NULL; `points_earned` >= 0 | SDD; `reported_at` starts the LOYALTY/NFR-03 hour |
| `points_movement` | `id`, `tenant_id`, `member_id` | `uuid`, `uuid`, `varchar(64)` | PK `id`; NOT NULL | SDD |
| `points_movement` | `movement_type`, `points` | `varchar(16)`, `int` | CHECK (`EARNED` and `points` > 0) or (`TAKEN_BACK` and `points` < 0) | SDD (no 0-point movement) |
| `points_movement` | `purchase_reference` | `varchar(64)` | NOT NULL; partial UNIQUE (`tenant_id`, `purchase_reference`) WHERE `EARNED` | SDD; a take-back carries the purchase it reduces |
| `points_movement` | `refund_reference` | `varchar(13)` | NULL for `EARNED`; CHECK NOT NULL for `TAKEN_BACK` | SDD (CHECK LLD) |
| `points_movement` | `occurred_at` | `timestamptz` | NOT NULL | SDD: `purchased_at` for `EARNED`, `paidAt` for `TAKEN_BACK` |
| `member_balance` | `tenant_id`, `member_id`, `points`, `last_movement_at` | `uuid`, `varchar(64)`, `int`, `timestamptz` | PK (`tenant_id`, `member_id`); `points` >= 0 | SDD (CHECK LLD: take-backs never exceed earnings, SDD §17.4 Balance) |
| `refund_takeback` | `tenant_id`, `refund_request_id`, `movement_id`, `handled_at` | `uuid`, `uuid`, `uuid`, `timestamptz` | PK (`tenant_id`, `refund_request_id`); `movement_id` NULL when pending or 0 points | SDD |
| `refund_takeback` | `refunded_amount`, `currency`, `status`, `paid_at` | `numeric(19,4)`, `char(3)`, `varchar(16)`, `timestamptz` | NOT NULL; CHECK status in `APPLIED`, `PENDING_EARN` | SDD |
| `refund_takeback` | `receipt_number`, `purchase_reference` | `varchar(64)`, `varchar(64)` | `receipt_number` NOT NULL; `purchase_reference` NULL until applied | SDD |
| `refund_takeback` | `refund_reference` | `varchar(13)` | NOT NULL | LLD (the `TAKEN_BACK` movement the import writes for a pending take-back needs it) |
| `purchase_import_rejection` | `id`, `tenant_id`, `received_at` | `uuid`, `uuid`, `timestamptz` | PK `id`; NOT NULL | SDD |
| `purchase_import_rejection` | `reason` | `varchar(32)` | NOT NULL; CHECK in `NON_POSITIVE_AMOUNT`, `CURRENCY_MISMATCH`, `MISSING_RECEIPT_NUMBER`, `DUPLICATE_RECEIPT`, `INVALID` | SDD |
| `purchase_import_rejection` | `purchase_reference`, `receipt_number`, `detail` | `varchar(64)`, `varchar(64)`, `text` | NULL allowed | SDD (as received) |
| `purchase_import_cursor` | `tenant_id`, `position`, `last_success_at` | `uuid`, `varchar(256)`, `timestamptz` | PK `tenant_id` | SDD |
| `role_permission` | `role`, `permission` | `varchar(32)`, `varchar(64)` | PK | SDD §16.12.1 seed (one token) |

Audit columns apply to `member_purchase`, `points_movement`, `member_balance`, and `refund_takeback`, with `version` on `member_balance` (SDD).

### Core infrastructure - schema `core_events`

| Table | Column | Type | Constraints | Notes |
|-------|--------|------|-------------|-------|
| `event_publication` | `id`, `tenant_id` | `uuid` | PK `id`; NOT NULL | SDD §11.1, §11.2 |
| `event_publication` | `event_type`, `listener_id`, `payload` | `varchar(128)`, `varchar(128)`, `jsonb` | NOT NULL; one row per event and listener | LLD |
| `event_publication` | `published_at`, `completed_at`, `attempt_count`, `last_attempt_at`, `last_error` | `timestamptz`, `timestamptz`, `int`, `timestamptz`, `varchar(512)` | `completed_at` NULL until the listener's transaction commits | LLD (`last_error` never holds payload data) |

### Service: `payout-service` - database `payout`, schema `payout`

| Table | Column | Type | Constraints | Notes |
|-------|--------|------|-------------|-------|
| `payout` | `id` | `uuid` | PK | SDD; also the CardPay idempotency key |
| `payout` | `tenant_id`, `refund_request_id` | `uuid` | UNIQUE (`tenant_id`, `refund_request_id`) | SDD |
| `payout` | `reference_number`, `receipt_number` | `varchar(13)`, `varchar(64)` | NOT NULL | SDD; the receipt number identifies the original payment |
| `payout` | `amount`, `currency` | `numeric(19,4)`, `char(3)` | `amount` > 0 | SDD |
| `payout` | `status` | `varchar(16)` | CHECK in the five states | SDD |
| `payout` | `provider_reference` | `varchar(128)` | NULL until `SUCCEEDED` | SDD |
| `payout` | `attempt_count`, `last_failure_code` | `int`, `varchar(64)` | NOT NULL default 0; NULL allowed | SDD |
| `payout` | `first_attempt_at`, `next_attempt_at`, `lease_until` | `timestamptz` | NULL as SDD states | SDD |
| `payout` | `failure_reported_at`, `succeeded_at` | `timestamptz` | NULL until the first `FAILED` / until `SUCCEEDED` | SDD (`PAYOUT_FAILED` once; retention clock) |
| `payout` | `held` | `boolean` | NOT NULL, default false | LLD (status unreadable, payout-service § 7.3) |
| `payout` | `source_event_id` | `uuid` | NOT NULL | LLD: the `REFUND_APPROVED` `event_id` |
| `payout_attempt` | `id`, `tenant_id`, `payout_id`, `attempt_number` | `uuid`, `uuid`, `uuid`, `int` | PK `id`; FK `payout_id`; UNIQUE (`tenant_id`, `payout_id`, `attempt_number`) | SDD |
| `payout_attempt` | `attempted_at`, `outcome`, `provider_error_code`, `error_code` | `timestamptz`, `varchar(16)`, `varchar(64)`, `varchar(64)` | NOT NULL `outcome`, CHECK in `ACCEPTED`, `REFUSED`, `TIMEOUT`, `ERROR` | SDD (an open-circuit call is `ERROR` with `error_code` `UNAVAILABLE`) |
| `payout_attempt` | `duration_ms` | `int` | NULL allowed | LLD |
| `outbox_event`, `inbox_message` | as in `refund` | - | - | SDD |

### Service: `notification-service` - database `notification`, schema `notification`

| Table | Column | Type | Constraints | Notes |
|-------|--------|------|-------------|-------|
| `notification_message` | `id` | `uuid` | PK | SDD; also the MsgHub idempotency key |
| `notification_message` | `tenant_id`, `source_event_id`, `channel` | `uuid`, `uuid`, `varchar(8)` | UNIQUE (`tenant_id`, `source_event_id`, `channel`) | SDD; the consumer's inbox |
| `notification_message` | `source_event_type`, `template_id` | `varchar(32)`, `uuid` | `source_event_type` NOT NULL; `template_id` NULL until rendered | SDD |
| `notification_message` | `status`, `attempt_count`, `next_attempt_at` | `varchar(8)`, `int`, `timestamptz` | CHECK status in the four states | SDD |
| `notification_message` | `claimed_until` | `timestamptz` | NULL unless a worker holds the message | SDD |
| `notification_message` | `recipient_masked` | `varchar(64)` | NOT NULL | SDD |
| `notification_message` | `delivery_payload`, `payload_key_id` | `bytea`, `varchar(32)` | NULL once final | SDD |
| `notification_message` | `provider_message_id`, `last_error_code` | `varchar(128)`, `varchar(64)` | NULL allowed | SDD |
| `notification_message` | `final_at` | `timestamptz` | NULL until `SENT`, `FAILED`, or `SKIPPED` | SDD; retention clock |
| `message_template` | `id`, `tenant_id`, `event_type`, `channel`, `locale`, `template_version` | `uuid`, `uuid`, `varchar(32)`, `varchar(8)`, `varchar(16)`, `int` | UNIQUE (`tenant_id`, `event_type`, `channel`, `locale`, `template_version`) | SDD |
| `message_template` | `subject`, `body` | `text` | `subject` NULL for SMS | SDD |

## 8.3 Indexes

Every index leads with `tenant_id` ([SDD §11.1](../sdd-refunds-platform/07-cross-cutting-concerns.md#111-db-modeling-default); CLAUDE.md).

| Index | Table | Columns | Type | Rationale |
|-------|-------|---------|------|-----------|
| `ux_refund_request_reference` | `refund.refund_request` | `(tenant_id, reference_number)` | unique btree | SDD unique business key |
| `ix_refund_request_customer` | `refund.refund_request` | `(tenant_id, customer_id, created_at)` | btree | SDD: REFUNDS/UC-02 list, read backwards for newest first |
| `ix_refund_request_branch_queue` | `refund.refund_request` | `(tenant_id, branch_id, status, created_at)` | btree | SDD: REFUNDS/UC-04 queue, oldest first |
| `ix_refund_request_payout_failing` | `refund.refund_request` | `(tenant_id, branch_id, created_at) WHERE status = 'APPROVED' AND (payout_failing_since IS NOT NULL OR payout_outcome_overdue_since IS NOT NULL)` | partial btree | SDD: payout-failing list (REFUNDS/UC-04 E1) and its count |
| `ix_refund_request_watchdog` | `refund.refund_request` | `(tenant_id, decided_at) WHERE status = 'APPROVED' AND payout_failing_since IS NULL AND payout_outcome_overdue_since IS NULL` | partial btree | SDD: payout watchdog scan |
| `ix_refund_request_report_decided` | `refund.refund_request` | `(tenant_id, branch_id, decided_at)` | btree | SDD: daily branch report |
| `ix_refund_request_report_paid` | `refund.refund_request` | `(tenant_id, branch_id, paid_at)` | btree | SDD: daily branch report |
| `ix_refund_request_closed` | `refund.refund_request` | `(tenant_id, closed_at)` | btree | SDD: retention job |
| `ux_refund_item_active_line` | `refund.refund_item` | `(tenant_id, receipt_number, pos_item_line_id) WHERE active` | partial unique | SDD (REFUNDS/UC-01 BR-2: one refund per item, under concurrency); also serves `existsActiveItemLines` |
| `ix_refund_item_request` | `refund.refund_item` | `(tenant_id, refund_request_id)` | btree | SDD: load items with the aggregate |
| `ix_refund_status_history_request` | `refund.refund_status_history` | `(tenant_id, refund_request_id, changed_at)` | btree | SDD: detail history |
| `ix_refund_status_history_day` | `refund.refund_status_history` | `(tenant_id, changed_at)` | btree | LLD: status changes of a day for the branch report (08 § 11.3) |
| `ix_idempotency_expiry` | `refund.idempotency_record` | `(tenant_id, expires_at)` | btree | LLD: cleanup job |
| `ix_outbox_unpublished` | `refund.outbox_event`, `payout.outbox_event` | `(tenant_id, occurred_at) WHERE published_at IS NULL` | partial btree | SDD: relay poll; the unpublished set stays tiny, so the cross-tenant oldest-first sort is cheap |
| `ix_outbox_purge` | both `outbox_event` | `(tenant_id, published_at)` | btree | SDD: 7-day purge |
| `ix_inbox_purge` | both `inbox_message` | `(tenant_id, processed_at)` | btree | SDD: 7-day purge |
| `ix_event_publication_incomplete` | `core_events.event_publication` | `(tenant_id, published_at) WHERE completed_at IS NULL` | partial btree | LLD: replay job and age alert |
| `ix_event_publication_purge` | `core_events.event_publication` | `(tenant_id, completed_at)` | btree | LLD: 7-day purge |
| `ux_member_purchase_reference` | `loyalty.member_purchase` | `(tenant_id, purchase_reference)` | unique btree | SDD: re-import no-op |
| `ux_member_purchase_receipt` | `loyalty.member_purchase` | `(tenant_id, receipt_number)` | unique btree | SDD: take-back match |
| `ix_member_purchase_member` | `loyalty.member_purchase` | `(tenant_id, member_id)` | btree | SDD: member erasure job |
| `ux_points_movement_earned_purchase` | `loyalty.points_movement` | `(tenant_id, purchase_reference) WHERE movement_type = 'EARNED'` | partial unique | SDD: one earn per purchase |
| `ix_points_movement_member` | `loyalty.points_movement` | `(tenant_id, member_id, occurred_at, id)` | btree | SDD: LOYALTY/UC-02 history newest first by movement date (read backwards); erasure |
| `ix_points_movement_purchase` | `loyalty.points_movement` | `(tenant_id, purchase_reference)` | btree | SDD: points already taken back for a purchase |
| `ix_refund_takeback_receipt` | `loyalty.refund_takeback` | `(tenant_id, receipt_number, paid_at)` | btree | SDD: the purchase's refunded total; pending take-backs in `paid_at` order |
| `ix_refund_takeback_movement` | `loyalty.refund_takeback` | `(tenant_id, movement_id)` | btree | SDD: detail of a `TAKEN_BACK` movement |
| `ix_purchase_import_rejection_received` | `loyalty.purchase_import_rejection` | `(tenant_id, received_at)` | btree | SDD: review and the 90-day purge |
| `ux_payout_refund` | `payout.payout` | `(tenant_id, refund_request_id)` | unique btree | SDD (REFUNDS/NFR-01) |
| `ix_payout_due` | `payout.payout` | `(tenant_id, next_attempt_at) WHERE status IN ('PENDING', 'RETRY_SCHEDULED', 'FAILED')` | partial btree | SDD: `payout-retry` claim, post-window attempts included |
| `ix_payout_lease` | `payout.payout` | `(tenant_id, lease_until) WHERE status = 'SENDING'` | partial btree | SDD: expired-lease reclaim |
| `ix_payout_succeeded` | `payout.payout` | `(tenant_id, succeeded_at)` | btree | SDD: retention job |
| `ix_payout_attempt_payout` | `payout.payout_attempt` | `(tenant_id, payout_id, attempted_at)` | btree | SDD: attempt history, duplicate proxy (SDD §18.2) |
| `ux_payout_attempt_number` | `payout.payout_attempt` | `(tenant_id, payout_id, attempt_number)` | unique btree | SDD |
| `ux_notification_message_event_channel` | `notification.notification_message` | `(tenant_id, source_event_id, channel)` | unique btree | SDD: one message per event and channel (the inbox) |
| `ix_notification_message_due` | `notification.notification_message` | `(tenant_id, next_attempt_at) WHERE status = 'PENDING'` | partial btree | SDD: `message-retry` claim |
| `ix_notification_message_final` | `notification.notification_message` | `(tenant_id, final_at)` | btree | SDD: retention job |
| `ux_message_template` | `notification.message_template` | `(tenant_id, event_type, channel, locale, template_version)` | unique btree | SDD |

## 8.4 Multi-Tenancy Strategy

> **Default per CLAUDE.md:** schema-per-tenant for high-volume services; shared-schema with `tenant_id` for low-volume.

| Service | Strategy | Rationale |
|---------|----------|-----------|
| `refund-service` | Shared schema with `tenant_id` | ADR-03: about 1,200 requests a month is low volume |
| `loyalty-service` | Shared schema with `tenant_id` | ADR-03 |
| `payout-service` | Shared schema with `tenant_id` | ADR-03 |
| `notification-service` | Shared schema with `tenant_id` | ADR-03 |

**Tenant filter enforcement:** two lines, as [SDD §11.2](../sdd-refunds-platform/07-cross-cutting-concerns.md#112-multi-tenancy-default) requires. (1) Hibernate 6 `@TenantId` on every tenant entity, fed by a `CurrentTenantIdentifierResolver` over `TenantContext`, so every JPA query gets `tenant_id = ?`. (2) PostgreSQL row-level security on every tenant table:

```sql
ALTER TABLE refund.refund_request ENABLE ROW LEVEL SECURITY;
ALTER TABLE refund.refund_request FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON refund.refund_request
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);
```

`TenantContext.apply()` runs `SELECT set_config('app.tenant_id', :tenantId, true)` as the first statement of every transaction (a `TransactionSynchronization` registered by an aspect on `@Transactional`). Database roles per deployable: `<deployable>_migrator` (owner, runs Flyway), `<deployable>_app` (tenant policy only), and `<deployable>_worker` (tenant policy plus a cross-tenant `SELECT` and `UPDATE` policy on its own work tables: `outbox_event`, `event_publication`, `refund_request` for the watchdog scan, `payout`, `notification_message`), per the SDD §11.2 worker model; each unit of work sets `app.tenant_id` from the claimed row before touching any other table. The retention and purge jobs need no worker role: they walk the tenants of `TenantSettingsRegistry` and work under the tenant policy.

> Confirm: the role names, the aspect that sets `app.tenant_id`, and the list of work tables the worker role may scan across tenants are this LLD's implementation of SDD §11.2; the `role_permission` tables carry no `tenant_id` because they hold the platform-wide SDD §16.11 catalogue, an explicit exception to "every table has `tenant_id`" (ADR-03).

**Cross-tenant queries:** forbidden at the application layer (CLAUDE.md). Enforced via the two lines above; only the worker role's work-table scans cross tenants, and they read ids and due times only.

## 8.5 Migration Plan (Flyway)

One Flyway instance per schema, each with its own history table, run before the new version takes traffic ([SDD §11.3](../sdd-refunds-platform/07-cross-cutting-concerns.md#113-deployment-default)); the core app defines three `Flyway` beans (`refund`, `loyalty`, `core_events`).

| Version | File | Purpose |
|---------|------|---------|
| `V1__create_refund_tables.sql` | `core-refund/src/main/resources/db/migration/refund` | `refund_request`, `refund_item`, `refund_status_history`, `refund_reference_counter` |
| `V2__create_refund_messaging.sql` | same | `outbox_event`, `inbox_message`, `idempotency_record` |
| `V3__refund_rls_and_roles.sql` | same | RLS policies, grants to `_app` and `_worker` |
| `V4__seed_refund_role_permission.sql` | same | Seven SDD §16.11 tokens for `CUSTOMER` and `BRANCH_MANAGER` |
| `V1__create_loyalty_tables.sql` | `core-loyalty/src/main/resources/db/migration/loyalty` | All `loyalty` tables, `member_purchase` included |
| `V2__loyalty_rls_and_seed.sql` | same | RLS, grants, `loyalty.points.read-own` for `MEMBER` |
| `V1__create_event_publication.sql` | `core-eventing/src/main/resources/db/migration/core_events` | `event_publication`, RLS |
| `V1__create_payout_tables.sql`, `V2__payout_rls.sql` | `payout-service/src/main/resources/db/migration` | `payout`, `payout_attempt`, `outbox_event`, `inbox_message`, RLS |
| `V1__create_notification_tables.sql`, `V2__notification_rls.sql`, `V3__seed_templates.sql` | `notification-service/src/main/resources/db/migration` | Messages, templates, RLS, the first template set |

> **Convention per CLAUDE.md:** versioned SQL only; backward-compatible changes only; expand-contract for breaking changes.

## 8.6 Retention & Archival

The rules are the SDD Retention Policies of §17.1 to §17.4, with the tenant settings `refundRecordRetention`, `contactDetailsRetention`, and `messageLogRetention` of [SDD §11.2](../sdd-refunds-platform/07-cross-cutting-concerns.md#112-multi-tenancy-default); this table names the job that applies each.

| Table | Hot retention | Archival destination | Restore SLA |
|-------|---------------|---------------------|-------------|
| `refund_request`, `refund_item`, `refund_status_history` | Until `refundRecordRetention` after `closed_at` (SDD default 10 years); an open request is kept. Job `refund-retention` | None (SDD §6 object storage Not applicable) | Database backups |
| `refund_request.customer_email`, `customer_mobile` | Set to NULL `contactDetailsRetention` after `closed_at` (SDD default 30 days), or at once by `refund-contact-erasure`. Job `refund-retention` | None | N/A |
| `refund_reference_counter` | While the tenant exists | None | Database backups |
| `outbox_event` (both), `inbox_message` (both) | 7 days after `published_at` / `processed_at`; unpublished rows are never deleted | Cleanup job (delete) | N/A |
| `core_events.event_publication` | 7 days after `completed_at`; incomplete rows are never deleted | Cleanup job (delete) | N/A |
| `idempotency_record` | 24 hours (`expires_at`) | Cleanup job (delete) | N/A |
| `member_purchase`, `points_movement`, `member_balance` | While the member's ledger exists; deleted only by `loyalty-member-erasure` | None | Database backups |
| `refund_takeback` | `APPLIED`: as long as its member purchase; `PENDING_EARN`: until the import applies it | None | Database backups |
| `purchase_import_rejection` | 90 days after `received_at` (SDD). Job `loyalty-rejection-purge` | Delete | N/A |
| `purchase_import_cursor` | While the tenant exists | None | N/A |
| `payout`, `payout_attempt` | Until `refundRecordRetention` after `succeeded_at`; a payout that has not succeeded is kept. Job `payout-retention` | None | Database backups |
| `notification_message` | Until `messageLogRetention` after `final_at` (SDD default 90 days); `delivery_payload` erased when final. Job `notification-retention` | None | N/A |
| `message_template` | While any tenant uses the version (SDD) | None | N/A |

> Confirm: the purge job names (`refund-retention`, `payout-retention`, `notification-retention`, `loyalty-rejection-purge`), their daily schedule (`RETENTION_JOB_CRON`, 10 § 13.1), and the batch size of 500 are this LLD's choices for the SDD retention rules; verify with operations.

## 8.7 Encryption

| Concern | Approach |
|---------|----------|
| At rest | Volume and backup encryption per [SDD §11.6](../sdd-refunds-platform/07-cross-cutting-concerns.md#116-security-default) (mechanism NEEDS CLARIFICATION there); plus application-level AES-GCM for `notification_message.delivery_payload` (SDD §17.3) |
| In transit | TLS 1.2+ between services and DB, and to Kafka (SDD §11.6) |
| Key management | Secrets manager (product NEEDS CLARIFICATION in SDD §6); the `delivery_payload` key is versioned (`payload_key_id`), old versions kept until every row they encrypted is final |
| PII columns | `refund.refund_request.customer_email`, `customer_mobile` (cleared after `contactDetailsRetention`), `customer_id`; `loyalty` `member_id`, `purchase_reference`, `receipt_number` (`member_purchase`, `points_movement`, `refund_takeback`, `purchase_import_rejection`); `notification.notification_message.delivery_payload` (encrypted), `recipient_masked` (masked); `refund.outbox_event.payload` (contact copy, 7 days). The SDD masks these in non-production data (§17.1, §17.4 Data Encryption); lower environments hold synthetic or sandbox data only ([SDD §19](../sdd-refunds-platform/15-environments.md#19-environments)), so no job copies or masks production data |

<!-- MASTER: refunds-platform-lld-master.md | PREV: 04-implementation/refund-service.md | NEXT: 06-api-contracts.md -->

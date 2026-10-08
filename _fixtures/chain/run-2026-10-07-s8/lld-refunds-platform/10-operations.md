<!--
CHUNK: 10
TITLE: Operations
PROJECT: Refunds Platform
VERSION: 1.4
PART OF: LLD - Refunds Platform
MODE: from-sdd
-->

# 13. Operations

## 13.1 Configuration (per service)

Settings are designed names, not existing application properties. Each source value has one home.

| Service | Variable | Default / value | Secret? | Source |
| --- | --- | --- | --- | --- |
| platform | PUBLICATION_RESUBMIT_INTERVAL | 60 s | Nonsecret | SDD §11.1 |
| platform | PUBLICATION_INCOMPLETE_MIN_AGE | 300 s | Nonsecret | SDD §11.1 |
| platform | PUBLICATION_COMPLETED_RETENTION | 7 days | Nonsecret | SDD §11.1 |
| platform | IDEMPOTENCY_TTL | 24 hours | Nonsecret | SDD per-module API Standards |
| platform | TENANT_BUSINESS_ZONE | America/Chicago (test fixture only) | Nonsecret | SDD §6 person-only gap; LOYALTY owner |
| customer-accounts | CODE_TTL | 15 minutes | Nonsecret | SDD 13a; REFUNDS/UC-06 BR-3 |
| customer-accounts | MAX_BAD_CODE_ENTRIES | 5 | Nonsecret | SDD 13a / ADR-07 |
| customer-accounts | CODE_ADDRESS_HOURLY_LIMIT | 5 | Nonsecret | SDD 13a |
| customer-accounts | RESET_ACCOUNT_HOURLY_LIMIT | 3 | Nonsecret | SDD 13a |
| customer-accounts | KEYCLOAK_CREATE_TIMEOUT | 500 ms | Nonsecret | SDD 13a / INT-02 |
| customer-accounts | KEYCLOAK_SIGN_IN_EVENTS | Sign-in events of customer users saved, expiry 7 days (realm export per environment) | Nonsecret | SDD 13a Business Logic (Sign-in) |
| notifications | CODE_SEND_DEADLINE | 2 s shared | Nonsecret | SDD INT-02 |
| notifications | EVENT_MESSAGE_GIVE_UP | 24 hours after first try | Nonsecret | SDD INT-02 |
| refund-requests | RECEIPT_LOOKUP_TIMEOUT | 2 s | Nonsecret | SDD INT-03 |
| refund-requests | RECEIPT_SNAPSHOT_TTL | 30 minutes | Nonsecret | SDD 13b |
| refund-requests | BRANCH_REFRESH_INTERVAL | 5 minutes | Nonsecret | SDD 13b Input / INT-05 |
| refund-requests | WAITING_SUMMARY_HOUR | 09:00 branch local (test fixture only) | Nonsecret | SDD 13b business rule; REFUNDS owner |
| payouts | PAYOUT_DEADLINE | 24 hours after first actual try | Nonsecret | SDD 13c |
| all adapters | PROVIDER_CREDENTIALS | Vault per tenant; never literal value | Secret | SDD §11.6 / §15 |


> Confirm: configuration variable names are proposed; bind typed records and keep their source meanings unchanged.
> TODO: CPU/memory requests and limits, autoscaling thresholds, and connection-pool capacity require measured load; upstream home SDD §11.3 / §18.

## 13.2 Health & Readiness

Use §12.10. Validate replica and standby failover, startup Vault outage, rolling schema compatibility and one-replica scheduler lock in SIT. Source availability includes ingress, gateway, Keycloak and identity brokers.

## 13.3 Metrics (RED: Rate, Errors, Duration)

Implement each source module's Observability & Monitoring metric rows verbatim; do not rename metrics in a second inventory. Sources: [13a](../sdd-refunds-platform/13a-service-customer-accounts.md#metrics), [13b](../sdd-refunds-platform/13b-service-refund-requests.md#metrics), [13c](../sdd-refunds-platform/13c-service-payouts.md#metrics), [13d](../sdd-refunds-platform/13d-service-notifications.md#metrics), [13e](../sdd-refunds-platform/13e-service-loyalty-points.md#metrics). Include platform registry incomplete age, job lag and RED for each HTTP/port path. No member/customer id or message reference label.

## 13.4 Logs

§12.7 is the logging home. Search whole use_case tokens, then follow §19.9 to source workflow/tests. Correlation id joins workers to originating state change; sanitized audit records retain required staff/time data in the owning schema, not INFO logs.

## 13.5 Tracing

§12.8 owns instrumentation. A resumed publication restores its source context; a provider retry has a new attempt span but the same business attempt identity. Reports attach only screen in frontend telemetry.

## 13.6 Dashboards

One platform availability/registry dashboard and one per module with source RED, queue age and outcomes. Drill-down joins use_case, correlation id and source trace index. Loyalty includes purchase-feed lag, waiting refunds, retention overdue and invariant mismatches.

## 13.7 Alerts

| Alert / condition | Response home |
| --- | --- |
| Incomplete publication older than 15 minutes; parked listener after ten failures | SDD §20.1.3; RB-01 / RB-02 |
| Payout deadline approaching or late success | SDD §20.1.7 / §20.1.8; lock and preserve attempt identity |
| POS notice lag over 15 minutes; assignment data older than 10 minutes (two refresh intervals) | SDD §20.1.14 / §20.1.9; resync without changing refund state |
| Message give-up at 24 hours; malformed contact address; branch has no recipient | SDD §11.4 give-up alert / §20.1.11 / §20.1.10 |
| Payout callback signature failure | SDD §20.1.12 |
| Purchase feed misses source schedule; points invariant mismatch | SDD §20.1.13 / SDD 13e `balance-invariant-check` alert |
| Retention overdue by two days | SDD §20.1.16; include inactive tenants |
| Account closure stopped: `sign_in_events_read_age_seconds` above one day | [SDD §20.1.17](../sdd-refunds-platform/16-operations-runbook.md#20117-account-closure-stopped); the job's enable setting (SDD §11.5) turns it off at step 3 |
| Receipt of a branch missing from the branch reference data; API-13 BranchNotFound | None in SDD §20 (TODO-42); add the branch to the reference data (SDD §3 Assumption 4) |
| Inbound feed record not applied (API-07, API-08, API-09) | None in SDD §20 (TODO-42); check the record, the sender resends |
| Waiting refund applied by waiting-refund-check | None in SDD §20 (TODO-42); check the purchase lock (SDD 13e) |
| Pod cannot reach Vault at start | None in SDD §20 (TODO-42); restore Vault access, running pods keep serving (SDD §11.3) |
| Availability budget burn | SDD §18.5 and §11.4 minute definition |

> TODO: The account-closure alert fires at the current [SDD 13a Metrics](../sdd-refunds-platform/13a-service-customer-accounts.md#metrics) value, `sign_in_events_read_age_seconds` above one day; [SDD OI-61](../sdd-refunds-platform/18-open-items-and-clarifications.md#oi-61-a-healthy-run-reaches-the-one-day-alert-of-the-read-age-gauge-and-20117-checks-only-a-stopped-read) Option A (Decided - pending application) moves it to 26 hours, adds a missed daily run to the trigger and silences it while step 3 keeps the job off - verify after sdd-unifier applies OI-61.
> TODO: [SDD §20](../sdd-refunds-platform/16-operations-runbook.md) has no procedure for these §13.7 alerts: the send-job give-up, a balance-invariant-check mismatch, an unknown receipt branch or API-13 BranchNotFound, an inbound feed record not applied, a waiting refund applied by the daily check, a pod that cannot reach Vault, and the availability budget burn (SDD §20.3 paging policy open); best guess per row in §13.7, and for the first two: check the provider and leave a given-up message failed (the customer still sees the status in [REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status), SDD 13d), and hand a mismatch to the LOYALTY owner without editing movements - verify with the §20 operations owner through sdd-unifier before go-live.

## 13.8 Runbook Procedures

The SDD §20 procedures that §13.7 names stay the homes of those alerts; the LLD adds no runbook step to them before code exists. For [SDD §20.1.15](../sdd-refunds-platform/16-operations-runbook.md#20115-data-subject-request) step 2, loyalty-points keeps its reviewed read-only export query keyed by the member (`purchase.member_id`, index `tenant_id`, `member_id`, `status`; `membership_notice.member_number`; the `refund_application` rows of those purchases with the `refund` row each names) and by the customer's reference numbers from step 1 (`refund.refund_reference`, unique `tenant_id`, `refund_reference`) for the paid refunds waiting for their purchase, whether or not the person is a member, so the query follows the step without restating a Retention Policy set rule.

### RB-01: Drain outbox backlog

Read [SDD runbook](../sdd-refunds-platform/16-operations-runbook.md) first. Inspect oldest incomplete publication, listener identity and owning module work key. Fix the adapter/dependency cause; let the one resubmit job re-deliver. Verify inbox/work exists once and delivery completes. Never set complete merely to hide the alert; completion of parked work follows RB-02 disposition.

### RB-02: Replay DLQ

There is no broker DLQ. For PARKED inbox entries retain payload and original source identity, diagnose/repair, record disposition, then re-drive the owning handler using its source tenant and dedup key. Verify one state change/work row. If the source runbook calls for closure, record reason before completing/purging. Never mint a new payout attempt for an unknown outcome.

### RB-03: Rotate database secret

Use [SDD §20](../sdd-refunds-platform/16-operations-runbook.md) and Vault: publish replacement, verify standby/primary access, roll replicas with readiness probes, then revoke old credential after all readers move. No secrets in logs or Helm values. Forward fix is the rollback path.

> Confirm: RB-01 to RB-03 are implementation procedures derived from SDD §20; validate commands and access against the built deployment before use.
> TODO: Operator commands, deployment namespace and runtime dashboard links need the actual environment; verify with the platform operator at SDD §20.

## 13.9 On-Call

Test-fixture assignment: Retail Platform duty engineer owns deployable/page response; REFUNDS owner owns money/status decisions; LOYALTY owner owns ledger/retention decisions; Data Protection Officer owns personal-data decisions. This does not create an application role. Upstream SDD operation ownership is still the source of production responsibility.


<!-- MASTER: refunds-platform-lld-master.md | PREV: 09-cross-cutting.md | NEXT: 11-security.md -->

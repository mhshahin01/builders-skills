<!--
CHUNK: 16
TITLE: Operations Runbook
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: 07, 14
PART OF: SDD - Refunds Platform
-->

# 20. Operations Runbook

<!-- The procedures follow the DR strategy per failure scope, the recovery sequence, the failover authority, and the restore granularity of the Pre-SDD (its chunk 12 § 12.3). Commands name the cloud provider's console or command-line tool generically: the provider is not chosen yet (§6 marker), so exact commands are written once it is. -->

The runbook follows the locked DR strategy: zone loss is handled by local HA within the AZ RTO and RPO, region loss by promoting the pilot-light region within the region RTO and RPO ([PSDD/REL-05.1](../pre-sdd-refunds-platform/03c-register-reliability.md#rel-05), [PSDD/REL-05.2](../pre-sdd-refunds-platform/03c-register-reliability.md#rel-05); figures from [PSDD/REL-03.1](../pre-sdd-refunds-platform/03c-register-reliability.md#rel-03), [PSDD/REL-03.2](../pre-sdd-refunds-platform/03c-register-reliability.md#rel-03), [PSDD/REL-04.1](../pre-sdd-refunds-platform/03c-register-reliability.md#rel-04), [PSDD/REL-04.2](../pre-sdd-refunds-platform/03c-register-reliability.md#rel-04) in [§8.6.4](./05a-infrastructure-and-network.md#864-backup-and-disaster-recovery)). During any outage the business's degraded modes hold: a message that does not reach the customer never changes a request, customers asked to try again when Point-of-Sale Records cannot be reached, a payout result recorded by hand and confirmed by a second staff member, and no balance shown when points cannot be shown ([PSDD/REL-06.1](../pre-sdd-refunds-platform/03c-register-reliability.md#rel-06)).

The Pre-SDD leaves three runbook entries open, which these procedures design around: **[NEEDS CLARIFICATION: Which value does the Pre-SDD set for PSDD/REL-07.1, open in its lock list, which the failover procedures of §20 follow? Owner: E2E Architect (pre-sdd-unifier).]** **[NEEDS CLARIFICATION: Which value does the Pre-SDD set for PSDD/OPS-06.1, open in its lock list, which §20 follows? Owner: E2E Architect (pre-sdd-unifier).]** The restore granularity, [PSDD/DAT-09.1](../pre-sdd-refunds-platform/03d-register-data.md#dat-09), is open with its marker in §8.6.4.

## 20.1 Common Operations

### 20.1.1 Restart a Service

```text
Restart the refunds-platform deployable (prod)
1. Check that no deployment is running in the pipeline for prod; if one is, do not restart by hand.
2. In the managed container service, list the replicas of refunds-platform and note the unhealthy one by its health status.
3. Export the last 200 log lines of that replica from the managed log service, filtered on its replica ID, into the incident record.
4. Stop that replica only; the service starts a replacement while the other replica serves.
5. Wait for the replacement's readiness check to pass (it checks the database connection) within 60 seconds.
6. Check the publication-log and outbox age metrics (§11.4): incomplete rows must start to fall within 5 minutes.
7. If readiness does not pass, escalate to the on-call Software Architect with the exported logs.
```

### 20.1.2 Clear Cache

```text
Not applicable for this release: the platform has no cache (§6 Caching).
```

### 20.1.3 Replay DLQ Messages

```text
Replay stuck in-process events (the platform has no DLQ: incomplete publication-log rows play its role)
1. On the dashboard, find event_publication rows with no completed_at older than 15 minutes, grouped by event_type and listener_id.
2. Read the listener's error in the managed log service by the event ID; fix the cause (a deployment, data, or configuration).
3. Confirm the listener's inbox does not already hold the event ID (an effect applied once is not replayed).
4. Trigger the relay's redelivery for each row with POST /v1/operations/event-publications/{eventPublicationId}/redelivery on the management port (PLATFORM_OPERATOR, token platform.event-publication.redeliver; each call is logged).
5. Check that completed_at is set on each row and the module's metric (outbox age, take-backs pending) returns to normal.
6. Record the event IDs and the cause in the incident record.
```

### 20.1.4 Rotate Secrets

```text
Rotate provider credentials, database passwords (every 90 days) and encryption keys (yearly, PSDD/SEC-04.1)
1. Create the new provider credential or database password; store it in the secrets manager as a new version.
2. For the database: create the new password on the module's database role while the old one still works.
3. Roll the refunds-platform replicas one at a time; each reads the new version at start-up.
4. Check that each replica is ready and that provider calls succeed (metrics of §17.2 and §17.3).
5. Revoke the old credential or password.
6. For an encryption key: rotate the customer-managed key in the key management service (a new key version); data is re-encrypted by the service, and the yearly rotation date is recorded.
```

### 20.1.5 Database Failover

```text
A. Zone loss (local HA, RTO 300 s, RPO 5 s: PSDD/REL-03.2, PSDD/REL-04.2)
1. Confirm the alert: the managed database reports the primary unavailable in its zone.
2. The managed database promotes the standby in the other zone; confirm the promotion in the console.
3. Confirm refunds-platform reconnects (readiness passes) and the replicas in the lost zone are replaced in the surviving zone.
4. Confirm the publication-log and outbox relays resume; payouts resent after the failover carry their original key.
5. Record the timeline against the AZ RTO.

B. Region loss (pilot light, RTO 14,400 s, RPO 900 s: PSDD/REL-03.1, PSDD/REL-04.1)
1. The failover authority declares the region disaster (PSDD/REL-07.1 is open: until it is set, the on-call Software Architect with the Refunds and Loyalty Product Owner).
2. Promote the cross-region replica in the recovery region to primary.
2a. In the promoted database, set the payout-sending switch off (§11.5) before any replica starts.
3. Scale the dr deployables refunds-platform and identity-provider from 0 to the prod replica count.
3a. Confirm payout-sending is off: payout_outbox_oldest_seconds grows and no API-04 call is logged.
3b. Reconcile the data-loss window: list the payouts CardPay Ltd accepted since the recovered database's last commit minus the region RPO (PSDD/REL-04.1; the report of the §17.2 monthly-check marker) and match each to a payout by its idempotency key; record every accepted payout with no match as a RECOVERED_UNMATCHED finding, which payout staff link to its refund request before any new payout for that request is sent.
3c. Turn payout-sending on.
4. Repoint the platform's DNS record to the recovery region's load balancer.
5. Confirm readiness, then the relays: outbox and publication-log rows not completed are processed; payouts keep their keys.
6. Announce the service restored; record the data loss window against the region RPO.
7. Fail back only in a planned window, by the same steps in reverse after the primary region is rebuilt.
```

### 20.1.6 Tenant-Specific Incident Response

```text
Not applicable for this release: the tenancy model is open (§11.2). Until it is set, an incident affecting one branch is handled with the branch switch of §11.5:
1. Identify the branch from the logs (branch_id).
2. Turn the branch's switch off: its customers are told to ask at the branch ([REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) E6).
3. Fix the cause; turn the switch on; record the window.
```

### 20.1.7 Stopped Payout

```text
Handle a payout stopped at the retry limit (§17.2)
1. The payouts_stopped alert fires; open the stopped-payout list in the payout area.
2. Check with CardPay Ltd (its portal or support) whether the payout was paid.
3. A payout staff member records the result by hand with the evidence.
4. A second payout staff member confirms it; a paid result marks the refund Paid.
5. A payout that can never succeed (for example a closed card) waits for the business rule that is still open (§17.2).
```

### 20.1.8 Monthly Payout Check Finding

```text
1. Open the reconciliation_run findings for the month.
2. For a missing payout: confirm the refund request is still Approved and has no payout row; publish its approval again with POST /v1/operations/refund-requests/{refundRequestId}/approval-republication on the management port; confirm the payout row exists.
3. For a duplicate payout: confirm both payouts with CardPay Ltd (the report of the §17.2 monthly-check marker) and hand the case to the Refunds and Loyalty Product Owner for recovery.
4. Record the findings and actions in the incident record.
```

### 20.1.9 Switch a Branch On

```text
1. Confirm the branch is in the rollout plan (PSDD/QD-03).
2. Turn the branch's switch on (§11.5); the change is logged.
3. Look up a receipt of that branch and confirm its items show as refundable.
4. Watch refund_requests_submitted_total for the branch for one day.
```

### 20.1.10 Loyalty Points Go-Live

```text
1. Confirm the gates of §11.3 for Loyalty Points.
2. Note refund_outcome_inbox_unprocessed.
3. Turn the Loyalty Points switch on (§11.5).
4. Watch the inbox drain and take_back_latency_seconds stay within LOYALTY/NFR-02.
5. Open a test member's balance and history.
```

## 20.2 Diagnostics Cheatsheet

| Severity | Symptom | First Check | Likely Cause | Action |
|----------|---------|-------------|--------------|--------|
| SEV1 | Portal unreachable | Load balancer health, replica readiness | Zone or region loss, a bad deployment | §20.1.5 or roll back the image (§11.3) |
| SEV2 | Receipt lookups fail (customers told to try later) | `receipt_lookup_duration_seconds` errors | Point-of-Sale Records unavailable | Contact the Retail IT team; nothing to fix on the platform |
| SEV2 | Payouts not completing | `payout_outbox_oldest_seconds`, the CardPay Ltd circuit breaker | CardPay Ltd outage or credential expiry | Check credentials (§20.1.4); wait for the provider; §20.1.7 for stopped payouts |
| SEV3 | Customer messages failing | `messages_total` with status FAILED | MsgHub outage or invalid contacts | Check MsgHub status; refunds are unaffected |
| SEV2 | Take-backs late (over 1 hour) | `take_back_latency_seconds`, `refund_outcome_inbox_unprocessed` | Go-live switch off, processor stuck | Check the switch (§11.5); §20.1.3 |
| SEV3 | Publication-log rows not completing | Publication-log age metric | A listener failing on a poison event | §20.1.3 |

## 20.3 On-Call

- **Rotation:** **[NEEDS CLARIFICATION: Which team runs on-call for the platform, and on which rotation? Owner: Refunds and Loyalty Product Owner.]**
- **Escalation:** on-call engineer, then the on-call Software Architect, then the Refunds and Loyalty Product Owner for business decisions (a region failover, a stopped payout rule).
- **Paging policy:** SEV1 pages at once at any hour; SEV2 pages in business hours and at once outside them when payouts are affected; SEV3 creates a ticket.
- **Post-incident:** a blameless review within 5 working days for SEV1 and SEV2, with actions tracked to closure.

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 15-environments.md | NEXT: 17-appendix-and-wishlist.md -->

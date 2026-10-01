<!--
CHUNK: 16
TITLE: Operations Runbook
PROJECT: Refunds Platform
VERSION: 1.1
DEPENDS_ON: 07, 14
PART OF: SDD - Refunds Platform
-->

# 20. Operations Runbook

## 20.1 Common Operations

### 20.1.1 Restart a Service

```text
[NEEDS CLARIFICATION: restart procedure for the deployable (namespace, deployment name, rollout check, health endpoint, escalation). Neither BRD specifies operational procedures.]
```

### 20.1.2 Clear Cache

```text
Not applicable for this release: the platform has no cache tier (§6).
```

### 20.1.3 Replay DLQ Messages

```text
Not applicable for this release: no broker and no DLQ (ADR-02).
[NEEDS CLARIFICATION: procedure to inspect and re-run incomplete in-process event publications (§14.10), and to re-queue Failed payouts and messages, once the post-failure rules are decided (§17.2, §17.3).]
```

### 20.1.4 Rotate Secrets

```text
[NEEDS CLARIFICATION: rotation procedure for CardPay, MsgHub, and POS records credentials and for the PII encryption keys (§11.6).]
```

### 20.1.5 Database Failover

```text
[NEEDS CLARIFICATION: failover procedure, once the PostgreSQL HA topology is chosen (§6).]
```

### 20.1.6 Tenant-Specific Incident Response

```text
[NEEDS CLARIFICATION: tenant incident procedure: scope the tenant, contain access, notify, and record.]
```

## 20.2 Diagnostics Cheatsheet

| Severity | Symptom | First Check | Likely Cause | Action |
|----------|---------|-------------|--------------|--------|
| [NEEDS CLARIFICATION: severity] | Approved requests not turning Paid | `payout_oldest_open_seconds`, CardPay circuit breaker state | CardPay outage or refusals | [NEEDS CLARIFICATION: action and escalation] |
| [NEEDS CLARIFICATION: severity] | Customers not receiving messages | `notification_oldest_pending_seconds` | MsgHub outage or credentials | [NEEDS CLARIFICATION: action and escalation] |
| [NEEDS CLARIFICATION: severity] | Points not taken back after a refund | `loyalty_take_back_lag_seconds`, `loyalty_pending_take_backs` | Incomplete `RefundPaid` publication or purchase not yet received | [NEEDS CLARIFICATION: action and escalation] |
| [NEEDS CLARIFICATION: severity] | Balance differs from the sum of its movements | `loyalty_balance_mismatch_total` and the nightly job log | A movement written without its balance update, or a manual data change | [NEEDS CLARIFICATION: action and escalation] |
| [NEEDS CLARIFICATION: severity] | Events not reaching a module | `event_publication_oldest_incomplete_seconds`, `event_publication_stuck_total`, and the publication's event type | A listener failing on a poison event, or re-delivery stopped | [NEEDS CLARIFICATION: action and escalation] |
| [NEEDS CLARIFICATION: severity] | Customers cannot submit refunds | `refund_pos_lookup_seconds` errors and the API-02 circuit breaker state | POS records outage or expired credentials | [NEEDS CLARIFICATION: action and escalation] |
| [NEEDS CLARIFICATION: severity] | Approved refund whose payout ended Failed or Unknown | `payout_failed_total`, the payout's status and `last_failure_reason` | CardPay refusals for 24 h, or an unresolved outcome awaiting reconciliation | [NEEDS CLARIFICATION: action and escalation] |

## 20.3 On-Call

- **Rotation:** [NEEDS CLARIFICATION: rotation policy and team.]
- **Escalation:** [NEEDS CLARIFICATION: escalation path.]
- **Paging policy:** [NEEDS CLARIFICATION: SEV1, SEV2, SEV3 rules tied to the §18 SLOs.]
- **Post-incident:** [NEEDS CLARIFICATION: RCA expectations and timelines.]

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 15-environments.md | NEXT: 17-appendix-and-wishlist.md -->

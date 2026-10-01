<!--
CHUNK: 16
TITLE: Operations Runbook
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: 07, 14
PART OF: SDD - Refunds Platform
-->

# 20. Operations Runbook

The BRDs specify no operational procedure, so every procedure below is an empty template awaiting the operations team. Each must be runnable by an on-call engineer who did not write the service (§20 quality bar).

## 20.1 Common Operations

### 20.1.1 Restart a Service

```text
[NEEDS CLARIFICATION: restart procedure for refunds-platform-core, payout-service, and notification-service: rollout check, pod selection, log capture, health verification, escalation.]
```

### 20.1.2 Clear Cache

```text
Not applicable for this release: the platform has no cache (§6).
```

### 20.1.3 Replay DLQ Messages

```text
[NEEDS CLARIFICATION: redrive procedure for refund-service.dlq, payout-service.dlq, notification-service.dlq, and loyalty-service.dlq: inspection, fix confirmation, redrive into the consumer group only (§14.6 item 6), verification.]
```

### 20.1.4 Rotate Secrets

```text
[NEEDS CLARIFICATION: rotation procedure for CardPay, MsgHub, and POS Records credentials, Keycloak client secrets, and database passwords, per tenant, without downtime.]
```

### 20.1.5 Database Failover

```text
[NEEDS CLARIFICATION: failover procedure for the core, payout, and notification databases, including outbox relay and consumer restart after failover.]
```

### 20.1.6 Tenant-Specific Incident Response

```text
[NEEDS CLARIFICATION: procedure to isolate one tenant's traffic, credentials, and consumer backlog during an incident.]
```

### 20.1.7 Payout Failed After the Retry Window

Supports [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1.

```text
[NEEDS CLARIFICATION: procedure when PAYOUT_FAILED is raised: CardPay status check, contact with the branch manager, manual resolution path, and record keeping.]
```

## 20.2 Diagnostics Cheatsheet

| Severity | Symptom | First Check | Likely Cause | Action |
|----------|---------|-------------|--------------|--------|
| [NEEDS CLARIFICATION: severity model] | [NEEDS CLARIFICATION: diagnostics rows to be written by the operations team from §11.4 alerts] | - | - | - |

## 20.3 On-Call

- **Rotation:** [NEEDS CLARIFICATION: on-call rotation.]
- **Escalation:** [NEEDS CLARIFICATION: escalation path, including CardPay, MsgHub, and Retail IT contacts.]
- **Paging policy:** [NEEDS CLARIFICATION: SEV1 / SEV2 / SEV3 rules.]
- **Post-incident:** [NEEDS CLARIFICATION: RCA expectations and timelines.]

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 15-environments.md | NEXT: 17-appendix-and-wishlist.md -->

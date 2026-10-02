<!--
CHUNK: 16
TITLE: Operations Runbook
PROJECT: Refunds Platform
VERSION: 1.3
DEPENDS_ON: 07, 14
PART OF: SDD - Refunds Platform
-->

# 20. Operations Runbook

The BRDs do not specify operational procedures; every procedure below needs the operations team's input before go-live.

## 20.1 Common Operations

### 20.1.1 Restart a Service

```text
[NEEDS CLARIFICATION: restart procedure for refunds-platform-core, payout-service, and notification-service: pre-checks (no rollout in progress, no payout claimed mid-call), commands, log capture, health verification, and escalation.]
```

### 20.1.2 Clear Cache

```text
[NEEDS CLARIFICATION: not applicable while the platform has no cache tier (§6 Caching); confirm, or write the procedure for the gateway's token and key caches.]
```

### 20.1.3 Replay DLQ Messages

```text
[NEEDS CLARIFICATION: replay procedure for each <topic>.<consumer group>.dlq (§14.4): how to inspect a message, fix the cause, reset or re-feed the consumer group from the retained log, and confirm the inbox dedup made the replay safe. The replay window chosen here is part of the dedup window of §14.6 rule 2.]
```

### 20.1.4 Rotate Secrets

```text
[NEEDS CLARIFICATION: rotation procedure for the CardPay, MsgHub, and POS Records credentials, the database credentials, and the Kafka credentials, without a redeploy (§11.6).]
```

### 20.1.5 Database Failover

```text
[NEEDS CLARIFICATION: failover procedure for the core, payout, and notification databases, including how the outbox relays and payout-retry workers resume after failover.]
```

### 20.1.6 Tenant-Specific Incident Response

```text
[NEEDS CLARIFICATION: procedure for an incident limited to one tenant, found and isolated by its tenant_ref in logs and metrics (§11.4): isolating its traffic at the gateway, pausing its payouts, and communicating with its branches, without logging tenant_id at INFO.]
```

### 20.1.7 Broker or Schema Registry Outage

```text
The core keeps serving and commits outbox rows; payouts and messages wait; watch the outbox backlog age (§11.4). After recovery the one active relay of each outbox drains it in commit order (§14.6 rule 3) and consumers dedup, with no manual replay.
[NEEDS CLARIFICATION: commands and checks for operations.]
```

### 20.1.8 Keycloak Outage

```text
New sign-ins and token refreshes fail; issued tokens work until they expire; the web app shows that sign-in is unavailable; escalate to the platform team.
[NEEDS CLARIFICATION: commands and checks for operations.]
```

### 20.1.9 Platform-specific operations

```text
[NEEDS CLARIFICATION: procedures for (1) an approved refund whose payout is FAILED at the end of the §17.2 retry window (§17.2 After the retry window), (2) a request flagged by the payout watchdog (§17.1), (3) a RefundPaid publication stuck in the publication log (§11.1), and (4) a purchase import whose runs keep failing (the §17.4 alert after two failed runs) or that rejected records (§17.4).]
```

## 20.2 Diagnostics Cheatsheet

| Severity | Symptom | First Check | Likely Cause | Action |
|----------|---------|-------------|--------------|--------|
| [NEEDS CLARIFICATION: severity model] | [NEEDS CLARIFICATION: diagnostics entries per deployable: symptom, first check, likely cause, action] | - | - | - |

## 20.3 On-Call

- **Rotation:** [NEEDS CLARIFICATION: rotation policy and on-call assignment]
- **Escalation:** the provider relationships are held by the dependency owners in [REFUNDS 02 § Dependencies](../brd-refunds-portal/02-glossary-assumptions-facts.md#dependencies) and [LOYALTY 02 § Dependencies](../brd-loyalty-points/02-glossary-assumptions-facts.md#dependencies), and the §4 risk owners. [NEEDS CLARIFICATION: escalation path, including CardPay, MsgHub, and the Retail IT team for POS Records]
- **Paging policy:** [NEEDS CLARIFICATION: SEV1, SEV2, and SEV3 rules]
- **Post-incident:** [NEEDS CLARIFICATION: RCA expectations and timelines]
- **Break-glass:** Prod data access outside the web app needs a named approver, a time-boxed account, and an audit record reviewed after use (REFUNDS/NFR-04). It serves incidents and approved data requests (such as the §16.8 erasure jobs), never routine customer support; support access waits for the roles open in REFUNDS OI-13 and LOYALTY OI-14. [NEEDS CLARIFICATION: approvers and tooling for break-glass access.]

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 15-environments.md | NEXT: 17-appendix-and-wishlist.md -->

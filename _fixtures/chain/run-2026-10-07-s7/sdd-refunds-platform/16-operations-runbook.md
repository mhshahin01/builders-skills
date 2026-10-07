<!--
CHUNK: 16
TITLE: Operations Runbook
PROJECT: Refunds Platform
VERSION: 1.2
DEPENDS_ON: 07, 14
PART OF: SDD - Refunds Platform
-->

# 20. Operations Runbook

The BRDs give no operational procedure, so every procedure below waits for the operations owner.

## 20.1 Common Operations

### 20.1.1 Restart a Service

```text
[NEEDS CLARIFICATION: restart procedure for the refunds-platform deployable: rollout check, pod selection, log capture, health verification, escalation.]
```

### 20.1.2 Clear Cache

```text
Not applicable for this release: the platform has no cache tier (§6 Caching).
```

### 20.1.3 Replay DLQ Messages

```text
[NEEDS CLARIFICATION: procedure to replay the events parked in each module's inbox_entry table, to resubmit incomplete event publications in platform.event_publication (the platform has no broker DLQ, ADR-02), and to replay a failed provider call.]
```

### 20.1.4 Rotate Secrets

```text
[NEEDS CLARIFICATION: rotation procedure for the provider credentials and Keycloak client secrets in Vault, with the order of steps that avoids downtime.]
```

### 20.1.5 Database Failover

```text
[NEEDS CLARIFICATION: failover procedure from the PostgreSQL primary to the standby, the checks before and after, and the reconnection of the deployable.]
```

### 20.1.6 Tenant-Specific Incident Response

```text
[NEEDS CLARIFICATION: incident procedure for one tenant: isolating the tenant's traffic, tenant-scoped diagnostics without logging tenant_id at INFO, and communication.]
```

### 20.1.7 Payouts Near the Payout Deadline

```text
[NEEDS CLARIFICATION: procedure when payouts approach the payout deadline (§17.3) during a Payment Provider outage: who checks the provider status and who tells the branches.]
```

### 20.1.8 Late Payout Success

```text
Trigger: the late-success page from payouts (R-14).
1. Find the request by its reference number and confirm with the Payment Provider that the payout succeeded.
2. Tell the branch manager and any active cover of the branch before they settle the refund in person.
3. If the branch has already settled, record both payments and hand the case to the REFUNDS owner.
[NEEDS CLARIFICATION: who contacts the branch, and the response time.]
```

### 20.1.9 Stale Branch Assignments

```text
Trigger: assignments older than two refresh intervals (INT-05).
1. Check the API-06 outcomes of branch-assignment-refresh.
2. The last synced copy stays in force; tell the branch managers whose covers change today.
[NEEDS CLARIFICATION: contact at the INT-05 owner.]
```

### 20.1.10 Branch With No Recipient

```text
Trigger: a message skipped because API-13 returned no manager and no cover.
1. Check the branch's assignment at the INT-05 source.
2. After the fix, the next daily message reaches the right people; tell the branch about any Payout failed message it missed.
[NEEDS CLARIFICATION: who corrects branch assignments.]
```

### 20.1.11 Malformed Contact Address

```text
Trigger: a message failed on an address customer-accounts holds.
1. Find the account by its id (no address appears in logs).
2. The customer still sees the status in REFUNDS/UC-02.
[NEEDS CLARIFICATION: whether operations may correct a customer's address.]
```

### 20.1.12 Payout Callback Signature Failure

```text
Trigger: API-04 refused a callback.
1. Compare the source with the provider's published addresses and keys.
2. On repeats, block the source at the gateway and call CardPay Ltd.
3. Payouts keep their deadline meanwhile.
[NEEDS CLARIFICATION: CardPay Ltd security contact.]
```

### 20.1.13 Purchase Feed Lag

```text
Trigger: the purchase-feed lag alert (R-13).
1. Check the API-07 receipts per branch for the day.
2. Call the POS Records owner before the end of the purchase day (LOYALTY/NFR-03).
[NEEDS CLARIFICATION: POS Records owner contact (R-10).]
```

### 20.1.14 Items Notice Lag

```text
Trigger: an items notice not acknowledged within 15 minutes (INT-03).
1. Check the API-02 outcomes.
2. Tell the affected branches that the till may not block portal items until POS Records recovers.
[NEEDS CLARIFICATION: Retail IT team contact.]
```

### 20.1.15 Data Subject Request

```text
Trigger: an access or portability request accepted by the Data Protection Officer (GDPR Art. 15 and 20), answered within one month (Art. 12(3)).
1. Identify the person in the tenant of the request: the customer account by its email address (customer-accounts), with the reference numbers of its refund requests (refund-requests), and the member by member number (loyalty-points).
2. Through the production access elevation of §19, run the reviewed read-only export query that each module keeps in its source: the account (customer-accounts); the requests, items, and history linked to the account, with their payouts (refund-requests, payouts); the messages of the last 90 days (notifications); the membership periods, movements, purchases, and corrections of every membership still held, current or former, and the paid refunds waiting for their purchase whose refund reference is one of the customer's reference numbers (loyalty-points). A portability file takes from loyalty-points only the current membership, the data processed under contract (GDPR Art. 20(1)(a); §17.5 Compliance).
3. Give the JSON and CSV files to the Data Protection Officer.
4. An erasure request is answered with the rules of §16.8.
[NEEDS CLARIFICATION: the secure hand-over of export files to the Data Protection Officer.]
```

### 20.1.16 Retention Overdue

```text
Trigger: rows held past their retention period (`retention_overdue_rows`, §17.5).
1. Find the ids the jobs logged as failed (no member number at INFO).
2. Fix the cause; the next daily run deletes the rows.
3. Report the overdue rows and how long they were held to the Data Protection Officer (LOYALTY/NFR-07).
```

## 20.2 Diagnostics Cheatsheet

| Severity | Symptom | First Check | Likely Cause | Action |
|----------|---------|-------------|--------------|--------|
| [NEEDS CLARIFICATION: severity] | [NEEDS CLARIFICATION: diagnostics cheatsheet rows for receipt checks failing, payouts failing, messages not sent, points not updated, and sign-in failing] | - | - | - |

## 20.3 On-Call

- **Rotation:** [NEEDS CLARIFICATION: on-call rotation]
- **Escalation:** [NEEDS CLARIFICATION: escalation path, including the provider contacts at CardPay Ltd, MsgHub, and the POS Records owner]
- **Paging policy:** [NEEDS CLARIFICATION: SEV1, SEV2, and SEV3 rules against the §18.5 availability budgets]
- **Post-incident:** [NEEDS CLARIFICATION: RCA expectations and timelines]

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 15-environments.md | NEXT: 17-appendix-and-wishlist.md -->

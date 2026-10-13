<!--
CHUNK: 16
TITLE: Operations Runbook
PROJECT: Refunds Platform
VERSION: 1.3
DEPENDS_ON: 07, 14
PART OF: SDD - Refunds Platform
-->

# 20. Operations Runbook

The BRDs specify no operational procedure, and the hosting service, CI/CD platform, and observability backends are open (§6), so every procedure below is a heading with its open question. Design facts a procedure will rely on are noted under each.

## 20.1 Common Operations

### 20.1.1 Restart a Service

**[NEEDS CLARIFICATION: What are the exact steps to restart one replica of refunds-platform-app on the chosen hosting service, and how is a restart confirmed healthy? Owner: platform team.]**

Design facts: any replica can be restarted alone (AP-01); scheduled jobs resume on the other replicas (`FOR UPDATE SKIP LOCKED`); health is `/actuator/health/readiness` (§11.3).

### 20.1.2 Clear Cache

Not applicable for this release: the platform has no cache (§6).

### 20.1.3 Replay DLQ Messages

**[NEEDS CLARIFICATION: What are the exact steps to inspect and re-drive incomplete publication-log listener rows, failed messages, and stopped payouts, and who may do it in Prod? Owner: platform team.]**

Design facts: there is no broker DLQ; incomplete listener rows (§11.1), `Failed` messages (§17.3), and `Stopped` payouts (§17.2) and `Unknown` payouts play its role; listeners are idempotent, so a re-drive is safe. The incomplete listener rows of a product that is switched off and the `Held` payouts of an open card dispute are waiting by design and are not re-driven (§11.1, §17.2 Disputes).

### 20.1.4 Rotate Secrets

**[NEEDS CLARIFICATION: What are the exact steps to rotate CardPay, MsgHub, POS Records, and IAM client credentials without downtime? Owner: platform team.]**

Design facts: secrets reach the container at start (§11.5), so a rotation is a secret update followed by a rolling restart.

### 20.1.5 Database Failover

**[NEEDS CLARIFICATION: What are the exact steps to fail over the PostgreSQL offering, and how are in-flight payouts checked afterwards? Owner: platform team.]**

Design facts: payouts left `Sending` by the failover are picked up when their lease expires (§17.2).

### 20.1.6 Tenant-Specific Incident Response

**[NEEDS CLARIFICATION: What are the exact steps when one tenant's data or provider credentials are affected by an incident? Owner: platform team.]**

Design facts: one tenant is configured today (ADR-03); provider credentials are per tenant (§15.3).

### 20.1.7 Resolve a Stopped Payout

**[NEEDS CLARIFICATION: What are the exact steps for a payout that reached the retry stop time, and who contacts the customer? Owner: REFUNDS BRD owner with operations.]**

Design facts: the stop time and the never-succeeds path are open in §17.2; a `Stopped` payout can still become `Succeeded` on a late CardPay result; no other way to pay the customer exists until REFUNDS answers the §17.2 never-succeeds marker, and any such way starts only after CardPay confirms that none of the payout's attempts succeeded; an `Unknown` payout (§17.2) is resolved by the same check with CardPay; the outcome is recorded as a payout resolution by a `PAYOUT_OPERATOR`, and a paid outcome needs a second operator's confirmation; never a status update. A `not paid` resolution of a payout whose original payment's dispute the bank refunded to the customer moves the payout to `Cancelled`, and the request becomes Rejected (§17.2 Disputes).

### 20.1.8 Switch On a Product or Start More Branches

**[NEEDS CLARIFICATION: What are the exact steps, approvals, and checks for switching the Refunds Portal or Loyalty Points on in Prod and for adding branches to `REFUNDS_PORTAL_BRANCHES`? Owner: platform team with the product owner.]**

Design facts: each change is a configuration change and a rolling restart (§11.5); a product is switched on only once its Prod gate of §11.3 is met; `LOYALTY_REFUND_REPORTING_START_DATE` is set in the change that switches the second product on and is the date of that change, never an earlier one, because a refund paid on or after it takes back points and a take-back cannot be undone (§17.4 Corrections); switching Loyalty Points on dispatches every refund outcome kept in the publication log of `refund-request` (§11.1); a receipt from a branch not in `REFUNDS_PORTAL_BRANCHES` is refused (§17.1 Eligibility).

## 20.2 Diagnostics Cheatsheet

**[NEEDS CLARIFICATION: Which severities, symptoms, first checks, and actions does the diagnostics cheatsheet list? Owner: platform team.]**

| Severity | Symptom | First Check | Likely Cause | Action |
|----------|---------|-------------|--------------|--------|
| Per the marker | Listener lag alert (§11.4) | `publication_incomplete_oldest_seconds` per listener | A failing listener or a provider outage | Per the marker |
| Per the marker | Payout `Stopped` alert | `payouts_stopped_total`, the payout's attempts | CardPay refusing the card | Per the marker (20.1.7) |

## 20.3 On-Call

**[NEEDS CLARIFICATION: What are the on-call rotation, escalation path, paging policy per severity, and post-incident expectations? Owner: product owner.]**

- **Rotation:** per the marker.
- **Escalation:** per the marker.
- **Paging policy:** per the marker; alerts are SLO-based (§11.4).
- **Post-incident:** per the marker.

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 15-environments.md | NEXT: 17-appendix-and-wishlist.md -->

# LLD Quality Bar

The LLD has multiple high-value sections. This file captures the quality bar for the most easily-thinned ones — Per-Service Implementation, Use-Case Workflows, Design Pattern Application, Cross-Cutting Concerns, and Operations Runbook.

The principle is the same as `sdd-quality.md` in `sdd-unifier`: substantive content, not template-shaped filler.

---

## `04-implementation/<service>.md` § 7.1 Responsibility

The most-skimmed section in any per-service file.

**Good:** Names the bounded context, the data this service owns, and the cross-service collaborators in one paragraph.

> Example: "wallet-core owns the Wallet aggregate and the Ledger entries that record balance mutations. It is the source of truth for current balance per (wallet, currency); reseller-management consumes wallet.created/closed events to maintain reseller-side projections; reporting-aggregator consumes ledger.entry-recorded events to feed reporting. wallet-core does not own funding sources (those live in payment-processor) or notifications (those live in notification-dispatcher)."

**Bad:** "wallet-core handles wallet operations." (Tells you nothing.)

**Test:** From the `Responsibility` paragraph alone, can a developer joining the team predict which 3 events this service produces and which 2 it consumes? If not, rewrite.

---

## `04-implementation/<service>.md` § 7.2 Class & Interface Map

**Good:**

- Lists controllers with their endpoints (table-form).
- Lists service interfaces with implementations.
- Lists method signatures for the load-bearing 3–7 methods (not every getter/setter).
- Names the domain types (records / entities) with a one-line purpose.

**Bad:**

- A bulleted list of all class names with no signatures.
- "All standard Spring patterns apply." (No.)
- Method signatures without parameter types.

**Test:** Can an AI implementer scaffold the `*Controller`, `*Service`, `*ServiceImpl`, `*Repository` skeletons from this section alone, with method signatures matching what the LLD describes? If not, rewrite.

---

## `04-implementation/<service>.md` § 7.4 Design Patterns Applied

The single biggest source of "looks structured but is empty" in LLDs.

**Good pattern subsection:**

```markdown
### Pattern: Outbox

> **Applied:** Outbox pattern (CLAUDE.md: "Outbox pattern is mandatory for any state change that must produce an event. No dual-writes to DB and Kafka.")
>
> **Rationale (this service):** State changes in the wallet aggregate emit `wallet.balance-updated` events to reporting-aggregator. Direct dual-write to DB+Kafka would risk inconsistency on failure (DB commit succeeds but Kafka publish fails, or vice versa). The outbox row commits in the same transaction as the ledger update; a separate publisher sends it and marks it processed only after the broker acknowledges, so delivery is at-least-once and consumers must dedupe.

**Roles:**

| Role | Class | Notes |
|---|---|---|
| Outbox table | `outbox` table in `app_wallet_core` schema | Append-only |
| Outbox writer | `WalletServiceImpl.creditBalance` (within tx) | Inserts row inside same tx as ledger update |
| Outbox publisher | `OutboxPublisher` (`@Scheduled(fixedDelay=1000)`) | Polls unprocessed rows oldest first; publishes each; marks it processed only after the broker acknowledges |

**Class diagram:**

[Mermaid classDiagram]

**Pseudocode skeleton:**

[Pseudocode]
```

**Bad pattern subsection:**

```markdown
### Pattern: Outbox

We use outbox pattern. See CLAUDE.md.
```

**Test:** Can a developer implement this pattern from the subsection alone — knowing which classes participate, what each contributes, and what the pseudocode for each is? If not, rewrite.

**Outbox test:** the writer inserts the row in the aggregate's transaction, and the publisher skeleton shows the acknowledgement check before `markProcessed`, leaves failed or timed-out rows unprocessed, and names the duplicate case (`pattern-rules.md` § Outbox, Delivery contract). In from-code mode the skeleton matches the code; if the code marks rows processed without a successful acknowledgement, that stays visible and carries the HIGH anti-pattern flag (`pattern-rules.md` § Anti-patterns to flag).

### Minimum pattern set per service

Apply unconditionally if conditions match:

1. Outbox (if service emits state-change events).
2. Idempotency (if service exposes write endpoints touching money / wallet / notifications / external providers).
3. RFC 9457 error model (always for REST services).
4. Saga (if service participates in cross-service business transactions).

Apply discretionarily:

5. Strategy (if there are runtime variants of the same operation).
6. Factory Method (if there is a creation hierarchy).
7. Mediator (if ≥3 peers need decoupling).
8. Chain of Responsibility (if pipeline of handlers).
9. Template Method (if stable structure with variable steps).
10. Facade (if simplified interface to subsystem).

If a discretionary pattern is named in the section but the conditions don't match, that's over-engineering — remove it.

---

## `04-implementation/<service>.md` § 7.8 Use-Case Workflows

Each workflow is where the LLD earns its keep for the implementer.

**Good workflow:**

- Names the trigger (REST endpoint / event consumer / schedule).
- Lists pre- and post-conditions.
- Step-by-step control flow with explicit numbered steps.
- Sequence diagram (Mermaid) with all participants.
- Idempotency points named.
- Outbox emission points named.
- Retry / timeout policy stated.
- Error handling per error type stated.

**Bad workflow:**

- "The user calls the endpoint and the system processes it."
- A diagram with no participants labelled.
- Idempotency mentioned but no key shown.

**Test:** Can the AI implementer write the integration test for this workflow from this section alone? If not, rewrite.

---

## `09-cross-cutting.md` § 12.6 Error Model (RFC 9457)

Every row should have a concrete value, not a wave-of-the-hand.

**Good:**

| Field | Type | Notes |
|---|---|---|
| `type` | string (URI) | Stable, dereferenceable error type identifier (`https://errors.example.com/<context>/<error>`) |
| `title` | string | Human-readable summary, locale-neutral |
| `status` | int | HTTP status code |
| `detail` | string | Specific to this occurrence |
| `instance` | string | Path that produced the error |
| `code` (extension) | string | Internal error code (`<context>-<error>` e.g., `wallet-not-found`) |
| `traceId` (extension) | string | OpenTelemetry trace ID |
| `errors` (extension) | array | Validation: per-field errors with `field`, `code`, `message` |

**Bad:** "Standard error envelope per RFC 9457."

---

## `10-operations.md` § 13.8 Runbook Procedures

The runbook is the single most-tested artefact during incidents. Empty runbook procedures cost time when an engineer is paged at 03:00.

**Good runbook procedure:**

```text
Drain outbox backlog (wallet-core)

Trigger: Alert `OutboxBacklog` (outbox_unprocessed_count > 1000 for 5m OR oldest_age > 30s for 5m).

1. Confirm backlog: query Grafana panel `wallet-core / outbox unprocessed`. If <1000 and trending down, alert is closing — observe for 2 min before acting.
2. Identify the publisher pod:
   kubectl get pods -n prod -l app=wallet-core
3. Check publisher health: kubectl logs <pod> -n prod | grep -i "OutboxPublisher" | tail -20
4. Common cause A: Kafka producer config drift. Verify config: kubectl exec <pod> -n prod -- env | grep KAFKA
5. Common cause B: publisher thread starved. Check thread dump: kubectl exec <pod> -n prod -- jcmd 1 Thread.print | grep -i outbox
6. If health is otherwise OK, restart: kubectl rollout restart deployment/wallet-core -n prod
7. Verify drain: watch -n 5 'curl -sS https://wallet-core.prod.internal/actuator/metrics/outbox.unprocessed'
8. If drain stalls past 10 min, escalate to architect on-call (PagerDuty rotation `wallet-architects`).
9. Post-incident: file ticket if root cause is non-obvious.
```

**Bad runbook procedure:**

```text
1. Identify failing pod
2. Restart it
3. Verify drain
4. Escalate if needed
```

**Test:** Could an on-call engineer who has never worked on this service successfully execute the procedure at 03:00 with no help, given only this runbook? If not, rewrite.

---

## `12-performance.md` § 15.2 Caching Strategy

Caches are the easiest place to add accidental bugs (stale data, cross-tenant leakage). The LLD must specify per-cache:

- Scope (local / Redis / CDN).
- Eviction (LRU / time / none).
- TTL.
- Invalidation triggers (which events invalidate which keys).
- Tenant scoping (key includes `tenant_id` — non-negotiable per CLAUDE.md).

Bad: "Use Redis cache where appropriate."

Good: Per-cache table row with all five columns above.

---

## When to defer to flags vs to write

If the LLD is being **derived from an SDD** (per `sdd-to-lld.md`), the SDD often won't pin every detail. In that case, sections come out with `> Confirm:` (medium confidence) or `> TODO: <best-guess> — verify` (low confidence) markers — *not* as low-quality filler.

Empty-with-flag is correct; thin-with-words is not.

If the LLD is being **reverse-engineered from code** (per `code-extraction.md`), the structural sections should be high-confidence (the code is the truth). Flags appear on inferred semantic content (rationale, business rule narrative).

If the LLD is being **generated in hybrid mode** (per `hybrid-drift.md`), the quality bar above applies in full to non-drifting sections; drifting sections add the drift marker plus a resolution suggestion.

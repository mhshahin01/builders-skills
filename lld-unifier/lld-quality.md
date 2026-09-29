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

> **Applied:** Outbox pattern (CLAUDE.md: "Outbox pattern is mandatory for any state change that must produce an event.")
>
> **Rationale (this service):** State changes in the wallet aggregate emit `wallet.balance-updated` events to reporting-aggregator. Direct dual-write to DB+Kafka would risk inconsistency on failure (DB commit succeeds but Kafka publish fails, or vice versa). The outbox table guarantees the event survives DB commit and is published asynchronously by the publisher, with at-least-once semantics that consumers must dedupe.

**Roles:**

| Role | Class | Notes |
|---|---|---|
| Outbox table | `outbox` table in `app_wallet_core` schema | Append-only |
| Outbox writer | `WalletServiceImpl.creditBalance` (within tx) | Inserts row inside same tx as ledger update |
| Outbox publisher | `OutboxPublisher` (`@Scheduled(fixedDelay=1000)`) | Polls unprocessed rows; publishes; marks processed |

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

- Opens with its traceability line (§ Use-case traceability below) when the SDD derives from a BRD.
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

## Use-case traceability (04 lines, 14 § 17.3, 13 § 16.8, 16 § 19.9)

Traceability is only useful if a reader can follow it both ways without searching. Rules: `sdd-to-lld.md` § Use-case traceability.

**Test:** take a production error report that names `use_case = REFUNDS/UC-04` and `screen = REFUNDS/SCR-04`, or a failing UAT case `REFUNDS/TC-DEC-03`. From its row in 16 § 19.9, one click opens the workflow block; from the block's traceability line, one click each opens the BRD use case heading, SDD §7.3, and each test case's feature area; 13 § 16.8 names the spec to re-run (`--grep "@REFUNDS/TC-DEC-03"`). Then go the other way: pick any route in 14 § 17.3; its screen and use cases match the BRD, and the use case's block names that route.

**Good line:**

```markdown
### REFUNDS/UC-04: Approve / Reject Refund

> **Traceability:** BRD [REFUNDS/UC-04](../../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) · SDD [§7.3](../../sdd-refunds-portal/03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) · Owner: refund-service · Entry points: `POST /v1/refunds/{refundId}/decision` · UAT/BAT: [REFUNDS/TC-DEC-01](../../brd-refunds-portal/16-uat-bat-test-cases.md#2-refund-decisions-uc-04-scr-04), [REFUNDS/TC-DEC-02](../../brd-refunds-portal/16-uat-bat-test-cases.md#2-refund-decisions-uc-04-scr-04) · Screens: [REFUNDS/SCR-04](../../brd-refunds-portal/11-summary-and-uiux.md#screens) via `/manager/refunds/:refundId`
```

**Bad:**

- `UC-04 | refund-service`: no links, nothing to click and nothing to check against.
- An ID without its key (`UC-04` when the SDD's Source BRDs register keys it `REFUNDS`): two BRDs can each have a UC-04.
- An anchor built from a guessed title (`#uc-04-approve-reject-refund` when the heading is `UC-04: Approve / Reject Refund`, whose anchor is `#uc-04-approve--reject-refund`). It looks right and lands nowhere.
- A path counted from the wrong folder (`../brd-...` from a `04-implementation/` file, which needs `../../brd-...`).
- `REFUNDS/TC-DEC-01..04`: a search for `REFUNDS/TC-DEC-03` finds nothing.
- A `UC-12` made up for a platform flow such as key rotation: the LLD cites BRD use cases, it never adds one.
- A screen guessed from the route, or a route's use cases guessed from its path, instead of read from the BRD.
- A restated Main Flow: the workflow block cites the BRD steps it realises (`REFUNDS/UC-04 step 3`) and writes only the technical realisation.
- Entry points restated with request bodies or status codes: the line cites method and path; the contract stays in chunk 06 and the SDD.
- An index that lists only some §7.3 rows, or a cell that disagrees with its home.

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

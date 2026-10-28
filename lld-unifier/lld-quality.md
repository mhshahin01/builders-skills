# LLD Quality Bar

The LLD has multiple high-value sections. This file captures the quality bar for the most easily-thinned ones: the Runtime Stack, Libraries & Coding Conventions, Per-Service Implementation, Use-Case Workflows, Design Pattern Application, API Contracts, Cross-Cutting Concerns, and Operations Runbook.

The principle is the same as `sdd-quality.md` in `sdd-unifier`: substantive content, not template-shaped filler.

---

## `03-architecture.md` § 6.3 Runtime Stack

The stack every service builds on. The stack approval settles it before generation (SKILL.md step 3a), and each row names where it comes from.

**Good:**

- Every row names its source with a label from the one list of the §6.3 Convention (`03-architecture.md` § 6.3 Runtime Stack); a label that names a record links it.
- An `Active` override, or one `Raised in SDD vX.X (Proposed)`, carries the Convention's override label, and links its decision-log entry. `17-specs.md` § 2 states the same value with `(override of SDD §6; see the decision log)`.
- A row SDD §6 still holds as a proposal keeps `(Proposed in SDD §6)`. A missing version pin is one `> TODO:` that names SDD §6 as its home.

**Bad:**

- A value that differs from SDD §6 with the SDD row as its Source: silent drift.
- An override with no decision-log entry, or one marked `⚠ drift`.
- A default with no flag and no approval, written as if decided.
- A `Proposed` SDD §6 row, or a legacy row whose Notes mark it Proposed, written as adopted.

**Test:** from each row, one click reaches the record that settles it (the SDD §6 row, the project instruction file, or the decision log). Every value that differs from SDD §6 is an override with its entry.

---

## `03a-libraries-and-conventions.md` § 6.5 Libraries & Coding Conventions

The register of the libraries and rules every service builds with. It settles each library question once, so a service file cites a row and never settles it again.

**Good:**

- Every §6.5.1 row names its concern, the library, what it replaces (or `-`), a one-line reason, its scope, its source with a label from the one list of the §6.3 Convention, and a Status that follows the Status rule of the §6.5.1 Convention (`03a-libraries-and-conventions.md`).
- A row the Status rule keeps at `Proposed - needs approval` is named in the handoff with the path that confirms it (SKILL.md step 3a, item 1).
- Every §6.5.2 rule has a source, a Do and a Don't that a reviewer can check in code, and `review` as `Enforced by` unless an `Approved` §6.5.1 row backs the tool.
- Every §6.5.3 row names the service, the row it departs from, and a reason that a source states.
- A service file cites a row with a link (the §6.5.1 row, or the §6.3 row for a layer §6.3 holds) and does not restate it.

**Bad:**

- A default written as `Approved` with no source and no approval.
- A rule restated in a service file in other words, so two places can disagree.
- A tool named in `Enforced by` that no `Approved` row backs.
- A service that departs from a row with no §6.5.3 row, or a §6.5.3 row with no reason.
- A row rewritten to match the code in a code-read direction, so the finding for the departure disappears.

**Test:** take any library a service file uses. One click from its citation reaches the §6.5.1 row, or the §6.3 row for a layer §6.3 holds, and the row's Source and Status show what settled it. Every row still `Proposed - needs approval` is named in the handoff with the path that confirms it.

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
- Lists method signatures for the load-bearing 3 to 7 methods (not every getter/setter).
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

**Test:** Can a developer implement this pattern from the subsection alone, knowing which classes participate, what each contributes, and what the pseudocode for each is? If not, rewrite.

**Outbox test:** the writer inserts the row in the aggregate's transaction, and the publisher skeleton shows the acknowledgement check before `markProcessed`, leaves failed or timed-out rows unprocessed, and names the duplicate case (`pattern-rules.md` § Outbox, Delivery contract). In from-code direction the skeleton matches the code. In that direction, if the code marks rows processed without a successful acknowledgement, that stays visible and carries the HIGH anti-pattern flag (`pattern-rules.md` § Anti-patterns to flag).

### Minimum pattern set per service

Apply unconditionally if conditions match:

1. Outbox (if a state change must be followed by a side effect that must not be lost: an integration event, a provider write, or an in-process domain event under a durable SDD §14.10 Delivery line; in-memory events of `07-event-contracts.md` § 10.6 use none).
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

If a discretionary pattern is named in the section but the conditions don't match, that's over-engineering: remove it.

---

## `04-implementation/<service>.md` § 7.8 Use-Case Workflows

Each workflow is where the LLD earns its keep for the implementer.

**Good workflow:**

- Opens with its traceability line (§ Use-case traceability below) when the SDD derives from a BRD.
- Names the trigger (REST endpoint / event consumer / schedule).
- Lists pre- and post-conditions.
- Step-by-step control flow with explicit numbered steps.
- Sequence diagram (Mermaid) with all participants, unless `mermaid-diagrams.md` § When NOT to draw a diagram says none.
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

**Test:** take a production error report whose `use_case` holds `REFUNDS/UC-04` and whose `screen` is `REFUNDS/MK-02`, or a failing UAT case `REFUNDS/TC-DEC-03`. From its row in 16 § 19.9, one click opens the workflow block. From the block's traceability line, one click each opens the BRD use case heading, SDD §7.3, and each test case's feature area. 13 § 16.8 names the spec to re-run (`--grep "@REFUNDS/TC-DEC-03"`). Then go the other way: pick any route in 14 § 17.3. Its screen and use cases match the BRD, and the use case's block names that route.

**Good line:**

```markdown
### REFUNDS/UC-04: Approve / Reject Refund

> **Traceability:** BRD [REFUNDS/UC-04](../../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) · SDD [§7.3](../../sdd-refunds-portal/03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) · Owner: refund-service · Entry points: `POST /v1/refunds/{refundId}/decision` · UAT/BAT: [REFUNDS/TC-DEC-01](../../brd-refunds-portal/16-uat-bat-test-cases.md#2-refund-decisions-uc-04-mk-02), [REFUNDS/TC-DEC-02](../../brd-refunds-portal/16-uat-bat-test-cases.md#2-refund-decisions-uc-04-mk-02) · Screens: [REFUNDS/MK-02](../../brd-refunds-portal/14-todo.md#mockup-coverage) via `/manager/refunds/:refundId`
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

## `06-api-contracts.md` § 9.2 Request / Response Shapes

The implementer's contract for every endpoint and port: one block per § 9.1 row and per § 9.6 row. The field list is in `chunks/06-api-contracts.md` § 9.2 and is not repeated here. The derivation rules and checks are in `sdd-to-lld.md` § API contract blocks.

**Good:**

- Every row has one block, and the block has every field of the list.
- A value the SDD sets equals the SDD character for character. The API ID link is one click from its source. A value no source gives is a proposal under its flag.
- Each error's `type` and `errorCode` equal the owner's 04 § 7.7 row.
- A `TBD - external` field says so, with one `> TODO:` that cites the SDD contract.

**Bad:**

- A § 9.1 row with no block, a block that misses a field of the list, or a status of the row that no entry covers.
- "Standard request and response per the REST conventions": a body with no fields, types, or required flags.
- An error row with an `errorCode` and no `type`, or a `type` that differs from the 04 § 7.7 row.
- A permission token that differs from SDD §16.11, or an `errorCode` that differs from SDD §15.1 or the contract's domain code.
- A proposed field with no flag, or a `TBD` that cites no SDD contract.

**Test:** take any § 9.1 row. From its block alone, an implementer can write the controller signature, the request and response records with their validation, the error mapping, and the contract test. Every value the SDD set is one click from its contract.

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
| `errorCode` (extension) | string | SDD §15.1 standard or domain code, verbatim (e.g., `NOT_FOUND`, `WALLET_NOT_FOUND`) |
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

1. Confirm backlog: query Grafana panel `wallet-core / outbox unprocessed`. If <1000 and trending down, alert is closing: observe for 2 min before acting.
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
- Tenant scoping (a shared cache keys by tenant, whatever the tenancy model, as the project file states).

Bad: "Use Redis cache where appropriate."

Good: Per-cache table row with all five columns above.

---

## When to defer to flags vs to write

If the LLD is being **derived from an SDD** (per `sdd-to-lld.md`), the SDD often won't pin every detail. In that case, sections come out with `> Confirm:` (medium confidence) or `> TODO: <best-guess> - verify` (low confidence) markers, *not* as low-quality filler.

Empty-with-flag is correct; thin-with-words is not.

If the LLD is being **reverse-engineered from code** (per `code-extraction.md`), the structural sections should be high-confidence (the code is the truth). Flags appear on inferred semantic content (rationale, business rule narrative).

If the LLD is being **generated in hybrid direction** (per `hybrid-drift.md`), the quality bar above applies in full to non-drifting sections. In hybrid direction, drifting sections add the drift marker plus a resolution suggestion.

In a **light run** (SKILL.md § Light run), the sub-sections its light set names carry the light-work flag on purpose; the bar above applies to them when their detail is written.

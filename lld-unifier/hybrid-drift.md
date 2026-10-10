# Hybrid Direction: Two-Pass Drift Detection

This file defines the diff logic for hybrid direction: when both an SDD and complete code are available, the skill produces a unified LLD with inline drift markers showing where design intent diverges from code reality.

The output is a **single unified LLD**, not separate `designed/` and `built/` folders. Drift is surfaced inline.

---

## Marker grammar

Every section in the unified LLD is one of:

| Marker | Meaning | Content shape |
|--------|---------|---------------|
| (none / `✅` implicit) | Aligned: from-sdd and from-code agree. | Single content block. |
| `⚠ drift` | Design and code disagree. | Reconciled content + `> Drift note: SDD says X, code does Y. [resolution suggestion]` |
| `🆕 code-only` | Present in code, not in SDD. | Code-derived content + `> Drift note: present in code, not in SDD. [Backfill SDD or remove from code?]` |
| `⛔ sdd-only` | In SDD, not yet built. | SDD-derived content + `> Drift note: in SDD, not yet built. [Schedule implementation or defer?]` |

> Note: these glyphs are functional markers inside generated LLD content. If text markers are preferred, the skill can emit `[ALIGNED]`, `[DRIFT]`, `[CODE-ONLY]`, `[SDD-ONLY]`, and `[POLICY]` instead.

---

## Two-pass workflow

### Pass 1: From-SDD (in memory)

Run the FROM-SDD workflow per `sdd-to-lld.md`. Produce per-section "designed" content. Do NOT write to disk yet.

### Pass 2: From-code (in memory)

Run the FROM-CODE workflow per `code-extraction.md`. Produce per-section "built" content. Do NOT write to disk yet.

### Pass 3: Diff and unify

For each chunk and each subsection within the chunk, classify into one of four cases:

#### Case A: Both passes produced content; content matches semantically

Emit a single content block (no marker). The skill considers the section *aligned*.

> **Match definition:** for tabular content (endpoint inventory, topic inventory, table schema), match means same row keys with same values. For prose content (narrative, rationale), match means semantic equivalence (paraphrase OK, contradictory facts NOT OK).

#### Case B: Both passes produced content; content differs

Emit reconciled content + `⚠ drift` marker. Reconciliation rule:

- For factual content (schema, topics, endpoints): emit the **code** as the live state, plus a `> Drift note: SDD says X, code does Y.` Code is the truth-by-default for current state.
- For rationale / narrative content: emit the **SDD** rationale (which captures design intent) + `> Drift note: code reflects this differently - see [chunk:section-X] for the as-built behaviour.`
- For pattern application: emit both, attributing each to its source: `Designed: [pattern X per CLAUDE.md rule Y]. Built: [different pattern, or simpler/more-complex variant].`

#### Case C: Only from-code produced content; from-sdd was silent

Emit code-derived content + `🆕 code-only` marker + `> Drift note: present in code, not in SDD. Backfill SDD or remove?`

Common cases:
- A helper service exists in code that isn't named in the SDD's service decomposition.
- An additional Kafka topic exists for an internal optimisation not described in the SDD.
- A method on a controller that supports a feature flagged at the API gateway and not in the SDD's API list.

#### Case D: Only from-sdd produced content; code is silent

Emit SDD-derived content + `⛔ sdd-only` marker + `> Drift note: in SDD, not yet built. Schedule or defer?`

Common cases:
- An event topic the SDD describes but no producer code exists for.
- An API endpoint the SDD lists but the controller doesn't have it.

A service the SDD lists in §13 with no code at all is not Case D: it gets only the placeholder from `transform-detection.md` § Partial-code resolution, and its SDD content is not expanded in any chunk.

---

## Section-by-section diff rules

### `00-metadata.md`

- Direction field is `hybrid`.
- Changes Log entry: "Hybrid LLD generated; N drift markers, M code-only, K sdd-only - see 15-open-questions.md."

### `01-purpose-and-scope.md`

- Carry SDD content (purpose / scope are design intent, not code).
- Code-only services that aren't in scope per SDD → emit them with `🆕 code-only` flag.

### `02-context.md`

- Bounded context: SDD-derived.
- Cross-service dependency graph: emit the **code** version as live state. Mark services that exist in code but not in SDD with `🆕`. Mark services in SDD but not in code with `⛔` (in the diagram, render with dashed style).

### `03-architecture.md`

- Component topology: emit code as live state; mark drift inline.
- Architectural style: emit SDD as designed; mark `⚠ drift` if code's actual operationalisation differs (e.g., SDD says event-driven, code uses synchronous chained REST calls).

### `04-implementation/<service>.md`

This is where most drift will surface.

- Per-service file is generated only if the service exists in either source.
- If service exists in both: full hybrid content with subsection-level drift.
- If only in code: full code-derived content with `🆕 code-only` at the top.
- If only in SDD (the service has no code at all): the placeholder from `transform-detection.md` § Partial-code resolution, with `⛔ sdd-only` at the top. No class skeleton: code that does not exist is not designed here (run from-sdd for that). An SDD-only endpoint or event inside a built service is drift, marked in that service's file.

Subsection-level drift inside a per-service file:
- Class & Interface Map: emit code as live state; flag classes the SDD doesn't reference (`🆕`); flag SDD-described classes that aren't built (`⛔`).
- Design Patterns Applied: critical drift surface. SDD says Strategy, code uses if/else chain → `⚠ drift` with both views.
- Use-Case Workflows: similar drift surface for missing/extra steps, plus the use-case trace (§ Use-case trace drift below). The traceability line always cites the SDD and BRD values; a drift marker on the field shows what the code does.

### `05-data-model.md`

- ERD: emit code as live state.
- Tables: per-table comparison. Missing tables `⛔`, extra tables `🆕`, schema mismatches `⚠ drift`.
- Indexes: per-index comparison.

### `06-api-contracts.md`

- Endpoint inventory: per-endpoint comparison. Missing endpoints `⛔`, extra endpoints `🆕`, schema/auth mismatches `⚠ drift`.

### `07-event-contracts.md`

- Topic inventory: per-topic comparison. Same rules.

### `08-state-and-rules.md`

- State machines: emit code as live state if state machine is implemented; mark drift if SDD shows different states/transitions.

### `09-cross-cutting.md`

- Per concern: SDD specifies the default; code implements. Compare per-row.
- Idempotency on money writes: code MUST implement (CLAUDE.md hard rule). If SDD says yes and code doesn't → `⚠ drift` flagged HIGH severity.
- Outbox pattern: same, hard rule. HIGH severity drift when the code has no outbox recognised per `pattern-rules.md` § Outbox (atomic aggregate-and-outbox write plus a separate publisher), writes to the database and Kafka directly, or marks outbox rows processed without their target's acknowledgement.

### `10-operations.md`

- Config / metrics / logs / tracing: emit code as live state.
- Runbook procedures: emit SDD's skeleton + flag with `> Confirm: procedure described in SDD; verify against current code commands`.

### `11-security.md`

- Data classification: SDD-derived (intent).
- PII inventory: emit code as live state. Drift here is HIGH severity (PII handled differently than SDD specified is a compliance risk).
- Compliance: SDD-derived; flag drift if code lacks an enforcement point the SDD describes.

### `12-performance.md`

- SLO targets: SDD-derived.
- Caching strategy: emit code as live state. Drift if SDD specifies a cache the code doesn't have.
- Hot-path indexes: emit code as live state. Drift if SDD-recommended indexes are missing.

### `13-testing.md`

- Test pyramid: emit code as live state.
- Coverage: emit code measurements (if available) vs SDD-stated targets.
- § 16.8 E2E Spec Traceability: the specs and tags found in code, checked against the BRD (§ Use-case trace drift).

### `14-frontend.md` (if applicable)

- Component tree: emit code as live state.
- Pattern drift: emit per-component diffs.
- § 17.3 Routing: the routes found in code, each mapped to its BRD screen (§ Use-case trace drift).

### `15-open-questions.md`

This is the **drift index**: every drift marker placed elsewhere has a row here.

| Location | Marker | Summary | Severity | Recommended resolution | Why | Status |
|----------|--------|---------|----------|------------------------|-----|--------|
| `04-implementation/wallet-core.md § 7.4 Pattern: Outbox` | `⚠ drift` | SDD requires an outbox; code publishes to Kafka in the same method as the DB write (a dual-write, not an outbox) | High | Reconcile in code: write an outbox row in the aggregate's transaction and publish it from a separate publisher | CLAUDE.md makes the outbox mandatory; a dual-write loses or duplicates events on failure | Pending |
| `04-implementation/wallet-core.md § 7.2` | `🆕 code-only` | Class `LegacyAdapter` exists in code but not in SDD | Low | Investigate its origin, then backfill the SDD or remove it from code | Its business meaning is unknown | Pending |
| `04-implementation/notification-dispatcher.md` | `⛔ sdd-only` | Service in SDD §13 not yet built | Medium | Implement or defer | [Reason, e.g. its use cases sit in a later roadmap phase] | Pending |
| `04-implementation/refund-service.md § REFUNDS/UC-04` | `⚠ drift` | `@UseCase("REFUNDS/UC-03")` on `POST /v1/refunds/{refundId}/decision`, which SDD §7.3 lists under REFUNDS/UC-04 | Medium | Reconcile in code: fix the annotation | Triage by `use_case` misses this entry point's requests | Pending |

### `16-references.md`

- Carry SDD references; add code-derived references (repo URL, commit SHA at time of analysis).
- § 19.9 index: one row per SDD §7.3 row as usual; a row whose trace has drift names the marker in the affected cell.

---

## Use-case trace drift

The trace follows `sdd-to-lld.md` § Use-case traceability. SDD §7.3 and the BRD stay the reference: the LLD cites their values, and each place where the code disagrees is marked. Entry points and routes are matched per `code-extraction.md` § Tracing to BRD use cases.

| Situation | Marker | Default severity |
|---|---|---|
| A §7.3 entry point of an active in-scope use case has no code endpoint, listener, or job | `⛔ sdd-only` on the Entry points field | MEDIUM |
| A user-facing code endpoint matches no §7.3 entry point, is not a platform endpoint, and does nothing the BRD or SDD asks for | `🆕 code-only` + `> Drift note: behaviour no BRD use case covers? Open question, never a new UC.` | MEDIUM |
| Code names a different use case for an entry point than §7.3 (`@UseCase`, MDC key) | `⚠ drift` | MEDIUM |
| A code entry point matches a §7.3 entry point on method and path (or event / schedule) but sits in a different service than §7.3 names | `⚠ drift` on the Entry points field | MEDIUM |
| A route's `data.screen` or `data.useCases` disagrees with the BRD screen and its use cases | `⚠ drift` | LOW |
| An active use case with a screen the actor sees has no route in code | `⛔ sdd-only` on its § 17.3 row | MEDIUM |
| A spec tag names a use case or test case the BRD does not have | `⚠ drift` | LOW |
| A traced entry point with no `@UseCase` (or equivalent), or a route to a BRD screen with no route data | `> Confirm:` only, not drift: the code has not adopted the LLD convention yet | - |

A wrong value contradicts SDD §7.3 or the BRD, so it is drift. A missing one is an LLD convention not yet in the code, so it is a flag.

---

## Severity ranking for drift markers

| Severity | Examples |
|----------|----------|
| **HIGH** | Missing outbox pattern, missing idempotency on money endpoints, PII handling drift, multi-tenancy enforcement gap, RFC 9457 error model not implemented, SDD-mandated saga not implemented in cross-service flow. |
| **MEDIUM** | Different design pattern than SDD specified (but functionally equivalent), missing Resilience4j config on a downstream call, additional un-described Kafka topic, test coverage gap, a use case's entry point not built or tagged with the wrong use case. |
| **LOW** | Naming difference, additional helper class without business meaning, documentation gap, ordering of fields in DTOs, route data or spec tags out of step with the BRD. |

The severity is recorded in `15-open-questions.md` § 18.1. The skill computes a default severity per drift type; the reviewer can edit.

---

## When the diff is genuinely ambiguous

Some sections cannot be cleanly diffed (e.g., a free-form rationale paragraph). For these:

- Emit **SDD's version** as the designed intent.
- Emit **code's observed behaviour** as a `> Drift note: code does X - verify whether intentional drift or unimplemented requirement`.
- Severity: MEDIUM by default; reviewer can edit.

Never silently merge two contradictory paragraphs. The whole point of the hybrid direction is to surface drift, not paper over it.

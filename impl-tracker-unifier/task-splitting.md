# Task splitting

**LLD unit → task mapping**

Every unit kind below is read from its LLD home and gets at least one task; plan step 7's coverage check
proves it (SKILL.md § plan). A unit the LLD names with no home row or anchor is a `plan-gap` routed to
lld-unifier, never a guessed task.

| LLD source | Becomes | Layer |
|---|---|---|
| `05-data-model` table/migration group | one task per aggregate's tables | data |
| `05` § 8.5 migration row | owned by exactly one task: its aggregate's table task, or its own task when no table task fits | data |
| `7.2` Repositories | one task per repository (or merged with its table task if trivial) | data |
| `7.2` Domain types | merged into the first task that needs them | domain |
| `7.3` pseudocode block | one task per block | domain |
| `7.2` Service with no 7.3 block | one task per service | domain |
| `7.2` event listener or scheduled job (Controllers table) | one task each, or merged with its 7.3 block's task | events |
| any other `7.2` class (port, adapter, authorization component) | one task, or named in the task that builds its user | domain |
| `06-api-contracts` endpoint group | one task per controller | api |
| `07-event-contracts` event | producer task + consumer task (consumer depends on producer) | events |
| `7.4` cross-cutting pattern (outbox, idempotency, problem details) | one foundation task, before first user | foundation |
| `09` § 12.x filter or interceptor (§ 12.6 Filter chain) | one task per filter, before the first route it guards | foundation |
| `09` § 12.x limiter (a Filter chain row, or a limiter the section names) | one task per limiter | foundation |
| `09` § 12.7 masking component | one foundation task, before the first task that logs personal data | foundation |
| `10` § 13.2 probes (with `09` § 12.10) | one task per service's liveness and readiness checks | foundation |
| `14-frontend` route/screen (`MK-NN`) | one task per screen | ui |
| `14` § 17.3 route guard (Guards column) | one task per guard, before the first screen task whose route uses it | ui |
| Interim components table row (lld 04 § 7.2 Interim Components) | one task per row, Why "temporary, replaced by <task/slice>", plus the replacing task or a gap | per the row |
| `13-testing` e2e spec row | one task per spec, depends on all tasks realising that UC | e2e |
| shared-kernel / platform capability used by the feature | dependency on the PLATFORM task, never re-built | - |

## Slice placement (slice mode)

In slice mode (slice-rules.md) the layer order still sets dependencies **inside** a slice, but no phase holds
foundation work on its own:

- A foundation, data or shared-kernel/platform capability task joins the **first slice in the order** that
  needs it; later slices depend on it.
- Build only what that slice uses: a capability needed fully later is split (minimal part now, rest in the
  slice that needs it), each part with its own Why.
- A cross-feature need the other feature has not built yet → a small temporary task in this slice (stub or
  minimal store) with Why "temporary, replaced by <task/slice>", plus the replacing task or a gap.
- Each slice ends with its e2e spec task(s), which depend on every task of the slice.

**Sizing:** a task must fit one agent session: ≤ ~400 changed lines, ≤ 1 aggregate, clear DoD.
Bigger → split by AC or by alternate flow (A1, E1 …). Trivial (< ~30 lines) → merge into neighbour.

**Isolate hard logic.** Risk-`high` timing, concurrency or state logic (idle and session timers, countdowns,
retries and polls, locks and claims, job state transitions) is its own task, never folded into a screen or
endpoint task. It owns the logic unit (service, store, timer class), its Goal names its invariants, and its
`## Design check` (SKILL.md `start` 3c) carries the state/timing table; the screen task depends on it and
only wires it. (Source: PLATFORM/T-018 failed three audits on an idle timer built inside its shell screen.)

**Dependency derivation, in order:**
1. Layer order: foundation → data → domain → api/events → ui → e2e.
2. Data dependency: anything using a table/type depends on the task owning it.
3. LLD-stated order (pseudocode calls, sequence diagrams in `flows/`).
4. Roadmap phase: a task never depends on a later phase.
5. Cross-feature: `INT-NN` links → depend on the other key's task; if not planned there → gap
   `missing-dep`.

**Why rules: every task's "Why this way" must say at least one of:**
- the LLD pattern / ADR / decision-log entry it follows (linked);
- the BRD rule (BR-n) or NFR that forces the shape;
- what is deliberately **not** built here and in which task/phase it is (prevents double build);
- if none applies: "Straight implementation of LLD <anchor>; no alternative considered in the docs."

## Risk

Every task card has `Risk`: `low` or `high`, with a short reason. It sets audit depth (audit-rules.md § 1),
never the gates.

- `high` when the task touches any of: encryption or keys, authentication/authorization, concurrency
  (locks, caches, claims, queues), sending or money (submissions, replies, caps), consent, personal data
  writes, data deletion or retention, migrations that change existing data, external adapters with
  side effects.
- `low` otherwise: read-only endpoints, stubs and ports, additive migrations of new tables, UI that only
  displays, docs-only tests.
- Unsure → `high`. A task becomes `high` when its diff turns out to touch any item above; pre-flight P9
  enforces this mechanically. Only the user can lower `high` to `low`, quoted on the card.

Test-only files (`src/test/`, `e2e/`, `*.spec.ts`, `playwright.config.ts`) never raise Risk: an e2e task is
`low` unless it changes production code; pre-flight P9 ignores those files.

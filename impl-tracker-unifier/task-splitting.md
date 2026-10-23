# Task splitting

**LLD unit → task mapping**

| LLD source | Becomes | Layer |
|---|---|---|
| `05-data-model` table/migration group | one task per aggregate's tables | data |
| `7.2` Repositories | one task per repository (or merged with its table task if trivial) | data |
| `7.2` Domain types | merged into the first task that needs them | domain |
| `7.3` pseudocode block | one task per block | domain |
| `7.2` Service with no 7.3 block | one task per service | domain |
| `06-api-contracts` endpoint group | one task per controller | api |
| `07-event-contracts` event | producer task + consumer task (consumer depends on producer) | events |
| `7.4` cross-cutting pattern (outbox, idempotency, problem details) | one foundation task, before first user | foundation |
| `14-frontend` route/screen (`MK-NN`) | one task per screen | ui |
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

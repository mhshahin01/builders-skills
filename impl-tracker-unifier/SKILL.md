---
name: impl-tracker-unifier
description: >-
  Track implementation against the BRD, SDD and LLD. Use to plan implementation, split a feature into tasks,
  pick what to build next, start or finish a task, log a bug or gap, audit consistency, record a lesson or
  direction change, write a standup, show progress, or check doc/code drift. Splits each LLD into keyed tasks
  citing BRD use cases and ACs, blocks tasks with unmet dependencies, maps existing code to the LLD and
  prevents double builds. A pre-flight script and a fresh read-only auditor check each task before Done.
  Lessons and direction changes are replayed before matching tasks. Doc points are queued as doc updates and
  applied by a background doc worker. Commands: init, plan, next, wave, start, done, audit, discover, verify,
  gap, lesson, change, standup, status, sync, slice, report, docs. Writes ./tracking/ only.
---

# Implementation Tracker

The seventh stage of the documentation chain:

    SoW → BRD → Pre-SDD → SDD → LLD → **impl-tracker** → code

It turns an approved LLD into an ordered, dependency-checked task ledger, keeps that ledger true while
code is written, and reports the gap between what the documents require and what the code does.

You act as the Developer / software engineer (Software Development & Delivery) in the unifier company.

It **never edits** BRD, SDD or LLD files itself. Every doc point becomes a gap row **and** a doc update
(`KEY/DU-NNN`), triaged to the docs it affects and applied in the background by a separate doc worker that
uses the owning skill (brd-unifier, pre-sdd-unifier, sdd-unifier, lld-unifier) - doc-impact-rules.md.

Support files (paths relative to this skill folder):

| File | Holds |
|---|---|
| `templates.md` | Exact templates for every file in `./tracking/` |
| `task-splitting.md` | How LLD units become tasks, sizing, dependency derivation, the "why" rules |
| `status-rules.md` | Task states, legal transitions, blocking and override rules |
| `gap-rules.md` | Gap types, severity, owner routing, closing rules |
| `sync-and-drift.md` | Doc-version baseline, stale detection, code-ownership checks |
| `discovery-rules.md` | Inventory of existing code, matching it to LLD units, Adopted status, re-inventory on sync |
| `slice-rules.md` | Slice mode: end-to-end slices, user-chosen order, current slice, delivery gate, manager report |
| `doc-impact-rules.md` | Doc updates: triggers, code-or-doc decision, impact level (LLD/SDD/BRD/SoW), queue, background doc worker, verifier, auto sync, gates |
| `lessons-rules.md` | Lesson capture, valid-lesson format, dedup/recurrence, promotion, recall; change log |
| `audit-rules.md` | The auditor subagent, layer matrix, tool evidence, verdicts, auditor prompt, clean export, parallel audits |
| `scripts/preflight.py` | Pre-flight: the mechanical checks run before any audit (tree, trailers, status, Owns, tests, stack, lesson checks) |
| `scripts/history.py` | `--history` / `--history-start`: rebuilds `tracking/history.md` (time per task, over-threshold signals, problems, root-cause counts) from recorded facts only |
| `hooks/stop-audit-guard.js` | Optional Claude Code Stop hook: blocks ending a turn while a task is `In review` without a passing audit |

---

## Running outside Claude Code

| Written as | Outside Claude Code |
|---|---|
| `CLAUDE.md` defaults | The project instruction file (`AGENTS.md`, or `CLAUDE.md`). |
| `AskUserQuestion` | Ask in chat: numbered questions with options, recommendation first. Wait. |
| `Agent` tool | Used by `plan deep` and by the audit. Otherwise run the step yourself as a separate pass that starts from the fixed inputs only. |
| Invoking | Claude Code `/impl-tracker-unifier <cmd>`; Codex `$impl-tracker-unifier <cmd>`; Kimi `/skill:impl-tracker-unifier <cmd>`. |

---

## Argument parsing: do this first

`impl-tracker-unifier <command> [target] [flags]`

| Command | Target | Does |
|---|---|---|
| `init` | - | Create `./tracking/` and `config.md`; detect doc roots and feature keys; inventory existing code. |
| `discover` | `[KEY]` | Re-scan the code; match new/changed items to tasks; open gaps (discovery-rules.md). |
| `plan` | `KEY` or `KEY/UC-NN[,…]` or `KEY/P2`; flags `slice`, `reslice` | Split the LLD (and its BRD/SDD links) into tasks for that scope; with `slice`, group them into ordered end-to-end slices (slice-rules.md); `reslice` regroups existing tasks. |
| `next` | `[KEY]` | Show the next ready task(s), with why it's next. |
| `wave` | `[KEY] [n]` | Pick up to n (default 4) ready tasks that can be built together; start them on approval. |
| `start` | `KEY/T-NNN` | Check readiness and ownership; set In progress; print the task brief. |
| `done` | `KEY/T-NNN[,KEY/T-MMM…]` | Pre-flight, then one fresh audit per task (in parallel for several); set Done; unblock dependents. |
| `audit` | `KEY/T-NNN`, `KEY/UC-NN` or `KEY` | Run the consistency auditor (audit-rules.md); write the report; open gaps and lessons. |
| `verify` | `KEY/T-NNN` or `KEY/UC-NN` | Check BRD ACs and e2e spec tags against code/tests; set Verified or open gaps. |
| `gap` | free text or `KEY/GAP-NNN close` | Log, update or close a gap. |
| `lesson` | free text, `list [scope]`, or `L-NNN retire <reason>` | Record, list or retire a lesson (lessons-rules.md). |
| `change` | free text | Record a direction/use-case/decision change; mark affected tasks Stale; create rework tasks. |
| `standup` | `[date]` | Write today's journal: done since last, next, blockers, new gaps. |
| `status` | `[KEY]` | Progress by feature/phase/UC; open gaps; blocked chain. |
| `sync` | `[KEY]` | Compare doc versions with the baseline and owned files with the code; mark Stale; open gaps. |
| `slice` | `deliver KEY/S-NN`, `list [KEY]`, `order KEY` | Slice mode: run the delivery gate, list slices, or change the order (slice-rules.md). |
| `report` | `[KEY]` | Manager-ready summary: delivered slices, current slice, next, blockers (slice-rules.md § 6). |
| `docs` | `[KEY]`, `run`, `approve KEY/DU-NNN`, `reject KEY/DU-NNN <reason>` | Doc updates (doc-impact-rules.md): show the queue, dispatch the worker now, or decide a `Waiting-decision` DU. |

No command → ask once: "What do you want: next / standup / status / plan / start / gap?" with `next`
as the default.

Flags: `deep` (plan only: one sub-agent per UC block), `dry` (show changes, write nothing),
`agent=<name>` (attribution; default: the running agent's name, e.g. `claude-opus-5-5`, `codex`, `human`).

Natural language maps to commands: "what's next" → `next`; "do several at once / be faster" → `wave`; "I'm starting X" → `start`; "finished X" →
`done`; "found a bug" → `gap`; "check it's all consistent" → `audit`; "you did this wrong / remember this" →
`lesson`; "we changed the use case / let's do it another way" → `change`; "why is it like this" → `changes.md`; "what did we do yesterday" → `standup`; "where are we" → `status`; "feature by feature / end to end / slices" → `plan KEY slice`; "I finished X e2e / deliver it" → `slice deliver`; "what do I tell my manager" → `report`; "update the docs / are the docs in sync" → `docs`.

---

## Workflow per command

### init

1. Ask (one question block) for: code repo root (default: cwd), docs root (default: find
   `tech/features-map.md`), and the feature keys to track. Detect keys from BRD folders and
   `features-map.md`; propose them.
2. For each key, locate BRD master, SDD master (§7.3), LLD master, LLD `04-implementation/`,
   `13-testing.md` § E2E Spec Traceability, `17-specs.md` § Roadmap. Record paths in `config.md`.
3. Write `tracking/config.md` (incl. § Audit checks: detect migration tool, API spec, test, lint commands
   from the repo and propose them), empty `index.md`, `gaps.md`, `ownership.md`, `lessons.md`,
   `changes.md`, `doc-updates.md`, `journal/`; config § Doc updates with the defaults (LLD/SDD `auto`,
   BRD/SoW `ask`) and the docs repo path (doc-impact-rules.md § 4), and the `Board` row: `<docs root>/unifier-status.md` (§ The tracker's board row).
3b. **Inventory existing code** (discovery-rules.md § 1) → `tracking/inventory.md`. Print counts by kind
   and key guess ("found 14 endpoints, 6 screens, 9 migrations"). Nothing is marked done here.
4. Install the Stop audit hook (audit-rules.md § 7) in the code repo's `.claude/settings.json`: ask once, then
   merge it into existing `hooks.Stop` (create the file if missing; never drop other settings or hooks;
   skip if the same command is already there).
4b. Offer the post-commit lint hook (`hooks/post-commit-lint.sh` → the repo's `.git/hooks/post-commit`; ask
   once, never overwrite an existing hook): after every commit it lints the commit's `Task:` and prints only
   FAIL rows, so paperwork is fixed at commit time, never found by a pre-flight. It never blocks a commit.
5. Add the agent rules block (templates.md § Agent rules block) to `AGENTS.md` / `CLAUDE.md` of the
   code repo, if the user agrees.

### plan

Follow `task-splitting.md`. In short:

1. Read config → the LLD master + the scoped `04-implementation/*` workflow blocks, `05-data-model`,
   `06-api-contracts`, `07-event-contracts`, `14-frontend` routes, `13-testing` e2e table,
   `17-specs` Roadmap. Read BRD use cases **only by the anchors the LLD links**.
2. Record the **baseline**: BRD, SDD, LLD versions from their master/cover headers.
3. Extract LLD units; map each to tasks (one unit → one task, split if over size, merge trivial ones).
4. Derive dependencies (layer order + LLD-stated order + cross-feature `INT-` links).
5. Apply lessons (lessons-rules.md § 5): Promoted-DoD lessons → DoD items; skip anything superseded in
   `changes.md`.
5b. For each task write the **Why** (task-splitting.md § Why rules) - cite the LLD pattern/ADR/BR.
5c. **Match existing code** (discovery-rules.md § 2): each unit → Match (`Adopted`), Partial
   (`In progress` + missing list + gaps), Missing (`Planned`); unclaimed inventory items → `untracked-code`.
6. Run the ownership check: nothing owned twice (across all features).
7. Run the **coverage check**: every in-scope UC, every AC, every e2e spec, every migration,
   every endpoint in scope has ≥ 1 task. Missing → `GAP` type `plan-gap` (the LLD has no unit for it)
   or task added.
8. Show the plan summary (phases, counts, DAG Mermaid, gaps, **existing-code match table** with
   confidence - discovery-rules.md § 3, and the **risk table**: each task's Risk with its reason,
   task-splitting.md § Risk) and **ask for approval** before writing
   task cards. On approval write `KEY/plan.md`, task cards, update `index.md`, `ownership.md`.

**Slice mode** (`plan KEY slice` / `reslice`, or `Mode: slice` in config): after step 5c, group the tasks into
slices and check slice order per slice-rules.md § 3; step 8 shows the slice table first and asks for the
grouping and the order; on approval also write the slice cards and `config.md` § Slices.

Re-running `plan` on a planned scope is a **re-plan**: it diffs against existing tasks, never renumbers,
never deletes (unused tasks become `Dropped` with a reason), and keeps all status/evidence.

### next

1. Read `index.md` only.
2. Ready = status `Planned` or `Adopted` (Adopted first: it only needs an audit) and all `depends_on` are `Done`/`Verified`, not `Stale`, phase ≤ current
   phase in `config.md`.
2b. Slice mode: only tasks of the **current slice** are candidates (slice-rules.md § 4).
3. Order: current phase → critical path length (most dependents first) → foundation layer first →
   lowest ID. Also put open `blocker`-severity gaps first if they have a fix task.
4. Print top 3: ID, title, why next (one line), what it unblocks. Offer `start` on the first.

### wave

Builds several tasks in one pass without loosening any gate.

1. Read `index.md`, `ownership.md`. Candidates = tasks that pass the `next` readiness rule (in slice mode:
   current slice only).
2. Pick tasks in `next` order such that: no two share an owned item (ownership.md); none depends on
   another in the set; at most one is risk `high` unless the user asks for more; total size ≤ 3 M
   (S = ½, M = 1, L = 2), so the wave fits one session. Default at most 4 tasks; **at most 2 when the
   current slice is mostly `high` risk** (e.g. auth, money, personal data) - short waves get audit
   feedback sooner. "Mostly" = more than half of the slice's open (not Done/Dropped) tasks are risk `high`.
3. Show the set (id, title, risk with reason, owned files, why grouped) and ask once for approval.
4. On approval, for each task **in turn**: run `start` (all gates; this records the task's **own** start
   commit, so no two wave tasks share one), implement it, commit it (one or more commits, **each with
   exactly one `Task:` trailer**, never two tasks in one commit), then go to the next task. A task that
   needs to change a file outside its Owns declares it under `## Touches` with the reason, or stops and
   becomes a gap. Never sit idle on a long run: while one task's pre-flight or audit runs (minutes), read
   and design-check the next task; commit only one task's files per commit.
5. Finish with `done KEY/T-a,KEY/T-b,…`.
6. **Bookkeeping once per wave:** during the wave write only what a gate needs (card status, History row,
   audit/pre-flight links). Journal entry, minor-finding gaps, lesson dedup/promotion, `checks.json`
   and `index.md` regeneration are done once, after the last verdict of the wave. A FAIL's blocker/major
   gaps and its lesson are still written at once (rule 7).

### start

1. Read the task card + `index.md` + `ownership.md`.
2. **Readiness gate** (status-rules.md § Gate): every `depends_on` Done/Verified; task not Stale;
   no open `blocker` gap linked to it; for risk `high`, no open `plan-gap`/`doc-gap` or LLD open item
   (OI) on an anchor the task cites - settle the doc first, so the design does not move mid-task (PLATFORM/T-055
   waited on LLD v1.3 then v1.4 mid-build); no open DU on a cited anchor per doc-impact-rules.md § 9. If it fails: refuse, print the blocking chain down to the first
   ready task, and offer to start that one. Override only per status-rules.md § Override.
3. **Double-build gate**: grep the code repo for each owned symbol/table/route/file. Exists already →
   stop and ask: is it the same thing (then link it, maybe the task is already done) or a clash (gap
   `double-build`). Also grep `changes.md`: an owned item removed/replaced by an active CHG → stop, show it.
3b. **Re-check Risk** against task-splitting.md § Risk with the card's Goal and Owns; a plan default is
   never final. Raise to `high` if any high-risk item applies; record the reason on the card. Lowering
   `high` → `low` needs the user's own words, quoted on the card (`low (user: "<quote>", <date>)`).
3c. **Design check (risk `high` only, before any code).** Write `## Design check` on the card:
   - **Invariants**: the rules the code must never break, each with its doc anchor (for example "no
     automatic request carries the user-action marker", "a pending account survives every job").
   - **State or timing table**: every state, event and clock the task touches, including the other side's
     rule (server throttle, job predicate, retry), and what the code does in each cell.
   - **Neighbour scan**: grep the jobs, filters, listeners and handlers that select, change or delete each
     state, table or route the task creates or changes; list each with its predicate (L-034). Search
     `src/main` **and** `src/test`: a new bean, table or route also has test-side users (L-061). Once the
     migration is written, `--lint` prints **P16**: every test class that names a table the migration seeds or
     alters (a test pinning a row count, PLATFORM/T-029); copy that list into the scan. For a route the task
     adds, the scan also names every filter, interceptor and profile condition on its path, the content type the
     caller really sends, who binds `CallerContext` when no session does, and, for a caller that retries (provider
     callback, job), which status makes it retry and which makes it give up (SHAREDKERNEL/T-010: SNS treats 409 as final).
   - **Contract check**: everything the code needs from an API or event is in the LLD contract. If not,
     stop: open a `plan-gap` with its DU (kind `contract`, doc-impact-rules.md § 1) before coding; the DU is
     dispatched at once and the task waits for it (§ 9) while the tracker offers the next ready task. A
     contract between services is level `SDD` or above.
   - **Test plan from the rules**: which fakes or models stand in for the other side and how each answers
     by the real rule (L-035). For every claim, lease or fencing token: a test where the stale holder
     finishes while the new holder is still mid-flight, and the token conjunct on its own line so
     `## Removals` can delete it (L-062). Number the invariants `I1…In`: each gets a guard line in
     `## Removals` tagged `(In)` against the test that exercises it (for a race or at-most-once rule, the
     interleaving test), or `- In: no guard line: <reason>`. P14 fails an untagged invariant (also in `--lint`),
     so a test that passes with its mechanism removed is found by `--removals`, not by the audit (T-008, T-009,
     PLATFORM/T-029 audit 1).
   Then one fresh reviewer (Agent tool, `general-purpose`, faster model, about 5 minutes, read-only) checks
   the design check against the cited docs and returns missing invariants, cells or neighbours. Fix and
   record "design check: reviewed" in History. It never replaces the audit.
3d. **Lint at start (seconds):** run `preflight.py … --task KEY/T-NNN --lint` now, so Owns paths, Risk
   floor and card/index mismatches are fixed before any code, not found at `done`. Re-lint after every
   commit (the post-commit hook does it when installed): a pre-flight must never be the first to find
   paperwork. Also run `preflight.py --tracking <t> --doctor` (seconds) when the task has tests.
3e. **Fresh stack (tasks with e2e or integration tests):** any local service (API, worker, dev server)
   started before the current head commit is restarted now, as part of bringing the environment up
   (audit-rules.md § 3a); never mid-task, never by asking the user.
4. Set `In progress`, `agent`, `started`, **start commit** (`git rev-parse HEAD`); append to today's journal.
   Stamp the start clock: `python <skill>/scripts/preflight.py --tracking <tracking> --history-start KEY/T-NNN`
   (writes `history-clock.json`, used by `history.md` for the task's span; run once, a second run keeps the first).
5. Print the **task brief** for the implementer: Goal, Why, Doc refs (links), Owns, **Layers to touch**
   (API / DB / UI / logs / security - derived from the LLD, each with its doc anchor), **Lessons that
   apply** (lessons-rules.md § 5, with their Checks), the **Design check** (high risk), Definition of done,
   Tests to write - nothing else.

### done

Accepts one or several ids: `done KEY/T-a[,KEY/T-b…]`. Every step runs per task.

1. Collect evidence: commits with `Task: KEY/T-NNN` (git log), changed files, unit tests added.
   A Partial task with no start commit first runs `start` steps 1-4 (gates, start commit) - never a
   hand-picked start sha.
1b. **Bring the test environment up:** `preflight.py --tracking <t> --doctor` (seconds). It starts Docker
   when down (never installs or reconfigures it), recreates a missing verify worktree, checks Node against
   every `engines.node`, and checks the shared test database's connection headroom (classes × pool under
   80% of `max_connections`). Start the local compose stack if the project has one. Any doctor FAIL → fix it
   before pre-flight; never ask the user first. The full pre-flight also runs the doctor first, and **fails
   fast**: when a doctor, paperwork or lint row fails, it skips the suites (seconds, no report written)
   instead of spending minutes on tests whose result cannot count.
1c. **Lint first (seconds).** `python <skill>/scripts/preflight.py --tracking <tracking> --task KEY/T-NNN --lint`
   runs every check except tests and the stack, accepts uncommitted work, and prints ready-to-paste
   `## Touches` lines for files outside Owns. Fix everything it reports before the full pre-flight: Touches
   paths, Risk floor, trailers, card/index status, lesson coverage (`checks.json`). It writes no report, ends with
   `LINT: PASS|FAIL`, and never stands in for the pre-flight. Lint fails on an uncommitted doc or binary
   (`.md`, `.pdf`, images, Office files): commit it now, never after `--removals`.
1d. **Quick tests (about two minutes).** `python <skill>/scripts/preflight.py --tracking <tracking> --task KEY/T-NNN --quick`
   runs the tests a task can break, in one run per build module: its own test classes, config.md
   `## Always-run tests` (architecture rules, schema gates), the test classes that name a table its migrations
   seed or alter (P16), and the covering tests of its changed classes (those naming them or in their package).
   P12 also names any test that still pins a schema's previous highest migration. Green here before `--mutate`,
   `--removals` or the full run. Every full-suite failure so far (T-006 pinned version, T-007 second bean, T-009
   ArchUnit, T-029 pinned row count) sat in this set.
   **Fast path, in this order, each once (target: one full pre-flight, one audit):** lint → `--quick` →
   `--mutate` (fix or list every survivor) → commit everything (code, docs, binaries: tree clean) → `--removals`
   on the final code → full pre-flight → audit. The removals report stays valid until production code, a build
   file or a test it names changes; a fix to another test (a neighbour's pinned count) or to docs keeps it.
   The full run reuses the `--mutate` result while the code equals what `--mutate` ran on, so mutation runs once.
2. Check: every owned item exists in code; DoD checklist ticked. Missing → stay `In progress` and list
   what's missing, or the user splits it (new task, `depends_on` this one).
2a. **Self-replay lessons.** Every lesson created or hit during this task, and every lesson in the brief,
   is checked against **every class in the task diff**, not only the class that triggered it. Record the
   result per lesson in the History row (for cache or concurrency lessons: each cache field and the test
   that covers it).
2a+. **Builder self-check (≈ 2 min, before pre-flight).** Answer each with file:line, fix any "no":
   every new class/function has a test; every external call (HTTP, key fetch, queue, mail) has a timeout
   and a tested failure path; every retry/idempotency rule in the LLD is kept on retry; UI copy matches the
   Figma frame / BRD text word for word; every item on the task-splitting.md § Risk `high` list in the
   diff has its LLD check (authZ, ownership, session/token end, clock source); errors logged once, no
   PII; every outcome value the code computes is asserted by a test, including one seen only in a log line
   (11 of 15 first survivors in SHAREDKERNEL/T-010), so `--mutate` runs once. Record "self-check: OK" or the fixes in the History row. The self-check is never audit evidence;
   it is not passed to the auditor and never replaces pre-flight or the audit.
   **Removals are done, not claimed:** list each Design check guard under `## Removals` as
   `` `file` `guard code` → `Test#method` `` (a line that can go alone: a call, a `throw`, a `return`; add
   ` @N` for the Nth identical line), then run
   `python <skill>/scripts/preflight.py --tracking <tracking> --task KEY/T-NNN --removals`: it runs the named
   tests on the unchanged code (positive control), deletes each guard line, expects its tests to fail,
   restores the file byte for byte and writes `<T-NNN>-removals.md`. In a Maven module that can be copied
   alone it runs the control and the guards side by side in private copies of the module (`--jobs`, default 4;
   the working tree is never edited); anything else runs in place, one at a time. A "never" rule needs a
   recorder test with a positive control (L-059). Pre-flight P14 fails a card with a Design check whose
   invariants are not all tagged (3c), or with no passing removals report for every listed guard, or when
   production code or a named test changed since that report.
2a++. **Local mutation (minutes, before the first full pre-flight; L-060):**
   `python <skill>/scripts/preflight.py --tracking <tracking> --task KEY/T-NNN --mutate` runs mutation on the
   task's changed classes (uncommitted work included) against the task's own test classes only (PIT
   `-DtargetTests`), and prints each survivor with its code ready to paste under `## Equivalent mutants`.
   It is stricter than the full run (only the task's tests may kill a mutant). Fix or list every survivor,
   then run the full pre-flight once. Its raw result is kept with the code tree it ran on (uncommitted work
   included); the full run reuses it while the code is the same and it passes against the cards (P10 row
   `reused from --mutate`), so a fix found here never costs a second mutation run. Record "local mutation:
   N classes, 0 survivors / listed" in the self-check row.
2b. **Pre-flight (mandatory before any audit that can set a task Done):**
   `python <skill>/scripts/preflight.py --tracking <tracking> --task KEY/T-a [--task KEY/T-b …]`.
   It checks: clean tree; commits (start commit, exactly one `Task:` trailer each); card/index status;
   every owned item; **P14** removals report current and passing; **P15** every DU the task raised is listed
   on its card, none Failed, a `contract` DU Verified, every doc-owned gap has a DU (also in `--lint`); **P12** an added migration is above every version present at start (L-014); **P13** no
   second bean of a single-instance type (AWS clients, `HttpClient`, `JsonMapper`…; L-061) - both also in
   `--lint`; **P10 mutation** on the task's changed production files (templates.md § Mutation
   suites: every surviving mutant gets a test or a reasoned `## Equivalent mutants` line - fix these here,
   never leave them for the audit); **P11 template bindings** (each behaviour binding the task adds to an
   `.html` template is mapped under `## Template bindings` to a spec test that exists; also in `--lint`);
   every required test suite (counted by `<testcase>`; any skip, failure, error, zero
   tests, or fewer tests than last time fails); the local stack; every lesson's check (each Active lesson
   must be covered); task isolation (files changed only within Owns or `## Touches`); and the risk floor
   (a `low` task touching high-risk code fails). FAIL → fix and re-run; no audit until it passes.
   Required suites run in parallel (backend beside frontend, each Angular project its own suite); every
   suite row ends with its time in seconds, so the slow suite is visible. Beside them, each in a private copy of
   the Maven module (the backend suite starts with `clean`): the `--quick` set as **P5 related tests**, whose
   failure stops the suites at once (a failing run ends in about two minutes, not after the whole suite), and a
   Maven mutation suite the `--mutate` result does not cover. **P16** (INFO) lists the migration neighbours.
   It writes `tracking/KEY/preflight/T-NNN-<sha>.md`; **link** that file from the History row (don't paste
   the table). Adopted tasks run the same command (Adopted mode is automatic: no commit checks).
   **Where it runs:** in the permanent verify worktree named in `config.md` § Verify worktree when one is
   set, moved by the routine in templates.md § Verify worktree (detach to the head, clean everything but
   `node_modules`, `npm ci` only when `package-lock.json` changed), so a live IDE or dev server in the main
   checkout is never disturbed and installs are not repeated (L-028). Copy the report back into the main
   tracking folder before committing it.
3. Set `In review`. **Run the audit** (audit-rules.md) - mandatory; an agent cannot skip it, only the user
   in chat (then record `audit skipped by user: "<quote>"` in History and open a major gap). Launch the auditor
   with `run_in_background: false`: the turn waits for the verdict and goes straight on to Done.
   - The audit runs on a **clean export** of the task's last commit (audit-rules.md § 1a), never on the
     working tree, and sees **only this task's commits** (§ 1, input 3).
   - **Depth follows the task's Risk** (audit-rules.md § 1): `high` → strongest model, full prompt;
     `low` → faster model, focused prompt; missing or unclear → `high`.
   - **Several tasks:** one fresh auditor per task, launched together in one message (foreground, not in
     the background), at most 2 at once when their tests start containers. Each gets only its own task's
     inputs and writes its own report and verdict.
   - After every audit, **including a stopped or failed one**, run `git status` on the code root and revert
     anything left behind before the next commit.
3a. **Recompute the verdict** (audit-rules.md § 4): an incomplete reply or `RISK: high` is no verdict
   (re-run at high); any blocker or major, any LAYERS row marked FAIL or without evidence, is FAIL,
   whatever the auditor wrote. Line 1 of the report carries the recomputed verdict.
4. PASS / PASS-minor → set `Done`, record evidence + audit report + pre-flight report links; recompute
   readiness of dependents and print which became Ready. FAIL → back to `In progress`, print the findings
   as a fix list, open gaps, capture lessons; re-run `done` after fixing (re-audit only the failed tasks,
   as a **delta re-audit**, audit-rules.md § 1c, in the reused export).
4a. **History.** After the verdict (PASS or FAIL), rebuild `tracking/history.md`:
   `python <skill>/scripts/preflight.py --tracking <tracking> --history` (seconds, no tokens; in a wave, once after
   the last verdict). Never edit `history.md` by hand and never add problems, causes or recommendations to it: it
   holds only what git, the clock, the cards, the reports, lessons.md and gaps.md record (scripts/history.py).
4b. **Delivery.** Commit the tracking update with the task trailer. Push automatically only when
   `config.md` § Delivery reads `auto (user: "<quote>", <date>)` **and**
   `preflight.py --tracking <tracking> --push-check` passes (every code commit to be pushed carries exactly
   one `Task:` trailer of a Done task; a commit that changes only tracking files never blocks and carries a
   `Tracking: <reason>` or its task's `Task:` trailer; one with neither prints a WARN to fix next time).
   With `auto` per wave: push once after the wave's last task is Done. Otherwise ask once per batch.
5. Anything found while doing it that is out of scope → offer `gap`. Any error hit twice in this task, or a
   user correction during it → capture a lesson now. Every doc point found during the task or its audit
   (an LLD silence filled, a contract field, a doc conflict) → gap + DU now (doc-impact-rules.md § 1); it is
   dispatched in the background and never waits for Done.

### slice

Follow `slice-rules.md`. `slice deliver KEY/S-NN` runs the § 5 gate (incl.
`preflight.py --tracking <t> --slice KEY/S-NN` and the slice's e2e specs) and sets `Delivered`; `slice list`
prints slices in order with status and task counts; `slice order KEY` asks the user for a new order and
records it with their quote.

### report

slice-rules.md § 6. Reads `index.md`, slice cards, `gaps.md` only.

### verify

1. For each BRD AC/BR the task (or UC) cites: find the test that proves it - unit test comment tag,
   e2e tag `@KEY/UC-NN`, `@KEY/TC-…` as `13-testing.md` defines.
2. All proven and passing and no open DU on a cited anchor → `Verified`. Unproven AC → gap `untested-ac`.
   Behaviour differs from the AC → doc-impact-rules.md § 2 decides: `code-drift` (fix task) or `doc-update`
   (gap + DU).

### audit

Follow `audit-rules.md`. Standalone on a task that is not Done yet: run pre-flight first (`done` step 2b).
Standalone on a UC or key it audits every Done task in scope plus the end-to-end
trace; FAIL on a Done task → `Done` becomes `In progress` (reopened → lesson).

### lesson

Follow `lessons-rules.md` §§ 2-4: classify root cause, write Rule + Check + Scope, dedup, handle recurrence
and promotion. The `checks.json` entry is written in the same step as the lesson (rule 1a).
`lesson list [layer|key|tag]` prints matching Active/Promoted lessons.

### change

Follow `lessons-rules.md` § 6. Needs a user quote or doc version as the decider; otherwise ask.
Marks affected tasks, supersedes old decisions/lessons, creates rework tasks, queues a DU (kind `direction`,
decided by the CHG's quote) for every doc the change affects.

### gap

Follow `gap-rules.md`: classify type and severity, link to task/UC/doc anchor, route the owner
(code fix → new task; doc fix → a DU in the same step, doc-impact-rules.md), write to `gaps.md`. Closing needs evidence. Closing a gap of
type bug / code-drift / layer-miss / obs-gap / double-build / untracked-code → capture its lesson.

### docs

Follow `doc-impact-rules.md`. Every command first checks `doc-updates.md`: `Queued` rows and no live worker →
dispatch (§ 6); a worker or verifier that reported → process it (§§ 7-8). `docs [KEY]` prints the queue by
state and the doc-drift count (§ 11). `docs run` dispatches now. `docs approve KEY/DU-NNN` applies a
`Waiting-decision` DU (the user's word is its decider, quoted); `docs reject KEY/DU-NNN <reason>` sets it
`Rejected` and turns its gap into `code-drift` when the code must change instead.

### standup

1. Read the last journal entry, `index.md`, `gaps.md`, and `git log --since=<last entry>`.
2. Write `journal/YYYY-MM-DD.md`: Done since last (by agent), In progress, Next (from `next`),
   Blockers (blocked chains + blocker gaps), New/closed gaps, Commits without a `Task:` trailer
   (untracked work → ask which task or open one), Audits (verdicts since last), New lessons and recurrences,
   Changes (CHG rows since last), Doc updates (verified since last, open by state; `Waiting-decision` under
   Needs your decision).
3. Print it short. Offer the top decision if one waits on the user.

### status

`index.md` + `gaps.md` + `doc-updates.md` only → table per feature: phase, tasks by status, % Done/Verified by UC,
doc drift (doc-impact-rules.md § 11),
% existing-but-unaudited (Adopted) shown separately - never counted as done,
blocked chains, open gaps by severity. Mermaid progress optional.

### sync

Follow `sync-and-drift.md`: doc version bump → find changed anchors → mark citing tasks `Stale`
(Done ones become `Done-stale`) and open `doc-changed` gaps, except anchors a DU changed for the task that
raised it (doc-impact-rules.md § 8); owned files missing or moved → `code-drift`;
code with no owning task (new top-level classes, migrations, routes) → `untracked-code`. Then re-run the
inventory and diff it (discovery-rules.md § 5).

### discover

Inventory + diff + match only (discovery-rules.md §§ 1, 2, 5); proposes Adopted/Partial changes and gaps,
asks before writing.

---

## The tracker's board row

The tracker runs in the code repo, and the status board lives in the docs root.

- **Path:** `<docs root>/unifier-status.md`, taken from the `Board` row `init` records in `tracking/config.md`. The docs root may differ from the folder holding the hop folders; the tracker then uses the recorded path as written.
- **Its row:** the tracker writes only the row whose Skill cell is `impl-tracker-unifier`, at each stop (the end of a command, a gate stop, a handoff, a wait): State, Version (the doc versions its baseline holds), Updated (UTC), Next step and Waiting on.
- **Requests:** for each doc gap whose DU it routes to an owner (brd-unifier, pre-sdd-unifier for capacity, availability and DR, hosting and tenancy isolation points, sdd-unifier, lld-unifier), it raises one handoff request on the board, `Doc gap <KEY>/GAP-NNN: <question>`, with the gap row as Link, and reuses its pending request on the same gap. The owner's result decides the gap: Done with a version closes it with that version through its DU (doc-impact-rules.md § 8); Done with `No change` re-classifies it as `code-drift` with a fix task; Declined routes it to the named owner with a new request. It updates only the State and Closed cells of a request addressed to it. It sets that request to Accepted when plan or sync starts, and to Done, with Closed (UTC), at the stop that ends it.
- **Missing file:** when the recorded path is reachable but `unifier-status.md` does not exist there, the tracker creates the board from the template in the Status board section below, as that section says the first skill to run does, then writes its row.
- **Unreachable path:** when the recorded path cannot be reached or written, the tracker skips the board update and says so in a note in its reply; the run goes on.

## Status board

The chain skills hand work to each other through one shared file, the status board, and `tutorialize-unifier` reads it for context. Every skill that carries this section follows the same rules below, word for word.

- **File:** `unifier-status.md` in the project root, the folder that holds the hop folders (`./pre-brd-*`, `./brd-*`, `./pre-sdd-*`, `./sdd-*`, `./lld-*`). The first chain skill that runs creates it from the template below. Nobody deletes it.
- **Template:**

```markdown
# Unifier status board

Run mode: solo

## Employees

| Employee | Team | Skill | Folder | State | Version | Updated (UTC) | Next step | Waiting on |
|---|---|---|---|---|---|---|---|---|
| Business development | Product Management & Business Development | pre-brd-unifier | - | Not started | - | - | - | - |
| Product manager | Product Management & Business Development | brd-unifier | - | Not started | - | - | - | - |
| Business owner | Product Management & Business Development | business-reviewer-unifier | - | Not started | - | - | - | - |
| E2E Architect | Software Development & Delivery | pre-sdd-unifier | - | Not started | - | - | - | - |
| Software Architect | Software Development & Delivery | sdd-unifier | - | Not started | - | - | - | - |
| Tech Lead | Software Development & Delivery | lld-unifier | - | Not started | - | - | - | - |
| Developer / software engineer | Software Development & Delivery | impl-tracker-unifier | - | Not started | - | - | - | - |

## Handoff requests

| ID | From | To | Request | Why | Raised (UTC) | State | Closed (UTC) | Link |
|---|---|---|---|---|---|---|---|---|
```

- **Times and text:** every time on the board is UTC. `Updated (UTC)`, `Raised (UTC)`, and `Closed (UTC)` use `YYYY-MM-DD HH:MM`. A cell with no value holds `-`. The board uses no em dash and no en dash.
- **Run mode:** the header line reads `Run mode: solo` or `Run mode: team`.
  - The skill that creates the board writes `solo`, unless its instructions say the project is run by a team.
  - Only the user changes it.
  - In `team` mode a hop never starts another skill. At a handoff it raises the request and stops, which keeps one owner per folder. The request waits for that employee.
  - In `solo` mode a hop offers to start the next skill in the same session. When the user accepts "now" and the runtime can start it (Claude Code can), the next skill starts in the same session. When the runtime cannot, the request waits for that employee. On "later", the raiser sets the request State to `Later` (Handoff requests table, below).
- **Employees table:** one row per employee, with the columns Employee, Team, Skill, Folder, State, Version, Updated (UTC), Next step, and Waiting on.
  - The board starts with a row for every current employee, marked `Not started`. A future employee adds its own row.
  - A skill writes only its own row, the one whose Skill cell names it.
  - The State cell holds one of: `Not started`; `In progress: <step>`; `Waiting on: <employee> (<request ID>)`; `Ready for handoff`; `Done v<X.Y>`; `Stale: <reason>`.
  - The Folder cell holds the path of the skill's output folder once that folder exists, and `-` until then.
  - The Waiting on cell holds `<employee> (HR-NNN)` for each pending request (`Open`, `Later`, or `Accepted`) whose answer this skill waits on to go on, separated by `; `, or `-` when it waits on none.
- **Handoff requests table:** one row per request, with the columns ID (`HR-NNN`), From, To, Request, Why, Raised (UTC), State, Closed (UTC), and Link.
  - The State cell holds one of: `Open`, `Later`, `Accepted`, `Done`, `Declined`.
  - The skill that raises a request writes its row, with State `Open`, or `Later` when the user chose later at the handoff offer, and owns every cell of it but State and Closed (UTC). On State, the raiser sets only `Open` or `Later`, and only on its own request while it reads `Open` or `Later`. The receiving skill alone sets `Accepted` when it takes the request (still pending: taken, not finished), then `Done`, or `Declined` when it declines it, with Closed (UTC), at the stop where it finishes it.
  - One request per blocker: before raising a request, the raiser looks for its own request to the same receiver about the same thing that is still `Open`, `Later`, or `Accepted`. When one exists, it raises no new request: it updates that request's Why, its Request wording when the blocker changed, and its own row's Waiting on cell, and uses that request at this stop.
  - When the user answers "later" at a handoff offer, the raiser itself sets State `Later` on the request it raised or reused at that stop; an `Accepted` request stays `Accepted`. A later run that offers again may move its own request from `Later` back to `Open`, for example when the user answers "now".
  - A new request takes the next number after the highest ID on the board. IDs are never reused or renumbered.
- **When a skill uses the board:**
  - At the start of every run it reads the board: its own row, the pending requests (`Open`, `Later`, or `Accepted`) addressed to it and the ones it raised, and the upstream states.
  - At every stop (a part checkpoint, a gate stop, a handoff, or a wait) it updates its own row.
  - At its handoff points it raises requests, or reuses its own pending one (Handoff requests table).
- **Concurrency:** there is no lock. Re-read the board just before writing, change only the cells you own, and keep the line structure (one table row per line, the column order) and the file's line endings. The accepted risk is two agents writing at the same instant.
- **Resuming inside a hop** still uses the skill's own master. The board's Next step points to it.
- **Writers outside the project root:**
  - `impl-tracker-unifier` runs in the code repo. It writes its row through the docs root its `tracking/config.md` records. When that path is unreachable, it skips the board update and says so in a note.
  - `tutorialize-unifier` only reads the board and has no row.

## Rules that apply to every command

1. **Write immediately.** Every change goes to disk in the same step; then regenerate `index.md`. In a
   wave: every status change updates its `index.md` row at once (the Stop hook reads it); the full
   regeneration runs once, after the wave's last verdict.
1a. **Paired writes.** Some files change together, in the same edit step, never "later": a gap owned by a doc
   skill writes its `gaps.md` row **and** its `doc-updates.md` row; a status change
   writes the card's Status + History row **and** its `index.md` row (pre-flight P3 compares them); a new or
   sharpened lesson writes its `lessons.md` row **and** its `checks.json` entry (command, builtin or
   judgement; P7 coverage). Run `--lint` after such a write while a task is open.
2. **Never renumber, never delete.** IDs are permanent. Removed scope → `Dropped` + reason.
3. **Keyed IDs everywhere,** linked to the heading anchor, exactly as lld-unifier writes them:
   `[AUTOAPPLY/UC-23](<rel path>#uc-23-…) AC-3: <short label>`.
4. **Never edit BRD/SDD/LLD** in the tracker or the builder. Doc points become gap + DU; only the background
   doc worker edits docs, only for a queued DU, and a fresh verifier checks it (doc-impact-rules.md).
5. **Never invent design.** If the LLD doesn't say how, the task says "LLD silent" and a `plan-gap`
   is opened; the implementer may propose, and the proposal is queued as a DU for the doc worker.
6. **Ask only direction-level questions.** Local choices (task split, wording, ordering ties) are
   decided and noted in the plan's decision list.
7. **Learn once.** Every trigger in lessons-rules.md § 1 writes a lesson in the same step; every direction
   change writes a CHG row before any code follows the new direction.
8. **Nobody grades their own work.** Done requires a passing audit by a fresh auditor (audit-rules.md).
8a. **Mechanical first, judgement second.** Pre-flight passes before any audit that can set a task Done
    (`done`, and `audit` of a task that is not Done yet); the auditor spends its time on design, contracts,
    security and concurrency, and re-runs pre-flight in audit mode instead of trusting the pasted result.
8b. **Speed never removes a gate.** Waves, parallel audits and risk tiers change only order and depth;
    every task still gets its own gates, pre-flight, fresh auditor, report and verdict.
8c. **Run each thing once.** Full test suites run once per head commit (pre-flight); one export per wave
    is reused; a re-audit checks only the delta. Anything re-run must have a reason: sha/tree differs from
    the task head, report missing, any non-zero failures/errors/skipped, count below the last passing run,
    or the fix touched the layer. Auditors reuse a valid pre-flight and run only the task's test classes
    (twice only when the task owns concurrency or timing logic, audit-rules.md § 3a). Mechanical checks run first in seconds (`--lint`).
    The pre-flight caches its suite rows and raw mutation survivors (`tracking/preflight-cache.json`): a
    re-run whose code is unchanged (only tracking/ files changed, e.g. a card, an equivalent-mutant line or a
    Touches line) reuses both and re-judges in seconds. `--mutate` stores its result there too, and the first
    full run reuses it for unchanged code; the removals report survives test-only fixes elsewhere. Never re-run a full pre-flight to fix paperwork: fix
    it, `--lint`, then re-run (it reuses). Budget: one full pre-flight per task; a second needs a code fix.
8e. **Fewer, tighter rounds.** Audit claims freeze at audit 1; only the 7 big points (audit-rules.md § 4)
    can FAIL a task, everything else is a minor gap; after 2 FAILs the user decides (§§ 1c, 4). Test
    strength is measured by tools (P10 mutation, P11 template bindings), never by a hand sweep repeated each
    round. Audit budget 15-25 min (§ 1d). Small points are the script's job, caught in seconds by `--lint`.
8d. **Find mistakes early.** The cheapest gate catches each class of mistake: paperwork → `--lint`; design
    gaps, missed neighbours and missing contract fields → the design check (risk `high`); code defects →
    the audit. A task that fails its first audit records which earlier gate should have caught it.
9. **Attribution.** Every status change records agent + date. Every commit carries exactly one trailer:
   `Task: KEY/T-NNN`, or `Tracking: <reason>` for a commit that changes only tracking files and belongs to
   no single task (slice delivery, config, lessons shared by several tasks). The trailer goes in the **last paragraph** of the message, together with any `Co-Authored-By` line
   (no blank line between them), or git does not read it as a trailer and push-check warns.

## Read budget per command

| Command | May read |
|---|---|
| next, status, report | `index.md`, `gaps.md`, `config.md` (+ slice cards in slice mode) |
| slice | + slice cards, the slice's task cards, pre-flight output, e2e run output |
| start | + one task card, `ownership.md`, code grep for owned items, `lessons.md` / `changes.md` filtered by scope |
| done, audit | + `git log`, diff since start commit, test/tool output, cited doc anchors, filtered lessons/changes, `checks.json`, pre-flight output, the previous audit report (delta re-audit) |
| wave | `index.md`, `ownership.md`, the candidate task cards (Owns, Risk, depends_on) |
| lesson, change | + `lessons.md` / `changes.md`, cited task cards |
| standup | + last journal, `git log --since` |
| gap | + the cited task card and the one cited doc section |
| verify | + cited BRD AC sections, test files with matching tags |
| docs | `doc-updates.md`, `config.md` § Doc updates, the DU anchors' sections and the higher anchors they link (worker and verifier: the same, plus the docs diff and the cited code lines) |
| plan, sync, discover | `inventory.md`, code scan per discovery-rules.md § 1, LLD scope files, SDD §7.3 rows for the scope, BRD sections by anchor, doc master headers |

## Quality checks before finishing any write

- [ ] Every task has: keyed ID, phase, layer, Doc refs (≥ 1 LLD anchor, ≥ 1 BRD UC/AC or a stated
      reason why none - e.g. infra), Why, Owns, depends_on, DoD, Tests.
- [ ] Dependency graph has no cycles; every depends_on ID exists.
- [ ] No item owned by two non-Dropped tasks.
- [ ] Every link resolves (file + anchor).
- [ ] `index.md` regenerated (in a wave: after the last verdict; status rows always current) and equal to the task cards.
- [ ] Coverage: every in-scope UC/AC/e2e spec has a task, or an open gap says why not.
- [ ] No existing code planned as new: every in-scope inventory item is claimed by a task or has a gap.
- [ ] No `Adopted` task counted as done; no task `Done` without a linked audit report with verdict PASS / PASS-minor (or a quoted user skip).
- [ ] Every trigger this run (audit FAIL, reopen, closed bug-type gap, user correction) has a lesson row.
- [ ] Every lesson has a mechanical Check; no duplicate lesson (same root cause + scope).
- [ ] Every direction change this run has a CHG row with a decider.
- [ ] Every task has a Risk (`low`/`high` with reason); unclear = `high`.
- [ ] Every gap owned by a doc skill has a DU; every DU has a level, a kind, a linked gap, and a decider when
      its level's mode is `ask`; never two doc workers at once; no DU `Verified` without a verifier PASS.
- [ ] Slice mode: every non-Dropped task has exactly one slice; no task depends on a later slice; the order
      in `config.md` § Slices carries the user's quote; no slice `Delivered` without a passing deliver gate.
- [ ] Every lesson with a mechanical Check has a `checks.json` entry (or a reason it can't).
- [ ] No task went to `In review` without a linked pre-flight report (PASS) for its head commit.
- [ ] After every audit (finished or stopped) the code tree was clean before the next commit.

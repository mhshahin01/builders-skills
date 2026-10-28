---
name: impl-tracker-unifier
description: >-
  Track implementation against the BRD, SDD and LLD. Use to plan implementation, split a feature into
  tasks, pick what to build next, start or finish a task, log a bug or gap, audit consistency, record a
  lesson or direction change, write a standup or manager report, show progress, or check doc/code
  drift. Splits each LLD into keyed tasks citing BRD use cases and ACs, with the why. Blocks tasks with
  unmet dependencies, maps existing code to the LLD, prevents double builds via an ownership index,
  keeps gaps and a journal. No task is Done until pre-flight passes and a fresh read-only auditor
  checks API, DB migrations, frontend, logs/audit trail, security and tests against the LLD. Mistakes,
  reopens, corrections and direction changes become checkable lessons replayed before the next
  matching task. Slice mode builds feature by feature, end to end. Commands: init, plan, next, wave,
  start, done, audit, discover, verify, gap, lesson, change, standup, status, sync, slice, report.
  Writes ./tracking/ only.
---

# Implementation Tracker

The seventh stage of the documentation chain:

    SoW → BRD → Pre-SDD → SDD → LLD → **impl-tracker** → code

It turns an approved LLD into an ordered, dependency-checked task ledger, keeps that ledger true while
code is written, and reports the gap between what the documents require and what the code does.

You act as the Developer / software engineer (Software Development & Delivery) in the unifier company.

It **never edits** BRD, SDD or LLD files by hand. A decided change to design runs the owning skills in chain
order in the same change (§ Documents chain); a doc problem nobody has decided yet becomes a gap row for its
owner (brd-unifier, sdd-unifier, lld-unifier).

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
| `change` | free text | Record a direction/use-case/decision change; mark affected tasks Stale (not those the documents chain re-plans: § Documents chain); create rework tasks. |
| `standup` | `[date]` | Write today's journal: done since last, next, blockers, new gaps. |
| `status` | `[KEY]` | Progress by feature/phase/UC; open gaps; blocked chain. |
| `sync` | `[KEY]` | Compare doc versions with the baseline and owned files with the code; mark Stale; open gaps (as a hop of the documents chain it moves the baseline and re-plans instead: § Documents chain). |
| `slice` | `deliver KEY/S-NN`, `list [KEY]`, `order KEY` | Slice mode: run the delivery gate, list slices, or change the order (slice-rules.md). |
| `report` | `[KEY]` | Manager-ready summary: delivered slices, current slice, next, blockers (slice-rules.md § 6). |

No command → ask once: "What do you want: next / standup / status / plan / start / gap?" with `next`
as the default.

Flags: `deep` (plan only: one sub-agent per UC block), `dry` (show changes, write nothing),
`agent=<name>` (attribution; default: the running agent's name, e.g. `claude-opus-5-5`, `codex`, `human`).

Natural language maps to commands: "what's next" → `next`; "do several at once / be faster" → `wave`; "I'm starting X" → `start`; "finished X" →
`done`; "found a bug" → `gap`; "check it's all consistent" → `audit`; "you did this wrong / remember this" →
`lesson`; "we changed the use case / let's do it another way" → `change`; "why is it like this" → `changes.md`; "what did we do yesterday" → `standup`; "where are we" → `status`; "feature by feature / end to end / slices" → `plan KEY slice`; "I finished X e2e / deliver it" → `slice deliver`; "what do I tell my manager" → `report`.

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
   `changes.md`, `journal/`.
3a. **Record the board path.** Write the `Board` row of `config.md`'s table with `<docs root>/unifier-status.md` (the docs
   root from step 1; § The tracker's board row).
3b. **Inventory existing code** (discovery-rules.md § 1) → `tracking/inventory.md`. Print counts by kind
   and key guess ("found 14 endpoints, 6 screens, 9 migrations"). Nothing is marked done here.
4. Install the Stop audit hook (audit-rules.md § 7) in the code repo's `.claude/settings.json`: ask once, then
   merge it into existing `hooks.Stop` (create the file if missing; never drop other settings or hooks;
   skip if the same command is already there).
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
5b. For each task write the **Why** (task-splitting.md § Why rules): cite the LLD pattern/ADR/BR.
5c. **Match existing code** (discovery-rules.md § 2): each unit → Match (`Adopted`), Partial
   (`In progress` + missing list + gaps), Missing (`Planned`); unclaimed inventory items → `untracked-code`.
6. Run the ownership check: nothing owned twice (across all features).
7. Run the **coverage check**: every in-scope UC, every AC, every e2e spec, every migration,
   every endpoint in scope, and every unit of each kind in task-splitting.md's unit map has ≥ 1 task. Missing → `GAP` type `plan-gap` (the LLD has no unit for it)
   or task added.
8. Show the plan summary (phases, counts, DAG Mermaid, gaps, **existing-code match table** with
   confidence (discovery-rules.md § 3), and the **risk table**: each task's Risk with its reason,
   task-splitting.md § Risk) and **ask for approval** before writing
   task cards. On approval write `KEY/plan.md`, task cards, update `index.md`, `ownership.md`.

**Slice mode** (`plan KEY slice` / `reslice`, or `Mode: slice` in config): after step 5c, group the tasks into
slices and check slice order per slice-rules.md § 3; step 8 shows the slice table first and asks for the
grouping and the order; on approval also write the slice cards and `config.md` § Slices (the home of the
slice order that lld-unifier reads: slice-rules.md § 1).

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
   current slice is mostly `high` risk** (e.g. auth, money, personal data), since short waves get audit
   feedback sooner. "Mostly" = more than half of the slice's open (not Done/Dropped) tasks are risk `high`.
3. Show the set (id, title, risk with reason, owned files, why grouped) and ask once for approval.
4. On approval, for each task **in turn**: run `start` (all gates; this records the task's **own** start
   commit, so no two wave tasks share one), implement it, commit it (one or more commits, **each with
   exactly one `Task:` trailer**, never two tasks in one commit), then go to the next task. A task that
   needs to change a file outside its Owns declares it under `## Touches` with the reason, or stops and
   becomes a gap.
5. Finish with `done KEY/T-a,KEY/T-b,…`.
6. **Bookkeeping once per wave:** during the wave write only what a gate needs (card status, History row,
   audit/pre-flight links). Journal entry, minor-finding gaps, lesson dedup/promotion, `checks.json`
   and `index.md` regeneration are done once, after the last verdict of the wave. A FAIL's blocker/major
   gaps and its lesson are still written at once (rule 7).

### start

1. Read the task card + `index.md` + `ownership.md`.
2. **Readiness gate** (status-rules.md § Gate): every `depends_on` Done/Verified; task not Stale;
   no open `blocker` gap linked to it. If it fails: refuse, print the blocking chain down to the first
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
     state, table or route the task creates or changes; list each with its predicate (L-034).
   - **Contract check**: everything the code needs from an API or event is in the LLD contract. If not,
     stop: open a `plan-gap` and ask the user (a contract change is direction-level) before coding.
   - **Test plan from the rules**: which fakes or models stand in for the other side and how each answers
     by the real rule (L-035).
   Then one fresh reviewer (Agent tool, `general-purpose`, faster model, about 5 minutes, read-only) checks
   the design check against the cited docs and returns missing invariants, cells or neighbours. Fix and
   record "design check: reviewed" in History. It never replaces the audit.
3d. **Lint at start (seconds):** run `preflight.py … --task KEY/T-NNN --lint` now, so Owns paths, Risk
   floor and card/index mismatches are fixed before any code, not found at `done`.
3e. **Fresh stack (tasks with e2e or integration tests):** any local service (API, worker, dev server)
   started before the current head commit is restarted now, as part of bringing the environment up
   (audit-rules.md § 3a); never mid-task, never by asking the user.
4. Set `In progress`, `agent`, `started`, **start commit** (`git rev-parse HEAD`); append to today's journal.
   Stamp the start clock: `python <skill>/scripts/preflight.py --tracking <tracking> --history-start KEY/T-NNN`
   (writes `history-clock.json`, used by `history.md` for the task's span; run once, a second run keeps the first).
5. Print the **task brief** for the implementer: Goal, Why, Doc refs (links), Owns, **Layers to touch**
   (API / DB / UI / logs / security, derived from the LLD, each with its doc anchor), **Lessons that
   apply** (lessons-rules.md § 5, with their Checks), the **Design check** (high risk), Definition of done,
   Tests to write; nothing else.

### done

Accepts one or several ids: `done KEY/T-a[,KEY/T-b…]`. Every step runs per task.

1. Collect evidence: commits with `Task: KEY/T-NNN` (git log), changed files, unit tests added.
   A Partial task with no start commit first runs `start` steps 1-4 (gates, start commit), never a
   hand-picked start sha.
1b. **Bring the test environment up** (audit-rules.md § 3a): if tests need Docker and the engine is down,
   start it yourself (Docker Desktop / `systemctl start docker` / `colima start`), wait until `docker info`
   answers (≤ 3 min); start the local compose stack if the project has one. Never ask the user first;
   never install or reconfigure Docker. Still down after the wait → stop, report the cause, task stays
   `In progress`. (The tests themselves run once, in pre-flight.)
1c. **Lint first (seconds).** `python <skill>/scripts/preflight.py --tracking <tracking> --task KEY/T-NNN --lint`
   runs every check except tests and the stack, accepts uncommitted work, and prints ready-to-paste
   `## Touches` lines for files outside Owns. Fix everything it reports before the full pre-flight: Touches
   paths, Risk floor, trailers, card/index status, lesson coverage (`checks.json`). It writes no report, ends with
   `LINT: PASS|FAIL`, and never stands in for the pre-flight.
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
   PII. Record "self-check: OK" or the fixes in the History row. The self-check is never audit evidence;
   it is not passed to the auditor and never replaces pre-flight or the audit.
2b. **Pre-flight (mandatory before any audit that can set a task Done):**
   `python <skill>/scripts/preflight.py --tracking <tracking> --task KEY/T-a [--task KEY/T-b …]`.
   It checks: clean tree; commits (start commit, exactly one `Task:` trailer each); card/index status;
   every owned item; every required test suite (counted by `<testcase>`; any skip, failure, error, zero
   tests, or fewer tests than last time fails); the local stack; every lesson's check (each Active lesson
   must be covered); task isolation (files changed only within Owns or `## Touches`); and the risk floor
   (a `low` task touching high-risk code fails). FAIL → fix and re-run; no audit until it passes.
   Required suites run in parallel (backend beside frontend, each Angular project its own suite); every
   suite row ends with its time in seconds, so the slow suite is visible.
   It writes `tracking/KEY/preflight/T-NNN-<sha>.md`; **link** that file from the History row (don't paste
   the table). Adopted tasks run the same command (Adopted mode is automatic: no commit checks).
   **Where it runs:** in the permanent verify worktree named in `config.md` § Verify worktree when one is
   set, moved by the routine in templates.md § Verify worktree (detach to the head, clean everything but
   `node_modules`, `npm ci` only when `package-lock.json` changed), so a live IDE or dev server in the main
   checkout is never disturbed and installs are not repeated (L-028). Copy the report back into the main
   tracking folder before committing it.
3. Set `In review`. **Run the audit** (audit-rules.md), mandatory: an agent cannot skip it, only the user
   in chat (then record `audit skipped by user: "<quote>"` in History and open a major gap).
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
   user correction during it → capture a lesson now.

### slice

Follow `slice-rules.md`. `slice deliver KEY/S-NN` runs the § 5 gate (incl.
`preflight.py --tracking <t> --slice KEY/S-NN` and the slice's e2e specs) and sets `Delivered`; `slice list`
prints slices in order with status and task counts; `slice order KEY` asks the user for a new order and
records it with their quote.

### report

slice-rules.md § 6. Reads `index.md`, slice cards, `gaps.md` only.

### verify

1. For each BRD AC/BR the task (or UC) cites: find the test that proves it: unit test comment tag,
   e2e tag `@KEY/UC-NN`, `@KEY/TC-…` as `13-testing.md` defines.
2. All proven and passing → `Verified`. Unproven AC → gap `untested-ac`. Behaviour differs from the
   AC → gap `code-drift` or `doc-gap` (gap-rules.md decides which).

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
Marks affected tasks, supersedes old decisions/lessons, creates rework tasks, and runs the documents chain
(§ Documents chain) for every design point the change decides; only an undecided doc problem becomes a gap.
In `solo` run mode (the board's Run mode line) the tracker runs each hop in the same session. In `team` run mode,
or when the owning skill cannot run now, it raises a `Decided change` request to the first hop not yet run instead, and later hops travel through that
skill's documents chain (§ The tracker's board row); the hop stays pending until the request ends, and its result fills the CHG Follow-up.

### gap

Follow `gap-rules.md`: classify type and severity, link to task/UC/doc anchor, route the owner
(code fix → new task; doc fix → the owning skill, run in the same change once the fix is decided: § Documents
chain), write to `gaps.md`; for each doc gap routed to an owner, raise a handoff request on the board
(§ The tracker's board row gives its form and how the owner's result decides the gap). Closing needs evidence. Closing a gap of
type bug / code-drift / layer-miss / obs-gap / double-build / untracked-code → capture its lesson.

### standup

1. Read the last journal entry, `index.md`, `gaps.md`, and `git log --since=<last entry>`.
2. Write `journal/YYYY-MM-DD.md`: Done since last (by agent), In progress, Next (from `next`),
   Blockers (blocked chains + blocker gaps), New/closed gaps, Commits without a `Task:` trailer
   (untracked work → ask which task or open one), Audits (verdicts since last), New lessons and recurrences,
   Changes (CHG rows since last).
3. Print it short. Offer the top decision if one waits on the user.

### status

`index.md` + `gaps.md` only → table per feature: phase, tasks by status, % Done/Verified by UC,
% existing-but-unaudited (Adopted) shown separately, never counted as done,
blocked chains, open gaps by severity. Mermaid progress optional.

### sync

Follow `sync-and-drift.md`: doc version bump → find changed anchors → mark citing tasks `Stale`
(Done / Verified ones become `Done-stale`) and open `doc-changed` gaps; owned files missing or moved → `code-drift`;
code with no owning task (new top-level classes, migrations, routes) → `untracked-code`. Then re-run the
inventory and diff it (discovery-rules.md § 5). Run as a hop of the documents chain, it moves the baseline
and re-plans instead of marking `Stale` (§ Documents chain).

### discover

Inventory + diff + match only (discovery-rules.md §§ 1, 2, 5); proposes Adopted/Partial changes and gaps,
asks before writing.

---

## Rules that apply to every command

1. **Write immediately.** Every change goes to disk in the same step; then regenerate `index.md`. In a
   wave: every status change updates its `index.md` row at once (the Stop hook reads it); the full
   regeneration runs once, after the wave's last verdict.
1a. **Paired writes.** Some files change together, in the same edit step, never "later": a status change
   writes the card's Status + History row **and** its `index.md` row (pre-flight P3 compares them); a new or
   sharpened lesson writes its `lessons.md` row **and** its `checks.json` entry (command, builtin or
   judgement; P7 coverage). Run `--lint` after such a write while a task is open.
2. **Never renumber, never delete.** IDs are permanent. Removed scope → `Dropped` + reason.
3. **Keyed IDs everywhere,** linked to the heading anchor, exactly as lld-unifier writes them:
   `[AUTOAPPLY/UC-23](<rel path>#uc-23-…) AC-3: <short label>`.
4. **Never edit BRD/SDD/LLD by hand.** A decided design change runs the owning skills in chain order before
   its code reaches In review (§ Documents chain); an undecided doc problem is a gap routed to its owner.
5. **Never invent design.** If the LLD doesn't say how, the task says "LLD silent" and a `plan-gap`
   is opened; the implementer may propose, and the proposal goes to lld-unifier.
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
    (twice for risk `high`, audit-rules.md § 3a). Mechanical checks run first in seconds (`--lint`).
8d. **Find mistakes early.** The cheapest gate catches each class of mistake: paperwork → `--lint`; design
    gaps, missed neighbours and missing contract fields → the design check (risk `high`); code defects →
    the audit. A task that fails its first audit records which earlier gate should have caught it.
9. **Attribution.** Every status change records agent + date. Every commit carries exactly one trailer:
   `Task: KEY/T-NNN`, or `Tracking: <reason>` for a commit that changes only tracking files and belongs to
   no single task (slice delivery, config, lessons shared by several tasks). The trailer goes in the **last paragraph** of the message, together with any `Co-Authored-By` line
   (no blank line between them), or git does not read it as a trailer and push-check warns.

## Documents chain (bottom-up and top-down)

A decision that fills, narrows or changes a design point (the user's answer, a tracker choice, a gap or open
item settled) goes through the documents chain in the same change, before the code that follows it reaches
`In review`:

| Change starts at | Hops, in this order | A hop runs when |
|---|---|---|
| Code or the LLD (an implementation decision, an LLD update) | lld-unifier, then sdd-unifier, then pre-sdd-unifier, then brd-unifier, then impl-tracker-unifier (`sync`, and `plan` for new scope) | the next document states the changed fact otherwise, or must state it (a contract, a behaviour rule, a business rule), and the tracker hop when it cites or realises the changed item |
| The SDD | sdd-unifier, then brd-unifier when a business rule changes, and lld-unifier for every child LLD the change reaches, then impl-tracker-unifier (`sync`, and `plan` for new scope) | the same |
| The BRD (a use case, business rule, persona, integration or screen added, changed or removed) | brd-unifier, then pre-sdd-unifier, then sdd-unifier, then lld-unifier, then impl-tracker-unifier (`sync`, and `plan` for new scope) | the next document cites or realises the changed item |

- Each hop is run through its owning skill; the tracker never writes the document itself. In `team` run mode, or
  when that skill cannot run now, the change travels as `Decided change` requests (§ The tracker's board row). In both
  transports the CHG decider quote is the hop's acceptance: the owning skill asks again only when a record
  disagrees with it.
- The CHG row's Follow-up names every document the change reached with the version that records it, and every
  document that needed no change with the reason (`SDD: no change, contract unchanged`).
- A gap is closed by the version that records its fix. Only a question still waiting for its owner (a business
  decision, a provider fact) stays an open gap.
- After an upstream hop, move `config.md` baselines to the new versions and re-plan the tasks that cite the
  changed anchors in the same step (card and index): they keep their status (`Planned`, `In progress`); `Stale`
  and `Done-stale` are for a doc change that `sync` finds on its own, not for one made through the chain.
  Exception: a Done or Verified task whose owned item the change alters becomes `Done-stale`, with its
  rework task. A `sync` run as a hop of the chain does exactly this, instead of marking `Stale`, opening
  `doc-changed` gaps and asking about the baseline: the decision that started the chain is the acceptance.
- Scope the user leaves for later stays a gap (`Deferred` with the user's quote) that cites the document's TODO
  or open question recording it.
- A tracker hop (`sync`, `plan`) reports the doc versions its baseline now holds.
- A task that already holds the change (it came from this tracker's own `change`) is not re-planned: the hop only
  moves the `config.md` baselines to the new versions.
- An answer policy set for a tracker run answers only the tracker's own questions. Each hop keeps its skill's own
  stops and asks, unless the policy names that document.

## The tracker's board row

The tracker runs in the code repo, and the status board lives in the docs root.

- **Path:** `<docs root>/unifier-status.md`, taken from the `Board` row `init` records in `tracking/config.md`. The docs root may differ from the folder holding the hop folders; the tracker then uses the recorded path as written.
- **Its row:** the tracker writes only the row whose Skill cell is `impl-tracker-unifier`, at each stop (the end of a command, a gate stop, a handoff, a wait): State, Version (the doc versions its baseline holds), Updated (UTC), Next step and Waiting on.
- **Requests:** for each doc gap it routes to an owner (brd-unifier, pre-sdd-unifier for capacity, availability and DR, hosting and tenancy isolation points, sdd-unifier, lld-unifier), it raises one handoff request on the board, `Doc gap <KEY>/GAP-NNN: <question>`, with the gap row as Link, and reuses its pending request on the same gap. The owner's result decides the gap: Done with a version closes it with that version, and the baseline move is a chain hop (§ Documents chain); Done with `No change` re-classifies it as `code-drift` with a fix task; Declined routes it to the named owner with a new request. It updates only the State and Closed cells of a request addressed to it. It sets that request to Accepted when plan or sync starts, and to Done, with Closed (UTC), at the stop that ends it.
- **Decided changes:** for each hop of a `change` that it does not run in the session (`team` run mode, or the owning skill cannot run now: § change), it raises one handoff request to that skill, `Decided change <KEY>/CHG-NNN: <summary>`, with the CHG row in `tracking/changes.md` as Link, and reuses its pending request on the same CHG and skill. It raises it only for the first hop of the chain order (§ Documents chain) that is not yet run. That skill's documents chain raises each later hop, up or down the chain, with the same request form and Link. The tracker reads every board request whose Request carries that CHG ID, whoever raised it, to fill the CHG Follow-up for its document: Done with a version writes the document and that version; Done with `No change: <reason>` writes the document and the reason; Declined routes it to the named owner with a new request. When every hop the chain reached has a version or a reason, the Follow-up is complete and the baseline move runs as the tracker hop (§ Documents chain).
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

## Read budget per command

| Command | May read |
|---|---|
| next, status, report | `index.md`, `gaps.md`, `config.md` (+ slice cards in slice mode) |
| slice | + slice cards, the slice's task cards, pre-flight output, e2e run output |
| start | + one task card, `ownership.md`, code grep for owned items, `lessons.md` / `changes.md` filtered by scope |
| done, audit | + `git log`, diff since start commit, test/tool output, cited doc anchors, filtered lessons/changes, `checks.json`, pre-flight output, the previous audit report (delta re-audit) |
| wave | `index.md`, `ownership.md`, the candidate task cards (Owns, Risk, depends_on) |
| lesson, change | + `lessons.md` / `changes.md`, cited task cards, `config.md` and the doc master headers (documents chain) |
| standup | + last journal, `git log --since` |
| gap | + the cited task card and the one cited doc section, `config.md` and the doc master headers (documents chain) |
| verify | + cited BRD AC sections, test files with matching tags |
| plan, sync, discover | `inventory.md`, code scan per discovery-rules.md § 1, LLD scope files, SDD §7.3 rows for the scope, BRD sections by anchor, doc master headers |
| every command | + `unifier-status.md` through the `Board` path in `config.md` (its own row and its requests) |

## Quality checks before finishing any write

- [ ] Every task has: keyed ID, phase, layer, Doc refs (≥ 1 LLD anchor, ≥ 1 BRD UC/AC or a stated
      reason why none, e.g. infra), Why, Owns, depends_on, DoD, Tests.
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
- [ ] Slice mode: every non-Dropped task has exactly one slice; no task depends on a later slice; the order
      in `config.md` § Slices carries the user's quote; no slice `Delivered` without a passing deliver gate.
- [ ] Every lesson with a mechanical Check has a `checks.json` entry (or a reason it can't).
- [ ] No task went to `In review` without a linked pre-flight report (PASS) for its head commit.
- [ ] After every audit (finished or stopped) the code tree was clean before the next commit.
- [ ] Every design point decided this run went through the documents chain: each CHG Follow-up names the doc
      versions that record it, or why a document needed no change.

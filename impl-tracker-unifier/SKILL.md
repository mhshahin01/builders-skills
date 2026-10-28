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
uses the owning skill (brd-unifier, pre-sdd-unifier, sdd-unifier, lld-unifier): doc-impact-rules.md. In `team`
run mode the DU goes to the doc folder's owner as a board request instead (§ Documents chain).

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
| `commands/*.md` | The steps of each command (read only the one being run) |
| `audit-rules.md` | The auditor subagent, layer matrix, tool evidence, verdicts, auditor prompt, clean export, parallel audits |
| `scripts/preflight.py` | Pre-flight: the mechanical checks run before any audit (tree, trailers, status, Owns, tests, stack, lesson checks) |
| `scripts/paperwork.py` | `--set-status` and `--gap-du`: the paired writes of rule 1a |
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

Read **only** the file for the command being run (it holds every step), then follow it:

| Command | Steps in |
|---|---|
| init | `commands/init.md` |
| plan | `commands/plan.md` |
| wave | `commands/wave.md` (then start, done) |
| start | `commands/start.md` |
| done | `commands/done.md` |
| next, slice, report, verify, audit, lesson, change, gap, docs, standup, status, sync, discover | `commands/other.md` |

A task run end to end reads `commands/start.md` and `commands/done.md` once each.

## The tracker's board row

The tracker runs in the code repo, and the status board lives in the docs root.

- **Path:** `<docs root>/unifier-status.md`, taken from the `Board` row `init` records in `tracking/config.md`. The docs root may differ from the folder holding the hop folders; the tracker then uses the recorded path as written.
- **Its row:** the tracker writes only the row whose Skill cell is `impl-tracker-unifier`, at each stop (the end of a command, a gate stop, a handoff, a wait): State, Version (the doc versions its baseline holds), Updated (UTC), Next step and Waiting on.
- **Requests:** in `team` run mode (§ Documents chain), for each DU it raises one handoff request on the board to the owning skill (brd-unifier, pre-sdd-unifier for capacity, availability and DR, hosting and tenancy isolation points, sdd-unifier, lld-unifier), for the first hop only, and reuses its pending request on the same DU and skill:
  - `Decided change <KEY>/CHG-NNN (DU-NNN): <summary>`, for a DU decided by a CHG, with the CHG row in `tracking/changes.md` as Link;
  - `Doc gap <KEY>/GAP-NNN (DU-NNN): <question>`, for a DU waiting on an owner's decision, with the gap row as Link.

  That skill's documents chain raises each later hop, up or down the chain, with the same form, IDs and Link. The tracker reads every board request whose Request carries that CHG or DU ID, whoever raised it, and sets the DU state from it (doc-impact-rules.md § 6a): Done with a version fills the CHG Follow-up with the document and that version; Done with `No change: <evidence>` fills it with that evidence, sets the DU to `Applied` with no docs commit for the verifier to confirm, and for a `Doc gap` also re-classifies the gap as `code-drift` with a fix task; Declined sets the DU `Rejected` with the reason, or, when it names another owner, returns the same DU to `Queued` for that owner, whose new request carries the same DU ID (doc-impact-rules.md § 6a). A request in `Later` keeps its DU at `Waiting-decision`. When every hop the chain reached has a version or a reason, the Follow-up is complete. It updates only the State and Closed cells of a request addressed to it. It sets that request to Accepted when plan or sync starts, and to Done, with Closed (UTC), at the stop that ends it.
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
| docs | `doc-updates.md`, `config.md` § Doc updates, the DU anchors' sections and the higher anchors they link (worker and verifier: the same, plus the docs diff and the cited code lines) |
| plan, sync, discover | `inventory.md`, code scan per discovery-rules.md § 1, LLD scope files, SDD §7.3 rows for the scope, BRD sections by anchor, doc master headers |
| every command | + `unifier-status.md` through the `Board` path in `config.md` (its own row and its requests) |

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
- [ ] Every design point decided this run went through the documents chain as DUs: each CHG Follow-up names the
      doc versions that record it, or why a document needed no change.

# impl-tracker-unifier: next, slice, report, verify, audit, lesson, change, gap, docs, standup, status, sync, discover

Read from SKILL.md § Workflow per command. Rules, read budget and quality checks stay in SKILL.md.

## next

1. Read `index.md` only.
2. Ready = status `Planned` or `Adopted` (Adopted first: it only needs an audit) and all `depends_on` are `Done`/`Verified`, not `Stale`, phase ≤ current
   phase in `config.md`.
2b. Slice mode: only tasks of the **current slice** are candidates (slice-rules.md § 4).
3. Order: current phase → critical path length (most dependents first) → foundation layer first →
   lowest ID. Also put open `blocker`-severity gaps first if they have a fix task.
4. Print top 3: ID, title, why next (one line), what it unblocks. Offer `start` on the first.

## slice

Follow `slice-rules.md`. `slice deliver KEY/S-NN` runs the § 5 gate (incl.
`preflight.py --tracking <t> --slice KEY/S-NN` and the slice's e2e specs) and sets `Delivered`; `slice list`
prints slices in order with status and task counts; `slice order KEY` asks the user for a new order and
records it with their quote.

## report

slice-rules.md § 6. Reads `index.md`, slice cards, `gaps.md` only.

## verify

1. For each BRD AC/BR the task (or UC) cites: find the test that proves it - unit test comment tag,
   e2e tag `@KEY/UC-NN`, `@KEY/TC-…` as `13-testing.md` defines.
2. All proven and passing and no open DU on a cited anchor → `Verified`. Unproven AC → gap `untested-ac`.
   Behaviour differs from the AC → doc-impact-rules.md § 2 decides: `code-drift` (fix task) or `doc-update`
   (gap + DU).

## audit

Follow `audit-rules.md`. Standalone on a task that is not Done yet: run pre-flight first (`done` step 2b).
Standalone on a UC or key it audits every Done task in scope plus the end-to-end
trace; FAIL on a Done task → `Done` becomes `In progress` (reopened → lesson).

## lesson

Follow `lessons-rules.md` §§ 2-4: classify root cause, write Rule + Check + Scope, dedup, handle recurrence
and promotion. The `checks.json` entry is written in the same step as the lesson (rule 1a).
`lesson list [layer|key|tag]` prints matching Active/Promoted lessons.

## change

Follow `lessons-rules.md` § 6. Needs a user quote or doc version as the decider; otherwise ask.
Marks affected tasks, supersedes old decisions/lessons, creates rework tasks, and queues a DU (kind `direction`,
decided by the CHG's quote) for every doc the change affects. The DUs carry the change through the documents
chain (§ Documents chain): the doc worker applies them in `solo` run mode, and `Decided change` requests carry
them in `team` run mode. Their results fill the CHG Follow-up.

## gap

Follow `gap-rules.md`: classify type and severity, link to task/UC/doc anchor, route the owner
(code fix → new task; doc fix → a DU in the same step, doc-impact-rules.md), write to `gaps.md`. Closing needs evidence. Closing a gap of
type bug / code-drift / layer-miss / obs-gap / double-build / untracked-code → capture its lesson.

## docs

Follow `doc-impact-rules.md`. Every command first checks `doc-updates.md`: `Queued` rows and no live worker →
dispatch (§ 6; in `team` run mode, raise the board request: § 6a); a worker or verifier that reported → process it (§§ 7-8). `docs [KEY]` prints the queue by
state and the doc-drift count (§ 11). `docs run` dispatches now. `docs approve KEY/DU-NNN` applies a
`Waiting-decision` DU (the user's word is its decider, quoted); `docs reject KEY/DU-NNN <reason>` sets it
`Rejected` and turns its gap into `code-drift` when the code must change instead.

## standup

1. Read the last journal entry, `index.md`, `gaps.md`, and `git log --since=<last entry>`.
2. Write `journal/YYYY-MM-DD.md`: Done since last (by agent), In progress, Next (from `next`),
   Blockers (blocked chains + blocker gaps), New/closed gaps, Commits without a `Task:` trailer
   (untracked work → ask which task or open one), Audits (verdicts since last), New lessons and recurrences,
   Changes (CHG rows since last), Doc updates (verified since last, open by state; `Waiting-decision` under
   Needs your decision).
3. Print it short. Offer the top decision if one waits on the user.

## status

`index.md` + `gaps.md` + `doc-updates.md` only → table per feature: phase, tasks by status, % Done/Verified by UC,
doc drift (doc-impact-rules.md § 11),
% existing-but-unaudited (Adopted) shown separately - never counted as done,
blocked chains, open gaps by severity. Mermaid progress optional.

## sync

Follow `sync-and-drift.md`: doc version bump → find changed anchors → mark citing tasks `Stale`
(Done / Verified ones become `Done-stale`) and open `doc-changed` gaps, except anchors a DU changed for the task that
raised it (doc-impact-rules.md § 8); owned files missing or moved → `code-drift`;
code with no owning task (new top-level classes, migrations, routes) → `untracked-code`. Then re-run the
inventory and diff it (discovery-rules.md § 5).

## discover

Inventory + diff + match only (discovery-rules.md §§ 1, 2, 5); proposes Adopted/Partial changes and gaps,
asks before writing.

---

## Rules that apply to every command

1. **Write immediately.** Every change goes to disk in the same step; then regenerate `index.md`. In a
   wave: every status change updates its `index.md` row at once (the Stop hook reads it); the full
   regeneration runs once, after the wave's last verdict.
1a. **Paired writes.** Use the helpers, never a hand-written script: `preflight.py --tracking <t> --set-status
    KEY/T-NNN "<State>" "<reason>"` (card Status + History + index row) and `--gap-du KEY/T-NNN
    "type|severity|anchor|text|owner" "level|kind|anchors|what|decided"` (gap row + DU row, next ids). Some files change together, in the same edit step, never "later": a gap owned by a doc
   skill writes its `gaps.md` row **and** its `doc-updates.md` row; a status change
   writes the card's Status + History row **and** its `index.md` row (pre-flight P3 compares them); a new or
   sharpened lesson writes its `lessons.md` row **and** its `checks.json` entry (command, builtin or
   judgement; P7 coverage). Run `--lint` after such a write while a task is open.
2. **Never renumber, never delete.** IDs are permanent. Removed scope → `Dropped` + reason.
3. **Keyed IDs everywhere,** linked to the heading anchor, exactly as lld-unifier writes them:
   `[AUTOAPPLY/UC-23](<rel path>#uc-23-…) AC-3: <short label>`.
4. **Never edit BRD/SDD/LLD** in the tracker or the builder. Doc points become gap + DU; only the background
   doc worker edits docs (`solo` run mode), only for a queued DU and through the owning skill, and a fresh
   verifier checks it (doc-impact-rules.md). In `team` run mode the DU goes to the doc folder's owner as a board
   request (§ Documents chain).
5. **Never invent design.** If the LLD doesn't say how, the task says "LLD silent" and a `plan-gap`
   is opened; the implementer may propose, and the proposal is queued as a DU (§ Documents chain).
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
8f. **Full suites once per wave.** A task whose diff adds no migration, bean wiring, config or build file
    runs its pre-flight with `--defer-suites` (related tests + reused `--mutate`); the full suites run once
    after the wave's last task (one pre-flight with every wave task) and in `slice deliver`. A red full run
    there reopens the task whose classes fail (CHG-029, user: "Apply all 10").
8d. **Find mistakes early.** The cheapest gate catches each class of mistake: paperwork → `--lint`; design
    gaps, missed neighbours and missing contract fields → the design check (risk `high`); code defects →
    the audit. A task that fails its first audit records which earlier gate should have caught it.
9. **Attribution.** Every status change records agent + date. Every commit carries exactly one trailer:
   `Task: KEY/T-NNN`, or `Tracking: <reason>` for a commit that changes only tracking files and belongs to
   no single task (slice delivery, config, lessons shared by several tasks). The trailer goes in the **last paragraph** of the message, together with any `Co-Authored-By` line
   (no blank line between them), or git does not read it as a trailer and push-check warns.

## Documents chain (bottom-up and top-down)

A decision that fills, narrows or changes a design point (the user's answer, a tracker choice, a gap or open
item settled) goes through the documents chain in the same change. The tracker carries it only as doc updates:
each doc point is a gap and a `KEY/DU-NNN` row (doc-impact-rules.md §§ 1-5), and the DU's impact level names the
documents it reaches. The gates of doc-impact-rules.md § 9 decide which task waits for it.

| Change starts at | Hops, in this order | A hop runs when |
|---|---|---|
| Code or the LLD (an implementation decision, an LLD update) | lld-unifier, then sdd-unifier, then pre-sdd-unifier, then brd-unifier, then impl-tracker-unifier (`sync`, and `plan` for new scope) | the next document states the changed fact otherwise, or must state it (a contract, a behaviour rule, a business rule), and the tracker hop when it cites or realises the changed item |
| The SDD | sdd-unifier, then brd-unifier when a business rule changes, and lld-unifier for every child LLD the change reaches, then impl-tracker-unifier (`sync`, and `plan` for new scope) | the same |
| The BRD (a use case, business rule, persona, integration or screen added, changed or removed) | brd-unifier, then pre-sdd-unifier, then sdd-unifier, then lld-unifier, then impl-tracker-unifier (`sync`, and `plan` for new scope) | the next document cites or realises the changed item |

- **One route, two run modes** (the board's Run mode line). Each hop runs through its owning skill; the tracker
  never writes a document itself.
  - `solo` (one session can edit the docs): the doc worker (doc-impact-rules.md § 6) applies each DU through the
    owning skill's own row: its `Decided change` row for a DU decided by a CHG, its `Doc gap` row for a DU that
    needs an owner's decision. That skill's delta review, `Review:` stamp and documents-chain hops run inside the
    worker. Then the verifier and `sync` run (doc-impact-rules.md §§ 7-8).
  - `team` (another employee owns the doc folder; one owner per folder): the worker does not edit. The tracker
    raises the board request instead (§ The tracker's board row), and the DU state follows the request
    (doc-impact-rules.md § 6a).
- **Hops.** The tracker dispatches or raises only the first hop. The owning skill carries the change on through
  its own documents chain, and every next-hop request, in either mode, keeps the CHG and the DU ID. The tracker
  reads every board request carrying that CHG or DU ID, whoever raised it, to fill the CHG Follow-up and the DU
  state.
- The CHG decider quote is each hop's acceptance: the owning skill asks again only when a record disagrees with it.
- The CHG row's Follow-up names every document the change reached with the version that records it, and every
  document that needed no change with the reason (`SDD: no change, contract unchanged`).
- A doc-owned gap closes through its DU (gap-rules.md). Only a question still waiting for its owner (a business
  decision, a provider fact) stays an open gap.
- The tracker hop is doc-impact-rules.md § 8: `sync` runs on its own once the DU is `Verified`, moves the baseline
  without asking, and does not mark the task that raised the DU `Stale`; `plan` runs for new scope. It reports the
  doc versions its baseline now holds.
- Scope the user leaves for later stays a gap (`Deferred` with the user's quote) that cites the document's TODO
  or open question recording it.
- An answer policy set for a tracker run answers only the tracker's own questions. Each hop keeps its skill's own
  stops and asks, unless the policy names that document.

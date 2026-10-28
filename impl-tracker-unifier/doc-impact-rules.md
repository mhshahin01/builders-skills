# Doc impact and doc updates

Goal: the BRD, SDD and LLD stay consistent with the code, without the builder ever editing a doc. Every point
found during implementation that needs a doc change is triaged (which docs), queued as a **doc update**
(`KEY/DU-NNN` in `tracking/doc-updates.md`) and applied by a **background doc worker** while the tracker
keeps building. A fresh verifier checks each update; then `sync` runs on its own.

The tracker and the builder still never edit a doc (SKILL.md rule 4). Only the doc worker does, and only for
a queued DU.

## 1. Triggers (automatic: never wait to be asked)

Any of these writes a gap **and** its DU row in the same step (SKILL.md rule 1a, paired writes):

| Where | Point found | Gap type |
|---|---|---|
| `start` 3c contract check | the code needs an API/event field the LLD contract lacks | `plan-gap` |
| `start` / build | the LLD is silent on a choice the code must make (LLD silent, rule 5) | `plan-gap` |
| build / `gap` | two docs contradict each other | `doc-gap` |
| audit (§ 4, minor row) | a decision fills an LLD silence without contradicting it (L-045) | `doc-update` |
| `verify` | behaviour differs from an AC and § 2 decides the doc is out of date | `doc-update` |
| `change` (CHG row) | a direction change the docs do not show yet | `doc-changed` |
| `plan` coverage check | an in-scope UC/AC/spec has no LLD unit | `plan-gap` |
| `discover` / `sync` | adopted code does something no doc describes and the user kept it | `doc-update` |

A gap whose Owner is brd-, sdd- or lld-unifier always has a DU. A gap without a DU is a lint FAIL (P15).

## 2. Who is right: code or doc (decided before any queue row)

Docs win by default. A point becomes a DU only when one of these holds; otherwise it is `code-drift` and the
code is fixed by a task.

| Case | Decision | DU kind |
|---|---|---|
| The doc is silent; the code fills the silence and contradicts nothing | doc follows code | `fill-silence` |
| Two docs contradict | the higher doc wins (SoW > BRD > SDD > LLD); the lower one is updated | `doc-conflict` |
| A decider exists: user quote in chat, a CHG row, an accepted audit finding (`accepted by user`) | doc follows the decider | `direction` |
| A contract the code needs is missing from the LLD (plan-gap) | LLD gets the field; the task waits for it | `contract` |
| The code contradicts the doc, no decider | **not a DU**: `code-drift`, fix the code | — |

Never queue a DU whose only reason is "the code already does it this way". That turns the spec into a
description of the code.

## 3. Impact level: which docs

The level is the **highest** document that now says something false or misses something the code needs.
Check upward mechanically, never by feel:

1. Start at the LLD anchor(s) of the point.
2. Follow the links the LLD anchor already has: BRD UC/AC/BR anchors, SDD §7.3 row, `INT-` links. Read only
   those sections (read budget).
3. A higher sentence is false, or the point changes what that doc owns (table below) → that level is
   affected, and every doc below it on the same chain too.
4. Unsure → pick the higher level (same rule as risk: unclear = high).

| Level | The change touches | Example |
|---|---|---|
| `LLD` | internal design only: class, column, index, internal error code, retry count, job schedule, file layout | "retry 3 times with 2s backoff" filled in |
| `SDD` | a component boundary: API or event shape between services, new component, data owner, tech choice, NFR, integration | new field on an event another service reads |
| `BRD` | what a user sees or a business rule: UC flow, AC, BR, UI text, role/permission, validation the user meets | "a resume can be re-uploaded only once a day" |
| `SoW` | scope or commercial terms | a feature dropped or added |

A DU of level `SDD` also updates the LLD; `BRD` updates BRD, SDD (when §7.3 or a contract cites the anchor)
and LLD. Each doc changed is listed in the DU's Docs column.

**Ripple:** an anchor cited by another feature's docs (`INT-` link, shared contract) → one more DU for that
key, same level rules, `Parent` = this DU. List the ripple before dispatch; never edit another key's docs
inside this DU.

## 4. Mode per level (`config.md` § Doc updates)

| Level | Default | Meaning |
|---|---|---|
| LLD | `auto` | queued and dispatched at once |
| SDD | `auto` | queued and dispatched at once |
| BRD | `ask` | queued as `Waiting-decision`; the worker still drafts it; one user word (`docs approve`) applies it |
| SoW | `ask` | same; never `auto` |

`auto` for BRD is valid only as `auto (user: "<quote>", <date>)`, written when the user says so in chat (the
same rule as § Delivery). A DU with a decider (CHG row with a user quote, `accepted by user`) is already
decided: it is dispatched at any level except SoW.

## 5. The queue (`tracking/doc-updates.md`)

Template: templates.md § Doc updates. One row per DU, written in the same step as its gap:

`Queued` → `Running` → `Applied` → `Verified`. Side states: `Waiting-decision` (BRD/SoW in `ask` mode),
`Rejected` (user or § 2 says no; reason required), `Failed` (2 failed verifications; a gap to the user).

Rules: never renumber, never delete; one DU per point (dedup by doc anchor: a second point on the same
anchor joins the open DU's What column); every DU links its gap and its task (or `—` with the reason).

## 6. Dispatch: one background doc worker

- **When:** right after a DU row is written with status `Queued`, if no worker is `Running`. Also at the start
  of every tracker command: `Queued` rows and no live worker → dispatch.
- **How:** Agent tool, `general-purpose`, `run_in_background: true`. The tracker does not wait: it goes back
  to the task. Outside Claude Code: run the worker as a separate pass at the end of the command.
- **One writer at a time.** The worker drains the queue: when it finishes, any newer `Queued` rows go to the
  next worker. Never two workers, never a worker and a human edit on the same doc file.
- **Batching:** all `Queued` DUs of the same doc file go in one edit and one commit, applied in ID order.
- **Order:** top-down per DU: SoW → BRD → SDD → LLD, so a lower doc always cites a higher text that exists.

### Worker prompt (fill the `<…>`)

```
You are the doc worker for <KEY>. Apply only these doc updates, nothing else: <DU rows: ID, level, kind,
anchors, What from -> to, Decided by>.
Docs root: <path>. Owning skills: load brd-unifier / sdd-unifier / lld-unifier for the doc you edit when
installed; otherwise follow the doc's own format exactly (heading style, keyed IDs, tables).
Rules:
- Edit only the listed anchors and the higher anchors listed with them. Never rename or delete a heading
  anchor: add a new one, or mark the old text "Superseded by <DU-ID>".
- Top-down: SoW, BRD, SDD, LLD. Keep every keyed ID (UC, AC, BR, INT, TC).
- Each changed doc: bump the minor version on its master/cover and add one changelog row that names the
  DU ID and the changed anchors.
- Commit in the docs repo, one commit per doc file batch, last paragraph: `Docs: <KEY/DU-NNN>[, …]`.
  Never push. Never touch code or tracking/.
- A point you cannot apply without inventing design or business intent: stop that DU and say why.
Reply: per DU: APPLIED <commit sha> <docs + new versions> | STOPPED <reason>.
```

## 7. Verify (fresh, read-only)

When a worker reports, the tracker sets each applied DU to `Applied` and starts one fresh read-only verifier
(Agent tool, faster model, background). Nobody grades their own work (rule 8). It checks, with evidence:

1. The docs diff touches only the DU's anchors; no anchor renamed or removed (grep the old anchors).
2. Higher docs still agree with the lower ones at those anchors (no new contradiction).
3. For `fill-silence` / `contract` / `doc-update`: the doc now matches the code at the cited `file:line`.
4. Version bumped and changelog row present, naming the DU.
5. Nothing invented: every new sentence traces to the DU's What or its decider.

PASS → `Verified`. FAIL → back to `Queued` with the findings appended (attempt 2). Second FAIL → `Failed`
and a `doc-gap` (major) for the user. Verdict rows go in the DU's Verified column; no report file.

## 8. After Verified: sync runs on its own

1. Run `sync <KEY>` (sync-and-drift.md). A version bump made by a DU needs no baseline question: the decision
   was made; move the baseline and note the DU IDs.
2. The task that raised the DU is **not** marked `Stale` by its own DU (the doc now matches its code).
   Every other task citing a changed anchor goes `Stale` / `Done-stale` as usual.
3. Close the DU's gap with the docs commit and the new version as evidence.

## 9. Gates

- **start:** a task citing an anchor with an open DU (`Queued`, `Running`, `Applied`, `Waiting-decision`):
  - DU kind `contract`, DU level `SDD` or above, or task risk `high` → refuse; the task waits; offer the next
    ready task (async: the tracker keeps building other work meanwhile).
  - otherwise (LLD-only, low risk) → proceed; note the DU in History.
- **done (P15):** every DU the task raised is listed under the card's `## Doc updates`, and none is `Failed`
  or `Rejected` without a reason. A DU still `Queued`/`Running` does **not** block Done (async), except kind
  `contract`, which must be `Verified`.
- **slice deliver / Verified:** no open DU on any anchor the slice/task cites.

## 10. Recovery

- A `Running` DU whose worker reported nothing (stopped, failed, or no notification after 30 minutes) → back
  to `Queued`, attempt + 1; the next command redispatches it.
- Worker STOPPED a DU → `Waiting-decision` with the reason; it appears under "Needs your decision" in standup.
- Docs repo has uncommitted changes before dispatch → do not dispatch; open a `doc-gap` (blocker for the
  queue) and show the files. Never overwrite someone's doc edit.

## 11. Consistency is measured

`status` and `report` show per key: DUs open by state, DUs verified this week, and **doc drift** = open
`doc-gap` + `plan-gap` + `doc-update` + `code-drift` + `doc-changed` gaps. The target is drift 0 at every
slice delivery.

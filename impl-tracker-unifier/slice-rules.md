# Slice rules (slice mode)

Slice mode plans and tracks work as an ordered list of **slices**: user-visible outcomes that are built and
delivered end to end (DB, API, UI, E2E, audit) one after another. It changes only grouping and order; every
gate in status-rules.md and audit-rules.md still applies to every task.

## 1. Turning it on

- Per feature key, in `config.md` § Features column `Mode`: `layer` (default) or `slice`.
- `plan KEY slice` sets `slice` for that key; `plan KEY reslice` sets it and regroups existing tasks.
- `config.md` § Slices holds the **slice order**. The order is the user's decision: the tracker proposes one
  and asks; it writes the user's answer as `order (user: "<quote>", <date>)`.
- That Order cell (`tracking/config.md` § Slices, in the code repo) is the one home of the slice order. Each slice
  card's Tasks field, with each task card's `Slice` field, says which slice builds a unit. lld-unifier reads them
  to fill the LLD's build columns (05 § 8.5 Build unit, 13 § 16.8 Runs from) in this order. A
  `slice order` or `reslice` that changes them reaches the LLD through SKILL.md § Documents chain when its build
  columns cite slice IDs.

## 2. What a slice is

| Field | Rule |
|---|---|
| ID | `KEY/S-NN`, permanent, never renumbered (order lives in config, not in the ID) |
| Title | The outcome as the user would report it: "Create account and sign in, end to end" |
| Use cases | The keyed UCs (or parts: `UC-12 A2`) it delivers; each in-scope UC part belongs to exactly one slice |
| Tasks | Every task belongs to exactly one slice (`Slice` field on the card) |
| Demo | One or two sentences: what can be shown when it is Delivered |
| Out of scope | What is deliberately left to a later slice or follow-up (prevents double build) |
| Status | `Planned` → `In progress` → `Delivered`; side state `Reopened` |

A slice must contain at least one UI task (or state why none: a backend-only outcome such as an alert) and
the e2e spec task(s) of its UCs. A slice too large for about 3 to 8 tasks is split into two slices.

## 3. Building slices (`plan KEY slice`)

1. Extract tasks exactly as task-splitting.md says (units, sizing, Why, Risk, dependencies).
2. Group by user outcome: start from the use cases the user names; each slice takes the tasks that realise
   its UCs (data, domain, api, events, ui, e2e).
3. **Foundation goes into the first slice that needs it** (task-splitting.md § Slice placement), never into a
   separate phase or a "foundation slice". A foundation task needed by several slices lives in the earliest.
4. Check the order: a task may depend only on tasks in the same slice or in an **earlier** slice. A
   dependency on a later slice is either moved earlier (the task joins the earlier slice) or, if the user's
   order forbids that, cut with a temporary stub task in the earlier slice plus a follow-up task in the
   later one. Record the choice in plan.md § Planning decisions.
5. Small temporary pieces a slice needs from another feature (a stub, a minimal store) are tasks in that
   slice with Why "temporary, replaced by <task/slice>" and a follow-up task or gap that replaces them.
6. Show the slice table (order, title, UCs, task count, risk count, demo) with the DAG, and ask for
   approval of both the grouping and the order.

`plan KEY reslice` does the same on existing tasks: assigns each task a slice, never renumbers, never changes
status or evidence. Done/In progress tasks keep their place; a slice whose tasks are all Done is proposed as
`Delivered` only after `slice deliver` passes.

## 4. Working inside slices

- **Current slice** = the first slice in the order that is not `Delivered`.
- `next` and `wave` pick only from the current slice. Tasks of later slices are not offered even when ready.
- Override: the user may say, in their own words, to work ahead on a later slice; record it in the journal.
  The current slice stays current.
- `start` prints the slice (ID, title, demo) at the top of the task brief.

## 5. Delivering (`slice deliver KEY/S-NN`)

Gate, all required:

1. Every non-Dropped task in the slice is `Done` or `Verified`, each with a linked audit report PASS /
   PASS-minor (or a quoted user skip).
2. `preflight.py --tracking <t> --slice KEY/S-NN` passes (task statuses, audit links, no open blocker or
   major gap linked to the slice's tasks).
3. The slice's e2e spec(s) pass on the current code: reuse the last passing e2e run recorded on the slice's
   e2e task (auditor or pre-flight) when its tree hash equals the code at HEAD (tracking files excluded)
   and it had 0 failures and 0 skips; otherwise run them now (local stack up, audit-rules.md § 3a).
   Record the command, counts and tree hash, or "reused <link>, tree <sha>".
4. No task in the slice is `Stale` or `Done-stale`.

Pass → slice `Delivered` with date, agent, evidence links; the next slice becomes current. Fail → list what
is missing; the slice stays `In progress`.

A task of a Delivered slice that is reopened sets the slice to `Reopened` until it is delivered again.

## 6. Report (`report [KEY]`)

Short, manager-ready, from `index.md`, slice cards and `gaps.md` only:

- Delivered (with date): slice titles and their demo line.
- In progress: current slice, tasks done of total.
- Next: the following one or two slices.
- Blockers: open blocker/major gaps on the current slice, in plain words.

No task IDs unless asked; write it to `journal/report-YYYY-MM-DD.md` and print it.

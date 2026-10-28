# impl-tracker-unifier: plan

Read from SKILL.md § Workflow per command. Rules, read budget and quality checks stay in SKILL.md.

## plan

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
   every endpoint in scope, and every unit of each kind in task-splitting.md's unit map has ≥ 1 task. Missing → `GAP` type `plan-gap` (the LLD has no unit for it)
   or task added.
8. Show the plan summary (phases, counts, DAG Mermaid, gaps, **existing-code match table** with
   confidence - discovery-rules.md § 3, and the **risk table**: each task's Risk with its reason,
   task-splitting.md § Risk) and **ask for approval** before writing
   task cards. On approval write `KEY/plan.md`, task cards, update `index.md`, `ownership.md`.

**Slice mode** (`plan KEY slice` / `reslice`, or `Mode: slice` in config): after step 5c, group the tasks into
slices and check slice order per slice-rules.md § 3; step 8 shows the slice table first and asks for the
grouping and the order; on approval also write the slice cards and `config.md` § Slices (the home of the
slice order that lld-unifier reads: slice-rules.md § 1).

Re-running `plan` on a planned scope is a **re-plan**: it diffs against existing tasks, never renumbers,
never deletes (unused tasks become `Dropped` with a reason), and keeps all status/evidence.

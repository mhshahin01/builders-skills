# impl-tracker-unifier: wave

Read from SKILL.md § Workflow per command. Rules, read budget and quality checks stay in SKILL.md.

## wave

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

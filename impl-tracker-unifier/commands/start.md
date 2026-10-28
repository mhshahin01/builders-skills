# impl-tracker-unifier: start

Read from SKILL.md § Workflow per command. Rules, read budget and quality checks stay in SKILL.md.

## start

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
   Then one fresh reviewer (Agent tool, `general-purpose`, model `haiku`, about 3 minutes, read-only) checks
   the design check against the cited docs. Pass it **only** the card's `## Design check` text and the cited
   anchor sections pasted inline (never the whole doc file, never the code); it returns missing invariants,
   cells or neighbours, at most 10 lines. Fix and record "design check: reviewed" in History.
   It never replaces the audit.
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

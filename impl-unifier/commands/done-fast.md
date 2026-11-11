# impl-unifier: done (the path of a task that passes)

Read from SKILL.md § Workflow per command. Rules, read budget and quality checks stay in SKILL.md.
This file is the whole of `done` while nothing fails. After an audit FAIL, a full pre-flight FAIL or a
mutation survivor that needs a second round, read `commands/done-fix.md` as well; not before.

## done

Accepts one or several ids: `done KEY/T-a[,KEY/T-b…]`. Every step runs per task.

**Read by section, not by file.** From `audit-rules.md` read only § 1, § 4 and § 6 (or § 6a), found by
grepping their headings; the auditor reads the rest itself. From the task card read the sections a step
needs (Owns, Touches, DoD, Tests, Design check, Removals). From script reports read only FAIL/WARN rows and
line 1. SKILL.md § Read budget: large files applies to every tracking file.

**Fast path, in this order, each once (target: one pre-flight, one audit):** lint → `--quick` → `--mutate`
(fix or list every survivor) → commit everything (code, docs, binaries: tree clean) → `--removals` on the
final code → pre-flight → audit. The pre-flight defers the full suites by default (step 2b): they run once
at the wave end and at `slice deliver`, not once per task and again after every fix.

1. Collect evidence: commits with `Task: KEY/T-NNN` (git log), changed files, unit tests added.
   A Partial task with no start commit first runs `start` steps 1-4 (gates, start commit) - never a
   hand-picked start sha.
1b. **Bring the test environment up:** `preflight.py --tracking <t> --doctor` (seconds). It starts Docker
   when down (never installs or reconfigures it), recreates a missing verify worktree, checks Node against
   every `engines.node`, and checks the shared test database's connection headroom (classes × pool under
   80% of `max_connections`), and checks that every port in config.md `Test ports` is free (D5: a dev server
   left on a port a test binds fails the suite only after minutes). `--quick` runs the doctor too and stops in
   seconds on a FAIL. Only one `--quick`, `--mutate`, `--removals` or full run may run at a time per tracking
   folder (`tracking/.preflight.lock`; a second prints `PRE-FLIGHT: BUSY`): two runs share the checkout, the
   test database, LocalStack and the ports, and break each other. A `--quick` class that hangs is stopped at
   15 minutes (`PREFLIGHT_QUICK_TIMEOUT`) and named in the row. Start the local compose stack if the project has one. Any doctor FAIL → fix it
   before pre-flight; never ask the user first. The pre-flight also runs the doctor first, and **fails
   fast**: when a doctor, paperwork or lint row fails, it skips the tests (seconds, no report written)
   instead of spending minutes on tests whose result cannot count.
1c. **Lint first (seconds).** `python <skill>/scripts/preflight.py --tracking <tracking> --task KEY/T-NNN --lint`
   runs every check except tests and the stack (it also compiles each Java `## Removals` guard file with the guard
   line deleted, javac against the module classpath, seconds: a guard that cannot go alone fails here), accepts
   uncommitted work, and prints ready-to-paste
   `## Touches` lines for files outside Owns. Fix everything it reports before the pre-flight: Touches
   paths, Risk floor (P9), trailers, card/index status, lesson coverage (`checks.json`), the removals list (P14)
   and the tests map (**P19**: every `## Tests` clause ends with ` → `Class#method`` or
   `file.spec.ts#test name`, naming a test that exists; `- no test: <reason>` for a clause with none). It writes
   no report, ends with `LINT: PASS|FAIL`, and never stands in for the pre-flight. Lint fails on an uncommitted
   doc or binary (`.md`, `.pdf`, images, Office files): commit it now, never after `--removals`.
1d. **Quick tests (about two minutes).** `python <skill>/scripts/preflight.py --tracking <tracking> --task KEY/T-NNN --quick`
   runs the tests a task can break, in one run per build module: its own test classes, config.md
   `## Always-run tests` (architecture rules, schema gates), the test classes that name a table its migrations
   seed or alter (P16), and the covering tests of its changed classes (those naming them or in their package).
   P12 also names any test that still pins a schema's previous highest migration. Green here before `--mutate`,
   `--removals` or the pre-flight. A passing `--quick` is kept with its code tree: the pre-flight reports
   **P5 related tests** `reused from --quick` while the code is the same, instead of running them again.
   Every full-suite failure so far (T-006 pinned version, T-007 second bean, T-009 ArchUnit, T-029 pinned row
   count) sat in this set, which is why it can stand for the suites until the wave end.
   Report files the scripts write under `tracking/` (removals, pre-flight) need no commit before the next run:
   P1 ignores `tracking/`; commit them with the next status change. Console output shows line 1 and FAIL rows only (WARN counted)
   (`--verbose` for all); never grep a full report back into the context.
   `--own` runs only the task's own test classes (seconds to a minute; never stands in for `--quick`). Several
   `--task` on one `--quick` run the union of their related sets once and count for each task (wave mode).
   A class that fails in the run but passes alone once is re-run by pre-flight itself and logged in
   `tracking/flakes.md` (WARN, not FAIL; at most 3 classes); `--close-out` turns each into a minor gap.
   **Before every pre-flight, `--lint` must print `LINT: PASS`;** when tests were removed on purpose, pass
   `--accept-count "<reason>"` on the first run. A gap with no doc point is written alone, never through `--gap-du`.
   The removals report stays valid until production code, a build file or a test it names changes; a fix to
   another test (a neighbour's pinned count) or to docs keeps it. The pre-flight reuses the `--mutate` result
   while the code equals what `--mutate` ran on, so mutation runs once.
   **Nothing beside a run:** while a `--quick`, `--mutate`, `--removals` or full run holds the lock, run no Maven,
   npm or lint command (lint prints `LINT: BUSY`) and leave the code tree as it is: a load spike breaks container
   start-up (LocalStack timed out once) and an uncommitted edit fails P1 after the run. Read and design meanwhile.
   **Commit with** `preflight.py --tracking <t> --commit KEY/T-NNN --message "<subject>" --paths <paths>` (`--tracking-only` for a
   paperwork commit, `--coauthor "<value>"` for the attribution line): it stages only those paths and writes the trailer block
   correctly, so a blank line never pushes `Task:` out of the trailers.
   **Shared checkout:** another session's commit inside this task's range is listed on the card under `## Other sessions' commits`
   with the user's words quoted, and P2 then skips only those shas. Never move the start commit past the task's own code.
2. Check: every owned item exists in code; DoD checklist ticked. Missing → stay `In progress` and list
   what's missing, or the user splits it (new task, `depends_on` this one).
2a. **Self-replay lessons.** Every lesson created or hit during this task, and every lesson in the brief,
   is checked against **every class in the task diff**, not only the class that triggered it. Record the
   result per lesson in the History row (for cache or concurrency lessons: each cache field and the test
   that covers it).
2a+. **Builder self-check (≈ 2 min, before pre-flight).** Answer each with file:line, fix any "no":
   every new class/function has a test; every `## Tests` clause names its test on the card (P19 checks that
   the test exists; the self-check asks whether it asserts the clause); every external call (HTTP, key fetch,
   queue, mail) has a timeout and a tested failure path; every retry/idempotency rule in the LLD is kept on
   retry; UI copy matches the Figma frame / BRD text word for word; every item on the task-splitting.md §
   Risk `high` list in the diff has its LLD check (authZ, ownership, session/token end, clock source); errors
   logged once, no PII; every outcome value the code computes is asserted by a test, including one seen only
   in a log line (11 of 15 first survivors in SHAREDKERNEL/T-010), so `--mutate` runs once. Record
   "self-check: OK" or the fixes in the History row. The self-check is never audit evidence;
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
2a++. **Local mutation (minutes, before the pre-flight; L-060):**
   `python <skill>/scripts/preflight.py --tracking <tracking> --task KEY/T-NNN --mutate` runs mutation on the
   task's changed classes (uncommitted work included) against the task's own test classes only (PIT
   `-DtargetTests`), and prints each survivor with its code ready to paste under `## Equivalent mutants`.
   It is stricter than the full run (only the task's tests may kill a mutant). Fix or list every survivor,
   all of one round in one pass (done-fix.md § Fix rounds), then run the pre-flight once. Its raw result is
   kept with the code tree it ran on (uncommitted work included); the pre-flight reuses it while the code is
   the same and it passes against the cards (P10 row `reused from --mutate`), so a fix found here never costs
   a second mutation run. Record "local mutation: N classes, 0 survivors / listed" in the self-check row.
2b. **Pre-flight (mandatory before any audit that can set a task Done):**
   `python <skill>/scripts/preflight.py --tracking <tracking> --task KEY/T-a [--task KEY/T-b …]`.
   It checks: clean tree; commits (start commit, exactly one `Task:` trailer each); card/index status;
   every owned item; **P14** removals report current and passing; **P15** every DU the task raised is listed
   on its card, none Failed, a `contract` DU Verified, every doc-owned gap has a DU (also in `--lint`); **P12** an added migration is above every version present at start (L-014); **P13** no
   second bean of a single-instance type (AWS clients, `HttpClient`, `JsonMapper`…; L-061) - both also in
   `--lint`; **P19** tests map (also in `--lint`); **P10 mutation** on the task's changed production files (templates.md § Mutation
   suites: every surviving mutant gets a test or a reasoned `## Equivalent mutants` line - fix these here,
   never leave them for the audit); **P11 template bindings** (each behaviour binding the task adds to an
   `.html` template is mapped under `## Template bindings` to a spec test that exists; also in `--lint`);
   the tests (below); the local stack; every lesson's check (each Active lesson
   must be covered); task isolation (files changed only within Owns or `## Touches`); and the risk floor
   (P9: a high-risk line in the diff needs `high`, a touched file holding high-risk code needs at least `medium`).
   FAIL → fix and re-run; no audit until it passes.
   **The suites are deferred by default (rule 8f).** The related tests (the `--quick` set, reused when the code
   is the same) stand for the full suites, and the report says `P5 suites | deferred to the wave or slice end`.
   The full suites then run once: at the wave end with `--full-suites` and `--task` every wave task (wave.md
   step 6), and at `slice deliver`. The script runs them now, and says why in the row `P5 suites | not deferred:
   <reason>`, only when the diff adds a bean type (an added `@Component`, `@Service`, `@Repository`,
   `@Configuration`, `@Bean` or controller line), touches a config or build file, or has production code no
   passing `--mutate` covers. A migration does not block: its neighbours (P16) run in the related tests. Never
   pass `--full-suites` on a per-task run to be safe: the per-task full run, repeated after every fix, was the
   largest single cost in the first 204 tasks (255 runs, median 6 minutes, 10 to 12 at the end).
   When the suites do run: every required suite is counted by `<testcase>` (any skip, failure, error, zero
   tests, or fewer tests than last time fails); required suites run in parallel (backend beside frontend, each
   Angular project its own suite) and every suite row ends with its time in seconds. Beside them, each in a
   private copy of the Maven module (the backend suite starts with `clean`): the `--quick` set as **P5 related
   tests**, whose failure stops the suites at once, and a Maven mutation suite the `--mutate` result does not
   cover. Suite rows are kept by code tree: a run on code another task's run (or the wave run) already passed
   on reuses those rows, and only a required suite with no passing row runs again. **P16** (INFO) lists the
   migration neighbours.
   It writes `tracking/KEY/preflight/T-NNN-<sha>.md`; **link** that file from the History row (don't paste
   the table). Adopted tasks run the same command (Adopted mode is automatic: no commit checks).
   **Where it runs:** in the permanent verify worktree named in `config.md` § Verify worktree when one is
   set, moved by the routine in templates.md § Verify worktree (detach to the head, clean everything but
   `node_modules`, `npm ci` only when `package-lock.json` changed), so a live IDE or dev server in the main
   checkout is never disturbed and installs are not repeated (L-028). Copy the report back into the main
   tracking folder before committing it.
3. Set `In review`. Build the auditor's inputs with `preflight.py --tracking <t> --audit-pack KEY/T-NNN`
   and name the printed file in the prompt. **Run the audit** (audit-rules.md) - mandatory; an agent cannot skip it, only the user
   in chat (then record `audit skipped by user: "<quote>"` in History and open a major gap). Launch the auditor
   with `run_in_background: false`: the turn waits for the verdict and goes straight on to Done.
   - The audit runs on a **clean export** of the task's last commit (audit-rules.md § 1a), never on the
     working tree, and sees **only this task's commits** (§ 1, input 3).
   - **Depth follows the task's Risk** (audit-rules.md § 1): `high` → strongest model, full prompt;
     `medium` → strongest model, focused prompt (§ 6a), 10-minute budget, one hands-on probe;
     `low` → faster model, focused prompt; missing or unclear → `medium`.
   - **No-I/O tasks at `high`** (size S or M; the diff adds no endpoint, migration, UI, event, external call
     or job): focused prompt (§ 6a) on the strongest model, 10-minute budget (audit-rules.md § 1).
   - **Several tasks:** one fresh auditor per task, launched together in one message (foreground, not in
     the background), up to 3 at once when each runs only its targeted classes, at most 2 when their tests
     start containers. Each gets only its own task's
     inputs and writes its own report and verdict.
   - After every audit, **including a stopped or failed one**, run `git status` on the code root and revert
     anything left behind before the next commit.
3a. **Recompute the verdict** (audit-rules.md § 4): an incomplete reply or `RISK: high` is no verdict
   (re-run at high); any blocker or major, any LAYERS row marked FAIL or without evidence, is FAIL,
   whatever the auditor wrote. Line 1 of the report carries the recomputed verdict.
4. PASS / PASS-minor → set `Done`, record evidence + audit report + pre-flight report links (one command:
   `--close-out`, see wave.md step 9; lint accepts a Done card there); recompute
   readiness of dependents and print which became Ready. FAIL → back to `In progress`; read
   `commands/done-fix.md` and follow it.
4a. **History.** After the verdict (PASS or FAIL), rebuild `tracking/history.md`:
   `python <skill>/scripts/preflight.py --tracking <tracking> --history` (seconds, no tokens; in a wave, once after
   the last verdict). Never edit `history.md` by hand and never add problems, causes or recommendations to it: it
   holds only what git, the clock, the cards, the reports, lessons.md and gaps.md record (scripts/history.py).
   Its `## Speed` block (per week: median active time, pre-flights and audits per task, first-audit pass rate,
   suites deferred, suite and mutation reuse, and why suites were not deferred) is where a change to this skill
   is judged; read that block, not the whole file.
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

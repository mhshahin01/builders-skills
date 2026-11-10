# impl-tracker-unifier: wave

Read from SKILL.md § Workflow per command. Rules, read budget and quality checks stay in SKILL.md.

## wave

Builds several tasks in one pass without loosening any gate. Target: a 3-task wave in about one hour
(user, 2026-11-02: "I agree to all points"). Only the order changes: every task still gets its design check,
`--quick`, `--mutate`, `--removals`, one full suite run (shared) and its own fresh audit.

**Where the time goes and why this order** (S-17 wave 2, one task, about 1 h 20 min): the full suite is 12 min
and ran once per task and again after every fix; design and coding ran one task after another; one audit FAIL
cost a second cycle. So: build in parallel, test in series, run the full suite once, audit in parallel.

1. **Pick the set.** Grep `index.md` for rows not Done/Verified/Dropped and `ownership.md` for the candidates'
   Owns rows. Candidates = tasks that pass the `next` readiness rule (in slice mode: current slice only).
   Pick in `next` order such that:
   - no two share an owned item (ownership.md), and no two touch the same production or test class
     (Owns + Touches + the classes their design will change; a later task must not make an earlier task's
     removals report stale);
   - none depends on another in the set;
   - **size: up to 3 tasks, up to 3 of them risk `high`** when they share no file (user approval
     2026-11-02, config.md § Delivery `Wave size`); total size ≤ 3 M (S = ½, M = 1, L = 2). Without that
     config row the old limit applies: at most one `high`, at most 2 tasks when the slice is mostly `high`.
2. **Show the set** (id, title, risk with reason, owned files, why grouped) in one short table. When
   config.md § Delivery holds `Wave size` and the session was told to build without asking, go on;
   otherwise ask once.
3. **Start every task first, in series (seconds each):** `start` steps 1-4 for each (gates, Risk re-check,
   card status, `--history-start`). Fix each card's Owns/Touches to the lint format now and run `--lint` on
   all of them in one call (`--task A --task B --task C`): paperwork never reaches a builder. **Commit the start
   paperwork (cards, index, history clock) before launching builders**, so their worktrees are cut after it and
   a cherry-pick never conflicts on the card (S-17 wave 3).
4. **Build in parallel (C).** One builder per task, launched together in one message (Agent tool,
   `general-purpose`, strongest model for risk `high`, `isolation: "worktree"`, foreground). Each builder:
   - gets only its own task: the card, the cited LLD anchors (paths#anchors), the Lessons that apply with
     their Checks, the neighbour classes to read, and these rules;
   - writes `## Design check` first (risk `high`: invariants I1…In with anchors, state/timing table, neighbour
     scan, contract check, test plan, **Test map naming a latch-parked repeated test for every shared-state
     invariant (P17)**, `## Removals` lines that can go alone), then the code and tests;
   - **runs no test, Maven, npm or pre-flight command** (the test database, LocalStack and the ports are
     shared; only the tracker runs tests). It may run `mvn -q -o compile` / `test-compile` in its worktree
     only when no tracker run holds `tracking/.preflight.lock`; otherwise it reads compile errors from javac
     on single files (`javac -proc:none -d <tmp> -cp <module classpath>`; the lint classpath cache is in
     `tracking/.classpath-cache.json`);
   - **follows the builder pitfalls** (each cost a test round in S-17 wave 3):
     - Spring `JdbcClient...single()` throws on a null column value (an aggregate like `max(id)` on an empty
       table, a nullable column): use `.optional()` / `query(...).list()` or `coalesce` in SQL;
     - a `timestamptz` read with `getObject(col)` is `java.sql.Timestamp`: read `getObject(col, OffsetDateTime.class)`
       (or `Instant` via `rs.getTimestamp(col).toInstant()`);
     - test fixtures must survive every later filter: `PostingFilterChain` drops duplicates by title+company, so
       fixtures use distinct titles and companies, or a test reads before the chain (a seam such as
       `prefiltered()`);
     - a `smallint` column reads back as `Integer` (not `Short`); `SKIP LOCKED` / claim queries return rows in no
       fixed order unless the SQL says `ORDER BY`: tests never rely on claim order (S-17 T-160);
     - **shared test DB (L-100):** assert only on rows the test created (its own ids, host, board, profile), and the
       teardown removes or restores every shared row it changed, counters included;
     - **removing a code path (L-099):** grep `src/test` for every test that still feeds or asserts the removed path
       (ports, beans, fakes, e2e) and move each in the same commit; then run `--quick` (not only `--own`) before
       returning, so a related e2e fails in the builder's 4 minutes, not after the tracker's 16-minute full run;
     - **one clock per run (L-101):** read the clock once at transaction start and pass that instant to every write
       and decision of the run;
     - **every count or threshold guard (`>=`, `>`, `== N`, limits, back-off caps) gets boundary tests at N-1, N
       and N+1**; every SQL predicate (WHERE, status filter, time window) gets a test that observes it before any
       later filter chain, so a mutant or a deleted guard is not masked downstream;
   - writes the card's `## Owns` (one kind and full path per line), `## Touches` (one file per line) and the
     `## Lessons that apply` status lines (`- L-NNN: applied - <file:line or test>`) in the lint format;
   - commits in its worktree branch: code and tests in one commit with exactly one `Task:` trailer, the card
     (Design check, Removals, Lessons, Test map) in the same commit; returns the branch, the commit sha and a
     5-line summary (claims, open questions). It edits nothing outside its Owns and Touches.
   **Wave of one:** the builder works in the main checkout (no worktree) and runs `--own`, `--lint` and then
   `--mutate` itself (lock-enforced, one at a time) and returns only when all three pass, survivors killed or
   listed under `## Equivalent mutants` with a reason; its own-class bugs and survivors are fixed while its context
   is warm (S-17 T-156: 78 min of tracker-side fix rounds). It fixes every survivor of a round before re-running.
   **Assert every computed value (all builders):** each value the code computes and returns, stores, emits or
   counts (result fields, counters in a summary record, metrics, timestamps, back-off delays) gets an assertion of
   its exact value in a test; a counter used only in a log line is a local variable, never a field or result (then
   P10 marks it `auto (log-only counters)`). Most survivors are an unasserted computed value.
   While the builders work, the tracker runs the design-check reviewer (haiku, step 3c) for each card as it
   lands, or reads the next task. Never two builders on one file.
5. **Bring the builds in, then test in series (one run at a time, lock-enforced).** For each task in `next`
   order: record its start commit (`git rev-parse HEAD` before the cherry-pick) on the card, `git cherry-pick`
   its builder commit onto the main branch (a conflict means two tasks touched one file: stop and run that
   task alone later), then at once `--own --task <it>` (its own test classes only, a minute; builder bugs show
   here, not in the related set). After every build is in and green on `--own`: **one wave `--quick` with every
   wave task's `--task`** (the union of the related sets runs once; each task's later full run reuses it), then
   per task `--mutate` (skip when the builder's `--mutate` passed on this tree: the P10 cache says `reused`) →
   fix → commit → `--removals`. **One tool call per phase chain:** run the tracker's chain as one background
   command, `--quick ... && --mutate ... && --removals ... && <full run>`, so a pass needs no round trip between
   phases and a FAIL stops the chain at the failing phase. Never pipe a gate into `tail`/`cut` inside an `&&`
   chain (the pipe's exit code hides a FAIL; T-159 code was pushed while In review): `set -o pipefail` or no
   pipe; `--push-check` runs unpiped right before `git push`; `--close-out --gap` text holds no `|`. Fix each FAIL here, in the main checkout. P14 judges a
   task's removals report only by its own Owns/Touches files, guard files and named tests, so another wave
   task's fix never makes it stale. Nothing else runs beside a test run (lint prints `LINT: BUSY`).
   A per-task pre-flight inside the wave uses `--defer-suites --wave` (a migration task may defer too), or is
   skipped when the wave-end full run comes next anyway.
6. **One full run for the wave (A).** After the last task's removals: one pre-flight with every wave task's
   `--task` and no `--defer-suites` (12 min, once). A red suite reopens only the task whose classes fail. A class that fails in
   the related set or a suite but passes when re-run alone once (test order, a container start-up time-out such
   as LocalStack) is a flake: pre-flight re-runs up to 3 failing classes alone, marks the row WARN, appends it to
   `tracking/flakes.md`, and the run passes; the close-out logs it as a minor gap. Target: one full run per wave.
7. **Audit in parallel (D).** Set every task `In review`, create one export per task (`git worktree add
   --detach`), and launch one fresh auditor per task in one message (risk `high` → opus full prompt; `low` →
   sonnet focused). Auditors run only their task's targeted test classes, so up to 3 run at once; an auditor
   that needs the full suite or a container-heavy class waits for the others (audit-rules.md § 1b).
8. **Verdicts.** PASS/PASS-minor → Done; minor findings become gaps, never a new cycle (lean audits). FAIL →
   fix, `--removals` first when a guard is touched, then `--quick`/`--mutate`, one full run for all reopened
   tasks, delta re-audits in parallel.
9. **Bookkeeping once per wave:** during the wave write only what a gate needs (card status, History row,
   audit/pre-flight links). Journal entry, minor-finding gaps, lesson dedup/promotion, `checks.json`,
   `--history` and `index.md` regeneration run once, after the last verdict, **one command per task**:
   `preflight.py --tracking <t> --close-out KEY/T-NNN --audit-report <file with the auditor's returned text>
   --reason "Audit 1 PASS-minor …" --evidence "Pre-flight: …"
   --evidence "Removals: …" --evidence "Audit: …" --gap "type|severity|anchor|text|owner" --gap
   "doc|minor|anchor|text|doc-skill||level|kind|anchors|what|decided" --journal "<one line>"` (gaps, DUs with the
   DU named in the gap's Owner, flakes, Evidence, the audit saved as `audits/T-NNN-audit-N.md` and linked (slice gate S1),
   Done on card and index, journal, `--history`; after the slice's last task it runs the slice gate `--slice` itself); then commit the tracking,
   `--push-check`, push (config.md § Delivery). A FAIL's blocker/major gaps and its lesson are still written
   at once (rule 7). Remove the builder worktrees and the audit exports.

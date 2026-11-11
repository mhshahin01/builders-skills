# impl-unifier: done, after a FAIL

Read only when something failed: an audit FAIL, a pre-flight FAIL that needs code, or mutation survivors.
The steps of a passing task are in `commands/done-fast.md`; step numbers here refer to it.

## After an audit FAIL (step 4)

1. Card back to `In progress`. Print the findings as a fix list, open gaps for blockers and majors, capture
   the lesson now (lessons-rules.md); every doc point becomes a gap + DU (doc-impact-rules.md § 1).
2. Run each new or sharpened lesson's Check against **every class in the task diff**, not only the class the
   finding names (L-009), before the next audit.
3. Fix in the order below, then re-run `done` for the failed tasks only. The re-audit is a **delta
   re-audit** (audit-rules.md § 1c) in the reused export, always at `high`: build its inputs with
   `preflight.py --tracking <t> --audit-pack KEY/T-NNN --since <failed head>`.

## Order after any fix (audit finding or your own)

`--quick`, then `--mutate` (fix every survivor in one pass), then update `## Removals` and the `## Tests`
map, commit, run `--removals`, then the pre-flight. Mutation takes minutes and finds most gaps; removals is
the slow step and must run on final code (T-078: removals before mutate cost a second 19-minute run).
`--removals` reuses each guard whose task code and named tests are unchanged since it was last killed
(`reused` rows; `--all-guards` runs them all), so a test-only fix re-runs only its own guards.

The pre-flight after a fix defers the suites like any other (done-fast.md step 2b): a fix does not buy a
full suite run. A fix that touches a build or config file, or adds a bean type, makes the script run them,
and the report says so.

## Fix rounds (S-17 T-156: 8 rounds x 9 min)

PIT 1.30 has no free incremental history (it needs the arcmutate plugin), so cut rounds instead. Survivors on
a local counter step whose every read is a log call are `auto (log-only counters)`, shown in the P10 row for
the auditor, never a FAIL. Fix all survivors of one round in one pass (one fixer, every listed line) before
the next round; never one round per survivor.

## The second FAIL (audit-rules.md § 4, loop limit)

After the 2nd FAIL on the same task the tracker stops and asks the user (fix and re-audit, split, or accept
the findings as gaps), with one exception that needs no question:

**One automatic fix round when every finding is test-only.** It applies when all of these hold:

- the auditor's summary states the production code is correct as written, and no finding is a blocker;
- every finding is a missing, weak or mis-mapped test, a guard with no test, or card text (Tests map,
  Removals, Lessons lines): nothing asks for a production change or a doc decision;
- after the fix, `git diff --name-only <failed head> HEAD` (code paths only) lists test files and the card
  alone (`src/test/`, `e2e/`, `*.spec.ts`, `tracking/`).

Then fix, follow the order above, and run the delta re-audit without asking. Record
`auto fix round after audit 2: test-only findings <ids>` in the History row. If the fix turns out to need a
production line, stop before committing it and ask as before. A 3rd FAIL always stops and asks: three FAILs
mean a doc-gap, a wrong split or a missing P10 suite, not a careless builder.

Why the exception exists: a task whose code is right but whose proof is thin (AUTOAPPLY/T-208 audit 2: two
missing tests) waited hours for a decision that had only one sensible answer.

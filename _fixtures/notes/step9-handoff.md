# Run step 9 of the unifier enhancements plan

> **Not run (2026-10-08).** The user chose a short close-out instead of step 9: D1 A and D2 A are applied, the step 8 records are closed, and the plan is Done. Use this handoff only if real use calls for the proof round; then skip stages 0a and 0c, and read the state from `git log` first.

You are running step 9, the second and last proof round, from its start. Its exit rule (`step9-plan.md` § Exit rule) ends the plan: there is no step 10.
- Repository: `C:\Users\negat\.claude\skills` (Windows; Git Bash or PowerShell).
- Branch: `test/unifier-proof-round-2`. If it does not exist yet, ask the user to run `! git switch -c test/unifier-proof-round-2` from main. The permission check blocks branch creation for agents. The uncommitted step 9 plan moves with the switch.

## Read first, in this order
1. `UNIFIER-ENHANCEMENTS.md`: § Step 8 (its results), § Step 9 (with its exit rule), and the newest Log rows.
2. `_fixtures/notes/step9-plan.md`: all of it (stages, D1 and D2 with exact texts, runs, plants, scorecard).
3. `_fixtures/notes/step8-plan.md`: § Rules for every run and § Results so far, to see how step 8 ran and scored.
4. `_fixtures/notes/step8-triage/` (`brd.md`, `sdd.md`, `lld.md`): the step 8 changes the runs measure.
5. `_fixtures/README.md`: the checkers and how to run them.

Then check the live state:
- run `git status` and `git log --oneline -8`;
- main should hold the step 8 merge and equal origin;
- uncommitted: `UNIFIER-ENHANCEMENTS.md` (the step 9 plan) and the two new notes, `step9-plan.md` and this file;
- `productization/` is untracked.

## Where it stands
- **Step 8** is committed, merged into main and pushed by the user. Its committed records still say the commits wait for the user's word: the permission check blocked the edit that would have recorded them. Stage 0a closes them.
- **Step 9** is planned, not started. Nothing is built in a scratchpad yet.
- **`productization/`** is untracked and belongs to another session. Do not use it for this task, and never edit, stage or commit it.

## Your tasks, in order
1. **Stage 0a.** Ask the user before you close the step 8 records (`step9-plan.md`, stage 0a), and read the hashes from `git log`. If the permission check blocks the edit again, stop and leave it to the user.
2. **Stage 0b.** Run `diff_runs.py` on the step 7 and step 8 outputs, as a report.
3. **Stage 0c. Decide.** Present D1 and D2 to the user, each with its recommendation, alternatives and tradeoff, as in `step9-plan.md`, and wait for the answers. Apply what the user accepts with the exact texts. Assert that each old string occurs once; adapt only if a line moved. Then run the checks below.
4. **Stage 0d.** Build the inputs and the plants T1, T4 and T5 in your own scratchpad (`SP\s9\`), record them in `SP\s9\plants.md`, and hash the repository. Then stop for the user's go, and ask whether to run the optional C2 and C4.
5. **Stage 1. Runs**, as `step9-plan.md` § Runs and § Rules for every run say. Write the briefs to `SP\s9\briefs\`; a brief never states a rule its run measures. S3 and C1 start in parallel. Between C1 and C2, write T3 yourself. Stop and report after each run.
6. **Stage 2. Verify** each run against its files, never from the agent's report alone. Run every checker on the outputs and `diff_runs.py` against the step 8 outputs, then fill the scorecard in `step9-plan.md` § Results so far.
7. **Stage 3. Triage** the runs' notes read-only, one agent per skill. Apply the M and S fixes and bring the D items to the user, with exact texts as `step8-triage/lld.md` did. Then apply the exit rule: one targeted rerun inside step 9 for a failed rule or a core-rule design item, and everything else applied or recorded in the README Known gaps.
8. **Stage 4. Save** the runs and reports (`step9-plan.md` stage 4). Update the fixture README rows and the root README Known gaps. If a skill changed, resync the Band files as step 8 did:
   1. The six files are in `C:\Users\negat\Downloads\`: `agent-*-unifier.md` and `team-product-management-guidelines.md`, all LF.
   2. Back them up first.
   3. Audit them read-only against `git diff <step 8 merge> -- pre-brd-unifier brd-unifier sdd-unifier lld-unifier business-reviewer-unifier README.md` plus the uncommitted work.
   4. Verify each finding against the cited skill line before applying it.
   5. Keep the `## Room rules` block byte-identical across the five agent files; compare SHA-256 (prefix `4d75258455a4b9d8` after step 8).
   6. Record the audit in `_fixtures/notes/step9-band/band-audit.md`, as `step8-band/band-audit.md` did.
9. **Stage 5. Close the records:** UNIFIER (Status row 9, the § Step 9 heading and results, the Done when table, the Log) and `step9-plan.md`. Under the exit rule, this marks the plan Done. Then propose the commit split and wait:
   - one `fix(<skill>)` commit per changed skill;
   - `test:` for `_fixtures/`;
   - `docs:` for `README.md` and `UNIFIER-ENHANCEMENTS.md`.

   Merge into main only on the user's word, as steps 6 to 8 did:
   - `git commit-tree <tip>^{tree} -p main -p <tip>` with a merge message;
   - then `git update-ref refs/heads/main <merge> <old main>`;
   - then `git switch main`.

   The permission check blocks `git push` for agents, so give the user `! git push origin main`.

## Checks
Expected results at the step 8 merge:
- `PYTHONIOENCODING=utf-8 PYTHONHASHSEED=0 python -B _fixtures/checkers/check_refs.py lld-unifier sdd-unifier`: 261 references, 0 problems.
- `python -B _fixtures/notes/step6-handoffs/check_readme.py`: 0 problems.
- `python -B -m pytest -p no:cacheprovider -q pre-brd-unifier/scripts/tests _fixtures/checkers/tests`: 59 passed, 7 subtests.
- `python -B -m unittest discover -s _fixtures/checkers/tests -p test_chk_regressions.py`: 16 OK.
- `python -B -m unittest discover -s _fixtures/checkers/tests -p test_e2e_gate_inventory.py`: 15 OK.
- The record-link scan `linkscan.py` lived in an earlier session's scratchpad (`C:\Users\negat\AppData\Local\Temp\claude\C--Users-negat--claude-skills\b611c628-b7a5-4a58-8c04-7121c5dcd964\scratchpad\`): 455 links with the step 9 plan files, bad 0. If it is gone, say so.
- Every changed file: no U+2014 or U+2013 character, and its line endings unchanged.

## House rules
- **No dashes.** Write no em dash or en dash characters anywhere. Check by counting U+2014 and U+2013 in Python.
- **Line endings.** Skill files, `README.md` and `UNIFIER-ENHANCEMENTS.md` are CRLF in the working tree. `_fixtures/**` and the Band files are LF.
  - Edit with exact-string replacement: the Edit tool, or Python in binary mode.
  - Never round-trip a file through text mode.
  - Count CR bytes with Python.
- **Escapes.** Tool-call text turns `\uXXXX` into the literal character. To write a backslash escape, build it with `chr(92)`.
- **Long shell commands get cut off.** Put long edit scripts in a file under your own scratch folder and run that file.
- **Verify, don't trust.** Check agent reports against the files, and report only what you actually ran.
- **Permission check.** In step 8, auto mode blocked `git add` and `git commit` until the user allowed git, and it blocked an Edit that wrote commit hashes into a record. When it blocks something, do not work around it: finish what does not depend on it, then stop and ask the user.
- **Style.** Plain, concise English with short sentences. State tradeoffs. If unsure, say so.
- **Never** commit, merge or push without the user's word. Never touch `infra/`, `.github/` or `environments/`.
- **Memory.** If you are Claude Code, update `unifier-enhancements-plan.md` and its `MEMORY.md` index line at the end. Otherwise, leave memory to Claude.

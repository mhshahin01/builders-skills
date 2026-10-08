# Resume step 8 of the unifier enhancements plan

You are taking over step 8 (proof round) of the unifier enhancements plan, partway through.
- Repository: `C:\Users\negat\.claude\skills` (Windows; Git Bash or PowerShell).
- Branch: `test/unifier-proof-round`.

## Read first, in this order
1. `UNIFIER-ENHANCEMENTS.md`: § Step 8 and the newest Log rows.
2. `_fixtures/notes/step8-plan.md`: stages 0 to 5, Results so far, and the stage 3 decisions.
3. `_fixtures/notes/step8-triage/lld.md`: the open LLD design items, with exact texts.
4. `_fixtures/notes/step8-triage/brd.md` and `sdd.md`: what was already decided and applied.

Then check the live state:
- run `git status` and `git log --oneline -3`;
- HEAD should be 6cc2f93, on top of 8506a9b;
- step 8 work should be uncommitted.

## Where it stands
- **Runs:** S3, S4a, S4b and X are done, verified against the files, and saved:
  - `_fixtures/scenarios/pre-brd-to-brd/rerun-2026-10-07-s8/`;
  - `_fixtures/chain/run-2026-10-07-s8/`;
  - reports in `_fixtures/notes/step8-runs/`.
- **Commit 6cc2f93** holds another session's 12 consistency fixes, committed on their own on the user's word.
- **Uncommitted:**
  - all the BRD and SDD triage fixes and the nine accepted design decisions;
  - the LLD simple fixes and the S5 labels;
  - the `_fixtures` work: `check_todo.py` with 14 tests, README rows, notes, saved runs;
  - the root README and UNIFIER records.
- **`productization/`** is untracked and belongs to another session. Do not use it for this task, and never edit, stage or commit it.

## Your tasks, in order
1. **Decide.** Present the five LLD design items (L2, L3, L4, L6, L8a) and the two optional extras (L9, L8b) to the user. Give each with its recommendation, alternative and tradeoff, as in `lld.md`, and wait for the answers. Do not apply anything before the user answers.
2. **Apply** what the user accepts, using the exact texts in `lld.md`.
   - Assert that each old string occurs once; adapt only if a line moved.
   - Record the decisions in `lld.md`, in `step8-plan.md` (stage 3), and in a UNIFIER Log row.
   - If L2 or L3 is accepted, add it to the "unproven, to step 9" list in `step8-plan.md`, and to the root README Known gaps (the "Steps 7 and 8" bullet).
3. **Check.** Run these, with the expected results:
   - `PYTHONIOENCODING=utf-8 PYTHONHASHSEED=0 python -B _fixtures/checkers/check_refs.py lld-unifier sdd-unifier`: 0 problems.
   - `python -B _fixtures/notes/step6-handoffs/check_readme.py`: 0 problems.
   - `python -B -m pytest -p no:cacheprovider -q pre-brd-unifier/scripts/tests _fixtures/checkers/tests`: 59 passed, 7 subtests.
   - `python -B -m unittest discover -s _fixtures/checkers/tests -p test_chk_regressions.py`: 16 OK.
   - `python -B -m unittest discover -s _fixtures/checkers/tests -p test_e2e_gate_inventory.py`: 15 OK.
   - The record-link scan at `C:\Users\negat\AppData\Local\Temp\claude\C--Users-negat--claude-skills\b611c628-b7a5-4a58-8c04-7121c5dcd964\scratchpad\linkscan.py`, if it still exists: bad 0.
   - Every changed file: no U+2014 or U+2013 character, and its line endings unchanged.
4. **Band resync.** The six Band role files are in `C:\Users\negat\Downloads\`: `agent-*-unifier.md` and `team-product-management-guidelines.md`, all LF.
   1. Back them up first.
   2. Audit them read-only against the step 8 skill changes: `git diff 8506a9b -- pre-brd-unifier brd-unifier sdd-unifier lld-unifier business-reviewer-unifier README.md` plus the uncommitted work.
   3. Verify each finding against the cited skill line before applying it.
   4. Keep the `## Room rules` block byte-identical across the five agent files; compare SHA-256.
   5. Record the audit in `_fixtures/notes/step8-band/band-audit.md`, as `step7-band/band-audit.md` did.
5. **Close the records:** in UNIFIER, the Status row 8, the § Step 8 heading and the Log; in `step8-plan.md`, stages 3 to 5.
6. **Commit, only on the user's explicit word.** Propose this split and wait:
   - `fix(brd-unifier)`, `fix(sdd-unifier)` and `fix(lld-unifier)`;
   - `test:` for `_fixtures/`;
   - `docs:` for `README.md` and `UNIFIER-ENHANCEMENTS.md`, including the root README matrix rename (lines 71 and 139), which the user asked to keep in the docs commit.

   Merge into main only on the user's word, as steps 6 and 7 did:
   - `git commit-tree <tip>^{tree} -p main -p <tip>` with a merge message;
   - then `git update-ref refs/heads/main`;
   - then `git switch main`.

   The permission check blocks `git push` for agents, so give the user `! git push origin main`.

## House rules
- **No dashes.** Write no em dash or en dash characters anywhere. Check by counting U+2014 and U+2013 in Python.
- **Line endings.** Skill files, `README.md` and `UNIFIER-ENHANCEMENTS.md` are CRLF in the working tree. `_fixtures/**` and the Band files are LF.
  - Edit with exact-string replacement: the Edit tool, or Python in binary mode.
  - Never round-trip a file through text mode.
  - Count CR bytes with Python.
- **Escapes.** Tool-call text turns `\uXXXX` into the literal character. To write a backslash escape, build it with `chr(92)`.
- **Long shell commands get cut off.** Put long edit scripts in a file under your own scratch folder and run that file.
- **Verify, don't trust.** Check agent reports against the files, and report only what you actually ran.
- **Style.** Plain, concise English with short sentences. State tradeoffs. If unsure, say so.
- **Never** commit, merge or push without the user's word. Never touch `infra/`, `.github/` or `environments/`.
- **Memory.** If you are Claude Code, update `unifier-enhancements-plan.md` and its `MEMORY.md` index line at the end. Otherwise, leave memory to Claude.

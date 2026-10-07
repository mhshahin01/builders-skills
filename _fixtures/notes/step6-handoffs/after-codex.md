# After Codex: verify, decide, and close step 6 (brief for a fresh Claude Code session)

Repo: `C:\Users\negat\.claude\skills`, branch `fix/unifier-fix-round` (from main de3baec). Nothing of step 6 is committed. Main is 10 commits ahead of origin and unpushed.

## Read first, in this order

1. `UNIFIER-ENHANCEMENTS.md`: the plan, steps 1 to 6, the Log, and "Done when".
2. `_fixtures/notes/step6-plan.md`: the stage table. The R row ends with the handoff to Codex on 2026-10-06 20:20.
3. `_fixtures/notes/step6-handoffs/resume-codex.md`: what Codex was asked to do. The stages are R2 (LLD), CHK (checks, triage, save), R3a to R3d (business review and hand-offs), TRIAGE (skill findings), and FINAL (records).
4. `_fixtures/notes/step6-handoffs/codex-log.md`: what Codex did, one report per stage. If Codex stopped before FINAL, verify only the stages it finished, report which remain, and stop: the remaining stages continue in Codex, one approved go at a time. Known: R2's write-scope result was "qualified" by eight outside-R2 changes, all explained (the four `.remember/` plugin logs, and `after-codex.md`, `handoff-manifest.txt`, `make_manifest.py`, and `step6-plan.md`, written by the Claude session during R2). The manifest (20:38) predates R2's LLD files (20:53).
5. `_fixtures/notes/step6-handoffs/B-findings.md`, `R-findings.md`, and `findings-triage.md` (written by Codex's TRIAGE stage, if it ran).

## The user's rules (hold for every action)

- **Git:** no commit, push, merge, or branch deletion without the user's explicit word for that exact step. Never push unasked.
- **Stages:** no long or writing stage (a skill run, a scenario rerun, a batch of edits) without the user's approval. Report after each stage and wait.
- **Consistency fixes** (memory `consistency-round-autofix`): mechanical and simple fixes may be applied with the recommended option. Hold anything that changes gates, ID formats, file layout, versioning or review policy, security posture, hand-offs, or a feature-sized path.
- **Text:** no em dash or en dash in anything written. Keep line endings: skill files CRLF; checkers, `_fixtures/README.md`, and run outputs LF. Count CR bytes with Python.
- **Verify, don't trust:** check each stage's write scope against a backup or the manifest. Agent reports have miscounted and over-claimed before.
- **Agents:** keep parallel background agents to a few. Eleven at once throttled everything.

## Step 1: verify Codex's work (read-only)

1. **State:**
   - `git status --short`, and `git diff --stat` per folder.
   - Which Codex stages finished, and what each left for the user.
2. **What changed since the handoff:**
   - `_fixtures/notes/step6-handoffs/handoff-manifest.txt` holds the sha256 of 400 files as of 2026-10-06 20:38: the five skill folders, `_fixtures/checkers`, `_fixtures/runs-wip`, the root `README.md`, `UNIFIER-ENHANCEMENTS.md`, `_fixtures/README.md`, `.gitignore`, and the six Band files in `C:\Users\negat\Downloads\`.
   - Recompute the hashes (`make_manifest.py` in the same folder shows how) and list every added, removed, or changed file.
   - Any change to a skill folder must trace to a TRIAGE item the user approved in `codex-log.md`. Flag every change that does not.
   - The Band files should be unchanged unless a skill changed.
3. **Write scopes:** for each writing stage, compare with its backup in `_fixtures/runs-wip/step6-R/backups/<stage>/`. Expected scopes:

   | Stage | May write |
   |---|---|
   | R2 | `lld-refunds-platform/`, and the LLD's own Child LLDs row in SDD chunk 00 |
   | R3 | the review copy only |
   | Each hand-off | the owning document only |

4. **Rerun everything yourself:**
   - Every fixture checker on the saved final run (`_fixtures/chain/run-2026-10-06-final/`, if CHK saved it), with the commands in `_fixtures/README.md` § How to run.
   - `check_versions.py` on each document.
   - `diff_runs.py` against `chain/run-2026-10-01-review` and `chain/run-new`.
   - `python -B _fixtures/checkers/check_refs.py lld-unifier sdd-unifier`: expect 0 problems.
   - `python -B _fixtures/notes/step6-handoffs/check_readme.py`: expect 0 problems.
   - `python -B -m pytest pre-brd-unifier/scripts/tests -q -p no:cacheprovider`: expect all pass.
   - An em dash, en dash, and CRLF scan of every file changed since the handoff.

   Use `PYTHONIOENCODING=utf-8`, `PYTHONHASHSEED=0`, and `python -B`.
5. **Skill edits:** review any skill edits Codex applied against the decisions they cite. Check that the root README still matches the skills.
6. **Report to the user and STOP.** Cover:
   - what Codex did, stage by stage;
   - the verification results, with any mismatch, unexplained change, or over-claim;
   - the open decisions (Step 2).

## Step 2: the user's decisions (ask; do not assume)

- **Design findings** from TRIAGE, each with 2 to 4 options and a recommendation. Already known:
  - BR2-1: mockups reopen after diagram fixes.
  - BR2-8 and R1b-1: review-after-answer loops.
  - R1-1: lawful-basis markers keep the SDD gate shut.
  - R1c-1: step 8b has no "already up to date" branch.
- **The baseline:** does `run-2026-10-06-final` replace `chain/run-new`?
- **Step 3 scenarios to rerun** under the changed rules: pre-BRD to BRD, BRD merge and re-chunk, SDD version tracking, and the LLD modular monolith (`_fixtures/README.md` § Scenarios). "Done when" needs all four to pass. Recommend at least merge and re-chunk and version tracking.
- **Known gaps:** which remaining items the user accepts.

## Step 3: apply what the user approves (one stage at a time)

- **Approved skill changes:** apply them, then run a focused consistency check of the changed parts. Rerun only the test stage they affect, as a background agent, after a backup.
- **Scenario reruns:** one at a time, each approved first.
- **Band files:** if a skill changed, resync the six Band files (memory `band-agent-role-files`) and check that the Room rules block stays byte-identical in the five role files.

## Step 4: finalize (after the user's go)

1. Rewrite the root `README.md` "Known gaps" from the final results, then run `check_readme.py`.
2. Update the records:
   - `UNIFIER-ENHANCEMENTS.md`: step 6 Status row (Done, with commits), its section, and the Log.
   - The stage rows of `_fixtures/notes/step6-plan.md`.
   - `_fixtures/README.md`: Layout and Checkers rows for the saved run.
3. Delete `_fixtures/runs-wip/` once the final run is saved under `_fixtures/chain/`. It must never be committed.
4. Update memory: `unifier-enhancements-plan`, `unifier-test-fixtures`, `pending-branch-cleanup`, and the MEMORY.md index lines.

## Step 5: commit and merge (only on the user's word)

1. **Propose the commit split and wait.** Conventional Commits, one commit per concern, as in earlier rounds:
   - `fix(brd-unifier): ...`
   - `fix(sdd-unifier): ...`
   - `fix(lld-unifier): ...`
   - `fix(pre-brd-unifier): ...`
   - `fix(business-reviewer-unifier): ...`
   - `test: ...`: the checkers, `_fixtures/README.md`, and the saved run.
   - `docs: ...`: the root README, `UNIFIER-ENHANCEMENTS.md`, and the `_fixtures/notes/step6-*` records.

   End each message with the session's attribution lines.
2. **On the user's word,** commit. Then, on a separate word, merge `fix/unifier-fix-round` into local main. Push only on an explicit "push".
3. **Branch cleanup:** follow memory `pending-branch-cleanup`. Check `git worktree list` and `git branch --merged main`, and ask before deleting anything.

## Done when (from UNIFIER-ENHANCEMENTS.md)

- The whole chain runs on current main with zero checker errors and no unexplained diffs.
- All four paths pass their scenarios.
- SDD chunk 19 has been written once, with the gate genuinely open. Done in R1c (SDD 1.3).
- The reviewer has run on the chain, and its gap is closed. The R3 run is its first under the new rules.
- README "Known gaps" is empty or lists only items the user accepted.

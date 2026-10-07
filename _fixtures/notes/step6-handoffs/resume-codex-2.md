# Resume brief for Codex (2): close out step 6

You are continuing a long test-and-fix round on five documentation skills in the git repo `C:\Users\negat\.claude\skills` (branch `fix/unifier-fix-round`, from main de3baec). Codex ran stages R2 to FINAL from `resume-codex.md`; a Claude Code session then verified that work, fixed its defects, and finished the chain. This brief covers what is left: stages S1, S2, S3, SAVE, RECORDS, and CLEAN. Read it all first.

## Ground rules

- **Run continuously.** Do the stages in this order: S1, S2, S3, SAVE, RECORDS, CLEAN. Do not wait for the user between stages. After each stage, append its report to `_fixtures/notes/step6-handoffs/codex-log.md`, then go on to the next stage.
- **Stop and wait for the user only when:**
  - a check fails and you cannot explain the cause from the sources;
  - a run needs a decision the fixed answers below do not cover;
  - a precondition of CLEAN fails.

  Then report what happened and what you need.
- **Git:** run no git command that changes state (no commit, push, add, stash, checkout, restore, reset, merge, or branch deletion). `git status`, `git diff`, `git show`, and `git log` are fine. The commits are made later in Claude Code.
- **The skills are frozen.** Do not edit the five skill folders (`pre-brd-unifier`, `brd-unifier`, `sdd-unifier`, `lld-unifier`, `business-reviewer-unifier`). A skill defect you find goes into `_fixtures/notes/step6-handoffs/live-findings.md`, in a new section "Found in the Codex close-out", with file:line; do not fix it.
- **Do not touch** the six Band files in `C:\Users\negat\Downloads\`, or anything under `C:\Users\negat\.claude\projects\` (Claude's memory and session transcripts; do not read them either).
- **Do not edit or delete** `_fixtures/notes/step6-handoffs/handoff-manifest-2.txt` or `manifest2.py`: the Claude session after you verifies your stages against them.
- **Back up before each writing stage** into `_fixtures/runs-wip/close/backups/<stage>/`, with a SHA-256 manifest of the repository (excluding `.git`). After the stage, verify the write scope against it and record it in the stage report. `_fixtures/runs-wip/` is git-ignored and must never be committed.
- **Text rules:**
  - No em dash (U+2014) or en dash (U+2013) in anything you write.
  - Keep each file's line endings: the root `README.md` and `UNIFIER-ENHANCEMENTS.md` use CRLF; `_fixtures/README.md`, the checkers, the notes, and run outputs use LF. Count CR bytes with Python.
  - Plain English, short sentences.
- **Running a skill:**
  - Follow it from disk: its `SKILL.md`, then every file it references. Do not invoke it by name.
  - You have no sub-agent tool, so follow each SKILL.md "Running outside Claude Code" section: a reviewer, checker, or faithfulness pass runs in the same context as a separate pass that re-reads the files from disk.
  - A scenario's second stage stands in for a fresh session: read only what a new session would see (the first stage's output folder and the skill), not your notes from the first stage.
  - Work non-interactively. You play the skill and the user, with the fixed answers below.
- **Python:** `PYTHONIOENCODING=utf-8 PYTHONHASHSEED=0 python -B`; pytest with `-p no:cacheprovider`. Inspect checker output, not only exit codes: the checkers can exit 0 while reporting problems.
- **Runtime note:** say in each stage report that the stage ran in Codex.

## Fixed answers for every skill run

- **Accept** every recommendation and every Recommended Answer within the request.
- **Reject** a new item that would add business behaviour the source (BRD or pre-BRD) does not state, with the reason "out of scope for this release (test-fixture policy)".
- **Decline** an offer to start a different request that the scenario does not ask for (for example a migration or upgrade of a legacy document), and record that the offer was made and where.
- **Owner-only questions:** leave them as markers or hand-offs with their named owner. Give no new test-fixture answers.
- **Mockups:** a mockup the skill reopens is re-approved as a test-fixture confirmation. No Miro boards. No Mermaid renderer: check Mermaid by reading it.

## Where things stand (read these first)

- **Plan:** `UNIFIER-ENHANCEMENTS.md` (steps 1 to 6, the Log, and "Done when"). Stage table: `_fixtures/notes/step6-plan.md`, rows R2 to LLD13; its FOLLOW-UP row points here.
- **Reports:** `_fixtures/notes/step6-handoffs/codex-log.md` (your stages R2 to FINAL); `after-codex.md` (the Claude verification brief); `live-findings.md` (16 frozen skill findings, fixture design gaps, checker limits: next-round input, not applied).
- **The final chain** is the working copy `_fixtures/runs-wip/step6-R/review/`: REFUNDS 1.9, LOYALTY 1.8, SDD 1.7 (E2E gate `Open - Up to date` under the semantic E3 rule: 67-row marker inventory, 0 blockers), LLD 1.3 (38 TODO, 24 Confirm), read-only `source/`, and the review records `review-comments-tracker.md`, `review-panel-findings.md`, `review-walkthrough.md`. Every checker in `_fixtures/README.md` § How to run reports 0 problems on it.
- **Saved runs:** `_fixtures/chain/run-2026-10-06-final/` (the pre-review state after CHK). `chain/run-new` is still the regression baseline.
- **Scenarios:** the step 3 outputs (main 057f137) are in `_fixtures/scenarios/`; results in `_fixtures/README.md` § Scenarios; run logs in `_fixtures/notes/step3-findings.md`.
- **Tests:** 14 pre-BRD exporter tests (`pre-brd-unifier/scripts/tests`) and 31 checker tests (`_fixtures/checkers/tests`: 16 CHK regression, 15 E3 inventory) pass.
- **Uncommitted:** all of step 6, on `fix/unifier-fix-round`.

## Stage S1: SDD version tracking scenario

- **Input:** in `_fixtures/runs-wip/close/s1/input/`, a copy of `_fixtures/chain/run-2026-09-30/` with `brd-loyalty-points/` replaced by `_fixtures/scenarios/sdd-version-tracking/after-sdd/brd-loyalty-points/` (the hand edit: LOYALTY v1.1, UC-02 takes back only the points of the refunded amount). Confirm the replaced BRD differs from the run-2026-09-30 one only in `00`, `06a`, `14`, and the master.
- **Stage 1:** sdd-unifier, "BRD LOYALTY has a new version", on `input/sdd-refunds-platform`; copy the result to `after-sdd/`.
- **Stage 2 (fresh-session pass):** lld-unifier, a plain run ("lld-unifier chunks") on the existing LLD in a copy of `after-sdd/`; the result is `after-lld/`.
- **Expected** (the step 3 result): SDD 1.0 to 1.1, the LOYALTY row at 1.1, the Child LLDs SDD version `1.0 (out of date: SDD is now v1.1; refresh through lld-unifier)`, only SDD files changed and the LLD untouched in `after-sdd/`; in `after-lld/`, step 3c finds SDD 1.1 against the recorded 1.0 and offers the refresh, only the LLD chunks mapped from the SDD's changed chunks change (plus 00, the master, 15, and 18), and the SDD changes only this LLD's row.
- **Watch the new rules:** this SDD has no E3 marker inventory (Legacy SDDs rule), its gate is Locked on E3 with no chunk 19, the update row is dated by the request's first content change with a semantic `Chunks:` list, the review limit applies, and the LLD refresh is driven by the `Chunks:` lists.
- **Checks:** the § How to run set with `$R` on `after-sdd/` and on `after-lld/`; `diff_runs.py` against `_fixtures/scenarios/sdd-version-tracking/after-sdd` and `after-lld`. Explain every difference from the step 3 result.
- **Save** to `_fixtures/scenarios/sdd-version-tracking/rerun-2026-10-07/after-sdd/` and `after-lld/` (LF, no dashes). Then go on to S2.

## Stage S2: BRD merge and re-chunk scenario

- **Input:** `_fixtures/scenarios/brd-heading-map/input/brd-refunds-portal/` (read-only); work in `_fixtures/runs-wip/close/s2/`.
- **Stage 1:** brd-unifier, "merge" (single combined file); the result is `merged/`.
- **Stage 2 (fresh-session pass):** brd-unifier, "split into chunks" on the merged file alone; the result is `rechunked/`.
- **Expected** (the step 3 result): the heading outline and links are identical to `input/` in every chunk except 00; 06a and 06b get back their titles, chunk 16 its project-name title; no body line is lost. Compare with the step 3 `merged/` and `rechunked/` too.
- **Checks:** `_linkcheck.py`, `check_versions.py`, and `check_mermaid.py` on `rechunked/brd-refunds-portal`; a heading-outline and link comparison of `input/` against `rechunked/` (a scratch script); `diff_runs.py` against the step 3 `rechunked/`.
- **Save** to `_fixtures/scenarios/brd-heading-map/rerun-2026-10-07/merged/` and `rechunked/`. Then go on to S3.

## Stage S3: pre-BRD to BRD scenario, BRD stage

- **Input:** the saved pre-BRD `_fixtures/scenarios/pre-brd-to-brd/run/pre-brd-clinic-reminders/` (approved as is at its step 7; read-only). The pre-BRD generation itself is not rerun: it needs market research this runtime cannot do, and the pre-BRD exporter tests pass. Say so in the report.
- **Run:** brd-unifier, `chunks whole` on that pre-BRD folder, into `_fixtures/runs-wip/close/s3/brd-clinic-reminders/`. The step 3 BRD stage took about 3.5 hours.
- **Expected** (the step 3 result): every pre-BRD chunk lands where `brd-unifier/sow-transformation.md` maps it; 0 broken links into the pre-BRD; market figures stay in the pre-BRD; requirement-relevant pre-BRD markers and open items are carried as markers, none filled in. Report whether the two step 3 defects recur: an accepted review item removing the verdict word the mapping requires, and a flagged price kept without a marker.
- **Checks:** `_linkcheck.py`, `check_mermaid.py`, and `check_versions.py` on the BRD; every link into the pre-BRD resolves.
- **Save** to `_fixtures/scenarios/pre-brd-to-brd/rerun-2026-10-07/brd-clinic-reminders/`. Then go on to SAVE.

## Stage SAVE: the new baseline

- Copy `_fixtures/runs-wip/step6-R/review/` to `_fixtures/chain/run-2026-10-07-review/`: every file, `source/` and the three review records included. Verify by SHA-256 that each saved file equals its source.
- In the saved copy only: `review-comments-tracker.md` links into `../backups/` (stage evidence that will be deleted). Turn each of those links into plain text ending "(stage evidence, not kept)". Then `check_links.py` and `_linkcheck.py` on the saved copy: 0 broken.
- Rerun the whole § How to run set on the saved copy (all four documents for `_linkcheck`, `check_versions`, and `check_mermaid`): every check 0 problems, `check_e2e` in inventory mode.
- `_fixtures/README.md`:
  - a Layout row for `chain/run-2026-10-07-review/` (run-2026-10-06-final plus the business review R3a to R3d, the gate rerun under the semantic E3 rule, SDD 1.6 and 1.7, and LLD 1.3; its versions and gate state), marked **Regression baseline**; mark `run-new` as the former baseline;
  - § How to run: `$R` defaults to the new baseline;
  - the Checkers table: a column for the new run with its results;
  - the Scenarios table: rows for the S1 to S3 reruns with their results, and one line saying the LLD modular-monolith scenario is covered by R2, R3d, and LLD13 on the five-module SDD.
- Then go on to RECORDS.

## Stage RECORDS

- **Root `README.md` "Known gaps":** rewrite from the final results. Say what ran and passed. List what remains:
  - the accepted fixture limits (38 TODO and 24 Confirm flags; SDD R-09; designed, not executed, application and BAT tests; test-fixture answers and mockup approvals; same-context reviews in the Codex stages; Mermaid checked by heuristics only);
  - the scenario results;
  - the from-code and hybrid LLD directions, never run as fixtures;
  - the 16 live findings as the next round's input (link `live-findings.md`), and the fixture design gaps.

  Cite only committed paths: no link into `runs-wip`. Then `python -B _fixtures/notes/step6-handoffs/check_readme.py`: 0 problems.
- **`UNIFIER-ENHANCEMENTS.md`:**
  - the step 6 Status row (Done, commits pending: they are added later in Claude Code);
  - the step 6 section (after Codex: the verification, FIX, GATE, FIX2, SDD16, SDD17, LLD13, the scenario reruns, the save);
  - one Log row for 2026-10-07;
  - check "Done when" item by item, and say which items hold.
- **`_fixtures/notes/step6-plan.md`:** stage rows S1, S2, S3, SAVE, RECORDS, and CLEAN, and the FOLLOW-UP row (handed back to Claude Code for the commit).
- Then go on to CLEAN.

## Stage CLEAN

- **Preconditions (stop and report if any fails):** SAVE's SHA-256 check passed, every check on the saved baseline reports 0 problems, and the S1 to S3 outputs are saved under `_fixtures/scenarios/`.
- Find every Markdown link into `_fixtures/runs-wip/` in files that will be committed. `codex-log.md` has 11, `findings-triage.md` has 1; scan every `.md` file outside `runs-wip`. Turn each into plain text ending "(not kept)", or point it to its committed equivalent (for example the saved run). Plain-text mentions of `runs-wip` paths in the historical briefs may stay.
- Delete `_fixtures/runs-wip/` entirely. Keep its `.gitignore` entry.
- **Verify:**
  - a link scan over `README.md`, `UNIFIER-ENHANCEMENTS.md`, `_fixtures/README.md`, and `_fixtures/notes/`: 0 broken;
  - `check_readme.py`: 0 problems;
  - `python -B _fixtures/checkers/check_refs.py lld-unifier sdd-unifier`: 0 problems;
  - pytest on `pre-brd-unifier/scripts/tests` and `_fixtures/checkers/tests`: 45 pass;
  - the § How to run set on the new baseline: 0 problems.
- `git status`: no `runs-wip`; list the files to commit.
- Write a final summary report covering all six stages and append it to `codex-log.md`. Stop there: Claude Code makes the commits.

## Each stage report

- what you did, and that it ran in Codex;
- the files written (paths);
- the checks and their results, with problem counts;
- the write-scope verification;
- items for the user (decisions, defects logged in `live-findings.md`).

## After Codex

A Claude Code session reviews these stages, proposes the commit split and commits on the user's word, syncs Claude's memory, and confirms the six Band files still match the skills.

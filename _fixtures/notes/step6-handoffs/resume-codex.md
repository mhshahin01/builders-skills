# Resume brief for Codex: unifier readiness plan, step 6, from stage R2

You are continuing a long test-and-fix round on five documentation skills in the git repo `C:\Users\negat\.claude\skills` (branch `fix/unifier-fix-round`). Read this whole brief first, then do **one stage at a time**.

## Ground rules

- **Stop after every stage.** Report, then wait for the user's explicit go before you start the next stage. Never chain stages on your own.
- **Git:** run no git command that changes state (no commit, push, add, stash, checkout, restore, or reset). `git status`, `git diff`, `git show`, and `git log` are fine. The working tree holds about 110 uncommitted changes from this round: leave them alone.
- **Back up before each writing stage.** Copy what the stage will write into `_fixtures/runs-wip/step6-R/backups/<stage>/`. After the stage, verify the write scope against that backup (only the expected folders changed; the inputs and the five skill folders unchanged) and report it.
- **The five skill folders** (`pre-brd-unifier`, `brd-unifier`, `sdd-unifier`, `lld-unifier`, `business-reviewer-unifier`) change only in a stage that says so, and only after the user approves.
- **Text rules:**
  - No em dash (U+2014) or en dash (U+2013) in anything you write.
  - Keep each file's line endings: skill files use CRLF; `_fixtures/README.md`, the checkers, and the run outputs use LF.
  - Plain English, short sentences.
- **Running a skill:**
  - Follow it from disk: its `SKILL.md`, then every file it references (all top-level .md files and every file in `chunks/`). Do not invoke it by name.
  - You have no sub-agent tool, so follow each SKILL.md's "Running outside Claude Code" section. A reviewer or checker pass runs in the same context, as a separate pass that re-reads the files from disk.
  - Work non-interactively. You play the skill and the user, with the fixed answers below.
- **Runtime note:** say in each stage report that the stage ran in Codex. The stages before R2 ran in Claude Code.
- **Do not read** session transcripts under `C:\Users\negat\.claude\projects\`.

## Fixed answers for every skill run (the user's policy from earlier stages)

- **Accept** every recommendation and every Recommended Answer.
- **Reject** a new item that would add business behavior no BRD states. Record it as Rejected in the owning document's open items chunk and decision log, with the reason "out of scope for this release (test-fixture policy)".
- **Person-only questions:** a question only a person can answer gets a plausible test-fixture value consistent with the BRDs, with its owner named. That means a lawful basis (owner: the Data Protection Officer), or a business rule that clarifies behavior the BRDs already state (owner: the REFUNDS or LOYALTY owner). Record it as a test-fixture value.
- **Mockups:** a mockup the skill reopens is re-approved as a test-fixture confirmation.
- No Miro boards. No Mermaid renderer or other external tool: check Mermaid by reading it.

## Where things stand (read these first)

**Records:**
- `UNIFIER-ENHANCEMENTS.md`: the plan, steps 1 to 6.
- `_fixtures/notes/step6-plan.md`: the stage table; the R row holds the latest status.
- `_fixtures/notes/step6-handoffs/`: `R-briefs.md`, `B-briefs.md`, `B-findings.md` (33 findings), `R-findings.md` (15 findings).

**Done:**
- **The fix round:** triage, fixes, 55 design decisions, a consistency check and a re-check, the em dash pass, the README sync, and the checker updates (CK).
- **Stage B:** the fixture BRDs were upgraded through brd-unifier. REFUNDS and LOYALTY are both at 1.7, with their gates open and chunks 15 and 16 written.
- **R1, R1b, R1c:** SDD "Refunds Platform" 1.3, a modular monolith with five modules (13a customer-accounts, 13b refund-requests, 13c payouts, 13d notifications, 13e loyalty-points). Its e2e gate reads `Open - Up to date`, and chunk 19 is written and passed two faithfulness checks.

**The working run** is in the repo but untracked; never commit `_fixtures/runs-wip/`:
- RUN = `_fixtures/runs-wip/step6-R/run/`, holding `brd-refunds-portal/`, `brd-loyalty-points/`, `sdd-refunds-platform/`, and `source/` (older files the REFUNDS appendix links to; read-only).
- Snapshots: `_fixtures/runs-wip/step6-R/snapshots/B-final/` (the BRDs after stage B) and `snapshots/R1c-final/` (the SDD after R1c).

## Stage R2: the LLD from the SDD (writing)

- **Backup:** `backups/R2/sdd-refunds-platform/`. The LLD writes its own Child LLDs row into SDD chunk 00.
- **Request:** run lld-unifier from disk with "lld-unifier chunks: write the LLD for the project Refunds Platform from the SDD in RUN\sdd-refunds-platform\". Direction: from-sdd. The output folder must be `RUN\lld-refunds-platform\`, the name the checkers expect.
- **Answers:** the skill's recommended or default answer for every question. Project Type comes from the SDD.
- **Write scope:** `RUN\lld-refunds-platform\`, plus this LLD's own row in the SDD's Child LLDs table. Nothing else.
- **Report:**
  1. What the skill did, step by step.
  2. §6.3 and the 04 file per module.
  3. The trace per BRD: §19.9 rows, the test cases cited, routes.
  4. `> TODO:` and `> Confirm:` counts, and the chunk 18 items.
  5. The Child LLDs row, the version, and the Changes Log.
  6. Rules not followed and ambiguities (file and section).
  7. The write-scope check.

  **STOP.**

## Stage CHK: checks, triage, save

1. **Run every checker.** Use the commands in `_fixtures/README.md` § How to run, with `$R` = `_fixtures/runs-wip/step6-R/run`. Also run:
   - `check_versions.py` on each BRD, the SDD, and the LLD
   - `check_mermaid.py` on both BRDs, the SDD, and the LLD
   - `diff_runs.py` against `_fixtures/chain/run-2026-10-01-review` and against `_fixtures/chain/run-new`

   Run each with `PYTHONIOENCODING=utf-8` and `PYTHONHASHSEED=0`, using `python -B`.
2. **Triage every problem** as one of:
   - (a) the run broke a skill rule (cite the rule);
   - (b) the skill text is unclear or lacks a rule;
   - (c) the checker is wrong, or too narrow for this run.

   The checkers were written for the old four-service fixture, and this SDD is a modular monolith with no topics. Problems already seen with `check_e2e.py`:
   - 5 §24.1 rows that never say "module";
   - §24.4 does not point to chunk 10, with no topics;
   - 10 §24.5 in-process edges: 7 to notifications (chunk 19 treats it as the universal subscriber) and 3 self-edges to an adapter inside refund-requests.
3. **Report and STOP.** Give a triage table with a proposed fix for each problem. Change nothing yet.
4. **On the user's go:**
   - Apply the approved fixes and rerun.
   - Save the run as `_fixtures/chain/run-2026-10-06-final/`, all four folders including `source/`.
   - Add its Layout row and a results column to `_fixtures/README.md`.

   Whether it replaces `chain/run-new` as the baseline is the user's call. **STOP.**

## Stage R3: business review and hand-offs (on a copy)

Copy the saved run to `_fixtures/runs-wip/step6-R/review/` and work there.

- **R3a, the review:** run business-reviewer-unifier from disk: the panel, then the walkthrough, apply, and verify, under its rules.
  - Scope: the default (both BRDs and the SDD; the LLD is lineage context only). Default personas; SME domain: retail refunds and loyalty.
  - Every point takes the recommended option, except one that adds business behavior no BRD states (reject it).
  - Report: the points and decisions; one version bump per changed document; the template structure unchanged; the close's Hand-offs block. **STOP.**
- **R3b to R3d, the hand-offs:** one stage each, in chain order, exactly as the close lists them. **STOP** after each.
  1. brd-unifier: "update the todo: decisions from the business review of [date] ([tracker])", for each changed BRD.
  2. sdd-unifier: "BRD [KEY] has a new version, after the business review of [date] ([tracker])", or "the business review changed this SDD".
  3. lld-unifier: "the SDD has a new version".

  For each: back up first and check the write scope after. Report the versions, items closed or raised, Stale marks, and the checkers rerun. They should end as clean as before the review; explain any change.

## Stage TRIAGE: the skill findings (read-only)

1. **Consolidate** `B-findings.md`, `R-findings.md`, and anything new from R2, CHK, and R3 into `_fixtures/notes/step6-handoffs/findings-triage.md`.
2. **For each finding:**
   - verify it against the current skill text (`file:line`);
   - class it:
     - **M**, mechanical;
     - **S**, simple, with your recommendation;
     - **D**, design, with 2 to 4 options and a recommendation. Design means gates, ID formats, layout, versioning or review policy, security posture, hand-offs, or feature-sized paths. When unsure, use D.
3. **Design questions already flagged:**
   - BR2-1: diagram fixes reopen approved mockups.
   - BR2-8 and R1b-1: the review-after-answer loops.
   - R1-1: lawful-basis markers and the e2e gate.
   - R1c-1: step 8b has no "already up to date" branch.
4. **STOP** for the user's decisions. Apply only what the user approves.

## Stage FINAL (on the user's go)

1. Rewrite the root `README.md` "Known gaps" from the results: what ran, and what is still untested.
2. Update `UNIFIER-ENHANCEMENTS.md` (the step 6 Status row, its section, and its Log) and the stage rows of `_fixtures/notes/step6-plan.md`.
3. Run the checks:
   - `python -B _fixtures/notes/step6-handoffs/check_readme.py`: 0 problems.
   - `python -B _fixtures/checkers/check_refs.py lld-unifier sdd-unifier`: 0 problems.
   - `python -B -m pytest pre-brd-unifier/scripts/tests -q -p no:cacheprovider`: all pass.
4. Hand back for the user's review. No commit, no push.

## Each stage report

- what you did;
- the files written (paths);
- the checks and their results;
- the write-scope verification;
- items for the user;
- the exact next stage you would run.

Also append the report to `_fixtures/notes/step6-handoffs/codex-log.md`.

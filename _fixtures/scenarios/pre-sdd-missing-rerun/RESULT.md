# RESULT: missing Pre-SDD, rerun after skill fixes (Task 7.4 Step 1)

Runs on 2026-10-27, 16:17 to 16:19 UTC. Skill under test: `WT\sdd-unifier\SKILL.md` (and `WT\sdd-unifier\brd-to-sdd.md`), read from disk by path (WT = `C:\Users\negat\.claude\skills-wt\pre-sdd-unifier`, branch feat/pre-sdd-unifier, working tree with the uncommitted SKILL.md fixes). Plan and expectations: [run-brief.md](./run-brief.md). First run, for comparison: `..\pre-sdd-missing\RESULT.md` (Run 1 PASS, Run 2 FAIL: a second stop raised a duplicate HR-002). No skill was edited. No git command, no subagent, no browser.

| Run | Mode | Verdict |
|---|---|---|
| 1 | team | PASS |
| 2 | solo, "later" | PASS |

`<root>` below stands for this scenario folder's absolute path, which the board holds in full (`C:\Users\negat\AppData\Local\Temp\claude\C--Users-negat--claude-skills\5cecb36b-03d8-4e5a-8cf5-681dd1950497\scratchpad\tools\runs\scenarios\pre-sdd-missing-rerun`). Both links were checked with `Test-Path`: both resolve.

## Setup

- `brd-refunds-portal/` and `brd-loyalty-points/` copied from `WT\_fixtures\chain\run-2026-10-13-fc`; `diff -r` against the baseline: identical.
- `unifier-status.md` cut from the template at SKILL.md:520-539 (the fenced block of § Status board, fence lines excluded), with the header changed to `Run mode: team` by the user (SKILL.md:545 "Only the user changes it."). Snapshot: [snapshots/run-0/unifier-status.md](./snapshots/run-0/unifier-status.md). Checker on the fresh board: `0 problems`.
- Request for both runs: "Derive an SDD from these BRDs: ./brd-refunds-portal and ./brd-loyalty-points. Answer policy: accept the recommended option."

## Run 1: team mode

### Expected

Stop at step 2a before step 3a; no SDD folder, chunk, or `decision-log.md`; HR-001 Open to the E2E Architect with the step 2a item 5 Request wording and Link; own row `Waiting on: E2E Architect (HR-001)`; no start of, or offer to start, `pre-sdd-unifier`; checker 0 problems.

### Observed, with the text that drove each action

1. **Mode.** No argument and no SDD master in the root, so the resume check found nothing and the mode prompt applied. Drivers: SKILL.md:52 "Run the resume check first (step 1) ... Otherwise run the **interactive mode prompt**"; SKILL.md:133 (resume only when an `[project-slug]-sdd-master.md` exists). The answer policy took the default: SKILL.md:382 "It takes the recommended option ... the mode prompt (default `chunks`)"; SKILL.md:59 "default `chunks`". Its record was held back: SKILL.md:70 "in DERIVE-FROM-BRD its record waits until step 2a passes (step 2a)" and SKILL.md:385 "In DERIVE-FROM-BRD an answer given before step 2a passes is recorded when the SDD folder is first written (step 2a)." Line said: "Generation: parts (default). Say 'whole' to get everything in one go." (SKILL.md:79).
2. **Board read.** Own row `Not started`; no pending request addressed to `sdd-unifier` or raised by it. Driver: SKILL.md:561 "At the start of every run it reads the board: its own row, the pending requests (`Open`, `Later`, or `Accepted`) addressed to it and the ones it raised, and the upstream states."
3. **Intent and project files.** DERIVE-FROM-BRD (SKILL.md:141); no `AGENTS.md`, `AGENT.md`, `CLAUDE.md`, or `ui-ux-global-constitution.md` in the root (SKILL.md:120, principle 19).
4. **BRD form and keys, before step 2a.** Driver: brd-to-sdd.md:441 "**Detect each BRD's form** ... and propose a key for each BRD ... Then run the Pre-SDD check (SKILL.md step 2a)". Both are chunked BRDs whose masters show `Generation: whole` and no part `Pending` or `In progress` (brd-to-sdd.md:260, unfinished BRD rule: not triggered). Keys proposed in one line: `REFUNDS` (Refunds Portal v1.5), `LOYALTY` (Loyalty Points v1.7) (brd-to-sdd.md:33). Both covers read `**Status:** In Review`; the one question of brd-to-sdd.md:32 ("ask once whether to derive from it (recommended: yes, proceed; an answer policy can take it") was taken by the policy as yes, its record held back like the mode answer (SKILL.md:155).
5. **Step 2a, before intake.** SKILL.md:147 "Runs in DERIVE-FROM-BRD as soon as the source BRDs are known (from the request ...), and always before step 3a."
6. **Find.** No `pre-sdd-*/` folder and no `PRE-SDD-*.md` file in the root. Driver: SKILL.md:149.
7. **Missing, stop.** SKILL.md:153 "**Missing** (no Pre-SDD names these BRDs): the same stop, with Request \"Create the Pre-SDD for BRDs <KEY list>\" and Link the absolute path of each BRD master (for a combined BRD, the file), separated by `; `." The "same stop" is SKILL.md:152: "stop before step 3a and write no chunk. Raise a handoff request to the E2E Architect on `unifier-status.md` ... Set this skill's row to `Waiting on: E2E Architect (HR-NNN)`. ... in `team` mode raise the request and stop." Also SKILL.md:546 "In `team` mode a hop never starts another skill. At a handoff it raises the request and stops". No offer was made.
8. **One request.** No own pending request about this Pre-SDD existed (SKILL.md:155 "when this skill's own request for it is still `Open`, `Later`, or `Accepted`, a later stop raises no new one"; SKILL.md:557), so a new one was raised: HR-001, the first ID (SKILL.md:559), State `Open` (SKILL.md:556 "The skill that raises a request writes its row, with State `Open`"). Why holds the blocker (SKILL.md:155 "Why with the current blockers").
9. **Own row.** State per SKILL.md:551; Folder `-` per SKILL.md:552 "`-` until then"; Waiting on per SKILL.md:553 "`<employee> (HR-NNN)` for each pending request ... whose answer this skill waits on"; only its own row changed (SKILL.md:550); board re-read just before writing, LF line endings kept (SKILL.md:564); UTC `YYYY-MM-DD HH:MM` (SKILL.md:542).
10. **Nothing in an SDD folder.** SKILL.md:155 "Nothing is written into the `sdd-[project-slug]/` folder, `decision-log.md` included, before this step passes by loading a signed Pre-SDD (item 3)". Files after Run 1: `brd-loyalty-points/`, `brd-refunds-portal/`, `run-brief.md`, `unifier-status.md`, `snapshots/`. No `sdd-*` folder, no SDD file, no `decision-log.md` outside the BRD folders.
11. **Reply.** Per the step 9 Pre-SDD line, SKILL.md:456 "or why no Pre-SDD was loaded (... waiting on the E2E Architect, with the HR-NNN)": "Keys: REFUNDS, LOYALTY. Stopped at step 2a: no Pre-SDD names these BRDs. No SDD folder or chunk was written. Raised HR-001 to the E2E Architect (pre-sdd-unifier) to create the Pre-SDD for BRDs REFUNDS, LOYALTY. Run mode is team, so I stop here; the derivation resumes at step 2a when a G3-signed Pre-SDD is handed off."

Board rows after Run 1 ([snapshots/run-1/unifier-status.md](./snapshots/run-1/unifier-status.md)):

```
Run mode: team
| Software Architect | Software Development & Delivery | sdd-unifier | - | Waiting on: E2E Architect (HR-001) | - | 2026-10-27 16:18 | DERIVE-FROM-BRD from REFUNDS and LOYALTY stopped at step 2a item 5 (no Pre-SDD names these BRDs); no SDD folder or chunk written; resume at step 2a item 1 when the E2E Architect hands off a G3-signed Pre-SDD | E2E Architect (HR-001) |
| HR-001 | Software Architect | E2E Architect | Create the Pre-SDD for BRDs REFUNDS, LOYALTY | No Pre-SDD names these BRDs (sdd-unifier step 2a item 5): the SDD derivation stops before step 3a and writes no chunk until a G3-signed Pre-SDD of REFUNDS v1.5 and LOYALTY v1.7 exists | 2026-10-27 16:18 | Open | - | <root>\brd-refunds-portal\refunds-portal-brd-master.md; <root>\brd-loyalty-points\loyalty-points-brd-master.md |
```

Checker:

```
> py -3 -B WT\_fixtures\checkers\check_status_board.py <root>   (PYTHONIOENCODING=utf-8)
0 problems
```

### Verdict: PASS

Every expected point holds. The two gaps the first run noted are closed: step 2a item 5 now gives the Request wording and Link (SKILL.md:153), and the Waiting on and Folder cells are defined (SKILL.md:552-553). The answer-policy record that could have created `decision-log.md` before the stop is now held back (SKILL.md:70, 155, 385).

## Run 2: solo mode, "later"

### Expected

The user sets `Run mode: solo`; the same request stops at step 2a again (search rerun from item 1); no new request (no HR-002), HR-001 reused; the skill offers to start `pre-sdd-unifier` now; on "later" HR-001 reads `Later`; own row still points at HR-001; no SDD folder or chunk; checker 0 problems.

### Observed, with the text that drove each action

1. **Run mode.** The user changed the header to `Run mode: solo` (SKILL.md:545).
2. **Mode prompt** again, taken by the policy as `chunks`, record held back (SKILL.md:52, 133, 382, 70, 385), as in Run 1.
3. **Board read.** Own row `Waiting on: E2E Architect (HR-001)`; HR-001 is a pending request this skill raised, State `Open`. Driver: SKILL.md:561 "the pending requests ... addressed to it and the ones it raised".
4. **Step 2a restarts at item 1.** SKILL.md:155 "a run the user starts before that request is taken also resumes here. A resumed derivation restarts this step at item 1 (the search), not item 2." Keys re-proposed as the same `REFUNDS`, `LOYALTY` (brd-to-sdd.md:33 "once the user has seen them they never change"). Search found nothing (SKILL.md:149); Missing (SKILL.md:153); stop before step 3a, no chunk (SKILL.md:152).
5. **Reuse, no new request.** SKILL.md:155 "One request stands for the Pre-SDD of these BRDs, whichever item raised it: when this skill's own request for it is still `Open`, `Later`, or `Accepted`, a later stop raises no new one, updates that request's Why with the current blockers and its Request wording when the blocker changed ..., and points this skill's row at it"; SKILL.md:557 "When one exists, it raises no new request: it updates that request's Why, its Request wording when the blocker changed, and its own row's Waiting on cell, and uses that request at this stop." The blocker is unchanged (still no Pre-SDD), so the Request wording stays and the Why already states the current blocker; Raised (UTC) stays 16:18.
6. **Solo offer.** "No Pre-SDD exists for BRDs REFUNDS, LOYALTY. Start pre-sdd-unifier (the E2E Architect) now, or later?" Drivers: SKILL.md:152 "In `solo` mode offer to start `pre-sdd-unifier` now (on \"later\" the request reads `Later`: § Status board)"; SKILL.md:547 "In `solo` mode a hop offers to start the next skill in the same session." The answer policy did not answer it: the offer carries no recommended option (SKILL.md:382), so it waited for the user. The user answered "later".
7. **Later on the reused request.** SKILL.md:558 "When the user answers \"later\" at a handoff offer, the raiser itself sets State `Later` on the request it raised or reused at that stop"; SKILL.md:556 "On State, the raiser sets only `Open` or `Later`, and only on its own request while it reads `Open` or `Later`." HR-001 moved `Open` to `Later`; Closed (UTC) stays `-`.
8. **Own row** updated at the stop (SKILL.md:562): Updated 16:19, Next step names the reuse and the "later", State and Waiting on still `HR-001` (SKILL.md:551, 553).
9. **Nothing in an SDD folder** (SKILL.md:155). Files after Run 2: unchanged apart from the board and `snapshots/run-2/`. No `sdd-*` folder, no SDD file, no `decision-log.md`.
10. **Reply** (SKILL.md:456): "Stopped at step 2a again: no Pre-SDD names BRDs REFUNDS, LOYALTY. No SDD folder or chunk was written. HR-001 is reused (no new request) and now reads Later, as you chose. The derivation resumes at step 2a when a G3-signed Pre-SDD is handed off."

Board rows after Run 2 ([snapshots/run-2/unifier-status.md](./snapshots/run-2/unifier-status.md)); `diff` against Run 1 shows exactly three changed lines (header, own row, HR-001 State):

```
Run mode: solo
| Software Architect | Software Development & Delivery | sdd-unifier | - | Waiting on: E2E Architect (HR-001) | - | 2026-10-27 16:19 | DERIVE-FROM-BRD from REFUNDS and LOYALTY stopped again at step 2a item 5 (search rerun from item 1, no Pre-SDD names these BRDs); HR-001 reused; user chose later at the offer to start pre-sdd-unifier; no SDD folder or chunk written; resume at step 2a item 1 when the E2E Architect hands off a G3-signed Pre-SDD | E2E Architect (HR-001) |
| HR-001 | Software Architect | E2E Architect | Create the Pre-SDD for BRDs REFUNDS, LOYALTY | No Pre-SDD names these BRDs (sdd-unifier step 2a item 5): the SDD derivation stops before step 3a and writes no chunk until a G3-signed Pre-SDD of REFUNDS v1.5 and LOYALTY v1.7 exists | 2026-10-27 16:18 | Later | - | <root>\brd-refunds-portal\refunds-portal-brd-master.md; <root>\brd-loyalty-points\loyalty-points-brd-master.md |
```

No HR-002 row exists.

Checker:

```
> py -3 -B WT\_fixtures\checkers\check_status_board.py <root>   (PYTHONIOENCODING=utf-8)
0 problems
```

### Verdict: PASS

Every expected point holds. The first run's failure is fixed: SKILL.md:155 and 557 forbid the duplicate request and name what is updated, SKILL.md:556 and 558 let the raiser move its own reused request to `Later`, and SKILL.md:155 restarts a resumed step 2a at item 1, closing the "resume at item 2" gap.

## Observations (not ambiguities in the tested behavior)

None of these changed a stop, a request, a board cell's meaning, or a file written; each reading gives the same board.

- The mode prompt (step 1) is still asked before the step 2a stop, so its answer goes unused in a stopped run. Its record is now held back (SKILL.md:70, 155), so nothing is written. Harmless.
- brd-to-sdd.md:32 (the one question for a BRD whose cover Status is not `Approved`) has no stated place relative to step 2a; brd-to-sdd.md:441 orders only form detection and key proposal before it. The run asked it with the keys, before step 2a; asking it after a passed step 2a would give the same result here.
- SKILL.md:153 "<KEY list>" gives no separator; the run wrote `REFUNDS, LOYALTY`.
- The `<root>` path is long; the board holds it in full, as SKILL.md:153 asks for an absolute path.

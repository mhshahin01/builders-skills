# RESULT: missing Pre-SDD (Task 7.4 Step 1)

Runs on 2026-10-27, 16:01 to 16:03 UTC. Skill under test: `WT\sdd-unifier\SKILL.md` read from disk (WT = `C:\Users\negat\.claude\skills-wt\pre-sdd-unifier`, branch feat/pre-sdd-unifier). Plan and expectations: [run-brief.md](./run-brief.md). No skill was edited.

| Run | Mode | Verdict |
|---|---|---|
| 1 | team | PASS |
| 2 | solo, "later" | FAIL (skill text ambiguous on a second stop; outcome otherwise as expected) |

## Run 1: team mode

### Expected

Stop at step 2a before step 3a; no SDD chunk; HR-001 to the E2E Architect asking to create the Pre-SDD; own row `Waiting on: E2E Architect (HR-001)`; no start of, or offer to start, `pre-sdd-unifier`; checker 0 problems.

### Observed, step by step, with the text that drove each action

1. **Board read at the start.** Own row `Not started`, no requests addressed to `sdd-unifier`. Driver: SKILL.md:557 "At the start of every run it reads the board: its own row, its pending requests (`Open`, `Later`, or `Accepted`), and the upstream states."
2. **Mode prompt.** No argument and no SDD in the folder, so the resume check found nothing and the mode prompt was asked; the user pressed Enter, giving CHUNKS. Drivers: SKILL.md:52 "Run the resume check first (step 1) ... Otherwise run the **interactive mode prompt**"; SKILL.md:59 "**Output format?** [chunks / combined] - default `chunks`"; SKILL.md:66 "Empty reply / Enter ... → **CHUNKS mode**." Generation line said: "Generation: parts (default). Say 'whole' to get everything in one go." (SKILL.md:79).
3. **Project files.** None in the root (`AGENTS.md`, `AGENT.md`, `CLAUDE.md`, `ui-ux-global-constitution.md` all absent). Driver: SKILL.md principle 19 (line 120).
4. **Intent.** DERIVE-FROM-BRD, the request names the two BRD folders (SKILL.md step 2).
5. **Step 2a runs before intake.** The source BRDs were known from the request, so step 2a ran before step 3 and step 3a. Driver: SKILL.md:147 "Runs in DERIVE-FROM-BRD as soon as the source BRDs are known (from the request, or from the intake answer of step 3), and always before step 3a."
6. **Find.** `ls pre-sdd-*/` and `ls PRE-SDD-*.md` in the root returned nothing. Driver: SKILL.md:149 "Look in the project root, beside the BRDs, for `pre-sdd-*/` folders ... and combined `PRE-SDD-*.md` files".
7. **Missing, stop.** Driver: SKILL.md:153 "**Missing** (no Pre-SDD names these BRDs): the same stop, with a request to create the Pre-SDD for these BRDs." The "same stop" is SKILL.md:152 "stop before step 3a and write no chunk. Raise a handoff request to the E2E Architect on `unifier-status.md` ... and set this skill's row to `Waiting on: E2E Architect (HR-NNN)`. ... in `team` mode raise the request and stop." Also SKILL.md:546 "In `team` mode a hop never starts another skill. At a handoff it raises the request and stops".
8. **Board writes.** HR-001 is the first ID (SKILL.md:555), State `Open` (SKILL.md:554); only the own row changed (SKILL.md:550); the board was re-read just before writing (SKILL.md:560).

Board rows after Run 1 ([snapshots/run-1/unifier-status.md](./snapshots/run-1/unifier-status.md)):

```
Run mode: team
| Software Architect | Software Development & Delivery | sdd-unifier | - | Waiting on: E2E Architect (HR-001) | - | 2026-10-27 16:02 | DERIVE-FROM-BRD stopped at step 2a (no Pre-SDD for these BRDs); resume at step 2a when a G3-signed Pre-SDD is handed off | E2E Architect (HR-001) |
| HR-001 | Software Architect | E2E Architect | Create the Pre-SDD for brd-refunds-portal v1.5 and brd-loyalty-points v1.7 (one Pre-SDD for one SDD with these two parent BRDs) | sdd-unifier step 2a item 5: no Pre-SDD names these BRDs, so the SDD derivation stops before step 3a and writes no chunk until a G3-signed Pre-SDD exists | 2026-10-27 16:02 | Open | - | <root>\brd-refunds-portal\refunds-portal-brd-master.md; <root>\brd-loyalty-points\loyalty-points-brd-master.md |
```

(`<root>` stands for this scenario folder's absolute path, written in full on the board.)

Files after Run 1: `brd-loyalty-points/`, `brd-refunds-portal/`, `run-brief.md`, `unifier-status.md`, `snapshots/`. No `sdd-*` folder, no SDD file, no `decision-log.md`.

Chat reply to the user (step 9 line for "why no Pre-SDD was loaded", SKILL.md:456 "waiting on the E2E Architect, with the HR-NNN"): "Stopped at step 2a: no Pre-SDD names brd-refunds-portal and brd-loyalty-points. No SDD chunk was written. Raised HR-001 to the E2E Architect (pre-sdd-unifier) to create the Pre-SDD for these BRDs. Run mode is team, so I stop here; the derivation resumes at step 2a when a G3-signed Pre-SDD is handed off."

Checker:

```
> py -3 -B WT\_fixtures\checkers\check_status_board.py <scenario folder>
0 problems
```

### Verdict: PASS

Every expected point holds. Minor gaps that did not change the outcome (for the controller, not failures):

- Step 2a gives no Request wording and no Link for its request (SKILL.md:152-153), unlike the other hand-offs (WT\brd-unifier\SKILL.md:366 "Link the absolute path of the BRD master"; WT\pre-sdd-unifier\SKILL.md:301). The run linked both BRD masters by absolute path.
- The board section never says what the `Waiting on` column holds beside the State cell's `Waiting on: <employee> (<request ID>)` (SKILL.md:548, 551), nor what the Folder cell holds when the hop has no folder yet. The run wrote `E2E Architect (HR-001)` and `-`.
- The mode prompt (step 1) is asked before the step 2a stop, so the user answers a question the run then cannot use. Harmless here.
- Not exercised: with a standing answer policy instead of interactive answers, its answer to the mode prompt would trigger SKILL.md:385 "The policy itself is recorded once, as a delegation, in `decision-log.md` ... the first time it answers; that record creates the register if it does not exist yet", which would create `sdd-[project-slug]/decision-log.md` before the stop, with no project slug settled (intake, step 3, has not run). Worth a look before the unsigned scenario (Step 2) is run under an answer policy.

## Run 2: solo mode, "later"

### Expected

The user sets `Run mode: solo`; the same request stops at step 2a again; the skill offers to start `pre-sdd-unifier` now; on "later" the request reads `Later`; no SDD chunk; checker 0 problems.

### Observed

1. The user changed the header to `Run mode: solo` (SKILL.md:545 "Only the user changes it.").
2. Board read at the start (SKILL.md:557): own row `Waiting on: E2E Architect (HR-001)`; HR-001 is addressed to the E2E Architect, so it is not one of this skill's pending requests.
3. Mode prompt asked again and answered with Enter (no SDD master exists, so no resume: SKILL.md:52, 133). Generation line said as in Run 1.
4. Step 2a again (SKILL.md:155 "a run the user starts before that request is taken also resumes here"). Find returned nothing (SKILL.md:149); Missing (SKILL.md:153); stop before step 3a, no chunk (SKILL.md:152).
5. Solo offer, made: "No Pre-SDD exists for these BRDs. Start pre-sdd-unifier (the E2E Architect) now, or later?" Driver: SKILL.md:152 "In `solo` mode offer to start `pre-sdd-unifier` now"; SKILL.md:547 "In `solo` mode a hop offers to start the next skill in the same session." The user answered "later".
6. Request written. Item 152 tells the run to "Raise a handoff request", SKILL.md:555 "A new request takes the next number after the highest ID on the board", and SKILL.md:554 "The skill that raises a request writes its row, with State `Open`, or `Later` when the user chose later at the handoff offer." So the run raised HR-002 with State `Later` and pointed its row at HR-002. It left HR-001 `Open`, because after raising, State belongs to the receiver: SKILL.md:554 "The receiving skill updates only State and Closed (UTC)", and SKILL.md:560 "change only the cells you own".

Board rows after Run 2 ([snapshots/run-2/unifier-status.md](./snapshots/run-2/unifier-status.md)):

```
Run mode: solo
| Software Architect | Software Development & Delivery | sdd-unifier | - | Waiting on: E2E Architect (HR-002) | - | 2026-10-27 16:03 | DERIVE-FROM-BRD stopped at step 2a again (no Pre-SDD for these BRDs); user chose later at the offer to start pre-sdd-unifier; resume at step 2a when a G3-signed Pre-SDD is handed off | E2E Architect (HR-002) |
| HR-001 | Software Architect | E2E Architect | Create the Pre-SDD for brd-refunds-portal v1.5 and brd-loyalty-points v1.7 (one Pre-SDD for one SDD with these two parent BRDs) | sdd-unifier step 2a item 5: ... | 2026-10-27 16:02 | Open | - | <root>\brd-refunds-portal\refunds-portal-brd-master.md; <root>\brd-loyalty-points\loyalty-points-brd-master.md |
| HR-002 | Software Architect | E2E Architect | Create the Pre-SDD for brd-refunds-portal v1.5 and brd-loyalty-points v1.7 (one Pre-SDD for one SDD with these two parent BRDs) | sdd-unifier step 2a item 5: ...; solo mode, user answered later to starting pre-sdd-unifier now | 2026-10-27 16:03 | Later | - | <root>\brd-refunds-portal\refunds-portal-brd-master.md; <root>\brd-loyalty-points\loyalty-points-brd-master.md |
```

Files after Run 2: unchanged apart from the board and `snapshots/run-2/`. No `sdd-*` folder, no SDD file, no `decision-log.md`.

Checker:

```
> py -3 -B WT\_fixtures\checkers\check_status_board.py <scenario folder>
0 problems
```

### Verdict: FAIL (ambiguous skill text)

What held: the stop, no chunk written, the solo offer, a request in State `Later`, and 0 checker problems.

Why FAIL: the brief expects "the request reads `Later`", meaning one request. The skill text gives no rule for a run that reaches the step 2a stop when its own request for the same Pre-SDD is already on the board. Read literally, it makes the run do something else: it raises a duplicate request, and the original stays `Open`. The board now holds two rows for one ask in conflicting states (HR-001 `Open`, HR-002 `Later`), so the E2E Architect cannot tell whether the user wants the Pre-SDD now or later. The exact text:

- SKILL.md:152 "Raise a handoff request to the E2E Architect on `unifier-status.md`" and SKILL.md:153 "the same stop, with a request to create the Pre-SDD for these BRDs": every stop raises a request, with no exception when one is already pending.
- SKILL.md:555 "A new request takes the next number after the highest ID on the board."
- SKILL.md:547 "\"Later\" sets the request State to `Later`.": it does not say which request when one is already `Open`.
- SKILL.md:554 "The receiving skill updates only State and Closed (UTC)" with SKILL.md:560 "change only the cells you own": the raiser may not move its own HR-001 from `Open` to `Later`, so reusing HR-001 is not allowed either.

A related ambiguity: SKILL.md:155 "taking it resumes the derivation here, at item 2 ...; a run the user starts before that request is taken also resumes here". Resuming "at item 2" (read it) skips item 1 (find it), which a missing Pre-SDD needs. The run did item 1 again.

Fix for the controller to weigh (not applied): when this skill's own request for the same Pre-SDD is already `Open` or `Later`, raise no new one and point the row at it. In solo mode, "later" or "now" may then move that request between `Open` and `Later` as its raiser. Say that a run resumed before the hand-off starts step 2a at item 1. The same "re-run at a pending hand-off" gap probably applies to the identical § Status board text in every chain skill (it is shared word for word: SKILL.md:514).

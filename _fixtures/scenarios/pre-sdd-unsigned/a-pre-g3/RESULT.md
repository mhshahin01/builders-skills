# RESULT: Pre-SDD present, G3 not signed, team mode (Task 7.4 Step 2, case A)

Run on 2026-10-27, 19:53 to 19:54 UTC. Skill under test: `WT\sdd-unifier\SKILL.md` and `brd-to-sdd.md`, read from disk by path (WT = `C:\Users\negat\.claude\skills-wt\pre-sdd-unifier`, working tree). The pre-sdd-unifier rule files were not read for this case. No git command, no subagent, no browser. Plan: [run-brief.md](./run-brief.md). `<root>` is this folder's absolute path.

## Setup

- BRDs and `AGENTS.md` copied from `run-2026-10-27b-psdd`; `pre-sdd-refunds-platform/` copied from its `_snapshots\pre-sdd-refunds-platform.pre-g3\` (v1.0; master gate line `G2 - G3: Not signed - SDD authorized: No`; chunk 12 section 12.1 Gate `G2`, G3 status `Not signed`, Authorized `No`, Signers `Not signed`; chunk 11 lists ten unsigned roles and G3-01 to G3-14 `Open`).
- Board cut from the template at `SKILL.md` section Status board (the fenced block), `Run mode: team` set by the tester, E2E Architect row `In progress: stage 4 (G3 sign-off stop)`, Folder `pre-sdd-refunds-platform/`, Version 1.0, no requests; LF line endings. [snapshots/run-0/unifier-status.md](./snapshots/run-0/unifier-status.md). Checker on it: `0 problems`.
- Request: "Derive an SDD from these BRDs: ./brd-refunds-portal and ./brd-loyalty-points. Answer policy: accept the recommended option."

## Expected

See run-brief.md: stop at step 2a item 4 before step 3a; no SDD folder, chunk or `decision-log.md`; one request HR-001 to the E2E Architect with the blockers and the master's absolute path; own row `Waiting on: E2E Architect (HR-001)`; no offer in team mode; checker 0 problems.

## Observed, with the text that drove each action

1. **Mode and keys.** Mode prompt taken by the policy as `chunks`, its record held back (SKILL.md:52, 70, 391, 394, as in the missing-Pre-SDD rerun). DERIVE-FROM-BRD; BRD form and keys before step 2a: `REFUNDS` (Refunds Portal v1.5), `LOYALTY` (Loyalty Points v1.7), both chunked, covers `In Review`, taken by the policy as "derive" (brd-to-sdd.md:441).
2. **Board read** at the start: own row `Not started`, no request (SKILL.md:571 and the "When a skill uses the board" list).
3. **Item 1, find.** SKILL.md:158. `pre-sdd-refunds-platform/` found in the root; its master `refunds-platform-pre-sdd-master.md`; chunk 00 Source BRDs links `../brd-refunds-portal/refunds-portal-brd-master.md` and `../brd-loyalty-points/loyalty-points-brd-master.md`, the same set as this SDD's sources. One Pre-SDD, one match, no question.
4. **Item 2, read in order.** SKILL.md:159. Chunk 12 first: section 12.1 Gate `G2`, G3 status `Not signed`, Authorized `No`, Signers `Not signed`. Then the master's gate line: `G2 - G3: Not signed - SDD authorized: No`. Then chunk 11: section 11.1 G3 Approve `Not signed`, Missing lists ten `has not signed` rows and G3-01 to G3-14 `Open`. Nothing else of the Pre-SDD was read for content.
5. **Item 4, not signed, stop.** SKILL.md:161: "any other G3 status ... stop before step 3a and write no chunk"; the G3 status `Not signed` is not `Approved` or `Approved with conditions`, so item 3 (SKILL.md:160) does not apply. Request wording and Link from the same item: "Pre-SDD <slug> v<X.Y> blocks the SDD: <blockers>", the blockers "what G3 still needs as the gate line and chunk 11 name them", Link "the absolute path of the Pre-SDD master". `<slug>` is `refunds-platform`, version 1.0. The row is set to `Waiting on: E2E Architect (HR-NNN)` (same item). No other request on the board, so a new one: HR-001, the first ID, State `Open` (Status board, Handoff requests table rules).
6. **Team mode.** SKILL.md:161 "in `team` mode raise the request and stop"; SKILL.md:555 "In `team` mode a hop never starts another skill. At a handoff it raises the request and stops". No offer was made.
7. **Own row.** State `Waiting on: E2E Architect (HR-001)`, Folder `-` (no SDD folder), Waiting on `E2E Architect (HR-001)`, only this row changed, LF kept, UTC time (SKILL.md:571, 573 and the Employees table rules).
8. **Nothing in an SDD folder.** SKILL.md:164 "Nothing is written into the `sdd-[project-slug]/` folder, `decision-log.md` included, before this step passes by loading a signed Pre-SDD". Files after the run: `AGENTS.md`, `brd-loyalty-points/`, `brd-refunds-portal/`, `pre-sdd-refunds-platform/` (unchanged), `run-brief.md`, `snapshots/`, `unifier-status.md`. No `sdd-*` folder, no SDD file, no `decision-log.md` outside the BRD and Pre-SDD folders.
9. **Reply** (SKILL.md:465, "waiting on the E2E Architect, with the HR-NNN"): "Keys: REFUNDS, LOYALTY. Stopped at step 2a: Pre-SDD refunds-platform v1.0 exists but G3 is Not signed (ten roles have not signed; G3-01 to G3-14 are Open). No SDD folder or chunk was written. Raised HR-001 to the E2E Architect. Run mode is team, so I stop here; the derivation resumes at step 2a item 1 when a G3-signed Pre-SDD is handed off."

Board rows after the run ([snapshots/unifier-status.md](./snapshots/unifier-status.md)):

```
Run mode: team
| E2E Architect | Software Development & Delivery | pre-sdd-unifier | pre-sdd-refunds-platform/ | In progress: stage 4 (G3 sign-off stop) | 1.0 | 2026-10-27 19:10 | Waiting for the signers at the G3 sign-off stop (stage 4) | - |
| Software Architect | Software Development & Delivery | sdd-unifier | - | Waiting on: E2E Architect (HR-001) | - | 2026-10-27 19:54 | DERIVE-FROM-BRD from REFUNDS and LOYALTY stopped at step 2a item 4 (Pre-SDD refunds-platform v1.0 found, G3 Not signed); no SDD folder or chunk written; resume at step 2a item 1 when the E2E Architect hands off a G3-signed Pre-SDD | E2E Architect (HR-001) |
| HR-001 | Software Architect | E2E Architect | Pre-SDD refunds-platform v1.0 blocks the SDD: G3 Not signed (gate line G2, SDD authorized: No): the ten applicable roles have not signed (Business sponsor; Product owner / business process owner; Lead / principal architect; Infrastructure / platform owner; Network owner; Security and privacy/compliance; Data owner; SRE / operations; Finance / procurement; Architecture review authority), and G3 checklist lines G3-01 to G3-14 are Open | Pre-SDD refunds-platform v1.0 names REFUNDS v1.5 and LOYALTY v1.7 but is not signed (sdd-unifier step 2a item 4): the SDD derivation stops before step 3a and writes no chunk until G3 reads Approved or Approved with conditions | 2026-10-27 19:54 | Open | - | <root>\pre-sdd-refunds-platform\refunds-platform-pre-sdd-master.md |
```

The Link resolves (the script that wrote it checked the path exists: True). Checker:

```
> py -3 -B WT\_fixtures\checkers\check_status_board.py <root>   (PYTHONIOENCODING=utf-8)
0 problems
```

## Verdict: PASS

Every expected point holds.

## Observations (none changed a stop, request, cell or file)

- SKILL.md:161 gives "the blockers being what G3 still needs as the gate line and chunk 11 name them" without a format; the run wrote the G3 status, the ten role names and the checklist range. Chunk 11's Missing cell is long (24 clauses), so a summary is needed; the skill does not say whether to summarize or paste.
- The master gate line (`G2 - ...`) shows the engine label `G2` first, which reads like a partial approval; item 4's "any other G3 status" is satisfied by the second field, so the stop is unambiguous.

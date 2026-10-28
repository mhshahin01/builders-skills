# RESULT: Pre-SDD signed, then changed after G3 (G3 Review), solo mode (Task 7.4 Step 2, case B)

Run on 2026-10-27, 19:55 to 19:59 UTC. Skill under test: `WT\sdd-unifier\SKILL.md` and `brd-to-sdd.md`, read from disk by path (WT = `C:\Users\negat\.claude\skills-wt\pre-sdd-unifier`, working tree). For the setup only: `WT\pre-sdd-unifier\gates-and-signoff.md` (section Change after G3, lines 192-200), `SKILL.md` (step 13, section Later requests) and the CLI `WT\pre-sdd-unifier\studio\cli.mjs`. The SDD side never read the pre-sdd-unifier rule files. No git command, no subagent, no browser. Plan: [run-brief.md](./run-brief.md). `<root>` is this folder's absolute path.

## Setup steps (E2E Architect, pre-sdd-unifier)

1. Copied the BRDs, `AGENTS.md` and the signed `pre-sdd-refunds-platform/` (G3 Approved with conditions, after Task 7.2b; state content hash `4cb00d24633c9c0c3322374e2ed2547b6e5e3edcdf5619a8de021f917014043f`) from `run-2026-10-27b-psdd`.
2. Patch `studio/patches/20261027T195557Z-change-after-g3-CAP-07.1.json`, actor `{type: person, name: "Product Owner (fixture owner)"}` (CAP-07.1 is a protected value, a Confirmed policy value that only a person changes: engine-and-studio.md:206 and register-and-entries.md:216): ops `set CAP-07.1 value 1500` and `confirm CAP-07.1`.
3. `node cli.mjs derive studio/project-state.json --apply <patch>`: exit 0, no errors; CAP-07.1 2000 (Confirmed, Policy) to 1500 (Estimated, then Confirmed by the person); state hash changed to `a34e55e8dc2c85b1df606b7653639434bf27261221447afe62076cc4aa699e0b`. Engine result: G3 `Review`, label `G2`, authorized `false`; problems: "Sign-off records given on other content (the content hash has changed since): <ten roles>; sign again after the review." plus ten "has not signed" lines.
4. `node cli.mjs compute studio/project-state.json --out studio` (exit 0, gate `G2`); `cli.mjs validate project-state.json`: 4 PASS ("state compute: gate G2, not authorized to start the SDD"). `fragments/11-gate.md` shows G3 Approve `Review`, label `G2`, authorized `No`.
5. Rewrote by script `TOOLS\unsigned-run\b_rewrite.py` (pre-sdd SKILL.md:292, step 13 item 6: "rewrite chunk 11 ..., chunk 12 (the gate state and the signers), chunk 00 (the gate state), and the master's gate line from the new fragments"):
   - master **Gate:** line to `G2 - G3: Review - SDD authorized: No`;
   - chunk 11: the `11-gate.md` ENGINE-FRAGMENT region replaced unchanged by the new fragment, and section 11.2 "SDD initiation authorized by" to the template's `Not authorized: G3 Review; see § 11.1`;
   - chunk 12 section 12.1: Gate `G2`, G3 status `Review`, Authorized `No`, Signers `Not signed` (chunks/12 template, line 28);
   - chunk 00's gate line to `G2` (not in the brief's list, but named by pre-sdd SKILL.md:292; the SDD never reads it);
   - the master's Next line and stage 4 row (Waiting, `G3 Review`, Handoff `Not raised: G3 not signed`) so the progress table matches the board (pre-sdd SKILL.md:188, update after every stop).
6. Not done, because the brief limits the rewrite to the gate files: the version bump and Changes Log row, the delta review, and the content chunks the change touches (03b register, 04, 10, and chunk 12 section 12.2 lock row CAP-07.1, still `2,000 ms`). `check_presdd.py` therefore reports 3 problems (the 03b, 10 and 12.2 regions differ from the recomputed fragments); nothing the SDD reads at this stop depends on them. See Observations.
7. Board: template from `sdd-unifier\SKILL.md` section Status board, `Run mode: solo` (the template default), E2E Architect row `In progress: stage 4 (G3 sign-off stop)`, Folder `pre-sdd-refunds-platform/`, Version 1.0, Next step "CAP-07.1 changed after G3, G3 back to Review; waiting for the ten roles to sign again at the G3 sign-off stop"; no requests. [snapshots/run-0/unifier-status.md](./snapshots/run-0/unifier-status.md); checker `0 problems`.

The engine accepted the patch; nothing was unclear enough to need a workaround.

## Expected

See run-brief.md.

## Observed, with the text that drove each action

1. **Mode, keys, board read:** as in case A (SKILL.md:52, 70, 391, 394, 571; brd-to-sdd.md:441). Keys `REFUNDS`, `LOYALTY`. Request as in case A.
2. **Item 1, find** (SKILL.md:158): `pre-sdd-refunds-platform/` found, chunk 00 Source BRDs name the same two BRDs. Match.
3. **Item 2, read in order** (SKILL.md:159): chunk 12 section 12.1: Gate `G2`, G3 status `Review`, Authorized `No`, Signers `Not signed`; its "How the SDD reads this gate" text says `Review` means not signed. Master gate line: `G2 - G3: Review - SDD authorized: No`. Chunk 11: section 11.1 G3 Approve `Review`, Missing "Sign-off records given on other content ...: the ten roles; sign again after the review" and ten "has not signed" lines; section 11.2 `Not authorized: G3 Review; see § 11.1`.
4. **Item 3 does not load it.** SKILL.md:160 requires "the G3 status reads `Approved` or `Approved with conditions`, chunk 12 § 12.1 shows the start authorized, and the master's gate line does not read `Review`": all three fail (status `Review`, authorized `No`, gate line `Review`).
5. **Item 4, stop** (SKILL.md:161): "Present but not signed (any other G3 status ...): stop before step 3a and write no chunk". Request "Pre-SDD refunds-platform v1.0 blocks the SDD: <blockers>", the blockers per the gate line and chunk 11: G3 reads Review, sign-offs were given on other content, the ten roles must sign again. Link the master's absolute path. Row `Waiting on: E2E Architect (HR-001)`. No earlier request, so HR-001 is new, State `Open`.
6. **Solo offer** (SKILL.md:161 "In `solo` mode offer to start `pre-sdd-unifier` now (on "later" the request reads `Later`)"; SKILL.md:555 area, "In `solo` mode a hop offers to start the next skill"): "Pre-SDD refunds-platform v1.0 is back to G3 Review after a change; ten roles must sign again. Start pre-sdd-unifier (the E2E Architect) now, or later?" The answer policy does not answer it (no recommended option: SKILL.md:391). The tester answered "later".
7. **Later** (SKILL.md:567): "the raiser itself sets State `Later` on the request it raised or reused at that stop". HR-001 `Open` to `Later`; Closed `-`. Own row Next step names the "later".
8. **Nothing in an SDD folder** (SKILL.md:164). Files after the run: `AGENTS.md`, `brd-*`, `pre-sdd-refunds-platform/`, `run-brief.md`, `snapshots/`, `unifier-status.md`, `RESULT.md`. No `sdd-*`, no SDD chunk, no `decision-log.md` outside the BRD and Pre-SDD folders.
9. **Reply** (SKILL.md:465): "Stopped at step 2a: Pre-SDD refunds-platform v1.0 exists but G3 reads Review (a change after sign-off; the ten roles must sign again). No SDD folder or chunk was written. HR-001 raised to the E2E Architect and set to Later, as you chose. The derivation resumes at step 2a item 1 when a G3-signed Pre-SDD is handed off."

Board rows after the run ([snapshots/unifier-status.md](./snapshots/unifier-status.md)):

```
Run mode: solo
| E2E Architect | Software Development & Delivery | pre-sdd-unifier | pre-sdd-refunds-platform/ | In progress: stage 4 (G3 sign-off stop) | 1.0 | 2026-10-27 19:58 | CAP-07.1 changed after G3, G3 back to Review; waiting for the ten roles to sign again at the G3 sign-off stop | - |
| Software Architect | Software Development & Delivery | sdd-unifier | - | Waiting on: E2E Architect (HR-001) | - | 2026-10-27 19:59 | DERIVE-FROM-BRD from REFUNDS and LOYALTY stopped at step 2a item 4 (Pre-SDD refunds-platform v1.0 found, G3 Review); user chose later at the offer to start pre-sdd-unifier; no SDD folder or chunk written; resume at step 2a item 1 when the E2E Architect hands off a G3-signed Pre-SDD | E2E Architect (HR-001) |
| HR-001 | Software Architect | E2E Architect | Pre-SDD refunds-platform v1.0 blocks the SDD: G3 reads Review (gate line G2 - G3: Review - SDD authorized: No): sign-off records were given on other content, so the ten applicable roles must sign again (Business sponsor; Product owner / business process owner; Lead / principal architect; Infrastructure / platform owner; Network owner; Security and privacy/compliance; Data owner; SRE / operations; Finance / procurement; Architecture review authority); chunk 11 lists the checklist and the sign-off register | Pre-SDD refunds-platform v1.0 names REFUNDS v1.5 and LOYALTY v1.7 but its G3 went back to Review after a change (sdd-unifier step 2a item 4; the gate line reads Review, so item 3 does not load it): the SDD derivation stops before step 3a and writes no chunk until G3 reads Approved or Approved with conditions again | 2026-10-27 19:59 | Later | - | <root>\pre-sdd-refunds-platform\refunds-platform-pre-sdd-master.md |
```

Checker:

```
> py -3 -B WT\_fixtures\checkers\check_status_board.py <root>   (PYTHONIOENCODING=utf-8)
0 problems
```

## Verdict: PASS

Every expected point holds, including the one that matters here: the gate line reading `Review` keeps item 3 from loading a Pre-SDD whose earlier sign-offs were real.

## Observations

- gates-and-signoff.md section Change after G3 (lines 192-200) does not say which files a change after G3 rewrites. The run took pre-sdd SKILL.md:292 (step 13 item 6, written for "after signing") and the brief's list: gate line, chunk 11, chunk 12 section 12.1, plus chunk 00's gate line. A reader of only that section would not learn that the master's gate line and chunk 12 section 12.1 must read `Review` for the SDD's stop to work; that fact sits in chunk 12's own "How the SDD reads this gate" text, in handoff-guide.md:38, and in chunking.md:60.
- Because the brief limited the rewrite, chunk 12 section 12.2 still locks CAP-07.1 at `2,000 ms` while the state says 1,500 ms. The SDD stops before it reads 12.2, so no harm here; a full update (pre-sdd SKILL.md:337, the tail) would rewrite 03b, 04, 10 and 12.2 from the new fragments and bump the version.
- The signature records of chunk 11 section 11.1 are replaced by the fragment (all `Not signed`); the skill has no text on keeping the earlier sign-offs visible as history. They stay in the state's history and `decision-log.md`.

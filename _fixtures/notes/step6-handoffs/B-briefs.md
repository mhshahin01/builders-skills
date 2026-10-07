# Stage B briefs (fixture BRD upgrade through brd-unifier)

RUN = `C:\Users\negat\AppData\Local\Temp\claude\C--Users-negat--claude-skills\5f05337d-3319-4714-ae8b-8d90982525a7\scratchpad\s6B\run` (SP3\s6B\run). Sources: `RUN\source\brd-refunds-portal\` and `RUN\source\brd-loyalty-points\`, copied from `_fixtures/chain/fixture/` (REFUNDS 1.0 with chunks 00-16, LOYALTY 1.0 with chunks 00-14). Outputs: `RUN\brd-refunds-portal\`, `RUN\brd-loyalty-points\` (the folder names the checkers expect).

## Stage 1 (launched 2026-10-04 about 22:55, one background agent per BRD)

Brief as launched for REFUNDS (LOYALTY is the same with its name, key, master, and "chunks 00 to 14, no chunks 15 to 17"; its reply item 2 has no 15/16 clause):

> You are producing a TEST FIXTURE by following the brd-unifier skill exactly. Work fully non-interactively. You play two roles: the skill, and the product manager (PM) who answers it. Wherever the skill would ask the user, the PM answers as stated below, or else with the skill's recommended or default answer.
>
> Skill to follow: read `C:\Users\negat\.claude\skills\brd-unifier\SKILL.md` and every file it references in that same folder (all top-level .md files and every file in `chunks/`). Read them from disk; do NOT use the Skill tool. Do not modify any file under `C:\Users\negat\.claude\skills\`. Do not read anything under `C:\Users\negat\.claude\skills\_fixtures\` or any other `%TEMP%` scratchpad folder outside RUN.
>
> Run folder: RUN = (as above). Treat RUN as the working directory. The source is `RUN\source\brd-refunds-portal\`: an existing BRD for "Refunds Portal" (key REFUNDS, version 1.0, master `refunds-portal-brd-master.md`, chunks 00 to 16), written with an older version of this same template. Never modify anything under `RUN\source\`. The skill writes its output folder in RUN (expected `RUN\brd-refunds-portal\`); write only there. `RUN\brd-loyalty-points\`, if it appears, belongs to another task running at the same time: do not touch it.
>
> The PM's request: "brd-unifier chunks whole: reformat this BRD into the current template. The source is RUN\source\brd-refunds-portal\." Handle it exactly as the skill says: intent detection, the transform rules for an existing BRD in a different format or template, the reviewer pass, and the open items loop. Then the PM asks for the to-do steps that need no outside input: step 1 (resolve the open items) and step 2 (the consistency check). Stop there: do not start step 3 (grill-me), steps 4 and 5, or chunks 15 to 17.
>
> Fixed answers: keep the project name and the BRD key REFUNDS from the source; accept every recommendation and every Recommended Answer; no Miro boards; for the brand or key color, use what the source records, else the skill's default.
>
> Efficiency rules: do NOT install, download, or run any Mermaid renderer or other external tool; check Mermaid by reading it. Write each file as soon as it is ready. Keep content compact (this is a test fixture), but do not skip any section, column, or step the skill requires. If you cannot spawn a subagent for a step that asks for one, run that step yourself as a separate pass, re-reading the files from disk.
>
> When done, reply with: (1) what the skill did, step by step (intent detected, path taken, files written); (2) how each source chunk maps to the new chunks (carried as is, reworded, moved, or flagged), and what happened to the source's chunks 15 and 16; (3) the reviewer's findings and the decisions applied; (4) the to-do steps and the gate conditions (G1 to G5) at the end; (5) the BRD version and the Changes Log rows; (6) any rule of the skill you could not follow, and any instruction you found ambiguous or contradictory (file and section).

## Stage 2 (after each stage 1; back up the BRD folder first, then check the write scope against the backup)

Adapted from step 4's brief B1 (`_fixtures/notes/step4-plan.md`): the same roles and rules, on `RUN\brd-<slug>\`, with these PM requests in order: (1) grill-me, to-do step 3 (`C:\Users\negat\.claude\skills\grill-me\SKILL.md`, recommended answers, no new scope; decisions handed back to brd-unifier); (2) mockups, to-do step 4: every prototype in the Mockup coverage table reviewed and approved (playable Y; breakpoints mobile, tablet, and desktop; play-through pass; approved by the PM on the run date), recorded as a test-fixture confirmation, keeping the `MK-NN` IDs; (3) diagrams, to-do step 5; (4) chunk 15, then chunk 16, once the gate is open; never chunk 17. If the gate does not open, write nothing of 15-17 and report which condition stays shut. Reply items as in B1.

## Stage 2 as launched for LOYALTY (2026-10-05 about 06:10)

Backup first: `SP3/s6B/backup-L2/brd-loyalty-points/` (18 files). The B1-derived brief with these changes: the BRD state described (v1.2, 17 open to-do rows, OI-31, CF-38 corrected after the last run); two requests added before grill-me: (1) finish to-do step 1: accept OI-31, and for every open row or marker that needs a fact no file holds (owner, time, measure or target, legal or retention rule, language, brand color) the PM supplies a plausible value consistent with the BRD and says it is a test-fixture value (brand color: primary `#1F6FEB`), no new scope; (2) finish step 2, the consistency check (a new session, so the run limit starts again); mockups MK-01 to MK-03 approved on 2026-10-05 as a test-fixture confirmation, with `https://www.figma.com/proto/TEST-FIXTURE/loyalty-points-<MK-ID>` where a row has no Figma link; helper files only in `RUN/_tools-loyalty/`, deleted at the end; reply item added: the test-fixture values supplied, each with the row it closes.

## Stage 2 as launched for REFUNDS (2026-10-05 about 06:30)

Backup first: `SP3/s6B/backup-R2/brd-refunds-portal/` (18 files). Same as LOYALTY's stage 2 with: the BRD state (v1.2; TD-02, TD-13, TD-24, TD-14 open; 3 gap markers; the last session's final-run corrections not rechecked; the old 15 and 16 linked from 12 / Appendix as reference input in `RUN/source/`); a small retail chain's refunds portal for the test-fixture values; step 2 includes the recheck; mockups MK-01 to MK-05 (MK-04 and MK-05 have no mockup) with `https://www.figma.com/proto/TEST-FIXTURE/refunds-portal-<MK-ID>`; helper files in `RUN/_tools-refunds/`.

## PM policy update, sent to both running stage 2 agents (2026-10-05 about 21:15, the user's choice)

The checker and reviewer kept raising items that add behavior; with "accept every recommendation", each round added scope and reopened approved mockups (REFUNDS Run 16: OI-33 sign-in failure and forgotten password, OI-34 a receipt with nothing left to refund, both accepted, v1.7; MK-01 and MK-04, Figures 4 and 7 reopen). From now on: keep what is applied; a NEW item that adds behavior beyond the current scope is Rejected ("out of scope for this release (test-fixture policy)"), recorded only in chunk 13 and decision-log.md; pure clarifications and mechanical fixes are accepted; reopened mockups re-approved as test-fixture confirmations dated 2026-10-05; reopened diagrams redone; then the recheck, the gate, 15, then 16, never 17. Report adds the rejected items.

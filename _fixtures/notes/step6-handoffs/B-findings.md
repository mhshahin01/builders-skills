# Stage B findings (skill issues seen while upgrading the fixture BRDs)

For triage after the chain rerun (stage R). Source: the stage agents' reply item 6 and the main session's checks. Class: A wrong or contradictory, B ambiguous, C cosmetic, N not a skill issue (brief or fixture).

## LOYALTY stage 1 (migration and to-do steps 1-2; done 2026-10-05 about 05:55, about 7 hours)

Result: v1.0 to v1.2 (1.1 the migration with its review and consistency runs, 1.2 the step 1 decisions); a new persona (Loyalty Administrator, 06b) and UC-03 came from the reviewer's OI-10, accepted under "accept every Recommended Answer"; gate Shut (16 to-do rows need facts no file holds, plus OI-31; CF-38 corrected after the last allowed run). Write scope checked: the source unchanged, no skill file changed; helper and reviewer temp files written outside RUN were deleted (stage 2 brief now names a tools folder inside RUN).

| ID | Class | Where | Finding |
|---|---|---|---|
| BL1-1 | A | brd-unifier SKILL.md § 7.5 against § 8.3, § 8.4, `chunks/13-open-items-and-clarifications.md` REGISTER header, `decision-log.md`; also `chunks/brd-master.md` Review Output and chunk 13's fixed notes | What chunk 13 keeps for an accepted item: § 7.5 says chunk 13 holds the items; § 8.3, § 8.4, the REGISTER header, and the decision log say an accepted item keeps only its current status line; the master's and chunk 13's notes still say every item carries a Recommended Answer. The agent followed the status-line reading, so the full options text survives only in short form in the decision log. |
| BL1-2 | B | `delivery-chunks.md` § Step 2 | "Record it as Run 1" assumes a fresh BRD; a migrated to-do already has a Run 1 (the agent continued from Run 2). |
| BL1-3 | B | `delivery-chunks.md` § Step 2 against § Special cases | Items raised by the last allowed consistency run: § Step 2 says they wait for the next session; § Special cases says to walk the user through new items before applying anything. |
| BL1-4 | B | brd-unifier (no rule) | Not covered: who applies the reviewer's editorial notes; table renumbering (only figures have a never-renumber rule); who goes in "Updated By"; whether a migration counts as the first build for the reviewer (SKILL.md, "On an update"). |
| BL1-5 | B | the reviewer's Recommended Answers against the use-case template | OI-10's Recommended Answer (a new persona and use case) did not cover all nine use-case sub-sections or the persona journey; the agent filled the gaps with flagged proposals. |
| BL1-6 | B | `chunks/11-summary-and-uiux.md` fixed Responsive sentence | The fixed sentence widened the source's "phones and computers" to include tablets, with no decision. |
| BL1-7 | N | the stage 1 brief | "Use the skill's default" brand color: the skill has no default (principle 16), so TD-21 stays open; "step 1 needs no outside input" was wrong: 16 rows need facts. Stage 2 has the PM supply test-fixture values. |
| BL1-8 | N | the BRD key | The template has no field for the BRD key (the SDD assigns keys in its Source BRDs register), so "keep the key" had nothing to write. Expected. |

## REFUNDS stage 1 (migration and to-do steps 1-2; done 2026-10-05 about 06:20, about 7.5 hours)

Result: v1.0 to v1.2; 30 open items, all accepted (UC-06 customer sign-up and sign-in added by OI-05; UC-02 renamed "Track Refund Status", ID kept; card-only refunds; a Payout failed end status); step 2 Complete (6 runs, 35 findings); gate Shut (TD-02, TD-13, TD-24, TD-14 brand color open; 3 gap markers). Source chunks 15 and 16 not migrated: linked from 12 / Appendix as `../source/brd-refunds-portal/...` (save the `source/` folder with the run, or these links break). Helper scripts and a v1.1 snapshot went to `SP3/s6B/tools/` (my scratchpad, outside RUN). Write scope checked: the source unchanged, no skill file changed.

| ID | Class | Where | Finding |
|---|---|---|---|
| BR1-1 | B | SKILL.md step 7 "On an update" against `delivery-chunks.md` § Refresh triggers, Version and `transform-detection.md` § Transform | Does a migration get the reviewer pass? Step 7 says the reviewer runs only on the first build; the Version rule calls a migration "one update"; transform-detection says only pure conversions skip the reviewer. (Same question as BL1-4.) |
| BR1-2 | B | `sow-transformation.md` § existing-BRD, old version of this template; `delivery-chunks.md` § Special cases | Migration gaps: no rule for moving closed OIs from an older chunk 13 into the new schema (OI-01 kept without Type, Concern, Options, Why); no rule on whether old to-do evidence still counts; the 15/16 special case assumes a to-do with no gate block; "go to the Appendix" does not say copy or link. |
| BR1-3 | B | `delivery-chunks.md` § Step 2 | The three-run cap does not say what happens to corrections the third run finds. (Same family as BL1-3.) |
| BR1-4 | B | `decision-log.md` § Canonical structure; SKILL.md step 10 | An open remainder of an acceptance-loop decision has no route into the to-do; only business-review remainders do. |
| BR1-5 | C | `delivery-chunks.md` § Step 1 | Reviewer Notes: "asks for a decision" needs judgement for advice-style notes. |
| BR1-6 | B | brd-unifier (no rule) | "Resolved" is defined for a dependency, not for an assumption. |
| BR1-7 | B | `chunks/11-summary-and-uiux.md` | The Data Tables placeholder ("20 rows/page", CSV and Excel export): a skill default or an example? Treated as a proposal. Fixed Responsive sentence: same as BL1-6. |
| BR1-8 | B | the reviewer brief | OI-21's Why cites "the project owner's UI/UX standards": no project file holds them; the reviewer drew on its own global instructions. A reviewer should cite project files only (or say the source). |
| BR1-9 | C | mockup priority rule | P1 only on the Summarized Workflow turned MK-02 from P1 to P2. Observation. |
| BR1-10 | N | the brief | "The skill's default" brand color does not exist (as BL1-7); "then the PM asks" read as a second update (v1.2), which is right. |

## REFUNDS stage 2 (to-do steps 1-5; done 2026-10-05 about 16:30, about 10 hours)

Result: v1.2 to v1.6 (1.3 step 1 test-fixture values, 1.4 grill-me with 15 questions and OI-31, 1.5 mockup approval and links, 1.6 diagrams with OI-32); 9 consistency runs (Runs 7-15); G1, G2, G3, G5 met; G4 not met: a step 5 diagram finding (CF-47, UC-06 E1 and E2 had no path when the customer turns the offer down) changed UC-06 after MK-04 was approved, and the refresh rule reopened MK-04. No chunk 15-17 written. Write scope checked (sources unchanged, no skill file changed, tools folder deleted). Stage 2b launched about 16:45: MK-04 re-approved, the recheck, then 15 and 16 (backup `SP3/s6B/backup-R2b/`).

| ID | Class | Where | Finding |
|---|---|---|---|
| BR2-1 | D | `delivery-chunks.md` § Refresh triggers ("its mockup rows reopen step 4") with the to-do order (step 5 runs in parallel with step 4) | A use-case fix that the step 5 diagrams force reopens an already approved mockup, so approving mockups before the diagrams can never open the gate in one pass. Options: run step 5 before the final mockup approval (reorder or recommend it), or let a diagram-driven fix that leaves the screen unchanged keep the approval. For the user. |
| BR2-2 | B | `delivery-chunks.md` § Refresh triggers; § Step 4 | Is adding a Figma link to a use case's UI/UX section a content change (version bump, full consistency run)? Not listed either way; the agent bumped (unclear edits count as content). |
| BR2-3 | C | the step verification line "Steps 4 and 5 are Pending gate unless G1-G3 hold" | Conflicts with a step 4 already Complete when G2 reopens. |
| BR2-4 | B | `use-case-quality.md` § Flowchart against § The gated diagram step | The flowchart defect test (an element on one side only) found nothing in Figure 7, but the never-invent rule turned the missing decline path into an open item; the similar UC-03 case (the customer does not confirm a cancel) was never flagged. |
| BR2-5 | B | `delivery-chunks.md` § Chunk 15 task types | No task type fits an in-scope report used by one persona and no use case (the chunk 09 report). Ties to the LLD Workflow blocks (L2-6, C6). |
| BR2-6 | N | the brief; `grill-me/SKILL.md` | grill-me is a stub that calls the Skill tool with "grilling"; the agent read `grilling/SKILL.md` from disk. Name the grilling skill in later briefs. |
| BR2-7 | C | `delivery-chunks.md` § Step 2 ("its first run checks chunks 00-13 in full") | Every content-changing request opens with a full run (four in this stage): correct, but costly; most of the stage's 10 hours went to consistency runs. |

| BR2-8 | D | the delivery gate loop (`delivery-chunks.md` § Step 2 and § Refresh triggers) with an adversarial cleared-context checker | Each full consistency run after a content change found new business gaps (REFUNDS Runs 9, 13, 16); under "accept every recommendation" each one added scope and reopened approved mockups and diagrams, so the gate did not settle across three sessions. Real PMs reject or defer scope; a Deferred item keeps the gate shut, a Rejected one closes it. Worth deciding whether the checker should separate "gap in stated behavior" from "possible new behavior" (the latter going to the wishlist or an open question, not a must-fix). For the user, with BR2-1. |

## REFUNDS stage 2b and LOYALTY stage 2 (both done 2026-10-06 about 02:50)

REFUNDS: v1.6 to v1.7 (OI-33 and OI-34 accepted before the policy; OI-35 rejected under it); Runs 16-18; MK-01 and MK-04 re-approved, Figures 4 and 7 redrawn; gate Open; 15 (5 tasks, 4 waves) and 16 (76 cases) written. LOYALTY: v1.2 to v1.7 (16 test-fixture values plus TD-40; grill-me 12 questions, 13 changes; OI-31 to OI-37 accepted; none rejected); Runs 8-18; gate Open; 15 (10 tasks, 3 waves) and 16 (78 cases). Both write scopes checked against their backups; snapshot `SP3/s6B/final-B/` (both BRDs and `source/`).

| ID | Class | Where | Finding |
|---|---|---|---|
| BR3-1 | B | `delivery-chunks.md` § Refresh triggers against § Step 2, the chunk 14 status rules, and § Verification | When steps 4 and 5 return to Complete and a rerun is due: does step 2 reopen (Refresh triggers) though Complete depends only on run dates and dispositions, status updates "do not reopen step 2", and Verification wants 4 and 5 shown Pending gate unless G1-G3 hold? |
| BR3-2 | C | `delivery-chunks.md` G2 | Its title says no finding still waiting; its check column says none waiting on a decision. |
| BR3-3 | B | `delivery-chunks.md` § Chunk 15 Deriving tasks; § Verification against § Chunk 16 | A report no use case covers: no task type (both agents typed it Cross-cutting), and "every test case traces to a use case or NFR" against reports listed as business acceptance (both gave it its own section citing chunk 09). Merges with BR2-5. |
| BR3-4 | B | `mermaid-diagrams.md` § Block conventions against § The gated diagram step and `use-case-quality.md` § Use-case flowcharts | About 30 lines and split large journeys, against one flowchart per use case with only step compression allowed (REFUNDS Figure 7 is 58 lines, kept whole). |
| BR3-5 | B | `delivery-chunks.md` § Special cases | Old chunks 15 and 16 are input, not chunks: keep their TASK and TC IDs? The agent kept them, so IDs run out of execution order. |
| BR3-6 | B | `delivery-chunks.md` G4 | "Figma links in the use cases' UI/UX sections" cannot hold for a report screen with no use case (REFUNDS MK-05, LOYALTY MK-04); both agents kept the link in chunk 14 only. |
| BR3-7 | C | `delivery-chunks.md` § Refresh triggers, Version | Which date a Changes Log row carries when an update crosses midnight. |
| BL2-1 | B | `delivery-chunks.md` § Special cases, Decisions with no open item | Does a grill-me confirmation that changes nothing need a TD row? (None given; recorded in the decision log.) |
| BL2-2 | B | `delivery-chunks.md` § Step 2 | "Dated after the last content change" fails when every run and change share one date; the agent used run order. |
| BL2-3 | C | `delivery-chunks.md` § The delivery gate, Re-lock | No state for an unrequested chunk 17 while the gate is open (stays Locked). |
| BL2-4 | B | `delivery-chunks.md` § Chunk 16 | "Numeric rules" is undefined (the agent listed the 10 it counted). |
| BL2-5 | B | `delivery-chunks.md` § Chunk 15, Dependencies | Data only some test cases need: Needs entries or start conditions? And "Confirmed" against "in place" for chunk 02 dependencies is undefined. |
| BL2-6 | N | run hygiene | LOYALTY's agent wrote drafts of 15 and 16 in its tools folder while the gate was shut (the skill forbids drafts in a file), re-verified them after the gate opened, and deleted the folder; a checker made and deleted a script outside RUN. Stricter wording for later briefs: no draft files of gated chunks, anywhere. |
| BR3-8 | N | the PM policy | A rejected item got no TD row because the policy said chunk 13 and the decision log only, against § Step 2 Dispositions. |

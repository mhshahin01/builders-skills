# Step 7 proof run: S3, pre-BRD to BRD (2026-10-07)

Run by a background Claude Code agent: brd-unifier `chunks whole` on a copy of the saved pre-BRD "Clinic Reminders" (approved as is at its step 7), into `rerun-2026-10-07-s7/brd-clinic-reminders/`, with the fixed answers of the step 6 close-out. The agent returned its report as text (the harness blocks report files for sub-agents); the orchestrating session saved this condensed version and spot-checked as noted.

## Outcome

- 19 files: chunks 00-14 (06a, 06b, 06c, one per persona), the master and `decision-log.md`; 3 personas, 17 use cases, 4 Mermaid figures. Chunks 15-17 not written: the delivery gate is shut.
- Review (cleared-context sub-agent): 24 open items; 18 accepted and applied, 6 rejected under the fixture policy ("out of scope for this release (test-fixture policy)"); 4 scope proposals not adopted.
- Consistency check: three runs by read-only sub-agents found 18, 9 and 7 items. Runs 1 and 2: 20 corrected; 8 became OI-25 to OI-32, accepted and applied. Run 3 (third run): its 7 findings decided and recorded as `Decided - pending application` (TD-86 to TD-92; OI-33), not applied, per the third-run rule. The BRD was hashed before and after each run: no file changed during a run.
- Markers in chunks 00-12: 46 gap questions and 61 proposals (130 occurrences), above the 15-gap line.
- Intake: no question needed (name, source and personas from the pre-BRD). Key colour asked once: none named; left as a marker (TD-76).

## Checks against the step 7 items (orchestrating session)

- H1: chunk 02 Assumptions / Constraints carries pre-BRD 08 Political (4) as two numbered constraints, one per obligation: 3 "Licensed SMS sending" and 4 "Licensed hosting in Egypt" (if patient data is hosted in Egypt, the host must hold an NTRA licence), each citing Law 10/2003 and pre-BRD 08 Political (4). The Glossary has NTRA and SMS aggregator rows.
- H2: 92 TD rows. Kind: 71 Open question, 15 Pending decision, 6 Assumption to validate (all three template values). Every Source cell names the chunk and an exact place (0 cells without ` / ` or an anchor). Blocks: specific in every Open and Decided row; the 8 rows reading `-` are the 8 Resolved rows (TD-78 to TD-85). Status: 77 Open, 7 Decided - pending application, 8 Resolved. The run's build script checked that each of the 130 markers in chunks 00-12 sits in the Source of exactly one row; Run 3's C10 check ran the chunk 14 verification list.

## Checkers

`_linkcheck.py` 479 links, 0 bad, 19 files; `check_versions.py` 0 problems, 0 notes (initial build; 15-17 Locked in chunk 14 and the master); `check_mermaid.py` 4 blocks, 0 issues; 114 links into the pre-BRD (14 BRD files to 20 pre-BRD files), all resolve. No CR byte, em dash or en dash in the output.

## Offers declined

Switch mode or merge (step 9 handoff); Miro mirroring (14 step 5); `/grill-me` (14 step 3, a different request); the Mermaid CLI (not used: no renderer).

## Unclear or contradictory skill text reported by the run (next-round input)

1. sow-transformation.md:184: "Marker at every BRD home that took content from a chunk its Where names": the whole chunk or only the named part, and must the item concern that content? Also against :173 and :183 ("a citation, not a copy").
2. sow-transformation.md:184: "A validated assumption becomes a 02 assumption", but the pre-BRD log has no "validated" mark.
3. parts-mode.md:77 against sow-transformation.md:177: every Business Objective served by a use case, against each OKR key result becoming a Business Objective (company key results such as budget, CAC and the data room have no use case).
4. SKILL.md:99 and chunks/11:23 against SKILL.md:122: the key colour is "asked once", but not when, and it is not an intake question.
5. SKILL.md:29 against :208: may the author use the user's global CLAUDE.md defaults? (used only as labelled proposals in chunk 11).
6. delivery-chunks.md:127 against chunks/00:13: the register Owner is "the BRD author", who here is a marker.
7. delivery-chunks.md:165 against :483: third-run corrections are not applied, yet the chunk 14 verification block says "fix what is mechanical".
8. delivery-chunks.md:186-189: no disposition value fits a third-run correction decided but not applied (used "Decided - pending application: TD-NN").
9. chunks/13:12 against SKILL.md:220: LATER ITEMS does not list a Reviewer Note as a source of new items.
10. SKILL.md:245 and :248: no rule for an accepted answer that depends on a rejected one.
11. SKILL.md:298 and sow-transformation.md:215: "count by question" breaks when the same marker text is a different question in different places.
12. delivery-chunks.md:141 against :148: does a pending dependency that already has a marker need its own row?

## Process notes

- Scratch scripts and records are in `tools/` (16 files). The skills repository was unchanged (read-only git status; confirmed by the orchestrating session's skill-state hash).
- The acceptance loop and the consistency-check decisions were simulated in chat under the fixed answers; the 20 corrections of Runs 1 and 2 were mechanical or confirmed under "accept every recommendation".

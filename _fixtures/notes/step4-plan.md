# Step 4 plan and run briefs (handover, 2026-10-01)

Status 2026-10-01 12:40: every stage is done (B1, A1, A2a, A1b, A2b, V1, C1, checks, save). Results: UNIFIER-ENHANCEMENTS.md step 4 and step4-findings.md.

SP = C:\Users\negat\AppData\Local\Temp\claude\C--Users-negat--claude-skills\20a4b117-b71b-46de-b96b-9805a1f20b7e\scratchpad
RUN = SP\s4 (a copy of _fixtures/chain/run-2026-09-30: brd-refunds-portal, brd-loyalty-points, sdd-refunds-platform, lld-refunds-platform)
Branch: test/e2e-gate-and-loyalty-uat (from main 2855377). Nothing committed on it yet.

Decisions the user made for step 4:
- E3 markers: an agent proposes one answer per marker (options, Recommended Answer, Why); accept the recommendations (same accept-all rule as the other runs); apply them through sdd-unifier's "apply any decisions the user gives" path (SKILL.md step 10 row "generate the e2e design ... or deferred items decided later" -> step 8b); list every answer in the step 4 report and the decision log.
- LOYALTY delivery gate: simulate the PM (non-interactive grill-me with recommended answers, mockups LP-01 and LP-02 approved with evidence labelled as a test-fixture confirmation, diagrams drawn, then chunks 15 and 16 in the current format; mockup IDs unchanged; the MK-NN upgrade stays a step 6 decision).

E3 baseline: 25 [NEEDS CLARIFICATION] markers in SDD 10 (1), 12 (1), 13a (6), 13b (5), 13c (4), 13d (8); 09, 11, and 03 §7.3 have none. E1, E2, E4 met. [TBD - EXTERNAL] markers do not block (SKILL.md step 8b E3).

## Stages

| Stage | What | Status at handover | Output to check |
|---|---|---|---|
| B1 | brd-unifier on RUN\brd-loyalty-points: grill-me, mockups, diagrams, gate, chunks 15 and 16 | launched 05:27, running | RUN\brd-loyalty-points\15-implementation.md and 16-uat-bat-test-cases.md exist; 14-todo.md gate Open; master Delivery Chunks rows |
| A1 | read-only architect agent: proposals for the 25 markers | launched 05:27, running | RUN\sdd-marker-decisions.md with CL-01..CL-25 and a count table |
| A2 | sdd-unifier: (if LOYALTY's version moved) "BRD LOYALTY has a new version", then apply the decisions file, then step 8b and chunk 19 | after B1 and A1 | chunk 19 written, gate line "Open - Up to date"; Child LLDs row marked out of date |
| V1 | read-only verifier: chunk 19 against 09-13x (plus a scratchpad script) | after A2 | mismatches with file:line |
| C1 | lld-unifier "refresh the trace" (step 3c will also offer the SDD refresh: accept) | after A2 | LOYALTY UAT/BAT fields, 13 §16.8 tags, 16 §19.9 and §19.1, Child LLDs row |
| Checks | every checker on RUN; diff_runs vs run-2026-09-30; save RUN to _fixtures/chain/run-2026-10-01-e2e/; update _fixtures/README.md | last | |

If B1 or A1 is missing or incomplete when you resume (the session that launched them was cleared), rerun it with its brief below on a fresh copy of the affected folder. If A2 reports new markers (for example from the LOYALTY update), run A1 again for those only, then A2 again.

check_trace.py may assume LOYALTY test cases are Pending; once LOYALTY chunk 16 exists, check it (grep LOYALTY in check_trace.py) and extend it, testing on the baseline and on a planted error.

## Brief B1 (as launched)

You are producing a TEST FIXTURE by following the brd-unifier skill exactly on an existing BRD: clear its delivery gate and write its chunks 15 and 16. Work fully non-interactively. You play two roles: the skill, and the product manager (PM) who answers it. Wherever the skill would ask the user, the PM answers as stated below, or else with the skill's recommended or default answer.

Skill to follow: read `C:\Users\negat\.claude\skills\brd-unifier\SKILL.md` and every file it references in that same folder (all top-level .md files and every file in `chunks/`). Read them from disk; do NOT use the Skill tool. Do not modify any file under `C:\Users\negat\.claude\skills\`. Do not read anything under `C:\Users\negat\.claude\skills\_fixtures\` or any other `%TEMP%` scratchpad folder outside RUN.

Run folder: RUN = (as above). The BRD is `RUN\brd-loyalty-points\` ("Loyalty Points", master `loyalty-points-brd-master.md`, chunks 00 to 14). Its to-do (`14-todo.md`) shows steps 1-2 Complete, step 3 Not started, steps 4-5 Pending gate, and chunks 15-17 Locked. Write only inside `RUN\brd-loyalty-points\`. The other folders in RUN (another BRD, an SDD, an LLD) are not part of this task: do not modify them.

The PM's requests, in this order. Each is a user message to the skill; handle each the way the skill says:
1. Grill-me (to-do step 3). Run the grill-me session the to-do describes. The grill-me skill is `C:\Users\negat\.claude\skills\grill-me\SKILL.md` (read it, and any file it references, from disk). Play it non-interactively: the interviewer asks as that skill says, and the PM answers every question with the interviewer's recommended answer or, where none is given, with the answer most consistent with the BRD as written, adding no new scope. Then hand the decisions back to brd-unifier ("decisions handed back from a grill-me session") and let the skill apply them.
2. Mockups (to-do step 4). The PM reports that the two prototypes in the Mockup coverage table (LP-01 and LP-02, at the Figma links listed there) were reviewed and approved: playable Y, breakpoints mobile, tablet, and desktop delivered, play-through pass, approved by the PM on 2026-10-01. Record this as the evidence the skill requires, and say in the evidence that it is a test-fixture confirmation. Keep the mockup IDs as they are.
3. Diagrams (to-do step 5). Ask the skill to add the use-case diagrams and the flowcharts.
4. Delivery chunks. Ask for the implementation plan (chunk 15), then the UAT/BAT test cases (chunk 16), as the skill allows once the gate is open. Do not write chunk 17.

Other fixed answers: accept every recommendation and every Recommended Answer; no Miro boards. If the gate does not open, write nothing of chunks 15-17 and report exactly which condition stays shut and why.

Efficiency rules: do NOT install, download, or run any Mermaid renderer or other external tool; check Mermaid by reading it. Write each file as soon as it is ready. Keep content compact (this is a test fixture), but do not skip any section, column, or step the skill requires. If you cannot spawn a subagent for a step that asks for one, run that step yourself as a separate pass, re-reading the files from disk.

When done, reply with: (1) for each of the four requests, what the skill did; (2) the grill-me questions and the PM's answers, and what changed in the BRD because of them; (3) the to-do steps and the gate conditions (G1-G5) before and after; (4) every file changed or written, each with a one-line reason; the BRD version before and after; the Changes Log rows added; (5) a summary of chunks 15 and 16: tasks, test cases, and how they trace to the use cases and NFRs; (6) any rule of the skill you could not follow, and any skill instruction you found ambiguous or contradictory (file and section).

## Brief A1 (as launched)

You are a solution architect advising the owner of a Solution Design Document (SDD). This is a read-only analysis task: propose an answer for every open clarification marker that keeps the SDD's end-to-end gate shut. You write one new file and modify nothing else.

Inputs (read-only): the SDD `RUN\sdd-refunds-platform\` (read all of it, including `decision-log.md` and chunk 18); its source BRDs, for context, `C:\Users\negat\.claude\skills\_fixtures\chain\run-2026-09-30\brd-refunds-portal\` (REFUNDS) and `...\brd-loyalty-points\` (LOYALTY); `C:\Users\negat\.claude\CLAUDE.md`; `C:\Users\negat\.claude\skills\sdd-unifier\SKILL.md` step 8b (E3) and the templates in `sdd-unifier\chunks\`.

Scope: every `[NEEDS CLARIFICATION: ...]` marker in chunks 09, 10, 11, 12, 13a to 13d, and §7.3 of chunk 03 (25 expected; report the exact count per chunk). `[TBD - EXTERNAL: ...]` markers and markers in other chunks are out of scope.

For each marker: ID (CL-01.. in file order); Where (file, section, marker text verbatim); Question; Options (at least two, each with its tradeoff); Recommended Answer (concrete design text ready to apply, replacing the marker); Why (evidence: SDD section, keyed BRD ID, decision-log entry, or CLAUDE.md rule, and the tradeoff accepted).

Rules: never state a fact about an external provider's API, a law, or a regulator as known; where a marker depends on one, recommend a design decision that does not (a configurable value with a default and a named owner who confirms it) and say so. Stay consistent with chunks 10, 11, 12, §7.3, and decision-log.md; reuse names; add an event, API, or token only when needed and name the registry row it adds. Keep dependent answers consistent and cross-referenced. Never add business behaviour a BRD does not state.

Write `RUN\sdd-marker-decisions.md`, starting with a count table by chunk. Modify nothing else; no external tools. Reply with the count by chunk and the list of IDs, each with a one-line summary and whether it adds a registry row.

## Brief A2 (draft)

Update 2026-10-01 08:45: LOYALTY ended at v1.2 (B1 kept editing until about 08:40), so A2 is split. A2a sends request 1 only ("BRD LOYALTY has a new version"). A1b then re-proposes the markers that A2a changed or added (at least CL-18 to CL-25 in 13d) with the A1 brief, scoped to those markers and LOYALTY v1.2. A2b sends request 2 with the updated decisions file. Status: UNIFIER-ENHANCEMENTS.md.

TEST: follow sdd-unifier exactly (read SKILL.md and every referenced file from disk; no Skill tool; do not modify the skills folder; do not read _fixtures or other scratchpads). Non-interactive: where the skill would ask, accept its recommendation. RUN holds brd-refunds-portal (REFUNDS 1.0), brd-loyalty-points (LOYALTY; read its version in chunk 00), sdd-refunds-platform (master refunds-platform-sdd-master.md), lld-refunds-platform (a registered child LLD). The user's requests, in order:
1. Only if LOYALTY's version is newer than the SDD's Source BRDs row: "BRD LOYALTY has a new version."
2. "Here are my decisions on the open clarifications: RUN\sdd-marker-decisions.md. Take each Recommended Answer as my decision; for CL-18, CL-20, CL-21, and CL-23 use the adjusted answer in its section 'LOYALTY v1.1 draft found during this run' where the LOYALTY BRD now says so. Apply them, then generate the e2e design (chunk 19)." (If LOYALTY changed again after 06:14 on 2026-10-01, or the version update adds markers, rerun A1 for the affected markers before this request.)
Fixed answers: accept every recommendation; if a request raises new open items, accept every Recommended Answer; no Miro. Write only inside RUN\sdd-refunds-platform\; never write into the LLD or the BRDs. Efficiency rules as usual (no renderer; write files as ready; reviewer pass yourself if no subagent).
Reply with: E1-E4 before and after (with what was open); where each CL-NN was applied; every file changed with a reason; SDD version before and after and the Changes Log rows; chunk 19's Counts at a Glance and Faithfulness section; the Source BRDs and Child LLDs tables after; rules not followed; ambiguous or contradictory instructions (file and section).

## Brief A1b (draft, after A2a)

You are a solution architect advising the owner of a Solution Design Document (SDD). This is a read-only analysis task: the SDD has just taken a new version of one of its source BRDs, so re-check the proposed answers to the open clarification markers that keep its end-to-end gate shut. You modify exactly one file, RUN\sdd-marker-decisions.md, by appending one section; you delete or rewrite nothing already in it.

Inputs (read-only): the SDD RUN\sdd-refunds-platform\ (all of it, including decision-log.md, chunk 18, and the Changes Log row of the LOYALTY update); its source BRDs RUN\brd-refunds-portal\ (REFUNDS) and RUN\brd-loyalty-points\ (LOYALTY, now v1.2: read all of it, including its decision-log.md and chunks 14 to 16); C:\Users\negat\.claude\CLAUDE.md; sdd-unifier SKILL.md step 8b (E3) and the templates in sdd-unifier\chunks\ (read from disk; no Skill tool; do not read _fixtures or other scratchpads); and RUN\sdd-marker-decisions.md (CL-01 to CL-25, proposed against LOYALTY v1.0, plus the section "LOYALTY v1.1 draft found during this run").

Scope: every `[NEEDS CLARIFICATION: ...]` marker now in chunks 09, 10, 11, 12, 13a to 13d, and §7.3 of chunk 03. Map each one to its CL-NN (same place and question) or mark it new. Then:
- kept: the marker is unchanged and its Recommended Answer still fits the updated SDD and LOYALTY v1.2;
- changed: the marker changed, or its answer no longer fits (say what changed); write a full replacement entry with the same CL-NN;
- new: write a full entry, numbered from CL-26;
- retired: a CL-NN whose marker is gone (say what removed it).
Entry fields as in the file: Where (file, section, marker text verbatim), Question, Options (at least two, each with its tradeoff), Recommended Answer (concrete design text ready to apply, replacing the marker), Why (evidence: SDD section, keyed BRD ID, decision-log entry, or CLAUDE.md rule, and the tradeoff accepted), Linked, Registry impact.

Rules: never state a fact about an external provider's API, a law, or a regulator as known; where a marker depends on one, recommend a design decision that does not (a configurable value with a default and a named owner who confirms it) and say so. Stay consistent with chunks 10, 11, 12, §7.3, and decision-log.md; reuse names; add an event, API, or token only when needed and name the registry row it adds. Keep dependent answers consistent and cross-referenced. Never add business behaviour a BRD does not state.

Append the section "## Update after LOYALTY v1.2 (SDD v<version>)" with: a count table by chunk of the markers now present; a mapping table (file, section, CL-NN, kept, changed, new, or retired); the full changed and new entries; and an "Apply list" naming, for every marker now present, the one entry whose Recommended Answer applies, so that a later run can take each one as the user's decision without judgement. Reply with the count by chunk, the apply list (CL-NN, one-line summary, status), the retired IDs, and any registry rows added.

A2b request after A1b: "Here are my decisions on the open clarifications: RUN\sdd-marker-decisions.md. Take each Recommended Answer named in the Apply list of its section 'Update after LOYALTY v1.2' as my decision. Apply them, then generate the e2e design (chunk 19)." Rest of the A2 brief as above (fixed answers, write scope, efficiency, reply items).

## Brief V1 (draft, read-only)

Check RUN\sdd-refunds-platform\19-e2e-system-design.md against chunks 09-13x as a faithful consolidation (template: sdd-unifier\chunks\19-e2e-system-design.md FAITHFULNESS_RULE and NO_DUPLICATION_RULE): every §13 row in §24.1 with its Type; every §14.4 topic; every §14.5 event with its producer and consumer list and every §14.10 event with its publisher and listeners in §24.5 (in-process edges labelled `in-process:`); every §15.2 internal contract in §24.7 with caller, callee, and type (HTTP or in-process); external systems at system-context level; §24.8 sagas consistent with §8.5 and the 13x flows, each with a keyed Use cases line traced to §7.3; Counts at a Glance correct; normative content (§14.2.1, §14.4, §14.6, §14.7) referenced, not restated; links and anchors resolve. Report each mismatch with file and line. Modify nothing.

## Brief C1 (draft)

TEST: follow lld-unifier exactly (from disk; no Skill tool; no _fixtures or other scratchpads). Non-interactive. Request: "lld-unifier chunks: refresh the trace" for the LLD in RUN\lld-refunds-platform\ (from-sdd), whose SDD is RUN\sdd-refunds-platform\ and whose BRDs it reaches through the SDD (LOYALTY now has chunk 16). Fixed answers: direction from-sdd; if step 3c offers a targeted refresh for a newer SDD, accept it; any other question: the skill's recommended or default answer. Write only inside the LLD folder plus this LLD's own Child LLDs row. Where the skill says to show the user something before asking, put that text in the reply as shown. Reply with: what step 3c found and the offer as shown; every LLD file changed with a reason; the LLD version before and after and the Changes Log rows; the Child LLDs row before and after; the trace summary per BRD (LOYALTY test cases now cited); rules not followed; ambiguous instructions.

## Checks after C1

$env:PYTHONIOENCODING='utf-8'; $C='_fixtures/checkers'; $R=RUN; run check_links, _linkcheck, check_lld_trace, check_trace, check_sdd, check_uc_links, check_uc_keys, check_mermaid (SDD and LLD), list_flags, check_refs lld-unifier sdd-unifier, diff_runs _fixtures/chain/run-2026-09-30 RUN --levels 2. Also: E3 recount (0 markers in 09-13x and §7.3), em dash count 0, the chunk 19 verifier, and LOYALTY chunk 16 IDs against the LLD 04 lines and 13 §16.8 tags.

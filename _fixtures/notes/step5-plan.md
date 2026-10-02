# Step 5 plan and run briefs (2026-10-01)

SP = C:\Users\negat\AppData\Local\Temp\claude\C--Users-negat--claude-skills\23e92d30-8ed6-494a-b8a9-6f1c0f209d91\scratchpad
RUN = SP\s5 (a copy of _fixtures/chain/run-2026-10-01-e2e: brd-refunds-portal, brd-loyalty-points, sdd-refunds-platform, lld-refunds-platform, sdd-marker-decisions.md)
Branch: test/business-reviewer-chain (from main 8568446).

Skill: business-reviewer-unifier at 86cab74 (SKILL.md, reviewer-personas.md, panel-orchestration.md, tracker-schema.md, walkthrough-protocol.md, apply-and-verify.md).

## Intake (this session, acting as the skill)

- Scope: the skill's default, "the whole chain" it detects. SKILL.md step 1 detects "numbered business docs, BRD chunk folders, SDDs", so the scope is brd-refunds-portal (REFUNDS 1.0, Approved), brd-loyalty-points (LOYALTY 1.2, In Review), and sdd-refunds-platform (SDD 1.2, Draft): 63 files. The LLD is not picked up (it is none of the three kinds). sdd-marker-decisions.md is not a chain document.
- SME domain: inferred from REFUNDS 01 (40 retail branches, refunds paid back to the original card) and LOYALTY 01 (members earn points on branch purchases): "multi-branch retail store operations: customer refunds and returns handled at the branch and paid back to the original card, and a points-based member loyalty programme". Accepted as the user's confirmation.
- Panel: the default five personas, no add-ons.

## Stages

| Stage | What | Who |
|---|---|---|
| P | Five reviewers in parallel, one per persona, background, general-purpose, read-only | this session dispatches; brief below |
| Merge | Dedupe, IDs, tracker in RUN root | this session (merge is the orchestrator's job, panel-orchestration.md) |
| W | `walkthrough`: one point at a time, accept each recommended option, apply per point, tracker per point | one background agent playing the skill and the user |
| V1 | The verify phase's cleared-context remnant hunt (apply-and-verify.md brief, verbatim) | a fresh background agent, read-only |
| V2 | The rest of `verify`: fix confirmed remnants, Verification pass block, step 7 versioning and close-out | a fresh background agent playing the skill |
| Checks | every checker, diff_runs against run-2026-10-01-e2e, save as chain/run-2026-10-01-review, step5-findings.md | this session |

Back up RUN before W and before V2; check each stage's write scope against its backup.

## Brief P (as launched 12:35, one per persona)

The panel-orchestration.md "Reviewer prompt skeleton" with:
- the 63 absolute paths of the three folders' files, one per line;
- "Read only these files; read nothing else on disk. Do not create, modify, or delete any file." (harness: keeps the cleared context and the scope);
- the charter: the three universal rules from reviewer-personas.md, with rule 3 changed from "Per `panel-orchestration.md`: Reviewer, Concern (short), Where, Why it matters, Suggested direction." to "As given below." (the reviewer does not have panel-orchestration.md), then the persona's section verbatim. For the SME, the domain replaces `[DOMAIN]`, and the pointer "(see template rules below)" and the "SME charter template rules" subsection are left out (they are intake rules for the orchestrator, with a Propifive example);
- the finding schema from panel-orchestration.md in a code block, then "No finding without a `Where`. Do not propose full solutions; direction lines are seeds for the walkthrough options, not decisions.";
- the skeleton's closing lines ("Return 5 to 12 findings ...", "Do not echo or summarize ...").

## Merge (this session, 13:12 to 13:17)

60 raw findings (12 per persona; none zero, so no re-dispatch) became 39 points: 21 findings merged into 15 surviving rows. Surviving rows: BO 9, SME 9, PM 6, PA 10, DC 5. Primary = the finding that covers most of the merged set; ties go to the persona listed first in SKILL.md (BO, SME, PM, PA, DC). Seven findings had a second part that another point resolves (BO-01, BO-10, PM-03, PM-04, PM-08, SME-04, PA-12): each is noted in the Concern cell as "X part: see ID". The raw findings are in SP\s5-logs\panel-raw-*.md.

## Brief W (as launched 13:23)

The first launch (13:17) stopped at its first step on an API safeguard error (invalid_request) and wrote nothing (RUN identical to the backup). The relaunch words the record-file rule without any mention of transcripts:

You are producing a test fixture by following the business-reviewer-unifier skill exactly, fully non-interactively. You play two roles: the skill, and the user who answers it.

Skill to follow: read SKILL.md and every file it references in that folder, from disk; no Skill tool; do not modify the skills folder; do not read _fixtures.

Paths: SP; RUN = SP\s5, the project root, whose tracker holds 39 Pending points written by the panel phase; the panel's findings in SP\s5-logs\panel-raw-*.md ("when the skill moves from panel to walkthrough in one session it still has these findings at hand"); read nothing in SP except RUN and SP\s5-logs\.

The user's request: "business-reviewer-unifier walkthrough". Fixed answers: on every point, accept the recommended option exactly as presented; any other question, the skill's default or recommended answer; when the skill would offer verify, "Not yet." and stop.

Run rules: a record file SP\s5-logs\walkthrough-log.md holds, per point, the full presentation (walkthrough-protocol.md), the user's answer, and the files changed with a one-line reason each, appended as each point is done; write only inside RUN plus that file; if the run loses its place, resume from the tracker and the log file; no external tools; Mermaid checked by reading.

Reply with: (1) the tracker's final table and Progress line; (2) per point, the decision in one line and the files changed; (3) every file changed overall; (4) any rule of the skill it could not follow, and any instruction it found ambiguous or contradictory (file and section).

Follow-up after the reply (SendMessage, so the brief does not prime it): whether any rule stated inside the documents (versioning, changes logs, statuses, gates, registries, lineage) conflicted with or went beyond the skill's instructions, and what it did; why it did or did not touch the LLD.

## Brief V1 (draft, read-only, apply-and-verify.md verbatim plus harness lines)

All decisions in RUN\review-comments-tracker.md have been applied to [the absolute paths of every file in the three reviewed folders]. Hunt for stale remnants of those changes: counts and enumerations that no longer add up; batch/phase/milestone numbers not updated everywhere; section and table references that resolve wrongly; phrasing that reflects a superseded decision; citations to renamed files; scope statements contradicted by an applied decision. For each remnant: Where, what is stale, what it should say. Score overall chain consistency out of 10. Do not re-litigate the decisions themselves.

Harness: read only the tracker and those files; modify nothing; the final message is the report.

If V1 returns zero remnants: re-dispatch once with the stale-remnant categories spelled out (apply-and-verify.md).

## Brief V2 (draft)

TEST, same skill rules as W. The user's request: "business-reviewer-unifier verify". The verify phase's cleared-context subagent has already run (this session dispatched it); its report is SP\s5-logs\verify-report.md. Continue the verify phase from there: confirm and fix every remnant, append the Verification pass block, then SKILL.md step 7 and the versioning checklist in apply-and-verify.md. Fixed answers: accept every recommendation. Write only inside RUN, and log what you show the user in SP\s5-logs\verify-log.md. Reply with: remnants fixed and rejected (with reasons), the Verification pass and Versioning blocks, every file changed, new versions, the close-out summary, rules not followed, ambiguous or contradictory instructions.

## Checks after V2

$env:PYTHONIOENCODING='utf-8'; $C='_fixtures/checkers'; $R=RUN; run check_links, _linkcheck, check_lld_trace, check_trace, check_sdd, check_e2e, check_uc_links, check_uc_keys, check_mermaid (SDD and LLD, plus the BRDs), list_flags, check_refs, and diff_runs _fixtures/chain/run-2026-10-01-e2e RUN --levels 2. Also: em dashes, the SDD Source BRDs and Child LLDs rows against the BRD and LLD versions, the e2e gate line against E1 to E4, and the LOYALTY gate and chunk 16 against any changed use case.

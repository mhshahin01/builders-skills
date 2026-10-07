# Step 7: Band role files audit (2026-10-07)

A read-only audit compared the six Band files in `C:\Users\negat\Downloads\` with the step 7 working tree. Claude Code checked each finding against the cited skill lines, then applied all 25: 20 lines changed in five files. The review-lead file needed no change. Before and after: LF endings, no em or en dash, and the Room rules block byte-identical in the five agent files (SHA-256 prefix `4d75258455a4b9d8`). The pre-edit copies are kept in the session scratchpad only.

| ID | File | Severity | Fix |
|---|---|---|---|
| SA-1 | solution architect | High | The faithfulness exception: a source problem no chunk 19 claim depends on, in text the request did not change, is neither fixed nor raised; it is recorded in chunk 18 Reviewer Notes for its owner and bumps nothing (W2 A). |
| TM-1 | team guidelines | High | "refresh the trace" also settles the chunk 18 items and flags the change answers, then runs a delta review. |
| TM-2 | team guidelines | High | An SDD update that only applies pending decisions runs an application check, not a delta review; each pass is a fresh dispatch (decision 1 B). |
| SA-2 | solution architect | Medium | Chunk 19 behind a `Stale` mark is kept when no claim it asserts changed, after a faithfulness check (decision 5 A, W11). Claude Code added: a mismatch is fixed as on a write. |
| SA-4 | solution architect | Medium | The handoff names the faithfulness check of a chunk 19 kept behind `Stale`, and each source problem recorded for its owner. |
| TL-1 | tech lead | Medium | Answers given before the handoff: applied in the same update, one fresh application check, at most two passes; what the check raises waits (16 B, D2 B, L2 A). |
| TL-2 | tech lead | Medium | How far a new SDD version reaches (L1 B), flag removal, Specs re-synthesis, the application check. |
| TL-3 | tech lead | Medium | The trace refresh also settles chunk 18 items and flags, with one bump and a delta review. |
| TL-4 | tech lead | Medium | The handoff reports the applied answers, the check's result, and the items it raised. |
| TM-3 | team guidelines | Medium | A chunk 19 kept behind `Stale` also gets a faithfulness check. |
| TM-4 | team guidelines | Medium | The LLD application check and its two-pass cap. |
| TM-5 | team guidelines | Medium | The key colour is asked once, with the first batch of open items (B4 A). |
| BA-1 | business analyst | Medium | The same key colour timing; chunk 11 holds a marker until the answer comes. |
| SA-3 | solution architect | Low | Faithfulness fixes are confirmed, with no full rerun of the check. |
| SA-5 | solution architect | Low | The marker-walk check is a fresh dispatch, within three passes. |
| SA-6 | solution architect | Low | The carry rule for text an applied decision makes wrong (decision 9 B). |
| SA-7 | solution architect | Low | A pending-only targeted update gets an application check. |
| TL-5 | tech lead | Low | A targeted update ends with the application check when answers were applied. |
| TL-6 | tech lead | Low | On an existing LLD, the direction default is the recorded mode (L7). |
| TM-6 | team guidelines | Low | What the third run, or a check after it, finds waits for the next request (B7). |
| BA-2 | business analyst | Low | A mechanical correction found by or after the third run is also `Decided - pending application` (B8). |
| BA-3 | business analyst | Low | Chunks 15-17 go `Stale` only when their source meaning changed (a step 6 wording). |
| BA-4 | business analyst | Low | Global defaults are not project files; use them only as named proposals (B5). |
| BA-5 | business analyst | Low | Accepted answers are applied after the loop; an answer that depends on a rejected item is asked again (B10 A). |
| PS-1 | product strategist | Low | The export needs Python 3 and absolute paths with drive letters on Windows (N2). |

## Skill question raised by the audit

R1. `sdd-unifier/SKILL.md` Version bookkeeping (step 7 wording fix W3) lists chunk 18 under `Chunks:` for a new review coverage row. The "the business review changed this SDD" row says the run bumps the version only if it changes content itself, but its delta review always adds a coverage row. So the run always bumps, and a child LLD is then marked out of date by a version whose only change is a review record. The user chose R1 A: a review's coverage rows alone bump nothing. It is applied in the skill and in two Band lines: the team guidelines' no-bump list and the Solution Architect's business review row.

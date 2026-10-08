# Step 8: Band role files audit (2026-10-08)

Claude Code audited the six Band files in `C:\Users\negat\Downloads\` read-only against the step 8 skill changes: `git diff 8506a9b` over the five unifier skills and the root README, which covers commit 6cc2f93 and the uncommitted step 8 work. Each finding was checked against the cited skill line, then all 19 were applied to four files. The product strategist and review lead files needed no change. Before and after: LF endings, no em or en dash, and the Room rules block byte-identical in the five agent files (SHA-256 prefix `4d75258455a4b9d8`, unchanged since step 7). The pre-edit copies are kept in the session scratchpad only.

| ID | File | Severity | Skill source | Fix |
|---|---|---|---|---|
| TM-1 | team guidelines | Medium | brd `delivery-chunks.md` § Step 2 (B5 C) | What the third run finds waits for the next request, except a mechanical correction that changes only chunk 14 or a companion record, which is applied at once. |
| BA-1 | business analyst | Medium | brd `delivery-chunks.md` § Step 2 (B5 C) | Only a fix that changes chunks 00-13 waits as `Decided - pending application`; a mechanical correction that changes only chunk 14 or a companion record is applied at once as `Corrected`. |
| BA-2 | business analyst | Medium | brd `sow-transformation.md` principle 7 (B10 A) | A new Never line against picking a side silently when two source parts disagree: propose the mapped part's version and name the other part, or flag both when neither part maps there. |
| SA-1 | solution architect | Medium | sdd SKILL.md step 8b, item 1 (S2) | Behind a `Stale` mark, chunk 19 is not regenerated. Its body and version are kept only when the faithfulness check finds no mismatch; a fix gives chunk 19 the update's version, listed after `Chunks:`. |
| SA-2 | solution architect | Medium | sdd SKILL.md step 10, the business review row (S3(a)) | The row first checks whether an earlier update took this review's hand-off. A repeat applies pending items, runs the Child LLDs check, and changes nothing else; newer review rows are covered on their own. |
| TL-1 | tech lead | Medium | lld `sdd-to-lld.md` § How far a new SDD version reaches (L1) | The unit compared is the field mapping row's whole SDD source, not the SDD section. |
| TL-2 | tech lead | Medium | lld SKILL.md step 3b; `sdd-to-lld.md` § Upstream documents (L8a A) | A shut e2e gate (`Locked` or `Stale`) does not stop the LLD: pending items reach it as flags, and the handoff names the gate state. |
| TM-2 | team guidelines | Low | root README, the hand-off line; sdd SKILL.md step 10 (S3(a)) | The SDD takes a review's hand-off once; a repeat changes nothing but its pending items. |
| TM-3 | team guidelines | Low | root README versions paragraph; lld SKILL.md Versions (L6 A) | Setting the upstream version in an LLD link label to the one 16 §19.1 records bumps nothing. |
| BA-3 | business analyst | Low | brd SKILL.md step 8 (B1) | Reject is one of the answers, typed through Other. |
| BA-4 | business analyst | Low | brd README and every skill file (the matrix name, 6cc2f93 and change 6) | "Users & Use Cases Matrix" in the description and in the write row. |
| BA-5 | business analyst | Low | brd SKILL.md step 3 (B11) | The project name is asked only when neither the request nor the source states it. |
| SA-3 | solution architect | Low | sdd SKILL.md step 8b (S1) | In the faithfulness exception, an untouched clause of a sentence or table cell the request edited counts as unchanged text. |
| SA-4 | solution architect | Low | sdd SKILL.md step 8b, item 1 (S4) | The handoff names each edit made outside the skill that the run found, or could not locate. |
| SA-5 | solution architect | Low | sdd `brd-to-sdd.md` § Items the change settles (L3 mirror) | A closed item that the BRD change confirms gets a `Settled by` row. |
| TL-3 | tech lead | Low | lld `sdd-to-lld.md` § Open items the change settles (L3 B) | A resolved item that the SDD change confirms gets a `Settled by` row. |
| TL-4 | tech lead | Low | lld `sdd-to-lld.md` field mapping, the 18 Open Items row (L4 A) | A new Never line: an SDD decision still `Decided - pending application` is not written into the body. The body follows the SDD text, and a `> TODO:` gives the decided option as its best guess. |
| TL-5 | tech lead | Low | lld `sdd-to-lld.md` § SDD lineage (L5) | An accepted refresh clears the SDD's out-of-date note; after a declined one, the note stays. |
| TL-6 | tech lead | Low | lld SKILL.md step 7, Answers in the same update (L9, with step 7's D2 B) | Other text an answer makes wrong is brought in line wherever it sits, when one wording is clearly right. |

## Checked, no change

- **L2 (the alert table as a derived view):** the tech lead's Never line names derived views "such as §8.2 Tables", so it still holds.
- **L8b (a reviewer that cannot write files):** a runtime detail each skill carries; no Band line describes how the reviewer writes.
- **Skill-level detail that no Band line restates:** the dated review labels (S5, L7), B3, B4, B6, B7, B8, B9, B12, S3(b), S6, the sdd template path, the bold or plain marker form, and the `Shut` wording of the e2e gate.
- **Product strategist and review lead:** no step 8 change touches pre-brd-unifier or business-reviewer-unifier, and their lines about the chain still hold.

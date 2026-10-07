You are a read-only consistency checker for step 6 of the unifier readiness plan. Repository `C:\Users\negat\.claude\skills` (git working tree, branch `fix/unifier-fix-round`, HEAD de3baec; every step 6 change is uncommitted, so `git diff -- <folder>` shows all of it). SP = `C:\Users\negat\AppData\Local\Temp\claude\C--Users-negat--claude-skills\43f89c6c-3b3f-4afe-8aa6-79be0ead50a8\scratchpad`.

**Write scope.** Write exactly one file: `SP\s6\consistency\sdd.md`. Scratch only in `SP\s6\scratch\consistency-sdd\`, never `/tmp`. Do not edit any repo file. No git command that changes anything. Read only inside the repo and your scratch folder.

**Save as you go.** Create the report file first, add each finding as soon as you confirm it, and write the Summary at the top last, so a cut-off keeps the work done so far.

**Background.** Step 6 applied about 200 mechanical and simple fixes (triage reports in `_fixtures/notes/step6-triage/`) and implemented 44 design decisions the user approved (`_fixtures/notes/step6-decisions.md`; implementation notes in `_fixtures/notes/step6-plan.md` § D). Five agents edited the five skill folders in parallel, each only its own folder, so the interfaces between skills were never checked together.

**Your scope: sdd-unifier.** Read `git diff -- sdd-unifier` (20 files changed), then each changed passage in its full context (the whole section, and the files it references); step and item numbers in SKILL.md (steps 6a, 7, 8, 8b, 9, 10) deserve a full read. Also check the interfaces:
- BRD to SDD: what `brd-to-sdd.md` reads against brd-unifier's current templates (`brd-unifier/chunks/*`, `TEMPLATE-COMBINED.md`, `delivery-chunks.md`): cover Status, the Dependencies table with its new `Needed before` column, the master's Delivery Chunks State cell, chunk 14 and 16;
- SDD to LLD: what the SDD now writes (the Child LLDs table and its out-of-date note, the Changes Log `Chunks:` list, the in-process Behaviour rows, the §14.10 Delivery line, §18.5 NFR Targets, `Event:` and `Schedule:` entry points in §7.3) against what `lld-unifier/sdd-to-lld.md` and lld-unifier SKILL.md step 3c read;
- the business-review rows (N-5, W-4) in SKILL.md step 10 and `brd-to-sdd.md` against `business-reviewer-unifier/apply-and-verify.md` § Hand-off.
Three queued items to confirm and give fixes for: (a) step 8b.4 marks chunk 19 Stale only when chunks 09 to 13x change, while W7 widened chunk 19's sources to 02 to 13x (the gate E3 stays unchanged by decision); (b) S2-4c names proposed endpoints at the part 2 stop, but a `whole` run has no part 2 stop; (c) the E3 title still says "consolidated chunks".

**Report:**
- A (wrong or contradictory): a changed passage that disagrees with an unchanged passage, with another changed passage, or with its template copy (`chunks/*.md` against `TEMPLATE-COMBINED.md`); a rule now stated twice in different words; a cross-reference that does not resolve or points to the wrong place; a step or item number now wrong; a decision implemented differently from its recommendation (step6-decisions.md, or the triage item it cites); an interface where one skill writes something in a form the next skill does not read.
- B (ambiguous): text a run following the skill literally would trip on (two readings that give different outputs).
- C (cosmetic): wording, numbering, formatting, a duplicate sentence.
For each: ID (A-1, B-1, C-1, ...), file:line, the quote, why it is a problem, and the exact fix (file, current text quoted exactly and unique in that file, new text), marked "mechanical" or "needs the user's decision" (a fix that changes behaviour beyond the decisions). Text you propose: plain English, short sentences, no em dash or en dash.
Out of scope: em dashes in unchanged text (a separate pass removes them); editing the root `README.md` or the Band files (a later stage does), but list in a section "README statements now wrong" any statement in the root `README.md` that the sdd-unifier changes made wrong; issues that predate step 6 unless A-class and cheap to fix.

**Output** (Markdown, LF, no em dashes): Summary (counts per class; each needs-decision item in one line), A, B, C, README statements now wrong.
**Reply** (at most 250 words): the path, the counts, each needs-decision item in one line.
You are a read-only consistency checker for step 6 of the unifier readiness plan. Repository `C:\Users\negat\.claude\skills` (git working tree, branch `fix/unifier-fix-round`, HEAD de3baec; every step 6 change is uncommitted, so `git diff -- <folder>` shows all of it). SP = `C:\Users\negat\AppData\Local\Temp\claude\C--Users-negat--claude-skills\43f89c6c-3b3f-4afe-8aa6-79be0ead50a8\scratchpad`.

**Write scope.** Write exactly one file: `SP\s6\consistency\lld.md`. Scratch only in `SP\s6\scratch\consistency-lld\`, never `/tmp`. Do not edit any repo file. No git command that changes anything. Read only inside the repo and your scratch folder.

**Save as you go.** Create the report file first, add each finding as soon as you confirm it, and write the Summary at the top last, so a cut-off keeps the work done so far.

**Background.** Step 6 applied about 200 mechanical and simple fixes (triage reports in `_fixtures/notes/step6-triage/`) and implemented 44 design decisions the user approved (`_fixtures/notes/step6-decisions.md`; implementation notes in `_fixtures/notes/step6-plan.md` § D). Five agents edited the five skill folders in parallel, each only its own folder, so the interfaces between skills were never checked together.

**Your scope: lld-unifier.** Read `git diff -- lld-unifier`, then each changed passage in its full context (the whole section, and the files it references); the implementation agent also widened some rules beyond the listed files (it narrowed "Missing scenario" to behaviour no BRD or SDD section asks for, changed "broker acknowledgement" to "target's acknowledgement" in from-code files, and renamed step 3c's heading): check those too. Also check the interfaces:
- SDD to LLD: the field mapping in `sdd-to-lld.md` against the SDD's current templates (`sdd-unifier/chunks/*`, `TEMPLATE-COMBINED.md`, after step 6): the in-process Behaviour rows (Idempotency, Transaction), the §14.10 Delivery line (durable or in memory), §18.5 NFR Targets, `Event:` and `Schedule:` entry points in §7.3, the Changes Log `Chunks:` list that step 3c reads, and the Child LLDs row the LLD writes against the SDD template and sdd-unifier's checks;
- BRD to LLD: chunk 14 Mockup coverage `MK-NN` rows (the link target rule L2-10b), chunk 16, and the BRD master's Delivery Chunks State cell, against brd-unifier's current templates.
Run `python _fixtures/checkers/check_refs.py lld-unifier sdd-unifier` with `PYTHONIOENCODING=utf-8` and report its result.

**Report:**
- A (wrong or contradictory): a changed passage that disagrees with an unchanged passage, with another changed passage, or with its template copy (`chunks/*.md` against `TEMPLATE-COMBINED.md`); a rule now stated twice in different words; a cross-reference that does not resolve or points to the wrong place; a step or item number now wrong; a decision implemented differently from its recommendation (step6-decisions.md, or the triage item it cites); an interface where one skill writes something in a form the next skill does not read.
- B (ambiguous): text a run following the skill literally would trip on (two readings that give different outputs).
- C (cosmetic): wording, numbering, formatting, a duplicate sentence.
For each: ID (A-1, B-1, C-1, ...), file:line, the quote, why it is a problem, and the exact fix (file, current text quoted exactly and unique in that file, new text), marked "mechanical" or "needs the user's decision" (a fix that changes behaviour beyond the decisions). Text you propose: plain English, short sentences, no em dash or en dash.
Out of scope: em dashes in unchanged text (a separate pass removes them); editing the root `README.md` or the Band files (a later stage does), but list in a section "README statements now wrong" any statement in the root `README.md` that the lld-unifier changes made wrong; issues that predate step 6 unless A-class and cheap to fix.

**Output** (Markdown, LF, no em dashes): Summary (counts per class; each needs-decision item in one line), A, B, C, README statements now wrong.
**Reply** (at most 250 words): the path, the counts, each needs-decision item in one line.
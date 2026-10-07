You are a read-only consistency checker for step 6 of the unifier readiness plan. Repository `C:\Users\negat\.claude\skills` (git working tree, branch `fix/unifier-fix-round`, HEAD de3baec; every step 6 change is uncommitted, so `git diff -- <folder>` shows all of it). SP = `C:\Users\negat\AppData\Local\Temp\claude\C--Users-negat--claude-skills\43f89c6c-3b3f-4afe-8aa6-79be0ead50a8\scratchpad`.

**Write scope.** Write exactly one file: `SP\s6\consistency\cross.md`. Scratch only in `SP\s6\scratch\consistency-cross\`, never `/tmp`. Do not edit any repo file. No git command that changes anything. Read only inside the repo and your scratch folder.

**Save as you go.** Create the report file first, add each finding as soon as you confirm it, and write the Summary at the top last, so a cut-off keeps the work done so far.

**Background.** Step 6 applied about 200 mechanical and simple fixes (triage reports in `_fixtures/notes/step6-triage/`) and implemented 44 design decisions the user approved (`_fixtures/notes/step6-decisions.md`; implementation notes in `_fixtures/notes/step6-plan.md` § D). Five agents edited the five skill folders in parallel, each only its own folder, so the interfaces between skills were never checked together. Three other checkers cover brd-unifier, sdd-unifier, and lld-unifier internally; you cover the rest and the cross-skill rules.

**Your scope.**
1. `git diff -- business-reviewer-unifier pre-brd-unifier`, each changed passage in full context.
2. The four cross-skill families across all five skills, reading the current text (the decisions are F1 to F4 in step6-decisions.md; the intended wording is in `_fixtures/notes/step6-triage/families.md`):
   - F1 versions: the rule's wording in each skill (brd `delivery-chunks.md`, sdd and lld SKILL.md § Output conventions), the masters' VERSIONING lines, the `Chunks:` list, gated chunks, the parts-mode first-build sentences, the reviewer's Apply rule 7;
   - F2 reviews on update paths: brd, sdd, lld step 7 and their update rows;
   - F3 decision-log registers: Marker register and Business review register, same names and shapes in brd and sdd `decision-log.md`; "who decided"; the reviewer's Apply rule 3; the Resolution Log outcomes ("Settled by", "Superseded by") in SDD and LLD chunk 18;
   - F4 Stale places: BRD 15 to 17 (status line, chunk 14 row, master State cell), SDD 19 (gate line), the reviewer's Apply rule 7.
3. The hand-offs on both sides: the reviewer's Hand-off items 1 to 3 against brd-unifier's "update the todo" row, sdd-unifier's review row and "BRD <KEY> has a new version" row (N-5: one update, the request names the tracker), and lld-unifier's "the SDD has a new version" and "refresh the trace" (L3: one offer); W-4 open remainders on both sides.
4. pre-brd-unifier: the Markdown and the workbook agree (`frameworks.md`, chunk 22, chunks 10 and 11, `xlsx-export.md`, `reference/cell-map.json`; read the workbook with Python's `zipfile` or openpyxl read-only); the queued item: 8 EventHive source comments on Market Sizing answer cells still reach every export: give the fix (a surgical removal from the reference workbook's comment parts; mark it mechanical, since the user accepted N-3's generic workbook).
5. The root `README.md`: list every statement the step 6 changes made wrong (for example the pre-BRD tier rows, the version-pin line, the refresh lines, the findings file, the delta reviews, the version rule, Known gaps), with the replacement text, in a section "README statements now wrong". Do not edit it.

**Report:**
- A (wrong or contradictory): a passage that disagrees with another, within or across skills; a rule stated in different words in two skills where they must match; a cross-reference that does not resolve; a decision implemented differently from its recommendation; an interface where one skill writes something in a form the next skill does not read.
- B (ambiguous): text a run following the skill literally would trip on.
- C (cosmetic).
For each: ID (A-1, B-1, C-1, ...), file:line, the quote, why it is a problem, and the exact fix (file, current text quoted exactly and unique in that file, new text), marked "mechanical" or "needs the user's decision". Text you propose: plain English, short sentences, no em dash or en dash.
Out of scope: em dashes in unchanged text (a separate pass removes them); the Band files in Downloads.

**Output** (Markdown, LF, no em dashes): Summary (counts per class; each needs-decision item in one line), A, B, C, README statements now wrong.
**Reply** (at most 250 words): the path, the counts, each needs-decision item in one line.
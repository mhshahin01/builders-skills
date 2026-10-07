# Handoff: consistency re-check after the step 6 fixes (read-only)

Work in the git repo `C:\Users\negat\.claude\skills` (branch `fix/unifier-fix-round`, HEAD de3baec). Five documentation skills live there: `pre-brd-unifier`, `brd-unifier`, `sdd-unifier`, `lld-unifier`, `business-reviewer-unifier`. Every change of this round is uncommitted, so `git diff HEAD -- <folder>` shows all of it.

**Why this check:** the round went through these stages, in order:
1. triage
2. about 200 mechanical and simple fixes
3. 44 design decisions (`_fixtures/notes/step6-decisions.md`)
4. a first consistency check with 114 findings, fixed by five agents working in parallel, plus 11 more decisions, C1 to C11 (reports and decisions in `_fixtures/notes/step6-consistency/`)
5. an em dash pass that changed punctuation only
6. a README sync and a few follow-ups

Nobody has re-read the skills together since the stage 4 fixes. **Goal:** find what those fixes and later edits broke or left inconsistent, before a long test run of the whole chain.

You are given one scope: **brd**, **sdd**, **lld**, or **cross**. Do only that scope.

## Ground rules

- **Read-only.** Write exactly one file: `_fixtures/notes/step6-handoffs/recheck-<scope>.md`. Edit nothing else.
- Use no git command that changes state: no commit, push, add, stash, checkout, restore, or reset. `git status`, `git diff`, `git show`, and `git log` are fine.
- Another agent is editing `_fixtures/checkers/` and `_fixtures/README.md` right now. Leave both out of scope, except running `python -B _fixtures/checkers/check_refs.py lld-unifier sdd-unifier`, which is read-only.
- **Save as you go:** create the report first, add each finding once it is confirmed, and write the Summary at the top last.
- **Do not re-report** an item the stage 4 reports (`_fixtures/notes/step6-consistency/brd.md`, `sdd.md`, `lld.md`, `cross.md`) list as found, unless it is still present or its fix introduced a new problem. In that case, say so and cite the report item.
- **Out of scope:**
  - em and en dashes, already handled
  - the root `README.md`, already synced
  - issues that predate this round, unless they are class A and cheap to fix

## Scopes

**brd:**
- Read `git diff HEAD -- brd-unifier`, then each changed passage in its full context.
- Check every chunk skeleton against its `TEMPLATE-COMBINED.md` copy.
- Check the BRD side of every interface:
  - what `sdd-unifier/brd-to-sdd.md` reads from a BRD: the Source BRDs register, the field mapping including Dependencies and `Needed before` (decision C1: "Build of UC-NN", BAT sign-off, or go-live), and the cover Status
  - what `lld-unifier/sdd-to-lld.md` reads: the master's delivery chunk State cell, chunk 14 Mockup coverage rows, chunk 16
  - what `business-reviewer-unifier/apply-and-verify.md` hands to brd-unifier (Apply rules and Hand-off item 1), against the "update the todo" row, the decision-log registers, and the `Stale` rules in `delivery-chunks.md`

**sdd:**
- Read `git diff HEAD -- sdd-unifier`, then each changed passage in full context.
- Check every chunk skeleton against `TEMPLATE-COMBINED.md`.
- Check SKILL.md step 6a (the reconciliation, the data-model check), step 7 (the full review, and the delta review on an update), step 8 (the marker walk), step 8b (the e2e gate E1 to E4, and the chunk 19 faithfulness check on every write), and step 10 (update rows, version bump, `Chunks:` lists, `Stale` on chunk 19 if it exists).
- Check `brd-to-sdd.md` both ways: the BRD side against `brd-unifier/chunks/`, and the LLD side against `lld-unifier/sdd-to-lld.md`.

**lld:**
- Read `git diff HEAD -- lld-unifier`, then each changed passage in full context.
- Check every chunk skeleton, including `04-implementation-template.md`, against `TEMPLATE-COMBINED.md`.
- Check SKILL.md step 3c: one offer covering SDD and BRD changes; a BRD newer than the SDD register waits (decision C3); combined `Chunks:` sections mapped to chunks (C11).
- Check the derived views with a Source per row (C2), the ERD with keys and relationships only (C4), §18.5 targets realised where their Realised in cell points (C5), `### Workflow:` blocks and their route cells (L2-6, C6), and the widened missing-outbox finding in from-code (C7).
- Check `sdd-to-lld.md` against the current SDD skeletons, and the new diagram summary rule and slots (`mermaid-diagrams.md`, SKILL.md principle 7, 13 `**Summary:**` slots in the templates).
- Run `check_refs.py` and report its result.

**cross:**
- Read `git diff HEAD -- business-reviewer-unifier pre-brd-unifier`.
- Check the four cross-skill families in all five skills (intended wording in `_fixtures/notes/step6-triage/families.md`; decisions F1 to F4):
  - **Versions:** the rule's wording in each skill, the masters' VERSIONING lines, `Chunks:` lists (sections for a combined document, C11), gated chunks, the reviewer's Apply rule 7.
  - **Reviews on update paths:** the BRD consistency check, and the SDD and LLD delta reviews.
  - **Decision-log registers:** the Marker and Business review registers, with the same names and shapes in brd and sdd; "who decided"; the Resolution Log outcomes in SDD and LLD chunk 18.
  - **Stale places:** BRD 15 to 17 (status line, chunk 14 row, master State cell), SDD 19 (gate line).
- Check the hand-offs on both sides. The reviewer's Hand-off items must match brd-unifier's "update the todo" row, sdd-unifier's review row and "BRD `KEY` has a new version" row (one update, naming the tracker), and lld-unifier's single offer. Open remainders on both sides. A pre-BRD point's remainder goes to the BRD made from it (C8). A reviewer asked for more is re-dispatched once, before the walkthrough (C10).
- **Copied formats after the em dash pass:** the output-format prompt, the option labels, the reviewer briefs, the Miro board names, the Mermaid error marker (now `[NEEDS CLARIFICATION: Mermaid syntax error: review and fix]` in BRD and SDD, `> TODO: Mermaid syntax error: review and fix.` in LLD), and heading separators. Strings that must match across skills or against a skeleton.
- **The pre-BRD:** the Markdown and the workbook agree (`frameworks.md`, chunk 22, chunks 10 and 11, `xlsx-export.md`, `reference/cell-map.json`; read the workbook with Python's `zipfile`).
- **The six Band files** in `C:\Users\negat\Downloads\`: `agent-*-*-unifier.md` and `team-product-management-guidelines.md`. Check each statement about skill behaviour against the skills. The Room rules block must be byte-identical in the five role files.

## Report

**Classes:**
- **A (wrong or contradictory):** passages that disagree; a rule worded differently where it must match; a cross-reference that does not resolve; a decision implemented differently from its recommendation; an interface where one skill writes a form the next does not read.
- **B (ambiguous):** text that a run following the skill literally would trip on.
- **C (cosmetic).**

**For each finding:**
- ID (A-1, B-1, C-1, ...), `file:line`, the quote, and why it is a problem
- the exact fix: the file, the current text (quoted exactly and unique in that file), and the new text
- marked "mechanical" or "needs the user's decision"

Proposed text: plain English, short sentences, no em dash or en dash. A BRD stays business-only.

**Output** (Markdown, LF): a Summary (counts per class, and each needs-decision item in one line), then sections A, B, and C.

End with the report path, the counts, and each needs-decision item in one line.

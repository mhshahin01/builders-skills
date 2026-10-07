# Consistency re-check: cross

## Summary

- Counts: **A 2, B 2, C 0**. All four findings are mechanical.
- A-1: the changed walkthrough example puts `Current` in a six-value Status column.
- A-2: the new EFAS/IFAS subset averages can divide by zero on permitted inputs while Excel's readiness check passes.
- B-1: the Band SDD review row assumes the review wrote an SDD Changes Log row, even when only a BRD changed.
- B-2: the Band team rule describes every SDD content update as a normal delta-review trigger, wider than the owning skill.
- Needs the user's decision: **none in this scope**. Findings owned by the other scopes are referenced in coverage and not counted again.
- Coverage complete. Ten exact replacement targets verified unique; UTF-8 without BOM, LF, no em or en dashes in the report. This is a read-only consistency audit, not an E2E run or an application of the proposed fixes.

## A. Wrong or contradictory

### A-1. The walkthrough example uses a status outside the tracker's vocabulary

- **Where:** `business-reviewer-unifier/walkthrough-protocol.md:57`; compare `business-reviewer-unifier/tracker-schema.md:27` and `:63`.
- **Quote:** `> | **BO-03** | **Three-market simultaneous launch** | **Current** |`
- **Why:** the example was changed from an inline tracker to a table in this round. It now puts `Current` in the Status column, although the tracker permits only Pending, Decided, Applied, Partially applied, Rejected, and Deferred. Highlighting the point must not replace its actual status. This is a new contradiction in the changed example, not a repeat of a stage 4 finding.
- **Fix:** mechanical. In `business-reviewer-unifier/walkthrough-protocol.md`, replace the unique line above with:

```text
> | **BO-03** | **Three-market simultaneous launch (current point)** | **Pending** |
```

### A-2. The new opportunity/strength averages can divide by zero on permitted inputs

- **Where:** `pre-brd-unifier/frameworks.md:31`, `:32`, `:36`; `pre-brd-unifier/chunks/10-efas.md:15`, `:20`; `pre-brd-unifier/chunks/11-ifas.md:15`, `:20`; `pre-brd-unifier/chunks/22-executive-summary-scoreboard.md:27`; workbook `pre-brd-unifier/reference/PRE-BRD-v1.1.xlsx`, `xl/worksheets/sheet23.xml:2`, Executive Summary cells J6, J7, C18, C19, D18, D19.
- **Quotes:** the weights are "from 0 to 1"; EFAS requires "at least one opportunity" and IFAS "at least one strength". The new scores divide by the sum of those selected rows' weights. J6/J7 check the count of O/S rows and the total of all weights, not the denominator of that selected subset.
- **Why:** an EFAS with types O,T,T,T,T and weights 0,0.25,0.25,0.25,0.25 satisfies all stated row/weight rules. J6 returns 1, while C18 and D18 divide 0 by 0. IFAS types S,W,W,W with weights 0,0.5,0.25,0.25 has the same problem. With other dependencies ready, the control panel allows generation and the composite becomes an error. This is a new edge case in P2/P3's changed formulas, not a repeat of the corrected stage 4 workbook findings.
- **Fix:** mechanical. Preserve zero as a legal individual weight, but flag an undefined subset average and keep the workbook blocked until it has a nonzero denominator. No weights or ratings are invented.

In `pre-brd-unifier/frameworks.md`, replace this unique paragraph:

```text
When filling 22, derive each signal from its source framework. If a source is missing or flagged, the corresponding Tier-5 signal inherits a `[NEEDS CLARIFICATION]`.
```

with:

```text
When filling 22, derive each signal from its source framework. If a source is missing or flagged, the corresponding Tier-5 signal inherits a `[NEEDS CLARIFICATION]`. If the EFAS opportunity weights or IFAS strength weights sum to zero, flag that signal `[NEEDS CLARIFICATION: the selected factors have zero total weight]`. Do not calculate its score or the composite until the source weights give that average a nonzero denominator.
```

In `pre-brd-unifier/chunks/22-executive-summary-scoreboard.md`, replace the unique line:

```text
- Feasibility: the weighted average rating of the IFAS strength rows = sum of their weighted scores / sum of their weights.
```

with:

```text
- Feasibility: the weighted average rating of the IFAS strength rows = sum of their weighted scores / sum of their weights.

If the opportunity weights or strength weights sum to zero, flag that signal `[NEEDS CLARIFICATION: the selected factors have zero total weight]`. Leave its score and the composite unresolved until the source weights give that average a nonzero denominator.
```

For the workbook, the following are exact decoded `<f>` texts, unique in `xl/worksheets/sheet23.xml`. Replace only each named cell's formula and invalidate its cached value; keep all other workbook parts unchanged.

J6 current:

```text
IF(OR(COUNT(EFAS!E2:E6)<5,COUNT(EFAS!D2:D6)<5,SUM(EFAS!D2:D6)=0,COUNTIF(EFAS!C2:C6,"O")=0),0,1)
```

J6 new:

```text
IF(OR(COUNT(EFAS!E2:E6)<5,COUNT(EFAS!D2:D6)<5,SUM(EFAS!D2:D6)=0,COUNTIF(EFAS!C2:C6,"O")=0,SUMIF(EFAS!C2:C6,"O",EFAS!D2:D6)=0),0,1)
```

J7 current:

```text
IF(OR(COUNT('IFAS '!E2:E5)<4,COUNT('IFAS '!D2:D5)<4,SUM('IFAS '!D2:D5)=0,COUNTIF('IFAS '!C2:C5,"S")=0),0,1)
```

J7 new:

```text
IF(OR(COUNT('IFAS '!E2:E5)<4,COUNT('IFAS '!D2:D5)<4,SUM('IFAS '!D2:D5)=0,COUNTIF('IFAS '!C2:C5,"S")=0,SUMIF('IFAS '!C2:C5,"S",'IFAS '!D2:D5)=0),0,1)
```

C18 current:

```text
"EFAS opportunity rating "&TEXT(SUMIF(EFAS!C2:C6,"O",EFAS!F2:F6)/SUMIF(EFAS!C2:C6,"O",EFAS!D2:D6),"0.0")&"/5"
```

C18 new:

```text
IF(SUMIF(EFAS!C2:C6,"O",EFAS!D2:D6)=0,"[NEEDS CLARIFICATION: EFAS opportunities have zero total weight]","EFAS opportunity rating "&TEXT(SUMIF(EFAS!C2:C6,"O",EFAS!F2:F6)/SUMIF(EFAS!C2:C6,"O",EFAS!D2:D6),"0.0")&"/5")
```

C19 current:

```text
"IFAS strength rating "&TEXT(SUMIF('IFAS '!C2:C5,"S",'IFAS '!F2:F5)/SUMIF('IFAS '!C2:C5,"S",'IFAS '!D2:D5),"0.0")&"/5"
```

C19 new:

```text
IF(SUMIF('IFAS '!C2:C5,"S",'IFAS '!D2:D5)=0,"[NEEDS CLARIFICATION: IFAS strengths have zero total weight]","IFAS strength rating "&TEXT(SUMIF('IFAS '!C2:C5,"S",'IFAS '!F2:F5)/SUMIF('IFAS '!C2:C5,"S",'IFAS '!D2:D5),"0.0")&"/5")
```

D18/D19 need no change: their existing C8 guard now blocks the divisions through J6/J7.

## B. Ambiguous

### B-1. The Band SDD review row again assumes the review changed the SDD

- **Where:** `C:/Users/negat/Downloads/agent-solution-architect-sdd-unifier.md:48` and `:49`; compare `sdd-unifier/SKILL.md:353` and `:354`.
- **Quotes:** row 48 says the post-review BRD update "also runs the steps of the next row". Row 49 says "Read the review's Changes Log row and its tracker" and "The review already bumped the version".
- **Why:** if the review changed only a BRD, it wrote no review row and made no version bump in the SDD. The role still routes that case through instructions that assume both exist. This repeats stage 4 `cross:C-9` in the new Band copy after the skill added "when the review changed it". The skill remains authoritative, but the role should not send the agent looking for a nonexistent row or bump.
- **Fix:** mechanical. In that Band file, replace each unique current text below.

Current:

```text
Read the review's Changes Log row and its tracker.
```

New:

```text
Read the tracker and, when the review changed this SDD, its Changes Log row in the SDD.
```

Current:

```text
Then run a delta review of the chunks the review's row lists after `Chunks:`, plus any you changed. The review already bumped the version: bump again only if you change content yourself.
```

New:

```text
Run a delta review of the design chunks the review changed in this SDD, when any, plus any this update changed. Use section names for a combined SDD. If the review changed this SDD, its version bump stands; this run bumps the version only if it changes content itself.
```

### B-2. The Band team rule widens the SDD delta review to every content update

- **Where:** `C:/Users/negat/Downloads/team-product-management-guidelines.md:84`; compare `sdd-unifier/SKILL.md:253`, `:312`, and `:341`; `lld-unifier/SKILL.md:253`; `brd-unifier/SKILL.md:198`.
- **Quote:** "Every later update that changes a BRD, SDD, or LLD gets a review of what it changed" followed by "the SDD and LLD run a cleared-context delta review".
- **Why:** the SDD's normal delta review is triggered by changes to chunks 01 to 17. A write confined to chunk 19 instead gets its faithfulness check; an update confined to chunk 18 does not trigger the normal design delta review. The Band sentence conflates those paths and can add an extra review beyond the decided rule. This is an overbroad Band copy of F2, not a new policy question.
- **Fix:** mechanical. Replace the unique paragraph:

```text
Every later update that changes a BRD, SDD, or LLD gets a review of what it changed: the BRD reruns its consistency check (a full run, then scoped reruns, at most three per session), and the SDD and LLD run a cleared-context delta review of the chunks the update changed.
```

with:

```text
A later BRD content update reruns its consistency check (a full run, then scoped reruns, at most three per session). An SDD update that changes chunks 01 to 17 runs a cleared-context delta review of the changed design chunks; every write of chunk 19 gets its separate faithfulness check. A later LLD content update runs a cleared-context delta review of the changed chunks. Each owner follows its skill's review scope.
```

## C. Cosmetic

None confirmed in this scope.

## Coverage and verification

- Read the full `git diff HEAD -- business-reviewer-unifier pre-brd-unifier`, including the workbook, cell-map, export-engine and test changes. Re-read the changed reviewer and pre-BRD passages in their current context. The root README, checker code and fixture README were not audited or edited.
- **F1, versions:** compared the three version rule homes, the three masters' VERSIONING lines, first-build and resumed-update rules, combined section lists, per-service LLD entries, gated chunk versions, and review Apply rule 7. Pre-BRD remains unversioned. The review bump and owner hand-off bump are separate; a metadata-only hand-off does not invent a content bump. The BRD and LLD reports cover the re-chunk recovery issues, and the SDD report covers its combined-section delta consumer; these are not duplicated here.
- **F2, reviews:** BRD updates rerun the consistency check; SDD design updates and LLD content updates run delta reviews, read existing open items first, and preserve earlier coverage. Every SDD 19 write gets its own faithfulness pass against 02 to 13x. The skill rules agree; B-2 covers the overbroad Band summary.
- **F3, registers and outcomes:** checked the BRD/SDD Marker and Business review register names, fields, Rule home links, creation on first decision, sources that can decide, settled markers, and the SDD/LLD Resolution Log outcomes. The Business review record text now matches. Marker records retain intentional domain differences (the SDD also records contract divergences; BRD sources need not be BRDs). C8's pre-BRD remainder travels in the tracker's Decision cell to the BRD made from it. The BRD report covers the new point-only de-duplication flaw; the SDD and LLD reports own any template-local outcome issues.
- **F4, Stale:** checked BRD status lines, chunk 14 rows and master State cells, plus combined adaptations; SDD state remains on the master/cover gate line only. Review Apply rule 7 uses the same homes and does not edit gated content. Renamed combined-BRD links are explicitly allowed by the owner and reviewer rules. BRD report findings cover the execution-tracking exception and residual same-value wording. SDD report A-1 covers the remaining unconditional Child LLDs note-clearing text.
- **Hand-offs:** checked reviewer items 1 to 3 against the BRD update-the-todo row, the SDD review/new-BRD rows and the LLD single offer. They name the tracker, process open remainders, retain the review's bump, route changed pre-BRD content through the BRD, wait when a BRD is newer than the SDD register, and retain an old reflected version after a declined refresh. C10's requested re-dispatch happens once before walkthrough, updates both files, and leaves the raw findings file closed thereafter. B-1 is the stale Band copy of the missing-SDD-row case.
- **Copied formats:** compared output prompts and option labels (pre-BRD/BRD/SDD Output format, LLD Output shape), LLD's single direction prompt and its reference, reviewer finding-schema fields and Why wording, BRD/SDD Miro board names, Mermaid error markers, TODO/Confirm examples, reverse-engineered Roadmap text, and the Architectural Style heading against its skeleton. The punctuation pass preserves matching fixed strings. Deliberate prose differences and the pre-existing output shape/format distinction are not findings. A-1 is the new status-table example defect.
- **Pre-BRD Markdown and Excel:** read the workbook with Python `zipfile` and XML parsing, without saving it. Checked the SAM/USD thresholds, opportunity/strength averages, Porter's inversion, strategic-fit average, rounding, composite/verdict bands, fixed 5/4 factors, lowest-signal condition and tie-break, G17:G21 rationales, conditions 2 to 4, and the cell map. The workbook contains 77 formula elements, no comment parts, and no formula cell is whitelisted in `answer_cells`. Corrected TAM and IFAS guidance, averaged label, and M49:Q49 clearing entries are present. The export engine clears these cells before filling; investor, GTM and canonical-figure content intentionally remain Markdown-only. A-2 is the uncovered zero-denominator case. The read-only witness uses allowed weights and proves that each current readiness test returns 1 with a zero selected denominator; the proposed guard returns 0. This is formula inspection and arithmetic verification, not an Excel recalculation or an export test.
- **Six Band files:** read all five `agent-*-*-unifier.md` roles and `team-product-management-guidelines.md` in `C:/Users/negat/Downloads/`. Checked their skill-specific behavior, gates, output names, update/review summaries, hand-offs, lineage, version claims and derived-view exception against the owning skills. The five Room rules blocks are byte-identical: 1,799 UTF-8 bytes each, SHA-256 `4D75258455A4B9D8B39A08157FF4BCA5218192013BC3F3DB7CE1DF35064128F2`. B-1 and B-2 are the remaining Band-copy issues. Vendor installation and room-runtime claims were not independently researched; the audit checks their representation of repository skill behavior.
- Reconciled every stage 4 cross finding against the current text and accepted C1 to C11. Corrected items are not re-reported. B-1 explicitly identifies the recurrence of cross:C-9 in Band. Remaining fixes owned by BRD, SDD or LLD are referenced there rather than counted twice. No user policy choice is needed for the findings in this report.
- Read-only Git used a process-local safe.directory option; no configuration, index, branch or commit was changed. This scope wrote only this report. No skill, workbook, Band, README or checker file was edited, and no scratch file was created.
- Final write-scope check: SHA-256 snapshots match for all 147 source files enumerated across the five skill folders. The unreadable pre-existing `.pytest_cache` directory was outside that inventory. Git status gained no new entry outside the already-untracked handoff directory; the concurrent CK worker's `_fixtures/.ck-tmp/` entry disappeared during the audit. This audit did not create, edit or remove that directory.

Report: `_fixtures/notes/step6-handoffs/recheck-cross.md`. Counts: A 2, B 2, C 0. Needs the user's decision: none.

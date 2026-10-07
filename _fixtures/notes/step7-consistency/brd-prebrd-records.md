# Step 7 consistency check: brd-unifier, pre-brd-unifier, root README, records

Read-only check, 2026-10-07, of the uncommitted step 7 edits on `fix/unifier-live-findings` (HEAD 548bf5d). Scope: `git diff -- brd-unifier pre-brd-unifier`, every changed line of the root `README.md`, and the record edits in `UNIFIER-ENHANCEMENTS.md`, `_fixtures/notes/step6-plan.md` and `_fixtures/notes/step6-handoffs/live-findings.md`. No repository file was created, edited, moved or deleted; no state-changing git command ran (git status is the same before and after). Scratch files are in `scratchpad/s7/consistency/work-brdpre/` (saved diffs only).

## Summary

| ID | Class | File:line | One-line fix |
|---|---|---|---|
| BP1 | S | brd-unifier/sow-transformation.md:179 | H1 names four of the six PESTLE rows after "whichever row holds it"; say "whichever of its six rows holds it, not only Legal". |
| BP2 | M | brd-unifier/chunks/14-todo.md:78 | Skeleton says "a UC step"; the new check and § Step 1 allow a UC ID too: "a UC step or ID". |
| BP3 | S | brd-unifier/delivery-chunks.md:493-494 (and chunks/14-todo.md:78) | H2 bullets read as a closed list of Source kinds that leaves out `CF-NN` and `DP-NN` sources the skill produces, and a `Decided - pending application` row states a decision, not a question; make the list "for example" and accept the decision. |
| BP4 | S | pre-brd-unifier/SKILL.md:68; pre-brd-unifier/README.md:31 | "Tier 5 must not contradict chunks 01-21": Tier 5 is 22 in the README table but 22-24 in the master, and 24 is the reviewer; name "chunks 22 and 23". |
| BP5 | S | pre-brd-unifier/chunks/22-executive-summary-scoreboard.md:10; chunks/23-investor-assessment.md:10 | Template text still says the scoreboard aggregates "the analysis tiers"; say tier 2 (07, 09, 10, 11). Low. |
| BP6 | S | pre-brd-unifier/xlsx-export.md:10 | In Git Bash a `/c/...` path fails with Windows Python (tested); say to use drive-letter paths, and that `<dst>` must exist. |
| RM1 | S | README.md:54 | "What the last run finds ... recorded as `Decided - pending application`" now also covers the LLD, which has no such status; limit that clause to the BRD and SDD. |
| RM2 | S | README.md:169 | "an open one ... becomes a flag": the LLD rule says open or deferred, and names the flags; add both. |
| RM3 | S | README.md:199 | The settle/remove-flags clause sits inside "When SDD §1, §6, or §13 changed"; the LLD does it on every refresh; split the sentence. |
| RM4 | S | README.md:200 | "kept as is, after a faithfulness check" holds only when the check finds no mismatch; reword. Low. |
| RM5 | S | README.md:344 | Raise vs note conditions are half stated: add "or that the request's own change caused" and "in text the request did not change". |
| RM6 | S | README.md:168 | The LLD now maps SDD §22 (wishlist not carried; near-term items to 15 §18.4); the row still says "17 §21". Low; may overlap the lld check. |
| RM7 | S | README.md:562 | Known gaps says "Next-round input remains frozen"; step 7 fixes it. Update in the step 7 README pass. |
| RC1 | S | UNIFIER-ENHANCEMENTS.md:249 | "The optional extras (...) were not taken" is unscoped (some sdd and lld optional ripples were applied) and its brd-prebrd list misses two items; the H2 summary misses Source and Blocks in the skeleton. |
| RC2 | M | UNIFIER-ENHANCEMENTS.md:30 | "No skill file has changed since 86cab74" is false (102 skill files changed 86cab74..548bf5d; 29 more in step 7). |
| RC3 | M | _fixtures/notes/step6-plan.md:4 | "Nothing of step 6 is committed yet" contradicts the edited FOLLOW-UP row. |
| RC4 | M | _fixtures/notes/step6-plan.md:24 | R row still says "the Band check waits for the user"; FOLLOW-UP now says it passed. |
| RC5 | S | _fixtures/notes/step6-plan.md:51 | "Current handback" says the after-Codex prompt has not run; label it historical. Pre-existing. |
| RC6 | M | _fixtures/notes/step6-handoffs/live-findings.md:47 | `chunks/14-todo.md:80-84` misses the Pending decision row (line 85): `:80-85`. |
| RC7 | S | _fixtures/notes/step6-handoffs/live-findings.md:3, :49, :54 | "Nothing below is applied" and two "not applied" labels are now stale; add a step 7 pointer (at commit time). |

Counts: M 5 (BP2, RC2, RC3, RC4, RC6), S 15, D 0.

## Line endings of the files named below

Counted with `open(p,'rb').read().count(b'\r')` in the working tree.

| File | CR | LF | Ending |
|---|---|---|---|
| README.md | 562 | 562 | CRLF |
| UNIFIER-ENHANCEMENTS.md | 469 | 469 | CRLF |
| brd-unifier/sow-transformation.md | 254 | 254 | CRLF |
| brd-unifier/delivery-chunks.md | 511 | 511 | CRLF |
| brd-unifier/chunks/14-todo.md | 244 | 244 | CRLF |
| pre-brd-unifier/SKILL.md | 125 | 125 | CRLF |
| pre-brd-unifier/README.md | 0 | 81 | LF |
| pre-brd-unifier/xlsx-export.md | 57 | 57 | CRLF |
| pre-brd-unifier/chunks/22-executive-summary-scoreboard.md | 63 | 63 | CRLF |
| pre-brd-unifier/chunks/23-investor-assessment.md | 0 | 62 | LF (index LF too; the odd one among the skeletons) |
| _fixtures/notes/step6-plan.md | 0 | 130 | LF |
| _fixtures/notes/step6-handoffs/live-findings.md | 0 | 62 | LF |

Every changed file kept its ending (CR count equals LF count in the CRLF files; 0 CR in the LF files). Em dash and en dash counts are the same as at HEAD in every changed file (chunking.md 11 en dashes, pre-brd SKILL.md 7, research-orchestration.md 5, all pre-existing). All proposed text below is ASCII apart from the `§` the README already uses.

---

## Skill edits: brd-unifier and pre-brd-unifier

### BP1 (S). H1 lists four PESTLE rows after "whichever row holds it"

`brd-unifier/sow-transformation.md:179` (CRLF), How cell of the 06-12 row:

> Every regulatory point in 08 PESTLE becomes a numbered 02 constraint, whichever row holds it: Political, Technological, Legal, or Environmental.

PESTLE has six rows (`pre-brd-unifier/chunks/08-pestle-analysis.md:14-19`). The list leaves out Economic and Social, so a law in the Economic row (labour law, currency or tax rules) reads as outside the rule. H1 asked for "any PESTLE row" (`live-findings.md:51`) and the triage summary says "in any row" (`step7-triage/brd-prebrd.md:11`). The content definition in the next sentence already does the work; the list only narrows it.

- Old: `whichever row holds it: Political, Technological, Legal, or Environmental.`
- New: `whichever of its six rows holds it, not only Legal.`

The rest of the row is right: the BRD home cell names real chunk 02 sections (`# Assumptions / Constraints`, `# Facts`, `# Challenges`) and chunk 10; the obligation example is an example, not a rule; no earlier rule is lost (every Legal-row law is still a regulatory point).

### BP2 (M). Skeleton says "a UC step"; the check and § Step 1 accept a UC ID

`brd-unifier/chunks/14-todo.md:78` (CRLF) says the Source names "(a section, a UC step, an OI-NN, an assumption, or a dependency)". The new check at `delivery-chunks.md:493` says "a UC step or ID", § Step 1 at `:147` says "(cite chunk + section or UC ID)", and the same skeleton's grill-me prompt (`14-todo.md:147`) cites `06a / UC-04`.

- Old: `(a section, a UC step, an OI-NN, an assumption, or a dependency)`
- New: `(a section, a UC step or ID, an OI-NN, an assumption, or a dependency)`

(If BP3 is taken, use its wording here instead.)

### BP3 (S). The H2 bullets can flag legitimate rows

`brd-unifier/delivery-chunks.md` (CRLF). The applied text is the triage's Option B verbatim, so the decision is honoured; two phrases conflict with other rules in the same file.

1. `:493` lists the "exact place" after a colon, so it reads as a closed list: "a section, a UC step or ID, an `OI-NN`, an assumption, or a dependency, never the chunk alone". The skill also raises TDs whose natural source is a consistency finding (Kind table `:149` "consistency findings awaiting a choice"; `:188` "Deferred for clarification: TD-NN") or a chunk 15 dependency problem (`:261` "`DP-NN` + `TD-NN`"). Real registers cite them: `_fixtures/chain/run-2026-10-07-review/brd-loyalty-points/14-todo.md` TD-40 "CF-42 (step 2 below)"; `_fixtures/scenarios/pre-brd-to-brd/run/brd-clinic-reminders/14-todo.md` TD-71 "[14 / CF-46]". The rule's intent is only "never the chunk alone".
   - Old: `Its Source names the chunk and the exact place: a section, a UC step or ID, an `OI-NN`, an assumption, or a dependency, never the chunk alone.`
   - New: `Its Source names the chunk and the exact place (for example a section, a UC step or ID, an `OI-NN`, a `CF-NN` or `DP-NN`, an assumption, or a dependency), never the chunk alone.`
   - Same change in the skeleton, `chunks/14-todo.md:78`: Old `(a section, a UC step, an OI-NN, an assumption, or a dependency)` New `(for example a section, a UC step or ID, an OI-NN, a CF-NN or DP-NN, an assumption, or a dependency)`. This replaces BP2.
2. `:494` asks that every open marker and unclosed `OI-NN` sit in "a row that states its question". A `Decided - pending application` row holds "the decision, who decided, and the date" in that cell (`:161`), so a strict C10 run would flag it.
   - Old: `is in the Source of a row that states its question.`
   - New: `is in the Source of a row that states its question (for a `Decided - pending application` item, the decision taken).`

### BP4 (S). "Tier 5 must not contradict chunks 01-21" has no single meaning

`pre-brd-unifier/SKILL.md:68` (CRLF) and `pre-brd-unifier/README.md:31` (LF). "Tier 5" is chunk 22 only in the README tier table (`README.md:19`), chunks 22-24 in the master (`chunks/00-pre-brd-master.md:55-60`), and chunk 24's own header says `TIER: Review Output`. Read with the master, the rule binds the reviewer's chunk 24, whose job is to report contradictions. `research-orchestration.md:35` already names the chunk ("nothing in 22 may contradict chunks 01-21"). The README line also mixes "tier 2" and "Tier 5" mid-sentence; this fix removes that.

- `SKILL.md:68`. Old: `Tier 5 must not contradict chunks 01-21.` New: `Chunks 22 and 23 must not contradict chunks 01-21.`
- `README.md:31`. Old: `Tier 5 never contradicts chunks 01-21,` New: `chunks 22 and 23 never contradict chunks 01-21,`

### BP5 (S, low). Templates 22 and 23 still describe the scoreboard as built from "the analysis tiers"

Principle 7 now says the five signals come from tier 2 only. The template guidance that lands in every pre-BRD still says otherwise (the same looseness N5 removed). The triage chose "no change" for chunks 22 and 23; the workbook has no copy of this sentence (searched), so the edit stays Markdown-only.

- `pre-brd-unifier/chunks/22-executive-summary-scoreboard.md:10` (CRLF). Old: `from the analysis tiers above into a single weighted composite` New: `from the tier 2 analyses (07, 09, 10, 11) into a single weighted composite`
- `pre-brd-unifier/chunks/23-investor-assessment.md:10` (LF). Old: `is a mechanical weighted composite of the analysis tiers,` New: `is a mechanical weighted composite of five tier 2 signals,`

### BP6 (S). The export line fails in Git Bash with a `/c/...` path

`pre-brd-unifier/xlsx-export.md:10` (CRLF). The command itself is correct: `export_xlsx.export(payload, dst)` matches `scripts/export_xlsx.py:116`; the string has no `$`, backtick, `!` or inner double quote, so PowerShell and bash pass it unchanged; raw strings keep Windows backslashes. Tested from the scratchpad with `python -B` (import only): `sys.path.insert(0,r'C:/Users/negat/.claude/skills/pre-brd-unifier/scripts')` imports `export_xlsx`; the same path written `/c/Users/negat/...` gives `ModuleNotFoundError` (Git Bash does not convert a path inside a `-c` string). Claude Code on Windows runs Git Bash, where `pwd` prints the `/c/...` form. Also, `clone_workbook` copies to `<dst>` with `shutil.copyfile`, so the folder must exist.

- Old: `Give `<payload.json>` and `<dst>` (the output folder) as absolute paths too. The same line works in PowerShell and in bash:`
- New: `Give `<payload.json>` and `<dst>` (an existing output folder) as absolute paths too. On Windows, give each path with its drive letter (`C:/...`), in Git Bash too: Windows Python does not read `/c/...` paths. The same line works in PowerShell and in bash:`

---

## Root README (every changed line)

Changed lines: 54, 56, 169 (new row), 199, 200, 201, 344. Lines 56 and 201 match the skills (SDD SKILL.md Versions "A write of chunk 19 that changes none of its content keeps that version"; `lld-unifier/sdd-to-lld.md` § Refresh triggers "It checks the flags chunk 15 indexes the same way"). `python -B _fixtures/notes/step6-handoffs/check_readme.py`: 562 lines, CRLF 562, 0 problems (two info lines, pre-existing). Each proposed edit keeps the table cell counts and adds no anchor.

### RM1 (S). README:54 now applies the BRD/SDD pending status to the LLD

The edit added "and LLD reviews after two" to the cap sentence. The next sentence, "What the last run finds is not applied in that request: it stays open, and a decision the owner gives on it is recorded as `Decided - pending application` and applied by the next request.", now reads as covering the LLD's second pass. The LLD has no such status (grep: no "pending application" in `lld-unifier/`); its check's gaps become `Open` items for a later request (`lld-unifier/SKILL.md:255`).

- Old: `What the last run finds is not applied in that request: it stays open, and a decision the owner gives on it is recorded as `Decided - pending application` and applied by the next request.`
- New: `What the last run finds is not applied in that request: it stays open. In the BRD and SDD, a decision the owner gives on it is recorded as `Decided - pending application` and applied by the next request.`

Whether the LLD should hold such a decision is an lld-unifier design question, outside this scope.

### RM2 (S). README:169 leaves out deferred items

`lld-unifier/sdd-to-lld.md` § Field mapping row "18 Open Items & Clarifications (§23)": "An open or deferred item that an implementation choice depends on becomes a `> Confirm:` or `> TODO:` that cites it."

- Old: `an open one an implementation choice depends on becomes a flag;`
- New: `an open or deferred one that an implementation choice depends on becomes a `> Confirm:` or `> TODO:` flag;`

### RM3 (S). README:199 makes settling depend on §1, §6 or §13

The appended clause sits inside "When SDD §1, §6, or §13 changed, ...", so settling chunk 18 items and removing flags read as happening only then. In the skill, every refresh does both (`sdd-to-lld.md` § Refresh triggers, "Open items the change settles"). "it answers" is also ambiguous (the update or the change).

- Old: `When SDD §1, §6, or §13 changed, the update also re-synthesises the Specs, and it settles, supersedes, or reopens the chunk 18 items the change answers and removes the flags it answers.`
- New: `When SDD §1, §6, or §13 changed, the update also re-synthesises the Specs. In every case it settles, supersedes, or reopens the chunk 18 items the change answers, and removes the flags the change answers.`

### RM4 (S, low). README:200 "kept as is" after a check that may find a mismatch

`sdd-unifier/SKILL.md` step 8b item 1 (Already current): behind a Stale mark the body and version are kept "when it finds no mismatch"; otherwise "Fix any mismatch it finds as item 3 says". This bullet also marks chunk 19 Stale itself, so "when it was marked `Stale`" always holds here.

- Old: `(a chunk 19 whose source claims did not change is kept as is, after a faithfulness check when it was marked `Stale`)`
- New: `(a chunk 19 whose source claims did not change keeps its body and version; when it was marked `Stale`, a faithfulness check must first find no mismatch)`

### RM5 (S). README:344 states the raise/note rule by half

`sdd-unifier/SKILL.md` step 8b item 3: a problem is noted, not raised, only when no chunk 19 claim depends on it "and that lies in text this request did not change". `sdd-unifier/chunks/18-open-items-and-clarifications.md:10` raises one "that a chunk 19 claim depends on or that the request's own change caused". The README row drops the second condition on both sides (the sdd triage's README text, `step7-triage/sdd.md:142`, already did).

- Old: `a chunk 19 source problem that a chunk 19 claim depends on, a business review remainder)`
- New: `a chunk 19 source problem that a chunk 19 claim depends on or that the request's own change caused, a business review remainder)`
- Old: `a chunk 19 check finding that no chunk 19 claim depends on is noted there too, for its owner`
- New: `a chunk 19 check finding that no chunk 19 claim depends on, in text the request did not change, is noted there too, for its owner`

### RM6 (S, low). README:168 does not show the new §22 wishlist rule

The lld fix added "17 Appendix (§21) and Wishlist (§22) ... The wishlist is not carried: an item that informs near-term implementation goes to `15-open-questions.md` § 18.4". README:168 still maps "17 §21" only. Not a contradiction, a sync gap; the lld check may report the same.

- Old: `| 14 §18, 15 §19, 16 §20, 17 §21 |`
- New: `| 14 §18, 15 §19, 16 §20, 17 §21-§22 |`
- Old (end of the same row): `environment configuration is a derived view with a Source per row |`
- New: `environment configuration is a derived view with a Source per row; the §22 wishlist is not carried, except an item that informs near-term implementation, which goes to 15 §18.4 |`

### RM7 (S). README:562 Known gaps says the next-round input "remains frozen"

Step 7 fixes the 25 skill items. Apply in the step 7 README pass (plan item 3), with the commit. The "Scenario reruns" bullet (README:560, the two S3 defects) stays true until the S3 rerun.

- Old: `- **Next-round input remains frozen.** The [16 live skill findings, the two S3 defects with their hardening candidates, and the fixture design gaps](_fixtures/notes/step6-handoffs/live-findings.md) were not fixed during close-out.`
- New: `- **Next-round input.** Step 7 fixes the [16 live skill findings, the two S3 hardening candidates, and the README-audit notes](_fixtures/notes/step6-handoffs/live-findings.md) in the skills; the S3 rerun that proves H1 and H2 has not run yet, and the fixture design gaps were not in its scope.`

---

## Records

Verified against git: origin/main is 548bf5d, pushed 2026-10-07 13:29 -0500, the previous push 86cab74 (reflog of `refs/remotes/origin/main`), so "86cab74..548bf5d" is right; `fix/unifier-live-findings` sits at 548bf5d; the six listed branches exist and are merged; step 6 is seven commits (five skill, test 0c652c4, docs 8395250). Triage counts hold: brd-prebrd M 2, S 4, D 1; sdd M 1, S 5, D 4; lld M 2, S 5, D 1 (R-186 merged with 12); total M 5, S 14, D 6. Edit counts hold for brd (11) and pre-brd (7); by my count also sdd (14) and lld (14); README 4 M/S lines plus 3 from the D items (54, 200, 344) make the 7 changed lines. `check_refs.py lld-unifier sdd-unifier`: 251 references, 0 problems. The three corrected refs on `live-findings.md:47` are right (`delivery-chunks.md:141`, `:147`, `:159`; the old `:143`, `:148`, `:155` pointed at other text); the other refs on that line resolve (`14-todo.md:60-113`, `:75`, `02:62`, `02:77`, `04:62`, `06b:280`, `06c:176`, `08:38`, `12:79`, and S3-1's `08-pestle-analysis.md:15`, `02:63`, `08:16`, `12:59`). The heading rename "Step 6: fix round (Done)" breaks no link (no anchor references found).

### RC1 (S). UNIFIER-ENHANCEMENTS.md:249: the optional-extras sentence

1. The sentence sits in a paragraph about all three reports, but its list is brd-prebrd only, and some sdd and lld optional ripples were applied: the sdd README "and the fixes confirmed" (`step7-triage/sdd.md:226`), the sdd "starts with application check rows" line (`:74`), the lld §22 Wishlist row (`step7-triage/lld.md:91`), the lld step 9 application-check clause (`:295`).
2. The brd-prebrd list misses two optional items that were not taken: `scripts/discover_cells.py:31` (`data_type == "f"`) and a formula-count pin test (`step7-triage/brd-prebrd.md:352-354`).
3. "the three Kinds in the skeleton": the skeleton comment also states the Source and Blocks rules.

- Old: `brd H2 B (two chunk 14 verification checks: the TD fields, and one question per row with every marker and open item covered; the three Kinds in the skeleton). The optional extras (the H1 sanity-check line, a `check_todo.py` checker, the pre-BRD chunk 24 tier label, the workbook's stray `EFAS!H7` formula, an exporter edge case) were not taken.`
- New: `brd H2 B (two chunk 14 verification checks: the TD fields, and one question per row with every marker and open item covered; the three Kinds and the Source and Blocks rules in the skeleton comment). The brd-prebrd report's optional extras were not taken: the H1 sanity-check line, a `check_todo.py` checker, the `discover_cells.py` formula test and a formula-count test, the pre-BRD chunk 24 tier label, the workbook's stray `EFAS!H7` formula, and an exporter edge case. Some optional ripples of the sdd and lld reports were applied with their items (for example the sdd README "fixes confirmed" and the lld §22 Wishlist row); their optional checker tests and checks were not added.`

### RC2 (M). UNIFIER-ENHANCEMENTS.md:30: "No skill file has changed since 86cab74"

`git diff --stat 86cab74 548bf5d` on the five skill folders: 102 files changed; step 7 changes 29 more in the working tree. The edited Status and Git lines next to it say so.

- Old: `No skill file has changed since 86cab74.`
- New: `Skill files last changed in step 6 (merged into main as 548bf5d); step 7 changes them on `fix/unifier-live-findings`.`

### RC3 (M). step6-plan.md:4 contradicts the edited FOLLOW-UP row

- Old: `Nothing of step 6 is committed yet: every change is in the working tree.`
- New: `Step 6 is committed in seven commits, merged into main as 548bf5d, and pushed (FOLLOW-UP row).`

### RC4 (M). step6-plan.md:24, R row

- Old: `the close-out review and the commits are in the FOLLOW-UP row; the Band check waits for the user.`
- New: `the close-out review, the commits, the merge and the Band check are in the FOLLOW-UP row.`

### RC5 (S, pre-existing). step6-plan.md:51, "Current handback"

It says "The after-Codex prompt has not run" and that the review copy "is not the regression baseline"; the stage rows VERIFY to FOLLOW-UP and SAVE say otherwise. Label it historical rather than rewrite it.

- Old: `**Current handback (2026-10-07).** The Codex sequence is finished.`
- New: `**Codex FINAL handback (2026-10-07; historical, superseded by the stage rows VERIFY to FOLLOW-UP).** The Codex sequence is finished.`

### RC6 (M). live-findings.md:47, skeleton range

`brd-unifier/chunks/14-todo.md:80-84` covers the header, the separator and TD-01 to TD-03; the third Kind, `Pending decision` (TD-04), is line 85, at HEAD and now.

- Old: `` `brd-unifier/chunks/14-todo.md:80-84` ``
- New: `` `brd-unifier/chunks/14-todo.md:80-85` ``

### RC7 (S). live-findings.md:3, :49, :54 still say "not applied"

Step 7 applies every skill item listed here; the record says so in UNIFIER-ENHANCEMENTS.md § Step 7, and this file's line references were maintained in the same round. Recommended at commit time (the alternative is to keep the file frozen as step 6 input and rely on UNIFIER-ENHANCEMENTS):

- `:3`. Old: `Nothing below is applied.` New: `Nothing below was applied in step 6; step 7 applies items 1 to 16, H1, H2 and N1 to N7 (UNIFIER-ENHANCEMENTS.md § Step 7; triage in `../step7-triage/`).`
- `:49`. Old: `Hardening candidates for the next round (not applied):` New: `Hardening candidates for the next round (applied in step 7):`
- `:54`. Old: `(next round, not applied; the README itself was corrected)` New: `(applied in step 7; the README itself was corrected in step 6)`

---

## Checked with no finding

- N1 (eight summary lines plus `chunking.md:43-44`): grammar fine; all agree with the rule home `delivery-chunks.md:231` and `:292`, the checks at `:501` and `:503`, and root README:273-274. `chunking.md`'s en dash in the line 43 size cell is untouched. `chunks/15-implementation.md:38` ("Every use case ... appears here") is the Use-case coverage table and stays right.
- H2 placement: the two bullets sit in the "Whenever chunk 14 is written or updated" block that C10 runs (`delivery-chunks.md:180`, `:483`; `SKILL.md:260`); text matches Option B verbatim; nothing else in brd-unifier restates the TD fields (SKILL.md 8a item 1 stays true; chunk 14 is never in TEMPLATE-COMBINED).
- N2: command signature, quoting and raw strings correct (BP6 aside). No hardcoded user path left in the five skills.
- N3: workbook read with openpyxl, never saved (MD5 b45eb4a4... unchanged): 77 cells of type formula (Market Sizing 7, Porter's 2, EFAS 9, `IFAS ` 8, RICE 4, VRIO 13, Executive Summary 34); 7 text cells starting with `=` in column C of `Market Sizing & analysis` (C13, C15, C20, C22, C25, C27, C29); 17 of the 77 in the READ-ONLY samples. The sheet name matches. `discover_cells.py` still counts 84 (optional fix not taken; see RC1).
- N4: no `MASTER:` line left under `pre-brd-unifier/`; the file ends with `- [Note 1]` and one CRLF, like the other skeletons; root README:49 already says the pre-BRD has no footer.
- N5: `frameworks.md` § Tier-5 propagation map resolves (heading "Tier-5 propagation map (keep signals coherent)"; prefix citation is the house style, as `delivery-chunks.md` § The delivery gate). The signal sources match `frameworks.md:28-34` and `chunks/22:14-20`. Root README:225 already right.
- `UNIFIER-ENHANCEMENTS.md` Status rows 6 and 7, the Git line, the close-out paragraph, the R sub-step row, the step 7 section (apart from RC1), the Done-when row, and the three new log rows: consistent with git and the diff. The edited 2026-10-07 log row (merge clause removed, new merge row added) reads correctly.

## Seen, outside this scope (for the other checks)

- `lld-unifier/sdd-to-lld.md` row 18 (§23): it does not say what a `Decided - pending application` SDD item (decided, not yet applied) does in the LLD.
- `sdd-unifier/brd-to-sdd.md:253` describes BRD chunk 15 as "Business-level delivery order of the use cases"; harmless, but it omits the no-UC `Requirement delivery` tasks.

## Not verified

- The 45 tests and the baseline checker set: not run (pytest could write caches; not needed for a text check).
- The "249 skill references" figure (an intermediate state). `check_refs.py` covers lld-unifier and sdd-unifier references only; the brd and pre-brd cross-references above were checked by hand.
- The Band check result and the six Band files (outside the repo; user-run).
- A full export end to end, and the export line in cmd.exe or on claude.ai (I tested only the import line, in Git Bash, both path forms).
- Whether H1 and H2 change a fresh S3 run: needs the planned S3 rerun.

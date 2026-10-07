# Triage: brd-unifier H1, H2, N1 and pre-brd-unifier N2 to N5

Source: `_fixtures/notes/step6-handoffs/live-findings.md:42-60`, section "Found in the close-out review (Claude Code, 2026-10-07)". Skills read from disk at HEAD 548bf5d.

Read-only run. No repository file was created, edited, moved, or deleted, and no state-changing git command ran. Scratch work is in `scratchpad/s7/triage/work/`: the count scripts (`count_formulas.py`, `dump_types.py`, `todo_fields.py`), a copy of the workbook from 9afe0cb (made with `git show`), and two test exports.

## Summary

| ID | Class | One-line fix or recommended option |
|---|---|---|
| H1 | S | Worth it. Rewrite the 06-12 row at `brd-unifier/sow-transformation.md:179`: every regulatory point in 08 PESTLE, in any row, becomes a numbered 02 constraint, one per obligation. Name 02 Assumptions / Constraints and 10 in its BRD home cell. Optional: one sanity-check line after `:252`. |
| H2 | D | Worth it, as a check rather than more rule text. Recommended Option B: two bullets in the "Whenever chunk 14 is written or updated" block of `delivery-chunks.md` § Verification before presenting (the list C10 runs at every write). They check Kind, Source and Blocks, one question per row, and marker coverage. Add one line to the `chunks/14-todo.md:78` comment naming the three Kinds. |
| N1 | M | `brd-unifier/chunking.md:43-44`: add the stated capabilities with no use case to the chunk 15 and 16 descriptions. The same omission sits in eight other summary lines. |
| N2 | S | `pre-brd-unifier/xlsx-export.md:10-13`: replace the hardcoded path with `<skill-folder>`, use absolute forward-slash paths, state the Python and `openpyxl` need, and fence the line as `text`. Tested in Git Bash and PowerShell 5.1. |
| N3 | S | Not stale. 77 counts formula cells (openpyxl `data_type == "f"`); 84 adds seven text notes that start with `=`. State the basis at `xlsx-export.md:6` and `pre-brd-unifier/README.md:32`. Optional: `scripts/discover_cells.py:31` uses `data_type`. |
| N4 | M | Delete the footer and the blank line before it at `pre-brd-unifier/chunks/24-open-items-and-assumptions-log.md:74-75`. |
| N5 | S | Rewrite principle 7 at `pre-brd-unifier/SKILL.md:68`: 22 scores its five signals from tier 2 only (07, 09, 10, 11), its conditions and 23 may cite any tier, and tier 5 never contradicts 01-21. Same fix at `research-orchestration.md:35` and `pre-brd-unifier/README.md:31`. |

Counts: M 2 (N1, N4), S 4 (H1, N2, N3, N5), D 1 (H2).

## Line endings of the files named in this report

`git config core.autocrlf` is `true`, the index holds LF, and `.gitattributes` sets `_fixtures/** text eol=lf`. Working-tree counts with `open(p,'rb').read().count(b'\r')`:

| File | CR | LF | Ending |
|---|---|---|---|
| brd-unifier/sow-transformation.md | 254 | 254 | CRLF |
| brd-unifier/delivery-chunks.md | 509 | 509 | CRLF |
| brd-unifier/chunks/14-todo.md | 244 | 244 | CRLF |
| brd-unifier/chunking.md | 180 | 180 | CRLF. It holds 11 en dashes; one is in line 43, outside the edited span. |
| brd-unifier/chunks/15-implementation.md | 111 | 111 | CRLF |
| brd-unifier/chunks/16-uat-bat-test-cases.md | 136 | 136 | CRLF |
| brd-unifier/chunks/brd-master.md | 181 | 181 | CRLF |
| brd-unifier/TEMPLATE-COMBINED.md | 580 | 580 | CRLF |
| pre-brd-unifier/xlsx-export.md | 57 | 57 | CRLF |
| pre-brd-unifier/README.md | 0 | 81 | LF |
| pre-brd-unifier/SKILL.md | 125 | 125 | CRLF |
| pre-brd-unifier/research-orchestration.md | 40 | 40 | CRLF |
| pre-brd-unifier/chunks/24-open-items-and-assumptions-log.md | 75 | 75 | CRLF |
| pre-brd-unifier/scripts/discover_cells.py | 38 | 38 | CRLF |
| pre-brd-unifier/scripts/tests/test_cell_map.py | 61 | 61 | CRLF |
| _fixtures/notes/step6-handoffs/live-findings.md | 0 | 62 | LF |

None of these files holds an em dash. All proposed text below is ASCII.

---

## H1. Regulatory points from any PESTLE row become 02 constraints (brd-unifier)

### 1. Verify

Reproduces. The rule:

- `brd-unifier/sow-transformation.md:179`, the 06-12 row, How cell: "A legal or regulatory PESTLE factor becomes a 02 constraint and, where it sets a quality, an NFR candidate in 10." Its BRD home cell names "01 Background and Context; 02 Facts and Challenges", not 02 Assumptions / Constraints.
- In the pre-BRD template a "factor" is a row: `pre-brd-unifier/chunks/08-pestle-analysis.md:12` "| Factor | What to assess | Answer |". Regulations are assessed in three rows: Political (`:14`, "Government policies, regulations, ..."), Legal (`:18`, "... health and safety regulations, consumer laws, industry rules"), Environmental (`:19`, "... environmental regulations ..."). So "a legal ... PESTLE factor" reads as "the Legal row".

The miss:

- Source: `_fixtures/scenarios/pre-brd-to-brd/run/pre-brd-clinic-reminders/08-pestle-analysis.md:15`, Political (4): "Implication: send SMS only through an NTRA-licensed aggregator and host in Egypt only with a licensed provider."
- Rerun BRD, `rerun-2026-10-07/brd-clinic-reminders/02-glossary-assumptions-facts.md:34-40`: five assumptions or constraints, none on hosting. The SMS half arrives only as a Dependency (`02:63`, "NTRA-licensed SMS aggregator not selected", sourced to "15 O1 KR3") and an integration note (`08:16`). `12:59` parks the hosting text from pre-BRD 01 and cites it to "08 ..., Legal". The run never mapped Political (4) itself.
- The step 3 BRD missed the same half. `run/brd-clinic-reminders/02-glossary-assumptions-facts.md:56-67` has constraint 9, "Only an NTRA-licensed provider may send bulk SMS", but no hosting constraint. `_fixtures/notes/step3-findings.md:62` records how that run read the rule: "PESTLE legal -> 02 constraints and NFR-05/06/08".

Two independent runs dropped the same half. The wording invites the miss, so this is more than a run slip.

### 2. Class: S

One mapping row is clarified. No gate, ID, file layout, pass count, or security posture changes. The right reading is clear: a regulatory point is known by its content, not by its row.

Worth it: yes. One table cell fixes the root cause.

H1 says "one per implication". This report uses "one per obligation" instead. The pre-BRD fixes no "Implication:" format: `research-orchestration.md:11` asks only for "a sourced rationale", and `chunks/08` has a free Answer cell. "Implication" is a run convention.

Where it belongs: the mapping row. Not the BRD reviewer brief: `brd-unifier/SKILL.md:230` already lists "regulatory or compliance hooks not addressed", and adding pre-BRD detail there would change a review pass.

### 3. Fix

File `brd-unifier/sow-transformation.md` (CRLF). Replace line 179.

Old:

```
| 06-12 Market and competition (Market Comparison, Market Sizing, PESTLE, Porter's Five Forces, EFAS, IFAS, SWOT) | 01 Background and Context; 02 Facts and Challenges | One short paragraph of market context plus a link; the figures stay in the pre-BRD. A legal or regulatory PESTLE factor becomes a 02 constraint and, where it sets a quality, an NFR candidate in 10. |
```

New:

```
| 06-12 Market and competition (Market Comparison, Market Sizing, PESTLE, Porter's Five Forces, EFAS, IFAS, SWOT) | 01 Background and Context; 02 Assumptions / Constraints, Facts and Challenges; 10 NFRs (candidates) | One short paragraph of market context plus a link; the figures stay in the pre-BRD. Every regulatory point in 08 PESTLE becomes a numbered 02 constraint, whichever row holds it: Political, Technological, Legal, or Environmental. A regulatory point is a law, a licence, or a rule of a regulator, an operator, or a platform that the product must follow. A point with several obligations gives one constraint per obligation (licensed message sending and licensed hosting, for example). A constraint that sets a quality is also an NFR candidate in 10. |
```

Optional second edit, same file. Insert after line 252 (the "No invented numbers" item of § Sanity checks before completion):

```
- [ ] pre-BRD source: every regulatory point in 08 PESTLE, in any row, is a numbered 02 constraint, one per obligation.
```

It adds a self-check line, not a pass. If you want to decide every new check line together, take it with H2.

### 4. Ripple

- No other file restates the rule. A grep for "PESTLE" and "regulat" over the five skills, both READMEs, and the checkers finds only this row, the signal list at `brd-unifier/transform-detection.md:53`, the reviewer brief at `brd-unifier/SKILL.md:230`, and the NFR-04 example at `chunks/10-nfrs.md:20` and `TEMPLATE-COMBINED.md:355`. None needs a change.
- Root `README.md:240` says only that brd-unifier maps each framework chunk to its home: no change.
- `brd-unifier/chunks/02-glossary-assumptions-facts.md:21-26` and `TEMPLATE-COMBINED.md:88-93` hold generic constraint placeholders: no change.
- Checkers: none reads pre-BRD 08 or BRD 02 constraints.
- The saved rerun stays as run evidence (`live-findings.md:44`).

### 5. Proof

- Detection, cheap: give a cleared-context, read-only agent the patched row, pre-BRD 08, and the saved rerun's 02, 08, 10 and 12. Expected: it reports the missing hosting constraint, and the SMS rule missing as a 02 constraint. The step 3 BRD should be flagged the same way.
- Prevention: one fresh S3 BRD run (`chunks whole` from the saved pre-BRD) into a new `rerun-<date>/` folder, shared with H2. It passes when 02 holds a numbered constraint for each obligation of 08 Political (4): licensed SMS sending, and hosting in Egypt only with a licensed provider. Check the other regulatory points too: Technological (2) (sender registration, medicine content) and Legal (1) to (5).

---

## H2. Check the to-do register fields at every write of chunk 14 (brd-unifier)

### 1. Verify

Reproduces in the rerun. The rules exist and are clear:

- `delivery-chunks.md:141`: "One row per **distinct question** ... it is one row whose Source lists every location ... The row links to the source and states the decision needed."
- `delivery-chunks.md:145-149`: the Kind table has three values, "Open question", "Assumption to validate", and "Pending decision". `:147` cites markers as "(cite chunk + section or UC ID)".
- `delivery-chunks.md:159`: "The `Blocks` column names use cases, NFRs, and chunk sections".
- The skeleton `chunks/14-todo.md:80-85` shows the three Kinds and anchored Sources (`[06a / UC-02 step 4]`, `[02 / Assumption 4]`).
- Line reference: `live-findings.md:47` cites `:155` for the rules. `:155` is the P3 priority line; the Blocks rule is `:159`.

What checks it today: C10 (`delivery-chunks.md:180`, "Chunk 14 at every write (the § Verification before presenting list)"). It runs at `brd-unifier/SKILL.md:260` (step 8a item 5) and per `delivery-chunks.md:483`. The list it runs, `:485-494`, has no item on Kind, Source, or Blocks. Nothing catches a register that ignores them.

Rerun evidence (`rerun-2026-10-07/brd-clinic-reminders/14-todo.md:60-113`, 54 rows): Kind "Owner clarification" in 54 of 54 rows. Blocks "Linked requirement, objective or acceptance outcome" in 54 of 54. A Source with a section anchor in 0 of 54. TD-16 (`:75`) merges the WhatsApp sender model with the residency hand-off and words it as an SDD hand-off. The marker at `02:62` ("Founders to confirm incorporation and the sender model") has no row that states the incorporation question.

The step 3 register met the rules: 71 rows, Kinds 62 / 4 / 5 within the three values, and anchored Sources (`run/brd-clinic-reminders/14-todo.md:78-81`).

### 2. Class: D

It changes what a check pass covers (C10), and it has more than one reasonable scope.

Worth it: yes. The rules are not ambiguous, so more rule text would not help; only a check at write time catches the next miss. Generic Blocks cells and chunk-only Sources break the gate trail: the product manager cannot see what each item blocks, and the grill-me prompt cannot cite the place.

Where it belongs: the C10 list. Chunk 14 step 1 already holds the rules the run skipped.

### 3. Options

- **Option A.** Add one bullet with the three field checks (H2 as written) to the first block of `delivery-chunks.md` § Verification before presenting. Effect: it catches the three field defects at every write of 14. Failures become C10 `CF-NN` rows and mechanical corrections. Editing chunk 14 is not a content change (`delivery-chunks.md:437`: a content change is "a change to what chunks 00-13 say"), so nothing bumps. It misses TD-16's merge and the lost incorporation question: both pass the field checks once the Source cells are fixed.
- **Option B.** Option A, plus a coverage bullet (one distinct question per row; every marker and every open OI reaches a row that states it), plus one line in the skeleton comment naming the three Kinds and the anchors. Effect: it catches all five S3-2 symptoms. Cost: a longer C10 on a big register (54 rows here; the step 3 BRD had 143 markers), and "distinct" needs judgment, which `:141` already asks for.
- **Option C.** No check. Restate the three values in the skeleton comment and in § Step 1. Effect: no extra check work, but it relies on the author following text it already skipped. Nothing catches the next miss.

**Recommended: Option B.** The coverage bullet is the only one that catches the merge and the lost question. The skeleton line costs nothing and puts the values where the author copies the table.

Text for Option B. File `brd-unifier/delivery-chunks.md` (CRLF). Insert after line 492 ("- [ ] Every `CF-NN` has traceable references and a disposition; ..."):

```
- [ ] Every `TD-NN` row has a Kind from § Step 1: `Open question`, `Assumption to validate`, or `Pending decision`. Its Source names the chunk and the exact place: a section, a UC step or ID, an `OI-NN`, an assumption, or a dependency, never the chunk alone. Its Blocks cell names the use cases, NFRs, or chunk sections it blocks.
- [ ] Each `TD-NN` row holds one distinct question, or the proposals of one use case or section (§ Step 1). Every inline marker in chunks 00-12, and every `OI-NN` in chunk 13 that is not closed, is in the Source of a row that states its question.
```

Option A is the first bullet alone.

File `brd-unifier/chunks/14-todo.md` (CRLF), line 78, inside the comment:

- Old: `Sorted P1 first. The row links to the source;`
- New: `Sorted P1 first. Kind is one of: Open question, Assumption to validate, Pending decision. Source names the chunk and the exact place (a section, a UC step, an OI-NN, an assumption, or a dependency). Blocks names the use cases, NFRs, or chunk sections the row blocks. The row links to the source;`

### 4. Ripple

- `delivery-chunks.md:180` (the C10 row) and `chunks/14-todo.md:94` and `:99` (C10 in the step 2 block) point at the list: no change.
- `brd-unifier/SKILL.md:256` (step 8a item 1) already says "each linked to its source chunk and identifier", and `:260` runs the block: no change.
- `brd-unifier/README.md:65` and root `README.md:271` describe chunk 14 at a level that stays true: no change.
- `TEMPLATE-COMBINED.md`: chunk 14 is never part of the combined file: no change.
- No other skill defines TD rows. A grep for the Kind values finds only `delivery-chunks.md:147-149` and the skeleton.
- Checkers: none reads `14-todo.md`. See the optional tool below.
- Notes: correct `live-findings.md:47` (`:155` to `:159`) when the item closes.

### 5. Proof

- Detection, cheap: a cleared-context, read-only agent runs the new first block over the saved rerun (`14-todo.md` plus chunks 00-13). Expected: Kind, Source, and Blocks findings for TD-01 to TD-54, a finding on TD-16, and one on the `02:62` incorporation marker. Over the step 3 register: no Kind, Source, or Blocks finding.
- Prevention: the fresh S3 BRD run shared with H1.
- Optional deterministic tool: a `_fixtures/checkers/check_todo.py BRD_DIR` that flags a Kind outside the three values, a Source with neither ` / ` nor `#` in it, and a Blocks cell with no UC, NFR, BO, or chunk reference. A 40-line version of these heuristics (`scratchpad/s7/triage/work/todo_fields.py`) already gives 54 / 54 / 54 failures on the rerun and 0 / 0 / 1 on step 3. The one step 3 hit, TD-67 ("Owner of every row here; Changes Log approval"), names a section without its chunk number: a heuristic limit to tune. If added, give it a row in `_fixtures/README.md` (How to run) and a test in `_fixtures/checkers/tests/`.

---

## N1. Chunk 15 and 16 descriptions leave out capabilities with no use case (brd-unifier)

### 1. Verify

Reproduces.

- `brd-unifier/chunking.md:43`: "**Implementation Plan** (delivery chunk) - every `06*` use case consolidated into dependency-ordered tasks (`TASK-NN`) ..."
- `brd-unifier/chunking.md:44`: "**UAT/BAT Test Cases** (delivery chunk) - business-level acceptance cases traced to use cases, NFRs, and tasks; ..."
- The rule: `delivery-chunks.md:231`, "`Requirement delivery` tasks cover a stated report, integration or other section capability without a UC ... Do not mint a UC to satisfy task coverage." `:292`, "`Related UC` names the UC ..., an NFR, or a linked owning requirement section for a no-UC capability (`09 / Daily report`)." Also `:499` and `:501`.
- Root `README.md:272-273` was already corrected: "Use cases, and stated report or other section capabilities with no use case, ..." and "traced to use cases (or the owning requirement section when there is none), NFRs, and tasks".

### 2. Class: M

Two stale summaries; the rule home is clear.

### 3. Fix

File `brd-unifier/chunking.md` (CRLF). Replace the substrings only. Line 43 also holds an en dash in its size cell; leave that cell untouched.

Line 43, old:

```
every `06*` use case consolidated into dependency-ordered tasks (`TASK-NN`)
```

Line 43, new:

```
every `06*` use case, and every stated report, integration or other section capability with no use case, consolidated into dependency-ordered tasks (`TASK-NN`)
```

Line 44, old:

```
business-level acceptance cases traced to use cases, NFRs, and tasks;
```

Line 44, new:

```
business-level acceptance cases traced to use cases (or the owning requirement section when there is none), NFRs, and tasks;
```

### 4. Ripple

The same omission sits in other summary lines. Change them in the same pass, or the next audit finds them. All files are CRLF.

1. `brd-unifier/delivery-chunks.md:16`. Old: ``Dependency-ordered implementation plan consolidating every `06*` use case`` New: ``Dependency-ordered implementation plan consolidating every `06*` use case and every stated section capability with no use case``
2. `brd-unifier/delivery-chunks.md:225`. Old: ``One actionable plan consolidating every `06*` use case, written so`` New: ``One actionable plan consolidating every `06*` use case and every stated section capability with no use case, written so``
3. `brd-unifier/chunks/15-implementation.md:11` (PURPOSE). Old: `consolidates every 06* use case into implementation tasks` New: `consolidates every 06* use case, and every stated section capability with no use case, into implementation tasks`
4. `brd-unifier/chunks/15-implementation.md:18` ("What this is"). Old: `Every use case in chunks 06* turned into scoped tasks` New: `Every use case in chunks 06*, and every stated report, integration or other section capability with no use case, turned into scoped tasks`
5. `brd-unifier/TEMPLATE-COMBINED.md:488`. Old: `Every use case turned into scoped tasks` New: `Every use case, and every stated report, integration or other section capability with no use case, turned into scoped tasks`
6. `brd-unifier/chunks/16-uat-bat-test-cases.md:12` (PURPOSE). Old: `derived from the BRD use cases (UC-01..UC-NN), NFRs (NFR-01..NFR-NN), and the UI/UX expectations (chunk 11).` New: `derived from the BRD use cases (UC-01..UC-NN), the owning sections of capabilities with no use case (a chunk 09 report, for example), NFRs (NFR-01..NFR-NN), and the UI/UX expectations (chunk 11).`
7. `brd-unifier/chunks/brd-master.md:160`. Old: `dependency-ordered implementation tasks (from 06a+)` New: `dependency-ordered implementation tasks (from 06a+ and capabilities with no use case)`
8. `brd-unifier/chunks/brd-master.md:161`. Old: `UAT/BAT test cases traced to use cases, NFRs, tasks` New: `UAT/BAT test cases traced to use cases or owning sections, NFRs, tasks`

Already right, no change: `delivery-chunks.md:17` ("traced to use cases, requirements, and tasks"), `chunks/16-uat-bat-test-cases.md:29`, `TEMPLATE-COMBINED.md:520` and `:534`, root `README.md:272-273`. Items 4 and 5 are template text that lands in new BRDs; an existing BRD changes only at its next refresh of 15. Checkers: none.

### 5. Proof

None needed: text only, with no link, ID, or anchor change. Reread the 15 and 16 rows of `chunking.md` against `delivery-chunks.md:229-231` and `:292`.

---

## N2. Hardcoded user path in the export command (pre-brd-unifier)

### 1. Verify

Reproduces. `pre-brd-unifier/xlsx-export.md:12-14`:

````
```powershell
python -c "import sys,json; sys.path.insert(0,r'C:\Users\negat\.claude\skills\pre-brd-unifier\scripts'); import export_xlsx as ex; ex.export(json.load(open(r'<payload.json>',encoding='utf-8')), r'<dst>\PRE-BRD-<ProjectName>-v1.1.xlsx')"
```
````

- It works only for this user on this machine. It is the only hardcoded user path in the five skills (grep for `C:\Users`, `C:/Users`, `negat`, `sys.path`).
- `pre-brd-unifier/SKILL.md:35`: "Paths in this file are relative to the skill folder." `scripts/export_xlsx.py:17-19` already finds the workbook and cell map from its own location, so only the import path needs the skill folder.
- `export_xlsx.py` has no `__main__` block, so the command has to stay `python -c`.
- Root `README.md:501` and `:520` state the Python and `openpyxl` need; the skill itself does not.

### 2. Class: S

One clear answer: a placeholder for the skill folder, plus absolute paths. Rejected alternatives: `cd` into the skill folder and import `scripts` relatively (a relative `<dst>` would then write into the skill folder); a new CLI in `export_xlsx.py` (new code and tests for a doc problem).

### 3. Fix

File `pre-brd-unifier/xlsx-export.md` (CRLF). Lines 10 and 12-13 change; line 11 stays blank.

Old (lines 10-14):

````
2. Run the engine:

```powershell
python -c "import sys,json; sys.path.insert(0,r'C:\Users\negat\.claude\skills\pre-brd-unifier\scripts'); import export_xlsx as ex; ex.export(json.load(open(r'<payload.json>',encoding='utf-8')), r'<dst>\PRE-BRD-<ProjectName>-v1.1.xlsx')"
```
````

New:

````
2. Run the engine. It needs Python 3 with `openpyxl`. Replace `<skill-folder>` with the absolute path of the folder that holds this file. Give `<payload.json>` and `<dst>` (the output folder) as absolute paths too. The same line works in PowerShell and in bash:

```text
python -c "import sys,json; sys.path.insert(0,r'<skill-folder>/scripts'); import export_xlsx as ex; ex.export(json.load(open(r'<payload.json>',encoding='utf-8')), r'<dst>/PRE-BRD-<ProjectName>-v1.1.xlsx')"
```
````

The raw strings stay, so a filled-in Windows path with backslashes still works.

### 4. Ripple

- Root `README.md:236` names `scripts/export_xlsx.py` relative to the skill: no change. `README.md:501` and `:520` already state the `openpyxl` need.
- `pre-brd-unifier/README.md:48` and `:61` point to `xlsx-export.md`: no change.
- Exporter and tests: no change. The tests import through `scripts/tests/conftest.py:9`, which is already relative.
- Checkers: none.
- Outside the repo: the Band role file `C:\Users\negat\Downloads\agent-product-strategist-pre-brd-unifier.md:45` mentions the export and `openpyxl`, but not the command (checked with grep): no change.

### 5. Proof

Done for the proposed form. From the scratchpad, not the skill folder, I ran it with `<skill-folder>` = `C:/Users/negat/.claude/skills/pre-brd-unifier`, absolute forward-slash paths, the payload `{"control_panel": true, "sheets": {}}`, and `python -B` (so no `__pycache__` was written). The export succeeded in Git Bash and in PowerShell 5.1: two 130,998-byte workbooks in the scratchpad. The reference workbook's MD5 was the same before and after.

After the edit, run the documented line once from a non-skill folder. No fixture rerun or exporter test is needed.

---

## N3. "77 live formulas": the counting basis (pre-brd-unifier)

### 1. Verify

Counted read-only with `openpyxl.load_workbook(path, read_only=True)`, never saved. The file's MD5 (`b45eb4a4...`) was the same before and after.

- Cells whose type is formula (`data_type == "f"`): **77**. Per sheet: Market Sizing & analysis 7, Porter's Five Forces 2, EFAS 9, `IFAS ` 8, RICE Framework 4, VRIO 13, Executive Summary 34.
- Raw XML cross-check: 77 `<f>` elements (64 with formula text, 13 shared-formula children).
- Strings that start with `=`: **84** = 77 formulas + 7 text cells (`data_type == "s"`) in column C of `Market Sizing & analysis`: C13 ("= Global × region share"), C15, C20, C22, C25, C27, C29. They mirror the seven `= ...` notes in `chunks/07-market-sizing-analysis.md:34-56`. The 84 comes from the prefix test, which `scripts/discover_cells.py:31` and `scripts/tests/test_cell_map.py:23-25` also use.
- 17 of the 77 sit in READ-ONLY samples: RICE E8:G8, EFAS F13:F15, IFAS F12:F15, Porter's D18, VRIO F14:F19.
- History: the workbook at 9afe0cb had the same 77 formula cells plus 4 `=` notes. Its prefix count was 81, the number the doc carried then. Step 6 (c830fd6) changed the doc to 77 and added three notes. `_fixtures/notes/step6-plan.md:95` records: "'81 live formulas' was wrong before step 6; the workbook has 77".
- Export: the N2 test export keeps 77 formula cells and leaves the seven notes as text, so "preserved" holds.

Verdict: the number is not stale. It counts formula cells, READ-ONLY samples included. Only the basis is unclear.

### 2. Class: S

A clarification. No gate or behaviour changes.

### 3. Fix

File `pre-brd-unifier/xlsx-export.md` (CRLF), line 6.

Old:

```
The workbook's 77 live formulas, READ-ONLY sample columns, Calibri 11 styling, dark-blue header bands, and Executive Summary control panel are preserved.
```

New:

```
The workbook's formulas, READ-ONLY sample columns, Calibri 11 styling, dark-blue header bands, and Executive Summary control panel are preserved. It holds 77 formula cells, the READ-ONLY samples included. The seven `= ...` notes in column C of `Market Sizing & analysis` describe a formula: they are text, not formulas.
```

The rest of line 6 ("Writable cells are whitelisted ...") stays.

File `pre-brd-unifier/README.md` (LF), line 32.

- Old: `(styling, sample columns, 77 live formulas)`
- New: `(styling, sample columns, and its 77 formula cells)`

### 4. Ripple

- Root `README.md:236` says "live formulas" with no number: no change.
- Optional, so the repo's own tool agrees with the doc: `pre-brd-unifier/scripts/discover_cells.py:31` (CRLF). Old: `is_formula = isinstance(c.value, str) and c.value.startswith("=")` New: `is_formula = c.data_type == "f"`. It then prints 77 FORMULA rows instead of 84.
- Leave `scripts/tests/test_cell_map.py:23-25` as is. The prefix test is the stricter guard for answer cells.
- Optional pin in the same test file: a test that counts `data_type == "f"` cells in the reference workbook and expects 77, so a workbook change forces a doc update.

### 5. Proof

The counts above (`count_formulas.py` and `dump_types.py` in the scratchpad). If `discover_cells.py` or a test changes, run `python -B -m pytest -p no:cacheprovider pre-brd-unifier/scripts/tests`. No fixture rerun.

---

## N4. Navigation footer in the pre-BRD chunk 24 skeleton (pre-brd-unifier)

### 1. Verify

Reproduces.

- `pre-brd-unifier/chunks/24-open-items-and-assumptions-log.md:75`: `<!-- MASTER: 00-pre-brd-master.md | PREV: 23-investor-assessment.md | NEXT: none -->`. It is the only `MASTER:` line under `pre-brd-unifier/` (grep). The other 24 skeleton files end without a footer.
- Root `README.md:49`: "The pre-BRD instead uses a `PRE-BRD CHUNK:` comment block with `TITLE:`, `TIER:`, `PROJECT:`, and `PART OF:`, and no navigation footer."
- `pre-brd-unifier/modes.md` defines no footer. Its Combined to Chunks rule prepends only the comment block, so a round trip drops the footer.
- The saved S3 pre-BRD copied it: `run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md`, last line.

### 2. Class: M

A stray line copied from the BRD pattern. The documented layout has no footer.

### 3. Fix

File `pre-brd-unifier/chunks/24-open-items-and-assumptions-log.md` (CRLF). Delete line 74 (blank) and line 75 (the footer), so the file ends with line 73, `- [Note 1]`, and its CRLF.

### 4. Ripple

- Root `README.md:49` already says there is no footer. `pre-brd-unifier/README.md` does not mention one. `modes.md`: no change.
- The saved S3 pre-BRD keeps its copy: it is run evidence and is not corrected by hand.
- Checkers: none parses pre-BRD footers.

### 5. Proof

None needed. After the edit, a grep for `MASTER:` under `pre-brd-unifier/` returns nothing.

---

## N5. Tier 5 "follows from the tier-2/3/4 signals" (pre-brd-unifier)

### 1. Verify

Reproduces; the phrase has been there since the first version.

- `pre-brd-unifier/SKILL.md:68`: "7. **Coherent synthesis.** Tier-5 must follow from the tier-2/3/4 signals; do not contradict them."
- `frameworks.md:28-34` (§ Tier-5 propagation map): all five signals come from tier 2. Market Attractiveness from 07, Problem / Solution Fit from 10, Feasibility from 11, Competitive Risk from 09, Strategic Fit from 10 and 11. `chunks/22-executive-summary-scoreboard.md:14-20` lists the same dependencies, plus the product name from 01 and 02.
- Tiers 3 and 4 feed only chunk 22's conditions (`:55`, "thin competitive moat per VRIO ... per RICE") and the Investor Assessment. The Investor Assessment also uses tier 1: `chunks/23-investor-assessment.md:22-28` cites 01, 02, 03, 04, and 05.
- The same phrase appears at `research-orchestration.md:35` ("keeping it consistent with the tier-2/3/4 signals") and `pre-brd-unifier/README.md:31` ("Tier 5 must follow from the tier 2/3/4 signals").
- Root `README.md:224` is already right: "Chunk 22 scores five signals from Market Sizing (07, ...), Porter's (09), EFAS (10), and IFAS (11)".

Effect: "signals" collides with the five scoreboard signals. It suggests tier 3 and 4 scores feed them, which the fixed mapping forbids. It also leaves out tier 1, which chunk 23 uses.

### 2. Class: S

The wording is aligned with the formula owner (`frameworks.md`). No gate or score changes.

### 3. Fix

File `pre-brd-unifier/SKILL.md` (CRLF), line 68.

Old:

```
7. **Coherent synthesis.** Tier-5 must follow from the tier-2/3/4 signals; do not contradict them.
```

New:

```
7. **Coherent synthesis.** The Scoreboard (22) scores its five signals from tier 2 only: 07, 09, 10, and 11 (`frameworks.md` § Tier-5 propagation map). Its conditions and the Investor Assessment (23) may cite any tier. Tier 5 must not contradict chunks 01-21.
```

### 4. Ripple

- `pre-brd-unifier/research-orchestration.md:35` (CRLF).
  - Old: ``5. Carry the propagation map in `frameworks.md` into the **Tier-5 Executive Summary (22)**, keeping it consistent with the tier-2/3/4 signals.``
  - New: ``5. Carry the propagation map in `frameworks.md` into the **Tier-5 Executive Summary (22)**. Its five signals come from tier 2 only (07, 09, 10, 11), and nothing in 22 may contradict chunks 01-21.``
- `pre-brd-unifier/README.md:31` (LF). The rest of the line stays.
  - Old: `- **Coherent synthesis.** Tier 5 must follow from the tier 2/3/4 signals, and shared facts`
  - New: `- **Coherent synthesis.** The Scoreboard scores its five signals from tier 2 only (07, 09, 10, 11), Tier 5 never contradicts chunks 01-21, and shared facts`
- No change: `frameworks.md`, `chunks/22`, `chunks/23`, root `README.md:224`, and the reviewer brief at `SKILL.md:98` (it asks whether the tiers "feed the Tier-5 scoreboard coherently", which stays true).
- Exporter: the Executive Summary formulas already read only 07, 09, 10, and 11 (and 02 for the product name). Checkers: none.

### 5. Proof

None needed: wording only. Reread principle 7 against `frameworks.md:28-34`.

---

## Seen, not raised (outside these items)

1. `EFAS!H7` holds a stray `=1+1`, in the old and the current workbook; it counts in the 77. The "Total Score" rows (`EFAS!B7`, `IFAS !B6`) have no total formula in column F; the scoreboard sums F2:F6 and F2:F5 itself.
2. `scripts/export_xlsx.py:110-111` rewrites string cells through the `value` setter. A text cell that starts with `=` and holds an em dash would be saved as a formula. No current cell has both: the seven notes hold no em dash.
3. `chunks/24-open-items-and-assumptions-log.md:4` says `TIER: Review Output`, while `chunks/00-pre-brd-master.md:55-60` lists 24 under "Tier 5: Synthesis".
4. `live-findings.md:47` cites `delivery-chunks.md:155` for the Blocks rule. It is `:159`.
5. `pre-brd-unifier/chunks/23-investor-assessment.md` is LF in the working tree, while the other skeletons are CRLF. The index is LF for all of them, so this is harmless.
6. During this run, `UNIFIER-ENHANCEMENTS.md` and `_fixtures/notes/step6-plan.md` changed on disk at 13:31 (git status shows `M`). This triage did not change them.

## Not verified

- The proposed export line in cmd.exe and on claude.ai. I tested it in Git Bash and PowerShell 5.1 on this machine only.
- How long the Option B coverage bullet takes on a large register, and whether a run applies it reliably. That needs the S3 rerun.
- Whether H1's reworded row alone makes a fresh run carry the hosting constraint. That also needs the S3 rerun.

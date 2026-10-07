# CK log: checker follow-ups (step 6, stage CK)

Branch `fix/unifier-fix-round`. Brief: `ck-checkers.md` (same folder). Runs tested: `run-new`, `run-2026-09-30` (0930), `run-2026-10-01-e2e` (e2e), `run-2026-10-01-review` (review), plus scenarios `sdd-version-tracking/after-sdd` (s3c-sdd) and `after-lld` (s3c-lld), `lld-modular-monolith/run` (s3d), `pre-brd-to-brd/run` (clinic), `brd-heading-map` (bhmap).

All checkers run with `python -B`, `PYTHONIOENCODING=utf-8`, `PYTHONHASHSEED=0`. Before outputs: `_fixtures/.ck-tmp/before/`; after outputs: `_fixtures/.ck-tmp/after/` (both deleted at the end with the rest of `.ck-tmp/`).

## Before (2026-10-04, current scripts)

Every checker run on every saved run with the `_fixtures/README.md` § How to run commands; outputs in `.ck-tmp/before/`. Results equal the README Checkers table everywhere:

- `check_trace.py`: run-new 10 problems / 2 notes; 0930 5 / 2; e2e 5 / 2; review 12 / 2.
- `check_sdd.py`: 5 (96 markers), 37 (106), 50 (83), 68 (74).
- `check_e2e.py`: 0, 0, 5, 9 (review: E4 NOT met, gate `Shut - Stale`).
- `check_mermaid.py` (LLD): run-new 1 issue (`03-architecture.md:15 (graph): 35 lines`), 0930/e2e/review 0. On the SDD folders (extra runs the README row also quotes): run-new 1 (`04:54 flowchart, 50 lines`, under §8.3), 0930 4, e2e 6, review 6.
- `check_links.py`, `_linkcheck.py`, `check_lld_trace.py`, `check_uc_links.py`, `check_uc_keys.py`, `list_flags.py`, `diff_runs.py`, `check_refs.py`: as the README and the step 6 triage (`step6-triage/checkers.md`) say.
- Scenarios: clinic `_linkcheck` 303 links 0 bad, `check_mermaid` 3 blocks 0 issues; bhmap rechunked `_linkcheck` 175 links 0 bad; s3c-sdd and s3c-lld as 0930 except `check_sdd` 44; s3d as its README row says.

(Details filled in as each change lands below.)

## 1. `check_mermaid.py`: size cap by kind (S2-3)

What changed: the >34-line guideline now skips exempt blocks by folder kind. Kind is told by the master file name first (`*-sdd-master.md` / `*-lld-master.md`, so `run-old`'s `lld-master.md` also resolves), then by the folder name prefix (`sdd-` / `lld-`); anything else is "other". The exemption lists sit in two module-level dicts (`UNCAPPED_KINDS`, `UNCAPPED_HEADS`): SDD exempts `erDiagram` and any block under an `8.3` or `24.3` heading (the heading the block sits under); LLD exempts `erDiagram` only (lld-unifier/mermaid-diagrams.md, not yet aligned with the SDD); "other" folders (the BRDs) keep the old rule, everything capped.

Before / after per run (LLD folder): run-new 1 / 1 (`03-architecture.md:15 (graph)` is not an ERD), 0930 0 / 0, e2e 0 / 0, review 0 / 0; clinic 0 / 0; s3d 0 / 0. On the SDD folders (the extra runs the README row quotes): run-new 1 / 0 (the 50-line §8.3 flowchart), 0930 4 / 1, e2e 6 / 1, review 6 / 1; in each the one left is the §8.5 sequence diagram in 05 (36, 36, 40 lines), which keeps the cap. s3c-sdd and s3c-lld 4 / 1 the same way. The removed ones are the ERDs (13a/13b/13d) and the §8.3 and §24.3 layered views, exactly S2-3.

Planted tests (`.ck-tmp/plant-mermaid/`, generated folders): SDD folder with a 40-line flowchart under §8.3 (passed), a 40-line ERD (passed), and a 40-line flowchart under §8.4 (caught); LLD folder with a 40-line ERD (passed) and a 40-line flowchart (caught); a BRD-style folder with a 40-line ERD (caught: the "other" rule caps everything, as today).

## 2. `check_e2e.py`: the In-process domain events count (T5)

What changed: the Counts at a Glance expectations gained `"In-process domain events": [len(inproc)]`, inserted after "Distinct published events" so the problem order follows the template's row order (`chunks/19-e2e-system-design.md` Counts table). `inproc` is the script's existing §14.10 parse, so N is checked against the number of §14.10 events, as SKILL.md step 8b.3 now requires.

Before / after per run: identical output on all four chain runs and s3d (0, 0, 5, 9, 0 problems). Both runs with a chunk 19 carry the row (`1 (\`RefundPaid\`)`) and have one §14.10 event, so the new check passes on them.

Planted tests (`.ck-tmp/plant-e2e/`, full copies of the e2e SDD, edits by exact replacement): t5-bad sets the row to 2 while §14.10 has 1 event: caught, `Counts at a Glance In-process domain events: 2 vs 1` (6 problems vs 5). t5-good adds a second §14.10 event (`PointsEarned`, with its §24.5.1 in-process edge) and sets the row to 2: passes, the same 5 known problems as the unplanted run.

## 3. `check_e2e.py`: §24.2 and §24.3 by reference (W2)

What changed: the "every external system in §24.2" check now searches the §8.2 section of chunk 04 as well when §24.2 cites §8.2 (matched by `§ 8.2` / `§8.2` or a `04-*.md#82-` link, the two forms the chunk 19 template's Base view line uses). No check requires §24.2 or §24.3 to redraw §8.2 or §8.3 (none did; nothing removed).

Before / after per run: identical output on all four chain runs and s3d. The saved chunk 19 redraws §24.2 (it predates W2) and names every external system, so the citation branch never fires.

Planted tests: w2-good replaces the §24.2 diagram with the template's citation (`**Base view:** [§8.2 Context Diagram](./04-architecture-style-and-diagrams.md#82-context-diagram).`) and no drawing: passes, the same 5 known problems (the externals are read from §8.2, which names POS Records, CardPay, and MsgHub). w2-bad is w2-good plus POS Records edited out of §8.2: caught, `§24.2 does not show external system POS Records (API-01)` and `(API-04)` (7 problems vs 5).

## 4. `check_trace.py`: Workflow blocks and their routes (L2-6, C6)

What changed:
- 04 `### Workflow: [name]` blocks are parsed (to the next `#{1,3}` heading). Each must carry the line `> **Traceability:** No BRD use case - realises [link ...]`; a use case ID in the heading or the traceability line is flagged, and so is an `@UseCase("UC-NN")` annotation in the block (a prose mention like "carries no `@UseCase`" does not fire). They need no §19.9 index row, and none is expected.
- §17.3 routes: the `None - no BRD screen ([link])` screen cell no longer reads as "no screen and not a platform page". The two Workflow route forms are validated: form (i) reads `None - no BRD screen ([link])` in BOTH BRD columns and carries no route data; form (ii, C6) cites a chunk 14 row as Screen, reads `None - no BRD use case ([link])` as Use cases, and its route data carries the screen only (the existing route-data check enforces that part: `useCases` must be empty).

Before / after per run: run-new 10 / 23, 0930 5 / 15, e2e 5 / 15, review 12 / 22 (notes unchanged, 2). The "1 report route with no screen" problem is gone everywhere (the route is a valid Workflow route). Every other added line is a saved run predating this round's template, not a regression:
- The saved LLDs' Workflow blocks predate the canonical line: run-new has 6 blocks with old wordings ("No BRD use case. Realises ...", "No use case of its own; ..."), 0930/e2e/review share 4 ("Serves [LOYALTY/UC-01] and [UC-02]" also carries two use case IDs; "Shared by the three participation blocks above"; "No BRD use case - serves ..."). The other blocks already read the canonical line and pass.
- The saved `/branch/refund-report` routes read "None - not a BRD use case (...)" in the Use cases cell, the run's own pre-rule wording, so the both-columns form rule reports them once per run.

Planted tests (`.ck-tmp/plant-trace/`, full copies of the e2e run): t4-v1 rewrites the report route to canonical form (i) and its block line to "realises": 15 to 13 problems, the route fully accepted. t4-v2 rewrites it to canonical form (ii) (Screen `[REFUNDS/SCR-01](.../14-todo.md#mockup-coverage)`, Use cases `None - no BRD use case ([link])`, route data `{ screen: 'REFUNDS/SCR-01', useCases: [] }`): 15 to 13, accepted. t4-e1 adds `@UseCase("REFUNDS/UC-04")` to the Payout watchdog block: caught (16). t4-e2 gives the no-screen report route a route-data entry: caught, "a Workflow route carries no route data" (16). t4-e3 is form (ii) with REFUNDS/MK-09, which has no chunk 14 row: caught twice ("not a row of BRD chunk 14 Mockup coverage", "'None - no BRD use case' needs a screen with a chunk 14 row").

## 5. `check_trace.py`: the chunk 14 row wins (L2-10b)

What changed: the §17.3 screen-reference check now treats a screen ID that keys a chunk 14 Mockup coverage row (the fixture BRDs' SCR-01, SCR-02, LP-01, LP-02) exactly like an `MK-NN` row: the link must end `14-todo.md#mockup-coverage`, and the route's use cases must equal the row's (skipped for a Workflow route, whose Use cases cell is legitimately `None - no BRD use case`). An `MK-NN` that is not a row and a screen ID with no row that the BRD text does not carry are flagged as before. Only §17.3 cells are link-checked (the script checks no other place's link targets; see "For the user").

Before / after per run: every run gains 6 problems, one per route row citing a screen-ID-keyed row while linking to the BRD heading (`/refunds/new`, `/refunds`, `/refunds/:refundRequestId`, `/points`, `/points/history`, `/points/history/:movementId`): the saved LLDs predate L2-10b. The messages read `route /X: KEY/ID links to <old target>, not 14-todo.md#mockup-coverage`. The use-cases-equality half passes on all of them (each route's use cases equal the row's).

Planted test: t5-good relinks `/refunds/new`'s SCR-01 to `14-todo.md#mockup-coverage`: that problem goes (15 to 14). The error side is demonstrated by every saved run above.

## 6. `check_sdd.py`: trigger entry points (S2-4f, N-3)

What changed: check 5 parses each 13x chunk's `### Input` table (`| Type | Source | Description |`): rows whose Type mentions "event" or "schedule" contribute their backticked names (Source and Description cells; the runs backtick every trigger name). A §7.3 entry point of the form `Schedule: [name]` or `Event: [EVENT_NAME]` must appear in the Input table of the row's owner 13x (`Event` matches "event" rows, including "In-process domain event"); method-and-path entry points stay checked against the owner's List of APIs, unchanged.

Before / after per run: byte-identical output on all four chain runs (5, 37, 50, 68 problems). No saved §7.3 row has a `Schedule:` or `Event:` entry point; they predate S2-4f.

Planted tests (`.ck-tmp/plant-sdd/`, full copies of the e2e run; check_sdd pointed at the inner SDD): t6-good adds `Event: RefundPaid` and `Schedule: loyalty-purchase-import` to the LOYALTY/UC-02 row: 50 problems, as the unplanted run. The pre-change script flags both (`03 §7.3: entry point Event: RefundPaid not in 13d-service-loyalty.md`, `Schedule: loyalty-purchase-import ...`); they are only in 13d's Input table, never in its List of APIs. t6-bad adds `Event: NOT_AN_EVENT` and `Schedule: not-a-job`: 52 problems, both caught as `... not in the Input table of 13d-service-loyalty.md`.

## 7+8. `check_versions.py` (new): the Chunks: list (F1) and the BRD gated chunk states (F4)

One new script, `check_versions.py DOC_DIR`, holds both checks (the brief allowed that or a separate `check_brd_gate.py`; one script won because both read the same document shape). It works on BRD, SDD, and LLD folders (kind from the master file name, then the folder prefix), reads the Changes Log of chunk 00 (`| Version` table; the LLD's `Date` column is accepted beside `Updated Date`), and takes the LAST row as the newest.

F1: if the newest row has no `Chunks:`, it prints `version check: no \`Chunks:\` list in the newest Changes Log row (vX.X)` and checks nothing (the saved runs predate the lists, so this is not a failure per chunk). With a list: every listed chunk's files must carry the row's version, no unlisted chunk other than the master and 00 may carry it, and the master and 00 must carry it (F1's own sentence; logged here because the brief's bullets name only the first two). A list with no chunk numbers is reported as the combined-document case ("names sections") in a note, not checked. `decision-log.md` is not a chunk and is never version-checked (several runs give it a VERSION header; F1 does not give it one).

F4 (BRD folders only): for each of chunks 15, 16, 17, the state keyword (`Up to date`, `Provisional`, `Stale`, `Locked`) is read in the chunk's status line (`**... status:** ...`, first match), its 14-todo Downstream outputs row, and its master Delivery Chunks State cell; any disagreement, a missing row in an existing table, a chunk file with no status line, or a non-Locked state for a chunk that does not exist is one problem. A missing table is a note (older 14-todo files). The TD number of a `Provisional (TD-NN)` is not compared.

Before / after per run (new script, so "before" is the absence of the check): every saved run reports `no \`Chunks:\` list` with 0 problems (BRDs, SDDs, LLDs of all four chain runs, s3c-sdd, s3c-lld, s3d, clinic). F4: 0 problems everywhere; the review run's BRDs read Stale in all three places of 15 and 16, and chunk 17 reads Locked in its two places everywhere.

Planted tests (`.ck-tmp/plant-versions/`): t7-good gives the e2e SDD's 1.2 row the exact Chunks: list of the chunks at 1.2 (01, 04, 07, 08, 09, 10, 11, 12, 13a-13d, 14, 16, 19): 0 problems. t7-bad1 drops 16 from that list (the brief's "misses a changed chunk"): caught, `Chunks: does not list 16 but 16-operations-runbook.md carries VERSION 1.2`. t7-bad2 adds 03 (at 1.1): caught, `Chunks: lists 03 but 03-users-and-use-cases.md carries VERSION 1.1, not 1.2`. (The first run also flagged an unlisted 00; that exempt-00 bug was fixed and the suite rerun.) t8-bad1 marks the master 15 cell Stale while the status line and the 14 row read Up to date: caught, `chunk 15 state differs: ...`. t8-bad2 marks the 14 row of 16 Locked: caught. t8-good sets all three places of 15 and 16 to Stale: 0 problems.

## After-suite diff (`.ck-tmp/after/` vs `.ck-tmp/before/`, same commands)

Only these outputs differ, each explained by its change above:

| Output | Before | After | Reason |
|---|---|---|---|
| `check_mermaid-sdd--run-new/0930/e2e/review/s3c-sdd/s3c-lld` | 1/4/6/6/4/4 issues | 0/1/1/1/1/1 | change 1 (what is left is the §8.5 sequence, which keeps the cap) |
| `check_trace--run-new` | 10 | 23 | changes 4+5 (run predates the Workflow line forms and L2-10b) |
| `check_trace--0930` | 5 | 15 | changes 4+5 (report route accepted; pre-rule blocks, route cell, links) |
| `check_trace--e2e` | 5 | 15 | the same |
| `check_trace--review` | 12 | 22 | the same, on top of the 7 known "SDD moved past the LLD" problems |
| `check_trace--s3c-sdd`, `--s3c-lld` | 5 | 15 | same class as 0930 |
| `check_trace--s3d` | 0 | 2 | change 4: two pre-rule Workflow blocks (`Member purchase intake (earn)`, `Daily payout reconciliation`) |
| `check_refs` | 239 references, 0 problems | 240 references, 0 problems | the skill folders moved while the em dash agents worked; not investigated, per the brief |

Everything else is byte-identical: `check_links`, `_linkcheck` (LLD, both BRDs, SDD), `check_lld_trace`, `check_sdd` (change 6 adds no problem on any saved run), `check_e2e` (changes 2+3 add none), `check_uc_links`, `check_uc_keys`, `check_mermaid-lld` and the BRD/clinic/bhmap runs, `list_flags`, `diff_runs`. The new `check_versions.py` reports "no `Chunks:` list", 0 problems, and agreeing gate states on every saved run and scenario folder.

`python -B _fixtures/checkers/check_refs.py lld-unifier sdd-unifier` at the end of the run: 240 references checked, 0 problems, Child LLDs columns MATCH (the count was 239 in the before run; an em dash agent's edit added one reference).

## For the user

1. **Scenarios table out of edit scope.** The `lld-modular-monolith/run` row of the README's Scenarios table still says "check_trace 0 problems, 2 notes"; after change 4 it is 2 problems (the two pre-rule Workflow blocks). The brief limited my README edits to the Checkers table rows of the scripts I changed or added, so the row was left as is.
2. **L2-10b scope.** The chunk-14-row-wins link rule is enforced on §17.3 Screen cells, the one place `check_trace.py` checks link targets. The 04 Screens fields and the §19.9 index cells are compared as (screen, route) pairs only; their link targets stay unchecked.
3. **`check_versions.py` choices.** (a) When a `Chunks:` list exists, the master and chunk 00 must also carry the newest row's version: F1's own sentence ("The master and chunk 00 carry the current version") although the brief's bullets name only the two list rules. (b) A `Chunks:` list with no chunk numbers (a combined document naming sections) is reported in a note, not checked. (c) `decision-log.md` is never version-checked: it is not a chunk, though several runs give it a VERSION header. (d) For F4, a `Provisional (TD-NN)` state is compared by the keyword only; the TD number is not.
4. **check_refs moved, untouched.** 239 to 240 references between the before and after runs (an em dash agent's edit), 0 problems both times.
5. **Notes unchanged.** All runs keep their 2 notes (mockup rows without an `MK-NN`); the review REFUNDS note includes a row keyed `-` (a mockup row with no screen ID), pre-existing.

## Summary

Scripts changed: `check_mermaid.py` (size cap by kind: SDD exempts ERDs and the §8.3/§24.3 layered views, LLD exempts ERDs, one exemption table per kind; folder kind from the master file name, then the prefix), `check_e2e.py` (the "In-process domain events" count against §14.10; §24.2 accepted through its cited §8.2), `check_trace.py` (`### Workflow:` blocks and their two route forms; a screen-ID-keyed chunk 14 row wins its link), `check_sdd.py` (`Schedule:`/`Event:` entry points checked against the owner's Input table). Script added: `check_versions.py` (the newest Changes Log row's `Chunks:` list against the chunk VERSION headers, and the BRD 15-17 states in their three places). `_fixtures/README.md` Checkers table and § How to run updated to match. Every change was tested before/after on the four saved runs and the scenario folders, and on a planted error (caught) plus a planted valid new-format case (passed) per change; outputs under `_fixtures/.ck-tmp/` during the run (deleted after). `check_refs.py`: 240 references, 0 problems. Items for the user: the five above.

## Addendum (2026-10-04, after handoff)

`lld-unifier/mermaid-diagrams.md:46` changed while CK ran (the E-stage follow-ups): the LLD cap now also exempts the layered view in `03-architecture.md` § 6.1 Component Topology, not ERDs only. Per the brief's skill-text-first rule, `check_mermaid.py` gained the matching `"lld": §6.1 heading` exemption and the README's check_mermaid row was updated (edits of 22:42/22:48, by the main session's CK review). Verified after the change: LLD folders read 0 issues on all four chain runs (run-new's one long graph is the § 6.1 component topology); SDD results are unchanged from the table above.

# Unifier test fixtures

Sample projects, run outputs, and checkers for regression-testing the unifier chain (pre-BRD, BRD, SDD, LLD, business reviewer). This folder is not a skill: it has no `SKILL.md`, and the `~/.agents/skills` junctions link only the five skill folders.

## Layout

| Path | What it is |
|------|------------|
| `chain/fixture/` | Inputs of the 2026-09-28/29 chain run. `brd-refunds-portal`: key REFUNDS, v1.0, chunks 00-16, UC-01 to UC-04 (UC-05 merged into UC-04). `brd-loyalty-points`: key LOYALTY, v1.0, chunks 00-14, UC-01 and UC-02, no chunks 15-16. `sdd-refunds-platform`: v1.0, both BRDs as parents, services 13a refund, 13b payout, 13c notification, 13d loyalty, chunks 00-18, no chunk 19. |
| `chain/run-new/` | **Regression baseline.** The fixture plus `lld-refunds-platform` (LLD v1.0, one 04 file per service), written by the lld-unifier with use-case traceability. The SDD's `00` gained its Child LLDs row. |
| `chain/run-old/` | The same LLD written by the lld-unifier before use-case traceability (no §19.9 index, master named `lld-master.md`). Kept for comparison only. |
| `chain/run-2026-09-30/` | The same two runs repeated on main 86cab74 (step 2 of the readiness plan): the fixture BRDs unchanged, a new SDD (hybrid core, 22 reviewer items applied, e2e gate Locked on E3), and a new LLD registered in the SDD's Child LLDs table with its SDD version. Not yet the baseline: see the results below. |
| `sdd-uc-trace/fixture/` | The earlier BRD pair (2026-09-28 morning): loyalty-points v1.2 with UC-01 to UC-03 in `06a` customer and `06b` loyalty manager; refunds-portal v1.0 without chunks 15-16. |
| `sdd-uc-trace/run-baseline/` | `sdd-refunds-portal` from refunds-portal alone, before SDD use-case traceability: no §7.3, no "Use cases (BRD)" column. |
| `sdd-uc-trace/run-green/` | The same SDD with §7.3 and use-case links, before BRD keys (`check_uc_keys.py` reports 100 unkeyed links). |
| `sdd-uc-trace/run-multi/` | Two-BRD SDD `sdd-retail-customer-platform` (chunks 00-09 only) with a Source BRDs register (REFUNDS, LOYALTY) and one Child LLDs row for the `lld-refunds-core` master stub (v0.1). |
| `scenarios/` | One folder per path from the README's Known gaps, run on main 057f137 (step 3 of the readiness plan). See [Scenarios](#scenarios). |
| `checkers/` | The scripts below. Python 3 standard library only. |

Copied on 2026-09-30 from the `%TEMP%` scratchpads of sessions 61846cf6 (`chain/`) and fa4d45b3 (`sdd-uc-trace/`). Left behind: the old `*-unifier` skill snapshots, `__pycache__`, `aux/sdd-refunds-portal-green` (identical to `sdd-uc-trace/run-green/sdd-refunds-portal`), and `mmd-test/` (a mermaid-cli render smoke test).

## Checkers

Results are for the commands under [How to run](#how-to-run). `run-new` predates the 2026-09-29/30 rules, so the checks for those rules (marked new) fail on it by design.

| Script | What it checks | `run-new` | `run-2026-09-30` |
|--------|----------------|-----------|------------------|
| `check_links.py ROOT` | Relative links and anchors inside `ROOT/lld-refunds-platform`. | 280 links, 0 broken | 382 links, 0 broken |
| `_linkcheck.py LLD_DIR` | LLD links and anchors, SDD link count, and per-file flags: CRLF, em dash, no leading `<!-- -->` header block. | 280 links, 0 bad, no flags | 382 links, 0 bad, no flags |
| `check_lld_trace.py LLD SDD KEY=BRD... [--json OUT]` | LLD use-case traceability: links resolve with GitHub anchors (a folder link counts as resolved); every BRD ID is keyed, its key is in the SDD's Source BRDs register, and the ID exists in that BRD; no TC ranges. New: the Child LLDs table has the six columns, this LLD's row records the SDD version it read (or the exact out-of-date note), and its Version, Direction, scope services, and 16 §19.1 SDD version agree. Counts UC blocks, §19.9 index rows, §17.3 route rows, §16.8 spec rows, flags, and e2e tags. | 4 unkeyed IDs, 2 lineage problems (no SDD version column) | 1 unknown ID (`REFUNDS/UC-010`, a keyed template example), 1 lineage problem (`Angular web app` in the Scope column) |
| `check_trace.py ROOT` | SDD §7.3 against the LLD (owner files are read from the §7.3 owners, so module names such as `refund.md` work): one 04 block per Active use case (title, owner file, entry points, UAT/BAT test cases against BRD chunk 16, LOYALTY marked Pending), §17.3 routes against the Screens field and route data, §19.9 index order and cells, `@UseCase` on every §7.3 entry point in the owner's 04 file, §16.8 specs covering every chunk 16 test case. New: an `MK-NN` screen reference is a chunk 14 Mockup coverage row, links to `14-todo.md#mockup-coverage`, and lists that row's use cases; any other screen ID is in the BRD text; the 04 Screens fields and §19.9 match §17.3 (screen, route) pairs; 06 §9.1 has the API ID and Permission token columns with the SDD 13x token and API ID (client-side rows are checked against SDD §15.2); every 04 file has an authorization table whose tokens are in SDD §16.11; the client-credentials rule is stated when SDD §15.2 lists internal HTTP contracts. Notes list mockup rows without an `MK-NN`. | 10 problems (new columns and authorization tables missing), 2 notes | 5 problems (4 routes without route data, 1 report route with no screen), 2 notes |
| `check_sdd.py SDD_DIR` | SDD links and anchors; UC IDs keyed and linked (inline code, the §7.3 `Merged into KEY/UC-NN` status, and `KEY 12 TI-NN` are accepted); NFR and TI IDs keyed; em dashes; §7.3 entry points in the owner's 13x API list; 13x events in chunk 10; API IDs in the chunk 11 index; 13x permission tokens in chunk 12. New: every 13x List of APIs has the Permission token (§16) and API ID (§15) columns, its tokens are in §16.11, its API IDs match the §15.2 Method and URI, and chunk 11 Authorization tokens are in §16.11. Counts clarification markers. | 5 problems (4 new: no Permission token column), 96 markers | 37 problems (26 unlinked use cases, 11 unkeyed NFR or TI IDs, in chunk 18 and the decision log), 106 markers |
| `check_uc_links.py SDD_DIR` | SDD links into BRDs resolve (file and anchor); linked and bare UC mentions per file; §7.3 section and "Use cases (BRD)" column present. | 219 BRD links, 0 broken | 224 BRD links, 0 broken |
| `check_uc_keys.py SDD_DIR` | Source BRDs register; every UC link is keyed, its key is registered, and it stays inside that BRD's folder; Child LLDs section present. Imports `check_uc_links.py`. | 0 problems | 0 problems |
| `check_mermaid.py DIR` | Mermaid heuristics: blocks over about 30 lines, unbalanced `alt`/`end`, `;` or `#` in sequence messages, messages without text, unbalanced class braces or ER entity braces, unquoted `(){}` in flowchart labels (the `[(...)]` cylinder shape is fine), extra `:` in state transitions. | LLD 42 blocks, 1 issue; SDD 21 blocks, 1 issue | LLD 42 blocks, 0 issues; SDD 25 blocks, 4 issues (all over 30 lines) |
| `check_refs.py LLD_SKILL SDD_SKILL` | The lld-unifier skill's own references: `SKILL.md step N`, `SKILL.md §`, `` `file.md` § Heading ``, internal § in `sdd-to-lld.md`, sample anchors, and the Child LLDs columns against sdd-unifier chunk 00. | Skill folders at 86cab74: 182 references, 0 problems, Child LLDs columns MATCH | (same) |
| `list_flags.py LLD_DIR` | Report, not a check: every `> TODO:` and `> Confirm:` line with file, line, and headings (skips chunks 15 and 18). | 31 TODO, 44 Confirm | 29 TODO, 37 Confirm |
| `diff_runs.py BASE NEW [--levels N]` | Report, not a check: for each `brd-*`, `sdd-*`, and `lld-*` folder of two runs, the files, headings (up to level N), table headers, IDs, event names, and permission tokens found in only one of them, plus totals (Mermaid blocks, links, clarification markers, TODO and Confirm flags, em dashes). Generated text never matches line by line, so compare structure. | n/a | n/a |
| `link_oi.py FILE` | Fixture helper that **rewrites FILE**: links bare `REFUNDS/UC-NN` and `LOYALTY/UC-NN` IDs to their BRD anchors. Already applied to the fixture SDD's chunk 18, so a rerun links 0. | n/a | n/a |

`check_links.py`, `check_trace.py`, `check_sdd.py`, and `link_oi.py` are tied to these fixtures: they expect the folder names `lld-refunds-platform`, `sdd-refunds-platform`, and `brd-refunds-portal`, the keys REFUNDS and LOYALTY, and the fixture's service files and test case IDs. A new run must reuse those folder names.

## How to run

From the repository root, in PowerShell. Set the encoding first, because the scripts print `§` and `→`.

```powershell
$env:PYTHONIOENCODING = 'utf-8'
$C = '_fixtures/checkers'; $R = '_fixtures/chain/run-new'
python $C/check_links.py $R
python $C/_linkcheck.py $R/lld-refunds-platform
python $C/check_lld_trace.py $R/lld-refunds-platform $R/sdd-refunds-platform REFUNDS=$R/brd-refunds-portal LOYALTY=$R/brd-loyalty-points
python $C/check_trace.py $R
python $C/check_sdd.py $R/sdd-refunds-platform
python $C/check_uc_links.py $R/sdd-refunds-platform
python $C/check_uc_keys.py $R/sdd-refunds-platform
python $C/check_mermaid.py $R/lld-refunds-platform
python $C/list_flags.py $R/lld-refunds-platform
python $C/check_refs.py lld-unifier sdd-unifier
python $C/diff_runs.py _fixtures/chain/run-new $R --levels 2
```

To test a new run, write it to the session scratchpad (never inside a skill folder) with the same folder names, point `$R` at it, and compare it with `diff_runs.py`. When a run passes, it replaces `chain/run-new` as the baseline.

## Scenarios

Each scenario was run by background agents that read the skill from disk and answered every question with a fixed answer (accept every recommendation, accept every Recommended Answer, no Miro). The second stage of each scenario was a fresh agent, so it saw only what a new session would see. Checker results use the commands under [How to run](#how-to-run) with `$R` pointed at the run folder.

| Folder | How it was made | Result |
|--------|-----------------|--------|
| `pre-brd-to-brd/run/` | pre-brd-unifier on the idea "Clinic Reminders" (reminders and waitlist backfill for small clinics in Greater Cairo, EGP, a startup), stopped at its step 7 and approved as is; then brd-unifier `chunks whole` on that folder. `brd-clinic-reminders.before-review/` is the BRD just before its reviewer ran. | Every pre-BRD chunk lands where `sow-transformation.md` maps it; 0 broken links into the pre-BRD; market figures stay in the pre-BRD. 14 requirement-relevant pre-BRD markers and open items carried as markers, none filled in. Two defects: the reviewer's accepted OI-03 removed the verdict word that the mapping requires, and BO-11 keeps a price the pre-BRD flags (OI-10) without a marker. 303 links, 0 bad; 3 Mermaid blocks, 0 issues. |
| `brd-heading-map/` | `input/` is `chain/fixture/brd-refunds-portal` plus 10 links between merged chunks (chunks 15 and 16: whole-chunk links to 02, 06a, 06b, 15, 16, use-case anchors, and `14-todo.md`), because the fixture had none. brd-unifier merged it (`merged/`), then a fresh agent re-chunked the merged file alone (`rechunked/`). | Heading outline and links identical to `input/` in every chunk except 00; 06a and 06b get back their titles, chunk 16 its project-name title; no body line lost. Differences: chunk header comments rebuilt from the skeletons, the template structure list added to 06a and 06b, 00 gains the ToC the merge built, master regenerated. 175 links, 0 bad. |
| `sdd-version-tracking/` | `chain/run-2026-09-30` with LOYALTY moved to v1.1 by hand (UC-02: a partial refund takes back only the points of the refunded amount). sdd-unifier: "BRD LOYALTY has a new version" gives `after-sdd/`; then a plain `lld-unifier chunks` run on the existing LLD gives `after-lld/`. | `after-sdd/`: SDD 1.0 to 1.1, LOYALTY row 1.1, Child LLDs SDD version `1.0 (out of date: SDD is now v1.1; refresh through lld-unifier)`; only 8 SDD files change, the LLD is untouched. `after-lld/`: step 3c finds SDD 1.1 against the recorded 1.0 and offers the refresh; only the LLD chunks mapped from SDD 00, 01, 03, 05, 13d, and 17 change, plus 00, the master, 15, and 18; the SDD changes only this LLD's row (1.1, 1.1). Checkers: as `run-2026-09-30` except check_sdd 44 (7 more unlinked use cases in the 1.1 Changes Log row and the decision log). |
| `lld-modular-monolith/run/` | sdd-unifier on the fixture BRDs with Q4 answered "Modular monolith" and the four bounded contexts as modules; then lld-unifier from-sdd. | SDD: four `module` rows, ADR-01 modular monolith, `PayoutPort.requestPayout` (API-01, Internal in-process), six §14.10 events, no broker; gate Locked on E3. LLD: one 04 file per module (`refund.md`, `payout.md`, `notification.md`, `loyalty.md`); API-01 in 06 §9.6; the six events in 07 §10.6; 07 §10.1-§10.5 not applicable; resilience only on provider calls. check_links 271, 0 broken; check_lld_trace 0 lineage problems, 1 unknown ID (`REFUNDS/UC-010`); check_trace 0 problems, 2 notes; check_mermaid 0 issues in both. |

The fixture BRDs predate the current brd-unifier rules: their Mockup coverage rows use the screen IDs SCR-01, SCR-02, LP-01, and LP-02 instead of `MK-NN`, their Technical Inputs carry TI-NN IDs the template no longer has, and chunks 15 and 16 lack the delivery status, Needs column, and Task acceptance table. The SDD and LLD runs read them as they are.

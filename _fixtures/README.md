# Unifier test fixtures

Sample projects, run outputs, and checkers for regression-testing the unifier chain (pre-BRD, BRD, SDD, LLD, business reviewer). This folder is not a skill: it has no `SKILL.md`, and the `~/.agents/skills` junctions link only the five skill folders.

## Layout

| Path | What it is |
|------|------------|
| `chain/fixture/` | Inputs of the 2026-09-28/29 chain run. `brd-refunds-portal`: key REFUNDS, v1.0, chunks 00-16, UC-01 to UC-04 (UC-05 merged into UC-04). `brd-loyalty-points`: key LOYALTY, v1.0, chunks 00-14, UC-01 and UC-02, no chunks 15-16. `sdd-refunds-platform`: v1.0, both BRDs as parents, services 13a refund, 13b payout, 13c notification, 13d loyalty, chunks 00-18, no chunk 19. |
| `chain/run-new/` | **Regression baseline.** The fixture plus `lld-refunds-platform` (LLD v1.0, one 04 file per service), written by the lld-unifier with use-case traceability. The SDD's `00` gained its Child LLDs row. |
| `chain/run-old/` | The same LLD written by the lld-unifier before use-case traceability (no §19.9 index, master named `lld-master.md`). Kept for comparison only. |
| `sdd-uc-trace/fixture/` | The earlier BRD pair (2026-09-28 morning): loyalty-points v1.2 with UC-01 to UC-03 in `06a` customer and `06b` loyalty manager; refunds-portal v1.0 without chunks 15-16. |
| `sdd-uc-trace/run-baseline/` | `sdd-refunds-portal` from refunds-portal alone, before SDD use-case traceability: no §7.3, no "Use cases (BRD)" column. |
| `sdd-uc-trace/run-green/` | The same SDD with §7.3 and use-case links, before BRD keys (`check_uc_keys.py` reports 100 unkeyed links). |
| `sdd-uc-trace/run-multi/` | Two-BRD SDD `sdd-retail-customer-platform` (chunks 00-09 only) with a Source BRDs register (REFUNDS, LOYALTY) and one Child LLDs row for the `lld-refunds-core` master stub (v0.1). |
| `checkers/` | The scripts below. Python 3 standard library only. |

Copied on 2026-09-30 from the `%TEMP%` scratchpads of sessions 61846cf6 (`chain/`) and fa4d45b3 (`sdd-uc-trace/`). Left behind: the old `*-unifier` skill snapshots, `__pycache__`, `aux/sdd-refunds-portal-green` (identical to `sdd-uc-trace/run-green/sdd-refunds-portal`), and `mmd-test/` (a mermaid-cli render smoke test).

## Checkers

Baseline results are for the commands under [How to run](#how-to-run), on `chain/run-new`.

| Script | What it checks | Baseline result |
|--------|----------------|-----------------|
| `check_links.py ROOT` | Relative links and anchors inside `ROOT/lld-refunds-platform`. | 280 links, 0 broken |
| `_linkcheck.py LLD_DIR` | LLD links and anchors, SDD link count, and per-file flags: CRLF, em dash, no leading `<!-- -->` header block. | 280 links, 0 bad, no flags |
| `check_lld_trace.py LLD SDD KEY=BRD... [--json OUT]` | LLD use-case traceability: links resolve with GitHub anchors; every BRD ID is keyed, its key is in the SDD's Source BRDs register, and the ID exists in that BRD; no TC ranges. Counts UC blocks, §19.9 index rows, §17.3 route rows, §16.8 spec rows, flags, and e2e tags. | 1 broken (the folder link `./04-implementation/` counts as missing), 4 unkeyed (`NFR-02, NFR-04` after `REFUNDS/NFR-01`), 0 unknown, 0 ranges |
| `check_trace.py ROOT` | SDD §7.3 against the LLD: one 04 block per Active use case (title, owner file, entry points, UAT/BAT test cases against BRD chunk 16, LOYALTY marked Pending), §17.3 routes against the Screens field and route data, §19.9 index order and cells, `@UseCase` rows against §7.3 entry points, §16.8 specs covering every chunk 16 test case. | 0 problems (`chain/run-old` stops with IndexError: no §19.9) |
| `check_sdd.py SDD_DIR` | SDD links and anchors; UC IDs keyed and linked; NFR and TI IDs keyed; em dashes; §7.3 entry points in the owner's 13x API list; 13x events in chunk 10; API IDs in the chunk 11 index; 13x permission tokens in chunk 12; clarification marker counts. | 2 problems, 96 markers |
| `check_uc_links.py SDD_DIR` | SDD links into BRDs resolve (file and anchor); linked and bare UC mentions per file; §7.3 section and "Use cases (BRD)" column present. | 219 BRD links, 0 broken |
| `check_uc_keys.py SDD_DIR` | Source BRDs register; every UC link is keyed, its key is registered, and it stays inside that BRD's folder; Child LLDs section present. Imports `check_uc_links.py`. | 0 problems |
| `check_mermaid.py DIR` | Mermaid heuristics: blocks over about 30 lines, unbalanced `alt`/`end`, `;` or `#` in sequence messages, messages without text, unbalanced class/ER braces, unquoted `(){}` in flowchart labels, extra `:` in state transitions. | 42 blocks, 4 issues (one 35-line graph, three ER brace counts) |
| `check_refs.py LLD_SKILL SDD_SKILL` | The lld-unifier skill's own references: `SKILL.md step N`, `SKILL.md §`, `` `file.md` § Heading ``, internal § in `sdd-to-lld.md`, sample anchors, and the Child LLDs columns against sdd-unifier chunk 00. | Skill folders at 86cab74: 182 references, 0 problems; Child LLDs columns DIFFER (the checker predates the SDD version column) |
| `list_flags.py LLD_DIR` | Report, not a check: every `> TODO:` and `> Confirm:` line with file, line, and headings (skips chunks 15 and 18). | 31 TODO, 44 Confirm |
| `link_oi.py FILE` | Fixture helper that **rewrites FILE**: links bare `REFUNDS/UC-NN` and `LOYALTY/UC-NN` IDs to their BRD anchors. Already applied to the fixture SDD's chunk 18, so a rerun links 0. | n/a |

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
```

To test a new run, write it to the session scratchpad (never inside a skill folder) with the same folder names, point `$R` at it, and diff it against `chain/run-new`. When a run passes, it replaces `chain/run-new` as the baseline.

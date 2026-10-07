# Handoff: checker follow-ups (step 6, stage CK)

Work in the git repo `C:\Users\negat\.claude\skills` (branch `fix/unifier-fix-round`). Five documentation skills live there (`pre-brd-unifier`, `brd-unifier`, `sdd-unifier`, `lld-unifier`, `business-reviewer-unifier`). `_fixtures/checkers/` holds Python 3 standard-library scripts that regression-test the BRD, SDD, and LLD folders the skills produce. `_fixtures/README.md` documents each script, how to run it (§ How to run), and its expected result on every saved run (§ Checkers table).

This round changed several skill rules. **Goal:** update the checkers to follow them before the chain is rerun, and prove each change on the saved runs and on planted errors.

## Ground rules

- **Write only:**
  - the scripts in `_fixtures/checkers/`
  - `_fixtures/README.md`: the Checkers table rows of the scripts you change or add, plus § How to run for a new script
  - your log, `_fixtures/notes/step6-handoffs/ck-log.md`
  - a scratch folder, `_fixtures/.ck-tmp/`, for planted-error copies. Delete it at the end.
- **Never modify:**
  - a saved run under `_fixtures/chain/`, `_fixtures/scenarios/`, or `_fixtures/sdd-uc-trace/`
  - any skill folder
  - the root `README.md` (another agent is editing it)
  - `UNIFIER-ENHANCEMENTS.md`
  - anything else in `_fixtures/notes/`
- Never run `link_oi.py`: it rewrites its input file.
- Python standard library only. Install nothing and add no dependency.
- Use no git command that changes state: no commit, push, add, stash, checkout, restore, or reset. `git status`, `git diff`, `git show`, and `git log` are fine. The working tree already holds about 100 uncommitted changes from this round. Leave them alone.
- Other agents are editing `sdd-unifier/` and `lld-unifier/` while you work. They only replace em dash characters with other punctuation, and a heading may get renamed. Read those files freely; never write them.
- Keep each file's line endings: every script in `_fixtures/checkers/` and `_fixtures/README.md` uses LF. Keep each script's style and its fixed output order, and change no existing behaviour beyond the rules below.
- Write no em dash (U+2014) or en dash (U+2013) characters. If code must match one, write `\u2014` in the string.
- Run every checker with `PYTHONIOENCODING=utf-8` and `PYTHONHASHSEED=0`, using `python -B`. In PowerShell: `$env:PYTHONIOENCODING='utf-8'; $env:PYTHONHASHSEED='0'`.
- Source of truth: the skill text. The decision records explain why: `_fixtures/notes/step6-decisions.md`, `_fixtures/notes/step6-consistency/decisions.md`, and the detail in `_fixtures/notes/step6-triage/` (`sdd-templates.md`, `sdd-core.md`, `lld.md`, `checkers.md`). If the skill text and a record disagree, follow the skill text and note the difference in your log.
- **Unclear rule:** do not guess. Implement the clear part and list the rest in the log under "For the user".

## Changes

### 1. `check_mermaid.py`: size cap by kind (decision S2-3)

Today every block over about 30 lines is flagged.

**SDD folders:** follow `sdd-unifier/mermaid-diagrams.md` (the "Keep diagrams scoped" bullet). Workflow and sequence diagrams keep the cap. Layered views (§8.3 in chunk 04, §24.3 in chunk 19, found by the heading the block sits under) and ERDs (`erDiagram`) have no cap.

**LLD folders:** follow `lld-unifier/mermaid-diagrams.md`. Today it exempts only ERDs. It may be aligned with the SDD later, so keep the exemption lists in one place that is easy to change.

Tell an SDD folder from an LLD folder the way the script can do it reliably (folder prefix or master file name), and say which in the log.

### 2. `check_e2e.py`: the In-process domain events count (decision T5)

The chunk 19 Counts at a Glance table has a row `| In-process domain events | [N] | §14.10 (chunk 10) |` (`sdd-unifier/chunks/19-e2e-system-design.md`). Check its N against the number of §14.10 events, as the other count rows are checked. Read `sdd-unifier/SKILL.md` step 8b.3 for the counts rule.

### 3. `check_e2e.py`: §24.2 and §24.3 by reference (decision W2)

Chunk 19's NO_DUPLICATION_RULE now says §24.2 and §24.3 cite §8.2 and §8.3 (chunk 04) and draw only what they add.
- The check "every external system in §24.2" must accept an external system that §24.2 shows through its cited §8.2.
- No check may require §24.2 or §24.3 to redraw §8.2 or §8.3.

### 4. `check_trace.py`: Workflow blocks and their routes (decisions L2-6 and C6)

A 04 file may hold `### Workflow: [Flow name]` blocks for behaviour the BRD or SDD asks for that no use case covers. Each has the line `> **Traceability:** No BRD use case - realises [link ...]` and no `@UseCase` (`lld-unifier/chunks/04-implementation-template.md`, the Workflow paragraph near line 306).

Their §17.3 routes use the values in `lld-unifier/chunks/14-frontend.md` (the column descriptions near lines 46-47):
- `None - no BRD screen ([link])` for a Workflow route, which carries no route data.
- `None - no BRD use case ([link])` for a Workflow route whose screen has a chunk 14 row. Its route data carries the screen only.

Read both column descriptions in full, for the Screen (BRD) and the Use cases (BRD) cells, and accept exactly those forms. Workflow blocks are not §7.3 rows, so they need no §19.9 index row and no `@UseCase`. Flag one that carries a use case ID.

### 5. `check_trace.py`: the chunk 14 row wins (decision L2-10b)

When a screen has a chunk 14 Mockup coverage row, the screen reference cites that row and links to `14-todo.md#mockup-coverage`. In a BRD written before `MK-NN`, the row is keyed by its screen ID: the fixture BRDs use SCR-01, SCR-02, LP-01, and LP-02.

Only a screen ID with no chunk 14 row links to the BRD text that defines it. Accept a screen-ID-keyed row, and flag a link to the BRD heading when a chunk 14 row exists. See the Screen (BRD) description in `lld-unifier/chunks/14-frontend.md`.

### 6. `check_sdd.py`: trigger entry points (decisions S2-4f and N-3)

A §7.3 entry point written as `Schedule: [name]` or `Event: [EVENT_NAME]` is checked against the owner's 13x Input table, not its List of APIs (`sdd-unifier/brd-to-sdd.md`, consistency check 4: "a `Schedule:` or `Event:` trigger, in that service's Input table"; the 13x Input table is in `sdd-unifier/chunks/13a-service-detailed-template.md`). Method-and-path entry points stay checked against the List of APIs.

### 7. Version check (decision F1): do it unless unclear

Each Changes Log row ends with `Chunks:` and the chunks whose content changed; a combined document names sections. The master and chunk 00 carry the current version; every other chunk keeps the version its content last changed in.

Check the newest Changes Log row against the chunk `VERSION:` headers in a BRD, SDD, or LLD folder:
- every listed chunk carries that version
- no unlisted chunk other than the master and 00 carries it

A new script `check_versions.py DOC_DIR` is fine. The saved runs predate `Chunks:` lists, so report "no `Chunks:` list" there, not a failure per chunk.

### 8. BRD gated chunk states (decision F4): do it unless unclear

The state of each BRD chunk 15, 16, and 17 must read the same in three places: the chunk's status line, its chunk 14 row, and the master's State cell. Read `brd-unifier/delivery-chunks.md` (the Re-lock and `Stale` rules). It can go in `check_versions.py` or a new `check_brd_gate.py BRD_DIR`; say which in the log.

## Tests

1. **Before you change anything,** run every checker on every saved run with the commands in `_fixtures/README.md` § How to run. Set `$R` to each of these runs in turn: `_fixtures/chain/run-new`, `_fixtures/chain/run-2026-09-30`, `_fixtures/chain/run-2026-10-01-e2e`, `_fixtures/chain/run-2026-10-01-review`. Also run the scenario folders whose results § Scenarios lists. Save the outputs in `_fixtures/.ck-tmp/before/`.
2. **After the changes,** run the same commands. Every result must equal the README's Checkers table except where your change explains the difference. List each difference in the log with its reason. The saved runs predate this round's templates, so a new rule may legitimately report on them: say so rather than weakening the rule.
3. **For each change,** copy a run into `_fixtures/.ck-tmp/` and plant one error the change must catch, then show it is caught. Also plant one valid new-format case and show it passes. Examples:
   - a `### Workflow:` block with each route form
   - an `Event:` entry point listed only in the owner's Input table
   - a 40-line ERD
   - a §24.2 that cites §8.2
   - a `Chunks:` list that misses a changed chunk
4. Run `python -B _fixtures/checkers/check_refs.py lld-unifier sdd-unifier` and report its result. It may move while the em dash agents work, so do not try to fix it.
5. **At the end:**
   - delete `_fixtures/.ck-tmp/`
   - leave no `__pycache__` folder in `_fixtures/checkers/`
   - confirm with `git status --short` that you changed only the files allowed above

## Log and README

**Log:** `_fixtures/notes/step6-handoffs/ck-log.md`, written as you go so a stopped run still leaves a usable record. For each change:
- what changed in which script
- the planted tests (error caught, valid case passed)
- the before and after results per run

End with "For the user".

**README:** in `_fixtures/README.md`, update the "What it checks" cell and the result cells of each script you changed. Add a row and a § How to run line for a new script. Keep the table shape.

End with a short summary: the scripts changed or added, the tests, the result differences, and the items for the user.

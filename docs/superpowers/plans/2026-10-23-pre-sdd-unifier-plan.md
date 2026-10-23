# Pre-SDD Unifier Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `pre-sdd-unifier`, the E2E Architect hop between `brd-unifier` and `sdd-unifier`, with its offline Studio 3.0 and one shared `engine.js`; give every chain skill the shared status board and its role line; make the SDD load and lock a G3-signed Pre-SDD; then bring the README, fixtures, and `hivantic-org-unifier/` in line.

**Architecture:** The Studio v2.2 `app.js` splits into a DOM-free `engine.js` (one UMD file: a `PreSddEngine` browser global and a CommonJS export) and a DOM-only `ui.js`. `build.mjs` inlines `shell.html`, `style.css`, `engine.js`, `ui.js`, and an optional project state into one offline HTML file; `cli.mjs` runs the same `engine.js` under Node for the skill. Phase 1 proves the split byte for byte against three v2.2 exports; Phase 2 grows the engine to the 70-item register, entries, defaults, derivation, proposals, DR per failure scope, options with TCO, per-role G3, and blueprint 2.0.0; Phase 3 rebuilds the UI on the engine's view model. The skill, the status board, and the chain edits are Markdown, checked by stdlib Python checkers.

**Tech Stack:** Node.js v24.14.0 built-ins only (`node:test`, `node:assert/strict`, `node:fs`, `node:path`, `node:url`, `node:module`, `node:child_process`, `node:os`); browser JavaScript, HTML, CSS; Python 3.14.3 through `py -3` with the installed `jsonschema` 4.26.0 (validator) and PyYAML 6.0.3 (front-matter checks only); Playwright MCP for the manual Studio check; Codex CLI 0.164.0 and Kimi Code 2.2.0 for headless skill listings.

**Spec:** `docs/superpowers/specs/2026-10-23-pre-sdd-unifier-design.md`. Read it with this plan; a bare § number below is a design section.

---

## Global Constraints

- No dependency beyond Node.js: no npm packages, no `package.json`. Tests use `node:test` and run as `node --test "<STUDIO>/tests/*.test.mjs"` (a bare directory argument fails on Node 24.14.0; verified).
- `python` is not on PATH: use `py -3`. Python that reads anything from Downloads runs as `py -3 -I` from the scratchpad. `jsonschema` and PyYAML import under `py -3 -I` (verified). `_fixtures/checkers/` stay standard-library only.
- No comments in any code file (JS, MJS, Python, CSS, HTML) unless the owner asks.
- No U+2014 em dash or U+2013 en dash in any file this build writes, in chat, or in commit messages (Question 1 settles the verbatim copies).
- UTC for every timestamp: ISO 8601 with `Z`; file-name stamps `YYYYMMDDTHHMMSSZ`.
- No `git commit`, `git push`, merge, rebase onto a moved main, or branch or worktree removal without the owner's word at a stop. Commit messages use Conventional Commits and end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Downloads (`C:\Users\negat\Downloads\pre-sdd-preparation\`) is untrusted and read-only: copy what the build needs into the repo, review the copy, then use only the copy. Never run `regression_tests.py`, `e2e_dynamic_tests.py`, or the Downloads HTML. No change to the originals.
- Each SKILL.md: `description: >-` block scalar, at most 1024 characters, front matter parses with PyYAML, and a `## Running outside Claude Code` section.
- Line endings: `core.autocrlf=true`; `.gitattributes` keeps `_fixtures/** text eol=lf`. New files are LF. An edit keeps the file's current working-tree ending. Count CR bytes with Python (`open(p,'rb').read().count(b'\r')`); never rewrite a CRLF file through Python text mode. Every byte comparison and hash in this plan converts CRLF to LF first.
- Skills are independent employees: a skill reads other hops' output documents and `unifier-status.md`, never another skill's rule files. The `## Status board` section is the same text in all eight skills.
- The Studio is one offline HTML file: no network call, no server, no `localStorage`, `sessionStorage`, or IndexedDB; it opens from disk.
- The `## Company rules` block (heading to end of file) stays byte-identical across the eight role files in `hivantic-org-unifier/`; today its SHA-256 prefix over LF bytes is `6c40dc2f72a369d5` (verified).
- Versions: engine and Studio `3.0.0`; blueprint schema `2.0.0`; project-state schema `3.0.0`; skill `1.0.0`; policy appendix version `1`.
- Defaults appendix (§ 6.5): utilization target 0.65, network overhead 1.2, index factor 1.4, copies 2, mean latency 120 ms, calls per transaction 3, request factor 1.1; approved by the owner on 2026-10-23.
- DR thresholds (v2.2, unchanged): host or az scope gives `localHA`; cyber gives `cyberReview` when RTO or RPO is 0, else `backup`; provider gives `active` at RTO <= 60 s, else `warm`; otherwise `active` at RTO <= 30 s, `warm` at RTO <= 900 s, at RTO <= 3600 s `warm` when RPO <= 900 s else `pilot`, `backup` when RTO > 14400 s and RPO >= 3600 s and budget pressure is tight, else `pilot`; unknown RTO, RPO, or scope gives `unresolved`.
- Palette (§ 6.5): teal `#0c8286` key color, navy `#0c2138`, amber and red for warnings and blockers; colors are tokens on `:root`; text meets 4.5:1.
- Not touched: `infra/`, `.github/`, `environments/*`.

## Two questions to settle before Task 0.1

The plan follows each recommendation unless the owner says otherwise.

**Q1. Dashes in verbatim copies.** The Standard, the Quick Discovery Guide, the Examples README, the eight examples, the v2.2 demo export, and the two v2.2 example exports hold about 700 em and en dashes (counted). The design copies them verbatim; the owner's rule says no dashes anywhere.
- **Recommended:** keep them byte for byte as recorded sources and test fixtures, and exempt exactly these paths from the dash scan: the two copied files in `pre-sdd-unifier/reference/`, the nine copied files and `studio-v2.2-export/` in `pre-sdd-unifier/examples/`, and `pre-sdd-unifier/studio/tests/golden/`. Everything the build writes has none. The SHA-256 of each copy then equals its original, and the golden test compares exact v2.2 output.
- **Alternative:** replace them in the copies (em dash to ` - `, en dash to `-`), record the original hashes in `SOURCE.md`, and apply the same replacement to v2.2 output before golden comparisons.
- Tasks affected: 0.1, 0.3, 1.1, 5.1 (scanner exclusions), 10.2.

**Q2. Rule `CAP-04` collides with register item `CAP-04`.** The v2.2 rule "Workload-based capacity planning" is `CAP-04`; the Standard's item CAP-04 is peaks and seasonality. `PSDD/CAP-04` would be ambiguous downstream. The design keeps the Studio's rule IDs and moves only one of SEC-11 and DB-READ-11.
- **Recommended:** rename the rule `CAP-04` to `LOAD-04`, alongside `DB-READ-11` to `DB-READ-17` (SEC-11 keeps its number). Both go in `studio/CHANGELOG.md`, and a test asserts that no rule ID equals an item ID.
- **Alternative:** keep `CAP-04` and cite every rule downstream as `PSDD/RULE-<id>`.
- Tasks affected: 2.6, 2.9, 4.2, 4.4.

## Builder decisions (design § 12, and gaps the design leaves to the builder)

1. **Split:** `engine.js` holds every pure function of `app.js` lines 2-259 plus the export helpers (`exportJSON`, `filesForExport`, `crc32`, `zipStored` as pure functions); `ui.js` holds the DOM code (`$`, `toast`, `getInputs`, the `state` object, `render*`, `wipe`, `recordOverride`, `download`, `attach`, import handling). Functions that read UI state take a trailing `ctx`.
2. **CLI:** six commands, `new`, `derive`, `compute`, `validate`, `diff`, `embed` (Task 2.10 fixes the syntax). Picking the saved file from Downloads is `validate --pick`.
3. **IDs:** entry `REL-03.2` (row ID, dot, entry number; `.1` is the primary entry); header rows `HDR-01` to `HDR-10`; overlay rows `OVL-01` to `OVL-12` per workload `WL-NN`; options `OPT-NN`; conditions `COND-NN`; exceptions `EXC-NN`; G3 checklist `G3-01` to `G3-14`; unknowns `QD-NN`; new calculations `CALC-21` (option TCO) and `CALC-22` (weighted score). Downstream citations: `PSDD/<ID>`.
4. **Rule renames:** see Q2; `DB-READ-11` becomes `DB-READ-17` in every case.
5. **G3 is signed in chat only**, at the skill's G3 stop, after the write-up and the review; the Studio shows the sign-off register read-only. Signers sign the content they reviewed.
6. **Option scores** (1 to 5 per criterion of the Standard's § 9.4 worksheet) are the architect's assessment: the agent proposes each with a one-line reason as `Estimated`, a person confirms; costs and weights come from a person (§ 11.22).
7. **DAT-07 isolation levels** (enum): `single`, `shared-logical`, `schema-isolated`, `database-isolated`, `deployment-isolated`. SDD Q7 options allowed: `single` gives Single tenant; `shared-logical` gives shared schema with `tenant_id`, schema per tenant, or database per tenant; `schema-isolated` gives schema per tenant or database per tenant; `database-isolated` and `deployment-isolated` give database per tenant. v2.2 import: `shared` to `shared-logical`, `isolated` to `database-isolated`, `single` to `single`.
8. **Stage 2 group order** (decision hierarchy, § 11.4): BUS, SEC, DAT, INT, CAP, REL, OPS, ECO. Inside a group: Open without a proposal, Open with a proposal, Estimated, then Confirmed and N/A, each by ID.
9. **Stage 1 rows** (Quick Discovery minimum numbers): HDR-07, HDR-08, BUS-05, CAP-01, CAP-03, CAP-04, CAP-07, REL-01, REL-03, REL-04, REL-05, DAT-02, ECO-01.
10. **Repeating rows:** BUS-02 per journey, CAP-01 per transaction type, CAP-07 per journey, REL-01 per journey, REL-03 per scope and journey, REL-04 per scope and dataset, REL-05 per failure scope, DAT-01 and DAT-05 per data workload, INT-01 and INT-03 per external system, every OVL row per workload. All other rows hold one entry.
11. **Default kinds:** `hard` for BUS-07, BUS-08, SEC-01, SEC-04, DAT-03, DAT-04, DAT-06; `forecast` for CAP-01, CAP-03, CAP-04, CAP-05, CAP-06, CAP-10, CAP-12, DAT-02; `assumption` for appendix factors and project defaults; `target` for every other row. A person or the skill may change a kind with a reason.
12. **Facts only a person gives** (`factOnly`: never proposed, never confirmed or set by a policy): CAP-01, CAP-03, CAP-04, CAP-05, CAP-06, CAP-10, CAP-12, DAT-02, INT-03, BUS-04, ECO-01, HDR-01 to HDR-06, and every option cost. Proposal rows: REL-01, REL-03, REL-04, CAP-07.
13. **Engine fragments:** the CLI renders the register tables, calculations, target shape, options, overlay, rule trace, validation, gate, and locked-items list as Markdown fragments; the skill pastes each between `<!-- ENGINE-FRAGMENT: <name> -->` and `<!-- /ENGINE-FRAGMENT -->` markers. No number in a chunk is worked out by hand.
14. **Change after G3:** each signature stores the state's `contentHash`; a different hash, or a `gate.reopened` mark the skill sets after a chunk content change, sends G3 back to review.
15. **SDD Pre-SDD check** is a new `### 2a. Pre-SDD check (DERIVE-FROM-BRD)` between steps 2 and 3, run as soon as the source BRDs are known and always before step 3a; no existing step is renumbered.
16. **Saved-file pickup:** the newest `pre-sdd-<slug>-state-<stamp>[ (N)].json` in the given folder whose modified time is after the HTML build time; the skill always confirms the path.
17. **Junction and listings run after the merge** (Task 11.3): the junction must point at the main checkout's folder, which holds only the old untracked demo files until the merge. Before the merge, Task 10.2 parses the front matter the way Codex and Kimi do (PyYAML, strict block scalar).
18. **Light run** skips: review passes beyond the baseline review plus one scoped application pass; diagrams other than infrastructure, network, and DR; option comparison beyond the recommended shape and one alternative (no weighted comparison unless weights are already approved); the closest-worked-example pointer. It never skips the engine run, any register row, the gate, or the handoff guide (§ 6.2).

## Review Focus

Inputs the design implies and no ordinary task test would catch; each line names the test that pins it.

1. **A blank number is unknown, never zero.** Clearing a value in the web form, a `""` in a patch, or a missing BRD figure leaves the entry `Open` with `null` and the engine shows `TBD`; `0` stays valid for RTO, RPO, and starting data. Tests: `applyPatch_setBlankNumber_keepsNullAndOpen`, `applyPatch_setZeroRpo_keepsZero` (Task 2.2), `fieldError_blankInput_noErrorAndOpen` (Task 3.2).
2. **Embedded state with hostile text.** A project or journey name holding `</script>`, `<!--`, `$&`, `$'`, or U+2028 must neither break the built page nor change on the way back. Tests: `buildStudio_hostileStateText_roundTrips` (Task 1.2, extended in Task 2.10), `cli_embed_hostileText_roundTrips` (Task 2.10).
3. **A change after G3 removes the authorization.** A web edit, a patch, or a chunk change after signing sends G3 back to review and `authorized_to_start_sdd` to false; the SDD then treats the Pre-SDD as not signed. Tests: `gateStatus_editAfterSign_backToReview`, `gateStatus_reopened_backToReview` (Task 2.8); scenario run in Task 7.4.
4. **Old and wrong files on import.** v2.2 `confirmed` statuses come in `Estimated`; a 3.0 `Confirmed` without who and when is downgraded with an advisory; a blueprint JSON given as a project file gives an error that says what to load instead; a deflated ZIP says to re-export. Tests: `normalizeState_confirmedWithoutWho_downgradedWithAdvisory` (Task 2.2); `importV22_confirmedStatus_becomesEstimated`, `importV22_blueprintJson_throwsActionableError`, `readStoredZip_deflatedEntry_throwsActionableError` (Task 2.3).
5. **Saved-file pickup on Windows.** Chrome's `(1)` duplicates, files saved before the HTML was built, and other projects' files must not be picked. Test: `pickSavedState_duplicatesOlderAndOtherSlug_picksNewestMatch` (Task 2.10).

## Working rules for the executor

- Paths: `MAIN` = `C:\Users\negat\.claude\skills` (the main checkout; other sessions work there, so read only); `WT` = `C:\Users\negat\.claude\skills-wt\pre-sdd-unifier` (this build); `SKILL` = `WT\pre-sdd-unifier`; `STUDIO` = `SKILL\studio`; `DL` = `C:\Users\negat\Downloads\pre-sdd-preparation`; `SCRATCH` = the session scratchpad. Use absolute paths in every command.
- Never start a Claude Code session inside `WT`: its MCP processes keep the folder locked after `git worktree remove`.
- A fresh `WT` checkout writes every tracked text file with CRLF (`core.autocrlf=true`), even files `MAIN` holds as LF (`hivantic-org-unifier/`, for example); `_fixtures/**` stays LF. Keep whatever ending a file has in `WT`; Task 11.2 restores `MAIN`'s endings when it copies.
- Fixture runs are background general-purpose subagents that read skills from `WT` on disk (never through the Skill tool), work non-interactively from a run brief, and write only to a `SCRATCH` run folder; results are copied into `_fixtures/` after the checks pass.
- `main` moves while this build runs (48d39c8 on 2026-10-23 touched `brd-unifier`, `sdd-unifier`, `lld-unifier`, `business-reviewer-unifier`, and `README.md`). Anchor edits on headings and quoted text, never on line numbers, and rebase at Task 5.1 and Task 11.1.

## File structure

```
pre-sdd-unifier/                         new skill (WT)
  SKILL.md                               workflow, arguments, answer policy, status board
  README.md                              design notes, layout, tests, how to run
  TEMPLATE-COMBINED.md                   single-file layout
  chunking.md                            chunk map, IDs, master progress table, combined mode
  decision-log.md                        companion register structure
  register-and-entries.md                rows, entries, record fields, statuses, sources, proposals
  prefill-and-derivation.md              trust order, derivation table, never-guess rule
  stages-and-input.md                    four stages, web path, prompt path, saving, resume
  engine-and-studio.md                   CLI use, embedding, getting the file back, parity check
  classification-and-paths.md            change type x target, hybrid, overlay, recovery tier
  gates-and-signoff.md                   G0-G3, G3 checklist, DT-01 to DT-15, roles, conditions, exceptions
  options-and-economics.md               shape-level options, hard-constraint filter, TCO, weights
  migration-overlay.md                   overlay fields, 7R, cutover rules, wave record
  handoff-guide.md                       chunk 12 contract and landing map
  review-and-open-items.md               reviewer brief, OI-NN format, accept loop
  chunks/                                pre-sdd-master.md, 00..13 with 03a..03h
  studio/
    src/engine.js  src/ui.js  src/shell.html  src/style.css
    build.mjs  cli.mjs  pre-sdd-studio.html  validate_handoff.py  CHANGELOG.md
    schema/architecture-blueprint.schema.json  schema/project-state.schema.json
    tests/*.test.mjs  tests/helpers.mjs  tests/MANUAL-CHECK.md
    tests/golden/regional-zero/  tests/golden/local-zero/   (extracted v2.2 example ZIPs)
  reference/   Standard, Quick Discovery Guide, policy-appendix.md, SOURCE.md
  examples/    Examples README, eight examples, ERRATA.md, SOURCE.md, studio-v2.2-export/
Modified: brd-unifier, sdd-unifier, lld-unifier, business-reviewer-unifier, pre-brd-unifier,
  impl-tracker-unifier, tutorialize-unifier, README.md, hivantic-org-unifier/*.md
Fixtures: _fixtures/checkers/{check_presdd.py, check_status_board.py, check_chain_skills.py}
  and tests; _fixtures/chain/run-<date>-psdd/; _fixtures/scenarios/pre-sdd-missing/,
  pre-sdd-unsigned/; _fixtures/README.md; _fixtures/notes/pre-sdd-build-<date>.md
Docs: docs/superpowers/specs/2026-10-23-pre-sdd-unifier-design.md and this plan (tracked or not: stop C1)
```

## Order, parallel work, and stops

| Phase | Tasks | Needs | Parallel |
|---|---|---|---|
| 0 Setup | 0.1, 0.2, 0.3 | answers to Q1, Q2 | 0.2 with 0.3 |
| 1 Engine extraction | 1.1, 1.2 | 0.2 | none (one file) |
| 2 Engine 3.0 | 2.1 to 2.10 | 1.2 | none (one file); 4.6 may run beside |
| 3 Studio 3.0 | 3.1 to 3.5 | 2.10 | 3.1 with 3.2; the phase runs beside Phases 4 to 6 |
| 4 Skill | 4.1 to 4.6 | 2.10 (4.6 needs only 0.3) | 4.2, 4.3, 4.4 together after 4.1's outline; 4.6 any time |
| 5 Board and roles | 5.1 | 4.1 | none |
| 6 Chain skills | 6.1 to 6.6 | 5.1 | 6.1, 6.4, 6.5, 6.6 together; 6.2 then 6.3 |
| 7 Fixtures | 7.1 to 7.5 | 3, 4, 6 (no engine change during runs) | 7.1, 7.2, 7.4 together; 7.3 after 7.2 |
| 8 README | 8.1 | 7 | none |
| 9 Company files | 9.1 | 8.1 | none |
| 10 Final checks | 10.1, 10.2 | 9.1 | checkers in 10.1 run in parallel |
| 11 Integrate | 11.1, 11.2, 11.3 | 10 | none |

**Stops (the executor stops and asks the owner):**
- **S0** now: approve this plan and answer Q1 and Q2.
- **C1** after Phase 1: commit the split (and decide whether `docs/superpowers/` is tracked on this branch; recommended yes, both files).
- **C2** after Phase 2: review the engine 3.0 test report and the decisions in `studio/CHANGELOG.md`; commit.
- **C3** after Phase 3: review `tests/MANUAL-CHECK.md`, open the Studio yourself (Firefox and Edge are owner checks), commit.
- **C4** after Phase 4: review SKILL.md and the rule files; commit.
- **C5** after Phases 5 and 6: review the chain diffs; commit.
- **C6** after Phase 7: review the fixture results; commit.
- **C7** after Phase 8: review the README; commit.
- **C8** after Phase 9: review the company-file sync and the new Company rules hash; commit.
- **C9** after Phase 10: review the consistency fixes and the verification record; commit.
- **R1** README merge (Task 11.1): rebase on main; when main's README changed since this branch started, review the merged README around every section both sides touched.
- **M1** merge (Task 11.2): approve the merge procedure.
- **P1** after the merge (Task 11.3): approve removing the old untracked copies in `MAIN` and removing the worktree.

---

## Phase 0: Setup

### Task 0.1: Worktree, branch, and untracked inputs

**Files:**
- Create: worktree `WT` on branch `feat/pre-sdd-unifier` from `main` (at 48d39c8 or later)
- Create in `WT`: `docs/superpowers/specs/2026-10-23-pre-sdd-unifier-design.md`, `docs/superpowers/plans/2026-10-23-pre-sdd-unifier-plan.md` (copies from `MAIN`, untracked there)
- Create in `WT`: `pre-sdd-unifier/examples/studio-v2.2-export/` (the 13 files of `MAIN\pre-sdd-unifier\`) and its `README.md`

**Interfaces:**
- Produces: `WT`, the branch, and the demo golden at `SKILL\examples\studio-v2.2-export\`.

- [ ] **Step 1: Check the repo state.** Run `git -C C:/Users/negat/.claude/skills worktree list`, `git -C C:/Users/negat/.claude/skills status --short`, `git -C C:/Users/negat/.claude/skills log -3 --oneline`. Expected: one worktree (main), untracked `docs/` and `pre-sdd-unifier/`, main at 48d39c8 or later. Anything else another session owns: leave it and say so.
- [ ] **Step 2: Create the worktree.** `git -C C:/Users/negat/.claude/skills worktree add -b feat/pre-sdd-unifier C:/Users/negat/.claude/skills-wt/pre-sdd-unifier main`.
- [ ] **Step 3: Copy the inputs** byte for byte (`cp`), then hash each source and copy with a SCRATCH script (`hashlib.sha256`); every pair must match.
- [ ] **Step 4: Write `examples/studio-v2.2-export/README.md`:** "Studio v2.2 handoff export in the old format (blueprint schema 1.0.0, project state version 2). Kept as a golden test input and as an IMPORT sample. It is not a Pre-SDD of record." Under Q1's alternative, apply the dash replacement to the 13 files here and record both hashes.
- [ ] **Step 5: Verify.** `git -C <WT> status --short` lists only `?? docs/` and `?? pre-sdd-unifier/`. No commit.

### Task 0.2: Reviewed Studio sources and golden exports

**Files:**
- Create: `STUDIO\src\app.js`, `STUDIO\src\shell.html`, `STUDIO\src\style.css` (copies of `DL\Pre-SDD_Architecture_Studio Visualizer\source\*`; `app.js` is a working input that Task 1.2 deletes)
- Create: `STUDIO\schema\architecture-blueprint.schema.json`, `STUDIO\validate_handoff.py` (copies)
- Create: `STUDIO\tests\golden\regional-zero\` and `STUDIO\tests\golden\local-zero\` (the two example ZIPs, extracted)
- Create: `STUDIO\CHANGELOG.md`

**Interfaces:**
- Produces: the three golden cases `regional-zero`, `local-zero`, `demo` (demo = `SKILL\examples\studio-v2.2-export\`), each with 13 files listed in its `manifest.json`.

- [ ] **Step 1: Copy and hash** the five source files and both ZIPs (record SHA-256 of each original).
- [ ] **Step 2: Extract the ZIPs** with `py -3 -I SCRATCH\tools\unzip.py <zip> <dest>` (Python `zipfile`, which strips absolute and parent paths). Expected: 13 files each, names equal to each `manifest.json` `files` list.
- [ ] **Step 3: Review the code copies** with a SCRATCH scan for `fetch(`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `sendBeacon`, `localStorage`, `sessionStorage`, `indexedDB`, `import(`, `eval(`, `new Function`, `<script src`, `<link`, `@import`, `url(http`. Expected: no match. Read `validate_handoff.py` in full: it reads one JSON file and the schema, and writes nothing.
- [ ] **Step 4: Confirm the v2.2 build identity:** `shell.html` with `/* STYLES */` replaced by `style.css` and `/* JAVASCRIPT */` by `app.js` equals `DL\...\Pre-SDD_Architecture_Calculator_v2_2.html` byte for byte. Expected `True` (verified during planning).
- [ ] **Step 5: Write `CHANGELOG.md`:** a `## 3.0.0 (in progress)` heading and an `## Imported from Studio v2.2` section with the hash table, the review result, and the build identity result.

### Task 0.3: Reference and example copies (parallel with 0.2)

**Files:**
- Create: `SKILL\reference\Pre-SDD_Architecture_Standard_v1.md`, `SKILL\reference\Pre-SDD_Quick_Discovery_Guide.md`, `SKILL\reference\SOURCE.md`
- Create: `SKILL\examples\PreSDD_Examples_README.md`, the eight `SKILL\examples\PreSDD_*_*.md`, `SKILL\examples\SOURCE.md`

- [ ] **Step 1: Copy** (per Q1) and hash every file.
- [ ] **Step 2: Write both `SOURCE.md` files:** origin path, copy date (UTC), SHA-256 of original and copy, "verbatim" (or the replacement rule), and the known broken relative links: the Standard's `./PreSDD_*.md` and `./PreSDD_Examples_README.md` now live in `../examples/`; the examples' `./Pre-SDD_Architecture_Standard_v1.md` lives in `../reference/`; the link to `Pre-SDD_Project_Intake_Template.md` points at a file left out by decision (§ 2 item 7).
- [ ] **Step 3: Verify** hashes, file counts (2 and 9), and that `SOURCE.md` files contain no em or en dash.

---

## Phase 1: Engine extraction with v2.2 parity

### Task 1.1: `engine.js` extracted, byte parity on three v2.2 exports

**Files:**
- Create: `STUDIO\src\engine.js`
- Create: `STUDIO\tests\helpers.mjs`, `STUDIO\tests\golden-bytes.test.mjs`, `STUDIO\tests\engine-v22.test.mjs`

**Interfaces:**
- Consumes: `STUDIO\src\app.js` (Task 0.2), the golden cases.
- Produces (global `PreSddEngine`, and `module.exports` under Node): every pure name of `app.js` unchanged (`fieldIds`, `numIds`, `critical`, `reqIDs`, `units`, `defaults`, `presets`, `known`, `fmt`, `compact`, `time`, `cl`, `safeMul`, `classify`, `calculations`, `defaultDR`, `drNames`, `topoNames`, `inferredKind`, `selectArchitecture`, `decisionRules`, `providerCatalog`, `kindColors`, `mermaid`, `diagramSVG`, `yaml`, `runBrief`, `drLadderEntries`, `crc32`, `escapeHtml` (was `E`), `escapeXml` (was `X`)), these with a trailing `ctx`: `validate(v,c,a,ctx)`, `catalogFor(provider,v,a,ctx)`, `buildDiagrams(v,c,a,provider,ctx)`, `drawio(diagrams,ctx)`, `blueprint(v,c,a,rules,val,graph,ctx)`, `markdownReport(v,c,a,rules,val,graph,bp,ctx)`, `optionalDiagramIDs(v,ctx)`, `filteredGraph(graph,v,ctx)`, `zipStored(files,ctx)`, and three new ones: `projectStateV22(v,ctx)` (the `project_state` object of `exportJSON`), `modelV22(v,ctx)` returning `{v,c,a,rules,val,graph}` with `graph = buildDiagrams(v,c,a,'logical',ctx)`, `exportFiles(model,ctx)` returning the 13 files of `filesForExport` in the same key order.
- `ctx` = `{ fieldStatus, extras, decisionHistory, scenario, provider, showOptional, now }`; `now` is an ISO string or undefined (then the current time).
- Wrapper: `(function (factory) { const api = factory(); if (typeof module === 'object' && module.exports) module.exports = api; else globalThis.PreSddEngine = api; })(function () { 'use strict'; ... return { ... }; });` (load under Node with `createRequire`; verified on Node 24.14.0).

- [ ] **Step 1: Write `helpers.mjs`:** `loadEngine()` (createRequire on `../src/engine.js`), `readText(path)` (UTF-8, CRLF to LF), `normalizeTimestamps(text)` (replace `/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z/g` with `<UTC>`), and `goldenCase(name)` returning `{ dir, file(rel), manifest, projectState, ctx }`, where `ctx` comes from `project-state.json` (`statuses`, `extraWorkloads`, `history`, `provider`, `showOptional`), `scenario` is `'blank'` for `regional-zero` and `local-zero` and `'cloudSaaS'` for `demo` (its requirement sources read `scenario`), and `now` is the blueprint's `validation.checked_at`.
- [ ] **Step 2: Write the failing golden test:**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadEngine, goldenCase, readText, normalizeTimestamps } from './helpers.mjs';
const E = loadEngine();
for (const name of ['regional-zero', 'local-zero', 'demo']) {
  test(`exportFiles_golden_${name}_matchesV22Bytes`, () => {
    const g = goldenCase(name);
    const files = E.exportFiles(E.modelV22(g.projectState.inputs, g.ctx), g.ctx);
    assert.deepEqual(Object.keys(files), g.manifest.files);
    for (const [path, text] of Object.entries(files)) {
      assert.equal(normalizeTimestamps(text), normalizeTimestamps(readText(g.file(path))), path);
    }
  });
}
```

- [ ] **Step 3: Run** `node --test "<STUDIO>/tests/*.test.mjs"`. Expected: FAIL, cannot find `../src/engine.js`.
- [ ] **Step 4: Create `engine.js`.** Move the pure code of `app.js` without changing any string, number, or order. Allowed edits only: the wrapper; `state.fieldStatus|extras|decisionHistory|scenario|provider|showOptional` read from `ctx`; every `new Date()` becomes `nowDate(ctx)` (`ctx && ctx.now ? new Date(ctx.now) : new Date()`); `E` and `X` renamed; the three new functions lifted from `exportJSON`, `model`, and `filesForExport`.
- [ ] **Step 5: Run.** Expected: the three golden tests PASS (39 files equal). A mismatch is an extraction error; fix `engine.js`, never the golden.
- [ ] **Step 6: Write `engine-v22.test.mjs`:**

```js
test('defaultDR_thresholds_matchV22', () => {
  const v = (rtoSec, rpoSec, failureScope = 'region', budget = 'balanced') => ({ rtoSec, rpoSec, failureScope, budget });
  const cases = [
    [v(30, 0), 'active'], [v(31, 0), 'warm'], [v(900, 900), 'warm'], [v(901, 900), 'warm'],
    [v(901, 901), 'pilot'], [v(3600, 900), 'warm'], [v(3601, 900), 'pilot'],
    [v(14400, 3600, 'region', 'tight'), 'pilot'], [v(14401, 3600, 'region', 'tight'), 'backup'],
    [v(14401, 3599, 'region', 'tight'), 'pilot'], [v(14401, 3600, 'region', 'balanced'), 'pilot'],
    [v(60, 0, 'provider'), 'active'], [v(61, 0, 'provider'), 'warm'],
    [v(5, 5, 'az'), 'localHA'], [v(5, 5, 'host'), 'localHA'],
    [v(0, 60, 'cyber'), 'cyberReview'], [v(60, 60, 'cyber'), 'backup'],
    [v(null, 60), 'unresolved'], [v(60, 60, 'unknown'), 'unresolved'],
  ];
  for (const [input, want] of cases) assert.equal(E.defaultDR(input), want, JSON.stringify(input));
});
```

  Also: `cl_outOfRangeInputs_returnNull` (utilization 0 and 1.01, availability 0 and 100.1, cidrPrefix 15 and 29 and 20.5, annualGrowth -100, peakFactor 0.9 all give `null`; availability 100, cidrPrefix 16 and 28, annualGrowth -99 give the number), `calculations_blankDailyTxn_chainIsNull` (CALC-01 to CALC-04 results `null`, substitution text `TBD`), `calculations_zeroRpo_exposureIsZero`, `classify_hybridTarget_returnsTwoSubAssessments` (`GF-OP + GF-CL`).
- [ ] **Step 7: Run all tests.** Expected: PASS.

### Task 1.2: `ui.js`, shell placeholders, `build.mjs`, browser smoke check

**Files:**
- Create: `STUDIO\src\ui.js`, `STUDIO\build.mjs`, `STUDIO\pre-sdd-studio.html` (built), `STUDIO\tests\build.test.mjs`, `STUDIO\tests\sources.test.mjs`
- Modify: `STUDIO\src\shell.html` (replace `<script>/* JAVASCRIPT */</script>` with `<script>/* ENGINE */</script><script type="application/json" id="embedded-state">/* PROJECT_STATE */</script><script>/* UI */</script>`)
- Delete: `STUDIO\src\app.js`

**Interfaces:**
- Consumes: Task 1.1 API.
- Produces: `export function buildStudio({ srcDir, state = null }) -> string` in `build.mjs`; command `node build.mjs [--state <file.json>] [--out <file.html>]` (default out `STUDIO\pre-sdd-studio.html`); the embedded-state script holds `null` or the state JSON with `<`, U+2028, and U+2029 written as `\u003c`, `\u2028`, `\u2029`.

- [ ] **Step 1: Write the failing tests** in `build.test.mjs`: `buildStudio_blank_embedsEngineByteForByte` (the text between the engine `<script>` tags equals `engine.js` read with CRLF to LF), `buildStudio_blank_embedsUiStyleAndNullState`, `buildStudio_sourceWithDollarPatterns_keepsLiteral` (a temp `srcDir` whose `engine.js` contains `$&` and `$'`), `buildStudio_hostileStateText_roundTrips` (state `{ "name": "</script><!-- $& $' \u2028 x" }`: the built page has one closing tag per script, and parsing the embedded JSON gives the same object), `buildStudio_committedHtml_isUpToDate` (fresh build equals `pre-sdd-studio.html`, CRLF to LF). In `sources.test.mjs`: `sources_noNetworkOrStorageApis_absent` (scan list of Task 0.2 Step 3 over `src\*`, allowing `http://www.w3.org/2000/svg`), `sources_noClosingScriptTag_inScripts`.
- [ ] **Step 2: Run.** Expected: FAIL (no `build.mjs`).
- [ ] **Step 3: Implement `ui.js`** as the DOM code of `app.js` inside `(() => { 'use strict'; const { ... } = globalThis.PreSddEngine; ... })();` with a `uiCtx()` that builds `ctx` from the UI `state` (no `now`). Implement `buildStudio` with function replacers (`s.replace(marker, () => text)`), sources read as UTF-8 with CRLF to LF, output LF.
- [ ] **Step 4: Build and run.** `node <STUDIO>\build.mjs`; tests PASS.
- [ ] **Step 5: Browser smoke check (Playwright MCP).** Open `file:///C:/Users/negat/.claude/skills-wt/pre-sdd-unifier/pre-sdd-unifier/studio/pre-sdd-studio.html` (if the MCP refuses `file://`, serve `STUDIO` with `py -3 -m http.server 8765 --bind 127.0.0.1 --directory <STUDIO>` in the background for this check only, then stop it). Select scenario `regionalPayments`. Expected: `#mPeak` reads `4,629.63`, `#mRps` reads `10.37K`, no console error; Export ZIP produces a download named `Pre-SDD_Architecture_Handoff.zip`. Record the result for Task 3.5's report.
- [ ] **Step 6: Run all tests.** Expected: PASS. Then **stop C1** (commit message proposal: `refactor(pre-sdd-unifier): split Studio v2.2 into engine.js and ui.js with byte parity`; and `docs: add the pre-SDD unifier design and plan` if the owner tracks `docs/superpowers/`).

---

## Phase 2: Engine 3.0

All Phase 2 tasks edit `engine.js` and run in order. Every test passes `now` explicitly. Every task in Phases 2 and 3 runs `node <STUDIO>\build.mjs` before `node --test` (the up-to-date test compares the committed HTML with a fresh build). The v2.2 layer (`validate`, `blueprint`, `markdownReport`, `runBrief`, `exportFiles`, `projectStateV22`, `modelV22`) stays callable until Task 3.4, because the v2.2 `ui.js` still uses it; 3.0 functions therefore take new names.

### Task 2.1: Register catalogue

**Files:**
- Modify: `STUDIO\src\engine.js`
- Create: `STUDIO\tests\catalogue.test.mjs`

**Interfaces:**
- Produces constants: `ENGINE_VERSION = '3.0.0'`, `SKILL_VERSION = '1.0.0'`, `STATE_SCHEMA_VERSION = '3.0.0'`, `BLUEPRINT_SCHEMA_VERSION = '2.0.0'`; `GROUPS` (`BUS` Business, `CAP` Capacity, `REL` Reliability, `DAT` Data, `SEC` Security, `INT` Integration, `OPS` Operations, `ECO` Economics, with chunk letters a to h in that order); `GROUP_ORDER = ['BUS','SEC','DAT','INT','CAP','REL','OPS','ECO']`; `ITEMS` (70 rows); `HEADER_FIELDS` (HDR-01 solution name, 02 business sponsor, 03 product owner, 04 lead architect, 05 architecture review authority, 06 business budget owner, 07 change type `greenfield|brownfield|mixed`, 08 intended target `onprem|cloud|hybrid|undecided`, 09 source platforms, 10 migration direction `none|onprem-to-cloud|cloud-to-cloud|cloud-to-onprem|same-platform|mixed`); `OVERLAY_FIELDS` (OVL-01 to OVL-12, the Standard's § 8 fields in table order); `FACTORS`; `APPENDIX` (filled in Task 2.4); `SIGNOFF_ROLES` (the 11 roles of Standard § 11.2 in table order, keys snake_case, `migration_owner` applies only with the overlay); `G3_CHECKLIST` (the 14 lines of Standard § 11.1 as `G3-01` to `G3-14`); `V22_FIELD_MAP`; `REQ_TO_ITEM`; `LANDINGS`.
- Row shape: `{ id, group, owners, ask, impacts: { infrastructure, network, software }, repeat, defaultKind, stage1, valueType, unit, enumValues, factors, factOnly, proposable, landing }`.

- [ ] **Step 1: Write the failing tests:** `ITEMS_count_is70`; `ITEMS_groupCounts_matchStandard` (8, 12, 10, 9, 8, 9, 8, 6); `ITEMS_askAndImpacts_matchStandardRows` (parse the § 4 tables of `reference\Pre-SDD_Architecture_Standard_v1.md`; strip `**` and `*`; compare cell text and owner codes exactly); `ITEMS_repeatKinds_matchPlan` (decision 10); `ITEMS_stage1_matchDiscoveryMinimum` (decision 9); `ITEMS_defaultKinds_matchPlan` (decision 11); `ITEMS_factOnlyAndProposable_matchPlan` (decision 12); `FACTORS_attachToExistingRows`; `V22_FIELD_MAP_coversEveryV22Field` (every `fieldIds` entry mapped or listed as dropped: `approver`, `approveReqs`, `approveSecurity`, `approveArchitecture`, `approveRisks`, `evidenceRef`, `owner`); `LANDINGS_useAllowedTargetsOnly`; `GROUP_ORDER_isDecisionHierarchy`.
- [ ] **Step 2: Run.** Expected: FAIL.
- [ ] **Step 3: Add the constants.** `FACTORS` attachments: `callsPerTxn`, `requestFactor` to CAP-02; `utilization` to CAP-04; `meanLatencyMs` to CAP-07; `requestKB`, `responseKB`, `networkOverhead` to CAP-06; `storedKB`, `initialGB`, `retentionDays`, `indexFactor`, `copies` to DAT-02; `cidrPrefix` to INT-08; `transactionNeed` to DAT-05; `queryShape` to CAP-10; `storeKind` to DAT-01; `budgetPressure` to ECO-01; `primaryLocation`, `recoveryLocation` to DAT-04; `migrationGB` to OVL-07; `linkMbps` to OVL-08; `cutoverHours` to OVL-09. Row values that feed the calculator: CAP-01 transactions per day, CAP-04 peak multiplier, CAP-05 percent per year, CAP-07 P99 ms, CAP-10 read percent, REL-01 percent, REL-03 seconds, REL-04 seconds, REL-05 scope `host|az|site|region|provider|cyber`, DAT-03 `public|internal|sensitive`, DAT-04 `yes|no`, DAT-05 `strong|mixed|eventual`, DAT-07 (decision 7), INT-08 `public|private|hybrid|partner`, BUS-01 text. `V22_FIELD_MAP` follows these attachments, plus `solutionName` to HDR-01, `brdRef` to the project BRD keys, `changeType` to HDR-07, `target` to HDR-08, `sourcePlatform` to the overlay source, `migration` to `overlay.applies`, `topologyOverride`, `drOverride`, `overrideReason` to `decisions`, and v2.2 extra workloads to DAT-01 and DAT-05 entries 2 and up. `REQ_TO_ITEM`: REQ-PLAT-001 HDR-07, REQ-PLAT-002 HDR-08, REQ-CAP-001 CAP-01, REQ-CAP-002 CAP-04, REQ-CAP-003 CAP-05, REQ-PERF-001 CAP-07, REQ-REL-001 REL-01, REQ-DR-001 REL-03, REQ-DR-002 REL-04, REQ-DR-003 REL-05, REQ-ECO-001 ECO-01, REQ-DAT-001 DAT-01, REQ-DAT-002 DAT-05, REQ-SEC-001 DAT-03, REQ-SEC-002 DAT-04, REQ-NET-001 INT-08, REQ-MIG-001 OVL-04. `LANDINGS` (allowed targets `Project Type`, `Q3`, `Q7`, `Q8`, `§6 Notes`, `§8.3`, `§11`, `§18`, `§18.5`, `§19`, `§20`): HDR-07 Project Type; HDR-08 Q8 and §8.3; CAP-01 to CAP-07, CAP-09, CAP-10, DAT-02, DAT-08 §18 and Q3; REL-01, REL-02 §18.5 and Q3; REL-03 to REL-05 §11, §18.5, §19, §20; REL-06, REL-07, OPS-06, DAT-09 §20; DAT-03, DAT-04, DAT-06, SEC-01 to SEC-08 §11 and §6 Notes; DAT-05, INT-02, INT-04, INT-05 §6 Notes and §8.3; DAT-07 Q7 and §11; INT-08 §8.3 and §11; OPS-04 §19; ECO-01, ECO-03 §6 Notes; every other row lands nowhere (cited only).
- [ ] **Step 4: Run.** Expected: PASS.

### Task 2.2: Project state 3.0, patches, hashes

**Files:**
- Modify: `STUDIO\src\engine.js`
- Create: `STUDIO\schema\project-state.schema.json`, `STUDIO\tests\state.test.mjs`, `STUDIO\tests\pyschema.mjs` (spawns `py -3 -I` on Windows, else `python3 -I`; skips with a note when neither exists)

**Interfaces:**
- Produces: `newState({ name, slug, brds, mode, input, light, now })`, `normalizeState(state, { now }) -> { state, advisories }`, `entryId(rowId, n)`, `parseEntryId(id)`, `rowEntries(state, rowId)`, `primaryEntry(state, rowId)`, `applyPatch(state, ops, actor, { now }) -> { state, changes, errors }` (pure; returns a new state; an op with an error changes nothing), `sha256Hex(text)`, `contentHash(state) -> 'sha256:<64 hex>'`, `saveFileName(slug, nowIso)`.
- State contract (`project-state.schema.json`, draft 2020-12, `additionalProperties: false` at every level):

```json
{
  "kind": "pre-sdd-project-state", "schema_version": "3.0.0", "engine_version": "3.0.0",
  "project": { "name": "", "slug": "", "pre_sdd_version": "1.0",
               "brds": [ { "key": "REFUNDS", "path": "../brd-refunds-portal/refunds-portal-brd-master.md", "version": "1.5", "status": "Draft" } ] },
  "run": { "mode": "full", "input": "prompt", "light": false, "stage": 1, "group": "BUS", "policy": null },
  "register": { "header": { "HDR-01": [] }, "items": { "BUS-01": [] },
                "overlay": { "applies": false, "source": "unknown", "workloads": [ { "id": "WL-01", "name": "" } ], "rows": { "OVL-01": [] } } },
  "options": { "list": [], "weights": null, "horizon_months": null },
  "decisions": { "topology_override": "auto", "dr_overrides": {}, "override_reason": "", "chosen_option": null },
  "gate": { "checklist": {}, "signoffs": [], "conditions": [], "exceptions": [], "reopened": null },
  "unknowns": [], "history": [],
  "ui": { "person": "", "provider": "logical", "diagram": "infrastructure", "show_optional": false }
}
```

  Entry: `{ n, primary, label, scope, workload, value, unit, window, measured_at, priority (Must|Should|Could), kind (hard|target|forecast|assumption), verification, status (Confirmed|Estimated|Open|N/A), na_reason, source: { type (none|brd|derived|answer|default|policy|fixture|import), text }, owner, owner_name, due, evidence, confirmed_by, confirmed_at, proposal (null or { value, reason, by, at }), factors: { <name>: { value, status, source, confirmed_by, confirmed_at } } }`. Option: `{ id, name, shape: { hosting, topology, dr, data, network }, one_time, monthly, scores }`, costs `{ value, status, by, at }`, score `{ value 1..5, reason, status, by, at }`; weights `{ values, approved_by, approved_at }`. Signoff: `{ role, applicable, na_reason, name, decision (Approved|Approved with conditions|Rejected), at, content_hash, stand_in }`. Condition `{ id, text, owner, due }`. Exception `{ id, entry, reason, granted_by, granted_at, expires, review }`. Unknown `{ id, entry, question, impact, owner, due }`. Policy `{ label, set_by, set_at, stand_ins }`.
- Actor: `{ type: 'person'|'policy'|'fixture'|'agent', name, label }`. Ops: `set`, `add`, `remove`, `set-factor`, `confirm`, `confirm-group`, `propose`, `accept-proposal`, `na`, `open`, `set-option`, `set-cost`, `set-score`, `set-weights`, `check`, `sign`, `add-condition`, `add-exception`, `reopen`.
- Rules the ops enforce: an agent never confirms, accepts, signs, grants, or approves weights; agent writes are `Estimated` (sources `brd`, `derived`, `default`, `import`); a person's `set` is `Estimated` with source `Answer: <name>, <YYYY-MM-DD>` until `confirm`; `confirm` records `confirmed_by` (person name, `Policy: ...` label, or `Fixture: <owner> (test-run policy)`) and `confirmed_at`; a policy never sets, confirms, or answers a `factOnly` row or a cost; `accept-proposal` sets the value, source `Answer: <name>, <date> (proposal accepted)` or the policy label, status `Confirmed`; proposals only on proposable rows and only by an agent; `na` needs a reason; `add` and `remove` only on repeating rows, never the primary entry; a blank or empty value becomes `null` with status `Open`; `sign` needs a person, or a policy whose `stand_ins` includes `Approver` (labelled `Stand-in: Approver (<policy>, set by <name>, <date>)`), and stores `contentHash`; `add-exception` needs a person (never `Stand-in:` or `Policy:`).
- `contentHash` covers `project` without `pre_sdd_version`, `register`, `options`, `decisions`, `gate.checklist`, `gate.conditions`, `gate.exceptions`, and `unknowns`, as canonical JSON (keys sorted, no spaces); `sha256Hex` is a pure JavaScript SHA-256 (no `crypto`, so the same code runs in the browser).

- [ ] **Step 1: Write the failing tests:** `newState_minimal_hasEveryRowOpenWithOnePrimary` (70 items, 10 header rows, `null` values, status `Open`, owner codes from the catalogue); `applyPatch_setBlankNumber_keepsNullAndOpen` (set REL-04.1 to `""` after 60: value `null`, status `Open`, never `0`); `applyPatch_setZeroRpo_keepsZero`; `applyPatch_agentConfirm_rejected`; `applyPatch_personConfirm_setsWhoAndWhen` (`confirmed_at` equals `now`); `applyPatch_policySetFactOnlyRow_rejected` (CAP-01); `applyPatch_policyConfirmFactOnlyRow_rejected`; `applyPatch_fixtureConfirmFact_labelled`; `applyPatch_acceptProposalByPerson_confirmedWithAnswerSource`; `applyPatch_acceptProposalByPolicy_confirmedWithPolicyLabel`; `applyPatch_proposeOnFactRow_rejected` (CAP-01); `applyPatch_naWithoutReason_rejected`; `applyPatch_addOnSingleRow_rejected`; `applyPatch_removePrimary_rejected`; `applyPatch_signByAgent_rejected`; `applyPatch_exceptionByStandIn_rejected`; `sha256Hex_vectors_matchFips` (`''` gives `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`, `'abc'` gives `ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad`, `'abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq'` gives `248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1`); `contentHash_uiOrSignoffChange_unchanged`; `contentHash_entryChange_changes`; `normalizeState_confirmedWithoutWho_downgradedWithAdvisory` (advisory `STATUS-<entry>`); `saveFileName_slugAndNow_usesUtcStamp` (`refunds-platform`, `2026-10-23T11:01:02Z` gives `pre-sdd-refunds-platform-state-20261023T110102Z.json`); `projectStateSchema_newState_validates` (via `pyschema.mjs`).
- [ ] **Step 2: Run.** Expected: FAIL.
- [ ] **Step 3: Implement** the functions and the schema.
- [ ] **Step 4: Run.** Expected: PASS.

### Task 2.3: v2.2 import, the calculator adapter, computed-field parity

**Files:**
- Modify: `STUDIO\src\engine.js`
- Create: `STUDIO\tests\import.test.mjs`, `STUDIO\tests\golden-fields.test.mjs`

**Interfaces:**
- Consumes: `V22_FIELD_MAP`, `newState`, `applyPatch`.
- Produces: `importV22(input, { now, name, slug }) -> state` (input: a v2.2 `project_state`, a `{ project_state, blueprint }` save, or ZIP bytes); `readStoredZip(bytes) -> { [name]: string }` (stored entries only, CRC checked); `toCalcInputs(state) -> { v, ctx }` (a v2.2-shaped `v` from primary entries and factors; `Open` and `N/A` give `null`; `ctx` from state); `compute(state, { now }) -> model` (Task 2.3 returns `{ v, c, a, rules, graph }`; later tasks add fields).

- [ ] **Step 1: Write the failing tests:** `importV22_goldenProjectState_everyValueEstimated` (source `Import: Studio v2.2`, no `Confirmed`); `importV22_confirmedStatus_becomesEstimated`; `importV22_saveWrapper_readsProjectState`; `importV22_blueprintJson_throwsActionableError` (message names `architecture-blueprint.json` and asks for `project-state.json` or the save file); `readStoredZip_zipStoredOfGoldenFiles_returnsSameTexts` (build the ZIP with `zipStored`, which writes v2.2's format); `readStoredZip_deflatedEntry_throwsActionableError` (method 8: "re-export the ZIP from the Studio, or extract it and import project-state.json"); `importV22_zipBytes_readsProjectState`; `toCalcInputs_importedGolden_roundTripsV22Inputs` (for the three goldens, every mapped field equals the v2.2 input; `tenantModel` maps per decision 7); `compute_importedGolden_matchesV22ComputedFields` (per golden, against its `architecture-blueprint.json`: calculation IDs and values, the PAT-TOPO-001 and PAT-DR-001 names, rule IDs, and the component and connection IDs after `filteredGraph`; Task 2.5 adds the `CONFLICT-*` IDs compared without their `@<scope>` suffix, and Task 2.6 maps rule IDs through `RULE_RENAMES`).
- [ ] **Step 2: Run.** Expected: FAIL.
- [ ] **Step 3: Implement.** Import sets `register.header`, `register.items`, `overlay`, and `decisions` per `V22_FIELD_MAP`; numbers through `cl` validity; the `scenario` of a v2.2 file is not imported.
- [ ] **Step 4: Run.** Expected: PASS. This golden test is the lasting parity test (§ 10 "Golden").

### Task 2.4: Defaults appendix, project defaults, derivation

**Files:**
- Modify: `STUDIO\src\engine.js`
- Create: `SKILL\reference\policy-appendix.md`, `STUDIO\tests\defaults.test.mjs`

**Interfaces:**
- Produces: `APPENDIX = { version: '1', approved_by: 'Mahmoud (owner)', approved_at: '2026-10-23', values: { utilization: 0.65, networkOverhead: 1.2, indexFactor: 1.4, copies: 2, meanLatencyMs: 120, callsPerTxn: 3, requestFactor: 1.1 } }`; `applyDefaults(state, { now }) -> { state, changes }`; `derive(state, { now }) -> { state, changes }`.
- Defaults fill only `Open` factors and rows: appendix factors with source `Default: policy appendix v1`, kind `assumption`; project defaults only for OPS-04 (`dev, test, stage, prod`, plus `dr` when a REL-05 entry is `site`, `region`, or `provider`) and CAP-08 (`Ingress edge; successful and failed requests measured separately`), source `Default: project rule OPS-04` or `CAP-08`.
- Derivation fills only `Open` primary values: CAP-02 from CALC-03 (`Derived: CALC-03 from CAP-01, CAP-04, CAP-02`), DAT-02 from CALC-10 (`Derived: CALC-10 from CAP-01, DAT-02`); status `Estimated`, kind `forecast`; a missing input leaves the row `Open` and the calculation `TBD`.
- `policy-appendix.md`: purpose (the Standard's "separately approved policy appendix"), the seven-row table (factor, key, default, unit), version 1, "Approved by Mahmoud (owner) on 2026-10-23 (UTC)", the rule that every project pre-fills them as `Estimated` and a person confirms them per group, and the change rule (owner approval and a new version).

- [ ] **Step 1: Write the failing tests:** `APPENDIX_values_matchPolicyAppendixFile` (parse the table); `applyDefaults_newState_fillsSevenFactorsEstimated`; `applyDefaults_confirmedFactor_untouched`; `applyDefaults_projectDefaults_onlyOps04AndCap08`; `derive_cap01AndDefaults_setsCap02To165` (CAP-01 864000, CAP-04 5, appendix factors: CAP-02 value within 1e-9 of 165); `derive_dat02_fromCap01AndStoredKb` (storedKB 2 gives 1.728); `derive_answeredCap02_notOverwritten`; `derive_missingCap01_leavesCap02OpenAndTbd`.
- [ ] **Step 2: Run.** Expected: FAIL.
- [ ] **Step 3: Implement** and write `policy-appendix.md`.
- [ ] **Step 4: Run.** Expected: PASS.

### Task 2.5: DR per failure scope, target shape, recovery tier

**Files:**
- Modify: `STUDIO\src\engine.js`
- Create: `STUDIO\tests\scopes.test.mjs`

**Interfaces:**
- Produces: `assessScopes(state, v, c) -> Scope[]` with `Scope = { entry, scope, rto, rpo, rtoEntry, rpoEntry, strategy, topoCandidate, arch }` (one per REL-05 entry; `rto` is the smallest known REL-03 value with that scope, `rpo` the smallest REL-04; `strategy` from `defaultDR` with the scope's values, or `decisions.dr_overrides[scope]`); `conflictsFor(v, a) -> [{ id, msg, owner }]` (the `CONFLICT-*` clauses of v2.2 `validate`, same order and text; v2.2 `validate` keeps its own copy until Task 3.4 deletes it); `targetShape(state, scopes) -> { topology, topologySource, strategies, replication, conflicts }` (topology is the override or the strongest candidate in the order `undetermined, single, multiAZ, multiAZActive, regional, active`; replication per scope `synchronous` at RPO 0, `asynchronous` above, `TBD` unknown; conflicts are `conflictsFor` per scope with the shared topology and that scope's strategy, IDs suffixed `@<scope>`); `recoveryTier(scopes) -> 'Simple'|'Complex'|null` (Simple when every scope has RTO and RPO above 21600 s; Complex when some scope has both below 10 s); `closestExample(pathCode, tier)` (`PreSDD_<GF|BF>_<CL|OP>_<Simple|Complex>.md`, else `null`).

- [ ] **Step 1: Write the failing tests:** `assessScopes_azAndRegion_localHaAndWarm` (az RTO 5 RPO 0; region RTO 600 RPO 60); `assessScopes_twoRegionRtos_usesSmallest` (600 and 300 give 300); `assessScopes_scopeWithoutRto_unresolved`; `assessScopes_duplicateScope_blocker` (`DUPLICATE-SCOPE@region`); `targetShape_azAndRegion_topologyRegional`; `targetShape_overrideMultiAzWithRegion_conflictAtRegion` (`CONFLICT-region@region`); `targetShape_rpoZeroRegion_synchronousAndConflict` (`CONFLICT-rpo0@region`); `assessScopes_boundaries_followThresholds` (the Task 1.1 table through scopes); `recoveryTier_examples` (both 12 h gives Simple; az 8 s and 3 s gives Complex; 600 s gives null); `closestExample_gfClComplex_returnsFile`.
- [ ] **Step 2: Run.** Expected: FAIL.
- [ ] **Step 3: Implement;** `compute` now also returns `scopes` and `shape`; extend `compute_importedGolden_matchesV22ComputedFields` with the conflict IDs.
- [ ] **Step 4: Run.** Expected: PASS.

### Task 2.6: Rules and validation 3.0

**Files:**
- Modify: `STUDIO\src\engine.js`
- Create: `STUDIO\tests\validation.test.mjs`
- Delete: `STUDIO\tests\golden-bytes.test.mjs` (the renames change v2.2 output on purpose; `golden-fields.test.mjs` from Task 2.3 is the lasting parity test)

**Interfaces:**
- Produces: `RULE_RENAMES = { 'DB-READ-11': 'DB-READ-17', 'CAP-04': 'LOAD-04' }` (second entry per Q2); `decisionRules` emits renamed IDs; the DR family (`DR-03`, `DR-06`, `DR-ZERO-01`, `DR-ZERO-02`, `DATA-07`, `DATA-08`, `SLO-15`) runs once per scope with IDs suffixed `@<scope>` when there are two or more scopes; `validateState(state, model, { now }) -> { blockers, conflicts, advisories }` (each `{ id, msg, owner, entry? }`).
- Blocker IDs: `OPEN-<entry>` for a `hard` entry that is `Open` with no valid exception; `INVALID-<entry>.<field>`; `DT-01-STOP` (BUS-01 or HDR-02 `Open`); `DT-02-BLOCK@<entry>` (a CAP-07 entry with priority Must and no value); `DT-03-BLOCK@<scope>` (a REL-05 scope without RTO or RPO); `DT-11-BLOCK@<workload>` (overlay applies and OVL-04 `Open`); `DT-15-BLOCK` (G3 checklist G3-11 not done while blockers exist); `DUPLICATE-SCOPE@<scope>`. Conflicts: the scope conflicts of Task 2.5. Advisories: the v2.2 warning IDs that still apply, plus `STATUS-<entry>` from `normalizeState`.
- Exception validity: a person in `granted_by`, `expires` on or after the UTC date of `now`, `review` on or before `expires`; it lifts only `OPEN-<entry>` and the DT block resting on that entry.

- [ ] **Step 1: Write the failing tests:** `validateState_hardOpenWithoutException_blocker` (`OPEN-DAT-04.1`); `validateState_hardOpenWithValidException_noBlocker`; `validateState_expiredException_blocker`; `validateState_targetOpen_notBlocker`; `validateState_bus01Open_dt01Stop`; `validateState_mustP99Open_dt02Block`; `validateState_scopeWithoutRpo_dt03Block`; `validateState_overlayWithout7R_dt11Block`; `validateState_invalidUtilization_invalidBlocker` (`INVALID-CAP-04.1.utilization`); `decisionRules_readPercentKnown_emitsDbRead17`; `decisionRules_capacityRule_emitsLoad04`; `rules_twoScopes_drFamilySuffixed`; `ruleIds_neverEqualItemIds`; `rules_everyRuleId_hasTriggerCase` (a table of inputs that triggers each rule ID once).
- [ ] **Step 2: Run.** Expected: FAIL.
- [ ] **Step 3: Implement;** `compute` returns `rules` and `validation`; delete `golden-bytes.test.mjs`.
- [ ] **Step 4: Run** all tests, including `golden-fields` (rename table applied). Expected: PASS.

### Task 2.7: Options, TCO, weighted score

**Files:**
- Modify: `STUDIO\src\engine.js`
- Create: `STUDIO\tests\options.test.mjs`

**Interfaces:**
- Produces: `CRITERIA` (the Standard § 9.4 worksheet columns after the hard-constraint column: `nfr_fit`, `one_time_cost`, `recurring_tco`, `delivery_time`, `operability`, `security_compliance`, `reversibility`, `uncertainty`); `computeOptions(state, model) -> { list: [{ id, name, hardPass, oneTime, monthly, tco, weighted, unknowns }], horizonMonths, weighted: boolean, flags }`. `horizonMonths` comes from ECO-03 (months). CALC-21 `tco = oneTime + horizonMonths * monthly` per option (`null` and an unknown when any input is missing); CALC-22 `weighted = sum(w * s) / sum(w)` over criteria with both a weight and a score, only when weights are approved, else the comparison is unweighted and `flags` holds `UNWEIGHTED`. `hardPass` is false when the option's shape breaks a hard entry or a conflict; such an option is never ranked.

- [ ] **Step 1: Write the failing tests:** `computeOptions_costsAndHorizon_tco280000` (100000 one time, 5000 monthly, 36 months); `computeOptions_missingMonthly_tbdAndUnknown`; `computeOptions_noApprovedWeights_unweightedFlag`; `computeOptions_approvedWeights_weighted3point2` (weights `{ one_time_cost: 3, reversibility: 2 }`, scores 4 and 2); `computeOptions_hardFail_notRanked`; `computeOptions_calcRows_cite21And22`.
- [ ] **Step 2: Run.** Expected: FAIL.
- [ ] **Step 3: Implement;** `compute` returns `options` and adds CALC-21 and CALC-22 rows to `c.rows`.
- [ ] **Step 4: Run.** Expected: PASS.

### Task 2.8: Gates G0 to G3 and per-role sign-off

**Files:**
- Modify: `STUDIO\src\engine.js`
- Create: `STUDIO\tests\gate.test.mjs`

**Interfaces:**
- Produces: `gateStatus(state, model, { now }) -> { g0, g1, g2, g3, label, authorized }`.
  - `g0`: met when HDR-02, HDR-04, BUS-01, and BUS-03 are not `Open`.
  - `g1`: met when every register row has a status and every `Open` entry has `owner_name` and `due`.
  - `g2`: `{ result: 'shortlist'|'blocker'|'incomplete', missing }`; shortlist when every scope has a strategy other than `unresolved`, at least one option has `hardPass`, and every overlay workload has OVL-04 set; blocker when a blocker is recorded instead.
  - `g3`: `{ status: 'Not signed'|'Approved'|'Approved with conditions'|'Blocked'|'Review', missingRoles, problems }`: Blocked on any blocker after exceptions, any `Rejected` sign-off, or a condition without owner or due; Review when any sign-off's `content_hash` differs from `contentHash(state)` or predates `gate.reopened.at`; Not signed while an applicable role is unsigned or a G3 checklist line is neither done nor N/A with a reason; otherwise Approved with conditions when any sign-off says so or a condition exists, else Approved. A stand-in sign-off counts only when the run's policy names the Approver stand-in and nothing else fails.
  - `label`: `Discovery` in quick mode (no gate claimed), else the highest met gate, or `G3 Approved`, `G3 Approved with conditions`, `Blocked`.
  - `authorized`: true only for the two approved G3 statuses.

- [ ] **Step 1: Write the failing tests:** `gateStatus_noSignoffs_notSigned`; `gateStatus_allRolesApproved_approvedAndAuthorized`; `gateStatus_conditionWithOwnerDue_approvedWithConditions`; `gateStatus_conditionWithoutDue_blocked`; `gateStatus_missingApplicableRole_notSigned`; `gateStatus_migrationOwnerNoOverlay_notRequired`; `gateStatus_roleNotApplicableWithReason_notRequired`; `gateStatus_standInWithoutPolicy_notSigned`; `gateStatus_standInWithPolicy_approved`; `gateStatus_namedException_hardOpenPasses`; `gateStatus_editAfterSign_backToReview`; `gateStatus_reopened_backToReview`; `gateStatus_g1OpenWithoutDue_notMet`; `gateStatus_quickMode_labelDiscovery`; `gateStatus_rejectedRole_blocked`.
- [ ] **Step 2: Run.** Expected: FAIL.
- [ ] **Step 3: Implement;** `compute` returns `gate`.
- [ ] **Step 4: Run.** Expected: PASS.

### Task 2.9: Blueprint 2.0.0, schemas, validator, writers, fragments

**Files:**
- Modify: `STUDIO\src\engine.js` (add the 3.0 writers; `mermaid`, `drawio`, `yaml`, `diagramSVG`, `buildDiagrams`, and `zipStored` take the 3.0 text; the v2.2 writers stay until Task 3.4)
- Modify: `STUDIO\schema\architecture-blueprint.schema.json` (to 2.0.0), `STUDIO\validate_handoff.py`
- Create: `STUDIO\tests\blueprint.test.mjs`, `STUDIO\tests\fragments.test.mjs`

**Interfaces:**
- Produces: `handoffBlueprint(state, model, { now })` (schema 2.0.0); `saveWrapper(state, model, { now }) -> { kind: 'pre-sdd-save', saved_at, project_state, blueprint }`; `readSave(json) -> { state, blueprint }`; `fragments(state, model) -> { [name]: markdown }` with names `01-header.md`, `02-classification.md`, `03a-register-business.md` to `03h-register-economics.md`, `04-calculations.md`, `05-target-shape.md`, `07-options.md`, `08-overlay.md`, `09-rule-trace.md`, `10-validation.md`, `11-gate.md`, `12-locked-items.md`; `previewFiles(state, model, { now })` (the standalone ZIP set: `Pre-SDD-preview.md`, `architecture-blueprint.json`, `architecture-blueprint.yaml`, `project-state.json`, `diagrams/*.mmd`, `diagrams/architecture.drawio`, `Validation_Report.md`, `Decision_Record.md`, `manifest.json`; no run brief); `zipStored(files, ctx)` with DOS time and date from the UTC fields of `ctx.now`.
- Blueprint 2.0.0 (§ 6.5 fixes): `schema_version` `2.0.0`; `project` gains `slug` and `path_code`; `sources.brds` from `project.brds` with key pattern `^[A-Z0-9]+(-[A-Z0-9]+)*$`; `sources.engine { name: 'pre-sdd-engine', version }` and `sources.skill { name: 'pre-sdd-unifier', version }` replace `sdd_skill.sha256`; `requirements` are register entries (`id` = entry ID, `item`, `group`, record fields, `status` lowercased with `n/a` as `not_applicable`), DAT-07 included; rules, calculations, and components cite row IDs through `REQ_TO_ITEM`; `dr_scenarios` one per scope; `options` with CALC-21 and CALC-22; `decisions` allow `ADR-CAND-<rule>` and `ADR-<AREA>-<NNN>`; `governance { pre_sdd_gate, gate_status (draft|provisional|approved|conditionally_approved|blocked), signoffs, conditions, exceptions, approved_at, authorized_to_start_sdd }` following G3; `validation { export_status (provisional|approved_technical_handoff|blocked), sdd_source_intake (awaiting_brds|ready_for_reconciliation|blocked), blockers, conflicts, advisories, checked_at }`.
- House text: no em or en dash in any string the engine writes (`mermaid` comment `%% <title> - PROPOSED / NOT AN APPROVED DESIGN`, draw.io `<title> - <subtitle> (PROPOSED)`, `agent="Pre-SDD Architecture Studio 3.0.0"`); the authority text says the Pre-SDD is locked for the SDD once G3 is signed and the SDD raises an open item owned by the E2E Architect instead of changing a locked item; manifest flags `preview_only: true`, `pre_sdd_of_record: false`, `pre_sdd_locked_for_sdd: true`, `sdd_raises_open_items_on_conflict: true`; provider names are labelled illustration only.
- `validate_handoff.py` 2.0.0: schema path `schema/architecture-blueprint.schema.json`; checks of the v2.2 script kept where the field still exists; cited row IDs must exist among requirement `item` values; `approved_technical_handoff` needs G3 approved or conditionally approved, `authorized_to_start_sdd`, at least one signoff, no blockers, no open conflict; conditional approval needs conditions with owner and due; exit codes unchanged (0 pass, 2 fail, 3 unreadable).

- [ ] **Step 1: Write the failing tests:** `handoffBlueprint_newState_schemaValid` (via `pyschema.mjs` running `validate_handoff.py`); `handoffBlueprint_signedState_approvedAndAuthorized` (`--require-approved` passes); `handoffBlueprint_unsignedState_provisionalNotAuthorized`; `handoffBlueprint_brdKeys_passPattern` (`REFUNDS`, `RESELLER-PORTAL`); `handoffBlueprint_sources_engineAndSkillVersions_noSha`; `handoffBlueprint_dat07_inRequirements`; `writers_everyOutput_noEmOrEnDash`; `previewFiles_manifest_previewAndLockedFlags`; `previewFiles_noRunBrief`; `zipStored_dosTime_fromUtc`; `saveWrapper_readSave_roundTrips`; `fragments_register_rowsAndValues` (03c lists REL-03 entries with value, unit, status, source); `fragments_calculations_tbdNeverZero`; `fragments_lockedItems_usesLandings`; `fragments_everyChunkFragment_noEmOrEnDash`; `handoffBlueprint_everyTestBlueprint_validates` (every blueprint built in this file goes through `validate_handoff.py`).
- [ ] **Step 2: Run.** Expected: FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** all tests. Expected: PASS.

### Task 2.10: The CLI

**Files:**
- Create: `STUDIO\cli.mjs`, `STUDIO\tests\cli.test.mjs`
- Modify: `STUDIO\build.mjs` (export `buildStudio` for `embed`)

**Interfaces:**
- Commands (paths may hold spaces; `--now <ISO>` on every command for tests; output UTF-8, LF):

```
node cli.mjs new <project-dir> --name "<name>" [--slug <slug>] --brd <KEY>=<path>@<version>[:<status>] ... [--mode full|quick] [--input web|prompt] [--light] [--import <v22.json|v22.zip>]
node cli.mjs derive <state.json> [--apply <patch.json>] [--actor <actor.json>]
node cli.mjs compute <state.json> --out <dir>
node cli.mjs validate <file.json> [--pick <folder> --slug <slug> --since <ISO>]
node cli.mjs diff <blueprint-a.json> <blueprint-b.json>
node cli.mjs embed <state.json> --out <file.html>
node cli.mjs --version
```

  `new` writes `<project-dir>/studio/project-state.json` (refuses when it exists), then applies defaults and derivation. `derive` applies the patch file (`{ "actor": {...}, "ops": [...] }`), defaults, and derivation, writes the state back, and prints JSON `{ changes, errors, counts: { open, estimated, confirmed, na }, gate }`. `compute` writes `model.json`, `blueprint.json`, `blueprint.yaml`, `fragments/*.md`, `diagrams/*.mmd`, `diagrams/architecture.drawio`. `validate` detects the kind (3.0 state, save wrapper, v2.2 project, blueprint), validates, prints `PASS` or `FAIL` lines; with `--pick` it first prints the chosen file (decision 16). `diff` compares calculations, rules, validation, scopes, shape, options, and gate; exit 1 lists each difference by path. `embed` builds the Studio with the state. `--version` prints `engine 3.0.0, skill 1.0.0`. Exit codes: 0 ok, 1 differences (`diff`), 2 invalid input or failed validation, 3 usage. `export function pickSavedState(entries, slug, sinceIso)` is importable (main runs only when the file is the entry point).

- [ ] **Step 1: Write the failing tests** (each spawns `process.execPath` on `cli.mjs` in a temp folder whose path contains a space): `cli_new_pathWithSpaces_writesState`; `cli_new_existingState_exit2`; `cli_derive_applyPatch_printsSummary`; `cli_derive_policyOnFactRow_exit2ListsError`; `cli_compute_writesModelBlueprintFragmentsDiagrams`; `cli_validate_detectsFourKinds`; `cli_validate_invalidState_exit2`; `cli_diff_identical_exit0`; `cli_diff_changedCalc_exit1NamesField`; `cli_embed_hostileText_roundTrips`; `pickSavedState_duplicatesOlderAndOtherSlug_picksNewestMatch` (entries `pre-sdd-a-state-20261023T100000Z.json` 10:00, `pre-sdd-a-state-20261023T100000Z (1).json` 10:05, `pre-sdd-a-state-20261023T090000Z.json` 09:00, `pre-sdd-b-state-20261023T110000Z.json` 11:00, since 09:30: picks the `(1)` file); `cli_unknownCommand_exit3`; `cli_version_printsBoth`.
- [ ] **Step 2: Run.** Expected: FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** all tests and rebuild the blank Studio. Expected: PASS. Then **stop C2** (proposal: `feat(pre-sdd-unifier): engine 3.0 with register, scopes, options, gates, blueprint 2.0.0, and CLI`), with a report of test counts and the CHANGELOG decisions.

---

## Phase 3: Studio 3.0

### Task 3.1: Palette tokens and contrast

**Files:**
- Modify: `STUDIO\src\style.css`
- Create: `STUDIO\tests\style.test.mjs`

- [ ] **Step 1: Write the failing tests:** `style_hexOnlyInRootTokens` (outside `:root` blocks, no `#rgb`/`#rrggbb` literal); `tokens_textPairs_meet4point5` (WCAG relative luminance on each declared text and background pair, at least 4.5:1); `tokens_keyColors_present` (`--teal: #0c8286`, `--dark: #0c2138`).
- [ ] **Step 2: Run.** Expected: FAIL.
- [ ] **Step 3: Move every color into `:root` tokens;** darken a failing token to the nearest shade that passes (computed during planning: `--amber #a66a1e` on white 4.47:1, the note grey `#697d8f` on white 4.26:1, and `--muted #64758b` on `--bg #f3f6f9` 4.34:1 fail; teal `#0c8286` on white is 4.61:1 and passes); record each change in `CHANGELOG.md`.
- [ ] **Step 4: Run.** Expected: PASS.

### Task 3.2: Stages 1 and 2: the register UI

**Files:**
- Modify: `STUDIO\src\ui.js`, `STUDIO\src\shell.html`, `STUDIO\src\engine.js`
- Create: `STUDIO\tests\view.test.mjs`

**Interfaces:**
- Produces in the engine: `registerView(state, { stage, group }) -> [{ rowId, title, owners, kind, entries: [{ id, status, needsAnswer, proposal, sourceText, factors }] }]` (stage 1: the stage-1 rows; stage 2: one group in `GROUP_ORDER`, ordered per decision 8); `fieldError(rowId, field, raw) -> null | string` (a message that says how to fix, for example "Availability is a percentage above 0 and at most 100, for example 99.9."; blank gives `null`).
- UI: a stage stepper (1 Discovery, 2 Register, 3 Assess, 4 Confirm and decide); stage 2 group tabs; one card per row with its entries; per entry the record fields, a status chip, the source text, the proposal box with Accept, Add and Remove for repeating rows, sizing factors folded under their row; a required "Your name" field before any Confirm tick; "Confirm all pre-filled values in this group"; every change goes through `applyPatch` with a person actor and re-renders derived values; validation on blur through `fieldError`; every control labelled, keyboard reachable, visible focus.

- [ ] **Step 1: Write the failing tests:** `registerView_stage1_onlyStage1Rows`; `registerView_stage2Group_needsAnswerFirst`; `registerView_groupOrder_followsDecisionHierarchy`; `fieldError_blankInput_noErrorAndOpen`; `fieldError_availability150_explainsFix`; `fieldError_utilizationZero_explainsFix`.
- [ ] **Step 2: Run.** Expected: FAIL.
- [ ] **Step 3: Implement** the engine functions, the stage 1 and 2 views in `ui.js`, and the shell markup.
- [ ] **Step 4: Run** tests and rebuild. Expected: PASS.

### Task 3.3: Stages 3 and 4: assess, confirm, decide

**Files:**
- Modify: `STUDIO\src\ui.js`, `STUDIO\src\shell.html`

- [ ] **Step 1: Stage 3 view:** metrics, the calculation table (`TBD` for unknowns), scopes with strategy and replication, target shape and conflicts, diagrams with the provider tab opening on Logical and labelled illustration only, options with costs entered by a person, architect scores shown as `Estimated` until confirmed, weights with "approved by", TCO and the unweighted flag, the overlay table when it applies.
- [ ] **Step 2: Stage 4 view:** every `Estimated` value still standing, grouped, one Confirm per group; decisions (topology override, per-scope DR override, override reason required, chosen option); validation (blockers, conflicts, advisories); the gate panel with G0 to G3 and the sign-off register read-only, with the note that G3 is signed in chat after the write-up and review.
- [ ] **Step 3: Rebuild;** all tests PASS; `sources.test.mjs` still finds no network or storage API. Spot check in the browser (Playwright MCP): stages 3 and 4 render for the Task 3.5 check project, a blank input shows `TBD` in the calculation table, and the console shows no error.

### Task 3.4: Save, import, embedded state, preview ZIP

**Files:**
- Modify: `STUDIO\src\ui.js`, `STUDIO\src\shell.html`

- [ ] **Step 1:** On load, a non-null `#embedded-state` is read through `normalizeState`; Import accepts a 3.0 state, a save file, a v2.2 project file, or a v2.2 ZIP (through `importV22` and `readStoredZip`) and shows the engine's error text on failure.
- [ ] **Step 2:** Save downloads `saveWrapper` under `saveFileName(slug, now)`; the preview ZIP downloads `previewFiles` as `pre-sdd-<slug>-preview-<stamp>.zip`, labelled "Preview, not the Pre-SDD of record".
- [ ] **Step 3: Remove the v2.2 layer** (`validate`, `blueprint`, `markdownReport`, `runBrief`, `exportFiles`, `projectStateV22`, `modelV22`) now that `ui.js` no longer calls it; a search of `src\` and `tests\` finds no caller; `conflictsFor` is the only home of the conflict clauses.
- [ ] **Step 4: Rebuild;** all tests PASS. Spot check in the browser: importing the demo golden `project-state.json` and a `zipStored` ZIP of the `local-zero` files shows their values as `Estimated`.

### Task 3.5: Manual Studio check through the Playwright MCP

**Files:**
- Create: `STUDIO\tests\MANUAL-CHECK.md`

- [ ] **Step 1: Make a check project:** `node cli.mjs new <SCRATCH>\studio-check --name "Check </script> Project" --brd REFUNDS=../brd/x.md@1.0`, apply a patch with BRD-sourced values and one proposal (REL-01), then `node cli.mjs embed ... --out <SCRATCH>\studio-check\studio.html`.
- [ ] **Step 2: In the browser** (file URL, or the 127.0.0.1 server of Task 1.2 Step 5): the form opens filled with no import step; stage 1 shows only stage-1 rows; blanking RPO shows `TBD`, not 0; an invalid availability shows the fix message on blur; Accept on the REL-01 proposal sets `Confirmed` with the name entered; Confirm all in a group works; Tab reaches every control with a visible focus ring; the console shows no error.
- [ ] **Step 3: Save, re-import, parity:** save the state (if the MCP hides the download path, call `PreSddEngine.saveWrapper` through `browser_evaluate` and write its JSON to SCRATCH); `node cli.mjs validate --pick ...` picks it; re-import it in a fresh page and confirm the same values; `node cli.mjs compute` on the saved state, then `node cli.mjs diff` against the saved blueprint: exit 0.
- [ ] **Step 4: Record** each check with PASS or FAIL, screenshots in SCRATCH, the Chromium version, and "Firefox and Edge: owner check at C3" in `MANUAL-CHECK.md`. Then **stop C3** (proposal: `feat(pre-sdd-unifier): Studio 3.0 register, stages, save, and import`); offer to open the Studio.

---

## Phase 4: The skill

### Task 4.1: `SKILL.md`

**Files:**
- Create: `SKILL\SKILL.md`

**Interfaces:**
- Consumes: the CLI (Task 2.10) and the rule-file names in the file structure.
- Produces: the workflow that Tasks 4.2 to 4.4 detail, by file name and heading.

- [ ] **Step 1: Front matter** (976 characters, counted):

```yaml
---
name: pre-sdd-unifier
description: >-
  Run a Pre-SDD (pre-solution design) for one system from its finished BRDs: the E2E Architect hop
  between brd-unifier and sdd-unifier. Use when asked to create, run, resume, or update a Pre-SDD,
  an architecture discovery, NFR sizing, or a capacity, latency, availability, RTO and RPO, DR
  strategy, hosting shape, or TCO assessment before an SDD; to import a Pre-SDD Architecture Studio
  project or handoff ZIP; or to answer an SDD open item on a locked Pre-SDD item. Covers all 70
  checklist items of the Pre-SDD Standard through gates G0-G3, with a person confirming every value
  and signing G3 per role. Input comes through the offline Studio web form or through chat, and one
  shared engine (Node.js) computes both. It settles numbers and shape, never products, versions, or
  the architecture style; its signed handoff guide locks them for sdd-unifier. Arguments:
  [quick|full] [web|prompt] [chunks|combined] [light], default full. Output is Markdown plus the
  Studio project file.
---
```

- [ ] **Step 2: Body sections,** in house style (compare `sdd-unifier/SKILL.md`): title; role line `You act as the E2E Architect (Software Development & Delivery) in the unifier company.`; `## Running outside Claude Code` (tool mapping table as in sdd-unifier, plus opening the Studio: `Start-Process` on Windows, `open` on macOS, `xdg-open` on Linux; Node.js required, check `node --version`, stop and say so when missing, never compute by hand); `## Argument parsing: do this first` (§ 6.2; words count as arguments; `### Light run` per decision 18); `## Core principles` (§ 2 items 2, 3, 4, 11, 12, 17, 18, 19, 20; § 3 anti-goals as rules); `## Workflow` with steps 1 resolve arguments and resume (§ 6.9), 2 status board, 3 intent (§ 6.1), 4 start conditions (§ 6.1: every BRD finished, no part `Pending` or `In progress`; ask once when a BRD is not `Approved`; with no BRD, refuse and point to `brd-unifier`; one Pre-SDD per system, with the parent BRDs the SDD will have) and intake (at most three questions, plus the confirmer's name), 5 engine setup (`cli.mjs new`), 6 pre-fill and proposals (`prefill-and-derivation.md`), 7 stage 1 (quick mode ends here with chunks 00, 01, 02, 03a to 03h, 10 and the board row `Done v1.0`), 8 stage 2 and the G1 review stop, 9 stage 3 and the G2 review stop, 10 stage 4, 11 write-up (`cli.mjs compute`, fragments into chunks, prose around them), 12 review and open items (`review-and-open-items.md`), 13 G3 sign-off stop (`gates-and-signoff.md`), 14 hand-off (board row, request to the Software Architect, solo or team behaviour, and the handoff summary: gate, signers, engine version, version, open conditions and exceptions, unknowns with owner and due, open items by status, the questions only a BRD owner can answer (each raised as a request to `brd-unifier`), and "When an answer policy was set, the policy choices without a source: each recommended option it took that adds behaviour no source states, by ID with the behaviour it adds, for the owner's review; `None` when it took none."); `### Answer policy` (house rules, decision 12, the test-run policy for fixtures, stand-ins sign roles only when the conditions hold, never exceptions); `## Later requests` (table: "BRD `KEY` has a new version", an SDD open item on a locked item, an owner's change, import, re-sign after a change, open the Studio, merge and re-chunk, sign-off); `## Output conventions` (§ 6.6 folder and files, IDs per decision 3, one update one version with `Chunks:`, UTF-8 LF, no dashes, UTC); `## Things this skill never does` (§ 3 anti-goals); `## Reference files`. Task 5.1 adds `## Status board`.
- [ ] **Step 3: Verify:** description length and PyYAML parse (`py -3 -I -c` with `yaml.safe_load` on the front matter); every file and heading the body names exists by the end of Phase 4 (rerun at Task 4.5); no em or en dash.

### Task 4.2: Register, pre-fill, input, and engine rules

**Files:**
- Create: `SKILL\register-and-entries.md`, `SKILL\prefill-and-derivation.md`, `SKILL\stages-and-input.md`, `SKILL\engine-and-studio.md`

- [ ] **Step 1: `register-and-entries.md`:** the row families (70 items, header, overlay, factors), entries (decision 10, primary required, others optional), the record fields and allowed values (Task 2.2 contract in prose), statuses and when each applies, the source texts, the blocking rule for hard `Open` entries, proposals (§ 6.4 Proposals, decision 12), who confirms (§ 6.4), entry IDs and `PSDD/<ID>` citations, rule IDs per Q2.
- [ ] **Step 2: `prefill-and-derivation.md`:** the trust order (§ 6.4), the never-guess rule, and this derivation table (BRD chunk numbers are `brd-unifier` chunks; a BRD value is pre-filled only when the BRD states it; vague words such as "fast" stay `Open`, with a proposal where the row allows one):

| Rows | Read in the BRD | Engine or default |
|---|---|---|
| BUS-01, BUS-03 | 01 objectives and background, 04 scope | |
| BUS-02 | 05 journeys and Use Case Summary (one entry per journey) | |
| BUS-04, BUS-08 | 01, 02 constraints, 08 partners | |
| BUS-05 | 02 dependencies (Needed before), 01 deadlines | |
| BUS-06, BUS-07 | 04 personas and geography, 11 locale, 02 constraints, 12 Technical Inputs | |
| CAP-01, CAP-03, CAP-04, CAP-05 | 10 NFR measures, 02 facts, 09 volumes | CAP-04 factor `utilization` (appendix) |
| CAP-02 | | Derived from CALC-03; factors `callsPerTxn`, `requestFactor` (appendix) |
| CAP-06 | 12 Technical Inputs | factor `networkOverhead` (appendix) |
| CAP-07, CAP-08, CAP-09 | 10 performance measures, 06x deadlines, 09 freshness | CAP-07 factor `meanLatencyMs` (appendix); CAP-08 project default |
| CAP-10, CAP-11, CAP-12 | 09 schedules, 08 failure handling, 04 scope | |
| REL-01 to REL-10 | 10 availability and recovery measures, 06x exception flows, 02 | |
| DAT-01, DAT-05 | 03 domain concepts and lifecycles, 06x business rules (one entry per workload) | |
| DAT-02 | 02 facts, 09, 10 | Derived from CALC-10; factors `indexFactor`, `copies` (appendix) |
| DAT-03, DAT-04, DAT-06, DAT-07, DAT-08, DAT-09 | 10 security and privacy, 02 constraints, 04 tenants, 09, 12 Technical Inputs | |
| SEC-01 to SEC-08 | 02 constraints, 04 personas, 07 matrix, 08 partners, 10, 12 Technical Inputs | |
| INT-01 to INT-09 | 08 integrations (one INT-01 and INT-03 entry per partner), 12 Technical Inputs | |
| OPS-01 to OPS-08 | 10, 02 | OPS-04 project default |
| ECO-01 to ECO-06 | 01, 02 constraints | |
| HDR-01 to HDR-10 | 00 cover, 01, 04, 12 Technical Inputs | |

  Every pre-filled value cites `BRD: <KEY>/<ID>` or the chunk (`BRD: REFUNDS 10`), status `Estimated`.
- [ ] **Step 3: `stages-and-input.md`:** the four stages (§ 6.4 table), what ends each, the web path (embed, open, the person saves, `validate --pick`, copy to `studio/project-state.json`, `diff` against the saved blueprint, report any difference), the prompt path (same rows and order; batches of up to four through AskUserQuestion in Claude Code, numbered questions elsewhere; "keep or change" for pre-filled values; one "confirm all pre-filled values in this group" per group; the project file written after every answered batch through `derive --apply`), the master's progress table and the board row naming the next stage and group after every batch and every save, switching paths at a stage boundary, resume (§ 6.9).
- [ ] **Step 4: `engine-and-studio.md`:** every CLI command with an example on a path with spaces, exit codes, where the files land in `./pre-sdd-[slug]/studio/`, the fragments and their markers (decision 13), the parity check, the preview ZIP, what to do when Node.js is missing.
- [ ] **Step 5: Verify:** relative links resolve; every CLI flag named exists in `cli.mjs --help` output or the usage text; no em or en dash.

### Task 4.3: Path, gate, option, and overlay rules

**Files:**
- Create: `SKILL\classification-and-paths.md`, `SKILL\gates-and-signoff.md`, `SKILL\options-and-economics.md`, `SKILL\migration-overlay.md`

- [ ] **Step 1: `classification-and-paths.md`:** § 6.3 in full, the Standard § 7 per-path evidence and required outputs as short lists, the recovery tier and closest example (Task 2.5), when chunks 06 and 08 exist.
- [ ] **Step 2: `gates-and-signoff.md`:** G0 to G3 exit criteria (Standard § 11 and Task 2.8), the G3 checklist `G3-01` to `G3-14` (Standard § 11.1 text), DT-01 to DT-15 with their STOP and BLOCK outcomes (Standard § 9.3; which ones the engine checks), the sign-off register roles and applicability, one person holding several roles (default: the owner holds all), outcomes, conditions, exceptions (named person only), change after G3 (decision 14), the G1 and G2 review stops.
- [ ] **Step 3: `options-and-economics.md`:** shape-level options only (§ 6.5), the hard-constraint filter, the criteria, costs and weights from a person, architect scores (decision 6), TCO and the unweighted flag, light-run limits.
- [ ] **Step 4: `migration-overlay.md`:** Standard § 8 fields per workload (OVL-01 to OVL-12), the 7R definitions and selection policy (§ 8.1), hazards (§ 8.2, § 8.3), cutover rules (§ 8.4), the wave record, DT-11.
- [ ] **Step 5: Verify** links, IDs against the engine constants, no em or en dash.

### Task 4.4: Templates, handoff guide, review brief

**Files:**
- Create: `SKILL\chunks\pre-sdd-master.md`, `SKILL\chunks\00-cover-and-changelog.md`, `01-business-brief.md`, `02-classification-and-path.md`, `03a-register-business.md`, `03b-register-capacity.md`, `03c-register-reliability.md`, `03d-register-data.md`, `03e-register-security.md`, `03f-register-integration.md`, `03g-register-operations.md`, `03h-register-economics.md`, `04-targets-and-calculations.md`, `05-target-shape.md`, `06-existing-estate.md`, `07-options-and-economics.md`, `08-migration-overlay.md`, `09-decisions.md`, `10-validation-risks-unknowns.md`, `11-gate-and-sign-off.md`, `12-sdd-handoff-guide.md`, `13-open-items-and-clarifications.md`
- Create: `SKILL\TEMPLATE-COMBINED.md`, `SKILL\chunking.md`, `SKILL\decision-log.md`, `SKILL\handoff-guide.md`, `SKILL\review-and-open-items.md`

- [ ] **Step 1: Chunk templates** per § 6.6: each opens with a `<!-- CHUNK: NN ... -->` block (`TITLE`, `PROJECT`, `VERSION`, `DEPENDS_ON`, `PART OF: Pre-SDD - [Project Name]`) and closes with `<!-- MASTER: [project-slug]-pre-sdd-master.md | PREV: ... | NEXT: ... -->`; fragment markers where Task 2.9 renders content; every register row a `### <ROW-ID>` heading followed by a bold title line and its entries table (so `PSDD/<ID>` links resolve to `#<row-id>`); chunk 00 has Document Lineage (Source BRDs with keys, consuming SDD), gate state, engine version, Changes Log, indexes; chunk 09 holds the requirement-to-consequence trace, the decision tree (`DT-NN`), the rule trace, and the Pre-SDD ADRs per § 6.10 (ADR-DR-001, ADR-DATA-001, and the hosting part of ADR-PLATFORM-001; ADR-PERF-001, ADR-INT-001, and ADR-IAM-001 are named as SDD ADRs with the answers that drive them); chunk 11 has the checklist, sign-off register, conditions, exceptions, and "SDD initiation authorized by".
- [ ] **Step 2: `pre-sdd-master.md`:** the index and the progress table (stage, group, gate, write-up, review, handoff), plus `**Generation:**` and the gate line.
- [ ] **Step 3: `12-sdd-handoff-guide.md` and `handoff-guide.md`:** the § 6.6 contract: version, gate state, signers, engine version; the locked-items fragment (ID, value, where it lands per `LANDINGS`); what is left to the SDD; the open-item rule (an SDD chunk 18 item owned by `E2E Architect (pre-sdd-unifier)` plus a handoff request, never an edit); time-bound exceptions and unknowns with owner and due; the citation format `PSDD/<ID>` with a link; the guide is self-contained, because the SDD never reads this skill's rule files.
- [ ] **Step 4: `chunking.md`, `TEMPLATE-COMBINED.md`, `decision-log.md`:** chunk map (quick and full, brownfield and overlay rules; an omitted chunk is omitted, not stubbed), combined file `PRE-SDD-[ProjectName]-vX.Y.md` plus `studio/`, merge and re-chunk; the decision-log registers (Clarification, Marker, Business review, Walkthrough and delegation history, Proposal record, Sign-off record).
- [ ] **Step 5: `review-and-open-items.md`:** the cleared-context reviewer brief (chunk 13, `OI-NN` with options, Recommended Answer, Why; checks: every value has a source, no guessed business number, chunk numbers equal the fragments, shape only and no product, hard `Open` items, conflicts, the lock list complete, IDs, no dashes), the accept loop, at most three review passes per request, delta review on later updates (§ 6.8).
- [ ] **Step 6: Verify:** every template has its header and footer; PREV and NEXT chain without gaps; fragment names match `fragments()` keys; no em or en dash.

### Task 4.5: Skill README and release notes

**Files:**
- Create: `SKILL\README.md`
- Modify: `STUDIO\CHANGELOG.md`

- [ ] **Step 1: `README.md`:** what the skill is, the layout, the engine and Studio design (split, UMD, build, CLI, fragments), versions and where they live (`ENGINE_VERSION`, `SKILL_VERSION` in `engine.js`), how to run the tests, the parity rules, the decisions of this plan, the Q1 and Q2 outcomes.
- [ ] **Step 2: `CHANGELOG.md` 3.0.0:** every § 6.5 fix, the rule renames, the palette changes, schema 2.0.0, project-state 3.0.0.
- [ ] **Step 3: Verify the whole skill folder:** a SCRATCH script checks every relative link and anchor in `SKILL\*.md` and `SKILL\chunks\*.md`; SKILL.md names only files that exist; `node --test` passes; dash scan clean outside the Q1 exemptions. Then **stop C4** (proposal: `feat(pre-sdd-unifier): add the skill, rule files, templates, reference, and examples`).

### Task 4.6: `ERRATA.md` for the worked examples (parallel, any time after 0.3)

**Files:**
- Create: `SKILL\examples\ERRATA.md`

- [ ] **Step 1: Re-verify each candidate** from the design (§ 9: two sizing figures that look wrong; "MODELED PASS" on stress tests that fail by the examples' own numbers; copy-paste leaks) with SCRATCH scripts run as `py -3 -I` against the repo copies: recompute § 3 figures from each example's own stated inputs (TPS to RPS, CPU, in-flight, bandwidth, storage; flag a difference above 1 percent); compare every PASS verdict in §§ 12 and 14 with the example's own measured or modeled numbers; search each example for another example's project, system, or provider names.
- [ ] **Step 2: Write `ERRATA.md`** with only verified issues: file, section, quoted text, what the example's own numbers give, and the correction. The examples stay unchanged. List rejected candidates with the reason in the task report, not in the file.

---

## Phase 5: Status board and role lines

### Task 5.1: One status-board section and a role line in eight skills

**Files:**
- Modify: `pre-brd-unifier/SKILL.md`, `brd-unifier/SKILL.md`, `business-reviewer-unifier/SKILL.md`, `pre-sdd-unifier/SKILL.md`, `sdd-unifier/SKILL.md`, `lld-unifier/SKILL.md`, `impl-tracker-unifier/SKILL.md`, `tutorialize-unifier/SKILL.md`
- Create: `_fixtures/checkers/check_chain_skills.py`, `_fixtures/checkers/tests/test_check_chain_skills.py`

**Interfaces:**
- Produces: the `## Status board` section (same text in all eight) and this board template inside it:

```markdown
# Unifier status board

Run mode: solo

## Employees

| Employee | Team | Skill | Folder | State | Version | Updated (UTC) | Next step | Waiting on |
|---|---|---|---|---|---|---|---|---|
| Business development | Product Management & Business Development | pre-brd-unifier | - | Not started | - | - | - | - |
| Product manager | Product Management & Business Development | brd-unifier | - | Not started | - | - | - | - |
| Business owner | Product Management & Business Development | business-reviewer-unifier | - | Not started | - | - | - | - |
| E2E Architect | Software Development & Delivery | pre-sdd-unifier | - | Not started | - | - | - | - |
| Software Architect | Software Development & Delivery | sdd-unifier | - | Not started | - | - | - | - |
| Tech Lead | Software Development & Delivery | lld-unifier | - | Not started | - | - | - | - |
| Developer / software engineer | Software Development & Delivery | impl-tracker-unifier | - | Not started | - | - | - | - |

## Handoff requests

| ID | From | To | Request | Why | Raised (UTC) | State | Closed (UTC) | Link |
|---|---|---|---|---|---|---|---|---|
```

  `Updated (UTC)`, `Raised (UTC)`, and `Closed (UTC)` use `YYYY-MM-DD HH:MM`.
- `check_chain_skills.py SKILLS_ROOT [--exclude <glob> ...]`: the `## Status board` section (heading to the next `## `, CRLF to LF) is identical in the eight files; each file has exactly one role line `You act as the <Employee> (<Team>) in the unifier company.` matching the company table; each description is at most 1024 characters; no U+2013 or U+2014 in authored files (exclusions from Q1); every `README.md#<anchor>` link from a skill resolves against the README headings. Prints `N problems`; exit 1 when any.

- [ ] **Step 1: Rebase.** If C1 to C4 are committed, run `git -C <WT> rebase main` (stop and ask when it conflicts); rerun `node --test`.
- [ ] **Step 2: Write the failing checker tests** on generated folders: `test_check_identical_sections_pass`, `test_check_section_differs_problem`, `test_check_role_line_missing_problem`, `test_check_description_too_long_problem`, `test_check_em_dash_problem`, `test_check_excluded_copy_ignored`, `test_check_readme_anchor_missing_problem`. Run `py -3 -B -m unittest discover -s <WT>/_fixtures/checkers/tests -p test_check_chain_skills.py -v`. Expected: FAIL.
- [ ] **Step 2b: Implement the checker;** tests PASS.
- [ ] **Step 3: Write the section once,** covering every § 7 rule: the file and where it lives, who creates it and that nobody deletes it; the template above; the Run mode line, who sets it, solo and team behaviour (team: never start another skill, raise the request and stop; solo: offer to start the next skill in the same session when the runtime can); the Employees table, its states, own-row-only; the Handoff requests table, its states, who writes which cells, IDs never renumbered; read at the start of every run, update the own row at every stop, raise requests at hand-off points; concurrency (re-read before writing, change only own cells, keep the line structure and the file's line endings, accepted risk); resuming through the skill's own master; the tracker writes its row through the docs root its `tracking/config.md` records and skips with a note when unreachable; `tutorialize-unifier` reads only and has no row; "Later" sets `Later`; UTC; no dashes.
- [ ] **Step 4: Insert it** as `## Status board` before `## Reference files` (or, in `impl-tracker-unifier`, before `## Read budget per command`; in `tutorialize-unifier`, before `## Follow-up requests this skill should handle the same way`), keeping each file's line endings.
- [ ] **Step 5: Insert the role line** after the H1's first paragraph: pre-brd `Business development (Product Management & Business Development)`; brd `Product manager (Product Management & Business Development)`; business-reviewer `Business owner (Product Management & Business Development)`; pre-sdd `E2E Architect (Software Development & Delivery)`; sdd `Software Architect (Software Development & Delivery)`; lld `Tech Lead (Software Development & Delivery)`; impl-tracker `Developer / software engineer (Software Development & Delivery)`; tutorialize `Mentor / assistant (Software Development & Delivery)`.
- [ ] **Step 6: Verify:** `py -3 -B <WT>/_fixtures/checkers/check_chain_skills.py <WT> --exclude ...` prints `0 problems`; CR counts per file unchanged from before the edit (record before and after).

---

## Phase 6: Chain skill changes

### Task 6.1: `brd-unifier` (§ 8.1)

**Files:**
- Modify: `brd-unifier/SKILL.md`, `brd-unifier/chunks/10-nfrs.md`, `brd-unifier/TEMPLATE-COMBINED.md`

- [ ] **Step 1: Step 9 hand-off:** a bullet after the delivery gate bullet: offer "Next hop: Pre-SDD (E2E Architect). Start now, or later?", raise the handoff request on the board (Request "Hand-off: BRD <KEY> v<version> is ready", Link the absolute master path), and in solo mode start `pre-sdd-unifier` on "now" when the runtime can; in team mode raise and stop; "later" sets `Later`. The one-line offer stays.
- [ ] **Step 2: Chunk 10 note** in `chunks/10-nfrs.md` and the NFR section of `TEMPLATE-COMBINED.md`: "> The Pre-SDD (pre-sdd-unifier) settles the technical targets for each NFR, such as uptime percentages, latency budgets, and capacity, and the SDD designs the architecture that meets them; neither is stated here." The LANGUAGE comment keeps "HOW ... is owned by the SDD".
- [ ] **Step 3: Step 10 row** "Follow-up questions from `pre-sdd-unifier` or `sdd-unifier` (a handoff request on the board, or relayed by the user)": one `TD-NN` per distinct question with the requester and request ID as Source, plus an open item when it needs a business choice; close the request when the answer is applied. Chunk 12's heading stays "Technical Inputs for the SDD"; its template comment adds that the Pre-SDD reads it for shape and the SDD for products.
- [ ] **Step 4: Verify:** `check_chain_skills.py` 0 problems; the description unchanged; no em or en dash in changed lines; CR counts as before.

### Task 6.2: `sdd-unifier` SKILL.md and the questionnaire (§ 8.2)

**Files:**
- Modify: `sdd-unifier/SKILL.md`, `sdd-unifier/architecture-questionnaire.md`

- [ ] **Step 1: New `### 2a. Pre-SDD check (DERIVE-FROM-BRD)`** (decision 15): find `pre-sdd-*/` folders and `PRE-SDD-*.md` files beside the BRDs whose chunk 00 Source BRDs name the same BRD set; read chunk 12 first, then the master's gate line and chunk 11. G3 `Approved` or `Approved with conditions` (and the master not reading Review): load and lock what chunk 12 lists. Present but not signed, or reading Review: stop, set the board row to `Waiting on: E2E Architect (HR-NNN)`, raise a request listing the blockers, and in solo mode offer to start `pre-sdd-unifier`. Missing: the same with a "create the Pre-SDD" request. GENERATE without a BRD and TRANSFORM unchanged. An SDD built before this change: one offer on its next update; a decline goes to `decision-log.md` and the board.
- [ ] **Step 2: Steps 3a to 3c** under a loaded Pre-SDD: Project Type pre-filled from PSDD HDR-07 (brownfield with no codebase to extend answers Greenfield and carries the migration context); Q3 stays the SDD's choice with the Pre-SDD numbers as cited evidence; Q8's hosting target locked (cloud, on-prem, or hybrid; a provider only when constrained), the runtime option the SDD's; Q7 within the DAT-07 isolation level (decision 7); §6 rows carry the Pre-SDD constraints in Notes, and a product that breaks one becomes an open item.
- [ ] **Step 3: Conflict rule** (principle list and step 7 or 8 wording): a disagreement with a locked item is a chunk 18 OI with `Owner: E2E Architect (pre-sdd-unifier)` plus a handoff request; never an edit; the e2e gate treats it like any OI. Open G3 conditions become §4 risks citing `PSDD/COND-NN`.
- [ ] **Step 4: Step 9 lines:** "Pre-SDD: key PSDD, version, gate, signers; locked items applied; open conditions shown as risks; OIs raised to the E2E Architect; or why no Pre-SDD was loaded". Step 10 rows: "Pre-SDD has a new version" (handled like "BRD `KEY` has a new version", one offer); the one-time Pre-SDD offer for older SDDs.
- [ ] **Step 5: `architecture-questionnaire.md`:** when a Pre-SDD is loaded, Q3 cites its numbers as evidence, Q8 shows the hosting target locked with source `Pre-SDD`, Q7 shows the isolation constraint; the recording section notes the Pre-SDD source.
- [ ] **Step 6: Verify:** `check_chain_skills.py` 0 problems; `py -3 -B <WT>/_fixtures/checkers/check_refs.py <WT>/lld-unifier <WT>/sdd-unifier` 0 problems; CR counts as before.

### Task 6.3: `sdd-unifier` templates and references

**Files:**
- Modify: `sdd-unifier/chunks/00-cover-and-changelog.md`, `sdd-unifier/chunks/sdd-master.md`, `sdd-unifier/TEMPLATE-COMBINED.md`, `sdd-unifier/chunking.md`, `sdd-unifier/parts-mode.md`, `sdd-unifier/brd-to-sdd.md`, `sdd-unifier/decision-log.md`, `sdd-unifier/chunks/14-performance-and-capacity.md`, `sdd-unifier/chunks/18-open-items-and-clarifications.md`, `sdd-unifier/README.md`

- [ ] **Step 1: Chunk 00 and the combined cover:** a `### Source Pre-SDD` table after Source BRDs, columns `| Key | Pre-SDD | Version | Gate | Link |`, key `PSDD`; with none, one row `None - <reason>` (no BRD; declined, with the decision-log link; not yet run). Checked every run; a newer Pre-SDD version gets one offer. The Source BRDs header stays `| Key | BRD | Version | Link | Covers |` (`check_uc_keys.py` reads it).
- [ ] **Step 2: `brd-to-sdd.md`:** a `### Source Pre-SDD` rule block under Source BRDs and lineage; a `## Pre-SDD inputs (locked)` section with the landing places (Project Type, Q3, Q7, Q8, §6 Notes, §8.3, §11, §18 and §18.5 citing `PSDD/CALC-NN`, §19, §20), how each is applied, and the SDD ADRs (ADR-PERF-001, ADR-INT-001, ADR-IAM-001 in the Standard's terms) citing the Pre-SDD answers that drive them; the NFR row of the field mapping: when a Pre-SDD is loaded, §18.5 takes its settled targets; the "Pre-SDD has a new version" row in Changes after the SDD exists.
- [ ] **Step 3: Others:** `sdd-master.md` and `chunking.md` mention the new lineage table; `parts-mode.md` part 1 exit checklist adds "Source Pre-SDD row set"; `decision-log.md` gains `## Pre-SDD record` (loaded version and gate, offers and declines); chunk 14 template notes that §18 cites `PSDD/CALC-NN` when a Pre-SDD is loaded; chunk 18 template shows the `Owner: E2E Architect (pre-sdd-unifier)` case; the skill README lists the Pre-SDD check.
- [ ] **Step 4: Verify:** `check_chain_skills.py` 0 problems; `check_refs.py` 0 problems and Child LLDs columns MATCH; run `check_uc_keys.py` on the FC baseline SDD (unchanged data): 0 problems.

### Task 6.4: `lld-unifier` (§ 8.3) (parallel)

**Files:**
- Modify: `lld-unifier/SKILL.md`, `lld-unifier/sdd-to-lld.md`

- [ ] **Step 1:** A principle or `sdd-to-lld.md` note: Pre-SDD content reaches the LLD only through the SDD's citations; the LLD cites the SDD section that carries a `PSDD/<ID>` value and never reads `pre-sdd-*` folders.
- [ ] **Step 2:** Step 8 hand-off names the next hop (Developer, `impl-tracker-unifier`) and raises the request; solo and team behaviour as in Task 6.1.
- [ ] **Step 3: Verify** as Task 6.1 Step 4, plus `check_refs.py` 0 problems.

### Task 6.5: `business-reviewer-unifier` (§ 8.4) (parallel)

**Files:**
- Modify: `business-reviewer-unifier/SKILL.md`, `business-reviewer-unifier/apply-and-verify.md`, `business-reviewer-unifier/README.md`

- [ ] **Step 1:** The Pre-SDD joins the reviewable documents (description list gains "Pre-SDDs"; intake scope; principle 9 and the never list: the panel never edits a Pre-SDD).
- [ ] **Step 2:** `apply-and-verify.md` § Hand-off: a new row between the BRD and SDD rows: "Each Pre-SDD a decision changes (pre-sdd-unifier): the business review of [Created date] decided points on this Pre-SDD ([tracker path])", taken through the Pre-SDD's update flow; renumber that list and any reference to its row numbers.
- [ ] **Step 3: Verify:** description at most 1024; `check_chain_skills.py` 0 problems.

### Task 6.6: `pre-brd-unifier`, `impl-tracker-unifier`, `tutorialize-unifier` (§ 8.5 to 8.7) (parallel)

**Files:**
- Modify: `pre-brd-unifier/SKILL.md`, `impl-tracker-unifier/SKILL.md`, `tutorialize-unifier/SKILL.md`

- [ ] **Step 1: pre-brd:** workflow step 7 names the next hop (Product manager, `brd-unifier`) and raises the request; on a Conditional or No-Go verdict the request needs the owner's explicit decision and names the verdict.
- [ ] **Step 2: impl-tracker:** `init` records `Board: <docs root>/unifier-status.md` in `config.md`; the tracker writes its row there at each stop and raises a handoff request for each doc gap it routes to an owner; when the path is unreachable it skips with a note. The description stays at 1008 characters.
- [ ] **Step 3: tutorialize:** it reads the board for context only and keeps no row.
- [ ] **Step 4: Verify** as Task 6.1 Step 4. Then **stop C5** (proposals: `feat: add the status board and role lines to every chain skill`, `feat(sdd-unifier): load and lock a G3-signed Pre-SDD`, `feat(brd-unifier): offer the Pre-SDD hop`, `feat: name the next hop in the lld, pre-brd, reviewer, tracker, and tutorialize hand-offs`).

---

## Phase 7: Fixtures

### Task 7.1: Pre-SDD and board checkers (parallel with 7.2 and 7.4)

**Files:**
- Create: `_fixtures/checkers/check_presdd.py`, `_fixtures/checkers/check_status_board.py`, `_fixtures/checkers/tests/test_check_presdd.py`, `_fixtures/checkers/tests/test_check_status_board.py`

**Interfaces:**
- `check_presdd.py PSDD_DIR [--sdd SDD_DIR] [--cli <path to cli.mjs>]`: master and chunks per mode and path; 70 item rows plus header rows across the chunks; statuses, sources, and owner codes valid; `Confirmed` rows have who and when; `Open` rows have owner and due once G1 is claimed; each fragment region equals the fragment `cli.mjs compute` renders from `studio/project-state.json` (runs `node`); chunk 11 sign-off rows per applicable role; chunk 12 sections present; no em or en dash. With `--sdd`: the SDD's Source Pre-SDD row (key `PSDD`, version, gate, link resolves); every `PSDD/<ID>` in the SDD exists in the Pre-SDD; each `PSDD/CALC-NN` value cited in SDD §18 equals the model value.
- `check_status_board.py ROOT`: Run mode line; table headers exactly as the template; one row per employee and no duplicate; states and request states valid; `HR-NNN` unique and increasing; UTC stamps well formed.

- [ ] **Step 1: Write the failing tests** on generated folders (one per rule, each with a passing and a failing case). Run `py -3 -B -m unittest discover -s <WT>/_fixtures/checkers/tests -p "test_check_*.py" -v`. Expected: FAIL.
- [ ] **Step 2: Implement** (standard library only; `subprocess` for `node`).
- [ ] **Step 3: Run.** Expected: PASS, and the 127 existing regression tests still pass (`-p "test_*.py"`).

### Task 7.2: Pre-SDD fixture run from the FC baseline BRDs

**Files:**
- Create (SCRATCH run, then copied): `_fixtures/chain/run-<date>-psdd/` with `brd-refunds-portal/`, `brd-loyalty-points/` (copied unchanged from `run-2026-10-13-fc`), `AGENTS.md`, `standins/`, `fixture-answers.md`, `run-brief.md`, `pre-sdd-refunds-platform/`, `unifier-status.md`

- [ ] **Step 1: Write `run-brief.md`:** read `pre-sdd-unifier` from `WT` on disk; `full prompt chunks`; the test-run policy ("accept the recommended option; continue at G1 and G2; facts come only from `fixture-answers.md`, labelled `Fixture: <owner> (test-run policy)` with the owner named as in the FC stand-in records; the Approver stand-in signs each applicable G3 role only when the conditions hold; exceptions are granted only by the named fixture owner"); board `Run mode: solo`; write only inside the run folder.
- [ ] **Step 2: Write `fixture-answers.md`** after reading BRD chunks 10 and 12: every value the BRDs state is left to pre-fill; fixture answers fill only what stays `Open`, chosen to exercise two failure scopes (az and region) with different strategies, one hard row granted a time-bound exception, one condition with owner and due (so G3 reads `Approved with conditions`), a policy-accepted proposal for REL-01, the appendix factors confirmed per group, and two options with approved weights. Record the reason for each value.
- [ ] **Step 3: Dispatch** a background general-purpose agent with the brief; wait for its notification.
- [ ] **Step 4: Check:** `check_presdd.py <run>/pre-sdd-refunds-platform --cli <STUDIO>/cli.mjs` 0 problems; `check_status_board.py <run>` 0 problems; `node cli.mjs validate` on the state PASS; the blueprint passes `validate_handoff.py --require-approved`. Fix the skill, not the run, when a rule caused a problem, and rerun.

### Task 7.3: SDD fixture run that loads the Pre-SDD

**Files:**
- Create (in the same run): `sdd-refunds-platform/`, updated `unifier-status.md`

- [ ] **Step 1: Brief** a fresh background agent: read `sdd-unifier` from `WT`; DERIVE-FROM-BRD on both BRDs with the Pre-SDD present; the FC run's answer policy and stand-ins; `whole` (one run).
- [ ] **Step 2: Check:** step 2a loaded `PSDD` (chunk 00 row, decision log); `check_presdd.py ... --sdd <run>/sdd-refunds-platform` 0 problems; the existing SDD checkers (`check_sdd.py`, `check_uc_keys.py`, `check_uc_links.py`, `check_e2e.py`, `check_versions.py`, `check_mermaid.py`, `_linkcheck.py`) report no new problem class against FC; `diff_runs.py _fixtures/chain/run-2026-10-13-fc <run> --levels 2` shows the expected lineage and §18 changes; the board shows the E2E Architect `Done` and the Software Architect's row.

### Task 7.4: Missing and unsigned Pre-SDD scenarios (parallel with 7.2)

**Files:**
- Create: `_fixtures/scenarios/pre-sdd-missing/` and `_fixtures/scenarios/pre-sdd-unsigned/` (each: inputs, `run-brief.md`, output, `RESULT.md`)

- [ ] **Step 1: Missing, team mode:** the FC BRDs, a board with `Run mode: team`, no Pre-SDD; an `sdd-unifier` run must stop at step 2a with no SDD chunk written, its row `Waiting on: E2E Architect (HR-001)`, and HR-001 asking to create the Pre-SDD. A second run in solo mode answers "later": the request reads `Later`.
- [ ] **Step 2: Unsigned:** a copy of the Task 7.2 Pre-SDD before G3, and a second copy signed and then changed (master reads Review); in both, the SDD stops, lists the blockers, and raises a request.
- [ ] **Step 3: Check** each with `check_status_board.py` and write `RESULT.md` (expected, observed, PASS or FAIL).

### Task 7.5: Record the fixture results

**Files:**
- Modify: `_fixtures/README.md`
- Create: `_fixtures/notes/pre-sdd-build-<date>.md`

- [ ] **Step 1:** Add the run and both scenarios to the Layout table, the new checkers to the Checkers table and How to run, and the new test counts to the regression totals.
- [ ] **Step 2:** Write the notes file (briefs, commands, checker output summaries, skill fixes made during the runs). Then **stop C6** (proposal: `test(fixtures): pre-SDD chain run, missing and unsigned scenarios, and checkers`).

---

## Phase 8: README

### Task 8.1: Root README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Record the starting text** of `### The unifier company (\`hivantic-org-unifier/\`)` (bytes, CRLF to LF) to prove it unchanged at the end.
- [ ] **Step 2: Edit** per § 9: the intro (seven skills); the company table; the chain diagram and the at-a-glance table with Pre-SDD; a new `## 3. Pre-SDD (\`pre-sdd-unifier\`)` section in the house section shape (Purpose, Usage, Chunks, How the chunks relate with a Mermaid diagram and summary, What to expect, Reference files, Feeds into); stages renumbered: SDD 4, LLD 5, Business reviewer 6, Implementation tracker 7, with the contents line and every in-file anchor updated (for example `#6-implementation-tracker-impl-tracker-unifier` becomes `#7-implementation-tracker-impl-tracker-unifier`); "BRD to Pre-SDD" and "Pre-SDD to SDD" mapping tables; Who owns what rows (capacity numbers, availability and DR targets, hosting shape belong to the Pre-SDD); Shared conventions gain the status board and the roles; Lineage and change flow gain the Pre-SDD rows; Installation and usage gains the Node.js requirement, `pre-sdd-unifier` in the junction command, and a row in How to use each skill; Suggested workflow; Known gaps with the Task 7 results.
- [ ] **Step 3: Verify:** the company subsection is byte-identical to Step 1; a SCRATCH link check of README anchors and relative links finds none broken; `grep` over the repo for `README.md#` links (skills, hivantic, `_fixtures/README.md`) finds none broken; `check_chain_skills.py` 0 problems; no em or en dash added. Then **stop C7** (proposal: `docs: add Pre-SDD to the README and renumber the stages`).

---

## Phase 9: Company files (the last build step)

### Task 9.1: Sync `hivantic-org-unifier/` to the shipped skills

**Files:**
- Modify: all eight `hivantic-org-unifier/agent-*.md`, both `team-*.md`, `hivantic-org-unifier/README.md`
- Create: `_fixtures/notes/org-unifier-sync-<date>.md`

- [ ] **Step 1: Record** each file's CR count and the Company rules hash (expected `6c40dc2f72a369d5` over LF bytes).
- [ ] **Step 2: Edit** per § 9: remove the "Being built" notes (handbook, E2E Architect) and the "finished BRD goes straight to the SDD until `pre-sdd-unifier` ships" text (handbook, Product manager, Software Architect); fix the E2E Architect stages and gates (stage 1 discovery with no gate, stage 2 register ending at G1, stage 3 assess at G2, stage 4 confirm and decide at G3); add per-role G3 with conditional approval, the defaults appendix, proposed targets a person picks, several entries per item, web or prompt input through one engine, and the SDD-side locking (Project Type pre-filled, Q3 evidence, Q8 hosting locked, Q7 isolation, §6 Notes, conflicts as OIs owned by the E2E Architect); the board section summary matches the skills' text, with the Run mode line.
- [ ] **Step 3: Company rules:** add one bullet in all eight files at once: "**Team mode.** This company runs in team mode: a status board you create starts with `Run mode: team`, and you never start another employee's skill; you raise the request and stop." Recompute the hash: one value across all eight.
- [ ] **Step 4: Verify:** one hash across eight files (LF bytes); each file's line endings as recorded in Step 1 (a fresh `WT` checkout writes CRLF, while `MAIN` holds these files as LF; Task 11.2 restores LF); front matter parses with PyYAML; links resolve; no em or en dash; the notes file records the changes and the old and new hash. Then **stop C8** (proposal: `docs(hivantic-org-unifier): sync the company files to the shipped Pre-SDD hop`).

---

## Phase 10: Final checks

### Task 10.1: Consistency round

**Files:** fixes only where a checker finds one.

- [ ] **Step 1: Dispatch parallel read-only checkers** (one per pair: BRD to Pre-SDD, Pre-SDD to SDD, SDD to LLD, the board section and role lines, README and hivantic against the skills), each reporting quoted findings with file and line.
- [ ] **Step 2: Apply** mechanical and simple fixes with the recommended option (the owner's consistency-round rule); hold anything that changes gates, IDs, file layout, or security posture, or adds a feature-sized path, for the owner at C9.
- [ ] **Step 3: Rerun** `check_chain_skills.py`, `check_refs.py`, `node --test`, and the checker suites.

### Task 10.2: The § 10 verification list

**Files:**
- Modify: `_fixtures/notes/pre-sdd-build-<date>.md` (a Verification section)

- [ ] **Step 1: Run and record:** `node --test` (counts by file); golden computed-field parity (3 cases); a coverage table showing a test for every CALC-01 to CALC-22, every rule ID, the five DR thresholds, every per-scope, gate, and derivation case; build byte embed; every test blueprint through `validate_handoff.py`; `MANUAL-CHECK.md` results; the fixture runs; each SKILL.md description length and PyYAML parse (all eight); dash scan with the Q1 exemptions; `check_chain_skills.py` (identical board section, role lines, README anchors).
- [ ] **Step 2: Mark** the headless Codex and Kimi listings as pending Task 11.3. Then **stop C9** (proposal: `chore: consistency fixes and the pre-SDD build verification record`).

---

## Phase 11: Integrate

### Task 11.1: Rebase and the README merge

- [ ] **Step 1:** `git -C <WT> fetch` is not needed (local main); run `git -C <WT> log --oneline main..HEAD` and `git -C <WT> log --oneline HEAD..main`.
- [ ] **Step 2:** `git -C <WT> rebase main`. On a conflict, stop and show it.
- [ ] **Step 3: Stop R1:** when main changed `README.md` since this branch started, show the owner the merged README around every section both sides touched and the unchanged company subsection; wait.
- [ ] **Step 4:** Rerun `node --test`, the checker suites, `check_chain_skills.py`, and the Task 7 checks on the saved run. Expected: all pass.

### Task 11.2: Merge (stop M1)

- [ ] **Step 1: Check the main checkout:** `git -C <MAIN> status --short`; any modified tracked file that this branch also changes means another session is working on it: stop and ask. When `docs/superpowers/` is tracked on the branch, the design doc in `MAIN` must equal the branch copy (SHA-256 over LF bytes); the plan in `MAIN` is replaced by the branch copy, which carries the ticked boxes.
- [ ] **Step 2: Present the procedure** for the owner's word (the repo's practice keeps LF files LF): create the merge commit with `git commit-tree <branch>^{tree} -p main -p feat/pre-sdd-unifier -F <message-file>` and move main with `git update-ref refs/heads/main <new> <old>`; then in `MAIN` run `git reset -q` (index to the new HEAD, files untouched) and copy each path of `git diff --name-only <old> <new>` from `WT`, writing LF where the `MAIN` file it replaces has no CR, CRLF where it has CRLF, and LF for new files (deleting removed paths); `git -C <MAIN> status --short` must then show only the untracked originals (the old `pre-sdd-unifier/` demo files, and `docs/` when not tracked).
- [ ] **Step 3:** Run it only on the owner's word; then rerun `check_chain_skills.py` on `MAIN`.

### Task 11.3: After the merge

- [ ] **Step 1: Stop P1, old copies:** the untracked demo files at `MAIN\pre-sdd-unifier\` root (13 files, now under `examples/studio-v2.2-export/`) and the untracked `docs/superpowers/` originals (when tracked now): show that each equals its committed copy by SHA-256 (LF), then delete only on the owner's word.
- [ ] **Step 2: Junction:** `New-Item -ItemType Junction -Path "$env:USERPROFILE\.agents\skills\pre-sdd-unifier" -Target "$env:USERPROFILE\.claude\skills\pre-sdd-unifier"`.
- [ ] **Step 3: Headless listings** in new sessions: `codex exec -s read-only "List the names and SKILL.md paths of the skills you can load."` and `kimi -p "List the names and SKILL.md paths of the skills you can load."`; both must list `pre-sdd-unifier` with its path. Add the result to the verification record.
- [ ] **Step 4:** Remove the worktree only on the owner's word (`git worktree remove`; the branch stays); update the memory files (`pre-sdd-unifier-design`, `band-agent-role-files` with the new Company rules hash, `agent-skill-junctions`, `pending-branch-cleanup`).

---

## Design § 10 verification map

| § 10 line | Where |
|---|---|
| Golden: two ZIPs and the demo export | Task 1.1 (bytes, transitional), Task 2.3 (computed fields, lasting) |
| Unit: every CALC and rule, DR boundaries 30, 60, 900, 3600, 14400 s | Tasks 1.1, 2.4, 2.6, 2.7; table in 10.2 |
| Per scope: strategy per scope, conflict when the shape fails a scope | Task 2.5 |
| Gate: each G3 outcome, condition, exception | Task 2.8 |
| Derivation: every rule | Task 2.4 |
| Build: engine.js byte for byte | Task 1.2 |
| Schema: `validate_handoff.py` on every test blueprint | Task 2.9 |
| Studio manual check through the Playwright MCP | Tasks 1.2 Step 5, 3.5 |
| Skill: fixture runs, description and YAML, dash scan, headless listings | Tasks 7.2 to 7.4, 10.2, 11.3 |
| Chain: identical board section, renumbered README anchors resolve | Tasks 5.1, 8.1, 10.1 |

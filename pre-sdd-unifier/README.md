# Pre-SDD Unifier

Stage 3 of the chain, and the E2E Architect (Software Development & Delivery) hop between `brd-unifier` and `sdd-unifier` (BRD, then Pre-SDD, then SDD): it runs a Pre-SDD for one system from its finished BRDs, settles the numbers and the shape, and locks them for the SDD through a G3 sign-off per role. A G3-signed Pre-SDD is required for every new SDD built from BRDs (`sdd-unifier` step 2a). Part of the Product Documentation Skill Suite (see the repo-root `README.md` for the full lifecycle).

This README is for a maintainer of the skill: how it is built, where its versions live, how to test it, and what not to break. A user, or an agent running the skill, starts at [SKILL.md](SKILL.md).

---

## What

- **The method.** The Pre-SDD Architecture Standard (`reference/Pre-SDD_Architecture_Standard_v1.md`) is the full Pre-SDD, and the Quick Discovery Guide (`reference/Pre-SDD_Quick_Discovery_Guide.md`) is the first discovery conversation. The skill turns the Standard's 70 checklist items, plus header and migration overlay rows, into a register where every value has a status, a source, and, once confirmed, a named person.
- **The run.** Four stages (discovery, register, assess, confirm and decide) and the gates G0 to G3. G3 approval means the SDD may start. Quick mode stops after discovery and claims no gate. The arguments are `[quick|full] [web|prompt] [chunks|combined] [light]`, default `full` (SKILL.md § Argument parsing); `light` trims the review passes, the diagrams, and the options, never the engine run, the register, the gate, or the handoff guide (SKILL.md § Light run).
- **The input.** By web (the offline Studio page) or by prompt (chat), chosen per run. Both feed the same project state.
- **One calculator.** `studio/src/engine.js` holds every formula, rule, check, gate, derivation, and writer. The Studio bundles it; the skill runs it under Node.js through `studio/cli.mjs`. No number in a chunk is worked out by hand.
- **The output.** Chunked Markdown in `./pre-sdd-[slug]/`, with the master index and `decision-log.md` (or one combined file in the project root, with no master; the folder then keeps only `studio/` and `decision-log.md`): chunks 00 to 13 in full mode and fewer in quick mode (the chunk map is `chunking.md`). Chunk 12 is the handoff guide that `sdd-unifier` reads and that locks the settled items (`PSDD/<ID>` citations). Once G3 is signed, SKILL.md step 14 raises the handoff request to the Software Architect on the status board (`unifier-status.md`); the contract is `handoff-guide.md`.
- **The requests it takes later.** SKILL.md § Later requests holds one row per request, among them the implementation tracker's (or its doc worker's) two board request forms: `Doc gap <KEY>/GAP-NNN[ (DU-NNN)]: <question>` for a question nobody has decided, and `Decided change <KEY>/CHG-NNN[ (DU-NNN)]: <summary>` for a change already decided. For a decided change, the CHG decider quote is the acceptance (a doc version as decider still needs a person to confirm the value), one update records it, and the request is `Done` only once G3 is signed again.

## Status (2026-10-28, UTC)

| Part | State |
|---|---|
| Engine 3.0, `studio/src/engine.js` | Complete: register and entries, patches, the state gate, defaults and derivations, calculations, DR per failure scope, options, validation, gates, blueprint 2.0.0, fragments, save and preview files, and the helpers the page reads |
| CLI, `studio/cli.mjs` | Complete: `new`, `derive`, `compute`, `validate`, `unwrap`, `diff`, `embed`, `--version` |
| Studio 3.0 page, `studio/src/ui.js`, `shell.html`, `style.css` | Complete (Phase 3): stages 1 to 4 on the register; it opens filled from the embedded state; Import reads a save file, a 3.0 project state, a preview ZIP, or a Studio v2.2 project file or ZIP; Save writes the save file; the preview ZIP is labelled not of record. The v2.2 layer is gone from the engine. Checked by hand in `studio/tests/MANUAL-CHECK.md` |
| `## Status board` section of SKILL.md | Complete (Task 5.1): the same section as in the other six chain skills and `tutorialize-unifier` |
| Merge | Merged into main (`d7b3202`). The skill is in the unifier company as the E2E Architect (SKILL.md role line) |

**Known limitation** (accepted by the owner at stop C2): a zero RTO on `az` beside a remote failure scope over-reports `CONFLICT-zeroRTO-topology@az`, because the topology order ranks regional above multi-AZ active. A topology override of `active`, or a relaxed `az` RTO, clears it.

## Known gaps

- **No overlay tab in the Studio.** The Studio has no control for the migration overlay switch, the workloads, the OVL entries, the unknowns, or removing an option. On the web path the skill takes these in chat and applies them with `cli.mjs derive --apply` ([stages-and-input.md § The web path](stages-and-input.md#the-web-path)). An overlay tab in stage 2 is a later Studio change.
- **SKILL.md is longer than one Read returns.** A Read of SKILL.md by path stops before its end, which leaves out § Status board and § Reference files. Load it through the skill loader, or read it in two parts.

## Layout

```text
pre-sdd-unifier/
  SKILL.md                 entry point: arguments, workflow, rules
  README.md                this file
  *.md                     rule files, one per topic (SKILL.md § Reference files lists them)
  TEMPLATE-COMBINED.md     the single-file layout; equals the chunk templates merged
  chunks/                  chunk templates and the master template, with fragment markers
  reference/               the Standard and the Quick Discovery Guide (verbatim), SOURCE.md, policy-appendix.md
  examples/                the Examples README and eight worked examples (verbatim), SOURCE.md, ERRATA.md,
                           studio-v2.2-export/ (a v2.2 export in the old format)
  studio/
    src/engine.js          the one calculator: pure functions, no DOM
    src/ui.js              the page code: stages 1 to 4, Import, Save, the preview ZIP
    src/shell.html         the page skeleton with the four build markers
    src/style.css          the page styles
    src/package.json       { "type": "commonjs" }: keeps engine.js CommonJS under a project that declares "type": "module"
    build.mjs              builds pre-sdd-studio.html, with or without a project state inside
    cli.mjs                the skill's way into the engine
    pre-sdd-studio.html    the built, blank Studio (committed; a test keeps it equal to a fresh build)
    schema/                architecture-blueprint.schema.json and project-state.schema.json (generated)
    tools/                 the two schema generators
    validate_handoff.py    the blueprint validator (Python, needs jsonschema)
    tests/                 node:test suites, helpers, golden/ (the two v2.2 example exports), MANUAL-CHECK.md
    CHANGELOG.md           release notes, the Builder decisions, the v2.2 import record and hashes
```

The rule files are listed with what each holds in [SKILL.md § Reference files](SKILL.md#reference-files). The source notes [reference/SOURCE.md](reference/SOURCE.md) and [examples/SOURCE.md](examples/SOURCE.md) record where each verbatim copy came from, its SHA-256, and its known broken relative links.

## The engine and the Studio

### The split

- `engine.js` and `ui.js` were split from the Studio v2.2 `app.js` with byte parity (Phase 1). `app.js` is gone; its import record and hashes stay in [studio/CHANGELOG.md § Imported from Studio v2.2](studio/CHANGELOG.md#imported-from-studio-v22).
- `engine.js` holds:
  - **The kept v2.2 calculator** (`calculations`, `selectArchitecture`, `decisionRules`, `buildDiagrams`, `filteredGraph`, and their helpers). `compute` feeds it from the register through `toCalcInputs`, so the numbers stay those of v2.2.
  - **The 3.0 functions:** `newState`, `normalizeState`, `applyPatch`, `applyDefaults`, `derive`, `compute`, `validateState`, `computeOptions`, `gateStatus`, `handoffBlueprint`, `saveWrapper`, `readSave`, `saveFileName`, `fragments`, `previewFiles`, `importV22`, `readStoredZip`, and others.
  - **The helpers the page reads:** `importForPage` (the v2.2 import sequence of `cli.mjs new --import`), `registerView`, `stageBlock`, `fieldError`, `optionStatus`, and `signoffRecords`, so `ui.js` copies no engine rule.
- The v2.2 export layer that the old page called was removed in Phase 3 (Task 3.4). The tests that compared with it now compare the 3.0 output with SHA-256 digests of the v2.2 output, recorded while both versions ran; the rules and calculations keep their live comparison through the kept calculator.
- The engine is pure. It touches no DOM and never reads the clock: every 3.0 function takes `now` and throws without one, and every stamp it writes is UTC.
- The engine returns one object of exports (95 today). New names are appended; the 38 v2.2 names that remain keep their places at the front.

### UMD

The first line of `engine.js` wraps the module: under Node.js it sets `module.exports` (the CLI and the schema generators load it with `createRequire`, the tests through `loadEngine()` in `tests/helpers.mjs`); in the browser it sets `globalThis.PreSddEngine`, which `ui.js` reads. The file has no `import` or `export` statement, so the same bytes run in both places.

### The build

```text
node "<skill>/studio/build.mjs" [--state <state.json>] [--out <file.html>]
```

- It replaces the four markers in `src/shell.html` in one pass: `/* STYLES */` with `style.css`, `/* ENGINE */` with `engine.js`, `/* PROJECT_STATE */` with the state as JSON (or `null`), and `/* UI */` with `ui.js`. Sources are read with CRLF turned to LF.
- The state JSON escapes `<`, U+2028, and U+2029, so it cannot close its script tag, and marker text inside the state is never expanded.
- Without `--out` it writes `studio/pre-sdd-studio.html`. `buildStudio({ srcDir, state })` is exported; the CLI's `embed` calls it.
- **Rebuild after any change under `src/`**, before the tests: `buildStudio_committedHtml_isUpToDate` compares the committed HTML with a fresh build.

### The CLI

`cli.mjs` uses Node.js built-ins only and loads the engine like the tests do. Its flags, printed JSON, and refusals are documented for the skill in [engine-and-studio.md § Running the CLI](engine-and-studio.md#running-the-cli); the usage text is the `USAGE` object at the top of `cli.mjs`.

| Command | What it does |
|---|---|
| `new` | Creates `project-state.json` (or imports a v2.2 file or ZIP), then applies the defaults and derivations |
| `derive` | Applies a patch (`--apply`), then the defaults and derivations, and writes the state back |
| `compute` | Writes `model.json`, the blueprint (JSON and YAML), `fragments/*.md`, and the diagrams |
| `validate` | Checks a state, a save file, a v2.2 project, or a blueprint; `--pick` finds the person's newest save first |
| `unwrap` | Splits a save file into `project-state.json` (normalized) and `studio-blueprint.json` |
| `diff` | Compares two blueprints part by part |
| `embed` | Builds the Studio with a project state inside |
| `--version` | Prints `engine 3.0.0, skill 1.0.0` |

- Exit codes: 0 ok, 1 differences (`diff` only), 2 invalid input or failed validation, 3 usage.
- Every command that reads a state runs the state gate (`normalizeState`) first.
- `--now <UTC>` is for tests only and takes ISO 8601 with `Z`.
- The CLI repeats no engine constant: it reads `ENGINE_NAME`, `ENGINE_KIND`, and `ENGINE_SOURCE_TEXTS` from the engine.
- `validate` and `unwrap` check JSON Schema with the CLI's own checker, so the Node.js path needs no Python. The checker refuses any keyword it does not implement (`SCHEMA_KEYWORDS`, `checkSchema`), and `cliSchemaChecker_committedSchemas_everyKeywordSupported` walks both schemas. A schema change that adds a keyword must extend the checker first.

### The fragments

- `fragments(state, model, { now })` returns the Markdown fragments keyed by file name, and `compute` writes them to `fragments/`: `01-header.md`, `02-classification.md`, `03a-register-business.md` to `03h-register-economics.md`, `04-calculations.md`, `05-target-shape.md`, `07-options.md`, `08-overlay.md` (only while the overlay applies), `09-rule-trace.md`, `10-validation.md`, `11-gate.md`, and `12-locked-items.md`.
- The chunk templates mark each place with `<!-- ENGINE-FRAGMENT: <file name> -->` and `<!-- /ENGINE-FRAGMENT -->`, and the skill pastes each fragment between them unchanged ([engine-and-studio.md § The fragments and their markers](engine-and-studio.md#the-fragments-and-their-markers)).
- A fragment has no level-1 or level-2 heading, one `### <ROW-ID>` heading per register row (so `PSDD/<ID>` anchors resolve), escaped cells, and `TBD` for any empty value.
- Renaming a fragment touches `engine.js`, `tests/fragments.test.mjs` (`NAMES`), `chunks/`, `TEMPLATE-COMBINED.md`, and `engine-and-studio.md` together.

### The schemas and the validator

- Both schemas are generated from the engine's catalogue and constants. Never edit them by hand: run `node "<skill>/studio/tools/blueprint-schema.mjs"` or `node "<skill>/studio/tools/project-state-schema.mjs"`. The tests `blueprintSchema_generator_upToDate` and `projectStateSchema_committedFile_isUpToDate` fail when a committed schema differs from its generator.
- `validate_handoff.py` checks a blueprint against `schema/architecture-blueprint.schema.json`, plus its references and governance:

  ```text
  py -3 "<skill>/studio/validate_handoff.py" <blueprint.json> [--require-approved] [--require-sdd-intake]
  ```

  It exits 0 on PASS, 2 on FAIL, and 3 when it cannot read the file or the schema, or `jsonschema` is missing. It reads the Mermaid files the blueprint names from the folder of the JSON file. It started as the imported v2.2 validator and was updated for blueprint 2.0.0.

## Versions

Every version the engine stamps is a constant on one line near the top of `studio/src/engine.js`:

| Constant | Value | Stamped into |
|---|---|---|
| `ENGINE_VERSION` | `3.0.0` | The engine and Studio version: the state's `engine_version`, the blueprint's `sources.engine.version`, each calculation's `rule_version`, the preview manifest, the Studio agent name, `--version` |
| `SKILL_VERSION` | `1.0.0` | The blueprint's `sources.skill.version`, `--version` |
| `STATE_SCHEMA_VERSION` | `3.0.0` | The state's `schema_version`; the generator writes it as the schema's `const` |
| `BLUEPRINT_SCHEMA_VERSION` | `2.0.0` | The blueprint's `schema_version`; the generator writes it as the schema's `const` |

The policy appendix has its own version, `1`: `APPENDIX.version` in `engine.js` and the `Version:` line of [reference/policy-appendix.md](reference/policy-appendix.md). The test `APPENDIX_values_matchPolicyAppendixFile` keeps the two equal, and every default the engine fills cites `Default: policy appendix v1`. A change to the appendix needs the owner's approval and a new appendix version.

To bump a version: change the constant, regenerate a schema whose version changed, rebuild the Studio, run the tests, and add the change to [studio/CHANGELOG.md](studio/CHANGELOG.md), whose current section is `3.0.0 (in progress)`.

## Running the tests

```text
node "<skill>/studio/build.mjs"
node --test "<skill>/studio/tests/*.test.mjs"
```

- **Build first.** The up-to-date test compares the committed HTML with a fresh build.
- **Quote the glob.** A bare directory argument fails on Node.js 24.14.0.
- **Python.** The schema and validator tests run Python through `tests/pyschema.mjs`: `py -3 -I` on Windows, `python3 -I` elsewhere, with the `jsonschema` package. When Python is not found, those checks skip with a message saying so.
- **Every test passes `now`** as a UTC ISO string. Test names follow `methodName_scenario_expectedResult`.
- On 2026-10-28 the suite ran 475 tests, all passing, on Node.js 24.22.1. The skill's documents say "tested with Node.js 24.14.0".
- The suite has no browser test. The page was checked by hand on 2026-10-27 in headless Chrome with a scratch profile (13 checks, all passing, from the embedded load to the save, `validate --pick`, `unwrap`, and `diff`), recorded in `tests/MANUAL-CHECK.md`. Firefox and Edge are left to the owner.

| Test file | Covers |
|---|---|
| `build.test.mjs` | `buildStudio`: the engine embedded byte for byte, hostile state text, the committed HTML up to date |
| `sources.test.mjs` | No network or storage API in `src/`, no closing script tag in the scripts, no em or en dash characters |
| `style.test.mjs` | The palette: colours only in `:root` tokens, text contrast 4.5:1, focus rings 3:1, the key colours, every `var()` defined |
| `engine-v22.test.mjs` | The kept v2.2 functions: DR thresholds, out-of-range inputs, classification, the exported sets |
| `golden-fields.test.mjs` | Parity of the computed fields with the v2.2 output on the three golden cases (recorded digests) |
| `catalogue.test.mjs` | The items, rows, landings, sign-off roles, versions |
| `state.test.mjs`, `decisions.test.mjs` | `newState`, `applyPatch` and every op, `contentHash`, the state schema |
| `state-gate.test.mjs` | `normalizeState` and the load paths |
| `import.test.mjs` | `importV22`, `readStoredZip` |
| `import-page.test.mjs` | `importForPage`: the page's v2.2 import gives the same register as `cli.mjs new --import` |
| `view.test.mjs` | `registerView`, `fieldError`, `stageBlock`: the rows each stage shows, the fix messages, page navigation |
| `value-rules.test.mjs` | `applyPatch` refuses every value `fieldError` refuses, for every actor, with the same text |
| `status-rules.test.mjs` | `optionStatus` and `signoffRecords` match the options and gate fragments |
| `defaults.test.mjs` | `applyDefaults`, `derive`, the policy appendix, the engine's exported texts |
| `scopes.test.mjs` | DR per failure scope, the target shape, conflicts, the recovery tier, the closest example |
| `validation.test.mjs` | `validateState`, the rules, `ruleIds_neverEqualItemIds` |
| `options.test.mjs` | `computeOptions`: the hard-constraint filter, TCO, the weighted score |
| `gate.test.mjs` | `gateStatus`: G0 to G3, sign-offs, conditions, exceptions |
| `blueprint.test.mjs` | `handoffBlueprint`, `readSave`, `previewFiles`, the writers, the blueprint schema and validator |
| `fragments.test.mjs` | `fragments`: names, row headings, escaping, `TBD` |
| `cli.test.mjs` | Every CLI command, `pickSavedState`, the schema checker, the engine loading inside a project that declares `"type": "module"` |

`tests/golden/` holds the two v2.2 example exports (`regional-zero`, `local-zero`); the third golden case, `demo`, reads `examples/studio-v2.2-export/`.

## The parity rules

1. **One engine, the same bytes.** The Studio embeds `engine.js` unchanged (`buildStudio_blank_embedsEngineByteForByte`), and the committed `pre-sdd-studio.html` equals a fresh build. Never edit the built HTML; edit `src/` and rebuild.
2. **The same results on both paths.** After a web save, the skill runs `unwrap`, then `compute` on the saved state, then `diff` against the blueprint the Studio saved. The expected difference is none ([engine-and-studio.md § The parity check](engine-and-studio.md#the-parity-check)).
3. **Parity with v2.2.** `golden-fields.test.mjs` imports each golden case through `importV22` and compares the computed fields with the v2.2 output, with renamed rule IDs mapped through `RULE_RENAMES`; since Task 3.4 it compares with the SHA-256 digest of that output, recorded while both versions ran. It is the lasting parity test: the byte-for-byte golden test was deleted in Task 2.6, when the rule renames changed the output. The golden files are never edited.
4. **The page and the CLI import alike.** The page's Import of a v2.2 file runs `importForPage`, the same sequence as `cli.mjs new --import`, and `import-page.test.mjs` compares the two registers. Never give `ui.js` its own copy of an engine sequence or rule; export it from the engine.
5. **Byte comparisons are LF.** Files are written with LF, and every byte comparison and hash turns CRLF into LF first (`readText` in `tests/helpers.mjs`), because a Windows checkout may write CRLF.

## The build decisions

The decisions live in three places:

- [studio/CHANGELOG.md § Builder decisions (Phase 2)](studio/CHANGELOG.md#builder-decisions-phase-2): the 22 engine and CLI decisions, one line each.
- The design, `docs/superpowers/specs/2026-10-23-pre-sdd-unifier-design.md`: § 2 Decided with the owner and § 11 Calls I made. It is a local design record in the owner's checkout, not published in this repository.
- The plan, `docs/superpowers/plans/2026-10-23-pre-sdd-unifier-plan.md`: its sections "Two questions to settle before Task 0.1" and "Builder decisions". It is a local record too, not published.

Know these before you change code:

- **The v2.2 layer is gone (Task 3.4).** The kept v2.2 calculator keeps its names, signatures, and return shapes, because the parity tests pin its output.
- **One engine for the CLI and the page,** embedded byte for byte. Never copy engine logic or constants into `cli.mjs`, `ui.js`, or a tool; export them from the engine.
- **Every write goes through `applyPatch`.** A patch is a batch of ops from one actor, all or nothing: any error leaves the state unchanged and lists every error. `applyDefaults` and `derive` write through it too, as the actor `pre-sdd-engine`.
- **The state gate.** `normalizeState` runs on every load. It rejects a file it cannot read safely and lists every problem in plain words, and it reads a `Confirmed` value without who and when as `Estimated`. `applyPatch` does not gate its own input, so every load path normalizes first.
- **The engine is the strict side on who may act** (ruling R0). Where the engine and the rule files differ on who may act, the design decides; where the design is silent, the stricter side wins and the engine moves to it, because the engine is the one place a rule holds for the Studio, the CLI, and a hand-written patch alike. A rule the engine cannot check (for example, only an empowered owner ticks G3-11) stays a skill rule.
- **The skill installs nothing.** No npm packages and no dependencies: Node.js built-ins and `node:test` only. The one-line `studio/src/package.json`, `{ "type": "commonjs" }`, keeps the engine CommonJS inside a project whose `package.json` says `"type": "module"`; it names no dependency, and `cli_version_insideEsmProject_loadsEngine` guards it. Python is used only by `validate_handoff.py` and the schema tests.
- **Offline.** The Studio makes no network call and uses no browser storage; `sources_noNetworkOrStorageApis_absent` guards it.
- **UTC** for every timestamp: ISO 8601 with `Z`, and file-name stamps `YYYYMMDDTHHMMSSZ`.
- **No em or en dashes** in any file this skill writes. In `src/`, a runtime string that needs one uses an escape (`\u2014` in JavaScript, `&#8212;` in HTML). The Q1 exemptions are below.
- **No comments** in code.

## The Q1 and Q2 outcomes

The owner took the recommended option for both questions on 2026-10-23.

- **Q1, dashes in verbatim copies.** The copied method sources keep every character byte for byte, so each copy's SHA-256 equals its original's and the golden tests compare exact v2.2 output. Exactly these paths are exempt from the dash scan: `reference/Pre-SDD_Architecture_Standard_v1.md`, `reference/Pre-SDD_Quick_Discovery_Guide.md`, `examples/PreSDD_Examples_README.md`, the eight worked examples (`examples/PreSDD_GF_CL_Simple.md` and its seven siblings, GF or BF, CL or OP, Simple or Complex), `examples/studio-v2.2-export/`, and `studio/tests/golden/`. Every other file holds none.
- **Q2, the rule and item ID collision.** The v2.2 rule `CAP-04` is renamed `LOAD-04`, so `PSDD/CAP-04` always means the register item, and `DB-READ-11` is renamed `DB-READ-17` (`SEC-11` keeps its number). `RULE_RENAMES` in `engine.js` maps the old IDs, `ruleIds_neverEqualItemIds` keeps rule and item IDs apart, and the CHANGELOG records both renames.

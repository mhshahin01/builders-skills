# Changelog

## 3.0.0 (in progress)

- Imported the Studio v2.2 sources, blueprint schema, handoff validator, and the two v2.2 example exports as the starting point and as golden test data. Details are in the section "Imported from Studio v2.2" below.
- Palette tokens: every colour in `src/style.css` now lives in a `:root` token (116 new, 126 in all after Task 3.5 removed one unused token) and rules use `var(--token)`. Text colours are `--fg-*`, backgrounds `--fill-*` and borders `--border-*`, plus `--mast-start`, `--mast-mid`, `--mast-end`, `--focus`, `--focus-on-dark` and `--shadow-toast`. Values are unchanged except in the contrast, focus ring and hover fixes below, and no selector, layout or size changed apart from one added focus rule for masthead buttons. `--teal` (`#0c8286`) and `--dark` (`#0c2138`) are as before.
- Palette tests: `tests/style.test.mjs` fails on a colour literal outside `:root`, on a text pair under 4.5:1, on a missing key colour and on an undefined `var()`. Text with no background of its own is measured against every page and panel surface (12 today, `--bg` and white included), text on the masthead against every stop of its gradient, and the palette text tokens against white and `--bg`. Text in a `:hover`, `:active` or `:focus` state is measured against that state's background and the surfaces beneath it at 4.5:1, and focus ring colours against the 12 panels and the masthead stops at 3:1.
- Contrast fix: darkened `--amber` from `#a66a1e` to `#a5691e` (lowest ratio 4.47:1 on `#ffffff`, now 4.53:1 on `#ffffff`).
- Contrast fix: darkened `--muted` from `#64758b` to `#607085` (lowest ratio 4.19:1 on `#e6f5f1`, now 4.50:1 on `#e6f5f1`; on `--bg` it was 4.34:1 and is now 4.66:1).
- Contrast fix: darkened `--fg-placeholder` from `#9aaabc` to `#656f7b` (lowest ratio 2.11:1 on `#e6f5f1`, now 4.55:1 on `#e6f5f1`).
- Contrast fix: darkened `--fg-note` from `#697d8f` to `#5e7081` (lowest ratio 3.79:1 on `#e6f5f1`, now 4.55:1 on `#e6f5f1`; on white it was 4.26:1 and is now 5.11:1).
- Contrast fix: darkened `--fg-metric-label` from `#5c7187` to `#5c7086` (lowest ratio 4.49:1 on `#e6f5f1`, now 4.54:1 on `#e6f5f1`).
- Contrast fix: darkened `--fg-metric-sub` from `#7a8b99` to `#63707c` (lowest ratio 3.13:1 on `#e6f5f1`, now 4.52:1 on `#e6f5f1`).
- Contrast fix: darkened `--fg-pattern-micro` from `#167f81` to `#157a7c` (lowest ratio 4.26:1 on `#e6f5f1`, now 4.55:1 on `#e6f5f1`).
- Contrast fix: darkened `--fg-rule-id` from `#718495` to `#60707f` (lowest ratio 3.44:1 on `#e6f5f1`, now 4.54:1 on `#e6f5f1`).
- Contrast fix: darkened `--fg-ladder-note` from `#678096` to `#5b7185` (lowest ratio 3.66:1 on `#e6f5f1`, now 4.51:1 on `#e6f5f1`).
- Contrast fix: darkened `--fg-dr-th` from `#60768b` to `#5c7085` (lowest ratio 4.19:1 on `#e6f5f1`, now 4.55:1 on `#e6f5f1`).
- Contrast fix: darkened `--fg-tab` from `#5c748a` to `#5a7187` (lowest ratio 4.33:1 on `#e6f5f1`, now 4.51:1 on `#e6f5f1`).
- Contrast fix: darkened `--fg-service-cat` from `#0d8086` to `#0c7a80` (lowest ratio 4.20:1 on `#e6f5f1`, now 4.55:1 on `#e6f5f1`).
- Contrast fix: darkened `--fg-service-trade` from `#697b90` to `#607084` (lowest ratio 3.87:1 on `#e6f5f1`, now 4.51:1 on `#e6f5f1`).
- Contrast fix: darkened `--fg-readiness-mini` from `#6e8091` to `#61707f` (lowest ratio 3.62:1 on `#e6f5f1`, now 4.52:1 on `#e6f5f1`).
- Contrast fix: darkened `--fg-footer` from `#8b9aab` to `#656f7c` (lowest ratio 2.56:1 on `#e6f5f1`, now 4.54:1 on `#e6f5f1`).
- Focus ring: `--focus` from `#66bfca` to the key colour `#0c8286` (was 1.89:1 on the darkest panel `#e6f5f1` and 2.13:1 on white, now 4.11:1 and 4.61:1; 3:1 is the WCAG 1.4.11 minimum). New `--focus-on-dark` `#7fcad3` and one new rule, `.mast button:focus-visible{outline-color:var(--focus-on-dark)}`, give masthead buttons a ring that clears 3:1 on every masthead stop.
- Masthead end colour: `--mast-end` from `#0b7378` to `#0a6a6f` so that white text on the ghost buttons clears 4.5:1 at the lightest stop in both states (ghost default 4.61:1 to 5.12:1).
- Ghost hover: `--fill-ghost-hover` from `rgba(255,255,255,.2)` to `rgba(255,255,255,.15)` (white text over the lightest masthead stop was 3.79:1, now 4.60:1).
- Masthead tints kept: `--fg-mast-eyebrow` stays `#a6eee0` and `--fg-mast-text` stays `#c9e1eb`, because they pass 4.5:1 on every stop of the darker gradient (4.82:1 and 4.68:1 at the end stop). The earlier lightening of both is withdrawn.
- Focus ring on panels: `[role=tabpanel]:focus-visible` and `[tabindex="0"]:focus-visible` join the `--focus` ring rule, so the stage 2 register panel shows the same 3px ring as every other control.
- Removed with the v2.2 controls: `.mini-actions` from the button group rule, the `.text-button` rules and their token `--fg-text-button` (126 tokens now).

### Versions and formats

- Engine and Studio 3.0.0, skill 1.0.0: `ENGINE_VERSION` and `SKILL_VERSION` in `src/engine.js`, stamped into the blueprint's `sources.engine` and `sources.skill`.
- Project state schema 3.0.0 (new, `schema/project-state.schema.json`, generated from the engine): the 70-item register with entries is a breaking change to the project file.
- Blueprint schema 2.0.0 (`schema/architecture-blueprint.schema.json`, generated from the engine): per-role sign-offs, G3-driven governance, and no unknown fields in any object.
- Save file (new): kind `pre-sdd-save`, the project state and the blueprint computed at the same UTC time, named `pre-sdd-<slug>-state-<UTC stamp>.json`.

### Fixed in the move (design section 6.5)

- The authority text and the preview manifest flags say the Pre-SDD is locked for the SDD once G3 is signed, and that the SDD raises an open item instead of changing a locked item.
- `gate_status` and `authorized_to_start_sdd` follow G3, instead of always reading provisional and false.
- A BRD is named by a checked key with its path and version (`--brd KEY=path@version`), so the blueprint's BRD sources always pass the schema; a v2.2 file's BRD reference comes in as an unknown for a person to close.
- The tenant model is register item DAT-07, with five isolation levels; it lands in SDD Q7 and section 11, and a v2.2 tenant model maps to it on import.
- The hard-coded hash of the SDD skill's own file is gone: the blueprint carries the engine and skill versions instead.
- `Confirmed` needs who and when: the state gate reads a `Confirmed` value without them as `Estimated`, and every Studio v2.2 value comes in as `Estimated`.
- The rule numbers SEC-11 and DB-READ-11 no longer collide (see the rule renames below).
- Saved file names carry the project slug and a UTC stamp: the save file, and the preview ZIP `pre-sdd-<slug>-preview-<UTC stamp>.zip`.
- The provider view opens on the logical view on every load, and AWS, Azure, GCP and On-premises are labelled illustration only, in the page and in the preview.

### Rule renames

- Rule `CAP-04` (workload-based capacity planning) is renamed `LOAD-04`, so `PSDD/CAP-04` always means the register item.
- Rule `DB-READ-11` is renamed `DB-READ-17`; `SEC-11` keeps its number.
- `RULE_RENAMES` in the engine maps both old IDs, and the test `ruleIds_neverEqualItemIds` keeps rule IDs and item IDs apart.

### Studio 3.0 page

- Stage 1 shows the 13 discovery rows; stage 2 shows one group at a time, the rows that need an answer first.
- Stage 3 (assess): the metrics, the calculations, the DR strategy per failure scope, the target shape and its conflicts, the diagrams, the options with costs, scores, weights and TCO, and the migration overlay when it applies.
- Stage 4 (confirm and decide): one confirm per group for every `Estimated` value, the overrides and the chosen option, the validation, and the gate with a read-only sign-off register and G3 checklist.
- Every answer needs the person's name and is recorded under it through `applyPatch`; a field is checked on blur, and the message says how to fix it.
- Embedded state: the page opens filled from the project state `cli.mjs embed` writes, through the state gate, at the stage and group the state names; a state it cannot read opens a blank project with the engine's messages.
- Import reads a save file, a 3.0 project state, a preview ZIP (its `project-state.json`), or a Studio v2.2 project file or ZIP; a blueprint is refused with what to load instead, and a failed import changes nothing.
- A Studio v2.2 import, and the example picker, run the engine's `importForPage`, the same sequence as `cli.mjs new --import`, so the page and the CLI give the same register.
- Save writes the save file; the skill picks it up with `validate --pick` and `unwrap`, and `diff` finds no difference between the page's blueprint and the CLI's.
- The preview ZIP holds 13 files, a manifest with `preview_only: true` and `pre_sdd_of_record: false`, and its buttons and toast say "Preview, not the Pre-SDD of record".
- The v2.2 layer is removed from the engine: `validate`, `blueprint`, `markdownReport`, `runBrief`, `modelV22`, `projectStateV22` and `exportFiles`, with the v2.2 ZIP, Markdown, run brief and project JSON controls.
- New engine exports for the page: `importForPage`, `registerView`, `stageBlock`, `fieldError`, `optionStatus` and `signoffRecords`, so the page copies no engine rule.
- `applyPatch` refuses every value `fieldError` refuses, for every actor, with the same text, enum rows included ("Choose one of ...").
- The manual check (`tests/MANUAL-CHECK.md`) passed 13 of 13 in headless Chrome on 2026-10-27; Firefox and Edge are left to the owner.

### Fixes from the fixture run (Task 7.0b)

- New landings in the SDD: DAT-01 in §6 Notes and §8.3, INT-03 in §8.3 and §18, CAP-08 in §18 and §18.5, and REL-10 in §8.6, §11 and §18.5.
- The gate label reads `Draft` and the blueprint's `gate_status` reads `draft` while G0 is not met, ahead of `Blocked`, so a new Pre-SDD reads Draft.
- The fragments print every number through the engine's formatter, the same way the calculations do, so a derived value such as CAP-02.1 reads `0.2292`, not a long binary fraction.
- The TCO and the CALC-21 unit name the currency from ECO-02, the first ISO 4217 code in its unit or value, and read `currency units` when there is none; the page's cost text uses the same currency.
- The Inputs column of the calculations fragment lists the entries and factors each calculation reads (CALC-10 to CALC-12 read CAP-01 and the DAT-02 factors; CALC-06 and CALC-07 read the CAP-06 factors), instead of the old requirement citations.

### Fixes from the fixture rerun (Task 7.0c)

- New landings in the SDD: BUS-07 (prohibitions) and BUS-08 (obligations) in §11, so the lock list carries every hard entry.
- The locked-items fragment prints the store kind with each data workload's value (a DAT-01 entry reads `<value> (storeKind: relational)`, without the value's trailing period, and `storeKind: TBD` when it is not held) and adds a `Data` row to its decision table: the kind and consistency, in the same words as the target shape.
- The options fragment's "Scores and costs" table has an `At` column after `By`: the UTC time each cost and score was last set or confirmed, as the state holds it.

### Fixes from the SDD fixture run (Task 7.0d)

- The lock list has a `Measures` column after `ID`: the row's title and the entry's label or scope, in the register's words, so an entry such as REL-03.1 says it is an RTO and an open entry says what it asks.
- The locked-items fragment adds a calculations table after the lock list: each `CALC-NN` of the calculations fragment with what it measures and its value with its unit (TBD when open), in the same words, so the SDD's §18 can cite them from chunk 12.
- The lock list has an `Owner` column before `Lands in the SDD`: the entry's owner as the register prints it, or the row's owner when the entry has none.

### Fixes from the final review

- I1: `src/package.json`, `{ "type": "commonjs" }`, keeps `engine.js` CommonJS when a folder above the skill declares `"type": "module"`, where the CLI loaded an empty engine (`--version` printed `engine undefined, skill undefined`, and `new` failed with `E.newState is not a function`); it names no dependency, and `cli_version_insideEsmProject_loadsEngine` guards it.
- I2: `cli.mjs`, `build.mjs`, and the two schema generators in `tools/` run their command when `import.meta.url` equals the file URL of the real path of `process.argv[1]`, instead of `import.meta.main`, which Node.js has only from 22.18 on the 22 line and from 24.2 on the 24 line; elsewhere it is undefined, which made every command exit 0 without output; importing any of them still runs nothing.

### Known limitation

- A zero RTO on `az` beside a remote failure scope over-reports `CONFLICT-zeroRTO-topology@az`; a topology override of `active`, or a relaxed `az` RTO, clears it (accepted by the owner at stop C2).

### Builder decisions (Phase 2)

- The project file is schema 3.0.0: header rows, the 70 checklist items and the migration overlay rows, each with one or more entries; options, decisions, gate, unknowns and history. Every timestamp is UTC.
- Rule CAP-04 is renamed LOAD-04 and DB-READ-11 is renamed DB-READ-17, so no rule ID equals a register item ID.
- Every change goes through one function, applyPatch, as a batch of ops. A batch is all or nothing: any error leaves the state unchanged and lists every error.
- Who may do what: an agent cites a source for every value and never confirms, decides, signs, accepts a proposal on a person's entry, or closes an unknown; an answer policy may take a recommended answer for a choice, but never supplies a fact, never marks N/A, never closes an unknown, never sets or confirms a score, never ticks a G3 checklist line, and never decides; only a named person grants or revokes an exception; a fixture acts for the named fixture owner in test runs.
- A value a person confirmed or answered is protected: an agent or a policy cannot change it; a person's later change makes it Estimated until confirmed again.
- A kind a person sets with a reason is kept: the engine never changes it, and pauses derivation or defaults on that entry until the person gives the value.
- Derived values recompute after each change; a derived value whose inputs are missing goes back to Open (TBD), never zero.
- Defaults come from the policy appendix version 1 (the seven factors) and two project rules (OPS-04 environments, adding dr for site, region or provider scopes; CAP-08 measured at the ingress edge).
- Imported v2.2 files: values that fail validation are dropped with an unknown (QD-NN) naming the field, value and reason; the v2.2 decision history and approvals are not imported.
- DR is chosen per failure scope with the v2.2 thresholds; a zero RPO raises the remote-scope conflict only for site, region or provider scopes; a known limitation: a zero RTO on az beside a remote scope raises CONFLICT-zeroRTO-topology@az.
- Options are shape-level. The hard-constraint check reads hosting, network and topology with DR; a person may exclude an option with the entry it breaks and a reason. TCO is one-time plus horizon times monthly; the weighted value needs an approved weight above 0 and a score for each such criterion, else TBD with an unknown.
- Scores run from 1 (worst) to 5 (best) on every criterion; for cost, 5 is the cheapest.
- Gates run in order: G3 approval needs G0 and G1 met and a G2 shortlist. Every critical entry needs a confirmation (or N/A with a reason, or an Open entry under a valid exception) at G3.
- An Approver stand-in counts only under the current policy's label and only when nothing else fails; a stand-in's Rejected always blocks; a person's sign-off replaces a stand-in's.
- "Approved with conditions" needs at least one recorded condition with an owner and a due date; until then G3 reads Blocked.
- A Done G3-11 formally accepts the remaining conflicts (DT-15), and the blueprint marks them excepted.
- A content change after G3 sends the gate back to Review and needs new signatures.
- The state gate rejects a hand-edited project file it cannot read safely and lists every problem at once, in file order, in plain words.
- Blueprint 2.0.0: gate_status and authorized_to_start_sdd follow G3; per-role sign-offs replace approved_by; every object rejects unknown fields.
- Save files are named with the project slug and a UTC stamp; the ZIP's entry times are UTC.
- Fragments for the chunk templates: no level-1 or level-2 headings, one `### <ROW-ID>` heading per register row, cell text escaped, and TBD for any empty value.
- The CLI (`cli.mjs`): new, derive, compute, validate, unwrap, diff, embed; exit codes 0 ok, 1 differences, 2 invalid input, 3 usage.

## Imported from Studio v2.2

Imported on 2026-10-23 (UTC) from the Studio v2.2 delivery folder `pre-sdd-preparation/Pre-SDD_Architecture_Studio Visualizer/`. The five source files are byte for byte copies, so every character inside them is kept as delivered. The originals were not changed. The two example ZIPs are not stored in the repository, only their extracted contents.

### Hash table

SHA-256 of each original. Each copy of a source file has the same hash. The first column is relative to the delivery folder named above, the second column is relative to `studio/`.

| Original | Stored as | Bytes | SHA-256 |
|---|---|---|---|
| `source/app.js` | `src/app.js` | 116754 | `5a8baeddf20d51ff8c6a27add82a68478d231338b7475495ba87aa0846cf8729` |
| `source/shell.html` | `src/shell.html` | 20561 | `1d8951f497475ac017f0ae7ce117685665f8a78bc69ff69124bde2d6b0eb5506` |
| `source/style.css` | `src/style.css` (rewritten by Task 3.1, no longer equal to the original) | 13949 | `58296c9141f54a4edbbe8072a5db66eb2a18e0406f94cf32d3678282b68f359d` |
| `architecture-blueprint.schema.json` | `schema/architecture-blueprint.schema.json` | 21722 | `6bc2386443fd162dc6aff18d82e087d783dd755b1a887742b970a37d19871953` |
| `validate_handoff.py` | `validate_handoff.py` | 6944 | `2a99d635cdb1301bcb1839b079248c6bbba0afcc2fc3d595e624350e1347524a` |
| `Example_Regional_Zero_RTO_RPO_Handoff.zip` | extracted to `tests/golden/regional-zero/` | 164976 | `c287bd3a209638180cf875ac51306feb009a7fddd430dd41a8ad3f94efe75c5f` |
| `examples/Example_Local_Zero_RTO_RPO_Handoff.zip` | extracted to `tests/golden/local-zero/` | 151038 | `9248f24599e9cbd593216be7379ba5bf36fe870eedf65267ce48d89234324619` |

### Golden data

- Each ZIP holds 13 files, flat apart from `diagrams/`. The extracted file names equal the `files` list in each `manifest.json`, and every extracted file equals its ZIP entry byte for byte.
- Both manifests are format `Pre-SDD-Architecture-Studio-Manual-Handoff`, version `2.2`, readiness `Provisional / review required`.
- The five sources and all 26 extracted files use LF line endings (no CR bytes).
- The third golden case, `demo`, is `examples/studio-v2.2-export/` in the skill folder, outside `studio/`.

### Review result

- Scan of `src/app.js`, `src/shell.html`, `src/style.css`, `validate_handoff.py`, and the schema for `fetch(`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `sendBeacon`, `localStorage`, `sessionStorage`, `indexedDB`, `import(`, `eval(`, `new Function`, `<script src`, `<link`, `@import`, and `url(http`: no match, also none when case is ignored.
- The only absolute URLs are the SVG namespace inside a generated `<svg xmlns=...>` string in `src/app.js` and the JSON Schema `$schema` identifier in the schema. Neither is requested at run time. The schema has local `$ref` values only.
- Local file access in `src/app.js` is limited to `Blob` with `URL.createObjectURL` for downloads and `FileReader` for importing a saved file.
- `validate_handoff.py` was read in full. It reads the JSON file given on the command line, `architecture-blueprint.schema.json` beside the script, and the Mermaid files named by the document's diagrams (next to the JSON file). It writes nothing and needs the `jsonschema` package. As imported it looks for the schema beside itself, so with the schema stored in `schema/` it exits with code 3 until the layout or the lookup changes. With the schema placed beside it, all three golden blueprints pass.
- `src/app.js` holds 16 em dash and 1 en dash characters and `src/shell.html` holds 11 em dash and 1 en dash characters, all inside string literals or visible text and none in comments. The export headings of the golden data carry the same em dash.

### Build identity

- `src/shell.html` with `/* STYLES */` replaced by `src/style.css` and `/* JAVASCRIPT */` replaced by `src/app.js` equals `Pre-SDD_Architecture_Calculator_v2_2.html` byte for byte: True. Both are 151236 bytes with SHA-256 `ccf91462191d7923e22181f2977b29040103208b7f4b3b5d39f2d5e22119d069`. Each marker occurs once in `shell.html` and not in the CSS or the JavaScript.
- `src/app.js` is a working input and is deleted later in the 3.0.0 work.

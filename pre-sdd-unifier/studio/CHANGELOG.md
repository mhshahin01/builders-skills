# Changelog

## 3.0.0 (in progress)

- Imported the Studio v2.2 sources, blueprint schema, handoff validator, and the two v2.2 example exports as the starting point and as golden test data. Details are in the next section.

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
| `source/style.css` | `src/style.css` | 13949 | `58296c9141f54a4edbbe8072a5db66eb2a18e0406f94cf32d3678282b68f359d` |
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

# Changelog

## 3.0.0 (in progress)

- Imported the Studio v2.2 sources, blueprint schema, handoff validator, and the two v2.2 example exports as the starting point and as golden test data. Details are in the next section.

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

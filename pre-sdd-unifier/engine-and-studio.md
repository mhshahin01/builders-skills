# Engine and Studio

This file defines how the skill runs the engine. It covers Node.js, every CLI command with its flags and exit codes, the patch file and its ops, and where the files land. It also covers the fragments and their markers, the parity check between the Studio and the CLI, the Studio's preview ZIP, and what to do when Node.js is missing. Read it at step 5 of [SKILL.md](SKILL.md).

There is one calculator. The engine, `studio/src/engine.js`, holds the catalogue, the calculations (`CALC-NN`), the DR strategy and topology choice, the rules, the validation, the gates, the derivations, and the writers. The Studio, `pre-sdd-studio.html`, bundles it for the web path. The CLI, `studio/cli.mjs`, runs it under Node.js for the skill. Every number in a chunk comes from the engine's output. No number is worked out by hand, in prose, or with another tool.

---

## Node.js

**Node.js is required.** Before the first engine command in a session, run `node --version`.

- **When it fails** (the command is not found): stop. Tell the user two things: this skill needs Node.js installed and on the PATH, and the run resumes from where it stands once Node.js is there. Write no chunk and no number.
- **When a CLI command fails to start** although `node --version` works: show the user the message and the Node.js version, and stop. The build is tested with Node.js 24.14.0.
- **Never work around it.** No number is computed by hand, in prose, in another language, in a spreadsheet, or by driving the Studio page for the skill. The browser is the person's path, not the skill's calculator.
- **What the person can still do:** the blank Studio, `<skill>/studio/pre-sdd-studio.html`, opens in a browser without Node.js. Its ZIP export is a preview (§ The preview ZIP). It is not a Pre-SDD, and the skill writes nothing from it until Node.js is there.

---

## Running the CLI

- `<skill>` is this skill folder's absolute path. Commands run from the project root, the folder that holds the hop folders (`./brd-*`, `./pre-sdd-*`, `./sdd-*`).
- **Quote every path:** paths may hold spaces. Forward slashes work on every system, Windows included.
- The output is UTF-8 with LF line endings. Every JSON file a command writes, and every JSON it prints, is indented by two spaces and ends with a newline.
- `--now <ISO 8601 UTC>` is accepted by every command, for tests only. It takes a UTC time with `Z` (for example `2026-10-23T11:01:02Z`). An offset such as `+02:00` is a usage error. A run never passes it: the engine stamps the real UTC time.

The examples below use a skill folder and a project root whose paths hold spaces: `C:/Users/Dana Lee/.claude/skills/pre-sdd-unifier` and `D:/Work/Refunds Platform`.

| Command | What it does |
|---|---|
| `new` | Creates the project state |
| `derive` | Applies a patch, then the defaults and derivations, and writes the state back |
| `compute` | Writes the model, the blueprint, the fragments, and the diagrams |
| `validate` | Checks a file of any of four kinds; with `--pick`, finds the person's save first |
| `unwrap` | Splits a Studio save file into the project state and the Studio's blueprint |
| `diff` | Compares two blueprints |
| `embed` | Builds the Studio with a project state inside |
| `--version` | Prints the engine and skill versions |

### `new`

```
node cli.mjs new <project-dir> --name "<name>" [--slug <slug>] --brd <KEY>=<path>@<version>[:<status>] ... [--mode full|quick] [--input web|prompt] [--light] [--import <v22.json|v22.zip>]
```

```
node "C:/Users/Dana Lee/.claude/skills/pre-sdd-unifier/studio/cli.mjs" new "D:/Work/Refunds Platform/pre-sdd-refunds-platform" --name "Refunds Platform" --slug refunds-platform --brd "REFUNDS=../brd-refunds-portal/refunds-portal-brd-master.md@1.5:Approved" --mode full --input prompt
```

| Flag | Meaning |
|---|---|
| `<project-dir>` | The Pre-SDD folder, `./pre-sdd-[slug]` |
| `--name` | The system name |
| `--slug` | The project slug, `[slug]`. Pass it every time, so the folder, the state, the save file name, and `--pick` all use the same slug. Without it, the engine makes one from the name |
| `--brd` | One per source BRD. It holds the BRD's key (capitals, digits, and hyphens, for example `RESELLER-PORTAL`), the path of its master file (or combined file) relative to the Pre-SDD folder, its version, and, after a colon, its cover status. The key ends at the first `=`. The version follows the last `@`. The status follows the first `:` after that `@`. Everything between the `=` and the last `@` is the path, so a path may hold spaces, a drive letter, a `:`, or an `@` (`C:/Work Files/brd@refunds/refunds-brd-master.md@1.5:Approved`). A version holds no slash, backslash, or space, so a value without `@<version>` is a usage error |
| `--mode` | `full` or `quick`; pass it every time |
| `--input` | `web` or `prompt`; pass it every time |
| `--light` | A light run (SKILL.md § Light run) |
| `--import` | A Studio v2.2 project file (`.json`) or handoff ZIP (`.zip`) (IMPORT). Its values come in as `Estimated`, with source `Import: Studio v2.2`. The BRDs, the mode, the input path, and `light` come from the flags. The engine drops the file's decision history, so it is not imported. When the skill imports a v2.2 file, it tells the user that the history does not come in. When the v2.2 file gives a BRD reference, the import raises an unknown about it, even when `--brd` names the BRDs. A person closes it |

`new` writes `<project-dir>/studio/project-state.json`, with every register row `Open` and one primary entry each. It then applies the engineering defaults and the derivations. It prints JSON: `{ state, counts, gate }`.

- `state` is the path of the file it wrote.
- `counts` is the entries by status (`open`, `estimated`, `confirmed`, `na`).
- `gate` is the engine's gate result.

`--name` and at least one `--brd` are required. **It refuses when that file already exists** (exit code 2). Such a folder is a resume (`stages-and-input.md` § Resuming), and `new` is never run on it again.

### `derive`

```
node cli.mjs derive <state.json> [--apply <patch.json>] [--actor <actor.json>]
```

```
node "C:/Users/Dana Lee/.claude/skills/pre-sdd-unifier/studio/cli.mjs" derive "D:/Work/Refunds Platform/pre-sdd-refunds-platform/studio/project-state.json" --apply "D:/Work/Refunds Platform/pre-sdd-refunds-platform/studio/patches/20261026T101500Z-stage1-batch2.json"
```

`derive` reads the state through the state gate. It applies the patch file (§ The patch file), then the defaults and the derivations. It writes the state back and prints JSON: `{ changes, errors, counts: { open, estimated, confirmed, na }, gate, notes }`.

- `changes` lists each change with its target (an entry ID, a factor, an option, a role, an ID such as `QD-03`). Read new entry IDs here before citing them.
- `errors` lists each refused op, by its index in the patch, with what to do instead. **A patch is applied whole or not at all:** when any op is refused, nothing in the patch is applied, `counts` and `gate` read `null`, the file is not written, and the exit code is 2. A state the gate cannot read gives its problems as `errors` the same way.
- `counts` and `gate` are the engine's: the counts by status and the gate result (G0, G1, G2, G3, the label, and whether the SDD is authorized). Summaries quote them, never a count made by hand.
- `notes` lists three things, in plain words:
  - the corrections the state gate made on reading (the `STATUS-` advisories);
  - "Sign again" for each sign-off in the patch that no longer matches the content, because later ops in the patch or the defaults and derivations changed it, so G3 does not count it (send each sign-off in a patch of its own, after the content changes);
  - for each value the engine cleared, why the entry is `Open` again (an input is missing, or a person set the kind).
- Without `--apply`, `derive` only applies the defaults and the derivations, for example after a person fixed the file by hand.
- `--actor` names an actor file, and needs `--apply` (without it, exit code 3). Giving the actor both in the patch and with `--actor` is refused (exit code 2). This skill puts the actor in the patch file instead.
- **What `derive` refuses besides the engine's own refusals:**
  - an op whose `source` or `cite` text is one of the engine's own default or derivation texts (`Default: policy appendix v<N>`, `Default: project rule <row>`, `Derived: CALC-NN from <items>`, exactly as the engine writes them);
  - an actor named `pre-sdd-engine`, in any case.

  Only the engine writes its defaults and derivations. Cite the BRD or the source used, or leave the entry to the engine.

### `compute`

```
node cli.mjs compute <state.json> --out <dir>
```

```
node "C:/Users/Dana Lee/.claude/skills/pre-sdd-unifier/studio/cli.mjs" compute "D:/Work/Refunds Platform/pre-sdd-refunds-platform/studio/project-state.json" --out "D:/Work/Refunds Platform/pre-sdd-refunds-platform/studio"
```

`compute` reads the state through the state gate (`register-and-entries.md` § Reading a project state), computes, and writes into `<dir>`:

- `model.json` (every calculation, the scopes, the target shape, the rules, the options, the validation, and the gate);
- `blueprint.json` and `blueprint.yaml` (the architecture blueprint, schema 2.0.0);
- `fragments/*.md`;
- `diagrams/*.mmd` (one Mermaid file per diagram);
- `diagrams/architecture.drawio`.

It removes the `fragments/*.md` and `diagrams/*.mmd` files that an earlier run left and this run does not write (for example `08-overlay.md` once the overlay stops applying). It prints JSON: `{ out, files, gate }`. `out` is the folder, `files` is the files it wrote, and `gate` is the engine's gate label. A state the gate cannot read exits with code 2 and its problems, one per line. Run it before every write-up, every review stop, and the G3 stop, and after every change that a chunk shows.

### `validate`

```
node cli.mjs validate <file.json>
node cli.mjs validate --pick <folder> --slug <slug> --since <ISO>
```

Give exactly one of the two: a file, or `--pick` with `--slug` and `--since`. Each of these is a usage error (exit code 3): both, neither, `--pick` without `--slug` or `--since`, and `--slug` or `--since` without `--pick`.

```
node "C:/Users/Dana Lee/.claude/skills/pre-sdd-unifier/studio/cli.mjs" validate "D:/Work/Refunds Platform/pre-sdd-refunds-platform/studio/project-state.json"
node "C:/Users/Dana Lee/.claude/skills/pre-sdd-unifier/studio/cli.mjs" validate --pick "C:/Users/Dana Lee/Downloads" --slug refunds-platform --since "2026-10-26T10:15:00Z"
```

`validate` finds out what the file is (a 3.0 project state, a Studio save file, a Studio v2.2 project, or a blueprint) and checks it. It prints one line per check: `PASS <check>: ...` or `FAIL <check>: ...`, and `NOTE` lines under a schema check (below). A `FAIL` line says what to fix. Any `FAIL` gives exit code 2.

- **A project state** (and a save file's project state) gets three checks:
  - the state gate in plain words (`register-and-entries.md` § Reading a project state);
  - the JSON schema `studio/schema/project-state.schema.json`;
  - `compute`, which reports the gate label and whether the SDD is authorized.

  The schema check runs on the state after the gate's corrections. When that state matches the schema but the file as saved does not, it prints `PASS <label> schema: the state after the gate's corrections matches schema/project-state.schema.json; the file as saved does not, as the NOTE lines say`. Then it prints one `NOTE <label> schema, file as saved: ...` line per problem. `NOTE` lines do not fail the check.
- **A save file's blueprint, and a bare blueprint,** are checked against `studio/schema/architecture-blueprint.schema.json`. A blueprint of another schema version (a Studio v2.2 blueprint) gets one `FAIL` line.
- **A Studio v2.2 project file** gets an import check: the unknowns the import would raise, and that its decision history does not come in.
- Any other JSON gets `FAIL kind`. At most 40 schema problems are listed, then "and N more problems".
- The schema checks run in Node.js; no Python is needed.

With `--pick`, it first finds the person's save in `<folder>`. This is the newest `pre-sdd-<slug>-state-<YYYYMMDDTHHMMSSZ>.json` (or the same name with ` (N)` added by the browser) whose modified time is after `--since`, the UTC time the Studio was built. It prints `PICKED <path>` as its first line, then checks the file. When no file matches, it prints `FAIL pick: ...` and exits with code 2. The skill always confirms the picked path with the person (`stages-and-input.md` § The web path).

### `unwrap`

```
node cli.mjs unwrap <save.json> <studio-dir>
```

```
node "C:/Users/Dana Lee/.claude/skills/pre-sdd-unifier/studio/cli.mjs" unwrap "C:/Users/Dana Lee/Downloads/pre-sdd-refunds-platform-state-20261026T103000Z.json" "D:/Work/Refunds Platform/pre-sdd-refunds-platform/studio"
```

`unwrap` reads a Studio save file and reads its project state through the state gate. It checks that the blueprint is there and matches the blueprint schema. It writes two files into `<studio-dir>`: `project-state.json` (the project state, as the gate reads it) and `studio-blueprint.json` (the blueprint the Studio saved, as saved). It prints JSON: `{ state, blueprint, notes }`, the two paths and the gate's corrections. It refuses (exit code 2) and writes nothing in these cases:
- a file that is not a save file (a bare project state included);
- a save whose state the gate cannot read;
- a save with no valid blueprint.

The skill never splits a save file by hand. `unwrap` is the only way a save becomes the project state of record.

### `diff`

```
node cli.mjs diff <blueprint-a.json> <blueprint-b.json>
```

```
node "C:/Users/Dana Lee/.claude/skills/pre-sdd-unifier/studio/cli.mjs" diff "D:/Work/Refunds Platform/pre-sdd-refunds-platform/studio/studio-blueprint.json" "D:/Work/Refunds Platform/pre-sdd-refunds-platform/studio/blueprint.json"
```

`diff` compares these parts of two blueprints: `calculations`, `decisions` (the rules), `validation` (without its `checked_at` time), `dr_scenarios` (the scopes), `architecture` and `conflicts` (the shape), `options`, and `governance` (the gate). A list whose items all carry their own `id` is matched by ID, so a path reads `calculations[CALC-03].result`. Exit code 0 means no difference, and it prints one line that says so. Exit code 1 prints one line per difference: `<path>: <value in a> in a, <value in b> in b`. A file that is not a blueprint exits with code 2. For a save file, the message says to run `unwrap` first and compare its `studio-blueprint.json`.

### `embed`

```
node cli.mjs embed <state.json> --out <file.html>
```

```
node "C:/Users/Dana Lee/.claude/skills/pre-sdd-unifier/studio/cli.mjs" embed "D:/Work/Refunds Platform/pre-sdd-refunds-platform/studio/project-state.json" --out "D:/Work/Refunds Platform/pre-sdd-refunds-platform/studio/pre-sdd-studio.html"
```

`embed` reads the state through the state gate. It builds the Studio with the project state inside, so the person opens a filled form with no import step. It prints JSON: `{ out }`, the path of the page. Note the UTC time before running it: it is the `--since` time for `validate --pick`. The page reads the embedded state through the state gate when it opens. A state it cannot read opens a blank project, with the engine's messages in plain words.

### `--version`

```
node "C:/Users/Dana Lee/.claude/skills/pre-sdd-unifier/studio/cli.mjs" --version
```

It prints `engine 3.0.0, skill 1.0.0`. Run it once per run; chunk 00 and the handoff guide record the engine version.

### Exit codes

| Code | Meaning | What to do |
|---|---|---|
| 0 | Success | Go on |
| 1 | Differences found (`diff` only) | Report each difference to the user |
| 2 | Invalid input, or failed validation, including a `--brd` key, a `--mode`, or an `--input` value the engine refuses. The message says what to fix | Fix the input (the patch, the state, the file) and run the command again. Tell the user when only a person can fix it |
| 3 | Usage error: an unknown command or flag, a missing argument, or a `--now` or `--since` value that is not a UTC time with `Z`. Also a `--brd` value with no key before `=`, no `@`, no path before the last `@`, no version after it, or a version holding a space, a slash, or a backslash. Also both or neither of `validate`'s file and `--pick` | Correct the command |

---

## The patch file

The skill changes the project state only through patches. A patch is a JSON file that names one actor and lists ops, applied with `derive --apply`. A patch holds only `actor` and `ops`. Any other key is refused.

```json
{
  "actor": { "type": "person", "name": "Dana Lee" },
  "ops": [
    { "op": "set", "entry": "REL-03.1", "value": 900, "measured_at": "Whole refund journey" },
    { "op": "confirm", "entry": "REL-03.1" },
    { "op": "set", "entry": "REL-04.1", "owner_name": "Sam Okafor", "due": "2026-11-15" }
  ]
}
```

**Actors:**

| Actor | Form | Recorded as |
|---|---|---|
| A person | `{ "type": "person", "name": "<their own name>" }` | Their name; never a label such as `Policy: ...` |
| The skill | `{ "type": "agent", "name": "pre-sdd-unifier" }` | The agent; its values are `Estimated` and cite a source |
| An answer policy | `{ "type": "policy" }` | `Policy: <policy> (set by <name>, <YYYY-MM-DD>)`, from the policy recorded with `set-policy`; it acts only once one is recorded |
| A fixture owner (test runs) | `{ "type": "fixture", "name": "<owner>" }` | `Fixture: <owner> (test-run policy)` |

One patch, one actor. The person's answers go in a patch under their name. The skill's own writes (pre-fill, proposals, scores, the progress pointer, the version bump) go in a patch under the agent. Only the agent cites a source: `source` on an op, `{ "type": "brd", "text": "BRD: REFUNDS/NFR-03" }` (types `brd`, `derived`, `default`, `import`). On `set-overlay`, the agent cites with `cite` in the same form, because there `source` is the overlay's source platform, which a person gives too. Every applied op is recorded in the state's history: when, who, the op, the target, the value before and after, and the reason.

**Where patches go:** `./pre-sdd-[slug]/studio/patches/`, one file per patch, named `<YYYYMMDDTHHMMSSZ>-<what>.json` (for example `20261026T101500Z-stage1-batch2.json`). They stay as the record of what was sent.

**The ops.** The table gives what the engine allows, as it enforces it. The skill's own rules (SKILL.md, and the rule files) may allow less where the engine cannot check the rule (for example, only an empowered owner ticks G3-11). Every op refuses a key it does not take, and every refusal says in plain words whom to ask instead. "A person or a fixture owner" means the engine refuses the agent, an answer policy, and the policy's stand-in.

| Op | Keys | Who may run it | What it does |
|---|---|---|---|
| `set` | `entry`, `value`, `label`, `scope`, `unit`, `window`, `measured_at`, `priority`, `verification`, `owner`, `owner_name`, `due`, `evidence`, `kind`, `reason`, `source` | Anyone, except: `owner_name` and `due` only from a person or a fixture owner (the engine refuses the agent and an answer policy whenever either key is in the op, even with an unchanged value). Never an answer policy on a fact row. The agent cites a source | Writes a value (`Estimated`) or record fields. A blank value is `null` and `Open`. A protected entry changes only by a person or a fixture owner. A kind change needs a reason |
| `add` | `row`, `label`, `scope`, `workload` | Anyone; never an answer policy on a fact row | Adds an entry to a repeating row; an OVL row names a workload |
| `remove` | `entry` | Anyone; never an answer policy on a fact row; a protected entry, or an entry whose kind a person set, only by a person or a fixture owner | Removes an added entry, never the primary |
| `set-factor` | `entry`, `factor`, `value`, `source` | Anyone; never an answer policy on a fact factor; the agent cites a source | Writes a sizing factor (`Estimated`) |
| `confirm` | `entry` (with `factor`), or `option` with `cost` or `criterion` | A person, a fixture owner, or an answer policy (never a fact, a fact factor, a cost, or a score); never the agent | Confirms an `Estimated` value with who and when |
| `confirm-group` | `group` (`HDR`, `BUS` to `ECO`, `OVL`) | As `confirm` | Confirms every `Estimated` entry and factor of the group (never a cost or a score); an answer policy skips the facts |
| `propose` | `entry`, `value`, `reason` | The agent only | A proposal beside an `Open` entry of CAP-07, REL-01, REL-03, or REL-04 |
| `accept-proposal` | `entry` | A person, a fixture owner, or an answer policy (never on a fact row, and not beside an entry a person left open); never the agent | Takes the proposal: the value, `Confirmed` |
| `na` | `entry`, `reason` | A person or a fixture owner; never the agent or an answer policy | Marks the entry `N/A` with the reason |
| `open` | `entry` | Anyone; never an answer policy on a fact row; a protected entry only by a person or a fixture owner | Returns the entry to `Open`, clearing its value and source |
| `set-option` | `option`, `name`, `shape` | Anyone | Adds an option `OPT-NN` (no `option` key) or changes one; a new name or shape returns its confirmed costs and scores to `Estimated` |
| `set-cost` | `option`, `cost` (`one_time`, `monthly`), `value` | A person or a fixture owner | A cost, a number 0 or more; blank clears it |
| `set-score` | `option`, `criterion`, `value`, `reason` | The agent, a person, or a fixture owner; never an answer policy; a confirmed score only by a person or a fixture owner | A score from 1 (worst) to 5 (best) with a one-line reason, `Estimated` |
| `set-weights` | `values` | A person or a fixture owner | The criterion weights, recorded as approved by that person |
| `set-horizon` | `value` | A person or a fixture owner | The TCO horizon in whole months |
| `exclude-option` | `option`, `entry`, `reason` | A person or a fixture owner | Marks the option as breaking a hard register entry, with the reason. The option then fails its hard check (`excluded`), so it is never ranked or chosen and G2 does not shortlist it. Refused for the chosen option |
| `include-option` | `option` | A person or a fixture owner | Lifts an exclusion; refused when the option is not excluded |
| `remove-option` | `option` | A person or a fixture owner | Removes an option. Refused while it is the chosen option (clear the choice first with `decide`, `option: null`). Its `OPT-NN` is never used again |
| `check` | `id`, `status` (`Done`, `N/A`, `Open`), `reason` | A person or a fixture owner; never the agent or an answer policy | Ticks a G3 checklist line, `G3-01` to `G3-14` |
| `sign` | `role`, `decision`, `applicable`, `reason` | A decision: a person, or an answer policy's Approver stand-in (counted only when its conditions hold). Not applicable (`applicable: false`): a person or a fixture owner, never a stand-in. Never the agent | A sign-off for one role, with the content hash of the state signed, or a role marked not applicable with the reason |
| `add-condition` | `text`, `owner`, `due` | A person or a fixture owner | A condition `COND-NN` |
| `set-condition` | `id`, `text`, `owner`, `due` | A person or a fixture owner | Changes the named fields of a condition (at least one), with the same rules as `add-condition` |
| `remove-condition` | `id` | A person or a fixture owner | Removes a condition |
| `add-exception` | `entry`, `reason`, `expires`, `review` | A named person only | A time-bound exception `EXC-NN` |
| `revoke-exception` | `id`, `reason` | A named person only | Removes an exception; the history keeps it with the reason, and its entry blocks again as the gate rules say |
| `reopen` | `reason` | Anyone | Marks a chunk content change after G3, so G3 goes back to review |
| `set-policy` | `policy` (`{ label, stand_ins }`, or `null`) | A person or a fixture owner | Records the answer policy and its stand-ins, or clears it |
| `set-run` | `mode`, `input`, `light`, `stage`, `group` | `stage` and `group`: anyone; `mode`, `input`, and `light`: a person or a fixture owner | The run fields and the progress pointer (`stage` 1 to 4; `group` `HDR`, `BUS` to `ECO`, `OVL`, or `null`). Quick mode refuses a stage above 1, and a run past stage 1 cannot switch from full to quick |
| `set-overlay` | `applies`, `source` (`unknown`, `onprem`, `samecloud`, `othercloud`, `mixed`), `cite` | A person or a fixture owner (without `cite`). The agent only with `cite { type, text }`, which is checked like `source` on other ops and kept as the history record's reason. Never an answer policy | The migration overlay switch and its source platform; takes `applies`, `source`, or both |
| `add-workload` | `name` | Anyone | A workload `WL-NN` (never used again once removed), with its entry on every OVL row |
| `rename-workload` | `id`, `name` | Anyone | Renames a workload |
| `remove-workload` | `id` | Anyone | Removes a workload and its OVL entries. Refused while any of them holds a value or a factor value or is `Confirmed` or `N/A` (mark them `N/A` instead). Also refused for `WL-01`, which holds the primary entries (rename it instead), and for the last workload, overlay on or off |
| `set-brd` | `key`, `path`, `version`, `status` | A person or a fixture owner | Adds a source BRD or records its new version and status |
| `remove-brd` | `key` | A person or a fixture owner | Drops a source BRD, never the last |
| `set-version` | `version` | Anyone but an answer policy | Bumps the Pre-SDD version (`X.Y`, greater than the current one, major then minor compared as numbers) |
| `decide` | `topology`, `dr`, `reason`, `option` | A person or a fixture owner; never the agent or an answer policy | The stage 4 decisions: a topology override, a DR override per failure scope (a blank, `auto`, or `undetermined` value removes it), their reason (required when the op adds or changes an override; cleared when none remains), and the chosen option, which must pass every hard check. `option: null` clears the choice |
| `add-unknown` | `entry`, `question`, `impact`, `owner`, `due` | Anyone | An unknown `QD-NN`, `open` |
| `close-unknown` | `id`, `resolution` | A person or a fixture owner; never the agent or an answer policy | Closes an unknown with its resolution |

What the rows, fields, and statuses mean: `register-and-entries.md`. The gate ops (`check`, `sign`, `add-condition`, `set-condition`, `remove-condition`, `add-exception`, `revoke-exception`, `reopen`): `gates-and-signoff.md`. The option ops (`set-option`, `set-cost`, `set-score`, `set-weights`, `set-horizon`, `exclude-option`, `include-option`, `remove-option`, `decide`): `options-and-economics.md`. The overlay ops (`set-overlay`, `add-workload`, `rename-workload`, `remove-workload`): `migration-overlay.md`.

---

## Where the files land

Everything the engine reads or writes for a project is in `./pre-sdd-[slug]/studio/`:

| File | Written by | Holds |
|---|---|---|
| `project-state.json` | `new`, `derive`, or `unwrap` (from the person's save, web path) | The project state of record |
| `patches/<YYYYMMDDTHHMMSSZ>-<what>.json` | The skill | Each patch it applied |
| `pre-sdd-studio.html` | `embed` | The Studio with this project's state inside |
| `studio-blueprint.json` | `unwrap`, from the person's last save | The blueprint the Studio computed, for `diff` |
| `model.json` | `compute` | The engine's full result |
| `blueprint.json`, `blueprint.yaml` | `compute` | The architecture blueprint (schema 2.0.0) |
| `fragments/*.md` | `compute` | The Markdown fragments the chunks paste |
| `diagrams/*.mmd`, `diagrams/architecture.drawio` | `compute` | The Mermaid diagrams and the draw.io file |

The chunks, the master, and `decision-log.md` sit one level up, in `./pre-sdd-[slug]/`. The Studio's save files stay where the browser saved them. The blank Studio in the skill folder, `<skill>/studio/pre-sdd-studio.html`, is never written by a run.

---

## The fragments and their markers

`compute` renders each part of the write-up that holds numbers or engine results as a Markdown fragment in `fragments/` (decision 13). It uses the engine's `fragments(state, model, { now })`, so the fragments, the model, and the blueprint of one run carry the same UTC time:

| Fragment | Holds |
|---|---|
| `01-header.md` | The header rows |
| `02-classification.md` | The classification and the path |
| `03a-register-business.md` to `03h-register-economics.md` | The register tables, one per group |
| `04-calculations.md` | Every `CALC-NN` with its formula, inputs, result, and status |
| `05-target-shape.md` | The target shape and the DR strategy per failure scope |
| `07-options.md` | The options, the hard-constraint filter, the comparison, and the TCO |
| `08-overlay.md` | The migration overlay rows per workload; only while the overlay applies |
| `09-rule-trace.md` | The rule trace |
| `10-validation.md` | The blockers, conflicts, advisories, and unknowns |
| `11-gate.md` | The gate result, the checklist, the sign-offs, the conditions, and the exceptions |
| `12-locked-items.md` | Four tables: each locked entry with what it measures (the row's title and the entry's label or scope, in the register's words), its value (a data workload's value with its store kind, for example `(storeKind: relational)` on DAT-01), its status, its owner (as the register prints it, or the row's owner when the entry has none), and where it lands in the SDD; the calculations, each `CALC-NN` of `04-calculations.md` with what it measures and its value (TBD when open), which §18 cites; the target-shape decisions (hosting, topology, the DR strategy per failure scope, the data shape (store kind and consistency), and the chosen option once one is set); and the landing table, each SDD place with the rows that land there, from the engine's landing map |

The chunk templates (`chunks/*.md`, `TEMPLATE-COMBINED.md`) place a pair of markers wherever a fragment goes. The name in the marker is the fragment's file name:

```
<!-- ENGINE-FRAGMENT: 03c-register-reliability.md -->
(the fragment, pasted unchanged)
<!-- /ENGINE-FRAGMENT -->
```

- **Paste each fragment whole and unchanged** between its markers, and keep the markers. On a rewrite, replace everything between them with the new fragment.
- **Never edit a fragment.** A wrong value is fixed in the project state (a patch through `derive`). Then `compute` runs again and the fragment is pasted again.
- A fragment follows these rules:
  - It carries no level-1 or level-2 heading (the template owns them).
  - It writes a missing value as `TBD` in every empty cell, never `0` or a blank.
  - It writes an empty list as `None.`.
  - It escapes table characters so the table keeps its columns.
- The register fragments (`01-header.md`, `03a` to `03h`, `08-overlay.md`) render each row as a `### <ROW-ID>` heading. Under it come the row's title in bold, then its entries table, then a factors table where the row has factors. The heading is what a `PSDD/<ID>` link resolves to (`#rel-03`).
- Prose around a fragment cites values by ID and states no number the fragments do not hold.

---

## The parity check

Both input paths give the same results, because they run the same engine on the same project state:

1. **One engine.** The Studio is built with `studio/src/engine.js` inside it, byte for byte, and a test of the build compares the bytes (`studio/tests/build.test.mjs`). `embed` builds the same way.
2. **One comparison after every web save.** The skill unwraps the save (`unwrap`) and recomputes the saved state with the CLI. It compares the result with the blueprint the Studio saved (`diff`, `stages-and-input.md` § The web path). The expected difference is none.
3. **One import.** The Studio's Import of a Studio v2.2 project file or ZIP runs the engine's `importForPage`: `importV22`, the state gate, then the defaults and the derivations. This is the same sequence as `new --import`, so both give the same register (`studio/tests/import-page.test.mjs`). A 3.0 project state, a save file, or the project state inside a preview ZIP opens as saved, through the state gate only.

When `diff` finds a difference, report each one to the user, by its path. The chunks always come from the CLI's `compute`, never from the Studio's blueprint.

---

## The preview ZIP

The Studio keeps a ZIP export for people who use the HTML without the skill. It is labelled a preview, never the Pre-SDD of record:

- `Pre-SDD-preview.md`, whose first line says it is a preview, not the Pre-SDD of record;
- `architecture-blueprint.json`, `architecture-blueprint.yaml`, and `project-state.json`;
- `diagrams/*.mmd` and `diagrams/architecture.drawio`;
- `Validation_Report.md` and `Decision_Record.md`;
- `manifest.json`, which lists these files and says three things: the set is a preview (`preview_only: true`, `pre_sdd_of_record: false`); the Pre-SDD is locked for the SDD once G3 is signed; the SDD raises open items instead of changing a locked item.

It holds no SDD run brief: the handoff guide (chunk 12) replaces it. The skill never copies a preview's Markdown into a chunk. Its `project-state.json` is a bare 3.0 project state, not a save file, so `unwrap` refuses it. When a person hands one over to carry on from it, the skill does these steps:
- It checks the file with `validate`.
- It confirms with the person.
- It copies the file unchanged as `./pre-sdd-[slug]/studio/project-state.json`.
- It runs `derive` on it without `--apply`, which reads it through the state gate, applies the defaults and the derivations, and writes it back.

It never edits the file by hand. When that folder already holds a project state, the copy replaces it only after the person confirms that it should. `new` is never the way in, since it refuses a folder that holds a state (exit code 2).

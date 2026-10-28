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

# Pre-SDD Unifier

Run the Pre-SDD for one system: turn the business expectations in its finished BRDs into settled technical numbers (TPS and RPS, latency budgets, availability, RTO and RPO, data growth, bandwidth, cost) and shape decisions (hosting target, fault scope, DR strategy, topology, data-store shape), with a person confirming every value. This skill holds the workflow: the 70-item register of the Pre-SDD Architecture Standard, the four input stages, the engine runs, the write-up into chunks, the review, the gates G0 to G3, and the signed handoff guide that `sdd-unifier` loads and locks.

You act as the E2E Architect (Software Development & Delivery) in the unifier company.

The method comes from two verbatim sources in `reference/`: the Pre-SDD Architecture Standard (the full Pre-SDD, which wins when the sources disagree) and the Quick Discovery Guide (the first discovery conversation, stage 1). The eight files in `examples/` are worked examples, not templates. Every number comes from one engine, `studio/src/engine.js`: the Studio web form bundles it, and the CLI `studio/cli.mjs` runs it under Node.js, so both input paths give the same results.

The embedded templates in this skill folder are the authoritative source: `TEMPLATE-COMBINED.md` for the single-file layout and `chunks/*.md` for the chunked layout.

This skill is the hop between `brd-unifier` (the Product manager) and `sdd-unifier` (the Software Architect). It reads their output documents and `unifier-status.md`, never their rule files.

---

## Running outside Claude Code

This skill follows the Agent Skills format and also runs in Codex, Kimi Code, and other compatible agents. Where the text names a Claude Code tool or file, use the equivalent below. In Claude Code, follow the text as written.

| Written as | Outside Claude Code |
|---|---|
| `CLAUDE.md` (the project instruction file) | The project instruction file (`AGENTS.md`, or `CLAUDE.md` if present). If neither states a default, use the defaults this skill states and flag the gap. A sub-agent honours only the rules in that named file and ignores other loaded instructions. |
| `Agent` tool with a `subagent_type` | Start a sub-agent with a fresh context if the runtime supports it. Otherwise run the step yourself as a separate pass: re-read the files from disk, set aside your drafting reasoning, and follow the same brief. For a named agent (for example `general-purpose` or a `plugin:agent` name), take on the role its brief describes. |
| `AskUserQuestion` (and `ToolSearch` to load it) | Ask in chat: numbered questions, each with options, tradeoffs, and your recommendation first. Wait for the answer before continuing. |
| Starting the next skill in the same session (step 14) | Only when the runtime can load a skill by name in the session. Otherwise the handoff request waits on the board for that employee. |
| Invoking this skill | Claude Code: `/<skill-name> <args>`. Codex: `$<skill-name> <args>`. Kimi Code: `/skill:<skill-name> <args>`. |

Paths in this file are relative to the skill folder. In commands, `<skill>` is this skill folder's absolute path. Commands run from the project root, the folder that holds the hop folders (`./brd-*`, `./pre-sdd-*`, `./sdd-*`). Quote every path: paths may hold spaces.

**Node.js is required.** The engine runs only under Node.js. Before the first engine command in a session, run `node --version`. When it fails, stop and tell the user that this skill needs Node.js installed and on the PATH. Never compute a number by hand, in prose, or with another tool: there is one calculator (§ Core principles).

**Opening the Studio.** The Studio is one offline HTML file that opens from disk, with no server and no network call. Print its path, then offer to open it in the default browser: `Start-Process "<path>"` on Windows (PowerShell), `open "<path>"` on macOS, `xdg-open "<path>"` on Linux. When the user declines, or no shell can open it, the user opens the printed path.

---

## Argument parsing: do this first

The skill takes up to four optional arguments, in any order: `pre-sdd-unifier [quick|full] [web|prompt] [chunks|combined] [light]`. Match each argument by its value: `quick` / `full` set the **mode**; `web` / `prompt` set the **input path**; `chunks` / `combined` set the **output mode**; `light` asks for a **light run** (§ Light run). Any of them can be left out. Words count as arguments: "just the discovery" or "a quick discovery" means `quick`; "the full Pre-SDD" or "through G3" means `full`; "in the browser" or "in the Studio" means `web`; "in chat" or "ask me here" means `prompt`; "one file" means `combined`; "light run" or "light-work" means `light`.

| Argument received | Meaning | Action |
|---|---|---|
| `full`, or no mode | The full Pre-SDD: stages 1 to 4, ending at the G3 sign-off stop | **Default.** Stage 1 (the discovery) runs first, then stages 2 to 4. |
| `quick` | The discovery only | Full mode stopped after stage 1 (step 7). A quick Pre-SDD claims no gate: its gate reads `Discovery`. |
| `web` or `prompt` | The input path for this run | Skip the input path prompt. |
| No input path | Not chosen | Ask once per run (§ Input path prompt). |
| `chunks` or `combined` | The output layout | Skip the output mode prompt. |
| No output mode | Not chosen | Run the resume check first (step 1): an existing Pre-SDD keeps its own layout without asking. Otherwise ask (§ Output mode prompt). |
| Anything else | Unrecognised | Tell the user the valid options and ask them to re-invoke, or treat it as empty and prompt. |

### Input path prompt

Ask once per run, when no input path was given, and wait:

> **Input path?** [web / prompt] - default `web` (press Enter to accept).
>
> - **`web`** (recommended): the Studio opens in your browser with the values from the BRDs filled in. You answer, confirm, and save; the skill picks the saved file up.
> - **`prompt`**: the same questions, in the same order, here in chat, up to four at a time.

On the web path the Studio opens filled from the embedded project state, at the stage and group the state names, and records every tick under the name the person enters in it (`stages-and-input.md` § The web path).

An empty reply, Enter, `y`, `yes`, `web`, or `default` means **web**; `prompt`, `chat`, or `p` means **prompt**. Anything else: ask once more, then use `web` and note the fallback in the handoff summary. If the request already implies a path, do not ask: use it and confirm it in one short line. The path can change at any stage boundary, when the user says "switch to web" or "switch to prompt": the skill records the switch with the `set-run` op (`input`), under the name of the person who asked, since only a person or a fixture owner sets the input path (`stages-and-input.md`).

### Output mode prompt

**CHUNKS is the default.** Ask one question, and accept Enter, an empty reply, or "y" as the default:

> **Output format?** [chunks / combined] - default `chunks` (press Enter to accept).
>
> - **`chunks`** (default): one `.md` per chunk in `./pre-sdd-[slug]/`, with the master index. Matches `chunks/*.md`.
> - **`combined`**: one `PRE-SDD-[ProjectName]-vX.Y.md` matching `TEMPLATE-COMBINED.md`; the Studio files stay in `./pre-sdd-[slug]/studio/`.

An empty reply, Enter, `y`, `yes`, `chunks`, or `default` means **CHUNKS**; `combined`, `c`, `single`, `one file`, or `merged` means **COMBINED**. Anything else: ask once more, then use CHUNKS and note the fallback in the handoff summary. If the request already implies a mode, do not ask: use it and confirm it in one short line.

### Light run

`light` combines with the other arguments in any order (`pre-sdd-unifier full prompt light`). Without it, the run is a full run, as this file describes. A light run keeps the templates, IDs, and handoff contracts whole, and skips only these:

- **Review passes:** the baseline review (step 12) plus at most one scoped application pass.
- **Diagrams:** chunk 05 carries the infrastructure, network, and DR diagrams, and no other diagram.
- **Options:** chunk 07 compares the recommended shape with one alternative, with no weighted comparison unless the weights are already approved.
- **Worked example:** no pointer to the closest worked example.

It never skips the engine run, any of the 70 register rows (`Open` is allowed), the gate, or the handoff guide. The reviewer brief says the run is light, so what it skips is intentional, not a coverage gap. `cli.mjs new --light` records it in the project state (later, only the `set-run` op changes it, by a person or a fixture owner), and the master's **Generation:** line records it (step 5), so a resume keeps it.

---

## Core principles

1. **Templates are authoritative.** `TEMPLATE-COMBINED.md` and the files under `chunks/` set the chunk order, names, and structure. Headings are never silently renamed.
2. **Numbers and shape, never products.** The Pre-SDD settles the shape (for example "relational, strongly consistent, multi-AZ"); the SDD picks the products, versions, architecture style, and detailed design (for example "PostgreSQL 17"). The Pre-SDD never names a product, a version, or the architecture style (monolith, hybrid, microservices), and names a provider only when the business makes it a hard constraint. Options are shape-level only. What each side owns: `handoff-guide.md`.
3. **Locked for the SDD.** Once G3 is signed, the Pre-SDD's numbers and decisions are locked for the SDD. The SDD loads a G3-signed Pre-SDD, waits on one that is not signed, and asks for one that is missing. When the SDD finds a locked item wrong or in conflict, it raises an open item owned by the E2E Architect, plus a handoff request; it never changes the item. The handoff guide (chunk 12) states this rule, and the answer goes back through § Later requests.
4. **One calculator.** The formulas, rules, and checks live in one engine, `studio/src/engine.js`. The Studio bundles it, and this skill runs it with Node.js through `studio/cli.mjs`. Every number in a chunk comes from the engine's output; none is worked out by hand or in prose. The Studio is one offline HTML file: it makes no network call and needs no server.
5. **An independent employee.** This skill works with the other hops only through files: their output documents, the status board `unifier-status.md`, and the handoff requests posted on it. It writes only its own folder `./pre-sdd-[slug]/` (and, in COMBINED mode, its combined file), its own row on the board, the requests it raises, and the State and Closed cells of the requests addressed to it. It never edits a BRD, an SDD, or an LLD, and never reads another skill's rule files.
6. **All 70 items, in stages, pre-filled.** The register covers all 70 checklist items of the Standard (BUS-01 to ECO-06), plus the header rows, the sizing factors, and the migration overlay. No one faces 70 empty items: what the BRDs, earlier answers, the engine, or the defaults can give arrives pre-filled with its source, and the input comes in four stages, one group at a time, never all at once. Any stage can stop and resume.
7. **Never guessed.** A pre-filled value always cites its source. A business number the sources do not give stays `Open`, and the engine shows TBD, never zero. A gap in the prose is flagged as `**[NEEDS CLARIFICATION: <specific question>]**`, never papered over with a plausible invention.
8. **Several entries per item.** An item the Standard answers per journey, transaction type, failure scope, dataset, workload, or external system holds several entries. One primary entry (`.1`) is required, and the others are optional. Each entry carries the Standard's record fields, and the engine picks a DR strategy per failure scope. Rules: `register-and-entries.md`.
9. **Proposed targets, never proposed facts.** The E2E Architect may propose a business target the BRDs do not give (availability, RTO, RPO, latency), with its reason, tied to the BRD where it can be. The entry stays `Open` until a person or an answer policy picks the proposal. Forecasts, measurements, and other facts only a person gives are never proposed.
10. **A person confirms.** Only a person confirms a value: by a tick in the Studio or an explicit answer in chat, recorded with who and when. An answer policy the user sets may take a recommended option for a choice, never a fact (§ Answer policy). The skill never writes `Confirmed` for a value, never signs G3, and never approves its own work. It records an answer under a person's name only when that person gave it.
11. **G3 per role.** Each applicable role of the Standard's sign-off register signs. One person may hold several roles, and by default the owner holds them all. `Approved with conditions` lets the SDD start when every condition has an owner and a due date and the handoff guide carries it. Only a named person, never a stand-in, grants an exception that lets an `Open` hard item pass.
12. **Engineering defaults appendix.** `reference/policy-appendix.md` holds the engineering factors (utilization target, network overhead, index factor, copies, mean latency, calls per transaction, request factor) and two project-rule defaults. The owner approved it once. Every project pre-fills its values as `Estimated`, and a person confirms them per group. A change to it needs the owner's approval and a new appendix version.
13. **Changes move with approval.** A change moves between the Pre-SDD and the SDD, in either direction, only with approval. A content change after G3 sends G3 back to review and needs new signatures.
14. **One fact, one home; decision history in the register.** The Pre-SDD cites BRD content by key, ID, and link, and adds only its delta. Content chunks state the settled values and shape in plain present tense. The decision story (the answers, the proposals taken, who decided and when, the delegations, the sign-offs) goes in `decision-log.md`.

---

## Workflow

Every question below waits for the user, unless the user set an answer policy for the run (§ Answer policy, at the end of this section), which says which questions it answers and how its answers are recorded.

The skill changes the project state only through the engine: `node "<skill>/studio/cli.mjs" derive "<state>" --apply "<patch>"`, where the patch file holds an actor and a list of ops (`engine-and-studio.md`), and `<state>` is `./pre-sdd-[slug]/studio/project-state.json`. On the web path the Studio changes it, through the same engine, and the skill keeps the state the person saved once the engine has validated it (step 7). The skill's own writes (pre-fill, proposals, option scores) use an agent actor, which the engine never lets confirm, accept, sign, grant, or approve. A person's answers use a person actor with that person's name.

### 1. Resolve arguments and resume

Per § Argument parsing. Then run the resume check.

**Resume check.** A run on an existing Pre-SDD resumes, never restarts. Look in the project root for this system's Pre-SDD: a `./pre-sdd-[slug]/` folder whose master `[slug]-pre-sdd-master.md` names this system and its BRDs (in COMBINED mode, the combined file `PRE-SDD-[ProjectName]-vX.Y.md` beside the folder). When one exists, read its progress table (stage, group, gate, write-up, review, handoff; in COMBINED mode, in the combined file's cover), which step 5 wrote and every batch, save, and stop since has updated, and its project state. Do not rerun the intake, and never call `cli.mjs new` again on an existing folder. Say where it stands, then act on what the user asked:

- When the request says to go on ("continue", "next group", "stage 3"), go on from the stage and group the master names.
- When the request is empty, ask "Continue with <stage, group>?" (for example "Continue with stage 2, group DAT?") and wait.
- When the request is something else, do that (§ Later requests), and name the stage and group still waiting.

`light` stays as the master's **Generation:** line records it. A quick Pre-SDD continues into the full Pre-SDD, from stage 2, when the user asks for it: the skill records `set-run` with `mode: full` under that person's name (only a person or a fixture owner changes the mode or `light`; the engine refuses a stage above 1 in quick mode), and the **Generation:** line then reads `full`.

### 2. Read the status board

Read `unifier-status.md` in the project root at the start of every run (§ Status board): the E2E Architect row, every handoff request to the E2E Architect that is `Open`, `Later`, or `Accepted`, and the upstream rows (the Product manager's BRD state).

- A request on the board counts as a request in chat. A hand-off from the Product manager (for example `Hand-off: BRD <KEY> v<version> is ready`) starts or updates a Pre-SDD (step 3). A request from the Software Architect goes to § Later requests (an SDD open item on a locked item), to step 3 (`Create the Pre-SDD for BRDs <KEY list>`), or to the stop the Pre-SDD waits at (`Pre-SDD <slug> v<X.Y> blocks the SDD: <blockers>`, which names what G3 still needs; for a quick Pre-SDD, the offer to continue into the full Pre-SDD, step 1).
- Take a request by setting its State to `Accepted`. Set it to `Done` when its work is done, or `Declined` when the owner declines it (§ Status board says who writes which cells).
- Keep the E2E Architect row current at every stop: after every answered batch or save (for example `In progress: stage 2, group DAT`), at the G1 and G2 review stops, at the G3 sign-off stop, while waiting, and at the hand-off (step 14).

### 3. Resolve intent

Four intents:

- **GENERATE:** a new Pre-SDD from one or more finished BRDs for one system.
- **RESUME:** an existing Pre-SDD folder with a stage not done (step 1).
- **UPDATE:** a new BRD version, an SDD open item on a locked item, or a change the owner asks for (§ Later requests).
- **IMPORT:** a Studio v2.2 project file or handoff ZIP. Its values come in as `Estimated`, never `Confirmed`, the file's decision history is not imported (the skill tells the user so; `engine-and-studio.md`), when the v2.2 file gives a BRD reference, the import raises an unknown about it for a person to close, and a normal run follows (§ Later requests).

### 4. Start conditions and intake

**Start conditions.** Check them against the BRD files, never from memory:

- **Every source BRD is finished:** no part is `Pending` or `In progress` in its master's Generation Progress. A BRD still being written is not a source yet: say which part is open, and stop. A combined BRD, or a whole run, has no parts table and counts as finished.
- **A BRD that is not `Approved`** (its cover Status): ask once whether to go on, and record the answer in `decision-log.md`. Chunk 00's Document Lineage shows each BRD's status, and the handoff summary names every BRD that is not `Approved`.
- **No BRD:** refuse, and point to `brd-unifier`: a Pre-SDD needs a finished BRD.
- **One Pre-SDD per system.** Its parent BRDs are the ones the SDD will have: several BRDs for one system give one Pre-SDD with several parents. When a Pre-SDD for this system already exists, this is a resume or an update (step 1), never a second Pre-SDD. Give each BRD a short capital key (`REFUNDS`, `WALLET`), proposed in one line; every BRD reference carries its key (`REFUNDS/NFR-03`).

**Intake (short, not a clarification storm).** Ask at most three questions before starting, only those that block:

- **System name:** when neither the request nor the BRDs state it.
- **Source BRDs:** which BRDs belong to this system, when the request does not make it clear.
- **Mode confirmation:** only when step 1 left it ambiguous.

Ask one more: **the confirmer's name**, the person whose answers and confirmations this run records ("Who answers and confirms values in this run? Your name goes on every value you confirm."). Another person who answers later gives their own name. If an answer is already in the conversation, do not ask again.

### 5. Engine setup: `cli.mjs new`

Check Node.js (§ Running outside Claude Code). Then create the project state:

```
node "<skill>/studio/cli.mjs" new "./pre-sdd-[slug]" --name "<System name>" --slug [slug] --brd "<KEY>=<BRD master path>@<version>:<status>" --mode full --input prompt
```

- Pass `--slug` every time, so the folder, the state, the Studio's save file name, and `validate --pick` all use the same slug (§ Output conventions).
- Give one `--brd` per source BRD. The path is the BRD's master file (or its combined file), relative to the Pre-SDD folder, for example `../brd-refunds-portal/refunds-portal-brd-master.md`. The version follows the last `@`, so the path may hold spaces, a `:`, or an `@`.
- Use `--mode quick` for a quick Pre-SDD, `--input web` for the web path, and `--light` for a light run.
- For IMPORT, add `--import "<v2.2 project file or ZIP>"`.

`new` writes `./pre-sdd-[slug]/studio/project-state.json` with every register row `Open` and one primary entry each, then applies the engineering defaults and the derivations, and prints JSON with the state's path, the counts by status, and the gate. It refuses when that file already exists: the folder is a resume (step 1), and `new` is never called on it again. Exit code 0 is success, 2 is an invalid input (the message says what to fix), and 3 is a usage error. Run `node "<skill>/studio/cli.mjs" --version` once: it prints the engine and skill versions, and chunk 00 records the engine version. Every command, flag, and exit code: `engine-and-studio.md`.

**The master, from setup on.** Right after `new`, write `[slug]-pre-sdd-master.md` in `./pre-sdd-[slug]/` from `chunks/pre-sdd-master.md`: the index, the **Generation:** line (the mode, and `light` when set), the gate line, and the progress table (stage, group, gate, write-up, review, handoff), with stage 1 as the next stage. In COMBINED mode, write the combined file's cover with the same table instead. Update the table after every answered batch, every save, and every stop, so a run stopped mid-stage or at the G1 or G2 review stop resumes from it (step 1).

### 6. Pre-fill and proposals

Read every source BRD fully (a chunked folder or a combined file), then pre-fill the register in this order of trust (`prefill-and-derivation.md`):

1. **The BRDs.** Each value cites its source (`BRD: REFUNDS/NFR-03`, or the chunk, `BRD: REFUNDS 10`) and is `Estimated`. The BRD chunks that feed the register are the Technical Inputs for the SDD (12), the NFRs (10), the integrations (08), the constraints, assumptions, and dependencies (02), the scope and personas (04), the use case summary (05), and reporting (09). A repeating row gets one entry per journey, transaction type, scope, dataset, workload, or external system the BRDs name.
2. **Earlier answers** in this Pre-SDD.
3. **Engine derivations:** formula results from other items (for example RPS from TPS and calls per transaction), `Estimated`, with source `Derived: CALC-NN from <items>`. The engine recomputes them after every answer.
4. **The engineering defaults appendix and the project defaults**, `Estimated`, with source `Default: <appendix or rule>`. The engine applies them.

A business number the sources do not give stays `Open`: never fill it from a guess, a worked example, or a typical value. A vague word ("fast", "always available") is not a number, so its entry stays `Open`.

**Proposals.** Only four rows take a proposal: REL-01 (availability), REL-03 (RTO), REL-04 (RPO), and CAP-07 (P99 latency). For an `Open` entry on one of them, propose a value with its reason, tied to the BRD where it can be (for example a monthly disruption limit). The proposal sits beside the entry, which stays `Open` until a person or an answer policy picks it. The facts only a person gives are never proposed: CAP-01, CAP-03, CAP-04, CAP-05, CAP-06, CAP-10, CAP-12, DAT-02, INT-03, BUS-04, ECO-01, HDR-01 to HDR-06, and every option cost (`register-and-entries.md`). Record each proposal and its outcome in `decision-log.md` § Proposal record.

Write the added repeating entries first, in a patch of their own, then the pre-fill and the proposals in a patch that uses the entry IDs `derive` printed, each with an agent actor through `derive --apply`. The engine keeps every value it writes `Estimated` or `Open`.

### 7. Stage 1: discovery

Stage 1 is the Quick Discovery Guide's first conversation: the classification (change type HDR-07 and intended target HDR-08), the fault scope, and the minimum numbers (TPS or RPS, concurrency, P95 and P99, availability, RTO, RPO, data volume, cost and timeline). Its rows are HDR-07, HDR-08, BUS-05, CAP-01, CAP-03, CAP-04, CAP-07, REL-01, REL-03, REL-04, REL-05, DAT-02, and ECO-01, each pre-filled where a BRD gives it. Classification rules: `classification-and-paths.md`.

Collect the answers on the input path (`stages-and-input.md`):

- **Web.** Embed the state into the Studio, `node "<skill>/studio/cli.mjs" embed "<state>" --out "./pre-sdd-[slug]/studio/pre-sdd-studio.html"`, print the path, and offer to open it (§ Running outside Claude Code). The Studio opens filled from the embedded state, with no import step. The person answers, ticks to confirm, and saves; the browser saves `pre-sdd-[slug]-state-<UTC stamp>.json`, normally to Downloads. When the person says they have saved, find the newest such file saved after the embed, `node "<skill>/studio/cli.mjs" validate --pick "<folder>" --slug [slug] --since "<embed time, ISO 8601 UTC>"`, confirm its path with the user, and unwrap it into the Studio folder: `node "<skill>/studio/cli.mjs" unwrap "<save file>" "./pre-sdd-[slug]/studio"`, which writes its project state as `project-state.json` and its blueprint as `studio-blueprint.json`. Never split the save file by hand. Then recompute (`compute`, step 11) and compare the result with the blueprint the Studio saved: `node "<skill>/studio/cli.mjs" diff "./pre-sdd-[slug]/studio/studio-blueprint.json" "./pre-sdd-[slug]/studio/blueprint.json"`. The expected difference is none; report any difference to the user.
- **Prompt.** The same rows in the same order, in batches of up to four: AskUserQuestion in Claude Code (load it with ToolSearch when it is deferred), numbered questions elsewhere. A pre-filled value is asked as "keep or change". After every answered batch, write its answers into the project state through `derive --apply`, with the confirmer as the person actor.

Stage 1 ends with a short discovery summary (the classification; the business sponsor HDR-02 and the lead architect HDR-04 when a BRD gives them, otherwise listed as open with an owner; the stage 1 values by status; and the unknowns) and the unknowns register: every stage 1 entry still `Open` has an owner name and a due date from a person, and each open question is an unknown `QD-NN` with its impact, owner, and due date. After every batch and every save, update the master's progress table and the board row, and write the same stage pointer into the project state with the `set-run` op (`stage` and `group`; any actor may write the pointer, so the skill writes it with its agent actor): they name the next stage and group. Full mode goes straight on to stage 2.

**Quick mode ends here.**

- Run the write-up (step 11) for chunks 00, 01, 02, 03a to 03h, and 10 only, and update the master, with `quick` on its **Generation:** line. The stage 1 rows carry their answers. Every other value that has a source stands as `Estimated`, with that source: the BRD values pre-filled in step 6, the project defaults (OPS-04, CAP-08), the appendix factors, and the derived rows such as CAP-02. A row with no source stays `Open`. There is no review pass and no chunk 13.
- A quick Pre-SDD claims no gate: the engine's gate label reads `Discovery`, and it authorizes no SDD.
- Set the E2E Architect row to `Done v1.0` (§ Status board). Raise no request to the Software Architect.
- The handoff summary gives the chunk paths, the stage 1 values by status (from the engine), the unknowns with owner and due date, the questions only a BRD owner can answer (each raised as a request to `brd-unifier`), and the offer to run the full Pre-SDD.

### 8. Stage 2: the register, and the G1 review stop

Stage 2 takes the remaining rows. It opens with the header rows still `Open` (the project's identity: solution name, business sponsor, product owner, lead architect, architecture review authority, business budget owner, source platforms, migration direction), because G0, the Standard's Initiate gate, needs the sponsor and the lead architect. With the classification, it settles the migration overlay switch: `set-overlay` (whether it applies, and the source platform), by the person, or by the skill with its citation in `cite` (never an answer policy); and the overlay's workloads (`add-workload`, `rename-workload`, `remove-workload`; any actor may add, rename, or remove one, and the engine refuses to remove a workload whose entries hold answers, `WL-01`, or the last workload). On the web path the Studio has no overlay tab and no control for the unknowns: take them in chat and apply them with `cli.mjs derive --apply` (`stages-and-input.md` § The web path). Then it takes the 70 items one group at a time, in the Standard's decision-hierarchy order: BUS, SEC, DAT, INT, CAP, REL, OPS, ECO. Inside a group, the rows that need an answer come first: `Open` without a proposal, `Open` with a proposal, `Estimated`, then `Confirmed` and `N/A`, each by ID.

- Each group ends with one question, "Confirm all pre-filled values in this group?"; the Studio has the same group confirm.
- Derived values recompute after each answer.
- The skill never marks an entry `N/A`: the person does, with the reason.
- Ask for the owner names and due dates of the `Open` entries in batches, never one entry at a time (`stages-and-input.md`). While the overlay applies, this includes every OVL entry of every workload, because G1 counts them; stage 3 takes their values.

Stage 2 ends when every one of the 70 items has a status and every `Open` entry has an owner name and a due date. That meets the Standard's G1 ("universal checklist reviewed, unknowns visible"). Read G1 from the engine's gate result (`derive` prints it; `compute` writes it to `model.json`), never from memory.

**G1 review stop.** Show a short summary: the counts by status (from the engine), the `Open` entries with owner and due date, the hard `Open` entries, the unknowns, and what stage 3 will assess. Say what to review, update the board row, and **stop until the user says "continue"** (an answer policy passes this stop only when it names it: § Answer policy). Never start stage 3 in the same turn.

### 9. Stage 3: assess, and the G2 review stop

Stage 3 assesses what the register implies: the calculations, the target shape, the options, and the migration when the overlay applies.

- **Calculations and shape.** Run `compute` (step 11). It gives every calculation `CALC-NN` with its formula, inputs, and result (TBD where an input is `Open`), the DR strategy for each failure-scope entry of REL-05, the replication each RPO needs, the target shape (hosting, topology, DR, data, network), and the shape's conflicts. A failure scope whose strategy the shape cannot satisfy is a conflict; it is never smoothed over in prose.
- **Path.** Greenfield or brownfield, crossed with cloud or on-prem; hybrid as two sub-assessments plus a boundary analysis; the migration overlay on top of any path (`classification-and-paths.md`). A brownfield or mixed Pre-SDD gets chunk 06, the existing estate. When the overlay applies (switched on in stage 2 with `set-overlay`), stage 3 takes the values of its rows `OVL-01` to `OVL-12` per workload, one primary R per workload (7R), the cutover rules, and chunk 08 (`migration-overlay.md`).
- **Options** (`options-and-economics.md`). Each option is a shape, never a product: for example "one region, multi-AZ" against "two regions, warm standby". The skill names the options and proposes each criterion score (1, the worst, to 5, the best) with a one-line reason, as `Estimated`; a person confirms the scores, never an answer policy (the engine refuses it). A person excludes an option that breaks a hard entry the engine cannot check against a shape (`exclude-option`, with the entry and the reason; `include-option` lifts it), and drops an option nobody chose with `remove-option`. A person gives each option's one-time and monthly costs, the TCO horizon in months (ECO-03), and the criterion weights, recorded with who approved them. The engine computes each option's TCO (`CALC-21`) and weighted score (`CALC-22`), never ranks an option that breaks a hard entry or a conflict, and, with no approved weights, keeps the comparison unweighted and flagged `UNWEIGHTED`, because the Standard forbids invented weights. A missing cost gives TBD and an unknown.

Stage 3 ends at the Standard's G2: a feasible option shortlist, or a blocker.

**G2 review stop.** Show the engine's G2 result (`shortlist`, `blocker`, or `incomplete`, with what is missing), the DR strategy per scope, the target shape and its conflicts, and the options with their TCO. Say what to review, update the board row, and **stop until the user says "continue"** (an answer policy passes this stop only when it names it).

### 10. Stage 4: confirm and decide

1. **Confirm.** Show every `Estimated` value still standing, grouped by register group (the header rows, BUS to ECO, the overlay rows), with one confirm per group. A value the person changes is a new answer under their name.
2. **Decide.** The person takes the decisions: a topology override, a DR strategy override per failure scope, and the chosen option. The default is no override, and every override needs a written reason. Each decision is written with the `decide` op (`topology`, `dr` per scope, `option`, and `reason`, which the op takes only with an override, as that override's reason): on the prompt path the skill writes it under the name of the person who decided, and on the web path the Studio does. The chosen option's reason and the condition that would reverse the choice never go into the `decide` op, since the engine refuses a `reason` with no override: record them in `decision-log.md` and in ADR-DR-001 in chunk 09 (its option comparison, decision and rationale, and conditions and review trigger). Only a person or a fixture owner decides: the engine refuses the agent and an answer policy, the chosen option included, because the engine computes no recommended option for a policy to take. The engine accepts only a chosen option that passes every hard check, and `option: null` clears the choice.
3. **Validate.** Run `compute` and show the engine's validation: blockers, conflicts, and advisories. A hard entry that is `Open` blocks the gate unless a named person grants a time-bound exception: its reason, its expiry date, and its review date, under that person's name (`gates-and-signoff.md`). Only a person grants one; never a stand-in, an answer policy, a fixture owner, or the skill.

Stage 4 ends with the write-up (step 11), the review (step 12), and the G3 sign-off stop (step 13).

### 11. Write-up

1. **Compute.** Run `node "<skill>/studio/cli.mjs" compute "<state>" --out "./pre-sdd-[slug]/studio"`. It writes `model.json`, `blueprint.json`, `blueprint.yaml`, the fragments `fragments/*.md`, the diagrams `diagrams/*.mmd`, and `diagrams/architecture.drawio`, removes the fragments and diagrams an earlier run left that no longer apply, and prints the files it wrote and the gate label.
2. **Fragments.** Each fragment is Markdown the engine renders: the header, the classification, the register tables (one per group, `03a-register-business.md` to `03h-register-economics.md`), the calculations, the target shape, the options, the overlay, the rule trace, the validation, the gate, and the locked items. Paste each one unchanged between its `<!-- ENGINE-FRAGMENT: <name> -->` and `<!-- /ENGINE-FRAGMENT -->` markers, where the chunk templates place them. Never edit a fragment: a wrong value is fixed in the project state, then recomputed.
3. **Diagrams.** Paste every diagram `compute` writes inline in chunk 05, and no other: the infrastructure, network, and DR diagrams always, and the data, security, integration, and deployment diagrams only when `compute` writes them, each by its own condition or all four when the Studio's show-optional setting is on (a light run keeps the first three), each followed by a 1-2 sentence summary so the chunk reads without a renderer. Provider names in a diagram are illustration only.
4. **Prose.** Write the text around the fragments from the templates: what the numbers mean for the shape, the path evidence, the requirement-to-consequence trace, the decision tree (`DT-NN`), the Pre-SDD ADRs (ADR-DR-001, ADR-DATA-001, the hosting part of ADR-PLATFORM-001, and ADR-MIG-001 when the migration overlay applies), and the risks. ADR-PERF-001, ADR-INT-001, and ADR-IAM-001 are SDD ADRs: chunk 09 names them with the answers that drive them. Prose cites a value by its ID (`REL-03.2`, `CALC-03`) and never states a number the fragments do not hold. It uses shape words only: never a product, a version, or the architecture style.
5. **Chunk 00 and the master.** Chunk 00 holds the title, the Document Lineage (each source BRD with its key, version, status, and link; the consuming SDD, filled the first time a run finds an SDD whose own chunk 00 holds a Source Pre-SDD row naming this Pre-SDD: a link, which bumps nothing), the gate state (the engine's label), the engine version, the Changes Log, and the indexes. Update the master that step 5 wrote: the index, the progress table (stage, group, gate, write-up, review, handoff), the **Generation:** line (the mode, and `light` when set), and the gate line.
6. **The handoff guide.** Chunk 12 follows `handoff-guide.md`. It states the Pre-SDD version, the gate state, the signers, and the engine version; every locked item with what it measures, its value, its status, its owner, and where it lands in the SDD, and the calculations §18 cites (the locked-items fragment); what is left to the SDD; the open-item rule; the time-bound exceptions and unknowns that did not block G3, each with owner and due date; and the citation format `PSDD/<ID>`. It is self-contained, because `sdd-unifier` reads only this skill's output (chunk 12, the master, chunk 11), never these rule files.
7. **Which chunks exist** (`chunking.md`): 00 to 13 in full mode, with 03a to 03h; 06 only for a brownfield or mixed change type, and 08 only with the migration overlay. An omitted chunk is omitted, not stubbed.

In COMBINED mode, `TEMPLATE-COMBINED.md` gives the structure, and the same fragments and markers apply.

### 12. Review and open items

After the write-up and before the G3 stop, run the review that writes chunk 13 (`review-and-open-items.md`).

1. **Cleared-context reviewer.** On the first full build, use the `Agent` tool with `subagent_type: general-purpose`: the reviewer starts with no memory of the authoring. Pass it the brief in `review-and-open-items.md` and the absolute paths of:
   - the chunks (or the combined file) and the master;
   - the project state and `model.json`;
   - the source BRDs and this skill's templates;
   - the project instruction file (`CLAUDE.md`), with the instruction to honour only its rules.

   The reviewer checks, among others: every value has a source; no business number was guessed; the numbers in the chunks equal the fragments; the text holds shape, never a product; the hard `Open` items; the conflicts; the lock list is complete; the IDs; and no dash character is left. It writes chunk 13: one `OI-NN` per finding, each with options, a **Recommended Answer** that ops the decider may run can apply (`review-and-open-items.md` § The item format), and a **Why**. In a light run, the brief says so.
2. **Accept loop.** Present the `Open` items compactly (ID, title, one-line concern, the Recommended Answer and its Why), then ask per item, batched up to four per AskUserQuestion call: **Accept recommendation** (listed first), **Choose option [B/C]**, **Defer**, or the user's own answer. Apply each accepted answer as settled text in present tense. A value it changes goes into the project state through `derive --apply`, by ops the decider may run, under the decider's name (or the policy's label: § Answer policy), followed by a new `compute`: never into a fragment by hand. A Recommended Answer names the actor the engine allows for its op; when the op sets, confirms, or answers a fact only a person gives (a `factOnly` row, for example INT-03, CAP-01, or HDR-01), neither an answer policy nor the skill's agent actor applies it: the item takes `Decided - waiting for a person` and names the person. Under an answer policy, an accepted answer that only a person may apply (it changes a protected value, one that is `Confirmed` or that a person or a fixture owner answered: `register-and-entries.md` § Who confirms; it needs an op only a person runs, such as `close-unknown`; or it needs a fact only a person gives, such as an owner name or a due date) is not applied: the item becomes `Decided - waiting for a person`, and the person applies it, or the item stays decided and pending. An item stays `Open` only when no decision was taken. Record each decision in `decision-log.md` § Clarification register.
3. **Review limit.** At most three review passes in one request: the baseline review and up to two scoped application passes (a light run allows one). What the last pass finds waits for the next request.
4. **Later updates.** An update that changes content gets a delta review of the changed chunks, by a fresh dispatch of the same reviewer.

### 13. G3 sign-off stop

G3 is signed in chat only, at this stop, after the write-up and the review; the Studio shows the sign-off register read-only. Rules: `gates-and-signoff.md`.

1. **Show the gate.** Run `compute` and show the engine's gate result: G0, G1, and G2, the G3 status (`Not signed`, `Blocked`, `Review`, `Approved`, or `Approved with conditions`), the roles still to sign, and every problem it names. A blocker, a `Rejected` sign-off, a condition without an owner or a due date, or an `Approved with conditions` sign-off while no condition is recorded gives `Blocked`; a change after a signature gives `Review`.
2. **Checklist.** The person ticks each line of the G3 checklist, `G3-01` to `G3-14` (the Standard's § 11.1): `Done`, or `N/A` with a reason. `G3-11` formally accepts the hard-constraint conflicts and high risks still open, so only an empowered owner ticks it.
3. **Conditions.** For `Approved with conditions`, each condition is recorded with its owner and due date (`COND-NN`) before the signatures; a sign-off that reads `Approved with conditions` while no condition is recorded leaves G3 `Blocked`. A condition is changed with `set-condition` or removed with `remove-condition`, under the name of the person who asked. The handoff guide carries every one.
4. **Signatures.** Each applicable role of the Standard's sign-off register (§ 11.2) signs; the migration owner applies only with the migration overlay. A person marks a role that does not apply as not applicable, with the reason. One person may hold several roles, and by default the owner holds them all. Each signer gives a decision per role (`Approved`, `Approved with conditions`, or `Rejected`), recorded under the signer's name; the engine stores with it the content hash of the state the signer reviewed. Record each signature in `decision-log.md` § Sign-off record.
5. **Order.** Ticks first, then conditions, then signatures: the checklist and the conditions are part of the signed content, so a change to either after a signature sends G3 back to `Review`.
6. **After signing.** Run `compute`, then rewrite chunk 11 (the sign-off register, the conditions, the exceptions, and "SDD initiation authorized by"), chunk 12 (the gate state and the signers), chunk 00 (the gate state), and the master's gate line from the new fragments. Writing a signature into a chunk is not a content change: it reopens nothing and bumps nothing.

The skill never signs, never ticks a checklist line, never records a decision for a role that nobody gave, and never grants an exception. When the signers are not ready, the stop waits: the board row says so, and the hand-off (step 14) says what G3 still needs.

### 14. Hand-off

**When G3 is signed** (the engine reads `Approved` or `Approved with conditions`, and the Pre-SDD is authorized for the SDD):

- Set the E2E Architect row to `Done v<X.Y>` (§ Status board).
- Raise a handoff request (or reuse its own pending one: § Status board) to the Software Architect (`sdd-unifier`): Request `Hand-off: Pre-SDD [slug] v<X.Y> is G3-signed`, with the absolute path of the master (in COMBINED mode, of the combined file) as its Link. After an update of a Pre-SDD whose chunk 00 § Consuming SDD names an SDD, the update's "Pre-SDD has a new version" request takes its place (§ Later requests).
- Set each request from the Software Architect to create or sign this Pre-SDD (`Create the Pre-SDD for BRDs ...` or `Pre-SDD ... blocks the SDD: ...`) that is still `Open`, `Later`, or `Accepted` to `Done`, with Closed (UTC).
- With `Run mode: solo` on the board, offer "Next hop: SDD (Software Architect). Start now, or later?". On "now", start `sdd-unifier` in the same session when the runtime can; "later" sets the request to `Later`. With `Run mode: team`, raise the request and stop: never start another skill.

**When G3 is not signed**, raise no request to the Software Architect. The board row names the stop the Pre-SDD waits at, and the summary says what G3 still needs.

**The handoff summary:**

- The gate: the engine's label and the G3 status; while G3 is not signed, each problem the engine names.
- The signers: each role with its signer and decision, or not applicable with the reason.
- The engine version (`cli.mjs --version`).
- The Pre-SDD version, the mode (chunks or combined), and the file paths, with the `decision-log.md` path.
- The open conditions (`COND-NN`, owner, due) and the exceptions (`EXC-NN`, who granted it, expiry, review date).
- The unknowns (`QD-NN`), each with owner and due date.
- The open items by status: open, accepted and applied, adjusted, deferred, rejected, decided but pending application, and decided and waiting for a person.
- The questions only a BRD owner can answer, each raised as a request to `brd-unifier` (the Product manager).
- When an answer policy was set, the policy choices without a source: each recommended option it took that adds behaviour no source states, by ID with the behaviour it adds, for the owner's review; `None` when it took none.

### Answer policy

An answer policy is a standing instruction the user sets for a run, in the request or in a run brief, for example "answer policy: accept the recommended option". It may also name the stops it may pass and an Approver stand-in. It may cover less than the rules below allow: a question its wording leaves out waits for the user, and its item stays as it is. With no answer policy, every rule in this skill stays as written. Record the policy once in the project state, under the name of the person who set it (the `set-policy` op, with the stand-ins it names), and once in `decision-log.md` § Walkthrough and delegation history, the first time it answers.

The skill still asks the real question, with its options or default and the Why; the policy answers only that question. Writing a recommendation never supplies a fact, a reserved decision, or an owner's attestation.

1. **It takes the recommended option or the stated default, and nothing else:** the input path at the start of the run (default `web`), the output mode (default `chunks`), "keep" for a pre-filled value, "confirm all pre-filled values in this group", a proposal on a proposal row, each open item's **Accept recommendation** (one that only a person may apply becomes `Decided - waiting for a person`: step 12), and any other question in this skill that carries a recommended option or a stated default. A choice it takes is `Confirmed`, with the confirmer recorded as `Policy: <policy> (set by <name>, <date>)`, in the project state and in `decision-log.md`.
2. **It never chooses anything else.** Defer, another option, a rejection, or a free-text answer stays with the user, and the item stays as it is. One exception: it takes a Recommended Answer that reads `No change: <evidence>`, which changes no document. The item becomes `Rejected` with the policy as decider, and the handoff lists it. The engine also refuses a policy each of these, so each waits for a person: marking an entry `N/A`, closing an unknown, setting or confirming an option score, excluding or removing an option, a stage 4 decision (an override or the chosen option), a later `set-run` change of the run's mode, input path, or `light`, the overlay switch, a BRD, a condition, and the Pre-SDD version.
3. **It never supplies a fact only a person gives:** the rows CAP-01, CAP-03, CAP-04, CAP-05, CAP-06, CAP-10, CAP-12, DAT-02, INT-03, BUS-04, ECO-01, and HDR-01 to HDR-06; every option cost; the TCO horizon; the criterion weights; an owner name or a due date; an intake fact (the system name, the source BRDs, the confirmer's name); or any other forecast or measurement. The engine refuses a policy's write on those rows, costs, the horizon, the weights, and every owner name and due date; such a value stays as it is, and it is asked of a person. A business target that a proposal or a Recommended Answer sets with its Why is a choice, not a fact, so the policy may take it. The test: when the documents' evidence can build the options, each with its tradeoff, the question is a choice; a value that no offered option sets, or one that a source not attached to the run would settle, is a fact. A recommended option that adds behaviour no source states is still a choice the policy may take, and the handoff lists it under the policy choices without a source: an accepted proposal is one whenever no source states its value. Nor does the policy take an option that makes a decision the user's standing instructions for the project reserve for the user, or that sets a business rule a source document rules out: that item stays as it is.
4. **It never attests.** It never ticks a G3 checklist line, never grants or revokes an exception, and never signs in a person's place. The engine refuses each.
5. **Stops.** It passes the G1 and G2 review stops, and the "Continue with <stage, group>?" question of a resume, only when it names them. It never passes the G3 sign-off stop: only signers sign.
6. **The Approver stand-in signs roles only when the conditions hold.** A policy that names an `Approver` stand-in lets the stand-in sign the applicable roles at the G3 stop, recorded as `Stand-in: Approver (<policy>, set by <name>, <date>)`, never with a person's name, and only when the engine's G3 result names no problem other than the roles still to sign. The engine counts a stand-in's signature only then, and only under the policy in force: a stand-in that signed under an earlier policy no longer counts. A stand-in never replaces a person's signature, never marks a role not applicable, and never grants an exception (the engine refuses each), and it never approves its own work.

**Not the test-run policy.** The test-run policy is a separate, test-only setting for fixtures. Under it, fixture answers stand in for facts only a person gives, each labelled with its named fixture owner (`Fixture: <owner> (test-run policy)`), and the fixture owner may confirm values, tick the G3 checklist, and mark a role not applicable with the reason. A fixture owner never signs a decision (the engine refuses) and never grants or revokes an exception, so a fixture run reaches G3 only through an answer policy's Approver stand-in. An answer policy is for real runs and never supplies such a fact. Setting one never sets the other.

---

## Later requests

Every content-changing update follows the same tail: the changed values through `derive --apply` and `compute`, the changed chunks rewritten from the new fragments, a delta review (step 12) and the accept loop, one version bump with one Changes Log row that ends with `Chunks:`, and, after G3, the G3 stop again (step 13). A content change after G3 sends G3 back to review: a change in the project state does so by itself (its content hash no longer matches the signed one), and a chunk content change outside the state is marked with the `reopen` op and its reason. Until it is signed again, the SDD treats the new version as not signed, and an SDD that loaded an earlier signed version keeps that version locked.

| User says (or a handoff request on the board) | Action |
|---|---|
| "BRD `KEY` has a new version", or a board request "Hand-off: BRD `KEY` v<version> is ready" for a BRD this Pre-SDD already lists | One offer names the affected items and chunks (from the BRD's Changes Log rows since the version chunk 00 records). On approval, one update runs: record the new version and status with the `set-brd` op (a new BRD of this system too; `remove-brd` drops one, never the last), under the name of the person who approved the update, since the engine refuses an agent and an answer policy here; pre-fill the changed values with their new citations (step 6), update the lineage, and follow the tail. A value a person answered or confirmed is never overwritten: the offer names it for that person to decide. Then, once G3 is signed again (step 14), and when chunk 00 § Consuming SDD names an SDD, raise a handoff request (or reuse its own pending one: § Status board) to the Software Architect: "Pre-SDD has a new version", in place of step 14's `Hand-off:` request; otherwise step 14's `Hand-off:` request is the only one. |
| An SDD open item on a locked item (a handoff request from the Software Architect) | Read the SDD's open item. The E2E Architect decides with the owner: change the item, or keep it with the reason. On approval of a change, one update runs (the tail). Then raise a handoff request (or reuse its own pending one: § Status board) back to the Software Architect: "Pre-SDD has a new version", naming the open item, once G3 is signed again (step 14); for the decision to keep the item, raise it at once, naming the open item and the reason. The SDD closes its item on its next run. The SDD never edits the item, and this skill never edits the SDD. |
| "Pre-SDD <slug> v<X.Y> blocks the SDD: <blockers>" (a handoff request from the Software Architect) | Take it (State `Accepted`) and resume the stop the Pre-SDD waits at, which its blockers name: the G1 or G2 review stop, or the G3 stop (step 13); for a quick Pre-SDD, the offer to continue into the full Pre-SDD (step 1). It changes no content. When G3 is signed, step 14 raises the `Hand-off: Pre-SDD [slug] v<X.Y> is G3-signed` request and sets this request to `Done`, with Closed (UTC). |
| A change the owner asks for ("make the region RTO 15 minutes"), in chat or as a handoff request (a business review's hand-off included) | One update: the owner's answer under their name, then the tail. Then, once G3 is signed again (step 14), and when chunk 00 § Consuming SDD names an SDD, raise a handoff request (or reuse its own pending one: § Status board) to the Software Architect: "Pre-SDD has a new version", in place of step 14's `Hand-off:` request; otherwise step 14's `Hand-off:` request is the only one. |
| "import this Studio project" (a v2.2 project file or handoff ZIP) | IMPORT (step 3). The start conditions of step 4 still hold. `cli.mjs new ... --import "<file>"` brings every value in as `Estimated`, never `Confirmed`, with source `Import: Studio v2.2`, and tell the user that the file's decision history is not imported (the engine drops it); then a normal run follows from stage 1. A ZIP the engine cannot read, or a blueprint given in place of a project file, fails with a message that says what to load instead. |
| "re-sign", or any change after G3 | The G3 stop (step 13) for every applicable role: each signer signs the content they now review. |
| "open the Studio" | Embed the current project state (`cli.mjs embed`), print the path, and offer to open it (§ Running outside Claude Code). A save comes back as in step 7. |
| "merge", "single file" (chunks exist); "split into chunks", "re-chunk" (a combined file exists) | Convert per `chunking.md`: a merge writes `PRE-SDD-[ProjectName]-vX.Y-MERGED.md` in `./pre-sdd-[slug]/`, beside the chunks; a re-chunk splits a combined file into chunks. Keep the originals, never merge `decision-log.md`, and leave `studio/` as it is. A pure conversion changes no content and bumps nothing. |
| "sign off the Pre-SDD", "approve version X.Y" | The G3 stop only (step 13): change no content. Report in three lines: the Pre-SDD (name and path) and its version; signed, with each role's signer, or not signed; each unmet condition the engine names, or `None`. It bumps nothing. |

---

## Output conventions

- **Project slug:** kebab-case, lowercased, from the system name (`Refunds Platform` gives `refunds-platform`). `[slug]` is always this Pre-SDD's own slug.
- **Folder:** `./pre-sdd-[slug]/` in the project root holds the master `[slug]-pre-sdd-master.md` (the index and the progress table: stage, group, gate, write-up, review, handoff), the chunks, `decision-log.md`, and `studio/`.
- **Chunks:** `00-cover-and-changelog.md`, `01-business-brief.md`, `02-classification-and-path.md`, the register chunks `03a-register-business.md`, `03b-register-capacity.md`, `03c-register-reliability.md`, `03d-register-data.md`, `03e-register-security.md`, `03f-register-integration.md`, `03g-register-operations.md`, and `03h-register-economics.md`, then `04-targets-and-calculations.md`, `05-target-shape.md`, `06-existing-estate.md` (brownfield or mixed only), `07-options-and-economics.md`, `08-migration-overlay.md` (overlay only), `09-decisions.md`, `10-validation-risks-unknowns.md`, `11-gate-and-sign-off.md`, `12-sdd-handoff-guide.md`, and `13-open-items-and-clarifications.md`. Quick mode writes 00, 01, 02, 03a to 03h, and 10. The chunk map: `chunking.md`.
- **Studio files** in `./pre-sdd-[slug]/studio/`: `project-state.json` (the project state of record), `pre-sdd-studio.html` (the Studio with this project's state embedded), `studio-blueprint.json` (the Studio's blueprint, written by `unwrap`), the patches in `patches/`, and the `compute` output: `model.json`, `blueprint.json`, `blueprint.yaml`, `fragments/`, and `diagrams/`. The Studio saves `pre-sdd-[slug]-state-<YYYYMMDDTHHMMSSZ>.json`. Its preview ZIP is labelled a preview, never the Pre-SDD of record.
- **Combined output:** `PRE-SDD-[ProjectName]-vX.Y.md` (PascalCase project name) in the project root, with `studio/` and `decision-log.md` in `./pre-sdd-[slug]/`. On a version bump the file is renamed to the new version, and the old name is not kept.
- **Merged-from-chunks file:** `PRE-SDD-[ProjectName]-vX.Y-MERGED.md` in `./pre-sdd-[slug]/`.
- **IDs**, stable once seen, never renumbered or reused:
  - register rows keep the Standard's IDs (`BUS-01` to `ECO-06`); header rows are `HDR-01` to `HDR-10`; overlay rows are `OVL-01` to `OVL-12`, one per workload `WL-NN`;
  - an entry is its row ID, a dot, and its number: `REL-03.2`; `.1` is the primary entry;
  - calculations are `CALC-NN`, with `CALC-21` (option TCO) and `CALC-22` (weighted score) per option, as `CALC-21@OPT-NN`;
  - rules keep the Studio's IDs, except two renamed so that no rule ID equals an item ID: `LOAD-04` (was `CAP-04`) and `DB-READ-17` (was `DB-READ-11`);
  - options are `OPT-NN`, conditions `COND-NN`, exceptions `EXC-NN`, the G3 checklist lines `G3-01` to `G3-14`, the decision rules `DT-01` to `DT-15`, unknowns `QD-NN`, risks `R-NN`, open items `OI-NN`, and Pre-SDD ADRs `ADR-<AREA>-NNN`;
  - downstream documents cite them as `PSDD/<ID>` with a link, which resolves because each register row is a `### <ROW-ID>` heading; BRD IDs keep their BRD key (`REFUNDS/NFR-03`).
- **Versions:** one update, one version. The first build is 1.0. An update's first content change bumps the version one minor step, in the project state with the `set-version` op (any actor except an answer policy; the skill writes it), and opens one Changes Log row in chunk 00, which every later change in the update joins. The row ends with `Chunks:` and the number of every chunk whose content changed; the first build's row ends with `Chunks: none (initial build)`. The master and chunk 00 carry the current version; every other chunk keeps the version its content last changed in. Sign-offs, gate and status lines, board rows, links, footers, and index rows bump nothing.
- **Encoding:** UTF-8, LF line endings. **Tables:** pipe tables, no hard line wrap.
- **Punctuation:** no em dash (U+2014) or en dash (U+2013) in anything this skill writes; use a comma, a colon, or a short hyphen with spaces.
- **Time:** UTC for every timestamp: ISO 8601 with `Z`, dates as `YYYY-MM-DD` in UTC, and file-name stamps as `YYYYMMDDTHHMMSSZ`.

---

## Things this skill never does

- Never names a product, a version, or the architecture style (monolith, hybrid, microservices) in a Pre-SDD, and never names a provider unless the business makes it a hard constraint.
- Never writes `Confirmed` for a value as the agent, never signs G3, never ticks the G3 checklist, never grants an exception, never sets a cost, a TCO horizon, or a weight, and never approves its own work.
- Never writes under a person's name anything that person did not say or tick.
- Never works out a number by hand, in prose, or with a second calculator. Every number in a chunk comes from the engine; without Node.js, the skill stops.
- Never edits an engine fragment: a wrong value is fixed in the project state and recomputed.
- Never pre-fills a guessed value. A business number the sources do not give stays `Open`, and it reads TBD, never zero.
- Never proposes a forecast, a measurement, or another fact only a person gives.
- Never shows the 70 items all at once with nothing filled: the input comes in stages, pre-filled.
- Never starts the next stage past the G1 or G2 review stop without the user's "continue" (or an answer policy that names the stop).
- Never hands a Pre-SDD to the SDD as approved while G3 is not signed. A quick Pre-SDD claims no gate.
- Never edits a BRD, an SDD, an LLD, or another hop's row on the board. It writes only `./pre-sdd-[slug]/` (and, in COMBINED mode, its combined file), its own board row, the requests it raises, and the State and Closed cells of the requests addressed to it.
- Never moves a change to or from the SDD without approval.
- Never reads another skill's rule files to do its job; it reads their output documents and `unifier-status.md`.
- Never starts another skill in `team` run mode.
- Never makes the Studio call the network or need a server.
- Never renumbers or reuses an ID the user has seen.
- Never merges `decision-log.md` into a merged or combined Pre-SDD, and never leaves decision-process narration (who chose what, option letters, progress notes) in the content chunks.
- Never modifies the templates (`TEMPLATE-COMBINED.md`, `chunks/*.md`), the reference copies, or the examples during a run.

---

## Status board

The chain skills hand work to each other through one shared file, the status board, and `tutorialize-unifier` reads it for context. Every skill that carries this section follows the same rules below, word for word.

- **File:** `unifier-status.md` in the project root, the folder that holds the hop folders (`./pre-brd-*`, `./brd-*`, `./pre-sdd-*`, `./sdd-*`, `./lld-*`). The first chain skill that runs creates it from the template below. Nobody deletes it.
- **Template:**

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

- **Times and text:** every time on the board is UTC. `Updated (UTC)`, `Raised (UTC)`, and `Closed (UTC)` use `YYYY-MM-DD HH:MM`. A cell with no value holds `-`. The board uses no em dash and no en dash.
- **Run mode:** the header line reads `Run mode: solo` or `Run mode: team`.
  - The skill that creates the board writes `solo`, unless its instructions say the project is run by a team.
  - Only the user changes it.
  - In `team` mode a hop never starts another skill. At a handoff it raises the request and stops, which keeps one owner per folder. The request waits for that employee.
  - In `solo` mode a hop offers to start the next skill in the same session. When the user accepts "now" and the runtime can start it (Claude Code can), the next skill starts in the same session. When the runtime cannot, the request waits for that employee. On "later", the raiser sets the request State to `Later` (Handoff requests table, below).
- **Employees table:** one row per employee, with the columns Employee, Team, Skill, Folder, State, Version, Updated (UTC), Next step, and Waiting on.
  - The board starts with a row for every current employee, marked `Not started`. A future employee adds its own row.
  - A skill writes only its own row, the one whose Skill cell names it.
  - The State cell holds one of: `Not started`; `In progress: <step>`; `Waiting on: <employee> (<request ID>)`; `Ready for handoff`; `Done v<X.Y>`; `Stale: <reason>`.
  - The Folder cell holds the path of the skill's output folder once that folder exists, and `-` until then.
  - The Waiting on cell holds `<employee> (HR-NNN)` for each pending request (`Open`, `Later`, or `Accepted`) whose answer this skill waits on to go on, separated by `; `, or `-` when it waits on none.
- **Handoff requests table:** one row per request, with the columns ID (`HR-NNN`), From, To, Request, Why, Raised (UTC), State, Closed (UTC), and Link.
  - The State cell holds one of: `Open`, `Later`, `Accepted`, `Done`, `Declined`.
  - The skill that raises a request writes its row, with State `Open`, or `Later` when the user chose later at the handoff offer, and owns every cell of it but State and Closed (UTC). On State, the raiser sets only `Open` or `Later`, and only on its own request while it reads `Open` or `Later`. The receiving skill alone sets `Accepted` when it takes the request (still pending: taken, not finished), then `Done`, or `Declined` when it declines it, with Closed (UTC), at the stop where it finishes it.
  - One request per blocker: before raising a request, the raiser looks for its own request to the same receiver about the same thing that is still `Open`, `Later`, or `Accepted`. When one exists, it raises no new request: it updates that request's Why, its Request wording when the blocker changed, and its own row's Waiting on cell, and uses that request at this stop.
  - When the user answers "later" at a handoff offer, the raiser itself sets State `Later` on the request it raised or reused at that stop; an `Accepted` request stays `Accepted`. A later run that offers again may move its own request from `Later` back to `Open`, for example when the user answers "now".
  - A new request takes the next number after the highest ID on the board. IDs are never reused or renumbered.
- **When a skill uses the board:**
  - At the start of every run it reads the board: its own row, the pending requests (`Open`, `Later`, or `Accepted`) addressed to it and the ones it raised, and the upstream states.
  - At every stop (a part checkpoint, a gate stop, a handoff, or a wait) it updates its own row.
  - At its handoff points it raises requests, or reuses its own pending one (Handoff requests table).
- **Concurrency:** there is no lock. Re-read the board just before writing, change only the cells you own, and keep the line structure (one table row per line, the column order) and the file's line endings. The accepted risk is two agents writing at the same instant.
- **Resuming inside a hop** still uses the skill's own master. The board's Next step points to it.
- **Writers outside the project root:**
  - `impl-tracker-unifier` runs in the code repo. It writes its row through the docs root its `tracking/config.md` records. When that path is unreachable, it skips the board update and says so in a note.
  - `tutorialize-unifier` only reads the board and has no row.

## Reference files

Read these when the situation calls for them.

- `TEMPLATE-COMBINED.md`: the single-file layout. Read at the start of any COMBINED write-up.
- `chunks/*.md`: the chunk templates and the master template `chunks/pre-sdd-master.md`, with the fragment markers. Read the master template at step 5, and the chunk templates at the start of any CHUNKS write-up.
- `chunking.md`: the chunk map (quick and full, brownfield, overlay), the master's progress table, combined mode, merge, and re-chunk.
- `register-and-entries.md`: the row families, entries, record fields, statuses, sources, proposals, who confirms, entry IDs, and citations. Read before step 6.
- `prefill-and-derivation.md`: the trust order, the never-guess rule, and the derivation table (which row comes from which BRD chunk, formula, or default). Read at step 6.
- `stages-and-input.md`: the four stages, the web path, the prompt path, saving, switching paths, and resuming. Read at step 7.
- `engine-and-studio.md`: every CLI command with its flags and exit codes, where the files land, the fragments and their markers, the parity check, the preview ZIP, and what to do when Node.js is missing. Read at step 5.
- `classification-and-paths.md`: change type crossed with target, hybrid, the migration overlay, the recovery tier and the closest worked example, and when chunks 06 and 08 exist. Read at steps 7 and 9.
- `gates-and-signoff.md`: G0 to G3, the G3 checklist, DT-01 to DT-15, the sign-off roles, conditions, exceptions, change after G3, and the review stops. Read at steps 8, 9, and 13.
- `options-and-economics.md`: shape-level options, the hard-constraint filter, the criteria, costs and weights, scores, and TCO. Read at step 9.
- `migration-overlay.md`: the overlay rows per workload, the 7R definitions, hazards, cutover rules, the wave record, and DT-11. Read at step 9 when the overlay applies.
- `handoff-guide.md`: chunk 12, the contract `sdd-unifier` reads, and where each locked item lands in the SDD. Read at step 11.
- `review-and-open-items.md`: the reviewer brief, the `OI-NN` format, the accept loop, the review limit, and delta reviews. Read at step 12.
- `decision-log.md`: the companion decision register: its registers, its structure, and the rule that content chunks carry only the settled outcome. Read whenever a decision is taken or applied.
- `reference/Pre-SDD_Architecture_Standard_v1.md` and `reference/Pre-SDD_Quick_Discovery_Guide.md`: the method, verbatim (`reference/SOURCE.md`). The Standard wins when they disagree.
- `reference/policy-appendix.md`: the engineering defaults appendix.
- `examples/`: the Examples README and the eight worked examples (examples, not templates), `examples/ERRATA.md` (the verified issues in them), and `examples/studio-v2.2-export/` (a Studio v2.2 export in the old format).
- `studio/`: the engine `studio/src/engine.js`, the CLI `studio/cli.mjs`, the blank Studio `studio/pre-sdd-studio.html`, the schemas in `studio/schema/`, `studio/validate_handoff.py`, and `studio/CHANGELOG.md`.
- `README.md`: the design notes, the layout, and the tests, for maintainers.

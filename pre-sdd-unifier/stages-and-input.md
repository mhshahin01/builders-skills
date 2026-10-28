# Stages and input

This file defines how the answers come in: the four stages and what ends each, the web path through the Studio, the prompt path in chat, the owner names and due dates, saving and the progress pointer, switching paths, and resuming. Read it at step 7 of [SKILL.md](SKILL.md).

Both paths collect the same input: the same rows, in the same stages and order, written into the same project state through the same engine. The project state of record is `./pre-sdd-[slug]/studio/project-state.json`. The register's fields and statuses: [register-and-entries.md](register-and-entries.md). The pre-fill that comes before stage 1: [prefill-and-derivation.md](prefill-and-derivation.md).

---

## The four stages

| Stage | Rows and work | Ends with | Then |
|---|---|---|---|
| 1. Discovery | The classification (HDR-07, HDR-08), the fault scope (REL-05), and the Quick Discovery Guide's minimum numbers: HDR-07, HDR-08, BUS-05, CAP-01, CAP-03, CAP-04, CAP-07, REL-01, REL-03, REL-04, REL-05, DAT-02, ECO-01, in this order (decision 9), each pre-filled where a BRD gives it | The discovery summary, and the unknowns register: every stage 1 entry still `Open` has an owner name and a due date, and every open question is an unknown `QD-NN` with its impact, owner, and due date | Quick mode ends. Full mode goes straight on to stage 2 |
| 2. Register | The header rows still `Open`, the overlay switch and its workloads, then the 70 items one group at a time: BUS, SEC, DAT, INT, CAP, REL, OPS, ECO (decision 8) | Every entry has a status, and every `Open` entry has an owner name and a due date: the Standard's G1 | **G1 review stop:** wait for "continue" |
| 3. Assess | The calculations, the target shape, the options with their scores, costs, horizon, and weights, and, while the overlay applies, the values of OVL-01 to OVL-12 per workload | A feasible option shortlist, or a blocker: the Standard's G2 | **G2 review stop:** wait for "continue" |
| 4. Confirm and decide | Every `Estimated` value still standing, grouped (HDR, BUS to ECO, OVL), with one confirm per group; then the decisions (topology override, DR override per scope, chosen option) and the validation | The write-up, the review, and the handoff guide | **G3 sign-off stop** (`gates-and-signoff.md`) |

**Inside a stage 2 group,** the rows that need an answer come first: `Open` without a proposal, `Open` with a proposal, `Estimated`, then `Confirmed` and `N/A`, each by ID. Rows already settled in stage 1 come up in their group with their status, and are not asked again unless the person changes them. Derived values recompute after every answer, so a later row may show a new derived value.

**Header rows first.** Stage 2 opens with the header rows still `Open` (solution name, business sponsor, product owner, lead architect, architecture review authority, business budget owner, source platforms, migration direction), because G0, the Standard's Initiate gate, needs the sponsor (HDR-02) and the lead architect (HDR-04).

**The overlay switch** is settled with the classification, at the start of stage 2: `set-overlay` (whether the overlay applies, and the source platform), by the person, or by the skill with its citation in `cite` (never by an answer policy); then the workloads (`add-workload`, `rename-workload`, `remove-workload`). Stage 2 asks for an owner name and a due date on every OVL entry of every workload, because G1 counts them; stage 3 takes their values (`migration-overlay.md`).

**What is read from the engine.** Each stage's end is read from the engine's gate result (`derive` prints it; `compute` writes it to `model.json`), never from memory: G0 and G1 for stage 2, G2 (`shortlist`, `blocker`, or `incomplete`) for stage 3, and the G3 status for stage 4. The summaries at the stops show the engine's counts by status, never counts made by hand.

**Never all at once.** Neither path shows the 70 items empty and together: a person sees one stage, and in stages 2 and 4 one group, at a time.

---

## The web path

The person answers in the Studio, an offline HTML file with the project state embedded. It opens from disk, makes no network call, and needs no server. It opens filled from the embedded state, with no import step, at the stage and group the state names. The web path is the recommended input path, and the default when no path is given.

1. **Embed.** Note the time in UTC, then build the Studio with the current state:

   ```
   node "<skill>/studio/cli.mjs" embed "./pre-sdd-[slug]/studio/project-state.json" --out "./pre-sdd-[slug]/studio/pre-sdd-studio.html"
   ```

2. **Open.** Print the path, and offer to open it in the default browser (SKILL.md § Running outside Claude Code). Say which stage and group to work on, and that the Studio records every tick under the name the person enters in it.
3. **Hold the state.** While the Studio is open, the skill writes nothing to `project-state.json` but, after a kept save, the progress pointer (step 8) and the items the Studio does not collect (below): the person's next kept save replaces the file. A question the person asks in chat meanwhile is answered in chat, and its answer is given in the Studio.
4. **Save.** The person answers, ticks to confirm, and saves. The browser saves `pre-sdd-[slug]-state-<YYYYMMDDTHHMMSSZ>.json`, normally to Downloads; a browser may add ` (1)` to a repeated name. The save file holds the project state and the blueprint the Studio computed. The person may save at any time, as often as they like.
5. **Find the save.** When the person says they have saved, find the newest matching file saved after the embed:

   ```
   node "<skill>/studio/cli.mjs" validate --pick "<Downloads folder>" --slug [slug] --since "<embed time, ISO 8601 UTC>"
   ```

   It prints the file it picked, then the validation result. **Always confirm the path with the person** ("Is this the file you saved: `<path>`?"). When they name another file, validate that one (`validate "<file>"`). When no file matches, ask where they saved it.
6. **Keep it.** When the file passes, unwrap it into the Studio folder:

   ```
   node "<skill>/studio/cli.mjs" unwrap "<save file>" "./pre-sdd-[slug]/studio"
   ```

   It writes the save's project state, read through the state gate, as `project-state.json`, and the blueprint the Studio saved as `studio-blueprint.json`, and prints the gate's corrections as `notes`. Never split the save file by hand. Leave the file in Downloads as it is: the skill writes only its own folder.
7. **Recompute and compare.** Run `compute` (`engine-and-studio.md`), then compare the Studio's blueprint with the CLI's:

   ```
   node "<skill>/studio/cli.mjs" diff "./pre-sdd-[slug]/studio/studio-blueprint.json" "./pre-sdd-[slug]/studio/blueprint.json"
   ```

   The expected difference is none (exit code 0). Report each difference the command lists to the user. The chunks always come from the CLI's `compute`, never from the Studio's blueprint.
8. **Update the pointer** (§ Saving and the progress pointer), then go on, or embed again for the next stage or group.

A file that fails validation, or that `unwrap` refuses (exit code 2, nothing written), is not kept: show the person the engine's messages, which say what to fix, and ask them to save again from the Studio. A file whose state the engine refuses: [register-and-entries.md](register-and-entries.md) § Reading a project state.

**What the Studio does not collect.** The Studio has no overlay tab, and no control for the migration overlay switch (`set-overlay`), the workloads (`add-workload`, `rename-workload`, `remove-workload`), the OVL entries (their values, owner names, and due dates), the unknowns (`add-unknown`, `close-unknown`), or removing an option (`remove-option`). On the web path, take these in chat by the prompt path's rules (§ The prompt path, § Owner names and due dates) and apply them with `cli.mjs derive --apply`, without a path switch. Write them before an embed, or after a kept save (step 6) and then embed again before the person goes on, so the next save carries them; a save from a Studio embedded before them would drop them:

- **At the start of stage 2,** before the first embed of the stage: the overlay switch and the workloads.
- **After the person's kept save of stage 2:** the owner names and due dates of every OVL entry of every workload, because G1 counts them.
- **In stage 3:** the OVL values.
- **Whenever one comes up:** an unknown to add or close, or an option to remove.

---

## The prompt path

The same rows, in the same stages and order, asked in chat.

- **Batches of up to four.** In Claude Code, use AskUserQuestion, up to four questions per call (load it with ToolSearch when it is deferred). Elsewhere, ask plain numbered questions, each with its options, and wait for the answer (SKILL.md § Running outside Claude Code). Keep a batch inside one stage and one group; a batch may hold fewer than four questions.
- **Each question** names the entry ID and the item, in plain words, with its unit. For CAP-01 the unit is transactions per day, and the question also shows the derived average business TPS (CALC-01) and peak business TPS (CALC-02) beside it. It shows the pre-filled value with its source, or the proposal with its reason. Where there is a recommended option (a proposal, a stated default), it comes first.
- **A pre-filled value is asked as "keep or change".**
- **Each group ends with one question:** "Confirm all pre-filled values in this group?" (stage 2 and stage 4). The Studio has the same group confirm.
- **Another person** who answers gives their own name first, and their answers go under it.

**Writing the answers.** After every answered batch, write its answers into the project state in one patch, with the person who answered as the actor, through `derive --apply` (`engine-and-studio.md`):

| The person says | Op |
|---|---|
| Keep the pre-filled value | `confirm` (the entry, or `entry` and `factor` for a factor) |
| A new or changed value | `set` with the value and any record fields they give, then `confirm` of the same entry, in the same patch |
| A new or changed factor value | `set-factor` with the entry, the factor, and the value, then `confirm` with the same `entry` and `factor`, in the same patch |
| Take the proposal | `accept-proposal` |
| It does not apply, with the reason | `na` |
| Leave it empty | `set` with a blank value: the entry stays `Open`, "left open" |
| Confirm all pre-filled values in this group | `confirm-group` with the group (`HDR`, `BUS` to `ECO`, or `OVL`) |
| Not known yet | Nothing on the value; ask for its owner name and due date (next section), and record the question as an unknown |

An explicit answer in chat is a confirmation: the person said the value. Under an answer policy, the policy answers only the questions it may (SKILL.md § Answer policy), with the policy as the actor; every other question waits for the person.

A patch the engine refuses changes nothing: the engine applies a patch whole or not at all. Show the person the message, fix the op, and apply the patch again.

---

## Owner names and due dates

G1 needs an owner name and a due date on every `Open` entry. Both come from a person, never from the skill, a BRD guess, or an answer policy.

- **Ask in batches, never one entry at a time.** List the group's `Open` entries (ID, item, owner code), and ask for the names and dates in one question. One answer may cover several entries ("all ECO entries: Dana, 2026-11-30").
- **Write them** with `set` (`owner_name` and `due`, a `YYYY-MM-DD` date) on each entry, under the name of the person who answered. The engine refuses these two fields from the skill and from an answer policy.
- **Stage 1** asks them for the stage 1 entries still `Open`, for the unknowns register. **Stage 2** asks them for every `Open` entry of the group, and, while the overlay applies, for every OVL entry of every workload.
- **An unknown** (`add-unknown`) carries its owner and due date from the start, because no op changes it later: collect them first (`register-and-entries.md` § Unknowns).

The owner code (`B`, `E`, `D`, `Sec`, `Ops`, `Fin`, `Legal`) comes from the catalogue; it says which role answers, and helps the person name who.

---

## Saving and the progress pointer

- **Prompt path:** the skill writes the project state after every answered batch.
- **Web path:** the person saves at any time; each save comes back through steps 5 to 7. A kept save replaces the whole project state, the pointer included, so the skill writes the pointer again after each kept save.

**After every answered batch and every save**, the skill writes where the run stands, in three places, naming the next stage and group:

1. **The project state:** the `set-run` op with `stage` (1 to 4) and `group` (`HDR`, `BUS` to `ECO`, `OVL`, or `null` when the next step works on no group), in a patch of its own with the skill's agent actor; any actor may write the pointer.
2. **The master's progress table** (stage, group, gate, write-up, review, handoff), in `./pre-sdd-[slug]/[slug]-pre-sdd-master.md`, or in COMBINED mode the combined file's cover. The gate column holds the engine's gate label.
3. **The board row** in `unifier-status.md`, for example `In progress: stage 2, group DAT` (SKILL.md § Status board).

The same three are updated at every stop: the G1 and G2 review stops, the G3 sign-off stop, and while the run waits for a person.

---

## Switching paths

The input path can change at any stage boundary, when the user says "switch to web" or "switch to prompt".

- **Who:** only a person or a fixture owner sets the input path. The skill records the switch with the `set-run` op (`input`), under the name of the person who asked; the engine refuses the skill and an answer policy.
- **Mid-stage:** a switch asked in the middle of a stage takes effect when the stage ends. Say so, and go on. This does not apply to the items the Studio does not collect (§ The web path), which are always taken in chat.
- **Web to prompt:** first pick up the person's last save (web path steps 5 to 7), so the state of record holds every answer, then record the switch and go on in chat.
- **Prompt to web:** record the switch, then embed the current state and open the Studio (web path steps 1 and 2).

---

## Resuming

A run on an existing Pre-SDD resumes, never restarts (SKILL.md step 1; design § 6.9). `cli.mjs new` is never called on an existing folder.

1. **Read where it stands:** the master's progress table (in COMBINED mode, the combined file's cover) and the project state's `run` (mode, input path, light, stage, group). When the two disagree, the project state wins, and the table is rewritten from it.
2. **A pending save first.** On the web path, when the Studio was open at the last stop, look for a save made after the Studio was built (web path steps 5 to 7) before anything else. The `--since` time is the embed time; the modified time of `pre-sdd-studio.html`, in UTC, gives it.
3. **Then act on the request:**
   - "continue", "next group", "stage 3": go on from the stage and group the pointer names;
   - an empty request: ask "Continue with <stage, group>?" (for example "Continue with stage 2, group DAT?") and wait;
   - anything else: do that (SKILL.md § Later requests), and name the stage and group still waiting.
4. **A stop stays a stop.** A run that stopped at the G1 or G2 review stop goes on only after "continue", or under an answer policy that names that stop.
5. **The batch in flight.** Every answered batch was written when it was answered, so only an unanswered batch is lost: ask its questions again.

The mode and `light` stay as the project state and the master's **Generation:** line record them. A quick Pre-SDD continues into the full Pre-SDD from stage 2 when a person asks: the skill records `set-run` with `mode: full` under that person's name.

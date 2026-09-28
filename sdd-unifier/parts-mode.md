# Generation Option - Parts or Whole

The generation option controls **how much is written before the user looks at it**. It is separate from the output mode (chunks / combined) and from the intent (generate / transform / derive-from-BRD).

| Option | What happens | When |
|---|---|---|
| `parts` (**default**) | The SDD is written in three parts. The skill stops after parts 1 and 2 and waits for the user's go-ahead. | CHUNKS mode, generate, transform, or derive-from-BRD |
| `whole` | Chunks 00-18 are written in one go, as one run (the acceptance loop still runs at the end); chunk 19 follows in the same run only if the e2e gate opens. | When the user asks for it; always in COMBINED mode; always for pure conversions (merge, re-chunk) and targeted updates |

**How it is chosen**

- Argument: `sdd-unifier [chunks|combined] [parts|whole]`, in any order. Examples: `sdd-unifier chunks whole`, `sdd-unifier whole`, `sdd-unifier parts`.
- Words in the request: "all at once", "in one go", "one shot", "everything now" mean `whole`. "Part by part", "step by step", "let me review as we go" mean `parts`.
- Nothing said: `parts`. Do not ask. Say it in one line before starting: "Generation: parts (default). Say 'whole' to get everything in one go."
- `combined parts` is not available: a combined SDD is always written whole. Say so in one line and continue in `whole`.

Intake (SKILL.md step 3), the Project Type ask (step 3a), the architecture questionnaire (step 3b), and the ecosystem selection (step 3c) happen once, before part 1. They are never repeated per part.

---

## The three parts

| Part | Chunks | What it settles | The user reviews |
|---|---|---|---|
| **1** | 00, 01, 02, 03, 04, 05, 06, 07, 08, 09, plus `[project-slug]-sdd-master.md` | The shape of the system: scope and risks, the ecosystem, actors, architecture style, context and high-level architecture, critical workflows and sequences, principles and ADRs, cross-cutting defaults, integrations, and the service decomposition | The architecture style and ADRs, the cross-cutting defaults (tenancy model, deployment, security), the integrations, and above all the **Services Decomposition** (09): service names, bounded contexts, data ownership, which BRD use cases each service owns (09 `Use cases (BRD)`, traced one row per use case in 03 §7.3). These drive part 2; changing the service list later is costly. |
| **2** | every `13x` service chunk, then 10, then 12, then 11, then the contract reconciliation (SKILL.md step 6a) | The per-service specs and the three contract registries: the Centralized Event Hub (10), the Service Integration API Contracts (11), and the Centralized User Roles (12) | Per-service boundaries, APIs, DB models, published and consumed events, error handling; the event contracts in chunk 10; the API contracts in chunk 11 (internal contracts defined, external ones `TBD - external` for you to complete); the role catalogue in chunk 12; every divergence flagged in chunk 10 §14.8, chunk 11 §15.5, or chunk 12 §16.12 |
| **3** | 14, 15, 16, 17, then 18, then 19 (gated) | Performance and capacity, environments, runbook, appendix; the independent review; the end-to-end design once the open items are cleared | The open items (acceptance loop); then chunk 19 is written only if the e2e gate opens |

The order is fixed: 1, then 2, then 3. A part is never skipped, and a later part is never started before the earlier one is complete.

Inside part 2, keep the contract generation order from SKILL.md step 6: draft the per-service Event Models and List of APIs, consolidate into chunk 10, back-propagate fixes into the `13x` chunks, then write chunk 12 (roles), then chunk 11 (API contracts, which cite chunk 12's permission tokens), then run step 6a. Chunk 19 waits for part 3 and the e2e gate (SKILL.md step 8b), so it consolidates the final reviewed state.

---

## What every part does

1. **Read first.** Read the source material (BRD, SoW, or existing SDD) and every chunk written by earlier parts, in full. Read `decision-log.md` if it exists. In a new session this is mandatory: nothing is remembered from the earlier run.
2. **Write the part's chunks** with the normal rules (templates, reference + delta to the BRD, one fact one home, Mermaid policy, no invented targets).
3. **Back-fill earlier parts** (parts 2 and 3 only). Later work changes earlier chunks. Apply the change and list it in the part summary:
   - New terms and acronyms go into the Glossary (01 §5). New assumptions go into §3; new risks into §4.
   - A decision taken while writing a service or a registry that affects the whole platform becomes an ADR in 06 §10 (next free ADR ID). A deviation from a cross-cutting default is recorded as an override in the service chunk and, if it changes the default itself, in 07.
   - The Services Decomposition (09) follows the service chunks: if part 2 renamed, split, merged, or re-scoped a service, the service chunk wins and 09 is updated, together with the service boxes in the 04 diagrams and any 05 workflow or sequence that names it. Say clearly that this is a change to what the user approved in part 1.
   - Integration rows in 08 gain the owning service and any protocol detail settled in the service chunk.
   - Derive-from-BRD: §7.3 in 03 gets its Entry points, APIs, and Events columns in part 2 (after chunk 11, before step 6a), and each Owner becomes a link to its `13x` chunk. A service renamed, split, or merged updates 09 `Use cases (BRD)` and the §7.3 Owner cells in the same pass.
   - Figures index and Tables index in chunk 00.
4. **Keep IDs stable.** Once the user has seen an ID, it is never renumbered and never reused: service chunk letters (`13a`, `13b`, ...), BRD keys, ADR-NN, AP-NN, API-NN, risk IDs, topic names, event names, role names, permission tokens, and OI-NN. A service added in part 2 takes the next free chunk letter and is appended to 09. A service merged away keeps its 09 row, marked `Merged into [service]`, and gets no chunk; a removed one keeps its row, marked `Removed: [reason]`. The §17.X number follows the chunk letter (`13c` is §17.3) even when an earlier letter has no chunk; the gap is expected. A renamed event or topic is a contract change: update chunk 10 and every `13x` chunk in the same pass, and add a Changes Log note if the old name was already shown to the user.
5. **Run the part's exit checklist** (below). Fix what fails; flag what cannot be fixed with `[NEEDS CLARIFICATION: ...]`.
6. **Update the progress record** (below).
7. **Present the part summary and STOP** (parts 1 and 2). Part 3 goes on as § End of part 3 says.

### The checkpoint (end of part 1 and end of part 2)

Show a short part summary:

- The files written, and the chunks of earlier parts that were changed by the back-fill, with the reason.
- Counts: services, ADRs, Mermaid figures, `[NEEDS CLARIFICATION: ...]` markers in this part. Derive-from-BRD: the source BRDs with their keys (part 1: say the keys are now fixed), the cross-BRD conflicts found, and per BRD the use cases with an owner vs flagged in §7.3. In part 2 also: topics, events, roles, API contracts (internal `Defined` vs `TBD - external`), and the number of contract divergences flagged.
- **What to review now**, from the table above, in two or three lines.
- The next step: "Say 'continue' for part N, or tell me what to change first."

Then **stop and wait**. Do not start the next part in the same turn. Do not start it on silence, on a thank-you, or on a question about something else. Start it only when the user says so ("continue", "next part", "part 2", "go on"), or gives corrections and then asks to continue.

When the user gives corrections: apply them to the existing chunks first, rerun the exit checklist of that part, update the summary, and only then move on if they asked to. Record each decision that settles an open question in `decision-log.md`; the chunks carry only the resulting design.

**A correction removes or merges a service at the end of part 1.** Every BRD use case, integration, and entity the service owned must move to another service (for use cases: 09 `Use cases (BRD)` and the §7.3 Owner cells). If the user did not say where, ask before applying anything (one question per orphaned responsibility, recommendation first), and do not continue until it is answered.

**A correction at the end of part 2 changes a contract.** Apply it to chunk 10, 11, or 12 and to every affected `13x` chunk in the same pass, then rerun step 6a before the summary.

### End of part 3

Part 3 does not end with a checkpoint. After chunks 14-17 and the back-fill, run the part 3 exit checklist. Then run the rest of the normal workflow in order: the independent reviewer pass (SKILL.md step 7, chunk 18), the open items acceptance loop (step 8), the e2e gate check (step 8b: chunk 19 is written only if E1-E4 are met, otherwise it stays `Locked` and the handoff lists what is open), the final `[project-slug]-sdd-master.md` and chunk 00, and the full handoff (step 9). The independent reviewer runs **once**, here, on chunks 00-17.

---

## Exit checklists

**Part 1**

- [ ] Every §6 ecosystem row has its source in Notes (`BRD-mandated`, `default`, `recommended`, `user override`); every deviation from the doctrine or CLAUDE.md defaults has an ADR in 06.
- [ ] §8.1 Architecture Style has What / Why / How at the bar of `sdd-quality.md`; the minimum ADR set is present or flagged.
- [ ] Every actor in 03 traces to a BRD persona (derive-from-BRD) or to the source; none is invented.
- [ ] Every service in 09 has a bounded context, owns its data, and serves at least one use case or platform concern. No entity is owned by two services.
- [ ] Derive-from-BRD: chunk 00 § Document Lineage lists every source BRD with its key, version, and link, and Child LLDs reads `None yet` (or the LLDs found); every BRD reference in 00-09 carries its key; with two or more BRDs, every cross-BRD conflict is asked, recorded as an ADR, or flagged (`brd-to-sdd.md` § Source BRDs and lineage).
- [ ] Derive-from-BRD: every use case of every source BRD has its §7.3 row in 03, under its BRD's group (title and status as the BRD states them); every active one has exactly one owner in 09 `Use cases (BRD)`, or a `[NEEDS CLARIFICATION: ...]` in its Owner cell; every §8.4 and §8.5 diagram has its `**Use cases:**` line; every UC link resolves (file and anchor).
- [ ] Every integration in 08 names the service that owns it, or is flagged.
- [ ] Brownfield only: the §1 Existing System Context sub-section exists and 07 marks each concern inherit / override / new.
- [ ] The Glossary covers every term and acronym used in 00-09.
- [ ] Every Mermaid block parses and has its Summary line.
- [ ] No decision-process narration in content chunks (search for `Resolved on`, `The user selected/answered/chose`, `remains partial`, `option A/B` as narrative, `walkthrough`). ADRs state the decision, its context, and its consequences in present tense; the Q&A behind them is in `decision-log.md`.

**Part 2**

- [ ] Every active service row in 09 has a `13x` chunk at the bar of `sdd-quality.md`; no `13x` chunk exists without a 09 row.
- [ ] Contract reconciliation (SKILL.md step 6a) has run: topic and event names match chunk 10 character-for-character; every consumed event has exactly one producer; consumer lists agree from both sides; every payload field a consumer relies on exists in §14.9; role names and permission tokens match chunk 12.
- [ ] Every synchronous integration has an `API-NN` in chunk 11 with URI, headers, parameters, body, responses, error codes, security, and auth; the §15.4 coverage matrix has no uncovered row; method and URI in each `13x` List of APIs match chunk 11; external contracts are `TBD - external` with nothing invented.
- [ ] Every divergence that could not be fixed is flagged in chunk 10 §14.8, chunk 11 §15.5, or chunk 12 §16.12.
- [ ] Per-service authorization notes agree with the BRD Users & Use Cases Matrix (derive-from-BRD), or the difference is flagged.
- [ ] Derive-from-BRD: §7.3 Entry points, APIs, and Events are filled, every Owner links to its `13x` chunk, and the use-case traceability check of step 6a passes (every owned use case is cited in its owner's Business Logic; no active use case lacks an entry point, or it is flagged).
- [ ] 09, 04, 05, and 08 match the service chunks after the back-fill.
- [ ] No per-service DB model, API list, or Event Model was invented from the BRD alone; missing architect input is flagged.
- [ ] No decision-process narration in content chunks. Clarifications raised or decided in this part are recorded in `decision-log.md` with working rule-home links.

**Part 3**

- [ ] Every BRD NFR is quantified into a technical target in 14, or flagged; no target, capacity number, or version pin was invented.
- [ ] Every environment in 15 and every runbook procedure in 16 is concrete (the good-procedure bar of `sdd-quality.md`), or flagged.
- [ ] Chunk 18 exists and every OI has a decision or is listed as open in the handoff; chunk 19 is written only when the e2e gate is open, and then its counts, names, and edges trace to 09 / 10 / 11 / 12 / 13x with nothing owned by those chunks restated.
- [ ] The back-fill of 00, 01, 06, 07, and 09 is done.
- [ ] No decision-process narration in content chunks. Accepted open items are applied as plain design text; their narrative is in `decision-log.md` with working rule-home links.

---

## The progress record

Parts mode keeps its state in `[project-slug]-sdd-master.md`, so any later session can resume. Write `[project-slug]-sdd-master.md` in part 1 and update it at the end of every part.

```markdown
## Generation Progress

**Generation:** parts
**Intent:** derive-from-BRD
**Source:** ../brd-wallet-management-service/wallet-management-service-brd-master.md

| Part | Chunks | Status | Completed |
|------|--------|--------|-----------|
| 1 | 00-09 | Complete | 2026-09-27 |
| 2 | 13x, 10, 12, 11 | Complete (reconciled 2026-09-28) | 2026-09-28 |
| 3 | 14-18, 19 (gated) | In progress (14-17 written; reviewer next) | - |
```

- Write the **Source** line in part 1: the path of every source file (every source BRD's master or combined file), or "conversation" when there is none. A new session reads the source from there. If it cannot be found, ask the user for it before writing anything.
- Status is `Pending`, `In progress ([last step done])`, or `Complete`. Parts 2 and 3 have several steps, so record each one as it finishes. Part 2: `13x written`, `10 written`, `12 written`, `11 written`, `reconciled`. Part 3: `14-17 written`, `18 written`, `acceptance loop done`, `19 written` or `19 Locked (gate shut)`. Part 3 becomes `Complete` when the gate check has run: chunk 19 is then either written or `Locked`, and a later request refreshes it through SKILL.md step 8b.
- In the master's chunk tables, a chunk that is not written yet is plain text followed by `Pending (part N)`. It becomes a link when it is written.
- Chunk 00 shows `**Status:** Draft - part N of 3` until part 3 is complete, then `Draft`.
- During the first build, the version does not change between parts. The Changes Log keeps one "Initial draft" row, dated when part 3 completes; the acceptance loop in part 3 then adds its own row as usual (SKILL.md step 8).
- PREV / NEXT footers may point at a chunk that does not exist yet. That is expected until its part is written.
- When part 3 is complete, remove nothing: keep the table with all three parts `Complete`. It is the record of how the SDD was built.

In `whole` runs the section holds one line: `**Generation:** whole`.

---

## Resuming

When the skill is invoked on a folder whose `[project-slug]-sdd-master.md` shows a part that is `Pending` or `In progress`:

1. Say what was found: "Part 1 is complete (2026-09-27). Part 2 is next."
2. Act on what the user asked:
   - The request says to go on ("continue", "next part", "part 2"): start that part.
   - The request is empty (the skill was only invoked): ask "Continue with part N?" and wait.
   - The request is something else (a change to a written chunk, a question): do that, then name the part that is still waiting. Do not start it.
3. When a part starts, follow "What every part does" from step 1: read the source (from the **Source** line), `decision-log.md`, and every written chunk first.
4. A part that is `In progress` continues after its last recorded step; a finished step is never redone. In part 3: if chunk 18 exists, the independent reviewer does not run again. Open items still `Open` go through the acceptance loop.
5. Never rewrite a completed part on a resume. Only the back-fill touches it.

**The user asks for a later part while an earlier one is pending.** Explain the order and offer the next pending part. Do not skip.

**The user asks to redo a completed part.** Rewrite that part's chunks, keeping every decision taken since: re-apply each Resolution Log entry in chunk 18 that points into the part, and keep every ADR and ecosystem decision recorded in `decision-log.md` unless the user reverses it. Then, for every later part that is already complete: rerun its back-fill and exit checklist (for part 2, rerun step 6a), and tell the user what no longer fits (for example, a service chunk whose service was merged away, or events whose producer changed). If part 3 was complete, this is a content change: bump the version and add a Changes Log row, update chunk 18 by status only (the independent reviewer runs again only if the user asks), and mark chunk 19 `Stale` (refresh only through SKILL.md step 8b).

**The user switches to `whole` midway.** Write all remaining parts in one run, with no more checkpoints, and record `Generation: parts, completed whole from part N`.

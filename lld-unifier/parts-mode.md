# Generation Option - Parts or Whole

The generation option controls **how much is written before the user looks at it**. It is separate from the output mode (chunks / combined) and from the direction (from-code / from-sdd / hybrid / partial).

| Option | What happens | When |
|---|---|---|
| `parts` (**default**) | The LLD is written in three parts. The skill stops after parts 1 and 2 and waits for the user's go-ahead (an answer policy that names part checkpoints passes the stop: § The checkpoint). | CHUNKS mode, a first build in any direction |
| `whole` | Chunks 00-18 are written in one go, as one run (the review and the acceptance loop still run at the end). | When the user asks for it; always in COMBINED mode; always for pure conversions (merge, re-chunk) and for every request on an existing LLD (an update, a refresh, a regeneration, a stack change) |

Chunk 19 (the implementation deck brief) is outside both options. A build never writes it, in `parts` or in `whole`: it is written only on request, after chunk 18 is cleared (SKILL.md step 7c).

**How it is chosen**

- Argument: `lld-unifier [chunks|combined] [parts|whole] [light]`, in any order. Examples: `lld-unifier chunks whole`, `lld-unifier whole`, `lld-unifier parts`.
- Words in the request: "all at once", "in one go", "one shot", "everything now" mean `whole`. "Part by part", "step by step", "let me review as we go" mean `parts`.
- Nothing said: `parts`. Do not ask. Say it in one line before starting: "Generation: parts (default). Say 'whole' to get everything in one go."
- `combined parts` is not available: a combined LLD is always written whole. Say so in one line and continue in `whole`.
- `light` holds for all three parts. A light first build writes `parts, light` on the master's Generation line (§ The progress record), and a resume reads it there.

**What counts as a build in progress.** The master's Generation Progress section shows a part that is `Pending` or `In progress`. A master with no Generation Progress section (an LLD written before parts, or re-chunked), with `Generation: whole`, or with all three parts `Complete` is a finished LLD: it never resumes, and every request on it is `whole`.

Direction (SKILL.md step 2), intake (step 3), the Project Type and stack approval (step 3a), the use-case trace inputs (step 3b), and the plan (step 4) happen once, before part 1. They are never repeated per part, and a resume does not repeat them. A first build has no existing LLD, so step 3c does not run before part 1; the upstream version check of step 3c runs at the start of parts 2 and 3, and on a resume (§ What every part does, step 1). The stack approval's Group B library rows are asked there too, whatever the split, and the answer is recorded in `decision-log.md`.

---

## The three parts

| Part | Chunks | What it settles | The user reviews |
|---|---|---|---|
| **1** | 00, 01, 02, 03, 03a, plus `[project-slug]-lld-master.md` and, when a record exists, `decision-log.md` (an LLD with no 03a, as one written before it, has a part 1 of 00 to 03) | The frame: direction, sources, scope (the services and modules the LLD covers), context, the architecture as implemented (component and deployment topology, the runtime stack as approved), and the libraries and coding conventions | The scope in 01 § 2 (it fixes the list of `04-implementation/` files, and says whether the scope has a UI surface), the assumptions, the component topology (03 § 6.1) and deployment topology (§ 6.2), every runtime stack row with its label (§ 6.3), and above all 03a: the libraries by concern with their Status (the `Proposed - needs approval` rows) and the coding conventions. These steer every service file in part 2. |
| **2** | every `04-implementation/<service>.md`, then 05, 06, 07, 08, then the API contract checks | The implementation: per-service classes, patterns, pseudocode, transactions, errors, and use-case workflows; the data model; the API contracts (a block per endpoint and port); the event contracts; the state machines and business rules | Per service: the class and interface map, the patterns with their rationale, the pseudocode, the transaction boundaries, the error mapping (§ 7.7), and each use-case workflow with its traceability line. Then the tables and indexes (05), every § 9.2 block of 06 (above all the values the SDD leaves open, which are proposed and flagged), the topics and events (07), and the state machines and rules (08). Every `> Confirm:` and `> TODO:` in them. |
| **3** | 09, 10, 11, 12, 13, 14 (only when the scope has a UI surface), then 16, then the trace reconciliation (step 6a), then 17 (step 6b), then 15, then the Child LLDs row (step 6c); then the review (chunk 18), the acceptance loop, and the documents chain | Cross-cutting rules, operations, security, performance, testing, the frontend, the references and the traceability index, the Specs, the flag index; the independent review | The open items (acceptance loop) |

The order is fixed: 1, then 2, then 3. A part is never skipped, and a later part is never started before the earlier one is complete. Chunk 19 is outside the three parts: it is written only on request, after chunk 18 is cleared (SKILL.md step 7c). `decision-log.md` is a companion file, not a chunk, and belongs to no part: the stack approval, where it runs, creates it before part 1 (it is written with part 1's first files), every part reads it first, and every correction, answer, and delegation of a stop or of the acceptance loop is added to it as `decision-log.md` § Companion file rules says.

Inside part 2, write the service files first, then 05, 06, 07, 08 in that order. A file that links a block of another service's file (a `Participates in` block links its owner's block) is written after that file; a saga orchestrator is therefore written before its participants. Chunk 06 needs the owners' § 7.7 error rows (the service files) and the chunk 03a rows (part 1).

Inside part 3, keep this order: 09 to 14, the back-fill of earlier parts, 16 (its § 19.9 index reads the 04 files, 13, and 14), step 6a, 17, then 15 last, because the back-fill, step 6a, and the Specs can raise flags and chunk 15 indexes them all. Then the Confidence Flag Summary counts in chunk 00 follow chunk 15.

**09 comes after the service files.** Chunk 04 lists 09 in its `DEPENDS_ON` because a service file cites a 09 rule (the idempotency TTL, the outbox delivery rules, the `use_case` attribute) by section number and never restates it. In `parts` the cited rule is written later, so a part 1 or part 2 chunk cites a part 3 chunk as inline code (`09-cross-cutting.md` § 12.2), never as a link, and part 3 checks every such citation (§ Exit checklists, part 3).

---

## What every part does

1. **Read first.** Read the source material (the SDD and the BRD parts the trace cites, the code path, an imported eco-system file: the master's **Source** line names them), the project files again (SKILL.md principle 17: they can change between parts), `decision-log.md`, and every chunk written by earlier parts, in full. In a new session this is mandatory: nothing is remembered from the earlier run. Then compare the SDD and BRD versions with the master's **Upstream** line (SKILL.md step 3c). If one is newer, make the one offer that step describes, limited to the chunks written so far: accepted, it is a refresh of those chunks before the part starts; declined, the written chunks keep their content, the part is written on the current sources, the Upstream line names the version each part reflects, and the handoff repeats it.
2. **Write the part's chunks** with the normal rules (templates, reference + delta to the SDD, one fact one home, the confidence flags, the Mermaid policy, the pattern rules, no invented names or versions). For from-code, hybrid, and partial runs, § Directions other than from-sdd says what the agents do in each part.
3. **Back-fill earlier parts** (parts 2 and 3 only). Later work changes earlier chunks. Apply the change and list it in the part summary:
   - New implementation terms go into the Glossary (01 § 4), new assumptions into § 3 (next free A-NN). Scope never changes in a back-fill (§ The checkpoint says how a scope correction is made).
   - 02 § 5.4 (the cross-service dependency view) follows the calls and events the service files, 06, and 07 actually write.
   - 03 § 6.1 follows the service and module names and the ports and adapters the service files write.
   - 03a: a library a service file or a part 3 chunk builds with, and that § 6.5.1 has no row for, gets a row with the Status the § 6.5.1 Status rule gives it (`Proposed - needs approval` unless SDD §6 or the project instruction file names the library), and no question is asked; the summary lists it with the route SKILL.md step 3a, item 1 names. Each departure a service file makes from a § 6.5.1 row or a § 6.5.2 rule gets a § 6.5.3 row with its reason, as the § 6.5.3 Convention says, and the service file cites the row.
   - Part 3 fills the Screens field of every traceability line in the 04 files from 14 § 17.3 (`Not applicable - no UI` when chunk 14 is omitted), and corrects a 04, 05, 06, 07, or 08 line that a part 3 chunk shows to be wrong: an index that 12 § 15.3 needs goes into 05 § 8.3, a platform rule that a service file cites goes into 09, and a service-specific deviation goes into the service file with its reason.
   - The master's chunk rows and per-service rows follow what was written (§ The progress record).
4. **Keep IDs stable.** Once the user has seen an ID, it is never renumbered and never reused: A-NN, OI-NN, the section numbers of the templates, the file names of the service files, and every ID the LLD cites from the SDD or a BRD (the keyed `KEY/UC-NN`, `API-NN`, topic and event names, role names, permission tokens). A service file is renamed only when the user asks, and every link to it is then repointed in the same pass.
5. **Run the part's exit checklist** (below). Fix what fails; flag what cannot be fixed with `> Confirm:` or `> TODO: <best-guess> - verify`.
6. **Update the progress record** (below).
7. **Present the part summary and STOP** (parts 1 and 2). Part 3 goes on as § End of part 3 says.

### Directions other than from-sdd

| Direction | In each part |
|---|---|
| from-sdd | Reads the SDD and, through it, the BRD parts the trace cites. No agents. |
| from-code | Dispatches the agents of SKILL.md step 5 in every part, limited to what the part writes: Phase 1 with its asks unchanged, Phase 2 only for the blocks whose `target` is a chunk of the part (`code-extraction.md` § Phase 2). A fact an earlier part wrote is read from its chunk, never from the earlier dispatch. |
| hybrid | The same, and each part runs its from-sdd pass, its from-code pass, and the section-by-section diff (`hybrid-drift.md`) for its own chunks. A manifest value that differs from SDD §6 is a `⚠ drift` row in part 1 (SKILL.md step 3a, item 9). |
| partial | The same as from-code for the services that have code, and the placeholder of `transform-detection.md` § Partial-code resolution for the rest, in part 2. |

The agents' output lives only in the conversation, and a part can start in a new session. A part that starts in the same session as an earlier dispatch may reuse that Phase 1 report; a part in a new session dispatches again.

### The checkpoint (end of part 1 and end of part 2)

Show a short part summary:

- The files written, and the chunks of earlier parts that were changed by the back-fill, with the reason.
- Counts. Part 1: services and modules in scope, § 6.3 rows by label, § 6.5.1 rows by Status, Mermaid figures, `> Confirm:` and `> TODO:` flags in this part. Part 2: service files, workflow blocks (traced `KEY/UC-NN` and `### Workflow:`), § 9.1 rows, § 9.6 ports and § 9.2 blocks (with the number that carry proposed values), tables, topics and events, state machines, Mermaid figures, flags in this part, and the result of the API contract checks (found, fixed, flagged). From-code and hybrid: the `⚠ policy` findings by severity, and in hybrid the `⚠ drift`, `🆕 code-only`, and `⛔ sdd-only` markers.
- The upstream state read (the Upstream line), the project files found and used (SKILL.md principle 17), and each conflict one has with a source or a chunk, which is raised as an open item at the review.
- Each § 6.5.1 row still `Proposed - needs approval`, including the rows a back-fill added, with the route that confirms it (SKILL.md step 3a, item 1).
- **What to review now**, from the table above, in two or three lines.
- The next step: "Say 'continue' for part N, or tell me what to change first."

Then **stop and wait**. Do not start the next part in the same turn. Do not start it on silence, on a thank-you, or on a question about something else. Start it only when the user says so ("continue", "next part", "part 2", "go on"), or gives corrections and then asks to continue. The one exception is an answer policy that names part checkpoints (SKILL.md step 7a, Answer policy): it passes this stop, and the next part starts after the summary, in the same turn.

When the user gives corrections: apply them to the existing chunks first, rerun the exit checklist of that part, update the summary, and only then move on if they asked to. Record each decision that settles a question in `decision-log.md` (the Clarification register for an answered question, Delegation history › Direct design instructions for an instruction with no question behind it: `decision-log.md` § Canonical structure); the chunks carry only the resulting design.

**A correction at the end of part 1 changes the scope** (01 § 2.1). The list of service files follows it, and the master's rows. A service taken out of scope keeps its use cases in the trace as `Not in this LLD - owner: [service]` (`sdd-to-lld.md` § Use-case traceability › The index). A service put into scope is written in part 2.

**A correction at the end of part 1 changes the stack** (a § 6.3 or § 6.5.1 row). It is a stack approval change (SKILL.md step 3a, items 4 and 6): record it in the stack approval record, state the new value in 03, 03a, and every chunk already written that names it. An override goes up the documents chain at step 7b, which runs once, in part 3.

**A correction at the end of part 2 changes a contract name or value** (an `API-NN` URI, a permission token, a topic or event name, a payload field). Apply it to 06 or 07 and to every service file that cites it in the same pass, then rerun the API contract checks before the summary. A value that then differs from the SDD is flagged as drift, never kept as a local truth; if the SDD must state it, it goes up at step 7b.

### End of part 3

Part 3 does not end with a checkpoint. After the chunks of part 3 and the back-fill, run the part 3 exit checklist. Then run the rest of the normal workflow in order: the independent reviewer pass (SKILL.md step 7, chunk 18), the acceptance loop (step 7a), the documents chain (step 7b), and the full handoff (step 8). Chunk 19 is not written here: the handoff offers it when chunk 18 is cleared, and it follows only on a request (step 7c). The independent reviewer runs **once**, here, on chunks 00-17. Later updates run the review that SKILL.md step 7 (On an update) sets: a delta review, or the application check of applied pending items.

---

## Exit checklists

An item that names the SDD, the stack approval, the use-case trace, or the Child LLDs row applies only where the direction runs that step (SKILL.md step 3a item 9, step 3b, step 6c). In from-code with no SDD, check the item against the code instead.

**Part 1**

- [ ] Where the direction runs it, the stack approval has run (SKILL.md step 3a, item 9) and its record is in `decision-log.md`. Every § 6.3 row carries a Source label from the one list of `chunks/03-architecture.md` § 6.3 (its Convention), and every missing version pin has the one `> TODO:` that SKILL.md step 6b, item 2 describes.
- [ ] 00 holds the direction, the Related SDD, and each Related BRD with its key (or `Not applicable`). The Status row reads `Draft - part 1 of 3`, and its Changes Log has no row yet (the initial row is written when part 3 completes).
- [ ] 01 § 2.1 lists exactly the SDD §13 services and modules the LLD covers (SKILL.md step 3b, Scope), each by its SDD name and slug, and says whether the scope has a UI surface. The glossary links the SDD glossary and adds rows only for LLD-specific terms. Every assumption has a source.
- [ ] 02 has the bounded context and the upstream and downstream dependencies of every in-scope service, read from the SDD.
- [ ] 03 § 6.1 names every in-scope service or module in the style the SDD's ADR-01 records. Each § 6.2 row links the SDD §8.6 or §8.7 part it implements (or names §6, §11.3, §19, or §17.X for an SDD written before chunk 05a). § 6.4 operationalises the style without restating it.
- [ ] 03a (unless the LLD has none): every § 6.5.1 row has a Status by the Status rule of the chunk, and a row that adds a dependency SDD §6 does not name reads `Proposed - needs approval`. Every § 6.5.2 rule has a source. § 6.5.3 holds only a departure a source states.
- [ ] Hybrid and partial: every § 6.3 or § 6.5.1 value that a manifest states differently from SDD §6 is a `⚠ drift` row, unless an override covers it.
- [ ] The master lists a row for every in-scope service file as plain text followed by `Pending (part 2)`, and its Project Type line is filled.
- [ ] Every Mermaid block parses and has its Summary line.
- [ ] No decision-process narration in content chunks (search for `The user selected/answered/chose`, `remains partial`, `option A/B` as narrative, `walkthrough`). The Q&A behind a decision is in `decision-log.md`.

**Part 2**

- [ ] Every in-scope service or module has its `04-implementation/<slug>.md` at the bar of `lld-quality.md`, and no file exists without a 01 § 2.1 row. A module of a modular monolith has its ports and adapters, and its in-process contracts and events go to 06 § 9.6 and 07 § 10.6.
- [ ] Every active in-scope §7.3 use case has exactly one `### KEY/UC-NN: Title` block in its owner's § 7.8, with its traceability line. The Screens field reads `Pending (part 3)` when chunk 14 will exist and `Not applicable - no UI` when it will not. Every entry point §7.3 lists carries `@UseCase`.
- [ ] The API contract checks have run (`sdd-to-lld.md` § API contract blocks › Checks): checks 1 to 6, over every 04 file and 06. They ask no question: the mechanical fixes are made and the rest is flagged, as SKILL.md step 6a item 2 says. The summary gives the result. The one-time offer to complete a legacy § 9.2 (SKILL.md step 8) belongs to a targeted update's handoff, never to a part.
- [ ] 06 and 07 match the SDD character for character: `API-NN` names and URIs, permission tokens, topic and event names. Every consumed event has its producer, and the producers' and consumers' lists agree from both sides.
- [ ] 05 derives its tables and indexes from the SDD §17.X Tables Design, every table in § 8.2 has its Table name, Table purpose, and Column details, every secondary index and unique key on a shared-schema table leads with `tenant_id` (the primary key `id` is exempt), the `**Indexes:**` lines and § 8.3 name the same indexes, and the Flyway plan matches the tables.
- [ ] 08 holds a state machine only for a service that is genuinely stateful with named states.
- [ ] Every service file cites a § 6.5 row instead of restating it, and every departure has its § 6.5.3 row, as the § 6.5.3 Convention says.
- [ ] Every citation of a part 3 chunk is inline code (a section reference), not a link.
- [ ] The back-fill of 01, 02, 03, and 03a is done and listed.
- [ ] Every Mermaid block parses and has its Summary line. No decision-process narration in content chunks.
- [ ] From-code, hybrid, and partial: the `⚠ policy` findings, the drift markers, and the placeholders are in place, as the direction's rules say.

**Part 3**

- [ ] Chunks 09 to 14 are at the bar of `lld-quality.md`. The derived views that SKILL.md principle 13 allows in them (09 § 12.3 instances, 10 § 13.1 and § 13.7, 12 § 15.1) name their source on every row. A light run leaves the detail it names (SKILL.md § Light run) as `> TODO: light-work run - detail before release`.
- [ ] Every citation a part 1 or part 2 chunk makes to a chunk of part 3 resolves: the section exists and states what the citing line needs. A missing platform rule is added to the cited chunk; a service-specific deviation is stated in the service file with its reason.
- [ ] The Screens field of every traceability line is filled from 14 § 17.3, or reads `Not applicable - no UI`. None reads `Pending (part 3)`.
- [ ] Step 6a has run. 16 § 19.1 records the upstream state, and § 19.9 equals SDD §7.3 row for row.
- [ ] 17 holds the Mission, the Tech Stack (equal to § 6.3, with the override notes), the Roadmap, and the Project Type.
- [ ] 15 indexes every flag of chunks 00 to 14, 16, and 17 and, in hybrid, every drift marker; the counts in 00 equal it. The master's links are all real, and 00 reads `Draft`.
- [ ] The Child LLDs row is written (step 6c).
- [ ] Chunk 18 exists, and every item has a decision or is listed as open in the handoff. The key and link check after the last pass has run (SKILL.md step 7).
- [ ] The back-fill of 01, 02, 03, 03a, and 04 to 08 is done and listed. No decision-process narration in content chunks: accepted items are applied as plain design text and their narrative is in `decision-log.md`.

---

## The progress record

Parts mode keeps its state in `[project-slug]-lld-master.md`, so any later session can resume. Write the master in part 1 and update it at the end of every part. The **Generation Progress** section sits after the header blockquotes (`chunks/lld-master.md`).

```markdown
## Generation Progress

**Generation:** parts
**Source:** ../sdd-wallet-management-service/wallet-management-service-sdd-master.md
**Upstream:** SDD v1.2; REFUNDS v1.0 (chunk 14 as of v1.0, chunk 16 Up to date); LOYALTY v1.0 (chunk 16 Pending (BRD 16 not written))

| Part | Chunks | Status | Completed |
|------|--------|--------|-----------|
| 1 | 00, 01, 02, 03, 03a | Complete | 2026-10-27 |
| 2 | 04 (every service file), 05, 06, 07, 08 | Complete | 2026-10-28 |
| 3 | 09-14, 16, 17, 15, 18 | In progress (09-14 written; back-fill next) | - |
```

- A first build given `light` writes `**Generation:** parts, light` (SKILL.md § Light run).
- Write the **Source** line in part 1: the path of every source file (the SDD master or folder, the code path, an imported eco-system file: SKILL.md step 3a, item 5), or "conversation" when there is none. A new session reads the sources from there. If one cannot be found, ask the user for it before writing anything.
- Write the **Upstream** line in part 1: the SDD version and each source BRD version with the state of its chunks 14 and 16, as the run read them. Update it whenever a part's first step re-reads them (§ What every part does, step 1). Chunk 16 § 19.1 takes over this record when it is written in part 3.
- Status is `Pending`, `In progress ([last step done])`, or `Complete`. Parts 2 and 3 have several steps, so record each one as it finishes. Part 2: `04 written`, `05 written`, `06 written`, `07 written`, `08 written`, `API checks done`. Part 3: `09-14 written`, `back-fill done`, `16 written`, `trace reconciled`, `17 written`, `15 written`, `Child LLDs row written`, `18 written`, `acceptance loop done`, `application check done`, `documents chain done`. Part 3 becomes `Complete` when the documents chain has run and the handoff is presented, whether or not the acceptance loop left items for a later request.
- In the master's chunk tables, a chunk that is not written yet is plain text followed by `Pending (part N)`, and a service file not written yet has its row as plain text followed by `Pending (part 2)`. It becomes a link when it is written. The master's header lines that point at 17 read `Pending (part 3)` until 17 is written.
- The Status row of chunk 00 reads `Draft - part N of 3` until part 3 is complete, then `Draft`.
- A first build keeps the version at 1.0 through all three parts: every chunk carries `VERSION: 1.0`, and the Changes Log keeps one initial row, `Chunks: none (initial build)`, dated when part 3 completes. A correction at a stop, the review, the acceptance loop, and answers applied before the handoff belong to the build: they bump nothing (SKILL.md § Output conventions, Versions). After part 3 is complete, any content change follows Versions.
- The Generation Progress section, the Upstream line, and the master's rows are records, not content changes.
- PREV / NEXT footers may point at a chunk that does not exist yet. That is expected until its part is written.
- When part 3 is complete, remove nothing: keep the table with all three parts `Complete`. It is the record of how the LLD was built.

In `whole` runs, **Generation:** reads `whole` and the Part table, Source, and Upstream lines are left out (16 § 19.1 holds the upstream state). The Changes Log's initial row, dated when the run completes, is the record of its completion.

---

## Resuming

When the skill is invoked on a folder whose `[project-slug]-lld-master.md` shows a part that is `Pending` or `In progress`:

1. Say what was found: "Part 1 is complete (2026-10-27). Part 2 is next."
2. Act on what the user asked:
   - The request says to go on ("continue", "next part", "part 2"): start that part.
   - The request is empty (the skill was only invoked): ask "Continue with part N?" and wait (an answer policy that names part checkpoints answers it: SKILL.md step 7a, Answer policy).
   - The request is something else (a change to a written chunk, a question): do that, then name the part that is still waiting. Do not start it.
3. Do not ask the direction or run the intake, the stack approval, or the use-case trace inputs again: the master, 00, and `decision-log.md` hold their answers (SKILL.md principle 17). The direction was asked when the build started.
4. When a part starts, follow "What every part does" from step 1: read the sources (from the **Source** line), `decision-log.md`, and every written chunk first.
5. A part that is `In progress` continues after its last recorded step; a finished step is never redone. In part 3: if chunk 18 exists, the independent reviewer does not run again, and the items still `Open` go through the acceptance loop.
6. Never rewrite a completed part on a resume. Only the back-fill touches it.

**The user asks for a later part while an earlier one is pending.** Explain the order and offer the next pending part. Do not skip.

**The user asks to redo a completed part.** Rewrite that part's chunks, keeping every decision taken since: keep every record of `decision-log.md` unless the user reverses it, and re-apply each Resolution Log entry in chunk 18 that points into the part. Then, for every later part that is already complete: rerun its back-fill and exit checklist (for part 2, rerun the API contract checks; for part 3, rerun step 6a), and tell the user what no longer fits (for example, a service file whose service left the scope, or a § 12.3 row whose caller was renamed). If part 3 was complete, this is a content change: bump the version and add a Changes Log row, update chunk 18 by status only (the delta review of SKILL.md step 7 covers the redone part), and mark chunk 19 `Stale` if it exists (refresh only through SKILL.md step 7c).

**The user switches to `whole` midway.** Write all remaining parts in one run, with no more checkpoints, and record `Generation: parts, completed whole from part N`.

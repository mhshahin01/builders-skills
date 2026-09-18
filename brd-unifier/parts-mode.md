# Generation Option - Parts or Whole

The generation option controls **how much is written before the user looks at it**. It is separate from the output mode (chunks / combined) and from the intent (generate / transform).

| Option | What happens | When |
|---|---|---|
| `parts` (**default**) | The BRD is written in three parts. The skill stops after each part and waits for the user's go-ahead. | CHUNKS mode, generate or transform from a source (SoW, old BRD, loose spec) |
| `whole` | Chunks 00-14 are written in one go, as one run. | When the user asks for it; always in COMBINED mode; always for pure conversions (merge, re-chunk) and targeted updates |

Chunks 15, 16, and 17 are outside both options. They stay locked behind the delivery gate (`delivery-chunks.md`). "Whole" means 00-14.

**How it is chosen**

- Argument: `brd-unifier [chunks|combined] [parts|whole]`, in any order. Examples: `brd-unifier chunks whole`, `brd-unifier whole`, `brd-unifier parts`.
- Words in the request: "all at once", "in one go", "everything now" mean `whole`. "Part by part", "step by step", "let me review as we go" mean `parts`.
- Nothing said: `parts`. Do not ask. Say it in one line before starting: "Generation: parts (default). Say 'whole' to get everything in one go."
- `combined parts` is not available: a combined BRD is always written whole. Say so in one line and continue in `whole`.

---

## The three parts

| Part | Chunks | What it settles | The user reviews |
|---|---|---|---|
| **1** | 00, 01, 02, 03, 04, 05, plus `brd-master.md` | Why the product exists, the business terms, scope, personas, journeys, the list of use cases | Scope (in / out), personas, and the Use Case Summary: names, actors, and whether each use case holds one goal (split or merge now, before the details are written). These drive part 2; changing them later is costly. |
| **2** | every `06*` chunk, then 07 | The detailed use cases and the Users & Use Cases Matrix | Main flows, alternate and exception flows, business rules with numbers, acceptance criteria, who may do what |
| **3** | 08, 09, 10, 11, 12, then 13, then 14 | Integrations, reports, NFRs, UI/UX, appendix; the independent review; the to-do | The open items (acceptance loop) and the to-do |

The order is fixed: 1, then 2, then 3. A part is never skipped, and a later part is never started before the earlier one is complete. Intake (SKILL.md step 3) happens once, before part 1.

---

## What every part does

1. **Read first.** Read the source material and every chunk written by earlier parts, in full. In a new session this is mandatory: nothing is remembered from the earlier run.
2. **Write the part's chunks** with the normal rules (templates, business language, plain language, Mermaid policy, no gated diagrams).
3. **Back-fill earlier parts** (parts 2 and 3 only). Later work changes earlier chunks. Apply the change and list it in the part summary:
   - New business terms and acronyms go into the Glossary (02). New assumptions and dependencies go into 02. New domain rules go into 03.
   - The Use Case Summary (05) follows the detailed use cases: if part 2 renamed, split, merged, or re-assigned a use case, the use case wins and 05 is updated. If this touches the personas or the scope (04), say so clearly: it is a change to what the user approved in part 1.
   - The user has seen the UC IDs in part 1, so they are never renumbered and never reused (`use-case-quality.md` § UC numbering and IDs). A use case added or split off in part 2 takes the next free ID and is listed under its persona in the summary; IDs inside a persona group can then be out of order, which is expected. A use case merged away keeps its row, marked `Merged into UC-NN`; a removed one keeps its row, marked `Removed: [reason]`.
   - Figures index, Tables index, and Table of Contents in chunk 00.
4. **Plain-language pass** on the chunks written or changed in this part (`writing-style.md`).
5. **Run the part's exit checklist** (below). Fix what fails; flag what cannot be fixed with `[NEEDS CLARIFICATION: ...]`.
6. **Update the progress record** (below).
7. **Present the part summary and STOP** (parts 1 and 2). Part 3 goes on as § End of part 3 says.

### The checkpoint (end of part 1 and end of part 2)

Show a short part summary:

- The files written, and the chunks of earlier parts that were changed by the back-fill, with the reason.
- Counts: personas, use cases, Mermaid figures, `[NEEDS CLARIFICATION: ...]` markers in this part.
- **What to review now**, from the table above, in two or three lines.
- The next step: "Say 'continue' for part N, or tell me what to change first."

Then **stop and wait**. Do not start the next part in the same turn. Do not start it on silence, on a thank-you, or on a question about something else. Start it only when the user says so ("continue", "next part", "part 2", "go on"), or gives corrections and then asks to continue.

When the user gives corrections: apply them to the existing chunks first, rerun the exit checklist of that part, update the summary, and only then move on if they asked to.

**A correction removes a persona.** Every use case whose Primary Actor it was must be reassigned to another persona or removed. If the user did not say which, ask before applying anything (one question per use case, recommendation first), and do not continue until it is answered. Where the persona was only a Supporting Actor, take it out of that use case. Its matrix column goes too (part 2).

### End of part 3

Part 3 does not end with a checkpoint. After chunks 08-12 and the back-fill, run the plain-language pass and the part 3 exit checklist. Then run the rest of the normal workflow in order: the independent reviewer pass (SKILL.md step 7, chunk 13), the open items acceptance loop (step 8), the to-do (step 8a, chunk 14), the final `brd-master.md` and chunk 00, and the full handoff (step 9). The independent reviewer runs **once**, here, on the whole BRD.

---

## Exit checklists

**Part 1**

- [ ] Every persona in 04 has a journey in 05 and at least one use case in the Use Case Summary.
- [ ] Every use case in the summary has a Primary Actor that is a persona from 04, and sits inside In Scope.
- [ ] Every In Scope item is covered by at least one use case, or is named as an integration, a report, or an NFR to be written in part 3.
- [ ] Every Business Objective in 01 is served by at least one use case.
- [ ] UC IDs are sequential across the whole summary when first assigned. (After the user has seen them they are never renumbered, so gaps and out-of-order IDs appear later. That is expected.)
- [ ] The Glossary covers every business term and acronym used in 00-05.
- [ ] The Summarized Workflow parses and has its Summary line. No new use-case diagram was drawn (gated); a diagram kept from a transformed source is captioned `Pre-existing - re-verify at step 5`.
- [ ] No decision-process narration in content chunks (search for `Resolved on`, `The user selected/answered`, `remains partial`, `option A/B` as narrative). Settled rules appear as plain requirements; the decision story is in `decision-log.md` with working rule-home links.

**Part 2**

- [ ] Every use case in the summary has a detailed block with all nine sub-sections, at the bar of `use-case-quality.md`.
- [ ] The matrix (07) is derived from the actor fields by the SKILL.md step 6a rules, checked both ways.
- [ ] The Use Case Summary (05) matches the detailed headings and actors after the back-fill.
- [ ] No new use-case flowchart was drawn (gated to to-do step 5).
- [ ] No decision-process narration in content chunks (search for `Resolved on`, `The user selected/answered`, `remains partial`, `option A/B` as narrative). Clarifications raised or decided in this part are recorded in `decision-log.md` with working rule-home links.

**Part 3**

- [ ] Every integration (08) and report (09) is used by at least one use case or persona, or is flagged.
- [ ] No NFR measure was invented; a missing measure is a clarification marker.
- [ ] Technical mandates from the source are parked verbatim in 12, not spread in the body.
- [ ] The back-fill of 00, 02, 03, and 05 is done.
- [ ] No decision-process narration in content chunks (search for `Resolved on`, `The user selected/answered`, `remains partial`, `option A/B` as narrative). Accepted open items are applied as plain requirement text; their narrative is in `decision-log.md` with working rule-home links.

---

## The progress record

Parts mode keeps its state in `brd-master.md`, so any later session can resume. Write `brd-master.md` in part 1 and update it at the end of every part.

```markdown
## Generation Progress

**Generation:** parts
**Source:** ../SoW-v1.2.md

| Part | Chunks | Status | Completed |
|------|--------|--------|-----------|
| 1 | 00-05 | Complete | 2026-09-17 |
| 2 | 06a+, 07 | Complete | 2026-09-18 |
| 3 | 08-14 | In progress (13 written; acceptance loop next) | - |
```

- Write the **Source** line in part 1: the path of every source file, or "conversation" when there is none. A new session reads the source from there. If it cannot be found, ask the user for it before writing anything.
- Status is `Pending`, `In progress ([last step done])`, or `Complete`. Part 3 has several steps, so record each one as it finishes: `08-12 written`, `13 written`, `acceptance loop done`. It becomes `Complete` when chunk 14 is written.
- In the master's chunk tables, a chunk that is not written yet is plain text followed by `Pending (part N)`. It becomes a link when it is written.
- Chunk 00 shows `**Status:** Draft - part N of 3` until part 3 is complete, then `Draft`.
- During the first build, the version does not change between parts. The Changes Log keeps one "Initial draft" row, dated when part 3 completes; the acceptance loop in part 3 then adds its own row as usual (SKILL.md step 8). After part 3 is complete, any content change follows `delivery-chunks.md` § Version.
- PREV / NEXT footers may point at a chunk that does not exist yet. That is expected until its part is written.
- When part 3 is complete, remove nothing: keep the table with all three parts `Complete`. It is the record of how the BRD was built.

In `whole` runs the section holds one line: `**Generation:** whole`.

---

## Resuming

When the skill is invoked on a folder whose `brd-master.md` shows a part that is `Pending` or `In progress`:

1. Say what was found: "Part 1 is complete (2026-09-17). Part 2 is next."
2. Act on what the user asked:
   - The request says to go on ("continue", "next part", "part 2"): start that part.
   - The request is empty (the skill was only invoked): ask "Continue with part N?" and wait.
   - The request is something else (a change to a written chunk, a question): do that, then name the part that is still waiting. Do not start it.
3. When a part starts, follow "What every part does" from step 1: read the source (from the **Source** line) and every written chunk first.
4. A part that is `In progress` continues after its last recorded step; a finished step is never redone. In part 3: if chunk 13 exists, the independent reviewer does not run again. Open items still `Open` go through the acceptance loop, then chunk 14 is written.
5. Never rewrite a completed part on a resume. Only the back-fill touches it.

**The user asks for a later part while an earlier one is pending.** Explain the order and offer the next pending part. Do not skip.

**The user asks to redo a completed part.** Rewrite that part's chunks, keeping every decision taken since: re-apply each Resolution Log entry in chunk 13 that points into the part, and keep the diagrams added at to-do step 5 (they are re-verified at step 5). Then, for every later part that is already complete: rerun its back-fill and exit checklist, and tell the user what no longer fits (for example, detailed use cases whose persona was removed). If part 3 was complete, this is a content change: bump the version (`delivery-chunks.md` § Version), update chunk 13 by status only (the independent reviewer runs again only if the user asks), refresh chunk 14 (steps whose inputs changed fall back to `In progress`), and mark chunks 15-17 `Stale` if they exist.

**The user switches to `whole` midway.** Write all remaining parts in one run, with no more checkpoints, and record `Generation: parts, completed whole from part N`.

# Delivery Chunks (14-17)

Four delivery chunks turn the finished BRD into action: what the product manager must close (14), what gets built and in what order (15), how the business accepts it (16), and how it is presented (17).

**Chunk 14 is written on every full generation (in `parts` generation it closes part 3). Chunks 15, 16, and 17 are locked until chunk 14 is fully cleared.** See § The delivery gate.

This file is the rulebook for those four chunks. The skeletons live in `chunks/14-todo.md`, `chunks/15-implementation.md`, `chunks/16-uat-bat-test-cases.md`, `chunks/17-for-ppt.md`.

---

## The four chunks at a glance

| # | File | Purpose | Primary reader | Generated when | In merged / combined BRD | Read by `sdd-unifier` |
|---|---|---|---|---|---|---|
| 14 | `14-todo.md` | Prioritised product-manager checklist: resolve open items, consistency check, grill-me, Figma mockups, use-case diagrams and flowcharts | Product manager | **Every full generation** (in `parts`, at the end of part 3) | **No** - always a separate file | No |
| 15 | `15-implementation.md` | Dependency-ordered implementation plan consolidating every `06*` use case | Implementation agents | **Only when the delivery gate is open** | Yes | Input context only |
| 16 | `16-uat-bat-test-cases.md` | UAT/BAT test cases traced to use cases, requirements, and tasks | Business testers, QA | **Only when the delivery gate is open** | Yes | Input context only |
| 17 | `17-for-ppt.md` | Executive presentation brief plus a series of 30-second use-case videos | Deck and video generating agents | **Only when the delivery gate is open** | **No** - always a separate file | No |

**The order is fixed: 14 -> 15 -> 16 -> 17.** Chunk 14 is written on every full generation, in both modes, after the Open Items acceptance loop (SKILL.md step 8); in `parts` generation that is the end of part 3. Chunks 15, 16, and 17 follow on a later run, once the gate is open. After any of them is written, return to 14 and update its links, `Blocks` column, and Downstream outputs table.

---

## The delivery gate (guardrail for 15, 16, 17)

**Rule.** Chunks 15, 16, and 17 cannot be generated or refreshed until every action item in `14-todo.md` is closed. There is no override, even when the user asks for the chunks directly.

**The gate is open only when all of this is true**

| # | Condition | How to verify (never trust the status cell alone) |
|---|---|---|
| G1 | To-do step 1 is `Complete`: every `TD-NN` row is `Resolved` | No `TD-NN` row is `Open` or `Deferred`. No `OI-NN` in chunk 13 is `Open` or `Deferred` (closed means `Accepted - applied`, `Adjusted - applied`, or `Rejected`). No `[NEEDS CLARIFICATION: ...]` marker is left in chunks 00-12. |
| G2 | To-do step 2 is `Complete`, and none of its findings is still waiting | A check run is recorded after the last content change to chunks 00-13 (§ Refresh triggers, Version). Every `CF-NN` has a disposition, and none is still waiting on a decision: each is `Corrected`, `No change`, or was raised as an item that is now `Resolved`. (A finding deferred for clarification lets step 2 complete, but its `TD-NN` keeps step 1, and so the gate, open.) |
| G3 | To-do step 3 is `Complete` | The product manager confirmed the grill-me session (date recorded) and every decision from it is applied. |
| G4 | To-do step 4 is `Complete` | Every mockup row is `Approved`, the product manager confirmed the review (date recorded), and the Figma links are in the use cases' UI/UX sections. |
| G5 | To-do step 5 is `Complete` | The use-case diagrams are in chunk 05, every qualifying use case has its flowchart, every other use case has a skip reason, all Mermaid blocks parse, and the consistency check was rerun after the diagrams. |

**`Deferred` does not count as closed.** A deferred item keeps the gate shut until a decision is taken. `Resolved` means a decision is recorded and applied to the BRD. It does not mean the outside world has delivered: a pending dependency is resolved when the product manager decides how the BRD treats it (confirmed, replaced, or taken out of scope).

**When the gate is shut** (the normal state on a first run, and always while `14-todo.md` does not exist yet)

1. Do not write 15, 16, or 17. Do not write drafts, previews, outlines, or "provisional" versions of them either, **in a file or in the chat**. `Provisional (TD-NN)` is a status for a gap found while writing with the gate open; it is never a way to write early.
2. In `14-todo.md`, set their rows in Downstream outputs to `Locked` and name the failed conditions.
3. Tell the user exactly what is still open: the steps that are not `Complete` and the `TD-NN`, `OI-NN`, `CF-NN`, markers, or mockup rows behind each. Name the next action.
4. If the user asks to generate them anyway, explain the rule and repeat the list. Do not generate. The product manager's own confirmation is valid evidence for steps 3 and 4 (record it with the date); it is not a way around steps 1, 2, or 5.

**When the gate is open**

1. Re-verify G1-G5 against the files, then write 15.
2. **Check the gate again before 16, and again before 17.** If writing a chunk exposed a gap (a missing prerequisite, an expected result the BRD does not state), record it as a `TD-NN`, label only the affected content `Provisional (TD-NN)`, finish the chunk in hand, and stop. The next chunk waits until the new items are `Resolved`.
3. Update `14-todo.md` last.

**Re-lock.** If chunks 00-13 change, or a new `TD-NN`, `OI-NN`, `CF-NN`, or clarification marker appears after 15-17 were generated, mark the affected outputs `Stale` in Downstream outputs. They are not refreshed until the gate is open again.

**`Provisional` or `Stale`?** `Provisional (TD-NN)`: the item was raised by writing that very chunk, so the chunk names the gap inside itself. `Stale`: anything that happened after the chunk was finished (a BRD edit, a new item from any other source). A chunk can be both; then it shows `Stale`.

**Where they are written**

| Mode | 15 and 16 | 14 and 17 |
|---|---|---|
| CHUNKS | Files in `./brd-[project-slug]/` | Files in `./brd-[project-slug]/` |
| COMBINED | Sections `# Implementation Plan` and `# UAT/BAT Test Cases` at the end of the combined file, after `# Open Items & Clarifications` | Files `./brd-[project-slug]/14-todo.md` and `./brd-[project-slug]/17-for-ppt.md` (create the folder if it does not exist). Their links to the BRD target `../BRD-[ProjectName]-v[X.X].md` plus the section name. |

In COMBINED mode, the two sections are added to the combined file only when the gate opens; until then the file ends with `# Open Items & Clarifications`.

**Opt-out.** Chunk 14 is generated on every full generation. Skip it only when the user explicitly says so ("BRD only", "skip the to-do"), and say in the handoff that it was skipped.

---

## Ground rules (all four chunks)

1. **Derived, never authoritative.** The BRD body (chunks 00-13) is the single home of requirements. Delivery chunks cite the body by identifier and file link (`UC-NN`, `NFR-NN`, `OI-NN`, chunk file + section). They never restate a flow, rule, or acceptance criterion in full and never introduce a requirement. When body and delivery chunk disagree, the body wins and the delivery chunk is refreshed.
2. **Never fill a gap.** If drafting a delivery chunk exposes a missing requirement, decision, acceptance criterion, or expected result, it becomes a `TD-NN` row in chunk 14 (plus an `OI-NN` entry in chunk 13 when it is a business ambiguity). It never becomes invented content.
3. **Four labels, always distinguishable.**

   | Label | Meaning | How it is written |
   |---|---|---|
   | Confirmed requirement | Stated in the BRD body and not touched by an unresolved item | Plain text with its source reference |
   | Assumption | From chunk 02, or made while deriving | Prefixed `Assumption:` with its source or reason |
   | Recommendation | The skill's suggestion, not a decision | Prefixed `Recommendation:` |
   | Unresolved question | Open `OI-NN`, inline `[NEEDS CLARIFICATION: ...]`, open `CF-NN` | Referenced by its `TD-NN` row |

4. **Status line on 15, 16, 17.** Each opens with one status: `Up to date` (written with the gate open and nothing pending), `Provisional (TD-NN)` (a gap found while writing it; only the affected task, test case, slide, or video carries the label and the TD reference), or `Stale` (the BRD or the to-do changed after it was written; locked until the gate is open again).
5. **Generation is not completion.** Writing chunk 14 completes none of its steps. A checklist step is `Complete` only when its Evidence cell names what was checked, when, and by whom. The gate reads evidence, not status words.
6. **Stable identifiers.** This is the one list; SKILL.md points here.

   | ID | Names | Lives in |
   |---|---|---|
   | `TD-NN` | To-do register row | 14 |
   | `CF-NN` | Consistency finding | 14 |
   | `MK-NN` | Mockup, only where chunk 11 or the use cases define no screen ID | 14 |
   | `TASK-NN` | Implementation task | 15 |
   | `DP-NN` | Dependency problem | 15 |
   | `TC-[AREA]-NN` | Test case; `[AREA]` is a 3-letter code such as `ACC` | 16 |
   | `SL-NN` | Slide | 17 |
   | `V-NN`, `V-NN-Cn` | Video, clip | 17 |

   None is ever renumbered on a refresh. New entries take the next free number. A retired entry stays, with `(Retired)` after its name or title and the reason; retired test cases do not count in the total.
7. **Language.** Business language stays the rule: no product technology names, protocols, or frameworks. Delivery-tool names appear only where a chunk hands work to that tool: grill-me, Figma, Miro (chunk 14); deck-generating agent / PPTX and Higgsfield (chunk 17).
8. **Links.** Relative file links plus the identifier in the link text, e.g. `[06a / UC-04](./06a-use-cases-branch-manager.md)`.
9. **Plain language.** `writing-style.md` applies to all four chunks: short sentences, common words, active voice, the exact number instead of a vague word. Task titles, test-case names, slide key messages, and voiceover lines are where plain wording matters most.

### Citing the source precisely

| Reference | Points at |
|---|---|
| `UC-04 step 5` | Main Flow step 5 |
| `UC-04 A1`, `UC-04 E2` | Alternate flow A1, exception flow E2 |
| `UC-04 BR-2` | 2nd bullet of Business Rules & Constraints |
| `UC-04 AC-3` | 3rd bullet of Acceptance Criteria |
| `NFR-03` | NFR row in chunk 10 |
| `08 / [Partner]`, `09 / [Report]`, `11 / [Standard]` | Integration row, report row, UI/UX standard |
| `02 / Assumption 4`, `02 / Dependency "[name]"` | Numbered assumption, dependency row |

`BR-n` and `AC-n` are positional (bullet order at the stated BRD version). Count every top-level bullet of the list, in order, including a bullet that only holds a clarification marker or a source reference; sub-bullets are not counted. Always write them with a short label (`UC-04 AC-3: customer is notified`), so a shifted bullet is easy to spot. When a use case gains a rule or a criterion, add it at the end of its list. The consistency check re-verifies these references after any use-case edit.

---

## Chunk 14 - `14-todo.md`

A prioritised, living checklist. Five steps, in this fixed order. Every step carries **Status**, **Required inputs**, **Expected output**, **Completion criteria**, and **Evidence**.

**Step status values:** `Not started` / `In progress` / `Blocked` (say by what) / `Pending gate` (step 5 only, while G1-G4 do not hold) / `Complete` (Evidence mandatory). In the step 5 tables, a use case planned as a skip is `Skipped` from the start; every other row is `Pending gate` until the gate opens, then `Drafted`, `Provisional (TD-NN)`, or `Final`.

**Owner and priority cells are never guessed.** The Owner of a to-do row is the person the user named, otherwise the BRD author from chunk 00, written as `Recommendation: [name]`. Mockup priority follows the use case's place on the main journey: `P1` when it sits on the Summarized Workflow of chunk 05, otherwise `P2`.

**Who may set `Complete`**

| Step | The skill may set `Complete` when | Otherwise |
|---|---|---|
| 1 | Every `TD-NN` row is `Resolved`, each with its pointer (Resolution Log row or Changes Log entry). A `Deferred` row keeps the step open. | Stays `In progress` |
| 2 | A check run is recorded and every `CF-NN` has a disposition. A finding deferred for clarification stays visible as a `TD-NN`, so it keeps step 1 open. | Stays `In progress` |
| 3 | The product manager confirms the grill-me session happened and hands back the decision list, and the decisions are applied | The skill cannot observe a session it did not run; never infer it |
| 4 | The product manager confirms mockup review and the Figma links are recorded in each use case's UI/UX section | Never inferred from a link alone |
| 5 | The skill executed it and the completion criteria below hold | - |

### Step 1 - Resolve open items and clarifications

Consolidate into one **Open items register** (`TD-NN` rows). One row per **distinct question**: when the same question sits in several places (the same clarification marker repeated in ten use cases), it is one row whose Source lists every location. The row links to the source and states the decision needed. It does not copy the item's options or recommended answer (those live in chunk 13).

| Kind | Source |
|---|---|
| Open question | `OI-NN` with Status `Open` (chunk 13); every inline `[NEEDS CLARIFICATION: ...]` marker (cite chunk + section or UC ID) |
| Assumption to validate | Chunk 02 assumptions the source did not state as confirmed fact and whose falsity would change a use-case flow, acceptance criterion, or NFR measure; Dependencies whose Status is anything other than confirmed (pending, to be verified, confirmed for one party only). Constraints are not assumptions: leave them out. Leave out items that only concern a later phase, unless they change a use case of this release. |
| Pending decision | `OI-NN` with Status `Deferred`; findings from step 2 awaiting a decision; a Reviewer Note in chunk 13 that asks for a decision (cite `13 / Reviewer Notes`) |

**Priority** is derived from what the item blocks, never from guessed business value:

- **P1** - a Main Flow step or an acceptance criterion cannot be built or tested as written, or the source says the point must be settled before build starts (or, once chunk 15 exists, a task is blocked).
- **P2** - affects alternate/exception flows, an NFR measure, an integration, or a report.
- **P3** - wording, presentation, or a design choice that changes no flow (a key colour, a missing wireframe).

Touching an acceptance criterion is not enough for P1: the criterion must be impossible to build or test without the answer.

Sort P1 first. TD status: `Open` / `Resolved` (with pointer) / `Deferred` (with rationale; stays visible **and keeps the delivery gate shut**). Every priority blocks the gate, P3 included. The `Blocks` column names use cases, NFRs, and chunk sections; add `TASK-NN`, `TC-...`, slides, and `V-NN` only once 15-17 exist.

### Step 2 - Consistency check across all BRD chunks

Run the check during generation and record it as Run 1; rerun it whenever chunks 00-13 change. Prefer a cleared-context subagent (same independence reasoning as SKILL.md step 7); run inline only if the Agent tool is unavailable. The subagent is read-only and returns `CF-NN` rows; the main context applies corrections and records the dispositions.

Run 1 happens before the open items are resolved, so it leaves step 2 `In progress`. Step 2 is `Complete` only when the latest run is dated after the last content change to chunks 00-13 and every finding has a disposition.

| Check | What to look for |
|---|---|
| C1 Conflicting requirements | Same subject, different rule, number, or actor across chunks (use-case rule vs NFR measure vs chunk 03 definition) |
| C2 Terminology | A term or persona named or used differently from the Glossary (02), chunk 03, or chunk 04 |
| C3 Scope | A use case outside In Scope; an In Scope item with no use case or requirement; an Out of Scope item a use case implements |
| C4 Duplicated requirements | The same fact stated in two homes |
| C5 Missing requirements | An objective (01) with no use case; a persona with no use case; an integration (08) or report (09) nothing uses; a precondition nothing delivers |
| C6 Broken references | Links, identifiers, figure/table indices, PREV/NEXT footers, master index rows. A link or footer that points at a chunk shown as `Locked` (15-17) or `Pending (part N)` is expected, not a finding. |
| C7 Use case vs acceptance criteria | A criterion that contradicts the flows or rules; an A/E flow with no criterion; a criterion testing behaviour the flows do not describe |
| C8 Derived views | Use Case Summary (05) vs use-case headings and actors; matrix (07) vs actor fields (SKILL.md step 6a) |
| C9 Diagrams vs narrative | Only after step 5: every diagram element traces to the narrative, and every documented branch appears |
| C10 Delivery chunks vs body | Run once 15-17 exist: coverage, references, provisional labels |

Record every finding as a `CF-NN` row: check, affected chunks and identifiers, finding, impact, recommended correction or decision needed, disposition, rechecked. When one check finds the same problem many times (for example, forty alternate flows with no acceptance criterion), record **one** row that lists every affected identifier. When the check finds something an existing `OI-NN` already covers, point the finding at that item; do not raise a duplicate, and do not correct the text while the item is open.

**Dispositions**

- `Corrected ([where], [date])` - only for **confirmed corrections**: the user confirmed it, or it is mechanical with an unambiguous source of truth already fixed by this skill (broken link or filename; a cross-reference whose title identifies the intended target; a matrix cell contradicting the use-case actor fields, where the use case wins (if the actor field itself looks wrong, raise an open item instead); a Use Case Summary title differing from the use-case heading, where the heading wins; a spelling or casing variant of a Glossary term, where the Glossary wins; a wrong count, figure number, table number, or index row, where the counted content wins). Apply the correction to every affected chunk, add a Changes Log entry, and list it in the handoff.
- `Open item raised: OI-NN / TD-NN` - a business ambiguity: there are options and someone must **choose**. Write the `OI-NN` in chunk 13 using its full schema (Options, Recommended Answer, Why) and add the `TD-NN` row. Never resolve a business ambiguity silently.
- `Deferred for clarification: TD-NN` - a missing **fact**: nobody has to choose, someone has to tell (a number, a name, a date). A `TD-NN` row only, no `OI-NN`. It stays visible as an open item and keeps the delivery gate shut until it is `Resolved`.
- `No change ([who], [why])` - accepted as is. The user sets it. The skill sets it alone only when, on a second look, the finding is not an inconsistency (`No change (skill, [why])`).

After corrections, **recheck** and add a run row. Unresolved findings go into the step 3 handoff.

### Step 3 - Finalise requirements with the grill-me skill

- List what goes into the session: open `TD-NN` rows (P1 first), unresolved `CF-NN` findings, and requirements worth stress-testing even though nothing is flagged (use cases carrying a Business Objective, acceptance criteria with numbers, NFR measures).
- Provide the ready-to-use handoff prompt from the skeleton with real chunk references filled in.
- **Recommend** `/grill-me`. It is a user-invoked skill: never claim it was executed, never set this step beyond `Not started` without the product manager's confirmation.
- When decisions come back: apply confirmed decisions to the affected chunks through the step 8 mechanics (OI status, Resolution Log, Changes Log), rerun step 2, and revisit steps 1-2 if new questions or inconsistencies appear.

### Step 4 - Generate mockups in Figma

- One coverage row per screen or flow: the use cases it serves, the requirements and decisions it must honour, the states to cover, priority, status, Figma link. Use the screen identifiers already in chunk 11 or the use cases' UI/UX sections; assign `MK-NN` only where none exist.
- **Expected coverage:** every use case with an actor-facing interaction has at least one screen; every Main Flow step the actor can observe is visible on a screen; every A/E flow with a user-visible state has that state; role differences follow the matrix (07); global standards follow chunk 11 (loading, empty, and error states included).
- **Review criteria:** each frame names its `UC-NN`; flows are walkable end to end; states are covered; visibility matches the matrix; chunk 11 standards hold; no mockup shows behaviour absent from the BRD (if one does, raise a `TD-NN`, do not absorb it).
- Rows touching an unresolved item are marked `Blocked by TD-NN`.

### Step 5 - Use-case diagrams and flowcharts

Tracked here, **drawn in chunks 05 and `06*`**. See § The gated diagram step below. At first generation, fill both tracking tables (diagram plan for chunk 05; one row per use case with step count, decision points, and `Required` / `Skip - linear` / `Skip - fewer than 3 steps`) and leave every status `Pending gate`.

Miro is an optional later step for collaboration or presentation, and only on explicit request (`mermaid-diagrams.md` § Miro on demand).

---

## Chunk 15 - `15-implementation.md`

**Written only when the delivery gate is open** (§ The delivery gate). By then the requirements are final, the mockups are approved, and the flowcharts exist: use them.

One actionable plan consolidating every `06*` use case, written so another agent knows what to do, in what order, and how completion is assessed. The plan orders the WHAT; the HOW belongs to the SDD and LLD (link them when they exist).

**Deriving tasks**

- Default: one `Use-case delivery` task per use case. Consolidate use cases that cannot be delivered or released independently; split a use case only when one flow is large enough to stand alone. Every `06*` use case must appear in the **Use-case coverage** table with at least one task.
- `Foundation` and `Cross-cutting` tasks need evidence: a precondition or domain concept (03) shared by two or more use cases, an integration (08) or report (09) used by two or more, access control from the matrix (07), a global UI/UX standard (11), or a cross-cutting NFR (10). Cite the evidence. No tasks the BRD does not imply (no environment, tooling, or technology setup; that is SDD/LLD territory).
- Duplicate work across use cases is consolidated into one task that names every use case it serves.

**Dependencies and order**

- A dependency needs evidence too: a Precondition that another use case or task delivers, something one use case creates and another manages, an include/extend relationship, a shared foundation task. Cite it.
- A precondition that describes a state reached **by using the product** ("the eSIM is suspended", "the supplier is onboarded") is a dependency on the use case that produces that state. It is not a missing prerequisite. A missing prerequisite is a state that nothing in the BRD can produce.
- Before declaring a circular dependency, try a split along the dependency: if UC-A needs only steps 1-4 of UC-B, make those steps their own task. Declare a cycle only when no split breaks it.
- Order tasks topologically. **Document order is execution order**: no task appears before a task it depends on. Group tasks into **waves**; tasks in the same wave have no dependency path between them and can run in parallel. Start with tasks that have no unmet dependencies.
- On refresh, new tasks take the next `TASK-NN` but are placed where the order requires. IDs are labels, not positions.

**Dependency problems are flagged, never sequenced** (`DP-NN` rows)

| Type | Meaning | Handling |
|---|---|---|
| Circular dependency | Tasks that require each other | List the cycle with its evidence; keep those tasks out of the waves; add a `Recommendation:` for breaking the cycle and a `TD-NN` for the decision |
| Missing prerequisite | A precondition nothing in the BRD delivers | `DP-NN` + `TD-NN`; dependent tasks marked `Blocked` |
| Blocker | A gap found while deriving the plan that blocks a task's Main Flow | New `TD-NN`; task marked `Blocked` or `Provisional (TD-NN)` |

Every dependency problem raises a `TD-NN`, so it shuts the gate again: finish chunk 15, do not start 16, and report what must be decided. The Dependency problems table has a `Status` column (`Open` / `Resolved`).

**`Blocked` or `Provisional`?** `Blocked`: the task's Main Flow cannot be delivered without the answer; it must not be started. `Provisional (TD-NN)`: the task can start; only the part named by the TD is unsettled. A task that depends, directly or through other tasks, on a `Blocked` or not-sequenced task is `Blocked (waits for TASK-NN)` and leaves the waves too. Not-sequenced task blocks are written after the last wave, under a `### Not sequenced` heading, with `Wave` set to `Not sequenced`.

**Every task carries:** Task ID and title; objective and scope (in / out); type; wave; source use-case and requirement references; dependencies by task ID or `None`; tasks it can run in parallel with; status basis (`Confirmed`, `Provisional (TD-NN)`, or `Blocked (...)`); expected deliverables; completion criteria grounded in the source (each cites `UC-NN AC-n`, a rule, an NFR, or a standard, with a short label instead of the restated text); assumptions, open questions, and blockers.

Use the latest narratives and diagrams. When chunks 05 or `06*` change, refresh the affected tasks (see § Refresh triggers).

---

## Chunk 16 - `16-uat-bat-test-cases.md`

**Written only when the delivery gate is open**, and only after chunk 15 was written without raising a new open item.

**Reference.** The structure, terminology, level of detail, and formatting come from the owner's reference file, `PricePulse/brd-pricepulse/uat-bat-test-cases.md`, encoded in the skeleton `chunks/16-uat-bat-test-cases.md`. Follow the skeleton exactly. If the project holds a newer reference the user points to, read it first.

**UAT and BAT, exactly as the reference uses them. Do not infer any other meaning.**

- The file is **one** business-level acceptance suite titled "UAT/BAT Test Cases". There are no separate UAT and BAT sections.
- `(BAT observation)` is used the way the reference uses it, and for nothing else: at the end of the **TC Example** of an NFR acceptance case that is judged over the UAT/BAT period rather than by one scripted check. The reference has three: an availability log kept across the period, tracking a repair from failure to recovery, and an agreed restore drill.
- The closing line is `Exit criteria (BAT sign-off)`: the business sign-off gate.
- Technical test cases (API contracts, data schemas, performance harnesses) are owned by the SDD test plan, not this file.

**Format**

- Header comment, Owner / Prepared / Baseline / Design reference line, "How to use this document", "Test environment and data prerequisites" (`P1`, `P2`, ...), numbered feature-area sections, Traceability Matrix, Execution summary, Exit criteria.
- Section heading: `## N. [Feature area] ([UC-NN, screen IDs, NFR-NN])`. A feature area is a group of cases a tester runs together because they share a screen or a goal. It may cover several use cases, or none (the reference has a dashboard section). Order the sections the way a tester walks the product: access first, then the main journey of chunk 05, then administration, then cross-cutting UI/UX standards, then NFR acceptance.
- Table columns, in this order: `TC ID | TC Name | TC Description | TC Example | Success Criteria | Related UC | Related Task | Testing Result | Testing Comment`. `Related Task` is the one added column, needed to trace each case to chunk 15. `Testing Result` and `Testing Comment` stay empty at generation.
- `Related UC` names the use case or NFR and, in brackets, what the case proves: `UC-04 (E1, AC-3)`, `UC-07 (BR-2)`, `NFR-03`. Several references are allowed.
- `TC ID` = `TC-[AREA]-NN`. Normally one 3-letter code per section; a section may hold a second code for a distinct sub-area, as the reference does (`NFR` and `LOG`). `TC Description` starts with "Verify". `TC Example` is a concrete action with realistic data and names the prerequisite it needs, as the reference does: "(P4)". `Success Criteria` states the observable outcome in business terms.
- Phased scope uses a tag at the end of the TC Name (the reference uses `(D2)`). Define every tag in the header SCOPE NOTE **and** in the visible `Scope note` line, because the header comment is stripped on merge.

**Exit criteria.** The critical-path sections are those whose use cases carry a Business Objective or sit on the Summarized Workflow of chunk 05. Write the list as a `Recommendation:` for the product manager to confirm; do not present it as decided.

**Level of detail.** Match the reference: about 3 to 12 cases per use case, one line per cell, concrete data in the example, one observable outcome per case. Read the reference file itself when it is reachable (`PricePulse/brd-pricepulse/uat-bat-test-cases.md` in the owner's eSIM workspace); the skeleton carries its structure when it is not.

**Using chunk 15.** Chunk 15 gives each case its `Related Task`, and it gives the execution order: a section can run once every task in its `Related Task` column is complete, so the suite is executed wave by wave. A case whose task is `Blocked` or not sequenced is a **blocked scenario**: list it under Provisional and blocked scenarios with its `DP-NN` / `TD-NN`. (This is not the `Blocked` testing result, which a tester sets during execution.)

**Coverage per use case** (expected behaviour comes from the approved requirements and use cases; chunk 15 adds coverage, dependencies, and sequencing)

| Scenario type | Derived from |
|---|---|
| Positive | Main Flow; every acceptance criterion is proven by at least one case. One case may prove several criteria and flows: list them all in `Related UC` instead of writing a near-copy. |
| Alternative | Every A-flow |
| Negative | Every E-flow; validation failures; every matrix `-` cell that matters (access refused) |
| Boundary | Every numeric or time-based business rule: at, below, and above the limit |
| Business acceptance | NFR business measures (10), reports (09), integrations as the user experiences them (08), UI/UX standards (11), `(BAT observation)` cases |

The flowcharts exist by now (gate condition G5). Cross-check every one: each decision branch and each terminal outcome has at least one case. A mismatch is a coverage gap or a `CF-NN` finding, never a silently added expectation.

**Unresolved expectations.** The gate guarantees the known items are resolved, so this only happens when writing the suite exposes a new gap. Raise a `TD-NN` (it shuts the gate for chunk 17). If an expected result cannot be finalised: add `(Provisional)` to the TC Name, state the currently documented expectation followed by `Pending TD-NN`, or `Cannot be finalised - pending TD-NN` when nothing is documented. List every such case in **Provisional and blocked scenarios**. Never invent an expected result.

**Coverage gaps** are explicit: a use case, flow, rule, or NFR with no case is listed in **Coverage gaps** with the reason and its `TD-NN`. Always state the counts that were checked: Main Flows, alternate flows, exception flows, acceptance criteria, numeric rules, and NFRs, and how many of each have no case. `Total test cases` equals the actual number of TC rows, retired rows excluded: count them.

**Legacy file.** If an unnumbered `uat-bat-test-cases.md` exists in the BRD folder, do not overwrite or delete it. Regenerate the suite as `16-uat-bat-test-cases.md` in the same folder, using the legacy file as input: keep its TC IDs and any filled Testing Result / Testing Comment cells. Where a legacy case disagrees with the BRD, the BRD wins and the difference is recorded as a `CF-NN`. Tell the user the legacy file can be retired.

---

## Chunk 17 - `17-for-ppt.md`

**Written only when the delivery gate is open**, and only after chunks 15 and 16 were written without raising a new open item.

Two clearly separated sections, both consistent with the latest confirmed requirements and flows. Summarise the SoW when one was the source; when none exists, say so and summarise scope from chunks 01 and 04. The brief may cite the SoW directly for facts the BRD leaves out on purpose (deliverables list, timeline, milestones), naming the SoW section. Never commercial terms.

**Audience, purpose, and length** come from the user. When the user has not said, write them as `Recommendation:` and ask in the handoff. Plan one video per representative use case, typically 3 to 6.

### A. Executive presentation brief

Input for a deck-generating agent. A suggested slide sequence; every slide has an ID (`SL-NN`), a **title**, one **key message**, 3-5 concise **talking points**, a **suggested visual** (cite the figure, mockup, or table when it exists), **sources**, and a **status** (`Confirmed` / `Provisional (TD-NN)`).

Must cover: business problem, objectives, and intended value; scope and key deliverables; major user journeys and representative use cases; short demonstrations of key use cases (actor, trigger, main interaction, outcome); material assumptions, dependencies, and unresolved decisions. With the gate open, the known decisions are already taken: the decisions slide lists the key decisions from the Resolution Log, plus any `TD-NN` raised while writing this brief.

Choose representative use cases by evidence, and state the reason: they carry a Business Objective, cover each primary persona at least once, or sit on the main journey in chunk 05. Do not rank by guessed importance.

### B. Series of 30-second use-case videos

A coherent series; each video tells one focused use-case story and lasts **exactly 30 seconds**.

Per video: title, audience, objective, source use-case references; a timed storyboard; voiceover, on-screen text, and visual direction per scene; one generation prompt per scene or clip; editing and assembly instructions. One **Series continuity guide** covers characters, setting, visual style, and transitions across all clips.

| Rule | Why |
|---|---|
| Scene durations are whole seconds and **sum to 30**. Show the total row. | The total is verified before presenting |
| Voiceover: at most 70 words per video, and no scene above about 2.5 words per second. Show the word count. Count a hyphenated word as one word and a number as it is spoken ("30" is one word, "24/7" is three). | Keeps narration speakable in the time |
| On-screen text: 7 words or fewer per scene, added in the edit, never requested from the video model | Generated text is unreliable |
| Product screens come only from the approved mockups (to-do step 4, approved before this chunk can exist), used as reference images or composited in the edit. Never ask the model to invent a product screen. | Invented screens misrepresent the product |
| The prompts are written for **Higgsfield**. "Compatible" means three things only: one plain-language prompt per clip, one clip per generation, and an optional reference image per clip. Verify these at generation time; where one does not hold, composite in the edit instead. | Keeps the prompts usable without claiming features |
| Generation prompts are plain natural language, self-contained per clip (subject, action, setting, camera, lighting, style, mood), and repeat the continuity phrases verbatim | A video model does not remember earlier clips |
| Keep **Generation prompts** and **Editing and assembly** in separate sub-sections | Different tools, different people |
| No tool parameters, flags, negative-prompt syntax, model names, or claims about what the generator can do. State the clip length in whole seconds with the note "verify the chosen model's supported clip lengths at generation time; generate the next longer supported length and trim". | Supported lengths and features differ per model and change over time |
| Characters are described by persona and appearance, not given invented names or titles beyond the persona. A system actor (an automated process) is never a character: show it through its effect on a screen or on a person. | Personas are requirements; names are not |

---

## The gated diagram step (todo step 5)

**Gate.** Begin only after steps 1-4 are `Complete` with evidence: verify conditions G1-G4 of § The delivery gate against the files. If asked for the diagrams while the gate is unmet: list what is missing and stop. The product manager's explicit confirmation is valid evidence for steps 3 and 4 (record it with the date); steps 1 and 2 are verified in the files. Never generate on an unconfirmed gate, and there is no override. (The Summarized Workflow in chunk 05 is not gated; it is part of normal generation.)

**What is drawn, and where**

| Destination | Diagram | Rule |
|---|---|---|
| Chunk 05, new section `## Use Case Diagrams` after the Use Case Summary | Use-case diagram(s): actors, use cases, system boundary, relationships | One overview diagram if it fits about 30 lines; otherwise one per persona in chunk-05 order. Every `UC-NN` appears in at least one diagram. |
| Chunks `06*`, new sub-section `### Flowchart` directly after `### Alternate & Exception Flows` of the use case | One flowchart per qualifying use case: main flow, decision points, alternate paths, exception paths as documented | **Required** when the use case has 3 or more Main Flow steps **and** at least one decision point (an A-flow, an E-flow, or a business rule that changes the path). **Skipped** when it has fewer than 3 steps or is linear; the skip reason is recorded in the todo tracking table and nothing is added to the chunk. |

Notation and syntax rules: `mermaid-diagrams.md` § Use-case diagrams and § Use-case flowcharts.

**Discipline**

- The narrative is the source of truth; the diagram is a derived view. Every node and edge traces to a step, flow, rule, or actor field. Every documented A/E flow appears.
- Keep existing identifiers: use-case IDs in node labels, step numbers in step nodes, `A1` / `E1` on branch edges.
- Stay consistent with the finalised requirements and the approved mockups.
- **Do not invent behaviour to close a gap** (for example an alternate flow that never says where it rejoins). Record a `TD-NN`, mark that diagram `Provisional` in the tracking table, and finalise it after the answer.
- An exception the narrative does not tie to a step starts from its own start node (for example "At any time before the decision"). Never pick a step for it.
- Every diagram is a numbered figure with the mandatory **Summary** line and a Figures index row in chunk 00. New figures take the next free number; existing figures are never renumbered.
- Bump the BRD version and add a Changes Log row. Rerun the consistency check (C9 included). If chunks 15-17 already exist, mark them `Stale`; they are refreshed once the gate is open again.

**Diagrams that already exist.** A transformed source, or a BRD written before this rule, may already hold use-case diagrams or flowcharts. Keep them; never delete source content. List each in the step 5 tracking tables as `Pre-existing - re-verify at step 5`, and re-verify it against the narrative when step 5 runs. The rule is that no **new** use-case diagram or flowchart is drawn before the gate.

**Completion criteria for step 5:** chunk 05 contains the applicable use-case diagrams; every qualifying `06*` use case has its flowchart and every other use case has a recorded skip reason; all Mermaid blocks parse; the updated chunks pass the consistency check.

---

## Refresh triggers

Later confirmed changes must reach the downstream outputs. IDs stay stable; statuses and links are updated; chunk 14 is always updated last.

**Chunk 14 is refreshed at any time. Chunks 15, 16, and 17 are refreshed only while the delivery gate is open.** A change that reopens the to-do marks them `Stale` instead.

| Change | Chunk 14 (always) | Chunks 15-17 |
|---|---|---|
| An open item is accepted, adjusted, or rejected | TD status, `Blocks`, step status, evidence | Nothing yet if they do not exist. If they exist: refresh what cited the item, once the gate is open. |
| An open item is deferred, or a new one appears | TD row stays or is added; step 1 returns to `In progress` | `Stale` and locked |
| A use case changes (flows, rules, acceptance criteria, actors) | Matrix (step 6a), consistency check rerun, step 5 tracking row; a changed diagrammed use case reopens step 5 | `Stale` until the to-do is clear again, then refresh the affected tasks, test cases and traceability, slides and videos |
| A use case is added or removed | All of the above | As above, plus Use-case coverage (15), Traceability Matrix and totals (16), series overview (17) |
| Scope, NFR, integration, report, or UI/UX standard changes | Consistency check rerun | `Stale`, then refresh the tasks, acceptance cases, and slides citing it |
| Mockups change after approval | Step 4 returns to `In progress` | `Stale`, then refresh visuals and reference inputs in 17 |

**A `Complete` step falls back to `In progress` when its inputs change:** a new `Open` or `Deferred` TD (step 1), any content change to chunks 00-13 after the last check run (step 2), a new decision to confirm (step 3), a decision that changes a screen (step 4), an edit to a diagrammed use case (step 5).

**Version.** Only a **content change** bumps the version: a change to what chunks 00-13 say about the product. It means one minor step per run (1.0 to 1.1), one Changes Log row, and the new VERSION in chunk 00, in `brd-master.md`, and in each chunk that was changed.

These are **not** content changes. They bump nothing, do not reopen step 2, and make nothing `Stale`:

- status and link updates in chunk 14;
- Table of Contents, index, and `brd-master.md` rows for the delivery chunks (chunk 00's Table of Contents lists 14 always, 15-17 once written);
- PREV / NEXT footers;
- an open item that a delivery chunk raises about itself (it reopens step 1 and labels that chunk `Provisional`).

At the start of every run, compare the basis line of 15-17 (`Basis:` in 15 and 17, `Baseline:` in 16) with the current BRD version: an older basis means `Stale`.

User phrases such as "refresh the delivery chunks", "update the todo", "regenerate the implementation plan / test cases / ppt brief" trigger a gate check first. Chunk 14 is refreshed in any case.

---

## Special cases

- **No chunk 13.** A BRD written before the reviewer pass existed has no Open Items chunk. Run SKILL.md steps 7-8 first. If the user declines, say so in step 1 of the to-do and build the register from the inline markers and chunk 02 only.
- **Open items raised after the acceptance loop.** The consistency check and the writing of 15-17 can raise new `OI-NN` entries. Write them in chunk 13 with the full schema, add "(raised by consistency check CF-NN)" or "(raised while writing chunk NN)" to their `Where` field, and walk the user through them with the same acceptance loop (SKILL.md step 8) before anything is applied. Name their count in the handoff.
- **Decisions with no open item.** A grill-me decision that matches no `OI-NN` gets its own `TD-NN` row, status `Resolved`, pointing at the Changes Log entry.
- **Delivery chunks from an earlier version of this skill.** Chunks 15-17 that sit next to a `14-todo.md` with no Delivery gate block were written before the gate existed. Mark them `Stale`; they are refreshed only once the gate is open. In a transform, source material of this kind (test cases, delivery plans, slide decks) goes to the Appendix (12) as reference files: it is input for 15-17 once the gate opens, never 15-17 itself.
- **Collapsed layout.** When chunking.md's low-count rule merged 05 and `06*` into `05-user-journeys-and-use-cases.md`, read "`06*`" in this file as the Detailed Use Cases part of that chunk.

### COMBINED mode adaptations (chunks 14 and 17 as separate files)

- The BRD is one file, `../BRD-[ProjectName]-v[X.X].md`. Every link that would point at a chunk points at that file, with the section name or the identifier in the link text: `[UC-04 (Detailed Use Cases)](../BRD-Refunds-v1.2.md)`.
- There is no `brd-master.md`. The grill-me handoff prompt says "Read ../BRD-[ProjectName]-v[X.X].md first, then 14-todo.md".
- The footer becomes `<!-- BRD: ../BRD-[ProjectName]-v[X.X].md | PREV: none | NEXT: 17-for-ppt.md -->` in 14, and the mirror of it in 17.
- The combined file name carries the version. After every version bump, repoint the links in 14 and 17.
- Inside the combined file, sections 15 and 16 cite use cases and NFRs by identifier in plain text. Only their links to `./brd-[project-slug]/14-todo.md` are file links.

---

## Verification before presenting

Run the first block whenever chunk 14 is written or updated. Run the second block only when 15-17 were written in this run. Record failures as `CF-NN` rows (check C10); fix what is mechanical.

**Whenever chunk 14 is written or updated**

- [ ] Chunk 14 keeps the fixed order: resolve open items -> consistency check -> grill-me -> Figma mockups -> use-case diagrams and flowcharts, with Miro optional afterwards.
- [ ] Every step has Status, Required inputs, Expected output, Completion criteria, Evidence. No step is `Complete` without evidence. Steps 3 and 4 are not `Complete` without the product manager's confirmation.
- [ ] Step 5 is `Pending gate` unless G1-G4 hold. No new use-case diagram or flowchart was drawn in 05 / `06*` before the gate.
- [ ] If step 5 ran: every Mermaid block parses, agrees with its narrative, and has a Summary line and a Figures index row.
- [ ] Every `CF-NN` has traceable references and a disposition; unresolved ones are visible as `TD-NN` / `OI-NN`.
- [ ] CHUNKS mode: `brd-master.md` indexes chunk 14 and lists chunks 15-17 as `Locked` (plain text, no link) until they exist.
- [ ] **Delivery gate:** if any of G1-G5 fails, chunks 15, 16, and 17 were not written or refreshed, no draft or preview of them exists, their Downstream outputs rows say `Locked` (or `Stale`) with the failed conditions, and the handoff lists what is still open.

**Only when 15-17 were written (gate open)**

- [ ] G1-G5 were verified against the files before 15, again before 16, and again before 17.
- [ ] Every `06*` use case appears in the Use-case coverage table of chunk 15.
- [ ] No task appears before its prerequisites; cycles, missing prerequisites, and blockers are in Dependency problems, not in the waves.
- [ ] Every test case traces to a use case or NFR and to a task; Coverage gaps and Provisional scenarios are explicit; the total equals the row count.
- [ ] Chunk 17 has both sections; every storyboard sums to 30 seconds; voiceover word counts are within budget; prompts are separate from editing instructions.
- [ ] Every gap found while writing 15-17 has a `TD-NN`, the affected content is labelled `Provisional (TD-NN)`, and the next chunk was not started.
- [ ] Chunk numbers, filenames, links, PREV/NEXT footers, and `brd-master.md` reflect 13 -> 14 -> 15 -> 16 -> 17, and the master now links the chunks that were written.
- [ ] Chunk 14 was updated last (links, `Blocks`, Downstream outputs).

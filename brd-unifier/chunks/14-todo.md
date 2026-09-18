<!--
CHUNK: 14
TITLE: Product Manager To-Do
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: all BRD chunks (00 through 13); updated again after 15, 16, 17 are produced
PART OF: BRD - [Project Name]
TYPE: Delivery chunk - living checklist
MERGE: Excluded. Never part of the merged or combined BRD. Not an input to sdd-unifier.
PURPOSE: Prioritised checklist guiding the product manager from a drafted BRD to a finalised one, in a fixed order: resolve open items -> consistency check -> grill-me -> Figma mockups -> use-case diagrams and flowcharts.
EVIDENCE RULE: Creating this checklist completes none of its steps. A step is Complete only when its Evidence cell names what was checked, when, and by whom.
DELIVERY GATE: Chunks 15, 16, and 17 cannot be generated or refreshed until all five steps here are Complete with evidence and every to-do item is Resolved. Deferred does not count as closed. There is no override.
RULES: delivery-chunks.md in the brd-unifier skill.
-->

# Product Manager To-Do

> **What this is.** The ordered list of what still has to happen before this BRD can be treated as final, and what each downstream output is waiting for. It is a living checklist: statuses, links, and evidence are updated as work happens.
>
> **What this is not.** It is not a requirements document and not the home of any diagram. Requirements live in chunks 00-13; use-case diagrams and flowcharts are drawn in chunks 05 and 06*.

**Last updated:** [YYYY-MM-DD] | **BRD version:** [X.X] | **Steps complete:** [0] of 5

**Status values:** `Not started` / `In progress` / `Blocked` (by what) / `Pending gate` (step 5, until steps 1-4 are complete) / `Complete` (evidence mandatory). A `Complete` step goes back to `In progress` when its inputs change.

---

## Checklist at a glance

| # | Step | Status | Evidence | Unblocks |
|---|------|--------|----------|----------|
| 1 | Resolve open items and clarifications | [Status] | [None yet, or pointer] | Step 2 |
| 2 | Run a consistency check across all BRD chunks | [Status] | [Run #, date, findings dispositioned] | Step 3 |
| 3 | Finalise requirements with the grill-me skill | [Status] | [PM confirmation + date] | Step 4 |
| 4 | Generate mockups in Figma | [Status] | [Figma links + review confirmation] | Step 5 |
| 5 | Update the use-case chunks with use-case diagrams and flowcharts | Pending gate | [None yet] | The delivery gate: chunks 15, 16, 17 |

## Delivery gate

> Chunks 15, 16, and 17 are **locked** until every row below says `Met`. `Deferred` items do not count as closed. There is no override.

| # | Condition | State | What is still open |
|---|-----------|-------|--------------------|
| G1 | Step 1 complete: every to-do item `Resolved`; no open or deferred item in chunk 13; no clarification marker left in chunks 00-12 | [Met / Not met] | [TD-NN, OI-NN, markers in 06b ...] |
| G2 | Step 2 complete: check rerun after the last BRD change; every finding has a disposition and none is still waiting on a decision | [Met / Not met] | [CF-NN ...; rerun needed] |
| G3 | Step 3 complete: grill-me session confirmed; decisions applied | [Met / Not met] | [...] |
| G4 | Step 4 complete: every mockup approved; review confirmed; Figma links in the use cases | [Met / Not met] | [MK-NN ...] |
| G5 | Step 5 complete: use-case diagrams and flowcharts added; consistency check rerun | [Met / Not met] | [...] |

**Gate:** [Shut / Open] | **Next action:** [The one thing to do next, e.g. "Decide TD-01 to TD-06 (P1), then run /grill-me with the prompt in step 3."]

## Downstream outputs

<!-- State: Locked (gate shut, never generated) / Up to date ([date], BRD v[X.X]) / Provisional (TD-NN: a gap found while writing it) / Stale (the BRD or this to-do changed after it was written; locked until the gate is open again). -->

| Output | File | State | Waiting for |
|--------|------|-------|-------------|
| Implementation plan | 15-implementation.md | [Locked] | [G1, G2, G3, G4, G5] |
| UAT/BAT test cases | 16-uat-bat-test-cases.md | [Locked] | [Gate, then chunk 15 written with no new open item] |
| Presentation and video brief | 17-for-ppt.md | [Locked] | [Gate, then chunks 15 and 16 written with no new open item] |

<!-- Turn the file names into links ([15-implementation.md](./15-implementation.md)) once the files exist. -->

---

## Step 1 - Resolve open items and clarifications

| | |
|---|---|
| **Status** | [Status] |
| **Required inputs** | [13-open-items-and-clarifications.md](./13-open-items-and-clarifications.md); every inline `[NEEDS CLARIFICATION: ...]` marker in chunks 00-12; Assumptions and Dependencies in [02-glossary-assumptions-facts.md](./02-glossary-assumptions-facts.md) |
| **Expected output** | Every row below is `Resolved`: the decision is applied to the BRD, and the Resolution Log and Changes Log are updated |
| **Completion criteria** | Every row is `Resolved`, each pointing at where the decision was applied. No open or deferred item is left in chunk 13. No clarification marker is left in chunks 00-12. A `Deferred` row stays visible and keeps this step, and the delivery gate, open. |
| **Evidence** | [None yet] |

### Open items register

<!-- One row per unresolved question, assumption needing validation, or pending decision. Sorted P1 first. The row links to the source; it does not copy the source's options or recommended answer. Priority: P1 blocks a Main Flow or an acceptance criterion; P2 affects alternate/exception flows, NFR measures, integrations, reports; P3 is wording only. Every priority blocks the delivery gate. Status: Open / Resolved ([where applied]) / Deferred ([why]; still blocks the gate). "Resolved" means a decision is recorded and applied to the BRD. -->

| ID | Priority | Kind | Source (chunk / identifier) | Decision or clarification needed | Blocks | Owner | Status |
|----|----------|------|-----------------------------|----------------------------------|--------|-------|--------|
| TD-01 | P1 | Open question | [13 / OI-03](./13-open-items-and-clarifications.md) | [The decision needed, one sentence] | [UC-04 Main Flow, UC-04 AC-2] | [Name, or "Recommendation: BRD author"] | Open |
| TD-02 | P1 | Open question | [06a / UC-02 step 4](./06a-use-cases-[persona-slug].md) | [The inline clarification, as a question] | [...] | [...] | Open |
| TD-03 | P2 | Assumption to validate | [02 / Assumption 4](./02-glossary-assumptions-facts.md) | [What must be confirmed, and with whom] | [...] | [...] | Open |
| TD-04 | P2 | Pending decision | [13 / OI-07](./13-open-items-and-clarifications.md) (Deferred) | [The decision that was deferred, and what it waits for] | [...] | [...] | Deferred |

---

## Step 2 - Run a consistency check across all BRD chunks

| | |
|---|---|
| **Status** | [Status] |
| **Required inputs** | All BRD chunks 00-13 (and 05 / 06* diagrams once step 5 has run; and 15-17 for check C10) |
| **Expected output** | Every finding recorded below with its affected chunks and identifiers, impact, and a disposition; confirmed corrections applied to every affected chunk; a recheck run recorded |
| **Completion criteria** | The latest check run is dated after the last change to chunks 00-13, and every finding has a documented disposition. Findings deferred for clarification remain visible as open items (TD / OI), which keeps step 1 open. Run 1, made at generation, leaves this step `In progress`. |
| **Evidence** | [None yet] |

**Checks performed:** C1 conflicting requirements, C2 terminology, C3 scope, C4 duplicated requirements, C5 missing requirements, C6 broken references, C7 use cases vs acceptance criteria, C8 derived views (Use Case Summary, matrix), C9 diagrams vs narrative (after step 5), C10 delivery chunks vs body.

### Check runs

| Run | Date | Trigger | Scope | Findings | Still open after run |
|-----|------|---------|-------|----------|----------------------|
| 1 | [YYYY-MM-DD] | Initial generation | 00-13 | [n] | [n] |

### Consistency findings

<!-- Disposition is one of: Corrected ([where], [date]) | Open item raised: OI-NN / TD-NN | Deferred for clarification: TD-NN | No change ([who], [why]). Business ambiguities are never resolved silently: they become open items. -->

| ID | Check | Affected chunks and identifiers | Finding | Impact | Recommended correction or decision needed | Disposition | Rechecked |
|----|-------|---------------------------------|---------|--------|-------------------------------------------|-------------|-----------|
| CF-01 | C7 | [06a / UC-04 AC-2](./06a-use-cases-[persona-slug].md) vs [06a / UC-04 E1](./06a-use-cases-[persona-slug].md) | [What disagrees] | [What goes wrong downstream if left] | Recommendation: [the correction], or the decision needed | [Disposition] | [Run # / -] |

---

## Step 3 - Finalise requirements with the grill-me skill

| | |
|---|---|
| **Status** | Not started |
| **Required inputs** | Open rows of the register above (P1 first); unresolved consistency findings; the requirements listed below |
| **Expected output** | A decision list from the session; confirmed decisions applied to the affected BRD chunks; consistency check rerun |
| **Completion criteria** | The product manager confirms the session took place and hands back the decision list; every confirmed decision is applied and logged; the rerun of step 2 leaves no new undispositioned finding. New questions reopen steps 1-2. |
| **Evidence** | [None yet. Recommended, not executed.] |

**Take into the session**

| What | Items |
|------|-------|
| Open questions and pending decisions | [TD-01, TD-02, ...] |
| Unresolved consistency findings | [CF-NN, ...] |
| Requirements to stress-test even though nothing is flagged | [UC-NN acceptance criteria with numbers, NFR-NN measures, use cases carrying a Business Objective] |

**Ready-to-use handoff prompt** (recommended; run it yourself with `/grill-me`):

```text
/grill-me Finalise the requirements of the [Project Name] BRD v[X.X] in ./brd-[project-slug]/.
Read brd-master.md first, then 14-todo.md.
Grill me in this order:
1. Open questions and pending decisions: [TD-01 (OI-03, 06a / UC-04), TD-02 (06a / UC-02 step 4), ...]
2. Unresolved consistency findings: [CF-01 (06a / UC-04 AC-2 vs E1), ...]
3. Requirements to stress-test: [UC-NN ..., NFR-NN ...]
For every decision I confirm, name the chunk and section it changes.
Do not edit any file during the session. End with a numbered decision list I can hand back to brd-unifier.
```

**After the session:** hand the decision list to brd-unifier. Confirmed decisions are applied to the affected chunks (status, Resolution Log, Changes Log), and step 2 is rerun. Chunks 15-17 still wait for the delivery gate; if they exist, they become `Stale`.

---

## Step 4 - Generate mockups in Figma

| | |
|---|---|
| **Status** | Not started |
| **Required inputs** | Finalised use cases (06*), the matrix ([07](./07-users-use-cases-matrix.md)), UI/UX Expectations ([11](./11-summary-and-uiux.md)), decisions from steps 1-3 |
| **Expected output** | Figma mockups covering the table below, reviewed against the criteria, with links recorded in each use case's UI/UX section |
| **Completion criteria** | Every row is `Approved`; the product manager confirms the review; the Figma links are recorded in the use cases |
| **Evidence** | [None yet] |

### Mockup coverage

<!-- Use the screen identifiers already defined in chunk 11 or the use cases' UI/UX sections; assign MK-NN only where none exist. -->

| Mockup | Screen / flow | Use cases | Requirements and decisions to honour | States to cover | Priority | Status | Figma link |
|--------|---------------|-----------|--------------------------------------|-----------------|----------|--------|-----------|
| MK-01 | [Screen or flow name] | [UC-01, UC-02] | [UC-01 BR-1; 11 / Data Tables; TD-02 once resolved] | [Default, empty, loading, error, role variations] | [P1] | [Not started / Blocked by TD-NN / In review / Approved] | [Link] |

**Expected coverage:** every use case with an actor-facing interaction has at least one screen; every observable Main Flow step is visible on a screen; every alternate or exception flow with a user-visible state has that state; role differences follow the matrix; global standards follow chunk 11.

**Review criteria**

- [ ] Each frame names the use case(s) it serves.
- [ ] Every flow can be walked end to end without a missing screen.
- [ ] Loading, empty, and error states are present where the use cases call for them.
- [ ] What each role sees matches the Users & Use Cases Matrix.
- [ ] Global UI/UX standards in chunk 11 hold on every screen.
- [ ] No mockup shows behaviour the BRD does not describe (if one does, add a TD row; do not absorb it).

---

## Step 5 - Update the use-case chunks with use-case diagrams and flowcharts

| | |
|---|---|
| **Status** | Pending gate |
| **Gate** | Starts only after steps 1-4 are `Complete` with evidence (conditions G1-G4 above, verified in the files). The product manager's confirmation is the evidence for steps 3 and 4. No override. |
| **Required inputs** | Finalised requirements and use-case narratives; approved mockups; this step's tracking tables |
| **Expected output** | Use-case diagrams added to [05-user-journeys-overview.md](./05-user-journeys-overview.md); a flowchart added to every qualifying use case in chunks 06*; consistency check rerun. Completing this step opens the delivery gate for chunks 15, 16, and 17. |
| **Completion criteria** | Chunk 05 contains the applicable use-case diagrams; every qualifying 06* use case has its flowchart and every other use case has a recorded skip reason; all Mermaid blocks parse; the updated chunks pass the consistency check |
| **Evidence** | [None yet] |

The diagrams are updates to chunks 05 and 06*. This file only tracks them. Gaps found while drawing are recorded in the register above and resolved before the affected diagram is finalised; behaviour is never invented to complete a diagram.

### Use-case diagrams (chunk 05)

| Diagram | Actors | Use cases | Relationships documented in the narratives | Status | Figure |
|---------|--------|-----------|--------------------------------------------|--------|--------|
| [Overview, or one per persona] | [Personas and external parties] | [UC-01 ... UC-NN] | [UC-05 includes UC-01 (UC-05 step 2), or None] | Pending gate | - |

### Use-case flowcharts (chunks 06*)

<!-- Required: 3 or more Main Flow steps AND at least one decision point (an alternate flow, an exception flow, or a business rule that changes the path). Otherwise skipped with the reason. Status: Skipped (from the start, for planned skips) / Pending gate / Drafted / Provisional (TD-NN) / Final. A diagram that was already in the source is listed as "Pre-existing - re-verify at step 5". -->

| Use case | Chunk | Main Flow steps | Decision points | Flowchart | Status | Figure |
|----------|-------|-----------------|-----------------|-----------|--------|--------|
| UC-01 | [06a](./06a-use-cases-[persona-slug].md) | [8] | [A1, E1, E2] | Required | Pending gate | - |
| UC-02 | [06a](./06a-use-cases-[persona-slug].md) | [4] | [None] | Skip - linear | Skipped | - |

**Optional, later:** mirror the diagrams to a Miro board for collaboration or presentation. Ask brd-unifier for it explicitly; the inline Mermaid stays authoritative.

<!-- MASTER: brd-master.md | PREV: 13-open-items-and-clarifications.md | NEXT: 15-implementation.md -->

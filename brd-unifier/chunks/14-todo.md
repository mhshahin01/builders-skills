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

**Status values:** Not started / In progress / Blocked (by what) / Pending gate (new or unstarted work while G1-G3 fail) / Complete (evidence required). Reopen only changed inputs; unchanged completed rows keep their evidence while the overall gate pauses new work.

---

## Checklist at a glance

| # | Step | Status | Evidence | Unblocks |
|---|------|--------|----------|----------|
| 1 | Resolve open items and clarifications | [Status] | [None yet, or pointer] | Step 2 |
| 2 | Run a consistency check across all BRD chunks | [Status] | [Run #, date, findings dispositioned] | Step 3 |
| 3 | Finalise requirements with the grill-me skill | [Status] | [PM confirmation + date, or a Product Owner stand-in's label + date] | Steps 4 and 5 |
| 4 | Generate mockups in Figma | [Status] | [Figma links + review and play-through confirmation] | The delivery gate: chunks 15, 16, 17 (with step 5) |
| 5 | Update the use-case chunks with use-case diagrams and flowcharts | Pending gate | [None yet] | The delivery gate: chunks 15, 16, 17 (with step 4) |

## Delivery gate

> Chunks 15, 16, and 17 are **locked** until every row below says `Met`. `Deferred` items do not count as closed. There is no override.

| # | Condition | State | What is still open |
|---|-----------|-------|--------------------|
| G1 | Step 1 complete: every to-do item `Resolved`; no Open, Deferred, or Decided - pending application item in chunk 13; no clarification marker left in chunks 00-12 | [Met / Not met] | [TD-NN, OI-NN, markers in 06b ...] |
| G2 | Step 2 complete: check rerun after the last BRD change; every finding has a disposition and none is still waiting on a decision or its application | [Met / Not met] | [CF-NN ...; rerun needed] |
| G3 | Step 3 complete: grill-me session confirmed; decisions applied | [Met / Not met] | [...] |
| G4 | Step 4 complete: every mockup approved; review/play-through confirmed; links in UC UI/UX or owning no-UC report/requirement section | [Met / Not met] | [MK-NN ...] |
| G5 | Step 5 complete: use-case diagrams and flowcharts added; consistency check rerun | [Met / Not met] | [...] |

**Gate:** [Shut / Open] | **Next action:** [The one thing to do next, e.g. "Decide TD-01 to TD-06 (P1), then run /grill-me with the prompt in step 3."]

## Downstream outputs

<!-- State: Locked (not written yet: it waits for the gate, or for the chunk before it) / Up to date ([date], BRD v[X.X]) / Provisional (TD-NN: a gap found while writing it) / Stale (a change listed in delivery-chunks.md § Refresh triggers came after it was written; locked until the gate is open again). -->

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
| **Completion criteria** | Every row is `Resolved`, each pointing at where the decision was applied. No Open, Deferred, or Decided - pending application item is left in chunk 13. No clarification marker is left in chunks 00-12. A `Deferred` row stays visible and keeps this step incomplete and the delivery gate shut. |
| **Evidence** | [None yet] |

### Open items register

<!-- One row per unresolved question, assumption needing validation, or pending decision. Sorted P1 first. Kind is one of: Open question, Assumption to validate, Pending decision. Source names the chunk and the exact place (for example a section, a UC step or ID, an OI-NN, a CF-NN or DP-NN, an assumption, or a dependency). Blocks names the use cases, NFRs, or chunk sections the row blocks. The row links to the source; it does not copy the source's options or recommended answer. Priority: P1 blocks a Main Flow or an acceptance criterion; P2 affects alternate/exception flows, NFR measures, integrations, reports; P3 is wording only. Every priority blocks the delivery gate. Status: Open / Decided - pending application (a third-run decision: the decision, who decided and the date in the Decision or clarification needed cell; still blocks the gate) / Resolved ([where applied]) / Deferred ([why]; still blocks the gate). "Resolved" means a decision is recorded and applied to the BRD. An assumption is Resolved when its owner confirms it, replaces it, removes its dependent scope, or accepts it conditionally with the owner, condition and consequence recorded; if a flow or expected result is still undecidable, the row stays open. -->

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
| **Required inputs** | All BRD chunks 00-13 (and 05 / 06* diagrams once step 5 has run; chunk 14 itself, and 15-17 once they exist, for check C10) |
| **Expected output** | Every finding recorded below with its affected chunks and identifiers, impact, and a disposition; confirmed corrections applied to every affected chunk; a recheck run recorded |
| **Completion criteria** | The latest full/scoped check follows the final relevant content change, with request/run order and checked revision or change-then-check evidence. Dates alone do not prove same-day order. Every finding has a disposition; pending TD/OI keeps step 1 incomplete. This step can be `Complete` while G2 is still `Not met`: G2 also needs every finding's decision taken and applied. |
| **Evidence** | [None yet] |

**Checks performed:** C1 conflicting requirements, C2 terminology, C3 scope, C4 duplicated requirements, C5 missing requirements, C6 broken references, C7 use cases vs acceptance criteria, C8 derived views (Use Case Summary, matrix), C9 diagrams vs narrative (after step 5), C10 delivery chunks vs body (chunk 14 at every write; 15-17 once they exist).

### Check runs

**Checked content and order:** [Request; last relevant edit/revision; run # that followed it; checker and date. Hashes or explicit edit-then-check order, not date alone.]

<!-- Scope: 00-13 for a full run; for a scoped run, the chunks it checked: those changed since the run before, and the chunks that link to them (delivery-chunks.md § Step 2). -->

<!-- Run 1 starts a new checklist; an existing checklist appends the next free number. At most three runs in one request. Third-run corrections to chunks 00-13 stay pending application until the next request (TD Status Decided - pending application, register above); a mechanical correction that changes only chunk 14 or a companion record is applied at once (delivery-chunks.md § Step 2); a pause does not reset the cap. Trigger names what started the run; for a business review hand-off, the review's date and tracker path (SKILL.md step 10 reads it to take a hand-off once). -->

| Run | Date | Trigger | Scope | Findings | Still open after run |
|-----|------|---------|-------|----------|----------------------|
| 1 | [YYYY-MM-DD] | Initial generation | 00-13 | [n] | [n] |

### Consistency findings

<!-- Disposition is one of: Corrected ([where], [date]) | Open item raised: OI-NN / TD-NN | Deferred for clarification: TD-NN | No change ([who], [why]) | Decided - pending application: TD-NN (a third-run correction that the next request applies). Business ambiguities are never resolved silently: they become open items. -->

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
| **Completion criteria** | The product manager, or a Product Owner stand-in the run's answer policy names, confirms the session took place and hands back the decision list; every confirmed decision is applied and logged; the step 2 reruns that follow (delivery-chunks.md § Step 2) leave no new undispositioned finding. New questions reopen steps 1-2; a new choice that needs the product manager's (or a Product Owner stand-in's) confirmation reopens this step. |
| **Evidence** | [None yet. Recommended, not executed. Once confirmed: who confirmed (the PM, or `Stand-in: Product Owner (<policy>, set by <name>, <date>)`, SKILL.md step 8) and the date.] |

**Take into the session**

| What | Items |
|------|-------|
| Open questions and pending decisions | [TD-01, TD-02, ...] |
| Unresolved consistency findings | [CF-NN, ...] |
| Requirements to stress-test even though nothing is flagged | [UC-NN acceptance criteria with numbers, NFR-NN measures, use cases carrying a Business Objective] |

**Ready-to-use handoff prompt** (recommended; run it yourself with `/grill-me`):

```text
/grill-me Finalise the requirements of the [Project Name] BRD v[X.X] in ./brd-[project-slug]/.
Read [project-slug]-brd-master.md first, then 14-todo.md.
Grill me in this order:
1. Open questions and pending decisions: [TD-01 (OI-03, 06a / UC-04), TD-02 (06a / UC-02 step 4), ...]
2. Unresolved consistency findings: [CF-01 (06a / UC-04 AC-2 vs E1), ...]
3. Requirements to stress-test: [UC-NN ..., NFR-NN ...]
For every decision I confirm, name the chunk and section it changes.
Do not edit any file during the session. End with a numbered decision list I can hand back to brd-unifier.
```

**After the session:** apply new/changed confirmed choices through the decision/OI/TD mechanics and scoped recheck. A no-change confirmation goes only in evidence/history, not a new TD. Third-run choices wait for the next request. Recheck the gate; existing delivery outputs become Stale only when their source meaning changed.

---

## Step 4 - Generate mockups in Figma

| | |
|---|---|
| **Status** | Pending gate |
| **Gate** | Starts only after steps 1-3 are `Complete` with evidence (conditions G1-G3 above, verified in the files). Runs in parallel with step 5; neither waits for the other. The product manager's confirmation, or a Product Owner stand-in's under the run's answer policy, is the evidence for step 3. No override. |
| **Required inputs** | Finalised use cases (06*), the matrix ([07](./07-users-use-cases-matrix.md)), UI/UX Expectations ([11](./11-summary-and-uiux.md)), decisions from steps 1-3, and the project's global UI/UX constitution when one exists (`ui-ux-global-constitution.md`: its token, responsive, mockups and prototypes, and Figma prototypes sections, by name) [Found: path / No UI/UX constitution found; chunk 11 used] |
| **Expected output** | A playable, responsive prototype covering the table below, reviewed against the criteria, with links in each UC UI/UX or owning no-UC report/requirement section |
| **Completion criteria** | Every row is `Approved`; the product manager, or a Product Owner stand-in the run's answer policy names, confirms the review and a dated play-through; the Figma links are in the UC UI/UX or owning no-UC report/requirement section |
| **Evidence** | [None yet. Play-through: date and result once confirmed.] |

**Approval impact:** [For any source change, name affected MK rows and changed actor-visible flow/state/rule/role/content. Record the before/after comparison for retained approvals. A failed overall gate pauses new work without erasing unchanged completed evidence.]

**Standard to follow.** When the project has a constitution, the generating tool or agent reads it before producing any frame; otherwise chunk 11 is the visual standard and the rules below still apply. For Figma, the constitution's Figma prototypes section applies in full; for another tool, its responsive and mockups and prototypes sections apply and the Figma prototype rules are applied in their nearest equivalent. Source and confirmed project rules govern, with conflicts settled by the owner. Deliver confirmed breakpoints only; unstated breakpoints are proposals. P1 rows: every Main Flow playable from the named start frame with no dead ends, every actor-facing control wired. P2 rows: connected to neighbouring frames. States are variants, not duplicate frames. A no-UC screen names its MK and owning report/requirement section.

**Ready-to-use mockup brief** (recommended; run it yourself in the mockup tool or agent):

```text
[With a constitution:] Use ui-ux-global-constitution.md as the shared visual and interaction baseline. Read it before generating any frame: its token, responsive, mockups and prototypes, and Figma prototypes sections.
[Without one:] Use the UI/UX Expectations in 11-summary-and-uiux.md as the visual baseline.
Use the [Project Name] BRD v[X.X] in ./brd-[project-slug]/ for the workflows, fields, permissions and business rules. Read [project-slug]-brd-master.md first, then 14-todo.md.
Create a playable [Figma / tool] prototype covering every row of the Mockup coverage table below, for [target users].
P1 rows: one named start frame, every Main Flow playable with no dead ends and actor-facing controls wired. Deliver only source/owner-confirmed breakpoints from chunk 11.
P2 rows: connected to neighbouring frames, at the source/owner-confirmed breakpoints from chunk 11.
States are component variants. Variables and text styles map to the constitution tokens [or: to the chunk 11 colors]. Label simulated data and demo actions.
Name the UC-NN on each frame, or the MK-NN and owning report/requirement section for a no-UC screen. List unstated behaviour for a decision; do not add it.
Return the share link (view permission, opening on the start frame) and the list of frames per breakpoint.
```

### Mockup coverage

<!-- One row per screen or flow, each with its own MK-NN: the BRD's screen reference. When the source material defined a screen ID, add it in the Screen / flow cell; never invent one. -->

| Mockup | Screen / flow | Use cases | Requirements and decisions to honour | States to cover | Priority | Playable | Breakpoints delivered | Status | Play-through | Figma link |
|--------|---------------|-----------|--------------------------------------|-----------------|----------|----------|-----------------------|--------|--------------|-----------|
| MK-01 | [Screen or flow name; the source's screen ID only if the source defined one] | [UC-01, UC-02] | [UC-01 BR-1; 11 / Data Tables; TD-02 once resolved] | [Default, empty, loading, error, role variations] | [P1] | [Y / N] | [Source/owner-confirmed breakpoints] | [Pending gate / Not started / In progress / Blocked by TD-NN / In review / Approved] | [Confirmed by PM or a named stand-in, date, result] | [Link] |

**Expected coverage:** every actor-facing UC has a screen; every observable flow/state appears; roles follow the matrix and standards follow chunk 11. P1 rows are fully interactive, P2 rows connected. All rows use source/owner-confirmed breakpoints, not a priority-implied minimum.

**Review criteria**

- [ ] Each frame names its UC, or its MK and owning report/requirement section when no UC exists.
- [ ] Every flow can be walked end to end without a missing screen, and played in play mode from the named start frame with no dead ends.
- [ ] Every actor-facing control on a P1 screen is wired (navigation, overlays, drawers, dialogs, tabs, filters, form validation and error paths, destructive-action confirmation).
- [ ] Loading, empty, and error states are present where the use cases call for them, as variants rather than duplicate frames.
- [ ] Frames exist for every source/owner-confirmed breakpoint in chunk 11; no unstated tablet minimum was added.
- [ ] What each role sees matches the Users & Use Cases Matrix.
- [ ] Global UI/UX standards in chunk 11 hold on every screen.
- [ ] Variables and text styles map to the constitution's tokens (or, with no constitution, to the chunk 11 colors); no raw hex in components.
- [ ] Simulated data and demo actions are labelled; nothing implies a change to a production system.
- [ ] Contrast, focus order and keyboard order are annotated on key frames.
- [ ] The share link has view permission and opens on the start frame.
- [ ] No mockup shows behaviour the BRD does not describe (if one does, add a TD row; do not absorb it).

---

## Step 5 - Update the use-case chunks with use-case diagrams and flowcharts

| | |
|---|---|
| **Status** | Pending gate |
| **Gate** | Starts only after steps 1-3 are `Complete` with evidence (conditions G1-G3 above, verified in the files). Runs in parallel with step 4; neither waits for the other. The product manager's confirmation, or a Product Owner stand-in's under the run's answer policy, is the evidence for step 3. No override. |
| **Required inputs** | Finalised requirements and use-case narratives; this step's tracking tables |
| **Expected output** | Use-case diagrams added to [05-user-journeys-overview.md](./05-user-journeys-overview.md); a flowchart added to every qualifying use case in chunks 06*; consistency check rerun. Completing this step opens the delivery gate for chunks 15, 16, and 17. |
| **Completion criteria** | Chunk 05 contains the applicable use-case diagrams; every qualifying 06* use case has its flowchart and every other use case has a recorded skip reason; all Mermaid blocks parse; the updated chunks pass the consistency check |
| **Evidence** | [None yet] |

The diagrams are updates to chunks 05 and 06*. This file only tracks them. Gaps found while drawing are recorded in the register above and resolved before the affected diagram is finalised; behaviour is never invented to complete a diagram.

### Use-case diagrams (chunk 05)

| Diagram | Actors | Use cases | Relationships documented in the narratives | Status | Figure |
|---------|--------|-----------|--------------------------------------------|--------|--------|
| [Overview, or one per persona] | [Personas and external parties] | [UC-01 ... UC-NN] | [UC-05 includes UC-01 (UC-05 step 2), or None] | Pending gate | - |

### Use-case flowcharts (chunks 06*)

<!-- Required: 3 or more Main Flow steps AND at least one decision point (an alternate flow, an exception flow, or a business rule that changes the path). Otherwise skipped with the reason. Status: Skipped (from the start, for planned skips) / Pending gate / Not started (gate open, not drawn yet) / Drafted / Provisional (TD-NN) / Final. A diagram that was already in the source is listed as "Pre-existing - re-verify at step 5". -->

| Use case | Chunk | Main Flow steps | Decision points | Flowchart | Status | Figure |
|----------|-------|-----------------|-----------------|-----------|--------|--------|
| UC-01 | [06a](./06a-use-cases-[persona-slug].md) | [8] | [A1, E1, E2] | Required | Pending gate | - |
| UC-02 | [06a](./06a-use-cases-[persona-slug].md) | [4] | [None] | Skip - linear | Skipped | - |

**Optional, later:** mirror the diagrams to a Miro board for collaboration or presentation. Ask brd-unifier for it explicitly; the inline Mermaid stays authoritative.

<!-- MASTER: [project-slug]-brd-master.md | PREV: 13-open-items-and-clarifications.md | NEXT: 15-implementation.md -->

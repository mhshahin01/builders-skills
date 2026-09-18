# Use Case Quality

The User Journeys & Use Cases section is where a BRD earns (or loses) its usefulness to the delivery team. This file captures what a good use-case block looks like so the skill produces genuinely substantive use cases, not template-shaped filler.

**Overriding rule: business language only.** Every part of a use case describes what the actor does and what the system does *for them* — never how the system is built. If a sentence names a technology, protocol, framework, or internal component, it is design content: move it to Appendix § Technical Inputs for the SDD (if it came from the source) or drop it (if it was invented).

**Second overriding rule: plain language.** Use cases are read by business owners, testers, designers, and delivery teams. Write each step, flow, rule, and criterion so all of them understand it on the first read: short sentences, common words, active voice, one action per step, the exact number instead of a vague word. See `writing-style.md`.

> Heavy: "Upon validation of the submitted request, the system shall facilitate notification of the relevant stakeholders."
> Plain: "The system checks the request. It then notifies the operator and the customer."

## The use-case block structure

Every UC block has these sub-sections in this order (per the template):

1. **Actor & Goal** (header table) — Primary Actor, Supporting Actors, Goal, Trigger.
2. **Why** — business value.
3. **Preconditions** — what must be true before step 1.
4. **Main Flow** — numbered detailed steps.
5. **Alternate & Exception Flows** — branches and failures.
6. **Business Rules & Constraints** — rules, limits, conditions.
7. **Acceptance Criteria** — testable conditions.
8. **Future Enhancements** — near-term follow-ups.
9. **UI/UX** — wireframe reference.

One more sub-section is added later, never at first generation: **Flowchart**, placed directly after Alternate & Exception Flows, at step 5 of the product-manager checklist (`14-todo.md`) once steps 1-4 are confirmed complete. See § Flowchart below.

Each sub-section has a quality bar. The tests below help you recognise whether you've met that bar.

## Actor & Goal — the header

**Good:** A named persona from chunk 04, a one-sentence goal an executive would recognise, and a concrete business trigger.

> Example: Primary Actor: Branch Manager. Goal: Approve or reject a refund request raised by an operator. Trigger: An operator submits a refund above their own approval limit.

**Bad:**
- "User" as the actor. (Which persona? The matrix in chunk 07 cannot be built from "User".)
- A goal that describes a screen ("Open the refund approval page") instead of an outcome.

**Test:** Can you place this UC in the Users & Use Cases Matrix from the header alone? If the actor or function is unclear, rewrite.

## Why — the business value

**Good:** Connects the use case to a Business Objective or a specific business pain. References the Problem Statement / Background where relevant.

> Example: "Refunds above operator limits are today emailed to managers and tracked in a spreadsheet; approvals take up to 3 days and are untraceable. In-product approval removes the delay and gives an audit trail."

**Bad:**
- "To improve user experience." (Whose? In what way? Measurable how?)
- "Industry best practice." (Not a rationale. Why do *we* need it?)
- A mirror of the Goal.

**Test:** If the user reads the `Why` and asks "so what?", the `Why` hasn't done its job.

## Main Flow — the detailed steps

This is where the use case is won or lost. The Main Flow is the contract between the BRD and the delivery team.

**Good:** Numbered steps alternating actor action and system response, in the order they happen, each step observable by the actor. A non-trivial use case is typically 6–15 steps.

> Example:
> 1. The Branch Manager opens the pending approvals list.
> 2. The system shows all refund requests awaiting the manager's decision, newest first.
> 3. The Branch Manager opens a request.
> 4. The system shows the original order, the refund amount, the operator's note, and the customer's refund history.
> 5. The Branch Manager approves the request and adds an optional note.
> 6. The system confirms the approval, notifies the operator and the customer, and records the decision in the audit trail.

**Bad:**
- "The system shall support refund approval." (A restated goal, not steps.)
- Steps the actor cannot observe. ("The system publishes an event to the refund topic" — design detail, belongs in the SDD.)
- Technology in a step. ("The manager authenticates via SSO" → "The manager signs in.")
- Three steps for a complex interaction — if the actor makes decisions, show the decision points.

**Test:** Could a QA engineer write test cases directly from the steps without guessing? Could a designer storyboard the screens from them? If each step maps to 1–3 test cases, the flow is well-sized.

## Alternate & Exception Flows — branches and failures

**Good:** Every meaningful branch (A1, A2, …) and failure (E1, E2, …) named, each stating the condition, the step where it branches, and what the actor experiences — in business terms.

> Example:
> - **A1 — Partial approval:** At step 5, the manager reduces the refund amount before approving; the operator is notified of the adjusted amount.
> - **E1 — Request withdrawn:** If the operator withdraws the request before a decision, the system removes it from the list and informs the manager if the request is open on their screen.

**Bad:**
- No exception flows at all. (Every use case that touches money, approvals, or external parties has failure paths.)
- "The system handles errors gracefully." (Which errors? What does the actor see?)
- Technical failure language ("timeout", "5xx", "retry with backoff") — express failures as what the user experiences; the technical handling is SDD content.

**Test:** For each step where an actor decides, or an external party is involved, is there a branch or exception? If not, either it genuinely cannot fail (rare) or a flow is missing.

## Flowchart - the derived view (checklist step 5 only)

**When:** only after to-do steps 1-4 are confirmed complete. **Which use cases:** those with 3 or more Main Flow steps and at least one decision point (an alternate flow, an exception flow, or a business rule that changes the path). A linear use case, or one with fewer than 3 steps, gets no flowchart: the numbered steps are the diagram, and the skip reason is recorded in `14-todo.md`.

**Good:** Starts at the Trigger, ends at each documented outcome. Step nodes name their Main Flow step ("Step 3: ..."); branch edges carry their `A1` / `E1` identifier; an exception the narrative does not tie to a step starts from its own start node; every documented alternate and exception flow appears; decision nodes are phrased as the question the actor or the business rule answers. Followed by the mandatory Summary line. Notation: `mermaid-diagrams.md` § Use-case flowcharts.

**Bad:**
- A path, rejoin point, or outcome the narrative does not state. (The flowchart never adds behaviour. A gap becomes a to-do item and the flowchart stays `Provisional`.)
- A flowchart that drops an exception flow because it made the picture busy.
- Component or system-internal steps the actor cannot observe.
- A flowchart for a linear use case, drawn "for consistency".

**Test:** Walk every path of the flowchart against the narrative, then every flow of the narrative against the flowchart. Any element found on one side only is a defect: fix the narrative first (it is the source of truth), then the flowchart.

## Business Rules & Constraints

**Good:** Specific rules, limits, eligibility conditions, and cut-offs. Ideally, each rule is a testable fact.

> Example:
> - Refunds are only allowed within 30 days of purchase.
> - An operator may not approve their own refund request.
> - Refunds above [amount threshold] require a second approval.

**Bad:**
- "Must be secure." (Vague — and belongs in NFRs anyway.)
- Repetition of the Main Flow.
- Implementation rules ("records are soft-deleted").

**Test:** If the rule were violated, would that be a bug? If yes, good rule. If not — it's aspirational, not a rule.

## Acceptance Criteria

**Good:** Given/When/Then style, each traceable to a step, branch, or rule.

> Example:
> - [ ] Given a pending request above the operator's limit, when the manager approves it, then the operator and customer are notified and the decision appears in the audit trail.

**Bad:**
- Criteria that restate the goal ("Refund approval works").
- Criteria that cannot be verified by using the product.

**Test:** Can each criterion be checked by a tester using only what a user can see and do?

## Future Enhancements — near-term follow-ups

**Good:** Concrete, scoped items that could ship in the release after the base use case.

**Bad:**
- Grand vision statements ("In the future, leverage AI to...").
- Items that are actually out-of-scope-forever.
- An empty list — if there really are no enhancements, write `- None identified at this time.`

**Test:** Could it ship in the sprint after the base UC? If yes, good enhancement. If no, it belongs in the Wishlist.

## UI/UX — wireframe references

**Good:** A Figma link (preferred), a wireframe sketch reference, or (if neither exists) a written reference to the global UI/UX Expectations section plus a note that a wireframe is pending.

**Bad:**
- ASCII wireframes.
- Leaving the section empty.
- "TBD" with no follow-up note.

**Test:** Can a UI designer start from this section and know where to look? If yes, good.

## Use-case granularity — when to split

Split one UC into multiple when any of these is true:

- The Main Flow has two or more genuinely distinct goals ("create and approve" is two use cases if different actors do them).
- The same function behaves significantly differently for two actor types — give each actor their own UC and let the matrix show the split.
- A branch (A-flow) grows to a full flow of its own with its own trigger.

Merge what looks like two UCs into one when:

- The two cannot be performed or released independently.
- One is only ever a step inside the other with no standalone trigger.

## UC numbering and IDs

- Numbering is sequential across the whole BRD: `UC-01`, `UC-02`, … — not per persona chunk.
- If the source (SoW, RFP, prior conversation) already uses a scheme, keep it and note the mapping.
- Never renumber UCs mid-document if the user has seen the prior numbering — renumbering breaks cross-references (including the matrix). If numbering must change, flag it in the changelog.
- An ID is never reused. A use case that disappears keeps its row in the Use Case Summary: `Merged into UC-NN` when it was folded into another, `Removed: [reason]` when it was dropped. Such a row has no detailed block and is left out of the matrix, the diagrams, the to-do step 5 tables, the implementation plan, and the test cases.
- A new use case takes the next free ID, even if that puts IDs out of order inside a persona group.

## Matrix consistency (chunk 07)

The Users & Use Cases Matrix is derived, not authored independently. After writing or changing any UC:

1. Every UC ID appears exactly once as a matrix row; every persona from chunk 04 appears exactly once as a column.
2. A `Yes` cell must correspond to the UC's Primary or Supporting Actor — and vice versa.
3. Conditional access ("own records only", "requires second approval") is a numbered footnote, never a bare `Yes`.
4. A persona column with no `Yes` at all, or a UC row where everyone is allowed everything, is a red flag — recheck the personas and the UC actors.

## What about cross-cutting behaviour?

Audit trails, notifications, data privacy, and similar cross-cutting expectations appear in many use cases. Don't repeat them in every Main Flow. Instead:

1. State the cross-cutting expectation once in `Definitions & Important Details` or `Non-Functional Requirements`.
2. In each UC, name only the UC-specific aspect ("the decision appears in the audit trail" — not "implement comprehensive audit logging").
3. In `Business Rules & Constraints`, reference the cross-cutting section if the bound is UC-relevant ("subject to the retention expectation in NFR-06").

This keeps use cases readable while preserving the linkage.

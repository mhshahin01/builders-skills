<!--
CHUNK: 06a
TITLE: Detailed Use Cases - [Persona Name]
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: 04, 05
PART OF: BRD - [Project Name]
SPLIT RULE: One chunk per persona (06a, 06b, ...), in the same persona order as chunk 05. UC IDs stay sequential across the whole BRD, not per chunk.
LANGUAGE: Business language only. Steps describe what the actor does and what the system does for them - never how the system is built. No technology names, protocols, or implementation terminology.
-->

# Detailed Use Cases - [Persona Name]

All detailed use cases follow this structure:

- **Actor & Goal**: Who performs it, what they want, what triggers it.
- **Why**: The business value of this use case.
- **Preconditions**: What must be true before the use case can start.
- **Main Flow**: Numbered detailed steps - actor action, system response, alternating.
- **Alternate & Exception Flows**: What happens when the path branches or fails, in business terms.
- **Flowchart** (branching use cases only, added once the requirements are final): The main, alternate, and exception paths in one diagram, derived from the narrative.
- **Business Rules & Constraints**: Rules, limits, and conditions that govern the use case.
- **Acceptance Criteria**: Testable conditions that confirm the use case is complete.
- **Future Enhancements**: Low-complexity follow-ups that could ship next.
- **UI/UX**: Wireframes or references to approved Figma designs.

---

## UC-01: [Use Case Title]

| | |
|---|---|
| **Primary Actor** | [Persona from chunk 04] |
| **Supporting Actors** | [Other personas or external business parties involved, or "None"] |
| **Goal** | [What the actor wants to achieve, one sentence] |
| **Trigger** | [The business event that starts this use case] |

### Why

[Business value - why does the business need this use case? Tie it to a Business Objective or a stated pain point.]

### Preconditions

- [Condition that must hold before step 1, e.g., "The customer has a verified account."]
- [Condition 2, or "None."]

### Main Flow

<!-- Detailed steps. Alternate actor action and system response. Each step is observable by the actor - if a step cannot be seen or verified by a user, it is design detail and belongs in the SDD. -->

1. [Actor] [does something, e.g., "requests a refund for a completed order"].
2. The system [responds in business terms, e.g., "shows the order details and the refundable amount"].
3. [Actor] [next action].
4. The system [next response].
5. [Continue until the goal is reached and the actor sees the outcome.]

### Alternate & Exception Flows

- **A1 - [Branching condition, e.g., "Partial refund requested"]:** At step [N], [what happens instead, in business terms].
- **E1 - [Failure condition, e.g., "Refund window has passed"]:** The system informs [Actor] that [what they see and what they can do next].

<!-- FLOWCHART SLOT (to-do step 5 in 14-todo.md). Emit nothing here at first generation, and do not copy this comment into the generated chunk. After to-do steps 1-4 are confirmed complete, add a "### Flowchart" sub-section at this position when the use case has 3 or more Main Flow steps and at least one decision point (an alternate flow, an exception flow, or a business rule that changes the path). Linear use cases and use cases with fewer than 3 steps get no flowchart; the skip reason is recorded in 14-todo.md. The flowchart is a numbered figure: inline Mermaid (flowchart TD) plus the mandatory Summary line. Step nodes name their Main Flow step ("Step 3: ..."), branch edges carry their A1 / E1 identifier, and nothing appears that the narrative does not state. Notation and example: mermaid-diagrams.md § Use-case flowcharts. -->

### Business Rules & Constraints

- [Rule 1, e.g., "Refunds are only allowed within 30 days of purchase." Use "Not applicable." if none.]

### Acceptance Criteria

- [ ] [Testable condition 1 - e.g., "Given X, when Y, then Z"]
- [ ] [Testable condition 2]
- [ ] [Testable condition 3]

### Future Enhancements

- [Enhancement 1, or "- None identified at this time."]

### UI/UX

<!-- Reference wireframes, mockups, or Figma links. Use placeholder references during early drafts. -->

[Figure reference or Figma link]

---

<!-- Repeat the UC block for each use case owned by this persona. -->

<!-- MASTER: brd-master.md | PREV: 05-user-journeys-overview.md | NEXT: 07-users-use-cases-matrix.md -->

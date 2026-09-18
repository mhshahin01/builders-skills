<!--
CHUNK: 17
TITLE: Presentation & Video Brief
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: 01, 02, 04, 05, 06a+ (every use-case chunk), 07, 08, 09, 10, 11, 13, 14, 15
PART OF: BRD - [Project Name]
TYPE: Delivery chunk
GATE: Locked until 14-todo.md is fully cleared (all five steps Complete with evidence, every to-do item Resolved, Deferred does not count, no override) and chunks 15 and 16 were written without raising a new open item. Never written or refreshed while the gate is shut.
MERGE: Excluded. Never part of the merged or combined BRD. Not an input to sdd-unifier.
PURPOSE: (A) a presentation-ready brief of the Statement of Work and the use cases, usable as input to a deck-generating agent; (B) a coherent series of 30-second use-case videos with storyboards and generation prompts.
RULES: delivery-chunks.md in the brd-unifier skill. Nothing here adds or changes a requirement. An item raised while writing this brief is labelled Provisional with its TD reference.
-->

# Presentation & Video Brief

**Brief status:** [Up to date / Provisional (TD-NN) / Stale] | **Basis:** BRD v[X.X] | **Gate verified:** [YYYY-MM-DD] (see [14-todo.md](./14-todo.md)) | **SoW source:** [SoW name and version, or "No SoW provided; scope summarised from chunks 01 and 04"] | **New items raised while writing this brief:** [0, or TD-NN ...]

---

# A. Executive presentation brief

## Deck settings

| | |
|---|---|
| **Audience** | [Who is in the room and what they decide. From the user; otherwise write "Recommendation: ..." and ask in the handoff.] |
| **Purpose** | [What the deck must achieve: approval, alignment, kickoff. From the user; otherwise "Recommendation: ...".] |
| **Length** | [n] slides, about [n] minutes [From the user; otherwise "Recommendation: ...".] |
| **Tone** | [Executive, plain language, no technical terms] |
| **Branding** | [Primary color from 11 / Primary Color, logo, product name. Carry any open clarification as is.] |
| **Language** | [Language(s); right-to-left if chunk 11 requires it] |

## Instructions for the deck-generating agent

- Use each slide title as written. One key message per slide; it becomes the slide's headline statement.
- Talking points become speaker notes and, shortened, on-slide bullets.
- Build each visual from the named source (figure, mockup, or table). Every named source exists once the gate is open; if one is missing, stop and report it.
- Add no claim, number, date, or commitment that is not in this brief.
- Keep every `Provisional` label visible on the slide it applies to.

## Slide sequence

### SL-01 - [Project Name]: [one-line promise]

- **Key message:** [The one sentence the audience should remember]
- **Talking points:**
  - [What the product is, in one line]
  - [Who it is for]
  - [What decision is asked of this audience]
- **Suggested visual:** [Title treatment with product name and brand color]
- **Sources:** [01 / Executive Summary](./01-executive-summary-and-context.md)
- **Status:** Confirmed

### SL-02 - The business problem

- **Key message:** [The pain, in the business's own terms]
- **Talking points:** [3-5 bullets from Background and Challenges; carry numbers verbatim]
- **Suggested visual:** [Current-state sketch, or the challenge evidence table]
- **Sources:** [01 / Background](./01-executive-summary-and-context.md), [02 / Challenges](./02-glossary-assumptions-facts.md)
- **Status:** [Confirmed / Provisional (TD-NN)]

### SL-03 - Objectives and intended value

- **Key message:** [What success looks like]
- **Talking points:** [One bullet per Business Objective, with its measure where the BRD states one]
- **Suggested visual:** [Objective-to-value table]
- **Sources:** [01 / Business Objectives](./01-executive-summary-and-context.md)
- **Status:** [...]

### SL-04 - Scope and key deliverables

- **Key message:** [What is delivered, and what is deliberately not]
- **Talking points:** [In Scope highlights; Out of Scope highlights; deliverables named by the SoW]
- **Suggested visual:** [Two-column In / Out panel]
- **Sources:** [04 / Project Scope](./04-scope-and-personas.md), [SoW section]
- **Status:** [...]

### SL-05 - Who uses it

- **Key message:** [The personas and what each comes to achieve]
- **Talking points:** [One bullet per persona: role and key goal]
- **Suggested visual:** [Persona row; the use-case diagram from chunk 05 (Figure N)]
- **Sources:** [04 / Personas](./04-scope-and-personas.md), [07 matrix](./07-users-use-cases-matrix.md)
- **Status:** [...]

### SL-06 - Major user journeys

- **Key message:** [How the work flows end to end]
- **Talking points:** [One bullet per journey, start to outcome]
- **Suggested visual:** [Summarized Workflow figure from chunk 05]
- **Sources:** [05 / User Journeys](./05-user-journeys-overview.md)
- **Status:** [...]

### SL-07 - Use case in action: [UC-NN Title]

<!-- One slide per representative use case. State why each was chosen: carries a Business Objective, covers a primary persona, or sits on the main journey. -->

- **Key message:** [The outcome this use case gives the actor]
- **Demonstration:**
  - **Actor:** [Persona]
  - **Trigger:** [The business event]
  - **Main interaction:** [3-4 steps, compressed from the Main Flow]
  - **Outcome:** [What the actor leaves with]
- **Talking points:** [Why it matters; the rule or exception worth mentioning]
- **Suggested visual:** [Approved mockup MK-NN or screen ID; the use case's flowchart (Figure N) when it has one]
- **Sources:** [06a / UC-NN](./06a-use-cases-[persona-slug].md)
- **Why this use case:** [Selection reason]
- **Status:** [...]

### SL-[NN] - Assumptions and dependencies

- **Key message:** [What this plan relies on]
- **Talking points:** [Material assumptions and hard dependencies only]
- **Suggested visual:** [Short table: item, owner, status]
- **Sources:** [02 / Assumptions, Dependencies](./02-glossary-assumptions-facts.md)
- **Status:** [...]

### SL-[NN] - Key decisions and open points

- **Key message:** [The decisions that shaped this scope, and anything still open]
- **Talking points:** [The key decisions taken, from the Resolution Log; then any to-do item raised while writing this brief, each as a question. If nothing is open, say so.]
- **Suggested visual:** [Decision list with owner]
- **Sources:** [13 / Resolution Log](./13-open-items-and-clarifications.md), [14 / Open items register](./14-todo.md)
- **Status:** [Confirmed / Provisional (TD-NN)]

### SL-[NN] - Next steps

- **Key message:** [What happens after this meeting]
- **Talking points:** [The delivery sequence at wave level; when acceptance testing starts; what is asked of this audience next]
- **Suggested visual:** [Wave timeline]
- **Sources:** [15 / Execution sequence](./15-implementation.md), [16 / Exit criteria](./16-uat-bat-test-cases.md)
- **Status:** [...]

<!-- Optional slides, only when the BRD has material content for them: Integrations and reporting at a glance (08, 09); Quality expectations (10). -->

---

# B. 30-second use-case video series

## Series overview

<!-- Together the videos summarise the SoW: open on the problem, show each key journey, close on the outcome. -->

| Video | Title | Source use cases | Audience | Objective | Length | Status |
|-------|-------|------------------|----------|-----------|--------|--------|
| V-01 | [Title] | [UC-NN] | [Audience] | [What the viewer should understand or feel] | 30 s | [Confirmed / Provisional (TD-NN)] |
| V-02 | [Title] | [UC-NN, UC-NN] | [...] | [...] | 30 s | [...] |

## Series continuity guide

| Element | Direction |
|---------|-----------|
| **Characters** | [One recurring character per persona, described by persona and appearance: age range, clothing, distinguishing detail. No invented names or job titles beyond the persona.] |
| **Setting** | [The recurring place(s) and time of day] |
| **Visual style** | [Look, palette anchored on the brand color, lighting, camera language, pacing] |
| **Continuity phrases** | [The exact character, setting, and style sentences repeated verbatim at the start of every generation prompt] |
| **Aspect ratio** | [16:9 for presentations / 9:16 for social; one ratio for the whole series] |
| **Product screens** | [Only the approved mockups from to-do step 4, used as reference images or composited in the edit. Never invented by the video model.] |
| **On-screen text** | [Typeface, position, maximum 7 words per scene; added in the edit] |
| **Transitions** | [Cut style within a video; how each video opens and closes so the series feels like one piece] |
| **Audio** | [One narrator voice and register for the series; music mood; level under voiceover] |

## V-01 - [Title]

| | |
|---|---|
| **Audience** | [...] |
| **Objective** | [...] |
| **Source use cases** | [06a / UC-NN](./06a-use-cases-[persona-slug].md) |
| **Story in one line** | [Actor] + [trigger] -> [main interaction] -> [outcome] |
| **Status** | [Confirmed / Provisional (TD-NN)] |

### Storyboard (total 30 s)

| Scene | Time | Duration (s) | Visual direction | Voiceover | On-screen text |
|-------|------|--------------|------------------|-----------|----------------|
| 1 | 0:00-0:05 | 5 | [The situation before: who, where, the trigger] | [Up to 12 words] | [Up to 7 words] |
| 2 | 0:05-0:12 | 7 | [The actor starts the interaction] | [Up to 17 words] | [...] |
| 3 | 0:12-0:20 | 8 | [The key step or decision, shown on the approved screen] | [Up to 20 words] | [...] |
| 4 | 0:20-0:26 | 6 | [The outcome for the actor] | [Up to 15 words] | [...] |
| 5 | 0:26-0:30 | 4 | [Closing frame: product name and one-line promise] | [Up to 6 words, or silence] | [Product name] |
| | **Total** | **30** | | **[n] words (max 70)** | |

### Generation prompts (for Higgsfield, one per clip)

<!-- Plain natural language. Each prompt is self-contained and opens with the continuity phrases. No tool parameters, no model names, no capability claims. Clip length in whole seconds; verify the chosen model's supported clip lengths at generation time, generate the next longer supported length, and trim. -->

| Clip | Scene | Length (s) | Prompt | Reference inputs |
|------|-------|------------|--------|------------------|
| V-01-C1 | 1 | 5 | [Continuity phrases]. [Subject and action]. [Setting]. [Camera movement and framing]. [Lighting and mood]. | [Character reference image; none] |
| V-01-C2 | 2 | 7 | [...] | [...] |
| V-01-C3 | 3 | 8 | [...] | [Approved mockup MK-NN as the screen shown] |
| V-01-C4 | 4 | 6 | [...] | [...] |
| V-01-C5 | 5 | 4 | [...] | [Brand end-card artwork] |

### Editing and assembly

1. Order: C1 -> C2 -> C3 -> C4 -> C5. Trim each clip to its storyboard duration; the cut runs exactly 30 seconds.
2. Voiceover: record or generate the narration as one take per scene; place each take at its scene start.
3. On-screen text: add the storyboard text in the edit, using the series text style.
4. Product screens: composite the approved mockups where a scene shows the product.
5. Transitions, music, and the closing card follow the series continuity guide.
6. Export in the series aspect ratio. Check the final duration is 30 seconds.

<!-- Repeat the V-NN block for every video in the series. -->

<!-- MASTER: brd-master.md | PREV: 16-uat-bat-test-cases.md | NEXT: none -->

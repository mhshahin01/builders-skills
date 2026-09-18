# Decision Log - the decision register companion file

`decision-log.md` is the single home for the decision story behind a BRD: the clarification Q&A, which option was chosen, who decided, when, what was delegated, what was superseded, walkthrough progress, per-decision impact assessments, and part-handoff instructions. The content chunks (00-13) hold only the settled requirements in plain present tense; this register holds why and how they were decided.

**Companion file rules.**

- Lives in `./brd-[project-slug]/`, next to `brd-master.md` (in COMBINED mode, next to `14-todo.md`).
- Created on first use: when the first clarification is raised or decided. Do not write an empty register.
- Linked from `brd-master.md` and from chunk 00's Table of Contents once it exists.
- Never merged into the combined or merged BRD. It is decision history, not requirement text.
- Entries are append-only in spirit: a superseded decision keeps its record, and the later record says it supersedes the earlier one.
- Every register entry that settled a rule carries a `Rule home:` link to the chunk section that now states the rule. The anchor must work.

**What never goes here.** Current-state requirements (those are the chunks), open review items and their statuses (chunk 13), and the to-do checklist (chunk 14). The register records decisions and process; the chunks state the outcome.

---

## Canonical structure

```markdown
<!--
TYPE: Decision Log
PROJECT: [Project Name]
VERSION: [X.X]
PART OF: BRD - [Project Name]
PURPOSE: Single home for the clarification Q&A and decision history; the content chunks hold only the settled requirements.
MAINTENANCE: New decisions are added here, not in the content chunks. The chunks carry only the resulting rules and current-state caveats.
-->

# Decision Log - [Project Name]

## How to read

[One short paragraph: the numbered content chunks hold the current settled requirements; this companion file holds why and how they were decided. Read the chunks for what the product must do; read this file for the decision history behind it.]

## Clarification register

[One line of state, e.g. "All N original clarification questions are resolved on [date]." One entry per question.]

### Q-NN - [short title]

**Question:** [What was asked, in one or two sentences.]

**Decision record, [YYYY-MM-DD]:** [What was decided: the chosen option or custom answer, who decided, and the rationale. A question decided in stages gets one record per stage, dated, newest last; a record that replaces an earlier one says so ("This supersedes ..."). Open remainder is stated here, never in the chunks.]

**Rule home:** [[Section name]](./NN-chunk.md#anchor-of-the-settled-rule)

## Part N clarification register

[One per later part that raised inline clarification markers. One entry per marker.]

### [Marker subject, e.g. "UC-04 retry window"]

**Resolution ([YYYY-MM-DD]):** [What was applied and under whose decision (the user, or a delegation recorded below).]

**Rule home:** [[Section name]](./NN-chunk.md#anchor)

## Walkthrough and delegation history

[How the clarifications were walked through: one-at-a-time questions, batches, and every delegation the user gave (which items were delegated to the recommended option, on what date). Progress notes live here, never in the chunks.]

### Action entries

**[Action], [YYYY-MM-DD]:** [What was done in that session: chunks written, back-fills, markers raised or resolved, what stays pending.]

## Per-decision ecosystem assessments

[The dated per-decision impact-assessment paragraphs, verbatim, one per decision that required one. Chunk 03 keeps the single maintained assessment table as the current state; this section keeps the history.]

### Q-NN - [short title]

[The assessment paragraph as written on that date.]

## Part N handoff record

[The handoff instructions a part applied when writing its chunks (actor restrictions, rules every affected use case must carry). One section per part that needed one. The chunks carry the resulting rules; this section keeps the instructions themselves.]

<!-- MASTER: brd-master.md | COMPANION FILE: decision history; not part of the numbered chunk sequence -->
```

---

## Interaction with the chunks

- Applying a decision updates the chunk text as plain requirements in present tense ("The credential is revealed once, at generation") and removes the inline marker. The chunk never keeps a "resolved on [date]" stamp, an option letter, or a progress note.
- Compact traceability references to stable IDs (Q-NN, UC-NN, OS-NN, D-NN) inside rule text and table cells are allowed in the chunks; storytelling is not.
- Chunk 13 keeps each item's current status line. The narrative behind an accepted item moves here.
- `brd-master.md` keeps the progress, checkpoints, and gates, and links this register; it does not duplicate the Q&A records.

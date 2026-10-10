# Decision Log - the decision register companion file

`decision-log.md` is the single home for the decision story behind a BRD: the clarification Q&A, which option was chosen, who decided, when, what was delegated, what was superseded, walkthrough progress, per-decision impact assessments, part-handoff instructions, settled markers, and the records of business review points. The content chunks (00-13) hold only the settled requirements in plain present tense; this register holds why and how they were decided.

**Companion file rules.**

- Lives in `./brd-[project-slug]/`, next to `[project-slug]-brd-master.md` (in COMBINED mode, next to `14-todo.md`).
- Created on first use, with its first record: a clarification or marker decided at a part checkpoint, in the acceptance loop (SKILL.md step 8), or in a later request, or a business review point applied to this BRD. Do not write an empty register.
- Linked from `[project-slug]-brd-master.md` and from chunk 00's Table of Contents once it exists; in COMBINED mode, from the combined file's Table of Contents as `./brd-[project-slug]/decision-log.md`.
- Never merged into the combined or merged BRD. It is decision history, not requirement text.
- Entries are append-only in spirit: a superseded decision keeps its record, and the later record says it supersedes the earlier one.
- On any rewrite, the VERSION header carries the current parent document version. Decision/process tracking or header-only synchronization does not create a separate content bump.
- Every register entry that settled a rule carries a `Rule home:` link to the chunk section that now states the rule. The anchor must work.

**What never goes here.** Current-state requirements (those are the chunks), open review items and their statuses (chunk 13), and the to-do checklist (chunk 14). A mechanical correction with no owner decision behind it (`delivery-chunks.md` § Step 2, Dispositions) has no record here: its CF disposition in chunk 14 is the record. The register records decisions and process; the chunks state the outcome.

An unchanged owner confirmation is recorded as dated evidence with its source and confirmer, not a new TD. Every live answer remainder also has an owner/source-linked TD in chunk 14, and a full OI if a choice is needed; this register keeps the settled-part history.

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

**Options considered:** [Original OI ID when present, every original option and tradeoff. Preserve the full choices before replacing the applied OI with its stub.]

**Decision record, [YYYY-MM-DD]:** [What was decided: the chosen option or custom answer, who decided (the user, a delegation recorded below (an answer policy is written `Policy: <policy> (set by <name>, <date>)`), a stand-in written `Stand-in: <role> (<policy>, set by <name>, <date>)` (SKILL.md step 8), or the source that settled it: a new version of a source document, or a business review point), and the rationale. A question decided in stages gets one record per stage, dated, newest last; a record that replaces an earlier one says so ("This supersedes ..."). Open remainder is stated here, never in the chunks.]

**Rule home:** [[Section name]](./NN-chunk.md#anchor-of-the-settled-rule)

## Marker register

[One entry per inline clarification marker settled after it was written, whoever settled it: the user (at a part checkpoint, in a walkthrough, or in a later request), a new version of a source document, or a business review point. Name the part when a part checkpoint settled it.]

### [Marker subject, e.g. "UC-04 retry window"]

**Resolution ([YYYY-MM-DD]):** [What was applied and who settled it: the user, a delegation recorded below, a stand-in written `Stand-in: <role> (<policy>, set by <name>, <date>)` (SKILL.md step 8), a new version of a source document (`[source] v[X.X]`), or business review [point ID].]

**Rule home:** [[Section name]](./NN-chunk.md#anchor)

## Business review register

[One record per point of a business review (`business-reviewer-unifier`) that changed this document, written when the review applies the point.]

### [Point ID] - [short title]

**Decision record, [YYYY-MM-DD]:** [What the review decided and applied, what it replaced, and the open items or markers of this document it answers. Tracker: [review-comments-tracker.md](../review-comments-tracker.md). An open remainder, a question the decision leaves to this document's owner, is stated here; the owner's hand-off raises a TD for it in chunk 14, and also an open item when it is a business choice.]

**Rule home:** [[Section name]](./NN-chunk.md#anchor)

## Walkthrough and delegation history

[How the clarifications were walked through: one-at-a-time questions, batches, and every delegation the user gave (which items were delegated to the recommended option, on what date). An answer policy is one delegation, recorded once: its words, who set it, the date, and the stand-ins and stops it names (SKILL.md step 8). Progress notes live here, never in the chunks.]

### Action entries

**[Action], [YYYY-MM-DD]:** [What was done in that session: chunks written, back-fills, markers raised or resolved, what stays pending.]

## Per-decision ecosystem assessments

[The dated per-decision impact-assessment paragraphs, verbatim, one per decision that required one. Chunk 03 keeps the single maintained assessment table as the current state; this section keeps the history.]

### Q-NN - [short title]

[The assessment paragraph as written on that date.]

## Part N handoff record

[The handoff instructions a part applied when writing its chunks (actor restrictions, rules every affected use case must carry). One section per part that needed one. The chunks carry the resulting rules; this section keeps the instructions themselves.]

<!-- MASTER: [project-slug]-brd-master.md | COMPANION FILE: decision history; not part of the numbered chunk sequence -->
```

---

## Interaction with the chunks

- Applying a decision updates the chunk text as plain requirements in present tense ("The credential is revealed once, at generation") and removes the inline marker. The chunk never keeps a "resolved on [date]" stamp, an option letter, or a progress note.
- Compact traceability references to stable IDs (Q-NN, UC-NN, OI-NN, TD-NN, NFR-NN, or any other ID the BRD defines) inside rule text and table cells are allowed in the chunks; storytelling is not.
- Chunk 13 keeps the stable OI heading, current Status and Resolution Log pointer for an applied item. Keep its full question/options/chosen answer/Why here; unapplied items keep their full blocks in chunk 13.
- `[project-slug]-brd-master.md` keeps the progress, checkpoints, and gates, and links this register; it does not duplicate the Q&A records.

# Decision Log - the decision register companion file

`decision-log.md` is the single home for the decision story behind an SDD: the architecture questionnaire, the ecosystem selection walkthrough, the clarification Q&A, which option was chosen, who decided, when, what was delegated, what was superseded, walkthrough progress, and part-handoff instructions. The content chunks (00-17) hold only the settled design in plain present tense; this register holds why and how it was decided.

**Companion file rules.**

- Lives in `./sdd-[project-slug]/`, next to `[project-slug]-sdd-master.md`. In COMBINED mode it is still written to `./sdd-[project-slug]/decision-log.md` (the folder is created for it), and the handoff names its path.
- Created on first use: when the first decision is recorded (the architecture questionnaire, an ecosystem walkthrough answer, a user override, a resolved clarification, a settled marker, an accepted open item, a direct design instruction, a business review point, or the record of an answer policy that answered a question). An "Accept all" ecosystem answer with no other decision does not create it, unless an answer policy gave it: the policy's own record does (SKILL.md step 8, Answer policy). Do not write an empty register.
- Linked from `[project-slug]-sdd-master.md` once it exists.
- Never merged into the combined or merged SDD. It is decision history, not design text.
- Entries are append-only in spirit: a superseded decision keeps its record, and the later record says it supersedes the earlier one.
- On any rewrite, the VERSION header carries the current parent document version. Decision/process tracking or header-only synchronization does not create a separate content bump.
- Every register entry that settled a design point carries a `Rule home:` link to the chunk section that now states it. The anchor must work.
- Every BRD ID carries its key and every use case is a link to its BRD heading, as in the chunks (`brd-to-sdd.md` § The link).

**Relationship with ADRs (one fact, one home).** An ADR in chunk 06 §10 is design content: it states the decision, its context, its rationale, and its consequences in present tense, and it stays in the SDD. The register never restates an ADR. When a decision produced an ADR, the register entry records only the process (the question, the options offered, who chose, when, what it supersedes) and links the ADR as its `Rule home:`. The rationale then lives in the ADR only. When no ADR was needed, the rationale is written in the register entry.

**What never goes here.** Current-state design (those are the chunks), ADR text (chunk 06), open review items and their statuses (chunk 18), contract divergence flags still open (chunk 10 §14.8, chunk 11 §15.5, chunk 12 §16.12), and the generation progress (`[project-slug]-sdd-master.md`, or the cover lines of a combined SDD). The register records decisions and process; the chunks state the outcome.

For a partial answer, record the applied part and the exact open remainder with its named owner and source marker. Narrow the body marker to the remainder; its E3 status follows the dependent claim, not its location. An owner-only factual/legal question stays explicit until answered; do not treat a partial acceptance as authority to remove the whole marker.

---

## Canonical structure

```markdown
<!--
TYPE: Decision Log
PROJECT: [Project Name]
VERSION: [X.X]
PART OF: SDD - [Project Name]
PURPOSE: Single home for the architecture questionnaire record, the ecosystem selection record, the clarification Q&A, and decision history; the content chunks hold only the settled design.
MAINTENANCE: New decisions are added here, not in the content chunks. The chunks carry only the resulting design and current-state caveats.
-->

# Decision Log - [Project Name]

## How to read

[One short paragraph: the numbered content chunks hold the current settled design; ADRs in chunk 06 hold each architecture decision and its rationale; this companion file holds how the decisions were reached. Read the chunks for what the system is; read this file for the decision history behind it.]

## Architecture questionnaire record

**Outcome, [YYYY-MM-DD]:** [Accept all | Walked through]. [Who answered: the user, or `Policy: <policy> (set by <name>, <date>)`.] Style: [modular monolith | hybrid | microservices]; [followed the recommendation | chose otherwise].

| Question | Offered (recommended first) | Chosen | Evidence | Rule home |
|----------|-----------------------------|--------|----------|-----------|
| [Q4 Architecture style] | [Modular monolith (Recommended) / Hybrid / Microservices] | [Modular monolith] | [[KEY] 01 objectives: MVP; one team; [KEY] 10 NFRs: modest load] | [ADR-01](./06-principles-and-decisions.md#anchor) |

[One row per question, Q1-Q8. Always written, even for Accept all: the style is a structural decision.]

## Ecosystem selection record

**Outcome, [YYYY-MM-DD]:** [Accept all | Walked through item by item]. [Who answered: the user, or `Policy: <policy> (set by <name>, <date>)`.]

| Layer | Offered (recommended first) | Chosen | Source | Rule home |
|-------|-----------------------------|--------|--------|-----------|
| [e.g. Messaging & streaming] | [Kafka (Recommended) / SNS+SQS / RabbitMQ] | [Kafka] | [recommended, [KEY]/NFR-03] | [02 §6 row](./02-ecosystem-overview.md#anchor) |
| [BRD-mandated row the user overrode] | [locked: PostgreSQL 17] | [Aurora PostgreSQL] | [user override] | [ADR-NN](./06-principles-and-decisions.md#anchor) |

[Only rows that were walked through or overridden. Rows accepted as proposed are not listed one by one; the §6 Notes column already carries their source.]

## Clarification register

[One line of state, e.g. "All N open items from the review are decided on [date]." One entry per decided open item or clarification question; an item left `Decided - pending application` gets its entry when it is applied (SKILL.md step 8 item 3); a settled marker goes to § Marker register.]

### OI-NN - [short title]

**Question:** [What was asked, in one or two sentences.]

**Decision record, [YYYY-MM-DD]:** [What was decided: the chosen option or custom answer, and who decided (the user, a delegation recorded below, or the source that settled it: a BRD version such as `LOYALTY v1.2`, or a business review point; an answer policy is written `Policy: <policy> (set by <name>, <date>)`). The rationale, unless an ADR carries it. A question decided in stages gets one record per stage, dated, newest last; a record that replaces an earlier one says so ("This supersedes ...").]

**Open remainder:** [None, or after a partial answer the exact question still open, with its named owner and location; never in the chunks. For a question decided in stages, what is still open after the newest record.]

**Rule home:** [[Section name]](./NN-chunk.md#anchor-of-the-settled-design)

## Marker register

[One entry per inline clarification marker or contract divergence settled after it was written, whoever settled it: the user (at a part checkpoint, in a decision walk, or in a later request), a new version of a source document, or a business review point. Name the part when a part checkpoint settled it.]

### [Subject, e.g. "wallet-core retry policy for payment callbacks"]

**Resolution ([YYYY-MM-DD]):** [What was applied and who settled it: the user, a delegation recorded below, `[KEY] v[X.X]`, or business review [point ID]; an answer policy is written `Policy: <policy> (set by <name>, <date>)`.]

**Open remainder:** [None, or after a partial answer the exact question the narrowed marker still asks, with its named owner and location.]

**Rule home:** [[Section name]](./NN-chunk.md#anchor)

## Business review register

[One record per point of a business review (`business-reviewer-unifier`) that changed this document, written when the review applies the point.]

### [Point ID] - [short title]

**Decision record, [YYYY-MM-DD]:** [What the review decided and applied, what it replaced, and the open items or markers of this document it answers. Tracker: [review-comments-tracker.md](../review-comments-tracker.md). An open remainder, a question the decision leaves to this document's owner, is stated here; the owner's hand-off raises it as an open item.]

**Rule home:** [[Section name]](./NN-chunk.md#anchor)

## Walkthrough and delegation history

[How the decisions were walked through: one-at-a-time questions, batches, and every delegation the user gave ("apply all recommended answers for the low-priority items", on what date). An answer policy set for a run is one of these delegations: recorded once, as `Policy: <policy> (set by <name>, <date>)`, with the stops and the Approver stand-in it names (SKILL.md step 8, Answer policy). Progress notes live here, never in the chunks.]

### Action entries

**[Action], [YYYY-MM-DD]:** [What was done in that session: chunks written, back-fills, markers raised or resolved, contracts re-reconciled, what stays pending. A direct design instruction from the user, with no question behind it, is recorded here: the instruction as the user gave it, then `Rule home:` and the link to the section that now states it.]

## Part N handoff record

[The instructions a checkpoint handed to the next part (for example: "merge ledger-service into wallet-core; wallet-core owns the Transaction entity; payment-processor consumes WalletDebited"). One section per part that needed one. The chunks carry the resulting design; this section keeps the instructions themselves.]

<!-- MASTER: [project-slug]-sdd-master.md | COMPANION FILE: decision history; not part of the numbered chunk sequence -->
```

---

## Interaction with the chunks

- Applying a decision updates the chunk text as plain design in present tense ("Wallet events are published through the transactional outbox") and removes the inline marker it settles; a partial answer narrows the marker to its open remainder instead. The chunk never keeps a "resolved on [date]" stamp, an option letter, or a progress note.
- Compact traceability references to stable IDs (OI-NN, ADR-NN, AP-NN, and a use case as its keyed link `[KEY/UC-NN](...)`: `brd-to-sdd.md` § The link) inside design text and table cells are allowed in the chunks; storytelling is not.
- The §6 Notes column keeps each row's source label (`BRD-mandated`, `source SDD`, `questionnaire`, `default`, `recommended`, `user override`). That label is current-state provenance, not narrative, and stays in the chunk.
- Chunk 18 keeps each item's current status line and its Resolution Log row. The narrative behind an accepted item moves here.
- `[project-slug]-sdd-master.md` keeps the generation progress and links this register; it does not duplicate the Q&A records.

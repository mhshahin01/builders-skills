# Decision Log - the decision register companion file

`decision-log.md` is the single home for the decision story behind an SDD: the architecture questionnaire, the ecosystem selection walkthrough, the clarification Q&A, which option was chosen, who decided, when, what was delegated, what was superseded, walkthrough progress, and part-handoff instructions. The content chunks (00-17) hold only the settled design in plain present tense; this register holds why and how it was decided.

**Companion file rules.**

- Lives in `./sdd-[project-slug]/`, next to `[project-slug]-sdd-master.md`. In COMBINED mode it is still written to `./sdd-[project-slug]/decision-log.md` (the folder is created for it), and the handoff names its path.
- Created on first use: when the first decision is recorded (the architecture questionnaire, an ecosystem walkthrough answer, a user override, a resolved clarification, or an accepted open item). An "Accept all" ecosystem answer with no other decision does not create it. Do not write an empty register.
- Linked from `[project-slug]-sdd-master.md` once it exists.
- Never merged into the combined or merged SDD. It is decision history, not design text.
- Entries are append-only in spirit: a superseded decision keeps its record, and the later record says it supersedes the earlier one.
- Every register entry that settled a design point carries a `Rule home:` link to the chunk section that now states it. The anchor must work.

**Relationship with ADRs (one fact, one home).** An ADR in chunk 06 §10 is design content: it states the decision, its context, its rationale, and its consequences in present tense, and it stays in the SDD. The register never restates an ADR. When a decision produced an ADR, the register entry records only the process (the question, the options offered, who chose, when, what it supersedes) and links the ADR as its `Rule home:`. The rationale then lives in the ADR only. When no ADR was needed, the rationale is written in the register entry.

**What never goes here.** Current-state design (those are the chunks), ADR text (chunk 06), open review items and their statuses (chunk 18), contract divergence flags still open (chunk 10 §14.8, chunk 12 §16.12), and the generation progress (`[project-slug]-sdd-master.md`, or the cover lines of a combined SDD). The register records decisions and process; the chunks state the outcome.

---

## Canonical structure

```markdown
<!--
TYPE: Decision Log
PROJECT: [Project Name]
VERSION: [X.X]
PART OF: SDD - [Project Name]
PURPOSE: Single home for the ecosystem selection record, the clarification Q&A, and decision history; the content chunks hold only the settled design.
MAINTENANCE: New decisions are added here, not in the content chunks. The chunks carry only the resulting design and current-state caveats.
-->

# Decision Log - [Project Name]

## How to read

[One short paragraph: the numbered content chunks hold the current settled design; ADRs in chunk 06 hold each architecture decision and its rationale; this companion file holds how the decisions were reached. Read the chunks for what the system is; read this file for the decision history behind it.]

## Architecture questionnaire record

**Outcome, [YYYY-MM-DD]:** [Accept all | Walked through]. [Who answered.] Style: [modular monolith | hybrid | microservices]; [followed the recommendation | chose otherwise].

| Question | Offered (recommended first) | Chosen | Evidence | Rule home |
|----------|-----------------------------|--------|----------|-----------|
| [Q4 Architecture style] | [Modular monolith (Recommended) / Hybrid / Microservices] | [Modular monolith] | [BRD 01 objectives: MVP; one team; 10-nfrs modest load] | [ADR-01](./06-principles-and-decisions.md#anchor) |

[One row per question, Q1-Q8. Always written, even for Accept all: the style is a structural decision.]

## Ecosystem selection record

**Outcome, [YYYY-MM-DD]:** [Accept all | Walked through item by item]. [Who answered.]

| Layer | Offered (recommended first) | Chosen | Source | Rule home |
|-------|-----------------------------|--------|--------|-----------|
| [e.g. Messaging & streaming] | [Kafka (Recommended) / SNS+SQS / RabbitMQ] | [Kafka] | [recommended, BRD 10-nfrs NFR-03] | [02 §6 row](./02-ecosystem-overview.md#anchor) |
| [BRD-mandated row the user overrode] | [locked: PostgreSQL 17] | [Aurora PostgreSQL] | [user override] | [ADR-NN](./06-principles-and-decisions.md#anchor) |

[Only rows that were walked through or overridden. Rows accepted as proposed are not listed one by one; the §6 Notes column already carries their source.]

## Clarification register

[One line of state, e.g. "All N open items from the review are decided on [date]." One entry per decided open item or clarification.]

### OI-NN - [short title]

**Question:** [What was asked, in one or two sentences.]

**Decision record, [YYYY-MM-DD]:** [What was decided: the chosen option or custom answer, and who decided. The rationale, unless an ADR carries it. A question decided in stages gets one record per stage, dated, newest last; a record that replaces an earlier one says so ("This supersedes ..."). Open remainder is stated here, never in the chunks.]

**Rule home:** [[Section name]](./NN-chunk.md#anchor-of-the-settled-design)

## Part N clarification register

[One per part that raised and then resolved inline clarification markers or contract divergences. One entry per item.]

### [Subject, e.g. "wallet-core retry policy for payment callbacks"]

**Resolution ([YYYY-MM-DD]):** [What was applied and under whose decision (the user, or a delegation recorded below).]

**Rule home:** [[Section name]](./NN-chunk.md#anchor)

## Walkthrough and delegation history

[How the decisions were walked through: one-at-a-time questions, batches, and every delegation the user gave ("apply all recommended answers for the P3 items", on what date). Progress notes live here, never in the chunks.]

### Action entries

**[Action], [YYYY-MM-DD]:** [What was done in that session: chunks written, back-fills, markers raised or resolved, contracts re-reconciled, what stays pending.]

## Part N handoff record

[The instructions a checkpoint handed to the next part (for example: "merge ledger-service into wallet-core; wallet-core owns the Transaction entity; payment-processor consumes WalletDebited"). One section per part that needed one. The chunks carry the resulting design; this section keeps the instructions themselves.]

<!-- MASTER: [project-slug]-sdd-master.md | COMPANION FILE: decision history; not part of the numbered chunk sequence -->
```

---

## Interaction with the chunks

- Applying a decision updates the chunk text as plain design in present tense ("Wallet events are published through the transactional outbox") and removes the inline marker. The chunk never keeps a "resolved on [date]" stamp, an option letter, or a progress note.
- Compact traceability references to stable IDs (OI-NN, ADR-NN, UC-NN, AP-NN) inside design text and table cells are allowed in the chunks; storytelling is not.
- The §6 Notes column keeps each row's source label (`BRD-mandated`, `source SDD`, `default`, `recommended`, `user override`). That label is current-state provenance, not narrative, and stays in the chunk.
- Chunk 18 keeps each item's current status line and its Resolution Log row. The narrative behind an accepted item moves here.
- `[project-slug]-sdd-master.md` keeps the generation progress and links this register; it does not duplicate the Q&A records.

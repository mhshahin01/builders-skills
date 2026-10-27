# Decision Log: the decision register companion file

`decision-log.md` is the single home for the decision story behind a Pre-SDD: the answers, the proposals offered and taken, who decided and when, the delegations and answer policies, the review decisions, and the G3 sign-off record. The content chunks hold only the settled values and shape, in plain present tense; this register holds how and by whom they were settled.

**Companion file rules.**

- Lives in `./pre-sdd-[slug]/`, next to `[slug]-pre-sdd-master.md`. In COMBINED mode it is still written to `./pre-sdd-[slug]/decision-log.md`, beside `studio/`, and the handoff summary names its path.
- Created on first use: when the first decision is recorded (the answer to "go on?" for a BRD that is not `Approved`, a proposal, an answered batch, a group confirm, a stage 4 decision, a decided open item, an answer policy that answered a question, or a signature). Do not write an empty register.
- Linked from the master once it exists.
- Never merged into the combined or merged Pre-SDD. It is decision history, not design text.
- Append-only in spirit: a superseded decision keeps its record, and the later record says what it supersedes.
- Its VERSION header carries the current Pre-SDD version. Writing to it bumps nothing.
- Every record that settled a value or a shape point names the ID it settled (`REL-03.2`, `OPT-02`, `OI-07`) and carries a `Rule home:` link to the chunk section that now states it. The anchor must work.
- Every BRD ID carries its key (`REFUNDS/NFR-03`).

**Relationship with the project state.** The project state holds the value of record, with who and when (`confirmed_by`, `confirmed_at`, the history records the engine writes for every op). The register never restates a value as if it were the record: it names the entry and tells the story (what was asked, what was offered, who chose, when, under which policy). When the two disagree, the project state wins, and the register gets a correcting record.

**Relationship with the ADRs.** The Pre-SDD ADRs in chunk 09 § 9.4 are content: they state the decision and its rationale. When a decision produced an ADR, the register records only the process and links the ADR as its `Rule home:`.

**What never goes here.** Current values and shape (the chunks and the project state), ADR text (chunk 09), open review items and their statuses (chunk 13), the engine's findings (chunk 10), and the run's progress (the master, or the cover of a combined Pre-SDD).

---

## Canonical structure

```markdown
<!--
TYPE: Decision Log
PROJECT: [Project Name]
VERSION: [X.X]
PART OF: Pre-SDD - [Project Name]
PURPOSE: Single home for the decision story behind the Pre-SDD: answers, proposals, review decisions, delegations, and the G3 sign-off record; the content chunks hold only the settled values and shape.
MAINTENANCE: New decisions are added here, never narrated in the content chunks.
-->

# Decision Log - [Project Name]

## How to read

[One short paragraph: the numbered chunks hold the settled values and shape; the project state (studio/project-state.json) holds each value of record with who and when; this file holds how each decision was reached.]

## Proposal record

[One record per proposal the E2E Architect made on a proposal row (REL-01, REL-03, REL-04, CAP-07), written when it is proposed and completed when its outcome is known. A fact only a person gives is never proposed, so it never appears here.]

| Entry | Proposed value | Reason (tied to the BRD where it can be) | Proposed | Outcome | Decided by | Decided | Rule home |
|-------|----------------|------------------------------------------|----------|---------|------------|---------|-----------|
| [REL-01.1] | [value and unit] | [e.g. "[KEY]/NFR-02 allows one disruption a month"] | [YYYY-MM-DD] | [Accepted / Changed to <value> / Pending / Superseded] | [Name, or `Policy: <policy> (set by <name>, <date>)`] | [YYYY-MM-DD] | [[03c](./03c-register-reliability.md#rel-01)] |

## Clarification register

[One line of state, e.g. "All N open items from the review are decided on [date]." One entry per decided open item (chunk 13) or answered clarification question.]

### OI-NN - [short title]

**Question:** [What was asked, in one or two sentences.]

**Decision record, [YYYY-MM-DD]:** [The chosen option or own answer, and who decided: a person by name, or `Policy: <policy> (set by <name>, <date>)`. The rationale, unless an ADR carries it. A value it changed names the entry and the derive patch that wrote it. A record that replaces an earlier one says "This supersedes ...".]

**Open remainder:** [None, or the exact question still open, with its named owner.]

**Rule home:** [[Section name]](./NN-chunk.md#anchor)

## Marker register

[One entry per inline `[NEEDS CLARIFICATION: ...]` marker settled after it was written, whoever settled it: a person's answer, a new BRD version (`[KEY] v[X.X]`), or a business review point.]

### [Subject, e.g. "settlement batch completion window"]

**Resolution ([YYYY-MM-DD]):** [What was applied and who settled it.]

**Open remainder:** [None, or the narrowed question, with its owner.]

**Rule home:** [[Section name]](./NN-chunk.md#anchor)

## Business review register

[One record per point of a business review (`business-reviewer-unifier`) that changed this Pre-SDD, written when the update applies it. The panel never edits the Pre-SDD: its decision reaches this skill as a handoff request, and the update runs under the owner's name.]

### [Point ID] - [short title]

**Decision record, [YYYY-MM-DD]:** [What the review decided, what the update changed (entries, chunks), and the version it went into. Tracker: [review-comments-tracker.md](../review-comments-tracker.md).]

**Rule home:** [[Section name]](./NN-chunk.md#anchor)

## Walkthrough and delegation history

[How the input was collected and the decisions taken: the input path per stage (web or prompt, and each switch with who asked), the batches answered and by whom, each group confirm, the stage 4 decisions (topology and DR overrides with their reasons, the chosen option with the reason for the choice and the condition that would reverse it, each by who decided), the cost, horizon, and weight approvals, and every delegation the user gave. An answer policy is recorded once, the first time it answers: `Policy: <policy> (set by <name>, <date>)`, with the stops it may pass and the Approver stand-in it names. Progress notes live here, never in the chunks.]

### Action entries

**[Action], [YYYY-MM-DD]:** [What was done: for example "Start conditions: REFUNDS v1.2 is In Review; <name> chose to go on", "Stage 2, group DAT: 4 entries answered and the group confirmed by <name>", "Switched to web at stage 3, asked by <name>", "Stage 4: DR override for scope region set to warm by <name>, reason: ...", "Weights approved by <name>". A direct instruction from the owner, with no question behind it, is recorded here as the owner gave it, then `Rule home:` and the link to the section that now states it.]

## Sign-off record

[One record per G3 sign-off round, newest last. The engine stores each signature with the content hash of the state the signer reviewed (chunk 11 shows the register); this record keeps the story: what each signer reviewed, the order (checklist ticks, then conditions, then signatures), and what reopened G3 since the last round.]

### G3 round [N], version [X.X], [YYYY-MM-DD]

| Role | Signer | Decision | Signed (UTC) | Notes |
|------|--------|----------|--------------|-------|
| [Business sponsor] | [Name, or `Stand-in: Approver (<policy>, set by <name>, <date>)`, or, for a role marked not applicable in a test run, `Fixture: <owner> (test-run policy)`] | [Approved / Approved with conditions / Rejected / Not applicable: reason] | [YYYY-MM-DDTHH:MM:SSZ] | [What they reviewed] |

**Checklist:** [Who ticked which lines, and when; G3-11 by the empowered owner who formally accepted the remaining conflicts and high risks, or by the fixture owner in a test run.]

**Conditions and exceptions:** [COND-NN with owner and due; EXC-NN with who granted it, its expiry, and its review date.]

**Reopened:** [None, or what sent G3 back to Review: a content change (new content hash) or a `reopen` mark with its reason.]

<!-- MASTER: [slug]-pre-sdd-master.md | COMPANION FILE: decision history; not part of the numbered chunk sequence -->
```

---

## Interaction with the chunks

- Applying a decision updates the chunk as plain text in present tense ("Recovery from a region failure uses a warm standby") and removes the inline marker it settles. A chunk never keeps a "decided on [date]" stamp, an option letter, or a progress note.
- A value is never applied into a chunk by hand: it goes into the project state through `derive --apply`, then `compute`, then the new fragment replaces the old one.
- Compact references to stable IDs (`OI-NN`, `ADR-DR-001`, `REL-03.2`, `QD-NN`) inside chunk text and table cells are allowed; storytelling is not.
- Chunk 13 keeps each item's current status line and its Resolution Log row; the story behind a decided item moves here.
- Chunk 11 keeps the current sign-off register from the gate fragment; the story of each round moves here.
- The master keeps the progress and links this register; it does not repeat its records.

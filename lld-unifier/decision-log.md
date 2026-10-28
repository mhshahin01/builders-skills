# Decision Log - the decision record companion file

`decision-log.md` is the single home for the decision story behind an LLD: the stack approval and its overrides, the clarification answers, which option was chosen, who decided, when, what was delegated, and what was superseded. The content chunks and the service files hold only the settled design in plain present tense. This file holds why and how it was decided.

This file is the reference for the log: its structure and its rules. The log the skill writes is a separate file, `./lld-[project-slug]/decision-log.md`, in the LLD folder.

---

## Companion file rules

- Lives in `./lld-[project-slug]/`, next to `[project-slug]-lld-master.md`. In COMBINED mode it is still written to `./lld-[project-slug]/decision-log.md` (the folder is created for it), and the handoff names its path.
- Created on first use: when the first decision is recorded (the table below). Every stack approval is such a decision, including Approve all. Its Outcome line creates the log, so a later run finds the rows it confirmed (SKILL.md step 3a). On a first build, a record made before the LLD is written is held and written with the LLD's first files. Examples are the stack approval and an answer policy's delegation record. Do not write an empty log.
- An LLD written before this file existed has no log and stays valid. The first request that records a decision creates it, links it from the master, and names it in the handoff. Nothing earlier is back-filled: earlier answers stay in the chunk 18 Resolution Log and the Changes Log.
- The header comment `TYPE: Decision Log` identifies the log. A file of the same name without it (for example a hand-kept run record) is not this log. The skill never overwrites that file or appends to it, and asks the user where the log should go.
- Linked from `[project-slug]-lld-master.md` once it exists.
- Never merged into the merged or combined LLD (`chunking.md` § Merge handling). It is decision history, not design text.
- Entries are append-only in spirit: a superseded decision keeps its record, and the later record says it supersedes the earlier one.
- Writing a record is not a content change (SKILL.md § Output conventions, Versions). On any rewrite, the `VERSION` header carries the current LLD version.
- Every record that settled a design point carries a `Rule home:` link to the section that now states it. The anchor must work. In COMBINED mode the link points into the combined file (`../LLD-[ProjectName]-v[X.X].md#anchor`).
- Every BRD ID carries its key and every use case is a link to its BRD heading, as in the chunks (`sdd-to-lld.md` § Use-case traceability › The link). Links are written from this file's location. Use `../sdd-[sdd-slug]/...` for the SDD, `../brd-[brd-slug]/...` for a BRD, `./NN-name.md` for a chunk, and `./04-implementation/[service-slug].md` for a service file. A flag quoted in a record is written in backticks, so the flag count (SKILL.md step 8) never counts it.

**What is recorded, and where.**

| Event | Recorded in |
|-------|-------------|
| The stack approval is answered (Approve all included); a later run changes a row or settles an override (kept, replaced by the new SDD value, or adopted by the SDD); or a reserved dependency is confirmed by its decider (SKILL.md step 3a, item 1) | Stack approval record |
| An open item of chunk 18 is accepted, adjusted, or rejected with `No change: <evidence>`; a `Decided - pending application` item is applied | Clarification register, one entry per item |
| An open question (15 § 18.4), a flag, or a question the run asked outside chunk 18 (the Project Type, the Roadmap grouping, a one-time offer the user declines) is answered | Clarification register, one entry per decision |
| An answer policy or another standing instruction answers for the first time | Delegation history |
| The user gives a design instruction with no question behind it | Delegation history, Direct design instructions |
| A decided change from the tracker is applied (`Decided change <KEY>/CHG-NNN`, or the tracker's doc worker in `solo` run mode: SKILL.md step 9) | Delegation history, Direct design instructions, with the CHG ID as its Source and the CHG decider quote as the decision |

Which items get no register entry, and so keep only their chunk 18 entry, is stated in SKILL.md step 7a, item 7.

---

## Relationship with design rationale (one fact, one home)

The SDD's ADRs stay in the SDD. The LLD cites them by link and never restates them (SKILL.md principle 13). A rationale that the chunks already carry (a pattern's rationale in a service file's § 7.4, a Source cell) is design content: it stays in the chunk, in present tense. When a decision produced such text, the record states only the process and links the text as its `Rule home:`. The process is the question, the options offered, who chose, when, and what it supersedes. In that case the reason lives in the chunk only. When no chunk line carries the reason (a stack override, an accepted open item), the reason is written in the record.

## What never goes here

- Current-state design (the chunks and the service files).
- SDD content and ADR text (cited from the SDD).
- Open items and their statuses (chunk 18).
- Flags still open and questions still waiting for their owner (chunk 15).
- Drift markers and policy findings (chunk 15).
- The Changes Log (chunk 00).
- The upstream state the trace was built from (16 § 19.1).

The log records decisions and process; the chunks state the outcome.

For a partial answer, record the applied part and the exact open remainder with its named owner and location. The flag is narrowed to the remainder. A fact only a person or a provider can give stays explicit until answered. A partial acceptance is not authority to remove the whole flag.

---

## Canonical structure

```markdown
<!--
TYPE: Decision Log
PROJECT: [Project Name]
VERSION: [X.X]
PART OF: LLD - [Project Name]
PURPOSE: Single home for the stack approval record, the clarification answers, the delegations, and decision history; the content chunks and the service files hold only the settled design.
MAINTENANCE: New decisions are added here, not in the content chunks. The chunks carry only the resulting design and current-state caveats.
-->

# Decision Log - [Project Name]

## How to read

[One short paragraph: the content chunks and the service files hold the current settled design; chunk 18 holds each open item, its status, and its Resolution Log row; this companion file holds how the decisions were reached. Read the chunks for what the system is; read this file for the decision history behind it.]

## Stack approval record

[One line of state, e.g. "Confirmed as shown on [date]; one override, listed below." Each approval, and each later run that changes a row, adds its own dated Outcome line, newest last.]

**Outcome, [YYYY-MM-DD]:** [Approve all | Changed one by one | Replaced all | Reserved dependency confirmed]. [Who answered: the user, or `Policy: <policy> (set by <name>, <date>)`.]

| Layer | Offered (recommended first) | Chosen | Source | Rule home |
|-------|-----------------------------|--------|--------|-----------|
| [e.g. Cache] | [Redis (Recommended) / Caffeine / None] | [Caffeine] | [user choice] | [03 §6.3 row](./03-architecture.md#63-runtime-stack) |
| [a row the user changed from SDD §6] | [PostgreSQL 17 (Recommended) / Aurora PostgreSQL] | [Aurora PostgreSQL] | [override: its entry under Overrides] | [03 §6.3 row](./03-architecture.md#63-runtime-stack) |
| [a §6.5.1 library row, e.g. Unit test tooling] | [JUnit 5 with Mockito (Recommended) / another tool] | [another tool] | [user choice] | [03a §6.5.1 row](./03a-libraries-and-conventions.md#651-libraries-by-concern) |
| [a reserved dependency, e.g. HTTP client, reactive or non-blocking] | [WebClient, `Proposed - needs approval`] | [WebClient, confirmed] | [confirmed by [the decider the request names]] | [03a §6.5.1 row](./03a-libraries-and-conventions.md#651-libraries-by-concern) |

[Only rows that were changed or confirmed as a reserved dependency. Rows confirmed as shown are not listed one by one; the §6.3 or §6.5.1 Source column already carries their source.]

### Overrides

[One entry per layer whose approved value differs from SDD §6, or from a `Project rule` (SKILL.md step 3a). The entry's heading is the anchor its §6.3 or §6.5.1 Source cell links. A later decision on the same layer adds a new entry, or a record row when it takes the new SDD value, and this entry's Status names it.]

#### [Layer]: [SDD value] to [new value]

- **Layer:** [The §6.3 Runtime Stack layer, or the §6.5.1 concern.]
- **SDD value:** [The value SDD §6 states, linked to its row, with the SDD version read. For a `Project rule` row, also the rule and its file.]
- **New value:** [The approved value, with its version.]
- **Decider:** [The user, or `Policy: <policy> (set by <name>, <date>)`.]
- **Date:** [YYYY-MM-DD]
- **Reason:** [Why the approved value differs. The reason lives here only.]
- **Chunks affected:** [Each chunk and section that states the new value, as links.]
- **SDD update:** [The SDD version the documents chain produced for this override (SKILL.md step 7b), or why there is none yet: the hop waits for the SDD owner (who), or the owner declined it. `Not applicable` for a layer SDD §6 does not state.]
- **Status:** [Active | Raised in SDD vX.X (Proposed) (the SDD states the new value, but its §6 row is still Proposed; the override stays in force) | Adopted by SDD vX.X (SDD §6 now states the new value and the row is Confirmed or Locked) | Superseded by (link to the newer entry, or to the record row that took the new SDD value)]
- **Rule home:** [[Runtime Stack row]](./03-architecture.md#63-runtime-stack), or for a library row [[Libraries row]](./03a-libraries-and-conventions.md#651-libraries-by-concern)

## Clarification register

[One line of state, e.g. "All N open items from the review are decided on [date]." One entry per decided open item or clarification question; an item left `Decided - pending application` gets its entry when it is applied (SKILL.md step 7a, item 6). Headings: `### OI-NN - [short title]` for a chunk 18 item, `### OQ-NN - [short title]` for a 15 § 18.4 question, `### [Subject]` for a flag or a question asked outside both.]

### OI-NN - [short title]

- **Question:** [What was asked, in one or two sentences.]
- **Decision record, [YYYY-MM-DD]:** [What was decided: the chosen option (by its letter in the item) or the user's own answer, and who decided (the user, or a delegation recorded below; an answer policy is written `Policy: <policy> (set by <name>, <date>)`). The reason, unless a chunk line already carries it. A question decided in stages gets one record per stage, dated, newest last; a record that replaces an earlier one says so ("This supersedes ...").]
- **Open remainder:** [None, or after a partial answer the exact question still open, with its named owner and location; never in the chunks. For a question decided in stages, what is still open after the newest record.]
- **Rule home:** [[Section name]](./NN-name.md#anchor-of-the-settled-design)

## Delegation history

[How decisions were delegated: every answer policy set for a run ("answer policy: accept the recommended option", on what date, by whom) and every other standing instruction ("apply all recommended answers for the low-priority items"). An answer policy is recorded once, the first time it answers, as `Policy: <policy> (set by <name>, <date>)`, with what it covers and what it leaves to the user (SKILL.md step 7a, Answer policy). Progress notes live in the Changes Log, never here and never in the chunks.]

### [Policy or delegation, e.g. "Policy: accept the recommended option"]

- **Set by:** [Name, YYYY-MM-DD, in the request or in a run brief.]
- **Covers:** [The prompts and items it may answer, and what it leaves to the user.]

### Direct design instructions

**[Subject], [YYYY-MM-DD]:** [The instruction as the user gave it, with no question behind it. Then `Rule home:` and the link to the section that now states it.]

**[Subject], [YYYY-MM-DD]:** [For a decided change from the tracker: the decision and its decider quote, as the CHG row states them. Then `Source:` with the CHG ID (`<KEY>/CHG-NNN`, linked to its row in the tracker's `tracking/changes.md`), and `Rule home:` with the link to the section that now states it.]

<!-- MASTER: [project-slug]-lld-master.md | COMPANION FILE: decision history; not part of the numbered chunk sequence -->
```

---

## Interaction with the chunks

- Applying a decision updates the chunk text as plain design in present tense ("Refund events are published through the transactional outbox") and removes the `> Confirm:` or `> TODO:` flag it settles. A partial answer narrows the flag to its open remainder instead. The chunk never keeps a "resolved on [date]" stamp, an option letter, or a progress note (SKILL.md step 7, Answers in the same update).
- Compact references to stable IDs (OI-NN, OQ-NN, and a use case as its keyed link `[KEY/UC-NN](...)`: `sdd-to-lld.md` § Use-case traceability › The link) inside design text and table cells are allowed in the chunks; storytelling is not.
- A §6.3 or §6.5.1 Source cell keeps its provenance label, one from the one list in `chunks/03-architecture.md` § 6.3 Runtime Stack (its Convention). A default nothing has confirmed reads `LLD default`. That label is current-state provenance, not narrative, and stays in the chunk.
- Chunk 18 keeps each item's current status line and its Resolution Log row, which give the outcome and where it was applied. The decision record behind them, who decided what and why, is kept here.
- `[project-slug]-lld-master.md` links this log; it does not duplicate its records.

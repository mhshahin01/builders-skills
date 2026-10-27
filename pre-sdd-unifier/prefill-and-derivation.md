# Pre-fill and derivation

This file defines how the register is pre-filled before anyone is asked a question: the order of trust, the never-guess rule, which row comes from which BRD chunk, formula, or default, and how the skill writes the pre-fill through the engine. Read it at step 6 of [SKILL.md](SKILL.md).

Nobody faces 70 empty items. Whatever the BRDs, earlier answers, the engine, or the defaults can give arrives pre-filled with its source, as `Estimated`, for a person to keep or change. Whatever they cannot give stays `Open`, and the engine shows it as TBD. The register's fields, statuses, and source texts: [register-and-entries.md](register-and-entries.md).

---

## The order of trust

| Order | Source | Written by | Status | Source text |
|---|---|---|---|---|
| 1 | **The BRDs**, read in full: a chunked folder or a combined file per source BRD | The skill, with an agent actor | `Estimated` | `BRD: <KEY>/<ID>`, or the chunk, `BRD: <KEY> <NN>` |
| 2 | **Earlier answers in this Pre-SDD** (a resume, an update, or an import) | Already in the project state | As recorded | As recorded |
| 3 | **Engine derivations:** formula results from other items | The engine, on every `new` and `derive` | `Estimated` | `Derived: CALC-NN from <items>` |
| 4 | **The engineering defaults appendix and the project defaults** | The engine, on every `new` and `derive` | `Estimated` | `Default: policy appendix v<N>`, or `Default: project rule <row>` |

A lower source never replaces a higher one:

- **An answer stays.** A value a person answered or confirmed is protected: the skill, the engine, and an answer policy never overwrite it. On an update, a new BRD value for an answered item goes into the update offer for that person to decide (SKILL.md § Later requests).
- **The engine maintains only its own values.** A derivation or a default fills an entry that is `Open` and unprotected, and updates only a value it wrote under its own source text. A BRD value, an answer, or a confirmation is never replaced by a formula or a default.
- **A cleared value stays cleared.** When a person clears a pre-filled value, the entry stays `Open` ("left open"), and the engine does not fill it again. To get the default or derived value back, the person reopens the entry (`open`), and the next `derive` fills it.
- **A person's own kind stops the upkeep.** Once a person sets a kind of their own on a pre-filled entry, the engine stops filling or updating its value, and clears it for the person when the inputs change.

---

## Never guessed

1. **A BRD value is pre-filled only when the BRD states it.** The value, its unit, and what it applies to must all be in the text. A value that only follows from reading between the lines is not stated.
2. **A vague word is not a number.** "Fast", "always available", "near real-time", or "high volume" leaves the entry `Open`. Where the row takes a proposal (REL-01, REL-03, REL-04, CAP-07), the skill proposes a value beside it, with its reason tied to the BRD wording (§ Proposals in `register-and-entries.md`). Elsewhere, the BRD wording goes into the entry's `evidence`, and the question goes to the person in its stage.
3. **No other source is a source.** Never fill a value from a worked example in `examples/`, a typical value, another project, or the Quick Discovery Guide's illustrations. The appendix gives only its seven factors and two project rules.
4. **A unit change is not a derivation.** A stated value in another unit is written in the row's unit (an RTO of 15 minutes is 900 s; an RPO of 1 hour is 3600 s), with the BRD's own wording in `evidence`. A value that needs another number to convert is not stated for this row: a peak of 50 TPS is not a daily transaction count, because the peak factor is a separate item (CAP-04). Leave such an entry `Open`, put the BRD wording in `evidence`, and ask the person.
5. **Two sources that disagree settle nothing.** When two BRDs, or two places in one BRD, give different values for the same entry, leave it `Open`, cite both in `evidence`, and raise the question: to the person in its stage, and to the BRD owner as a request to `brd-unifier` when only the BRD owner can settle it.
6. **TBD is never zero.** An `Open` value is `null`, and every calculation that needs it reads TBD. Zero is written only when the BRD states zero (an RPO of 0).
7. **Facts only a person gives** (the list is in `register-and-entries.md` § Who confirms) are pre-filled only from a BRD that states them, and never proposed.
8. **Owner names and due dates are never pre-filled.** They come from a person (`stages-and-input.md`); the engine refuses them from the skill.

A gap in the prose is flagged as `**[NEEDS CLARIFICATION: <specific question>]**`, never filled with a plausible invention.

---

## The derivation table

Which BRD chunks each row reads, and what the engine or a default gives. BRD chunk numbers are those of the `brd-unifier` output (below). A BRD value is pre-filled only when the BRD states it; vague words such as "fast" stay `Open`, with a proposal where the row allows one.

| Rows | Read in the BRD | Engine or default |
|---|---|---|
| BUS-01, BUS-03 | 01 objectives and background, 04 scope | |
| BUS-02 | 05 journeys and Use Case Summary (one entry per journey) | |
| BUS-04, BUS-08 | 01, 02 constraints, 08 partners | |
| BUS-05 | 02 dependencies (Needed before), 01 deadlines | |
| BUS-06, BUS-07 | 04 personas and geography, 11 locale, 02 constraints, 12 Technical Inputs | |
| CAP-01, CAP-03, CAP-04, CAP-05 | 10 NFR measures, 02 facts, 09 volumes | CAP-04 factor `utilization` (appendix) |
| CAP-02 | | Derived from CALC-03; factors `callsPerTxn`, `requestFactor` (appendix) |
| CAP-06 | 12 Technical Inputs | factor `networkOverhead` (appendix) |
| CAP-07, CAP-08, CAP-09 | 10 performance measures, 06x deadlines, 09 freshness | CAP-07 factor `meanLatencyMs` (appendix); CAP-08 project default |
| CAP-10, CAP-11, CAP-12 | 09 schedules, 08 failure handling, 04 scope | |
| REL-01 to REL-10 | 10 availability and recovery measures, 06x exception flows, 02 | |
| DAT-01, DAT-05 | 03 domain concepts and lifecycles, 06x business rules (one entry per workload) | |
| DAT-02 | 02 facts, 09, 10 | Derived from CALC-10; factors `indexFactor`, `copies` (appendix) |
| DAT-03, DAT-04, DAT-06, DAT-07, DAT-08, DAT-09 | 10 security and privacy, 02 constraints, 04 tenants, 09, 12 Technical Inputs | |
| SEC-01 to SEC-08 | 02 constraints, 04 personas, 07 matrix, 08 partners, 10, 12 Technical Inputs | |
| INT-01 to INT-09 | 08 integrations (one INT-01 and INT-03 entry per partner), 12 Technical Inputs | |
| OPS-01 to OPS-08 | 10, 02 | OPS-04 project default |
| ECO-01 to ECO-06 | 01, 02 constraints | |
| HDR-01 to HDR-10 | 00 cover, 01, 04, 12 Technical Inputs | |

Every pre-filled value cites `BRD: <KEY>/<ID>` (for example `BRD: REFUNDS/NFR-03`) or the chunk (`BRD: REFUNDS 10`), with status `Estimated`.

**The BRD chunks named above** (the `brd-unifier` output in `./brd-[slug]/`):

| Chunk | Holds |
|---|---|
| 00 | The cover: name, version, status, owner |
| 01 | The executive summary and context: objectives, background, deadlines |
| 02 | The glossary, assumptions, facts, constraints, and dependencies (with "Needed before") |
| 03 | The definitions and domain concepts, with their lifecycles |
| 04 | The scope and personas: geography, tenants |
| 05 | The user journeys overview and the Use Case Summary |
| 06x | The detailed use cases, one chunk per persona (`06a`, `06b`, ...): deadlines, business rules, exception flows |
| 07 | The users and use cases matrix |
| 08 | The integrations: partners and failure handling |
| 09 | Reporting and analytics: volumes, schedules, freshness |
| 10 | The NFRs: performance, availability, recovery, security, and privacy measures |
| 11 | The summary and UI/UX: locale and accessibility |
| 12 | The appendix, with the Technical Inputs for the SDD |

A combined BRD holds the same content in one file; cite the BRD's own IDs wherever they exist.

**The rows that repeat** get one entry per item the BRDs name: per journey (BUS-02, CAP-07, REL-01), transaction type (CAP-01), scope (REL-03, REL-04, REL-05), dataset, data workload (DAT-01, DAT-05), or external system (INT-01, INT-03). Put the item to size for in the primary entry (`register-and-entries.md` § Entries).

**The classification rows.** HDR-07 (change type) and HDR-08 (intended target) are pre-filled only when the BRD states them, for example a Technical Input that names on-prem hosting as a constraint, or a scope that replaces an existing system. Classification rules: `classification-and-paths.md`.

---

## What the engine derives and defaults

The engine applies these itself, on `new` and on every `derive`, and recomputes them after every answer. The skill never writes them, and never works one out by hand.

**Derived rows** (formula results, kind `forecast`, written to the primary entry):

| Row | Calculation | From |
|---|---|---|
| CAP-02 | CALC-03, peak API RPS | CAP-01, CAP-04 (its peak factor), and CAP-02's factors `callsPerTxn` and `requestFactor` |
| DAT-02 | CALC-10, new logical data per day | CAP-01 and DAT-02's factor `storedKB` |

- A derived value fills an entry that is `Open` and unprotected, and follows its inputs while nobody has answered it.
- When an input becomes TBD, the engine clears its derived value, and the entry reads `Open` again.
- DAT-02 is a fact only a person gives, so a derived DAT-02 is confirmed by a person, never by an answer policy.

Every other calculation (`CALC-01` to `CALC-20`, and `CALC-21` and `CALC-22` per option) gives its result in chunk 04 or chunk 07 through the engine's fragments, and writes no register row.

**Appendix factors** (assumptions, decision 11, though a factor holds no `kind` field of its own; on the primary entry of their row, from [reference/policy-appendix.md](reference/policy-appendix.md)): `utilization` 0.65 on CAP-04, `networkOverhead` 1.2 on CAP-06, `indexFactor` 1.4 and `copies` 2 on DAT-02, `meanLatencyMs` 120 on CAP-07, `callsPerTxn` 3 and `requestFactor` 1.1 on CAP-02. A factor on an entry marked `N/A` is not filled. A new appendix version updates the factors nobody has confirmed.

**Project defaults** (kind assumption):

| Row | Default |
|---|---|
| OPS-04 | `dev, test, stage, prod`, plus `dr` while a REL-05 entry holds `site`, `region`, or `provider` |
| CAP-08 | `Ingress edge; successful and failed requests measured separately` |

A person confirms the derived values, the factors, and the defaults with their group (the factors with the Capacity and Data groups, OPS-04 with Operations, CAP-08 with Capacity), or replaces any of them with the project's own value.

---

## Writing the pre-fill

The pre-fill and the proposals go into the project state as patches with an agent actor, through `node "<skill>/studio/cli.mjs" derive "<state>" --apply "<patch>"` (patch format and ops: `engine-and-studio.md`). The engine keeps every value the skill writes `Estimated` or `Open`, and refuses a value without a source.

1. **Add the entries first.** For each repeating row, one `add` per extra journey, scope, dataset, workload, or external system, each with its `label` (and its `scope` on REL-03 and REL-04), in a patch of their own. `derive` prints each change with the entry ID the engine gave; use those IDs in the next patch, never a guessed number.
2. **Set the values.** One `set` per entry, with `value` in the row's unit and `source: { "type": "brd", "text": "BRD: <KEY>/<ID>" }`. Add the record fields the BRD states: `window`, `measured_at`, `priority` (from the BRD's MoSCoW), `verification`, and `evidence` (the BRD wording, especially after a unit change). Set the sizing factors the BRD states with `set-factor`, with the same kind of source.
3. **Kinds.** Keep the row's default kind unless the BRD states otherwise: for example, a legal or contractual obligation or a stated prohibition makes an entry a hard guardrail. Then set `kind` with a reason that cites the BRD.
4. **Proposals.** For each `Open` entry of REL-01, REL-03, REL-04, and CAP-07, one `propose` with the value and its reason, after the sets.
5. **Questions.** Keep a list of every question the pre-fill leaves (vague words, disagreeing sources, values that need a person) for the discovery summary. Each becomes an unknown `QD-NN` once a person gives its owner and due date, because an unknown cannot be changed after it is added.

Then record each proposal in `decision-log.md` § Proposal record, and go on to stage 1.

**When a patch fails.** An op with an error changes nothing, and neither does the rest of its patch: the engine applies a patch whole or not at all. `derive` prints each error with what to do instead; fix the op and apply the patch again.

# Register and entries

This file defines the Pre-SDD register: its row families, the entries a row holds, each entry's record fields and allowed values, the statuses and sources, proposals, who confirms, the unknowns, the IDs and citations, and the rules the engine applies when it reads a project state. Read it before step 6 of [SKILL.md](SKILL.md).

The register lives in the project state, `./pre-sdd-[slug]/studio/project-state.json`. Its catalogue (the rows, their owner codes, value types, units, default kinds, and factors) is in the engine, `studio/src/engine.js`, and its shape is in `studio/schema/project-state.schema.json`. The skill changes the register only through engine ops (`engine-and-studio.md`), never by editing the file.

---

## Row families

| Family | Rows | Entries | Where it is written up |
|---|---|---|---|
| The 70 checklist items of the Standard | BUS-01 to BUS-08, CAP-01 to CAP-12, REL-01 to REL-10, DAT-01 to DAT-09, SEC-01 to SEC-08, INT-01 to INT-09, OPS-01 to OPS-08, ECO-01 to ECO-06 | One primary entry each; the repeating rows below may hold more | Chunks 03a to 03h, one per group |
| Header rows (the project's identity) | HDR-01 to HDR-10 | One entry each | The header fragment, `01-header.md` |
| Migration overlay rows | OVL-01 to OVL-12 | One entry per workload `WL-NN` | The overlay fragment, `08-overlay.md`, only while the overlay applies |
| Sizing factors | Attached to the row they refine (table below) | One per entry of that row | With their row |

**The 70 items** keep the Standard's IDs and wording. Each group has its own register chunk:

| Group | Name | Chunk |
|---|---|---|
| BUS | Business | `03a-register-business.md` |
| CAP | Capacity | `03b-register-capacity.md` |
| REL | Reliability | `03c-register-reliability.md` |
| DAT | Data | `03d-register-data.md` |
| SEC | Security | `03e-register-security.md` |
| INT | Integration | `03f-register-integration.md` |
| OPS | Operations | `03g-register-operations.md` |
| ECO | Economics | `03h-register-economics.md` |

The chunk letters follow the group's place in the catalogue. The order in which stage 2 asks the groups is a different one, the decision hierarchy (`stages-and-input.md`).

**Header rows:** HDR-01 solution name, HDR-02 business sponsor, HDR-03 product owner, HDR-04 lead architect, HDR-05 architecture review authority, HDR-06 business budget owner, HDR-07 change type, HDR-08 intended target, HDR-09 source platforms, HDR-10 migration direction. The Standard gives them no owner codes, so their `owner` field is empty.

**Overlay rows** OVL-01 to OVL-12 hold one entry per migration workload. The workloads are listed in the project state under the overlay (`WL-01` first); `add-workload` adds one and gives every OVL row its entry for it. The overlay switch says whether these rows count: while it is off, the gates, the validation, and the blueprint ignore them, and their entries stay as they are. Rows, workloads, and the 7R rules: `migration-overlay.md`.

**Sizing factors.** The calculator's inputs that refine an item sit on that item's entries as named factors. Each factor holds a value, a status, a source, and who confirmed it and when.

| Row | Factors | From |
|---|---|---|
| CAP-02 | `callsPerTxn`, `requestFactor` | The policy appendix |
| CAP-04 | `utilization` | The policy appendix |
| CAP-06 | `networkOverhead` | The policy appendix |
| CAP-06 | `requestKB`, `responseKB` | A person or a BRD (facts) |
| CAP-07 | `meanLatencyMs` | The policy appendix |
| CAP-10 | `queryShape` | A person or a BRD (fact) |
| DAT-01 | `storeKind` | A person or a BRD |
| DAT-02 | `indexFactor`, `copies` | The policy appendix |
| DAT-02 | `storedKB`, `initialGB`, `retentionDays` | A person or a BRD (facts) |
| DAT-04 | `primaryLocation`, `recoveryLocation` | A person or a BRD |
| DAT-05 | `transactionNeed` | A person or a BRD |
| ECO-01 | `budgetPressure` | A person or a BRD (fact) |
| INT-08 | `cidrPrefix` | A person or a BRD |
| OVL-07 | `migrationGB` | A person or a BRD |
| OVL-08 | `linkMbps` | A person or a BRD |
| OVL-09 | `cutoverHours` | A person or a BRD |

The seven appendix factors and their values are in [reference/policy-appendix.md](reference/policy-appendix.md). A factor on a row of facts only a person gives (below), other than an appendix factor, is itself such a fact.

---

## Entries

Every row holds one or more entries. **The primary entry, `.1`, is required**: no row is ever empty, and the primary entry is never removed. Other entries are optional.

These rows repeat, one entry per item the Standard answers separately (decision 10):

| Row | One entry per |
|---|---|
| BUS-02 | Journey |
| CAP-01 | Transaction type |
| CAP-07 | Journey |
| REL-01 | Journey |
| REL-03 | Scope and journey |
| REL-04 | Scope and dataset |
| REL-05 | Failure scope |
| DAT-01, DAT-05 | Data workload |
| INT-01, INT-03 | External system |
| OVL-01 to OVL-12 | Migration workload (`WL-NN`) |

Every other row holds exactly one entry. `add` works only on the repeating rows, and `remove` only on an added entry.

**What the engine reads from a repeating row:**

- **REL-05, REL-03, and REL-04 are read per failure scope.** Each REL-05 entry names one failure scope (`host`, `az`, `site`, `region`, `provider`, or `cyber`), and the engine picks a DR strategy for each. For a scope it takes the smallest RTO among the REL-03 entries whose `scope` field names that scope or is blank, and the smallest RPO among the REL-04 entries the same way. Keep one REL-05 entry per failure scope: two entries with the same scope are a blocker (`DUPLICATE-SCOPE@<scope>`).
- **DAT-01 and DAT-05 are read per data workload:** entry 2 onwards of both rows describe the extra workloads, matched by entry number.
- **CAP-01, CAP-07, and REL-01 are read through their primary entry**, and so are DAT-05's factor `transactionNeed` and the OVL-07, OVL-08, and OVL-09 factors (`migrationGB`, `linkMbps`, `cutoverHours`), which the transfer math reads only from the primary entry, the first workload's. The calculations and rules size for the primary entry. When another entry holds a different value, the engine raises the advisory `PRIMARY-ONLY-<row>`, which names the entries it did not read. So make the primary entry the one to size for (the busiest transaction type, the strictest journey), and let the others carry their own values to the chunks and the SDD.
- **BUS-02, INT-01, and INT-03 feed no calculation.** Their entries carry their values to the chunks and the SDD.
- **CAP-03 feeds no calculation either.** No calculation of engine 3.0 reads CAP-03, the peak simultaneously active users (a stage 1 row), so its value feeds no `CALC-NN`: it is locked and lands in the SDD for the SDD's sizing, in §18 (concurrency and session sizing) and as evidence for Q3 (load and availability), as the locked-items fragment's landing table shows.

**Labels.** Give every entry of a repeating row a `label` that names its journey, transaction type, dataset, workload, or external system, as the BRD names it, and a `scope` where the row is read per scope (REL-03, REL-04).

---

## Record fields

Each entry carries the Standard's record fields (Standard § 3), as the project state names them:

| Field | Holds | Allowed values |
|---|---|---|
| `value` | The answer | Per the row's value type (next table); `null` while unanswered |
| `unit` | The unit | Fixed for a number row; text otherwise |
| `window` | The window the value holds for (peak hour, launch, 12 months) | Text |
| `measured_at` | Where it is measured (client, ingress edge, backend, whole workflow) | Text |
| `priority` | The priority | `Must`, `Should`, or `Could` |
| `kind` | The constraint kind | `hard` (hard guardrail), `target` (negotiable target), `forecast`, or `assumption` |
| `verification` | How acceptance is tested, and by whom | Text |
| `status` | The status | `Open`, `Estimated`, `Confirmed`, or `N/A` (§ Statuses) |
| `na_reason` | Why the item does not apply | Text; required for `N/A` |
| `source` | Where the value comes from | `{ type, text }` (§ Sources) |
| `owner` | The owner code | `B`, `E`, `D`, `Sec`, `Ops`, `Fin`, `Legal`, joined by `+` (for example `B+E`); empty on header and overlay rows |
| `owner_name` | The named person who owns an open entry | Text |
| `due` | When the open entry is due | A date, `YYYY-MM-DD` |
| `evidence` | The evidence reference | Text |
| `confirmed_by`, `confirmed_at` | Who confirmed it, and when | A person's name or a label (§ Who confirms), and a UTC timestamp |
| `proposal` | A proposed target beside an `Open` entry | `null`, or `{ value, reason, by, at }` (§ Proposals) |
| `label`, `scope` | The entry's journey or item, and its failure scope | Text; `scope` is one of the six failure scopes |
| `workload` | The migration workload of an OVL entry | `WL-NN`; empty on every other row |
| `factors` | The sizing factors of the row | Per the factors table |

**Value types.** A number row takes a number in its fixed unit: CAP-01 transactions/day, CAP-02 req/s, CAP-04 × (a multiplier), CAP-05 %/yr, CAP-07 ms, CAP-10 %, REL-01 %, REL-03 s, REL-04 s, DAT-02 GB/day. Convert a value to the row's unit; the engine refuses a change of unit. An enumerated row takes one of its values:

| Row | Values |
|---|---|
| HDR-07 | `greenfield`, `brownfield`, `mixed` |
| HDR-08 | `onprem`, `cloud`, `hybrid`, `undecided` |
| HDR-10 | `none`, `onprem-to-cloud`, `cloud-to-cloud`, `cloud-to-onprem`, `same-platform`, `mixed` |
| REL-05 | `host`, `az`, `site`, `region`, `provider`, `cyber` |
| DAT-03 | `public`, `internal`, `sensitive` |
| DAT-04 | `yes`, `no` |
| DAT-05 | `strong`, `mixed`, `eventual` |
| DAT-07 | `single`, `shared-logical`, `schema-isolated`, `database-isolated`, `deployment-isolated` |
| INT-08 | `public`, `private`, `hybrid`, `partner` |

Every other row takes text. **A blank value is `null` and `Open`, never `0`.** Zero is a real answer (an RPO of 0 seconds), and the engine keeps it. A value that is `Open` or `N/A` reads as TBD in every calculation.

**Kinds.** Each row has a default kind (decision 11): `hard` for BUS-07, BUS-08, SEC-01, SEC-04, DAT-03, DAT-04, and DAT-06; `forecast` for CAP-01, CAP-03, CAP-04, CAP-05, CAP-06, CAP-10, CAP-12, and DAT-02; `target` for every other row. A value the engine derives takes `forecast`, and a default takes `assumption`. A person or the skill may change an entry's kind, always with a reason. A kind a person set is theirs: the skill and an answer policy never change it.

---

## Statuses

| Status | When it applies | Who sets it |
|---|---|---|
| `Open` | No value yet: a new entry, a value the sources do not give, a value a person cleared ("left open"), or an entry reopened with `open` | The engine, by default; anyone who clears a value |
| `Estimated` | A value with a source that nobody has confirmed: a BRD pre-fill, a derivation, a default, an import, or an answer not yet confirmed. A content change to a `Confirmed` entry makes it `Estimated` again | The skill (with a source), the engine, a person, a fixture owner, or an answer policy |
| `Confirmed` | A person confirmed it, or picked a proposal, with who and when recorded | A person, an answer policy for a choice, or a fixture owner (§ Who confirms); never the skill |
| `N/A` | The item does not apply; `na_reason` says why, and the value is empty | A person (or a fixture owner in a test run), with the reason; the engine refuses the skill and an answer policy |

A `Confirmed` value without both who and when is not confirmed: the engine reads it as `Estimated` and raises the advisory `STATUS-<ID>`, which asks for it to be confirmed again.

**Stage 2 ends** when every entry has a status and every `Open` entry has an owner name and a due date. That counts every entry of the header rows and the 70 items, and every OVL entry of every workload while the overlay applies. G1 is met when this holds and G0 is met too: HDR-02, HDR-04, BUS-01, and BUS-03 are not `Open` (`gates-and-signoff.md`).

---

## Sources

Every value carries its source as `{ type, text }`:

| Type | Text | Written by |
|---|---|---|
| `brd` | `BRD: <KEY>/<ID>`, or the chunk, `BRD: <KEY> <NN>` (for example `BRD: REFUNDS/NFR-03`, `BRD: REFUNDS 10`) | The skill, at pre-fill (`prefill-and-derivation.md`) |
| `derived` | `Derived: CALC-NN from <items>` (for example `Derived: CALC-03 from CAP-01, CAP-04, CAP-02`) | The engine |
| `default` | `Default: policy appendix v<N>`, or `Default: project rule <row>` | The engine |
| `import` | `Import: Studio v2.2` | The engine, on `new --import` |
| `answer` | `Answer: <name>, <YYYY-MM-DD>`; `Answer: <name>, <YYYY-MM-DD> (left open)` when the person cleared the value; `Answer: <name>, <YYYY-MM-DD> (proposal accepted)` | The engine, for a person's answer |
| `policy` | `Policy: <policy> (set by <name>, <YYYY-MM-DD>)` | The engine, for an answer policy's answer |
| `fixture` | `Fixture: <owner> (test-run policy)` | The engine, for a fixture owner's answer |
| `none` | Empty | An `Open` entry with no source |

The skill cites a source on every value it writes; the engine refuses a value from the skill without one. The skill writes only the `brd` type itself. A person, a fixture owner, or an answer policy never cites a source: the engine writes their answer's source from who they are and the UTC date.

---

## A hard `Open` entry blocks the gate

An entry of kind `hard` that is `Open` blocks the gate (the Standard's rule), as the blocker `OPEN-<entry ID>`, unless a named person granted a time-bound exception for it. The exception counts only while all of these hold:

- a named person granted it (never the skill, an answer policy, a stand-in, or a fixture owner);
- its expiry date is today (UTC) or later;
- its review date is on or before its expiry date.

The rule covers the header rows, the 70 items, and the OVL rows while the overlay applies. To clear the blocker, a person gives the value, marks the entry `N/A` with the reason, or grants the exception. Exceptions and the gate: `gates-and-signoff.md`.

A number outside its valid range (for example a negative TPS) is a blocker too, `INVALID-<entry ID>.value` (or `INVALID-<entry ID>.<factor>`): the calculations read it as TBD until it is corrected.

---

## Proposals

Only four rows take a proposal: **REL-01** (availability), **REL-03** (RTO), **REL-04** (RPO), and **CAP-07** (P99 latency) (§ 6.4, decision 12).

- **Only the skill proposes,** as the E2E Architect, and only beside an `Open` entry. A proposal holds a value in the row's unit and its reason, tied to the BRD where it can be (for example a monthly disruption limit from BRD chunk 10, or a journey's priority from chunk 05).
- **The entry stays `Open`** until a person or an answer policy picks the proposal (`accept-proposal`). Picking it sets the value, makes the entry `Confirmed`, and writes the source `Answer: <name>, <date> (proposal accepted)`, or the policy's label.
- **A person's own value replaces a proposal:** setting a value clears it.
- **A proposal beside an entry a person left open** may still be made, because a proposal helps exactly when the person does not know the value. Only a person picks it there; an answer policy does not.
- **Never proposed:** a forecast, a measurement, or any other fact only a person gives (next section). The engine refuses a proposal on any row but the four.

Record each proposal and its outcome in `decision-log.md` § Proposal record.

---

## Who confirms

**Only a person confirms a value:** by a tick in the Studio, or by an explicit answer in chat, recorded with who and when (§ 6.4). The engine records the confirmer by the actor that confirmed:

| Actor | Recorded as | May confirm |
|---|---|---|
| A person | Their own name | Any value |
| An answer policy | `Policy: <policy> (set by <name>, <YYYY-MM-DD>)` | A choice only: never a fact only a person gives, a fact factor, an option cost, or an option score |
| A fixture owner (test runs only) | `Fixture: <owner> (test-run policy)` | Any value, as the test-run policy allows |
| The skill (agent) | Never | Nothing: it never confirms, picks a proposal, marks `N/A`, signs, grants, or approves |

**Facts only a person gives** (`factOnly`): CAP-01, CAP-03, CAP-04, CAP-05, CAP-06, CAP-10, CAP-12, DAT-02, INT-03, BUS-04, ECO-01, HDR-01 to HDR-06, the fact factors on those rows, and every option cost. They are never proposed, and an answer policy never sets, confirms, or answers them: the engine refuses it. The skill may pre-fill one from a BRD that states it, as `Estimated`, for a person to confirm. The engine also refuses the skill and an answer policy every owner name and due date, on any entry. Beyond what the engine refuses, the skill's own rule is wider: an answer policy never supplies any other forecast or measurement (SKILL.md § Answer policy).

**Protected values.** A value that is `Confirmed`, or that a person or a fixture owner answered, is protected: only a person (or a fixture owner) changes it, and the engine refuses the skill and an answer policy. The engine still lets them write its owner code; the owner name and the due date come only from a person or a fixture owner, on any entry (`stages-and-input.md`). The rule holds for a label or a wording fix too, so an open item whose accepted answer changes a protected value waits for a person under an answer policy (`Decided - waiting for a person`, `review-and-open-items.md` § The accept loop).

---

## Unknowns

An unknown is an open question the run cannot answer yet, recorded as `QD-NN` in the project state, and listed in chunk 10 with its owner and due date.

| Field | Holds |
|---|---|
| `id` | `QD-NN`: one above the highest number used, closed unknowns included, never reused |
| `entry` | The entry the question is about (an entry ID), or empty |
| `question` | The question, never blank |
| `impact` | What it changes, in a sentence |
| `owner` | Who answers it |
| `due` | When, `YYYY-MM-DD` |
| `status` | `open` or `closed` |
| `resolution`, `closed_by`, `closed_at` | How it was answered, by whom, and when (UTC); set when it closes, empty while it is open |

- **`add-unknown`** records one. Any actor may, since recording a question changes no value; the skill records the questions it finds. No op changes an unknown once it is added, so collect its owner and due date from a person first, and write them with the question.
- **`close-unknown`** closes one, with its resolution. A person or a fixture owner may close one; the skill and an answer policy never do (the engine refuses both): the skill asks the person who owns the question. A closed unknown stays closed: when the question comes back, add a new unknown. To correct an unknown's owner or due date, close it and add a new unknown with the corrected owner or due date.

---

## IDs and citations

IDs are stable once seen, and never renumbered or reused (SKILL.md § Output conventions).

| ID | Form | Example |
|---|---|---|
| Row | The Standard's ID; `HDR-NN`; `OVL-NN` | `REL-03`, `HDR-02`, `OVL-04` |
| Entry | Row ID, a dot, the entry number; `.1` is the primary entry | `REL-03.2` |
| Factor | Entry ID, a dot, the factor name | `CAP-02.1.callsPerTxn` |
| Workload | `WL-NN` | `WL-02` |
| Calculation | `CALC-NN`; per option `CALC-21@OPT-NN` (TCO) and `CALC-22@OPT-NN` (weighted score) | `CALC-03`, `CALC-21@OPT-02` |
| Rule | The Studio's rule IDs, with two renamed so no rule ID equals an item ID (Q2): `LOAD-04` (was `CAP-04`) and `DB-READ-17` (was `DB-READ-11`) | `DR-03`, `LOAD-04` |
| Option, cost, score | `OPT-NN`; `OPT-NN.one_time`, `OPT-NN.monthly`; `OPT-NN.<criterion>` | `OPT-01.monthly` |
| Others | Conditions `COND-NN`, exceptions `EXC-NN`, checklist lines `G3-01` to `G3-14`, decision rules `DT-01` to `DT-15`, unknowns `QD-NN`, risks `R-NN`, open items `OI-NN`, ADRs `ADR-<AREA>-NNN` | `QD-03` |

An entry number is one above the highest number the row has ever used, removed entries included, so a removed `REL-03.3` never comes back as another entry. The engine gives the number when it adds the entry; read it from the change `derive` prints before citing it. Options, workloads, conditions, and exceptions are numbered the same way, one above the highest number in the list and in the history, so a removed `OPT-02`, `WL-02`, `COND-02`, or `EXC-02` never comes back as another one.

**Citations.** Inside the Pre-SDD, prose cites a value by its ID (`REL-03.2`, `CALC-03`), and BRD content by its key and ID (`REFUNDS/NFR-03`), with a link. Downstream documents cite a Pre-SDD ID as `PSDD/<ID>` with a link. The link resolves because each register row is a `### <ROW-ID>` heading in its chunk, so an entry links to its row's heading. From an SDD folder beside the Pre-SDD folder, the citation reads `[PSDD/REL-03.2](../pre-sdd-refunds-platform/03c-register-reliability.md#rel-03)` in the Markdown source. There is one Pre-SDD per SDD, so `PSDD/` needs no key.

---

## Reading a project state: the state gate

Every engine command reads the project state through one gate before it computes anything (`normalizeState`). A person who edits `project-state.json` by hand fixes it against these rules; `node "<skill>/studio/cli.mjs" validate "<state>"` lists what is still wrong (`engine-and-studio.md`).

**Refused at once, alone:**

- A file that is not a Pre-SDD 3.0 project state (`kind` is not `pre-sdd-project-state`). A Studio v2.2 file comes in through the import (`new --import`), which does not bring in its decision history (the skill tells the user so); a Studio save file is read through its `project_state`.
- A `schema_version` that is not 3.x.

**Collected and listed together.** Every other problem goes into one message that starts `The project state cannot be read:` and lists each problem on its own line, in the order of the file: the missing parts, then the register (rows in register order, entries by number), the options, the decisions, the sign-offs, and the unknowns. Each line names the place and says how to fix it. The rules:

1. **Every part is there:** `project` with its `brds` list, `run`, the register's header rows, items, and overlay (its workloads and rows), every row of the catalogue, `options` with its `list` and each option's `shape` and `scores`, `decisions` with its `dr_overrides`, `gate` with its `checklist`, `signoffs`, `conditions`, and `exceptions`, `unknowns`, `history`, and `ui`. One line names every missing part; compare the file with `studio/schema/project-state.schema.json`.
2. **Every row is a list of entries that holds its primary entry.** A row is a list, never empty; each item in it is an entry object; each entry's `n` is a whole number from 1; no two entries of a row share a number; and the row holds entry 1.
3. **Only entry 1 is primary:** `primary` is `true` exactly on the entry whose `n` is 1.
4. **No answer policy on a fact.** An entry of a fact-only row whose source type is `policy`, or whose `confirmed_by` is a `Policy:` or `Stand-in:` label, is refused; so is a fact factor with either mark, and an option cost whose `by` is such a label. A person gives or confirms that fact instead.
5. **Options hold only what the schema defines.** A cost holds `value`, `status`, `by`, and `at`; a score holds `value`, `reason`, `status`, `by`, and `at`; scores and weights are keyed by the criteria (`nfr_fit`, `one_time_cost`, `recurring_tco`, `delivery_time`, `operability`, `security_compliance`, `reversibility`, `uncertainty`). Any other key is refused.
6. **Overrides take their listed values.** The topology override is one of `auto`, `single`, `multiAZ`, `multiAZActive`, `regional`, or `active`. A DR override is keyed by a failure scope and is one of `backup`, `pilot`, `warm`, or `active`.
7. **A sign-off record agrees with itself.** `applicable` is `true` or `false`. With `true`, `decision` is `Approved`, `Approved with conditions`, or `Rejected`. With `false`, `na_reason` gives the reason and `decision` is `null`.
8. **An unknown has a status.** An open unknown holds no `resolution`, `closed_by`, or `closed_at`; a closed one holds all three, with `closed_at` a UTC timestamp.

**Read, not refused** (the engine corrects these, records each in the history as a `normalize` change, and raises the advisory `STATUS-<place>`):

- a value, factor, cost, or score marked `Confirmed` without who and when reads as `Estimated`;
- a blank, `auto`, or `undetermined` topology override reads as `auto` (no override);
- a DR override with one of those values is removed (no override for that scope).

A state that is already correct gives no new record, so reading it twice equals reading it once. A hand edit to the hashed content (the project's name, slug, and BRD list, the register, the options, the decisions, the checklist, the conditions, the exceptions, and the unknowns) after a G3 signature sends G3 back to review.

# Step 6 consistency check: lld-unifier

## Summary

Read: `git diff -- lld-unifier` (27 files) with every changed passage in context; the SDD to LLD interface against sdd-unifier's current templates (in-process Behaviour rows, the §14.10 Delivery line, §18.5, `Event:` and `Schedule:` entry points, the `Chunks:` list, the Child LLDs row and its checks); the BRD to LLD interface against brd-unifier's current templates (chunk 14 Mockup coverage and L2-10b, chunk 16, the master's Delivery Chunks State cell); the business reviewer's LLD hand-off.

`PYTHONIOENCODING=utf-8 python _fixtures/checkers/check_refs.py lld-unifier sdd-unifier`: 226 references checked, 0 problems; the Child LLDs columns match sdd-unifier's.

Counts: A 11, B 14, C 8. README statements now wrong: 8 (plus 4 incomplete).

Needs the user's decision:
- A-8: which chunk 05 sections are derived views (only § 8.2, or also § 8.3, § 8.6, § 8.7).
- A-9: the Child LLDs "SDD version" means the version the LLD reflects, not the one it read (cross-skill wording).
- B-3: a BRD newer than the SDD's register: send the user to sdd-unifier first, or refresh the trace at once.
- B-4: the LLD ERD follows S2-3 (keys and relationships only, no cap), or keeps its columns.
- B-7: §18.5 targets not realised by a §18 row go where their Realised in section maps, not into chunk 12.
- B-9: a report route whose screen has a chunk 14 row: the row wins, with `screen`-only route data.
- B-10: from-code flags a provider write (or durable in-process delivery) with no outbox.

Mechanical, with one reading to confirm: A-5 applies F3's `Superseded` and `Reopened` clause to the LLD, as the decision row reads; the families triage had given the LLD only the `Resolved` path.

## A. Wrong or contradictory

### A-1. The outbox naming rule reads only `13x`, but the SDD puts the publication log in §11.1

- Where: `lld-unifier/chunks/09-cross-cutting.md:59`; `lld-unifier/TEMPLATE-COMBINED.md:355`; `lld-unifier/chunks/05-data-model.md:64`.
- Quote (09:59): "When SDD `13x` DB Modeling names the outbox table or its columns (for example `outbox_event.published_at`), use the SDD names everywhere in this LLD; `outbox` and `processed_at` apply only when it names none."
- Why: two step 6 changes meet here and were never checked together. L2-10f made the SDD's names win, but only from `13x`. D6 (sdd-unifier `chunks/10-events-hub.md:239`, `:243`) says a durable §14.10 Delivery line records each event "in a publication log (its home: §11.1)", and SDD §11.1 is "DB Modeling (Default)" (`sdd-unifier/chunks/07-cross-cutting-concerns.md:17`). The LLD uses its outbox as that log (E4), so an SDD that names the log in §11.1 (for example `event_publication`) gets `outbox` and `processed_at` in the LLD: a name the SDD does not use, and drift the LLD itself created. The 05 Source note has the same gap: it only knows a `13x` Tables Design row as a source.
- Fix (mechanical):
  1. `lld-unifier/chunks/09-cross-cutting.md`, current: "When SDD `13x` DB Modeling names the outbox table or its columns (for example `outbox_event.published_at`), use the SDD names everywhere in this LLD;" new: "When the SDD names the outbox table, the publication log, or their columns (in a `13x` DB Modeling, for example `outbox_event.published_at`, or for the publication log of a durable §14.10 Delivery line in SDD §11.1), use the SDD names everywhere in this LLD;"
  2. `lld-unifier/TEMPLATE-COMBINED.md`, current: "Table and column names follow SDD `13x` DB Modeling when it names them (`outbox` and `processed_at` otherwise)." new: "Table and column names follow the SDD when it names them (a `13x` DB Modeling, or SDD §11.1 for the publication log; `outbox` and `processed_at` otherwise)."
  3. `lld-unifier/chunks/05-data-model.md`, current: "from an SDD, each row restates the SDD `13x` Tables Design row it comes from and links it;" new: "from an SDD, each row restates the SDD row it comes from and links it (a `13x` Tables Design row, or SDD §11.1 for the publication log);"

### A-2. Chunk 05's outbox rows were not widened with E4

- Where: `lld-unifier/chunks/05-data-model.md:54`, `:57`.
- Quote: "| `outbox` | `target_topic` | `text` | NOT NULL | Kafka topic name |" and "Set by the publisher only after the broker acknowledges the send; NULL = pending or retryable".
- Why: E4 widened the outbox to provider writes and durable in-process events, with "the target's acknowledgement" (`09-cross-cutting.md:62`, `pattern-rules.md:51`, and `10-operations.md:23` all changed to say so). The 04 template now says "the row names its target ... and the row is processed only after the provider's success response or the listener's commit" (`04-implementation-template.md:150`). Chunk 05, the table those rules point to, still allows only a Kafka topic as the target and only a broker acknowledgement for `processed_at`. A run that copies 05 has no column for a provider target and a `processed_at` rule that contradicts § 12.4.
- Fix (mechanical):
  1. `lld-unifier/chunks/05-data-model.md`, current: "| NOT NULL | Kafka topic name |" new: "| NOT NULL | The target: the Kafka topic; for a provider write or a durable in-process event, the target it names (`09-cross-cutting.md` § 12.4) |"
  2. `lld-unifier/chunks/05-data-model.md`, current: "Set by the publisher only after the broker acknowledges the send; NULL = pending or retryable" new: "Set by the publisher only after the target acknowledges the row (`09-cross-cutting.md` § 12.4); NULL = pending or retryable"

### A-3. The §10.6 Delivery placeholder contradicts "match SDD §14.10 verbatim"

- Where: `lld-unifier/chunks/07-event-contracts.md:101`, `:107`; `lld-unifier/TEMPLATE-COMBINED.md:327`; `lld-unifier/sdd-to-lld.md:316`.
- Quote (07:101): "> **Delivery:** [Durable, through the publication log / In memory], as the SDD §14.10 Delivery line states it." and (07:107) "the Delivery line, names, phase, DTO, and When match SDD §14.10 verbatim".
- Why: the SDD's line reads "[Durable - recorded in the publication log (§11.1) in the publisher's transaction, redelivered until every listener completes / In memory - lost if the process stops before a listener runs]" (`sdd-unifier/chunks/10-events-hub.md:243`). The LLD placeholder offers different words, while its own Convention, two lines below, demands the SDD line verbatim. A run either copies the SDD sentence (and restates SDD content) or writes the template's short form (and breaks "verbatim", which the reviewer brief checks as contract drift). What the LLD needs is the value: durable or in memory.
- Fix (mechanical):
  1. `lld-unifier/chunks/07-event-contracts.md`, current: "> **Delivery:** [Durable, through the publication log / In memory], as the SDD §14.10 Delivery line states it." new: "> **Delivery:** [Durable / In memory], the value of the SDD §14.10 Delivery line."
  2. `lld-unifier/chunks/07-event-contracts.md`, current: "> **Convention:** the Delivery line, names, phase, DTO, and When match SDD §14.10 verbatim;" new: "> **Convention:** the Delivery value, names, phase, DTO, and When match SDD §14.10 verbatim;"
  3. `lld-unifier/TEMPLATE-COMBINED.md`, current: "> **Delivery:** [Durable, through the publication log / In memory], as the SDD §14.10 Delivery line states it." new: "> **Delivery:** [Durable / In memory], the value of the SDD §14.10 Delivery line."
  4. `lld-unifier/sdd-to-lld.md`, current: "The Delivery line, and per event its name," new: "The Delivery value (durable or in memory), and per event its name,"

### A-4. Step 3c cannot see a BRD chunk 14 change (L3)

- Where: `lld-unifier/SKILL.md:158`; `lld-unifier/sdd-to-lld.md:57`; the chunk 14 row of 16 § 19.1 (`lld-unifier/chunks/16-references.md:21`, `lld-unifier/TEMPLATE-COMBINED.md:561`).
- Quote (SKILL.md:158): "Then compare the BRD versions and the states of BRD chunks 14 and 16 recorded in 16 § 19.1 with the SDD's Source BRDs register and each BRD master." The recorded chunk 14 state is "[as of BRD v[X.X]]".
- Why: the BRD master has no chunk 14 state to compare: its row reads "Living checklist" (`brd-unifier/chunks/brd-master.md:123`). The recorded chunk 14 "state" is only the BRD version, which step 3c already compares. And chunk 14 changes bump no BRD version: only "a change to what chunks 00-13 say about the product" does (`brd-unifier/delivery-chunks.md:426`), and "status and link updates in chunk 14" are listed as not content changes (`:430`). So a new or changed Mockup coverage row (a row added, or its use cases corrected, during to-do step 4) never reaches the one offer L3 decided, although § Refresh triggers lists it ("BRD chunk 14 `MK-NN` rows, screen IDs in the BRD text, or Figma links change"). Two step 6 texts (L3 here, the BRD's version rule) meet at this point. The direct check needs no template change: compare the Mockup coverage rows with what 14 § 17.3 cites. The same sentence also follows "If the SDD is newer, ...", so it can be read as part of that branch; L3 chose option A over B precisely so that a BRD-only change (chunk 16 written) is found without a new SDD version, so the comparison must run either way.
- Fix (mechanical; it implements L3 as decided, alternative in the note):
  1. `lld-unifier/SKILL.md`, current: "Then compare the BRD versions and the states of BRD chunks 14 and 16 recorded in 16 § 19.1 with the SDD's Source BRDs register and each BRD master." new: "Then, whether or not the SDD is newer, compare the BRD versions and the state of BRD chunk 16 recorded in 16 § 19.1 with the SDD's Source BRDs register and each BRD master (for a combined BRD, its cover and `14-todo.md` § Downstream outputs), and each BRD's chunk 14 Mockup coverage rows with the screens and use cases 14 § 17.3 cites. Chunk 14 changes bump no BRD version, so only this row-by-row reading finds them."
  2. `lld-unifier/sdd-to-lld.md`, current: "compares the state in 16 §19.1 (the SDD version, the BRD versions, the state of BRD chunks 14 and 16) with the SDD, its Source BRDs register, and each BRD master," new: "compares the state in 16 §19.1 (the SDD version, the BRD versions, the state of BRD chunk 16) with the SDD, its Source BRDs register, and each BRD master, and each BRD's chunk 14 Mockup coverage rows with 14 §17.3,"
  - Note: the alternative is to record chunk 14's own `**Last updated:**` date (`brd-unifier/chunks/14-todo.md:22`) in 16 § 19.1 and compare that. It needs a template change in both 16 § 19.1 copies, and it fires on every to-do edit, not only on Mockup coverage changes.

### A-5. F3 implemented narrower in the LLD than the decision: no `Superseded` or `Reopened` path

- Where: `lld-unifier/sdd-to-lld.md:202`; the Resolution Log Outcome cell in `lld-unifier/chunks/18-open-items-and-clarifications.md:77` and `lld-unifier/TEMPLATE-COMBINED.md:673`.
- Quote: "An `Open` or `Deferred` item it answers becomes `Resolved`, ... An item it answers in part stays `Open`, and its Resolution Log row names the settled part."
- Why: decision F3 (`_fixtures/notes/step6-decisions.md`) reads: "...; a closed item whose design the change overturns keeps its status with `Superseded by ...`, or reopens when the change leaves a choice open." That clause has no skill qualifier, and sdd-unifier implements it (`sdd-unifier/brd-to-sdd.md:71`, Outcome values "Settled by / Superseded by / Reopened by"). The LLD rule covers only `Open` and `Deferred` items, so a `Resolved` LLD item whose resolution a new SDD version overturns (the C1-2 case: OI-09, OI-10, part of OI-14 overtaken by SDD v1.2) stays `Resolved` with no pointer, and the delta review "never raises an existing item again". The families triage (§ Family 3, item 2) proposed only the narrower LLD text, which the brief followed.
- Fix (mechanical under the F3 row as written; if the user meant the clause for the SDD only, close this item instead):
  1. `lld-unifier/sdd-to-lld.md`, current: "An item it answers in part stays `Open`, and its Resolution Log row names the settled part." new: "An item it answers in part stays `Open`, and its Resolution Log row names the settled part. A `Resolved` item whose resolution the change overturns keeps its status when the change decides the new design, with a Resolution Log row `Superseded by SDD v[X.X]` (or `[KEY] v[X.X]`); when the change leaves a choice open, it goes back to `Open`, with its Concern updated and a Resolution Log row `Reopened by SDD v[X.X]`."
  2. `lld-unifier/chunks/18-open-items-and-clarifications.md` and `lld-unifier/TEMPLATE-COMBINED.md`, current: "Option chosen - short note, or Settled by SDD v[X.X] (or [KEY] v[X.X]) - short note" new: "Option chosen - short note, or Settled by, Superseded by, or Reopened by SDD v[X.X] (or [KEY] v[X.X]) - short note"

### A-6. From-code unmatched entry points against the new `### Workflow:` rule (L2-6)

- Where: `lld-unifier/code-extraction.md:69`; `lld-unifier/agent-orchestration.md:152`; `lld-unifier/sdd-to-lld.md:181` (Check 1); `lld-unifier/SKILL.md:230` (step 6a.1) and `:365`.
- Quote (SKILL.md:365, changed): "Behaviour no BRD use case covers is never a new UC: it gets a `### Workflow:` block when the BRD or SDD asks for it, and is an open question otherwise". Quote (code-extraction.md:69, unchanged): "Any other unmatched endpoint gets `> Confirm: [METHOD] [path] matches no SDD §7.3 entry point; platform endpoint, or behaviour no BRD use case covers?` It is an open question, never a new UC." Quote (Check 1, changed): "Every `### Workflow:` block for behaviour no use case covers has the `No BRD use case - realises [link]` line and no index row."
- Why: in from-code with an SDD, the Phase 2 brief heads every unmatched entry point `### Workflow: [name]` (`agent-orchestration.md:152`, SKILL.md:169). code-extraction still makes every unmatched one an open question, even a job the SDD asks for (the watchdog that realises an NFR), which SKILL.md:365 now gives a `No BRD use case - realises` block. And Check 1 demands a `realises [link]` line on every `### Workflow:` block, including the block of an entry point nothing asks for, which has no link to give. A literal run either invents a link or fails its own check.
- Fix (mechanical):
  1. `lld-unifier/code-extraction.md`, current: "Any other unmatched endpoint gets `> Confirm: [METHOD] [path] matches no SDD §7.3 entry point; platform endpoint, or behaviour no BRD use case covers?` It is an open question, never a new UC." new: "Any other unmatched endpoint that does what the BRD or SDD asks for (a job, a BRD chunk 09 report, an NFR-driven process) gets the `No BRD use case - realises [link]` line of `sdd-to-lld.md` § Use-case traceability, Behaviour no use case covers. The rest get `> Confirm: [METHOD] [path] matches no SDD §7.3 entry point; platform endpoint, or behaviour no BRD use case covers?` They are open questions, never a new UC."
  2. `lld-unifier/sdd-to-lld.md`, current: "Every `### Workflow:` block for behaviour no use case covers has the `No BRD use case - realises [link]` line and no index row." new: "Every `### Workflow:` block for behaviour the BRD or SDD asks for that no use case covers has the `No BRD use case - realises [link]` line and no index row; a from-code block for an entry point nothing asks for carries its `> Confirm:` instead."
  3. `lld-unifier/SKILL.md`, current: "and on each `### Workflow:` block for behaviour no use case covers the line that names what it realises;" new: "and on each `### Workflow:` block for behaviour the BRD or SDD asks for the line that names what it realises;"

### A-7. The Phase 2 brief still asks for a sequence diagram on every workflow (E5)

- Where: `lld-unifier/agent-orchestration.md:161`.
- Quote: "- Mermaid `sequenceDiagram` with all participants (client, controller, service, DB, outbox, Kafka, downstream)."
- Why: E5 changed the 04 template (`04-implementation-template.md:296`), `TEMPLATE-COMBINED.md:194`, and `lld-quality.md:116` to "none for a one-step workflow or a pure CRUD endpoint". The from-code synthesis brief, which writes those workflow narratives, still asks for one per entry point, so from-code output keeps the diagrams the template now says to leave out.
- Fix (mechanical): `lld-unifier/agent-orchestration.md`, current: "- Mermaid `sequenceDiagram` with all participants (client, controller, service, DB, outbox, Kafka, downstream)." new: "- Mermaid `sequenceDiagram` with all participants (client, controller, service, DB, outbox, Kafka, downstream), except for a one-step workflow or a pure CRUD endpoint (`mermaid-diagrams.md` § When NOT to draw a diagram)."

### A-8. The DB Modeling row restates §8.3 and §8.5 to §8.7, which principle 13 does not let it restate (L2-10k)

- Where: `lld-unifier/sdd-to-lld.md:327` against `lld-unifier/SKILL.md:92` and `lld-unifier/sdd-to-lld.md:15` (rule 3).
- Quote (327): "`05-data-model.md` § 8.2 Tables ... + § 8.3 Indexes + § 8.5 Migration Plan + § 8.6 Retention & Archival + § 8.7 Encryption | **Derived view with declared source** (§ One fact, one home, rule 3): these sections restate what the DB Modeling states, each § 8.2 row with a Source link to its SDD Tables Design row". Quote (SKILL.md:92): "Restated content is a review defect (OI Type: Duplication), except in a derived view that names its source on every row (§6.3 Runtime Stack, §8.2 Tables, §13.1 Configuration, §15 SLOs)."
- Why: the row tells the author to restate all five sections, but only § 8.2 carries a Source column (`chunks/05-data-model.md:42`), and principle 13 and rule 3 exempt only § 8.2 (and the ERD). So § 8.3, § 8.6, and § 8.7 copied from the SDD's Indexes, Retention Policy, and Data Encryption are, by principle 13, a Duplication defect the reviewer must raise. The decision row says "05 tables"; the triage named only "§ 8.2 Source column".
- Fix (needs the user's decision: which sections are derived views; recommended (a), which keeps the decided Source column on § 8.2 only):
  - (a) `lld-unifier/sdd-to-lld.md`, current: "these sections restate what the DB Modeling states, each § 8.2 row with a Source link to its SDD Tables Design row;" new: "§ 8.2 restates the Tables Design rows, each with a Source link to its row; § 8.3 and § 8.5 to § 8.7 link the SDD's Indexes, Migration Strategy, Retention Policy, and Data Encryption and add only the implementation delta;"
  - (b) give § 8.3, § 8.6, and § 8.7 a Source column in `chunks/05-data-model.md`, and add them to the derived-view lists in `SKILL.md:92` and rule 3.

### A-9. The Child LLDs row claims the current SDD version after a declined refresh (predates step 6; cheap)

- Where: `lld-unifier/SKILL.md:247` (step 6c) and `lld-unifier/sdd-to-lld.md:218`, against `lld-unifier/SKILL.md:158` (step 3c, last sentence, changed in step 6).
- Quote (sdd-to-lld.md:218): "| SDD version | The SDD version this run read (the SDD's current version) |". Quote (SKILL.md:158): "Never refresh silently: the user accepts the refresh, or the LLD keeps its content and the handoff names the SDD and BRD versions it still reflects."
- Why: step 6c runs on every run that reads an SDD. When the user declines the step 3c refresh, the LLD still reflects the older SDD, but its rewritten row records the current version and drops the out-of-date note (the LLD's "next run rewrites its own row and clears the note", `sdd-unifier/chunks/00-cover-and-changelog.md:37`), so the SDD shows a stale child as current. The out-of-date note exists for exactly this case. sdd-unifier already registers an unlisted LLD "with the SDD version that LLD's references record" (`sdd-unifier/brd-to-sdd.md:45`), which is what the fix makes the LLD write too.
- Fix (needs the user's decision, because the field's meaning changes on both sides: "read" becomes "reflects"):
  1. `lld-unifier/sdd-to-lld.md`, current: "| SDD version | The SDD version this run read (the SDD's current version) |" new: "| SDD version | The SDD version this LLD reflects, as 16 §19.1 records it (after a declined step 3c refresh, the older version) |"
  2. `lld-unifier/SKILL.md`, current: "and the SDD version this run read as SDD version" new: "and the SDD version 16 § 19.1 records as SDD version"
  3. Cross-skill, same meaning: `sdd-unifier/chunks/00-cover-and-changelog.md:37` (and its `TEMPLATE-COMBINED.md` copy), current: "SDD version is the SDD version that LLD last read" new: "SDD version is the SDD version that LLD reflects"; root `README.md:195` "the SDD version it last read" likewise.

### A-10. The business reviewer's LLD hand-off still asks for two requests (L3; cross-skill)

- Where: `business-reviewer-unifier/apply-and-verify.md:219-223`; `business-reviewer-unifier/README.md:63`. (The cross-skill checker may report this too.)
- Quote (apply-and-verify.md:222-223, wrapped): "When a source BRD's use cases, test cases, or screens changed, also "refresh the trace"."
- Why: L3 makes step 3c find the BRD changes along with the new SDD version and make one offer, one update, one bump; its Why was that "the business-reviewer hand-off would then need one request instead of two". A user who follows the hand-off literally sends two requests, which `lld-unifier/SKILL.md:310` ("One request is one update") turns into two updates and two versions.
- Fix (mechanical, in the reviewer folder):
  1. `business-reviewer-unifier/apply-and-verify.md`, current (two wrapped lines): "When a source BRD's use cases, test cases, or screens changed, also "refresh the trace"." new: "Its version check (lld-unifier step 3c) also finds the changed BRDs, so the trace refresh joins the same update: one request, one version."
  2. `business-reviewer-unifier/README.md`, current: " (plus "refresh the trace" when a BRD's use cases, test cases, or screens changed)" new: "" (delete; the LLD's own check covers it).

### A-11. Principle 3 points to transform-detection for a prompt it no longer holds (N-1)

- Where: `lld-unifier/SKILL.md:82`.
- Quote: "See `transform-detection.md` for the prompt and acceptable answers."
- Why: N-1 replaced the prompt in `transform-detection.md:9` with "ask the direction question of SKILL.md step 2, word for word". The pointer now sends a reader to a file that sends them back.
- Fix (mechanical): `lld-unifier/SKILL.md`, current: "See `transform-detection.md` for the prompt and acceptable answers." new: "The prompt is in step 2; `transform-detection.md` has the acceptable answers and the resolution rules."

## B. Ambiguous

### B-1. The delta review and the coverage table (F2)

- Where: `lld-unifier/SKILL.md:253` and `:274` (step 7, item 4).
- Quote (253): "runs a delta review before the handoff: the same reviewer and brief, limited to the chunks the update's Changes Log row lists". Quote (274): "the reviewer records, per service, one line for each implementation risk surface ... Re-dispatch only when a surface is unchecked or a finding lacks evidence."
- Why: a review limited to the changed chunks cannot honestly mark every surface of every service as checked, yet item 4 re-dispatches while a surface is unchecked. Reading 1: the delta reviewer rewrites the whole coverage table (claiming checks it did not make, or looping on re-dispatch). Reading 2: it adds rows for what it read. sdd-unifier's version of the same F2 paragraph settles it: "The coverage record gets one dated line per changed chunk." (`sdd-unifier/SKILL.md:253`). The LLD paragraph lacks that sentence.
- Fix (mechanical, mirrors the SDD's F2 text): `lld-unifier/SKILL.md`, current: "and checks the items the refresh marked settled (`sdd-to-lld.md` § Refresh triggers)." new: "and checks the items the refresh marked settled (`sdd-to-lld.md` § Refresh triggers). In the Reviewer Notes coverage table it adds one dated row per changed chunk, with the surfaces it checked there; earlier rows stay, and item 4's re-dispatch applies to the new rows only."

### B-2. A combined SDD's `Chunks:` list may hold sections

- Where: `lld-unifier/SKILL.md:158`.
- Quote: "take the chunks each row lists after `Chunks:`. For a row without that list (an older SDD), map the sections it names to their chunks."
- Why: the LLD's own Versions bullet says "a combined LLD lists sections" (`SKILL.md:356`), the business reviewer lists "sections only in a combined document" (`business-reviewer-unifier/apply-and-verify.md:97-98`), while sdd-unifier says only "the number of every chunk whose content changed" (`sdd-unifier/SKILL.md:387`). So a combined SDD can end its row with `Chunks:` followed by sections. Step 3c has a rule for a row with no list, not for a list of sections: one reading looks the sections up as chunk numbers and finds nothing, the other maps them.
- Fix (mechanical): `lld-unifier/SKILL.md`, current: "For a row without that list (an older SDD), map the sections it names to their chunks." new: "For a row without that list (an older SDD), or with sections after `Chunks:` (a combined SDD), map the sections to their chunks (the field mapping table names both)."

### B-3. A BRD newer than the SDD's Source BRDs register (L3)

- Where: `lld-unifier/SKILL.md:158`; `lld-unifier/sdd-to-lld.md:57`.
- Quote: "compare the BRD versions ... recorded in 16 § 19.1 with the SDD's Source BRDs register and each BRD master."
- Why: the two references can disagree. A BRD at v1.1 whose SDD register still says v1.0 has not reached the SDD yet. Reading 1: the change fires the "A new BRD version" refresh (all trace rows), and the LLD traces BRD v1.1 use cases and test cases against an SDD §7.3 built from v1.0, which step 6a then reports as disagreements it may not resolve. Reading 2: the offer names the change and sends the user to sdd-unifier first ("BRD <KEY> has a new version"), which is the order root `README.md:197` and `:199` describe. Nothing says which.
- Fix (needs the user's decision; recommended reading 2): `lld-unifier/SKILL.md`, after "with the SDD's Source BRDs register and each BRD master" (in whatever form A-4 leaves it), add: "A BRD newer than the SDD's register is named in the offer with the suggestion to update the SDD first through sdd-unifier (`BRD <KEY> has a new version`); its trace refresh waits for the SDD." Alternative: refresh the trace from the newer BRD at once and flag each §7.3 disagreement `> Confirm:`.

### B-4. The § 8.1 ERD has two sources, and the SDD ERD is now keys only

- Where: `lld-unifier/sdd-to-lld.md:15` (rule 3) and `:327` (13a DB Modeling row); `lld-unifier/chunks/05-data-model.md:16-34`; `lld-unifier/mermaid-diagrams.md:45`.
- Quote (rule 3): "§8.2 Tables (with the §8.1 ERD drawn from them)". Quote (327): "the SDD's ERD becomes the LLD's Mermaid `erDiagram`."
- Why: both texts changed in step 6 (L2-10k), and S2-3 changed the SDD ERD to "entities, keys (PK, FK), and relationships only; every other column lives in Tables Design", with no line cap (`sdd-unifier/chunks/13a-service-detailed-template.md:76`, `sdd-unifier/mermaid-diagrams.md:59`). Reading 1 (row 327): the LLD ERD copies the SDD's keys-only ERD. Reading 2 (rule 3, and the 05 skeleton, which shows `status`, `created_at`, `amount`): it is drawn from § 8.2 with columns, and the LLD's own cap ("no diagram should exceed ~30 lines") splits it. Different diagrams, and a reviewer can call either one Duplication or drift.
- Fix (needs the user's decision, since it carries S2-3 into the LLD; recommended):
  1. `lld-unifier/sdd-to-lld.md`, current: "the SDD's ERD becomes the LLD's Mermaid `erDiagram`. A value that differs from the SDD is drift to flag." new: "the § 8.1 `erDiagram` follows the SDD's ERD: entities, keys, and relationships only, with no line cap; the columns stay in § 8.2. A value that differs from the SDD is drift to flag."
  2. `lld-unifier/sdd-to-lld.md`, current: "§8.2 Tables (with the §8.1 ERD drawn from them)" new: "§8.2 Tables (and the §8.1 ERD of their keys and relationships)"
  3. `lld-unifier/mermaid-diagrams.md:45`, current: "no diagram should exceed ~30 lines. If it does, split into multiple smaller diagrams" new: "no diagram should exceed ~30 lines, except an ERD, which shows entities, keys, and relationships only (the columns live in `05-data-model.md` § 8.2). If another diagram does, split it into multiple smaller diagrams"
  4. `lld-unifier/chunks/05-data-model.md` § 8.1 skeleton: keep only `id`, `tenant_id`, and `foo_id` with their PK and FK marks; drop `status`, `created_at`, `updated_at`, `version`, `description`, and `amount`.
  - Alternative: keep the LLD ERD with columns (an implementer view) and change row 327 to "the § 8.1 `erDiagram` is drawn from the § 8.2 rows; the SDD's ERD gives its entities and relationships".

### B-5. §14.7, §14.8, and §14.9.0 in a modular monolith with no integration events

- Where: `lld-unifier/sdd-to-lld.md:315-316`; `lld-unifier/chunks/07-event-contracts.md:12`.
- Quote (315): "| 10 Centralized Event Hub (§14.1-§14.9, integration events on the broker) | `07-event-contracts.md` § 10.1-10.5 ...". Quote (07:12): "a modular monolith with none writes `Not applicable - no broker` there".
- Why: sdd-unifier step 6 (D4, `sdd-unifier/chunks/10-events-hub.md:30`) now says such an SDD keeps §14.2 to §14.9 as `Not applicable`, "except §14.7 and §14.8, which still apply to the §14.10 events, and §14.9.0, which may hold value objects the §14.10 DTOs share". The LLD maps §14.1-§14.9 only as broker material into § 10.1-10.5, which this LLD writes as `Not applicable - no broker`. Reading 1: the §14.7 doctrines, the §14.8 open flags, and the §14.9.0 value objects are dropped; reading 2: they are carried to § 10.6 (whose Payload (DTO) column needs §14.9.0).
- Fix (mechanical): `lld-unifier/sdd-to-lld.md`, current: "A microservices SDD gives `Not applicable - no in-process events`. |" new: "In a modular monolith with no integration events, the §14.7 doctrines, the §14.8 notes, and the §14.9.0 value objects that apply to the §14.10 events are read here too. A microservices SDD gives `Not applicable - no in-process events`. |"

### B-6. Two step 6 tables restate SDD values but are not on the derived-view list

- Where: `lld-unifier/chunks/09-cross-cutting.md:48-52` (§ 12.3 instance table, L2-9); `lld-unifier/chunks/06-api-contracts.md:123-130` and `lld-unifier/TEMPLATE-COMBINED.md:303-307` (§ 9.6 Idempotency and Transaction columns, D5); `lld-unifier/sdd-to-lld.md:14-15` (rules 2 and 3); `lld-unifier/SKILL.md:92` (principle 13).
- Quote (SKILL.md:92): "except in a derived view that names its source on every row (§6.3 Runtime Stack, §8.2 Tables, §13.1 Configuration, §15 SLOs)." Quote (06 § 9.6 comment): "Idempotency and Transaction are the contract's Behaviour rows, as SDD §15 writes them."
- Why: the § 12.3 instance table restates per-call settings the SDD states (SDD §15 HTTP Behaviour rows "Timeout (consumer side)", "Retries and backoff", "Circuit breaker / bulkhead", `sdd-unifier/chunks/11-api-contracts.md:166-168`; the §12 INT-NN rows) with a Source per row, and § 9.6 copies two Behaviour rows of the SDD contract that its API ID cell links. Both name their source on every row, the mark of a derived view, yet rule 2 says contract bodies are referenced, not copied, and L2-10k's list omits both tables. The reviewer's Duplication surface can flag every such row (reading 1) or accept it (reading 2).
- Fix (mechanical; it aligns L2-9 and D5 with L2-10k):
  1. `lld-unifier/SKILL.md`, current: "(§6.3 Runtime Stack, §8.2 Tables, §13.1 Configuration, §15 SLOs)" new: "(§6.3 Runtime Stack, §8.2 Tables, the §9.6 Idempotency and Transaction cells, §12.3 Resilience instances, §13.1 Configuration, §15 SLOs)"
  2. `lld-unifier/sdd-to-lld.md`, current: "§13.1 Configuration defaults, and §15 SLO rows restate the SDD values the implementer needs (SDD §6, the `13x` DB Modeling, the SDD section that sets each default, §18)" new: "the §9.6 Idempotency and Transaction cells, §12.3 Resilience instances, §13.1 Configuration defaults, and §15 SLO rows restate the SDD values the implementer needs (SDD §6, the `13x` DB Modeling, the §15 contract or §12 integration that sets each port behaviour and resilience value, the SDD section that sets each default, §18)"

### B-7. §18.5 targets that no §18 row realises

- Where: `lld-unifier/sdd-to-lld.md:340`; `lld-unifier/chunks/12-performance.md:21`.
- Quote (340): "| 14 §18.5 NFR Targets | `12-performance.md`: the § 15.1 row, or the meeting-the-targets detail, that realises each target in this LLD's scope |"
- Why: an SDD §18.5 row is realised in "a §18 row, a §11 default, an ADR, or a §17.X section" (`sdd-unifier/chunks/14-performance-and-capacity.md:44`; its example is "99.9% monthly availability" realised in "§11.3"). LLD chunk 12 has no place for an availability, integrity, or lag target: § 15.1 is per endpoint (RPS and latency), and § 15.2-15.6 are caching, indexes, bulkheads, peaks, and load tests. Reading 1: force each such target into a § 15.1 row with `N/A` cells. Reading 2: realise it where the field mapping sends its Realised in section (09 for a §11 default, 03 for a deployment ADR, the owner's 04 file for §17.X) and link the §18.5 row there.
- Fix (needs the user's decision, since TD3's LLD part said "into LLD 12"; recommended reading 2): `lld-unifier/sdd-to-lld.md`, current: "`12-performance.md`: the § 15.1 row, or the meeting-the-targets detail, that realises each target in this LLD's scope" new: "The LLD place that realises each target in this LLD's scope: a `12-performance.md` § 15.1 row for a §18.2 target, otherwise the destination this table gives the target's Realised in section (a §11 default, an ADR, a §17.X section)"

### B-8. The § 18.5 rows leave out flags written in chunk 15 itself (E10)

- Where: `lld-unifier/chunks/15-open-questions.md:55-78`; `lld-unifier/TEMPLATE-COMBINED.md:545`.
- Quote (15:78): "each cell counts the open flags of its kind in that section, as a search for `> Confirm:` and `> TODO:` finds them".
- Why: E10 asks for "a row for every section", and the rows run §1 to §17 and §20. Some rules write a flag into chunk 15 itself: "flag it once in chunk 15 (`> Confirm: the SDD has no Source BRDs register; ...`)" (`sdd-to-lld.md:62`), "from-code notes it in chunk 15 (`> Confirm:`)" (`code-extraction.md:70`). Those flags have no row, so the § 18.5 counts and the 00 Confidence Flag Summary totals differ. Reading 1: they are left out; reading 2: a run adds an unlisted row. (The fix names the row Global rather than §18, because this chunk's own text quotes both flag strings and an unanchored search would count them.)
- Fix (mechanical):
  1. `lld-unifier/chunks/15-open-questions.md`, current: "| 20. Specs | [N] | [N] |" new: that same row, then a new row on the next line: "| Global (flags this chunk holds itself, outside its tables) | [N] | [N] |"
  2. `lld-unifier/TEMPLATE-COMBINED.md`, current: "with a row for every section (§1 to §17, one §7 row per service, and §20)" new: "with a row for every section (§1 to §17, one §7 row per service, and §20) and a Global row for the flags §18 holds itself"

### B-9. A route for a `### Workflow:` block whose screen has a chunk 14 row (L2-6 against L2-10b)

- Where: `lld-unifier/sdd-to-lld.md:124` and `:183` (Check 3); `lld-unifier/chunks/14-frontend.md:46-47`; `lld-unifier/TEMPLATE-COMBINED.md:497-498`.
- Quote (sdd-to-lld.md:124): "A route that serves a `### Workflow:` block (such as a BRD chunk 09 report page) reads `None - no BRD screen ([link to what the block realises])` in both BRD columns and carries no route data." Quote (same bullet): "`Screen (BRD)` holds the screen reference of the screen or flow the route implements, cited and linked as § The link, Targets says (the chunk 14 row wins)". Quote (Check 3): "every route with a BRD screen has its own `data` entry in the 14 §17.3 route configuration".
- Why: a BRD chunk 09 report is a table view, chart, or dashboard (`brd-unifier/chunks/09-reporting-and-analytics.md:12`), and chunk 14 keeps "one row per screen or flow", so a report page can have its own `MK-NN` row. Its route then falls under both rules: "None - no BRD screen" with no route data (L2-6), and the chunk 14 row as the screen with a `data` entry that Check 3 demands (L2-10b, L2-5). The two give different cells and opposite route data.
- Fix (needs the user's decision; recommended): `lld-unifier/sdd-to-lld.md`, current: "reads `None - no BRD screen ([link to what the block realises])` in both BRD columns and carries no route data." new: "reads `None - no BRD screen ([link to what the block realises])` in both BRD columns and carries no route data. When its screen has a chunk 14 row, the row wins: `Screen (BRD)` cites it, `Use cases (BRD)` reads `None - no BRD use case ([link to what the block realises])`, and its route data carries `screen` only." The same sentence goes into the `Screen (BRD)` comment of `chunks/14-frontend.md` and `TEMPLATE-COMBINED.md`, and Check 3 accepts the new cell value.

### B-10. From-code still flags only DB plus broker dual-writes (E4)

- Where: `lld-unifier/pattern-rules.md:206` (§ Anti-patterns to flag) and `:43`; `lld-unifier/agent-orchestration.md:64`.
- Quote (206): "Direct dual-write: a database write plus a broker send in one operation with no outbox record written in the same transaction (send inside the transaction or after commit)", rule cell `"No dual-writes to DB and Kafka"`, severity HIGH.
- Why: E4 widened the Outbox trigger to a provider write and a durable in-process event after a state change (`pattern-rules.md:34`), and the hybrid rule calls a missing outbox HIGH drift. The from-code detection was not widened: the Phase 1 brief and the anti-pattern table name only a broker send, and "`KafkaTemplate.send` (or equivalent)" (`pattern-rules.md:43`) can be read as covering a provider client or not. A direct provider call after commit, the most common dual-write, is flagged by one reading and passes silently in the other. Code alone cannot show "must not be lost", so the flag needs the SDD or a `> Confirm:`.
- Fix (needs the user's decision, since it adds a from-code finding; it adds a row to a table of that file): in `lld-unifier/pattern-rules.md`, after the "Direct dual-write" row, add a row with the finding "A provider call or in-process delivery after a state change with no outbox record, where the SDD marks the side effect as one that must not be lost (no SDD: `> Confirm:`)", the rule cell `"Outbox pattern is mandatory"` (§ Outbox, triggering condition), and severity HIGH; add the same bullet to the Phase 1 anti-pattern list of `agent-orchestration.md`.

### B-11. Update paths outside the step 9 table get no delta review (F2)

- Where: `lld-unifier/SKILL.md:253`; `lld-unifier/transform-detection.md:161-175` (§ Edge cases, "Update this LLD" and "Add a service to this LLD").
- Quote (SKILL.md:253): "A later update that changes LLD content (a step 9 row) runs a delta review before the handoff".
- Why: F2 says "A later SDD or LLD update that changes content runs a cleared-context delta review". The parenthesis limits it to step 9 rows, and adding a service (a whole new 04 file, new 05 to 07 rows, new trace rows) is not a step 9 row: its transform-detection path bumps the version and stops. One reading reviews it, the other does not.
- Fix (mechanical): `lld-unifier/SKILL.md`, current: "A later update that changes LLD content (a step 9 row) runs a delta review before the handoff:" new: "A later update that changes LLD content (a step 9 row, or a `transform-detection.md` § Edge cases path such as adding a service) runs a delta review before the handoff:"

### B-12. The SLO flag comment ignores the new §18.5 source (TD3)

- Where: `lld-unifier/chunks/12-performance.md:21` and `:23`.
- Quote (21, changed): "each row links the SDD §18.2 row (or the §18.5 NFR target) it derives from." Quote (23, changed by E12): "<!-- Unless SDD §18.2 pins a target for every row (confidence-rules.md), write: > Confirm: SLO targets - verify with SDD §18.2 Throughput Targets -->"
- Why: a § 15.1 row that derives from a §18.5 target is pinned by the SDD, but the comment counts only §18.2, so one reading writes the `> Confirm:` for it and the other does not.
- Fix (mechanical): `lld-unifier/chunks/12-performance.md`, current: "<!-- Unless SDD §18.2 pins a target for every row (confidence-rules.md)," new: "<!-- Unless SDD §18.2 or §18.5 pins a target for every row (confidence-rules.md),"

### B-13. One idempotency TTL against per-contract dedup windows (E9)

- Where: `lld-unifier/chunks/09-cross-cutting.md:32`.
- Quote: "| TTL | [The SDD's TTL when it states one; otherwise 24 hours, an LLD default flagged `> Confirm:`] |"
- Why: the SDD states the window per contract: the HTTP Behaviour row "Idempotency | [Key required? Dedup window; replay returns the original response]" (`sdd-unifier/chunks/11-api-contracts.md:165`), and the in-process row "Idempotency | [The idempotency key, and what a repeated call returns]" (`:235`). With two contracts at two windows, "the SDD's TTL" names no single value: a run picks one, or lists both in a one-value cell.
- Fix (mechanical): `lld-unifier/chunks/09-cross-cutting.md`, current: "| TTL | [The SDD's TTL when it states one; otherwise 24 hours, an LLD default flagged `> Confirm:`] |" new: "| TTL | [The SDD's dedup window (its §15 contract Behaviour row, or the owner's `13x` API Standards) when it states one, with one value per contract where they differ; otherwise 24 hours, an LLD default flagged `> Confirm:`] |"

### B-14. "The listener's commit" with several listeners (E4)

- Where: `lld-unifier/chunks/09-cross-cutting.md:62`; `lld-unifier/pattern-rules.md:51`; `lld-unifier/chunks/04-implementation-template.md:150`; `lld-unifier/agent-orchestration.md:53`.
- Quote (09:62): "for the target's acknowledgement (the broker's `acks=all`, the provider's success response, or the listener's commit) and only then sets `processed_at`."
- Why: a §10.6 event has "Listener modules" (plural), and the durable rule is "redelivers it until each listener commits" (`07-event-contracts.md:107`; the SDD says "until every listener completes"). One outbox row has one `processed_at`. "The listener's commit" can be read as the first listener's, which marks the row processed and loses the event for the others.
- Fix (mechanical): replace "the listener's commit" with "every listener's commit" in `09-cross-cutting.md`, `pattern-rules.md`, and `04-implementation-template.md` (each occurs once there), and in `agent-orchestration.md`, current: "(the broker, a provider, or the in-process listener)" new: "(the broker, a provider, or every in-process listener)".

## C. Cosmetic

### C-1. The skill README still says the LLD never restates the SDD (L2-10k)

- Where: `lld-unifier/README.md:31`.
- Quote: "**One fact, one home.** The LLD references the SDD, never restates it."
- Why: SKILL.md principle 13 now ends "except in a derived view that names its source on every row (§6.3 Runtime Stack, §8.2 Tables, §13.1 Configuration, §15 SLOs)".
- Fix (mechanical): `lld-unifier/README.md`, current: "The LLD references the SDD, never restates it." new: "The LLD references the SDD and restates it only in a derived view that names its source on every row (the runtime stack, tables, configuration defaults, and SLOs)."

### C-2. The skill README's review step omits the delta review (F2)

- Where: `lld-unifier/README.md:61` (workflow step 8).
- Quote: "**Post-generation review.** A cleared-context reviewer subagent (no conversation memory) hunts for unflagged gaps and writes the Open Items and Clarifications chunk".
- Why: families.md § Family 2 listed this line as an optional pointer; it was not added, so the README describes the first build only.
- Fix (mechanical): `lld-unifier/README.md`, after "the reviewer is re-dispatched only when a surface is unchecked or a finding lacks evidence." add: " A later update that changes content gets a delta review of the chunks it changed (SKILL.md step 7, On an update)."

### C-3. Two wordings of the `Missing scenario` type

- Where: `lld-unifier/chunks/18-open-items-and-clarifications.md:27` against `lld-unifier/TEMPLATE-COMBINED.md:646` and `lld-unifier/SKILL.md:271`, `:284`.
- Quote (18:27): "Missing scenario (behaviour the design needs that no BRD use case covers and no BRD or SDD section asks for; never a new UC)". The other three: "behaviour that no BRD use case covers and no BRD or SDD section asks for".
- Why: the template copies differ (the difference predates step 6; both lines were edited in it).
- Fix (mechanical): `lld-unifier/chunks/18-open-items-and-clarifications.md`, current: "Missing scenario (behaviour the design needs that no BRD use case covers" new: "Missing scenario (behaviour that no BRD use case covers"

### C-4. A shortened section name in two template copies (E5)

- Where: `lld-unifier/chunks/04-implementation-template.md:296`; `lld-unifier/TEMPLATE-COMBINED.md:194`.
- Quote: "per `mermaid-diagrams.md` § When NOT to draw)".
- Why: the heading is "When NOT to draw a diagram", and `lld-quality.md:116` cites it in full. check_refs accepts the prefix, so this is wording only.
- Fix (mechanical): in both files, current: "per `mermaid-diagrams.md` § When NOT to draw)" new: "per `mermaid-diagrams.md` § When NOT to draw a diagram)"

### C-5. TEMPLATE-COMBINED has no pointer to the new Source columns (L2-10k)

- Where: `lld-unifier/TEMPLATE-COMBINED.md:267` (§ 8.2) and `:393` (§ 13.1).
- Why: chunks 05 and 10 gained a Source column, and the combined template's sections are bare headings. The same agent added a one-line pointer for § 12.3 (`:351`) and § 18.5 (`:545`), but none here, so a combined run learns of the column only from `sdd-to-lld.md`.
- Fix (mechanical): under `## 8.2 Tables (per service)` add "One table per service with a Source column per row, as in `chunks/05-data-model.md` § 8.2." and under `## 13.1 Configuration (per service)` add "One row per variable with a Source column, as in `chunks/10-operations.md` § 13.1."

### C-6. Three places still treat every chunk 14 row as an `MK-NN` (L2-10b)

- Where: `lld-unifier/SKILL.md:93` (principle 14) and `:153` (step 3b); `lld-unifier/README.md:21`.
- Quote (SKILL.md:93): "Routes map to the BRD's screens (their chunk 14 `MK-NN`, or a screen ID the BRD text carries)". Quote (153): "chunk 14 Mockup coverage (its `MK-NN` rows are the screen references)".
- Why: after L2-10b a row of a BRD written before `MK-NN` is keyed by a screen ID, and the chunk 14 row wins over a screen ID in the text. Not wrong for a current BRD, but the old reading survives here.
- Fix (mechanical):
  1. `lld-unifier/SKILL.md` and `lld-unifier/README.md`, current: "(their chunk 14 `MK-NN`, or a screen ID the BRD text carries)" new: "(the ID of their chunk 14 Mockup coverage row, or a screen ID with no row that the BRD text carries)"
  2. `lld-unifier/SKILL.md`, current: "(its `MK-NN` rows are the screen references)" new: "(its rows, keyed `MK-NN` or, in a BRD written before `MK-NN`, by a screen ID, are the screen references)"

### C-7. The combined Resolution Log lost the new comment (F3)

- Where: `lld-unifier/TEMPLATE-COMBINED.md:669-673` against `lld-unifier/chunks/18-open-items-and-clarifications.md:73`.
- Why: chunk 18's Resolution Log comment now says "An upstream change that settles an item, in whole or in part, adds its row too (sdd-to-lld.md § Refresh triggers)." The combined § 21.3 has no comment.
- Fix (mechanical): under `## 21.3 Resolution Log` in `TEMPLATE-COMBINED.md` add: "<!-- When an open item is resolved, add its row here with a pointer to the LLD update. An upstream change that settles an item, in whole or in part, adds its row too (sdd-to-lld.md § Refresh triggers). -->"

### C-8. An awkward citation in code-extraction (L2-10b)

- Where: `lld-unifier/code-extraction.md:71`.
- Quote: "maps to it (high confidence), cited as `sdd-to-lld.md` § The link says: the chunk 14 row wins."
- Fix (mechanical): current: "cited as `sdd-to-lld.md` § The link says: the chunk 14 row wins." new: "cited as `sdd-to-lld.md` § The link, Targets, says (the chunk 14 row wins)."

## README statements now wrong

Root `README.md`, made wrong by the lld-unifier changes (for the RM stage; not edited here):

- `:162` (SDD to LLD table, row 10 §14): "in-process events get no topic, outbox, or DLQ". A durable §14.10 Delivery line now uses the outbox as its publication log (E4, D6).
- `:434` (§ 4 Key behaviors): "with no HTTP, broker, outbox, or retry settings for them". Same change: durable in-process events use the outbox.
- `:176` (BRD to LLD table, row 14): "a screen ID instead where the BRD text defines one". The chunk 14 row wins; a screen ID is cited only when it has no chunk 14 row, and in a BRD written before `MK-NN` the row is keyed by its screen ID (L2-10b).
- `:197`: "Then tell `lld-unifier` "the SDD has a new version", and also "refresh the trace" when the BRD's use cases, test cases, or screens changed." One request now does both: step 3c also compares the BRD versions and chunk 16 state, makes one offer, and runs one update with one bump (L3).
- `:199`: "then `lld-unifier` "the SDD has a new version" for each child LLD, plus "refresh the trace" when a BRD's use cases, test cases, or screens changed." Same as `:197` (L3).
- `:198`: ""refresh the trace" in the LLD updates the 04 lines, routes, e2e tags, and the index. Nothing else is rewritten." A refresh now also updates 16 §19.1, closes the chunk 18 items the change settles (F3), and ends with a delta review that can add open items (F2).
- `:425` (§ 4 It asks you): "a missing version pin". The LLD never asks for one: §6.3 carries a `> TODO:` and the handoff suggests pinning it in SDD §6 through sdd-unifier (L2-10h). In the same cell, "on an existing LLD whose SDD has moved on, whether to refresh the affected chunks (it lists the SDD changes first)" now also covers a BRD change (L3).
- `:51`: "A downstream document cites upstream content by link and ID and adds only its delta; restating it is a review defect (Type `Duplication`)." The LLD now restates SDD values in derived views with a Source per row: § 8.2 Tables and § 13.1 Configuration joined § 6.3 and § 15 (L2-10k).

Incomplete, not wrong (worth a clause in the same pass):

- `:54`: the reviewer runs on every full generation; an LLD update now gets a delta review (F2), and an upstream change can settle an LLD open item (F3).
- `:196`: the step 3c offer now covers BRD changes too (L3).
- `:163` (row 11 §15): § 9.6 now carries each in-process contract's Idempotency and Transaction rows (D5).
- `:415`: a 04 file can also hold `### Workflow:` blocks for behaviour no use case covers (L2-6).

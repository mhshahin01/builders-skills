# Step 6 consistency check: sdd-unifier

Read-only check of `git diff -- sdd-unifier` (20 files) on `fix/unifier-fix-round`, with the changed passages read in context, the step and item numbers of SKILL.md steps 6a to 10, and the interfaces BRD to SDD, SDD to LLD, and business review to SDD. Line numbers are those of the working tree on 2026-10-04. Quotes are exact; where a quoted line holds an em dash, the quote stops before it.

## Summary

- Counts: A 8, B 11, C 5; root README: 6 statements now wrong, 4 incomplete.
- Queued items: (a) confirmed as A-1 (Stale trigger still 09 to 13x after W7; fix widens only the refresh mark, E1 to E4 unchanged); (b) confirmed as A-3 (proposed endpoints never named in a `whole` or COMBINED run; fix adds a step 9 handoff line); (c) confirmed as A-2 (E3 title). The queued lld item (Behaviour rows and Delivery line wording) is B-6: the values match, but lld-unifier's "verbatim" Delivery line would import the SDD's "(§11.1)"; the fix is in lld-unifier files.
- Interfaces: BRD to SDD reads the cover Status, the master's State cells, and chunks 14 and 16 correctly; the `Needed before` reading has one contradiction (B-3). SDD to LLD: the Child LLDs note, `Chunks:` lists, Behaviour rows, §18.5, and `Event:` / `Schedule:` entry points match what lld-unifier reads, except the COMBINED form of `Chunks:` (B-4) and the Delivery line (B-6). Business review to SDD: the N-5 and W-4 rows match apply-and-verify.md § Hand-off; the gaps are on the SDD side (A-4 "only the derivation's items", A-6 who creates the decision log).
- Every chunk change has its matching `TEMPLATE-COMBINED.md` change (checked by script); step and item numbers in steps 6a to 10 resolve, and no file in the repo cites the renumbered 6a items.
- Needs the user's decision (1):
  - B-8: read literally, the accepted S2-4d wording puts a marker on the API style ADR when a BRD mandate or the user names another style; recommended: write the ADR from that source and keep a marker only when no source settles the style.
- Every other fix is mechanical. A-1 and A-8 change when work happens (more chunk 19 refreshes after edits to chunks 02 to 08; a step 6a rerun after every marker walk), but both only align a trigger with W7 and E4, which the user already decided.

## A. Wrong or contradictory

### A-1. The chunk 19 Stale trigger still stops at chunks 09 to 13x (queued item a: confirmed)

- Where: `sdd-unifier/SKILL.md:313` (8b.4), `:346` (step 10 "regenerate chunk N" row), `:353` (step 10 business review row).
- Quote (8b.4): "a later change to chunks 09, 10, 11, 12, or `13x`, or a new or reopened OI, marks an existing chunk 19 `Stale` on the E2E gate line."
- Why: W7 widened chunk 19's sources to chunks 02 to 13x (8b.3 "a faithful consolidation of chunks 02 to `13x`"; chunk 19 FAITHFULNESS_RULE; `chunking.md:93`; the master). A later change to chunks 02 to 08 (for example an ADR in 06 moving from Proposed to Accepted, which changes what §24.6 may cite, or a new §8.2 actor) now leaves chunk 19 reading `Open - Up to date` while it no longer matches a source. The two step 10 rows repeat the narrow range. The gate (E1 to E4) is not touched by this fix: E3 and E4 stay at 09 to 13x, as W7 decided; only the refresh mark follows the sources.
- Fix (mechanical; follows W7, E1 to E4 unchanged):
  1. `sdd-unifier/SKILL.md`, current: "4. **Refresh rule:** a later change to chunks 09, 10, 11, 12, or `13x`, or a new or reopened OI, marks an existing chunk 19 `Stale` on the E2E gate line." New: "4. **Refresh rule:** a later change to chunks 02 to `13x` (the chunks chunk 19 consolidates), or a new or reopened OI, marks an existing chunk 19 `Stale` on the E2E gate line."
  2. `sdd-unifier/SKILL.md`, current: "If a 09, 10, 11, 12, or `13x` chunk changes, rerun step 6a and mark chunk 19 `Stale` if it exists (refresh through step 8b)." New: "If a 09, 10, 11, 12, or `13x` chunk changes, rerun step 6a. If a chunk from 02 to `13x` changes, mark chunk 19 `Stale` if it exists (refresh through step 8b)."
  3. `sdd-unifier/SKILL.md`, current: "and the review changed a 09, 10, 11, 12, or `13x` chunk or an open item was raised or reopened (step 8b)." New: "and the review changed a chunk from 02 to `13x` or an open item was raised or reopened (step 8b)."

### A-2. E3's title still says "the consolidated chunks" (queued item c: confirmed)

- Where: `sdd-unifier/SKILL.md:309`.
- Quote: "**E3 - No clarification left in the consolidated chunks.**"
- Why: after W7, "the consolidated chunks" of chunk 19 are 02 to 13x, while E3 checks only 09 to 13x and §7.3 (unchanged by decision). The title now names a wider set than the condition's body, and a run that reads the title first can block the gate on a chunk 04 or 07 marker. The chunk 19 GATE line, the master, and the README already say "chunks 09 to 13x".
- Fix (mechanical): `sdd-unifier/SKILL.md`, current: "**E3 - No clarification left in the consolidated chunks.**" New: "**E3 - No clarification left in chunks 09 to `13x` or §7.3.**"

### A-3. Proposed endpoints are named only at the part 2 stop, which `whole` and COMBINED runs do not have (queued item b: confirmed)

- Where: `sdd-unifier/SKILL.md:415`, `sdd-unifier/brd-to-sdd.md:315`, `sdd-unifier/brd-to-sdd.md:432`; step 9 (`SKILL.md:319-336`) has no line for them.
- Quote (`SKILL.md:415`): "and names it as a proposal at the part 2 stop (`brd-to-sdd.md` § SDD-only sections, §17.X)."
- Why: S2-4c's condition for proposing endpoints is that the user is told they are proposals. A `whole` run (always so in COMBINED mode) has no part 2 stop, and the step 9 handoff has no line for proposed endpoints, so a whole derivation proposes endpoints and never names them. A targeted update that adds use cases ("add BRD") has the same gap. Its short handoff reports "each step 9 line whose value changed", so a step 9 line covers it too.
- Fix (mechanical; carries S2-4c to `whole` runs, no new behaviour):
  1. `sdd-unifier/SKILL.md` step 9: after the bullet that ends "with the list of external providers whose documentation the user must supply (§15.6)." (unique in the file), add a new bullet: "- Proposed endpoints (derive-from-BRD), when no part 2 stop named them (a `whole` run, or an update that proposed new ones): each endpoint proposed for a §7.3 entry point, by method and path, named as a proposal to review."
  2. `sdd-unifier/SKILL.md`, current: "and names it as a proposal at the part 2 stop (`brd-to-sdd.md` § SDD-only sections, §17.X)." New: "and names it as a proposal at the part 2 stop, or in the step 9 handoff when there is no part 2 stop (`brd-to-sdd.md` § SDD-only sections, §17.X)."
  3. `sdd-unifier/brd-to-sdd.md`, current: "The part 2 summary names these endpoints as proposals to review (`parts-mode.md` § The checkpoint)." New: "The part 2 summary names these endpoints as proposals to review (`parts-mode.md` § The checkpoint); without a part 2 stop, the step 9 handoff names them (SKILL.md step 9)."
  4. `sdd-unifier/brd-to-sdd.md`, current: "named as proposals at the part 2 stop." New: "named as proposals at the part 2 stop (or in the handoff of a `whole` run)."

### A-4. Chunk 18 says the author appends "only" the derivation's items, but two other steps make the author raise open items

- Where: `sdd-unifier/chunks/18-open-items-and-clarifications.md:10` (GENERATED_BY), `sdd-unifier/chunking.md:42` (row 18).
- Quote (chunk 18): "After that review, the author appends only the open items the derivation rules tell it to raise (SKILL.md step 7)."
- Why: two changed passages make the skill itself (not the reviewer) raise open items: 8b.3 raises a source-chunk problem found by the faithfulness check "as an open item (chunk 18, through step 8)", and the step 10 business review row raises "an open item for each open remainder the review's decision records in `decision-log.md` state" (W-4). "Only the open items the derivation rules tell it to raise" forbids both.
- Fix (mechanical):
  1. `sdd-unifier/chunks/18-open-items-and-clarifications.md`, current: "After that review, the author appends only the open items the derivation rules tell it to raise (SKILL.md step 7)." New: "After that review, the author appends only the open items the skill's rules tell it to raise: the derivation's (SKILL.md step 7), a source-chunk problem found by the chunk 19 faithfulness check (step 8b), and an open remainder of a business review decision (step 10)."
  2. `sdd-unifier/chunking.md`, current: "after that review, the author appends only the open items the derivation rules tell it to raise (SKILL.md step 7)." New: "after that review, the author appends only the open items the skill's rules tell it to raise (the derivation's, SKILL.md step 7; a faithfulness-check source problem, step 8b; a business review's open remainder, step 10)."

### A-5. Check 4 now reads a trigger entry point from the Input table, but four homes still say the List of APIs is the only source

- Where: changed `sdd-unifier/brd-to-sdd.md:134` (check 4, N-3) against unchanged `sdd-unifier/brd-to-sdd.md:100`, `:117`, `sdd-unifier/chunking.md:98`, `sdd-unifier/chunks/03-users-and-use-cases.md:55`, `sdd-unifier/TEMPLATE-COMBINED.md:262`.
- Quote (check 4): "Each entry point exists, exactly as written, in the List of APIs of the service it names (a `Schedule:` or `Event:` trigger, in that service's Input table)."
- Quote (`brd-to-sdd.md:117`): "| Entry points | `13x` List of APIs | Method and path exactly as that list writes them, with the service named when it is not the owner; or the trigger (`Schedule: [name]`, `Event: [EVENT_NAME]`) |"
- Why: S2-4f makes `Event:` triggers common (a handled event is now an Entry points trigger), and check 4 reads triggers from the 13x Input table. The §7.3 "Read from" column, the "Where the use cases are cited" table, the chunking.md summary, and the §7.3 template comments still name the List of APIs as the only home, so a run that fills §7.3 from its stated home finds no trigger. The column also binds "with the service named when it is not the owner" to method and path only, while check 4 ("the service it names") and lld-unifier (`chunks/04-implementation-template.md:301`, "method + path, or Schedule: / Event: triggers, with the service named when it is not the owner") apply it to triggers too.
- Fix (mechanical):
  1. `sdd-unifier/brd-to-sdd.md`, current: "| `13x` List of APIs | Nothing new: its method and path are the entry points §7.3 names | Home of entry points |" New: "| `13x` List of APIs, and the Input table for a trigger | Nothing new: its method and path, or its `Schedule:` or `Event:` trigger, are the entry points §7.3 names | Home of entry points |"
  2. `sdd-unifier/brd-to-sdd.md`, current: "| Entry points | `13x` List of APIs | Method and path exactly as that list writes them, with the service named when it is not the owner; or the trigger (`Schedule: [name]`, `Event: [EVENT_NAME]`) |" New: "| Entry points | `13x` List of APIs (a trigger: the `13x` Input table) | Method and path exactly as that list writes them, or the trigger (`Schedule: [name]`, `Event: [EVENT_NAME]`), with the service named when it is not the owner |"
  3. `sdd-unifier/chunking.md`, current: "entry points from the `13x` List of APIs," New: "entry points from the `13x` List of APIs (a trigger from its Input table),"
  4. `sdd-unifier/chunks/03-users-and-use-cases.md`, current: "Entry points: the named service's List of APIs (13x), method and path exactly as written there; or the trigger (Schedule: [name] / Event: [EVENT_NAME])." New: "Entry points: the named service's List of APIs (13x), method and path exactly as written there; or the trigger (Schedule: [name] / Event: [EVENT_NAME]) from that service's Input table."
  5. `sdd-unifier/TEMPLATE-COMBINED.md`, current: "Entry points: the named service's List of APIs (§17.X), method and path exactly as written there; or the trigger (Schedule: [name] / Event: [EVENT_NAME])." New: "Entry points: the named service's List of APIs (§17.X), method and path exactly as written there; or the trigger (Schedule: [name] / Event: [EVENT_NAME]) from that service's Input table."

### A-6. The decision log's "created on first use" list does not name the new registers' writers

- Where: `sdd-unifier/decision-log.md:8`; interface with `business-reviewer-unifier/apply-and-verify.md:15-19` (Apply rule 3).
- Quote: "Created on first use: when the first decision is recorded (the architecture questionnaire, an ecosystem walkthrough answer, a user override, a resolved clarification, or an accepted open item)."
- Why: F3 added two registers with new writers: § Marker register (a marker settled by the marker walk, a source version, or a review point) and § Business review register, which business-reviewer-unifier writes and for which Apply rule 3 says "the log is created on first use, as that skill says". The list names neither a settled marker nor a review point, so a review of an SDD with no log yet (a GENERATE or TRANSFORM run with an accept-all ecosystem and no open item) has no rule that lets it create the file. This is the SDD twin of the queued brd-unifier item.
- Fix (mechanical): `sdd-unifier/decision-log.md`, current: "Created on first use: when the first decision is recorded (the architecture questionnaire, an ecosystem walkthrough answer, a user override, a resolved clarification, or an accepted open item)." New: "Created on first use: when the first decision is recorded (the architecture questionnaire, an ecosystem walkthrough answer, a user override, a resolved clarification, a settled marker, an accepted open item, or a business review point)."

### A-7. Step 10's new opening sentence sends first-build rows to the delta review

- Where: `sdd-unifier/SKILL.md:340`, against `SKILL.md:253` (step 7, On an update) and `sdd-unifier/parts-mode.md:71`, `:140`, `:163`.
- Quote: "A row that changes content in chunks 01 to 17 runs the delta review of step 7 (On an update) before step 8b and the handoff."
- Why: the sentence covers every row of the table, and three rows change content during the first build: "continue" / "next part" (writes part 2 or 3), "just finish it" (writes the rest in `whole`), and "redo part N" before part 3 is complete. Step 7 says "The full review runs once, on the first build" and runs the delta review only for "A later update"; parts-mode says the reviewer "runs **once**, here, on chunks 00-17" and that a redo is a content change only "If part 3 was complete". Read literally, step 10 runs a delta review at the end of part 2, before chunk 18 exists ("The reviewer reads chunk 18 first") and with no `Chunks:` list to limit it (the first build's row lists none).
- Fix (mechanical): `sdd-unifier/SKILL.md`, current: "A row that changes content in chunks 01 to 17 runs the delta review of step 7 (On an update) before step 8b and the handoff." New: "A row that changes content in chunks 01 to 17 after the first build (a later update: step 7, On an update) runs the delta review before step 8b and the handoff."

### A-8. The marker walk reruns step 6a only "if a contract changed", but E4 needs a rerun after any change to chunks 09 to 13x

- Where: `sdd-unifier/SKILL.md:297` (8.6, new), with the same narrow trigger in `:293` (8.3, unchanged) and `:347` (step 10 "generate the e2e design" row, unchanged); E4 at `:310`. The "regenerate chunk N" row already uses "a 09, 10, 11, 12, or `13x` chunk", and the D agent widened 8b.3's trigger to the same range because E4 needs it.
- Quote (8.6): "Apply each accepted answer as design text, remove the marker, rerun step 6a if a contract changed, and record it under § Marker register in `decision-log.md`."
- Why: every marker the walk settles sits in chunks 09 to 13x or §7.3, so every walk changes what E4 and step 6a items 7 and 8 (data model, use-case traceability) cover. Skipping 6a when "no contract changed" leaves E4 unmet at 8b.1, or, under its date test ("the `**Reconciled:**` date is not older than those changes"), lets the gate open on a same-day change that 6a never saw. A §7.3 owner or entry-point answer, and a DB Modeling answer, are not contracts but are exactly what 6a checks.
- Fix (mechanical; aligns three triggers with E4, the gate unchanged):
  1. `sdd-unifier/SKILL.md`, current: "Apply each accepted answer as design text, remove the marker, rerun step 6a if a contract changed, and record it under § Marker register in `decision-log.md`." New: "Apply each accepted answer as design text, remove the marker, and record it under § Marker register in `decision-log.md`; when the walk ends, rerun step 6a (E4)."
  2. `sdd-unifier/SKILL.md`, current: "If the change touches event contracts, API contracts, roles, or services, rerun step 6a (chunks 10, 11, 12 against the affected `13x` chunks) and update its date." New: "If the change touches chunks 09, 10, 11, 12, or `13x`, rerun step 6a and update its date (E4)."
  3. `sdd-unifier/SKILL.md`, current: "rerun step 6a if contracts changed, then verify E1-E4." New: "rerun step 6a if chunks 09 to `13x` changed, then verify E1-E4."

## B. Ambiguous

### B-1. "the version the register held" names the wrong register

- Where: `sdd-unifier/SKILL.md:253` (step 7, On an update).
- Quote: "(the source BRD's Changes Log rows since the version the register held before the update, or the review tracker)"
- Why: in SKILL.md "the register" is `decision-log.md` (principle 12 "Decision history lives in the register"; step 8.3 "create the register on first use"). The version meant here is the Version cell of the Source BRDs register in chunk 00 § Document Lineage (`brd-to-sdd.md` rule 4). A run can look for a BRD version in the decision log and find none.
- Fix (mechanical): `sdd-unifier/SKILL.md`, current: "since the version the register held before the update" New: "since the version the Source BRDs register (chunk 00 § Document Lineage) held before the update"

### B-2. The edge-case update paths in transform-detection.md stop before the delta review

- Where: `sdd-unifier/transform-detection.md:139-153` ("Update this SDD", "Make a new service spec"); step 7 lists its triggers as "(a step 10 row, `brd-to-sdd.md` § Changes after the SDD exists, or a redone part)" (`SKILL.md:253`).
- Quote (`:153`): "- Bump the version (SKILL.md § Output conventions, Versions)."
- Why: both edge cases are content updates (T2 now gives the first one a back-fill), but each ends at the bump. A run that enters through transform-detection.md (a TARGETED ADD is not named as a step 10 row) skips the delta review that F2 requires, and the "Update this SDD" path also never says to rerun step 6a or set the chunk 19 Stale mark.
- Fix (mechanical):
  1. `sdd-unifier/transform-detection.md`, after the line "- Bump the version (SKILL.md § Output conventions, Versions); the Changes Log row's `Chunks:` list names every chunk changed, the back-filled ones included." (unique), add: "- Then finish as the SKILL.md step 10 row "regenerate chunk N" says: step 6a, the chunk 19 `Stale` mark, and the delta review (step 7, On an update)."
  2. `sdd-unifier/transform-detection.md`, current: "- Bump the version (SKILL.md § Output conventions, Versions)." New: "- Bump the version (SKILL.md § Output conventions, Versions), then run the delta review (SKILL.md step 7, On an update)."

### B-3. A dependency "needed before go-live" both becomes an Integration row and "not the services"

- Where: `sdd-unifier/brd-to-sdd.md:236` (field mapping, Dependencies row; the W-10 cross-skill part). BRD side: `brd-unifier/chunks/02-glossary-assumptions-facts.md:58` (`Needed before`: "[A task / BAT sign-off / Go-live]").
- Quote: "One needed before BAT sign-off or go-live is a launch condition: it informs the rollout and readiness design (the §11.3 promotion path), not the services."
- Why: the same cell starts "Each external dependency becomes an Integration row", and an Integration row is owned by a service (part 1 checklist: "Every integration in 08 names the service that owns it"). For a system needed before go-live (a payment provider, a partner feed), "not the services" contradicts its own §12 row; a run can either drop the row or keep it and ignore the clause. The intent of W-10 (give the timing a home) needs only the first half.
- Fix (mechanical): `sdd-unifier/brd-to-sdd.md`, current: "One needed before BAT sign-off or go-live is a launch condition: it informs the rollout and readiness design (the §11.3 promotion path), not the services." New: "One needed before BAT sign-off or go-live is also a launch condition: name it as a gate in the §11.3 promotion path."

### B-4. The `Chunks:` list has no form for a COMBINED SDD, and a re-chunk has no rule for chunk VERSION headers

- Where: `sdd-unifier/SKILL.md:387` (Versions); `sdd-unifier/chunking.md:179` and `sdd-unifier/modes.md:142` (re-chunk step 5). Readers: `lld-unifier/SKILL.md:158` (step 3c takes "the chunks each row lists after `Chunks:`" and maps them through `sdd-to-lld.md` § Field mapping table, which is keyed by SDD chunk number); `business-reviewer-unifier/apply-and-verify.md:97-99` ("sections only in a combined document ... and ends with the owning skill's `Chunks:` list").
- Quote: "The row ends with `Chunks:` and the number of every chunk whose content changed (the first build's row lists none)."
- Why: a COMBINED SDD has sections, not chunks. A run can list section numbers (as lld-unifier does for its own combined LLD: "a combined LLD lists sections") or chunk numbers; lld-unifier's step 3c only maps chunk numbers, and the delta review is "limited to the chunks the update's Changes Log row lists". Separately, F1 makes each chunk's VERSION "the version in which its content last changed", but a re-chunk of a combined SDD (one version for the whole file) gives no rule for the new chunk headers.
- Fix (mechanical):
  1. `sdd-unifier/SKILL.md`, current: "The row ends with `Chunks:` and the number of every chunk whose content changed (the first build's row lists none)." New: "The row ends with `Chunks:` and the number of every chunk whose content changed (in COMBINED mode, the chunk numbers `chunking.md` § Canonical chunk map gives the changed sections; the first build's row lists none)."
  2. `sdd-unifier/chunking.md`, current: "5. For each chunk, prepend the `<!-- CHUNK: ... -->` comment block and append the `<!-- MASTER: ... | PREV: ... | NEXT: ... -->` footer." New: "5. For each chunk, prepend the `<!-- CHUNK: ... -->` comment block and append the `<!-- MASTER: ... | PREV: ... | NEXT: ... -->` footer. Its VERSION is that of the newest Changes Log row whose `Chunks:` list names it, else the combined file's version."
  3. `sdd-unifier/modes.md`, the same edit on the same sentence (unique there too).

### B-5. Where the delta review writes its coverage record

- Where: `sdd-unifier/SKILL.md:253`; `sdd-unifier/chunks/18-open-items-and-clarifications.md:85` and `TEMPLATE-COMBINED.md:1781` (Reviewer Notes comment); the brief's last paragraph (`SKILL.md:282`).
- Quote: "The coverage record gets one dated line per changed chunk."
- Why: the coverage record is a table with one row per risk surface ("Coverage record first (required): one row per risk surface in the review brief"), and the delta reviewer gets "the same brief", which says "Start the Reviewer Notes section with the coverage record: one row per area in the list above". A delta reviewer can rewrite the whole table (losing the first review's record), add rows per area, or add free lines below it.
- Fix (mechanical):
  1. `sdd-unifier/SKILL.md`, current: "The coverage record gets one dated line per changed chunk." New: "The reviewer keeps the existing coverage record and adds one row per changed chunk, its Risk surface cell reading `[YYYY-MM-DD] delta: chunk NN`."
  2. `sdd-unifier/chunks/18-open-items-and-clarifications.md` and `sdd-unifier/TEMPLATE-COMBINED.md`, current: "A zero-finding review is valid. Then optional free-form notes" New: "A zero-finding review is valid. A delta review (SKILL.md step 7, On an update) keeps these rows and adds one dated row per changed chunk. Then optional free-form notes"

### B-6. lld-unifier asks for the SDD's Delivery line "verbatim", which would import an SDD section number

- Where (cross-skill, lld-unifier owns the files): `lld-unifier/chunks/07-event-contracts.md:101` and `:107`, `lld-unifier/TEMPLATE-COMBINED.md:327`, `lld-unifier/sdd-to-lld.md:316`. SDD side: `sdd-unifier/chunks/10-events-hub.md:243` and `TEMPLATE-COMBINED.md:784` ("**Delivery:** [Durable - recorded in the publication log (§11.1) in the publisher's transaction, redelivered until every listener completes / In memory - lost if the process stops before a listener runs]").
- Quote (lld 07): "> **Convention:** the Delivery line, names, phase, DTO, and When match SDD §14.10 verbatim;"
- Why: the queued lld item. The values match ("Durable" or "In memory"; the Behaviour rows Idempotency and Transaction match by name). But the LLD template's own Delivery placeholder is "[Durable, through the publication log / In memory]", while its Convention asks for the SDD line verbatim. Copied verbatim, the SDD line carries "(§11.1)", which in the LLD means its own §11.1 (State Machines), and its publication log there is the outbox of § 12.4. Two readings, two outputs.
- Fix (mechanical, lld-unifier files):
  1. `lld-unifier/chunks/07-event-contracts.md`, current: "the Delivery line, names, phase, DTO, and When match SDD §14.10 verbatim;" New: "the Delivery value (Durable or In memory), names, phase, DTO, and When match SDD §14.10 verbatim;"
  2. `lld-unifier/chunks/07-event-contracts.md` and `lld-unifier/TEMPLATE-COMBINED.md`, current: "In memory], as the SDD §14.10 Delivery line states it." New: "In memory]: the value of the SDD §14.10 Delivery line."
  3. `lld-unifier/sdd-to-lld.md`, current: "The Delivery line, and per event its name, publisher module, listener modules, transaction phase, DTO, and When, as §14.10 writes them." New: "The Delivery value (Durable or In memory), and per event its name, publisher module, listener modules, transaction phase, DTO, and When, as §14.10 writes them."

### B-7. §11.1 is named as the publication log's home but has no slot for it

- Where: `sdd-unifier/chunks/10-events-hub.md:239` and `:243`, `TEMPLATE-COMBINED.md:780` and `:784` (D6), against `sdd-unifier/chunks/07-cross-cutting-concerns.md:17-26` and `TEMPLATE-COMBINED.md:463-472` (§11.1 bullets: engine, PK strategy, auditing columns, soft delete, migrations, naming, indexing, JSON columns).
- Quote: "Durable: each event is recorded in a publication log (its home: §11.1) in the publisher's transaction and redelivered until every listener completes."
- Why: D6 put the log's description in §11.1, but the §11.1 skeleton has no bullet for it, so a durable modular monolith either adds an unnamed bullet or leaves the log undescribed (the step 2 run used Notes). lld-unifier maps "07 §11 Cross-cutting" into 09 § 12 and needs to find it.
- Fix (mechanical, implements the home D6 named): in `sdd-unifier/chunks/07-cross-cutting-concerns.md` and `sdd-unifier/TEMPLATE-COMBINED.md`, after "- **JSON columns:** [Usage rules]" (unique in each), add: "- **Publication log (modular monolith or hybrid core, durable in-process events, §14.10):** [Table, written in the publisher's transaction; redelivery and retention / Not applicable]"

### B-8. The API style ADR gets a marker when a BRD mandates another style, although BRD-mandated choices are locked (needs the user's decision)

- Where: `sdd-unifier/brd-to-sdd.md:291`.
- Quote: "it gets a marker only when a BRD mandate or the user asks for another style."
- Why: the wording is the accepted S2-4d text, but read literally a BRD Technical Input that mandates gRPC or GraphQL produces a `[NEEDS CLARIFICATION: ...]` on the ADR, while step 3c.5 says "BRD-mandated rows are not re-asked" and the field mapping says Technical Inputs override the CLAUDE.md defaults; a user's explicit answer is likewise a decision, not an open question. Two outputs: an ADR written from the mandate or answer, or a marker. The triage text behind S2-4d read "a marker only when no default states a style".
- Fix (needs the user's decision; recommended): `sdd-unifier/brd-to-sdd.md`, current: "it gets a marker only when a BRD mandate or the user asks for another style." New: "when a BRD mandate or the user names another style, the ADR is written from that source instead, and it gets a marker only when no source settles the style."

### B-9. The Versions bullet exempts only the Child LLDs rows lld-unifier writes

- Where: `sdd-unifier/SKILL.md:387`; the rows sdd-unifier itself adds or flags: `brd-to-sdd.md:45` (a sibling LLD with no row "gets one"; a row whose LLD is gone "gets a `[NEEDS CLARIFICATION: ...]`").
- Quote: "and the Child LLDs rows that lld-unifier writes, with their out-of-date note."
- Why: F1 as accepted reads "Status lines, Stale marks, and the Child LLDs rows bump nothing". The narrower wording leaves the rows and flags of the Child LLDs check (which runs on every run, a resume included) as content changes, so a resume that registers a sibling LLD bumps the version and opens a Changes Log row, or not, depending on the reading.
- Fix (mechanical, restores F1's scope): `sdd-unifier/SKILL.md`, current: "and the Child LLDs rows that lld-unifier writes, with their out-of-date note." New: "and the Child LLDs rows (those lld-unifier writes, and those the Child LLDs check adds or flags), with their out-of-date note."

### B-10. Step 8.3 "no IDs ... from the decision's source" against principle 12

- Where: `sdd-unifier/SKILL.md:291` (T7 fix), against `SKILL.md:95` (principle 12: "Compact references to stable IDs (OI-NN, ADR-NN, KEY/UC-NN, AP-NN) inside design text and table cells are allowed").
- Quote: "fitted to the chunk (keyed and linked BRD IDs, no IDs or edit instructions from the decision's source, and wording that reads correctly in place)"
- Why: in the acceptance loop the decision's source is the open item, so the plain reading forbids `OI-07` in the applied text, which principle 12 allows. T7's evidence was a decisions-file ID (`CL-21`), an ID that exists only outside the SDD.
- Fix (mechanical): `sdd-unifier/SKILL.md`, current: "no IDs or edit instructions from the decision's source," New: "no edit instructions and no IDs that exist only in the decision's source (a decisions-file or review-point ID; OI-NN and ADR-NN references stay allowed, principle 12),"

### B-11. A chunk 19 left Stale by its own faithfulness check: linked in the master or not

- Where: `sdd-unifier/SKILL.md:312` (8b.3), against `sdd-unifier/chunks/sdd-master.md:187` ("Link it here once written.").
- Quote: "otherwise raise it as an open item (chunk 18, through step 8), which shuts the gate and marks chunk 19 `Stale` (item 4). Once chunk 19 matches its sources, update the master (chunk 19 linked, E2E gate `Open - Up to date`)"
- Why: on the open-item path (new with F2), chunk 19 has been written but never "matches its sources", so 8b.3 never links it, while the master says to link it "once written" and 8b.4 treats a Stale chunk 19 as an existing one. If the new item is deferred, a run can leave an existing file unlinked or link it.
- Fix (mechanical): `sdd-unifier/SKILL.md`, current: "otherwise raise it as an open item (chunk 18, through step 8), which shuts the gate and marks chunk 19 `Stale` (item 4)." New: "otherwise raise it as an open item (chunk 18, through step 8), which shuts the gate and marks chunk 19 `Stale` (item 4); the master still links chunk 19, since it exists."

## C. Cosmetic

### C-1. The SDD Changes Log template has no pointer to the Versions rule

- Where: `sdd-unifier/chunks/00-cover-and-changelog.md:45-49`, `sdd-unifier/TEMPLATE-COMBINED.md:40-44`.
- Quote: "| 1.0     | YYYY-MM-DD   | [Name]     |             |             | Initial draft. |"
- Why: F1 makes every row end with a `Chunks:` list that lld-unifier step 3c reads, but the template row and table carry no hint of it. brd-unifier's templates got a pointer comment under the same table ("One row per update (delivery-chunks.md § Refresh triggers, Version)."); the SDD's did not.
- Fix (mechanical): in both files, after the table row "| 1.0     | YYYY-MM-DD   | [Name]     |             |             | Initial draft. |" (unique in each), add a blank line and: "<!-- One row per update (SKILL.md § Output conventions, Versions). Each later row's Update Summary ends with `Chunks:` and the number of every chunk whose content changed. -->"

### C-2. Two lists of the in-process contract fields miss the new Behaviour rows

- Where: `sdd-unifier/chunks/sdd-master.md:116`, `sdd-unifier/README.md:17` (D5 updated principle 16, 6a.6, the brief, chunking.md, sdd-quality.md, the questionnaire, and parts-mode, but not these two).
- Quote (master): "in-process: port, DTOs, errors, permission)"
- Fix (mechanical):
  1. `sdd-unifier/chunks/sdd-master.md`, current: "in-process: port, DTOs, errors, permission)" New: "in-process: port, DTOs, errors, permission, behaviour)"
  2. `sdd-unifier/README.md`, current: "or the port, DTOs, errors, and permission of an in-process module call;" New: "or the port, DTOs, errors, permission, and behaviour (idempotency, transaction) of an in-process module call;"

### C-3. Descriptions of the decision log do not name the two new registers; the Clarification register overlaps the Marker register

- Where: `sdd-unifier/SKILL.md:366`, `sdd-unifier/README.md:75`, `sdd-unifier/chunks/sdd-master.md:19`, `sdd-unifier/decision-log.md:62`.
- Quote (`decision-log.md:62`): "One entry per decided open item or clarification."
- Why: F3 added § Marker register and § Business review register; the Reference files line and the README still list the old contents. In the register itself, "or clarification" can be read as an inline clarification marker, which now belongs in § Marker register (SKILL.md step 8.6; `brd-to-sdd.md` "markers under § Marker register").
- Fix (mechanical):
  1. `sdd-unifier/decision-log.md`, current: "One entry per decided open item or clarification.]" New: "One entry per decided open item or clarification question; a settled marker goes to § Marker register.]"
  2. `sdd-unifier/SKILL.md`, current: "walkthrough and delegation notes, part-handoff records)" New: "walkthrough and delegation notes, part-handoff records, settled markers, business review records)"
  3. `sdd-unifier/README.md`, current: "(architecture questionnaire, ecosystem walkthrough, clarification Q&A, who decided what and when)" New: "(architecture questionnaire, ecosystem walkthrough, clarification Q&A, settled markers, business review points, who decided what and when)"
  4. `sdd-unifier/chunks/sdd-master.md`, current: "holds the architecture questionnaire record, the ecosystem selection record, the clarification Q&A, and how each decision was reached." New: "holds the architecture questionnaire record, the ecosystem selection record, the clarification Q&A, the settled markers, the business review records, and how each decision was reached."

### C-4. The sdd-unifier README workflow omits the data-model check and the marker walk

- Where: `sdd-unifier/README.md:65` (workflow step 6), `:67` (step 8).
- Quote: "and API contracts (coverage, URIs, auth tokens) across chunks 10, 11, 12, and 13x,"
- Fix (mechanical):
  1. `sdd-unifier/README.md`, current: "and API contracts (coverage, URIs, auth tokens) across chunks 10, 11, 12, and 13x," New: "and API contracts (coverage, URIs, auth tokens) across chunks 10, 11, 12, and 13x, the data model of each changed 13x (ERD against Tables Design, `tenant_id` in shared-schema keys, NOT NULL, retention),"
  2. `sdd-unifier/README.md`, current: "Then the e2e gate (E1-E4) is checked:" New: "The skill also offers to settle the clarification markers that keep the gate shut, with a recommended answer for each. Then the e2e gate (E1-E4) is checked:"

### C-5. The Faithfulness list's own comment covers only simplifications

- Where: `sdd-unifier/chunks/19-e2e-system-design.md:40`, `sdd-unifier/TEMPLATE-COMBINED.md:1826`; the rules that feed the list: FAITHFULNESS_RULE (`19:10`), the §24.6 comment (`19:138`), the §24.8 comment (`19:152`).
- Quote (chunk 19): "List every simplification made in this chunk's diagrams (e.g., "domain producers clustered into one node in §24.2", "only the 3 load-bearing sagas drawn"). If nothing was simplified, say so."
- Why: W7 and the §24.8 rule also send a doctrine left out of §24.6 (its ADR still Proposed) and a qualifying saga not drawn to "the Faithfulness list". Read on its own, the list's comment lets a run write "nothing was simplified" and drop them.
- Fix (mechanical): in both files, current: "If nothing was simplified, say so." New: "Also name each doctrine left out of §24.6 because its ADR is still Proposed, and each qualifying saga not drawn in §24.8. If there is nothing to list, say so."

## README statements now wrong

Root `README.md` (left for stage RM; listed only):

1. `README.md:337` (chunk 19 row): "End-to-end view consolidated from 09-13x". Now 02 to 13x (W7). Suggested: "End-to-end view consolidated from 02-13x (it cites §8.2 and §8.3 for context and layers): landscape, fan-out maps, sync edges, sagas".
2. `README.md:352`: "§7.3 is a consolidated view: owner from 09, entry points from the `13x` List of APIs, flows from 05, APIs from §15.2, events from §14.5 and §14.10." An `Event:` or `Schedule:` trigger is read from the 13x Input table (check 4, N-3; S2-4f). Suggested: "entry points from the `13x` List of APIs (a trigger from its Input table)".
3. `README.md:332` (chunk 14 row): "Load estimates, throughput targets, peak scenarios, stress testing". §18.5 NFR Targets was added (TD3). Suggested: add ", NFR targets (one row per BRD NFR)".
4. `README.md:197`: "It updates the lineage, derives the delta, reconciles contracts again, and marks chunk 19 `Stale`." The SDD now marks chunk 19 Stale only if it exists (C1), back-fills, bumps once, and runs a delta review (F1, F2, T2). Suggested: "It updates the lineage, derives the delta and back-fills what it makes wrong, reconciles contracts again, marks chunk 19 `Stale` if it exists, and reviews what changed (a delta review)."
5. `README.md:162` (SDD to LLD, row 10 §14): "in-process events get no topic, outbox, or DLQ". With the §14.10 Delivery line (D6) and the LLD's widened outbox rule (E4), a durable in-process delivery uses the outbox as its publication log. Suggested: "in-process events get no topic or DLQ, and an outbox only when the §14.10 Delivery line is durable".
6. `README.md:434` (LLD key behaviors): "with no HTTP, broker, outbox, or retry settings for them." Same cause as item 5. Suggested: "with no HTTP, broker, or retry settings for them, and an outbox only for a durable in-process delivery."

Incomplete rather than wrong (optional in stage RM): `README.md:54` (updates now get a delta review, and every chunk 19 write a faithfulness check: F2), `README.md:338` (decision-log.md also holds settled markers and business review records: F3), `README.md:361` ("It asks you" omits the question on a source BRD that is not Approved, S5, and the marker walk offer, F3), `README.md:133` (a dependency needed before BAT sign-off or go-live also informs the §11.3 promotion path: W-10).

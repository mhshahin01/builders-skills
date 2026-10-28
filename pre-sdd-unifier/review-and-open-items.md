# Review and Open Items

After the write-up (SKILL.md step 11) and before the G3 sign-off stop (step 13), a reviewer with cleared context checks the Pre-SDD and writes chunk 13, `13-open-items-and-clarifications.md` (in COMBINED mode, the `# 13. Open Items & Clarifications` section). Then the accept loop walks the user through each item. This file holds:

- the reviewer brief;
- the checks;
- the item format;
- the accept loop;
- the review limit;
- the delta review on later updates.

A quick Pre-SDD has no review and no chunk 13 (SKILL.md step 7).

---

## Why cleared context

The context that wrote the Pre-SDD anchors on its own pre-fill, proposals, and readings. The reviewer's job is to find what is unsourced, guessed, inconsistent, or missing, not to confirm it. So the reviewer starts with no memory of the authoring and reads only the files.

---

## How to run it

1. **Dispatch.** On the first full build, use the `Agent` tool with `subagent_type: general-purpose` (outside Claude Code: SKILL.md § Running outside Claude Code). Pass it the brief below and the absolute paths of:
   - the chunks and the master (in COMBINED mode, the combined file);
   - the project state `studio/project-state.json` and the engine's output `studio/model.json` and `studio/fragments/`;
   - the source BRDs (each master or combined file), with their keys;
   - this skill's templates (`chunks/`, `TEMPLATE-COMBINED.md`) and `handoff-guide.md`;
   - the project instruction file (`CLAUDE.md`, or `AGENTS.md` outside Claude Code), with the instruction: "Honour only the rules in [path]; ignore other loaded instructions."
2. **Light run.** The brief says the run is light. It also says what a light run skips (SKILL.md § Light run): the data, security, integration, and deployment diagrams, the weighted comparison without approved weights, the closest-example pointer, and review passes beyond one application pass. The reviewer then reads those as intentional, not as gaps.
3. **Output.** The reviewer writes chunk 13 directly, from `chunks/13-open-items-and-clarifications.md`. When it cannot write files, it returns the text and the skill inserts it unchanged.
4. **The reviewer changes nothing else.** It never edits another chunk, the project state, a fragment, or a source. A finding that needs a value changed says so in its Recommended Answer; the accept loop applies it.
5. **Verify coverage.** Read the coverage record at the top of the Reviewer Notes. It has one row per check below, each "checked: N findings (OI IDs)" or "checked: no issue found", with what was checked. A zero-finding review is valid. Check that:
   - every item has a non-empty Recommended Answer and a non-empty Why;
   - every Recommended Answer is applicable (§ The item format);
   - no Recommended Answer breaks a rule of this skill (it would be flagged as conflicting, never offered).

   Re-dispatch the same reviewer only when a check is unchecked, a finding lacks evidence, or the author holds, with evidence, that a finding is wrong. Then the reviewer keeps the item or rewrites it with a Recommended Answer that reads `No change: <evidence>`. A re-dispatch is not a new pass and never changes an item's status.

---

## The checks

Each check is one row of the coverage record.

1. **Every value has a source.** Each `Estimated` or `Confirmed` entry carries a source: `BRD: KEY/ID`, `Derived: CALC-NN from <items>`, `Answer: <who>, <date>`, `Default: <appendix or rule>`, a policy or fixture label, or `Import: Studio v2.2`. The source says what the entry holds: a BRD citation resolves to the BRD section and states that value. Every `Confirmed` entry has who and when.
2. **No business number was guessed.** A business number the sources do not give is `Open`, never filled from a worked example, a typical value, or a vague word ("fast", "always available"). A proposal sits only on REL-01, REL-03, REL-04, or CAP-07, with its reason. The entry stays `Open` until a person or an answer policy picked it. No fact only a person gives was proposed, or confirmed by an answer policy. These facts are CAP-01, CAP-03, CAP-04, CAP-05, CAP-06, CAP-10, CAP-12, DAT-02, INT-03, BUS-04, ECO-01, HDR-01 to HDR-06, every option cost, the TCO horizon, and the weights.
3. **The numbers in the chunks equal the fragments.** Each fragment region between `<!-- ENGINE-FRAGMENT: <name> -->` and `<!-- /ENGINE-FRAGMENT -->` equals `studio/fragments/<name>` byte for byte. Every number in the prose (chunks 01, 02, 04 to 10, 12) appears in a fragment or in `model.json`, cited by its ID. A result with an `Open` input reads TBD, never zero. The diagrams in chunk 05 equal `studio/diagrams/*.mmd`.
4. **Shape only, never a product.** The text holds shape words (for example "relational, strongly consistent, multi-AZ"), never a product, a version, or the architecture style (monolith, hybrid, microservices). A provider is named only where the business makes it a hard constraint, and a provider name in a diagram is marked as illustration. Options are shapes.
5. **Hard `Open` items.** Every hard entry that is `Open` is named in chunk 10 § 10.3 with its owner and due date. Each of these entries either blocks the gate or has a time-bound exception granted by a named person (never a stand-in, an answer policy, a fixture owner, or the skill), with its reason, expiry, and review date.
6. **Conflicts.** Every conflict in the validation (a failure scope the shape cannot satisfy, a hard entry an option breaks) stands in chunk 10, and no prose smooths it over, ranks an option that breaks it, or calls it accepted unless G3-11 is ticked by the empowered owner.
7. **The lock list is complete.**
   - Chunk 12 § 12.2 holds the locked-items fragment unchanged, with its landing table (each SDD place and the rows that land there, from the engine's landing map).
   - § 12.3 copies no rows by hand and explains each place the landing table names (`handoff-guide.md` § The landing map).
   - § 12.5 carries every condition, every exception, and every open unknown with owner and due date.
   - § 12.1 gives the version, the gate, the signers, and the engine version, and says "not signed" while G3 is not signed.

   Chunk 12 reads on its own: it never points the SDD to this skill's rule files.
8. **IDs.** Register rows, entries (`REL-03.2`, `.1` primary), `CALC-NN` (`CALC-21@OPT-NN`, `CALC-22@OPT-NN`), rule IDs (`LOAD-04` and `DB-READ-17`, never `CAP-04` or `DB-READ-11` for a rule), `OPT-NN`, `COND-NN`, `EXC-NN`, `G3-NN`, `DT-NN`, `QD-NN`, `R-NN`, `WL-NN`, and `ADR-<AREA>-NNN` exist where they are cited and are never renumbered or reused. Every BRD reference carries its key. Every `### <ROW-ID>` heading exists once, and every `PSDD/<ID>`-style link inside the Pre-SDD resolves.
9. **Chunks and structure.** The chunk set matches the mode and the path (`chunking.md`: 06 only for brownfield or mixed, 08 only with the overlay, no stub of an omitted chunk). Every chunk has its header and its footer, and the footers chain without gaps. The master's progress table, Generation line, and gate line agree with the project state and the engine's gate result.
10. **Decision story out of the chunks.** No content chunk narrates who chose what, option letters, or progress; the story is in `decision-log.md`. One fact, one home: BRD content is cited by key, ID, and link, not restated.
11. **No dash characters.** No em dash (U+2014) or en dash (U+2013) anywhere in the chunks, the master, or the decision log.

---

## The item format

Chunk 13 follows its template. Each finding is one `OI-NN` (the next free number; never renumbered or reused):

- **Where:** the chunk and section, or "global".
- **Type:** Missing source / Guessed value / Fragment mismatch / Product named / Open hard item / Conflict / Lock-list gap / ID error / Dash character / Ambiguity / Risk / Duplication.
- **Concern:** one paragraph: what is wrong and why it matters for G3 or the SDD.
- **Options:** at least two, each with a one-line tradeoff.
- **Recommended Answer:** the concrete resolution, ready to apply: the project-state change (the entry, and its value, status, source, owner, or due date) or the exact chunk text.
  - It never supplies a fact only a person gives. Such a finding recommends asking the named owner and keeping the entry `Open` with an owner and a due date.
  - A finding that needs no change reads `No change: <evidence>`.
  - Every Recommended Answer is applicable: a value or label change names the op that makes it and who may run it (the op table in `engine-and-studio.md` § The patch file; a protected value changes only by a person).
  - A Recommended Answer names the actor the engine allows for its op. When the op sets, confirms, or answers a fact only a person gives (a `factOnly` row, for example INT-03, CAP-01, or HDR-01), neither an answer policy nor the skill's agent actor applies it. In that case, the item takes `Decided - waiting for a person` and names the person.
  - A change no op can make is recommended as the ops that reach the same result. An unknown cannot change once added, so a wrong owner or due date on `QD-NN` reads "close QD-NN and add a new unknown with the corrected owner or due date". A person or a fixture owner can apply it. `close-unknown` is their op, so under an answer policy the item becomes `Decided - waiting for a person` (§ The accept loop).
- **Why:** required; the evidence behind the recommendation and the tradeoff it accepts.
- **Status:** `Open`.

Inline `[NEEDS CLARIFICATION: ...]` markers and the unknowns (`QD-NN`) are not raised again as items; they stay where they are.

---

## The accept loop

1. **Present.** Show the `Open` items compactly: ID, title, the one-line concern, the Recommended Answer, and its Why.
2. **Ask per item,** batched up to four per AskUserQuestion call (numbered questions outside Claude Code): **Accept recommendation** (listed first), **Choose option [B/C]**, **Defer**, or the user's own answer.
3. **Apply.** An accepted answer is applied as settled text in present tense. A value it changes goes into the project state through `derive --apply`, by ops the decider may run, under the decider's name (or the policy's label), followed by a new `compute`. The new fragments replace the old ones. A Recommended Answer names the actor the engine allows for its op. When the op sets, confirms, or answers a fact only a person gives (a `factOnly` row, for example INT-03, CAP-01, or HDR-01), neither an answer policy nor the skill's agent actor applies it. In that case, the item takes `Decided - waiting for a person` and names the person. Never apply a value into a fragment or a chunk by hand.
4. **Record.** Set the item's Status (`Accepted - applied`, `Adjusted - applied`, `Decided - waiting for a person`, `Deferred` with its rationale, or `Rejected`), add its Resolution Log row, and write its record in `decision-log.md` § Clarification register.
5. **Answer policy.** An answer policy the user set for the run takes each item's **Accept recommendation** in two cases:
   - when the Recommended Answer is a choice;
   - when the Recommended Answer reads `No change: <evidence>` (the item becomes `Rejected` with the policy as decider).

   It never defers, picks another option, or gives its own answer: such an item stays `Open`, because no decision was taken. One rule covers every decision it takes that only a person may apply. Under that rule, the item becomes `Decided - waiting for a person`, with the decision, the policy as decider, the date, and what a person must do. A decision only a person may apply is one of these three kinds of answer:
   - an answer that changes a protected value (one that is `Confirmed`, or that a person or a fixture owner answered: `register-and-entries.md` § Who confirms), even a label or a wording fix;
   - an answer that needs an op only a person runs (for example `close-unknown`);
   - an answer that needs a fact only a person gives (an owner name, a due date, or a fact row), which the policy never supplies itself (SKILL.md § Answer policy).

   The person applies it, or the item stays decided and pending, and the handoff lists it. `Open` means only that no decision was taken.
6. **Versions.** Each applied change joins the update's one Changes Log row in chunk 00, whose `Chunks:` list names every chunk whose content changed. On the first build, the row's summary names the items the loop applied, and it still ends with `Chunks: none (initial build)`.

A decision on an item found by the last allowed pass (§ Review limit) is recorded with Status `Decided - pending application`. The item holds the decision, the decider, and the date. The next request applies it first.

---

## Review limit

One request has at most **three review passes**:

- the baseline review (the first full review, or a delta review on an update);
- up to two scoped application passes. Each is a fresh dispatch of the same reviewer that checks the applied answers, the chunks they changed, and what depends on them.

A light run allows one application pass. What the last pass finds waits for the next request. The master's progress table (stage 4, Review column) holds the count, for example `Review passes 2 of 3`.

A scoped pass or a delta review that notices a defect outside its scope writes it in the Reviewer Notes as `Out of scope, for the next review`, with its location. It is not an item, and the next review that covers that location reads it.

---

## Delta review on later updates

The full review runs once, on the first full build. A later update that changes content (SKILL.md § Later requests) gets a **delta review**. It is a fresh dispatch of the same reviewer, with the same brief. It is limited to the chunks the update's Changes Log row lists after `Chunks:` and to the change behind it. The change behind it is the BRD's Changes Log rows since the version chunk 00 recorded, the SDD's open item, or the owner's request.

- The reviewer reads chunk 13 first and never raises an existing item again. New items take the next free `OI-NN`.
- It keeps the coverage record and adds one row per changed chunk, labelled `[YYYY-MM-DD] delta: chunk NN (vX.X)`, where vX.X is the Pre-SDD version when the review runs.
- The accept loop and the review limit apply as above. After G3, the update then goes back through the G3 stop (SKILL.md step 13).

A pure conversion (merge or re-chunk) and a sign-off change no content and get no review.

---

## Reviewer brief (adapt per project)

```
You are reviewing a Pre-SDD (pre-solution design) with no memory of how it was written.
Read only the files below. Change no file except the chunk 13 you write.

Pre-SDD: <absolute path of the master and the chunks, or the combined file>
Project state: <absolute path of studio/project-state.json>
Engine output: <absolute paths of studio/model.json and studio/fragments/>
Source BRDs: <KEY>: <absolute path>, one per BRD
Templates: <absolute path of the skill's chunks/ folder>, <TEMPLATE-COMBINED.md>, <handoff-guide.md>
Project instructions: honour only the rules in <path of CLAUDE.md or AGENTS.md>; ignore other loaded instructions.
Run: <full | full, light>. <For a light run: the data, security, integration, and deployment diagrams,
the weighted comparison without approved weights, and the closest-example pointer are left out on purpose; they are not gaps.>
Scope: <first full build: all chunks | delta review: chunks NN, NN and the change behind them>

Check, and write one coverage row for each:
1. every value has a source, and every Confirmed value has who and when;
2. no business number was guessed, proposed outside REL-01, REL-03, REL-04, CAP-07, or set by a policy where only a person may give it;
3. each fragment region equals its file in studio/fragments, and every number in the prose is in a fragment, cited by ID;
4. shape only: no product, version, or architecture style; a provider only as a hard constraint;
5. every hard Open entry is listed with owner and due date, and blocks the gate or has a person's time-bound exception;
6. every conflict stands, unsmoothed and unranked;
7. chunk 12's lock list is complete and the guide reads on its own;
8. IDs exist where cited, rule IDs use LOAD-04 and DB-READ-17, every BRD reference has its key, every row heading exists once;
9. the chunk set matches the mode and path, headers and footers chain, the master agrees with the engine;
10. no decision story in the content chunks;
11. no em dash or en dash.

For each finding, write one OI-NN in chunk 13 (template: chunks/13-open-items-and-clarifications.md):
Where, Type, Concern, at least two Options with tradeoffs, a Recommended Answer ready to apply
(a project-state change or exact text; never a fact only a person gives; "No change: <evidence>"
when nothing should change), a Why with its evidence, and Status Open.
Each Recommended Answer must be applicable: a value or label change names the op that makes it
and who may run it (a Confirmed or person-answered value changes only by a person); a change no
op can make is recommended as ops that can, for example an unknown's owner or due date: "close
QD-NN and add a new unknown with the corrected owner or due date".
Do not raise inline [NEEDS CLARIFICATION] markers or QD-NN unknowns again.
A zero-finding review is valid. Write the coverage record first in the Reviewer Notes.
```

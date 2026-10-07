# Step 7 consistency check: sdd-unifier and lld-unifier

Read-only check, 2026-10-07, of the uncommitted step 7 edits on `fix/unifier-live-findings` (working tree against HEAD 548bf5d): `git diff -- sdd-unifier lld-unifier`, the matching lines of the root `README.md`, `sdd-unifier/README.md`, `lld-unifier/README.md`, and the hand-off text of `business-reviewer-unifier`. Nothing in the repository was changed. Line numbers are working-tree lines.

Line endings: every file named below is CRLF in the working tree, with CR count equal to LF count (root `README.md` 562/562, `sdd-unifier/SKILL.md` 437/437, `sdd-unifier/TEMPLATE-COMBINED.md` 2001/2001, `sdd-unifier/chunks/18-open-items-and-clarifications.md` 98/98, `sdd-unifier/chunks/sdd-master.md` 266/266, `sdd-unifier/chunking.md` 194/194, `sdd-unifier/modes.md` 158/158, `sdd-unifier/parts-mode.md` 166/166, `lld-unifier/SKILL.md` 376/376, `lld-unifier/sdd-to-lld.md` 420/420, `lld-unifier/chunking.md` 186/186, `lld-unifier/TEMPLATE-COMBINED.md` 703/703, `lld-unifier/chunks/18-open-items-and-clarifications.md` 93/93). Keep CRLF. Every old string below occurs exactly once in its file. No proposed text contains an em or en dash; the root README text uses only ASCII plus `§` (allowed by `check_readme.py`).

## Summary

Counts: M 1, S 16, D 2.

| ID | Class | File:line | One-line fix |
|---|---|---|---|
| M1 | M | sdd-unifier/SKILL.md:255 | "It is the same cleared-context reviewer" now points at the inserted application-check sentence; make it "The delta review is the same cleared-context reviewer". |
| S1 | S | sdd-unifier/SKILL.md:326 | The Stale branch of Already current requires "sources changed since the basis"; a Stale mark with no source change (a new OI later rejected) fits no branch. Key it on "no claim chunk 19 asserts has changed". |
| S2 | S | sdd-unifier/chunks/18-open-items-and-clarifications.md:10; README.md:344; (sdd-unifier/chunking.md:42) | The 3 B condition is restated three ways; use the SKILL.md wording ("lies in text the request changed" / "did not change") everywhere. |
| S3 | S | sdd-unifier/chunks/18-open-items-and-clarifications.md:10 | 9 B adds an author-raised item ("Text that needs a choice is a new open item") that the exhaustive author-item list ("only") leaves out; add it. |
| S4 | S | README.md:54 | "What the last run finds ... recorded as `Decided - pending application`" now also reads as covering the LLD, which has no such status; scope it to BRD and SDD. |
| S5 | S | lld-unifier/chunking.md:186 (and :185); lld-unifier/SKILL.md:321; lld-unifier/sdd-to-lld.md:202 | "Rewrite only the LLD chunks mapped ..." no longer covers what a refresh changes (chunk 18 items, flags wherever they sit, chunk 15); name them. |
| S6 | S | lld-unifier/sdd-to-lld.md:344 | The new SDD 18 mapping row leaves a `Decided - pending application` SDD item in neither branch; treat it like an open item (flag it). |
| S7 | S | sdd-unifier/SKILL.md:407 (and :328) | The faithfulness note that "bumps nothing" is missing from the Versions list of non-content changes, while bookkeeping says chunk 18 review content counts; add it to the list. |
| S8 | S | sdd-unifier/chunks/sdd-master.md:38; sdd-unifier/TEMPLATE-COMBINED.md:12 | The new gate-line placeholder dropped "if any"; a Stale mark can have no unmet condition (refresh rule, business review, merge). Restore ", if any". |
| S9 | S | README.md:199 | "When SDD §1, §6, or §13 changed" now also scopes the settling of items and the removal of flags; split the sentence. |
| S10 | S | sdd-unifier/modes.md:142 | (Pre-existing; item 4 makes it bite.) Re-chunk VERSION fallback is "the combined file's version", unlike chunking.md:179; a never-listed chunk 19 would get the current version. Use the chunking.md wording. |
| S11 | S | sdd-unifier/parts-mode.md:71 | "Later updates run the delta review" ignores the 1 B application-check baseline; name both. |
| S12 | S | lld-unifier/sdd-to-lld.md:204 | "The update ends with the delta review" ignores the 16 B application check; add it, as SKILL.md:312 now does. |
| S13 | S | sdd-unifier/chunks/18-open-items-and-clarifications.md:85; sdd-unifier/TEMPLATE-COMBINED.md:1801 | The SDD templates do not state the delta row label that SKILL.md:255 sets, while the LLD templates now state theirs; add it. |
| S14 | S | lld-unifier/chunks/18-open-items-and-clarifications.md:83; lld-unifier/TEMPLATE-COMBINED.md:695 | The application-check comment omits that the What was checked cell names each chunk and section the item changed (SKILL.md:255); add it. |
| S15 | S | README.md:168 | The SDD-to-LLD row reads "17 §21" only; sdd-to-lld.md:343 now maps §22 Wishlist (not carried). Add §22. |
| S16 | S | README.md:56 | "not routine cover, index, or footer updates": "index" can be read as the LLD flag index, which is now content (lld 13); say "navigation index". |
| D1 | D | sdd-unifier/chunks/18:85, TEMPLATE-COMBINED.md:1801 vs lld-unifier/SKILL.md:255, chunks/18:83, TEMPLATE-COMBINED.md:695 | Application-check row labels differ (`application check: chunk NN (OI-NN)` vs `application check: OI-NN`). Rec. C: the SDD adopts the OI-keyed label, chunks named in its Checked cell. |
| D2 | D | lld-unifier/SKILL.md:255 | The LLD now applies answers in the same update but has neither the SDD's plain-text application rule nor the 9 B carry rule. Rec. B: one sentence mirroring sdd step 8 item 3. |

---

## M1. Pronoun after the 1 B insert (sdd-unifier/SKILL.md:255)

The 1 B sentence was inserted, as the triage said, right after "runs a delta review before step 8b and the handoff." The next sentence, "It is the same cleared-context reviewer with the same brief, limited to the chunks, or combined sections, the update's Changes Log row lists after `Chunks:` ...", now follows the application-check sentence, so "It" reads as the application check, which the inserted sentence limits differently ("limited to the applied text, the chunks it changed, and what depends on them"). The `delta:` row label two sentences later then also seems to apply to it.

- Old: `It is the same cleared-context reviewer with the same brief`
- New: `The delta review is the same cleared-context reviewer with the same brief`

---

## S1. Already current behind Stale: the "no source change" case (sdd-unifier/SKILL.md:326)

5 A reads: "Behind a `Stale` mark, when sources changed since the basis but no claim chunk 19 asserts changed, keep the body and version as well ... If the basis is missing or a claim changed, regenerate". The refresh rule (SKILL.md:331) also marks chunk 19 Stale for "a new or reopened OI" with no source change. If that OI is later Rejected, the next step 8b finds E1-E4 met, sources unchanged since the basis, and a Stale gate line: the first branch needs "already Open - Up to date", the Stale branch needs "sources changed", the last needs "a claim changed". No branch applies. The accepted decision is claim-based ("a chunk 19 whose asserted claims did not change is kept and verified by a faithfulness check"), so the "sources changed" qualifier only narrows it.

- Old: `Behind a `Stale` mark, when sources changed since the basis but no claim chunk 19 asserts changed, keep the body and version as well:`
- New: `Behind a `Stale` mark, when no claim chunk 19 asserts has changed since the basis, whether or not other source text changed, keep the body and version as well:`

README.md:200 ("a chunk 19 whose source claims did not change is kept as is, after a faithfulness check when it was marked `Stale`") already fits.

## S2. The 3 B condition is stated three ways

SKILL.md:328 (the rule, matching the accepted decision): not raised when "no chunk 19 claim depends on [it] ... and [it] lies in text this request did not change". So it is raised when a claim depends on it or it lies in text the request changed.

- chunks/18:10 says "that a chunk 19 claim depends on or that the request's own change caused". These differ when the request's change makes unchanged text wrong: SKILL.md records it (unchanged text), chunk 18 raises it (caused by the request).
- README.md:344 drops the text condition entirely: it raises only "a chunk 19 source problem that a chunk 19 claim depends on" and notes every finding no claim depends on, which contradicts SKILL.md for a problem in text the request changed.

Fixes (chunks/18:10 is merged with S3 below):

- README.md:344, old: `a chunk 19 source problem that a chunk 19 claim depends on, a business review remainder)`
  new: `a chunk 19 source problem that a chunk 19 claim depends on or that lies in text the request changed, a business review remainder)`
- README.md:344, old: `; a chunk 19 check finding that no chunk 19 claim depends on is noted there too, for its owner`
  new: `; a chunk 19 check finding that no chunk 19 claim depends on, in text the request did not change, is noted there too, for its owner`
- Optional, sdd-unifier/chunking.md:42 (not edited this round), old: `a faithfulness-check source problem, step 8b`
  new: `a faithfulness-check source problem that a chunk 19 claim depends on or that lies in text the request changed, step 8b`

## S3. 9 B adds an author item the chunk 18 list leaves out (sdd-unifier/chunks/18-open-items-and-clarifications.md:10)

SKILL.md:303 (9 B) ends: "Text that needs a choice is a new open item." The sentence sits in the author's application step, right after the author has judged that no single wording is clearly right, so the author raises it (step 7 item 5 already lets the author append items directly in an update). The chunk 18 header says the author "appends only the open items the skill's rules tell it to raise:" and lists four kinds; this one is not among them. Merged fix for line 10 (S2 and S3):

- Old: `the derivation's (SKILL.md step 7), a source-chunk problem found by the chunk 19 faithfulness check that a chunk 19 claim depends on or that the request's own change caused (step 8b),`
- New: `the derivation's (SKILL.md step 7), text an applied decision makes wrong that needs a choice (step 8 item 3), a source-chunk problem found by the chunk 19 faithfulness check that a chunk 19 claim depends on or that lies in text the request changed (step 8b),`

If the intent was instead that the application check raises it, leave line 10's list alone and change SKILL.md:303 "Text that needs a choice is a new open item." to "Text that needs a choice is left for the application check, which raises it as a new open item."

## S4. README pending-application sentence now reaches the LLD (README.md:54)

The cap sentence now lists the LLD ("and LLD reviews after two (...)"), and the next sentence says "What the last run finds is not applied in that request: it stays open, and a decision the owner gives on it is recorded as `Decided - pending application` and applied by the next request." lld-unifier has no `Decided - pending application` status (only brd-unifier and sdd-unifier use it); its application check's gap "becomes a new `Open` item and waits for a later request" (lld SKILL.md:255).

- Old: `it stays open, and a decision the owner gives on it is recorded as `Decided - pending application` and applied by the next request.`
- New: `it stays open, and in a BRD or SDD a decision the owner gives on it is recorded as `Decided - pending application` and applied by the next request.`

## S5. LLD refresh scope after lld 15

sdd-to-lld.md:202 now removes answered flags "wherever they sit" and lists their chunk; the refresh also updates chunk 18 statuses, and the Versions rule (lld SKILL.md:358) makes chunk 15 content. The "new SDD version" summaries still say what is rewritten, and chunking.md says "only":

- lld-unifier/chunking.md:186, old: `plus 16 § 19.1 and this LLD's Child LLDs row in the SDD; rerun SKILL.md step 6a`
  new: `plus 16 § 19.1, this LLD's Child LLDs row in the SDD, and the chunk 18 items and flags the change answers (`sdd-to-lld.md` § Use-case traceability › Refresh triggers); rerun SKILL.md step 6a`
- lld-unifier/SKILL.md:321, old: `16 § 19.1, and this LLD's Child LLDs row (its SDD version); then step 6a`
  new: `16 § 19.1, this LLD's Child LLDs row (its SDD version), and the chunk 18 items and flags the change answers; then step 6a`
- lld-unifier/sdd-to-lld.md:202, old: `and its chunk is listed under `Chunks:`.`
  new: `and its chunk and chunk 15 are listed under `Chunks:`.`
- Optional, lld-unifier/chunking.md:185, old: `(the 04 lines, 14 § 17.3, 13 § 16.8, 16 § 19.1 and § 19.9)`
  new: `(the 04 lines, 14 § 17.3, 13 § 16.8, 16 § 19.1 and § 19.9, and the chunk 18 items and flags the change answers)`

## S6. SDD 18 mapping row and pending decisions (lld-unifier/sdd-to-lld.md:344)

The new row reads the SDD's "open, decided, and deferred items": a decided item "reaches the LLD through the chunks its application changed", and "An open or deferred item that an implementation choice depends on becomes a `> Confirm:` or `> TODO:`". An SDD item at `Decided - pending application` is decided but not yet applied (no chunk carries it; the SDD gate counts it as open), so it falls into neither branch and the LLD would build on body text the decision is about to change.

- Old: `An open or deferred item that an implementation choice depends on becomes a `> Confirm:` or `> TODO:` that cites it.`
- New: `An open, deferred, or `Decided - pending application` item that an implementation choice depends on becomes a `> Confirm:` or `> TODO:` that cites it (a pending decision is not yet SDD design text).`

README.md:169 ("an open one ... becomes a flag") can stay as a summary.

## S7. The faithfulness note and the Versions rule (sdd-unifier/SKILL.md:407, :328)

3 B says "On its own, the note bumps nothing." The Versions list of non-content changes (":407 These are not content changes and bump nothing: ...") does not include it, and bookkeeping (:409) says "Include chunk 18 when its review content/status meaning changes", so it is unclear whether chunk 18 is listed when the same update bumps for another reason. "Only a content change bumps" leaves one coherent reading: the note is not content.

- :407, old: `the E3 marker inventory, the master's chunk 19 note, Stale marks,`
  new: `the E3 marker inventory, the master's chunk 19 note, a chunk 18 Reviewer Notes note of a source problem the chunk 19 faithfulness check did not raise (step 8b item 3), Stale marks,`
- :328, old: `On its own, the note bumps nothing.`
  new: `The note bumps nothing (§ Output conventions, Versions).`

## S8. Gate line placeholder lost "if any" (sdd-unifier/chunks/sdd-master.md:38, sdd-unifier/TEMPLATE-COMBINED.md:12)

Old placeholder: "[open conditions E1-E4, if any]". New: "[Locked or Stale: each unmet condition E1-E4 with a short reason; nothing follows Open - Up to date, ...]". A Stale mark does not imply an unmet condition: the refresh rule (SKILL.md:331) marks Stale on any content change to 02-13x, the business reviewer sets Stale without checking E1-E4 (apply-and-verify.md:118-128), a merge copies a Stale line unchanged (chunking.md:163, modes.md:128), and 5 A itself handles a Stale gate whose conditions are all met.

- Both files, old: `each unmet condition E1-E4 with a short reason; nothing follows`
  new: `each unmet condition E1-E4 with a short reason, if any; nothing follows`

## S9. Conditional scope in the README refresh bullet (README.md:199)

"When SDD §1, §6, or §13 changed, the update also re-synthesises the Specs, and it settles, supersedes, or reopens the chunk 18 items the change answers and removes the flags it answers." The "When" clause now also governs the settling and the new flag removal, which sdd-to-lld.md:202 applies to every refresh.

- Old: `When SDD §1, §6, or §13 changed, the update also re-synthesises the Specs, and it settles, supersedes, or reopens the chunk 18 items the change answers and removes the flags it answers.`
- New: `When SDD §1, §6, or §13 changed, the update also re-synthesises the Specs. Every refresh settles, supersedes, or reopens the chunk 18 items the change answers and removes the flags it answers.`

## S10. Re-chunk VERSION fallback (sdd-unifier/modes.md:142; pre-existing)

Not edited this round, but it contradicts the version rule that item 4 sharpens. chunking.md:179: a chunk no `Chunks:` row names gets "the version of the earliest Changes Log row"; modes.md:142: "else the combined file's version". A chunk 19 written in the first build and kept since (item 4) would be re-chunked at the current version, which `check_versions.py` reports as unlisted.

- Old: `names it or one of its sections, else the combined file's version (SKILL.md § Output conventions, Versions).`
- New: `names it or one of its sections, else the version of the earliest Changes Log row; when no row has a `Chunks:` list (an SDD older than that rule), the combined file's version, noted in the handoff (SKILL.md § Output conventions, Versions).`

## S11. parts-mode after 1 B (sdd-unifier/parts-mode.md:71)

- Old: `Later updates run the delta review (SKILL.md step 7, On an update).`
- New: `Later updates run the review that SKILL.md step 7 (On an update) sets: a delta review, or the application check of applied pending items.`

## S12. sdd-to-lld after 16 B (lld-unifier/sdd-to-lld.md:204)

lld SKILL.md:312 was updated ("ends with the delta review of step 7 (On an update), and the application check when answers were applied"); the parallel sentence was not.

- Old: `The update ends with the delta review (SKILL.md step 7, On an update).`
- New: `The update ends with the delta review (SKILL.md step 7, On an update), and with the application check when answers were applied (SKILL.md step 7, Answers in the same update).`

## S13. SDD templates do not give the delta label

SKILL.md:255 sets "`[YYYY-MM-DD] delta: chunk NN`, or `[YYYY-MM-DD] delta: section N` in COMBINED mode"; the lld templates now carry their label (lld 10, which took the SDD as its model), the SDD templates do not. (If D1 C is chosen, use the merged text in D1.)

- chunks/18:85, old: `keeps these rows and adds one dated row per changed chunk; a scoped application check`
  new: `keeps these rows and adds one dated row per changed chunk, labelled `[YYYY-MM-DD] delta: chunk NN`; a scoped application check`
- TEMPLATE-COMBINED.md:1801, old: `keeps these rows and adds one dated row per changed section; a scoped application check`
  new: `keeps these rows and adds one dated row per changed section, labelled `[YYYY-MM-DD] delta: section N`; a scoped application check`

## S14. LLD templates omit the What was checked rule

lld SKILL.md:255: "its Service cell reads `[YYYY-MM-DD] application check: OI-NN`, and its What was checked cell names each chunk and section the item changed." The templates stop after the label. (If D1 B is chosen, this changes with it.)

- lld chunks/18:83, old: `its Service cell reads `[YYYY-MM-DD] application check: OI-NN`. Free-form`
  new: `its Service cell reads `[YYYY-MM-DD] application check: OI-NN`, and its What was checked cell names each chunk and section the item changed. Free-form`
- lld TEMPLATE-COMBINED.md:695, old: `its Service cell reads `[YYYY-MM-DD] application check: OI-NN`. -->`
  new: `its Service cell reads `[YYYY-MM-DD] application check: OI-NN`, and its What was checked cell names each section the item changed. -->`

## S15. README SDD-to-LLD row and §22 (README.md:168)

sdd-to-lld.md:343 now reads "17 Appendix (§21) and Wishlist (§22) ... The wishlist is not carried: an item that informs near-term implementation goes to `15-open-questions.md` § 18.4". The README row still names §21 only. Cell count stays 3.

- Old: `| 14 §18, 15 §19, 16 §20, 17 §21 |`
  new: `| 14 §18, 15 §19, 16 §20, 17 §21-§22 |`
- Old: `environment configuration is a derived view with a Source per row |`
  new: `environment configuration is a derived view with a Source per row; the §22 wishlist is not carried, except an item that informs near-term implementation, which goes to 15 §18.4 |`

## S16. "index" in the README version rule (README.md:56)

lld 13 replaced "cover/version/index/footer" in lld SKILL.md:360 because "index" could be read as chunk 15, the "Open Questions & Flag Index", which is now content. The README keeps the ambiguous word (the lld triage called this README change optional).

- Old: `not routine cover, index, or footer updates`
- New: `not routine cover, navigation index, or footer updates`

---

## D1. Application-check row label differs between SDD and LLD

- SDD (sdd item 2, S): `[YYYY-MM-DD] application check: chunk NN (OI-NN)`, naming every chunk the item changed (`chunks 02 and 11`); combined: `section N (OI-NN)`. Sits in the Risk surface cell.
- LLD (lld 16 B, accepted text): Service cell `[YYYY-MM-DD] application check: OI-NN`; the What was checked cell names the chunks and sections.

Both are one row per item; the table shapes do not force the difference (the SDD table also has a "Checked" cell that holds what was checked). Both triage reports asked for one shared form (sdd.md item 2: "Coordinate wording ... so both chunk 18 templates label rows the same way"; lld.md item 16: "One row per item, keyed by OI and naming its chunks ... would answer item 2 for both skills"). No checker reads these labels.

- **A. Keep both.** No churn. Two forms for one concept across sibling skills; a future checker needs two patterns.
- **B. LLD adopts the SDD form.** Edits lld SKILL.md:255, chunks/18:83, TEMPLATE-COMBINED.md:695. Changes accepted 16 B text; per-service file names make long Service cells (`application check: 04-implementation/loyalty-points.md and 05 (OI-12)`).
- **C. SDD adopts the LLD form (recommended).** Edits two SDD template comments only; keeps the accepted 16 B text; the item is the natural key of a one-row-per-item rule and the label stays short; the chunk list moves to the Checked cell, so nothing is lost. The SDD v1.7 baseline rows keep their old form as run evidence.

Merged text for C with S13:

- sdd chunks/18:85, old: `keeps these rows and adds one dated row per changed chunk; a scoped application check adds one dated row per checked item, labelled `[YYYY-MM-DD] application check: chunk NN (OI-NN)`, naming every chunk the item changed (`chunks 02 and 11`).`
  new: `keeps these rows and adds one dated row per changed chunk, labelled `[YYYY-MM-DD] delta: chunk NN`; a scoped application check adds one dated row per checked item, labelled `[YYYY-MM-DD] application check: OI-NN`, whose Checked cell names every chunk the item changed (`chunks 02 and 11`).`
- sdd TEMPLATE-COMBINED.md:1801, old: `keeps these rows and adds one dated row per changed section; a scoped application check adds one dated row per checked item, labelled `[YYYY-MM-DD] application check: section N (OI-NN)`, naming every section the item changed (`sections 6 and 15`).`
  new: `keeps these rows and adds one dated row per changed section, labelled `[YYYY-MM-DD] delta: section N`; a scoped application check adds one dated row per checked item, labelled `[YYYY-MM-DD] application check: OI-NN`, whose Checked cell names every section the item changed (`sections 6 and 15`).`

## D2. LLD answers applied in the same update lack the SDD's application rules (lld-unifier/SKILL.md:255)

lld 16 B makes the LLD apply answers before its handoff ("apply the accepted options in the same update"). The SDD's step 8 item 3 (SKILL.md:303) says how: plain design text, no option letter or date stamp, markers the decision clears removed, and now (9 B) text the decision makes wrong is carried when one wording is clearly right. The sdd triage ruled out an LLD ripple for item 9 because "lld-unifier leaves items to the team (no acceptance loop)"; lld 16 B, decided in the same round, removed that premise. Today an LLD application that leaves a stale neighbour ships it until a later request, because the LLD's one application check is its last pass.

- **A. Keep.** The application check finds a neighbour and raises it as a new `Open` item; nothing states how applied text must read.
- **B. Mirror the SDD in one sentence (recommended).** After "each with its Resolution Log row." insert: ` Each is applied as plain implementation text that reads correctly in place, with no option letter, date stamp, or progress note (the Resolution Log row carries that), and a `> TODO:` or `> Confirm:` it answers is removed. Other text that the applied option makes wrong is brought in line in the same step when one wording is clearly right (the same fact stated again, a count, a cross-reference); name the OI ID with that text in the Changes Log row. Text that needs a choice is left for the application check to raise.` (The LLD keeps chunk 18 reviewer-only, so the check raises it, unlike S3 in the SDD.)
- **C. Plain-text rule only.** Fixes narration risk, keeps the neighbour gap.

---

## Verified, no change needed

- **Accepted design items match their options.** sdd 1 B (SKILL.md:255, :257, :360, chunks/18:85, TEMPLATE-COMBINED.md:1801, sdd README:67, README:54), 3 B (:328, :330, :350, :353, chunks/18:10 and :93, TEMPLATE-COMBINED.md:1809, README:344), 5 A (:326, :350, README:200), 9 B (:303) and lld 16 B (SKILL.md:255, :303, :312, :358, chunks/18:83, TEMPLATE-COMBINED.md:695, lld README:61, README:54) are the triage reports' recommended text, word for word, plus the optional ripples the reports listed. Nothing else was added, except the lld item 11 optional extra (the §22 row, see Records below).
- **No fixture policy leaked.** No new text says "fixture", "test-run", "accept all", or names a fixture owner. The one policy-like phrase is lld SKILL.md:255 "(by the user, or by an answer policy the user set for the run)", which is the accepted 16 B wording and reads as a user delegation (the SDD's decision-log.md already records delegations such as "apply all recommended answers"). Note: the LLD has no step that asks for answers before its handoff, so in practice the rule fires on answers the user volunteers or a delegation given up front, which is how the fixture runs used it.
- **No rule dropped.** A word-level diff of every removed fragment shows each one replaced by text with the same or wider meaning; the only narrowing is the lost "if any" (S8). The "relevant source changed" to "a claim changed" change at :326 is the accepted 5 A wording.
- **Cross-references resolve.** Step 8 item 3, step 8b items 1 and 3, step 7 "On an update" and "Answers in the same update", item 4's re-dispatch, chunk 18 Reviewer Notes, `sdd-to-lld.md` § Use-case traceability (Behaviour no use case covers, Refresh triggers), 04 § 7.3 and § 7.8, 05 § 8.6, 15 § 18.4, 16 § 19.1, LLD combined §18/§19.1/§21, SDD step 10 business review row. `check_refs.py lld-unifier sdd-unifier`: 251 references, 0 problems; `check_readme.py`: 0 problems (both run with `python -B`; `git status` unchanged).
- **Justified SDD/LLD differences.** Pass caps 3 vs 2 (lld 16 B); `Decided - pending application` and the 1 B application-check baseline exist only in the SDD; delta label in the Risk surface cell vs the Service cell (table shapes); settled items close as `Adjusted - applied`/`Rejected` vs `Resolved` (status lists); decision-log records only in the SDD.
- **Version and `Chunks:` rules agree** across sdd SKILL.md:407, chunks/sdd-master.md:7 and README:56 (chunk 19 keeps its version on a no-content write), and across lld SKILL.md:358-360, chunks/00-metadata.md:40 and TEMPLATE-COMBINED.md:34 (chunk 15 flag rows and 16 § 19.1 are content; the master's index rows and a location-only chunk 15 update are not).
- **business-reviewer-unifier hand-off text still holds.** apply-and-verify.md:197-200 and :220-242, README:34 and :63, and root README:470: a business review is never a pending-only update, so the SDD hand-off keeps its delta review; "each LLD's refresh, which ends with a delta review" stays true for a refresh with no answers; the Stale mark it sets fits S8's "if any". brd-to-sdd.md:44 (N7) now matches it.

## Records and proof notes (not skill text)

- The step 7 record (UNIFIER-ENHANCEMENTS.md, Decisions) lists the optional extras not taken; the lld item 11 optional extra (sdd-to-lld.md:343, §21 and §22) was taken and is not mentioned. Other optional ripples not applied: sdd :367 refresh row, sdd :304 "and its open remainder", lld chunks/05 § 8.6 convention line (sdd-to-lld.md:327 now says "§ 8.6 links it"; the Archival destination cell can hold the link), lld :253 "and the flags it removed".
- Proof plan S4 (sdd.md) expects request 1 (a targeted 13a change) to end with the gate line `Stale`. Per SKILL.md:360 every content-changing targeted update ends with step 8b, so with E1-E4 met the 5 A branch reopens the gate in request 1 itself; expect `Stale` only if its delta review raises an item.
- README.md:562 ("Next-round input remains frozen ... were not fixed") goes stale once step 7 lands; the step 7 plan already schedules the root README pass.

## Not verified

- No skill was run. Whether a reviewer writes these labels, runs the 1 B or 16 B checks as written, or takes the 5 A branch is unproven until a rerun.
- S3 reads 9 B's "is a new open item" as author-raised, from its placement; the alternative wording is given.
- brd-unifier and pre-brd-unifier edits were outside this scope; README sentences that also cover BRD were checked only for the SDD and LLD parts.
- The Band role files (outside the repository) were not opened.

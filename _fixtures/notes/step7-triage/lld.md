# lld-unifier triage: live findings 10 to 16, N6, and the chunking.md:186 README-audit note

Date: 2026-10-07. Read-only triage. Nothing in the repository was changed.

- Source list: `_fixtures/notes/step6-handoffs/live-findings.md:21-27` (items 10 to 16) and `:61` (N6), plus the README-audit note "`lld-unifier/chunking.md:186` leaves out the step 6b Specs re-synthesis that `lld-unifier/SKILL.md:319` includes" (called R-186 below).
- Skill text read from disk at HEAD 548bf5d.
- Example run: `_fixtures/chain/run-2026-10-07-review/lld-refunds-platform/` (LLD 1.3, from SDD 1.7). Paths below that start with `lld-refunds-platform/` or `sdd-refunds-platform/` are in that run folder.
- Checkers run read-only on that run: `check_versions.py` (problems 0, notes 0); `check_lld_trace.py` (lineage_problems 0; 602 BRD, 439 SDD and 146 internal links all resolve).

## Summary

| ID | Class | One-line fix or recommended option |
|---|---|---|
| 10 | S | State where a delta row's date and chunk go: Service cell `[YYYY-MM-DD] delta: chunk NN`, as sdd-unifier SKILL.md:255 does (SKILL.md:253, chunk 18:83, TEMPLATE-COMBINED.md:695). |
| 11 | S | Add a field-mapping row "18 Open Items & Clarifications (§23)": input context only, not carried (mirrors sdd-unifier brd-to-sdd.md:252). |
| 12 | M | Add "and step 6b when a changed SDD chunk feeds the Specs (§1, §6, §13)" to chunking.md:186 and sdd-to-lld.md:198, as SKILL.md:319 has it. |
| R-186 | M | Same finding as item 12 (its chunking.md half). One fix. |
| 13 | S | Clarify Versions: chunk 15 flag rows and the 16 § 19.1 upstream state are content; the "index" that is routine is the master's index rows. |
| 14 | S | Add the owner's 04 § 7.3 and § 7.8 (the job that applies the Retention Policy) to the "13a DB Modeling" mapping row. |
| 15 | S | Extend "Open items the change settles" to the flags chunk 15 indexes, wherever they sit (mirrors sdd-unifier brd-to-sdd.md:71). |
| 16 | D | Recommended B: one scoped application check after answers applied in the same update; at most two review passes per request. |
| N6 | M | transform-detection.md:106: "the `MK-NN` rows in 14 Mockup coverage (the screen references; the Figma link is reached through the row)". |

Counts: M 2 (item 12 with R-186, N6), S 5 (10, 11, 13, 14, 15), D 1 (16).

## Line endings and style of the files named below

- CRLF in the working tree, LF in the index (`core.autocrlf=true`; `.gitattributes` only sets `_fixtures/** text eol=lf`). CR count equals LF count in each: `lld-unifier/SKILL.md` 374, `chunking.md` 186, `sdd-to-lld.md` 419, `transform-detection.md` 183, `TEMPLATE-COMBINED.md` 703, `lld-unifier/README.md` 91, `chunks/00-metadata.md` 59, `chunks/05-data-model.md` 118, `chunks/15-open-questions.md` 89, `chunks/16-references.md` 95, `chunks/18-open-items-and-clarifications.md` 93, root `README.md` 561, `sdd-unifier/SKILL.md` 437, `sdd-unifier/chunks/18-open-items-and-clarifications.md` 97.
- LF only: `business-reviewer-unifier/apply-and-verify.md` (0 CR, 255 LF; hard-wrapped near 72 columns) and everything under `_fixtures/`.
- Em dashes: 0 in all of them. En dashes: `chunking.md` already holds 8 (size ranges in the chunk map and the typical chunk count), `modes.md` 1. The proposed text below adds none.
- Root `README.md` is checked by `_fixtures/notes/step6-handoffs/check_readme.py` (CRLF, BOM, anchors, table cell counts). A new table row there must keep 3 cells.
- Style: SKILL.md and chunking.md write "16 § 19.1" (with a space); sdd-to-lld.md's Refresh triggers write "16 §19.1". The proposed text follows each file.

---

## Item 10. Delta-review rows

**1. Verification.** Reproduces.

- `lld-unifier/SKILL.md:253` (step 7, On an update): "In the Reviewer Notes coverage table it adds one dated row per changed chunk, with the surfaces it checked there; earlier rows stay, and item 4's re-dispatch applies to the new rows only."
- `lld-unifier/chunks/18-open-items-and-clarifications.md:85-88`: the table is `| Service | Risk surface | Checked | Findings | What was checked |`, with per-service rows and `global` rows. It has no date or changed-chunk column, and the comment at `:83` says nothing about delta rows. Same in `lld-unifier/TEMPLATE-COMBINED.md:695-700`.
- sdd-unifier settled the same question: `sdd-unifier/SKILL.md:255`: "Its Risk surface cell reads `[YYYY-MM-DD] delta: chunk NN`, or `[YYYY-MM-DD] delta: section N` in COMBINED mode."
- The baseline shows two forms. R3d (LLD 1.2) used its own heading and table: `lld-refunds-platform/18-open-items-and-clarifications.md:286` "## R3d delta review - 2026-10-06", table header at `:290` (Date, Changed chunk, Checked surfaces and evidence, Findings). The 1.3 run put the label in the Service cell: `:258-268`, for example "| 2026-10-07 delta: 05-data-model.md | Schema versioning (Flyway keys and indexes); ...", plus three "2026-10-07 delta: global" rows.

**2. Class: S.** The rule already puts the row in the coverage table; only the cell is unstated. The SDD label and the 1.3 run agree. The LLD table's first column is Service, so the label goes there. No column is added, so no layout changes.

**3. Fix.**

(a) `lld-unifier/SKILL.md:253` (CRLF).
- Old: `earlier rows stay, and item 4's re-dispatch applies to the new rows only.`
- New: `earlier rows stay, and item 4's re-dispatch applies to the new rows only. The row's Service cell reads `[YYYY-MM-DD] delta: chunk NN` (a per-service file by its name, `04-implementation/<service>.md`), or `[YYYY-MM-DD] delta: section N` in combined shape; its Risk surface cell names the surfaces checked, and a `global` surface checked gets a `[YYYY-MM-DD] delta: global` row.`

(b) `lld-unifier/chunks/18-open-items-and-clarifications.md:83` (CRLF).
- Old: `Zero findings is valid for a surface that was checked. Free-form notes that did not become a numbered open item follow it. -->`
- New: `Zero findings is valid for a surface that was checked. A delta review (SKILL.md step 7, On an update) keeps these rows and adds one dated row per changed chunk: its Service cell reads `[YYYY-MM-DD] delta: chunk NN` (a per-service file by its name) or `[YYYY-MM-DD] delta: global`, and its Risk surface cell names the surfaces checked. Free-form notes that did not become a numbered open item follow it. -->`

(c) `lld-unifier/TEMPLATE-COMBINED.md:695` (CRLF).
- Old: `plus the three `global` rows. Zero findings is valid for a surface that was checked. -->`
- New: `plus the three `global` rows. Zero findings is valid for a surface that was checked. A delta review (SKILL.md step 7, On an update) keeps these rows and adds one dated row per changed section: its Service cell reads `[YYYY-MM-DD] delta: section N` or `[YYYY-MM-DD] delta: global`, and its Risk surface cell names the surfaces checked. -->`

All three old strings are unique in their files.

**4. Ripple.**

- sdd-unifier: none. Its label (`SKILL.md:255`) is the model.
- Item 16: if option B is chosen, the same three places also get the application-check label. Merged text is under "Edits that touch the same lines".
- Root `README.md` and `lld-unifier/README.md:61`: no row-format detail; no change.
- Checkers: none reads chunk 18 Reviewer Notes (a search of `_fixtures/checkers/` for "Reviewer Notes", "delta" and "Risk surface" finds nothing).
- The saved baseline keeps the R3d table as run evidence; no hand edit.

**5. Proof.** No checker covers it, and a reading check is enough. The next LLD update run shows whether the reviewer writes the label. Optional: a small check in that run that every `delta: ` row names a chunk in the newest `Chunks:` list, or `global`.

---

## Item 11. No mapping row for SDD chunk 18

**1. Verification.** Reproduces.

- `lld-unifier/sdd-to-lld.md:293-344` (Field mapping table) has rows for SDD 00 to 17, 19, and the Specs inputs. None is for 18 (Open Items & Clarifications; combined §23, per `sdd-unifier/chunking.md:42`).
- SDD Changes Log rows list 18: `sdd-refunds-platform/00-cover-and-changelog.md:45`, `:46`, `:49`, `:50`, `:51` (rows 1.1, 1.2, 1.5, 1.6, 1.7).
- Step 3c relies on the table: `lld-unifier/SKILL.md:158` "map the sections to their chunks (the field mapping table names both)" and "listing each changed SDD chunk with every LLD chunk the field mapping sends it to".
- The 1.3 run had to improvise: `lld-refunds-platform/decision-log.md:44` "SDD 18 has no field mapping row."
- Precedent one level up: `sdd-unifier/brd-to-sdd.md:252` "| Open Items & Clarifications (BRD chunk 13) | Input context only | Read the BRD's resolved/deferred items: deferred business decisions often become SDD risks or flags. Do not copy the section; the SDD gets its own reviewer pass (chunk 18). |". In the same LLD table, `sdd-to-lld.md:300` handles SDD Risks as "(Not directly carried: ...)".

**2. Class: S.** One clear answer that mirrors the sibling rule. It changes no gate, ID, layout or review pass.

**3. Fix.** `lld-unifier/sdd-to-lld.md` (CRLF): insert a new row after `:343` ("| 17 Appendix (§21) | `16-references.md` (entire chunk) | Carry references; add LLD-specific rows. |") and before the Specs-inputs row at `:344`:

`| 18 Open Items & Clarifications (§23) | (Input context only: not carried) | Read the SDD's open, decided, and deferred items. A decided item reaches the LLD through the chunks its application changed, which the same Changes Log row lists. An open or deferred item that an implementation choice depends on becomes a `> Confirm:` or `> TODO:` that cites it. Do not copy the section: the LLD gets its own reviewer pass (chunk 18), and a refresh checks that chunk against the change (§ Use-case traceability › Refresh triggers). |`

Adjacent gap, same family (not in the finding; optional). `sdd-to-lld.md:343` names only §21, but SDD chunk 17 also holds §22 Wishlist (`sdd-unifier/chunking.md:41`), so a combined SDD row that lists §22 finds no row either. If wanted, replace `:343` with:

`| 17 Appendix (§21) and Wishlist (§22) | `16-references.md` (entire chunk) | Carry references; add LLD-specific rows. The wishlist is not carried: an item that informs near-term implementation goes to `15-open-questions.md` § 18.4, as for 13a Future Enhancements. |`

**4. Ripple.**

- Root `README.md:153-169` (the SDD to LLD table) has no 18 row either. Add after `:168` (3 cells, CRLF): `| 18 §23 Open items | Not carried: input context | A decided item reaches the LLD through the chunks it changed; an open one an implementation choice depends on becomes a flag; a refresh checks LLD chunk 18 against the change |`
- `lld-unifier/SKILL.md:158`: no change; the new row names both the chunk and the section.
- sdd-unifier: none (`brd-to-sdd.md:252` is the model).
- `TEMPLATE-COMBINED.md`, chunk templates: none. Checkers: none reads the mapping table.

**5. Proof.** Reading check. The next "the SDD has a new version" run whose rows list 18 should cite this row instead of the 1.3 note. No rerun needed for this alone.

---

## Item 12, with R-186. Step 6b omitted

**1. Verification.** Reproduces as a wording gap.

- `lld-unifier/SKILL.md:319` (step 9 row): "...then step 6a when the trace applies, and step 6b when a changed SDD chunk feeds the Specs (§1, §6, §13); bump version."
- `lld-unifier/chunking.md:186`: "...plus 16 § 19.1 and this LLD's Child LLDs row in the SDD; rerun SKILL.md step 6a when the trace applies; bump the LLD version." No 6b.
- `lld-unifier/sdd-to-lld.md:198` (Refresh triggers, "A new SDD version"): "The LLD chunks mapped (§ Field mapping table) from the SDD chunks its Changes Log rows list since the version in 16 §19.1 (SKILL.md step 3c), plus 16 §19.1 and this LLD's Child LLDs row". No 6b.
- Mitigation: the behaviour is reachable. `sdd-to-lld.md:344` maps "01 §1, 02 §6, 09 §13 (the Specs inputs)" to `17-specs.md`, "Re-synthesised as a whole per § Specs ownership & synthesis and SKILL.md step 6b", and both texts above defer to the mapping table. The 1.3 run did rerun 6b (`lld-refunds-platform/decision-log.md:44`, "Steps 6a and 6b reran"). Root `README.md:198` already says "When SDD §1, §6, or §13 changed, the update also re-synthesises the Specs".
- R-186 is the chunking.md half of this item: the same finding, one fix.

**2. Class: M.** A missing cross-reference; the fix copies the clause SKILL.md:319 already has.

**3. Fix.**

(a) `lld-unifier/chunking.md:186` (CRLF).
- Old: `rerun SKILL.md step 6a when the trace applies; bump the LLD version.`
- New: `rerun SKILL.md step 6a when the trace applies, and step 6b when a changed SDD chunk feeds the Specs (§1, §6, §13); bump the LLD version.`

(b) `lld-unifier/sdd-to-lld.md:198` (CRLF).
- Old: `plus 16 §19.1 and this LLD's Child LLDs row |`
- New: `plus 16 §19.1 and this LLD's Child LLDs row; the Specs are re-synthesised (SKILL.md step 6b) when a changed SDD chunk feeds them (§1, §6, §13) |`

**4. Ripple.**

- `SKILL.md:319` is the source; no change. Root `README.md:198` is already right. `lld-unifier/README.md:63` is generic; no change.
- `business-reviewer-unifier/apply-and-verify.md:236-242` (LF, wrapped) sums up the LLD hand-off as "the LLD chunks mapped from those SDD chunks, plus the trace ...". It stays true through the mapping row; no change needed.
- sdd-unifier, templates, checkers: none.

**5. Proof.** Reading check only: the three texts then say the same. No rerun.

---

## Item 13. Routine sync or content

**1. Verification.** Reproduces as an ambiguity.

- `lld-unifier/SKILL.md:356` lists what is not content: "links (adding a missing BRD key to a citation included), footers, the master's index rows, and this LLD's own row in the SDD's Child LLDs table." Chunk 15 rows and 16 § 19.1 are not on that list, so by this sentence they are content.
- `lld-unifier/SKILL.md:358`: "Exclude routine cover/version/index/footer synchronization from the semantic Chunks list; include substantive metadata or review-content changes." Here "index" can be read as chunk 15 (titled "Open Questions & Flag Index", `chunks/15-open-questions.md:9`, which says "this index is regenerated with them", `:16`), and "version" as the 16 § 19.1 version cells.
- The same short form is in `chunks/00-metadata.md:40` and `TEMPLATE-COMBINED.md:34`: "excluding routine synchronized metadata; ... Review-content changes count."
- The run: the 1.3 row lists 15 and 16 (`lld-refunds-platform/00-metadata.md:39`), and both carry VERSION 1.3. `check_versions.py` reports 0 problems. `check_lld_trace.py` reports lineage_problems 0 (16 § 19.1 equals the Child LLDs row: LLD 1.3, SDD 1.7).

**2. Class: S.** The explicit list at `:356` already decides it; the fix makes `:358` and the two comments say the same. Why "content" is the right reading:

- 16 § 19.1 is the record that step 3c compares on the next run (`chunks/16-references.md:13`) and the SDD version the LLD reflects (`SKILL.md:247`). If it were routine, an accepted refresh that changes nothing else would give the Child LLDs row a new SDD version under the same LLD version.
- Chunk 15 has its own VERSION header and authored parts (§ 18.4 decisions, recommended resolutions). If its flag rows were routine, the header would show an older version than its content.
- Listing them puts them in the delta review's scope. The 1.3 reviewer did check both (`lld-refunds-platform/18-open-items-and-clarifications.md:263-264`).

The other reading (both routine, like the SDD's E3 marker inventory) would add them to the `:356` list and leave stale VERSION headers. Not recommended.

One part is synchronization: chunk 15 Location cells carry file and line (`lld-refunds-platform/15-open-questions.md:57`, "[04-implementation/loyalty-points.md:205]"), so an edit elsewhere in the body moves them, like a link.

**3. Fix.**

(a) `lld-unifier/SKILL.md:356` (CRLF).
- Old: `the master's index rows, and this LLD's own row in the SDD's Child LLDs table. No two rows share a version.`
- New: `the master's index rows, a chunk 15 location that only follows its flag, and this LLD's own row in the SDD's Child LLDs table. A flag added, removed, or reworded changes its chunk 15 rows and counts, and an accepted refresh changes the upstream state in 16 § 19.1: both are content changes, so chunks 15 and 16 are listed. No two rows share a version.`

(b) `lld-unifier/SKILL.md:358` (CRLF).
- Old: `Exclude routine cover/version/index/footer synchronization from the semantic Chunks list; include substantive metadata or review-content changes.`
- New: `Exclude routine cover/version/footer synchronization and the master's index rows from the semantic Chunks list; include substantive metadata (16 § 19.1 included) or review-content changes.`

(c) `lld-unifier/chunks/00-metadata.md:40` (CRLF).
- Old: `Review-content changes count. -->`
- New: `Review-content changes count, and so do chunk 15 flag rows and the 16 § 19.1 upstream state (SKILL.md § Output conventions, Versions). -->`

(d) `lld-unifier/TEMPLATE-COMBINED.md:34` (CRLF).
- Old: `Review-content changes count. -->`
- New: `Review-content changes count, and so do §18 flag rows and the §19.1 upstream state (SKILL.md § Output conventions, Versions). -->`

**4. Ripple.**

- sdd-unifier `SKILL.md:407-409`: its "index rows" are navigation rows, and it has no flag-index chunk. No change. brd-unifier: none.
- Root `README.md:56` ("not routine cover, index, or footer updates") stays true when "index" means navigation. Optional; no change.
- If item 16 B lands: `SKILL.md:356` also changes its first-build sentence (merged note below).
- Checkers: `check_versions.py` F1 already requires that a chunk carrying the newest VERSION is listed and that a listed chunk carries it. It accepts either reading when the run is self-consistent. No change.

**5. Proof.** None needed: the fix states what the run already did, and the baseline passes `check_versions.py` and `check_lld_trace.py`. Rerun `check_versions.py` on the next LLD update.

---

## Item 14. Retention mapping

**1. Verification.** Reproduces.

- `lld-unifier/sdd-to-lld.md:327` ("13a DB Modeling") sends the Retention Policy only to chunk 05: "`05-data-model.md` § 8.2 Tables ... + § 8.6 Retention & Archival + § 8.7 Encryption", with the note "§ 8.3, § 8.5, § 8.6, and § 8.7 link the SDD parts they implement (... Retention Policy and Archival ...) and add only the implementation delta."
- The algorithm belongs in 04. A scheduled job is an entry point with pseudocode in § 7.3 and a `### Workflow:` block in § 7.8: `chunks/04-implementation-template.md:100` (`[FooCleanupJob.run]`, Kind Job), `:108` (§ 7.3), `:302` (§ 7.8 convention); `sdd-to-lld.md:31` ("A scheduled job ... gets a `### Workflow: [name]` block in its owner's file").
- `chunks/05-data-model.md:100-107`: § 8.6 is a table (Table, Hot retention, Archival destination, Restore SLA), with no place for an algorithm.
- Baseline: the SDD 13e Retention Policy gives a deletion order (`sdd-refunds-platform/13e-service-loyalty-points.md:242-253`). The LLD holds it in `lld-refunds-platform/04-implementation/loyalty-points.md:160-205` (§ 7.3 "notice and retention") and `:469` (`### Workflow: former-member-retention`); 05 § 8.6 links it (`05-data-model.md:536`).
- Effect today: none on refresh scope, because any 13x change also maps to the owner's 04 through Business Logic (`sdd-to-lld.md:323`). The gap is for a reader, or a delta reviewer, who follows the table section by section.

**2. Class: S.** One clear answer: § 7.3 is where pseudocode lives, and § 8.6 links it, as the run did.

**3. Fix.** `lld-unifier/sdd-to-lld.md:327` (CRLF).

(a) Destination cell.
- Old: `+ § 8.6 Retention & Archival + § 8.7 Encryption |`
- New: `+ § 8.6 Retention & Archival + § 8.7 Encryption + the owner's `04-implementation/<svc>.md` § 7.3 and § 7.8 (the job that applies the Retention Policy or Archival) |`

(b) Note cell.
- Old: `the columns stay in § 8.2. A value that differs from the SDD is drift to flag. |`
- New: `the columns stay in § 8.2. The job that applies the Retention Policy or Archival (its deletion order, locks, and batches) is pseudocode in the owner's 04 § 7.3, with a `### Workflow:` block in § 7.8 (§ Use-case traceability, Behaviour no use case covers); § 8.6 links it. A value that differs from the SDD is drift to flag. |`

**4. Ripple.**

- Optional: `lld-unifier/chunks/05-data-model.md`, a line after the § 8.6 table (after `:106`, CRLF): `> **Convention:** a job that applies a retention or archival rule has its pseudocode in the owner's `04-implementation/<service>.md` § 7.3 and its `### Workflow:` block in § 7.8; this section links it.` `TEMPLATE-COMBINED.md:289` is a bare heading; no change.
- Root `README.md:167` already maps `13x` to "04 §7.1-§7.8; 05 §8"; no change.
- sdd-unifier: none. Checkers: none.

**5. Proof.** Reading check. No rerun.

---

## Item 15. Carried flags

**1. Verification.** Reproduces.

- `lld-unifier/sdd-to-lld.md:176` (Upstream gaps): "A `[NEEDS CLARIFICATION: ...]` the LLD depends on, in a §7.3 cell or in any other SDD section (a §5 term, a `13x` rule) | Carry it as a `> TODO:` that cites the SDD section; never resolve it in the LLD." The TODO sits where the LLD depends on it, not where the mapping sends that SDD section.
- `sdd-to-lld.md:198`: a new SDD version refreshes only "The LLD chunks mapped ... from the SDD chunks its Changes Log rows list", plus 16 §19.1 and the Child LLDs row.
- `sdd-to-lld.md:202` ("Open items the change settles"): "A refresh checks chunk 18 against the change." Flags are not checked.
- So when the SDD settles a marker in a chunk that maps elsewhere, the LLD keeps a stale TODO. sdd-unifier has the rule the LLD lacks: `sdd-unifier/brd-to-sdd.md:71` "Before the delta review, check chunk 18 and the inline markers against the change. ... A marker the change answers is removed, and the design text states the answer."
- Baseline: the two carried `[NEEDS CLARIFICATION]` markers sit in 03 § 6.3 (`lld-refunds-platform/03-architecture.md:43`, `:53`), where SDD 02 maps, so this run was not affected (as the finding says). A latent case exists, though: TODO-38 (`04-implementation/loyalty-points.md:205`, indexed at `15-open-questions.md:57`) waits on SDD 13e and SDD §11.3 (SDD chunk 07). If a later SDD version answers it only in 07 § 11.3, the mapped LLD chunks are 09 and 05 § 8.4, not the loyalty-points file.

**2. Class: S.** One clear answer: mirror the sibling rule. Chunk 15 already indexes every flag with its location (`chunks/15-open-questions.md:11`), so the check is mechanical. Rejected alternatives: leave it to the delta reviewer (the flag's chunk is not in `Chunks:`, so it is out of scope); move carried flags into the mapped chunk (the implementer reading 04 loses the inline flag).

**3. Fix.** `lld-unifier/sdd-to-lld.md:202` (CRLF): append after the last sentence.
- Old: `with its Concern updated and a Resolution Log row `Reopened by SDD v[X.X]` (or `[KEY] v[X.X]`).`
- New: `with its Concern updated and a Resolution Log row `Reopened by SDD v[X.X]` (or `[KEY] v[X.X]`). It checks the flags chunk 15 indexes the same way, wherever they sit: a `> TODO:` or `> Confirm:` the change answers is removed, its text states the answer by linking the section that gives it, and its chunk is listed under `Chunks:`.`

The bold label can stay as it is; nothing else refers to it by name.

**4. Ripple.**

- Root `README.md:198` (CRLF). Old: `and it settles, supersedes, or reopens the chunk 18 items the change answers.` New: `and it settles, supersedes, or reopens the chunk 18 items the change answers and removes the flags it answers.`
- Root `README.md:200` (CRLF). Old: `It also settles, supersedes, or reopens affected chunk 18 items, then runs a delta review.` New: `It also settles, supersedes, or reopens affected chunk 18 items and removes the flags the change answers, then runs a delta review.`
- Optional: `lld-unifier/SKILL.md:253` ("checks the items the refresh marked settled, superseded, or reopened") could add "and the flags it removed". Not needed, because the flag's chunk is now listed and so in scope.
- Item 13: a removed flag changes chunk 15, which is content, so the refresh lists 15.
- sdd-unifier: the model rule (`brd-to-sdd.md:71`); no change. Checkers: none compares LLD flags with SDD changes (`check_e2e.py` and `_e2e_gate.py` read SDD markers only).

**5. Proof.** No checker covers it; only a scenario proves it. The cheapest one: on a copy of the baseline, write an SDD version that answers TODO-38's question in 07 § 11.3 alone, run "the SDD has a new version", and check that TODO-38 leaves loyalty-points § 7.3 and chunk 15 and that the 04 file is listed under `Chunks:`. Optional, given "no effect in this run".

---

## Item 16. Policy: no re-check of fixes applied after the LLD delta review

**1. Verification.** Reproduces.

- `lld-unifier/SKILL.md:249-274` (step 7): one full review on the first build, one delta review per content-changing update (`:253`), and item 4 re-dispatches only for an unchecked surface or a finding without evidence (`:274`). Nothing checks answers applied after that pass.
- lld-unifier has no in-request answer step at all: no walkthrough or acceptance loop (SKILL.md has no rule for accepting answers or writing the Resolution Log). Step 8 offers "Want me to fill in section X now that you have decisions?" (`:306`), which is a later request. Root `README.md:54` says "the pre-BRD and LLD leave the items for you and your team to decide".
- The fixture runs still applied answers in the same update, under the fixture policy (`_fixtures/README.md:82`): LLD 1.0 (`lld-refunds-platform/00-metadata.md:30`, "Full review and applied fixture answers join the initial 1.0 draft") and LLD 1.3 (`18-open-items-and-clarifications.md:273`, "No second review pass was dispatched").
- sdd-unifier, for comparison: `SKILL.md:257` (Review after answers: "Later accepted answers use scoped verification of their application, changed chunks/dependents and necessary gaps exposed by those changes; record that coverage without starting an unrelated adversarial hunt") and `:259` (Review limit: "One request has at most three review passes: one baseline and up to two scoped application passes. ... Newly exposed gaps from the last pass stay pending application for the next request").
- Why it matters: OI-12 alone changed loyalty-points § 7.2, § 7.3 and § 7.6 (`18-open-items-and-clarifications.md:193`), and those passages had no second look.

**2. Class: D.** It adds or withholds a review pass, and it decides whether the LLD applies answers in the same update at all.

**3. Options.**

- **A. Keep one pass per request; answers wait for a later request.** Step 7 says that answers are applied by a later request (step 9, "fill in section X"), whose delta review covers the chunks they change. Answers given before the handoff, by the user or an answer policy, wait for that request. Effect: no new mechanism, and the re-check is a full delta review of the changed chunks. But each answer batch costs one more request and one more version, and the fixture runs must split (1.0 and 1.3 would each have needed a further version).
- **B. One scoped application check per request.** When items are answered before the handoff, apply them in the same update and Changes Log row, then run one cleared-context check limited to the applied passages and the passages that depend on them, with no new hunt. One dated row per applied item. A gap it finds becomes a new Open item for a later request. At most two review passes per request. Effect: one version per request; one more dispatch, and only when answers were applied; matches how the fixture runs (and "accept all" replies) work; uses the SDD's naming.
- **C. Mirror the SDD exactly.** Review after answers plus a Review limit of three passes (one baseline and up to two scoped application passes). Effect: full parity, but up to two extra dispatches. The second application pass buys little here, because no LLD gate depends on open items (chunk 18 items "are not blockers in themselves", `chunks/18-open-items-and-clarifications.md:15`).

**Recommended: B.** Why: the applied fixes are the riskiest edits of an update (OI-12 touched three subsections of one service), and today nothing reads them again. One bounded check closes that for one dispatch, and only when answers were applied. A forces a second request and version for every answer batch. C adds a pass that the SDD needs for its gate but the LLD does not. Tradeoff accepted: a gap the check finds waits for the next request, and the README sentence that says the LLD leaves the items to the team changes.

Proposed text for B:

(a) `lld-unifier/SKILL.md`: a new paragraph after `:253` (CRLF):
`**Answers in the same update.** When open items are answered before the handoff (by the user, or by an answer policy the user set for the run), apply the accepted options in the same update and Changes Log row, each with its Resolution Log row. Then run one scoped application check: the same cleared-context reviewer, limited to the passages the applied items changed and the passages that depend on them, with no new hunt. It adds one dated row per applied item: its Service cell reads `[YYYY-MM-DD] application check: OI-NN`, and its What was checked cell names each chunk and section the item changed. A gap it finds becomes a new `Open` item and waits for a later request. One request has at most two review passes: the full or delta review, and this check. Item 4's re-dispatch of an unchecked row is not a new pass.`

(b) `lld-unifier/SKILL.md:356`.
- Old: `the first build (the body, the Specs, and the review) is one update, at 1.0.`
- New: `the first build (the body, the Specs, the review, and any answers applied before the handoff with their check) is one update, at 1.0.`

(c) `lld-unifier/SKILL.md:301`.
- Old: `- Count of Open Items (OI-NN) in `18-open-items-and-clarifications.md` (reviewer-flagged).`
- New: `- Count of Open Items (OI-NN) in `18-open-items-and-clarifications.md` (reviewer-flagged); when answers were applied, the items applied and the application check's result.`

(d) `lld-unifier/chunks/18-open-items-and-clarifications.md:83` and `TEMPLATE-COMBINED.md:695`: after item 10's delta sentence, add `A scoped application check (SKILL.md step 7, Answers in the same update) adds one dated row per applied item: its Service cell reads `[YYYY-MM-DD] application check: OI-NN`.`

(e) `lld-unifier/README.md:61` (CRLF): append `Answers you give before the handoff are applied in the same update and checked once, by a scoped application check.`

(f) Root `README.md:54` (CRLF).
- Old: `the pre-BRD and LLD leave the items for you and your team to decide`
- New: `the pre-BRD leaves the items for you and your team to decide, and the LLD applies in the same update the answers you give before its handoff`
- Old: `BRD consistency checks stop after three runs in one request, and SDD reviews after three review passes in one request.`
- New: `BRD consistency checks stop after three runs in one request, SDD reviews after three review passes, and LLD reviews after two (the full or delta review, then one check of the answers applied in that request).`

Text for A, if chosen instead: a new paragraph after `SKILL.md:253`: `**Answers to open items.** Answers are applied by a later request (step 9, "fill in section X"), whose delta review covers the chunks they change. Answers given before the handoff, by the user or by an answer policy, wait for that request. One request runs one review pass.` README needs no change; the fixture policy note does.

**4. Ripple (for B).**

- `lld-unifier/SKILL.md`: new paragraph after `:253`, `:301`, `:356`. Optional `:310`: "A row that changes LLD content ends with the delta review of step 7 (On an update)" could add ", and the application check when answers were applied".
- `lld-unifier/chunks/18-open-items-and-clarifications.md:83`; `lld-unifier/TEMPLATE-COMBINED.md:695`.
- `lld-unifier/README.md:61`; root `README.md:54` (prose only; `check_readme.py` unaffected).
- sdd-unifier: decide the label together with sdd items 1 and 2 (`live-findings.md:9-10`). The SDD labels application rows `[date] application check: chunk NN (OI-NN)` (`sdd-unifier/chunks/18-open-items-and-clarifications.md:85`; `§NN` in `sdd-unifier/TEMPLATE-COMBINED.md:1801`), and item 2 says that label does not fit an item that spans two chunks. One row per item, keyed by OI and naming its chunks, as proposed here, would answer item 2 for both skills.
- Checkers: none reads Reviewer Notes. Optional new check: count `application check: OI-NN` rows against the Resolution Log rows dated in the newest update.
- `_fixtures/README.md:82` (the fixture answer policy): describe the LLD's in-request application under B; under A the fixture runs must split into two requests.

**5. Proof.** Needs a fixture rerun: the next LLD update on `chain/run-2026-10-07-review` (for example after sdd-unifier answers CONFIRM-23, CONFIRM-24 and TODO-38 in an SDD 1.8), run with the accept-all policy. Pass: chunk 18 gains one `application check: OI-NN` row per applied item, at most two reviewer dispatches are recorded, and any gap the check finds stays Open and unapplied.

---

## N6. Figma links in transform-detection.md

**1. Verification.** Reproduces.

- `lld-unifier/transform-detection.md:106`: "the IDs its use-case trace cites (use case headings in 05 and 06x, the `MK-NN` rows and Figma links in 14 Mockup coverage (the screen references), ...".
- `lld-unifier/sdd-to-lld.md:49`: "the LLD reads its Mockup coverage rows (the screen reference: the screen or flow and its use cases; the Figma link is reached through the row) only". The same rule is in `sdd-to-lld.md:353` ("the Figma links stay in the BRD row"), `SKILL.md:158` ("the LLD links the chunk 14 row, which always carries the current link"), `chunks/16-references.md:21` and `TEMPLATE-COMBINED.md:577`.

**2. Class: M.** A stale phrase; one fix.

**3. Fix.** `lld-unifier/transform-detection.md:106` (CRLF).
- Old: `the `MK-NN` rows and Figma links in 14 Mockup coverage (the screen references)`
- New: `the `MK-NN` rows in 14 Mockup coverage (the screen references; the Figma link is reached through the row)`

Optional, same line, not asked by the finding: `SKILL.md:153` notes that a BRD written before `MK-NN` keys its rows by a screen ID. "the `MK-NN` rows" could read "the Mockup coverage rows, keyed `MK-NN` (or by a screen ID in a BRD written before `MK-NN`)".

**4. Ripple.** None. The six other places already say it, and root `README.md:200` matches. Checkers: none.

**5. Proof.** Reading check only.

---

## Edits that touch the same lines

- Items 10 and 16 (B) both change `SKILL.md:253` (16 adds a paragraph after it), `chunks/18-open-items-and-clarifications.md:83` and `TEMPLATE-COMBINED.md:695`. Merged comment for chunk 18:83 if both land:
  `<!-- The coverage table is required (SKILL.md step 7): one row per risk surface per service, plus the three `global` rows. Zero findings is valid for a surface that was checked. A delta review (SKILL.md step 7, On an update) keeps these rows and adds one dated row per changed chunk: its Service cell reads `[YYYY-MM-DD] delta: chunk NN` (a per-service file by its name) or `[YYYY-MM-DD] delta: global`, and its Risk surface cell names the surfaces checked. A scoped application check (SKILL.md step 7, Answers in the same update) adds one dated row per applied item: its Service cell reads `[YYYY-MM-DD] application check: OI-NN`. Free-form notes that did not become a numbered open item follow it. -->`
  For TEMPLATE-COMBINED.md:695, use the same text with "per changed section" and `[YYYY-MM-DD] delta: section N`, and without the free-form notes sentence.
- Items 13 and 16 (B) both change `SKILL.md:356` (different sentences of the same line); apply both.
- Items 12 and 15 both touch the Refresh triggers part of `sdd-to-lld.md` (`:198` and `:202`); separate lines, no conflict.
- Items 13 and 15: a flag removed under item 15 changes chunk 15, which item 13 makes content, so the refresh lists 15.

## Seen outside my items (not triaged)

- lld-unifier has no rule for a `decision-log.md`, but the baseline LLD lists `decision-log.md` under `Chunks:` (rows 1.2 and 1.3, `lld-refunds-platform/00-metadata.md:38-39`), and the 1.3 delta review gave it a coverage row (`18-open-items-and-clarifications.md:265`). `check_versions.py` ignores it (no `NN-` prefix). Worth a decision in the same round as item 13.

## Not verified

- I found no copy of the README-audit note on chunking.md:186 under `_fixtures/notes/`; I used the brief's wording.
- LLD 1.2 (R3d) is not saved on its own (`_fixtures/runs-wip/` no longer exists). I saw R3d's separate table only in the 1.3 chunk 18, which keeps it.
- No skill was run. Whether a reviewer agent writes the proposed labels, or runs the item 16 check as written, is unproven until a rerun.
- The item 16 cost (one extra dispatch) is reasoned, not measured.
- During this triage, `UNIFIER-ENHANCEMENTS.md` and `_fixtures/notes/step6-plan.md` showed as modified (13:31). This triage changed no repository file. One Grep result was saved by the tool under `.claude/projects`; I did not open it.

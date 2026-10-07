# SDD consistency re-check

## Summary

- Counts: **A 2, B 1, C 1**. All four fixes are mechanical.
- A-1: the Child LLDs reference prose still records the version read and promises to clear the out-of-date note on any run.
- A-2: raw Outcome separators turn both four-column Resolution Log rows into ten-cell rows.
- B-1: combined SDD updates list sections, but the SDD delta-review path and repeated update rules still specify chunk numbers.
- C-1: the API chunk's purpose line omits the in-process Behaviour fields its body now requires.
- Needs the user's decision: **none**.
- All assigned SDD coverage completed. The shared reference checker reports 240 references checked and 0 problems.

## A. Wrong or contradictory

### A-1. The Child LLDs prose still uses the version read and clears its note on any run

- Where: `sdd-unifier/brd-to-sdd.md:44` and `:45` (Child LLDs, rules 1 and 2).
- Exact current text, unique in that file: "It never writes into the LLD; the LLD's next run rewrites its own row and clears the note."
- Why: the row now records the SDD version the LLD reflects, not merely the version it read. A run that declines the trace refresh keeps the old version and its out-of-date note (`lld-unifier/SKILL.md`, step 6c). The SDD cover skeleton and its combined copy already say the note clears only when the row names the current SDD version. This prose still promises unconditional clearing.
- Earlier finding: persistent remainder of `_fixtures/notes/step6-consistency/cross.md` A-9 and `lld.md` A-9; the corresponding template fixes did not reach this reference paragraph.
- Fix: **mechanical**, in `sdd-unifier/brd-to-sdd.md`. Replace the exact current text above with: "It never writes into the LLD; the LLD's next run rewrites its own row and clears the note only when the row then names this SDD's current version."

- Second fix in the same file, also **mechanical**: exact unique current text: "and the SDD version it read as SDD version (its step 6c)". New: "and the SDD version its content reflects as SDD version, as its references record it (its step 6c)". This aligns rule 1 with the cover skeleton and the LLD writer too.

### A-2. Raw Outcome alternatives break both four-column Resolution Log tables

- Where: `sdd-unifier/chunks/18-open-items-and-clarifications.md:79` and `sdd-unifier/TEMPLATE-COMBINED.md:1778`.
- Exact current row, unique in each file:

  ```markdown
  | [OI-XX] | [YYYY-MM-DD] | [Chunk and section] | [Accepted recommendation | Adjusted: short note | Deferred | Rejected | Settled by [source] | Superseded by [source] | Reopened by [source]] |
  ```

- Why: the header has four cells, but this row has ten. The six pipes between Outcome alternatives are raw, unescaped Markdown cell separators; square brackets do not protect them. A four-column table renderer treats the alternatives after `Accepted recommendation` as excess cells, so the template does not display its full outcome vocabulary in the Outcome column.
- Scope: this malformed row predates the round, but F3 added three more alternatives to it. This is a cheap class A fix allowed by the brief. It is not a re-report of a resolved stage-4 item.
- Fix: **mechanical**, in both files. Replace the exact current row above with:

  ```markdown
  | [OI-XX] | [YYYY-MM-DD] | [Chunk and section] | [Accepted recommendation / Adjusted: short note / Deferred / Rejected / Settled by [source] / Superseded by [source] / Reopened by [source]] |
  ```

- Verification: an unescaped-pipe count finds four cells in each header and ten in each current row. The proposed row has four cells and preserves every outcome.

## B. Ambiguous

### B-1. A combined SDD writes section numbers but its delta-review instructions still read them as chunks

- Where: `sdd-unifier/SKILL.md:253`, `:347`, `:354`; `sdd-unifier/transform-detection.md:145`; `sdd-unifier/brd-to-sdd.md:68`; `sdd-unifier/TEMPLATE-COMBINED.md:1784`.
- Quote: "limited to the chunks the update's Changes Log row lists after `Chunks:`".
- Why: the Versions rule at `SKILL.md:388` now says a combined SDD names changed sections, as C11 requires. The review rule still consumes chunks and records `delta: chunk NN`, with no combined-mode reading rule. For example, a change to combined section 11 is a change to chunk 07, not chunk 11. The update rows and two reference paths also still explicitly require a list of chunks. `lld-unifier/SKILL.md:158` was given the section-to-chunk mapping rule, but this local consumer was not.
- Earlier finding: remaining ambiguity from `_fixtures/notes/step6-consistency/sdd.md` B-4 after decision C11. The combined writer and re-chunk rules were fixed; the SDD's own delta-review consumer and repeated writer instructions remain inconsistent in terminology.
- Fix: **mechanical**, following C11.
  1. `sdd-unifier/SKILL.md`, exact unique current text: "limited to the chunks the update's Changes Log row lists after `Chunks:` and to the change behind it". New: "limited to the chunks, or combined sections, the update's Changes Log row lists after `Chunks:` and to the change behind it".
  2. Same file, exact unique current text: "The reviewer keeps the existing coverage record and adds one row per changed chunk, its Risk surface cell reading `[YYYY-MM-DD] delta: chunk NN`." New: "The reviewer keeps the existing coverage record and adds one row per changed chunk or combined section. Its Risk surface cell reads `[YYYY-MM-DD] delta: chunk NN`, or `[YYYY-MM-DD] delta: section N` in COMBINED mode."
  3. Same file, exact unique current text: "the Changes Log row's `Chunks:` list names every chunk changed, the back-filled ones included." New: "the Changes Log row's `Chunks:` list names every chunk changed, or every changed section in COMBINED mode, including the back-filled ones."
  4. Same file, exact unique current text: "on the chunks the review's Changes Log row lists after `Chunks:`, and any this run changed." New: "on the chunks, or combined sections, the review's Changes Log row lists after `Chunks:`, and any this run changed."
  5. `sdd-unifier/transform-detection.md`, exact unique current text: "the Changes Log row's `Chunks:` list names every chunk changed, the back-filled ones included." New: "the Changes Log row's `Chunks:` list names every chunk changed, or every changed section in COMBINED mode, including the back-filled ones."
  6. `sdd-unifier/brd-to-sdd.md`, exact unique current text: "with a Changes Log row whose `Chunks:` list names every chunk changed, then run the delta review". New: "with a Changes Log row whose `Chunks:` list names every chunk changed, or every changed section in COMBINED mode, then run the delta review".
  7. `sdd-unifier/TEMPLATE-COMBINED.md`, exact unique current text: "A delta review (SKILL.md step 7, On an update) keeps these rows and adds one dated row per changed chunk." New: "A delta review (SKILL.md step 7, On an update) keeps these rows and adds one dated row per changed section."

## C. Cosmetic

### C-1. The API chunk's purpose line omits the new in-process Behaviour fields

- Where: `sdd-unifier/chunks/11-api-contracts.md:8`.
- Exact current text, unique in that file: "and each in-process port contract its port interface, operation, DTOs, raised errors, and permission token, so both sides implement the same contract with zero drift."
- Why: the same chunk now requires an Idempotency and Transaction Behaviour table, following D5/TD2. Step 6a, the reviewer brief, the master, and the README list these fields. This remaining summary still describes the old set. The actual contract table is correct.
- Earlier finding: another missed descriptive copy of the field-list change checked in `_fixtures/notes/step6-consistency/sdd.md` C-2; its master and README copies are fixed.
- Fix: **mechanical**, in `sdd-unifier/chunks/11-api-contracts.md`. Replace the exact current text above with: "and each in-process port contract its port interface, operation, DTOs, raised errors, permission token, and behaviour (idempotency and transaction), so both sides implement the same contract with zero drift."

## Coverage and verification

- Reviewed `git diff HEAD -- sdd-unifier` against the current passages: 23 changed files, 410 insertions and 316 deletions. Punctuation-only differences were excluded from findings, as instructed. Read the complete SDD workflow and the surrounding derivation, chunking, parts, mode-conversion, questionnaire, decision-log, diagram, quality, and intent rules.
- Compared all 20 numbered chunk skeleton bodies with their combined-template sections, including chunks 05 and 13a. Checked the master separately as an index and state holder. An in-memory Python comparison removed only chunk wrappers and blank separators to expose differences; inspected the mode-specific paths, references, headings, cover state lines, and comments. The new data-model, publication-log, Behaviour, NFR-target, traceability, and e2e slots are mirrored. No unaccounted table or diagram-copy divergence was found. The shared malformed Resolution Log row is recorded as A-2; matching copies do not make that row valid.
- Checked step 6a's nine numbered checks, data-model scope, the three divergence registers and their status vocabulary; step 7's first-build and delta paths; step 8's marker walk and mandatory reconciliation; step 8b's E1 to E4, the same-date E4 rerun, every-write faithfulness pass, and the 02 to 13x Stale trigger; step 10's back-fill, review, version, and stale rules. B-1 is the remaining combined-update ambiguity.
- Reconciled the earlier SDD report: A-1 to A-8 are implemented; B-1 to B-3 and B-5 to B-11 are implemented, including C9's API-style decision. B-4 remains partly unclear after C11, as B-1 above records. C-1 and C-3 to C-5 are implemented. The two specific C-2 copies are fixed; C-1 above identifies another missed summary of the same fields. A-1 above is the remaining SDD reference copy of the prior cross/LLD A-9 fix. No resolved item is re-reported as a new failure.
- Checked BRD inputs against the current BRD skeletons: cover Status, Source BRDs metadata, use-case summary and detailed headings, dependency timing under C1, business-only integration and NFR fields, technical inputs, delivery-state cells, and the context-only treatment of chunks 15 and 16. `Needed before` now agrees on build of a use case, BAT sign-off, or go-live, and the SDD's promotion-path mapping does not cancel the integration mapping.
- Read `lld-unifier/sdd-to-lld.md` and the relevant LLD workflow rows against the SDD output: keyed UC links, Input-table triggers, ownership, source versions, Child LLDs, in-process Delivery and Behaviour, ERD keys, and the §18.5 Realised in mapping. A-1 is the confirmed lineage mismatch. Sent the stale descriptive LLD Homes row about Input-table triggers to the LLD scope owner for disposition.
- Shared verification from the LLD scope owner: `python -B _fixtures/checkers/check_refs.py lld-unifier sdd-unifier` exited 0; 240 references checked, 0 problems; all three sample anchors OK; Document Lineage and Child LLDs headings present and cited; Child LLDs columns match. Did not inspect or edit checker files.
- Local report verification: all 12 proposed replacement anchors occur exactly once in their stated current files and appear verbatim in this report; current line numbers checked. Report bytes are valid UTF-8 without BOM and contain no CR bytes. Only this report was written by this scope. No source fixes or state-changing Git commands were performed.
- Coverage is complete for this scope. Root README, checker code, fixture README, and other scopes' independent audits remain outside this report.

Report: `_fixtures/notes/step6-handoffs/recheck-sdd.md`. Counts: A 2, B 1, C 1. Needs the user's decision: none.

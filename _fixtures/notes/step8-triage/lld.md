# Step 8 triage: lld-unifier notes (condensed, with exact texts)

A read-only agent triaged the 8 notes of run S4b, plus one run miss (L9), against the working tree, and drafted the lld-unifier half of S5. Classes: M 0, S 3 (L1, L5, L7), D 5 (L2, L3, L4, L6, L8a), N 2 (L8b, L9). Every quoted old string occurs once in its file. All lld-unifier files are CRLF.

## Applied on 2026-10-08 (S, and the accepted S5)
- **L1:** sdd-to-lld.md, "How far a new SDD version reaches". The destinations are compared with "that whole source as it stands now": all that the row's SDD section cell names in the listed chunk. Each destination is judged by the part of that source the row sends to it, and a link to the LLD place that states that part carries it. The root README line now says "For each field mapping row whose SDD source the change touched ... against that whole source".
- **L5:** sdd-to-lld.md § SDD lineage. An accepted refresh "clears sdd-unifier's out-of-date note"; a declined one keeps it.
- **S5 and L7:** every dated review label carries the LLD version: `[YYYY-MM-DD] delta: chunk NN (vX.X)`, `[YYYY-MM-DD] delta: 04-implementation/<service>.md (vX.X)` (a per-service file by its name, with no `chunk` before it), `[YYYY-MM-DD] delta: section N (vX.X)`, `[YYYY-MM-DD] delta: global (vX.X)` and `[YYYY-MM-DD] application check: OI-NN (vX.X)`. Earlier rows keep their labels. Applied in SKILL.md (step 7, two places), chunks/18 and TEMPLATE-COMBINED.md.

Checks after applying: references 256 with 0 problems, README check 0, 59 tests and 7 subtests pass, record links 451 with 0 bad.

## Decided on 2026-10-08 (D), with the triage's recommendation

**Decisions.** The user accepted every recommendation and both optional extras. All are applied:
- **L2 B:** the alerts row in sdd-to-lld.md; the §13.7 Source column and note in chunk 10, and one line in the combined template; `§13.7 Alerts` in the derived-view lists of SKILL.md principle 13, sdd-to-lld.md rule 3 and the root README; and a matching root README mapping row. A parity edit the triage did not list: the same derived-view sentence in lld-unifier/README.md. Not taken: A's chunk 07 part, so §11.4 Metrics and Dashboards still reach no chunk 10 section.
- **L3 B,** with the sdd mirror in brd-to-sdd.md.
- **L4 A,** with the root README ripple, and the optional confidence-rules.md row, applied on the user's word after review: unlike other Low claims, the body keeps the SDD text as it stands, and only the flag gives the decided option as its best guess.
- **L6 A,** with the root README clause, worded for the shared paragraph: "setting an upstream version in an LLD link label to the one 16 §19.1 records".
- **L8a A,** in all three places.
- **L9,** and **L8b** in lld, brd and sdd SKILL.md.

L2 and L3 extend rules S4b measured (L2 the refresh reach of L1 B, L3 the flag removal), so they go to step 9 as unproven, with no scoped rerun.

Checks after applying: references 261 with 0 problems, README check 0, 59 tests and 7 subtests pass, the 16 CHK regression and 15 E3 inventory tests pass, record links 451 with 0 bad.

### L2. No mapping row reaches the LLD alert table, 10 §13.7
Alerts sit in five SDD places: §11.4 Alerting, §12 integration fallbacks, §15 error rows, `13x` lines, and §20 triggers. The run corrected §13.7 outside the mapping, and its OI-21 shows the gap. §11.4 Metrics and Dashboards also reach no chunk 10 section.
- **Recommendation B: one alerts row, with §13.7 as a sourced derived view.**
  - Insert after the row that sends §20 to `10-operations.md` § 13.8, in sdd-to-lld.md:
    `| Alerts the SDD raises (§11.4 Alerting, or any other SDD section that raises one: a §12 integration row, a §15 error row, a `13x` section) and the §20 procedure each one triggers | `10-operations.md` § 13.7 Alerts | **Derived view with declared source** (§ One fact, one home, rule 3): one row per alert, with the metric and threshold that implement its SDD condition, a Source link to the place that raises it, and an Action cell that links its §20 procedure, or a `> TODO:` when §20 has none. A change to any of these sources touches this row. |`
  - Add a Source column and Source note to §13.7 in chunks/10-operations.md and TEMPLATE-COMBINED.md, like the §13.1 note. `LLD` marks the LLD's own alerts, such as OutboxBacklog.
  - Add "§13.7 Alerts" to the derived-view lists in SKILL.md (principle 13), sdd-to-lld.md (rule 3) and the root README (the LLD derived-view sentence).
  - Add a matching row to the root README's SDD-to-LLD mapping table.
  - About seven edits.
- **A:** extend two existing rows. Row 07 also sends §11.4 to 10 §13.3, §13.6 and §13.7, and row 16 sends each §20 trigger to its §13.7 Action cell. This misses alerts raised only in §12, §15 or `13x`.
- **C:** no mapping change. The delta reviewer keeps raising missing alerts.
- L2 extends the refresh reach the scorecard measured (L1 B), so if accepted it goes to step 9 as unproven.

### L3. A Resolved item that the SDD change confirms
OI-09 and OI-10 stay Resolved, but their Resolution Log rows still name CONFIRM-23 and CONFIRM-24, which the 1.4 refresh removed. sdd-unifier/brd-to-sdd.md has the same three cases and the same gap.
- **Recommendation B.** In sdd-to-lld.md, "Open items the change settles", after "...a Resolution Log row `Reopened by SDD v[X.X]` (or `[KEY] v[X.X]`).", add:
  `A `Resolved` item that the change confirms, by answering a flag its Resolution Log row names, keeps its status, with a Resolution Log row `Settled by SDD v[X.X]` (or `[KEY] v[X.X]`) that names the removed flag and links the section that answers it.`
  No template change: `Settled by` already exists. Optional sdd mirror, in brd-to-sdd.md after "and through SKILL.md step 8.":
  `A closed item that the change confirms, by answering a marker its Resolution Log row names, keeps its status, with a Resolution Log row `Settled by [KEY] v[X.X]` that names the removed marker and links the BRD section.`
- **A:** no row, said explicitly. The records keep pointing at removed flags.
- **C:** a new `Confirmed by SDD v[X.X]` label for every confirmed Resolved item. The widest change.
- L3 extends the flag-removal rule the scorecard measured, so if accepted it goes to step 9 as unproven.

### L4. Confirm or TODO for an SDD decision still pending application
- **Recommendation A: always `> TODO:`.** This is what the run did.
  - sdd-to-lld.md, old:
    `An open, deferred, or `Decided - pending application` item that an implementation choice depends on becomes a `> Confirm:` or `> TODO:` that cites it (a pending decision is not yet SDD design text).`
  - New:
    `An open or deferred item that an implementation choice depends on becomes a `> Confirm:` or `> TODO:` that cites it, by the tiers of `confidence-rules.md`. A `Decided - pending application` item that one depends on becomes a `> TODO:` that cites it: the body follows the SDD text as it stands, and the flag gives the decided option as its best guess, to verify once sdd-unifier applies it (a pending decision is not yet SDD design text).`
  - Root README ripple, old:
    `an open, deferred, or `Decided - pending application` one that an implementation choice depends on becomes a `> Confirm:` or `> TODO:` flag`
  - New:
    `an open or deferred one that an implementation choice depends on becomes a `> Confirm:` or `> TODO:` flag, and a `Decided - pending application` one a `> TODO:` with the decided option as its best guess`
  - Optional: a matching row in confidence-rules.md.
- **B:** `> Confirm:`, with the body on the decided option.

### L6. An SDD version inside a link label ("SDD 1.12")
- **Recommendation A: a link change, kept equal to 16 §19.1.** This matches the run.
  - SKILL.md (Versions), old: `links (adding a missing BRD key to a citation included)`
  - New: `links (adding a missing BRD key to a citation, or setting an upstream version in a link label to the one 16 § 19.1 records, included)`
  - Optionally the same clause in the root README's versions paragraph.
- **B:** treat it as content. Every SDD refresh then bumps chunk 01.
- **C:** no upstream version in body link labels outside chunk 16.

### L8a. An SDD whose E2E gate is Locked or Stale
- **Recommendation A: proceed.** This matches the run and the root README.
  - SKILL.md step 3: after "stop and name the missing part." add ` A `Locked` or `Stale` E2E gate does not stop the LLD: name its state in 16 § 19.1 and the handoff.`
  - sdd-to-lld.md: after "stop, name the missing part, and do not derive." add ` A shut E2E gate (`Locked`, or `Stale`) does not stop the LLD: items the SDD still holds open or `Decided - pending application` reach it as flags (§ Field mapping table, the 18 Open Items row), and 16 §19.1 and the handoff name the gate state.`
  - sdd-to-lld.md, old: `The reconciled fan-out map and saga views orient the per-service derivation.`
  - New: `The reconciled fan-out map and saga views orient the per-service derivation; behind a `Stale` gate line, chunks 02 to `13x` win where chunk 19 differs.`
- **B:** stop on a Stale gate with pending items.
- **C:** ask in the step 3c offer.

### Optional extras (recommended)
- **L9:** a run miss; the text already covers it. Optional hardening in SKILL.md, step 7 "Answers in the same update".
  - Old: `Other text that the applied option makes wrong is brought in line in the same step when one wording is clearly right (the same fact stated again, a count, a cross-reference);`
  - New: `Other text that the applied option makes wrong, inside or outside the item's Where, is brought in line in the same step when one wording is clearly right (the same fact stated again, a count, a cross-reference; search the LLD for the words the option replaces);`
- **L8b:** a brief artifact. Optional guard for reviewers that cannot write files. At lld SKILL.md, after "...the `# 21. Open Items & Clarifications` section (combined shape).", add ` When it cannot write files, it returns the text and the main agent inserts it unchanged.` The same guard applies at the matching reviewer lines in brd SKILL.md and sdd SKILL.md.

## Not skill issues
- **L8b:** the brief forbade sub-agent writes and reads outside two folders, so the CLAUDE.md path and the reviewer's direct chunk 18 write could not be used.
- **L9:** customer-accounts §7.4 and 09 §12.5 kept the "orphan" wording that OI-16 replaced. The text names the case, and the application check caught it as OI-26.

Out of scope: the untracked `productization/` files (another session's) quote the old labels without `(vX.X)`.

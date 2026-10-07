# Triage: families

Read-only triage for step 6, families checker. Files read as they stood between 2026-10-01 21:15 and 2026-10-02 00:05 on branch `fix/unifier-fix-round` (from de3baec). During this run another worker edited, without committing, the business-reviewer-unifier files, `brd-unifier/chunking.md`, and several pre-brd-unifier files. Line numbers below are the current ones; each quote carries its text, so a line that shifts can still be found. An em dash inside a quote is written `[em dash]`. Scratch scripts: `SP\s6\scratch\families\` (`count_emdash.py`, `annotate_emdash.py`, `classify_emdash.py`, `count_endash.py`, `xlsx_peek*.py`).

Classes: D = design decision (default for the four families), S = simple fix that holds under every option, M = mechanical fix.

## Summary

**Family 1, versions (D).** One update, one version: an update is one request handled to its handoff (the first build counts as one, at 1.0; a business review session counts as one). Its first content change bumps the version one minor step and opens one Changes Log row that ends with a `Chunks:` list. The master and chunk 00 carry the current version; every other chunk keeps the version in which its content last changed, so gated chunks keep the version they were written at. Status lines, Stale marks, and the Child LLDs rows bump nothing. The out-of-date note is updated, never repeated (S, independent of the option).

**Family 2, reviews on update paths (D).** The full reviewer runs once, on the first build. Every later SDD or LLD update that changes content runs a cleared-context delta review of the chunks it changed, and every write of SDD chunk 19 gets a faithfulness check. The BRD keeps its consistency check as the review of an update.

**Family 3, retiring settled items and decision-log homes (D).** An upstream change closes or supersedes the owner's own items with the existing status values and a Resolution Log row "Settled by" or "Superseded by" the source, and removes the markers it answers. Both decision logs get a Marker register (any source) and a Business review register. The SDD's step 8 offers a marker walk, so gate condition E3 can be met on a first run.

**Family 4, Stale against a gated chunk (D).** Stale is a status mark, not a write: it is set only where the owning skill keeps the chunk's state, and only when the chunk exists. BRD 15-17: the status line, the chunk 14 row, and the master's State cell, always equal. SDD 19: the E2E gate line only. The reviewer never edits a gated chunk's content and sets the same marks.

**M items.** None that holds whatever the family decisions are. The plain in-file contradictions found (the three masters' VERSIONING lines; `apply-and-verify.md` Apply rule 7's gated-chunk bullet) are fixed by their families. One decision-independent S fix sits in family 1 (the out-of-date note, T4).

**Em dashes.** 539 in text files: pre-brd 3, brd 145, sdd 166, lld 225, business-reviewer 0, root README 0. None sits in a chunk skeleton or a `TEMPLATE-COMBINED.md`. 95 em dashes on 92 lines sit in text an agent copies as written: 18 in quoted prompts, 30 in flag or marker formats, 15 in fixed texts, 7 in examples, 23 in subagent briefs, 2 in code literals. The other 444 are instruction prose. The skeletons already use the replacements (` - ` in flags and set phrases, `:` in captions).

## Family 1: versions

### Current rules (quotes)

BRD:
- `brd-unifier/chunks/brd-master.md:7` VERSIONING: "All chunks share the BRD version number. A content change to chunks 00-13 bumps the BRD version in this master, in chunk 00, and in each changed chunk; status, link, and delivery-tracking updates bump nothing". The two sentences contradict each other. Causes A7.
- `brd-unifier/delivery-chunks.md:426`: "Only a **content change** bumps the version: a change to what chunks 00-13 say about the product. It means one minor step per run (1.0 to 1.1), one Changes Log row, and the new VERSION in chunk 00, in `[project-slug]-brd-master.md`, and in each chunk that was changed." Causes A7, G4 (the B1 run followed this rule against SKILL.md 8.3).
- `brd-unifier/delivery-chunks.md:180` (disposition `Corrected`): "Apply the correction to every affected chunk, add a Changes Log entry, and list it in the handoff." One more row source per run. G4.
- `brd-unifier/SKILL.md:235` (step 8.3): "add a Resolution Log row, and bump the Changes Log in chunk 00 once for the batch". Causes A7, G4.
- `brd-unifier/parts-mode.md:122`: "During the first build, the version does not change between parts. The Changes Log keeps one "Initial draft" row, dated when part 3 completes; the acceptance loop in part 3 then adds its own row as usual (SKILL.md step 8)." Causes A7.
- `brd-unifier/chunks/16-uat-bat-test-cases.md:5`: "VERSION: [X.X] (baselined against BRD v[X.X])", and `delivery-chunks.md:436`: "compare the basis line of 15-17 (`Basis:` in 15 and 17, `Baseline:` in 16) with the current BRD version: an older basis means `Stale`." No rule says whether a gated chunk's VERSION follows a bump. V2 "baseline-versioned chunks".

SDD:
- `sdd-unifier/chunks/sdd-master.md:7` VERSIONING: "All chunks share the SDD version number. When any chunk is updated, bump the SDD version in this master and in the updated chunk(s)." Self-contradictory. Causes C2, D3, S10.
- `sdd-unifier/SKILL.md:288` (step 8.3): "add a Resolution Log row, and bump the Changes Log in chunk 00 once for the batch". Step 2 item, D3.
- `sdd-unifier/parts-mode.md:139`: "The Changes Log keeps one "Initial draft" row, dated when part 3 completes; the acceptance loop in part 3 then adds its own row as usual (SKILL.md step 8)." Step 2 item, D3, and the two 1.0 rows behind C1-5 and L4.
- `sdd-unifier/SKILL.md:337`: "Bump the Changes Log." and `SKILL.md:343`: "bump the version. Several BRDs named in one request are taken in one update and one bump." No bump size anywhere. S10.
- `sdd-unifier/SKILL.md:110`, `brd-to-sdd.md:45`, `chunks/00-cover-and-changelog.md:37`, `TEMPLATE-COMBINED.md:32`: a row whose SDD version is older "gets " (out of date: SDD is now v[X.X]; refresh through lld-unifier)" appended to that cell" (the other three say "appends"). T4.
- `sdd-unifier/chunks/19-e2e-system-design.md:5`: "VERSION: [X.X]", with no rule for a gated chunk. T5 (its VERSION part), V2.

LLD:
- `lld-unifier/chunks/lld-master.md:8` VERSIONING: "All chunks share the LLD version number. When any chunk is updated, bump the LLD version in this master and in the updated chunk(s)." Self-contradictory. C1-9.
- `lld-unifier/SKILL.md:158` (step 3c): "read its Changes Log rows since the recorded version, name the SDD chunks they changed". The SDD rows name sections, and a version label can repeat. C1-4, C1-5, L4.
- `lld-unifier/sdd-to-lld.md:195`: "Bump the LLD version and add a Changes Log row."; `SKILL.md:312`: "Bump the Changes Log."; `SKILL.md:314-315`: "bump version". No size; nothing says two refreshes in one request share one bump (C1 did so).

Business reviewer (the option (c) text, plus uncommitted edits in the working tree):
- `business-reviewer-unifier/apply-and-verify.md:78-80`: "The first content change a review session makes to a document bumps that document's version once and opens one Changes Log row naming the session and the tracker." Answers V2's "per document or per chunk" and "where the changelog lives".
- `apply-and-verify.md:81-82`: "The bump follows the document's own rule: its master's VERSIONING line or its skill's rule for a targeted update." The SDD and LLD rules state no size, and the masters contradict themselves. V2 "bump size" stays open.
- `apply-and-verify.md:87`: "Every chunk the session changes, then or later, takes the new version." Gated and baselined chunks are not named. V2.
- `apply-and-verify.md:90-93`: "The Changes Log row lists each point ID with the chunks or sections it changed ... Its Reviewed By and Approved By cells (Reviewed/Approved By in a BRD) stay empty until the document's owner reviews and approves the new version." The Reviewed/Approved sentence is an uncommitted edit made during this run; it answers V2's last versioning bullet. "Or sections" is what lld-unifier step 3c cannot use (C1-4).

### Findings explained

- **A7** (step 3a, BRD): three rules disagree. SKILL.md 8.3 gives one row per batch, parts-mode gives the loop its own row in the first build, and delivery-chunks gives one minor step per run. The master's VERSIONING line also says both "all chunks share" and "each changed chunk".
- **G4** (step 4, B1): one run applied two batches (the grill-me decisions, then the consistency open items) and wrote one 1.1 row. It followed delivery-chunks.md:426 and broke SKILL.md 8.3.
- **Step 2 SDD item** ("8.3 bump vs parts-mode.md, runs differ: 1.0 vs 1.1") and **D3** (step 3d): the same text gave two results. `run-2026-09-30` kept 1.0 and wrote a second 1.0 row for the accepted OI-01 to OI-22. The 3d run bumped every file to 1.1.
- **C2** (step 3c): the agent followed the master's second sentence and bumped only the changed chunks.
- **S10** (step 4, A2a): no rule gives the bump size. The run used 1.1 and bumped only changed chunks.
- **C1-4** (step 4, C1): lld-unifier step 3c needs SDD chunks, but the SDD rows name sections. SDD headers 03, 06, and 17 read 1.1 while the 1.1 row names nothing in them. I checked the diff: 03 changed §7.1 and §7.2, 06 changed ADR-05, and 17 changed a reference cell. These were real content changes that the row left out, so neither the row nor the headers could be trusted alone.
- **C1-5, L4** (steps 3c and 4): the step 2 build left two rows labelled 1.0, so "rows since the recorded version" cannot place an LLD written between them. The step 5 review later relabelled the second row "1.0 (amended)" (DC-11).
- **T4** (step 4, A2b): the rule says "append", but a second bump before the LLD refreshes would give two notes. The run replaced the v1.1 note with a v1.2 one, which is the only sensible reading.
- **T5** (VERSION part) and **V2** (step 5): no rule covers a gated chunk's VERSION. V2 kept SDD 19 at 1.2 in a 1.3 SDD, REFUNDS 15-16 at "1.0 (baselined against BRD v1.0)", and LOYALTY 15-16 at 1.2. It assumed a minor bump because "the skill names none".
- **C1-9** (step 4, C1): the LLD master has the same contradiction. 17 and 18 read 1.0 in a 1.1 LLD; that is right under "changed chunks only" if they did not change.
- Reviewed By and Approved By: now answered in the reviewer (uncommitted). The owners' own rows, and the cover Status after a post-approval change, belong to the sign-off item (G5, S5, X4), outside this family. No rule is proposed here.

### Options and recommendation

**Recommended (D): one update, one version.** One rule, stated once per skill:
1. **Unit.** An update is one request, from its first change to its handoff. The first build is one update at 1.0: every part, the review, and the acceptance loop, plus the to-do (BRD) or chunk 19 when the gate opens (SDD). A business review session is one update, as option (c) already says. An update that stops and resumes keeps its version and its row.
2. **Size.** One minor step (1.2 to 1.3; 1.9 to 1.10). A major step only when the user asks for one.
3. **Timing.** At the update's first content change, as (c) does for the reviewer (finding A4 showed the cost of bumping at the end: three hours of changed content under the old version).
4. **Rows.** One Changes Log row per update. Later changes in the update join it: accepted items, applied decisions, consistency corrections. The row ends with `Chunks:` and the number of every chunk whose content changed (the first build's row lists none). No two rows share a version.
5. **Chunk headers.** The master and chunk 00 carry the current version. Every other chunk carries the version in which its content last changed. A gated chunk (BRD 15-17, SDD 19) keeps the version it was written at; its Basis or Baseline line names it.
6. **Not content changes** (no bump, no new chunk version): status and gate lines, the Reconciled line, Stale marks, links, footers, index rows, and the Child LLDs rows that lld-unifier writes, with their out-of-date note. The BRD's existing list stays.
7. **The out-of-date note** (S, decision-independent): added once; a later bump changes the version inside it.
8. **LLD step 3c** reads the `Chunks:` lists. For a row without one (an older SDD), it maps the sections the row names to their chunks. When the recorded label sits on two rows (an older SDD), it starts from the first of them.

Why: it is what the runs did when they did not contradict themselves (C2, S10, LOYALTY in V2, G4's single row). It is the only header rule that gated chunks can obey while shut. And it gives lld-unifier an exact list to refresh from. Tradeoffs: writers must keep the `Chunks:` list exact (a checker can compare it with the headers); a chunk header no longer shows the document's current version (read the master); the first build's loop has no row of its own (its story is in chunk 18 and the decision log).

**Alternative 1: every chunk shares the version.** Every bump rewrites every header. Pro: any header shows the current version. Con: every update touches every file (25 SDD files, 21 and more LLD files); the "last changed" signal is lost; and gated chunks cannot follow while shut, so the rule can never fully hold (V2 had to keep chunk 19 at 1.2).

**Alternative 2: one bump and one row per batch**, as both step 8.3 texts say now. Pro: finer history. Con: one request yields several versions (B1 would have had three); the first build gets 1.0 and 1.1 (the D3 split); an LLD sees versions that were never handed over.

**Alternative 3: rows keep naming sections**, and lld-unifier step 3c maps sections to chunks. Pro: writers change nothing. Con: C1-4 shows rows leave out changed sections (03, 06, 17), so the refresh offer misses chunks; section lists are long and hard to check against headers.

### Files to change (recommended option), with key wording

Rule homes (new or rewritten):
- `sdd-unifier/SKILL.md` § Output conventions, new bullet after "Decision register": "- **Versions**: one update, one version. An update is one request, from its first change to its handoff; the first build (every part, the review, the acceptance loop, and chunk 19 if the gate opens) is one update, at 1.0. The update's first content change bumps the version one minor step (1.2 to 1.3, 1.9 to 1.10; a major step only when the user asks for one) and opens one Changes Log row. Every later change in the update goes into that row, also after a pause. The row ends with `Chunks:` and the number of every chunk whose content changed (the first build's row lists none). The master and chunk 00 carry the current version; every other chunk keeps the version in which its content last changed, and chunk 19 the version it was written at. These are not content changes and bump nothing: the Reconciled and E2E gate lines, Stale marks, links, footers, index rows, and the Child LLDs rows that lld-unifier writes, with their out-of-date note. No two rows share a version."
- `lld-unifier/SKILL.md` § Output conventions: the same bullet, with "the first build (the body, the Specs, and the review)", "The master and `00-metadata.md` carry the current version", and the non-content list "links, footers, index rows, and this LLD's own row in the SDD's Child LLDs table".
- `brd-unifier/delivery-chunks.md:426`, the "Version." paragraph, replaced by: "**Version.** One update, one version. An update is one request, from its first change to its handoff; the first build (every part, the review, the acceptance loop, and the to-do) is one update, at 1.0. Only a **content change** bumps the version: a change to what chunks 00-13 say about the product. The update's first content change bumps the version one minor step (1.0 to 1.1, 1.9 to 1.10; a major step only when the user asks for one) and opens one Changes Log row. Every later change in the update goes into that row: accepted open items, applied decisions, and consistency corrections. The row ends with `Chunks:` and the number of every chunk whose content changed (the first build's row lists none). The new VERSION goes in chunk 00, in `[project-slug]-brd-master.md`, and in each changed chunk; every other chunk keeps the version in which it last changed, and chunks 15-17 keep the version they were written at (their basis line). No two rows share a version." Plus a pointer bullet in `brd-unifier/SKILL.md` § Output conventions: "- **Versions**: one update, one version (`delivery-chunks.md` § Refresh triggers, Version)."

Masters:
- `brd-unifier/chunks/brd-master.md:7`: "VERSIONING: One update, one version (delivery-chunks.md § Refresh triggers, Version). This master and chunk 00 carry the current BRD version; every other chunk carries the version in which its content last changed, and 15-17 the version they were written at. Status, link, and delivery-tracking updates bump nothing."
- `sdd-unifier/chunks/sdd-master.md:7`: "VERSIONING: One update, one version (SKILL.md § Output conventions, Versions). This master and chunk 00 carry the current SDD version; every other chunk carries the version in which its content last changed, and chunk 19 the version it was written at."
- `lld-unifier/chunks/lld-master.md:8`: "VERSIONING: One update, one version (SKILL.md § Output conventions, Versions). This master and 00-metadata.md carry the current LLD version; every other chunk carries the version in which its content last changed."

Step texts:
- `brd-unifier/SKILL.md:235` and `sdd-unifier/SKILL.md:288` (step 8.3): replace "and bump the Changes Log in chunk 00 once for the batch" with "and add the item to this update's Changes Log row (one bump per update: [rule home])".
- `brd-unifier/parts-mode.md:122` and `sdd-unifier/parts-mode.md:139`: "During the first build, the version stays 1.0 and the Changes Log keeps one "Initial draft" row, dated when part 3 completes. The review, the acceptance loop, and [BRD: the consistency check and the to-do / SDD: the e2e gate check] of part 3 belong to that build: they bump nothing and add no row. After part 3 is complete, any content change follows [rule home]."
- `brd-unifier/delivery-chunks.md:180`: "add a Changes Log entry" becomes "list it in this update's Changes Log row".
- `sdd-unifier/SKILL.md:337` and `lld-unifier/SKILL.md:312`: "Bump the Changes Log." becomes "Bump the version (§ Output conventions, Versions)."
- `lld-unifier/SKILL.md:158` (step 3c): "If the SDD is newer, read its Changes Log rows newer than the recorded version and take the chunks each row lists after `Chunks:`. For a row without that list (an older SDD), map the sections it names to their chunks. When two rows carry the recorded version (an older SDD), start from the first of them. Offer a targeted regeneration of every LLD chunk mapped from them ...".
- `lld-unifier/sdd-to-lld.md:195`: "Bump the LLD version and add a Changes Log row." becomes "One request is one update: one bump and one Changes Log row, even when it runs several of these refreshes (SKILL.md § Output conventions, Versions)."
- T4, S fix (four places): `sdd-unifier/SKILL.md:110`, `brd-to-sdd.md:45`, `chunks/00-cover-and-changelog.md:37`, `TEMPLATE-COMBINED.md:32`. Replace "appended to that cell" or "appends ... to its SDD version cell" with: "gets " (out of date: SDD is now v[X.X]; refresh through lld-unifier)" after its version; when the cell already carries the note, only the version inside it changes".

Reviewer:
- `business-reviewer-unifier/apply-and-verify.md:81-82`: "The bump is one minor step and follows the owning skill's version rule (BRD: `delivery-chunks.md` § Refresh triggers, Version; SDD and LLD: SKILL.md § Output conventions, Versions). A document no skill versions ..." (rest unchanged).
- `apply-and-verify.md:87`: add "Every other chunk keeps its version, a gated chunk included."
- `apply-and-verify.md:90-91`: "lists each point ID with the chunks or sections it changed" becomes "lists each point ID with the chunks it changed (sections only in a combined document) and ends with the owning skill's `Chunks:` list".

Optional pointers (same rule, no new content): `brd-unifier/transform-detection.md:127`, `sdd-unifier/transform-detection.md:145` and `:153`, `lld-unifier/transform-detection.md:173` and `:181`, `lld-unifier/chunking.md:182-185`. Optional tidy: drop "(baselined against BRD v[X.X])" from `brd-unifier/chunks/16-uat-bat-test-cases.md:5`, since its Baseline line already names the version. Optional checker note: the latest row's `Chunks:` list equals the set of chunks whose VERSION equals the current version (master and 00 aside).

## Family 2: reviews on update paths

### Current rules (quotes)

- `brd-unifier/SKILL.md:193, 195`: step 7 is "(mandatory, cleared-context)" and runs "After the body of the BRD is written but **before** presenting to the user (in `parts`: once, in part 3, after chunks 08-12)".
- `brd-unifier/SKILL.md:302` ("regenerate chunk N"): re-derive the matrix, refresh 14, mark 15-17 Stale. No review and no consistency check named. `SKILL.md:303` ("update the todo"): "rerun the consistency check".
- `brd-unifier/parts-mode.md:145` (redo a part): "update chunk 13 by status only (the independent reviewer runs again only if the user asks)".
- `brd-unifier/delivery-chunks.md:33` (G2): "A check run is recorded after the last content change to chunks 00-13". This forces a consistency check before the gate opens, not within the update.
- `sdd-unifier/SKILL.md:246, 248`: "(mandatory, cleared-context)"; "After the body of the SDD is written but **before** presenting to the user (in `parts`: once, in part 3, after chunk 17; chunks 00-17 exist, chunk 19 does not yet)".
- `sdd-unifier/SKILL.md:337, 343, 344` and `brd-to-sdd.md:68-69`: the update rows rerun step 6a, mark 19 Stale, and bump ("Same step 6a rerun, `Stale` marking, and version bump."). No review. S2.
- `sdd-unifier/parts-mode.md:71`: "The independent reviewer runs **once**, here, on chunks 00-17." `parts-mode.md:162`: "(the independent reviewer runs again only if the user asks)". S2.
- `sdd-unifier/SKILL.md:305` (8b.3): "Validate every Mermaid block, then check the counts in "Counts at a Glance" against §13, §14.4, and §14.9 coverage, and every sync edge against §15.2." This is the only check on chunk 19, in every path. V1.
- `lld-unifier/SKILL.md:249, 251`: "(mandatory, cleared-context)"; "After the body of the LLD AND the Specs chunk are written but **before** presenting to the user". L1, C1-2.
- `lld-unifier/SKILL.md:314-315` and `sdd-to-lld.md:195`: the refresh rows end with "then step 6a; bump version." No review. L1, C1-2.

### Findings explained

- **S2** (step 4, A2a): step 7 is mandatory, but the SDD update rows and `brd-to-sdd.md` § Changes after the SDD exists never call it, and parts-mode reruns it only on request. Step 6a is mechanical (names, symmetry, payload fields, roles, API IDs, §7.3), so it cannot see design slips.
- **X2** (found by A1b in 21 minutes): the 32-minute A2a update left six defects in 13d, all invisible to step 6a. A take-back record is kept "as long as the movement it created", but a 0-point take-back has no movement. The purchase lock assumes purchase reference equals receipt number, and with `NO_EARN` gone a mismatch leaves take-backs pending forever with no alert. The rejection table has no `id`, while Figure 24 shows one. A NOT NULL `purchase_reference` would stop the import run instead of rejecting a record. Figure 24 omits `tenant_id` from the take-back key. `reported_at` is nullable although the earn-lag metric needs it.
- **V1** (step 4): chunk 19 is written after step 7 by design, and 8b.3 checks only counts and sync edges. V1 found 17 mismatches in 17 minutes: 1 wrong, 3 misleading, 13 cosmetic. A step 7 rerun on updates would not have caught them, because no path reviews chunk 19 at all, not even a first build. Only a check after 8b.3 does.
- **L1** (step 3c, LLD) and **C1-2** (step 4, C1): the refresh rows skip step 7, and no rule says how to re-review an existing chunk 18 with stable OI IDs. In C1, chunk 18 stayed at 1.0 while OI-09, OI-10, and part of OI-14 were overtaken by SDD v1.2.
- **BRD equivalent**: step 7 is mandatory on the first build and silent on updates; parts-mode reruns it only on request; G2 forces a consistency check after content changes. The runs show no BRD update defect that a reviewer would have caught. The BRD problems were the reviewer's own (step 3a DEFECT 1) and the consistency loop's length (A1, G2: 13 runs, no stop rule).
- **Run time**: an SDD update takes 30 to 40 minutes, an LLD refresh with an SDD refresh 70 minutes. A focused read-only check took 17 to 21 minutes (V1, A1b). A full SDD review was never timed alone; the panel reviewers took 30 to 38 minutes each on 584 KB of three documents, so a full SDD pass is probably 30 to 40 minutes. That is an estimate, not a measurement.

### Options and recommendation

**Recommended (D): an update gets a review of what it changed.**
- **SDD.** After an update that changes content in chunks 01 to 17, run a delta review before step 8b and the handoff. It is the same cleared-context reviewer and brief, limited to the chunks the update's Changes Log row lists (family 1's `Chunks:` list) and to the change behind it. It reads chunk 18 first and never raises an existing item again. New items take the next free OI IDs and go through step 8. After every write of chunk 19 (first build included), a cleared-context faithfulness check reads it against 09 to 13x; chunk 19 is fixed where it disagrees, and a source-chunk problem becomes an open item.
- **LLD.** The same delta review after every update that changes LLD content. It also checks the items the refresh marked settled (family 3).
- **BRD.** The consistency check (to-do step 2) reruns in the same update and is its review. The reviewer reruns only on request, as parts-mode already says for a redone part.

Cost: about 15 to 25 minutes per SDD or LLD update, plus about 17 minutes when chunk 19 is written. An SDD update goes from 30 to 40 minutes to about 50 to 65; an LLD refresh from 70 to about 90. Gain: X2 and the V1 errors fall inside the scope, and LLD chunk 18 stays current. Tradeoffs: an SDD update may now stop for decisions (new items go through step 8), and new Open items keep the e2e gate shut. That is the intended effect: chunk 19 should not consolidate a design with known errors. For the BRD, this choice depends on the A1/G2 stop rule (another item), because every update reruns the check.

**Alternative 1: rerun the full step 7 review on every update** (all three skills). Pro: it catches regressions anywhere, with one brief. Con: about 30 to 40 minutes per update; it needs the "do not raise existing items" rule anyway; it still misses chunk 19 unless it runs after 8b; it makes the BRD loop longer.

**Alternative 2: the delta review in all three skills**, the BRD included. Pro: one rule everywhere. Con: 15 to 25 minutes on every BRD update, which already reruns the consistency check, with no BRD defect in the runs that needed it.

**Alternative 3: offer the delta review in the handoff (opt-in), and say in step 7 that updates skip it by default.** Pro: no added time, and the contradiction is gone. Con: X2- and V1-class defects ship unless the user asks, and chunk 19 stays unreviewed.

### Files to change (recommended option), with key wording

- `sdd-unifier/SKILL.md`, step 7, new paragraph after line 248: "**On an update.** The full review runs once, on the first build. A later update that changes content in chunks 01 to 17 (a step 10 row, `brd-to-sdd.md` § Changes after the SDD exists, or a redone part) runs a delta review before step 8b and the handoff. It is the same cleared-context reviewer with the same brief, limited to the chunks the update's Changes Log row lists and to the change behind it (the source BRD's Changes Log rows since its registered version, or the review tracker). The reviewer reads chunk 18 first and never raises an existing item again. New items take the next free OI IDs and go through step 8. The coverage record gets one dated line per changed chunk."
- `sdd-unifier/SKILL.md:305` (8b.3), after "and every sync edge against §15.2.": "Then a cleared-context agent checks chunk 19 against chunks 09, 10, 11, 12, and `13x`: every count, name, edge, and claim must trace to them. Fix chunk 19 where it does not; a problem in a source chunk becomes an open item, not an edit to chunk 19."
- `sdd-unifier/SKILL.md` step 10, one sentence above the table (line 333): "A row that changes content in chunks 01 to 17 ends with the delta review of step 7 (On an update)."
- `sdd-unifier/brd-to-sdd.md:68-69`: add to both rows "then the delta review (SKILL.md step 7, On an update)".
- `sdd-unifier/parts-mode.md:162`: "(the independent reviewer runs again only if the user asks)" becomes "(the delta review of SKILL.md step 7 covers the redone part)". `parts-mode.md:71`: add "Later updates run the delta review (SKILL.md step 7, On an update)."
- `lld-unifier/SKILL.md`, step 7, new paragraph after line 251: "**On an update.** The full review runs once, on the first build. A later update that changes LLD content (a step 9 row) runs a delta review before the handoff: the same reviewer and brief, limited to the chunks the update's Changes Log row lists and to the SDD or BRD change behind it. The reviewer reads chunk 18 first, never raises an existing item again, gives new items the next free OI IDs, and checks the items the refresh marked settled (`sdd-to-lld.md` § Refresh triggers)."
- `lld-unifier/SKILL.md` step 9, one sentence above the table: "A row that changes LLD content ends with the delta review of step 7 (On an update)." `lld-unifier/sdd-to-lld.md:195`: add "and ends with the delta review (SKILL.md step 7, On an update)".
- `brd-unifier/SKILL.md`, step 7, new paragraph after line 195: "**On an update.** The reviewer runs once, on the first build, and again only when the user asks. A later content change reruns the consistency check (to-do step 2) in the same update: that check is the update's review." And `brd-unifier/SKILL.md:302`: add "rerun the consistency check" to the "regenerate chunk N" row.
- Optional, for step 6.4: root `README.md:54` (add "Updates that change an SDD or LLD get a delta review of the changed chunks; the BRD's consistency check plays that part."), `sdd-unifier/README.md:66`, `lld-unifier/README.md:61`.

## Family 3: retiring settled items and the decision-log homes

### Current rules (quotes)

- `sdd-unifier/SKILL.md:260`: "Constraint: the reviewer captures **external** findings only [em dash] gaps the body did not flag inline. Inline `[NEEDS CLARIFICATION: ...]` markers stay where they are." D10.
- `sdd-unifier/SKILL.md:285`: "any inline clarification marker the decision clears is removed". Only an OI decision clears a marker. D10.
- `sdd-unifier/SKILL.md:286`: "A decision that replaces an earlier one keeps both records, the newer one marked as superseding." This covers the decision log only; chunk 18 is silent. S8, X3.
- `sdd-unifier/SKILL.md:302` (E3): "No `[NEEDS CLARIFICATION: ...]` marker remains in chunks 09, 10, 11, 12, or `13x`, or in §7.3 of chunk 03". D10.
- `sdd-unifier/SKILL.md:306`: "a new or reopened OI, marks an existing chunk 19 `Stale`". "Reopened" is named but never defined. S8.
- `sdd-unifier/SKILL.md:337`: "Decisions the user gives are recorded in `decision-log.md`", with no section named. `SKILL.md:338`: "apply any decisions the user gives through the step 8 mechanics first", but step 8 is written for open items. T1, D10.
- `sdd-unifier/SKILL.md:344` (business review row): "close the open items the review's decisions answer". This is the precedent; markers and overturned closed items are not covered.
- `sdd-unifier/brd-to-sdd.md:69` ("BRD <KEY> has a new version"): nothing on open items or markers the BRD now settles or overturns. S8, X3, C5.
- `sdd-unifier/decision-log.md:67`: "**Decision record, [YYYY-MM-DD]:** [What was decided: the chosen option or custom answer, and who decided. ...]". "Who decided" does not fit a BRD-driven change. S8.
- `sdd-unifier/decision-log.md:71-73`: "## Part N clarification register" / "[One per part that raised and then resolved inline clarification markers or contract divergences. One entry per item.]" C5, T1.
- `brd-unifier/decision-log.md:44` and `:48-50`: the same "who decided" and "## Part N clarification register" ("[One per later part that raised inline clarification markers. One entry per marker.]"). Same gap.
- `brd-unifier/SKILL.md:303`: "Decisions a business review already applied are checked, not applied again, and the open items they answer are closed through the step 8 mechanics." Precedent.
- `lld-unifier/chunks/18-open-items-and-clarifications.md:32`: Status "Open / Resolved (link to LLD update) / Deferred (with rationale)." `lld-unifier/sdd-to-lld.md:185-195` (Refresh triggers): no rule for chunk 18. L5, C1-2.
- `business-reviewer-unifier/apply-and-verify.md:15-19` (rule 3, edited during this run): "Each point that changes the document gets one record in its `decision-log.md` (created on first use, as that skill says): the point ID, the tracker, what was decided, and what it replaced." Neither owner's template has a section for it.

### Findings explained

- **S8** (step 4, A2a): LOYALTY v1.2 BR-4 replaced the next-day `NO_EARN` close that OI-18's accepted answer had put in the SDD. OI-19's import rule moved as well. A2a kept both items `Accepted - applied` and wrote superseding decision records. No rule says whether to reopen or annotate. The log had no section for markers a BRD update answers, so the run invented "LOYALTY v1.2 update clarification register", and "who decided" did not fit.
- **X3** (step 4, A1b): chunk 18 still shows OI-18 and OI-19 with their v1.0 answers and no pointer to the superseding records. In step 5 the panel raised the same gap again (DC-03).
- **L5** (step 3c, LLD) and **C1-2** (step 4, C1): with no rule, the same skill acted two ways. In 3c the author marked OI-09 and OI-10 Resolved; in C1 chunk 18 stayed unchanged, with OI-09, OI-10, and part of OI-14 overtaken.
- **T1** (step 4, A2b): the 23 marker decisions (CL-NN) had no home. The run put them in the Clarification register beside the OI entries.
- **C5** (step 3c, SDD): the only marker section is "Part N clarification register", which assumes parts mode.
- **D10** (step 3d, SDD): accepted answers add markers in 09 to 13x, and no path clears markers, so E3 is practically unreachable on a first run. Step 4 needed A1 (25 proposals), A1b (re-proposals after a BRD change), and the 8b row with a decisions file to get E3 met. So yes, the skill needs a standard path: the one step 4 improvised worked.
- **From option (c)**: rule 3 gives each review point a record in the owner's decision log, but no template section exists. The step 5 run invented "Business review register" in both the SDD and the LOYALTY logs. The REFUNDS BRD, changed by 19 points, had no decision log at all.

### Options and recommendation

**Recommended (D): settle items with the existing statuses; one home per source.**
1. **SDD, after an upstream change** ("BRD <KEY> has a new version", "add BRD", the business review row):
   - An `Open` or `Deferred` item the change answers closes as `Adjusted - applied`, or `Rejected` when the change makes it moot. Its Resolution Log row reads "Settled by [KEY] v[X.X]" with a link.
   - A closed item whose applied design the change overturns keeps its status when the change also decides the new design; its Resolution Log row reads "Superseded by [KEY] v[X.X]". When the change leaves a design choice open, the item goes back to `Open` and through step 8.
   - A marker the change answers is removed, and the text states the answer.
   - Each gets a decision-log record that names the source.
2. **LLD, on a refresh**: an item the change answers becomes `Resolved`, with "Settled by SDD v[X.X]". An item answered in part stays `Open`, and its Resolution Log row names the settled part.
3. **Decision logs** (BRD and SDD): "Part N clarification register" becomes "Marker register": any marker settled after it was written, by any source (the user at a checkpoint or later, the step 8 marker walk, a new source version, a review point). "Who decided" may name a source version or a review point. A new "Business review register" holds one record per review point, which (c)'s rule 3 then names.
4. **D10, SDD step 8**: a new item "Gate-blocking markers" offers a marker walk. For each marker in 09 to 13x and §7.3, the skill proposes options, a Recommended Answer, and a Why, in the open-item format. A value that must come from outside the design (a provider fact, a legal basis, a business number) is never proposed. Accepted answers are applied and recorded in the Marker register; deferred markers keep E3 unmet. The step 10 rows "generate the e2e design" and "fill in section Y" use it.

Why: no gate vocabulary changes. E1 and G1 and the checkers stay as they are; finding A2 (step 5) showed what a new status costs (E1 failed on "Superseded in part"). The homes match what the runs invented. Tradeoffs: `Adjusted - applied` on a BRD-settled item reads as if the user adjusted it, so the Resolution Log row must name the source. The marker walk adds user decisions and, on a first derive-from-BRD run, about 20 minutes of proposals plus 30 to 40 minutes of applying (A1, A2b). It is offered, not forced.

**Alternative 1: a new closed status, "Settled upstream"** (SDD E1, BRD G1, chunk 13 and 18 schemas, check_e2e). Pro: a reader sees why an item closed without opening the log. Con: a gate vocabulary change in three skills, the checkers, and the reviewer's structure list.

**Alternative 2: every item an upstream change touches goes back to `Open`** and through step 8. Pro: the user confirms each one. Con: more questions; the e2e gate shuts on items the BRD already decided; OI-18 and OI-19 would reopen only to close again.

**Alternative 3 (D10 only): raise each gate-blocking marker as an OI in chunk 18.** Pro: one loop, no new step. Con: the same gap lives in two places, against "inline markers stay"; chunk 18 grows by the marker count; the reviewer brief changes.

**Alternative 4 (D10 only): keep "fill in section Y now that I have decisions"** and list the markers in the handoff. Pro: no change. Con: step 4 needed two extra architect agents and a decisions file to meet E3.

### Files to change (recommended option), with key wording

- `sdd-unifier/brd-to-sdd.md` § Changes after the SDD exists, new paragraph after the table (after line 69): "**Items the change settles.** Before the delta review, check chunk 18 and the inline markers against the change. An `Open` or `Deferred` item the change answers closes as `Adjusted - applied`, or `Rejected` when the change makes it moot; its Resolution Log row reads `Settled by [KEY] v[X.X]` and links the BRD section. A closed item whose applied design the change overturns keeps its status when the change decides the new design, and its Resolution Log row reads `Superseded by [KEY] v[X.X]`; when the change leaves a design choice open, the item goes back to `Open`, with its Concern updated, and through step 8. A marker the change answers is removed, and the design text states the answer. Each gets a `decision-log.md` record that names the BRD version as its source: items under § Clarification register, markers under § Marker register."
- `sdd-unifier/SKILL.md:344`: "close the open items the review's decisions answer" becomes "close or supersede the open items and markers the review's decisions answer (`brd-to-sdd.md` § Changes after the SDD exists, Items the change settles)".
- `sdd-unifier/SKILL.md` step 8, new item before the current item 6: "6. **Gate-blocking markers.** When markers remain in chunks 09 to `13x` or §7.3 (E3), offer to settle them now. For each, propose two or three options with a Recommended Answer and its Why, in the open-item format, and ask in batches as in item 2. Do not propose a value that must come from outside the design (a provider fact, a legal basis, a business number): name its owner and keep the marker. Apply each accepted answer as design text, remove the marker, rerun step 6a if a contract changed, and record it under § Marker register in `decision-log.md`. A deferred marker stays and keeps E3 unmet." The current item 6 becomes 7: "When the loop ends, go to step 8b. Any `Open` or `Deferred` item, or marker left in those chunks, keeps the e2e gate shut."
- `sdd-unifier/SKILL.md:338`: "through the step 8 mechanics first" becomes "through the step 8 mechanics first (items 3 and 4 for open items, item 6 for markers)". `SKILL.md:337`: "are recorded in `decision-log.md`" becomes "are recorded in `decision-log.md` (a marker's under § Marker register)".
- `sdd-unifier/decision-log.md:67` and `brd-unifier/decision-log.md:44`: "who decided" becomes "who decided (the user, a delegation recorded below, or the source that settled it: a BRD version such as `LOYALTY v1.2`, or a business review point)".
- `sdd-unifier/decision-log.md:71-79` and `brd-unifier/decision-log.md:48-56`: "## Part N clarification register" becomes "## Marker register", with: "[One entry per inline clarification marker (SDD: or contract divergence) settled after it was written, whoever settled it: the user (at a part checkpoint, in a decision walk, or in a later request), a new version of a source document, or a business review point. Name the part when a part checkpoint settled it.]" The entry line becomes "**Resolution ([YYYY-MM-DD]):** [What was applied and who settled it: the user, a delegation recorded below, `[KEY] v[X.X]`, or business review [point ID].]".
- Both `decision-log.md` files, new section before "## Walkthrough and delegation history": "## Business review register" / "[One record per point of a business review (`business-reviewer-unifier`) that changed this document, written when the review applies the point.]" / "### [Point ID] - [short title]" / "**Decision record, [YYYY-MM-DD]:** [What the review decided and applied, what it replaced, and the open items or markers of this document it answers. Tracker: `[review-comments-tracker.md](../review-comments-tracker.md)`.]" / "**Rule home:** `[[Section name]](./NN-chunk.md#anchor)`".
- `sdd-unifier/chunks/18-open-items-and-clarifications.md`, Resolution Log: its comment becomes "When an open item is decided, or settled by an upstream change, add its row here"; the Outcome cell gains "Settled by [source]", "Superseded by [source]", and "Reopened by [source]" (source: `[KEY] v[X.X]` or a review point).
- `lld-unifier/sdd-to-lld.md` § Refresh triggers, new paragraph after line 195: "**Open items the change settles.** A refresh checks chunk 18 against the change. An `Open` or `Deferred` item it answers becomes `Resolved`, with a Resolution Log row `Settled by SDD v[X.X]` (or `[KEY] v[X.X]`) that links the section that answers it. An item it answers in part stays `Open`, and its Resolution Log row names the settled part." Optional: the Outcome cell in `lld-unifier/chunks/18-open-items-and-clarifications.md:77` gains "Settled by [source] - short note".
- `business-reviewer-unifier/apply-and-verify.md:17`: "gets one record in its `decision-log.md`" becomes "gets one record in its `decision-log.md`, § Business review register".

## Family 4: "Mark Stale" against a chunk whose own gate forbids writing it

### Current rules (quotes)

- `brd-unifier/delivery-chunks.md:53` (Re-lock): "mark the affected outputs `Stale` in Downstream outputs. They are not refreshed until the gate is open again." This names one of the three places. A3.
- `brd-unifier/delivery-chunks.md:83` (ground rule 4): "Each opens with one status: `Up to date` ..., `Provisional (TD-NN)` ..., or `Stale` (a change listed in § Refresh triggers ... came after it was written; locked until the gate is open again)." A status-line value that is normally set while the gate is shut. A8.
- `brd-unifier/chunks/15-implementation.md:9`, `16-uat-bat-test-cases.md:10`, `17-for-ppt.md:9` (GATE headers): "Never written or refreshed while the gate is shut." A8.
- `brd-unifier/SKILL.md:269` (8c.2): "Update the Delivery gate block and the Downstream outputs rows in `14-todo.md` (`Locked`, or `Stale` if they already exist)." A3.
- `brd-unifier/SKILL.md:260, 302, 303`: "mark them `Stale`" and "mark chunks 15-17 `Stale` if they exist", with no place named. A3.
- `brd-unifier/chunks/brd-master.md:122-124`: the State column "[Locked / Up to date / Provisional (TD-NN) / Stale]", which no rule maintains. `delivery-chunks.md:474`: "their Downstream outputs rows say `Locked` (or `Stale`)". A3.
- Readers: `sdd-unifier/brd-to-sdd.md:197`: "the State column of `[brd-slug]-brd-master.md` for a chunked BRD, or the `**Plan status:**` and `**Suite status:**` lines for a combined BRD"; `lld-unifier/sdd-to-lld.md:53`: "Read their state from the BRD master's delivery rows (or `14-todo.md` § Downstream outputs)."
- `sdd-unifier/SKILL.md:304, 306`: "Set the E2E gate line ... to `Locked`, or to `Stale` if chunk 19 already exists." and "marks an existing chunk 19 `Stale` on the E2E gate line". `chunks/19-e2e-system-design.md:9`: "While the gate is shut, nothing of this chunk is written, not even a draft or outline." These are consistent; L20.
- `business-reviewer-unifier/apply-and-verify.md:99-107`: "A gated chunk is never edited by the review, whether its gate is open or shut. Apply the decision at its source and mark the gated chunk Stale where its skill records that. ... BRD 15-17: the chunk's status line, the Downstream outputs rows of chunk 14, and the State cell of its row in the master's Delivery Chunks table. SDD 19: the E2E gate line in the master, or in the cover of a combined SDD." "Never edited" and "the chunk's status line" sit in one bullet. A8, L20.
- `apply-and-verify.md:57-61`: gated chunks "belong to the owning skill. The hand-off updates them", against `:209-210`: "Gated chunks ... refresh through their owners once their gates are open again. They are a note in the close-out, not a hand-off row." Loose wording rather than a contradiction. `business-reviewer-unifier/SKILL.md:210-211`: "never edits an LLD or a gated chunk".

### Findings explained

- **W A8** (step 5): the walkthrough marked BRD 15 and 16 Stale by writing their status lines and the master's State cells, and wrote "Shut - Stale" on the SDD gate line. Those chunks' GATE headers forbid any write while shut, and the old apply rule said nothing about gated chunks.
- **V2, L20** (step 5): the remnant hunt asked for a Stale banner in chunk 19. V2 rejected it, rightly, because chunk 19's GATE header forbids any write; the master line already carried the state.
- **A3** (the (c) consistency check): brd-unifier's own Stale rules (Re-lock, § Refresh triggers, SKILL.md 8c.2) leave out the master's State cell, yet sdd-unifier and lld-unifier read exactly that cell. For a combined BRD, sdd-unifier reads the status lines inside the gated sections. So a rule that forbade the status-line mark would blind the SDD to a stale combined BRD.
- The (c) text fixed the places but left "never edited" beside "the chunk's status line".
- Out of scope here, but for the C1/S1 owner: `sdd-unifier/parts-mode.md:162` also says "mark chunk 19 `Stale`" with no "if it exists".

### Options and recommendation

**Recommended (D): Stale is a status mark, not a write.** A gated chunk that exists is marked Stale only where its owning skill keeps its state, and nothing else in it changes. A shut gate allows the mark. A chunk that does not exist stays `Locked`, which is consistent with "Stale only if the chunk exists".
- BRD 15-17: the chunk's status line, its Downstream outputs row in chunk 14, and its State cell in the master's Delivery Chunks table. The three always hold the same value. In COMBINED mode: the section's status line and the 14-todo.md row.
- SDD 19: the E2E gate line only (master, or combined cover). Chunk 19 has no status line and is never touched.
- The reviewer: a gated chunk's content is never edited; it sets the same marks.

Why: these are exactly the places the downstream skills read. The BRD templates already put `Stale` in each status line. The step 5 run did this for BRD 15 and 16 and correctly refused a banner in chunk 19. Tradeoff: two models remain (the BRD chunks carry their own mark, SDD 19 does not), but each follows its own template, and no fact gets a second home.

**Alternative 1: Stale lives only outside gated chunks** (chunk 14 rows and the BRD master; the SDD gate line). Pro: one model for every gated chunk, and "never written while shut" stays absolute. Con: a chunk's own status line can read "Up to date" while stale (only the Basis line hints otherwise). `Stale` leaves the status-line vocabulary of three skeletons and `TEMPLATE-COMBINED.md`, and sdd-unifier must read a combined BRD's state from 14-todo.md instead.

**Alternative 2: every gated chunk carries its own status line, SDD 19 included**, kept equal to the gate line. Pro: every chunk shows its state where a reader opens it. Con: two homes for one fact (gate line and status line), against one fact, one home; a template change in sdd-unifier; L20's banner becomes a rule.

### Files to change (recommended option), with key wording

- `brd-unifier/delivery-chunks.md:53` (Re-lock): "**Re-lock.** If chunks 00-13 change, or a new `TD-NN`, `OI-NN`, `CF-NN`, or clarification marker appears after 15-17 were generated, mark each affected chunk that exists `Stale` (one that does not exist stays `Locked`). A chunk's state is kept in three places, always the same: its status line (in COMBINED mode, the status line of its section), its row in Downstream outputs (chunk 14), and its State cell in the master's Delivery Chunks table (CHUNKS mode). Setting the state is a status mark, not a write: a shut gate allows it, and nothing else in the chunk changes. The chunks are refreshed only when the gate is open again."
- `brd-unifier/delivery-chunks.md:83` (ground rule 4): add at the end "Setting `Stale` is a status mark, not a write, so a shut gate allows it (§ The delivery gate, Re-lock)."
- `brd-unifier/chunks/15-implementation.md:9`, `16-uat-bat-test-cases.md:10`, `17-for-ppt.md:9`: "Never written or refreshed while the gate is shut." becomes "Never written or refreshed while the gate is shut; only its status line may change, to Stale (delivery-chunks.md § The delivery gate, Re-lock)."
- `brd-unifier/SKILL.md:269` (8c.2): "Update the Delivery gate block, and set the state of each of 15-17 (`Locked`, or `Stale` if it exists) in the three places of `delivery-chunks.md` § The delivery gate, Re-lock."
- `brd-unifier/delivery-chunks.md:474`: "their Downstream outputs rows say `Locked` (or `Stale`)" becomes "their state reads `Locked` (or `Stale`) in all three places of § The delivery gate, Re-lock".
- `brd-unifier/chunks/brd-master.md:126` (comment under the Delivery Chunks table): add "State is the same value as the chunk's status line and its Downstream outputs row in 14-todo.md (delivery-chunks.md § The delivery gate, Re-lock)."
- Optional pointers: `brd-unifier/SKILL.md:260, 302, 303`, `parts-mode.md:145`, and `transform-detection.md:128` add "(`delivery-chunks.md` § The delivery gate, Re-lock)" after "mark ... `Stale`".
- `business-reviewer-unifier/apply-and-verify.md:99-107`: "- A gated chunk's content is never edited by the review, whether its gate is open or shut. Apply the decision at its source. If the gated chunk exists, set its state to Stale where its skill keeps that state; that is a status mark, not an edit, and nothing else in the chunk changes. The owner refreshes it through its gated step after the hand-off. - BRD 15-17: the chunk's status line, its Downstream outputs row in chunk 14, and its State cell in the master's Delivery Chunks table (`delivery-chunks.md` § The delivery gate, Re-lock). - SDD 19: the E2E gate line in the master, or in the cover of a combined SDD; chunk 19 itself is not touched."
- `business-reviewer-unifier/apply-and-verify.md:59-60`: "The hand-off updates them (§ Hand-off)." becomes "Their owners update them after the hand-off (§ Hand-off); the review only sets a gated chunk's Stale mark (rule 7)."
- `business-reviewer-unifier/SKILL.md:210-211`: "never edits an LLD or a gated chunk" becomes "never edits an LLD or a gated chunk's content (its Stale mark follows `apply-and-verify.md`, Apply rule 7)". Optional: the same wording in root `README.md:199` and `business-reviewer-unifier/README.md:33`.
- Optional: `sdd-unifier/chunks/19-e2e-system-design.md:9` (GATE) gains "Its state lives only on the E2E gate line; a Stale mark never touches this chunk."
- Optional checker note: for each existing BRD 15-17 chunk, its status line, its chunk 14 row, and its master State cell agree.

## M items

None. No plain in-file contradiction in these four families has a fix that holds whatever the family decision is. Those found are fixed inside their families:
- `brd-unifier/chunks/brd-master.md:7`, `sdd-unifier/chunks/sdd-master.md:7`, `lld-unifier/chunks/lld-master.md:8`: VERSIONING sentence 1 ("All chunks share ...") against sentence 2 ("... in each changed chunk" / "in the updated chunk(s)"). The fix depends on family 1 (the recommended option keeps sentence 2; alternative 1 keeps sentence 1).
- `business-reviewer-unifier/apply-and-verify.md:99-105`: "never edited" against "the chunk's status line". The fix depends on family 4 (the recommended option qualifies "never edited"; alternative 1 drops the status line).
- `brd-unifier/delivery-chunks.md:180` ("add a Changes Log entry") against `:426` ("one Changes Log row" per run). The fix depends on family 1 (alternative 2 would keep a row per batch).

One decision-independent S fix: T4, the out-of-date note, in four sdd-unifier places (family 1, files to change).

## Em dash inventory

### Method and counts

`count_emdash.py` counts U+2014 in every UTF-8 text file of the five skill folders (skipping `.pytest_cache`) and in the root README. `annotate_emdash.py` tags each line, and `classify_emdash.py` applies the classification below and checks that the parts add up to the total. The count was taken at about 21:30 and repeated at 00:03, with the same result despite the concurrent edits.

Total **539** on 506 lines: pre-brd-unifier 3, brd-unifier 145, sdd-unifier 166, lld-unifier 225, business-reviewer-unifier 0, root README 0. Step 2's 536 was the three .md folders (145 + 166 + 225); the 3 extra are in `pre-brd-unifier/scripts/export_xlsx.py`. **No em dash sits in any chunk skeleton or any `TEMPLATE-COMBINED.md`**: all 539 are in SKILL.md files, reference .md files, and that one script.

| File | Total | Copied | Prose |
|---|---|---|---|
| brd-unifier/SKILL.md | 47 | 7 | 40 |
| brd-unifier/chunking.md | 22 | 1 | 21 |
| brd-unifier/mermaid-diagrams.md | 15 | 3 | 12 |
| brd-unifier/modes.md | 5 | 0 | 5 |
| brd-unifier/sow-transformation.md | 21 | 1 | 20 |
| brd-unifier/transform-detection.md | 4 | 0 | 4 |
| brd-unifier/use-case-quality.md | 31 | 2 | 29 |
| sdd-unifier/SKILL.md | 52 | 8 | 44 |
| sdd-unifier/brd-to-sdd.md | 48 | 1 | 47 |
| sdd-unifier/chunking.md | 26 | 0 | 26 |
| sdd-unifier/mermaid-diagrams.md | 16 | 4 | 12 |
| sdd-unifier/modes.md | 2 | 0 | 2 |
| sdd-unifier/sdd-quality.md | 8 | 1 | 7 |
| sdd-unifier/source-transformation.md | 6 | 0 | 6 |
| sdd-unifier/transform-detection.md | 8 | 1 | 7 |
| lld-unifier/SKILL.md | 51 | 12 | 39 |
| lld-unifier/agent-orchestration.md | 28 | 18 | 10 |
| lld-unifier/chunking.md | 24 | 1 | 23 |
| lld-unifier/code-extraction.md | 13 | 4 | 9 |
| lld-unifier/confidence-rules.md | 16 | 7 | 9 |
| lld-unifier/hybrid-drift.md | 9 | 3 | 6 |
| lld-unifier/lld-quality.md | 7 | 2 | 5 |
| lld-unifier/mermaid-diagrams.md | 14 | 1 | 13 |
| lld-unifier/modes.md | 10 | 0 | 10 |
| lld-unifier/pattern-rules.md | 13 | 1 | 12 |
| lld-unifier/sdd-to-lld.md | 25 | 9 | 16 |
| lld-unifier/transform-detection.md | 15 | 6 | 9 |
| pre-brd-unifier/scripts/export_xlsx.py | 3 | 2 | 1 |
| **All** | **539** | **95** | **444** |

**Text an agent copies as written: 95 em dashes on 92 lines.** By kind:
- Q, quoted prompt shown to the user as written: 18
- F, flag or marker format written into documents: 30
- T, fixed text written into documents (names, set phrases, log text, heading names, rationale templates): 15
- E, example output the agent imitates: 7
- B, text copied into a subagent brief (reviewer prompt skeletons, dispatch templates): 23
- C, code literal that must match the character: 2

By skill: brd 14 on 12 lines; sdd 15 on 14 lines; lld 64 on 64 lines; pre-brd 2 (code). Without B and C: 70 on 67 lines (brd 12 on 10, sdd 13 on 12, lld 45 on 45). Step 2 counted 83 such lines (brd 13, sdd 19, lld 51) under a definition that was not saved, so the two counts cannot be matched line by line.

### Copy-verbatim lines, by skill and file

brd-unifier
- `SKILL.md`: 54 Q, 56 Q, 57 Q (the "Output format?" prompt and its two options); 141 T, 2 of 3 (board name `BRD [em dash] [Project Name] [em dash] Diagrams`); 213 B, 217 B (reviewer prompt skeleton: "... risky [em dash] not to confirm ...", "Why (the reason that option wins over the alternatives [em dash] evidence + tradeoff accepted ...)").
- `chunking.md`: 114 T, 1 of 2 (`Wireframe pending [em dash] see global UI/UX standards in chunk 11.`).
- `mermaid-diagrams.md`: 56 F (`[NEEDS CLARIFICATION: Mermaid syntax error [em dash] review]`); 174 T, 2 of 3 (the board name again).
- `sow-transformation.md`: 99 E (NFR wording "highly available [em dash] customers are never blocked from paying").
- `use-case-quality.md`: 93 E, 94 E (`**A1 [em dash] Partial approval:**`, `**E1 [em dash] Request withdrawn:**`; the skeleton `chunks/06a-use-cases-detailed.md:59-60` writes `**A1 - [...]:**`).

sdd-unifier
- `SKILL.md`: 56 Q, 58 Q, 59 Q (the "Output format?" prompt); 164 Q, 165 Q (the ecosystem question's two options); 179 F (`[NEEDS CLARIFICATION: Mermaid syntax error [em dash] review]`); 266 B, 270 B (reviewer prompt skeleton).
- `brd-to-sdd.md`: 430 E (marker example "... OpenAPI shapes [em dash] implied by WALLET/UC-01..04 ...").
- `mermaid-diagrams.md`: 64 F (`... Mermaid syntax error [em dash] review and fix]`); 78 T, 2 of 3 (`SDD [em dash] [Project Name] [em dash] Diagrams`); 79 T (frame names `Figure 1 [em dash] System Context`; the SDD skeleton captions write `Figure 1: ...`).
- `sdd-quality.md`: 160 E (runbook example "... [em dash] expect `{"status":"UP"}` within 30 seconds").
- `transform-detection.md`: 129 E (marker example "... [em dash] needs architect input.").

lld-unifier
- `SKILL.md`: 63 Q, 65 Q, 66 Q (the "Output shape?" prompt); 87 F, 91 F, 204 F (`> TODO: <best-guess> [em dash] verify`); 109 Q, 110 Q, 111 Q (the direction question, "Ask exactly this question": C1-1); 240 T, 1 of 2 (Roadmap "Not applicable [em dash] reverse-engineered LLD."; the skeleton `chunks/17-specs.md:57` writes " - "); 276 B, 282 B (reviewer prompt skeleton).
- `agent-orchestration.md` (fenced dispatch templates): 31, 33, 35, 37, 39, 41, 43, 45, 47, 56, 58, 60, 62 B (code-explorer brief, numbered report items "**Entry points** [em dash] ..."); 136, 141, 177, 187 B (docs-architect brief); 185 F (the TODO flag format inside that brief).
- `chunking.md`: 77 T (`> Participates in saga SAGA-NN [em dash] see 04-implementation/<orchestrator>.md`).
- `code-extraction.md`: 57 F and 58 F, 1 of 2 each (`> TODO: SLO targets [em dash] verify ...`, `> TODO: threat notes [em dash] verify ...`); 89 F (`> Confirm: pseudocode derived from method body [em dash] verify ...`); 92 F (`> TODO: business rule narrative ... [em dash] verify`).
- `confidence-rules.md`: 40 F (`> Confirm: [reason for medium confidence [em dash] what to verify]`); 48 F, 1 of 2 (heading with the TODO format); 61 F (`... [em dash] verify or replace`); 150 F, 169 F, 170 F (TODO format); 171 F (`> TODO: not derivable from inputs [em dash] please specify`).
- `hybrid-drift.md`: 49 F, 216 F (`> Drift note: ... [em dash] ...` formats); 78 T (Changes Log entry "Hybrid LLD generated; ... [em dash] see 15-open-questions.md.").
- `lld-quality.md`: 193 E (runbook example "... alert is closing [em dash] observe for 2 min before acting"); 236 F, 1 of 2 (TODO format).
- `mermaid-diagrams.md`: 186 F (`> TODO: Mermaid syntax error [em dash] please review and fix.`).
- `pattern-rules.md`: 230 T (Saga rationale template "... choreography saga is the default [em dash] `[svc-A]` emits ...").
- `sdd-to-lld.md`: 231 T (Roadmap `Not applicable [em dash] reverse-engineered LLD`); 296 T (heading name "§ 6.4 Architectural Style [em dash] As Operationalised"; the skeleton `chunks/03-architecture.md:74` writes " - "); 242, 351, 403 F (TODO format); 332 F (`> TODO: concrete commands once code exists [em dash] verify`); 367 F (`> TODO: <pseudocode best-guess> [em dash] verify with [KEY]/UC-NN`); 379 F (`> TODO: caching strategy [em dash] verify`); 383 F (`> TODO: peak scenarios [em dash] verify with SDD §18.3`; the skeleton `chunks/12-performance.md:56` writes " - ").
- `transform-detection.md`: 13 Q, 14 Q, 15 Q (the direction prompt again); 40 Q (friction prompt "Brownfield project type per the recorded Project Type [em dash] was the existing codebase intentionally excluded? ..."); 141 F (TODO format); 189 T (resolution text "tolerated by design [em dash] see ADR-NN").

pre-brd-unifier
- `scripts/export_xlsx.py`: 109 C, 110 C (the literals in `scrub_em_dashes()`; they must keep working).

### Instruction prose (444 em dashes; line numbers per file)

- brd-unifier/SKILL.md: 19, 39, 65, 84, 85, 91, 92, 93, 106, 114, 115, 117, 119, 123, 124, 125, 133, 137, 141, 161, 176, 185, 206, 227, 232, 237, 315, 316, 317, 318, 321, 322, 323, 324, 352, 356
- brd-unifier/chunking.md: 5, 13, 17, 23, 30, 33, 34, 35, 36, 38, 39, 40, 105, 111, 112, 113, 114, 115, 116, 161
- brd-unifier/mermaid-diagrams.md: 1, 3, 8, 13, 21, 53, 163, 171, 174, 176, 184
- brd-unifier/modes.md: 1, 13, 61, 104, 130
- brd-unifier/sow-transformation.md: 16, 17, 64, 72, 75, 81, 82, 83, 85, 91, 93, 105, 121, 135, 144, 224, 243, 248, 249
- brd-unifier/transform-detection.md: 1, 41, 86, 96
- brd-unifier/use-case-quality.md: 5, 16, 17, 18, 19, 20, 21, 22, 23, 24, 30, 42, 66, 82, 84, 88, 90, 99, 127, 131, 146, 153, 157, 168, 173, 183, 185, 196, 203
- sdd-unifier/SKILL.md: 19, 21, 41, 67, 88, 92, 93, 116, 117, 118, 122, 126, 127, 128, 140, 142, 144, 156, 168, 183, 222, 260, 280, 290, 325, 351, 352, 353, 354, 358, 359, 360, 361, 362, 388, 390, 398
- sdd-unifier/brd-to-sdd.md: 3, 11, 14, 16, 18, 144, 150, 151, 154, 166, 186, 210, 227, 228, 235, 237, 239, 240, 244, 246, 250, 261, 296, 302, 308 to 321, 325, 344, 355, 374, 387, 400, 401, 409
- sdd-unifier/chunking.md: 5, 13, 14, 16, 26, 29, 32, 34, 35, 36, 37, 42, 43, 53, 59, 71, 73, 90, 122, 135, 143, 144, 145, 146, 147, 184
- sdd-unifier/mermaid-diagrams.md: 1, 3, 8, 31, 56, 58, 69, 75, 78, 80, 88
- sdd-unifier/modes.md: 1, 103
- sdd-unifier/sdd-quality.md: 3, 131, 137, 140, 179, 183, 222
- sdd-unifier/source-transformation.md: 1, 21, 29, 36, 57, 65
- sdd-unifier/transform-detection.md: 1, 22, 52, 62, 78, 96, 122
- lld-unifier/SKILL.md: 19, 47, 57, 74, 92, 124, 128, 129, 130, 136, 138, 139, 141, 168, 169, 236, 238, 239, 240, 241, 243, 269, 322 to 335, 344, 364
- lld-unifier/agent-orchestration.md: 1, 9, 96, 214, 218, 219, 220, 221, 223, 234
- lld-unifier/chunking.md: 5, 24 (twice; one is an empty-cell placeholder in the chunk map), 27, 28, 30, 34, 35, 36, 37, 38, 39, 41, 42, 43, 55, 69, 71, 118, 119, 120, 121
- lld-unifier/code-extraction.md: 3, 15, 29, 57, 58, 59, 60, 123
- lld-unifier/confidence-rules.md: 1, 9, 25, 48, 59, 86, 102, 104, 129
- lld-unifier/hybrid-drift.md: 1, 26, 30, 34, 141, 164
- lld-unifier/lld-quality.md: 3, 80, 102, 226, 236
- lld-unifier/mermaid-diagrams.md: 11, 12, 13, 14, 15, 17, 18, 45, 65, 172, 173, 174, 175
- lld-unifier/modes.md: 1, 5, 6, 42, 71, 81, 94, 96, 106, 107
- lld-unifier/pattern-rules.md: 1, 8, 18, 19, 20, 21, 64, 94, 138, 146, 158, 226
- lld-unifier/sdd-to-lld.md: 11, 14, 15, 16, 18, 223, 227, 263, 291, 301, 310, 321, 329, 371, 375, 387
- lld-unifier/transform-detection.md: 1, 35, 39, 42, 65, 72, 116, 127
- pre-brd-unifier/scripts/export_xlsx.py: 82 (a docstring)

### Where the skeletons already settle the punctuation

The lld-unifier skeletons write the TODO flag with a spaced hyphen: `chunks/00-metadata.md:51`, `chunks/lld-master.md:110`, `chunks/10-operations.md:76`, `chunks/11-security.md:63`, `chunks/12-performance.md:56`. They also write "Not applicable - reverse-engineered LLD." (`chunks/17-specs.md:57`) and "Architectural Style - As Operationalised" (`chunks/03-architecture.md:74`). The BRD skeleton writes `**A1 - [condition]:**`. Set phrases across the skeletons use " - " ("None - platform flow", "Not applicable - no source BRD."), empty cells use `-`, and SDD captions use a colon ("Figure 1: Use Case Diagram"). The instruction files disagree with their own skeletons in exactly the F and T lines above (step 3 E1).

### Outside the text count

- `pre-brd-unifier/reference/PRE-BRD-v1.1.xlsx` (binary) holds 84 em dashes in its XML: 45 in shared strings (labels such as "Tier 1 [em dash] Idea Definition", guidance, and sample text), 34 in sheet 23 (17 formula strings, each with its cached value), and 5 in cell comments on sheet 8 (B11, B14, B18, B21, B26). `export_xlsx.py` `scrub_em_dashes()` cleans every string cell of an exported workbook, formula text included, but not cell comments. So those 5 probably reach an export; this is not verified by a run. It belongs to the pre-brd triage; the reference workbook itself is never modified.
- There are 64 en dashes (U+2013) in the same folders (pre-brd 22, brd 16, sdd 16, lld 10), for example "Medium-Large" and "200-400" written with an en dash. They are not in the 539.

### Replacement policy (punctuation by use)

| Use | Replace with | Example |
|---|---|---|
| Definition or label after a bold term or file name ("**GENERATE** [em dash] fresh BRD ...", "`modes.md` [em dash] chunks vs combined ...") | a colon | "**GENERATE**: fresh BRD from a SoW ..." |
| Heading with a subtitle ("## Argument parsing [em dash] do this first") | a colon; parentheses for a short qualifier | "## Argument parsing: do this first"; "### 3. Intake (short, not a clarification storm)" |
| Aside (a pair of em dashes, or one before a trailing detail) | parentheses; commas when short | "... will exist (one use-case chunk per persona, plus `14-todo.md`) and ..." |
| Sentence break (two clauses joined: "do NOT ask [em dash] proceed ...") | a colon when the second part explains or follows from the first; otherwise a full stop and a new sentence | "do NOT ask: proceed with the implied mode" |
| Range | "to" in prose; a plain hyphen in compact cells and IDs; never an em or en dash | "200 to 400 lines"; "UC-01 to UC-04" |
| Empty cell placeholder | a single hyphen `-`, as the skeletons do | a cell that holds only `-` |
| Fixed phrase, flag, or name written into documents (a value plus a qualifier) | a spaced hyphen ` - `, as the skeletons already write it | `> TODO: <best-guess> - verify`; "Not applicable - reverse-engineered LLD."; `**A1 - Partial approval:**`; `BRD - [Project Name] - Diagrams` |
| Figure or frame title | a colon, as the SDD captions do | `Figure 1: System Context` |
| Code literal that must match the character | the escape `\u2014` (the checkers' rule) | `"\u2014" in c.value` |

Order for the pass the user approved: the Q, F, T, and E lines first (they reach documents and chat), then the B lines (subagent briefs), then the prose, one skill at a time. After each skill, recount with `count_emdash.py` and diff the skeleton-matching formats (TODO and Confirm flags, set phrases) against the skeletons.

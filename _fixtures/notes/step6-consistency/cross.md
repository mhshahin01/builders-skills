# Step 6 consistency check: cross-skill and the rest

## Summary

Scope: the step 6 diff of business-reviewer-unifier and pre-brd-unifier in full context; families F1 to F4 across the five skills; the hand-offs on both sides (reviewer items 1 to 3, brd-unifier "update the todo", sdd-unifier's review and new-version rows, lld-unifier step 3c and step 9); the pre-BRD Markdown against the reference workbook (read with zipfile and openpyxl, no save); the root README. Nothing in the repo was edited.

Counts: A 9, B 9, C 11; README statements now wrong 13 (plus 3 optional additions). All fixes are mechanical except two.

Needs the user's decision:
- B-5: after a review, does brd-unifier's "update the todo" bump the BRD again just to close the items the review already applied? sdd-unifier says no for the SDD; recommended: the same for the BRD.
- B-7: a pre-BRD point's open remainder has no decision record any hand-off reads; recommended: the tracker's Decision cell states it and the BRD hand-off raises it as a BRD open item.

Overlaps: A-3 is also the brd checker's queued item (a), and the brd half of A-8 may appear in the brd report: apply one fix each. A-9 and B-8 edit lld-unifier files; B-5, B-6, and B-9 edit the same brd-unifier row and go in together. The workbook items (A-4, A-5, C-5, C-6, C-7) can share one surgical rewrite of the zip, with one backup and one test run.

Checked with no finding: the three masters' VERSIONING lines; both parts-mode first-build sentences; the reviewer's Apply rule 7 rule homes (each resolves); "who decided" and the Marker and Business review register names and shapes (apart from A-7); the SDD 19 GATE line and E2E gate line; the BRD 15-17 GATE lines, chunk 14 Downstream outputs, and master State cell (apart from A-8); F2 step 7 texts and update rows in all three skills; N-5 on both sides (apart from B-2 and C-9); W-4 in the BRD and SDD rows; the pre-BRD scoreboard (Executive Summary C17 to D21, J6, J7, the composite) against chunk 22 and frameworks.md; the cell map against chunks 06, 07, 10, 11, and 22; the workbook's 77 formulas; the step 6 workbook edit touched only `sheet23.xml` and `sharedStrings.xml`.

## A. Wrong or contradictory

### A-1. The reviewer's LLD hand-off still asks for two requests; lld-unifier now makes one offer (L3)

- Where: `business-reviewer-unifier/apply-and-verify.md:219-223`; the same wording in `business-reviewer-unifier/README.md:63`.
- Quote: "3. **Each child LLD (lld-unifier):** "the SDD has a new version". It refreshes the LLD chunks mapped from the SDD chunks the Changes Log names; a plain run also finds the newer SDD, through its SDD version check. When a source BRD's use cases, test cases, or screens changed, also "refresh the trace"."
- Why: L3 decided one offer. `lld-unifier/SKILL.md:158` (step 3c, run on every run that reads an SDD) now compares the SDD version and the BRD versions and chunk 14 and 16 states, and says "Make one offer for everything that changed". `lld-unifier/SKILL.md:310`: "When it fires several rows below, as when step 3c finds a new SDD version and a BRD change together, they run as one: one regeneration, one step 6a, one bump." The tracker writes "one row per request" (`apply-and-verify.md:190`), so "also "refresh the trace"" produces a second Hand-offs row and a second LLD run. "the SDD chunks the Changes Log names" also predates F1: step 3c reads the rows' `Chunks:` lists.
- Fix (mechanical):
  - `business-reviewer-unifier/apply-and-verify.md`, current:
    ```text
    3. **Each child LLD (lld-unifier):** "the SDD has a new version". It
       refreshes the LLD chunks mapped from the SDD chunks the Changes Log
       names; a plain run also finds the newer SDD, through its SDD version
       check. When a source BRD's use cases, test cases, or screens changed,
       also "refresh the trace".
    ```
    new:
    ```text
    3. **Each child LLD (lld-unifier):** "the SDD has a new version". Its
       SDD and BRD version check (step 3c) reads the `Chunks:` lists of the
       SDD Changes Log rows since the version the LLD recorded, and the
       source BRD versions, and makes one offer: the LLD chunks mapped from
       those SDD chunks, plus the trace when a source BRD's use cases, test
       cases, or screens changed. It is one update with one version. A
       plain run finds the same changes through that check.
    ```
  - `business-reviewer-unifier/README.md`, current: `(plus "refresh the trace" when a BRD's use cases, test cases, or screens changed)` new: `(its version check also offers the trace refresh a changed BRD needs, in the same update)`
  - The root README says the same at lines 197 and 199: see R-5 and R-6.

### A-2. The review leaves an Approved BRD's cover at `Approved` after changing its content (G5, S5, X4)

- Where: `business-reviewer-unifier/apply-and-verify.md:85-87`.
- Quote: "The bump is one minor step and follows the owning skill's version rule (BRD: brd-unifier's `delivery-chunks.md` § Refresh triggers, Version; SDD: sdd-unifier's SKILL.md § Output conventions, Versions)."
- Why: the cover rule sits in its own paragraph next to the Version paragraph: `brd-unifier/delivery-chunks.md:438` "**Cover status.** A content change to an `Approved` BRD sets the cover's Status to `In Review` and its Date to the change date." Apply rule 7 points the review only at "§ Refresh triggers, Version", and neither another reviewer rule nor brd-unifier's "update the todo" row (`brd-unifier/SKILL.md:306`) sets the cover. A reviewed BRD therefore keeps `Approved` over a version nobody signed. sdd-unifier reads that field: `sdd-unifier/brd-to-sdd.md:69` "A new version whose cover Status is not `Approved` gets the question of rule 1 above first." So the SDD hand-off after a review skips the S5 question.
- Fix (mechanical): `business-reviewer-unifier/apply-and-verify.md`, current:
  ```text
     - The bump is one minor step and follows the owning skill's version
       rule (BRD: brd-unifier's `delivery-chunks.md` § Refresh triggers,
       Version; SDD: sdd-unifier's SKILL.md § Output conventions, Versions).
  ```
  new:
  ```text
     - The bump is one minor step and follows the owning skill's version
       rule (BRD: brd-unifier's `delivery-chunks.md` § Refresh triggers,
       Version; SDD: sdd-unifier's SKILL.md § Output conventions, Versions).
       A BRD whose cover Status reads `Approved` also gets Status
       `In Review` and the change date on its cover (same file, § Refresh
       triggers, Cover status).
  ```

### A-3. brd-unifier's decision log is created only by a decided clarification, so the review cannot write the first record (queued item)

- Where: `brd-unifier/decision-log.md:8`; `brd-unifier/SKILL.md:342`; related: `sdd-unifier/decision-log.md:8`.
- Quote: "Created on first use: when the first clarification is decided (SKILL.md step 8). Do not write an empty register." and "Created on first use (the first decided clarification),".
- Why: the reviewer's Apply rule 3 (`business-reviewer-unifier/apply-and-verify.md:17-19`) writes "one record in its `decision-log.md`, § Business review register (the log is created on first use, as that skill says)". For a BRD with no log (REFUNDS in step 5), brd-unifier names only a decided clarification as the creator, so a literal run has no basis to create the file. The new Marker register has the same gap (a marker a later source version settles). sdd-unifier's rule says "when the first decision is recorded", but its list names neither a business review point nor a settled marker. The brd checker has the brd half as its queued item (a): apply one fix, not both.
- Fix (mechanical):
  - `brd-unifier/decision-log.md`, current: `- Created on first use: when the first clarification is decided (SKILL.md step 8). Do not write an empty register.` new: `- Created on first use: when the first decision is recorded (a decided clarification, SKILL.md step 8; a marker settled after it was written; or a business review point, written by business-reviewer-unifier). Do not write an empty register.`
  - `brd-unifier/SKILL.md`, current: `Created on first use (the first decided clarification),` new: `Created on first use (the first recorded decision: decision-log.md, Companion file rules),`
  - `sdd-unifier/decision-log.md`, current: `a resolved clarification, or an accepted open item).` new: `a resolved clarification, an accepted open item, a settled marker, or a business review point).`

### A-4. The workbook defines TAM as global; chunk 07 and the sheet's own rows size it for the segment and region

- Where: `pre-brd-unifier/reference/PRE-BRD-v1.1.xlsx`, sheet `Market Sizing & analysis`, E4 and G4 (shared strings 323 and 328, each used by that one cell only); `pre-brd-unifier/chunks/07-market-sizing-analysis.md:16`.
- Quote: E4 "The total demand for your product globally"; G4 (sample) "All event organizers worldwide"; chunk 07: "The total demand for the product in the target segment and region, as sized in sections 1 to 3."
- Why: P4 changed the Markdown definition and listed E4 as optional; the D agent left it. E4 is guidance, never cleared, so every export carries it. The same sheet computes a segment-and-region TAM (A13 "Regional market (TAM, all segments)", A15 "Serviceable TAM (segment, region)", B25 `=AVERAGE(B15,B22)`), so the exported sheet contradicts itself and chunk 07.
- Fix (mechanical): surgical edit of `xl/sharedStrings.xml`, as step 6 did for EFAS E12 (back up first; every other zip entry byte-identical): string 323 becomes `The total demand for your product in the target segment and region, as sized in sections 1 to 3`; string 328 becomes `All event organizers in the target segment and region`.

### A-5. Eight EventHive comments on Market Sizing answer cells reach every export (queued item)

- Where: `pre-brd-unifier/reference/PRE-BRD-v1.1.xlsx`, part `xl/comments1.xml` (author "M Shahin"), on `Market Sizing & analysis`!B11, B12, B14, B18, B19, B21, B26, B28; against `pre-brd-unifier/xlsx-export.md:44`.
- Quote: comments such as "EventHive assumption: share of the EMS market attributable to residential community / HOA / venue-amenity events" and "Source: Fortune Business Insights, Event Management Software Market (report 102611), 2025 ... global EMS market USD 9.90B"; xlsx-export.md: "a global clear guarantees no leftover example value survives - not in a filled sheet, and not in a sheet the payload omits."
- Why: all eight cells are Answer cells in `cell-map.json`. `clear_all_answers` blanks their values, not their comments, and openpyxl writes the comments back, so every export annotates the user's own figures with EventHive sources. The step 6 scrub only removes the dashes. N-3 (accepted) made the reference workbook generic; these comments are the part it missed. The part also still holds 5 em dashes (scrubbed only on export) and 1 en dash (never scrubbed).
- Fix (mechanical), a surgical removal:
  1. Back up the workbook to the fixing agent's scratch folder.
  2. Rewrite the zip with every other entry byte-identical and in the same order, except:
     - drop `xl/comments1.xml` and `xl/drawings/vmlDrawing1.vml` (the workbook's only comment and VML parts);
     - drop `xl/worksheets/_rels/sheet8.xml.rels` (its only two relationships, rId1 to the VML part and rId2 to the comments, point at the dropped parts);
     - in `xl/worksheets/sheet8.xml` delete `<legacyDrawing r:id="rId1"/>` (the sheet's only `r:id`);
     - in `[Content_Types].xml` delete `<Override PartName="/xl/comments1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml"/>` (the `<Default Extension="vml" .../>` entry may stay).
  3. Verify: openpyxl finds no cell comment on any sheet; every cell value equals the backup's; the workbook still has 77 `<f>` elements; Excel opens it without a repair prompt; `python -B -m pytest pre-brd-unifier/scripts/tests -q -p no:cacheprovider` passes (the comment-scrub test uses its own synthetic workbook, so it is unaffected).

### A-6. The BRD's version rule is worded differently from its own master and from the SDD and LLD rules (F1)

- Where: `brd-unifier/delivery-chunks.md:426`.
- Quote: "Every later change in the update goes into that row: accepted open items, applied decisions, and consistency corrections." and "every other chunk keeps the version in which it last changed, and chunks 15-17 keep the version they were written at".
- Why: F1 is one rule stated once per skill. `brd-unifier/chunks/brd-master.md:7` says "every other chunk carries the version in which its content last changed"; `sdd-unifier/SKILL.md:387` and `lld-unifier/SKILL.md:356` say "keeps the version in which its content last changed" and "Every later change in the update goes into that row, also after a pause." The BRD home drops both qualifiers. Read literally, "in which it last changed" lets a status or link edit (chunk 14 statuses, footers) move a chunk's VERSION header, which the same paragraph says bumps nothing; and the BRD rule alone is silent on an update that pauses and resumes (families.md F1, item 1: "An update that stops and resumes keeps its version and its row").
- Fix (mechanical), two edits in `brd-unifier/delivery-chunks.md`:
  - current: `Every later change in the update goes into that row: accepted open items` new: `Every later change in the update goes into that row, also after a pause: accepted open items`
  - current: `every other chunk keeps the version in which it last changed, and chunks 15-17` new: `every other chunk keeps the version in which its content last changed, and chunks 15-17`

### A-7. The open-remainder rule differs between the two Business review registers (F3, W-4)

- Where: `brd-unifier/decision-log.md:64`; `sdd-unifier/decision-log.md:88`.
- Quote: BRD: "An open remainder (a question the point leaves for this document's owner) is stated here. Tracker: `[review-comments-tracker.md](../review-comments-tracker.md)`.]"; SDD: "Tracker: `[review-comments-tracker.md](../review-comments-tracker.md)`. An open remainder, a question the decision leaves to this document's owner, is stated here; the owner's hand-off raises it as an open item.]"
- Why: F3 gives both logs the same register with the same shape, and the reviewer writes both from one rule (Apply rules 3 and 6). The two templates now word the W-4 rule differently, and only the SDD says who raises the open item. The BRD side's raise lives in `brd-unifier/SKILL.md:306`, so the behaviour matches, but the template sentence a run copies does not.
- Fix (mechanical): `brd-unifier/decision-log.md`, current: `An open remainder (a question the point leaves for this document's owner) is stated here. Tracker: [review-comments-tracker.md](../review-comments-tracker.md).]` new: `Tracker: [review-comments-tracker.md](../review-comments-tracker.md). An open remainder, a question the decision leaves to this document's owner, is stated here; the owner's hand-off raises it as an open item.]`

### A-8. In a combined BRD, a version bump must repoint the links in 17, which F4's GATE line now forbids while the gate is shut

- Where: `brd-unifier/chunks/17-for-ppt.md:9`; `brd-unifier/delivery-chunks.md:460`; `business-reviewer-unifier/apply-and-verify.md:103-106`.
- Quote: 17 GATE: "Never written or refreshed while the gate is shut; only its status line may change, to Stale (delivery-chunks.md § The delivery gate, Re-lock)."; delivery-chunks.md: "The combined file name carries the version. After every version bump, repoint the links in 14 and 17."; reviewer: "rename the file with the bump, and update the citations to it in the documents the session may edit."
- Why: in COMBINED mode, 17 is a separate file whose links target `../BRD-[ProjectName]-v[X.X].md`. Every content change renames that file (F1), and a content change is exactly what makes an existing 17 Stale while the gate is shut. The F4 wording "only its status line may change" now forbids the repoint the COMBINED rule requires, so the links break or the gate rule is broken. The reviewer renames a combined BRD too and may not edit a gated chunk, so after a review 17's links break until the gate opens. The brd checker may report the brd half.
- Fix (mechanical):
  - `brd-unifier/chunks/17-for-ppt.md`, current: `only its status line may change, to Stale (delivery-chunks.md § The delivery gate, Re-lock).` new: `only its status line may change, to Stale (delivery-chunks.md § The delivery gate, Re-lock), and in COMBINED mode its links to the renamed BRD file (§ COMBINED mode adaptations).`
  - `brd-unifier/delivery-chunks.md`, current: `After every version bump, repoint the links in 14 and 17.` new: `After every version bump, repoint the links in 14 and 17. Like a Stale mark, a link repoint is not a write, so a shut gate allows it in 17.`
  - `business-reviewer-unifier/apply-and-verify.md`, current:
    ```text
         the file with the bump, and update the citations to it in the
         documents the session may edit. The owning skills repoint the lineage
         links at the hand-off.
    ```
    new:
    ```text
         the file with the bump, and update the citations to it in the
         documents the session may edit, the links in a combined BRD's
         `14-todo.md` and `17-for-ppt.md` included (a link is not content, so
         a gated chunk's links change like its Stale mark). The owning skills
         repoint the lineage links at the hand-off.
    ```

### A-9. After a declined refresh, the LLD still writes the SDD's current version into its Child LLDs row (L3, F1)

- Where: `lld-unifier/SKILL.md:247` (step 6c); `lld-unifier/sdd-to-lld.md:218`; against `lld-unifier/SKILL.md:158` and `sdd-unifier/brd-to-sdd.md:45`.
- Quote: step 6c: "add or update this LLD's row with this run's mode as Direction and the SDD version this run read as SDD version"; sdd-to-lld.md: "| SDD version | The SDD version this run read (the SDD's current version) |"; step 3c: "Never refresh silently: the user accepts the refresh, or the LLD keeps its content and the handoff names the SDD and BRD versions it still reflects."
- Why: step 6c runs on every run that reads an SDD. When the user declines step 3c's one offer, the LLD still records the SDD's current version in the SDD's lineage. sdd-unifier's out-of-date note ("A row whose SDD version is older than this SDD's current version is out of date") then disappears, and the reviewer's lineage context and the next SDD run see an LLD that looks current but is not, while 16 § 19.1 keeps the older version: the two ends of the lineage disagree.
- Fix (mechanical):
  - `lld-unifier/SKILL.md`, current: `the SDD version this run read as SDD version` new: `the SDD version its content reflects as SDD version (the version in 16 § 19.1: the current one after a build or an accepted refresh, the older one when the user declined step 3c's offer)`
  - `lld-unifier/sdd-to-lld.md`, current: `| SDD version | The SDD version this run read (the SDD's current version) |` new: `| SDD version | The SDD version this LLD's content reflects, as 16 § 19.1 records it: the SDD's current version after a build or an accepted refresh, the older one when the user declined the refresh (SKILL.md step 3c) |`

## B. Ambiguous

### B-1. The `Chunks:` list has no form for a combined BRD or SDD, but the LLD and the reviewer rely on it there (F1)

- Where: `sdd-unifier/SKILL.md:387`; `brd-unifier/delivery-chunks.md:426`; against `lld-unifier/SKILL.md:356` and `:158`, and `business-reviewer-unifier/apply-and-verify.md:97-99`.
- Quote: SDD and BRD: "The row ends with `Chunks:` and the number of every chunk whose content changed (the first build's row lists none)."; LLD: "(a per-service file by its name, `04-implementation/<service>.md`; a combined LLD lists sections; the first build's row lists none)"; reviewer: "lists each point ID with the chunks it changed (sections only in a combined document) and ends with the owning skill's `Chunks:` list".
- Why: a combined SDD or BRD has no chunk files, and only the LLD says what its list holds. lld-unifier step 3c "take[s] the chunks each row lists after `Chunks:`" and maps each SDD chunk through the field mapping table, so a combined SDD that lists sections (as the LLD rule and the reviewer's point list suggest) gives step 3c nothing it can map, while one that lists chunk numbers follows a rule nobody wrote.
- Fix (mechanical), the same current text in both files (unique in each):
  ```text
  The row ends with `Chunks:` and the number of every chunk whose content changed (the first build's row lists none).
  ```
  - `sdd-unifier/SKILL.md`, new:
    ```text
    The row ends with `Chunks:` and the number of every chunk whose content changed (the first build's row lists none; a combined SDD lists the chunk number each changed section belongs to in `chunking.md` § Canonical chunk map, so lld-unifier reads the same list).
    ```
  - `brd-unifier/delivery-chunks.md`, new:
    ```text
    The row ends with `Chunks:` and the number of every chunk whose content changed (the first build's row lists none; a combined BRD lists the chunk number of each changed section, `chunking.md` § Heading map).
    ```

### B-2. The reviewer's SDD hand-off reads as if the review's own SDD changes share the hand-off's version (N-5)

- Where: `business-reviewer-unifier/apply-and-verify.md:206-210`.
- Quote: "naming every changed source BRD in one request. The SDD takes them, with any change the review made to the SDD itself, in one update and one version;"
- Why: the review already bumped the SDD at its first change (Apply rule 7), and sdd-unifier says so: `sdd-unifier/SKILL.md:353` "The review already bumped the version for its own changes; this run bumps it again only if it changes content itself". "with any change the review made ... in one update and one version" can be read as "no review bump" or "fold the review's version into the hand-off's", and a run following it may skip the review's bump or merge two Changes Log rows, which F1 forbids ("No two rows share a version"; one row per update).
- Fix (mechanical): current:
  ```text
       naming every changed source BRD in one request. The SDD takes them,
       with any change the review made to the SDD itself, in one update and
       one version;
  ```
  new:
  ```text
       naming every changed source BRD in one request. The SDD takes them
       in one update with at most one more version; that update also runs
       the checks for the changes the review made to the SDD itself, whose
       bump stands;
  ```

### B-3. "So the user can ask for more" has no path, and the findings file is "never edited" (K4, K6)

- Where: `business-reviewer-unifier/panel-orchestration.md:83-85`; `business-reviewer-unifier/tracker-schema.md:12-13`; `business-reviewer-unifier/SKILL.md:138-139`.
- Quote: "6. Report after merge: ... and each reviewer's `Left out` line, so the user can ask for more."; "The file is written once, at the merge, and never edited."
- Why: K4's accepted option shows the left-out counts "so the user can ask for more", but nothing says what a request for more does: whether the reviewer is re-dispatched, with what brief, and where its findings go. The merge report comes after the tracker and `review-panel-findings.md` are written, and the companion file may never be edited, so a run that honours the request breaks K6's rule, and one that keeps K6's rule loses the new findings' Why and Direction.
- Fix (mechanical):
  - `panel-orchestration.md`, current:
    ```text
    6. Report after merge: total raw findings, merges performed, final point
       count, per-reviewer counts, and each reviewer's `Left out` line, so the
       user can ask for more.
    ```
    new:
    ```text
    6. Report after merge: total raw findings, merges performed, final point
       count, per-reviewer counts, and each reviewer's `Left out` line, so the
       user can ask for more. A reviewer asked for more is re-dispatched once,
       before the walkthrough starts, for the areas its `Left out` line names,
       with its earlier findings listed so it does not repeat them; the new
       findings are merged under these rules and added to the tracker and to
       `review-panel-findings.md`.
    ```
  - `tracker-schema.md`, current:
    ```text
    in, one heading per point (`## <ID>: <short concern>`). The file is
    written once, at the merge, and never edited.
    ```
    new:
    ```text
    in, one heading per point (`## <ID>: <short concern>`). The file is
    written at the merge, takes the findings of any re-dispatch the user
    asks for before the walkthrough (`panel-orchestration.md`, Merge rule
    6), and is never edited after the walkthrough starts.
    ```

### B-4. Which of chunk 22's conditions go to B26:B28 is unclear, so the Excel and Markdown lists can differ (N-3)

- Where: `pre-brd-unifier/xlsx-export.md:41`; `pre-brd-unifier/chunks/22-executive-summary-scoreboard.md:53`; workbook `Executive Summary`!B25.
- Quote: xlsx-export.md: "B26:B28 take chunk 22's conditions, numbered from 2, because B25 is the sheet's automatic first condition (the lowest signal); note any condition beyond the third as overflow."; chunk 22: "Add prioritized conditions derived from the weakest signals (for example: thin competitive moat per VRIO, modest market ceiling per Market Sizing, prioritization inputs not yet populated per RICE)."; B25 is a formula: `"1. Lowest signal - "&INDEX(B17:B21,MATCH(MIN(D17:D21),D17:D21,0))&...` (dash shown as a hyphen).
- Why: N-3 (pre-brd.md) meant "chunk 22's conditions map from the second one on", which only works if chunk 22's condition 1 is the lowest signal. Chunk 22 never says so. A payload builder can write chunk 22's conditions 1 to 3 into B26:B28 (the lowest signal then appears twice, or a Markdown condition is lost) or conditions 2 to 4 (correct only by luck); "beyond the third" counts from an unclear base.
- Fix (mechanical):
  - `chunks/22-executive-summary-scoreboard.md`, current: `Add prioritized conditions derived from the weakest signals (for example: thin competitive moat per VRIO, modest market ceiling per Market Sizing, prioritization inputs not yet populated per RICE).` new: `Add prioritized conditions derived from the weakest signals. Condition 1 is always the lowest-scoring signal (the first in table order on a tie), with its score and rationale: the Excel writes that one itself. Later conditions add the next ones (for example: thin competitive moat per VRIO, modest market ceiling per Market Sizing, prioritization inputs not yet populated per RICE).`
  - `xlsx-export.md`, current: `B26:B28 take chunk 22's conditions, numbered from 2, because B25 is the sheet's automatic first condition (the lowest signal); note any condition beyond the third as overflow.` new: `B26:B28 take chunk 22's conditions 2 to 4, each with its number (2. ...); condition 1, the lowest signal, is the sheet's automatic B25. Note any condition after the fourth as overflow.`

### B-5. After a review, brd-unifier's hand-off may bump the BRD again only to close items; sdd-unifier says it does not (F1, N-5) - needs the user's decision

- Where: `brd-unifier/SKILL.md:306` ("update the todo" row) with step 8.3 (`brd-unifier/SKILL.md:238`); against `sdd-unifier/SKILL.md:353`.
- Quote: BRD: "Decisions a business review already applied are checked, not applied again, and the open items they answer are closed through the step 8 mechanics."; step 8.3: "Set the OI's Status to `Accepted - applied` (or `Adjusted - applied`), add a Resolution Log row, and add the item to this update's Changes Log row (one bump per update ...)"; SDD: "The review already bumped the version for its own changes; this run bumps it again only if it changes content itself".
- Why: the review is one update with its own bump and row (Apply rule 7). The BRD hand-off is a second request, and closing an item "through the step 8 mechanics" adds it to "this update's Changes Log row", so a literal run bumps the BRD again (1.1 to 1.2) for content the review already changed. The SDD hand-off, for the same situation, bumps nothing. The two owners version the same hand-off differently, and nothing in the BRD row says which way.
- Options: A (recommended): the BRD does what the SDD does; closing items a review already applied is no new content change. B: the hand-off is its own content change in both skills (a second bump each time), and the SDD row changes to match.
- Fix for A: `brd-unifier/SKILL.md`, current: `Decisions a business review already applied are checked, not applied again, and the open items they answer are closed through the step 8 mechanics.` new: `Decisions a business review already applied are checked, not applied again, and the open items they answer are closed through the step 8 mechanics, with no new Changes Log entry: the review's row already holds the change, and this request bumps the version only if it changes chunks 00-13 itself (delivery-chunks.md § Refresh triggers, Version).`

### B-6. brd-unifier's hand-off row has no step for the changed pre-BRD chunks the reviewer's hand-off names

- Where: `business-reviewer-unifier/apply-and-verify.md:195-198` (Hand-off item 1); `brd-unifier/SKILL.md:306`.
- Quote: reviewer: "When the review changed a pre-BRD, a BRD in scope that was made from it gets this row too, naming the pre-BRD chunks that changed, even if the BRD itself did not change. pre-brd-unifier has no update request of its own, so this is the pre-BRD's only hand-off."
- Why: the "update the todo" row applies decisions, reruns the consistency check, closes and raises items, and marks 15-17; it never says what to do with named pre-BRD chunks. The BRD takes personas, scope, priorities, and the verdict word from the pre-BRD and only links its figures (`brd-unifier/sow-transformation.md:171`), so a run cannot tell whether a changed pre-BRD chunk needs a BRD edit, and the consistency check (chunks 00-13) does not read the pre-BRD.
- Fix (mechanical): `brd-unifier/SKILL.md`, add after the sentence ending `are closed through the step 8 mechanics.` (or after B-5's version of it): `When the hand-off names pre-BRD chunks the review changed, recheck the BRD text taken from them (sow-transformation.md § pre-BRD (pre-brd-unifier output) to BRD): a changed persona, scope item, priority, or verdict word changes the BRD chunk that holds it; a linked figure needs no edit.`

### B-7. A pre-BRD point's open remainder has no record that any hand-off reads (W-4) - needs the user's decision

- Where: `business-reviewer-unifier/apply-and-verify.md:23-24` (rule 3), `:78-81` (rule 6), `:199-201` (Hand-off item 1); `brd-unifier/SKILL.md:306`.
- Quote: rule 3: "A pre-BRD has no decision log: its story stays in the tracker."; rule 6: "the decision record states it as its open remainder, and the hand-off asks the owner to raise it as an open item."; item 1: "raises an open item for each open remainder their decision records state."; BRD: "When the review's decision records (the Business review register of `decision-log.md`) state an open remainder, this request raises an open item for each".
- Why: W-4 covered the BRD and SDD rows only. For a point decided on the pre-BRD, there is no decision record, and the BRD hand-off reads only the BRD's own Business review register, so the question the decision leaves open is never raised anywhere.
- Options: A (recommended): the tracker's Decision cell states the remainder, and the BRD hand-off raises it as an open item of the BRD made from that pre-BRD, naming the pre-BRD chunk. B: the review adds it to the pre-BRD's chunk 24 Open Items log (a write the pre-BRD rule "Answer cells only" does not allow today). C: such a point is Deferred, with the owner named.
- Fix for A:
  - `apply-and-verify.md`, current:
    ```text
       record states it as its open remainder, and the hand-off asks the owner
       to raise it as an open item.
    ```
    new:
    ```text
       record states it as its open remainder, and the hand-off asks the owner
       to raise it as an open item. For a pre-BRD, which has no decision log,
       the tracker's Decision cell states it, and the BRD hand-off (item 1)
       raises it in the BRD made from that pre-BRD.
    ```
  - `apply-and-verify.md` (Hand-off item 1), current:
    ```text
         items they answer, and raises an open item for each open remainder
         their decision records state.
    ```
    new:
    ```text
         items they answer, and raises an open item for each open remainder
         their decision records state (for a pre-BRD point, its Decision
         cell).
    ```
  - `brd-unifier/SKILL.md`, current:
    ```text
    (the Business review register of `decision-log.md`)
    ```
    new:
    ```text
    (the Business review register of `decision-log.md`, or the tracker's Decision cell for a point on the pre-BRD)
    ```

### B-8. LLD chunk 18 has no `Superseded by` or `Reopened by` outcome, so an LLD run cannot handle an overturned item (F3)

- Where: `lld-unifier/sdd-to-lld.md:202`; `lld-unifier/chunks/18-open-items-and-clarifications.md:77`; `lld-unifier/TEMPLATE-COMBINED.md:673`.
- Quote: "An `Open` or `Deferred` item it answers becomes `Resolved`, with a Resolution Log row `Settled by SDD v[X.X]` ... An item it answers in part stays `Open`, and its Resolution Log row names the settled part."; Outcome cell: "[Option chosen - short note, or Settled by SDD v[X.X] (or [KEY] v[X.X]) - short note]".
- Why: F3 as accepted covers both skills: "a closed item whose design the change overturns keeps its status with `Superseded by ...`, or reopens when the change leaves a choice open". The SDD has it (`sdd-unifier/brd-to-sdd.md:71`, chunk 18 Outcome "Settled by [source] | Superseded by [source] | Reopened by [source]"); the LLD has only the settling half (families.md listed only that half). A `Resolved` LLD item whose design a new SDD version overturns (the C1 case: OI-09, OI-10, part of OI-14) has no rule, so the delta review neither reopens nor annotates it.
- Fix (mechanical, the accepted F3 text):
  - `lld-unifier/sdd-to-lld.md`, current:
    ```text
    An item it answers in part stays `Open`, and its Resolution Log row names the settled part.
    ```
    new:
    ```text
    An item it answers in part stays `Open`, and its Resolution Log row names the settled part. A `Resolved` item whose design the change overturns keeps `Resolved` when the change decides the new design, with a Resolution Log row `Superseded by SDD v[X.X]`; when the change leaves a choice open, it goes back to `Open`, with a row `Reopened by SDD v[X.X]`.
    ```
  - `lld-unifier/chunks/18-open-items-and-clarifications.md` and `lld-unifier/TEMPLATE-COMBINED.md`, current: `Option chosen - short note, or Settled by SDD v[X.X] (or [KEY] v[X.X]) - short note` new: `Option chosen - short note, or Settled by, Superseded by, or Reopened by SDD v[X.X] (or [KEY] v[X.X]) - short note`

### B-9. brd-unifier's hand-off does not say how it records the items and markers a review settled; sdd-unifier does (F3)

- Where: `brd-unifier/SKILL.md:306`; `brd-unifier/chunks/13-open-items-and-clarifications.md:80`; `brd-unifier/TEMPLATE-COMBINED.md:449`; against `sdd-unifier/SKILL.md:353` and `sdd-unifier/brd-to-sdd.md:71`.
- Quote: BRD: "the open items they answer are closed through the step 8 mechanics."; Outcome cell: "[Accepted recommendation / Adjusted: short note / Deferred / Rejected]"; BRD Marker register (`brd-unifier/decision-log.md:50`): "One entry per inline clarification marker settled after it was written, whoever settled it: ... or a business review point."; SDD: items close with a Resolution Log row whose source "is the review point, linked to the review's tracker", and markers get "§ Marker register" records.
- Why: the same review hand-off is recorded two ways. In the BRD, the step 8 Outcome values ("Accepted recommendation", "Adjusted") read as if the user took the item's recommendation, so chunk 13 hides that a review settled it; and no rule writes the Marker register entry the BRD template asks for when a review point settles a marker.
- Fix (mechanical, the SDD's F3 form):
  - `brd-unifier/SKILL.md`, after the sentence ending `are closed through the step 8 mechanics.` add: `Each gets a Resolution Log row "Settled by business review [point ID]", and each clarification marker a review decision removed gets a Marker register entry naming the point (decision-log.md).`
  - `chunks/13-open-items-and-clarifications.md` and `TEMPLATE-COMBINED.md`, current: `[Accepted recommendation / Adjusted: short note / Deferred / Rejected]` new: `[Accepted recommendation / Adjusted: short note / Deferred / Rejected / Settled by business review [point ID]]`
  - B-5, B-6, and B-9 all add to the same sentence of the "update the todo" row: apply them together.

## C. Cosmetic

### C-1. The reviewer's hand-off summary leaves out the delta reviews the owners now run (F2)

- Where: `business-reviewer-unifier/apply-and-verify.md:186-188`.
- Quote: "- the BRD's consistency check and delivery gate; - the SDD's contract registries, §7.3, lineage, and e2e gate; - each LLD's refresh."
- Why: after F2 both owner rows end with a delta review (`sdd-unifier/SKILL.md:353` "Then run the delta review of step 7 (On an update)"; `lld-unifier/sdd-to-lld.md:204` "The update ends with the delta review"). The list says what the owners re-check, so it now understates the hand-off (and its time).
- Fix (mechanical): current:
  ```text
  - the SDD's contract registries, §7.3, lineage, and e2e gate;
  - each LLD's refresh.
  ```
  new:
  ```text
  - the SDD's contract registries, §7.3, lineage, and e2e gate, and a
    delta review of the changed chunks;
  - each LLD's refresh, which ends with a delta review.
  ```

### C-2. The reviewer's README workflow step 3 omits the findings file and the left-out counts (K4, K6)

- Where: `business-reviewer-unifier/README.md:59`.
- Quote: "3. **Merge and tracker.** Duplicates across personas are merged under one ID, findings get `<ROLE>-NN` IDs, and `review-comments-tracker.md` is written per `tracker-schema.md`."
- Why: SKILL.md step 3 and the README's own Outputs list now name `review-panel-findings.md` and the left-out counts; the workflow step does not.
- Fix (mechanical): current (unique):
  ```text
  and `review-comments-tracker.md` is written per `tracker-schema.md`.
  ```
  new:
  ```text
  and `review-comments-tracker.md` and its companion `review-panel-findings.md` are written per `tracker-schema.md`; the merge report also shows how many findings each reviewer left out.
  ```

### C-3. Hand-off items 1 and 2 still say the owner sets the Stale marks the review already set (F4)

- Where: `business-reviewer-unifier/apply-and-verify.md:204` and `:218`.
- Quote: "- It marks chunks 15-17 Stale if they exist." and "It marks chunk 19 Stale where its rules say so."
- Why: since F4, Apply rule 7 sets the Stale mark at apply time. The hand-off lines read as if the mark waits for the owner. Harmless (the owner marks again), but it blurs who sets the mark.
- Fix (mechanical):
  - current: `   - It marks chunks 15-17 Stale if they exist.` new: `   - It keeps chunks 15-17 that exist Stale in all three places (the review set the mark, Apply rule 7) until their gate is open again.`
  - current: `   marks chunk 19 Stale where its rules say so.` new: `   keeps chunk 19's Stale mark (Apply rule 7) and sets it for its own changes where its rules say so.`

### C-4. Verify sends gated-chunk remnants "to the hand-off", which § Hand-off says is not a row

- Where: `business-reviewer-unifier/apply-and-verify.md:155-156` against `:225-226`.
- Quote: "apply, except lineage rows, the owner's open items, and gated chunks: those go to the hand-off (Apply rule 6)."; "Gated chunks (BRD 15-17, SDD 19) refresh through their owners once their gates are open again. They are a note in the close-out, not a hand-off row."
- Why: loose wording left by F4 (families.md flagged it as loose, not contradictory). A run could write a Hand-offs row for a gated chunk.
- Fix (mechanical): current:
  ```text
  apply, except lineage rows, the owner's open items, and gated chunks: those
  go to the hand-off (Apply rule 6). A remnant of the same kind found while
  ```
  new:
  ```text
  apply, except lineage rows and the owner's open items, which go to the
  hand-off (Apply rule 6), and gated chunks, which keep their Stale mark and
  a note in the close-out (Apply rule 7). A remnant of the same kind found while
  ```

### C-5. The workbook's IFAS guidance still says "weak=0" and "externally" (P3 fixed only EFAS)

- Where: workbook `IFAS ` (trailing space)!E11 (shared string 504, used only there) and !B11 (shared string 400, shared with `EFAS`!B12).
- Quote: E11 "Rate internal performance on this factor (weak=0, Strong=5)"; B11 "Identify all factors that might effect the product externally".
- Why: chunk 11 rates IFAS "from 1 (poor / weak) to 5 (strong)" and the sheet's own header says "Rating (1=Poor to 5=Strong)"; IFAS factors are internal. These READ-ONLY sample cells reach every export. Step 6 fixed the matching EFAS cell E12 ("week=0") but not this one.
- Fix (mechanical, surgical shared-string edit as in A-4): string 504 becomes `Rate internal performance on this factor (1=Poor, 5=Strong)`. For B11, append a new shared string `Identify all factors that might affect the product internally`, point `xl/worksheets/sheet12.xml` B11 at it, and raise the `count` and `uniqueCount` attributes; optionally correct string 400 (EFAS!B12) to `Identify all factors that might affect the product externally`.

### C-6. The workbook's Strategic Fit label still says "blended" (P2)

- Where: workbook `Executive Summary`!C21; `pre-brd-unifier/chunks/22-executive-summary-scoreboard.md:42`.
- Quote: C21 `="EFAS "&TEXT(SUM(EFAS!F2:F6),"0.0")&" + IFAS "&TEXT(SUM('IFAS '!F2:F5),"0.0")&" blended"`; chunk 22: "EFAS and IFAS totals, averaged (VRIO context)".
- Why: P2 renamed the Markdown source signal to "averaged" (D21 computes the average); the Excel label kept "blended". C18 was renamed the same way ("EFAS opportunity rating"), C21 was not.
- Fix (mechanical): in `xl/worksheets/sheet23.xml`, cell C21: in `<f>`, `&amp;" blended"` becomes `&amp;", averaged"`; the cached `<v>EFAS 3.6 + IFAS 3.2 blended</v>` becomes `<v>EFAS 3.6 + IFAS 3.2, averaged</v>` (step 6 updated C18's cached value the same way). "blended" occurs only in this cell.

### C-7. Market Comparison: the New features block keeps its placeholder headers, and two texts still call the blocks blank (N-2)

- Where: workbook `Market Comparison`!M49:Q49; `pre-brd-unifier/reference/cell-map.json`; `pre-brd-unifier/frameworks.md:42`; `pre-brd-unifier/xlsx-export.md:57`.
- Quote: M49:Q49 "Product_01_PlaceHolder" to "Product_05_PlaceHolder"; frameworks.md "**Market Comparison (06) is fixed-cell** (blank answer blocks with set capacity)"; xlsx-export.md "(the four answer blocks ship blank with set row capacity)".
- Why: N-2 whitelisted the competitor headers of the Core (M21:Q21) and Advanced (M35:Q35) blocks, so the export fills or blanks them; the New features block (rows 49 to 61) keeps "Product_0N_PlaceHolder" in every export, and chunk 06 § 4 has no competitor columns to fill it. The header cells M21:Q21 and M35:Q35 now ship with placeholder text, so "blank" is no longer true.
- Fix (mechanical):
  - `cell-map.json`, Market Comparison `answer_cells`: add `M49`, `N49`, `O49`, `P49`, `Q49`, so the clear step blanks them (no formula there, so `test_cell_map.py` still passes).
  - `xlsx-export.md`, current: `(the four answer blocks ship blank with set row capacity)` new: `(the four answer blocks have set row capacity; the competitor header cells ship with placeholders that the export replaces or blanks, and M49:Q49 stay blank because chunk 06 § 4 has no competitor columns)`
  - `frameworks.md`, current: `(blank answer blocks with set capacity)` new: `(answer blocks with set capacity)`

### C-8. brd-unifier step 8.3 does not list "who decided", which its decision-log template and sdd-unifier's step 8.3 do (F3)

- Where: `brd-unifier/SKILL.md:236`; against `sdd-unifier/SKILL.md:292` and `brd-unifier/decision-log.md:44`.
- Quote: BRD: "the question, its options, the chosen answer, the date, and the rationale (the Why), under the clarification register"; SDD: "the question, its options, the chosen answer, who decided, the date, and the rationale".
- Why: F3 widened "who decided" in both templates (a source version or a review point can decide); the BRD step that writes the record does not ask for it.
- Fix (mechanical): `brd-unifier/SKILL.md`, current: `the question, its options, the chosen answer, the date, and the rationale (the Why), under the clarification register` new: `the question, its options, the chosen answer, who decided, the date, and the rationale (the Why), under the clarification register`

### C-9. sdd-unifier's review row starts from "the review's Changes Log row", which does not exist when the review changed only the BRDs (N-5)

- Where: `sdd-unifier/SKILL.md:353`, reached from `:352` and `sdd-unifier/brd-to-sdd.md:69`.
- Quote: "Read the review's Changes Log row and its `review-comments-tracker.md`." and "Then run the delta review of step 7 (On an update) on the chunks the review's Changes Log row lists after `Chunks:`, and any this run changed."
- Why: after N-5, "BRD <KEY> has a new version, after the business review" runs the review row's steps too, also when the review changed only BRDs and wrote no row in this SDD. A run can skip the missing row, but the text assumes one.
- Fix (mechanical): current: `Read the review's Changes Log row and its` new: `Read the review's Changes Log row in this SDD (when the review changed it) and its`

### C-10. The reviewer's Apply rule 3 lists the record's fields without the `Rule home:` link both owners require (F3)

- Where: `business-reviewer-unifier/apply-and-verify.md:19-20`; against `brd-unifier/decision-log.md:12` and `:66`, `sdd-unifier/decision-log.md:12` and `:90`.
- Quote: "the point ID, the tracker, what was decided, and what it replaced."; owners: "Every register entry that settled a rule carries a `Rule home:` link to the chunk section that now states the rule. The anchor must work." and the Business review register's "**Rule home:** `[[Section name]](./NN-chunk.md#anchor)`".
- Why: a record written from Apply rule 3 alone has no Rule home, which the owners' templates and companion-file rules require.
- Fix (mechanical): current:
  ```text
     skill says): the point ID, the tracker, what was decided, and what it
     replaced. A record that replaces an earlier one says so, and the
  ```
  new:
  ```text
     skill says): the point ID, the tracker, what was decided, what it
     replaced, and a `Rule home:` link to the section that now states it. A
     record that replaces an earlier one says so, and the
  ```

### C-11. The reviewer's example of an SDD ID, `CL-NN`, is an ID no skill defines (A7)

- Where: `business-reviewer-unifier/apply-and-verify.md:54`.
- Quote: "chunks never cite SDD IDs (such as `API-NN` or `CL-NN`) or the SDD's design values".
- Why: sdd-unifier's IDs are `API-NN`, `OI-NN`, `ADR-NN`, `AP-NN`, `INT-NN`, and `R-NN` (`sdd-unifier/SKILL.md:381`). `CL-NN` was the step 4 run's own label for marker decisions (T1); F3 replaced that need with the Marker register, whose entries have no ID. A reader may take `CL-NN` for a real SDD scheme.
- Fix (mechanical): current: ``(such as `API-NN` or `CL-NN`)`` new: ``(such as `API-NN` or `ADR-NN`)``

## README statements now wrong

Root `README.md`, read as it stands (not edited). Each row: the line, the current text, the decision that made it wrong, and the replacement. R-4 and R-13 fill gaps the step 6 plan names (the version rule, Known gaps) rather than fix a false sentence.

### R-1. Line 38, the Review row of the chain table (K6)

- Current:
  ```text
  | Review | `business-reviewer-unifier` | Does the document chain hold up? | The documents to challenge | `review-comments-tracker.md` in the project root | On every review point, one at a time |
  ```
- Why: the panel now also writes `review-panel-findings.md`, the write-once file of raw findings.
- New:
  ```text
  | Review | `business-reviewer-unifier` | Does the document chain hold up? | The documents to challenge | `review-comments-tracker.md` and `review-panel-findings.md` in the project root | On every review point, one at a time |
  ```

### R-2. Line 451, the `panel` phase row (K6)

- Current: "| `panel` | Dispatches the reviewer personas and builds `review-comments-tracker.md` in the project root. |"
- New: "| `panel` | Dispatches the reviewer personas and builds `review-comments-tracker.md` in the project root, with `review-panel-findings.md` (every raw finding, with its Why and Direction) next to it. |"

### R-3. Line 54, Cleared-context review (F2)

- Current (ends): "The BRD and SDD then walk you through every item (accept, choose another option, or defer) and apply only what you accept; the pre-BRD and LLD leave the items for you and your team to decide."
- Why: the line implies the review runs only on a full generation; F2 added the update reviews and the chunk 19 check.
- New (append to the bullet): "The full review runs once, on the first build. A later SDD or LLD update that changes content gets a delta review of the chunks it changed; for a BRD update, the consistency check is that review. Every write of SDD chunk 19 also gets a cleared-context faithfulness check against its source chunks."

### R-4. Shared conventions: no version rule (F1)

- Current: none. The only version statements are "bumps each changed document's version once" (lines 199 and 456).
- New bullet, after the `decision-log.md` bullet (line 55): "- **One update, one version** (BRD, SDD, LLD). An update is one request, up to its handoff; the first build is one update, at 1.0. Its first content change bumps the version one minor step and opens one Changes Log row, which ends with `Chunks:` and the chunks whose content changed. The master and chunk 00 carry the current version; every other chunk keeps the version its content last changed in, and a gated chunk (BRD 15-17, SDD 19) the version it was written at. Status lines, Stale marks, links, and the Child LLDs rows bump nothing."

### R-5. Lines 196 and 197, the LLD and BRD refresh lines (L3, F1, F2, F3, F4)

- Current 196: "- **A new SDD version:** on its next run, the LLD compares the SDD version it recorded (16 §19.1) with the current one, lists the SDD changes since then, and offers a targeted refresh of the LLD chunks they affect. It never refreshes silently."
- Current 197: "- **A new BRD version:** tell `sdd-unifier` "BRD `KEY` has a new version". It updates the lineage, derives the delta, reconciles contracts again, and marks chunk 19 `Stale`. Then tell `lld-unifier` "the SDD has a new version", and also "refresh the trace" when the BRD's use cases, test cases, or screens changed."
- Why: L3 gives one offer for an SDD and a BRD change together; step 3c reads the `Chunks:` lists; both owners now settle items and run a delta review; chunk 19 goes Stale only if it exists.
- New 196: "- **A new SDD or BRD version:** on its next run, the LLD compares the SDD and BRD versions it recorded (16 §19.1) with the current ones, reads the `Chunks:` list of each SDD Changes Log row since then, and makes one offer: the LLD chunks those SDD chunks map to, plus the trace a BRD change needs. The refresh is one update with one version; it closes the LLD open items the change settles and ends with a delta review. It never refreshes silently."
- New 197: "- **A new BRD version:** tell `sdd-unifier` "BRD `KEY` has a new version". It updates the lineage, derives the delta, reconciles contracts again, settles or supersedes the open items and markers the new version answers, runs a delta review, and marks chunk 19 `Stale` if it exists. Then tell `lld-unifier` "the SDD has a new version": its one offer also covers the trace when the BRD's use cases, test cases, or screens changed."

### R-6. Line 199, After a business review (F4, N-5, W-4, L3)

- Current: "- **After a business review:** `business-reviewer-unifier` changes content only, inside each BRD's and SDD's template structure, never edits an LLD or a gated chunk, and bumps each changed document's version once. Its close lists the hand-offs in chain order: `brd-unifier` "update the todo" for each changed BRD, then `sdd-unifier` "BRD `KEY` has a new version" naming the changed BRDs (or "the business review changed this SDD" when no BRD changed), then `lld-unifier` "the SDD has a new version" for each child LLD, plus "refresh the trace" when a BRD's use cases, test cases, or screens changed."
- Why: the review now sets a gated chunk's Stale mark (F4); the SDD request names the tracker (N-5); the owners raise the open remainders (W-4); the LLD gets one request (L3).
- New: "- **After a business review:** `business-reviewer-unifier` changes content only, inside each BRD's and SDD's template structure, never edits an LLD or a gated chunk's content (it only sets a gated chunk's `Stale` mark), and bumps each changed document's version once. Its close lists the hand-offs in chain order: `brd-unifier` "update the todo" for each changed BRD, then `sdd-unifier` "BRD `KEY` has a new version, after the business review of [date] ([tracker])" naming the changed BRDs (or "the business review changed this SDD" when no BRD changed), then `lld-unifier` "the SDD has a new version" for each child LLD. Each owner closes the open items the review's decisions answer and raises one for each open question a decision left to it."

### R-7. Lines 215 and 216, the pre-BRD tier rows (pre-brd N-1)

- Current: "| 13-14 | 3. Prioritization | RICE, MoSCoW |" and "| 15-21 | 4. Strategy and planning | OKRs, BCG Matrix, Ansoff Matrix, VRIO, Product Strategy Canvas, Product Lifecycle, Roadmap and Project Plan |"
- Why: OKRs are Tier 3 (chunk 15's TIER line, the master's Tier 3 table, the workbook index); `pre-brd-unifier/README.md` was fixed in step 6, the root README was not.
- New: "| 13-15 | 3. Prioritization | RICE, MoSCoW, OKRs |" and "| 16-21 | 4. Strategy and planning | BCG Matrix, Ansoff Matrix, VRIO, Product Strategy Canvas, Product Lifecycle, Roadmap and Project Plan |"

### R-8. Line 425, the LLD "It asks you" row (L2-10h, L3)

- Current: "| It asks you | The output shape if not given; the direction (always, with a suggested default); at most three intake questions; the Project Type when the SDD lacks it; a missing version pin; roadmap phases when the SDD has no natural breaks; on an existing LLD whose SDD has moved on, whether to refresh the affected chunks (it lists the SDD changes first). |"
- Why: L2-10h: a missing pin is never asked in the LLD; L3: one offer covers SDD and BRD changes.
- New: "| It asks you | The output shape if not given; the direction (always, with a suggested default); at most three intake questions; the Project Type when the SDD lacks it; roadmap phases when the SDD has no natural breaks; on an existing LLD whose SDD or source BRDs have moved on, one offer to refresh what they changed (it lists the changed chunks first). A missing version pin is never asked: it is flagged in §6.3 and routed to SDD §6 through `sdd-unifier`. |"

### R-9. Line 162, SDD 10 §14 to LLD (E4, D6)

- Current (last cell): "Names match character for character; payloads are referenced, not copied; in-process events get no topic, outbox, or DLQ"
- Why: an in-process event under a durable §14.10 Delivery line now uses the outbox as its publication log (`lld-unifier/SKILL.md:202`, `sdd-to-lld.md:316`).
- New (last cell): "Names match character for character; payloads are referenced, not copied; in-process events get no topic or DLQ, and use the outbox only when the §14.10 Delivery line is durable"

### R-10. Line 434, LLD key behaviors (E4, D6)

- Current: "- Reads a modular-monolith SDD too: each module gets its own `04-implementation/` file, in-process port contracts go to 06 §9.6 and in-process domain events to 07 §10.6, with no HTTP, broker, outbox, or retry settings for them."
- New: "- Reads a modular-monolith SDD too: each module gets its own `04-implementation/` file, in-process port contracts go to 06 §9.6 and in-process domain events to 07 §10.6, with no HTTP, broker, or retry settings for them; an in-process event uses the outbox only when the SDD's §14.10 Delivery line is durable."

### R-11. Line 337, SDD chunk 19 row (W7, F2)

- Current: "| 19 | `19-e2e-system-design.md` | §24 | End-to-end view consolidated from 09-13x: landscape, fan-out maps, sync edges, sagas | Gated (E1-E4) |"
- Why: W7 widened chunk 19's sources to 02-13x (`sdd-unifier/chunking.md:52`), and every write gets a faithfulness check.
- New: "| 19 | `19-e2e-system-design.md` | §24 | End-to-end view consolidated from 02-13x and checked against them on every write: landscape, fan-out maps, sync edges, sagas | Gated (E1-E4) |"

### R-12. Line 176, BRD 14 to LLD (L2-10b)

- Current (first cell): "14 Mockup coverage (`MK-NN`, one row per screen or flow, with its use cases); a screen ID instead where the BRD text defines one"
- Why: the chunk 14 row now wins; a screen ID is the target only when no row exists (`lld-unifier/sdd-to-lld.md:80-84`).
- New (first cell): "14 Mockup coverage (`MK-NN`, one row per screen or flow, with its use cases; the row wins over a screen ID); a screen ID only where the BRD text defines one and chunk 14 has no row for it"

### R-13. Line 541, Known gaps

- Current: "- The newest paths have not been run on a sample project yet: the LLD's modular-monolith path, the BRD merge and re-chunk heading map, SDD version tracking, and the pre-BRD to BRD mapping."
- Why: step 3 ran those four paths (UNIFIER-ENHANCEMENTS.md line 59: "All four paths pass"), and step 6 added paths no run has used yet. Revise again after the chain rerun (stage R).
- New: "- Not yet run on a sample project: one update, one version with `Chunks:` lists; the SDD and LLD delta reviews and the SDD chunk 19 faithfulness check; the SDD marker walk; open items an upstream change settles or supersedes; the business review hand-offs that name the tracker; the pre-BRD scoreboard shared by the Markdown and the Excel."

### Also incomplete (optional, not false)

- Line 338, SDD `decision-log.md` row: "Ecosystem and questionnaire records, clarification history (companion file)": add "the Marker register and the Business review register". Line 270, BRD row: the same two registers.
- Line 361, SDD "It asks you": add "an optional walk through the markers that keep the e2e gate shut; once, whether to derive from a source BRD that is not Approved".
- Line 233, Excel export: add "its scoreboard uses the same signal mapping as chunk 22".


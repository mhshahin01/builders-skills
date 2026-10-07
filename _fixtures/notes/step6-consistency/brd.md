# Step 6 consistency check: brd-unifier

## Summary

Counts: A 7, B 13, C 8 (28 items). Mechanical: 26. Needs the user's decision: 2.

Needs the user's decision:
- A-2: `Needed before` "a task" can never name a `TASK-NN` when it matters; recommended value "Build of UC-NN" (alternative: a fixed milestone such as "Build start"), plus one chunk 15 line and the sdd-unifier mapping row.
- B-7: chunk 16's Exit criteria require go-live dependencies in place at BAT sign-off; recommended: in place only for BAT sign-off, go-live ones listed with their owner.

Queued items:
- (a) confirmed (A-1): `decision-log.md:8` names only a clarification decided in step 8, so a business review point cannot create the log (and a part-checkpoint decision is not named either); `parts-mode.md:89` still says "raised or decided".
- (b) confirmed and wider (A-2): not only before chunk 15 exists. The cell is confirmed while the gate is shut, before any task exists, and writing a `TASK-NN` into chunk 02 later is a content change that marks 15-17 `Stale`.

Cross-skill fixes proposed (another folder's file): A-2 (`sdd-unifier/brd-to-sdd.md`), A-6 (`business-reviewer-unifier/apply-and-verify.md`), A-7 (`lld-unifier/SKILL.md`, `lld-unifier/chunks/16-references.md`, `lld-unifier/TEMPLATE-COMBINED.md`).

Checked and consistent: every step 6 decision for brd-unifier (F1 to F4, R1, A1/G2, A5, G5/S5/X4, G10, W-10, W-4, D12.2) is implemented with the recommended option and, where the triage gave wording, that wording (one reading differs: B-7, W-10's "listed" became "in place"; the other items are gaps or side effects around the decisions); the template copies agree (`chunks/*.md` against `TEMPLATE-COMBINED.md`) except the Table of Contents (B-10); every `file.md` § reference and internal § reference in the changed text resolves; no em or en dash was added; each changed file keeps one line-ending style. Interfaces: sdd-unifier reads the `Needed before` column under that name and its three values, the cover Status, the master's State column and the combined status lines as brd-unifier writes them; lld-unifier reads the master's State cell (now kept in three places), the `MK-NN` rows, the `#mockup-coverage` anchor, and chunk 16's headings and `Related UC`, but cannot detect a chunk 14 change (A-7); business-reviewer-unifier Apply rules 3, 6, 7 and hand-off item 1 match the BRD's registers, Stale places, and "update the todo" row, except A-1, A-6, B-1, B-2, and B-3.

Conventions: line numbers are those of the working tree on 2026-10-04 (branch `fix/unifier-fix-round`, step 6 uncommitted). Every "Current" text below was checked to occur exactly once in its file. Fixes marked "cross-skill" edit a file outside `brd-unifier/`.

## A (wrong or contradictory)

### A-1. The decision log is created only by a clarification decided in step 8 (queued item a: confirmed)

- Where: `brd-unifier/decision-log.md:8` "Created on first use: when the first clarification is decided (SKILL.md step 8)."; `brd-unifier/SKILL.md:342` "Created on first use (the first decided clarification)"; `brd-unifier/chunks/brd-master.md:115` "it is created on the first decided clarification."; `brd-unifier/parts-mode.md:89` "Clarifications raised or decided in this part are recorded in `decision-log.md`".
- Why: the same file's new Business review register (`decision-log.md:60`) says its record is "written when the review applies the point", and `business-reviewer-unifier/apply-and-verify.md:15-19` (Apply rule 3) writes that record "(the log is created on first use, as that skill says)". For a BRD with no log yet (REFUNDS in step 5), line 8 names only step 8, so the reviewer finds no rule that lets it create the file and has nowhere to put the record. Line 8 also leaves out a writer the skill already has: decisions at a part checkpoint (exit checklists `parts-mode.md:81` and `:89`; the Marker register's "at a part checkpoint", `decision-log.md:50`), which come before step 8. Separately, `parts-mode.md:89` still says "raised or decided", the wording A14 removed from line 8 because open items stay out of the register (`decision-log.md:14`).
- Fix (mechanical), four edits:
  1. `brd-unifier/decision-log.md`. Current:
     ```text
     - Created on first use: when the first clarification is decided (SKILL.md step 8). Do not write an empty register.
     ```
     New:
     ```text
     - Created on first use, with its first record: a clarification or marker decided at a part checkpoint, in the acceptance loop (SKILL.md step 8), or in a later request, or a business review point applied to this BRD. Do not write an empty register.
     ```
  2. `brd-unifier/SKILL.md`. Current:
     ```text
     Created on first use (the first decided clarification), linked
     ```
     New:
     ```text
     Created on first use (its first record: a decision, or a business review point), linked
     ```
  3. `brd-unifier/chunks/brd-master.md`. Current:
     ```text
     it is created on the first decided clarification.
     ```
     New:
     ```text
     it is created with its first record (a decision, or a business review point).
     ```
  4. `brd-unifier/parts-mode.md`. Current:
     ```text
     Clarifications raised or decided in this part are recorded in `decision-log.md`
     ```
     New:
     ```text
     Clarifications decided in this part are recorded in `decision-log.md`
     ```

### A-2. A `Needed before` value of "a task" cannot be filled or confirmed (queued item b: confirmed, and wider than queued)

- Where: `brd-unifier/chunks/02-glossary-assumptions-facts.md:60` and `brd-unifier/TEMPLATE-COMBINED.md:125` "[A task / BAT sign-off / Go-live]"; `brd-unifier/delivery-chunks.md:38` "(its `Needed before` cell in chunk 02: a task, BAT sign-off, or go-live)"; `brd-unifier/sow-transformation.md:52`; cross-skill `sdd-unifier/brd-to-sdd.md:236`.
- Why: chunk 02 is body (00-13), written in part 1. `TASK-NN` IDs exist only in chunk 15, which is written after the gate opens, and the gate opens only after every dependency's to-do row is `Resolved` (G1). `delivery-chunks.md:38` resolves a pending dependency when the product manager "confirms its owner and when it is needed", so at that moment no task can be named: not only before chunk 15 exists, but always when it matters. Writing a `TASK-NN` into chunk 02 afterwards is a content change to 00-13: it bumps the version and marks 15-17 `Stale` (Re-lock), so the plan makes itself stale, and the body would cite a derived chunk (ground rule 1, `delivery-chunks.md:72`, has delivery chunks cite the body, never the reverse; the to-do's `Blocks` column adds `TASK-NN` "only once 15-17 exist", `:155`). Nothing in § Chunk 15 shows such a dependency on a task either.
- Fix (needs the user's decision; recommended: name the use case whose delivery needs the dependency, which chunk 15 maps to its task; alternative: a fixed milestone such as "Build start", which loses which use case waits):
  1. `brd-unifier/chunks/02-glossary-assumptions-facts.md` and `brd-unifier/TEMPLATE-COMBINED.md` (same edit). Current:
     ```text
     [A task / BAT sign-off / Go-live]
     ```
     New:
     ```text
     [Build of UC-NN / BAT sign-off / Go-live]
     ```
  2. `brd-unifier/delivery-chunks.md`. Current:
     ```text
     (its `Needed before` cell in chunk 02: a task, BAT sign-off, or go-live)
     ```
     New:
     ```text
     (its `Needed before` cell in chunk 02: the build of a use case, `Build of UC-NN`, BAT sign-off, or go-live; the body never names a `TASK-NN`)
     ```
  3. `brd-unifier/sow-transformation.md`. Current:
     ```text
     Fill `Needed before` (a task, BAT sign-off, or go-live) as the source states it
     ```
     New:
     ```text
     Fill `Needed before` (the build of a use case, BAT sign-off, or go-live) as the source states it
     ```
  4. `brd-unifier/delivery-chunks.md` (the plan side, end of the "Every task carries" paragraph). Current:
     ```text
     assumptions, open questions, and blockers.
     ```
     New:
     ```text
     assumptions, open questions, and blockers. A chunk 02 dependency whose `Needed before` names a use case is listed under the blockers of the task that delivers that use case (`02 / Dependency "[name]"`) until it is in place.
     ```
  5. Cross-skill, `sdd-unifier/brd-to-sdd.md`. Current:
     ```text
     Its `Needed before` cell (a task, BAT sign-off, or go-live) says when it must be in place.
     ```
     New:
     ```text
     Its `Needed before` cell (the build of a use case, BAT sign-off, or go-live) says when it must be in place.
     ```

### A-3. A shut gate turns an existing chunk's `Provisional (TD-NN)` into `Stale`

- Where: `brd-unifier/delivery-chunks.md:43` "Set the state of each of them to `Locked`, or `Stale` if it exists, in the three places of Re-lock"; `brd-unifier/SKILL.md:272` (8c.2) "set the state of each of 15-17 (`Locked`, or `Stale` if it exists)"; `brd-unifier/delivery-chunks.md:478` "their state reads `Locked` (or `Stale`) in all three places".
- Why: "`Provisional` or `Stale`?" (`delivery-chunks.md:55`) gives `Provisional (TD-NN)` to a chunk whose own writing raised the item, and § Refresh triggers (`:433`) says such an item makes nothing `Stale`. A TD raised while writing 15 shuts the gate (`:50`, `:256`), so the next request ("write the test cases") reaches 8c.2, which sets every existing chunk to `Stale`: a literal run turns chunk 15's `Provisional (TD-12)` into `Stale` in all three places although nothing happened after it was written, and the verification line then requires that value. Before step 6 only 8c.2 said this; F4 copied it into the shut-gate list and the verification line.
- Fix (mechanical), three edits:
  1. `brd-unifier/delivery-chunks.md`. Current:
     ```text
     2. Set the state of each of them to `Locked`, or `Stale` if it exists, in the three places of Re-lock (below).
     ```
     New:
     ```text
     2. Set the state of each of them in the three places of Re-lock (below): `Locked` if it does not exist; an existing one keeps its state unless Re-lock makes it `Stale`, so a chunk whose own new item shut the gate stays `Provisional (TD-NN)`.
     ```
  2. `brd-unifier/SKILL.md`. Current:
     ```text
     set the state of each of 15-17 (`Locked`, or `Stale` if it exists) in the three places of
     ```
     New:
     ```text
     set the state of each of 15-17 (`Locked` if it does not exist; an existing one keeps its state unless Re-lock makes it `Stale`, so a chunk whose own new item shut the gate stays `Provisional (TD-NN)`) in the three places of
     ```
  3. `brd-unifier/delivery-chunks.md`. Current:
     ```text
     their state reads `Locked` (or `Stale`) in all three places of § The delivery gate, Re-lock
     ```
     New:
     ```text
     their state reads `Locked`, `Stale`, or `Provisional (TD-NN)` in all three places of § The delivery gate, Re-lock
     ```

### A-4. Re-chunk gives chunks 15 and 16 the cover's version, against "one update, one version"

- Where: `brd-unifier/chunking.md:174` "TITLE from the chunk's title, VERSION from the combined file's cover, and for chunk 16 the baseline from its `Baseline:` line." (the R4 fix).
- Why: F1 (`delivery-chunks.md:426`; `chunks/brd-master.md:7`) says chunks 15-17 "keep the version they were written at (their basis line)". The re-chunk rule gives 15 and 16 the cover's current version, so a combined BRD whose sections 15 and 16 are `Stale` (written at 1.1, BRD now 1.2) re-chunks into chunks whose VERSION says 1.2 while their `Basis:` and `Baseline:` lines say 1.1.
- Fix (mechanical): `brd-unifier/chunking.md`. Current:
  ```text
  TITLE from the chunk's title, VERSION from the combined file's cover, and for chunk 16 the baseline from its `Baseline:` line.
  ```
  New:
  ```text
  TITLE from the chunk's title, VERSION from the combined file's cover (for chunks 15 and 16, the version on their `Basis:` and `Baseline:` lines: `delivery-chunks.md` § Refresh triggers, Version), and for chunk 16 the baseline from its `Baseline:` line.
  ```

### A-5. The rerun after a content change "may be scoped", but every session's first run is full

- Where: `brd-unifier/delivery-chunks.md:419` "(step 2; the rerun it needs may be scoped to the changed chunks, § Step 2)" against `delivery-chunks.md:159` "Its first run checks chunks 00-13 in full. Each later run is scoped" and `SKILL.md:306` "(a full run, then scoped reruns, at most three runs per session ...)".
- Why: two changed passages disagree. A targeted update in a new session may, by line 419, run only a scoped check; by § Step 2 its first run is full. The decision text (A1/G2: "after a full run, reruns check only the changed chunks") allows both readings; three of the four places chose "a session's first run is full", so the fix aligns line 419 with them. If the user meant that a full run from an earlier session is enough, § Step 2 and the SKILL.md row change instead.
- Fix (mechanical): `brd-unifier/delivery-chunks.md`. Current:
  ```text
  (step 2; the rerun it needs may be scoped to the changed chunks, § Step 2)
  ```
  New:
  ```text
  (step 2; the session's first rerun is full, later ones are scoped to the changed chunks, § Step 2)
  ```

### A-6. Interface: a business review that changes an `Approved` BRD leaves its cover `Approved`

- Where: `business-reviewer-unifier/apply-and-verify.md:85-87` (Apply rule 7) "follows the owning skill's version rule (BRD: brd-unifier's `delivery-chunks.md` § Refresh triggers, Version; ...)"; `brd-unifier/delivery-chunks.md:438` "**Cover status.** A content change to an `Approved` BRD sets the cover's Status to `In Review` and its Date to the change date."; `brd-unifier/SKILL.md:306` (the "update the todo" row) sets no status.
- Why: Cover status is a separate paragraph of § Refresh triggers, after Version. The review bumps an `Approved` BRD and leaves its cover `Approved`, and the owner's hand-off request does not set it either. sdd-unifier then reads `Approved` for an unsigned version and skips the question it asks for an unsigned source (`sdd-unifier/brd-to-sdd.md:32`, `:69`), the case decision G5/S5/X4 was made for (in step 5 a review point had to set REFUNDS back to In Review).
- Fix (mechanical, cross-skill): `business-reviewer-unifier/apply-and-verify.md`. Current:
  ```text
  Version; SDD: sdd-unifier's SKILL.md § Output conventions, Versions).
  ```
  New:
  ```text
  Version, and the Cover status paragraph after it for an Approved BRD; SDD: sdd-unifier's SKILL.md § Output conventions, Versions).
  ```

### A-7. Interface: lld-unifier cannot see a change to the BRD's chunk 14 Mockup coverage

- Where: `lld-unifier/chunks/16-references.md:21` and `lld-unifier/TEMPLATE-COMBINED.md:561` record chunk 14 as "[as of BRD v[X.X]]"; `lld-unifier/SKILL.md:158` compares "the states of BRD chunks 14 and 16 recorded in 16 § 19.1 with the SDD's Source BRDs register and each BRD master". BRD side: `brd-unifier/delivery-chunks.md:430` (status and link updates in chunk 14 are not content changes) and `brd-unifier/chunks/brd-master.md:123` (chunk 14's State cell is always "Living checklist").
- Why: a new or changed `MK-NN` row or Figma link in chunk 14 changes neither the BRD version nor the master's State cell for 14, so step 3c never sees it, and the LLD trigger "BRD chunk 14 `MK-NN` rows, screen IDs in the BRD text, or Figma links change" (`lld-unifier/sdd-to-lld.md:195`) cannot fire from step 3c. The one signal the BRD keeps is chunk 14's `**Last updated:**` line (`brd-unifier/chunks/14-todo.md:22`).
- Fix (mechanical, cross-skill, lld-unifier folder), two edits:
  1. `lld-unifier/chunks/16-references.md` and `lld-unifier/TEMPLATE-COMBINED.md` (same edit). Current:
     ```text
     | [as of BRD v[X.X]] |
     ```
     New:
     ```text
     | [last updated [YYYY-MM-DD] (its Last updated line), BRD v[X.X]] |
     ```
  2. `lld-unifier/SKILL.md`. Current:
     ```text
     Then compare the BRD versions and the states of BRD chunks 14 and 16 recorded in 16 § 19.1 with the SDD's Source BRDs register and each BRD master.
     ```
     New:
     ```text
     Then compare the BRD versions and the states of BRD chunks 14 and 16 recorded in 16 § 19.1 with the SDD's Source BRDs register and each BRD master (for chunk 14, the Last updated line of 14-todo.md).
     ```

## B (ambiguous)

### B-1. Does the "update the todo" hand-off after a business review bump the version again?

- Where: `brd-unifier/SKILL.md:306` "the open items they answer are closed through the step 8 mechanics", with `SKILL.md:238` (step 8.3) "add the item to this update's Changes Log row (one bump per update ...)".
- Why: the review already bumped the BRD and opened its row (`business-reviewer-unifier/apply-and-verify.md` Apply rule 7). Closing the items it answered through 8.3 reads as "add them to this update's row": one run opens a second row and bumps again with no body change, which then sends sdd-unifier and lld-unifier a needless new BRD version; another changes only status lines. sdd-unifier's twin row settles it (`sdd-unifier/SKILL.md:353`: "The review already bumped the version for its own changes; this run bumps it again only if it changes content itself"); the BRD row does not.
- Fix (mechanical): `brd-unifier/SKILL.md`. Current:
  ```text
  and the open items they answer are closed through the step 8 mechanics.
  ```
  New:
  ```text
  and the open items they answer are closed through the step 8 mechanics. The review already bumped the version for its own changes; this request bumps it again only if it changes content itself (`delivery-chunks.md` § Refresh triggers, Version).
  ```

### B-2. An open item raised for a review's open remainder has no `Where` tag, and nothing stops a second raise

- Where: `brd-unifier/SKILL.md:306` "this request raises an open item for each, as for any item raised after the acceptance loop (`delivery-chunks.md` § Special cases)"; `brd-unifier/delivery-chunks.md:449`; `brd-unifier/chunks/13-open-items-and-clarifications.md:12` (LATER ITEMS).
- Why: § Special cases and the chunk 13 header name only the consistency check and the writing of 15-17 as later sources, each with its own `Where` tag. A run must invent a tag for a review remainder, and since nothing marks a remainder as raised, a second "update the todo" after the same review raises it again.
- Fix (mechanical), three edits:
  1. `brd-unifier/delivery-chunks.md`. Current:
     ```text
     The consistency check and the writing of 15-17 can raise new `OI-NN` entries.
     ```
     New:
     ```text
     The consistency check, the writing of 15-17, and an open remainder in a business review record (SKILL.md step 10) can raise new `OI-NN` entries.
     ```
  2. `brd-unifier/delivery-chunks.md`. Current:
     ```text
     add "(raised by consistency check CF-NN)" or "(raised while writing chunk NN)" to their `Where` field
     ```
     New:
     ```text
     add "(raised by consistency check CF-NN)", "(raised while writing chunk NN)", or "(raised by business review [point ID])" to their `Where` field (an item whose `Where` already names that point is not raised again)
     ```
  3. `brd-unifier/chunks/13-open-items-and-clarifications.md`. Current:
     ```text
     LATER ITEMS: The consistency check (14-todo.md step 2) and the writing of chunks 15-17 can add open items after the first review.
     ```
     New:
     ```text
     LATER ITEMS: The consistency check (14-todo.md step 2), the writing of chunks 15-17, and the open remainder of a business review point can add open items after the first review.
     ```

### B-3. A marker a business review settled: who writes its Marker register entry?

- Where: `brd-unifier/decision-log.md:50` and `:54` (Marker register: settled by "... or a business review point"; "or business review [point ID]"); `brd-unifier/SKILL.md:306` (the hand-off row closes open items, says nothing on markers); `business-reviewer-unifier/apply-and-verify.md:15-19` (the review writes one record, in the Business review register).
- Why: the Marker register expects an entry for a marker a review point settled, but the reviewer writes only its Business review register record and the owner's row is silent, so one run adds Marker register entries and another leaves the register without them. sdd-unifier writes them at its hand-off (`sdd-unifier/brd-to-sdd.md:71`: "markers under § Marker register ... the source is the review point").
- Fix (mechanical, parity with sdd-unifier): `brd-unifier/SKILL.md`. Current:
  ```text
  When the review's decision records (the Business review register of `decision-log.md`) state an open remainder
  ```
  New:
  ```text
  Each marker the review removed gets a Marker register entry in `decision-log.md` that names the review point. When the review's decision records (the Business review register of `decision-log.md`) state an open remainder
  ```

### B-4. Which register holds a grill-me decision on a marker?

- Where: `brd-unifier/delivery-chunks.md:192` "through the step 8 mechanics (OI status, Resolution Log, `decision-log.md` record, Changes Log; ...)" and `:450` "a `decision-log.md` record like any other decision (SKILL.md step 8.3)"; `brd-unifier/SKILL.md:236` (8.3 files the record "under the clarification register"); `brd-unifier/decision-log.md:50` (Marker register: a marker settled by the user "in a later request").
- Why: a grill-me decision on a to-do row that came from an inline marker (TD-02 in the skeleton, `chunks/14-todo.md:83`) settles a marker in a later request, so `decision-log.md` puts it under § Marker register, while both delivery-chunks lines send it through step 8.3, which says § Clarification register.
- Fix (mechanical): `brd-unifier/delivery-chunks.md`. Current:
  ```text
  (OI status, Resolution Log, `decision-log.md` record, Changes Log;
  ```
  New:
  ```text
  (OI status, Resolution Log, `decision-log.md` record (§ Marker register for a marker, § Clarification register otherwise), Changes Log;
  ```

### B-5. "Copied as they are": do the links of chunks 15 and 16 change on merge and re-chunk?

- Where: `brd-unifier/chunking.md:160` "Chunks 15 and 16 are copied as they are, status line included: a merge is not a refresh, so no gate is checked."; `brd-unifier/chunking.md:177` "copied as they are with their status line; like a merge, this checks no gate."
- Why: merge step 2 turns links between merged chunks into same-file anchors and re-chunk step 4b turns them back; "copied as they are" can be read to exempt 15 and 16. On a re-chunk of a combined BRD, 15 and 16 link the to-do as `./brd-[project-slug]/14-todo.md` (`TEMPLATE-COMBINED.md:484`, `:520`); copied unchanged into `./brd-[slug]/`, that link points at `./brd-[slug]/brd-[slug]/14-todo.md`. The M9/R10 fix meant "no gate is checked", not "no link changes".
- Fix (mechanical), two edits in `brd-unifier/chunking.md`:
  1. Current:
     ```text
     Chunks 15 and 16 are copied as they are, status line included: a merge is not a refresh, so no gate is checked.
     ```
     New:
     ```text
     Chunks 15 and 16 keep their content and status line; only their links change, as step 2 says. A merge is not a refresh, so no gate is checked.
     ```
  2. Current:
     ```text
     copied as they are with their status line; like a merge, this checks no gate.
     ```
     New:
     ```text
     with their content and status line unchanged; like a merge, this checks no gate. Their links change as step 4b says, and `./brd-[slug]/14-todo.md` becomes `./14-todo.md`.
     ```

### B-6. Pre-BRD row 21: does a later phase that changes behaviour put its Could items in scope?

- Where: `brd-unifier/sow-transformation.md:180` (row "21 Roadmap and Project Plan").
- Why: the same cell says "MoSCoW decides scope, not the phase (the 13-14 row), so a later phase sends only its Could and Won't items to the wishlist", then "A phase that changes system behaviour becomes scope or use cases". A Could item in a later phase that changes behaviour fits both: wishlist by the first sentence, scope by the last. Decision A5 says MoSCoW decides.
- Fix (mechanical): `brd-unifier/sow-transformation.md`. Current:
  ```text
  A phase that changes system behaviour becomes scope or use cases (§ "Timeline" / "Milestones" / "Phases").
  ```
  New:
  ```text
  Its Must and Should items that change system behaviour become scope items or use cases (§ "Timeline" / "Milestones" / "Phases").
  ```

### B-7. Chunk 16's Exit criteria make every go-live dependency a condition of BAT sign-off

- Where: `brd-unifier/delivery-chunks.md:288` "The Exit criteria also name each dependency of chunk 02 whose `Needed before` is BAT sign-off or go-live: sign-off needs it in place."; `brd-unifier/chunks/16-uat-bat-test-cases.md:130` "[each dependency of chunk 02 needed before BAT sign-off or go-live, by name, in place]"; `brd-unifier/TEMPLATE-COMBINED.md:566`.
- Why: decision W-10 says the go-live ones are "listed in chunk 16's Exit criteria". The text requires them "in place" at BAT sign-off, so `BAT sign-off` and `Go-live` mean the same thing for the BRD, and a launch condition (a production legal clearance, for example) blocks the business acceptance of a finished build. sdd-unifier reads both values as launch conditions (`sdd-unifier/brd-to-sdd.md:236`), which fits "listed", not "in place".
- Fix (needs the user's decision; recommended: in place for BAT sign-off; named with owner for go-live; alternative: keep both in place, and say in the decision that sign-off waits for go-live dependencies), three edits:
  1. `brd-unifier/delivery-chunks.md`. Current:
     ```text
     The Exit criteria also name each dependency of chunk 02 whose `Needed before` is BAT sign-off or go-live: sign-off needs it in place.
     ```
     New:
     ```text
     The Exit criteria also name each dependency of chunk 02 whose `Needed before` is BAT sign-off (sign-off needs it in place) or go-live (named with its owner: it must be in place before go-live, not before sign-off).
     ```
  2. `brd-unifier/chunks/16-uat-bat-test-cases.md`. Current:
     ```text
     [each dependency of chunk 02 needed before BAT sign-off or go-live, by name, in place]
     ```
     New:
     ```text
     [each dependency of chunk 02 needed before BAT sign-off, by name, in place]; [each dependency needed before go-live, by name and owner, listed for the go-live decision]
     ```
  3. `brd-unifier/TEMPLATE-COMBINED.md`. Current:
     ```text
     each dependency needed before BAT sign-off or go-live (Dependencies), by name, in place]
     ```
     New:
     ```text
     each dependency needed before BAT sign-off (Dependencies), by name, in place; each needed before go-live, by name and owner, listed for the go-live decision]
     ```

### B-8. Redoing a part and "Update this BRD" do not rerun the consistency check

- Where: `brd-unifier/parts-mode.md:145` (redo a completed part); `brd-unifier/transform-detection.md:128` ("Update this BRD").
- Why: SKILL.md step 7 "On an update" (`SKILL.md:198`) and the step 10 rows (`SKILL.md:305-306`) make the consistency check the update's review, rerun in the same update (decision F2). These two procedures list everything else (bump, chunk 13 by status, chunk 14 refresh, Stale) but not the rerun, so a run that follows them leaves step 2 open until a later request.
- Fix (mechanical), two edits:
  1. `brd-unifier/parts-mode.md`. Current:
     ```text
     refresh chunk 14 (steps whose inputs changed fall back to `In progress`), and mark chunks 15-17
     ```
     New:
     ```text
     rerun the consistency check (SKILL.md step 7, On an update), refresh chunk 14 (steps whose inputs changed fall back to `In progress`), and mark chunks 15-17
     ```
  2. `brd-unifier/transform-detection.md`. Current:
     ```text
     - Refresh `14-todo.md` per `delivery-chunks.md` § Refresh triggers, keeping every identifier stable.
     ```
     New:
     ```text
     - Rerun the consistency check (SKILL.md step 7, On an update). Refresh `14-todo.md` per `delivery-chunks.md` § Refresh triggers, keeping every identifier stable.
     ```

### B-9. What the `Chunks:` list holds in a combined BRD

- Where: `brd-unifier/delivery-chunks.md:426` "The row ends with `Chunks:` and the number of every chunk whose content changed (the first build's row lists none)."
- Why: a combined BRD has no chunk files. `business-reviewer-unifier/apply-and-verify.md` Apply rule 7 ends a combined document's row with "the owning skill's `Chunks:` list", and lld-unifier settles it for its own combined file ("a combined LLD lists sections", `lld-unifier/SKILL.md:356`). The BRD rule is silent, so one run writes chunk numbers, another section names, another nothing; sdd-unifier's delta review reads these rows (`sdd-unifier/SKILL.md:253`).
- Fix (mechanical, parity with lld-unifier): `brd-unifier/delivery-chunks.md`. Current:
  ```text
  The row ends with `Chunks:` and the number of every chunk whose content changed (the first build's row lists none).
  ```
  New:
  ```text
  The row ends with `Chunks:` and the number of every chunk whose content changed (a combined BRD names the changed sections; the first build's row lists none).
  ```

### B-10. A combined BRD's Table of Contents has no format; the template copies now differ

- Where: `brd-unifier/TEMPLATE-COMBINED.md:24-26` (heading and one comment) against `brd-unifier/chunks/00-cover-and-changelog.md:29-34` (a list and its rule) and `brd-unifier/chunking.md:158` (the merged file's rule).
- Why: M5/R2 gave the chunk layout a list and the merged file a rule (one link per `#` and `##` heading, then the files never merged), but a BRD written in COMBINED mode from `TEMPLATE-COMBINED.md` still gets no format, so two runs give two tables of contents: the M5/R2 evidence.
- Fix (mechanical): `brd-unifier/TEMPLATE-COMBINED.md`. Current:
  ```text
  <!-- Auto-generated or manually maintained. The Figures and Tables indices are always present, empty until the first figure or table (chunking.md § Skip rules). -->
  ```
  New:
  ```text
  <!-- One link per # and ## heading, in order, then ./brd-[project-slug]/14-todo.md, 17-for-ppt.md once written, and decision-log.md once it exists (chunking.md § Merge handling, step 4). The Figures and Tables indices are always present, empty until the first figure or table (chunking.md § Skip rules). -->
  ```

### B-11. `modes.md` keeps a second, older copy of the merge and re-chunk steps

- Where: `brd-unifier/modes.md:121-130` (merge) and `:134-142` (re-chunk).
- Why: SKILL.md step 10 sends merge and re-chunk to `chunking.md`, which step 6 extended (the Table of Contents format, 15 and 16 copied with no gate check, the skeleton's full header, the `---` line left out on re-chunk, the Table of Contents rebuilt, the `-MERGED.md` links kept). `modes.md` received only the `---` change (its step 4). A run that follows `modes.md` misses the rest; the same steps now stand twice in different words.
- Fix (mechanical): mark the `modes.md` lists as summaries. Two edits in `brd-unifier/modes.md`:
  1. Current:
     ```text
     When the user says "merge", "consolidate", "single file", "full doc" after a chunks-mode generation:
     ```
     New:
     ```text
     When the user says "merge", "consolidate", "single file", "full doc" after a chunks-mode generation (a summary: `chunking.md` § Merge handling holds the full rule and wins):
     ```
  2. Current:
     ```text
     When the user says "split into chunks", "chunk this BRD", "re-chunk this":
     ```
     New:
     ```text
     When the user says "split into chunks", "chunk this BRD", "re-chunk this" (a summary: `chunking.md` § Re-chunk handling holds the full rule and wins):
     ```

### B-12. Re-chunking a merged file of a collapsed BRD

- Where: `brd-unifier/chunking.md:103` "A re-chunk never collapses: it always writes one `06*` chunk per persona"; `brd-unifier/chunking.md:179` "When the source is a `-MERGED.md` file in the chunk folder, their links already point at the chunk files: keep them."
- Why: a BRD written `whole` with the collapsed `05-user-journeys-and-use-cases.md` can be merged and then re-chunked. The re-chunk writes 05 and `06*` (decision R1), but step 7 keeps the to-do links, which point into `05-user-journeys-and-use-cases.md`, and the old collapsed file stays beside the new ones: two homes for every use case.
- Fix (mechanical): `brd-unifier/chunking.md`. Current:
  ```text
  When the source is a `-MERGED.md` file in the chunk folder, their links already point at the chunk files: keep them.
  ```
  New:
  ```text
  When the source is a `-MERGED.md` file in the chunk folder, their links already point at the chunk files: keep them, except links into a collapsed `05-user-journeys-and-use-cases.md` (§ When to deviate, rule 4), which point at the new 05 and `06*` files instead. Name the old collapsed file in the handoff, for the user to remove.
  ```

### B-13. Reformatting an existing BRD: "the first build is at 1.0" or "version bumped"?

- Where: `brd-unifier/delivery-chunks.md:426` "the first build (every part, the review, the acceptance loop, and the to-do) is one update, at 1.0." against `brd-unifier/sow-transformation.md:154` ("Old version of this same template": "bump version in Changes Log with "Migrated to template version X.Y"") and `:247` ("version bumped if migrating from a prior version").
- Why: F1's new sentence can be read to put any first build in this skill at 1.0, including the transform of a BRD that already has versions (stage B plans exactly this: "reformat this BRD into the current template" for REFUNDS 1.0 and LOYALTY); `sow-transformation.md` says such a migration bumps. Also, no template version exists to name in "template version X.Y".
- Fix (mechanical), two edits:
  1. `brd-unifier/delivery-chunks.md`. Current:
     ```text
     the first build (every part, the review, the acceptance loop, and the to-do) is one update, at 1.0.
     ```
     New:
     ```text
     the first build (every part, the review, the acceptance loop, and the to-do) is one update, at 1.0. Moving a BRD that already has versions from another format or an older template into this one is one update of that BRD: one minor step above its last version.
     ```
  2. `brd-unifier/sow-transformation.md`. Current:
     ```text
     Migrate to current template; bump version in Changes Log with "Migrated to template version X.Y".
     ```
     New:
     ```text
     Migrate to current template; bump the version one minor step (`delivery-chunks.md` § Refresh triggers, Version), with a Changes Log row "Migrated to the current template".
     ```

## C (cosmetic)

### C-1. "One row per update" in the Changes Log comment

- Where: `brd-unifier/chunks/00-cover-and-changelog.md:25` and `brd-unifier/TEMPLATE-COMBINED.md:20` "<!-- One row per update (delivery-chunks.md § Refresh triggers, Version)."
- Why: an update with no content change (a to-do refresh, a merge, a status mark) adds no row (`delivery-chunks.md:426`, `:428`).
- Fix (mechanical), same edit in both files. Current:
  ```text
  <!-- One row per update (delivery-chunks.md § Refresh triggers, Version).
  ```
  New:
  ```text
  <!-- One row per update that changes content (delivery-chunks.md § Refresh triggers, Version).
  ```

### C-2. The merged Table of Contents lists the unmerged files in another order than chunk 00

- Where: `brd-unifier/chunking.md:158` "(`14-todo.md`, `decision-log.md` once it exists, `17-for-ppt.md` once written)" against `brd-unifier/chunks/00-cover-and-changelog.md:34` "then 14, then 15-17 once written, then decision-log.md once it exists".
- Fix (mechanical): `brd-unifier/chunking.md`. Current:
  ```text
  (`14-todo.md`, `decision-log.md` once it exists, `17-for-ppt.md` once written)
  ```
  New:
  ```text
  (`14-todo.md`, `17-for-ppt.md` once written, `decision-log.md` once it exists)
  ```

### C-3. The gate-open steps name only chunk 14 for the new chunk's state

- Where: `brd-unifier/delivery-chunks.md:51` "3. Update `14-todo.md` last."; `brd-unifier/SKILL.md:275` "Update `14-todo.md` last (links, `Blocks`, Downstream outputs)."
- Why: writing 15 sets its state (`Up to date` or `Provisional (TD-NN)`), which Re-lock keeps in three places (`delivery-chunks.md:53`). The pointer at the top of § Refresh triggers (`:403`) covers refreshes, not a first write, so these two steps are the only text a first write follows.
- Fix (mechanical), two edits:
  1. `brd-unifier/delivery-chunks.md`. Current:
     ```text
     3. Update `14-todo.md` last.
     ```
     New:
     ```text
     3. Update `14-todo.md` last, and set the state of each chunk written in the three places of Re-lock (below).
     ```
  2. `brd-unifier/SKILL.md`. Current:
     ```text
     Update `14-todo.md` last (links, `Blocks`, Downstream outputs).
     ```
     New:
     ```text
     Update `14-todo.md` last (links, `Blocks`, Downstream outputs), and set the state of each chunk written in the three places of `delivery-chunks.md` § The delivery gate, Re-lock.
     ```

### C-4. The lists of what the decision log holds leave out the two new registers

- Where: `brd-unifier/decision-log.md:3`, `brd-unifier/SKILL.md:95` (principle 12), `brd-unifier/SKILL.md:323`, `brd-unifier/chunking.md:41`.
- Why: each lists the clarification Q&A, choices, delegation notes, assessments, and part-handoff records, but not the settled markers (Marker register) or the business review records (Business review register) that F3 added.
- Fix (mechanical), four edits:
  1. `brd-unifier/decision-log.md`. Current:
     ```text
     walkthrough progress, per-decision impact assessments, and part-handoff instructions.
     ```
     New:
     ```text
     walkthrough progress, per-decision impact assessments, part-handoff instructions, settled markers, and the records of business review points.
     ```
  2. `brd-unifier/SKILL.md`. Current:
     ```text
     walkthrough progress, per-decision impact assessments, part-handoff instructions) goes into `decision-log.md`
     ```
     New:
     ```text
     walkthrough progress, per-decision impact assessments, part-handoff instructions, settled markers, business review records) goes into `decision-log.md`
     ```
  3. `brd-unifier/SKILL.md`. Current:
     ```text
     superseded history, walkthrough and delegation notes, per-decision assessments, part-handoff records), its canonical structure
     ```
     New:
     ```text
     superseded history, walkthrough and delegation notes, per-decision assessments, part-handoff records, settled markers, business review records), its canonical structure
     ```
  4. `brd-unifier/chunking.md`. Current:
     ```text
     superseded history, walkthrough and delegation notes, per-decision assessments, part-handoff records. Created on first use.
     ```
     New:
     ```text
     superseded history, walkthrough and delegation notes, per-decision assessments, part-handoff records, settled markers, business review records. Created on first use.
     ```

### C-5. "The one exception" to the citation-label rule is not the only one

- Where: `brd-unifier/delivery-chunks.md:115` "Chunk 16's `Related UC` cell is the one exception" (the G12 fix).
- Why: other skeleton cells cite `BR-n` and `AC-n` without a label too: chunk 14 `Blocks` "[UC-04 Main Flow, UC-04 AC-2]" (`chunks/14-todo.md:82`) and Mockup coverage "[UC-01 BR-1; ...]" (`:187`), chunk 15 Source requirements "[UC-01 BR-1; ...]" (`chunks/15-implementation.md:78`). Dropping "the one exception" keeps the G12 point without the false claim.
- Fix (mechanical): `brd-unifier/delivery-chunks.md`. Current:
  ```text
  Chunk 16's `Related UC` cell is the one exception: it keeps its fixed form
  ```
  New:
  ```text
  Chunk 16's `Related UC` cell keeps its fixed form
  ```

### C-6. "A change it made" lost its referent in the "update the todo" row

- Where: `brd-unifier/SKILL.md:306` "the review applied the point, and the owner raises the question. A change it made to chunks 00-13 marks chunks 15-17 `Stale` if they exist".
- Why: after the inserted W-4 sentence, "it" can read as the owner, this request, or the review. Every reading marks 15-17 `Stale` (Re-lock covers any change), so only the wording is at stake.
- Fix (mechanical): `brd-unifier/SKILL.md`. Current:
  ```text
  the owner raises the question. A change it made to chunks 00-13 marks chunks 15-17 `Stale` if they exist
  ```
  New:
  ```text
  the owner raises the question. A change to chunks 00-13, by the review or by this request, marks chunks 15-17 `Stale` if they exist
  ```

### C-7. "Always the same" state against chunk 14's longer `Up to date` value

- Where: `brd-unifier/delivery-chunks.md:53` (Re-lock) "is kept in three places, always the same"; `brd-unifier/chunks/14-todo.md:54` lists the chunk 14 value as "Up to date ([date], BRD v[X.X])".
- Why: the status line and the master's State cell carry the bare word, chunk 14 adds a date and basis; a checker (stage CK plans one) or a reader comparing the three places sees a mismatch that the rules intend.
- Fix (mechanical): `brd-unifier/delivery-chunks.md`. Current:
  ```text
  is kept in three places, always the same and written in the same run:
  ```
  New:
  ```text
  is kept in three places, always the same state (chunk 14 may add the date and basis after `Up to date`) and written in the same run:
  ```

### C-8. Chunk 16's header does not list chunk 02, which its Exit criteria now cite

- Where: `brd-unifier/chunks/16-uat-bat-test-cases.md:7` "DEPENDS_ON: 05, 06a+ (every use-case chunk), 07, 08, 09, 10, 11, 14, 15"; the W-10 Exit criteria line (`:130`) names chunk 02 dependencies.
- Fix (mechanical): `brd-unifier/chunks/16-uat-bat-test-cases.md`. Current:
  ```text
  DEPENDS_ON: 05, 06a+ (every use-case chunk), 07, 08, 09, 10, 11, 14, 15
  ```
  New:
  ```text
  DEPENDS_ON: 02, 05, 06a+ (every use-case chunk), 07, 08, 09, 10, 11, 14, 15
  ```

## README statements now wrong

- `README.md:199` "`business-reviewer-unifier` changes content only, inside each BRD's and SDD's template structure, never edits an LLD or a gated chunk, and bumps each changed document's version once." Now imprecise: under brd-unifier's Re-lock (F4, `delivery-chunks.md:53`) the review sets an existing BRD 15-17 chunk's `Stale` mark in its status line, its chunk 14 row, and the master's State cell. Suggested wording: "never edits an LLD or a gated chunk's content (it only sets an existing gated chunk's `Stale` mark)". This is the line the plan's RM stage already lists for F4.
- No other root README statement about the BRD is made wrong by the brd-unifier changes. Two points are now incomplete, not wrong, and fit the planned RM pass: `README.md:135` (the 02 row says "dependencies become integrations" and does not mention the `Needed before` column that sdd-unifier now reads), and the README states no BRD version rule. `README.md:541` (Known gaps) was stale before step 6 (triage N-2).

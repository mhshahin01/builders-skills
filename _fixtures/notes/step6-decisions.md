# Step 6 design decisions (2026-10-02)

The fix round's D items: each changes a gate, a template's shape, versioning or review policy, a hand-off, or adds a feature-sized path, so it waits for the user. The M (mechanical) and S (simple) items were applied without asking, as in the consistency rounds.

Full evidence, options, tradeoffs, and the exact wording of each change are in the triage reports, `SP\s6\triage\<report>.md` (SP = this session's scratchpad, see `UNIFIER-ENHANCEMENTS.md` § Step 6). The ID column names the report and item.

Decide per group: accept every recommendation, or name the items to change.

## A. Cross-skill policy (families.md)

| ID | Question | Recommended | Alternatives |
|---|---|---|---|
| F1 | Versions and Changes Log rows (A7, G4, C2, D3, S10, C1-4, C1-5, L4, C1-9, the reviewer's versioning) | **One update, one version.** An update is one request to its handoff; the first build is one update at 1.0. Its first content change bumps one minor step and opens one Changes Log row; everything else in the update joins that row, which ends with a `Chunks:` list. Master and chunk 00 carry the current version; other chunks keep the version in which they last changed; gated chunks keep the version they were written at. Status lines, Stale marks, and the Child LLDs rows bump nothing. No two rows share a version. lld-unifier step 3c reads the `Chunks:` list | Every chunk shares the version (every update rewrites every header; gated chunks cannot follow); one bump per batch (several versions per request); rows keep naming sections (step 3c misses chunks, as in C1-4) |
| F2 | Update paths skip the mandatory reviewer (S2, L1, C1-2, X2, V1, and sdd-templates V1-8B3) | **A review of what the update changed.** The full reviewer runs once, on the first build. A later SDD or LLD update that changes content runs a cleared-context delta review of the chunks in its `Chunks:` list; it reads chunk 18 first and never raises an existing item again. Every write of SDD chunk 19 (first build included) gets a cleared-context faithfulness check against its sources, fixed in place before the gate line reads `Open - Up to date`. The BRD's consistency check stays its update review. Cost: about 15 to 25 min per SDD or LLD update, about 17 min per chunk 19 write | Full review on every update (30 to 40 min each); delta review in the BRD too; opt-in only (X2- and V1-class errors ship) |
| F3 | Items an upstream change settles, and the decision-log homes (S8, X3, L5, C1-2, T1, C5, D10 from sdd-core) | **Existing statuses, one home per source.** An item a BRD or SDD change answers closes as `Adjusted - applied` or `Rejected` (SDD) or `Resolved` (LLD), with a Resolution Log row `Settled by [KEY] v[X.X]`; a closed item whose design the change overturns keeps its status with `Superseded by ...`, or reopens when the change leaves a choice open. Both decision logs get a Marker register (replacing "Part N clarification register") and a Business review register. SDD step 8 offers a marker walk (proposed answers in the open-item format; never a provider fact, legal basis, or business number), so E3 can be met on a first run | A new closed status "Settled upstream" (a gate vocabulary change in three skills and the checkers); reopen everything an upstream change touches; raise each gate-blocking marker as an OI; keep "fill in section Y" (step 4 needed two extra agents) |
| F4 | "Mark Stale" against a chunk whose gate forbids writing it (A8, L20, A3; reviewer V-9) | **Stale is a status mark, not a write.** Set only where the owning skill keeps the state, only when the chunk exists. BRD 15-17: status line, chunk 14 row, and master State cell, always equal. SDD 19: the E2E gate line only; chunk 19 itself is never touched. The reviewer never edits a gated chunk's content and sets the same marks | Stale only outside gated chunks (a stale chunk's own line can read Up to date); every gated chunk, SDD 19 included, carries its own status line (two homes for one fact) |

## B. SDD derivation (sdd-core.md)

| ID | Question | Recommended | Alternatives |
|---|---|---|---|
| S2-1 | Keyed and linked BRD IDs in chunk 18, the Changes Log, and the decision log (check_sdd's 37 to 68 problems) | **One rule everywhere**: every BRD ID keyed, every use case linked; said in the reviewer brief and step 8.3; check_sdd unchanged | Decision log exempt from links; all three history places exempt from links; the checker exempts them from both checks |
| S2-4a, D2 | The "first production release" profile gives two style and two hosting answers | **Modular monolith** unless a BRD NFR or Technical Input states a separate scaling, failure, or release need for one part (a provider integration or a notification fan-out alone does not count; it becomes the extraction trigger); Q8 from the Technical Inputs or CLAUDE.md, else the managed container service | Recommend the walkthrough when the profile allows two answers; keep the hybrid condition and add only the Q8 tie-break |
| S2-4c | Proposing endpoints against "never write a spec from the BRD alone" (note: your CLAUDE.md says "Do not invent endpoints") | **Proposed endpoints**: the derivation proposes method and path for each owned use case (they are the §7.3 entry points E3 needs), flags request and response fields, and names the endpoints as proposals at the part 2 stop | Strict: every endpoint a marker until the architect gives it (one marker per use case, E3 shut); a `proposed` mark per endpoint (a template column) |
| S2-4d, D9 | The API style ADR stays Proposed although CLAUDE.md states REST | **Accepted from the stated default** ("default per CLAUDE.md"), like the §11 defaults; a marker only when a BRD mandate or the user asks for another style; authorization enforcement keeps its marker | An API Style row in the §6 table (a table change lld-unifier reads); keep the marker with REST as its recommended answer |
| S3 | Open items the author must raise vs "chunk 18 is never authored by the same context" | **The author appends them after the review pass** (next free OI IDs, same schema, through the acceptance loop) | Inline markers instead (block E3, no loop); park them for the reviewer to write |
| S5 | A source BRD whose cover is not Approved | **Ask once** (recommended: proceed) and name it in the part 1 summary and the step 9 lineage line | Proceed and only report it; stop until it is Approved |
| X2 | Step 6a has no data-model check | **Add one**: ERD vs Tables Design, `tenant_id` in every shared-schema key and index, NOT NULL for relied-on columns, Retention covers every table | Leave it to the delta review (F2); no change |
| T2 | "Leave the rest untouched" vs back-fill on a targeted update | **Back-fill** every chunk the change makes wrong, named in the Changes Log row | Untouched but flagged (stale text stays); back-fill through step 6a only |

## C. SDD templates (sdd-templates.md, with lld.md E4)

| ID | Question | Recommended | Alternatives |
|---|---|---|---|
| S2-3 | Mermaid blocks over the ~30-line guideline (6 per SDD) | **Cap by kind**: workflows and sequences about 30 lines, else split; layered views uncapped; an ERD shows entities, keys, and relationships only (columns stay in Tables Design) | Exempt layered views and ERDs only; raise the cap to about 45; split structural views |
| D5, TD2 | The in-process port contract has no idempotency or transaction field | **A two-row Behaviour table** (Idempotency, Transaction) in the in-process block, mapped into the LLD | Two rows in the identity table; the fuller table the run wrote; no change |
| D6, E4 | Durable in-process publication (SDD) and the LLD outbox for provider writes and durable in-process events | **SDD: one Delivery line above §14.10** (durable via a publication log, or in memory). **LLD: widen the Outbox rule** to any side effect that must follow a state change and must not be lost (broker event, provider write, durable in-process event): same roles and delivery contract | SDD: a Delivery column, or new phase values; LLD: two named variants, or cite whatever the SDD's ADR says |
| TD3 | The BRD NFR-to-target table has no home in §18 | **Append §18.5 NFR Targets** (BRD NFR, technical target, realised in); nothing renumbered, so LLD links to §18.2 keep working | Unnumbered table before §18.1; insert as §18.1 and renumber; no table |
| W2 | Chunk 19 §24.2 and §24.3 redraw §8.2 and §8.3 (the copies already drift) | **By reference**: cite §8.2 and §8.3 and draw only what they add; §24.5 and §24.8 stay chunk 19's own | Diagrams are views and may redraw; drop §24.2 and §24.3 |
| W3 | The §24.1 Archetype and Phase cells have no source | **State the derivation** in the §24.1 comment (archetype from the 09 Responsibility, phase from §14.4); no table change | Add both columns to the chunk 09 table; drop them from §24.1 |
| W7 | Faithfulness sources stop at 09-13x, so a Proposed ADR became a doctrine's home | **Widen the sources to 02-13x**; a doctrine's home is only §14.7 or an Accepted ADR; the gate is unchanged | Also extend E3 to chunk 06 (the gate shuts more often); widen the sources only |

## D. LLD (lld.md)

| ID | Question | Recommended | Alternatives |
|---|---|---|---|
| L2-6 | Jobs and BRD reports no use case covers have no home | **`### Workflow: [name]` blocks** with a "No BRD use case - realises [link]" line, no `@UseCase`, and a `None - no BRD screen` route value | Keep them in §7.3 pseudocode and label their routes platform pages; raise a Missing scenario for each |
| L2-9 | Where per-instance Resilience4j settings live | **An instance table under the defaults table** in 09 §12.3, `Default` where a cell equals the defaults | Settings in the caller's 04 file; an instance table only |
| L2-10b | Link target when a screen has both a chunk 14 Mockup coverage row and a screen ID | **The chunk 14 row wins** (`14-todo.md#mockup-coverage`); the BRD heading only for a screen ID with no row | Screen ID first; a legacy row is a gap with a flag |
| L2-10d | `@UseCase` on listeners and jobs that realise later use-case steps | **No new LLD rule**: the S fix S2-4f (applied) now lists a handled event as an `Event:` entry point in SDD §7.3, and the existing LLD rule tags every §7.3 entry point. (The LLD report's own pick, before S2-4f: tag them as an LLD delta) | Tag them as the LLD's own delta; state that they carry none |
| L2-10h | A missing version pin at step 6b | **Never ask in the LLD**: flag it in §6.3 and route the pin to SDD §6 through sdd-unifier | Ask once at step 3a; keep the question with a fallback |
| L2-10k | "Direct lift" vs one fact, one home (05 tables, 10 §13.1 defaults) | **Derived views with a Source column per row**; a value that differs from the SDD is drift to flag | Reference only (the implementer reads two documents); keep "direct lift" unchecked |
| E10 | The §18.5 confidence summary has no unit and misses sections | **Count open flags only** (`> Confirm:`, `> TODO:`), with a row for every section, §1 to §6 and §20 included | Keep a High column with a defined unit; drop §18.5 |
| L3 | A new SDD version and a BRD change fire two triggers but get one offer | **One offer**: step 3c also compares the BRD versions and chunk 14 and 16 states recorded in 16 §19.1; one regeneration, one step 6a, one bump | Merge only when both are requested; keep two requests and two bumps |

## E. BRD (brd.md)

| ID | Question | Recommended | Alternatives |
|---|---|---|---|
| R1 | Deviation rule 4 collapses 05 and 06* on a conversion; re-chunk writes one 06* per persona | **Re-chunk always writes one 06* per persona**; rule 4 only for a fresh `whole` generation | Rule 4 only for a COMBINED-mode source; rule 4 whenever counts fit (breaks SDD and LLD links) |
| A1, G2 | The consistency check has no stop condition (13 runs in one session) | **Scoped reruns with a cap**: after a full run, reruns check only the changed chunks and those linking to them; stop when nothing new, or after 3 runs per session; the rest stay CF or TD rows | One full run per session; rerun until a run raises nothing; no change |
| A5 | A MoSCoW Should item in a later roadmap phase | **MoSCoW decides scope**; each scope item is labelled with its roadmap phase; only Could and Won't go to the wishlist | Only the first release is in scope; phases stay in the pre-BRD, linked |
| G5, S5, X4 | Cover Status, Date, and approver after a change | **Status follows sign-off**: a content change to an Approved BRD sets In Review and the change date; Approved, and the approver in the row, only when the user names the approver | Show both states on the cover; never change Status (every change raises the same open item) |
| G10 | Editorial rewording is not on the "not a content change" list | **List it** (no fact, number, rule, actor, ID, or meaning changed); when unsure, treat as content | Every edit is content; rewording needs a scoped recheck |
| W-10 | Go-live and launch conditions have no home (the review added a G6 gate and a legal table) | **A `Needed before` column in the 02 Dependencies table** (a task, BAT sign-off, or go-live); go-live ones listed in chunk 16's Exit criteria; no G6. (The reviewer report preferred no template change yet) | No template change, route such needs to Skill changes requested; a Go-live conditions section in 04; a G6 sign-off gate |

## F. Business reviewer (reviewer.md)

| ID | Question | Recommended | Alternatives |
|---|---|---|---|
| K3 | The BO charter assumes a product sold to customers | **One sentence**: for an in-house system, read revenue, pricing, and churn as its business case | Intake asks sold or in-house, two charters; no change |
| K4 | Every reviewer hit the 12-finding cap | **Keep 5 to 12**, most material first, and a closing count of what each reviewer left out, shown in the merge report | Keep as is; raise the cap to 20 |
| K6 | The tracker drops each finding's Why and Direction | **A write-once companion file**, `review-panel-findings.md`, linked from the tracker; the walkthrough reads it | A section at the end of the tracker; Why and Direction columns; no change |
| W-4 | A point whose decision leaves an open question for the document's owner | **Applied**; the question is the decision record's open remainder, and the owner's hand-off raises it as an open item (one clause in the brd-unifier and sdd-unifier request rows) | The review writes the owner's open item itself; mark the point Deferred |
| N-5 | sdd-unifier says "BRD <KEY> has a new version" covers the review hand-off, but that path neither reads the tracker nor closes the review's items, and bumps again | **One update, one version**: the new-version request after a review also reads the tracker and closes the items its decisions answer | Two requests in order (two SDD runs, a second bump) |

## G. pre-BRD scoring and Excel export (pre-brd.md; families.md)

| ID | Question | Recommended | Alternatives |
|---|---|---|---|
| P2, P3, P13 | The Tier 5 scoreboard: undefined signal mappings; EFAS threats raise the score; Markdown and Excel EFAS/IFAS rows differ | **One mapping for Markdown and Excel**: the workbook's mappings written into `frameworks.md` and chunk 22, with Competitive Risk = 7 - 2 x the Porter average and SAM graded in USD; every EFAS factor rated by how well the product responds to it; EFAS fixed at 5 factors and IFAS at 4, the workbook reading opportunity and strength rows by type. Edits the reference workbook (6 cells) | Copy the workbook as is (keeps its 0-to-4 and currency defects); Markdown-only mappings (the Excel can disagree); a full redesign |
| P6 | Chunk 00 is written for a template author | **Make it true for a filled deliverable**, drop its duplicate fill contract, and have SKILL.md say "copy" | Add a status section; keep the skeleton and list what each run rewrites |
| P8a | The canonical-figures note research asks for has no slot | **A Canonical figures table** in the 07 skeleton (Markdown only) | No register (each figure in its first chunk); keep it in the synthesis context only |
| N-2 | The Excel export drops the chunk 06 competitor columns | **Whitelist those cells** in the cell map | Declare them Markdown-only |
| N-3, xlsx | The exported workbook keeps the EventHive example text; the export's em dash scrub misses 5 cell comments | **Make the reference workbook generic**, map the Executive Summary rationale and condition cells, and scrub cell comments too | Only blank the example cells |

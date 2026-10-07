# LLD consistency re-check

## Summary

A = 4; B = 2; C = 0. Five mechanical findings and one needs the user's decision. All requested LLD coverage is complete. The reference checker passed: 240 references, 0 problems.

- **B-2, needs a decision:** Store a normalized Mockup coverage fingerprint (recommended), or narrow the refresh trigger to treat Figma-only changes as transparent through the source link.

## A. Wrong or contradictory

### A-1. The duplication checks still reject the derived views that C2 permits

- **Where:** `lld-unifier/sdd-to-lld.md:17-18`; `lld-unifier/SKILL.md:286,305`; `lld-unifier/chunks/18-open-items-and-clarifications.md:27`; `lld-unifier/TEMPLATE-COMBINED.md:660`.
- **Class / action:** A, mechanical.
- **Quote:** "**Standalone export is the only exception.**" and "SDD content is referenced + implementation delta, never restated".
- **Why:** The revised principle 13 and `sdd-to-lld.md` rule 3 expressly require sourced derived views. Rule 5 still calls all restatement a review defect, rule 6 says standalone export is the only exception, and the reviewer brief and handoff check still apply that blanket test. A compliant table can therefore be rewritten or fail the handoff. This is residual fallout from L2-10k and C2, related to the earlier `step6-consistency/lld.md` A-8 and B-6; the mapping and exception list were fixed, but these consumers were not.
- **Exact fixes:**
  1. File: `lld-unifier/sdd-to-lld.md`. Current (unique):
     > 5. **Restated upstream content is a review defect.** The reviewer flags it as Type `Duplication` with the reference-based rewrite as the Recommendation.
     
     New:
     > 5. **Restated upstream content outside rule 3's sourced derived views is a review defect.** The reviewer flags it as Type `Duplication` with the reference-based rewrite as the Recommendation.
  2. File: `lld-unifier/sdd-to-lld.md`. Current (unique):
     > 6. **Standalone export is the only exception.**
     
     New:
     > 6. **Standalone export also permits inlining.**
  3. File: `lld-unifier/SKILL.md`. Current (unique):
     > duplication (SDD content restated instead of referenced with an implementation delta: one fact, one home)
     
     New:
     > duplication (SDD content restated outside principle 13's sourced derived views instead of referenced with an implementation delta)
  4. File: `lld-unifier/SKILL.md`. Current (unique):
     > SDD content is referenced + implementation delta, never restated;
     
     New:
     > SDD content is referenced with an implementation delta, or restated in principle 13's derived views with a source per row;
  5. Files: `lld-unifier/chunks/18-open-items-and-clarifications.md` and `lld-unifier/TEMPLATE-COMBINED.md`. Current (unique in each):
     > Duplication (SDD content restated instead of referenced)
     
     New:
     > Duplication (SDD content restated outside the sourced derived views in SKILL.md principle 13)

### A-2. Runtime route instructions still require use cases on C6's screen-only routes

- **Where:** `lld-unifier/sdd-to-lld.md:124,128`; `lld-unifier/chunks/14-frontend.md:58,68`; `lld-unifier/TEMPLATE-COMBINED.md:523,533`; the Frontend cells at `chunks/09-cross-cutting.md:121` and `TEMPLATE-COMBINED.md:395`.
- **Class / action:** A, mechanical.
- **Quote:** "each route that implements a BRD screen declares `data: { screen: 'REFUNDS/MK-02', useCases: ['REFUNDS/UC-04'] }`".
- **Why:** C6 and the revised route comments require a Workflow route with a chunk 14 screen to carry `screen` only. The runtime paragraph still requires both fields for every BRD screen, while the telemetry reader unconditionally joins `useCases` and attaches `use_case`. The result either invents a use case or leaves the reader to handle an absent field without instructions. This is an incomplete fix of `step6-consistency/lld.md` B-9 (decision C6).
- **Exact fixes:**
  1. File: `lld-unifier/sdd-to-lld.md`. Current (unique):
     > - Runtime context: each route that implements a BRD screen declares `data: { screen: 'REFUNDS/MK-02', useCases: ['REFUNDS/UC-04'] }`. The global `ErrorHandler` and the frontend telemetry attach `screen` and `use_case` from the deepest active route to every error report and RUM span.
     
     New:
     > - Runtime context: each route that implements a BRD screen declares `screen`. It also declares `useCases` when the BRD names use cases for it, for example `data: { screen: 'REFUNDS/MK-02', useCases: ['REFUNDS/UC-04'] }`. A Workflow route with no BRD use case carries `screen` only. The global `ErrorHandler` and frontend telemetry read the deepest active route, attach its `screen`, and attach `use_case` only when that route has `useCases`.
  2. Files: `lld-unifier/chunks/14-frontend.md` and `lld-unifier/TEMPLATE-COMBINED.md`. Current (unique in each):
     > Every route that implements a BRD screen carries it in its route data, so a frontend error report names the screen and the use case.
     
     New:
     > Every route that implements a BRD screen carries it in its route data. It carries use cases only when the BRD names them for that route. A Workflow route with no BRD use case carries `screen` only.
  3. Files: `lld-unifier/chunks/14-frontend.md` and `lld-unifier/TEMPLATE-COMBINED.md`. Current (unique in each):
     > read the data of the deepest active route and attach `screen` and `use_case` to every error report and RUM span
     
     New:
     > read the data of the deepest active route and attach its `screen` to every error report and RUM span; they attach `use_case` only when that route has `useCases`
  4. Files: `lld-unifier/chunks/09-cross-cutting.md` and `lld-unifier/TEMPLATE-COMBINED.md`. Current (unique in each):
     > `use_case` joins the route's `useCases` in the Value form
     
     New:
     > `use_case` joins the route's `useCases` in the Value form when present; a screen-only Workflow route has no `use_case`

### A-3. The confidence table still treats every unmatched entry point as an open question

- **Where:** `lld-unifier/confidence-rules.md:90` and `lld-unifier/hybrid-drift.md:187`, against `code-extraction.md:69,95` and `sdd-to-lld.md:31,181`.
- **Class / action:** A, mechanical.
- **Quote:** "Entry point with no §7.3 match, not a platform endpoint (SDD given)" with "(none; an open question, never a new UC)".
- **Why:** L2-6 and the fix to `step6-consistency/lld.md` A-6 distinguish an unmatched job/report that the BRD or SDD explicitly asks for from behaviour that nothing asks for. The former gets a sourced Workflow block. `confidence-rules.md`, which phase 3 applies to every block, still labels both as open questions with no override. The fix updated the parallel row in `code-extraction.md` but left this authoritative confidence table and the parallel hybrid drift row behind. A report endpoint explicitly required by BRD chunk 09 is therefore incorrectly labelled code-only in hybrid mode.
- **Exact fix:** File: `lld-unifier/confidence-rules.md`. Current (unique):
  > | Entry point with no §7.3 match, not a platform endpoint (SDD given) | Medium (`> Confirm:`) | (none; an open question, never a new UC) |
  
  New:
  > | Entry point with no §7.3 match, not a platform endpoint, that nothing in the BRD or SDD asks for (SDD given) | Medium (`> Confirm:`) | (none; an open question, never a new UC) |
- **Matching exact fix:** File: `lld-unifier/hybrid-drift.md`. Current (unique):
  > | A user-facing code endpoint matches no §7.3 entry point and is not a platform endpoint | `🆕 code-only` + `> Drift note: behaviour no BRD use case covers? Open question, never a new UC.` | MEDIUM |
  
  New:
  > | A user-facing code endpoint matches no §7.3 entry point, is not a platform endpoint, and does nothing the BRD or SDD asks for | `🆕 code-only` + `> Drift note: behaviour no BRD use case covers? Open question, never a new UC.` | MEDIUM |

### A-4. A BRD-triggered reopening is attributed to the SDD

- **Where:** `lld-unifier/sdd-to-lld.md:202`, against `chunks/18-open-items-and-clarifications.md:77` and `TEMPLATE-COMBINED.md:689`.
- **Class / action:** A, mechanical.
- **Quote:** "a Resolution Log row `Reopened by SDD v[X.X]`".
- **Why:** The new F3 text lets either a BRD or an SDD refresh overturn a resolved item. Its Settled and Superseded sentences permit `[KEY] v[X.X]`, and both Resolution Log templates permit that source for Reopened as well. The reopening sentence alone requires an SDD attribution even when a BRD change left the choice open. This is a partial fix of `step6-consistency/lld.md` A-5, not a new outcome or status.
- **Exact fix:** File: `lld-unifier/sdd-to-lld.md`. Current (unique):
  > a Resolution Log row `Reopened by SDD v[X.X]`.
  
  New:
  > a Resolution Log row `Reopened by SDD v[X.X]` (or `[KEY] v[X.X]`).

## B. Ambiguous

### B-1. Re-chunking an LLD does not recover each chunk's content version

- **Where:** `lld-unifier/chunking.md:172`; `lld-unifier/SKILL.md:356`; `lld-unifier/chunks/lld-master.md:8`.
- **Class / action:** B, mechanical.
- **Quote:** "For each chunk, prepend the `<!-- CHUNK: ... -->` comment block and append its footer".
- **Why:** F1 says unchanged chunks keep their last content version, and C11 says re-chunking takes it from the newest Changes Log row naming the chunk or one of its sections. The LLD rule creates VERSION headers without saying which version goes into each. A combined LLD retains its Changes Log and its section names, so this history can be recovered; copying the cover version to every chunk incorrectly makes old content look refreshed. This is the LLD re-chunk part of C11 left unimplemented, related to `step6-consistency/lld.md` B-2 and `step6-consistency/cross.md` B-1.
- **Exact fix:** File: `lld-unifier/chunking.md`. Current (unique):
  > 7. For each chunk, prepend the `<!-- CHUNK: ... -->` comment block and append its footer; write the master `[project-slug]-lld-master.md`, which replaces the combined `## Table of Contents` (dropped).
  
  New:
  > 7. For each chunk, prepend the `<!-- CHUNK: ... -->` comment block and append its footer. The master and chunk 00 take the combined cover's current version. Every other chunk takes the version of the newest Changes Log row whose `Chunks:` list names that chunk or one of its sections, using the canonical chunk map and heading map above. Match each per-service file to its own §7.N service block. If no later row names it, use the first build's version. For an older log with no `Chunks:` list, use the sections its change summary names; if the history cannot establish a version, flag the gap rather than silently assigning the current version. Write the master `[project-slug]-lld-master.md`, which replaces the combined `## Table of Contents` (dropped).

### B-2. A Figma-only change still has no detectable previous value

- **Where:** `lld-unifier/SKILL.md:158`; `lld-unifier/sdd-to-lld.md:56-57,195`; `lld-unifier/chunks/16-references.md:21`; `lld-unifier/TEMPLATE-COMBINED.md:575`.
- **Class / action:** B, needs the user's decision.
- **Quote:** "each BRD's chunk 14 Mockup coverage rows with the screens and use cases 14 § 17.3 cites"; the declared trigger includes "Figma links change".
- **Smallest case:** BRD MK-01 keeps its ID, screen name and UC-01, but its Figma URL changes from frame A to frame B. The BRD version stays the same because chunk 14 link updates do not bump it. LLD §17.3 still contains the same MK-01 link to `14-todo.md#mockup-coverage` and the same UC-01. §19.1 records only the BRD version, so step 3c cannot tell that the Figma URL changed. A literal run cannot perform the refresh detection it promises. The row-by-row fix of `step6-consistency/lld.md` A-4 detects ID/use-case changes but leaves this case unresolved.
- **Recommendation:** record a fingerprint of the Mockup coverage table in §19.1, then compare it on every step 3c run. This preserves the declared trigger and costs one stored value per source BRD. A hash of the whole table is conservative: any table edit offers a refresh.
- **Alternative:** treat Figma-only changes as transparent through the existing stable source link and remove Figma-only changes from the automatic refresh promise and trigger. This keeps the current templates but narrows L3's behaviour.
- **Exact recommended fixes:**
  1. File: `lld-unifier/SKILL.md`. Current (unique):
     > Chunk 14 changes bump no BRD version, so only this row-by-row reading finds them.
     
     New:
     > Chunk 14 changes bump no BRD version. Also compare the SHA-256 of its Mockup coverage table with the fingerprint recorded in 16 §19.1. Hash the complete Markdown header, separator and body lines, preserving their text and spaces. Join those lines with LF, add one final LF, and encode as UTF-8 without a BOM. Exclude surrounding prose and blank lines. A different fingerprint offers the trace refresh even when screen IDs and use cases match. An older LLD with no fingerprint offers one trace refresh to establish the baseline.
  2. File: `lld-unifier/sdd-to-lld.md`. Current (unique):
     > and each BRD's chunk 14 Mockup coverage rows with 14 §17.3, and makes one offer
     
     New:
     > and each BRD's chunk 14 Mockup coverage rows with 14 §17.3. It also compares that table's fingerprint with 16 §19.1 as SKILL.md step 3c specifies, then makes one offer
  3. File: `lld-unifier/sdd-to-lld.md`. Current (unique):
     > so a later run can see what changed.
     
     New:
     > so a later run can see what changed. In each BRD chunk 14 row, record the Mockup coverage table's SHA-256 using the normalization in SKILL.md step 3c. Update it only after an accepted refresh or a first build.
  4. Files: `lld-unifier/chunks/16-references.md` and `lld-unifier/TEMPLATE-COMBINED.md`. Current (unique in each):
     > [as of BRD v[X.X]] | `MK-NN` rows (the screen references, one per screen or flow) and their Figma links |
     
     New:
     > [as of BRD v[X.X]; Mockup coverage SHA-256: [hash]] | `MK-NN` rows (the screen references, one per screen or flow) and their Figma links |

## C. Cosmetic

None reported.

## Coverage and verification

- Read the LLD changes against HEAD and all changed passages in context, all LLD supporting files, all 20 chunk skeletons including `04-implementation-template.md` and the master, and the combined template. Checked each chunk body against its combined copy. No uncovered LLD scope remains.
- Reconciled the previous LLD findings with the decisions. Remaining or incomplete fixes are cited above: A-4, A-5, A-6, A-8, B-2, B-6 and B-9. The other prior findings were not re-reported. The C11 re-chunk gap is owned here; the cross report can refer to B-1.
- Checked step 3c's single offer, C3's wait for the SDD to record a newer BRD, and C11's section-to-chunk mapping. Checked C2's per-row sources and derived-view exceptions, C4's keys-and-relationships ERDs, C5's `Realised in` targets, Workflow routes under L2-6/C6, and C7's widened missing-outbox finding. Findings above identify the remaining contradictions and gaps.
- Checked the mapping against the current SDD source skeletons, including lineage and child-register columns, use-case traceability, per-service fields, reliability, performance, testing and ADRs. Checked the BRD master's delivery State cells, chunk 14 Downstream outputs and Mockup coverage, chunk 16 case/traceability fields, and the no-version-bump rule for chunk 14 links.
- Checked SKILL.md principle 7 and `mermaid-diagrams.md`: the templates contain 13 Mermaid blocks and 13 following `**Summary:**` slots. No Mermaid block lacks its summary slot.
- `python -B _fixtures/checkers/check_refs.py lld-unifier sdd-unifier` passed with exit 0: 240 references checked, 0 problems. The three named anchors, SDD lineage headings, and child-register columns matched. The first sandbox invocation could not resolve Python; the same read-only command succeeded with escalation.
- `git -c safe.directory=C:/Users/negat/.claude/skills diff --check HEAD -- lld-unifier` passed with exit 0. Only this report was written by this scope; no skill files or Git state were changed.
- Verified all 22 current-text/file pairs: every quoted replacement target occurs exactly once in its named file. The report is valid UTF-8 without a BOM and uses LF only.

Report: `_fixtures/notes/step6-handoffs/recheck-lld.md`.
Counts: A = 4; B = 2; C = 0. Five mechanical findings; one needs a decision.
Decision B-2: Store a normalized Mockup coverage fingerprint (recommended), or narrow the refresh trigger to treat Figma-only changes as transparent through the source link.

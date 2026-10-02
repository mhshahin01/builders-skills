# Apply and Verify

A **review session** is one tracker, from its first applied point to its
close, even when the walkthrough resumes on another day.

## Apply (per point, immediately after the decision)

1. **Enumerate affected docs before editing.** Start from the tracker's
   Target doc(s) cell, then sweep: which other chain documents restate,
   cite, count, or depend on the changed content? Include downstream BRD
   and SDD chunk files that cite the changed sections or decision IDs.
2. **Edit all affected docs in the same step.** Counts (services, phases,
   batches, milestones), ID lists, tables, and cross-citations must be
   consistent chain-wide before the point is marked Applied.
3. **Supersession notes.** When a decision overrides an earlier statement
   in another doc, state the supersession on BOTH sides rather than
   silently editing one. In a document made by brd-unifier or sdd-unifier,
   the chunks state only the settled content. The story (what was
   replaced, and why) goes in that document's `decision-log.md`, in a
   record that names the point ID and the tracker. A pre-BRD has no
   decision log: its story stays in the tracker.
4. **Update the tracker row in the same step**: Status (Applied /
   Partially applied / Rejected / Deferred) and the Decision cell stating
   what was actually done. Recompute the Progress line.
5. **Partial acceptance**: apply the accepted parts, leave declined parts
   untouched, and name the declined parts in the Decision cell.
6. **Keep the owning skill's template structure.** A BRD or SDD made by
   brd-unifier or sdd-unifier keeps the structure its skill's template
   defines:
   - the chunk files and their headers;
   - table columns and ID schemes;
   - status values (open items, use cases, registers, to-do steps);
   - gate conditions (the BRD delivery gate, the SDD e2e gate);
   - the lineage tables (Source BRDs, Child LLDs);
   - the contract registries and use-case traceability (SDD chunks 09 to
     12 and §7.3);
   - the Changes Log format, and `decision-log.md` as the home of the
     story.

   Inside that structure:
   - A decision changes content, and the change reaches every row that
     lists it, in the form the row already uses. A new event gets its
     registry rows. A new use case gets its matrix row, its owner in SDD 09,
     and its §7.3 row.
   - New `BR-n` and `AC-n` items go at the end of their list, because other
     documents cite them by position. A merged or removed use case keeps
     its row and its status; nothing is deleted.
   - A BRD stays in business language. Technical content from a decision
     goes to the BRD's Appendix § Technical Inputs for the SDD, or into the
     SDD.
   - The lineage rows, the owner's own open items (`OI-NN`, `TD-NN`), the
     gated chunks (BRD 15-17, SDD 19), and the BRD's use-case diagrams and
     flowcharts (to-do step 5) belong to the owning skill. The hand-off
     updates them (§ Hand-off). The decision record names the owner's item
     it answers.
   - An LLD is never edited. Its hand-off carries the change.
   - A pre-BRD (pre-brd-unifier), when the chain has one, keeps its
     framework chunks, headings, and tables. A decision writes Answer cells
     only, with sourced figures, and recomputes the derived values it
     affects from the formulas in pre-brd-unifier's `frameworks.md`
     (scores, sizes, the Tier 5 composite). The investor assessment
     (chunk 23) is not rewritten: the close-out notes that its verdict
     predates the change.

   When a decision needs a different structure (a new column, status value,
   gate condition, or ID scheme), apply the part that fits the current
   structure. Record the rest under Skill changes requested in the tracker,
   for the user to take to that skill, and mark the point Partially
   applied, naming that part. The options say so before the decision
   (`walkthrough-protocol.md`). A point whose remaining part is a hand-off
   is Applied; its Decision cell names that hand-off.
7. **Version at the first change.** The first content change a review
   session makes to a document bumps that document's version once and
   opens one Changes Log row naming the session and the tracker.
   - The bump follows the document's own rule: its master's VERSIONING line
     or its skill's rule for a targeted update. A document no skill
     versions (a business document) gets its in-document version bumped and
     a changelog entry in its header. A pre-BRD has no version and no
     changelog, so nothing is added to it: the tracker's Versioning block
     lists the pre-BRD chunks the session changed.
   - Every chunk the session changes, then or later, takes the new version.
     The version is not bumped again in the same session. Status, link, and
     Stale marks alone bump nothing.
   - The Changes Log row lists each point ID with the chunks or sections it
     changed, so the next skill down the chain knows what to refresh.
   - When the version is in the file name (a combined BRD or SDD), rename
     the file with the bump, and update the citations to it in the
     documents the session may edit. The owning skills repoint the lineage
     links at the hand-off.
   - Record the bump in the tracker's Versioning block.
   - A gated chunk is never edited by the review, whether its gate is open
     or shut. Apply the decision at its source and mark the gated chunk
     Stale where its skill records that. The owner refreshes it through its
     gated step after the hand-off.
     - BRD 15-17: the chunk's status line, the Downstream outputs rows of
       chunk 14, and the State cell of its row in the master's Delivery
       Chunks table.
     - SDD 19: the E2E gate line in the master, or in the cover of a
       combined SDD.

## Verify (after all points are closed)

Dispatch one fresh cleared-context subagent (`Agent`,
`subagent_type: general-purpose`). Give it:
- the tracker and every in-scope document;
- the lineage context (SKILL.md § Intake);
- for each document made by pre-brd-unifier, brd-unifier, or sdd-unifier,
  that skill's templates: its `chunks/` folder, or `TEMPLATE-COMBINED.md`
  for a combined BRD or SDD (a combined pre-BRD follows the same chunks in
  tier order). The skill folders sit next to this one.

Brief:

> All decisions in [tracker path] have been applied to [doc paths]. Hunt
> for stale remnants of those decisions: counts and enumerations that no
> longer add up; batch/phase/milestone numbers not updated everywhere;
> section and table references that resolve wrongly; phrasing that
> reflects a superseded decision; citations to renamed files; scope
> statements contradicted by an applied decision. Also check the chain
> itself:
> - a table, column, status value, ID scheme, or gate condition that no
>   longer matches the template of the skill that owns the document
>   [template paths];
> - a changed document whose version or Changes Log row does not show the
>   change;
> - a lineage row that disagrees with the version record at its other end
>   [lineage context paths].
>
> A lineage row that is behind only because this session bumped a version
> is expected. List it under "For the hand-off", not as a remnant. For
> each remnant: Where, what is stale, what it should say. Score overall
> chain consistency out of 10. Do not re-litigate the decisions
> themselves.

Fix every confirmed remnant, except lineage rows, the owner's open items,
and gated chunks: those go to the hand-off (Apply rule 6). Then append the
**Verification pass** block to the tracker: date, score, remnant count,
one line per fix. If the agent returns zero remnants on a session with
structural changes, treat it as suspect and re-dispatch once with the
stale-remnant categories spelled out.

## Close checklist (after verification)

- [ ] Each changed document has one version bump and one Changes Log row
      for this session (Apply rule 7); add the verify fixes to that row.
- [ ] Each renamed file has its citations updated in the documents the
      session may edit, and a header note that historical in-text
      citations to the old version remain valid if section numbering is
      unchanged.
- [ ] Complete the **Versioning** block in the tracker.
- [ ] Write the **Hand-offs** block (§ Hand-off).
- [ ] Present the close-out summary: points by status, structural
      decisions list, skill changes requested, files touched, new
      versions, and the hand-offs with the request to give each skill.

## Hand-off (the owning skills take the chain back)

The review changes content. The skills that own the documents re-check what
depends on it:
- the BRD's consistency check and delivery gate;
- the SDD's contract registries, §7.3, lineage, and e2e gate;
- each LLD's refresh.

Write one row per request below, in this order. Skip a row whose document
did not change; write `None` when no document changed.

1. **Each changed BRD (brd-unifier):** "update the todo: decisions from the
   business review of [the tracker's Created date] ([tracker path])".
   When the review changed a pre-BRD, a BRD in scope that was made from it
   gets this row too, naming the pre-BRD chunks that changed, even if the
   BRD itself did not change. pre-brd-unifier has no update request of its
   own, so this is the pre-BRD's only hand-off.
   - It checks the decisions already applied and closes the owner's open
     items they answer.
   - It reruns the consistency check and refreshes `14-todo.md` and the
     delivery gate; a changed diagrammed use case reopens to-do step 5.
   - It marks chunks 15-17 Stale if they exist.
2. **Each SDD whose content or source BRDs changed (sdd-unifier):**
   - when source BRDs changed: "BRD [KEY] has a new version", naming every
     changed source BRD in one request, so the SDD takes them in one update
     and one version;
   - when only the SDD changed: "the business review changed this SDD".

   Either request reruns the contract reconciliation (step 6a, §7.3
   included). It checks the Child LLDs table, where a child that read an
   older SDD version is marked out of date. It marks chunk 19 Stale where
   its rules say so.
3. **Each child LLD (lld-unifier):** "the SDD has a new version". It
   refreshes the LLD chunks mapped from the SDD chunks the Changes Log
   names; a plain run also finds the newer SDD, through its SDD version
   check. When a source BRD's use cases, test cases, or screens changed,
   also "refresh the trace".

Gated chunks (BRD 15-17, SDD 19) refresh through their owners once their
gates are open again. They are a note in the close-out, not a hand-off row.

Each row starts as `To run` and turns `Done` on the user's word, or on the
owner's own record:
- BRD: a consistency check run recorded in chunk 14 after the review.
- SDD: a Reconciled date after the review.
- LLD: 16 §19.1 naming the new SDD version.

Offer to start the first row. Each row runs only on the user's word, as that
skill's own request with its own stops.

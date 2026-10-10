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
3. **The story of each decision.** In a document made by brd-unifier or
   sdd-unifier, the chunks state only the settled content. Each point
   that changes the document gets one record in its `decision-log.md`,
   § Business review register (the log is created on first use, as that
   skill says): the point ID, the tracker, what was decided, what it
   replaced, and a `Rule home:` link to the section that now states it.
   When the answer policy decided the point, the record names the policy
   with its decider label and links the tracker, the policy's only home
   (SKILL.md § Answer policy, rule 7). A
   record that replaces an earlier one says so, and the
   earlier record stays as it is. In any other document, a decision that
   overrides an earlier statement in another doc states the supersession
   on BOTH sides rather than silently editing one. A pre-BRD has no
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
     lists it, in the form the row already uses. A new event a decision
     sets in an SDD gets its registry rows. A new use case gets its BRD
     matrix row.
   - The review edits an SDD only where a decision targets it or makes its
     text wrong. Deriving new BRD content into the SDD (for a new use case,
     its owner in SDD 09 and its §7.3 row) goes to the SDD hand-off
     (§ Hand-off, item 2), which the point's Decision cell names.
   - New `BR-n` and `AC-n` items go at the end of their list, because other
     documents cite them by position. A merged or removed use case keeps
     its row and its status; nothing is deleted.
   - A BRD stays in business language. Technical content from a decision
     goes to the BRD's Appendix § Technical Inputs for the SDD, or into the
     SDD. References too: outside Appendix § Technical Inputs, the BRD's
     chunks never cite SDD IDs (such as `API-NN` or `ADR-NN`) or the SDD's
     design values; where the link matters, the BRD's `decision-log.md`
     records it.
   - The lineage rows, the owner's own open items (`OI-NN`, `TD-NN`), the
     gated chunks (BRD 15-17, SDD 19), and the BRD's use-case diagrams and
     flowcharts (to-do step 5) belong to the owning skill. Their owners
     update them after the hand-off (§ Hand-off); the review only sets a
     gated chunk's Stale mark (rule 7). The decision record names the
     owner's item it answers.
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
   is Applied; its Decision cell names that hand-off. A question the
   decision leaves for the document's owner is such a part: the decision
   record states it as its open remainder and names its kind (a choice for
   this document's owner, a fact, or a question for a BRD owner or a
   provider), and the hand-off asks the owner to record it under its own
   rules: in an SDD, an open item only for a design choice the decision
   leaves to the SDD owner, while a fact, a BRD owner's question, or a
   provider's question stays a clarification marker; an open item in an
   LLD; in a BRD, a to-do item with its owner and source, plus an open item
   when it needs a business choice. For a pre-BRD, which has no decision
   log, the tracker's Decision cell states it, and the BRD hand-off (item 1)
   records it in the BRD made from that pre-BRD. In a BRD or SDD, the
   session may also write the open remainder where it applies, as the
   owning skill's clarification marker (`[NEEDS CLARIFICATION: ...]`), so
   the gap stays visible in the text; in an SDD it writes one for each
   remainder that is not a design choice, since that remainder gets no
   open item. The decision record and the
   hand-off name each marker the session added, and the owner's update
   registers it (in a BRD, the to-do item cites it). Until that hand-off
   runs, the marker has no to-do item yet; that is expected.
7. **Version at the first change.** The first content change a review
   session makes to a document bumps that document's version once and
   opens one Changes Log row naming the session and the tracker.
   - The bump is one minor step and follows the owning skill's version
     rule (BRD: brd-unifier's `delivery-chunks.md` § Refresh triggers,
     Version; SDD: sdd-unifier's SKILL.md § Output conventions, Versions).
     A BRD or SDD whose cover Status reads `Approved` also gets Status
     `In Review` and the change date on its cover (BRD: same file,
     § Refresh triggers, Cover status; SDD: sdd-unifier's SKILL.md
     § Output conventions, Cover status).
     A document no skill versions (a business document) gets its
     in-document version bumped and a changelog entry in its header. A
     pre-BRD has no version and no changelog, so nothing is added to it:
     the tracker's Versioning block lists the pre-BRD chunks the session
     changed.
   - Every chunk whose content the session changes, then or later, takes
     the new version. Every other chunk keeps its version, a gated chunk
     included. The version is not bumped again in the same session.
     Status, link, and Stale marks alone bump nothing.
   - The Changes Log row lists each point ID with the chunks it changed
     (sections only in a combined document) and ends with the owning
     skill's `Chunks:` list, so the next skill down the chain knows what to
     refresh. A point that changes only a status (no document text, for
     example a cover Status mark) is named in the row's summary with that
     status and kept out of the `Chunks:` list. Its Reviewed By and
     Approved By cells (Reviewed/Approved By in a BRD) stay empty, whatever this review's answer policy names: the
     owning skill fills them when the new version is reviewed and approved,
     with the approver the user names or, when the answer policy of the
     owning skill's own run names an Approver stand-in, with that
     stand-in's label (SKILL.md § Answer policy), under that skill's own
     sign-off conditions. An Approver stand-in counts under that run's
     policy, not this review's, and signs a version this session changed
     only after the session has closed with every hand-off `Done`. The
     session has closed when the review's tracker has its **Hand-offs**
     block and no point in it is `Pending` or `Decided`. That skill checks
     each row's `Done` evidence (§ Hand-off) itself, whatever the tracker
     cell reads, since owners never write the tracker.
   - When the version is in the file name (a combined BRD or SDD), rename
     the file with the bump, and update the citations to it in the
     documents the session may edit, the links in a combined BRD's
     `14-todo.md` and `17-for-ppt.md` included (a link is not content, so
     a gated chunk's links change like its Stale mark). The owning skills
     repoint the lineage links at the hand-off.
   - Record the bump in the tracker's Versioning block.
   - A gated chunk's content is never edited by the review, whether its
     gate is open or shut. Apply the decision at its source. If the gated
     chunk exists, set its state to Stale where its skill keeps that state;
     that is a status mark, not an edit, and nothing else in the chunk
     changes except the links a file rename repoints (above). The owner
     refreshes it through its gated step after the hand-off.
     - BRD 15-17: the chunk's status line, its Downstream outputs row in
       chunk 14, and its State cell in the master's Delivery Chunks table
       (brd-unifier's `delivery-chunks.md` § The delivery gate, Re-lock).
     - SDD 19: the E2E gate line in the master, or in the cover of a
       combined SDD; chunk 19 itself is not touched.

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
> is expected, and so is new BRD content that an SDD has not derived yet
> (Apply rule 6). List them under "For the hand-off", not as remnants. For
> each remnant: Where, what is stale, what it should say. Score overall
> chain consistency out of 10. Do not re-litigate the decisions
> themselves.

Fix every confirmed remnant under the Apply rules, as part of its point's
apply, except lineage rows, new BRD content an SDD has not derived yet,
and the owner's open items, which go to the hand-off (Apply rule 6), and gated chunks, which keep their Stale mark and a
note in the close-out (Apply rule 7). A remnant of the same kind found while
confirming is fixed the same way and marked as found while confirming. A
remnant with two or more possible fixes that would make a document say different
things is put to the user with the options and a recommendation, as in the
walkthrough, unless the run's answer policy takes the recommendation
(SKILL.md, Core principle 4 and § Answer policy). Then append the
**Verification pass** block to the tracker: date, the hunt's score (taken before the
fixes; there is no second hunt), remnant count, one line per remnant (its
fix, the hand-off that takes it, the close-out note of a gated chunk, or
why it was rejected). If the agent returns zero remnants on a session with
major structural decisions (tracker), treat it as suspect and re-dispatch
once with the stale-remnant categories spelled out.

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
      decisions list, the rejections an answer policy took, skill changes requested, the files the session touched, new
      versions, and the hand-offs with the request to give each skill.

## Hand-off (the owning skills take the chain back)

The review changes content. The skills that own the documents re-check what
depends on it:
- the BRD's consistency check and delivery gate;
- the SDD's contract registries, §7.3, lineage, and e2e gate, and a
  delta review of the changed chunks;
- each LLD's refresh, which ends with a delta review.

Write one row per request below, in this order. Skip a row whose document
did not change; write `None` when no document changed.

1. **Each changed BRD (brd-unifier):** "update the todo: decisions from the
   business review of [the tracker's Created date] ([tracker path])".
   When the review changed a pre-BRD, a BRD in scope that was made from it
   gets this row too, naming the pre-BRD chunks that changed, even if the
   BRD itself did not change. pre-brd-unifier has no update request of its
   own, so this is the pre-BRD's only hand-off.
   - It checks the decisions already applied, closes the owner's open
     items they answer, and records each open remainder their decision
     records state (for a pre-BRD point, its Decision cell) as a to-do
     item for each distinct question in it, with its owner and source, plus an open item when it needs a
     business choice.
   - It reruns the consistency check and refreshes `14-todo.md` and the
     delivery gate; a changed diagrammed use case reopens to-do step 5.
   - It keeps chunks 15-17 that exist Stale in all three places (the
     review set the mark, Apply rule 7) until their gate is open again.
2. **Each SDD whose content or source BRDs changed (sdd-unifier):**
   - when source BRDs changed: "BRD [KEY] has a new version, after the
     business review of [the tracker's Created date] ([tracker path])",
     naming every changed source BRD in one request. The SDD takes them
     in one update with at most one more version; that update also runs
     the checks for the changes the review made to the SDD itself, whose
     bump stands;
   - when only the SDD changed: "the business review changed this SDD".

   Either request reruns the contract reconciliation (step 6a, §7.3
   included). It reads the tracker, closes the SDD's open items the
   review's decisions answer, and derives into the SDD the new BRD content
   the review left to it (Apply rule 6). Of the open remainders their
   decision records state, it raises an open item only for a design choice
   a decision leaves to the SDD owner; a fact, a BRD owner's question, or a
   provider's question stays a clarification marker. It checks the Child
   LLDs table, where a child that reflects an older SDD version is marked
   out of date. It
   keeps chunk 19's Stale mark (Apply rule 7) and sets it for its own
   changes where its rules say so.
3. **Each child LLD (lld-unifier):** "the SDD has a new version". Its
   SDD and BRD version check (step 3c) reads the `Chunks:` lists of the
   SDD Changes Log rows since the version the LLD recorded, and the
   source BRD versions, and makes one offer: the LLD chunks mapped from
   those SDD chunks, plus the trace when a source BRD's use cases, test
   cases, or screens changed. It is one update with one version. A
   plain run finds the same changes through that check.

Gated chunks (BRD 15-17, SDD 19) refresh through their owners once their
gates are open again. They are a note in the close-out, not a hand-off row.

Each row starts as `To run`. A hand-off row is `Done` when the user said it
ran, or when the owner's own record shows it, whatever the tracker cell
reads (owners never write the tracker):
- BRD: a consistency check run in chunk 14 whose Trigger names the review.
- SDD: a Reconciled entry after the review, with its step 6a order
  evidence (a date alone does not prove the order).
- LLD: 16 §19.1 naming the SDD version the review produced.

A record counts only when the owning skill wrote it after the review (a
Changes Log row below the review's row, a chunk 14 run whose Trigger names
the review, or an action entry saying the hand-off was taken), never the
review's own entries in the owner's registers. The session has closed when
the tracker has its **Hand-offs** block and no point in it is `Pending` or
`Decided`; the owning skills restate these conditions for their sign-off.

Offer to start the first row. Each row runs only on the user's word, or on
an answer policy that names the hand-offs (SKILL.md § Answer policy), as
that skill's own request with its own stops.

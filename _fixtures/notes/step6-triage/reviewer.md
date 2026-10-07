# Triage: reviewer

Judged against the files as they are now: the tree is clean on `fix/unifier-fix-round` at de3baec, which holds option (c) (5516e05) and the B15 change. Line numbers below are from those files. Paths without a skill folder are in `business-reviewer-unifier/`.

## Summary

**Status (32 items).**
- Fixed 7: I1, W-5, W-6, W-8, V-2, V-3, V-4.
- Partly fixed 8: W-4, W-7, A7, V-1, V-5, V-7, V-9, V-10.
- Present 16: K1, K2, K3, K4, K5a, K5b, K5c, K6, W-1, W-2, W-3, W-9, W-10, V-6, V-8, V-11.
- Not reproducible 0.
- Not a skill issue 1: W-P.

**Class (24 Present or Partly fixed).**
- M 5: K1, K5b, W-2, V-9, V-10.
- S 14: K2, K5a, K5c, W-1, W-3, W-7, W-9, A7, V-1, V-5, V-6, V-7, V-8, V-11.
- D 5: K3, K4, K6, W-4, W-10.

**New items 5:** N-1 (M), N-2 (M), N-3 (M), N-4 (S), N-5 (D).

**D items.**
- K3: the BO charter assumes a product sold to customers. Recommended: one sentence that reads revenue, pricing, and churn as the business case of an in-house system.
- K4: every reviewer hit the 12-finding cap. Recommended: keep the cap, most material first, plus a closing count of what each reviewer left out.
- K6: the tracker drops each finding's Why and Direction. Recommended: a write-once companion file, `review-panel-findings.md`.
- W-4: a point that ends as an open question for the document's owner (Applied or Deferred, and who raises the open item). Recommended: Applied; the question is the decision record's open remainder, and the owner raises it as an open item at the hand-off (one clause in the brd-unifier and sdd-unifier request rows).
- W-10: the BRD template has no home for go-live and launch gates. Recommended: no template change now; such a need goes under Skill changes requested.
- N-5: sdd-unifier says "BRD <KEY> has a new version" covers the review hand-off, but that path neither reads the tracker nor closes the open items the review answered. Recommended: one update that runs both, with one version.

**Flagged for other checkers (not designed here).**
- Bump size, and the per-update reading of `sdd-unifier/chunks/sdd-master.md:7` against "not bumped again in the same session" (W-6, V-1).
- Who sets the Stale mark on BRD 15-17 and SDD 19 (the review at apply, the hand-off, or both), brd-unifier's "Do not write 15, 16, or 17", and the master's Delivery Chunks State cell (V-9).
- The second SDD bump when the new-version request follows a review (N-5).

## Items

### I1: Default scope against an LLD in the project root
- Status: Fixed
- Evidence: SKILL.md:96-99 "LLD folders are not reviewed. When an SDD in scope lists child LLDs, each LLD's version record goes to the reviewers as lineage context only: its master, `00-metadata.md` (Changes Log), and `16-references.md` § 19.1 (the SDD version it read)." SKILL.md:79-80 "An LLD is never edited." The named parts exist in the LLD template: lld-unifier/chunks/00-metadata.md:38 "## Changes Log", lld-unifier/chunks/16-references.md:11 "## 19.1 Source Documents". The root README diagram (README.md:25-27) points the reviewer at the pre-BRD, BRD, and SDD only, which now agrees with the skill.
- Class: n/a
- Fix: none
- Files: -

### K1: Universal rule 3 names fields the schema does not use
- Status: Present
- Evidence: reviewer-personas.md:11-12 "3. **Output schema.** Per `panel-orchestration.md`: Reviewer, Concern (short), Where, Why it matters, Suggested direction." The schema names `Reviewer`, `Concern`, `Where`, `Why`, `Direction` (panel-orchestration.md:22-26), and the reviewer gets its charter "copied verbatim" plus "The finding schema below", not panel-orchestration.md (panel-orchestration.md:13-17).
- Class: M (the schema the reviewer actually receives is the one that holds)
- Fix: reviewer-personas.md

current:
```text
3. **Output schema.** Per `panel-orchestration.md`: Reviewer, Concern
   (short), Where, Why it matters, Suggested direction.
```
new:
```text
3. **Output schema.** The finding schema given with this charter:
   Reviewer, Concern, Where, Why, Direction (`panel-orchestration.md`).
```
- Files: reviewer-personas.md

### K2: SME charter keeps PropTech examples and points the reviewer at orchestrator rules
- Status: Present
- Evidence: reviewer-personas.md:34 "You are an experienced operator in **[DOMAIN]** (see template rules below)." reviewer-personas.md:42-45 "Domain conventions the product contradicts (deposit norms, inspection practice, communication channel expectations)." and "Edge actors the docs forget (secondary residents, contractors, developer handover roles, association boards)." reviewer-personas.md:47 "### SME charter template rules" holds intake rules and the Propifive example (:49-58). panel-orchestration.md:13-14 sends the charter "copied verbatim".
- Class: S (the pointer is M; the example wording is the choice)
- Fix: recommended: domain-neutral examples, and a heading that marks the subsection as orchestrator-only. Why: the charter goes verbatim to every SME whatever the domain; property examples prime the wrong frame, and intake rules are not the reviewer's.

Edit 1, reviewer-personas.md: current "**[DOMAIN]** (see template rules below)." / new "**[DOMAIN]**."

Edit 2, reviewer-personas.md

current:
```text
- Domain conventions the product contradicts (deposit norms, inspection
  practice, communication channel expectations).
```
new:
```text
- Domain conventions the product contradicts (the norms, inspections, and
  communication channels operators in this domain expect).
```

Edit 3, reviewer-personas.md

current:
```text
- Edge actors the docs forget (secondary residents, contractors, developer
  handover roles, association boards).
```
new:
```text
- Edge actors the docs forget (secondary users, contractors, handover
  roles, oversight bodies).
```

Edit 4, reviewer-personas.md: current "### SME charter template rules" / new "### SME domain rules (for the orchestrator, not copied into the charter)"
- Files: reviewer-personas.md

### K3: BO charter assumes a product sold to customers
- Status: Present
- Evidence: reviewer-personas.md:18 "You are the founder/owner who has to fund, sell, and defend this product." :21 "Missing or hand-waved revenue model, pricing, packaging." :28 "Churn, retention, and lock-in: what keeps a customer after year one?" In step 5 the product was a retailer's own system, and the BO turned these into a cost case and a commercial case (BO-08, BO-09).
- Class: D (a persona charter's scope)
- Options:
  - A. One sentence after reviewer-personas.md:18: "When the product is the customer's own system rather than one sold to others, read revenue, pricing, and churn as its business case: who funds it, what it costs and saves, and whether the people meant to use it will." Tradeoff: one charter covers both kinds of product; the charter grows by one sentence.
  - B. Intake records whether the product is sold or used in-house, and the orchestrator sends one of two BO charters. Tradeoff: sharper framing; a fourth intake question (Intake allows at most three, SKILL.md:90) and two charters to keep in step.
  - C. No change. Tradeoff: nothing to maintain; the BO keeps raising pricing and packaging questions that do not apply, or reframes them on its own, as in step 5.
- Recommendation: A, because one sentence fixes the frame without a new intake question.
- Files: reviewer-personas.md (BO section)

### K4: Every reviewer returned exactly 12, the top of the cap
- Status: Present
- Evidence: panel-orchestration.md:49 "> Return 5 to 12 findings using exactly this schema per finding: [schema]." All five reviewers returned exactly 12 (step5-findings.md:7).
- Class: D (review policy: how many findings)
- Options:
  - A. Keep 5 to 12 as is. Tradeoff: a bounded walkthrough (60 raw findings gave 39 points and about 3 hours in step 5); nobody knows what the cap cut.
  - B. Keep the cap; ask for the most material findings first and a closing line with how many more the reviewer left out and their areas; the merge report shows those counts, so the user can ask for more. Tradeoff: the walkthrough keeps its length and the cut becomes visible; one more line per reviewer.
  - C. Raise the cap (for example 5 to 20). Tradeoff: more coverage; up to 100 raw findings and a much longer walkthrough.
- Recommendation: B, because it keeps the walkthrough bounded and shows the user what the cap cut.
- Files: panel-orchestration.md (Reviewer prompt skeleton, Merge rule 5), SKILL.md (step 3 summary)

### K5a: "More senior framing" has no seniority order
- Status: Present
- Evidence: panel-orchestration.md:67 "Keep the more senior framing as the primary; note "merged with X-NN""
- Class: S
- Fix: recommended: the rule the step 5 merge used (step5-plan.md:39). Why: it only decides which ID labels a merged row, and the run applied it to 15 merged rows without trouble.

panel-orchestration.md: current "Keep the more senior framing as the primary;" / new "The primary is the finding that covers most of the merged set (on a tie, the persona listed first in SKILL.md);"
- Files: panel-orchestration.md

### K5b: "Both sides" against a tracker that lists only the surviving row
- Status: Present
- Evidence: SKILL.md:134 "(record "merged with X-NN" on both sides)". panel-orchestration.md:67-69 "note "merged with X-NN" in both concerns (the absorbed ID still appears in the tracker row of the primary)". tracker-schema.md:45-47 "Merged findings noted inside the Concern cell of the surviving row ("merged with PA-05") and the absorbed row is not listed separately." panel-orchestration.md:71-72 "Merged-away findings keep their ID only as a reference inside the surviving row."
- Class: M (the tracker template and Merge rule 3 agree; "both sides" has no second side in the tracker)
- Fix:

Edit 1, panel-orchestration.md

current:
```text
   in both concerns (the absorbed ID still appears in the tracker row of
   the primary).
```
new:
```text
   in the surviving row's Concern cell; an absorbed finding gets no row of
   its own.
```

Edit 2, SKILL.md: current "(record "merged with X-NN" on both sides)" / new "(the surviving row notes "merged with X-NN")"
- Files: panel-orchestration.md, SKILL.md

### K5c: No rule for a finding that two decisions resolve
- Status: Present
- Evidence: panel-orchestration.md:66 "2. Two findings merge when they would be resolved by the same decision." Nothing covers a finding with a second part that another point resolves. Step 5 had seven (step5-findings.md:21) and noted them in the Concern cell, for example BO-04 "in-branch channel: see SME-04" (run tracker).
- Class: S
- Fix: recommended: the run's convention. Why: it keeps the ID scheme and the columns (splitting a finding into two rows would not), and it worked on seven findings.

panel-orchestration.md (adds a continuation of rule 2 just before rule 3)

current:
```text
3. Assign IDs `<ROLE>-NN` in each reviewer's own sequence (BO-01, BO-02,
```
new:
```text
   A finding with a part that another point's decision resolves goes under
   the point of its main part, and that row's Concern cell adds
   "<part> part: see X-NN".
3. Assign IDs `<ROLE>-NN` in each reviewer's own sequence (BO-01, BO-02,
```
- Files: panel-orchestration.md

### K6: The tracker keeps no Why or Direction
- Status: Present
- Evidence: tracker-schema.md:21 "| ID | Reviewer | Concern (short) | Target doc(s) | Status | Decision |". `Why` and `Direction` exist only in the raw findings (panel-orchestration.md:25-26), and no file keeps those after the panel. Step 5 handed them to the walkthrough agent to stand in for same-session memory (step5-plan.md:49).
- Class: D (the tracker's columns or file layout)
- Options:
  - A. A write-once companion file next to the tracker, `review-panel-findings.md`: every raw finding in the schema, grouped under the point it ended in; the tracker header links it; the walkthrough reads a point's findings before presenting it. Tradeoff: the tracker stays a compact status record (51 KB in step 5); a second file must travel with the tracker.
  - B. The same findings as a section at the end of the tracker. Tradeoff: one file, as Core principle 3 says; the tracker grows by about 95 KB (step 5's raw findings) and is harder to read.
  - C. Why and Direction columns in the tracker table. Tradeoff: one file; cells become paragraphs, and the restated table no longer fits the walkthrough's compact form.
  - D. No change. Tradeoff: nothing new; a resumed walkthrough rebuilds every issue from the documents and loses the reviewers' reasoning.
- Recommendation: A, because the tracker stays readable while the reviewers' evidence survives a new session.
- Files: tracker-schema.md (header link and one rule), SKILL.md (steps 3 and 4, Output conventions), panel-orchestration.md (Merge rules: write the file), walkthrough-protocol.md (contract item 4: Issue and Why start from the point's findings), README.md of this skill (Outputs), root README.md (stage table "It writes", line 38)

### W-1: Walkthrough order is "the user's choice" but no file says to ask
- Status: Present
- Evidence: panel-orchestration.md:73-74 "Walkthrough order may differ (user's choice); the tracker order is stable." Neither SKILL.md § 4 nor walkthrough-protocol.md says whether or when to ask.
- Class: S
- Fix: recommended: tracker order by default, offered once when the walkthrough starts (what the step 5 agent did, walkthrough-log.md:20). Why: one question, asked once, keeps a stable default; the rule goes in the walkthrough contract, which a resumed walkthrough reads.

Edit 1, walkthrough-protocol.md

current:
```text
   N has a recorded decision.
```
new:
```text
   N has a recorded decision. Points go in tracker order unless the user
   picks another; offer that choice once, when the walkthrough starts.
```

Edit 2, panel-orchestration.md

current:
```text
   differ (user's choice); the tracker order is stable.
```
new:
```text
   differ (`walkthrough-protocol.md`, item 1); the tracker order is stable.
```
- Files: walkthrough-protocol.md, panel-orchestration.md

### W-2: "Compact table" in the contract, one line in the worked example
- Status: Present
- Evidence: walkthrough-protocol.md:14-15 "Restate the tracker at each step as a compact table: ID, short concern, status." SKILL.md:144 "Tracker table restated at each step (ID, concern, status)." The worked example at walkthrough-protocol.md:46-47 is one line: "> **Tracker:** BO-01 Applied | BO-02 Applied | **BO-03 current** |".
- Class: M (the contract and SKILL.md both say table)
- Fix: walkthrough-protocol.md

current:
```text
> **Tracker:** BO-01 Applied | BO-02 Applied | **BO-03 current** |
> BO-04 Pending | ...
```
new:
```text
> **Tracker:**
>
> | ID | Concern | Status |
> |---|---|---|
> | BO-01 | Revenue model hand-waved | Applied |
> | BO-02 | Purchase driver lands in a later phase | Applied |
> | **BO-03** | **Three-market simultaneous launch** | **Current** |
> | BO-04 | ... | Pending |
```
- Files: walkthrough-protocol.md

### W-3: "Security-related" is undefined
- Status: Present
- Evidence: walkthrough-protocol.md:33-35 "6. **Security-related points** get a first-principles explanation (what the mechanism is, what it protects against, what breaks without it) before the options." SKILL.md:149 "Security topics get first-principles explanations before the decision ask."
- Class: S
- Fix: recommended: reuse the areas of the Security add-on (reviewer-personas.md:107-108). Why: the skill already defines security scope there, so the panel and the walkthrough use one list.

walkthrough-protocol.md

current:
```text
6. **Security-related points** get a first-principles explanation (what
```
new:
```text
6. **Security-related points** (the issue or an option touches trust
   boundaries, authentication or authorization, personal data and its
   retention, secrets, tenant isolation, or abuse cases) get a
   first-principles explanation (what
```
- Files: walkthrough-protocol.md

### W-4: Applied or Deferred for a point that becomes the owner's open item
- Status: Partly fixed
- Evidence: fixed part: apply-and-verify.md:70-71 "A point whose remaining part is a hand-off is Applied; its Decision cell names that hand-off." apply-and-verify.md:51-55 "the owner's own open items (`OI-NN`, `TD-NN`) ... belong to the owning skill. The hand-off updates them (§ Hand-off). The decision record names the owner's item it answers." Open part: nothing covers a decision that leaves the question open, and every hand-off only closes items: apply-and-verify.md:173-174 "It checks the decisions already applied and closes the owner's open items they answer."; brd-unifier/SKILL.md:303 "the open items they answer are closed through the step 8 mechanics"; sdd-unifier/SKILL.md:344 "close the open items the review's decisions answer". In step 5 most points ended this way (REFUNDS open items went from 1 to 32).
- Class: D (a hand-off between skills)
- Options:
  - A. The review raises the new open item itself, in the owner's register and format (BRD chunk 13 or 14, SDD chunk 18), naming the point; the point is Applied and its Decision cell names the item. Tradeoff: the owner's register shows the question at once; the review writes into a register Apply rule 6 gives to the owner and assigns the owner's IDs outside the owner's loop.
  - B. The decision record states the question as its open remainder (both owners' templates already say "Open remainder is stated here, never in the chunks": brd-unifier/decision-log.md:44, sdd-unifier/decision-log.md:67); the point is Applied and its Decision cell names the hand-off; the hand-off raises an open item for each open remainder. Tradeoff: keeps the (c) ownership line and reuses the existing "remaining part is a hand-off" status; one clause more in each owner's request row (CROSS-SKILL). The BRD's gate stays shut until the hand-off anyway, since any content change reopens to-do step 2 (brd-unifier/delivery-chunks.md:419, G2).
  - C. Such a point is Deferred, with the owner named in the reason. Tradeoff: no new rule; but Deferred needs the user's explicit word (SKILL.md:203-204), and nothing carries the question into the owner's register.
- Recommendation: B, because the owner's open items stay with the owner and no new status is needed.
- Files: apply-and-verify.md (Apply rule 6; Hand-off items 1 and 2), brd-unifier/SKILL.md step 10 "update the todo" row (CROSS-SKILL), sdd-unifier/SKILL.md step 10 "the business review changed this SDD" row (CROSS-SKILL); with N-5 option A, the new-version path as well.

### W-5: "Chain-wide" against document gates, and whether the child LLD is in the chain
- Status: Fixed
- Evidence: apply-and-verify.md:91-93 "A gated chunk is never edited by the review, whether its gate is open or shut. Apply the decision at its source and mark the gated chunk Stale where its skill records that." apply-and-verify.md:56 "An LLD is never edited. Its hand-off carries the change." SKILL.md:96 "LLD folders are not reviewed." The definition of Applied that still says "every affected document" is N-1.
- Class: n/a
- Fix: none
- Files: -

### W-6: Versioning deferred to verify against the documents' bump-on-change rules
- Status: Fixed
- Evidence: apply-and-verify.md:72-74 "The first content change a review session makes to a document bumps that document's version once and opens one Changes Log row naming the session and the tracker." SKILL.md:156-157 "bump a document's version at its first change in the session". Flag for the version-family checker: sdd-unifier/chunks/sdd-master.md:7 "When any chunk is updated, bump the SDD version in this master and in the updated chunk(s)." read literally bumps per update, while apply-and-verify.md:82 says "The version is not bumped again in the same session." The stale opening line of SKILL.md is N-3.
- Class: n/a
- Fix: none
- Files: -

### W-7: Must each document's own decision log carry the decision
- Status: Partly fixed
- Evidence: apply-and-verify.md:15-21 (rule 3) sends "The story (what was replaced, and why)" to `decision-log.md`, but only under "When a decision overrides an earlier statement". apply-and-verify.md:37-38 lists "`decision-log.md` as the home of the story", and :54-55 "The decision record names the owner's item it answers" presumes a record for every decision. The owners make it the single home of every decision story (brd-unifier/decision-log.md:3, sdd-unifier/decision-log.md:3), and their supersession form is one-sided: brd-unifier/decision-log.md:11 "a superseded decision keeps its record, and the later record says it supersedes the earlier one." (same in sdd-unifier/decision-log.md:11).
- Class: S
- Fix: recommended: one record per point in each brd-unifier or sdd-unifier document it changes, in the owners' one-sided supersession form; "both sides" stays for the other documents. Why: it follows the owners' decision-log rules, which the hand-off reads, and it is what the step 5 walkthrough did.

apply-and-verify.md

current:
```text
3. **Supersession notes.** When a decision overrides an earlier statement
   in another doc, state the supersession on BOTH sides rather than
   silently editing one. In a document made by brd-unifier or sdd-unifier,
   the chunks state only the settled content. The story (what was
   replaced, and why) goes in that document's `decision-log.md`, in a
   record that names the point ID and the tracker. A pre-BRD has no
   decision log: its story stays in the tracker.
```
new:
```text
3. **The story of each decision.** In a document made by brd-unifier or
   sdd-unifier, the chunks state only the settled content. Each point
   that changes the document gets one record in its `decision-log.md`
   (created on first use, as that skill says): the point ID, the tracker,
   what was decided, and what it replaced. A record that replaces an
   earlier one says so, and the earlier record stays as it is. In any
   other document, a decision that overrides an earlier statement in
   another doc states the supersession on BOTH sides rather than
   silently editing one. A pre-BRD has no decision log: its story stays
   in the tracker.
```
- Files: apply-and-verify.md

### W-8: No rule for changes to structures other skills own
- Status: Fixed
- Evidence: apply-and-verify.md:31-36 lists "table columns and ID schemes", "status values (open items, use cases, registers, to-do steps)", "gate conditions (the BRD delivery gate, the SDD e2e gate)", "the lineage tables (Source BRDs, Child LLDs)", and "the contract registries and use-case traceability". apply-and-verify.md:65-67 "When a decision needs a different structure (a new column, status value, gate condition, or ID scheme), apply the part that fits the current structure. Record the rest under Skill changes requested". The E4 reconciliation goes to the hand-off: apply-and-verify.md:184-185 "Either request reruns the contract reconciliation (step 6a, §7.3 included)."
- Class: n/a
- Fix: none
- Files: -

### W-9: "Major structural decisions" is a judgement call
- Status: Present
- Evidence: tracker-schema.md:73-75 "**Major structural decisions** lists only decisions that changed the shape of the plan (phase moves, reclassifications, deployment-model corrections), not every applied edit." Since (c), "structure" also means a template structure (apply-and-verify.md:27-29; tracker-schema.md:70-72, Skill changes requested), and step 5 listed two gate changes (G6, E3) as structural decisions.
- Class: S
- Fix: recommended: a concrete test, and a clause that keeps it apart from template structure. Why: two readers then pick the same decisions.

tracker-schema.md

current:
```text
  corrections), not every applied edit.
```
new:
```text
  corrections, or a use case, service, event, or objective added, removed,
  or narrowed), not every applied edit, and not a template structure (that
  goes under Skill changes requested).
```
- Files: tracker-schema.md

### W-10: Go-live and launch gates have no home in the BRD template
- Status: Present (in brd-unifier's template; the reviewer now routes the need)
- Evidence: the reviewer side: apply-and-verify.md:65-67 (a new gate condition goes under Skill changes requested). The template still has no home: the delivery gate ends at G5 (brd-unifier/delivery-chunks.md:36 "| G5 | To-do step 5 is `Complete` |"), and the only sign-off is BAT's (brd-unifier/chunks/16-uat-bat-test-cases.md:130 "**Exit criteria (BAT sign-off):**").
- Class: D (a gate, or a new template home)
- Options:
  - A. No template change. A decision that needs a go-live or launch gate goes under Skill changes requested; launch conditions stay as dependencies (chunk 02) and the BAT exit criteria (chunk 16). Tradeoff: nothing new to maintain; go-live conditions have no single home.
  - B. A sign-off condition in the BRD delivery gate (a G6: the current version's Changes Log row is approved). Tradeoff: delivery chunks wait for sign-off in every BRD; changes a gate (brd-unifier delivery-chunks.md, the chunk 14 template, SKILL.md, README).
  - C. A "Rollout and go-live" home in the BRD (go-live criteria, rollout waves, owner), checked by the consistency check. Tradeoff: also covers step 5's rollout gap (BO-12); a new section in the chunk map, TEMPLATE-COMBINED.md, and the merge and re-chunk maps.
- Recommendation: A for now, because one fixture run is thin evidence, (c) already routes the need to the user, and B or C changes every BRD.
- Files: none for A

### A7: BRD open items and decision-log records cite SDD internals
- Status: Partly fixed
- Evidence: fixed part: apply-and-verify.md:48-50 "A BRD stays in business language. Technical content from a decision goes to the BRD's Appendix § Technical Inputs for the SDD, or into the SDD." The review no longer writes the owner's open items (apply-and-verify.md:51-53). Open part: nothing says whether references count. brd-unifier/SKILL.md:84 bars technical terms "anywhere in the body", which leaves out the companion `decision-log.md`.
- Class: S
- Fix: recommended: references stay out of the BRD's chunks (except Appendix § Technical Inputs) and may sit in its `decision-log.md`. Why: it follows the scope of brd-unifier principle 2 (the body), and the decision story keeps its trace to the SDD.

apply-and-verify.md

current:
```text
     goes to the BRD's Appendix § Technical Inputs for the SDD, or into the
     SDD.
```
new:
```text
     goes to the BRD's Appendix § Technical Inputs for the SDD, or into the
     SDD. References too: outside Appendix § Technical Inputs, the BRD's
     chunks never cite SDD IDs (such as `API-NN` or `CL-NN`) or the SDD's
     design values; where the link matters, the BRD's `decision-log.md`
     records it.
```
- Files: apply-and-verify.md

### W-P: The PA-11 edit made before its decision
- Status: Not a skill issue
- Evidence: the rule is stated in four places: SKILL.md:66-67 "**Nothing is applied without an explicit decision.** A recommendation is not an approval."; walkthrough-protocol.md:9-10 "Do not present point N+1 until point N has a recorded decision."; walkthrough-protocol.md:39-40 "After the decision: apply chain-wide"; SKILL.md:196 "Never applies a Pending point." The breach came from one agent playing both the skill and the user, which knew the answer in advance (walkthrough-log.md:2825 "for this point the SDD edits were made before this log entry was written").
- Class: n/a
- Fix: none in the skill. For the rerun: an agent that plays both roles knows each answer in advance, so a breach like this measures the harness, not the text.
- Files: -

### V-1: Versioning checklist: document or chunk, gated chunks, bump size, Reviewed By and Approved By
- Status: Partly fixed
- Evidence: fixed: apply-and-verify.md:72-74 (one bump per document per session); :81 "Every chunk the session changes, then or later, takes the new version."; gated and baselined chunks: :91 "A gated chunk is never edited by the review"; bump size: :75-76 "The bump follows the document's own rule: its master's VERSIONING line or its skill's rule for a targeted update." Open: nothing on the new row's approval cells: brd-unifier/chunks/00-cover-and-changelog.md:21 "| Version | Updated Date | Updated By | Reviewed/Approved By | Update Summary |" and sdd-unifier/chunks/00-cover-and-changelog.md:47 "| Version | Updated Date | Updated By | Reviewed By | Approved By | Update Summary |". Flag for the version-family checker: the BRD states the size (brd-unifier/delivery-chunks.md:426 "one minor step per run (1.0 to 1.1)"), sdd-unifier/chunks/sdd-master.md:7 states none, and the reviewer inherits that gap.
- Class: S
- Fix: recommended: leave both cells for the owner. Why: approval belongs to the document's owner, and both templates' first row leaves these cells empty; step 5 left Approved By empty too.

apply-and-verify.md

current:
```text
     changed, so the next skill down the chain knows what to refresh.
```
new:
```text
     changed, so the next skill down the chain knows what to refresh. Its
     Reviewed By and Approved By cells (Reviewed/Approved By in a BRD) stay
     empty until the document's owner reviews and approves the new version.
```
- Files: apply-and-verify.md

### V-2: The note on citations staying valid is tied to renames
- Status: Fixed
- Evidence: apply-and-verify.md:146-149 "Each renamed file has its citations updated in the documents the session may edit, and a header note that historical in-text citations to the old version remain valid if section numbering is unchanged." The note now belongs to each renamed file, so a session with no rename (all chunked documents, as in step 5) writes none. Rows that state a document's current version are lineage rows and go to the hand-off (apply-and-verify.md:129-130).
- Class: n/a
- Fix: none
- Files: -

### V-3: The changelog lives in chunk 00, not in "each edited doc header"
- Status: Fixed
- Evidence: apply-and-verify.md:74 "opens one Changes Log row naming the session and the tracker" (the owners keep it in chunk 00: brd-unifier/chunks/00-cover-and-changelog.md:19, sdd-unifier/chunks/00-cover-and-changelog.md:45). "a changelog entry in its header" now applies only to "A document no skill versions (a business document)" (apply-and-verify.md:76-78).
- Class: n/a
- Fix: none
- Files: -

### V-4: SKILL.md hunts remnants "of the structural changes", the brief "of all decisions"
- Status: Fixed
- Evidence: SKILL.md:163-164 "hunt stale remnants of the decisions"; apply-and-verify.md:114-115 "Hunt for stale remnants of those decisions". The one leftover "structural changes" in that section is N-2.
- Class: n/a
- Fix: none
- Files: -

### V-5: "Fix what it finds" against "fix every confirmed remnant", and remnants found while confirming
- Status: Partly fixed
- Evidence: fixed: SKILL.md:166-167 "Fix what it confirms, except what belongs to the hand-off" now matches apply-and-verify.md:135 "Fix every confirmed remnant". Open: nothing covers a remnant found while confirming; step 5 found 13b "Retry for one day" that way (verify-log.md:48).
- Class: S
- Fix: recommended: fix it the same way and mark it. Why: it is the same kind of remnant, and the mark keeps the hunt's own count honest.

apply-and-verify.md

current:
```text
and gated chunks: those go to the hand-off (Apply rule 6). Then append the
```
new:
```text
and gated chunks: those go to the hand-off (Apply rule 6). A remnant of the
same kind found while confirming is fixed the same way and marked as found
while confirming. Then append the
```
- Files: apply-and-verify.md

### V-6: Verification pass is one line in the schema and a line per fix in the brief; no rule on re-scoring
- Status: Present
- Evidence: tracker-schema.md:29 "**Verification pass (YYYY-MM-DD):** <score, remnants found and fixed>" against apply-and-verify.md:137-138 "date, score, remnant count, one line per fix." Nothing says whether the score is taken again after the fixes.
- Class: S (the format is M; no second score is the choice)
- Fix: recommended: the template mirrors the brief, with one line per remnant, and the score is the hunt's, taken before the fixes, with no second hunt. Why: a second hunt costs a full cleared-context pass (28 minutes and 591K tokens in step 5) for one number, while the per-remnant lines already show what changed; step 5 recorded it this way.

Edit 1, tracker-schema.md

current:
```text
**Verification pass (YYYY-MM-DD):** <score, remnants found and fixed>
```
new:
```text
**Verification pass (YYYY-MM-DD):** <score, before the fixes>; <N> remnants: <fixed>, <left for the hand-off>, <rejected>
1. <remnant> (<point ID>): <the fix, the hand-off that takes it, or why it was rejected>
```

Edit 2, apply-and-verify.md: current "date, score, remnant count," / new "date, the hunt's score (taken before the fixes; there is no second hunt), remnant count,"

Edit 3, apply-and-verify.md

current:
```text
one line per fix. If the agent returns zero remnants on a session with
```
new:
```text
one line per remnant (its fix, the hand-off that takes it, or why it was
rejected). If the agent returns zero remnants on a session with
```
- Files: tracker-schema.md, apply-and-verify.md

### V-7: Must a verify fix that marks a supersession annotate both sides
- Status: Partly fixed
- Evidence: apply-and-verify.md:15-21 now sends the story in a brd-unifier or sdd-unifier document to its `decision-log.md`, but the rule still opens with "state the supersession on BOTH sides" (:16), and § Verify (apply-and-verify.md:135-140) does not say the Apply rules hold for a fix. In step 5, the verify run also annotated the older SDD record (L19, verify-log.md:54), which the owners' append-only rule does not ask for (brd-unifier/decision-log.md:11, sdd-unifier/decision-log.md:11).
- Class: S
- Fix: recommended: a fix completes its point's apply, so the Apply rules hold for it; with W-7's rule 3, supersession inside an owner's decision log is one-sided. Why: a verify fix finishes a decision already taken, so it leaves the same trace as the apply.

Edit 1: W-7's replacement of Apply rule 3.

Edit 2, apply-and-verify.md

current:
```text
Fix every confirmed remnant, except lineage rows, the owner's open items,
```
new:
```text
Fix every confirmed remnant under the Apply rules, as part of its point's
apply, except lineage rows, the owner's open items,
```
- Files: apply-and-verify.md

### V-8: Do verify fixes extend a row's Target doc(s)
- Status: Present
- Evidence: tracker-schema.md:49-50 "**Target doc(s)**: doc ids + sections, comma-separated; update if apply reveals more affected docs than the reviewer cited."
- Class: S
- Fix: recommended: yes. Why: the column is the row's list of affected documents, and V-7 makes a verify fix part of its point's apply; the Verification pass block still records the fix itself.

tracker-schema.md

current:
```text
  reveals more affected docs than the reviewer cited.
```
new:
```text
  or a verify fix reveals more affected docs than the reviewer cited.
```
- Files: tracker-schema.md

### V-9: "Mark Stale" against a chunk whose gate forbids writing it (L20)
- Status: Partly fixed
- Evidence: fixed for SDD 19: apply-and-verify.md:98-99 "SDD 19: the E2E gate line in the master, or in the cover of a combined SDD." The mark sits outside chunk 19, which matches the L20 rejection and sdd-unifier/chunks/19-e2e-system-design.md:9 "While the gate is shut, nothing of this chunk is written". Open for BRD 15-17: apply-and-verify.md:91 "A gated chunk is never edited by the review" against :95 "BRD 15-17: the chunk's status line"; SKILL.md:208-209 "never edits an LLD or a gated chunk".
- Class: M (the text should say the content is never edited and only the Stale mark is set)
- Fix: valid while the Stale mark stays with the review; drop it if the cross-skill decision moves the mark to the hand-off.

Edit 1, apply-and-verify.md

current:
```text
   - A gated chunk is never edited by the review, whether its gate is open
```
new:
```text
   - The review never edits a gated chunk's content (its Stale mark aside),
     whether its gate is open
```

Edit 2, SKILL.md

current:
```text
  in `apply-and-verify.md`, Apply rule 6), and never edits an LLD or a gated
  chunk: a decision that needs a structural change becomes a skill change
```
new:
```text
  in `apply-and-verify.md`, Apply rule 6), and never edits an LLD or a gated
  chunk's content (its Stale mark aside): a decision that needs a structural
  change becomes a skill change
```

Flag for the cross-skill "mark Stale" checker (not designed here):
  1. The review sets the Stale mark at apply (apply-and-verify.md:92-93), Apply rule 6 says the gated chunks "belong to the owning skill. The hand-off updates them" (:51-54), and the hand-off sets it again (:177 "It marks chunks 15-17 Stale if they exist"; :186-187 "It marks chunk 19 Stale where its rules say so").
  2. brd-unifier's shut gate says "Do not write 15, 16, or 17" (brd-unifier/delivery-chunks.md:42), while its ground rule 4 gives those chunks a `Stale` status line (:83), and its own Stale rules omit the master's Delivery Chunks State cell that apply-and-verify.md:95-97 names (A3, held for step 6).
- Files: apply-and-verify.md, SKILL.md

### V-10: "Files touched": the whole session or verify only
- Status: Partly fixed
- Evidence: apply-and-verify.md:3-4 now defines "A **review session** is one tracker, from its first applied point to its close", but the close-out still says only "files touched": SKILL.md:178 and apply-and-verify.md:153.
- Class: M (the session definition settles which reading is right)
- Fix:

Edit 1, SKILL.md

current:
```text
skill changes requested, files touched, new versions, and the hand-offs with
```
new:
```text
skill changes requested, the files the session touched, new versions, and the
hand-offs with
```

Edit 2, apply-and-verify.md: current "decisions list, skill changes requested, files touched, new" / new "decisions list, skill changes requested, the files the session touched, new"
- Files: SKILL.md, apply-and-verify.md

### V-11: Two possible fixes for one remnant (L8)
- Status: Present
- Evidence: apply-and-verify.md:130-131 asks for "Where, what is stale, what it should say", and :135 says "Fix every confirmed remnant"; nothing covers a remnant with two fixes. Step 5's L8 had two, and the verify run took the first without asking (verify-log.md:43, :144).
- Class: S
- Fix: recommended: put the choice to the user when the fixes would say different things. Why: choosing between two contents is a decision, and Core principle 4 (SKILL.md:66) requires the user's word.

apply-and-verify.md

current:
```text
stale-remnant categories spelled out.
```
new:
```text
stale-remnant categories spelled out. A remnant with two possible fixes
that would make a document say different things is put to the user with
the options and a recommendation, as in the walkthrough (Core principle 4).
```
- Files: apply-and-verify.md

## New items

### N-1: "Applied" still means every affected document reflects the decision
- Status: Present
- Evidence: SKILL.md:71-72 "A decision is not Applied until every affected document reflects it: counts, IDs, citations, supersession notes." tracker-schema.md:52 "Applied means every affected doc reflects it." README.md of this skill, line 33 "A point is not Applied until every affected document reflects it". Against apply-and-verify.md:70-71 "A point whose remaining part is a hand-off is Applied", SKILL.md:79-80 "An LLD is never edited", and apply-and-verify.md:91 (gated chunks are not edited): an affected LLD or gated chunk reflects the decision only after the hand-off.
- Class: M (the newer hand-off rule is the one the rest of the skill follows)
- Fix:

Edit 1, SKILL.md

current:
```text
   document reflects it: counts, IDs, citations, supersession notes.
```
new:
```text
   document the review may edit reflects it (counts, IDs, citations,
   supersession notes) and the rest is named in a hand-off.
```

Edit 2, tracker-schema.md: current "Applied means every affected doc reflects it." / new "Applied means every affected doc the review may edit reflects it, and the rest is named in a hand-off (`apply-and-verify.md`, Apply rule 6)."

Edit 3, README.md of this skill: current "A point is not Applied until every affected document reflects it, including downstream BRD and SDD chunks that cite the changed content." / new "A point is not Applied until every affected document the review may edit reflects it, including downstream BRD and SDD chunks that cite the changed content; LLDs and gated chunks follow through the hand-offs."
- Files: SKILL.md, tracker-schema.md, README.md (this skill)

### N-2: The verify suspect rule still says "structural changes"
- Status: Present
- Evidence: apply-and-verify.md:138-139 "If the agent returns zero remnants on a session with structural changes, treat it as suspect". Since (c) the review never changes a template structure (apply-and-verify.md:27-29; SKILL.md:207-208), so read that way the rule never fires; it means the tracker's Major structural decisions.
- Class: M
- Fix: apply-and-verify.md: current "structural changes, treat it as suspect" / new "major structural decisions (tracker), treat it as suspect"
- Files: apply-and-verify.md

### N-3: The skill's opening paragraph still versions after verify
- Status: Present
- Evidence: SKILL.md:18 "full context, apply decisions chain-wide, then verify and version." against apply-and-verify.md:72-74 (the version is bumped at the first change) and SKILL.md:170 "### 7. Close and hand off".
- Class: M
- Fix: SKILL.md

current:
```text
full context, apply decisions chain-wide, then verify and version.
```
new:
```text
full context, apply decisions chain-wide (one version bump per changed
document), then verify and hand the changed documents back to their skills.
```
- Files: SKILL.md

### N-4: "Tracker notes" has no home in the tracker
- Status: Present
- Evidence: panel-orchestration.md:60-61 "If the second pass still returns nothing, record that explicitly in the tracker notes". The tracker template (tracker-schema.md:11-41) and its rules (:43-75) have no notes line or block.
- Class: S
- Fix: recommended: one optional header line in the template. Why: the zero-findings result is part of the panel's record, written once at merge, and an optional line costs nothing when unused.

Edit 1, panel-orchestration.md: current "tracker notes; never invent findings to fill the gap." / new "tracker's Panel notes line; never invent findings to fill the gap."

Edit 2, tracker-schema.md

current:
```text
**Status values:** Pending | Decided | Applied | Partially applied | Rejected | Deferred
```
new:
```text
**Status values:** Pending | Decided | Applied | Partially applied | Rejected | Deferred
**Panel notes:** <a reviewer whose re-dispatch still returned nothing: the persona, the areas it named clean, and the evidence; omit the line when there is none>
```
- Files: panel-orchestration.md, tracker-schema.md

### N-5: sdd-unifier says the new-version request "covers all of this" after a review
- Status: Present
- Evidence: sdd-unifier/SKILL.md:344 (the review row): "Read the review's Changes Log row and its `review-comments-tracker.md`. ... close the open items the review's decisions answer, ... The review already bumped the version; bump again only if step 6a changes a chunk. When source BRDs also changed, "BRD <KEY> has a new version" covers all of this." The new-version path does not read the tracker or close those items, and it bumps again: sdd-unifier/SKILL.md:343 "rerun step 6a, mark chunk 19 `Stale`, bump the version"; sdd-unifier/brd-to-sdd.md:69 "Same step 6a rerun, `Stale` marking, and version bump." The reviewer sends only that request when a source BRD changed: apply-and-verify.md:179-181 "when source BRDs changed: "BRD [KEY] has a new version", naming every changed source BRD in one request". Step 5 changed both BRDs and the SDD, which is this case.
- Class: D (a hand-off between skills)
- Options:
  - A. One update. The sdd-unifier review row ends: when source BRDs also changed, "BRD <KEY> has a new version" and the steps above run as one update with one version; the reviewer's request names the tracker ("BRD [KEY] has a new version, after the business review of [date] ([tracker path])"). Tradeoff: one SDD run and one version; rows in two sdd-unifier files change (CROSS-SKILL), and the new-version path must recognise a request that comes from a review.
  - B. Two requests in order: the reviewer sends "BRD [KEY] has a new version", then "the business review changed this SDD", and the "covers all of this" sentence goes. Tradeoff: no new logic in sdd-unifier; two SDD runs and, as the new-version path reads today, a second bump.
- Recommendation: A, because it keeps the (c) intent of all changed BRDs in one request and one version, and it closes the review's SDD items in the same run.
- Files: sdd-unifier/SKILL.md step 10 rows (CROSS-SKILL), sdd-unifier/brd-to-sdd.md § Changes after the SDD exists, the "BRD <KEY> has a new version" row (CROSS-SKILL), apply-and-verify.md (Hand-off item 2). The second bump is flagged for the version-family checker.

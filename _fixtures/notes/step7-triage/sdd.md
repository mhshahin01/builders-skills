# sdd-unifier triage: live findings 1 to 9 and N7

Read-only triage, 2026-10-07. Skill text as on disk (main 548bf5d). Source of the items: `_fixtures/notes/step6-handoffs/live-findings.md` lines 9-17 and 62. Example run: `_fixtures/chain/run-2026-10-07-review/sdd-refunds-platform/` (called "the baseline" below; paths under it are given as `BL/...`).

## Summary

| ID | Class | One-line fix or recommended option |
|---|---|---|
| 1 | D | Rec. B: an update whose only content change applies `Decided - pending application` items runs the application check of those items as its baseline (pass 1 of 3); any other content change keeps the delta review. |
| 2 | S | Chunk 18 template and combined §23: an application-check row names every chunk (section) the item changed, e.g. `[YYYY-MM-DD] application check: chunks 02 and 11 (OI-NN)`. |
| 3 | D | Rec. B: a source problem the faithfulness check finds that no chunk 19 claim depends on, in text this request did not change, is recorded (chunk 18 Reviewer Notes, owner, reason) and named in the handoff; it does not shut the gate. |
| 4 | S | SKILL.md Versions: a write of chunk 19 that changes none of its content keeps its version and is not listed after `Chunks:`; the E2E basis line records the verification. |
| 5 | D | Rec. A: Already current also applies behind a `Stale` mark when no claim chunk 19 asserts changed, confirmed by a faithfulness check; then the gate line reads `Open - Up to date`. |
| 6 | S | Step 8b item 3: fixes made after the faithfulness check belong to the same write; the agent that ran it (or a new cleared-context agent given the mismatch list) confirms each fixed passage; no full rerun. |
| 7 | S | decision-log.md: the Clarification register gets the Marker register's own `**Open remainder:**` line. |
| 8 | S | Gate line template (master and combined cover): after the dash, the unmet conditions for Locked or Stale; nothing follows `Open - Up to date` (its evidence lives on the Reconciled line, the E3 inventory and the E2E basis line). |
| 9 | D | Rec. B: when applying a decision, the author carries it to other text that states the same fact and has one clearly right wording (named with the OI ID in the Changes Log; verified by the application check); text that needs a choice stays a new OI. |
| N7 | M | brd-to-sdd.md:44: "the only thing another skill writes into the SDD" becomes "the only thing lld-unifier writes into the SDD", plus one sentence on the business review hand-off. |

Counts: M 1 (N7); S 5 (2, 4, 6, 7, 8); D 4 (1, 3, 5, 9).

Dependencies between items: 1 and 2 (row labels); 4 and 5 (a kept chunk 19 keeps its version); 3, 6 and 9 (the one-clear-side routes); 3 and 6 both edit SKILL.md:350.

## Line endings

- Every `sdd-unifier/*.md` and `sdd-unifier/chunks/*.md`, the root `README.md`, `sdd-unifier/README.md`, and `lld-unifier/SKILL.md` are CRLF in the working tree (CR count equals LF count; for example SKILL.md 437/437, brd-to-sdd.md 435/435, decision-log.md 120/120, TEMPLATE-COMBINED.md 2000/2000, chunks/18 97/97, chunks/sdd-master.md 266/266, parts-mode.md 166/166, README.md 561/561). The index holds LF (`git ls-files --eol`: `i/lf w/crlf`; `core.autocrlf=true`; no `.gitattributes` rule for them). Edit in place and keep CRLF so no file ends up mixed. The root README is also checked by `_fixtures/notes/step6-handoffs/check_readme.py`: it fails on LF-only lines, em or en dashes, and non-ASCII other than `§ · →`.
- `_fixtures/**` is LF (`.gitattributes`: `_fixtures/** text eol=lf`): `check_versions.py` 0 CR, `check_e2e.py` 0 CR, `tests/test_chk_regressions.py` 0 CR.
- `business-reviewer-unifier/apply-and-verify.md` is LF in the working tree (0 CR of 255 LF). Keep LF if it is touched.

## Shared proof: scenario S4 (proposed)

One SDD-only live rerun covers items 3, 4, 5, 6 and 8 (and shows 1 if its first pass is checked). Write it to the session scratchpad, never inside a skill folder, and keep the folder name `sdd-refunds-platform` (`check_sdd.py`, `check_trace.py` and `check_links.py` depend on it).

1. Copy `_fixtures/chain/run-2026-10-07-review` to the scratchpad.
2. Request 1, a targeted update: change one passage in chunks 02 to 13x that no chunk 19 claim uses (for example a sentence in 13a Developer Notes). Expect v1.8, `Chunks: 13a`, the gate line `Stale`, and a delta review row `delta: chunk 13a`.
3. Request 2: "refresh the e2e". Expect E1 to E4 met; the Stale branch of Already current (item 5): a faithfulness check, no rewrite; chunk 19 still `VERSION: 1.7` and not listed after `Chunks:` (item 4); any fix confirmed (item 6); any unrelated source problem the check reports (the `CustomerAccountClosed` naming question may recur) recorded in chunk 18 Reviewer Notes with its owner, the gate open (item 3); the gate line `Open - Up to date` with nothing after it (item 8); the E2E basis line recording the v1.8 verification.
4. Run `check_versions.py`, `check_e2e.py`, `check_sdd.py`, `_linkcheck.py` and `check_uc_keys.py` on the result: 0 problems expected.

---

## Item 1. Review kind for an update that only applies a pending item

**1. Verification.** Reproduces.

- `sdd-unifier/SKILL.md:255` (On an update): "A later update that changes content in chunks 01 to 17 (a step 10 row, `brd-to-sdd.md` § Changes after the SDD exists, or a redone part) runs a delta review before step 8b and the handoff. It is the same cleared-context reviewer with the same brief, limited to the chunks, or combined sections, the update's Changes Log row lists after `Chunks:` and to the change behind it (the source BRD's Changes Log rows since the version the Source BRDs register (chunk 00 § Document Lineage) held before the update, or the review tracker)." The change behind it never names a chunk 18 decision.
- `SKILL.md:257` (Review after answers): "Run the full first-build review or one delta baseline for this request. Later accepted answers use scoped verification of their application, changed chunks/dependents and necessary gaps exposed by those changes".
- `SKILL.md:259` (Review limit): "One request has at most three review passes: one baseline and up to two scoped application passes."
- `SKILL.md:302` (step 8 item 3): a pending decision is applied by "the next request that changes this SDD (any update, not a pure merge or re-chunk)".
- `SKILL.md:360` (step 10, common tail): "Every content-changing targeted update first applies any `Decided - pending application` OI (step 8 item 3), then uses the common tail: affected step 6a reconciliation, the scoped delta review/application verification of step 7, ..." The slash leaves the kind open.
- `SKILL.md:367` (the "refresh the e2e" row) names no review at all.
- `chunks/18-open-items-and-clarifications.md:85`: delta rows are "one dated row per changed chunk"; application rows are "`[date] application check: chunk NN (OI-NN)`".

The two live runs read it differently. v1.6 (two marker answers) ran a delta baseline (`BL/18-open-items-and-clarifications.md:922-924`, `BL/decision-log.md:909`). v1.7 (only OI-45 applied) labelled pass 1 an application check (`BL/18-open-items-and-clarifications.md:928-929`, `BL/decision-log.md:921`).

**2. Class.** D. It decides which review pass runs (its brief, scope and label), and two readings are reasonable.

**3. Options.**

- **A. Always a delta review.** Every content-changing update starts with a delta review; for an update that only applies pending items, "the change behind it" is the applied chunk 18 decisions. Effect: one invariant, the READMEs stay as they are; the full brief runs again on text a reviewer already wrote; v1.7's pass 1 label would be wrong.
- **B. Application check for pending items.** When the update's only content change applies `Decided - pending application` items, its first pass is the application check of those items (the applied text, the chunks it changed, what depends on them, and necessary gaps it exposes). That pass is the request's baseline, pass 1 of 3. Any other content change (a source BRD version, a business review, a marker answer, a user-written change) keeps the delta review, which also covers pending items applied in the same update. Effect: matches both live runs; no re-hunt of a surface the previous reviewer covered; one sentence in four places.
- **C. Application check for any decision-only update** (pending items, answers to open items, marker answers). Effect: the cheapest; v1.6 would also have been an application check; owner-written marker answers, which no reviewer wrote, would get no adversarial pass.

**Recommended: B.** A pending item's text is a Recommended Answer that a cleared-context pass already produced; what is unverified is its application, which is exactly the application check's scope (`SKILL.md:257`; `:272` "do not repeat a new-scope hunt"). New content that no reviewer wrote keeps the delta review. Both live runs already follow B.

Recommended text (B), all in `sdd-unifier/SKILL.md` (CRLF):

- `:255`, after "runs a delta review before step 8b and the handoff.", insert: "An update whose only content change applies `Decided - pending application` items (step 8 item 3) runs an application check of those items instead, as its baseline: the same reviewer, limited to the applied text, the chunks it changed, and what depends on them, with application check rows (chunk 18, Reviewer Notes)."
- `:257`, old: "Run the full first-build review or one delta baseline for this request." New: "Run the full first-build review or one baseline for this request: a delta review, or the application check of applied pending items (On an update)."
- `:360`, old: "the scoped delta review/application verification of step 7" New: "the step 7 baseline (a delta review, or the application check of applied pending items) and the scoped verification of later answers"

**4. Ripple.**

- `SKILL.md:367` (refresh row): optionally name the review: after "rerun step 6a if ... (E4)," add "run the step 7 review of what changed,".
- `chunks/18-open-items-and-clarifications.md:85` and `TEMPLATE-COMBINED.md:1801`: optionally add "An update that only applies pending items starts with application check rows."
- `README.md:54` (CRLF), old: "A later SDD update that changes chunks 01-17, or an LLD update that changes content, gets a delta review of the changed chunks;" New: "A later SDD update that changes chunks 01-17, or an LLD update that changes content, gets a delta review of the changed chunks (an SDD update that only applies decisions left pending by an earlier request gets an application check of them instead);"
- `sdd-unifier/README.md:67` (CRLF), old: "A later update that changes content gets a delta review of the chunks it changed, and its new items go through the same loop." New: "A later update that changes content gets a delta review of the chunks it changed (an update that only applies decisions left pending gets an application check of them instead), and its new items go through the same loop."
- Other skills: none. The BRD's first consistency run is always full (`brd-unifier/delivery-chunks.md:165` "Its first run checks chunks 00-13 in full"); lld-unifier has no pending-application status.
- Checkers: none read Reviewer Notes labels (no hit for `application check` or `delta:` in `_fixtures/checkers/`).

**5. Proof.** No fixture rerun needed: the baseline already shows both branches (v1.6 delta, v1.7 application check). A read-only consistency read of the edited lines is enough.

---

## Item 2. Row granularity of application-check rows

**1. Verification.** Reproduces.

- `chunks/18-open-items-and-clarifications.md:85`: "a scoped application check adds one dated row per checked item, labelled `[date] application check: chunk NN (OI-NN)`."
- `TEMPLATE-COMBINED.md:1801`: "a scoped application check adds one dated row per checked item, labelled `[date] application check: §NN (OI-NN)`."

The label holds one chunk; an item can change several. The baseline used both shapes: OI-45 got one row per changed chunk (`BL/18-open-items-and-clarifications.md:928` "application check: chunk 01 (OI-45)", `:929` "chunk 11 (OI-45)"), OI-47 one row for two chunks (`:931` "application check: chunks 02 and 11 (OI-47)"). Side note: the delta label in `SKILL.md:255` writes `[YYYY-MM-DD]` and, in COMBINED mode, `section N`; the application label writes `[date]` and `§NN`.

**2. Class.** S. The template already chose one row per item; only the label is too narrow.

**3. Fix.**

- `sdd-unifier/chunks/18-open-items-and-clarifications.md:85` (CRLF). Old: "a scoped application check adds one dated row per checked item, labelled `[date] application check: chunk NN (OI-NN)`." New: "a scoped application check adds one dated row per checked item, labelled `[YYYY-MM-DD] application check: chunk NN (OI-NN)`, naming every chunk the item changed (`chunks 02 and 11`)."
- `sdd-unifier/TEMPLATE-COMBINED.md:1801` (CRLF). Old: "a scoped application check adds one dated row per checked item, labelled `[date] application check: §NN (OI-NN)`." New: "a scoped application check adds one dated row per checked item, labelled `[YYYY-MM-DD] application check: section N (OI-NN)`, naming every section the item changed (`sections 6 and 15`)."

The `[YYYY-MM-DD]` and `section N` parts align the label with `SKILL.md:255`; they are optional.

**4. Ripple.** SKILL.md defines no application label (only the delta label at `:255`), so nothing else in the skill changes. If item 1 B is chosen, its baseline rows use this label. Coordinate wording with live finding 10 (lld-unifier delta rows) so both chunk 18 templates label rows the same way. Checkers: none read the label.

**5. Proof.** None beyond a consistency read.

---

## Item 3. Policy: a faithfulness-found source problem that no chunk 19 claim depends on

**1. Verification.** Reproduces.

- `SKILL.md:328`: "A problem it finds in a source chunk is never fixed inside chunk 19: fix the source chunk when it is a plain inconsistency with one clearly right side (...); otherwise raise it as an open item (chunk 18, through step 8), which shuts the gate and marks chunk 19 `Stale` (item 4); the master still links chunk 19, since it exists."
- `SKILL.md:330` (Faithfulness source corrections): "A new design choice or semantic change instead raises an OI, runs step 8 and the normal scoped delta review; ... Never use the mechanical route to choose between two plausible designs."
- `SKILL.md:350` (handoff): "each source-chunk problem, fixed in its chunk or raised as an open item."
- `chunks/18-open-items-and-clarifications.md:10` lists "a source-chunk problem found by the chunk 19 faithfulness check (step 8b)" among the items the author must raise; `README.md:343` says the same.

Only two routes exist. The v1.7 run took a third: the `CustomerAccountClosed` naming question (13a internal publication versus an API-12 typed error) was recorded and not raised, and the gate opened (`BL/decision-log.md:925`, `BL/refunds-platform-sdd-master.md:31`).

**2. Class.** D. Policy decision; it changes when the gate shuts.

**3. Options.**

- **A. Strict.** Every source problem is fixed (one clear side) or raised; say so plainly. Effect: an older problem that chunk 19 does not use shuts the gate; the faithfulness check turns into a scope hunt, against `SKILL.md:259` ("those never start a fresh scope hunt") and `:330` ("it does not restart delta gap-finding"). v1.7 would have ended with a shut gate and a new OI.
- **B. Record, do not raise, when no claim depends on it.** A problem that no chunk 19 claim depends on (the E3 dependency test) and that lies in text this request did not change is recorded in chunk 18 Reviewer Notes with its source, its owner, and why no claim depends on it, and the handoff names it. It does not shut the gate. Anyone can raise it later. Effect: the gate tracks chunk 19's fidelity only, as E3 already does for markers; the problem stays visible but has no status.
- **C. Raise it as a nonblocking OI.** A new status or flag that E1 ignores. Effect: changes E1, the chunk 18 status list and GATES header, the README, `check_e2e.py:100-101` (E1) and its tests; much machinery for a rare case.

Considered and rejected: mark the problem in its source chunk with a clarification marker and classify it `No:` in the E3 inventory. The marker is a content change to chunks 02-13x, which marks chunk 19 Stale again (`SKILL.md:331`) and reopens E4 inside the same request.

**Recommended: B.** E3 already separates blocking from nonblocking by claim dependency, and the check's job is chunk 19's fidelity. Requiring that the text be unchanged by this request keeps the request's own defects in scope. It matches what the v1.7 run did, with a fixed home for the record.

Recommended text (B), `sdd-unifier/SKILL.md` (CRLF):

- `:328`, after "the master still links chunk 19, since it exists.", insert: "One exception: a problem that no chunk 19 claim depends on (the dependency test of E3) and that lies in text this request did not change is not raised. Record it in chunk 18 Reviewer Notes with its source, its owner, and why no claim depends on it, and name it in the handoff. It does not shut the gate. On its own, the note bumps nothing."
- `:330`, old: "A new design choice or semantic change instead raises an OI," New: "A new design choice or semantic change instead raises an OI (unless the exception in item 3 applies),"
- `:350`, old: "and each source-chunk problem, fixed in its chunk or raised as an open item." New: "and each source-chunk problem, fixed in its chunk, raised as an open item, or recorded in chunk 18 Reviewer Notes for its owner."

**4. Ripple.**

- `SKILL.md:353` (handoff), old: "Scope proposals: name each one recorded in Reviewer Notes, for the owner's choice." New: "Scope proposals: name each one recorded in Reviewer Notes, for the owner's choice, and each source problem the chunk 19 faithfulness check recorded there, with its owner."
- `chunks/18-open-items-and-clarifications.md:10` (CRLF), old: "a source-chunk problem found by the chunk 19 faithfulness check (step 8b)" New: "a source-chunk problem found by the chunk 19 faithfulness check that a chunk 19 claim depends on or that the request's own change caused (step 8b)".
- `chunks/18-open-items-and-clarifications.md:92` and `TEMPLATE-COMBINED.md:1808` (CRLF): add a comment line: "<!-- A source problem the chunk 19 faithfulness check found and did not raise (SKILL.md step 8b item 3): a note here with its source, its owner, and why no chunk 19 claim depends on it. -->"
- `README.md:343` (CRLF), old "a chunk 19 source problem" new "a chunk 19 source problem that a chunk 19 claim depends on"; and after "Optional scope proposals sit in Reviewer Notes and block nothing unless you adopt them" add "; a chunk 19 check finding that no chunk 19 claim depends on is noted there too, for its owner".
- Other skills: none. brd-unifier handles gaps found while writing 15-17 as `Provisional (TD-NN)` (`brd-unifier/delivery-chunks.md:44`, `:85`, `:507`), a different mechanism; lld-unifier has no faithfulness check.
- Checkers: none enforce raising. `check_e2e.py` reads chunk 19's `### Faithfulness` list only as a note (`:278`, `:363`). Option C would change `check_e2e.py:100-101` and need tests.

**5. Proof.** The baseline shows the recommended outcome already (recorded, gate open), but in the decision log and the E2E basis line instead of chunk 18. Scenario S4 confirms the new home. No checker test needed for B.

---

## Item 4. Chunk 19 version after a rewrite with no semantic change

**1. Verification.** Reproduces as a latent conflict.

- `SKILL.md:407`: "The row ends with `Chunks:` and the number of every chunk whose content changed ... every other chunk keeps the version in which its content last changed, and chunk 19 the version it was written at."
- `SKILL.md:409`: only semantic changes go in the list ("Routine cover/version/index/footer synchronization and decision/process tracking are excluded").
- `chunks/sdd-master.md:7`: "chunk 19 the version it was written at."
- `_fixtures/checkers/check_versions.py:119-126`: any unlisted chunk other than 00 (and BRD 14-17) that carries the newest row's version is a problem.

Reproduced on a scratch copy of the baseline: with 19 removed from the v1.7 `Chunks:` list, `check_versions.py` reports "Chunks: does not list 19-e2e-system-design.md but it carries VERSION 1.7". The baseline itself is clean only because chunk 19 changed in v1.7 (faithfulness fixes) and is listed.

**2. Class.** S. The general rule (version of the last content change) and Already current (`SKILL.md:326`: "keep the body and version") already give the answer; only the chunk 19 clause disagrees.

**3. Fix.**

- `sdd-unifier/SKILL.md:407` (CRLF). Old: "every other chunk keeps the version in which its content last changed, and chunk 19 the version it was written at." New: "every other chunk keeps the version in which its content last changed, and chunk 19 the version it was written at. A write of chunk 19 that changes none of its content keeps that version and is not listed after `Chunks:`, as an already-current chunk 19 does (step 8b item 1); its E2E basis line records the new verification."
- `sdd-unifier/chunks/sdd-master.md:7` (CRLF). Old: "every other chunk carries the version in which its content last changed, and chunk 19 the version it was written at." New: "every other chunk carries the version in which its content last changed, and chunk 19 the version it was written at (a later write that changes none of its content keeps it)."
- `README.md:56` (CRLF; check_readme.py). Old: "every other chunk keeps the version its content last changed in, and a gated chunk (BRD 15-17, SDD 19) the version it was written at." New: "every other chunk keeps the version its content last changed in, and a gated chunk (BRD 15-17, SDD 19) the version it was written at; SDD 19 keeps it when a later write changes none of its content."

Rejected alternatives: exempt SDD 19 in `check_versions.py` as BRD 14-17 are (loses the check that a changed chunk 19 is listed; lld-unifier reads `Chunks:` lists and `lld-unifier/sdd-to-lld.md:320` maps SDD 19); list 19 on every write (then `Chunks:` no longer means a semantic change).

**4. Ripple.** `chunks/sdd-master.md:39` and `TEMPLATE-COMBINED.md:13` (E2E basis: "the Reconciled entry it was written or last verified against") already fit. COMBINED mode has no per-section VERSION: no change. brd-unifier (`delivery-chunks.md:437`, `chunks/brd-master.md:7`) keeps "15-17 the version they were written at": no change, since BRD 15-17 are outside `Chunks:` and exempt in `check_versions.py:121`. Item 5 relies on this rule.

**5. Proof.** No rerun needed. Optional regression test in `_fixtures/checkers/tests/test_chk_regressions.py` (LF): the tests copy `chain/run-2026-10-06-final` (`:14`), whose newest row reads `Chunks: 06, 07, 12, 19.` with chunk 19 at 1.3; drop `, 19` and assert "does not list 19-e2e-system-design.md" (today `:138-146` cover only BRD and LLD). S4 shows the kept version live.

---

## Item 5. Already current behind a Stale gate

**1. Verification.** Reproduces.

- `SKILL.md:326`: "If already Open - Up to date with no changed source claim, keep the body and version, record this verification on the E2E basis line, and report no change. A separate request for a review still runs that review. If the basis is missing or a relevant source changed, regenerate and run faithfulness normally."
- `SKILL.md:331`: any content change to chunks 02 to 13x marks chunk 19 `Stale`. So the keep branch can only fire when nothing in 02-13x changed, and a Stale gate whose changes touch no claim falls between the two branches.
- The templates are broader: `chunks/19-e2e-system-design.md:9` "An already-current output is verified and retained without rewriting."; `chunks/sdd-master.md:198` "keep an already-current body after verifying its sources/gate"; `TEMPLATE-COMBINED.md:1822` "When already current, verify sources/gate and keep the section/version rather than rewrite it."; `README.md:199` "(a chunk 19 still `Open - Up to date` whose source claims did not change is kept as is)".
- The run regenerated: `BL/decision-log.md:925` "Not already current: the gate line read Stale, and chunks 02 and 11, both chunk 19 sources, changed after its v1.6 basis. Chunk 19 written again at v1.7: ... so its content was kept".

**2. Class.** D. It decides when a Stale gate may reopen without a rewrite; more than one reasonable answer.

**3. Options.**

- **A. Keep behind Stale when no asserted claim changed, confirmed by a faithfulness check.** Effect: no rewrite churn; the cleared-context check makes the "no claim changed" judgement independent; the gate reopens with chunk 19's version kept (item 4).
- **B. Always regenerate behind a Stale mark;** Already current applies to an Open gate only. Effect: simple and deterministic; a rewrite plus a faithfulness check every time; with item 4 an unchanged result keeps its version, so the outcome is close to A, with more work and a risk of wording churn; the three template lines quoted above must be narrowed to the Open case.
- **C. Mark Stale only when a change touches a chunk 19 claim.** Effect: changes the gate states in `SKILL.md:331`, the step 10 rows (`:366`, `:368`, `:372`, `:373`), `brd-to-sdd.md:68-69`, `transform-detection.md:153`, `business-reviewer-unifier/apply-and-verify.md:118-128` and `README.md:202`; another skill cannot judge chunk 19 claims. Not recommended.

**Recommended: A.** It matches the templates' own rule (retain an already-current output), and "relevant" in `:326` is already claim-based. The faithfulness check runs on every write anyway, so A costs the same as B without the rewrite.

Recommended text (A), `sdd-unifier/SKILL.md:326` (CRLF). Old: "If the basis is missing or a relevant source changed, regenerate and run faithfulness normally." New: "Behind a `Stale` mark, when sources changed since the basis but no claim chunk 19 asserts changed, keep the body and version as well: run the faithfulness check against the current sources, and when it finds no mismatch, record it on the E2E basis line and set the gate line to `Open - Up to date`. Fix any mismatch it finds as item 3 says. If the basis is missing or a claim changed, regenerate and run faithfulness normally."

**4. Ripple.**

- `SKILL.md:350`, old: "or verified current and kept unchanged (say so, with its E2E basis)" New: "or verified current and kept unchanged (say so, with its E2E basis and, behind a Stale mark, its faithfulness check)".
- `README.md:199` (CRLF), old: "(a chunk 19 still `Open - Up to date` whose source claims did not change is kept as is)" New: "(a chunk 19 whose source claims did not change is kept as is, after a faithfulness check when it was marked `Stale`)".
- `chunks/19-e2e-system-design.md:9`, `chunks/sdd-master.md:198`, `TEMPLATE-COMBINED.md:1822`, `sdd-unifier/README.md:72`: fit A as they stand (they need narrowing only under B).
- Checkers: `check_e2e.py` checks the gate line and chunk 19 against the sources; unaffected. `check_versions.py` agrees once item 4 is in. The business reviewer only sets Stale: no change.

**5. Proof.** Scenario S4 (live) is recommended, because the gate behaviour changes.

---

## Item 6. Re-check after faithfulness fixes

**1. Verification.** Reproduces.

- `SKILL.md:328`: "Then run the **faithfulness check**, on every write of chunk 19, the first build included: a cleared-context agent ... changes no file, and labels each mismatch wrong, misleading, or cosmetic. Fix each mismatch in chunk 19 first; only then raise any source open item that shuts the gate. ... Once chunk 19 matches its sources, update the master". Nothing says how "matches" is shown after the fixes, or whether the fixes are a new write.
- `SKILL.md:330` says of source corrections "verify the correction", without saying who.
- `sdd-unifier/parts-mode.md:109`: "its faithfulness check (SKILL.md step 8b) has run, with every mismatch fixed in chunk 19."
- The run had the same agent confirm the fixed passages (`BL/refunds-platform-sdd-master.md:31` "all fixed in chunk 19 and confirmed closed by the same agent").

**2. Class.** S. The skill's own pattern decides it: scoped verification after answers, and faithfulness checks that "never start a fresh scope hunt" (`SKILL.md:259`).

**3. Fix.**

- `sdd-unifier/SKILL.md:328` (CRLF). Old: "Fix each mismatch in chunk 19 first; only then raise any source open item that shuts the gate." New: "Fix each mismatch in chunk 19 first; only then raise any source open item that shuts the gate. The fixes belong to the same write, so the check does not run again in full: the agent that ran it confirms each fixed passage against its sources, or a new cleared-context agent does, given the mismatch list, when that agent cannot be reached. A fix that changes another count, name, edge, or claim is confirmed the same way."
- `sdd-unifier/SKILL.md:350` (CRLF). Old: "fixed in chunk 19, and each source-chunk problem" New: "fixed in chunk 19 and confirmed, and each source-chunk problem" (combine with item 3's edit of the same sentence).
- `sdd-unifier/parts-mode.md:109` (CRLF). Old: "with every mismatch fixed in chunk 19." New: "with every mismatch fixed in chunk 19 and the fixes confirmed."

**4. Ripple.** `sdd-unifier/README.md:67` optionally: "and chunk 19 is fixed before the gate line reads `Open - Up to date`" becomes "and chunk 19 is fixed, and the fixes confirmed, before the gate line reads `Open - Up to date`". `README.md:54`: no change. `SKILL.md:32` (Running outside Claude Code) already covers the new-agent case. Checkers: none.

**5. Proof.** None needed: the v1.7 run already did this. S4 shows it if its check finds a mismatch.

---

## Item 7. Open remainder placement in decision-log.md

**1. Verification.** Reproduces.

- `sdd-unifier/decision-log.md:71` (Clarification register): the Decision record placeholder ends "Open remainder is stated here, never in the chunks.]"
- `decision-log.md:83` (Marker register): its own line, "**Open remainder:** [None, or after a partial answer the exact question the narrowed marker still asks, with its named owner and location.]"
- `decision-log.md:93` (Business review register): inline, "An open remainder, a question the decision leaves to this document's owner, is stated here".
- The baseline follows both: inline "Open remainder:" sentences in Clarification records (`BL/decision-log.md:53`, `:111`, `:183`, `:201`, `:217`, `:225`, `:257`, `:291`, `:309`, `:321`, `:409`) and two `**Open remainder:**` lines in the Marker register (`:789`, `:797`).

**2. Class.** S. The Marker register line is the newer design for the partial-answer rule (`decision-log.md:20`: "record the applied part and the exact open remainder with its named owner and source marker"), and the run already labels its inline sentences "Open remainder:". Folding the Marker line back inline would drop the explicit "None".

**3. Fix.** `sdd-unifier/decision-log.md` (CRLF):

- `:71`, old: "a record that replaces an earlier one says so ("This supersedes ..."). Open remainder is stated here, never in the chunks.]" New: "a record that replaces an earlier one says so ("This supersedes ...").]"
- Insert between `:72` (blank) and `:73` ("**Rule home:** ..."): "**Open remainder:** [None, or after a partial answer the exact question still open, with its named owner and location; never in the chunks. For a question decided in stages, what is still open after the newest record.]" followed by a blank line.

**4. Ripple.**

- The Business review register (`decision-log.md:93`) can stay inline: business-reviewer-unifier writes it (`business-reviewer-unifier/apply-and-verify.md:15-21`, `:80-82`), and its remainder always becomes an open item through the step 10 hand-off (`SKILL.md:373`). If it is aligned too, `apply-and-verify.md:15-21` (LF) should list "its open remainder" among the record's parts.
- `SKILL.md:304` (what the record holds): optionally add "and its open remainder".
- `brd-unifier/decision-log.md:49` and `:69` stay inline; its Marker register (`:55-61`) has no remainder line, so the BRD has no such inconsistency.
- Checkers: none read the register layout; `check_sdd.py` scans `decision-log.md` only for links and keyed IDs.

**5. Proof.** None beyond a consistency read.

---

## Item 8. Gate line template

**1. Verification.** Reproduces.

- `chunks/sdd-master.md:38`: "`**E2E gate (chunk 19):** [Locked | Open - Up to date | Stale] - [open conditions E1-E4, if any]`"; `TEMPLATE-COMBINED.md:12` is the same with `(§24)`.
- `SKILL.md:328`: "update the master (chunk 19 linked, E2E gate `Open - Up to date`, E2E basis written)"; `parts-mode.md:133` example: "Locked - E1 (chunk 18 not written yet)".
- The baseline line (`BL/refunds-platform-sdd-master.md:30`): "Open - Up to date - E1 to E4 verified against the files on 2026-10-07: E1 met (47 items: ...); E2 met ...; E3 met ...; E4 met (the Reconciled entry above)". The same facts sit on the Reconciled line (`:29`), in the E3 inventory (`:33` on) and in `BL/decision-log.md:925`.
- Related, same decision: the run also put the faithfulness result on the E2E basis line (`:31`), which the placeholder (`chunks/sdd-master.md:39`) does not list.

**2. Class.** S. One fact, one home (principle 10) decides it: the evidence already has three homes.

**3. Fix.**

- `sdd-unifier/chunks/sdd-master.md:38` (CRLF). Old: "`**E2E gate (chunk 19):** [Locked | Open - Up to date | Stale] - [open conditions E1-E4, if any]`" New: "`**E2E gate (chunk 19):** [Locked | Open - Up to date | Stale] - [Locked or Stale: each unmet condition E1-E4 with a short reason; nothing follows Open - Up to date, whose evidence is the Reconciled line, the E3 marker inventory, and the E2E basis line]`"
- `sdd-unifier/TEMPLATE-COMBINED.md:12` (CRLF): the same, with `**E2E gate (§24):**`.
- Recommended with it: `chunks/sdd-master.md:39` and `TEMPLATE-COMBINED.md:13` (E2E basis placeholder): before "; None until chunk 19 is written" add "; the faithfulness check: its date and its mismatches by label". This gives the run's basis content a slot.

Alternative: allow "E1 to E4 met on [date]" after `Open - Up to date`. It duplicates the date the E2E basis line already holds.

**4. Ripple.** `SKILL.md:327` (gate shut: "List each failed E1-E4 condition and exact OI/divergence/marker source, named owner, dependent output and next action.") optionally: the gate line names the failed conditions; the full list goes to the handoff (`SKILL.md:350`). `chunking.md:163`, `:182` and `modes.md:128`, `:144` copy the line unchanged: no change. `business-reviewer-unifier/apply-and-verify.md:127` only sets Stale: no change. Checkers: `check_e2e.py:148` reads the line; `:163` and `:168` match by prefix (`startswith("Stale")`, `startswith("Open - Up to date")`), so both forms pass; `tests/test_chk_regressions.py:99-108` edits by prefix: unaffected.

**5. Proof.** None needed; S4 shows the bare line passing `check_e2e.py`.

---

## Item 9. Applied answer leaves a dependent neighbour inconsistent

**1. Verification.** Reproduces.

- `SKILL.md:303`: "Apply the Recommended Answer (or adjusted text) to the referenced chunk(s)/section(s) as plain design text in present tense, fitted to the chunk (...)". Nothing allows carrying a decision to other text it makes wrong.
- Step 6a (`SKILL.md:305`) reconciles registries, not prose cells; the one-clear-side routes exist only in step 6a (`:245` "Fix what you can") and the faithfulness source corrections (`:330`).
- Baseline OI-46 (`BL/18-open-items-and-clarifications.md:799-814`): after OI-45, the §15.6 API-09 row still asked for an "Opening balance file or feed specification", a form §3 Assumption 8 now rules out. OI-46 also held a real choice (option A, the full call fields, against option B, rename only), so under any option part of it would still be an OI.
- Precedent in brd-unifier: `brd-unifier/delivery-chunks.md:186`, `Corrected` "through an applied decision that the correction only carries to text that still contradicts it or leaves it out; name the decision's ID".

**2. Class.** D. A process change with more than one reasonable answer; it changes what a review pass leads to.

**3. Options.**

- **A. Keep.** Any text an applied decision leaves inconsistent becomes a new OI. Effect: full owner control; one more decision and review pass per neighbour (the OI-46 pattern); the three-pass cap is reached sooner.
- **B. The author carries the decision while applying it.** Other text that the decision makes wrong, and that the decision leaves one clearly right wording, is brought in line in the same step and named with the OI ID in the Changes Log row; the application check verifies it; text that needs a choice is a new OI. Effect: fewer OIs; the reviewer stays read-only; mirrors the BRD's carried correction and the SDD's own one-truth routes.
- **C. The application check reports a "carry" instead of an OI.** The author applies it without a decision; the next pass verifies it; on the last pass it waits like any last-pass finding. Effect: closest to the finding's wording; adds a new finding type to chunk 18 and depends on the pass budget.

**Recommended: B.** It removes the mechanical part of the OI-46 pattern without a new finding type, keeps the reviewer independent, and uses a rule the BRD already has.

Recommended text (B), `sdd-unifier/SKILL.md:303` (CRLF), after "A decision that sets architecture direction becomes (or updates) an ADR in chunk 06.", insert: " Other text that the decision makes wrong is brought in line in the same step when the decision leaves it one clearly right wording (the same fact stated again, a count, a cross-reference, a request for something the decision rules out). Name the OI ID with that text in the Changes Log row; the application check verifies it. Text that needs a choice is a new open item."

**4. Ripple.** `SKILL.md:257` already covers "changed chunks/dependents": optional mention of carried text. `chunks/18-open-items-and-clarifications.md:85` and `TEMPLATE-COMBINED.md:1801`: optionally, an application check row names the carried text in its Checked cell. `SKILL.md:306` (Changes Log row): fits. brd-unifier: the precedent, no change. lld-unifier: leaves items to the team (no acceptance loop), no change. Checkers: none.

**5. Proof.** No saved state reproduces the OI-45 application (only SDD 1.3 and 1.7 are saved; the v1.6 working state is gone). A consistency read is enough for the text; the next live run with an accepted answer exercises it, or S4 can include one accepted item.

---

## Item N7. brd-to-sdd.md:44 "the only thing another skill writes into the SDD"

**1. Verification.** Reproduces. `sdd-unifier/brd-to-sdd.md:44`: "That row is the only thing another skill writes into the SDD." business-reviewer-unifier writes SDD content, a Changes Log row, a version bump, decision-log records and the Stale mark (`business-reviewer-unifier/SKILL.md:79-84`; `apply-and-verify.md:15-21`, `:87-104`, `:118-128`); `sdd-unifier/SKILL.md:373` takes that hand-off. The lld-unifier side is already right: `lld-unifier/SKILL.md:368`, `lld-unifier/sdd-to-lld.md:210`, `lld-unifier/README.md:70`, `README.md:155` and `:436`.

**2. Class.** M.

**3. Fix.** `sdd-unifier/brd-to-sdd.md:44` (CRLF). Old: "That row is the only thing another skill writes into the SDD." New: "That row is the only thing lld-unifier writes into the SDD. A business review (`business-reviewer-unifier`) may also change SDD content; SKILL.md step 10 takes its hand-off."

**4. Ripple.** None required. `README.md:30` ("The only write back up the chain is the LLD registering itself in its parent SDD, and the review panel can challenge ...") stays true, and the README audit already covered it. `chunks/00-cover-and-changelog.md:37` and `TEMPLATE-COMBINED.md:43` say only "Written by lld-unifier": fine. Checkers: `check_refs.py:113-123` checks the Child LLDs columns, not this sentence.

**5. Proof.** None.

---

## Limits of this triage

- Nothing was rerun live. The behaviour proposed for items 3, 5 and 6 is not proven by a run; S4 is the proposed proof.
- Item 4 was reproduced only on a scratch copy of the baseline (since deleted); the saved baseline is clean.
- Item 1: the records show the labels of the v1.7 pass 1, not the brief the reviewer was given.
- All 31 checker tests pass on the current tree (`python -B -m unittest discover -s _fixtures/checkers/tests -p "test_*.py"`, run on temporary copies).
- The working tree shows `UNIFIER-ENHANCEMENTS.md` and `_fixtures/notes/step6-plan.md` modified at 13:31. This triage did not touch them.

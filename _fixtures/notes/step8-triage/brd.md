# Step 8 triage: brd-unifier notes (condensed)

A read-only agent triaged the 11 notes of run S3, plus two checker findings: TD-03 in S3, and TD-88 in the step 7 S3 output. It verified each one against the working tree, which already held commit 6cc2f93. Claude Code checked every anchor before applying. The user accepted all the design recommendations on 2026-10-08.

| ID | Class | Outcome |
|---|---|---|
| B1 | M | Applied. A rejection is typed through Other (SKILL.md acceptance loop), as sdd-unifier already says. "accept, adjust, defer, or reject" in chunk 13, brd-unifier/README.md (two places) and the root README. |
| B2 | N | The texts agree: the first build's 1.0 row takes the loop's items and keeps `Chunks: none (initial build)`. No change. |
| B3 | D, accepted A | Applied. A pending dependency or an unconfirmed assumption that carries a marker gets one `Assumption to validate` row only when the marker asks its own question (for an assumption: whether it holds). Otherwise there are two rows (delivery-chunks.md, Step 1). Not rerun: goes to step 9. |
| B4 | D, accepted B | Applied. Two "restore, never choose" mechanical corrections: a rule restated outside its home (the home wins, and the copy becomes a link), and a statement that settles what an open item or marker still asks with no decision record behind it (the open question wins). |
| B5 | D, accepted C | Applied. A third-run mechanical correction that changes only chunk 14 or a companion record is applied at once as `Corrected`, with § Verification before presenting rerun on chunk 14. The waiting rule and the `Decided - pending application: TD-NN` disposition now cover only fixes to chunks 00-13 (delivery-chunks.md, three places; sow-transformation.md). Not rerun: goes to step 9. |
| B6 | S | Applied. `Pending gate` (and, as an accepted extra, `In progress`) joined the mockup Status list. `Blocked by TD-NN` is for a started row; an unstarted row stays `Pending gate`, and its decisions cell names the item. |
| B7 | D, accepted A | Applied. A dependency needed before the build of a use case is P1; one needed before BAT sign-off or go-live is P2. |
| B8 | N, optional wording accepted | Applied. Without a yes to the Mermaid CLI, use the line-by-line check (mermaid-diagrams.md). |
| B9 | S | Applied. "a link to the Resolution Log" in 6 places (table rows have no anchors). |
| B10 | D, accepted A | Applied. A new sow-transformation.md principle 7, "Never pick a side silently": when two source parts disagree, propose the version from the part mapped to that BRD home, and name the other part; when neither maps, flag both. |
| B11 | S | Applied in brd-unifier, sdd-unifier and lld-unifier. "Project / system name: if neither the request nor the source states it." |
| B12 | S | Applied. TD-03 was a run miss, but the marker step invited it: "A marker asks one question: an item about two things gives two markers" (sow-transformation.md). |
| B13 | D, accepted A | No text: B5 C removes rows like TD-88, whose Blocks cell named only `decision-log.md`. |

Ripple not taken: brd-unifier/SKILL.md's business-review hand-off row has no repeat check, unlike the sdd-unifier S3(a) decision. It is listed for step 9.

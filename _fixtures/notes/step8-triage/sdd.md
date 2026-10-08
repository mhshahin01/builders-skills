# Step 8 triage: sdd-unifier notes (condensed)

A read-only agent triaged the 8 notes of run S4a against the working tree. Claude Code checked every anchor before applying. The user accepted all the design recommendations on 2026-10-08.

| ID | Class | Outcome |
|---|---|---|
| S1 | S | Applied. A problem lies in text this request changed when the request added, changed, or removed words on any side of it; an untouched clause of an edited sentence or table cell does not count (SKILL.md step 8b item 3). This keeps decision 3 B's purpose. |
| S2 | S | Applied. Behind a Stale mark, chunk 19 is not regenerated. The body and version are kept only when the faithfulness check finds no mismatch; a fix gives chunk 19 the update's version, and chunk 19 is listed after `Chunks:`. |
| S3(a) | D, accepted A | Applied. The business review row first checks whether an earlier update took this review. If it did, and the review has no newer row, the request applies pending items, runs the Child LLDs check, and changes nothing else; a new delta review runs only on request. The root README says a repeat changes nothing but its pending items. |
| S3(b) | S | Applied. When an update also runs a delta review, that review is its one baseline. It covers the chunks the pending items changed, checks the applied text against their decisions, and writes no separate application-check rows. Also applied in chunk 18 and the combined template. |
| S4 | D, accepted B | Applied. Content that does not match the newest Reconciled entry, with no newer Changes Log row to explain it, holds an edit made outside the skill. Once found, it joins this update's row, its chunk is listed, the handoff names it, and chunk 19's claim check counts it (E4). |
| S5 | D, accepted A | Applied in sdd-unifier: `[YYYY-MM-DD] delta: chunk NN (vX.X)` and `[YYYY-MM-DD] application check: OI-NN (vX.X)`, with the SDD version when the review runs; earlier rows keep their labels (SKILL.md, chunk 18, combined template). The lld-unifier half follows its triage (`lld.md`). |
| S6 | N, optional wording accepted | Plant artifact. Applied as hardening: an item left `Decided - pending application` gets its decision-log entry when it is applied (decision-log.md). |
| S7 | N | Plant artifact: the planted register rewrite kept the 1.8 header. |
| S8 | N | Not exercised: no marker blocked the gate, so the walk and the person-only answers had nothing to do. |

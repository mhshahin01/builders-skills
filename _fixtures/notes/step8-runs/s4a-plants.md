# S4a plants (kept out of the repository until the S4a run ends)

Input: `chain-pre-plant/` is `s7/runs/chain-after-sdd` (SDD 1.8, LLD 1.3) unchanged. `chain/` (the run folder) and `chain-before-s4a/` hold the planted state. The fixture checkers on the planted state report: links 0 broken; check_sdd 0; check_versions 0 notes for the SDD and LLD; check_e2e E1 not met (OI-48 pending), master gate line "Stale - E1: OI-48 is Decided - pending application", 1 problem (P2: "Counts at a Glance In-process domain events: 11 vs 10"), and E4 "NOT met (same day: row 1.9 after the last step 6a row)". That E4 reading is the checker's same-day order heuristic: row 1.9 changed only chunk 18, which is not a reconciliation source.

## P1: a pending decision (sdd 1, sdd 9)

- New OI-48 in chunk 18 (after OI-47): "A moved branch manager keeps the old branch for up to 15 minutes". Status `Decided - pending application: Option A, decided by the test PM on 2026-10-07; the next request applies it.`
- Recommended Answer (Option A) names only the home: 13b §17.2 Business Logic, Branch assignments: "the `branch-assignment-refresh` job reads API-06 every 15 minutes" becomes "... every 5 minutes".
- Carry targets (not named in the answer; one clearly right wording each):
  - 13b §17.2 Input, Schedule row: "`branch-assignment-refresh`, every 15 minutes and at a branch manager's first request in each sign-in session" (15 becomes 5);
  - 08 §12 INT-05, When: "branch assignments refreshed every 15 minutes and at a branch manager's first request in each sign-in session" (15 becomes 5);
  - 08 §12 INT-05, Fallback: "with an alert when they are older than 30 minutes (two refresh intervals)" (30 becomes 10).
- Unchanged and still right: 16 §20.1.9 "older than two refresh intervals" (relative wording).
- The skill's records for P1: chunk 18 VERSION 1.9; decision-log Clarification register sentence plus an OI-48 record before "## Marker register"; chunk 00 VERSION and Version 1.9, the Child LLDs note "SDD is now v1.9", and a Changes Log row 1.9 (`Chunks: 18`); the master VERSION 1.9, its gate line "Stale - E1: OI-48 is Decided - pending application", and its E2E basis line ending "Not verified for v1.9: the gate is shut on E1 (OI-48)."
- Backstory limit: the 1.9 row says OI-48 came from an owner's question "after the last review pass of the request". That is a simplified history; no review pass is recorded for 1.9.
- Chunk 19 does not mention the refresh interval, so applying P1 changes no chunk 19 claim, and chunk 19 should take the keep path behind its Stale mark.

## P2: a chunk 19 mismatch (sdd 6)

- `19-e2e-system-design.md` Counts at a Glance: "| In-process domain events | 10 | §14.10 (chunk 10) |" became "| 11 |". The source §14.10 lists 10, and Figure 31 draws 10.
- Expected: the faithfulness check behind the Stale mark labels it "wrong"; it is fixed back to 10 in chunk 19 and confirmed without a full rerun; chunk 19 then changed content, so it takes the new version and is listed under `Chunks:`.

## P3: an unchanged-text source problem (W2 A)

- `13a-service-customer-accounts.md` §17.1 Business Logic: "The daily `account-closure` job closes every active account" became "The daily `account-closing` job ...". The clearly right side is `account-closure`, used by the 13a Schedule row, three other 13a mentions and chunk 09.
- No S4a request changes 13a, and chunk 19 never names a job.
- Expected, when the faithfulness check notices it: it is recorded in chunk 18 Reviewer Notes with its source, owner and reason, neither fixed nor raised, and named in the handoff; the note bumps nothing. If no check notices it, W2 A is scored "not exercised".

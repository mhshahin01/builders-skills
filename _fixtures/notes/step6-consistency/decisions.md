# Stage C: items held for the user's decision (2026-10-04)

The four consistency reports in this folder found 114 items. The mechanical and simple ones are applied by one fix agent per skill folder (briefs as launched: this session's transcript; item lists in `../step6-plan.md` § Stage C fixes). These 11 change a decided rule, a template, a hand-off, or a cross-skill format, so they wait for the user. Source items are cited as report:ID.

| # | Source | Issue | Recommended | Alternative |
|---|---|---|---|---|
| C1 | brd:A-2 | `Needed before` "a task" can never name a TASK-NN: chunk 02 is filled before chunk 15 exists, and adding one later marks 15-17 Stale | "Build of UC-NN"; chunk 15 lists the dependency under the blockers of the task that delivers that use case; the sdd-unifier mapping row matches | A fixed milestone, "Build start" (loses which use case waits) |
| C2 | lld:A-8 | The DB Modeling row tells LLD chunk 05 to restate §8.3 and §8.5 to §8.7, which principle 13 calls Duplication | Only §8.2 restates (Source per row); §8.3 and §8.5 to §8.7 link the SDD and add the implementation delta | Give §8.3, §8.6, §8.7 Source columns and add them to the derived-view list |
| C3 | lld:B-3 | A BRD newer than the SDD's Source BRDs register when the LLD runs | The LLD's offer names it and suggests updating the SDD first; the trace refresh waits for the SDD | Refresh the trace from the newer BRD at once and flag each §7.3 disagreement `> Confirm:` |
| C4 | lld:B-4 | The LLD ERD after S2-3 made the SDD ERD keys and relationships only | The LLD §8.1 ERD follows the SDD's (keys and relationships, no line cap; columns in §8.2) | Keep the LLD ERD with columns, drawn from §8.2 |
| C5 | lld:B-7 | SDD §18.5 targets no §18.2 row realises (availability, integrity, lag); LLD chunk 12 only has per-endpoint rows | Realise each where its Realised in section maps (09, 03, or the owner's 04 file); §18.2 targets stay chunk 12 rows | Force every target into a chunk 12 §15.1 row |
| C6 | lld:B-9 | A `### Workflow:` route (a report page) whose screen has a chunk 14 row: L2-6 and L2-10b give opposite cells | The chunk 14 row wins: Screen cites it, Use cases "None - no BRD use case", route data `screen` only | Always "None - no BRD screen" |
| C7 | lld:B-10 | From-code flags only a DB write plus a broker send; E4 widened the outbox | Add a HIGH finding for a provider call or in-process delivery after a state change with no outbox, when the SDD says it must not be lost (no SDD: `> Confirm:`) | Leave from-code detection as is |
| C8 | cross:B-7 | A review point on a pre-BRD that leaves an open question: no decision log, so no hand-off raises it | The tracker's Decision cell states it; the BRD hand-off raises it in the BRD made from that pre-BRD | The review writes it into pre-BRD chunk 24; or such a point is Deferred |
| C9 | sdd:B-8 | Read literally, S2-4d puts a marker on the API style ADR when a BRD mandate or the user names another style | Write the ADR from the mandate or the user's choice; a marker only when nothing settles the style | Keep the literal wording |
| C10 | cross:B-3 | "So the user can ask for more" (K4) has no path, and the findings file is write-once (K6) | A reviewer asked for more is re-dispatched once, before the walkthrough; new findings join the tracker and the findings file, which is write-once from the walkthrough on | Drop the phrase; the left-out counts are information only |
| C11 | brd:B-9, lld:B-2, cross:B-1, sdd:B-4 | The `Chunks:` list of a combined BRD or SDD (no chunk files) | Every combined document lists sections, as the LLD and the reviewer already do; lld-unifier step 3c maps sections to chunks through its field mapping; a re-chunk takes each chunk's VERSION from the newest row naming it or one of its sections | A combined BRD or SDD lists the chunk numbers of its changed sections |

Applied as mechanical although one checker had flagged them (the user may object): brd:B-7 (go-live dependencies listed, not in place at BAT sign-off: the W-10 decision as written); lld:A-9 = cross:A-9 (the Child LLDs SDD version is the version the LLD reflects, so a declined refresh keeps the out-of-date note); cross:B-5 = brd:B-1 (the BRD hand-off after a review bumps only for its own content change, as the SDD's does); lld:A-5 = cross:B-8 (F3's Superseded and Reopened outcomes in the LLD, as the F3 row reads). sdd:A-1 and sdd:A-8 follow W7 and E4 and add work: chunk 19 goes Stale after any change to chunks 02 to 13x, and step 6a reruns after every marker walk and any 09 to 13x change.

Dropped as duplicates (one fix applied): brd:A-6 = cross:A-2; brd:A-7 = lld:A-4; lld:A-10 = cross:A-1; cross:A-3 = brd:A-1 + sdd:A-6; sdd:B-6 = lld:A-3; brd:B-3 merged into cross:B-9.

Root README statements now wrong (brd 1, lld 8, cross 13, sdd 6, overlapping) go to stage RM.

## User's answers

2026-10-04: the user accepted every recommendation (C1 to C11). Each folder's decision edits follow its fix agent. Implemented the same day (list in `../step6-plan.md` § Stage C fixes). Checker follow-up for stage CK: check_trace must accept C6's route cell ("None - no BRD use case" with a chunk 14 screen).

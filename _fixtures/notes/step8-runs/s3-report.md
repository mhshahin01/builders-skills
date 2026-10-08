# Step 8 run S3: BRD from the saved pre-BRD (condensed report)

Run: brd-unifier read from disk, `chunks whole`, the Clinic Reminders pre-BRD (`scenarios/pre-brd-to-brd/run/pre-brd-clinic-reminders`, unchanged). Background agent, 2026-10-07 19:12 to 22:41 local, brief `briefs/s3.md` in the session scratchpad (answer policy: accept recommendations except those that add business behavior; person-only facts as test-fixture values with an owner; no approver; no confirmed sessions). Output saved as `scenarios/pre-brd-to-brd/rerun-2026-10-07-s8/brd-clinic-reminders/`. Claude Code checked the claims below against the files; the scorecard is in `../step8-plan.md` § Results so far.

## Output
- **BRD:** 1.0, Draft, delivery gate Shut; chunks 15-17 not written.
- **Content:** 3 personas, 17 use cases, 3 Mermaid figures.
- **Checks:** 822 links resolve; versions 0; Mermaid 0. `check_todo.py`: 0 problems, 1 note (TD-03 holds two questions).
- **Questions:** 43, all answered by the policy:
  - batch 1: the key colour (test-fixture value), then OI-01 to OI-03;
  - batches 9 to 11: three adjusted answers and OI-32 to OI-39.

  No intake question was needed.
- **Review:** a cleared-context reviewer wrote 31 items and 3 scope proposals (none adopted). Consistency Run 1 raised OI-32 to OI-39.
- **Decisions:** 39 items.
  - 27 accepted.
  - 3 adjusted: OI-18, OI-24, OI-27. Each needed a rejected item's content, so it was asked again.
  - 9 rejected: each added a persona, use case, report, message or policy.
- **Consistency check:** 3 runs, 32 findings.
  - 14 Corrected, 8 raised as open items (all resolved), 1 Deferred, 3 No change.
  - 6 found by or after the third run are `Decided - pending application: TD-87` to `TD-92`.
- **To-do register:** 92 rows: 69 Open question, 10 Assumption to validate, 13 Pending decision.
- **Markers:** 106 questions (47 gaps, 59 proposals). Two proposals come from the user's global defaults, named as such.

## Deviations
- The reviewer sub-agent wrote a scratch folder outside the run folder, then deleted it.
- The run used a `_work` folder inside the project folder, deleted at the end.
- Mermaid was checked line by line: no parser was installed, and the brief allowed no questions.
- One part of OI-14 was missed when applied; consistency Run 1 caught it (CF-18).

## Unclear or conflicting skill text (triaged in `../step8-triage/brd.md`)
1. The loop options have no Reject, while chunk 13 has a Rejected status.
2. Step 8's "this update's Changes Log row" against the first build's single row ending `Chunks: none (initial build)`.
3. The one-row rule covers dependencies with a marker, not pre-BRD assumptions with a marker.
4. The closed list of mechanical corrections forced a second loop in the first build.
5. Third-run discoveries wait even for pure chunk 14 bookkeeping.
6. The mockup Status list lacks `Pending gate`, beside `Blocked by TD-NN`.
7. Priority for a roadmap dependency is hard to set from "the source says settle before build".
8. "Ask before running the Mermaid CLI" cannot be followed in a run with no questions.
9. A stub links "its Resolution Log row", but table rows have no anchors.
10. No rule for two source chunks that disagree (pre-BRD 20 against 21).
11. "Project/system name: if not stated" does not say whether a name stated by the source counts.

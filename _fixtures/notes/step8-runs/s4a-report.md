# Step 8 run S4a: three requests to SDD 1.9 (condensed report)

## The run

- **Skill and input:** sdd-unifier read from disk, on step 7's scratch snapshot `chain-after-sdd` (SDD 1.8 with LLD 1.3). Three plants were added first (`s4a-plants.md`, patch `s4a-plants.diff`), which make it 1.9.
- **Agent:** a background agent, 2026-10-07 19:21 to about 23:30 local, with the brief `briefs/s4a.md` in the session scratchpad.
- **Answer policy:** accept recommendations except those that add business behavior; person-only facts get test-fixture values; decline the marker walk.
- **Saved output:** `chain/run-2026-10-07-s8/` (evidence, not the baseline, together with S4b).
- **Verification:** Claude Code checked the claims against the files.

## Requests
1. **"Apply the decided items" (1.9 to 1.10).**
   - **Planted OI-48 applied:** the branch-assignment refresh moved from 15 to 5 minutes. The update's only review pass was `[2026-10-07] application check: OI-48`.
   - **Carry rule:** the 13b Input row, the INT-05 When cell and the INT-05 alert threshold (now 10 minutes, two refresh intervals) were brought in line and named in the row.
   - **Faithfulness check behind the Stale mark:** 1 wrong (the planted 11 in-process events) and 1 cosmetic. Both were fixed and confirmed by the same agent, and chunk 19 took v1.10.
   - **Planted `account-closing` (13a):** found through the Reconciled hash and by the check. It was fixed at the source because chunk 19 Figure 33 names the job.
   - **Other source problems:** 11 recorded in chunk 18, neither fixed nor raised.
   - **Gate:** Open - Up to date.
2. **Two 13e Retention Policy rules from the architecture owner (1.10 to 1.11).**
   - **Decision log:** Action entries quote the instruction, with `Rule home:` §17.5 Retention Policy.
   - **Delta review of 13e:** OI-49 and OI-50; scoped checks raised OI-51. All three were applied in three passes.
   - **Faithfulness check:** 3 cosmetic fixes, and chunk 19 took v1.11.
   - **Raised and pending:** a source problem with a dependent claim became OI-52, decided and pending at the review cap.
   - **Recorded:** 8 other source problems.
   - **Gate:** Stale on E1.
3. **"The business review changed this SDD", sent again for the step 6 review (1.11 to 1.12).**
   - OI-52 was applied first.
   - The delta review of 01, 04, 07, 08, 13b, 13e and 14 raised OI-53 to OI-57; the scoped checks raised OI-58 and OI-59. All were applied in three passes.
   - The last pass raised OI-60 and OI-61, left pending.
   - Chunk 19 was not written; the gate is Stale on E1.

## Checks on the saved copy
- Links, uc links and keys, versions, Mermaid and e2e: 0.
- `check_sdd`: 3 problems the run added: an unlinked `REFUNDS/UC-01` in the OI-54 heading, an unlinked `LOYALTY/UC-01` in a decision-log entry, and an unkeyed `NFR-01` in a delta row.

## Deviations
- A pass-3 reviewer wrote a scratch file outside the folder; the run deleted it.
- Mechanical checks ran as inline Python.
- The handoffs were delivered in the report.

## Unclear or conflicting skill text (triaged in `../step8-triage/sdd.md`)
1. The unit of "text this request did not change".
2. On the Stale path, "keep the body and version" against "fix any mismatch".
3. Two questions about the business review row:
   - (a) There is no rule for a repeated hand-off.
   - (b) Which baseline applies when pending items and a delta review meet?
4. No rule for an edit that no Changes Log row records.
5. Same-day coverage-row labels collide.
6. A plant artifact: a decision-log record for a pending item.
7. A plant artifact: the register header was not bumped.
8. The marker walk and the person-only policy never triggered.

# Review Comments Tracker

**Created:** 2026-10-06
**Source:** Business review of REFUNDS v1.7, LOYALTY v1.7, Refunds Platform SDD v1.3; LLD v1.1 is lineage context only.
**Reviewers:** Business Owner (BO), Retail refunds and loyalty SME (SME), Product Manager (PM), Principal Architect (PA), Document Consistency (DC)
**SME domain:** retail refunds and loyalty
**Runtime:** Codex, separate disk-reading persona passes in the same context under resume-codex.md.
**Status values:** Pending | Decided | Applied | Partially applied | Rejected | Deferred
**Panel findings:** [review-panel-findings.md](review-panel-findings.md)
**Standing decisions:** Accept recommendations. Reject new business behavior neither BRD states. Person-only answers use named-owner test-fixture values. The user authorized R3a only; hand-offs require a separate go.

| ID | Reviewer | Concern (short) | Target doc(s) | Status | Decision |
|----|----------|-----------------|---------------|--------|----------|
| BO-01 | Business Owner | Corrections cannot count distinct upheld complaints; merged with SME-01, PM-01, DC-01 | LOYALTY 09, 10; SDD 14, 13e | Applied | Use the owner-held monthly upheld-complaint tally; the product report counts corrections only. Test-fixture business fact, owner LOYALTY. Supersedes TD-53 and the complaint-source part of TD-16. BRD and SDD applied; BRD plan and suite refreshed in R3b (LOYALTY v1.8). |
| BO-02 | Business Owner | Refund averages lack denominators and empty-sample rules; merged with SME-02, PM-02, PA-02, DC-02 | REFUNDS 01, 09; SDD 01, 13b | Applied | Define cumulative branch-local as-of samples, elapsed-time means and empty averages; assess the target over Paid requests, weighted across branches. Test-fixture clarification, owner REFUNDS. BRD and SDD applied; report tests and fixture mockup check completed in R3b (REFUNDS v1.9). |
| BO-03 | Business Owner | Staff access is absent from REFUNDS dependency and integration tables; merged with SME-03, PM-04, PA-01, DC-03 | REFUNDS 02, 08; SDD 08 | Applied | Add the existing staff-access hard dependency and integration. Test-fixture source confirmation: Retail IT staff sign-in and staff directory, owner REFUNDS. Remove the answered INT-05 source marker; all provider-owned contract fields remain TBD. |
| BO-04 | Business Owner | Card-paid counting rule lacks a BRD requirement and acceptance evidence; merged with SME-04, PM-03, PA-03, DC-04 | REFUNDS 06a, 06b; SDD 01, 13b | Applied | Adopt the existing Approved/Paid counting clarification into the BRD cap rule, confirmation step and appended acceptance criteria. Test-fixture answer, owner REFUNDS. Update R-15 and SDD source wording; diagrams, fixture mockup confirmations and delivery tests completed in R3b (REFUNDS v1.9). |
| BO-05 | Business Owner | Staff personal-data basis remains an unanswered owner question; merged with PA-04, DC-05 | SDD 07 | Applied | Settle the staff-data basis marker with a DPO-owned test-fixture value for the existing processing. Preserve OI-31; its owning skill closes the answered remainder in R3c. No real DPO approval is asserted. |
| SME-05 | Retail refunds and loyalty SME | Branch-settled refunds leave loyalty points unchanged; merged with PM-05, PA-05 | LOYALTY 13; SDD 01 R-09 | Rejected | out of scope for this release (test-fixture policy). Record Rejected as LOYALTY OI-38 and in the BRD and SDD decision logs. Keep portal-paid take-back scope and R-09 unchanged. |

**Progress:** 6 of 6 decision points resolved (25 raw comments, 19 duplicate absorptions).

**Versioning (2026-10-06):**
- brd-loyalty-points: 1.7 to 1.8; one Changes Log row; content chunks 09, 10, 13. No renames.
- sdd-refunds-platform: 1.3 to 1.4; one Changes Log row; content chunks 01, 07, 08, 13b, 13e, 14. No renames.
- brd-refunds-portal: 1.7 to 1.8; one Changes Log row; content chunks 01, 02, 06a, 06b, 08, 09. No renames.

**Skill changes requested:** None.

**Major structural decisions taken during this session:** None. No use case, service, event, objective, deployment model, template column or status was added or removed.

**Verification pass (2026-10-06):** 9/10 before fixes; 2 citation remnants, both fixed as part of BO-04. No second hunt. Full pre-fix commands and template/disk-read records: R3a audit (stage evidence, not kept).
1. SDD 01 R-15 contained an unlinked REFUNDS/UC-01 mention (BO-04): replaced with the keyed link to the business rule home.
2. SDD decision-log BO-04 contained the same unlinked use-case mention: replaced with its keyed source link.

**For the hand-off:**
- R3b complete: REFUNDS v1.9 and LOYALTY v1.8 have current gates and Up to date chunks 15 and 16 in all three places. The affected diagrams, fixture mockup approvals and business acceptance evidence were refreshed. Tasks remain Not started and tests remain unexecuted. Chunk 17 stays Locked.
- R3c complete: SDD v1.5 records REFUNDS v1.9 and LOYALTY v1.8. Step 6a and the delta review ran; OI-29 and OI-31 answered remainders are settled with statuses retained. E2E gate is Open - Up to date and chunk 19 has the v1.5 baseline. No new OI. check_sdd and check_e2e now report 0 problems.
- R3d: Done, 2026-10-06. LLD v1.2 records SDD v1.5 and REFUNDS v1.9 / LOYALTY v1.8. The report/cap/staff refresh and seven new case mappings clear all seven expected findings; check_trace and check_lld_trace report 0 problems. The child row is current, with no out-of-date note. Stage evidence: R3d report (stage evidence, not kept).
- R-09 remains a known release gap after SME-05 was rejected. No new product behavior was designed.

**Hand-offs (2026-10-06):**
1. brd-unifier on [REFUNDS](brd-refunds-portal/refunds-portal-brd-master.md): "update the todo: decisions from the business review of 2026-10-06 (_fixtures/runs-wip/step6-R/review/review-comments-tracker.md)" - Done in R3b, 2026-10-06 (Codex).
2. brd-unifier on [LOYALTY](brd-loyalty-points/loyalty-points-brd-master.md): "update the todo: decisions from the business review of 2026-10-06 (_fixtures/runs-wip/step6-R/review/review-comments-tracker.md)" - Done in R3b, 2026-10-06 (Codex).
3. sdd-unifier on [Refunds Platform](sdd-refunds-platform/refunds-platform-sdd-master.md): "BRD REFUNDS and LOYALTY have a new version, after the business review of 2026-10-06 (_fixtures/runs-wip/step6-R/review/review-comments-tracker.md)" - Done in R3c, 2026-10-06 (Codex). Both parents taken in one v1.5 update, including the review edits and gated E2E refresh.
4. lld-unifier on [Refunds Platform](lld-refunds-platform/refunds-platform-lld-master.md): "the SDD has a new version" - Done in R3d, 2026-10-06 (Codex); one LLD v1.2 update from SDD v1.5 and the current BRD test evidence.

**Close:** 5 Applied; 1 Rejected; 0 Pending, Decided, Partially applied or Deferred. Three documents versioned once. No renames. No template structure or major plan shape changed. R3a is closed. R3b, R3c and R3d are complete. TRIAGE requires the user's next explicit go.

## R3b close - 2026-10-06

Ran in Codex, REFUNDS first and LOYALTY second. REFUNDS 1.8 to 1.9 has one Changes Log row for the BO-04 diagram content update. LOYALTY stays 1.8; its body is unchanged. Each BRD records Runs 19 to 21 and confirmed corrections CF-64 and CF-65. No new OI or TD was raised or closed; TD-16 / TD-53 point to their BO-01 supersession. Both delivery gates are Open, and 15 / 16 are Up to date. No real prototype review or test execution is claimed.

The seven new cases are REFUNDS/TC-REQ-24, REFUNDS/TC-DEC-16, REFUNDS/TC-RPT-04 to REFUNDS/TC-RPT-07, and LOYALTY/TC-REP-04. R3d owns the corresponding LLD trace and spec refresh. R3c owns the SDD parent versions, answered remainders and E2E refresh. R-09 remains a known release gap; OI-38 stays Rejected.

Stage evidence: R3b report (stage evidence, not kept). No SDD, LLD, source, saved-run or skill file changed. Next stage: R3c only, after the user's go.

## R3c close - 2026-10-06

Ran in Codex. SDD 1.4 to 1.5 has one Changes Log row. Source parents are REFUNDS 1.9 and LOYALTY 1.8, both In Review and accepted as derivation inputs under the fixed fixture policy. OI-29 and OI-31 keep Accepted - applied with new settlement records for their answered remainders. BO-03 and BO-05 have marker records. R-15 points to the current cap requirements and REFUNDS/TC-REQ-24 and REFUNDS/TC-DEC-16. No new OI or design behavior was added.

Step 6a passes. Separate disk-reading delta review covers all 16 risk surfaces with no new OI; eight changed-source coverage rows are added. E1-E4 are met before writing chunk 19; its refreshed v1.5 consolidation retains the source topology. Read-only faithfulness finds 0 wrong, 0 misleading, 0 cosmetic and no source problem. The E2E gate is Open - Up to date. Two keyed-reference defects found in final review notes were fixed, and their pre-fix evidence is preserved.

The SDD and E2E checkers now have 0 problems. The child row explicitly marks LLD 1.1 / SDD 1.3 out of date for SDD 1.5; check_lld_trace now has 0 lineage problems. check_trace retains exactly the 7 expected findings for R3d. SDD markers remain 91 (69 in body chunks outside the gate and 22 in review history); LLD TODO / Confirm counts remain 37 / 22. Eleven provider contracts remain TBD - external. Mermaid was read and checked by heuristics, without a parser or renderer. No application tests were run.

Stage evidence: R3c report (stage evidence, not kept). Backup and SHA-256 scope verification cover the SDD, tracker and appended Codex log; both BRDs, child LLD, source folders, saved run, original run, checkers and five skills stay unchanged. Next stage: R3d only, after the user's explicit go. R-09 remains a known release gap after the rejected SME-05 item.


## R3d verification - 2026-10-06 (Codex)

LLD 1.1 to 1.2, CHUNKS / from-sdd. One combined targeted update from SDD 1.5, REFUNDS 1.9 and LOYALTY 1.8. Refund reports reconstruct previous-day as-of state, with separate first-decision/Paid samples and nullable averages; correction rows remain distinct from the external LOYALTY complaint tally. The existing cap/lock design now cites its current requirement and acceptance cases. Staff source is the existing Retail IT directory/sign-in; the DPO-owned basis at SDD §11.6 supersedes the earlier LLD FX-03 reading. Owner-only objective/tally evidence stays outside the product. No new behavior or provider fields were added.

Step 6a passes before Specs; Mission is synthesized and stack/roadmap/project type checked. Own parent row now LLD 1.2 / SDD 1.5. Separate disk delta review adds thirteen coverage rows and no new OI; seven Resolved and one Rejected items remain closed. TODO 37 / Confirm 22 unchanged, with current index labels. All 161 BRD cases are cited; application suites and owner BAT evidence remain planned, not executed. Mermaid: 39 blocks, text/heuristics only.

All 23 checker/comparison commands pass their structural checks. check_trace is 0, clearing the seven expected gaps. 1146 LLD links resolve. Versions and E2E gates remain clean. SDD 91 markers, eleven provider contracts and R-09 are retained design limitations. Backup and SHA scope: sixteen LLD files, only its own parent child row, this tracker and appended Codex log; no unexpected write or protected-file change. Report: R3d report (stage evidence, not kept). Next: TRIAGE only on explicit go; no skill fixes yet. FINAL and after-Codex prompt have not run.

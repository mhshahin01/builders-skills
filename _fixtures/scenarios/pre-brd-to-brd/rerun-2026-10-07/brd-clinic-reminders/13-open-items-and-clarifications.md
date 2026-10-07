<!--
CHUNK: 13
TITLE: Open Items & Clarifications
PROJECT: Clinic Reminders
VERSION: 1.0
DEPENDS_ON: all preceding chunks (00 through 12)
PART OF: BRD - Clinic Reminders
PURPOSE: Output of the post-generation adversarial review. Captures gaps, missing scenarios, corner cases, and ambiguities flagged by a fresh-context reviewer. Every unapplied item carries a concrete Recommended Answer and Why, ready to be applied to the BRD body once the user accepts it. Applied items keep their stable OI heading, Status and Resolution Log pointer; their decision narrative lives in `decision-log.md`.
GENERATED_BY: Codex separate same-context review after re-reading the main BRD and source from disk; no subagent.
WORKFLOW: After this chunk is written, the skill walks the user through each open item and asks them to accept, adjust, or defer the Recommended Answer. Accepted answers are applied to the referenced chunk(s) as plain requirement text, the item gets a Resolution Log row, and it is added to this update's Changes Log row (delivery-chunks.md § Refresh triggers, Version). Deferred and rejected items get a Resolution Log row too.
REGISTER: An applied item keeps its `### OI-NN: [title]` heading, current Status and a link to its Resolution Log row. The full question, options, chosen answer and Why live in `decision-log.md`. Open, Deferred, Decided - pending application and Rejected items keep their full blocks.
LATER ITEMS: The consistency check (14-todo.md step 2), the writing of chunks 15-17, and a live remainder in a decision or marker record that needs a business choice (a business review point included) can add open items after the first review; a missing fact stays a to-do (TD) item only. They use the same schema, say where they came from in their Where field, e.g. "(raised by consistency check CF-03)", and go through the same acceptance loop before anything is applied.
DELIVERY GATE: Chunks 15, 16, and 17 stay locked while any item here is Open, Deferred, or Decided - pending application. Closed means Accepted - applied, Adjusted - applied, or Rejected.
-->

# Open Items & Clarifications

The review ran in Codex on 2026-10-07 as a separate same-context pass, re-reading all draft chunks and the approved-as-is pre-BRD. It is not a separate agent's review. Inline owner questions remain in their requirement homes.

## How to read each item

Applied items retain their heading, status and resolution link. The full options, recommendation, why and fixture decision are in the companion decision log. This BRD's OI IDs are separate from the pre-BRD's OI IDs.

## Open Items

### OI-01: Opt-out has an unsupported active-booking prerequisite

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); full decision [Q-01](./decision-log.md#q-01---opt-out-prerequisite).

### OI-02: Waitlist actor list omits the patient and messaging partner

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); full decision [Q-02](./decision-log.md#q-02---waitlist-actors).

## Resolution Log

| ID | Resolution Date | Resolved In | Outcome |
|----|-----------------|-------------|---------|
| OI-01 | 2026-10-07 | [UC-11 and matrix footnote](./06c-use-cases-patient.md#uc-11-stop-patient-messages) | Accepted recommendation under the fixed fixture policy; removed only the unsupported prerequisite. |
| OI-02 | 2026-10-07 | [UC-07](./06b-use-cases-receptionist.md#uc-07-maintain-the-waitlist); [07](./07-users-use-cases-matrix.md) | Accepted recommendation; actor list and matrix now name the existing participants. |

## Reviewer Notes

| Risk area | Checked | Findings | Notes |
|-----------|---------|----------|-------|
| Scope | Eight Must and six Should rows against 05/06/09/10; Could and Won't boundaries; phases | No unflagged scope gap found | A report-scope tension in source 06 versus 14 is now an inline owner question, not an adopted field. |
| Use-case exception coverage | All 11 UC blocks, defaults, reply conflicts, waitlist failures, payment failures | 1 finding (OI-01) | Undefined outcomes remain inline markers, not new policies. |
| Matrix consistency | All 33 persona-by-UC cells; primary and supporting fields; external parties excluded | 1 finding (OI-02) | Other cells match the actor fields. Access boundaries remain marked. |
| NFRs | 8 measures against source, missing availability/capacity/usability limits | No unflagged gap found | Owner-set measures remain questions. |
| Integrations | Meta, SMS Aggregator, Local Payment Gateway and user-visible failure questions | No unflagged gap found | No new provider or contract term supplied. |
| Security / privacy | Consent, guardians, opt-out, access, sender identity and legal qualification | OI-01 also applies | Source legal claims have not been revalidated; counsel questions remain. |
| Data lifecycle | Attendance evidence, consent records, retention and deletion | No unflagged gap found | NFR-06 and source 08 applicability are explicit questions. |

Editorial corrections: Why sections now name source pain points instead of repeating the goal. The opt-out matrix footnote follows OI-01. Purely linked market questions (pre-BRD OI-02, OI-04, OI-08, OI-13, OI-14) stay upstream; their figures were not copied. Objective-level markers explicitly identify the open pilot, schedule, licence, cost and funding issues. BO-11 retains its price marker. No-Go remains next to the two verdict links; that citation is required, not duplication.

Scope proposal: no new recovery window, queue mode, extra audit viewer, or fee-collection feature was adopted. Such additions would be "out of scope for this release (test-fixture policy)". Existing missing behaviours remain owner questions. Source defaults are used only where the pre-BRD states them; no harness-global default was borrowed.


<!-- MASTER: clinic-reminders-brd-master.md | PREV: 12-appendix-and-wishlist.md | NEXT: 14-todo.md -->

<!--
TYPE: Decision Log
PROJECT: Clinic Reminders
VERSION: 1.0
PART OF: BRD - Clinic Reminders
PURPOSE: Decision history for this fixture transform.
-->

# Decision Log - Clinic Reminders

## How to read

The numbered chunks hold the requirements. This register records the fixed fixture answers used during generation. Upstream open items were approved as-is, not resolved by this run.

## Clarification register

### Q-01 - Opt-out prerequisite

**Question:** OI-01 found that UC-11 required a current booking or waitlist entry and message eligibility. Pre-BRD 04 says an opt-out reply stops all messages, including unwanted messages after a visit.

**Options considered:** A. Remove the unsupported active-booking/consent prerequisite and keep the identity question; follows the source. B. Keep that restriction; adds an unstated barrier and narrows the source opt-out promise.

**Recommended Answer:** A. "The Patient asks to stop messages. An active booking, a waitlist entry or renewed consent is not an opt-out prerequisite. Matching the request to the patient remains the open identity question below."

**Why:** Pre-BRD 04 Patient Pain Relievers supports stopping all messages. Removing a drafted restriction preserves that source behaviour without inventing identity handling.

**Decision record, 2026-10-07:** Fixed fixture answer accepts A within the transform. Applied to UC-11 and the matrix footnote. Identity, channel and pending-message questions remain open in their source homes and TD rows.

**Rule home:** [UC-11](./06c-use-cases-patient.md#uc-11-stop-patient-messages).

### Q-02 - Waitlist actors

**Question:** OI-02 found that UC-07 includes patient replies and messages but its Supporting Actors cell says None.

**Options considered:** A. Add Patient and Meta and derive the patient matrix cell; names the existing participants. B. Remove the reply handoff and split another UC; unnecessary because UC-10 already owns acceptance.

**Recommended Answer:** A. Supporting Actors: Persona: Patient; External: Meta. Matrix UC-07: Receptionist Yes, Patient Yes with the existing scope caveat, Clinic Owner dash.

**Why:** The source waitlist journey in pre-BRD 01 and 04 already involves the patient and WhatsApp, and UC-10 owns acceptance. This fixes the actor accounting without adding a permission.

**Decision record, 2026-10-07:** Fixed fixture answer accepts A. Applied to UC-07 and 07. No requirement or identity question was filled.

**Rule home:** [UC-07](./06b-use-cases-receptionist.md#uc-07-maintain-the-waitlist) and [matrix](./07-users-use-cases-matrix.md).

## Marker register

No requirement-relevant source marker was settled. Purely linked market-question markers were removed from the draft's duplicate question list and retained in the pre-BRD; no source decision changed.

## Business review register

No business-reviewer run was requested for this scenario.

## Walkthrough and delegation history

Generation whole, transform, Codex, 2026-10-07. The user's fixed answers accept recommendations that preserve source scope, reject new business behaviour, and leave owner-only facts to named roles. They authorize no invented owner answer. Both baseline review findings were accepted and applied. The newly visible report-field tension is an owner-only handoff, not permission to add the fields.

### Action entries

The separate review re-read all draft chunks. A full consistency pass follows application, then a scoped recheck follows editorial and navigation corrections. No grill-me session or prototype play-through was claimed. Further discovery, pre-BRD revision, mockup creation, other delivery requests and a mode conversion were offered at the handoff and declined because this scenario asks only for the BRD transform.

## Consistency and handoff record

CF-01 corrects only the source-supported reminder versus waitlist prerequisites. CF-02 makes the unresolved staffing handoff explicit. Both recommendations are accepted under the fixed fixture policy. No owner fact is supplied. Runs and pending items are in [14](./14-todo.md). The initial draft stays version 1.0. Separate requests to resolve the upstream pre-BRD or start delivery work were offered here and declined because S3 is only this transform.

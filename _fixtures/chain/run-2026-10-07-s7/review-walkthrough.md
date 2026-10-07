# Review Walkthrough

Runtime: Codex. The resume brief supplies the decisions non-interactively. Each point re-reads its frozen raw findings and is applied before the next point. This saved presentation records the full options and decision; chat summarizes each current point.

## Point 1 (BO-01): Corrections cannot count distinct upheld complaints

| ID | Concern | Status |
|---|---|---|
| BO-01 | Corrections cannot count distinct upheld complaints (current point) | Pending |
| BO-02 | Refund averages lack denominators and empty-sample rules | Pending |
| BO-03 | Staff access is absent from REFUNDS dependency and integration tables | Pending |
| BO-04 | Card-paid counting rule lacks a BRD requirement and acceptance evidence | Pending |
| BO-05 | Staff personal-data basis remains an unanswered owner question | Pending |
| SME-05 | Branch-settled refunds leave loyalty points unchanged | Pending |

**Issue and why it matters:**

Corrections cannot count distinct upheld complaints

### Raw finding BO-01
Reviewer: BO
Concern: Corrections cannot count distinct upheld complaints
Where: LOYALTY 09 Reporting / Analytics; 10 NFR-01
Why: The success measure counts upheld complaints, but its stated source contains corrections. One complaint can require several corrections, and an upheld complaint may be corrected in another month. A zero correction count cannot establish that the business met its monthly complaint target.
Direction: Separate the business complaint tally from the existing correction report.

### Raw finding SME-01
Reviewer: SME
Concern: Corrections cannot count distinct upheld complaints
Where: LOYALTY 09 Monthly corrections; 06b UC-03 Trigger
Why: An upheld complaint and a recorded correction are different operational events. Staff can uphold a complaint at month-end and record its correction later, or make several corrections for it. The report cannot supply the distinct monthly complaint count as claimed.
Direction: Use existing branch complaint decisions for the business tally, outside this product.

### Raw finding PM-01
Reviewer: PM
Concern: Corrections cannot count distinct upheld complaints
Where: LOYALTY 01 Business Objective 1; 10 NFR-01; 09 Monthly corrections
Why: The trust objective delegates measurement to NFR-01, whose complaint measure is not measurable from its named correction report. The product can pass an accuracy assertion using the wrong population or month.
Direction: Retain the target and name a separate owner-held complaint tally without creating a complaint-management feature.

### Raw finding DC-01
Reviewer: DC
Concern: Corrections cannot count distinct upheld complaints
Where: LOYALTY 09 Monthly corrections; 10 NFR-01; decision-log TD-53
Why: The report states that zero corrections proves zero upheld complaints, while the same row permits several corrections per complaint. TD-53 preserves the original decision, so correcting the assertion needs an explicit supersession record instead of an unexplained text edit.
Direction: Replace the asserted equivalence and preserve TD-53 with a later superseding review record.

| Option | Trade-off |
|---|---|
| A. Owner-held complaint tally (recommended) | Preserves the stated outcome and correction report; uses an external business count. |
| B. Add complaint identifiers and tracking to the product | New business behavior and new report fields; rejected by the fixed release policy. |
| C. Change the target to zero corrections | Changes the meaning of the business objective and can count multiple fixes to one complaint. |

**Recommendation:** Option A, for the reasons in its trade-off.

**Decision under the standing user policy:** Use the owner-held monthly upheld-complaint tally; the product report counts corrections only. Test-fixture business fact, owner LOYALTY. Supersedes TD-53 and the complaint-source part of TD-16. BRD and SDD applied; suite refresh goes to R3b.

**Affected-document sweep before editing:** LOYALTY 09, 10; SDD 14, 13e. Existing gated BRD outputs, the SDD E2E chunk, lineage and LLD refresh are reserved for their owning hand-offs.

## Point 2 (BO-02): Refund averages lack denominators and empty-sample rules

| ID | Concern | Status |
|---|---|---|
| BO-01 | Corrections cannot count distinct upheld complaints | Applied |
| BO-02 | Refund averages lack denominators and empty-sample rules (current point) | Pending |
| BO-03 | Staff access is absent from REFUNDS dependency and integration tables | Pending |
| BO-04 | Card-paid counting rule lacks a BRD requirement and acceptance evidence | Pending |
| BO-05 | Staff personal-data basis remains an unanswered owner question | Pending |
| SME-05 | Branch-settled refunds leave loyalty points unchanged | Pending |

**Issue and why it matters:**

Refund averages lack denominators and empty-sample rules

### Raw finding BO-02
Reviewer: BO
Concern: Refund averages lack denominators and empty-sample rules
Where: REFUNDS 01 Business Objective 1; 09 Branch refund report
Why: The funded outcome is a fall from 10 to 3 days, but the report does not define which requests enter either average or what an empty average means. Different denominators can produce different claims about whether the outcome was achieved.
Direction: Name the samples and the existing daily cutoff; retain the pending-status counts.

### Raw finding SME-02
Reviewer: SME
Concern: Refund averages lack denominators and empty-sample rules
Where: REFUNDS 09 Branch refund report
Why: A branch can have no Paid requests, only cancellations, or still-waiting requests. The narrative leaves operators without a rule for those averages and does not say whether changes after the previous-day cutoff affect the displayed historical state.
Direction: Define the decision and payment samples as of the branch-local cutoff and show no average when the sample is empty.

### Raw finding PM-02
Reviewer: PM
Concern: Refund averages lack denominators and empty-sample rules
Where: REFUNDS 01 Business Objective 1; 09 Branch refund report
Why: There is no common measurement definition joining the 10-day baseline, the 3-day target, and the branch report. A mean of branch means also gives small and large branches equal weight unless its sample rule is stated.
Direction: Use the Paid request population and elapsed time, with a weighted cross-branch measure maintained by the REFUNDS owner.

### Raw finding PA-02
Reviewer: PA
Concern: Refund averages lack denominators and empty-sample rules
Where: SDD 13b Business Logic, Branch refund report; Request and response fields, BranchRefundReport
Why: Both report averages are required decimal fields although an empty branch or a branch with no decisions or payments has an empty sample. The contract leaves an implementer to invent zero, null, or an error, and does not pin the as-of cutoff semantics.
Direction: Define the business samples first and use explicit nullable average values with the existing response fields.

### Raw finding DC-02
Reviewer: DC
Concern: Refund averages lack denominators and empty-sample rules
Where: REFUNDS 01 Objective 1; 09 Branch refund report; SDD 13b BranchRefundReport
Why: The objective, report prose and response schema do not agree on a fully defined population and empty value. The SDD has enough timestamps to implement a rule, but none is stated consistently across the chain.
Direction: Write one settled business definition and carry it into the solution report description and field constraints.

| Option | Trade-off |
|---|---|
| A. Define the existing report samples (recommended) | Clarifies the current outcome and fields, including empty samples. |
| B. Add cohort dashboards and age-percentile reports | New report behavior that neither BRD states. |
| C. Leave the calculation to implementation | Different implementations can claim different outcome results. |

**Recommendation:** Option A, for the reasons in its trade-off.

**Decision under the standing user policy:** Define cumulative branch-local as-of samples, elapsed-time means and empty averages; assess the target over Paid requests, weighted across branches. Test-fixture clarification, owner REFUNDS. BRD and SDD applied; report tests and mockup check go to R3b.

**Affected-document sweep before editing:** REFUNDS 01, 09; SDD 01, 13b. Existing gated BRD outputs, the SDD E2E chunk, lineage and LLD refresh are reserved for their owning hand-offs.

## Point 3 (BO-03): Staff access is absent from REFUNDS dependency and integration tables

| ID | Concern | Status |
|---|---|---|
| BO-01 | Corrections cannot count distinct upheld complaints | Applied |
| BO-02 | Refund averages lack denominators and empty-sample rules | Applied |
| BO-03 | Staff access is absent from REFUNDS dependency and integration tables (current point) | Pending |
| BO-04 | Card-paid counting rule lacks a BRD requirement and acceptance evidence | Pending |
| BO-05 | Staff personal-data basis remains an unanswered owner question | Pending |
| SME-05 | Branch-settled refunds leave loyalty points unchanged | Pending |

**Issue and why it matters:**

Staff access is absent from REFUNDS dependency and integration tables

### Raw finding BO-03
Reviewer: BO
Concern: Staff access is absent from REFUNDS dependency and integration tables
Where: REFUNDS 02 Dependencies; 08 Integrations; SDD 08 INT-05
Why: Staff access and cover details are required to decide and route messages. They are only an assumption in REFUNDS, so the delivery dependency list can omit a day-one dependency that the solution already relies on.
Direction: Add the existing staff-access dependency and obtain a fixture owner/source confirmation.

### Raw finding SME-03
Reviewer: SME
Concern: Staff access is absent from REFUNDS dependency and integration tables
Where: REFUNDS 02 Assumption 3 and Dependencies; 08 Integrations
Why: The manager and cover are setup outside the portal, but no integration row tells the operator who supplies their access and contact details. This is already part of UC-04 and its daily messages, not a new persona capability.
Direction: Name the source and the existing information exchange, with its owner and build dependency.

### Raw finding PM-04
Reviewer: PM
Concern: Staff access is absent from REFUNDS dependency and integration tables
Where: REFUNDS 02 Dependencies; SDD 08 INT-05
Why: UC-04 can appear ready once the three listed REFUNDS partners are verified, although the staff-access and branch-assignment source is absent from that list. This is a dependency sequencing omission for an existing capability.
Direction: Add the missing hard dependency before UC-04 build and retain provider contracts as TBD.

### Raw finding PA-01
Reviewer: PA
Concern: Staff access is absent from REFUNDS dependency and integration tables
Where: SDD 08 INT-05 Notes; 11 API-06 and API-11; REFUNDS 08 Integrations
Why: The solution assumes one staff provider for role brokering and branch assignments, but its INT-05 source question remains marked and REFUNDS does not list the integration. The architecture can bind two different sources without an authoritative business confirmation.
Direction: Settle the source question with the REFUNDS owner fixture answer and list the existing exchange in the BRD.

### Raw finding DC-03
Reviewer: DC
Concern: Staff access is absent from REFUNDS dependency and integration tables
Where: REFUNDS 02 Assumption 3; 08 Integrations; SDD 08 INT-05 Notes
Why: The BRD says external staff access is confirmed, the integration table omits it, and the SDD still asks which source provides it. These three descriptions cannot all express the same settled dependency.
Direction: Align the dependency and integration rows and remove only the source marker the fixture answer settles.

**First principles:** A sign-in establishes who the staff member is; branch assignments establish which requests that person may see or decide. The named directory supplies the branch and cover facts. Without a shared authoritative source, the portal can apply the wrong access facts. This clarification changes no token protocol or revocation rule.

| Option | Trade-off |
|---|---|
| A. Name the existing staff source (recommended) | Closes a required dependency without adding a product capability. |
| B. Build a staff and cover administration screen | Adds new business behavior already assigned outside the portal. |
| C. Keep the source ambiguous | Leaves two required identity/assignment bindings without an owner confirmation. |

**Recommendation:** Option A, for the reasons in its trade-off.

**Decision under the standing user policy:** Add the existing staff-access hard dependency and integration. Test-fixture source confirmation: Retail IT staff sign-in and staff directory, owner REFUNDS. Remove the answered INT-05 source marker; all provider-owned contract fields remain TBD.

**Affected-document sweep before editing:** REFUNDS 02, 08; SDD 08. Existing gated BRD outputs, the SDD E2E chunk, lineage and LLD refresh are reserved for their owning hand-offs.

## Point 4 (BO-04): Card-paid counting rule lacks a BRD requirement and acceptance evidence

| ID | Concern | Status |
|---|---|---|
| BO-01 | Corrections cannot count distinct upheld complaints | Applied |
| BO-02 | Refund averages lack denominators and empty-sample rules | Applied |
| BO-03 | Staff access is absent from REFUNDS dependency and integration tables | Applied |
| BO-04 | Card-paid counting rule lacks a BRD requirement and acceptance evidence (current point) | Pending |
| BO-05 | Staff personal-data basis remains an unanswered owner question | Pending |
| SME-05 | Branch-settled refunds leave loyalty points unchanged | Pending |

**Issue and why it matters:**

Card-paid counting rule lacks a BRD requirement and acceptance evidence

### Raw finding BO-04
Reviewer: BO
Concern: Card-paid counting rule lacks a BRD requirement and acceptance evidence
Where: SDD 01 Risks R-15; REFUNDS 06a UC-01 BR-4
Why: A money-limiting rule has a test-fixture owner answer in the SDD but no business requirement or business acceptance coverage. The business sign-off cannot currently certify the counting rule on which the technical payment limit depends.
Direction: Take the existing owner clarification into the BRD and hand its acceptance coverage to brd-unifier.

### Raw finding SME-04
Reviewer: SME
Concern: Card-paid counting rule lacks a BRD requirement and acceptance evidence
Where: REFUNDS 06a UC-01 BR-4; 06b UC-04 step 4; SDD 13b Amounts
Why: For a partly card-paid receipt, staff must know which other requests reserve the card share and what amount they may approve now. The SDD defines Approved and Paid only, while the business text still states only a per-refund cap.
Direction: Clarify the existing card limit in the business rule and the approval amount, using the REFUNDS owner fixture answer.

### Raw finding PM-03
Reviewer: PM
Concern: Card-paid counting rule lacks a BRD requirement and acceptance evidence
Where: SDD 01 R-15; REFUNDS 06a UC-01 Acceptance Criteria; 06b UC-04 Acceptance Criteria
Why: The known follow-up says the business acceptance suite does not test the card-paid counting rule. The gate was checked before the owner clarification was adopted into the BRD, so the current test baseline cannot be presented as evidence for it.
Direction: Append source acceptance criteria and keep the delivery suite Stale until its owning skill refreshes it.

### Raw finding PA-03
Reviewer: PA
Concern: Card-paid counting rule lacks a BRD requirement and acceptance evidence
Where: SDD 13b Business Logic, Amounts and Decision; 01 R-15
Why: The financial aggregate serializes approval correctly, but the counting policy is sourced from an SDD owner answer rather than the source business rule. A later BRD refresh can overwrite it without realizing it is an agreed financial invariant.
Direction: Give the existing rule a BRD home and repoint the solution narrative without changing events or endpoints.

### Raw finding DC-04
Reviewer: DC
Concern: Card-paid counting rule lacks a BRD requirement and acceptance evidence
Where: SDD 01 R-15; 13b Amounts; REFUNDS 06a UC-01 BR-4
Why: The SDD explicitly labels its counting rule as not yet in the BRD. Once the review gives that rule a business home, both this phrase and R-15 must reflect the new source while preserving the pending delivery-test follow-up.
Direction: Apply the requirement and update both remaining references; retain the historical OI-29 record with a supersession note.

| Option | Trade-off |
|---|---|
| A. Adopt the existing owner cap clarification (recommended) | Makes the implemented business invariant traceable and testable in the BRD. |
| B. Introduce a receipt reservation workflow | Adds business behavior and changes which requests consume the card share. |
| C. Keep the rule only in the SDD | Business acceptance remains unable to certify the technical counting rule. |

**Recommendation:** Option A, for the reasons in its trade-off.

**Decision under the standing user policy:** Adopt the existing Approved/Paid counting clarification into the BRD cap rule, confirmation step and appended acceptance criteria. Test-fixture answer, owner REFUNDS. Update R-15 and SDD source wording; diagrams, mockups and delivery tests go to R3b.

**Affected-document sweep before editing:** REFUNDS 06a, 06b; SDD 01, 13b. Existing gated BRD outputs, the SDD E2E chunk, lineage and LLD refresh are reserved for their owning hand-offs.

## Point 5 (BO-05): Staff personal-data basis remains an unanswered owner question

| ID | Concern | Status |
|---|---|---|
| BO-01 | Corrections cannot count distinct upheld complaints | Applied |
| BO-02 | Refund averages lack denominators and empty-sample rules | Applied |
| BO-03 | Staff access is absent from REFUNDS dependency and integration tables | Applied |
| BO-04 | Card-paid counting rule lacks a BRD requirement and acceptance evidence | Applied |
| BO-05 | Staff personal-data basis remains an unanswered owner question (current point) | Pending |
| SME-05 | Branch-settled refunds leave loyalty points unchanged | Pending |

**Issue and why it matters:**

Staff personal-data basis remains an unanswered owner question

### Raw finding BO-05
Reviewer: BO
Concern: Staff personal-data basis remains an unanswered owner question
Where: SDD 07 11.6 Security, Staff personal data
Why: The design holds employee contact details and decision identities, but the named Data Protection Officer has an unanswered basis question. The fixture can otherwise be read as design-ready without that person-only fact having been settled.
Direction: Obtain the named owner fixture value and record what it answers; do not imply a real legal sign-off.

### Raw finding PA-04
Reviewer: PA
Concern: Staff personal-data basis remains an unanswered owner question
Where: SDD 07 11.6 Security, Staff personal data; SDD decision-log OI-31
Why: The architecture distinguishes staff from customer data correctly, but the staff processing basis remains unresolved after OI-31. The retention and authorization mechanisms do not supply that external owner fact.
Direction: Obtain a DPO fixture value; leave the owner item status and any real sign-off to the owning skill.

### Raw finding DC-05
Reviewer: DC
Concern: Staff personal-data basis remains an unanswered owner question
Where: SDD 07 Staff personal data; decision-log OI-31
Why: The staff basis question appears in current security text, with OI-31 recording its open remainder. A review answer must preserve that history and say exactly which marker and remainder it answers, without changing the owner item directly.
Direction: Add a linked review decision record and send the owner status update through the hand-off.

**First principles:** Authorization limits access, retention limits how long data is kept, and a lawful basis is a separate owner fact about why the existing processing is permitted. One does not supply the others. This session uses the user-authorized fictional DPO answer, not a real legal opinion or approval.

| Option | Trade-off |
|---|---|
| A. Obtain a named DPO fixture value (recommended) | Answers the person-only fact for the existing processing; makes no real approval claim. |
| B. Let the architecture team choose a legal basis | Substitutes technical judgment for the named owner fact. |
| C. Retain the unanswered marker | Leaves the known person-only question unresolved in this fixture. |

**Recommendation:** Option A, for the reasons in its trade-off.

**Decision under the standing user policy:** Settle the staff-data basis marker with a DPO-owned test-fixture value for the existing processing. Preserve OI-31; its owning skill closes the answered remainder in R3c. No real DPO approval is asserted.

**Affected-document sweep before editing:** SDD 07. Existing gated BRD outputs, the SDD E2E chunk, lineage and LLD refresh are reserved for their owning hand-offs.

## Point 6 (SME-05): Branch-settled refunds leave loyalty points unchanged

| ID | Concern | Status |
|---|---|---|
| BO-01 | Corrections cannot count distinct upheld complaints | Applied |
| BO-02 | Refund averages lack denominators and empty-sample rules | Applied |
| BO-03 | Staff access is absent from REFUNDS dependency and integration tables | Applied |
| BO-04 | Card-paid counting rule lacks a BRD requirement and acceptance evidence | Applied |
| BO-05 | Staff personal-data basis remains an unanswered owner question | Applied |
| SME-05 | Branch-settled refunds leave loyalty points unchanged (current point) | Pending |

**Issue and why it matters:**

Branch-settled refunds leave loyalty points unchanged

### Raw finding SME-05
Reviewer: SME
Concern: Branch-settled refunds leave loyalty points unchanged
Where: SDD 01 Risks R-09; LOYALTY 06a UC-02 BR-1; REFUNDS 06b UC-04 E1
Why: A customer whose refund is settled in person after Payout failed keeps the purchase points. The risk is already acknowledged but unresolved and can cause different loyalty outcomes for the same returned items. Closing it requires another source of paid-refund facts beyond the portal-paid refunds the BRD states.
Direction: Consider receiving branch-settlement refund facts; identify that this adds business behavior outside the stated release.

### Raw finding PM-05
Reviewer: PM
Concern: Branch-settled refunds leave loyalty points unchanged
Where: LOYALTY 01 Business Objective 1; SDD 01 R-09
Why: The trust objective can be undermined when a branch refund leaves the points unchanged. The scope expressly consumes only portal-paid refunds; resolving the product gap would broaden that scope.
Direction: Consider branch-paid refunds as a product extension, clearly identified for the test PM policy decision.

### Raw finding PA-05
Reviewer: PA
Concern: Branch-settled refunds leave loyalty points unchanged
Where: SDD 01 R-09; 13e Take-back; LOYALTY 08 Refunds Portal integration
Why: The ledger consumes RefundPaid only from refund-requests. Branch settlements do not produce that event, so no technical reconciliation can take back their points within the current contracts. Closing this requires a new business fact source.
Direction: Consider a branch-settlement feed as a scope addition rather than silently reusing the portal-paid event.

| Option | Trade-off |
|---|---|
| A. Consume branch-settlement refund facts (recommended by the panel) | Would correct the known loyalty gap, but adds business behavior no BRD states. |
| B. Keep current scope and documented R-09 | Preserves the release scope and its acknowledged residual business risk. |
| C. Stop branch settlements | Contradicts the stated REFUNDS Payout failed flow. |

**Recommendation:** Option A, for the reasons in its trade-off.

**Decision under the standing user policy:** out of scope for this release (test-fixture policy). Record Rejected as LOYALTY OI-38 and in the BRD and SDD decision logs. Keep portal-paid take-back scope and R-09 unchanged.

**Affected-document sweep before editing:** LOYALTY 13; SDD 01 R-09. Existing gated BRD outputs, the SDD E2E chunk, lineage and LLD refresh are reserved for their owning hand-offs.

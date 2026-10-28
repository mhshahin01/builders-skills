<!--
TYPE: Decision Log
PROJECT: Loyalty Points
VERSION: 1.7
PART OF: BRD - Loyalty Points
PURPOSE: Single home for the clarification Q&A and decision history; the content chunks hold only the settled requirements.
MAINTENANCE: New decisions are added here, not in the content chunks. The chunks carry only the resulting rules and current-state caveats.
-->

# Decision Log - Loyalty Points

## How to read

The numbered content chunks hold the current settled requirements. This companion file holds why and how they were decided. Read the chunks for what the product must do; read this file for the decision history behind it.

## Clarification register

Q-01 is carried over from the source BRD v1.0. Q-02 to Q-17 are the open items OI-02 to OI-17 of the review of 2026-10-10. Q-18 and Q-19 are OI-18 and OI-19, raised by the consistency check of 2026-10-10. Q-20 to Q-26 are OI-20 to OI-26, raised from the questions the grill-me session of 2026-10-10 left open. Q-27 to Q-30 are OI-27 to OI-30, raised by consistency check Run 5 of 2026-10-10. Q-31 and Q-32 are OI-31 and OI-32, raised by consistency check Run 6 of 2026-10-10. Q-33 and Q-34 are OI-33 and OI-34, raised by consistency check Run 7 of 2026-10-10. Q-35 to Q-43 are OI-35 to OI-43, raised from the open remainders of the business review of 2026-10-10 ([review-comments-tracker.md](../review-comments-tracker.md)). Q-44 to Q-46 are OI-44 to OI-46, raised by consistency check Run 11 of 2026-10-10. Q-47 is OI-47, raised by consistency check Run 12 of 2026-10-10. Q-48 is OI-48, raised by consistency check Run 13 of 2026-10-10. Q-49 is OI-49, raised by consistency check Run 14 of 2026-10-10. Q-50 is OI-50, raised by consistency check Run 15 of 2026-10-10. Q-51 is OI-51, raised by consistency check Run 16 of 2026-10-10. All 51 are decided; their open remainders are clarification markers or to-do rows tracked in 14-todo.md.

### Q-01 - Points taken back when a purchase is refunded

**Question:** OI-01 of the source BRD v1.0. Incomplete historical record: the source kept only a Resolution Log row. The question, Where, Type, Concern, Options and Why were not recorded and are not reconstructed.

**Options considered:** Not recorded in the source.

**Decision record, 2026-09-24:** Accepted - applied in the source BRD v1.0: points are taken back when the purchase is refunded. The decider was not recorded in the source; the source v1.0 Changes Log names Operations Lead (reviewed) and Head of Retail (approved) for v1.0.

**Rule home:** [06a / UC-02 Business Rules & Constraints](./06a-use-cases-member.md#business-rules--constraints-1)

### Q-02 - Earning points is not listed as in scope

**Question:** OI-02 (raised by the cleared-context reviewer on 2026-10-10). The item as raised, with every option, the Recommended Answer and the Why, follows.

**Options considered:**

- **Where:** 04 Project Scope / In Scope; 01 Executive Summary (core capabilities)
- **Type:** Gap
- **Concern:** In Scope lists the points balance and history, and taking points back after a refund. It does not list earning points. Yet 01 says members earn points on branch purchases, 03 sets the earning rule (1 point per 1 EUR), and 08 receives purchase amounts from POS Records "to know which purchases earn points". 08 receives amounts, not points, so someone must apply the earning rule. A reader cannot tell whether Loyalty Points creates the earned movements or only shows movements another system creates. This decides who builds the earning rule, who owns the rounding question in 03, and whether the POS Records row in 08 is correct. The 01 core capabilities list also has no earning entry.
- **Options:**
  - **A.** Add earning points to In Scope and to the core capabilities - matches 03 and 08 as written; the team owns the earning rule and its rounding.
  - **B.** State that another system calculates points, and Loyalty Points only receives and shows them - smaller scope; but 03 then describes another system's rule, the 08 row must carry points instead of amounts, and a new partner must be named.
- **Recommended Answer:** Option A.
  - 04 / In Scope, add as the first bullet: "Earning points on branch purchases, using the earning rule in [03 / Earning points](./03-definitions-and-domain-concepts.md#earning-points) and the purchases received from POS Records ([08 / Integrations](./08-integrations.md#integrations))."
  - 01 / Executive Summary, core capabilities, add as the first bullet: "Points earned on each branch purchase of a member ([03 / Earning points](./03-definitions-and-domain-concepts.md#earning-points))."
- **Why:** Three sections (01, 03, 08) already assume Loyalty Points applies the earning rule, and 08 sends amounts that only this system turns into points. Option A aligns the scope with them. Tradeoff: the team owns the earning rule, so the open rounding question in 03 blocks build.
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-02). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option". Rationale: the Why above. The answer supplies no fact that only a person or provider can give: every such fact stays a clarification marker in the rule home. It adopts no new third-party dependency (AGENTS.md) and sets no rule a source rules out. Open remainder: the clarification markers this answer placed in the rule home; each is a TD row in 14-todo.md.

**Rule home:** [04 / In Scope](./04-scope-and-personas.md#in-scope); [01 / Executive Summary](./01-executive-summary-and-context.md#executive-summary)

### Q-03 - Purchases and points from before the start date

**Question:** OI-03 (raised by the cleared-context reviewer on 2026-10-10). The item as raised, with every option, the Recommended Answer and the Why, follows.

**Options considered:**

- **Where:** 03 Points movement; 04 Project Scope
- **Type:** Gap
- **Concern:** The BRD does not say from which date purchases earn points. 01 calls Loyalty Points "the points service of the loyalty program", which suggests a program may already exist with member points. If it does, members expect to see those points on day one. If it does not, a refund paid after go-live for a purchase made before go-live would take back points that were never earned. The history would then show a negative movement with no earned movement, and the balance would go below 0. This breaks NFR-01 on day one.
- **Options:**
  - **A.** Points start on a set start date: only purchases on or after that date earn points, and refunds of earlier purchases take nothing back - needs no old data; members with past purchases start at 0.
  - **B.** Carry existing points over as an opening movement on the start date - keeps the trust of existing members; needs a third movement kind and a source for old balances.
  - **C.** Load past purchases from a chosen date - full history; needs past POS Records and a bigger first load.
- **Recommended Answer:** Option A, with a check for earlier points. Add to 03 / Points movement a new subsection:
  "### Start of points
  Branch purchases made on or after [NEEDS CLARIFICATION: What is the date from which branch purchases earn points?] earn points. A refund of a purchase made before that date takes back no points and adds no movement to the history.
  [NEEDS CLARIFICATION: Do members have points from an earlier program that must show as an opening balance on the start date?]"
  If the second answer is yes, 03 / Overview gets a third movement kind, "Opening balance", and this item is reopened for Option B.
- **Why:** Option A keeps every taken-back movement matched to an earned one, so the balance never goes below 0 (NFR-01), and it needs no data source the BRD does not name. Only the business knows whether older points exist, so B stays open through the second question. Tradeoff: if there are no earlier points, members with past purchases start at 0.
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-03). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option". Rationale: the Why above. The answer supplies no fact that only a person or provider can give: every such fact stays a clarification marker in the rule home. It adopts no new third-party dependency (AGENTS.md) and sets no rule a source rules out. Open remainder: the clarification markers this answer placed in the rule home; each is a TD row in 14-todo.md.

**Rule home:** [03 / Start of points](./03-definitions-and-domain-concepts.md#start-of-points)

### Q-04 - Business Objectives have no measure

**Question:** OI-04 (raised by the cleared-context reviewer on 2026-10-10). The item as raised, with every option, the Recommended Answer and the Why, follows.

**Options considered:**

- **Where:** 01 Business Objectives
- **Type:** Ambiguity
- **Concern:** Objective 1 ("Members trust their points balance") and Objective 2 ("Members can check their points at any time without calling a branch") have no measure, baseline or target. After go-live the business cannot tell whether Loyalty Points worked. Objective 2 implies that members call branches about points today, but the BRD does not say how many calls. NFR-01 already gives Objective 1 a measure, but the objective does not point to it.
- **Options:**
  - **A.** Give each objective a measure: Objective 1 points to NFR-01; Objective 2 uses branch calls about points, with a baseline and a target from the business - success can be checked; needs a call count the branches may not collect today.
  - **B.** Keep the objectives as they are - no extra work; success stays a matter of opinion.
- **Recommended Answer:** Option A. Replace 01 / Business Objectives with:
  "1. Members trust their points balance. Measure: [NFR-01](./10-nfrs.md#non-functional-requirements).
  2. Members can check their points at any time without calling a branch. Measure: branch calls about points go down from [NEEDS CLARIFICATION: How many calls about points do branches receive per month today?] to [NEEDS CLARIFICATION: How many branch calls about points per month is the target after go-live?] by [NEEDS CLARIFICATION: By which date must the branch-call target be reached?]."
- **Why:** The template asks for measurable objectives where possible, and Objective 1 already has a measure in NFR-01. Only Objective 2 needs facts, and only the business holds them. Tradeoff: the branches may need to start counting calls before go-live to get a baseline.
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-04). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option". Rationale: the Why above. The answer supplies no fact that only a person or provider can give: every such fact stays a clarification marker in the rule home. It adopts no new third-party dependency (AGENTS.md) and sets no rule a source rules out. Open remainder: the clarification markers this answer placed in the rule home; each is a TD row in 14-todo.md.

**Rule home:** [01 / Business Objectives](./01-executive-summary-and-context.md#business-objectives)

### Q-05 - Points cannot be shown

**Question:** OI-05 (raised by the cleared-context reviewer on 2026-10-10). The item as raised, with every option, the Recommended Answer and the Why, follows.

**Options considered:**

- **Where:** UC-01 and UC-02 Alternate & Exception Flows; UC-01 and UC-02 Acceptance Criteria
- **Type:** Missing scenario
- **Concern:** Neither use case has an exception flow. If the system cannot show the points, the BRD does not say what the member sees. The risk is that the screen falls back to the UC-01 A1 view ("balance of 0, how points are earned") or an empty history. A member would read that as lost points, which is the opposite of Business Objective 1. The general error rule in 11 does not say what must not be shown in place of real data.
- **Options:**
  - **A.** Add an exception flow to both use cases: tell the member the points cannot be shown now and to try again later; never show 0 or an empty history in its place - no wrong number is ever shown; the member sees no balance during the failure.
  - **B.** Show the last balance the system knew, with its date and a notice - the member sees a number; it can be wrong (NFR-01) and needs a saved copy of the balance.
- **Recommended Answer:** Option A.
  - UC-01 / Alternate & Exception Flows, add: "- **E1 - Points cannot be shown:** At step 2, the system tells the member that their points cannot be shown right now and asks them to try again later. The system does not show a balance of 0 or the A1 explanation in this case."
  - UC-02 / Alternate & Exception Flows, add: "- **E1 - History cannot be shown:** At step 2 or step 4, the system tells the member that their points history cannot be shown right now and asks them to try again later. The system does not show an empty history in this case."
  - UC-01 / Acceptance Criteria, add: "- [ ] Given the system cannot show the points, when the member opens their points, then they see a message asking them to try again later, and no balance (E1)."
  - UC-02 / Acceptance Criteria, add: "- [ ] Given the system cannot show the history, when the member opens it, then they see a message asking them to try again later, and no empty list (E1)."
- **Why:** A balance of 0 or an empty list during a failure would tell members they lost points, which works against Objective 1 and NFR-01. Option B risks showing a wrong balance. Tradeoff: during a failure the member sees no number at all.
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-05). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option". Rationale: the Why above. The answer supplies no fact that only a person or provider can give: every such fact stays a clarification marker in the rule home. It adopts no new third-party dependency (AGENTS.md) and sets no rule a source rules out. Open remainder: the clarification markers this answer placed in the rule home; each is a TD row in 14-todo.md.

**Rule home:** [06a / UC-01 Alternate & Exception Flows](./06a-use-cases-member.md#alternate--exception-flows); [06a / UC-02 Alternate & Exception Flows](./06a-use-cases-member.md#alternate--exception-flows-1)

### Q-06 - Which refund outcome takes points back

**Question:** OI-06 (raised by the cleared-context reviewer on 2026-10-10). The item as raised, with every option, the Recommended Answer and the Why, follows.

**Options considered:**

- **Where:** UC-02 Business Rules & Constraints (BR-1); 10 NFR-02; 02 Glossary (Refunds Portal)
- **Type:** Inconsistency
- **Concern:** UC-02 BR-1 takes points back when the purchase "is refunded in the Refunds Portal". NFR-02 counts from "the refund being paid". The Glossary says the Refunds Portal handles "refunds and their outcomes", so a refund can have outcomes other than paid, for example rejected or cancelled. Under BR-1 an approved but unpaid refund could take points back; under NFR-02 it would not. The BRD also does not say that one refund takes points back only once. If the Refunds Portal reports the same refund twice, the member could lose the points twice, which breaks NFR-01.
- **Options:**
  - **A.** Points are taken back when the refund is paid; rejected or cancelled refunds take nothing back; each refund takes points back once - matches NFR-02 and the two movement kinds in 03; the member keeps the points between approval and payment.
  - **B.** Points are taken back when the refund is approved - faster; a refund rejected later must give the points back, which needs a third movement kind that 03 does not have.
- **Recommended Answer:** Option A. In UC-02 / Business Rules & Constraints, replace the first sentence of the first bullet (keep its partial-refund clarification) with: "Points earned on a purchase are taken back when the Refunds Portal reports that the refund of that purchase is paid. A refund that is rejected or cancelled takes back no points." Add a new bullet after it: "Each paid refund takes points back once, even if the Refunds Portal reports it more than once."
  UC-02 / Acceptance Criteria, add:
  "- [ ] Given a refund that the Refunds Portal reports as rejected, when the member opens the history, then no points are taken back for it.
  - [ ] Given the Refunds Portal reports the same paid refund twice, when the member opens the history, then they see one taken-back movement for that refund."
- **Why:** Option A uses the moment NFR-02 already measures and needs only the two movement kinds in 03. Option B adds a movement kind and a reversal path that no source asks for. Tradeoff: the member keeps the points until the refund money is paid.
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-06). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option". Rationale: the Why above. The answer supplies no fact that only a person or provider can give: every such fact stays a clarification marker in the rule home. It adopts no new third-party dependency (AGENTS.md) and sets no rule a source rules out. The new rule "Each paid refund takes points back once" was added at the end of the UC-02 rule list (BR-3), not directly after BR-1 as the Recommended Answer said, so the positional citation UC-02 BR-2 ("Members see only their own points", cited by the 07 footnote and the mockup rows) keeps its meaning (delivery-chunks.md, Citing the source precisely). Position only; the rule text is unchanged. Open remainder: the clarification markers this answer placed in the rule home; each is a TD row in 14-todo.md.

**Rule home:** [06a / UC-02 Business Rules & Constraints](./06a-use-cases-member.md#business-rules--constraints-1)

### Q-07 - Refund paid before its purchase has earned points, or for a purchase that earned none

**Question:** OI-07 (raised by the cleared-context reviewer on 2026-10-10). The item as raised, with every option, the Recommended Answer and the Why, follows.

**Options considered:**

- **Where:** UC-02 Business Rules & Constraints; 02 Assumption 1; 10 NFR-02
- **Type:** Corner case
- **Concern:** Purchases reach Loyalty Points on the same day (Assumption 1), but points must be taken back within 1 hour of the refund being paid (NFR-02). A purchase made in the morning and refunded at midday can be paid back before the purchase has earned its points. There is then nothing to take back, and NFR-02 cannot be met as written. Separately, the Refunds Portal handles refunds for all customers. A refund of a purchase by a non-member, or of a purchase that earned no points, must not create a movement. The BRD covers neither case.
- **Options:**
  - **A.** Take the points back as soon as the purchase earns them, and show both movements; NFR-02 counts from the later of the two events - every movement stays visible and matched; a same-day refund shows two movements.
  - **B.** If the refund is paid before the purchase earns points, record neither movement - shorter history; the member never sees the purchase or the refund, which goes against UC-02 A1 and Objective 1.
- **Recommended Answer:** Option A.
  - UC-02 / Business Rules & Constraints, add: "Only a refund of a purchase that earned points takes points back. A refund of any other purchase adds no movement."
  - UC-02 / Business Rules & Constraints, add: "If a refund is paid before its purchase has earned points, the system takes the points back when the purchase earns them. The history then shows both movements."
  - 10 / NFR-02, Business Measure, replace with: "Within 1 hour of the refund being paid, or within 1 hour of the purchase earning its points if that happens later."
- **Why:** Option A keeps every taken-back movement matched to an earned one, so the balance stays right (NFR-01) and every movement stays visible (Objective 1). It also makes NFR-02 possible to meet for same-day refunds. Tradeoff: a purchase refunded on the same day shows two movements instead of none.
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-07). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option". Rationale: the Why above. The answer supplies no fact that only a person or provider can give: every such fact stays a clarification marker in the rule home. It adopts no new third-party dependency (AGENTS.md) and sets no rule a source rules out. Open remainder: the clarification markers this answer placed in the rule home; each is a TD row in 14-todo.md.

**Rule home:** [06a / UC-02 Business Rules & Constraints](./06a-use-cases-member.md#business-rules--constraints-1); [10 / NFR-02](./10-nfrs.md#non-functional-requirements)

### Q-08 - Recent purchase or refund not shown yet

**Question:** OI-08 (raised by the cleared-context reviewer on 2026-10-10). The item as raised, with every option, the Recommended Answer and the Why, follows.

**Options considered:**

- **Where:** UC-01 Main Flow step 2; UC-02 Main Flow step 2; 08 POS Records and Refunds Portal (seen by the member)
- **Type:** Missing scenario
- **Concern:** By design, new activity reaches the member's points with a delay: purchases on the same day (Assumption 1), and points taken back within 1 hour of the refund being paid (NFR-02). If POS Records or the Refunds Portal is late, the delay grows. A member who checks right after shopping sees a balance without that purchase, and nothing tells them why. They may think the points are missing and call the branch, which is what Objective 2 wants to avoid.
- **Options:**
  - **A.** Show a short note on the balance and history screens that says when new purchases and refunds appear - sets expectations at almost no cost; the note must stay in line with the NFRs.
  - **B.** Show purchases as "pending" before they earn points - members see their purchase at once; needs purchases to arrive sooner than Assumption 1 allows.
  - **C.** Change nothing and rely on the "date of the last points movement" in UC-01 - no work; members must work out the delay themselves.
- **Recommended Answer:** Option A.
  - UC-01 / Main Flow, replace step 2 with: "2. The system shows the current points balance, the date of the last points movement, and a note that tells the member when new purchases and refunds appear in their points."
  - UC-02 / Main Flow, add to the end of step 2: "The system also shows the same note about when new purchases and refunds appear."
  - UC-01 / Business Rules & Constraints, add: "The note says that points for a purchase appear by the time stated in [10 / Non-Functional Requirements](./10-nfrs.md#non-functional-requirements), and that points taken back after a refund appear within the time stated in NFR-02."
  - UC-01 / Acceptance Criteria, add: "- [ ] Given a member opens their points, then they see a note telling them when new purchases and refunds appear."
- **Why:** The delay is built into the requirements (Assumption 1, NFR-02), so every member will meet it. A note protects Objective 2 without changing any feed. Option B needs faster purchase data than the source promises. Tradeoff: the note text must change if the NFR times change.
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-08). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option". Rationale: the Why above. The answer supplies no fact that only a person or provider can give: every such fact stays a clarification marker in the rule home. It adopts no new third-party dependency (AGENTS.md) and sets no rule a source rules out. The new UC-01 rule links the earned-points time to NFR-03 (added by OI-11) instead of the generic chunk 10 link in the Recommended Answer. Link only. Open remainder: the clarification markers this answer placed in the rule home; each is a TD row in 14-todo.md.

**Rule home:** [06a / UC-01 Main Flow](./06a-use-cases-member.md#main-flow); [06a / UC-02 Main Flow](./06a-use-cases-member.md#main-flow-1)

### Q-09 - Movement date and purchase details are not defined or received

**Question:** OI-09 (raised by the cleared-context reviewer on 2026-10-10). The item as raised, with every option, the Recommended Answer and the Why, follows.

**Options considered:**

- **Where:** UC-01 Main Flow step 2; UC-02 Main Flow steps 2 and 4; 08 Integrations (POS Records row)
- **Type:** Inconsistency
- **Concern:** UC-02 step 2 shows each movement's date, UC-01 shows the date of the last movement, and UC-02 step 4 shows "the purchase or refund the movement came from". But the 08 POS Records row receives only the member, the purchase reference and the amount. It receives no purchase date and no branch. The BRD also does not say which date a movement carries: the purchase date or the day the points were added. These can differ (Assumption 1, OI-07). Step 4 does not list what the member sees, so screen LP-02 and the testers have no definition, and the screen could show more purchase detail than the business intends.
- **Options:**
  - **A.** An earned movement carries the purchase date, a taken-back movement carries the date the refund was paid; step 4 shows a fixed list; 08 adds purchase date and branch - members recognise the day they shopped; POS Records must send two more items.
  - **B.** Every movement carries the day the points were added; step 4 shows only the reference and the amount - nothing new needed from POS Records; members may not recognise the dates.
- **Recommended Answer:** Option A.
  - UC-02 / Main Flow, add to step 2: "The date of an earned movement is the purchase date. The date of a taken-back movement is the date the refund was paid."
  - UC-02 / Main Flow, replace step 4 with: "4. The system shows the details behind the movement. For a purchase: the purchase date, the branch, the purchase reference, the amount in EUR, and the points earned. For a refund: the date the refund was paid, the refund reference, the purchase reference it refunds, the refunded amount in EUR, and the points taken back."
  - 08 / Integrations, POS Records row, Information Exchanged: "Member, purchase reference, purchase date, branch, amount".
  - If the Refunds Portal row proposed in 08 is added, its Information Exchanged is: "Refund reference, purchase reference, refunded amount, date the refund was paid".
- **Why:** Members recognise a movement by the day and place they shopped. Step 4 cannot show a branch or date that 08 never receives. Option A closes the gap between what the screens promise and what the business systems send. Tradeoff: POS Records must send the purchase date and branch.
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-09). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option". Rationale: the Why above. The answer supplies no fact that only a person or provider can give: every such fact stays a clarification marker in the rule home. It adopts no new third-party dependency (AGENTS.md) and sets no rule a source rules out. The Refunds Portal information list was written into the open 08 proposal marker, which stays open for confirmation. Open remainder: the clarification markers this answer placed in the rule home; each is a TD row in 14-todo.md.

**Rule home:** [06a / UC-02 Main Flow](./06a-use-cases-member.md#main-flow-1); [08 / Integrations](./08-integrations.md#integrations)

### Q-10 - POS Records is missing from the Dependencies table

**Question:** OI-10 (raised by the cleared-context reviewer on 2026-10-10). The item as raised, with every option, the Recommended Answer and the Why, follows.

**Options considered:**

- **Where:** 02 Dependencies (Table 2); 08 Integrations
- **Type:** Inconsistency
- **Concern:** POS Records is a High-criticality integration in 08, and Assumption 1 depends on it. Without it no member earns any points. Yet Table 2 lists only the Refunds Portal. So nobody tracks whether POS Records is confirmed or when it is needed, and the gate for go-live readiness misses the most important source.
- **Options:**
  - **A.** Add POS Records as a Hard dependency, pointing to 08 for its owner - readiness is tracked in one table; the owner stays in one place.
  - **B.** Leave POS Records in 08 only - no extra row; its readiness is not tracked.
- **Recommended Answer:** Option A. Add to 02 / Dependencies (Table 2):
  "| POS Records (branch purchases) | Hard | See [08 / Integrations](./08-integrations.md#integrations) | [NEEDS CLARIFICATION: Is the POS Records dependency confirmed, with its owner and treatment agreed?] | [NEEDS CLARIFICATION: When is the POS Records dependency needed: before the build of UC-01, before BAT sign-off, or before go-live?] | Gives the branch purchases that earn points ([03 / Earning points](./03-definitions-and-domain-concepts.md#earning-points), Assumption 1). |"
- **Why:** Table 2 is where the BRD tracks what must be ready, and earning depends fully on POS Records. Pointing to 08 for the owner keeps one home for that fact and does not repeat the owner question already open in 08. Tradeoff: the reader follows a link to find the owner.
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-10). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option". Rationale: the Why above. The answer supplies no fact that only a person or provider can give: every such fact stays a clarification marker in the rule home. It adopts no new third-party dependency (AGENTS.md) and sets no rule a source rules out. Open remainder: the clarification markers this answer placed in the rule home; each is a TD row in 14-todo.md.

**Rule home:** [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies)

### Q-11 - No time limit for earned points to show

**Question:** OI-11 (raised by the cleared-context reviewer on 2026-10-10). The item as raised, with every option, the Recommended Answer and the Why, follows.

**Options considered:**

- **Where:** 10 Non-Functional Requirements; 02 Assumption 1; 03 Earning points
- **Type:** Gap
- **Concern:** NFR-02 says points taken back show within 1 hour of the refund being paid. No NFR says how soon earned points show. Assumption 1 ("known the same day") is an assumption about POS Records, not a promise to members, so it cannot be tested as a quality. The result is uneven: a refund can show faster than the purchase it refunds. The BRD also does not say what happens when the assumption fails and a purchase arrives days late.
- **Options:**
  - **A.** Add a timeliness NFR for earned points, in line with Assumption 1, and a rule that a late purchase still earns its points - testable; tied to how fast POS Records sends data, which the business does not fully control.
  - **B.** Set a shorter time, for example a number of hours after the purchase - better for members; needs faster purchase data than Assumption 1 allows.
- **Recommended Answer:** Option A.
  - 10 / Non-Functional Requirements, add a row with the next free NFR ID: "| NFR-03 | Timeliness | Points earned on a purchase show in the member's balance and history. | [NEEDS CLARIFICATION: proposed: by the end of the day of the purchase, matching Assumption 1; confirm or replace] |"
  - 03 / Earning points, add: "A purchase that reaches Loyalty Points after the day it was made still earns its points. Its movement keeps the purchase date."
- **Why:** Members check their points right after shopping (Objective 2). A stated time lets the screen set expectations (OI-08) and lets testers check it. The proposed value follows Assumption 1, so no new data speed is required. Tradeoff: the promise depends on POS Records keeping to the same-day assumption.
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-11). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option". Rationale: the Why above. The answer supplies no fact that only a person or provider can give: every such fact stays a clarification marker in the rule home. It adopts no new third-party dependency (AGENTS.md) and sets no rule a source rules out. Open remainder: the clarification markers this answer placed in the rule home; each is a TD row in 14-todo.md.

**Rule home:** [10 / NFR-03](./10-nfrs.md#non-functional-requirements); [03 / Earning points](./03-definitions-and-domain-concepts.md#earning-points)

### Q-12 - No availability expectation for "at any time"

**Question:** OI-12 (raised by the cleared-context reviewer on 2026-10-10). The item as raised, with every option, the Recommended Answer and the Why, follows.

**Options considered:**

- **Where:** 10 Non-Functional Requirements; 01 Business Objective 2
- **Type:** Gap
- **Concern:** Objective 2 promises that members can check their points "at any time", but no NFR states an availability expectation or a measure. Without one, the SDD has no target, and planned maintenance at any hour would still meet the BRD.
- **Options:**
  - **A.** Add an availability NFR and ask the business for the allowed time the screens may be down - turns the promise into a testable target; the business must choose a number.
  - **B.** Remove "at any time" from Objective 2 - no target to meet; weakens the objective the source approved.
- **Recommended Answer:** Option A. 10 / Non-Functional Requirements, add a row with the next free NFR ID (NFR-04 if OI-11 adds NFR-03): "| NFR-04 | Availability | Members can open their points balance and history at any time of day, every day. | [NEEDS CLARIFICATION: How many minutes per month may the points screens be unavailable, planned maintenance included?] |"
- **Why:** The promise is already in the approved Objective 2. Only the business can say how much downtime it accepts, so the measure is asked, not invented. Tradeoff: a stricter number raises the cost of the SDD design.
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-12). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option". Rationale: the Why above. The answer supplies no fact that only a person or provider can give: every such fact stays a clarification marker in the rule home. It adopts no new third-party dependency (AGENTS.md) and sets no rule a source rules out. Open remainder: the clarification markers this answer placed in the rule home; each is a TD row in 14-todo.md.

**Rule home:** [10 / NFR-04](./10-nfrs.md#non-functional-requirements)

### Q-13 - NFR-01 counts upheld complaints, but nobody handles complaints or corrects points

**Question:** OI-13 (raised by the cleared-context reviewer on 2026-10-10). The item as raised, with every option, the Recommended Answer and the Why, follows.

**Options considered:**

- **Where:** 10 NFR-01; 03 Points movement; 04 Out of Scope and Personas
- **Type:** Inconsistency
- **Concern:** NFR-01 is measured as "Zero balance complaints upheld per month". That measure assumes members can complain, someone decides each complaint, and an upheld complaint gets fixed. The BRD has one persona (Member), two movement kinds (earned, taken back), and no way to correct a wrong balance. So an upheld complaint cannot be fixed inside Loyalty Points, and nobody is named to count complaints. NFR-01 cannot be measured as written.
- **Options:**
  - **A.** Keep complaint handling and hand corrections out of scope; name the team that handles complaints and counts them for NFR-01 - keeps the approved v1.0 scope; fixing a wrong balance depends on a path the business must name.
  - **B.** Add a staff persona and a "Correct points" use case with a third movement kind, "Correction" - a full fix path inside Loyalty Points; new scope with a new persona, use case, matrix column and rules (recorded as a Scope proposal in Reviewer Notes).
- **Recommended Answer:** Option A.
  - 04 / Out of Scope, add: "- Handling member complaints about points, and correcting points by hand. Complaints are handled by [NEEDS CLARIFICATION: Which team receives and decides member complaints about points?]."
  - 03 / Points movement, Overview, add: "[NEEDS CLARIFICATION: When a complaint about points is upheld, how is the member's balance corrected, given that Loyalty Points has no correction movement?]"
  - 10 / NFR-01, Business Measure, replace with: "Zero balance complaints upheld per month, as counted by the team that handles points complaints."
- **Why:** Option A keeps the scope the source approved (one persona, two movement kinds) and makes NFR-01 measurable by naming who counts. Option B is real new scope, so it goes to the product owner as a Scope proposal instead of being added by review. Tradeoff: until the second question is answered, an upheld complaint may have no fix path.
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-13). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option". Rationale: the Why above. The answer supplies no fact that only a person or provider can give: every such fact stays a clarification marker in the rule home. It adopts no new third-party dependency (AGENTS.md) and sets no rule a source rules out. Open remainder: the clarification markers this answer placed in the rule home; each is a TD row in 14-todo.md.

**Rule home:** [04 / Out of Scope](./04-scope-and-personas.md#out-of-scope); [10 / NFR-01](./10-nfrs.md#non-functional-requirements); [03 / Overview](./03-definitions-and-domain-concepts.md#overview)

### Q-14 - No security and privacy expectation

**Question:** OI-14 (raised by the cleared-context reviewer on 2026-10-10). The item as raised, with every option, the Recommended Answer and the Why, follows.

**Options considered:**

- **Where:** 10 Non-Functional Requirements; UC-01 BR-1; UC-02 BR-2; 04 Personas (Access Level)
- **Type:** Gap
- **Concern:** "Members see only their own points" is a rule in two use cases, but no NFR states it as a quality with a business measure. The rule also does not cover the purchase details in UC-02 step 4 (date, branch, amount; see OI-09), which show where and when a member shops. Without an NFR, the SDD has no single privacy target that covers every screen and every detail.
- **Options:**
  - **A.** Add a Security & Privacy NFR that covers the balance, the history and the purchase details - one testable quality for the whole product; adds no scope, since the rule is already in the source.
  - **B.** Rely on the two use-case rules only - no new row; purchase details and future screens are not clearly covered.
- **Recommended Answer:** Option A. 10 / Non-Functional Requirements, add a row with the next free NFR ID (NFR-05 if OI-11 and OI-12 add NFR-03 and NFR-04): "| NFR-05 | Security & Privacy | A member's points balance, points history and purchase details are visible only to that member. | No member can see another member's points, history or purchase details. |"
- **Why:** The rule already exists in 04 (Access Level "Own points only") and in two business rules. The NFR turns it into one quality that also covers purchase details. The measure restates the source rule, so nothing is invented. Tradeoff: none in scope; the SDD must prove the measure across all screens.
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-14). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option". Rationale: the Why above. The answer supplies no fact that only a person or provider can give: every such fact stays a clarification marker in the rule home. It adopts no new third-party dependency (AGENTS.md) and sets no rule a source rules out. Open remainder: the clarification markers this answer placed in the rule home; each is a TD row in 14-todo.md.

**Rule home:** [10 / NFR-05](./10-nfrs.md#non-functional-requirements)

### Q-15 - A member leaves the loyalty program

**Question:** OI-15 (raised by the cleared-context reviewer on 2026-10-10). The item as raised, with every option, the Recommended Answer and the Why, follows.

**Options considered:**

- **Where:** 03 Points movement; 04 Project Scope
- **Type:** Missing scenario
- **Concern:** The BRD does not cover a member who leaves the loyalty program or asks for their data to be deleted. It does not say what happens to the balance, the history, the purchase details, or a refund paid after the member left. Purchases are counted in EUR, which suggests the business may fall under a European data-protection law with a right to have personal data deleted. This is the reviewer's inference, not a project source, so the applicable law must be confirmed. Without a rule, the SDD cannot design deletion, and NFR-01 has no meaning for a member who has left.
- **Options:**
  - **A.** When a member leaves, the balance closes, the history and purchase details are deleted after a set time, and later refunds take nothing back - limits how long personal data is kept; a member who rejoins starts at 0.
  - **B.** Keep the balance and history in case the member rejoins - better for returning members; keeps personal data with no end date.
- **Recommended Answer:** Option A. Add to 03 / Points movement a new subsection:
  "### Member leaves the loyalty program
  When a member leaves the loyalty program, their points balance closes. A refund paid after the member left takes back no points. The system deletes the member's points history and purchase details [NEEDS CLARIFICATION: How long after a member leaves must the system delete their points history and purchase details?].
  [NEEDS CLARIFICATION: Which system or team records that a member has left the loyalty program?]
  [NEEDS CLARIFICATION: Which data-protection law applies to members' points and purchase data?]"
- **Why:** Option A gives every case a clear outcome and limits how long personal purchase data is kept. Option B keeps that data with no end date, which is the weaker choice for privacy. The deletion period, the source of the leave event and the law are facts only the business or its legal team can give. Tradeoff: a member who rejoins starts again at 0 points.
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-15). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option". Rationale: the Why above. The answer supplies no fact that only a person or provider can give: every such fact stays a clarification marker in the rule home. It adopts no new third-party dependency (AGENTS.md) and sets no rule a source rules out. Open remainder: the clarification markers this answer placed in the rule home; each is a TD row in 14-todo.md.

**Rule home:** [03 / Member leaves the loyalty program](./03-definitions-and-domain-concepts.md#member-leaves-the-loyalty-program)

### Q-16 - Points expiry is not stated

**Question:** OI-16 (raised by the cleared-context reviewer on 2026-10-10). The item as raised, with every option, the Recommended Answer and the Why, follows.

**Options considered:**

- **Where:** 03 Points movement (Overview)
- **Type:** Gap
- **Concern:** The BRD does not say whether points expire. Many loyalty programs expire points after a set time (general domain practice, not a project source). If points expire, a third movement kind ("expired") changes the balance and must show in the history and in the screens. If they do not, saying so stops a later design from adding expiry without a decision. Redeeming points is a later phase, so members build up points they cannot spend yet, which makes the question more visible to them.
- **Options:**
  - **A.** State that points do not expire in this release - matches the two movement kinds in 03; if expiry comes with redeeming, a rule for existing balances is needed then.
  - **B.** Points expire after a set time - adds an "expired" movement kind, member notices and program terms; new scope.
- **Recommended Answer:** Option A. 03 / Points movement / Overview, add after the list of movement kinds: "**Expiry:** [NEEDS CLARIFICATION: proposed: points do not expire in this release; confirm or replace]"
- **Why:** The source names only two movement kinds and no expiry, so Option A writes down what the BRD already implies. Option B would add a movement kind, notices and terms that no source asks for. Tradeoff: if expiry is added with redeeming, today's balances will need a starting rule.
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-16). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option". Rationale: the Why above. The answer supplies no fact that only a person or provider can give: every such fact stays a clarification marker in the rule home. It adopts no new third-party dependency (AGENTS.md) and sets no rule a source rules out. Open remainder: the clarification markers this answer placed in the rule home; each is a TD row in 14-todo.md.

**Rule home:** [03 / Overview](./03-definitions-and-domain-concepts.md#overview)

### Q-17 - How long points history and purchase details are kept

**Question:** OI-17 (raised by the cleared-context reviewer on 2026-10-10). The item as raised, with every option, the Recommended Answer and the Why, follows.

**Options considered:**

- **Where:** UC-02 Main Flow steps 2 and 4; 03 Points movement
- **Type:** Gap
- **Concern:** UC-02 lists "every points movement", and the balance is the sum of all movements. So movements cannot be deleted without changing the balance. The BRD does not say how long movements and the purchase or refund details behind them are kept and shown. Purchase details are personal data. Keeping them forever may break the business's data-protection duties. Deleting them would change the balance or leave UC-02 step 4 with nothing to show.
- **Options:**
  - **A.** Keep every movement while the member is in the program; keep the purchase and refund details for a set period; after that, step 4 shows the movement without details - the balance stays right; older movements lose their details.
  - **B.** Keep everything for as long as the member is in the program - simplest; personal purchase data is kept with no limit.
  - **C.** Show only recent movements, for example the last 12 months - shorter screen; the visible movements no longer add up to the balance, which weakens Objective 1.
- **Recommended Answer:** Option A.
  - 03 / Points movement, add a new subsection:
    "### Keeping points history
    The system keeps every points movement while the member is in the loyalty program, so the balance always equals the sum of the movements. The system keeps the purchase and refund details behind each movement for [NEEDS CLARIFICATION: How long must the system keep the purchase and refund details behind a points movement?]. After that time, the movement stays in the history without its details."
  - UC-02 / Alternate & Exception Flows, add: "- **A2 - Details no longer kept:** At step 4, if the details behind the movement are no longer kept, the system shows the movement's date, reference and points, and tells the member that older details are no longer available."
  - UC-02 / Acceptance Criteria, add: "- [ ] Given a movement whose details are no longer kept, when the member opens it, then they see its date, reference and points, and a message that older details are no longer available (A2)."
- **Why:** Option A keeps NFR-01 true and limits how long personal purchase details are kept. The period is a legal or business fact the reviewer cannot supply, so it is asked. Option C breaks the link between visible movements and the balance. Tradeoff: members lose the details of old movements.
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-17). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option". Rationale: the Why above. The answer supplies no fact that only a person or provider can give: every such fact stays a clarification marker in the rule home. It adopts no new third-party dependency (AGENTS.md) and sets no rule a source rules out. Open remainder: the clarification markers this answer placed in the rule home; each is a TD row in 14-todo.md.

**Rule home:** [03 / Keeping points history](./03-definitions-and-domain-concepts.md#keeping-points-history); [06a / UC-02 A2](./06a-use-cases-member.md#alternate--exception-flows-1)

### Q-18 - Stated UC behaviours with no acceptance criterion

**Question:** OI-18 (raised by the consistency check on 2026-10-10, after the first acceptance loop). The item as raised follows.

**Options considered:**

- **Where:** 06a / UC-01 E1, AC-3; UC-02 E1, BR-1, BR-4, BR-5, AC-4, AC-6 (raised by consistency check CF-01)
- **Type:** Gap
- **Concern:** Five stated behaviours have no acceptance criterion. UC-02 E1 covers a failure at step 2 or step 4, but AC-6 tests only step 2. BR-1 says a rejected or cancelled refund takes back no points, but AC-4 tests only rejected. BR-4 and BR-5 have no criterion. UC-01 E1 says the A1 explanation is not shown, but AC-3 tests only that no balance is shown. Chunk 16 would test these only against bare rules, and BR-5 is the corner case easiest to build wrong.
- **Options:**
  - **A.** Add criteria at the end of each list, so positional citations keep their meaning - 5 more bullets.
  - **B.** Widen AC-3, AC-4 and AC-6 in place and add only BR-4 and BR-5 criteria - fewer bullets, but cited positions change meaning.
  - **C.** No new criteria; UAT cites the rules directly - no edit, but the business never agrees a Given/When/Then for these.
- **Recommended Answer:** Option A. UC-01 / Acceptance Criteria, add at the end: "- [ ] Given the system cannot show the points, when the member opens their points, then they do not see the explanation of how points are earned (E1)." UC-02 / Acceptance Criteria, add at the end: "- [ ] Given the system cannot show the details of a movement, when the member opens that movement, then they see a message asking them to try again later (E1)." / "- [ ] Given a refund that the Refunds Portal reports as cancelled, when the member opens the history, then no points are taken back for it." / "- [ ] Given a paid refund of a purchase that earned no points, when the member opens the history, then the refund adds no movement." / "- [ ] Given a refund paid before its purchase has earned points, when the purchase earns its points, then the history shows the earned movement and the taken-back movement."
- **Why:** Every stated branch gets a test the business agreed, and adding at the end follows the positional citation rule (delivery-chunks.md, Citing the source precisely). The cost is a longer criteria list.
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-18). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option". Rationale: the Why above. It supplies no fact, adopts no new dependency (AGENTS.md) and sets no rule a source rules out. Open remainder: none. Later the same day, consistency correction CF-06 reworded the Given of UC-02 AC-10 to "a purchase that never earns points (for example a purchase made before the start of points)", keeping its position; the record of that correction is in [14 / Step 2](./14-todo.md#consistency-findings).

**Rule home:** [06a / UC-01 Acceptance Criteria](./06a-use-cases-member.md#acceptance-criteria); [06a / UC-02 Acceptance Criteria](./06a-use-cases-member.md#acceptance-criteria-1)

### Q-19 - A1 condition for a zero balance

**Question:** OI-19 (raised by the consistency check on 2026-10-10, after the first acceptance loop). The item as raised follows.

**Options considered:**

- **Where:** 06a / UC-01 A1, AC-2, step 2 (raised by consistency check CF-02)
- **Type:** Ambiguity
- **Concern:** A1 is titled "No points yet" but states no condition. AC-2 tests "no points movements". A member whose points were all taken back has a balance of 0 with movements. It is not stated whether that member gets the main flow (0 plus the date of the last movement) or A1 (how points are earned). Designers and testers may build the zero-balance screen two ways.
- **Options:**
  - **A.** A1 applies only when the member has no points movements; a zero balance after take-backs follows the main flow - matches AC-2; that member sees no earning explanation.
  - **B.** A1 applies whenever the balance is 0, and AC-2 is widened - members who had points see onboarding text, and whether the last-movement date shows becomes unclear.
- **Recommended Answer:** Option A. UC-01 / Alternate & Exception Flows, replace A1 with: "- **A1 - No points movements yet:** At step 2, if the member has no points movements, the system shows a balance of 0 and explains how points are earned."
- **Why:** It matches AC-2 as written and keeps the step 2 date meaningful; the history (UC-02) explains a zero balance from take-backs (Objective 1). The cost is no earning hint for members whose balance fell to 0.
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-19). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option". Rationale: the Why above. It supplies no fact, adopts no new dependency (AGENTS.md) and sets no rule a source rules out. Open remainder: none.

**Rule home:** [06a / UC-01 Alternate & Exception Flows](./06a-use-cases-member.md#alternate--exception-flows)

### Q-20 - Zero balance after take-backs has no acceptance criterion

**Question:** OI-20 (raised by the grill-me session of 2026-10-10, N1). The item as raised follows.

**Options considered:**

- **Where:** 06a / UC-01 Acceptance Criteria; UC-01 step 2, A1 (raised by the grill-me session of 2026-10-10, N1)
- **Type:** Gap
- **Concern:** OI-19 settled that a member whose movements add up to 0 follows the main flow: they see 0 and the date of the last movement, without the A1 explanation. No acceptance criterion tests this. AC-1 tests a positive balance and AC-2 tests a member with no movements. A builder could still show the A1 explanation for every zero balance, and no test would catch it.
- **Options:**
  - **A.** Add a criterion at the end of the UC-01 list - the OI-19 rule gets a test; one more criterion.
  - **B.** Widen AC-1 to cover any balance - no new bullet; AC-1 keeps its position but changes its meaning.
  - **C.** No new criterion - no edit; the zero-balance case stays untested.
- **Recommended Answer:** Option A. UC-01 / Acceptance Criteria, add at the end: "- [ ] Given a member whose points movements add up to 0, when they open their points, then they see a balance of 0 and the date of the last movement, and no explanation of how points are earned."
- **Why:** A1 and the main flow both show 0, so this case is the easiest to build wrong. Adding at the end keeps positional citations (delivery-chunks.md, Citing the source precisely). Tradeoff: one more criterion to test.
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-20). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option". Rationale: the Why above. It supplies no fact, adopts no new dependency (AGENTS.md) and sets no rule a source rules out. Applied as UC-01 AC-6. Open remainder: none.

**Rule home:** [06a / UC-01 Acceptance Criteria](./06a-use-cases-member.md#acceptance-criteria)

### Q-21 - NFR-01 expectation is vague

**Question:** OI-21 (raised by the grill-me session of 2026-10-10, N3, from the Reviewer Note "Editorial - 10 NFR-01"). The item as raised follows.

**Options considered:**

- **Where:** 10 / NFR-01 Business Expectation (raised by the grill-me session of 2026-10-10, N3; from 13 Reviewer Notes, Editorial - 10 NFR-01)
- **Type:** Ambiguity
- **Concern:** NFR-01 says "The points balance is always right." "Right" does not say what is checked (writing-style.md, rule 5). The Reviewer Note proposes "The points balance always equals the sum of the member's points movements." But the Glossary (02) and 03 / Overview already define the balance as the sum of the movements. With that wording NFR-01 is true by definition, and a wrong movement (wrong points for a purchase, a refund taken back twice) would still pass. The SDD and the testers need to know what "right" means.
- **Options:**
  - **A.** Use the Reviewer Note wording - simple; it restates the Glossary definition, so it checks nothing new.
  - **B.** State that every movement follows the earning rule and the take-back rules - testable against rules already in the BRD; links to them instead of restating them.
  - **C.** Keep "always right" - no edit; the expectation stays vague.
- **Recommended Answer:** Option B. 10 / NFR-01, Business Expectation, replace with: "Every points movement follows the earning rule in [03 / Earning points](./03-definitions-and-domain-concepts.md#earning-points) and the take-back rules in [UC-02 / Business Rules & Constraints](./06a-use-cases-member.md#business-rules--constraints-1)." The Business Measure stays as it is.
- **Why:** The balance is the sum of the movements by definition, so the balance is right only when each movement is right. Option B points at the rules that decide each movement without restating them. Option A only repeats the Glossary. Tradeoff: a reader follows two links to see the rules.
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-21). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option". Rationale: the Why above. It supplies no fact, adopts no new dependency (AGENTS.md) and sets no rule a source rules out. Open remainder: none.

**Rule home:** [10 / NFR-01](./10-nfrs.md#non-functional-requirements)

### Q-22 - What a person who has left the program can open

**Question:** OI-22 (raised by the grill-me session of 2026-10-10, N5). The item as raised follows.

**Options considered:**

- **Where:** 03 / Member leaves the loyalty program; 06a / UC-01 and UC-02 Preconditions; 10 / NFR-05 (raised by the grill-me session of 2026-10-10, N5)
- **Type:** Missing scenario
- **Concern:** 03 says the balance closes when a member leaves, and the history is deleted after a set time. It does not say whether the person can still open their points before the deletion. UC-01 and UC-02 have no flow for a closed balance. A builder could show the closed balance, an empty history, or nothing.
- **Options:**
  - **A.** A person who has left can no longer open their points balance or history - no new flow; matches "the balance closes"; the person cannot check their final balance.
  - **B.** The person can open the closed balance and the history until the deletion, with a message that the balance is closed - more open; needs new alternate flows and acceptance criteria in UC-01 and UC-02, and a rule for how long the screens stay open.
- **Recommended Answer:** Option A. 03 / Member leaves the loyalty program, add after the first sentence: "A person who has left the loyalty program can no longer open their points balance or points history."
- **Why:** The BRD has one persona, the member, and both use cases start from a signed-in member. Option A keeps that scope and needs no new flow or time limit. Option B adds flows that no source asks for. Tradeoff: a person who leaves cannot look back at their final balance. How the person is stopped depends on the open sign-in question (TD-01).
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-22). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option". Rationale: the Why above. It supplies no fact, adopts no new dependency (AGENTS.md) and sets no rule a source rules out. Open remainder: how the person is stopped stays with the open sign-in question (TD-01) and the open leave-event question (TD-11); no new question.

**Rule home:** [03 / Member leaves the loyalty program](./03-definitions-and-domain-concepts.md#member-leaves-the-loyalty-program)

### Q-23 - Points taken back for one purchase can exceed the points it earned

**Question:** OI-23 (raised by the grill-me session of 2026-10-10, N8). The item as raised follows.

**Options considered:**

- **Where:** 06a / UC-02 BR-1, BR-3; 03 / Earning points (raised by the grill-me session of 2026-10-10, N8)
- **Type:** Corner case
- **Concern:** BR-3 takes each paid refund back once. One purchase can have several partial refunds. If each refund is rounded on its own (TD-02, TD-03), the points taken back for one purchase could add up to more than it earned. The balance would then lose points the member never earned on that purchase, against NFR-01.
- **Options:**
  - **A.** The points taken back for one purchase never add up to more than the points it earned - protects the balance whatever the partial-refund rule; the last refund may take back fewer points than its own amount suggests.
  - **B.** No limit; rely on the partial-refund rule (TD-03) - no new rule; the risk stays until TD-03 is decided and may come back with rounding.
- **Recommended Answer:** Option A. UC-02 / Business Rules & Constraints, add at the end: "The points taken back for one purchase never add up to more than the points that purchase earned." UC-02 / Acceptance Criteria, add at the end: "- [ ] Given a purchase that earned 50 points and several paid refunds of it, when the member opens the history, then the points taken back for that purchase add up to 50 at most."
- **Why:** A taken-back movement must match an earned one (Q-03, Q-07), so the balance never loses points that were not earned (NFR-01). The limit holds whatever rounding rule TD-02 and TD-03 choose. Tradeoff: in rare cases the last refund takes back fewer points than its amount alone would.
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-23). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option". Rationale: the Why above. It supplies no fact, adopts no new dependency (AGENTS.md) and sets no rule a source rules out. Applied as UC-02 BR-6 and AC-12. Open remainder: none (the partial-refund rule itself stays open as TD-03).

**Rule home:** [06a / UC-02 Business Rules & Constraints](./06a-use-cases-member.md#business-rules--constraints-1); [06a / UC-02 Acceptance Criteria](./06a-use-cases-member.md#acceptance-criteria-1)

### Q-24 - Purchase that reaches Loyalty Points after the member left

**Question:** OI-24 (raised by the grill-me session of 2026-10-10, N10). The item as raised follows.

**Options considered:**

- **Where:** 03 / Earning points; 03 / Member leaves the loyalty program; 06a / UC-02 BR-5 (raised by the grill-me session of 2026-10-10, N10)
- **Type:** Corner case
- **Concern:** 03 says a purchase that arrives late still earns its points, and UC-02 BR-5 makes a paid refund wait until its purchase earns points. 03 also says the balance closes when a member leaves. If a purchase made just before leaving arrives after the member left, the rules disagree: the purchase earns points into a closed balance, and a waiting refund takes them back. A purchase that never arrives is already covered: its refund adds no movement (UC-02 AC-10).
- **Options:**
  - **A.** A purchase that arrives after the member left earns no points, so a refund waiting for it takes back nothing - the closed balance never changes; the member loses the points of that last purchase.
  - **B.** The purchase still earns points into the closed balance - the member keeps them on paper; a closed balance changes after closing, and nobody can see or use it.
- **Recommended Answer:** Option A. 03 / Earning points, replace the late-purchase sentence with: "A purchase that reaches Loyalty Points after the day it was made still earns its points, unless the member has left the loyalty program ([Member leaves the loyalty program](./03-definitions-and-domain-concepts.md#member-leaves-the-loyalty-program)). Its movement keeps the purchase date ([UC-02 step 2](./06a-use-cases-member.md#main-flow-1))." 03 / Member leaves the loyalty program, add after "A refund paid after the member left takes back no points.": "A purchase that reaches Loyalty Points after the member left earns no points, even if the member made it before leaving."
- **Why:** "The balance closes" means no new movements after leaving. With Assumption 1 (purchases known the same day), this case affects at most a purchase made on the day the member leaves. Option B changes a closed balance that nobody can see. Tradeoff: the member gets no points for a purchase on their last day.
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-24). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option". Rationale: the Why above. It supplies no fact, adopts no new dependency (AGENTS.md) and sets no rule a source rules out. The plain-language pass split the new 03 / Earning points sentence in two ("This does not apply once the member has left the loyalty program"), and correction CF-20 placed that sentence directly after the earning sentence; the meaning is unchanged. Open remainder: none.

**Rule home:** [03 / Earning points](./03-definitions-and-domain-concepts.md#earning-points); [03 / Member leaves the loyalty program](./03-definitions-and-domain-concepts.md#member-leaves-the-loyalty-program)

### Q-25 - Criticality of the Refunds Portal integration

**Question:** OI-25 (raised by the grill-me session of 2026-10-10, N11). The item as raised follows.

**Options considered:**

- **Where:** 08 / Integrations, Refunds Portal row (Criticality); 02 / Dependency "Refunds Portal" (raised by the grill-me session of 2026-10-10, N11)
- **Type:** Gap
- **Concern:** The Refunds Portal row that the grill-me session added to Table 6 (D2) names no Criticality. 02 lists the Refunds Portal as a Hard dependency, and UC-02 BR-1 and NFR-02 cannot be met without it. An empty cell leaves the SDD without a priority for this integration.
- **Options:**
  - **A.** High - matches the Hard dependency in 02 and the POS Records row (High); its readiness gets the same attention as POS Records.
  - **B.** Medium - members still see their balance and earned points without it; refunded purchases would keep their points, against NFR-01 and NFR-02.
- **Recommended Answer:** Option A. 08 / Integrations, Refunds Portal row, Criticality: "High".
- **Why:** Without refund outcomes, refunded purchases keep their points, which breaks NFR-01 and NFR-02. 02 already calls it a Hard dependency. Tradeoff: none in scope; when it is needed stays open (TD-18).
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-25). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option". Rationale: the Why above. It supplies no fact (a criticality the documents' evidence builds is a choice, SKILL.md step 8, Answer policy, rule 3), adopts no new dependency (AGENTS.md) and sets no rule a source rules out. Open remainder: none. Later the same day, Q-44 (OI-44) changed the wording of this cell from "High" to "Critical", the top value of the template scale; the level this record chose stands.

**Rule home:** [08 / Integrations](./08-integrations.md#integrations)

### Q-26 - Refunds Portal row does not carry the refund outcome

**Question:** OI-26 (raised by the grill-me session of 2026-10-10, N12). The item as raised follows.

**Options considered:**

- **Where:** 08 / Integrations, Refunds Portal row (Information Exchanged); 06a / UC-02 BR-1, AC-4, AC-9 (raised by the grill-me session of 2026-10-10, N12)
- **Type:** Inconsistency
- **Concern:** The row lists the refund reference, the purchase reference, the refunded amount and the date the refund was paid. It does not list the refund outcome. UC-02 BR-1 takes points back only when the Refunds Portal reports a refund as paid, and AC-4 and AC-9 test refunds that the Refunds Portal reports as rejected or cancelled. The Glossary and 02 Dependencies also describe the Refunds Portal as the source of refund outcomes.
- **Options:**
  - **A.** Add the refund outcome (paid, rejected or cancelled) to Information Exchanged - matches BR-1, AC-4, AC-9, the Glossary and 02; the Refunds Portal sends every outcome.
  - **B.** Receive paid refunds only, and reword AC-4 and AC-9 to "a refund that is rejected" and "a refund that is cancelled" - less to receive; two agreed criteria change.
- **Recommended Answer:** Option A. 08 / Integrations, Refunds Portal row, Information Exchanged: "Refund reference, purchase reference, refunded amount, refund outcome (paid, rejected or cancelled), date the refund was paid".
- **Why:** Four places (02 Glossary, 02 Dependencies, UC-02 BR-1, UC-02 AC-4 and AC-9) already expect the outcome. Option A aligns the row with them; Option B rewrites two agreed criteria. Tradeoff: the Refunds Portal also sends rejected and cancelled refunds.
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-26). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option". Rationale: the Why above. It supplies no fact, adopts no new dependency (AGENTS.md) and sets no rule a source rules out. Open remainder: none.

**Rule home:** [08 / Integrations](./08-integrations.md#integrations)

### Q-27 - Which date the balance screen shows as the last movement

**Question:** OI-27 (raised by consistency check CF-08, Run 5, 2026-10-10). The item as raised follows.

**Options considered:**

- **Where:** 06a / UC-01 step 2, AC-1, AC-6; UC-02 step 2; 03 / Earning points (raised by consistency check CF-08)
- **Type:** Ambiguity
- **Concern:** UC-01 shows "the date of the last points movement". A movement's date is the purchase date or the date the refund was paid, and a late purchase keeps its old purchase date. So "last" can mean the newest date shown, or the movement added most recently. With a late purchase the two differ, and AC-1, AC-6 and MK-01 can each be built two ways.
- **Options:**
  - **A.** "Last" means the newest movement date, the same as the first row of the history - the balance and history screens agree; a late purchase added today may not change the date shown.
  - **B.** "Last" means the movement added most recently - the date shows the latest change; the balance screen can show a date that is not the top row of the history.
- **Recommended Answer:** Option A. UC-01 / Business Rules & Constraints, add at the end: "The date of the last points movement is the date of the newest movement in the points history ([UC-02 step 2](./06a-use-cases-member.md#main-flow-1))."
- **Why:** The history already orders movements by their date, newest first (UC-02 step 2), so Option A keeps both screens in line. Tradeoff: a late purchase does not always move the date on the balance screen.
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-27). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option". Rationale: the Why above. It supplies no fact, adopts no new dependency (AGENTS.md) and sets no rule a source rules out. Applied as UC-01 BR-3. Open remainder: none.

**Rule home:** [06a / UC-01 Business Rules & Constraints](./06a-use-cases-member.md#business-rules--constraints)

### Q-28 - Refund is defined as money paid but can be rejected

**Question:** OI-28 (raised by consistency check CF-09, Run 5, 2026-10-10). The item as raised follows.

**Options considered:**

- **Where:** 02 / Glossary (Refund, Refunds Portal); 06a / UC-02 BR-1, AC-4, AC-9; 08 / Refunds Portal row (raised by consistency check CF-09)
- **Type:** Inconsistency
- **Concern:** The Glossary defines a Refund as "Money paid back to a customer for a purchase". Five places use "refund" for something that can be rejected or cancelled, so no money is paid back: UC-02 BR-1, AC-4, AC-9, the 08 refund outcome list and the Refunds Portal definition. The term has two meanings.
- **Options:**
  - **A.** Reword the Glossary "Refund" as a customer's request to get money back, with its outcome reported by the Refunds Portal - one edit; every "the refund is paid" sentence stays correct.
  - **B.** Keep the Glossary and write "refund request" in BR-1, AC-4, AC-9 and 08 - four edits; agreed criteria change wording.
- **Recommended Answer:** Option A. 02 / Glossary, Refund: "A customer's request to get money back for a purchase. The Refunds Portal handles it and reports its outcome: paid, rejected or cancelled."
- **Why:** It is one edit and matches the Refunds Portal definition and the outcomes the use case already uses (OI-06, OI-26). Tradeoff: "refund" now names the request, not the money.
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-28). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option". Rationale: the Why above. It supplies no fact, adopts no new dependency (AGENTS.md) and sets no rule a source rules out (the source v1.0 Glossary wording changes, not a rule). Open remainder: none.

**Rule home:** [02 / Glossary](./02-glossary-assumptions-facts.md#glossary)

### Q-29 - Leaving the program is not in the use cases

**Question:** OI-29 (raised by consistency check CF-11, Run 5, 2026-10-10). The item as raised follows.

**Options considered:**

- **Where:** 03 / Member leaves the loyalty program vs 06a / UC-01 and UC-02 Preconditions and Acceptance Criteria (raised by consistency check CF-11)
- **Type:** Gap
- **Concern:** OI-22 says a person who has left the program can no longer open their points balance or history. Neither use case shows this: no precondition and no acceptance criterion. How the person is stopped stays with TD-01 and TD-11, but the outcome can be tested now. A builder who reads only 06a would let a person who has left open both screens.
- **Options:**
  - **A.** Add a precondition to UC-01 and UC-02, and a criterion at the end of each list - testable now; adds no flow; the message shown still waits on TD-01.
  - **B.** No change; test the rule only against 03 - no edit; the use cases give no hint of the rule.
- **Recommended Answer:** Option A. UC-01 and UC-02 / Preconditions, add: "- The member has not left the loyalty program ([03 / Member leaves the loyalty program](./03-definitions-and-domain-concepts.md#member-leaves-the-loyalty-program))." UC-01 / Acceptance Criteria, add at the end: "- [ ] Given a person who has left the loyalty program, when they try to open their points, then the system does not show their points balance." UC-02 / Acceptance Criteria, add at the end: "- [ ] Given a person who has left the loyalty program, when they try to open the history, then the system does not show their points history."
- **Why:** OI-22 chose "no new flow"; a precondition and a criterion add none, and they let chunk 16 test the rule. Tradeoff: two more criteria.
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-29). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option". Rationale: the Why above. It supplies no fact, adopts no new dependency (AGENTS.md) and sets no rule a source rules out. Applied as UC-01 AC-7 and UC-02 AC-13. Open remainder: how the person is stopped, and the message they see, stay with TD-01 (sign-in) and TD-11 (leave event), as in Q-22; their Blocks cells in 14-todo.md name the new preconditions, UC-01 AC-7 and UC-02 AC-13 (correction CF-19).

**Rule home:** [06a / UC-01 Preconditions](./06a-use-cases-member.md#preconditions); [06a / UC-02 Preconditions](./06a-use-cases-member.md#preconditions-1)

### Q-30 - History dates and note have no acceptance criterion

**Question:** OI-30 (raised by consistency check CF-12, Run 5, 2026-10-10). The item as raised follows.

**Options considered:**

- **Where:** 06a / UC-02 step 2, AC-2; 03 / Earning points; UC-01 AC-4 (raised by consistency check CF-12)
- **Type:** Gap
- **Concern:** UC-02 step 2 sets which date each movement shows: the purchase date for an earned movement (also for a late purchase), and the date the refund was paid for a taken-back movement. AC-2 checks only that each movement shows "its date". Step 2 also shows the delay note on the history screen, but only UC-01 AC-4 tests the note, on the balance screen.
- **Options:**
  - **A.** Add two criteria at the end of the UC-02 list, one for the dates and one for the note - the date rule (OI-09) and the late-purchase date get a test; two more criteria.
  - **B.** No change; AC-2 and step 2 are enough - no edit; the date rule stays untested.
- **Recommended Answer:** Option A. UC-02 / Acceptance Criteria, add at the end: "- [ ] Given an earned movement for a purchase that reached Loyalty Points after the day it was made, and a taken-back movement for a paid refund, when the member opens the history, then the earned movement shows the purchase date and the taken-back movement shows the date the refund was paid." and "- [ ] Given a member opens the history, then they see the note telling them when new purchases and refunds appear."
- **Why:** Two kinds of date and a late arrival are easy to confuse, and the history note is otherwise untested. Tradeoff: two more criteria to test.
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-30). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option". Rationale: the Why above. It supplies no fact, adopts no new dependency (AGENTS.md) and sets no rule a source rules out. Applied as UC-02 AC-14 and AC-15 (after AC-13 from OI-29). Open remainder: none.

**Rule home:** [06a / UC-02 Acceptance Criteria](./06a-use-cases-member.md#acceptance-criteria-1)

### Q-31 - Refunded still reads as paid in the use cases

**Question:** OI-31 (raised by consistency check CF-17, Run 6, 2026-10-10). The item as raised follows.

**Options considered:**

- **Where:** 03 / Overview (Taken back); 06a / UC-01 step 2, AC-4; UC-02 step 2, A1, AC-1, AC-15 (raised by consistency check CF-17)
- **Type:** Ambiguity
- **Concern:** OI-28 now defines a refund as a request whose outcome is paid, rejected or cancelled. The words "a refunded purchase" and "refunds appear" still assume the money was paid. UC-02 A1 and AC-1 no longer say whether the refund was paid, which AC-4 and AC-9 show matters. The note promises that refunds appear, but a rejected or cancelled refund never appears.
- **Options:**
  - **A.** Carry Q-28 into the text that sets or tests behaviour: "a purchase whose refund is paid" in UC-02 A1 and AC-1, "when the refund of that purchase is paid" in 03, and "new purchases and paid refunds" in the four note texts - every criterion says which outcome it tests; about 7 edits, criteria positions kept.
  - **B.** No change; BR-1 governs - no edits; AC-1 and the note rely on the reader's guess.
- **Recommended Answer:** Option A. 03 / Overview, Taken back: "points the system takes back when the refund of that purchase is paid". UC-02 A1: "At step 2, a movement for a purchase whose refund is paid shows the points taken back and the refund reference." UC-02 AC-1: "Given a purchase that earned 50 points and whose refund is paid, when the member opens the history, then they see a movement of -50 points with the refund reference." UC-01 step 2, UC-01 AC-4, UC-02 step 2 and UC-02 AC-15: "new purchases and refunds" becomes "new purchases and paid refunds".
- **Why:** AC-1 is a test Given, and its sibling criteria AC-4 and AC-9 show that the refund outcome changes the result. Option A gives "refund" one meaning (writing-style.md, rule 6). Tradeoff: agreed criteria change wording, not meaning.
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-31). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option". Rationale: the Why above. It supplies no fact, adopts no new dependency (AGENTS.md) and sets no rule a source rules out. Wording outside the texts named in the Recommended Answer was left as it is, because points are taken back only on a paid refund (UC-02 BR-1): "when a purchase is refunded" (01 / Executive Summary, 04 / In Scope); "after a refund" or "refunded" (01 core capabilities, 02 / Glossary "Points movement", 05, 06a / UC-01 BR-2, the UC-02 A1 title, 08 / Refunds Portal Business Purpose, 10 / NFR-02, 11 / Summary). Open remainder: none. (Record corrected by CF-28.)

**Rule home:** [03 / Overview](./03-definitions-and-domain-concepts.md#overview); [06a / UC-02 Alternate & Exception Flows](./06a-use-cases-member.md#alternate--exception-flows-1); [06a / UC-02 Acceptance Criteria](./06a-use-cases-member.md#acceptance-criteria-1)

### Q-32 - The date of the last movement has no acceptance criterion

**Question:** OI-32 (raised by consistency check CF-18, Run 6, 2026-10-10). The item as raised follows.

**Options considered:**

- **Where:** 06a / UC-01 BR-3 vs UC-01 AC-1, AC-6 (raised by consistency check CF-18)
- **Type:** Gap
- **Concern:** OI-27 added UC-01 BR-3 (the date shown is the date of the newest movement) but no criterion. AC-1 and AC-6 check only that "the date of the last movement" shows. No criterion tests the late-purchase case that made CF-08 a finding, so the balance screen can still be built with the "added most recently" meaning.
- **Options:**
  - **A.** Add a criterion at the end of the UC-01 list with a late purchase - pins BR-3; one more criterion.
  - **B.** No change; test BR-3 directly - no edit; the business never agrees a Given/When/Then for it.
- **Recommended Answer:** Option A. UC-01 / Acceptance Criteria, add at the end: "- [ ] Given a member whose history has a taken-back movement dated 4 March and an earned movement dated 3 March that reached Loyalty Points on 5 March, when they open their points, then they see 4 March as the date of the last movement."
- **Why:** CF-08 named this case, and only a criterion pins it (as OI-18 and OI-30 did for other rules). Tradeoff: one more criterion.
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-32). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option". Rationale: the Why above. It supplies no fact (the dates are a test example), adopts no new dependency (AGENTS.md) and sets no rule a source rules out. Applied as UC-01 AC-8. Open remainder: none.

**Rule home:** [06a / UC-01 Acceptance Criteria](./06a-use-cases-member.md#acceptance-criteria)

### Q-33 - UC-01 AC-8 does not pin the date rule

**Question:** OI-33 (raised by consistency check CF-22, Run 7, 2026-10-10, the third run of that request). The item as raised follows.

**Options considered:**

- **Where:** 06a / UC-01 AC-8 vs UC-01 BR-3, UC-02 BR-5, UC-02 step 2 (raised by consistency check CF-22)
- **Type:** Ambiguity
- **Concern:** AC-8 does not say whether the taken-back movement belongs to the late purchase. If it does, the refund was paid on 4 March before the purchase earned its points on 5 March, and under UC-02 BR-5 both movements are added on 5 March. A build that shows the movement added most recently would then still show 4 March, so the test passes on the wrong build. The Given also says the earned movement "reached Loyalty Points", while 03 / Earning points and UC-02 AC-14 say the purchase does.
- **Options:**
  - **A.** Reword the Given so the taken-back movement belongs to another purchase - AC-8 pins BR-3 under every reading; agreed wording changes, its meaning does not.
  - **B.** No change - no edit; a tester can still pick data that misses the defect.
- **Recommended Answer:** Option A. UC-01 AC-8 (position kept), replace with: "- [ ] Given a member whose history has a taken-back movement dated 4 March for one purchase, and an earned movement for another purchase made on 3 March that reached Loyalty Points on 5 March, when they open their points, then they see 4 March as the date of the last movement."
- **Why:** OI-32 added AC-8 only to pin BR-3, and only Option A does that for every test data choice. Tradeoff: one more wording change to a criterion agreed in this update.
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-33). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option", in the request "update the todo: the grill-me session is done". Rationale: the Why above. It supplies no fact (the dates are a test example), adopts no new dependency (AGENTS.md) and sets no rule a source rules out. A third-run discovery, so it waited as `Decided - pending application` (TD-48). Applied on 2026-10-10 in the request "Apply the decisions waiting for application" as UC-01 AC-8 (position kept), and rechecked by consistency check Run 8. Open remainder: none.

**Rule home:** [06a / UC-01 Acceptance Criteria](./06a-use-cases-member.md#acceptance-criteria)

### Q-34 - UC-02 A1 can read as the purchase row changing

**Question:** OI-34 (raised by consistency check CF-23, Run 7, 2026-10-10, the third run of that request). The item as raised follows.

**Options considered:**

- **Where:** 06a / UC-02 A1 vs UC-02 BR-5, AC-1, AC-11; 03 / Overview (raised by consistency check CF-23)
- **Type:** Ambiguity
- **Concern:** A1 says "a movement for a purchase whose refund is paid shows the points taken back and the refund reference". That also fits the earned movement of the same purchase, as if the purchase row changes in place. 03 / Overview and AC-11 say the take-back is its own movement, and the history shows both movements.
- **Options:**
  - **A.** Reword A1 so it names the taken-back movement - one reading only; one more wording change to an agreed flow.
  - **B.** No change, because 03 and AC-11 already settle it - no edit; A1 keeps two readings, and MK-02 could show the take-back on the purchase row.
- **Recommended Answer:** Option A. UC-02 / Alternate & Exception Flows, A1, replace with: "- **A1 - Points taken back after a refund:** At step 2, when the refund of a purchase is paid, the history shows a taken-back movement with the points taken back and the refund reference."
- **Why:** The flow then matches 03 / Overview and AC-11, and the mockup has one way to show it. Tradeoff: the A1 wording changes again in this cycle.
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-34). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option", in the request "update the todo: the grill-me session is done". Rationale: the Why above. It supplies no fact, adopts no new dependency (AGENTS.md) and sets no rule a source rules out. A third-run discovery, so it waited as `Decided - pending application` (TD-49). Applied on 2026-10-10 in the request "Apply the decisions waiting for application" as UC-02 A1, and rechecked by consistency check Run 8. Run 8 found that the new wording read as if every paid refund adds a taken-back movement at once; correction CF-29 kept the Q-34 wording and added a pointer to UC-02 BR-4 and BR-5 at the end of A1 (carrying Q-07). Open remainder: none.

**Rule home:** [06a / UC-02 Alternate & Exception Flows](./06a-use-cases-member.md#alternate--exception-flows-1)

### Q-35 - Refunds made outside the Refunds Portal

**Question:** OI-35 (raised by business review BO-01, 2026-10-10). The item as raised follows.

**Options considered:**

- **Where:** 06a / UC-02 BR-7 (raised by business review BO-01)
- **Type:** Gap
- **Concern:** UC-02 BR-7 says that only refunds the Refunds Portal reports take points back. Cash refunds at a branch, returns at the till and online-shop refunds never reach Loyalty Points, so a member keeps the points of such a purchase. The business review applied the rule and left this BRD's owner a question: must those refunds also take points back, and which system reports them? Until it is answered, the take-back rule is not final.
- **Options:**
  - **A.** Keep UC-02 BR-7 for this release and add the other refund channels to the Wishlist - no new integration; members keep the points of refunds made outside the Refunds Portal until a later release.
  - **B.** Require every refund channel to take points back - balances stay right after every refund; it needs a new source of refunds that no document names, with its owner, a new 08 row and a new dependency.
- **Recommended Answer:** Option A. 06a / UC-02 BR-7, replace with: "- Only refunds that the Refunds Portal reports take points back. A refund made another way, for example a cash refund at a branch, a return at the till or a refund of an online-shop purchase, takes back no points in this release." 12 / Wishlist, add at the end: "Take points back for refunds made outside the Refunds Portal: cash refunds at a branch, returns at the till and online-shop refunds."
- **Why:** The Refunds Portal BRD leaves cash and online-shop refunds out of its scope (its 04 / Out of Scope, as the business review of 2026-10-10 found under BO-01), and no document names a system that would report these refunds to Loyalty Points: 08 receives only purchases from POS Records. The kept points cost money only once members can redeem them, and redeeming is out of scope (04). Tradeoff: balances stay too high after those refunds until a later release.
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-35). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option", in the request "update the todo: decisions from the business review of 2026-10-10". Rationale: the Why above. It supplies no fact, adopts no new dependency (AGENTS.md) and sets no rule a source rules out. Applied as 06a / UC-02 BR-7 (marker removed) and 12 / Wishlist item 2. It closes TD-51. Open remainder: none. Later the same day, Q-46 (OI-46) removed the online-shop example from UC-02 BR-7 and Wishlist item 2; the rule this record chose stands. Q-48 (OI-48) later added a last sentence to UC-02 BR-7: a refund paid before the Refunds Portal starts to report refund outcomes also takes back no points.

**Rule home:** [06a / UC-02 Business Rules & Constraints](./06a-use-cases-member.md#business-rules--constraints-1)

### Q-36 - When and where Loyalty Points goes live

**Question:** OI-36 (raised by business review PM-02, 2026-10-10). The item as raised follows.

**Options considered:**

- **Where:** 04 / Project Scope (raised by business review PM-02)
- **Type:** Gap
- **Concern:** 04 / Project Scope says Loyalty Points can go live on its own date, but not when, and not whether all branches start at once. Without it, the dependencies needed before go-live (02) have no event to be measured against, and a pilot would need its own rules.
- **Options:**
  - **A.** Go live in all branches at once, after BAT sign-off, once every dependency needed before go-live is in place - one start for every member, using gates the BRD already has; no pilot to find problems first.
  - **B.** Start in some pilot branches first, then the rest - problems show in a few branches first; members' purchases in other branches earn no points until their branch starts, and 03 / Start of points then needs a date per branch.
  - **C.** Name a fixed calendar date now - easy to plan; no document gives a date, so only the product owner can supply it.
- **Recommended Answer:** Option A. 04 / Project Scope, replace the second paragraph with: "Loyalty Points can go live on its own date: it does not wait for the Refunds Portal. It goes live in all branches at once, after BAT sign-off, once every dependency needed before go-live is in place ([02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies))."
- **Why:** 03 / Start of points sets one date for all branch purchases, so one start for all branches keeps that rule as it is, and no member's branch purchase is left without points (Objective 1). BAT sign-off and the 02 dependencies are gates the BRD already has, while no document gives a calendar date. Tradeoff: no pilot to catch problems in a few branches first.
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-36). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option", in the request "update the todo: decisions from the business review of 2026-10-10". Rationale: the Why above. It supplies no fact (it names no date), adopts no new dependency (AGENTS.md) and sets no rule a source rules out. Applied as 04 / Project Scope (marker removed). It closes TD-55 and TD-56. Open remainder: none.

**Rule home:** [04 / Project Scope](./04-scope-and-personas.md#project-scope)

### Q-37 - Whether earning points becomes a use case

**Question:** OI-37 (raised by business review PM-06, 2026-10-10). The item as raised follows.

**Options considered:**

- **Where:** 05 / Use Case Summary (raised by business review PM-06)
- **Type:** Gap
- **Concern:** Earning points is the first In Scope item (04), but it has no use case. Its rules (1 point per 1 EUR, start of points, late purchases, members who left) live in 03 / Earning points with no acceptance criteria. The business review asked whether earning should become a use case with its own criteria.
- **Options:**
  - **A.** Keep earning as rules in 03 / Earning points, with no use case; the acceptance tests for earning trace to that section - no use case without an actor action; earning has no acceptance criteria list of its own.
  - **B.** Add a use case UC-03 "Earn points on a purchase" with its own acceptance criteria - every earning rule gets a criterion; the member takes no action in it, so it needs a system actor, a journey step, a Use Case Summary row, a matrix row and all nine use-case sections.
- **Recommended Answer:** Option A. 05 / Use Case Summary, replace the sentence under Table 4 with: "Earning points on a purchase ([04 / In Scope](./04-scope-and-personas.md#in-scope)) has no use case, because the member takes no action in it. [03 / Earning points](./03-definitions-and-domain-concepts.md#earning-points) holds its rules, and the acceptance tests for earning trace to that section."
- **Why:** The member does nothing in earning: the purchase happens at the branch, and its points appear in UC-01 and UC-02. A capability with no use case still gets its own delivery task and acceptance tests that trace to its owning section, and no use case is created only for test coverage (brd-unifier delivery-chunks.md § Chunk 15 and § Chunk 16). Tradeoff: the earning tests are written from the 03 rules, not from a criteria list.
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-37). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option", in the request "update the todo: decisions from the business review of 2026-10-10". Rationale: the Why above. It supplies no fact, adopts no new dependency (AGENTS.md) and sets no rule a source rules out. Applied as 05 / Use Case Summary (marker removed). It closes TD-57. Open remainder: none.

**Rule home:** [05 / Use Case Summary](./05-user-journeys-overview.md#use-case-summary)

### Q-38 - Who counts branch calls, and from when

**Question:** OI-38 (raised by business review PM-08, 2026-10-10). The item as raised follows.

**Options considered:**

- **Where:** 01 / Business Objective 2 (raised by business review PM-08)
- **Type:** Gap
- **Concern:** Objective 2 is measured by branch calls about points. No system or persona records those calls, and a before-and-after comparison needs a count from before go-live. 01 asks who counts the calls and from which date. The same "who" question is to-do row TD-36.
- **Options:**
  - **A.** Each branch counts the calls about points it receives, starting at least one full calendar month before go-live and going on after go-live - the people who take the calls count them; one month is the shortest baseline for a monthly measure.
  - **B.** Each branch counts for at least three full calendar months before go-live - a steadier baseline; counting must start earlier, which may not be possible if go-live is near.
  - **C.** A central team counts the calls - one team owns the figure; the calls go to branches, so that team still relies on them, and no document names such a team.
- **Recommended Answer:** Option A. 01 / Business Objective 2, replace "Branch calls about points are counted before go-live, so the result can be compared." and its marker with: "Each branch counts the calls about points it receives. Counting starts at least one full calendar month before go-live, so the result can be compared, and goes on after go-live."
- **Why:** Objective 2 is about calls to branches, so the branches are the ones who receive them, and its measure is per month, so one full month is the shortest baseline it can use. Tradeoff: a one-month baseline can be thrown off by a busy or quiet month; counting can still start earlier.
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-38). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option", in the request "update the todo: decisions from the business review of 2026-10-10". Rationale: the Why above. The one-month minimum is a target the business sets, proposed with its Why, so it is a choice, not a fact (SKILL.md step 8, Answer policy, rule 3). It adopts no new dependency (AGENTS.md) and sets no rule a source rules out. Applied as 01 / Business Objective 2 (marker removed). It closes TD-36 and TD-58. Open remainder: none; the call counts themselves stay TD-22 to TD-24.

**Rule home:** [01 / Business Objectives](./01-executive-summary-and-context.md#business-objectives)

### Q-39 - What members are told at launch about using points

**Question:** OI-39 (raised by business review PM-09, 2026-10-10). The item as raised follows.

**Options considered:**

- **Where:** 04 / Out of Scope (raised by business review PM-09)
- **Type:** Gap
- **Concern:** Redeeming points is a later phase, so at launch members collect points they cannot use. 04 asks when redeeming is planned and what members are told at launch. Nothing in the product tells a member that points cannot be used yet, which can lead to the branch calls Objective 2 aims to cut. When redeeming is planned is a fact for the product owner (TD-59); what members are told is a choice.
- **Options:**
  - **A.** The balance screen tells the member that points cannot be used yet - members learn it where they look at their points; one more line on MK-01 and one more criterion.
  - **B.** Say nothing in the product, and leave it to launch messages outside this BRD - no screen change; members who miss those messages may call a branch.
- **Recommended Answer:** Option A. 06a / UC-01 step 2, replace with: "2. The system shows the current points balance, the date of the last points movement, a note that tells the member when new purchases and paid refunds appear in their points, and a line that says points cannot be used yet." Add at the end of UC-01 Acceptance Criteria: "- [ ] Given a member opens their points, then they see a line that says points cannot be used yet." 04 / Out of Scope, first bullet, replace with: "- Redeeming points (a later phase). **[NEEDS CLARIFICATION: When is redeeming points planned?]** At launch, the points balance tells members that points cannot be used yet ([UC-01 step 2](./06a-use-cases-member.md#main-flow))."
- **Why:** Objective 2 aims to cut branch calls about points, and a member who sees a balance with no way to use it is likely to ask a branch. The balance screen is the one screen every member sees (UC-01). Tradeoff: the line must change when redeeming arrives. The planning date stays its own question, so the marker asks only that.
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-39). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option", in the request "update the todo: decisions from the business review of 2026-10-10". Rationale: the Why above. It supplies no fact (the planning date stays a marker), adopts no new dependency (AGENTS.md) and sets no rule a source rules out. Applied as 06a / UC-01 step 2 and UC-01 AC-9, and 04 / Out of Scope, where the marker that asked two questions is replaced by one marker on the planning date (TD-59). It closes TD-60. Open remainder: the planning date (a fact, TD-59).

**Rule home:** [06a / UC-01 Main Flow](./06a-use-cases-member.md#main-flow)

### Q-40 - Points earned before redeeming or expiry

**Question:** OI-40 (raised by business review PM-09, 2026-10-10). The item as raised follows.

**Options considered:**

- **Where:** 03 / Overview, Expiry (raised by business review PM-09)
- **Type:** Risk
- **Concern:** Points do not expire in this release (D1), and redeeming comes later. When redeeming or an expiry rule is added, points earned before then need a rule, or members may lose value they were told they keep. 03 asks how those points are treated.
- **Options:**
  - **A.** Points earned before then keep their full value; if a later release adds expiry, their expiry period starts on the day the expiry rule starts - members keep what they were told; the outstanding balance stays a cost until it is used.
  - **B.** Leave the treatment to the release that adds redeeming or expiry - no promise now; nobody knows what happens to existing points, and the 03 rule stays open.
- **Recommended Answer:** Option A. 03 / Overview, replace the Expiry paragraph with: "**Expiry:** Points do not expire in this release. Points earned before redeeming or an expiry rule is added keep their full value. If a later release adds expiry, the expiry period of those points starts on the day the expiry rule starts, not on the day they were earned."
- **Why:** The BRD says points do not expire (D1), and Objective 1 is that members trust their balance; taking value away later would break that trust. Tradeoff: the business carries the full outstanding balance until redeeming arrives, and a later expiry rule cannot shorten it.
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-40). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option", in the request "update the todo: decisions from the business review of 2026-10-10". Rationale: the Why above. It supplies no fact, adopts no new dependency (AGENTS.md) and sets no rule a source rules out (D1 stands). Applied as 03 / Overview, Expiry (marker removed). It closes TD-61. Open remainder: none.

**Rule home:** [03 / Overview](./03-definitions-and-domain-concepts.md#overview)

### Q-41 - Telling members when points are taken back

**Question:** OI-41 (raised by business review PM-10, 2026-10-10). The item as raised follows.

**Options considered:**

- **Where:** 06a / UC-02 BR-8 (raised by business review PM-10)
- **Type:** Gap
- **Concern:** A paid refund lowers a member's balance with no notice; the member finds it only by opening the history. UC-02 BR-8 asks whether the member is told, for example by email.
- **Options:**
  - **A.** No message in this release; the member sees the take-back in the history, and a message becomes a UC-02 Future Enhancement - no new way to send messages; a member may be surprised by a lower balance.
  - **B.** Email the member when points are taken back - members are not surprised; Loyalty Points has no way to send messages today (08), and a new messaging provider needs the product owner's approval before any design adopts it (AGENTS.md).
- **Recommended Answer:** Option A. 06a / UC-02 BR-8, replace with: "- The system sends the member no message when points are taken back. The member sees the take-back in the points history (A1)." 06a / UC-02 Future Enhancements, add: "- Tell the member when points are taken back after a refund."
- **Why:** The customer already hears about the refund itself from the Refunds Portal, by email and SMS (Refunds Portal BRD 03 / Customer messages, as the business review of 2026-10-10 recorded under PM-10), and the history shows each take-back with its refund reference (UC-02 A1, AC-1). Option B needs a way to send messages that no Loyalty Points document names, which the product owner must approve first. Tradeoff: a member who does not open the history may not link a lower balance to the refund.
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-41). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option", in the request "update the todo: decisions from the business review of 2026-10-10". Rationale: the Why above. It supplies no fact, adopts no new dependency (it avoids one; AGENTS.md) and sets no rule a source rules out. Applied as 06a / UC-02 BR-8 (the bullet that held only the marker now states the rule, position kept) and UC-02 Future Enhancements; the 13 / Reviewer Notes scope proposal now points here. It closes TD-62. Open remainder: none.

**Rule home:** [06a / UC-02 Business Rules & Constraints](./06a-use-cases-member.md#business-rules--constraints-1)

### Q-42 - A view for the people who answer points calls

**Question:** OI-42 (raised by business review PM-11, 2026-10-10). The item as raised follows.

**Options considered:**

- **Where:** 04 / Personas / Actors (raised by business review PM-11)
- **Type:** Gap
- **Concern:** The people who answer member calls and complaints about points cannot see a member's points (NFR-05). 04 asks whether they get a read-only view; a yes adds a persona and changes NFR-05.
- **Options:**
  - **A.** No view in this release, and add it to the Wishlist - NFR-05 and the matrix stay as they are; those people still answer calls without seeing the member's points.
  - **B.** Add a read-only persona now - callers can be helped; it needs a new persona, journey, use case, matrix column and an NFR-05 change, and the team is still unnamed (TD-08).
- **Recommended Answer:** Option A. 04 / Personas / Actors, replace the marker under Table 3 with: "People who answer member calls and complaints about points have no view of a member's points in this release ([NFR-05](./10-nfrs.md#non-functional-requirements))." 12 / Wishlist, add at the end: "A read-only view of a member's points for the people who answer member calls and complaints about points."
- **Why:** Option B is a whole new persona and use case whose behaviour no source states (which team, what it may see, how it finds a member), and the team that handles complaints is still an open question (TD-08). NFR-05 keeps points visible only to the member. Tradeoff: callers cannot see points until a later release; members still see their own.
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-42). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option", in the request "update the todo: decisions from the business review of 2026-10-10". Rationale: the Why above. It supplies no fact, adopts no new dependency (AGENTS.md) and sets no rule a source rules out. Applied as 04 / Personas / Actors (marker removed) and 12 / Wishlist item 3. No persona or matrix change. It closes TD-63. Open remainder: none.

**Rule home:** [04 / Personas / Actors](./04-scope-and-personas.md#personas--actors)

### Q-43 - How long to wait for the purchase of a paid refund

**Question:** OI-43 (raised by business review PA-02, 2026-10-10). The item as raised follows.

**Options considered:**

- **Where:** 06a / UC-02 BR-5 (raised by business review PA-02)
- **Type:** Gap
- **Concern:** If a refund is paid before its purchase has earned points, the system waits for the purchase. POS Records sends only members' purchases (08), so the purchase of a customer who is not a member never arrives, and the wait never ends. UC-02 BR-5 asks how long the system waits before it treats the purchase as one that earns no points.
- **Options:**
  - **A.** Wait 30 days after the refund is paid; then the refund adds no movement, and a purchase that arrives later keeps the points it earns - covers late purchases for a month; a purchase later than that keeps points for refunded money.
  - **B.** Wait 1 day after the refund is paid, because Assumption 1 says purchases are known the same day - ends quickly; any purchase later than 1 day keeps refunded points, and Assumption 1 is not confirmed yet (TD-21).
  - **C.** Wait with no limit, as now - no refunded points are kept; the wait never ends for customers who are not members.
- **Recommended Answer:** Option A. 06a / UC-02 BR-5, replace with: "- If a refund is paid before its purchase has earned points, the system takes the points back when the purchase earns them. The history then shows both movements. The system waits up to 30 days after the refund is paid. If the purchase has not earned points by then, the refund adds no movement, and the purchase keeps the points it earns if it arrives later." UC-02 AC-11 (position kept), replace with: "- [ ] Given a refund paid before its purchase has earned points, when the purchase earns its points within 30 days after the refund is paid, then the history shows the earned movement and the taken-back movement." Add at the end of UC-02 Acceptance Criteria: "- [ ] Given a refund paid on 1 March whose purchase earns its points on 5 April, when the member opens the history, then they see the earned movement and no taken-back movement for that refund."
- **Why:** A longer wait costs members nothing, because a customer who is not a member has no history to see, and every member purchase that arrives within the wait still loses its refunded points (NFR-01). 30 days is the refund period the Refunds Portal already uses (Refunds Portal BRD UC-01 BR-1, as the business review of 2026-10-10 recorded under SME-09). Option B depends on Assumption 1, which is still open (TD-21). Tradeoff: a member purchase that arrives more than 30 days after its refund is paid keeps points for refunded money.
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-43). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option", in the request "update the todo: decisions from the business review of 2026-10-10". Rationale: the Why above. The 30 days is a time limit the business sets, proposed with its Why, so it is a choice, not a fact (SKILL.md step 8, Answer policy, rule 3). It adopts no new dependency (AGENTS.md) and sets no rule a source rules out. Applied as 06a / UC-02 BR-5 (marker removed), UC-02 AC-11 (position kept) and UC-02 AC-17. It closes TD-64. Open remainder: none.

**Rule home:** [06a / UC-02 Business Rules & Constraints](./06a-use-cases-member.md#business-rules--constraints-1)

### Q-44 - Criticality values outside the template scale

**Question:** OI-44 (raised by consistency check CF-34, Run 11, 2026-10-10). The item as raised follows.

**Options considered:**

- **Where:** 08 / Integrations, Criticality of the POS Records and Refunds Portal rows (raised by consistency check CF-34)
- **Type:** Inconsistency
- **Concern:** Both rows say "High". The template scale for Criticality is Critical, Important or Nice-to-have. POS Records "High" comes from the source v1.0, and Q-25 set the Refunds Portal to "High" to match it. A value outside the scale leaves the SDD unable to tell whether the integrations are Critical or Important.
- **Options:**
  - **A.** Set both cells to "Critical" - keeps the parity Q-25 chose and the source's top rating; only the word changes.
  - **B.** POS Records "Critical", Refunds Portal "Important" - follows 04 (go-live does not wait for the Refunds Portal); it re-decides the parity Q-25 chose.
- **Recommended Answer:** Option A. 08 / Integrations, Criticality of the POS Records row and of the Refunds Portal row: replace "High" with "Critical".
- **Why:** It changes no decided meaning: Q-25 kept the two rows at the same level, and the source rated POS Records at its top level. How critical an integration is differs from whether go-live waits for it, which OI-45 settles. Tradeoff: the Refunds Portal reads as Critical although go-live does not wait for it.
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-44). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option", in the request "update the todo: decisions from the business review of 2026-10-10". Rationale: the Why above. It supplies no fact, adopts no new dependency (AGENTS.md) and sets no rule a source rules out. Applied as 08 / Integrations (both Criticality cells). It closes TD-65. This updates the wording that Q-25 chose; Q-25's level stands. Open remainder: none.

**Rule home:** [08 / Integrations](./08-integrations.md#integrations)

### Q-45 - Refunds Portal milestone against going live on its own

**Question:** OI-45 (raised by consistency check CF-35, Run 11, 2026-10-10). The item as raised follows.

**Options considered:**

- **Where:** 02 / Dependencies, Refunds Portal row, Needed before, vs 04 / Project Scope (raised by consistency check CF-35)
- **Type:** Inconsistency
- **Concern:** 04 says Loyalty Points does not wait for the Refunds Portal and goes live once every dependency needed before go-live is in place (PM-02, Q-36). The 02 marker still offers "before BAT sign-off" or "before go-live" as answers. Either answer would make go-live wait for the Refunds Portal, which 04 rules out.
- **Options:**
  - **A.** Narrow the 02 marker (and TD-18) to the answers 04 allows: before the build of UC-02, or at no milestone of this release - keeps the go-live independence the review decided; UC-02 take-backs may go live without a test against the live Refunds Portal.
  - **B.** Keep the three answers and qualify 04 to "unless 02 names it as needed before BAT sign-off or go-live" - every answer stays possible; the independence then holds only for one answer.
- **Recommended Answer:** Option A. 02 / Dependencies, Refunds Portal row, Needed before, replace the marker with: "**[NEEDS CLARIFICATION: Is the Refunds Portal dependency needed before the build of UC-02, or at no milestone of this release? Go-live does not wait for it ([04 / Project Scope](./04-scope-and-personas.md#project-scope)).]**" Add 04 / Project Scope to the Blocks cell of TD-18.
- **Why:** The business review decided on purpose that Loyalty Points goes live on its own (PM-02, Q-36), and UC-02 BR-7 already lets Loyalty Points work without take-backs from other sources. Tradeoff: take-backs may start without a test against the live Refunds Portal.
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-45). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option", in the request "update the todo: decisions from the business review of 2026-10-10". Rationale: the Why above. It supplies no fact (the milestone stays a marker), adopts no new dependency (AGENTS.md) and sets no rule a source rules out. Applied as 02 / Dependencies (the Refunds Portal Needed before marker, narrowed) and the TD-18 row. It closes TD-66. Open remainder: the milestone itself (TD-18, narrowed). Later the same day, Q-47 (OI-47) replaced the narrowed marker: the Refunds Portal is needed before no milestone of this release, and TD-18 is resolved. This record is superseded on that point.

**Rule home:** [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies)

### Q-46 - Online-shop refunds in UC-02 BR-7

**Question:** OI-46 (raised by consistency check CF-36, Run 11, 2026-10-10). The item as raised follows.

**Options considered:**

- **Where:** 06a / UC-02 BR-7 and 12 / Wishlist item 2 vs 02 / Glossary "Points", 03 / Earning points, UC-02 BR-4 (raised by consistency check CF-36)
- **Type:** Inconsistency
- **Concern:** BR-7 lists a refund of an online-shop purchase among the refunds that take back no points "in this release", and Wishlist item 2 plans to take points back for online-shop refunds. Only branch purchases earn points (02, 03), and UC-02 BR-4 already says the refund of a purchase that earned no points adds no movement. The wording suggests there are points to take back.
- **Options:**
  - **A.** Drop the online-shop example from BR-7 and from Wishlist item 2 - no scope change; edits the Q-35 wording.
  - **B.** Keep the example and say in Wishlist item 2 that online-shop purchases would first need to earn points - keeps the review wording; adds a new scope idea.
- **Recommended Answer:** Option A. 06a / UC-02 BR-7, replace "for example a cash refund at a branch, a return at the till or a refund of an online-shop purchase, takes back no points in this release." with "for example a cash refund at a branch or a return at the till, takes back no points in this release." 12 / Wishlist item 2, replace "cash refunds at a branch, returns at the till and online-shop refunds." with "cash refunds at a branch and returns at the till."
- **Why:** 03 / Earning points and UC-02 BR-4 already decide the online-shop case, and Option A adds no scope. Tradeoff: the BR-7 wording that Q-35 kept changes once more.
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-46). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option", in the request "update the todo: decisions from the business review of 2026-10-10". Rationale: the Why above. It supplies no fact, adopts no new dependency (AGENTS.md) and sets no rule a source rules out. Applied as 06a / UC-02 BR-7 and 12 / Wishlist item 2. This supersedes the example list in the Q-35 wording; the Q-35 rule stands. It closes TD-67. Open remainder: none.

**Rule home:** [06a / UC-02 Business Rules & Constraints](./06a-use-cases-member.md#business-rules--constraints-1)

### Q-47 - Refunds Portal milestone has no consistent answer

**Question:** OI-47 (raised by consistency check CF-41, Run 12, 2026-10-10). The item as raised follows.

**Options considered:**

- **Where:** 02 / Dependencies, Refunds Portal row, Needed before, vs 04 / Project Scope; 14 / TD-18 (raised by consistency check CF-41)
- **Type:** Inconsistency
- **Concern:** The marker that OI-45 narrowed still offers two answers, and neither fits. "Before the build of UC-02" still makes go-live wait for the Refunds Portal, because 04 puts go-live after BAT sign-off and BAT needs UC-02 built with its dependency in place. "At no milestone of this release" is not a value of the Needed before scale (build of a use case, BAT sign-off, go-live).
- **Options:**
  - **A.** Settle Needed before as "None in this release: go-live does not wait for it", and say in Notes that UC-02 take-backs start once the Refunds Portal reports refund outcomes; TD-18 closes - keeps the go-live independence that PM-02, Q-36 and Q-45 chose; an off-scale value, stated on purpose, and UC-02 take-backs can pass BAT without live refund outcomes.
  - **B.** Needed before "Build of UC-02", and qualify 04 so that UC-02 is built once the Refunds Portal can report refund outcomes - a scale value and an honest build dependency; go-live independence becomes partial (the option Q-45 did not choose).
- **Recommended Answer:** Option A. 02 / Dependencies, Refunds Portal row: Needed before, replace the marker with "None in this release: go-live does not wait for it ([04 / Project Scope](./04-scope-and-personas.md#project-scope))."; Notes, add at the end: "UC-02 take-backs start once the Refunds Portal reports refund outcomes."
- **Why:** PM-02, Q-36 and Q-45 each chose that Loyalty Points goes live on its own, and UC-02 BR-7 already accepts that members keep points for refunds Loyalty Points never hears about. Tradeoff: an off-scale value in Needed before, and UC-02 take-backs may go live without a test against the live Refunds Portal (the tradeoff Q-45 already accepted).
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-47). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option", in the request "update the todo: decisions from the business review of 2026-10-10". Rationale: the Why above. It supplies no fact, adopts no new dependency (AGENTS.md) and sets no rule a source rules out. Applied as 02 / Dependencies (Refunds Portal row, Needed before and Notes; marker removed). This supersedes the narrowed marker that Q-45 applied. It closes TD-68 and TD-18. Open remainder: none; the owner of the dependency stays TD-17.

**Rule home:** [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies)

### Q-48 - Refunds paid before the Refunds Portal starts reporting

**Question:** OI-48 (raised by consistency check CF-47, Run 13, 2026-10-10, the third run of that request). The item as raised follows.

**Options considered:**

- **Where:** 02 / Dependency "Refunds Portal" (Needed before, Notes); 06a / UC-02 BR-7; 10 / NFR-02; UC-01 BR-2 (raised by consistency check CF-47)
- **Type:** Missing scenario
- **Concern:** After OI-47, Loyalty Points can go live before the Refunds Portal reports refund outcomes. Refunds paid after go-live but before reporting starts have no stated treatment. If the Refunds Portal reports them later, the take-back comes long after the refund was paid and breaks NFR-02 and the note members see (UC-01 BR-2). If they never take points back, nothing says so: UC-02 BR-7 covers only refunds made outside the Refunds Portal.
- **Options:**
  - **A.** Only refunds paid on or after the day the Refunds Portal starts reporting take points back; earlier refunds take back none, so NFR-02 and the note apply from that day - no new demand on the Refunds Portal; balances stay too high for refunds paid in that window.
  - **B.** When reporting starts, the Refunds Portal sends every refund paid since the start of points, and the system takes those points back - balances end up right (Objective 1, NFR-01); members suddenly see take-backs with old dates, and it needs the Refunds Portal to send past refunds, which only its unnamed owner (TD-17) can confirm.
- **Recommended Answer:** Option A. 06a / UC-02 BR-7, add at the end of the bullet (position kept): "A refund paid before the Refunds Portal starts to report refund outcomes to Loyalty Points also takes back no points."
- **Why:** It puts no new demand on a system whose owner is not named yet (TD-17), and it follows the UC-02 BR-7 rule (Q-35): refunds Loyalty Points does not hear about take back nothing in this release, and kept points cost nothing while redeeming is out of scope (04). Tradeoff: balances stay too high for refunds paid before reporting starts.
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-48). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option", in the request "update the todo: decisions from the business review of 2026-10-10". Rationale: the Why above. It supplies no fact, adopts no new dependency (AGENTS.md) and sets no rule a source rules out. A third-run discovery, so it waited as `Decided - pending application` (TD-69). Applied on 2026-10-10 in the request "Apply the decisions waiting for application in the Loyalty Points BRD (TD-69, TD-70)" as the last sentence of 06a / UC-02 BR-7 (position kept), and rechecked by consistency check Run 14. It closes TD-69. Open remainder: none; the owner of the Refunds Portal dependency stays TD-17. The applied wording ("paid before the Refunds Portal starts to report") is the rule; the "on or after the day" in the Option A summary is not (Q-49). Later the same day, Q-50 (OI-50) made the day the cut-off after all ("paid before the day the Refunds Portal starts to report"), because the Refunds Portal sends only the date a refund was paid; that supersedes the previous sentence. Run 14 also carried this decision into 02 / Dependencies, Refunds Portal row, Notes (CF-52), and Q-49 added UC-02 AC-18 to test it.

**Rule home:** [06a / UC-02 Business Rules & Constraints](./06a-use-cases-member.md#business-rules--constraints-1)

### Q-49 - No acceptance criterion for refunds paid before reporting starts

**Question:** OI-49 (raised by consistency check CF-53, Run 14, 2026-10-10, the first run of the request "Apply the decisions waiting for application in the Loyalty Points BRD (TD-69, TD-70)"). The item as raised follows.

**Options considered:**

- **Where:** 06a / UC-02 BR-7 (last sentence) vs UC-02 Acceptance Criteria AC-1 to AC-17; Q-48 (raised by consistency check CF-53)
- **Type:** Gap
- **Concern:** The last sentence of UC-02 BR-7 (Q-48) describes behaviour a member can see: the OI-48 Concern names the case where the Refunds Portal reports such refunds later, and UC-02 BR-3 already expects a refund to be reported more than once. No UC-02 criterion tests it. The Q-48 Option A summary also says "on or after the day" reporting starts, while the applied rule says "before the Refunds Portal starts to report", so the cut-off moment is not pinned by any test.
- **Options:**
  - **A.** Add one criterion at the end of the UC-02 list that pins the cut-off as BR-7 is worded (the moment reporting starts) - no change to the applied rule, and the rule gets a test; the "day" wording in the Q-48 option summary stays looser than the rule.
  - **B.** Change BR-7 to day granularity ("paid before the day the Refunds Portal starts to report") and add the criterion with that wording - follows the Q-48 option summary; changes the applied rule text again, against the Recommended Answer that Q-48 accepted.
  - **C.** Add no criterion and record No change - no edit; chunk 16 has no test, and the cut-off may never be built.
- **Recommended Answer:** Option A. Add at the end of 06a / UC-02 Acceptance Criteria, as AC-18: "- [ ] Given a refund paid before the Refunds Portal starts to report refund outcomes to Loyalty Points, when the Refunds Portal reports it as paid after reporting has started, then the history shows no taken-back movement for that refund." Optionally, add one line to the Q-48 decision record: "The applied wording (before the Refunds Portal starts to report) governs; the option summary's 'on or after the day' is not the rule."
- **Why:** Q-48 accepted the Recommended Answer text, which is the applied BR-7 wording, so the moment-based cut-off is the decided rule. The OI-48 Concern expects the Refunds Portal to report such refunds later, and BR-3 already accepts repeat reports, so an old refund can arrive. Earlier runs handled rules without criteria the same way (CF-01 / OI-18, CF-11 / OI-29, CF-18 / OI-32). Tradeoff: the test needs a known moment when reporting starts; the cut-off stays tied to an event, not a named date (a named date would be a fact for the Refunds Portal owner, TD-17).
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-49). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option", in the request "Apply the decisions waiting for application in the Loyalty Points BRD (TD-69, TD-70)". Rationale: the Why above. It supplies no fact (the cut-off stays an event; the dates are not used), adopts no new dependency (AGENTS.md) and sets no rule a source rules out. Applied as 06a / UC-02 AC-18, added at the end of the list, and the optional line in Q-48. It closes TD-71. Open remainder: none. Later the same day, Q-50 (OI-50) replaced the moment cut-off with the day cut-off in UC-02 BR-7 and AC-18 and added AC-19. This record is superseded on the cut-off; the AC-18 criterion it added stands, reworded.

**Rule home:** [06a / UC-02 Acceptance Criteria](./06a-use-cases-member.md#acceptance-criteria-1)

### Q-50 - The reporting cut-off cannot be applied with the date alone

**Question:** OI-50 (raised by consistency check CF-55, Run 15, 2026-10-10, the second run of the request "Apply the decisions waiting for application in the Loyalty Points BRD (TD-69, TD-70)"). The item as raised follows.

**Options considered:**

- **Where:** 06a / UC-02 BR-7 (last sentence), AC-18 vs 08 / Integrations, Refunds Portal row (Information Exchanged: "date the refund was paid"), UC-02 steps 2 and 4; Q-49 (raised by consistency check CF-55)
- **Type:** Gap
- **Concern:** Q-49 kept a cut-off at the moment reporting starts and rejected day granularity. The Refunds Portal row sends only the date the refund was paid, not the time. For a refund paid on the day reporting starts, the system cannot tell whether it was paid before or after that moment, so it cannot apply UC-02 BR-7 as worded. Q-49 weighed the wording of the Q-48 summary, not the data that is received. Refunds paid on the start day have no buildable rule, and AC-18 does not test that day.
- **Options:**
  - **A.** Keep the moment rule and add "time the refund was paid" to the 08 Refunds Portal row - the decided wording stays; a new data demand on the Refunds Portal, which only its unnamed owner can confirm (TD-17), and Q-48 chose its option to avoid new demands on that system.
  - **B.** Use the day as the cut-off: refunds paid on or after the day reporting starts take points back - no new data is needed, because the paid date is already sent, and it matches the Q-48 Option A summary ("on or after the day"); BR-7, AC-18 and the 02 Notes are reworded again, and a start-day refund paid just before reporting began takes points back if the Refunds Portal reports it.
  - **C.** Use the day the other way: refunds paid on or before the start day take back no points - no new data is needed; refunds paid after reporting began that day take nothing back, which breaks NFR-02 and the member note (UC-01 BR-2) for that day.
- **Recommended Answer:** Option B. 06a / UC-02 BR-7, last sentence (position kept): "A refund paid before the day the Refunds Portal starts to report refund outcomes to Loyalty Points also takes back no points." 06a / UC-02 AC-18 (position kept): "- [ ] Given a refund paid before the day the Refunds Portal starts to report refund outcomes to Loyalty Points, when the Refunds Portal reports it as paid after reporting has started, then the history shows no taken-back movement for that refund." New AC-19 at the end of the UC-02 list: "- [ ] Given a purchase that earned 50 points and whose refund is paid on the day the Refunds Portal starts to report refund outcomes, when the Refunds Portal reports it as paid, then the history shows a movement of -50 points with the refund reference." 02 / Dependencies, Refunds Portal Notes: change "a refund paid before then" to "a refund paid before that day". decision-log: add a forward note in Q-49 saying this decision replaces its moment cut-off.
- **Why:** The 08 Refunds Portal row and UC-02 steps 2 and 4 carry only the date the refund was paid, so a moment cut-off cannot be applied on the start day without new data from a system whose owner is not named (TD-17); Q-48 chose its option to put no new demand on that system. Q-49 rejected day granularity only because it meant rewording the applied text again, not on substance. The day cut-off is the one the Q-48 Option A summary described. Tradeoff: on the start day only, a refund paid shortly before reporting began takes points back if the Refunds Portal reports it; that is one day's refunds, and it moves balances toward correct (Objective 1, NFR-01).
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-50). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option", in the request "Apply the decisions waiting for application in the Loyalty Points BRD (TD-69, TD-70)". Rationale: the Why above. It supplies no fact (the start day stays an event; the dates in AC-19 are not used), adopts no new dependency (AGENTS.md) and sets no rule a source rules out. Applied as 06a / UC-02 BR-7 (last sentence), AC-18 (position kept), AC-19 (added at the end) and 02 / Dependencies (Refunds Portal row, Notes), and the forward note in Q-49. The plain-language pass wrote the 02 Notes change as two sentences, "UC-02 take-backs start once the Refunds Portal reports refund outcomes. A refund paid before the day it starts to report takes back no points (UC-02 BR-7).", so that "that day" has a clear day to point at; the meaning is the Recommended Answer's. This supersedes Q-49 on the cut-off. It closes TD-72. Open remainder: none. Forward note: Q-51 (OI-51) later qualified NFR-02 for the start day. For a refund paid on the day the Refunds Portal starts to report refund outcomes, the 1 hour runs from the Refunds Portal reporting it as paid, not from the payment; if the purchase earns its points later, it runs from the purchase earning them (CF-58, see Q-51).

**Rule home:** [06a / UC-02 Business Rules & Constraints](./06a-use-cases-member.md#business-rules--constraints-1)

### Q-51 - NFR-02 for refunds paid on the start day before reporting began

**Question:** OI-51 (raised by consistency check CF-56, Run 16, 2026-10-10, the third run of the request "Apply the decisions waiting for application in the Loyalty Points BRD (TD-69, TD-70)"). The item as raised follows.

**Options considered:**

- **Where:** 10 / NFR-02 (Business Measure); 06a / UC-01 BR-2 (the note) vs 06a / UC-02 BR-7 (last sentence), AC-19; decision-log Q-50 (raised by consistency check CF-56)
- **Type:** Inconsistency
- **Concern:** Q-50 made the day the cut-off, so a refund paid on the start day before reporting began now takes points back. That happens only once the Refunds Portal reports it, after reporting starts, which can be hours after the refund was paid. NFR-02 still says "Within 1 hour of the refund being paid", and the UC-01 BR-2 note repeats that promise. For these refunds, NFR-02 cannot be met by design. Q-50 rejected its Option C because it breaks NFR-02 and the note for that day, but its Option B leaves the same break. TD-34 asks about the Refunds Portal's normal reporting speed, not this case.
- **Options:**
  - **A.** Qualify NFR-02 for the start day: for refunds paid on the start day, measure the time from the Refunds Portal's report, not from the payment - no new demand on the Refunds Portal, Q-50 stands, and the measure can be met; on that one day, delays at the Refunds Portal are not counted in NFR-02.
  - **B.** No body change; record the gap in decision-log Q-50 - no rewording; chunk 16 inherits a measure that fails by design, and the member note is wrong that day.
  - **C.** Ask the Refunds Portal owner to start reporting at the beginning of a day, so no start-day refund is paid before reporting starts - NFR-02 and the note hold unchanged; a new demand on a system whose owner is not named (TD-17), which Q-48 and Q-50 chose to avoid, and it stays a fact on a TD row until the owner answers.
- **Recommended Answer:** Option A. 10 / NFR-02, Business Measure, add at the end: "For a refund paid on the day the Refunds Portal starts to report refund outcomes, within 1 hour of the Refunds Portal reporting it as paid." UC-01 BR-2 needs no change, because it points at NFR-02. In decision-log Q-50, add a forward note that NFR-02 was qualified for the start day.
- **Why:** The BRD already treats a one-day break of NFR-02 as a real cost: Q-50 rejected Option C for it, and OI-48 was raised for the same effect over a longer window. The day cut-off has that effect for start-day refunds paid before reporting began, because they can take points back only after the Refunds Portal reports them. Option A keeps Q-50 and puts no new demand on the Refunds Portal, as Q-48 and Q-50 chose (TD-17 open). Tradeoff: on the start day only, NFR-02 does not measure delays at the Refunds Portal.
- **Status at decision:** Open

**Decision record, 2026-10-10:** Accept recommendation (the Recommended Answer of OI-51). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08), under its rule "accept the recommended option", in the request "Apply the decisions waiting for application in the Loyalty Points BRD (TD-69, TD-70)". Rationale: the Why above. It supplies no fact (the 1-hour target already exists in NFR-02; the start day stays an event), adopts no new dependency (AGENTS.md) and sets no rule a source rules out. A third-run discovery, so it waited as `Decided - pending application` (TD-73). Applied on 2026-10-10 in the request "Apply the decisions waiting for application in the Loyalty Points BRD (TD-73)" as the last sentence of the 10 / NFR-02 Business Measure, with the forward note in Q-50, and rechecked by consistency check Run 17. Run 17 found that this sentence and the Q-43 sentence of NFR-02 set two different start points for a start-day refund whose purchase earns its points later (CF-58). The correction, which carries Q-43 and this decision, moved this sentence to second place and made the Q-43 sentence apply in both cases. UC-01 BR-2 was not changed: it points at NFR-02. It closes TD-73. Open remainder: none; the Refunds Portal's normal reporting speed stays TD-34, and its owner stays TD-17.

**Rule home:** [10 / Non-Functional Requirements, NFR-02](./10-nfrs.md#non-functional-requirements)

## Marker register

### Points expiry (03 / Overview)

**Resolution (2026-10-10):** The proposal "points do not expire in this release" is confirmed as written (grill-me decision D1; TD-06). The marker is removed, and 03 / Overview now reads "**Expiry:** Points do not expire in this release." Settled by Stand-in: Product Owner (full-autonomous run policy, set by Mahmoud, 2026-10-08), acting in the grill-me session of 2026-10-10, by taking the marker's proposal (placed by the OI-16 Recommended Answer, Q-16).

**Rule home:** [03 / Overview](./03-definitions-and-domain-concepts.md#overview)

### Refunds Portal integration row (08 / Integrations)

**Resolution (2026-10-10):** The proposed Refunds Portal row is confirmed as written (grill-me decision D2; TD-15): Business Purpose "Know which purchases are refunded, so the system takes their points back"; Information Exchanged "Refund reference, purchase reference, refunded amount, date the refund was paid" (the list from the OI-09 Recommended Answer, Q-09); Direction "We receive". The marker is removed and the row is added to Table 6. Settled by Stand-in: Product Owner (full-autonomous run policy, set by Mahmoud, 2026-10-08), acting in the grill-me session of 2026-10-10, by taking the marker's proposal. The proposal named no Criticality and no Provider / Owner. In the same update, OI-25 set the Criticality to High (worded "Critical" since Q-44) and OI-26 added the refund outcome to Information Exchanged (Q-25, Q-26). The Provider / Owner cell points to 02 / Dependencies, where the owner question stays open (TD-17).

**Rule home:** [08 / Integrations](./08-integrations.md#integrations)

### Partial refund take-back (06a / UC-02 BR-1)

**Resolution (2026-10-10):** Settled by business review PM-01. The review removed the marker "When only part of a purchase is refunded, how many points does the system take back?" (TD-03, which also held grill-me question N2) and applied UC-02 BR-1 (1 point for each 1 EUR of the refunded amount, rounded the same way as points are earned, within BR-6) and UC-02 AC-16. Checked against the files and closed in the request "update the todo: decisions from the business review of 2026-10-10". Record: [Business review register / PM-01](#pm-01---points-taken-back-for-a-partial-refund).

**Rule home:** [06a / UC-02 Business Rules & Constraints](./06a-use-cases-member.md#business-rules--constraints-1)

### POS Records owner (08 / Integrations)

**Resolution (2026-10-10):** Settled by business review DC-06. The review removed the marker "Who owns POS Records?" (TD-16) and named the Retail IT team in the Provider / Owner cell of the 08 POS Records row, taken from the Refunds Portal BRD. Checked against the files and closed in the request "update the todo: decisions from the business review of 2026-10-10". Record: [Business review register / DC-06](#dc-06---the-owner-of-pos-records).

**Rule home:** [08 / Integrations](./08-integrations.md#integrations)

## Business review register

### BO-01 - Refunds made outside the Refunds Portal

**Decision record, 2026-10-10:** The business review of 2026-10-10 (merged findings BO-01, SME-01, PA-03) found that points come back only for refunds the Refunds Portal reports, while the Refunds Portal does not handle cash refunds, returns at the till or online-shop refunds (Refunds Portal BRD 04 / Out of Scope). Decided: Option A, make the consequence explicit and ask the owner. UC-02 BR-7 now states that only refunds the Refunds Portal reports take points back, and that a refund made another way takes back no points in this release; the Glossary entry "Refund" points to it. It replaced nothing: UC-02 BR-1 already named the Refunds Portal as the only source. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); the policy itself is recorded only in the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: one question for this BRD's owner, a business choice: "Must refunds made outside the Refunds Portal (cash refunds at a branch, returns at the till, online-shop refunds) also take points back, and if so, which system reports them to Loyalty Points?" The session added it as a clarification marker in UC-02 BR-7.

**Rule home:** [06a / UC-02 Business Rules & Constraints](./06a-use-cases-member.md#business-rules--constraints-1)

### BO-02 - No cost or expected value

**Decision record, 2026-10-10:** The business review of 2026-10-10 found that neither BRD states a cost or an expected return. Decided: Option A, ask the owner in the BRD. A second clarification marker in 01 / Background asks what Loyalty Points is expected to cost to build and run and what value it is expected to return. It replaced nothing; the existing Background marker stays. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: one fact for this BRD's owner (cost and expected value), added as the marker.

**Rule home:** [01 / Background and Context / Problem Statement](./01-executive-summary-and-context.md#background-and-context--problem-statement)

### BO-06 - Legal confirmation before go-live

**Decision record, 2026-10-10:** The business review of 2026-10-10 found that the open question on the data-protection law (03 / Member leaves the loyalty program) gates nothing. Decided: Option A. 02 / Dependencies has a new Hard row "Legal confirmation", Status Pending, needed before go-live; the SDD Prod gate (§11.3) now includes it. It replaced nothing. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: one fact for this BRD's owner, who confirms the law, added as the marker in the row's Owner cell.

**Rule home:** [02 / Dependencies](./02-glossary-assumptions-facts.md#dependencies)

### PM-01 - Points taken back for a partial refund

**Decision record, 2026-10-10:** The business review of 2026-10-10 found that most paid refunds cover only part of a purchase (the Refunds Portal refunds single units and lets the branch manager lower item amounts), while UC-02 BR-1 left open how many points such a refund takes back (TD-03). Decided: Option A. UC-02 BR-1 now says the system takes back 1 point for each 1 EUR of the refunded amount, rounded the same way as points are earned, and never more than BR-6 allows; UC-02 AC-16, added at the end, tests a partial refund (50 EUR purchase, 20 EUR refunded, -20 points). It answers and replaces the BR-1 marker "When only part of a purchase is refunded, how many points does the system take back?" (TD-03, which also covers grill-me question N2). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: none new; the rounding rule stays open in 03 / Earning points (TD-02) and now also applies to take-backs.

**Rule home:** [06a / UC-02 Business Rules & Constraints](./06a-use-cases-member.md#business-rules--constraints-1)

### PM-02 - Going live on its own

**Decision record, 2026-10-10:** The business review of 2026-10-10 (merged findings PM-02, BO-04) found that one shared Prod gate made Loyalty Points wait for CardPay, a payment provider it never uses. Decided: Option A. 04 / Project Scope now says Loyalty Points can go live on its own date, with a marker asking when and whether all branches start at once. The SDD splits its Prod gate per product. It replaced nothing in this BRD. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: a business choice for this BRD's owner (go-live date or event, and rollout), added as the marker in 04.

**Rule home:** [04 / Project Scope](./04-scope-and-personas.md#project-scope)

### PM-06 - A use case for earning points

**Decision record, 2026-10-10:** The business review of 2026-10-10 found that earning points, the first In Scope item of 04, has no use case and no acceptance criteria, and that the SDD's open item OI-21 left the choice to this BRD's owner without any item here. Decided: Option A. Under the 05 Use Case Summary, a sentence says earning has no use case and points to 03 / Earning points, with a marker asking whether it should become a use case with its own acceptance criteria. It replaced nothing. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: a business choice for this BRD's owner, added as the marker in 05. If it becomes a use case, its matrix row, diagrams and the SDD's traceability follow through the owners.

**Rule home:** [05 / Use Case Summary](./05-user-journeys-overview.md#use-case-summary)

### PM-08 - Counting the baseline before go-live

**Decision record, 2026-10-10:** The business review of 2026-10-10 found that Business Objective 2 is measured by branch calls about points, which nobody counts, and that the count must start before go-live to allow a comparison. Decided: Option A. Objective 2 now says branch calls are counted before go-live, with a marker asking who counts them and from which date. It replaced nothing. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: a business choice for this BRD's owner (who counts, from when), added as the marker in 01. The team that counts upheld complaints for NFR-01 stays the existing 04 / Out of Scope marker (TD-08).

**Rule home:** [01 / Business Objectives](./01-executive-summary-and-context.md#business-objectives)

### PM-09 - When redeeming comes, and points earned before then

**Decision record, 2026-10-10:** The business review of 2026-10-10 (merged findings PM-09, BO-03) found that redeeming points is "a later phase" with no date, while points do not expire (decision D1), so the outstanding balance grows with no plan. Decided: Option A. A marker in 04 / Out of Scope asks when redeeming is planned and what members are told at launch; a marker in 03 / Overview (Expiry) asks how points earned before then are treated when redeeming or expiry arrives. D1 stands as decided. It replaced nothing. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: two business choices for this BRD's owner, added as the markers in 04 and 03.

**Rule home:** [04 / Out of Scope](./04-scope-and-personas.md#out-of-scope)

### PM-10 - Telling members when points are taken back

**Decision record, 2026-10-10:** The business review of 2026-10-10 found that a paid refund lowers a member's balance with no notice, and that the scope proposal to tell members (13 / Reviewer Notes) has no owner question. Decided: Option A. UC-02 BR-8, added at the end of the list, is a clarification marker asking whether the member is told when points are taken back. It replaced nothing. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: a business choice for this BRD's owner, added as the marker in UC-02 BR-8.

**Rule home:** [06a / UC-02 Business Rules & Constraints](./06a-use-cases-member.md#business-rules--constraints-1)

### PM-11 - A view for the people who answer points calls

**Decision record, 2026-10-10:** The business review of 2026-10-10 found that the people who answer member calls and complaints about points cannot see a member's points (NFR-05). Decided: Option A. A marker under 04 / Personas asks whether they get a read-only view, and notes that a yes changes NFR-05. It replaced nothing. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: a business choice for this BRD's owner, added as the marker in 04; the team itself stays the existing 04 / Out of Scope marker (TD-08).

**Rule home:** [04 / Personas / Actors](./04-scope-and-personas.md#personas--actors)

### PA-02 - How long to wait for the purchase of a paid refund

**Decision record, 2026-10-10:** The business review of 2026-10-10 found that UC-02 BR-5 waits for the purchase of a refund paid before it earned points with no time limit, while a refund of a purchase that is not a member's never gets its purchase (POS Records sends only member purchases, 08), so the wait never ends. Decided: Option A. UC-02 BR-5 now carries a marker asking how long the system waits before it treats the purchase as one that earns no points. It replaced nothing. Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: a business choice for this BRD's owner, added as the marker in UC-02 BR-5.

**Rule home:** [06a / UC-02 Business Rules & Constraints](./06a-use-cases-member.md#business-rules--constraints-1)

### DC-06 - The owner of POS Records

**Decision record, 2026-10-10:** The business review of 2026-10-10 (merged findings DC-06, BO-05) found that 08 asked who owns POS Records (TD-16) while the Refunds Portal BRD names the Retail IT team as owner of the same Point-of-Sale Records, and the SDD treats both as one partner. Decided: Option A. The Provider / Owner cell of the POS Records row in 08 is now "Retail IT team", taken from the Refunds Portal BRD (08), and the Refunds Portal BRD now names Loyalty Points as a receiver of refund outcomes. It answers and replaces the marker "Who owns POS Records?" (TD-16). The Refunds Portal dependency in 02 keeps its Status (decision D2) and its open owner marker (TD-17). Decided by Policy: full-autonomous run policy (set by Mahmoud, 2026-10-08); see the tracker: [review-comments-tracker.md](../review-comments-tracker.md). Open remainder: none new; whether the POS Records dependency is confirmed stays the existing 02 marker.

**Rule home:** [08 / Integrations](./08-integrations.md#integrations)

## Walkthrough and delegation history

**Delegation (answer policy), recorded once:** "answer policy: accept the recommended option. Continue at part checkpoints. Stand-ins: Product Owner, Mockup, Approver." Name: full-autonomous run policy. Set by Mahmoud on 2026-10-08. It answers a question only by taking its recommended option or stated default. It names the stand-ins Product Owner, Mockup and Approver, and the stop "part checkpoints". This run is a whole run, so no part checkpoint occurred.

**Walkthrough, 2026-10-10:** The 16 open items OI-02 to OI-17 were presented as one list. The answer policy decided all 16 by taking each Recommended Answer. No item was left Open, deferred or rejected. OI-18 and OI-19, raised by consistency check Run 2 (CF-01, CF-02), went through the same loop: the answer policy accepted both. The brand or key color was not asked (answer policy rule 3 and AGENTS.md); it stays a clarification marker in chunk 11.

**Grill-me session, 2026-10-10:** Run by Stand-in: Product Owner (full-autonomous run policy, set by Mahmoud, 2026-10-08), with the handoff prompt of 14-todo.md step 3. Record: `standins/loyalty/grill-me-session.md` of fixture run FC (outside this BRD folder). The stand-in confirmed that the session took place on 2026-10-10 and handed back two decisions, both taken from the BRD's own `proposed` markers: D1 (TD-06, points expiry) and D2 (TD-15, the Refunds Portal row). It left the other TD rows open for the product owner (TD-13 held because its proposal depends on the open TD-21) and raised twelve new questions, N1 to N12.

**Walkthrough, 2026-10-10 (grill-me follow-up):** The new questions were routed by delivery-chunks.md § Step 3 and § Special cases. Business choices became open items: N1 (OI-20), N3 (OI-21), N5 (OI-22), N8 (OI-23), N10 (OI-24), N11 (OI-25), N12 (OI-26). Missing facts became to-do rows only: N4 (TD-34), N6 (TD-36). N9 became a to-do row (TD-38) that waits on TD-05: its choice exists only if members have points from an earlier program, and Q-03 already reopens OI-03 for that case. N2 is the acceptance criterion of the open partial-refund rule, so it joined TD-03 instead of a new row. N7 is an optional scope proposal and stays in 13 / Reviewer Notes. OI-20 to OI-26 were presented in two batches (OI-20 to OI-23, then OI-24 to OI-26). The answer policy accepted every Recommended Answer. No item was left Open, deferred or rejected.

**Walkthrough, 2026-10-10 (consistency check Run 5):** OI-27 to OI-30, raised by CF-08, CF-09, CF-11 and CF-12, were presented in one batch. The answer policy accepted every Recommended Answer. No item was left Open, deferred or rejected.

**Walkthrough, 2026-10-10 (consistency check Run 6):** OI-31 and OI-32, raised by CF-17 and CF-18, were presented in one batch. The answer policy accepted both Recommended Answers.

**Walkthrough, 2026-10-10 (consistency check Run 7, the third run):** OI-33 and OI-34, raised by CF-22 and CF-23, were presented in one batch. The answer policy accepted both Recommended Answers. They are third-run discoveries, so they are `Decided - pending application` (TD-48, TD-49) and their decision records are written here when the next request applies them. The mechanical correction CF-27 waits the same way (TD-50).

**Walkthrough, 2026-10-10 (business review hand-off):** The open remainders of the business review of 2026-10-10 were routed by SKILL.md step 10 and delivery-chunks.md § Step 1. Business choices became open items OI-35 to OI-43 (BO-01, PM-02, PM-06, PM-08, PM-09 twice, PM-10, PM-11, PA-02). Missing facts became to-do rows only: the cost and the expected value (BO-02; TD-52, TD-53), who confirms the data-protection law (BO-06; TD-54), and when redeeming is planned (PM-09; TD-59). The nine items were presented in three batches: OI-35 to OI-38, OI-39 to OI-42, and OI-43. The answer policy accepted every Recommended Answer; none supplied a fact, adopted a new dependency or set a rule a source rules out. No item was left Open, deferred or rejected. The brand or key color was not asked (AGENTS.md; answer policy rule 3).

**Walkthrough, 2026-10-10 (consistency check Run 11):** OI-44 to OI-46, raised by CF-34, CF-35 and CF-36, were presented in one batch. The answer policy accepted all three Recommended Answers.

**Walkthrough, 2026-10-10 (consistency check Run 12):** OI-47, raised by CF-41, was presented alone. The answer policy accepted its Recommended Answer.

**Walkthrough, 2026-10-10 (consistency check Run 13, the third run):** OI-48, raised by CF-47, was presented alone. The answer policy accepted its Recommended Answer. It is a third-run discovery, so it is `Decided - pending application` (TD-69), and its decision record is written here when the next request applies it. The correction CF-48 waits the same way (TD-70).

**Walkthrough, 2026-10-10 (consistency check Run 14):** OI-49, raised by CF-53, was presented alone. The answer policy accepted its Recommended Answer. Run 14 was the first run of its request, so the decision was applied in the same request. The brand or key color was not asked (AGENTS.md; answer policy rule 3).

**Walkthrough, 2026-10-10 (consistency check Run 15):** OI-50, raised by CF-55, was presented alone. The answer policy accepted its Recommended Answer, which supersedes the Q-49 cut-off. Run 15 was the second run of its request, so the decision was applied in the same request.

**Walkthrough, 2026-10-10 (consistency check Run 16, the third run):** OI-51, raised by CF-56, was presented alone. The answer policy accepted its Recommended Answer. It is a third-run discovery, so it is `Decided - pending application` (TD-73), and its decision record is written here when the next request applies it.

### Action entries

**Migration to the current template, 2026-10-10:** The source BRD v1.0 (older template, approved 2026-09-24) was moved into the current template as v1.1. A read-only snapshot of the source is in [source-snapshot-v1.0/](./source-snapshot-v1.0/loyalty-points-brd-master.md). Chunks 00-13, this register, the master index and 14-todo.md were written. The cleared-context review ran because the source chunk 13 had no coverage record (first-substantive-migration review). Its 16 items were decided by the answer policy and applied.

**Grill-me hand-back applied (v1.2), 2026-10-10:** Request "update the todo: the grill-me session is done". No item was `Decided - pending application`, so nothing waited from an earlier request. D1 and D2 were applied (Marker register), and OI-20 to OI-26 were raised, decided by the answer policy and applied. Consistency check Run 5 raised OI-27 to OI-30 and Run 6 raised OI-31 and OI-32; the answer policy decided all six, and the mechanical corrections of both runs were applied. Run 7 rechecked them and found CF-22 to CF-28. CF-24, CF-25, CF-26 and CF-28 changed only chunk 14 or this register and were applied. CF-22, CF-23 (as OI-33, OI-34) and CF-27 touch chunks 00-13 and wait for the next request (TD-48 to TD-50). Changed: 02, 03, 06a, 08, 10, 13, this register, 00, the master index and 14-todo.md. The consistency check reruns and the gate state are recorded in 14-todo.md.

**Pending decisions applied (v1.3), 2026-10-10:** Request "Apply the decisions waiting for application in the Loyalty Points BRD (TD-48, TD-49, TD-50)". TD-48 (OI-33) and TD-49 (OI-34) were applied to 06a / UC-01 AC-8 and UC-02 A1, and their decision records Q-33 and Q-34 were written. TD-50 (CF-27) was applied to the v1.2 row of the 00 Changes Log. No item in chunk 13 was Open, so the acceptance loop had nothing to present. The answer policy answered no question in this request, and the brand or key color was not asked (AGENTS.md; answer policy rule 3). Consistency check Run 8 (full) rechecked the three items and found CF-29 to CF-31; all three were mechanical or carried an applied decision, and were corrected. Run 9 (scoped) rechecked them and found CF-32 and CF-33 (chunk 14 only), which were corrected and listed in the v1.3 Changes Log row. Run 10 (scoped, the third run) rechecked that row and chunk 14. Changed: 06a, 13, this register, 00, the master index and 14-todo.md.

**Business review hand-off taken (v1.5), 2026-10-10:** Request "update the todo: decisions from the business review of 2026-10-10" (tracker: [review-comments-tracker.md](../review-comments-tracker.md)). This entry records that the hand-off of that review to this BRD was taken. No earlier record had taken it, and no item was `Decided - pending application`. The twelve points the review applied in v1.4 (BO-01, BO-02, BO-06, PM-01, PM-02, PM-06, PM-08, PM-09, PM-10, PM-11, PA-02, DC-06) were checked against the files, not applied again. PM-01 and DC-06 had removed two markers: TD-03 and TD-16 are resolved with Marker register entries. No open item was answered, so no Resolution Log row names a review point. The review's open remainders gave OI-35 to OI-43 (business choices) and TD-52 to TD-54 and TD-59 (facts). The answer policy decided the nine items, and they were applied (v1.5). Consistency check Run 11 (full) raised OI-44 to OI-46 and CF-37 to CF-40, and Run 12 (scoped) raised OI-47 and CF-42 to CF-46. The answer policy decided the four items, and they and the corrections were applied; CF-46 was deferred to TD-17. Run 13 (scoped, the third run) raised OI-48 (CF-47) and correction CF-48: both wait for the next request as `Decided - pending application` (TD-69, TD-70). CF-49 and CF-50 changed only chunk 14 and this register, and were applied. The brand or key color was not asked (AGENTS.md; answer policy rule 3). Changed: 01, 02, 03, 04, 05, 06a, 08, 10, 12, 13, this register, 00, the master index and 14-todo.md. The gate stays shut.

**Pending decisions applied (v1.6), 2026-10-10:** Request "Apply the decisions waiting for application in the Loyalty Points BRD (TD-69, TD-70)". TD-69 (OI-48) was applied to 06a / UC-02 BR-7, and its decision record Q-48 was written. TD-70 (CF-48) was applied to 03 / Overview; it is a correction that carries Q-07 and Q-43, so it has no record here. No item in chunk 13 was Open when the request started. Consistency check Run 14 (full) rechecked both and found CF-51 to CF-53: CF-51 and CF-52 carried applied decisions and were corrected; CF-53 became OI-49, which the answer policy decided and which was applied (UC-02 AC-18). Run 15 (scoped) found CF-54 and CF-55: CF-54 was corrected; CF-55 became OI-50, which the answer policy decided and which was applied (the cut-off is the day; UC-02 BR-7, AC-18, AC-19, 02 Notes), superseding Q-49 on that point. Run 16 (scoped, the third run) found CF-56 and CF-57: CF-56 became OI-51, decided by the answer policy and waiting for the next request as `Decided - pending application` (TD-73); CF-57 changed only chunk 14 and was corrected. The brand or key color was not asked (AGENTS.md; answer policy rule 3). No sign-off was asked for, so the Approver stand-in signed nothing. Changed: 01, 02, 03, 04, 06a, 13, this register, 00, the master index and 14-todo.md. The gate stays shut.

**Pending decision applied (v1.7), 2026-10-10:** Request "Apply the decisions waiting for application in the Loyalty Points BRD (TD-73)". TD-73 (OI-51) was applied to 10 / NFR-02, and its decision record Q-51 and the forward note in Q-50 were written. No item in chunk 13 was Open when the request started, and none was raised, so the acceptance loop had nothing to present and the answer policy answered no question in this request. Consistency check Run 17 (full) rechecked the item and found CF-58 and CF-59: CF-58 carried the applied decisions Q-43 and Q-51 and was corrected (10 / NFR-02); CF-59 changed only chunk 14. Run 18 (scoped) found CF-60 and CF-61, which changed only chunk 14 and this register, and were corrected. Run 19 (scoped, the third run) found nothing, so nothing waits for application. The brand or key color was not asked (AGENTS.md; answer policy rule 3). No sign-off was asked for, so the Approver stand-in signed nothing. Changed: 10, 13, this register, 00, the master index and 14-todo.md. The gate stays shut (G1, G4, G5).

<!-- MASTER: loyalty-points-brd-master.md | COMPANION FILE: decision history; not part of the numbered chunk sequence -->

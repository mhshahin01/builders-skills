<!--
CHUNK: 13
TITLE: Open Items & Clarifications
PROJECT: Loyalty Points
VERSION: 1.7
DEPENDS_ON: all preceding chunks (00 through 12)
PART OF: BRD - Loyalty Points
PURPOSE: Output of the post-generation adversarial review. Captures gaps, missing scenarios, corner cases, and ambiguities flagged by a fresh-context reviewer. Every unapplied item carries a concrete Recommended Answer and Why, ready to be applied to the BRD body once the user accepts it. Applied items keep their stable OI heading, Status and Resolution Log pointer; their decision narrative lives in `decision-log.md`.
GENERATED_BY: brd-unifier post-generation reviewer (cleared-context subagent run after the main BRD body is complete).
WORKFLOW: After this chunk is written, the skill walks the user through each open item and asks them to accept, adjust, defer, or reject the Recommended Answer; an answer policy the user set for the run accepts recommended answers in the user's place (SKILL.md step 8, Answer policy). Accepted answers are applied to the referenced chunk(s) as plain requirement text, the item gets a Resolution Log row, and it is added to this update's Changes Log row (delivery-chunks.md § Refresh triggers, Version). Deferred and rejected items get a Resolution Log row too.
REGISTER: An applied item keeps its `### OI-NN: [title]` heading, current Status and a link to the Resolution Log. The full question, options, chosen answer and Why live in `decision-log.md`. Open, Deferred, Decided - pending application and Rejected items keep their full blocks.
LATER ITEMS: The consistency check (14-todo.md step 2), the writing of chunks 15-17, a Reviewer Note whose choice is needed to finalise the BRD (SKILL.md step 7, Editorial ownership), a live remainder in a decision or marker record that needs a business choice (a business review point included), and a grill-me question the session leaves open that needs a business choice can add open items after the first review; a missing fact stays a to-do (TD) item only. They use the same schema, say where they came from in their Where field, e.g. "(raised by consistency check CF-03)" or "(raised by the grill-me session of <date>, <question id>)", and go through the same acceptance loop before anything is applied.
DELIVERY GATE: Chunks 15, 16, and 17 stay locked while any item here is Open, Deferred, or Decided - pending application. Closed means Accepted - applied, Adjusted - applied, or Rejected. A status outside the Status legend below counts as `Open`: the gate treats the item as not closed, and the next acceptance loop presents it.
-->

# Open Items & Clarifications

> **What this section is.** A structured backlog of concerns identified after the main BRD was authored, by a reviewer running with cleared context (so the review is independent rather than confirmatory). Every unapplied item carries a concrete Recommended Answer and Why. Items are decisions awaiting your acceptance: accept the recommendation (or adjust it), and it gets reflected into the BRD body. An applied item keeps its `### OI-NN: [title]` heading, current Status and a link to the Resolution Log. The full question, options, chosen answer and Why live in `decision-log.md`. Open, Deferred, Decided - pending application and Rejected items keep their full blocks.
>
> **What this section is not.** It is not a list of `[NEEDS CLARIFICATION: ...]` markers found inside the body - those remain inline. This section is the reviewer's *external* findings: gaps the body did not mark, scenarios the body did not consider, corner cases the body did not test for.

---

## How to read each item

| Field | Meaning |
|-------|---------|
| **ID** | OI-NN. Stable across revisions. |
| **Where** | Section, UC ID, or "global" if cross-cutting. |
| **Type** | Gap / Missing scenario / Corner case / Ambiguity / Risk / Inconsistency / Duplication (content restated instead of referenced - within the BRD or from source docs). |
| **Concern** | One paragraph. What was missed and why it matters. |
| **Options** | Concrete choices, each with a one-line tradeoff. At least 2 options per item where a choice exists. |
| **Recommended Answer** | The reviewer's concrete proposed resolution, written as ready-to-apply BRD content (the exact rule, step, row, or wording that would close the item). This is what gets injected into the body when you accept. A clarification marker it inserts asks one distinct question that can be answered on its own (SKILL.md principle 8). |
| **Why** | REQUIRED. One or two lines: the reason the recommended option wins over the alternatives: the evidence behind it (source section, stated business expectation, domain practice, risk avoided) and the tradeoff being accepted. Never empty, never "best option". |
| **Status** | Open (awaiting your decision) / Decided - pending application (decided on a third-run discovery; the next request applies it) / Accepted - applied (with pointer) / Adjusted - applied / Deferred (with rationale) / Rejected. A status outside this legend counts as `Open`: the gate treats the item as not closed, and the next acceptance loop presents it. |

---

## Open Items

### OI-01: Points taken back when a purchase is refunded

- **Status:** Accepted - applied (source BRD v1.0, 2026-09-24)
- **Resolution:** [Resolution Log](#resolution-log)
- **Historical record:** Carried over from the source BRD v1.0, which kept only a Resolution Log row for this item. The source did not record its Where, Type, Concern, Options, or Why; they are not reconstructed here.

---

### OI-02: Earning points is not listed as in scope

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-02](./decision-log.md#q-02---earning-points-is-not-listed-as-in-scope)

---

### OI-03: Purchases and points from before the start date

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-03](./decision-log.md#q-03---purchases-and-points-from-before-the-start-date)

---

### OI-04: Business Objectives have no measure

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-04](./decision-log.md#q-04---business-objectives-have-no-measure)

---

### OI-05: Points cannot be shown

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-05](./decision-log.md#q-05---points-cannot-be-shown)

---

### OI-06: Which refund outcome takes points back

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-06](./decision-log.md#q-06---which-refund-outcome-takes-points-back)

---

### OI-07: Refund paid before its purchase has earned points, or for a purchase that earned none

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-07](./decision-log.md#q-07---refund-paid-before-its-purchase-has-earned-points-or-for-a-purchase-that-earned-none)

---

### OI-08: Recent purchase or refund not shown yet

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-08](./decision-log.md#q-08---recent-purchase-or-refund-not-shown-yet)

---

### OI-09: Movement date and purchase details are not defined or received

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-09](./decision-log.md#q-09---movement-date-and-purchase-details-are-not-defined-or-received)

---

### OI-10: POS Records is missing from the Dependencies table

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-10](./decision-log.md#q-10---pos-records-is-missing-from-the-dependencies-table)

---

### OI-11: No time limit for earned points to show

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-11](./decision-log.md#q-11---no-time-limit-for-earned-points-to-show)

---

### OI-12: No availability expectation for "at any time"

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-12](./decision-log.md#q-12---no-availability-expectation-for-at-any-time)

---

### OI-13: NFR-01 counts upheld complaints, but nobody handles complaints or corrects points

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-13](./decision-log.md#q-13---nfr-01-counts-upheld-complaints-but-nobody-handles-complaints-or-corrects-points)

---

### OI-14: No security and privacy expectation

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-14](./decision-log.md#q-14---no-security-and-privacy-expectation)

---

### OI-15: A member leaves the loyalty program

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-15](./decision-log.md#q-15---a-member-leaves-the-loyalty-program)

---

### OI-16: Points expiry is not stated

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-16](./decision-log.md#q-16---points-expiry-is-not-stated)

---

### OI-17: How long points history and purchase details are kept

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-17](./decision-log.md#q-17---how-long-points-history-and-purchase-details-are-kept)

---

### OI-18: Stated UC behaviours with no acceptance criterion

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-18](./decision-log.md#q-18---stated-uc-behaviours-with-no-acceptance-criterion)

---

### OI-19: A1 condition for a zero balance

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-19](./decision-log.md#q-19---a1-condition-for-a-zero-balance)

---

### OI-20: Zero balance after take-backs has no acceptance criterion

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-20](./decision-log.md#q-20---zero-balance-after-take-backs-has-no-acceptance-criterion)

---

### OI-21: NFR-01 expectation is vague

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-21](./decision-log.md#q-21---nfr-01-expectation-is-vague)

---

### OI-22: What a person who has left the program can open

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-22](./decision-log.md#q-22---what-a-person-who-has-left-the-program-can-open)

---

### OI-23: Points taken back for one purchase can exceed the points it earned

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-23](./decision-log.md#q-23---points-taken-back-for-one-purchase-can-exceed-the-points-it-earned)

---

### OI-24: Purchase that reaches Loyalty Points after the member left

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-24](./decision-log.md#q-24---purchase-that-reaches-loyalty-points-after-the-member-left)

---

### OI-25: Criticality of the Refunds Portal integration

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-25](./decision-log.md#q-25---criticality-of-the-refunds-portal-integration)

---

### OI-26: Refunds Portal row does not carry the refund outcome

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-26](./decision-log.md#q-26---refunds-portal-row-does-not-carry-the-refund-outcome)

---

### OI-27: Which date the balance screen shows as the last movement

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-27](./decision-log.md#q-27---which-date-the-balance-screen-shows-as-the-last-movement)

---

### OI-28: Refund is defined as money paid but can be rejected

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-28](./decision-log.md#q-28---refund-is-defined-as-money-paid-but-can-be-rejected)

---

### OI-29: Leaving the program is not in the use cases

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-29](./decision-log.md#q-29---leaving-the-program-is-not-in-the-use-cases)

---

### OI-30: History dates and note have no acceptance criterion

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-30](./decision-log.md#q-30---history-dates-and-note-have-no-acceptance-criterion)

---

### OI-31: Refunded still reads as paid in the use cases

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-31](./decision-log.md#q-31---refunded-still-reads-as-paid-in-the-use-cases)

---

### OI-32: The date of the last movement has no acceptance criterion

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-32](./decision-log.md#q-32---the-date-of-the-last-movement-has-no-acceptance-criterion)

---

### OI-33: UC-01 AC-8 does not pin the date rule

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-33](./decision-log.md#q-33---uc-01-ac-8-does-not-pin-the-date-rule)

---

### OI-34: UC-02 A1 can read as the purchase row changing

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-34](./decision-log.md#q-34---uc-02-a1-can-read-as-the-purchase-row-changing)

---

### OI-35: Refunds made outside the Refunds Portal

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-35](./decision-log.md#q-35---refunds-made-outside-the-refunds-portal)

---

### OI-36: When and where Loyalty Points goes live

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-36](./decision-log.md#q-36---when-and-where-loyalty-points-goes-live)

---

### OI-37: Whether earning points becomes a use case

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-37](./decision-log.md#q-37---whether-earning-points-becomes-a-use-case)

---

### OI-38: Who counts branch calls, and from when

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-38](./decision-log.md#q-38---who-counts-branch-calls-and-from-when)

---

### OI-39: What members are told at launch about using points

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-39](./decision-log.md#q-39---what-members-are-told-at-launch-about-using-points)

---

### OI-40: Points earned before redeeming or expiry

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-40](./decision-log.md#q-40---points-earned-before-redeeming-or-expiry)

---

### OI-41: Telling members when points are taken back

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-41](./decision-log.md#q-41---telling-members-when-points-are-taken-back)

---

### OI-42: A view for the people who answer points calls

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-42](./decision-log.md#q-42---a-view-for-the-people-who-answer-points-calls)

---

### OI-43: How long to wait for the purchase of a paid refund

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-43](./decision-log.md#q-43---how-long-to-wait-for-the-purchase-of-a-paid-refund)

---

### OI-44: Criticality values outside the template scale

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-44](./decision-log.md#q-44---criticality-values-outside-the-template-scale)

---

### OI-45: Refunds Portal milestone against going live on its own

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-45](./decision-log.md#q-45---refunds-portal-milestone-against-going-live-on-its-own)

---

### OI-46: Online-shop refunds in UC-02 BR-7

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-46](./decision-log.md#q-46---online-shop-refunds-in-uc-02-br-7)

---

### OI-47: Refunds Portal milestone has no consistent answer

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-47](./decision-log.md#q-47---refunds-portal-milestone-has-no-consistent-answer)

---

### OI-48: Refunds paid before the Refunds Portal starts reporting

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-48](./decision-log.md#q-48---refunds-paid-before-the-refunds-portal-starts-reporting)

---

### OI-49: No acceptance criterion for refunds paid before reporting starts

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-49](./decision-log.md#q-49---no-acceptance-criterion-for-refunds-paid-before-reporting-starts)

---

### OI-50: The reporting cut-off cannot be applied with the date alone

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-50](./decision-log.md#q-50---the-reporting-cut-off-cannot-be-applied-with-the-date-alone)

---

### OI-51: NFR-02 for refunds paid on the start day before reporting began

- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log); decision record [Q-51](./decision-log.md#q-51---nfr-02-for-refunds-paid-on-the-start-day-before-reporting-began)

---

## Resolution Log

| ID | Resolution Date | Resolved In | Outcome |
|----|----------------|-------------|---------|
| OI-01 | 2026-09-24 | [06a / UC-02 BR-1](./06a-use-cases-member.md#business-rules--constraints-1) | Accepted - applied: points are taken back when the purchase is refunded. (Carried over from source BRD v1.0.) |
| OI-02 | 2026-10-10 | 04 / In Scope; 01 / Executive Summary | Accepted recommendation |
| OI-03 | 2026-10-10 | 03 / Start of points | Accepted recommendation |
| OI-04 | 2026-10-10 | 01 / Business Objectives | Accepted recommendation |
| OI-05 | 2026-10-10 | 06a / UC-01 E1, UC-01 AC-3; UC-02 E1, UC-02 AC-6 | Accepted recommendation |
| OI-06 | 2026-10-10 | 06a / UC-02 BR-1, BR-3, AC-4, AC-5 | Accepted recommendation |
| OI-07 | 2026-10-10 | 06a / UC-02 BR-4, BR-5; 10 / NFR-02 | Accepted recommendation |
| OI-08 | 2026-10-10 | 06a / UC-01 step 2, BR-2, AC-4; UC-02 step 2 | Accepted recommendation |
| OI-09 | 2026-10-10 | 06a / UC-02 steps 2 and 4; 08 / POS Records row and Refunds Portal proposal | Accepted recommendation |
| OI-10 | 2026-10-10 | 02 / Dependencies (POS Records row) | Accepted recommendation |
| OI-11 | 2026-10-10 | 10 / NFR-03; 03 / Earning points | Accepted recommendation |
| OI-12 | 2026-10-10 | 10 / NFR-04 | Accepted recommendation |
| OI-13 | 2026-10-10 | 04 / Out of Scope; 03 / Overview; 10 / NFR-01 | Accepted recommendation |
| OI-14 | 2026-10-10 | 10 / NFR-05 | Accepted recommendation |
| OI-15 | 2026-10-10 | 03 / Member leaves the loyalty program | Accepted recommendation |
| OI-16 | 2026-10-10 | 03 / Overview (Expiry) | Accepted recommendation |
| OI-17 | 2026-10-10 | 03 / Keeping points history; 06a / UC-02 A2, AC-7 | Accepted recommendation |
| OI-18 | 2026-10-10 | 06a / UC-01 AC-5; UC-02 AC-8, AC-9, AC-10, AC-11 | Accepted recommendation |
| OI-19 | 2026-10-10 | 06a / UC-01 A1 | Accepted recommendation |
| OI-20 | 2026-10-10 | 06a / UC-01 AC-6 | Accepted recommendation |
| OI-21 | 2026-10-10 | 10 / NFR-01 | Accepted recommendation |
| OI-22 | 2026-10-10 | 03 / Member leaves the loyalty program | Accepted recommendation |
| OI-23 | 2026-10-10 | 06a / UC-02 BR-6, AC-12 | Accepted recommendation |
| OI-24 | 2026-10-10 | 03 / Earning points; 03 / Member leaves the loyalty program | Accepted recommendation |
| OI-25 | 2026-10-10 | 08 / Integrations (Refunds Portal row, Criticality) | Accepted recommendation |
| OI-26 | 2026-10-10 | 08 / Integrations (Refunds Portal row, Information Exchanged) | Accepted recommendation |
| OI-27 | 2026-10-10 | 06a / UC-01 BR-3 | Accepted recommendation |
| OI-28 | 2026-10-10 | 02 / Glossary (Refund) | Accepted recommendation |
| OI-29 | 2026-10-10 | 06a / UC-01 and UC-02 Preconditions; UC-01 AC-7; UC-02 AC-13 | Accepted recommendation |
| OI-30 | 2026-10-10 | 06a / UC-02 AC-14, AC-15 | Accepted recommendation |
| OI-31 | 2026-10-10 | 03 / Overview (Taken back); 06a / UC-01 step 2, AC-4; UC-02 step 2, A1, AC-1, AC-15 | Accepted recommendation |
| OI-32 | 2026-10-10 | 06a / UC-01 AC-8 | Accepted recommendation |
| OI-33 | 2026-10-10 | 06a / UC-01 AC-8 | Accepted recommendation |
| OI-34 | 2026-10-10 | 06a / UC-02 A1 | Accepted recommendation |
| OI-35 | 2026-10-10 | 06a / UC-02 BR-7; 12 / Wishlist item 2 | Accepted recommendation |
| OI-36 | 2026-10-10 | 04 / Project Scope | Accepted recommendation |
| OI-37 | 2026-10-10 | 05 / Use Case Summary | Accepted recommendation |
| OI-38 | 2026-10-10 | 01 / Business Objective 2 | Accepted recommendation |
| OI-39 | 2026-10-10 | 06a / UC-01 step 2, UC-01 AC-9; 04 / Out of Scope | Accepted recommendation |
| OI-40 | 2026-10-10 | 03 / Overview (Expiry) | Accepted recommendation |
| OI-41 | 2026-10-10 | 06a / UC-02 BR-8, UC-02 Future Enhancements | Accepted recommendation |
| OI-42 | 2026-10-10 | 04 / Personas / Actors; 12 / Wishlist item 3 | Accepted recommendation |
| OI-43 | 2026-10-10 | 06a / UC-02 BR-5, UC-02 AC-11, UC-02 AC-17 | Accepted recommendation |
| OI-44 | 2026-10-10 | 08 / Integrations (Criticality, both rows) | Accepted recommendation |
| OI-45 | 2026-10-10 | 02 / Dependencies (Refunds Portal row, Needed before) | Accepted recommendation |
| OI-46 | 2026-10-10 | 06a / UC-02 BR-7; 12 / Wishlist item 2 | Accepted recommendation |
| OI-47 | 2026-10-10 | 02 / Dependencies (Refunds Portal row, Needed before and Notes) | Accepted recommendation |
| OI-48 | 2026-10-10 | 06a / UC-02 BR-7 | Accepted recommendation |
| OI-49 | 2026-10-10 | 06a / UC-02 AC-18 | Accepted recommendation |
| OI-50 | 2026-10-10 | 06a / UC-02 BR-7, AC-18, AC-19; 02 / Dependencies (Refunds Portal row, Notes) | Accepted recommendation |
| OI-51 | 2026-10-10 | 10 / NFR-02 (Business Measure) | Accepted recommendation |

---

## Reviewer Notes

| Risk area | Checked | Findings | Notes |
|-----------|---------|----------|-------|
| Scope | Every In Scope and Out of Scope item against 01, 03, 08 and the use cases; the start of the program; the Business Objectives against their measures | 3 (OI-02, OI-03, OI-04) | "Redeeming points (a later phase)" stays Out of Scope as the source says; not raised. |
| Use-case exception coverage | Main, alternate and exception flows of UC-01 and UC-02; the take-back rule (UC-02 BR-1) against NFR-02, Assumption 1 and the Glossary | 3 (OI-05, OI-06, OI-07) | The partial-refund and rounding questions are already inline markers; not repeated. |
| Matrix consistency | Every UC in 05 is a row in 07; every persona in 04 is a column; each Yes matches the Primary Actor; the footnote matches the Access Level and both business rules; no external party is a column | No issue found | Both use cases list Supporting Actors as None. This holds: neither POS Records nor the Refunds Portal acts during the member's flow. |
| NFRs | NFR-01 and NFR-02 against the objectives and the use cases; missing qualities (timeliness of earned points, availability, security and privacy) | 3 (OI-11, OI-12, OI-13) | Performance (how fast a screen opens) has no source evidence, so it is not raised. |
| Integrations | Both business systems (POS Records, Refunds Portal) as the member experiences them: delay, missing data, what each sends against what the screens show; 08 against the 02 Dependencies table | 3 (OI-08, OI-09, OI-10) | At review time the Refunds Portal row missing from 08 was an inline proposal marker, so it was not repeated; grill-me decision D2 later confirmed the row ([decision-log / Marker register](./decision-log.md#refunds-portal-integration-row-08--integrations)). Service failure as seen by the member is OI-05. |
| Security / privacy | Own-points-only rule across 04, 06a, 07 and 10; what purchase detail a member sees; members who leave; data-protection hooks | 2 (OI-14, OI-15) | The sign-in question is already an inline marker in UC-01; not repeated. |
| Data lifecycle | Points from before the start date, points expiry, how long movements and purchase details are kept, members who leave | 2 (OI-16, OI-17) | The start date and members who leave are raised under Scope (OI-03) and Security / privacy (OI-15). |

- **Prior coverage comparison:** The source v1.0 chunk 13 (in [source-snapshot-v1.0](./source-snapshot-v1.0/13-open-items-and-clarifications.md)) had no coverage record, so prior review evidence covered none of the seven risk areas. This review is the first-substantive-migration review.
- **Scope proposal - staff correct a member's points:** Source evidence: NFR-01 measures upheld balance complaints ([10](./10-nfrs.md#non-functional-requirements)), and Objective 2 says members call branches about points today ([01](./01-executive-summary-and-context.md#business-objectives)); no persona can fix a wrong balance. Recommendation: do not add it now; add to [12 / Wishlist](./12-appendix-and-wishlist.md#wishlist): "Staff correct a member's points after an upheld complaint, with the reason shown in the member's history." If the product owner adopts it, it needs a new persona journey, a full use case, a "Correction" movement kind in 03, a new matrix column and source references. Tradeoff: adding it now gives a real fix path for OI-13 but grows the approved v1.0 scope by a persona and a use case.
- **Scope proposal - tell members when points are taken back:** Source evidence: Objective 1 (trust) and UC-02 A1; today a member finds a take-back only by opening the history. Recommendation: add to UC-02 / Future Enhancements: "Tell the member when points are taken back after a refund." Tradeoff: members are not surprised by a lower balance, but it needs a way to send messages that the BRD does not name. A new messaging provider would need the product owner's approval before any design adopts it (AGENTS.md). The grill-me session of 2026-10-10 asked about it again (N7). The business review of 2026-10-10 (PM-10) then raised it as OI-41: it is now a UC-02 Future Enhancement, and no message is sent in this release (UC-02 BR-8).
- **Proposal - accessibility (global default, not a project source):** The reviewer's user-level defaults ask for WCAG 2.1 AA, keyboard use and visible focus. No project source states an accessibility level. The product owner may choose to add a Usability / Accessibility row to 10 or a line to 11 / UI/UX Expectations. Not raised as an open item.
- **Multi-tenancy:** Not relevant. No source names more than one business, brand or tenant. The reviewer's user-level multi-tenancy defaults are not a project source and were not applied.
- **Naming:** AGENTS.md is titled "Refunds Platform", while the BRD names the "Refunds Portal". If these are the same system, the open owner question in 02 Dependencies may already have an answer. No open item raised.
- **Primary color:** Stays an open question for the product owner, as AGENTS.md says. Not raised again.
- **Technical language:** None found in the business text. Screen IDs and Figma links are design references.
- **Duplication:** "Members see their points balance and the history of their points movements online" appears in both 01 and 04 / Project Scope, and 11 / Summary restates it. The template gives each of these sections a summary role, so no open item is raised. "Own points only" lives in 04, the two use-case rules and the 07 footnote; the footnote links to the rules, which is correct.
- **Order of application:** OI-11, OI-12 and OI-14 each add an NFR row; give them the next free IDs in the order they are accepted. OI-08 refers to the earned-points time from OI-11. OI-05 adds E1 to both use cases and OI-17 adds A2 to UC-02.
- **Editorial - 02 Glossary, Points:** "Credit a member earns on branch purchases" can read as money. Simpler: "The reward a member earns on branch purchases."
- **Editorial - 01 Executive Summary:** "Loyalty Points is the points service of the loyalty program" is vague. Simpler: "Loyalty Points keeps each member's points and shows them to the member online."
- **Editorial - 10 NFR-01:** "The points balance is always right" is vague. More precise: "The points balance always equals the sum of the member's points movements." Raised as OI-21 (grill-me session of 2026-10-10, N3).
- **Editorial - 00 Changes Log, v1.0 row:** "(the source kept two columns)" is process wording in the body. Simpler: "Reviewed By: Operations Lead; Approved By: Head of Retail".

<!-- MASTER: loyalty-points-brd-master.md | PREV: 12-appendix-and-wishlist.md | NEXT: 14-todo.md -->

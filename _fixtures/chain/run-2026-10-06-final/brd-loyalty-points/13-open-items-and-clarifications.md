<!--
CHUNK: 13
TITLE: Open Items & Clarifications
PROJECT: Loyalty Points
VERSION: 1.5
DEPENDS_ON: all preceding chunks (00 through 12)
PART OF: BRD - Loyalty Points
PURPOSE: Output of the post-generation adversarial review. Captures gaps, missing scenarios, corner cases, and ambiguities flagged by a fresh-context reviewer. Every item carries a concrete Recommended Answer, ready to be applied to the BRD body once the user accepts it.
GENERATED_BY: brd-unifier post-generation reviewer (cleared-context subagent run after the main BRD body is complete).
WORKFLOW: After this chunk is written, the skill walks the user through each open item and asks them to accept, adjust, or defer the Recommended Answer. Accepted answers are applied to the referenced chunk(s) as plain requirement text, the item gets a Resolution Log row, and it is added to this update's Changes Log row (delivery-chunks.md § Refresh triggers, Version). Deferred and rejected items get a Resolution Log row too.
REGISTER: When an item is accepted and applied, the decision narrative (the question, options, choice, date, rationale) is recorded in `decision-log.md`, the companion register, with a `Rule home:` link to the section now carrying the settled rule. This chunk keeps only the item's current status line and the Resolution Log row; no decision storytelling here or in the body chunks.
LATER ITEMS: The consistency check (14-todo.md step 2), the writing of chunks 15-17, and the open remainder of a business review point can add open items after the first review. They use the same schema, say where they came from in their Where field, e.g. "(raised by consistency check CF-03)", and go through the same acceptance loop before anything is applied.
DELIVERY GATE: Chunks 15, 16, and 17 stay locked while any item here is Open or Deferred. Closed means Accepted - applied, Adjusted - applied, or Rejected.
-->

# Open Items & Clarifications

> **What this section is.** A structured backlog of concerns identified after the main BRD was authored, by a reviewer running with cleared context (so the review is independent rather than confirmatory). Each item comes with a **Recommended Answer** - a concrete, ready-to-apply resolution. Items are decisions awaiting your acceptance: accept the recommendation (or adjust it), and it gets reflected into the BRD body.
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
| **Recommended Answer** | The reviewer's concrete proposed resolution, written as ready-to-apply BRD content (the exact rule, step, row, or wording that would close the item). This is what gets injected into the body when you accept. |
| **Why** | REQUIRED. One or two lines: the reason the recommended option wins over the alternatives: the evidence behind it (source section, stated business expectation, domain practice, risk avoided) and the tradeoff being accepted. Never empty, never "best option". |
| **Status** | Open (awaiting your decision) / Accepted - applied (with pointer) / Adjusted - applied / Deferred (with rationale) / Rejected. |

---

## Open Items

### OI-01: Refund take-back rule

- **Status:** Accepted - applied (06a / UC-02 Business Rules & Constraints, first rule)

---

### OI-02: Earning points is assumed but neither scoped nor defined

- **Status:** Accepted - applied (03 Movement types (Earned); 04 In Scope; 02 Glossary (Points); 11 UI/UX Expectations (Points display))

---

### OI-03: Points members already hold at go-live

- **Status:** Accepted - applied (03 Movement types and Structure; 04 In Scope; 02 Dependencies)

---

### OI-04: Points expiry is not decided

- **Status:** Accepted - applied (03 Expiry; 04 Out of Scope)

---

### OI-05: Member sign-in and joining the program have no home

- **Status:** Accepted - applied (04 Out of Scope; 02 Dependencies)

---

### OI-06: Which refund outcome takes points back

- **Status:** Accepted - applied (06a / UC-02 BR-1; 03 Movement types (Taken back); 02 Glossary (Refunds Portal))

---

### OI-07: Partial refunds

- **Status:** Accepted - applied (06a / UC-02 BR-3, AC-2, AC-3; 03 Structure)

---

### OI-08: Refund before its purchase shows, or for a purchase with no points

- **Status:** Accepted - applied (06a / UC-02 BR-4, BR-5; 03 Overview; 10 NFR-02)

---

### OI-09: The same purchase or refund reported twice

- **Status:** Accepted - applied (03 Structure)

---

### OI-10: No way to report or correct a wrong balance

- **Status:** Accepted - applied (04 Personas / Actors; 03 Movement types and Structure; 05 User Journeys and Use Case Summary; 06b / UC-03; 06a / UC-02 A3, A4; 07 Users & Use Cases Matrix)

---

### OI-11: The use cases cover only the main path

- **Status:** Accepted - applied (06a / UC-01 E1, AC-2, AC-3; 06a / UC-02 A2, E1, AC-4, AC-5, AC-6)

---

### OI-12: Movement details are undefined and missing from the integration

- **Status:** Accepted - applied (06a / UC-02 steps 2 and 4; 08 Integrations (POS Records))

---

### OI-13: External systems are listed inconsistently

- **Status:** Accepted - applied (08 Integrations (Refunds Portal row, POS Records criticality); 02 Dependencies and Glossary; 06a / UC-02 Supporting Actors)

---

### OI-14: No timeliness requirement for earned points

- **Status:** Accepted - applied (10 NFR-03; 02 Assumptions / Constraints, item 1; 06a / UC-01 BR-2)

---

### OI-15: No availability, performance, or usability expectations

- **Status:** Accepted - applied (10 NFR-04, NFR-05, NFR-06)

---

### OI-16: No security and privacy requirement for members' purchase data

- **Status:** Accepted - applied (10 NFR-07)

---

### OI-17: Points history retention and leaving the program

- **Status:** Accepted - applied (03 Membership end and data retention)

---

### OI-18: Business Objectives and NFR-01 cannot be measured or tested

- **Status:** Accepted - applied (01 Business Objectives; 10 NFR-01)

---

### OI-19: Two facts are stated twice without a cross-reference

- **Status:** Accepted - applied (01 Executive Summary; 04 Out of Scope)

---

### OI-20: A take-back after a correction can push the balance below 0 (raised by consistency check CF-02)

- **Status:** Accepted - applied (06a / UC-02 BR-6)

---

### OI-21: Staff sign-in has no source (raised by consistency check CF-08)

- **Status:** Accepted - applied (02 Dependencies (Staff sign-in); 04 Out of Scope)

---

### OI-22: The leaver notice and two outside parties are missing from Integrations (raised by consistency check CF-09)

- **Status:** Accepted - applied (08 Integrations (Member sign-in and membership; Points balances at go-live))

---

### OI-23: A former member's balance is undefined (raised by consistency check CF-15)

- **Status:** Accepted - applied (03 Overview; 03 Membership end and data retention)

---

### OI-24: A correction for a missing purchase is not linked to that purchase (raised by consistency check CF-18)

- **Status:** Accepted - applied (06b / UC-03 step 3, BR-4; 03 Structure)

---

### OI-25: What the Loyalty Administrator enters for a missing purchase (raised by consistency check CF-22)

- **Status:** Accepted - applied (06b / UC-03 steps 3 and 4, AC-1)

---

### OI-26: A correction can name a purchase that already earned points (raised by consistency check CF-23)

- **Status:** Accepted - applied (06b / UC-03 E4, BR-5, AC-6)

---

### OI-27: A former member who rejoins (raised by consistency check CF-24)

- **Status:** Accepted - applied (03 Membership end and data retention; 02 Dependencies and 08 Integrations (Member sign-in and membership))

---

### OI-28: Nothing tells the product who holds the Loyalty Administrator role (raised by consistency check CF-25)

- **Status:** Accepted - applied (02 Dependencies and 08 Integrations (Staff sign-in))

---

### OI-29: Which movements count and show after a member rejoins (raised by consistency check CF-28)

- **Status:** Accepted - applied (03 Overview, Membership end and data retention; 06a / UC-02 step 2, AC-12; 06b / UC-03 step 2, E1)

---

### OI-30: Purchases from before the member last joined (raised by consistency check CF-34)

- **Status:** Accepted - applied (03 Membership end and data retention; 06a / UC-02 BR-7, AC-13; 06b / UC-03 E5, AC-11)

---

### OI-31: Who the purchases-before-a-rejoin rule covers (raised by consistency check CF-37)

- **Status:** Accepted - applied (06a / UC-02 BR-7; 06b / UC-03 E5)

---

### OI-32: Purchases made on the go-live date and the opening balance (raised by consistency check CF-40)

- **Status:** Accepted - applied (03 Movement types (Opening balance); 02 Dependencies and 08 Integrations (Points balances at go-live); 06a / UC-02 AC-19)

---

### OI-33: The maintenance exclusion in NFR-04 (raised by consistency check CF-41)

- **Status:** Accepted - applied (10 NFR-04)

---

### OI-34: A missing purchase dated before the go-live date (raised by consistency check CF-47)

- **Status:** Accepted - applied (03 Movement types (Opening balance); 06b / UC-03 E6, AC-12)

---

### OI-35: A member who leaves and rejoins on the same day (raised by consistency check CF-54)

- **Status:** Accepted - applied (03 Membership end and data retention; 06a / UC-02 AC-22)

---

### OI-36: The rest of the day a member leaves and rejoins (raised by consistency check CF-57)

- **Status:** Accepted - applied (03 Membership end and data retention; 06a / UC-01 AC-6, UC-02 AC-22, AC-23; 06b / UC-03 AC-14)

---

### OI-37: The amount paid for the other member's take-back (raised by consistency check CF-58)

- **Status:** Accepted - applied (06b / UC-03 BR-6, AC-17)

---

## Resolution Log

| ID | Resolution Date | Resolved In | Outcome |
|----|----------------|-------------|---------|
| OI-01 | 2026-09-24 | 06a / UC-02 BR-1 | Accepted recommendation |
| OI-02 | 2026-10-04 | 03 Movement types (Earned); 04 In Scope; 02 Glossary (Points); 11 UI/UX Expectations (Points display) | Accepted recommendation |
| OI-03 | 2026-10-04 | 03 Movement types and Structure; 04 In Scope; 02 Dependencies | Accepted recommendation |
| OI-04 | 2026-10-04 | 03 Expiry; 04 Out of Scope | Accepted recommendation |
| OI-05 | 2026-10-04 | 04 Out of Scope; 02 Dependencies | Accepted recommendation |
| OI-06 | 2026-10-04 | 06a / UC-02 BR-1; 03 Movement types (Taken back); 02 Glossary (Refunds Portal) | Accepted recommendation |
| OI-07 | 2026-10-04 | 06a / UC-02 BR-3, AC-2, AC-3; 03 Structure | Accepted recommendation |
| OI-08 | 2026-10-04 | 06a / UC-02 BR-4, BR-5; 03 Overview; 10 NFR-02 | Accepted recommendation |
| OI-09 | 2026-10-04 | 03 Structure | Accepted recommendation |
| OI-10 | 2026-10-04 | 04 Personas / Actors; 03 Movement types and Structure; 05 User Journeys and Use Case Summary; 06b / UC-03; 06a / UC-02 A3, A4; 07 Users & Use Cases Matrix | Accepted recommendation |
| OI-11 | 2026-10-04 | 06a / UC-01 E1, AC-2, AC-3; 06a / UC-02 A2, E1, AC-4, AC-5, AC-6 | Accepted recommendation |
| OI-12 | 2026-10-04 | 06a / UC-02 steps 2 and 4; 08 Integrations (POS Records) | Accepted recommendation |
| OI-13 | 2026-10-04 | 08 Integrations (Refunds Portal row, POS Records criticality); 02 Dependencies and Glossary; 06a / UC-02 Supporting Actors | Accepted recommendation |
| OI-14 | 2026-10-04 | 10 NFR-03; 02 Assumptions / Constraints, item 1; 06a / UC-01 BR-2 | Accepted recommendation |
| OI-15 | 2026-10-04 | 10 NFR-04, NFR-05, NFR-06 | Accepted recommendation |
| OI-16 | 2026-10-04 | 10 NFR-07 | Accepted recommendation |
| OI-17 | 2026-10-04 | 03 Membership end and data retention | Accepted recommendation |
| OI-18 | 2026-10-04 | 01 Business Objectives; 10 NFR-01 | Accepted recommendation |
| OI-19 | 2026-10-04 | 01 Executive Summary; 04 Out of Scope | Accepted recommendation |
| OI-20 | 2026-10-05 | 06a / UC-02 BR-6 | Accepted recommendation |
| OI-21 | 2026-10-05 | 02 Dependencies (Staff sign-in); 04 Out of Scope | Accepted recommendation |
| OI-22 | 2026-10-05 | 08 Integrations (Member sign-in and membership; Points balances at go-live) | Accepted recommendation |
| OI-23 | 2026-10-05 | 03 Overview; 03 Membership end and data retention | Accepted recommendation |
| OI-24 | 2026-10-05 | 06b / UC-03 step 3, BR-4; 03 Structure | Accepted recommendation |
| OI-25 | 2026-10-05 | 06b / UC-03 steps 3 and 4, AC-1 | Accepted recommendation |
| OI-26 | 2026-10-05 | 06b / UC-03 E4, BR-5, AC-6 | Accepted recommendation |
| OI-27 | 2026-10-05 | 03 Membership end and data retention; 02 Dependencies and 08 Integrations (Member sign-in and membership) | Accepted recommendation |
| OI-28 | 2026-10-05 | 02 Dependencies and 08 Integrations (Staff sign-in) | Accepted recommendation |
| OI-29 | 2026-10-05 | 03 Overview, Membership end and data retention; 06a / UC-02 step 2, AC-12; 06b / UC-03 step 2, E1 | Accepted recommendation |
| OI-30 | 2026-10-05 | 03 Membership end and data retention; 06a / UC-02 BR-7, AC-13; 06b / UC-03 E5, AC-11 | Accepted recommendation |
| OI-31 | 2026-10-05 | 06a / UC-02 BR-7; 06b / UC-03 E5 | Accepted recommendation |
| OI-32 | 2026-10-05 | 03 Movement types (Opening balance); 02 Dependencies and 08 Integrations (Points balances at go-live); 06a / UC-02 AC-19 | Accepted recommendation |
| OI-33 | 2026-10-05 | 10 NFR-04 | Accepted recommendation |
| OI-34 | 2026-10-05 | 03 Movement types (Opening balance); 06b / UC-03 E6, AC-12 | Accepted recommendation |
| OI-35 | 2026-10-05 | 03 Membership end and data retention; 06a / UC-02 AC-22 | Accepted recommendation |
| OI-36 | 2026-10-05 | 03 Membership end and data retention; 06a / UC-01 AC-6, UC-02 AC-22, AC-23; 06b / UC-03 AC-14 | Accepted recommendation |
| OI-37 | 2026-10-05 | 06b / UC-03 BR-6, AC-17 | Accepted recommendation |

---

## Reviewer Notes

| Risk area | Checked | Findings | Notes |
|-----------|---------|----------|-------|
| Scope | Every In Scope and Out of Scope line against the Executive Summary, the chunk 03 movement types, chunk 08, and both use cases; the edges a points program must decide: earning, points held before go-live, expiry, sign-in and joining | 4 (OI-02, OI-03, OI-04, OI-05) | Redemption is clearly out of scope; its second statement is in OI-19. |
| Use-case exception coverage | Every Main Flow step, alternate flow, business rule, and acceptance criterion in UC-01 and UC-02, and the purchase and refund paths behind the UC-02 take-back rule | 6 (OI-06, OI-07, OI-08, OI-09, OI-10, OI-11) | OI-12 (movement details) is counted under Integrations. |
| Matrix consistency | Every chunk 04 persona is a column, every chunk 05 use case is a row, each use-case actor has a Yes, conditional access has a footnote, and no outside party is a column | No issue found | - |
| NFRs | NFR-01 and NFR-02 against the Business Objectives, the chunk 02 assumption, and the template's standard qualities | 3 (OI-14, OI-15, OI-18) | OI-08 also changes the NFR-02 measure; Security & Privacy is counted below. Scalability is not raised: no chunk gives member or purchase volumes. |
| Integrations | Chunk 08 against the chunk 02 Dependencies, the use-case Supporting Actors, and what UC-02 shows; failure and delay as the member sees them | 2 (OI-12, OI-13) | Member-facing failure is covered by OI-11 (points cannot be shown) and OI-14 (late purchase records). |
| Security / privacy | Access rules in UC-01, UC-02, chunk 04, and chunk 07; the personal data the history shows; data protection duties | 1 (OI-16) | - |
| Data lifecycle | Retention of movements and purchase details, membership end, deletion requests, points at go-live, expiry | 1 (OI-17) | Points at go-live (OI-03) and expiry (OI-04) are counted under Scope. |

- Duplication: one item (OI-19). The "own points only" rule appears in UC-01, UC-02, chunk 04, and chunk 07; that follows the template's structure (persona access, use-case rules, matrix footnote), so no item is raised.
- Technical language: none found in the business text. The Figma links in chunk 06a are design references the template allows.
- Multi-tenancy: not relevant as written. The files describe one business: one set of branches, one currency, one Head of Retail, and no tenant, brand, or reseller. If the product must serve several businesses, the scope, the personas, and the earning rule need revisiting.
- Later phase: when redemption arrives, a refund after points are spent could take the balance below 0, so the rule in OI-08 needs a fresh decision then. Corrections (OI-10) also gain cash value at that point, which may call for an approval step on large corrections. A report of the points owed to members may be needed before redemption starts.

<!-- MASTER: loyalty-points-brd-master.md | PREV: 12-appendix-and-wishlist.md | NEXT: 14-todo.md -->

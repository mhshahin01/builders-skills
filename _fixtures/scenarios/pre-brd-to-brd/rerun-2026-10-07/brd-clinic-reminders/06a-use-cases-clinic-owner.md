<!--
CHUNK: 06a
TITLE: Detailed Use Cases - Clinic Owner
PROJECT: Clinic Reminders
VERSION: 1.0
DEPENDS_ON: 04, 05
PART OF: BRD - Clinic Reminders
SPLIT RULE: One chunk per persona (06a, 06b, ...), in the same persona order as chunk 05. UC IDs stay sequential across the whole BRD, not per chunk.
LANGUAGE: Business language only. Steps describe what the actor does and what the system does for them - never how the system is built. No technology names, protocols, or implementation terminology.
-->

# Detailed Use Cases - Clinic Owner

All detailed use cases follow this structure:

- **Actor & Goal**: Who performs it, what they want, what triggers it.
- **Why**: The business value of this use case.
- **Preconditions**: What must be true before the use case can start.
- **Main Flow**: Numbered detailed steps - actor action, system response, alternating.
- **Alternate & Exception Flows**: What happens when the path branches or fails, in business terms.
- **Flowchart** (branching use cases only, added once the requirements are final): The main, alternate, and exception paths in one diagram (or in connected numbered views for a large use case), derived from the narrative.
- **Business Rules & Constraints**: Rules, limits, and conditions that govern the use case.
- **Acceptance Criteria**: Testable conditions that confirm the use case is complete.
- **Future Enhancements**: Low-complexity follow-ups that could ship next.
- **UI/UX**: Wireframes or references to approved Figma designs.


---

## UC-01: Use the clinic account

| | |
|---|---|
| **Primary Actor** | Clinic Owner |
| **Supporting Actors** | Persona: Receptionist |
| **Goal** | Enter the clinic workspace through the owner or receptionist login. |
| **Trigger** | A clinic starts using the service. |

### Why

The source makes clinic logins part of the Must scope so owners and reception can use the same clinic service. Source: [pre-BRD 01](../../run/pre-brd-clinic-reminders/01-concept-sheet.md), [pre-BRD 14](../../run/pre-brd-clinic-reminders/14-moscow-method.md).

### Preconditions

The source dependency for this capability is listed in [Dependencies](./02-glossary-assumptions-facts.md#dependencies). Unresolved prerequisites stay marked there.

### Main Flow

1. The Clinic Owner uses the clinic owner login.
2. The system opens the clinic account.
3. The Receptionist uses the receptionist login.
4. The system provides the receptionist workspace.

### Alternate & Exception Flows

- E1 - Access cannot be established: **[NEEDS CLARIFICATION: Founders to define how accounts are provisioned, sign-in failures are shown and lost access is recovered; pre-BRD 01 states logins but no access lifecycle.]**

### Business Rules & Constraints

- **[NEEDS CLARIFICATION: Founders to confirm account setup, staff changes and the exact permissions of each login; pre-BRD 01 and 14.]**

### Acceptance Criteria

- [ ] Given supplied owner and receptionist logins, when each actor signs in, then each can reach the clinic workspace; permissions remain pending the access question.

### Future Enhancements

- None identified beyond the source Wishlist in [12](./12-appendix-and-wishlist.md#wishlist).

### UI/UX

Wireframe pending. See [UI/UX Expectations](./11-summary-and-uiux.md#uiux-expectations) and mockup MK-01 in [14](./14-todo.md).

---

## UC-02: Read the weekly no-show report

| | |
|---|---|
| **Primary Actor** | Clinic Owner |
| **Supporting Actors** | External: Meta |
| **Goal** | See whether the clinic is losing or recovering booked visits. |
| **Trigger** | The weekly report reaches the owner. |

### Why

The owner lacks a reliable no-show number; the report makes lost and recovered appointment time visible. Source: [pre-BRD 01](../../run/pre-brd-clinic-reminders/01-concept-sheet.md), [pre-BRD 04](../../run/pre-brd-clinic-reminders/04-value-proposition-canvas.md), [pre-BRD 14](../../run/pre-brd-clinic-reminders/14-moscow-method.md), [pre-BRD 15](../../run/pre-brd-clinic-reminders/15-okrs.md).

### Preconditions

The source dependency for this capability is listed in [Dependencies](./02-glossary-assumptions-facts.md#dependencies). Unresolved prerequisites stay marked there.

### Main Flow

1. The system sends the weekly report to the Clinic Owner on WhatsApp.
2. The Clinic Owner opens the report.
3. The report shows the measures defined in 09.
4. The Clinic Owner reads the clinic results.

### Alternate & Exception Flows

- E1 - Report unavailable or incomplete: **[NEEDS CLARIFICATION: Founders and clinic owners to define missing-attendance-data and undelivered-report handling; pre-BRD 01 and 04.]**

### Business Rules & Constraints

- Report measures have one home in 09; no extra report or notification policy is implied.

### Acceptance Criteria

- [ ] Given a completed reporting week, when the owner opens the report, then it presents the measures and format in 09.

### Future Enhancements

- None identified beyond the source Wishlist in [12](./12-appendix-and-wishlist.md#wishlist).

### UI/UX

Wireframe pending. See [UI/UX Expectations](./11-summary-and-uiux.md#uiux-expectations) and mockup MK-02 in [14](./14-todo.md).

---

## UC-03: Pay the clinic subscription

| | |
|---|---|
| **Primary Actor** | Clinic Owner |
| **Supporting Actors** | External: Local Payment Gateway |
| **Goal** | Pay for the clinic reminder service in EGP. |
| **Trigger** | The clinic pays its subscription at paid launch. |

### Why

Recurring clinic payments support the source paid-launch objective BO-10. Source: [pre-BRD 03](../../run/pre-brd-clinic-reminders/03-lean-canvas.md), [pre-BRD 14](../../run/pre-brd-clinic-reminders/14-moscow-method.md), [pre-BRD 21](../../run/pre-brd-clinic-reminders/21-roadmap-project-plan.md).

### Preconditions

The source dependency for this capability is listed in [Dependencies](./02-glossary-assumptions-facts.md#dependencies). Unresolved prerequisites stay marked there.

### Main Flow

1. The Clinic Owner accesses subscription billing.
2. The system presents the subscription amount in EGP, subject to the unresolved pricing decision.
3. The Clinic Owner submits the payment through the Local Payment Gateway.
4. The payment outcome returns to the clinic billing flow.

### Alternate & Exception Flows

- E1 - Payment fails or the outcome is unknown: **[NEEDS CLARIFICATION: Founders to define failed, late, duplicate and uncertain subscription payments and their effect on clinic access; pre-BRD 21 supplies no failure rule.]**

### Business Rules & Constraints

- **[NEEDS CLARIFICATION: Founders to confirm subscription prices, included messages, annual terms, top-ups, referral credits and the inconsistent SMS charging rule; pre-BRD 21 and pre-BRD 24 OI-09, OI-10 and OI-16. No price is approved here.]**

### Acceptance Criteria

- [ ] Given an agreed subscription amount, when the owner pays through the local gateway, then billing uses EGP. **[NEEDS CLARIFICATION: Founders to define the observable successful-payment result and subscription activation; pre-BRD 14 and 21.]**

### Future Enhancements

- None identified beyond the source Wishlist in [12](./12-appendix-and-wishlist.md#wishlist).

### UI/UX

Wireframe pending. See [UI/UX Expectations](./11-summary-and-uiux.md#uiux-expectations) and mockup MK-03 in [14](./14-todo.md).

## Upstream questions

- **[NEEDS CLARIFICATION: Founders to validate messaging cost, pricing and payback assumptions before subscription rules are final; pre-BRD 24 OI-09 remains Open.]** Source: [pre-BRD OI-09](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md#oi-09-gross-margin-and-churn-behind-ltvcac-are-assumptions-and-the-cost-side-omits-charged-replies-offers-and-hosting).
- **[NEEDS CLARIFICATION: Founders to confirm the price and tier mix behind BO-11; its planning revenue is not validated; pre-BRD 24 OI-10 remains Open.]** Source: [pre-BRD OI-10](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md#oi-10-the-planning-arpu-is-a-competitor-anchor-and-the-tier-mix-that-matches-it-has-no-basis).
- **[NEEDS CLARIFICATION: Founders to re-estimate scope and build dates; waitlist and report reductions remain unaccepted upstream proposals; pre-BRD 24 OI-12 remains Open.]** Source: [pre-BRD OI-12](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md#oi-12-the-mvp-schedule-assumes-all-founder-time-goes-to-coding).
- **[NEEDS CLARIFICATION: Founders to reconcile the source SMS charging conflict; linked figure and citation corrections remain upstream; pre-BRD 24 OI-16 remains Open.]** Source: [pre-BRD OI-16](../../run/pre-brd-clinic-reminders/24-open-items-and-assumptions-log.md#oi-16-minor-figure-and-citation-inconsistencies).


<!-- MASTER: clinic-reminders-brd-master.md | PREV: 05-user-journeys-overview.md | NEXT: 06b-use-cases-receptionist.md -->

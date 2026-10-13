<!--
CHUNK: 06a
TITLE: Detailed Use Cases - Member
PROJECT: Loyalty Points
VERSION: 1.6
DEPENDS_ON: 04, 05
PART OF: BRD - Loyalty Points
SPLIT RULE: One chunk per persona (06a, 06b, ...), in the same persona order as chunk 05. UC IDs stay sequential across the whole BRD, not per chunk.
LANGUAGE: Business language only. Steps describe what the actor does and what the system does for them - never how the system is built. No technology names, protocols, or implementation terminology.
-->

# Detailed Use Cases - Member

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

## UC-01: View Points Balance

| | |
|---|---|
| **Primary Actor** | Member |
| **Supporting Actors** | None |
| **Goal** | Know how many points they have. |
| **Trigger** | The member wants to check their points. |

### Why

Members can check their points at any time without calling a branch (Business Objective 2).

### Preconditions

- The member is signed in. **[NEEDS CLARIFICATION: Which use case, integration, or outside party signs the member in? No sign-in or member account use case is in scope.]**
- The member has not left the loyalty program ([03 / Member leaves the loyalty program](./03-definitions-and-domain-concepts.md#member-leaves-the-loyalty-program)).

### Main Flow

1. The member opens their points.
2. The system shows the current points balance, the date of the last points movement, a note that tells the member when new purchases and paid refunds appear in their points, and a line that says points cannot be used yet.

### Alternate & Exception Flows

- **A1 - No points movements yet:** At step 2, if the member has no points movements, the system shows a balance of 0 and explains how points are earned.
- **E1 - Points cannot be shown:** At step 2, the system tells the member that their points cannot be shown right now and asks them to try again later. The system does not show a balance of 0 or the A1 explanation in this case.

### Business Rules & Constraints

- Members see only their own points.
- The note says that points for a purchase appear by the time stated in [NFR-03](./10-nfrs.md#non-functional-requirements), and that points taken back after a refund appear within the time stated in [NFR-02](./10-nfrs.md#non-functional-requirements).
- The date of the last points movement is the date of the newest movement in the points history ([UC-02 step 2](#main-flow-1)).

### Acceptance Criteria

- [ ] Given a member with 120 points, when they open their points, then they see 120 and the date of the last movement.
- [ ] Given a member with no points movements, when they open their points, then they see a balance of 0 and an explanation of how points are earned (A1).
- [ ] Given the system cannot show the points, when the member opens their points, then they see a message asking them to try again later, and no balance (E1).
- [ ] Given a member opens their points, then they see a note telling them when new purchases and paid refunds appear.
- [ ] Given the system cannot show the points, when the member opens their points, then they do not see the explanation of how points are earned (E1).
- [ ] Given a member whose points movements add up to 0, when they open their points, then they see a balance of 0 and the date of the last movement, and no explanation of how points are earned.
- [ ] Given a person who has left the loyalty program, when they try to open their points, then the system does not show their points balance.
- [ ] Given a member whose history has a taken-back movement dated 4 March for one purchase, and an earned movement for another purchase made on 3 March that reached Loyalty Points on 5 March, when they open their points, then they see 4 March as the date of the last movement.
- [ ] Given a member opens their points, then they see a line that says points cannot be used yet.

### Future Enhancements

- None identified at this time.

### UI/UX

Screen LP-01 (points balance). Figma: https://www.figma.com/proto/LOYL01/loyalty-points?node-id=lp-01

---

## UC-02: View Points History

| | |
|---|---|
| **Primary Actor** | Member |
| **Supporting Actors** | None |
| **Goal** | See where their points come from. |
| **Trigger** | The member wants to understand their balance. |

### Why

Members trust their balance when they can see every movement (Business Objective 1).

### Preconditions

- The member is signed in. (Same open question as UC-01 Preconditions.)
- The member has not left the loyalty program ([03 / Member leaves the loyalty program](./03-definitions-and-domain-concepts.md#member-leaves-the-loyalty-program)).

### Main Flow

1. The member opens the history of their points.
2. The system lists every points movement, newest first. Each movement shows its date, its purchase or refund reference, and its points. The date of an earned movement is the purchase date. The date of a taken-back movement is the date the refund was paid. The system also shows the same note as UC-01 step 2 about when new purchases and paid refunds appear.
3. The member opens one movement.
4. The system shows the details behind the movement. For a purchase: the purchase date, the branch, the purchase reference, the amount in EUR, and the points earned. For a refund: the date the refund was paid, the refund reference, the purchase reference it refunds, the refunded amount in EUR, and the points taken back.

### Alternate & Exception Flows

- **A1 - Points taken back after a refund:** At step 2, when the refund of a purchase is paid, the history shows a taken-back movement with the points taken back and the refund reference. For a refund of a purchase that has not earned points, see [UC-02 BR-4 and BR-5](#business-rules--constraints-1). For a refund the Refunds Portal does not report, or one paid before the day it starts to report refund outcomes, see [UC-02 BR-7](#business-rules--constraints-1).
- **A2 - Details no longer kept:** At step 4, if the details behind the movement are no longer kept, the system shows the movement's date, reference and points, and tells the member that older details are no longer available.
- **E1 - History cannot be shown:** At step 2 or step 4, the system tells the member that their points history cannot be shown right now and asks them to try again later. The system does not show an empty history in this case.

### Business Rules & Constraints

- Points earned on a purchase are taken back when the Refunds Portal reports that the refund of that purchase is paid. A refund that is rejected or cancelled takes back no points. When only part of a purchase is refunded, the system takes back 1 point for each 1 EUR of the refunded amount, rounded the same way as points are earned ([03 / Earning points](./03-definitions-and-domain-concepts.md#earning-points)), and never more than BR-6 allows. For a member who has left, see [03 / Member leaves the loyalty program](./03-definitions-and-domain-concepts.md#member-leaves-the-loyalty-program).
- Members see only their own points.
- Each paid refund takes points back once, even if the Refunds Portal reports it more than once.
- Only a refund of a purchase that earned points takes points back. A refund of any other purchase adds no movement.
- If a refund is paid before its purchase has earned points, the system takes the points back when the purchase earns them. The history then shows both movements. The system waits up to 30 days after the refund is paid. If the purchase has not earned points by then, the refund adds no movement, and the purchase keeps the points it earns if it arrives later.
- The points taken back for one purchase never add up to more than the points that purchase earned.
- Only refunds that the Refunds Portal reports take points back. A refund made another way, for example a cash refund at a branch or a return at the till, takes back no points in this release. A refund paid before the day the Refunds Portal starts to report refund outcomes to Loyalty Points also takes back no points.
- The system sends the member no message when points are taken back. The member sees the take-back in the points history (A1).

### Acceptance Criteria

- [ ] Given a purchase that earned 50 points and whose refund is paid, when the member opens the history, then they see a movement of -50 points with the refund reference.
- [ ] Given a member with several points movements, when they open the history, then they see every movement, newest first, each with its date, its purchase or refund reference, and its points.
- [ ] Given a movement in the history, when the member opens it, then they see the purchase or refund it came from.
- [ ] Given a refund that the Refunds Portal reports as rejected, when the member opens the history, then no points are taken back for it.
- [ ] Given the Refunds Portal reports the same paid refund twice, when the member opens the history, then they see one taken-back movement for that refund.
- [ ] Given the system cannot show the history, when the member opens it, then they see a message asking them to try again later, and no empty list (E1).
- [ ] Given a movement whose details are no longer kept, when the member opens it, then they see its date, reference and points, and a message that older details are no longer available (A2).
- [ ] Given the system cannot show the details of a movement, when the member opens that movement, then they see a message asking them to try again later (E1).
- [ ] Given a refund that the Refunds Portal reports as cancelled, when the member opens the history, then no points are taken back for it.
- [ ] Given a paid refund of a purchase that never earns points (for example a purchase made before the start of points), when the member opens the history, then the refund adds no movement.
- [ ] Given a refund paid before its purchase has earned points, when the purchase earns its points within 30 days after the refund is paid, then the history shows the earned movement and the taken-back movement.
- [ ] Given a purchase that earned 50 points and several paid refunds of it, when the member opens the history, then the points taken back for that purchase add up to 50 at most.
- [ ] Given a person who has left the loyalty program, when they try to open the history, then the system does not show their points history.
- [ ] Given an earned movement for a purchase that reached Loyalty Points after the day it was made, and a taken-back movement for a paid refund, when the member opens the history, then the earned movement shows the purchase date and the taken-back movement shows the date the refund was paid.
- [ ] Given a member opens the history, then they see the note telling them when new purchases and paid refunds appear.
- [ ] Given a purchase of 50 EUR that earned 50 points and a paid refund of 20 EUR of it, when the member opens the history, then they see a taken-back movement of -20 points with the refund reference.
- [ ] Given a refund paid on 1 March whose purchase earns its points on 5 April, when the member opens the history, then they see the earned movement and no taken-back movement for that refund.
- [ ] Given a refund paid before the day the Refunds Portal starts to report refund outcomes to Loyalty Points, when the Refunds Portal reports it as paid after reporting has started, then the history shows no taken-back movement for that refund.
- [ ] Given a purchase that earned 50 points and whose refund is paid on the day the Refunds Portal starts to report refund outcomes, when the Refunds Portal reports it as paid, then the history shows a movement of -50 points with the refund reference.

### Future Enhancements

- Export the history.
- Tell the member when points are taken back after a refund.

### UI/UX

Screen LP-02 (points history). Figma: https://www.figma.com/proto/LOYL01/loyalty-points?node-id=lp-02

<!-- MASTER: loyalty-points-brd-master.md | PREV: 05-user-journeys-overview.md | NEXT: 07-users-use-cases-matrix.md -->

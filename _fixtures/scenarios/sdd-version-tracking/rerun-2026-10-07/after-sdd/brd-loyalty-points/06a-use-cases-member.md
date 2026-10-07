<!--
CHUNK: 06a
TITLE: Detailed Use Cases - Member
PROJECT: Loyalty Points
VERSION: 1.1
DEPENDS_ON: 04, 05
PART OF: BRD - Loyalty Points
-->

# Detailed Use Cases - Member

---

## UC-01: View Points Balance

| | |
|---|---|
| **Primary Actor** | Member |
| **Supporting Actors** | None |
| **Goal** | Know how many points they have. |
| **Trigger** | The member wants to check their points. |

### Why

Supports Business Objective 2.

### Preconditions

- The member is signed in.

### Main Flow

1. The member opens their points.
2. The system shows the current balance and the date of the last movement.

### Alternate & Exception Flows

- **A1 - No points yet:** At step 2, the system shows a balance of 0 and explains how points are earned.

### Business Rules & Constraints

- Members see only their own points.

### Acceptance Criteria

- [ ] Given a member with 120 points, when they open their points, then they see 120 and the date of the last movement.

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

Supports Business Objective 1: members trust their balance when they can see every movement.

### Preconditions

- The member is signed in.

### Main Flow

1. The member opens the history of their points.
2. The system lists every points movement, newest first, with date, purchase or refund reference, and points.
3. The member opens one movement.
4. The system shows the purchase or refund it came from.

### Alternate & Exception Flows

- **A1 - Points taken back after a refund:** At step 2, a movement for a refunded purchase shows the points taken back and the refund reference.

### Business Rules & Constraints

- Points earned on a purchase are taken back when that purchase is refunded in the Refunds Portal.
- Members see only their own points.
- When only part of a purchase is refunded, only the points for the refunded amount are taken back: 1 point for each full 1 EUR refunded.

### Acceptance Criteria

- [ ] Given a refunded purchase that earned 50 points, when the member opens the history, then they see a movement of -50 points with the refund reference.
- [ ] Given a purchase of 80.00 EUR that earned 80 points and a partial refund of 30.50 EUR, when the member opens the history, then they see a movement of -30 points with the refund reference.

### Future Enhancements

- Export the history.

### UI/UX

Screen LP-02 (points history). Figma: https://www.figma.com/proto/LOYL01/loyalty-points?node-id=lp-02

<!-- MASTER: loyalty-points-brd-master.md | PREV: 05-user-journeys-overview.md | NEXT: 07-users-use-cases-matrix.md -->

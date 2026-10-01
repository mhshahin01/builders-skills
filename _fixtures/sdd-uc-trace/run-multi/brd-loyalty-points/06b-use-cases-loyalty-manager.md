<!--
CHUNK: 06b
TITLE: Detailed Use Cases - Loyalty Manager
PROJECT: Loyalty Points
VERSION: 1.2
DEPENDS_ON: 04, 05
PART OF: BRD - Loyalty Points
-->

# Detailed Use Cases - Loyalty Manager

---

## UC-03: Adjust a Customer's Points

| | |
|---|---|
| **Primary Actor** | Loyalty Manager |
| **Supporting Actors** | None |
| **Goal** | Correct a customer's points. |
| **Trigger** | A customer's points are wrong, for example after a disputed refund. |

### Why

Supports Business Objective 3.

### Preconditions

- The loyalty manager has found the customer.

### Main Flow

1. The loyalty manager opens the customer's points history.
2. The system shows every change with its reason.
3. The loyalty manager enters the points to add or remove and a reason.
4. The system updates the balance, records the adjustment, and tells the customer by email.

### Alternate & Exception Flows

- **E1 - Balance would go below zero:** At step 4, the system refuses and shows the most that can be removed.

### Business Rules & Constraints

- Every adjustment has a reason.
- Adjustments above 5,000 points need a second loyalty manager to approve.

### Acceptance Criteria

- [ ] Given an adjustment of 6,000 points, when the loyalty manager saves it, then it waits for a second approval.

### Future Enhancements

- Bulk adjustments from a file.

### UI/UX

Figma frame LP-03 (adjustment form).

<!-- MASTER: loyalty-points-brd-master.md | PREV: 06a-use-cases-customer.md | NEXT: 07-users-use-cases-matrix.md -->

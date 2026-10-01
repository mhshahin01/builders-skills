<!--
CHUNK: 06a
TITLE: Detailed Use Cases - Customer
PROJECT: Loyalty Points
VERSION: 1.2
DEPENDS_ON: 04, 05
PART OF: BRD - Loyalty Points
-->

# Detailed Use Cases - Customer

---

## UC-01: View Points Balance

| | |
|---|---|
| **Primary Actor** | Customer |
| **Supporting Actors** | None |
| **Goal** | Know how many points they have and why. |
| **Trigger** | The customer wants to check their points. |

### Why

Supports Business Objective 1.

### Preconditions

- The customer has a loyalty card.

### Main Flow

1. The customer opens their points.
2. The system shows the balance and the latest changes: points earned per purchase, vouchers bought, adjustments, and points taken back for refunds.
3. The customer opens one change.
4. The system shows the purchase, voucher, or adjustment behind it.

### Alternate & Exception Flows

- **A1 - No points yet:** At step 2, the system shows a zero balance and explains how to earn points.

### Business Rules & Constraints

- Customers see only their own points.
- Points taken back for a refund show the refund reference.

### Acceptance Criteria

- [ ] Given a refunded purchase, when the customer opens their points, then they see the points taken back with the refund reference.

### Future Enhancements

- None identified at this time.

### UI/UX

Figma frame LP-01 (points balance).

---

## UC-02: Redeem Points for a Voucher

| | |
|---|---|
| **Primary Actor** | Customer |
| **Supporting Actors** | None |
| **Goal** | Turn points into a voucher. |
| **Trigger** | The customer has enough points and wants a voucher. |

### Why

Supports Business Objective 2.

### Preconditions

- The customer has at least 500 points.

### Main Flow

1. The customer chooses to get a voucher.
2. The system shows the vouchers the balance allows.
3. The customer picks one and confirms.
4. The system takes the points, issues the voucher code, and sends it by email.

### Alternate & Exception Flows

- **E1 - Balance changed:** At step 4, if the balance no longer covers the voucher (for example, points were taken back for a refund), the system says so and issues nothing.

### Business Rules & Constraints

- 500 points buy a voucher worth 10 units of currency.

### Acceptance Criteria

- [ ] Given 1,200 points, when the customer buys one voucher, then 700 points remain and the code arrives by email.

### Future Enhancements

- Vouchers from partner shops.

### UI/UX

Figma frame LP-02 (voucher choice).

<!-- MASTER: loyalty-points-brd-master.md | PREV: 05-user-journeys-overview.md | NEXT: 06b-use-cases-loyalty-manager.md -->

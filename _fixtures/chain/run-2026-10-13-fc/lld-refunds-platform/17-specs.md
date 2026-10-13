<!--
CHUNK: 17
TITLE: Specs
PROJECT: Refunds Platform
VERSION: 1.1
DEPENDS_ON: the source SDD (§1 Executive Summary, §6 Ecosystem Overview, §13 Services Decomposition) and this LLD's 00-metadata.md / 03-architecture.md
PART OF: LLD - Refunds Platform
PURPOSE: Constitution-grade summary, owned by lld-unifier and authored after the LLD body. Source of truth for speckit `/constitution`.
-->

# Specs

> **Purpose.** Constitution-grade summary of this system, written after the LLD body is complete. Speckit's `/constitution` reads this verbatim. Sub-section 2 mirrors the runtime stack of `03-architecture.md` § 6.3; sub-section 4 records the direction decision.

---

## 1. Mission

The Refunds Platform lets a retailer's customers request and follow refunds for branch purchases online, lets branch managers decide on them, and pays approved refunds back to the original card exactly once: a payout waits while a card dispute of the original payment is open, is paid again when the customer's bank sends it back, and is settled by hand only with a second operator's confirmation. It reports every refund outcome to Loyalty Points, so a member's points balance always equals the sum of its movements, and it is one modular deployable that replaces paper and phone approvals with a recorded, traceable refund lifecycle.

---

## 2. Tech Stack

- **Backend:** Java 21, Spring Boot 3.5+; one deployable `refunds-platform-app`, modular monolith with four hexagonal modules. Flyway and Resilience4j proposed (ADR-10), versions not pinned (see the `03-architecture.md` § 6.3 TODO).
- **Frontend:** Angular 17+ standalone components, one web app for the customer, member, branch manager, and payout operator screens; proposed (ADR-11), needs product-owner approval.
- **Mobile:** Not applicable.
- **Data:** PostgreSQL 17+, one database, one schema and one role per module.
- **Messaging:** Not applicable: no broker; durable in-process domain events through a publication log per publishing module (ADR-02).

---

## 3. Roadmap

| Phase | Scope (one line) | Services / UC IDs |
|-------|------------------|-------------------|
| P1 - Refund requests | Customers of the started pilot branches request, track, and cancel refunds and get their messages | refund-request; REFUNDS/UC-01, REFUNDS/UC-02, REFUNDS/UC-03. customer-notification (messages of REFUNDS/UC-01 and REFUNDS/UC-03) |
| P2 - Decisions and payouts | Branch managers approve or reject and see their branch refund report; approved refunds are paid to the original card, held for an open card dispute, paid again when sent back, resolved by two payout operators, and reconciled | refund-request; REFUNDS/UC-04. payout (payout steps of REFUNDS/UC-04). customer-notification (messages and alert of REFUNDS/UC-04) |
| P3 - Loyalty points | Members see their balance and history; purchases earn points, and the refund outcomes the Refunds Portal reports take points back or are recorded | loyalty-points; LOYALTY/UC-01, LOYALTY/UC-02 |

---

## 4. Project Type

- [x] **Greenfield** - new product, no pre-existing codebase to honour.
- [ ] **Brownfield** - extending or re-architecting an existing codebase.

**Selected:** Greenfield

**Justification (one line):** SDD §1 records Greenfield: no source BRD names an existing codebase; CardPay Ltd, MsgHub, and Point-of-Sale Records are external systems the platform only integrates with.

**LLD direction taken:** from-sdd

<!-- MASTER: refunds-platform-lld-master.md | PREV: 16-references.md | NEXT: 18-open-items-and-clarifications.md -->

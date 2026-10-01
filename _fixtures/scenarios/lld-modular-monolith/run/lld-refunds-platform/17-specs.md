<!--
CHUNK: 17
TITLE: Specs
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: the source SDD (§1 Executive Summary, §6 Ecosystem Overview, §13 Services Decomposition) and this LLD's 00-metadata.md / 03-architecture.md
PART OF: LLD - Refunds Platform
PURPOSE: Constitution-grade summary, owned by lld-unifier and authored AFTER the LLD body. Synthesised from the source SDD (Mission from SDD §1, Tech Stack from SDD §6 with version pins, Roadmap from SDD §13 + BRD UC ownership) plus the Project Type recorded at SDD intake. Source of truth for speckit `/constitution`. Tone: short, precise, clear, simple. No narrative. No marketing.
SPECKIT_NOTE: Sub-sections 1 (Mission), 2 (Tech Stack), and 3 (Roadmap) are intended as direct inputs for speckit's `/constitution`. Sub-section 4 (Project Type) documents the direction decision that shaped this LLD.
LEGACY_NOTE: No legacy Specs existed in this chain (the SDD carries none; neither BRD has a 12-specs.md).
-->

# Specs

> **Purpose.** Constitution-grade summary of this system, written after the LLD body is complete. Speckit's `/constitution` reads this verbatim. Sub-section 2 (Tech Stack) mirrors the resolved runtime stack that steered this LLD's pattern selection; sub-section 4 (Project Type) records the direction decision. Each sub-section is short by design.

---

## 1. Mission

The Refunds Platform is one deployable that lets branch customers request and track refunds of their purchases, lets branch managers decide them with payouts to the original card, and shows loyalty members their points balance and history, taking back the points of refunded purchases. Every refund is recorded, decided once, and paid exactly once, and every points balance equals the sum of its movements.

---

## 2. Tech Stack

- **Backend:** Java 21, Spring Boot 3.5+, Spring Modulith (version open in SDD §6); a modular monolith of four modules, DDD bounded contexts with hexagonal ports and adapters.
- **Frontend:** Angular 17+ standalone components, Tailwind + PrimeNG; responsive for phones and computers.
- **Mobile:** Not applicable.
- **Data:** PostgreSQL 17+, one database with one schema per module plus `platform`; Flyway versioned SQL migrations.
- **Messaging:** Not applicable.

Messaging is in process only: domain events from a durable event publication log, no broker in this release (ADR-02). The stack equals `03-architecture.md` § 6.3 Runtime Stack.

> TODO: the Spring Modulith and Keycloak version pins are open in SDD §6 (a missing pin the skill would ask about, taken as open in this non-interactive run); best guess: the Spring Modulith release line that supports Spring Boot 3.5 - verify.

---

## 3. Roadmap

| Phase | Scope (one line) | Services / UC IDs |
|-------|------------------|-------------------|
| P1 - Foundation and refund requests | The deployable with platform components, Keycloak realm, tenant isolation, event publication log; customers submit refunds and get the submission message | refund, notification; REFUNDS/UC-01 |
| P2 - Tracking and cancellation | Customers follow and cancel their requests | refund, notification; REFUNDS/UC-02, REFUNDS/UC-03 |
| P3 - Decisions and payouts | Branch managers approve or reject; payouts to CardPay with retries, alerts, and reconciliation | refund, payout, notification; REFUNDS/UC-04 |
| P4 - Loyalty points | Points balance, history, earn intake, and take-back on paid refunds | loyalty; LOYALTY/UC-01, LOYALTY/UC-02 |

---

## 4. Project Type

- [x] **Greenfield** - new product, no pre-existing codebase to honour.
- [ ] **Brownfield** - extending or re-architecting an existing codebase. Cite the codebase reference: [path or repo URL].

**Selected:** Greenfield

**Justification (one line):** refunds are handled on paper today and neither BRD names an existing codebase (SDD §1 Project Type).

**LLD direction taken:** from-sdd

<!-- MASTER: refunds-platform-lld-master.md | PREV: 16-references.md | NEXT: 18-open-items-and-clarifications.md -->

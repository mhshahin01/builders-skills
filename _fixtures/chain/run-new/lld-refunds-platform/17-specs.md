<!--
CHUNK: 17
TITLE: Specs
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: the source SDD (§1 Executive Summary, §6 Ecosystem Overview, §13 Services Decomposition) and this LLD's 00-metadata.md / 03-architecture.md
PART OF: LLD - Refunds Platform
PURPOSE: Constitution-grade summary, owned by lld-unifier and authored AFTER the LLD body. Source of truth for speckit `/constitution`.
LEGACY_NOTE: No legacy SDD or BRD Specs chunk exists in this chain; this chunk is the canonical copy.
-->

# Specs

> **Purpose.** Constitution-grade summary of this system, written after the LLD body is complete. Speckit's `/constitution` reads this verbatim. Sub-section 2 (Tech Stack) mirrors the resolved runtime stack that steered this LLD's pattern selection; sub-section 4 (Project Type) records the direction decision. Each sub-section is short by design.

---

## 1. Mission

The Refunds Platform lets customers of a retailer's branches request and track refunds online, lets branch managers decide on them in one place, and pays each approved refund back to the original card exactly once. It shows loyalty members their points balance and history, and takes back a purchase's points when its refund is paid. It replaces a paper refund process with one traceable, multi-tenant platform.

---

## 2. Tech Stack

- **Backend:** Java 21, Spring Boot 3.5+ (REFUNDS/TI-01); hybrid architecture: `refunds-platform-core` (refund-service and loyalty-service modules) plus payout-service and notification-service (ADR-01); hexagonal inside each.
- **Frontend:** Angular 17+ (standalone components), PrimeNG, Tailwind; one responsive web app.
- **Mobile:** Not applicable. (The responsive web app serves phones, SDD A-7.)
- **Data:** PostgreSQL 17+ (REFUNDS/TI-02); a schema per core module, a database per separate service, UUIDv7 keys, Flyway (ADR-06).
- **Messaging:** Apache Kafka with a JSON Schema registry (additive-only), transactional outbox and inbox (ADR-02, ADR-05); Kafka version not pinned.

> TODO: the Kafka, Keycloak, and schema-registry versions are `[NEEDS CLARIFICATION]` in SDD §6; best guess pin them when the platform team names the cluster - verify, then update SDD §6 (the home) and this line.

Cross-check with `03-architecture.md` § 6.3 Runtime Stack: consistent (no drift).

---

## 3. Roadmap

| Phase | Scope (one line) | Services / UC IDs |
|-------|------------------|-------------------|
| P1 - Refund intake | Platform kernel, Keycloak realm and gateway routes, customers submit refund requests and are told by email and SMS | refund-service, notification-service; REFUNDS/UC-01 |
| P2 - Tracking and cancellation | Customers follow their requests and cancel undecided ones | refund-service, notification-service; REFUNDS/UC-02, REFUNDS/UC-03 |
| P3 - Decisions and payouts | Branch decisions, CardPay payouts inside the ADR-10 retry window, outcome messages, daily branch report | refund-service, payout-service, notification-service; REFUNDS/UC-04 |
| P4 - Loyalty ledger | Member purchases earn points, balance and history views, points taken back on paid refunds | loyalty-service; LOYALTY/UC-01, LOYALTY/UC-02 |

---

## 4. Project Type

- [x] **Greenfield** - new product, no pre-existing codebase to honour.
- [ ] **Brownfield** - extending or re-architecting an existing codebase.

**Selected:** Greenfield

**Justification (one line):** the refund process is paper-based today and neither BRD names an existing codebase; POS Records, CardPay, and MsgHub are external systems reached only through adapters (SDD §1).

**LLD direction taken:** from-sdd

<!-- MASTER: refunds-platform-lld-master.md | PREV: 16-references.md | NEXT: 18-open-items-and-clarifications.md -->

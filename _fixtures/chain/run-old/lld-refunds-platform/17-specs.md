<!--
CHUNK: 17
TITLE: Specs
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: the source SDD (§1 Executive Summary, §6 Ecosystem Overview, §13 Services Decomposition) and this LLD's 00-metadata.md / 03-architecture.md
PART OF: LLD - Refunds Platform
PURPOSE: Constitution-grade summary, owned by lld-unifier and authored AFTER the LLD body. Synthesised from the source SDD (Mission from SDD §1, Tech Stack from SDD §6 with version pins, Roadmap from SDD §13 + BRD UC ownership) plus the Project Type recorded at SDD intake. Source of truth for speckit `/constitution`. Tone: short, precise, clear, simple. No narrative. No marketing.
SPECKIT_NOTE: Sub-sections 1 (Mission), 2 (Tech Stack), and 3 (Roadmap) are intended as direct inputs for speckit's `/constitution`. Sub-section 4 (Project Type) documents the direction decision that shaped this LLD.
LEGACY_NOTE: No legacy Specs exists in the source chain (the SDD carries none; the BRDs carry none); this chunk is the canonical copy.
-->

# Specs

> **Purpose.** Constitution-grade summary of this system, written after the LLD body is complete. Speckit's `/constitution` reads this verbatim. Sub-section 2 (Tech Stack) mirrors the resolved runtime stack that steered this LLD's pattern selection; sub-section 4 (Project Type) records the direction decision. Each sub-section is short by design.

---

## 1. Mission

The Refunds Platform lets a retailer's customers request and track refunds for branch purchases online, lets branch managers decide on them, and pays each approved refund back to the original card exactly once. It also shows loyalty members their points balance and history, and takes back the points of a purchase when its refund is paid.

---

## 2. Tech Stack

- **Backend:** Java 21, Spring Boot 3.5+; hybrid architecture: one core deployable (refund-service and loyalty-service modules) plus payout-service and notification-service; hexagonal inside each; Resilience4j.
- **Frontend:** Angular 17+ (standalone components), PrimeNG, Tailwind (PrimeNG and Tailwind versions not pinned).
- **Mobile:** Not applicable (the responsive web app serves mobile, SDD A-7).
- **Data:** PostgreSQL 17+; schema per module in the core database, one database per separate service; Flyway (version not pinned).
- **Messaging:** Apache Kafka on premises with a JSON Schema registry (versions not pinned); transactional outbox and inbox.

Cross-check: equal to this LLD's [03 § 6.3 Runtime Stack](./03-architecture.md#63-runtime-stack) and to [SDD §6](../sdd-refunds-platform/02-ecosystem-overview.md#6-ecosystem-overview); no mismatch. Identity: Keycloak, one realm (version not pinned).

> TODO: not derivable from inputs - version pins for Kafka, the schema registry, Keycloak, Flyway, PrimeNG, and Tailwind are open in SDD §6; the skill asks the user for missing pins, which this non-interactive run could not do - please specify in SDD §6.

---

## 3. Roadmap

| Phase | Scope (one line) | Services / UC IDs |
|-------|------------------|-------------------|
| P1 - Foundation and refund intake | Shared platform components, realm import, gateway routes, topics, and online refund requests with the submission message | refund-service, notification-service; REFUNDS/UC-01 |
| P2 - Tracking and cancellation | Customers follow and cancel their requests, with the cancellation message | refund-service, notification-service; REFUNDS/UC-02, REFUNDS/UC-03 |
| P3 - Decisions and payouts | Branch decisions, CardPay payouts inside the ADR-10 window, outcome messages, payout checks, daily branch report | refund-service, payout-service, notification-service; REFUNDS/UC-04 (UC-05 merged) |
| P4 - Loyalty points | Earn movements from POS purchases, balance and history, take-back on paid refunds | loyalty-service; LOYALTY/UC-01, LOYALTY/UC-02 |

Phases P1 to P3 follow the REFUNDS implementation plan waves ([REFUNDS 15](../brd-refunds-portal/15-implementation.md)); P4 follows P3 because take-backs consume `REFUND_PAID`.

---

## 4. Project Type

- [x] **Greenfield** - new product, no pre-existing codebase to honour.
- [ ] **Brownfield** - extending or re-architecting an existing codebase.

**Selected:** Greenfield

**Justification (one line):** SDD §1 records Greenfield: the refund process is paper-based today and neither BRD names an existing codebase.

**LLD direction taken:** from-sdd

<!-- MASTER: lld-master.md | PREV: 16-references.md | NEXT: 18-open-items-and-clarifications.md -->

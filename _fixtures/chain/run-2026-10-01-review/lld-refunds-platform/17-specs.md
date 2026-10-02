<!--
CHUNK: 17
TITLE: Specs
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: the source SDD (§1 Executive Summary, §6 Ecosystem Overview, §13 Services Decomposition) and this LLD's 00-metadata.md / 03-architecture.md
PART OF: LLD - Refunds Platform
PURPOSE: Constitution-grade summary, owned by lld-unifier and authored AFTER the LLD body. Synthesised from the source SDD (Mission from SDD §1, Tech Stack from SDD §6 with version pins, Roadmap from SDD §13 + BRD UC ownership) plus the Project Type recorded at SDD intake. Source of truth for speckit `/constitution`. Tone: short, precise, clear, simple. No narrative. No marketing.
SPECKIT_NOTE: Sub-sections 1 (Mission), 2 (Tech Stack), and 3 (Roadmap) are intended as direct inputs for speckit's `/constitution`. Sub-section 4 (Project Type) documents the direction decision that shaped this LLD.
LEGACY_NOTE: Older chains carried the Specs at the SDD (`../sdd-[sdd-slug]/15-specs.md` / `# 19. Specs`) or the BRD (`../brd-[brd-slug]/12-specs.md`). If a legacy Specs exists, it was consumed as input; this chunk is the canonical copy going forward. No legacy Specs exists in this chain.
-->

# Specs

> **Purpose.** Constitution-grade summary of this system, written after the LLD body is complete. Speckit's `/constitution` reads this verbatim. Sub-section 2 (Tech Stack) mirrors the resolved runtime stack that steered this LLD's pattern selection; sub-section 4 (Project Type) records the direction decision. Each sub-section is short by design.

---

## 1. Mission

The Refunds Platform is one web platform for a retailer's branch customers, branch managers, and loyalty members. Customers request and track refunds for branch purchases, branch managers decide on their own branch's requests, and approved refunds are paid back to the original card, never lost and never paid twice. Members see their points balance and history, and points earned on a purchase are taken back once its refund is paid.

---

## 2. Tech Stack

- **Backend:** Java 21, Spring Boot 3.5+; hybrid architecture: the `refunds-platform-core` modular monolith (refund-service and loyalty-service modules) plus the extracted payout-service and notification-service; Spring Cloud Gateway at the edge (version not pinned).
- **Frontend:** Angular 17+ standalone components, PrimeNG, Tailwind.
- **Mobile:** Not applicable.
- **Data:** PostgreSQL 17+ (one core database with the `refund`, `loyalty`, and `core_events` schemas; one database each for payout and notification); Flyway migrations.
- **Messaging:** Apache Kafka with a JSON Schema registry and the transactional outbox between deployables (version not pinned); in-process domain events with a durable publication log inside the core.

Equal to the LLD Runtime Stack ([03 § 6.3](./03-architecture.md#63-runtime-stack)); the unpinned versions are the 03 § 6.3 TODO.

---

## 3. Roadmap

| Phase | Scope (one line) | Services / UC IDs |
|-------|------------------|-------------------|
| P1 - Foundation and refund requests | Core deployable, platform library, outbox relay, gateway and realm configuration; customers submit refunds and receive the Submitted message | refund-service, notification-service; REFUNDS/UC-01 |
| P2 - Tracking and cancellation | Customers follow and cancel their requests | refund-service, notification-service; REFUNDS/UC-02, REFUNDS/UC-03 |
| P3 - Decisions and payouts | Branch managers approve or reject; approved refunds are paid to the original card; payout watchdog and daily branch report | refund-service, payout-service, notification-service; REFUNDS/UC-04 |
| P4 - Loyalty points | Points import, balance, history, and the take-back of points after a paid refund | loyalty-service; LOYALTY/UC-01, LOYALTY/UC-02 |

---

## 4. Project Type

- [x] **Greenfield** - new product, no pre-existing codebase to honour.
- [ ] **Brownfield** - extending or re-architecting an existing codebase. Cite the codebase reference: [path or repo URL].

**Selected:** Greenfield

**Justification (one line):** neither BRD names an existing codebase, and the REFUNDS BRD describes today's paper-and-phone process (SDD §1 Project Type).

**LLD direction taken:** from-sdd

<!-- MASTER: refunds-platform-lld-master.md | PREV: 16-references.md | NEXT: 18-open-items-and-clarifications.md -->

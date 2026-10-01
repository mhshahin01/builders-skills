<!--
CHUNK: 17
TITLE: Appendix & Wishlist
PROJECT: Refunds Platform
VERSION: 1.1
DEPENDS_ON: none
PART OF: SDD - Refunds Platform
-->

# 21. Appendix

| File / Reference | Description | Link |
|------------------|-------------|------|
| BRD-HLD | Source BRDs: Refunds Portal (REFUNDS) and Loyalty Points (LOYALTY) | [REFUNDS master](../brd-refunds-portal/refunds-portal-brd-master.md), [LOYALTY master](../brd-loyalty-points/loyalty-points-brd-master.md) |
| OpenAPI Specs | One OpenAPI document per module with REST endpoints (`refund`, `loyalty`) | [NEEDS CLARIFICATION: repository path] |
| Event Schemas | In-process event DTOs in each publishing module's `api` package; registry view in §14.10 | [§14.10](./10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core) |
| ADR Repository | The ADR table of this SDD | [§10](./06-principles-and-decisions.md#10-architectural-decisions) |
| Threat Model | Not yet written | [NEEDS CLARIFICATION: threat model owner and location] |
| Capacity Plan | §18 of this SDD | [§18](./14-performance-and-capacity.md#18-performance--capacity-planning) |
| Runbooks | §20 of this SDD | [§20](./16-operations-runbook.md#20-operations-runbook) |
| Diagrams Source | Inline Mermaid in the chunks; Figures index in chunk 00 | [Figures](./00-cover-and-changelog.md#table-of-contents) |

---

# 22. Wishlist

*Future architectural enhancements (beyond per-service "Future Enhancements")*

Business wishlist: [REFUNDS 12 § Wishlist](../brd-refunds-portal/12-appendix-and-wishlist.md#wishlist) and [LOYALTY 12 § Wishlist](../brd-loyalty-points/12-appendix-and-wishlist.md#wishlist). Platform-level additions:

1. Kafka backbone with a transactional outbox per extracted module, starting from the §14.10 DTOs, when an ADR-01 extraction trigger is met.
2. Extract `loyalty` as its own service if points redemption at checkout puts POS-facing latency and availability demands on it.
3. Payout results by CardPay callback, if CardPay supports it, to shorten the time from approval to Paid.

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 16-operations-runbook.md | NEXT: 18-open-items-and-clarifications.md -->

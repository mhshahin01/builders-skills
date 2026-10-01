<!--
CHUNK: 17
TITLE: Appendix & Wishlist
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: none
PART OF: SDD - Refunds Platform
-->

# 21. Appendix

| File / Reference | Description | Link |
|------------------|-------------|------|
| BRD-HLD (REFUNDS) | Refunds Portal BRD v1.0, source BRD | [refunds-portal-brd-master.md](../brd-refunds-portal/refunds-portal-brd-master.md) |
| BRD-HLD (LOYALTY) | Loyalty Points BRD v1.0, source BRD | [loyalty-points-brd-master.md](../brd-loyalty-points/loyalty-points-brd-master.md) |
| BRD references | Store refund policy v3, referenced by the REFUNDS BRD | [REFUNDS 12 § Appendix](../brd-refunds-portal/12-appendix-and-wishlist.md#appendix) |
| OpenAPI Specs | Contract-first specs of the core endpoints (§17.1, §17.4) | [NEEDS CLARIFICATION: repository path] |
| Event Schemas | JSON Schema subjects for the events of §14.9 | [NEEDS CLARIFICATION: schema registry location] |
| ADR Repository | The ADRs of this SDD | [§10](./06-principles-and-decisions.md#10-architectural-decisions) |
| Threat Model | Not written yet | [NEEDS CLARIFICATION: threat model owner and date] |
| Capacity Plan | Load, targets, and peak scenarios | [§18](./14-performance-and-capacity.md) |
| Runbooks | Operations procedures | [§20](./16-operations-runbook.md) |
| Diagrams Source | Inline Mermaid in the chunks; no Miro board | This folder |
| Provider documentation | The documents that complete the external contracts | [§15.6](./11-api-contracts.md#156-external-contracts-awaiting-the-user) |

---

# 22. Wishlist

*Future architectural enhancements (beyond per-service "Future Enhancements")*

Business wishlists are owned by the BRDs: [REFUNDS 12 § Wishlist](../brd-refunds-portal/12-appendix-and-wishlist.md#wishlist) and [LOYALTY 12 § Wishlist](../brd-loyalty-points/12-appendix-and-wishlist.md#wishlist). Platform-level additions:

1. Extract loyalty-service from the core when points redemption ships or a second team takes it over (ADR-01 trigger).
2. A long-term event archive and an analytics consumer on both topics (§14.2), which also enables replay beyond topic retention.
3. A second refund intake channel for online-shop purchases that reuses payout-service and notification-service unchanged.

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 16-operations-runbook.md | NEXT: 18-open-items-and-clarifications.md -->

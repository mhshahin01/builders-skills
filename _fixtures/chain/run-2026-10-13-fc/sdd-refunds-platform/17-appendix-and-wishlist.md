<!--
CHUNK: 17
TITLE: Appendix & Wishlist
PROJECT: Refunds Platform
VERSION: 1.3
DEPENDS_ON: none
PART OF: SDD - Refunds Platform
-->

# 21. Appendix

| File / Reference | Description | Link |
|------------------|-------------|------|
| BRD-HLD (REFUNDS) | Refunds Portal BRD, the source of the refund modules | [refunds-portal-brd-master.md](../brd-refunds-portal/refunds-portal-brd-master.md) |
| BRD-HLD (LOYALTY) | Loyalty Points BRD, the source of the loyalty module | [loyalty-points-brd-master.md](../brd-loyalty-points/loyalty-points-brd-master.md) |
| OpenAPI Specs | One OpenAPI document for `refunds-platform-app`, generated and checked in CI (ADR-04) | Not created yet |
| Event Schemas | DTO classes of the §14.10 events, with the fields and types §14.10 sets | Not created yet |
| ADR Repository | §10 of this SDD is the ADR register | [06 § Architectural Decisions](./06-principles-and-decisions.md#10-architectural-decisions) |
| Threat Model | Not written yet | Not created yet |
| Capacity Plan | §18 of this SDD | [14 § Performance & Capacity Planning](./14-performance-and-capacity.md#18-performance--capacity-planning) |
| Runbooks | §20 of this SDD | [16 § Operations Runbook](./16-operations-runbook.md#20-operations-runbook) |
| Diagrams Source | Inline Mermaid in the chunks; no Miro board | - |
| Store refund policy v3 | Named by REFUNDS; not attached ([REFUNDS 12 § Appendix](../brd-refunds-portal/12-appendix-and-wishlist.md#appendix)) | Not attached |

---

# 22. Wishlist

*Future architectural enhancements (beyond per-service "Future Enhancements")*

The business wishlists are [REFUNDS 12 § Wishlist](../brd-refunds-portal/12-appendix-and-wishlist.md#wishlist) and [LOYALTY 12 § Wishlist](../brd-loyalty-points/12-appendix-and-wishlist.md#wishlist). Platform-level additions:

1. Introduce the broker and the §14 hub when the first module is extracted (ADR-01 triggers), moving its in-process events to integration events with the outbox relay.
2. A read-model or reporting store if branch reporting grows beyond the one report.

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 16-operations-runbook.md | NEXT: 18-open-items-and-clarifications.md -->

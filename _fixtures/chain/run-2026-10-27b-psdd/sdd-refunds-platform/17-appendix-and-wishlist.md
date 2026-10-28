<!--
CHUNK: 17
TITLE: Appendix & Wishlist
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: none
PART OF: SDD - Refunds Platform
-->

# 21. Appendix

The BRD appendices are not restated: [REFUNDS 12 § Appendix](../brd-refunds-portal/12-appendix-and-wishlist.md#appendix) and [LOYALTY 12 § Appendix](../brd-loyalty-points/12-appendix-and-wishlist.md#appendix).

| File / Reference | Description | Link |
|------------------|-------------|------|
| BRD-HLD | The source BRDs: Refunds Portal v1.5 (REFUNDS) and Loyalty Points v1.7 (LOYALTY) | [refunds-portal-brd-master.md](../brd-refunds-portal/refunds-portal-brd-master.md), [loyalty-points-brd-master.md](../brd-loyalty-points/loyalty-points-brd-master.md) |
| Pre-SDD | The G3-signed Pre-SDD this SDD builds on (key `PSDD`), its SDD handoff guide | [refunds-platform-pre-sdd-master.md](../pre-sdd-refunds-platform/refunds-platform-pre-sdd-master.md), [12-sdd-handoff-guide.md § 12.2](../pre-sdd-refunds-platform/12-sdd-handoff-guide.md#122-locked-items) |
| OpenAPI Specs | One OpenAPI document per module's client-facing endpoints ([ADR-07](./06-principles-and-decisions.md#10-architectural-decisions)) | Repository path `api/openapi/`, written with the code |
| Event Schemas | The DTOs of the in-process events (§14.10) as Java records in each publishing module's published package | Repository path per module, written with the code |
| ADR Repository | The ADRs of this SDD (§10) and the Pre-SDD ADRs it cites | [§10](./06-principles-and-decisions.md#10-architectural-decisions), [PSDD 09 § 9.4 Pre-SDD ADRs](../pre-sdd-refunds-platform/09-decisions.md#94-pre-sdd-adrs) |
| Threat Model | Not written yet; the public edge's threat protection waits for [PSDD/SEC-03.1](../pre-sdd-refunds-platform/03e-register-security.md#sec-03) | - |
| Capacity Plan | §18, on the Pre-SDD's locked capacity entries | [§18](./14-performance-and-capacity.md#18-performance--capacity-planning) |
| Runbooks | §20 | [§20](./16-operations-runbook.md#20-operations-runbook) |
| Diagrams Source | Inline Mermaid in the chunks; no Miro board | This folder |

---

# 22. Wishlist

*Future architectural enhancements (beyond per-service "Future Enhancements")*

The business wishlists are not restated: [REFUNDS 12 § Wishlist](../brd-refunds-portal/12-appendix-and-wishlist.md#wishlist) and [LOYALTY 12 § Wishlist](../brd-loyalty-points/12-appendix-and-wishlist.md#wishlist). Platform items:

1. A message broker and integration events when a module is extracted ([ADR-01](./06-principles-and-decisions.md#10-architectural-decisions) trigger), turning the §14.10 events that cross the new boundary into §14.5 integration events.
2. A read model for a view across all 40 branches, once REFUNDS names its reader ([REFUNDS 09 § Reporting / Analytics](../brd-refunds-portal/09-reporting-and-analytics.md#reporting--analytics)).
3. A read-only customer care view of refund requests and of member points, once the BRDs add the persona and the access rule ([REFUNDS 04 § Personas / Actors](../brd-refunds-portal/04-scope-and-personas.md#personas--actors); [LOYALTY 12 § Wishlist](../brd-loyalty-points/12-appendix-and-wishlist.md#wishlist) item 3).

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 16-operations-runbook.md | NEXT: 18-open-items-and-clarifications.md -->

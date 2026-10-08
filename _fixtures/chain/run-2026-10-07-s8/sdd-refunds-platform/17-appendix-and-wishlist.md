<!--
CHUNK: 17
TITLE: Appendix & Wishlist
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: none
PART OF: SDD - Refunds Platform
-->

# 21. Appendix

BRD appendices: [REFUNDS 12 § Appendix](../brd-refunds-portal/12-appendix-and-wishlist.md#appendix) and [LOYALTY 12 § Appendix](../brd-loyalty-points/12-appendix-and-wishlist.md#appendix).

| File / Reference | Description | Link |
|------------------|-------------|------|
| BRD-HLD | The two source BRDs: Refunds Portal (REFUNDS) and Loyalty Points (LOYALTY) | [refunds-portal-brd-master.md](../brd-refunds-portal/refunds-portal-brd-master.md), [loyalty-points-brd-master.md](../brd-loyalty-points/loyalty-points-brd-master.md) |
| OpenAPI Specs | One OpenAPI document per module, for the endpoints of each 13x List of APIs (ADR-04) | [NEEDS CLARIFICATION: repository path of the OpenAPI documents] |
| Event Schemas | In-process DTO records in the code, catalogued in §14.10; no schema registry (ADR-02) | [10 §14.10](./10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core) |
| ADR Repository | The decisions of §10 | [06 §10](./06-principles-and-decisions.md#10-architectural-decisions) |
| Threat Model | [NEEDS CLARIFICATION: threat model owner and location] | - |
| Capacity Plan | §18 | [14](./14-performance-and-capacity.md) |
| Runbooks | §20 | [16](./16-operations-runbook.md) |
| Diagrams Source | Inline Mermaid in the chunks; the figures index is in chunk 00 | [00](./00-cover-and-changelog.md) |

---

# 22. Wishlist

*Future architectural enhancements (beyond per-service "Future Enhancements")*

Business wishlists: [REFUNDS 12 § Wishlist](../brd-refunds-portal/12-appendix-and-wishlist.md#wishlist) and [LOYALTY 12 § Wishlist](../brd-loyalty-points/12-appendix-and-wishlist.md#wishlist). Platform-level additions:

1. Extract modules into services with a broker (Kafka on-premises or SNS+SQS on AWS, per CLAUDE.md) when the ADR-01 extraction trigger is met; ports and in-process events are the seams.
2. Contract tests against each provider sandbox once the `TBD - external` contracts of §15.6 are filled.
3. A feed reconciliation job that compares POS Records purchases with loyalty movements, as a check on R-02.

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 16-operations-runbook.md | NEXT: 18-open-items-and-clarifications.md -->

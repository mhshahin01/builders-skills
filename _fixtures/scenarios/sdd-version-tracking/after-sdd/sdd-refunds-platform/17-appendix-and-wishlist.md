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
| BRD-HLD | Source BRDs: Refunds Portal (REFUNDS) and Loyalty Points (LOYALTY), at the versions in [00 § Document Lineage](./00-cover-and-changelog.md#document-lineage); BRD references such as the store refund policy stay in [REFUNDS 12 § Appendix](../brd-refunds-portal/12-appendix-and-wishlist.md#appendix) | [refunds-portal-brd-master.md](../brd-refunds-portal/refunds-portal-brd-master.md), [loyalty-points-brd-master.md](../brd-loyalty-points/loyalty-points-brd-master.md) |
| OpenAPI Specs | One OpenAPI document for the client-facing endpoints of the core (§17.1, §17.4) | [NEEDS CLARIFICATION: repository path] |
| Event Schemas | JSON Schema subjects per event in the schema registry (§14.9) | [NEEDS CLARIFICATION: registry location] |
| ADR Repository | ADR summary table | [06-principles-and-decisions.md](./06-principles-and-decisions.md) |
| Threat Model | [NEEDS CLARIFICATION: threat model owner and location] | - |
| Capacity Plan | Load estimates, targets, and peak scenarios | [14-performance-and-capacity.md](./14-performance-and-capacity.md) |
| Runbooks | Operations procedures | [16-operations-runbook.md](./16-operations-runbook.md) |
| Diagrams Source | Inline Mermaid in the chunks; figure index in chunk 00 | [00-cover-and-changelog.md](./00-cover-and-changelog.md) |

---

# 22. Wishlist

*Future architectural enhancements (beyond per-service "Future Enhancements")*

Business wishlists stay in the BRDs: [REFUNDS 12 § Wishlist](../brd-refunds-portal/12-appendix-and-wishlist.md#wishlist) and [LOYALTY 12 § Wishlist](../brd-loyalty-points/12-appendix-and-wishlist.md#wishlist). Architectural delta:

1. Extract loyalty-service into its own deployable when an ADR-01 trigger fires (a second team, or points redemption at checkout); it then consumes `REFUND_PAID` from Kafka, with `receiptNumber` added (§14.7).
2. A daily reconciliation between paid refunds and the payment provider's settlement records, once CardPay offers them, as evidence for REFUNDS/NFR-01 beyond idempotency.
3. An analytics subscriber on both topics if reporting grows beyond the daily branch report.

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 16-operations-runbook.md | NEXT: 18-open-items-and-clarifications.md -->

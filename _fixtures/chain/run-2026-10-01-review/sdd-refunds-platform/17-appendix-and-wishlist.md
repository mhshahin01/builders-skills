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
| BRD-HLD | Source BRDs: Refunds Portal (REFUNDS) and Loyalty Points (LOYALTY), with the versions this SDD reads in [00 § Document Lineage](./00-cover-and-changelog.md#document-lineage); BRD references such as the store refund policy stay in [REFUNDS 12 § Appendix](../brd-refunds-portal/12-appendix-and-wishlist.md#appendix) | [refunds-portal-brd-master.md](../brd-refunds-portal/refunds-portal-brd-master.md), [loyalty-points-brd-master.md](../brd-loyalty-points/loyalty-points-brd-master.md) |
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

1. Extract loyalty-service into its own deployable when an ADR-01 trigger fires (a second team, or points redemption at checkout, whose horizon [LOYALTY OI-13](../brd-loyalty-points/13-open-items-and-clarifications.md#oi-13-when-points-can-be-spent-and-what-the-retailer-owes) sets); it then consumes the PII-free paid-refund event of the §14.7 Extraction contract, with its cutover rule.
2. A daily reconciliation between paid refunds and the payment provider's settlement records, once CardPay offers them, as evidence for REFUNDS/NFR-01 beyond idempotency. [REFUNDS 12 § Wishlist](../brd-refunds-portal/12-appendix-and-wishlist.md#wishlist) item 4 gives it an owner (the product manager, with finance) and its trigger; whether paid refunds are also reported back to POS Records or finance is [REFUNDS OI-17](../brd-refunds-portal/13-open-items-and-clarifications.md#oi-17-what-a-paid-refund-must-update-outside-the-portal).
3. An analytics subscriber if reporting grows beyond the branch and head-office refund reports of REFUNDS 09, which refund-service serves from its own tables; it reads PII-free feeds only, because a new reader of the refund topic reopens ADR-10.

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 16-operations-runbook.md | NEXT: 18-open-items-and-clarifications.md -->

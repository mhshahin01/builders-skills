<!--
CHUNK: 12
TITLE: Appendix & Wishlist
PROJECT: Refunds Portal
VERSION: 1.2
DEPENDS_ON: none
PART OF: BRD - Refunds Portal
-->

# Appendix

| File Description | File (Attached) |
|-----------------|-----------------|
| The refund rules the branches follow today | Store refund policy v3 |
| Implementation plan of BRD v1.0. Reference input for chunk 15 once the delivery gate opens; not part of this BRD. | [15-implementation.md (BRD v1.0)](../source/brd-refunds-portal/15-implementation.md) |
| UAT/BAT test cases of BRD v1.0. Reference input for chunk 16 once the delivery gate opens; not part of this BRD. | [16-uat-bat-test-cases.md (BRD v1.0)](../source/brd-refunds-portal/16-uat-bat-test-cases.md) |

## Technical Inputs for the SDD

| Source Statement (verbatim) | Source Location | Relevant To |
|-----------------------------|-----------------|-------------|
| "Backend services must be built with Java 21 and Spring Boot." | SoW section 4.2 (TI-01) | SDD technology choices |
| "Use PostgreSQL for all data." | SoW section 4.2 (TI-02) | SDD data storage |

---

# Wishlist

*Next features (after future enhancements section of each use case)*

1. Refunds for online-shop purchases in the portal, replacing the separate system that handles them today.
2. A mobile app that alerts customers on their phone when a request changes status.
3. A customer care view of refund requests, so care staff can answer refund calls.

<!-- MASTER: refunds-portal-brd-master.md | PREV: 11-summary-and-uiux.md | NEXT: 13-open-items-and-clarifications.md -->

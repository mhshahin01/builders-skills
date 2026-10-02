<!--
CHUNK: 12
TITLE: Appendix & Wishlist
PROJECT: Refunds Portal
VERSION: 1.1
DEPENDS_ON: all
PART OF: BRD - Refunds Portal
-->

# Appendix

| Reference | Description |
|-----------|-------------|
| Store refund policy v3 | The refund rules the branches follow today |

## Technical Inputs for the SDD

> Source technical mandates, parked verbatim for the SDD. Not BRD requirements.

| # | Source | Mandate (verbatim) |
|---|--------|--------------------|
| TI-01 | SoW section 4.2 | "Backend services must be built with Java 21 and Spring Boot." |
| TI-02 | SoW section 4.2 | "Use PostgreSQL for all data." |

# Wishlist

Each item has an owner and a point at which its horizon is decided. Where no dependency sets one, the horizon is decided at the first monthly objectives review after every branch uses the portal (01 How the objectives are measured).

| # | Item | Owner | Trigger or horizon |
|---|------|-------|--------------------|
| 1 | Refunds for online-shop purchases (a separate system handles them today) | Product manager | Decided at the first monthly objectives review after every branch is live |
| 2 | Push notifications about a refund | Product manager | Needs a native app, which is not planned (UC-02) |
| 3 | Bulk approval of small refunds (UC-04) | Product manager | Decided at the first monthly objectives review after every branch is live |
| 4 | Checking paid refunds against the payment provider's settlement records | Product manager, with finance (13 / OI-17) | When the payment provider offers settlement records (02 Dependencies 1) |

<!-- MASTER: refunds-portal-brd-master.md | PREV: 11-summary-and-uiux.md | NEXT: 13-open-items-and-clarifications.md -->

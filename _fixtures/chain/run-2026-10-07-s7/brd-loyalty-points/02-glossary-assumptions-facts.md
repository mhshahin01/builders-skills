<!--
CHUNK: 02
TITLE: Glossary, Assumptions, Facts, Challenges & Dependencies
PROJECT: Loyalty Points
VERSION: 1.3
DEPENDS_ON: 01
PART OF: BRD - Loyalty Points
-->

# Glossary

| Term | Definition |
|------|-----------|
| BRD | Business Requirements Document: this document. |
| Branch | A shop where members make purchases. |
| CSV | Comma-separated values: a simple file format for table data that spreadsheet programs open. |
| Data Protection Officer | The person in the business who owns the data protection rules for members' personal data (NFR-07). |
| EUR | Euro, the currency of the purchases that earn points. |
| GDPR | General Data Protection Regulation: the European Union law on personal data (NFR-07). |
| Go-live | The date members start to use Loyalty Points. |
| Member | A customer who joined the loyalty program. |
| Member number | The number that identifies a member. The Customer Accounts team gives it when the member joins (chunk 08). |
| NFR | Non-functional requirement: a quality the business expects, such as accuracy (chunk 10). |
| Points | Credit a member earns on branch purchases (earning rule in chunk 03). |
| Points balance | The number of points a member has now (chunk 03). |
| Points movement | One change to a member's points balance (chunk 03). |
| POS | Point of sale: where a branch records a purchase. |
| POS Records | The record of member purchases made at branch points of sale. It tells this product which purchases earn points (chunk 08). |
| Purchase reference | The identifier of a branch purchase. |
| Refund reference | The identifier of a refund. |
| Refunds Portal | The product where purchases are refunded. It tells this product when a refund is paid. |
| SDD | Solution Design Document: the technical design that follows this BRD. |
| UC | Use case: one goal a persona reaches with the product (chunks 05, 06a, and 06b). |
| UI/UX | User interface and user experience: what members and the Loyalty Administrator see on the screens and how the screens behave (chunk 11). |
| WCAG | Web Content Accessibility Guidelines: the international standard for making screens usable by people with disabilities (NFR-06). |

---

# Assumptions / Constraints

1. **Same-day purchases**; Every branch closes by 21:00 (branch local time). POS Records reports every member purchase to this product by 22:00 (branch local time) on the day it is made.
2. **Unique references**; POS Records and the Refunds Portal never reuse a purchase reference or a refund reference. The Refunds Portal names the refunded purchase by its POS Records purchase reference.
3. **Refund reports**; The Refunds Portal reports a paid refund to this product within 15 minutes of payment.

---

# Facts

The facts that drive this BRD are stated where they apply: the earning rule in chunk 03 (Movement types), and the outside systems in Dependencies below and in chunk 08.

---

# Challenges

1. Members trust the balance only if POS Records and the Refunds Portal report purchases and refunds completely and on time (NFR-01, NFR-02, NFR-03).
2. Members who held points before go-live expect the same balance after go-live (Opening balance, chunk 03).

---

# Dependencies

| Dependency | Type | Owner | Status | Needed before | Notes |
|-----------|------|-------|--------|---------------|-------|
| Refunds Portal | Hard | Finance team | Confirmed | Build of UC-02 | Provides refund outcomes. |
| Points balances at go-live | Hard | Marketing team | Confirmed | Go-live | Gives each member's points at the start of the go-live date. |
| Member sign-in and membership | Hard | Customer Accounts team | Confirmed | Build of UC-01 | Lets members sign in, tells this product which member is signed in, and tells it when a member leaves or rejoins the program. |
| POS Records | Hard | See chunk 08, Integrations | Confirmed | Build of UC-01 | Sends the member purchases that earn points. |
| Staff sign-in | Hard | Retail IT team | Confirmed | Build of UC-03 | Lets Loyalty Administrators sign in, and tells this product which staff member is signed in and whether they hold the Loyalty Administrator role. |

<!-- MASTER: loyalty-points-brd-master.md | PREV: 01-executive-summary-and-context.md | NEXT: 03-definitions-and-domain-concepts.md -->

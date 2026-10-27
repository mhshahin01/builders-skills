<!--
CHUNK: 04
TITLE: Project Scope & Personas
PROJECT: Refunds Portal
VERSION: 1.4
DEPENDS_ON: 01
PART OF: BRD - Refunds Portal
-->

# Project Scope

Customers request refunds online and follow them until the money is back on their card. Branch managers decide on each request for their branch. Customers are told about their request as [03 / Customer messages](./03-definitions-and-domain-concepts.md#customer-messages) sets out.

**[NEEDS CLARIFICATION: After go-live, do branches still accept refund requests in person, and if so, are those requests recorded in the portal?]**

**[NEEDS CLARIFICATION: What happens to paper refund requests that are still open on the go-live day?]**

The portal starts in a pilot group of branches. The other branches start after the pilot. Until a branch starts, it handles refund requests as it does today. **[NEEDS CLARIFICATION: Which branches form the pilot group?]** **[NEEDS CLARIFICATION: How long does the pilot run before the other branches start?]** **[NEEDS CLARIFICATION: After the pilot, do the other branches start all on one day or in groups, and in what order?]**

The Refunds Portal can go live on its own date: it does not wait for Loyalty Points. Until Loyalty Points starts, the portal keeps the outcome of each refund request and sends the kept outcomes to Loyalty Points when it starts ([08 / Loyalty Points](./08-integrations.md)).

## In Scope

- Online refund requests for purchases made in branches.
- Customers follow and cancel their own refund requests ([06a / UC-02, UC-03](./06a-use-cases-customer.md)).
- Refund decisions by branch managers, in full or in part.
- Payout to the customer's original card.
- Customer messages by email and SMS.
- Telling Loyalty Points the outcome of each refund request ([08 / Loyalty Points](./08-integrations.md)).
- A daily refund report for each branch manager ([09 / Reporting / Analytics](./09-reporting-and-analytics.md#reporting--analytics)).

## Out of Scope

- Refunds for online-shop purchases: a separate system handles them.
- Cash refunds.
- A customer mobile app. It is on the [12 / Wishlist](./12-appendix-and-wishlist.md#wishlist).

---

# Personas / Actors

| Persona | Role | Key Goals | Access Level |
|---------|------|-----------|-------------|
| Customer | Buyer who wants money back | Request a refund and know where it stands | Own requests only |
| Branch Manager | Runs one branch | Decide on each refund request for the branch within the decision time in UC-04 | Own branch only |

**[NEEDS CLARIFICATION: Which team handles payouts that stop or keep failing, records by hand whether such a payout was paid, and checks every month that no payout is missing or paid twice?]**

**[NEEDS CLARIFICATION: Do customer care agents, who receive the complaints about refunds, get a read-only view of a customer's refund requests? A yes adds a persona and changes who may see a request under NFR-04.]**

<!-- MASTER: refunds-portal-brd-master.md | PREV: 03-definitions-and-domain-concepts.md | NEXT: 05-user-journeys-overview.md -->

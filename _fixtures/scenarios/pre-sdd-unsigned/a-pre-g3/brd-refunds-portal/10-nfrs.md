<!--
CHUNK: 10
TITLE: Non-Functional Requirements
PROJECT: Refunds Portal
VERSION: 1.4
DEPENDS_ON: 01
PART OF: BRD - Refunds Portal
LANGUAGE: Business language only. State WHAT quality the business expects (highly available, scalable, fast, secure) and how the business would recognise it. HOW it is achieved (architecture, clustering, replication, technology) is owned by the SDD.
-->

# Non-Functional Requirements

| NFR ID | Quality | Business Expectation (the what) | Business Measure |
|--------|---------|--------------------------------|------------------|
| NFR-01 | Payout accuracy | Refund money is never lost or paid twice. | Zero missing or duplicate payouts per month. A payout that the system is still trying again under [06b / UC-04 E1](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) at the end of a month counts as delayed, not missing. A payout that waits for a card dispute under [06b / UC-04 BR-8](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) at the end of a month counts as waiting, not missing. |
| NFR-02 | Availability | Customers can use the portal at any time. | No more than 2 hours of disruption a month. Planned maintenance counts toward the 2 hours. |
| NFR-03 | Scalability | The portal copes with seasonal sales. | 3 times the normal number of requests for 3 weeks, while still meeting NFR-05. |
| NFR-04 | Security & Privacy | Customer personal data is protected. | Only the customer and their branch's manager can see a request, plus the staff who record or confirm a payout result by hand ([03 / Decision record](./03-definitions-and-domain-concepts.md#decision-record)), and anyone the answers to the open questions in [03 / Branch ownership](./03-definitions-and-domain-concepts.md#branch-ownership), [03 / Decision record](./03-definitions-and-domain-concepts.md#decision-record), [04 / Personas](./04-scope-and-personas.md#personas--actors) (the payout team and customer care), [06b / UC-04 BR-4](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund), [06b / UC-04 BR-6](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) and [06b / UC-04 BR-7](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) allow to see it. Customer personal data is handled as **[NEEDS CLARIFICATION: Which data-protection law applies to customer personal data in the portal?]** requires. |
| NFR-05 | Performance | Customers and branch managers do not wait on the portal during everyday actions: entering a receipt number, submitting a request, opening a request list. | Each everyday action completes within **[NEEDS CLARIFICATION: Within how many seconds must an everyday action in the portal complete?]** seconds. |
| NFR-06 | Data retention | Refund records and customer personal data are kept only as long as the business needs them. | Refund requests, decisions and payout results are kept for **[NEEDS CLARIFICATION: For how long must refund requests, decisions and payout results be kept?]**. Customer contact details are kept for **[NEEDS CLARIFICATION: For how long may customer contact details be kept after a refund request ends?]**. |
| NFR-07 | Tax and accounting records | Every paid refund is recorded as the tax law and the business's accounts require. | Every paid refund has the refund document and the records that the tax law of **[NEEDS CLARIFICATION: In which countries do the branches operate?]** requires. **[NEEDS CLARIFICATION: Which refund document (for example a credit note) must the customer receive?]** **[NEEDS CLARIFICATION: Must each refund be recorded in a fiscal register or in the branch's accounts?]** |

> The technical realisation of each NFR (targets like uptime percentages, latency budgets, capacity plans, and the architecture that achieves them) is defined in the SDD, not here.

<!-- MASTER: refunds-portal-brd-master.md | PREV: 09-reporting-and-analytics.md | NEXT: 11-summary-and-uiux.md -->

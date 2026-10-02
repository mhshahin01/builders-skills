Reviewer: BO
Concern: Loyalty launch rests on two "Confirmed" dependencies the SDD shows are unverified
Where: LOYALTY 02 § Dependencies; SDD 13d §17.4 Business Logic (Earn points); SDD 01 §3 assumption 3, §4 R-03
Why: LOYALTY 02 marks two dependencies as Confirmed: POS Records reporting purchases on the same day, and member sign-in. LOYALTY 15 then plans every task with "Assumption: none". The SDD shows neither interface exists yet. API-04 is TBD - external, and nobody knows whether POS Records can send a receipt number with each member purchase (R-03). SDD 13d rejects every purchase record that has no receipt number, so if POS Records cannot send it, no member earns a single point. R-03 is still rated M impact with no owner. Member sign-in is just as open: assumption 3 does not say whether members use an account in the platform's realm or are brokered from the loyalty program's own identity provider. The SDD decision log notes that this marker sits outside the chunks its e2e gate reads, so nothing waits on it. Two unknowns that can block launch sit behind a "Confirmed" label, and nobody is chasing them.
Direction: 1) Downgrade both rows to "To confirm" with an owner and a date, and make written confirmation from POS Records and the loyalty identity owner a LOYALTY launch gate.
2) Re-rate R-03 to High impact and agree the match key with POS Records before build starts.

Reviewer: BO
Concern: No cutover plan for existing loyalty members' points
Where: LOYALTY 01 § Business Objectives 2; LOYALTY 04 § Out of Scope; SDD 13d §17.4 Input and Tables Design (`points_movement`)
Why: Objective 2 says members should check their points "without calling a branch", and 04 says members already have a loyalty program account. Both suggest members hold points today. Neither BRD says whether those balances carry over, which system holds the official balance after go-live, or from which purchase date points are earned. The SDD ledger has only EARNED and TAKEN_BACK movements and imports purchases from a cursor with no start date. On launch day members may see 0, or a figure that contradicts what branches told them. That is the opposite of Objective 1 (members trust their balance) and breaks NFR-01's zero-upheld-complaints target immediately. Refunds of purchases made before launch would also wait forever as pending take-backs (SDD 13d). If no points exist today, the BRD should say so, because Objective 2 reads otherwise.
Direction: 1) Add a cutover requirement: the opening balance per member (migrated or reset, and how members are told), the earning start date, and what happens to today's points record.
2) Decide whether the existing program stays the official ledger, which would change the LOYALTY scope.

Reviewer: BO
Concern: Approved refunds can stay unpaid forever when the original card cannot be credited
Where: REFUNDS 02 § Assumptions / Constraints 2; SDD 13b §17.2 Business Logic (After the retry window); REFUNDS 06b UC-04 E1
Why: Payouts may only go to the original card, and cash refunds are out of scope (REFUNDS 04). When a card can no longer be credited (for example, it was closed or replaced), the provider refuses for good and the design retries every 6 hours with no end. There is no manual retry, alternative payout, voucher, or way to close the request, and the branch manager who is "told" has nothing to do. The retailer then owes money it cannot pay. That debt grows and nobody reports it, and the customer stuck in Approved calls customer care, which is exactly the complaint this product exists to remove (REFUNDS 01). The SDD logged "an end for a payout the provider refuses for good" as a follow-up for the REFUNDS owner (decision-log CL-09), but REFUNDS 13 has no open item for it.
Direction: 1) Add an exception path to UC-04 (an alternative payout, or settlement at the branch after a set period) with a named business owner.
2) Report approved-but-unpaid amounts and how long they have been waiting to finance.

Reviewer: BO
Concern: Refunds made outside the portal never take points back
Where: LOYALTY 06a UC-02 BR-1; SDD 13a §17.1 Business Logic (Receipt lookup); REFUNDS 06a UC-01 E1
Why: LOYALTY 01 promises points are taken back after "a refund of that purchase". BR-1, however, only reacts to refunds the Refunds Portal reports as paid. The portal sends whole groups of refunds back to the branch: purchases older than 30 days (REFUNDS UC-01 E1), receipts with no card payment, and the part of a mixed card-and-cash purchase above its card-paid amount (SDD 13a). Branch refunds never reach Loyalty Points, so members keep the points on refunded purchases. A member can pay cash, earn points, get a cash refund at the branch, and keep the points. NFR-01 only counts upheld member complaints, and members who were over-credited do not complain, so the loss stays invisible. Neither BRD estimates how many refunds stay in branches.
Direction: 1) Require every refund channel (branch, cash, late) to report refunds to Loyalty Points, or state the accepted loss and who owns it.
2) Add a measure of points not taken back on refunded purchases next to NFR-01.

Reviewer: BO
Concern: The biggest outside dependencies (CardPay, POS Records, shared platform) have no owner and no launch gate
Where: SDD 01 §4 R-02, R-04 (Owner column); REFUNDS 02 § Dependencies 1; SDD 01 §3 assumption 11
Why: None of the six SDD risks has an owner, including the three that can stop the business. CardPay is the only payout route and a hard dependency. Its ability to refund the original card, whether it honours an idempotency key (a key that makes a retried request safe), and how it returns results are all unconfirmed (R-02, SDD 11 §15.6), and its fees appear in no document. Even so, REFUNDS 14 shows the delivery gate open with "Next action: None". POS Records, run by one internal team, is Critical to both products, and a single outage stops new refund requests and loyalty earning together (R-04). The platform assumes a shared on-prem team runs Kafka, Keycloak, PostgreSQL, and Kubernetes (assumption 11), but no service level backs REFUNDS/NFR-02's 2-hour monthly budget. Both products also share one core deployable and one release cycle (SDD 06 ADR-01), and the escalation paths to all three providers are blank (SDD 16 §20.3).
Direction: 1) Name an owner for each risk, and make a signed CardPay agreement (capability, idempotency, settlement data, fees, sandbox) a gate in REFUNDS 02 and 14.
2) Get service levels from the Retail IT team and the platform team that fit the NFR-02 budget, or use the ADR-01 re-open trigger the SDD already defines.

Reviewer: BO
Concern: Build is going ahead on unsigned scope while owner decisions sit outside the BRD registers
Where: LOYALTY 00 § Changes Log (v1.1, v1.2); SDD 00 cover (Status, Reviewers, Approvers); SDD decision-log § Clarification register (OI-13, OI-14, OI-19, CL-02, CL-03, CL-05, CL-09, CL-22) vs REFUNDS 13 § Open Items and LOYALTY 13 § Open Items
Why: LOYALTY v1.1 widened the scope (earning points is now in scope, TD-04) and changed the take-back rules, but neither v1.1 nor v1.2 has an approver. The SDD is a Draft with no reviewers or approvers. Even so, the LOYALTY implementation plan and UAT suite, the SDD's end-to-end chunk, and a child LLD have all been produced from these versions. The SDD decision log notes that the BRD's In Review status is something the generator "does not gate on". The SDD has also handed at least ten business decisions back to the BRD owners: the card-only rule, a second receipt check, till returns and voids, an end for a refused payout, staff alerts, retention values, the staff administrator, and a signal when a member leaves. None of them appears in REFUNDS 13 or LOYALTY 13, both of which read as closed, and REFUNDS 14 says "Next action: None". Build can start on scope the Head of Retail never signed, with owner decisions nobody is tracking.
Direction: 1) Make BRD sign-off (LOYALTY v1.1 onward) and SDD approval explicit gates before the LLD and the build.
2) Copy each SDD follow-up into the owning BRD's chunk 13 as an open item with an owner and a due date.

Reviewer: BO
Concern: Legal clearances that can stop go-live are not listed as dependencies
Where: REFUNDS 02 § Dependencies; LOYALTY 02 § Dependencies; SDD 13a §17.1 Compliance; SDD 13b §17.2 Compliance
Why: Neither BRD's dependency list holds a legal item. The SDD leaves the GDPR lawful basis to "the one the retailer's data protection owner records". It sets a 10-year record retention that exists only to prevent an early purge (decision-log CL-05). It leaves the card-security (PCI DSS) scope to be "confirmed with CardPay". No document mentions a data processing agreement or where MsgHub and CardPay process data, although they receive customer contact details and payment references. For loyalty, the program rules (whole-euro earning, points taken back after refunds: LOYALTY 03, UC-02 BR-1 to BR-4) may differ from what members of the existing program agreed to. Nothing checks the program terms, and nothing tells members when points are taken back. Any of these can block go-live after the build is finished.
Direction: 1) Add a legal-clearance list to both 02 chunks (lawful basis, processor agreements and data location, retention periods, PCI scope, loyalty terms) with owners and dates.
2) Add legal sign-off as a condition of each BRD's delivery gate.

Reviewer: BO
Concern: The platform is built for multiple retailers with no commercial model or cost case
Where: SDD 01 §3 assumption 7; SDD 06 ADR-03; SDD 12 §16.2
Why: Neither BRD mentions another retailer, brand, resale, or white-label offer. Yet the SDD makes the platform multi-tenant (one platform serving several retailers) "by platform rule" and pays for it throughout. It adds a separate host and sign-in client per tenant (SDD 12 §16.2), per-tenant settings and database-level isolation (SDD 07 §11.2), and per-tenant monitoring (SDD 07 §11.4), and defers some choices until "a second tenant" (ADR-10). The rule makes the cost certain, but the return is undefined. There is no pricing, packaging, onboarding cost (each tenant needs a host, a client, and a redeploy), tenant contract or service level, or per-tenant branding (SDD 02 §6 asks for a single brand colour). Running costs that any business case needs are never estimated: up to 21,600 customer messages a month at peak (SDD 14 §18.1), CardPay fees, and three databases plus Kafka.
Direction: 1) State in the BRDs why the platform serves multiple tenants (group brands, resale, white-label), with pricing, packaging, and onboarding requirements.
2) Add a running-cost estimate (messaging, payout fees, share of the platform) to the funding decision.

Reviewer: BO
Concern: The loyalty release has no business outcome, no redemption date, and no view of what the points cost
Where: LOYALTY 01 § Business Objectives; LOYALTY 04 § Out of Scope; LOYALTY 09
Why: Both objectives are about seeing a balance. Neither says why the retailer funds points (repeat visits, more spending, keeping customers, fewer calls to branches), and neither gives a starting baseline. Redemption, the only use for points the BRD names, is deferred to "a later phase" with no reason, no date, and no link to the objectives, so members are asked to trust a balance they cannot spend. Reporting is "Not applicable", so finance gets no figure for points issued, outstanding, or taken back, which is the amount the retailer owes members. Member and purchase volumes are unknown (SDD 14 §18.1), so neither the value nor the cost of the program can be sized. The SDD also adds a per-tenant earn rate that the BRD does not have. It sits in deployment settings with no business owner and no effective date (SDD 07 §11.2). Take-backs use the rate in force on the refund date (SDD 13d §17.4), so any rate change or promotion takes back a different number of points than were earned.
Direction: 1) Add one outcome objective with a baseline, and a dated redemption phase with the reason it comes after this release.
2) Add a report for finance on points owed to members, and put the earn rate under business ownership, fixed for each purchase.

Reviewer: BO
Concern: The headline 3-day objective is neither reported to management nor managed
Where: REFUNDS 01 § Business Objectives 1; REFUNDS 09 § Reporting / Analytics; REFUNDS 06b UC-04 Business Rules & Constraints
Why: The case for the portal is Objective 1 (from 10 days down to 3) and the 18% share of complaints. The only report goes to each branch manager and shows time to decision, not time to payout. Nobody above a branch sees anything: not the Head of Retail who approved the BRD, not finance, not customer care. The only time-to-payout figure is an operations metric (SDD 13a Metrics). The target is not managed either. UC-04 sets no decision deadline and no escalation for requests that sit too long. It has no deputy cover, because a manager account serves exactly one branch (SDD 01 §3 assumption 2). It also has no amount above which a second approver is needed, so one manager can pay out any sum. The owner cannot show the objective is met, cannot act when a branch misses it, and has no limit on how much money one decision can pay out.
Direction: 1) Add a head-office report: time to payout by branch, complaint trend against the 18% baseline, and approved and paid amounts.
2) Add a decision deadline with escalation or deputy cover, and an approval limit above which a second approver is needed.

Reviewer: BO
Concern: No customer-care role; complaints can only be investigated through emergency access to production data
Where: REFUNDS 04 § Personas / Actors; REFUNDS 10 NFR-04; LOYALTY 10 NFR-01; SDD 12 §16.4.3
Why: Customer care is where the problem shows up (18% of its complaints, REFUNDS 01) and where LOYALTY/NFR-01 is judged (zero upheld balance complaints). Yet neither BRD has a customer-care or back-office persona. REFUNDS/NFR-04 lets only the customer and the branch manager see a request, and the SDD confirms there is no operator role. The only way to look at a customer's refund or a member's points ledger is time-limited, audited emergency access to production data (break-glass, SDD 16 §20.3). Agents will either answer blind or open emergency access for routine calls. The complaint objective cannot be measured, the cost of support is unknown, and LOYALTY 16 already relies on a complaint log (P7) that no requirement creates.
Direction: 1) Add a read-only customer-care persona and use cases (find a refund by reference, view a member's movements), and amend NFR-04 to allow it.
2) Define who upholds a balance complaint, how it is logged, and the response time.

Reviewer: BO
Concern: No rollout plan for 40 branches, and a paper channel remains by design
Where: SDD 01 §4 R-01; REFUNDS 15 § Waves; REFUNDS 01 § Business Objectives 2
Why: REFUNDS 15 only orders the build tasks. It has no pilot, no branch-by-branch waves, no cut-over date, and no branch training. Nothing tells customers the portal exists or that they must register themselves (SDD 12 §16.6). There is no list of languages, and the SDD supports only one language setting per tenant (SDD 07 §11.2). Nothing stops a launch during the 3-week seasonal peak (REFUNDS 02 Facts 2). The risk that branches keep using paper (R-01) has no mitigation and no owner, and it is partly built into the design. Purchases older than 30 days and receipts with no card payment are sent back to the branch (REFUNDS 06a UC-01 E1, SDD 13a §17.1), so Objective 2 ("every request is recorded and visible to the customer") cannot hold for them. Launching everywhere at once while a paper channel remains puts both refund objectives at risk together.
Direction: 1) Add a rollout plan (pilot branches, waves, training, customer communication, languages, no launch just before seasonal sales) with an owner for R-01.
2) Either record branch-handled refunds in the portal, or restate Objective 2 so it covers the portal channel only.

<!--
CHUNK: 18
TITLE: Open Items & Clarifications
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: all preceding SDD chunks (00 through 17)
GATES: chunk 19 (End-to-End System Design). Chunk 19 is written only after every item here is resolved: Accepted - applied, Adjusted - applied, or Rejected. Open, Deferred, and Decided - pending application items keep the gate shut (SKILL.md step 8b). A status outside the Status legend below counts as `Open`: the gate treats the item as not closed, and the next acceptance loop presents it.
PART OF: SDD - Refunds Platform
PURPOSE: Output of the post-generation cleared-context reviewer pass. Captures architecture-level gaps, missing scenarios, integration corner cases, ADR ambiguities, and cross-chunk contract mismatches flagged by an independent reviewer. Every item carries a concrete Recommended Answer, ready to be applied to the SDD body once the architect accepts it.
GENERATED_BY: sdd-unifier post-generation reviewer (cleared-context subagent run after the main SDD body is complete). After that review, the author appends only the open items the skill's rules tell it to raise: the derivation's and each project-file conflict (SKILL.md step 7), text an applied decision makes wrong that needs a choice (step 8 item 3), a source-chunk problem found by the chunk 19 faithfulness check that a chunk 19 claim depends on or that lies in text the request changed (step 8b), an open remainder of a business review decision that is a design choice left to the SDD owner (step 10), a last-pass discovery decided for later application (step 8), a gap found while writing the deck brief (step 8c), and a disagreement with a locked item of the loaded Pre-SDD, owned by the E2E Architect (principle 20).
SCOPE: The reviewer reads ALL preceding chunks. Contract-consistency findings are first-class: topic names, event names, payload fields, and consumer lists that diverge between the Centralized Event Hub (chunk 10), the per-service chunks (13x), the Centralized User Roles catalogue (chunk 12), and the Service Integration API Contracts (chunk 11) are valid OI items. The End-to-End System Design (chunk 19) does not exist yet when the first review runs; it is written after this chunk is cleared.
WORKFLOW: After this chunk is written, the skill walks the user through each open item and asks them to accept, adjust, defer, or reject the Recommended Answer (an answer policy the user set for the run accepts the recommendations it may: SKILL.md step 8, Answer policy). Accepted answers are applied to the referenced chunk(s), the item gets its Resolution Log row, and the change joins the update's Changes Log row (SKILL.md § Output conventions, Versions).
-->

# 23. Open Items & Clarifications

> **What this section is.** A structured backlog of architectural concerns identified after the main SDD was authored, by a reviewer running with cleared context. Each item comes with a **Recommended Answer** - a concrete, ready-to-apply resolution. Items are decisions awaiting the architect's acceptance: accept the recommendation (or adjust it), and it gets reflected into the SDD body.
>
> **What this section is not.** It is not a list of inline `[NEEDS CLARIFICATION: ...]` markers found in the body - those remain inline. This section is the reviewer's *external* findings: gaps the body did not mark, scenarios the body did not consider, corner cases the body did not test for, and contract inconsistencies between the centralized catalogues (chunks 10, 11, 12) and the per-service chunks they consolidate.

---

## How to read each item

| Field | Meaning |
|-------|---------|
| **ID** | OI-NN. Stable across revisions. |
| **Where** | Section number (e.g., §6, §17.1), service name, or "global" if cross-cutting. |
| **Type** | Architecture gap / Missing scenario / Corner case / Ambiguity / Risk / Inconsistency / NFR shortfall / ADR needed / Contract mismatch (topic, event, payload, consumer list, or role/permission divergence across chunks) / Duplication (BRD content or another chunk's content restated instead of referenced). |
| **Owner** | Only on an item that disagrees with a locked item of the loaded Pre-SDD (SKILL.md principle 20): `E2E Architect (pre-sdd-unifier)`. The item cites the locked item as `PSDD/<ID>` and names its handoff request (`HR-NNN`). It is shown in the acceptance loop but not decided there; it stays `Open`, and keeps the gate shut like any other open item, until the E2E Architect answers ("Pre-SDD has a new version", SKILL.md step 10). Other items have no Owner line. |
| **Concern** | One paragraph. What was missed and why it matters for downstream LLD or implementation. |
| **Options** | At least 2 concrete choices, each with a one-line tradeoff. |
| **Recommended Answer** | The reviewer's concrete proposed resolution, written as ready-to-apply SDD content (the exact row, decision, sub-section, or wording that would close the item). This is what gets injected into the body when accepted. |
| **Why** | REQUIRED. One or two lines: the reason the recommended option wins over the alternatives - the evidence behind it (BRD requirement, NFR, doctrine/CLAUDE.md default, operational risk avoided) and the tradeoff being accepted. Never empty, never "best option". |
| **Status** | Open (awaiting decision) / Decided - pending application (decision, decider and date in the item; the next request applies it) / Accepted - applied / Adjusted - applied / Deferred (with rationale) / Rejected. A status outside this legend counts as `Open`: the gate treats the item as not closed, and the next acceptance loop presents it. |
Write the Status field as the literal legend value, for example `- **Status:** Accepted - applied`. Put the update or Resolution Log link on a separate `- **Resolution:**` line. Put rationale and decision metadata on their own lines; do not append punctuation, links, or explanation to a closed Status value.

---

## Open Items

### OI-01: The notification listener calls back the publisher's port, against ADR-03 and AP-03

- **Where:** §10 ADR-03, §9 AP-03, §8.5.1, §17.3 (notification), API-03
- **Type:** Inconsistency
- **Concern:** ADR-03 How states "no port call is made from inside an event listener that its target module published", and AP-03 states "a listener never calls back the publisher synchronously in the same flow". Yet the notification module's listener for `RefundRequestSubmitted`, `RefundRequestApproved`, and the other refund-request events calls `CustomerContactPort.findContact` on refund-request, the publisher of those events ([§17.3](./13c-service-notification.md#173-notification) Business Logic and its service-internal sequence `L->>RR: API-03 findContact`; [§8.5.1](./05-workflows-and-sequences.md#851-sequence-submit-a-refund-request); [API-03](./11-api-contracts.md#api-03-customer-contact-lookup-notification---refund-request) error `ContactLookupUnavailable`: "Roll back the listener; it is redelivered"). The outbox relay then reads the same contact a second time at send time. The design breaks its own coupling rule, an LLD cannot tell which text wins, and the listener's read duplicates the relay's.
- **Options:**
  - **A.** Move the contact read out of the listener: the listener writes the message and outbox rows from the event alone, and only the outbox relay (not an event listener) reads the contact through API-03 at send time - keeps ADR-03 and AP-03 as written and removes the duplicate read; a message for a missing contact is created and then skipped.
  - **B.** Amend ADR-03 and AP-03 to allow read-only port queries to the publisher from a listener - no flow change, but weakens the rule that keeps listeners free of publisher coupling, and keeps two reads per message.
- **Recommended Answer:** Option A. In [§17.3](./13c-service-notification.md#business-logic) Business Logic replace "reads the request's contact details through [API-03](./11-api-contracts.md#api-03-customer-contact-lookup-notification---refund-request), and in one transaction writes a `message` row per channel and a `message_outbox` row per message" with: "writes, in one transaction, a `message` row per channel of the message rule and a `message_outbox` row per message, keyed by the event ID and the channel so a redelivered event creates no second message; the listener reads no contact detail. The relay reads the request's contact details through [API-03](./11-api-contracts.md#api-03-customer-contact-lookup-notification---refund-request) at send time; a channel with no contact, or a contact purged under [PSDD/DAT-06.1](../pre-sdd-refunds-platform/03d-register-data.md#dat-06), sets the message to `SKIPPED` with no call to MsgHub." Add `SKIPPED` to `message.status` (`PENDING`, `SENT`, `FAILED`, `SKIPPED`). Remove the listener's API-03 call from the §17.3 flow chart and service-internal sequence, and in [§8.5.1](./05-workflows-and-sequences.md#851-sequence-submit-a-refund-request) move `NT->>RR: API-03 CustomerContactPort.findContact` to the relay, after the outbox row is written. In API-03 Errors raised, set the consumer action of `ContactLookupUnavailable` to "The relay leaves the outbox row unprocessed and retries per §12 INT-02" and of `RefundRequestNotFound` to "The relay sets the message `SKIPPED`". In the §17.3 Integrations row for refund-request set Failure Handling to "A port failure leaves the outbox row for the relay's next attempt".
- **Why:** ADR-03 and AP-03 are the platform's coupling rules and option A satisfies them as written while dropping a redundant read; B keeps two reads and relaxes a rule the other modules rely on. The tradeoff accepted is a message row created for a request whose contact may be missing, which the `SKIPPED` status records.
- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log)

---

### OI-02: The monthly payout check reads refund-request data with no port

- **Where:** §17.2 (payout) Input and Business Logic, §15.2, §16.4.3, §16.11
- **Type:** Architecture gap
- **Concern:** The [§17.2](./13b-service-payout.md#input) Input row of `payout-reconciliation-monthly` says it "checks that every Paid request of the past month has exactly one succeeded payout", which needs refund-request's statuses, while AP-04, ADR-04, and the §6 rules forbid cross-schema reads and §15 defines no port for it. The [§17.2](./13b-service-payout.md#business-logic) Business Logic paragraph instead compares only payout-owned succeeded payouts with CardPay Ltd's record, which cannot find the "missing" case of [REFUNDS/NFR-01](../brd-refunds-portal/10-nfrs.md#non-functional-requirements): an approved refund that never got a payout row (for example a `RefundRequestApproved` listener that kept failing). The two texts describe different checks, and the one that measures the NFR has no contract.
- **Options:**
  - **A.** Add an `Internal (in-process)` port, API-09, from payout to refund-request that lists the refunds approved in a period - finds missing payouts with a one-hop read from a scheduled job (not a listener); adds a module identity and a permission token.
  - **B.** Keep the check on payout data and CardPay Ltd's record only, and drop the "every Paid request" claim - no new contract, but a payout that was never created stays invisible to the REFUNDS/NFR-01 check.
- **Recommended Answer:** Option A. Add to §15.2: "| API-09 | Approved refunds of a period | payout | refund-request | Internal (in-process) | `RefundOutcomePort.listApprovedRefunds` | [13b § Integrations](./13b-service-payout.md#integrations) | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | Defined |". Add to §15.3 the block "API-09: Approved refunds of a period (payout -> refund-request)": Type `Internal (in-process)`; Purpose: give the monthly payout check every refund request approved in a period with its current status ([REFUNDS/NFR-01](../brd-refunds-portal/10-nfrs.md#non-functional-requirements)); Status Defined. Port and authorization: port interface `RefundOutcomePort`, operation `listApprovedRefunds`, request DTO `ApprovedRefundsQuery`, response DTO `ApprovedRefundsPage`, authorization `refund-request.approved-refund.read` checked at the port, tenant context per §15.1. DTO fields: `ApprovedRefundsQuery`.periodStart (date, Yes, the first day of the checked month); `ApprovedRefundsQuery`.periodEnd (date, Yes, at most 31 days after periodStart); `ApprovedRefundsQuery`.cursor (string, No, max 64); `ApprovedRefundsQuery`.pageSize (integer, No, 1 to 500, default 200, recommended); `ApprovedRefundsPage`.items (list of `ApprovedRefund`, Yes); `ApprovedRefundsPage`.nextCursor (string, No, absent on the last page); `ApprovedRefund`.refundRequestId (UUIDv7, Yes); `ApprovedRefund`.status (string, Yes, `APPROVED`, `PAID`, or `REJECTED`); `ApprovedRefund`.approvedAmount (`Money`, Yes); `ApprovedRefund`.approvedAt (timestamp UTC, Yes); `ApprovedRefund`.paidAt (timestamp UTC, No). Errors raised: `ForbiddenPortAccess`, `FORBIDDEN`, not retryable, configuration defect: alert; `RefundOutcomeUnavailable`, `UNAVAILABLE`, retryable, the check fails its run and retries in the next hour (recommended). Behaviour: read-only and idempotent; runs in its own read-only transaction. Replace the §17.2 Input row's description with: "First day of each month: checks that every refund request approved in the past month ([API-09](./11-api-contracts.md#152-contract-index)) has exactly one succeeded payout, or a payout still retrying or waiting for a dispute; that no refund request has two succeeded payouts; and that every succeeded payout is in CardPay Ltd's record of refunds ([REFUNDS/NFR-01](../brd-refunds-portal/10-nfrs.md#non-functional-requirements))". Add `PAYOUT_MODULE` to §16.4.3 ("In process | Read approved refunds through `RefundOutcomePort` | refund-request"), to §16.7 (refund-request: read), to §16.11 (a new row `refund-request.approved-refund.read` and a new column `PAYOUT_MODULE` with ✓ on that row only), and to §16.12.2 (`PAYOUT_MODULE` 1); add the API-09 rows to §15.4, to §17.1 (Input: Port, payout module; Integrations: Inbound, sync, in process) and to §17.2 (Integrations: Outbound, sync, in process).
- **Why:** REFUNDS/NFR-01 counts missing payouts, and only refund-request knows which refunds were approved; option B leaves the check blind to the failure it exists to measure. The tradeoff accepted is one more port, module identity, and token, read once a month from a schedule, which keeps AP-04 and the one-hop rule of §15.1.
- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log)

---

### OI-03: The publication log is neither stated as in-house nor named as a library

- **Where:** §10 ADR-02, §11.1 (Publication log), §6 Backend Runtime row
- **Type:** ADR needed
- **Concern:** ADR-02 and [§11.1](./07-cross-cutting-concerns.md#111-db-modeling-default) specify the `event_publication` table, its relay, redelivery on start-up, and a per-listener inbox, but no text says whether this mechanism is built in the deployable or taken from a framework library, while §6 and §11.1 state that the UUIDv7 generator and the feature switches are in-house and put a product-owner marker on every library the design needs. A publication-registry library is a new third-party dependency that AGENTS.md reserves for the product owner; an in-house relay is build and test work the plan must budget. An LLD cannot start either way.
- **Options:**
  - **A.** State in ADR-02 that the publication log, the relay, and the inboxes are built in-house in a shared platform package of the deployable - needs no approval under AGENTS.md; accepts the build and test effort.
  - **B.** Propose a framework library for the publication log as Proposed with a product-owner marker - less code, but the design waits on an approval and the library's own table format would replace §11.1's.
- **Recommended Answer:** Option A. Add to ADR-02 How: "The publication log, its relay, and each module's inbox are built in-house in a shared platform package of the deployable, as are the UUIDv7 generator (§11.1) and the feature switches (§11.5); adopting a library for them is a new third-party dependency that needs the product owner's approval (AGENTS.md)." Add to ADR-02 Consequences: "The in-house relay carries its own tests: redelivery after a crash between commit and delivery, redelivery on start-up, two replicas claiming the same row, and a listener that passes the poison threshold."
- **Why:** AGENTS.md forbids adopting a library before the product owner approves it, so option A is the only one the SDD can settle now, and the scale (four modules, eleven events, [PSDD/CAP-01.2](../pre-sdd-refunds-platform/03b-register-capacity.md#cap-01)) keeps an in-house relay small. The tradeoff accepted is the build and test effort a library would save.
- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log)

---

### OI-04: The event DTOs omit the aggregate version that ADR-02 tells listeners to check

- **Where:** §10 ADR-02, §14.10, §17.1 to §17.4 Event Models
- **Type:** Contract mismatch
- **Concern:** ADR-02 Consequences say "no ordering guarantee across events: listeners check the aggregate version", and `refund_request.version` and `payout.version` are described as the aggregate version of the events, but none of the eleven DTOs in [§14.10](./10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core) carries a version. Without it, a redelivered older event overwrites newer state: if `PayoutFailed` of kind `RETURNED` fails in the refund-request listener and is redelivered after the retry's `PayoutSucceeded` was applied, the request goes from Paid back to Approved and stays there while payout holds `SUCCEEDED` and sends nothing more, and the customer is told the payout is delayed for a refund already paid ([REFUNDS/NFR-01](../brd-refunds-portal/10-nfrs.md#non-functional-requirements), [REFUNDS 03 § Customer messages](../brd-refunds-portal/03-definitions-and-domain-concepts.md#customer-messages)).
- **Options:**
  - **A.** Add `aggregateVersion` to every DTO and have each state-changing listener ignore an event that is not newer than the last version it applied for that aggregate - one additive field (AP-10) that makes the ADR-02 rule implementable.
  - **B.** Have each listener infer the order from its own state rules (for example accept `RETURNED` only from Paid by the same attempt) - no contract change, but every listener re-implements ordering, and only `PayoutFailedDto` carries an `attempt`.
- **Recommended Answer:** Option A. Add to each DTO in §14.10, and verbatim in the Event Models of §17.1 to §17.4, the field `aggregateVersion` (integer, required: the publisher's `version` after the change; `refund_request.version` for the seven refund-request events, `payout.version` for `PayoutSucceeded`, `PayoutFailed`, and `PayoutStillFailing`, and a new `card_dispute.version` column (integer, required) for `CardDisputeDecided`). Replace in ADR-02 Consequences "listeners check the aggregate version" with: "a listener that changes state applies an event only when its `aggregateVersion` is higher than the last one it applied for that aggregate, and completes an older or equal event with no effect; refund-request keeps the last applied payout version in `refund_request.payout_version` (integer, optional) and the last dispute version in `refund_request.dispute_version` (integer, optional); loyalty-points stores `aggregate_version` in `refund_outcome_inbox` and processes the outcomes of one refund in version order; notification sends one message per event and needs no order."
- **Why:** ADR-02 already chose version checks as the answer to unordered delivery; without the field the rule cannot be built, and the returned-after-success case breaks REFUNDS/NFR-01's correctness and the customer messages. Option B spreads ordering logic over every listener. The tradeoff accepted is one additive field per DTO and two columns in refund-request.
- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log)

---

### OI-05: A refused or returned payout is resent with the same idempotency key

- **Where:** §17.2 (payout) Retry and Developer Notes, §8.4.2, §8.5.3, API-04
- **Type:** Corner case
- **Concern:** The payout module resends every `FAILED_RETRYING` payout, including one the customer's bank sent back after it succeeded, with the payout ID as the idempotency key, and lists "a new idempotency key on a resend" under Avoid ([§17.2](./13b-service-payout.md#business-logic); [§8.5.3](./05-workflows-and-sequences.md#853-sequence-payout-fails-and-the-branch-manager-is-told) "resend, same idempotency key"). Whether CardPay Ltd treats a key it has already seen as a replay (returning the stored refusal or the earlier acceptance without moving money) or as a new instruction is a provider fact nobody has given ([PSDD/QD-04](../pre-sdd-refunds-platform/10-validation-risks-unknowns.md#101-validation-and-unknowns); [API-04](./11-api-contracts.md#api-04-send-payout-payout---cardpay-ltd) is `TBD - external`). If CardPay Ltd replays, a returned payout is "accepted" again with no money sent and the request is marked Paid while the customer has nothing, and a refused payout stays refused until the retry limit ([REFUNDS/NFR-01](../brd-refunds-portal/10-nfrs.md#non-functional-requirements)). The design fixes one provider behaviour as settled while the contract is open.
- **Options:**
  - **A.** Keep the attempt's key for transport retries (timeout, retryable error, no answer) and start a new key generation after a definitive `REFUSED` or `RETURNED` result, with a marker on CardPay Ltd's key semantics - safe under either provider behaviour, because after a definitive refusal or return no money is in flight.
  - **B.** Keep one key per payout for every resend - simplest, but loses the payout if CardPay Ltd replays results per key.
- **Recommended Answer:** Option A. Add to `payout` the column `key_generation` (integer, required, starts at 1) and to `payout_attempt` the column `idempotency_key` (varchar(64), required: the key sent on that attempt). Replace in §17.2 Retry "`payout-retry` resends each due `FAILED_RETRYING` payout with the same idempotency key" with: "`payout-retry` resends each due `FAILED_RETRYING` payout. A resend after a `TIMEOUT` or a retryable error keeps the key of the attempt it repeats; a resend after a definitive `REFUSED` or `RETURNED` result increments `key_generation` and sends the key `<payout ID>-<key_generation>`, so CardPay Ltd never takes a resend for a replay of a refused or returned instruction. **[NEEDS CLARIFICATION: When the platform resends a payout with an idempotency key CardPay Ltd has already seen, does CardPay Ltd return the stored result or process the payout again, and for how long does it keep the keys? Owner: CardPay Ltd.]**" Replace the §17.2 Developer Notes Avoid item with "a new idempotency key on a resend after a timeout or a retryable error". In §8.4.2 node D and in §8.5.3 read "same key after a timeout, next key generation after a refusal or a return", and in API-04 Request headers read "our side sends the attempt's idempotency key (§17.2) in the header CardPay Ltd names".
- **Why:** REFUNDS/NFR-01 forbids both lost and duplicate payouts; a definitive refusal or return leaves no money in flight, so a new key there cannot pay twice, while reusing it can lose the payout under a replaying provider. The tradeoff accepted is one column per table and a key format the CardPay Ltd adapter maps once API-04 is documented.
- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log)

---

### OI-06: The payout state machine has no transitions for late, unexpected, or not-paid results

- **Where:** §17.2 (payout) Result, Manual result, state machine; §11.4 Alerting
- **Type:** Missing scenario
- **Concern:** The [§17.2](./13b-service-payout.md#business-logic) state machine defines one path per expected outcome but not: a provider result for a `STOPPED` payout (a late acceptance after the retry limit, or while a manual result waits for its confirmation); a result for a `CANCELLED` payout; a `RETURNED` result for a payout that is not `SUCCEEDED`; and a manual result recorded as not paid and confirmed ("only the confirmation of a paid result moves the payout"), which leaves the payout `STOPPED` with no next step and no signal. Each case touches [REFUNDS/NFR-01](../brd-refunds-portal/10-nfrs.md#non-functional-requirements), and an LLD would have to invent the transitions.
- **Options:**
  - **A.** Add an explicit table of these results, with an alert on every result that may mean money moved where the platform did not expect it - complete and testable.
  - **B.** Store unexpected results in `provider_notification` with no state change and leave them to the monthly check - simpler, but a late acceptance leaves a paid refund in Approved for up to a month.
- **Recommended Answer:** Option A. Add to §17.2 after the state machine a table "Results in other states": "| Payout state | Result | Effect |" with the rows: `STOPPED`, provider accepted: `SUCCEEDED`, `PayoutSucceeded` recorded, an unconfirmed manual result is closed as superseded; `STOPPED`, provider refused or returned: no change, stored; `CANCELLED`, provider accepted: no change, stored, alert "payout accepted after cancellation" to payout staff (a possible double refund, §20.1.7); `SUCCEEDED`, provider accepted again: no change; `PENDING`, `ON_HOLD_DISPUTE`, `SENT`, or `FAILED_RETRYING`, provider returned: no change, stored, alert; `STOPPED`, manual not-paid result confirmed: stays `STOPPED`, the confirmed result is kept, `payouts_stopped` keeps counting it, and it waits for the business rule of the §17.2 marker on payouts that can never succeed. Add `STOPPED --> SUCCEEDED : provider accepted late` to the state diagram, and add to [§11.4](./07-cross-cutting-concerns.md#114-observability-default) Alerting "a provider result for a payout in an unexpected state".
- **Why:** REFUNDS/NFR-01 counts every missing or duplicate payout, and these results are where they arise; option B delays a correct Paid status by up to a month and hides possible double refunds. The tradeoff accepted is a larger state table and one more alert.
- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log)

---

### OI-07: A card dispute reported after the payout was sent or while it is retried

- **Where:** §17.2 (payout) Send, Retry, and Card dispute; §17.1 BR-8 handling
- **Type:** Missing scenario
- **Concern:** The payout module checks for an open dispute only when it creates the payout on `RefundRequestApproved` ([§17.2](./13b-service-payout.md#business-logic)). A dispute reported later while the payout is `FAILED_RETRYING` is ignored and the retry still pays; a dispute the bank refunds to the customer after the payout `SUCCEEDED` refunds the customer twice, and refund-request rejects only an `APPROVED` request on `CardDisputeDecided`. [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) BR-8: payout waits for a card dispute holds the payout while a dispute is open, so the retry case is a design gap; what happens after a payout already succeeded is not stated by the BRD.
- **Options:**
  - **A.** Check for an open dispute before every send and resend and hold the payout when one is open, and record a double-refund finding for a dispute refunded after success - meets BR-8 for every unpaid state and surfaces the case the BRD does not rule on.
  - **B.** Keep the single check at creation - simplest, but pays during an open dispute after any first refusal.
- **Recommended Answer:** Option A. Add to §17.2 Send and Retry: "Before each send and each resend the relay reads `card_dispute` for an `OPEN` dispute on the payout's original payment; with one, the payout moves to `ON_HOLD_DISPUTE` and is not sent ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) BR-8: payout waits for a card dispute)." Add `FAILED_RETRYING --> ON_HOLD_DISPUTE : open dispute` to the state diagram. Add to §17.2 Card dispute: "A dispute decided `REFUNDED_TO_CUSTOMER` on a payment whose payout is `SUCCEEDED` changes no state; it is recorded as a double-refund finding for the monthly check and alerted to payout staff. **[NEEDS CLARIFICATION: When the customer's bank refunds a disputed card payment after the refund payout was already paid, how does the business recover the second refund? Owner: Refunds and Loyalty Product Owner.]**"
- **Why:** BR-8 holds the payout for the whole open dispute and [REFUNDS/NFR-01](../brd-refunds-portal/10-nfrs.md#non-functional-requirements) forbids paying twice; a check before each send costs one indexed read, while option B leaves a known double-payment path. The recovery after a paid payout is a business rule, so it stays a marker with its owner.
- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log)

---

### OI-08: The region failover data-loss window can pay twice and drops unknown payout results

- **Where:** §8.6.3, §8.6.4, §8.7.3, §11 Disaster recovery defaults, §17.2 Result, §20.1.5 B, §4 Risks
- **Type:** Risk
- **Concern:** The region RPO is 900 s ([PSDD/REL-04.1](../pre-sdd-refunds-platform/03c-register-reliability.md#rel-04)), and the Pre-SDD itself counts the exposure at the peak ([PSDD/CALC-15](../pre-sdd-refunds-platform/04-targets-and-calculations.md#42-calculations): 62.5 transactions). §8.6.3, §11, and §20.1.5 state that the payout idempotency key makes a resend after a failover safe, which holds only for payout rows that survived. Rows lost in the window cause: a payout CardPay Ltd already accepted whose approval is gone, so the branch manager decides again and a new payout ID pays twice; CardPay Ltd results for payout IDs the recovered database does not know, which nothing says are kept; and customers who hold a reference number and a submitted message for a request that no longer exists (risk R-01, [REFUNDS 01 § Business Objectives](../brd-refunds-portal/01-executive-summary-and-context.md#business-objectives) Objective 2). [§20.1.5](./16-operations-runbook.md#2015-database-failover) B restarts the relays at once and has no reconciliation step. The recovery region's NAT egress addresses also differ from the primary's, so a provider allow-list (the §8.7.3 markers) blocks payouts after a failover unless those addresses are registered too.
- **Options:**
  - **A.** Start the recovery region with payout sending paused, reconcile the window against CardPay Ltd before sending resumes, keep results for unknown payouts instead of dropping them, and register the recovery egress addresses in advance - contains the locked RPO's effect on money.
  - **B.** Record the window as a residual risk in §4 only - no work, but any region failover can break REFUNDS/NFR-01.
- **Recommended Answer:** Option A. Add to §20.1.5 B after step 3: "3a. Keep the payout relay and `payout-retry` paused: the `payout-sending` switch (§11.5) stays off. 3b. Reconcile the data-loss window: list the payouts CardPay Ltd accepted since the recovered database's last commit minus [PSDD/REL-04.1](../pre-sdd-refunds-platform/03c-register-reliability.md#rel-04) (the report of the §17.2 monthly-check marker) and match each to a payout by its idempotency key; record every accepted payout with no match as a `RECOVERED_UNMATCHED` finding, which payout staff link to its refund request before any new payout for that request is sent. 3c. Turn `payout-sending` on." Add to §17.2 Result: "A verified result notification whose payout is unknown is stored in `provider_notification` with `kind` `PAYOUT_RESULT_UNMATCHED` and alerted; it is never dropped." Add to §11.5 Feature flags "a `payout-sending` switch that pauses the payout relay and `payout-retry`, used during a region recovery (§20.1.5)". Add to §8.7.3 under the table: "The recovery region's NAT egress addresses are registered with every provider that requires an allow-list at the same time as the primary region's." Replace in §8.6.3 and in §11 Disaster recovery defaults "the payout idempotency key makes a payout resent after a failover safe" and "the payout idempotency key prevents a second payout" with "the payout idempotency key makes a resend of a surviving payout safe; payouts lost in the data-loss window are reconciled before sending resumes ([§20.1.5](./16-operations-runbook.md#2015-database-failover))". Add to §4: "| R-08 | A region failover loses up to [PSDD/REL-04.1](../pre-sdd-refunds-platform/03c-register-reliability.md#rel-04) of committed data ([PSDD/CALC-15](../pre-sdd-refunds-platform/04-targets-and-calculations.md#42-calculations)): refund requests whose customers already hold a reference number, and payouts CardPay Ltd already accepted. | L | H | Recovery starts with payout sending paused and reconciles the window against CardPay Ltd before sending resumes (§20.1.5); results for unknown payouts are kept and alerted (§17.2); a customer whose request was lost submits again with the receipt. | Software Architect |".
- **Why:** The RPO is locked, so the design must contain its effect, and a re-decided approval after a lost row is the shortest path to the duplicate payout that [REFUNDS/NFR-01](../brd-refunds-portal/10-nfrs.md#non-functional-requirements) forbids; option B names the risk but leaves it open on every failover. The tradeoff accepted is a longer recovery inside the 14,400 s region RTO and a reconciliation that depends on the CardPay Ltd report still awaited.
- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log)

---

### OI-09: The identity provider has no hosting, HA, or DR in the design

- **Where:** §8.6.2 to §8.6.4, §8.7.2, §8.7.7, §20.1.5, §6 IAM / AuthN row
- **Type:** Architecture gap
- **Concern:** §6 and ADR-06 propose Keycloak, a self-hosted and stateful identity provider, and every user action depends on its tokens. §12 and §15.1 rightly exempt it from API-NN contracts as operational infrastructure, but that exemption does not cover hosting: [§8.6.2](./05a-infrastructure-and-network.md#862-deployables-per-environment) lists only the refunds-platform deployable, the primary database holds only the module schemas, [§8.6.4](./05a-infrastructure-and-network.md#864-backup-and-disaster-recovery) gives the identity provider no RPO or RTO, §8.7 has neither an ingress hop for its sign-in pages nor a port row, and [§20.1.5](./16-operations-runbook.md#2015-database-failover) B never starts it. A region failover as written restores the platform but nobody can sign in, so the design does not meet the locked availability and recovery targets ([PSDD/REL-01.1](../pre-sdd-refunds-platform/03c-register-reliability.md#rel-01), [PSDD/REL-03.1](../pre-sdd-refunds-platform/03c-register-reliability.md#rel-03)) for any signed-in action.
- **Options:**
  - **A.** If the product owner approves Keycloak, place it as a second deployable with its own database on the same PostgreSQL service, sharing the zones, replication, and recovery steps of the platform - one HA and DR design for both.
  - **B.** Use the cloud provider's managed identity service (the ADR-06 alternative) - nothing to host, but a different new dependency that also waits for the product owner.
  - **C.** Leave the placement open until the product owner decides - no rework risk, but §8.6 and §20 stay incomplete for a component every request depends on.
- **Recommended Answer:** Option A, written conditional on the §6 IAM / AuthN marker. Add to §8.6.2: "| identity-provider (Keycloak, Proposed: §6 IAM / AuthN marker) | [§6 IAM / AuthN](./02-ecosystem-overview.md#6-ecosystem-overview) | Managed container service, 1 replica | Managed container service, 1 replica | Managed container service, 2 replicas over 2 zones | Managed container service, 2 replicas over 2 zones | Managed container service, 0 replicas while idle, scaled on failover |". Add to §8.6.3: "| Identity database (database `identity` on the same PostgreSQL service, separate from the platform database) | Primary RDBMS | As the primary database: standby in a second zone, cross-region replica | As the primary database | identity-provider |". Add to §8.6.4: "| Identity database and identity-provider | As the primary database | As the primary database | As the primary database | Promoted and scaled with the platform in §20.1.5 | [PSDD/REL-05.1](../pre-sdd-refunds-platform/03c-register-reliability.md#rel-05), [PSDD/REL-05.2](../pre-sdd-refunds-platform/03c-register-reliability.md#rel-05) |". Add to §8.7.2 hop 5 "and the identity provider's sign-in pages, on their own host name behind the same load balancer", and to §8.7.7 the row "| Managed load balancer | identity-provider | As the refunds-platform row (container port marker) | HTTPS | Sign-in and tokens | [PSDD/SEC-04.1](../pre-sdd-refunds-platform/03e-register-security.md#sec-04) |". In §20.1.5 B step 3 read "Scale the dr deployables refunds-platform and identity-provider from 0 to the prod replica count".
- **Why:** Option A gives the identity provider the same locked recovery targets as the data it protects without a second database service; B and C are valid only after the product owner answers, and A respects that by staying Proposed. The tradeoff accepted is a second deployable to operate.
- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log)

---

### OI-10: The region recovery drill is planned on stage, which has no recovery region

- **Where:** §19, §18.4, §8.6.2
- **Type:** Inconsistency
- **Concern:** [§19](./15-environments.md#19-environments) states that "stage is where the zone and region recovery drills run", and [§18.4](./14-performance-and-capacity.md#184-stress-testing-strategy) schedules a region failover drill, but §8.6.2 and §8.6.3 give stage two replicas in two zones and no recovery-region replica or idle deployable; only prod has its dr copy ([PSDD/OPS-04.1](../pre-sdd-refunds-platform/03g-register-operations.md#ops-04)). The region drill cannot run as written, so the region targets ([PSDD/REL-03.1](../pre-sdd-refunds-platform/03c-register-reliability.md#rel-03), [PSDD/REL-04.1](../pre-sdd-refunds-platform/03c-register-reliability.md#rel-04)) stay unproven before go-live.
- **Options:**
  - **A.** Create a temporary stage recovery footprint (a cross-region replica of the stage database and an idle stage deployable) for each region drill and remove it after - proves the procedure without a standing cost.
  - **B.** Run the region drill on prod's dr in a planned window - tests the real path, but puts live refunds at risk.
  - **C.** Keep a permanent stage recovery copy - always ready, but pays idle cost all year for a few drills.
- **Recommended Answer:** Option A. In §19 replace "and stage is where the zone and region recovery drills run" with "stage runs the zone recovery drill; the region recovery drill runs on stage with a temporary recovery footprint in the recovery region (a cross-region replica of the stage database and an idle stage deployable), created by the pipeline before the drill and removed after it". Add under the §8.6.2 table: "stage-dr: created only for a region recovery drill (§19), shaped as the dr column."
- **Why:** The drill exists to prove the locked region targets before go-live; option A proves them without touching prod and without a standing cost against [PSDD/ECO-01.1](../pre-sdd-refunds-platform/03h-register-economics.md#eco-01), while B risks live refunds and C pays all year. The tradeoff accepted is a drill that also tests the pipeline's creation of the footprint.
- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log)

---

### OI-11: Submit does not say where the receipt data it re-checks comes from

- **Where:** §17.1 (refund-request) [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) steps 5-7, API-01, §11.1 JSON columns
- **Type:** Ambiguity
- **Concern:** `POST /v1/refund-requests` "re-checks every item against the rules above" and stores the amounts, branch, purchase date, and original payment reference, all of which come from Point-of-Sale Records; no table holds the lookup result, and [§17.1](./13a-service-refund-request.md#business-logic) does not say whether submit calls API-01 again. If it trusts the browser's data, a customer can change amounts or the payment reference; if it calls API-01 again, submit adds a second provider call against the 2,000 ms target ([PSDD/CAP-07.1](../pre-sdd-refunds-platform/03b-register-capacity.md#cap-07)) and the open provider quota ([PSDD/INT-03.2](../pre-sdd-refunds-platform/03f-register-integration.md#int-03)), and a provider outage between step 2 and step 6 fails a submit, a case [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) E5 covers only at step 2.
- **Options:**
  - **A.** Keep a short-lived server-side record of each lookup and have submit read it - no second provider call, the browser cannot alter amounts, and submit sees what the customer saw.
  - **B.** Call API-01 again at submit - always current, but a second call and a failure point the BRD does not describe at step 6.
  - **C.** Trust the submitted data - fastest, but lets the browser set refund amounts and the payment reference.
- **Recommended Answer:** Option A. Add to §17.1 Tables Design the table `receipt_lookup` ("The receipt data of one lookup, kept 30 minutes (recommended)"): `id` uuid, required, UUIDv7 primary key, returned to the browser as `lookupId`; `customer_subject` varchar(255), required; `receipt_number` varchar(64), required; `branch_id` varchar(32), required; `purchase_date` date, required; `original_payment_ref` varchar(128), optional; `paid_by_card` boolean, required; `lines` jsonb, required (the provider's item lines with amounts, as received); `created_at` timestamptz, required. Replace in [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) steps 5-7 "re-checks every item against the rules above" with "reads the `receipt_lookup` row named by `lookupId` (same `customer_subject`, not older than 30 minutes) and re-checks every item against the rules above on that row and, under the receipt's lock, on the module's own requests; the amounts, branch, purchase date, and payment reference come only from that row; an expired or foreign `lookupId` answers 409 `RECEIPT_LOOKUP_EXPIRED`, and the browser repeats step 1". Add `RECEIPT_LOOKUP_EXPIRED` to §17.1 Error Handling, a `receipt-lookup-purge` schedule (hourly) to §17.1 Input, the 30-minute rule to §17.1 Retention Policy, and to [§11.1](./07-cross-cutting-concerns.md#111-db-modeling-default) JSON columns "and the provider's receipt lines kept for one lookup".
- **Why:** Server-side receipt data keeps the amounts of [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) step 4 authoritative without a second provider call inside the 2,000 ms budget or against an unknown quota; B adds a failure the BRD does not describe and C is a tampering path for refund money. The tradeoff accepted is one small table and a 30-minute limit between lookup and submit.
- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log)

---

### OI-12: The cancellation endpoint takes no Idempotency-Key

- **Where:** §17.1 (refund-request) API Standards and List of APIs, §9 AP-02, §15.1
- **Type:** Inconsistency
- **Concern:** AP-02 and §15.1 require an `Idempotency-Key` on every write that touches notifications; `POST /v1/refund-requests/{refundRequestId}/cancellation` triggers the cancellation email and the outcome to Loyalty Points, but [§17.1](./13a-service-refund-request.md#api-standards) requires the key only on submit and decision. A browser that retries a cancellation whose first response was lost gets 409 `REFUND_ALREADY_DECIDED` ("can no longer be cancelled", [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request) E1) for a request it has just cancelled.
- **Options:**
  - **A.** Require `Idempotency-Key` on the cancellation, stored in `request_idempotency`, so a retry returns the first 200 - meets AP-02 and answers the retry truthfully.
  - **B.** Answer 200 to a repeated cancellation of an already Cancelled request by the same customer, without a key - simpler for the client, but a one-off behaviour outside the platform convention.
- **Recommended Answer:** Option A. In §17.1 API Standards replace the Idempotency line with: "`Idempotency-Key` required on `POST /v1/refund-requests`, `POST /v1/refund-requests/{refundRequestId}/cancellation`, and `POST /v1/refund-requests/{refundRequestId}/decision`, stored in `request_idempotency`."
- **Why:** AP-02 and §15.1 are the platform rule for writes that trigger messages, and option A reuses the table that already exists; B adds a special case. The tradeoff accepted is one more header for the browser to send.
- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log)

---

### OI-13: The receipt lookup has no per-customer limit

- **Where:** §17.1 (refund-request) [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) steps 1-2, §11.6, §15.1
- **Type:** Risk
- **Concern:** Any signed-in customer can call `GET /v1/receipts/{receiptNumber}/refundable-items` for any receipt number and see its items, amounts, branch, and purchase date; [REFUNDS 03 § Customer identity](../brd-refunds-portal/03-definitions-and-domain-concepts.md#customer-identity) requires proof of who the customer is, not that the receipt is theirs. No our-side rate limit exists (§15.1 lists 429 `RATE_LIMITED`, but no endpoint applies it), so receipt numbers can be enumerated, exposing other customers' purchases against [REFUNDS/NFR-04](../brd-refunds-portal/10-nfrs.md#non-functional-requirements), and every call spends the open Point-of-Sale Records quota ([PSDD/INT-03.2](../pre-sdd-refunds-platform/03f-register-integration.md#int-03)).
- **Options:**
  - **A.** An in-house per-customer limit on the lookup, counted in the module's schema, answering 429 - no new dependency, small.
  - **B.** Rely on the identity provider and the provider's own quota - no work, but enumeration stays open and one account can exhaust the shared quota.
  - **C.** A web application firewall at the edge - broader protection, but it waits for [PSDD/SEC-03.1](../pre-sdd-refunds-platform/03e-register-security.md#sec-03) and is a new managed service AGENTS.md reserves for the product owner.
- **Recommended Answer:** Option A. Add to §17.1 [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) steps 1-2: "Each customer may make at most 10 receipt lookups in 10 minutes (recommended); a further lookup answers 429 `RATE_LIMITED` with `Retry-After`, and the web frontend shows a plain try-again message. The count is kept in the table `receipt_lookup_count` (`customer_subject` varchar(255), `window_start` timestamptz, `count` integer; unique on `customer_subject` and `window_start`; rows kept 1 day)." Add `RATE_LIMITED` to §17.1 Error Handling and the metric `receipt_lookups_limited_total` (counter, no label) to §17.1 Metrics.
- **Why:** An in-house counter blocks enumeration and protects the partner quota without a dependency AGENTS.md reserves; C stays possible once PSDD/SEC-03.1 is set. The tradeoff accepted is an occasional honest customer slowed after ten lookups.
- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log)

---

### OI-14: How a member record is created and linked to the purchase feed's member reference

- **Where:** §17.4 (loyalty-points) Membership, Earning, `member` table; §10 ADR-06
- **Type:** Architecture gap
- **Concern:** `member.subject` (the sign-in identity) and `member.pos_member_ref` (the member in the purchase feed) are both required, and `member_purchase.member_id` is required, but [§17.4](./13d-service-loyalty-points.md#business-logic) never says when a member row is created or how the two identifiers are linked. A purchase that arrives for a member who has never signed in has no member row to attach to, so its points are dropped or the feed fails, while [LOYALTY 03 § Earning points](../brd-loyalty-points/03-definitions-and-domain-concepts.md#earning-points) earns points on every member purchase, signed in or not. The open BRD questions cover who signs the member in and who records that a member left, not how the purchase side and the sign-in side of a member meet.
- **Options:**
  - **A.** Create the member row from the feed on the first purchase with `subject` empty, and link the sign-in identity at the member's first sign-in through a member number the identity carries - no purchase lost; which number links them is a person's answer.
  - **B.** Create the member at first sign-in and keep feed purchases of unknown members in a waiting table - also loses nothing, but needs a second matching path and a retention rule for the waiting rows.
- **Recommended Answer:** Option A. In §17.4 change `member.subject` to Optional ("null until the member first signs in; unique where not null") and add to Membership: "A member row is created from the purchase feed on the first purchase of an unknown `pos_member_ref`, with `subject` empty; the member's first sign-in links the token's subject to that row through the member number the identity carries, and a sign-in whose member number has no row yet creates the row with both identifiers. **[NEEDS CLARIFICATION: Which member number does the member's sign-in carry, and is it the same member reference that Point-of-Sale Records sends with each purchase? Owner: Loyalty Points owner, with the Retail IT team.]**" Add to ADR-06 How: "the member client's token carries the member number as the claim `member_ref`".
- **Why:** LOYALTY earns points on every member purchase and [LOYALTY/NFR-01](../brd-loyalty-points/10-nfrs.md#non-functional-requirements) counts upheld balance complaints; option A loses no purchase and keeps one matching path, while B adds a waiting store. Which number links the two sides is a fact only the business and the Retail IT team can give, so it stays a marker with its owner.
- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log)

---

### OI-15: The Loyalty Points reporting start day is tied to a switch that can change

- **Where:** §11.5 Feature flags, §17.4 Take-back, §19 Feature flags
- **Type:** Corner case
- **Concern:** [§11.5](./07-cross-cutting-concerns.md#115-configuration-management-default) and [§17.4](./13d-service-loyalty-points.md#business-logic) take the day refund outcomes start to reach Loyalty Points ([LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-7: only reported refunds) from "the go-live switch's date", but a switch can be turned off and on again, for an incident or a failed go-live, and the `feature_switch` table holds no date. If the date follows the switch, refunds paid between the first and a later switch-on gain or lose take-backs, against [LOYALTY/NFR-01](../brd-loyalty-points/10-nfrs.md#non-functional-requirements); what the processor and the member endpoints do while the switch is off after go-live is also unstated.
- **Options:**
  - **A.** Record the start day once, at the first switch-on, as a value never updated, and define a later switch-off as pausing the processor and the member screens only - every outcome keeps the rule of the first day.
  - **B.** Let the start day follow the switch - simpler, but changes points for refunds paid between two switch-on dates.
- **Recommended Answer:** Option A. Add to §11.5 Feature flags: "The first time the Loyalty Points switch turns on in an environment, the deployable records `loyalty_reporting_started_on` (a date, UTC) in the `loyalty_points` schema, written once and never updated; [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-7: only reported refunds is judged against that date. Turning the switch off later pauses the take-back processor and answers the member endpoints with 503 `POINTS_UNAVAILABLE`; the inbox keeps receiving outcomes, and the processor applies them in order when the switch is on again." In §17.4 Take-back replace "the start day is the go-live switch's date, §11.5" with "the start day is `loyalty_reporting_started_on` (§11.5)".
- **Why:** BR-7 defines one start day and [REFUNDS/NFR-01](../brd-refunds-portal/10-nfrs.md#non-functional-requirements) counts every movement that breaks the rules; option A keeps that day stable across incidents. The tradeoff accepted is that a mistaken first switch-on fixes the day and needs a migration to correct.
- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log)

---

### OI-16: The operations redelivery endpoint is missing from §16 and from every List of APIs

- **Where:** §20.1.3 step 4, §16.3, §16.4.3, §16.11, §16.12.2, §8.7.7
- **Type:** Inconsistency
- **Concern:** [§20.1.3](./16-operations-runbook.md#2013-replay-dlq-messages) replays stuck events through "the operations endpoint of the deployable, available to PLATFORM_OPERATOR only", but no List of APIs defines it; [§16.4.3](./12-centralized-user-roles.md#1643-platform-plane-operator---outside-tenant-tenancy) says `PLATFORM_OPERATOR` holds no permission token and §16.3 gives it the cloud provider's single sign-on, not the identity provider the deployable trusts, and §16.11 has no token for it, against the deny-by-default rule of AP-09. The endpoint also forces business effects (a payout send, a take-back), and nothing says the public load balancer cannot reach it.
- **Options:**
  - **A.** Define the endpoint on a management port the public load balancer does not route, with its own permission token for the operator in the identity provider's staff client and an audit log - consistent with §8.7.6.
  - **B.** Drop the endpoint and replay by updating `event_publication` through the §8.7.6 database session - no new surface, but a hand-written update bypasses the relay's own checks.
- **Recommended Answer:** Option A. Add to §17.1 a "Platform operations" List of APIs: "| POST | `/v1/operations/event-publications/{eventPublicationId}/redelivery` | Redeliver one incomplete publication-log row | - | `RedeliveryAccepted` | `platform.event-publication.redeliver` | - |", served on the management port only (not routed by the public load balancer; reached through the session of §8.7.6), each call logged with the operator, the row, and the time. In §16.3 set the `PLATFORM_OPERATOR` identity source to "the cloud provider's single sign-on for infrastructure; the identity provider's staff client for the operations endpoint"; add to §16.4.3 for `PLATFORM_OPERATOR` "redeliver one incomplete event (§20.1.3), audited"; add to §16.11 the row `platform.event-publication.redeliver` with a `PLATFORM_OPERATOR` column ✓ (footnote: management port only) and replace "`PLATFORM_OPERATOR` holds no token" with "`PLATFORM_OPERATOR` holds only `platform.event-publication.redeliver`"; set §16.12.2 `PLATFORM_OPERATOR` to 1; add to §8.7.7 the row "| Administrative access | refunds-platform | Management port: as the container port marker | HTTPS | Operations endpoint (§20.1.3) | [§8.7.6](./05a-infrastructure-and-network.md#876-administrative-access) |"; and in §20.1.3 step 4 name the endpoint.
- **Why:** The runbook needs the replay to recover from poison events (§17.1 to §17.4 Error Handling), and AP-09 needs a token on every endpoint; option B bypasses the relay's idempotency checks with hand-written SQL. The tradeoff accepted is one more endpoint and port to secure.
- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log)

---

### OI-17: The runbook has no procedure for monthly check findings or the go-live switches

- **Where:** §20.1, §11.4 Alerting
- **Type:** Missing scenario
- **Concern:** [REFUNDS/NFR-01](../brd-refunds-portal/10-nfrs.md#non-functional-requirements) is checked monthly by `payout-reconciliation-monthly`, but no alert fires when a run finds a missing or duplicate payout ([§11.4](./07-cross-cutting-concerns.md#114-observability-default)), and no procedure says what operators and payout staff do with the finding. The branch pilot and rollout switches and the Loyalty Points go-live switch change production behaviour (the kept refund outcomes start to be applied), yet [§20](./16-operations-runbook.md#20-operations-runbook) uses a branch switch only to stop an incident; switching a branch on, and the Loyalty Points go-live with its checks against [LOYALTY/NFR-02](../brd-loyalty-points/10-nfrs.md#non-functional-requirements), have no procedure.
- **Options:**
  - **A.** Add an alert on non-zero findings and three procedures: a monthly check finding, switching a branch on, and the Loyalty Points go-live - covers the operations the BRDs imply.
  - **B.** Leave these to the delivery team's own notes - no SDD work, but the [REFUNDS/NFR-01](../brd-refunds-portal/10-nfrs.md#non-functional-requirements) control has no response path.
- **Recommended Answer:** Option A. Add to §11.4 Alerting "a monthly payout check run with a missing or duplicate count above 0 (SEV2)". Add to §20.1: "20.1.8 Monthly Payout Check Finding: 1. Open the `reconciliation_run` findings for the month. 2. For a missing payout: find the refund request's `RefundRequestApproved` row in `event_publication` and replay it by §20.1.3; confirm the payout row exists. 3. For a duplicate payout: confirm both payouts with CardPay Ltd (the report of the §17.2 monthly-check marker) and hand the case to the Refunds and Loyalty Product Owner for recovery. 4. Record the findings and actions in the incident record." "20.1.9 Switch a Branch On: 1. Confirm the branch is in the rollout plan ([PSDD/QD-03](../pre-sdd-refunds-platform/10-validation-risks-unknowns.md#101-validation-and-unknowns)). 2. Turn the branch's switch on (§11.5); the change is logged. 3. Look up a receipt of that branch and confirm its items show as refundable. 4. Watch `refund_requests_submitted_total` for the branch for one day." "20.1.10 Loyalty Points Go-Live: 1. Confirm the gates of §11.3 for Loyalty Points. 2. Note `refund_outcome_inbox_unprocessed`. 3. Turn the Loyalty Points switch on (§11.5). 4. Watch the inbox drain and `take_back_latency_seconds` stay within [LOYALTY/NFR-02](../brd-loyalty-points/10-nfrs.md#non-functional-requirements). 5. Open a test member's balance and history."
- **Why:** [REFUNDS/NFR-01](../brd-refunds-portal/10-nfrs.md#non-functional-requirements)'s monthly count is the business's only control on payout accuracy, and the switches are how [REFUNDS 04 § Project Scope](../brd-refunds-portal/04-scope-and-personas.md#project-scope) and [LOYALTY 04 § Project Scope](../brd-loyalty-points/04-scope-and-personas.md#project-scope) go live; without procedures both depend on memory. The tradeoff accepted is three short procedures and one alert.
- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log)

---

### OI-18: §18 says the Pre-SDD has no calculation rows, so no PSDD/CALC-NN value is cited

- **Where:** §18 (chunk 14 header comment, §18.1, §18.2), §8.6.4, §11.4
- **Type:** Inconsistency
- **Concern:** The chunk 14 header comment reads "The Pre-SDD's chunk 12 lists no PSDD/CALC-NN row, so §18 cites the CAP, DAT, and INT entries". The handoff guide's § 12.3 says §18 cites the PSDD/CALC-NN values of the Pre-SDD's chunk 04 and never recomputes them, and [PSDD 04 § 4.2](../pre-sdd-refunds-platform/04-targets-and-calculations.md#42-calculations) holds CALC-01 to CALC-15 (Estimated) and CALC-16 to CALC-20 (Open): among them the peak API rate (CALC-03), the headroom budget (CALC-04), the retained data and the planning storage footprint (CALC-11, CALC-12), the downtime budgets (CALC-13, CALC-14), and the RPO exposure (CALC-15). As a result §18.2 sizes the database "with storage for the 10-year retention" without the figure the Pre-SDD computed, and §11.4 alerts on an error budget it never states.
- **Options:**
  - **A.** Cite the CALC values where they land - follows the handoff guide.
  - **B.** Keep citing only the register entries - no change, but the database storage and the error budget stay unquantified.
- **Recommended Answer:** Option A. Replace the last sentence of the chunk 14 header comment with "§18 cites the Pre-SDD's calculations ([PSDD 04 § 4.2](../pre-sdd-refunds-platform/04-targets-and-calculations.md#42-calculations)) as PSDD/CALC-NN and never recomputes them." In §18.1 Peak request rate add "([PSDD/CALC-03](../pre-sdd-refunds-platform/04-targets-and-calculations.md#42-calculations))". In §18.2 replace "with storage for the 10-year retention of [PSDD/DAT-06.1](../pre-sdd-refunds-platform/03d-register-data.md#dat-06) at [PSDD/DAT-02.1](../pre-sdd-refunds-platform/03d-register-data.md#dat-02)" with "with storage for the planning footprint of [PSDD/CALC-12](../pre-sdd-refunds-platform/04-targets-and-calculations.md#42-calculations) (166.4544 GB, from the retained data of [PSDD/CALC-11](../pre-sdd-refunds-platform/04-targets-and-calculations.md#42-calculations))", and add "the scale-out target keeps the headroom budget of [PSDD/CALC-04](../pre-sdd-refunds-platform/04-targets-and-calculations.md#42-calculations) (0.3526 req/s)". In §11.4 Alerting name "the 30-day downtime budget of [PSDD/CALC-13](../pre-sdd-refunds-platform/04-targets-and-calculations.md#42-calculations) (2,592 s)". In §8.6.4 under the table add "The exposure of the region RPO at the peak is [PSDD/CALC-15](../pre-sdd-refunds-platform/04-targets-and-calculations.md#42-calculations) (62.5 transactions)." In §18.1 note that CALC-16, CALC-19, and CALC-20 are open with [PSDD/CAP-05.1](../pre-sdd-refunds-platform/03b-register-capacity.md#cap-05) and [PSDD/CAP-10.1](../pre-sdd-refunds-platform/03b-register-capacity.md#cap-10).
- **Why:** The handoff guide is the contract for where locked numbers land, and the Pre-SDD already computed these values; leaving them out leaves the database size and the error budget to guesswork. The tradeoff accepted is more PSDD citations in §18.
- **Status:** Adjusted - applied
- **Resolution:** [Resolution Log](#resolution-log)
- **Adjustment:** applied without the citation of PSDD/CALC-11 in §18.2, whose model value the Recommended Answer did not give and this SDD cannot read from the Pre-SDD.

---

### OI-19: The §7.3 row of [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) lists three of the four refund outcome events loyalty-points handles

- **Where:** §7.3, §17.4
- **Type:** Inconsistency
- **Concern:** [§17.4](./13d-service-loyalty-points.md#input) Input and [§14.10](./10-events-hub.md#1410-in-process-domain-events-modular-monolith--hybrid-core) give loyalty-points four refund outcome events, including `RefundRequestReturnedToApproved`, while the [§7.3](./03-users-and-use-cases.md#73-use-case-traceability-brd--sdd) row for [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) lists only three as `Event:` entry points and shows "-" in its Events column. Checked against the traceability rules, the row is correct: under the trigger tie, a trigger is an Entry points value only of the use cases its 13x Input row cites as a keyed part, and the §17.4 Input row for `RefundRequestReturnedToApproved` cites no [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) part (it refers only to risk R-05, because LOYALTY states no rule for this outcome). The Events column holds only the events a use case's steps fire, read from the §14.10 When column, and no §14.10 When cites [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history); events the use case only handles belong in Entry points.
- **Options:**
  - **A.** No change to §7.3: the row follows the trigger tie and the Events column rule - keeps one home for each tie; the Returned outcome stays visible through R-05 and the §17.4 Input row.
  - **B.** Add `Event: RefundRequestReturnedToApproved` to the row's Entry points and list the handled events under Events - looks more complete, but conflicts with both rules, since the Input row cites no [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) part and the use case fires none of these events.
- **Recommended Answer:** No change: by the trigger tie, the §17.4 Input row for `RefundRequestReturnedToApproved` cites no [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) part (only risk R-05), so that event is not an Entry points value of [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history); by the Events column rule, no §14.10 When cites [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history), so its Events cell is correctly "-". The row becomes an entry point only if LOYALTY states a rule for this outcome (R-05 marker) and the §17.4 Input row then cites that part.
- **Why:** The skill's trigger tie and Events column rules decide what the §7.3 row holds, and the row follows both; option B would put a tie in §7.3 that its only home, the 13x Input row, does not state. The tradeoff accepted is that the Returned outcome is traced through R-05 rather than through §7.3 until LOYALTY rules on it.
- **Status:** Rejected
- **Resolution:** [Resolution Log](#resolution-log)

---

### OI-20: The two BRDs' refund reference and their rating of the outcome flow are not reconciled

- **Where:** §17.4 (`refund_ref`), §14.7 Outcome doctrine
- **Type:** Ambiguity
- **Concern:** LOYALTY shows each take-back with "the refund reference" ([LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) steps 2 and 4) and receives a "Refund reference" ([LOYALTY 08 § Integrations](../brd-loyalty-points/08-integrations.md#integrations)), while REFUNDS sends a "Reference number" ([REFUNDS 08 § Integrations](../brd-refunds-portal/08-integrations.md#integrations)). §17.4 stores `refund_ref` (unique, the one-take-back key) without saying whether it is the DTO's `referenceNumber` (the number the customer knows) or `refundRequestId`. The two BRDs also rate the same flow differently: REFUNDS 08 rates the Loyalty Points row Important, LOYALTY 08 rates the Refunds Portal row Critical. The SDD neither decides nor flags either difference.
- **Options:**
  - **A.** Show `referenceNumber` as the refund reference, key the one-take-back rule on `refundRequestId`, and run the flow at the higher rating - the member sees the number from the customer's messages, and uniqueness rests on the immutable ID.
  - **B.** Use `refundRequestId` both as the key and as the reference shown - one field, but members see an identifier they cannot relate to their refund.
- **Recommended Answer:** Option A. In §17.4 Tables Design add `refund_request_id` (uuid, required) to `refund_outcome_inbox` and `pending_take_back`, and `refund_request_id` (uuid, optional, unique where not null: one take-back per paid refund) to `points_movement`; describe `refund_ref` in each as "The refund's reference number (`referenceNumber` of the event), shown to the member as the refund reference ([LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) step 4); not unique". Add to §14.7 Outcome doctrine: "The BRDs rate this flow Important ([REFUNDS 08 § Integrations](../brd-refunds-portal/08-integrations.md#integrations)) and Critical ([LOYALTY 08 § Integrations](../brd-loyalty-points/08-integrations.md#integrations)); the platform runs it as Critical: late take-backs are SEV2 (§20.2), and the publication-log age alert of §11.4 covers it."
- **Why:** With several BRDs, a term or quality that differs must be decided or flagged; option A gives the member the reference that matches the customer's messages while the key cannot collide, and the higher rating costs nothing because §20.2 already pages SEV2. The tradeoff accepted is one more column per table.
- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log)

---

### OI-21: The poison threshold and the inbox retention are restated in each module

- **Where:** §17.1 to §17.4 Error Handling, §17.1 to §17.3 inbox tables, §11.1
- **Type:** Duplication
- **Concern:** The poison-event threshold "10 times (recommended)" is stated four times (the Error Handling of [§17.1](./13a-service-refund-request.md#error-handling), [§17.2](./13b-service-payout.md#error-handling), [§17.3](./13c-service-notification.md#error-handling), and [§17.4](./13d-service-loyalty-points.md#error-handling)), and the inbox retention "30 days (recommended)" three times (`refund_inbox`, `payout_inbox`, `notification_inbox`), with no platform home in §11.1 or §14.10. One fact has four homes, and a change to one leaves the others stale.
- **Options:**
  - **A.** State each value once in §11.1 and reference it from the modules - one fact, one home.
  - **B.** Keep the per-module copies - each chunk reads alone, but the copies drift.
- **Recommended Answer:** Option A. Add to the §11.1 Publication log bullet: "A listener that fails 10 times (recommended) leaves its row incomplete, raises the §11.4 alert, and is replayed by §20.1.3; each module's inbox keeps handled event IDs 30 days (recommended) unless its Tables Design states otherwise." In the Error Handling of §17.1 to §17.4 replace "an event that fails 10 times (recommended)" and "an outcome that fails 10 times (recommended)" with "an event over the poison threshold of §11.1", and in `refund_inbox`, `payout_inbox`, and `notification_inbox` replace "kept 30 days (recommended)" and "rows kept 30 days (recommended)" with "kept per §11.1".
- **Why:** §11's own header makes it the home of platform defaults that modules override only with a reason; option A removes copies that would drift. The tradeoff accepted is one more cross-reference per module.
- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log)

---

### OI-22: Authoring-run narration in §14.8

- **Where:** §14.8
- **Type:** Inconsistency
- **Concern:** [§14.8](./10-events-hub.md#148-consistency-notes--open-flags) ends with "(full reconciliation achieved; the master's Reconciled line records the run)", a note about the authoring run rather than settled design; run records belong in the master's Generation Progress and the decision log, and the content chunks state the design as settled.
- **Options:**
  - **A.** Delete the parenthesis - the section states the settled consistency result.
  - **B.** Keep it - the reader learns where the run is recorded, at the cost of process text in a content chunk.
- **Recommended Answer:** Option A. §14.8 reads: "No divergence is open: every event name, publisher module, listener list, and DTO in the Event Models of §17.1 to §17.4 matches §14.10 from both sides."
- **Why:** The master's Decision history note keeps the chunks to the settled design; the edit is mechanical. The tradeoff accepted is none.
- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log)

---

### OI-23: Asynchronous zone-scope replication can lose acknowledged refund requests and payout states

- **Where:** §8.6.1, §8.6.3, §8.6.4 (zone row), §4 R-01
- **Type:** Risk
- **Owner:** E2E Architect (pre-sdd-unifier)
- **Concern:** The Pre-SDD locks the zone failure scope as "Local HA only, replication asynchronous" ([PSDD/REL-05.2](../pre-sdd-refunds-platform/03c-register-reliability.md#rel-05)) with an RPO of 5 s ([PSDD/REL-04.2](../pre-sdd-refunds-platform/03c-register-reliability.md#rel-04)). With asynchronous replication a zone loss can lose refund requests already acknowledged with a reference number and payout states already sent to CardPay Ltd, against [PSDD/REL-10.1](../pre-sdd-refunds-platform/03c-register-reliability.md#rel-10) (refund money never lost or paid twice, zero missing or duplicate payouts) and [REFUNDS 01 § Business Objectives](../brd-refunds-portal/01-executive-summary-and-context.md#business-objectives) Objective 2 (every request is recorded); the SDD's R-01 mitigation ("commits the request ... before it answers") does not survive an asynchronous zone failover. The standby already runs in a second zone ([§8.6.1](./05a-infrastructure-and-network.md#861-deployment-topology)), so synchronous replication changes the replication mode, not the footprint, and its round trip stays inside one region. Handoff request: HR-004 (raised on `unifier-status.md`).
- **Options:**
  - **A.** Change the locked items in a new Pre-SDD version: REL-04.2 to 0 s, and the zone scope's replication to synchronous - a zone loss loses no acknowledged write; small added commit latency, no added standby.
  - **B.** Keep REL-04.2 and asynchronous replication; the SDD design adapts with post-failover reconciliation for the zone scope as for the region scope (OI-08) - no Pre-SDD change, but a zone failover can still drop a submitted request a customer holds a reference number for.
- **Recommended Answer:** Option A, in the Pre-SDD's terms: "REL-04.2: 0 s. DR strategy, scope az: Local HA only, replication synchronous (the standby in the second zone confirms each commit). REL-05.2's failure scope and the region scope's strategy, RPO, and RTO unchanged." The SDD then reads 0 s in the §8.6.4 zone row and "synchronous replication" in §8.6.1 and §8.6.3 when the new version arrives.
- **Why:** REL-10.1 allows zero lost or duplicate payouts and REFUNDS Objective 2 zero lost requests; at the locked load ([PSDD/CAP-01.2](../pre-sdd-refunds-platform/03b-register-capacity.md#cap-01), [PSDD/CALC-02](../pre-sdd-refunds-platform/04-targets-and-calculations.md#42-calculations)) an in-region synchronous standby adds little commit latency against the 2,000 ms of [PSDD/CAP-07.1](../pre-sdd-refunds-platform/03b-register-capacity.md#cap-07), and the standby is already paid for.
- **Status:** Open

---

### OI-24: The locked peak request rate cannot carry the locked peak of active users

- **Where:** §18.1, §18.2, §18.4
- **Type:** Inconsistency
- **Owner:** E2E Architect (pre-sdd-unifier)
- **Concern:** [PSDD/CAP-02.1](../pre-sdd-refunds-platform/03b-register-capacity.md#cap-02) (0.2292 req/s) is [PSDD/CALC-03](../pre-sdd-refunds-platform/04-targets-and-calculations.md#42-calculations), "peak_TPS × calls_per_txn × request_amplification", built only from the business transactions of [PSDD/CAP-01.1](../pre-sdd-refunds-platform/03b-register-capacity.md#cap-01). [PSDD/CAP-03.1](../pre-sdd-refunds-platform/03b-register-capacity.md#cap-03) locks 300 peak simultaneously active users, and [PSDD/CAP-08.1](../pre-sdd-refunds-platform/03b-register-capacity.md#cap-08) measures at the ingress edge. At 0.2292 req/s, 300 active users would make one request each every 1,309 s (about 22 minutes), which no list, history, or decision screen matches; the read traffic sits in the open [PSDD/CAP-10.1](../pre-sdd-refunds-platform/03b-register-capacity.md#cap-10) (CALC-19). The SDD labels CAP-02.1 "platform-wide, at the ingress edge" ([§18.1](./14-performance-and-capacity.md#181-load-estimates)) and makes it the [§18.4](./14-performance-and-capacity.md#184-stress-testing-strategy) baseline, so a load test at that rate proves almost nothing about the edge. Handoff request: HR-005 (raised on `unifier-status.md`).
- **Options:**
  - **A.** Change the locked items in a new Pre-SDD version: state that CAP-02.1 and CALC-03 count transaction-driven API calls, and add a peak edge request rate that reads CAP-03.1 and, once set, the read share of CAP-10.1 - the SDD sizes and tests to an edge rate the Pre-SDD owns.
  - **B.** Keep CAP-02.1 as the edge peak; the SDD design adapts by sizing to CAP-03.1 on its own assumption - no Pre-SDD change, but §18 then carries an SDD-made load figure beside a locked one it contradicts.
- **Recommended Answer:** Option A, in the Pre-SDD's terms: "CAP-02.1 is the peak transaction-driven API rate (CALC-03, value unchanged). A new entry sets the peak request rate at the ingress edge from CAP-03.1 (300 peak simultaneously active users) and the requests each active user makes per second (a value its owner collects), plus the read share of CAP-10.1 once set; it lands in §18.1, §18.2, and §18.4." Until the new version arrives, the SDD's §18.1 row reads "Peak transaction-driven API rate" and §18.4 keeps its 300-user scenario as the sizing test.
- **Why:** The figures are the Pre-SDD's own: 300 users at 0.2292 req/s is plain arithmetic on two locked values, and CAP-08.1 needs a rate measured where users arrive. B would make the SDD invent the load figure the Pre-SDD exists to settle.
- **Status:** Open

### OI-25: Recording and confirming a payout result by hand has no BRD use case

- **Where:** §17.2 (payout) Manual result, §7.1 Payout staff member
- **Type:** Missing scenario
- **Concern:** The design needs a manual payout result recorded by one staff member and confirmed by a second ([REFUNDS 03 § Decision record](../brd-refunds-portal/03-definitions-and-domain-concepts.md#decision-record); [REFUNDS/NFR-04](../brd-refunds-portal/10-nfrs.md#non-functional-requirements)), and §17.2 gives it two endpoints and a state, but no use case of either BRD covers it and no persona holds it. The SDD never creates a use case, so the behaviour has no §7.3 row, no acceptance criteria, and no actor the matrix authorises.
- **Options:**
  - **A.** Keep the manual result as designed in §17.2 and add a marker for the REFUNDS owner asking which use case covers it - the design stays complete; the BRD follow-up is visible.
  - **B.** Remove the manual result until the BRD adds a use case - no untraced behaviour, but a stopped payout then has no way to reach Paid, against [REFUNDS/NFR-01](../brd-refunds-portal/10-nfrs.md#non-functional-requirements).
- **Recommended Answer:** Option A. Add to §17.2 Manual result, after "No BRD use case covers this work, and its team is open (§7.1 marker):": "**[NEEDS CLARIFICATION: Which REFUNDS use case covers recording a payout result by hand and its confirmation by a second staff member? Owner: Refunds and Loyalty Product Owner.]**"
- **Why:** REFUNDS 03 states the two-person manual result as a rule, so the design needs it; only the BRD owner can add the use case, so it stays a marker listed as a BRD follow-up. The tradeoff accepted is behaviour traced to a BRD rule rather than to a use case until the BRD adds one.
- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log)

---

### OI-26: The monthly payout check has no BRD use case or reader

- **Where:** §17.2 (payout) Monthly payout check
- **Type:** Missing scenario
- **Concern:** [REFUNDS/NFR-01](../brd-refunds-portal/10-nfrs.md#non-functional-requirements) is measured by a monthly check that no payout is missing or paid twice, and [REFUNDS 04 § Personas / Actors](../brd-refunds-portal/04-scope-and-personas.md#personas--actors) asks which team does it, but no use case describes the check or what its reader does. The design runs `payout-reconciliation-monthly` with no BRD behaviour behind its output.
- **Options:**
  - **A.** Keep the scheduled check and add a marker for the REFUNDS owner asking which use case and team cover it - the measurement exists; the follow-up is visible.
  - **B.** Drop the check until the BRD adds a use case - nothing untraced, but REFUNDS/NFR-01 has no measurement.
- **Recommended Answer:** Option A. Replace in §17.2 "Who reads the result is open in the BRD ([REFUNDS 04 § Personas / Actors](../brd-refunds-portal/04-scope-and-personas.md#personas--actors))." with "Who reads the result is open in the BRD ([REFUNDS 04 § Personas / Actors](../brd-refunds-portal/04-scope-and-personas.md#personas--actors)): **[NEEDS CLARIFICATION: Which REFUNDS use case and which team cover the monthly check that no payout is missing or paid twice (REFUNDS/NFR-01)? Owner: Refunds and Loyalty Product Owner.]**"
- **Why:** The NFR's business measure needs the check; who acts on it is a business fact, so it stays a marker. The tradeoff accepted is a check whose findings wait for an owner.
- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log)

---

### OI-27: AGENTS.md reserves new dependencies, while REFUNDS mandates Spring Boot and PostgreSQL

- **Where:** §6 Backend Runtime and Primary RDBMS rows
- **Type:** Inconsistency
- **Concern:** `AGENTS.md` (its first rule) says a new third-party dependency, a library, framework, or managed service, needs the product owner's approval before a design adopts it. [REFUNDS 12 TI-01](../brd-refunds-portal/12-appendix-and-wishlist.md#technical-inputs-for-the-sdd) mandates Java 21 and Spring Boot (a framework) and [REFUNDS 12 TI-02](../brd-refunds-portal/12-appendix-and-wishlist.md#technical-inputs-for-the-sdd) mandates PostgreSQL; §6 shows both rows `Confirmed` with Source `BRD-mandated (REFUNDS)`, as a Technical Input requires (SKILL.md step 3c item 5). Whether the SoW mandate behind the Technical Inputs is the product owner's approval is not stated, so the project file and the source point different ways. The §6 rows keep the source's value until this item is decided (SKILL.md principle 19).
- **Options:**
  - **A.** Keep both rows `Confirmed` as BRD-mandated, and have the product owner confirm that the SoW mandate is the approval AGENTS.md asks for - no design change; needs the product owner's word.
  - **B.** Follow AGENTS.md: set both rows `Proposed` with a product-owner marker until approved, with an ADR for overriding the BRD mandate (SKILL.md step 3c item 5) - strict to the project file, but leaves the whole backend unsettled.
- **Recommended Answer:** Option A. Add to the Notes of the §6 Backend Runtime and Primary RDBMS rows: "The product owner's approval of this mandated dependency under AGENTS.md is recorded with OI-27." The product owner decides the item.
- **Why:** The Technical Inputs are the highest-fidelity technical signal and the SDD keeps them as stated; the decision reserved by AGENTS.md belongs to the product owner, so an answer policy cannot take this item. The tradeoff accepted is a backend stack that waits for one confirmation.
- **Status:** Open

---

### OI-28: The OI-25 marker is missing from §17.2 Manual result

- **Where:** §17.2 (payout) Manual result
- **Type:** Inconsistency
- **Concern:** OI-25 reads `Accepted - applied`, and its Resolution Log row names 13b §17.2 Manual result, but the [§17.2](./13b-service-payout.md#business-logic) Manual result paragraph still ends at "No BRD use case covers this work, and its team is open (§7.1 marker)." with no marker after it, and no chunk carries the question "Which REFUNDS use case covers recording a payout result by hand". The BRD follow-up the decision adopted is invisible in the body, and the E3 marker inventory built from the body will miss it.
- **Options:**
  - **A.** Apply the accepted text now - the body matches the recorded decision.
  - **B.** Reopen OI-25 - only right if the author chose not to apply it, which its `Accepted - applied` status contradicts.
- **Recommended Answer:** Option A. In [§17.2](./13b-service-payout.md#business-logic) Manual result, after "No BRD use case covers this work, and its team is open (§7.1 marker)." add: "**[NEEDS CLARIFICATION: Which REFUNDS use case covers recording a payout result by hand and its confirmation by a second staff member? Owner: Refunds and Loyalty Product Owner.]**"
- **Why:** An item recorded as applied must be in the body, or the Resolution Log misstates the SDD and the marker escapes the e2e gate; option A is the text the decision already accepted. The tradeoff accepted is none.
- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log)

---

### OI-29: The OI-26 marker is missing from §17.2 Monthly payout check

- **Where:** §17.2 (payout) Monthly payout check
- **Type:** Inconsistency
- **Concern:** OI-26 reads `Accepted - applied`, and its Resolution Log row names 13b §17.2 Monthly payout check, but the [§17.2](./13b-service-payout.md#business-logic) paragraph still ends with "Who reads the result is open in the BRD ([REFUNDS 04 § Personas / Actors](../brd-refunds-portal/04-scope-and-personas.md#personas--actors))." and carries no marker asking which REFUNDS use case and team cover the check of [REFUNDS/NFR-01](../brd-refunds-portal/10-nfrs.md#non-functional-requirements). The decision is recorded but not in the body.
- **Options:**
  - **A.** Apply the accepted replacement now - the body matches the recorded decision.
  - **B.** Reopen OI-26 - only right if the author chose not to apply it, which its status contradicts.
- **Recommended Answer:** Option A. In [§17.2](./13b-service-payout.md#business-logic) Monthly payout check replace "Who reads the result is open in the BRD ([REFUNDS 04 § Personas / Actors](../brd-refunds-portal/04-scope-and-personas.md#personas--actors))." with "Who reads the result is open in the BRD ([REFUNDS 04 § Personas / Actors](../brd-refunds-portal/04-scope-and-personas.md#personas--actors)): **[NEEDS CLARIFICATION: Which REFUNDS use case and which team cover the monthly check that no payout is missing or paid twice (REFUNDS/NFR-01)? Owner: Refunds and Loyalty Product Owner.]**"
- **Why:** An item recorded as applied must be in the body, or the Resolution Log misstates the SDD and the marker escapes the e2e gate; option A is the accepted text. The tradeoff accepted is none.
- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log)

---

### OI-30: Text around API-09 still lists two module ports

- **Where:** §8.1.3 and §8.3 (chunk 04), §10 ADR-03, §13 (chunk 09), §17.1 and §17.2 Boundaries, §14.9.0
- **Type:** Inconsistency
- **Concern:** OI-02 added API-09 (`RefundOutcomePort`, payout to refund-request) to §15, §16, §7.3, and the 13a and 13b Input, Integrations, and Constraints, but the text that lists the module ports or a module's integrations still shows the old set. [§8.1.3](./04-architecture-style-and-diagrams.md#813-how) lists the ports as `CardDisputePort`, `CustomerContactPort`; the [§8.3](./04-architecture-style-and-diagrams.md#83-high-level-architecture-diagram) summary says "two module ports carry the dispute and contact lookups", and Figure 3 has no `RefundOutcomePort` arrow. ADR-03 allows synchronous port calls as "queries a module needs while it answers a user, at most one hop: `CardDisputePort` ... and `CustomerContactPort`", which neither names API-09 nor covers a call from a scheduled check, so the decision that governs ports reads as excluding one the design uses. The [§13](./09-services-summary.md#13-services-decomposition-summary) Integrations cells of refund-request and payout, the §17.1 Upstream consumers, and the §17.2 Downstream dependencies omit API-09, and the §14.9.0 `Money` row does not list `ApprovedRefund.approvedAmount`.
- **Options:**
  - **A.** Update each listing - the registries and the narrative agree, and ADR-03 covers every port.
  - **B.** Leave them - §15 stays canonical, but ADR-03 reads as forbidding a port the design uses, and §13 understates the modules' integrations.
- **Recommended Answer:** Option A. In §8.1.3 read "queries through module ports (`CardDisputePort`, `CustomerContactPort`, `RefundOutcomePort`; §15.2)". In Figure 3 add `PO -->|RefundOutcomePort| RR`, and in its summary read "three module ports carry the dispute, contact, and approved-refund lookups". In ADR-03 Decision read "queries a module needs while it answers a user, or while it runs a scheduled check, are synchronous port calls, at most one hop: `CardDisputePort` (refund-request to payout), `CustomerContactPort` (notification to refund-request), and `RefundOutcomePort` (payout to refund-request, the monthly payout check)". In §13 set the refund-request Integrations cell to "Point-of-Sale Records (API-01); payout `CardDisputePort` (API-02); provides `CustomerContactPort` (API-03) and `RefundOutcomePort` (API-09)" and the payout cell to "CardPay Ltd (API-04, API-05, API-06); refund-request `RefundOutcomePort` (API-09); provides `CardDisputePort` (API-02)". In §17.1 Upstream consumers add "the payout module through `RefundOutcomePort` ([API-09](./11-api-contracts.md#api-09-approved-refunds-of-a-period-payout---refund-request))", and in §17.2 Downstream dependencies add "refund-request's `RefundOutcomePort` ([API-09](./11-api-contracts.md#api-09-approved-refunds-of-a-period-payout---refund-request))". In the §14.9.0 `Money` row add "`approvedAmount` of `ApprovedRefund` (API-09)" to Used by.
- **Why:** ADR-03 must cover each port it governs, and every listing must follow the §15 registry for one fact to keep one home. The tradeoff accepted is edits in five chunks.
- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log)

---

### OI-31: Region recovery starts the deployable before payout sending is turned off

- **Where:** §20.1.5 B steps 2 to 3c, §11.5 Feature flags
- **Type:** Corner case
- **Concern:** [§20.1.5](./16-operations-runbook.md#2015-database-failover) B step 3 scales refunds-platform from 0 in the recovery region, and only step 3a says the `payout-sending` switch "stays off". The switch is a row of `feature_switch` ([§11.5](./07-cross-cutting-concerns.md#115-configuration-management-default)), which the cross-region replica copies from prod, where it is on; the promoted database therefore starts with sending on, and the payout relay and `payout-retry` run as soon as the replicas start in step 3, before the reconciliation of step 3b. The order of the steps defeats the protection against paying twice in the data-loss window ([REFUNDS/NFR-01](../brd-refunds-portal/10-nfrs.md#non-functional-requirements)).
- **Options:**
  - **A.** Turn the switch off in the promoted database before any replica starts, and confirm it before reconciling - one step moved, no new mechanism.
  - **B.** Start the dr deployable with payout sending disabled by an environment setting that overrides the switch until an operator clears it - safe even if a step is forgotten, but a second control for the same behaviour.
- **Recommended Answer:** Option A. In §20.1.5 B insert after step 2: "2a. In the promoted database, set the `payout-sending` switch off (§11.5) before any replica starts." Replace step 3a with: "3a. Confirm `payout-sending` is off: `payout_outbox_oldest_seconds` grows and no API-04 call is logged." Add to §11.5 after the `payout-sending` switch: "The switch is a row of `feature_switch` and is replicated with the database, so a region recovery sets it off in the promoted database before the dr deployable starts (§20.1.5)."
- **Why:** Option A follows where the switch really lives, in the replicated data, and closes the window with one step and one check; B adds a second control for the same thing. The tradeoff accepted is an operator step, whose omission the check in step 3a catches.
- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log)

---

### OI-32: The missing-payout procedure replays a publication row that may be completed or deleted

- **Where:** §20.1.8 step 2, §20.1.3, §11.1 Publication log, §17.1 Platform operations
- **Type:** Missing scenario
- **Concern:** [§20.1.8](./16-operations-runbook.md#2018-monthly-payout-check-finding) step 2 recovers a missing payout by finding the request's `RefundRequestApproved` row in `event_publication` and replaying it by §20.1.3. The monthly check runs on the first day of the month for the whole past month, while [§11.1](./07-cross-cutting-concerns.md#111-db-modeling-default) deletes completed publication rows and inbox IDs after 30 days, and the redelivery endpoint redelivers only an incomplete row. A payout missing because its listener completed without creating a payout leaves a completed row, often already deleted, so the procedure has nothing to replay and the missing payout of [REFUNDS/NFR-01](../brd-refunds-portal/10-nfrs.md#non-functional-requirements) has no recovery path.
- **Options:**
  - **A.** Let refund-request publish `RefundRequestApproved` again for an approved request with no payout, as a new publication row for the payout listener only, through a management-port operation - works whatever the publication log keeps, and the payout module's rule that a second approval reuses the existing payout (§17.2 Constraints) makes it safe.
  - **B.** Keep completed approval rows until the next monthly check has run and allow redelivery of a completed row - reuses §20.1.3, but lengthens retention and bypasses the inbox check of its step 3.
- **Recommended Answer:** Option A. Add to the §17.1 Platform operations List of APIs: "| POST | `/v1/operations/refund-requests/{refundRequestId}/approval-republication` | Publish `RefundRequestApproved` again, for the payout listener only, for an Approved request whose payout is missing | - | `RedeliveryAccepted` | `platform.event-publication.redeliver` | - |", served on the management port only; the new publication row carries a new event ID and the request's current `aggregateVersion`, and a request that is not `APPROVED` answers 409 `REFUND_NOT_APPROVED`. Replace §20.1.8 step 2 with: "2. For a missing payout: confirm the refund request is still Approved and has no payout row; publish its approval again with `POST /v1/operations/refund-requests/{refundRequestId}/approval-republication` on the management port; confirm the payout row exists."
- **Why:** The missing payout is the failure REFUNDS/NFR-01 counts, and option A recovers it from refund-request's own state, which the 10-year retention keeps, relying on the existing reuse rule for safety; B depends on rows the platform deletes by design. The tradeoff accepted is one more operations endpoint under the existing token.
- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log)

---

### OI-33: The `receipt_lookup.lines` JSON column breaks §11.1, and no step writes the lookup row

- **Where:** §11.1 JSON columns, §17.1 `receipt_lookup` and [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) steps 1-2, §8.5.1
- **Type:** Inconsistency
- **Concern:** [§11.1](./07-cross-cutting-concerns.md#111-db-modeling-default) now allows JSON for "the provider's receipt lines kept for one lookup" in the same sentence that forbids JSON "for business fields that a rule or a query reads", yet submit reads the amounts in `receipt_lookup.lines` to re-check the refund rules and to set every item amount ([§17.1](./13a-service-refund-request.md#business-logic) steps 5-7). Steps 1-2 also never say that the lookup writes the `receipt_lookup` row and returns `lookupId`, and [§8.5.1](./05-workflows-and-sequences.md#851-sequence-submit-a-refund-request) shows neither, so the submit's input has no stated producer.
- **Options:**
  - **A.** Store the lines as rows of a child table and restore §11.1's JSON rule - the refund rules read typed columns.
  - **B.** Keep the JSON column and narrow §11.1 to allow rules to read it within one lookup's life - less schema, but a weaker platform rule other modules may cite.
- **Recommended Answer:** Option A. In §17.1 remove `receipt_lookup.lines` and add the table `receipt_lookup_line` ("One item line of one lookup, deleted with its lookup"): `id` uuid, required, UUIDv7 primary key; `receipt_lookup_id` uuid, required, indexed; `receipt_line_ref` varchar(64), required; `description` varchar(255), required; `quantity` integer, required; `line_amount` numeric(19,4), required (the amount Point-of-Sale Records gives for the line). Add `RECEIPT_LOOKUP ||--|{ RECEIPT_LOOKUP_LINE : has` to the §17.1 ERD, and make `receipt-lookup-purge` delete the lines with their lookup. Restore the §11.1 JSON columns bullet to "only for event payloads (`event_publication.payload`) and raw provider notifications kept for audit; never for business fields that a rule or a query reads." Add to §17.1 [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) steps 1-2: "The lookup writes a `receipt_lookup` row with its lines and returns its ID as `lookupId` with the items." In §8.5.1 read `RR-->>C: refundable items, blocked items with reasons, lookupId` and `C->>RR: POST /v1/refund-requests with Idempotency-Key and lookupId`.
- **Why:** Option A keeps a platform rule intact and gives the refund rules the typed data they read; B weakens the rule for every module. The tradeoff accepted is one more small table.
- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log)

---

### OI-34: Figures 4 and 5 omit the identity provider

- **Where:** §8.6.6 Figure 4, §8.7.8 Figure 5
- **Type:** Inconsistency
- **Concern:** OI-09 added identity-provider and its database to §8.6.2 to §8.6.4, §8.7.2, §8.7.7, and §20.1.5, but the [deployment diagram](./05a-infrastructure-and-network.md#866-deployment-diagram) and the [network diagram](./05a-infrastructure-and-network.md#878-network-diagram), and their summaries, still show only refunds-platform, so the figures disagree with the tables they draw and hide a component the recovery depends on.
- **Options:**
  - **A.** Add the identity provider to both figures and their summaries - figures and tables agree.
  - **B.** Leave the figures - the tables stay canonical, but readers who start from the figures miss the identity provider.
- **Recommended Answer:** Option A. In Figure 4 add `IDP1[identity-provider replica]` in Zone A and `IDP2[identity-provider replica]` in Zone B, each reached from `LB` and connected to `DBP`, and `IDPDR[identity-provider - 0 replicas until failover]` in the recovery region with `IDPDR -.on failover.-> DBR`; its summary reads "The primary region runs two replicas each of refunds-platform and identity-provider behind the managed load balancer in two zones, ... the recovery region holds an asynchronous cross-region replica and idle deployables that are scaled up on failover, ...". In Figure 5 add `IDP[identity-provider replicas]` in the Application zone with `LB -->|HTTPS| IDP` and `IDP -->|TLS 5432| DB`, and add to its summary "the load balancer also serves the identity provider's sign-in pages".
- **Why:** The figures are what infrastructure reviewers read first, and they must match §8.6.2. The tradeoff accepted is none.
- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log)

---

### OI-35: §16.2 and §16.6 miss the operator role and the `member_ref` claim

- **Where:** §16.2 steps 2 and 4, §16.6, §16.9.2
- **Type:** Inconsistency
- **Concern:** OI-16 gave `PLATFORM_OPERATOR` a permission token through the identity provider's staff client, and OI-14 added the claim `member_ref` to ADR-06, but [§16.2](./12-centralized-user-roles.md#162-resolution-model---how-a-role-becomes-an-allowed-action) step 2 still lists the roles claim as `CUSTOMER`, `MEMBER`, `BRANCH_MANAGER`, `PAYOUT_STAFF` and names only `branch_id` as an extra claim, step 4's membership gate does not use `member_ref` for the first sign-in link, and §16.6 and Figure §16.9.2 name no grantor for the `PLATFORM_OPERATOR` role in the identity provider. The resolution model every endpoint follows would not map the operator's token to its token, and the role's assignment has no rule.
- **Options:**
  - **A.** Extend §16.2, §16.6, and §16.9.2 - the model covers every role and claim the design uses.
  - **B.** Leave them - §16.3 and §16.11 name the operator, but the resolution model and the grant rules stay silent on it.
- **Recommended Answer:** Option A. In §16.2 step 2 read: "the token's `roles` claim gives the role (`CUSTOMER`, `MEMBER`, `BRANCH_MANAGER`, `PAYOUT_STAFF`, or `PLATFORM_OPERATOR` for the operations endpoint); staff tokens carry `branch_id` for a branch manager, and member tokens carry `member_ref` (ADR-06)". In step 4 read "membership (a member who left is refused; a first sign-in links the member row through `member_ref`, §17.4)". Add to §16.6: "| `PLATFORM_OPERATOR` | `PLATFORM_OPERATOR` (operator role in the identity provider's staff client) | A second operator approves each assignment (§8.7.6); who in the business requests it follows the staff-role marker above |", and to Figure §16.9.2 `OP -->|assigns operator role, second operator approves| OP2[PLATFORM_OPERATOR]`.
- **Why:** §16.2 is the model AP-09's deny-by-default check follows, so a role or claim missing there cannot pass it, and a role with no grant rule can be given by anyone with identity-provider admin rights. The tradeoff accepted is a few lines in chunk 12.
- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log)

---

### OI-36: Stale wording left by OI-01, OI-05, and OI-06

- **Where:** §14.7 Personal data doctrine; §17.2 `payout_outbox` table; §17.2 Results in other states
- **Type:** Inconsistency
- **Concern:** Three phrases next to applied text now contradict it. [§14.7](./10-events-hub.md#147-universal-subscribers--cross-service-doctrines) still says "a listener that needs contact details reads them through `CustomerContactPort` (API-03)", while after OI-01 no listener reads contact details and API-03 is called "by the notification relay, never by an event listener". The [§17.2](./13b-service-payout.md#tables-design) `payout_outbox.payout_id` description still says "the idempotency key sent is the payout ID", while after OI-05 the key is the attempt's `payout_attempt.idempotency_key` (`<payout ID>-<key_generation>` after a definitive refusal or return). The §17.2 Results in other states row for `CANCELLED` with a provider acceptance points to §20.1.7 (Stopped Payout), which does not handle a payout accepted after cancellation; the duplicate-payout handling is §20.1.8 step 3.
- **Options:**
  - **A.** Correct the three phrases - the body agrees with its decisions.
  - **B.** Leave them - the applied paragraphs win on a careful read, but each phrase misleads a reader who meets it first.
- **Recommended Answer:** Option A. In §14.7 read "no event carries customer contact details or member data beyond identifiers; the notification relay reads contact details through `CustomerContactPort` (API-03) at send time, and no event listener reads them." In the `payout_outbox` table set `payout_id` to "The payout; the key sent is the attempt's `idempotency_key` (`payout_attempt`)". In the §17.2 Results in other states row for `CANCELLED` read "(a possible double refund, §20.1.8 step 3)".
- **Why:** Each phrase sits beside the applied decision it contradicts, and an LLD reader cannot tell which wins; the edits are mechanical. The tradeoff accepted is none.
- **Status:** Accepted - applied
- **Resolution:** [Resolution Log](#resolution-log)

---

### OI-37: ADR-02's version rule would drop the approval that §20.1.8 publishes again

- **Where:** §10 ADR-02 Consequences, §17.1 Platform operations (approval republication), §17.2 Constraints, §16.4.3, §8.7.7
- **Type:** Contract mismatch
- **Concern:** OI-32 added `POST /v1/operations/refund-requests/{refundRequestId}/approval-republication`, whose new publication row "carries a new event ID and the request's current `aggregateVersion`" ([§17.1](./13a-service-refund-request.md#constraints)), so that the payout listener creates a missing payout. ADR-02 Consequences say that "a listener that changes state applies an event only when its `aggregateVersion` is higher than the last one it applied for that aggregate, completing an older or equal event with no effect". In the case the operation exists for, the payout listener has already applied the original approval (it completed without creating a payout), and the request has not changed since, so the republished event carries an equal version and ADR-02 tells the listener to complete it with no effect: the missing payout of [REFUNDS/NFR-01](../brd-refunds-portal/10-nfrs.md#non-functional-requirements) is never created. The listings of the operator's endpoints also still name only the redelivery: §16.4.3 ("redeliver one incomplete event (§20.1.3)") and the §8.7.7 row "Operations endpoint (§20.1.3)".
- **Options:**
  - **A.** State that the payout module's `RefundRequestApproved` listener is idempotent by state (one non-cancelled payout per refund request, §17.2 Constraints) and is exempt from the version rule - the republished approval works, and a duplicate still creates no second payout.
  - **B.** Give the republished event a version higher than the request's current one - keeps one rule for all listeners, but the event then carries a version no state change produced, which other listeners would misread.
- **Recommended Answer:** Option A. Add to ADR-02 Consequences after "notification sends one message per event and needs no order": "the payout module's `RefundRequestApproved` listener is idempotent by state instead (one non-cancelled payout per refund request, §17.2 Constraints) and does not apply the version rule, so an approval published again by the operations endpoint of §17.1 creates a missing payout and never a second one." Add to §17.2 Constraints after the one-payout rule: "This rule, not `aggregateVersion`, makes the approval listener idempotent (ADR-02)." In §16.4.3 read "redeliver one incomplete event (§20.1.3) and publish an approval again for a missing payout (§20.1.8), audited", and in the §8.7.7 Administrative access row read "Operations endpoints (§20.1.3, §20.1.8)".
- **Why:** The operation exists to recover the one case the version rule would discard, and the payout module already guards against duplicates by state; B makes a fake version that the notification and loyalty-points listeners would also see. The tradeoff accepted is one documented exception to the ADR-02 rule.
- **Status:** Decided - pending application
- **Decision:** Accept the Recommended Answer, decided 2026-10-27 by Policy: accept the recommended option (set by the tester (fixture), 2026-10-27). Raised by the last review pass of this request (pass 3 of 3), so it is collected for application by the next request that changes this SDD (SKILL.md step 8 item 3).

---

### OI-38: The ports table has no row for the identity provider's database connection

- **Where:** §8.7.7, §8.7.8 Figure 5
- **Type:** Inconsistency
- **Concern:** OI-34 drew `IDP -->|TLS 5432| DB` in [Figure 5](./05a-infrastructure-and-network.md#878-network-diagram), and the identity database sits on the same PostgreSQL service (§8.6.3), but the [§8.7.7](./05a-infrastructure-and-network.md#877-ports-and-protocols) ports table has only "refunds-platform | PostgreSQL primary | 5432". The network policies of §8.7.5 allow only the flows of §8.7.7, so as written the identity provider cannot reach its database.
- **Options:**
  - **A.** Add the row to §8.7.7 - the table, the figure, and the deny-by-default policy agree.
  - **B.** Remove the arrow from Figure 5 - the figure matches the table, but the identity provider then has no database path.
- **Recommended Answer:** Option A. Add to §8.7.7 after the refunds-platform to PostgreSQL row: "| identity-provider | PostgreSQL primary | 5432 | PostgreSQL over TLS | The `identity` database | registered port |".
- **Why:** §8.7.5 denies every flow §8.7.7 does not list, so a missing row is a missing permission, not only a missing description. The tradeoff accepted is none.
- **Status:** Decided - pending application
- **Decision:** Accept the Recommended Answer, decided 2026-10-27 by Policy: accept the recommended option (set by the tester (fixture), 2026-10-27). Raised by the last review pass of this request (pass 3 of 3), so it is collected for application by the next request that changes this SDD (SKILL.md step 8 item 3).

---

## Resolution Log

<!-- When an open item is decided, or settled by an upstream change, add its row here with a pointer to the SDD update (chunk + heading). Audit trail. A source is `[KEY] v[X.X]` or a business review point (brd-to-sdd.md § Changes after the SDD exists). -->

| ID | Resolution Date | Resolved In | Outcome |
|----|----------------|-------------|---------|
| OI-01 | 2026-10-27 | 13c §17.3 Business Logic, diagrams, Integrations; 05 §8.5.1; 11 API-03 | Accepted recommendation |
| OI-02 | 2026-10-27 | 11 §15.2, §15.3 API-09, §15.4; 13a and 13b Input, Integrations, Constraints; 12 §16.4.3, §16.7, §16.9.1, §16.11, §16.12.2; 03 §7.3 | Accepted recommendation |
| OI-03 | 2026-10-27 | 06 ADR-02 | Accepted recommendation |
| OI-04 | 2026-10-27 | 06 ADR-02; 10 §14.10; 13a to 13d Event Models and Tables Design | Accepted recommendation |
| OI-05 | 2026-10-27 | 13b §17.2 Retry, Tables Design, Developer Notes; 05 §8.4.2, §8.5.3; 11 API-04 | Accepted recommendation |
| OI-06 | 2026-10-27 | 13b §17.2 state machine and Results in other states; 07 §11.4 | Accepted recommendation |
| OI-07 | 2026-10-27 | 13b §17.2 Send, Card dispute, state machine | Accepted recommendation |
| OI-08 | 2026-10-27 | 16 §20.1.5 B; 13b §17.2 Result; 07 §11 and §11.5; 05a §8.6.3, §8.7.3; 01 §4 R-08 | Accepted recommendation |
| OI-09 | 2026-10-27 | 05a §8.6.2, §8.6.3, §8.6.4, §8.7.2, §8.7.7; 16 §20.1.5 B | Accepted recommendation |
| OI-10 | 2026-10-27 | 15 §19; 05a §8.6.2 | Accepted recommendation |
| OI-11 | 2026-10-27 | 13a §17.1 [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) steps 5-7, Input, Tables Design, Retention, Error Handling; 07 §11.1 | Accepted recommendation |
| OI-12 | 2026-10-27 | 13a §17.1 API Standards | Accepted recommendation |
| OI-13 | 2026-10-27 | 13a §17.1 [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund), Tables Design, Error Handling, Metrics | Accepted recommendation |
| OI-14 | 2026-10-27 | 13d §17.4 Membership and `member`; 06 ADR-06 | Accepted recommendation |
| OI-15 | 2026-10-27 | 07 §11.5; 13d §17.4 Take-back | Accepted recommendation |
| OI-16 | 2026-10-27 | 13a §17.1 List of APIs and Constraints; 12 §16.3, §16.4.3, §16.7, §16.11, §16.12.2; 05a §8.7.7; 16 §20.1.3 | Accepted recommendation |
| OI-17 | 2026-10-27 | 07 §11.4; 16 §20.1.8 to §20.1.10 | Accepted recommendation |
| OI-18 | 2026-10-27 | 14 §18 header comment, §18.1, §18.2; 07 §11.4; 05a §8.6.4 | Adjusted: applied without the PSDD/CALC-11 citation |
| OI-19 | 2026-10-27 | - | Rejected (No change: the §7.3 row follows the trigger tie and the Events column rule) |
| OI-20 | 2026-10-27 | 13d §17.4 Tables Design and Take-back; 10 §14.7 | Accepted recommendation |
| OI-21 | 2026-10-27 | 07 §11.1; 13a to 13d Error Handling and Tables Design | Accepted recommendation |
| OI-22 | 2026-10-27 | 10 §14.8 | Accepted recommendation |
| OI-25 | 2026-10-27 | 13b §17.2 Manual result | Accepted recommendation |
| OI-26 | 2026-10-27 | 13b §17.2 Monthly payout check | Accepted recommendation |
| OI-28 | 2026-10-27 | 13b §17.2 Manual result (marker present after the rebuild of the chunks) | Accepted recommendation |
| OI-29 | 2026-10-27 | 13b §17.2 Monthly payout check (marker present after the rebuild of the chunks) | Accepted recommendation |
| OI-30 | 2026-10-27 | 04 §8.1.3, Figure 3; 06 ADR-03; 09 §13; 13a and 13b Boundaries; 10 §14.9.0 | Accepted recommendation |
| OI-31 | 2026-10-27 | 16 §20.1.5 B; 07 §11.5 | Accepted recommendation |
| OI-32 | 2026-10-27 | 13a §17.1 List of APIs and Constraints; 16 §20.1.8 | Accepted recommendation |
| OI-33 | 2026-10-27 | 13a §17.1 [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund), ERD, Tables Design, Retention, Input; 07 §11.1; 05 §8.5.1 | Accepted recommendation |
| OI-34 | 2026-10-27 | 05a Figures 4 and 5 | Accepted recommendation |
| OI-35 | 2026-10-27 | 12 §16.2, §16.6, §16.9.2 | Accepted recommendation |
| OI-36 | 2026-10-27 | 10 §14.7; 13b §17.2 Tables Design and Results in other states | Accepted recommendation |

---

## Reviewer Notes

<!-- Coverage record first (required): one row per risk surface in the review brief (SKILL.md step 7), each either "checked: N findings (OI IDs)" or "checked: no issue found", with what was checked. A zero-finding review is valid. A delta review (SKILL.md step 7, On an update) keeps these rows and adds one dated row per changed chunk, labelled `[YYYY-MM-DD] delta: chunk NN (vX.X)`; a scoped application check adds one dated row per checked item, labelled `[YYYY-MM-DD] application check: OI-NN (vX.X)`, whose Checked cell names every chunk the item changed (`chunks 02 and 11`). The brackets are part of each label: `[2026-10-07] delta: chunk 13a (v1.8)`, `[2026-10-07] application check: OI-45 (v1.7)`. vX.X is the SDD version when the review runs; earlier rows keep their labels. An update that only applies pending items (SKILL.md step 7, On an update) starts with application check rows; an update that also runs a delta review covers them in its delta rows. Then optional free-form notes that did not crystallise into a numbered open item. -->

| Risk surface | Checked | Findings | Notes |
|---|---|---|---|
| Architecture style fit | ADR-01 against the drivers (first production releases, one team by assumption, [PSDD/CAP-01.1](../pre-sdd-refunds-platform/03b-register-capacity.md#cap-01), [PSDD/CAP-02.1](../pre-sdd-refunds-platform/03b-register-capacity.md#cap-02), [PSDD/CAP-04.1](../pre-sdd-refunds-platform/03b-register-capacity.md#cap-04)); §8.1.3 bounded contexts; hexagonal ports in §6 and 13x; outbox for the two provider writes (payout, message) versus the synchronous reads (receipt lookup, dispute, contact) and the in-process events | 3 findings (OI-01, OI-02, OI-03) | The modular monolith fits the drivers; both durable cross-process effects go through an outbox. |
| ADR completeness | ADR-01 to ADR-10 against the handoff guide § 12.4 (ADR-PERF-001 in ADR-09, ADR-INT-001 in ADR-08, ADR-IAM-001 in ADR-06, no ADR-MIG-001) and against the §6 rows and §11 mechanisms | 1 finding (OI-03) | |
| Cross-cutting concerns | §11.1 to §11.6 against §6, AP-01 to AP-12, and the 13x sections that inherit them | 2 findings (OI-12, OI-21) | |
| Per-service contract completeness | §17.1 to §17.4: inputs, state machines, tables, Lists of APIs, error handling | 4 findings (OI-06, OI-07, OI-11, OI-14) | |
| Event contract consistency | All 11 events: name, publisher, listeners, transaction phase, and DTO fields in §14.10 against the Event Models of 13a to 13d, character for character; one publisher per handled event; §14.7 doctrines | 1 finding (OI-04) | Names, publishers, listeners, and DTO fields match verbatim. |
| Role catalogue consistency | §16.3 to §16.12 against the 13x Constraints and Lists of APIs, the §15 internal tokens, and §20 | 1 finding (OI-16) | OI-02 also adds `PAYOUT_MODULE`. |
| API contract completeness | §15.1 scope (database, secrets, identity provider exempt; provider and port integrations covered); API-02 and API-03 port, operation, DTOs, errors with `errorCode`, token, behaviour, no URI; API-01, API-04 to API-08 `TBD - external` with no invented field; chain depth | 1 finding (OI-02) | No synchronous chain deeper than one hop. |
| NFR realisability | §18.5 rows for every NFR of [REFUNDS 10](../brd-refunds-portal/10-nfrs.md#non-functional-requirements) and [LOYALTY 10](../brd-loyalty-points/10-nfrs.md#non-functional-requirements) on the locked values; §18 against the handoff guide § 12.3 | 3 findings (OI-18, OI-23, OI-24) | |
| Integration error paths and timeouts | §12 INT-01 to INT-03, API-01 to API-08 fallbacks, payout retry, dispute hold, provider notifications | 3 findings (OI-05, OI-06, OI-07) | |
| Multi-tenancy edge cases | §11.2, ADR-05, §15.1 tenant header, the 13x tenancy sections, §8.7.5 | No issue found | The model waits for [PSDD/DAT-07.1](../pre-sdd-refunds-platform/03d-register-data.md#dat-07), marked inline; queries are scoped to the caller meanwhile. |
| Observability gaps | §11.4, the 13x logging, metrics, and tracing, alerts against the NFRs and the schedules | 1 finding (OI-17) | |
| Security and compliance hooks | §11.6 and §16 against the matrices of [REFUNDS 07](../brd-refunds-portal/07-users-use-cases-matrix.md#users--use-cases-matrix) and [LOYALTY 07](../brd-loyalty-points/07-users-use-cases-matrix.md#users--use-cases-matrix), inbound provider verification, the audit record, personal data in events and logs | 2 findings (OI-13, OI-16) | The per-module authorization agrees with both matrices and their footnotes. |
| Deployment failure modes | §11.3 rolling update and migrations, zone and region failover, recovery drills, relays after failover | 2 findings (OI-08, OI-10) | |
| Infrastructure and network | §8.6 and §8.7: every fact linked to its home, no invented IP range, CIDR, hostname, or vendor product, an egress row per §12 row | 2 findings (OI-08, OI-09) | INT-01 to INT-03 each have an egress row. |
| Runbook completeness | §20.1 to §20.3 against the DR strategy, the schedules, the switches, and the alerts | 2 findings (OI-16, OI-17) | |
| BRD-to-SDD traceability | §7.3 as the checklist: one owner and an entry point per UC of both BRDs, each cell against §13, 13x, and §14.10, every UC link opening its BRD heading; cross-BRD persona, term, quality, and mandate | 3 findings (OI-14, OI-19, OI-20) | All 767 relative links to the BRDs and the Pre-SDD resolve to an existing heading. |
| Duplication | BRD content referenced rather than restated; chunk 11 against 13x contract fields; scalar facts with one home | 1 finding (OI-21) | |
| Decision-process narration | Content chunks 01 to 17 for run notes, option letters, and decision history | 1 finding (OI-22) | |
| Pre-SDD locked items | Each item of the handoff guide § 12.2 where it lands; disagreements raised to the E2E Architect | 2 findings (OI-23, OI-24) | Both carry the E2E Architect owner line; OI-18 covers the missing CALC citations. |
| [2026-10-27] application check: OI-01 (v1.0) | chunks 05, 11, and 13c (§8.5.1, API-03, §17.3), and the dependent text of chunk 10 | 1 finding (OI-36) | The listener no longer reads contacts; `SKIPPED` added; §14.7 still names a listener. |
| [2026-10-27] application check: OI-02 (v1.0) | chunks 03, 11, 12, 13a, and 13b (§7.3, §15.2 to §15.4, §16, §17.1, §17.2), and the dependent text of chunks 04, 06, 09, and 10 | 1 finding (OI-30) | API-09 contract, `PAYOUT_MODULE`, token, and counts agree; port listings outside them do not. |
| [2026-10-27] application check: OI-03 (v1.0) | chunk 06 (ADR-02) | No issue found | |
| [2026-10-27] application check: OI-04 (v1.0) | chunks 06, 10, 13a, 13b, 13c, and 13d | No issue found | `aggregateVersion` in all 11 DTOs; §14.10 and the 13x Event Models match character for character. |
| [2026-10-27] application check: OI-05 (v1.0) | chunks 05, 11, and 13b (§8.4.2, §8.5.3, API-04, §17.2) | 1 finding (OI-36) | `payout_outbox` still names the payout ID as the key. |
| [2026-10-27] application check: OI-06 (v1.0) | chunks 07 and 13b (§11.4, §17.2) | 1 finding (OI-36) | The `CANCELLED` row points to §20.1.7. |
| [2026-10-27] application check: OI-07 (v1.0) | chunk 13b (§17.2 Send, Card dispute, state machine) | No issue found | |
| [2026-10-27] application check: OI-08 (v1.0) | chunks 01, 05a, 07, 13b, and 16 (§4 R-08, §8.6.3, §8.7.3, §11, §11.5, §17.2, §20.1.5 B) | 1 finding (OI-31) | Text applied; the step order lets payouts start before the switch is off. |
| [2026-10-27] application check: OI-09 (v1.0) | chunks 05a and 16 (§8.6.2 to §8.6.4, §8.7.2, §8.7.7, §20.1.5 B) | 1 finding (OI-34) | Tables applied; Figures 4 and 5 not. |
| [2026-10-27] application check: OI-10 (v1.0) | chunks 05a and 15 (§8.6.2, §19) | No issue found | |
| [2026-10-27] application check: OI-11 (v1.0) | chunks 07 and 13a (§11.1, §17.1) | 1 finding (OI-33) | The JSON exception contradicts its own sentence; the lookup step never writes the row. |
| [2026-10-27] application check: OI-12 (v1.0) | chunk 13a (§17.1 API Standards) | No issue found | |
| [2026-10-27] application check: OI-13 (v1.0) | chunk 13a (§17.1 [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund), Tables Design, ERD, Error Handling, Metrics) | No issue found | |
| [2026-10-27] application check: OI-14 (v1.0) | chunks 06 and 13d (ADR-06, §17.4) | 1 finding (OI-35) | §16.2 does not carry `member_ref`. |
| [2026-10-27] application check: OI-15 (v1.0) | chunks 07 and 13d (§11.5, §17.4) | No issue found | |
| [2026-10-27] application check: OI-16 (v1.0) | chunks 05a, 12, 13a, and 16 (§8.7.7, §16.3, §16.4.3, §16.7, §16.11, §16.12.2, §17.1, §20.1.3) | 1 finding (OI-35) | §16.2 roles and §16.6 grants omit the operator. |
| [2026-10-27] application check: OI-17 (v1.0) | chunks 07 and 16 (§11.4, §20.1.8 to §20.1.10) | 1 finding (OI-32) | Text applied; the missing-payout step depends on rows the platform deletes. |
| [2026-10-27] application check: OI-18 (v1.0) | chunks 05a, 07, and 14 (§8.6.4, §11.4, §18 header, §18.1, §18.2) | No issue found | Applied as adjusted, without the PSDD/CALC-11 citation. |
| [2026-10-27] application check: OI-20 (v1.0) | chunks 10 and 13d (§14.7, §17.4) | No issue found | |
| [2026-10-27] application check: OI-21 (v1.0) | chunks 07, 13a, 13b, 13c, and 13d (§11.1, Error Handling, inbox tables) | No issue found | |
| [2026-10-27] application check: OI-22 (v1.0) | chunk 10 (§14.8) | No issue found | |
| [2026-10-27] application check: OI-25 (v1.0) | chunk 13b (§17.2 Manual result) | 1 finding (OI-28) | The marker is not in the body. |
| [2026-10-27] application check: OI-26 (v1.0) | chunk 13b (§17.2 Monthly payout check) | 1 finding (OI-29) | The marker is not in the body. |
| [2026-10-27] application check: OI-28 (v1.0) | chunk 13b (§17.2 Manual result) | No issue found | The marker follows the §7.1 sentence. |
| [2026-10-27] application check: OI-29 (v1.0) | chunk 13b (§17.2 Monthly payout check) | No issue found | |
| [2026-10-27] application check: OI-30 (v1.0) | chunks 04, 06, 09, 10, 13a, and 13b (§8.1.3, Figure 3, ADR-03, §13, §14.9.0, Boundaries) | No issue found | |
| [2026-10-27] application check: OI-31 (v1.0) | chunks 07 and 16 (§11.5, §20.1.5 B) | No issue found | |
| [2026-10-27] application check: OI-32 (v1.0) | chunks 13a and 16 (§17.1 List of APIs and Constraints, §20.1.8), and the dependent text of chunks 05a, 06, 12, and 13b | 1 finding (OI-37) | The ADR-02 version rule discards the republished approval. |
| [2026-10-27] application check: OI-33 (v1.0) | chunks 05, 07, and 13a (§8.5.1, §11.1, §17.1) | No issue found | |
| [2026-10-27] application check: OI-34 (v1.0) | chunk 05a (Figures 4 and 5), and the dependent §8.7.7 | 1 finding (OI-38) | Figure 5's identity-provider database flow has no §8.7.7 row. |
| [2026-10-27] application check: OI-35 (v1.0) | chunk 12 (§16.2, §16.6, §16.9.2) | No issue found | |
| [2026-10-27] application check: OI-36 (v1.0) | chunks 10 and 13b (§14.7, §17.2 Tables Design, Results in other states) | No issue found | |

- Inline markers were not raised again, among them the payout retry duration, the payouts that can never succeed, the branch manager's message channel, CardPay Ltd's push or query, the currency, [PSDD/INT-03.1](../pre-sdd-refunds-platform/03f-register-integration.md#int-03) to INT-03.3, [PSDD/INT-06.1](../pre-sdd-refunds-platform/03f-register-integration.md#int-06), [PSDD/DAT-09.1](../pre-sdd-refunds-platform/03d-register-data.md#dat-09), [PSDD/SEC-03.1](../pre-sdd-refunds-platform/03e-register-security.md#sec-03), and the PSDD/QD-07 question in §8.6.4 and §18.5.
- Scope proposal: a payout-area screen that shows the monthly payout check results to payout staff. Source: [REFUNDS/NFR-01](../brd-refunds-portal/10-nfrs.md#non-functional-requirements) and the open team question of [REFUNDS 04 § Personas / Actors](../brd-refunds-portal/04-scope-and-personas.md#personas--actors). Recommendation: wait until the BRD names the team that checks; the alert of OI-17 covers the findings meanwhile. Tradeoff: a screen now may serve a team that does not exist yet.
- Scope proposal: an email to payout staff when a payout stops at the retry limit. Source: §17.2 and §20.1.7; no BRD asks for it. Recommendation: not now, the `payouts_stopped` alert reaches operators. Tradeoff: staff rely on operators to learn of stopped payouts.
- Out of scope, for the next review: chunk 00 Changes Log still holds only the initial-build row, and the Clarification register of `decision-log.md` still reads "No open item has been decided yet", although the acceptance loop decided OI-01 to OI-22, OI-25, and OI-26; neither file is applied text of a checked item. Resolved in v1.0.

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 17-appendix-and-wishlist.md | NEXT: 19-e2e-system-design.md -->

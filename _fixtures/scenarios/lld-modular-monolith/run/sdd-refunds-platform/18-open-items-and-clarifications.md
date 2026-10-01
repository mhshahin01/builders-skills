<!--
CHUNK: 18
TITLE: Open Items & Clarifications
PROJECT: Refunds Platform
VERSION: 1.1
DEPENDS_ON: all preceding SDD chunks (00 through 17)
GATES: chunk 19 (End-to-End System Design). Chunk 19 is written only after every item here is resolved: Accepted - applied, Adjusted - applied, or Rejected. Open and Deferred items keep the gate shut (SKILL.md step 8b).
PART OF: SDD - Refunds Platform
PURPOSE: Output of the post-generation cleared-context reviewer pass. Captures architecture-level gaps, missing scenarios, integration corner cases, ADR ambiguities, and cross-chunk contract mismatches flagged by an independent reviewer. Every item carries a concrete Recommended Answer, ready to be applied to the SDD body once the architect accepts it.
GENERATED_BY: sdd-unifier post-generation reviewer (cleared-context subagent run after the main SDD body is complete).
SCOPE: The reviewer reads ALL preceding chunks and both source BRDs (REFUNDS, LOYALTY). Contract-consistency findings are first-class: in-process event names, DTO fields, and publisher or listener lists that diverge between the Centralized Event Hub (chunk 10, §14.10), the per-module chunks (13a-13d), the Centralized User Roles catalogue (chunk 12), and the Service Integration API Contracts (chunk 11) are valid OI items. The End-to-End System Design (chunk 19) does not exist yet when this review runs; it is written after this chunk is cleared.
WORKFLOW: After this chunk is written, the skill walks the user through each open item and asks them to accept, adjust, defer, or reject the Recommended Answer. Accepted answers are applied to the referenced chunk(s), the item moves to the Resolution Log, and the Changes Log is bumped.
-->

# 23. Open Items & Clarifications

> **What this section is.** A structured backlog of architectural concerns identified after the main SDD was authored, by a reviewer running with cleared context. Each item comes with a **Recommended Answer** - a concrete, ready-to-apply resolution. Items are decisions awaiting the architect's acceptance: accept the recommendation (or adjust it), and it gets reflected into the SDD body.
>
> **What this section is not.** It is not a list of inline `[NEEDS CLARIFICATION: ...]` markers found in the body - those remain inline. This section is the reviewer's *external* findings: gaps the body did not mark, scenarios the body did not consider, corner cases the body did not test for, and contract inconsistencies between the centralized catalogues (chunks 10, 11, 12) and the per-module chunks they consolidate.

---

## How to read each item

| Field | Meaning |
|-------|---------|
| **ID** | OI-NN. Stable across revisions. |
| **Where** | Section number (e.g., §6, §17.1), service name, or "global" if cross-cutting. |
| **Type** | Architecture gap / Missing scenario / Corner case / Ambiguity / Risk / Inconsistency / NFR shortfall / ADR needed / Contract mismatch (topic, event, payload, consumer list, or role/permission divergence across chunks) / Duplication (BRD content or another chunk's content restated instead of referenced). |
| **Concern** | One paragraph. What was missed and why it matters for downstream LLD or implementation. |
| **Options** | At least 2 concrete choices, each with a one-line tradeoff. |
| **Recommended Answer** | The reviewer's concrete proposed resolution, written as ready-to-apply SDD content (the exact row, decision, sub-section, or wording that would close the item). This is what gets injected into the body when accepted. |
| **Why** | REQUIRED. One or two lines: the reason the recommended option wins over the alternatives - the evidence behind it (BRD requirement, NFR, doctrine/CLAUDE.md default, operational risk avoided) and the tradeoff being accepted. Never empty, never "best option". |
| **Status** | Open (awaiting decision) / Accepted - applied (with pointer) / Adjusted - applied / Deferred (with rationale) / Rejected. |

---

## Open Items

### OI-01: The event publication log keeps customer contact data in clear and for ever

- **Where:** §14.10 delivery rules 1-2 and §14.9.0 `ContactPoint` (chunk 10); §11.1 JSON columns and Indexing, §11.6 Personal data (chunk 07); §16.8 rule 4 (chunk 12); §6 DDD rule (chunk 02)
- **Type:** Risk
- **Concern:** Four of the six in-process events (`RefundSubmitted`, `RefundCancelled`, `RefundRejected`, `RefundPaid`) carry `contact`, whose `email` and `mobile` §14.9.0 tags `pii`. Rule 1 writes every event to the publication log in schema `platform` as a JSON payload (§11.1), so these fields sit there in clear, although §11.6 encrypts exactly these fields at column level everywhere else (REFUNDS/NFR-04: customer personal data is protected). Rule 2 marks a publication complete but never removes it, so the copy outlives the message it served, and the erasure rule (§16.8 rule 4) clears refund contact columns and message recipients but not this log. The `platform` schema is also an unstated exception to two platform rules: one table shared by all modules (§6: no shared tables) and no leading `tenant_id` (§11.1 Indexing, ADR-03).
- **Options:**
  - **A.** Encrypt `pii` fields when an event enters the log, delete a publication once its last listener completes, extend erasure to incomplete publications, and state the `platform` exception - every event contract stays as reconciled; one encrypting serializer to build.
  - **B.** Drop `contact` from the four DTOs and let `notification` read it through a new in-process query port on `refund` (API-05) - no PII in the log at all; reopens four event contracts across five chunks and adds a port.
  - **C.** Only delete completed publications - smallest change; PII stays in clear while a publication is incomplete, which is exactly when a failing listener keeps it longest.
- **Recommended Answer:** Option A. Add delivery rule 8 to §14.10 (chunk 10): "**Personal data in publications:** fields tagged `pii` in §14.9.0 are encrypted when the event is written to the publication log, with the PII key of §11.6, and decrypted only for delivery; a publication is deleted when its last listener completes." In §16.8 rule 4 (chunk 12), after "the recipients of their messages," insert "the `contact` of their incomplete event publications (§14.10 rule 8),". Add to §11.1 (chunk 07) after Indexing: "**Exception, schema `platform`:** holds only the event publication log, owned by the platform rather than a module; its rows need no `tenant_id` column (each serialized event carries `tenantId`), and only the deployable's event delivery reads them."
- **Why:** A brings the log in line with §11.6 and REFUNDS/NFR-04 and bounds the copy's life to delivery time without touching the six reconciled event contracts or the module dependency graph; B buys stricter data minimisation by reopening contracts in five chunks for a risk A already removes, and C leaves clear-text PII exactly in the failure case. Tradeoff accepted: a custom serializer and one more holder of the PII key.
- **Status:** Accepted - applied (10 §14.10 rule 8; 12 §16.8 rule 4; 07 §11.1)

---

### OI-02: In-process listener retries have no trigger, interval, limit, or metric

- **Where:** §14.10 delivery rules 3 and 5 (chunk 10); §11.4 Metrics (chunk 07); §17.4 Timeliness (chunk 13d)
- **Type:** Architecture gap
- **Concern:** Rule 3 says an incomplete publication "is retried (and re-delivered after a restart)" and rule 5 alerts when one is "still incomplete after its retries", but no chunk says what triggers a retry while the deployable runs, how often, how many times, or when a publication counts as stuck. §11.4 names an "oldest incomplete event publication" gauge that no metrics table defines, and the `platform` schema has no owning chunk to define it. If re-delivery happens only on restart, a take-back whose `RefundPaid` listener fails once on a transient error waits for the next deployment (LOYALTY/NFR-02: within 1 hour of the refund being paid), and a failed `PayoutSucceeded` listener leaves a paid refund showing Approved to its customer ([REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status-web-and-mobile)).
- **Options:**
  - **A.** A scheduled re-delivery job with an age threshold, a re-delivery limit, and a platform gauge and counter with an alert - the LOYALTY/NFR-02 hour holds by design; one job and two metrics to run.
  - **B.** Re-delivery on restart plus the manual §20 procedure - nothing to build; take-back lag then follows the release cadence.
  - **C.** In-listener retries with backoff before the publication is left incomplete, plus A - fewer stuck publications; two retry layers to tune for about 1,200 refunds a month.
- **Recommended Answer:** Option A. Replace §14.10 rule 3 (chunk 10) with: "**At-least-once, idempotent effect:** a listener that fails leaves its publication incomplete; a re-delivery job re-delivers every publication incomplete for longer than **[NEEDS CLARIFICATION: re-delivery age threshold and job interval; with the listener run they must stay well inside the 1 hour of LOYALTY/NFR-02]**; every listener dedups on `eventId` or on the business key named in Notes." Replace rule 5 with: "**Failure visibility:** a publication re-delivered **[NEEDS CLARIFICATION: maximum re-deliveries]** times without completing is no longer re-delivered, raises an alert, and waits for the §20 procedure; it is never dropped." Add to §11.4 Metrics (chunk 07): "`event_publication_oldest_incomplete_seconds` (gauge, label `event`) and `event_publication_stuck_total` (counter, label `event`), exported by the deployable's event delivery; the gauge alerts before it reaches the 1 hour of LOYALTY/NFR-02."
- **Why:** LOYALTY/NFR-02 and REFUNDS/NFR-01 both assume a failed listener is retried within a bounded time, which only a running job guarantees; B ties a business SLO to deployment cadence, and C adds a retry layer the volumes of §18.1 do not need. Tradeoff accepted: one more scheduled job, coordinated across replicas as in OI-03.
- **Status:** Accepted - applied (10 §14.10 rules 3 and 5; 07 §11.4)

---

### OI-03: Background work across replicas and releases has no coordination rule

- **Where:** §14.10 delivery rules 3 and 7 (chunk 10); §8.1.3 Deployment model (chunk 04); §11.3 Strategy (chunk 07); §17.3 Archival purge (chunk 13c); §17.4 Balance integrity (chunk 13d)
- **Type:** Risk
- **Concern:** Only the payout and notification dispatchers coordinate across the two or more replicas, through row claims with `FOR UPDATE SKIP LOCKED` (§8.1.3). Three other background paths do not: (1) re-delivery "after a restart" (rule 3) re-delivers every incomplete publication, including ones another replica is running at that moment, so the same listener runs twice in parallel and the loser fails on its dedup key or row version and surfaces as an error; (2) the loyalty nightly integrity job and the notification purge run in every replica; (3) the publication log has to record each publication's event type and listener, but neither rule 7 (additive DTO changes) nor the expand-contract rule of §11.3 covers a release that renames or moves an event class or a listener, which strands the incomplete publications of the old name during and after a rolling update.
- **Options:**
  - **A.** One-replica-at-a-time locks for scheduled jobs, age-based re-delivery instead of a full re-delivery on start, dedup-key violations treated as success, and an expand-contract rule for event and listener identity - small rules, no new infrastructure.
  - **B.** A dedicated background replica (a second Deployment of the same image) that alone runs jobs and re-delivery - easy to reason about; a second scaling unit and a single point of delay.
- **Recommended Answer:** Option A. Add to §11.3 (chunk 07): "**Background work across replicas:** the dispatchers coordinate through row claims; every other scheduled job (event re-delivery, §14.10 rule 3; the loyalty nightly integrity job; the notification purge) runs in one replica at a time under a database lock; a starting replica does not re-deliver incomplete publications itself, the re-delivery job does, by age." Add to §14.10 rule 3 (chunk 10): "A listener that meets a violation of its own dedup key treats the event as handled and completes." Add to §14.10 rule 7: "Event class names and listener identities are part of the contract: a release that renames or moves one keeps the old one until its incomplete publications are drained (expand-contract, AP-10)."
- **Why:** A keeps ADR-01's single deployable and turns harmless duplicates into silent no-ops, so the alerts of §14.10 rule 5 keep meaning something; B adds a deployment unit to solve what a lock solves. Tradeoff accepted: a lock in the job framework and a two-release path for event renames.
- **Status:** Accepted - applied (07 §11.3; 10 §14.10 rules 3 and 7)

---

### OI-04: Cross-tenant background work contradicts §11.2 and row-level security

- **Where:** §11.1 Migrations, §11.2 Isolation enforcement and Cross-tenant access, §11.5 (chunk 07); ADR-03 and ADR-06 (chunk 06); Multi-Tenancy Specifications of §17.2, §17.3, §17.4 (chunks 13b-13d)
- **Type:** Inconsistency
- **Concern:** §11.2 says no cross-tenant query exists in any module and that row-level security on `tenant_id` is set per transaction, yet §17.2 and §17.3 list the dispatchers' claim queries as cross-tenant (§17.2: "reads due rows of all tenants") and §17.4's nightly job visits every tenant. Under that policy a claim without a tenant set returns nothing or fails, so the dispatchers either silently idle or need a path around the policy that the SDD never defines. Two further holes: ADR-06 names one application database role and §11.1 runs migrations from a Helm job without naming the owning role, and PostgreSQL does not apply row-level security to a table's owner unless the table forces it, so if the application role owns the tables ADR-03's second guard is void; and per-tenant work needs a list of tenants, but no chunk says where tenants and their settings live (currency, §3 assumption 7; default locale and templates, §17.3; provider credentials, §15.1).
- **Options:**
  - **A.** Per-tenant loops over a tenant configuration, with the application role owning no table - row-level security stays absolute; one configuration home to maintain.
  - **B.** A dedicated background database role whose policy lets claim queries read all tenants, with the tenant set per claimed row - simpler loops; a second privileged path that must itself be guarded.
- **Recommended Answer:** Option A. Replace §11.2 Cross-tenant access (chunk 07) with: "Forbidden for every role. No request-path query crosses tenants; background work (payout and notification dispatchers, the loyalty nightly job) loops over the tenants of the tenant configuration (§11.5) and runs each claim in that tenant's context, so row-level security applies to it too." Add to §11.5 (chunk 07): "**Tenant configuration:** per environment in the Helm values: tenant ID, currency, default locale, time zone, message template set, and the secrets-manager paths of the provider credentials; a new tenant is a reviewed change made together with its Keycloak configuration (§16.12.1)." Add to ADR-06 How (chunk 06): "Migrations run as a separate owner role; the application role owns no table and cannot bypass row-level security." Change the Cross-tenant queries bullet of §17.2, §17.3, and §17.4 to "None; background work runs per tenant (§11.2)."
- **Why:** A makes §11.2, ADR-03, and three module chunks state one rule and uses the `tenant_id`-first claim indexes of §17.2 and §17.3 as designed; B creates a privileged role, the very bypass ADR-03's second guard exists to prevent. Tradeoff accepted: one loop level in each background job and one configuration block per environment.
- **Status:** Accepted - applied (07 §11.2 and §11.5; 06 ADR-06; 13b, 13c, 13d Multi-Tenancy Specifications)

---

### OI-05: Who writes the `tenant_id`, `member_id`, and `branch_id` claims is undefined

- **Where:** ADR-07 (chunk 06); §16.2 step 4, §16.6, §16.8 (chunk 12); §3 assumption 2 (chunk 01); §17.4 Constraints (chunk 13d)
- **Type:** Architecture gap
- **Concern:** Every ownership gate rests on a token claim: own points on `member_id` (§16.2 step 4; §17.4 binds every query to it), own branch on `branch_id`, and the tenant on `tenant_id` (ADR-03). §16.6 says what grants each role, but no chunk says which account attribute each claim comes from, who may write it, or how a customer who self-registers in the single realm (ADR-07) gets a `tenant_id` at all. If the account owner can edit the attribute behind `member_id`, they read another member's points ([LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance) BR-1: members see only their own points); an account without `tenant_id` fails every request. The process that puts a POS member ID on an online account is unnamed too: §3 assumption 2 places enrolment outside both BRDs, yet [LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance) and [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) work only for linked accounts.
- **Options:**
  - **A.** State the claim sources in §16.8 (owner-read-only attributes, `tenant_id` written at account creation from the tenant web app, `member_id` written only by the membership link) and record the link question - no new component; the realm configuration carries the rule.
  - **B.** Keep tenant and membership links in a platform table and resolve them per request instead of trusting claims - trust moves into the platform; a data set and a responsibility no module owns today.
- **Recommended Answer:** Option A. Add to §16.8 (chunk 12) the rule: "**Claim sources:** `tenant_id`, `branch_id`, and `member_id` come from account attributes the account owner can never edit. `tenant_id` is written when the account is created, from the tenant web app the customer registers through (§11.5 tenant configuration); an end customer of two tenants holds one account per tenant. `branch_id` is written by the IAM administrator (rule 1); `member_id` only by the membership link. A token without `tenant_id` is refused with 403 `FORBIDDEN`." Add to §3 assumption 2 (chunk 01): "**[NEEDS CLARIFICATION: which system and process write the POS member ID onto an online account, and how the member proves the membership; both BRDs are silent.]**" The §11.5 reference depends on OI-04.
- **Why:** the own-points, own-branch, and tenant gates (§16.5 footnotes, ADR-03) are only as strong as the claims behind them, and A secures the claims where they are issued without a new component; B duplicates identity data inside the platform for a product with one tenant today. Tradeoff accepted: read-only attributes must be enforced and checked in the versioned realm configuration (§16.12.1).
- **Status:** Accepted - applied (12 §16.8 rule 5; 01 §3 assumption 2)

---

### OI-06: R-06 says provider calls run only in dispatchers, but the POS lookup runs on the request thread

- **Where:** §4 R-06 (chunk 01); ADR-09 Consequences (chunk 06); §15.1 Sync chain depth (chunk 11); §17.1 Submit (chunk 13a)
- **Type:** Inconsistency
- **Concern:** R-06 contains the one-failure-domain risk with "Provider calls run only in background dispatchers", and ADR-09 says provider latency never reaches a user request, yet API-02 runs on the customer's request thread at lookup and again at submission (§15.1, §8.5.1). A slow POS records system is therefore exactly the shared-thread risk R-06 describes, contained by the API-02 bulkhead and timeout, not by a dispatcher. §17.1 Submit also lists the receipt re-read, the checks, and the save as one step without saying whether the POS call runs inside the database transaction; if it does, each waiting customer holds a connection from the pool all four modules share.
- **Options:**
  - **A.** Reword R-06 and ADR-09 and order Submit so the POS read finishes before the transaction opens - no design change; the text matches the design and connections stay free during POS waits.
  - **B.** Take the POS read out of the submit path (save first, verify the receipt asynchronously) - no POS wait at submission; changes when [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) E1 and E2 reach the customer.
- **Recommended Answer:** Option A. Replace the R-06 Mitigation (chunk 01) with: "Provider writes run only in background dispatchers (ADR-09). The one synchronous provider call, the POS receipt lookup (API-02), runs on the request thread inside its own Resilience4j bulkhead and timeout and never inside a database transaction. Each provider has its own bulkhead, timeout, and circuit breaker (§12)." In ADR-09 Consequences (chunk 06), change "provider latency never reaches a user request" to "provider write latency never reaches a user request". In §17.1 Submit (chunk 13a), change the opening to: "re-reads the receipt (API-02) before the transaction opens; then, in one transaction, re-checks the window and every selected line, ...".
- **Why:** [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) needs the receipt at steps 2 and 5, so the lookup stays synchronous (§15.1), and A makes the risk register and ADR-09 describe that truthfully while keeping database connections out of POS waits; B moves E1 and E2 after submission for no gain at about 1,200 requests a month (REFUNDS 02 Facts 1). Tradeoff accepted: the request path stays exposed to POS latency, bounded by the API-02 timeout still open in §12.
- **Status:** Accepted - applied (01 §4 R-06; 06 ADR-09; 13a §17.1 Submit)

---

### OI-07: Any signed-in customer can read and claim any receipt

- **Where:** §17.1 Receipt lookup, Submit, and Constraints (chunk 13a); §16.5 footnote ¹ and §16.11 (chunk 12); §4 (chunk 01); API-02 (chunk 11)
- **Type:** Risk
- **Concern:** The lookup and submit endpoints accept any receipt number of the tenant from any `CUSTOMER`; nothing ties a receipt to the person who enters it (§16.11 gives `refund.receipt.read` no ownership footnote, and §16.5 footnote ¹, own requests only, cannot apply to a receipt). Whoever knows or guesses a buyer's receipt number sees that purchase's lines, amounts, branch, and date (REFUNDS/NFR-04: customer personal data is protected), and can submit a request whose active items block the real buyer ([REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) BR-2: an item is refunded only once) until a manager rejects it, while the messages go to the requester. No money is diverted, because payouts go only to the original card (REFUNDS 02 Assumptions / Constraints 2). The per-customer lookup rate limit (§17.1) slows guessing but binds nothing, and §4 records no such risk.
- **Options:**
  - **A.** Record the risk with its existing mitigations, state the missing gate in §16.5, ask the REFUNDS owner whether proof of purchase beyond the number is required, and ask POS what proof data a receipt holds - no BRD change yet; the exposure stays, visibly, until answered.
  - **B.** Require proof of purchase now (for example the purchase total) - closes the gap; writes a business rule [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) step 1 does not state.
- **Recommended Answer:** Option A. Add R-08 to §4 (chunk 01): Description "A signed-in customer who knows a receipt number can see that purchase and request a refund of its items, blocking the real buyer's items ([REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) BR-2: an item is refunded only once) until the request is rejected or cancelled"; Likelihood M; Impact M; Mitigation "Lookup rate limit per customer (§17.1); payouts only to the original card; a rejection or cancellation releases the items at once (§17.1 `active`); proof of purchase is a REFUNDS follow-up"; Owner "[NEEDS CLARIFICATION: risk owner]". Add to §16.5 footnote ¹ (chunk 12): "The receipt lookup has no ownership gate: any receipt of the tenant (R-08)." Add to §17.1 Constraints (chunk 13a): "**[NEEDS CLARIFICATION: must a customer prove the purchase beyond the receipt number? [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) step 1 names only the number.]**" Add to the API-02 TBD-external marker (chunk 11): "and any data on the receipt that could prove the buyer (customer or member ID, card digits)".
- **Why:** the exposure touches REFUNDS/NFR-04 and the items-once rule (BR-2: an item is refunded only once) but no money, so recording it and putting the binding rule to the REFUNDS owner is proportionate; B would invent a rule the BRD does not contain. Tradeoff accepted: the exposure remains until the owner answers, now visible in §4.
- **Status:** Accepted - applied (01 §4 R-08; 12 §16.5 footnote ¹; 13a §17.1 Constraints; 11 API-02)

---

### OI-08: One read token serves two ownership gates, and one account may hold both roles

- **Where:** §16.3, §16.8, §16.11 (chunk 12); §17.1 Approve, Reject, Constraints, and Figure 14 (chunk 13a); §7.3 entry points (chunk 03)
- **Type:** Ambiguity
- **Concern:** `refund.request.read` is granted to `CUSTOMER` (own requests) and `BRANCH_MANAGER` (own branch), and `GET /v1/refund-requests/{refundId}` serves both (the [REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status-web-and-mobile) and [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) rows of §7.3), so the module must pick the ownership gate by role, not by token. §16.3 does not say whether one account may hold an `END_CUSTOMER` role and a `STAFF` role. For such an account the gate is undefined, and the decision command (Figure 14) checks only the token and the branch, so a manager could decide a refund they requested for a purchase at their own branch.
- **Options:**
  - **A.** One user type per account (an IAM rule in §16.8) plus a self-decision guard in the decision command - no token or path change; a manager who shops uses a separate customer account.
  - **B.** Split the token by scope (`refund.request.read` for own requests, `refund.branch-request.read` for the branch) with a manager detail path under `/v1/branches/{branchId}/` - each token maps to one gate; changes §16.11, §16.12.2, §17.1, and §7.3.
- **Recommended Answer:** Option A. Add to §16.8 (chunk 12) the rule: "**One user type per account:** an account holds the roles of one user type only; IAM administrators never grant `BRANCH_MANAGER` to an account that holds `CUSTOMER` or `MEMBER`. The read gate follows the role: `CUSTOMER` reads own requests, `BRANCH_MANAGER` reads own-branch requests." Add to §17.1 Approve and Reject (chunk 13a): "The decision is refused with 403 `FORBIDDEN` when the request's `customer_id` equals the deciding principal." Add to §17.1 Constraints: "**[NEEDS CLARIFICATION: may a branch manager decide a refund of their own purchase made through their separate customer account, or must another manager decide it? REFUNDS 03 Branch ownership is silent.]**"
- **Why:** A removes the undefined gate and same-account self-decision with one rule and one check, keeping the §16.11 grid, the §16.12.2 counts, and four chunks unchanged; B is the cleaner REST shape but spreads one fix over four chunks. Tradeoff accepted: managers need a separate account for personal refunds, and cross-account self-decision stays a business question.
- **Status:** Accepted - applied (12 §16.8 rule 6; 13a §17.1 Business Logic, Constraints, Error Handling, Figure 14)

---

### OI-09: Receipt number and purchase reference are treated as one identifier without a decision

- **Where:** §5 Glossary (chunk 01); API-01 `purchaseReference` and the API-02 marker (chunk 11); §14.10 `RefundPaid` (chunk 10); §17.1 Receipt lookup and Tables (chunk 13a); §17.4 Earn, Take-back, and Tables (chunk 13d)
- **Type:** Ambiguity
- **Concern:** REFUNDS names the purchase identifier "receipt number" (REFUNDS 02 Assumptions / Constraints 1, REFUNDS 08) and LOYALTY "purchase reference" (LOYALTY 08). The SDD equates them with no decision or marker: API-01 defines `purchaseReference` as the receipt number, `RefundPaid` carries it, and `loyalty` matches the `EARN` movement of the POS purchase intake on it. If the intake sends a different identifier, no take-back ever matches, every refund turns into a pending take-back, and the take-back rule ([LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-1: points taken back when the purchase is refunded) silently fails. The keys also assume receipt numbers are unique across all 40 branches (`unique (tenant_id, receipt_number, pos_line_id)`, `unique (tenant_id, purchase_reference)`, lookup by number alone): if numbers repeat per branch, one branch's request blocks another branch's line and a second member purchase with the same number is dropped as a duplicate.
- **Options:**
  - **A.** `refund` stores the purchase reference POS returns with the receipt and sends that in API-01 and `RefundPaid`; glossary term; question to Retail IT - works whether the identifiers are equal or not.
  - **B.** Declare them identical (glossary term and marker only) - smallest change; breaks every take-back if they differ.
  - **C.** `loyalty` asks POS for the purchase reference of a receipt number when `RefundPaid` arrives - no `refund` change; makes the take-back listener depend on POS availability.
- **Recommended Answer:** Option A. Add to §5 Glossary (chunk 01) the term "Receipt number / purchase reference" with the definition: "The POS identifier of one branch purchase: REFUNDS says receipt number (REFUNDS 02 Assumptions / Constraints 1), LOYALTY says purchase reference (LOYALTY 08). `refund` stores the purchase reference POS records return with the receipt (`refund_request.purchase_reference`, equal to the receipt number when POS uses one identifier) and sends it as `purchaseReference` in API-01 and `RefundPaid`; `loyalty` matches on it. **[NEEDS CLARIFICATION: Retail IT team: does the member purchase intake carry the receipt number customers enter, and are receipt numbers unique across branches? If unique per branch only, `branch_id` joins every receipt key and the customer also gives the branch at lookup.]**" Add `purchase_reference` varchar(64) not null to `refund_request` (§17.1 Tables, chunk 13a), and change the API-01 `purchaseReference` description (§15.3, chunk 11) to "POS purchase reference of the original purchase". Add to the API-02 TBD-external marker (chunk 11): "and the purchase reference the member purchase intake uses for the same purchase, and the uniqueness scope of receipt numbers".
- **Why:** two BRDs name the identifier differently and the take-back joins on it, so A is the only design that works for every answer Retail IT can give, at the cost of one column; B bets LOYALTY/NFR-01 on an unverified equality, and C couples a listener to a provider. Tradeoff accepted: `refund` stores one more POS field.
- **Status:** Accepted - applied (01 §5; 13a §17.1 Submit and Tables; 11 API-01 and API-02)

---

### OI-10: A refundable "item" is modelled as a whole POS line

- **Where:** §5 Glossary (chunk 01); §17.1 Receipt lookup and Tables `refund_request_item` (chunk 13a); the API-02 marker (chunk 11)
- **Type:** Ambiguity
- **Concern:** REFUNDS counts items: [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) step 3 (the customer selects the items) and BR-2: an item is refunded only once. §17.1 models the refundable unit as a POS receipt line (`pos_line_id`, unique while active), and API-02 asks POS for line ID, description, and amount but no quantity. A line holding several units (three identical items) can then be refunded only once and in full: a customer returning one of three either refunds all three or relies on a partial approval ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) A1) for the line, after which the other two can never be refunded.
- **Options:**
  - **A.** State the whole-line rule now, store the line quantity, and ask the REFUNDS owner - no model change; a unit-level answer needs no backfill.
  - **B.** Model units now (a quantity per request item, active quantities per line never above the line quantity) - the items-once rule (BR-2: an item is refunded only once) holds per unit; needs a per-line lock or counter instead of the partial unique index.
- **Recommended Answer:** Option A. Add to §5 Glossary (chunk 01) the term "Refundable item" with the definition: "One POS receipt line (`pos_line_id`), refunded once and in full. **[NEEDS CLARIFICATION: may a customer refund some units of a receipt line that holds several units, given [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) BR-2: an item is refunded only once?]**" Add `quantity` int not null, copied from the receipt line, to `refund_request_item` (§17.1 Tables, chunk 13a). Add "quantity per line" to the API-02 TBD-external marker (chunk 11).
- **Why:** the unit of refund is a business rule only the REFUNDS owner can set, and A states today's behaviour and keeps the data a unit-level answer would need; B pays for concurrency control before anyone has asked for it. Tradeoff accepted: until the answer, multi-unit lines refund whole.
- **Status:** Accepted - applied (01 §5; 13a §17.1 Tables; 11 API-02)

---

### OI-11: Purchases not paid by card can be requested and approved but never paid

- **Where:** §17.1 Receipt lookup, Submit, Error Handling, and Constraints (chunk 13a); the API-02 marker (chunk 11); §4 R-03 (chunk 01)
- **Type:** Missing scenario
- **Concern:** Payouts go only to the card used for the purchase (REFUNDS 02 Assumptions / Constraints 2) and cash refunds are out of scope (REFUNDS 04 Out of Scope), yet every purchase has a receipt (Assumptions / Constraints 1) and §17.1 accepts any receipt within the window. A purchase paid in cash can be requested and approved, and then CardPay has no card to refund; one paid partly by card can be approved above the card charge. Either payout retries for 24 hours, ends Failed, and the manager is alerted about a refund that could never succeed, while the customer waits ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1 is meant for provider refusals). R-03 asks POS for the card payment reference, but nothing says what happens when a receipt has none.
- **Options:**
  - **A.** Use the card-paid amount as the refundable limit at lookup and submission: no card payment is refused like E1 (visit the branch), a mixed tender is capped; confirm with the REFUNDS owner - fails early with a next step; needs the tender split from POS (TBD - external).
  - **B.** Let managers reject such requests by hand - no POS dependency; every cash receipt costs a manager decision and delays the customer.
- **Recommended Answer:** Option A. Add to §17.1 Receipt lookup (chunk 13a): "A receipt with no card payment returns 422 `NO_CARD_PAYMENT` (not paid by card; visit the branch); for a purchase paid partly by card, the selected lines may not exceed the card-paid amount (422 `CARD_AMOUNT_EXCEEDED`); Submit re-checks both." Add both codes to §17.1 Error Handling. Add to §17.1 Constraints: "**[NEEDS CLARIFICATION: confirm that purchases not paid by card are refused online (REFUNDS 04 Out of Scope: cash refunds), and how a purchase paid partly by card is refunded.]**" Add "the card-paid amount of the receipt (tender split)" to the API-02 TBD-external marker (chunk 11).
- **Why:** under REFUNDS 02 Assumptions / Constraints 2 a non-card refund can never be paid, so refusing it at lookup applies the existing [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) E1 pattern and keeps doomed requests out of the manager's queue and the 24-hour retry loop; B spends a decision and a day of retries on each. Tradeoff accepted: refundability now depends on POS returning the tender split.
- **Status:** Accepted - applied (13a §17.1 Receipt lookup, Error Handling, Constraints; 11 API-02)

---

### OI-12: The 30-day window boundary depends on the time of day

- **Where:** §3 assumption 8 (chunk 01); §17.1 Receipt lookup, Submit, and Developer Notes (chunk 13a)
- **Type:** Corner case
- **Concern:** Assumption 8 measures the window in UTC from the POS purchase timestamp to the submission time, so 30 days means 30 x 24 hours. The BRD states the rule in days ([REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) BR-1: refund only within 30 days of purchase; AC-2: a purchase 31 days old is told the window has passed), and the branches follow the "Store refund policy v3" (REFUNDS 12 Appendix), which the SDD never consults. On the 30th calendar day after a purchase, a request is accepted or refused depending on the time of day, and neither acceptance criterion tests that boundary.
- **Options:**
  - **A.** Evaluate the window in one domain function, keep elapsed time until confirmed, and record the question - the rule can switch without touching callers.
  - **B.** Switch now to calendar days in the tenant's time zone - matches the everyday reading of "30 days"; assumes an answer the policy has not given.
- **Recommended Answer:** Option A. Replace §3 assumption 8 (chunk 01) with: "**Time:** the 30-day refund window ([REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) BR-1: refund only within 30 days of purchase) is evaluated by one domain function from the POS purchase timestamp and the submission time, both stored in UTC; a request is in time when it is submitted within 30 x 24 hours of the purchase timestamp. **[NEEDS CLARIFICATION: elapsed 30 x 24 hours, or 30 calendar days in the tenant's time zone (§11.5)? What does the Store refund policy v3 (REFUNDS 12 Appendix) say?]**" Add to §17.1 Developer Notes Testing (chunk 13a): "the window one minute before and one minute after the 30-day boundary".
- **Why:** the boundary is customer-visible and the policy document that governs it today is named in the BRD, so the rule must be confirmed, not assumed; A makes either answer a one-function change, while B guesses the answer. Tradeoff accepted: the elapsed-time reading stays live until the owner confirms.
- **Status:** Accepted - applied (01 §3 assumption 8; 13a §17.1 Developer Notes)

---

### OI-13: A payout can end Failed with an unknown outcome, and nothing reconciles payouts with CardPay

- **Where:** §17.2 Failure, Unknown outcome, Tables, Figures 15 and 17 (chunk 13b); API-01 `PayoutAccepted.status` (chunk 11); §18 REFUNDS/NFR-01 row (chunk 14)
- **Type:** Corner case
- **Concern:** A refusal or a timeout moves a payout to Retrying, and "once 24 hours have passed since the first attempt it moves to Failed" (Figure 17). If the attempt that crosses the deadline times out, CardPay may have paid, yet the payout ends Failed, the manager is told it failed, the request stays Approved, and any later manual re-payment (the inline "After Failed" question) can pay twice (REFUNDS/NFR-01: refund money is never lost or paid twice). The 24-hour clock also starts only at the first attempt, and calls skipped by the open circuit breaker are not attempts, so a payout approved during a long CardPay outage has no running clock. Finally, the NFR-01 business measure (zero missing or duplicate payouts per month) is never measured: the §18 target rests on CardPay honouring the idempotency key (R-01), and no job compares the platform's payouts with CardPay's records.
- **Options:**
  - **A.** An Unknown state for unresolved outcomes, skipped calls counted as attempts, and a daily reconciliation against CardPay's records - every terminal state is a known outcome; one state and one job more.
  - **B.** Query the payout status before marking Failed - no new state when CardPay answers; needs a status query CardPay may not offer (API-03 is TBD - external).
  - **C.** Keep Failed and rely on CardPay idempotency - nothing to build; a manual re-pay after an unknown outcome can still pay twice.
- **Recommended Answer:** Option A. In §17.2 Failure (chunk 13b), replace "a refusal or a timeout moves the payout to Retrying with exponential backoff and jitter; once 24 hours have passed since the first attempt it moves to Failed and `PayoutFailed` is published;" with: "a refusal or a timeout moves the payout to Retrying with exponential backoff and jitter; a call skipped by the open circuit breaker counts as a failed attempt, so the clock of [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1 runs during an outage. Once 24 hours have passed since the first attempt, a payout whose last attempt was refused moves to Failed; one whose last attempt timed out or failed without a refusal has an unknown outcome and moves to Unknown, never to Failed. Both publish `PayoutFailed` with the reason in `lastFailureReason` (AC-2: the branch manager is told after one day); an Unknown payout is never retried or re-requested until reconciled;" and keep the rest of the bullet. Add a bullet: "**Reconciliation** (REFUNDS/NFR-01): a daily job compares Succeeded, Failed, and Unknown payouts with CardPay's records and alerts on any payout CardPay paid that is not Succeeded and any Succeeded payout CardPay did not pay; a reconciled Unknown payout moves to Succeeded (publishing `PayoutSucceeded`) or to Failed. **[TBD - EXTERNAL: CardPay payout report or status query (API-03)]**" Add `UNKNOWN` to the `payout.status` check (§17.2 Tables) and to `PayoutAccepted.status` (§15.3, additive). Add to Figure 15 `Retrying --> Unknown : unresolved after 24 h`, `Unknown --> Succeeded : reconciled as paid`, and `Unknown --> Failed : reconciled as not paid`, and split the Figure 17 "24 h since first attempt?" yes branch into refused (Failed) and unresolved (Unknown).
- **Why:** REFUNDS/NFR-01 forbids both a lost and a double payout, and A is the only option that never declares a payout failed while CardPay may have paid, whatever API-03 turns out to offer; B depends on a TBD-external capability and C keeps the double-pay path. Tradeoff accepted: one more payout state, an additive enum value on API-01, and a daily job whose data source stays TBD - external.
- **Status:** Accepted - applied (13b §17.2 Business Logic, Tables, Metrics, Figures 15 and 17; 11 API-01 and API-03; 09 §13; 14 §18)

---

### OI-14: The customer's contact profile: claims not named, SMS without a mobile, locale not carried

- **Where:** ADR-07 How (chunk 06); §14.9.0 `ContactPoint` (chunk 10); §17.1 Submit and Tables (chunk 13a); §17.3 Business Logic, Dispatch (chunk 13c); §3 assumption 1 (chunk 01)
- **Type:** Contract mismatch
- **Concern:** §17.1 snapshots "the customer's email and mobile from the token", but ADR-07 lists only the `tenant_id`, `branch_id`, and `member_id` claims. §17.3 renders each message "in the customer's locale (tenant locale by default)", but `ContactPoint` carries only `email` and `mobile`, so `notification` can never learn a customer's locale. And `customer_mobile` is nullable with the SMS skipped when it is empty, while [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) step 6 and [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 7 tell the customer "by email and SMS"; no chunk says whether registration collects a mobile number.
- **Options:**
  - **A.** Name the standard OIDC claims `email`, `phone_number`, and `locale` in ADR-07, add an optional `locale` to `ContactPoint`, and record the mobile question - one additive field closes the contract gap.
  - **B.** Drop "customer's locale" from §17.3 and always render in the tenant locale - no DTO change; customers never get their own language.
- **Recommended Answer:** Option A. In ADR-07 How (chunk 06), after the claims list add: "and the standard OIDC claims `email`, `phone_number`, and `locale`, the source of the contact snapshot of §17.1". In §14.9.0 (chunk 10), change the `ContactPoint` fields to: "`email string` (pii), `mobile string` (pii, optional), `locale string` (BCP 47, optional; the tenant default locale when absent)"; the event rows of §14.10 and 13a-13d stay unchanged because they name the field `contact`. Add `customer_locale` varchar(10) null to `refund_request` (§17.1 Tables, chunk 13a). Add to §3 assumption 1 (chunk 01): "**[NEEDS CLARIFICATION: is a mobile number required at registration, so every customer gets the SMS of [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) step 6 and [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 7?]**"
- **Why:** A names the snapshot's real source and makes the promised per-customer language implementable with an additive change that §14.10 rule 7 allows, and the question decides whether "email and SMS" can always hold; B quietly withdraws a behaviour §17.3 already promises. Tradeoff accepted: one optional field in a shared value object and one nullable column.
- **Status:** Accepted - applied (06 ADR-07; 10 §14.9.0 and §14.8; 13a §17.1 Submit and Tables; 01 §3 assumption 1)

---

### OI-15: The notification key allows only one recipient per event and channel

- **Where:** §17.3 Business Logic (idempotent listener, `PayoutFailed`), Tables, Figure 18 (chunk 13c)
- **Type:** Corner case
- **Concern:** `PayoutFailed` alerts "the managers of the request's branch" (plural, as in §17.1 Visibility), but each event creates "one row per channel", enforced by `unique (tenant_id, source_event_id, channel)`. With two managers in a branch, the second alert row breaks the key, so only one manager is told and the listener can fail on the violation ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) AC-2: the branch manager is told after one day). The inline question on the alert channel and the managers' contact source does not touch this key.
- **Options:**
  - **A.** Add the recipient to the key - one row per recipient and channel; works for any channel and contact source the inline question settles.
  - **B.** Send one alert to a branch mailbox - keeps the key; needs a branch contact neither BRD mentions.
- **Recommended Answer:** Option A. In §17.3 Tables (chunk 13c), add `recipient_key` varchar(64) not null (the customer ID for customer messages, the manager's user ID for branch manager alerts) and change the key to `unique (tenant_id, source_event_id, channel, recipient_key)`; change the idempotent listener bullet to "each event creates one row per recipient and channel, unique on (`tenant_id`, `source_event_id`, `channel`, `recipient_key`)"; add `recipient_key` to Figure 18.
- **Why:** A keeps the listener idempotent and lets the alert (AC-2: the branch manager is told after one day) reach every manager of the branch whatever the open channel question decides; B rests on a branch contact neither BRD defines. Tradeoff accepted: one more column in the dedup key.
- **Status:** Accepted - applied (13c §17.3 Business Logic, Tables, Figures 18 and 19; 10 §14.10 Notes)

---

### OI-16: Several refunds of one purchase can take back more points than it earned

- **Where:** §17.4 Take-back, Pending take-back, Tables `points_balance`, Developer Notes (chunk 13d)
- **Type:** Corner case
- **Concern:** One receipt can be refunded through several requests (items once per line, §17.1), so `loyalty` can receive several `RefundPaid` events with the same `purchaseReference`. Each take-back is "capped at the points earned on that purchase": a cap per take-back, not per purchase. Under the "all points of the purchase" reading of the inline question, the second refund takes the points back again, and if that breaks `balance >= 0` the listener fails for ever as a poison publication; under the paid-amount reading, rounding can still push the total past the earned points. Either way the balance stops being right (LOYALTY/NFR-01: the points balance is always right).
- **Options:**
  - **A.** Make the cap cumulative per purchase - correct under both readings of the inline question.
  - **B.** Allow one take-back per purchase - simple; takes back too little when a second refund arrives under the paid-amount reading.
- **Recommended Answer:** Option A. In §17.4 Take-back (chunk 13d), replace "capped at the points earned on that purchase" with "capped so that all take-backs of one purchase together never exceed its earned points: the listener records at most the earned points minus the points already taken back for that `purchaseReference`, and records nothing when the remainder is zero". Add to Pending take-back: "the earn step applies every pending take-back of the purchase, oldest `paidAt` first, under the same cap." Add to Developer Notes Testing: "two refunds of one purchase, paid before and after the purchase arrives".
- **Why:** the cumulative cap keeps LOYALTY/NFR-01 and the `balance >= 0` constraint whichever partial-refund rule the LOYALTY owner chooses; B is wrong under one of the two readings. Tradeoff accepted: the listener reads the purchase's earlier take-backs before writing.
- **Status:** Accepted - applied (13d §17.4 Take-back, Pending take-back, Developer Notes, Figure 21)

---

### OI-17: Refunds of non-member purchases leave pending take-backs that never match

- **Where:** §17.4 Pending take-back, Tables `pending_take_back`, Metrics (chunk 13d); §4 R-05 (chunk 01); the API-02 marker (chunk 11)
- **Type:** Missing scenario
- **Concern:** POS sends `loyalty` member purchases only (LOYALTY 08: member, purchase reference, amount), but every paid refund publishes `RefundPaid` to `loyalty`, member or not. A refund of a non-member purchase has no `EARN` movement and never will, so it becomes a `PendingTakeBack` that waits for ever. R-05 rates the no-earn case "L" as a timing race, yet non-member refunds make it routine: `loyalty_pending_take_backs` grows without bound and an alert on it cannot tell a late member purchase from a non-member refund. The inline question asks how long a pending take-back waits; it does not cover the non-member case or what ends the wait.
- **Options:**
  - **A.** Give pending take-backs an expiry state now, and ask POS whether a receipt carries the member ID so `refund` could flag member purchases later - works with any POS answer.
  - **B.** Carry the member ID in `RefundPaid` now so `loyalty` skips non-member refunds - removes the rows at source; depends on API-02 data that is TBD - external.
- **Recommended Answer:** Option A. Add to §17.4 Pending take-back (chunk 13d): "Most pending take-backs are refunds of non-member purchases, which never earn. A pending take-back older than the wait set by the inline question moves to EXPIRED: kept for audit, never applied, no longer counted by `loyalty_pending_take_backs`; a purchase arriving after expiry earns normally and increments `loyalty_late_purchase_after_expiry_total`." Add `status` varchar(8) not null (OPEN, EXPIRED) to `pending_take_back`, and change the lifecycle note to "stored, then applied and deleted, or expired". Change R-05 (chunk 01) to: Description "A refund of a non-member purchase, or of a member purchase not yet received, finds no earn movement to take back"; Likelihood H. Add "and the member ID of the purchase, if the receipt carries one" to the API-02 TBD-external marker (chunk 11).
- **Why:** A keeps the take-back rule ([LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-1: points taken back when the purchase is refunded) for every member purchase that arrives within the wait and turns the pending gauge back into a signal, with nothing needed from POS; B is better once POS confirms it has the member ID, which the marker asks. Tradeoff accepted: a member purchase arriving after expiry keeps its points, surfaced by the new counter.
- **Status:** Accepted - applied (13d §17.4 Pending take-back, Tables, Metrics; 01 §4 R-05; 11 API-02)

---

### OI-18: The daily branch refund report has no definition of its day or its delivery

- **Where:** §17.1 Branch refund report and List of APIs (chunk 13a)
- **Type:** Ambiguity
- **Concern:** REFUNDS 09 asks for a daily report with "requests per status, amounts paid, and average time to decision for the branch". §17.1 serves it per branch and day through `GET /v1/branches/{branchId}/refund-report` with a `date` parameter, but does not say which requests belong to a day (submitted, decided, or paid that day, or a status snapshot at day end), in which time zone the day runs (all timestamps are UTC, §6 rules, while branches work in local days), or whether "Daily" means a report sent to the manager each day or one they open per day. UAT cannot check numbers that are not defined.
- **Options:**
  - **A.** Define the day and the three measures from the status history, keep on-demand reading, and ask the REFUNDS owner about delivery - implementable now; a push waits for the answer.
  - **B.** Also send the report to each manager every morning through `notification` - fits one reading of "Daily"; adds a schedule, a template, and the manager-contact question still open in §17.3.
- **Recommended Answer:** Option A. Replace the §17.1 Branch refund report bullet (chunk 13a) with: "**Branch refund report** (REFUNDS 09): for one branch and one calendar day in the tenant's time zone (§11.5): per status, the requests that entered that status during the day (`refund_status_history`); amounts paid, the sum of `approved_amount` of the requests that became Paid during the day; average time to decision, the mean of `decided_at` minus `created_at` of the requests decided during the day. The report is read on demand. **[NEEDS CLARIFICATION: does REFUNDS 09 'Daily' also mean the report is sent to the branch manager each day?]**"
- **Why:** A makes the three measures testable with data §17.1 already keeps and aligns the day with how a branch works; B commits to a delivery channel the BRD may not want and that needs manager contacts §17.3 still lacks. Tradeoff accepted: a manager who expects a pushed report waits for the owner's answer; the time zone comes from the tenant configuration of OI-04.
- **Status:** Accepted - applied (13a §17.1 Branch refund report)

---

### OI-19: REFUNDS/NFR-02 depends on components whose availability the SDD never states

- **Where:** §18 REFUNDS/NFR-02 row and §18.3 (chunk 14); §6 IAM / AuthN and API Gateway rows (chunk 02); §4 (chunk 01)
- **Type:** NFR shortfall
- **Concern:** The target is 99.7% monthly availability "measured at the gateway", realised by two or more replicas of the deployable. But every request also passes the API gateway and needs a Keycloak sign-in, and every refund submission needs POS records (API-02; §18.3: submissions are refused while POS is down). §6 gives the gateway and Keycloak no replica count or availability, and the SLI does not say whether a 503 `UNAVAILABLE` caused by POS counts as disruption. Either the 2-hour budget silently absorbs POS downtime nobody has committed to, or the SLI excludes it and no longer measures the business promise ("customers can use the portal at any time").
- **Options:**
  - **A.** Count dependency-caused errors in the SLI, run the gateway and Keycloak with two or more replicas, and record POS availability as a risk with an external commitment to obtain - the SLI measures what customers experience.
  - **B.** Exclude dependency-caused 503s from the SLI - easier to meet; measures the deployable, not the promise.
- **Recommended Answer:** Option A. Extend the §18 REFUNDS/NFR-02 technical target (chunk 14): "The SLI counts every 5xx answered at the gateway, including 503 `UNAVAILABLE` when POS records are down, so the 2-hour budget covers the gateway, Keycloak sign-in, the deployable, PostgreSQL, and the POS receipt lookup." Add to the Notes of the §6 IAM / AuthN and API Gateway rows (chunk 02): "two or more replicas, like the deployable (REFUNDS/NFR-02)". Add R-09 to §4 (chunk 01; R-08 if OI-07 is not accepted): Description "POS records availability caps REFUNDS/NFR-02 for refund submission ([REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) steps 2 and 5)"; Likelihood M; Impact M; Mitigation "Obtain the Retail IT availability commitment for the receipt lookup **[TBD - EXTERNAL: POS records availability]**; alert on the API-02 circuit breaker"; Owner "[NEEDS CLARIFICATION: risk owner]".
- **Why:** REFUNDS/NFR-02 is a customer promise, so the SLI must see what customers see, and a chain is only as available as its single-instance links; B would report green while customers cannot submit. Tradeoff accepted: the platform SLO now leans on a POS commitment that is TBD - external.
- **Status:** Accepted - applied (14 §18; 02 §6; 01 §4 R-09)

---

### OI-20: The diagnostics cheatsheet has no row for several alerts the SDD defines

- **Where:** §20.2 (chunk 16); alert sources in §17.1 and §17.4 Error Handling, §17.4 Balance integrity, §17.2 Failure (chunks 13a, 13d, 13b); §18.3 (chunk 14)
- **Type:** Missing scenario
- **Concern:** §20.2 has three rows (payouts not turning Paid, messages not received, points not taken back), but on-call will also receive alerts with no first check: the nightly balance mismatch (`loyalty_balance_mismatch_total`, LOYALTY/NFR-01), poison or stuck publications (§17.1 and §17.4 Poison messages, §14.10 rule 5), POS records unavailable (§18.3: refund submissions refused), and payouts that ended Failed (`payout_failed_total`), which `payout_oldest_open_seconds` no longer shows.
- **Options:**
  - **A.** Add one row per alert, leaving severity and action to open markers like the existing rows - every alert has a first check now.
  - **B.** Wait for the on-call decisions of §20.3 - no rework; these alerts fire with no guidance meanwhile.
- **Recommended Answer:** Option A. Add four rows to §20.2 (chunk 16), each with Severity "[NEEDS CLARIFICATION: severity]" and Action "[NEEDS CLARIFICATION: action and escalation]": (1) Symptom "Balance differs from the sum of its movements"; First Check "`loyalty_balance_mismatch_total` and the nightly job log"; Likely Cause "A movement written without its balance update, or a manual data change". (2) Symptom "Events not reaching a module"; First Check "the oldest incomplete event publication gauge (§11.4) and the publication's event type"; Likely Cause "A listener failing on a poison event, or re-delivery stopped". (3) Symptom "Customers cannot submit refunds"; First Check "`refund_pos_lookup_seconds` errors and the API-02 circuit breaker state"; Likely Cause "POS records outage or expired credentials". (4) Symptom "Approved refund whose payout ended Failed"; First Check "`payout_failed_total` and the payout's `last_failure_reason`"; Likely Cause "CardPay refusals for 24 h". If OI-13 is accepted, row (4) also covers Unknown payouts.
- **Why:** each of these alerts guards an NFR (LOYALTY/NFR-01, LOYALTY/NFR-02, REFUNDS/NFR-02, REFUNDS/NFR-01), and a first check costs nothing while severity and action wait for §20.3; B leaves on-call without guidance on exactly the money and balance alerts. Tradeoff accepted: four more rows carrying open markers.
- **Status:** Accepted - applied (16 §20.2)

---

### OI-21: The UAT environment omits MsgHub although the UAT suite checks messages

- **Where:** §19 UAT row (chunk 15)
- **Type:** Inconsistency
- **Concern:** The UAT row connects "the POS records and CardPay sandboxes, as the REFUNDS UAT suite expects", but that suite also checks messages: TC-REQ-07 (the customer gets an email), TC-DEC-01 (the customer is told), and TC-DEC-04 (the branch manager is told) (REFUNDS 16, context only). Its prerequisite P1 lists only the POS and payment sandboxes, and §19 copied that gap, so those three cases cannot pass in UAT as specified, while UAT sign-off gates Prod (§11.3).
- **Options:**
  - **A.** Connect MsgHub in UAT (sandbox, or live with test recipients only) - the suite runs end to end.
  - **B.** Stub MsgHub in UAT and check notification rows - no provider setup; the cases no longer prove a person is told.
- **Recommended Answer:** Option A. Change the §19 UAT Data cell (chunk 15) to: "Synthetic test data; connected to the POS records, CardPay, and MsgHub sandboxes (MsgHub may run live with test recipients only), as the REFUNDS UAT suite expects, including its message checks (TC-REQ-07, TC-DEC-01, TC-DEC-04)."
- **Why:** the three cases verify [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request) step 5 and [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 7 and E1, which only a real message path proves; B would let UAT pass without testing a customer-facing step. Tradeoff accepted: one more sandbox or test-recipient setup for UAT.
- **Status:** Accepted - applied (15 §19)

---

### OI-22: §17.2 restates the API-01 contract, and one platform question has four homes

- **Where:** §17.2 Business Logic (Request), API Standards (Idempotency), Error Handling (chunk 13b); Compliance of §17.1-§17.4 (chunks 13a-13d); §11.6 (chunk 07)
- **Type:** Duplication
- **Concern:** Chunk 11's CONTRACT_RULE says a module chunk lists a port call by its API ID and "never restates the headers, body, or error codes", yet §17.2 restates API-01's validation rules, authorization check, idempotency behaviour, and its three errors with their codes (the Request bullet, API Standards Idempotency, and the Error Handling Synchronous, Validation, Domain, and Auth lines). A later change to API-01 must then be made twice and can drift unnoticed. Separately, the same platform-level question, "[NEEDS CLARIFICATION: which control set applies to the platform.]", sits in the Compliance block of all four module chunks: one fact with four homes.
- **Options:**
  - **A.** Reference API-01 from §17.2, keeping only the module's own behaviour, and move the control-set question to §11.6 once - one home per fact.
  - **B.** Keep the restatement and add a drift check to every reconciliation - no edit now; a standing cost at every change.
- **Recommended Answer:** Option A. In §17.2 (chunk 13b), replace the Request bullet with "**Request** (API-01, §15.3): implements the port contract and stores a Pending payout with `nextAttemptAt` now, in the caller's transaction; no provider call happens inside the port."; the API Standards Idempotency line with "Idempotency: per API-01 (§15.3); CardPay calls carry the payout ID (ADR-09)."; and the Error Handling Synchronous, Validation, Domain, and Auth lines with "**Port errors:** the API-01 errors (§15.3); [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1 is a state (Retrying, then Failed), not an error to the caller." Move the control-set question to §11.6 (chunk 07) as "**Control set:** [NEEDS CLARIFICATION: which control set applies to the platform.]" and change the ISO 27001 / SOC 2 line of each 13x Compliance block to "per §11.6".
- **Why:** chunk 11 is the canonical home of API-01 (its CONTRACT_RULE), and a platform-wide question belongs once in the platform section; B keeps two homes and pays at every change. Tradeoff accepted: a reader of §17.2 follows one link to see the port's errors.
- **Status:** Accepted - applied (13b §17.2; 07 §11.6; 13a to 13d Compliance)

---

## Resolution Log

| ID | Resolution Date | Resolved In | Outcome |
|----|----------------|-------------|---------|
| OI-01 | 2026-09-30 | 10 §14.10 rule 8; 12 §16.8 rule 4; 07 §11.1 | Accepted recommendation |
| OI-02 | 2026-09-30 | 10 §14.10 rules 3 and 5; 07 §11.4 | Accepted recommendation |
| OI-03 | 2026-09-30 | 07 §11.3; 10 §14.10 rules 3 and 7 | Accepted recommendation |
| OI-04 | 2026-09-30 | 07 §11.2 and §11.5; 06 ADR-06; 13b, 13c, 13d Multi-Tenancy Specifications | Accepted recommendation |
| OI-05 | 2026-09-30 | 12 §16.8 rule 5; 01 §3 assumption 2 | Accepted recommendation |
| OI-06 | 2026-09-30 | 01 §4 R-06; 06 ADR-09; 13a §17.1 Submit | Accepted recommendation |
| OI-07 | 2026-09-30 | 01 §4 R-08; 12 §16.5 footnote ¹; 13a §17.1 Constraints; 11 API-02 | Accepted recommendation |
| OI-08 | 2026-09-30 | 12 §16.8 rule 6; 13a §17.1 Business Logic, Constraints, Error Handling, Figure 14 | Accepted recommendation |
| OI-09 | 2026-09-30 | 01 §5; 13a §17.1 Submit and Tables; 11 API-01 and API-02 | Accepted recommendation |
| OI-10 | 2026-09-30 | 01 §5; 13a §17.1 Tables; 11 API-02 | Accepted recommendation |
| OI-11 | 2026-09-30 | 13a §17.1 Receipt lookup, Error Handling, Constraints; 11 API-02 | Accepted recommendation |
| OI-12 | 2026-09-30 | 01 §3 assumption 8; 13a §17.1 Developer Notes | Accepted recommendation |
| OI-13 | 2026-09-30 | 13b §17.2 Business Logic, Tables, Metrics, Figures 15 and 17; 11 API-01 and API-03; 09 §13; 14 §18 | Accepted recommendation |
| OI-14 | 2026-09-30 | 06 ADR-07; 10 §14.9.0 and §14.8; 13a §17.1 Submit and Tables; 01 §3 assumption 1 | Accepted recommendation |
| OI-15 | 2026-09-30 | 13c §17.3 Business Logic, Tables, Figures 18 and 19; 10 §14.10 Notes | Accepted recommendation |
| OI-16 | 2026-09-30 | 13d §17.4 Take-back, Pending take-back, Developer Notes, Figure 21 | Accepted recommendation |
| OI-17 | 2026-09-30 | 13d §17.4 Pending take-back, Tables, Metrics; 01 §4 R-05; 11 API-02 | Accepted recommendation |
| OI-18 | 2026-09-30 | 13a §17.1 Branch refund report | Accepted recommendation |
| OI-19 | 2026-09-30 | 14 §18; 02 §6; 01 §4 R-09 | Accepted recommendation |
| OI-20 | 2026-09-30 | 16 §20.2 | Accepted recommendation |
| OI-21 | 2026-09-30 | 15 §19 | Accepted recommendation |
| OI-22 | 2026-09-30 | 13b §17.2; 07 §11.6; 13a to 13d Compliance | Accepted recommendation |

---

## Reviewer Notes

| Risk surface | Checked | Findings | Notes |
|---|---|---|---|
| Architecture style | ADR-01 against the BRD drivers (REFUNDS 02 Facts, REFUNDS/NFR-01 to NFR-03, both Wishlists, one team assumed); §8.1; §13 boundaries; hexagonal ports and anti-corruption adapters; whether everything that leaves the process goes through an outbox | 2 findings (OI-03, OI-06) | The style fits the drivers; provider writes leave through dispatch tables (ADR-09) and no event leaves the process; module dependencies stay acyclic; no cross-schema read found. |
| ADRs | ADR-01 to ADR-09: status, why, how, consequences, alternatives; decisions the body makes without an ADR | 3 findings (OI-04, OI-06, OI-14) | No missing ADR; the items correct ADR-06 (table ownership under row-level security), ADR-09 (consequence wording), and ADR-07 (claim list). ADR-08 stays Proposed with its inline marker. |
| Cross-cutting concerns | §11.1 to §11.6 against the CLAUDE.md defaults and their use in 13a to 13d | 4 findings (OI-01, OI-02, OI-03, OI-04) | Values left open (sampling, rotation, scanning, feature flags, resources) stay inline markers. |
| Per-service contracts | 13a to 13d against the template sub-sections; tables against ERDs, DTOs, and API-01 constraints; state machines; error mapping per BRD exception flow | 7 findings (OI-10, OI-11, OI-13, OI-15, OI-16, OI-17, OI-18) | Every sub-section is present in all four modules; column sizes match the API-01 DTO constraints. |
| Event contract consistency | The 13 in-process rows of 13a to 13d against §14.10, field by field from publisher and listener sides; one publisher per listened event; event names in §8.3, §8.5, §12 INT-02, §13, and §14.9.0 | 2 findings (OI-01, OI-14) | Names, publishers, listeners, phases, and DTO fields match §14.10 verbatim everywhere and every listened event has exactly one publisher; OI-14 is a field the listener logic needs, OI-01 the handling of the `pii` fields. |
| Role catalogue consistency | §16.5, §16.11, and §16.12.2 against the 13a, 13b, and 13d List of APIs and Constraints, API-01, and the REFUNDS 07 and LOYALTY 07 matrices | 3 findings (OI-05, OI-07, OI-08) | Tokens, roles, scopes, and counts match verbatim across chunks and both matrices. |
| API contracts | §15.2 against §12, §8.5, and the 13x Integrations rows; API-01 port, DTOs, typed errors with `errorCode`, permission token, no URI; API-02 to API-04 `TBD - external` with markers and filled our-side policy; one-hop rule; §15.4 | No issue found | API-01 is complete; the API-02 marker gains data requests from OI-07, OI-09, OI-10, OI-11, and OI-17; API-01 gains an additive status value from OI-13; the §17.2 restatement of API-01 is OI-22. |
| NFRs | REFUNDS/NFR-01 to NFR-04 and LOYALTY/NFR-01 and NFR-02 against the §18 technical targets and where each is realised | 4 findings (OI-02, OI-13, OI-16, OI-19) | p95 latency, growth, and autoscaling stay inline markers. |
| Integrations | §12 INT-01 to INT-03 error paths, timeouts, retries, and fallbacks against API-02 to API-04, §8.5, and the module Integrations rows | 4 findings (OI-06, OI-09, OI-11, OI-13) | Timeout, rate-limit, and backoff values stay inline markers. |
| Multi-tenancy | ADR-03, §11.2, `tenant_id` keys and index order in every table, tenant in DTOs and call context, tenancy of background jobs, tenant resolution in the single realm | 2 findings (OI-04, OI-05) | Every module table and index leads with `tenant_id`; the publication log exception is handled in OI-01. |
| Observability | §11.4 and the logging, metrics, and tracing of 13a to 13d; every alert traced to a defined metric | 2 findings (OI-02, OI-17) | `tenant_id` and PII stay out of INFO logs in all four modules. |
| Security and compliance | Per-module authorization against both Users & Use Cases Matrices; PII at rest, in transit, in logs, and in events; erasure; claim integrity; receipt access | 4 findings (OI-01, OI-05, OI-07, OI-08) | GDPR basis, retention, and control-set questions stay inline (OI-22 gives the last one a single home). |
| Deployment failure modes | §11.3 rolling update and expand-contract, Flyway pre-upgrade job, dispatcher shutdown and re-claim, multi-replica background work, releases that change event identity | 1 finding (OI-03) | Dispatcher row claims and readiness rules are sound; HA topology stays an inline marker. |
| Runbook | §20.1 procedures; §20.2 rows against every alert defined in 13a to 13d and §18; §20.3 | 1 finding (OI-20) | Procedures and on-call stay inline markers. |
| BRD-to-SDD traceability | §7.3 as checklist: seven rows, one owner each in §13, entry points verbatim against the 13a and 13d List of APIs, Flows against the §8.4 and §8.5 "Use cases" lines, APIs against §15.2, Events against the §14.10 When column; 364 relative links and anchors; cross-BRD personas, terms, qualities, and mandates; BRD rules realised | 5 findings (OI-09, OI-10, OI-11, OI-12, OI-21) | Every §7.3 cell agrees with its home and every UC link opens the right BRD heading; all links resolve once this chunk exists; receipt number versus purchase reference (OI-09) is the one undecided cross-BRD difference. |
| Duplication | BRD restatement in 13x Business Logic; chunk 11 against 13x contract fields; scalar facts and open questions with several homes | 1 finding (OI-22) | Template-mandated mirrors (§14.10 and 13x event rows, §15.3 our-side rows taken from §12) are not counted. |

- 22 distinct items. A row lists every item that touches its surface, so an item can appear in more than one row.
- Citation nit, not raised as an item: §17.1 Error Handling cites two rules without their labels; they should read "BR-3: a rejection always has a reason" and "[REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) BR-1: own branch only".
- No decision-process narration found in content chunks; the "questionnaire Q8" style notes in §6 point at the decision log and read as provenance.
- Mermaid: all 21 figures read as valid flowchart, sequence, state, and ER syntax.
- Not raised: `refund` does not listen to `PayoutFailed`, so neither the request detail nor the branch queue shows a failed payout and the manager's only signal is the message; worth weighing when the alert-channel question of §17.3 is answered.
- Not raised: §16.8 rule 3 lets a removed manager decide until the current access token expires; a short staff token lifetime in the realm configuration bounds it.
- Not raised: CLAUDE.md asks for i18n and RTL from day one; neither BRD names a language, and the SDD covers locale only for messages (OI-14); the §6 Frontend Stack row can state it.

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 17-appendix-and-wishlist.md | NEXT: 19-e2e-system-design.md -->

# Refunds Platform SDD: proposed answers to the E3 clarification markers

## Marker count by chunk

| Chunk | Section(s) holding markers | `[NEEDS CLARIFICATION]` markers | IDs |
|-------|----------------------------|-------------------------------:|-----|
| 03 | §7.3 Use Case Traceability | 0 | - |
| 09 | §13 Services Decomposition | 0 | - |
| 10 | §14.9 Payload Contract Samples | 1 | CL-01 |
| 11 | §15 Service Integration API Contracts | 0 | - |
| 12 | §16.6 Grant / Invitation Authority | 1 | CL-02 |
| 13a | §17.1 refund-service | 6 | CL-03 to CL-08 |
| 13b | §17.2 payout-service | 5 | CL-09 to CL-13 |
| 13c | §17.3 notification-service | 4 | CL-14 to CL-17 |
| 13d | §17.4 loyalty-service | 8 | CL-18 to CL-25 (line 38 holds two markers: CL-19 and CL-20) |
| **Total** | | **25** | |

The count matches the master's E2E gate line ("chunk 10 (§14.9: 1), 12 (§16.6: 1), 13a (6), 13b (5), 13c (4), and 13d (8)"). Out of scope and not counted: the `[TBD - EXTERNAL: ...]` markers of API-01 to API-04 in chunk 11, and every marker in chunks 00 to 02, 06 to 08, and 14 to 17 (they do not block E3).

---

## How to read this file

- **Source:** `sdd-refunds-platform` v1.0 (Reconciled 2026-09-30), REFUNDS v1.0, LOYALTY v1.0, CLAUDE.md, sdd-unifier SKILL.md step 8b (E3). Nothing in the SDD was modified; every entry is a proposal for the SDD owner.
- **Entry fields:** Where (file, section, line, marker verbatim), Question, Options, Recommended Answer (the text that replaces the marker, then any edit elsewhere the answer needs), Why, plus two helper lines: **Linked** (markers whose answers depend on each other) and **Registry impact** (whether chunk 10, 11, or 12 gains or changes anything).
- **Links** inside Recommended Answer text are written relative to the SDD chunk folder (`../brd-refunds-portal/...`), so they paste into a chunk as they are.
- **No legal or provider fact is asserted.** Where a marker depends on a law, a regulator, or a provider's API, the answer is a design decision that works either way (a setting with a default and an owner, or a data need recorded against the existing `TBD - EXTERNAL` item), and the Why says so.

### Apply order

1. CL-09, CL-10, CL-03, and CL-08 first: CL-01 ratifies the event contracts as those four leave them.
2. CL-07 before CL-13 and CL-16 (CL-07 writes the shared rule into §14.6).
3. CL-18, CL-19, and CL-20 before CL-21 and CL-23 (the columns and DTOs follow the rules).
4. CL-05 before CL-12, CL-15, and CL-22 (CL-05 adds the retention settings to §11.2).

### After applying (so the gate actually opens)

- Record each decision in `decision-log.md` under the clarification register with its `Rule home:` link, and bump the chunk 00 Changes Log once for the batch.
- Rerun step 6a: chunk 10 (statuses, two field notes, §14.6 rule 4), chunk 11 (API-02 and API-04 notes), and every 13x chunk change. E4 needs the `**Reconciled:**` date to follow these edits.
- Check E3 against the files: no `[NEEDS CLARIFICATION` in chunks 09, 10, 11, 12, 13a to 13d, or in 03 §7.3. E1 and E2 are already met and none of these answers opens an OI or a divergence row.

### Follow-ups these answers raise (decision log, not chunk text)

| Owner | Items |
|-------|-------|
| REFUNDS owner | CL-02 who holds the tenant staff administrator account for the current tenant; CL-03 an email or SMS alert to staff, if wanted; CL-05 and CL-12 the real values of `refundRecordRetention` and `contactDetailsRetention` (with finance and data protection advisers); CL-09 an end for a payout the provider refuses for good (manual retry, other route, or closing) and the 6-hour post-window interval; CL-15 `messageLogRetention` |
| LOYALTY owner | CL-18 round-down rule; CL-20 proportional take-back for partial refunds; CL-22 a "member left" signal, if wanted |
| Data protection owner (retailer) | CL-08, CL-17, CL-25 the lawful basis for each purpose, and confirmation that the erasure paths answer an erasure request |
| Security owner (retailer) | CL-08, CL-17, CL-25 any ISO 27001 or SOC 2 scope; CL-10 the PCI DSS scope with CardPay |
| External (`TBD - EXTERNAL`, chunk 11) | CL-10 API-02: which reference of the original card payment CardPay needs, and that no card data is needed; CL-19 API-04: the receipt number with each member purchase |

### LOYALTY v1.1 draft found during this run

While these answers were written, the copy of the LOYALTY BRD the SDD's relative links resolve to (`s4/brd-loyalty-points`) was changed by another run to **v1.1, Status In Review** (grill-me decisions TD-01 to TD-16, open items OI-02 to OI-08). The fixture copy used here, and the SDD's Document Lineage, are still **v1.0**, so every answer below rests on v1.0. If v1.1 is signed off and registered in the SDD (`brd-to-sdd.md` § Changes after the SDD exists), these entries change:

| Entry | Effect of v1.1 |
|-------|----------------|
| CL-18 | Confirmed: v1.1 03 and TD-07 say "1 point for each whole 1 EUR spent; cents earn no points". But TD-14 ("No 0-point movements": a 0.80 EUR purchase earns nothing and creates no movement) makes a 0-point purchase normal, so it should pass the import without the OI-19 rejection alert instead of being a `NO_POINTS` rejection. |
| CL-20 | Adjust to v1.1 UC-02 BR-3 (TD-12): each partial refund takes back 1 point per whole 1 EUR refunded, never more than the purchase earned, and all remaining points once the whole purchase is refunded. The cumulative rule here gives the same result for a first partial refund (v1.1's example: 30.50 EUR refunded from an 80.00 EUR purchase gives -30) and for a purchase refunded in full, but differs for a later partial refund that does not complete the purchase (two 10.50 EUR refunds of a 50.00 EUR purchase: v1.1 takes back 20 points, the cumulative rule 21). |
| CL-21, CL-23 | v1.1 03 ("Movement date") and TD-03: a taken-back movement carries the date the refund was paid, so `points_movement.occurred_at` for `TAKEN_BACK` becomes the refund's `paid_at`, not the time the take-back was applied. The CL-23 detail fields already match v1.1 UC-02 step 4 (reference, date, amount in EUR, points). |
| CL-19, CL-22, CL-24 | Unaffected: v1.1 08 still names no receipt number in the POS data, v1.1 04 keeps joining the program out of scope (no leave signal), and v1.1 NFR-02 still starts the hour at the Refunds Portal's paid report, which `RefundPaid` marks. |

Outside these markers, v1.1 also adds NFR-03 (earned points within 1 hour of POS Records reporting the purchase), which the hourly `loyalty-purchase-import` of §17.4 Input may not meet; that is for the SDD update that registers v1.1.

### Out-of-scope markers these answers touch (left as they are)

Chunk 08 §12: INT-01 timeout and first and maximum retry delay (CL-09, CL-11), INT-02 timeout and attempt limit (CL-14, CL-16). Chunk 16: §20.1.3 DLQ replay (CL-07) and §20.1.9 item (1), whose text says "see the §17.2 clarification"; after CL-09 it should say "§17.2 After the retry window".

### Dependency map

| Entry | Depends on or shapes |
|-------|----------------------|
| CL-01 | CL-03, CL-06, CL-08, CL-09, CL-10 |
| CL-03 | CL-06, CL-09 |
| CL-04 | CL-05, CL-06, CL-08, CL-10 |
| CL-05 | CL-04, CL-08, CL-12, CL-15, CL-22 |
| CL-07, CL-13, CL-16 | one shared rule; CL-24 follows the same "never drop" idea in process |
| CL-08, CL-17, CL-25 | one compliance approach; CL-08 needs CL-01 amendment 1 |
| CL-09 | CL-01, CL-03, CL-11, CL-12 |
| CL-10 | CL-01, CL-04, CL-11 |
| CL-14, CL-15, CL-17 | notification-service columns, retention, compliance |
| CL-18, CL-19, CL-20 | earning and take-back rules; shape CL-21 and CL-23 |
| CL-22, CL-25 | ledger retention and erasure |

---

## CL-01: Ratify the candidate event payload contracts

**Where:** `10-events-hub.md`, §14.9 Payload Contract Samples, the bold line under the heading (line 169).

```text
[NEEDS CLARIFICATION: ratify the candidate payload contracts below; they are derived from the use-case steps and from what each consumer needs, and the architect has not yet confirmed them.]
```

**Question:** Are the seven candidate payload contracts in §14.9.1 to §14.9.7 ratified, and with which amendments, so that §14.5 can mark them `committed`?

**Options:**
- **A.** Ratify all seven now with four contract-level amendments (below) found by checking each field against every consumer and against the other markers, and mark them `committed` - the e2e design consolidates a final contract; later changes stay additive (§14.6 rule 5).
- **B.** Ratify the seven exactly as written - no edit, but `customerId` stays untagged although §17.1 Compliance calls customer ids personal data, `customerContact` stays required although an erased customer has none (CL-08), and the JSON encoding of money stays undefined between producer and consumers.
- **C.** Keep them `candidate` until the CardPay and MsgHub documentation arrives - avoids a second schema version if a provider needs a new field, but no provider document will clear this marker, and a provider-driven field is an additive change anyway.

**Recommended Answer:** Option A. Replace the marker with:

> The contracts below are ratified: each is `committed` in P1 and registered as version 1.0.0 of its JSON Schema subject; later versions are additive only (§14.6 rule 5). A `decimal(p,s)` field travels as a JSON string holding a plain decimal number (for example `"50.00"`), and a `timestamp` as an ISO-8601 UTC string.

Amendments made at ratification:

1. **`customerContact`** in §14.9.1 to §14.9.5: Required becomes `C`; Notes become "`pii`; present unless the customer's contact details were erased (§17.1 Compliance); when absent, notification-service records each channel `SKIPPED` (§17.3)". §14.9.3 keeps its "for notification-service only (ADR-10)".
2. **`customerId`** in §14.9.1 to §14.9.5: Notes gain `pii`. In the erasure-path mapping, the Field cell of all three rows becomes "`customerContact`, `customerId`".
3. **`PAYOUT_FAILED`** in §14.5.2, Business column, becomes: "The payout still fails at the end of the §17.2 retry window · [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1 · refund-service flags the request for the branch manager; written once per payout, and `PAYOUT_SUCCEEDED` can still follow because the payout keeps being retried (§17.2)" (from CL-09).
4. **Status `candidate` to `committed`** in: §14.1 item 1 area, where "All seven integration events are `candidate`: their names and consumers are designed, and each consumer is wired once its payload contract is ratified (§14.9)." becomes "All seven integration events are `committed`: their payload contracts are ratified (§14.9) and every consumer listed in §14.5 is wired in P1."; the Status columns of §14.5.1 and §14.5.2; the seven §14.9.x headings; §14.9.99. In §17.1, §17.2, and §17.3, "Every integration event above is a `candidate` in §14.5." becomes "Every integration event above is `committed` in §14.5."

No field is added or removed. `REFUND_APPROVED` keeps `receiptNumber` as the reference of the original payment (CL-10), and no staff contact enters an event (CL-03).

**Why:** Step 6a check 3 passes for every consumer as written: payout-service relies on the envelope `aggregate_id`, `approvedAmount`, `referenceNumber`, and `receiptNumber` (§17.2 consumed table); notification-service on `customerContact`, `referenceNumber`, `requestedAmount`, `approvedAmount`, `partial`, `decisionReason`, `rejectionReason`, and `paidAmount` (§17.3); refund-service on `refundRequestId`, `paidAmount`, and `firstAttemptAt` (§17.1). So ratification needs no field change, only the four amendments: amendment 1 is what the erasure path needs (CL-08) and is handled by the existing §17.3 "Missing address" rule; amendment 2 is the §14.9 rule that personal-data fields are tagged and mapped, since §17.1 Compliance names customer ids as personal data; amendment 3 states the consumer-visible effect of CL-09; and a string keeps `decimal(19,4)` exact where a JSON number can be read through binary floating point. ADR-10 is unchanged: contact details still travel, and only an erased customer's later events lack them. CLAUDE.md requires additive-only schema evolution through the registry, which is why ratifying now is safe and C buys nothing. Tradeoff accepted: a field CardPay or MsgHub later needs arrives as schema version 1.1.0, and chunk 19 is refreshed then.

**Linked:** CL-03, CL-06 (the same money encoding on REST), CL-08 (amendment 1), CL-09 (amendment 3), CL-10 (no new field now).

**Registry impact:** Chunk 10 only: status of the seven existing events, two field notes and one Required value in §14.9.1 to §14.9.5, the erasure map's Field cell, and one §14.5.2 business cell. No event, topic, or field is added or removed.

---

## CL-02: Who provisions branch manager accounts

**Where:** `12-centralized-user-roles.md`, §16.6 Grant / Invitation Authority, row 3, Grantor role cell (line 78).

```text
[NEEDS CLARIFICATION: who creates branch manager accounts and assigns their branch; no BRD use case covers staff provisioning]
```

**Question:** Who creates branch manager accounts and assigns each one its branch, given that no BRD use case covers staff provisioning and §2.2 puts it outside the platform?

**Options:**
- **A.** A tenant staff administrator in the Keycloak realm administration, outside the platform's web app - no new platform role, permission token, endpoint, or use case; staff changes are made by hand in the Keycloak admin console.
- **B.** A platform role (a tenant administrator) with a staff screen in the web app - in-app audit and branch pick-lists, but a new role, tokens, endpoints, and a use case neither BRD states, and the SDD never adds a use case.
- **C.** Federation from the retailer's staff directory into Keycloak - no manual account creation, but it depends on a directory neither BRD names, and the branch assignment still needs a source.

**Recommended Answer:** Option A. The row becomes:

| Grantor role | May create / invite | Constraints |
|---|---|---|
| Tenant staff administrator (Keycloak realm administration, outside the platform's web app) | `BRANCH_MANAGER` | Exactly one branch per account (§3 assumption 2). Creates a `STAFF` account and sets, together, the `tenant_id` and `branch_id` attributes and the `BRANCH_MANAGER` realm role; never gives a `STAFF` account `CUSTOMER` or `MEMBER` (§16.3); a change applies at the next token refresh (§16.8). An administrator manages only its own tenant's staff accounts. |

Also apply:
- Figure 12: node `ADM["Staff provisioning, owner to be confirmed"]` becomes `ADM["Tenant staff administrator, Keycloak admin console"]`; its Summary ends "... and branch managers are provisioned with their branch by the tenant staff administrator in the Keycloak realm administration, outside the platform (§16.6)."
- §2.2 stays as it is: the platform builds no staff provisioning feature. How the shared realm limits an administrator to one tenant's staff is set in the LLD's Keycloak realm configuration.

**Why:** No BRD use case covers staff provisioning and §2.2 already excludes it; sdd-quality.md says the SDD cites BRD use cases and never adds one, which rules out B. ADR-07 and CLAUDE.md (Keycloak on-prem, single-realm multi-tenancy) make the realm the identity source of `STAFF` (§16.3), and §16.2 step 1 (OI-07) already says staff provisioning sets `tenant_id`; OI-14's rule that staff never hold customer roles becomes an explicit constraint of the grantor. [REFUNDS 16] prerequisite P2 (one branch manager account per branch) is met the same way. Tradeoff accepted: provisioning is manual, and its audit trail is Keycloak's own administration audit rather than the platform's. Which person or team holds the administrator account for the current tenant is an organisational choice for the REFUNDS owner, not a design input. I am not certain how finely the Keycloak version the platform team runs can delegate user administration per tenant in one realm, which is why that mechanism is left to the LLD.

**Linked:** none.

**Registry impact:** Chunk 12 §16.6 row 3 and Figure 12 only. No realm role or permission token is added; §16.11 and the §16.12.2 counts (4 / 1 / 3) are unchanged.

---

## CL-03: Is the branch manager told about a failing payout by email or SMS

**Where:** `13a-service-refund.md`, §17.1 refund-service > Business Logic > "Payout outcome" bullet (line 46).

```text
[NEEDS CLARIFICATION: must the branch manager also be told by email or SMS when a payout still fails after one day ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1)? The Notification Partner row of REFUNDS 08 covers customer messages only, so the design tells the branch manager in the portal.]
```

**Question:** Is the branch manager told about a payout that still fails after one day only in the portal, or also by email or SMS?

**Options:**
- **A.** In the portal only: the payout-failing list and flag, plus a count when the branch area opens - inside REFUNDS 04 and 08 scope, no new consumer or contact data; the manager learns it when they open the portal.
- **B.** Email or SMS to the branch manager through notification-service - an active alert, but notification-service would consume `PAYOUT_FAILED` (a new §14.5.2 consumer), need staff contact details no event or BRD supplies, and send a staff message type the Notification Partner row does not cover.
- **C.** Both A and B - same costs as B.

**Recommended Answer:** Option A. Replace the marker with:

> The branch manager is told in the portal, the one place [REFUNDS 01 § Business Objectives](../brd-refunds-portal/01-executive-summary-and-context.md#business-objectives) objective 3 gives them: the request is listed by the branch queue with `payoutFailing=true` and flagged on its detail (`payoutFailingSince`, List of APIs), and the branch area shows the number of payout-failing requests when it opens. No email or SMS goes to staff: the notification partner carries customer messages only ([REFUNDS 08 § Integrations](../brd-refunds-portal/08-integrations.md#integrations)).

**Why:** [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1 and AC-2 say only that the branch manager "is told", and [REFUNDS 16] TC-DEC-04 checks the same without a channel; REFUNDS 04 In Scope lists "Customer messages by email and SMS" and REFUNDS 08 gives the Notification Partner the purpose "Tell customers about their refund". B would add a staff message type the BRD does not state and grow §14.5.2 and §16.7. The flag, the list, and the payout watchdog (OI-16) already exist, so A needs no new endpoint. Tradeoff accepted: a manager who does not open the portal does not learn of the failure; an active staff alert is a BRD follow-up for the REFUNDS owner.

**Linked:** CL-09 (the request stays on the list while its payout keeps being retried, and leaves it once paid); CL-06 (`payoutFailingSince` and the page's `totalItems` carry the flag and the count).

**Registry impact:** None.

---

## CL-04: Full column list, constraints, and indexes of the `refund` schema

**Where:** `13a-service-refund.md`, §17.1 > DB Modeling > Tables Design, the line after the table (line 153).

```text
[NEEDS CLARIFICATION: the full column list, remaining constraints, and secondary indexes of the `refund` schema; the BRD describes the concepts, not a relational schema.]
```

**Question:** Which further columns, constraints, and secondary indexes of the `refund` schema does the SDD fix, and what is left to the child LLD?

**Options:**
- **A.** The SDD adds every column a §17.1 rule, event field, API field, tenancy rule, or retention clock relies on, and the index behind each query and worker; lengths, check wording, and plan-driven indexes go to the LLD's data section - every stated rule has a column, and the LLD cannot change a key.
- **B.** The SDD fixes the full physical schema now (every length and index) - nothing left to the LLD, but the SDD duplicates the LLD's data section and changes with every physical tweak.
- **C.** Leave the table as is and hand the rest to the LLD - smallest edit, but the LLD would invent columns for rules the SDD states (the customer's reason, the decision time, the paid amount, the reference counter).

**Recommended Answer:** Option A. Add these rows to the Tables Design:

| Table | Column | Type | Constraints | Notes |
|-------|--------|------|-------------|-------|
| `refund_request` | `receipt_number` | varchar | NOT NULL | From the submission; carried in `REFUND_APPROVED` and `RefundPaid` |
| `refund_request` | `request_reason` | text | NOT NULL | The customer's reason ([REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) step 3; shown at [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 2) |
| `refund_request` | `decided_at` | timestamptz | NULL until decided | Set with the `APPROVED` or `REJECTED` transition; the report's time to decision |
| `refund_request` | `paid_amount`, `paid_at`, `payout_id` | numeric(19,4), timestamptz, uuid | NULL until `PAID` | From `PAYOUT_SUCCEEDED` (`paidAmount`, envelope `aggregate_id`) |
| `refund_request` | `closed_at` | timestamptz | NULL until final | Set on `CANCELLED`, `REJECTED`, or `PAID`; the retention clocks start here (Retention Policy) |
| `refund_request` | auditing columns | per §11.1 | `version` for optimistic locking | `created_at` is the submission time |
| `refund_item` | `id`, `refund_request_id` | uuid, uuid | PK; FK to `refund_request` | |
| `refund_item` | `description`, `amount` | varchar, numeric(19,4) | NOT NULL; `amount` > 0 | From API-01 at submission, in the request currency |
| `refund_item` | `active` | boolean | NOT NULL | True while the request is `SUBMITTED`, `APPROVED`, or `PAID`; false once `CANCELLED` or `REJECTED` (the item is released) |
| `refund_status_history` | `id`, `tenant_id`, `refund_request_id`, `from_status` | uuid, uuid, uuid, varchar | PK; NOT NULL; FK; NULL on the first row | `tenant_id` as on every table (§11.2) |
| `refund_reference_counter` | `tenant_id`, `last_value` | uuid, bigint | PK `tenant_id`; NOT NULL | Incremented under its row lock in the submit transaction; the reference number is `RF-` and `last_value` padded to 10 digits |
| `outbox_event` | `aggregate_id`, `event_type`, `message_key`, `occurred_at`, `traceparent` | uuid, varchar, uuid, timestamptz, varchar | NOT NULL except `traceparent` | `payload` holds the whole §14.3 envelope; `message_key` is the `refundRequestId` (§14.4) |

Indexes (each leads with `tenant_id`, §11.1):
- `refund_request (tenant_id, customer_id, created_at)` - the customer's list ([REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status-web-and-mobile)).
- `refund_request (tenant_id, branch_id, status, created_at)` - the branch queue, oldest first.
- `refund_request (tenant_id, branch_id, created_at)` where `status = 'APPROVED'` and `payout_failing_since` or `payout_outcome_overdue_since` is set - the payout-failing list.
- `refund_request (tenant_id, decided_at)` where `status = 'APPROVED'` and both flags are null - the payout watchdog.
- `refund_request (tenant_id, branch_id, decided_at)` and `(tenant_id, branch_id, paid_at)` - the daily branch report.
- `refund_request (tenant_id, closed_at)` - the retention jobs.
- `refund_item (tenant_id, refund_request_id)`; `refund_status_history (tenant_id, refund_request_id, changed_at)`.
- `outbox_event (tenant_id, occurred_at)` where `published_at` is null - the relay; `outbox_event (tenant_id, published_at)` and `inbox_message (tenant_id, processed_at)` - the 7-day purge.

Figure 15: add `uuid tenant_id` to `REFUND_STATUS_HISTORY`.

Replace the marker with:

> Column lengths, check-constraint wording, and any index a query plan shows to be missing are set in the child LLD's data section; they never change a key, a uniqueness rule, or a tenant rule above. The `Idempotency-Key` store behind the POST endpoints (table, key scope per caller, retention) is designed there too.

**Why:** Each added column traces to a stated rule: `request_reason` to REFUNDS/UC-01 step 3 and UC-04 step 2; `decided_at`, `paid_amount`, and `paid_at` to the branch report ([REFUNDS 09](../brd-refunds-portal/09-reporting-and-analytics.md#reporting--analytics)); `payout_id` and `paid_at` to `REFUND_PAID` and `RefundPaid`; `closed_at` to CL-05; the counter to §17.1 Boundaries ("the per-tenant reference number counter"); `active` to "releases the items". `refund_status_history` lacked `tenant_id`, which OI-06 (child tables carry `tenant_id`) and CLAUDE.md (every shared-schema index includes `tenant_id`) require. The review left the `Idempotency-Key` store to the LLD (chunk 18 Reviewer Notes), and CLAUDE.md gives the LLD its data section. Tradeoff accepted: the SDD stays at contract level, so the LLD fills lengths and may add indexes, but never changes a key.

**Linked:** CL-05 (`closed_at`), CL-06 (DTO fields map to these columns), CL-08 (erasure clears `customer_email` and `customer_mobile`), CL-10 (no card-payment column now).

**Registry impact:** None.

---

## CL-05: Retention of refund records and customer contact details

**Where:** `13a-service-refund.md`, §17.1 > DB Modeling > Retention Policy, first bullet (line 164).

```text
[NEEDS CLARIFICATION: retention period for refund records and customer contact details; refunds are financial records and may carry a statutory retention period.]
```

**Question:** How long are refund records and customer contact details kept, when the statutory period for financial records is not known to the design?

**Options:**
- **A.** Two tenant settings with defaults: the refund record deleted 10 years after it closes, the contact details cleared 30 days after it closes; the REFUNDS owner sets the real values - no law assumed, no code change when the value is confirmed, contact data minimised early.
- **B.** One fixed period stated in the SDD for everything - simple, but it asserts a legal period the design does not know, and keeps contact details as long as the financial record.
- **C.** No purge until the period is known - nothing deleted by mistake, but contact details are kept with no end, against the minimisation applied elsewhere (OI-17, ADR-10).

**Recommended Answer:** Option A. Replace the bullet with:

> - `refund_request`, `refund_item`, `refund_status_history`: deleted by the retention job when the tenant setting `refundRecordRetention` (§11.2) has passed since `closed_at`; default 10 years. A request that has not closed is kept.
> - `customer_email`, `customer_mobile`: set to NULL by the retention job when the tenant setting `contactDetailsRetention` (§11.2) has passed since `closed_at`; default 30 days. No customer message is sent after a request closes, and notification-service holds its own copy until each message is final (§17.3).
> - `refund_reference_counter`: kept while the tenant exists.
> - Both settings belong to the REFUNDS owner; a change is a Helm values change.

Also apply, §11.2 Tenant settings: "... a points earn rate, and the retention settings `refundRecordRetention`, `contactDetailsRetention`, and `messageLogRetention` (§17.1, §17.3), held in the environment's Helm values keyed by `tenant_id` (§11.5) and read at start by the core, payout-service, and notification-service."

**Why:** The marker depends on a statutory period, which the design must not assert; a per-tenant setting fits a second tenant in another jurisdiction, and OI-08 already made Helm values keyed by `tenant_id` the home of tenant settings. The 10-year default is chosen so that no financial record can be purged before the REFUNDS owner confirms the value with the retailer's finance and data protection advisers (the first purge falls 10 years after go-live); it is not a claim about any law. Contact details serve only customer messages, the last of which goes out when the request closes; clearing them 30 days later keeps a support margin and shrinks the personal-data footprint R-06 and ADR-10 are about. Tradeoff accepted: until the owner sets the period, pseudonymous financial records may be kept longer than a law needs.

**Linked:** CL-04 (`closed_at`, the counter table), CL-08 (erasure before the retention ends), CL-12 (payout records reuse `refundRecordRetention`), CL-15 (`messageLogRetention` in the same settings).

**Registry impact:** None (chunk 07 §11.2 gains three setting names and one reader).

---

## CL-06: Field-level request and response schemas of the refund-service endpoints

**Where:** `13a-service-refund.md`, §17.1 > API Standards > List of APIs, the sentence after the table (line 210).

```text
[NEEDS CLARIFICATION: field-level request and response schemas (OpenAPI) for the endpoints above; the paths follow the use-case steps and §15.1, the field shapes need architect input.]
```

**Question:** What are the business fields of the request and response DTOs of the nine refund-service endpoints?

**Options:**
- **A.** The SDD fixes each DTO's business fields (name, type, required) and query parameters in one table; the OpenAPI document (§21) adds formats, lengths, and examples - the web app and the core build to one field list, and the OpenAPI file stays the detailed, generated form.
- **B.** Write the full OpenAPI document into the SDD - one complete contract, but it duplicates the §21 OpenAPI file and changes with every cosmetic edit.
- **C.** Leave the field shapes to the LLD - no SDD edit, but rules that live in fields (`expectedAmount`, the partial amount range, the card-paid cap) would be redesigned without the SDD.

**Recommended Answer:** Option A. Replace the sentence with "No other service or external system calls these endpoints, so none carries an API ID. Their DTOs carry the business fields below; the OpenAPI document (§21) adds formats, lengths, and examples." and add:

Conventions: `Money` is `amount` (a decimal as a JSON string, for example `"50.00"`) and `currency` (ISO 4217), the fields of §14.9.0; `timestamp` is ISO-8601 UTC; `date` is an ISO-8601 date in the tenant time zone; a page is `items[]`, `page` (from 0), `size`, and `totalItems`; R required, O optional, C conditional. Responses are 201 for the submission and 200 otherwise; errors per §15.1 and Error Handling.

| DTO or query | Fields |
|--------------|--------|
| `RefundableItemsView` | `receiptNumber` string R; `branchId` string R; `purchaseDate` date R; `cardPaidAmount` Money R (the cap for a receipt paid partly by card); `items[]` R: `posItemLineId` string R, `description` string R, `amount` Money R, `refundable` bool R, `notRefundableReason` enum `ALREADY_REFUNDED` C (when `refundable` is false) |
| `SubmitRefundRequest` | `receiptNumber` string R; `posItemLineIds[]` string R (one or more, no repeats); `reason` string of 1 to 500 characters R; `expectedAmount` Money R (the amount shown at REFUNDS/UC-01 step 4: the sum of the selected items, capped at `cardPaidAmount`) |
| `CancelRefundRequest` | No field in v1 (an empty JSON object); the confirmation of REFUNDS/UC-03 step 3 happens in the web app |
| `RefundRequestDetail` | `refundRequestId` uuid R; `referenceNumber` string R; `status` enum of the five states R; `receiptNumber` string R; `branchId` string R; `items[]` R: `posItemLineId`, `description`, `amount`; `requestedAmount` Money R; `approvedAmount` Money C (once approved); `paidAmount` Money C (once paid); `reason` string R; `decisionReason` string C (a partial approval or a rejection); `submittedAt` timestamp R; `history[]` R: `status`, `changedAt` timestamp, `reason` O; on the branch endpoints only: `payoutFailingSince`, `payoutOutcomeOverdueSince` timestamp C |
| `RefundRequestPage` | Page of `refundRequestId`, `referenceNumber`, `requestedAmount`, `approvedAmount` C, `status`, `submittedAt`; query `page`, `size`, `sort` (default `submittedAt` descending) |
| `BranchRefundRequestPage` | Page of `refundRequestId`, `referenceNumber`, `requestedAmount`, `reason`, `status`, `submittedAt`, `payoutFailingSince` C, `payoutOutcomeOverdueSince` C; query `status` (default `SUBMITTED`), `payoutFailing` bool (true lists approved requests with a failing or overdue payout), `page`, `size`, `sort` (default `submittedAt` ascending) |
| `RefundDecision` | `decision` enum `APPROVE`, `REJECT` R; `approvedAmount` Money C (present only for a partial approval, absent means the full requested amount; when present it must be more than 0 and less than the requested amount, otherwise 422 `PARTIAL_AMOUNT_OUT_OF_RANGE`); `reason` string of 1 to 500 characters C (required on `REJECT` and on a partial approval, otherwise 422 `DECISION_REASON_REQUIRED`) |
| `BranchRefundReport` | `branchId` string R; `date` date R; `requestsByStatus` map of status to count R; `amountPaid` Money R; `averageTimeToDecision` ISO-8601 duration C (absent when no request was decided); query `date` R. The counting rule is the one §17.1 Branch report states |

**Why:** AP-07 specifies client-facing endpoints in OpenAPI before implementation, and chunk 11 says these endpoints live in the 13x List of APIs and the OpenAPI specs (§21), so the business field list belongs here. Each field realises a stated step: REFUNDS/UC-01 steps 2 and 4 and A1, OI-12 (`expectedAmount`), OI-13 (`cardPaidAmount`), REFUNDS/UC-02 steps 2 and 4 (AC-1's approval date comes from `history`), UC-03 E1, UC-04 steps 2 and 4, A1, A2, BR-2, and BR-3. [REFUNDS 16] TC-DEC-02 refuses both 0.00 and the full amount as a partial amount, which is why a present `approvedAmount` equal to the request is refused. `reason` is free text because neither BRD lists reasons; a fixed reason list would be new business content (the web app may still offer preset texts). Money as a string with its currency code keeps decimals exact and lets the web app format amounts by tenant locale with the currency shown (CLAUDE.md, REFUNDS 11); server-side paging and sorting follow CLAUDE.md. Tradeoff accepted: the SDD table must be kept in step with the DTO records when a business field changes.

**Linked:** CL-04 (the columns behind the fields), CL-01 (the same money encoding), CL-03 (flag and count).

**Registry impact:** None (client-facing endpoints are not in chunk 11; no path, method, or permission token changes).

---

## CL-07: Consumer retries before the DLQ (refund-service), and the shared rule

**Where:** `13a-service-refund.md`, §17.1 > Error Handling > Poison messages (line 265).

```text
[NEEDS CLARIFICATION: consumer retry attempts and delays before a payout event goes to the DLQ.]
```

**Question:** How many times, and after which delays, does a refund-service consumer retry a payout event before sending it to its DLQ?

**Options:**
- **A.** One platform consumer rule in §14.6 rule 4, by failure class: a message that can never be applied goes to the DLQ at once; any other failure gets 3 retries at 1 s, 4 s, and 16 s with jitter, then the DLQ; while the deployable's own database is down, the consumer pauses and retries every 30 s without dead-lettering - one rule for all three consumers, no new topic; a failing message holds its partition for up to about 21 s.
- **B.** Non-blocking retry topics per consumer group with longer delays - the partition keeps flowing, but each adds topics to §14.4 and per-refund order is lost while a message waits in a retry topic.
- **C.** No retry, DLQ on the first failure - simplest, but a passing lock conflict or a database blip dead-letters money events that then need a manual replay.

**Recommended Answer:** Option A. Replace §14.6 rule 4 with:

> 4. **Poison handling and consumer retries:** a consumer sorts each failure into one of three classes. (a) A message it can never apply (undeserializable, failing its schema, naming an unknown aggregate, or an invalid transition) goes to `<topic>.<consumer group>.dlq` at once. (b) Any other failure is retried in place, holding the partition: 3 retries after the first attempt, after 1 s, 4 s, and 16 s, each with ±20% jitter; a message that still fails then goes to the DLQ. (c) While the deployable's own database is unreachable, the consumer pauses its partitions and retries every 30 s without dead-lettering, because every message would fail the same way; consumer lag pages (§11.4). The effect and the inbox record commit in one transaction, so a retry never applies an effect twice. An event that a consumer's Event Model says it ignores is logged and skipped, not dead-lettered. Every DLQ write raises the DLQ alarm; replay per §20.1.3.

Replace the 13a marker with:

> Consumer retries and dead-lettering follow §14.6 rule 4: a `PAYOUT_SUCCEEDED` or `PAYOUT_FAILED` for an unknown `refundRequestId` goes to the DLQ at once; an optimistic-lock conflict with the payout watchdog is retried.

**Why:** CLAUDE.md asks for retries with exponential backoff and jitter, idempotency on every consumer, and at-least-once delivery everywhere; §14.6 already promises that nothing is silently dropped, and the inbox record commits with the effect, so in-place retries are safe. Blocking retries keep the per-refund order the message key `refundRequestId` gives (§14.3); B would break it and add topics to the registry. Treating "database down" apart keeps an outage from filling the DLQs with good messages that need a §20.1.3 replay. Writing the rule once in §14.6 serves all three consumers (one fact, one home, OI-22). The ignore rule keeps §17.1's "applied only from `APPROVED`, otherwise ignored and logged" as it is. The values are design choices. Tradeoff accepted: a failing message holds its partition for up to about 21 s, which no stated target is sensitive to at about 1,200 refunds a month.

**Linked:** CL-13 and CL-16 (the same rule), CL-24 (the in-process path follows the same never-drop idea without a DLQ).

**Registry impact:** Chunk 10 §14.6 rule 4 wording only; no topic, event, or field.

---

## CL-08: Lawful basis, retention, erasure path, and ISO 27001 / SOC 2 for refund-service

**Where:** `13a-service-refund.md`, §17.1 > Compliance > GDPR bullet (line 343); the ISO 27001 / SOC 2 bullet below points to it.

```text
[NEEDS CLARIFICATION: lawful basis, retention, and the erasure path for refund records and contact details, and whether ISO 27001 or SOC 2 controls apply to this module.]
```

**Question:** What lawful basis, retention, and erasure path apply to refund records and contact details, and do ISO 27001 or SOC 2 controls apply to the module?

**Options:**
- **A.** The design fixes the purpose, the retention (CL-05), and an erasure job that clears a customer's contact details at once and keeps the closed financial record without them; the lawful basis is the one the retailer's data protection owner records; no certification-specific control is added - no legal fact assumed; one operations job, no new API or role.
- **B.** A self-service "delete my data" endpoint - immediate and in-app, but a new use case, endpoint, and permission token neither BRD states.
- **C.** Erasure by deleting every refund row of the customer - simplest, but it deletes financial records whose statutory retention the design does not know.

**Recommended Answer:** Option A. Replace the GDPR and ISO 27001 / SOC 2 bullets with:

> - **GDPR:** customer ids and contact details are personal data, processed to handle the customer's refund request and tell them about each step ([REFUNDS 04 § Project Scope](../brd-refunds-portal/04-scope-and-personas.md#project-scope)). The platform collects no consent; the lawful basis for this purpose is the one the retailer's data protection owner records for it. Retention: Retention Policy. **Erasure:** the `refund-contact-erasure` job, run by operations under the §20.3 break-glass rule on a request the data protection owner approves, clears `customer_email` and `customer_mobile` on every request of one `customer_id` at once, whatever its state; the next events of a request that is still open carry no `customerContact`, and notification-service skips both channels (§14.9). The closed financial record keeps `customer_id` and no contact detail until `refundRecordRetention` ends. Broker copies age out with the refund topic retention (ADR-10), outbox copies after 7 days, and notification-service copies when each message is final (§17.3).
> - **ISO 27001 / SOC 2:** neither BRD requires a certification; the module applies the §11.6 controls (permission tokens, TLS, encryption at rest, secret rotation, image and dependency scanning, audited break-glass), so a certification scope the retailer adopts can include it without a design change.

Also add a §17.1 Input row: "| Operations job | `refund-contact-erasure` | Clears one customer's contact details on request (Compliance). |"

**Why:** The lawful basis is the controller's legal determination, so the SDD must not state it; the design works for any basis that does not rest on consent, and it collects none. Splitting contact details (cleared at once) from the financial record (kept to the retention end) lets erasure act immediately without assuming whether a statutory retention applies to the financial record; the data protection owner confirms that the split answers an erasure request. An operations job under the break-glass rule (OI-21) needs no operator role, which §16.4.3 says does not exist; B adds a use case and C may delete records a retention requires. ADR-10 still holds: copies already on the broker age out. Neither BRD names ISO 27001 or SOC 2. Tradeoff accepted: an erasure request needs an operator, not self-service.

**Linked:** CL-01 (amendment 1 makes `customerContact` conditional), CL-05 (retention), CL-04 (columns), CL-17 and CL-25 (the same approach).

**Registry impact:** None beyond CL-01's amendment 1.

---

## CL-09: What happens to a refund whose payout is still failing after the retry window

**Where:** `13b-service-payout.md`, §17.2 payout-service > Business Logic > "After the retry window" bullet (line 40).

```text
[NEEDS CLARIFICATION: what happens to a refund whose payout is `FAILED` at the end of the retry window: a manual retry, another payout route, or closing the refund? No REFUNDS use case covers it; the design stops automatic retries and leaves the refund Approved.]
```

**Question:** What happens to an approved refund whose payout still fails at the end of the 24-hour retry window?

**Options:**
- **A.** Stop: the payout is `FAILED` for good and the refund stays Approved and flagged (the current text) - no payment can land after the manager is told, but a CardPay outage longer than the window strands every affected refund with no way in the platform to pay it, and E1 does not say the system stops trying.
- **B.** Report and keep trying: at the window end `PAYOUT_FAILED` flags the refund for the branch manager, and the payout keeps being retried with the same idempotency key at a fixed post-window interval until the provider accepts it - E1 and AC-2 both met, an outage heals itself, no user action added; `FAILED` stops being terminal, and a payout the provider refuses for good is retried indefinitely at a low rate.
- **C.** A manual retry by the branch manager, **D.** another payout route, or **E.** closing the refund - each is a user action, a payout route, or a refund state neither BRD states (REFUNDS 03 lifecycle; REFUNDS 02 constraint 2 allows only the original card).

**Recommended Answer:** Option B. Replace the bullet with:

> - **After the retry window** ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1: the system tries again): a `FAILED` payout is still retried, with the same idempotency key and under a lease, at the post-window retry interval (Constraints) until the provider accepts it; it then moves to `SUCCEEDED` and writes `PAYOUT_SUCCEEDED`, and the refund becomes Paid. `PAYOUT_FAILED` is written once per payout, on its first move to `FAILED` (`failure_reported_at`). While the payout fails, the refund stays Approved on the branch manager's payout-failing list (§17.1). The platform has no manual retry, other payout route, or closing of a refund: neither BRD states one.

Also apply in 13b:
- "Retry for one day" bullet: "... it moves to `FAILED` and writes `PAYOUT_FAILED` once (AC-2: ...)".
- Constraints: add "- **Post-window retry interval:** 6 hours with jitter, a payout-service Helm value owned by the REFUNDS owner."
- Figure 18: `SENDING --> RETRY_SCHEDULED: refusal, timeout, or error` becomes `SENDING --> RETRY_SCHEDULED: refusal, timeout, or error within the retry window`; add `SENDING --> FAILED: refusal, timeout, or error after the retry window` and `FAILED --> SENDING: next post-window attempt due`; delete `FAILED --> [*]`. Summary: "... otherwise retries until its retry window ends, reports the failure once, and keeps retrying at the post-window interval until it succeeds."
- Figure 20: node G becomes `G["FAILED and outbox PAYOUT_FAILED, first failure only"]`, and add `G -->|next post-window attempt due| A`.
- What: "retries failed payouts within its retry window (Constraints)" becomes "retries failed payouts until they succeed, and reports a payout still failing at the end of its retry window (Constraints)".
- Error Handling: Domain errors "a refusal from the provider is retried like any failure, within and after the window"; Auth errors "payouts wait in `RETRY_SCHEDULED` or `FAILED`".
- Metrics: `payouts_retry_scheduled` purpose "Payouts waiting for a retry, in `RETRY_SCHEDULED` or `FAILED`".
- Future Enhancements: "A manual payout retry, another payout route, or closing a refund whose payout keeps failing, if the REFUNDS BRD adds one."

And in other chunks:
- 09 §13 payout-service Business Logic: "retries within its retry window (§17.2)" becomes "retries until paid, reporting a failure at the end of its retry window (§17.2)".
- 10 §14.5.2 `PAYOUT_FAILED` Business cell: CL-01 amendment 3.
- 01 §1, second capability bullet: "retries within the §17.2 retry window" becomes "retries that continue past the §17.2 retry window until the payout succeeds".
- 08 §12 INT-01: Retries "... within the §17.2 retry window ..., then at the §17.2 post-window retry interval until accepted"; Fallback "... `PAYOUT_FAILED` flags it for the branch manager (§17.1), and retries continue".
- 14 §18.3 payment provider outage: "... within the §17.2 retry window, then at the post-window interval until paid".

**Why:** [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1 reads "the request stays Approved, the system tries again, and the branch manager is told if it still fails after one day": telling at one day is required (AC-2, [REFUNDS 16] TC-DEC-04), stopping is not stated. REFUNDS/NFR-01 counts a missing payout as a failure, and option A turns any CardPay outage longer than the window into stranded refunds, the case chunk 18's Reviewer Notes raise (with the circuit breaker open, every pending payout fails at once). Under B, outage time counts against the window, so AC-2 holds during an outage and the payouts still complete afterwards. C to E add behaviour neither BRD states. A late payment cannot double-pay through another channel, because the BRD allows no other route (REFUNDS 02 constraint 2; cash refunds are out of scope in REFUNDS 04), and the idempotency key and lease (OI-15) are unchanged. The payout watchdog (OI-16) is unaffected, since `PAYOUT_FAILED` still arrives at the window end. The 6-hour interval is a design value, about 4 provider calls a day per stuck payout. Tradeoff accepted: `FAILED` is no longer terminal, and a payout refused for good (for example a closed card) keeps retrying and stays on the branch list until the REFUNDS owner adds an end to the BRD; `PAYOUT_FAILED` keeps its name and payload.

**Linked:** CL-01 (amendment 3), CL-03 (the list), CL-11 (`failure_reported_at`; `FAILED` payouts in the due-work index), CL-12 (a payout that has not succeeded is kept).

**Registry impact:** No event, topic, field, API, or token added. Chunk 10 §14.5.2 business text (through CL-01) states that `PAYOUT_SUCCEEDED` can follow `PAYOUT_FAILED`.

---

## CL-10: Which reference identifies the original card payment to CardPay

**Where:** `13b-service-payout.md`, §17.2 > Business Logic > "Original card" bullet (line 41).

```text
[NEEDS CLARIFICATION: which reference CardPay needs to refund the original card: the receipt number, or a card payment reference that REFUNDS 08 does not list among the POS data? PCI DSS stays out of this service's scope only if no card data is needed.]
```

**Question:** Which reference identifies the original card payment to CardPay, and how does the design stay free of card data before the CardPay documentation says what it needs?

**Options:**
- **A.** Only references the platform already holds, the receipt number today; any other non-card reference CardPay needs is captured from API-01 and added to `REFUND_APPROVED` as an optional field once API-02 is documented; card data never enters the platform - no speculative field, no card data; at most one additive schema version later.
- **B.** Capture a card payment reference from API-01 now and carry it as an optional `REFUND_APPROVED` field - ready for either answer, but a speculative field and a POS Records data need REFUNDS 08 does not name.
- **C.** Let payout-service receive card data (a card token or number) - works whatever CardPay needs, but brings card data, and its PCI DSS scope, into the platform.

**Recommended Answer:** Option A. Replace the marker with:

> payout-service identifies the original card payment to CardPay with references the platform already holds: the receipt number from `REFUND_APPROVED`, with the payout id as the idempotency key and the amount and currency. No deployable receives, stores, logs, or sends card data (card number, expiry date, security code). If the API-02 documentation (§15.6) shows that CardPay needs another reference of the original payment, refund-service captures it from API-01 at submission and `REFUND_APPROVED` gains it as an optional field (additive, §14.6 rule 5). A CardPay that can refund the original card only with card data is risk R-02 and needs a new ADR before any card data enters the platform.

Also apply:
- 13b Compliance, PCI-DSS: "payout-service handles no card data (Business Logic, Original card); the design keeps card data out of every deployable so that the PCI DSS scope can exclude the platform, a scope the retailer's security owner confirms with CardPay."
- 11 §15.3 API-02, "Data the platform needs": "(§17.2 clarification)" becomes "(§17.2 Original card)". Its `TBD - EXTERNAL` marker adds: "which reference of the original card payment CardPay needs (the receipt number or another reference), and confirmation that no card data is needed".

**Why:** The reference CardPay matches on is a provider fact, so the design must not state it; the question moves to the existing API-02 `TBD - EXTERNAL` item, which E3 does not count. API-02 has to be documented before go-live (§15.6), so no production refund is approved before such a field could be added, and CLAUDE.md's additive-only rule (§14.6 rule 5) makes the addition non-breaking. REFUNDS 08 lists no card payment reference among the POS data, so B asks POS Records for data the BRD does not name. C contradicts the no-card-data constraint the 13a and 13b Compliance sections rest on. Tradeoff accepted: if CardPay needs another reference, schema version 1.1.0 of `REFUND_APPROVED`, an API-01 data addition, and a chunk 19 refresh follow.

**Linked:** CL-01 (no field now), CL-04 and CL-11 (no card column).

**Registry impact:** None to events or roles. Chunk 11 API-02: one reference in "Data the platform needs" and the `TBD - EXTERNAL` question extended (no method, URI, or field).

---

## CL-11: Full column list, constraints, and indexes of the payout database

**Where:** `13b-service-payout.md`, §17.2 > DB Modeling > Tables Design, the line after the table (line 136).

```text
[NEEDS CLARIFICATION: the full column list, remaining constraints, and secondary indexes of the payout database; they depend on the API-02 fields the provider documentation defines.]
```

**Question:** Which further columns, constraints, and indexes of the payout database does the SDD fix, given that some depend on API-02 fields not yet documented?

**Options:**
- **A.** The CL-04 split, with provider results held in generic columns (`provider_reference`, `provider_error_code`) and any API-02 field that must be stored added later by an expand migration - complete for every rule now and independent of the provider.
- **B.** Wait for the API-02 documentation - exact provider columns, but the gate stays shut on an external document.
- **C.** Full physical schema now (CL-04 option B) - same drawback as there.

**Recommended Answer:** Option A. Add these rows:

| Table | Column | Type | Constraints | Notes |
|-------|--------|------|-------------|-------|
| `payout` | `reference_number`, `receipt_number` | varchar, varchar | NOT NULL | From `REFUND_APPROVED`; the receipt number identifies the original payment (Business Logic) |
| `payout` | `provider_reference` | varchar | NULL until `SUCCEEDED` | Carried in `PAYOUT_SUCCEEDED` |
| `payout` | `attempt_count`, `last_failure_code` | int, varchar | NOT NULL default 0; NULL allowed | Carried in `PAYOUT_FAILED` (`attemptCount`, `lastFailureCode`, a platform `errorCode`) |
| `payout` | `failure_reported_at` | timestamptz | NULL until the first `FAILED` | `PAYOUT_FAILED` is written once (Business Logic) |
| `payout` | `succeeded_at` | timestamptz | NULL until `SUCCEEDED` | Retention clock |
| `payout` | auditing columns | per §11.1 | `version`, checked by the lease commit | |
| `payout_attempt` | `tenant_id`, `attempt_number` | uuid, int | NOT NULL; UNIQUE (`tenant_id`, `payout_id`, `attempt_number`) | `tenant_id` as on every table (§11.2) |
| `payout_attempt` | `outcome` | varchar | CHECK in `ACCEPTED`, `REFUSED`, `TIMEOUT`, `ERROR` | A call the open circuit breaker stops is `ERROR` with `error_code` `UNAVAILABLE`; the §18.2 duplicate proxy counts `ACCEPTED` |
| `payout_attempt` | `error_code` | varchar | NULL allowed | The platform `errorCode` mapped from `provider_error_code` |
| `outbox_event` | `aggregate_id`, `event_type`, `message_key`, `occurred_at`, `traceparent` | as in §17.1 | as in §17.1 | `message_key` is the `refund_request_id` (§14.4) |

Change: `next_attempt_at` is set to the creation time for a `PENDING` payout, so the row "NULL until the first attempt" covers `first_attempt_at` only.

Indexes (each leads with `tenant_id`):
- `payout (tenant_id, next_attempt_at)` where `status` is `PENDING`, `RETRY_SCHEDULED`, or `FAILED` - the `payout-retry` worker's due work.
- `payout (tenant_id, lease_until)` where `status = 'SENDING'` - expired leases.
- `payout (tenant_id, succeeded_at)` - retention.
- `payout_attempt (tenant_id, payout_id, attempted_at)`; outbox and inbox indexes as in §17.1.

Figure 19: add `uuid tenant_id` to `PAYOUT_ATTEMPT`.

Replace the marker with:

> Provider results stay in `provider_reference`, `provider_error_code`, and `error_code`; an API-02 field that must be stored is added by an expand migration when the provider documentation arrives. Column lengths, check wording, and any further index are set in the child LLD's data section; they never change a key, a uniqueness rule, or a tenant rule above.

**Why:** Each added column feeds a stated rule: `PAYOUT_SUCCEEDED`'s `providerReference` and `PAYOUT_FAILED`'s `attemptCount` and `lastFailureCode` (§14.9.6, §14.9.7), the lease commit's version check (OI-15), the duplicate proxy on accepted attempts (§18.2, OI-16), the once-only failure report and the post-window due work (CL-09), and the retention clock (CL-12). `payout_attempt` lacked `tenant_id`, which OI-06 and CLAUDE.md require. Generic provider columns keep the schema independent of the CardPay documentation, and expand-contract (§17.2 Migration Strategy) makes the later addition safe. Reusing the standard `UNAVAILABLE` code (§15.1) avoids a new outcome value. Tradeoff accepted: a provider-specific value may first live as a string until its own column is added.

**Linked:** CL-09, CL-10, CL-12, CL-04 (the shared outbox shape).

**Registry impact:** None.

---

## CL-12: Retention of payout records

**Where:** `13b-service-payout.md`, §17.2 > DB Modeling > Retention Policy, first bullet (line 147).

```text
[NEEDS CLARIFICATION: retention period for payout records; payouts are financial records and may carry a statutory retention period.]
```

**Question:** How long are payout records kept?

**Options:**
- **A.** The same tenant setting as the refund record (`refundRecordRetention`, CL-05), counted from `succeeded_at`; a payout that has not succeeded is kept - a refund and its payout age out together; no law assumed.
- **B.** A separate payout retention setting - tuned on its own, but two values for one financial fact that the owner must keep equal.
- **C.** No end - nothing lost, but payout records outlive any retention the owner sets for the refund.

**Recommended Answer:** Option A. Replace the bullet with:

> - `payout`, `payout_attempt`: deleted by the retention job when the tenant setting `refundRecordRetention` (§11.2; default and owner in §17.1 Retention Policy) has passed since `succeeded_at`. A payout that has not succeeded is kept.

**Why:** A payout is the money side of the same refund record, so one setting keeps the two databases in step (one fact, one home, OI-22); the statutory period is unknown, so the design reuses CL-05's setting and default instead of stating a period. payout-service stores no personal data (§17.2 Compliance), so the only pressure is financial. A payout that has not succeeded is still being retried under CL-09, so it must not be purged. Tradeoff accepted: payout-service now reads tenant settings at start (CL-05's §11.2 edit).

**Linked:** CL-05, CL-09, CL-11 (`succeeded_at`).

**Registry impact:** None.

---

## CL-13: Consumer retries before the DLQ (payout-service)

**Where:** `13b-service-payout.md`, §17.2 > Error Handling > Poison messages (line 235).

```text
[NEEDS CLARIFICATION: consumer retry attempts and delays before a message goes to the DLQ.]
```

**Question:** How many times, and after which delays, does the payout-service consumer retry a `REFUND_APPROVED` before sending it to its DLQ?

**Options:**
- **A.** The shared §14.6 rule 4 of CL-07 - one rule for every consumer.
- **B.** Retry topics (CL-07 option B) - partition keeps flowing, but more topics and lost per-refund order.
- **C.** DLQ on the first failure (CL-07 option C) - an approved refund dead-letters on a database blip and waits for the payout watchdog to flag it.

**Recommended Answer:** Option A. Replace the marker with:

> Consumer retries and dead-lettering follow §14.6 rule 4. The consumer only records the payout with its inbox row; the API-02 call happens in the `payout-retry` worker (Developer Notes), so consumer retries cover database writes only.

**Why:** One policy for every consumer (CL-07). The payout consumer has no provider call to retry, so the "database down" class keeps an outage from dead-lettering approved refunds, which the payout watchdog would otherwise flag only an hour after the retry window (OI-16). Tradeoff accepted: as CL-07.

**Linked:** CL-07 (holds the rule), CL-16.

**Registry impact:** None beyond CL-07.

---

## CL-14: Full column list, constraints, and indexes of the notification database

**Where:** `13c-service-notification.md`, §17.3 > DB Modeling > Tables Design, the line after the table (line 111).

```text
[NEEDS CLARIFICATION: the full column list, remaining constraints, and secondary indexes of the notification database; the message fields depend on the API-03 provider documentation.]
```

**Question:** Which further columns, constraints, and indexes of the notification database does the SDD fix, given that some message fields depend on the API-03 documentation?

**Options:**
- **A.** The CL-04 split, with MsgHub results in generic columns and a claim lease like §17.2's, so two replicas never send one message twice while MsgHub's idempotency support is unknown - complete now and provider-independent; one more column and a claim step.
- **B.** Wait for the API-03 documentation - exact provider columns, but the gate stays shut on an external document.
- **C.** Option A without the lease - fewer columns, but a row lock released during the API-03 call lets a second replica send the same message if MsgHub ignores the idempotency key.

**Recommended Answer:** Option A. Add these rows:

| Table | Column | Type | Constraints | Notes |
|-------|--------|------|-------------|-------|
| `notification_message` | `source_event_type` | varchar | NOT NULL | Template lookup and the `event_type` metric label |
| `notification_message` | `claimed_until` | timestamptz | NULL unless a worker holds the message | Set by the claim transaction to now plus the INT-02 timeout plus one minute; the worker records the outcome only while it holds the claim, as §17.2 does for payouts |
| `notification_message` | `payload_key_id` | varchar | NULL once `delivery_payload` is erased | Id of the key that encrypted `delivery_payload`, so keys rotate without a redeploy (§11.6) |
| `notification_message` | `provider_message_id`, `last_error_code` | varchar, varchar | NULL allowed | MsgHub's message id; the platform `errorCode` of the last failure |
| `notification_message` | `final_at` | timestamptz | NULL until `SENT`, `FAILED`, or `SKIPPED` | Retention clock |
| `notification_message` | auditing columns | per §11.1 | `version` | |
| `message_template` | `id`, `tenant_id`, `subject` | uuid, uuid, text | PK; NOT NULL; NULL for SMS | On insert, the consumer pins the highest `template_version` for the event type, channel, and tenant locale (`template_id`) |

Indexes (each leads with `tenant_id`):
- `notification_message (tenant_id, next_attempt_at)` where `status = 'PENDING'` - the `message-retry` worker.
- `notification_message (tenant_id, final_at)` - retention.
- The existing UNIQUE (`tenant_id`, `source_event_id`, `channel`) is the consumer's inbox; there is no separate inbox table, so §17.3 Boundaries "plus the service's inbox" becomes "the delivery log, whose unique key is the inbox".

Also apply, §17.3 Business Logic, "Sending and retries": "the `message-retry` worker claims due messages (`claimed_until`) and calls API-03 ..."; Deployment Strategy, Replicas: "workers claim due messages with a lease".

Replace the marker with:

> MsgHub results stay in `provider_message_id` and `last_error_code`; an API-03 field that must be stored is added by an expand migration when the provider documentation arrives. Column lengths, check wording, and any further index are set in the child LLD's data section; they never change a key, a uniqueness rule, or a tenant rule above.

**Why:** Each column feeds a stated rule: OI-17's encrypted `delivery_payload` and its erasure; §11.6's secret rotation without a redeploy needs the key id; the `event_type` metric label; the retention clock (CL-15). The lease follows OI-15's reasoning: §15.6 lists MsgHub's idempotency support as unknown and §17.3 promises one message per event and channel, which row locks alone cannot keep across replicas during the provider call. Generic provider columns keep the schema independent of the MsgHub documentation. Tradeoff accepted: one more column and a claim step; the message states stay four (no `SENDING` state), so the status CHECK and the "no state diagram" note stay true.

**Linked:** CL-15 (`final_at`), CL-16, CL-17.

**Registry impact:** None.

---

## CL-15: Retention of the delivery log

**Where:** `13c-service-notification.md`, §17.3 > DB Modeling > Retention Policy, first bullet (line 122).

```text
[NEEDS CLARIFICATION: retention period of the delivery log.]
```

**Question:** How long is the delivery log kept?

**Options:**
- **A.** A tenant setting `messageLogRetention`, default 90 days after the message is final, then the row is deleted - a support window for "I did not get the message" questions over masked data; no law assumed.
- **B.** Keep it as long as the refund record - one value, but a messaging log kept 10 years by default with no stated need.
- **C.** Delete each row when it is final - smallest footprint, but no delivery trail for support.

**Recommended Answer:** Option A. Replace the bullet with:

> - `notification_message`: deleted by the retention job when the tenant setting `messageLogRetention` (§11.2) has passed since `final_at`; default 90 days, owned by the REFUNDS owner. The clear address never outlives the message: `delivery_payload` is erased when the message is final (Business Logic).

**Why:** Once a message is final, its row holds only the masked address, status, attempts, and provider id (OI-17), so its use is support and delivery audit; neither BRD states a period, so the value is a setting with a default in the home CL-05 adds to §11.2. 90 days is a design choice for a support window, not tied to any law. Tradeoff accepted: delivery questions older than 90 days cannot be answered from the log.

**Linked:** CL-14 (`final_at`), CL-17, CL-05 (the settings home).

**Registry impact:** None.

---

## CL-16: Consumer retries before the DLQ (notification-service)

**Where:** `13c-service-notification.md`, §17.3 > Error Handling > Poison messages (line 213).

```text
[NEEDS CLARIFICATION: consumer retry attempts and delays before a message goes to the DLQ.]
```

**Question:** How many times, and after which delays, does the notification-service consumer retry a refund event before sending it to its DLQ?

**Options:**
- **A.** The shared §14.6 rule 4 of CL-07 - one rule for every consumer.
- **B.** Retry topics (CL-07 option B) - more topics, lost per-refund order.
- **C.** DLQ on the first failure (CL-07 option C) - a database blip dead-letters customer messages.

**Recommended Answer:** Option A. Replace the marker with:

> Consumer retries and dead-lettering follow §14.6 rule 4. The consumer only inserts the messages; API-03 is called by the `message-retry` worker under the §12 INT-02 attempt limit, so consumer retries cover database writes only.

**Why:** One consumer policy (CL-07), while the provider retry policy stays with the worker and §12 INT-02, so the two retry loops never stack. Tradeoff accepted: as CL-07.

**Linked:** CL-07 (holds the rule), CL-13.

**Registry impact:** None beyond CL-07.

---

## CL-17: Lawful basis, retention, and ISO 27001 / SOC 2 for the delivery log

**Where:** `13c-service-notification.md`, §17.3 > Compliance > GDPR bullet (line 270); the ISO 27001 / SOC 2 bullet below points to it.

```text
[NEEDS CLARIFICATION: lawful basis and retention for the delivery log, and whether ISO 27001 or SOC 2 controls apply to this service.]
```

**Question:** What lawful basis and retention apply to the delivery log, and do ISO 27001 or SOC 2 controls apply to notification-service?

**Options:**
- **A.** The CL-08 approach: the basis the data protection owner records for the refund purpose, retention per CL-15, erasure by age because the log holds no customer id; no certification-specific control - consistent across services; no legal fact assumed.
- **B.** Add `customer_id` to the delivery log so a customer's rows can be erased on request - targeted erasure, but it adds a personal identifier to a log that today holds only masked addresses.

**Recommended Answer:** Option A. Replace the GDPR and ISO 27001 / SOC 2 bullets with:

> - **GDPR:** contact details are processed only to send the messages the customer expects about their refund request, the purpose of §17.1 Compliance, under the lawful basis the data protection owner records for it. The address stays encrypted in `delivery_payload` until the message is final and is then erased; the delivery log keeps only masked addresses and no customer id, so its rows leave by age (Retention Policy, `messageLogRetention`). An event that arrives without `customerContact` after an erasure (§17.1) records both channels `SKIPPED`.
> - **ISO 27001 / SOC 2:** neither BRD requires a certification; the service applies the §11.6 controls, so a certification scope the retailer adopts can include it without a design change.

**Why:** As CL-08 for the basis and certification. Option B would add personal data in order to make it erasable; with the clear address bounded to the attempt window (OI-17) and masked rows deleted after 90 days (CL-15), removal by age is the erasure path for this service, which the data protection owner confirms. Tradeoff accepted: an erasure request does not remove masked rows before their 90 days.

**Linked:** CL-08, CL-15, CL-01 (amendment 1).

**Registry impact:** None.

---

## CL-18: How a purchase amount with cents becomes whole points

**Where:** `13d-service-loyalty.md`, §17.4 loyalty-service > Business Logic > "Earn points" bullet (line 37).

```text
[NEEDS CLARIFICATION: how a purchase amount with cents becomes whole points (LOYALTY 11 says points are whole numbers): round down, round half up, or round up?]
```

**Question:** How does a purchase amount with cents become a whole number of points?

**Options:**
- **A.** Round down: the amount times the earn rate, rounded down - reads "1 point per 1 EUR spent" literally (one point per whole euro) and never awards points for money not spent; a purchase under 1 EUR earns 0.
- **B.** Round half up - friendlier from 0.50 up, but awards a point for half a euro, which the glossary does not say.
- **C.** Round up - every cent earns a point, so many small purchases earn far more than 1 point per euro.

**Recommended Answer:** Option A. Replace the marker with:

> Points are the purchase amount times the tenant's earn rate, rounded down to a whole number (one point per whole euro for the current tenant). A purchase that earns 0 points this way is a rejection with reason `NO_POINTS` (above). The take-back uses the same function (Take points back).

**Why:** [LOYALTY 02 § Glossary](../brd-loyalty-points/02-glossary-assumptions-facts.md#glossary) defines Points as "1 point per 1 EUR spent", which round-down meets exactly, and [LOYALTY 11 § UI/UX Expectations](../brd-loyalty-points/11-summary-and-uiux.md#uiux-expectations) requires whole numbers. Using one function for earning and taking back makes a purchase refunded in full give back exactly what it earned ([LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) AC-1, CL-20). OI-19 already turns a record with no positive points into a visible rejection, so purchases under 1 EUR are recorded, counted, and passed; if they turn out to be frequent, leaving `NO_POINTS` out of the rejection alert is a later change to OI-19's alert, not made here. Tradeoff accepted: members earn nothing on the part of an amount below a whole euro; the rule is a BRD follow-up for the LOYALTY owner to confirm.

**Linked:** CL-20 (the same function), CL-21 (the `NO_POINTS` reason code).

**LOYALTY v1.1 draft:** confirms round-down; its TD-14 makes a 0-point purchase normal, so under v1.1 it passes without the rejection alert (see "LOYALTY v1.1 draft found during this run").

**Registry impact:** None.

---

## CL-19: Which identifier links a paid refund to the purchase that earned points

**Where:** `13d-service-loyalty.md`, §17.4 > Business Logic > "Take points back" bullet, first marker (line 38).

```text
[NEEDS CLARIFICATION: is the LOYALTY purchase reference ([LOYALTY 08 § Integrations](../brd-loyalty-points/08-integrations.md#integrations)) the same identifier as the REFUNDS receipt number ([REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) step 1)? The take-back matches them one to one.]
```

**Question:** On which identifier does a paid refund find the purchase that earned points, given that whether the LOYALTY purchase reference equals the REFUNDS receipt number is a fact about POS Records the design does not know?

**Options:**
- **A.** Match on the receipt number, which API-04 supplies with each member purchase and the import stores on the `EARNED` movement - holds whether or not the two identifiers are the same; POS Records must send the receipt number (one more API-04 data need).
- **B.** Keep matching the purchase reference against the receipt number (the current text) - no change, but if they differ every take-back closes as `NO_EARN`, the normal outcome for non-member purchases, so nothing reveals the error (R-03).
- **C.** Look the purchase up in POS Records by receipt number when the refund is paid - no stored key, but a synchronous call and a new contract inside the take-back, which then depends on POS Records being up.

**Recommended Answer:** Option A. Replace the marker with:

> The match key is the receipt number: API-04 supplies the receipt number of each member purchase with its purchase reference (§15.3), the import stores it on the `EARNED` movement (`receipt_number`, unique per tenant among `EARNED` movements), and the listener matches the event's `receiptNumber` against it. When POS Records uses the receipt number as the purchase reference, both fields hold the same value. A member purchase without a receipt number, or with one another purchase already earned on, is rejected (`MISSING_RECEIPT_NUMBER`, `DUPLICATE_RECEIPT`).

Also apply:
- The same bullet: "looks up the `EARNED` movement whose purchase reference matches the event's `receiptNumber`" becomes "looks up the `EARNED` movement whose `receipt_number` matches the event's `receiptNumber`"; "applies a `PENDING_EARN` take-back for the same tenant and purchase reference" becomes "... for the same tenant and receipt number"; the record of handled refunds "carries `purchase_reference`, `paid_at`, and `status`" becomes "carries `receipt_number`, `purchase_reference` once matched, `paid_at`, and `status`". Figure 25 node C already reads "for the receipt number".
- 11 §15.3 API-04, "Data the platform needs": "... the member number, the purchase reference, the receipt number of the purchase, the amount and currency, and the purchase time"; its `TBD - EXTERNAL` marker adds "whether POS Records can send the receipt number with each member purchase".
- 01 §4 R-03 Mitigation: "The take-back matches on the receipt number API-04 supplies (§17.4), and a partial refund takes back points in proportion to the money refunded (§17.4); the take-back handler is idempotent."
- 01 §5 Glossary, Purchase reference: "The LOYALTY name of the identifier of a POS purchase; a refund finds the purchase through the receipt number API-04 supplies with it (§17.4)."

**Why:** The equality is a fact about POS Records, whose contract is `TBD - external` (§15.6), so the design must not rest on it; A turns it into an explicit data need that the API-04 provider answer confirms or refutes before go-live, through a `TBD - EXTERNAL` item E3 does not count. R-03 and the cross-BRD reconciliation entry of the decision log flag this exact gap, and B leaves it silent because `NO_EARN` is a normal outcome (OI-18). ADR-01 and §14.7 already plan `receiptNumber` as the match key after an extraction, so A keeps that path; OI-18's pending take-back mechanism is unchanged, only the key it matches on is now explicit. Rejecting a purchase without a receipt number makes the gap visible through the OI-19 alert instead of a silently missed take-back. Tradeoff accepted: POS Records must send one more field; if it cannot, R-03 becomes an issue and the matching is redesigned.

**Linked:** CL-20 (the take-back amount for the matched purchase), CL-21 (columns and reason codes), CL-23.

**Registry impact:** Chunk 11 API-04: one item in "Data the platform needs" and the `TBD - EXTERNAL` question extended. No event, API ID, or token; `RefundPaidEvent` (§14.10) is unchanged.

---

## CL-20: Points taken back for a partial refund

**Where:** `13d-service-loyalty.md`, §17.4 > Business Logic > "Take points back" bullet, second marker (line 38).

```text
[NEEDS CLARIFICATION: how many points are taken back when the refund covers only some items of the purchase or a partial amount ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) A1)? [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) AC-1 only covers a whole refunded purchase.]
```

**Question:** How many points are taken back when a paid refund covers only some items of the purchase or a partially approved amount?

**Options:**
- **A.** In proportion to the money refunded, with the earning function: the purchase's paid refunds so far times the earn rate, rounded down, minus the points already taken back for it, never more than it earned - a full refund gives back exactly what it earned (AC-1); several partial refunds of one purchase add up exactly; follows "1 point per 1 EUR".
- **B.** All the purchase's points on its first paid refund, whatever the amount - simple and close to "taken back when that purchase is refunded" read loosely, but it takes back points on items the member keeps, and a later refund of the same purchase takes nothing.
- **C.** Nothing for a partial refund - no over-take, but points stay on money that was returned, against [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-1 for the refunded part.
- **D.** Per item - exact per item, but API-04 sends purchase amounts, not item lines ([LOYALTY 08](../brd-loyalty-points/08-integrations.md#integrations)), so loyalty-service has no per-item points.

**Recommended Answer:** Option A. Replace the marker with:

> The points taken back follow the money refunded, with the earning function (Earn points): for each paid refund of a purchase, the take-back is the purchase's paid refunds so far (`paidAmount` of this refund and of the refunds of the same purchase handled before it) times the earn rate, rounded down, minus the points already taken back for that purchase, and never more than the points the purchase earned. A purchase refunded in full, in one refund or several, gives back exactly the points it earned (AC-1: -50 for a purchase that earned 50); a refund of some items ([REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) BR-2: an item is refunded only once) or of a lower amount ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) A1) gives back points in proportion. A take-back of 0 points writes no movement and is recorded `APPLIED`. The listener, and the import when it applies a `PENDING_EARN` take-back, compute under the member's balance row lock, so two refunds of one purchase never take back the same points twice.

**Why:** [LOYALTY 02 § Glossary](../brd-loyalty-points/02-glossary-assumptions-facts.md#glossary) ties points to euros spent, so euros returned undo points at the same rate; this is the reading that adds least to the BRD, and with the CL-18 function it meets [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) AC-1 exactly. REFUNDS allows several requests per receipt (UC-01 BR-2) and partial amounts (UC-04 A1), so the per-purchase cap is what keeps the §17.4 constraint that a balance cannot go below zero, and the cumulative form avoids rounding loss across refunds (a purchase of 21.00 EUR earns 21 points; two refunds of 10.50 EUR rounded one by one would take back only 20). D is not possible with the data LOYALTY 08 names. Tradeoff accepted: the rule is a business choice the BRD leaves open for partial refunds, so it is a BRD follow-up for the LOYALTY owner; because the ledger is append-only, a different rule later is applied with correcting movements.

**Linked:** CL-18 (the same function), CL-19 (which purchase), CL-21 (`refund_takeback.paid_amount`), CL-23 (the detail shows the paid amount), CL-24 (the listener is redelivered on failure).

**LOYALTY v1.1 draft:** its UC-02 BR-3 (TD-12) settles this rule differently for a later partial refund that does not complete the purchase (per-refund rounding, then all remaining points once the whole purchase is refunded); if v1.1 is registered, replace the cumulative sentence with that rule (see "LOYALTY v1.1 draft found during this run").

**Registry impact:** None (`RefundPaidEvent` already carries `paidAmount`).

---

## CL-21: Full column list, constraints, and indexes of the `loyalty` schema

**Where:** `13d-service-loyalty.md`, §17.4 > DB Modeling > Tables Design, the line after the table (line 126).

```text
[NEEDS CLARIFICATION: the full column list, remaining constraints, and secondary indexes of the `loyalty` schema; the BRD describes the concepts, not a relational schema.]
```

**Question:** Which further columns, constraints, and indexes of the `loyalty` schema does the SDD fix?

**Options:**
- **A.** The CL-04 split: every column a §17.4 rule or DTO field relies on, and the index behind each query and job; physical detail in the LLD.
- **B.** The full physical schema now (CL-04 option B).
- **C.** Hand everything to the LLD (CL-04 option C) - the LLD would invent the match key, the take-back amounts, and the run start time the rules need.

**Recommended Answer:** Option A. Add or change these rows:

| Table | Column | Type | Constraints | Notes |
|-------|--------|------|-------------|-------|
| `points_movement` | `receipt_number` | varchar | NOT NULL for `EARNED`; UNIQUE (`tenant_id`, `receipt_number`) where `EARNED` | The take-back match key (Business Logic) |
| `points_movement` | `purchase_amount`, `currency` | numeric(19,4), char(3) | NOT NULL for `EARNED` | From API-04; shown by the movement detail |
| `points_movement` | `occurred_at` | timestamptz | NOT NULL | The purchase time for `EARNED`; the time the points were taken back for `TAKEN_BACK` |
| `points_movement`, `member_balance` | auditing columns | per §11.1 | `version` on `member_balance` | |
| `refund_takeback` | `receipt_number` | varchar | NOT NULL | The match key from `RefundPaid` |
| `refund_takeback` | `purchase_reference` (change) | varchar | NULL until matched | |
| `refund_takeback` | `movement_id` (change) | uuid | NULL when no movement was written (`PENDING_EARN`, `NO_EARN`, or a 0-point `APPLIED`) | |
| `refund_takeback` | `paid_amount`, `currency` | numeric(19,4), char(3) | NOT NULL | From `RefundPaid`; summed per purchase for the take-back |
| `purchase_import_rejection` | `id`, `receipt_number`, `detail` | uuid, varchar, text | PK; NULL allowed; NULL allowed | |
| `purchase_import_rejection` | `reason` (change) | varchar | CHECK in `NO_POINTS`, `NON_POSITIVE_AMOUNT`, `CURRENCY_MISMATCH`, `MISSING_RECEIPT_NUMBER`, `DUPLICATE_RECEIPT`, `INVALID` | `detail` holds the text |
| `purchase_import_cursor` | `last_success_started_at` | timestamptz | NULL until the first success | Closes `PENDING_EARN` as `NO_EARN` (Business Logic) |

Indexes (each leads with `tenant_id`):
- `points_movement (tenant_id, member_id, occurred_at, id)` - the history newest first and the date of the last movement.
- The partial unique indexes on `purchase_reference` (existing) and `receipt_number` (above), both where `EARNED`.
- `refund_takeback (tenant_id, receipt_number)` - matching, the per-purchase sums, and applying pending take-backs.
- `refund_takeback (tenant_id, paid_at)` where `status = 'PENDING_EARN'` - closing as `NO_EARN`.
- `refund_takeback (tenant_id, movement_id)` - the movement detail.
- `purchase_import_rejection (tenant_id, received_at)` - review and retention.

Figure 24: add `string receipt_number` to `POINTS_MOVEMENT` and `REFUND_TAKEBACK`.

Replace the marker with:

> Column lengths, check wording, and any further index are set in the child LLD's data section; they never change a key, a uniqueness rule, or a tenant rule above.

**Why:** Each column realises a rule: the match key (CL-19), the cumulative take-back (CL-20), the `NO_EARN` rule's "first successful import run that starts more than one day after `paidAt`" (OI-18) needs the run's start time, the rejection reasons serve the OI-19 table and the CL-18 zero-point case, and the movement detail needs the purchase and refund amounts ([LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) step 4, CL-23). `occurred_at` gives the history order and the "date of the last movement" ([LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance) step 2). Tradeoff accepted: as CL-04.

**Linked:** CL-18, CL-19, CL-20, CL-22, CL-23, CL-25.

**LOYALTY v1.1 draft:** a taken-back movement carries the date the refund was paid (v1.1 03, TD-03), so under v1.1 `occurred_at` for `TAKEN_BACK` is the refund's `paid_at` (see "LOYALTY v1.1 draft found during this run").

**Registry impact:** None.

---

## CL-22: Retention of a member's ledger after the member leaves

**Where:** `13d-service-loyalty.md`, §17.4 > DB Modeling > Retention Policy, first bullet (line 137).

```text
[NEEDS CLARIFICATION: retention after a member leaves the program.]
```

**Question:** How long is a member's ledger kept after the member leaves the loyalty program?

**Options:**
- **A.** Until the member erasure job deletes it on request; loyalty-service gets no "member left" signal, and deleting on inactivity would expire points - no business behaviour added; storage limitation rests on the erasure request path.
- **B.** Delete after a period without movements (for example 3 years) - bounded storage, but that is points expiry, which neither BRD states.
- **C.** Consume a "member left" signal from enrolment - automatic, but enrolment is outside both BRDs and no such event or API exists.

**Recommended Answer:** Option A. Replace the bullet (and the existing `refund_takeback` line) with:

> - `points_movement`, `member_balance`: kept while the member's ledger exists. loyalty-service receives no signal that a member left the program, because enrolment is outside both BRDs (§3 assumption 3); a ledger is deleted only by the member erasure job (Compliance).
> - `refund_takeback`: kept as long as the movement it created; one with no movement is deleted 90 days after `handled_at`.
> - `purchase_import_rejection`: deleted 90 days after `received_at`.
> - `purchase_import_cursor`: kept while the tenant exists.

**Why:** Leaving the program has no definition, event, or API in either BRD (enrolment is out of scope, §2.2), so the design cannot react to it, and B would make points expire, which LOYALTY does not state ([LOYALTY 04](../brd-loyalty-points/04-scope-and-personas.md#out-of-scope) only defers redemption). A take-back record without a movement only guards replay idempotency, and replays end within 7 days (§11.1 purges completed publications after 7 days), so 90 days is ample; the rejection table is for review (OI-19). The two 90-day values are design choices. Tradeoff accepted: a departed member's ledger stays until someone asks for its erasure; a "member left" signal is a BRD follow-up for the LOYALTY owner.

**Linked:** CL-25 (the erasure job), CL-21.

**Registry impact:** None.

---

## CL-23: Field-level response schemas of the loyalty-service endpoints

**Where:** `13d-service-loyalty.md`, §17.4 > API Standards > List of APIs, the sentence after the table (line 177).

```text
[NEEDS CLARIFICATION: field-level response schemas (OpenAPI) for the endpoints above; the paths follow the use-case steps and §15.1, the field shapes need architect input.]
```

**Question:** What are the business fields of the three loyalty-service response DTOs?

**Options:**
- **A.** Business fields in the SDD, formats in the OpenAPI document (as CL-06 option A).
- **B.** The full OpenAPI document in the SDD (CL-06 option B).
- **C.** Leave the field shapes to the LLD (CL-06 option C).

**Recommended Answer:** Option A. Replace the sentence with "No other service or external system calls these endpoints, so none carries an API ID. Their DTOs carry the business fields below, with the conventions of §17.1 List of APIs (`Money`, `timestamp`, the page wrapper); the OpenAPI document (§21) adds formats, lengths, and examples." and add:

| DTO | Fields |
|-----|--------|
| `PointsBalanceView` | `points` int R (0 when the member has no movement); `lastMovementAt` timestamp C (absent when there is no movement) |
| `PointsMovementPage` | Page of `movementId` uuid, `movementType` enum `EARNED`, `TAKEN_BACK`, `points` int (negative for `TAKEN_BACK`), `occurredAt` timestamp, `purchaseReference` string, `refundReference` string C (on `TAKEN_BACK`); query `page`, `size`; order newest first, fixed |
| `PointsMovementDetail` | The page item fields, plus `purchase` R: `purchaseReference`, `amount` Money, `purchasedAt` timestamp; and `refund` C (on `TAKEN_BACK`): `referenceNumber`, `paidAmount` Money, `paidAt` timestamp |

No field carries a member number; the member is the token's `member_id` claim.

**Why:** [LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance) step 2 and AC-1 (the balance and the date of the last movement) and A1 (a balance of 0); [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) step 2 (newest first, with date, purchase or refund reference, and points), A1 (the refund reference on the taken-back movement), step 4 (the purchase or refund it came from), and BR-2 (own points only, so no member number in path or body, §17.4); LOYALTY 11 (whole numbers; the minus sign comes from the signed `points`). Tradeoff accepted: as CL-06.

**Linked:** CL-21 (the columns), CL-20 (the paid amount), CL-06 (the conventions).

**LOYALTY v1.1 draft:** the fields already match v1.1 UC-02 step 4 and its new acceptance criteria; only `occurredAt` of a `TAKEN_BACK` movement becomes the refund's paid date (see CL-21).

**Registry impact:** None.

---

## CL-24: Redeliveries of a failing `RefundPaid` before the alert

**Where:** `13d-service-loyalty.md`, §17.4 > Error Handling > Poison messages (line 219).

```text
[NEEDS CLARIFICATION: redelivery attempts before the alert.]
```

**Question:** How many times is a failing `RefundPaid` redelivered before its alert fires?

**Options:**
- **A.** Resubmit every 5 minutes and alert at 30 minutes (about six redeliveries), never stopping - leaves half of the one-hour LOYALTY/NFR-02 budget to fix the cause; a broken listener keeps retrying cheaply until it is fixed.
- **B.** Alert on the first failure - fastest signal, but it pages on a passing lock conflict.
- **C.** Stop after N attempts and park the event - bounded retries, but a parked take-back is lost unless someone acts, against ADR-05 ("replayed until the idempotent handler completes").

**Recommended Answer:** Option A. Replace the marker with:

> The publication-log replay resubmits each incomplete publication every 5 minutes (§11.1), so a `RefundPaid` that keeps failing is redelivered about six times before the alert fires at 30 minutes (§11.4); redelivery continues after the alert until the listener completes (ADR-05).

Also apply:
- 07 §11.1, In-process publication log: add "The publication-log replay (one replica at a time, under a database lock) resubmits every publication still incomplete 5 minutes after it was recorded, every 5 minutes."
- 07 §11.4 Alerting: add "an incomplete publication older than 30 minutes".

**Why:** ADR-05 requires that the take-back is never lost, so redelivery never stops (C rejected); [LOYALTY 10](../brd-loyalty-points/10-nfrs.md#non-functional-requirements) NFR-02 gives one hour from payment to the visible take-back, so an alert at 30 minutes leaves 30 minutes to act. §11.4 already alerts on take-back lag and measures the publication log backlog; the cadence lives in §11.1 because it is a property of the publication log, which any later in-process event shares. The 5-minute cadence keeps a flapping failure from hammering the database; both values are design choices. Tradeoff accepted: a take-back delayed by a defect is alerted only after 30 minutes.

**Linked:** CL-07 (the same never-drop rule for Kafka consumers), CL-20 (the listener's computation).

**Registry impact:** None.

---

## CL-25: Lawful basis, erasure path, and ISO 27001 / SOC 2 for the member ledger

**Where:** `13d-service-loyalty.md`, §17.4 > Compliance > GDPR bullet (line 276); the ISO 27001 / SOC 2 bullet below points to it.

```text
[NEEDS CLARIFICATION: lawful basis and the erasure path for a member's ledger, and whether ISO 27001 or SOC 2 controls apply to this module.]
```

**Question:** What lawful basis and erasure path apply to a member's ledger, and do ISO 27001 or SOC 2 controls apply to the module?

**Options:**
- **A.** Purpose fixed, the basis the data protection owner records, a member erasure job (operations, break-glass) that deletes the whole ledger in one transaction, no certification-specific control - consistent with CL-08; the only exception to the append-only ledger.
- **B.** Anonymise instead of delete (replace `member_id` with a random id) - keeps movement totals, but LOYALTY states no report that needs them, and the purchase and receipt references in the rows can still identify the person.
- **C.** A self-service erasure endpoint - a use case, endpoint, and token neither BRD states.

**Recommended Answer:** Option A. Replace the GDPR and ISO 27001 / SOC 2 bullets with:

> - **GDPR:** member numbers, purchase references, receipt numbers, and movements are personal data, processed to keep the member's points ledger and show it to them ([LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance), [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history)), under the lawful basis the data protection owner records for that purpose; the platform collects no consent. **Erasure:** the `loyalty-member-erasure` job, run by operations under the §20.3 break-glass rule on a request the data protection owner approves, deletes one member's `member_balance`, `points_movement`, and the `refund_takeback` rows linked to those movements in one transaction, so the balance never disagrees with the ledger (LOYALTY/NFR-01). It is the only deletion of movements (Developer Notes). A refund paid after the erasure finds no `EARNED` movement and closes as `NO_EARN`.
> - **ISO 27001 / SOC 2:** neither BRD requires a certification; the module applies the §11.6 controls, so a certification scope the retailer adopts can include it without a design change.

Also apply in 13d: an Input row "| Operations job | `loyalty-member-erasure` | Deletes one member's ledger on request (Compliance). |"; Developer Notes, Avoid: "updating or deleting a movement, except through the member erasure job".

**Why:** As CL-08 for the basis and certification: the lawful basis is the controller's legal determination and is not asserted here. Deleting the balance with its movements in one transaction keeps the §17.4 Balance invariant (the stored balance equals the sum of the movements), and the job needs no operator role or API (§16.4.3). B leaves identifying references in place; C adds a use case. Tradeoff accepted: an erasure needs an operator, and a member who stays enrolled after an erasure starts a new ledger with their next imported purchase.

**Linked:** CL-22 (retention ends only through this job), CL-08 and CL-17 (the same approach), CL-21 (the tables it deletes).

**Registry impact:** None.

---

## Update after LOYALTY v1.2 (SDD v1.1)

**Source:** `sdd-refunds-platform` v1.1 (Reconciled 2026-10-01; chunk 00 Changes Log row 1.1, the targeted LOYALTY v1.0 to v1.2 update), REFUNDS v1.0, LOYALTY v1.2 (Status In Review; v1.2 only added Figures 1 and 2 to v1.1), its `decision-log.md` and chunks 14 to 16, CLAUDE.md, and sdd-unifier SKILL.md step 8b (E3). Nothing in the SDD or the BRDs was modified. The sections above stay as the record of the v1.0 proposals; where this section and an earlier entry differ, this section wins, and the Apply list (part 4) names the one text that applies to each marker.

### 1. Markers now present, by chunk

| Chunk | Section(s) holding markers | Now (SDD v1.1) | IDs | Before (SDD v1.0) |
|-------|----------------------------|---------------:|-----|------------------:|
| 03 | §7.3 Use Case Traceability | 0 | - | 0 |
| 09 | §13 Services Decomposition | 0 | - | 0 |
| 10 | §14.9 Payload Contract Samples | 1 | CL-01 | 1 |
| 11 | §15 Service Integration API Contracts | 0 | - | 0 |
| 12 | §16.6 Grant / Invitation Authority | 1 | CL-02 | 1 |
| 13a | §17.1 refund-service | 6 | CL-03 to CL-08 | 6 |
| 13b | §17.2 payout-service | 5 | CL-09 to CL-13 | 5 |
| 13c | §17.3 notification-service | 4 | CL-14 to CL-17 | 4 |
| 13d | §17.4 loyalty-service | 6 | CL-19, CL-21 to CL-25 | 8 |
| **Total** | | **23** | | **25** |

- The count matches the master's E2E gate line ("chunk 10 (§14.9: 1), 12 (§16.6: 1), 13a (6), 13b (5), 13c (4), and 13d (6)") and the decision log's "E2E gate check, 2026-10-01".
- Each of the 23 marker texts is, character for character, the text quoted in its CL entry above (CL-13 and CL-16 share one text and are told apart by chunk). Only the 13d line numbers moved.
- Out of scope and not counted: the four `[TBD - EXTERNAL: ...]` markers of API-01 to API-04 in chunk 11 (the chunk's EXTERNAL_RULE header comment also quotes the marker form), and every marker in chunks 00 to 02, 06 to 08, and 14 to 17, including the two the v1.1 update raised (§3 assumption 3 in chunk 01, the LOYALTY acceptance line of §19 in chunk 15).

### 2. Mapping

| File | Section | Line now (v1.0) | CL-NN | Status | What changed, or why it still fits |
|------|---------|-----------------|-------|--------|-------------------------------------|
| `10-events-hub.md` | §14.9, bold line under the heading | 169 (169) | CL-01 | kept | v1.1 changed only §14.10 in this chunk (BR-1 label, Refunds Portal mapping); §14.9, the §14.5 cells, the §14.1 sentence, and the three 13a to 13c "candidate" lines CL-01 edits are unchanged. |
| `12-centralized-user-roles.md` | §16.6 row 3, Grantor role cell | 78 (78) | CL-02 | kept | v1.1 changed row 2 and Figure 12's member node; row 3, node `ADM`, and the Summary ending CL-02 replaces are unchanged. |
| `13a-service-refund.md` | §17.1 Business Logic, "Payout outcome" | 46 (46) | CL-03 | kept | 13a unchanged since v1.0. |
| `13a-service-refund.md` | §17.1 DB Modeling, Tables Design | 153 (153) | CL-04 | kept | 13a unchanged since v1.0. |
| `13a-service-refund.md` | §17.1 Retention Policy, first bullet | 164 (164) | CL-05 | kept | 13a unchanged; the §11.2 Tenant settings sentence CL-05 edits still reads as quoted. |
| `13a-service-refund.md` | §17.1 List of APIs, sentence after the table | 210 (210) | CL-06 | kept | 13a unchanged since v1.0. |
| `13a-service-refund.md` | §17.1 Error Handling, Poison messages | 265 (265) | CL-07 | kept | 13a unchanged; §14.6 rule 4 unchanged. |
| `13a-service-refund.md` | §17.1 Compliance, GDPR bullet | 343 (343) | CL-08 | kept | 13a unchanged since v1.0. |
| `13b-service-payout.md` | §17.2 Business Logic, "After the retry window" | 40 (40) | CL-09 | kept | 13b unchanged; the texts CL-09 edits in 01 §1, 08 §12 INT-01, 09 §13, and 14 §18.3 still read as quoted. |
| `13b-service-payout.md` | §17.2 Business Logic, "Original card" | 41 (41) | CL-10 | kept | 13b unchanged; 11 API-02 still reads "(§17.2 clarification)". |
| `13b-service-payout.md` | §17.2 DB Modeling, Tables Design | 136 (136) | CL-11 | kept | 13b unchanged since v1.0. |
| `13b-service-payout.md` | §17.2 Retention Policy, first bullet | 147 (147) | CL-12 | kept | 13b unchanged since v1.0. |
| `13b-service-payout.md` | §17.2 Error Handling, Poison messages | 235 (235) | CL-13 | kept | 13b unchanged since v1.0. |
| `13c-service-notification.md` | §17.3 DB Modeling, Tables Design | 111 (111) | CL-14 | kept | 13c unchanged since v1.0. |
| `13c-service-notification.md` | §17.3 Retention Policy, first bullet | 122 (122) | CL-15 | kept | 13c unchanged since v1.0. |
| `13c-service-notification.md` | §17.3 Error Handling, Poison messages | 213 (213) | CL-16 | kept | 13c unchanged since v1.0. |
| `13c-service-notification.md` | §17.3 Compliance, GDPR bullet | 270 (270) | CL-17 | kept | 13c unchanged since v1.0. |
| `13d-service-loyalty.md` | §17.4 Business Logic, "Earn points" | - (37) | CL-18 | retired | Removed by the v1.1 update: answered by LOYALTY 03 Earning (TD-07). |
| `13d-service-loyalty.md` | §17.4 Business Logic, "Take points back", last sentence | 38 (38, first of two) | CL-19 | changed | Same marker text; the answer no longer fits the v1.1 design (match on `member_purchase`, a lock on the purchase reference, no `NO_EARN`) or the v1.1 texts it edits in 01 and 11. Replacement below. |
| `13d-service-loyalty.md` | §17.4 Business Logic, "Take points back", second marker | - (38, second of two) | CL-20 | retired | Removed by the v1.1 update: answered by LOYALTY/UC-02 BR-3 and AC-6 (TD-12). |
| `13d-service-loyalty.md` | §17.4 DB Modeling, Tables Design | 145 (126) | CL-21 | changed | Same marker text; the table above it gained `member_purchase`, `refunded_amount`, and the movement-date rule and lost `NO_EARN`, so most earlier rows no longer fit. Replacement below. |
| `13d-service-loyalty.md` | §17.4 Retention Policy, first bullet | 156 (137) | CL-22 | changed | Same marker text; the bullet now names `member_purchase`, and the earlier answer would delete take-back records that LOYALTY/UC-02 BR-3 still counts. Replacement below. |
| `13d-service-loyalty.md` | §17.4 List of APIs, sentence after the table | 196 (177) | CL-23 | kept | Same marker and endpoints; the three DTOs still carry what LOYALTY v1.2 UC-01 step 2, A1, AC-1, AC-2 and UC-02 steps 2 and 4, A1, AC-2 to AC-4 need, and `occurredAt` of a `TAKEN_BACK` is already `paidAt` in SDD v1.1. |
| `13d-service-loyalty.md` | §17.4 Error Handling, Poison messages | 238 (219) | CL-24 | kept | Same marker; the listener path still starts the LOYALTY/NFR-02 hour at the paid report, and §11.1 and §11.4 still lack the cadence and the age alert CL-24 adds. |
| `13d-service-loyalty.md` | §17.4 Compliance, GDPR bullet | 298 (276) | CL-25 | changed | Same marker text; the erasure must now cover `member_purchase`, and the earlier last sentence names `NO_EARN`, which v1.1 removed. Replacement below. |

**Retired, and what removed them:**

- **CL-18** (how a purchase amount with cents becomes whole points): the SDD v1.1 targeted update removed the marker because [LOYALTY 03 § Points movement](../brd-loyalty-points/03-definitions-and-domain-concepts.md#points-movement) now states the rule (1 point per whole 1 EUR; cents earn no points; TD-07) and No 0-point movements (TD-14); recorded in the SDD `decision-log.md` § LOYALTY v1.2 update clarification register and the OI-19 record of 2026-10-01. The design keeps round-down, as CL-18 proposed, but a 0-point purchase is now a member purchase with no movement, not a `NO_POINTS` rejection.
- **CL-20** (points taken back for a partial refund): removed by the same update because [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-3 and AC-6 (TD-12) state the rule; recorded in the same register. §17.4 now computes the take-back per refund under the purchase lock, which replaces CL-20's cumulative rule.

No marker is new, so no entry is numbered from CL-26.

### 3. Changed entries

#### CL-19 (replaces the CL-19 entry above): Which identifier links a paid refund to its member purchase

**Where:** `13d-service-loyalty.md`, §17.4 loyalty-service > Business Logic > "Take points back" bullet, its last sentence, in bold (line 38).

```text
[NEEDS CLARIFICATION: is the LOYALTY purchase reference ([LOYALTY 08 § Integrations](../brd-loyalty-points/08-integrations.md#integrations)) the same identifier as the REFUNDS receipt number ([REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) step 1)? The take-back matches them one to one.]
```

**What changed:** the marker text is the same; the answer no longer fits. SDD v1.1 records each reported purchase as a `member_purchase` (a 0-point purchase has no `EARNED` movement), finds it by `purchase_reference = receiptNumber`, serialises the listener and the import on (`tenant_id`, `purchase_reference`), and keeps a `PENDING_EARN` take-back with no expiry (BR-4). The earlier answer put the key on the `EARNED` movement, used the removed `NO_EARN` wording, rewrote R-03 around a proportional take-back that BR-3 has replaced, and gave an API-04 data list that drops the purchase date and the report time v1.1 now needs. LOYALTY v1.2 also adds a Refunds Portal row to its 08 that names the purchase reference among what the Refunds Portal reports.

**Question:** On which identifier does a paid refund find the member purchase it refunds, given that whether the LOYALTY purchase reference is the REFUNDS receipt number is a fact about POS Records data that the design does not know?

**Options:**
- **A.** Match on the receipt number: API-04 supplies the receipt number of each member purchase, `member_purchase` stores it (unique per tenant), and the listener and the import match and serialise on it - holds whether or not the two identifiers are the same; refund-service, `RefundPaidEvent`, and the extraction field that ADR-01 and §14.7 already name as the match key stay as they are; POS Records must send one more field.
- **B.** Keep matching the purchase reference against the receipt number (the current text) - no change, but if the two differ, no refund ever finds its purchase: each stays `PENDING_EARN` with no expiry, which is also the normal state of a refund of a non-member purchase, so no point is ever taken back and nothing shows it (R-03).
- **C.** Carry the purchase reference with the refund: refund-service reads it from POS Records at the receipt lookup (API-01), stores it, and `RefundPaidEvent` gains `purchaseReference` - delivers the item the LOYALTY 08 Refunds Portal row names, but asks POS Records for a field REFUNDS 08 does not list, brings a LOYALTY identifier into refund-service, and changes the §14.10 contract and the extraction field of ADR-01, §14.7, and §22.
- **D.** Look the purchase up in POS Records by receipt number when the refund is paid - no stored key, but a new synchronous contract inside the take-back, which then depends on POS Records being up within the NFR-02 hour.

**Recommended Answer:** Option A. Replace the marker, with the bold markers around it, by:

> The match key is the receipt number: API-04 supplies the receipt number of each member purchase (§15.3), `member_purchase` stores it (`receipt_number`, unique per tenant), and the listener matches the event's `receiptNumber` against it. When POS Records uses the receipt number as the purchase reference, both columns hold the same value. A member purchase record without a receipt number, or with a receipt number another member purchase already has, is rejected by the import (Earn points).

Also apply in 13d:
- "Take points back", same bullet: "then reads the `MemberPurchase` whose purchase reference matches the event's `receiptNumber`" becomes "then reads the `MemberPurchase` whose `receipt_number` matches the event's `receiptNumber`"; "The listener and the import serialise on the purchase reference (a transaction-scoped lock on `tenant_id` and `purchase_reference`)" becomes "The listener and the import serialise on the receipt number (a transaction-scoped lock on `tenant_id` and `receipt_number`)"; "carries `purchase_reference`, `refunded_amount`, `paid_at`, and `status`" becomes "carries `receipt_number`, `purchase_reference` once applied, `refunded_amount`, `paid_at`, and `status`"; "applies its pending take-backs in `paid_at` order with the same rule and sets them to `APPLIED`" becomes "applies the pending take-backs with the same tenant and receipt number in `paid_at` order with the same rule, sets their `purchase_reference`, and sets them to `APPLIED`".
- "Earn points": "(member number, purchase reference, amount, purchase date, and the time POS Records reported the purchase; API-04)" becomes "(member number, purchase reference, receipt number, amount, purchase date, and the time POS Records reported the purchase; API-04)"; "Each record is validated: one that has a non-positive amount, is not in the tenant currency, or fails validation is written to `purchase_import_rejection` (`tenant_id`, `purchase_reference`, `reason`, `received_at`)" becomes "Each record is validated: one that has a non-positive amount, is not in the tenant currency, has no receipt number, has a receipt number another member purchase already has, or fails validation otherwise is written to `purchase_import_rejection` (`tenant_id`, `purchase_reference`, `receipt_number`, `reason`, `received_at`; reasons in the Tables Design)".
- Boundaries, Owns: "(each member purchase POS Records reports, with its amount, purchase date, and points earned)" becomes "(each member purchase POS Records reports, with its receipt number, amount, purchase date, and points earned)".
- Figure 25, node C: `C["Lock the purchase reference, find the member purchase for the receipt number"]` becomes `C["Lock the receipt number, find the member purchase with that receipt number"]`.

And in other chunks:
- 10 §14.10, `RefundPaid` Notes: "`receiptNumber` as the purchase reference (§17.4 clarification), `referenceNumber` as the refund reference, `paidAmount` as the refunded amount, and `paidAt` as the date the refund was paid; the member comes from the matching purchase." becomes "`receiptNumber` to find the refunded member purchase through the receipt number POS Records reports with it (§17.4 Take points back), `referenceNumber` as the refund reference, `paidAmount` as the refunded amount, and `paidAt` as the date the refund was paid; the purchase reference and the member come from that member purchase."
- 11 §15.3 API-04, "Data the platform needs": "Sends the stored cursor; needs, per purchase, the member number, the purchase reference, the amount and currency, the purchase date ([LOYALTY 08 § Integrations](../brd-loyalty-points/08-integrations.md#integrations)), the receipt number, which a paid refund is matched on (§17.4), and the time POS Records reported the purchase, which starts the LOYALTY/NFR-03 hour". Its `TBD - EXTERNAL` marker ends "..., and whether POS Records serves member purchases by cursor or time window or can only push them (R-05), and whether it can send the receipt number with each member purchase (R-03).]".
- 01 §3 assumption 6: "with member number, purchase reference, amount, purchase date" becomes "with member number, purchase reference, receipt number, amount, purchase date".
- 01 §4 R-03 Mitigation: "The take-back matches on the receipt number POS Records reports with each member purchase (§17.4), which holds whether or not the two identifiers are the same; a member purchase record without one is rejected and alerted; whether POS Records can send it is asked with API-04 (§15.3)."
- 01 §5 Glossary: Purchase reference becomes "The LOYALTY name of the identifier of a POS purchase; a paid refund finds its purchase through the receipt number POS Records reports with each member purchase (§17.4)."; Member purchase becomes "A purchase POS Records reports for a member, recorded once by loyalty-service with its receipt number, amount, date, and points earned, which may be 0 (§17.4)."

**Why:** Neither BRD says the two identifiers are the same: [LOYALTY 08 § Integrations](../brd-loyalty-points/08-integrations.md#integrations) gives POS Records "Member, purchase reference, amount, purchase date" and the Refunds Portal "Member, purchase reference, refund reference, refunded amount, date the refund was paid", while [REFUNDS 08 § Integrations](../brd-refunds-portal/08-integrations.md#integrations) gives POS Records "Receipt number, items, amounts, branch, purchase date" and [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) step 1 starts from the receipt number. The equality is a fact about POS Records, whose contracts are `TBD - external` (§15.6), so the design must not rest on it; A turns it into an explicit API-04 data need that the Retail IT team (the API-04 provider, §15.6) confirms through the `TBD - EXTERNAL` item before go-live, and [REFUNDS 02 § Assumptions / Constraints](../brd-refunds-portal/02-glossary-assumptions-facts.md#assumptions--constraints) 1 (every purchase has a receipt number the customer can enter) makes it a request for an attribute every purchase has. Since the 2026-10-01 OI-18 record a pending take-back has no expiry, so B's failure is now silent and permanent. ADR-01 and §14.7 (with §22 item 1 following them) already name `receiptNumber` as the take-back's match key after an extraction, so A gives one key in process and out of it; C changes that key and the §14.10 contract and moves a LOYALTY identifier into refund-service's bounded context (AP-04); D adds an external contract inside the take-back, which then fails whenever POS Records does (R-04) and can miss the NFR-02 hour. The lock moves to the receipt number because it is the only key the listener knows before POS Records reports the purchase. A record without a receipt number is rejected, as OI-19 does for other invalid records, so the gap shows the same day instead of leaving every refund of that purchase pending. `RefundPaid` still realises the LOYALTY 08 Refunds Portal row: the refund reference, refunded amount, and paid date travel in the event, and the purchase reference and member come from the member purchase the receipt number finds. Tradeoff accepted: POS Records must send one more field; if it cannot, R-03 becomes an issue and the matching is redesigned; a rejected member purchase earns no points until POS Records reports it again with a receipt number.

**Linked:** CL-21 (the `receipt_number` columns, the rejection reasons, the indexes, Figure 24), CL-22 (take-back records live as long as their member purchase), CL-25 (the erasure deletes member purchases and the take-backs applied to them, under this lock), CL-23 (unaffected: `purchaseReference` still comes from the movement).

**Registry impact:** Chunk 10 §14.10, the `RefundPaid` Notes cell only (name, publisher, listener, phase, and DTO fields unchanged). Chunk 11 API-04: one item in "Data the platform needs" and the `TBD - EXTERNAL` question extended (no method, URI, or field defined). No event, topic, API ID, permission token, or role is added.

---

#### CL-21 (replaces the CL-21 entry above): Full column list, constraints, and indexes of the `loyalty` schema

**Where:** `13d-service-loyalty.md`, §17.4 > DB Modeling > Tables Design, the line after the table (line 145).

```text
[NEEDS CLARIFICATION: the full column list, remaining constraints, and secondary indexes of the `loyalty` schema; the BRD describes the concepts, not a relational schema.]
```

**What changed:** the marker text is the same; the table above it changed. SDD v1.1 added `member_purchase` (amount, currency, purchase date, points earned, report time), gave `refund_takeback` `refunded_amount` and `purchase_reference`, set `points_movement.occurred_at` to the movement date, and removed `NO_EARN`. The earlier rows for a receipt number on the `EARNED` movement, purchase amounts on `points_movement`, `refund_takeback.paid_amount`, `purchase_import_cursor.last_success_started_at` (the `NO_EARN` close), the `NO_POINTS` rejection reason, and the `PENDING_EARN` index by `paid_at` no longer fit.

**Question:** Which further columns, constraints, and secondary indexes of the `loyalty` schema does the SDD fix, now that it records each member purchase and applies [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-3 and BR-4?

**Options:**
- **A.** The CL-04 split: every column a §17.4 rule, metric, job, or DTO field relies on, and the index behind each query and job; lengths, check wording, and plan-driven indexes in the child LLD - every rule has its column, and the LLD cannot change a key.
- **B.** The full physical schema now (CL-04 option B) - nothing left to the LLD, but the SDD duplicates its data section.
- **C.** Hand the rest to the LLD (CL-04 option C) - smallest edit, but the LLD would invent the match key, the rejection reasons, and the per-purchase sums the take-back rule needs.

**Recommended Answer:** Option A. In the Tables Design:

1. Add after the `member_purchase` rows:

| Table | Column | Type | Constraints | Notes |
|-------|--------|------|-------------|-------|
| `member_purchase` | `receipt_number` | varchar | NOT NULL; UNIQUE (`tenant_id`, `receipt_number`) | From API-04; the take-back match key (Business Logic, Take points back) |

2. In the existing `member_purchase` row `points_earned`, `reported_at`, the Constraints cell becomes "NOT NULL; `points_earned` >= 0".
3. Replace the `refund_takeback` row that starts with `purchase_reference` by:

| Table | Column | Type | Constraints | Notes |
|-------|--------|------|-------------|-------|
| `refund_takeback` | `refunded_amount`, `currency`, `status`, `paid_at` | numeric(19,4), char(3), varchar, timestamptz | NOT NULL; CHECK status in `APPLIED`, `PENDING_EARN` | From `RefundPaid` (`paidAmount`, `paidAt`); a pending take-back waits for the purchase; `refunded_amount` counts toward the purchase's refunded total |
| `refund_takeback` | `receipt_number`, `purchase_reference` | varchar, varchar | `receipt_number` NOT NULL; `purchase_reference` NULL until applied | `receipt_number` from `RefundPaid` is the match key; `purchase_reference` is set from the matched member purchase |

4. Replace the `purchase_import_rejection` row by:

| Table | Column | Type | Constraints | Notes |
|-------|--------|------|-------------|-------|
| `purchase_import_rejection` | `id` | uuid | PK | UUIDv7, as Figure 24 shows |
| `purchase_import_rejection` | `tenant_id`, `received_at` | uuid, timestamptz | NOT NULL | Purchase records the import rejected and passed |
| `purchase_import_rejection` | `reason` | varchar | NOT NULL; CHECK in `NON_POSITIVE_AMOUNT`, `CURRENCY_MISMATCH`, `MISSING_RECEIPT_NUMBER`, `DUPLICATE_RECEIPT`, `INVALID` | The validation of Earn points |
| `purchase_import_rejection` | `purchase_reference`, `receipt_number`, `detail` | varchar, varchar, text | NULL allowed | As received; `detail` says what failed |

5. Add at the end:

| Table | Column | Type | Constraints | Notes |
|-------|--------|------|-------------|-------|
| `member_purchase`, `points_movement`, `member_balance`, `refund_takeback` | auditing columns | per §11.1 | `version` on `member_balance` | |

Indexes (each leads with `tenant_id`, §11.1):
- `member_purchase`: the unique keys (`tenant_id`, `purchase_reference`) (existing) and (`tenant_id`, `receipt_number`) (above) - the re-import no-op and the take-back match; and `(tenant_id, member_id)` - the member erasure job (Compliance).
- `points_movement (tenant_id, member_id, occurred_at, id)` - the history newest first by movement date, and the date of the last movement.
- `points_movement (tenant_id, purchase_reference)` - the points already taken back for a purchase (Take points back); the existing partial UNIQUE where `EARNED` stays.
- `refund_takeback (tenant_id, receipt_number, paid_at)` - the purchase's refunded total, and the pending take-backs the import applies in `paid_at` order.
- `refund_takeback (tenant_id, movement_id)` - the detail of a `TAKEN_BACK` movement.
- `purchase_import_rejection (tenant_id, received_at)` - review and the 90-day retention (CL-22).

Figure 24: `MEMBER_PURCHASE` gains `string receipt_number UK`; in `REFUND_TAKEBACK`, `uuid tenant_id` becomes `uuid tenant_id PK` (the table's key is (`tenant_id`, `refund_request_id`)) and it gains `string receipt_number` and `string currency`; `PURCHASE_IMPORT_REJECTION` gains `string receipt_number`.

Replace the marker with:

> Column lengths, check wording, and any further index a query plan needs are set in the child LLD's data section; they never change a key, a uniqueness rule, or a tenant rule above.

**Why:** Each change realises a stated rule. The receipt number is the match key (CL-19). `version` on `member_balance` because the receipt-number lock serialises one purchase, not one member, so the listener and the import can update one member's balance from two purchases at once (§11.1 optimistic locking). A pending take-back knows only the receipt number until POS Records reports its purchase ([LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-4), so `purchase_reference` is NULL until applied. `currency` lets the step 4 detail return the refunded amount as `Money` with its currency (LOYALTY/UC-02 AC-4: the refunded amount in EUR), as `member_purchase` already does for the purchase amount. `reported_at` NOT NULL keeps every earned movement measurable against LOYALTY/NFR-03. The rejection table gets the `id` Figure 24 already shows, nullable references so that a record missing one is rejected and passed instead of stopping the run (the purpose of OI-19), and the reasons of the Earn points validation without `NO_POINTS`, which the 2026-10-01 OI-19 record removed. The indexes serve the history order by movement date ([LOYALTY 03 § Points movement](../brd-loyalty-points/03-definitions-and-domain-concepts.md#points-movement) Movement date; UC-02 step 2, AC-2), the BR-3 sums per purchase, which must count refunds that took back 0 points ([LOYALTY 16](../brd-loyalty-points/16-uat-bat-test-cases.md) TC-PTS-04: three 0.90 EUR refunds of a 2.70 EUR purchase take back 0, 0, then 2), BR-4's `paid_at` order, the step 4 detail (AC-3, AC-4), and the erasure and retention jobs; CLAUDE.md puts `tenant_id` in every shared-schema index. Tradeoff accepted: as CL-04, the LLD fills lengths and may add indexes, never a key.

**Linked:** CL-19 (the receipt number, the rejection reasons), CL-22 (retention of take-backs and rejections), CL-23 (the movement detail reads `member_purchase` and `refund_takeback`), CL-25 (the erasure index).

**Registry impact:** None.

---

#### CL-22 (replaces the CL-22 entry above): Retention of a member's ledger after the member leaves

**Where:** `13d-service-loyalty.md`, §17.4 > DB Modeling > Retention Policy, first bullet (line 156).

```text
[NEEDS CLARIFICATION: retention after a member leaves the program.]
```

**What changed:** the marker text is the same; the answer no longer fits. SDD v1.1 added `member_purchase` to the bullet, and the `refund_takeback` bullet below it now reads "kept as long as the movement it created; a pending take-back is kept until the import applies it". The earlier answer deleted a take-back with no movement 90 days after `handled_at`; under [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-3 such a record (a refund that took back 0 points) still counts toward its purchase's refunded total, and BR-4 keeps a pending one with no end.

**Question:** How long are a member's purchases, movements, and balance kept after the member leaves the loyalty program, and how long are the take-back, rejection, and cursor records kept?

**Options:**
- **A.** Ledger and member purchases kept until the member erasure job deletes them on request; no "member left" signal; every applied take-back kept as long as the member purchase it refunds, a pending one until the import applies it - no business behaviour added; storage limitation rests on the erasure request path.
- **B.** Delete a ledger after a period without movements (for example 3 years) - bounded storage, but that is points expiry, which neither BRD states.
- **C.** Consume a "member left" signal from the loyalty program - automatic, but joining the program is outside the product ([LOYALTY 04 § Out of Scope](../brd-loyalty-points/04-scope-and-personas.md#out-of-scope)) and no such event or API exists.

**Recommended Answer:** Option A. Replace the two bullets of the Retention Policy (the marker's bullet and the `refund_takeback` bullet) with:

> - `member_purchase`, `points_movement`, `member_balance`: kept while the member's ledger exists. loyalty-service receives no signal that a member left the program, because joining the program is outside the platform ([LOYALTY 04 § Out of Scope](../brd-loyalty-points/04-scope-and-personas.md#out-of-scope), §3 assumption 3); a ledger is deleted only by the member erasure job (Compliance).
> - `refund_takeback`: an `APPLIED` record is kept as long as the member purchase it refunds, because its `refunded_amount` counts toward the purchase's refunded total (Business Logic, Take points back); a `PENDING_EARN` record is kept until the import applies it ([LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-4: a refund reported before its purchase is kept).
> - `purchase_import_rejection`: deleted 90 days after `received_at`.
> - `purchase_import_cursor`: kept while the tenant exists.

**Why:** LOYALTY v1.2 puts joining the program and member sign-in out of scope ("Members use their existing loyalty program account", 04 Out of Scope; TD-01) and states no leaving event, definition, or API, so the design cannot react to a member leaving; B would make points expire, which LOYALTY does not state (04 defers only redemption). Keeping every `APPLIED` record with its purchase is what BR-3 needs: "all the points it earned are taken back" once the refunded total reaches the purchase amount, and that total includes refunds that took back 0 points and wrote no movement ([LOYALTY 16](../brd-loyalty-points/16-uat-bat-test-cases.md) TC-PTS-04), which the current "as long as the movement it created" leaves undefined and the earlier answer would have deleted. BR-4 and the 2026-10-01 OI-18 record keep a pending take-back with no expiry. The 90 days for rejections serve the OI-19 review and are a design choice; no law is assumed. Tradeoff accepted: a departed member's ledger and purchases stay until someone asks for erasure, and pending take-backs of non-member purchases accumulate (at most one per paid refund; [REFUNDS 02 § Facts](../brd-refunds-portal/02-glossary-assumptions-facts.md#facts): about 1,200 requests a month); they name no member. A "member left" signal is a BRD follow-up for the LOYALTY owner.

**Linked:** CL-25 (the erasure job is the only end of a ledger and deletes the take-backs applied to its purchases), CL-21 (the `purchase_import_rejection (tenant_id, received_at)` index), CL-19 (take-back records carry the receipt number).

**Registry impact:** None.

---

#### CL-25 (replaces the CL-25 entry above): Lawful basis, erasure path, and ISO 27001 / SOC 2 for the member ledger

**Where:** `13d-service-loyalty.md`, §17.4 > Compliance > GDPR bullet (line 298); the ISO 27001 / SOC 2 bullet (line 300) points to it.

```text
[NEEDS CLARIFICATION: lawful basis and the erasure path for a member's ledger, and whether ISO 27001 or SOC 2 controls apply to this module.]
```

**What changed:** the marker text is the same; the answer no longer fits. SDD v1.1 added `member_purchase`, which holds the member number, purchase reference, amount, and date of every reported purchase (and, after CL-19, its receipt number), and removed `NO_EARN`. The earlier erasure job left `member_purchase` in place, which would keep the personal data and let a refund paid after the erasure write a take-back against a deleted balance, and its last sentence ("closes as `NO_EARN`") names a status that no longer exists.

**Question:** What lawful basis and erasure path apply to a member's purchases and ledger, and do ISO 27001 or SOC 2 controls apply to the module?

**Options:**
- **A.** Purpose fixed, the basis the data protection owner records, a member erasure job (operations, break-glass) that deletes the member's balance, movements, member purchases, and the take-backs applied to them in one transaction, no certification-specific control - consistent with CL-08 and CL-17; the only deletion in an append-only ledger.
- **B.** Anonymise instead of delete (replace `member_id` with a random id) - keeps movement totals, but LOYALTY states no report that needs them ([LOYALTY 09](../brd-loyalty-points/09-reporting-and-analytics.md#reporting--analytics): not applicable), and the purchase references and receipt numbers left in the rows can still identify the person.
- **C.** A self-service erasure endpoint - a use case, endpoint, and permission token neither BRD states.

**Recommended Answer:** Option A. Replace the GDPR and ISO 27001 / SOC 2 bullets with:

> - **GDPR:** member numbers, purchase references, receipt numbers, member purchases, and movements are personal data, processed to keep the member's points ledger and show it to them ([LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance), [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history)); the ledger is visible only to its member. The lawful basis for this purpose is the one the retailer's data protection owner records for it; the platform collects no consent. **Erasure:** the `loyalty-member-erasure` job, run by operations under the §20.3 break-glass rule on a request the data protection owner approves, deletes one member's `member_balance`, `points_movement`, and `member_purchase` rows and the `APPLIED` `refund_takeback` records of those purchases in one transaction, holding the receipt-number lock of each purchase (Business Logic, Take points back), so the balance never disagrees with the ledger (LOYALTY/NFR-01). It is the only deletion of movements and member purchases (Developer Notes). A refund of an erased purchase paid later finds no member purchase and is kept as a `PENDING_EARN` take-back that changes no balance, as for a purchase no member made; a `PENDING_EARN` record names no member and follows the Retention Policy.
> - **ISO 27001 / SOC 2:** neither BRD requires a certification; the module applies the §11.6 controls, so a certification scope the retailer adopts can include it without a design change.

Also apply:
- 13d Input: add the row "| Operations job | `loyalty-member-erasure` | Deletes one member's purchases and ledger on request (Compliance). |".
- 13d Developer Notes, Avoid: "updating or deleting a movement" becomes "updating or deleting a movement or a member purchase, except through the member erasure job".
- 12 §16.8 item 4: "**Erasure:** follows the GDPR clarifications of §17.1 (refund records and contact details) and §17.4 (a member's ledger)." becomes "**Erasure:** follows the erasure paths of §17.1 Compliance (refund records and contact details) and §17.4 Compliance (a member's ledger): operations jobs under the §20.3 break-glass rule, with no role or endpoint." Apply after CL-08, whose answer writes the §17.1 path.

**Why:** As CL-08 for the basis and certification: the lawful basis is the controller's legal determination and is not asserted here, and neither BRD names ISO 27001 or SOC 2. SDD v1.1 made `member_purchase` the record of every reported purchase; an erasure that left it would keep the person's purchases and let a refund paid afterwards take points back from a balance that no longer exists, a negative balance against the §17.4 Balance rule ("no balance goes below 0") and LOYALTY/NFR-01. Deleting purchases, movements, and the balance together keeps the stored balance equal to the sum of the movements, and holding the receipt-number locks keeps a concurrent take-back or import out of the rows being erased. Since `NO_EARN` was removed (2026-10-01 OI-18 record), a refund paid after the erasure stays pending, the same outcome as a non-member purchase. The job needs no operator role or API (§16.4.3: no platform operator role). B leaves identifying references in place; C adds a use case neither BRD states. §16.8 item 4 points to "the GDPR clarifications", which this answer and CL-08 replace, so it is repointed to the two Compliance sections. Tradeoff accepted: an erasure needs an operator; a member who stays enrolled starts a new ledger with their next imported purchase, and a purchase POS Records reports again after the erasure earns again, because its purchase reference is no longer recorded.

**Linked:** CL-08 and CL-17 (the same approach), CL-22 (the erasure job is the only end of a ledger), CL-21 (the `member_purchase (tenant_id, member_id)` index), CL-19 (receipt numbers and the lock).

**Registry impact:** Chunk 12 §16.8 item 4 wording only; no role, permission token, or §16.12.2 count changes. No event or API.

### 4. Apply list

Each row names the one entry whose Recommended Answer, with its "Also apply" edits, replaces the marker. "Above" means the entry in the first part of this file; "this section" means part 3 above.

| # | Marker (file, line) | Entry that applies | One-line summary | Status |
|---|---------------------|--------------------|------------------|--------|
| 1 | `10-events-hub.md` §14.9, 169 | CL-01 above, as written | Ratify the seven §14.9 contracts as JSON Schema 1.0.0, all `committed`, money as decimal strings, with four amendments | kept |
| 2 | `12-centralized-user-roles.md` §16.6 row 3, 78 | CL-02 above, as written | A tenant staff administrator in the Keycloak realm administration provisions branch managers with their branch | kept |
| 3 | `13a-service-refund.md` Payout outcome, 46 | CL-03 above, as written | The branch manager is told in the portal only (payout-failing list, flag, count); no staff email or SMS | kept |
| 4 | `13a-service-refund.md` Tables Design, 153 | CL-04 above, as written | The `refund` columns, constraints, and indexes the rules need; lengths and plan-driven indexes to the LLD | kept |
| 5 | `13a-service-refund.md` Retention Policy, 164 | CL-05 above, as written | Tenant settings `refundRecordRetention` (default 10 years after `closed_at`) and `contactDetailsRetention` (default 30 days), owned by the REFUNDS owner | kept |
| 6 | `13a-service-refund.md` List of APIs, 210 | CL-06 above, as written | Business fields of the nine refund-service DTOs; the OpenAPI document adds formats | kept |
| 7 | `13a-service-refund.md` Poison messages, 265 | CL-07 above, as written | One consumer rule in §14.6 rule 4: DLQ at once if never appliable, else 3 retries at 1, 4, 16 s with jitter; pause while the database is down | kept |
| 8 | `13a-service-refund.md` Compliance, 343 | CL-08 above, as written | Basis recorded by the data protection owner; `refund-contact-erasure` job; no certification-specific control | kept |
| 9 | `13b-service-payout.md` After the retry window, 40 | CL-09 above, as written | `PAYOUT_FAILED` once at the end of the window, then retries every 6 hours until paid | kept |
| 10 | `13b-service-payout.md` Original card, 41 | CL-10 above, as written | The receipt number identifies the card payment; no card data in any deployable | kept |
| 11 | `13b-service-payout.md` Tables Design, 136 | CL-11 above, as written | Payout columns with generic provider columns; indexes; the rest to the LLD | kept |
| 12 | `13b-service-payout.md` Retention Policy, 147 | CL-12 above, as written | Payout records follow `refundRecordRetention` from `succeeded_at` | kept |
| 13 | `13b-service-payout.md` Poison messages, 235 | CL-13 above, as written | The payout-service consumer follows §14.6 rule 4 | kept |
| 14 | `13c-service-notification.md` Tables Design, 111 | CL-14 above, as written | Delivery log columns with a claim lease; indexes; the rest to the LLD | kept |
| 15 | `13c-service-notification.md` Retention Policy, 122 | CL-15 above, as written | `messageLogRetention`, default 90 days after `final_at` | kept |
| 16 | `13c-service-notification.md` Poison messages, 213 | CL-16 above, as written | The notification-service consumer follows §14.6 rule 4 | kept |
| 17 | `13c-service-notification.md` Compliance, 270 | CL-17 above, as written | Basis recorded by the data protection owner; erasure by age; no certification-specific control | kept |
| 18 | `13d-service-loyalty.md` Take points back, 38 | CL-19 in this section | Match a paid refund to its member purchase on the receipt number API-04 supplies; lock on the receipt number; reject a member purchase without one | changed |
| 19 | `13d-service-loyalty.md` Tables Design, 145 | CL-21 in this section | `loyalty` columns for the receipt number, pending take-backs, and rejections; indexes for BR-3, BR-4, the history, and erasure | changed |
| 20 | `13d-service-loyalty.md` Retention Policy, 156 | CL-22 in this section | Ledger and member purchases kept until the erasure job; applied take-backs kept with their purchase, pending ones until applied; rejections 90 days | changed |
| 21 | `13d-service-loyalty.md` List of APIs, 196 | CL-23 above, as written; its "LOYALTY v1.1 draft" note needs no edit of its own, because SDD v1.1 already sets `occurred_at` of a `TAKEN_BACK` to `paidAt` | Business fields of the three loyalty-service DTOs | kept |
| 22 | `13d-service-loyalty.md` Poison messages, 238 | CL-24 above, as written | Publication-log replay every 5 minutes, alert at 30 minutes, never stops | kept |
| 23 | `13d-service-loyalty.md` Compliance, 298 | CL-25 in this section | Basis recorded by the data protection owner; `loyalty-member-erasure` deletes balance, movements, member purchases, and applied take-backs; no certification-specific control | changed |

Rules for the run that applies these:
- Find each marker by its text; the line numbers in the table are current, while the Where lines of CL-23 (177) and CL-24 (219) above give v1.0 line numbers.
- Where a marker is wrapped in bold (chunk 10 line 169, 13a line 46, 13b lines 40 and 41, 13d line 38), the bold markers go with it.
- Not applied: the earlier entries CL-18, CL-19, CL-20, CL-21, CL-22, and CL-25; the section "LOYALTY v1.1 draft found during this run"; and the inline "**LOYALTY v1.1 draft:**" notes of CL-18, CL-20, CL-21, and CL-23. This section supersedes them.
- Apply order (replaces "Apply order" above): (1) CL-09, CL-10, CL-03, and CL-08, then CL-01; (2) CL-07 before CL-13 and CL-16; (3) CL-19 before CL-21, CL-22, and CL-25; (4) CL-05 before CL-12 and CL-15; (5) CL-08 before CL-25 (CL-25 repoints §16.8 item 4 to both erasure paths).
- After applying, in addition to "After applying" above: the step 6a rerun also covers chunk 10 §14.10 (CL-19 Notes cell), chunk 11 API-04 (CL-19), and chunk 12 §16.6 and §16.8 (CL-02, CL-25); the decision-log record for CL-19 is marked as superseding the flag on the purchase reference question in both cross-BRD reconciliation records (2026-09-30 "Terms", 2026-10-01 "Dependency gap"), and its `Rule home:` is §17.4 Take points back.
- The Why and Linked lines of the kept entries CL-23 and CL-24 still cite CL-20 or the earlier CL-21; they are history and are not applied.

Changes to the earlier follow-ups table:
- LOYALTY owner: the CL-18 and CL-20 follow-ups are closed by LOYALTY v1.2 (03 Earning, TD-07; UC-02 BR-3, TD-12). CL-22's "member left" signal stays. New: LOYALTY 08's Refunds Portal row names the member and the purchase reference, which REFUNDS does not hold; the platform derives both from the receipt number (CL-19), so the row may name the receipt number instead.
- External (`TBD - EXTERNAL`, chunk 11): unchanged for CL-19 (API-04: the receipt number with each member purchase).
- Data protection owner: CL-25 now also covers member purchases; CL-22 keeps pending take-backs of non-member purchases with no end (BR-4); they name no member.

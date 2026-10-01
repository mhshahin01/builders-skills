<!--
CHUNK: 10
TITLE: Centralized Event Hub (Platform Event Catalog & Payload Contracts)
PROJECT: Refunds Platform
VERSION: 1.1
DEPENDS_ON: 05, 07, 08, 09
RECONCILES_WITH: every per-service chunk (13a, 13b, 13c, 13d) - Event Model + Messaging Infra sub-sections
PART OF: SDD - Refunds Platform
PURPOSE: Single cross-module catalog of every platform event - name, producer, consumers, envelope, payload contract, business what/when/why - plus the event-hub topology. In this modular monolith every event is an in-process domain event (§14.10); no integration event is on a broker in this release.
CONSISTENCY_RULE: This chunk is the platform contract registry. Event names and DTO fields here MUST match the per-module chunks character-for-character, reconciled from both the publisher and the listener sides; divergences are flagged in §14.8, never silently reconciled.
-->

# 14. Centralized Event Hub (Platform Event Catalog & Payload Contracts)

> **What this chunk is.** The one place that lists **every event on the platform** with its producer, consumers, payload contract, and business meaning (what / when / why). In this release all events are in-process domain events between the modules of the one deployable (§14.10); the broker sections below state why they do not apply yet. Downstream LLD generation and implementers read this chunk as the single event contract surface.

---

## 14.1 Purpose & Scope

The platform is a modular monolith (ADR-01): every cross-module state change is an in-process domain event or an `Internal (in-process)` port call (§15), and no event leaves the deployable, so there is no broker in this release (ADR-02).

1. **What events exist:** six in-process domain events from two publishing modules: `refund` (4) and `payout` (2); zero integration events (§14.9.99).
2. **Who produces and consumes each:** §14.10, reconciled from the publisher and listener tables of chunks 13a-13d (§14.8).
3. **What each carries:** the common event fields and the DTO fields in §14.10, built from the value objects in §14.9.0.
4. **Why and when each fires:** the When column of §14.10 cites the use case step; the Notes column says why the listeners care.

Out of scope: events that never leave one module; provider callbacks (none defined; a CardPay callback would be an External inbound contract in §15); the POS purchase intake, which `loyalty` normalises at its anti-corruption adapter before any event.

## 14.2 Hub Topology Decision

**Decision:** No broker hub in this release: modules exchange in-process domain events stored in a durable event publication log in the deployable's database (ADR-02). A broker hub (Kafka, the on-prem default) is introduced only when a module is extracted (ADR-01 trigger), starting from the §14.10 DTOs.

What makes it *one hub* is the shared contract surface of the integration events on the broker (in-process domain events between modules: §14.10). With no integration events, none of these applies yet:

- **One envelope standard** (§14.3): not applicable yet; in-process events share the common fields of §14.10.
- **One messaging library / pattern:** not applicable yet; on extraction, outbox -> relay -> broker -> inbox (CLAUDE.md outbox mandate).
- **One schema registry:** not applicable yet; the DTOs are versioned additively in each module's `api` package.
- **One event archive:** not applicable yet.
- **One delivery semantic:** not applicable yet; in-process delivery rules are in §14.10.

| Dimension | In-process events with a durable publication log (chosen) | Kafka topic per module (rejected for this release) |
|---|---|---|
| Access control | Module boundaries checked in CI; no network surface | Topic ACLs per service |
| Blast radius | One deployable: a failing listener is retried without failing the publisher | Per-topic isolation across processes |
| Archive / replay granularity | Incomplete publications are retried; no archive or replay of completed ones | Retention-based replay per topic |
| Ownership | Publisher module owns the event DTO in its `api` package | Producer service owns the topic |
| Cost / fan-out | No extra infrastructure; fan-out to two listeners at most | A broker cluster to run for six events with in-process consumers only |

### 14.2.1 Async Backbone (the universal per-event mechanism)

Not applicable for this release: there are no integration events on a broker (ADR-02). The in-process delivery mechanism is described in §14.10.

### 14.2.2 Hub Topology & Fan-Out Landscape

Not applicable for this release: no topics. The module-to-module event edges are in §14.10 and on Figure 3 (§8.3).

## 14.3 Standard Event Envelope (every event, every topic)

Not applicable for this release: no event is published to a topic. The common fields every in-process event DTO carries are listed in §14.10; they map one-to-one onto this envelope (`eventId` -> `event_id`, `occurredAt` -> `occurred_at`, `tenantId` -> `tenant_id`, `correlationId` -> `correlation_id`) when a module is extracted.

## 14.4 Topic Registry

Not applicable for this release: no topics (ADR-02).

**No topic, no published events (consumers only):** not applicable; every module is topic-free in this release.

## 14.5 Platform Event Catalog

Not applicable for this release: no integration events. The six in-process domain events are catalogued in §14.10.

## 14.6 Cross-Cutting Event Guarantees

Not applicable for this release: these guarantees cover integration events on the broker. The guarantees of in-process events are the delivery rules in §14.10.

## 14.7 Universal Subscribers & Cross-Service Doctrines

- **Universal subscribers:** none on a broker. In process, `notification` is the broad listener: it handles every customer-facing refund fact (`RefundSubmitted`, `RefundCancelled`, `RefundRejected`, `RefundPaid`) and the operational `PayoutFailed`.
- **Payout outcome doctrine:** `PayoutSucceeded` has one listener, `refund`, which re-publishes the business fact as `RefundPaid`; other modules bind to `RefundPaid`, never to `PayoutSucceeded`. `PayoutFailed` is an operational alert and goes to `notification` directly, because the refund request does not change state ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1).

## 14.8 Consistency Notes & Open Flags

One divergence was found by the review and is fixed (row 1). The publisher and listener tables of chunks 13a, 13b, 13c, and 13d match §14.10 by event name, publisher module, listener modules, transaction phase, and DTO fields.

| # | Where (chunks) | Divergence | Resolution / flag | Status |
|---|---|---|---|---|
| 1 | 13c §17.3 Dispatch vs §14.9.0 `ContactPoint` | The listener renders messages in the customer's locale, which `ContactPoint` did not carry | `locale` added to `ContactPoint` (additive, §14.10 rule 7); flagged as OI-14 | Fixed in v1.1 |

## 14.9 Payload Contract Samples

Not applicable for this release for integration events. The value objects below are shared by the §14.10 DTOs.

### 14.9.0 Common Value Objects

| Value object | Fields | Used by |
|---|---|---|
| `Money` | `amount decimal(19,4)`, `currency string(ISO-4217)` | `RefundSubmitted` (`requestedAmount`), `RefundPaid` (`paidAmount`), `PayoutSucceeded` (`amount`), `PayoutFailed` (`amount`); API-01 (`amount`) |
| `ContactPoint` | `email string` (pii), `mobile string` (pii, optional), `locale string` (BCP 47, optional; the tenant default locale when absent) | `RefundSubmitted`, `RefundCancelled`, `RefundRejected`, `RefundPaid` (`contact`) |

### 14.9.1 Integration event contracts

Not applicable for this release: no integration events.

### 14.9.99 Coverage Matrix

Platform integration event count: 0. In-process domain event count: 6 (§14.10).

| Event | Catalog (§14.5) | Contract (§14.9 / registry) | Status |
|---|---|---|---|

## 14.10 In-Process Domain Events (modular monolith / hybrid core)

**Delivery rules (every in-process event):**

1. **Durable publication:** the publisher writes the event to the event publication log (schema `platform`) in the same transaction as its state change; a rollback discards the event.
2. **After-commit delivery:** each listener runs asynchronously after the publishing transaction commits, in its own transaction; its publication is marked complete when that transaction commits.
3. **At-least-once, idempotent effect:** a listener that fails leaves its publication incomplete; a re-delivery job re-delivers every publication incomplete for longer than **[NEEDS CLARIFICATION: re-delivery age threshold and job interval; with the listener run they must stay well inside the 1 hour of LOYALTY/NFR-02]**; every listener dedups on `eventId` or on the business key named in Notes. A listener that meets a violation of its own dedup key treats the event as handled and completes.
4. **Ordering:** none guaranteed between events; listeners validate state transitions instead (for example, `PayoutSucceeded` only moves an Approved request).
5. **Failure visibility:** a publication re-delivered **[NEEDS CLARIFICATION: maximum re-deliveries]** times without completing is no longer re-delivered, raises an alert, and waits for the §20 procedure; it is never dropped.
6. **Common fields:** every DTO carries `eventId` (uuid, UUIDv7), `occurredAt` (timestamp, UTC), `tenantId` (uuid), and `correlationId` (uuid), in addition to the fields listed below.
7. **Evolution:** DTO changes are additive; a breaking change is a new event name. Event class names and listener identities are part of the contract: a release that renames or moves one keeps the old one until its incomplete publications are drained (expand-contract, AP-10).
8. **Personal data in publications:** fields tagged `pii` in §14.9.0 are encrypted when the event is written to the publication log, with the PII key of §11.6, and decrypted only for delivery; a publication is deleted when its last listener completes.

| Event | Publisher module | Listener modules | When | Transaction phase (before commit / after commit) | Payload (DTO) | Notes |
|---|---|---|---|---|---|---|
| `RefundSubmitted` | refund | notification | [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) step 6 | after commit | `RefundSubmittedEvent`: `refundId`, `referenceNumber`, `customerId`, `contact`, `branchId`, `requestedAmount` | The customer is told by email and SMS; listener dedup on (`eventId`, channel, recipient) |
| `RefundCancelled` | refund | notification | [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request) step 5 | after commit | `RefundCancelledEvent`: `refundId`, `referenceNumber`, `customerId`, `contact` | The customer is told by email |
| `RefundRejected` | refund | notification | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) A2 | after commit | `RefundRejectedEvent`: `refundId`, `referenceNumber`, `customerId`, `contact`, `rejectionReason` | The customer is told the reason |
| `RefundPaid` | refund | notification, loyalty | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 7 | after commit | `RefundPaidEvent`: `refundId`, `referenceNumber`, `customerId`, `contact`, `purchaseReference`, `paidAmount`, `paidAt` | `notification` tells the customer; `loyalty` takes back the purchase's points ([LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-1: points taken back when the purchase is refunded), idempotent on `refundId` |
| `PayoutSucceeded` | payout | refund | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) step 7 | after commit | `PayoutSucceededEvent`: `payoutId`, `refundId`, `amount`, `providerReference`, `succeededAt` | `refund` moves the request from Approved to Paid and publishes `RefundPaid` (§14.7 doctrine) |
| `PayoutFailed` | payout | notification | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) E1 | after commit | `PayoutFailedEvent`: `payoutId`, `refundId`, `refundReference`, `branchId`, `amount`, `firstAttemptAt`, `lastFailureReason` | Fires once the payout still fails 24 h after its first attempt; `notification` tells the branch manager; the request stays Approved |

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 09-services-summary.md | NEXT: 11-api-contracts.md -->

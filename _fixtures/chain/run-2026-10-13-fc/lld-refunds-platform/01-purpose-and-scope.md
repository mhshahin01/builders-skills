<!--
CHUNK: 01
TITLE: Purpose, Scope, Assumptions, Glossary
PROJECT: Refunds Platform
VERSION: 1.1
PART OF: LLD - Refunds Platform
-->

# 1. Purpose

This LLD lets a developer or an AI implementer build `refunds-platform-app`, the one Spring Boot deployable of the Refunds Platform SDD, module by module, without further design questions beyond the flagged ones: for each of the four modules it gives the class and port map, the pseudocode of every non-trivial method, the transaction and lock rules, the publication-log and queued-provider-work mechanics that make every state change and its follow-up effects durable, the error mapping, and the trace from each BRD use case to its entry points, routes, screens, and e2e specs. It covers the refund lifecycle as SDD v1.4 sets it: payouts held while a card dispute of the original payment is open, paid again in a new round when the customer's bank sends them back, resolved by hand by two payout operators, and every refund outcome reported to Loyalty Points in `sequence` order. The design, its decisions, and its contracts stay in the [SDD](../sdd-refunds-platform/refunds-platform-sdd-master.md) ([§1 Executive Summary](../sdd-refunds-platform/01-executive-summary-scope-risks.md#1-executive-summary)); this LLD adds the implementation.

---

# 2. Scope

The solution scope is SDD [§2 Scope](../sdd-refunds-platform/01-executive-summary-scope-risks.md#2-scope). This LLD narrows it as follows.

## 2.1 In Scope

- All four SDD §13 modules of `refunds-platform-app`: `customer-notification`, `loyalty-points`, `payout`, `refund-request` (one file each in `04-implementation/`).
- The shared platform code inside the deployable that every module uses: the publication log (dispatcher and redelivery), tenant and caller context, the product-enablement guard, the `@UseCase` aspect, the Problem Details handler, idempotency, per-tenant job runner, advisory locks (`09-cross-cutting.md`).
- The four PostgreSQL schemas and their versioned migrations (`05-data-model.md`).
- The one Angular web app's routes, screens, and runtime use-case context for the customer, member, branch manager, and payout operator screens (`14-frontend.md`), as far as ADR-11 (Proposed) allows.
- The two product enablement settings, the started-branch setting of the pilot, and the refund-reporting start date (SDD [§11.5](../sdd-refunds-platform/07-cross-cutting-concerns.md#115-configuration-management-default)): what each switches in code, and how the refund outcomes wait in the publication log of `refund-request` while Loyalty Points is off.
- The use-case trace for REFUNDS/UC-01, REFUNDS/UC-02, REFUNDS/UC-03, REFUNDS/UC-04, REFUNDS/UC-05 (merged into REFUNDS/UC-04), LOYALTY/UC-01, and LOYALTY/UC-02 (`16-references.md` § 19.9).

## 2.2 Out of Scope

- Everything SDD [§2.2](../sdd-refunds-platform/01-executive-summary-scope-risks.md#22-out-of-scope) excludes (broker, separate services, reporting store, manual points correction, mobile app, redeeming points).
- Provider-side contract fields still `TBD - external` (SDD [§15.6](../sdd-refunds-platform/11-api-contracts.md#156-external-contracts-awaiting-the-user)): the CardPay (API-01, API-02, API-07, API-09), MsgHub (API-03), POS Records (API-04, API-05), and platform IAM staff directory (API-08) adapters are specified up to our side of the contract; their wire mapping is filled when the documentation arrives.
- The design choices the SDD still holds open as markers and that would add states, entry points, or events once answered: a payout that can never succeed, items returned before approval, in-person requests, a second approval above an amount, the points effect of a payout sent back or of a dispute refunded by the bank (SDD [§17.1](../sdd-refunds-platform/13a-service-refund-request.md#business-logic), [§17.2](../sdd-refunds-platform/13b-service-payout.md#business-logic), [§17.4](../sdd-refunds-platform/13d-service-loyalty-points.md#business-logic)); the LLD builds the current answer and flags each.
- Infrastructure as code, the hosting service, CI/CD platform, and observability backends (SDD §6 open markers).
- Concrete runbook commands (no hosting service yet, SDD [§20](../sdd-refunds-platform/16-operations-runbook.md#20-operations-runbook)).

> **From-sdd note:** scope here is the implementation scope. It matches the SDD's: every SDD §13 module is covered.

---

# 3. Assumptions

The solution assumptions are SDD [§3 Assumptions](../sdd-refunds-platform/01-executive-summary-scope-risks.md#3-assumptions). Implementation assumptions added here:

| ID | Assumption | Source | Risk if false |
|----|------------|--------|---------------|
| A-01 | Each module connects with its own database role and its own `DataSource` and transaction manager, so a cross-schema statement fails at runtime (SDD ADR-06). | SDD ADR-06; LLD design | A shared role would let a cross-schema read pass silently; the ArchUnit rule is then the only guard. |
| A-02 | A listener's handling and the completion of its listener row cannot share one transaction (different roles and schemas), so completion is a separate transaction after the listener commits; listeners are idempotent. | SDD §11.1, ADR-06; LLD design | If one transaction were possible, a duplicate delivery window would disappear; the design is still correct, only less tight. |
| A-03 | One tenant is configured; the per-tenant job loop runs once per run. | SDD §3 assumption 1 | A second tenant multiplies job duration; batch sizes may need tuning. |
| A-04 | The UUIDv7 and the RFC 9562 version 5 generators are hand-written in the platform package (no new dependency). | AGENTS.md (new dependencies need approval); CLAUDE.md UUIDv7 | A bug in a hand-written generator; covered by unit tests against RFC 9562 test vectors. |
| A-05 | Spring Data JDBC and `JdbcClient`, Spring Security OAuth2 resource server, Micrometer, and Spring Boot Actuator are part of Spring Boot and need no approval. | SDD §6 Backend Runtime, Metrics rows | If the product owner counts a starter as new, the affected classes wait for approval. |
| A-06 | The product enablement settings are read at start and change only with a rolling restart, so the product-enablement guard and the listener registry read them once per process. | SDD §11.5 (no hot reload); LLD design | A hot reload would need the guard and the dispatcher to re-read the settings on every request and every dispatch. |

---

# 4. Glossary

Business and technical terms are in SDD [§5 Glossary](../sdd-refunds-platform/01-executive-summary-scope-risks.md#5-glossary), which links both BRD glossaries. LLD-only terms:

| Term | Definition | Source |
|------|------------|--------|
| Listener row | One `event_publication_listener` row: the delivery of one event to one listener, completed when that listener's transaction has committed. | new in LLD (SDD §11.1 table) |
| Dispatcher | `PublicationDispatcher`: hands the listener rows of a committed transaction to executor tasks right after commit. | new in LLD |
| Redelivery job | The per-publishing-module job that retries incomplete listener rows with backoff. | new in LLD (SDD §11.1) |
| Claim and lease | A job selects work rows with `FOR UPDATE SKIP LOCKED`, marks them `SENDING` with `lease_expires_at`, and commits before calling a provider; an expired lease makes the row claimable again. | SDD §17.2, §17.3 |
| Claim token | A new UUIDv7 written on a message at each claim; the lease renewal and the outcome write apply only while the message still holds it. | new in LLD |
| Payout round | One series of attempts of a payout under one idempotency key: round 1 uses the payout id, and each payment the customer's bank sends back starts a new round with a new UUIDv7 key (`payout_round`). | new in LLD (SDD §17.2 Send, Payout sent back) |
| Dispute copy | The `refund-request` copy of the card disputes `payout` reports, one row per dispute with its state and highest `sequence` (`card_dispute_copy`). | new in LLD (SDD §17.1 Boundaries) |
| Product-enablement guard | The platform interceptor that answers 404 `NOT_FOUND` on every endpoint of a product that is switched off, before the controller runs; the CardPay callbacks (API-02, API-09) are never switched off. | new in LLD (SDD §11.5) |
| `CallerContext` | The record every application service receives: tenant, subject, roles, permission tokens, `branch_id`, member identifier, or a module identity. | new in LLD |
| `@UseCase` | Project annotation on an SDD §7.3 entry point that sets the `use_case` log and span attribute. | new in LLD (`09-cross-cutting.md` § 12.8) |
| `*ServiceImpl` | The implementation of an inbound application port (`*Service`) of a module's domain. | CLAUDE.md naming |
| `*Adapter` | A class that implements a port against a transport or provider (hexagonal). | SDD §5 Adapter |
| `{problemBase}` | The configured base URI of Problem Details `type` values. | new in LLD |

<!-- MASTER: refunds-platform-lld-master.md | PREV: 00-metadata.md | NEXT: 02-context.md -->

# SDD Quality

The SDD has multiple high-value sections. This file captures the quality bar for the most easily-thinned ones: Architecture Style, Architectural Decisions, per-service Business Logic, Cross-Cutting Concerns, and Operations Runbook.

The principle is the same as `use-case-quality.md` in brd-unifier: substantive content, not template-shaped filler.

---

## §8.1 Architecture Style

The most-skimmed section in any SDD, and the one most often filled with platitudes.

### What

**Good:** Names a specific style with technical precision.

> Example: "Event-driven microservices with a Kafka async backbone for inter-service communication and gRPC for synchronous queries. Each service owns a private PostgreSQL schema; cross-service data access is by event subscription, not by direct DB access."

**Bad:**
- "Cloud-native modern architecture." (Meaningless.)
- "Microservices." (Good start, but tells you nothing about communication patterns or data ownership.)
- "Layered." (Layered *what*?)

**Test:** From the `What` alone, can a developer predict whether two services should communicate via REST, gRPC, Kafka, or shared DB? If not, rewrite.

### Why

**Good:** Connects to specific business and technical objectives.

> Example: "Kafka-first because (a) REFUNDS/NFR-04 requires graceful handling of payment-gateway downtime without losing transactions, satisfied by event sourcing + retry; (b) the system is multi-tenant with high write volume, where per-tenant ordering by key (Kafka partition) is a natural fit; (c) the platform standard per CLAUDE.md."

**Bad:** "Modern best practice." "Industry standard." Anything that doesn't tie back to a specific BRD objective or NFR.

### How

**Good:** Concrete bullets describing the style's manifestation.

> Example bullets:
> - **Bounded contexts:** wallet-core, reseller-management, reporting-aggregator (one per BRD use-case cluster / domain concept).
> - **Inter-service sync:** none. All cross-service reads are via subscribed event projections held locally.
> - **Inter-service async:** Kafka topics, named `<context>.<entity>.<event>` (e.g., `wallet.ledger.entry-recorded`).
> - **Data ownership:** each service has a private `app_<service>` PostgreSQL schema; no cross-schema reads.
> - **Deployment model:** one Helm chart per service, deployed to shared EKS cluster, namespace-per-tenant for production.

**Bad:** Vague aspirations ("services should be loosely coupled"). The `How` is the contract; concrete or it's nothing.

---

## §8.6 Infrastructure Architecture and §8.7 Network Architecture

An SRE, a security reviewer, or a deck reads these two sections to see where the system runs and how traffic reaches it and leaves it. They are worth reading only when every fact traces to a source and nothing is invented.

**Test:** pick any row of §8.6 or §8.7. Does it link the home of each fact it uses (a §6 row, an ADR, §11.2, §11.3, §11.6, a §12 row, §19, a BRD NFR or Technical Input as its keyed link, an eco-system file section, a locked Pre-SDD entry as its PSDD/<ID> link) instead of restating a technology, a version, or a default? Is every fact that no source states a `[NEEDS CLARIFICATION: ...]`, and every design choice that no source states labelled `recommended`, with its evidence stated in the row? Then pick any §12 row: does §8.7.3 show its egress path, or say why it has none (the system only calls the platform, or it is inside the platform's network)? Pick any BRD availability, disaster recovery, or data residency NFR: does §8.6 realise it, with its RPO and RTO derived from the NFR, cited from a loaded Pre-SDD, or flagged?

**Good rows** (one deployable on a managed container service whose hosting location no source names, and an imported eco-system file that states CardPay's network access):

| Concern | Design | Source |
|---|---|---|
| Regions or sites | **[NEEDS CLARIFICATION: Which cloud region or on-premises site hosts the deployable and its database? Owner: product owner.]** | No BRD Technical Input names the hosting, and [§6 Compute / Infra](./02-ecosystem-overview.md#6-ecosystem-overview) leaves it open |

| §12 row | System | Egress path | Provider requirement | Source |
|---|---|---|---|---|
| [INT-01](./08-integrations.md#12-integrations) | CardPay Ltd | NAT through one fixed egress address | An IP allow-list of the platform's egress address | [refunds-platform-eco-system.md § CardPay Ltd](../refunds-platform-eco-system.md#cardpay-ltd) |

**Bad:**

- An IP range, a CIDR, or a hostname that no source states, for example a made-up `10.0.0.0/16` for the application zone.
- A product name that no source chose, for example a named CDN or WAF vendor in the ingress path.
- A row that restates the §6 technology and version, the §11.6 TLS version, or a §12 timeout instead of linking it.
- An RPO or RTO figure that no BRD NFR implies and no loaded Pre-SDD locks.
- A §12 system with no §8.7.3 row, or a diagram node that no row names.

---

## §10 Architectural Decisions (ADRs)

The single biggest source of "looks structured but is empty" in SDDs.

**Good ADR row:**

| ID | Status | Decision | Why | How | Consequences | Alternatives & Trade-offs |
|---|---|---|---|---|---|---|
| ADR-03 | Accepted | Use Kafka for inter-service async messaging. | At-least-once delivery semantics + per-key ordering match the wallet ledger's append-only invariant. Platform standard per CLAUDE.md. | Single Kafka cluster (3 brokers, replication factor 3). Topics named `<context>.<entity>.<event>`. JSON Schema in confluent schema registry. Consumer idempotency mandatory. | Operational complexity (Kafka cluster management, schema evolution). Coupling to broker availability. | RabbitMQ rejected (no per-key ordering at scale). SNS+SQS rejected (we are on-prem). Direct REST chains rejected (creates synchronous fan-out fragility). |

**Bad ADR row:**

| ADR-03 | Accepted | Use Kafka. | Better than alternatives. | Run Kafka. | Some complexity. | Other things. |

**Test:** Could a senior engineer joining the team next year understand from this row alone (a) what was decided, (b) why, and (c) what would have to change to revisit the decision? If not, rewrite.

### Minimum ADR set per SDD

Always document at least:

1. Architecture style (per §8.1).
2. Primary message broker (or no broker).
3. Multi-tenancy strategy.
4. API style (REST / gRPC / GraphQL) per service or platform-wide.
5. Synchronous vs event-driven for cross-service interaction.
6. Database engine + per-service ownership rules.
7. Authentication mechanism (Keycloak realm strategy or equivalent).

If any of these are unstated, that's a gap, not a non-decision.

---

## §17.X per-service Business Logic

Each service spec's Business Logic is where the SDD earns its keep.

### Good Business Logic

- Names the responsibility in one sentence.
- For stateful services, includes a state machine with named states, transitions, and triggers.
- Describes the dominant operations (commands, queries, projections) at the level a senior developer can scaffold the code.
- Names the cross-cutting concerns the service participates in (audit logging, tenant isolation, idempotency).

### Bad Business Logic

- One paragraph that paraphrases the use case's Main Flow. (The SDD's Business Logic should add design specificity, not restate the use case.)
- A bulleted list with three items each starting "The service shall..."
- Lacks a state machine for a service that's clearly stateful (any service named *-management, *-workflow, *-lifecycle).
- "See REFUNDS/UC-04 in the BRD." (The SDD must stand alone for the engineering team. Cite the use case, keyed and linked, but don't outsource your section.)

**Test:** Can a developer scaffold this service's controller layer and core domain types from this section alone? If not, rewrite.

---

## §11 Cross-Cutting Concerns (defaults)

Every row should have a concrete value, not a wave-of-the-hand.

| Concern | Bad | Good |
|---|---|---|
| **DB Engine** | "Relational database." | "PostgreSQL 17+ (LTS), HA via Patroni with 1 sync replica + 2 async replicas." |
| **PK strategy** | "UUIDs." | "UUIDv7, generated at the service layer (not DB-side), to preserve time-ordering for index efficiency." |
| **Multi-tenancy** | "Multi-tenant." | "Default: shared schema with `tenant_id`. Override: schema-per-tenant for high-volume services (wallet-core, reporting-aggregator). Cross-tenant queries forbidden at the application layer; enforced via row-level-security in shared-schema services." |
| **Logging** | "Structured logs." Or field names with no meaning: "fields: `service`, `module`, `trace_id`", where a reader cannot tell whether `module` is the emitting or the calling module. | "JSON, fields: `ts`, `level`, `service` (the emitting service), `module` (the module that emits the line; absent on framework lines), `trace_id`, `span_id`, `tenant_id` (never PII), `event`, `attrs`. Aggregated to Loki, retained 30 days hot / 1 year cold." |
| **Service-to-service auth** | "JWT or mTLS." | "mTLS via Istio for service-to-service. JWTs (Keycloak-issued) for external traffic only, validated at the API gateway. Internal service-to-service does not validate JWTs." |

**Test:** Can an SRE setting up monitoring or a security engineer doing a review get specific actionable rules from this section, or is it filler?

---

## §18 Performance & Capacity

The most-often-empty section, and the one most likely to bite an SRE later.

### Throughput Targets per service

Each service must have:

- Sustained RPS (the level the service handles 99% of the time).
- Peak RPS (the level the service must handle without degradation).
- p50, p95, p99 latency targets at sustained load.

If any of these are unknown, that's a `[NEEDS CLARIFICATION: ...]`, not "TBD" and not a hand-wave.

### Peak Scenarios

For each peak scenario:

- The trigger (specific event: "month-end batch", "marketing campaign launch", "supplier outage retry storm").
- The expected multiplier on baseline load (3x, 10x, 50x).
- The duration (15 minutes, 4 hours, 24 hours).
- The mitigation (autoscale, throttle, queue, degrade gracefully; be specific).

**Bad:** "System should handle peak loads with appropriate scaling."

**Good:** "Month-end batch reconciliation: 5x sustained RPS for 4 hours, mitigated by horizontal autoscale (HPA target 70% CPU, max 12 replicas) plus per-tenant rate limit (100 RPS)."

---

## §20 Operations Runbook

The runbook is the single most-tested artefact during incidents. Empty runbook procedures cost time when an engineer is paged at 03:00.

### Good runbook procedure

```text
Restart wallet-core service (single replica)
1. Confirm there is no active deploy in progress: `kubectl rollout status deployment/wallet-core -n prod`. If a rollout is in progress, do NOT restart manually.
2. Identify the failing pod: `kubectl get pods -n prod -l app=wallet-core --field-selector=status.phase!=Running`.
3. Capture last 200 log lines for post-incident: `kubectl logs <pod-name> -n prod --tail=200 > /tmp/wallet-core-incident-<timestamp>.log`.
4. Delete the pod: `kubectl delete pod <pod-name> -n prod`. Kubernetes will reschedule.
5. Verify health: `curl https://wallet-core.prod.internal/actuator/health`. Expect `{"status":"UP"}` within 30 seconds.
6. If health does not return UP, escalate to the on-call architect; check #wallet-incidents for context.
```

### Bad runbook procedure

```text
1. Identify failing pod
2. Restart it
3. Verify health
4. Escalate if needed
```

**Test:** Could an on-call engineer who has never worked on this service successfully execute the procedure at 03:00 with no help, given only this runbook? If not, rewrite.

---

## §14 Centralized Event Hub (and §15 API Contracts, §16 Roles, §24 E2E)

The platform catalogues are only useful if they are **reconciled**: a catalogue that drifts from the per-service chunks is worse than none, because implementers will trust it.

**Test (event hub):** pick any event in a §17.X consumed table. Is it in the §14.5 catalog with the same name, on the same topic, published by exactly one service, with every payload field the consumer relies on present in §14.9? Pick any producer's published table: does its consumer list equal the union of the consumers' consumed tables? In a modular monolith or hybrid core, pick any event in a module's in-process table: does it match §14.10 by name, publisher module, listener modules, and DTO fields, from both sides? If any check fails and the divergence is not flagged in §14.8 with Status `Open`, the chunk is below the bar.

**Test (roles):** pick any permission token in a §17.X authorization note. Is it in the §16.11 grid with the same spelling and the same role set? Does every capability row trace to a BRD UC or an ADR (§16.10)?

**Test (API contracts):** pick any synchronous domain or provider row (not standard operational infrastructure, SKILL.md step 6a) in a §17.X Integrations table. Does it carry an `API-NN` that exists in §15.2? For an HTTP contract: are method and URI identical to the service's List of APIs, and does the contract state URI, version, security and auth (a §16 permission token on an internal contract, per §15.1 Authorization by contract type), headers, parameters, body with a sample, responses, error codes with retryability, and behaviour (idempotency, timeout, retries)? For an `Internal (in-process)` contract: does it state the port interface, operation, request and response DTOs, the errors it raises (each mapped to an `errorCode`), the permission token, and its behaviour (idempotency and transaction), with no invented method or URI? For an external system: are the provider-owned fields `TBD` with a `[TBD - EXTERNAL: ...]` marker instead of plausible invented values, and does the contract name its stand-in and the BRD phase the provider facts are needed by? Then pick any operation, and each value of an enum that selects its behaviour: is every datum it needs a named field, and does each request field say where the caller gets it? Pick any §7.3 row whose use case needs a capability: is that use case's service listed in the Consumer (caller) cell of the capability's `API-NN` in §15.2?

**Good API contract:** "API-04 `POST /v1/wallets/{walletId}/debits`, OAuth2 client credentials, token `wallet:debit`; `Idempotency-Key` required; body `amount` (decimal, > 0, scale 2), `currency` (ISO 4217); 201 returns `debitId`; 409 `CONFLICT` on key reuse, 422 `INSUFFICIENT_FUNDS` (not retryable); timeout 800 ms, 2 retries on 503/504 with jitter."

**Bad API contract:** "Payment service calls wallet service to debit the wallet via REST." No URI, no auth, no body, no errors: an OI, not a contract.

**Also bad:**

- A command DTO whose `action` enum has a `CANCEL_LINE` value but no field naming the line to cancel.
- Inputs described in prose ("untrusted text, marked and schema-validated") instead of fields.
- A field such as `inReplyTo` whose value no stored column, event field, or caller input supplies.
- A capability that three services need, with only the two callers its contract text named in its §15.2 Consumer (caller) cell.

**Test (e2e):** do the counts in §24 "Counts at a Glance" match §13 (services), §14.4 (topics), §14.9 coverage (events), and §14.10 (in-process domain events) exactly? Is every deliberate simplification listed under "no silent caps"? Do §24.2 and §24.3 cite §8.2 and §8.3 and draw only what those do not show?

**Bad:** a §14.5 catalog that lists only the events the author remembered, with consumer columns copied from producer chunks without checking the consumers' own tables.

---

## §7.3 Use Case Traceability (derive-from-BRD)

Traceability is only useful if a reader can follow it both ways without searching.

**Test:** pick any BRD use case. Its ID in the SDD names its source BRD (the key) and one click opens its heading in that BRD. From its §7.3 row you reach these places: the owner's `13x` chunk, the endpoint that starts it, the diagram that shows it, and the API contracts and events it drives. Each of those places cites the same keyed use case. Then pick any service in 09: every use case in its `Use cases (BRD)` cell has a §7.3 row naming that service, and its Business Logic cites each one with the steps it realises. Last, pick any acceptance criterion or business rule the owner's Business Logic cites that names data (who changed a value, the old and new values): does each data item map to a field in the serving contract (an `API-NN`, a List of APIs response, or an event payload) and to a column in the owner's Tables Design?

**Good rows:**

| Use case (BRD) | Title | Owner (§17.X) | Entry points | Flows (§8.4 / §8.5) | APIs (§15) | Events (§14) | Status |
|---|---|---|---|---|---|---|---|
| **[Refunds Portal v1.0](../brd-refunds-portal/refunds-portal-brd-master.md) (REFUNDS)** | | | | | | | |
| [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | Approve / Reject Refund | [refund-service](./13b-service-refund.md) | `POST /v1/refunds/{refundId}/decision` | [§8.5.2](./05-workflows-and-sequences.md#852-sequence-refund-decision-and-payout) | API-03 | `REFUND_APPROVED`, `REFUND_REJECTED` | Active |

**Bad:**

- `UC-04 | refund-service | see §17.2`: no key, no link, no entry point, and nothing to check against.
- `[UC-04](...)` in an SDD with two source BRDs: a reader cannot tell which BRD's UC-04 it is.
- Ownership only in prose ("refund-service handles UC-04 and UC-05"), with no 09 column or §7.3 row.
- A link built from a guessed title (`#uc-04-approve-reject-refund` when the heading is `UC-04: Approve / Reject Refund`, whose anchor is `#uc-04-approve--reject-refund`). It looks right and lands nowhere.
- A new `UC-12` the SDD made up for key rotation. The SDD cites BRD use cases; it never adds one.
- An acceptance criterion that asks for the admin identity and the old and new values, served by a history response that carries only the new value, with no open item or marker.

---

## §6 Ecosystem Overview

A reader must see at a glance which stack rows are settled and where each one came from.

**Test:** pick any §6 row. Does it carry a Status and a Source (SKILL.md step 3c items 1 and 6)? A table written before those columns keeps the label in its Notes and is read as it is (SKILL.md step 10). Do its Notes hold the evidence the Source names: the BRD Technical Input as a keyed link, the eco-system file section, the locked Pre-SDD entry as its PSDD/<ID> link, or the ADR? In a finished first build, is every `Proposed` row the one exception step 3c item 6 allows, with its marker (a table written before those columns is read as it is)? Then pick any system in §12: does the Integration landscape have its row, and does that row link §12 instead of repeating its protocol, auth, or timeouts? Last, pick any library, SDK, or framework that a design text relies on (a §11 policy, a `13x` adapter, an ADR): does it have a §6 row, or sit in the Notes of a named layer such as Backend Runtime, with its version? A name with neither a §6 place nor a `Proposed` label and a `[NEEDS CLARIFICATION: ...]` marker is a finding.

**Good rows:**

| Layer | Technology / Service | Version / Tier | Status | Source | Notes |
|---|---|---|---|---|---|
| Primary RDBMS | PostgreSQL | 17+ | Confirmed | BRD-mandated (REFUNDS) | [REFUNDS 12 TI-02](../brd-refunds-portal/12-appendix-and-wishlist.md#technical-inputs-for-the-sdd): "Use PostgreSQL for all data."; the version is the stack default |

| System | Owner (role) | Role in the eco-system | Interface style | Spec source | §12 row |
|---|---|---|---|---|---|
| CardPay Ltd | The provider's integration team | Payment provider | Synchronous API and callback | [refunds-platform-eco-system.md § CardPay Ltd](../refunds-platform-eco-system.md#cardpay-ltd) | [INT-01](./08-integrations.md#12-integrations) |

**Bad:**

- A Source that reads `default` without saying whose default it is (`project default` or `skill default`), or a source that appears only in prose.
- A `Proposed` row in a finished first build with no marker and no reason.
- An Integration landscape row that repeats an auth scheme or a timeout that §12 states.
- A value taken from an eco-system file the user did not choose to import, or a provider field the file does not state.
- An AI adapter policy in §11 that names a client library §6 does not list and no row labels `Proposed`.

---

## Project-file rules (the whole SDD)

A rule in a project file (`AGENTS.md`, `CLAUDE.md`, `ui-ux-global-constitution.md`) binds every chunk, not only §6. SKILL.md principle 19 states the rule; this is the bar.

**Test:** pick any rule or convention in a project file. Find each chunk it touches. Does the chunk follow it, or does an open item carry the difference? Then pick any open item that names a project file: does it give the file and its section, the source and where it says the opposite, two options, a Recommended Answer, and a Why, while the SDD text still reads as the source states it?

**Good:**

- A design choice that follows a project rule names the file, and its section by name when it has one: "no cross-schema reads (AGENTS.md § Data ownership)".
- A project rule that a BRD Technical Input contradicts is one open item: "Where: §6, Database row. Concern: AGENTS.md § Data stores allows MySQL only; [REFUNDS 12 TI-02](...) mandates PostgreSQL for all data. Options: A keep the BRD mandate; B follow the file, with an ADR for overriding the BRD mandate (SKILL.md step 3c item 5). Recommended Answer: A. Why: ..."

**Bad:**

- A §6 row that follows either side of a conflict between a project file and a BRD Technical Input, with no open item: a silent pick of one side.
- A rule applied in one chunk and broken in another, for example a topic naming convention used in chunk 10 and ignored in a `13x` Event Model.
- A color or font copied as a raw value where the constitution defines a token: cite the token by name.
- A question to the user for a file the project does not have, or for a rule a project file already states.

---

## When to defer to flags vs to write

If the SDD is being **derived from a BRD** (per `brd-to-sdd.md`), the architect hasn't yet made many of the decisions these sections require. In that case, the architecture questionnaire settles §8.1 and the ADRs it covers, which meet the bar above. The decisions still open come out as `[NEEDS CLARIFICATION: ...]` markers, *not* as low-quality filler. Empty-with-flag is correct; thin-with-words is not.

If the SDD is being **transformed from another SDD format**, or is an SDD generated without a BRD before every new SDD needed one (SKILL.md step 2), the quality bar above applies in full.

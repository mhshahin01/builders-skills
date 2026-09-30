# SDD Quality

The SDD has multiple high-value sections. This file captures the quality bar for the most easily-thinned ones — Architecture Style, Architectural Decisions, per-service Business Logic, Cross-Cutting Concerns, and Operations Runbook.

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
| **Logging** | "Structured logs." | "JSON, fields: `ts`, `level`, `service`, `trace_id`, `span_id`, `tenant_id` (never PII), `event`, `attrs`. Aggregated to Loki, retained 30 days hot / 1 year cold." |
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

If any of these are unknown, that's a `[NEEDS CLARIFICATION: ...]` — not "TBD" and not a hand-wave.

### Peak Scenarios

For each peak scenario:

- The trigger (specific event — "month-end batch", "marketing campaign launch", "supplier outage retry storm").
- The expected multiplier on baseline load (3x, 10x, 50x).
- The duration (15 minutes, 4 hours, 24 hours).
- The mitigation (autoscale, throttle, queue, degrade gracefully — be specific).

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
5. Verify health: `curl https://wallet-core.prod.internal/actuator/health` — expect `{"status":"UP"}` within 30 seconds.
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

The platform catalogues are only useful if they are **reconciled** — a catalogue that drifts from the per-service chunks is worse than none, because implementers will trust it.

**Test (event hub):** pick any event in a §17.X consumed table. Is it in the §14.5 catalog with the same name, on the same topic, published by exactly one service, with every payload field the consumer relies on present in §14.9? Pick any producer's published table: does its consumer list equal the union of the consumers' consumed tables? In a modular monolith or hybrid core, pick any event in a module's in-process table: does it match §14.10 by name, publisher module, listener modules, and DTO fields, from both sides? If any check fails and the divergence is not flagged in §14.8 with Status `Open`, the chunk is below the bar.

**Test (roles):** pick any permission token in a §17.X authorization note — is it in the §16.11 grid with the same spelling and the same role set? Does every capability row trace to a BRD UC or an ADR (§16.10)?

**Test (API contracts):** pick any synchronous row in a §17.X Integrations table. Does it carry an `API-NN` that exists in §15.2? For an HTTP contract: are method and URI identical to the service's List of APIs, and does the contract state URI, version, security and auth (a §16 permission token on an internal contract, per §15.1 Authorization by contract type), headers, parameters, body with a sample, responses, error codes with retryability, and behaviour (idempotency, timeout, retries)? For an `Internal (in-process)` contract: does it state the port interface, operation, request and response DTOs, the errors it raises (each mapped to an `errorCode`), and the permission token, with no invented method or URI? For an external system: are the provider-owned fields `TBD` with a `[TBD - EXTERNAL: ...]` marker instead of plausible invented values?

**Good API contract:** "API-04 `POST /v1/wallets/{walletId}/debits`, OAuth2 client credentials, token `wallet:debit`; `Idempotency-Key` required; body `amount` (decimal, > 0, scale 2), `currency` (ISO 4217); 201 returns `debitId`; 409 `CONFLICT` on key reuse, 422 `INSUFFICIENT_FUNDS` (not retryable); timeout 800 ms, 2 retries on 503/504 with jitter."

**Bad API contract:** "Payment service calls wallet service to debit the wallet via REST." No URI, no auth, no body, no errors: an OI, not a contract.

**Test (e2e):** do the counts in §24 "Counts at a glance" match §13 (services), §14.4 (topics), and §14.9 coverage (events) exactly? Is every deliberate simplification listed under "no silent caps"?

**Bad:** a §14.5 catalog that lists only the events the author remembered, with consumer columns copied from producer chunks without checking the consumers' own tables.

---

## §7.3 Use Case Traceability (derive-from-BRD)

Traceability is only useful if a reader can follow it both ways without searching.

**Test:** pick any BRD use case. Its ID in the SDD names its source BRD (the key) and one click opens its heading in that BRD. From its §7.3 row you reach the owner's `13x` chunk, the endpoint that starts it, the diagram that shows it, and the API contracts and events it drives, and each of those places cites the same keyed use case. Then pick any service in 09: every use case in its `Use cases (BRD)` cell has a §7.3 row naming that service, and its Business Logic cites each one with the steps it realises.

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

---

## When to defer to flags vs to write

If the SDD is being **derived from a BRD** (per `brd-to-sdd.md`), the architect hasn't yet made many of the decisions these sections require. The architecture questionnaire settles §8.1 and the ADRs it covers, which meet the bar above; the decisions still open come out as `[NEEDS CLARIFICATION: ...]` markers — *not* as low-quality filler. Empty-with-flag is correct; thin-with-words is not.

If the SDD is being **generated fresh** or **transformed from another SDD format**, the quality bar above applies in full.

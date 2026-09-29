# Pattern Rules — CLAUDE.md design rules → triggering conditions

This file maps the user's CLAUDE.md design defaults to **triggering conditions** that the skill uses to decide whether a pattern applies in a given service.

It is used in two directions:

- **FROM-SDD:** when a triggering condition is met (e.g., a service emits state-changing events), the corresponding pattern is *applied proactively* to the LLD with the rule attribution.
- **FROM-CODE:** the same conditions are used as detection heuristics — if code matches the structural fingerprint, the pattern is *recognised* and documented.

---

## How patterns appear in the LLD

Per `chunks/04-implementation-template.md` § 7.4, every applied pattern carries:

1. **Pattern name.**
2. **Triggering CLAUDE.md rule** (verbatim quote).
3. **Roles** — which classes/methods play which part.
4. **Rationale** — one-line specific to this service.
5. **Mermaid class diagram** — pattern structure.
6. **Pseudocode skeleton** — key methods.
7. (FROM-CODE) confidence flag if pattern detection used semantic heuristics.

---

## Mandatory patterns (CLAUDE.md hard rules)

These patterns MUST be applied in any service whose conditions match. From-sdd: applied unconditionally. From-code: missing pattern → `⚠ drift` with HIGH severity in hybrid mode.

### Outbox

**CLAUDE.md rule:** *"Outbox pattern is mandatory for any state change that must produce an event. No dual-writes to DB and Kafka."*

**Triggering condition:** the service emits one or more events (Kafka, SNS, etc.) as a result of a state-changing operation (insert, update, delete on a domain aggregate).

**FROM-SDD detection:** the SDD's per-service Event Model lists ≥1 event with the service as producer.

**FROM-CODE detection:** structural. Recognise the Outbox only when both hold, each cited with file:line:

1. **Atomic write:** the service inserts a durable outbox record (an `outbox` table in its own schema) in the same local transaction as the aggregate change, so both commit or neither does.
2. **Separate publisher:** a component outside that transaction reads committed outbox records and publishes them to the broker (a scheduled poller by default; a CDC relay on the outbox table also qualifies).

A `KafkaTemplate.send` (or equivalent) beside a repository write is never evidence of an Outbox, whether it runs inside the transaction or after commit. Without the atomically written record it is a direct dual-write: report it under § Anti-patterns to flag.

**Roles:**
- Outbox table (in service schema).
- Outbox writer (inside the same tx as the aggregate write).
- Outbox publisher (separate from the writing tx; scheduled job by default, one active instance per service).

**Delivery contract** (the publisher the LLD specifies, and its pseudocode skeleton):
- A record is marked processed only after the broker acknowledges the send (`acks=all`). The acknowledgement check is a visible step in the pseudocode, before `markProcessed`.
- A failed or timed-out send leaves the record unprocessed, so the next poll retries it. It is never marked processed or deleted.
- Duplicates are expected. If the broker acknowledges but the processed update fails (database error, or a crash before the update), the record is still unprocessed and the next poll publishes it again. A failed or timed-out send may also have reached the broker. The payload, including `eventId`, is fixed when the record is written, so a re-send is identical and consumers dedupe it (`chunks/07-event-contracts.md` § 10.4).
- From-code mode documents the publisher as the code behaves. A breach of this contract stays visible in the skeleton and is flagged per § Anti-patterns to flag; the skeleton is never rewritten to comply.

### Idempotency (on money / wallet / notification / external-provider write endpoints)

**CLAUDE.md rule:** *"Idempotency keys on all write endpoints touching money/wallet/notifications or external providers."*

**Triggering condition:** the service exposes a write endpoint that touches money, wallet, notifications, or calls an external provider.

**FROM-SDD detection:** the SDD's per-service API list includes a `POST/PUT/PATCH/DELETE` endpoint whose name or summary mentions money / wallet / notification / payment / send / charge / transfer.

**FROM-CODE detection:** structural — look for `@RequestHeader("Idempotency-Key")` parameter on the controller method, AND an `idempotency_record` table OR equivalent dedup store.

**Roles:**
- Idempotency record table.
- Idempotency check (controller or interceptor).
- Cached-response storage.

### RFC 9457 ProblemDetails error model

**CLAUDE.md rule:** *"Global @RestControllerAdvice, Problem Details (RFC 9457). Business exceptions extend a base ServiceException with error code."*

**Triggering condition:** any service with a REST surface (always, in this user's stack).

**FROM-SDD detection:** any service in the SDD with a non-empty API list.

**FROM-CODE detection:** look for `@RestControllerAdvice` + `ProblemDetail` (Spring Framework 6+) OR a custom error envelope plus a `ServiceException` base class.

**Roles:**
- Base exception (`ServiceException`).
- Per-domain subclasses with error codes.
- `@RestControllerAdvice` translator.

### Outbox Saga (cross-service transactions)

**CLAUDE.md rule:** *"Sagas (choreography by default, orchestration when the flow is complex or needs central visibility) for cross-service business transactions. No distributed 2PC."*

**Triggering condition:** any cross-service business transaction (a single business operation spanning ≥2 services).

**FROM-SDD detection:** the SDD's Workflows section describes a flow that crosses services and modifies state in each.

**FROM-CODE detection:** structural — look for orchestrator services with explicit step+compensate methods, OR choreography-style listeners that react to upstream events with conditional state transitions.

**Roles (orchestration variant):** Orchestrator + Steps + Compensations.

**Roles (choreography variant):** Each service is a self-contained step; ordering is implicit in event flow.

### Constructor injection, no field injection

**CLAUDE.md rule:** *"Constructor injection only, no field injection."*

**Triggering condition:** any Spring component (`@Service`, `@Component`, `@RestController`, `@Configuration`).

**FROM-SDD detection:** always applied; mentioned in `04-implementation/<service>.md` § 7.5 DI Graph.

**FROM-CODE detection:** check for absence of `@Autowired` on fields. Any presence is a `⚠ drift` flag.

### Records for DTOs

**CLAUDE.md rule:** *"Records for DTOs."*

**Triggering condition:** any service exposing REST/event DTOs.

**FROM-SDD detection:** always applied; DTO types listed in `04-implementation/<service>.md` § 7.2 Domain Types as `record`.

**FROM-CODE detection:** check class declarations matching `*Dto`, `*Request`, `*Response`. Non-record types here are `⚠ drift` flag.

### Multi-tenancy enforcement (every shared-schema index includes tenant_id)

**CLAUDE.md rule:** *"Schema-per-tenant for high-volume services, shared-schema with tenant_id for low-volume. Every index in shared-schema includes tenant_id. Never log tenant_id, reseller_id, or PII at INFO level."*

**Triggering condition:** any service with persistent storage.

**FROM-SDD detection:** SDD §11 Cross-Cutting + per-service Multi-Tenancy Specifications.

**FROM-CODE detection:** Flyway migrations enumerated; check that every CREATE INDEX on a shared-schema table includes `tenant_id` as the leading column. Missing → `⚠ drift` HIGH severity.

### Resilience4j (timeouts + retry + circuit breaker + bulkhead) on downstream provider calls

**CLAUDE.md rule:** *"Resilience defaults: timeouts, retries with exponential backoff and jitter, circuit breakers (Resilience4j), bulkheads for downstream provider calls (e.g., eSIM, payment, SMS)."*

**Triggering condition:** any service that calls an external system (Integrations table in SDD §12).

**FROM-SDD detection:** `09-cross-cutting.md` § 12.3 + per-call config in `04-implementation/<service>.md`.

**FROM-CODE detection:** structural — look for `@CircuitBreaker`, `@Retry`, `@Bulkhead`, `@TimeLimiter` annotations OR programmatic Resilience4j use.

---

## Discretionary patterns ("use the right pattern, do not over-engineer")

CLAUDE.md says: *"Use the right pattern, do not over-engineer. Strategy for runtime variants, Factory Method for object creation hierarchies, Mediator to decouple peers, Chain of Responsibility for pipelines."*

These are **discretionary** — applied only when the triggering condition is genuinely present.

### Strategy

**Triggering condition:** runtime variants of the same operation, selected by an enum / role / tenant tier / config flag.

**FROM-SDD detection:** the SDD's per-service Business Logic mentions tier-specific / type-specific behaviour without enumerating the variants in a single switch-style algorithm.

**FROM-CODE detection:** an interface with multiple implementations + a context class (or `Map<Enum, Strategy>`) that selects one at runtime.

### Factory Method

**Triggering condition:** object creation hierarchies — multiple constructor paths that should be encapsulated.

**FROM-SDD detection:** mentions like "create a foo of type X" with multiple types.

**FROM-CODE detection:** a class with `static create*` or `newInstance` methods returning the abstract type.

### Mediator

**Triggering condition:** ≥3 peer components that need to communicate without each knowing the others.

**FROM-SDD detection:** workflows where multiple components produce / consume events on a central topic without direct coupling.

**FROM-CODE detection:** a single class that all peers inject + delegate to (often a `*Coordinator`, `*Mediator`, or `EventBus`-style class).

### Chain of Responsibility

**Triggering condition:** a pipeline of handlers, each able to handle or pass to the next.

**FROM-SDD detection:** workflows with explicit pre-processing / validation / enrichment stages.

**FROM-CODE detection:** ordered list of handlers with `boolean canHandle(...)` + `Result handle(...)` interface, traversed in registration order.

### Template Method

**Triggering condition:** a workflow with stable structure but variable steps per case.

**FROM-CODE detection:** abstract base class with `final` workflow method calling abstract step methods overridden by subclasses.

### Facade

**Triggering condition:** a complex subsystem with many entry points that benefits from a single simplified interface.

**FROM-CODE detection:** a class that delegates to multiple downstream services to fulfil a single use case.

### Composition over inheritance

**CLAUDE.md rule:** *"Composition over inheritance."* This is a *guideline*, not a pattern slot. Surface it in `04-implementation/<service>.md` § 7.5 DI Graph by showing collaboration via injected dependencies rather than class hierarchies.

---

## Anti-patterns to flag (FROM-CODE direction)

The skill should surface these in `15-open-questions.md` as drift markers when found:

| Anti-pattern | CLAUDE.md rule violated | Severity |
|--------------|------------------------|----------|
| Field injection (`@Autowired` on fields) | "Constructor injection only" | MEDIUM |
| DTO classes (not records) | "Records for DTOs" | LOW |
| Direct dual-write: a database write plus a broker send in one operation with no outbox record written in the same transaction (send inside the transaction or after commit) | "No dual-writes to DB and Kafka" | HIGH |
| Outbox record written outside the aggregate's transaction (`REQUIRES_NEW`, after commit) | "Outbox pattern is mandatory" | HIGH |
| Outbox publisher marks a record processed without a successful broker acknowledgement (fire-and-forget send, or update before the acknowledgement) | "Outbox pattern is mandatory" | HIGH |
| Missing idempotency on money endpoints | "Idempotency keys on all write endpoints touching money..." | HIGH |
| Synchronous chained REST > 1 hop | "No service-to-service chained REST calls more than one hop deep" | MEDIUM |
| Distributed 2PC / `XA` transactions | "No distributed 2PC" | HIGH |
| Cross-service shared DB schema | "A service's database is private" | HIGH |
| Cross-tenant query without tenant_id filter | "Cross-tenant queries forbidden at the application layer" | HIGH |
| Logging tenant_id / PII at INFO | "Never log tenant_id, reseller_id, or PII at INFO level" | HIGH |
| Schema migration that's not additive | "Backward compatibility on Kafka schemas: additive changes only" | HIGH |
| Stack traces in error responses | "Errors are actionable; never expose stack traces or raw codes" | MEDIUM |
| Missing health/readiness endpoint | "Every service exposes: ... health and readiness endpoints" | MEDIUM |

Each anti-pattern, if detected, surfaces as a row in `15-open-questions.md` with the severity above.

---

## Rationale templates (for from-sdd application)

When applying a pattern in from-sdd direction, the rationale should be specific to the service. Here are templates for common cases — the skill substitutes the service-specific bits:

- **Outbox:** "State changes in `[aggregate]` emit `[event-name]` events to downstream consumers `[consumer-list]`. Direct dual-write to DB+Kafka would risk inconsistency on failure. The outbox row commits in the same transaction as the state change, and a separate publisher delivers it at least once, marking it processed only after the broker acknowledges."
- **Strategy:** "[Operation] differs per `[discriminator]` (`[variant-list]`). Hard-coding the variants in a single method would couple new-variant addition to a code change in `[ContextClass]`. Strategy decouples each variant into its own class, picked at runtime by `[discriminator]`."
- **Saga (choreography):** "The `[business-flow]` flow modifies state in `[svc-A]` and `[svc-B]`. Distributed 2PC is forbidden by CLAUDE.md; choreography saga is the default — `[svc-A]` emits `[event-1]`, `[svc-B]` reacts and emits `[event-2]`. Compensation actions documented in each service's workflow section."
- **Saga (orchestration):** "The `[business-flow]` flow has `[N]` steps with conditional branching at step `[K]`. Choreography would require each service to know the state of `[branch-condition]`; orchestration via `[OrchestratorService]` keeps that knowledge centralised. Each step has a documented compensation."
- **Resilience4j on a downstream call:** "Calls to `[external-system]` may fail; per CLAUDE.md, every external-provider call has timeouts, retry with backoff+jitter, circuit breaker, and bulkhead. Bulkhead size `[N]` chosen to bound concurrent calls and prevent thread starvation under provider slowdowns."

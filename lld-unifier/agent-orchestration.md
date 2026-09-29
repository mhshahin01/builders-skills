# Agent Orchestration — code-explorer + docs-architect

This file gives the dispatch templates for the two specialist agents the skill orchestrates in FROM-CODE and HYBRID directions.

The skill itself does **not** read source code. It dispatches agents that do, then template-fits their output.

---

## Agent 1 — `feature-dev:code-explorer`

**Role:** structural discovery. Maps the codebase. Output is *evidence*, not narrative.

### Dispatch template

When invoking via the Agent tool with `subagent_type: feature-dev:code-explorer`:

```text
description: Discover code structure for LLD generation

prompt: |
  I'm generating an LLD (Low-Level Design Document) for the codebase at:

  TARGET PATH: <absolute path or repo path>

  <If applicable>
  RELATED SDD: <path>
  Use the SDD's service vocabulary when naming services in your output.

  Please produce a STRUCTURAL DISCOVERY REPORT covering:

  1. **Entry points** — controllers (`@RestController`), event listeners (`@KafkaListener`, `@RabbitListener`, `@JmsListener`), schedulers (`@Scheduled`), CLI mains. One row per entry point with: file:line, the trigger (HTTP method + path / topic / cron), the entry-point class.

  2. **Service decomposition** — modules / packages / projects that constitute distinct services. List with: service name (slug), root path, build tool (Maven / Gradle / npm), main class.

  3. **Call graph (per service)** — controller → service interface → service-impl → repository → external calls. Document with file:line citations. Mermaid `graph LR` per service if helpful.

  4. **Class & interface inventory (per service)** — controllers, service interfaces, service impls, repositories, domain types (records, entities). Method signatures (full Java signature including parameter types and return type).

  5. **Database schema (per service)** — Flyway migrations enumerated (`src/main/resources/db/migration`). Per migration: version, purpose, tables created/altered. Per table: columns with types and constraints; indexes (with WHERE clauses if partial); FK relationships.

  6. **Kafka topology** — per service: topics produced (look for `KafkaTemplate.send`, outbox writes), topics consumed (look for `@KafkaListener`). Per topic: name, key strategy, partition count if discoverable, schema reference if found.

  7. **REST contracts (per service)** — per controller method: HTTP method, path (combining class-level `@RequestMapping` + method-level), request body type, response body type, status codes, auth (`@PreAuthorize` expression), idempotency-key handling (`@RequestHeader("Idempotency-Key")` presence).

  8. **Cross-cutting hooks** — interceptors (`HandlerInterceptor`), aspects (`@Around`), filters (servlet filters), guards (Spring Security `@Configuration`). Per hook: scope (which paths/methods), purpose (auth / tenant / logging / rate-limiting / audit).

  9. **Structural pattern detection** — apply heuristics:
     - **Strategy candidate:** interface with multiple impls + a context class that holds one of them (often as `Map<Enum, Strategy>`).
     - **Factory Method candidate:** static factory methods returning interface types.
     - **Chain of Responsibility candidate:** ordered list of handlers with a shared interface (`canHandle` + `handle`).
     - **Mediator candidate:** single class injected by multiple peers, delegating cross-peer communication.
     - **Saga orchestrator candidate:** service class with explicit step methods + compensating step methods.
     - **Outbox candidate:** only when (a) the outbox row is inserted in the same database transaction as the aggregate write (check propagation: `REQUIRES_NEW` or an after-commit hook breaks this), and (b) a separate publisher (scheduled poller, or CDC relay on the outbox table) publishes committed rows. Also report whether the publisher marks a row processed only after a successful broker acknowledgement. A `KafkaTemplate.send` beside a repository write is not an Outbox candidate, inside the transaction or after commit; list it under § 13.
     For each detection: name the pattern, list the participating classes with file:line, and rate confidence (high if structurally clean, medium if heuristic-based).

  10. **Resilience4j config (per call)** — `@CircuitBreaker`, `@Retry`, `@Bulkhead`, `@TimeLimiter` annotations or programmatic `CircuitBreakerRegistry` usage. Per call: which downstream provider, which policies applied, threshold values.

  11. **Observability hooks (per service)** — `@Timed`, `@Counted`, `MeterRegistry` calls. Per metric: name, labels, type (counter / gauge / histogram).

  12. **Multi-tenancy enforcement points** — Hibernate filters (`@Filter`), row-level-security policy clauses, query helpers that inject `tenant_id`. Document the enforcement mechanism per service.

  13. **Anti-patterns** — flag any of:
      - Field injection (`@Autowired` on fields).
      - Direct dual-write: a repository write plus `KafkaTemplate.send` (or equivalent) in one operation with no outbox row written in the same transaction, whether the send runs inside the transaction or after commit.
      - Outbox row written outside the aggregate's transaction (`REQUIRES_NEW`, after commit).
      - Outbox publisher that marks a row processed without a successful broker acknowledgement (fire-and-forget send, or update before the acknowledgement).
      - Missing `Idempotency-Key` on write endpoints whose path mentions money/wallet/notify/payment/charge/transfer.
      - SQL queries lacking `tenant_id` predicate on shared-schema tables.
      - Logging statements at INFO level that include `tenant_id` or PII.

  Output format: Markdown with one section per ask above, file:line citations everywhere. NO narrative beyond what's needed to make the structural facts readable. The downstream agent will narrate.

  Cap your report at ~3000 lines; if the codebase is larger than that, focus on the load-bearing services and note in the conclusion which services were elided.
```

### Expected output

A structured Markdown report. The skill captures it for Phase 2.

---

## Agent 2 — `code-documentation:docs-architect`

**Role:** narrative synthesis. Turns Phase 1 evidence into per-section LLD content.

### Dispatch template

When invoking via the Agent tool with `subagent_type: code-documentation:docs-architect`:

```text
description: Synthesise LLD content from structural discovery

prompt: |
  I'm generating an LLD (Low-Level Design Document) for an existing codebase. A prior agent has produced a STRUCTURAL DISCOVERY REPORT (below). Your job is to synthesise NARRATIVE LLD CONTENT for specific sections of the LLD template.

  ## STRUCTURAL DISCOVERY REPORT

  <paste full Phase 1 report>

  ## LLD SECTION SCHEMA (target chunks)

  <paste the relevant chunks/04-implementation-template.md, 02-context.md, 03-architecture.md>

  ## YOUR TASK

  Produce the following content blocks. Tag each block with `<!-- target: <chunk>:<section> -->`.

  1. **Per-service responsibility paragraph** (one per service)
     Target: `04-implementation/<service>.md` § 7.1 Responsibility
     - One paragraph describing the service's bounded context, the data it owns, the events it produces, and the events it consumes.
     - Tone: factual, not aspirational. Lead with what the service IS, not what it should be.

  2. **Method-level pseudocode** (per non-trivial method)
     Target: `04-implementation/<service>.md` § 7.3 Method Pseudocode
     - Identify methods that are NON-TRIVIAL: multi-step, branches beyond null-check, touches multiple aggregates, performs idempotency check, emits outbox row.
     - For each, write step-by-step pseudocode.
     - Cite the source file:line at the top of the pseudocode block.
     - Skip methods that are plain CRUD (single repo call + map to DTO) — those are obvious from the signature.

  3. **Design-pattern subsections** (per detected pattern)
     Target: `04-implementation/<service>.md` § 7.4 Design Patterns Applied
     For each pattern from Phase 1 § 9 (Structural pattern detection), write:
     - Triggering CLAUDE.md rule (verbatim quote from the user's CLAUDE.md — see below for the relevant rules).
     - Rationale specific to this service (one paragraph: why this pattern was chosen here, what it solves).
     - Roles table (which classes/methods play which part).
     - Mermaid `classDiagram` showing the pattern structure.
     - Pseudocode skeleton of the key method(s).
     - Confidence flag if Phase 1 marked the detection as medium/low confidence.
     - Outbox: document the publisher (roles, skeleton, delivery rules) from the code as it is. If the code marks a row processed without a successful broker acknowledgement, keep that visible and point to the Phase 1 anti-pattern; never substitute the template's publisher text.

  4. **Use-case workflow narratives** (one per entry point or workflow)
     Target: `04-implementation/<service>.md` § 7.8 Use-Case Workflows
     For each entry point from Phase 1 § 1, write:
     - Trigger.
     - Pre-conditions and post-conditions.
     - Step-by-step control flow (numbered).
     - Idempotency points (if `Idempotency-Key` is read or natural-key dedup is performed).
     - Outbox emission points (if outbox writes occur).
     - Retry / timeout policy (from Phase 1 § 10).
     - Error handling per error type.
     - Mermaid `sequenceDiagram` with all participants (client, controller, service, DB, outbox, Kafka, downstream).

  5. **Cross-service saga narratives** (if multi-service flows are detected)
     Target: orchestrator service's `04-implementation/<orchestrator>.md` § 7.8 Cross-service Saga
     For each saga:
     - Saga name and ID.
     - Participating services.
     - Step table (step / service / action / compensating action / idempotency).
     - Compensation triggers.
     - Mermaid `sequenceDiagram`.

  6. **Cross-service dependency narrative**
     Target: `02-context.md` § 5.4 Cross-Service Dependencies
     - One Mermaid `graph LR` showing which services call/produce-to which.
     - One paragraph naming external systems (upstream / downstream) and the protocol used.

  7. **Architectural style — as operationalised**
     Target: `03-architecture.md` § 6.4
     - Concrete operationalisation of the architecture style: topic naming convention, schema registry choice, outbox-table convention, saga choreography vs orchestration, inter-service sync vs async policy.

  ## CONFIDENCE RULES (apply these to every claim you write)

  - **High confidence (no flag):** claims grounded in code structure, table DDL, topic config, REST annotations.
  - **Medium confidence (`> Confirm:`):** pattern detection via structural heuristic, rationale inferred from naming/structure, pseudocode summarising a method body that may have edge cases.
  - **Low confidence (`> TODO: <best-guess> — verify`):** business rule narrative inferred from variable names + branch structure when no test or comment confirms it.

  Apply confidence flags ONLY where they are warranted. Don't flag every paragraph — that defeats the purpose.

  ## CLAUDE.MD RULES (the user's standing design rules to attribute patterns to)

  - "Outbox pattern is mandatory for any state change that must produce an event. No dual-writes to DB and Kafka."
  - "Idempotency keys on all write endpoints touching money/wallet/notifications or external providers."
  - "Sagas (choreography by default, orchestration when the flow is complex or needs central visibility) for cross-service business transactions."
  - "Constructor injection only, no field injection."
  - "Records for DTOs."
  - "Strategy for runtime variants, Factory Method for object creation hierarchies, Mediator to decouple peers, Chain of Responsibility for pipelines."
  - "Composition over inheritance."
  - "Resilience defaults: timeouts, retries with exponential backoff and jitter, circuit breakers (Resilience4j), bulkheads for downstream provider calls."
  - "Global @RestControllerAdvice, Problem Details (RFC 9457). Business exceptions extend a base ServiceException with error code."

  Quote these verbatim when attributing patterns to rules.

  ## OUTPUT

  One Markdown document with content blocks tagged by target chunk:section. The skill will route each block into the right chunk file.
```

### Expected output

Markdown with `<!-- target: ... -->` tags. The skill walks the output, splits by tag, and routes content into the right chunks.

---

## Phase 3 — Template fitting (the skill's own work)

Once both agents have returned, the skill:

1. **Validates Phase 1 output structure** — checks that all 13 sections of the discovery report are present. If any are missing, re-dispatches with a follow-up prompt.
2. **Validates Phase 2 output tags** — every block has a `<!-- target: ... -->` tag. Untagged blocks are dropped with a warning.
3. **Routes Phase 2 blocks into chunks** — splits by tag, walks the chunk files, inserts content at the matching `## section` heading.
4. **Applies confidence flags** — per `confidence-rules.md`. If Phase 2 already flagged a block, carry the flag. If Phase 2 missed flagging a low-confidence block, the skill applies its own based on the source-of-evidence heuristics.
5. **Generates `15-open-questions.md`** — walks all chunks, greps for `> Confirm:` and `> TODO:` markers, indexes them.
6. **Surfaces handoff summary.**

---

## Briefing rules (general)

- **Always include the relevant chunks** of the LLD template in the agent's prompt. Don't ask the agent to invent the schema.
- **Always include the relevant CLAUDE.md rules** when asking for pattern application or anti-pattern detection. The agent doesn't have the user's CLAUDE.md in its context by default.
- **Cap output length** in the brief. ~3000 lines for Phase 1 reports, ~5000 lines for Phase 2 syntheses, beyond that the skill should re-dispatch with a narrower scope.
- **Ask for citations** (file:line in Phase 1, source-of-evidence in Phase 2). Citations make the output verifiable.
- **Don't ask for invention.** Both agents should report what they found (Phase 1) or synthesise from what was found (Phase 2). They should NOT invent SLOs, threat notes, peak scenarios — those flag as `> TODO:` in the skill's template-fit step.

# Code Extraction (FROM-CODE direction)

This file defines how to drive the two specialist agents — `feature-dev:code-explorer` and `code-documentation:docs-architect` — to populate the LLD chunks from existing source code.

The principle: **structural claims default to high confidence; semantic claims default to medium confidence unless cross-validated.**

See `agent-orchestration.md` for the dispatch templates.

See `confidence-rules.md` for the structural-vs-semantic weighting.

---

## Two-phase pipeline

### Phase 1 — Discovery (`feature-dev:code-explorer` agent)

**Goal:** structurally map the codebase. The agent's output is *evidence*, not narrative.

**Inputs to brief the agent with:**

- Target path (root or specific module).
- Optional: SDD path (for cross-reference; helps the agent name services per SDD vocabulary).
- Explicit asks (see below).

**Explicit asks (always include in the brief):**

1. **Entry points** — controllers (`@RestController`), event listeners (`@KafkaListener`, `@RabbitListener`, `@JmsListener`), schedulers (`@Scheduled`), CLI mains. List one row per entry point with file:line and the trigger.
2. **Service decomposition** — modules / packages / projects that constitute distinct services. List with: name, root path, build tool (Maven / Gradle), main class.
3. **Call graph (per service)** — controller → service → service-impl → repository → external calls. Document with file:line citations.
4. **Class & interface inventory (per service)** — controllers, service interfaces, service impls, repositories, domain types (records, entities). Method signatures.
5. **Database schema** — Flyway migrations enumerated (`src/main/resources/db/migration`). Table list, column types, indexes, constraints. PK/FK relationships.
6. **Kafka topology** — topics produced (`@KafkaTemplate.send` / outbox writes), topics consumed (`@KafkaListener`). Topic names, key strategies, partitioning if discoverable.
7. **REST contracts** — per controller: method, path, request/response types, auth (`@PreAuthorize`), idempotency-key handling.
8. **Cross-cutting hooks** — interceptors (`HandlerInterceptor`), aspects (`@Around`), filters (servlet filters), guards (Spring Security `@Configuration`).
9. **Structural pattern detection** — interfaces with multiple implementations + a context class that holds one of them (Strategy candidate); factory methods returning interface types (Factory candidate); `@Async` + ordered handler chains (Chain of Responsibility); single-listener components routing events (Mediator); orchestrator services with step-by-step compensating actions (Saga); an outbox row inserted in the same transaction as the aggregate write plus a separate publisher (Outbox, per `pattern-rules.md` § Outbox; a Kafka send beside a repository write is a dual-write, never an Outbox; also report an outbox row written outside the aggregate's transaction and a publisher that marks rows processed without a broker acknowledgement). Each detection includes the file:line evidence.
10. **Resilience4j / circuit-breaker config** — `@CircuitBreaker`, `@Retry`, `@Bulkhead`, `@TimeLimiter` annotations. Per call, the configured policy.
11. **Observability hooks** — `@Timed`, `@Counted`, custom Micrometer registrations. List with metric name + labels.
12. **Multi-tenancy enforcement points** — Hibernate filters (`@Filter`), row-level-security policy clauses, query helpers that inject `tenant_id`. Document the enforcement mechanism.
13. **Frontend routes** (when a UI exists): every route, with its path, component, guards, lazy loading, and route `data` (look for `screen` and `useCases` keys).
14. **E2E specs**: every e2e spec file, with its tests and their tags (Playwright `tag` details and `@`-tokens in titles; JUnit 5 `@Tag`).
15. **Use-case markers**: `@UseCase(...)` annotations, `use_case` MDC keys or span attributes, and any other place the code names a use case ID.

**Output format expected from the agent:** structured Markdown with one section per ask above, file:line citations everywhere, no narrative.

### Phase 2 — Synthesis (`code-documentation:docs-architect` agent)

**Goal:** turn Phase 1 evidence into per-section narrative content for the LLD.

**Inputs to brief the agent with:**

- Phase 1 findings (the structured Markdown).
- This skill's section schema (paste from the relevant chunks).
- Confidence rules (paste from `confidence-rules.md`).
- Pattern rules (paste from `pattern-rules.md`).

**Explicit asks (always include in the brief):**

1. **Per-service responsibility** — one paragraph describing each service's bounded context, derived from its entry points + DB tables + topics produced.
2. **Method-level pseudocode for non-trivial methods** — the agent should identify which methods are non-trivial (multi-step, has branching beyond null-check, touches multiple aggregates) and produce pseudocode. Skip plain CRUD.
3. **Design pattern rationale** — for each structural pattern detected by Phase 1, write the rationale (why this pattern was used here, what it solves) referencing the triggering CLAUDE.md rule. If the pattern is *named* (file/class names suggest it) but not *applied* (the structure doesn't match), do NOT document it.
4. **Use-case workflow narratives** — per entry point (or group of entry points serving one flow), describe the control flow step by step, identify idempotency points, identify outbox emission points, identify retry/timeout choices. Head each one `### KEY/UC-NN: Title` only when § Tracing to BRD use cases matched it to an SDD §7.3 use case; otherwise `### Workflow: [name]`. Never number a workflow as a use case.
5. **Cross-service saga narratives** — if multi-service flows are detected (orchestrator + N participants), describe the saga steps + compensation per step.
6. **Sequence diagram authoring** — per use case, generate a Mermaid `sequenceDiagram` with participants (Client, Controller, Service, DB, Outbox, Kafka, downstream system).
7. **Class diagram authoring (per design pattern)** — for each design pattern, generate a Mermaid `classDiagram` showing roles.
8. **Confidence annotation** — every claim that goes beyond pure structure (e.g., "this Strategy is for tenant-tier pricing") gets a `> Confirm:` flag if rationale was inferred from naming or structure rather than from explicit evidence (comments, tests, ADRs).

**Output format expected from the agent:** Markdown blocks tagged by target chunk (`<!-- target: 04-implementation/wallet-core.md § 7.4 -->`).

---

## Template fitting (the skill's own work)

The skill takes Phase 1 + Phase 2 outputs and routes them into the chunks:

- **Structural facts** (call graph, schema, topic names, method signatures) → routed verbatim from Phase 1, no flags (high confidence).
- **Per-service narrative** (responsibility, business logic, pattern rationale) → routed from Phase 2 with `> Confirm:` if Phase 2 flagged the inference.
- **Pseudocode** → routed from Phase 2 verbatim. Pseudocode is medium-confidence by default; flag with `> Confirm:` unless it directly cites file:line.
- **Diagrams** → Mermaid blocks from Phase 2, embedded inline in the chunks per `mermaid-diagrams.md`.

For sections the agents cannot fill from code alone:

- **SLO targets** (`12-performance.md`) — code rarely declares SLOs. From-code mode emits `> TODO: SLO targets — verify with SDD §18 or production data`.
- **Threat notes** (`11-security.md`) — code rarely captures threat reasoning. From-code mode emits `> TODO: threat notes — verify with security review or threat model`.
- **Compliance applicability** (`11-security.md` § 14.6) — code shows what's done; *whether it's compliant* needs human judgement. Flag with `> Confirm:`.
- **Future enhancements** (`16-references.md`) — code rarely tracks future work. Skip if no `// TODO`-style markers found; otherwise transcribe what exists.

---

## Tracing to BRD use cases (only with an SDD)

Code carries no BRD use case IDs of its own, so a pure from-code LLD has no use-case trace: every trace slot reads `Not applicable - no source SDD`, and workflows are headed `### Workflow: [name]`. When an SDD path is given for cross-reference (and in hybrid), match the code to SDD §7.3 and the BRD, then apply `sdd-to-lld.md` § Use-case traceability to what matched.

1. **Entry points.** Match each discovered entry point to a §7.3 Entry points cell by HTTP method and normalized path: combine class-level and method-level mappings, then compare segment by segment, treating any `{param}` as equal to any other `{param}` (parameter names are ignored). Event listeners match `Event: [EVENT_NAME]` by event name, and scheduled jobs match `Schedule: [name]` by name. A match gives the use case(s) and the owner; it is high confidence (both sides are stated facts).
2. **Unmatched entry points.** A platform endpoint (health, actuator, sign-in, admin tooling) carries no use case. Any other unmatched endpoint gets `> Confirm: [METHOD] [path] matches no SDD §7.3 entry point; platform endpoint, or behaviour no BRD use case covers?` It is an open question, never a new UC.
3. **Unmatched §7.3 entry points.** An active in-scope use case whose entry point the code does not have: from-code notes it in chunk 15 (`> Confirm:`); hybrid marks it `⛔ sdd-only` (`hybrid-drift.md` § Use-case trace drift).
4. **Routes to screens.** A route whose `data.screen` names a BRD screen ID or `MK-NN` maps to it (high confidence). Otherwise match by name against the BRD's screen names (medium confidence, `> Confirm:`). A route with no match is a platform page or gets `> Confirm: no BRD screen for route [path]`. The route's use cases are then read from the BRD for that screen, never taken from the code alone.
5. **Specs.** Existing tags that name BRD IDs fill 13 § 16.8. A tag naming an ID the BRD does not have gets `> Confirm:` (hybrid: `⚠ drift`).
6. **Existing use-case markers.** An `@UseCase` value, `use_case` MDC key, or route `data.useCases` that disagrees with §7.3 or the BRD is `> Confirm:` (hybrid: `⚠ drift`), and the LLD cites the upstream value. A missing marker is a `> Confirm:` in every direction: the code has not adopted the LLD convention yet.

---

## Confidence weighting in from-code mode

Per `confidence-rules.md`:

| Claim type | Default confidence | Flag |
|------------|-------------------|------|
| Class name, method signature, field type | High | None |
| Table / column / index / constraint | High | None |
| Topic name, partition key, consumer group | High | None |
| REST path, method, status code | High | None |
| Pattern detection (interface + multi-impl + context class) | Medium | `> Confirm: pattern detected via structural heuristic` |
| Pattern rationale (why-this-pattern-here narrative) | Medium | `> Confirm: rationale inferred from code structure / naming` |
| Method-level pseudocode | Medium | `> Confirm: pseudocode derived from method body — verify against current code` |
| Cross-service saga step ordering | Medium | `> Confirm: saga step ordering inferred from event flow + listener registrations` |
| Idempotency point identification | High if `Idempotency-Key` header is checked; Medium if inferred from natural-key dedup table | varies |
| Business rule narrative | Low | `> TODO: business rule narrative inferred from variable names + branches — verify` |
| Entry point → use case, by method + normalized path match to SDD §7.3 | High | None |
| Entry point with no §7.3 match (not a platform endpoint) | Medium | `> Confirm: matches no SDD §7.3 entry point` |
| Route → screen, by route `data.screen` | High | None |
| Route → screen, by name only | Medium | `> Confirm: route matched to BRD screen by name` |

**Override rule:** if the agent finds a unit/integration test that exercises a claim (e.g., a test verifying a Strategy resolver picks `EnterprisePricingStrategy` for `Tier.ENTERPRISE`), upgrade the confidence by one tier. A test that proves a claim *is* the claim's source-of-truth.

---

## Workflow

1. **Resolve target path** from user input.
2. **Phase 1: Discovery.** Dispatch `feature-dev:code-explorer` with the brief (above). Wait for output.
3. **Phase 2: Synthesis.** Dispatch `code-documentation:docs-architect` with Phase 1 output + section schema + rules. Wait for output.
4. **Template fit.** Walk the chunks; fill content from Phase 1 + Phase 2; apply confidence flags.
5. **Trace to BRD use cases** when an SDD is given (§ Tracing to BRD use cases), then SKILL.md step 6a.
6. **Index flags** in `15-open-questions.md`.
7. **Write output** per chosen shape.
8. **Surface handoff summary**: file paths, services discovered, patterns detected, confidence flag counts, and the use-case traceability line when an SDD was given.

---

## Limitations to acknowledge in the handoff

The skill ALWAYS notes the following limitations in the handoff summary when in from-code direction:

1. **Code may have been refactored after the LLD was generated.** The LLD captures a point-in-time snapshot. Re-run for current state.
2. **Tests pass != code is correct.** Pattern detection finds structural shape, not correctness.
3. **Naming != intent.** A class named `*Strategy` may not be a Strategy pattern; a true Strategy may not be named that way. The skill leans on structural heuristics, not names — but is fallible.
4. **Comments are not source-of-truth.** The skill does not lift Javadoc / comments as canonical narrative; comments rot, code does not.

<!--
CHUNK: 13
TITLE: Testing
PROJECT: [Project Name]
VERSION: [X.X]
PART OF: LLD - [Project Name]
-->

# 16. Testing

> **Conventions per CLAUDE.md:**
> - Backend: JUnit 5 + Mockito (unit), Testcontainers (integration).
> - Frontend: Jest (unit/component), Playwright (e2e).
> - Test naming: `methodName_scenario_expectedResult`.
> - No mocking repositories in integration tests; use real DB via Testcontainers.

## 16.1 Test Pyramid (per service)

| Tier | Tooling | Scope | Speed target |
|------|---------|-------|--------------|
| Unit | JUnit 5 + Mockito | Single class; mock collaborators | < 50ms each |
| Integration | JUnit 5 + Testcontainers (PostgreSQL + Kafka) | Service slice with real DB + real broker | < 10s each |
| Contract | [Spring Cloud Contract / Pact] | API consumer/producer | < 10s each |
| End-to-end | Playwright (frontend) + REST harness (backend) | User journey across services | < 60s each |

## 16.2 Unit Test Conventions

- Mock all collaborators (services, repos, Kafka, clock, UUID generator).
- Inject `Clock` and `IdGenerator` so time and IDs are deterministic.
- Test the happy path AND the failure path for every public method.
- For pattern-heavy classes (Strategy, Mediator, Chain), test each branch / handler in isolation.

**Example:**

```java
class FooServiceImplTest {
  @Test
  void create_idempotencyHit_returnsCachedResponse() { ... }

  @Test
  void create_validInput_persistsAndEmitsOutboxRow() { ... }

  @Test
  void create_invalidAmount_throwsFooValidationException() { ... }
}

class OutboxPublisherTest {
  @Test
  void poll_brokerAcknowledges_marksRowProcessed() { ... }

  @Test
  void poll_sendFails_leavesRowUnprocessed() { ... }

  @Test
  void poll_sendTimesOut_leavesRowUnprocessed() { ... }

  @Test
  void poll_markProcessedFailsAfterAck_republishesRowOnNextPoll() { ... }
}
```

## 16.3 Integration Test Conventions

- Spin up PostgreSQL + Kafka via Testcontainers.
- Apply Flyway migrations on container startup.
- Each test runs in its own transaction; rolls back at the end (or uses Testcontainers' fresh-database-per-test mode).
- Test the controller-to-DB-to-Kafka flow end-to-end.
- Outbox flow tests use a fresh database per test, not rollback, because the publisher reads only committed rows. Verify the outbox row is written in the aggregate's transaction; consume from Kafka, assert payload shape, then assert the row's `processed_at` is set. With Kafka stopped, the row stays unprocessed and is published once Kafka is back.

**Example:**

```java
@SpringBootTest
@Testcontainers
class FooApiIntegrationTest {
  @Container static PostgreSQLContainer<?> db = ...;
  @Container static KafkaContainer kafka = ...;

  @Test
  void postFoo_validBody_creates_emitsEvent_returns201() { ... }
}
```

## 16.4 Contract Tests

- Provider tests: each service publishes a contract via [tooling].
- Consumer tests: each consumer verifies it can parse the published contract.
- CI gate: contract verification runs on every PR.

## 16.5 Frontend Tests (if applicable — see `14-frontend.md`)

- Unit / component: Jest + Angular Testing Library; one spec per component / service / pipe.
- End-to-end: Playwright; one spec per critical user journey.
- Accessibility: axe-core checks integrated into Playwright runs (CLAUDE.md WCAG 2.1 AA).

## 16.6 Test Data Strategy

- **Builders:** every aggregate type has a `@TestBuilder` class for fixture creation.
- **Tenant fixtures:** `tenant_a`, `tenant_b` baseline tenants in test data — used to verify tenant isolation by negative test.
- **Time:** `Clock` injected; tests use `Clock.fixed(...)` for deterministic timestamps.
- **IDs:** UUIDv7 generator can be replaced with a deterministic sequence in tests.

## 16.7 CI Gates

| Stage | Gate | Required to pass |
|-------|------|------------------|
| Compile | `mvn compile` / `gradle build` | Yes |
| Unit | All unit tests pass | Yes |
| Integration | All integration tests pass | Yes |
| Contract | All contracts verified | Yes |
| Coverage | [N]% line coverage on changed files | Yes / Warn |
| Static analysis | [SpotBugs / Checkstyle / SonarQube] | Yes / Warn |

<!-- MASTER: lld-master.md | PREV: 12-performance.md | NEXT: 14-frontend.md (conditional) | NEXT: 15-open-questions.md (if no UI) -->

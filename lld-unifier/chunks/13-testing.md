<!--
CHUNK: 13
TITLE: Testing
PROJECT: [Project Name]
VERSION: [X.X]
PART OF: LLD - [Project Name]
-->

# 16. Testing

> **Conventions per CLAUDE.md:**
> - Test tools: each tool, with its Status, is a row of `03a-libraries-and-conventions.md` § 6.5.1 (or of § 6.3, for a layer § 6.3 holds). The tiers below use those rows.
> - Test naming: `methodName_scenario_expectedResult`.
> - No mocking repositories in integration tests; use a real database through the integration-test tool.

## 16.1 Test Pyramid (per service)

| Tier | Tooling | Scope | Speed target |
|------|---------|-------|--------------|
| Unit | JUnit 5 + Mockito | Single class; mock collaborators | < 50ms each |
| Integration | JUnit 5 + Testcontainers (PostgreSQL + Kafka) | Service slice with real DB + real broker | < 10s each |
| Contract | [Spring Cloud Contract / Pact] | API consumer/producer | < 10s each |
| End-to-end | Playwright (frontend) + REST harness (backend) | One BRD use case across services, tagged per § 16.8 | < 60s each |

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

## 16.5 Frontend Tests (if applicable)

- Unit / component: Jest + Angular Testing Library; one spec per component / service / pipe.
- End-to-end: Playwright; one spec per BRD use case, named and tagged per § 16.8 (with no source BRD: one spec per critical user journey).
- Accessibility: axe-core checks integrated into Playwright runs (CLAUDE.md WCAG 2.1 AA).

## 16.6 Test Data Strategy

- **Builders:** every aggregate type has a `@TestBuilder` class for fixture creation.
- **Tenant fixtures:** `tenant_a`, `tenant_b` baseline tenants in test data - used to verify tenant isolation by negative test.
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

## 16.8 E2E Spec Traceability

<!--
Derive-from-SDD with a brd-unifier BRD (sdd-to-lld.md § Use-case traceability). With no source BRD, write "Not applicable - no source BRD."
The home of spec -> use case and spec -> test case. One row per e2e spec: one spec per in-scope BRD use case, named from its key and BRD title.
Use cases and test cases carry the key from the SDD's Source BRDs register and link to their BRD headings (test cases to the chunk 16 feature-area heading that holds them), listed one by one, never as a range.
While BRD chunk 16 is not written (its delivery gate is shut): "Pending (BRD 16 not written)" in the test case column; specs carry use case tags only.
The Not automated line lists every non-retired chunk 16 case of an in-scope use case that no spec covers, with its reason. "None" when every case is automated; "Pending (BRD 16 not written)" while chunk 16 is not written.
Runs from: the phase from which the row's cases can run. When the tracker has a slice plan (impl-tracker-unifier's slice mode), its slice ID ([KEY]/S-NN) as the slice plan writes it. Otherwise a link to the use case's `17-specs.md` § 3 Roadmap row ([P2](17-specs.md#3-roadmap)), never a copy of its label or scope. From-code direction with no Roadmap: "Not applicable - no Roadmap".
The Deferred line lists every case that cannot run until a later phase or slice than its row's Runs from, with its spec and the phase or slice it waits for (same form as Runs from). While it waits, a deferred case is listed on the Deferred line only, never also in its row's test case cell. It moves into the cell through an existing LLD update path once its phase or slice starts: a 17 § 3 Roadmap change that reaches the LLD through the documents chain, a tracker `Doc gap` or `Decided change` request (SKILL.md step 9), or the step 3c slice-order refresh. Never by hand outside an update. "None" when no case waits.
-->

> **Convention:** one spec per BRD use case, named `e2e/[key-lowercase]-uc-NN-[title-slug].spec.ts`. Every test carries its keyed use case and test case IDs as tags: Playwright `test('[TC name]', { tag: ['@[KEY]/UC-NN', '@[KEY]/TC-[AREA]-NN'] }, async ({ page }) => { ... })`; a backend REST harness (JUnit 5) uses `@Tag("[KEY]/UC-NN")` and `@Tag("[KEY]/TC-[AREA]-NN")`. To re-run a failing UAT case or a production regression: `npx playwright test --grep "@[KEY]/TC-[AREA]-NN"`, or the JUnit Platform tag filter (the `groups` parameter of Maven Surefire or Failsafe).

| Spec | Use cases (BRD) | UAT/BAT test cases (BRD) | Parts covered | Runner | Runs from |
|------|-----------------|--------------------------|---------------|--------|-----------|
| `e2e/[key-lowercase]-uc-01-[title-slug].spec.ts` | [[KEY]/UC-01](../brd-[brd-slug]/06a-use-cases-[persona-slug].md#uc-01-[title-slug]) | [[KEY]/TC-[AREA]-01](../brd-[brd-slug]/16-uat-bat-test-cases.md#[n]-[feature-area-slug]), [[KEY]/TC-[AREA]-02](../brd-[brd-slug]/16-uat-bat-test-cases.md#[n]-[feature-area-slug]) | [step 1-5, A1, E1] | Playwright | [P1](17-specs.md#3-roadmap) |

**Not automated:** [[KEY]/TC-NFR-02](../brd-[brd-slug]/16-uat-bat-test-cases.md#[n]-nfr-acceptance-[ids-slug]) ([reason, e.g. BAT observation over the UAT period]) [or: None / Pending (BRD 16 not written)]

**Deferred to a later phase:** [[KEY]/TC-[AREA]-03](../brd-[brd-slug]/16-uat-bat-test-cases.md#[n]-[feature-area-slug]) in `e2e/[key-lowercase]-uc-01-[title-slug].spec.ts` (runs from [P3](17-specs.md#3-roadmap): [what it waits for]) [or: None / Pending (BRD 16 not written)]

## 16.9 External Dependency Stand-ins

<!--
One row per external dependency the code calls: each SDD §12 integration (INT-NN) and each managed platform service (identity provider, key management, mail sender, object store, queue). With none: "None - no external dependencies".
One column per SDD §19 environment, plus Tests (the integration and e2e runs). Each cell: Real, Emulator (named, for example LocalStack or WireMock), or Fake (the test double class).
Known differences: each behaviour the stand-in does not reproduce (for example a service missing from the emulator edition, keys re-created on restart, no outbound mail). "None known" only after a run proved it.
Environment-varying values (endpoints, senders, cookie scope) live in `10-operations.md` § 13.1a.
-->

| Dependency | SDD source | Dev | SIT | UAT | Prod | Tests | Known differences |
|------------|------------|-----|-----|-----|------|-------|-------------------|
| [Identity provider] | [INT-01](../sdd-[sdd-slug]/08-integrations.md#12-integrations) | [Emulator ([name])] | [Real (sandbox)] | [Real (sandbox)] | Real | [Fake (`FakeIdentityProvider`)] | [What the emulator does not reproduce] |

**Assumed provider facts.** Each provider behaviour the design relies on that no run has proved yet. It stays flagged `> Confirm:` until its spike passes.

| Fact assumed | Dependency | Relied on by | Spike (what is run, what result proves it) | Must precede | State |
|--------------|------------|--------------|--------------------------------------------|--------------|-------|
| [The provider returns [claim] in [token]] | [Identity provider] | [04 anchor, link] | [Call [operation] in the sandbox; the claim is present] | [P1](17-specs.md#3-roadmap) (or the slice, as Runs from in § 16.8) | [Assumed / Verified ([evidence link]) / Refuted (open item raised)] |

<!-- MASTER: [project-slug]-lld-master.md | PREV: 12-performance.md | NEXT: 14-frontend.md (conditional) | NEXT: 15-open-questions.md (if no UI) -->

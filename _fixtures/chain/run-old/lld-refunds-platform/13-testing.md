<!--
CHUNK: 13
TITLE: Testing
PROJECT: Refunds Platform
VERSION: 1.0
PART OF: LLD - Refunds Platform
-->

# 16. Testing

> **Conventions per CLAUDE.md (and SDD AP-11):**
> - Backend: JUnit 5 + Mockito (unit), Testcontainers (integration).
> - Frontend: Jest (unit/component), Playwright (e2e).
> - Test naming: `methodName_scenario_expectedResult`.
> - No mocking repositories in integration tests; use real DB via Testcontainers.

## 16.1 Test Pyramid (per service)

| Tier | Tooling | Scope | Speed target |
|------|---------|-------|--------------|
| Unit | JUnit 5 + Mockito | Aggregates, policies, services with mocked ports | < 50 ms each |
| Integration | JUnit 5 + Testcontainers (PostgreSQL 17, Kafka) | One deployable with real database and broker; provider stubs | < 10 s each |
| Contract | Registry compatibility check for events; stub-based provider tests for API-01 to API-06 | Event schemas and provider adapters | < 10 s each |
| Architecture | Build-time rules (03 § 6.4) | Module boundaries, tenant parameters, layering | < 5 s |
| End-to-end | Playwright (web app) against SIT with provider stubs | User journeys across the three deployables | < 60 s each |

## 16.2 Unit Test Conventions

- Mock all ports (repositories, providers, `OutboxWriter`, `Clock`, `IdGenerator`); never mock the aggregate under test.
- Inject `Clock` and `IdGenerator` so time and ids are deterministic; business-date tests use a fixed tenant zone.
- Test the happy path and every failure path of each public method; each state transition of 08 § 11.1 has a test.
- Strategy classes (notification senders and resolvers) are tested per variant.

**Example (names from SDD §17.x Developer Notes where given):**

```java
class RefundDecisionServiceImplTest {
  @Test void decide_partialAmountEqualToRequested_throwsInvalidPartialAmount() { }
  @Test void decide_otherBranch_throwsBranchAccessDenied() { }
  @Test void decide_rejectWithoutReason_throwsReasonRequired() { }
}

class PayoutServiceImplTest {
  @Test void onApproved_duplicateEvent_createsNoSecondPayout() { }
}

class PayoutAttemptServiceImplTest {
  @Test void schedule_leaseExpired_reattemptsInDoubt() { }
  @Test void runDueAttempts_windowClosed_writesPayoutFailed() { }
}

class NotificationPlanServiceImplTest {
  @Test void plan_refundCancelled_emailOnly() { }
}

class TakeBackServiceImplTest {
  @Test void onRefundPaid_purchaseNotYetReceived_parksTakeBack() { }
  @Test void applyWaiting_closedTakeBack_appliesAndCountsLate() { }
}
```

## 16.3 Integration Test Conventions

- Spin up PostgreSQL and Kafka via Testcontainers; apply the Flyway migrations on startup (both schemas for the core).
- A fresh database per test class; each test seeds `tenant_a` and `tenant_b`.
- Test controller to database to outbox to Kafka end to end; consume the published record and assert the envelope and payload against the registry schema.
- Provider stubs (HTTP stub server) script POS Records, CardPay, MsgHub, and the Keycloak Admin API, including refusals, timeouts, and late confirmations.

**Must-have integration scenarios (the risk surfaces of this design):**

| Service | Scenario | Expected result |
|---------|----------|-----------------|
| refund-service | Two concurrent submissions claiming the same line with different keys | One 201, one 409 `ITEM_ALREADY_REFUNDED` |
| refund-service | Same key twice, second while the first runs | Second gets 409 `REQUEST_IN_PROGRESS`; a later repeat replays the 201 |
| refund-service | Same key, different body | 409 `CONFLICT` |
| refund-service | Cancel and decide race | Exactly one wins; the other gets 409 `REFUND_ALREADY_DECIDED` |
| refund-service | Purchase 30 and 31 days old around tenant-local midnight | 30 allowed, 31 refused, independent of UTC hour |
| refund-service | Another customer's request; another branch's request | 404; 403 |
| refund-service | `PAYOUT_FAILED` then late `PAYOUT_SUCCEEDED` | APPROVED (payout FAILED) then PAID; `REFUND_PAYOUT_FAILED` then `REFUND_PAID` |
| payout-service | `REFUND_APPROVED` redelivered | One payout |
| payout-service | CardPay stub times out, then confirms | Same idempotency key on both calls; one SUCCEEDED |
| payout-service | Pod killed after the CardPay call | Lease expires; in-doubt re-attempt with the same key |
| payout-service | Result arrives before the provider reference is known | Stored UNMATCHED, matched later; `PAYOUT_SUCCEEDED` once |
| notification-service | Event redelivered; DLQ redrive of an older event | No second message; older message SKIPPED as superseded |
| notification-service | Contact of another tenant | Row FAILED; security alert metric |
| loyalty-service | `REFUND_PAID` before the purchase; purchase arrives | PARKED then APPLIED; balance equals the sum of movements |
| loyalty-service | Take-back closed; purchase arrives late | APPLIED with `points_take_backs_applied_late_total` + 1 |
| all | Rows of `tenant_a` read with `tenant_b` context | Nothing returned (SDD §11.2) |

**Example:**

```java
@SpringBootTest
@Testcontainers
class RefundRequestApiIntegrationTest {
  @Container static PostgreSQLContainer<?> db = new PostgreSQLContainer<>("postgres:17");
  @Container static KafkaContainer kafka = new KafkaContainer(KAFKA_IMAGE);

  @Test void postRefundRequest_validBody_createsEmitsEventReturns201() { }
}
```

> TODO: the Kafka test image and the HTTP stub server library are not chosen (SDD §6 pins no Kafka version; a stub server is a new test dependency needing approval per CLAUDE.md) - verify with the team.

## 16.4 Contract Tests

- **Events:** every payload record has a JSON Schema in the registry project; CI checks backward compatibility (additive only, AP-10) and validates a sample of each producer's output against the schema; consumers run tests against the same schemas.
- **Provider APIs:** each adapter has tests against a recorded stub of the provider; the stubs are replaced by the provider sandbox contracts once API-01 to API-06 are documented (SDD §15.6).
- **Client APIs:** the OpenAPI files are the contract (ADR-04); CI checks the controllers against them, and the web app's generated client compiles against the same files.
- **Permission map:** a test asserts that each module's permission map matches the SDD §16.12.2 per-role counts and the tokens of the SDD §16.11 matrix.
- **CI gate:** contract and compatibility checks run on every pull request.

## 16.5 Frontend Tests (if applicable - see `14-frontend.md`)

- Unit / component: Jest with Angular TestBed; one spec per component, store, and pipe; stores tested without the DOM.
- End-to-end: Playwright, one spec per UAT journey of [REFUNDS 16](../brd-refunds-portal/16-uat-bat-test-cases.md) (TC-REQ-01 to TC-REQ-08, TC-DEC-01 to TC-DEC-05, TC-UIX-01), plus the LOYALTY balance and history journeys.
- Accessibility: automated accessibility checks in the Playwright runs (CLAUDE.md WCAG 2.1 AA), plus keyboard-only journeys and an RTL (Arabic) pass.

> Confirm: an accessibility checker library (for example axe-core) in Playwright is a new test dependency and needs approval per CLAUDE.md.

## 16.6 Test Data Strategy

- **Builders:** every aggregate has a test builder (`RefundRequestBuilder`, `PayoutBuilder`, `NotificationBuilder`, `PointsMovementBuilder`).
- **Tenant fixtures:** `tenant_a` and `tenant_b` in every integration test, used to prove isolation by negative test.
- **Time:** `Clock.fixed(...)` with a tenant zone that has a non-zero UTC offset, so date bugs surface.
- **IDs:** the `IdGenerator` is replaced with a deterministic sequence in tests.
- **Receipts:** POS stub receipts dated 10 and 31 days before the test day (REFUNDS 16 prerequisite P3), receipts sharing a number across two branches, and a receipt with an already-claimed line.

## 16.7 CI Gates

| Stage | Gate | Required to pass |
|-------|------|------------------|
| Compile | Build of each deployable and the shared library | Yes |
| Unit | All unit tests pass | Yes |
| Architecture | Module boundary and tenant-parameter rules | Yes |
| Integration | All Testcontainers tests pass | Yes |
| Contract | Event schema compatibility, OpenAPI conformance, permission map | Yes |
| Coverage | Line coverage on changed files | Warn (threshold open) |
| Static analysis | Tool open | Warn |
| Image and dependency scan | Critical findings fail the build (SDD §11.6) | Yes |

> TODO: not derivable from inputs - the coverage threshold, static-analysis tool, and CI platform are open (SDD §6 CI/CD row) - please specify.

<!-- MASTER: lld-master.md | PREV: 12-performance.md | NEXT: 14-frontend.md -->

<!--
CHUNK: 13
TITLE: Testing
PROJECT: Refunds Platform
VERSION: 1.0
PART OF: LLD - Refunds Platform
-->

# 16. Testing

> **Conventions per CLAUDE.md:**
> - Backend: JUnit 5 + Mockito (unit), Testcontainers (integration).
> - Frontend: Jest (unit/component), Playwright (e2e).
> - Test naming: `methodName_scenario_expectedResult`.
> - No mocking repositories in integration tests; use real DB via Testcontainers.

Design: [SDD AP-11](../sdd-refunds-platform/06-principles-and-decisions.md#9-architecture-principles) and each module's SDD Developer Notes (testing), referenced, not restated.

## 16.1 Test Pyramid (per service)

| Tier | Tooling | Scope | Speed target |
|------|---------|-------|--------------|
| Unit | JUnit 5 + Mockito | Single class; mock collaborators | < 50ms each |
| Integration | JUnit 5 + Testcontainers (PostgreSQL only; no broker in this release) | One module slice with the real database, Flyway migrations, and row-level security | < 10s each |
| Module boundary | Spring Modulith `ApplicationModules.verify()` and `@ApplicationModuleTest` | Module dependencies acyclic; only `api` packages used across modules (SDD §6 rules) | < 30s |
| Contract | Consumer-side stubs of API-02, API-03, API-04 (WireMock-style HTTP stubs) | Provider adapters against the agreed provider contracts, once TBD - external is resolved | < 10s each |
| End-to-end | Playwright (frontend) + REST harness (backend) | One BRD use case across services, tagged per § 16.8 | < 60s each |

> Confirm: the HTTP stub library for the provider contract tests is not chosen (CLAUDE.md: no new dependency without asking); WireMock is the assumed default to be approved.

## 16.2 Unit Test Conventions

- Mock all collaborators (services, repos, ports, clock, UUID generator).
- Inject `Clock` and `IdGenerator` so time and IDs are deterministic.
- Test the happy path AND the failure path for every public method.
- For pattern-heavy classes (Strategy, Mediator, Chain), test each branch / handler in isolation.

**Example:**

```java
class RefundDecisionServiceImplTest {
  @Test void decide_partialAmountEqualToRequested_throwsPartialAmountInvalid() { ... }
  @Test void decide_ownRequest_throwsForbidden() { ... }
  @Test void decide_approve_callsPayoutPortInSameTransaction() { ... }
}

class RefundWindowPolicyTest {
  @Test void isWithinWindow_oneMinuteBeforeBoundary_returnsTrue() { ... }
  @Test void isWithinWindow_oneMinuteAfterBoundary_returnsFalse() { ... }
}

class PayoutDispatchServiceImplTest {
  @Test void recordOutcome_cardPayAccepts_marksSucceededAndPublishes() { ... }
  @Test void recordOutcome_refusedAfter24Hours_marksFailedAndPublishesPayoutFailed() { ... }
  @Test void recordOutcome_timeoutAfter24Hours_marksUnknownNotFailed() { ... }
  @Test void recordOutcome_circuitOpen_countsAsFailedAttempt() { ... }
}

class TakeBackServiceImplTest {
  @Test void onRefundPaid_secondRefundBeyondCap_recordsNothing() { ... }
  @Test void onRefundPaid_purchaseNotReceived_storesPendingTakeBack() { ... }
}
```

## 16.3 Integration Test Conventions

- Spin up PostgreSQL via Testcontainers (one container per test class, reused).
- Apply Flyway migrations of all five schemas on container startup, as the owner role; run the application as the non-owner role so row-level security is exercised.
- Each test runs in its own transaction and rolls back, except tests of listeners, dispatchers, and publications, which read committed data and use a fresh database per test.
- Test the controller-to-DB-to-publication flow end-to-end.
- Required cases (SDD Developer Notes): the unique active-item index under two concurrent submissions; the cancel-versus-decide race; API-01 atomicity (a `payout` error rolls the approval back); concurrent dispatcher claims across two dispatcher instances; duplicate `RefundPaid` and refund-before-purchase ordering; two refunds of one purchase paid before and after the purchase arrives; the nightly integrity job; tenant isolation (tenant B never sees tenant A's rows, with and without the `@TenantId` filter, to prove row-level security alone holds).
- The 24-hour payout rule runs with a fixed, advanced `Clock` and a stubbed CardPay that refuses (covers REFUNDS/TC-DEC-04's behaviour, § 16.8).

**Example:**

```java
@SpringBootTest
@Testcontainers
class RefundDecisionApiIntegrationTest {
  @Container static PostgreSQLContainer<?> db = ...;

  @Test
  void postDecision_approveInFull_createsPendingPayoutInSameTransaction_returns200() { ... }
}
```

## 16.4 Contract Tests

- Provider tests: not applicable inside the deployable (no internal HTTP); the port API-01 is covered by the module boundary test and a module test of its contract (DTOs, three typed errors, idempotency on `refundId`).
- Consumer tests: `PosReceiptAdapter`, `CardPayAdapter`, `MsgHubAdapter` verify they can produce and parse the provider contracts, once API-02 to API-04 leave TBD - external.
- CI gate: contract verification runs on every PR.

## 16.5 Frontend Tests (if applicable)

- Unit / component: Jest + Angular Testing Library; one spec per component / service / pipe.
- End-to-end: Playwright; one spec per BRD use case, named and tagged per § 16.8 (with no source BRD: one spec per critical user journey).
- Accessibility: axe-core checks integrated into Playwright runs (CLAUDE.md WCAG 2.1 AA).

## 16.6 Test Data Strategy

- **Builders:** every aggregate type has a test builder (`RefundRequestBuilder`, `PayoutBuilder`, `PointsMovementBuilder`) for fixture creation.
- **Tenant fixtures:** `tenant_a`, `tenant_b` baseline tenants in test data - used to verify tenant isolation by negative test.
- **Time:** `Clock` injected; tests use `Clock.fixed(...)` for deterministic timestamps, including the 30-day and 24-hour boundaries.
- **IDs:** UUIDv7 generator can be replaced with a deterministic sequence in tests.
- **E2E data:** receipts dated 10 and 31 days before the test day, one with a line already refunded, two branches with one manager each, a customer with no requests (REFUNDS 16 prerequisites P2 and P3), served by POS, CardPay, and MsgHub stubs in the e2e environment.

## 16.7 CI Gates

| Stage | Gate | Required to pass |
|-------|------|------------------|
| Compile | `mvn compile` | Yes |
| Unit | All unit tests pass | Yes |
| Integration | All integration tests pass (Testcontainers PostgreSQL) | Yes |
| Module boundary | `ApplicationModules.verify()` passes | Yes |
| Contract | All provider contracts verified | Yes, once API-02 to API-04 are defined |
| Coverage | 80% line coverage on changed files | Warn |
| Static analysis | Open (SDD §6 CI/CD row) | Warn |

> TODO: the coverage threshold and static analysis tool are not set by the SDD (CI/CD platform open in SDD §6); best guess: 80% on changed files, warn only - verify.

## 16.8 E2E Spec Traceability

> **Convention:** one spec per BRD use case, named `e2e/[key-lowercase]-uc-NN-[title-slug].spec.ts`. Every test carries its keyed use case and test case IDs as tags: Playwright `test('[TC name]', { tag: ['@[KEY]/UC-NN', '@[KEY]/TC-[AREA]-NN'] }, async ({ page }) => { ... })`; a backend REST harness (JUnit 5) uses `@Tag("[KEY]/UC-NN")` and `@Tag("[KEY]/TC-[AREA]-NN")`. To re-run a failing UAT case or a production regression: `npx playwright test --grep "@[KEY]/TC-[AREA]-NN"`, or the JUnit Platform tag filter (the `groups` parameter of Maven Surefire or Failsafe).

| Spec | Use cases (BRD) | UAT/BAT test cases (BRD) | Parts covered | Runner |
|------|-----------------|--------------------------|---------------|--------|
| `e2e/refunds-uc-01-request-a-refund.spec.ts` | [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) | [REFUNDS/TC-REQ-01](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02), [REFUNDS/TC-REQ-02](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02), [REFUNDS/TC-REQ-03](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02), [REFUNDS/TC-REQ-04](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02), [REFUNDS/TC-UIX-01](../brd-refunds-portal/16-uat-bat-test-cases.md#3-cross-cutting-uiux-standards-chunk-11) | steps 1-6, A1, E1, E2 | Playwright |
| `e2e/refunds-uc-02-track-refund-status-web-and-mobile.spec.ts` | [REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status-web-and-mobile) | [REFUNDS/TC-REQ-05](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02), [REFUNDS/TC-REQ-06](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02), [REFUNDS/TC-UIX-01](../brd-refunds-portal/16-uat-bat-test-cases.md#3-cross-cutting-uiux-standards-chunk-11) | steps 1-4, A1 | Playwright (desktop and phone viewports) |
| `e2e/refunds-uc-03-cancel-a-refund-request.spec.ts` | [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request) | [REFUNDS/TC-REQ-07](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02), [REFUNDS/TC-REQ-08](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02) | steps 1-5, E1 | Playwright |
| `e2e/refunds-uc-04-approve-reject-refund.spec.ts` | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | [REFUNDS/TC-DEC-01](../brd-refunds-portal/16-uat-bat-test-cases.md#2-refund-decisions-uc-04-mk-03), [REFUNDS/TC-DEC-02](../brd-refunds-portal/16-uat-bat-test-cases.md#2-refund-decisions-uc-04-mk-03), [REFUNDS/TC-DEC-03](../brd-refunds-portal/16-uat-bat-test-cases.md#2-refund-decisions-uc-04-mk-03), [REFUNDS/TC-DEC-05](../brd-refunds-portal/16-uat-bat-test-cases.md#2-refund-decisions-uc-04-mk-03), [REFUNDS/TC-UIX-01](../brd-refunds-portal/16-uat-bat-test-cases.md#3-cross-cutting-uiux-standards-chunk-11) | steps 1-7, A1, A2 | Playwright |
| `e2e/loyalty-uc-01-view-points-balance.spec.ts` | [LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance) | Pending (BRD 16 not written) | steps 1-2, A1 | Playwright |
| `e2e/loyalty-uc-02-view-points-history.spec.ts` | [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) | Pending (BRD 16 not written) | steps 1-4, A1 | Playwright |

**Not automated:** [REFUNDS/TC-DEC-04](../brd-refunds-portal/16-uat-bat-test-cases.md#2-refund-decisions-uc-04-mk-03) (the payment provider sandbox must refuse a payout for a full day, REFUNDS 16 P4; the 24-hour rule is covered by the payout integration test with a fixed clock, § 16.3, and checked manually in UAT), [REFUNDS/TC-NFR-01](../brd-refunds-portal/16-uat-bat-test-cases.md#4-nfr-acceptance-nfr-01-nfr-02) (BAT observation over the UAT period; NFR case, no use case), [REFUNDS/TC-NFR-02](../brd-refunds-portal/16-uat-bat-test-cases.md#4-nfr-acceptance-nfr-01-nfr-02) (BAT observation over the UAT period; NFR case, no use case)

The two LOYALTY specs carry use case tags only (`@LOYALTY/UC-01`, `@LOYALTY/UC-02`); test case tags are added when LOYALTY chunk 16 is written (its delivery gate is shut).

<!-- MASTER: refunds-platform-lld-master.md | PREV: 12-performance.md | NEXT: 14-frontend.md -->

<!--
CHUNK: 13
TITLE: Testing
PROJECT: Refunds Platform
VERSION: 1.0
PART OF: LLD - Refunds Platform
-->

# 16. Testing

> **Conventions per CLAUDE.md (and SDD AP-11):**
> - Backend: JUnit 5 + Mockito (unit), Testcontainers (integration) with real PostgreSQL and Kafka.
> - Frontend: Jest (unit/component), Playwright (e2e).
> - Test naming: `methodName_scenario_expectedResult`.
> - No mocking repositories in integration tests; use the real database.

## 16.1 Test Pyramid (per service)

| Tier | Tooling | Scope | Speed target |
|------|---------|-------|--------------|
| Unit | JUnit 5 + Mockito | One class; collaborators mocked; `Clock` and `IdGenerator` fixed | < 50 ms each |
| Integration | JUnit 5 + Testcontainers (PostgreSQL 17, Kafka) + provider stubs | One deployable with real database and broker; outbox to Kafka to inbox | < 10 s each |
| Contract | Event: JSON Schema compatibility check of every payload against the registry subjects; HTTP: provider stubs built from the SDD API-NN contracts once supplied | Producers and consumers of §14 events; the six provider adapters | < 10 s each |
| End-to-end | Playwright against SIT (provider stubs) | One BRD use case across services, tagged per § 16.8 | < 60 s each |

## 16.2 Unit Test Conventions

- Mock collaborators (ports, repositories, `Clock`, `IdGenerator`); never mock the aggregate under test.
- Every state machine transition and every guard of `08-state-and-rules.md` § 11.1 has a positive and a negative test.
- Pattern classes are tested per variant: each `InDoubtResolution`, each `RecipientResolver`, `BackoffPolicy` jitter bounds, `PointsPolicy` edge cases.
- The SDD's named tests are kept verbatim (SDD §17.1 to §17.4 Developer Notes).

**Example:**

```java
class RefundDecisionServiceImplTest {
  @Test void decide_partialAmountEqualToRequested_throwsInvalidPartialAmount() { ... }   // SDD §17.1; blocked on the REFUNDS/TC-DEC-02 flag in refund-service.md § 7.3
  @Test void decide_amountAboveRequested_throwsInvalidPartialAmount() { ... }
  @Test void decide_otherBranch_throwsForbiddenBranch() { ... }
  @Test void decide_partialWithoutReason_throwsReasonRequired() { ... }
}
class PayoutAttemptServiceImplTest {
  @Test void onApproved_duplicateEvent_createsNoSecondPayout() { ... }                  // SDD §17.2
  @Test void schedule_leaseExpired_reattemptsInDoubt() { ... }                           // SDD §17.2
  @Test void recordOutcome_confirmedAfterFailed_movesToSucceeded() { ... }
}
class TakeBackServiceImplTest {
  @Test void onRefundPaid_purchaseNotYetReceived_parksTakeBack() { ... }                 // SDD §17.4
}
```

## 16.3 Integration Test Conventions

- Start PostgreSQL and Kafka with Testcontainers once per test class; apply Flyway migrations on startup (both core schemas).
- Seed `tenant_a` and `tenant_b`; every repository test asserts that `tenant_b` rows are invisible to `tenant_a` (SDD §11.2).
- Drive controller to database to outbox to Kafka; consume the topic and assert the envelope against the registry schema.
- Idempotency: two concurrent POSTs with one key yield one 201 and one 409 `REQUEST_IN_PROGRESS` or a replay; never two requests.
- Concurrency: a cancellation racing a decision yields exactly one winner and a 409 `REFUND_ALREADY_DECIDED` (REFUNDS/UC-03 E1); a `REFUND_PAID` racing its API-06 purchase always ends with one TAKEN_BACK movement.

**Example:**

```java
@SpringBootTest @Testcontainers
class RefundDecisionApiIntegrationTest {
  @Container static PostgreSQLContainer<?> db = new PostgreSQLContainer<>("postgres:17");
  @Container static KafkaContainer kafka = ...;
  @Test void postDecision_approvePartial_emitsRefundApproved_returns200() { ... }
}
```

## 16.4 Contract Tests

- Event contracts: CI validates every producer's sample payloads against the registry subject and checks that a new schema version is backward compatible (additive only, AP-10).
- Provider contracts (API-01 to API-06): stub servers built from each provider's documentation once supplied (SDD §15.6); until then, stubs follow the LLD's best-guess shapes and are marked provisional.
- CI gate: contract checks run on every pull request.

> Confirm: the contract-test and HTTP-stub tools are not pinned (SDD AP-11 names only JUnit 5, Mockito, and Testcontainers); adding one needs approval as a new dependency.

## 16.5 Frontend Tests (see `14-frontend.md`)

- Unit / component: Jest with Angular `TestBed`; one spec per component, store, guard, and pipe; presentational components tested through inputs and outputs only.
- End-to-end: Playwright; one spec per BRD use case, named and tagged per § 16.8.
- Accessibility: automated WCAG 2.1 AA checks inside the Playwright runs.

> Confirm: the automated accessibility checker (for example axe-core) is a new test dependency; ask before adding it.

## 16.6 Test Data Strategy

- **Builders:** one test builder per aggregate (`RefundRequestBuilder`, `PayoutBuilder`, `PointsMovementBuilder`).
- **Tenant fixtures:** `tenant_a` and `tenant_b` with different time zones, so window and report-day tests cross midnight.
- **Time:** `Clock.fixed(...)` everywhere; receipts dated 10 and 31 days before the fixed day (REFUNDS 16 prerequisite P3).
- **IDs:** `IdGenerator` replaced by a deterministic sequence of UUIDv7 values.
- **Accounts (e2e):** one customer, one branch manager per branch for two branches, one account with no role (REFUNDS 16 P2), and one member with a `member_id` claim.
- **Provider stubs (SIT and e2e):** POS receipts (found, not found, 31 days old, one line already claimed); CardPay modes confirm, refuse, time out, and confirm late; MsgHub accept and reject; Keycloak Admin users per tenant.

## 16.7 CI Gates

| Stage | Gate | Required to pass |
|-------|------|------------------|
| Compile | `mvn -B verify` per module | Yes |
| Unit | All unit tests pass | Yes |
| Integration | All Testcontainers tests pass | Yes |
| Contract | Event schema compatibility and adapter stubs | Yes |
| Architecture | No cross-module imports or cross-schema SQL in the core (ADR-01) | Yes |
| Coverage | Line coverage on changed files | Warn (threshold not set) |
| Static analysis | Tool not pinned | Warn |
| E2E | Playwright specs of § 16.8 against SIT | Yes before promotion to UAT |

## 16.8 E2E Spec Traceability

> **Convention:** one spec per BRD use case, named `e2e/[key-lowercase]-uc-NN-[title-slug].spec.ts`. Every test carries its keyed use case and test case IDs as tags: Playwright `test('[TC name]', { tag: ['@REFUNDS/UC-04', '@REFUNDS/TC-DEC-01'] }, async ({ page }) => { ... })`. To re-run a failing UAT case or a production regression: `npx playwright test --grep "@REFUNDS/TC-DEC-01"`. No backend REST harness is needed: every case runs through the web app.

| Spec | Use cases (BRD) | UAT/BAT test cases (BRD) | Parts covered | Runner |
|------|-----------------|--------------------------|---------------|--------|
| `e2e/refunds-uc-01-request-a-refund.spec.ts` | [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) | [REFUNDS/TC-REQ-01](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02), [REFUNDS/TC-REQ-02](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02), [REFUNDS/TC-REQ-03](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02), [REFUNDS/TC-REQ-04](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02), [REFUNDS/TC-UIX-01](../brd-refunds-portal/16-uat-bat-test-cases.md#3-cross-cutting-uiux-standards-chunk-11) | steps 1-6, A1, E1, E2, AC-1, AC-2 | Playwright |
| `e2e/refunds-uc-02-track-refund-status-web-and-mobile.spec.ts` | [REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status-web-and-mobile) | [REFUNDS/TC-REQ-05](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02), [REFUNDS/TC-REQ-06](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02), [REFUNDS/TC-UIX-01](../brd-refunds-portal/16-uat-bat-test-cases.md#3-cross-cutting-uiux-standards-chunk-11) | steps 1-4, A1, AC-1 | Playwright |
| `e2e/refunds-uc-03-cancel-a-refund-request.spec.ts` | [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request) | [REFUNDS/TC-REQ-07](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02), [REFUNDS/TC-REQ-08](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02) | steps 1-5, E1, AC-1 | Playwright |
| `e2e/refunds-uc-04-approve-reject-refund.spec.ts` | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | [REFUNDS/TC-DEC-01](../brd-refunds-portal/16-uat-bat-test-cases.md#2-refund-decisions-uc-04-mk-03), [REFUNDS/TC-DEC-02](../brd-refunds-portal/16-uat-bat-test-cases.md#2-refund-decisions-uc-04-mk-03), [REFUNDS/TC-DEC-03](../brd-refunds-portal/16-uat-bat-test-cases.md#2-refund-decisions-uc-04-mk-03), [REFUNDS/TC-DEC-04](../brd-refunds-portal/16-uat-bat-test-cases.md#2-refund-decisions-uc-04-mk-03), [REFUNDS/TC-DEC-05](../brd-refunds-portal/16-uat-bat-test-cases.md#2-refund-decisions-uc-04-mk-03), [REFUNDS/TC-UIX-01](../brd-refunds-portal/16-uat-bat-test-cases.md#3-cross-cutting-uiux-standards-chunk-11) | steps 1-7, A1, A2, E1, BR-1, AC-1, AC-2 | Playwright |
| `e2e/loyalty-uc-01-view-points-balance.spec.ts` | [LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance) | Pending (BRD 16 not written) | steps 1-2, A1 | Playwright |
| `e2e/loyalty-uc-02-view-points-history.spec.ts` | [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) | Pending (BRD 16 not written) | steps 1-4, A1, BR-1 | Playwright |

**Not automated:** [REFUNDS/TC-NFR-01](../brd-refunds-portal/16-uat-bat-test-cases.md#4-nfr-acceptance-nfr-01-nfr-02) (BAT observation over the UAT period of REFUNDS/NFR-01; no use case; supported by the payout watchdog and reconciliation alerts), [REFUNDS/TC-NFR-02](../brd-refunds-portal/16-uat-bat-test-cases.md#4-nfr-acceptance-nfr-01-nfr-02) (BAT observation of REFUNDS/NFR-02 availability over the UAT period; no use case)

- The LOYALTY specs carry use case tags only (`@LOYALTY/UC-01`, `@LOYALTY/UC-02`) until LOYALTY BRD chunk 16 is written; test case tags are added on refresh.
- `@REFUNDS/TC-UIX-01` appears in three specs (its `Related UC` names REFUNDS/UC-01, REFUNDS/UC-02, and REFUNDS/UC-04); each checks the currency on its own screen, and `--grep "@REFUNDS/TC-UIX-01"` runs all three.
- REFUNDS/TC-DEC-04 runs in SIT with the CardPay stub refusing every attempt and `refunds-platform.payout.retry-window` shortened (assumption A-L06); the UAT run of the same case uses the CardPay sandbox and the ADR-10 window.

<!-- MASTER: refunds-platform-lld-master.md | PREV: 12-performance.md | NEXT: 14-frontend.md -->

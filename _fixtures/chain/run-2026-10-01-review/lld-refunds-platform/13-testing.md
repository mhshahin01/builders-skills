<!--
CHUNK: 13
TITLE: Testing
PROJECT: Refunds Platform
VERSION: 1.1
PART OF: LLD - Refunds Platform
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
| Contract | JSON Schema checks of every produced and consumed payload against the registry subjects (07 § 10.2); provider contract tests for API-01 to API-04 once their documentation exists (SDD AP-11) | API consumer/producer | < 10s each |
| End-to-end | Playwright (frontend) + REST harness (backend) | One BRD use case across services, tagged per § 16.8 | < 60s each |

Per service: refund-service and payout-service carry the most integration tests (outbox, inbox, idempotency, state machine, lease); loyalty-service focuses on the ledger invariant and replay; notification-service on dedup, encryption, and retries.

## 16.2 Unit Test Conventions

- Mock all collaborators (services, repos, Kafka, clock, UUID generator).
- Inject `Clock` and `IdGenerator` so time and IDs are deterministic.
- Test the happy path AND the failure path for every public method.
- For pattern-heavy classes (Strategy, Mediator, Chain), test each branch / handler in isolation: both `ResendGuard` strategies, each `MessageContentMapper`.

**Example:**

```java
class RefundRequestServiceImplTest {
  @Test
  void submit_sameKeySameBody_returnsCachedResponse() { ... }

  @Test
  void submit_validRequest_persistsSubmittedAndAppendsOutboxRow() { ... }

  @Test
  void submit_expectedAmountDiffers_throwsAmountMismatchException() { ... }
}

class BranchRefundServiceImplTest {
  @Test
  void decide_partialAmountEqualsRequested_throwsPartialAmountOutOfRangeException() { ... }

  @Test
  void decide_callerIsCustomer_throwsSelfDecisionForbiddenException() { ... }
}

class OutboxRelayTest {
  @Test
  void poll_brokerAcknowledges_marksRowProcessed() { ... }

  @Test
  void poll_sendFails_leavesRowUnprocessed() { ... }

  @Test
  void poll_sendTimesOut_leavesRowUnprocessed() { ... }

  @Test
  void poll_markProcessedFailsAfterAck_republishesRowOnNextPoll() { ... }
}

class PayoutServiceImplTest {
  @Test
  void settle_leaseLost_discardsOutcome() { ... }

  @Test
  void settle_failureAfterWindowNotHeld_failsAndAppendsPayoutFailedOnce() { ... }

  @Test
  void settle_failureOfAlreadyReportedPayout_reschedulesWithoutSecondPayoutFailed() { ... }
}

class TakebackCalculatorTest {
  @Test
  void pointsToTakeBack_partRefundWithCents_takesBackWholeEurosOnly() { ... }

  @Test
  void pointsToTakeBack_refundsAboveEarned_capsAtRemainder() { ... }

  @Test
  void pointsToTakeBack_lastRefundCompletesPurchase_takesBackAllRemainingPoints() { ... }
}
```

## 16.3 Integration Test Conventions

- Spin up PostgreSQL + Kafka via Testcontainers.
- Apply Flyway migrations on container startup.
- Each test runs in its own transaction; rolls back at the end (or uses Testcontainers' fresh-database-per-test mode).
- Test the controller-to-DB-to-Kafka flow end-to-end.
- Outbox flow tests use a fresh database per test, not rollback, because the publisher reads only committed rows. Verify the outbox row is written in the aggregate's transaction; consume from Kafka, assert payload shape, then assert the row's `processed_at` is set. With Kafka stopped, the row stays unprocessed and is published once Kafka is back. (Here the column is `published_at`.)
- Tests connect as the `_app` and `_worker` roles, never as the owner, so row-level security is exercised; every repository test runs for `tenant_a` and asserts `tenant_b` rows are invisible.
- The in-process publication log is tested with a fresh database: commit the PAID transaction, assert one incomplete `event_publication` row, let the dispatcher run, assert the take-back and the completion; kill the dispatcher mid-way and assert the replay job completes it once.
- The `RefundPaid` listener and the purchase import are run concurrently on one purchase (SDD §17.4 Developer Notes): with the receipt lock, the take-back is applied exactly once whichever commits first, and a refund paid before the purchase is applied by the import in `paid_at` order.

**Example:**

```java
@SpringBootTest
@Testcontainers
class RefundDecisionIntegrationTest {
  @Container static PostgreSQLContainer<?> db = ...;
  @Container static KafkaContainer kafka = ...;

  @Test
  void decide_approveFull_commitsApprovedAndPublishesRefundApproved() { ... }

  @Test
  void payoutSucceeded_deliveredTwice_marksPaidOnceAndRecordsOneRefundPaid() { ... }
}
```

## 16.4 Contract Tests

- Provider tests: each producing deployable validates every outbox payload it writes against the registry subject of 07 § 10.2 (version 1.0.0 of the ratified SDD §14.9 contracts), amounts as decimal strings included.
- Consumer tests: each consumer deserializes the SDD §14.9 sample of every event it reads, plus the sample with one extra unknown field (additive-change safety) and, for the five refund events, the sample without the conditional `customerContact`.
- CI gate: contract verification runs on every PR, including the registry compatibility check (additive only).
- External providers: API-01 to API-04 get consumer-side contract tests against the provider documentation once supplied; until then, adapter tests run against stubs.

> Confirm: provider contract tests against the external APIs need a tool (Pact or Spring Cloud Contract, both new dependencies) or the providers' own sandboxes; pick one when the API documentation arrives.

## 16.5 Frontend Tests (if applicable)

- Unit / component: Jest + Angular Testing Library; one spec per component / service / pipe.
- End-to-end: Playwright; one spec per BRD use case, named and tagged per § 16.8 (with no source BRD: one spec per critical user journey).
- Accessibility: axe-core checks integrated into Playwright runs (CLAUDE.md WCAG 2.1 AA).
- Responsive: every customer and member spec also runs at a phone viewport (REFUNDS 11 and LOYALTY 11: screens work on phones and computers).

## 16.6 Test Data Strategy

- **Builders:** every aggregate type has a `@TestBuilder` class for fixture creation (`RefundRequestBuilder`, `PayoutBuilder`, `PointsMovementBuilder`).
- **Tenant fixtures:** `tenant_a`, `tenant_b` baseline tenants in test data - used to verify tenant isolation by negative test.
- **Time:** `Clock` injected; tests use `Clock.fixed(...)` for deterministic timestamps (the 30-day window at day 30 and day 31, the retry window edge and the first post-window attempt, the whole-euro and take-back cap boundaries).
- **IDs:** UUIDv7 generator can be replaced with a deterministic sequence in tests.
- **Providers:** stubs for API-01 to API-04 in Dev ([SDD §19](../sdd-refunds-platform/15-environments.md#19-environments)); the CardPay stub refuses, times out, and accepts on demand (REFUNDS UAT prerequisite P4); the API-04 stub serves the member purchases a test sets, with their receipt numbers and report times, and holds one back until the test releases it (LOYALTY prerequisite P6).
- **UAT data:** the prerequisites P1 to P4 of [REFUNDS 16 § Test environment and data prerequisites](../brd-refunds-portal/16-uat-bat-test-cases.md#test-environment-and-data-prerequisites) and P1 to P8 of [LOYALTY 16 § Test environment and data prerequisites](../brd-loyalty-points/16-uat-bat-test-cases.md#test-environment-and-data-prerequisites); how UAT stages LOYALTY P5, P6, and P8 is NEEDS CLARIFICATION in SDD §19.

## 16.7 CI Gates

| Stage | Gate | Required to pass |
|-------|------|------------------|
| Compile | `mvn compile` / `gradle build` (build tool open, 03 § 6.3) | Yes |
| Unit | All unit tests pass | Yes |
| Integration | All integration tests pass | Yes |
| Contract | All contracts verified, registry compatibility check green | Yes |
| E2E | § 16.8 specs green in SIT | Yes for promotion to UAT (SDD §11.3) |
| Coverage | 80% line coverage on changed files | Warn |
| Static analysis | The team's analyzer (tool NEEDS CLARIFICATION with the SDD §6 CI/CD row) | Warn |
| Image and dependency scan | Critical findings block promotion (SDD §11.6) | Yes |

## 16.8 E2E Spec Traceability

> **Convention:** one spec per BRD use case, named `e2e/[key-lowercase]-uc-NN-[title-slug].spec.ts`. Every test carries its keyed use case and test case IDs as tags: Playwright `test('[TC name]', { tag: ['@[KEY]/UC-NN', '@[KEY]/TC-[AREA]-NN'] }, async ({ page }) => { ... })`; a backend REST harness (JUnit 5) uses `@Tag("[KEY]/UC-NN")` and `@Tag("[KEY]/TC-[AREA]-NN")`. To re-run a failing UAT case or a production regression: `npx playwright test --grep "@[KEY]/TC-[AREA]-NN"`, or the JUnit Platform tag filter (the `groups` parameter of Maven Surefire or Failsafe).

| Spec | Use cases (BRD) | UAT/BAT test cases (BRD) | Parts covered | Runner |
|------|-----------------|--------------------------|---------------|--------|
| `e2e/refunds-uc-01-request-a-refund.spec.ts` | [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) | [REFUNDS/TC-REQ-01](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02), [REFUNDS/TC-REQ-02](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02), [REFUNDS/TC-REQ-03](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02), [REFUNDS/TC-REQ-04](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02), [REFUNDS/TC-UIX-01](../brd-refunds-portal/16-uat-bat-test-cases.md#3-cross-cutting-uiux-standards-chunk-11) | steps 1-6, A1, E1, E2, AC-1: recorded as Submitted with a reference number, AC-2: told the window has passed | Playwright |
| `e2e/refunds-uc-02-track-refund-status-web-and-mobile.spec.ts` | [REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status-web-and-mobile) | [REFUNDS/TC-REQ-05](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02), [REFUNDS/TC-REQ-06](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02), [REFUNDS/TC-UIX-01](../brd-refunds-portal/16-uat-bat-test-cases.md#3-cross-cutting-uiux-standards-chunk-11) | steps 1-4, A1, BR-1: own requests only, AC-1: Approved with the approval date | Playwright |
| `e2e/refunds-uc-03-cancel-a-refund-request.spec.ts` | [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request) | [REFUNDS/TC-REQ-07](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02), [REFUNDS/TC-REQ-08](../brd-refunds-portal/16-uat-bat-test-cases.md#1-refund-requests-uc-01-uc-02-uc-03-scr-01-scr-02) | steps 1-5, E1, BR-1: only Submitted requests can be cancelled, AC-1: becomes Cancelled | Playwright |
| `e2e/refunds-uc-04-approve-reject-refund.spec.ts` | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | [REFUNDS/TC-DEC-01](../brd-refunds-portal/16-uat-bat-test-cases.md#2-refund-decisions-uc-04-mk-03), [REFUNDS/TC-DEC-02](../brd-refunds-portal/16-uat-bat-test-cases.md#2-refund-decisions-uc-04-mk-03), [REFUNDS/TC-DEC-03](../brd-refunds-portal/16-uat-bat-test-cases.md#2-refund-decisions-uc-04-mk-03), [REFUNDS/TC-DEC-04](../brd-refunds-portal/16-uat-bat-test-cases.md#2-refund-decisions-uc-04-mk-03), [REFUNDS/TC-DEC-05](../brd-refunds-portal/16-uat-bat-test-cases.md#2-refund-decisions-uc-04-mk-03), [REFUNDS/TC-UIX-01](../brd-refunds-portal/16-uat-bat-test-cases.md#3-cross-cutting-uiux-standards-chunk-11) | steps 1-7, A1, A2, E1, BR-1: own branch only, BR-2: partial amount range, BR-3: rejection reason, AC-1: payout sent and customer told, AC-2: branch manager told when the payout still fails | Playwright |
| `e2e/loyalty-uc-01-view-points-balance.spec.ts` | [LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance) | [LOYALTY/TC-ACC-01](../brd-loyalty-points/16-uat-bat-test-cases.md#1-member-access-uc-01-uc-02-lp-01-lp-02), [LOYALTY/TC-ACC-02](../brd-loyalty-points/16-uat-bat-test-cases.md#1-member-access-uc-01-uc-02-lp-01-lp-02), [LOYALTY/TC-BAL-01](../brd-loyalty-points/16-uat-bat-test-cases.md#2-points-balance-uc-01-lp-01), [LOYALTY/TC-BAL-02](../brd-loyalty-points/16-uat-bat-test-cases.md#2-points-balance-uc-01-lp-01), [LOYALTY/TC-BAL-03](../brd-loyalty-points/16-uat-bat-test-cases.md#2-points-balance-uc-01-lp-01), [LOYALTY/TC-BAL-04](../brd-loyalty-points/16-uat-bat-test-cases.md#2-points-balance-uc-01-lp-01), [LOYALTY/TC-UIX-01](../brd-loyalty-points/16-uat-bat-test-cases.md#5-cross-cutting-uiux-standards-chunk-11), [LOYALTY/TC-UIX-03](../brd-loyalty-points/16-uat-bat-test-cases.md#5-cross-cutting-uiux-standards-chunk-11), [LOYALTY/TC-NFR-01](../brd-loyalty-points/16-uat-bat-test-cases.md#6-nfr-acceptance-nfr-01nfr-03) | steps 1-2, A1, E1, BR-1: own points only, AC-1: 120 points and the date of the last movement, AC-2: no movements yet, AC-3: points cannot be shown | Playwright |
| `e2e/loyalty-uc-02-view-points-history.spec.ts` | [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) | [LOYALTY/TC-ACC-03](../brd-loyalty-points/16-uat-bat-test-cases.md#1-member-access-uc-01-uc-02-lp-01-lp-02), [LOYALTY/TC-ACC-04](../brd-loyalty-points/16-uat-bat-test-cases.md#1-member-access-uc-01-uc-02-lp-01-lp-02), [LOYALTY/TC-HIS-01](../brd-loyalty-points/16-uat-bat-test-cases.md#3-points-history-uc-02-lp-02), [LOYALTY/TC-HIS-02](../brd-loyalty-points/16-uat-bat-test-cases.md#3-points-history-uc-02-lp-02), [LOYALTY/TC-HIS-03](../brd-loyalty-points/16-uat-bat-test-cases.md#3-points-history-uc-02-lp-02), [LOYALTY/TC-HIS-04](../brd-loyalty-points/16-uat-bat-test-cases.md#3-points-history-uc-02-lp-02), [LOYALTY/TC-HIS-05](../brd-loyalty-points/16-uat-bat-test-cases.md#3-points-history-uc-02-lp-02), [LOYALTY/TC-HIS-06](../brd-loyalty-points/16-uat-bat-test-cases.md#3-points-history-uc-02-lp-02), [LOYALTY/TC-HIS-07](../brd-loyalty-points/16-uat-bat-test-cases.md#3-points-history-uc-02-lp-02), [LOYALTY/TC-PTS-01](../brd-loyalty-points/16-uat-bat-test-cases.md#4-points-earned-and-taken-back-uc-02-lp-02), [LOYALTY/TC-PTS-02](../brd-loyalty-points/16-uat-bat-test-cases.md#4-points-earned-and-taken-back-uc-02-lp-02), [LOYALTY/TC-PTS-03](../brd-loyalty-points/16-uat-bat-test-cases.md#4-points-earned-and-taken-back-uc-02-lp-02), [LOYALTY/TC-PTS-04](../brd-loyalty-points/16-uat-bat-test-cases.md#4-points-earned-and-taken-back-uc-02-lp-02), [LOYALTY/TC-PTS-05](../brd-loyalty-points/16-uat-bat-test-cases.md#4-points-earned-and-taken-back-uc-02-lp-02), [LOYALTY/TC-PTS-06](../brd-loyalty-points/16-uat-bat-test-cases.md#4-points-earned-and-taken-back-uc-02-lp-02), [LOYALTY/TC-PTS-07](../brd-loyalty-points/16-uat-bat-test-cases.md#4-points-earned-and-taken-back-uc-02-lp-02), [LOYALTY/TC-UIX-02](../brd-loyalty-points/16-uat-bat-test-cases.md#5-cross-cutting-uiux-standards-chunk-11), [LOYALTY/TC-UIX-04](../brd-loyalty-points/16-uat-bat-test-cases.md#5-cross-cutting-uiux-standards-chunk-11), [LOYALTY/TC-NFR-01](../brd-loyalty-points/16-uat-bat-test-cases.md#6-nfr-acceptance-nfr-01nfr-03), [LOYALTY/TC-NFR-03](../brd-loyalty-points/16-uat-bat-test-cases.md#6-nfr-acceptance-nfr-01nfr-03), [LOYALTY/TC-NFR-04](../brd-loyalty-points/16-uat-bat-test-cases.md#6-nfr-acceptance-nfr-01nfr-03), [LOYALTY/TC-NFR-05](../brd-loyalty-points/16-uat-bat-test-cases.md#6-nfr-acceptance-nfr-01nfr-03) | steps 1-4, A1, A2, E1, BR-1: points taken back when the refund is reported paid, BR-2: own points only, BR-3: 1 point per whole euro refunded, never more than the purchase earned, BR-4: a refund reported before its purchase is kept, AC-1: -50 with the refund reference, AC-2: every movement, newest first, AC-3: the purchase detail, AC-4: the refund detail, AC-5: history cannot be shown, AC-6: 30.50 EUR refund of an 80-point purchase takes back 30, AC-7: movement details cannot be shown, AC-8: no movements yet | Playwright |

**Tags:** each test carries its use case tag and its test case tag, for example `test('Partial approval limits', { tag: ['@REFUNDS/UC-04', '@REFUNDS/TC-DEC-02'] }, ...)` or `test('Part refund takes back whole euros only', { tag: ['@LOYALTY/UC-02', '@LOYALTY/TC-PTS-03'] }, ...)`. The [REFUNDS/TC-UIX-01](../brd-refunds-portal/16-uat-bat-test-cases.md#3-cross-cutting-uiux-standards-chunk-11) test appears once in each of the REFUNDS/UC-01, REFUNDS/UC-02, and REFUNDS/UC-04 specs, and the [LOYALTY/TC-NFR-01](../brd-loyalty-points/16-uat-bat-test-cases.md#6-nfr-acceptance-nfr-01nfr-03) test once in each LOYALTY spec, tagged with that spec's use case.

**Not automated:** [REFUNDS/TC-NFR-01](../brd-refunds-portal/16-uat-bat-test-cases.md#4-nfr-acceptance-nfr-01-nfr-02) (BAT observation over the UAT period: compare approved and paid refunds; the `RefundPayoutOverdue` alert and the `payout_attempt` duplicate proxy support it), [REFUNDS/TC-NFR-02](../brd-refunds-portal/16-uat-bat-test-cases.md#4-nfr-acceptance-nfr-01-nfr-02) (BAT observation over the UAT period: the availability log), [LOYALTY/TC-NFR-02](../brd-loyalty-points/16-uat-bat-test-cases.md#6-nfr-acceptance-nfr-01nfr-03) (BAT observation over the UAT/BAT period: the complaint and error log of prerequisite P7). All three relate to NFRs, not to a use case.

> Confirm: [REFUNDS/TC-DEC-04](../brd-refunds-portal/16-uat-bat-test-cases.md#2-refund-decisions-uc-04-mk-03) is automated in the e2e environment with the CardPay stub refusing every payout and `PAYOUT_RETRY_WINDOW` shortened to 2 minutes there only; the real one-day window stays a UAT run with prerequisite P4.

> Confirm: the LOYALTY cases that need staging run against the e2e stubs, there only: P5 (points or history fail to show) by Playwright request interception answering 503 `UNAVAILABLE` for [LOYALTY/TC-BAL-04](../brd-loyalty-points/16-uat-bat-test-cases.md#2-points-balance-uc-01-lp-01), [LOYALTY/TC-HIS-06](../brd-loyalty-points/16-uat-bat-test-cases.md#3-points-history-uc-02-lp-02), and [LOYALTY/TC-HIS-07](../brd-loyalty-points/16-uat-bat-test-cases.md#3-points-history-uc-02-lp-02); P6 by the API-04 stub holding a purchase back for [LOYALTY/TC-NFR-04](../brd-loyalty-points/16-uat-bat-test-cases.md#6-nfr-acceptance-nfr-01nfr-03); P8 by the API-04 stub reporting a 10.00 EUR member purchase whose receipt the API-01 stub serves as two 6.00 EUR lines, for [LOYALTY/TC-PTS-07](../brd-loyalty-points/16-uat-bat-test-cases.md#4-points-earned-and-taken-back-uc-02-lp-02); and the one-hour waits of the LOYALTY cases poll with `LOYALTY_PURCHASE_IMPORT_CRON` shortened. The real one-hour timings stay UAT runs, and how UAT stages P5, P6, and P8 is NEEDS CLARIFICATION in SDD §19.

<!-- MASTER: refunds-platform-lld-master.md | PREV: 12-performance.md | NEXT: 14-frontend.md -->

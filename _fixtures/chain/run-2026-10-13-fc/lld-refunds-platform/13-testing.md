<!--
CHUNK: 13
TITLE: Testing
PROJECT: Refunds Platform
VERSION: 1.2
PART OF: LLD - Refunds Platform
-->

# 16. Testing

> **Conventions per CLAUDE.md:**
> - Backend: JUnit 5 + Mockito (unit), Testcontainers (integration).
> - Frontend: Jest (unit/component), Playwright (e2e).
> - Test naming: `methodName_scenario_expectedResult`.
> - No mocking repositories in integration tests; use real DB via Testcontainers.
> - A tool above that SDD §6 does not name is a new dependency: mark it `proposed; needs approval when the project's rules reserve new dependencies`. Here: Testcontainers and ArchUnit are SDD ADR-12 (Proposed); Jest and Playwright are not in SDD §6 and are proposed, need approval (`AGENTS.md`). Until approved, integration tests use the CI platform's PostgreSQL service (SDD ADR-12 fallback).

## 16.1 Test Pyramid (per service)

| Tier | Tooling | Scope | Speed target |
|------|---------|-------|--------------|
| Unit | JUnit 5 + Mockito | One class: aggregate transitions, eligibility rules, selectors, calculators, backoff, `sequence` checks | < 50ms each |
| Module | JUnit 5 + Spring Boot test slice per module, providers stubbed with `MockRestServiceServer` (Spring) | One module with its own schema; other modules' ports stubbed (SDD §17.1 Developer Notes) | < 5s each |
| Architecture | ArchUnit (proposed, ADR-12) | Module boundaries, `api`-only imports, `tenant_id` predicate in repository SQL, no `@Autowired` fields, records for DTOs | < 10s total |
| Integration | JUnit 5 + Testcontainers PostgreSQL 17 (proposed, ADR-12) | Whole deployable, real database, publication log, jobs, concurrency | < 10s each |
| Contract (provider) | Against the CardPay, MsgHub, POS Records, and IAM sandboxes once documented (SDD §17.2 Developer Notes) | Adapter wire mapping | Nightly |
| End-to-end | Playwright (proposed) + REST harness (JUnit 5) | One BRD use case across modules, tagged per § 16.8 | < 60s each |

## 16.2 Unit Test Conventions

- Mock collaborators (ports, repositories, `Clock`, `IdGenerator`); inject `Clock.fixed(...)` for dates (refund window, late flag, one-day still-failing, parking period, reporting start date).
- One test per BRD acceptance criterion in the module that owns the rule (SDD §17.1, §17.3, §17.4 Developer Notes).

```java
class RefundRequestTest {
  @Test void approve_loweredUnitAmountZero_throwsInvalidLoweredAmountException() { }
  @Test void approve_twoUnitsOneLowered_approvedAmountIsFullPlusLowered() { }      // REFUNDS/UC-04 AC-9: approved amount is full plus lowered
  @Test void cancel_requestApproved_throwsRequestAlreadyDecidedException() { }      // REFUNDS/UC-03 E1
  @Test void returnToApproved_requestPaid_movesToApprovedWithUnitsClaimed() { }     // REFUNDS/UC-04 AC-11: Paid payout sent back, request back to Approved
}
class PayoutServiceImplTest {
  @Test void recordResult_succeededFromStopped_publishesPayoutSucceededAndAlerts() { }
  @Test void recordResult_secondRefusal_doesNotPublishPayoutAttemptFailedAgain() { }
  @Test void recordResult_successOfReturnedRound_changesNothing() { }
}
class PayoutResolutionServiceImplTest {
  @Test void confirm_sameOperatorAsRecorder_throwsSamePersonConfirmationException() { }
}
class PublicationDispatcherTest {
  @Test void deliver_listenerCommits_marksListenerRowCompleted() { }
  @Test void deliver_listenerThrows_leavesRowIncompleteWithBackoff() { }
  @Test void deliver_markCompletedFailsAfterListenerCommit_redeliversOnNextRun() { }
  @Test void afterCommit_listenerOfSwitchedOffProduct_isNotDispatched() { }
}
class PointsTakeBackServiceImplTest {
  @Test void onRefundPaid_twoRefundsOverCap_takesBackAtMostEarned() { }                    // LOYALTY/UC-02 AC-12: take-back never exceeds earned
}
```

## 16.3 Integration Test Conventions

- One PostgreSQL 17 container per suite; migrations of all four schemas applied with the four module roles, so a cross-schema statement fails as in production.
- A fresh database per test class for publication-log, job, and concurrency tests (the dispatcher and jobs read only committed rows); rollback only for pure repository tests.
- Required scenarios (SDD §17.1 to §17.4 Developer Notes): concurrent submission of the same unit (one 201, one 409); the started-branch check; cancel racing a decision (one wins); duplicate `RefundRequestApproved` (one payout); the payout and dispute listeners of `refund-request` (payout sent back, dispute refunded, events out of order); payout unknown outcome and lease expiry; one-day still-failing; stop time; a dispute that holds, releases, or cancels a payout; a payout sent back; paid versus payout-delayed race (no delayed message after paid); one test per row of REFUNDS 03 Customer messages; duplicate `RefundRequestPaid` (one take-back); refund paid before the purchase arrives (parked, then applied); take-back cap; MsgHub outage (request unaffected).
- Further required scenarios: refund-request: `submit_replayWhilePosRecordsDown_returnsFirst201`, `submit_sameKeyOtherCaller_returns409Conflict`, `decide_sameKeyDifferentBody_returns409Conflict`, `submit_firstSubmissionOfNewTenant_allocatesReferenceOne`, `getCustomerContact_moduleIdentityOtherTenant_returnsNotFound`, `submit_dispatcherThrowsAfterCommit_returns201`; platform: `request_missingBearer_returns401ProblemDetails`, `submit_missingIdempotencyKey_returns400ValidationFailed`, `deliver_rowFromPreviousSchemaVersion_completes`; payout: `receive_duplicateProviderResultId_changesNothing`, `recordResult_refusalOnStopped_staysStopped`, `recordResult_refusalWhileNewerAttemptSending_staysSending`, `run_batchSlowerThanLease_sendsEachPayoutOnce`, `applyOpenResolutions_paidOnUnknown_publishesPayoutSucceeded`, `reconcile_failedDay_isRetriedNextRun`; customer-notification: `send_delayedMessageFailsAfterPaid_becomesSuperseded`, `send_alertOneRecipientRejected_isSent`, `send_breakerOpenForOneHour_messageStaysQueued`, `redrive_failedMessage_isSentOnce`; loyalty-points: `intake_twoFirstPurchasesSameMember_bothEarn`, `intake_purchaseBeforeStartWithParkedTakeBack_closesParkedNoMovement`; every retention and housekeeping job: `purge_moreRowsThanOneBatch_deletesAllInBatches`.
- Scenarios of the SDD v1.4 behaviour:
  - refund-request (started branch, out-of-order and stale events, sent back, disputes): `refundableItems_branchNotInStartedList_returns422BranchNotStarted`, `submit_branchRemovedFromStartedListAfterLookup_returns422BranchNotStarted`, `markPaid_olderPayoutSequence_changesNothing`, `markPaid_requestPaidAgainAfterPayoutReturned_publishesRefundRequestPaid`, `returnToApproved_paidRequest_publishesRefundRequestPayoutReturned`, `returnToApproved_olderSequenceThanPaid_changesNothing`, `rejectForRefundedDispute_approvedRequest_rejectsWithDisputeRefunded`, `recordOpened_afterClosedWithHigherSequence_staysClosed`, `getBranchDetail_openCardDispute_showsDispute`, `decide_openCardDispute_approves`, `gaugeSnapshot_approvedOverThreeDaysWithOpenDispute_isExcluded`, `rejectForRefundedDispute_paidRequestBeforePayoutReturnedHandled_rejectsAfterReturn`, `markPaid_payoutResolvedByHand_recordsBothOperators`, `report_paidSentBackAndPaidAgain_countsRequestOnceAsPaid`.
  - payout (dispute held, cancelled, refunded; payout sent back; operator resolution): `createForApproval_openDispute_createsHeldPayout`, `createForApproval_disputeRefundedBeforeApproval_createsCancelledPayout`, `recordNotice_closedRefused_releasesHeldPayoutDueNow`, `recordNotice_closedRefundedOnHeld_cancelsAndPublishesPayoutCancelled`, `recordNotice_closedRefundedOnUnknown_keepsUnknownAndAlerts`, `recordNotice_olderState_changesNothing`, `raiseStillFailing_heldTimeInRound_isNotCountedTowardOneDay`, `recordReturn_succeededPayout_startsNewRoundWithNewKey`, `recordReturn_sameReturnTwice_changesNothing`, `record_payoutNotUnknownOrStopped_returns409Conflict`, `confirm_sameOperatorAsRecorder_returns403SamePersonConfirmation`, `confirm_secondOperator_appliedByNextPayoutRetryRun`, `applyOpenResolutions_paidNotConfirmed_isNotApplied`, `applyOpenResolutions_notPaidWithRefundedDispute_cancelsPayout`, `expireLeases_firstAttemptOfRoundOne_publishesPayoutAttemptFailedOnce`, `record_unconfirmedPaidOpen_supersedesItAndRecordsNotPaid`, `applyOpenResolutions_unconfirmedPaidOnSucceededPayout_closesRow`, `recordReturn_paymentOfHandResolvedPayout_startsNewRound`, `confirm_differentCardPayReference_returns409Conflict`, `record_sameKeyReplay_returnsFirst201`, `confirm_sameKeyOtherOperator_returns409Conflict`, `receiveDisputeNotice_noMatchingSecret_returns401AndRecordsNothing`, `receiveDisputeNotice_tenantASecret_changesOnlyTenantAPayouts`, `claimDue_paymentLockHeldByRecordNotice_skipsRowThenHoldsIt`, `recordNotice_refundedWhileSendingThenRefused_cancelsAtNextClaim`, `disputeFetch_unmappableNoticeBeforeOpenedNotice_recordsOpenedNoticeAndKeepsCursor`, `disputeFetch_failedRun_nextRunFetchesWithoutWaitingForLease`, `record_concurrentWithConfirmOfOpenPaid_oneSucceedsOther409WithoutDeadlock`, `applyOpenResolutions_concurrentWithRecord_appliesNextRunWithoutDeadlock`, `disputeFetch_twoReplicasSameTenant_onlyOneCallsCardPay`, `disputeFetch_failureAfterSomeNotices_leavesCursorUnchanged`, `gaugeSnapshot_heldAndRetryingPayouts_reportsCountAndOldestAge`.
  - customer-notification (out-of-order and stale events, sent back): `select_staleRejectedAfterPaid_createsSupersededMessages`, `select_staleApproved_isStillSent`, `select_payoutReturnedAfterPaid_createsPayoutReturnedMessages`, `claimQueued_lowerSequenceMessagePending_waits`, `select_stillFailingAfterNewerPaid_createsSuperseded`, `select_disputeRefundedRejection_supersedesQueuedPayoutDelayed`, `select_stillFailingAfterDisputeRefundedRejection_createsSuperseded`, `gaugeSnapshot_queuedMessages_reportsOldestAgePerChannel`.
  - loyalty-points (outcome listeners, reporting start date, parking period): `onRefundPaid_olderSequenceThanRecordedOutcome_hasNoEffect`, `onRefundPaid_paidBeforeReportingStartDate_addsNoMovement`, `onRefundPaid_paidOnReportingStartDate_takesPointsBack`, `onRejected_disputeRefunded_addsNoMovement`, `onCancelled_recordsOutcomeWithNoMovement`, `onPayoutReturned_recordsOutcomeWithNoMovement`, `endExpiredParked_pastParkingPeriod_endsWithNoMovement`, `intake_lateForParkedTakeBack_incrementsLatePurchaseCounter`, `recordLeave_futureLeaveDate_keepsAccountOpenThroughThatDate`, `intake_purchaseArrivingAfterLeaveDate_earnsNoPoints`, `closeLeft_leaveDateToday_keepsAccountOpenAndPurchaseEarns`, `balance_leaveDatePassedBeforeCloseLeftRuns_returns403MembershipEnded`, `gaugeSnapshot_openParkedTakeBacks_reportsCount`, `onRefundPaid_paidOnLeaveDateProcessedAfterAccountClosed_takesPointsBack`, `listMovements_leaveDatePassedBeforeCloseLeftRuns_returns403MembershipEnded`, `getMovement_closedAccount_returns403MembershipEnded`, `onRefundPaid_paidOnLeaveDate_takesPointsBack`, `onRefundPaid_paidDayAfterLeaveDate_addsNoMovement`, `recordLeave_leaveDateToday_keepsAccountOpen`, `recordLeave_leaveDateYesterday_closesAccountAtOnce`.
  - platform (product switched off): `refundRequestEndpoint_refundsPortalSwitchedOff_returns404ProblemDetails`, `memberEndpoint_loyaltyPointsSwitchedOff_returns404ProblemDetails`, `redelivery_loyaltyPointsSwitchedOff_keepsRowsIncomplete`, `redelivery_loyaltyPointsSwitchedOn_deliversKeptOutcomes`, `start_bothProductsOnWithoutReportingStartDate_fails`, `tenantJobRun_providerCall_carriesNewRootTraceparent`, `lagGauge_rowsPublishedBeforeSwitchOn_ageCountsFromEnabledSince`, `lagGauge_productNeverSwitchedOn_reportsNothing`, `payoutOperatorEndpoint_refundsPortalSwitchedOff_returns404ProblemDetails`, `receive_disputeNoticeWhileRefundsPortalOff_recordsDisputeAndHoldsLaterPayout`.

```java
@SpringBootTest
@Testcontainers
class RefundSubmissionIntegrationTest {
  @Container static PostgreSQLContainer<?> db = new PostgreSQLContainer<>("postgres:17");
  @Test void submit_concurrentSameUnit_oneCreatedOneItemAlreadyRequested() { }
  @Test void submit_msgHubDown_requestRecordedAndMessageQueued() { }               // REFUNDS/UC-01 AC-4: recorded although messages fail
}
```

## 16.4 Contract Tests

- In-process: API-06 is a Java interface; `CustomerContactPortAdapterTest` checks its typed errors and the token check at the port.
- Providers: adapter tests against recorded provider examples with `MockRestServiceServer`, then against each sandbox once API-01, API-02, API-03, API-04, API-05, API-07, API-08, and API-09 are documented (SDD §15.6).
- CI gate: adapter tests run on every PR; sandbox tests nightly.
- `EventPayloadCompatibilityTest`: one checked-in JSON fixture per event and `event_publication.schema_version` value under `src/test/resources/events/<EventName>/v<N>.json`, deserialised by the current DTO record and handled by each listener in every build; a new schema version adds a fixture and never edits an older one. The same test fails when a DTO's current `SCHEMA_VERSION` has no fixture, or when the field names of that fixture differ from the record's components (a changed record without a raised version). It checks every event type the `ListenerRegistry` holds (the thirteen events of `07-event-contracts.md` § 10.6), never the list of fixture folders, and fails when a DTO record declares no `SCHEMA_VERSION`.
- `OpenApiCoverageTest` (Spring Boot test reading `RequestMappingHandlerMapping`): fails when a controller mapping is missing from the YAML or a YAML path has no mapping (`06-api-contracts.md` § 9).

## 16.5 Frontend Tests (if applicable)

- Unit / component: Jest (proposed) + Angular testing utilities; one spec per component, store, and guard, including the payout operator screens (`14-frontend.md` § 17.3).
- End-to-end: Playwright (proposed); one spec per BRD use case, named and tagged per § 16.8. The payout operator screens serve no BRD use case and have no spec in § 16.8; their flow is covered by the REST-harness integration scenarios of § 16.3.
- Accessibility: axe-core checks in Playwright runs (proposed; WCAG level open in REFUNDS 11).

## 16.6 Test Data Strategy

- **Builders:** `RefundRequestTestBuilder`, `PayoutTestBuilder`, `MessageTestBuilder`, `PointsAccountTestBuilder` (plain Java builders, no library).
- **Tenant fixtures:** `tenant_a`, `tenant_b`; every repository test also asserts that `tenant_b` rows are invisible to `tenant_a`.
- **Time:** `Clock` injected everywhere.
- **IDs:** the UUIDv7 generator is replaced by a deterministic sequence in tests.
- **Settings:** each integration suite sets `REFUNDS_PORTAL_ENABLED`, `LOYALTY_POINTS_ENABLED`, `REFUNDS_PORTAL_BRANCHES`, `LOYALTY_REFUND_REPORTING_START_DATE`, `REFUND_CONTACT_DETAILS_REQUIRED`, and `REFUND_WINDOW_CHECK_AT_SUBMIT` explicitly (`10-operations.md` § 13.1).

## 16.7 CI Gates

| Stage | Gate | Required to pass |
|-------|------|------------------|
| Compile | `mvn -B verify` (compile and unit) | Yes |
| Unit | All unit tests pass | Yes |
| Architecture | ArchUnit rules (once approved; code review until then) | Yes |
| Integration | All integration tests pass against PostgreSQL 17 | Yes |
| Contract | Adapter tests pass | Yes |
| Coverage | 80% line coverage on changed files | Warn |
| Static analysis | Open: scanning tools are the SDD §11.6 [NEEDS CLARIFICATION] | Open |

> TODO: the coverage threshold and the static-analysis tool are best guesses; the scanning tools and the blocking severity are the SDD [§11.6](../sdd-refunds-platform/07-cross-cutting-concerns.md#116-security-default) [NEEDS CLARIFICATION] (product owner) - verify.

## 16.8 E2E Spec Traceability

> **Convention:** one spec per BRD use case, named `e2e/[key-lowercase]-uc-NN-[title-slug].spec.ts`. Every test carries its keyed use case tag; test case tags are added when BRD chunk 16 is written (both BRDs: `Locked`). Playwright `test('[name]', { tag: ['@REFUNDS/UC-04'] }, async ({ page }) => { ... })`; the backend REST harness (JUnit 5) uses `@Tag("REFUNDS/UC-04")`. Re-run: `npx playwright test --grep "@REFUNDS/UC-04"`, or the JUnit Platform tag filter (the `groups` parameter of Maven Surefire or Failsafe).

| Spec | Use cases (BRD) | UAT/BAT test cases (BRD) | Parts covered | Runner |
|------|-----------------|--------------------------|---------------|--------|
| `e2e/refunds-uc-01-request-a-refund.spec.ts` | [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) | Pending (BRD 16 not written) | steps 1-7, A1, A2, E1, E2, E3, E4, E5, E6, AC-10: branch not started | Playwright |
| `e2e/refunds-uc-02-track-refund-status.spec.ts` | [REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status) | Pending (BRD 16 not written) | steps 1-4, A1 | Playwright |
| `e2e/refunds-uc-03-cancel-a-refund-request.spec.ts` | [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request) | Pending (BRD 16 not written) | steps 1-5, E1, BR-3: Loyalty Points told on cancellation, AC-3: Loyalty Points told, AC-4: outcome kept before Loyalty Points starts (the Loyalty Points outcome through the REST harness) | Playwright + REST harness |
| `e2e/refunds-uc-04-approve-reject-refund.spec.ts` | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | Pending (BRD 16 not written) | steps 1-9, A1, A2, E1, E2, E3, BR-8: payout waits for a card dispute, BR-9: Loyalty Points told the outcome, AC-2: still failing after one day, AC-8: refused payout, request stays Approved, AC-11: Paid payout sent back, request back to Approved, AC-12: no payout while the payment is disputed, AC-13: dispute refunded, request Rejected, AC-14: Loyalty Points told, AC-15: dispute shown, AC-16: payout sent after a refused dispute, AC-17: outcome kept before Loyalty Points starts (payout, dispute, and sent-back steps through the REST harness with a CardPay stub) | Playwright + REST harness |
| `e2e/loyalty-uc-01-view-points-balance.spec.ts` | [LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance) | Pending (BRD 16 not written) | steps 1-2, A1, E1, AC-6: zero sum shows 0 and the last date, AC-7: person who left sees no balance, AC-8: last movement date is the newest, AC-9: points cannot be used yet line | Playwright |
| `e2e/loyalty-uc-02-view-points-history.spec.ts` | [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) | Pending (BRD 16 not written) | steps 1-4, A1, A2, E1, BR-1: paid refund takes points back, BR-3: once per paid refund, BR-4: only purchases that earned points, BR-5: refund paid before earning, BR-6: take-back never exceeds earned, BR-7: only refunds the Refunds Portal reports, AC-13: person who left sees no history, AC-17: refund with no take-back after the wait, AC-18: refund paid before reporting starts takes back nothing, AC-19: refund paid on the reporting start date takes points back (take-back through the REST harness) | Playwright + REST harness |

**Not automated:** Pending (BRD 16 not written)

<!-- MASTER: refunds-platform-lld-master.md | PREV: 12-performance.md | NEXT: 14-frontend.md -->

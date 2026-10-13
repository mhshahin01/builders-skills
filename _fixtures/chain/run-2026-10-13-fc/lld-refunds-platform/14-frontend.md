<!--
CHUNK: 14
TITLE: Frontend (conditional - generate only when UI exists)
PROJECT: Refunds Platform
VERSION: 1.1
PART OF: LLD - Refunds Platform
-->

# 17. Frontend

> **Conventions per CLAUDE.md:**
> - Angular 17+, standalone components only (no NgModules).
> - `inject()` over constructor DI.
> - Signals for component state; NgRx SignalStore for shared/complex state; RxJS for streams only.
> - OnPush change detection by default.
> - Tailwind + PrimeNG (PrimeNG first, custom only when PrimeNG cannot do it).
> - Strict TypeScript, no `any`.
> - Routing via standalone APIs (`provideRouter`, `loadComponent`), no `RouterModule`.
> - A library above that SDD §6 does not name is a new dependency: Angular itself is SDD ADR-11 (Proposed: one web app for the customer, member, branch manager, and payout operator screens); PrimeNG, Tailwind, NgRx SignalStore, and an OIDC client library are not in SDD §6 and are proposed, need approval (`AGENTS.md`). Nothing in this chunk is built before the product owner approves ADR-11.

## 17.1 Module / Component Tree

```text
app-root (AppComponent, shell: header, tenant branding, sign-in state; one IAM realm for every person)
  |-- customer (lazy routes, role CUSTOMER)
  |     |-- RefundRequestFormComponent          /refunds/new
  |     |-- MyRefundRequestsComponent           /refunds
  |     |-- RefundRequestDetailComponent        /refunds/:refundRequestId (cancel dialog)
  |-- member (lazy routes, role MEMBER)
  |     |-- PointsBalanceComponent              /points
  |     |-- PointsHistoryComponent              /points/history
  |     |-- PointsMovementDetailComponent       /points/history/:movementId
  |-- manager (lazy routes, role BRANCH_MANAGER)
  |     |-- BranchRefundRequestListComponent    /manager/refund-requests
  |     |-- BranchRefundDecisionComponent       /manager/refund-requests/:refundRequestId (card dispute notice)
  |     |-- BranchRefundReportComponent         /manager/refund-report
  |-- operator (lazy routes, role PAYOUT_OPERATOR)
  |     |-- PayoutResolutionListComponent       /operator/payouts
  |     |-- PayoutResolutionRecordComponent     /operator/payouts/:payoutId/resolutions/new
  |     |-- PayoutResolutionConfirmComponent    /operator/payouts/:payoutId/resolutions/:resolutionId/confirmation
  |-- shared
        |-- components (MoneyComponent, ProblemMessageComponent, EmptyStateComponent, TimingNoteComponent)
        |-- services (ApiClient, AuthService, UseCaseTelemetry, GlobalErrorHandler)
```

`ApiClient`: an HTTP interceptor sets `X-Correlation-Id` (`crypto.randomUUID()`) and a W3C `traceparent` on every request and attaches both to the error report of a failed call. A product that is switched off answers 404 on its endpoints (`09-cross-cutting.md` § 12.9), which its screens show as the not-found page.

## 17.2 State Management Boundaries

| Boundary | Mechanism | Examples |
|----------|-----------|----------|
| Component-local state | Signal | Selected units, lowered amounts, form values, dialog state |
| Feature-shared state | NgRx SignalStore (proposed) | `RefundRequestsStore` (own list and cursor), `BranchQueueStore`, `PointsStore`, `PayoutResolutionStore` (operator list, cursor, selected payout) |
| Streams | RxJS | HTTP calls through `ApiClient`, debounce of the receipt number field |

## 17.3 Routing

| Route | Component | Screen (BRD) | Use cases (BRD) | Guards | Lazy-loaded? |
|-------|-----------|--------------|-----------------|--------|--------------|
| `/refunds/new` | `RefundRequestFormComponent` | [REFUNDS/MK-01](../brd-refunds-portal/14-todo.md#mockup-coverage) | [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) | `authGuard('CUSTOMER')` | Yes (`loadComponent`) |
| `/refunds` | `MyRefundRequestsComponent` | [REFUNDS/MK-02](../brd-refunds-portal/14-todo.md#mockup-coverage) | [REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status), [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request) | `authGuard('CUSTOMER')` | Yes |
| `/refunds/:refundRequestId` | `RefundRequestDetailComponent` | [REFUNDS/MK-02](../brd-refunds-portal/14-todo.md#mockup-coverage) | [REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status), [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request) | `authGuard('CUSTOMER')` | Yes |
| `/manager/refund-requests` | `BranchRefundRequestListComponent` | [REFUNDS/MK-03](../brd-refunds-portal/14-todo.md#mockup-coverage) | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | `authGuard('BRANCH_MANAGER')` | Yes |
| `/manager/refund-requests/:refundRequestId` | `BranchRefundDecisionComponent` | [REFUNDS/MK-03](../brd-refunds-portal/14-todo.md#mockup-coverage) | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | `authGuard('BRANCH_MANAGER')` | Yes |
| `/manager/refund-report` | `BranchRefundReportComponent` | [REFUNDS/MK-04](../brd-refunds-portal/14-todo.md#mockup-coverage) | None - no BRD use case ([REFUNDS 09 § Reporting / Analytics](../brd-refunds-portal/09-reporting-and-analytics.md#reporting--analytics)) | `authGuard('BRANCH_MANAGER')` | Yes |
| `/operator/payouts` | `PayoutResolutionListComponent` | None - no BRD screen ([REFUNDS 03 § Decision record](../brd-refunds-portal/03-definitions-and-domain-concepts.md#decision-record)) | None - no BRD screen ([REFUNDS 03 § Decision record](../brd-refunds-portal/03-definitions-and-domain-concepts.md#decision-record)) | `authGuard('PAYOUT_OPERATOR')` | Yes |
| `/operator/payouts/:payoutId/resolutions/new` | `PayoutResolutionRecordComponent` | None - no BRD screen ([REFUNDS 03 § Decision record](../brd-refunds-portal/03-definitions-and-domain-concepts.md#decision-record)) | None - no BRD screen ([REFUNDS 03 § Decision record](../brd-refunds-portal/03-definitions-and-domain-concepts.md#decision-record)) | `authGuard('PAYOUT_OPERATOR')` | Yes |
| `/operator/payouts/:payoutId/resolutions/:resolutionId/confirmation` | `PayoutResolutionConfirmComponent` | None - no BRD screen ([REFUNDS 03 § Decision record](../brd-refunds-portal/03-definitions-and-domain-concepts.md#decision-record)) | None - no BRD screen ([REFUNDS 03 § Decision record](../brd-refunds-portal/03-definitions-and-domain-concepts.md#decision-record)) | `authGuard('PAYOUT_OPERATOR')` | Yes |
| `/points` | `PointsBalanceComponent` | [LOYALTY/MK-01](../brd-loyalty-points/14-todo.md#mockup-coverage) | [LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance) | `authGuard('MEMBER')` | Yes |
| `/points/history` | `PointsHistoryComponent` | [LOYALTY/MK-02](../brd-loyalty-points/14-todo.md#mockup-coverage) | [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) | `authGuard('MEMBER')` | Yes |
| `/points/history/:movementId` | `PointsMovementDetailComponent` | [LOYALTY/MK-02](../brd-loyalty-points/14-todo.md#mockup-coverage) | [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) | `authGuard('MEMBER')` | Yes |
| `/auth/callback` | `AuthCallbackComponent` | None - platform page | None - platform page | - | Yes |
| `/` | `HomeComponent` | None - platform page | None - platform page | - | Yes |
| `**` | `NotFoundComponent` | None - platform page | None - platform page | - | Yes |

> Confirm: route paths, components, and which route implements which MK row are this LLD's design choices (from-sdd), including the three payout operator routes, which serve [payout § Workflow: Payout resolution](./04-implementation/payout.md#workflow-payout-resolution); the screens' use cases are read from the BRDs' chunk 14 Mockup coverage rows.

REFUNDS/MK-03 lists two states that come from the payout: "card dispute shown (E3)" and "payout delayed or sent back (E1)". The decision screen (`/manager/refund-requests/:refundRequestId`) shows the open card dispute: `BranchRefundRequestDetail.openCardDispute`, set by `refund-request`'s `getBranchDetail` from the open rows of its dispute copy ([refund-request § 7.3](./04-implementation/refund-request.md#refunddecisionserviceimplgetbranchdetail)), is shown as a notice, and the approve dialog says the payout waits until the bank decides (REFUNDS/UC-04 BR-8: payout waits for a card dispute). "Payout delayed or sent back (E1)" is still not shown on a screen in this release: the branch routes serve Submitted requests, `refund-request` does not handle the payout failure events (SDD §17.1 Paid), and a request whose payout was sent back is Approved again, which no branch route lists. REFUNDS/UC-04 E1 reaches the branch manager as the `PAYOUT_STILL_FAILING_ALERT` email of `customer-notification` ([customer-notification § 7.8](./04-implementation/customer-notification.md#participates-in-refundsuc-04-approve--reject-refund)). The mismatch is a REFUNDS chunk 14 follow-up for the BRD owner; a screen for it needs an SDD change (payout status port).

The payout operator screens list `Stopped` and `Unknown` payouts (`GET /v1/payouts`), record a resolution, and confirm a paid resolution another operator recorded; SDD §17.2 has no single-payout read, so the record and confirm screens take the selected payout from `PayoutResolutionStore`, filled by the list, and a reload returns to the list.

**Use-case context at runtime.** Every route that implements a BRD screen carries it in its route data, with its use cases when the BRD names them; the report route carries `screen` only, and the payout operator routes and the platform pages carry no route data:

```ts
export const routes: Routes = [
  { path: 'refunds/new', loadComponent: () => import('./customer/refund-request-form.component').then(m => m.RefundRequestFormComponent),
    canActivate: [authGuard('CUSTOMER')], data: { screen: 'REFUNDS/MK-01', useCases: ['REFUNDS/UC-01'] } },
  { path: 'refunds', loadComponent: () => import('./customer/my-refund-requests.component').then(m => m.MyRefundRequestsComponent),
    canActivate: [authGuard('CUSTOMER')], data: { screen: 'REFUNDS/MK-02', useCases: ['REFUNDS/UC-02', 'REFUNDS/UC-03'] } },
  { path: 'refunds/:refundRequestId', loadComponent: () => import('./customer/refund-request-detail.component').then(m => m.RefundRequestDetailComponent),
    canActivate: [authGuard('CUSTOMER')], data: { screen: 'REFUNDS/MK-02', useCases: ['REFUNDS/UC-02', 'REFUNDS/UC-03'] } },
  { path: 'manager/refund-requests', loadComponent: () => import('./manager/branch-refund-request-list.component').then(m => m.BranchRefundRequestListComponent),
    canActivate: [authGuard('BRANCH_MANAGER')], data: { screen: 'REFUNDS/MK-03', useCases: ['REFUNDS/UC-04'] } },
  { path: 'manager/refund-requests/:refundRequestId', loadComponent: () => import('./manager/branch-refund-decision.component').then(m => m.BranchRefundDecisionComponent),
    canActivate: [authGuard('BRANCH_MANAGER')], data: { screen: 'REFUNDS/MK-03', useCases: ['REFUNDS/UC-04'] } },
  { path: 'manager/refund-report', loadComponent: () => import('./manager/branch-refund-report.component').then(m => m.BranchRefundReportComponent),
    canActivate: [authGuard('BRANCH_MANAGER')], data: { screen: 'REFUNDS/MK-04' } },
  { path: 'operator/payouts', loadComponent: () => import('./operator/payout-resolution-list.component').then(m => m.PayoutResolutionListComponent),
    canActivate: [authGuard('PAYOUT_OPERATOR')] },
  { path: 'operator/payouts/:payoutId/resolutions/new', loadComponent: () => import('./operator/payout-resolution-record.component').then(m => m.PayoutResolutionRecordComponent),
    canActivate: [authGuard('PAYOUT_OPERATOR')] },
  { path: 'operator/payouts/:payoutId/resolutions/:resolutionId/confirmation', loadComponent: () => import('./operator/payout-resolution-confirm.component').then(m => m.PayoutResolutionConfirmComponent),
    canActivate: [authGuard('PAYOUT_OPERATOR')] },
  { path: 'points', loadComponent: () => import('./member/points-balance.component').then(m => m.PointsBalanceComponent),
    canActivate: [authGuard('MEMBER')], data: { screen: 'LOYALTY/MK-01', useCases: ['LOYALTY/UC-01'] } },
  { path: 'points/history', loadComponent: () => import('./member/points-history.component').then(m => m.PointsHistoryComponent),
    canActivate: [authGuard('MEMBER')], data: { screen: 'LOYALTY/MK-02', useCases: ['LOYALTY/UC-02'] } },
  { path: 'points/history/:movementId', loadComponent: () => import('./member/points-movement-detail.component').then(m => m.PointsMovementDetailComponent),
    canActivate: [authGuard('MEMBER')], data: { screen: 'LOYALTY/MK-02', useCases: ['LOYALTY/UC-02'] } },
  { path: 'auth/callback', loadComponent: () => import('./shell/auth-callback.component').then(m => m.AuthCallbackComponent) },
  { path: '', loadComponent: () => import('./shell/home.component').then(m => m.HomeComponent) },
  { path: '**', loadComponent: () => import('./shell/not-found.component').then(m => m.NotFoundComponent) },
];
```

The global `ErrorHandler` and the frontend telemetry read the data of the deepest active route and attach its `screen` to every error report and RUM span, and `use_case` only when that route has `useCases`, joined by commas in route-data order (`09-cross-cutting.md` § 12.8). The report route attaches `screen` only; platform pages and the payout operator routes attach neither.

## 17.4 PrimeNG Components Used

| Component | Used in | Notes |
|-----------|---------|-------|
| `p-table` | `MyRefundRequestsComponent`, `BranchRefundRequestListComponent`, `PointsHistoryComponent`, `PayoutResolutionListComponent` | Server-side cursor pagination ("load more"); fixed order per use case (payouts by payout id); sticky header; status filter on the payout list (`STOPPED`, `UNKNOWN`). Export, other filters, and per-user preferences wait for REFUNDS 11 and LOYALTY 11 answers |
| `p-checkbox` | `RefundRequestFormComponent` | Unit selection; disabled units show their reason (A1, A2, E6) |
| `p-inputNumber` | `BranchRefundDecisionComponent` | Lowered unit amount, locale currency format |
| `p-dialog` | `RefundRequestDetailComponent` (cancel), `BranchRefundDecisionComponent` (confirm amount, reject), `PayoutResolutionRecordComponent`, `PayoutResolutionConfirmComponent` | Cancel is a two-step confirm (REFUNDS/UC-03 steps 3-4); approve shows the amount to confirm (REFUNDS/UC-04 step 6); recording or confirming a resolution is a two-step confirm that repeats the outcome and the CardPay reference checked |
| `p-message` | All | Problem `detail` text, never codes; the open card dispute notice on `BranchRefundDecisionComponent` (REFUNDS/UC-04 E3) |

## 17.5 Theming

| Concern | Choice |
|---------|--------|
| Design tokens | `src/styles/tokens.css` (CSS custom properties consumed by the PrimeNG theme preset) |
| Tenant theming | Brand color, logo, product name from tenant configuration at runtime |
| Brand / key color | Open |
| Dark mode | No |

> TODO: the brand or key color is the SDD [§6 Frontend Stack](../sdd-refunds-platform/02-ecosystem-overview.md#6-ecosystem-overview) [NEEDS CLARIFICATION] (REFUNDS 11 and LOYALTY 11; product owner, not asked during this run per the project rules); tokens ship with a neutral placeholder value until it is set - verify.

## 17.6 i18n

- **Library:** `@angular/localize` (part of Angular).
- **String policy:** no string concatenation; all strings through i18n keys.
- **RTL support:** logical CSS properties only (`margin-inline-start`).
- **Locale formatting:** dates, numbers, and currency via the tenant locale, not the browser locale; amounts always show the currency (REFUNDS 11 Amounts); points are whole numbers with a minus sign for take-backs (LOYALTY 11).

> TODO: languages and the date and number formats are REFUNDS 11 and LOYALTY 11 [NEEDS CLARIFICATION]; best guess one language per tenant - verify.

## 17.7 Accessibility (WCAG 2.1 AA)

| Concern | Approach |
|---------|----------|
| Semantic HTML | Default; no `<div>` for buttons or links |
| Keyboard navigation | Every control reachable; dialogs trap focus and return it |
| Focus indicators | Visible at all times |
| Contrast | 4.5:1 minimum |
| Forms | Validate on blur; errors say how to fix (REFUNDS/UC-01 E3) |
| Empty / loading / error states | First-class: empty list (REFUNDS/UC-02 A1), no points yet (LOYALTY/UC-01 A1), "try again later" with no 0 balance or empty list (LOYALTY E1), empty report period (REFUNDS/MK-04), no payout to resolve |

> Confirm: WCAG 2.1 AA is the CLAUDE.md default; REFUNDS 11 leaves the standard and level open.

## 17.8 Form Conventions

- Validate on blur; errors explain how to fix.
- Required fields marked; optional ones are not.
- Destructive actions: cancel a refund request is a two-step confirm; reject requires a reason before the confirm button enables; recording and confirming a payout resolution are two-step confirms.
- Permissions drive the UI: the operator screens are hidden from every role but `PAYOUT_OPERATOR`; the confirm action is disabled, with a tooltip, for the operator who recorded the resolution (the server also refuses with 403 `SAME_PERSON_CONFIRMATION`); an own-request refusal of a decision (403 `OWN_REQUEST_DECISION`) is shown as a message that another decider acts.
- Every write sends a fresh `Idempotency-Key` (UUID) per user action and reuses it on a retry of the same action.

## 17.9 Component Architecture

- Presentational components (inputs and outputs only) and container components (store and API).
- Logic in services and stores, not templates.
- Strict TypeScript everywhere; API types are hand-written TypeScript interfaces mirroring the YAML schemas until a generator is approved (OQ-01).

<!-- MASTER: refunds-platform-lld-master.md | PREV: 13-testing.md | NEXT: 15-open-questions.md -->

<!--
CHUNK: 14
TITLE: Frontend (conditional - generate only when UI exists)
PROJECT: Refunds Platform
VERSION: 1.0
PART OF: LLD - Refunds Platform
NOTE: Present because the scope includes the Angular web app (SDD §2.1: one responsive web app with customer, member, and branch manager areas).
-->

# 17. Frontend

> **Conventions per CLAUDE.md (and SDD §6 Frontend Stack):**
> - Angular 17+, standalone components only (no NgModules).
> - `inject()` over constructor DI.
> - Signals for component state; NgRx SignalStore for shared/complex state; RxJS for streams only.
> - OnPush change detection by default.
> - Tailwind + PrimeNG (PrimeNG first, custom only when PrimeNG cannot do it).
> - Strict TypeScript, no `any`.
> - Routing via standalone APIs (`provideRouter`, `loadComponent`), no `RouterModule`.
> - Responsive: the customer and member screens work on phones and computers (REFUNDS 11, LOYALTY 11; SDD A-7).

## 17.1 Module / Component Tree

```text
AppComponent
  |-- AppShellComponent (header: tenant logo and product name, navigation per permission, language switch)
  |     |-- features/refunds-customer
  |     |     |-- RefundRequestFormComponent (container)   -> ReceiptLinesTableComponent, RefundAmountSummaryComponent
  |     |     |-- MyRefundRequestsComponent (container)    -> RefundRequestListComponent
  |     |     |-- RefundRequestDetailComponent (container) -> StatusTimelineComponent, CancelRequestDialogComponent
  |     |-- features/refunds-manager
  |     |     |-- BranchQueueComponent (container)         -> BranchQueueTableComponent
  |     |     |-- RefundDecisionComponent (container)      -> DecisionFormComponent, ConfirmAmountDialogComponent
  |     |     |-- BranchRefundReportComponent (container)  -> ReportSummaryComponent
  |     |-- features/points
  |           |-- PointsBalanceComponent (container)       -> BalanceCardComponent, HowToEarnComponent
  |           |-- PointsHistoryComponent (container)       -> MovementListComponent
  |           |-- PointsMovementDetailComponent (container)
  |-- AuthCallbackComponent, ForbiddenComponent, NotFoundComponent
  |-- core      (auth, tenant-config, route-context, telemetry, GlobalErrorHandler, HTTP interceptors)
  |-- shared    (MoneyPipe, TenantDatePipe, StatusTagComponent, EmptyStateComponent, ProblemMessageComponent)
```

## 17.2 State Management Boundaries

| Boundary | Mechanism | Examples |
|----------|-----------|----------|
| Component-local state | Signal | Selected receipt lines, reason text, partial amount, dialog visibility |
| Feature-shared state | NgRx SignalStore | `RefundRequestsStore` (own list and detail), `BranchQueueStore`, `PointsStore`, `SessionStore` (caller permissions, tenant configuration) |
| Streams | RxJS | HTTP calls (`HttpClient`), router events for the route context |

**HTTP layer:** typed services `RefundsApi` and `PointsApi` (hand-written against the OpenAPI file); interceptors add the bearer token, `X-Correlation-Id` (a new UUID per user action), and for the three POSTs an `Idempotency-Key` created once per user action with `crypto.randomUUID()` and reused on every retry of that action. A 409 `REQUEST_IN_PROGRESS` is retried after `Retry-After` without showing an error (SDD §17.1).

> Confirm: typed API services are hand-written rather than generated from the OpenAPI file, to avoid a generator dependency; switch when a generator is approved.

## 17.3 Routing

| Route | Component | Screen (BRD) | Use cases (BRD) | Guards | Lazy-loaded? |
|-------|-----------|--------------|-----------------|--------|--------------|
| `` (shell) | `AppShellComponent` | None - platform page | None - platform page | `authGuard` | No |
| `/auth/callback` | `AuthCallbackComponent` | None - platform page | None - platform page | - | Yes (`loadComponent`) |
| `/refunds/new` | `RefundRequestFormComponent` | [REFUNDS/SCR-01](../brd-refunds-portal/11-summary-and-uiux.md#screens) | [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) | `authGuard`, `permissionGuard('refund.request.create')` | Yes |
| `/refunds` | `MyRefundRequestsComponent` | [REFUNDS/SCR-02](../brd-refunds-portal/11-summary-and-uiux.md#screens) | [REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status-web-and-mobile), [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request) | `authGuard`, `permissionGuard('refund.request.read-own')` | Yes |
| `/refunds/:refundId` | `RefundRequestDetailComponent` | [REFUNDS/SCR-02](../brd-refunds-portal/11-summary-and-uiux.md#screens) | [REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status-web-and-mobile), [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request) | `authGuard`, `permissionGuard('refund.request.read-own')` | Yes |
| `/manager/refunds` | `BranchQueueComponent` | [REFUNDS/MK-03](../brd-refunds-portal/14-todo.md#mockup-coverage) | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | `authGuard`, `permissionGuard('refund.request.read-branch')` | Yes |
| `/manager/refunds/:refundId` | `RefundDecisionComponent` | [REFUNDS/MK-03](../brd-refunds-portal/14-todo.md#mockup-coverage) | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | `authGuard`, `permissionGuard('refund.request.decide')` | Yes |
| `/manager/reports/daily` | `BranchRefundReportComponent` | None - platform page (REFUNDS 09 daily report: no BRD screen ID or `MK-NN`) | None - platform page (no BRD use case) | `authGuard`, `permissionGuard('refund.report.read-branch')` | Yes |
| `/points` | `PointsBalanceComponent` | [LOYALTY/LP-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance) | [LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance) | `authGuard`, `permissionGuard('loyalty.balance.read-own')` | Yes |
| `/points/history` | `PointsHistoryComponent` | [LOYALTY/LP-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) | [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) | `authGuard`, `permissionGuard('loyalty.movement.read-own')` | Yes |
| `/points/history/:movementId` | `PointsMovementDetailComponent` | [LOYALTY/LP-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) | [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) | `authGuard`, `permissionGuard('loyalty.movement.read-own')` | Yes |
| `/forbidden` | `ForbiddenComponent` | None - platform page | None - platform page | - | Yes |
| `**` | `NotFoundComponent` | None - platform page | None - platform page | - | Yes |

Screen sources: `REFUNDS/SCR-01` and `REFUNDS/SCR-02` are defined in REFUNDS chunk 11 § Screens (which gives REFUNDS/SCR-02 to both REFUNDS/UC-02 and REFUNDS/UC-03); `REFUNDS/UC-04` has no screen ID, so its routes cite mockup `REFUNDS/MK-03` from REFUNDS chunk 14 Mockup coverage; `LOYALTY/LP-01` and `LOYALTY/LP-02` are defined in the LOYALTY use cases' UI/UX sections (LOYALTY chunk 11 has no screen table).

> Confirm: route paths and components are this LLD's design choice; verify them with the product owner and the Figma prototypes.

> Confirm: `/manager/reports/daily` serves the REFUNDS 09 daily branch refund report, which the BRD requires but no BRD use case, screen ID, or `MK-NN` covers; it is recorded as a platform page (no route data, no `use_case`) until the REFUNDS owner adds a screen or use case (a missing-scenario question, never a new UC).

**Use-case context at runtime.** Every route that implements a BRD screen carries it in its route data, so a frontend error report names the screen and the use case:

```ts
export const routes: Routes = [
  { path: 'auth/callback', loadComponent: () => import('./core/auth/auth-callback.component').then(m => m.AuthCallbackComponent) },
  { path: '', component: AppShellComponent, canActivate: [authGuard], children: [
    { path: 'refunds/new', canActivate: [permissionGuard('refund.request.create')],
      loadComponent: () => import('./features/refunds-customer/refund-request-form.component').then(m => m.RefundRequestFormComponent),
      data: { screen: 'REFUNDS/SCR-01', useCases: ['REFUNDS/UC-01'] } },
    { path: 'refunds', canActivate: [permissionGuard('refund.request.read-own')],
      loadComponent: () => import('./features/refunds-customer/my-refund-requests.component').then(m => m.MyRefundRequestsComponent),
      data: { screen: 'REFUNDS/SCR-02', useCases: ['REFUNDS/UC-02', 'REFUNDS/UC-03'] } },
    { path: 'refunds/:refundId', canActivate: [permissionGuard('refund.request.read-own')],
      loadComponent: () => import('./features/refunds-customer/refund-request-detail.component').then(m => m.RefundRequestDetailComponent),
      data: { screen: 'REFUNDS/SCR-02', useCases: ['REFUNDS/UC-02', 'REFUNDS/UC-03'] } },
    { path: 'manager/refunds', canActivate: [permissionGuard('refund.request.read-branch')],
      loadComponent: () => import('./features/refunds-manager/branch-queue.component').then(m => m.BranchQueueComponent),
      data: { screen: 'REFUNDS/MK-03', useCases: ['REFUNDS/UC-04'] } },
    { path: 'manager/refunds/:refundId', canActivate: [permissionGuard('refund.request.decide')],
      loadComponent: () => import('./features/refunds-manager/refund-decision.component').then(m => m.RefundDecisionComponent),
      data: { screen: 'REFUNDS/MK-03', useCases: ['REFUNDS/UC-04'] } },
    { path: 'manager/reports/daily', canActivate: [permissionGuard('refund.report.read-branch')],
      loadComponent: () => import('./features/refunds-manager/branch-refund-report.component').then(m => m.BranchRefundReportComponent) },
    { path: 'points', canActivate: [permissionGuard('loyalty.balance.read-own')],
      loadComponent: () => import('./features/points/points-balance.component').then(m => m.PointsBalanceComponent),
      data: { screen: 'LOYALTY/LP-01', useCases: ['LOYALTY/UC-01'] } },
    { path: 'points/history', canActivate: [permissionGuard('loyalty.movement.read-own')],
      loadComponent: () => import('./features/points/points-history.component').then(m => m.PointsHistoryComponent),
      data: { screen: 'LOYALTY/LP-02', useCases: ['LOYALTY/UC-02'] } },
    { path: 'points/history/:movementId', canActivate: [permissionGuard('loyalty.movement.read-own')],
      loadComponent: () => import('./features/points/points-movement-detail.component').then(m => m.PointsMovementDetailComponent),
      data: { screen: 'LOYALTY/LP-02', useCases: ['LOYALTY/UC-02'] } },
    { path: 'forbidden', loadComponent: () => import('./shell/forbidden.component').then(m => m.ForbiddenComponent) },
    { path: '**', loadComponent: () => import('./shell/not-found.component').then(m => m.NotFoundComponent) },
  ] },
];
```

`RouteContextService` listens to `NavigationEnd`, walks `router.routerState.snapshot.root` to the deepest child, and exposes a `routeContext` signal (`screen`, `useCases`). The global `GlobalErrorHandler` (`ErrorHandler`) and the frontend telemetry attach `screen` and `use_case` (the `useCases` joined with commas) to every error report and RUM span (`09-cross-cutting.md` § 12.8). Platform pages carry no such data. `refunds/new` is declared before `refunds/:refundId` so the static path wins.

> Confirm: the frontend telemetry (RUM) backend and SDK are not pinned (SDD §6 names OpenTelemetry for the backend only); the error handler writes to the console in Dev until one is approved.

## 17.4 PrimeNG Components Used

| Component | Used in | Notes |
|-----------|---------|-------|
| Table (`p-table`) | `BranchQueueTableComponent`, `RefundRequestListComponent`, `ReceiptLinesTableComponent`, `MovementListComponent` | Cursor pagination with a "Load more" action (SDD cursor API), `scrollable` with a sticky header, per-user state (`stateStorage="local"`, `stateKey` with the user's subject); the queue keeps the BRD's fixed order (REFUNDS/UC-04 step 2), so no client sorting |
| Checkbox | `ReceiptLinesTableComponent` | Lines with `refundable: false` shown disabled with a tooltip (REFUNDS/UC-01 A1) |
| Input number (currency mode) | `DecisionFormComponent` | Partial amount validated on blur: above 0 and below the requested amount (REFUNDS/UC-04 BR-2; see the REFUNDS/TC-DEC-02 flag in `04-implementation/refund-service.md` § 7.3) |
| Confirm dialog / Dialog | `CancelRequestDialogComponent`, `ConfirmAmountDialogComponent` | Two-step confirmation (REFUNDS/UC-03 step 3, REFUNDS/UC-04 step 4); the cancel dialog restates the reference number |
| Timeline | `StatusTimelineComponent` | Status history with dates (REFUNDS/UC-02 step 4) |
| Tag | `StatusTagComponent` | Request status; "payout failed" flag in the queue (REFUNDS/UC-04 E1) |
| Message / Toast | `ProblemMessageComponent` | Problem Details shown as a localized message keyed by `errorCode`; never raw codes or stack traces |

> **Not provided:** bulk actions (bulk approval is a REFUNDS/UC-04 future enhancement) and CSV/Excel export (no BRD asks for it), although CLAUDE.md lists them for data tables (see the flag in `06-api-contracts.md` § 9.4).

## 17.5 Theming

| Concern | Choice |
|---------|--------|
| Design tokens | `web-app/src/styles/tokens.css` (CSS custom properties) feeding the PrimeNG theme preset and Tailwind's theme; no raw hex in components |
| Tenant theming | Brand color, logo, product name, and locale from `assets/tenant-config.json`, mounted per environment from Helm values and loaded before bootstrap (an `APP_INITIALIZER`, or `provideAppInitializer` on Angular 19+) |
| Dark mode | No (not requested) |

> TODO: the brand key color is `[NEEDS CLARIFICATION]` in SDD §6; best guess a neutral placeholder token (`--brand-primary`) that each tenant's configuration overrides - verify with the product owner (CLAUDE.md asks for the key color before UI work).

> Confirm: tenant configuration served as a static per-environment file is an LLD choice (no endpoint for it exists in the SDD, and one tenant is live today, A-3).

## 17.6 i18n

- **Library:** `@angular/localize` (first party), one build per locale (English and Arabic) served under a locale path; the tenant configuration picks the default locale.
- **String policy:** no string concatenation; every string is an i18n message with named placeholders.
- **RTL support:** `dir="rtl"` set from the locale; logical CSS properties only (`margin-inline-start`, not `margin-left`); Tailwind logical utilities (`ms-*`, `me-*`).
- **Locale formatting:** amounts with their currency code through `MoneyPipe` (`Intl.NumberFormat` with the tenant locale and the amount's currency, REFUNDS 11); points as whole numbers with a minus sign for take-backs (LOYALTY 11); dates through `TenantDatePipe` in the tenant locale and time zone, not the browser's (CLAUDE.md).

> Confirm: build-time `@angular/localize` needs one deployment per locale; a runtime switch without rebuilds would need a runtime translation library (a new dependency).

## 17.7 Accessibility (WCAG 2.1 AA)

| Concern | Approach |
|---------|----------|
| Semantic HTML | Native elements; tables with captions and header cells |
| Keyboard navigation | Every action reachable by keyboard; dialogs trap and restore focus |
| Focus indicators | Visible focus ring from the design tokens |
| Contrast | 4.5:1 minimum, checked against each tenant's brand color at configuration time |
| Forms | Validate on blur; errors say how to fix and are announced (`aria-live="polite"`) |
| Empty / loading / error states | First-class: "no refund requests yet" (REFUNDS/UC-02 A1), "no points yet" with how to earn (LOYALTY/UC-01 A1), skeleton loaders, actionable errors |

## 17.8 Form Conventions

- Validate on blur; errors explain how to fix.
- Required fields are marked with an asterisk and a legend on every form; optional fields are never marked.
- Destructive or money-moving actions use a two-step confirmation showing what will happen (cancel: the reference number; approve: the amount and currency), never a generic "Are you sure?".
- Reasons are required where the BRD requires them (reject, partial approval; REFUNDS/UC-04 A1, A2).

## 17.9 Component Architecture

- Presentational components are pure (inputs in, outputs out); containers own store access and side effects.
- Logic lives in stores and services, not templates.
- Permissions drive the UI: navigation entries are hidden for roles that can never use them; contextual restrictions (a request no longer SUBMITTED) disable the action with a tooltip explaining why.
- Strict TypeScript everywhere; no `any`.

<!-- MASTER: refunds-platform-lld-master.md | PREV: 13-testing.md | NEXT: 15-open-questions.md -->

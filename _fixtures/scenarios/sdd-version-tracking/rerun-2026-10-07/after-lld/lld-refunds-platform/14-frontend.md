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

One Angular web app, `refunds-platform-web`, for customers, members, and branch managers, served as static assets per tenant host ([SDD §2.1](../sdd-refunds-platform/01-executive-summary-scope-risks.md#21-in-scope), [SDD §8.1.3](../sdd-refunds-platform/04-architecture-style-and-diagrams.md#813-how)); it works on phones and computers ([REFUNDS 11 § UI/UX Expectations](../brd-refunds-portal/11-summary-and-uiux.md#uiux-expectations), [LOYALTY 11 § UI/UX Expectations](../brd-loyalty-points/11-summary-and-uiux.md#uiux-expectations)).

## 17.1 Module / Component Tree

```text
app-root (AppComponent: shell, PrimeNG menubar filtered by role, tenant branding, locale)
  |-- auth
  |     |-- auth-callback (OIDC redirect target)
  |-- refunds (customer area, lazy)
  |     |-- refund-request-form           container: RefundRequestFormComponent
  |     |     |-- receipt-lookup           presentational
  |     |     |-- refundable-lines         presentational (checkbox per line, disabled when not refundable)
  |     |-- my-refund-requests             container: MyRefundRequestsComponent
  |     |-- refund-request-detail          container: RefundRequestDetailComponent (history timeline, cancel action)
  |-- branch (branch manager area, lazy)
  |     |-- branch-refund-queue            container: BranchRefundQueueComponent (Submitted and payout-failing tabs)
  |     |-- branch-refund-decision         container: BranchRefundDecisionComponent
  |     |-- branch-refund-report           container: BranchRefundReportComponent
  |-- points (member area, lazy)
  |     |-- points-balance                 container: PointsBalanceComponent
  |     |-- points-history                 container: PointsHistoryComponent
  |     |-- points-movement-detail         container: PointsMovementDetailComponent
  |-- shared
        |-- components: money-display, status-tag, problem-message, empty-state, loading-state, two-step-confirm
        |-- services: RefundsApi, BranchApi, PointsApi, AuthService, TenantConfigService, TelemetryService
        |-- interceptors: authInterceptor, correlationIdInterceptor, problemDetailsInterceptor
```

## 17.2 State Management Boundaries

| Boundary | Mechanism | Examples |
|----------|-----------|----------|
| Component-local state | Signal | Selected lines, the running `expectedAmount`, the pending `Idempotency-Key`, dialog visibility |
| Feature-shared state | NgRx SignalStore | `SessionStore` (user, roles, tenant config), `RefundRequestsStore`, `BranchQueueStore`, `PointsStore` |
| Streams | RxJS | HTTP responses, debounced receipt-number input |

**Idempotency-Key in the web app:** the form creates one UUID per user intent (submit, cancel, decision) and keeps it in a signal until the call succeeds or the body changes, so a retry after a network error reuses the key and replays the server's first response (09 § 12.2).

## 17.3 Routing

| Route | Component | Screen (BRD) | Use cases (BRD) | Guards | Lazy-loaded? |
|-------|-----------|--------------|-----------------|--------|--------------|
| `/` | `AppShellComponent` (redirects by role) | None - platform page | None - platform page | `authGuard` | No (shell) |
| `/auth/callback` | `AuthCallbackComponent` | None - platform page | None - platform page | - | Yes |
| `/refunds/new` | `RefundRequestFormComponent` | [REFUNDS/SCR-01](../brd-refunds-portal/14-todo.md#mockup-coverage) | [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) | `authGuard`, `roleGuard('CUSTOMER')` | Yes (`loadComponent`) |
| `/refunds` | `MyRefundRequestsComponent` | [REFUNDS/SCR-02](../brd-refunds-portal/14-todo.md#mockup-coverage) | [REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status-web-and-mobile), [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request) | `authGuard`, `roleGuard('CUSTOMER')` | Yes |
| `/refunds/:refundRequestId` | `RefundRequestDetailComponent` | [REFUNDS/SCR-02](../brd-refunds-portal/14-todo.md#mockup-coverage) | [REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status-web-and-mobile), [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request) | `authGuard`, `roleGuard('CUSTOMER')` | Yes |
| `/branch/refund-requests` | `BranchRefundQueueComponent` | [REFUNDS/MK-03](../brd-refunds-portal/14-todo.md#mockup-coverage) | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | `authGuard`, `roleGuard('BRANCH_MANAGER')` | Yes |
| `/branch/refund-requests/:refundRequestId` | `BranchRefundDecisionComponent` | [REFUNDS/MK-03](../brd-refunds-portal/14-todo.md#mockup-coverage) | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | `authGuard`, `roleGuard('BRANCH_MANAGER')` | Yes |
| `/branch/refund-report` | `BranchRefundReportComponent` | None - no BRD screen (the [REFUNDS 09](../brd-refunds-portal/09-reporting-and-analytics.md#reporting--analytics) report; not a platform page) | None - no BRD screen ([REFUNDS 09](../brd-refunds-portal/09-reporting-and-analytics.md#reporting--analytics)) | `authGuard`, `roleGuard('BRANCH_MANAGER')` | Yes |
| `/points` | `PointsBalanceComponent` | [LOYALTY/LP-01](../brd-loyalty-points/14-todo.md#mockup-coverage) | [LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance) | `authGuard`, `roleGuard('MEMBER')` | Yes |
| `/points/history` | `PointsHistoryComponent` | [LOYALTY/LP-02](../brd-loyalty-points/14-todo.md#mockup-coverage) | [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) | `authGuard`, `roleGuard('MEMBER')` | Yes |
| `/points/history/:movementId` | `PointsMovementDetailComponent` | [LOYALTY/LP-02](../brd-loyalty-points/14-todo.md#mockup-coverage) | [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) | `authGuard`, `roleGuard('MEMBER')` | Yes |
| `/forbidden` | `ForbiddenComponent` | None - platform page | None - platform page | - | Yes |
| `**` | `NotFoundComponent` | None - platform page | None - platform page | - | Yes |

**Screen sources:** `REFUNDS/SCR-01` and `REFUNDS/SCR-02` are screen IDs the REFUNDS BRD text carries (its chunk 11 Screens table and each use case's UI/UX section), linked to the chunk 11 Screens heading; `REFUNDS/MK-03` is the REFUNDS chunk 14 Mockup coverage row of the decision screen, which has no screen ID yet; `LOYALTY/LP-01` and `LOYALTY/LP-02` are screen IDs the LOYALTY use cases' UI/UX sections carry, linked to those headings. Each screen's use cases are read from those rows (`REFUNDS/SCR-02` serves REFUNDS/UC-02 and REFUNDS/UC-03, so both of its routes list both).

> Confirm: route paths and components are this LLD's design; `REFUNDS/MK-03` (named "Branch manager decision screen") is assigned to both the queue and the decision routes because REFUNDS/UC-04 steps 1-2 (the queue) have no other screen in the BRD, and `LOYALTY/LP-02` covers both the history list and the movement detail (LOYALTY/UC-02 steps 3-4).

**Use-case context at runtime.** Every route that implements a BRD screen carries it in its route data, so a frontend error report names the screen and the use case:

```ts
export const routes: Routes = [
  {
    path: 'refunds/new',
    canActivate: [authGuard, roleGuard('CUSTOMER')],
    loadComponent: () => import('./refunds/refund-request-form.component').then(m => m.RefundRequestFormComponent),
    data: { screen: 'REFUNDS/SCR-01', useCases: ['REFUNDS/UC-01'] },
  },
  {
    path: 'refunds/:refundRequestId',
    canActivate: [authGuard, roleGuard('CUSTOMER')],
    loadComponent: () => import('./refunds/refund-request-detail.component').then(m => m.RefundRequestDetailComponent),
    data: { screen: 'REFUNDS/SCR-02', useCases: ['REFUNDS/UC-02', 'REFUNDS/UC-03'] },
  },
  {
    path: 'branch/refund-requests/:refundRequestId',
    canActivate: [authGuard, roleGuard('BRANCH_MANAGER')],
    loadComponent: () => import('./branch/branch-refund-decision.component').then(m => m.BranchRefundDecisionComponent),
    data: { screen: 'REFUNDS/MK-03', useCases: ['REFUNDS/UC-04'] },
  },
  {
    path: 'points/history',
    canActivate: [authGuard, roleGuard('MEMBER')],
    loadComponent: () => import('./points/points-history.component').then(m => m.PointsHistoryComponent),
    data: { screen: 'LOYALTY/LP-02', useCases: ['LOYALTY/UC-02'] },
  },
  { path: 'refunds', data: { screen: 'REFUNDS/SCR-02', useCases: ['REFUNDS/UC-02', 'REFUNDS/UC-03'] } },
  { path: 'branch/refund-requests', data: { screen: 'REFUNDS/MK-03', useCases: ['REFUNDS/UC-04'] } },
  { path: 'points', data: { screen: 'LOYALTY/LP-01', useCases: ['LOYALTY/UC-01'] } },
  { path: 'points/history/:movementId', data: { screen: 'LOYALTY/LP-02', useCases: ['LOYALTY/UC-02'] } },
];
```

The other BRD-screen routes follow the same pattern with the values of the table (`/refunds`: `REFUNDS/SCR-02`, `['REFUNDS/UC-02', 'REFUNDS/UC-03']`; `/branch/refund-requests`: `REFUNDS/MK-03`, `['REFUNDS/UC-04']`; `/points`: `LOYALTY/LP-01`, `['LOYALTY/UC-01']`; `/points/history/:movementId`: `LOYALTY/LP-02`, `['LOYALTY/UC-02']`). `/branch/refund-report` and the platform pages carry no such data.

The global `ErrorHandler` and the frontend telemetry read the data of the deepest active route and attach `screen` and `use_case` to every error report and RUM span (`09-cross-cutting.md` § 12.8). Platform pages carry no such data.

> Confirm: the OIDC client library (for example `angular-oauth2-oidc` or `keycloak-angular`) and the browser telemetry SDK (OpenTelemetry web) are new frontend dependencies; CLAUDE.md asks before adding them.

## 17.4 PrimeNG Components Used

| Component | Used in | Notes |
|-----------|---------|-------|
| Table (`p-table`) | `MyRefundRequestsComponent`, `BranchRefundQueueComponent`, `PointsHistoryComponent` | Server-side pagination (lazy load), sortable columns (allow-listed, 06 § 9.4), sticky header, per-user preferences through the table's state storage keyed by user id; CSV export of the loaded page; no bulk actions (bulk approval is a REFUNDS/UC-04 future enhancement) |
| Checkbox | `RefundRequestFormComponent` | One per refundable line; disabled with a tooltip for lines already refunded (REFUNDS/UC-01 A1) |
| InputNumber (currency mode) | `BranchRefundDecisionComponent` | Partial amount in the request currency, 2 decimals displayed |
| Textarea | Form reason, decision reason | Max 500 characters, counter shown |
| Dialog | `RefundRequestDetailComponent` (cancel), `BranchRefundDecisionComponent` (confirm amount, reject) | Two-step confirmation naming the reference number and amount; destructive actions never use a generic "Are you sure?" (CLAUDE.md) |
| Tag | Status everywhere | Status label plus icon, never colour alone |
| Timeline | `RefundRequestDetailComponent` | Status history with dates and the rejection reason (REFUNDS/UC-02 step 4) |
| Message, Skeleton | All containers | Error (from ProblemDetails `detail`), loading, and empty states |
| DatePicker | `BranchRefundReportComponent` | Report day in the tenant time zone |

> Confirm: the datatable export covers only the loaded page, because the SDD defines no export endpoint; a full export needs a new SDD endpoint.

## 17.5 Theming

| Concern | Choice |
|---------|--------|
| Design tokens | One PrimeNG theme preset plus the Tailwind config generated from the same token file (`src/theme/tokens.json`); no raw hex in components |
| Tenant theming | Brand color, logo, product name from tenant config at runtime (`/tenant-config.json` per host, A-07), applied as CSS custom properties before the first render |
| Dark mode | No (not required by either BRD) |

> TODO: the primary brand colour is NEEDS CLARIFICATION in [SDD §6](../sdd-refunds-platform/02-ecosystem-overview.md#6-ecosystem-overview) Frontend Stack row, and CLAUDE.md asks for the key colour before UI work; the token file uses a neutral placeholder palette until it is given - verify with the product owner.

## 17.6 i18n

- **Library:** `@angular/localize` (or `ngx-translate`); one build per supported locale, the host's `tenant-config.json` names the locale to load.
- **String policy:** no string concatenation. All strings via i18n keys; ProblemDetails `detail` is shown as the server localises it.
- **RTL support:** logical CSS properties only (`margin-inline-start`, not `margin-left`); full Arabic support.
- **Locale formatting:** dates, numbers, currency formatted via tenant locale (not browser locale, per CLAUDE.md); every amount shows its currency code (REFUNDS 11; [REFUNDS/TC-UIX-01](../brd-refunds-portal/16-uat-bat-test-cases.md#3-cross-cutting-uiux-standards-chunk-11)); points are whole numbers with a minus sign on negatives (LOYALTY 11).

## 17.7 Accessibility (WCAG 2.1 AA)

| Concern | Approach |
|---------|----------|
| Semantic HTML | Default; no `<div>` for buttons / links |
| Keyboard navigation | Every interactive element reachable via keyboard |
| Focus indicators | Visible at all times |
| Contrast | 4.5:1 minimum, checked against the tenant brand colour at load (fallback to the default token when it fails) |
| Forms | Validate on blur; errors explain how to fix |
| Empty / loading / error states | First-class - never expose stack traces |

## 17.8 Form Conventions

- Validate on blur.
- Errors explain how to fix.
- One convention for required vs optional, applied uniformly: every field is required unless labelled "(optional)".
- Destructive actions: typed-name or two-step confirm (no generic "Are you sure?"): cancelling a request and rejecting one use a two-step dialog that names the reference number and the amount.
- The receipt form shows the server's refundable amount per line and the sum of the selection before submit (REFUNDS/UC-01 step 4); a 409 `CONFLICT` reloads the lines and asks the customer to review.

## 17.9 Component Architecture

- Presentational vs Container split.
- Logic in services / stores, not templates.
- Strict TypeScript everywhere.
- Permissions drive the UI: navigation entries are hidden for roles the user does not hold; the decision buttons are disabled with a tooltip when the request is no longer Submitted (contextual restriction).
- `authInterceptor` adds the bearer token, `correlationIdInterceptor` adds `X-Correlation-Id`, `problemDetailsInterceptor` turns `application/problem+json` into a typed `Problem` shown by `problem-message`.

<!-- MASTER: refunds-platform-lld-master.md | PREV: 13-testing.md | NEXT: 15-open-questions.md -->

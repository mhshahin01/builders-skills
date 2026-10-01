<!--
CHUNK: 14
TITLE: Frontend (conditional - generate only when UI exists)
PROJECT: Refunds Platform
VERSION: 1.0
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

Design: [SDD §6 Frontend Stack row](../sdd-refunds-platform/02-ecosystem-overview.md#6-ecosystem-overview) (Angular 17+, Tailwind + PrimeNG, responsive for phones and computers); one web app serves customers, members, and branch managers, signing in with OIDC authorization code and PKCE (ADR-07).

## 17.1 Module / Component Tree

```text
app-root
  |-- app-shell (header, role-based navigation, sign-out)
  |-- refunds (customer, lazy)
  |     |-- refund-request-form          (receipt lookup, line selection, reason, submit)
  |     |-- refund-request-list
  |     |-- refund-request-detail        (status history, cancel action)
  |-- manager (branch manager, lazy)
  |     |-- branch-refund-queue
  |     |-- refund-decision              (approve in full or in part, reject)
  |     |-- branch-refund-report
  |-- points (member, lazy)
  |     |-- points-balance
  |     |-- points-history
  |     |-- points-movement-detail
  |-- shared
        |-- components (money-display, status-tag, problem-message, cursor-table)
        |-- services (api clients, auth, telemetry, error-handler)
```

## 17.2 State Management Boundaries

| Boundary | Mechanism | Examples |
|----------|-----------|----------|
| Component-local state | Signal | Selected lines and their total, decision form, confirmation step |
| Feature-shared state | NgRx SignalStore | `SessionStore` (principal, roles, tenant locale and currency), `RefundListStore`, `BranchQueueStore` (cursor pages) |
| Streams | RxJS | HTTP responses, debounced receipt-number input |

## 17.3 Routing

| Route | Component | Screen (BRD) | Use cases (BRD) | Guards | Lazy-loaded? |
|-------|-----------|--------------|-----------------|--------|--------------|
| `/refunds/new` | `RefundRequestFormComponent` | [REFUNDS/SCR-01](../brd-refunds-portal/14-todo.md#mockup-coverage) | [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) | `authGuard`, `roleGuard('CUSTOMER')` | Yes (`loadComponent`) |
| `/refunds` | `RefundRequestListComponent` | [REFUNDS/SCR-02](../brd-refunds-portal/14-todo.md#mockup-coverage) | [REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status-web-and-mobile), [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request) | `authGuard`, `roleGuard('CUSTOMER')` | Yes |
| `/refunds/:refundId` | `RefundRequestDetailComponent` | [REFUNDS/SCR-02](../brd-refunds-portal/14-todo.md#mockup-coverage) | [REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status-web-and-mobile), [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request) | `authGuard`, `roleGuard('CUSTOMER')` | Yes |
| `/manager/refunds` | `BranchRefundQueueComponent` | [REFUNDS/MK-03](../brd-refunds-portal/14-todo.md#mockup-coverage) | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | `authGuard`, `roleGuard('BRANCH_MANAGER')` | Yes |
| `/manager/refunds/:refundId` | `RefundDecisionComponent` | [REFUNDS/MK-03](../brd-refunds-portal/14-todo.md#mockup-coverage) | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | `authGuard`, `roleGuard('BRANCH_MANAGER')` | Yes |
| `/manager/refund-report` | `BranchRefundReportComponent` | None - platform page | None - platform page | `authGuard`, `roleGuard('BRANCH_MANAGER')` | Yes |
| `/points` | `PointsBalanceComponent` | [LOYALTY/LP-01](../brd-loyalty-points/14-todo.md#mockup-coverage) | [LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance) | `authGuard`, `roleGuard('MEMBER')` | Yes |
| `/points/history` | `PointsHistoryComponent` | [LOYALTY/LP-02](../brd-loyalty-points/14-todo.md#mockup-coverage) | [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) | `authGuard`, `roleGuard('MEMBER')` | Yes |
| `/points/history/:movementId` | `PointsMovementDetailComponent` | [LOYALTY/LP-02](../brd-loyalty-points/14-todo.md#mockup-coverage) | [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) | `authGuard`, `roleGuard('MEMBER')` | Yes |
| `/` (empty path: shell, redirects by role) | `AppShellComponent` | None - platform page | None - platform page | `authGuard` | No |
| `/auth/callback` | `AuthCallbackComponent` | None - platform page | None - platform page | - | Yes |
| `**` | `NotFoundComponent` | None - platform page | None - platform page | - | Yes |

> Confirm: route paths and components are this LLD's design; `/manager/refunds` (the branch queue, REFUNDS/UC-04 steps 1-2) is mapped to REFUNDS/MK-03, which the BRD names the decision screen, as part of the same flow.

> Confirm: `/manager/refund-report` serves REFUNDS 09 Reporting, which has neither a use case nor a screen ID or `MK-NN` in the BRD; it is marked a platform page (a page no BRD use case needs) until the BRD gives it a screen.

> Confirm: the LOYALTY screens LOYALTY/LP-01 and LOYALTY/LP-02 are `In review` and not playable in LOYALTY chunk 14 (its delivery gate is shut); the routes follow their current rows and are re-checked when the mockups are approved.

**Use-case context at runtime.** Every route that implements a BRD screen carries it in its route data, so a frontend error report names the screen and the use case:

```ts
export const routes: Routes = [
  { path: 'refunds/new', loadComponent: () => import('./refunds/refund-request-form.component').then(m => m.RefundRequestFormComponent),
    canActivate: [authGuard, roleGuard('CUSTOMER')], data: { screen: 'REFUNDS/SCR-01', useCases: ['REFUNDS/UC-01'] } },
  { path: 'refunds', loadComponent: () => import('./refunds/refund-request-list.component').then(m => m.RefundRequestListComponent),
    canActivate: [authGuard, roleGuard('CUSTOMER')], data: { screen: 'REFUNDS/SCR-02', useCases: ['REFUNDS/UC-02', 'REFUNDS/UC-03'] } },
  { path: 'refunds/:refundId', loadComponent: () => import('./refunds/refund-request-detail.component').then(m => m.RefundRequestDetailComponent),
    canActivate: [authGuard, roleGuard('CUSTOMER')], data: { screen: 'REFUNDS/SCR-02', useCases: ['REFUNDS/UC-02', 'REFUNDS/UC-03'] } },
  { path: 'manager/refunds', loadComponent: () => import('./manager/branch-refund-queue.component').then(m => m.BranchRefundQueueComponent),
    canActivate: [authGuard, roleGuard('BRANCH_MANAGER')], data: { screen: 'REFUNDS/MK-03', useCases: ['REFUNDS/UC-04'] } },
  { path: 'manager/refunds/:refundId', loadComponent: () => import('./manager/refund-decision.component').then(m => m.RefundDecisionComponent),
    canActivate: [authGuard, roleGuard('BRANCH_MANAGER')], data: { screen: 'REFUNDS/MK-03', useCases: ['REFUNDS/UC-04'] } },
  { path: 'points', loadComponent: () => import('./points/points-balance.component').then(m => m.PointsBalanceComponent),
    canActivate: [authGuard, roleGuard('MEMBER')], data: { screen: 'LOYALTY/LP-01', useCases: ['LOYALTY/UC-01'] } },
  { path: 'points/history', loadComponent: () => import('./points/points-history.component').then(m => m.PointsHistoryComponent),
    canActivate: [authGuard, roleGuard('MEMBER')], data: { screen: 'LOYALTY/LP-02', useCases: ['LOYALTY/UC-02'] } },
  { path: 'points/history/:movementId', loadComponent: () => import('./points/points-movement-detail.component').then(m => m.PointsMovementDetailComponent),
    canActivate: [authGuard, roleGuard('MEMBER')], data: { screen: 'LOYALTY/LP-02', useCases: ['LOYALTY/UC-02'] } },
];
```

The global `ErrorHandler` and the frontend telemetry read the data of the deepest active route and attach `screen` and `use_case` to every error report and RUM span (`09-cross-cutting.md` § 12.8). Platform pages carry no such data.

## 17.4 PrimeNG Components Used

| Component | Used in | Notes |
|-----------|---------|-------|
| `<p-table>` | `RefundRequestListComponent`, `BranchRefundQueueComponent`, `PointsHistoryComponent` | Server-side cursor paging ("load more"), sticky header, fixed sort per the SDD (06 § 9.4); bulk actions and export not in this release |
| `<p-checkbox>` | `RefundRequestFormComponent` | Line selection; non-refundable lines shown disabled (REFUNDS/UC-01 A1) |
| `<p-inputNumber>` | `RefundDecisionComponent` | Partial amount in the tenant currency |
| `<p-confirmDialog>` | `RefundRequestDetailComponent`, `RefundDecisionComponent` | Two-step confirmation for cancel (REFUNDS/UC-03 step 3) and for approve or reject (CLAUDE.md destructive-action rule) |
| `<p-tag>` | Lists and details | Status with text, not colour alone |
| `<p-message>`, `<p-skeleton>` | All pages | Problem Details `detail` shown as the next step; loading and empty states |

## 17.5 Theming

| Concern | Choice |
|---------|--------|
| Design tokens | `src/styles/tokens.css` (color, spacing, typography), consumed by the PrimeNG theme preset and Tailwind config |
| Tenant theming | Brand color, logo, product name from tenant config at runtime |
| Dark mode | No (not requested by either BRD) |

> TODO: the brand key color is open in SDD §6 Frontend Stack row; best guess: a neutral blue primary until the tenant supplies it - verify.

## 17.6 i18n

- **Library:** `@angular/localize`.
- **String policy:** no string concatenation. All strings via i18n keys.
- **RTL support:** logical CSS properties only (`margin-inline-start`, not `margin-left`); full Arabic support.
- **Locale formatting:** dates, numbers, currency formatted via tenant locale (not browser locale, per CLAUDE.md); amounts always show the currency ([REFUNDS 11 § UI/UX Expectations](../brd-refunds-portal/11-summary-and-uiux.md#uiux-expectations)); points as whole numbers with a minus sign on negative movements ([LOYALTY 11 § UI/UX Expectations](../brd-loyalty-points/11-summary-and-uiux.md#uiux-expectations)).

> TODO: neither BRD names the languages to support; best guess: the tenant default locale only in this release, with RTL-ready layouts - verify.

## 17.7 Accessibility (WCAG 2.1 AA)

| Concern | Approach |
|---------|----------|
| Semantic HTML | Default; no `<div>` for buttons / links |
| Keyboard navigation | Every interactive element reachable via keyboard |
| Focus indicators | Visible at all times |
| Contrast | 4.5:1 minimum |
| Forms | Validate on blur; errors explain how to fix |
| Empty / loading / error states | First-class - never expose stack traces |

## 17.8 Form Conventions

- Validate on blur.
- Errors explain how to fix.
- One convention for required vs optional, applied uniformly: required fields are marked, optional fields are not.
- Destructive actions: typed-name or two-step confirm (no generic "Are you sure?"); cancel and reject use a two-step dialog that repeats the reference number.

## 17.9 Component Architecture

- Presentational vs Container split: route components are containers (store, API calls); `cursor-table`, `money-display`, `status-tag`, `problem-message` are presentational.
- Logic in services / stores, not templates.
- Strict TypeScript everywhere.

<!-- MASTER: refunds-platform-lld-master.md | PREV: 13-testing.md | NEXT: 15-open-questions.md -->

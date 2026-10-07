<!--
CHUNK: 14
TITLE: Frontend
PROJECT: Refunds Platform
VERSION: 1.0
PART OF: LLD - Refunds Platform
MODE: from-sdd
-->

# 17. Frontend

## 17.1 Module / Component Tree

Two Angular standalone app shells: Refunds Portal and Loyalty Points. Feature containers own request/balance/history/decision/correction/report state; presentational PrimeNG-backed components receive inputs and emit events. Backend scopes remain authoritative even when UI guards hide actions.

## 17.2 State Management Boundaries

Signals for feature/component state; inject() services for API access and tenant/theme context; RxJS for streams, OnPush, strict TypeScript with no any. No shared state store dependency is introduced for the small current views. A failed points request clears any previously shown current figure/history rather than treating stale content as current.

## 17.3 Routing

> Confirm: route paths, component names and guards are proposed LLD choices; verify with implementer. Screen and use-case mappings are read verbatim from BRD chunk 14.

| Route | Component | Screen (BRD) | Use cases (BRD) | Guards | Lazy-loaded? |
| --- | --- | --- | --- | --- | --- |
| `/refunds/request` | `RefundsRequestComponent` | [REFUNDS/MK-01](../brd-refunds-portal/14-todo.md#mockup-coverage) | [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund) | authGuard, tenantGuard, subjectGuard | Yes (loadComponent) |
| `/refunds/requests` | `RefundsRequestsComponent` | [REFUNDS/MK-02](../brd-refunds-portal/14-todo.md#mockup-coverage) | [REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status), [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request) | authGuard, tenantGuard, subjectGuard | Yes (loadComponent) |
| `/refunds/requests/:refundRequestId` | `RefundsRequestsDetailComponent` | [REFUNDS/MK-02](../brd-refunds-portal/14-todo.md#mockup-coverage) | [REFUNDS/UC-02](../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status), [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request) | authGuard, tenantGuard, subjectGuard | Yes (loadComponent) |
| `/refunds/branch` | `RefundsBranchComponent` | [REFUNDS/MK-03](../brd-refunds-portal/14-todo.md#mockup-coverage) | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | authGuard, tenantGuard, branchManagerGuard | Yes (loadComponent) |
| `/refunds/branch/:refundRequestId` | `RefundsBranchDetailComponent` | [REFUNDS/MK-03](../brd-refunds-portal/14-todo.md#mockup-coverage) | [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) | authGuard, tenantGuard, branchManagerGuard | Yes (loadComponent) |
| `/refunds/sign-up` | `RefundsSignUpComponent` | [REFUNDS/MK-04](../brd-refunds-portal/14-todo.md#mockup-coverage) | [REFUNDS/UC-06](../brd-refunds-portal/06a-use-cases-customer.md#uc-06-sign-up-and-sign-in) | publicTenantGuard | Yes (loadComponent) |
| `/refunds/sign-in` | `RefundsSignInComponent` | [REFUNDS/MK-04](../brd-refunds-portal/14-todo.md#mockup-coverage) | [REFUNDS/UC-06](../brd-refunds-portal/06a-use-cases-customer.md#uc-06-sign-up-and-sign-in) | publicTenantGuard | Yes (loadComponent) |
| `/refunds/password-reset` | `RefundsPasswordResetComponent` | [REFUNDS/MK-04](../brd-refunds-portal/14-todo.md#mockup-coverage) | [REFUNDS/UC-06](../brd-refunds-portal/06a-use-cases-customer.md#uc-06-sign-up-and-sign-in) | publicTenantGuard | Yes (loadComponent) |
| `/refunds/reports/branch` | `RefundsReportsBranchComponent` | [REFUNDS/MK-05](../brd-refunds-portal/14-todo.md#mockup-coverage) | None - no BRD use case ([REFUNDS report](../brd-refunds-portal/09-reporting-and-analytics.md#reporting--analytics)) | authGuard, tenantGuard, branchManagerGuard | Yes (loadComponent) |
| `/loyalty/balance` | `LoyaltyBalanceComponent` | [LOYALTY/MK-01](../brd-loyalty-points/14-todo.md#mockup-coverage) | [LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance) | authGuard, tenantGuard, subjectGuard | Yes (loadComponent) |
| `/loyalty/history` | `LoyaltyHistoryComponent` | [LOYALTY/MK-02](../brd-loyalty-points/14-todo.md#mockup-coverage) | [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) | authGuard, tenantGuard, subjectGuard | Yes (loadComponent) |
| `/loyalty/history/:movementId` | `LoyaltyHistoryDetailComponent` | [LOYALTY/MK-02](../brd-loyalty-points/14-todo.md#mockup-coverage) | [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) | authGuard, tenantGuard, subjectGuard | Yes (loadComponent) |
| `/loyalty/corrections` | `LoyaltyCorrectionsComponent` | [LOYALTY/MK-03](../brd-loyalty-points/14-todo.md#mockup-coverage) | [LOYALTY/UC-03](../brd-loyalty-points/06b-use-cases-loyalty-administrator.md#uc-03-correct-a-members-points) | authGuard, tenantGuard, loyaltyAdministratorGuard | Yes (loadComponent) |
| `/loyalty/corrections/:memberNumber` | `LoyaltyCorrectionsDetailComponent` | [LOYALTY/MK-03](../brd-loyalty-points/14-todo.md#mockup-coverage) | [LOYALTY/UC-03](../brd-loyalty-points/06b-use-cases-loyalty-administrator.md#uc-03-correct-a-members-points) | authGuard, tenantGuard, loyaltyAdministratorGuard | Yes (loadComponent) |
| `/loyalty/reports/corrections` | `LoyaltyReportsCorrectionsComponent` | [LOYALTY/MK-04](../brd-loyalty-points/14-todo.md#mockup-coverage) | None - no BRD use case ([LOYALTY report](../brd-loyalty-points/09-reporting-and-analytics.md#reporting--analytics)) | authGuard, tenantGuard, loyaltyAdministratorGuard | Yes (loadComponent) |

**Use-case context at runtime:** one explicit data entry per screen route; report routes carry screen only. Each app uses its own base path.

```ts
{ path: 'refunds/request', loadComponent: () => import('./refunds-request.component').then(m => m.RefundsRequestComponent), data: { screen: 'REFUNDS/MK-01', useCases: ['REFUNDS/UC-01'] } },
{ path: 'refunds/requests', loadComponent: () => import('./refunds-requests.component').then(m => m.RefundsRequestsComponent), data: { screen: 'REFUNDS/MK-02', useCases: ['REFUNDS/UC-02', 'REFUNDS/UC-03'] } },
{ path: 'refunds/requests/:refundRequestId', loadComponent: () => import('./refunds-requests-refundRequestId.component').then(m => m.RefundsRequestsDetailComponent), data: { screen: 'REFUNDS/MK-02', useCases: ['REFUNDS/UC-02', 'REFUNDS/UC-03'] } },
{ path: 'refunds/branch', loadComponent: () => import('./refunds-branch.component').then(m => m.RefundsBranchComponent), data: { screen: 'REFUNDS/MK-03', useCases: ['REFUNDS/UC-04'] } },
{ path: 'refunds/branch/:refundRequestId', loadComponent: () => import('./refunds-branch-refundRequestId.component').then(m => m.RefundsBranchDetailComponent), data: { screen: 'REFUNDS/MK-03', useCases: ['REFUNDS/UC-04'] } },
{ path: 'refunds/sign-up', loadComponent: () => import('./refunds-sign-up.component').then(m => m.RefundsSignUpComponent), data: { screen: 'REFUNDS/MK-04', useCases: ['REFUNDS/UC-06'] } },
{ path: 'refunds/sign-in', loadComponent: () => import('./refunds-sign-in.component').then(m => m.RefundsSignInComponent), data: { screen: 'REFUNDS/MK-04', useCases: ['REFUNDS/UC-06'] } },
{ path: 'refunds/password-reset', loadComponent: () => import('./refunds-password-reset.component').then(m => m.RefundsPasswordResetComponent), data: { screen: 'REFUNDS/MK-04', useCases: ['REFUNDS/UC-06'] } },
{ path: 'refunds/reports/branch', loadComponent: () => import('./refunds-reports-branch.component').then(m => m.RefundsReportsBranchComponent), data: { screen: 'REFUNDS/MK-05' } },
{ path: 'loyalty/balance', loadComponent: () => import('./loyalty-balance.component').then(m => m.LoyaltyBalanceComponent), data: { screen: 'LOYALTY/MK-01', useCases: ['LOYALTY/UC-01'] } },
{ path: 'loyalty/history', loadComponent: () => import('./loyalty-history.component').then(m => m.LoyaltyHistoryComponent), data: { screen: 'LOYALTY/MK-02', useCases: ['LOYALTY/UC-02'] } },
{ path: 'loyalty/history/:movementId', loadComponent: () => import('./loyalty-history-movementId.component').then(m => m.LoyaltyHistoryDetailComponent), data: { screen: 'LOYALTY/MK-02', useCases: ['LOYALTY/UC-02'] } },
{ path: 'loyalty/corrections', loadComponent: () => import('./loyalty-corrections.component').then(m => m.LoyaltyCorrectionsComponent), data: { screen: 'LOYALTY/MK-03', useCases: ['LOYALTY/UC-03'] } },
{ path: 'loyalty/corrections/:memberNumber', loadComponent: () => import('./loyalty-corrections-memberNumber.component').then(m => m.LoyaltyCorrectionsDetailComponent), data: { screen: 'LOYALTY/MK-03', useCases: ['LOYALTY/UC-03'] } },
{ path: 'loyalty/reports/corrections', loadComponent: () => import('./loyalty-reports-corrections.component').then(m => m.LoyaltyReportsCorrectionsComponent), data: { screen: 'LOYALTY/MK-04' } },
```

The error handler and RUM read deepest active route data, attach screen, and join useCases in order with commas and no spaces. Clear prior route attributes when navigating to a report or app shell.

## 17.4 PrimeNG Components Used

Table (server paging), Dialog for cancellation confirmation, InputText/InputNumber/Select, Button, Message/Toast, Skeleton. Theme tokens are shared; no raw color literals in components. UI guard names are LLD conventions; server checks still apply.

## 17.5 Theming

Use primary #1F6FEB from both BRD 11 chunks via a shared design token. Tenant brand color/logo/name arrive from runtime tenant configuration per CLAUDE.md; no new theme editor. A visible dark/light or preference feature is not added. Responsive desktop/tablet/mobile layouts follow approved MK rows.

## 17.6 i18n

English messages are externalized from day one; logical CSS preserves technical RTL readiness without shipping a new language. Refund dates/numbers use branch country and EUR; loyalty dates DD/MM/YYYY and money two decimals + EUR, negative points keep minus. No browser-locale substitution or concatenated translated strings.

## 17.7 Accessibility (WCAG 2.1 AA)

Semantic labels/headings, keyboard navigation, visible focus and 4.5:1 text contrast; dialog focus trap and restore; announce loading/error/state changes. Test responsive layouts, Zoom, keyboard and screen-reader flows, including inactive contextual actions and visible remedy text.

## 17.8 Form Conventions

Reactive typed forms validate on blur; required fields marked consistently with an asterisk and accessible text. Errors state how to fix; do not show raw errorCode. Cancel has an explicit confirmation; decision amounts/reasons follow source A1/A2. Role-ineligible actions hide; context-ineligible actions disable with explanation. Nonselectable items remain visible per REFUNDS A1.

## 17.9 Component Architecture

Presentational components are pure; containers/services own API calls, state and error handling. Lists remain short, paged and sortable as BRD 11 specifies. No user filters, history export, bulk actions or persistent preferences are introduced. Reports alone provide source CSV/Excel export. Loading, empty and unavailable states never share a misleading default numeric value.


<!-- MASTER: refunds-platform-lld-master.md | PREV: 13-testing.md | NEXT: 15-open-questions.md -->

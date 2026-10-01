<!--
CHUNK: 14
TITLE: Frontend (conditional - generate only when UI exists)
PROJECT: Refunds Platform
VERSION: 1.0
PART OF: LLD - Refunds Platform
NOTE: Present because the scope includes the Angular web app (SDD §2.1, §6 Frontend Stack).
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
>
> **Sources:** the screens are the BRDs' (REFUNDS SCR-01, SCR-02, MK-03; LOYALTY LP-01, LP-02; Figma links in the use cases); the UI rules are [REFUNDS 11](../brd-refunds-portal/11-summary-and-uiux.md#uiux-expectations) and [LOYALTY 11](../brd-loyalty-points/11-summary-and-uiux.md#uiux-expectations); the stack is SDD §6. One responsive web app serves customers, members, and branch managers (SDD A-7).

## 17.1 Module / Component Tree

```text
app-root (shell: tenant logo and product name, navigation filtered by role, language and RTL direction)
  |-- customer (lazy, role CUSTOMER)
  |     |-- RefundRequestFormPage            SCR-01, UC-01          container
  |     |     |-- ReceiptLookupForm                                  presentational
  |     |     |-- RefundableItemsTable (lines, disabled when not refundable, UC-01 A1)
  |     |     |-- RefundSummary (requested amount with currency, reason)
  |     |-- MyRefundRequestsPage             SCR-02 list, UC-02     container
  |     |     |-- RefundRequestTable
  |     |-- RefundRequestDetailPage          SCR-02 detail, UC-02, UC-03   container
  |           |-- StatusHistoryTimeline
  |           |-- CancelRequestDialog (two-step)
  |-- member (lazy, role MEMBER)
  |     |-- PointsBalancePage                LP-01, LOYALTY UC-01   container
  |     |-- PointsHistoryPage                LP-02, LOYALTY UC-02   container
  |           |-- MovementTable
  |           |-- MovementDetailPanel
  |-- branch (lazy, role BRANCH_MANAGER)
  |     |-- BranchQueuePage                  UC-04 steps 1-2        container
  |     |     |-- QueueTable (failed payouts flagged, UC-04 E1)
  |     |-- RefundDecisionPage               MK-03, UC-04 steps 3-6 container
  |     |     |-- DecisionForm (approve full or partial, reject)
  |     |     |-- ConfirmAmountDialog, RejectReasonDialog
  |     |-- BranchReportPage                 REFUNDS 09             container
  |-- shared
        |-- MoneyPipe, TenantDatePipe (tenant locale and zone, ISO currency code always shown)
        |-- ProblemMessageComponent (errorCode to localised, actionable text)
        |-- LoadingState, EmptyState, ErrorState
        |-- api: RefundApi, BranchApi, PointsApi (typed from the OpenAPI files, 06 § 9)
        |-- core: authInterceptor, correlationIdInterceptor, IdempotentCommand helper
```

`IdempotentCommand` generates one `Idempotency-Key` per user action (not per HTTP call), reuses it on every retry of that action, and retries 409 `REQUEST_IN_PROGRESS` after `Retry-After` without showing an error (SDD §17.1); a 5xx lets the user retry with the same key.

## 17.2 State Management Boundaries

| Boundary | Mechanism | Examples |
|----------|-----------|----------|
| Component-local state | Signal | Selected line ids, reason text, dialog step, approved amount input |
| Feature-shared state | NgRx SignalStore | `RefundFormStore` (receipt, lines, submit command and its key), `RefundRequestsStore` (list cursor, detail, cancel), `BranchQueueStore`, `DecisionStore`, `PointsStore`, `TenantStore` (brand, locale, zone), `SessionStore` (user, realm roles, `branch_id`) |
| Streams | RxJS | HTTP responses, debounced receipt-number input |

## 17.3 Routing

| Route | Component | Guards | Lazy-loaded? |
|-------|-----------|--------|--------------|
| `/refunds/new` | `RefundRequestFormPage` | `authGuard`, `roleGuard('CUSTOMER')` | Yes (`loadComponent`) |
| `/refunds` | `MyRefundRequestsPage` | `authGuard`, `roleGuard('CUSTOMER')` | Yes |
| `/refunds/:refundId` | `RefundRequestDetailPage` | `authGuard`, `roleGuard('CUSTOMER')` | Yes |
| `/points` | `PointsBalancePage` | `authGuard`, `roleGuard('MEMBER')` | Yes |
| `/points/history` | `PointsHistoryPage` | `authGuard`, `roleGuard('MEMBER')` | Yes |
| `/branch/queue` | `BranchQueuePage` | `authGuard`, `roleGuard('BRANCH_MANAGER')` | Yes |
| `/branch/requests/:refundId` | `RefundDecisionPage` | `authGuard`, `roleGuard('BRANCH_MANAGER')` | Yes |
| `/branch/report` | `BranchReportPage` | `authGuard`, `roleGuard('BRANCH_MANAGER')` | Yes |

Guards only shape the UI; the backend enforces every permission and ownership rule (11 § 14.4). Branch routes call `/v1/branches/{branchId}/...` with the `branch_id` claim, never a user-entered branch.

> TODO: the OIDC client library for the authorization code flow with PKCE is not chosen; any library is a new dependency needing approval per CLAUDE.md - verify with the team.

## 17.4 PrimeNG Components Used

| Component | Used in | Notes |
|-----------|---------|-------|
| Table (lazy mode) | `RefundRequestTable`, `QueueTable`, `MovementTable` | Server-side cursor pagination with next and previous, sticky header, fixed server sort, empty and loading states |
| Checkbox | `RefundableItemsTable` | Not refundable lines disabled with a tooltip (contextual restriction) |
| InputNumber | `DecisionForm` | Approved amount with the request currency shown beside it; parsed as a decimal string (06 § 9.2) |
| Textarea | Reason fields | 500-character limit with a counter |
| Timeline | `StatusHistoryTimeline` | Status changes with dates and the rejection reason (UC-02 step 4) |
| Tag | Status and payout-failed flag | Colour plus text, never colour alone |
| Dialog | `CancelRequestDialog`, `ConfirmAmountDialog`, `RejectReasonDialog` | Two-step confirmations that restate the reference number and the consequence (CLAUDE.md: no generic "Are you sure?") |
| Date picker | `BranchReportPage` | Tenant-zone calendar date, no future dates |
| Message, Skeleton | All pages | Actionable error messages from `errorCode`; skeletons while loading |

> TODO: the PrimeNG version is not pinned (SDD §6) and component selectors changed across major versions (for example the date picker and select components) - verify the version before scaffolding.

> Confirm: the CLAUDE.md data-table rule (sortable columns, bulk actions, CSV and Excel export, persistent per-user preferences) is only partly met: the SDD APIs use cursor pagination with a fixed sort (SDD §17.1, §17.4), bulk approval is a future enhancement (REFUNDS UC-04), and no export is in scope; per-user table preferences are kept in local storage - verify this reduced scope with the product owner.

## 17.5 Theming

| Concern | Choice |
|---------|--------|
| Design tokens | One token set (colour, spacing, typography) feeding the PrimeNG theme preset and Tailwind CSS variables; no raw hex in components |
| Tenant theming | Brand colour, logo, and product name from tenant configuration at runtime (`TenantStore`), applied as CSS variables before the first render |
| Dark mode | No (not in the BRDs) |

> TODO: the brand key color is open (SDD §6 Frontend Stack; CLAUDE.md asks for it before UI work) - please specify.

> TODO: no API or static file serves tenant branding and locale to the web app (SDD §6 names runtime theming but no source); best guess: a static per-tenant configuration file served with the web app on the tenant's hostname (LA-05) - verify with the architect.

## 17.6 i18n

- **Library:** Angular's built-in i18n (`@angular/localize`), one build per locale, served by locale path.
- **String policy:** no string concatenation; ICU messages for plurals and points signs; every server error shown through its `errorCode` key.
- **RTL support:** `dir="rtl"` for Arabic; logical CSS properties only (`margin-inline-start`, Tailwind logical utilities), no left or right.
- **Locale formatting:** dates, numbers, and currency formatted with the tenant locale and zone from `TenantStore` (not the browser locale); every amount shows its ISO currency code (REFUNDS 11); points are whole numbers with a minus sign for take-backs (LOYALTY 11).

> Confirm: build-time `@angular/localize` needs one build per locale and cannot switch language at runtime; verify it fits the tenant-locale model before a runtime translation library is considered (a new dependency).

## 17.7 Accessibility (WCAG 2.1 AA)

| Concern | Approach |
|---------|----------|
| Semantic HTML | Default; no `<div>` for buttons or links |
| Keyboard navigation | Every interactive element reachable via keyboard; dialogs trap and return focus |
| Focus indicators | Visible at all times |
| Contrast | 4.5:1 minimum, checked for every tenant brand colour |
| Forms | Validate on blur; errors explain how to fix |
| Empty / loading / error states | First-class; never expose stack traces or raw codes |

## 17.8 Form Conventions

- Validate on blur; submit validates everything again.
- Errors explain how to fix (for example "Enter an amount above 0 and not above 39.98 EUR").
- One convention for required versus optional: every field is required unless labelled "(optional)".
- Destructive actions (cancel a request, reject a refund): two-step confirmation that restates the reference number and what happens next.

## 17.9 Component Architecture

- Presentational components (inputs in, outputs out, no injected services) versus containers (pages that talk to stores).
- Logic in stores and services, not templates; `inject()` for DI; OnPush everywhere.
- Strict TypeScript; API types generated or hand-written from the OpenAPI files, never `any`.

<!-- MASTER: lld-master.md | PREV: 13-testing.md | NEXT: 15-open-questions.md -->

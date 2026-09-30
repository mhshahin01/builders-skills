<!--
CHUNK: 14
TITLE: Frontend (conditional - generate only when UI exists)
PROJECT: [Project Name]
VERSION: [X.X]
PART OF: LLD - [Project Name]
NOTE: This chunk is OMITTED when the LLD scope has no UI surface. Do not stub it.
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

## 17.1 Module / Component Tree

```text
[app-root]
  |-- [feature-shell]
  |     |-- [feature-list]
  |     |     |-- [feature-list-item]
  |     |-- [feature-detail]
  |-- [shared]
        |-- [components]
        |-- [services]
```

## 17.2 State Management Boundaries

| Boundary | Mechanism | Examples |
|----------|-----------|----------|
| Component-local state | Signal | Form values, toggle states, derived view |
| Feature-shared state | NgRx SignalStore | Selected tenant, current user, feature data cache |
| Streams | RxJS | HTTP responses, WebSocket subscriptions, debounced inputs |

## 17.3 Routing

<!--
Every route has a row (sdd-to-lld.md § Use-case traceability). This table is the home of route -> screen; a screen's use cases are read from the BRD, never guessed from the route.
  Screen (BRD): the MK-NN of the screen or flow the route implements, from BRD chunk 14 Mockup coverage (one row per screen or flow, the screen reference), linked to 14-todo.md#mockup-coverage; or the screen ID, only where the BRD text carries one from its source (brd-unifier never defines one), linked to the heading that carries it; else "None - platform page" (sign-in, not found, the shell).
  Use cases (BRD): the use cases the BRD gives that screen (its MK-NN row, or the UI/UX sections that name it), linked to their BRD headings; "None - platform page" for platform pages.
Every BRD ID carries the key from the SDD's Source BRDs register. Every active use case with a screen the actor sees has at least one route; a use case with neither a screen ID nor an MK-NN gets "> Confirm: no screen ID or MK-NN in the BRD for [KEY]/UC-NN".
Route paths and components are this LLD's design choice (from-sdd: "> Confirm:"). With no source BRD, the two BRD columns read "Not applicable - no source BRD".
-->

| Route | Component | Screen (BRD) | Use cases (BRD) | Guards | Lazy-loaded? |
|-------|-----------|--------------|-----------------|--------|--------------|
| `/foo` | `FooListComponent` | [[KEY]/MK-01](../brd-[brd-slug]/14-todo.md#mockup-coverage) | [[KEY]/UC-01](../brd-[brd-slug]/06a-use-cases-[persona-slug].md#uc-01-[title-slug]) | `authGuard` | Yes (`loadComponent`) |
| `/foo/:id` | `FooDetailComponent` | [[KEY]/MK-02](../brd-[brd-slug]/14-todo.md#mockup-coverage) | [[KEY]/UC-02](../brd-[brd-slug]/06a-use-cases-[persona-slug].md#uc-02-[title-slug]) | `authGuard`, `tenantGuard` | Yes |
| `/login` | `LoginComponent` | None - platform page | None - platform page | - | Yes |

**Use-case context at runtime.** Every route that implements a BRD screen carries it in its route data, so a frontend error report names the screen and the use case:

```ts
{
  path: 'foo/:id',
  loadComponent: () => import('./foo-detail.component').then(m => m.FooDetailComponent),
  data: { screen: '[KEY]/MK-02', useCases: ['[KEY]/UC-02'] },
}
```

The global `ErrorHandler` and the frontend telemetry read the data of the deepest active route and attach `screen` and `use_case` to every error report and RUM span (`09-cross-cutting.md` § 12.8). Platform pages carry no such data.

## 17.4 PrimeNG Components Used

| Component | Used in | Notes |
|-----------|---------|-------|
| `<p-table>` | `FooListComponent` | Server-side pagination, sortable, sticky header, bulk actions, CSV export, persistent per-user prefs |
| `<p-dialog>` | `FooDetailComponent` | Destructive actions use typed-name confirmation (CLAUDE.md UX rule) |

## 17.5 Theming

| Concern | Choice |
|---------|--------|
| Design tokens | `[token file path]` |
| Tenant theming | Brand color, logo, product name from tenant config at runtime |
| Dark mode | [Yes / No / Tenant-controlled] |

## 17.6 i18n

- **Library:** `@angular/localize` (or `ngx-translate`).
- **String policy:** no string concatenation. All strings via i18n keys.
- **RTL support:** logical CSS properties only (`margin-inline-start`, not `margin-left`); full Arabic support.
- **Locale formatting:** dates, numbers, currency formatted via tenant locale (not browser locale, per CLAUDE.md).

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
- One convention for required vs optional, applied uniformly.
- Destructive actions: typed-name or two-step confirm (no generic "Are you sure?").

## 17.9 Component Architecture

- Presentational vs Container split.
- Logic in services / stores, not templates.
- Strict TypeScript everywhere.

<!-- MASTER: [project-slug]-lld-master.md | PREV: 13-testing.md | NEXT: 15-open-questions.md -->

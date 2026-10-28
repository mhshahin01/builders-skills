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
> - Libraries: each UI, styling, i18n, state, and test library, with its Status, is a row of `03a-libraries-and-conventions.md` § 6.5.1 (or of § 6.3, for a layer § 6.3 holds). The sections below use those rows.
> - Angular 17+, standalone components only (no NgModules).
> - `inject()` over constructor DI.
> - Signals for component state; NgRx SignalStore for shared/complex state; RxJS for streams only.
> - OnPush change detection by default.
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
  Screen (BRD): the ID of the BRD chunk 14 Mockup coverage row (one row per screen or flow, the screen reference) of the screen or flow the route implements, linked to 14-todo.md#mockup-coverage: its MK-NN, or in a BRD written before MK-NN the screen ID that keys the row. The chunk 14 row wins; only a screen ID with no chunk 14 row, where the BRD text carries one from its source (brd-unifier never defines one), links to the heading that carries it. Else "None - platform page" (sign-in, not found, the shell), or "None - no BRD screen ([link])" for a route that serves a Workflow block (behaviour no use case covers, such as a BRD chunk 09 report). When that screen has a chunk 14 row, the row wins: cite its ID here.
  Use cases (BRD): the use cases the BRD gives that screen (its chunk 14 row, or for a screen ID with no row the UI/UX sections that name it), linked to their BRD headings; "None - platform page" for platform pages; "None - no BRD screen ([link])" for a Workflow route, which carries no route data; "None - no BRD use case ([link])" for a Workflow route whose screen has a chunk 14 row, whose route data carries the screen only.
Every BRD ID carries the key from the SDD's Source BRDs register. Every active use case with a screen the actor sees has at least one route; a use case with neither a screen ID nor an MK-NN gets "> Confirm: no screen ID or MK-NN in the BRD for [KEY]/UC-NN".
Route: the path only. When the LLD has more than one front-end app, the app's name follows the path in parentheses (`/points` (Loyalty Points)); the 04 Screens fields and the 16 §19.9 Routes cells carry the path alone.
Route paths and components are this LLD's design choice (from-sdd: "> Confirm:"). With no source BRD, the two BRD columns read "Not applicable - no source BRD".
Inbound links: every link in an approved frame and every URL in an email or notification template that the BRD lists in the "Links and sent URLs" cell of its chunk 14 Mockup coverage row has a route row here and a § 17.3a row. The LLD reads these links from that cell only, never from the mockups. A frame link that the user or a reviewer reports, and that the BRD does not list, is raised up the chain as an open item (SKILL.md step 7b), never routed on the LLD's own reading.
Guards: derived from the BRD use case's Preconditions and Actor. Each precondition the client can check (signed in, a role, a state such as a verified email) becomes a guard; the actor maps to its SDD §16 role. A use case with no such precondition reads "None - no precondition". A guard no precondition asks for is flagged "> Confirm:". Platform pages state their guard as a design choice ("> Confirm:").
-->

| Route | Component | Screen (BRD) | Use cases (BRD) | Guards | Lazy-loaded? |
|-------|-----------|--------------|-----------------|--------|--------------|
| `/foo` | `FooListComponent` | [[KEY]/MK-01](../brd-[brd-slug]/14-todo.md#mockup-coverage) | [[KEY]/UC-01](../brd-[brd-slug]/06a-use-cases-[persona-slug].md#uc-01-[title-slug]) | `authGuard` | Yes (`loadComponent`) |
| `/foo/:id` | `FooDetailComponent` | [[KEY]/MK-02](../brd-[brd-slug]/14-todo.md#mockup-coverage) | [[KEY]/UC-02](../brd-[brd-slug]/06a-use-cases-[persona-slug].md#uc-02-[title-slug]) | `authGuard`, `tenantGuard` | Yes |
| `/login` | `LoginComponent` | None - platform page | None - platform page | - | Yes |

**Use-case context at runtime.** Every route that implements a BRD screen carries it in its route data. It carries use cases only when the BRD names them for that route. A Workflow route with no BRD use case carries `screen` only. The route configuration lists each such route with its own `data` entry, one per table row with a BRD screen; a sentence that summarises the rest does not count:

```ts
{
  path: 'foo/:id',
  loadComponent: () => import('./foo-detail.component').then(m => m.FooDetailComponent),
  data: { screen: '[KEY]/MK-02', useCases: ['[KEY]/UC-02'] },
}
```

The global `ErrorHandler` and the frontend telemetry read the data of the deepest active route and attach its `screen` to every error report and RUM span; they attach `use_case` only when that route has `useCases` (`09-cross-cutting.md` § 12.8). Platform pages carry no such data.

**Unknown sub-paths:** each route with child paths states where an unknown child path goes (for example `/foo/:id/[unknown]` redirects to `/foo/:id`), and the wildcard route (`**`) names its target. No unknown address renders an empty shell.

**Return-destination allowlist:** the destinations a sign-in or other redirect may return to are generated from this table (its guarded routes, with their parameter forms), never kept as a separate hand-written list. A route added here joins the allowlist in the same change. A destination outside it is replaced by [the default landing route].

## 17.3a Inbound Links

<!--
One row per link the BRD lists for an approved frame or an email or notification template (§ 17.3 comment, Inbound links).
Link (BRD): the link's name as the BRD gives it, never its path (the path goes in Exact form).
Listed in (BRD): the chunk 14 Mockup coverage row whose "Links and sent URLs" cell lists the link, linked, with the key from the SDD's Source BRDs register.
Exact form: the form the BRD gives, character for character: a path form (`/verify/<token>`) or a query form (`/verify?token=<token>`).
Route: the § 17.3 row that serves it. That route accepts the exact form: a path form needs the `:param` segment, a query form needs a route that reads the query parameter.
With no listed links: "None - the BRD lists no links in frames or sent messages". With no source BRD: "Not applicable - no source BRD".
-->

| Link (BRD) | Listed in (BRD) | Exact form | Route |
|------------|-----------------|------------|-------|
| [Verify-email link in the sign-up email] | [[KEY]/MK-03](../brd-[brd-slug]/14-todo.md#mockup-coverage) | Query: `/verify?token=<token>` | `/verify` |
| ["Read the full terms" link on the sign-up screen] | [[KEY]/MK-02](../brd-[brd-slug]/14-todo.md#mockup-coverage) | Path: `/terms` | `/terms` |

## 17.3b Async Action States

<!--
One table per screen with an async action (a submit, an upload, a delete, any call the user starts and waits for). With none: "None - no async actions".
Rows: idle, sending, success, one row per refusal reason the endpoint returns (each problem type of its `06-api-contracts.md` § 9.2 block), failure (status 0 or a timeout), cancel (when the user can cancel), 401, 5xx.
Copy source: one of the three forms of § 17.6 Message sources.
Focus target: the element that receives focus once the state renders. Live region: polite, assertive, or None.
-->

**`FooDetailComponent` - Save**

| State | Trigger | Rendered as | Copy source | Focus target | Live region |
|-------|---------|-------------|-------------|--------------|-------------|
| Idle | Screen ready | Save enabled | - | - | None |
| Sending | Save pressed | Save disabled, progress shown | Client key `foo.save.sending` | Save | Polite |
| Success | 2xx | Confirmation shown | Client key `foo.save.done` | Confirmation heading | Polite |
| Refused: `[problem-type]` | 4xx with that problem type | Inline error on the field | API `detail` | The field in error | Assertive |
| Failure | Status 0 or timeout | Banner with Retry; input kept | Client key `common.network` | Retry | Assertive |
| Cancel | Cancel pressed | Request aborted; back to Idle | Client key `foo.save.cancelled` | Save | Polite |
| 401 | 401 | Redirect to sign-in with the return destination (§ 17.3) | Client key `common.session-ended` | Sign-in heading | Assertive |
| 5xx | 5xx | Banner; input kept | Client key `common.server-error` | Banner | Assertive |

- **List queries drop stale answers.** A list or search that re-queries on a filter, sort or page change renders only the answer to its latest request (for example `switchMap`, or a request token checked on arrival). A late answer to an earlier request is dropped.
- **Background and poll calls.** A call the user did not start (a poll, a keep-alive ping, a prefetch) changes the rendered state only on a definite 401 or 403. Status 0, a timeout or a 5xx leaves the screen as it is.
- **Opting out of global error handling.** A caller that skips the global error handler handles status 0, 401 and 5xx itself, and its state table has those rows.

## 17.3c Idempotent Submissions

<!--
The client half of `09-cross-cutting.md` § 12.2 Idempotency, which owns the server side (dedup tuple, TTL, cached body, replay). One row per page or service that sends the idempotency key, for each endpoint in the § 12.2 Required on scope that is not on its Excluded routes row. With none: "None - no endpoint takes an idempotency key".
-->

| Page or service | Endpoint (06 § 9.1) | New key minted when | Same key sent for | Key dropped when |
|-----------------|---------------------|---------------------|-------------------|------------------|
| `FooDetailComponent` via `FooApiService` | `POST /v1/foo` | The user starts a new logical submission (Save on a changed form) | Every retry of that submission: an automatic retry, a retry after status 0 or a timeout, a repeated click, a reload that restores the draft | Success, a refusal the user must act on, or the user changes the form |

> **Rule:** each row applies `09-cross-cutting.md` § 12.2 Client key lifetime; this table names only the pages, the endpoints and the user actions.

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

- **Library:** the i18n library, with its Status, is a row of `03a-libraries-and-conventions.md` § 6.5.1 (or of § 6.3, for a layer § 6.3 holds).
- **String policy:** no string concatenation. All strings via i18n keys.
- **Message sources:** every user-visible message names one source: the API problem `detail` (shown as returned), a client copy key, or BRD text (linked to the BRD heading that holds it, never copied here). Business text that neither the BRD nor the API gives is flagged `> Confirm:` and raised up the chain.
- **Plurals:** a message with a count uses the plural forms of the i18n library (for example ICU `plural`), with every plural category each supported locale needs. A number is never joined to a fixed noun ("1 hours").
- **Consent:** when the product records consent or another versioned acceptance, the purposes sent equal the purposes disclosed on screen, one for one, and the version sent is the version of the text on screen.
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

## 17.10 Client Mirrors of Server Rules

<!--
Conditional: when the UI shows or acts on a server-enforced time limit (an idle sign-out, an expiring hold, a countdown, a code validity). Else: "Not applicable - no server-enforced time limit in the UI".
One row per rule. The server owns the rule; the client only mirrors it. Server source: the place that sets the rule (the `09-cross-cutting.md` section, or the SDD section), linked.
Deadline field: the response field that carries the absolute server deadline (a UTC instant), and the endpoint that returns it. A response with only a duration is drift to raise against its `06-api-contracts.md` § 9.2 block.
-->

| Rule | Server source | Deadline field | Anchor event | Multi-tab | Throttle / grace | Counts as user activity |
|------|---------------|----------------|--------------|-----------|------------------|-------------------------|
| [Idle sign-out] | [link] | `expiresAt` in [endpoint] | [Last user request the server accepted] | [One deadline for all tabs: each tab adopts the latest server deadline; a sign-out in one tab ends all] | [Activity sent at most once per N s; the warning never closes before the server grace ends] | [Clicks, key presses and navigation that send a request] |

- **Never user activity:** timers, automatic retries and polls never count as user activity and never extend the deadline.
- **Generations:** every answer that moves the deadline carries a generation (a counter or the server's issue time). The client drops an answer older than the one it holds, so a late answer never re-anchors the countdown.

<!-- MASTER: [project-slug]-lld-master.md | PREV: 13-testing.md | NEXT: 15-open-questions.md -->

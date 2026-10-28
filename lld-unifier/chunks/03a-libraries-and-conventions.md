<!--
CHUNK: 03a
TITLE: Libraries & Coding Conventions
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: 03, and the source SDD (§6 Ecosystem Overview)
PART OF: LLD - [Project Name]
-->

## 6.5 Libraries & Coding Conventions

> **Note:** this chunk continues § 6 of `03-architecture.md` and has no `# 6.` heading of its own. It owns the library choices and their Status (§ 6.5.1), an index of the coding rules whose detail stays where each row's Source points (§ 6.5.2), and the per-service deltas (§ 6.5.3). Chunks 09, 13, and 14 cite a § 6.5.1 row (or the § 6.3 row, for a layer § 6.3 holds) instead of naming the library and its approval state. A file in `04-implementation/` cites a row of this chunk and never restates it. A service that departs from a row has a § 6.5.3 row with its reason.

### 6.5.1 Libraries by Concern

| Concern | Use | Instead of | Why (one line) | Scope | Source | Status |
|---------|-----|------------|----------------|-------|--------|--------|
| HTTP client, synchronous | `RestClient` | `RestTemplate` | The default HTTP client of a Spring MVC service. `RestTemplate` is not used in new code. | Spring MVC services | [SDD §6 row / `[Project rule](../<file>)` / [Stack approval](./decision-log.md#stack-approval-record) / `code (<file>:<line>)` / LLD default] | [Approved / Proposed - needs approval] |
| HTTP client, reactive or non-blocking | `WebClient` | `RestTemplate` | The client for reactive or non-blocking calls. In a Spring MVC service it adds the WebFlux starter, a new dependency. | [Services with reactive or non-blocking calls, or `None in this LLD`] | LLD default | Proposed - needs approval |
| DTOs | Java records | Classes | A record states a DTO's fields once and is immutable. | Every service | [SDD §6 row / `[Project rule](../<file>)` / [Stack approval](./decision-log.md#stack-approval-record) / `code (<file>:<line>)` / LLD default] | [Approved / Proposed - needs approval] |
| [Concern] | [Library] | [The alternative it rules out, or `-`] | [One line] | [Services or tiers] | [Source] | [Approved / Proposed - needs approval] |

> **Convention:**
>
> - **Rows.** One row per concern, in the form the services build with. `Use` is the library. `Instead of` names the alternative the row rules out, or `-` where neither the skill nor the project rules name one. A layer or library that § 6.3 already holds (the database, broker, auth, migrations, observability, and any other row SDD §6 gives a layer of its own) is not repeated here. A row no service uses is left out, except the three seed rows above, which stay as the standard.
> - **Other rows.** Add one row, unless § 6.3 already holds the library, for each library below that the LLD uses and for each library the project instruction file or SDD §6 names for a concern a service builds with. A frontend library gets a row only when the LLD has `14-frontend.md`. A library that neither SDD §6 nor the project instruction file names is a new dependency (see Status). `Instead of` is `-` unless the entry names one.
>   - Resilience: `Resilience4j` (SKILL.md principle 10; `09-cross-cutting.md` § 12.3).
>   - Tracing: `OpenTelemetry` SDK with automatic instrumentation for Spring Boot (`09-cross-cutting.md` § 12.8).
>   - Backend tests: `JUnit 5` with `Mockito` for unit tests, and `Testcontainers` for integration tests instead of mocked repositories (`13-testing.md` § 16.1, § 16.3); contract tests with `Spring Cloud Contract` or `Pact` (§ 16.1), and static analysis with `SpotBugs`, `Checkstyle`, or `SonarQube` (§ 16.7), each a choice between the tools named.
>   - Frontend tests: `Jest` with `Angular Testing Library` for unit and component tests, `Playwright` for end-to-end tests, and `axe-core` for accessibility checks inside the Playwright runs (`13-testing.md` § 16.1, § 16.5).
>   - Frontend: `PrimeNG` for UI components first, with custom components only when PrimeNG cannot do it; `Tailwind` for styling; `NgRx SignalStore` for shared or complex state (`14-frontend.md` § 17.2); `@angular/localize` or `ngx-translate` for i18n (`14-frontend.md` § 17.6).
> - **Rows from code.** In a code-read direction, add one row for each direct dependency that a service's own code calls, for a concern that no row of § 6.3 or § 6.5.1 covers. A transitive dependency never gets one (`code-extraction.md` § Libraries and conventions in use).
> - **Source.** A label from the one list in `03-architecture.md` § 6.3 Runtime Stack (its Convention), as for a §6.3 row. A default nothing has confirmed reads `LLD default`.
> - **Status.** `Approved` when SDD §6 names the library, when the project instruction file states it, or when the stack approval approved a row that adds no dependency (SKILL.md step 3a, Group B). In a code-read direction a row the manifests pin, or a `code (<file>:<line>)` row, is `Approved` too: the project already depends on the library or already uses the declaration. Every other row is `Proposed - needs approval`: a default nothing has confirmed, and, in every project, whatever the project's rules reserve, a library that adds a dependency SDD §6 does not name (the `WebClient` row of a Spring MVC service is one, because it adds the WebFlux starter). Approve all never confirms such a row, an Approve all on a later run included. It becomes `Approved` only when SDD §6 or the project rules name it, or on the one route SKILL.md step 3a, item 1 names: an explicit request that names the row and its decider, after which the stack approval record holds the row, the decider, and the date.
> - **Proposals in SDD §6.** An SDD §6 row whose Status is `Proposed`, or a legacy row whose Notes mark it Proposed in any form, confirms nothing. The row stays `Proposed - needs approval`, and its Source names the SDD row with `(Proposed in SDD §6)`.

### 6.5.2 Coding Conventions (Clean Code)

| Rule | Do | Don't | Applies to | Source | Enforced by |
|------|----|-------|------------|--------|-------------|
| Constructor injection only | Inject collaborators through the constructor. | Put `@Autowired` on a field. | Every Spring component | [`[Project rule](../<file>)` / SDD § that states it / LLD default] | review |
| Records for DTOs | Declare each DTO as a record, as the DTOs row of § 6.5.1 says. | Declare a DTO as a class. | Request, response, and event DTOs | § 6.5.1, DTOs row | review |
| Package layering | Follow the layout a source states: the layers the project instruction file states (controller, service, service impl, entity, repository, dto), or the layout SDD ADR-01 records (hexagonal ports and adapters, or a modular monolith's module packages). | Mix two layouts in one service. | Every backend service | [`[Project rule](../<file>)` / SDD §8.1 and ADR-01] | review |
| UTC for all datetimes | Store, exchange, and log every date-time in UTC. | Use a local time zone. | Every service | [`[Project rule](../<file>)` / SDD § that states it / LLD default]. `02-context.md` § 5.5. | review |
| UUIDv7 primary keys | Generate each primary key as a UUIDv7 at the service layer. | Use another ID type for a primary key. | Every table | [`[Project rule](../<file>)` / SDD § that states it / LLD default]. `02-context.md` § 5.5. | review |
| Problem Details errors | Translate every exception to an RFC 9457 `ProblemDetails` in one global `@RestControllerAdvice`. Business exceptions extend `ServiceException` and carry an error code. | Expose a stack trace or a raw code. | Every REST service | [`[Project rule](../<file>)` / SDD § that states it / LLD default]. `09-cross-cutting.md` § 12.6. | review |
| Idempotency keys on writes | Require an `Idempotency-Key` on a write endpoint that touches money, wallets, notifications, or external providers. | Accept such a write without a key. | Those endpoints | [`[Project rule](../<file>)` / SDD § that states it / LLD default]. `09-cross-cutting.md` § 12.2. | review |
| Test naming | Name each test `methodName_scenario_expectedResult`. | Use another name shape. | Every test | [`[Project rule](../<file>)` / SDD § that states it / LLD default]. `13-testing.md` § 16. | review |
| Standalone components | Write standalone components and route them with `provideRouter` and `loadComponent`. | Use NgModules or `RouterModule`. | Angular frontend | [`[Project rule](../<file>)` / SDD § that states it / LLD default]. `14-frontend.md` § 17. | review |
| Signals for state | Use signals for component state, NgRx SignalStore for shared or complex state, and RxJS for streams only. | Use RxJS for anything but streams. | Angular frontend | [`[Project rule](../<file>)` / SDD § that states it / LLD default]. `14-frontend.md` § 17; § 6.5.1, NgRx SignalStore row. | review |
| OnPush change detection | Use `OnPush` change detection by default. | Use default change detection. | Angular frontend | [`[Project rule](../<file>)` / SDD § that states it / LLD default]. `14-frontend.md` § 17. | review |
| Strict TypeScript | Compile with strict TypeScript. | Use `any`. | Angular frontend | [`[Project rule](../<file>)` / SDD § that states it / LLD default]. `14-frontend.md` § 17. | review |

> **Convention:** a rule is seeded only from the project instruction file, the SDD, or a rule this skill already states; none is invented. A rule that also has a § 6.5.1 row names it in `Source`; that row is the home, and the two never differ. Each row is an index line: the rule's detail stays where its `Source` points (`02-context.md` § 5.5, `09-cross-cutting.md`, `13-testing.md`, or `14-frontend.md`). `Enforced by` names a tool only when that tool is an `Approved` row of § 6.5.1; otherwise it reads `review`. A rule that only this skill states, with no project file or SDD behind it, is applied as a proposal with its gap flagged `> Confirm:` (SKILL.md principle 10). The package layering row has no skill default: it is written only when a source states a layout, and with none it is left out and nothing is invented. The Angular rows are written only when the LLD has `14-frontend.md`.

### 6.5.3 Per-Service Deltas

| Service | Departs from | Standard | This service | Reason | Source | Status |
|---------|--------------|----------|--------------|--------|--------|--------|
| [service-slug] | [§ 6.5.1 concern or § 6.5.2 rule] | [What the row says] | [What this service does instead] | [Why it departs] | [SDD section / `Customer decision`, linked to its entry in `decision-log.md`] | [Approved / Proposed - needs approval] |

> **Convention:** a row only where a service departs from § 6.5.1 or § 6.5.2, each with its reason. The reason comes from a source: an SDD section or a decision in `decision-log.md`. In from-sdd, where none states it, the row carries a `> Confirm:` that asks for it. In a code-read direction, a departure with no such reason gets no row and stays the finding: `⚠ policy` (`pattern-rules.md` § Anti-patterns to flag), or in hybrid `⚠ drift` for a row sourced from SDD §6 (`hybrid-drift.md` § Section-by-section diff rules). With no departure, this section reads `None: every service follows § 6.5.1 and § 6.5.2.` and the table is dropped.

<!-- MASTER: [project-slug]-lld-master.md | PREV: 03-architecture.md | NEXT: 04-implementation/<service>.md -->

# Discovery: tracking code that already exists

Goal: when the tracker starts on a repo that already has pages, endpoints, migrations or jobs, it **finds
them, maps them to the LLD, and never plans them as new**. Existing code is never trusted as Done until
it passes the audit (audit-rules.md).

Runs: `init` (first inventory), `plan` (match to LLD units), `sync` (re-inventory and diff),
`discover` (on demand).

---

## 1. Inventory — what to scan

Detect the stack from build files (`pom.xml`, `build.gradle`, `package.json`, `pyproject.toml`,
`go.mod`, `*.csproj`), then scan only what applies. Record each item once.

| Kind | Look for (examples — adapt to the stack found) |
|---|---|
| endpoint | Spring `@(Get|Post|Put|Patch|Delete|Request)Mapping` + class-level path; Express/Fastify `router.get(`…; NestJS `@Get(`; Next.js `app/**/route.ts`, `pages/api/**`; FastAPI/Flask decorators; Django `urls.py`; OpenAPI spec paths |
| screen | Next.js `app/**/page.tsx`, `pages/**`; React Router `<Route path=` / route config; Angular `Routes`; Vue Router; mobile navigators |
| component (only if the LLD names it) | exported components under the feature folder |
| migration | `db/migration/V*.sql`, Liquibase changelogs, `prisma/migrations/**`, Alembic `versions/`, Django `migrations/`, Knex/TypeORM migrations |
| entity / table | `@Entity`/`@Table`, Prisma `model`, SQLAlchemy/Django models, `CREATE TABLE` in migrations |
| event | publishers/consumers (`@KafkaListener`, `@EventListener`, `publish(`, queue names), event schema files |
| job | `@Scheduled`, cron configs, queue workers |
| class / service | classes the LLD names (grep the exact LLD names first) |
| log / audit event | logger calls with stable event names, audit-trail writes (`audit.record(`, `AuditLog`) |
| test | test files, test names, e2e tags `@KEY/UC-NN`, `@KEY/TC-…` |
| config / flag | feature flags, release switches the LLD names |

Per item record: `kind · name (method+path, route, table, class) · file:line · first commit · last commit ·
feature key guess (by package/folder)`. Use `git log --format=%h\ %ad --date=short -- <file>` for commits.

Skip: generated code, `node_modules`, `build/`, `dist/`, vendored libs, test fixtures.

Write `tracking/inventory.md` (templates.md § inventory.md). It is **generated**: re-running replaces it,
but the previous one is kept as `inventory.prev.md` for the diff.

## 2. Matching existing code to LLD units (in `plan`)

For each LLD unit in scope, find candidate inventory items:

1. **Exact:** same name as the LLD (class, table, `METHOD /path`, route path, event name).
2. **Normalized:** case/plural/prefix differences (`/api/v1/` vs `/api/`, `match` vs `matches`,
   `RoutingService` vs `RoutingServiceImpl`).
3. **Semantic:** same purpose under another name — only proposed, always flagged `low confidence`.

Then compare shape, not just name: endpoint fields/status codes vs `06-api-contracts`; columns vs
`05-data-model`; screen states vs `14-frontend`; required logs/events vs observability sections.

| Result | Rule | Task created as |
|---|---|---|
| **Match** | exact/normalized name and shape agrees | `Adopted` — Evidence pre-filled with files and commits; audit required |
| **Partial** | exists but a layer or field is missing/different (e.g. endpoint without migration, screen without error state, no log) | `In progress` — DoD lists exactly what is missing; `layer-miss`/`code-drift` gap per difference |
| **Missing** | nothing found | `Planned` (normal) |
| **Not in LLD** | inventory item no LLD unit claims | gap `untracked-code`; user decides: adopt into a task, queue it as a `doc-update` DU (doc-impact-rules.md), or remove |
| **Conflict** | two items claim one unit, or one item fits two units | gap `double-build`; ask |

Confidence: `high` (exact + shape agrees), `medium` (normalized), `low` (semantic). Low is never
adopted automatically.

## 3. Approval before writing

Show one table before writing any task card:

`LLD unit | result | code (file:line) | confidence | proposed status | differences`

Plus counts: matched / partial / missing / not in LLD / conflict. The user approves, edits rows, or rejects
low-confidence matches. Only then write cards, `ownership.md` (existing files become owned by the adopted
task), gaps, and the plan's Coverage table with a **Exists** column.

## 4. Adopted is not Done

- `Adopted` counts as **existing**, not as progress. `status` shows `Done/Verified %` and separately
  `existing, unaudited %`.
- Adopted tasks are first in `next` (cheap to clear, and they unblock dependents only after audit).
- `done KEY/T-NNN` on an Adopted task skips building, runs pre-flight (Adopted mode), then the audit:
  PASS → `Done`; FAIL → `In progress` with findings as fix list, gaps, lessons.
- Dependents of an Adopted task stay blocked until it is `Done` (the code exists but is unproven).
- `audit KEY adopted` audits every Adopted task in a key, one auditor run per task, each after its
  pre-flight.

## 5. Keeping it current (`sync` and `discover`)

1. Re-run the inventory; diff against `inventory.prev.md`.
2. **New item** → match (§ 2) against tasks: fits a Planned task → that task becomes `Partial`/`Adopted`
   proposal; fits an In progress task → evidence; fits nothing → `untracked-code`.
3. **Removed/moved item** owned by a Done task → `code-drift`.
4. **Changed item** owned by a Done/Verified task, in a commit without its `Task:` trailer → flag for
   re-audit (task stays Done, gap `code-drift` minor, audit on next `done`/`audit`).
5. Every new item built without the tracker → lesson candidate (root cause `false-done` or `scope-creep`)
   if it repeats — lessons-rules.md § 3.

## 6. Lessons from discovery

Patterns across partial matches (e.g. three existing endpoints all missing audit logs) → one lesson with
scope = that layer, so new work doesn't repeat what old work missed.

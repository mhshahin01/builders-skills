<!--
CHUNK: 06
TITLE: API Contracts
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: 04
PART OF: LLD - [Project Name]
-->

# 9. API Contracts

> **OpenAPI source of truth:** [path to openapi.yaml or generated location]
>
> **Versioning:** URI prefix per CLAUDE.md (`/v1`, `/v2`). Breaking changes require a new version.

## 9.1 Endpoint Inventory

### Service: `[service-a]`

| Method | Path | Summary | Idempotency-Key | Auth Scope | Status Codes |
|--------|------|---------|-----------------|------------|--------------|
| `POST` | `/v1/foo` | Create foo | Required | `foo:write` | 201, 400, 409, 422 |
| `GET` | `/v1/foo/{id}` | Get foo by ID | N/A | `foo:read` | 200, 404 |
| `GET` | `/v1/foo` | List foos (paginated) | N/A | `foo:read` | 200, 400 |
| `PATCH` | `/v1/foo/{id}` | Update foo | Required | `foo:write` | 200, 400, 404, 409, 422 |
| `DELETE` | `/v1/foo/{id}` | Delete foo (soft) | Required | `foo:write` | 204, 404 |

> **Convention:** every write endpoint touching money/wallet/notifications/external-providers requires an `Idempotency-Key` header (CLAUDE.md). The dedup tuple is `(tenant_id, idempotency_key)` with TTL 24h.

### Service: `[service-b]`

<!-- Repeat. -->

## 9.2 Request / Response Shapes

### `POST /v1/foo`

**Request body:**

```json
{
  "name": "string (required, 1..255)",
  "amount": "number (required, > 0, 2 dp)",
  "metadata": {
    "key": "string"
  }
}
```

**Response 201:**

```json
{
  "id": "uuid",
  "name": "string",
  "amount": "number",
  "status": "ACTIVE",
  "createdAt": "ISO 8601 UTC"
}
```

**Response 409 (idempotency conflict, RFC 9457):**

```json
{
  "type": "https://errors.example.com/idempotency/conflict",
  "title": "Idempotency Conflict",
  "status": 409,
  "detail": "Idempotency key K is in flight on another request",
  "instance": "/v1/foo"
}
```

> **Convention:** all error responses follow RFC 9457 ProblemDetails. See `09-cross-cutting.md` § Error Model for the canonical envelope.

## 9.3 Authentication & Authorisation

- **Token issuer:** Keycloak realm `[realm-name]` (CLAUDE.md default for on-prem).
- **Token type:** JWT (Bearer).
- **Validation point:** API gateway (CLAUDE.md: cross-cutting concerns live in gateway/sidecar, not duplicated per service).
- **Scope mapping:** see endpoint inventory tables above.
- **Tenant resolution:** `tenant_id` claim in JWT; propagated via `X-Tenant-Id` header to downstream calls.

## 9.4 Pagination, Sorting, Filtering

- **Pagination:** server-side, `?page=N&size=N` (default size 20, max 100).
- **Sorting:** `?sort=field,asc|desc` (multi-sort allowed).
- **Filtering:** RSQL (`?filter=status==ACTIVE;amount=gt=100`) OR query-param-per-field (pick one and apply uniformly).
- **Total-count response:** include `X-Total-Count` header for paginated endpoints.

## 9.5 OpenAPI snippets

> **Convention:** the full OpenAPI spec lives at `[path]`. Snippets in this section are illustrative only — do not maintain in two places. Cite the operation ID and the spec line.

```yaml
# operationId: createFoo
# spec: openapi.yaml#L42
post:
  summary: Create foo
  parameters:
    - in: header
      name: Idempotency-Key
      required: true
      schema: { type: string, maxLength: 64 }
  requestBody:
    required: true
    content:
      application/json:
        schema: { $ref: '#/components/schemas/CreateFooRequest' }
  responses:
    '201': { description: Created, content: { application/json: { schema: { $ref: '#/components/schemas/FooResponse' } } } }
    '409': { description: Idempotency conflict, content: { application/problem+json: { schema: { $ref: '#/components/schemas/Problem' } } } }
```

<!-- MASTER: [project-slug]-lld-master.md | PREV: 05-data-model.md | NEXT: 07-event-contracts.md -->

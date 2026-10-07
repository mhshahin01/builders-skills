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

| API ID (§15) | Method | Path | Summary | Idempotency-Key | Permission token (SDD §16) | Status Codes |
|--------------|--------|------|---------|-----------------|----------------------------|--------------|
| [API-01](../sdd-[sdd-slug]/11-api-contracts.md#[api-01-heading-slug]) | `POST` | `/v1/foo` | Create foo | Required | `foo:write` | 201, 400, 409, 422 |
| - | `GET` | `/v1/foo/{id}` | Get foo by ID | N/A | `foo:read` | 200, 404 |
| - | `GET` | `/v1/foo` | List foos (paginated) | N/A | `foo:read` | 200, 400 |
| - | `PATCH` | `/v1/foo/{id}` | Update foo | Required | `foo:write` | 200, 400, 404, 409, 422 |
| - | `DELETE` | `/v1/foo/{id}` | Delete foo (soft) | Required | `foo:write` | 204, 404 |

> **Convention:** every write endpoint touching money/wallet/notifications/external-providers requires an `Idempotency-Key` header (CLAUDE.md). The dedup tuple and the TTL are in `09-cross-cutting.md` § 12.2.
>
> **API ID:** the SDD §15 HTTP contract (Type Internal or External) the endpoint implements, linked to its block; `-` for an endpoint no §15 contract covers (for example one only the frontend calls). The owner's 04 file names the controller (provider side) or client (caller side). Permission tokens are SDD §16 tokens, verbatim.

### Service: `[service-b]`

<!-- Repeat. -->

## 9.2 Request / Response Shapes

> **Source:** from an SDD, each endpoint links its SDD §15 `API-NN` contract and adds only the implementation delta (DTO records, validation, mapping, client and resilience config); the contract body stays in the SDD (`sdd-to-lld.md` § One fact, one home). Write the full shape below only from code with no SDD, or for an endpoint the SDD does not define (flagged `> Confirm:`; hybrid: `🆕 code-only`).

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
  "instance": "/v1/foo",
  "errorCode": "CONFLICT"
}
```

> **Convention:** all error responses follow RFC 9457 ProblemDetails. See `09-cross-cutting.md` § Error Model for the canonical envelope.

## 9.3 Authentication & Authorisation

- **Token issuer:** [SDD §6 IAM / AuthN row], realm `[realm-name]` (CLAUDE.md default, Keycloak on-prem, only when SDD §6 is silent).
- **Token type:** JWT (Bearer).
- **Validation point:** the API gateway for inbound traffic (CLAUDE.md: cross-cutting concerns live in gateway/sidecar, not duplicated per service).
- **Internal HTTP calls (SDD §15.1):** the caller sends its client-credentials token (`Authorization: Bearer`); the provider, in its filter or a sidecar, checks the contract's SDD §16 permission token; mTLS stays as the transport. In-process port calls check the token at the port (04 § 7.2 Authorization, Kind Port).
- **Permission tokens:** the endpoint inventory tables above (SDD §16, verbatim).
- **Tenant resolution:** `tenant_id` claim in JWT; propagated via the `X-Tenant-Id` header on downstream HTTP calls (SDD §15.1); in-process port calls carry it in the call context.

## 9.4 Pagination, Sorting, Filtering

- **Pagination:** server-side, `?page=N&size=N` (default size 20, max 100).
- **Sorting:** `?sort=field,asc|desc` (multi-sort allowed).
- **Filtering:** RSQL (`?filter=status==ACTIVE;amount=gt=100`) OR query-param-per-field (pick one and apply uniformly).
- **Total-count response:** include `X-Total-Count` header for paginated endpoints.

## 9.5 OpenAPI snippets

> **Convention:** the full OpenAPI spec lives at `[path]`. Snippets in this section are illustrative only - do not maintain in two places. Cite the operation ID and the spec line.

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

## 9.6 In-Process Port Contracts (SDD §15)

<!--
Modular monolith or hybrid core only: one row per SDD §15 contract of Type `Internal (in-process)`, a module-to-module call through a port. With no SDD §15 `Internal (in-process)` contract here (a microservices SDD, a separate deployable of a hybrid, or a core whose modules call no port), write "Not applicable - no in-process contracts".
Names match SDD §15 verbatim and link its contract block; the DTO fields and error list stay in the SDD. Idempotency and Transaction are the contract's Behaviour rows, as SDD §15 writes them. No HTTP method, path, headers, status codes, or resilience config: the call never leaves the process.
-->

| API ID (§15) | Port interface | Operation | Request / response DTO records | Raised errors (`errorCode`) | Idempotency | Transaction | Permission token (SDD §16) | Implementing adapter |
|--------------|----------------|-----------|--------------------------------|-----------------------------|-------------|-------------|----------------------------|----------------------|
| [API-03](../sdd-[sdd-slug]/11-api-contracts.md#[api-03-heading-slug]) | `[ProviderPort]` | `[operation]` | `[RequestDto]` / `[ResponseDto]` | `[DomainError]` (`[DOMAIN_CODE]`) | [The key; what a repeat returns] | [Joins the caller's transaction / Runs in its own] | `[token]` | `[ProviderPortAdapter]` in `[provider-module]` |

> **Convention:** the provider module's `04-implementation/<module>.md` § 7.2 lists the port and its adapter, and its Authorization table checks the token at the port (Kind Port). Caller modules depend on the port interface only.

<!-- MASTER: [project-slug]-lld-master.md | PREV: 05-data-model.md | NEXT: 07-event-contracts.md -->

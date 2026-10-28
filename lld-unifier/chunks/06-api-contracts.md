<!--
CHUNK: 06
TITLE: API Contracts
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: 04
PART OF: LLD - [Project Name]
-->

# 9. API Contracts

> **OpenAPI spec:** [path to openapi.yaml or generated location], generated from or checked against the § 9.2 blocks
>
> **Versioning:** URI prefix per CLAUDE.md (`/v1`, `/v2`). Breaking changes require a new version.

## 9.1 Endpoint Inventory

### Service: `[service-a]`

| API ID (§15) | Method | Path | Summary | Idempotency-Key | Permission token (SDD §16) | Status Codes |
|--------------|--------|------|---------|-----------------|----------------------------|--------------|
| [API-01](../sdd-[sdd-slug]/11-api-contracts.md#[api-01-heading-slug]) | `POST` | `/v1/foo` | Create foo | Required | `foo:write` | 201, 400, 401, 403, 409, 413, 422, 429 |
| - | `GET` | `/v1/foo/{id}` | Get foo by ID | N/A | `foo:read` | 200, 401, 403, 404, 429 |
| - | `GET` | `/v1/foo` | List foos (paginated) | N/A | `foo:read` | 200, 400, 401, 403, 429 |
| - | `PATCH` | `/v1/foo/{id}` | Update foo | Required | `foo:write` | 200, 400, 401, 403, 404, 409, 413, 422, 429 |
| - | `DELETE` | `/v1/foo/{id}` | Delete foo (soft) | Required | `foo:write` | 204, 401, 403, 404, 409, 429 |

> **Convention:** every write endpoint a client may retry requires an `Idempotency-Key` header, except the excluded routes; money, wallet, notification, and external-provider writes are never excluded (CLAUDE.md). The scope, the tuples, the TTL, and the excluded routes are in `09-cross-cutting.md` § 12.2.
>
> **Status Codes:** the endpoint's own outcomes plus every status a filter or interceptor on its path can return, read from the `09-cross-cutting.md` § 12.6 Filter chain; the chain is listed there once and never here.
>
> **Traced entry points:** every HTTP entry point that a 04 traceability line names is a row here, and a row the trace names but this table lacks is a gap to fix before review.
>
> **API ID:** the SDD §15 HTTP contract (Type Internal or External) the endpoint implements, linked to its block; `-` for an endpoint no §15 contract covers (for example one only the frontend calls). Every row has one block in § 9.2. A call a service makes to a provider is not a § 9.1 row: it is recorded in the § 12.3 Instances table of `09-cross-cutting.md`, and the provider's contract (its SDD §15 entry, or the provider LLD) holds the block. The owner's 04 file names the controller, and a client is the one that the HTTP client rows of `03a-libraries-and-conventions.md` § 6.5.1 give that service: this chunk names none. Permission tokens are SDD §16 tokens, verbatim. An endpoint whose SDD contract has no token copies the SDD's cell verbatim (`None - public`); any reason goes in § 9.3, never in the cell (never `- (<reason>)`).

### Service: `[service-b]`

<!-- Repeat. -->

## 9.2 Request / Response Shapes

> **Source:** one block below for every § 9.1 endpoint and every § 9.6 port contract, each with every field of the list that follows. From an SDD, a block is a derived view of the SDD §15 contract its API ID cell links or, for an endpoint with API ID `-`, of the owner's `13x` List of APIs and API Standards. It restates the values the implementer needs, names that source, and adds the implementation delta (records, validation, mapping). A value that differs from the SDD is drift to flag, never a silent local truth (`sdd-to-lld.md` § API contract blocks). The block follows its SDD contract and is the design: the OpenAPI spec must match the blocks, and a difference is a `Contract drift` item, never a silent edit of either. From code, a block is read from the controller, its records, and its controller advice. Request and response bodies are records, as the DTOs row of `03a-libraries-and-conventions.md` § 6.5.1 says. Timeout, retry, circuit breaker, and bulkhead values stay in the `09-cross-cutting.md` § 12.3 instance rows. Hybrid marks follow `hybrid-drift.md` § Section-by-section diff rules: `🆕 code-only` for an endpoint only the code has, `⛔ sdd-only` for one only the SDD has, `⚠ drift` for a field that differs.

**Block fields:** the one list. A block has every field of its column; none is left out, left blank, or written "standard".

| Field | HTTP endpoint (a § 9.1 row) | In-process port (a § 9.6 row) |
|-------|-----------------------------|-------------------------------|
| API ID | The SDD §15 `API-NN` the endpoint implements, linked to its contract block; `-` when no §15 contract covers it | The same |
| Method and path | `Method` and `Path`, as the row writes them | `Type` (`Internal (in-process)`) and `Operation` (`[ProviderPort].[operation]`), as the row writes them |
| Request headers | Each header beyond the standard ones: name, required, format | Omitted: the call never leaves the process |
| Path and query parameters | Each parameter: name, where, type, required, constraints | Omitted |
| Request body | The record, and each field: name, type, required, constraints; the body limit when it differs from the default of `09-cross-cutting.md` § 12.6a | The request record, and each field in the same table |
| Responses | Each success status: meaning, body record, response headers; then each body record's fields | The response record, and each field in the same table |
| Errors | Each error status of the row that is not a shared error: Problem Details `type`, `errorCode`, when | Each error the operation raises: `errorCode`, when. No status and no `type` |
| Idempotency | `Required` or `N/A` as the row says, then the key, the dedup window, what a repeat returns, and for `Required` what a repeat after the dedup window returns (`09-cross-cutting.md` § 12.2 Replay after TTL) | The key and what a repeated call returns, and `Transaction` as the row says |
| Authentication, Permission token | The scheme; the SDD §16 token, verbatim | The token, verbatim, checked at the port |

> **Convention:**
>
> - **One block per row.** The blocks of a service group follow its § 9.1 rows in order. A block is headed by the row's Method and Path (`POST /v1/foo`), or for a port by its port and operation (`[ProviderPort].[operation]`). A row whose Method and Path read `TBD` is headed by its API ID and operation (`API-02: [Operation]`). A service with no § 9.1 row has no group.
> - **Equal to the row.** A block's API ID, Method and Path (or Type and Operation), permission token, and idempotency requirement (`Required` or `N/A`) equal the row's cells. Every status of the row's Status Codes cell is a Responses row, an Errors row, a shared error, or covered by a `TBD - external` Responses or Errors field, and no other status appears.
> - **Proposed endpoints in full.** An endpoint the LLD proposes (API ID `-`, or one no SDD source shapes) gets a full block: every field carries a proposed value, and the `> Confirm:` flags those values. A block that is only a `> Confirm:`, with no request and response shape, is incomplete.
> - **Distinct outcomes.** Each outcome the client must react to differently has its own `type` and `errorCode`. Where several such outcomes share one code, the block declares a `reason` extension with its full value list, one value per outcome (`09-cross-cutting.md` § 12.6).
> - **Server deadlines.** An endpoint that enforces a time limit the UI shows (a session, an expiry, a countdown) returns the absolute server deadline as an ISO 8601 UTC timestamp, not only a duration (`14-frontend.md` § 17.10).
> - **Siblings agree.** Sibling responses use the same type and shape for the same concept: field errors are always the `errors[]` array, never a joined string, and an ID or a timestamp has one type across the group.
> - **Nothing blank.** A field with nothing to list says so on one line: `None`, `Standard headers only`, or `Not applicable - <reason>`.
> - **Values.** A value the SDD states, in its contract or for API ID `-` in its `13x` rows, is written as the SDD writes it, with no flag.
> - **Flags.** A value no source gives is written as a proposal and flagged: one `> Confirm:` directly under the block heading that names the proposed fields, or one under the group heading when every block of the group has the same gap. Where the SDD carries an open question on the value, the flag is a `> TODO: <best-guess> - verify` that cites it. From code, a field the code does not show is flagged the same way. A field is never invented without its flag.
> - **Errors.** An error's `type` and `errorCode` equal the owner's 04 § 7.7 row for the exception that raises it, and the `errorCode` is the SDD §15.1 standard code or the contract's domain code, verbatim. A status with an endpoint-specific `errorCode` is the block's own error, even when the status is also a shared error. `VALIDATION_FAILED` carries the `errors[]` extension (`09-cross-cutting.md` § 12.6).
> - **Idempotency.** `Required` names the key, the dedup window (the SDD's, when it states one; otherwise the default of `09-cross-cutting.md` § 12.2), and what a repeat returns.
> - **Pagination.** A paginated list endpoint lists its pagination parameters, and each cites § 9.4 in its Constraints cell.
> - **`TBD - external`.** A field the SDD marks `TBD - external` reads `TBD - external`, except a Method or Path that equals a § 9.1 cell reading `TBD`, which reads `TBD`. The block carries one `> TODO:` that cites the SDD contract and its §15.6 row. Such a field is not a missing field. The fields on our side (idempotency, the tenant rule, the permission token or `-`) are filled from the SDD.

**Standard headers:** every endpoint takes the headers of the SDD [§15.1 Standard headers](../sdd-[sdd-slug]/11-api-contracts.md#standard-headers) table: `Authorization`, `Content-Type`, `Accept`, the correlation header, the tenant header unless the token carries the tenant, `Idempotency-Key` on the writes that table names, and `traceparent`. With no SDD, list them here once. A block lists only the headers it adds, and lists `Idempotency-Key` only when its contract's §15.3 Request headers do (for API ID `-`, when it proposes the header).

**Shared errors:** the statuses the platform raises for any endpoint, each with its SDD [§15.1 Standard error codes](../sdd-[sdd-slug]/11-api-contracts.md#standard-error-codes) `errorCode` and its Problem Details `type`. A block lists only its own errors, and a shared status in a § 9.1 row needs no row in the block. This table is the home of the shared `type` values; a service's own exceptions are in its Error Handling rows (04 § 7.7). With no SDD, the rows are the statuses the code's security chain and global handler return.

| Status | `errorCode` | Problem Details `type` | Raised by |
|--------|-------------|------------------------|-----------|
| 401 | `UNAUTHENTICATED` | `https://errors.example.com/auth/unauthenticated` | The security chain |
| 403 | `FORBIDDEN` | `https://errors.example.com/auth/forbidden` | The permission check |
| 413 | `PAYLOAD_TOO_LARGE` | `https://errors.example.com/request/too-large` | The body limit filter (`09-cross-cutting.md` § 12.6a) |
| 429 | `RATE_LIMITED` | `https://errors.example.com/rate-limit/exceeded` | [The gateway or the rate limiter] |
| 500 | `INTERNAL_ERROR` | `https://errors.example.com/internal/error` | The global `@RestControllerAdvice` |
| 503 | `UNAVAILABLE` | `https://errors.example.com/[context]/unavailable` | [A downstream dependency is down] |

### Service: `[service-a]`

> **Source:** a block with an API ID restates that SDD §15 contract. A block with API ID `-` restates its row of the SDD [§17.X List of APIs](../sdd-[sdd-slug]/13[x]-service-[service-a].md#list-of-apis-swagger-friendly) and the API Standards, and proposes the fields they leave open, flagged. From code with no SDD, this line names the controller.

#### `POST /v1/foo`

<!-- A block with proposed values carries its flag line here: `> Confirm:` naming them. -->

| Field | Value |
|-------|-------|
| API ID | [API-01](../sdd-[sdd-slug]/11-api-contracts.md#[api-01-heading-slug]) |
| Method | `POST` |
| Path | `/v1/foo` |
| Authentication | Bearer JWT, validated as § 9.3 says |
| Permission token | `foo:write` (SDD §16, verbatim) |
| Idempotency | Required. The `Idempotency-Key` header; dedup tuple and TTL as `09-cross-cutting.md` § 12.2; a repeat of a finished request returns the stored response; after the window, 409 `CONFLICT` from the natural key |

**Request headers**

| Header | Required | Format | Notes |
|--------|----------|--------|-------|
| `Idempotency-Key` | Yes | string, max 64 | One key per logical request |

**Path and query parameters:** None.

<!-- With parameters, a table with the columns Name, In (path or query), Type, Required, Constraints. -->

**Request body** (record `FooDto`)

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `name` | string | Yes | 1..255 |
| `amount` | decimal | Yes | > 0, 2 dp |
| `metadata` | object | No | `metadata.key` is a string |

**Responses**

| Status | Meaning | Body record | Response headers |
|--------|---------|-------------|------------------|
| 201 | Created | `FooResponse` | `Location` |

**Response 201 body** (record `FooResponse`)

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `id` | uuid | Yes | UUIDv7 |
| `name` | string | Yes | - |
| `amount` | decimal | Yes | 2 dp |
| `status` | string | Yes | `ACTIVE` |
| `createdAt` | string | Yes | ISO 8601 UTC |

**Errors** (RFC 9457 Problem Details; `type` and `errorCode` as the owner's `04-implementation/<service>.md` § 7.7)

| Status | Problem Details `type` | `errorCode` | When |
|--------|------------------------|-------------|------|
| 400 | `https://errors.example.com/foo/validation` | `VALIDATION_FAILED` | Bean Validation or a domain rule fails; `errors[]` lists each field |
| 409 | `https://errors.example.com/idempotency/conflict` | `CONFLICT` | The key is in flight on another request, or was used with a different body |
| 422 | `https://errors.example.com/foo/[rule]` | `[DOMAIN_CODE]` | [The domain rule the request breaks] |

<!-- Repeat the block for each § 9.1 row of the group, in the row order, and the group for each service. -->

### In-process port contracts (§ 9.6)

<!-- Modular monolith or hybrid core only: one block per § 9.6 row, in its order. With no § 9.6 row, write "Not applicable - no in-process contracts" and drop the block below. -->

#### `[ProviderPort].[operation]`

| Field | Value |
|-------|-------|
| API ID | [API-03](../sdd-[sdd-slug]/11-api-contracts.md#[api-03-heading-slug]) |
| Type | `Internal (in-process)` |
| Operation | `[ProviderPort].[operation]` |
| Permission token | `[token]` (SDD §16, verbatim), checked at the port |
| Idempotency | [The key; what a repeated call returns] |
| Transaction | [Joins the caller's transaction / Runs in its own] |

**Request** (record `[RequestDto]`)

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `[field]` | [type] | [Yes / No] | [Constraints] |

**Response** (record `[ResponseDto]`)

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `[field]` | [type] | [Yes / No] | [Constraints] |

**Errors raised** (typed errors carrying the `errorCode`; no status and no `type`)

| Error | `errorCode` | When |
|-------|-------------|------|
| `[DomainError]` | `[DOMAIN_CODE]` | [Condition] |

## 9.3 Authentication & Authorisation

- **Token issuer:** [SDD §6 IAM / AuthN row], realm `[realm-name]` (CLAUDE.md default, Keycloak on-prem, only when SDD §6 is silent).
- **Token type:** JWT (Bearer).
- **Validation point:** the API gateway for inbound traffic (CLAUDE.md: cross-cutting concerns live in gateway/sidecar, not duplicated per service).
- **Internal HTTP calls (SDD §15.1):** the caller sends its client-credentials token (`Authorization: Bearer`); the provider, in its filter or a sidecar, checks the contract's SDD §16 permission token; mTLS stays as the transport. In-process port calls check the token at the port (04 § 7.2 Authorization, Kind Port).
- **Permission tokens:** the endpoint inventory tables above (SDD §16, verbatim). Each endpoint whose cell reads `None - public` (copied from the SDD) is named here with the reason it needs no token.
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
Names match SDD §15 verbatim and link its contract block; the DTO fields and the error list are in the row's § 9.2 block. Idempotency and Transaction are the contract's Behaviour rows, as SDD §15 writes them. No HTTP method, path, headers, status codes, or resilience config: the call never leaves the process.
-->

| API ID (§15) | Port interface | Operation | Request / response DTO records | Raised errors (`errorCode`) | Idempotency | Transaction | Permission token (SDD §16) | Implementing adapter |
|--------------|----------------|-----------|--------------------------------|-----------------------------|-------------|-------------|----------------------------|----------------------|
| [API-03](../sdd-[sdd-slug]/11-api-contracts.md#[api-03-heading-slug]) | `[ProviderPort]` | `[operation]` | `[RequestDto]` / `[ResponseDto]` | `[DomainError]` (`[DOMAIN_CODE]`) | [The key; what a repeat returns] | [Joins the caller's transaction / Runs in its own] | `[token]` | `[ProviderPortAdapter]` in `[provider-module]` |

> **Convention:** the provider module's `04-implementation/<module>.md` § 7.2 lists the port and its adapter, and its Authorization table checks the token at the port (Kind Port). Caller modules depend on the port interface only.

<!-- MASTER: [project-slug]-lld-master.md | PREV: 05-data-model.md | NEXT: 07-event-contracts.md -->

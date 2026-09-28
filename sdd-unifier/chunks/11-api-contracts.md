<!--
CHUNK: 11
TITLE: Service Integration API Contracts
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: 02 (ecosystem: IAM, gateway), 05 (sequences), 07 (§11.6 security defaults), 08 (§12 integrations), 09 (services), 12 (roles and permission tokens), 13a+ (per-service API lists)
PART OF: SDD - [Project Name]
PURPOSE: The API contract registry for every synchronous integration: service-to-service calls, outbound calls from a service to an external system, and inbound calls from an external system into a service (callbacks, webhooks). Each contract states the URI, headers, body, responses, error codes, security, and auth, so both sides implement the same contract with zero drift.
CONTRACT_RULE: This chunk is canonical for integration API contracts. Each per-service chunk (13x) lists the endpoint in its "List of APIs" with the API ID and links here; it never restates the headers, body, or error codes. Event contracts stay in chunk 10; roles and permission tokens stay in chunk 12 and are referenced here verbatim.
EXTERNAL_RULE: A contract whose other side is an external system is `TBD - external` until the user supplies the provider's API documentation. Provider-owned fields (URI, headers, body, responses, error codes, auth scheme) are written as `TBD` with the marker `**[TBD - EXTERNAL: ...]**`, never invented. Our-side policy (timeout, retries, circuit breaker, fallback, where credentials are stored) comes from §12 and is filled.
-->

# 15. Service Integration API Contracts

> **What this chunk is.** One contract block per synchronous integration API (`API-NN`), with everything an implementer on either side needs: endpoint, security, headers, parameters, body, responses, error codes, and behaviour (idempotency, timeouts, retries). Internal contracts are fully defined here. External contracts are placeholders marked `TBD - external` for the user to complete from the provider's documentation.
>
> **What this chunk is not.** It does not list client-facing endpoints that no other service or external party calls (those stay in each service's "List of APIs" in chunks 13x and in the OpenAPI specs, §21). It does not hold event contracts (§14, chunk 10).

---

## 15.1 Contract Conventions (platform defaults)

<!-- Stated once here; every contract block inherits them and lists only its deviations. Values come from §6 (ecosystem), §11.6 (security defaults), and the doctrine. Missing value -> [NEEDS CLARIFICATION: ...]. -->

| Concern | Platform default | Source |
|---------|------------------|--------|
| URI pattern | `/v{major}/[resource]` (URI-prefix versioning; a breaking change is a new major version, never an in-place change) | §9 principles, platform doctrine |
| Transport | [e.g., TLS 1.2+ everywhere; mTLS inside the mesh] | §6, §11.6 |
| Internal authentication | [e.g., OAuth2 client credentials issued by the platform IAM; service identity per service] | §6 IAM row, §11.6 |
| Authorization | Permission tokens from §16, verbatim | §16 (chunk 12) |
| Tenant context | Carried on every call ([header or token claim]) | §11.2 |
| Correlation | Carried on every call and propagated downstream ([header name]); W3C trace context for tracing | §11.4 |
| Idempotency | `Idempotency-Key` header required on every write that touches money, wallet, notifications, or an external provider | §9 principles, platform doctrine |
| Content type | `application/json`; errors as `application/problem+json` | - |
| Date and time | ISO-8601, UTC | §6 ecosystem rules |
| IDs | UUIDv7 | §6 ecosystem rules |
| Error model | RFC 9457 Problem Details with an `errorCode` extension (standard codes in the table below) | §11 |
| Resilience | Timeouts, retries with exponential backoff and jitter, circuit breaker, and bulkhead per downstream; values per contract, from §12 for external systems | §11, §12 |
| Sync chain depth | At most one synchronous hop between services; a deeper chain is a design defect, flagged in §15.5 | §9 principles, platform doctrine |

### Standard headers

| Header | Direction | Required | Format / example | Purpose |
|--------|-----------|----------|------------------|---------|
| `Authorization` | Request | Yes | `Bearer <token>` | Caller authentication |
| `Content-Type` | Request, Response | With a body | `application/json` | Body format |
| `Accept` | Request | Yes | `application/json` | Response format |
| [Correlation header, e.g. `X-Correlation-Id`] | Request, Response | Yes | UUID | End-to-end correlation |
| [Tenant header, e.g. `X-Tenant-Id`] | Request | [Yes / No if carried in the token] | UUIDv7 | Tenant context |
| `Idempotency-Key` | Request | On writes listed above | UUID | Safe retries |
| `traceparent` | Request | Yes | W3C trace context | Distributed tracing |

### Standard error codes

<!-- Every contract uses these; a contract adds its own domain codes in its Error codes table. -->

| HTTP status | `errorCode` | Meaning | Retryable | Consumer action |
|-------------|-------------|---------|-----------|-----------------|
| 400 | `VALIDATION_FAILED` | Request fails schema or field validation | No | Fix the request; `errors[]` lists each field |
| 401 | `UNAUTHENTICATED` | Missing or invalid credentials | No (refresh token once) | Obtain a new token, retry once |
| 403 | `FORBIDDEN` | Caller lacks the permission token | No | Do not retry; raise an alert |
| 404 | `NOT_FOUND` | Resource does not exist for this tenant | No | Handle as a business outcome |
| 409 | `CONFLICT` | State conflict or idempotency key reused with a different body | No | Re-read state; never reuse a key for a new request |
| 422 | `BUSINESS_RULE_VIOLATION` | Valid request that breaks a domain rule | No | Surface the domain error |
| 429 | `RATE_LIMITED` | Caller exceeded its limit | Yes, after `Retry-After` | Back off |
| 500 | `INTERNAL_ERROR` | Unexpected provider failure | Yes (idempotent calls only) | Retry with backoff, then circuit-break |
| 503 | `UNAVAILABLE` | Provider temporarily unavailable | Yes | Retry with backoff, then fallback |
| 504 | `UPSTREAM_TIMEOUT` | Provider's own dependency timed out | Yes (idempotent calls only) | Retry with backoff, then fallback |

---

## 15.2 Contract Index

<!-- One row per API-NN. Type: Internal (service -> service), External outbound (service -> external system), External inbound (external system -> service). Status: Defined / TBD - external / Flagged (see §15.5). Use case ref (derive-from-BRD): the BRD use cases the call serves, each as a link to its BRD heading (brd-to-sdd.md § Use-case traceability), or "-" for a call no use case drives; §7.3 reads its APIs column from here. -->

| API ID | Operation | Consumer (caller) | Provider (callee) | Type | Method & URI | Integration ref | Use case ref | Status |
|--------|-----------|-------------------|-------------------|------|--------------|-----------------|--------------|--------|
| API-01 | [Operation] | [Service] | [Service] | Internal | `[METHOD] /v1/[path]` | [13x § Integrations] | [[KEY/UC-NN](BRD link) / -] | Defined |
| API-02 | [Operation] | [Service] | [External system] | External outbound | TBD | [INT-NN] | [[KEY/UC-NN](BRD link) / -] | TBD - external |

---

## 15.3 Contract Details

### API-01: [Operation name] ([Consumer] -> [Provider])

- **Type:** Internal
- **Purpose:** [One sentence; link the use case ([KEY/UC-NN](BRD link)) and the service Integrations row.]
- **Status:** Defined

**Endpoint**

| Method | URI | Version | Request content type | Response content type |
|--------|-----|---------|----------------------|-----------------------|
| [POST] | `/v1/[path]/{[id]}` | v1 | `application/json` | `application/json` |

**Security and auth**

| Aspect | Value |
|--------|-------|
| Transport | [Per §15.1, or deviation] |
| Authentication | [Per §15.1, or deviation] |
| Authorization | [Permission token from §16, verbatim] |
| Tenant context | [Per §15.1; tenant isolation rule the provider enforces] |
| Data classification | [e.g., contains PII: masked in logs] |

**Request headers** (in addition to the standard headers)

| Header | Required | Format / example | Notes |
|--------|----------|------------------|-------|
| [Header] | [Yes / No] | [Format] | [Notes] |

**Path and query parameters**

| Name | In | Type | Required | Constraints | Description |
|------|----|------|----------|-------------|-------------|
| [id] | path | UUIDv7 | Yes | - | [Description] |

**Request body**

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| [field] | [string] | [Yes] | [e.g., max 64, enum] | [Description] |

```json
{
  "[field]": "[value]"
}
```

**Responses**

| Status | Meaning | Body | Response headers |
|--------|---------|------|------------------|
| [201] | [Created] | [Schema name / fields below] | [e.g., `Location`] |

```json
{
  "[field]": "[value]"
}
```

**Error codes** (standard codes from §15.1 apply; list only the codes this operation returns and its domain codes)

| HTTP status | `errorCode` | When | Retryable | Consumer action |
|-------------|-------------|------|-----------|-----------------|
| [422] | [DOMAIN_CODE] | [Condition] | [No] | [Action] |

**Behaviour**

| Aspect | Value |
|--------|-------|
| Idempotency | [Key required? Dedup window; replay returns the original response] |
| Timeout (consumer side) | [ms] |
| Retries and backoff | [e.g., 3 attempts, exponential with jitter, idempotent failures only] |
| Circuit breaker / bulkhead | [Thresholds] |
| Rate limit | [Limit per caller] |
| Pagination | [Not applicable / cursor-based] |
| Fallback when unavailable | [Behaviour] |

---

### API-02: [Operation name] ([Service] -> [External system])

- **Type:** External outbound
- **Purpose:** [One sentence; link the use case ([KEY/UC-NN](BRD link)) and INT-NN in §12.]
- **Status:** TBD - external

**[TBD - EXTERNAL: update from the [Provider] API documentation: URI, version, headers, request body, responses, error codes, and authentication scheme.]**

| Aspect | Value |
|--------|-------|
| Method and URI | TBD |
| Version | TBD |
| Authentication | TBD (provider scheme) |
| Request headers | TBD |
| Request body | TBD |
| Responses | TBD |
| Error codes | TBD (map each provider error to a platform `errorCode` once known) |
| Credentials storage | [From §6 secrets row, e.g., secret per tenant in the secrets manager] |
| Timeout, retries, circuit breaker | [From §12 INT-NN] |
| Fallback when unavailable | [From §12 INT-NN] |
| Source document | TBD (link the provider's API documentation once supplied) |

<!-- Repeat a contract block for each API-NN. External inbound contracts (callbacks, webhooks) follow the same TBD rule for provider-owned fields; our side (endpoint path, signature verification, idempotency, replay protection) is defined when the provider's scheme is known. -->

---

## 15.4 Coverage Matrix

<!-- Every synchronous integration has a contract. Sources: every §12 row with a synchronous protocol, every synchronous edge in §8.5 sequences, and every synchronous row in a service's Integrations table (chunks 13x). -->

| Source | Item | API ID(s) | Covered |
|--------|------|-----------|---------|
| §12 | [INT-NN - System] | [API-NN] | [Yes / No: flagged in §15.5] |
| §8.5 | [Sequence name, step N] | [API-NN] | [Yes / No] |
| §17.X | [Service - Integrations row] | [API-NN] | [Yes / No] |

---

## 15.5 Consistency Notes & Drift Register

<!-- Divergences between this chunk and chunks 08, 13x (List of APIs), or 12 (permission tokens), and any synchronous chain deeper than one hop. Fixed divergences are not listed; open ones stay here until resolved. -->

| # | Where | Divergence | Status |
|---|-------|------------|--------|
| [1] | [API-NN vs §17.X List of APIs] | [e.g., URI differs] | [Open / Fixed in vX.X] |

---

## 15.6 External Contracts Awaiting the User

<!-- A view of the TBD - external contracts, so the user knows what to supply. Derived from §15.2 Status; the contract blocks stay the single home of the fields. -->

| API ID | Provider | Fields still TBD | Document needed from the user |
|--------|----------|------------------|-------------------------------|
| [API-02] | [External system] | [URI, headers, body, error codes, auth] | [Provider API reference / sandbox guide] |

<!-- MASTER: [project-slug]-sdd-master.md | PREV: 10-events-hub.md | NEXT: 12-centralized-user-roles.md -->

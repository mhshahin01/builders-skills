<!-- SHARED: eco-system-template.md | HOME: sdd-unifier | COPIES: lld-unifier | Each skill reads only its own copy. Edit the HOME copy, then copy it byte for byte to every COPIES skill in the same change. _fixtures/checkers/check_shared.py compares the copies. -->
<!--
How to use this template:
- Save your copy as `[project-slug]-eco-system.md` in the project root, the folder that holds the `brd-`, `sdd-`, and `lld-` folders. `[project-slug]` is the project slug the design documents use, for example `refunds-platform-eco-system.md`.
- Copy everything from the `# Eco-system:` title down. This comment and the line above it stay in the template.
- Fill in the Document header and Part A. Part B is optional. Part C has one block per external system.
- A field marked Required must be present. Write `Not known` when the fact is not known yet, and `Not applicable` when a field or a layer does not apply. A field marked Optional may be left out.
- Write only the facts you have. A field you leave out, or mark `Not known`, stays open in the design documents: nothing is invented for it.
- Delete a Part A row you do not want to state. A row you leave out is not changed by this file.
-->

# Eco-system: [Project Name]

## Document header

| Field | Value | Required |
|-------|-------|----------|
| Project | [Project name, as the design documents name it] | Required |
| Version | [X.Y] | Required |
| Date | [YYYY-MM-DD] | Required |
| Author | [Name or role] | Optional |
| Status | [Draft / Approved] | Optional |

## Part A: Tech stack

One row per layer of the platform stack. The rows below use the layer names of SDD §6. Add a row for any other layer.

| Column | Required | What to write |
|--------|----------|---------------|
| Layer | Required | The layer name. |
| Technology / Service | Required | The named technology or service, or `Not applicable` when the platform has no such layer. |
| Version / Tier | Required | The version pin or the tier, `n/a` when none applies, or `Not known`. |
| Notes | Optional | Topology, constraints, or why the layer does not apply. |

| Layer | Technology / Service | Version / Tier | Notes |
|-------|----------------------|----------------|-------|
| Architecture Doctrine | [Style and communication model] | n/a | [Notes] |
| Compute / Infra | [Technology / Service] | [Version / Tier] | [Notes] |
| Container Runtime | [Technology / Service] | [Version / Tier] | [Notes] |
| Service Mesh / Ingress | [Technology / Service] | [Version / Tier] | [Notes] |
| Primary RDBMS | [Technology / Service] | [Version / Tier] | [Notes] |
| Caching | [Technology / Service] | [Version / Tier] | [Notes] |
| Event Broker / Streaming | [Technology / Service] | [Version / Tier] | [Notes] |
| Object Storage | [Technology / Service] | [Version / Tier] | [Notes] |
| IAM / AuthN | [Technology / Service] | [Version / Tier] | [Notes] |
| Secrets Management | [Technology / Service] | [Version / Tier] | [Notes] |
| API Gateway | [Technology / Service] | [Version / Tier] | [Notes] |
| CI/CD | [Technology / Service] | [Version / Tier] | [Notes] |
| Observability: Logging | [Technology / Service] | [Version / Tier] | [Notes] |
| Observability: Metrics | [Technology / Service] | [Version / Tier] | [Notes] |
| Observability: Tracing | [Technology / Service] | [Version / Tier] | [Notes] |
| Backend Runtime | [Technology / Service] | [Version / Tier] | [Notes] |
| Frontend Stack | [Technology / Service] | [Version / Tier] | [Notes] |
| Reporting / BI | [Technology / Service] | [Version / Tier] | [Notes] |

## Part B: Ecosystem rules (optional)

Rules that every service or module follows, one per bullet, in the style of the SDD §6 Ecosystem-level rules: a short bold name, then the rule. Leave this part out when there are none.

- **[Rule name]:** [The rule, for example UTC for every stored and exchanged date-time.]

## Part C: Integration specs

One block per external system the platform exchanges data with. Copy the block for each system. The block's heading is the system's name, as the design documents name it.

### [External system name]

| Field | Value | Required |
|-------|-------|----------|
| Owner (role) | [The role that owns the system on its side, for example the provider's integration team] | Required |
| Purpose | [What the platform uses the system for] | Required |
| Protocol and style | [For example REST over HTTPS with JSON, SOAP, SFTP batch files, or webhooks] | Required |
| Auth scheme and credential type | [For example OAuth 2.0 client credentials, an API key, or a mutual TLS certificate] | Required |
| Environments and base URLs | [Dev: [URL]; SIT: [URL]; UAT: [URL]; Prod: [URL]] | Optional |
| Spec reference | [Link or path to the OpenAPI, WSDL, or other specification document] | Required |
| Rate limits and quotas | [For example requests per second per client, or a daily quota] | Optional |
| Availability or SLA | [For example monthly availability and support hours] | Optional |
| Provider timeouts | [The time limits the provider applies to a request] | Optional |
| Error model | [How the provider reports errors, for example an HTTP status with an error body] | Optional |
| Network access | [For example VPN, IP allow-list, or private link] | Optional |
| Data formats | [For example JSON, ISO 8601 dates, and ISO 4217 currency codes] | Optional |
| Sandbox availability | [Whether a test environment with test credentials exists] | Optional |
| Notes | [Anything else the design needs to know] | Optional |

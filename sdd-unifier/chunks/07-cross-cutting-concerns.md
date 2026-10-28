<!--
CHUNK: 07
TITLE: Cross-Cutting Concerns (Summarized)
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: 02, 06
PART OF: SDD - [Project Name]
-->

# 11. Cross-Cutting Concerns (Summarized)

<!--
Each concern in this section is the platform-wide default. Individual services may override the default in their detailed section
(§17.X, chunks 13x) and the override must be justified there.
With a loaded Pre-SDD (SKILL.md step 2a), the items its chunk 12 lands in §11 are cited as PSDD/<ID> with a link and are locked (brd-to-sdd.md § Pre-SDD inputs (locked)).
-->

## 11.1 DB Modeling (Default)

- **Engine:** [Engine + version]
- **PK strategy:** [Strategy]
- **Auditing columns on every table:** [List]
- **Table format:** Every table of a service's Tables Design follows the one format defined there, in each service's DB Modeling (§17.X).
- **Soft delete:** [Approach]
- **Migrations:** [Tool + workflow]
- **Naming:** [Convention]
- **Indexing:** [Default rules]
- **JSON columns:** [Usage rules]
- **Publication log (modular monolith or hybrid core, durable in-process events, §14.10):** [Table, written in the publisher's transaction; redelivery and retention / Not applicable]

## 11.2 Multi-Tenancy (Default)

- **Strategy:** [Shared schema with tenant_id / Schema-per-tenant / DB-per-tenant]
- **Tenant context:** [How resolved + propagated]
- **Isolation enforcement:** [How enforced]
- **Cross-tenant access:** [Policy]
- **Index rule (shared-schema tables only):** [Every secondary index and unique key leads with `tenant_id`; the UUIDv7 primary key `id` is exempt, being globally unique; a project file may tighten this. Not applicable for schema-per-tenant or DB-per-tenant]

## 11.3 Deployment (Default)

- **Packaging:** [Format]
- **Orchestration:** [Platform]
- **Strategy:** [Rolling / Blue-Green / Canary defaults]
- **Configuration:** [How config + secrets are delivered]
- **Resource model:** [Requests / limits / autoscaling defaults]
- **Promotion path:** [Dev -> SIT -> UAT -> Prod gating]

## 11.4 Observability (Default)

- **Logging:** [Format + mandatory fields]
- **Metrics:** [Tooling + RED + golden signals]
- **Tracing:** [Tooling + sampling]
- **Dashboards:** [Default dashboard expectations]
- **Alerting:** [Alerting model + on-call expectations]

## 11.5 Configuration Management (Default)

- **Source of truth:** [Where config lives]
- **Tooling:** [Tooling]
- **Hot reload:** [Yes / No, with conditions]
- **Feature flags:** [Tool + scoping]
- **Audit:** [Audit expectations]

## 11.6 Security (Default)

- **Service-to-service auth:** [mTLS / JWT / API key]
- **TLS:** [Minimum version + certificate management]
- **Secret rotation:** [Policy + cadence]
- **Vulnerability scanning:** [Tool + cadence + severity thresholds]
- **Dependency scanning:** [Tool + policy for critical CVEs]
- **CORS policy:** [Default rules]

<!-- MASTER: [project-slug]-sdd-master.md | PREV: 06-principles-and-decisions.md | NEXT: 08-integrations.md -->

# [Project / Product Name]: Solution Design Document (SDD)

**Project / Product Name:** [Project Name]
**Version:** [X.X]
**Status:** [Draft | In Review | Approved] <!-- Draft until a version is approved; Approved when the latest Changes Log row's Approved By cell is filled; In Review after a content change to an Approved SDD (SKILL.md § Output conventions, Cover status). -->
**Author:** [Author Name]
**Reviewers:** [Reviewer Name(s)]
**Approvers:** [Approver Name(s)]
**Date:** [YYYY-MM-DD]
**Lineage:** [Document Lineage](#document-lineage) (source BRDs and child LLDs)
**Reconciled:** [Date, checker, request and checked content revision/hash (hash scope and method: SKILL.md step 8b, E4) or explicit final-edit-then-check order]
**E2E gate (§24):** [Locked | Open - Up to date | Stale] - [Locked or Stale: each unmet condition E1-E4 with a short reason, if any; nothing follows Open - Up to date, whose evidence is the Reconciled line, the E3 marker inventory, and the E2E basis line]
**E2E basis:** [chunk 19 version; the Reconciled entry it was written or last verified against; the source revisions/hashes or "direct disk comparison" and date; the faithfulness check: its date and its mismatches by label; None until chunk 19 is written; behind a shut gate, the version and the entry it was written against, marked not verified]

### E3 marker inventory

<!-- Row format (COMBINED): link this file's source section anchor, then a colon and the marker's question text, copied verbatim. One classification per distinct question/section; moving a marker requires updating its source pointer. Blocks E3 reads exactly `Yes` or `No: <reason>`: Yes names its dependent claim; No always gives the nonblocking reason. Claims/reasons require human source review. -->

<!-- Inventory each live NEEDS CLARIFICATION marker in the body after following the references of the E2E claims. Include nonblocking markers with their reason. The question cell copies the marker's question text (the text after `NEEDS CLARIFICATION: `) verbatim, never paraphrased or shortened, minus a trailing `Owner: ...` sentence, which goes in the Owner column; it adds no qualifier outside the row format (nothing between the link and the colon, and nothing after the question). Step 8b checks every row against its marker before the gate line is written (SKILL.md step 8b, E3). Every row names an owner and a next action; a nonblocking row may give None as its next action. An owner may be a role the SDD names; when ownership is itself open, name the interim owners who must settle it. A blocker has an exact question/location, named owner, dependent claim/path and next owner action. File placement does not decide E3. A TBD - EXTERNAL placeholder needs a row only when the black-box exception fails (an E2E claim asserts provider contract fields), and then it blocks; a named black box with API IDs and no provider fields needs none. No markers: say None and name the checked sources. Until step 8 item 6 builds the inventory (SKILL.md), keep this heading and write only "Not built yet (SKILL.md step 8 item 6)." in place of the table. -->

| Marker source / question | Owner | Dependent E2E claim / reference path | Blocks E3 / reason | Next action |
|---|---|---|---|---|
| [Source section](#source-section-anchor): [exact open question] | [Named owner] | [Claim and dependency path, or None] | [Yes, or No: reason] | [Owner action, or None when nonblocking] |

<!-- Reconciled, E2E gate, E2E basis, and the E3 marker inventory: the generation state a chunked SDD keeps in its master (SKILL.md steps 6a and 8b). -->

---

## Document Lineage

<!-- Rules: brd-to-sdd.md § Source BRDs and lineage. With no source BRD, write "None - generated without a BRD" in Source BRDs. -->

### Source BRDs (parents)

<!-- One row per source BRD. Key: a short capital name from the BRD's project name (REFUNDS, WALLET), stable once seen; every BRD reference in this SDD carries it (REFUNDS/UC-04). Version: the BRD version this SDD was derived from or last reconciled against. Link: the BRD master (chunked) or combined file, relative to this file. -->

| Key | BRD | Version | Link | Covers |
|-----|-----|---------|------|--------|
| [KEY] | [BRD project name] | [X.X] | [[brd-slug]-brd-master.md](./brd-[brd-slug]/[brd-slug]-brd-master.md) | [What this BRD contributes] |

### Child LLDs (children)

<!-- Written by lld-unifier: each LLD that reads this SDD (Direction: from-sdd, hybrid, partial, or from-code with this SDD given) adds or updates its own row, matched by Link; SDD version is the SDD version that LLD reflects (lld-unifier step 6c). Checked by sdd-unifier on every run: links resolve, scope services exist in §13, sibling LLD masters (lld-*/*lld-master.md) and combined LLDs (LLD-*.md, skipping LLD-*-MERGED.md: a merged copy of a chunked LLD already registered through its master) whose Related SDD line links to this file are added if missing, stale rows are flagged, never deleted. A row whose SDD version is older than this SDD's version is out of date: sdd-unifier appends " (out of date: SDD is now v[X.X]; refresh through lld-unifier)" to its SDD version cell (replacing an earlier such note) and names the LLD in the handoff; it never writes into the LLD, whose next run rewrites its own row and clears the note only when the row then names this SDD's current version. Before any LLD exists: one row "None yet". -->

| LLD | Scope (§13 services) | Direction | Version | SDD version | Link |
|-----|----------------------|-----------|---------|-------------|------|
| None yet | - | - | - | - | - |

---

## Changes Log

<!-- Initial row: names the open items the first build's acceptance loop applied (SKILL.md step 8 item 3), then Chunks: none (initial build), dated when the first build completes (when part 3 completes in parts, when the run completes in whole). Later rows: Chunks lists semantic edits only, excluding routine synchronized metadata; date = the request's first content change. Review-content changes count, a new coverage record row included when the update changes other content (coverage rows alone bump nothing); companion headers reflect current parent without a separate bump. -->

| Version | Updated Date | Updated By | Reviewed By | Approved By | Update Summary |
|---------|--------------|------------|-------------|-------------|----------------|
| 1.0     | YYYY-MM-DD   | [Name]     |             |             | Initial draft. Chunks: none (initial build) |

<!-- One row per update that changes content (SKILL.md § Output conventions, Versions), ending with its `Chunks:` list. Reviewed By and Approved By: SKILL.md § Output conventions, Approvals. -->

---

## Table of Contents

<!-- Auto-generated or manually maintained. Include Figures and Tables indices if the document is large. -->

**Figures**

| Figure # | Title | Section |
|----------|-------|---------|
| Figure 1 | [Title] | [Section] |

**Tables**

| Table # | Title | Section |
|---------|-------|---------|
| Table 1 | [Title] | [Section] |


---


# 1. Executive Summary

<!--
Technical executive summary, complementary to the BRD executive summary.
Focus: what the system is technically, the architecture style at a glance, the key technology pillars, and the technical bets.
Audience: engineering leadership, architects, senior developers, SRE/DevOps.
2-4 paragraphs.
-->

[Technical description of the system.]

[Architecture style and primary technical objectives.]

Core technical capabilities at a glance:

- [Capability 1]
- [Capability 2]
- [Capability 3]

Key technical bets and trade-offs:

- [Bet 1 and rationale]
- [Bet 2 and rationale]

**Project Type:** [Greenfield | Brownfield] - [one-line justification; brownfield: where the existing codebase is]

---


---


# 2. Scope

## 2.1 In Scope

<!-- Solution-design-level scope. What this SDD will detail and what the team commits to design and build. -->

- [Solution scope item 1]
- [Solution scope item 2]
- [Solution scope item 3]

## 2.2 Out of Scope

<!-- Explicitly excluded from this SDD. Reference the deferral reason or the document where it is handled. A phase-based source BRD's later-phase scope items are listed here as the phasing boundary, one line per later phase (brd-to-sdd.md § Phase-based BRDs). -->

- [Out-of-scope item 1, with justification or deferral note]
- [Out-of-scope item 2]

---


---


# 3. Assumptions

<!-- Numbered list. Each assumption should be testable and unambiguous. Anything that, if false, would invalidate the design. -->

1. **[Short Label]:** [Detailed assumption description].
2. **[Short Label]:** [Detailed assumption description].
3. **[Short Label]:** [Detailed assumption description].

---


---


# 4. Risks

<!--
List of technical and architectural risks. Each risk includes likelihood, impact, and a mitigation.
Owner: who will own the mitigation and the monitoring of the risk.
-->

| Risk ID | Description | Likelihood (L/M/H) | Impact (L/M/H) | Mitigation | Owner |
|---------|-------------|--------------------|----------------|------------|-------|
| R-01    | [Risk description] | [L/M/H] | [L/M/H] | [Mitigation] | [Owner] |
| R-02    | [Risk description] | [L/M/H] | [L/M/H] | [Mitigation] | [Owner] |

---


---


# 5. Glossary

| Term | Definition |
|------|------------|
| [Term 1] | [Definition] |
| [Term 2] | [Definition] |


---


---


# 6. Ecosystem Overview

<!--
Summary of the platform-wide technology stack and shared infrastructure that all services in this SDD must conform to.
This section is the single source of truth for the implementation constitution and planned technology choices.
SELECTION FLOW: this table is never filled silently. Per SKILL.md § Ecosystem selection, the skill first presents the proposed ecosystem (BRD Technical Inputs verbatim > CLAUDE.md defaults > BRD-informed recommendations; in TRANSFORM, the source SDD's named technologies, versions, and topology come first, locked as `source SDD`) for a one-shot accept-all; if not accepted, it walks the user through the items in grouped batches, highlighting the recommended option per item with the BRD evidence that drives it. Record the outcome per row in the Notes column (e.g., "BRD-mandated", "source SDD", "questionnaire", "default", "recommended", "user override - see ADR-NN").
-->

| Layer | Technology / Service | Version / Tier | Notes |
|-------|----------------------|----------------|-------|
| Architecture Doctrine | [Style and communication model from the architecture questionnaire, e.g., Modular monolith with in-process module ports, or Microservices + EDA backbone; DDD (bounded contexts) + Hexagonal (ports & adapters) in every style] | n/a | [questionnaire (ADR-01), or the source when it did not run, else proposed and flagged] |
| Compute / Infra | [On-prem Kubernetes / EKS / AKS / GKE] | [vX.Y] | [Cluster topology, node groups, multi-AZ, etc.] |
| Container Runtime | [containerd / Docker] | [vX.Y] | [Notes] |
| Service Mesh / Ingress | [Istio / Linkerd / NGINX Ingress / Cloud LB] | [vX.Y] | [mTLS, traffic policies] |
| Primary RDBMS | [PostgreSQL / other] | [Version] | [HA topology, replicas, backups] |
| Caching | [Redis / ElastiCache / other] | [Version] | [Cluster mode, persistence, eviction] |
| Event Broker / Streaming | [Kafka / SNS+SQS / RabbitMQ / ActiveMQ] | [Version] | [Topic strategy, retention, partitions] |
| Object Storage | [S3 / MinIO / Azure Blob / other] | [Tier] | [Bucket strategy, lifecycle policies] |
| IAM / AuthN | [Keycloak / Cognito / Auth0 / other] | [Version] | [Realms, federation, OIDC flows] |
| Secrets Management | [Vault / Secrets Manager / Sealed Secrets] | [Version] | [Rotation policy] |
| API Gateway | [Kong / API Gateway / Spring Cloud Gateway] | [Version] | [Auth, rate limiting, routing] |
| CI/CD | [GitHub Actions / GitLab CI / Jenkins / ArgoCD] | [Version] | [Pipeline standards] |
| Observability: Logging | [Loki / ELK / CloudWatch / other] | [Version] | [Retention, indices] |
| Observability: Metrics | [Prometheus + Grafana / Datadog / other] | [Version] | [Scrape interval, dashboards] |
| Observability: Tracing | [OpenTelemetry + Jaeger / Tempo / X-Ray] | [Version] | [Sampling rate] |
| Backend Runtime | [Language + Framework, e.g., Java 21 / Spring Boot 3.5+] | [Version] | [Layering rules] |
| Frontend Stack | [Framework + UI lib, e.g., Angular / Tailwind / PrimeNG] | [Version] | [Design system, primary color] |
| Reporting / BI | [Tool] | [Version] | [Read-replica or warehouse-backed] |

**Ecosystem-level rules:**

<!-- The first three rules are platform defaults (EDA / DDD / Hexagonal), adapted to the style in ADR-01 (architecture-questionnaire.md § Effect on the SDD): microservices keep the service wording; a modular monolith or hybrid core also writes the module variant. Any other override of them needs an ADR in §10. -->

- **Event-driven by default (EDA):** every cross-service state change travels as an asynchronous event through the Centralized Event Hub (§14); synchronous REST is reserved for true request-response, capped at one hop. In a modular monolith or hybrid core, module-to-module changes use in-process domain events (§14.10) and `Internal (in-process)` port calls (§15); anything that leaves the process goes through the hub. Outbox pattern mandatory - no dual-writes.
- **DDD bounded contexts:** one service or module owns one bounded context, its data, and one team of decisions: one database per service, or one schema per module with no cross-module joins in a modular monolith. No shared schemas across services or modules; the §13 decomposition follows domain boundaries, not technical tiers.
- **Hexagonal architecture (ports & adapters) per service or module:** domain core isolated from transport and infrastructure; inbound/outbound adapters (REST, messaging, persistence, providers) plug into ports, and modules call each other only through ports. Provider integrations sit behind anti-corruption adapters.
- [Rule, e.g., timezone - UTC for all datetimes]
- [Rule, e.g., ID strategy - UUIDv7 primary keys]
- [Rule, e.g., service-to-service auth]
- [Rule, e.g., secrets handling]


---


---


# 7. System Users & Use Cases

## 7.1 Actors

<!-- List all actors (human users and external systems) that interact with the platform. -->

| Actor | Type (Human / System) | Description | Primary Interface |
|-------|-----------------------|-------------|-------------------|
| [Actor 1] | [Human / System] | [Description] | [Interface] |
| [Actor 2] | [Human / System] | [Description] | [Interface] |

## 7.2 Use Case Diagram

**Figure 1: Use Case Diagram**

<!-- Inline Mermaid is the default diagram medium. Carry the UC IDs verbatim from the BRD with their BRD key, as plain quoted labels (no links inside Mermaid). The links to the BRD live in the text around the diagram, its Summary, and in §7.3 (brd-to-sdd.md § The link, item 6). Append `> Miro: <url>` only if a richer whiteboard version exists on a real board. -->

```mermaid
flowchart LR
  %% Replace placeholders below
  A1([Actor 1])
  A2([Actor 2])
  EXT([External System])

  subgraph System
    UC01(("KEY/UC-01"))
    UC02(("KEY/UC-02"))
  end

  A1 --> UC01
  A2 --> UC02
  EXT --> UC02
```

**Summary:** [1-2 sentences: which actors drive which use-case clusters, each use case cited as its keyed link.]

## 7.3 Use Case Traceability (BRD → SDD)

<!--
Derive-from-BRD only. For an SDD with no source BRD, keep this heading and write: "Not applicable - no source BRD."
One row per use case of every source BRD, including the rows a BRD marks "Merged into UC-NN" or "Removed". Rows are grouped by BRD in the order of the Source BRDs register (§ Document Lineage in the cover), each group under a row naming the BRD (data source) with its version, key, and a link to its master or combined file (its Source BRDs Link). Inside a group, rows follow that BRD's Use Case Summary. Every use case carries its BRD key: [KEY/UC-NN](link).
A consolidated view: every column is read from its home and never states a mapping the home does not state.
  Use case (BRD), Title: the BRD Use Case Summary (title exactly as the BRD writes it).
  Status: derived from the marker that opens the use case's Description cell in that summary: no marker gives Active; "Merged into UC-NN." gives Merged into [KEY]/UC-NN (keyed); "Removed: [reason]." gives Removed (the reason stays in the BRD).
  Owner: the §13 "Use cases (BRD)" column, the home of ownership (exactly one owner per active use case).
  Entry points: the named service's List of APIs (§17.X), method and path exactly as written there; or the trigger (Schedule: [name] / Event: [EVENT_NAME]) from that service's Input table, whose row cites this use case; every trigger row that cites the use case is listed, the owner's or another service's, and no other trigger, except an event the use case itself fires (its Events value) (brd-to-sdd.md § The trigger tie).
  Flows: the "Use cases:" lines in §8.4 and §8.5.
  APIs: §15.2 "Use case ref".
  Events: the "when" citations in §14.5 and the When column of §14.10 (in-process domain events); an event the use case only handles is an Entry points trigger (Event: [EVENT_NAME]).
Links: each UC ID links to its heading in the BRD (file + anchor; from this combined file the BRD is at ./brd-[brd-slug]/ or ./BRD-[BrdName]-v[X.X].md). Owner and Flows link to headings in this file. Rules: brd-to-sdd.md § Use-case traceability.
Gaps: an active use case with no owner or no entry point gets [NEEDS CLARIFICATION: ...] in that cell; such a marker is always an E3 dependency (service ownership and entry points), so it blocks the e2e gate (SKILL.md step 8b). Flows, APIs, and Events may be "-". Merged or removed rows show "-" in every mapping column.
-->

| Use case (BRD) | Title | Owner (§17.X) | Entry points | Flows (§8.4 / §8.5) | APIs (§15) | Events (§14) | Status |
|----------------|-------|---------------|--------------|---------------------|------------|--------------|--------|
| **[[BRD project name] v[X.X]](./brd-[brd-slug]/[brd-slug]-brd-master.md) ([KEY])** | | | | | | | |
| [[KEY]/UC-01](./brd-[brd-slug]/06a-use-cases-[persona-slug].md#uc-01-[title-slug]) | [Short title, as in the BRD] | [[service-name](#171-[service-name-slug])] | `[METHOD] /v1/[path]` | [[§8.4.1](#841-workflow-[flow-slug]) / -] | [API-NN / -] | [`EVENT_NAME` / -] | Active |
| [[KEY]/UC-02](./brd-[brd-slug]/05-user-journeys-overview.md#use-case-summary) | [Short title] | - | - | - | - | - | [Merged into [KEY]/UC-01 / Removed] |


---


---


# 8. System Design / High-Level Architecture

## 8.1 Architecture Style

### 8.1.1 What

<!-- Name the style chosen in the architecture questionnaire (SKILL.md step 3b; ADR-01): modular monolith, hybrid, or microservices, with its communication model. DDD bounded contexts and hexagonal (ports & adapters) structure apply in every style; anything that leaves the process goes through an outbox. When the questionnaire did not run, take the style from the source or flag it. A later change of style needs a new ADR. -->

[Architecture style statement.]

### 8.1.2 Why

<!-- Why this style fits the business and technical objectives. Tie back to NFRs and BRD objectives. -->

- [Reason 1]
- [Reason 2]
- [Reason 3]

### 8.1.3 How

<!-- How the style manifests in this system: bounded contexts, communication patterns, data ownership, deployment model. -->

- **Bounded contexts:** [List of contexts and which service owns each]
- **Inter-service communication:** [Sync vs async; protocols]
- **Data ownership:** [Ownership rules]
- **Deployment model:** [Packaging and orchestration]

## 8.2 Context Diagram

**Figure 2: System Context Diagram**

<!-- Inline Mermaid is the default diagram medium. Label each edge with protocol + purpose. Append `> Miro: <url>` only if a richer whiteboard version exists on a real board. -->

```mermaid
flowchart TB
  %% Replace placeholders below
  EXT1([External Entity 1]) -->|protocol| SYS[[System]]
  EXT2([External Entity 2]) -->|protocol| SYS
  SYS -->|protocol| EXT3[(External Entity 3)]
```

**Summary:** [1-2 sentences: who talks to the system and over what.]

## 8.3 High-Level Architecture Diagram

**Figure 3: High-Level Architecture**

<!-- Inline Mermaid is the default diagram medium. Show the layers: edge, frontend, services, data plane, async backbone, external, observability. -->

```mermaid
flowchart TB
  %% Replace with the real component graph
  subgraph Edge
    GW[Edge / Gateway]
  end
  subgraph Frontend
    FE[Frontend App]
  end
  subgraph Services
    S1[Service 1]
    S2[Service 2]
  end
  subgraph DataPlane
    DB[(Database)]
    CACHE[(Cache)]
  end
  FE --> GW --> S1 & S2
  S1 & S2 --> DB
  S1 & S2 --> CACHE
```

**Summary:** [1-2 sentences: the layer composition and the load-bearing connections.]


---


## 8.4 Workflow Diagrams

<!-- Add one workflow per critical end-to-end business flow. Inline Mermaid is the default diagram medium; each diagram gets a 1-2 sentence prose Summary so it reads without rendering. Append `> Miro: <url>` only if a richer whiteboard version exists on a real board. -->
<!-- Derive-from-BRD: every workflow and sequence starts with a "Use cases:" line linking the BRD use cases it shows (link rules: brd-to-sdd.md § Use-case traceability), or "None - platform flow". §7.3 reads its Flows column from these lines. Inside the Mermaid block, use cases stay plain IDs. With no source BRD, leave the line out. -->

### 8.4.1 Workflow: [Flow Name]

**Use cases:** [[KEY/UC-NN](BRD link), [KEY/UC-NN](BRD link) / None - platform flow]

```mermaid
flowchart TD
  A[Step 1] --> B[Step 2]
  B --> C[Step 3]
  C --> D[Step 4]
```

**Summary:** [1-2 sentences describing the flow in prose.]

### 8.4.2 Workflow: [Flow Name]

<!-- Repeat for each critical workflow. -->

## 8.5 Sequence Diagrams

<!-- Add one sequence diagram per critical interaction (sync + async). -->

### 8.5.1 Sequence: [Flow Name]

**Use cases:** [[KEY/UC-NN](BRD link) / None - platform flow]

```mermaid
sequenceDiagram
  participant P1 as Participant 1
  participant P2 as Participant 2
  P1->>P2: [message]
  P2-->>P1: [response]
```

**Summary:** [1-2 sentences describing the interaction in prose.]

### 8.5.2 Sequence: [Flow Name]

<!-- Repeat for each critical sequence. -->


---


---


# 9. Architecture Principles

<!-- Cross-cutting principles every service in the system must honor. Add or remove rows per project. -->

| # | Principle | Description |
|---|-----------|-------------|
| AP-01 | **Stateless services** | [Description] |
| AP-02 | **Idempotency** | [Description] |
| AP-03 | **Event-Driven Architecture** | [Description] |
| AP-04 | **Domain-Driven Design** | [Description] |
| AP-05 | **Loose Coupling** | [Description] |
| AP-06 | **Tenant Isolation** | [Description] |
| AP-07 | **API-First** | [Description] |
| AP-08 | **Observability by default** | [Description] |
| AP-09 | **Secure by default** | [Description] |
| AP-10 | **Backward-compatible evolution** | [Description] |
| AP-11 | **Automated testing & CI/CD** | [Description] |
| AP-12 | **Cost-aware design** | [Description] |

---


---


# 10. Architectural Decisions

<!--
High-level table of architectural decisions. Each row is the at-a-glance summary of an ADR.
For deeper, individual ADRs, link to a separate ADR repository / folder.
-->

| ID | Status | Decision (What) | Why | How (Implementation) | Consequences | Alternatives & Trade-offs |
|----|--------|-----------------|-----|----------------------|--------------|---------------------------|
| ADR-01 | [Proposed / Accepted / Superseded / Deprecated] | [Decision] | [Why] | [How] | [Consequences] | [Alternatives] |
| ADR-02 | [Status] | [Decision] | [Why] | [How] | [Consequences] | [Alternatives] |
| ADR-03 | [Status] | [Decision] | [Why] | [How] | [Consequences] | [Alternatives] |


---


---


# 11. Cross-Cutting Concerns (Summarized)

<!--
Each concern in this section is the platform-wide default. Individual services may override the default in their detailed section
(§17 Detailed Service Specs below) and the override must be justified there.
-->

## 11.1 DB Modeling (Default)

- **Engine:** [Engine + version]
- **PK strategy:** [Strategy]
- **Auditing columns on every table:** [List]
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


---


---


# 12. Integrations

<!-- High-level table of all external integrations. One row per integrated system. Every synchronous domain or provider integration also has an API contract in §15 (standard operational infrastructure is not one: SKILL.md step 6a); name its API-NN in Notes. External contracts stay `TBD - external` there until the user supplies the provider documentation. -->

| Integration ID | What (System) | Purpose | How (Protocol / Mode) | When (Trigger) | Auth | Timeout | Rate Limit | Retries & Backoff | Fallback | Notes |
|----------------|---------------|---------|------------------------|----------------|------|---------|------------|--------------------|-----------| ------|
| INT-01 | [System] | [Purpose] | [Protocol] | [Trigger] | [Auth] | [Timeout] | [Rate limit] | [Retries / backoff] | [e.g., Return cached / Degrade / Queue for retry] | [Notes] |
| INT-02 | [System] | [Purpose] | [Protocol] | [Trigger] | [Auth] | [Timeout] | [Rate limit] | [Retries / backoff] | [Fallback] | [Notes] |


---


---


# 13. Services Decomposition (Summary)

<!-- Type: `service` (its own deployable) or `module` (inside the single deployable of a modular monolith or hybrid core; architecture-questionnaire.md § Effect on the SDD). Status: `Active`, `Merged into [service]`, or `Removed: [reason]`; a merged or removed row stays in place, keeps its §17.X number, and has no §17.X block (parts-mode.md, What every part does, step 4). Use cases (BRD), derive-from-BRD: the BRD use cases this service owns, each as a link to its BRD heading (brd-to-sdd.md § Use-case traceability). This column is the home of ownership: every active BRD use case has exactly one owner here, and §7.3 reads it. A service that owns no use case writes "None - [what it serves]", e.g. "None - serves the BRD chunk 09 reports". A merged or removed service row writes "-". With no source BRD, write "-". -->

| Service | Type | Overview | Responsibility | Use cases (BRD) | Owns DB | Input | Output | Business Logic (Summary) | Integrations | Characteristics | Status |
|---------|------|----------|----------------|-----------------|---------|-------|--------|--------------------------|--------------|--------------------|--------|
| [Service Name] | [service / module] | [One-line] | [Responsibility] | [[KEY/UC-NN](BRD link), [KEY/UC-NN](BRD link)] | [DB name / schema] | [Inputs] | [Outputs] | [Summary] | [Integrations] | [Characteristics] | Active |
| [Service Name] | [service / module] | [One-line] | [Responsibility] | [None - what it serves] | [DB name / schema] | [Inputs] | [Outputs] | [Summary] | [Integrations] | [Characteristics] | [Active / Merged into [service] / Removed: [reason]] |


---


---


# 14. Centralized Event Hub (Platform Event Catalog & Payload Contracts)

> **What this section is.** The one place that lists **every event on the platform** with its producer, consumers, key family, payload contract, and business meaning (what / when / why), plus the hub topology that carries them. It is a derived consolidation of the per-service Event Models (each `13x` chunk § Event-Driven Architecture). Downstream LLD generation and implementers read this chunk as the single contract surface - the key goal is a smooth implementation with no producer/consumer mismatches.

---

## 14.1 Purpose & Scope

<!--
State the platform's eventing posture in one paragraph (EDA default: every cross-service state change travels as an asynchronous event; synchronous REST reserved for true request-response, capped at one hop).
Then answer four questions for the whole platform:
  1. What events exist (count + producing services)
  2. Who produces and who consumes each (reconciled both ways)
  3. What each event carries (envelope + payload contract)
  4. Why and when each fires (business moment + downstream purpose)
State what is OUT of scope: in-process events that never leave one module or one service; provider webhooks (REST callbacks, not bus events); external adapter ingestion edges normalized at an anti-corruption layer before any platform event.
In a modular monolith or a hybrid core, domain events between modules are IN scope: catalogue them in §14.10, apart from the integration events on the broker.
A modular monolith with no integration events answers the four questions for its §14.10 events here and keeps the §14.2 to §14.9 headings, each reading `Not applicable - no integration events (in-process domain events: §14.10).`, except §14.7 and §14.8, which still apply to the §14.10 events, and §14.9.0, which may hold value objects the §14.10 DTOs share. It writes no §14.9.X event headings, and §14.9.99 states 0 integration events.
-->

[Eventing posture + the four questions + out-of-scope list.]

## 14.2 Hub Topology Decision

<!--
Name the chosen topology and why (e.g., one logical hub realized as one topic per domain plus shared special-purpose topics, fanning out to one queue per consumer; or a single broker cluster with topic-per-aggregate). State what makes it ONE hub (shared envelope standard, shared messaging library, shared schema registry, shared event archive, one delivery semantic).
Include the tradeoff table for the chosen vs rejected topology.
-->

**Decision:** [One-line topology decision.]

What makes it *one hub* is the shared contract surface of the integration events on the broker (in-process domain events between modules: §14.10):

- **One envelope standard** (§14.3) on every event, on every topic.
- **One messaging library / pattern:** [outbox -> relay -> broker -> inbox, per CLAUDE.md outbox mandate].
- **One schema registry:** [registry + additive-only rule, CI-enforced].
- **One event archive:** [archive destination, subscribed from day one, for replay].
- **One delivery semantic:** at-least-once delivery, exactly-once **effect** via `(consumer, event_id)` inbox dedup, per-aggregate ordering via `aggregate_version`.

| Dimension | [Chosen topology] | [Rejected topology] |
|---|---|---|
| Access control | [Note] | [Note] |
| Blast radius | [Note] | [Note] |
| Archive / replay granularity | [Note] | [Note] |
| Ownership | [Note] | [Note] |
| Cost / fan-out | [Note] | [Note] |

### 14.2.1 Async Backbone (the universal per-event mechanism)

<!-- Integration events on the broker only. The in-process domain events of §14.10 do not use this mechanism. -->

```mermaid
flowchart LR
    subgraph PROD[Producer service - one bounded context]
      DOM[Domain aggregate write]
      OBX[(Outbox row - same transaction)]
      DOM -- one DB transaction --> OBX
    end
    REL[Relay / publisher]
    OBX -- after commit only --> REL
    REL -- publish envelope --> TOP((Broker topic))
    TOP -- fan-out --> Q1[Queue / group - consumer A]
    TOP -- fan-out --> Q2[Queue / group - consumer B]
    TOP -- archive subscription --> ARC[(Event archive)]
    Q1 --> INB[Inbox dedup on consumer + event_id]
    INB -- first delivery --> APPLY[Apply effect]
    INB -- already processed --> SKIP[Skip - idempotent no-op]
    APPLY -- poison / invalid --> DLQ[(DLQ + alarm + redrive runbook)]
```

**Summary:** [1-2 sentences: how an integration event travels from the producer's outbox to each consumer's inbox, and where a poison message goes.]

### 14.2.2 Hub Topology & Fan-Out Landscape

<!-- Producer -> topic -> consumer shape of the whole platform: structural clusters, not every edge (the full matrix is 14.5). -->

```mermaid
flowchart LR
    P1[Producer service 1] --> T1[[topic-1]]
    P2[Producer service 2] --> T2[[topic-2]]
    T1 --> C1[Consumer service A]
    T1 --> C2[Consumer service B]
    T2 --> C2
```

**Summary:** [1-2 sentences: which producers publish to which topics, and which consumer clusters bind to them.]

## 14.3 Standard Event Envelope (every event, every topic)

<!-- Every event carries this envelope; only the payload{} body varies per event. Adjust fields to the project but keep the invariants: unique event id (dedup key), typed past-tense fact, schema version, aggregate identity + monotonic version, UTC timestamp, correlation id, tenant keys, payload body. -->

| Field | Type | Meaning |
|---|---|---|
| `event_id` | UUIDv7 | Globally unique; the inbox dedup key `(consumer, event_id)` -> exactly-once effect. |
| `event_type` | string | SCREAMING_SNAKE_CASE, past-tense fact (e.g., `PAYMENT_COMPLETED`). |
| `schema_version` | semver | Schema version from the registry (additive-only). |
| `aggregate_id` | UUIDv7 | The producing aggregate instance. |
| `aggregate_type` | string | The producing aggregate (e.g., `Invoice`). |
| `aggregate_version` | int | Per-aggregate monotonic counter; the ordering / last-writer-wins guard. |
| `occurred_at` | timestamp (UTC) | When the fact happened. |
| `correlation_id` | UUIDv7 | Opaque request/trace correlation; carries no tenant data or PII. |
| `causation_id` | UUIDv7 (optional) | The event that caused this one. |
| `tenant_id` | UUIDv7 | Tenant key. [Adjust to the project's tenancy keys.] |
| `payload{}` | JSON | Event-specific body; schema owned by the registry (§14.9). |

**Key-family variants (if applicable):**

- [Family 1, e.g., tenant-keyed - most domain events.]
- [Family 2, e.g., generic keys for reusable services, mapped at an anti-corruption layer.]
- [Exceptions, each named and justified.]

## 14.4 Topic Registry

<!-- One row per topic. Every topic has exactly ONE owner (sole publisher). Names here are canonical - per-service chunks must use them verbatim. Phase from a phase-based source BRD: brd-to-sdd.md § Phase-based BRDs. -->

| # | Topic | Owner (sole publisher) | Key family | Phase |
|---|---|---|---|---|
| 1 | `[project]-[domain]-events` | [Service] | [Key family] | [P1] |
| 2 | `[project]-[domain]-events` | [Service] | [Key family] | [P1] |

**No topic, no published events (consumers only):** [List consumer-only services, e.g., API Gateway, Analytics.]

## 14.5 Platform Event Catalog

<!--
Grouped by producing service / topic - one sub-section per producer, in §13 decomposition order.
Status legend: committed = wired in its phase; candidate = name fixed; consumers may be named, but none is built against it until its payload contract (§14.9) is ratified, which makes it committed; Analytics-only = no named domain consumer.
Consumer reconciliation: consumer lists are reconciled from BOTH the producer's published table AND every consumer's consumed table. Where a producer under-lists, show the broader real set and footnote it.
Use-case link (derive-from-BRD): when a BRD use case step fires the event, the "when" cites it as a link with the step, e.g. "[REFUNDS/UC-04](BRD link) step 6". §7.3 reads its Events column from these citations and from the §14.10 When column. An event with another trigger (schedule, external callback, another event) names that trigger instead.
-->

**Status legend:** `committed` / `candidate` / `Analytics-only` / `Pn` = phase.

### 14.5.1 [Producer Service] - `[topic-name]` ([key family]; [phase])

| Event | Consumers | Payload (beyond envelope) | Business: what · when · why | Status |
|---|---|---|---|---|
| `[EVENT_NAME]` | [Consumer services] | `[fields beyond the envelope]` | [What fact] · [when it fires: [KEY/UC-NN](BRD link) step N, or the other trigger] · [why downstream cares] | [committed] |
| `[EVENT_NAME]` | [Consumer services] | `[fields]` | [what · when · why] | [candidate] |

### 14.5.2 [Producer Service] - `[topic-name]` ([key family]; [phase])

| Event | Consumers | Payload (beyond envelope) | Business: what · when · why | Status |
|---|---|---|---|---|
| `[EVENT_NAME]` | [Consumer services] | `[fields]` | [what · when · why] | [Status] |

<!-- Repeat 14.5.X per producing service. -->

## 14.6 Cross-Cutting Event Guarantees

<!-- The invariants every integration-event edge on the broker inherits (the in-process domain events of §14.10 are outside them). Keep as a numbered list, e.g.: -->

1. **Atomicity:** domain state + outbox row commit in one transaction; the relay publishes only after commit (no dual-writes).
2. **Delivery:** at-least-once everywhere; consumers dedup on `(consumer, event_id)`.
3. **Ordering:** per-aggregate via `aggregate_version` (last-writer-wins for projections; validated transitions for state machines) - not broker ordering.
4. **Poison handling:** invalid transitions and undeserializable messages dead-letter with alarm + redrive runbook; never silently dropped.
5. **Schema evolution:** additive-only, registry-enforced; breaking change = new event name.
6. **Replay:** archive -> consumer queue, never archive -> topic.
7. [Project-specific guarantee.]

## 14.7 Universal Subscribers & Cross-Service Doctrines

<!--
Name the broad consumers (e.g., Analytics binds every domain topic; Notification binds the wired delivery set) and any platform doctrines, e.g.:
- Re-publication doctrine: a reusable service's generic fact is consumed ONLY by the initiating service, which re-publishes its own domain fact.
- Shared special-purpose topics and their sole consumers.
-->

- [Universal subscriber 1 + breadth rule.]
- [Universal subscriber 2 + breadth rule.]
- [Doctrine 1, e.g., money-fact re-publication: initiator-only consumption + domain re-publication.]

## 14.8 Consistency Notes & Open Flags

<!--
The reconciliation ledger for producer/consumer consistency. Every divergence found while consolidating the per-service Event Models lands here with a pointer - never silently reconciled. Empty section = full reconciliation achieved; state that explicitly.
Status: `Open` until the divergence is fixed, then `Fixed in vX.X` (the values §15.5 uses). A row with no Status, or any other value, counts as `Open` and keeps the e2e gate shut (SKILL.md step 8b, E2).
-->

| # | Where (chunks) | Divergence | Resolution / flag | Status |
|---|---|---|---|---|
| 1 | [13x vs this chunk] | [e.g., consumer under-listed / payload field mismatch / topic name drift] | [Fixed in 13x on YYYY-MM-DD / flagged as OI-NN] | [Open / Fixed in vX.X] |

## 14.9 Payload Contract Samples

<!--
Per-event payload contracts in the style of a schema-registry draft. Rules:
  - The envelope (§14.3) is NOT repeated per event - only payload{} fields beyond the envelope.
  - Type vocabulary: uuid, string, int, decimal(p,s), bool, timestamp (UTC ISO-8601), enum{...}, ref(ValueObject), array<T>, map<K,V>.
  - Required column: R = required, O = optional, C = conditional (state the condition in Notes).
  - Status mirrors §14.5.
  - PII fields are tagged `pii` and must appear in the erasure-path mapping.
Define common value objects once, then reference them.
-->

### 14.9.0 Common Value Objects

| Value object | Fields | Used by |
|---|---|---|
| `Money` | `amount decimal(19,4)`, `currency string(ISO-4217)` | [events] |
| `[ValueObject]` | [fields] | [events] |

### 14.9.1 `[EVENT_NAME]` - [status]

**Producer:** [service] · **Topic:** `[topic-name]` · **Key family:** [family]

| Field | Type | Required | Notes |
|---|---|---|---|
| `[field]` | [type] | R | [meaning; `pii` tag if applicable] |
| `[field]` | [type] | O | [meaning] |

<!-- Repeat 14.9.X per event. For large platforms, sample the load-bearing events here and keep the full set in the schema registry; state explicitly which events are registry-only (no silent gaps). -->

### 14.9.99 Coverage Matrix

<!-- One row per event in §14.5: does it have a payload contract here or in the registry? This is the single source of the platform event count. -->

| Event | Catalog (§14.5) | Contract (§14.9 / registry) | Status |
|---|---|---|---|
| `[EVENT_NAME]` | ✓ | [§14.9.1 / registry-only] | [committed] |

## 14.10 In-Process Domain Events (modular monolith / hybrid core)

<!--
Domain events that one module publishes and other modules of the same deployable handle in process (architecture-questionnaire.md § Effect on the SDD). They are not integration events: the broker delivery rules (§14.2 one-hub rules, §14.2.1, §14.6) do not apply. An event that must also leave the deployable is published through the outbox as an integration event and catalogued in §14.5. Events that never leave one module stay out of scope.
When (derive-from-BRD): the use case step that fires the event, cited like the §14.5 "when": a keyed link plus the part, e.g. "[REFUNDS/UC-04](BRD link) step 5", or "None - platform" when no use case step fires it. This registry is the only home of the When; §7.3 reads its Events column from here and from §14.5.
Status: `committed` or `candidate`, as in §14.5: a candidate's name, publisher module, and listener modules are fixed, but no listener is built against it until its DTO is ratified, which makes it committed. This registry is the only home of the Status.
Delivery: one line above the table, stated once for the deployable. Durable: each event is recorded in a publication log (its home: §11.1) in the publisher's transaction and redelivered until every listener completes. In memory: an event is lost if the process stops before a listener runs. The Transaction phase column says when a listener runs, not whether the event survives a stop.
A microservices SDD writes "Not applicable - no in-process events".
-->

**Delivery:** [Durable - recorded in the publication log (§11.1) in the publisher's transaction, redelivered until every listener completes / In memory - lost if the process stops before a listener runs]

| Event | Publisher module | Listener modules | When | Transaction phase (before commit / after commit) | Payload (DTO) | Status | Notes |
|---|---|---|---|---|---|---|---|
| `[EventName]` | [Module] | [Modules] | [[KEY/UC-NN](BRD link) step N / None - platform] | [after commit] | `[EventDto]`: [fields] | [committed / candidate] | [Notes] |


---


---


# 15. Service Integration API Contracts

> **What this section is.** One contract block per synchronous domain or provider integration API (`API-NN`; standard operational infrastructure is out of scope, §15.1), with everything an implementer on either side needs: endpoint, security, headers, parameters, body, responses, error codes, and behaviour (idempotency, timeouts, retries). Internal contracts are fully defined here. External contracts are placeholders marked `TBD - external` for the user to complete from the provider's documentation.
>
> **What this section is not.** It does not list client-facing endpoints that no other service or external party calls (those stay in each service's "List of APIs" in chunks 13x and in the OpenAPI specs, §21). It does not hold event contracts (§14, chunk 10).

---

## 15.1 Contract Conventions (platform defaults)

API-NN covers domain/provider integrations, including internal business ports. Standard operational database, Vault and IAM client/admin/token operations are infrastructure configuration in ecosystem/security/operations, not API-NN contracts. A custom business integration cannot claim that exemption.

<!-- Record the infrastructure boundary and its source; keep real domain/provider integrations in the contract coverage matrix. -->

<!-- Stated once here; every contract block inherits them and lists only its deviations. Values come from §6 (ecosystem), §11.6 (security defaults), and the doctrine. Missing value -> [NEEDS CLARIFICATION: ...]. -->

| Concern | Platform default | Source |
|---------|------------------|--------|
| URI pattern | `/v{major}/[resource]` (URI-prefix versioning; a breaking change is a new major version, never an in-place change) | §9 principles, platform doctrine |
| Transport | [e.g., TLS 1.2+ everywhere; mTLS inside the mesh] | §6, §11.6 |
| Internal authentication | [e.g., OAuth2 client credentials issued by the platform IAM; service identity per service] | §6 IAM row, §11.6 |
| Authorization | Per contract type (table below): a permission token from §16 on internal contracts; the provider's scheme on external ones | §16 (chunk 12) |
| Tenant context | Carried on every call ([header or token claim]) | §11.2 |
| Correlation | Carried on every call and propagated downstream ([header name]); W3C trace context for tracing | §11.4 |
| Idempotency | `Idempotency-Key` header required on every write that touches money, wallet, notifications, or an external provider | §9 principles, platform doctrine |
| Content type | `application/json`; errors as `application/problem+json` | - |
| Date and time | ISO-8601, UTC | §6 ecosystem rules |
| IDs | UUIDv7 | §6 ecosystem rules |
| Error model | RFC 9457 Problem Details with an `errorCode` extension (standard codes in the table below); an Internal (in-process) contract raises typed errors carrying the same `errorCode` | Platform doctrine (RFC 9457) |
| Resilience | Timeouts, retries with exponential backoff and jitter, circuit breaker, and bulkhead per downstream; values per contract, from §12 for external systems | Platform doctrine; §12 for external systems |
| Sync chain depth | At most one synchronous hop between services; a deeper chain is a design defect, flagged in §15.5 | §9 principles, platform doctrine |

### Authorization by contract type

<!-- One row per §15.2 Type. SKILL.md step 6a checks the token of every Internal and Internal (in-process) contract against §16. -->

| Type | Authorization value | §16 permission token |
|------|---------------------|----------------------|
| Internal | A permission token from §16, verbatim, checked by the provider | Required |
| Internal (in-process) | A permission token from §16, verbatim, checked at the port | Required |
| External outbound | None on our side: the provider authorizes the call with its own scheme (the Authentication row, `TBD` until the provider documentation is supplied) | None |
| External inbound | Our endpoint verifies the provider's signature or auth scheme (callback, webhook), `TBD - external` until the provider documentation is supplied | None |

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

<!-- Every contract uses these; a contract adds its own domain codes in its Error codes table. The HTTP status column applies only when a call crosses HTTP. -->

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

<!-- One row per API-NN. Type: Internal (service -> service over HTTP), Internal (in-process) (module -> module through a port, in a modular monolith or hybrid: architecture-questionnaire.md § Effect on the SDD), External outbound (service -> external system), External inbound (external system -> service). Method & URI: an Internal (in-process) contract shows its port operation (`[ProviderPort].[operation]`) instead, never an invented URI. Status: Defined / TBD - external / Flagged (see §15.5). Use case ref (derive-from-BRD): the BRD use cases the call serves, each as a link to its BRD heading (brd-to-sdd.md § Use-case traceability), or "-" for a call that serves no use case; §7.3 reads its APIs column from here. -->

| API ID | Operation | Consumer (caller) | Provider (callee) | Type | Method & URI | Integration ref | Use case ref | Status |
|--------|-----------|-------------------|-------------------|------|--------------|-----------------|--------------|--------|
| API-01 | [Operation] | [Service] | [Service] | Internal | `[METHOD] /v1/[path]` | [13x § Integrations] | [[KEY/UC-NN](BRD link) / -] | Defined |
| API-02 | [Operation] | [Service] | [External system] | External outbound | TBD | [INT-NN] | [[KEY/UC-NN](BRD link) / -] | TBD - external |
| API-03 | [Operation] | [Module] | [Module] | Internal (in-process) | `[ProviderPort].[operation]` | [13x § Integrations] | [[KEY/UC-NN](BRD link) / -] | Defined |

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

---

### API-03: [Operation name] ([Consumer module] -> [Provider module])

- **Type:** Internal (in-process)
- **Purpose:** [One sentence; link the use case ([KEY/UC-NN](BRD link)) and the module Integrations row.]
- **Status:** Defined

<!-- Modular monolith or hybrid core: a module-to-module call through a port (architecture-questionnaire.md § Effect on the SDD). It never crosses HTTP, so it has no method, URI, headers, or HTTP status; SKILL.md step 6a checks the fields below instead. -->

**Port and authorization**

| Aspect | Value |
|--------|-------|
| Port interface | `[ProviderPort]` |
| Operation | `[operation]` |
| Request DTO | `[RequestDto]` |
| Response DTO | `[ResponseDto]` |
| Authorization | [Permission token from §16, verbatim, checked at the port] |
| Tenant context | [Per §15.1; carried in the call context] |

**DTO fields**

| DTO | Field | Type | Required | Constraints | Description |
|-----|-------|------|----------|-------------|-------------|
| `[RequestDto]` | [field] | [string] | [Yes] | [e.g., max 64, enum] | [Description] |
| `[ResponseDto]` | [field] | [string] | [Yes] | - | [Description] |

**Errors raised** (typed errors carrying the §15.1 `errorCode`; list only the errors this operation raises and its domain codes; no HTTP status)

| Error | `errorCode` | When | Retryable | Consumer action |
|-------|-------------|------|-----------|-----------------|
| `[DomainError]` | [DOMAIN_CODE] | [Condition] | [No] | [Action] |

**Behaviour**

| Aspect | Value |
|--------|-------|
| Idempotency | [The idempotency key, and what a repeated call returns] |
| Transaction | [Joins the caller's transaction / Runs in its own transaction] |

<!-- Repeat a contract block for each API-NN. External inbound contracts (callbacks, webhooks) follow the same TBD rule for provider-owned fields; our side (endpoint path, signature verification, idempotency, replay protection) is defined when the provider's scheme is known. They carry no §16 permission token (§15.1 Authorization by contract type). -->

---

## 15.4 Coverage Matrix

<!-- Every synchronous domain/provider integration has an API-NN and coverage row; sources are §12, §8.5 and per-service Integrations. Apply the §15.1 operational infrastructure boundary. Custom business interfaces are never exempt. -->

| Source | Item | API ID(s) | Covered |
|--------|------|-----------|---------|
| §12 | [INT-NN - System] | [API-NN] | [Yes / No: flagged in §15.5] |
| §8.5 | [Sequence name, step N] | [API-NN] | [Yes / No] |
| §17.X | [Service - Integrations row] | [API-NN] | [Yes / No] |

---

## 15.5 Consistency Notes & Drift Register

<!-- Divergences between this section and §12, the §17.X List of APIs, or §16 (permission tokens), and any synchronous chain deeper than one hop. A divergence fixed during reconciliation is not listed; a listed row keeps Status `Open` until it is fixed, then `Fixed in vX.X` (SKILL.md step 6a). -->

| # | Where | Divergence | Status |
|---|-------|------------|--------|
| [1] | [API-NN vs §17.X List of APIs] | [e.g., URI differs] | [Open / Fixed in vX.X] |

---

## 15.6 External Contracts Awaiting the User

<!-- A view of the TBD - external contracts, so the user knows what to supply. Derived from §15.2 Status; the contract blocks stay the single home of the fields. -->

| API ID | Provider | Fields still TBD | Document needed from the user |
|--------|----------|------------------|-------------------------------|
| [API-02] | [External system] | [URI, headers, body, error codes, auth] | [Provider API reference / sandbox guide] |


---


---


# 16. Centralized User Roles & Authorities (Platform-Wide)

> **What this section is.** The one place that answers: what user types exist, which roles and sub-roles they break into, what each role is allowed to do, who may create or invite whom, and which services each role interacts with. Downstream, the LLD and the identity/authorization implementation seed from this catalogue - the key goal is that authorization behaves identically across every service.

---

## 16.1 Business Overview

<!-- 1-2 paragraphs in plain language: the tiers of users on the platform, the tenancy planes they live in (e.g., platform operator vs tenant company vs end customer), and the business rationale for the split. -->

[Business overview.]

## 16.2 Resolution Model - How a Role Becomes an Allowed Action

<!-- Describe the runtime path from identity to permitted action: token claims -> role/sub-role resolution -> permission lookup -> contextual gates (tenant scope, ownership, module enablement, subscription status). Name where each gate is enforced (edge gateway, authorization service, service-local check). -->

[Resolution model: identity -> role -> permission -> contextual gates, with enforcement points.]

## 16.3 User Types (Tier 1)

<!-- A service that calls other services with no user context (client credentials) is a user type here too (identity source: an IAM client), so the permission tokens it holds appear in §16.11 and SKILL.md step 6a checks them. -->

| User type | Tenancy plane | Identity source | Description |
|---|---|---|---|
| `[USER_TYPE]` | [Platform / Tenant / End-customer] | [IAM realm / pool] | [Description] |
| `[USER_TYPE]` | [Plane] | [Source] | [Description] |

## 16.4 Role Catalogue - Authorities & Related Services

<!-- One sub-section per Tier-1 user type. Each table: role, scope, core authorities (verbs), related services. -->

### 16.4.1 [User type A] Roles

| Role | Scope | Core authorities | Related services |
|---|---|---|---|
| `[ROLE]` | [company / compound / unit / global] | [What it may do, verb-level] | [Services touched] |

### 16.4.2 [User type B] Sub-Roles

| Sub-role | Scope | Core authorities | Related services |
|---|---|---|---|
| `[SUB_ROLE]` | [Scope] | [Authorities] | [Services] |

### 16.4.3 Platform Plane (operator - outside tenant tenancy)

| Role | Scope | Core authorities | Related services |
|---|---|---|---|
| `[PLATFORM_ROLE]` | global | [Break-glass, provisioning, billing ops, support] | [Services] |

## 16.5 Capability Matrix (canonical)

<!-- The compact capability view: capabilities as rows, roles/sub-roles as columns, Yes / - / footnoted-conditional cells. Conditional footnotes become explicit attribute-based rules (own records only, own unit only, etc.). -->

| Capability | `[ROLE_1]` | `[ROLE_2]` | `[SUB_ROLE_1]` |
|---|---|---|---|
| [Capability] | Yes | - | Yes¹ |

¹ [Condition, e.g., own unit only.]

## 16.6 Grant / Invitation Authority (who can create whom)

| Grantor role | May create / invite | Constraints |
|---|---|---|
| `[ROLE]` | `[ROLE(S)]` | [Scope limits, approval gates, count limits] |

## 16.7 Role → Related-Services Matrix (platform-wide)

<!-- Roles as rows, services as columns; cell = the interaction class (admin / write / read / none). Service names must match §13 decomposition verbatim. -->

| Role | [Service 1] | [Service 2] | [Service 3] |
|---|---|---|---|
| `[ROLE]` | [admin / write / read / -] | [-] | [-] |

## 16.8 Lifecycle, Scope & Revocation Rules

<!-- Numbered rules: how roles are granted at onboarding, how they change, what suspends or revokes them, what happens to in-flight work on revocation, and the erasure path. -->

1. [Grant rule.]
2. [Change rule.]
3. [Suspension / revocation rule + effect on in-flight work.]
4. [Erasure rule.]

## 16.9 Diagrams

### 16.9.1 Role Taxonomy (user types → roles → sub-roles)

```mermaid
flowchart TD
  UT1[User type A] --> R1[Role 1]
  UT1 --> R2[Role 2]
  UT2[User type B] --> SR1[Sub-role 1]
  UT2 --> SR2[Sub-role 2]
```

**Summary:** [1-2 sentences: the user types and the roles and sub-roles each one breaks into.]

### 16.9.2 Grant / Invitation Authority (who may create whom)

```mermaid
flowchart LR
  PLATFORM[Platform operator] -->|provisions| ADMIN[Tenant admin]
  ADMIN -->|invites| R1[Role 1]
  R1 -->|invites| SR1[Sub-role 1]
```

**Summary:** [1-2 sentences: who provisions or invites whom, from the platform operator down.]

### 16.9.3 Per-Request Authorization (how a role yields a decision)

```mermaid
sequenceDiagram
  participant C as Client
  participant GW as Edge / Gateway
  participant AZ as Authorization
  participant SVC as Domain service
  C->>GW: request + token
  GW->>GW: [edge gate: issuer, tenant status]
  GW->>SVC: forward + identity context
  SVC->>AZ: evaluate(role, permission, scope)
  AZ-->>SVC: allow / deny
  SVC-->>C: response / 403
```

**Summary:** [1-2 sentences: where the edge gate and the permission check run, and what the caller gets on a deny.]

## 16.10 Traceability

<!-- Map back to the sources: BRD Users & Use Cases Matrix rows, per-service authorization notes (13x chunks), and ADRs that shaped the model. Every capability row must trace to at least one BRD UC or an ADR. Cite a BRD use case as a link to its BRD heading and a matrix row as a link to the BRD matrix (brd-to-sdd.md § Use-case traceability). -->

| Capability / rule | Source (BRD UC / matrix row / ADR / 13x chunk) |
|---|---|
| [Capability] | [[KEY/UC-NN](BRD link) / matrix row in [KEY matrix](BRD matrix link) / ADR-NN / §17.X] |

## 16.11 Permission × Role Matrix (platform-wide)

<!-- The exhaustive grid: one row per permission token (the runtime names services check), one column per role/sub-role. This is the implementation-facing view; §16.5 is the business-facing view. Keep tokens in the exact runtime spelling. -->

| Permission token | `[ROLE_1]` | `[ROLE_2]` | `[SUB_ROLE_1]` |
|---|---|---|---|
| `[service].[resource].[action]` | ✓ | - | ✓¹ |

## 16.12 Implementation Seed & Reconciliation

<!-- How this catalogue becomes data: the seed rows for the role/permission store, per-role action counts as a drift baseline, the canonical name-map from grid labels to runtime tokens, and a drift register for divergences found between this chunk, the BRD matrix, and per-service chunks. -->

### 16.12.1 Seed Strategy

[Where the seed lives (migration / fixture), and the update rule when roles change.]

### 16.12.2 Per-Role Action Counts (drift baseline)

| Role | Seeded permission count |
|---|---|
| `[ROLE]` | [N] |

### 16.12.3 Drift & Reconciliation Register

<!-- Status: `Open` until the divergence is fixed, then `Fixed in vX.X` (the values §15.5 uses). A row with no Status, or any other value, counts as `Open` and keeps the e2e gate shut (SKILL.md step 8b, E2). -->

| # | Where | Divergence | Resolution / flag | Status |
|---|---|---|---|---|
| 1 | [BRD matrix vs 13x vs this chunk] | [Mismatch] | [Fixed on YYYY-MM-DD / flagged as OI-NN] | [Open / Fixed in vX.X] |


---


---


# 17. Detailed Service Specs

<!--
Repeat the service spec block below for each service (17.1, 17.2, ...).
Each service follows the exact same structure for predictability and grep-ability.
-->

---

## 17.1 [Service Name]

### What

<!-- Concise definition of the service and its bounded context. -->

[Definition.]

### Boundaries

- **Owns:** [Entities / aggregates / data this service is the source of truth for]
- **Does not own:** [Things explicitly outside its boundary]
- **Upstream consumers:** [Who calls this service]
- **Downstream dependencies:** [What this service calls / consumes]

### Input

| Type | Source | Description |
|------|--------|-------------|
| [REST / Event / Schedule / Other] | [Source] | [Description] |

<!-- An Event or Schedule row names one trigger and, when it realises a part of a BRD use case, cites that part as a keyed link (step, BR-n, E1, AC-n). That citation is the trigger's tie to the use case's §7.3 Entry points (brd-to-sdd.md § The trigger tie). -->

### Business Logic

<!-- Plain-language description of the logic, including state machines for stateful services. Derive-from-BRD: cite every use case this service owns (§13 "Use cases (BRD)") as a link to its BRD heading, with the part it realises, e.g. "[REFUNDS/UC-04](BRD link) steps 3-6", "A1", "BR-2: [short label]", "AC-3: customer is notified". BR-n and AC-n are positions in the BRD lists, so each always carries its short label (brd-to-sdd.md § Use-case traceability). Write only the technical realisation, never a restated Main Flow. -->

[Description of the core logic.]

**State machine (if applicable):**

```mermaid
stateDiagram-v2
  [*] --> StateA
  StateA --> StateB: Trigger 1
  StateB --> StateC: Trigger 2
  StateC --> [*]
```

**Summary:** [1-2 sentence prose fallback: the states and the triggers that move between them.]

### Output

| Type | Destination | Description |
|------|-------------|-------------|
| [REST response / Event / File / Other] | [Destination] | [Description] |

### Integrations

<!-- Every synchronous domain or provider row carries its API ID (standard operational infrastructure is not one: SKILL.md step 6a); the full contract (URI, headers, body, error codes, security) lives in §15 and is not restated here. Asynchronous rows reference the event in §14. -->

| Integration | Direction | Protocol | Purpose | Contract | Failure Handling |
|-------------|-----------|----------|---------|----------|------------------|
| [System] | [Inbound / Outbound / Sync / Async] | [Protocol] | [Purpose] | [API-NN (§15) / event name (§14)] | [Failure handling] |

### DB Modeling

#### Entity Relationship

<!-- Inline Mermaid is the default diagram medium. The ERD shows entities, keys (PK, FK), and relationships only; every other column lives in Tables Design below. Append an optional `> Miro: <url>` line below the block only if a richer whiteboard version exists on a real board. -->

```mermaid
erDiagram
  ENTITY_A ||--o{ ENTITY_B : has
  ENTITY_B ||--o{ ENTITY_C : contains
  ENTITY_A {
    uuid id PK
  }
  ENTITY_B {
    uuid id PK
    uuid entity_a_id FK
  }
  ENTITY_C {
    uuid id PK
    uuid entity_b_id FK
  }
```

**Summary:** [1-2 sentences: the entities this service owns and how they relate.]

#### Tables Design

| Table | Column | Type | Constraints | Notes |
|-------|--------|------|-------------|-------|
| `[table_name]` | `[column]` | [Type] | [Constraints] | [Notes] |
| `[table_name]` | `[column]` | [Type] | [Constraints] | [Notes] |

#### Migration Strategy

- **Tool:** [Flyway / Liquibase]
- **Backward compatibility:** [Approach, e.g., additive-only changes, expand-contract for breaking changes]
- **Data backfill:** [Approach for populating new columns on existing rows]
- **Rollback:** [How to roll back a failed migration]

#### Retention Policy

- `[table_name]`: [Retention rule]
- `[table_name]`: [Retention rule]

#### Archival

- **Cold storage:** [Destination]
- **Format:** [Format]
- **Schedule:** [Schedule]
- **Restore SLA:** [SLA]

#### Data Encryption

- **At rest:** [Approach]
- **In transit:** [Approach]
- **Key management:** [KMS / Vault, rotation policy]
- **PII columns:** [List + masking policy in non-prod]

### Multi-Tenancy Specifications

<!-- Override defaults from section 11.2 only if necessary. -->

- **Strategy override:** [None / specify]
- **Tenant filter:** [How filtered]
- **Cross-tenant queries:** [Policy]

### API Standards

- **Style:** [REST / gRPC / GraphQL]
- **Versioning:** [Approach]
- **Authentication:** [Mechanism]
- **Idempotency:** [Approach]
- **Pagination:** [Approach]
- **Error envelope:** [Per the §15.1 error model, or deviation]

#### List of APIs (Swagger-friendly)

<!-- Endpoints called by another service or an external system carry their API ID and link to §15, which is canonical for their contract; Method and Path must match it verbatim. Client-facing-only endpoints show "-" in the API ID column. Permission token (§16): the token the endpoint checks, verbatim from §16; an endpoint that only an external system calls (callback, webhook) writes "-" (§15.1 Authorization by contract type); a public endpoint, which anyone may call without signing in (a sign-up, a password reset), writes `None - public`. The cell holds only a token, "-", or `None - public`, never a dash with a reason such as `- (public)`; a reason goes in the Authorization notes. -->

| Method | Path | Summary | Request Body | Response | Permission token (§16) | API ID (§15) |
|--------|------|---------|--------------|----------|------------------------|--------------|
| [METHOD] | `[path]` | [Summary] | `[RequestSchema]` | `[ResponseSchema]` | `[service].[resource].[action]` | [API-NN / -] |

### Event-Driven Architecture (If Applicable)

<!--
CONSISTENCY RULE (chunk 10 is the contract registry): every topic name, event name, and payload field in this sub-section MUST match §14 (chunk 10, Centralized Event Hub) character-for-character. List BOTH published AND consumed events - consumer lists in chunk 10 are reconciled from both sides. A divergence is flagged in chunk 10 §14.8, never silently reconciled.
-->

#### Event Model

<!-- Published events and Consumed events list integration events on the broker only. A module with no integration events writes "Not applicable - no integration events" under each. -->

**Published events:**

| Event Name | Producer | Producer Specs | Consumers | Consumer Specs | Schema (Summary) | Delivery Guarantee |
|------------|----------|----------------|-----------|----------------|------------------|---------------------|
| `[EVENT_NAME]` | [This service] | [Topic (verbatim from §14.4), partitions, retention, key] | [Consumer services] | [Consumer group, idempotency] | `[Payload summary - fields per §14.9]` | [At-least-once / Exactly-once effect] |

**Consumed events:**

| Event Name | Producer (owning service) | Topic | Effect in this service | Idempotency / ordering |
|------------|---------------------------|-------|------------------------|------------------------|
| `[EVENT_NAME]` | [Producer service] | `[topic - verbatim from §14.4]` | [Projection update / state transition / trigger] | [Inbox dedup key, aggregate_version handling] |

**In-process domain events (modules only):**

<!-- Modular monolith or hybrid core: the domain events this module publishes or handles in process (architecture-questionnaire.md § Effect on the SDD). Columns match §14.10 except When and Status, which only the registry holds; names match it verbatim, from both sides. A microservice writes "Not applicable - no in-process events". -->

| Event | Publisher module | Listener modules | Transaction phase (before commit / after commit) | Payload (DTO) | Notes |
|---|---|---|---|---|---|
| `[EventName]` | [Module] | [Modules] | [after commit] | `[EventDto]`: [fields] | [Notes] |

#### Messaging Infra

<!-- Integration events on the broker only. A module with no integration events writes "Not applicable - no integration events". -->

- **Broker:** [Broker]
- **Schema registry:** [Registry / approach]
- **Serialization:** [Avro / JSON / Protobuf]
- **Topic strategy:** [Naming + partitioning]
- **Retention:** [Retention]
- **DLQ strategy:** [DLQ + replay]

### Constraints

<!-- Authorization notes: the roles allowed for each owned use case, with their §16 permission tokens verbatim; each endpoint's token is in the List of APIs Permission token (§16) column. -->

- [Constraint 1]
- [Constraint 2]
- [Constraint 3]

### Error Handling

<!-- Keep every bullet; a bullet that does not apply reads `Not applicable - [reason]`. In a module, the errors its in-process ports raise go under Synchronous APIs. Derive-from-BRD: tie each domain error to the exception flow it realises, e.g. "[REFUNDS/UC-04](BRD link) E1 -> 422 PAYOUT_REFUSED". -->

- **Synchronous APIs:** [Approach]
- **Validation errors:** [Approach]
- **Domain errors:** [Approach]
- **Auth errors:** [Approach]
- **Server errors:** [Approach]
- **Async consumers:** [Approach]
- **Poison messages:** [Approach]

### Observability & Monitoring

#### Logging

- [Format]
- [Mandatory fields]
- [Retention]

#### Metrics

| Metric | Type | Labels | Purpose |
|--------|------|--------|---------|
| `[metric_name]` | [counter / gauge / histogram] | [labels] | [purpose] |

#### Tracing

- [Instrumentation approach]
- [Context propagation]
- [Sampling]

### Developer Notes

- **Recommended patterns:** [Patterns]
- **Avoid:** [Anti-patterns]
- **Testing:** [Test strategy]

### Service-Level Diagrams

#### Implementation Flow Chart

```mermaid
flowchart TD
  A[Step 1] --> B[Step 2]
  B --> C[Step 3]
```

**Summary:** [1-2 sentence prose fallback so the flow is understandable without rendering the diagram.]

#### Sequence Diagram (Service-Internal)

```mermaid
sequenceDiagram
  participant P1
  participant P2
  P1->>P2: [message]
  P2-->>P1: [response]
```

**Summary:** [1-2 sentence prose fallback describing the interaction.]

### Compliance

- **GDPR:** [Lawful basis, retention windows, right-to-erasure flow]
- **PCI-DSS:** [Applicability + approach]
- **ISO 27001 / SOC 2:** [Controls applicable]
- **Local regulations:** [List + how met]

### Deployment Strategy

- **Service-specific override:** [None / specify]
- **Replicas:** [min / max]
- **Strategy:** [Rolling / Blue-Green / Canary]
- **Health checks:** [Probes]
- **Rollback:** [Trigger + approach]

### Future Enhancements

- [Known gap or planned improvement 1]
- [Known gap or planned improvement 2]


---


---


# 18. Performance & Capacity Planning

## 18.1 Load Estimates

| Dimension | Year 1 | Year 2 | Year 3 | Notes |
|-----------|--------|--------|--------|-------|
| [Dimension] | [N] | [N] | [N] | [Assumptions] |
| [Dimension] | [N] | [N] | [N] | [Assumptions] |

## 18.2 Throughput Targets (per service)

| Service | Sustained RPS | Peak RPS | p50 latency | p95 latency | p99 latency |
|---------|----------------|----------|-------------|-------------|-------------|
| [Service Name] | [N] | [N] | [Xms] | [Xms] | [Xms] |
| [Service Name] | [N] | [N] | [Xms] | [Xms] | [Xms] |

## 18.3 Peak Scenarios

| Scenario | Trigger | Expected Multiplier on Baseline | Mitigation |
|----------|---------|---------------------------------|------------|
| [Scenario] | [Trigger] | [Multiplier + duration] | [Mitigation] |
| [Scenario] | [Trigger] | [Multiplier + duration] | [Mitigation] |

## 18.4 Stress Testing Strategy

- **Tooling:** [Tool]
- **Environments:** [Where stress runs are executed]
- **Scenarios:** [Baseline / peak / spike / soak / failure injection]
- **Acceptance criteria:** [Criteria]
- **Cadence:** [Cadence]
- **Reporting:** [Where results live]

## 18.5 NFR Targets

<!-- Derive-from-BRD: one row per NFR of every source BRD, keyed (REFUNDS/NFR-02), with the technical target it is quantified into and where the design realises it (a §18 row, a §11 default, an ADR, or a §17.X section). A target the BRD does not imply is a [NEEDS CLARIFICATION: ...], never invented. -->

| BRD NFR | Technical target | Realised in |
|---------|------------------|-------------|
| [KEY/NFR-NN] | [e.g., 99.9% monthly availability] | [§18.2 / §11.3 / ADR-NN] |


---


---


# 19. Environments

| Environment | Purpose | Data | Access | Promotion Source |
|-------------|---------|------|--------|------------------|
| **Dev** | [Purpose] | [Data] | [Access] | [Source] |
| **SIT** | [Purpose] | [Data] | [Access] | [Source] |
| **UAT** | [Purpose] | [Data] | [Access] | [Source] |
| **Prod** | [Purpose] | [Data] | [Access] | [Source] |

**Per-environment specifics (capture per service if they differ):**

- **Sizing:** [Per-environment sizing rules]
- **Data refresh:** [Refresh policy]
- **Feature flags:** [Per-environment defaults]
- **DNS:** [Naming convention]
- **Access controls:** [Auth + elevation rules]
- **Secrets strategy:** [e.g., Dev uses local .env / SIT+UAT use Sealed Secrets / Prod uses Vault with auto-rotation]


---


---


# 20. Operations Runbook

<!-- Living document. Each procedure should be runnable by an on-call engineer who did not write the service. -->

## 20.1 Common Operations

### 20.1.1 Restart a Service

```text
1. [Step]
2. [Step]
3. [Step]
4. [Step]
5. [Step]
```

### 20.1.2 Clear Cache

```text
1. [Step]
2. [Step]
3. [Step]
4. [Step]
```

### 20.1.3 Replay DLQ Messages

```text
1. [Step]
2. [Step]
3. [Step]
4. [Step]
5. [Step]
```

### 20.1.4 Rotate Secrets

```text
1. [Step]
2. [Step]
3. [Step]
4. [Step]
5. [Step]
```

### 20.1.5 Database Failover

```text
1. [Step]
2. [Step]
3. [Step]
4. [Step]
5. [Step]
6. [Step]
```

### 20.1.6 Tenant-Specific Incident Response

```text
1. [Step]
2. [Step]
3. [Step]
4. [Step]
5. [Step]
```

### 20.1.X [Add additional common operations as needed]

## 20.2 Diagnostics Cheatsheet

| Severity | Symptom | First Check | Likely Cause | Action |
|----------|---------|-------------|--------------|--------|
| [SEV1 / SEV2 / SEV3] | [Symptom] | [Where to look first] | [Likely cause] | [Action] |
| [Severity] | [Symptom] | [Where to look first] | [Likely cause] | [Action] |

## 20.3 On-Call

- **Rotation:** [Rotation policy]
- **Escalation:** [Escalation path]
- **Paging policy:** [SEV1 / SEV2 / SEV3 rules]
- **Post-incident:** [RCA expectations and timelines]


---


---


# 21. Appendix

| File / Reference | Description | Link |
|------------------|-------------|------|
| BRD-HLD | [Description] | [Link] |
| OpenAPI Specs | [Description] | [Link / repo path] |
| Event Schemas | [Description] | [Link / repo path] |
| ADR Repository | [Description] | [Link] |
| Threat Model | [Description] | [Link] |
| Capacity Plan | [Description] | [Link] |
| Runbooks | [Description] | [Link] |
| Diagrams Source | [Description] | [Link] |

---


---


# 22. Wishlist

*Future architectural enhancements (beyond per-service "Future Enhancements")*

1. [Platform-level enhancement 1]
2. [Platform-level enhancement 2]
3. [Platform-level enhancement 3]


---


---


# 23. Open Items & Clarifications

> **What this section is.** A structured backlog of architectural concerns identified after the main SDD was authored, by a reviewer running with cleared context. Each item comes with a **Recommended Answer** - a concrete, ready-to-apply resolution. Items are decisions awaiting the architect's acceptance: accept the recommendation (or adjust it), and it gets reflected into the SDD body.
>
> **What this section is not.** It is not a list of inline `[NEEDS CLARIFICATION: ...]` markers found in the body - those remain inline. This section is the reviewer's *external* findings: gaps the body did not mark, scenarios the body did not consider, corner cases the body did not test for, and contract inconsistencies between the centralized catalogues (§14, §16, §15) and the per-service chunks they consolidate.

---

## How to read each item

| Field | Meaning |
|-------|---------|
| **ID** | OI-NN. Stable across revisions. |
| **Where** | Section number (e.g., §6, §17.1), service name, or "global" if cross-cutting. |
| **Type** | Architecture gap / Missing scenario / Corner case / Ambiguity / Risk / Inconsistency / NFR shortfall / ADR needed / Contract mismatch (topic, event, payload, consumer list, or role/permission divergence across chunks) / Duplication (BRD content or another chunk's content restated instead of referenced). |
| **Concern** | One paragraph. What was missed and why it matters for downstream LLD or implementation. |
| **Options** | At least 2 concrete choices, each with a one-line tradeoff. |
| **Recommended Answer** | The reviewer's concrete proposed resolution, written as ready-to-apply SDD content (the exact row, decision, sub-section, or wording that would close the item). This is what gets injected into the body when accepted. |
| **Why** | REQUIRED. One or two lines: the reason the recommended option wins over the alternatives - the evidence behind it (BRD requirement, NFR, doctrine/CLAUDE.md default, operational risk avoided) and the tradeoff being accepted. Never empty, never "best option". |
| **Status** | Open (awaiting decision) / Decided - pending application (decision, decider and date in the item; the next request applies it) / Accepted - applied (with pointer) / Adjusted - applied / Deferred (with rationale) / Rejected. A status outside this legend counts as `Open`: the gate treats the item as not closed, and the next acceptance loop presents it. |

---

## Open Items

### OI-01: [Short title]

- **Where:** [§N or service name or "global"]
- **Type:** [Architecture gap | Missing scenario | Corner case | Ambiguity | Risk | Inconsistency | NFR shortfall | ADR needed | Contract mismatch | Duplication]
- **Concern:** [One paragraph.]
- **Options:**
  - **A.** [Option A] - [one-line tradeoff].
  - **B.** [Option B] - [one-line tradeoff].
  - **C.** [Option C] - [one-line tradeoff]. *(Optional.)*
- **Recommended Answer:** [Option letter + the concrete resolution text, ready to paste into the SDD. E.g., "Option A - add ADR-07 to §10: 'Use the transactional outbox pattern for all state-change events; rationale: ...'"]
- **Why:** [The reason this option wins: evidence (BRD requirement, NFR, doctrine default) + the tradeoff accepted.]
- **Status:** Open

---

### OI-02: [Short title]

- **Where:** [...]
- **Type:** [...]
- **Concern:** [...]
- **Options:**
  - **A.** [...] - [...].
  - **B.** [...] - [...].
- **Recommended Answer:** [...]
- **Why:** [...]
- **Status:** Open

---

<!-- Repeat the OI block for each open item. -->

---

## Resolution Log

<!-- When an open item is decided, or settled by an upstream change, add its row here with a pointer to the SDD update (chunk + heading). Audit trail. A source is `[KEY] v[X.X]` or a business review point (brd-to-sdd.md § Changes after the SDD exists). -->

| ID | Resolution Date | Resolved In | Outcome |
|----|----------------|-------------|---------|
| [OI-XX] | [YYYY-MM-DD] | [Chunk and section] | [Accepted recommendation / Adjusted: short note / Deferred / Rejected / Settled by [source] / Superseded by [source] / Reopened by [source]] |

---

## Reviewer Notes

<!-- Coverage record first (required): one row per risk surface in the review brief (SKILL.md step 7), each either "checked: N findings (OI IDs)" or "checked: no issue found", with what was checked. A zero-finding review is valid. A delta review (SKILL.md step 7, On an update) keeps these rows and adds one dated row per changed section, labelled `[YYYY-MM-DD] delta: section N (vX.X)`; a scoped application check adds one dated row per checked item, labelled `[YYYY-MM-DD] application check: OI-NN (vX.X)`, whose Checked cell names every section the item changed (`sections 6 and 15`). The brackets are part of each label: `[2026-10-07] delta: section 17 (v1.8)`, `[2026-10-07] application check: OI-45 (v1.7)`. vX.X is the SDD version when the review runs; earlier rows keep their labels. An update that only applies pending items (SKILL.md step 7, On an update) starts with application check rows; an update that also runs a delta review covers them in its delta rows. Then optional free-form notes that did not crystallise into a numbered open item. -->

| Risk surface | Checked | Findings | Notes |
|---|---|---|---|
| [Architecture style] | [What was checked, e.g., ADR-01 against the BRD drivers, §8.1, §13 boundaries] | [N findings (OI-NN, OI-NN)] | [Notes] |
| [Observability] | [What was checked] | [No issue found] | [Notes] |

<!-- Optional new scope: label Scope proposal here with source, recommendation and tradeoff; not a blocking Open OI until owner-adopted. Required gaps keep the normal OI schema. -->
<!-- A source problem the chunk 19 faithfulness check found and neither fixed nor raised (SKILL.md step 8b item 3): a note here with its source, its owner, and why no chunk 19 claim depends on it. -->
<!-- Out of scope, for the next review: a defect a delta review, an application check, or the scoped verification of later answers noticed outside its scope (SKILL.md step 7, Review after answers): a note labelled `Out of scope, for the next review` with its location and what is wrong. It is not an open item and bumps nothing; the next delta or full review that covers that location reads it and raises it or drops it. A note whose problem a later change fixed is marked `Resolved in vX.X` (the version that fixed it) by any later pass or by the author. A note on the cover's gate lines (the Reconciled, E2E gate, and E2E basis lines and the E3 marker inventory) is outside every review's scope: the step 8b run that rewrites those lines marks it `Resolved in vX.X`. The mark bumps nothing. -->

- [Note 1]
- [Note 2]


---


---


# 24. End-to-End System Design (Services · Topics · Producers · Consumers)

<!-- E1-E4 and the semantic E3 inventory in the cover govern this section. No unresolved claim-dependent value is bypassed by moving its marker. Named external black boxes with API IDs may keep provider placeholders. When already current, verify sources/gate and keep the section/version rather than rewrite it. -->

<!-- GATED: append this section only when E1-E4 are met: no open/deferred OI or divergence, no unresolved value required by an E2E claim (follow references regardless of location; use the cover E3 inventory), and final relevant sources reconciled with ordered/current-revision evidence. Preserve the named-black-box external placeholder exception. While shut, omit the heading and all drafts; Stale changes only the cover gate line. -->

> **What this section is.** The bird's-eye, implementation-facing map of the entire platform: the service landscape, the system context, the layered architecture, the full producer → topic → consumer fan-out, the synchronous edges, and the key sagas. A new engineer (or AI implementer) reads this section to understand how the system fits together, following its references into §14/§17/§16/§15 for the normative contracts. One fact, one home: content owned by §14 (mechanism, registry, guarantees, doctrines) is referenced here, never restated, and the system context and layered views are §8.2 and §8.3, which §24.2 and §24.3 cite, drawing only what they add.

---

## How to Read This Document

<!-- One short paragraph: reading order of the sections, and what each diagram notation means. -->

[Reading guidance.]

### Counts at a Glance

| Dimension | Count | Source of truth |
|---|---|---|
| Services | [N] | §13 (chunk 09) |
| Topics | [N] | §14.4 (chunk 10) |
| Distinct published events | [N] | §14.9 coverage matrix (chunk 10) |
| In-process domain events | [N] | §14.10 (chunk 10) |
| Synchronous HTTP edges between services | [N] | §24.7 |
| In-process port calls | [N] | §24.7 |
| Sagas documented | [N] | §24.8 |

### Faithfulness & Deliberate Simplifications (no silent caps)

<!-- List every simplification made in this section's diagrams (e.g., "domain producers clustered into one node in §24.2", "only the 3 load-bearing sagas drawn"). Also name each doctrine left out of §24.6 because its ADR is still Proposed, and each qualifying saga not drawn in §24.8. If there is nothing to list, say so. -->

- [Simplification 1 + where the full detail lives.]

## 24.1 Service Landscape (archetype × phase)

<!-- One row per service: archetype, phase, sync surface, async surface. Names verbatim from §13. Archetype, chosen from the service's §13 Responsibility: domain (owns a business capability and its data), reusable-generic (a capability other services call, with no domain of its own), edge (the entry point for users or external systems), read-model (builds query views from other services' events), or orchestrator (drives a flow across services). Phase: the §14.4 Phase of the topics the service owns, else of the topics it consumes, else the single release phase. -->

| # | Service | Archetype | Phase | Publishes to | Consumes from | Sync surface |
|---|---|---|---|---|---|---|
| 1 | [service] | [archetype] | [P1] | `[topic]` | `[topics]` | [REST APIs exposed] |

<!-- No-topic phase example (replace the phase above, not another service row): Single release (no topics). -->

## 24.2 System Context

<!-- By reference: the system context is §8.2. Cite it, and draw here only what it does not show (for example, the modules or services behind each actor and external system). When this view adds nothing, this sub-section is the pointer and its Summary, with no diagram. -->

**Base view:** [§8.2 Context Diagram](#82-context-diagram).

```mermaid
flowchart TB
  U([Users / actor classes]) --> EDGE[Edge / Gateway]
  EDGE --> PLATFORM[[Platform services]]
  PLATFORM --> EXT1[(External provider 1)]
  PLATFORM --> EXT2[(External provider 2)]
```

**Summary:** [1-2 sentences: what this view adds to §8.2, or, with no diagram, who uses the platform, through which edge, and which external providers it depends on, as §8.2 shows.]

## 24.3 Layered High-Level Architecture

<!-- By reference: the layered view is §8.3. Cite it, and draw here only what it does not show (for example, the module grouping inside a deployable, or the topics and DLQs on the async backbone). When this view adds nothing, this sub-section is the pointer and its Summary, with no diagram. -->

**Base view:** [§8.3 High-Level Architecture Diagram](#83-high-level-architecture-diagram).

```mermaid
flowchart TB
  subgraph L1[Edge]
    GW[Gateway]
  end
  subgraph L2[Frontend]
    FE[Apps]
  end
  subgraph L3[Services]
    S1[Service 1]
    S2[Service 2]
  end
  subgraph L4[Data]
    DB[(Databases - one per service)]
  end
  subgraph L5[Async backbone]
    BR[(Broker / topics)]
  end
  FE --> GW --> S1 & S2
  S1 & S2 --> DB
  S1 & S2 -.publish/consume.-> BR
```

**Summary:** [1-2 sentences: what this view adds to §8.3, or, with no diagram, the layers and the load-bearing connections between them, as §8.3 shows.]

## 24.4 The Universal Per-Event Mechanism (async backbone)

<!-- Owned by §14.2.1 - referenced, never restated here. One prose sentence + the pointer. A modular monolith with no integration events writes `Not applicable - no integration events (in-process domain events: §14.10).` instead. -->

Every event on every topic flows through the one universal mechanism - outbox → relay → topic → per-consumer queue or consumer group with inbox dedup and DLQ. In-process domain events (§14.10) do not use it. **Normative definition and diagram: §14.2.1.**

## 24.5 Producer → Topic → Consumer Fan-Out (the event map)

<!-- One sub-section per delivery phase. Each: a Mermaid flowchart of producer -> topic -> consumers for that phase's services. Edge labels name the load-bearing events. The exhaustive matrix stays in §14.5; this is the navigable visual. With one delivery phase, 24.5.2 reads `Not applicable for this release: one delivery phase.` and nothing more. A modular monolith or hybrid core shows its in-process domain events (§14.10) as separately labelled module-to-module edges (label `in-process: [EventName]`), never as topics. -->

### 24.5.1 Phase 1 Domains

```mermaid
flowchart LR
  S1[Service 1] --> T1[[topic-1]]
  T1 -->|EVENT_A| C1[Consumer 1]
  T1 -->|EVENT_B| C2[Consumer 2]
```

**Summary:** [1-2 sentences: which phase 1 producers publish to which topics, and who consumes the load-bearing events.]

### 24.5.2 Phase 2+ Domains

```mermaid
flowchart LR
  S3[Service 3] --> T3[[topic-3]]
  T3 --> C4[Consumer 4]
```

**Summary:** [1-2 sentences: which phase 2+ producers publish to which topics, and who consumes them.]

### 24.5.3 Universal Subscribers (breadth rules)

<!-- Name the broad consumers only (they would clutter every fan-out diagram above); their binding rules are owned by §14.7 - reference, don't restate. -->

- [Universal subscriber - see §14.7 for its binding rule.]

## 24.6 Cross-Service Doctrines

<!-- Name each platform-wide interaction doctrine + a pointer to its normative home: §14.7 or an Accepted ADR. A doctrine whose ADR is still Proposed is left out here and named in the Faithfulness list. Names only - the rules are not restated here. -->

1. [Doctrine name - normative home §14.7 / ADR-NN.]

## 24.7 Synchronous Edges (one-hop rule)

<!-- The whole-system view of every service-to-service synchronous call: one row per §15.2 contract of Type Internal or Internal (in-process), and no other row. External contracts are not rows here. With no such contract, write `None: no synchronous call between services (external contracts: §15.2).` in place of the table. The contracts themselves (URI, headers, body, error codes, auth) live in §15 and are referenced by API ID, never restated. Per CLAUDE.md: no chained REST more than one hop deep. A modular monolith or hybrid core lists its `Internal (in-process)` port calls as separately labelled edges (`in-process` after the callee), never as HTTP edges. -->

| # | Caller → Callee | API ID (§15) | Purpose | Why synchronous |
|---|---|---|---|---|
| 1 | [svc] → [svc] | [API-NN] | [Purpose] | [Justification] |

## 24.8 Key Sagas (dynamic view)

<!-- One sub-section per load-bearing cross-service flow: a flow that changes the business state of two or more §13 rows, services or modules (a message sent or an audit record written is not business state). A qualifying flow that is not drawn is named in the Faithfulness list. Each sub-section: orchestrator (or choreography), participants, happy path, compensation path. Mermaid sequence diagrams. Derive-from-BRD: a "Use cases:" line links the BRD use cases the saga realises, traced to §7.3. -->

### 24.8.1 [Saga name] ([orchestrated by X / choreographed])

**Use cases:** [[KEY/UC-NN](BRD link), [KEY/UC-NN](BRD link)]

```mermaid
sequenceDiagram
  participant O as Orchestrator
  participant A as Service A
  participant B as Service B
  O->>A: step 1
  A-)O: EVENT_A
  O->>B: step 2
  alt failure
    O->>A: compensate
  end
```

**Summary:** [1-2 sentences: the saga's happy path and how a failure is compensated.]

## 24.9 Normative References

<!-- Pure pointer section - no tables, no restated rules. One fact, one home. -->

- **Topic registry (one row per topic, owner, key family):** §14.4.
- **Per-event consumer reconciliation:** §14.5; payload contracts: §14.9.
- **Cross-cutting guarantees every broker event edge inherits:** §14.6 (in-process domain events: §14.10).
- **Universal subscribers & doctrines:** §14.7.
- **Roles & authorities behind every edge's authorization:** §16.
- **Synchronous API contracts (URI, headers, body, error codes, security):** §15.

## Sources

<!-- The chunks this consolidation was built from, with a one-line note per source. -->

- Chunks 02 to 08 (§6 to §12: ecosystem, actors, architecture views, workflows and sequences, principles and ADRs, cross-cutting defaults, integrations) · chunk 09 (§13 decomposition) · chunk 10 (§14 event hub) · chunks 13a+ (§17 service specs) · chunk 12 (§16 roles) · chunk 11 (§15 API contracts) · chunk 18 (§23 open items, cleared).

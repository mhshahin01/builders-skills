<!--
CHUNK: 19
TITLE: Implementation Deck Brief
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: 00, 01, 02, 03, 03a, 04, 05, 06, 07, 09, 10, 15, 16, 17, 18, and decision-log.md; SDD §15.2 (the exposure, Type, and Status reads of the API statistics) and the SDD contract Fallback rows
PART OF: LLD - [Project Name]
TYPE: Derived chunk (not an LLD section)
GATE: Written only on request, and only when chunk 18 is cleared, verified against the file (SKILL.md step 7c, item 1): every item of chunk 18 has Status Accepted - applied, Adjusted - applied, or Rejected. No override. While the gate is shut nothing of this chunk is written, not even a draft or outline; only its status line may change, to Stale (SKILL.md step 7c, item 5), and in COMBINED mode its links to the renamed LLD file.
MERGE: Excluded. Never part of the merged or combined LLD. No other document reads it as a source. Writing, refreshing, or marking this chunk Stale bumps no version and adds no Changes Log row.
PURPOSE: A presentation-ready brief of the implementation design (clean code practices, code architecture, API statistics, API contracts, database design, database practices, and integrations with failover), usable as input to a deck-generating agent.
RULES: deck-brief-rules.md in this skill folder. Nothing here adds or changes a requirement or a design decision. A gap found while writing this brief is raised as an open item, and the affected slide is labelled Provisional with its OI reference. A slide that rests on a value the LLD flags as unconfirmed, or on another open point, states it as open with its source linked, and stays Confirmed.
DESIGN STANDARD: The project-level ui-ux-global-constitution.md when it exists (its color and typography token sections, cited by name), otherwise the Primary Color of each source BRD's chunk 11, otherwise Recommendation:, asked in the handoff. See SKILL.md step 7c, item 3.
-->

# Implementation Deck Brief

**Brief status:** [Up to date / Provisional (OI-NN, ...) / Stale] | **Basis:** LLD v[X.X] | **Gate verified:** [YYYY-MM-DD] (chunk 18 read from the file: each of its [N] items has Status `Accepted - applied`, `Adjusted - applied`, or `Rejected`) | **New items raised while writing this brief:** [0, or OI-NN ...]

**Design standard:** [ui-ux-global-constitution.md: path and version or date, or "None found; [KEY] chunk 11 used" (one per source BRD), or "None found; no source BRD states a Primary Color; Recommendation: asked in the handoff"]

---

## Deck settings

| | |
|---|---|
| **Audience** | [Who is in the room and what they decide. From the user; otherwise write "Recommendation: ..." and ask in the handoff.] |
| **Purpose** | [What the deck must achieve: a design review before the build, onboarding of the implementers, alignment of the teams. From the user; otherwise "Recommendation: ...".] |
| **Length** | [n] slides, about [n] minutes [From the user; otherwise "Recommendation: ...".] |
| **Tone** | [Technical and plain: implementation terms as the LLD Glossary (§ 4) defines them, each acronym spelled out on the first slide that uses it] |
| **Product name** | [From chunk 00 / 01] |
| **Logo** | [Optional. File or link when one is available; otherwise "None provided; use the product name as a text wordmark". Never invented.] |
| **Color palette** | [Constitution color tokens by name: primary, secondary, neutrals, semantic. No constitution: the Primary Color of each source BRD's chunk 11 only (the BRDs chunk 00 lists as Related BRD(s)). Neither: "Recommendation: ..." and ask in the handoff. An open clarification in a source stays open, in plain words, with its source linked (deck-brief-rules.md § Faithfulness).] |
| **Typography** | [Constitution typography tokens by name: typefaces, weights, heading and body scale. No constitution: "Not defined; recommendation: ..." and ask in the handoff.] |
| **Accessibility** | Text and key visuals meet at least 4.5:1 contrast against their background; meaning is never carried by color alone. |
| **Language & locale** | [English. Numbers, dates, and currency formatted per the Language & Locale of each source BRD's chunk 11, with the currency code in multi-currency figures. No source BRD: the conventions the LLD states (02 § 5.5), else "Recommendation: ..." and ask in the handoff.] |

## Instructions for the deck-generating agent

<!-- Copy the bullets of deck-brief-rules.md § Instructions for the deck-generating agent here, as written, and keep this skill's own bullets below them. The bullets are not repeated in this template. -->

[The bullets of deck-brief-rules.md § Instructions for the deck-generating agent, copied as written.]

- A diagram that a slide names is the Mermaid block of its source section. Redraw it only as that block shows, without adding, removing, or renaming a node or an edge.
- Show an API statistic as this brief writes it, with the source table the slide names. Do not recompute, round, or combine a figure.

## Slide sequence

<!-- One block per slide, in this order. After the title slide come seven focus areas, with the IDs of this template: clean code practices (SL-02, SL-03), code architecture (SL-04 to SL-06), API statistics (SL-07 to SL-09), API contracts (SL-10, SL-11), database design (SL-12, SL-13), database practices (SL-14, SL-15), and integrations and failover (SL-16 to SL-18). Key decisions and open points, then next steps, come last, with the next free IDs. A written brief numbers its slides in the order it writes them. A focus area with more material takes more slides: the next free ID, placed in its area. This template has no optional slides. A modular monolith or hybrid core reads module for service. A slide whose source section states that it does not apply (for example 07 § 10.1 reading "Not applicable - no broker") folds into another slide of its area as one talking point that cites the section. A count is computed from the table it cites, and the slide names that table. A fact the LLD holds as open stays open on the slide, in plain words, and the slide never fills the gap. A value that the LLD flags as unconfirmed (a `> Confirm:` or a `> TODO:` flag) is stated as unconfirmed, in plain words, with the section that holds it linked, and its slide stays Confirmed (deck-brief-rules.md § Faithfulness). Provisional is only a gap found while writing this brief, labelled with its OI reference. A flag line is never copied into this chunk outside inline code. A BRD ID a slide cites carries its BRD key (REFUNDS/NFR-02), and a use case its link. The links below are the CHUNKS mode links; in COMBINED mode each one targets ../LLD-[ProjectName]-v[X.X].md, with the anchor recomputed from the heading as it stands in the combined file (chunking.md § Heading map, Links: a service-file section is a ### heading there, without its number, and a heading repeated across services takes -1, -2, and so on). A link into the SDD is ../sdd-[sdd-slug]/NN-name.md#anchor in both modes. -->

### SL-01 - [Project Name]: [one-line promise]

- **Key message:** [What the system is, and how it is built, in one sentence]
- **Talking points:**
  - [What the system is, in one line, from §1 Purpose]
  - [The architecture style in one phrase, from §6.4]
  - [What this audience is asked to do, from Deck settings, Purpose]
- **Suggested visual:** [Title treatment with the product name and the brand color]
- **Sources:** [01 / §1 Purpose](./01-purpose-and-scope.md#1-purpose), [03 / §6.4 Architectural Style](./03-architecture.md#64-architectural-style---as-operationalised), [17 / §1 Mission](./17-specs.md#1-mission)
- **Status:** Confirmed

### SL-02 - Clean code: the coding conventions

- **Key message:** [The rules every service follows, and what each forbids]
- **Talking points:**
  - [The number of rules, counted from the rows of the §6.5.2 table]
  - [The rules grouped by Applies to, with the count of each group]
  - [The three to five rules that shape the code most, each named as §6.5.2 names it, with its Do and its Don't in a few words]
  - [Where the detail of each rule lives, from its Source cell, so that the slide never restates it]
- **Suggested visual:** [Rule cards grouped by Applies to: rule name, Do, and Don't; the §6.5.2 table is not copied]
- **Sources:** [03a / §6.5.2 Coding Conventions (Clean Code)](./03a-libraries-and-conventions.md#652-coding-conventions-clean-code)
- **Status:** [Confirmed / Provisional (OI-NN)]

### SL-03 - Clean code: enforcement, libraries, and exceptions

- **Key message:** [How the rules are enforced, which libraries carry them, and where a service departs]
- **Talking points:**
  - [The rules counted by their Enforced by cell: `review`, or the tool §6.5.2 names there, stated as enforcing only where that tool is an `Approved` §6.5.1 row]
  - [The libraries that carry the rules (the HTTP client rows and the DTOs row), named as §6.5.1 names them, with the count of rows by Status]
  - [The per-service departures, counted from the §6.5.3 table, each with its reason in one line; or that every service follows §6.5.1 and §6.5.2]
  - [Any row still `Proposed - needs approval`, and who confirms it (SKILL.md step 3a, item 1)]
- **Suggested visual:** [Two counters (rules by enforcement, library rows by Status) and a short list of departures; no table is copied]
- **Sources:** [03a / §6.5.1 Libraries by Concern](./03a-libraries-and-conventions.md#651-libraries-by-concern), [03a / §6.5.2 Coding Conventions (Clean Code)](./03a-libraries-and-conventions.md#652-coding-conventions-clean-code), [03a / §6.5.3 Per-Service Deltas](./03a-libraries-and-conventions.md#653-per-service-deltas)
- **Status:** [Confirmed / Provisional (OI-NN)]

### SL-04 - Code architecture: components and style

- **Key message:** [How the system is divided into components, and the rules that style imposes on the code]
- **Talking points:**
  - [The components and the load-bearing connections the topology diagram shows (§6.1)]
  - [The number of services or modules, counted from the files of `04-implementation/`]
  - [The service boundary rule and the rule on synchronous calls (§6.4)]
  - [How events travel between services, or between modules (§6.4)]
- **Suggested visual:** [The component topology diagram (§6.1)]
- **Sources:** [03 / §6.1 Component Topology](./03-architecture.md#61-component-topology), [03 / §6.4 Architectural Style - As Operationalised](./03-architecture.md#64-architectural-style---as-operationalised)
- **Status:** [Confirmed / Provisional (OI-NN)]

### SL-05 - Code architecture: class and interface maps

- **Key message:** [How each service is laid out in classes, and where its entry points are]
- **Talking points:**
  - [Per service, the load-bearing classes counted by kind from its §7.2 tables: controllers, service interfaces, implementations, repositories, domain types, and ports and adapters]
  - [The totals across the services in scope, summed from those counts]
  - [The entry points counted by Kind (REST, listener, job, port) from the §7.2 Authorization tables]
  - [One path from entry point to repository for the main service, named as its §7.2 tables name the classes]
- **Suggested visual:** [A layer strip per service (controller, service, repository) with the counts; no class diagram and no table is copied]
- **Sources:** [04 / §7.2 Class & Interface Map, one link per service](./04-implementation/[service-slug].md#72-class--interface-map)
- **Status:** [Confirmed / Provisional (OI-NN)]

### SL-06 - Code architecture: design patterns

- **Key message:** [Which patterns the code applies, and why]
- **Talking points:**
  - [The number of pattern applications, counted from the `### Pattern:` headings of the §7.4 sections]
  - [Each pattern named once, with the number of services that apply it]
  - [For the three to five most used, the rule that triggers it and the role it plays, one line each]
  - [A pattern that a flag marks as unconfirmed is stated as unconfirmed]
- **Suggested visual:** [Pattern chips with the service counts; or the class diagram of one pattern, named by service and section (§7.4, Pattern: [name])]
- **Sources:** [04 / §7.4 Design Patterns Applied, one link per service](./04-implementation/[service-slug].md#74-design-patterns-applied)
- **Status:** [Confirmed / Provisional (OI-NN)]

<!-- API statistics (SL-07 to SL-09). Every figure is computed from the LLD when the brief is written, never estimated, and recounted before presenting. The slide names the table it was counted from. The LLD has no Exposure field in a § 9.2 block: derive exposure as the table says, and cite the SDD §15.2 Contract Index for the Type and Status reads. Without an SDD the read is not possible: the slide says so and shows no exposure split and no Status count.

| Statistic | Computed from |
|---|---|
| Total endpoints | The rows of 06 § 9.1 (HTTP endpoints). The blocks of § 9.2 equal them one to one (06 § 9.2 Convention, One block per row); count both. A difference is a gap: raise it (SKILL.md step 7c, item 3), show the § 9.1 count, and say that the blocks differ. In-process ports: the rows of 06 § 9.6, counted apart. |
| Per service | The rows of each `### Service:` group of § 9.1; ports per provider module from § 9.6 |
| Per HTTP method | The Method cell of each § 9.1 row. A row whose Method reads `TBD` is counted as "method TBD" |
| By exposure | In-process port: a § 9.6 row (Type `Internal (in-process)`). Internal: an HTTP row whose API ID links an SDD §15.2 contract of Type Internal. Public: an HTTP row with API ID `-` (client-facing) or whose API ID links a contract of Type External inbound (provider callback). Of the public ones, the rows whose Permission token cell reads `None - public` are counted apart. The three counts sum to § 9.1 plus § 9.6 |
| Require an idempotency key | The § 9.1 rows whose Idempotency-Key cell reads `Required` |
| Paginated list endpoints | The § 9.2 blocks whose Path and query parameters table has a row that cites § 9.4 in its Constraints cell |
| API versions in use | The distinct `/vN` prefixes of the Path cells of § 9.1 |
| Topics produced and consumed | Topics: the rows of 07 § 10.1 other than the DLQ row. Produced, per service: the rows of § 10.3 for that Producer service. Consumed: the rows of § 10.4. In-process events: the rows of § 10.6. A section that reads "Not applicable" counts 0 and folds into another talking point |
| External integrations | The § 12.3 Instances rows that are external: a row whose Source cell cites an SDD §12 `INT-NN`, or whose Caller API ID links an SDD §15.2 contract of Type `External outbound` (its Integration ref column holds the `INT-NN`). Counted as the distinct `INT-NN` IDs (a contract with none counts as one integration named by its contract), with the number of those instance rows beside it. A row of neither kind (a service-to-service call, a broker client) is not an external integration: the slide reports it apart as other resilience instances, or leaves it out and says so. Without an SDD, count only the rows whose Source cell cites an `INT-NN` |
| Full failover | An external integration (the row above) whose every instance has a timeout, a retry, a circuit breaker, and a fallback. Timeout, retry, and circuit breaker are present when the cell of the instance, or the default row of the table above it for a cell that reads `Default`, states a value, and absent when it reads `None` or starts with `No`. The fallback is the `Fallback when unavailable` row of the SDD contract that the instance's Caller cell links, else the `Fallback` cell of the SDD §12 row the Source cell cites; it is absent when that cell reads `None` or is empty. Without an SDD no fallback can be read: the slide says so, and no integration counts as full failover. The bulkhead is reported and is not part of the test |
| Contracts still `TBD - external` | The distinct API IDs cited in the API ID cells of § 9.1 and the Caller cells of § 12.3, and the `External outbound` contracts the LLD links from § 9 or from its service files that no § 12.3 instance covers (the SDD §15.2 rows), counted once each, whose SDD §15.2 Status reads `TBD - external`. Their § 9.2 blocks carry `TBD - external` fields (06 § 9.2 Convention) |

An LLD written before the § 9.2 blocks has § 9.1 rows only: every row above is read from § 9.1, the paginated count reads "not available: the LLD has no § 9.2 blocks", and the handoff makes the one-time offer of SKILL.md step 8. -->

### SL-07 - API statistics: endpoints

- **Key message:** [How many endpoints the system exposes, and how they divide by service and method]
- **Talking points:**
  - [The total of endpoints, counted from the §9.1 rows, with the count of in-process ports from §9.6 beside it, and the count of §9.2 blocks that equals them]
  - [The endpoints per service, counted from the §9.1 groups]
  - [The endpoints per HTTP method, counted from the Method cells; a method that reads `TBD` counted apart]
  - [The API versions in use, read from the Path cells]
- **Suggested visual:** [Stacked bar of the endpoints per service, split by method; counts only, no endpoint is listed]
- **Sources:** [06 / §9.1 Endpoint Inventory](./06-api-contracts.md#91-endpoint-inventory), [06 / §9.2 Request / Response Shapes](./06-api-contracts.md#92-request--response-shapes), [06 / §9.6 In-Process Port Contracts](./06-api-contracts.md#96-in-process-port-contracts-sdd-15)
- **Status:** [Confirmed / Provisional (OI-NN)]

### SL-08 - API statistics: exposure, idempotency, and pagination

- **Key message:** [Who can call the endpoints, which writes are safe to repeat, and which lists are paged]
- **Talking points:**
  - [The endpoints by exposure: public (called through the gateway only where §9.3 or the SDD says so; the client-facing and the provider callbacks counted apart), internal, and in-process port, as the table in the comment above SL-07 derives them, citing SDD §15.2]
  - [How many of the public endpoints carry `None - public` and so need no token]
  - [The endpoints that require an idempotency key, counted from the Idempotency-Key cells of §9.1, against the number of write endpoints]
  - [The paginated list endpoints, counted from the §9.2 blocks that cite §9.4]
- **Suggested visual:** [Three counters (exposure, idempotency key, pagination) with their counts; no endpoint is listed]
- **Sources:** [06 / §9.1 Endpoint Inventory](./06-api-contracts.md#91-endpoint-inventory), [06 / §9.2 Request / Response Shapes](./06-api-contracts.md#92-request--response-shapes), [06 / §9.4 Pagination, Sorting, Filtering](./06-api-contracts.md#94-pagination-sorting-filtering), [06 / §9.6 In-Process Port Contracts](./06-api-contracts.md#96-in-process-port-contracts-sdd-15), [SDD 11 / §15.2 Contract Index](../sdd-[sdd-slug]/11-api-contracts.md#152-contract-index)
- **Status:** [Confirmed / Provisional (OI-NN)]

### SL-09 - API statistics: events, integrations, and open contracts

- **Key message:** [How much event traffic and how many external dependencies the system has, and how many contracts are still waiting for a provider]
- **Talking points:**
  - [The number of topics, counted from the §10.1 rows other than the DLQ row; the topics produced per service (§10.3) and the consumptions (§10.4); the in-process events (§10.6), when the LLD has them]
  - [The number of external integrations, counted from the §12.3 Instances table, and how many of them have full failover (timeout, retry, circuit breaker, and fallback)]
  - [The integrations without full failover, each named with what it lacks]
  - [The contracts still `TBD - external`, counted as the comment above SL-07 says, each named by its API ID]
- **Suggested visual:** [Counters for topics and integrations, and a short list of the integrations that lack a pattern; no table is copied]
- **Sources:** [07 / §10.1 Topic Inventory](./07-event-contracts.md#101-topic-inventory), [07 / §10.3 Producer Specs](./07-event-contracts.md#103-producer-specs-per-topic), [07 / §10.4 Consumer Specs](./07-event-contracts.md#104-consumer-specs-per-topic), [07 / §10.6 In-Process Domain Events](./07-event-contracts.md#106-in-process-domain-events-sdd-1410), [09 / §12.3 Resilience](./09-cross-cutting.md#123-resilience-downstream-calls), [SDD 11 / §15.2 Contract Index](../sdd-[sdd-slug]/11-api-contracts.md#152-contract-index)
- **Status:** [Confirmed / Provisional (OI-NN)]

### SL-10 - API contracts: versioning and errors

- **Key message:** [How the API versions, and how every error looks]
- **Talking points:**
  - [The versioning rule: the URI prefix, and a new version for a breaking change (the §9 header), with the versions in use]
  - [The error model: RFC 9457 Problem Details, with the shared errors counted from the Shared errors table of §9.2, each as status and `errorCode`]
  - [How a block states its own errors: the `type` and `errorCode` equal the owner's §7.7 row (§9.2 Convention, Errors)]
  - [The fields every §9.2 block carries, by name only]
- **Suggested visual:** [One block of the main service, shown as its field names with the values hidden; or the shared errors as status badges]
- **Sources:** [06 / §9 API Contracts](./06-api-contracts.md#9-api-contracts), [06 / §9.2 Request / Response Shapes](./06-api-contracts.md#92-request--response-shapes), [09 / §12.6 Error Model](./09-cross-cutting.md#126-error-model-rfc-9457-problemdetails)
- **Status:** [Confirmed / Provisional (OI-NN)]

### SL-11 - API contracts: authentication, pagination, and ports

- **Key message:** [How callers are authenticated and authorised, how lists are paged, and how modules call each other]
- **Talking points:**
  - [The token issuer, the token type, and the validation point (§9.3)]
  - [How internal HTTP calls authenticate, and where the permission token is checked (§9.3)]
  - [The pagination, sorting, and filtering rule (§9.4), with the total-count header only where §9.4 states one]
  - [The in-process port contracts, counted from the §9.6 rows, and the OpenAPI spec as generated from or checked against the §9.2 blocks (§9.5)]
- **Suggested visual:** [Request path from the client to the service, with the checks named and the gateway shown only where §9.3 or the SDD names it; no endpoint is listed]
- **Sources:** [06 / §9.3 Authentication & Authorisation](./06-api-contracts.md#93-authentication--authorisation), [06 / §9.4 Pagination, Sorting, Filtering](./06-api-contracts.md#94-pagination-sorting-filtering), [06 / §9.5 OpenAPI snippets](./06-api-contracts.md#95-openapi-snippets), [06 / §9.6 In-Process Port Contracts](./06-api-contracts.md#96-in-process-port-contracts-sdd-15)
- **Status:** [Confirmed / Provisional (OI-NN)]

### SL-12 - Database design: entities and tables

- **Key message:** [What the data model holds, and how it is divided between the services]
- **Talking points:**
  - [The main entities and their key relationships, from the ERD (§8.1)]
  - [The schemas and the tables per service, counted from the `### Service:` groups of §8.2, one table per `**Table name:**` block, or in a legacy § 8.2 (one table per service) the distinct values of its Table column]
  - [The tables every service owns besides its domain tables, named as §8.2 names them]
  - [The one rule on data ownership: each service owns a private schema (the §8 header)]
- **Suggested visual:** [The ERD (§8.1), named by section; a counter of tables per service]
- **Sources:** [05 / §8.1 Entity Relationship](./05-data-model.md#81-entity-relationship-system-wide), [05 / §8.2 Tables](./05-data-model.md#82-tables-per-service)
- **Status:** [Confirmed / Provisional (OI-NN)]

### SL-13 - Database design: multi-tenancy

- **Key message:** [How tenants are kept apart in the data]
- **Talking points:**
  - [The strategy of each service, schema per tenant or shared schema with `tenant_id`, counted by strategy from the §8.4 table]
  - [The reason for each strategy, in one line, for the services that carry most of the data]
  - [How the tenant filter is enforced (§8.4)]
  - [The rule on cross-tenant queries, and how it is enforced (§8.4)]
- **Suggested visual:** [Services grouped by strategy; the §8.4 table is not copied]
- **Sources:** [05 / §8.4 Multi-Tenancy Strategy](./05-data-model.md#84-multi-tenancy-strategy)
- **Status:** [Confirmed / Provisional (OI-NN)]

### SL-14 - Database practices: indexes and migrations

- **Key message:** [How the schema is indexed and how it changes]
- **Talking points:**
  - [The number of indexes, counted from the §8.3 rows, and how many of them list `tenant_id` among their columns; the others named with their rationale]
  - [The hot-path indexes, one line each]
  - [The migration rule: versioned SQL only, backward-compatible changes, and expand-contract for a breaking change (§8.5)]
  - [The number of migrations in the plan, counted from the §8.5 rows]
- **Suggested visual:** [A counter of indexes with the `tenant_id` share, and a short migration timeline; no table is copied]
- **Sources:** [05 / §8.3 Indexes](./05-data-model.md#83-indexes), [05 / §8.5 Migration Plan (Flyway)](./05-data-model.md#85-migration-plan-flyway)
- **Status:** [Confirmed / Provisional (OI-NN)]

### SL-15 - Database practices: retention, encryption, identifiers, and time

- **Key message:** [How long data lives, how it is protected, and how rows are identified and dated]
- **Talking points:**
  - [The retention rule of each table class and its archival destination (§8.6)]
  - [Encryption at rest and in transit, key management, and the handling of PII columns (§8.7)]
  - [Primary keys are UUIDv7, generated at the service layer (§5.5), and the key column types as §8.2 writes them]
  - [Every timestamp is stored in UTC (§5.5), and the timestamp column type as §8.2 writes it]
- **Suggested visual:** [Four short panels: retention, encryption, identifiers, time; no table is copied]
- **Sources:** [05 / §8.6 Retention & Archival](./05-data-model.md#86-retention--archival), [05 / §8.7 Encryption](./05-data-model.md#87-encryption), [05 / §8.2 Tables](./05-data-model.md#82-tables-per-service), [02 / §5.5 Shared Conventions](./02-context.md#55-shared-conventions-apply-to-every-service-in-scope)
- **Status:** [Confirmed / Provisional (OI-NN)]

### SL-16 - Integrations: external systems and failover

- **Key message:** [Which outside systems the services call, and how each call survives a failure]
- **Talking points:**
  - [The number of external integrations and of instances, counted from the §12.3 Instances table]
  - [For each integration, in one line: timeout, retry (backoff and jitter as the Retry cell states them), circuit breaker, bulkhead, and fallback]
  - [How many integrations have full failover (timeout, retry, circuit breaker, and fallback), and which do not, each with what it lacks]
  - [A bound that a flag marks as unconfirmed is stated as unconfirmed, and the integration that waits on the provider's documentation]
- **Suggested visual:** [One row per integration with four marks (timeout, retry, circuit breaker, fallback) and the bulkhead size; the §12.3 table is not copied]
- **Sources:** [09 / §12.3 Resilience](./09-cross-cutting.md#123-resilience-downstream-calls), [02 / §5.3 Downstream Consumers](./02-context.md#53-downstream-consumers-systems-this-llds-services-call--publish-to), [SDD 11 / §15.2 Contract Index](../sdd-[sdd-slug]/11-api-contracts.md#152-contract-index)
- **Status:** [Confirmed / Provisional (OI-NN)]

### SL-17 - Integrations: outbox, saga, and dead-letter queue

- **Key message:** [How a state change and its side effects stay consistent, and how a failed message is handled]
- **Talking points:**
  - [The outbox: what it covers, the same-transaction write, the separate publisher, and processed only after the target acknowledges (§12.4)]
  - [Delivery is at least once, and every receiver dedupes (§12.4, §10.4)]
  - [The saga style: choreography by default, orchestration when the flow is complex, and idempotent compensation; the sagas named, with their orchestrators (§12.5)]
  - [The dead-letter queue: naming, retention, replay tool, and alerting (§10.5); or that the LLD has no broker]
- **Suggested visual:** [Flow of one state change: aggregate write and outbox row in one transaction, publisher, target, acknowledgement; no diagram block is copied]
- **Sources:** [09 / §12.4 Outbox Pattern](./09-cross-cutting.md#124-outbox-pattern-mandatory-for-side-effects-that-must-follow-a-state-change), [09 / §12.5 Saga Pattern](./09-cross-cutting.md#125-saga-pattern-cross-service-transactions), [07 / §10.4 Consumer Specs](./07-event-contracts.md#104-consumer-specs-per-topic), [07 / §10.5 DLQ Strategy](./07-event-contracts.md#105-dlq-strategy)
- **Status:** [Confirmed / Provisional (OI-NN)]

### SL-18 - Integrations: runbooks

- **Key message:** [What the on-call does when a failover pattern is exercised]
- **Talking points:**
  - [The number of runbook procedures, counted from the RB-NN headings of §13.8, each named by its title]
  - [Which procedure answers which failure of the previous slide, for example a backlog in the outbox or a message in the dead-letter queue]
  - [The rule that every paging alert maps to a procedure, only where the §13.8 Convention states it]
  - [A procedure that is still a placeholder is stated as open]
- **Suggested visual:** [List of procedures: RB-NN, title, the failure it answers; no step is copied]
- **Sources:** [10 / §13.8 Runbook Procedures](./10-operations.md#138-runbook-procedures), [10 / §13.9 On-Call](./10-operations.md#139-on-call)
- **Status:** [Confirmed / Provisional (OI-NN)]

### SL-[NN] - Key decisions and open points

- **Key message:** [The decisions that shaped this implementation, and what is still open]
- **Talking points:**
  - [The key decisions, each in one line with its reason: the approved stack overrides and the other decisions of the decision log, and the ADRs §19.2 lists]
  - [The number of open items of chunk 18 by outcome (`Accepted - applied`, `Adjusted - applied`, `Rejected`), counted from the Resolution Log; none is open on the Gate verified date]
  - [Each open item raised while writing this brief, as a question. If there is none, say that no open item remains.]
  - [The values still flagged as unconfirmed, by kind, counted from the §18.5 table of chunk 15, and the decisions pending, counted from its §18.4 table]
- **Suggested visual:** [Decision list: decision, reason, consequence]
- **Sources:** [decision-log / Stack approval record](./decision-log.md#stack-approval-record), [18 / Resolution Log](./18-open-items-and-clarifications.md#resolution-log), [15 / §18.4 Decisions Pending](./15-open-questions.md#184-decisions-pending), [15 / §18.5 Inference Confidence Summary](./15-open-questions.md#185-inference-confidence-summary), [16 / §19.2 Architectural Decision Records](./16-references.md#192-architectural-decision-records)
- **Status:** [Confirmed / Provisional (OI-NN)]

### SL-[NN] - Next steps

- **Key message:** [What happens after this review]
- **Talking points:**
  - [The delivery phases of the Roadmap, each with its services (§3 of the Specs)]
  - [The dependencies still `Proposed - needs approval`, counted from the §6.5.1 table, each with the path that confirms it]
  - [The decisions pending and their owners, from §18.4 of chunk 15]
  - [What is asked of this audience next, from Deck settings, Purpose]
- **Suggested visual:** [Path of the delivery phases; a short list of what waits for a decision]
- **Sources:** [17 / §3 Roadmap](./17-specs.md#3-roadmap), [03a / §6.5.1 Libraries by Concern](./03a-libraries-and-conventions.md#651-libraries-by-concern), [15 / §18.4 Decisions Pending](./15-open-questions.md#184-decisions-pending)
- **Status:** [Confirmed / Provisional (OI-NN)]

<!-- MASTER: [project-slug]-lld-master.md | PREV: 18-open-items-and-clarifications.md | NEXT: none -->

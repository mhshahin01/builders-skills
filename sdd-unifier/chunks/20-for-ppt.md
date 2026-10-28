<!--
CHUNK: 20
TITLE: Architecture Deck Brief
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: 00, 01, 02, 04, 05a, 06, 08, 09, 10, 11, 15, 18, 19, and the E3 marker inventory of the master; 05, 07, 14 for the optional slides
PART OF: SDD - [Project Name]
TYPE: Derived chunk (not an SDD section)
GATE: Written only on request, and only when the e2e gate reads Open - Up to date, verified against the files (SKILL.md step 8b, E1-E4), and chunk 19 exists. No override. While the gate is shut nothing of this chunk is written, not even a draft or outline; only its status line may change, to Stale (SKILL.md step 8c, item 5), and in COMBINED mode its links to the renamed SDD file.
MERGE: Excluded. Never part of the merged or combined SDD. Not an input to lld-unifier. Outside the E3 body and the E4 hash. Writing, refreshing, or marking this chunk Stale bumps no version and adds no Changes Log row.
PURPOSE: A presentation-ready brief of the architecture (system design, infrastructure, network, and integration), usable as input to a deck-generating agent.
RULES: deck-brief-rules.md in this skill folder. Nothing here adds or changes a requirement or a design decision. A gap found while writing this brief is raised as an open item, and the affected slide is labelled Provisional with its OI reference.
DESIGN STANDARD: The project-level ui-ux-global-constitution.md when it exists (SKILL.md principle 19; its color and typography token sections, cited by name), otherwise the Primary Color of each source BRD's chunk 11, otherwise Recommendation:, asked in the handoff. See SKILL.md step 8c, item 3.
-->

# Architecture Deck Brief

**Brief status:** [Up to date / Provisional (OI-NN) / Stale] | **Basis:** SDD v[X.X] | **Gate verified:** [YYYY-MM-DD] (E1-E4 against the files; the E2E gate line of the master, or of the cover in COMBINED mode, which has no master, reads `Open - Up to date`) | **New items raised while writing this brief:** [0, or OI-NN ...]

**Design standard:** [ui-ux-global-constitution.md: path and version or date, or "None found; [KEY] chunk 11 used" (one per source BRD), or "None found; no source BRD states a Primary Color; Recommendation: asked in the handoff"]

---

## Deck settings

| | |
|---|---|
| **Audience** | [Who is in the room and what they decide. From the user; otherwise write "Recommendation: ..." and ask in the handoff.] |
| **Purpose** | [What the deck must achieve: approval of the architecture, a design review, alignment of the teams. From the user; otherwise "Recommendation: ...".] |
| **Length** | [n] slides, about [n] minutes [From the user; otherwise "Recommendation: ...".] |
| **Tone** | [Technical and plain: architecture terms as the SDD Glossary (§5) defines them, each acronym spelled out on the first slide that uses it] |
| **Product name** | [From chunk 00 / 01] |
| **Logo** | [Optional. File or link when one is available; otherwise "None provided; use the product name as a text wordmark". Never invented.] |
| **Color palette** | [Constitution color tokens by name: primary, secondary, neutrals, semantic. No constitution: the Primary Color of each source BRD's chunk 11 only. Neither: "Recommendation: ..." and ask in the handoff. An open clarification in a source stays open, in plain words, with its source linked (deck-brief-rules.md § Faithfulness).] |
| **Typography** | [Constitution typography tokens by name: typefaces, weights, heading and body scale. No constitution: "Not defined; recommendation: ..." and ask in the handoff.] |
| **Accessibility** | Text and key visuals meet at least 4.5:1 contrast against their background; meaning is never carried by color alone. |
| **Language & locale** | [English. Numbers, dates, and currency formatted per the Language & Locale of each source BRD's chunk 11, with the currency code in multi-currency figures. No source BRD: the locale the SDD states, else "Recommendation: ..." and ask in the handoff.] |

## Instructions for the deck-generating agent

<!-- Copy the bullets of deck-brief-rules.md § Instructions for the deck-generating agent here, as written, and keep this skill's own bullet below them. The bullets are not repeated in this template. -->

[The bullets of deck-brief-rules.md § Instructions for the deck-generating agent, copied as written.]

- A diagram that a slide names is the Mermaid block of its source figure. Redraw it only as that block shows, without adding, removing, or renaming a node or an edge.

## Slide sequence

<!-- One block per slide, in this order. After the title slide come four focus areas, with the IDs of this template: system design and architecture (SL-02 to SL-07), infrastructure (SL-08, SL-09), network (SL-10, SL-11), and integration (SL-12 to SL-15). A written brief numbers its slides in the order it writes them. An SDD with no chunk 05a has one infrastructure slide and one network slide, built from §6, §11.3, §11.6, and §19 (SKILL.md step 8c, item 3), so the IDs from SL-10 on shift down by two. A focus area with more material takes more slides: the next free ID, placed in its area. The optional slides sit after the focus areas; key decisions and open points, then next steps, come last. A modular monolith or hybrid core reads module for service. A slide whose source section states that it does not apply folds into another slide of its area as one talking point that cites the section. A count is computed from the table it cites, and the slide names that table. A fact that the SDD holds as open stays open on the slide, in plain words, and the slide never fills the gap. A BRD ID a slide cites carries its BRD key (REFUNDS/NFR-02), and a use case its link. The links below are the CHUNKS mode links; in COMBINED mode each one targets ../SDD-[ProjectName]-v[X.X].md with the same anchor (SKILL.md step 8c, item 6). When chunk 05 was split (chunking.md § When to deviate, item 2), §8.4 is in 05-1-workflows.md and §8.5 in 05-2-sequences.md, or in 05a-workflows.md and 05b-sequences.md in an SDD that keeps the earlier names; link the file that holds the heading. -->

### SL-01 - [Project Name]: [one-line promise]

- **Key message:** [What the architecture is, and what it is for, in one sentence]
- **Talking points:**
  - [What the system is, in one line, from the Executive Summary]
  - [The architecture style, in one phrase]
  - [What this audience is asked to do, from Deck settings, Purpose]
- **Suggested visual:** [Title treatment with the product name and the brand color]
- **Sources:** [01 / §1 Executive Summary](./01-executive-summary-scope-risks.md#1-executive-summary), [04 / §8.1 Architecture Style](./04-architecture-style-and-diagrams.md#81-architecture-style)
- **Status:** Confirmed

### SL-02 - System design: architecture style and drivers

- **Key message:** [The style the system uses and the drivers that justify it]
- **Talking points:**
  - [The style and its communication model (§8.1.1)]
  - [The drivers it answers, one line each: stage, teams, load (§8.1.2, ADR-01)]
  - [How the style shows in the design: bounded contexts, data ownership, deployment model (§8.1.3)]
  - [The options ADR-01 rejected, and the trigger to extract or consolidate]
- **Suggested visual:** [Decision card: the style, its drivers, the rejected options; no diagram]
- **Sources:** [04 / §8.1 Architecture Style](./04-architecture-style-and-diagrams.md#81-architecture-style), [06 / §10 Architectural Decisions, ADR-01](./06-principles-and-decisions.md#10-architectural-decisions)
- **Status:** [Confirmed / Provisional (OI-NN)]

### SL-03 - System design: architecture principles

- **Key message:** [The rules every service or module follows]
- **Talking points:**
  - [The number of principles, counted from the AP-NN rows of §9]
  - [The three to five principles that shape the design most, each named as §9 names it]
  - [What each of them means for this system, in one line]
- **Suggested visual:** [Principle badges: names only, grouped by theme; the §9 table is not copied]
- **Sources:** [06 / §9 Architecture Principles](./06-principles-and-decisions.md#9-architecture-principles)
- **Status:** [Confirmed / Provisional (OI-NN)]

### SL-04 - System design: system context

- **Key message:** [Who uses the system and what it depends on]
- **Talking points:**
  - [The actors and the external systems the diagram shows]
  - [The platform boundary]
  - [The protocols on the edges, as the diagram labels them]
- **Suggested visual:** [Figure [N]: System Context Diagram (§8.2), or the §24.2 view when it shows what §8.2 does not]
- **Sources:** [04 / §8.2 Context Diagram](./04-architecture-style-and-diagrams.md#82-context-diagram), [19 / §24.2 System Context](./19-e2e-system-design.md#242-system-context)
- **Status:** [Confirmed / Provisional (OI-NN)]

### SL-05 - System design: layered architecture

- **Key message:** [How the system is layered, from the edge to the data and the async backbone]
- **Talking points:**
  - [The layers in order, as the diagram shows them]
  - [Where the services or modules sit]
  - [Where data and messaging sit]
- **Suggested visual:** [Figure [N]: High-Level Architecture (§8.3), or the §24.3 view when it shows what §8.3 does not]
- **Sources:** [04 / §8.3 High-Level Architecture Diagram](./04-architecture-style-and-diagrams.md#83-high-level-architecture-diagram), [19 / §24.3 Layered High-Level Architecture](./19-e2e-system-design.md#243-layered-high-level-architecture)
- **Status:** [Confirmed / Provisional (OI-NN)]

### SL-06 - System design: service landscape

- **Key message:** [How many services or modules the system has, and what kinds]
- **Talking points:**
  - [The count of services or modules, by Type and Status, counted from the §13 table]
  - [The archetypes (domain, reusable-generic, edge, read-model, orchestrator) and how many of each, counted from §24.1]
  - [The delivery phases, from §24.1]
- **Suggested visual:** [Landscape grouped by archetype and phase, from §24.1; the §13 and §24.1 tables are not copied]
- **Sources:** [09 / §13 Services Decomposition](./09-services-summary.md#13-services-decomposition-summary), [19 / §24.1 Service Landscape](./19-e2e-system-design.md#241-service-landscape-archetype--phase)
- **Status:** [Confirmed / Provisional (OI-NN)]

### SL-07 - System design: technology eco-system

- **Key message:** [The platform stack, and which parts a source fixes and which are proposed]
- **Talking points:**
  - [The architecture doctrine row, and the ecosystem-level rules by name]
  - [The stack layers in groups (compute and runtime, data, messaging, identity and security, edge, delivery and observability, application stacks), technologies as §6 writes them]
  - [The number of rows by Status and by Source label, counted from the §6 table]
  - [Any row that is still Proposed, and who confirms it]
- **Suggested visual:** [Stack diagram by layer: layer, technology, and version as §6 writes them]
- **Sources:** [02 / §6 Ecosystem Overview](./02-ecosystem-overview.md#6-ecosystem-overview)
- **Status:** [Confirmed / Provisional (OI-NN)]

### SL-08 - Infrastructure: deployment topology

- **Key message:** [Where the system runs]
- **Talking points:**
  - [The deployment target and the decision that records it (§8.6.1)]
  - [The regions or sites, availability zones, clusters, and node pools, as §8.6.1 states them; a fact it holds as open stays open]
  - [The deployables and the environments each one runs in, with the count of deployables (§8.6.2)]
  - [The data stores, broker, and storage, counted by kind (§8.6.3)]
- **Suggested visual:** [Figure [N]: Infrastructure Deployment (§8.6.6)]
- **Sources:** [05a / §8.6.1 Deployment Topology](./05a-infrastructure-and-network.md#861-deployment-topology), [05a / §8.6.2 Deployables per Environment](./05a-infrastructure-and-network.md#862-deployables-per-environment), [05a / §8.6.3 Data Stores, Broker, and Storage](./05a-infrastructure-and-network.md#863-data-stores-broker-and-storage), [05a / §8.6.6 Deployment Diagram](./05a-infrastructure-and-network.md#866-deployment-diagram)
- **Status:** [Confirmed / Provisional (OI-NN)]

### SL-09 - Infrastructure: recovery and scaling

- **Key message:** [How the system survives a failure and grows with load]
- **Talking points:**
  - [What is backed up for each component that holds state (§8.6.4)]
  - [RPO and RTO, exactly as §8.6.4 states them; this slide reads them there, never from §18.5; a figure §8.6.4 holds as open stays open]
  - [How each tier scales (§8.6.5)]
  - [What does not scale out, and how it is protected (§8.6.5, Limits)]
- **Suggested visual:** [Recovery summary: component, RPO, and RTO as §8.6.4 writes them, for the components named above only; or the scaling model in four short lines]
- **Sources:** [05a / §8.6.4 Backup and Disaster Recovery](./05a-infrastructure-and-network.md#864-backup-and-disaster-recovery), [05a / §8.6.5 Scaling Model](./05a-infrastructure-and-network.md#865-scaling-model)
- **Status:** [Confirmed / Provisional (OI-NN)]

### SL-10 - Network: zones and ingress

- **Key message:** [How traffic reaches the system and where it is checked]
- **Talking points:**
  - [The network zones and what each holds (§8.7.1)]
  - [The ingress hops in order, from the client to the service (§8.7.2)]
  - [Where TLS ends (§8.7.4)]
- **Suggested visual:** [Figure [N+1]: Network Architecture (§8.7.8)]
- **Sources:** [05a / §8.7.1 Network Zones](./05a-infrastructure-and-network.md#871-network-zones), [05a / §8.7.2 Ingress Path](./05a-infrastructure-and-network.md#872-ingress-path), [05a / §8.7.8 Network Diagram](./05a-infrastructure-and-network.md#878-network-diagram)
- **Status:** [Confirmed / Provisional (OI-NN)]

### SL-11 - Network: egress, TLS, and access

- **Key message:** [How the system reaches outside systems, and who may enter its management zone]
- **Talking points:**
  - [The egress path of each external system, counted by kind of path (§8.7.3)]
  - [The TLS ends and the mTLS points (§8.7.4), and the network policy model (§8.7.5)]
  - [The administrative access path and who may use it (§8.7.6)]
  - [The number of allowed flows, counted from §8.7.7]
- **Suggested visual:** [Egress and TLS summary: kinds of path with their counts; the §8.7.3 and §8.7.7 tables are not copied]
- **Sources:** [05a / §8.7.3 Egress to External Systems](./05a-infrastructure-and-network.md#873-egress-to-external-systems), [05a / §8.7.4 TLS Termination and mTLS](./05a-infrastructure-and-network.md#874-tls-termination-and-mtls), [05a / §8.7.5 Service-to-Service Network Policies](./05a-infrastructure-and-network.md#875-service-to-service-network-policies), [05a / §8.7.6 Administrative Access](./05a-infrastructure-and-network.md#876-administrative-access), [05a / §8.7.7 Ports and Protocols](./05a-infrastructure-and-network.md#877-ports-and-protocols)
- **Status:** [Confirmed / Provisional (OI-NN)]

### SL-12 - Integration: external systems

- **Key message:** [Which outside systems the platform exchanges data with, and how]
- **Talking points:**
  - [The number of external systems, counted from the INT-NN rows of §12]
  - [The systems grouped by protocol and mode, as §12 states them]
  - [The kinds of authentication, as §12 states them]
  - [The external contracts that still wait for the provider's documentation, counted from §15.2]
- **Suggested visual:** [The external systems grouped by protocol; the §12 table is not copied]
- **Sources:** [08 / §12 Integrations](./08-integrations.md#12-integrations), [11 / §15.2 Contract Index](./11-api-contracts.md#152-contract-index)
- **Status:** [Confirmed / Provisional (OI-NN)]

### SL-13 - Integration: synchronous contracts at a glance

- **Key message:** [How many synchronous contracts exist, of which kinds, and how many are settled]
- **Talking points:**
  - [The total of API-NN contracts, counted from §15.2]
  - [The count by Type: Internal, Internal (in-process), External outbound, External inbound]
  - [The count by Status: Defined, TBD - external, Flagged]
  - [The conventions every contract shares, by name only (§15.1)]
- **Suggested visual:** [Stacked bar of the counts by Type and Status, computed from §15.2; no contract field is shown]
- **Sources:** [11 / §15.2 Contract Index](./11-api-contracts.md#152-contract-index), [11 / §15.1 Contract Conventions](./11-api-contracts.md#151-contract-conventions-platform-defaults)
- **Status:** [Confirmed / Provisional (OI-NN)]

### SL-14 - Integration: event backbone and fan-out

- **Key message:** [How services publish and consume events]
- **Talking points:**
  - [The hub topology decision (§14.2)]
  - [The universal per-event mechanism, in one sentence (§24.4)]
  - [The counts of topics, published events, and in-process events, read from Counts at a Glance]
  - [The fan-out of each delivery phase, and the universal subscribers by name (§24.5)]
- **Suggested visual:** [The fan-out maps of §24.5.1 and §24.5.2, one per delivery phase, named by section]
- **Sources:** [10 / §14.2 Hub Topology Decision](./10-events-hub.md#142-hub-topology-decision), [19 / §24.4 The Universal Per-Event Mechanism](./19-e2e-system-design.md#244-the-universal-per-event-mechanism-async-backbone), [19 / §24.5 Fan-Out](./19-e2e-system-design.md#245-producer--topic--consumer-fan-out-the-event-map), [19 / Counts at a Glance](./19-e2e-system-design.md#counts-at-a-glance)
- **Status:** [Confirmed / Provisional (OI-NN)]

### SL-15 - Integration: the one-hop rule

- **Key message:** [Services call each other synchronously only one hop deep]
- **Talking points:**
  - [The rule, in one sentence (§24.7)]
  - [The number of synchronous edges between services, HTTP and in-process, counted from §24.7]
  - [Why the load-bearing edges are synchronous, in a few words each]
  - [Everything else travels as events (§24.5)]
- **Suggested visual:** [The edges as a small caller-to-callee diagram with the API IDs on the edges; the §24.7 table is not copied]
- **Sources:** [19 / §24.7 Synchronous Edges](./19-e2e-system-design.md#247-synchronous-edges-one-hop-rule), [11 / §15.2 Contract Index](./11-api-contracts.md#152-contract-index)
- **Status:** [Confirmed / Provisional (OI-NN)]

<!-- Optional slides, only when the SDD has material for them. Each takes the next free SL-NN and sits here, before the closing two. -->

<!-- Optional slide: key flows and sagas. -->

### SL-[NN] - Key flows and sagas

- **Key message:** [The flows that carry the business through the system, and how a failure is undone]
- **Talking points:**
  - [The critical workflows (§8.4) and sequences (§8.5), one line each, named as the SDD names them]
  - [Each saga (§24.8): orchestrated or choreographed, the participants, and its compensation]
  - [The use cases they realise, as keyed links]
- **Suggested visual:** [The diagram of the main flow, named by section: its workflow (§8.4.x), sequence (§8.5.x), or saga (§24.8.x)]
- **Sources:** [05 / §8.4 Workflow Diagrams](./05-workflows-and-sequences.md#84-workflow-diagrams), [05 / §8.5 Sequence Diagrams](./05-workflows-and-sequences.md#85-sequence-diagrams), [19 / §24.8 Key Sagas](./19-e2e-system-design.md#248-key-sagas-dynamic-view)
- **Status:** [Confirmed / Provisional (OI-NN)]

<!-- Optional slide: cross-cutting concerns. -->

### SL-[NN] - Cross-cutting concerns

- **Key message:** [The defaults every service inherits]
- **Talking points:**
  - [Multi-tenancy (§11.2) and data modeling (§11.1) defaults, one line each]
  - [Deployment (§11.3) and observability (§11.4) defaults, one line each]
  - [Configuration (§11.5) and security (§11.6) defaults, one line each]
- **Suggested visual:** [Six labelled tiles, one per default; no table is copied]
- **Sources:** [07 / §11 Cross-Cutting Concerns](./07-cross-cutting-concerns.md#11-cross-cutting-concerns-summarized)
- **Status:** [Confirmed / Provisional (OI-NN)]

<!-- Optional slide: NFR targets. -->

### SL-[NN] - NFR targets

- **Key message:** [The technical targets the design commits to]
- **Talking points:**
  - [The number of NFRs quantified in §18.5, counted from its table]
  - [The targets that shape the architecture (availability, latency, throughput), each with its keyed NFR and its figure exactly as §18.5 states it]
  - [The RPO and RTO of a recovery NFR, read from §8.6.4, where §18.5 links to them; left out when the SDD has no §8.6.4]
  - [A target that §18.5 holds as open stays open]
- **Suggested visual:** [Target cards: NFR, target, and where it is realised]
- **Sources:** [14 / §18.5 NFR Targets](./14-performance-and-capacity.md#185-nfr-targets), [05a / §8.6.4 Backup and Disaster Recovery](./05a-infrastructure-and-network.md#864-backup-and-disaster-recovery)
- **Status:** [Confirmed / Provisional (OI-NN)]

### SL-[NN] - Key decisions and open points

- **Key message:** [The decisions that shaped this architecture, and what is still open]
- **Talking points:**
  - [The key decisions, from the ADRs (ADR-01 and the others that shape the design most), each in one line with its reason (§10)]
  - [The number of decisions the Resolution Log records, by outcome]
  - [Each open item raised while writing this brief, as a question. If there is none, say that no open item remains.]
  - [The clarification markers still open in the body: the number of rows of the E3 marker inventory, none of which blocks the e2e design; the inventory names the owner and next action of each]
- **Suggested visual:** [Decision list: ADR, decision, consequence]
- **Sources:** [06 / §10 Architectural Decisions](./06-principles-and-decisions.md#10-architectural-decisions), [18 / Resolution Log](./18-open-items-and-clarifications.md#resolution-log), [master / E3 marker inventory](./[project-slug]-sdd-master.md#e3-marker-inventory)
- **Status:** [Confirmed / Provisional (OI-NN)]

<!-- The child LLDs are as the Child LLDs table records them on the Gate verified date. When the table later differs from the rows this slide lists, the next request marks the deck Stale (SKILL.md step 8c, item 5). -->

### SL-[NN] - Next steps

- **Key message:** [What happens after this review]
- **Talking points:**
  - [The child LLDs as recorded on the Gate verified date, each with its scope and the SDD version it reflects, or "None yet"]
  - [The services that no child LLD covered on that date, counted from §13 and the Scope column of the Child LLDs table]
  - [The environments and the path to production (§19)]
  - [What is asked of this audience next, from Deck settings, Purpose]
- **Suggested visual:** [Path: child LLDs, then the environments Dev, SIT, UAT, and Prod]
- **Sources:** [00 / Child LLDs](./00-cover-and-changelog.md#child-llds-children), [15 / §19 Environments](./15-environments.md#19-environments)
- **Status:** [Confirmed / Provisional (OI-NN)]

<!-- MASTER: [project-slug]-sdd-master.md | PREV: 19-e2e-system-design.md | NEXT: none -->

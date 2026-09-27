<!--
CHUNK: 04
TITLE: System Design - Architecture Style, Context & HLA Diagrams
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: 01, 02
PART OF: SDD - [Project Name]
-->

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

<!-- MASTER: [project-slug]-sdd-master.md | PREV: 03-users-and-use-cases.md | NEXT: 05-workflows-and-sequences.md -->

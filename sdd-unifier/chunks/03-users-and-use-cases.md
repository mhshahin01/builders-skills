<!--
CHUNK: 03
TITLE: System Users & Use Cases
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: 01
PART OF: SDD - [Project Name]
-->

# 7. System Users & Use Cases

## 7.1 Actors

<!-- List all actors (human users and external systems) that interact with the platform. -->

| Actor | Type (Human / System) | Description | Primary Interface |
|-------|-----------------------|-------------|-------------------|
| [Actor 1] | [Human / System] | [Description] | [Interface] |
| [Actor 2] | [Human / System] | [Description] | [Interface] |

## 7.2 Use Case Diagram

**Figure 1: Use Case Diagram**

<!-- Inline Mermaid is the default diagram medium. Carry the UC IDs verbatim from the BRD. Append `> Miro: <url>` only if a richer whiteboard version exists on a real board. -->

```mermaid
flowchart LR
  %% Replace placeholders below
  A1([Actor 1])
  A2([Actor 2])
  EXT([External System])

  subgraph System
    UC01((UC-01))
    UC02((UC-02))
  end

  A1 --> UC01
  A2 --> UC02
  EXT --> UC02
```

**Summary:** [1-2 sentences: which actors drive which use-case clusters.]

<!-- MASTER: [project-slug]-sdd-master.md | PREV: 02-ecosystem-overview.md | NEXT: 04-architecture-style-and-diagrams.md -->

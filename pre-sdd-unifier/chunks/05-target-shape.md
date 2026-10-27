<!--
CHUNK: 05
TITLE: Target Shape
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: 02, 03a-03h, 04
PART OF: Pre-SDD - [Project Name]
-->

# 5. Target Shape

<!-- The shape, never a product: hosting (cloud, on-prem, or hybrid; a provider only when the business makes it a hard constraint), topology (for example multi-AZ, two regions), the DR strategy per failure scope (local HA, backup, pilot light, warm standby, active; cyber review for a cyber scope with an RTO or RPO of 0; unresolved while an input is missing), the data shape per workload (kind, consistency, the replication the RPO needs), and the network shape (public, private, hybrid, partner). The SDD picks the products, versions, architecture style, and detailed design. -->

## 5.1 Shape

<!-- The engine renders the target shape from the project state (fragment `05-target-shape.md`): hosting, topology, the DR strategy for each failure-scope entry of REL-05 with the replication each RPO needs, the data shape, the network shape, any decision override (with its reason and who decided), and the shape's conflicts. A failure scope whose strategy the shape cannot satisfy is a conflict: it stays in the fragment and in chunk 10, never smoothed over in prose. Paste the fragment unchanged between the markers. -->

<!-- ENGINE-FRAGMENT: 05-target-shape.md -->
| Aspect | Shape | Basis |
|--------|-------|-------|
| Hosting | [cloud / onprem / hybrid] | [Entry IDs, rule IDs] |
| Topology | [Topology] | [Entry IDs, rule IDs] |
| DR strategy, scope [az] | [localHA / backup / pilot / warm / active / cyberReview / unresolved] | REL-05.1, REL-03.1, REL-04.1 |
| Data | [kind, consistency, replication] | [Entry IDs] |
| Network | [public / private / hybrid / partner] | INT-08.1 |
<!-- /ENGINE-FRAGMENT -->

## 5.2 Diagrams

<!-- Paste the engine's diagrams (`studio/diagrams/<id>.mmd`) inline, unchanged, each in a mermaid code block, each followed by a 1-2 sentence summary so the chunk reads without a renderer. A light run keeps the infrastructure, network, and DR diagrams and leaves out the data diagram. Provider names in a diagram are illustration only. -->

### 5.2.1 Infrastructure

```mermaid
%% Paste studio/diagrams/infrastructure.mmd unchanged.
```

[1-2 sentence summary: what the diagram shows, in shape words.]

### 5.2.2 Network

```mermaid
%% Paste studio/diagrams/network.mmd unchanged.
```

[1-2 sentence summary.]

### 5.2.3 Disaster Recovery

```mermaid
%% Paste studio/diagrams/dr.mmd unchanged.
```

[1-2 sentence summary.]

### 5.2.4 Data

<!-- Only when compute writes studio/diagrams/data.mmd (the engine draws it when the data kind is known or extra data workloads exist); otherwise leave this subsection out. Left out in a light run. -->

```mermaid
%% Paste studio/diagrams/data.mmd unchanged.
```

[1-2 sentence summary.]

## 5.3 Reading the Shape

<!-- Two to six sentences: why this shape follows from the register (cite the rule IDs of the rule trace in chunk 09 and the entry IDs), what each conflict means and who owns it (by its validation ID in chunk 10), and what the shape leaves to the SDD. Shape words only. -->

[Reading, citing rule IDs and entry IDs.]

<!-- Footer: when chunk 06 is omitted (not brownfield or mixed), NEXT is 07-options-and-economics.md. -->
<!-- MASTER: [slug]-pre-sdd-master.md | PREV: 04-targets-and-calculations.md | NEXT: 06-existing-estate.md -->

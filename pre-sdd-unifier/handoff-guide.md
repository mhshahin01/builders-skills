# Handoff Guide: chunk 12, the contract the SDD reads

Chunk 12 (`12-sdd-handoff-guide.md`) is the contract between this Pre-SDD and the SDD that builds on it. `sdd-unifier` (the Software Architect) reads chunk 12 first, then the master's gate line, then chunk 11, and nothing else of this skill: never these rule files. So chunk 12 is self-contained. Everything the SDD needs to load, lock, cite, and challenge the Pre-SDD is in it, in words a reader who has never seen this skill understands.

The template is `chunks/12-sdd-handoff-guide.md`; in COMBINED mode, the § 12 section of `TEMPLATE-COMBINED.md`.

---

## When it is written

- **Full mode only.** A quick Pre-SDD claims no gate and has no chunk 12.
- **At every write-up** (SKILL.md step 11), after `compute`, from the new fragments.
- **After every signing** (SKILL.md step 13): § 12.1 and § 12.5 change with the gate. Writing a signature, a gate line, or a status line into chunk 12 is not a content change: it reopens nothing and bumps nothing.
- **In every update** that changes content (SKILL.md § Later requests): the locked items may change, and the version does.
- **A light run keeps it whole.** Nothing in chunk 12 is skipped.

---

## What each section holds, and its source

| Section | Holds | Source |
|---|---|---|
| Opening note | What the guide is; numbers and shape are locked once G3 is signed; products and style are the SDD's | The template, unchanged |
| 12.1 Pre-SDD, Gate and Signers | The Pre-SDD version, the source BRDs with keys, the engine's gate label, the G3 status, whether the SDD may start, each signer by role with decision and date, and the engine version; then how the SDD reads the gate | The master, chunk 00, the gate fragment (`11-gate.md`), `cli.mjs --version` |
| 12.2 Locked Items | The lock list: each entry with what it measures, its value, unit (and a data workload's store kind), status, owner, and SDD landings; the calculations §18 cites, each with what it measures and its value; the target-shape decisions; and the landing table, each SDD place with the rows that land there | The fragment `12-locked-items.md`, pasted unchanged |
| 12.3 Where Each Item Lands in the SDD | How the SDD applies what lands in each place; the rows themselves are the landing table of § 12.2, never copied here | The template |
| 12.4 Left to the SDD | Everything the SDD decides | The template |
| 12.5 Conditions, Exceptions and Unknowns | Each condition (`COND-NN`), exception (`EXC-NN`), and unknown (`QD-NN`) that did not block G3, with owner and due date | The gate fragment (`11-gate.md`) and the validation fragment (`10-validation.md`) |
| 12.6 When the SDD Disagrees | The open-item rule | The template |
| 12.7 Citing This Pre-SDD | `PSDD/<ID>` with a link, per kind of ID | The template, with this Pre-SDD's slug |

Every value in chunk 12 comes from an engine fragment or the master; none is restated from memory or worked out by hand. The Gate row in § 12.1 holds the engine's gate label only, as the master's gate line opens with it; the G3 status and the authorization have their own rows, and the master keeps the full gate line (label, G3 status, and authorization).

---

## The lock

Once G3 is signed (`Approved` or `Approved with conditions`, and the master's gate line does not read `Review`), the SDD loads the Pre-SDD and locks every item the lock list names. A Pre-SDD that exists but is not signed makes the SDD stop, wait, and raise a request that lists what G3 still needs. A content change after G3 sends G3 back to `Review`; until every applicable role signs again, the SDD treats the new version as not signed, and an SDD that loaded an earlier signed version keeps that version locked.

**The lock is on numbers and shape, never on the SDD's own questions.** The SDD keeps its Project Type question, its questionnaire (Q1 to Q8), its ecosystem selection, and its design. The Pre-SDD's items arrive as locked evidence and constraints in those places.

### The landing map

The engine's landing map (`LANDINGS` in `studio/src/engine.js`) says which rows are locked and where each lands. The locked-items fragment renders it twice in § 12.2: per entry (its "Lands in the SDD" column), and as the landing table, each SDD place with the rows that land there. So neither this file nor chunk 12 copies the rows by hand; § 12.3 keeps only how the SDD applies each place, and the reviewer checks that it names each place of the fragment's landing table (`review-and-open-items.md`):

| SDD place | How the SDD applies it |
|---|---|
| Project Type | Pre-fills the SDD's Project Type question. The Standard's brownfield means a workload or state to preserve; the SDD's brownfield means a codebase to extend. A brownfield Pre-SDD with no codebase to extend (a rewrite with a data migration, for example) gives an SDD Greenfield answer that carries the migration context. |
| Q3 | The evidence for Q3 (load and availability), cited as `PSDD/<ID>`. Q3 stays the SDD's choice. |
| Q7 | Q7 (multi-tenancy model) is chosen within the isolation level (below). |
| Q8 | The hosting target is locked: cloud, on-prem, or hybrid, and a provider only when the business made it a hard constraint. The runtime option is the SDD's. |
| §6 Notes | Each affected ecosystem row carries the constraint in its Notes; the data-store row carries the store kind of each data workload (DAT-01), and the product stays the SDD's. A product that breaks one becomes an open item. |
| §8.3 | The high-level architecture follows the hosting, data, integration, and network shape: the data workloads and their store kind (DAT-01), and the external dependencies with the partner quotas, latencies, SLAs, maintenance windows, and rate limits they impose (INT-03). |
| §8.6 | The infrastructure architecture follows the hosting target, the topology, the availability targets, the failure scopes, the residency, and the client and edge locations. §8.6.4 is the home of the RTO and RPO per failure scope, with the DR strategy of each scope and the restore granularity; the §18.5 row of a recovery NFR links there and restates neither figure. The storage redundancy and replication meet the durability and correctness targets (REL-10). |
| §8.7 | The network architecture follows the network constraints: address ranges and private connectivity, allow-lists, firewall, DNS and proxy dependencies, client and edge locations, where residency lets data flow, the threat posture, encryption in transit, and privileged access. |
| §11 | The cross-cutting defaults follow the DR strategy, the classification, residency, retention, the isolation level, the security obligations, the business prohibitions and obligations (BUS-07, BUS-08), and the durability and correctness targets (REL-10). |
| §18 | §18 cites the `PSDD/CALC-NN` values from the calculations table of § 12.2, each linked to its chunk 04 anchor, and never recomputes them. It sizes within the partner quotas and latencies (INT-03) and for the peak simultaneously active users (CAP-03), which no calculation reads, and its latency targets are measured where CAP-08 says, with what counts as a failure. |
| §18.5 | The settled targets for the BRD NFRs. A latency target states its measurement point and what counts as a failure (CAP-08); a durability or correctness NFR takes its target from REL-10. |
| §19 | The environments follow the DR strategy and the environment list. |
| §20 | The runbook follows the DR strategy, the recovery sequence, the failover authority, and the restore granularity. |

The target-shape decisions (hosting, topology, the DR strategy per failure scope, the data shape, and the chosen option) are locked with the rows.

### The isolation level and Q7

DAT-07 holds one of five isolation levels. Each allows these SDD Q7 options:

| DAT-07 | SDD Q7 options allowed |
|---|---|
| `single` | Single tenant |
| `shared-logical` | Shared schema with `tenant_id`, schema per tenant, or database per tenant |
| `schema-isolated` | Schema per tenant, or database per tenant |
| `database-isolated` | Database per tenant |
| `deployment-isolated` | Database per tenant |

---

## What is left to the SDD

| Topic | The Pre-SDD settles (locked) | The SDD decides |
|---|---|---|
| Hosting | Cloud, on-prem, or hybrid; a named provider only when the business makes it a hard constraint | The provider when not constrained, the products, managed or self-managed |
| Capacity | TPS, RPS, concurrency, latency budgets, growth, payload sizes, storage, bandwidth (`CALC-NN`) | The per-service breakdown, sizing per deployable, caching |
| Availability and DR | SLO, fault scope, RTO and RPO, DR strategy, topology | DR procedures, failover mechanics, environment layout |
| Data | Data kind and consistency per workload, the replication shape the RPO needs, residency, retention, tenancy model and isolation level | Products, the schema strategy per service (Q7, within the isolation level), partitioning, ERDs |
| Integration | Delivery, ordering, and duplicate-tolerance needs; partner SLAs | The mechanism (broker, outbox, synchronous calls; Q5), contracts |
| Architecture style | Nothing; only the drivers | Q4 style, Q5 communication, Q6 data ownership |
| Security | Classification, obligations, key-custody needs | The identity product, the authorization model |
| Network | The connectivity shape, address constraints | Network design, firewall rules, routes |
| Cost | Budget envelope, TCO horizon, option comparison with approved weights | Cost per component |

The Standard's ADR set splits the same way. ADR-DR-001, ADR-DATA-001, and the hosting part of ADR-PLATFORM-001 are Pre-SDD decisions (chunk 09 § 9.4), locked with the rest; so is ADR-MIG-001 (workload 7R and transition) when the migration overlay applies, and it does not exist otherwise. ADR-PERF-001, ADR-INT-001, and ADR-IAM-001 are SDD ADRs: chunk 09 § 9.5 names the answers that drive them, and the SDD writes them, citing those answers as `PSDD/<ID>`.

Chunk 12 never names a product, a version, or the architecture style, and never pre-decides an SDD question.

---

## Conditions, exceptions, and unknowns

- **Conditions** (`COND-NN`): an `Approved with conditions` sign-off lets the SDD start only when every condition has an owner and a due date, and chunk 12 carries every one. The SDD shows each open condition as a §4 risk citing `PSDD/COND-NN`.
- **Exceptions** (`EXC-NN`): only a named person grants one, never a stand-in, an answer policy, a fixture owner, or the skill. Chunk 12 lists each with its entry, who granted it, its expiry, and its review date. An expired exception no longer lifts its entry, and the engine's gate shows it.
- **Unknowns** (`QD-NN`): every open unknown that did not block G3, with its question, its entry, its owner, and its due date. The SDD carries each as an open question and never fills it.

An entry the lock list shows as `TBD` or `Open` is locked as open: the lock list says what it measures and names its owner, and the SDD designs around it, links it to its register row through its `PSDD/<ID>` link (where its due date stands), and never invents a value for it.

---

## The open-item rule

The SDD never edits a locked item and never edits the Pre-SDD. A disagreement (a locked item the SDD finds wrong, or in conflict with a source or a design need) becomes:

1. an open item in the SDD's chunk 18, with `Owner: E2E Architect (pre-sdd-unifier)`, citing the item as `PSDD/<ID>`; the SDD's e2e gate treats it like any other open item;
2. a handoff request to the E2E Architect on `unifier-status.md`, naming the open item.

This skill answers it through SKILL.md § Later requests: the E2E Architect decides with the owner, a change runs one update (new version, delta review, G3 again), and a request goes back to the Software Architect, "Pre-SDD has a new version", naming the open item or the decision to keep the item with its reason. The SDD closes its item on its next run.

---

## Citations

Every downstream citation is `PSDD/<ID>`, with a link (there is one Pre-SDD per SDD):

| ID | Links to |
|---|---|
| A row or entry (`PSDD/REL-03`, `PSDD/REL-03.2`, `PSDD/HDR-07`, `PSDD/OVL-04.2`) | Its row heading: `03c-register-reliability.md#rel-03`, `01-business-brief.md#hdr-07`, `08-migration-overlay.md#ovl-04` |
| A calculation (`PSDD/CALC-03`) | `04-targets-and-calculations.md#42-calculations` |
| An option or its rows (`PSDD/OPT-02`, `PSDD/CALC-21@OPT-02`) | `07-options-and-economics.md#71-options` |
| A condition or exception (`PSDD/COND-01`, `PSDD/EXC-01`) | `11-gate-and-sign-off.md#111-gate-result` |
| An unknown (`PSDD/QD-03`) | `10-validation-risks-unknowns.md#101-validation-and-unknowns` |
| A decision rule (`PSDD/DT-07`) | `09-decisions.md#92-decision-tree` |
| A Pre-SDD ADR (`PSDD/ADR-DR-001`) | `09-decisions.md#94-pre-sdd-adrs` |

Each register row is a `### <ROW-ID>` heading, so the row anchor is the row ID in lower case. In COMBINED mode the links point into `PRE-SDD-[ProjectName]-vX.Y.md` with the same anchors. Rule IDs keep the Studio's IDs, renamed so that none equals an item ID (`LOAD-04`, `DB-READ-17`). BRD IDs keep their BRD key (`REFUNDS/NFR-03`).

---

## Never

- Never state the lock as in force while G3 is not signed: § 12.1 then says the Pre-SDD is not signed, and the SDD waits.
- Never edit the locked-items fragment, and never add a locked item by hand: a missing item is a lock-list gap, raised as an open item (chunk 13) and fixed at its source, never in the chunk.
- Never write a number the fragments do not hold.
- Never name a product, a version, or the architecture style.
- Never tell the SDD to read this skill's rule files: chunk 12 states everything it needs.

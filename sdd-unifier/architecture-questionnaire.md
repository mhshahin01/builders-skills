# Architecture Questionnaire

The architecture style is not fixed in advance. When the SDD is derived from a BRD, a short questionnaire settles the system design choices first (step 3b), and the tech stack selection (step 3c) then builds on the answers. Microservices is one option among several, recommended when the drivers call for it, not by default.

---

## When it runs

| Intent | Questionnaire |
|---|---|
| DERIVE-FROM-BRD | **Runs**, before any chunk is written, after the Project Type answer (step 3a). |
| GENERATE (SoW, notes, topic seed) | Does not run: the request writes no SDD content until its BRD and a G3-signed Pre-SDD exist, and the SDD is then derived (SKILL.md step 2), so the DERIVE-FROM-BRD row applies. |
| TRANSFORM (an existing SDD) | Does not run. The source SDD's architecture is kept verbatim; a mismatch with the drivers becomes an open item for the reviewer, never a silent change. |
| Brownfield (any intent) | Q2-Q6 start from the existing system's style, shown as `existing` and recommended unless a driver clearly argues for change. |

It runs once per SDD. On a resume it never reruns; a change later is a decision (an ADR plus a `decision-log.md` entry) with its impact on written chunks listed for the user.

---

## The flow

1. **Read the drivers from the BRD.** Scope and objectives (01, 04), use-case count and personas (05, 07), integrations (08), business NFRs (10), Appendix § Technical Inputs (12), and any roadmap or phasing. In a phase-based BRD, the later-phase scope items count as drivers too. They inform ADR-01's extraction or consolidation trigger (`brd-to-sdd.md` § Phase-based BRDs). Technical Inputs that mandate a style are `BRD-mandated`: shown locked, not asked (an override is allowed and becomes an ADR). Cite every driver with its BRD key, even with one BRD. With several source BRDs, read the drivers from every BRD. A driver that one source BRD gives and another is silent on is not missing: the BRD that gives it is its evidence. It is missing only when no source BRD gives it. Two BRDs that mandate different styles were already asked in the cross-BRD reconciliation (`brd-to-sdd.md` § Source BRDs and lineage); show the answer as decided, with its ADR. Drivers that point different ways across BRDs count as a conflict (step 3).
2. **Pre-fill every question** with a recommended answer and its evidence (BRD chunk and ID). Use the recommendation rules below. When the BRD is silent on Q2, pre-fill it from Q1 as an assumption, with `assumption - BRD silent` as the evidence:
   - One team for an MVP or a first production release.
   - Two or three teams for a platform at scale.

   An assumed Q2 never counts as the driver that justifies a more distributed style. Under a loaded Pre-SDD, Q3, Q7, and Q8 are pre-filled as § Under a loaded Pre-SDD says.
3. **Show the proposed answers as one compact table** (question, recommended answer, evidence, one-line tradeoff), then ask ONE question:

   > **Architecture: accept the recommended answers?**
   > - **Accept all** - skip the questionnaire and use the table as shown.
   > - **Walk through the questions** - answer each one, with options and a recommendation.

   Mark **Accept all (Recommended)** when the drivers are clear and agree with each other. Mark **Walk through (Recommended)** when a driver is missing (no source BRD gives it: step 1). Mark **Walk through (Recommended)** also when two drivers point different ways (for example, an MVP scope with high-availability NFRs). Name the conflict in the option's description. An assumed Q2 counts as missing only when the next team count up (one team to two or three, two or three to four or more) would change the Q4 recommendation. Under an answer policy, the policy answers this question and the walked ones, a driver (Q1-Q3) only as step 2 records it (SKILL.md step 8, Answer policy, rule 3).
4. **Walkthrough:** ask Q1-Q4 in one AskUserQuestion call and Q5-Q8 in a second (up to 4 per call). Each question lists the recommended option FIRST, labelled "(Recommended)", with a one-line reason citing the BRD evidence. Then it lists 2-3 alternatives with one-line tradeoffs. Re-derive the recommendations for Q5-Q8 from the answers to Q1-Q4 before asking them.
5. **Record the outcome** (below), then run the ecosystem selection (step 3c) with the stack proposal adapted to the chosen style.

---

## The questions

Q1-Q3 are the **drivers**. Q4-Q8 are the **design decisions** the drivers inform.

| # | Question | Options | Evidence in the BRD |
|---|---|---|---|
| Q1 | **What stage is this release?** | MVP / proof of concept · First production release of a product that will grow · Platform at scale (many tenants, many domains, long life) | Objectives, scope, roadmap, wishlist, "pilot" / "phase 1" wording |
| Q2 | **How many teams will build and run it in the next 12 months?** | One team · Two or three teams · Four or more teams with separate release cycles | Stakeholders, delivery notes, Technical Inputs; when the BRD is silent, an assumption from Q1 (§ The flow, step 2) |
| Q3 | **What load and availability does it face?** | Modest (internal or early users; normal business hours tolerance) · Moderate with peaks · High and uneven (independent scaling of parts is needed; strict availability) | Business NFRs (10), peak scenarios, tenant and user counts |
| Q4 | **Architecture style** | Modular monolith (DDD modules, hexagonal inside, one deployable) · Hybrid (modular monolith core plus separate services for the parts that must scale, fail, or be released independently) · Microservices (one service per bounded context, own database, independent deployment) | Q1-Q3, the number and independence of bounded contexts, integration volume |
| Q5 | **How do the parts talk to each other?** | In-process calls through module ports and domain events; transactional outbox for durable cross-process effects that must follow a state change · Event-driven backbone (broker, outbox mandatory) plus synchronous REST for queries · Mostly synchronous REST (one hop at most) | Q4, integration count and direction (08), audit and replay needs |
| Q6 | **Data ownership** | One database, one schema per module, no cross-module joins · One database per service · One database per service, with a separate reporting store | Q4, reporting needs (09), data retention and compliance |
| Q7 | **Multi-tenancy model** | Shared schema with `tenant_id` · Schema per tenant · Database per tenant · Single tenant | Tenant count and size, isolation or data-residency requirements, NFRs |
| Q8 | **Deployment target** | Kubernetes with one Helm chart per deployable · Managed container service (for example, a cloud container platform) · A simple container or VM setup for an MVP | Technical Inputs, hosting constraints (on-prem vs cloud), Q1 |

---

## Recommendation rules

Start from the profile that matches Q1-Q3, then adjust per project.

| Profile | Q4 style | Q5 communication | Q6 data | Q8 deployment |
|---|---|---|---|---|
| **MVP / POC**, one team, modest load | Modular monolith | In-process ports and domain events; outbox for durable cross-process effects that must follow a state change | One database, schema per module | Simple container or managed container service |
| **First production release**, one to three teams, moderate load | Modular monolith. Hybrid only when a BRD NFR or Technical Input states a separate scaling, failure, or release need for one or two parts; an external provider integration or a notification fan-out alone does not count and becomes the extraction trigger in ADR-01 | In-process inside the monolith; event backbone with outbox between the monolith and extracted services | Schema per module; own database for each extracted service | The target the Technical Inputs or the CLAUDE.md defaults name (for example, Kubernetes with one Helm chart per deployable); else the managed container service |
| **Platform at scale**, several teams, high or uneven load | Microservices | Event-driven backbone with outbox; synchronous REST for queries, one hop at most | Database per service (plus a reporting store if reporting is heavy) | Kubernetes, one Helm chart per service |

Rules that apply to every profile:

- **Keep DDD boundaries and hexagonal structure in every style.** A modular monolith with clean module boundaries, ports, and an outbox can be split into services later at low cost. That is the main reason it is a safe default for small scopes.
- **Q7 multi-tenancy follows the platform rule** (CLAUDE.md): schema per tenant for high-volume services or modules, shared schema with `tenant_id` for low-volume ones. In a shared-schema table, every secondary index and unique key leads with `tenant_id` (the UUIDv7 primary key `id` is exempt). Recommend per module or service when volumes differ.
- **A BRD-mandated style wins** over these rules. Show it locked with its source.
- **When in doubt between two styles, recommend the simpler one** and state the extraction trigger. The extraction trigger is the measurable condition that would justify splitting the simpler style later, for example "a second team takes over billing" or "notification volume exceeds N per minute". A need for one part to scale, fail, or release on its own that no BRD NFR or Technical Input states counts as doubt.
- **Never recommend microservices only because it is the house default.** The recommendation cites at least one driver (Q1-Q3) that needs it.

---

## Effect on the SDD

| Answer | What changes in the SDD |
|---|---|
| Any | §6 Architecture Doctrine row states the style and communication model with source `questionnaire`. §8.1 Architecture Style (What / Why / How) is written from the answers. **ADR-01** records the style, the drivers, the options rejected, and the extraction or consolidation trigger. §8.3 High-Level Architecture and the §8.5 sequences are drawn from the answers (`brd-to-sdd.md` § SDD-only sections). The §6 ecosystem-level rules (EDA, DDD, hexagonal) are written in the variant for the chosen style (chunk 02). |
| Modular monolith | §13 lists **modules** (one deployable). Each `13x` chunk is a **module spec** on the same template: "service" reads as "module", Deployment Strategy points to the single deployable, and DB Modeling uses the module's schema. Chunk 10 catalogues the domain events between modules in §14.10 (In-Process Domain Events) and any integration event published through the outbox in §14.5 (the broker delivery rules apply to these only). Chunk 11 covers external integrations over HTTP. For module-to-module calls, it covers **in-process port contracts** (Type `Internal (in-process)`, §15.3). A port contract lists the port interface, operation, request and response DTOs, errors raised with their `errorCode`, permission token, and behaviour (idempotency, transaction). It has no method, URI, or headers. |
| Hybrid | §13 marks each row as `module` (in the core deployable) or `service` (separate deployable). Chunk 10 catalogues the domain events between core modules in §14.10 and the integration events between the core and each service in §14.5. Chunk 11 holds HTTP contracts between the core and each service and `Internal (in-process)` port contracts inside the core (§15.3). The extraction trigger for each extracted service is in its ADR. |
| Microservices | As the template describes: one service per bounded context, own database, HTTP contracts in chunk 11, events in chunk 10. |
| Q5, Q6, Q7, Q8 | Feed §6 rows (broker, database topology, tenancy, runtime and deployment), §11 cross-cutting defaults, the ADRs for the broker, data ownership, tenancy, and synchronous vs event-driven calls, and the ecosystem proposal in step 3c (for example, no broker row is proposed for a monolith that needs none; a mesh row is `Not applicable` for one deployable). |
| Q7, Q8 | Also feed §8.6 Infrastructure Architecture and §8.7 Network Architecture (chunk 05a). Q8 sets the deployment target; the deployables follow ADR-01 and §13. Q7 sets the tenant isolation in the data-store topology and the network policies. Both are linked there, never restated: Q8 through the §6 Compute / Infra row and its ADR, when one records it; Q7 through §11.2 and its ADR. They are two of the derivation inputs that `brd-to-sdd.md` § SDD-only sections, §8.6 / §8.7 lists. |

---

## Under a loaded Pre-SDD

When SKILL.md step 2a loaded a G3-signed Pre-SDD, its chunk 12 lock list arrives as evidence and constraints. The questions stay this SDD's own (SKILL.md principle 20):

| Question | What the Pre-SDD gives | How it is shown |
|---|---|---|
| Project Type (SKILL.md step 3a) | The classification, `PSDD/HDR-07` | Pre-filled and cited. A brownfield Pre-SDD with no codebase to extend gives Greenfield, with the migration context in §1. |
| Q3 Load and availability | Its numbers: the `PSDD/CALC-NN` values (the calculations table of its chunk 12 § 12.2, each linked to its chunk 04 anchor) and the rows its chunk 12 lands in Q3 | The Evidence column cites them as `PSDD/<ID>`. The answer stays this SDD's choice, recommended from them. |
| Q7 Multi-tenancy model | The isolation level, `PSDD/DAT-07` | Only the options the level allows are offered, and the constraint is shown under the question: `single` allows Single tenant. `shared-logical` allows Shared schema with `tenant_id`, Schema per tenant, or Database per tenant. `schema-isolated` allows Schema per tenant or Database per tenant. `database-isolated` and `deployment-isolated` allow Database per tenant. The platform rule of § Recommendation rules picks within them. When the locked isolation entry (`PSDD/DAT-07.1`) reads `TBD` or `Open`, Q7 is recorded open, waiting for that entry's owner (the Owner column of chunk 12's lock list). In that case, the multi-tenancy ADR is `Proposed` with a `[NEEDS CLARIFICATION: ...]` marker citing the entry. In that case too, Accept all still applies to the other questions and does not by itself make the walkthrough recommended. |
| Q8 Deployment target | The hosting target: cloud, on-prem, or hybrid, and a named provider only when the Pre-SDD records it as a hard constraint | The hosting target is shown locked, with source `Pre-SDD` (`PSDD/<ID>`), and is not asked. The runtime option (Kubernetes, a managed container service, or a simple container or VM setup) stays this SDD's choice, recommended within that target. |

- **Q1, Q2, Q4, Q5, and Q6 are unchanged.** The Pre-SDD gives their drivers at most, never their answers.
- **Q7 and Q8 keep feeding §8.6 and §8.7** (§ Effect on the SDD). With a loaded Pre-SDD, those sections also cite what its chunk 12 lands in §8.6 and §8.7 (`brd-to-sdd.md` § Pre-SDD inputs (locked), the §8.6 and §8.7 row).
- **An answer outside a locked value is not applied.** It becomes an open item owned by the E2E Architect (SKILL.md principle 20), and the locked value stands.

---

## Recording

- **§6 / §8.1 / ADR-01** carry the settled design in present tense.
- **`decision-log.md` § Architecture questionnaire record** carries the process:
  - accept-all or walked through;
  - the date;
  - who answered (the user, or an answer policy as `Policy: <policy> (set by <name>, <date>)`: SKILL.md step 8, Answer policy);
  - one row per question (options offered, recommended, chosen, evidence, rule home).

  An "Accept all" with every answer recommended still gets the full record (the Outcome line and one row per question), because the style is a structural decision.
- **With a loaded Pre-SDD**, the record names it: the Outcome line gives `Pre-SDD: PSDD v[X.X]`, the Evidence of Q3 cites its numbers as `PSDD/<ID>`, Q8's hosting target reads locked with source `Pre-SDD (PSDD/<ID>)`, and Q7's row names the isolation constraint, `PSDD/DAT-07`.
- **Handoff (step 9)** states the style chosen, whether it followed the recommendation, and the extraction trigger.

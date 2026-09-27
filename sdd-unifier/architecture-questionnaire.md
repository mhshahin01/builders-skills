# Architecture Questionnaire

The architecture style is not fixed in advance. When the SDD is derived from a BRD, a short questionnaire settles the system design choices first (step 3b), and the tech stack selection (step 3c) then builds on the answers. Microservices is one option among several, recommended when the drivers call for it, not by default.

---

## When it runs

| Intent | Questionnaire |
|---|---|
| DERIVE-FROM-BRD | **Runs**, before any chunk is written, after the Project Type answer (step 3a). |
| GENERATE (SoW, notes, topic seed) | Runs only when the user asks for it ("ask me about the architecture"). Otherwise the style comes from the source or is flagged `[NEEDS CLARIFICATION: ...]` in §8.1, and the ecosystem flow (step 3c) proposes it. |
| TRANSFORM (an existing SDD) | Does not run. The source SDD's architecture is kept verbatim; a mismatch with the drivers becomes an open item for the reviewer, never a silent change. |
| Brownfield (any intent) | Q2-Q6 start from the existing system's style, shown as `existing` and recommended unless a driver clearly argues for change. |

It runs once per SDD. On a resume it never reruns; a change later is a decision (an ADR plus a `decision-log.md` entry) with its impact on written chunks listed for the user.

---

## The flow

1. **Read the drivers from the BRD.** Scope and objectives (01, 04), use-case count and personas (05, 07), integrations (08), business NFRs (10), Appendix § Technical Inputs (12), and any roadmap or phasing. Technical Inputs that mandate a style are `BRD-mandated`: shown locked, not asked (an override is allowed and becomes an ADR).
2. **Pre-fill every question** with a recommended answer and its evidence (BRD chunk and ID). Use the recommendation rules below.
3. **Show the proposed answers as one compact table** (question, recommended answer, evidence, one-line tradeoff), then ask ONE question:

   > **Architecture: accept the recommended answers?**
   > - **Accept all** - skip the questionnaire and use the table as shown.
   > - **Walk through the questions** - answer each one, with options and a recommendation.

   Mark **Accept all (Recommended)** when the drivers are clear and agree with each other. Mark **Walk through (Recommended)** when a driver is missing from the BRD or two drivers point different ways (for example, an MVP scope with high-availability NFRs); name the conflict in the option's description.
4. **Walkthrough:** ask Q1-Q4 in one AskUserQuestion call and Q5-Q8 in a second (up to 4 per call). Each question lists the recommended option FIRST, labelled "(Recommended)", with a one-line reason citing the BRD evidence, then 2-3 alternatives with one-line tradeoffs. Re-derive the recommendations for Q5-Q8 from the answers to Q1-Q4 before asking them.
5. **Record the outcome** (below), then run the ecosystem selection (step 3c) with the stack proposal adapted to the chosen style.

---

## The questions

Q1-Q3 are the **drivers**. Q4-Q8 are the **design decisions** the drivers inform.

| # | Question | Options | Evidence in the BRD |
|---|---|---|---|
| Q1 | **What stage is this release?** | MVP / proof of concept · First production release of a product that will grow · Platform at scale (many tenants, many domains, long life) | Objectives, scope, roadmap, wishlist, "pilot" / "phase 1" wording |
| Q2 | **How many teams will build and run it in the next 12 months?** | One team · Two or three teams · Four or more teams with separate release cycles | Stakeholders, delivery notes, Technical Inputs; ask when the BRD is silent |
| Q3 | **What load and availability does it face?** | Modest (internal or early users; normal business hours tolerance) · Moderate with peaks · High and uneven (independent scaling of parts is needed; strict availability) | Business NFRs (10), peak scenarios, tenant and user counts |
| Q4 | **Architecture style** | Modular monolith (DDD modules, hexagonal inside, one deployable) · Hybrid (modular monolith core plus separate services for the parts that must scale, fail, or be released independently) · Microservices (one service per bounded context, own database, independent deployment) | Q1-Q3, the number and independence of bounded contexts, integration volume |
| Q5 | **How do the parts talk to each other?** | In-process calls through module ports, with domain events and an outbox for anything that leaves the process · Event-driven backbone (broker, outbox mandatory) plus synchronous REST for queries · Mostly synchronous REST (one hop at most) | Q4, integration count and direction (08), audit and replay needs |
| Q6 | **Data ownership** | One database, one schema per module, no cross-module joins · One database per service · One database per service, with a separate reporting store | Q4, reporting needs (09), data retention and compliance |
| Q7 | **Multi-tenancy model** | Shared schema with `tenant_id` · Schema per tenant · Database per tenant · Single tenant | Tenant count and size, isolation or data-residency requirements, NFRs |
| Q8 | **Deployment target** | Kubernetes with one Helm chart per deployable · Managed container service (for example, a cloud container platform) · A simple container or VM setup for an MVP | Technical Inputs, hosting constraints (on-prem vs cloud), Q1 |

---

## Recommendation rules

Start from the profile that matches Q1-Q3, then adjust per project.

| Profile | Q4 style | Q5 communication | Q6 data | Q8 deployment |
|---|---|---|---|---|
| **MVP / POC**, one team, modest load | Modular monolith | In-process ports; domain events with an outbox only for what leaves the process | One database, schema per module | Simple container or managed container service |
| **First production release**, one to three teams, moderate load | Modular monolith, or Hybrid when one or two parts have clearly different scaling, failure, or release needs (for example, an external provider integration or a notification fan-out) | In-process inside the monolith; event backbone with outbox between the monolith and extracted services | Schema per module; own database for each extracted service | Managed container service or Kubernetes |
| **Platform at scale**, several teams, high or uneven load | Microservices | Event-driven backbone with outbox; synchronous REST for queries, one hop at most | Database per service (plus a reporting store if reporting is heavy) | Kubernetes, one Helm chart per service |

Rules that apply to every profile:

- **Keep DDD boundaries and hexagonal structure in every style.** A modular monolith with clean module boundaries, ports, and an outbox can be split into services later at low cost; that is the main reason it is a safe default for small scopes.
- **Q7 multi-tenancy follows the platform rule** (CLAUDE.md): schema per tenant for high-volume services or modules, shared schema with `tenant_id` for low-volume ones; every shared-schema index includes `tenant_id`. Recommend per module or service when volumes differ.
- **A BRD-mandated style wins** over these rules. Show it locked with its source.
- **When in doubt between two styles, recommend the simpler one** and state the extraction trigger (the measurable condition that would justify splitting it later, for example "a second team takes over billing" or "notification volume exceeds N per minute").
- **Never recommend microservices only because it is the house default.** The recommendation cites at least one driver (Q1-Q3) that needs it.

---

## Effect on the SDD

| Answer | What changes in the SDD |
|---|---|
| Any | §6 Architecture Doctrine row states the style and communication model with source `questionnaire`; §8.1 Architecture Style (What / Why / How) is written from the answers; **ADR-01** records the style, the drivers, the options rejected, and the extraction or consolidation trigger. |
| Modular monolith | §13 lists **modules** (one deployable). Each `13x` chunk is a **module spec** on the same template: "service" reads as "module", Deployment Strategy points to the single deployable, and DB Modeling uses the module's schema. Chunk 10 is the domain event catalog (in-process events, plus integration events published through the outbox). Chunk 11 covers external integrations over HTTP and, for module-to-module calls, **in-process port contracts** (Type `Internal (in-process)`: interface and operation name, request and response DTOs, errors raised, authorization token; no URI or headers). |
| Hybrid | §13 marks each row as `module` (in the core deployable) or `service` (separate deployable). Chunk 11 holds HTTP contracts between the core and each service and in-process port contracts inside the core. The extraction trigger for each extracted service is in its ADR. |
| Microservices | As the template describes: one service per bounded context, own database, HTTP contracts in chunk 11, events in chunk 10. |
| Q5, Q6, Q7, Q8 | Feed §6 rows (broker, database topology, tenancy, runtime and deployment), §11 cross-cutting defaults, and the ecosystem proposal in step 3c (for example, no broker row is proposed for a monolith that needs none; a mesh row is `Not applicable` for one deployable). |

---

## Recording

- **§6 / §8.1 / ADR-01** carry the settled design in present tense.
- **`decision-log.md` § Architecture questionnaire record** carries the process: accept-all or walked through, date, who answered, and one row per question (options offered, recommended, chosen, evidence, rule home). An "Accept all" with every answer recommended still gets a one-line record, because the style is a structural decision.
- **Handoff (step 9)** states the style chosen, whether it followed the recommendation, and the extraction trigger.

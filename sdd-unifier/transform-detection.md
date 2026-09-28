# Intent Detection — Generate / Transform / Derive-from-BRD

The skill operates in one of three intents. This file gives the rules for deciding which.

The user almost never says "I want intent X" explicitly. The skill must infer intent from the input.

---

## The decision tree

```
Is there a source document attached, pasted, or referenced by path?
├── No  → GENERATE (from conversation / topic seed)
└── Yes → Inspect the source:
         ├── Source is one or more BRDs (chunked folders OR combined files)?
         │   → DERIVE-FROM-BRD (see brd-to-sdd.md); several BRDs = one SDD with several parents
         ├── Source already follows this SDD template structure?
         │   ├── Yes (single-file form, target is chunks)  → TRANSFORM (re-chunk)
         │   ├── Yes (chunked form, target is combined)    → TRANSFORM (merge)
         │   └── Yes, both forms match target              → TRANSFORM (refresh / regenerate)
         ├── Source is a SoW / Statement of Work?
         │   → GENERATE (treat SoW as input context, not as a document to transform — SDDs are not produced from SoWs directly; if there's no BRD yet, suggest running brd-unifier first)
         ├── Source is a different SDD format (Word doc, IEEE 1016, vendor template, prior in-house format)?
         │   → TRANSFORM (cross-template migration)
         ├── Source is architecture notes / RFC drafts / design memos?
         │   → GENERATE (treat as raw context)
         └── Source is meeting notes / Slack thread?
             → GENERATE (raw context, don't try to transform conversational material)
```

---

## Recognising source types

### BRD (chunked folder OR combined file)

This is the high-value path. Recognise it by:

**Chunked folder signs:**

- Path is a folder ending in `brd-*` (the brd-unifier output convention).
- Contains files with names like `00-cover-and-changelog.md`, `01-executive-summary-and-context.md`, `02-glossary-assumptions-facts.md`, `03-definitions-and-domain-concepts.md`, `04-scope-and-personas.md`, `05-user-journeys-overview.md`, `06a-use-cases-*.md`, `07-users-use-cases-matrix.md`, `08-integrations.md`, etc. (Legacy BRDs: `05-fr-overview.md`, `06a-fr-*.md`, `07-integrations.md`.)
- Each file starts with `<!-- CHUNK: NN ... PART OF: BRD — ... -->`.

If 4+ of these match, it's a brd-unifier chunked output.

**Combined file signs:**

- Filename starts with `BRD-` (e.g., `BRD-WalletManagement-v1.0.md`).
- Has the BRD section structure: Executive Summary, Background, Business Objectives, Glossary, Assumptions / Constraints, Facts, Challenges, Dependencies, Definitions & Important Details, Project Scope, Personas, User Journeys & Use Cases (UC blocks with `Actor & Goal / Why / Preconditions / Main Flow / Alternate & Exception Flows / Business Rules / Acceptance Criteria / Future Enhancements / UI/UX`), Users & Use Cases Matrix, Integrations, Reporting, NFRs, Summary, UI/UX Expectations, Appendix, Wishlist. (Legacy BRDs: Functional Requirements with `What/Why/How` blocks and a Technical Implementation Expectations section.)

If 5+ of these section names are present in template order, it's a BRD. (Multiple of these match the section names regardless of authoring tool — the structure is what matters, not the filename.)

In either case → **DERIVE-FROM-BRD**. Read the BRD per `brd-to-sdd.md` § Detecting BRD input form.

**Several BRDs.** Detect each one on its own. When they describe one system (for example, the products of one platform, or a phase-2 BRD for an existing product), they are the parents of one SDD: each is registered with a key and they are reconciled against each other (`brd-to-sdd.md` § Source BRDs and lineage). When it is unclear whether they describe one system or separate systems, ask once: "One SDD with these BRDs as parents, or one SDD per BRD?"

### Already follows this SDD template

Signs:

- Section headings include §1 Executive Summary, §6 Ecosystem Overview, §7 System Users & Use Cases, §8 System Design / High-Level Architecture, §11 Cross-Cutting Concerns, §13 Services Decomposition, §14 Centralized Event Hub, §15 Service Integration API Contracts, §16 Centralized User Roles, §17.X per-service blocks, §18 Performance & Capacity, §20 Operations Runbook (the earlier map used §15.X services, §17 performance, §19 runbook, and no API contracts section, see `chunking.md` § Earlier chunk map; legacy SDDs use §13.1/§13.2.X services, §14 performance — recognise all three).
- Per-service blocks use `Boundaries / Input / Business Logic / Output / Integrations / DB Modeling / API Standards / Event Model / Constraints / Error Handling / Observability / Compliance / Deployment Strategy`.
- Has a Changes Log with Reviewer + Approver columns.

If 5+ of these match → "already follows this template". Work is reformat / regenerate / migrate.

### SoW / Statement of Work

Signs:

- Section headings include `Scope of Work`, `Vendor Responsibilities`, `Deliverables`, `Commercial Terms`.
- Tone uses "The Vendor shall...", contractual passive constructions.

**Important:** SoW → SDD is **not** a direct path in this skill. SDDs are technical design artefacts that depend on architectural decisions; SoWs don't have those. If the user gives you only a SoW and asks for an SDD:

1. Tell them clearly: "An SDD usually derives from a BRD, not directly from a SoW. The BRD captures the requirements (and is the source of truth for what the system does); the SDD captures the technical design (how to build it). Want me to first generate a BRD using brd-unifier, then derive the SDD from it? Or proceed with a fresh-generate SDD using the SoW as raw context but expect heavy `[NEEDS CLARIFICATION: ...]` markers?"
2. If they choose option A (BRD first), the work is bigger than this skill — defer to brd-unifier for the BRD step.
3. If they choose option B (proceed anyway), treat the SoW as raw context for GENERATE intent, not as a transformation target.

### Different SDD format

Signs:

- Has SDD-like content (architecture, services, NFRs, deployment) but section names or order don't match the template.
- Common offenders: IEEE 1016 SDD style, TOGAF deliverables, vendor templates, in-house "HLD" formats from a previous role.
- Often missing one of: Risks (with likelihood/impact), Cross-cutting Concerns defaults table, Operations Runbook, Per-service detailed spec block.

Re-architect into this template's section order. Carry every fact across; flag every gap that this template demands but the source doesn't have. See `source-transformation.md`.

### Architecture notes / RFC drafts / design memos

Signs:

- Single-topic depth (e.g., "Why we picked Kafka over RabbitMQ"), not full system coverage.
- May follow an RFC template (Context / Decision / Consequences) — short.
- Author-voice rather than team-voice.

Treat as raw context for GENERATE. Lift specific decisions into §10 Architectural Decisions; lift specific tech choices into §6 Ecosystem Overview. The rest of the SDD is generated fresh.

### Meeting notes / Slack thread / email chain

Same as brd-unifier rules: do NOT treat as a transform target. Treat as raw context for GENERATE.

---

## What "transform" actually means

Transform is not "copy the source verbatim into the new shape". It is:

1. **Read the source completely.**
2. **Classify each piece of content into a target template section.**
3. **Paraphrase to fit voice and audience.** Vendor templates are vendor-facing; this template is team-facing.
4. **Preserve verbatim what must be verbatim.** Numbers, dates, version pins, named technologies, named systems.
5. **Flag every gap.** Source won't cover every section. Missing items become `[NEEDS CLARIFICATION: ...]` markers.
6. **Never invent.** No imagined RPS targets. No invented technology choices. No fabricated SLAs.

---

## What "derive-from-BRD" actually means

Derive is a **structured partial fill** — the BRD has some content the SDD needs, but the SDD has many sections the BRD doesn't cover.

1. Read the BRD fully.
2. Apply the field mapping in `brd-to-sdd.md` to fill BRD-derivable sections.
3. For SDD-only sections, produce the heading + structure + a focused `[NEEDS CLARIFICATION: ...]` marker naming the specific decision the architect must make. Examples:
   - "API style" → `[NEEDS CLARIFICATION: REST, gRPC, or GraphQL for <service>? The architecture questionnaire leaves it open.]`
   - "Multi-Tenancy default" → `[NEEDS CLARIFICATION: shared schema with tenant_id, schema-per-tenant, or DB-per-tenant? CLAUDE.md default is schema-per-tenant for high-volume services, shared-schema with tenant_id for low-volume. Confirm or override per service.]`
   - "Per-service Throughput Targets" → `[NEEDS CLARIFICATION: sustained RPS, peak RPS, p50/p95/p99 latency targets per service. Not derivable from the BRD's NFRs alone — needs architect input.]`
4. Apply CLAUDE.md defaults where they fit (Java 21, Spring Boot 3.5+, PostgreSQL 17+, UUIDv7, Kafka, Keycloak, Angular 17+ standalone). The architecture style comes from the architecture questionnaire (SKILL.md step 3b, `architecture-questionnaire.md`), which always runs for this intent. Note in the Ecosystem Overview that these are defaults and can be overridden.
5. The output is intentionally an architect-ready skeleton, not a finished SDD.

See `brd-to-sdd.md` for the full mapping table.

---

## Edge cases

### "Update this SDD" (existing SDD with light changes requested)

Treat as TRANSFORM with targeted regeneration:

- Identify which sections the user wants changed.
- Regenerate only those (chunks: rewrite affected chunk files; combined: rewrite affected sections in place).
- Bump the version in the Changes Log.

### "Make a new service spec for [Service Name] in this SDD"

Treat as TARGETED ADD:

- In CHUNKS mode: add a new `13x-service-[slug].md` chunk (next free letter) and update the §13 Services Decomposition table in chunk 09, and wire the service into the §14 event catalog (chunk 10) if it publishes or consumes events.
- In COMBINED mode: insert a new `## 17.X` block in section 17 and update the §13 table (and the §14 event catalog if the service publishes or consumes events).
- Bump the version in the Changes Log.

### Source is in a non-English language

Translate facts, preserve names. Flag in the handoff summary.

### Source mixes BRD content with SDD content (e.g., "Combined BRD+SDD" doc from a vendor)

Read both halves. The BRD half feeds DERIVE-FROM-BRD logic; the SDD half feeds TRANSFORM logic. Produce one SDD output, not two artefacts. Surface in the handoff summary that you separated the two intents from the same source.

---

## When the detection is genuinely ambiguous

Ask exactly one question:

> Is this material **a BRD I should derive an SDD from** (I'll auto-fill BRD-derivable sections and flag SDD-only ones for your decisions), **an existing SDD I should reformat** (I'll re-shape it into your template), or **raw context for a fresh SDD** (I'll author from scratch using it as background)?

Do not guess silently when the answer materially changes the output.

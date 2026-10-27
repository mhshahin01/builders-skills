# Proposed Enhancements for Unifier Agents (SDD & LLD): Execution Prompt

> **Executed:** this is the change set as received; it was executed on branch `feat/sdd-lld-enhancements` and merged on 2026-10-27. Its status lines below are the original text.

> **Status:** Draft for review. Nothing in `C:\Users\negat\.claude\skills` has been changed yet.
>
> **How to run:** after review, start a fresh agent session in `C:\Users\negat\.claude\skills` and say: "Execute `C:\Users\negat\Downloads\Quick Enhancements\proposed_enhancements_for_unifier_agents.md`. Follow it exactly."

---

## 1. Role and goal

You are editing the unifier skills in `C:\Users\negat\.claude\skills`. Implement every change in § 5, in the order of § 6. Verify with § 7. Report with § 8.

In scope: `sdd-unifier` and `lld-unifier`; references to them in other skills and in the READMEs; `_fixtures/checkers` (scripts and tests); `_fixtures/README.md`; the shared-rules location chosen in step P1.

---

## 2. Hard constraints

1. **Read before you write.** Read `SKILL.md`, `chunking.md`, `README.md`, and every file a change names, in full, before editing it.
2. **Ask, do not guess.** When the skill text contradicts this prompt, or a fact you need is missing, stop and ask the user with AskUserQuestion: recommended option first, one-line tradeoff per option.
3. **Keep IDs and numbers stable.** Never renumber or rename an existing chunk file or section number. New chunks use a letter suffix (`03a`, `05a`) or the next free number.
4. **Templates move together.** A structural change updates, in the same step: `chunks/*.md`, `TEMPLATE-COMBINED.md`, `chunking.md` (canonical map, heading map, merge rules), the master skeleton, `README.md`, and every other file that lists chunks.
5. **One fact, one home.** New content links its source section. It never restates it. This is an existing principle in both skills.
6. **House style.** Plain declarative sentences, one idea each. Tables for rules. No em dashes (`_linkcheck.py` flags them). Every new numbered chunk starts with the self-describing header comment block and ends with the `MASTER | PREV | NEXT` footer.
7. **No invented facts.** Do not invent library APIs, versions, or provider details. A library that neither SDD §6 nor the project rules name is marked `proposed; needs approval when the project's rules reserve new dependencies` (the existing LLD convention).
8. **Fixtures.** Never edit the frozen runs under `_fixtures/chain/` or `_fixtures/scenarios/`. Checkers and their tests may change. Checkers stay Python standard library only.
9. **Git and CI.** Do not touch `.github/`. Do not run `git commit` or `git push`. Leave every change uncommitted for review.
10. **Legacy documents keep working.** An SDD or LLD written before this change must still pass the checkers and still resume, update, and refresh. On a later request, the skill does what was asked, then offers once to add the new sections. It never adds them silently.

---

## 3. Decisions already taken (do not re-ask)

| # | Topic | Decision |
|---|---|---|
| D1 | SDD eco-system chunk | Upgrade `02-ecosystem-overview.md` (§6) in place. Keep its file name and section number. No new eco-system chunk file. |
| D2 | Import file | `[project-slug]-eco-system.md`: one per project, in the project root (the folder that holds the `brd-`, `sdd-`, and `lld-` folders). `[project-slug]` is the SDD's project slug. |
| D3 | LLD override of the SDD stack | The LLD records the override as an approved deviation, not drift. The SDD is not edited. The LLD handoff tells the user which SDD §6 rows to update through sdd-unifier. The LLD keeps its rule: its only write outside its own folder is its Child LLDs row. |
| D4 | HTTP clients | `RestClient` for synchronous calls (the default in Spring MVC services). `WebClient` for reactive or non-blocking calls. `RestTemplate` never in new code. |
| D5 | DTOs | Java records, not classes. |
| D6 | LLD libraries chunk | New chunk `03a-libraries-and-conventions.md`, section §6.5, right after chunk 03. Chunk 03 keeps §6.3 Runtime Stack. |
| D7 | SDD infrastructure and network | New chunk `05a-infrastructure-and-network.md` with §8.6 Infrastructure Architecture and §8.7 Network Architecture. Written in part 1. |
| D8 | Deck (PPT) chunks | SDD `20-for-ppt.md`, LLD `19-for-ppt.md`. Deck brief only, no video series. Gated like brd-unifier chunk 17: the SDD deck needs the E2E gate open and chunk 19 written; the LLD deck needs chunk 18 cleared. Excluded from merge and combined output. Never written in a light run. |

---

## 4. Background: what the skills do today

Check each fact against the files before relying on it.

- **SDD stack selection.** sdd-unifier step 3c (Ecosystem selection) assembles a proposed §6 table. Precedence per row: BRD Technical Inputs (`BRD-mandated`) > project defaults (the project instruction file, else the principle 8 stack defaults) > recommendations informed by the BRDs. In TRANSFORM, `source SDD` rows are locked. One question: Accept all, or Walk through item by item (grouped batches a-h). The outcome lands in chunk 02 (Notes column) and in `decision-log.md` § Ecosystem selection record.
- **SDD body gaps.** The SDD has no network-architecture content. Infrastructure appears only as §6 rows, §11.3 Deployment, and §19 Environments (one DNS naming line).
- **SDD gate.** Chunk 19 (E2E) is written only when the E2E gate (E1-E4, step 8b) is open.
- **LLD stack.** lld-unifier step 3a takes the stack from SDD §6 without asking. A value that differs from SDD §6 is drift (`sdd-to-lld.md` § One fact, one home, rule 3). Principle 10 applies CLAUDE.md defaults when the source is silent, and the from-sdd bullets say "Apply CLAUDE.md defaults aggressively". §6.3 Runtime Stack and 17-specs Tech Stack mirror SDD §6.
- **LLD libraries.** No libraries chunk exists. A few libraries are named inline: Resilience4j and OpenTelemetry in chunk 09, Jest and Angular Testing Library in chunk 13, `@angular/localize` in chunk 14. `pattern-rules.md` § Anti-patterns to flag reports "DTO classes (not records)" as a `⚠ policy` finding in §18.6.
- **Deck brief model.** brd-unifier `chunks/17-for-ppt.md` part A and `delivery-chunks.md` (§ Chunk 17, § COMBINED mode adaptations) define the format: a status line, a Design standard line, Deck settings, Instructions for the deck-generating agent, and `SL-NN` slides (title, key message, talking points, suggested visual, sources, status).
- **Runtimes.** The `~/.agents/skills` junctions link only the five skill folders (`_fixtures/README.md`). A file outside those folders is not linked there, so runtimes that load skills from there may not see it.
- **Fixtures.** `_fixtures/README.md` § How to run lists every checker command and the regression suites. With `$R` set to the FC baseline (`_fixtures/chain/run-2026-10-13-fc`), every checker reports 0 problems and 0 notes. The S3 scenario line keeps its known TD-88 problem.

---

## 5. Change set

Each change states: what is wrong today, what must be true after, where to change it, and how to check it.

### SDD-1. Eco-system selection: proposed defaults, three paths, import file

**Today.** Step 3c offers Accept all or Walk through. Defaults are not visibly marked as proposals. There is no way to load the stack or the integration specs from a file.

**Required.**

1. **Proposed values are marked.** In the selection table, every value that no mandate locks is labelled **Proposed**, with its basis: `project default`, `skill default`, or `recommended (evidence)`. Locked rows are labelled **Locked**, with their source: `BRD-mandated (KEY)`, `source SDD`, or `questionnaire`.
2. **Detect the import file.** Before asking, look for `[project-slug]-eco-system.md` in the project root. If that exact file is missing and exactly one `*-eco-system.md` file exists there, offer it by name. Never pick a file silently.
3. **One question, three paths** (AskUserQuestion):
   - **Accept all proposed:** confirm the table as shown. Recommended when no import file exists and the drivers are clear.
   - **Answer one by one:** the existing grouped walkthrough (step 3c item 4), unchanged.
   - **Import from `[project-slug]-eco-system.md`:** recommended when the file exists. When no file was found, this option asks for a path.
4. **Import rules.**
   - Rows the file states become **Confirmed**, with source `eco-system file`.
   - A file value that conflicts with a **Locked** row (`BRD-mandated`, `source SDD`, `questionnaire`) is asked, one conflict at a time. Never resolve it silently. An answer that overrides a BRD mandate gets an ADR, as today (step 3c item 5).
   - Rows the file does not cover keep their **Proposed** values. Ask once: accept the remaining proposed values, or walk through them.
   - The file's integration specs are a source document. Apply each fact where it lives: chunk 08 §12 rows (protocol, auth, rate limits, provider timeouts); chunk 11 §15 provider-owned fields of the matching external `API-NN` contracts (cite the file and section as the Source document, set Status `Defined`, remove the `TBD - EXTERNAL` marker, update §15.6); §8.7 for network access (SDD-3). These chunks are written after step 3c, so record the file on the master's Source line and read it when each chunk is written.
   - Never fill a provider field the file does not state (the existing step 10 rule).
5. **Precedence (step 3c item 1).** The eco-system file joins BRD Technical Inputs at the top tier. A conflict between the two is asked. Below them, unchanged: project defaults, then the principle 8 stack defaults, then recommendations.
6. **Chunk 02 (§6) table.** Columns become `Layer | Technology / Service | Version / Tier | Status | Source | Notes`.
   - Status: `Confirmed` or `Proposed`.
   - Source: `BRD-mandated (KEY)`, `eco-system file`, `source SDD`, `questionnaire`, `project default`, `skill default`, `recommended`, `user choice`, or `user override (ADR-NN)`.
   - A finished first build has no `Proposed` row. A row added by a later update stays `Proposed`, with a `[NEEDS CLARIFICATION: ...]` marker, until the user confirms it.
7. **Integration landscape in chunk 02.** After **Ecosystem-level rules**, add a block **Integration landscape**: a bold label like the existing block, not a new numbered heading, so no anchor changes. One row per external system of the eco-system: System, Owner (role), Role in the eco-system, Interface style, Spec source (file and section, or `Awaiting`), link to its §12 row. Protocol, auth, timeouts, and contract fields stay in §12 and §15. They are linked, never repeated.
8. **Eco-system file template.** Add `eco-system-template.md` in the location chosen in P1 (default: `sdd-unifier/`):
   - **Header:** project, version, date, author, status.
   - **Part A, Tech stack:** the §6 columns `Layer | Technology / Service | Version / Tier | Notes`; `Not applicable` allowed.
   - **Part B, Ecosystem rules (optional):** rules in the style of §6 Ecosystem-level rules.
   - **Part C, Integration specs:** one block per external system: name; owner (role); purpose; protocol and style; auth scheme and credential type; environments and base URLs (Dev, SIT, UAT, Prod); spec reference (OpenAPI, WSDL, or document link); rate limits and quotas; availability or SLA; provider timeouts; error model; network access (VPN, IP allow-list, private link); data formats; sandbox availability; notes.
   - The import validates the file against this template. Missing required fields are reported in one list before anything is applied. The user chooses: fix the file, or continue without those fields.
9. **Records and handoff.**
   - `decision-log.md` § Ecosystem selection record: add the Outcome value `Imported from [file] ([date or version])`, plus one row per conflict asked and per remaining row walked through or accepted.
   - Step 9 handoff, line "Ecosystem selection outcome": add the path taken, the file used, rows imported, proposed rows accepted, overrides, and conflicts asked.
10. **Later updates.** Add a step 10 row for "import the eco-system file" and "the eco-system file changed". Re-read the file, list each changed row and spec, and apply them after the user confirms. Then follow the existing update tail: step 6a when chunks 09-13x change; chunk 19 marked `Stale` when a chunk from 02 to 13x changes.
11. **Legacy SDDs.** A §6 table without Status and Source columns is read as it is. On the next targeted update, offer once to upgrade it.

**Files.** sdd-unifier: `SKILL.md` (principle 8, step 3c, step 9, step 10, Reference files); `chunks/02-ecosystem-overview.md`; `TEMPLATE-COMBINED.md` §6; `chunking.md` row 02; `brd-to-sdd.md` (the §6 derivation rules); `decision-log.md`; `sdd-quality.md`; `chunks/08-integrations.md` and `chunks/11-api-contracts.md` (Source document guidance); `README.md`; new `eco-system-template.md`. lld-unifier: `sdd-to-lld.md` and `chunks/03-architecture.md`, which read §6 rows.

**Done when.**
- Each of the three paths runs in a proof run (§ 7), and chunk 02 shows Status and Source on every row.
- An import with one planted conflict asks exactly that conflict, and nothing already decided.
- An import with integration specs fills only the provider fields the file states; §15.6 lists the rest.
- The FC baseline still passes every checker, with its legacy §6 table.

### SDD-2. Follow every project-file rule; alert on conflicts

**Today.** sdd-unifier reads the project instruction file (`AGENTS.md`, or `CLAUDE.md` if present) mainly for stack defaults.

**Required.** Model this on brd-unifier principle 16.
- Before any generation, transform, refresh, or deck chunk, read the project root's `AGENTS.md` (or `AGENT.md`, or `CLAUDE.md`) and `ui-ux-global-constitution.md` when they exist. Never ask for a file the project does not have.
- Follow every rule and convention they state across the whole SDD, not only the stack.
- When a project file conflicts with the source (a BRD, a source SDD, an eco-system file) or with another chunk, do not pick one: raise an `OI-NN`.
- Say in the handoff which project files were found and used.

**Files.** sdd-unifier `SKILL.md` (core principles, step 3, step 3c item 1, step 9), `brd-to-sdd.md`, `sdd-quality.md`.

**Done when.** A proof run with a planted project-file rule that conflicts with a BRD Technical Input raises one `OI-NN`, and the handoff names the project files used.

### SDD-3. Infrastructure and network architecture (new chunk 05a)

**Today.** No section holds the infrastructure topology or the network design, so a deck cannot cover them without inventing content.

**Required.**
1. New chunk `chunks/05a-infrastructure-and-network.md`. It starts with `## 8.6 Infrastructure Architecture`, the way chunk 05 starts with `## 8.4`. No existing section number changes.
2. **§8.6 Infrastructure Architecture.** Deployment target and topology, from ADR-01 (questionnaire Q8) and the §6 rows, linked, not restated: clusters, regions or sites, availability zones, node pools, deployables per environment; data-store, broker, and storage topology; backup and disaster recovery (RPO and RTO from the BRD NFRs, else a marker); scaling model. One Mermaid deployment diagram (a flowchart with subgraphs) with its 1-2 sentence Summary.
3. **§8.7 Network Architecture.** Network zones (public, DMZ, application, data, management); the ingress path (DNS, CDN or WAF, load balancer, API gateway, services); egress to each external system (NAT, IP allow-list, VPN, or private link), linked to its §12 row; TLS termination and mTLS points; service-to-service network policies; administrative access; a ports and protocols table. One Mermaid network diagram with its Summary.
4. **No invention.** Never invent IP ranges, CIDRs, hostnames, or vendor products. An unknown fact gets a `[NEEDS CLARIFICATION: ...]` marker.
5. **Parts.** Chunk 05a belongs to part 1 (chunks 00-09). Add it to the part 1 checklist in `parts-mode.md`.
6. **Gates.** Chunk 05a is body (chunks 00-17), so the E3 marker inventory and the E4 content hash include it. Confirm `_e2e_gate.py` selects `05a` in file-name order, as it does for `13x`.
7. **Derivation inputs.** BRD NFRs (availability, DR, data residency); BRD Technical Inputs (hosting); BRD integrations; questionnaire answers Q7 (tenancy isolation) and Q8 (deployment target); the eco-system file (network access per system).
8. **Legacy SDDs.** An SDD without 05a stays valid. On the next targeted update, offer once to add it.

**Files.** sdd-unifier: new `chunks/05a-infrastructure-and-network.md`; `TEMPLATE-COMBINED.md` (§8.6 and §8.7 after §8.5); `chunking.md` (canonical map; skip rules: never skipped, short when the deployment is simple); `chunks/sdd-master.md` (index, dependency graph, reading order); `chunks/00-cover-and-changelog.md` (table of contents); `parts-mode.md`; `brd-to-sdd.md`; `architecture-questionnaire.md` § Effect on the SDD (Q7 and Q8 feed §8.6 and §8.7); `mermaid-diagrams.md` (the two diagram types); `sdd-quality.md`; `modes.md`; `README.md`. lld-unifier: `sdd-to-lld.md` field mapping (SDD §8.6 and §8.7 feed LLD §6.2 Deployment Topology, by link) and the §6.2 Source cells in `chunks/03-architecture.md`.

**Done when.** A part 1 proof run writes 05a with both diagrams; every unknown fact is a marker; `check_mermaid.py` reports 0 issues (ask the user whether the §8.6 and §8.7 views join the §8.3 size-guideline exemption); the FC baseline still passes.

### SDD-4. Architecture deck brief (`20-for-ppt.md`)

**Today.** The SDD has no presentation brief.

**Required.**
1. New chunk `chunks/20-for-ppt.md`, modelled on brd-unifier `chunks/17-for-ppt.md` part A. Keep the status line, Design standard line, Deck settings, Instructions for the deck-generating agent, and the `SL-NN` slides (title, key message, 3-5 talking points, suggested visual, sources, status). Drop part B (videos).
2. **Focus.** Four areas, each with one or more slides:
   - **System design and architecture:** style and drivers (§8.1, ADR-01), principles (§9), system context (§8.2 or §24.2), layered architecture (§8.3 or §24.3), service or module landscape (§13 or §24.1), technology eco-system (§6).
   - **Infrastructure architecture:** §8.6.
   - **Network architecture:** §8.7.
   - **Integration architecture:** external integrations (§12); synchronous contracts at a glance (§15.2 counts by type and status); the event backbone and fan-out (§14.2, §24.4, §24.5); the one-hop rule (§24.7).
3. **Frame.** A title slide first. Key decisions and open points (§10 ADRs, chunk 18 Resolution Log), then next steps (Child LLDs, §19), last. Optional, only when material: key flows and sagas (§8.4, §8.5, §24.8); cross-cutting concerns (§11); NFR targets (§18.5).
4. **Gate.** Written only when the E2E gate reads `Open - Up to date` and chunk 19 exists. No override. Gate shut: write nothing, set the master's Deck brief line to `Locked` (or `Stale` when the chunk exists), and list what is open.
5. **Refresh.** A change to any chunk the deck cites, or a new or reopened OI, marks the deck `Stale`. It is refreshed only through the gate.
6. **Faithfulness.** Every claim, count, and name traces to a cited section. Counts are computed from the SDD, never estimated, and name their source table. Slides summarise and cite; they never restate a registry table.
7. **Design standard.** The project's `ui-ux-global-constitution.md` color and typography tokens, by name, when it exists. Otherwise the source BRD's chunk 11 Primary Color. Otherwise `Recommendation:`, asked in the handoff. A logo is optional and never invented.
8. **Exclusions.** Not merged into the combined SDD. Outside the E3 body and the E4 hash. Not an input to lld-unifier. Never written in a light run. In COMBINED mode it is a separate file in `./sdd-[project-slug]/` that links to the combined file (mirror brd-unifier `delivery-chunks.md` § COMBINED mode adaptations).
9. **Master and handoff.** The master gets a **Deck brief** line (`Locked` / `Up to date` / `Provisional (OI-NN)` / `Stale`) under the E2E gate line. The step 9 handoff reports the deck state and its slide count.

**Files.** sdd-unifier: new `chunks/20-for-ppt.md`; `SKILL.md` (a new step after 8b, § Light run, step 9, a step 10 row for "make the deck brief" and "refresh the deck", Reference files); `chunking.md` (canonical map, merge exclusion); `chunks/sdd-master.md`; `parts-mode.md` (after chunk 19); `modes.md`; `README.md`; the deck rules, in the P1 location.

**Done when.** With the gate shut, a deck request writes nothing and lists the open conditions. With the gate open, the deck is written, every source link resolves, every count matches its source table, and `check_versions.py` and `check_e2e.py` treat chunk 20 as excluded.

### LLD-1. Stack approval at LLD time, with customer overrides

Merges the earlier item "Dynamic Tech Stack Proposals (No Hard-coding)".

**Today.** Step 3a takes the stack from SDD §6 without asking. CLAUDE.md defaults fill silent rows and are applied "aggressively" in from-sdd. Any difference from SDD §6 is drift.

**Required.**
1. **Defaults are proposals.** A default is a final decision only when SDD §6 confirms it or the project instruction file states it. Rewrite principle 10 and the from-sdd bullet "Apply CLAUDE.md defaults aggressively" to: apply the confirmed stack and rules.
2. **One approval table** in step 3a, before generation:
   - **Group A:** the runtime stack from SDD §6. Each row is labelled `SDD §6` and offered as the default.
   - **Group B:** LLD-level defaults that neither SDD §6 nor the project rules pin (build tool, cache, and the §6.5 rows of LLD-2). Each row is labelled **Proposed**.
   - Rows the project instruction file states are labelled `Project rule` and are not re-asked. Overriding one needs an explicit decision, recorded like any override.
3. **One question, three paths** (AskUserQuestion):
   - **Approve all:** every row confirmed as shown. Recommended.
   - **Change one by one:** grouped batches of up to 4 questions per call, as in sdd-unifier step 3c item 4. Each question lists the current value first, labelled "(Recommended)", then 2-3 alternatives with one-line tradeoffs.
   - **Replace all:** the user supplies a full stack, as a pasted list or a file in the `eco-system-template.md` format. Compare it with SDD §6 and show every difference in one table for confirmation.
4. **Overrides are approved deviations, not drift.** For each row that differs from SDD §6 by this decision:
   - Its §6.3 Runtime Stack Source cell reads `Customer decision, overrides SDD §6 <layer>`, linked to its decision-log entry.
   - It has a decision-log entry (LLD-3): layer, SDD value, new value, decider, date, reason, chunks affected.
   - The drift checks skip it: `sdd-to-lld.md` § One fact, one home, rule 3; the 17-specs Tech Stack cross-check; the step 7 reviewer brief (Specs-body mismatch); `hybrid-drift.md`, which compares the code with the override value.
   - 17-specs Tech Stack uses the approved stack. An overridden bullet ends with `(override of SDD §6; see the decision log)`.
   - The SDD is not edited (D3). The step 8 handoff lists each override and gives the exact request for sdd-unifier: "Update SDD §6 rows <layers> per the overrides in LLD <slug> decision log <links>".
5. **Later runs.** Confirmed rows are never re-asked. When SDD §6 now equals an override value, remove the override note and close its decision-log entry as `Adopted by SDD vX.X`. When SDD §6 changed a row the LLD overrides, ask: keep the override, or take the new SDD value.
6. **Direction scope.** The approval runs for from-sdd, and for services not yet built in hybrid or partial runs. In from-code and hybrid, the stack is read from the manifests as today. A difference from SDD §6 stays a drift marker in hybrid, unless the user records an override.

**Files.** lld-unifier: `SKILL.md` (principles 10 and 13; step 3a; step 4; FROM-SDD bullets; step 6b item 2; step 7 reviewer brief; step 8; § Things this skill never does); `sdd-to-lld.md` (§ Specs ownership & synthesis, § One fact, one home, field mapping); `chunks/03-architecture.md` (§6.3 Convention note); `chunks/17-specs.md`; `hybrid-drift.md`; `pattern-rules.md`; `lld-quality.md`; `README.md`.

**Done when.** A from-sdd proof run with Approve all writes no override. A run with one override records it in §6.3, the decision log, and 17-specs; raises no drift item for it; leaves the SDD unchanged except the Child LLDs row; and names the override in the handoff.

### LLD-2. Libraries and coding conventions chunk (`03a`, §6.5)

**Today.** Library choices are scattered and implicit, for example whether services call APIs with `RestClient`, `WebClient`, or `RestTemplate`.

**Required.**
1. New chunk `chunks/03a-libraries-and-conventions.md`, starting with `## 6.5 Libraries & Coding Conventions`. In COMBINED mode it is §6.5 under `# 6. Architecture Overview`.
2. **§6.5.1 Libraries by concern.** Columns: `Concern | Use | Instead of | Why (one line) | Scope | Source | Status`. Status is `Approved` or `Proposed - needs approval`. Seed rows:
   - HTTP client, synchronous: `RestClient` instead of `RestTemplate`. The default in Spring MVC services.
   - HTTP client, reactive or non-blocking: `WebClient` instead of `RestTemplate`. In a Spring MVC service it adds the WebFlux starter, a new dependency, so it is `Proposed - needs approval` unless SDD §6 or the project rules name it.
   - DTOs: Java records instead of classes.
   - Other rows only from the defaults and libraries the skill already names (principle 10; chunks 09, 13, 14) and from the project instruction file. Every other library is `Proposed - needs approval`.
3. **§6.5.2 Coding conventions (clean code).** Columns: `Rule | Do | Don't | Applies to | Source | Enforced by`. Seed only from rules the skill already states (principle 10, `pattern-rules.md`, chunk 02 §5.5, chunks 09, 13, 14) and from the project instruction file. Examples: constructor injection only; records for DTOs; the package layering, or the hexagonal layout SDD ADR-01 requires; UTC for all datetimes; UUIDv7 primary keys; Problem Details errors; idempotency keys on write endpoints that touch money, wallets, notifications, or external providers; the test naming rule; Angular standalone components, signals, OnPush, strict TypeScript. `Enforced by` names a tool only when the tool is approved; otherwise `review`.
4. **§6.5.3 Per-service deltas.** Rows only where a service departs from §6.5.1 or §6.5.2, each with its reason.
5. **Use.** Chunk 04 files cite §6.5 rows instead of restating them. `pattern-rules.md` links its "Records for DTOs" rule to §6.5.
6. **Approval.** The §6.5 seed rows are Group B of the LLD-1 approval table.
7. **Code-reading directions.** Fill §6.5.1 from the detected dependencies. Extend the code-explorer brief in `agent-orchestration.md` to report the HTTP clients and the DTO style in use. A use that breaks an approved §6.5 row is a `⚠ policy` finding in §18.6, in every direction that reads code (`pattern-rules.md` § Anti-patterns to flag). Add an anti-pattern row for `RestTemplate` in new code.
8. **Legacy LLDs.** An LLD without 03a stays valid. On the next targeted update, offer once to add it.

**Files.** lld-unifier: new `chunks/03a-libraries-and-conventions.md`; `TEMPLATE-COMBINED.md` (§6.5 after §6.4); `chunking.md` (canonical map, heading map); `chunks/lld-master.md` (index; dependency graph: 03a depends on 03 and SDD §6, 04 depends on 03a); `chunks/04-implementation-template.md` (citations); `pattern-rules.md`; `code-extraction.md`; `agent-orchestration.md`; `sdd-to-lld.md` (field mapping); `lld-quality.md`; `modes.md`; `README.md`.

**Done when.** A from-sdd proof run writes 03a with the three seed rules; the 04 files cite §6.5 instead of restating it; a new dependency shows `Proposed - needs approval`; `check_refs.py` reports 0 problems.

### LLD-3. Decision log

Kept from the earlier item "Isolated Decision Logging".

**Today.** The reasoning behind technical choices sits inside the main LLD.

**Required.** Add `decision-log.md` to `./lld-[project-slug]/`, modelled on sdd-unifier `decision-log.md`. It holds the why: stack approval and overrides (LLD-1), clarification answers, delegated decisions, superseded choices. Content chunks state only the settled design, in present tense. The decision log is never merged into the combined LLD.

**Fixture note.** `_fixtures/README.md` says the chain fixtures keep a run record named `decision-log.md` in their LLD folders, and that the skill neither writes nor reads it. Update that note. New proof runs keep run records out of the LLD folder (step 7 decision L8 A). Do not edit the frozen runs.

**Files.** New `lld-unifier/decision-log.md` (reference); `SKILL.md` (core principles, step 7a, step 8, Reference files, Output conventions); `chunking.md` (merge rules); `README.md`; `_fixtures/README.md`.

### LLD-4. Context awareness: no redundant questions

Kept from the earlier item "Context Awareness".

**Today.** The agent asks for directions or decisions that are already recorded.

**Required.** Before any question, read the existing records: the SDD (§1 Project Type, §6, §8.1 and ADR-01, its `decision-log.md`), the project instruction file, the LLD decision log, and the existing LLD. Ask only when the answer is missing or the records disagree; when they disagree, name both sources in the question. Never re-ask a confirmed stack row (LLD-1).

**Files.** lld-unifier `SKILL.md` (steps 2, 3, 3a, 3b, 7a).

### LLD-5. Generation in parts with review stops

Kept from the earlier item "Iterative Generation (Review Stops)".

**Today.** The LLD is written in one pass, so an early mistake spreads through a large document.

**Required.** Model this on sdd-unifier `parts-mode.md`: parts by default; a real stop after each part until the user says to continue; `whole` on request; resume state in the master. Propose the split to the user before implementing it. Suggested starting point: part 1 = 00-03a (frame, architecture, stack, libraries); part 2 = the 04 files and 05-08 (implementation, data, contracts, rules); part 3 = 09-17 and the review (chunk 18); then 19 behind its gate.

**Files.** New `lld-unifier/parts-mode.md`; `SKILL.md` (argument parsing, workflow); `chunks/lld-master.md` (Generation Progress); `README.md`.

### LLD-6. Complete API contracts

Kept from the earlier item "Detailed API Contracts".

**Today.** Endpoints are not always fully specified.

**Required.** Every §9.1 endpoint has a §9.2 block with: path; method (or Type for an in-process port); request (headers, path and query parameters, body schema with field types and required flags); responses (each status code with its body schema); errors (Problem Details type and `errorCode`); idempotency; auth and permission token; the SDD `API-NN` it implements. The step 7 reviewer flags any missing field.

**Files.** lld-unifier `chunks/06-api-contracts.md`, `sdd-to-lld.md`, `lld-quality.md`.

### LLD-7. Implementation deck brief (`19-for-ppt.md`)

**Today.** The LLD has no presentation brief.

**Required.**
1. New chunk `chunks/19-for-ppt.md`, in the same deck-brief format as SDD-4 (part A only).
2. **Focus.** Each area gets one or more slides:
   - **Clean code practices:** §6.5.2.
   - **Code architecture:** §6.1, §6.4, the §7.2 class and interface maps, the §7.4 patterns.
   - **API statistics:** item 3.
   - **API contracts:** conventions and highlights from §9.2-§9.6 (versioning, errors, pagination, auth).
   - **DB design:** §8.1 ERD, §8.2 tables per service, §8.4 tenancy.
   - **DB practices:** §8.3 indexes (with `tenant_id`), §8.5 Flyway, §8.6 retention, §8.7 encryption, UUIDv7, UTC.
   - **Integrations and failover:** per external integration, from §12.3 (timeout, retries with backoff and jitter, circuit breaker, bulkhead, fallback), §12.4 outbox, §12.5 saga, §10.5 DLQ, §13.8 runbooks.
3. **API statistics** are computed from the LLD, never estimated, and each cites its source table: total endpoints; per service; per HTTP method; by exposure (public through the gateway, internal, in-process port); endpoints that require an idempotency key; paginated list endpoints; API versions in use; topics produced and consumed (§10.1); external integrations, with how many have full failover (timeout, retry, circuit breaker, fallback) and which do not; contracts still `TBD - external` (SDD §15).
4. **Gate.** Written only when chunk 18 is cleared: every OI is `Accepted - applied`, `Adjusted - applied`, or `Rejected`. `Deferred`, and any status outside the chunk 18 legend, count as open. No override. A slide that draws on content with a `> TODO:` or `> Confirm:` flag is `Provisional (flag reference)`.
5. **Refresh, exclusions, design standard, master line.** The same rules as SDD-4 items 5-9, applied to the LLD.

**Files.** lld-unifier: new `chunks/19-for-ppt.md`; `SKILL.md` (a new step after 7a, § Light run, step 8, Reference files); `chunking.md` (canonical map, merge exclusion, § Targeted regeneration for "make the deck brief" and "refresh the deck"); `chunks/lld-master.md`; `modes.md`; `README.md`; the deck rules, in the P1 location.

**Done when.** With chunk 18 open, a deck request writes nothing and lists the open items. With chunk 18 cleared, the deck is written and every statistic matches a recount of its source table.

### SH-1. Structured data modeling (SDD and LLD)

Kept from the earlier shared item.

**Required.** Every database table is documented as: Table name; Table purpose (why it exists); Column details (name, data type, required or optional, short description).
- SDD: the `13a` DB Modeling block and §11.1.
- LLD: §8.2 Tables stays a derived view of the SDD `13x` DB Modeling (lld-unifier principle 13): the same table format, plus the implementation delta (constraints, indexes).

**Files.** sdd-unifier `chunks/13a-service-detailed-template.md`, `chunks/07-cross-cutting-concerns.md`, `TEMPLATE-COMBINED.md`; lld-unifier `chunks/05-data-model.md`, `TEMPLATE-COMBINED.md`, `sdd-to-lld.md`.

### SH-2. Centralized rule management (BRD, SDD, LLD)

Kept from the earlier shared item.

**Today.** Rules are copy-pasted across brd-unifier, sdd-unifier, and lld-unifier, so they drift when one is updated.

**Required.** Move the rules that are shared word for word into one shared reference, and point each skill to it. Candidates: the open-item status legend and gate rule; the answer policy; the Mermaid conventions; the deck-brief rules (BRD 17 part A, SDD 20, LLD 19); the stack selection mechanics (SDD-1, LLD-1); the eco-system template.

**Placement constraint.** The `~/.agents/skills` junctions link only the skill folders (§ 4, Runtimes). Present options to the user and ask before choosing. Examples: one canonical file inside one skill plus byte-identical copies in the others, checked by a new checker; or a new shared folder plus a junction the user creates.

### SH-3. Plain-language rewrite (last)

Kept from the earlier shared item.

**Today.** The prompts and instruction files contain long, complex paragraphs.

**Required.** After every functional change, rewrite long paragraphs in `SKILL.md` and the reference files of the three skills into clear, single-idea sentences. Use brd-unifier `writing-style.md` as the style reference. Meaning must not change: no rule added, removed, or weakened.

**Done when.** `check_refs.py` reports 0 problems, every regression suite passes, and a diff review finds no change of meaning.

---

## 6. Execution order

| Step | Do | Stop and ask |
|---|---|---|
| P0 | Read the files named in § 4, `_fixtures/README.md`, and both skills' `SKILL.md`, `chunking.md`, and `README.md`. Run the baseline checks (§ 7 item 1) and record the results. | If the baseline differs from `_fixtures/README.md`, report it before changing anything. |
| P1 | Decide the shared-rules placement (SH-2). | Always: the user chooses. |
| P2 | SDD-2, then SDD-1, SDD-3, SDD-4. | Any conflict with the skill text. |
| P3 | LLD-3 and LLD-4, then LLD-1, LLD-2, LLD-6, LLD-7, then LLD-5. | The LLD-5 part split, before implementing it. |
| P4 | SH-1, then the SH-2 extraction. | Any rule that is not identical across skills. |
| P5 | Checker and test updates (§ 7 item 2). | |
| P6 | SH-3, then rerun every check. | |
| P7 | Report (§ 8). | |

---

## 7. Verification

1. **Baseline and regression suites.** Run every command in `_fixtures/README.md` § How to run (PowerShell, from `C:\Users\negat\.claude\skills`, `$R` set to the FC baseline) and every regression suite listed there. Some suites skip cases when their saved runs are absent; report the skips. The FC baseline must still report 0 problems and 0 notes. It predates these changes, so the checkers must accept documents without the chunk 02 Status and Source columns, 05a, 20, 03a, and 19.
2. **Checker updates.**
   - `check_versions.py`: exempt SDD `20-for-ppt.md` and LLD `19-for-ppt.md` from F1, as BRD chunks 14-17 are.
   - The deck state must read the same in the chunk's status line and the master's Deck brief line.
   - `_e2e_gate.py`: `05a` is in the E4 hash scope; `20-for-ppt.md` is not.
   - `_linkcheck.py`, `check_links.py`, `check_lld_trace.py`: accept the new chunk names.
   - `check_mermaid.py`: apply the §8.6 and §8.7 decision (SDD-3).
   - `check_refs.py lld-unifier sdd-unifier`: 0 problems.
   - Add a regression test for each new rule, on disposable copies only.
3. **Proof runs.** Write every run to the session scratchpad, never inside a skill folder. Reuse the fixture folder names (`brd-refunds-portal`, `brd-loyalty-points`, `sdd-refunds-platform`, `lld-refunds-platform`). Compare each run with `diff_runs.py`.
   - **sdd-unifier**, on copies of the FC baseline BRDs: (a) Accept all; (b) Answer one by one, under an answer policy; (c) Import, with a planted `refunds-platform-eco-system.md` that holds one conflict with a BRD Technical Input and one provider spec. Part 1 must write 05a.
   - **SDD deck:** a request with the gate shut writes nothing. With the gate open, it writes chunk 20. For an open gate, use a copy of `_fixtures/chain/run-2026-10-07-review` (retained for open-gate coverage).
   - **lld-unifier from-sdd:** (a) Approve all; (b) one override; (c) the deck request with chunk 18 open, then cleared. If no saved LLD has chunk 18 cleared, ask the user how to get one.
4. **Reference sweep.** Grep every skill, the skills root `README.md`, and `impl-tracker-unifier` for chunk lists and section references. Update each list that must name the new chunks.

---

## 8. Report back

- Files changed, grouped by skill, one line each.
- Each question asked during execution, with the user's answer.
- Checker and regression results, before and after.
- Proof-run results per path, with output paths.
- Anything not done, and why.

---

## Appendix: coverage of the source requests

| Source request | Change |
|---|---|
| LLD: Dynamic tech stack proposals (no hard-coding) | LLD-1 |
| LLD: Isolated decision logging (`decision-log.md`) | LLD-3 |
| LLD: Context awareness (no redundant prompts) | LLD-4 |
| LLD: Iterative generation (review stops) | LLD-5 |
| LLD: Detailed API contracts | LLD-6 |
| SDD: Comprehensive project file adherence | SDD-2 |
| Shared: Structured data modeling | SH-1 |
| Shared: Centralized rule management | SH-2 |
| Shared: Plain-language refactoring | SH-3 |
| New: SDD tech stack gathering with proposed defaults (accept all, one by one, or import from `{slug}-eco-system.md` with integration specs) | SDD-1 |
| New: SDD deck chunk (system design, infrastructure, network, and integration architecture) | SDD-4, with SDD-3 |
| New: LLD can override the SDD eco-system on customer decision (approve, change one by one, or replace all) | LLD-1 |
| New: LLD chunk for the tech and libraries used (e.g. WebClient instead of RestTemplate; records for DTOs) | LLD-2 |
| New: LLD deck chunk (clean code, code architecture, API statistics, API contracts, DB design and practices, integrations with failover) | LLD-7 |

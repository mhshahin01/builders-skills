# [Project Name] - Business Requirements & High-Level Design

**Version:** [X.X]
**Author:** [Author Name]
**Date:** [YYYY-MM-DD]
**Status:** [Draft | In Review | Approved]

<!-- LANGUAGE RULE: The whole BRD is business language only - it states the WHAT. No technology names, protocols, frameworks, or implementation terminology anywhere in the body. The HOW (tech stack, architecture, technical targets) is owned by the SDD (sdd-unifier). Technical mandates found in source material are parked verbatim in Appendix > Technical Inputs for the SDD. -->

<!-- STYLE RULE: Plain language everywhere: simple, clear, precise, easy to understand. Short sentences, common words, active voice, one term for one thing, the exact number instead of a vague word. Simple never means incomplete: every number, rule, and exception stays. See writing-style.md. -->

---

## Changes Log

| Version | Updated Date | Updated By | Reviewed/Approved By | Update Summary |
|---------|-------------|------------|---------------------|----------------|
| 1.0     | YYYY-MM-DD  | [Name]     |                     | Initial draft. |

---

## Table of Contents

<!-- Auto-generated or manually maintained. Include Figures and Tables indices if the document is large. -->

**Figures**

| Figure # | Title | Section |
|----------|-------|---------|
| Figure 1 | [Description] | [Section] |

**Tables**

| Table # | Title | Section |
|---------|-------|---------|
| Table 1 | Glossary Table | [Section] |

---

# Executive Summary

<!-- 2-4 paragraphs. What is this system? What business problem does it solve? What are its core capabilities at a glance? -->

[System Name] is [brief description of the system and its purpose].

The primary business problem it solves is [problem statement], replacing it with [solution summary].

Core capabilities:
- [Capability 1]
- [Capability 2]
- [Capability 3]

---

# Background and Context / Problem Statement

<!-- Why does this project exist? What is the current state (manual process, legacy system, gap)? Include the current behavior if relevant. -->

[Describe the current state, pain points, and the trigger for this initiative.]

---

# Business Objectives

<!-- Quantified where possible. What does success look like? -->

- [Objective 1 - with measurable KPI if available, e.g., "460x faster processing"]
- [Objective 2]
- [Objective 3]

---

# Glossary

<!-- Business and domain terms only, defined in plain language. No technical terminology - technical vocabulary belongs in the SDD glossary. -->

| Term | Definition |
|------|-----------|
| [Term 1] | [Definition] |
| [Term 2] | [Definition] |

---

# Assumptions / Constraints

<!-- Numbered list. Each item should be clear and testable. -->

1. **[Short Label]**; [Detailed assumption or constraint description].
2. **[Short Label]**; [Detailed assumption or constraint description].

---

# Facts

<!-- Known truths that drive decisions. -->

1. [Fact 1]
2. [Fact 2]

---

# Challenges

<!-- Known risks, data quality issues, business pain points. Include examples where helpful. -->

1. [Challenge 1]
2. [Challenge 2]

<!-- Optional: Challenge evidence table -->

| Challenge ID | Source(s) & Evidence |
|-------------|---------------------|
| [ID]        | [Example data showing the challenge] |

---

# Dependencies

<!-- External systems, teams, data sources, third-party services. Use "NA" if none. -->

| Dependency | Type | Owner | Status | Notes |
|-----------|------|-------|--------|-------|
| [System/Team] | [Hard/Soft] | [Owner] | [Confirmed/Pending] | [Description] |

---

# Definitions & Important Details

<!-- Deep-dive into domain concepts critical for the team to understand before reading the use cases. Business language only: lifecycles, rules, relationships as the business understands them. -->

## [Domain Concept 1]

### Overview

[Explain the concept, its role in the business, and how it flows through the product.]

### [Sub-concept / Lifecycle]

[Detailed explanation with states, transitions, examples - in business terms.]

<!-- Include inline Mermaid figures where applicable (business-language labels only) -->

### [Sub-concept / Structure]

[Break down how the concept is composed from the business point of view - what it contains, what it relates to, who owns it.]

## [Domain Concept 2]

[Repeat the pattern per concept.]

---

# Project Scope

<!-- Short narrative of what the user needs to accomplish end-to-end. -->

[1-2 paragraph narrative of the end-to-end user journey.]

## In Scope

- [Scope item 1]
- [Scope item 2]

## Out of Scope

- [Out-of-scope item 1 - with brief justification or deferral note]
- [Out-of-scope item 2]

---

# Personas / Actors

<!-- Different actors that operate the system. Every persona listed here becomes a column in the Users & Use Cases Matrix and owns a group of detailed use cases. -->

| Persona | Role | Key Goals | Access Level |
|---------|------|-----------|-------------|
| [Persona 1] | [Role description] | [What they need to accomplish] | [Admin / Operator / Viewer / etc.] |
| [Persona 2] | [Role description] | [What they need to accomplish] | [Access level] |

---

# User Journeys & Use Cases

<!-- One short narrative per persona: what they come to the system to accomplish and the path they take. -->

## User Journeys

### [Persona 1] Journey

[1 paragraph: what this user wants to accomplish end-to-end, the path they take, and the outcome they leave with.]

### [Persona 2] Journey

[1 paragraph.]

## Summarized Workflow

<!-- Optional: A simplified step-by-step summary of the key journey(s). Diagrams are inline Mermaid (business-language labels), each with a mandatory 1-2 sentence prose summary. Append a `> Miro: <url>` link only if the user asked for a board. -->

[Workflow description with numbered steps and/or an inline Mermaid flowchart + prose summary.]

## Use Case Summary

<!-- Every use case, one row each. UC numbering is sequential across the whole BRD. Group rows per persona. -->

| UC ID | Use Case | Primary Actor | Description |
|-------|----------|---------------|-------------|
| **[Persona 1]** | | | |
| UC-01 | [Short Title] | [Persona 1] | [1-3 sentence summary of the goal and outcome] |
| UC-02 | [Short Title] | [Persona 1] | [Summary] |
| **[Persona 2]** | | | |
| UC-03 | [Short Title] | [Persona 2] | [Summary] |

<!-- USE CASE DIAGRAMS SLOT (to-do step 5 in 14-todo.md). Emit nothing here at first generation, and do not copy this comment into the generated file. After to-do steps 1-4 are confirmed complete, add a "## Use Case Diagrams" section at this position: actors, use cases, system boundary, and documented relationships as inline Mermaid plus the Summary line. Structure: chunks/05-user-journeys-overview.md. Notation: mermaid-diagrams.md § Use-case diagrams. -->

## Detailed Use Cases

All detailed use cases follow this structure:

- **Actor & Goal**: Who performs it, what they want, what triggers it.
- **Why**: The business value of this use case.
- **Preconditions**: What must be true before the use case can start.
- **Main Flow**: Numbered detailed steps - actor action, system response, alternating.
- **Alternate & Exception Flows**: What happens when the path branches or fails, in business terms.
- **Flowchart** (branching use cases only, added once the requirements are final): The main, alternate, and exception paths in one diagram, derived from the narrative.
- **Business Rules & Constraints**: Rules, limits, and conditions that govern the use case.
- **Acceptance Criteria**: Testable conditions that confirm the use case is complete.
- **Future Enhancements**: Low-complexity follow-ups that could ship next.
- **UI/UX**: Wireframes or references to approved Figma designs.

<!-- Group the detailed use cases per persona, in the same order as the Use Case Summary. -->

### Use Cases - [Persona 1]

---

#### UC-01: [Use Case Title]

| | |
|---|---|
| **Primary Actor** | [Persona] |
| **Supporting Actors** | [Other personas or external business parties involved, or "None"] |
| **Goal** | [What the actor wants to achieve, one sentence] |
| **Trigger** | [The business event that starts this use case] |

##### Why

[Business value - why does the business need this use case? Tie it to a Business Objective or a stated pain point.]

##### Preconditions

- [Condition that must hold before step 1, or "None."]

##### Main Flow

<!-- Detailed steps. Alternate actor action and system response. Each step is observable by the actor - if a step cannot be seen or verified by a user, it is design detail and belongs in the SDD. -->

1. [Actor] [does something].
2. The system [responds in business terms].
3. [Actor] [next action].
4. The system [next response].
5. [Continue until the goal is reached and the actor sees the outcome.]

##### Alternate & Exception Flows

- **A1 - [Branching condition]:** At step [N], [what happens instead, in business terms].
- **E1 - [Failure condition]:** The system informs [Actor] that [what they see and what they can do next].

<!-- FLOWCHART SLOT (to-do step 5 in 14-todo.md). Emit nothing here at first generation, and do not copy this comment into the generated file. After to-do steps 1-4 are confirmed complete, add a "##### Flowchart" sub-section at this position when the use case has 3 or more Main Flow steps and at least one decision point. Linear or shorter use cases get none; the skip reason is recorded in 14-todo.md. Notation and example: mermaid-diagrams.md § Use-case flowcharts. -->

##### Business Rules & Constraints

- [Rule 1. Use "Not applicable." if none.]

##### Acceptance Criteria

- [ ] [Testable condition 1 - e.g., "Given X, when Y, then Z"]
- [ ] [Testable condition 2]

##### Future Enhancements

- [Enhancement 1, or "- None identified at this time."]

##### UI/UX

<!-- Reference wireframes, mockups, or Figma links. Use placeholder references during early drafts. -->

[Figure reference or Figma link]

---

<!-- Repeat the UC block for each use case; repeat the persona grouping for each persona. -->

---

# Users & Use Cases Matrix

<!-- One consolidated view of who is allowed to do what. Every persona is a column; every use case is a row. Derived from the Actor fields of the detailed use cases - it must never contradict them. Conditional access gets a numbered footnote, never a bare "Yes". -->

> **How to read.** Rows are the use cases (functions) of the system; columns are the users (personas). **Yes** = this user is allowed to perform the use case. **-** = not allowed. A numbered footnote marks conditional access.

| Use Case | [Persona 1] | [Persona 2] | [Persona 3] |
|----------|:-----------:|:-----------:|:-----------:|
| UC-01 [Short Title] | Yes | Yes | - |
| UC-02 [Short Title] | Yes | - | - |
| UC-03 [Short Title] | Yes | Yes | Yes¹ |

¹ [Condition, e.g., "Own region only."]

---

# Integrations

<!-- Business systems and partners this product exchanges information with, and why. State the what; the SDD defines the how. -->

| Business System / Partner | Business Purpose | Information Exchanged | Direction | Criticality | Provider / Owner |
|---------------------------|------------------|-----------------------|-----------|-------------|------------------|
| [e.g., Payment Gateway] | [e.g., Collect customer payments and process refunds] | [e.g., Payment requests, confirmations, refund status] | [We send / We receive / Both ways] | [Critical / Important / Nice-to-have] | [Provider name or owning team] |
| [External System 2] | [Purpose] | [Information] | [Direction] | [Criticality] | [Owner] |

> Technical integration details (protocols, authentication, data formats, availability targets) are defined in the SDD, not here.

---

# Reporting / Analytics

<!-- Expected reports, table views, charts, dashboards, and data exports - in business terms. -->

| Report / View | What It Shows | Audience | Frequency | Format |
|---------------|---------------|----------|-----------|--------|
| [Report 1] | [The business question it answers] | [Admin / Manager / Tenant] | [Real-time / Daily / On-demand] | [Table / Chart / Export CSV & Excel] |
| [Report 2] | [What it shows] | [Audience] | [Frequency] | [Format] |

---

# Non-Functional Requirements

<!-- Business language only: state WHAT quality the business expects and how the business would recognise it. HOW it is achieved is owned by the SDD. Never invent measures; missing measure -> [NEEDS CLARIFICATION: ...]. -->

| NFR ID | Quality | Business Expectation (the what) | Business Measure |
|--------|---------|--------------------------------|------------------|
| NFR-01 | Availability | [e.g., The service is available around the clock; customers are never blocked from paying] | [e.g., No more than X minutes of disruption per month] |
| NFR-02 | Scalability | [e.g., Growth to X tenants / Y customers over Z years without degraded experience] | [e.g., Seasonal peaks of N times normal traffic handled without slowdown] |
| NFR-03 | Performance | [e.g., Screens respond immediately; reports are ready within moments] | [e.g., Everyday actions complete within N seconds] |
| NFR-04 | Security & Privacy | [e.g., Customer data visible only to authorised users] | [e.g., Access outside the Users & Use Cases Matrix is impossible] |

> The technical realisation of each NFR is defined in the SDD, not here.

---

# Summary

<!-- 1-2 paragraphs summarizing what the system is and the core problem it solves. Acts as a quick refresher. -->

[System Name] is [short summary restating the purpose and key value proposition].

---

# UI/UX Expectations

<!-- Global UI/UX standards that apply across all pages, from the user's point of view. -->

- **Primary Color**: [Primary Color Hex].
- **Data Tables**: [Sorting, pagination: default 20 rows/page, export (csv & excel), filtering standards]
- **Filtration**: [Standardized filter patterns]
- **Error Messages**: Errors tell the user in plain language what went wrong and what to do next. No technical codes or internal details are shown to users.
- **Responsive Design**: The product must be usable on desktop, tablet and mobile screen sizes as a minimum.
- **Language & Locale**: [Supported languages, right-to-left support if applicable, date/number/currency formats per audience.]
- [Other global UX rules]

---

# Appendix

| File Description | File (Attached) |
|-----------------|-----------------|
| [Description] | [Filename or link] |

## Technical Inputs for the SDD

<!-- Optional. If the source material states technical mandates - named technologies, protocols, architecture rules, concrete performance targets - park them here VERBATIM so nothing is lost. The sdd-unifier reads this section as input. Remove if the source had none. -->

| Source Statement (verbatim) | Source Location | Relevant To |
|-----------------------------|-----------------|-------------|
| [e.g., "Backend must be Java 21 / Spring Boot"] | [SoW §4.2] | [SDD Ecosystem Overview] |

---

# Wishlist

*Next features (after future enhancements section of each use case)*

1. [Feature 1]
   - [Sub-detail]
2. [Feature 2]
3. [Feature 3]

---

# Open Items & Clarifications

<!--
Output of the post-generation cleared-context reviewer pass. Captures gaps, missing scenarios, corner cases that the body did not flag inline. Every item carries a Recommended Answer - a concrete, ready-to-apply resolution. After this section is written, the skill walks the user through each item for acceptance; accepted answers are reflected into the body and logged in the Resolution Log.
This section is not a list of `[NEEDS CLARIFICATION: ...]` markers - those stay inline. This section is the reviewer's external findings.
-->

## How to read each item

| Field | Meaning |
|-------|---------|
| **ID** | OI-NN. Stable across revisions. |
| **Where** | Section, UC ID, or "global". |
| **Type** | Gap / Missing scenario / Corner case / Ambiguity / Risk / Inconsistency / Duplication (content restated instead of referenced - within the BRD or from source docs). |
| **Concern** | One paragraph. What was missed and why it matters. |
| **Options** | Concrete choices, each with a one-line tradeoff. At least 2 where a choice exists. |
| **Recommended Answer** | The reviewer's concrete proposed resolution, written as ready-to-apply BRD content. This is what gets injected into the body when accepted. |
| **Why** | REQUIRED. One or two lines: the reason the recommended option wins over the alternatives: the evidence behind it (source section, stated business expectation, domain practice, risk avoided) and the tradeoff being accepted. Never empty, never "best option". |
| **Status** | Open / Accepted - applied / Adjusted - applied / Deferred (with rationale) / Rejected. |

## Open Items

### OI-01: [Short title]

- **Where:** [Section name or UC ID]
- **Type:** [Gap | Missing scenario | Corner case | Ambiguity | Risk | Inconsistency | Duplication]
- **Concern:** [One paragraph.]
- **Options:**
  - **A.** [Option A] - [one-line tradeoff].
  - **B.** [Option B] - [one-line tradeoff].
- **Recommended Answer:** [Option letter + the concrete resolution text, ready to paste into the BRD.]
- **Why:** [The reason this option wins: evidence (source section, business expectation, domain practice) + the tradeoff accepted.]
- **Status:** Open

<!-- Repeat OI block for each open item. -->

## Resolution Log

| ID | Resolution Date | Resolved In | Outcome |
|----|----------------|-------------|---------|
| [OI-XX] | [YYYY-MM-DD] | [Section / UC ID] | [Accepted recommendation / Adjusted: short note / Deferred / Rejected] |

## Reviewer Notes

<!-- Optional. Free-form notes that did not crystallise into a numbered open item. -->

- [Note 1]
- [Note 2]

---

<!--
DELIVERY CHUNKS. Order 14 -> 15 -> 16 -> 17. Rules: delivery-chunks.md.
- GUARDRAIL: the two sections below (15 Implementation Plan, 16 UAT/BAT Test Cases) are NOT written on a first run. They are appended only once the delivery gate is open: every action item in 14-todo.md closed (all five steps Complete with evidence, every item Resolved, Deferred counts as open, no override). Until then this file ends with Open Items & Clarifications.
- Their full block structure is in chunks/15-implementation.md and chunks/16-uat-bat-test-cases.md; use the same blocks with the COMBINED mode adaptations of delivery-chunks.md (cite use cases and NFRs by identifier in plain text; only links to 14-todo.md are file links).
- 14 (Product Manager To-Do) and 17 (Presentation & Video Brief) are NEVER part of this file. 14 is written at the end of every generation as ./brd-[project-slug]/14-todo.md; 17 is written as ./brd-[project-slug]/17-for-ppt.md once the gate is open.
-->

# Implementation Plan

> **What this is.** Every use case turned into scoped tasks with stable IDs, ordered so that no task comes before something it depends on. It names what to deliver and how completion is judged; the SDD and LLD own the how.

**Plan status:** [Up to date / Provisional (TD-NN) / Stale] | **Basis:** BRD v[X.X] | **Gate verified:** [YYYY-MM-DD] (see [14-todo.md](./brd-[project-slug]/14-todo.md)) | **Flowcharts used:** [Figures N-M] | **New items raised while writing this plan:** [0, or TD-NN ...]

## How to use this plan

<!-- The six rules from chunks/15-implementation.md. -->

## Use-case coverage

| Use case | Tasks |
|----------|-------|
| UC-01 [Short Title] | TASK-01, TASK-03 |

## Execution sequence

| Wave | Tasks (can run in parallel) | Depends on |
|------|-----------------------------|-----------|
| 1 | TASK-01, TASK-02 | None |

## Dependency problems

| ID | Type | Tasks and use cases affected | Evidence | Needed to unblock | To-do item | Status |
|----|------|------------------------------|----------|-------------------|-----------|--------|
| DP-01 | [Circular dependency / Missing prerequisite / Blocker] | [...] | [...] | [...] | [TD-NN] | [Open / Resolved] |

## Tasks

### TASK-01: [Title - a capability, in business terms]

<!-- Task block exactly as in chunks/15-implementation.md: header table (Objective, Scope, Type, Wave, Source use cases, Source requirements, Dependencies, Can run in parallel with, Status basis), Expected deliverables, Completion criteria, Assumptions / open questions / blockers. Repeat per task, in execution order. -->

---

# UAT/BAT Test Cases

**Owner:** [Owner Name] | **Prepared:** [YYYY-MM-DD] | **Baseline:** BRD v[X.X] (all sections) | **Design reference:** Figma - [Project Name] UI/UX ([n] screens)

**Suite status:** [Up to date / Provisional (TD-NN) / Stale] | **Gate verified:** [YYYY-MM-DD] (see [14-todo.md](./brd-[project-slug]/14-todo.md)) | **Flowchart cross-check:** done on [YYYY-MM-DD] | **New items raised while writing this suite:** [0, or TD-NN ...]

**Scope note:** [Default execution scope. Define every scope tag used in a TC Name. Name the cases that need another team's cooperation.]

<!-- Sections exactly as in chunks/16-uat-bat-test-cases.md: How to use this document; Test environment and data prerequisites; one numbered section per feature area with the nine-column table; Cross-Cutting UI/UX Standards; NFR Acceptance; Traceability Matrix; Provisional and blocked scenarios; Coverage gaps; Execution summary; Exit criteria (BAT sign-off). -->

## 1. [Feature area] ([UC-NN, screen IDs, NFR-NN])

| TC ID | TC Name | TC Description | TC Example | Success Criteria | Related UC | Related Task | Testing Result | Testing Comment |
|-------|---------|----------------|------------|------------------|-----------|--------------|----------------|-----------------|
| TC-XXX-01 | [Short name] | Verify [...] | [Concrete example] | [Observable outcome] | UC-NN (AC-1) | TASK-NN | | |

## Traceability Matrix

| BRD Reference | Covered By |
|---------------|-----------|
| UC-01 [Use case title] | TC-XXX-01..NN |

## Provisional and blocked scenarios

| TC ID | Why the expected result is not final | To-do item | What finalises it |
|-------|--------------------------------------|-----------|-------------------|

## Coverage gaps

**Checked:** [n] Main Flows, [n] alternate flows, [n] exception flows, [n] acceptance criteria, [n] numeric or time-based rules, [n] NFRs, [n] flowchart branches. **Without a case:** [n].

| BRD Reference | Gap | Reason | To-do item / action |
|---------------|-----|--------|---------------------|

## Execution summary (fill at the end of the cycle)

| Metric | Count |
|--------|-------|
| Total test cases | [n] |
| Success | |
| Failed | |
| Blocked | |
| Not Run | |

**Exit criteria (BAT sign-off):** [all Critical-path cases pass; no open Failed case without a business-accepted deviation; no `(Provisional)` case left unresolved].

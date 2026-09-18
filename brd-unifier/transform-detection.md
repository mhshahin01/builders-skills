# Transform vs Generate — Intent Detection

The skill produces output in either GENERATE intent (author a BRD from scratch / from conversation / from a SoW) or TRANSFORM intent (re-shape an existing document into this template). This file gives the rules for deciding which.

The user almost never says "I want you to transform this" or "I want you to generate this" explicitly. The skill must infer intent from the input.

---

## The decision tree

```
Is there a source document attached, pasted, or referenced by path?
├── No  → GENERATE (from conversation / topic seed)
└── Yes → Inspect the source:
         ├── Source already follows this BRD template structure?
         │   ├── Yes (single-file form, target is chunks)  → TRANSFORM (re-chunk)
         │   ├── Yes (chunked form, target is combined)    → TRANSFORM (merge)
         │   ├── Yes, both forms match target              → TRANSFORM (refresh / regenerate)
         │   └── Yes, but stale (template evolved)         → TRANSFORM (migrate to current template)
         ├── Source is a SoW / Statement of Work / RFP scope?
         │   → TRANSFORM (SoW → BRD; see sow-transformation.md)
         ├── Source is a different BRD format (Word doc, old template, vendor format)?
         │   → TRANSFORM (cross-template migration)
         ├── Source is a flat product spec / loose requirements doc?
         │   → TRANSFORM (informal → standardised)
         └── Source is meeting notes / Slack thread / email chain?
             → GENERATE (treat as raw context, not a transform target)
```

---

## Recognising source types

### Already follows this template

Signs:

- Has section headings matching `Executive Summary`, `Business Objectives`, `Glossary`, `User Journeys & Use Cases`, `Users & Use Cases Matrix`, `Non-Functional Requirements`, etc., in the order the template defines.
- Use-case blocks use the `Actor & Goal / Why / Preconditions / Main Flow / Alternate & Exception Flows / Business Rules & Constraints / Acceptance Criteria / Future Enhancements / UI/UX` structure. (An older revision of this template used FR blocks with `What / Why / How / Constraints / Future Enhancements / UI/UX` — treat that as "stale, template evolved" and migrate to use cases.)
- Has a Changes Log.
- Has tables for Glossary, Dependencies, Integrations, NFRs, and the Users & Use Cases Matrix.

If 4+ of these match, treat as "already follows this template" and the work is reformat / regenerate / migrate.

### SoW / Statement of Work

Signs:

- Section headings include `Scope of Work`, `Vendor Responsibilities`, `Deliverables`, `Acceptance Criteria`, `Commercial Terms`, `Payment Schedule`, `Project Timeline`.
- Tone uses "The Vendor shall...", "The Supplier is obliged to...", passive contractual constructions.
- Includes pricing, payment terms, or a commercial framework.
- May include a vendor evaluation criteria or response template (RFP-style).

Apply the SoW-to-BRD field mapping in `sow-transformation.md`.

### Different BRD format

Signs:

- Has BRD-like content (requirements, scope, NFRs) but section names or order don't match the template.
- Common offenders: vendor templates, BAs from a previous role, IEEE 830 / 29148 styles, Volere templates.
- Often missing one of: Changes Log, Glossary, Personas, a per-user use-case structure, a users-permissions matrix, Reporting / Analytics, UI/UX Expectations.

Re-architect into this template's section order. Carry every fact across; flag every gap that this template demands but the source doesn't have.

### Flat product spec / informal requirements

Signs:

- No clear section structure (just paragraphs or bullet lists).
- Mixed concerns in the same paragraph (objectives, FRs, NFRs interleaved).
- Often a Notion page export, a Confluence page, or a markdown brain-dump.

Treat the same as SoW transformation but skip SoW-specific mappings (no commercial section to ignore, no vendor-obligation rewriting). Heavier classification work — every paragraph must be sorted into a target section.

### Meeting notes / Slack thread / email chain

Signs:

- Speaker attributions ("Mahmoud:", "@user said:", "From: ... Sent: ...").
- Conversational tone, jumps between topics.
- Decisions and action items mixed with discussion.

Do NOT treat as a transform target. Treat as raw context for GENERATE — extract decisions and facts, but the BRD is being authored fresh, not reshaped.

---

## Transform and the generation option

A transform from a source that needs authoring (SoW, a BRD in another format, a loose spec) uses the generation option like a fresh generation: `parts` by default in CHUNKS mode (`parts-mode.md`). Pure conversions (merge, re-chunk) and targeted updates of an existing BRD always run `whole`: there is nothing to review between parts.

---

## What "transform" actually means

Transform is not "copy the source verbatim into the new shape". It is:

1. **Read the source completely.**
2. **Classify each piece of content into a target template section.** A SoW paragraph might split across Executive Summary, Background, and UC-03's Main Flow.
3. **Paraphrase to fit voice and audience.** SoWs are vendor-facing; BRDs are team-facing. Same facts, different voice. (See `sow-transformation.md` § "Handling voice and audience shift".)
4. **Preserve verbatim what must be verbatim.** Numbers, dates, percentages, SLAs, named integrations, named systems.
5. **Flag every gap.** The source will not cover every BRD section. Missing items become `**[NEEDS CLARIFICATION: <specific question>]**` markers.
6. **Never invent.** If the SoW doesn't state an NFR target, the BRD doesn't get an invented one. It gets a clarification flag.

---

## Edge cases

### "Update this BRD" (existing BRD with light changes requested)

Treat as TRANSFORM with targeted regeneration:

- Identify which sections the user wants changed.
- Regenerate only those (chunks: rewrite the affected chunk files; combined: rewrite the affected sections in place).
- Bump the version in the Changes Log with a one-line description of what changed.
- Refresh `14-todo.md` per `delivery-chunks.md` § Refresh triggers, keeping every identifier stable. If chunks 15-17 exist, mark them `Stale`; they are refreshed only while the delivery gate is open (SKILL.md step 8c). If the BRD predates the delivery chunks, generate `14-todo.md` (step 8a); a BRD with no chunk 13 gets the reviewer pass first (steps 7-8).

### "Combine these into one BRD" (multiple source docs)

Treat as TRANSFORM, but the input is a set:

- Read all sources.
- Build a unified mental map of facts before writing.
- When sources conflict, flag the conflict in `[NEEDS CLARIFICATION: source A says X, source B says Y]` rather than silently picking one.

### Source is in a non-English language

Translate facts, preserve names. Flag in the handoff summary that translation occurred so the user can verify accuracy.

### Source is partially in scope (mixes BRD content with non-BRD content like email signatures, legal disclaimers, project plan Gantt rows)

Ignore non-BRD content silently. Surface a one-line note in the handoff: "Ignored N paragraphs that were not BRD-relevant (project plan timeline, email metadata)."

---

## When the detection is genuinely ambiguous

Ask exactly one question:

> Is this material **a source for a fresh BRD** (I'll author from it) or **an existing BRD I should reformat into your template** (I'll re-shape it)?

Do not guess silently when the answer materially changes the output.

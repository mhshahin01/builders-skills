# Generate vs Transform

Both intents end in the same output mode (CHUNKS or COMBINED). They differ in input handling.

## GENERATE (default)
Trigger: an idea/concept, a topic seed, or conversation context with no structured source document. Run the research fan-out (`research-orchestration.md`) and author the frameworks from the bundle.

## TRANSFORM
Trigger: the user provides an existing artifact to re-shape - notes, a concept brief, a Scope of Work, or an older pre-BRD in a different layout.
Procedure:
1. Read the source fully before writing.
2. Map content to the 22 frameworks. Preserve verbatim numbers, dates, named commitments.
3. Run research only to fill frameworks the source leaves empty (hybrid is acceptable in a transform).
4. Flag every unmapped requirement of the template with `[NEEDS CLARIFICATION: ...]`.

For a light run, `SKILL.md` § Light run says which frameworks a transform fills.

## Detection rules
- A file/path or pasted document present → lean TRANSFORM.
- Only an idea or a few sentences of intent → GENERATE.
- Ambiguous → ask one question: "Generate a fresh pre-BRD from the idea, or transform an existing document you'll provide?" An answer policy can answer it (`SKILL.md` § Answer policy).

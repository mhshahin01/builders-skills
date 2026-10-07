# Modes: Chunks vs Combined

The output shape is set by the argument (`pre-brd-unifier chunks|combined`) or the interactive prompt (chunks is default). Mode is independent of intent (generate vs transform) and independent of Excel export (which is a separate, post-approval step).

## CHUNKS mode

Output: `./pre-brd-[project-slug]/` containing `00-pre-brd-master.md` plus one file per framework, `01-…` through `22-…`, the investor assessment `23-investor-assessment.md` (investor pass), and `24-open-items-and-assumptions-log.md` (reviewer pass).

Skeleton source: `chunks/*.md`. Copy each file's structure, fill the Answer slots, save under the same filename in the output folder. Each chunk keeps its self-describing comment block; in the output, add the `PROJECT:` line and set `PART OF:` to the project (the skeletons carry `PART OF: PRE-BRD Master` as a placeholder):

```markdown
<!--
PRE-BRD CHUNK: 07
TITLE: Market Sizing and Analysis
TIER: Tier 2: Market and Competition
PROJECT: [Project Name]
PART OF: PRE-BRD - [Project Name]
-->
```

Prefer when: tiers are filled/reviewed by different people, the doc is large, or sections will be regenerated independently.

## COMBINED mode

Output: a single `./PRE-BRD-[ProjectName]-v1.1.md`. Concatenate all frameworks top to bottom in tier order with a table of contents; no chunk comment blocks. The Investor Assessment becomes a `# Investor Assessment` section after the Scoreboard; the reviewer's Open Items become a final `# Open Items & Assumptions Log` section.

Prefer when: sharing as one attachment, formal review, or archiving.

## Cross-mode conversion (on request)

- **Chunks → Combined:** read `00`…`24` in order, strip comment blocks, concatenate with one blank line between, regenerate the table of contents, write `./PRE-BRD-[ProjectName]-v1.1-MERGED.md`. Keep originals.
- **Combined → Chunks:** split by framework headings into `NN-*.md`, prepend each chunk's comment block. Keep the combined file.

## Mid-run mode change

If nothing is written yet, switch silently. If some output exists, finish the current file, then offer the conversion; never silently delete produced output.

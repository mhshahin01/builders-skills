<!--
CHUNK: 01
TITLE: Purpose, Scope, Assumptions, Glossary
PROJECT: [Project Name]
VERSION: [X.X]
PART OF: LLD - [Project Name]
-->

# 1. Purpose

<!-- One paragraph. What does this LLD enable a developer (or AI implementer) to do that they could not do with only the SDD? Lead with the implementation outcome. -->

[Purpose statement.]

---

# 2. Scope

## 2.1 In Scope

- [Service / module / feature]
- [Service / module / feature]
- [Service / module / feature]

## 2.2 Out of Scope

- [Explicitly excluded item]
- [Explicitly excluded item]

> **From-sdd note:** scope here is the implementation scope. It may be narrower than the SDD scope if some SDD-described services are not yet being built in this LLD pass.

> **Hybrid note:** if scope diverges between SDD and code, the divergence is marked here with a `⚠ drift` block, and the resolved scope is what the LLD covers.

---

# 3. Assumptions

| ID | Assumption | Source | Risk if false |
|----|------------|--------|---------------|
| A-01 | [Assumption] | [BRD / SDD / CLAUDE.md / inferred from code] | [Risk] |
| A-02 | [Assumption] | [Source] | [Risk] |

---

# 4. Glossary

| Term | Definition | Source |
|------|------------|--------|
| [Term] | [Definition] | [BRD / SDD / Code / new in LLD] |
| [Term] | [Definition] | [Source] |

> **Convention:** carry SDD glossary verbatim; add LLD-specific implementation terms (pattern names, class-suffix conventions, transaction-policy names) as new rows.

<!-- MASTER: [project-slug]-lld-master.md | PREV: 00-metadata.md | NEXT: 02-context.md -->

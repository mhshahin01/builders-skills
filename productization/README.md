# Productization Guide: the Documentation Chain as a Team of Agents

This guide is the product specification for turning the unifier skill suite (`pre-brd-unifier`, `brd-unifier`, `sdd-unifier`, `lld-unifier`, `business-reviewer-unifier`) into a team of predefined agents on a Band-style multi-agent platform.

On the platform, a user creates an agent, assigns it a model and a role/job description, and adds it to a team. The team collaborates toward a goal. This guide defines the five documentation agents that ship with the product, how they collaborate, what the human decides at each point, and the states the UI must visualize. Later role agents (Developer, DevOps, Engineering Manager, Tester) plug into the same contracts; the extension points are marked in `00-vision-and-model.md` § 7.

**Audience:** product, UX, and development teams building the platform. This is not an end-user manual.

**Source of truth:** the skill folders (`../pre-brd-unifier/`, `../brd-unifier/`, `../sdd-unifier/`, `../lld-unifier/`, `../business-reviewer-unifier/`). This guide reflects their state at commit 1d0d7f3 (2026-10-08): the 2026-10-07 consistency fixes listed in `09-open-decisions.md` § Applied fixes, plus the later skill commits 695e9a3, 2bdbb90, 7cb4b2e, b4d6821, and c8ef911, folded in by the 2026-10-08 alignment audit, and the three skill fixes that audit led to (`09-open-decisions.md` § Decision log). Where this guide and a skill disagree, the skill wins; file an issue against the guide.

## The five predefined agents

| Product agent | Built on | Stage | One-line job |
|---|---|---|---|
| Discovery Analyst | `pre-brd-unifier` | 1. Discovery | Answers "is this worth building?" with 22 frameworks, a go/no-go scoreboard, and an investor assessment |
| Requirements Analyst | `brd-unifier` | 2. Requirements | Writes the business WHAT: per-persona use cases, the Users & Use Cases Matrix, the delivery checklist |
| Solution Architect | `sdd-unifier` | 3. Architecture | Writes the technical HOW: chosen architecture style, contract registries reconciled to zero drift |
| Implementation Designer | `lld-unifier` | 4. Implementation design | Writes per-service implementation specs an AI implementer can code from, plus the Specs constitution |
| Review Panel | `business-reviewer-unifier` | Cross-cutting | Runs a five-persona adversarial panel over the whole chain and drives findings to resolution |

## File map

| File | Contents |
|---|---|
| `00-vision-and-model.md` | The agent model: skill-to-agent mapping, team presets by product complexity, shared platform concepts, extension points for future role agents |
| `01-pipeline-overview.md` | The end-to-end chain: stages, handoff contracts, lineage graph, entry and skip patterns |
| `02-agent-pre-brd.md` | Discovery Analyst spec |
| `03-agent-brd.md` | Requirements Analyst spec |
| `04-agent-sdd.md` | Solution Architect spec |
| `05-agent-lld.md` | Implementation Designer spec |
| `06-agent-business-reviewer.md` | Review Panel spec |
| `07-collaboration-flows.md` | Sequence flows: fresh full-chain run, update propagation, business review cycle, resumes, human touchpoint inventory, degraded flows |
| `08-states-and-vocabulary.md` | The shared state machines and vocabulary: status enums, gates, markers, ID registry, interaction patterns, versioning rules |
| `09-open-decisions.md` | Cross-skill divergences that need a product decision, each with options and a recommendation |

Each agent chapter follows the same 13-section template: role card, when to include, artifacts consumed, artifacts produced, invocation, conversation flow, work pipeline, review and decision loops, gates and states, handoffs, edge cases, UI requirements, handoff inventory.

## Reading paths

- **Product manager:** `00`, `01`, then the role card and § 12 (UI requirements) of each agent chapter, then `07`.
- **UX:** `00` § 5 (platform concepts), each agent chapter § 6 (conversation flow) and § 12, `08` for every status enum the UI must render.
- **Engineering:** `08` first, then each agent chapter § 3-5 and § 9-11, `07` for orchestration, `09` for the decisions that affect the data model.

## Conventions in this guide

- No em dash characters anywhere (house rule, inherited from the skills).
- Skill terminology is quoted exactly, with citations like `(brd-unifier/SKILL.md:55)`. Where sibling skills use colliding terms (mode / shape / direction), the collision is flagged and mapped in `08-states-and-vocabulary.md`.
- Status strings and prompt texts are quoted verbatim, including backticks, so the platform can parse or display them as-is.
- "The platform" means the product being built. "The user" means the platform's human operator, acting as product owner and decider. "Sub-agent" means a fresh-context agent dispatched by an agent, a platform primitive the skills rely on.

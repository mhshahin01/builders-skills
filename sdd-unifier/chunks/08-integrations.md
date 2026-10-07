<!--
CHUNK: 08
TITLE: Integrations
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: 04, 02
PART OF: SDD - [Project Name]
-->

# 12. Integrations

<!-- High-level table of all external integrations. One row per integrated system. Every synchronous domain or provider integration also has an API contract in §15 (chunk 11; standard operational infrastructure is not one: SKILL.md step 6a); name its API-NN in Notes. External contracts stay `TBD - external` there until the user supplies the provider documentation. -->

| Integration ID | What (System) | Purpose | How (Protocol / Mode) | When (Trigger) | Auth | Timeout | Rate Limit | Retries & Backoff | Fallback | Notes |
|----------------|---------------|---------|------------------------|----------------|------|---------|------------|--------------------|-----------| ------|
| INT-01 | [System] | [Purpose] | [Protocol] | [Trigger] | [Auth] | [Timeout] | [Rate limit] | [Retries / backoff] | [e.g., Return cached / Degrade / Queue for retry] | [Notes] |
| INT-02 | [System] | [Purpose] | [Protocol] | [Trigger] | [Auth] | [Timeout] | [Rate limit] | [Retries / backoff] | [Fallback] | [Notes] |

<!-- MASTER: [project-slug]-sdd-master.md | PREV: 07-cross-cutting-concerns.md | NEXT: 09-services-summary.md -->

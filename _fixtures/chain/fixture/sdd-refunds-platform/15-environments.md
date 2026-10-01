<!--
CHUNK: 15
TITLE: Environments
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: 07
PART OF: SDD - Refunds Platform
-->

# 19. Environments

| Environment | Purpose | Data | Access | Promotion Source |
|-------------|---------|------|--------|------------------|
| **Dev** | Developer integration of the three deployables | Synthetic; POS Records, CardPay, MsgHub, and Keycloak Admin API stubbed | Engineering team | Feature branches after the pipeline passes |
| **SIT** | System integration: the full event flow across the three deployables with provider stubs | Synthetic, reset per test cycle | Engineering and QA | Dev |
| **UAT** | Business acceptance against the BRD scenarios ([REFUNDS 16](../brd-refunds-portal/16-uat-bat-test-cases.md), read as context) | Synthetic customers, branches, and receipts; connected to the POS Records sandbox and the CardPay sandbox (REFUNDS 16 prerequisite P1). [NEEDS CLARIFICATION: whether a MsgHub sandbox exists for UAT.] | Product team and business testers (one customer, one branch manager per branch for two branches) | SIT |
| **Prod** | Live service | Real customer, refund, and points data | Customers, members, and branch managers through the web app; operations through the runbook (§20) | UAT, with a recorded approval (§11.3) |

**Per-environment specifics (capture per service if they differ):**

- **Sizing:** [NEEDS CLARIFICATION: replicas, CPU, and memory per deployable per environment (§11.3).]
- **Data refresh:** Dev and SIT are rebuilt from seed data; UAT keeps its data for a test cycle. [NEEDS CLARIFICATION: UAT refresh cadence.] Production data is never copied to a lower environment unmasked (§17.1, §17.4 PII columns).
- **Feature flags:** none in this release (§11.5).
- **DNS:** [NEEDS CLARIFICATION: host naming convention per environment.]
- **Access controls:** one Keycloak realm per environment; no production account exists in a lower environment.
- **Secrets strategy:** provider credentials per environment and per tenant in the secrets manager; sandbox credentials only below Prod. [NEEDS CLARIFICATION: secrets manager product (§6).]

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 14-performance-and-capacity.md | NEXT: 16-operations-runbook.md -->

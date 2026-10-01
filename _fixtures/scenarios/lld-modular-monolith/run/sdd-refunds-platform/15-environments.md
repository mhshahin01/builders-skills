<!--
CHUNK: 15
TITLE: Environments
PROJECT: Refunds Platform
VERSION: 1.1
DEPENDS_ON: 07
PART OF: SDD - Refunds Platform
-->

# 19. Environments

| Environment | Purpose | Data | Access | Promotion Source |
|-------------|---------|------|--------|------------------|
| **Dev** | Developer integration of the deployable | Synthetic data; provider adapters stubbed | Development team | Feature branches merged to main |
| **SIT** | System integration with provider sandboxes | Synthetic data | Development and QA | Dev (green pipeline) |
| **UAT** | Business acceptance against the BRD test suites | Synthetic test data; connected to the POS records, CardPay, and MsgHub sandboxes (MsgHub may run live with test recipients only), as the REFUNDS UAT suite expects, including its message checks (TC-REQ-07, TC-DEC-01, TC-DEC-04) | Product team, branch manager and customer test accounts | SIT |
| **Prod** | Live service | Production data | Operations; break-glass access only | UAT (sign-off) |

**Per-environment specifics (capture per service if they differ):**

- **Sizing:** [NEEDS CLARIFICATION: replicas and database size per environment.]
- **Data refresh:** [NEEDS CLARIFICATION: refresh policy; production data never copied without masking the PII columns.]
- **Feature flags:** [NEEDS CLARIFICATION: per-environment defaults, once a feature flag tool is chosen (§11.5).]
- **DNS:** [NEEDS CLARIFICATION: naming convention.]
- **Access controls:** [NEEDS CLARIFICATION: elevation rules for Prod.]
- **Secrets strategy:** [NEEDS CLARIFICATION: per-environment secrets layout in the secrets manager (§6), and provider sandbox credentials for SIT and UAT.]

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 14-performance-and-capacity.md | NEXT: 16-operations-runbook.md -->

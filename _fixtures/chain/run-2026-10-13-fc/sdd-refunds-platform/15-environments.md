<!--
CHUNK: 15
TITLE: Environments
PROJECT: Refunds Platform
VERSION: 1.3
DEPENDS_ON: 07
PART OF: SDD - Refunds Platform
-->

# 19. Environments

| Environment | Purpose | Data | Access | Promotion Source |
|-------------|---------|------|--------|------------------|
| **Dev** | Developer integration of the one deployable | Synthetic data; providers stubbed | Development team | Main branch builds |
| **SIT** | System integration with the provider test environments | Synthetic data | Development team, QA | Dev |
| **UAT** | Business acceptance testing (BAT) and stress tests | Synthetic or masked data; contact details always masked | Business testers, QA | SIT |
| **Prod** | Live service for the retailer | Live data | Operations; no developer write access | UAT, after BAT sign-off and the §11.3 gates |

**[NEEDS CLARIFICATION: Which data refresh policy, sizing rules, DNS naming, and secrets layout does each environment use? The BRDs do not specify the environment model. Owner: platform team.]**

**[NEEDS CLARIFICATION: Do CardPay Ltd, MsgHub, and Point-of-Sale Records offer test environments for SIT and UAT, and with what test data? Owner: product owner with each provider.]**

**Per-environment specifics:**

- **Sizing:** per the first marker; Prod per §11.3.
- **Data refresh:** per the first marker; production personal data never leaves Prod unmasked.
- **Feature flags:** the per-product enablement settings, the started-branch list, and the refund-reporting start date of §11.5, set per environment.
- **DNS:** per the first marker.
- **Access controls:** each environment has its own IAM realm; staff accounts in non-production environments are test accounts.
- **Secrets strategy:** one secrets-manager scope per environment; provider credentials per environment (test credentials outside Prod).

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 14-performance-and-capacity.md | NEXT: 16-operations-runbook.md -->

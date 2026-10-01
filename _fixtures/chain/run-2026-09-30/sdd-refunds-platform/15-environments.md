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
| **Dev** | Build and developer testing of the three deployables and the web app | Synthetic data; stubs for API-01 to API-04 | Development team | Trunk builds |
| **SIT** | Integration of the core, payout-service, and notification-service with Kafka, Keycloak, and PostgreSQL | Synthetic data; provider sandboxes where the providers offer them | Development team and testers | Dev |
| **UAT** | Business acceptance against the REFUNDS test cases | Test data per prerequisites P1 to P4 of [REFUNDS 16 § Test environment and data prerequisites](../brd-refunds-portal/16-uat-bat-test-cases.md#test-environment-and-data-prerequisites): connected to the POS Records sandbox and the payment provider sandbox, with a way to make the sandbox refuse a payout | Business testers and the product team | SIT |
| **Prod** | Live service | Live data | Operations; break-glass access per §20.3 | UAT, after sign-off |

**Per-environment specifics (capture per service if they differ):**

- **Sizing:** [NEEDS CLARIFICATION: per-environment sizing rules for the three deployables, PostgreSQL, and Kafka]
- **Data refresh:** production data never leaves Prod, because refund requests hold customer contact details (REFUNDS/NFR-04); lower environments use synthetic or sandbox data only.
- **Feature flags:** none in this release (§11.5).
- **DNS:** [NEEDS CLARIFICATION: DNS naming convention per environment]
- **Access controls:** [NEEDS CLARIFICATION: who may access each environment, and the elevation rules for Prod]
- **Secrets strategy:** the secrets manager (§6) in every environment, with separate paths and separate provider credentials per environment; Dev uses stub credentials only.
- **LOYALTY acceptance:** the LOYALTY BRD has no UAT/BAT test cases yet (its delivery chunks are locked in [its master](../brd-loyalty-points/loyalty-points-brd-master.md)); UAT covers the LOYALTY use cases once they exist.

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 14-performance-and-capacity.md | NEXT: 16-operations-runbook.md -->

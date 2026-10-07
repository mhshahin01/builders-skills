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
| **Dev** | Development and module tests | Synthetic data; provider adapters stubbed | Delivery team | Feature branches merged to main |
| **SIT** | Integration of the deployable with Keycloak and the provider sandboxes | Synthetic data; provider sandboxes where they exist | Delivery team | Dev |
| **UAT** | UAT and BAT of both products ([REFUNDS 16](../brd-refunds-portal/16-uat-bat-test-cases.md), [LOYALTY 16](../brd-loyalty-points/16-uat-bat-test-cases.md)) | Test versions of POS Records, the Payment Provider, and the Notification Partner; test accounts for every persona; a rehearsal of the go-live import | Testers, the product team, and the business owners | SIT |
| **Prod** | Live service | Live data | Operations and on-call engineers; no developer access to data | UAT, after the BAT sign-off and, for go-live, the imported opening balances (§11.3) |

**Per-environment specifics (capture per service if they differ):**

- **Sizing:** [NEEDS CLARIFICATION: replica counts and database size per environment; §18 gives no load numbers to size them]
- **Data refresh:** [NEEDS CLARIFICATION: refresh policy for SIT and UAT; production data never leaves Prod unmasked]
- **Feature flags:** each scheduled job has an enable setting per environment; the hour of the daily waiting-requests message is a setting per environment. [NEEDS CLARIFICATION: the hour the daily waiting-requests message is sent ([REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund) BR-5); a business value for the Refunds Portal owner]
- **DNS:** [NEEDS CLARIFICATION: host names of the two web apps and the gateway per environment]
- **Access controls:** Keycloak per environment with its own realm export; production access through the on-call elevation process. [NEEDS CLARIFICATION: elevation process]
- **Secrets strategy:** Vault per environment; Dev may use local secrets for stubs only; provider credentials only in SIT, UAT, and Prod.
- **Business clock:** every module reads the time through one injected clock (`java.time.Clock`); in Dev, SIT, and UAT an operator can set an offset for the deployable, and Prod has no offset setting. Business rules, deadlines, scheduled jobs, and retention read this clock; token validation, TLS, and log timestamps use real time.

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 14-performance-and-capacity.md | NEXT: 16-operations-runbook.md -->

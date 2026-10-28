<!--
CHUNK: 15
TITLE: Environments
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: 07
PART OF: SDD - Refunds Platform
-->

# 19. Environments

The environment list is locked by the Pre-SDD: dev, test, stage, prod, and dr ([PSDD/OPS-04.1](../pre-sdd-refunds-platform/03g-register-operations.md#ops-04)); dr is the pilot-light recovery copy of prod for the region failure scope ([PSDD/REL-05.1](../pre-sdd-refunds-platform/03c-register-reliability.md#rel-05)), stage runs the zone recovery drill, and the region recovery drill runs on stage with a temporary recovery footprint in the recovery region (a cross-region replica of the stage database and an idle stage deployable), created by the pipeline before the drill and removed after it; both drills run against the RPO and RTO of each scope ([PSDD/REL-05.2](../pre-sdd-refunds-platform/03c-register-reliability.md#rel-05); [PSDD/REL-03.1](../pre-sdd-refunds-platform/03c-register-reliability.md#rel-03), [PSDD/REL-03.2](../pre-sdd-refunds-platform/03c-register-reliability.md#rel-03), [PSDD/REL-04.1](../pre-sdd-refunds-platform/03c-register-reliability.md#rel-04), [PSDD/REL-04.2](../pre-sdd-refunds-platform/03c-register-reliability.md#rel-04), whose figures live in [§8.6.4](./05a-infrastructure-and-network.md#864-backup-and-disaster-recovery)).

| Environment | Purpose | Data | Access | Promotion Source |
|-------------|---------|------|--------|------------------|
| **dev** | Developer integration of the four modules | Generated data; provider stubs | The delivery team | A merge to the main branch |
| **test** | Automated integration and contract tests | Generated data; provider sandboxes once supplied (§15.6) | The delivery team, the pipeline | dev |
| **stage** | Business acceptance, load tests, recovery drills; sized as prod | Generated data shaped like prod; provider sandboxes | The delivery team, the business's acceptance testers | test |
| **prod** | Live service for the pilot branches and then all branches ([REFUNDS 04 § Project Scope](../brd-refunds-portal/04-scope-and-personas.md#project-scope)), and for all members at the Loyalty Points go-live ([LOYALTY 04 § Project Scope](../brd-loyalty-points/04-scope-and-personas.md#project-scope)) | Live data | Customers, members, branch managers, payout staff; operators per §8.7.6 | stage, after the gates of [§11.3](./07-cross-cutting-concerns.md#113-deployment-default) |
| **dr** | Pilot-light recovery region; idle until a region failover | The cross-region replica of prod | Operators during a failover | prod's image, deployed with each prod release |

**Per-environment specifics:**

- **Sizing:** dev and test one replica; stage and prod two or more replicas over two zones; dr zero replicas until failover, then prod's count ([§8.6.2](./05a-infrastructure-and-network.md#862-deployables-per-environment)).
- **Data refresh:** no prod data leaves prod or dr; stage is reloaded from generated data before each acceptance round.
- **Feature flags:** branch switches on in dev, test, and stage for test branches; in prod per the pilot plan, which is open ([PSDD/QD-03](../pre-sdd-refunds-platform/10-validation-risks-unknowns.md#101-validation-and-unknowns)); the Loyalty Points switch on in prod at its go-live.
- **DNS:** one host name per environment under the business's domain: **[NEEDS CLARIFICATION: Which domain and host names does the platform use per environment? Owner: Refunds and Loyalty Product Owner.]**
- **Access controls:** staff and operators through single sign-on; production data access with a second person's approval (§8.7.6).
- **Secrets strategy:** every environment reads its own secrets from the secrets manager; provider credentials per environment; dr holds the replicated prod secrets.

Launch dates, hard deadlines, and change windows of the pilot, the rollout, and Loyalty Points are the Pre-SDD unknown [PSDD/QD-03](../pre-sdd-refunds-platform/10-validation-risks-unknowns.md#101-validation-and-unknowns), open with the Refunds and Loyalty Product Owner (due 2026-11-20).

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 14-performance-and-capacity.md | NEXT: 16-operations-runbook.md -->

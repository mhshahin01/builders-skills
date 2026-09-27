<!--
CHUNK: 15
TITLE: Environments
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: 07
PART OF: SDD - [Project Name]
-->

# 19. Environments

| Environment | Purpose | Data | Access | Promotion Source |
|-------------|---------|------|--------|------------------|
| **Dev** | [Purpose] | [Data] | [Access] | [Source] |
| **SIT** | [Purpose] | [Data] | [Access] | [Source] |
| **UAT** | [Purpose] | [Data] | [Access] | [Source] |
| **Prod** | [Purpose] | [Data] | [Access] | [Source] |

**Per-environment specifics (capture per service if they differ):**

- **Sizing:** [Per-environment sizing rules]
- **Data refresh:** [Refresh policy]
- **Feature flags:** [Per-environment defaults]
- **DNS:** [Naming convention]
- **Access controls:** [Auth + elevation rules]
- **Secrets strategy:** [e.g., Dev uses local .env / SIT+UAT use Sealed Secrets / Prod uses Vault with auto-rotation]

<!-- MASTER: [project-slug]-sdd-master.md | PREV: 14-performance-and-capacity.md | NEXT: 16-operations-runbook.md -->

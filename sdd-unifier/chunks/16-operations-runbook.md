<!--
CHUNK: 16
TITLE: Operations Runbook
PROJECT: [Project Name]
VERSION: [X.X]
DEPENDS_ON: 07, 14
PART OF: SDD - [Project Name]
-->

# 20. Operations Runbook

<!-- Living document. Each procedure should be runnable by an on-call engineer who did not write the service. -->

## 20.1 Common Operations

### 20.1.1 Restart a Service

```text
1. [Step]
2. [Step]
3. [Step]
4. [Step]
5. [Step]
```

### 20.1.2 Clear Cache

```text
1. [Step]
2. [Step]
3. [Step]
4. [Step]
```

### 20.1.3 Replay DLQ Messages

```text
1. [Step]
2. [Step]
3. [Step]
4. [Step]
5. [Step]
```

### 20.1.4 Rotate Secrets

```text
1. [Step]
2. [Step]
3. [Step]
4. [Step]
5. [Step]
```

### 20.1.5 Database Failover

```text
1. [Step]
2. [Step]
3. [Step]
4. [Step]
5. [Step]
6. [Step]
```

### 20.1.6 Tenant-Specific Incident Response

```text
1. [Step]
2. [Step]
3. [Step]
4. [Step]
5. [Step]
```

### 20.1.X [Add additional common operations as needed]

## 20.2 Diagnostics Cheatsheet

| Severity | Symptom | First Check | Likely Cause | Action |
|----------|---------|-------------|--------------|--------|
| [SEV1 / SEV2 / SEV3] | [Symptom] | [Where to look first] | [Likely cause] | [Action] |
| [Severity] | [Symptom] | [Where to look first] | [Likely cause] | [Action] |

## 20.3 On-Call

- **Rotation:** [Rotation policy]
- **Escalation:** [Escalation path]
- **Paging policy:** [SEV1 / SEV2 / SEV3 rules]
- **Post-incident:** [RCA expectations and timelines]

<!-- MASTER: [project-slug]-sdd-master.md | PREV: 15-environments.md | NEXT: 17-appendix-and-wishlist.md -->

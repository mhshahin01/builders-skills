<!--
CHUNK: 02
TITLE: Context - Bounded Context & System Neighbours
PROJECT: [Project Name]
VERSION: [X.X]
PART OF: LLD - [Project Name]
-->

# 5. Context

## 5.1 Bounded Context

<!-- One paragraph. What is the bounded context this LLD covers? -->

[Bounded context statement.]

## 5.2 Upstream Producers (callers / event-publishers into this system)

| Upstream | Interaction | Protocol | Notes |
|----------|-------------|----------|-------|
| [System / Service / Module] | [Sync REST / Async event / In-process port / In-process event / Schedule] | [HTTPS / Kafka / gRPC / In-process] | [Notes] |

## 5.3 Downstream Consumers (systems this LLD's services call / publish to)

| Downstream | Interaction | Protocol | Notes |
|------------|-------------|----------|-------|
| [System / Service / Module] | [Sync REST / Async event / In-process port / In-process event / Schedule] | [HTTPS / Kafka / gRPC / In-process] | [Notes] |

## 5.4 Cross-Service Dependencies (within this LLD)

```mermaid
graph LR
  subgraph "This LLD"
    SVC_A[Service A]
    SVC_B[Service B]
    SVC_C[Service C]
  end
  EXT_X[External: X]
  EXT_Y[External: Y]

  EXT_X -->|REST| SVC_A
  SVC_A -->|Kafka event| SVC_B
  SVC_B -->|Kafka event| SVC_C
  SVC_C -->|REST| EXT_Y
```

**Summary:** [1-2 sentences: which services in this LLD depend on which, and over what.]

> **Convention:** keep this diagram service-level (not class-level). Class-level wiring lives in `04-implementation/<service>.md`. In a modular monolith, label module-to-module edges `in-process: [Port.operation]` or `in-process: [EventName]` (SDD §24.7 and §14.10), never as REST or topic edges.

> Miro: [optional whiteboard view URL]

## 5.5 Shared Conventions (apply to every service in scope)

- **Auth:** [Keycloak realm strategy / OAuth2 server / mTLS - per CLAUDE.md default unless overridden]
- **Tenant resolution:** [Header / JWT claim / subdomain - per CLAUDE.md multi-tenancy strategy]
- **Correlation ID:** [Header name and propagation rule]
- **Time zone:** UTC for all timestamps (CLAUDE.md default).
- **ID strategy:** UUIDv7 generated at the service layer (CLAUDE.md default).

<!-- MASTER: [project-slug]-lld-master.md | PREV: 01-purpose-and-scope.md | NEXT: 03-architecture.md -->

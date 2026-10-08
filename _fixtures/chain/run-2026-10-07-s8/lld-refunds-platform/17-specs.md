<!--
CHUNK: 17
TITLE: Specs
PROJECT: Refunds Platform
VERSION: 1.2
PART OF: LLD - Refunds Platform
MODE: from-sdd
-->

# Specs

## 1. Mission

Refunds Platform lets retail customers request and follow branch refunds while branch managers decide them and approved amounts return to the original card. It also lets members understand their loyalty points, applies paid-refund take-backs, and lets Loyalty Administrators correct upheld errors. The outcome is consistent refund and points records, with the refund-time objective and upheld-complaint measure assessed by their business owners.

## 2. Tech Stack

- **Backend:** Java 21, Spring Boot 3.5+, Spring Modulith (module boundaries and the event publication registry), Resilience4j, Flyway. Java 21; Spring Boot 3.5+.
- **Frontend:** Angular 17+ standalone components, PrimeNG, Tailwind; two apps: Refunds Portal web and Loyalty Points web. Angular 17+.
- **Mobile:** Not applicable; responsive web only.
- **Data:** PostgreSQL, one database refunds_platform, one schema per module plus platform for the publication log. PostgreSQL 17+. No cache, object storage or BI layer for this release.
- **Messaging:** No broker/integration topics for this release; durable in-process events through the Spring Modulith publication registry. No broker version pin applies.

The resolved stack and each absent version pin are in [§6.3](./03-architecture.md#63-runtime-stack); no local pin is added here. SDD §6 also owns Kubernetes/containerd/NGINX, Keycloak/Vault/gateway and Loki/Prometheus/Grafana/OpenTelemetry/Tempo versions and CI/hosting gaps.

## 3. Roadmap

| Phase | Scope | Services / UC IDs |
| --- | --- | --- |
| P1 - Platform and identity | Tenant/RLS, runtime, schema migrations, Keycloak and account code flow | customer-accounts; REFUNDS/UC-06 |
| P2 - Refund requests | Receipt lookup, own status and cancellation | refund-requests; REFUNDS/UC-01, REFUNDS/UC-02, REFUNDS/UC-03 |
| P3 - Decisions and delivery | Branch scope/decision/report, payout attempts and notification work | refund-requests, payouts, notifications; REFUNDS/UC-04 |
| P4 - Points ledger and views | Purchase/member/import feeds, paid-refund applications, balance/history | loyalty-points; LOYALTY/UC-01, LOYALTY/UC-02 |
| P5 - Correction and readiness | Corrections/report, retention, recovery, source acceptance | loyalty-points and all five modules; LOYALTY/UC-03 |

These are implementation phases within this release, not new releases or product gates. External contracts and source BAT prerequisites control readiness.

## 4. Project Type

**Selected:** Greenfield. **Justification:** [SDD §1](../sdd-refunds-platform/01-executive-summary-scope-risks.md) records a new platform to implement both BRDs, with no existing application code supplied. **LLD direction taken:** from-sdd.


<!-- MASTER: refunds-platform-lld-master.md | PREV: 16-references.md | NEXT: 18-open-items-and-clarifications.md -->

<!--
CHUNK: 05
TITLE: Target Shape
PROJECT: Refunds Platform
VERSION: 1.0
DEPENDS_ON: 02, 03a-03h, 04
PART OF: Pre-SDD - Refunds Platform
-->

# 5. Target Shape

## 5.1 Shape

<!-- ENGINE-FRAGMENT: 05-target-shape.md -->
| Aspect | Shape | Basis |
|---|---|---|
| Hosting | cloud | HDR-08.1 |
| Topology | Primary + independent recovery location (regional) | REL-05.1 |
| DR strategy, scope region | Pilot Light (pilot), replication asynchronous | REL-05.1, REL-03.1, REL-04.1 |
| DR strategy, scope az | Local HA only · broader DR not scoped (localHA), replication asynchronous | REL-05.2, REL-03.2, REL-04.2 |
| Data | kind relational, consistency strong, replication asynchronous (region), asynchronous (az) | DAT-01.1, DAT-05.1, REL-04.1 |
| Network | public | INT-08.1 |
<!-- /ENGINE-FRAGMENT -->

## 5.2 Diagrams

### 5.2.1 Infrastructure

```mermaid
flowchart LR
  %% Infrastructure Architecture · GF-CL - PROPOSED / NOT AN APPROVED DESIGN
  %% canonical component NODE-CLIENT
  CLIENT["Consumers - Product flows from BRD"]
  %% canonical component NODE-DNS
  DNS["Routing & health checks - global/shared boundary TBD"]
  %% canonical component NODE-EDGE
  EDGE["L7 ingress + security - Primary ingress · public candidate"]
  %% canonical component NODE-APP-A
  APP_A["Application tier - Application execution A"]
  %% canonical component NODE-DB-PRIMARY
  DB_PRIMARY["Relational transactional store - System of record (candidate)"]
  %% canonical component NODE-BACKUP
  BACKUP["Backups / restore points - retention & isolation TBD"]
  %% canonical component NODE-APP-B
  APP_B["Application tier - Application execution B"]
  %% canonical component NODE-DB-SECONDARY
  DB_SECONDARY["HA standby / replica - Same-region failover semantics TBD"]
  %% canonical component NODE-RECOVERY-APP
  RECOVERY_APP["Recovery app capacity - DR: Pilot Light"]
  %% canonical component NODE-RECOVERY-DB
  RECOVERY_DB["Recoverable data copy - Lag & promotion semantics TBD"]
  CLIENT -->|request| DNS
  DNS -->|route| EDGE
  EDGE -->|traffic| APP_A
  APP_A -->|reads/writes| DB_PRIMARY
  DB_PRIMARY -->|backup| BACKUP
  EDGE -->|route| APP_B
  DB_PRIMARY -->|replicate| DB_SECONDARY
  DNS -->|failover| RECOVERY_APP
  DB_PRIMARY -->|replicate/restore| RECOVERY_DB
  classDef proposed fill:#e8f3f6,stroke:#368b94,color:#15354b;
  class CLIENT,DNS,EDGE,APP_A,DB_PRIMARY,BACKUP,APP_B,DB_SECONDARY,RECOVERY_APP,RECOVERY_DB proposed;
```

The infrastructure is one primary cloud region with application capacity in two zones and a relational store with a same-region standby, plus a recovery region that holds a recoverable data copy and pilot-light application capacity reached by failover routing. Backups sit beside the primary store; their retention and isolation are left to the SDD.

### 5.2.2 Network

```mermaid
flowchart LR
  %% Network Architecture · LOGICAL - PROPOSED / NOT AN APPROVED DESIGN
  %% canonical component NODE-N-CLIENT
  N_CLIENT["External clients - Boundary / requests"]
  %% canonical component NODE-N-DNS
  N_DNS["DNS / traffic direction - Global / shared managed control"]
  %% canonical component NODE-N-ENTRY
  N_ENTRY["WAF / managed edge policy - Public access candidate"]
  %% canonical component NODE-N-PERIMETER
  N_PERIMETER["Internet ingress boundary - Internet edge / approved routes TBD"]
  %% canonical component NODE-N-LB
  N_LB["Layer-7 load balancer - LB ingress in allowed public zone(s)"]
  %% canonical component NODE-N-APP-A
  N_APP_A["Private application tier A - Compute in Availability Zone A / private subnets"]
  %% canonical component NODE-N-DB-A
  N_DB_A["Restricted data access A - Private DB network / endpoint"]
  %% canonical component NODE-N-EGRESS
  N_EGRESS["NAT / outbound egress - Candidate only if internet egress needed"]
  %% canonical component NODE-N-SERVICE
  N_SERVICE["Private service endpoint - Service network interface/boundary TBD"]
  %% canonical component NODE-N-APP-B
  N_APP_B["Private application tier B - Compute in Availability Zone B / private subnets"]
  %% canonical component NODE-N-DB-B
  N_DB_B["Standby / data access B - Replication and failover TBD"]
  %% canonical component NODE-N-DR-NET
  N_DR_NET["Standby recovery ingress - Failover path & trust controls TBD"]
  %% canonical component NODE-N-DR-APP
  N_DR_APP["Recovery application capacity - Standby activation/scale-up TBD"]
  %% canonical component NODE-N-DR-DB
  N_DR_DB["Recovery database / replica - Replication lag & promotion TBD"]
  N_CLIENT -->|DNS / access| N_DNS
  N_DNS -->|request policy| N_ENTRY
  N_ENTRY -->|front-end request| N_LB
  N_LB -->|L7/private app| N_APP_A
  N_APP_A -->|restricted DB| N_DB_A
  N_APP_A -->|outbound candidate| N_EGRESS
  N_APP_A -->|private service| N_SERVICE
  N_EGRESS -->|egress route| N_PERIMETER
  N_LB -->|AZ balance| N_APP_B
  N_APP_B -->|data access| N_DB_B
  N_DB_A -->|replicate| N_DB_B
  N_DNS -->|recovery route| N_DR_NET
  N_DR_NET -->|activate / route| N_DR_APP
  N_DR_APP -->|data access| N_DR_DB
  N_DB_A -->|replicate / lag TBD| N_DR_DB
  classDef proposed fill:#e8f3f6,stroke:#368b94,color:#15354b;
  class N_CLIENT,N_DNS,N_ENTRY,N_PERIMETER,N_LB,N_APP_A,N_DB_A,N_EGRESS,N_SERVICE,N_APP_B,N_DB_B,N_DR_NET,N_DR_APP,N_DR_DB proposed;
```

Customers, members and branch managers reach the platform over a public ingress with an edge policy and a layer-7 balancer that spreads traffic over two zones of private application and data networks. A separate recovery ingress, application and data path waits in the recovery region; outbound egress exists only where a partner call needs it.

### 5.2.3 Disaster Recovery

```mermaid
flowchart LR
  %% Recovery Architecture & Sequence - PROPOSED / NOT AN APPROVED DESIGN
  %% canonical component NODE-D-OBS
  D_OBS["Detect / declare incident - Health signals & decision"]
  %% canonical component NODE-D-TRAFFIC
  D_TRAFFIC["Traffic switching - DNS / LB / global route"]
  %% canonical component NODE-D-APP
  D_APP["Primary application - Workload & state"]
  %% canonical component NODE-D-DB
  D_DB["Primary committed data - Durability contract"]
  %% canonical component NODE-D-BACKUP
  D_BACKUP["Protected recovery points - Restore drills & isolation"]
  %% canonical component NODE-D-RECAPP
  D_RECAPP["Scale pilot-light app - Strategy: Pilot Light"]
  %% canonical component NODE-D-RECDB
  D_RECDB["Recovery copy / restore - Lag & promotion require proof"]
  %% canonical component NODE-D-VERIFY
  D_VERIFY["Business service verification - IAM · correctness · customer access"]
  D_OBS -->|authorize| D_TRAFFIC
  D_APP -->|writes| D_DB
  D_DB -->|protect| D_BACKUP
  D_DB -->|replicate / restore| D_RECDB
  D_TRAFFIC -->|reroute| D_RECAPP
  D_RECDB -->|data ready| D_RECAPP
  D_RECAPP -->|check| D_VERIFY
  classDef proposed fill:#e8f3f6,stroke:#368b94,color:#15354b;
  class D_OBS,D_TRAFFIC,D_APP,D_DB,D_BACKUP,D_RECAPP,D_RECDB,D_VERIFY proposed;
```

A declared region incident switches traffic to the recovery region, where the pilot-light application scales up on the replicated data copy and the business service is verified before customers return. The lag of the copy and its promotion must be proven in a drill.

### 5.2.4 Data

```mermaid
flowchart LR
  %% Data Flow · Candidate Ownership - PROPOSED / NOT AN APPROVED DESIGN
  %% canonical component NODE-DF-INPUT
  DF_INPUT["Input / caller - UC not invented"]
  %% canonical component NODE-DF-APP
  DF_APP["Application services - BRD-derived behavior in SDD"]
  %% canonical component NODE-DF-DB
  DF_DB["Authoritative data workload - Relational transactional store"]
  %% canonical component NODE-DF-BACK
  DF_BACK["Backup / archive - Retention/restore evidence"]
  %% canonical component NODE-DF-EXTRA-1
  DF_EXTRA_1["Additional store: Points ledger - relational; consistency: strong"]
  DF_INPUT -->|requests| DF_APP
  DF_APP -->|transaction/data| DF_DB
  DF_DB -->|protect| DF_BACK
  DF_APP -->|access pattern TBD| DF_EXTRA_1
  classDef proposed fill:#e8f3f6,stroke:#368b94,color:#15354b;
  class DF_INPUT,DF_APP,DF_DB,DF_BACK,DF_EXTRA_1 proposed;
```

The refund workload (DAT-01.1) is the authoritative relational store with backup and archive, and the points ledger (DAT-01.2) is a second relational, strongly consistent store. How the application reaches the ledger is left to the SDD.

## 5.3 Reading the Shape

The shape follows the register: the cloud target (HDR-08.1, rule ARCH-01) with two failure scopes, region (REL-05.1) and az (REL-05.2). For scope region, REL-03.1 and REL-04.1 give a pilot-light recovery region with asynchronous replication (rule DR-03@region); for scope az, REL-03.2 and REL-04.2 give local high availability with asynchronous replication (rule DATA-08@az measures the replication lag against REL-04.2). Both data workloads are relational and strongly consistent (DAT-01.1, DAT-01.2, DAT-05.1, DAT-05.2; rule DB-10), and the network is public (INT-08.1). Residency keeps both regions within the European Union (DAT-04.1, rule SEC-11). The shape has no conflict (chunk 10). The products, the provider, the number of zones beyond the shape, and the failover mechanics are left to the SDD.

<!-- MASTER: refunds-platform-pre-sdd-master.md | PREV: 04-targets-and-calculations.md | NEXT: 07-options-and-economics.md -->

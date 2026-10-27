<!-- SHARED: mermaid-syntax.md | HOME: lld-unifier | COPIES: brd-unifier, sdd-unifier | Each skill reads only its own copy. Edit the HOME copy, then copy it byte for byte to every COPIES skill in the same change. _fixtures/checkers/check_shared.py compares the copies. -->

# Mermaid Syntax Quick Reference

Examples of the dialects the unifier skills use. A skill's own rules for labels and diagrams win where they differ from an example here.

## `sequenceDiagram`

```mermaid
sequenceDiagram
  participant A
  participant B
  A->>B: synchronous call
  B-->>A: synchronous response
  A-)B: asynchronous call (no response expected)
  B--xA: failed call
  Note over A,B: Note text
  alt happy path
    A->>B: ok
  else error
    A--xB: failed
  end
```

## `classDiagram`

```mermaid
classDiagram
  class FooStrategy {
    <<interface>>
    +calculate(input) Result
  }
  class BasicStrategy
  class ProStrategy
  class FooContext {
    -Map~Tier, FooStrategy~ strategies
    +execute(input, tier) Result
  }
  FooStrategy <|.. BasicStrategy
  FooStrategy <|.. ProStrategy
  FooContext --> FooStrategy
```

Roles:
- `<|--` inheritance.
- `<|..` interface implementation.
- `--*` composition.
- `--o` aggregation.
- `-->` association.

## `stateDiagram-v2`

```mermaid
stateDiagram-v2
  [*] --> DRAFT
  DRAFT --> ACTIVE : activate [required fields present]
  ACTIVE --> SUSPENDED : suspend
  SUSPENDED --> ACTIVE : resume
  ACTIVE --> DELETED : delete
  DELETED --> [*]
```

## `erDiagram`

```mermaid
erDiagram
  WALLET ||--o{ LEDGER_ENTRY : has
  WALLET {
    uuid id PK
    uuid tenant_id FK
  }
  LEDGER_ENTRY {
    uuid id PK
    uuid wallet_id FK
    uuid tenant_id FK
  }
```

Cardinalities:
- `||--||` one-to-one.
- `||--o{` one-to-many.
- `}o--o{` many-to-many.

## `graph` / `flowchart`

```mermaid
graph TB
  GW[API Gateway] --> SVC_A[Service A]
  SVC_A --> DB_A[(PostgreSQL)]
  SVC_A -.publish.-> KAFKA[(Kafka)]
  KAFKA -.consume.-> SVC_B[Service B]
```

Node shapes:
- `[ ]` rectangle.
- `( )` rounded.
- `(( ))` circle.
- `[( )]` cylinder (DB).
- `{ }` rhombus (decision).

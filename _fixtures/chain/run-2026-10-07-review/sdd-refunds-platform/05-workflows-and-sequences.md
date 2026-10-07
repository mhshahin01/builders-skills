<!--
CHUNK: 05
TITLE: System Design - Workflow & Sequence Diagrams
PROJECT: Refunds Platform
VERSION: 1.2
DEPENDS_ON: 04
PART OF: SDD - Refunds Platform
-->

## 8.4 Workflow Diagrams

### 8.4.1 Workflow: Refund request to payout

**Use cases:** [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund), [REFUNDS/UC-03](../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request), [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)

**Figure 4: Workflow - Refund request to payout**

```mermaid
flowchart TD
  A["Customer enters receipt number and total - POST /v1/receipt-lookups"] --> B{"Receipt check through POS Records - API-01"}
  B -- "E1 to E5" --> X1(["No request, the customer is told why"])
  B -- "items shown" --> C["Customer selects items and a reason, submits - POST /v1/refund-requests"]
  C --> D{"Refund window still open?"}
  D -- "no, E1" --> X1
  D -- "yes" --> E["Submitted with a reference number - RefundRequestSubmitted"]
  E --> F["Messages to the customer, items in the request reported to POS Records - API-02"]
  F --> G{"Customer cancels, or branch manager decides"}
  G -- "REFUNDS/UC-03 cancel" --> H["Cancelled - RefundRequestCancelled"]
  G -- "REFUNDS/UC-04 A2 reject" --> I["Rejected - RefundRequestRejected"]
  G -- "REFUNDS/UC-04 approve, A1 lower amount" --> J["Approved - RefundRequestApproved"]
  J --> K["payouts sends the payout - API-03, retries until the payout deadline"]
  K -- "PayoutSucceeded" --> L["Paid - RefundPaid: customer told, points taken back"]
  K -- "PayoutFailedFinally" --> M["Payout failed - RefundPayoutFailed: branch manager and customer told"]
```

**Summary:** A receipt check against POS Records either stops the customer with a reason or shows the items; a submitted request is recorded as Submitted, the customer is told, and POS Records learns its items. The request then ends Cancelled, Rejected, Paid, or Payout failed, and every end state frees or settles the items and tells the people concerned.

### 8.4.2 Workflow: Points from purchases and paid refunds

**Use cases:** [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history), [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)

**Figure 5: Workflow - Points from purchases and paid refunds**

```mermaid
flowchart TD
  P["POS Records reports a member purchase - API-07"] --> Q{"Earns points for this member?"}
  Q -- "0 points, repeat, before go-live, or before the rejoin day" --> N(["No movement"])
  Q -- "yes" --> R["Earned movement: 1 point per 1 EUR paid, rounded down"]
  R --> S{"A paid refund waits for this purchase?"}
  S -- "yes" --> T["Apply the waiting take-back"]
  S -- "no" --> U(["Balance updated"])
  T --> U
  RP["refund-requests marks a refund Paid - RefundPaid"] --> V{"Does the refunded purchase show for a member?"}
  V -- "not yet" --> W["Keep the refund waiting until the purchase shows"]
  V -- "yes, for each member who has it" --> X["Take back the points the refund removes, capped at the balance"]
  X --> U
```

**Summary:** A reported purchase becomes an Earned movement unless a rule gives it no points, and a refund the Refunds Portal pays takes back the points the refund removes, capped at the balance. A paid refund whose purchase does not show yet waits and is applied when the purchase shows ([LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history) BR-5: take-back recorded when the purchase shows).

### 8.4.3 Workflow: Customer sign-up and sign-in

**Use cases:** [REFUNDS/UC-06](../brd-refunds-portal/06a-use-cases-customer.md#uc-06-sign-up-and-sign-in)

**Figure 6: Workflow - Customer sign-up and sign-in**

```mermaid
flowchart TD
  A{"Customer already has an account?"}
  A -- "yes, A1" --> B["Keycloak sign-in page: email address and password"]
  B -- "no match, E4" --> B
  B -- "forgotten password, A3" --> R["POST /v1/password-resets: code by email"]
  R --> RC["Customer enters the code and a new password"]
  RC --> S(["Signed in"])
  B -- "match" --> S
  A -- "no" --> C["POST /v1/sign-ups: email address, mobile number, password, notice shown"]
  C -- "email address used, E2" --> B
  C --> D["Codes sent by email and SMS through notifications - API-14, API-05"]
  D -- "partner does not answer, E3" --> X(["Try again later"])
  D --> E["Customer enters both codes"]
  E -- "wrong or expired, E1" --> F["New code on request"]
  F --> E
  E -- "both codes right" --> G["Account created and enabled"]
  G --> S
```

**Summary:** A new customer signs up, receives a code by email and one by SMS, confirms both, and is signed in; a customer with an account signs in on the Keycloak page, can retry after wrong details, or resets a forgotten password with an emailed code. When the Notification Partner does not answer, no code is sent and the customer is asked to try again later.

## 8.5 Sequence Diagrams

### 8.5.1 Sequence: Submit a refund request

**Use cases:** [REFUNDS/UC-01](../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund)

**Figure 7: Sequence - Submit a refund request**

```mermaid
sequenceDiagram
  participant C as Customer web app
  participant GW as API gateway
  participant RR as refund-requests
  participant POS as POS Records
  participant PL as Publication log
  participant NO as notifications
  participant CA as customer-accounts
  participant NP as Notification Partner
  C->>GW: POST /v1/receipt-lookups
  GW->>RR: forward with identity context
  RR->>POS: API-01 look up the receipt
  POS-->>RR: items, amounts, payment, branch, purchase date
  RR-->>C: items with selectable flags and refund amounts
  C->>GW: POST /v1/refund-requests with Idempotency-Key
  GW->>RR: forward with identity context
  RR->>RR: check the window again, save Submitted with a reference number
  RR->>PL: RefundRequestSubmitted in the same transaction
  RR-->>C: 201 with the reference number
  PL-)NO: RefundRequestSubmitted
  PL-)CA: RefundRequestSubmitted
  PL-)RR: RefundRequestSubmitted to the POS adapter
  NO->>CA: API-12 get customer contact
  NO->>NP: API-05 email and SMS
  RR->>POS: API-02 item state held
```

**Summary:** The receipt lookup is a synchronous call to POS Records, and the submission saves the request and its `RefundRequestSubmitted` event in one transaction. After commit, notifications sends the email and SMS, customer-accounts counts the linked request, and the POS adapter reports the items in the request.

### 8.5.2 Sequence: Refund decision, payout, and points take-back

**Use cases:** [REFUNDS/UC-04](../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund), [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history)

**Figure 8: Sequence - Refund decision, payout, and points take-back**

```mermaid
sequenceDiagram
  participant BM as Branch Manager web app
  participant RR as refund-requests
  participant PA as payouts
  participant PP as Payment Provider
  participant NO as notifications
  participant NP as Notification Partner
  participant LP as loyalty-points
  BM->>RR: POST decision approve, with Idempotency-Key
  RR->>RR: check branch scope and Submitted, lock the purchase, check the card-paid amount left, save Approved
  RR-)PA: RefundRequestApproved
  RR-->>BM: 200 Approved
  PA->>PP: API-03 send payout with the attempt key
  PP-->>PA: accepted
  PP->>PA: API-04 payout result
  alt payout succeeded
    PA-)RR: PayoutSucceeded
    RR->>RR: save Paid
    RR-)NO: RefundPaid
    RR-)LP: RefundPaid
    NO->>NP: API-05 amount paid, and the reason for a partial approval
    LP->>LP: take back points, capped at the balance
  else refused and still failing at the payout deadline
    PA-)RR: PayoutFailedFinally
    RR->>RR: save Payout failed
    RR-)NO: RefundPayoutFailed
    NO->>NP: API-05 messages to the branch manager, the cover, and the customer
  end
```

**Summary:** An approval saves Approved and hands the payout to payouts through `RefundRequestApproved`; payouts calls the Payment Provider with one key per attempt and retries until the provider pays or the payout deadline (§17.3) passes. A success marks the request Paid and fires `RefundPaid`, which notifications and loyalty-points both handle; a final failure marks it Payout failed and tells the branch manager, the cover, and the customer.

### 8.5.3 Sequence: Sign-up with confirmation codes

**Use cases:** [REFUNDS/UC-06](../brd-refunds-portal/06a-use-cases-customer.md#uc-06-sign-up-and-sign-in)

**Figure 9: Sequence - Sign-up with confirmation codes**

```mermaid
sequenceDiagram
  participant C as Customer web app
  participant CA as customer-accounts
  participant KC as Keycloak
  participant NO as notifications
  participant NP as Notification Partner
  C->>CA: POST /v1/sign-ups with email address, mobile number, password
  CA->>KC: create a disabled user with the password
  par email code
    CA->>NO: API-14 send the email code now
    NO->>NP: API-05 email
  and SMS code
    CA->>NO: API-14 send the SMS code now
    NO->>NP: API-05 SMS
  end
  alt the partner does not answer
    NO-->>CA: NotificationPartnerUnavailable
    CA-->>C: 503 try again later, E3
  else both codes sent
    CA-->>C: 201 with the sign-up id
  end
  C->>CA: POST confirmation with both codes and the password
  CA->>CA: check each code: right, 15 minutes, latest only
  CA->>KC: enable the user with the CUSTOMER role
  CA->>KC: obtain the first token set through refunds-platform-sign-in
  CA-->>C: 200 account created, tokens returned, customer signed in
```

**Summary:** Sign-up creates a disabled Keycloak user and sends both codes concurrently through notifications under one shared deadline (§12 INT-02), so a partner that does not answer gives the customer an immediate try-again message. Confirming both codes enables the user, and customer-accounts obtains the customer's first token set from Keycloak, so the customer is signed in at once.

### 8.5.4 Sequence: Member views points

**Use cases:** [LOYALTY/UC-01](../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance), [LOYALTY/UC-02](../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history)

**Figure 10: Sequence - Member views points**

```mermaid
sequenceDiagram
  participant M as Member web app
  participant KC as Keycloak
  participant MS as Member sign-in
  participant GW as API gateway
  participant LP as loyalty-points
  M->>KC: OIDC sign-in
  KC->>MS: API-10 brokered sign-in
  MS-->>KC: identity with member number
  KC-->>M: token with MEMBER role and member number
  M->>GW: GET /v1/points-balance
  GW->>LP: forward with identity context
  alt not a member or a former member
    LP-->>M: 404 no loyalty points account, E2
  else member
    LP-->>M: balance and date of the newest movement
  end
  M->>GW: GET /v1/points-movements first page
  GW->>LP: forward with identity context
  LP-->>M: movements since the member last joined, newest first
```

**Summary:** The member signs in through the brokered member sign-in, and the token carries the member number. loyalty-points answers the balance and the first page of the history from its own schema, or says the customer has no loyalty points account.

### 8.5.5 Sequence: Correct a member's points

**Use cases:** [LOYALTY/UC-03](../brd-loyalty-points/06b-use-cases-loyalty-administrator.md#uc-03-correct-a-members-points)

**Figure 11: Sequence - Correct a member's points**

```mermaid
sequenceDiagram
  participant LA as Loyalty Administrator web app
  participant KC as Keycloak
  participant SS as Staff sign-in
  participant LP as loyalty-points
  LA->>KC: OIDC sign-in
  KC->>SS: API-11 brokered sign-in
  SS-->>KC: staff identity with the Loyalty Administrator role
  KC-->>LA: token with LOYALTY_ADMINISTRATOR role
  LA->>LP: GET /v1/members/memberNumber/points
  LP-->>LA: balance and history since the member last joined, or no member matches
  LA->>LP: POST point correction with reason, with Idempotency-Key
  alt no reason, E2
    LP-->>LA: 400 VALIDATION_FAILED
  else E3 to E6 refusal
    LP-->>LA: 422 with the reason for the refusal
  else accepted
    LP->>LP: save the Corrected movement with who and when, update the balance
    LP-->>LA: 201 with the new balance
  end
```

**Summary:** The Loyalty Administrator signs in through the brokered staff sign-in, finds the member by member number, and posts a correction. loyalty-points refuses a correction with no reason as a validation error (E2) and one that breaks a rule with the reason for the refusal (E3 to E6), or saves the Corrected movement with who made it and when, and returns the new balance.

<!-- MASTER: refunds-platform-sdd-master.md | PREV: 04-architecture-style-and-diagrams.md | NEXT: 06-principles-and-decisions.md -->

<!--
CHUNK: 03
TITLE: Definitions & Important Details
PROJECT: Refunds Portal
VERSION: 1.4
DEPENDS_ON: 02
PART OF: BRD - Refunds Portal
LANGUAGE: Business language only. Explain domain concepts as the business understands them - lifecycles, rules, relationships. No data-schema, protocol, or implementation detail; that is owned by the SDD.
-->

# Definitions & Important Details

## Refund request

### Overview

A refund request is how a customer asks for money back for items bought in a branch. Every request is recorded, so it is never lost and the customer can see where it stands.

**[NEEDS CLARIFICATION: Must the customer return the items to the branch before the branch manager approves a refund?]**

### Refund request lifecycle

- The customer **submits** the request. Its status is **Submitted**.
- The branch manager **approves** it, in full or in part. Its status becomes **Approved**.
- Or the branch manager **rejects** it with a reason. Its status becomes **Rejected**.
- An approved request becomes **Paid** once the payout succeeds.
- An approved request whose payout waits for a card dispute becomes **Rejected** if the customer's bank gives the money back ([06b / UC-04 BR-8](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund)).
- The customer can **cancel** a request while it is still Submitted. Its status becomes **Cancelled**.

Paid means the payment provider has accepted the payout. The money can take some days to show on the customer's card statement. If the customer's bank sends a Paid payout back, for example because the card is closed, the request goes back to Approved and follows [06b / UC-04 E1](./06b-use-cases-branch-manager.md#uc-04-approve--reject-refund).

### Customer messages

Every message to the customer goes by email and SMS, except where this table says otherwise.

| Status change | Customer message | Source |
|---------------|------------------|--------|
| Submitted | Email and SMS, with the reference number | UC-01 step 7 |
| Approved in part | Email and SMS, with the approved amount and the reason | UC-04 A1 |
| Approved in full | Email and SMS, with the approved amount | UC-04 step 8 |
| Rejected | Email and SMS, with the reason | UC-04 A2; UC-04 BR-8 |
| Back to Approved (a Paid payout is sent back) | Email and SMS, saying the payout is delayed | UC-04 E1 |
| Paid | Email and SMS, saying when the money usually shows on the card: within **[NEEDS CLARIFICATION: How many days after the payout does a refund usually show on the customer's card statement?]** days | UC-04 step 9 |
| Cancelled | Email only | UC-03 step 5 |

A message that does not reach the customer never stops or changes a refund request. The customer can always see the current status in UC-02.

### Decision record

For every status change, the portal records who made it (the customer, the branch manager, the portal for a payout result or a dispute outcome, or the staff member who records a payout result by hand), the date and time, the amount, and the reason when one is given. When a staff member records by hand that a payout was paid, a second staff member must confirm it before the request becomes Paid. The decision record keeps both. Nobody can change this record, and it is deleted only when the retention period of [NFR-06](./10-nfrs.md#non-functional-requirements) ends. **[NEEDS CLARIFICATION: Who, besides the branch manager of the branch, may view the decision record?]**

## Branch ownership

### Overview

Each purchase belongs to exactly one branch, and so does each refund request. Branch managers decide only on their own branch's requests.

**[NEEDS CLARIFICATION: Who decides on a branch's refund requests when its branch manager is away or the post is vacant?]**

## Customer identity

### Overview

A customer must prove who they are before the portal shows a receipt's items, lists their refund requests, or lets them cancel one. A customer sees and acts only on the refund requests they submitted. **[NEEDS CLARIFICATION: How does a customer prove who they are: by signing in to a customer account, by a one-time code sent to their email or mobile number, or another way?]**

<!-- MASTER: refunds-portal-brd-master.md | PREV: 02-glossary-assumptions-facts.md | NEXT: 04-scope-and-personas.md -->

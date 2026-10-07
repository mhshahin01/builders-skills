<!--
CHUNK: 03
TITLE: Definitions & Important Details
PROJECT: Refunds Portal
VERSION: 1.0
DEPENDS_ON: 02
PART OF: BRD - Refunds Portal
LANGUAGE: Business language only. Explain domain concepts as the business understands them - lifecycles, rules, relationships. No data-schema, protocol, or implementation detail; that is owned by the SDD.
-->

# Definitions & Important Details

## Refund request lifecycle

A refund request is **Submitted** by the customer. The branch manager then **Approves** it (in full or in part) or **Rejects** it with a reason. An approved request becomes **Paid** once the payout succeeds. A customer can **Cancel** a request while it is still Submitted.

## Branch ownership

Each purchase, and so each refund request, belongs to exactly one branch. Branch managers decide only on their own branch's requests.

<!-- MASTER: refunds-portal-brd-master.md | PREV: 02-glossary-assumptions-facts.md | NEXT: 04-scope-and-personas.md -->

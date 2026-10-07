<!--
CHUNK: 03
TITLE: Definitions & Important Details
PROJECT: Loyalty Points
VERSION: 1.5
DEPENDS_ON: 02
PART OF: BRD - Loyalty Points
LANGUAGE: Business language only. Explain domain concepts as the business understands them - lifecycles, rules, relationships. No data-schema, protocol, or implementation detail; that is owned by the SDD.
-->

# Definitions & Important Details

## Points movement

### Overview

Every change to a member's balance is a points movement. While a person is a member, their balance is the sum of their movements since they last joined. The balance is never below 0. A purchase that earns 0 points, or a refund that takes back 0 points, adds no movement.

### Movement types

- **Earned**: the member makes a branch purchase. The purchase earns 1 point per 1 EUR of the amount the member paid, after discounts. The system rounds down to whole points on each purchase. Example: a 12.80 EUR purchase earns 12 points.
- **Taken back**: the Refunds Portal pays a refund for a purchase. The system takes back points earned on that purchase ([UC-02](./06a-use-cases-member.md#uc-02-view-points-history), Business Rules).
- **Opening balance**: the points a member held at the start of the go-live date. The system records it once, as the member's first movement, dated on the go-live date. A member who held 0 points at the start of the go-live date gets no Opening balance movement. A purchase made on or after the go-live date earns points under the earning rule above. A purchase made before the go-live date earns no points in this product: its points are part of the opening balance. A refund of a purchase made before the go-live date takes back no points.
- **Corrected**: a Loyalty Administrator adds or removes points to fix a wrong balance (UC-03, chunk 06b).

### Structure

Each movement belongs to one member. An Earned movement comes from one purchase. A Taken back movement comes from one refund of a purchase that earned points. A purchase can have more than one refund.

An Opening balance movement comes from no purchase. A Corrected movement comes from no purchase or refund, except a correction for a missing purchase, which names that purchase. That purchase then counts as having earned the corrected points (UC-03, chunk 06b). If POS Records later reports that purchase for another member, that member earns its points as usual (UC-03, chunk 06b). A refund of that purchase then takes back points from both members (UC-03, chunk 06b).

Apart from that case, a purchase earns points once, however many times it is reported. A refund takes back points once, however many times it is reported. The system recognises a repeat by its purchase reference or refund reference.

### Expiry

Points do not expire.

## Membership end and data retention

- While a person is a member, the system keeps every points movement since they last joined (UC-02).
- When a member leaves the loyalty program, their points end: from then on they have no points balance, and no new movements are added.
- A former member who rejoins starts with no points. Their balance counts only the movements from the day they rejoin. A purchase made before the day they rejoin, and any refund of it, does not change their balance. A member who rejoins on the day they left counts as rejoining on the next day. Until then, they count as a former member. A purchase made on or after the day a member rejoins earns points. This holds even if this product learns of the rejoin only after POS Records reports the purchase.
- Their earlier movements stay as former-member history until the retention period ends. Former-member history is not shown in UC-01, UC-02, or UC-03.
- The system keeps a former member's points history for 24 months after they leave, then deletes it. A deletion request does not shorten this period.

<!-- MASTER: loyalty-points-brd-master.md | PREV: 02-glossary-assumptions-facts.md | NEXT: 04-scope-and-personas.md -->

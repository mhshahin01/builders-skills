<!--
CHUNK: 09
TITLE: Reporting & Analytics
PROJECT: Refunds Portal
VERSION: 1.8
DEPENDS_ON: 05
PART OF: BRD - Refunds Portal
LANGUAGE: Business language only. Describe what each report shows and who reads it - not where the data is stored or how it is produced.
-->

# Reporting / Analytics

| Report / View | What It Shows | Audience | Frequency | Format |
|---------------|---------------|----------|-----------|--------|
| Branch refund report | Requests per status and amounts paid as of the end of the previous day in the branch's local time, for all of its requests submitted by then. The average time to decision is the mean elapsed time from Submitted to the first approval or rejection for requests decided by then; cancellations with no decision are excluded. The average time from Submitted to Paid is the mean elapsed time for requests Paid by then, including the customer's return trip. Each mean is total elapsed hours divided by its request count. An empty sample shows no average, not 0. Requests still Submitted or Approved remain visible in their status counts. | Branch Manager | Daily | On-screen table with export to CSV and Excel |

<!-- MASTER: refunds-portal-brd-master.md | PREV: 08-integrations.md | NEXT: 10-nfrs.md -->

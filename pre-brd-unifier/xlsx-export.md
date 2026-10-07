# Excel Export - On Demand, Post-Approval

Excel is produced only when the user explicitly approves the reviewed Markdown and asks for the sheet ("export excel" / "looks good, generate the sheet"). Never from the mode argument; never before review.

## How it works
The export clones `reference/PRE-BRD-v1.1.xlsx` and writes generated values into Answer cells only. The workbook's formulas, READ-ONLY sample columns, Calibri 11 styling, dark-blue header bands, and Executive Summary control panel are preserved. It holds 77 formula cells, the READ-ONLY samples included. The seven `= ...` notes in column C of `Market Sizing & analysis` describe a formula: they are text, not formulas. Writable cells are whitelisted in `reference/cell-map.json`; the engine (`scripts/export_xlsx.py`) refuses to write anywhere else.

## Procedure
1. Build the payload (below) from the approved Markdown chunks: for each framework, read the Answer values and map them to the cells the cell map declares writable.
2. Run the engine. It needs Python 3 with `openpyxl`. Replace `<skill-folder>` with the absolute path of the folder that holds this file. Give `<payload.json>` and `<dst>` (an existing output folder) as absolute paths too. On Windows, give each path with its drive letter (`C:/...`), in Git Bash too: Windows Python does not read `/c/...` paths. The same line works in PowerShell and in bash:

```text
python -c "import sys,json; sys.path.insert(0,r'<skill-folder>/scripts'); import export_xlsx as ex; ex.export(json.load(open(r'<payload.json>',encoding='utf-8')), r'<dst>/PRE-BRD-<ProjectName>-v1.1.xlsx')"
```

3. Report the output path and tell the user to open it in Excel (formulas recompute on open; the control-panel switch is set to YES so the scoreboard computes).

## Payload schema

```json
{
  "control_panel": true,
  "sheets": {
    "RICE Framework": { "answers": { "D4": 1000, "D5": 2, "D6": 0.8, "D7": 5 } },
    "Roadmap & project plan": {
      "needed_rows": 16,
      "answers": { "B3": "Q3-2026", "C3": "Launch MVP", "D3": "Core booking", "F3": "Eng", "G3": "Planned" }
    }
  }
}
```

- `answers`: `cell -> value`. The engine rejects any cell not whitelisted for that sheet.
- `needed_rows`: optional, and ONLY honoured for the genuinely extendable sheets - `BCG Matrix`, `Objectives Key Results (OKRs)`, `Roadmap & project plan`. The engine inserts rows there, cloning the template row's style/formula pattern. EFAS, IFAS, and VRIO are **fixed** (no insertion) and ignore `needed_rows` - see the limits below.
- `control_panel`: `true` flips the Executive Summary switch (`C5 → "YES"`) so the composite/recommendation compute.

### Sheet-specific values
- `Market Sizing & analysis`: enter the money values (the global market and the ARPU) in USD, converted at the canonical exchange rate in chunk 07. The scoreboard grades the SAM in USD and labels it with `$`.
- `Market Comparison`: the competitor columns M to Q take the section 1 product names, in order, in their header cells (M21:Q21 and M35:Q35), and `Available` or `Not available` in the feature rows (M22:Q33 and M36:Q47).
- `EFAS` and `IFAS `: write each Type cell as its letter (`O` or `T`, `S` or `W`). The scoreboard reads the opportunity and strength rows by that letter.
- `Executive Summary`: G17:G21 take chunk 22's Rationale column, one signal per row in the table's order. B26:B28 take chunk 22's conditions 2 to 4, each with its number (2. ...); condition 1, the lowest signal, is the sheet's automatic B25. Note any condition after the fourth as overflow.

### Answer cells are cleared before filling
The engine **blanks every whitelisted answer cell across ALL mapped sheets first, then writes the payload values.** This is deliberate: the reference workbook ships pre-filled with an example, and a global clear guarantees no leftover example value survives - not in a filled sheet, and not in a sheet the payload omits. Two consequences for the payload-builder:
1. **Build the payload from all 22 chunks.** Any sheet you leave out of the payload comes out blank in the workbook. To produce a complete pre-BRD, map every framework's answers - not just the analytical ones.
   - **Markdown-only content, never mapped to Excel:** the Investor Assessment (chunk 23), the **Go-To-Market Strategy** section of chunk 21, and the **Canonical figures** table of chunk 07 have no sheet or whitelisted cells in the reference workbook. Excel covers only the 22 frameworks; chunk 21 maps only its roadmap table to `Roadmap & project plan`. Do not attempt to map investor, GTM, or canonical-figure cells - an unknown cell/sheet raises `ExportError`. They remain in the Markdown deliverable.
2. **Supply every real value for any row you use.** An omitted weight/rating leaves that cell blank and contributes 0 to the composite, so fill complete rows.

## Sheet-name reference
Use exact workbook sheet names in the payload. Note `IFAS ` has a **trailing space**. Other multi-word names: `Market Sizing & analysis`, `Porter's Five Forces`, `Objectives Key Results (OKRs)`, `Roadmap & project plan`, `Product Strategy Canvas`, `Value Proposition Canvas`.

## Guardrails and known limits
- Sheet names in the payload must match the workbook exactly; unknown sheet → `ExportError`.
- Do not write derived/formula cells - the engine raises if you try.
- The reference workbook and cell map are read-only inputs; never edit them to make a payload fit - fix the payload.
- **EFAS / IFAS / VRIO are fixed-row on export** (no insertion). EFAS and IFAS feed fixed cross-sheet ranges in the scoreboard, so inserting rows would drop factors from the go/no-go composite; their Markdown blocks hold exactly 5 and 4 factors, so they fill EFAS rows 2 to 6 and IFAS rows 2 to 5 with no overflow. VRIO's READ-ONLY sample block sits below its data and contains formulas that openpyxl cannot re-reference on insert; fill within its rows and record any overflow in the Open Items log.
- **Market Comparison is fixed-cell** (the four answer blocks have set row capacity; the competitor header cells ship with placeholders that the export replaces or blanks, and M49:Q49 stay blank because chunk 06 § 4 has no competitor columns). **BCG / OKRs / Roadmap** may insert rows via `needed_rows`. For any of these, if the Markdown has more competitors/features/initiatives than the sheet holds, fill the most material ones and note the overflow; never silently truncate.

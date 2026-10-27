# Studio 3.0 manual check

Date: 2026-10-27. Run: 2026-10-27T14:03:13Z to 2026-10-27T14:03:34Z (UTC). Checked by the Task 3.5 builder agent.

## Browser and method

- Browser: Google Chrome 156.0.8078.48, headless. The version comes from the file metadata of `C:\Program Files\Google\Chrome\Application\chrome.exe` (ProductVersion and FileVersion 156.0.8078.48), and matches the Application folder name and `Browser.getVersion` (Chrome/156.0.8078.48).
- Method: the headless DevTools protocol harness (`TOOLS\t35_manual.mjs`), with its own scratch profile `TOOLS\t35_chrome_profile`, real mouse clicks and real Tab and key presses.
- Why not the Playwright MCP: the MCP in this session is attached to the owner's own browser, with personal tabs open, not a scratch profile. One navigate call was tried and failed ("Frame was detached"); after that the MCP was not used.
- Page: `http://127.0.0.1:8735/studio.html`, served by `py -3 -I -m http.server --bind 127.0.0.1 8735` from `TOOLS\studio-check`. The server was stopped after the run, and nothing listens on port 8735.
- TOOLS is `C:\Users\negat\AppData\Local\Temp\claude\C--Users-negat--claude-skills\5cecb36b-03d8-4e5a-8cf5-681dd1950497\scratchpad\tools`.

Firefox and Edge: owner check at C3.

## Step 1: the check project

- `node cli.mjs new TOOLS\studio-check --name "Check </script> Project" --brd REFUNDS=../brd/x.md@1.0` wrote `studio\project-state.json` (slug `check-script-project`, run mode full).
- `node cli.mjs derive ... --apply TOOLS\t35_check_patch.json` under the agent actor `pre-sdd-unifier`. It set seven BRD-sourced values (HDR-07 greenfield, HDR-08 cloud, BUS-05, REL-02, REL-03 900 s, REL-04 300 s, REL-05 region, each with a source such as "BRD: REFUNDS/NFR-04") and one proposal, REL-01.1 99.9 with its reason. Result: no errors, Open 71, Estimated 9 (the engine also filled OPS-04).
- `node cli.mjs embed ... --out TOOLS\studio-check\studio.html` at 2026-10-27T13:58:14Z.

## Step 2: browser checks

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | The form opens filled, with no import step | PASS | Solution reads "Check </script> Project", no alert, toast "Opened Check </script> Project from the project state embedded in this page.", no file chosen in Import. HDR-07 greenfield, HDR-08 cloud, REL-03 900, REL-04 300, REL-05 region, all Estimated with "Source: BRD: REFUNDS/..."; REL-01.1 Open with "Proposed value: 99.9". Screenshot `t35_01_load_filled.png`. |
| 2 | Stage 1 shows only stage 1 rows | PASS | Stage 1 visible, stages 2 to 4 hidden. The rows are exactly HDR-07, HDR-08, BUS-05, CAP-01, CAP-03, CAP-04, CAP-07, REL-01, REL-03, REL-04, REL-05, DAT-02, ECO-01; REL-02 is not shown. |
| 3 | Your name enables the controls | PASS | "Dana Reyes" typed, then Tab: no message, the REL-04.1 field is enabled, the name note is hidden. |
| 4 | Blanking RPO shows TBD, not 0 | PASS | Emptying REL-04.1 and leaving the field sends nothing: "The saved value is kept. Choose Clear to remove it, or type a new value." and the chip stays Estimated. Clear then gives Open, an empty field, "Value: TBD." and "Hypothetical RPO exposure (CALC-15): TBD". The save file holds REL-04.1 value null, status Open. |
| 5 | An invalid availability shows the fix message on blur | PASS | 150 in REL-01.1, then Tab: "Availability is a percentage above 0 and at most 100, for example 99.9." (the engine's `fieldError` text), aria-invalid true, the chip stays Open, the proposal stays. Emptying the field again sends nothing. Screenshot `t35_02_availability_fix_message.png`. |
| 6 | Accept on the REL-01 proposal sets Confirmed with the name entered | PASS | Chip Confirmed, value 99.9, "Source: Answer: Dana Reyes, 2026-10-27 (proposal accepted). Confirmed by Dana Reyes on 2026-10-27 14:03:16 UTC.", toast "Accepted the proposal for REL-01.1. It is Confirmed under your name.", focus on the REL-01.1 field. Screenshot `t35_03_stage1_after_accept.png`. |
| 7 | Confirm all in a group works | PASS | Stage 2, Reliability: "Confirm all pre-filled values in this group (3)". After the click: "(0)", disabled, with the title "No pre-filled value in this group is waiting for confirmation."; REL-02.1, REL-03.1 and REL-05.1 Confirmed by Dana Reyes; REL-04.1 stays Open. Screenshot `t35_04_stage2_rel_confirmed.png`. |
| 8 | Tab reaches every control with a visible focus ring | PASS | Tab walks from the top of the page until focus comes back to the first control. Stage 1: 87 of 87 controls reached; stage 2 (Reliability): 68 of 68; stage 3: 35 of 35; stage 4: 39 of 39. Every one shows a ring: a solid 3px rgb(12, 130, 134) ring (`--focus`), or a solid 3px rgb(127, 202, 211) ring (`--focus-on-dark`) on the three mast buttons. In the first run the stage 2 register panel (`#stage2Rows`, tabindex 0) showed Chrome's default ring (auto, 1px); fix round 0 gives it the `--focus` ring, and a rerun of the same checks on the rebuilt page (all 12 harness checks pass, `TOOLS\t35f0_manual_out.json`) shows 68 of 68 stage 2 controls with the solid 3px ring and none with the default ring. Screenshots `t35_05_focus_ring_stage4.png` and, after the fix, `t35f0_05_focus_ring_stage4.png`. |
| 9 | The console shows no error | PASS | No console error and no exception on either page. Chrome itself asked the server for `/favicon.ico` (initiator "other") and logged its 404; that request comes from serving the page over http and not from the page, and the same page opened from disk in p3_smoke has no console entry. The only other requests were the two page loads. |

## Step 3: save, re-import, parity

| # | Check | Result | Evidence |
|---|---|---|---|
| 10 | Save writes the save file | PASS | The mast Save project button downloaded `pre-sdd-check-script-project-state-20261027T140331Z.json` (204,806 bytes, kind pre-sdd-save) into `TOOLS\t35_downloads`. It holds REL-01.1 99.9 Confirmed by Dana Reyes, REL-04.1 null Open. Screenshot `t35_06_after_save.png`. |
| 11 | `validate --pick` picks it | PASS | See the commands below. On a folder that holds only this save, it picks this file; every line PASS, exit 0. On the download folder, it picks the newer resave from step 12, whose project state is identical; every line PASS, exit 0. |
| 12 | Re-import in a fresh page gives the same values | PASS | A new tab on the blank Studio (`blank.html`, a copy of the built page) shows "Untitled project". Import of the save file: toast "Imported ... (a save file).", no alert, the recorded position (stage 4, Reliability) is restored. Stage 1 then shows the same values and statuses: HDR-07 greenfield, REL-01 99.9 Confirmed by Dana Reyes, REL-03 900 Confirmed, REL-04 empty and Open, REL-05 region Confirmed. A save from the fresh page has a project state deep-equal to the first save. Screenshot `t35_07_fresh_page_reimported.png`. |
| 13 | compute on the saved state, then diff against the saved blueprint | PASS | `diff` refuses a save file and says to unwrap it first, so `unwrap` came first. The unwrapped state equals the saved state. The diff of the computed blueprint against the saved blueprint gives "No differences ...", exit 0. |

Commands (Step 3), with `T` for TOOLS and `CLI` for `studio\cli.mjs`:

```
node CLI validate --pick T\t35_pick --slug check-script-project --since 2026-10-27T13:58:14Z
PICKED T\t35_pick\pre-sdd-check-script-project-state-20261027T140331Z.json
PASS kind: a Studio save file
PASS project state gate: it reads cleanly
PASS project state schema: matches schema/project-state.schema.json
PASS project state compute: gate Blocked, not authorized to start the SDD
PASS blueprint schema: matches schema/architecture-blueprint.schema.json
exit 0

node CLI validate --pick T\t35_downloads --slug check-script-project --since 2026-10-27T13:58:14Z
PICKED T\t35_downloads\pre-sdd-check-script-project-state-20261027T140333Z.json
(the same five PASS lines)
exit 0

node CLI diff <save> <save>
... is not an architecture blueprint; run unwrap on the save file first and diff its studio-blueprint.json.
exit 2

node CLI unwrap <save> T\t35_parity\unwrapped
exit 0
node CLI compute T\t35_parity\unwrapped\project-state.json --out T\t35_parity\computed
exit 0
node CLI diff T\t35_parity\computed\blueprint.json T\t35_parity\unwrapped\studio-blueprint.json
No differences in the calculations, rules, validation, scopes, shape, options and gate.
exit 0
```

`--since` is the build time of the embedded page (the modified time of `studio.html`).

## History check

The saved history holds 27 records. The person records are: set (the REL-04 Clear), accept-proposal, four set-run (stage 2, Reliability tab, stage 3, stage 4) and three confirm-group records. No blank set came from a field that was emptied and left, and no record came from loading, importing or saving.

## Summary

13 checks: 13 PASS, 0 FAIL. Firefox and Edge: owner check at C3.

Screenshots (TOOLS): `t35_01_load_filled.png`, `t35_02_availability_fix_message.png`, `t35_03_stage1_after_accept.png`, `t35_04_stage2_rel_confirmed.png`, `t35_05_focus_ring_stage4.png`, `t35_06_after_save.png`, `t35_07_fresh_page_reimported.png`. Harness output: `TOOLS\t35_manual_out.json`.

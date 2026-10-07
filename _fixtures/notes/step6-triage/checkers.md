# Step 6 triage: checker scripts

Scope: `_fixtures/checkers/check_trace.py`, `check_sdd.py`, `check_e2e.py`, `check_uc_keys.py`, the repo `.gitignore`, and `_fixtures/README.md`. Nothing in the repo was edited. The proposed scripts, the test harness, the planted copies, and all outputs are in `SP\s6\scratch\checkers\` (SP = this session's scratchpad); the file list is at the end.

How the tests ran:

- Python 3.14, standard library only, from the repo root, with `python -B` and `PYTHONDONTWRITEBYTECODE=1` so no `__pycache__` is written into `_fixtures/checkers/`, `PYTHONIOENCODING=utf-8`, and `PYTHONPATH=_fixtures/checkers` (the proposed `check_uc_keys.py` imports the unchanged `check_uc_links.py` from there).
- The saved runs were read in place. "Before" is the current repo script (copied unchanged to `orig\`; `cmp` against the repo copies at the end of the session: identical), "after" is the proposed one. Both ran on every saved run with `PYTHONHASHSEED=0` (`run_all.py`, outputs in `out\final-before\` and `out\final-after\`).
- Run names in the tables: `run-new`, `run-2026-09-30`, `e2e` (`run-2026-10-01-e2e`), `review` (`run-2026-10-01-review`), `s3c-sdd` and `s3c-lld` (`scenarios/sdd-version-tracking/after-sdd` and `after-lld`), `s3d` (`scenarios/lld-modular-monolith/run`), `fixture`, `run-old`, and the three `sdd-uc-trace` runs (`uct-baseline`, `uct-green`, `uct-multi`).
- Planted errors were written only into copies under `plant\` (each a full copy of one saved run), by exact string replacement (`plant.py`, which fails if the old text is not found exactly once).

| Item | Confirmed | Fixed in scratch | Tests |
|---|---|---|---|
| 1 check_trace `@UseCase` | Yes, with one correction: the table-row regex works on `run-new` (10 matches) and is dead on every later run (0 matches) | Narrowest correct check (the current 04 format has no reliable per-entry-point anchor) | 8 planted cases, all as expected; saved runs unchanged except `review` 11 to 12 (a real stale `@UseCase`) |
| 2a check_sdd API IDs | Yes (`s3d`: `18-open-items-and-clarifications.md: API-05 not in §15.2`) | Yes | Planted cases pass and fail as intended; only `s3d` changes (30 to 29) |
| 2b check_sdd link rule | Reported below | Two variant files | Counts per run for both outcomes |
| 3a check_e2e E4 | Yes | Best check the documents allow, with its limits | 4 planted Changes Log cases; `review` E4 now NOT met |
| 3b check_e2e order | Yes (8 different outputs over 8 hash seeds) | Yes (1 output) | Seeds 0 to 7 on `e2e` and `review` |
| 4 check_uc_keys register | Yes | Yes | `review` 166 to 1; 3 planted cases |
| 5 `.gitignore` | `.playwright-mcp/` is not ignored today | Entry and place proposed | `git check-ignore --no-index` with the line in a scratch excludes file |
| 6 README | 7 statements change | Replacement text given | - |

---

## 1. `check_trace.py`: the `@UseCase` check

### Confirmed: yes, with a correction

The check is `check_trace.py:201-217`. The step 3 note's "line ~192" is now lines 207 and 215.

- Line 207 (reverse direction) and line 215 (per entry point) both use the table-row pattern `^\| `METHOD path` \| `handler` \| `KEY/UC-NN` \|`.
- Line 216 is the fallback that decides on every run except `run-new`: `f'@UseCase("{uc}")' in owner_txt and e in owner_txt`. It passes when that string appears anywhere in the owner's 04 file and the entry point text appears anywhere in it. A §7.8 Trigger line, a `> Confirm:` note, or the authorization table can satisfy it. So the check is file-level.

The pattern is not dead on every run. A read-only count over each run's `04-implementation/*.md`:

| Run | Rows matching the line 207/215 pattern |
|---|---|
| `run-new` | 10 (its "Traced entry points and their `@UseCase` values" table, `refund-service.md:42-54`, `loyalty-service.md:39-46`) |
| `run-old`, `run-2026-09-30`, `e2e`, `review`, `s3c-sdd`, `s3c-lld`, `s3d` | 0 |

So the per-entry-point code works on `run-new` and is dead on everything the current lld-unifier writes.

Two smaller defects, both fixed by the rewrite:

- Line 211 builds `all_eps` from every §7.3 row, merged ones included. That is harmless today, because merged rows read `-`.
- Line 209 indexes `s73[uc]` and raises KeyError if a traced row names a use case §7.3 does not have.

### Is there a reliable per-entry-point anchor? Only in some rows

- **The home.** `lld-unifier/sdd-to-lld.md:93` puts the annotation in "04 §7.2 Class & Interface Map". Check 6 (`sdd-to-lld.md:181`) reads: "Every entry point named in a 04 line carries `@UseCase` with the §7.3 value".
- **The template.** `chunks/04-implementation-template.md:41-45` gives §7.2 a `| Class | Endpoints | Notes |` table. The Notes cell is "[Permission token (SDD §16), idempotency rules]", with no cell for a per-entry-point `@UseCase`. The convention line under it states the rule only.
- **What the runs since `run-2026-09-30` write.** The values go into the Notes cell of a row that lists several endpoints, often in prose:
  - `refund-service.md:41` (09-30, e2e, review): "`@UseCase("REFUNDS/UC-01")` on submit, `@UseCase("REFUNDS/UC-02")` on both GETs, `@UseCase("REFUNDS/UC-03")` on cancellation" (4 endpoints, 3 values);
  - `refund-service.md:42`: "`@UseCase("REFUNDS/UC-04")` on the two GETs of requests and on the decision; the report carries none" (4 endpoints, 1 value);
  - `loyalty-service.md:40`: "`@UseCase("LOYALTY/UC-01")` on the balance, `@UseCase("LOYALTY/UC-02")` on both movement endpoints";
  - `s3d refund.md:39` is the only explicit order: "`@UseCase` values: `REFUNDS/UC-01`, ..., `REFUNDS/UC-04` in that order";
  - `s3d loyalty.md:38` lists three values for three endpoints but does not say they are in order.
- **The §7.8 Trigger lines** name handler methods, sometimes abbreviated (`BranchRefundRequestController.list`, `.get`, and `.decide`), not entry points. The authorization table names the handler on only some rows.

Conclusion: the current 04 format gives no reliable per-entry-point anchor in general. It gives one only in three places:

- `run-new`'s traced-entry-point table (one row per entry point);
- a Controllers row with one REST endpoint;
- a values list marked `in that order` with one value per endpoint.

Mapping values to endpoints by position in prose would produce false results, for example "`@UseCase("U2")` on the POST, `@UseCase("U1")` on the GET".

### The change: the narrowest correct check

For every Active §7.3 use case and each of its entry points, read only the owner's 04 §7.2. Trigger lines and notes no longer count.

1. **One by one** where §7.2 allows it (a traced row, a one-endpoint Controllers row, or an `in that order` list):
   - the entry point's value must name the use case;
   - it must equal the §7.3 value: all Active use cases that list the entry point, in §7.3 order, comma-joined, as `sdd-to-lld.md` § The use_case attribute requires.
2. **Otherwise per Controllers row**: the entry point must be listed in a §7.2 Controllers row of the owner's file, and that row must carry the use case. A non-REST entry point (`Schedule: x`, `Event: X`, which SDD fix S2-4f now produces) is matched by name in the row's Class, Endpoints, or Notes cell.
3. **Reverse**: every §7.2 value must name an Active §7.3 use case that lists at least one of that row's endpoints. A traced row is checked one by one.
4. **Coverage line**: the output prints how many (use case, entry point) pairs were checked each way.

Residual blind spot: two values swapped between endpoints of the same multi-endpoint prose row (planted case T6). Closing it needs a template change for the lld-unifier triage: one `@UseCase` cell per entry point in §7.2, either as `run-new`'s traced table or as a `@UseCase` column in the Controllers table.

### Diff (`scratch\checkers\check_trace.py` against the repo copy)

```diff
--- a/_fixtures/checkers/check_trace.py
+++ b/_fixtures/checkers/check_trace.py
@@ -198,23 +198,98 @@
         if any(c != "-" for c in cells[3:8]):
             problems.append(f"index {uc} merged row has mapping values")
 
-# ---- @UseCase tables vs 7.3
-for fn in sorted({r["owner"] + ".md" for r in s73.values() if r["status"] == "Active"}):
-    path = os.path.join(LLD, "04-implementation", fn)
-    if not os.path.isfile(path):
+# ---- @UseCase per 7.3 entry point, read from 04 7.2
+UC_ID = re.compile(r"(?:REFUNDS|LOYALTY)/UC-\d\d")
+REST = re.compile(r"^(?:GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS) /")
+
+
+def norm(ep):
+    return re.sub(r"\s+", " ", ep).strip()
+
+
+active_eps = {uc: [norm(e) for e in re.findall(r"`([^`]+)`", r["entry"])] for uc, r in s73.items() if r["status"] == "Active"}
+
+
+def anchors_7_2(txt):
+    m = re.search(r"^## 7\.2\b.*$", txt, re.M)
+    sec = txt[m.end():] if m else ""
+    n = re.search(r"^## ", sec, re.M)
+    lines = (sec[:n.start()] if n else sec).splitlines()
+    traced, rows = {}, []
+    for i, line in enumerate(lines):
+        if not line.startswith("|") or (i and lines[i - 1].startswith("|")) or i + 1 >= len(lines) or not re.match(r"^\|\s*:?-{3}", lines[i + 1]):
+            continue
+        head = [c.strip() for c in line.strip().strip("|").split("|")]
+        ep_col = next((h for h in head if h.startswith("Entry point")), None)
+        uc_col = next((h for h in head if "@UseCase" in h), None)
+        for row in lines[i + 2:]:
+            if not row.startswith("|"):
+                break
+            c = dict(zip(head, [x.strip() for x in row.strip().strip("|").split("|")]))
+            if ep_col and uc_col:
+                for ep in re.findall(r"`([^`]+)`", c.get(ep_col, "")):
+                    traced.setdefault(norm(ep), []).extend(UC_ID.findall(c.get(uc_col, "")))
+            elif head[:2] == ["Class", "Endpoints"]:
+                notes, cell = c.get("Notes", ""), c.get("Endpoints", "")
+                eps = [norm(p) for t in re.findall(r"`([^`]+)`", cell) for p in re.split(r",\s*(?=[A-Z]+ /)", t)]
+                listed = re.search(r"`@UseCase` values?:?\s*(.+?)\s+in that order", notes)
+                values = re.findall(r"`([^`]+)`", listed.group(1)) if listed else re.findall(r'@UseCase\("([^"]*)"\)', notes)
+                rows.append(dict(cls=c.get("Class", ""), text=" ".join((c.get("Class", ""), cell, notes)),
+                                 rest=[e for e in eps if REST.match(e)], values=values, ordered=bool(listed)))
+    return traced, rows
+
+
+anchors = {fn: anchors_7_2(read(os.path.join(LLD, "04-implementation", fn))) for fn in sorted(os.listdir(os.path.join(LLD, "04-implementation")))}
+how = {"one by one": 0, "by Controllers row only": 0, "not found": 0}
+checked = set()
+for uc, eps in active_eps.items():
+    fn = s73[uc]["owner"] + ".md"
+    if fn not in anchors:
+        problems += [f"no @UseCase for {uc} {e}: no 04 file {fn}" for e in eps]
         continue
-    txt = read(path)
-    for m in re.finditer(r"^\| `([A-Z]+ [^`]+)` \| `[^`]+` \| `((?:REFUNDS|LOYALTY)/UC-\d\d)` \|", txt, re.M):
-        ep, uc = m.group(1), m.group(2)
-        if f"`{ep}`" not in s73[uc]["entry"]:
-            problems.append(f"@UseCase {uc} on {ep} not in 7.3 entry points")
-all_eps = [(uc, e) for uc, r in s73.items() for e in re.findall(r"`([^`]+)`", r["entry"])]
-for uc, e in all_eps:
-    owner_file = os.path.join(LLD, "04-implementation", s73[uc]["owner"] + ".md")
-    owner_txt = read(owner_file) if os.path.isfile(owner_file) else ""
-    row = re.search(r"^\| `" + re.escape(e) + r"` \| `[^`]+` \| `" + re.escape(uc) + r"` \|", owner_txt, re.M)
-    if not row and not (f'@UseCase("{uc}")' in owner_txt and e in owner_txt):
-        problems.append(f"no @UseCase for {uc} {e} in {s73[uc]['owner']}.md")
+    traced, rows = anchors[fn]
+    for e in eps:
+        if e in traced:
+            got, where = traced[e], "its traced entry point row"
+        else:
+            if REST.match(e):
+                hit = [r for r in rows if e in r["rest"]]
+            else:
+                name = e.split(":", 1)[-1].strip()
+                hit = [r for r in rows if re.search(r"(?<![\w-])" + re.escape(name) + r"(?![\w-])", r["text"])]
+            one = [r for r in hit if REST.match(e) and (len(r["rest"]) == 1 or (r["ordered"] and len(r["values"]) == len(r["rest"])))]
+            if not hit:
+                how["not found"] += 1
+                problems.append(f"no @UseCase for {uc} {e} in {fn}: no §7.2 row lists this entry point")
+                continue
+            if not one:
+                how["by Controllers row only"] += 1
+                carried = sorted({t for r in hit for v in r["values"] for t in UC_ID.findall(v)})
+                if uc not in carried:
+                    problems.append(f"no @UseCase for {uc} {e} in {fn}: its §7.2 row ({', '.join(r['cls'] for r in hit)}) carries {carried or 'none'}")
+                continue
+            r = one[0]
+            got = UC_ID.findall(r["values"][r["rest"].index(e)] if r["ordered"] and len(r["values"]) == len(r["rest"]) else ",".join(r["values"]))
+            where = f"§7.2 {r['cls']}"
+        how["one by one"] += 1
+        want = [u for u, x in active_eps.items() if e in x]
+        if uc not in got:
+            problems.append(f"no @UseCase for {uc} {e} in {fn}: {where} carries {got or 'none'}")
+        elif got != want and (fn, e) not in checked:
+            problems.append(f"@UseCase on {e} in {fn} is {','.join(got)}; §7.3 lists it under {','.join(want)}")
+        checked.add((fn, e))
+for fn, (traced, rows) in anchors.items():
+    for e, got in traced.items():
+        for t in got:
+            if (fn, e) not in checked and e not in active_eps.get(t, []):
+                problems.append(f"@UseCase {t} on {e} in {fn}: §7.3 does not list it under {t}")
+    for r in rows:
+        for t in sorted({t for v in r["values"] for t in UC_ID.findall(v)}):
+            if t not in active_eps:
+                problems.append(f"@UseCase {t} in {fn} §7.2 {r['cls']}: not an Active §7.3 use case")
+            elif r["rest"] and not set(r["rest"]) & set(active_eps[t]):
+                problems.append(f"@UseCase {t} in {fn} §7.2 {r['cls']}: §7.3 lists none of its endpoints under {t}")
+print("@UseCase anchors in 04 §7.2, per §7.3 use case and entry point:", ", ".join(f"{n} {k}" for k, n in how.items()))
 
 # ---- 13 16.8 specs vs chunk 16
 t13 = read(os.path.join(LLD, "13-testing.md"))
```

### Tests

Commands (Git Bash, in `SP\s6\scratch\checkers`; `run_all.py` sets the environment above):

```
PYTHONHASHSEED=0 python -B run_all.py final-before orig check_trace,check_sdd,check_e2e,check_uc_keys
PYTHONHASHSEED=0 python -B run_all.py final-after . check_trace,check_sdd.links-required,check_sdd.links-exempt,check_e2e,check_uc_keys
PYTHONIOENCODING=utf-8 python -B test_trace.py
```

Saved runs, compared line by line:

- Every run's output gains one line, `@UseCase anchors in 04 §7.2, ...`.
- Only `review` changes otherwise. Before:
  ```
   - no @UseCase for REFUNDS/UC-01 POST /v1/receipt-lookups in refund-service.md
   - no @UseCase for REFUNDS/UC-06 GET /v1/branches/{branchId}/refund-report in refund-service.md
  ```
  After:
  ```
   - no @UseCase for REFUNDS/UC-01 POST /v1/receipt-lookups in refund-service.md: no §7.2 row lists this entry point
   - no @UseCase for REFUNDS/UC-06 GET /v1/branches/{branchId}/refund-report in refund-service.md: its §7.2 row (`BranchRefundRequestController`) carries ['REFUNDS/UC-04']
   - @UseCase REFUNDS/UC-01 in refund-service.md §7.2 `ReceiptController`: §7.3 lists none of its endpoints under REFUNDS/UC-01
  ```

The third line is new and correct. SDD 1.3 §7.3 moved UC-01's lookup to `POST /v1/receipt-lookups`, but the LLD (which read SDD 1.2) still annotates `GET /v1/receipts/{receiptNumber}/refundable-items` with `REFUNDS/UC-01`. It is the same "SDD moved past the LLD" class as the other review problems. The old reverse check could not see it because its pattern never matches this format.

Planted cases (trimmed `out\test_trace.txt`; "+" lines are the problems the plant adds over the unplanted run):

```
[T1 e2e: prose row loses UC-03] old: problems: 5
[T1 ...] new: problems: 6
    + no @UseCase for REFUNDS/UC-03 POST /v1/refund-requests/{refundRequestId}/cancellation in refund-service.md: its §7.2 row (`RefundRequestController`) carries ['REFUNDS/UC-01', 'REFUNDS/UC-02']
[T2 e2e: one-endpoint row carries the wrong value] old: problems: 5
[T2 ...] new: problems: 7
    + no @UseCase for REFUNDS/UC-01 GET /v1/receipts/{receiptNumber}/refundable-items in refund-service.md: §7.2 `ReceiptController` carries ['REFUNDS/UC-02']
    + @UseCase REFUNDS/UC-02 in refund-service.md §7.2 `ReceiptController`: §7.3 lists none of its endpoints under REFUNDS/UC-02
[T3 e2e: entry point missing from 7.2] old: problems: 5
[T3 ...] new: problems: 7
    + no @UseCase for REFUNDS/UC-01 POST /v1/refund-requests in refund-service.md: no §7.2 row lists this entry point
    + @UseCase REFUNDS/UC-01 in refund-service.md §7.2 `RefundRequestController`: §7.3 lists none of its endpoints under REFUNDS/UC-01
[T4 s3d: ordered list swaps two values] old: problems: 0
[T4 ...] new: problems: 2
    + no @UseCase for REFUNDS/UC-03 POST /v1/refund-requests/{refundId}/cancellation in refund.md: §7.2 `RefundRequestController` carries ['REFUNDS/UC-04']
    + no @UseCase for REFUNDS/UC-04 POST /v1/refund-requests/{refundId}/decision in refund.md: §7.2 `RefundRequestController` carries ['REFUNDS/UC-03']
[T5 run-new: traced table row wrong value] old: problems: 11   (+ @UseCase REFUNDS/UC-02 on POST /v1/refund-requests not in 7.3 entry points)
[T5 ...] new: problems: 11   (+ no @UseCase for REFUNDS/UC-01 POST /v1/refund-requests in refund-service.md: its traced entry point row carries ['REFUNDS/UC-02'])
[T6 e2e: swap inside a prose row (known blind spot)] old: problems: 5   new: problems: 5
[T7 e2e: SDD 7.3 adds `Event: RefundPaid` to LOYALTY/UC-02; the listener row says no @UseCase] old: 7, new: 7
    new + no @UseCase for LOYALTY/UC-02 Event: RefundPaid in loyalty-service.md: its §7.2 row (`RefundPaidListener` (inbound in-process adapter)) carries none
[T8 e2e: as T7, and the listener row carries LOYALTY/UC-02] old: problems: 7 (false positive: no @UseCase for LOYALTY/UC-02 Event: RefundPaid)
[T8 ...] new: problems: 6 (passes; the one extra problem in T7 and T8 is "entry points differ", from the planted §7.3 cell)
```

T1 to T4 are errors the old check missed. T5 is caught by both. T6 is the documented blind spot. T8 is a false positive of the old check: the literal text `Event: RefundPaid` never appears in the LLD, so the file-level fallback fails. The new check passes it.

### Results per saved run

| Run | Before | After | `@UseCase` pairs after: one by one / by row only / not found |
|---|---|---|---|
| `run-new` | 10 | 10 | 10 / 0 / 0 |
| `run-2026-09-30` | 5 | 5 | 1 / 10 / 0 |
| `e2e` | 5 | 5 | 1 / 10 / 0 |
| `review` | 11 | 12 | 0 / 11 / 1 |
| `s3c-sdd`, `s3c-lld` | 5, 5 | 5, 5 | 1 / 10 / 0 |
| `s3d` | 0 | 0 | 7 / 4 / 0 |
| `run-old` | IndexError at line 172 (no §19.9; predates the trace) | the same | - |

Notes are unchanged everywhere (2).

---

## 2. `check_sdd.py`

### 2a. API IDs in a rejected chunk 18 option: confirmed, yes

The check is `check_sdd.py:152-158`. Its comment says "API IDs in 13x", but it scans every `.md` file of the SDD (line 155) for `API-\d\d` and requires each one in the §15.2 index (line 154).

Reproduced on `scenarios/lld-modular-monolith/run` (30 problems; output line 31: `18-open-items-and-clarifications.md: API-05 not in §15.2`). The source is OI-01 option B (`18-open-items-and-clarifications.md:47`): "let `notification` read it through a new in-process query port on `refund` (API-05)". The item's Recommended Answer is option A, and its Status is `Accepted - applied`. No other saved run has an API ID outside its index.

**The change.** In chunk 18, text that proposes rather than states is not a citation:

- every option bullet (under `- **Options:**`);
- the `Why` field (it argues about the options);
- the `Recommended Answer` of an item whose Status is not `Accepted - applied` (Open, Deferred, Rejected, Adjusted, or Superseded).

Where, Concern, Status, an applied Recommended Answer, the Resolution Log, and the Reviewer Notes are still checked. Nothing a design chunk cites is skipped: an applied answer lands in the body chunks, which stay checked.

Left as is, and seen in no saved run:

- a Where or Concern line that cites an ID a later accepted answer removed;
- a decision-log record "over B (...)" that names a rejected option's new ID.

### 2b. How the link-and-key rule treats the three places today

Rules 2 and 3 run over every `.md` file in the SDD folder (line 55): the master, `00-cover-and-changelog.md` (all of it), `18-open-items-and-clarifications.md`, and `decision-log.md`. No file or section is exempt.

- **Before checking:**
  - rule 2 removes fenced code blocks (line 77), HTML comments (line 78), and inline code spans (line 80);
  - rule 3 removes code blocks and inline code, but not comments (line 98).
- **Rule 2a, keyed (lines 81-87).** Every `UC-NN` not preceded by a capital or `/` must have `REFUNDS/` or `LOYALTY/` right before it. The only exception is the literal `Merged into UC-04` (line 85, fixture-specific).
- **Rule 2b, a keyed ID is a link (lines 88-94).** Every `REFUNDS/UC-NN` or `LOYALTY/UC-NN` must be the whole text of a link: `[` right before it and `](` right after. The only exception is `Merged into KEY/UC-NN` (line 91). So `[REFUNDS/UC-04 E1](...)` and `[**REFUNDS/UC-04**](...)` both count as unlinked.
- **Rule 3, NFR and TI keyed (lines 96-106).** `NFR-NN` and `TI-NN` must be keyed, except a TI right after `KEY NN ` (line 103). There is no link rule.

So chunk 18, the decision log, and the 00 Changes Log rows are held to rules 2a, 2b, and 3 exactly like a body chunk.

This matches the decision now pending in `_fixtures/notes/step6-decisions.md` row S2-1:

- recommended "One rule everywhere ... check_sdd unchanged" is variant A below;
- alternative "all three history places exempt from links" is variant B.

The other alternatives are small edits of variant B:

- decision log only: narrow `RECORDS` and the `record` condition;
- exempt from both checks: move its `if record: continue` above the keyed loop.

**The two variants:**

- `check_sdd.links-required.py` (A, links required as now): only the 2a fix.
- `check_sdd.links-exempt.py` (B): the 2a fix, plus rule 2b skipped on every line of chunk 18 and the decision log, and on the table rows under `## Changes Log` in chunk 00. Rules 2a and 3 (must be keyed) still run there. The rest of chunk 00 (cover, Document Lineage) still needs links.

Rename the chosen file to `check_sdd.py`.

Also found, not changed: rule 2's line numbers are counted after comments and code blocks are removed, so they are off by the length of the removed text. On `review`:

| Reported | Real line | What it is |
|---|---|---|
| `00-cover-and-changelog.md:41` | 48 | the 1.1 Changes Log row |
| `decision-log.md:18` | 25 | the Q4 row |
| chunk 18 `:86` | 98 | `### OI-05` |

Fix, if wanted: replace each removed comment or block with as many newlines as it held. That changes no count but changes every line number in the output.

### Diffs

Variant A (`check_sdd.links-required.py` against the repo copy):

```diff
--- a/_fixtures/checkers/check_sdd.py
+++ b/_fixtures/checkers/check_sdd.py
@@ -149,11 +149,28 @@
             if m.group(1) not in hub_names:
                 problems.append(f"{fn}: event {m.group(1)} not in chunk 10")
 
-# 7. API IDs in 13x exist in chunk 11 index
+# 7. API IDs exist in chunk 11 index (chunk 18 proposals excepted)
+def without_proposals(fn, text):
+    if not fn.startswith("18-"):
+        return text
+    lines = text.split("\n")
+    for s in [k for k, l in enumerate(lines) if re.match(r"^#{2,4} OI-\d+", l)]:
+        e = next((k for k in range(s + 1, len(lines)) if re.match(r"^#{1,4} ", lines[k]) or lines[k].strip() == "---"), len(lines))
+        applied = any(re.match(r"^- \*\*Status:\*\*\s*Accepted - applied", l) for l in lines[s:e])
+        field = None
+        for k in range(s + 1, e):
+            m = re.match(r"^- \*\*([^*]+?):\*\*", lines[k])
+            if m:
+                field = m.group(1)
+            if field in ("Options", "Why") or (field == "Recommended Answer" and not applied):
+                lines[k] = ""
+    return "\n".join(lines)
+
+
 c11 = read(os.path.join(SDD, "11-api-contracts.md"))
 index_ids = set(re.findall(r"^\| (API-\d\d) \|", c11, flags=re.M))
 for fn in files:
-    for m in re.finditer(r"API-\d\d", read(os.path.join(SDD, fn))):
+    for m in re.finditer(r"API-\d\d", without_proposals(fn, read(os.path.join(SDD, fn)))):
         if m.group(0) not in index_ids:
             problems.append(f"{fn}: {m.group(0)} not in §15.2")
 
```

Variant B adds this to variant A:

```diff
--- check_sdd.links-required.py
+++ check_sdd.links-exempt.py
@@ -72,11 +72,16 @@
             if anchor not in anchors_of(full):
                 problems.append(f"{fn}: missing anchor {target}")
 
-# 2. UC mentions: keyed, linked (outside code blocks)
+# 2. UC mentions: keyed, linked (outside code blocks); chunk 18, decision log, 00 Changes Log rows: keyed only
+RECORDS = ("18-open-items-and-clarifications.md", "decision-log.md")
 for fn in files:
     content = strip_code(read(os.path.join(SDD, fn)))
     content = re.sub(r"<!--.*?-->", "", content, flags=re.S)
+    heading = ""
     for i, line in enumerate(content.splitlines(), 1):
+        if re.match(r"^#{1,6} ", line):
+            heading = line
+        record = fn in RECORDS or (fn.startswith("00-") and line.startswith("|") and re.match(r"^#{1,6} Changes Log\s*$", heading))
         line = re.sub(r"`[^`]*`", "", line)
         for m in re.finditer(r"(?<![A-Z/])UC-\d\d", line):
             start = m.start()
@@ -85,6 +90,8 @@
                 if "Merged into UC-04" in line and line[start - 12:start] == "Merged into ":
                     continue
                 problems.append(f"{fn}:{i}: unkeyed {m.group(0)}: {line.strip()[:120]}")
+        if record:
+            continue
         for m in re.finditer(r"(REFUNDS|LOYALTY)/UC-\d\d", line):
             before = line[:m.start()]
             after = line[m.end():]
```

(`diffs\check_sdd.links-exempt.diff` has B against the repo copy.)

### Tests

Commands: the two `run_all.py` lines in item 1, then `PYTHONIOENCODING=utf-8 python -B test_sdd.py`.

Saved runs: variant A differs from the current script only on `s3d`, where `PROBLEMS: 30` becomes 29 and the `API-05` line goes. Variant B additionally removes only "unlinked" lines in the three places (classified line by line; markers and Mermaid counts identical).

Planted cases (trimmed `out\test_sdd.txt`):

- **A1** (copy of `s3d`). Chunk 18 OI-02 set to `Rejected`; planted IDs:
  - API-07 in OI-02's Recommended Answer;
  - API-08 in OI-02's Why;
  - API-09 in OI-03's applied Recommended Answer;
  - API-06 in OI-03's Where;
  - API-10 in body chunk 05.

  The old script flags all five. Both variants flag only API-10, API-09, and API-06:
  ```
  [A1 ...] old: 30 -> 35   (+ API-10, API-07, API-08, API-06, API-09)
  [A1 ...] links-required: 29 -> 32   (+ 05 API-10, 18 API-06, 18 API-09)
  [A1 ...] links-exempt: 26 -> 29     (+ 05 API-10, 18 API-06, 18 API-09)
  ```
- **B1** (copy of `e2e`). Planted:
  - an unlinked `REFUNDS/UC-03` in the cover's Status line;
  - `Planted: LOYALTY/UC-01 and UC-02 changed.` in the 1.2 Changes Log row;
  - a decision-log record with an unlinked `REFUNDS/UC-02` and an unkeyed `UC-03`;
  - an unlinked `REFUNDS/UC-04` in 05.

  Variant B still catches the cover (outside the Changes Log), the body, and both unkeyed IDs. It skips only the two unlinked keyed IDs in the record places:
  ```
  [B1 ...] old: 50 -> 56; links-required: 50 -> 56   (+ 00:7 unlinked REFUNDS/UC-03, 00:40 unkeyed UC-02, 00:40 unlinked LOYALTY/UC-01, 05:61 unlinked REFUNDS/UC-04, decision-log:460 unkeyed UC-03, decision-log:460 unlinked REFUNDS/UC-02)
  [B1 ...] links-exempt: 17 -> 21                    (+ 00:7 unlinked REFUNDS/UC-03, 00:40 unkeyed UC-02, 05:61 unlinked REFUNDS/UC-04, decision-log:460 unkeyed UC-03)
  ```

### Results per saved run

| Run | Before | A: links required | B: records exempt | B removes (00 Changes Log / 18 / decision log) | What B leaves |
|---|---|---|---|---|---|
| `run-new` | 5 | 5 | 5 | 0 / 0 / 0 | 4 List-of-APIs columns, 1 unkeyed NFR |
| `run-2026-09-30` | 37 | 37 | 11 | 0 / 12 / 14 | 11 unkeyed NFR or TI (7 in 18, 2 in 02, 2 in the decision log) |
| `e2e` | 50 | 50 | 17 | 1 / 12 / 20 | those 11, 2 unkeyed UC in the 1.1 row, 2 unkeyed UC in the decision log, unlinked IDs in 03 (Figure 1 Summary) and 14 (§18.2) |
| `review` | 68 | 68 | 26 | 4 / 12 / 26 | 13 unkeyed NFR or TI, 10 unkeyed UC (1 in 18; 9 in the decision log: 7 in the Business review register, 2 in the LOYALTY targeted-update entry), unlinked IDs in 03 (2) and 14 (1) |
| `s3c-sdd`, `s3c-lld` | 44, 44 | 44, 44 | 11, 11 | 1 / 12 / 20 | as `run-2026-09-30` |
| `s3d` | 30 | 29 | 26 | 0 / 0 / 3 | unkeyed IDs in 02, 06, 12, 13a, 18, the decision log, and the master |
| `fixture`, `run-old` | 5, 5 | 5, 5 | 5, 5 | 0 | unchanged |
| `uct-baseline`, `uct-green` | 258, 168 | the same | the same | 0 | unchanged (pre-key SDDs) |
| `uct-multi` | FileNotFoundError (no chunk 10) | the same | the same | - | pre-existing |

Markers are unchanged everywhere (96, 106, 83, 74, 106, 143).

---

## 3. `check_e2e.py`

### 3a. E4 compares dates only: confirmed, yes

The rule is `check_e2e.py:117-121`:

- `rec` is the first token after `**Reconciled:**`;
- `log_dates` takes the dates of the chunk 00 rows that match `| N.N | YYYY-MM-DD |`, so it skips `1.0 (amended)`;
- `e4 = rec >= max(log_dates)`, a string comparison of day dates.

On `review`, Reconciled is 2026-10-01 and row 1.3 (the business review) is also 2026-10-01, so E4 printed `met`. The master's own gate line says E4 is not met.

**What the SDD files record:**

- **The master** (`chunks/sdd-master.md:37`: `**Reconciled:** [YYYY-MM-DD of the last clean step 6a run]`) records a date only: no version, no time.
- **The chunk 00 Changes Log.** Rows are appended per version, so document order is version order. Columns: Version, Updated Date (a day), Updated By, Reviewed By, Approved By, Update Summary. The template has no field for "step 6a ran". The runs say it in free text at the end of the row:
  - `e2e`/`review` rows 1.1 and 1.2: "Step 6a rerun with no divergence";
  - `s3c` 1.1: "Step 6a rerun clean";
  - `run-2026-09-30` second 1.0: "the registers and §7.3 reconciled again";
  - `s3d` 1.1: "contract reconciliation rerun".

  The 2026-09-28 runs (`fixture`, `run-new`, `run-old`) never say it, and the review's row 1.3 does not.
- **The decision log `### Action entries`** (`decision-log.md:85-87`: "**[Action], [YYYY-MM-DD]:** [... contracts re-reconciled ...]") holds dated entries that sdd-unifier appends per session. They record 6a runs under free labels: "Reconciliation rerun", "Contract reconciliation", "Generation", "Acceptance loop", "Whole run", "LOYALTY v1.1 update".

  The business review, however, records its SDD changes in its own "Business review register" section. It also inserted its Note and Superseded entries between older Action entries: on `review` they sit at lines 805, 807, 811, 821, 827, and 833, around the reconciliation entries at 813 and 829. So the decision log's order places some review entries before the last reconciliation, and it cannot show that the review came after it.

So the only same-day order the files give is the Changes Log row order, and whether a row includes a 6a run is free text.

**The check (implemented):** E4 is met when Reconciled is not older than the last Changes Log date and one of these holds:

1. Reconciled is a later day than the last row; or
2. on the same day, the last Changes Log row records a step 6a rerun (`step 6a`, `6a rerun`, `reconciled again`, or `contract reconciliation`, case-insensitive); or
3. no row in the SDD records one at all (an older SDD). Then the date decides, and the output says the order is not recorded.

Limits, to settle in the sdd-unifier triage:

- **Fails closed after a no-bump rerun.** sdd-unifier's "the business review changed this SDD" row says "bump again only if step 6a changes a chunk". So a clean same-day rerun after a review adds no row, and E4 stays NOT met until a later-day reconciliation.
- **No chunk scope.** Every later row counts as a 09-13x change, because rows do not say which chunks they changed.
- **Free-text match.** The 6a record is matched in free text.

Two template changes would make the check exact:

- the Reconciled line names the Changes Log version it covers (for example `**Reconciled:** 2026-10-01 (v1.3)`), so E4 is "that version is the last row";
- or, with F1 of `step6-decisions.md` (each row ends with a `Chunks:` list), rows that change none of 09-13x can be ignored.

### 3b. Output order: confirmed, yes

`check_e2e.py:273` iterates `ids247 - {c["id"] ...}`, a set, so the §24.7 lines come out in hash order. Over `PYTHONHASHSEED` 0 to 7 the current script gives 8 different outputs on `e2e` and 8 on `review`. With `sorted(...)` it gives 1 on each. The other sets in the script (`nodes()`, §24.1) are only used for membership or are already sorted.

### Diff

```diff
--- a/_fixtures/checkers/check_e2e.py
+++ b/_fixtures/checkers/check_e2e.py
@@ -117,13 +117,22 @@
 master = read(next(f for f in os.listdir(SDD) if f.endswith("-sdd-master.md")))
 rec = re.search(r"\*\*Reconciled:\*\*\s*(\S+)", master)
 c00 = read("00-cover-and-changelog.md")
-log_dates = re.findall(r"^\|\s*\d+\.\d+\s*\|\s*(\d{4}-\d\d-\d\d)\s*\|", c00, re.M)
-e4 = rec and log_dates and rec.group(1) >= max(log_dates)
+log = [r for r in table(sect(c00, "## Changes Log"), "| Version") if re.match(r"\d{4}-\d\d-\d\d", r.get("Updated Date", ""))]
+log_dates = [r["Updated Date"][:10] for r in log]
+reruns = [i for i, r in enumerate(log) if re.search(r"step 6a|\b6a rerun|reconciled again|contract reconciliation", r.get("Update Summary", ""), re.I)]
+e4 = bool(rec and log_dates and rec.group(1) >= max(log_dates))
+e4_why = ""
+if e4 and rec.group(1) == max(log_dates):
+    if not reruns:
+        e4_why = " (by date only: no Changes Log row records a step 6a rerun, so the same-day order is not recorded)"
+    elif reruns[-1] != len(log) - 1:
+        e4 = False
+        e4_why = f" (same day: Changes Log row {log[-1]['Version']} comes after row {log[reruns[-1]]['Version']}, the last one that records a step 6a rerun)"
 gate = re.search(r"\*\*E2E gate \(chunk 19\):\*\*\s*(.+)$", master, re.M)
 print(f"E1 open items not closed: {len(e1)} {e1[:5]}")
 print(f"E2 open divergence rows: {len(e2)} {e2[:5]}")
 print(f"E3 markers: {sum(e3.values())} {e3}")
-print(f"E4 reconciled {rec.group(1) if rec else None} vs last Changes Log date {max(log_dates) if log_dates else None}: {'met' if e4 else 'NOT met'}")
+print(f"E4 reconciled {rec.group(1) if rec else None} vs last Changes Log date {max(log_dates) if log_dates else None}: {'met' if e4 else 'NOT met'}{e4_why}")
 print(f"master gate line: {gate.group(1).strip() if gate else None}")
 
 f19 = sorted(glob.glob(os.path.join(SDD, "19-*.md")))
@@ -270,7 +279,7 @@
             problems.append(f"§24.7 {c['id']} edge {row['edge']!r} vs §15.2 {c['caller']} -> {c['callee']}")
         if ("in-process" in c["type"]) != row["inproc"]:
             problems.append(f"§24.7 {c['id']} in-process label does not match §15.2 Type {c['type']!r}")
-    for a in ids247 - {c["id"] for c in internal}:
+    for a in sorted(ids247 - {c["id"] for c in internal}):
         problems.append(f"§24.7 cites {a}, which is not an internal contract in §15.2")
 
     # §24.2 external systems
```

### Tests

Commands: the two `run_all.py` lines in item 1, then `PYTHONIOENCODING=utf-8 python -B test_uc_keys_e2e.py`. The E cases are copies of `e2e` with a planted row 1.3 inserted after row 1.2 (trimmed `out\test_uc_keys_e2e.txt`):

```
[E1 same-day row 1.3, no step 6a recorded]   old: E4 ... met | problems: 5
                                              new: E4 ... NOT met (same day: Changes Log row 1.3 comes after row 1.2, the last one that records a step 6a rerun) | problems: 6 | - chunk 19 exists but the gate conditions are not all met
[E2 same-day row 1.3 that records its rerun] old: met | 5      new: met | 5
[E3 row 1.3 dated 2026-10-02]                 old: NOT met | 6   new: NOT met | 6
[E4 E1's row, Reconciled moved to 2026-10-02] old: met | 5      new: met | 5
[determinism run-2026-10-01-e2e]    old: 8 distinct outputs over PYTHONHASHSEED 0-7   new: 1
[determinism run-2026-10-01-review] old: 8 distinct outputs over PYTHONHASHSEED 0-7   new: 1
```

### Results per saved run

| Run | E4 before | E4 after | Problems before / after |
|---|---|---|---|
| `run-new`, `fixture`, `run-old` | met | met (by date only: no row records a step 6a rerun) | 0 / 0 |
| `run-2026-09-30` | met | met (last row says "reconciled again") | 0 / 0 |
| `e2e` | met | met (last row 1.2 records the rerun) | 5 / 5 (§24.7 lines now sorted API-01 to API-04) |
| `review` | met | NOT met (row 1.3 after row 1.2, same day) | 9 / 9 (the "gate conditions" problem already fired on E1) |
| `s3c-sdd`, `s3c-lld` | met | met (row 1.1 "Step 6a rerun clean") | 0 / 0 |
| `s3d` | met | met (row 1.1 "contract reconciliation rerun") | 0 / 0 |
| `uct-baseline`, `uct-green`, `uct-multi` | FileNotFoundError (no chunk 18 or 10) | the same | pre-existing |

---

## 4. `check_uc_keys.py`: an unreadable register

### Confirmed: yes

`register()` (`check_uc_keys.py:14-25`) reads the rows with the positional `ROW` pattern (line 11), which needs the link in the fourth cell. `review`'s register header is `| Key | BRD | Version | Status | Link | Covers |`, against the template's `| Key | BRD | Version | Link | Covers |` (`sdd-unifier/chunks/00-cover-and-changelog.md`). So no row matches, `keys` stays empty, and lines 45-47 report "key not in register" for each of the 166 keyed links.

Two more failure modes in the same function:

- a missing `00-cover-and-changelog.md` crashes at line 17;
- a missing `### Source BRDs` heading silently reads the cover up to the first `###`.

### The change

`register()` returns a reason when it cannot read the register: no 00 file, no heading, no table, a header that does not start `| Key | BRD | Version | Link |`, or no row with a key and a link. The "None - generated without a BRD" form counts as read, with no keys.

When the register is unreadable and the SDD has keyed UC links:

- it reports one problem, `cannot read the Source BRDs register: <reason>; N keyed UC links were not checked against it`;
- it skips the per-link key and folder checks, which need the register;
- it still checks each keyed link's file and anchor.

With no keyed links (the pre-register `uct` SDDs), the reason shows on the `Register:` line only, and the counts stay as they were.

An alternative, for your choice: read the register by column name, so `review`'s Status column is tolerated, and report the template deviation as one problem. That runs every per-key check on a deviating register. The cost is that the checker accepts a register shape the template does not define. The version here follows the request literally.

### Diff

```diff
--- a/_fixtures/checkers/check_uc_keys.py
+++ b/_fixtures/checkers/check_uc_keys.py
@@ -9,26 +9,41 @@
 UNKEYED_LINK = re.compile(r"\[(?:\*\*)?(UC-\d{2,})[^\]]*\]\(([^)\s]+)\)")
 BARE = re.compile(r"(?<![\w/\[-])([A-Z][A-Z0-9-]*/UC-\d{2,}|UC-\d{2,})")
 ROW = re.compile(r"^\|\s*([A-Z][A-Z0-9-]*)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*\[[^\]]*\]\(([^)\s]+)\)")
+TEMPLATE_HEAD = ["Key", "BRD", "Version", "Link"]
 
 
 def register(sdd_dir):
     keys = {}
     path = os.path.join(sdd_dir, "00-cover-and-changelog.md")
+    if not os.path.isfile(path):
+        return keys, "", "00-cover-and-changelog.md not found"
     with open(path, encoding="utf-8") as f:
         text = f.read()
-    section = text.split("### Source BRDs", 1)[-1].split("###", 1)[0]
-    for line in section.splitlines():
-        m = ROW.match(line.strip())
+    if "### Source BRDs" not in text:
+        return keys, text, "no '### Source BRDs' heading in 00-cover-and-changelog.md"
+    section = re.split(r"\n#{2,3} ", text.split("### Source BRDs", 1)[1], maxsplit=1)[0]
+    rows = [l.strip() for l in section.splitlines() if l.strip().startswith("|")]
+    if not rows:
+        if "None - generated without a BRD" in section:
+            return keys, text, None
+        return keys, text, "no table under '### Source BRDs'"
+    head = [c.strip() for c in rows[0].strip("|").split("|")]
+    if head[:4] != TEMPLATE_HEAD:
+        return keys, text, f"its header is '{rows[0]}', and the template's starts '| {' | '.join(TEMPLATE_HEAD)} |' (the link must be the fourth cell)"
+    for line in rows[2:]:
+        m = ROW.match(line)
         if m and m.group(1) not in ("KEY",):
             target = os.path.normpath(os.path.join(sdd_dir, m.group(4)))
             keys[m.group(1)] = (m.group(2), m.group(3), os.path.dirname(target))
-    return keys, text
+    if not keys:
+        return keys, text, "no row has a key and a link in its Link cell"
+    return keys, text, None
 
 
 def main(sdd_dir):
     sdd_dir = os.path.abspath(sdd_dir)
-    keys, cover = register(sdd_dir)
-    print("Register:")
+    keys, cover, unreadable = register(sdd_dir)
+    print("Register:" + (f" not read ({unreadable})" if unreadable else ""))
     for k, (name, ver, folder) in keys.items():
         print(f"  {k}: {name} v{ver} -> {os.path.basename(folder)} (exists: {os.path.isdir(folder)})")
     print("Child LLDs section present:", "### Child LLDs" in cover)
@@ -42,12 +57,13 @@
         for line in body:
             for key, uc, target in KEYED_LINK.findall(line):
                 keyed[name] += 1
-                if key not in keys:
-                    problems.append((name, f"{key}/{uc}", "key not in register"))
-                    continue
                 resolved = os.path.normpath(os.path.join(sdd_dir, target.split("#")[0]))
-                if not resolved.startswith(keys[key][2]):
-                    problems.append((name, f"{key}/{uc}", f"links outside {os.path.basename(keys[key][2])}"))
+                if not unreadable:
+                    if key not in keys:
+                        problems.append((name, f"{key}/{uc}", "key not in register"))
+                        continue
+                    if not resolved.startswith(keys[key][2]):
+                        problems.append((name, f"{key}/{uc}", f"links outside {os.path.basename(keys[key][2])}"))
                 file_part, _, anchor = target.partition("#")
                 if not os.path.isfile(resolved):
                     problems.append((name, f"{key}/{uc}", "file missing"))
@@ -59,6 +75,9 @@
             without = LINK.sub("", line)
             for m in BARE.findall(without):
                 bare[name] += 1
+    if unreadable and sum(keyed.values()):
+        problems.insert(0, ("00-cover-and-changelog.md", "Source BRDs", f"cannot read the Source BRDs register: {unreadable}; "
+                                                                        f"{sum(keyed.values())} keyed UC links were not checked against it"))
     print("Per file: keyed links / unkeyed links / bare mentions")
     for name in sorted(set(keyed) | set(unkeyed) | set(bare)):
         print(f"  {name}: {keyed[name]} / {unkeyed[name]} / {bare[name]}")
```

### Tests

Commands: the two `run_all.py` lines in item 1, then `PYTHONIOENCODING=utf-8 python -B test_uc_keys_e2e.py` (trimmed):

```
review (saved run), new:
  Problems: 1
   ('00-cover-and-changelog.md', 'Source BRDs', "cannot read the Source BRDs register: its header is '| Key | BRD | Version | Status | Link | Covers |', and the template's starts '| Key | BRD | Version | Link |' (the link must be the fourth cell); 166 keyed UC links were not checked against it")
[K1 e2e: register heading renamed]   old: Problems: 148 ('key not in register' x148)   new: Problems: 1 (cannot read ...: no '### Source BRDs' heading ...; 148 keyed UC links ...)
[K2 e2e: Status column added, plus one broken anchor in 05]   old: Problems: 149 (the broken anchor not reported)   new: Problems: 2 (cannot read ...; ('05-workflows-and-sequences.md', 'REFUNDS/UC-01', 'anchor missing'))
[K3 e2e: readable register, unregistered key WALLET in 05]    old: 1 ('WALLET/UC-01', 'key not in register')   new: the same
```

### Results per saved run

| Run | Before | After | `Register:` line after |
|---|---|---|---|
| `review` | 166 | 1 | not read (Status column before Link) |
| `uct-green` | 100 | 100 | not read (no `### Source BRDs` heading); the 100 are unkeyed links, as the README says |
| `uct-baseline` | 0 | 0 | not read (no heading) |
| `run-new`, `run-2026-09-30`, `e2e`, `s3c-sdd`, `s3c-lld`, `s3d`, `fixture`, `run-old`, `uct-multi` | 0 | 0 | read; output identical |

---

## 5. `.gitignore`: `.playwright-mcp/`

**Confirmed.** `.playwright-mcp/` is not ignored today: `git check-ignore --no-index -v .playwright-mcp/page.yml` matches nothing, and `core.excludesFile` is unset. No `.playwright-mcp` folder exists in the repo now (`find`, depth 4).

**Proposal.** Add a third section at the end of `.gitignore`, after `# Python`, because it is neither a local-only skill nor Python. Leave it unanchored, because the MCP writes into its working directory, which can be a skill subfolder:

```diff
--- a/.gitignore
+++ b/.gitignore
@@ -10,3 +10,6 @@
 __pycache__/
 *.pyc
 .pytest_cache/
+
+# Tool output written into the working tree (Playwright MCP snapshots and logs)
+.playwright-mcp/
```

**Test** (read-only: the two lines in `scratch\checkers\gitignore-addition.txt`, passed as `-c core.excludesFile=...` to `git --no-optional-locks check-ignore --no-index -v`):

| Path | Result |
|---|---|
| `.playwright-mcp/page.yml` | ignored (`gitignore-addition.txt:3:.playwright-mcp/`) |
| `lld-unifier/.playwright-mcp/x.png` | ignored |
| `_fixtures/.playwright-mcp/a/b.log` | ignored |
| `playwright-mcp/x` | not ignored |
| `.playwright-mcp-other/x` | not ignored |

---

## 6. `_fixtures/README.md`: statements the changes make wrong

Line numbers are from the current README. Statements not listed stay true: the other result cells, How to run (the commands and file names do not change), the `sdd-uc-trace/run-green` "100 unkeyed links" (still 100), and the lld-modular-monolith row (check_trace 0, 2 notes).

**1. Line 34, `check_trace.py`, "What it checks".**

Now:
> `@UseCase` on every §7.3 entry point in the owner's 04 file

Replace with:
> `@UseCase` on every §7.3 entry point, read from the owner's 04 §7.2 only: one by one where §7.2 allows it (a traced entry point row, a Controllers row with one endpoint, or a values list marked `in that order`), and then equal to the §7.3 value; otherwise against the Controllers row that lists the entry point (a swap between two endpoints of one row is not caught); every §7.2 value names an Active §7.3 use case that lists one of that row's endpoints; the output says how many entry points were checked each way

**2. Line 34, `check_trace.py`, `run-2026-10-01-review` cell.**

Now:
> 11 problems: the 5 known route problems plus 6 because the SDD moved past the LLD (REFUNDS/UC-01 entry point now `POST /v1/receipt-lookups`, REFUNDS/UC-06 has no 04 block, the §19.9 index order, two `@UseCase`, the old route in 06 §9.1); the notes list a REFUNDS mockup row with no screen ID

Replace with:
> 12 problems: the 5 known route problems plus 7 because the SDD moved past the LLD (REFUNDS/UC-01 entry point now `POST /v1/receipt-lookups`, REFUNDS/UC-06 has no 04 block, the §19.9 index order, three `@UseCase`: the new UC-01 entry point and UC-06's report endpoint carry none, and `ReceiptController` still carries `REFUNDS/UC-01` on the old lookup; the old route in 06 §9.1); the notes list a REFUNDS mockup row with no screen ID

**3. Line 35, `check_sdd.py`, "What it checks".**

Now:
> API IDs in the chunk 11 index;

Replace with (both outcomes):
> API IDs anywhere in the SDD in the chunk 11 index (in chunk 18, option bullets, Why fields, and the Recommended Answer of an item that is not `Accepted - applied` are proposals and are skipped);

Outcome B only: also replace
> UC IDs keyed and linked (inline code, the §7.3 `Merged into KEY/UC-NN` status, and `KEY 12 TI-NN` are accepted);

with
> UC IDs keyed and linked (inline code, the §7.3 `Merged into KEY/UC-NN` status, and `KEY 12 TI-NN` are accepted; in chunk 18, the decision log, and the 00 Changes Log rows a keyed ID need not be a link);

**4. Line 35, `check_sdd.py`, result cells.**

Outcome A changes no count. The `run-2026-09-30` cell is already slightly wrong in both outcomes: 2 of the 11 unkeyed IDs are TI IDs in chunk 02.

- Outcome A, `run-2026-09-30`:
  - now: "37 problems (26 unlinked use cases, 11 unkeyed NFR or TI IDs, in chunk 18 and the decision log), 106 markers"
  - replace with: "37 problems (26 unlinked use cases in chunk 18 and the decision log; 11 unkeyed NFR or TI IDs: 7 in chunk 18, 2 in 02, 2 in the decision log), 106 markers"
- Outcome B, cell by cell:

| Column | Replacement |
|---|---|
| `run-new` | unchanged |
| `run-2026-09-30` | 11 problems (unkeyed NFR or TI IDs: 7 in chunk 18, 2 in 02, 2 in the decision log), 106 markers |
| `run-2026-10-01-e2e` | 17 problems (the same 11, 2 unkeyed UC IDs in the 1.1 Changes Log row and 2 in the decision log, and unlinked IDs in 03 Figure 1 Summary and 14 §18.2), 83 markers |
| `run-2026-10-01-review` | 26 problems (13 unkeyed NFR or TI IDs; 10 unkeyed UC IDs, 1 in chunk 18 and 9 in the decision log, 7 of them in the review's records; unlinked IDs in 03 and 14), 74 markers |

**5. Line 36, `check_e2e.py`, "What it checks".**

Now:
> E4 (the master's Reconciled date is not older than the last Changes Log date)

Replace with:
> E4 (the master's Reconciled date is not older than the last Changes Log date; on the same day, the last Changes Log row must record a step 6a rerun, unless no row records one, when the date alone decides and the output says so)

At the end of the same cell, "(all caught)." becomes:
> (all caught). E4's same-day rule was tested on four planted Changes Log rows; problems are printed in a fixed order.

**6. Line 36, `check_e2e.py`, `run-2026-10-01-review` cell.**

Now:
> E4 reads met only because the check compares dates and the review ran on the reconciliation's date (the gate line says `Shut - Stale`)

Replace with:
> E4 not met: the review's Changes Log row 1.3 comes after row 1.2, the last that records a step 6a rerun, on the same day (the gate line says `Shut - Stale`)

**7. Line 38, `check_uc_keys.py`.**

"What it checks", now:
> Source BRDs register; every UC link is keyed, its key is registered, and it stays inside that BRD's folder; Child LLDs section present. Imports `check_uc_links.py`.

Replace with:
> Source BRDs register; every UC link is keyed, its key is registered, and it stays inside that BRD's folder; Child LLDs section present. A register it cannot read (no 00 file, no `### Source BRDs` heading, no table, or a header that does not start `| Key | BRD | Version | Link |`) is one problem, `cannot read the Source BRDs register: <reason>`, when the SDD has keyed UC links; those links are then checked for file and anchor only. Imports `check_uc_links.py`.

`run-2026-10-01-review` cell, now:
> 166 problems: the Source BRDs register gained a Status column, so the register is not read and every key reads as unregistered

Replace with:
> 1 problem: cannot read the Source BRDs register (a Status column before Link); its 166 keyed links resolve (file and anchor)

**8. Line 78, scenario `sdd-version-tracking/`, outcome B only.**

Now:
> Checkers: as `run-2026-09-30` except check_sdd 44 (7 more unlinked use cases in the 1.1 Changes Log row and the decision log).

Replace with:
> Checkers: as `run-2026-09-30` (check_sdd 11 in both).

---

## Files in `SP\s6\scratch\checkers\`

| File or folder | What it is |
|---|---|
| `check_trace.py` | Proposed `check_trace.py` (item 1) |
| `check_sdd.links-required.py` | Proposed `check_sdd.py`, outcome A: the 2a fix, links still required in chunk 18, the decision log, and the 00 Changes Log rows |
| `check_sdd.links-exempt.py` | Proposed `check_sdd.py`, outcome B: the 2a fix plus those three places exempt from "keyed ID must be a link" (still must be keyed) |
| `check_e2e.py` | Proposed `check_e2e.py` (item 3) |
| `check_uc_keys.py` | Proposed `check_uc_keys.py` (item 4); imports the unchanged `check_uc_links.py` from `_fixtures/checkers` (set `PYTHONPATH`, or copy it next to it) |
| `orig\` | Byte copies of the current repo `check_trace.py`, `check_sdd.py`, `check_e2e.py`, `check_uc_keys.py`, `check_uc_links.py` (the baseline) |
| `diffs\` | Unified diffs: the four scripts (two for check_sdd) against `orig\`, and `gitignore.diff` |
| `gitignore-addition.txt` | The two proposed `.gitignore` lines, used with `git check-ignore --no-index` |
| `run_all.py` | Runs a checker folder over every saved run (`python -B`, UTF-8, `PYTHONPATH=_fixtures/checkers`); writes `out\<label>\<script>--<run>.txt` |
| `plant.py` | Test helper: copies a saved run into `plant\<case>\`, edits it by exact replacement, compares old and new scripts |
| `test_trace.py`, `test_sdd.py`, `test_uc_keys_e2e.py` | The planted-error tests (T1-T8; A1, B1; K1-K3, E1-E4, determinism) |
| `plant\` | The planted copies: `trace-t1` to `trace-t8`, `sdd-a1`, `sdd-b1`, `keys-k1` to `keys-k3`, `e2e-e1` to `e2e-e4` |
| `out\final-before\`, `out\final-after\` | Checker outputs on every saved run, current and proposed scripts, `PYTHONHASHSEED=0` |
| `out\test_trace.txt`, `out\test_sdd.txt`, `out\test_uc_keys_e2e.txt` | The planted-test outputs quoted above |

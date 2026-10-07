import hashlib
import sys
from collections import Counter
from datetime import datetime
from pathlib import Path

ROOT = Path(r"C:\Users\negat\.claude\skills")
DL = Path(r"C:\Users\negat\Downloads")
OUT = ROOT / "_fixtures/notes/step6-handoffs/handoff-manifest-2.txt"
SKIP_PARTS = {"__pycache__", ".pytest_cache"}
SKIP_PREFIXES = ("_fixtures/runs-wip/step6-R/backups/", "_fixtures/runs-wip/step6-R/run/",
                 "_fixtures/runs-wip/step6-R/snapshots/", "_fixtures/runs-wip/close/",
                 "_fixtures/notes/step6-handoffs/handoff-manifest-2.txt")


def collect():
    rows = {}
    for top in ["pre-brd-unifier", "brd-unifier", "sdd-unifier", "lld-unifier", "business-reviewer-unifier", "_fixtures"]:
        for p in sorted((ROOT / top).rglob("*")):
            if not p.is_file() or SKIP_PARTS & set(p.parts):
                continue
            rel = p.relative_to(ROOT).as_posix()
            if rel.startswith(SKIP_PREFIXES):
                continue
            rows[rel] = p
    for name in ["README.md", "UNIFIER-ENHANCEMENTS.md", ".gitignore"]:
        rows[name] = ROOT / name
    for p in sorted(DL.glob("agent-*-unifier.md")) + [DL / "team-product-management-guidelines.md"]:
        rows[str(p)] = p
    return {k: (hashlib.sha256(p.read_bytes()).hexdigest(), p.stat().st_size) for k, p in rows.items() if p.is_file()}


def group(rel):
    parts = rel.replace("\\", "/").split("/")
    if rel.startswith("C:"):
        return "Downloads (Band files)"
    if parts[0] == "_fixtures":
        return "/".join(parts[:3]) if len(parts) > 3 else "/".join(parts[:2])
    return parts[0]


if len(sys.argv) > 1 and sys.argv[1] == "write":
    cur = collect()
    lines = [f"# Handoff manifest 2, {datetime.now():%Y-%m-%d %H:%M} (before the Codex close-out of resume-codex-2.md)",
             "# sha256  bytes  path (repo-relative, or absolute for Downloads)"]
    lines += [f"{h}  {s}  {k}" for k, (h, s) in sorted(cur.items())]
    OUT.write_text("\n".join(lines) + "\n", encoding="utf-8", newline="\n")
    print("files:", len(cur), "->", OUT)
else:
    old = {}
    for line in OUT.read_text(encoding="utf-8").splitlines():
        if line.startswith("#") or not line.strip():
            continue
        h, s, k = line.split("  ", 2)
        old[k] = h
    cur = {k: h for k, (h, _) in collect().items()}
    added = sorted(set(cur) - set(old))
    removed = sorted(set(old) - set(cur))
    changed = sorted(k for k in set(old) & set(cur) if old[k] != cur[k])
    print(f"manifest {len(old)} files, now {len(cur)}: added {len(added)}, removed {len(removed)}, changed {len(changed)}")
    for label, items in (("ADDED", added), ("REMOVED", removed), ("CHANGED", changed)):
        print(f"== {label} by group: {dict(Counter(group(k) for k in items))}")
        for k in items:
            if not k.startswith("_fixtures/runs-wip/step6-R/review/") and "/rerun-2026-10-07/" not in k and not k.startswith("_fixtures/chain/run-2026-10-07-review/"):
                print("  ", k)
    review = {k[len("_fixtures/runs-wip/step6-R/review/"):]: h for k, h in old.items() if k.startswith("_fixtures/runs-wip/step6-R/review/")}
    saved = {k[len("_fixtures/chain/run-2026-10-07-review/"):]: h for k, h in cur.items() if k.startswith("_fixtures/chain/run-2026-10-07-review/")}
    if saved:
        diff = sorted(k for k in set(review) | set(saved) if review.get(k) != saved.get(k))
        print(f"== saved baseline vs the pre-Codex review copy: {len(saved)} saved, {len(review)} in manifest, differing: {diff}")

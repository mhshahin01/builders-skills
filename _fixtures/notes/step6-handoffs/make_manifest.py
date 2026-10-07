import hashlib
from datetime import datetime
from pathlib import Path

ROOT = Path(r"C:\Users\negat\.claude\skills")
DL = Path(r"C:\Users\negat\Downloads")
OUT = ROOT / "_fixtures/notes/step6-handoffs/handoff-manifest.txt"

groups = [ROOT / d for d in ["pre-brd-unifier", "brd-unifier", "sdd-unifier", "lld-unifier", "business-reviewer-unifier",
                             "_fixtures/checkers", "_fixtures/runs-wip"]]
singles = [ROOT / "README.md", ROOT / "UNIFIER-ENHANCEMENTS.md", ROOT / "_fixtures/README.md", ROOT / ".gitignore"]
singles += sorted(DL.glob("agent-*-unifier.md")) + [DL / "team-product-management-guidelines.md"]

rows = []
for g in groups:
    for p in sorted(g.rglob("*")):
        if p.is_file() and "__pycache__" not in p.parts and ".pytest_cache" not in p.parts:
            rows.append(p)
rows += [p for p in singles if p.exists()]

lines = [f"# Handoff manifest, {datetime.now():%Y-%m-%d %H:%M} (before Codex resumed stage R2)",
         "# sha256  bytes  path (repo-relative, or absolute for Downloads)"]
for p in rows:
    h = hashlib.sha256(p.read_bytes()).hexdigest()
    rel = p.relative_to(ROOT).as_posix() if str(p).startswith(str(ROOT)) else str(p)
    lines.append(f"{h}  {p.stat().st_size}  {rel}")
OUT.write_text("\n".join(lines) + "\n", encoding="utf-8", newline="\n")
print("files:", len(rows), "->", OUT)

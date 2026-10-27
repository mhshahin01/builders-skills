#!/bin/sh
# impl-tracker: lint the task of the commit just made (seconds), so paperwork mistakes surface at commit
# time, not after minutes of pre-flight. Never blocks the commit; prints only when something fails.
task=$(git log -1 --format='%(trailers:key=Task,valueonly)' | head -n1 | tr -d '[:space:]')
[ -z "$task" ] && exit 0
root=$(git rev-parse --show-toplevel)
tracking=$(ls -d "$root"/tracking "$root"/*/tracking 2>/dev/null | head -n1)
[ -z "$tracking" ] && exit 0
# lint is for open tasks: a Done or Verified task (its closing tracking commit) has nothing left to fix
grep -F "[$task]" "$tracking/index.md" 2>/dev/null | grep -qE '\| (Done|Verified|Dropped) \|' && exit 0
script="$HOME/.claude/skills/impl-tracker-unifier/scripts/preflight.py"
py=$(command -v python3 || command -v python)
out=$("$py" "$script" --tracking "$tracking" --task "$task" --lint 2>&1)
if printf '%s' "$out" | grep -q 'LINT: FAIL'; then
  echo ""
  echo "impl-tracker lint for $task found problems (fix before pre-flight):"
  printf '%s\n' "$out" | grep -E '^\| FAIL|^- `'
fi
exit 0

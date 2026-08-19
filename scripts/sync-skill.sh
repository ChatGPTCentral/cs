#!/usr/bin/env bash
#
# The repo is the source of truth for this project's skills.
# The account-level copies at ~/.claude/skills/ are what make them available in
# sessions outside this repo - Claude Desktop, other projects, the web app.
#
# Usage:
#   scripts/sync-skill.sh          install repo -> account (all skills)
#   scripts/sync-skill.sh --check  show what differs, change nothing
#   scripts/sync-skill.sh --pull   copy account -> repo, for edits made elsewhere
#
set -euo pipefail

REPO_SKILLS="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/.claude/skills"
HOME_SKILLS="${HOME}/.claude/skills"

[ -d "$REPO_SKILLS" ] || { echo "no skills dir at $REPO_SKILLS" >&2; exit 1; }

SKILLS=()
for d in "$REPO_SKILLS"/*/; do
  [ -f "${d}SKILL.md" ] && SKILLS+=("$(basename "$d")")
done
[ ${#SKILLS[@]} -gt 0 ] || { echo "no skills found in $REPO_SKILLS" >&2; exit 1; }

case "${1:-}" in
  --check)
    rc=0
    for s in "${SKILLS[@]}"; do
      if [ ! -d "$HOME_SKILLS/$s" ]; then
        echo "$s: not installed"; rc=1; continue
      fi
      if diff -ru "$HOME_SKILLS/$s" "$REPO_SKILLS/$s" >/dev/null; then
        echo "$s: in sync"
      else
        echo "$s: DIFFERS"; diff -ru "$HOME_SKILLS/$s" "$REPO_SKILLS/$s" || true; rc=1
      fi
    done
    exit $rc
    ;;
  --pull)
    for s in "${SKILLS[@]}"; do
      [ -d "$HOME_SKILLS/$s" ] || { echo "$s: nothing installed, skipping"; continue; }
      rm -rf "${REPO_SKILLS:?}/$s"; mkdir -p "$REPO_SKILLS/$s"
      cp -R "$HOME_SKILLS/$s/." "$REPO_SKILLS/$s/"
      echo "pulled $s"
    done
    echo "review with: git diff"
    ;;
  "")
    mkdir -p "$HOME_SKILLS"
    for s in "${SKILLS[@]}"; do
      rm -rf "${HOME_SKILLS:?}/$s"
      cp -R "$REPO_SKILLS/$s" "$HOME_SKILLS/$s"
      echo "installed $s"
    done
    ;;
  *)
    echo "usage: $0 [--check|--pull]" >&2; exit 1 ;;
esac

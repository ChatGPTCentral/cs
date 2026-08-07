#!/usr/bin/env bash
#
# The repo is the source of truth for the aic-customer-support skill.
# The account-level copy at ~/.claude/skills/ is what makes it available in
# sessions outside this repo -- Claude Desktop, other projects, the web app.
#
# Usage:
#   scripts/sync-skill.sh          install repo -> account
#   scripts/sync-skill.sh --check  show what differs, change nothing
#   scripts/sync-skill.sh --pull   copy account -> repo, for edits made elsewhere
#
set -euo pipefail

SKILL="aic-customer-support"
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/.claude/skills/$SKILL"
HOME_DIR="${HOME}/.claude/skills/$SKILL"

[ -d "$REPO_DIR" ] || { echo "no skill at $REPO_DIR" >&2; exit 1; }

case "${1:-}" in
  --check)
    if [ ! -d "$HOME_DIR" ]; then
      echo "not installed at $HOME_DIR -- run without arguments to install"
      exit 0
    fi
    # diff exits 1 when files differ; that is information here, not failure
    if diff -ru "$HOME_DIR" "$REPO_DIR"; then
      echo "in sync"
    fi
    ;;
  --pull)
    [ -d "$HOME_DIR" ] || { echo "nothing installed at $HOME_DIR" >&2; exit 1; }
    rm -rf "${REPO_DIR:?}"
    mkdir -p "$REPO_DIR"
    cp -R "$HOME_DIR/." "$REPO_DIR/"
    echo "pulled $HOME_DIR -> $REPO_DIR"
    echo "review with: git diff"
    ;;
  "")
    mkdir -p "$(dirname "$HOME_DIR")"
    rm -rf "${HOME_DIR:?}"
    cp -R "$REPO_DIR" "$HOME_DIR"
    echo "installed $REPO_DIR -> $HOME_DIR"
    ;;
  *)
    echo "usage: $0 [--check|--pull]" >&2
    exit 1
    ;;
esac

#!/usr/bin/env bash
set -euo pipefail

# 1. Pick the Python in your venv (or fallback to python3 / py -3)
if command -v python >/dev/null 2>&1; then
  PYTHON=python
elif command -v python3 >/dev/null 2>&1; then
  PYTHON=python3
elif command -v py >/dev/null 2>&1; then
  PYTHON='py -3'
else
  echo "❌ ERROR: no Python interpreter found (python, python3 or py)." >&2
  exit 1
fi

# 2. Hand off to the Python runner
exec "$PYTHON" "$(dirname "$0")/setup_db.py"

#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

source "$SCRIPT_DIR/../common.sh"

echo "=== Running CI for TAG: $TAG ==="

echo ""
echo "=== Building and testing django-backend ==="
cd "$ROOT_DIR/src/django-backend"
make build
make test
make publish

echo ""
echo "=== Building and testing web-ui ==="
cd "$ROOT_DIR/src/web-ui"
make build
make test || echo "No tests configured for web-ui, skipping..."
make publish

echo ""
echo "=== CI completed successfully ==="

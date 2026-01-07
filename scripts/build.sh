#!/bin/bash

set -euxo pipefail
APP="$1"
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
ROOT_DIR="$SCRIPT_DIR/.."
source "$SCRIPT_DIR/common.sh"

echo "Building Docker image rg.fr-par.scw.cloud/$PROJECT_ID/$APP:$TAG"

# Copy workspace lock file for Docker build
cp "$ROOT_DIR/uv.lock" uv.lock

docker build -t "rg.fr-par.scw.cloud/$PROJECT_ID/$APP:$TAG" --platform=linux/amd64 .

# Clean up copied lock file
rm -f uv.lock
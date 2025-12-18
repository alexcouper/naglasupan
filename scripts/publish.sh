#!/bin/bash

set -euxo pipefail
APP="$1"

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
source "$SCRIPT_DIR/common.sh"

docker push "rg.fr-par.scw.cloud/$PROJECT_ID/$APP:$TAG"
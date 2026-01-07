#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

source "$SCRIPT_DIR/../common.sh"

S3_BUCKET="sideproject-tfstate"
S3_ENDPOINT="https://s3.fr-par.scw.cloud"
AWS_PROFILE="naglasupan-prod"

echo "=== Running CI-Ship for TAG: $TAG ==="

# Run the CI pipeline first
"$SCRIPT_DIR/ci.sh"

echo ""
echo "=== Updating versions.json in S3 ==="

# Write versions to S3 (Terraform reads this to get container image tags)
echo "{\"backend\":\"$TAG\",\"web-ui\":\"$TAG\"}" | \
  aws s3 cp - "s3://$S3_BUCKET/versions.json" \
  --endpoint-url "$S3_ENDPOINT" \
  --profile "$AWS_PROFILE"

echo "Updated versions.json with TAG: $TAG"

echo ""
echo "=== Running Terraform Apply ==="
cd "$ROOT_DIR/infra/prod/app"
terraform init
terraform apply -auto-approve

echo ""
echo "=== CI-Ship completed successfully ==="

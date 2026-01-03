#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

source "$SCRIPT_DIR/../common.sh"

CONTAINER_TF="$ROOT_DIR/infra/prod/app/container.tf"

echo "=== Running CI-Ship for TAG: $TAG ==="

# Run the CI pipeline first
"$SCRIPT_DIR/ci.sh"

echo ""
echo "=== Updating container.tf with new image tags ==="

# Update the backend image tag
sed -i '' "s|funcscwsideprojectprodaa67l9qf/django-backend:[^\"]*|funcscwsideprojectprodaa67l9qf/django-backend:$TAG|g" "$CONTAINER_TF"

# Update the frontend image tag
sed -i '' "s|funcscwsideprojectprodaa67l9qf/web-ui:[^\"]*|funcscwsideprojectprodaa67l9qf/web-ui:$TAG|g" "$CONTAINER_TF"

echo "Updated container.tf with TAG: $TAG"

echo ""
echo "=== Running Terraform Apply ==="
cd "$ROOT_DIR/infra/prod/app"
terraform init
terraform apply -auto-approve

echo ""
echo "=== CI-Ship completed successfully ==="

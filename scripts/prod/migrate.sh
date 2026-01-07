#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

export PGUSER=$(scw iam api-key get "$SCW_ACCESS_KEY" -o json | jq -r .APIKey.user_id)
export PGPASSWORD=$SCW_SECRET_KEY
export DATABASE_URL=postgres://72cf0c68-befa-416b-af77-619bfec78040.pg.sdb.fr-par.scw.cloud:5432/sideproject-prod?sslmode=require

cd "$PROJECT_ROOT/src/django-backend" && uv run python manage.py migrate
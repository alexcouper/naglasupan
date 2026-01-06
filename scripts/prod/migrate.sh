#!/bin/bash
export PGUSER=$(terraform output -json backend_iam_application_id | tr -d '"')
export PGPASSWORD=$(terraform output -json backend_iam_api_key_secret_key | tr -d '"')

export DATABASE_URL=postgres://72cf0c68-befa-416b-af77-619bfec78040.pg.sdb.fr-par.scw.cloud:5432/sideproject-prod?sslmode=require

uv run python manage.py migrate
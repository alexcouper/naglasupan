# Read container image versions from S3
# This file is updated by CI before terraform apply
data "aws_s3_object" "versions" {
  provider = aws.scaleway_s3
  bucket   = "sideproject-tfstate"
  key      = "versions.json"
}

locals {
  versions = jsondecode(data.aws_s3_object.versions.body)
}

resource "scaleway_container_namespace" "main" {
  name        = "${var.project_name}-${var.environment}"
  description = "Container namespace for ${var.project_name}"
  region      = var.region
}

resource "scaleway_container" "backend" {
  name           = "backend"
  namespace_id   = scaleway_container_namespace.main.id
  registry_image = "rg.fr-par.scw.cloud/funcscwsideprojectprodaa67l9qf/django-backend:${local.versions.backend}"
  port           = 8000
  cpu_limit      = 256
  memory_limit   = 512
  min_scale      = 1
  max_scale      = 1
  privacy        = "public"
  deploy         = true
  http_option    = "redirected"

  environment_variables = {
    DATABASE_URL         = scaleway_sdb_sql_database.main.endpoint
    SCW_ACCESS_KEY       = scaleway_iam_api_key.backend.access_key
    PGUSER               = scaleway_iam_application.backend.id
    CORS_ALLOWED_ORIGINS = "https://naglasupan.is"
    ADMIN_ALLOWED_IPS    = "157.97.17.17,178.43.233.34"  # alex home, poland
    # S3/Object Storage settings for image uploads
    S3_BUCKET_NAME     = scaleway_object_bucket.project_images.name
    S3_ENDPOINT_URL    = "https://s3.${var.region}.scw.cloud"
    S3_REGION          = var.region
    S3_PUBLIC_URL_BASE = "https://${scaleway_object_bucket.project_images.name}.s3.${var.region}.scw.cloud"
  }

  secret_environment_variables = {
    SCW_SECRET_KEY = scaleway_iam_api_key.backend.secret_key
    PGPASSWORD     = scaleway_iam_api_key.backend.secret_key
  }
}

resource "scaleway_container" "frontend" {
  name           = "frontend"
  namespace_id   = scaleway_container_namespace.main.id
  registry_image = "rg.fr-par.scw.cloud/funcscwsideprojectprodaa67l9qf/web-ui:${local.versions["web-ui"]}"
  port           = 3000
  cpu_limit      = 256
  memory_limit   = 512
  min_scale      = 1
  max_scale      = 1
  privacy        = "public"
  deploy         = true
  http_option    = "redirected"

  environment_variables = {
    API_URL = "https://api.naglasupan.is"
  }
}

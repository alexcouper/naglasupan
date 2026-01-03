resource "scaleway_container_namespace" "main" {
  name        = "${var.project_name}-${var.environment}"
  description = "Container namespace for ${var.project_name}"
  region      = var.region
}

resource "scaleway_container" "backend" {
  name           = "backend"
  namespace_id   = scaleway_container_namespace.main.id
  registry_image = "rg.fr-par.scw.cloud/funcscwsideprojectprodaa67l9qf/django-backend:tykrpnkvwztt-6e093f710c5b"
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
    ADMIN_ALLOWED_IPS    = "157.97.17.17"
  }

  secret_environment_variables = {
    SCW_SECRET_KEY = scaleway_iam_api_key.backend.secret_key
    PGPASSWORD     = scaleway_iam_api_key.backend.secret_key
  }
}

resource "scaleway_container" "frontend" {
  name           = "frontend"
  namespace_id   = scaleway_container_namespace.main.id
  registry_image = "rg.fr-par.scw.cloud/funcscwsideprojectprodaa67l9qf/web-ui:nrmputtzzqpv-8f709433122a"
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

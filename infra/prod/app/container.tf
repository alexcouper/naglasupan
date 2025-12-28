resource "scaleway_container_namespace" "main" {
  name        = "${var.project_name}-${var.environment}"
  description = "Container namespace for ${var.project_name}"
  region      = var.region
}

resource "scaleway_container" "backend" {
  name           = "backend"
  namespace_id   = scaleway_container_namespace.main.id
  registry_image = "rg.fr-par.scw.cloud/funcscwsideprojectprodaa67l9qf/django-backend:yxyzpomrnwmk-84a3c51fde2a"
  port           = 8000
  cpu_limit      = 256
  memory_limit   = 512
  min_scale      = 0
  max_scale      = 1
  privacy        = "public"
  deploy         = true

  environment_variables = {
    DATABASE_URL         = scaleway_sdb_sql_database.main.endpoint
    SCW_ACCESS_KEY       = scaleway_iam_api_key.backend.access_key
    PGUSER               = scaleway_iam_application.backend.id
    CORS_ALLOWED_ORIGINS = "https://sideprojectprodaa67l9qf-frontend.functions.fnc.fr-par.scw.cloud"
  }

  secret_environment_variables = {
    SCW_SECRET_KEY = scaleway_iam_api_key.backend.secret_key
    PGPASSWORD     = scaleway_iam_api_key.backend.secret_key
  }
}

resource "scaleway_container" "frontend" {
  name           = "frontend"
  namespace_id   = scaleway_container_namespace.main.id
  registry_image = "rg.fr-par.scw.cloud/funcscwsideprojectprodaa67l9qf/web-ui:nnyrwytzlrvk-f6900c654b3a"
  port           = 3000
  cpu_limit      = 256
  memory_limit   = 512
  min_scale      = 0
  max_scale      = 1
  privacy        = "public"
  deploy         = true

  environment_variables = {
    API_URL = "https://sideprojectprodaa67l9qf-backend.functions.fnc.fr-par.scw.cloud"
  }
}

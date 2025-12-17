resource "scaleway_container_namespace" "main" {
  name        = "${var.project_name}-${var.environment}"
  description = "Container namespace for ${var.project_name}"
  region      = var.region
}

resource "scaleway_container" "backend" {
  name           = "backend"
  namespace_id   = scaleway_container_namespace.main.id
  registry_image = "docker.io/library/nginx:alpine"
  port           = 80
  cpu_limit      = 256
  memory_limit   = 512
  min_scale      = 0
  max_scale      = 1
  privacy        = "public"
  deploy         = true
}

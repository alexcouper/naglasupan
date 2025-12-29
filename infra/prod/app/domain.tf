resource "scaleway_container_domain" "frontend_apex" {
  container_id = scaleway_container.frontend.id
  hostname     = var.domain
}

resource "scaleway_container_domain" "frontend_app" {
  container_id = scaleway_container.frontend.id
  hostname     = "app.${var.domain}"
}

resource "scaleway_container_domain" "backend" {
  container_id = scaleway_container.backend.id
  hostname     = "api.${var.domain}"
}

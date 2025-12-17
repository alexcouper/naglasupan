output "container_namespace_id" {
  value = scaleway_container_namespace.main.id
}

output "container_url" {
  value = scaleway_container.backend.domain_name
}

output "registry_endpoint" {
  value = scaleway_container_namespace.main.registry_endpoint
}

output "container_namespace_id" {
  value = scaleway_container_namespace.main.id
}

output "backend_url" {
  value = scaleway_container.backend.domain_name
}

output "frontend_url" {
  value = scaleway_container.frontend.domain_name
}

output "registry_endpoint" {
  value = scaleway_container_namespace.main.registry_endpoint
}

output "database_endpoint" {
  value = scaleway_sdb_sql_database.main.endpoint
}

output "database_name" {
  value = scaleway_sdb_sql_database.main.name
}

output "backend_iam_application_id" {
  value = scaleway_iam_application.backend.id
}

output "backend_iam_api_key_access_key" {
  value = scaleway_iam_api_key.backend.access_key
}

output "backend_iam_api_key_secret_key" {
  sensitive = true
  value = scaleway_iam_api_key.backend.secret_key
}
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
  value     = scaleway_iam_api_key.backend.secret_key
}

# Cockpit outputs
output "cockpit_grafana_url" {
  description = "URL to access Cockpit Grafana dashboard for logs and metrics (authenticate with Scaleway IAM)"
  value       = data.scaleway_cockpit_grafana.main.grafana_url
}

output "cockpit_logs_push_url" {
  description = "URL to push logs to Cockpit"
  value       = scaleway_cockpit_source.logs.push_url
}

output "cockpit_metrics_push_url" {
  description = "URL to push metrics to Cockpit"
  value       = scaleway_cockpit_source.metrics.push_url
}

output "cockpit_token_secret_key" {
  description = "Secret key for Cockpit token (for custom metrics/logs)"
  sensitive   = true
  value       = scaleway_cockpit_token.containers.secret_key
}

# Object Storage outputs
output "project_images_bucket_name" {
  description = "Name of the bucket for project images"
  value       = scaleway_object_bucket.project_images.name
}

output "project_images_bucket_endpoint" {
  description = "Endpoint URL for the project images bucket"
  value       = scaleway_object_bucket.project_images.endpoint
}

output "project_images_public_url" {
  description = "Public URL base for accessing project images"
  value       = "https://${scaleway_object_bucket.project_images.name}.s3.${var.region}.scw.cloud"
}
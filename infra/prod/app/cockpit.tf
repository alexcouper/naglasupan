# Cockpit data sources for logs visibility
# Serverless Containers automatically send logs to Cockpit

# Logs data source for containers
resource "scaleway_cockpit_source" "logs" {
  project_id     = data.scaleway_account_project.current.id
  name           = "${var.project_name}-${var.environment}-logs"
  type           = "logs"
  retention_days = 7
}

# Metrics data source for containers
resource "scaleway_cockpit_source" "metrics" {
  project_id     = data.scaleway_account_project.current.id
  name           = "${var.project_name}-${var.environment}-metrics"
  type           = "metrics"
  retention_days = 7
}

# Get Grafana URL for dashboard access
data "scaleway_cockpit_grafana" "main" {
  project_id = data.scaleway_account_project.current.id
}

# Push token for containers to send custom logs/metrics if needed
resource "scaleway_cockpit_token" "containers" {
  project_id = data.scaleway_account_project.current.id
  name       = "${var.project_name}-${var.environment}-containers"

  scopes {
    query_logs    = true
    write_logs    = true
    query_metrics = true
    write_metrics = true
  }
}

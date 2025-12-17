# Get the current project
data "scaleway_account_project" "current" {
  project_id = "baeb2a58-22b2-42c0-b48b-9993c2aea5e1"
}

# IAM Application for the web-backend container
resource "scaleway_iam_application" "backend" {
  name        = "${var.project_name}-${var.environment}-backend"
  description = "IAM application for the backend container"
}

# API Key for the backend application
resource "scaleway_iam_api_key" "backend" {
  application_id = scaleway_iam_application.backend.id
  description    = "API key for backend to access Scaleway services"
}

# IAM Policy granting database access to the backend
resource "scaleway_iam_policy" "backend_database" {
  name           = "${var.project_name}-${var.environment}-backend-db-access"
  description    = "Policy granting backend access to the Serverless SQL Database"
  application_id = scaleway_iam_application.backend.id

  rule {
    project_ids          = [data.scaleway_account_project.current.id]
    permission_set_names = ["ServerlessSQLDatabaseFullAccess"]
  }
}

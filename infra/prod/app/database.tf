resource "scaleway_sdb_sql_database" "main" {
  name    = "${var.project_name}-${var.environment}"
  min_cpu = 0
  max_cpu = 4
  region  = var.region
}

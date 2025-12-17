variable "region" {
  description = "Scaleway region"
  type        = string
  default     = "fr-par"
}

variable "zone" {
  description = "Scaleway zone"
  type        = string
  default     = "fr-par-1"
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "sideproject"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "prod"
}

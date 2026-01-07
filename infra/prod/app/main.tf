terraform {
  required_version = ">= 1.0"

  required_providers {
    scaleway = {
      source  = "scaleway/scaleway"
      version = "~> 2.64"
    }
  }

  # Remote state in Scaleway Object Storage
  backend "s3" {
    bucket                      = "sideproject-tfstate"
    key                         = "infra/prod/app/terraform.tfstate"
    region                      = "fr-par"
    skip_credentials_validation = true
    skip_region_validation      = true
    skip_requesting_account_id  = true
    profile                     = "naglasupan-prod"
    endpoints = {
      s3 = "https://s3.fr-par.scw.cloud"
    }
  }
}

provider "scaleway" {
  region = var.region
  zone   = var.zone
}



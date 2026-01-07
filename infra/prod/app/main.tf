terraform {
  required_version = ">= 1.0"

  required_providers {
    scaleway = {
      source  = "scaleway/scaleway"
      version = "~> 2.64"
    }
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
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

# AWS provider configured for Scaleway S3-compatible object storage
# Used to read versions.json which contains container image tags
provider "aws" {
  alias                       = "scaleway_s3"
  region                      = "fr-par"
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_region_validation      = true
  skip_requesting_account_id  = true
  profile                     = "naglasupan-prod"

  endpoints {
    s3 = "https://s3.fr-par.scw.cloud"
  }
}

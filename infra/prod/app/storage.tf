# Object Storage bucket for user-uploaded project images
resource "scaleway_object_bucket" "project_images" {
  name   = "${var.project_name}-${var.environment}-project-images"
  region = var.region

  # Versioning disabled for cost savings (images can be re-uploaded)
  versioning {
    enabled = false
  }

  # Lifecycle rules to clean up incomplete multipart uploads
  lifecycle_rule {
    id      = "cleanup-incomplete-uploads"
    enabled = true

    abort_incomplete_multipart_upload_days = 1
  }

  # CORS configuration for browser-based uploads
  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "HEAD"]
    allowed_origins = [
      "https://naglasupan.is",
      "https://www.naglasupan.is",
      "http://localhost:3000",
    ]
    expose_headers  = ["ETag"]
    max_age_seconds = 3600
  }
}

# Bucket ACL - public-read allows public access to objects for viewing
# Writes still require presigned URLs with credentials
resource "scaleway_object_bucket_acl" "project_images" {
  bucket = scaleway_object_bucket.project_images.name
  acl    = "public-read"
}

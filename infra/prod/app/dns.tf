# Scaleway DNS for naglasupan.is
#
# SETUP STEPS (one-time, manual):
# 1. Go to Scaleway Console > Domains and DNS > External domains
# 2. Click "+ Manage new domain" and enter "naglasupan.is"
# 3. Add a TXT record at ISNIC:
#    Name: _scaleway-challenge
#    Value: (copy from Scaleway console)
# 4. Once verified, update nameservers at ISNIC to Scaleway's NS
# 5. Then run terraform apply to create the records below

# ALIAS record for apex domain -> frontend container
resource "scaleway_domain_record" "apex" {
  dns_zone = var.domain
  name     = ""
  type     = "ALIAS"
  data     = "${scaleway_container.frontend.domain_name}."
  ttl      = 300
}

# CNAME for app subdomain -> frontend container
resource "scaleway_domain_record" "app" {
  dns_zone = var.domain
  name     = "app"
  type     = "CNAME"
  data     = "${scaleway_container.frontend.domain_name}."
  ttl      = 300
}

# CNAME for api subdomain -> backend container
resource "scaleway_domain_record" "api" {
  dns_zone = var.domain
  name     = "api"
  type     = "CNAME"
  data     = "${scaleway_container.backend.domain_name}."
  ttl      = 300
}

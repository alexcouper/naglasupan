"""Gunicorn configuration for production."""

# Server socket
bind = "0.0.0.0:8000"

# Logging
accesslog = "-"
errorlog = "-"

# Custom access log format using X-Forwarded-For header for real client IP
# %({x-forwarded-for}i)s extracts the X-Forwarded-For header value
access_log_format = (
    '%({x-forwarded-for}i)s - - [%(t)s] "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s"'
)

# Trust X-Forwarded-* headers from all IPs (required when behind load balancer/proxy)
# Cloud Run always sits behind a proxy, so we trust all forwarded IPs
forwarded_allow_ips = "*"

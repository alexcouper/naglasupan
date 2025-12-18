#!/bin/sh
set -e

# Replace the placeholder with the actual API URL
if [ -n "$API_URL" ]; then
  find /app/.next -type f -name "*.js" -exec sed -i "s|__NEXT_PUBLIC_API_URL_PLACEHOLDER__|$API_URL|g" {} +
fi

# Start the server
exec node server.js

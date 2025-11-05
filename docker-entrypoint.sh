#!/bin/sh

# Create env-config.js with runtime environment variables
cat <<EOF > /usr/share/nginx/html/env-config.js
window.__ENV__ = {
  VITE_SUPABASE_URL: "${VITE_SUPABASE_URL}",
  VITE_SUPABASE_PUBLISHABLE_KEY: "${VITE_SUPABASE_PUBLISHABLE_KEY}",
  VITE_SUPABASE_PROJECT_ID: "${VITE_SUPABASE_PROJECT_ID}"
};
EOF

echo "Environment variables injected successfully"
echo "VITE_SUPABASE_URL: ${VITE_SUPABASE_URL}"
echo "VITE_SUPABASE_PROJECT_ID: ${VITE_SUPABASE_PROJECT_ID}"

# Execute the main container command
exec "$@"

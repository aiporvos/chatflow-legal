#!/bin/sh

# Validate required environment variables
MISSING_VARS=""

if [ -z "$VITE_SUPABASE_URL" ]; then
  MISSING_VARS="${MISSING_VARS}VITE_SUPABASE_URL "
fi

if [ -z "$VITE_SUPABASE_PUBLISHABLE_KEY" ]; then
  MISSING_VARS="${MISSING_VARS}VITE_SUPABASE_PUBLISHABLE_KEY "
fi

if [ -z "$VITE_SUPABASE_PROJECT_ID" ]; then
  MISSING_VARS="${MISSING_VARS}VITE_SUPABASE_PROJECT_ID "
fi

if [ -n "$MISSING_VARS" ]; then
  echo "⚠️  WARNING: Missing environment variables: $MISSING_VARS"
  echo "   The application may not work correctly."
  echo "   Please configure these variables in Dokploy or your .env file."
fi

# Create env-config.js with runtime environment variables
cat <<EOF > /usr/share/nginx/html/env-config.js
window.__ENV__ = {
  VITE_SUPABASE_URL: "${VITE_SUPABASE_URL:-}",
  VITE_SUPABASE_PUBLISHABLE_KEY: "${VITE_SUPABASE_PUBLISHABLE_KEY:-}",
  VITE_SUPABASE_PROJECT_ID: "${VITE_SUPABASE_PROJECT_ID:-}"
};
EOF

echo "✅ Environment variables injected successfully"
if [ -n "$VITE_SUPABASE_URL" ]; then
  echo "   VITE_SUPABASE_URL: ${VITE_SUPABASE_URL}"
fi
if [ -n "$VITE_SUPABASE_PROJECT_ID" ]; then
  echo "   VITE_SUPABASE_PROJECT_ID: ${VITE_SUPABASE_PROJECT_ID}"
fi

# Execute the main container command
exec "$@"

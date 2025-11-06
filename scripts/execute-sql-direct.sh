#!/bin/bash

# Script para ejecutar SQL directamente usando Supabase CLI

set -e

PROJECT_ID="bkpgkenxyretsrxxrxfb"
SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrcGdrZW54eXJldHNyeHhyeGZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjI4NDI1MCwiZXhwIjoyMDc3ODYwMjUwfQ.baaSgzhLryrAJLULhkTnzx7J0Q9W8Zov187BUP1CowA"
SQL_FILE="scripts/migrate-database.sql"

echo "🚀 Ejecutando SQL directamente en Supabase"
echo "============================================"
echo ""

# Verificar que el archivo SQL existe
if [ ! -f "$SQL_FILE" ]; then
    echo "❌ No se encontró el archivo SQL: $SQL_FILE"
    exit 1
fi

echo "✅ Archivo SQL encontrado: $SQL_FILE"
echo ""

# Intentar usar Supabase CLI
echo "📝 Intentando ejecutar SQL usando Supabase CLI..."
echo ""

# Usar npx para ejecutar supabase sin instalación global
npx --yes supabase@latest db execute \
  --file "$SQL_FILE" \
  --project-ref "$PROJECT_ID" \
  --db-url "postgresql://postgres.${PROJECT_ID}:${SERVICE_ROLE_KEY}@aws-0-us-east-1.pooler.supabase.com:6543/postgres" \
  2>&1 || {
    echo ""
    echo "⚠️  No se pudo ejecutar directamente con Supabase CLI"
    echo ""
    echo "📋 Alternativa: Ejecutar manualmente desde SQL Editor"
    echo "   1. Abre: https://supabase.com/dashboard/project/$PROJECT_ID/sql/new"
    echo "   2. Copia el contenido de: $SQL_FILE"
    echo "   3. Pega y ejecuta"
    exit 1
}

echo ""
echo "✅ SQL ejecutado exitosamente!"


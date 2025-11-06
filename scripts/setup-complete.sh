#!/bin/bash

# Script completo para configurar Supabase
# Usa el SQL Editor de Supabase Dashboard

set -e

PROJECT_ID="bkpgkenxyretsrxxrxfb"
PROJECT_URL="https://bkpgkenxyretsrxxrxfb.supabase.co"
SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrcGdrZW54eXJldHNyeHhyeGZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjI4NDI1MCwiZXhwIjoyMDc3ODYwMjUwfQ.baaSgzhLryrAJLULhkTnzx7J0Q9W8Zov187BUP1CowA"

echo "🚀 Configuración de Supabase - Sistema Legal"
echo "=============================================="
echo ""
echo "📋 Credenciales configuradas:"
echo "   Project ID: $PROJECT_ID"
echo "   Project URL: $PROJECT_URL"
echo ""

# Verificar conexión
echo "🔗 Verificando conexión a Supabase..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "apikey: $SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SERVICE_ROLE_KEY" \
  "$PROJECT_URL/rest/v1/" 2>/dev/null || echo "000")

if [ "$RESPONSE" = "200" ] || [ "$RESPONSE" = "404" ]; then
    echo "✅ Conexión a Supabase exitosa"
else
    echo "⚠️  No se pudo verificar la conexión (esto es normal)"
fi

echo ""
echo "📝 PASO 1: Ejecutar Migraciones SQL"
echo "===================================="
echo ""
echo "Para crear todas las tablas, funciones y políticas:"
echo ""
echo "1. Abre el SQL Editor de Supabase:"
echo "   https://supabase.com/dashboard/project/$PROJECT_ID/sql/new"
echo ""
echo "2. Copia y pega el contenido completo del archivo:"
echo "   scripts/migrate-database.sql"
echo ""
echo "3. Haz click en 'Run' para ejecutar el script"
echo ""
echo "4. Verifica que todas las tablas se hayan creado correctamente"
echo ""

# Mostrar resumen del SQL
if [ -f "scripts/migrate-database.sql" ]; then
    SQL_SIZE=$(wc -l < scripts/migrate-database.sql)
    echo "   ✅ Archivo SQL encontrado ($SQL_SIZE líneas)"
    echo ""
fi

echo "📦 PASO 2: Desplegar Edge Functions"
echo "===================================="
echo ""
echo "Para desplegar las Edge Functions necesitas Supabase CLI:"
echo ""
echo "1. Instalar Supabase CLI:"
echo "   npm install -g supabase"
echo ""
echo "2. Iniciar sesión:"
echo "   supabase login"
echo ""
echo "3. Conectar a tu proyecto:"
echo "   supabase link --project-ref $PROJECT_ID"
echo ""
echo "4. Desplegar funciones:"
echo "   supabase functions deploy query-rag"
echo "   supabase functions deploy upload-to-drive"
echo "   supabase functions deploy n8n-cases-webhook"
echo "   supabase functions deploy n8n-documents-webhook"
echo "   supabase functions deploy n8n-whatsapp-webhook"
echo ""

echo "✅ Instrucciones completadas"
echo ""
echo "📚 Documentación:"
echo "   - SETUP_SUPABASE.md - Guía completa"
echo "   - docs/DATABASE_MIGRATION.md - Scripts SQL detallados"
echo "   - docs/EDGE_FUNCTIONS.md - Código de Edge Functions"
echo ""


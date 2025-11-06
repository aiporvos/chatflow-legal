#!/bin/bash

# Script para desplegar todas las Edge Functions

set -e

echo "🚀 Despliegue de Edge Functions - Sistema Legal"
echo "================================================"
echo ""

# Verificar que Supabase CLI esté instalado
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI no está instalado."
    echo "   Instálalo con: npm install -g supabase"
    exit 1
fi

echo "✅ Supabase CLI encontrado"
echo ""

# Verificar que esté linkeado
if [ ! -f ".supabase/config.toml" ]; then
    echo "❌ No estás conectado a un proyecto Supabase."
    echo "   Ejecuta primero: supabase link --project-ref TU_PROJECT_ID"
    exit 1
fi

echo "✅ Proyecto Supabase conectado"
echo ""

# Desplegar funciones
echo "📦 Desplegando Edge Functions..."
echo ""

FUNCTIONS=(
    "query-rag"
    "upload-to-drive"
    "n8n-cases-webhook"
    "n8n-documents-webhook"
    "n8n-whatsapp-webhook"
)

for func in "${FUNCTIONS[@]}"; do
    echo "  📤 Desplegando $func..."
    supabase functions deploy "$func" || {
        echo "  ❌ Error al desplegar $func"
        exit 1
    }
    echo "  ✅ $func desplegado correctamente"
    echo ""
done

echo "🎉 Todas las Edge Functions desplegadas correctamente!"
echo ""
echo "📋 URLs de las funciones:"
PROJECT_ID=$(grep -oP 'project_id = "\K[^"]+' .supabase/config.toml || echo "TU_PROJECT_ID")
echo "   - query-rag: https://$PROJECT_ID.supabase.co/functions/v1/query-rag"
echo "   - upload-to-drive: https://$PROJECT_ID.supabase.co/functions/v1/upload-to-drive"
echo "   - n8n-cases-webhook: https://$PROJECT_ID.supabase.co/functions/v1/n8n-cases-webhook"
echo "   - n8n-documents-webhook: https://$PROJECT_ID.supabase.co/functions/v1/n8n-documents-webhook"
echo "   - n8n-whatsapp-webhook: https://$PROJECT_ID.supabase.co/functions/v1/n8n-whatsapp-webhook"
echo ""


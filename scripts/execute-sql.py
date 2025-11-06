#!/usr/bin/env python3
"""
Script para ejecutar SQL en Supabase usando psycopg2
Requiere: pip install psycopg2-binary
"""

import sys
import os
import urllib.parse

# Credenciales de Supabase
PROJECT_ID = 'bkpgkenxyretsrxxrxfb'
PROJECT_URL = 'https://bkpgkenxyretsrxxrxfb.supabase.co'
SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrcGdrZW54eXJldHNyeHhyeGZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjI4NDI1MCwiZXhwIjoyMDc3ODYwMjUwfQ.baaSgzhLryrAJLULhkTnzx7J0Q9W8Zov187BUP1CowA'

def main():
    print('🚀 Ejecutando Migraciones SQL en Supabase')
    print('=' * 50)
    print()
    
    # Leer archivo SQL
    sql_file = os.path.join(os.path.dirname(__file__), 'migrate-database.sql')
    if not os.path.exists(sql_file):
        print(f'❌ No se encontró el archivo SQL: {sql_file}')
        sys.exit(1)
    
    with open(sql_file, 'r', encoding='utf-8') as f:
        sql = f.read()
    
    print(f'✅ Archivo SQL leído correctamente')
    print(f'   Líneas: {len(sql.splitlines())}')
    print(f'   Caracteres: {len(sql)}')
    print()
    
    # Intentar usar psycopg2
    try:
        import psycopg2
        from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
        
        print('📝 Intentando conectar a Supabase usando psycopg2...')
        
        # Construir connection string
        # Necesitamos la contraseña de la base de datos
        # Por ahora, mostrar instrucciones
        print('⚠️  Para usar psycopg2 necesitas la contraseña de la base de datos')
        print('   Puedes encontrarla en: Settings → Database → Connection string')
        print()
        
    except ImportError:
        print('⚠️  psycopg2 no está instalado')
        print('   Instálalo con: pip install psycopg2-binary')
        print()
    
    # Mostrar instrucciones
    print('📋 INSTRUCCIONES PARA EJECUTAR:')
    print('=' * 50)
    print()
    print('OPCIÓN 1: SQL Editor (Más fácil)')
    print('-' * 50)
    print(f'1. Abre: https://supabase.com/dashboard/project/{PROJECT_ID}/sql/new')
    print(f'2. Copia el contenido de: {sql_file}')
    print('3. Pega y ejecuta el SQL completo')
    print()
    print('OPCIÓN 2: Usar psql')
    print('-' * 50)
    print('1. Obtén la connection string de: Settings → Database')
    print('2. Ejecuta:')
    print(f'   psql "CONNECTION_STRING" -f {sql_file}')
    print()
    print('OPCIÓN 3: Usar Supabase CLI')
    print('-' * 50)
    print('1. npm install -g supabase')
    print('2. supabase login')
    print(f'3. supabase link --project-ref {PROJECT_ID}')
    print(f'4. supabase db push --file {sql_file}')
    print()
    
    # Mostrar SQL para copiar
    print('📄 Contenido del SQL (primeras 20 líneas):')
    print('-' * 50)
    lines = sql.split('\n')[:20]
    for i, line in enumerate(lines, 1):
        print(f'{i:3}: {line}')
    print('   ...')
    print(f'   (Total: {len(sql.splitlines())} líneas)')
    print()

if __name__ == '__main__':
    main()


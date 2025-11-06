#!/usr/bin/env python3
"""
Script para ejecutar SQL directamente en Supabase PostgreSQL
Requiere: pip install psycopg2-binary
"""

import sys
import os

PROJECT_ID = 'bkpgkenxyretsrxxrxfb'

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
    
    print(f'✅ Archivo SQL leído: {len(sql.splitlines())} líneas')
    print()
    
    # Intentar usar psycopg2
    try:
        import psycopg2
        from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
        
        print('📝 Para ejecutar SQL necesitas la contraseña de la base de datos')
        print('   Obtén la connection string de:')
        print(f'   https://supabase.com/dashboard/project/{PROJECT_ID}/settings/database')
        print()
        print('   Formato: postgresql://postgres:[PASSWORD]@db.bkpgkenxyretsrxxrxfb.supabase.co:5432/postgres')
        print()
        
        # Solicitar connection string
        conn_string = input('Ingresa la connection string (o presiona Enter para usar SQL Editor): ').strip()
        
        if not conn_string:
            print()
            print('📋 Usando SQL Editor en su lugar...')
            print(f'   1. Abre: https://supabase.com/dashboard/project/{PROJECT_ID}/sql/new')
            print(f'   2. Copia el contenido de: {sql_file}')
            print('   3. Pega y ejecuta')
            return
        
        print()
        print('🔗 Conectando a Supabase...')
        
        # Conectar y ejecutar
        conn = psycopg2.connect(conn_string)
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        print('✅ Conectado exitosamente')
        print('📝 Ejecutando SQL...')
        print()
        
        # Ejecutar SQL (dividir por ; para ejecutar comandos individuales)
        commands = [cmd.strip() for cmd in sql.split(';') if cmd.strip() and not cmd.strip().startswith('--')]
        
        for i, command in enumerate(commands, 1):
            if command:
                try:
                    cursor.execute(command)
                    print(f'   ✅ Comando {i}/{len(commands)} ejecutado')
                except Exception as e:
                    print(f'   ⚠️  Comando {i} - {str(e)[:100]}')
        
        cursor.close()
        conn.close()
        
        print()
        print('🎉 Migraciones SQL ejecutadas correctamente!')
        print()
        print('✅ Verifica en Supabase Dashboard:')
        print('   - Table Editor → Deberías ver 8 tablas')
        print('   - SQL Editor → Puedes ejecutar queries de verificación')
        
    except ImportError:
        print('❌ psycopg2 no está instalado')
        print('   Instálalo con: pip3 install --user psycopg2-binary')
        print()
        print('📋 Alternativa: Usar SQL Editor')
        print(f'   1. Abre: https://supabase.com/dashboard/project/{PROJECT_ID}/sql/new')
        print(f'   2. Copia el contenido de: {sql_file}')
        print('   3. Pega y ejecuta')
        
    except Exception as e:
        print(f'❌ Error: {e}')
        print()
        print('📋 Usa el SQL Editor en su lugar:')
        print(f'   1. Abre: https://supabase.com/dashboard/project/{PROJECT_ID}/sql/new')
        print(f'   2. Copia el contenido de: {sql_file}')
        print('   3. Pega y ejecuta')

if __name__ == '__main__':
    main()


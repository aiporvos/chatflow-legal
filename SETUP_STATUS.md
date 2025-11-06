# Estado de Configuración de Supabase

## ✅ Tablas Detectadas

La API REST de Supabase muestra que las siguientes tablas ya existen:

- ✅ `contacts`
- ✅ `n8n_webhooks`
- ✅ `profiles`
- ✅ `cases`
- ✅ `user_roles`
- ✅ `documents`
- ✅ `whatsapp_messages`
- ✅ `calendar_events`

## 📋 Verificación Necesaria

Aunque las tablas existen, necesitas verificar:

1. **Tipos ENUM**: ¿Están creados `app_role`, `case_status`, `message_status`?
2. **Funciones**: ¿Están creadas `update_updated_at_column`, `has_role`, `handle_new_user`?
3. **Políticas RLS**: ¿Están configuradas todas las políticas de seguridad?
4. **Triggers**: ¿Están configurados todos los triggers?

## 🔧 Para Ejecutar el SQL Completo

Si necesitas ejecutar el SQL completo para asegurar que todo esté configurado:

1. **Abre el SQL Editor de Supabase:**
   ```
   https://supabase.com/dashboard/project/bkpgkenxyretsrxxrxfb/sql/new
   ```

2. **Copia el contenido del archivo:**
   ```
   scripts/migrate-database.sql
   ```

3. **Pega y ejecuta el SQL completo**

El script usa `CREATE IF NOT EXISTS` y `CREATE OR REPLACE`, por lo que es seguro ejecutarlo incluso si las tablas ya existen.

## 📦 Edge Functions

Para desplegar las Edge Functions:

```bash
# 1. Instalar Supabase CLI
npm install -g supabase

# 2. Iniciar sesión
supabase login

# 3. Conectar a tu proyecto
supabase link --project-ref bkpgkenxyretsrxxrxfb

# 4. Desplegar funciones
cd chatflow-legal
supabase functions deploy query-rag
supabase functions deploy upload-to-drive
supabase functions deploy n8n-cases-webhook
supabase functions deploy n8n-documents-webhook
supabase functions deploy n8n-whatsapp-webhook
```

## ✅ Verificación Final

Después de ejecutar el SQL, verifica:

```sql
-- Verificar tablas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Verificar políticas RLS
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Verificar triggers
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;
```


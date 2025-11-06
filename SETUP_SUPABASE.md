# Guía de Configuración de Supabase

Esta guía te ayudará a configurar completamente tu base de datos Supabase y desplegar las Edge Functions.

## 📋 Datos Necesarios

Para configurar Supabase necesitas:

1. **Project ID**: El ID de tu proyecto Supabase (lo encuentras en Settings → General → Reference ID)
2. **Project URL**: La URL de tu proyecto (ej: `https://xxxxx.supabase.co`)
3. **Service Role Key**: La clave de servicio (Settings → API → service_role key) ⚠️ **Mantén esto secreto**

## 🚀 Opción 1: Script Automatizado (Recomendado)

### Paso 1: Instalar Supabase CLI

```bash
npm install -g supabase
```

### Paso 2: Iniciar sesión

```bash
supabase login
```

### Paso 3: Ejecutar script de configuración

```bash
cd chatflow-legal
./scripts/setup-supabase.sh
```

El script te pedirá:
- Project ID
- Project URL
- Service Role Key

### Paso 4: Desplegar Edge Functions

```bash
./scripts/deploy-functions.sh
```

## 🛠️ Opción 2: Configuración Manual

### Paso 1: Crear Base de Datos

1. Ve a tu proyecto en Supabase Dashboard
2. Ve a **SQL Editor**
3. Copia y pega el contenido completo de `docs/DATABASE_MIGRATION.md`
4. Ejecuta el script completo

### Paso 2: Desplegar Edge Functions

```bash
# 1. Instalar Supabase CLI
npm install -g supabase

# 2. Iniciar sesión
supabase login

# 3. Conectar a tu proyecto
supabase link --project-ref TU_PROJECT_ID

# 4. Desplegar funciones
supabase functions deploy query-rag
supabase functions deploy upload-to-drive
supabase functions deploy n8n-cases-webhook
supabase functions deploy n8n-documents-webhook
supabase functions deploy n8n-whatsapp-webhook
```

## ✅ Verificación

### Verificar Tablas

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Deberías ver:
- profiles
- user_roles
- cases
- contacts
- documents
- calendar_events
- n8n_webhooks
- whatsapp_messages

### Verificar Políticas RLS

```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### Verificar Triggers

```sql
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;
```

### Verificar Edge Functions

Ve a **Edge Functions** en el Dashboard de Supabase y verifica que todas las funciones estén desplegadas.

## 🔐 Crear Usuario Administrador

1. Crea un usuario en **Authentication → Users** (o regístrate desde la app)
2. Obtén el UUID del usuario
3. Ejecuta en SQL Editor:

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('UUID_DEL_USUARIO', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

## 📝 Configurar Webhooks N8N (Opcional)

Una vez que tengas tus webhooks de N8N configurados, puedes agregarlos:

```sql
INSERT INTO public.n8n_webhooks (name, description, webhook_url, is_active)
VALUES 
  ('n8n_rag_query_webhook', 'Webhook para consultas RAG', 'https://tu-n8n.com/webhook/rag-query', true),
  ('upload_to_drive', 'Webhook para subir archivos a Google Drive', 'https://tu-n8n.com/webhook/upload-drive', true),
  ('whatsapp_messages', 'Webhook para recibir mensajes de WhatsApp', 'https://tu-n8n.com/webhook/whatsapp', true)
ON CONFLICT DO NOTHING;
```

O configúralos desde el panel de administración de la aplicación.

## 🆘 Troubleshooting

### Error: "relation already exists"
- Las tablas ya existen. El script usa `CREATE TABLE IF NOT EXISTS` para evitar este error.

### Error: "permission denied"
- Verifica que estés usando el Service Role Key, no el anon key.

### Error: "function already exists"
- Las funciones ya existen. El script usa `CREATE OR REPLACE FUNCTION` para actualizarlas.

### Error al desplegar Edge Functions
- Verifica que estés autenticado: `supabase login`
- Verifica que estés conectado: `supabase link --project-ref TU_PROJECT_ID`
- Revisa los logs: `supabase functions logs NOMBRE_FUNCION`

## 📚 Documentación Adicional

- [DATABASE_MIGRATION.md](./docs/DATABASE_MIGRATION.md) - Scripts SQL completos
- [EDGE_FUNCTIONS.md](./docs/EDGE_FUNCTIONS.md) - Código de Edge Functions
- [DOCKER_DEPLOYMENT.md](./docs/DOCKER_DEPLOYMENT.md) - Guía de deployment


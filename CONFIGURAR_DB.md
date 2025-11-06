# Configurar Base de Datos Supabase

## 🎯 Estado Actual

- ✅ SQL de migración creado: `scripts/migrate-database.sql`
- ✅ Script de datos de prueba: `scripts/generate-test-data.js`
- ⚠️  **Pendiente:** Ejecutar el SQL en Supabase Dashboard

## 📋 Pasos para Configurar la Base de Datos

### Paso 1: Ejecutar SQL de Migración

1. **Abre Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/bkpgkenxyretsrxxrxfb/sql/new
   ```

2. **Copia el contenido del archivo SQL:**
   ```bash
   cat scripts/migrate-database.sql
   ```
   O abre el archivo: `chatflow-legal/scripts/migrate-database.sql`

3. **Pega y ejecuta el SQL completo en Supabase SQL Editor**

4. **Verifica que se ejecutó correctamente:**
   - Deberías ver mensajes de éxito
   - No debería haber errores

### Paso 2: Verificar Tablas Creadas

En Supabase Dashboard → Table Editor, deberías ver:

- ✅ `profiles`
- ✅ `user_roles`
- ✅ `cases`
- ✅ `contacts`
- ✅ `documents`
- ✅ `calendar_events`
- ✅ `n8n_webhooks`
- ✅ `whatsapp_messages`

### Paso 3: Generar Datos de Prueba

Después de ejecutar el SQL, genera los datos de prueba:

```bash
cd chatflow-legal
node scripts/generate-test-data.js
```

Esto creará:
- ✅ 5 usuarios de prueba
- ✅ 5 casos legales
- ✅ 5 contactos
- ✅ 5 documentos
- ✅ 3 eventos del calendario
- ✅ 3 webhooks N8N
- ✅ 3 mensajes de WhatsApp

## ✅ Verificación Final

### 1. Verificar Tablas

En Supabase Dashboard → Table Editor, verifica que todas las tablas existan.

### 2. Verificar Políticas RLS

En Supabase Dashboard → Authentication → Policies, verifica que las políticas RLS estén creadas.

### 3. Verificar Funciones

En Supabase Dashboard → Database → Functions, verifica que las funciones estén creadas:
- `update_updated_at_column()`
- `has_role()`
- `handle_new_user()`

### 4. Verificar Triggers

En Supabase Dashboard → Database → Triggers, verifica que los triggers estén creados:
- `on_auth_user_created`
- `update_profiles_updated_at`
- `update_cases_updated_at`
- `update_contacts_updated_at`
- `update_calendar_events_updated_at`
- `update_n8n_webhooks_updated_at`
- `update_whatsapp_messages_updated_at`

## 🔧 Troubleshooting

### Error: "relation already exists"

**Causa:** Las tablas ya existen.

**Solución:** El SQL usa `CREATE IF NOT EXISTS`, así que es seguro ejecutarlo nuevamente.

### Error: "permission denied"

**Causa:** No tienes permisos para crear tablas.

**Solución:** Asegúrate de estar usando el SQL Editor con permisos de administrador.

### Error: "function already exists"

**Causa:** Las funciones ya existen.

**Solución:** El SQL usa `CREATE OR REPLACE`, así que es seguro ejecutarlo nuevamente.

## 📝 Resumen de lo que Crea el SQL

### Tipos ENUM (3)
- `app_role` - Roles de usuario (admin, lawyer, client)
- `case_status` - Estados de casos (new, in_progress, on_hold, resolved, closed)
- `message_status` - Estados de mensajes (sent, delivered, read, failed)

### Funciones (3)
- `update_updated_at_column()` - Actualiza `updated_at` automáticamente
- `has_role()` - Verifica si un usuario tiene un rol específico
- `handle_new_user()` - Crea perfil y asigna rol al registrar usuario

### Tablas (8)
- `profiles` - Perfiles de usuarios
- `user_roles` - Roles de usuarios
- `cases` - Expedientes legales
- `contacts` - Contactos
- `documents` - Documentos
- `calendar_events` - Eventos del calendario
- `n8n_webhooks` - Configuración de webhooks N8N
- `whatsapp_messages` - Mensajes de WhatsApp

### Políticas RLS (18)
- Políticas de seguridad para todas las tablas
- Permisos por rol (admin, lawyer, client)
- Acceso controlado a datos

### Triggers (7)
- `on_auth_user_created` - Crea perfil al registrar usuario
- 6 triggers para actualizar `updated_at` automáticamente

## 🚀 Próximos Pasos

Después de configurar la base de datos:

1. ✅ Genera datos de prueba: `node scripts/generate-test-data.js`
2. ✅ Prueba el login con usuarios de prueba
3. ✅ Verifica que todas las pantallas muestren datos
4. ✅ Configura Google OAuth (opcional)
5. ✅ Despliega Edge Functions (opcional)

## 📚 Documentación Relacionada

- `DATOS_PRUEBA.md` - Detalles de los datos de prueba
- `SETUP_SUPABASE.md` - Guía completa de configuración
- `CONFIGURAR_GOOGLE_OAUTH.md` - Configurar autenticación con Google


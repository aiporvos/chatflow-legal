# Guía Completa de Deployment - Sistema Legal

Esta guía te llevará paso a paso desde cero hasta tener tu sistema completamente funcional en Supabase.

## Índice

1. [Prerequisitos](#prerequisitos)
2. [Crear Proyecto Supabase](#crear-proyecto-supabase)
3. [Configurar Base de Datos](#configurar-base-de-datos)
4. [Deploy Edge Functions](#deploy-edge-functions)
5. [Configurar Frontend](#configurar-frontend)
6. [Configurar N8N](#configurar-n8n)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

---

## 1. Prerequisitos

### Instalar herramientas necesarias

```bash
# Node.js (v18 o superior)
node --version

# npm o bun
npm --version

# Supabase CLI
npm install -g supabase

# Git
git --version
```

### Cuentas necesarias

- [ ] Cuenta en Supabase (https://supabase.com)
- [ ] Cuenta en N8N (https://n8n.io) o N8N self-hosted
- [ ] Cuenta en Google Cloud (para Google Drive, opcional)

---

## 2. Crear Proyecto Supabase

### 2.1 Crear nuevo proyecto

1. Ir a https://supabase.com/dashboard
2. Click en "New Project"
3. Llenar los datos:
   - **Name**: Sistema Legal
   - **Database Password**: Guarda esta contraseña de forma segura
   - **Region**: Selecciona la más cercana a tus usuarios
   - **Pricing Plan**: Free o Pro según necesites

4. Esperar 2-3 minutos mientras se crea el proyecto

### 2.2 Obtener credenciales

Una vez creado el proyecto, obtén:

1. **Project URL**: Settings → API → Project URL
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```

2. **Anon Key**: Settings → API → Project API keys → anon public
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Service Role Key**: Settings → API → Project API keys → service_role (secret)
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. **Project ID**: Settings → General → Reference ID
   ```
   xxxxxxxxxxxxx
   ```

### 2.3 Configurar Auth

1. Ir a Authentication → Providers
2. Habilitar "Email" provider
3. En Settings:
   - Enable email confirmations: **OFF** (para desarrollo)
   - Enable email OTP: OFF
   - Minimum password length: 6 (o el que prefieras)

---

## 3. Configurar Base de Datos

### 3.1 Link proyecto local

```bash
# En la raíz de tu proyecto
supabase login
supabase link --project-ref xxxxxxxxxxxxx
```

### 3.2 Ejecutar migraciones SQL

Puedes hacerlo de dos formas:

#### Opción A: Desde Supabase Dashboard

1. Ir a SQL Editor en el dashboard
2. Copiar y pegar el contenido de `docs/DATABASE_MIGRATION.md` sección por sección
3. Ejecutar cada bloque de SQL en orden:
   - Enums
   - Funciones
   - Tablas
   - Políticas RLS
   - Triggers

#### Opción B: Usando archivo de migración

```bash
# Crear archivo de migración
supabase migration new initial_schema

# Copiar el SQL de DATABASE_MIGRATION.md al archivo creado
# Aplicar migración
supabase db push
```

### 3.3 Crear usuario administrador

1. Primero crea un usuario desde el dashboard:
   - Authentication → Users → Add user
   - Email: tu-email@ejemplo.com
   - Password: tu-password-seguro
   - Auto Confirm User: YES

2. Copia el User ID (UUID)

3. Ejecutar en SQL Editor:

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('UUID_DEL_USUARIO', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

---

## 4. Deploy Edge Functions

### 4.1 No se requieren secrets

Las edge functions solo usan las variables automáticas de Supabase (SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY) que ya están configuradas.

### 4.2 Deploy funciones

```bash
# Desde la raíz del proyecto
supabase functions deploy query-rag
supabase functions deploy upload-to-drive
supabase functions deploy n8n-cases-webhook
supabase functions deploy n8n-documents-webhook
supabase functions deploy n8n-whatsapp-webhook
```

### 4.3 Verificar deployment

```bash
# Ver logs
supabase functions logs query-rag --tail

# Listar funciones desplegadas
supabase functions list
```

Las URLs de tus funciones serán:
```
https://xxxxxxxxxxxxx.supabase.co/functions/v1/query-rag
https://xxxxxxxxxxxxx.supabase.co/functions/v1/upload-to-drive
https://xxxxxxxxxxxxx.supabase.co/functions/v1/n8n-cases-webhook
https://xxxxxxxxxxxxx.supabase.co/functions/v1/n8n-documents-webhook
https://xxxxxxxxxxxxx.supabase.co/functions/v1/n8n-whatsapp-webhook
```

---

## 5. Configurar Frontend

### 5.1 Variables de entorno

Crear archivo `.env` en la raíz del proyecto:

```bash
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_PROJECT_ID=xxxxxxxxxxxxx
```

### 5.2 Instalar dependencias

```bash
npm install
# o
bun install
```

### 5.3 Generar tipos TypeScript

```bash
# Genera los tipos desde tu base de datos
supabase gen types typescript --local > src/integrations/supabase/types.ts
```

### 5.4 Iniciar desarrollo

```bash
npm run dev
# o
bun dev
```

La aplicación estará en: http://localhost:5173

---

## 6. Configurar N8N

### 6.1 Crear workflows en N8N

Necesitas crear 4 workflows principales:

#### Workflow 1: RAG Query

1. Crear nuevo workflow
2. Agregar nodo "Webhook" como trigger
3. Path: `/rag-query`
4. Method: POST
5. Agregar lógica de procesamiento RAG (OpenAI, Pinecone, etc.)
6. Activar workflow
7. Copiar la URL del webhook

#### Workflow 2: Upload to Drive

1. Crear nuevo workflow
2. Agregar nodo "Webhook" como trigger
3. Path: `/upload-drive`
4. Agregar nodo "Google Drive" para subir archivo
5. Retornar `{ "drive_url": "URL_DEL_ARCHIVO" }`
6. Activar workflow
7. Copiar la URL del webhook

#### Workflow 3: Cases Sync

1. Crear workflow para sincronizar casos
2. Puede ser triggered por cron o eventos externos
3. Llamar a: `https://xxxxxxxxxxxxx.supabase.co/functions/v1/n8n-cases-webhook`

#### Workflow 4: WhatsApp Integration

1. Crear workflow con trigger de WhatsApp (usando API oficial o Evolution API)
2. Llamar a: `https://xxxxxxxxxxxxx.supabase.co/functions/v1/n8n-whatsapp-webhook`
3. Enviar payload:
```json
{
  "message_id": "unique_id",
  "chat_id": "chat_id",
  "from_number": "5491234567890",
  "to_number": "5499876543210",
  "message_content": "Texto del mensaje",
  "message_type": "text"
}
```

### 6.2 Registrar webhooks en la aplicación

1. Iniciar sesión como administrador
2. Ir a Settings o Admin panel
3. Configurar los webhooks de N8N:

```
N8N RAG Query Webhook: https://tu-n8n.app.n8n.cloud/webhook/rag-query
Upload to Drive: https://tu-n8n.app.n8n.cloud/webhook/upload-drive
WhatsApp Webhook: (no necesita registro, N8N llama directamente a Supabase)
```

---

## 7. Testing

### 7.1 Test de autenticación

```bash
# Ir a la app
http://localhost:5173

# Registrar nuevo usuario
# Login con usuario admin creado anteriormente
```

### 7.2 Test de casos

1. Login como admin
2. Ir a Casos
3. Crear nuevo caso
4. Verificar que aparece en la lista

### 7.3 Test de documentos

1. Ir a Documentos
2. Subir un archivo
3. Verificar que se sube a Google Drive
4. Verificar que aparece en la base de datos

### 7.4 Test de RAG

1. Ir a Documentos
2. Click en "Consultar RAG"
3. Hacer una pregunta sobre los documentos
4. Verificar respuesta

### 7.5 Test de WhatsApp

```bash
# Enviar mensaje de prueba al webhook
# IMPORTANTE: Ahora debes incluir case_id explícitamente
curl -X POST https://xxxxxxxxxxxxx.supabase.co/functions/v1/n8n-whatsapp-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "message_id": "test-123",
    "chat_id": "test-chat",
    "from_number": "5491234567890",
    "to_number": "5499876543210",
    "message_content": "Hola, consulta sobre el caso",
    "message_type": "text",
    "case_id": "UUID_DEL_CASO"
  }'
```

**Nota**: La auto-vinculación con IA fue eliminada para reducir consumo. Ahora debes enviar el `case_id` explícitamente desde N8N.

---

## 8. Troubleshooting

### Error: "new row violates row-level security policy"

**Causa**: Usuario no tiene el rol adecuado

**Solución**:
```sql
-- Verificar roles del usuario
SELECT * FROM user_roles WHERE user_id = 'UUID_DEL_USUARIO';

-- Asignar rol admin
INSERT INTO user_roles (user_id, role)
VALUES ('UUID_DEL_USUARIO', 'admin');
```

### Error: "Function not found" al invocar edge function

**Causa**: Función no deployada correctamente

**Solución**:
```bash
# Re-deploy la función
supabase functions deploy nombre-funcion

# Verificar
supabase functions list
```

### Error: "Webhook not configured" en RAG

**Causa**: Webhook de N8N no configurado en la base de datos

**Solución**:
```sql
-- Verificar webhooks configurados
SELECT * FROM n8n_webhooks;

-- Insertar webhook faltante
INSERT INTO n8n_webhooks (name, webhook_url, is_active)
VALUES ('n8n_rag_query_webhook', 'https://tu-n8n.app.n8n.cloud/webhook/rag-query', true);
```

### Error: JWT expired o Auth error

**Causa**: Token de sesión expirado

**Solución**:
```javascript
// Logout y login nuevamente
await supabase.auth.signOut()
// Login nuevamente
```

### Edge function timeout

**Causa**: Función tarda mucho en responder

**Solución**:
- Optimizar la función
- Aumentar timeout (máx 60s en Supabase)
- Usar processing asíncrono con queue

---

## 9. Deployment a Producción

### 9.1 Frontend

```bash
# Build
npm run build

# Deploy a Vercel/Netlify/etc
vercel deploy
# o
netlify deploy
```

### 9.2 Configurar variables en producción

En tu plataforma de hosting (Vercel, Netlify, etc.):

```bash
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_PROJECT_ID=xxxxxxxxxxxxx
```

### 9.3 Configurar CORS en Supabase

1. Authentication → URL Configuration
2. Site URL: `https://tu-dominio.com`
3. Redirect URLs: `https://tu-dominio.com/**`

### 9.4 Habilitar email confirmations

Para producción:
1. Authentication → Settings
2. Enable email confirmations: **ON**
3. Configurar SMTP personalizado o usar Supabase

---

## 10. Monitoreo

### Logs de Edge Functions

```bash
# Ver logs en tiempo real
supabase functions logs nombre-funcion --tail --follow
```

### Analytics Supabase

Dashboard → Analytics:
- Database usage
- API requests
- Auth events

### Configurar alertas

Dashboard → Settings → Integrations:
- Slack notifications
- Email alerts
- Webhooks

---

## Checklist Final

- [ ] Base de datos creada y migrada
- [ ] Usuario admin creado
- [ ] Edge functions deployadas
- [ ] Webhooks de N8N configurados
- [ ] Frontend configurado y funcionando
- [ ] Tests básicos pasados
- [ ] Variables de entorno configuradas
- [ ] CORS configurado
- [ ] Backups configurados
- [ ] Monitoring activo

---

## Recursos Adicionales

- [Documentación Supabase](https://supabase.com/docs)
- [Documentación N8N](https://docs.n8n.io)
- [DATABASE_MIGRATION.md](./DATABASE_MIGRATION.md)
- [EDGE_FUNCTIONS.md](./EDGE_FUNCTIONS.md)

---

## Soporte

Si encuentras problemas:
1. Revisar logs: `supabase functions logs nombre-funcion`
2. Revisar esta guía de troubleshooting
3. Consultar documentación oficial
4. Crear issue en GitHub

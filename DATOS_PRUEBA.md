# Datos de Prueba - Legal AI

## 📋 Resumen

Este documento describe los datos de prueba generados para todas las tablas del sistema.

## 🚀 Generar Datos de Prueba

Para generar todos los datos de prueba, ejecuta:

```bash
node scripts/generate-test-data.js
```

El script:
1. ✅ Crea usuarios de prueba si no existen
2. ✅ Genera datos para todas las tablas
3. ✅ Vincula los datos correctamente (relaciones entre tablas)

## 📊 Datos Generados

### 👥 Usuarios (5 usuarios)

| Email | Password | Nombre | Rol |
|-------|----------|--------|-----|
| `abogado1@legal.ai` | `Test123456` | Dr. Carlos Mendoza | Client (puede cambiarse a lawyer) |
| `abogado2@legal.ai` | `Test123456` | Dra. María González | Client (puede cambiarse a lawyer) |
| `cliente1@legal.ai` | `Test123456` | Juan Pérez | Client |
| `cliente2@legal.ai` | `Test123456` | Ana Martínez | Client |
| `cliente3@legal.ai` | `Test123456` | Roberto Sánchez | Client |

**Nota:** Los usuarios se crean con rol `client` por defecto. Para cambiar a `lawyer` o `admin`, ejecuta SQL en Supabase.

### 📁 Casos (5 casos)

1. **EXP-2024-001** - Divorcio Contencioso - Pérez vs Pérez
   - Estado: `in_progress`
   - Descripción: Proceso de divorcio contencioso con disputa sobre bienes gananciales

2. **EXP-2024-002** - Accidente de Tránsito - Martínez
   - Estado: `new`
   - Descripción: Reclamo por daños y perjuicios derivados de accidente de tránsito

3. **EXP-2024-003** - Contrato Laboral - Sánchez
   - Estado: `in_progress`
   - Descripción: Despido injustificado. Reclamo por indemnización

4. **EXP-2024-004** - Sucesión - Familia Rodríguez
   - Estado: `resolved`
   - Descripción: Proceso sucesorio con testamento

5. **EXP-2024-005** - Contrato Comercial - Empresa ABC
   - Estado: `on_hold`
   - Descripción: Incumplimiento contractual

### 📞 Contactos (5 contactos)

1. Dr. Luis Fernández - Abogado
2. Dra. Patricia López - Abogada
3. Testigo - María García
4. Perito - Dr. Jorge Ramírez
5. Cliente Potencial - Sofía Torres

### 📄 Documentos (5 documentos)

1. `Demanda_Inicial_EXP-001.pdf` - Vinculado a EXP-2024-001
2. `Contrato_Laboral_EXP-003.pdf` - Vinculado a EXP-2024-003
3. `Testamento_EXP-004.pdf` - Vinculado a EXP-2024-004
4. `Pericia_Medica_EXP-002.pdf` - Vinculado a EXP-2024-002
5. `Sentencia_EXP-004.pdf` - Vinculado a EXP-2024-004

### 📅 Eventos del Calendario (3 eventos)

1. **Audiencia Preliminar - EXP-001**
   - Fecha: 7 días desde ahora
   - Duración: 2 horas
   - Asistentes: Dr. Carlos Mendoza, Juan Pérez

2. **Reunión con Cliente - EXP-002**
   - Fecha: 3 días desde ahora
   - Duración: 1 hora
   - Asistentes: Dra. María González, Ana Martínez

3. **Mediación - EXP-003**
   - Fecha: 10 días desde ahora
   - Duración: 3 horas
   - Asistentes: Dr. Carlos Mendoza, Roberto Sánchez

### 🔗 Webhooks N8N (3 webhooks)

1. `n8n_rag_query_webhook` - Consultas RAG
2. `upload_to_drive` - Subir archivos a Google Drive
3. `whatsapp_messages` - Recibir mensajes de WhatsApp

### 💬 Mensajes de WhatsApp (3 mensajes)

1. **WA-MSG-001** - Consulta sobre caso EXP-2024-001
2. **WA-MSG-002** - Confirmación de audiencia
3. **WA-MSG-003** - Consulta sobre envío de documentos

## 🎯 Cómo Usar los Datos

### 1. Login con Usuario de Prueba

1. Ve a: https://legal.aiporvos.com/auth
2. Usa cualquiera de los usuarios de prueba:
   - Email: `abogado1@legal.ai`
   - Password: `Test123456`

### 2. Ver Datos en las Pantallas

- **Dashboard:** Verás resumen de casos y estadísticas
- **Casos:** Verás los 5 casos de prueba
- **Contactos:** Verás los 5 contactos
- **Documentos:** Verás los 5 documentos vinculados a casos
- **Calendario:** Verás los 3 eventos programados
- **Mensajes:** Verás los 3 mensajes de WhatsApp
- **Admin:** Verás los 3 webhooks configurados

### 3. Cambiar Roles de Usuarios

Para cambiar un usuario a `lawyer` o `admin`, ejecuta en Supabase SQL Editor:

```sql
-- Cambiar a lawyer
UPDATE public.user_roles 
SET role = 'lawyer' 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'abogado1@legal.ai');

-- Cambiar a admin
UPDATE public.user_roles 
SET role = 'admin' 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'abogado1@legal.ai');
```

## 🔄 Regenerar Datos

Si necesitas regenerar los datos:

1. **Eliminar datos existentes** (opcional):
   ```sql
   -- Cuidado: Esto eliminará todos los datos
   DELETE FROM public.whatsapp_messages;
   DELETE FROM public.calendar_events;
   DELETE FROM public.documents;
   DELETE FROM public.cases;
   DELETE FROM public.contacts;
   DELETE FROM public.n8n_webhooks;
   ```

2. **Ejecutar el script nuevamente**:
   ```bash
   node scripts/generate-test-data.js
   ```

## ✅ Verificación

Después de generar los datos, verifica:

- ✅ Usuarios creados en Supabase Dashboard → Authentication → Users
- ✅ Casos visibles en la pantalla de Casos
- ✅ Contactos visibles en la pantalla de Contactos
- ✅ Documentos vinculados a casos
- ✅ Eventos en el calendario
- ✅ Mensajes de WhatsApp
- ✅ Webhooks en Admin

## 📝 Notas

- Los datos se vinculan automáticamente (casos con usuarios, documentos con casos, etc.)
- Los usuarios se crean con email confirmado automáticamente
- Los perfiles se crean automáticamente por el trigger `on_auth_user_created`
- Los roles se asignan automáticamente como `client` por defecto


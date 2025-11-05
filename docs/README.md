# Documentación del Sistema Legal

Documentación completa para implementar el sistema desde cero.

---

## 📚 Índice de Documentación

### 1. [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
**Guía paso a paso completa desde cero**
- Crear proyecto Supabase
- Configurar base de datos
- Deploy de edge functions
- Configurar frontend
- Configurar N8N
- Testing
- Troubleshooting
- Deployment a producción

**Comienza aquí si estás empezando de cero.**

---

### 2. [DATABASE_MIGRATION.md](./DATABASE_MIGRATION.md)
**Todos los scripts SQL necesarios**
- Tipos Enum
- Funciones de base de datos
- Tablas completas
- Políticas RLS
- Triggers
- Datos iniciales

**Usa esto para crear o replicar la base de datos.**

---

### 3. [EDGE_FUNCTIONS.md](./EDGE_FUNCTIONS.md)
**Código completo de todas las Edge Functions**
- `query-rag` - Consultas RAG
- `upload-to-drive` - Subir archivos a Google Drive
- `n8n-cases-webhook` - Recibir casos desde N8N
- `n8n-documents-webhook` - Recibir documentos desde N8N
- `n8n-whatsapp-webhook` - Recibir mensajes de WhatsApp

**Usa esto para entender o modificar las edge functions.**

---

### 4. [CAMBIOS_CONSUMO.md](./CAMBIOS_CONSUMO.md)
**Optimización de recursos y consumo**
- Suscripciones realtime eliminadas
- Auto-vinculación con IA eliminada
- Impacto en funcionalidad
- Beneficios de reducción de consumo
- Guía de reversión

**Lee esto para entender qué se optimizó y por qué.**

---

## 🚀 Inicio Rápido

### Para implementar desde cero:

1. **Leer** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) completo
2. **Ejecutar** los SQL de [DATABASE_MIGRATION.md](./DATABASE_MIGRATION.md)
3. **Desplegar** las funciones de [EDGE_FUNCTIONS.md](./EDGE_FUNCTIONS.md)
4. **Configurar** N8N según la guía
5. **Probar** siguiendo las secciones de testing

### Para entender el sistema:

1. **Estructura de base de datos** → [DATABASE_MIGRATION.md](./DATABASE_MIGRATION.md)
2. **Backend logic** → [EDGE_FUNCTIONS.md](./EDGE_FUNCTIONS.md)
3. **Optimizaciones** → [CAMBIOS_CONSUMO.md](./CAMBIOS_CONSUMO.md)

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────┐
│   Frontend      │
│   (React + TS)  │
└────────┬────────┘
         │
         │ API Calls
         ▼
┌─────────────────┐
│   Supabase      │
│   (Backend)     │
├─────────────────┤
│ • Database      │
│ • Auth          │
│ • Edge Funcs    │
│ • RLS Policies  │
└────────┬────────┘
         │
         │ Webhooks
         ▼
┌─────────────────┐      ┌──────────────┐
│      N8N        │◄────►│ Google Drive │
│  (Workflows)    │      └──────────────┘
└────────┬────────┘
         │
         │ Webhooks
         ▼
┌─────────────────┐
│   WhatsApp      │
│   (Messages)    │
└─────────────────┘
```

---

## 📊 Tablas Principales

| Tabla | Descripción |
|-------|-------------|
| `profiles` | Perfiles de usuarios |
| `user_roles` | Roles (admin, lawyer, client) |
| `cases` | Expedientes legales |
| `documents` | Documentos vinculados a casos |
| `whatsapp_messages` | Mensajes de WhatsApp |
| `calendar_events` | Eventos del calendario |
| `contacts` | Contactos del sistema |
| `n8n_webhooks` | Configuración de webhooks N8N |

---

## 🔐 Roles y Permisos

### Admin
- Acceso completo a todo
- Gestión de usuarios
- Configuración de webhooks
- Gestión de casos, documentos, mensajes

### Lawyer (Abogado)
- Crear y gestionar casos
- Subir documentos
- Ver mensajes de WhatsApp
- Crear eventos de calendario
- Ver contactos

### Client (Cliente)
- Ver sus propios casos
- Ver documentos de sus casos
- Ver mensajes vinculados a sus casos
- Ver eventos de calendario donde está involucrado

---

## 🔧 Tecnologías Utilizadas

### Frontend
- **React 18** - UI Library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TanStack Query** - Data fetching
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library

### Backend
- **Supabase** - Backend as a service
  - PostgreSQL Database
  - Auth
  - Edge Functions (Deno)
  - Row Level Security

### Integraciones
- **N8N** - Workflow automation
- **Google Drive** - File storage
- **WhatsApp** - Messaging

---

## 📝 Variables de Entorno

```bash
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_PROJECT_ID=xxxxxxxxxxxxx
```

---

## 🆘 Soporte

### Problemas comunes:

1. **Error de RLS** → Verificar roles del usuario
2. **Edge function timeout** → Optimizar la función
3. **Webhook no configurado** → Verificar tabla `n8n_webhooks`

### Recursos:

- [Documentación Supabase](https://supabase.com/docs)
- [Documentación N8N](https://docs.n8n.io)
- [Troubleshooting Guide](./DEPLOYMENT_GUIDE.md#troubleshooting)

---

## 📅 Última Actualización

**Fecha**: 2025-11-05  
**Versión**: 1.0  
**Estado**: Optimizado para bajo consumo

---

## ✅ Checklist de Implementación

- [ ] Base de datos creada y migrada
- [ ] Usuario admin creado
- [ ] Edge functions deployadas
- [ ] Variables de entorno configuradas
- [ ] Webhooks de N8N configurados
- [ ] Frontend funcionando
- [ ] Tests básicos pasados
- [ ] Documentación revisada

---

## 🔄 Mantenimiento

### Backups recomendados:
- Base de datos: Diario (automático en Supabase)
- Configuración N8N: Semanal (exportar workflows)
- Variables de entorno: Guardar en lugar seguro

### Monitoreo:
- Logs de edge functions
- Analytics de Supabase
- Alertas configuradas

---

## 📧 Contacto

Para soporte adicional o consultas, consultar la documentación oficial o crear un issue en el repositorio.

# Sistema Legal - Gestión de Casos Legales

Sistema completo de gestión legal con integración a Supabase, N8N, Google Drive y WhatsApp.

---

## 🚀 Deployment Rápido con Docker

### Prerequisitos

- Docker instalado
- Cuenta en Dokploy (o servidor con Dokploy)
- Proyecto de Supabase (tu propia instancia)
- Repositorio Git

### Pasos Rápidos

1. **Fork o clona este repositorio**

```bash
git clone https://github.com/tu-usuario/sistema-legal.git
cd sistema-legal
```

2. **Configura Dokploy**

- Conecta tu repositorio GitHub
- Configura variables de entorno:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY`
  - `VITE_SUPABASE_PROJECT_ID`

3. **Deploy**

Dokploy detectará el `Dockerfile` y desplegará automáticamente.

**📚 Ver guía completa:** [DOCKER_DEPLOYMENT.md](./docs/DOCKER_DEPLOYMENT.md)

---

## 🧪 Testing Local

```bash
# 1. Copia las variables de entorno
cp .env.example .env

# 2. Edita .env con tus credenciales de Supabase
nano .env

# 3. Inicia con Docker Compose
docker-compose up -d

# 4. Abre en navegador
open http://localhost:3000
```

---

## 📁 Estructura del Proyecto

```
.
├── Dockerfile              # Configuración Docker
├── docker-compose.yml      # Para testing local
├── nginx.conf             # Configuración Nginx
├── docker-entrypoint.sh   # Script de inicio
├── src/                   # Código fuente React
├── docs/                  # Documentación completa
│   ├── DOCKER_DEPLOYMENT.md    # ⭐ Guía Docker + Dokploy
│   ├── DATABASE_MIGRATION.md   # Scripts SQL
│   ├── EDGE_FUNCTIONS.md       # Edge Functions
│   ├── DEPLOYMENT_GUIDE.md     # Guía manual
│   └── README.md              # Índice
└── supabase/
    └── functions/         # Edge Functions
```

---

## 📚 Documentación Completa

Toda la documentación está en `/docs`:

- **[DOCKER_DEPLOYMENT.md](./docs/DOCKER_DEPLOYMENT.md)** - Deployment con Docker (RECOMENDADO)
- **[DATABASE_MIGRATION.md](./docs/DATABASE_MIGRATION.md)** - Scripts SQL completos
- **[EDGE_FUNCTIONS.md](./docs/EDGE_FUNCTIONS.md)** - Código de Edge Functions
- **[DEPLOYMENT_GUIDE.md](./docs/DEPLOYMENT_GUIDE.md)** - Guía paso a paso manual
- **[CAMBIOS_CONSUMO.md](./docs/CAMBIOS_CONSUMO.md)** - Optimizaciones realizadas

---

## 🔧 Stack Tecnológico

### Frontend
- React 18 + TypeScript
- Vite
- TanStack Query
- Tailwind CSS + shadcn/ui

### Backend
- Supabase (PostgreSQL + Auth + Edge Functions)
- N8N (Automation)
- Google Drive (Storage)
- WhatsApp (Messaging)

---

## 🔐 Variables de Entorno

Las variables se configuran en Dokploy (no en el código):

```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJI...
VITE_SUPABASE_PROJECT_ID=xxxxx
```

---

## ✨ Features

- ✅ Gestión de casos legales
- ✅ Sistema de usuarios y roles (Admin, Lawyer, Client)
- ✅ Subida de documentos a Google Drive
- ✅ Integración con WhatsApp
- ✅ RAG (Retrieval-Augmented Generation) para consultas
- ✅ Calendario de eventos
- ✅ Sistema de contactos
- ✅ Webhooks N8N configurables

---

## 🐳 Características Docker

- ✅ Multi-stage build (optimizado)
- ✅ Variables de entorno en runtime (no en build)
- ✅ Nginx como servidor web
- ✅ Health check endpoint
- ✅ Gzip compression
- ✅ Cache de assets
- ✅ SPA routing

---

## 🚀 Desplegar en Producción

### Con Dokploy (Recomendado)

1. Conecta tu repo GitHub a Dokploy
2. Configura variables de entorno
3. Deploy automático en cada push

**Ver guía:** [DOCKER_DEPLOYMENT.md](./docs/DOCKER_DEPLOYMENT.md)

### Manual

Ver: [DEPLOYMENT_GUIDE.md](./docs/DEPLOYMENT_GUIDE.md)

---

## 🛠️ Desarrollo

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build
npm run build

# Preview
npm run preview
```

---

## 📊 Database Schema

Ver esquema completo en: [DATABASE_MIGRATION.md](./docs/DATABASE_MIGRATION.md)

Tablas principales:
- `profiles` - Perfiles de usuarios
- `user_roles` - Roles (admin, lawyer, client)
- `cases` - Expedientes legales
- `documents` - Documentos
- `whatsapp_messages` - Mensajes WhatsApp
- `n8n_webhooks` - Configuración webhooks

---

## 🔒 Seguridad

- ✅ Row Level Security (RLS) en todas las tablas
- ✅ Roles y permisos granulares
- ✅ Variables de entorno en runtime
- ✅ HTTPS automático con Dokploy
- ✅ Sin secrets en el código

---

## 📈 Optimizaciones

El sistema está optimizado para **mínimo consumo**:

- ❌ 0 suscripciones realtime
- ❌ 0 llamadas a IA automáticas
- ✅ Solo consultas cuando el usuario interactúa

Ver: [CAMBIOS_CONSUMO.md](./docs/CAMBIOS_CONSUMO.md)

---

## 🐛 Troubleshooting

Ver [DOCKER_DEPLOYMENT.md](./docs/DOCKER_DEPLOYMENT.md#troubleshooting) para soluciones a problemas comunes.

---

## 📝 Licencia

MIT

---

## 🙏 Créditos

Construido con:
- [React](https://react.dev/)
- [Supabase](https://supabase.com/)
- [N8N](https://n8n.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

---

**Hecho con ❤️ para la gestión legal eficiente**

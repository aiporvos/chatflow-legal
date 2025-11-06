# Cómo Obtener la Anon Key de Supabase

## 🔑 Paso a Paso

### 1. Ve a tu Proyecto Supabase

Abre este enlace directo:
```
https://supabase.com/dashboard/project/bkpgkenxyretsrxxrxfb/settings/api
```

O manualmente:
1. Ve a: https://supabase.com/dashboard
2. Selecciona tu proyecto: **bkpgkenxyretsrxxrxfb**
3. En el menú izquierdo, click en **Settings** (⚙️)
4. Click en **API**

### 2. Busca la Sección "Project API keys"

En la página de API Settings verás dos keys:

#### ✅ anon public (Esta es la que necesitas)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrcGdrZW54eXJldHNyeHhyeGZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyODQyNTAsImV4cCI6MjA3Nzg2MDI1MH0...
```
- **Nombre:** `anon` o `public`
- **Uso:** Frontend (React, Vue, etc.)
- **Esta es la que debes usar para `VITE_SUPABASE_PUBLISHABLE_KEY`**

#### ❌ service_role (NO usar en frontend)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrcGdrZW54eXJldHNyeHhyeGZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjI4NDI1MCwiZXhwIjoyMDc3ODYwMjUwfQ...
```
- **Nombre:** `service_role`
- **Uso:** Solo backend (Edge Functions, scripts)
- **NO usar en el frontend por seguridad**

### 3. Copia la Anon Key

1. En la sección **Project API keys**
2. Busca la key que dice **anon** o **public**
3. Click en el ícono de **copiar** (📋) o selecciona todo el texto
4. Copia la key completa (empieza con `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 4. Pégala en Dokploy

1. Ve a Dokploy → Tu aplicación → **Environment**
2. Encuentra la variable `VITE_SUPABASE_PUBLISHABLE_KEY`
3. Reemplaza `[anon key de Supabase Dashboard]` con la key real que copiaste
4. **Guarda** los cambios
5. **Redeploy** la aplicación

## ✅ Verificación

Después de configurar y redeploy:

1. Abre tu aplicación en el navegador
2. Abre DevTools (F12) → Console
3. Ejecuta:
   ```javascript
   console.log(window.__ENV__);
   ```
4. Deberías ver:
   ```javascript
   {
     VITE_SUPABASE_URL: "https://bkpgkenxyretsrxxrxfb.supabase.co",
     VITE_SUPABASE_PUBLISHABLE_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     VITE_SUPABASE_PROJECT_ID: "bkpgkenxyretsrxxrxfb"
   }
   ```

## 🔒 Seguridad

- ✅ La **anon key** es segura para usar en el frontend
- ✅ Está protegida por Row Level Security (RLS)
- ❌ **NUNCA** uses la **service_role key** en el frontend
- ✅ Las variables en Dokploy están encriptadas

## 📝 Resumen de Valores Finales

```
VITE_SUPABASE_URL=https://bkpgkenxyretsrxxrxfb.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=[Copia la anon key de Supabase Dashboard]
VITE_SUPABASE_PROJECT_ID=bkpgkenxyretsrxxrxfb
```


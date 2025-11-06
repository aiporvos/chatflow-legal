# Configuración de Variables de Entorno en Dokploy

## 📋 Variables Necesarias

Necesitas configurar estas 3 variables en Dokploy:

1. `VITE_SUPABASE_URL`
2. `VITE_SUPABASE_PUBLISHABLE_KEY` (anon key)
3. `VITE_SUPABASE_PROJECT_ID`

## 🔑 Cómo Obtener las Credenciales

### 1. Ve a tu Proyecto Supabase

Abre: https://supabase.com/dashboard/project/bkpgkenxyretsrxxrxfb

### 2. Ve a Settings → API

En el panel izquierdo:
- Click en **Settings** (⚙️)
- Click en **API**

### 3. Copia las Credenciales

Encontrarás:

**Project URL:**
```
https://bkpgkenxyretsrxxrxfb.supabase.co
```
→ Esta es tu `VITE_SUPABASE_URL`

**anon public key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
→ Esta es tu `VITE_SUPABASE_PUBLISHABLE_KEY` (NO la service_role key)

**Project ID:**
```
bkpgkenxyretsrxxrxfb
```
→ Esta es tu `VITE_SUPABASE_PROJECT_ID`

## ⚙️ Cómo Configurarlas en Dokploy

### Paso 1: Abre tu Aplicación en Dokploy

1. Ve a Dokploy Dashboard
2. Selecciona tu aplicación **Legal-Assistant**

### Paso 2: Ve a Environment Variables

1. Click en la pestaña **Environment** o **Environment Variables**
2. O ve a **Settings** → **Environment Variables**

### Paso 3: Agrega las Variables

Click en **Add Variable** o **+** y agrega cada una:

#### Variable 1:
- **Name:** `VITE_SUPABASE_URL`
- **Value:** `https://bkpgkenxyretsrxxrxfb.supabase.co`
- **Type:** `Environment Variable`

#### Variable 2:
- **Name:** `VITE_SUPABASE_PUBLISHABLE_KEY`
- **Value:** `[Copia la anon public key de Supabase]`
- **Type:** `Environment Variable`
- ⚠️ **IMPORTANTE:** Usa la **anon public key**, NO la service_role key

#### Variable 3:
- **Name:** `VITE_SUPABASE_PROJECT_ID`
- **Value:** `bkpgkenxyretsrxxrxfb`
- **Type:** `Environment Variable`

### Paso 4: Guarda y Redeploy

1. Click en **Save** o **Apply**
2. Ve a **Deployments** o **Deploy**
3. Click en **Redeploy** o **Deploy Now**

## ✅ Verificación

Después del deploy:

1. Abre la aplicación en tu navegador
2. Abre DevTools (F12) → Console
3. Ejecuta:
   ```javascript
   console.log(window.__ENV__);
   ```
4. Deberías ver tus variables de entorno configuradas

## 🔒 Seguridad

- ✅ La **anon public key** es segura para usar en el frontend
- ❌ **NUNCA** uses la **service_role key** en el frontend (es solo para backend)
- ✅ Las variables de entorno en Dokploy están encriptadas

## 📝 Resumen de Valores

Basado en tu proyecto:

```
VITE_SUPABASE_URL=https://bkpgkenxyretsrxxrxfb.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=[anon public key de Supabase Dashboard]
VITE_SUPABASE_PROJECT_ID=bkpgkenxyretsrxxrxfb
```

## 🆘 Si no encuentras la anon key

1. Ve a: https://supabase.com/dashboard/project/bkpgkenxyretsrxxrxfb/settings/api
2. Busca la sección **Project API keys**
3. Copia la key que dice **anon** o **public** (NO la service_role)


# Configurar Google OAuth en Supabase

## 🎯 Objetivo

Habilitar autenticación con Google (OAuth) en Supabase para permitir login con Gmail.

## 📋 Pasos en Supabase Dashboard

### 1. Ve a Authentication → Providers

1. Abre: https://supabase.com/dashboard/project/bkpgkenxyretsrxxrxfb/auth/providers
2. O manualmente:
   - Ve a tu proyecto Supabase
   - Click en **Authentication** (en el menú izquierdo)
   - Click en **Providers**

### 2. Habilita Google Provider

1. Busca **Google** en la lista de providers
2. Click en el toggle para **habilitar** Google
3. Se abrirá un formulario de configuración

### 3. Configura Google OAuth

Necesitas crear un proyecto en Google Cloud Console:

#### Paso 1: Crear Proyecto en Google Cloud Console

1. Ve a: https://console.cloud.google.com/
2. Click en **Select a project** → **New Project**
3. Nombre del proyecto: `Legal AI` (o el que prefieras)
4. Click en **Create**

#### Paso 2: Configurar OAuth Consent Screen

1. En Google Cloud Console, ve a **APIs & Services** → **OAuth consent screen**
2. Selecciona **External** (a menos que tengas Google Workspace)
3. Click en **Create**
4. Completa el formulario:
   - **App name:** `Legal AI`
   - **User support email:** tu email
   - **Developer contact information:** tu email
5. Click en **Save and Continue**
6. En **Scopes**, click en **Save and Continue**
7. En **Test users**, agrega tu email si es necesario
8. Click en **Save and Continue**

#### Paso 3: Crear Credenciales OAuth

1. Ve a **APIs & Services** → **Credentials**
2. Click en **Create Credentials** → **OAuth client ID**
3. Selecciona **Web application**
4. Completa:
   - **Name:** `Legal AI Web Client`
   - **Authorized JavaScript origins:**
     ```
     https://legal.aiporvos.com
     https://bkpgkenxyretsrxxrxfb.supabase.co
     ```
   - **Authorized redirect URIs:**
     ```
     https://bkpgkenxyretsrxxrxfb.supabase.co/auth/v1/callback
     ```
5. Click en **Create**
6. **IMPORTANTE:** Copia el **Client ID** y **Client Secret**

#### Paso 4: Configurar en Supabase

1. En Supabase Dashboard → **Authentication** → **Providers** → **Google**
2. Pega el **Client ID** de Google
3. Pega el **Client Secret** de Google
4. Click en **Save**

### 4. Configurar Redirect URLs

1. Ve a **Authentication** → **URL Configuration**
2. Asegúrate de que estas URLs estén en **Redirect URLs**:
   ```
   https://legal.aiporvos.com/**
   https://legal.aiporvos.com/auth
   https://legal.aiporvos.com/dashboard
   https://legal.aiporvos.com/auth?redirectTo=/dashboard
   ```

## ✅ Verificación

### 1. Probar Login con Google

1. Ve a tu aplicación: `https://legal.aiporvos.com/auth`
2. Click en **Continuar con Google**
3. Deberías ser redirigido a Google para autenticación
4. Después de autenticarte, deberías ser redirigido a `/dashboard`

### 2. Verificar Usuario Creado

1. En Supabase Dashboard → **Authentication** → **Users**
2. Deberías ver el usuario creado con Google
3. El email debería ser tu email de Google

## 🔧 Troubleshooting

### Error: "redirect_uri_mismatch"

**Causa:** La URL de redirect no está configurada correctamente en Google Cloud Console.

**Solución:**
1. Ve a Google Cloud Console → **Credentials** → Tu OAuth Client
2. Agrega esta URL a **Authorized redirect URIs**:
   ```
   https://bkpgkenxyretsrxxrxfb.supabase.co/auth/v1/callback
   ```
3. Guarda los cambios
4. Espera unos minutos para que se propague

### Error: "invalid_client"

**Causa:** Client ID o Client Secret incorrectos.

**Solución:**
1. Verifica que copiaste correctamente el Client ID y Client Secret
2. Asegúrate de que no haya espacios al inicio o final
3. Regenera las credenciales si es necesario

### El usuario no se crea automáticamente

**Causa:** El trigger `on_auth_user_created` no está configurado.

**Solución:**
1. Ejecuta el SQL de migración si no lo has hecho
2. Verifica que el trigger esté creado:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
   ```

## 📝 Resumen de URLs a Configurar

### En Google Cloud Console:

**Authorized JavaScript origins:**
```
https://legal.aiporvos.com
https://bkpgkenxyretsrxxrxfb.supabase.co
```

**Authorized redirect URIs:**
```
https://bkpgkenxyretsrxxrxfb.supabase.co/auth/v1/callback
```

### En Supabase Dashboard:

**Redirect URLs:**
```
https://legal.aiporvos.com/**
https://legal.aiporvos.com/auth
https://legal.aiporvos.com/dashboard
https://legal.aiporvos.com/auth?redirectTo=/dashboard
```

## 🎉 Listo!

Una vez configurado, los usuarios podrán:
- Hacer login con Google (un solo click)
- Registrarse con Google (automático)
- No necesitar crear contraseña


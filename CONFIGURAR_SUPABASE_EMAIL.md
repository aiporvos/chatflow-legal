# Configurar Email de Confirmación en Supabase

## 🎯 Objetivo

Configurar Supabase para que los emails de confirmación redirijan a tu aplicación (aiporvos/Legal AI) en lugar de Lovable.

## 📋 Pasos en Supabase Dashboard

### 1. Ve a Authentication → URL Configuration

1. Abre: https://supabase.com/dashboard/project/bkpgkenxyretsrxxrxfb/auth/url-configuration
2. O manualmente:
   - Ve a tu proyecto Supabase
   - Click en **Authentication** (en el menú izquierdo)
   - Click en **URL Configuration**

### 2. Configura las URLs

#### Site URL:
```
https://legal.aiporvos.com
```
O tu dominio de Dokploy donde está desplegada la aplicación.

#### Redirect URLs:
Agrega estas URLs (una por línea):
```
https://legal.aiporvos.com/**
https://legal.aiporvos.com/auth
https://legal.aiporvos.com/dashboard
```

**Importante:** Reemplaza `legal.aiporvos.com` con tu dominio real de Dokploy.

### 3. Configura Email Templates (Opcional)

1. Ve a **Authentication** → **Email Templates**
2. Selecciona **Confirm signup**
3. Personaliza el template para que diga "Legal AI" y "aiporvos" en lugar de Lovable
4. El link de confirmación ya usará la URL configurada arriba

### 4. Configura Email Settings

1. Ve a **Authentication** → **Providers** → **Email**
2. Verifica que esté habilitado
3. En **Email confirmations**:
   - **ON** para producción (requiere confirmación de email)
   - **OFF** para desarrollo (no requiere confirmación)

### 5. Configurar SMTP (Opcional - Recomendado para Producción)

Si quieres usar tu propio servidor SMTP:

1. Ve a **Settings** → **Auth**
2. Scroll hasta **SMTP Settings**
3. Configura tu servidor SMTP:
   - **Host:** smtp.tu-servidor.com
   - **Port:** 587 (o 465 para SSL)
   - **Username:** tu-usuario
   - **Password:** tu-password
   - **Sender email:** noreply@aiporvos.com
   - **Sender name:** Legal AI

## ✅ Verificación

### 1. Probar Registro

1. Ve a tu aplicación: `https://legal.aiporvos.com/auth`
2. Click en **Registrarse**
3. Completa el formulario
4. Click en **Crear Cuenta**

### 2. Verificar Email

1. Revisa tu bandeja de entrada
2. Deberías recibir un email de confirmación
3. El link en el email debería apuntar a: `https://legal.aiporvos.com/auth?redirectTo=/dashboard`
4. Click en el link

### 3. Verificar Redirect

1. Después de hacer click en el link del email
2. Deberías ser redirigido a: `https://legal.aiporvos.com/dashboard`
3. Deberías estar autenticado automáticamente

## 🔧 Troubleshooting

### El email no llega

1. Verifica que **Email confirmations** esté **ON** en Supabase
2. Revisa la carpeta de spam
3. Verifica los logs de Supabase: **Logs** → **Auth Logs**

### El redirect no funciona

1. Verifica que la URL esté en la lista de **Redirect URLs** en Supabase
2. Verifica que uses `https://` (no `http://`)
3. Verifica que no haya espacios en las URLs

### El usuario no se crea automáticamente

1. Verifica que el trigger `on_auth_user_created` esté configurado
2. Ejecuta el SQL de migración si no lo has hecho
3. Verifica los logs de Supabase: **Logs** → **Postgres Logs**

## 📝 Resumen de URLs a Configurar

En Supabase Dashboard → Authentication → URL Configuration:

**Site URL:**
```
https://legal.aiporvos.com
```

**Redirect URLs:**
```
https://legal.aiporvos.com/**
https://legal.aiporvos.com/auth
https://legal.aiporvos.com/dashboard
```

**Nota:** Reemplaza `legal.aiporvos.com` con tu dominio real de Dokploy.

## 🎨 Personalizar Email Templates

Para cambiar el texto del email de confirmación:

1. Ve a **Authentication** → **Email Templates**
2. Selecciona **Confirm signup**
3. Edita el template:
   - Cambia "Lovable" por "Legal AI"
   - Cambia cualquier referencia a Lovable por "aiporvos"
4. Guarda los cambios

El template usa variables como `{{ .ConfirmationURL }}` que se reemplazan automáticamente.


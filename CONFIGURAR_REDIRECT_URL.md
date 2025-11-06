# Configurar URL de Redirect en Supabase

## 🎯 Problema

El email de confirmación está redirigiendo a `localhost:3000` en lugar de `legal.aiporvos.com`.

## ✅ Solución

### 1. Configurar URL en Supabase Dashboard

1. Ve a Supabase Dashboard:
   ```
   https://supabase.com/dashboard/project/bkpgkenxyretsrxxrxfb/auth/url-configuration
   ```

2. Configura las URLs:

   **Site URL:**
   ```
   https://legal.aiporvos.com
   ```

   **Redirect URLs:**
   Agrega estas URLs (una por línea):
   ```
   https://legal.aiporvos.com/**
   https://legal.aiporvos.com/auth
   https://legal.aiporvos.com/dashboard
   https://legal.aiporvos.com/auth?redirectTo=/dashboard
   ```

3. **IMPORTANTE:** Guarda los cambios

### 2. Configurar Variable de Entorno (Opcional)

Si quieres usar una variable de entorno para la URL de producción:

1. En Dokploy, agrega la variable:
   ```
   VITE_PRODUCTION_URL=https://legal.aiporvos.com
   ```

2. O en tu `.env` local:
   ```
   VITE_PRODUCTION_URL=https://legal.aiporvos.com
   ```

### 3. Verificar Configuración

Después de configurar:

1. **Prueba el registro:**
   - Ve a `https://legal.aiporvos.com/auth`
   - Click en **Registrarse**
   - Completa el formulario
   - Click en **Crear Cuenta**

2. **Verifica el email:**
   - Revisa tu bandeja de entrada
   - El link en el email debería ser: `https://legal.aiporvos.com/auth?redirectTo=/dashboard`

3. **Haz click en el link:**
   - Deberías ser redirigido a `https://legal.aiporvos.com/dashboard`
   - Deberías estar autenticado automáticamente

## 🔧 Troubleshooting

### El email sigue redirigiendo a localhost

**Causa:** Supabase está usando la URL del `emailRedirectTo` que se pasa en el signUp.

**Solución:**
1. Verifica que las URLs estén configuradas en Supabase Dashboard
2. Verifica que `VITE_PRODUCTION_URL` esté configurada en Dokploy
3. Verifica que el código use la URL correcta (ya está corregido)

### El redirect no funciona

**Causa:** La URL no está en la lista de Redirect URLs permitidas.

**Solución:**
1. Agrega la URL exacta a la lista de Redirect URLs en Supabase
2. Asegúrate de usar `https://` (no `http://`)
3. No dejes espacios en las URLs

### Error "Invalid redirect URL"

**Causa:** La URL no está permitida en Supabase.

**Solución:**
1. Ve a Authentication → URL Configuration
2. Agrega la URL exacta a Redirect URLs
3. Guarda los cambios
4. Intenta nuevamente

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
https://legal.aiporvos.com/auth?redirectTo=/dashboard
```

**Nota:** Reemplaza `legal.aiporvos.com` con tu dominio real de Dokploy si es diferente.


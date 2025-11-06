# Fix: Error 502 Bad Gateway en Dokploy

## Problema

Dokploy está usando **Nixpacks** en lugar del **Dockerfile**, y está detectando las Edge Functions de Supabase (Deno) como aplicación principal, cuando en realidad debería usar el Dockerfile que construye la aplicación React con Nginx.

## Solución

### Opción 1: Configurar Dokploy para usar Dockerfile (Recomendado)

En Dokploy Dashboard:

1. Ve a tu aplicación **Legal-Assistant**
2. Ve a **Settings** o **Build Settings**
3. En **Build Type**, selecciona **Dockerfile** en lugar de **Nixpacks**
4. Asegúrate de que:
   - **Dockerfile Path**: `./Dockerfile`
   - **Build Context**: `.`
5. Guarda y redeploy

### Opción 2: Verificar configuración actual

Si ya está configurado para usar Dockerfile pero sigue usando Nixpacks:

1. Verifica que el Dockerfile esté en la raíz del repositorio
2. Verifica que no haya un archivo `nixpacks.toml` que esté interfiriendo
3. Elimina cualquier caché de build en Dokploy
4. Haz un redeploy limpio

### Opción 3: Forzar uso de Dockerfile

Si Dokploy sigue usando Nixpacks automáticamente:

1. En Dokploy, ve a **Build Settings**
2. Desactiva **Auto-detect** o **Nixpacks**
3. Fuerza el uso de **Dockerfile**
4. Guarda y redeploy

## Verificación

Después del redeploy, verifica:

1. Los logs deberían mostrar:
   ```
   Building with Dockerfile
   FROM node:20-alpine AS builder
   ...
   ```

2. No debería mostrar:
   ```
   Nixpacks v1.39.0
   setup │ deno
   ```

3. El contenedor debería estar ejecutando Nginx en el puerto 80

## Archivos creados

- `nixpacks.toml` - Configuración para forzar Node.js si se usa Nixpacks
- `.nixpacksignore` - Ignora Edge Functions para que no se detecten
- `.dokploy.yml` - Configuración para Dokploy (si lo soporta)

## Próximos pasos

1. Configura Dokploy para usar Dockerfile
2. Redeploy la aplicación
3. Verifica que el contenedor esté corriendo Nginx
4. Verifica que el health check funcione: `/health`


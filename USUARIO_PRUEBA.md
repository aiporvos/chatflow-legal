# Usuario de Prueba - Legal AI

## 🔐 Credenciales de Prueba

### Usuario de Prueba

**Email:** `test@legal.ai`  
**Password:** `Test123456`  
**Nombre:** Usuario de Prueba  
**Rol:** Client (por defecto)

### 🔗 URL de Login

```
https://legal.aiporvos.com/auth
```

## 📋 Cómo Usar

1. Ve a la URL de login: https://legal.aiporvos.com/auth
2. Ingresa las credenciales:
   - **Email:** `test@legal.ai`
   - **Password:** `Test123456`
3. Click en **Iniciar Sesión**
4. Serás redirigido al dashboard

## ⚠️ Notas Importantes

- Este usuario está **confirmado automáticamente** (no requiere verificación de email)
- El perfil y rol se crean automáticamente al registrarse
- Puedes usar este usuario para pruebas y desarrollo
- **NO uses este usuario en producción** con datos reales

## 🔄 Crear Nuevo Usuario de Prueba

Si necesitas crear otro usuario de prueba, ejecuta:

```bash
node scripts/create-test-user.js
```

O crea uno manualmente en Supabase Dashboard:
1. Ve a: https://supabase.com/dashboard/project/bkpgkenxyretsrxxrxfb/auth/users
2. Click en **Add user**
3. Completa los datos
4. Marca **Auto Confirm User: YES**
5. Click en **Create user**

## 🎯 Asignar Rol Admin (Opcional)

Si quieres que este usuario sea admin:

1. Ve a Supabase Dashboard → SQL Editor
2. Ejecuta:

```sql
-- Obtener el User ID del usuario
SELECT id, email FROM auth.users WHERE email = 'test@legal.ai';

-- Asignar rol admin (reemplaza USER_ID con el ID obtenido)
INSERT INTO public.user_roles (user_id, role)
VALUES ('USER_ID_AQUI', 'admin')
ON CONFLICT (user_id, role) DO UPDATE SET role = 'admin';
```

O ejecuta directamente (si conoces el User ID):

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('6f45e366-06f2-4d24-af66-0e2a61090963', 'admin')
ON CONFLICT (user_id, role) DO UPDATE SET role = 'admin';
```

## ✅ Verificación

Después de hacer login, verifica:
- ✅ Puedes acceder al dashboard
- ✅ Tu perfil se muestra correctamente
- ✅ Puedes navegar por las diferentes secciones
- ✅ Los permisos funcionan según tu rol


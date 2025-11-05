# Deployment con Docker y Dokploy

Guía completa para desplegar la aplicación en Dokploy usando tu propia base de datos Supabase.

---

## 📋 Prerequisitos

1. ✅ Cuenta en Dokploy (o servidor con Dokploy instalado)
2. ✅ Proyecto de Supabase (tu propia instancia)
3. ✅ Repositorio Git (GitHub, GitLab, etc.)
4. ✅ Base de datos migrada según [DATABASE_MIGRATION.md](./DATABASE_MIGRATION.md)
5. ✅ Edge functions desplegadas según [EDGE_FUNCTIONS.md](./EDGE_FUNCTIONS.md)

---

## 🗄️ Paso 1: Preparar Supabase

### 1.1 Obtener credenciales

En tu proyecto de Supabase:

1. Ve a **Settings → API**
2. Copia estos valores:

```bash
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Project ID: xxxxxxxxxxxxx
```

### 1.2 Migrar base de datos

Ejecuta todos los scripts SQL de [DATABASE_MIGRATION.md](./DATABASE_MIGRATION.md):

```bash
# Conéctate a tu Supabase
supabase login
supabase link --project-ref xxxxxxxxxxxxx

# Ejecuta las migraciones desde el SQL Editor
# O copia el contenido de DATABASE_MIGRATION.md
```

### 1.3 Desplegar Edge Functions

```bash
# Deploy todas las funciones
supabase functions deploy query-rag
supabase functions deploy upload-to-drive
supabase functions deploy n8n-cases-webhook
supabase functions deploy n8n-documents-webhook
supabase functions deploy n8n-whatsapp-webhook
```

---

## 🐳 Paso 2: Configurar Repositorio Git

### 2.1 Archivos necesarios

Tu repositorio debe contener:

- ✅ `Dockerfile`
- ✅ `nginx.conf`
- ✅ `docker-entrypoint.sh`
- ✅ `.dockerignore`
- ✅ `docker-compose.yml` (opcional, para testing local)

Todos estos archivos ya están incluidos en el proyecto.

### 2.2 Push a GitHub

```bash
git add .
git commit -m "Add Docker configuration"
git push origin main
```

---

## 🚀 Paso 3: Configurar Dokploy

### 3.1 Crear nueva aplicación

1. **Login a Dokploy**
2. **Create New Application**
3. **Selecciona "Git"**
4. **Conecta tu repositorio**
   - GitHub, GitLab, Gitea, etc.
   - Selecciona el repositorio
   - Branch: `main` (o tu branch principal)

### 3.2 Configuración de Build

En la sección de Build:

```yaml
Build Type: Dockerfile
Dockerfile Path: ./Dockerfile
Build Context: .
```

### 3.3 Configurar Variables de Entorno

En **Environment Variables**, agrega:

| Variable | Valor | Ejemplo |
|----------|-------|---------|
| `VITE_SUPABASE_URL` | URL de tu Supabase | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Anon key de Supabase | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `VITE_SUPABASE_PROJECT_ID` | Project ID | `xxxxxxxxxxxxx` |

**IMPORTANTE**: Estas son las variables que configurarás desde el panel de admin en la aplicación.

### 3.4 Configurar Networking

```yaml
Port: 80
Domain: tu-dominio.com (o usa el dominio de Dokploy)
Enable HTTPS: ✅ (si tienes dominio propio)
```

### 3.5 Deploy

1. Click **Deploy**
2. Espera 3-5 minutos mientras se construye
3. Verifica los logs si hay errores

---

## ⚙️ Paso 4: Configuración Inicial en la App

### 4.1 Crear usuario admin

Una vez desplegada:

1. Registra el primer usuario en `/auth`
2. Conéctate a tu Supabase y ejecuta:

```sql
-- Obtén el UUID del usuario desde Authentication → Users
INSERT INTO public.user_roles (user_id, role)
VALUES ('UUID_DEL_USUARIO', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

### 4.2 Configurar webhooks de N8N

1. Login como admin
2. Ve a **Settings**
3. Configura los webhooks:

```
N8N RAG Query Webhook: https://tu-n8n.com/webhook/rag-query
Upload to Drive: https://tu-n8n.com/webhook/upload-drive
```

---

## 🧪 Testing Local con Docker

### Opción 1: Docker Compose

```bash
# 1. Copia el archivo de ejemplo
cp .env.example .env

# 2. Edita .env con tus credenciales de Supabase
nano .env

# 3. Build y run
docker-compose up -d

# 4. Verifica
curl http://localhost:3000/health

# 5. Abre en navegador
open http://localhost:3000
```

### Opción 2: Docker directo

```bash
# Build
docker build -t sistema-legal .

# Run con variables de entorno
docker run -d -p 3000:80 \
  -e VITE_SUPABASE_URL=https://xxxxx.supabase.co \
  -e VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJI... \
  -e VITE_SUPABASE_PROJECT_ID=xxxxx \
  --name sistema-legal \
  sistema-legal

# Ver logs
docker logs -f sistema-legal

# Stop
docker stop sistema-legal
docker rm sistema-legal
```

---

## 🔍 Verificación

### Health Check

```bash
curl https://tu-dominio.com/health
# Respuesta esperada: "healthy"
```

### Verificar variables de entorno

1. Abre DevTools (F12)
2. En Console, ejecuta:

```javascript
console.log(window.__ENV__);
// Debería mostrar tus variables de Supabase
```

### Test de conexión a Supabase

1. Intenta hacer login
2. Si hay error, revisa:
   - Variables de entorno en Dokploy
   - URL de Supabase correcta
   - Anon key válida

---

## 🐛 Troubleshooting

### Error: "Cannot read properties of undefined"

**Causa**: Variables de entorno no configuradas

**Solución**:
```bash
# En Dokploy, verifica que las variables estén configuradas
# Redeploy la aplicación
```

### Error: "Failed to fetch"

**Causa**: URL de Supabase incorrecta o CORS

**Solución**:
1. Verifica la URL en Dokploy
2. En Supabase → Authentication → URL Configuration:
   - Site URL: `https://tu-dominio.com`
   - Redirect URLs: `https://tu-dominio.com/**`

### Error: "Invalid API key"

**Causa**: Anon key incorrecta

**Solución**:
```bash
# Verifica que copiaste la anon key completa
# Regenera la key en Supabase si es necesario
```

### Container se reinicia constantemente

**Causa**: Error en el build o runtime

**Solución**:
```bash
# Ver logs en Dokploy
# O localmente:
docker logs sistema-legal
```

---

## 🔄 Actualizaciones

### Auto-deploy desde Git

Dokploy puede auto-deploy cuando haces push:

1. En Dokploy → Settings → Webhooks
2. Copia el webhook URL
3. En GitHub → Settings → Webhooks → Add webhook
4. Pega la URL y guarda

Ahora cada push a `main` hará auto-deploy.

### Manual deploy

```bash
# Push cambios a git
git add .
git commit -m "Update feature"
git push

# En Dokploy, click "Redeploy"
```

---

## 📊 Monitoreo

### Logs

En Dokploy:
- **Logs** tab → Ver logs en tiempo real
- Filtra por error: `grep -i error`

### Métricas

- **Metrics** tab → CPU, RAM, Network
- Configura alertas si es necesario

### Backup

Configura backups automáticos de:
1. Base de datos Supabase (Settings → Database → Backups)
2. Variables de entorno (exporta desde Dokploy)

---

## 🔒 Seguridad

### Variables sensibles

- ❌ NUNCA commitees el archivo `.env`
- ✅ Usa variables de entorno en Dokploy
- ✅ Rota las keys regularmente

### HTTPS

```bash
# En Dokploy, habilita HTTPS automático
# O configura certificado personalizado
```

### Firewall

```bash
# Solo abre puerto 80/443
# Supabase maneja su propia seguridad
```

---

## 📈 Escalado

### Horizontal Scaling

Dokploy soporta múltiples instancias:

1. Settings → Scaling
2. Configura número de replicas
3. Load balancer automático

### Vertical Scaling

Aumenta recursos:

```yaml
Resources:
  CPU: 2 cores
  RAM: 4GB
  Storage: 20GB
```

---

## 🎯 Checklist Final

- [ ] Base de datos migrada en Supabase
- [ ] Edge functions desplegadas
- [ ] Variables de entorno configuradas en Dokploy
- [ ] Aplicación desplegada y accesible
- [ ] Usuario admin creado
- [ ] Webhooks de N8N configurados
- [ ] HTTPS habilitado
- [ ] Auto-deploy configurado
- [ ] Backups configurados
- [ ] Monitoreo activo

---

## 📚 Recursos

- [Documentación Dokploy](https://docs.dokploy.com/)
- [Documentación Supabase](https://supabase.com/docs)
- [DATABASE_MIGRATION.md](./DATABASE_MIGRATION.md)
- [EDGE_FUNCTIONS.md](./EDGE_FUNCTIONS.md)
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

## 💡 Tips

1. **Testing local primero**: Siempre prueba con Docker Compose localmente antes de desplegar
2. **Variables de entorno**: Mantén una lista actualizada en un gestor de passwords
3. **Logs**: Revisa los logs regularmente para detectar problemas temprano
4. **Backups**: Programa backups diarios de la base de datos
5. **Monitoreo**: Configura alertas para errores críticos

---

## 🆘 Soporte

Si encuentras problemas:

1. Revisa los logs en Dokploy
2. Verifica las variables de entorno
3. Consulta esta documentación
4. Revisa los logs de Supabase
5. Crea un issue en el repositorio

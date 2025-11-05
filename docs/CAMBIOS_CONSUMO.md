# Cambios para Reducir Consumo de Recursos

## Resumen

Se eliminaron todas las funcionalidades que consumen recursos innecesarios en Lovable Cloud.

---

## 1. Suscripciones Realtime Eliminadas

### Archivos modificados:

- ✅ `src/hooks/useWebhooks.tsx` - Eliminada suscripción realtime
- ✅ `src/hooks/useWhatsAppMessages.tsx` - Eliminada suscripción realtime  
- ✅ `src/hooks/useCases.tsx` - Eliminada suscripción realtime
- ✅ `src/hooks/useDocuments.tsx` - Eliminada suscripción realtime

### Antes:
```typescript
useEffect(() => {
  const channel = supabase
    .channel("table-changes")
    .on("postgres_changes", {...}, () => query.refetch())
    .subscribe();

  return () => supabase.removeChannel(channel);
}, [query]);
```

### Después:
```typescript
// Sin suscripciones realtime
// Los datos se actualizan al recargar manualmente o al hacer refetch
```

---

## 2. Auto-vinculación con IA Eliminada

### Archivo modificado:

- ✅ `supabase/functions/n8n-whatsapp-webhook/index.ts`

### Funcionalidad eliminada:

Se eliminó la vinculación automática de mensajes de WhatsApp a casos usando Lovable AI (que consumía llamadas a API).

### Antes:
```typescript
// Usaba Lovable AI para analizar el mensaje y vincularlo a un caso
const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${lovableApiKey}`,
  },
  body: JSON.stringify({
    model: "google/gemini-2.5-flash",
    messages: [...],
  }),
});
```

### Después:
```typescript
// El case_id debe venir explícitamente en el payload desde N8N
const linkedCaseId = payload.case_id || null;
```

---

## 3. Impacto en Funcionalidad

### Lo que SIGUE funcionando:

✅ Toda la funcionalidad core del sistema
✅ Crear, editar y eliminar casos
✅ Subir documentos
✅ Consultar RAG
✅ Recibir mensajes de WhatsApp
✅ Gestionar webhooks

### Lo que CAMBIA:

⚠️ **Actualización de datos**: Los datos NO se actualizan automáticamente en tiempo real. Necesitas:
  - Recargar la página manualmente
  - Navegar entre páginas
  - Usar botones de refetch si están disponibles

⚠️ **WhatsApp**: Los mensajes de WhatsApp ya NO se vinculan automáticamente a casos. Debes:
  - Enviar el `case_id` explícitamente en el payload desde N8N
  - O vincular manualmente después en la aplicación

---

## 4. Beneficios

### Reducción de consumo:

- ❌ **0 suscripciones realtime activas** (antes: 4)
- ❌ **0 llamadas a Lovable AI** (antes: por cada mensaje de WhatsApp sin case_id)
- ✅ **Menor uso de recursos de base de datos**
- ✅ **Menor costo operativo**

### Recomendaciones:

Si necesitas actualizaciones en tiempo real en el futuro:
1. Implementar polling cada X segundos (menos consumo que realtime)
2. Refetch manual con botones
3. Reactivar realtime solo en tablas críticas

Si necesitas auto-vinculación de WhatsApp:
1. Implementar lógica en N8N antes de enviar a Supabase
2. Usar reglas simples basadas en palabras clave
3. Vincular manualmente en la UI

---

## 5. Monitoreo de Consumo

### Cómo verificar que se redujo el consumo:

1. **Dashboard de Supabase**:
   - Database → Replication → Deberías ver menos tráfico
   - Functions → Logs → Deberías ver menos invocaciones

2. **Realtime Connections**:
   - Antes: 4+ conexiones activas
   - Ahora: 0 conexiones activas

3. **API Calls**:
   - Antes: Llamadas constantes de realtime + AI
   - Ahora: Solo cuando el usuario hace acciones

---

## 6. Reversión (si es necesario)

Si necesitas reactivar alguna funcionalidad:

### Realtime:
Restaurar el código de `useEffect` con `supabase.channel()` en los hooks afectados.

### Auto-vinculación IA:
Restaurar el código de la edge function `n8n-whatsapp-webhook/index.ts` entre las líneas 30-88.

---

## Última Actualización

Fecha: 2025-11-05
Estado: ✅ Todos los cambios aplicados
Consumo: Minimizado al máximo

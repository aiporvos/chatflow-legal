# Edge Functions - Sistema Legal

Este documento contiene todas las Edge Functions necesarias para el sistema.

## Tabla de Contenidos

1. [Configuración](#configuración)
2. [Secrets Requeridos](#secrets-requeridos)
3. [Edge Functions](#edge-functions)
4. [Deployment](#deployment)

---

## Configuración

### supabase/config.toml

```toml
project_id = "TU_PROJECT_ID"

[functions.query-rag]
verify_jwt = false

[functions.upload-to-drive]
verify_jwt = false

[functions.n8n-cases-webhook]
verify_jwt = false

[functions.n8n-documents-webhook]
verify_jwt = false

[functions.n8n-whatsapp-webhook]
verify_jwt = false
```

---

## Secrets Requeridos

No se requieren secrets adicionales. Las funciones solo usan:

```bash
# Variables automáticas de Supabase (ya configuradas)
# SUPABASE_URL
# SUPABASE_SERVICE_ROLE_KEY
```

---

## Edge Functions

### 1. query-rag

**Ruta:** `supabase/functions/query-rag/index.ts`

**Descripción:** Función para realizar consultas al sistema RAG a través de N8N.

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error("Missing Supabase environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Get the n8n webhook configuration for RAG queries
    const { data: webhook, error: webhookError } = await supabase
      .from("n8n_webhooks")
      .select("webhook_url")
      .eq("name", "n8n_rag_query_webhook")
      .eq("is_active", true)
      .single();

    if (webhookError || !webhook) {
      throw new Error(
        "No se encontró el webhook de consultas RAG. Configúralo en el panel de administración."
      );
    }

    const { query } = await req.json();

    if (!query) {
      throw new Error("Query is required");
    }

    // Call the n8n webhook for RAG query
    const response = await fetch(webhook.webhook_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`N8N webhook failed: ${response.statusText}`);
    }

    const result = await response.json();

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in query-rag function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
```

---

### 2. upload-to-drive

**Ruta:** `supabase/functions/upload-to-drive/index.ts`

**Descripción:** Función para subir archivos a Google Drive a través de N8N y registrarlos en la base de datos.

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.79.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Obtener la configuración de N8N para subir a Google Drive
    const { data: webhookData } = await supabase
      .from("n8n_webhooks")
      .select("webhook_url")
      .eq("name", "upload_to_drive")
      .eq("is_active", true)
      .single();

    if (!webhookData) {
      return new Response(
        JSON.stringify({ error: "N8N webhook not configured for Google Drive upload" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const caseId = formData.get("case_id") as string;
    const userId = formData.get("user_id") as string;

    if (!file) {
      return new Response(
        JSON.stringify({ error: "No file provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Convertir el archivo a base64 para enviarlo a N8N
    const arrayBuffer = await file.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    // Enviar a N8N para que suba a Google Drive
    const n8nResponse = await fetch(webhookData.webhook_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        file_base64: base64,
        case_id: caseId,
        uploaded_by: userId,
      }),
    });

    if (!n8nResponse.ok) {
      throw new Error("Failed to upload to Google Drive via N8N");
    }

    const n8nResult = await n8nResponse.json();

    // Guardar la referencia en la base de datos
    const { data, error } = await supabase
      .from("documents")
      .insert({
        file_name: file.name,
        file_url: n8nResult.drive_url, // URL retornada por N8N desde Google Drive
        file_type: file.type,
        file_size: file.size,
        case_id: caseId || null,
        uploaded_by: userId || null,
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({ 
        success: true, 
        data,
        drive_url: n8nResult.drive_url,
        message: "File uploaded to Google Drive and indexed for RAG"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error uploading to Drive:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
```

---

### 3. n8n-cases-webhook

**Ruta:** `supabase/functions/n8n-cases-webhook/index.ts`

**Descripción:** Webhook para recibir y procesar casos desde N8N.

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.79.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const payload = await req.json();
    console.log("Received webhook payload:", payload);

    // Validar que venga la estructura esperada
    if (!payload.case_number || !payload.title) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: case_number and title" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insertar o actualizar el caso
    const { data, error } = await supabase
      .from("cases")
      .upsert({
        case_number: payload.case_number,
        title: payload.title,
        description: payload.description || null,
        status: payload.status || "new",
        client_id: payload.client_id || null,
        lawyer_id: payload.lawyer_id || null,
      }, {
        onConflict: 'case_number'
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
```

---

### 4. n8n-documents-webhook

**Ruta:** `supabase/functions/n8n-documents-webhook/index.ts`

**Descripción:** Webhook para recibir y registrar documentos desde N8N.

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.79.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const payload = await req.json();
    console.log("Received document webhook payload:", payload);

    // Validar campos requeridos
    if (!payload.file_name || !payload.file_url) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: file_name and file_url" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insertar el documento en la base de datos
    const { data, error } = await supabase
      .from("documents")
      .insert({
        file_name: payload.file_name,
        file_url: payload.file_url,
        file_type: payload.file_type || null,
        file_size: payload.file_size || null,
        case_id: payload.case_id || null,
        uploaded_by: payload.uploaded_by || null,
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing document webhook:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
```

---

### 5. n8n-whatsapp-webhook

**Ruta:** `supabase/functions/n8n-whatsapp-webhook/index.ts`

**Descripción:** Webhook para recibir mensajes de WhatsApp. El case_id debe venir en el payload.

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.79.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const payload = await req.json();
    console.log("Received WhatsApp webhook payload:", payload);

    // Validar campos requeridos
    if (!payload.message_id || !payload.from_number || !payload.to_number || !payload.chat_id) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // El case_id debe venir en el payload desde N8N
    const linkedCaseId = payload.case_id || null;

    // Insertar o actualizar el mensaje
    const { data, error } = await supabase
      .from("whatsapp_messages")
      .upsert({
        message_id: payload.message_id,
        chat_id: payload.chat_id,
        from_number: payload.from_number,
        to_number: payload.to_number,
        message_content: payload.message_content || null,
        message_type: payload.message_type || "text",
        status: payload.status || "sent",
        case_id: linkedCaseId,
      }, {
        onConflict: 'message_id'
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing WhatsApp webhook:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
```

---

## Deployment

### Usando Supabase CLI

```bash
# 1. Instalar Supabase CLI
npm install -g supabase

# 2. Iniciar sesión
supabase login

# 3. Link a tu proyecto
supabase link --project-ref TU_PROJECT_ID

# 4. Configurar secrets
supabase secrets set LOVABLE_API_KEY=tu_api_key

# 5. Deploy todas las funciones
supabase functions deploy query-rag
supabase functions deploy upload-to-drive
supabase functions deploy n8n-cases-webhook
supabase functions deploy n8n-documents-webhook
supabase functions deploy n8n-whatsapp-webhook
```

### URLs de las Edge Functions

Después del deployment, tus funciones estarán disponibles en:

```
https://TU_PROJECT_ID.supabase.co/functions/v1/query-rag
https://TU_PROJECT_ID.supabase.co/functions/v1/upload-to-drive
https://TU_PROJECT_ID.supabase.co/functions/v1/n8n-cases-webhook
https://TU_PROJECT_ID.supabase.co/functions/v1/n8n-documents-webhook
https://TU_PROJECT_ID.supabase.co/functions/v1/n8n-whatsapp-webhook
```

### Testing

```bash
# Test query-rag
curl -X POST https://TU_PROJECT_ID.supabase.co/functions/v1/query-rag \
  -H "Content-Type: application/json" \
  -d '{"query":"¿Qué documentos tengo sobre contratos?"}'

# Test n8n-cases-webhook
curl -X POST https://TU_PROJECT_ID.supabase.co/functions/v1/n8n-cases-webhook \
  -H "Content-Type: application/json" \
  -d '{"case_number":"CASE-001","title":"Test Case"}'
```

---

## Logs y Debugging

Ver logs de una función:

```bash
supabase functions logs query-rag --tail
```

Ver logs en tiempo real:

```bash
supabase functions logs query-rag --tail --follow
```

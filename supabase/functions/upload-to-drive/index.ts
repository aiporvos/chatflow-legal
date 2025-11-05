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

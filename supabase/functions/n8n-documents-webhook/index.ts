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
    // El file_url debe ser la URL de Google Drive donde está almacenado
    const { data, error } = await supabase
      .from("documents")
      .insert({
        file_name: payload.file_name,
        file_url: payload.file_url, // URL de Google Drive
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

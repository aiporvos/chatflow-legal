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

    // Vincular automáticamente con expediente si no viene especificado
    let linkedCaseId = payload.case_id;
    
    if (!linkedCaseId && payload.message_content) {
      console.log("Attempting to auto-link message to case...");
      
      // Obtener todos los expedientes activos
      const { data: cases } = await supabase
        .from("cases")
        .select("id, case_number, title, description, status")
        .neq("status", "closed");
      
      if (cases && cases.length > 0) {
        // Usar Lovable AI para analizar el mensaje
        const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
        const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${lovableApiKey}`,
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              {
                role: "system",
                content: `Eres un asistente que analiza mensajes de WhatsApp y determina si se refieren a algún expediente legal específico. 
                
Expedientes disponibles:
${cases.map(c => `- ID: ${c.id}, Número: ${c.case_number}, Título: ${c.title}, Estado: ${c.status}`).join('\n')}

Si el mensaje menciona un número de expediente, título, o parece relacionado con algún caso, responde SOLO con el ID del expediente (UUID).
Si no hay coincidencia clara, responde con "NONE".
NO des explicaciones, solo el ID o "NONE".`
              },
              {
                role: "user",
                content: `Mensaje: "${payload.message_content}"`
              }
            ],
            temperature: 0.3,
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          const suggestedCaseId = aiData.choices[0]?.message?.content?.trim();
          
          if (suggestedCaseId && suggestedCaseId !== "NONE") {
            // Verificar que el ID existe
            const matchedCase = cases.find(c => c.id === suggestedCaseId);
            if (matchedCase) {
              linkedCaseId = suggestedCaseId;
              console.log(`Message auto-linked to case: ${matchedCase.case_number}`);
            }
          }
        }
      }
    }

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

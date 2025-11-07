import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type RagHistoryItem = {
  role: "user" | "assistant";
  content: string;
};

type RagMutationInput = {
  query: string;
  history?: RagHistoryItem[];
};

export const useRagQuery = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ query, history }: RagMutationInput) => {
      // Obtener la URL del webhook configurado en Supabase
      const { data: webhook, error: webhookError } = await supabase
        .from("n8n_webhooks")
        .select("webhook_url, is_active")
        .eq("name", "n8n_rag_query_webhook")
        .eq("is_active", true)
        .order("updated_at", { ascending: false, nullsFirst: false })
        .limit(1)
        .maybeSingle();

      if (webhookError) {
        throw new Error(webhookError.message || "Error obteniendo el webhook RAG");
      }

      if (!webhook?.webhook_url) {
        throw new Error(
          "No se encontró el webhook de consultas RAG. Configúralo en el panel de administración."
        );
      }

      const payload: Record<string, unknown> = { query };

      if (history && history.length > 0) {
        payload.history = history.map((item) => ({ role: item.role, content: item.content }));
      }

      const response = await fetch(webhook.webhook_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          errorText || `No se pudo contactar el webhook (${response.status})`
        );
      }

      const data = await response.json().catch(() => ({}));

      return data;
    },
    onSuccess: (data) => {
      if (!data?.answer && !data?.message) {
        toast({
          title: "Sin respuesta",
          description: "No se pudo obtener una respuesta del RAG",
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      if (!error.message?.includes("webhook") && !error.message?.includes("Configúralo")) {
        toast({
          title: "Error al consultar RAG",
          description: error.message || "Verifica que el webhook esté configurado correctamente",
          variant: "destructive",
        });
      }
    },
  });
};

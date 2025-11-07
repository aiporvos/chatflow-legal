import { supabase } from "@/integrations/supabase/client";

export type RagHistoryItem = {
  role: "user" | "assistant" | "system";
  content: string;
};

export type RagAttachment = {
  name: string;
  url: string;
  type: string;
  size: number;
};

const RAG_WEBHOOK_NAME = "n8n_rag_query_webhook";

export const fetchActiveRagWebhookUrl = async (): Promise<string> => {
  const { data, error } = await supabase
    .from("n8n_webhooks")
    .select("webhook_url")
    .eq("name", RAG_WEBHOOK_NAME)
    .eq("is_active", true)
    .order("updated_at", { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || "Error obteniendo el webhook de RAG");
  }

  if (!data?.webhook_url) {
    throw new Error(
      "No se encontró el webhook de consultas RAG. Configúralo en el panel de administración."
    );
  }

  return data.webhook_url;
};

type CallWebhookParams = {
  query: string;
  history?: RagHistoryItem[];
  attachments?: RagAttachment[];
};

export const callRagWebhook = async ({
  query,
  history,
  attachments,
}: CallWebhookParams) => {
  const webhookUrl = await fetchActiveRagWebhookUrl();

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      history,
      attachments,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      errorBody || `No se pudo contactar el webhook (${response.status})`
    );
  }

  return response
    .json()
    .catch(() => ({} as Record<string, unknown>)) as Promise<
    Record<string, unknown>
  >;
};



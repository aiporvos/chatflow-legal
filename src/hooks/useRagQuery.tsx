import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { callRagWebhook, RagHistoryItem } from "@/utils/rag";

type RagMutationInput = {
  query: string;
  history?: RagHistoryItem[];
};

export type RagAnswer = {
  text: string;
  sources?: string[];
};

const extractAnswerFromValue = (
  value: unknown,
  visited: Set<unknown>
): RagAnswer => {
  if (value == null) return { text: "" };

  if (typeof value === "string") {
    const text = value.trim();
    return { text };
  }

  if (Array.isArray(value)) {
    for (const entry of value) {
      const extracted = extractAnswerFromValue(entry, visited);
      if (extracted.text) {
        return extracted;
      }
    }
    return { text: "" };
  }

  if (typeof value === "object") {
    if (visited.has(value)) {
      return { text: "" };
    }
    visited.add(value);

    const obj = value as Record<string, unknown>;
    const sources = Array.isArray(obj.sources)
      ? obj.sources.map((source) => String(source))
      : undefined;

    const prioritizedKeys = ["answer", "message", "output", "text", "content"] as const;

    for (const key of prioritizedKeys) {
      const field = obj[key];
      if (typeof field === "string" && field.trim()) {
        return { text: field.trim(), sources };
      }

      if (field !== undefined) {
        const nested = extractAnswerFromValue(field, visited);
        if (nested.text) {
          return {
            text: nested.text,
            sources: nested.sources ?? sources,
          };
        }
      }
    }

    for (const key of Object.keys(obj)) {
      if (prioritizedKeys.includes(key as (typeof prioritizedKeys)[number])) {
        continue;
      }
      const nested = extractAnswerFromValue(obj[key], visited);
      if (nested.text) {
        return {
          text: nested.text,
          sources: nested.sources ?? sources,
        };
      }
    }
  }

  return { text: "" };
};

export const extractRagAnswer = (payload: unknown): RagAnswer => {
  const result = extractAnswerFromValue(payload, new Set());

  if (result.text) {
    return {
      text: result.text,
      sources: result.sources?.filter((source) => Boolean(source && source.trim?.()))
        .map((source) => (typeof source === "string" ? source : String(source)))
        .filter(Boolean),
    };
  }

  return { text: "" };
};

export const useRagQuery = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ query, history }: RagMutationInput) => {
      // Obtener la URL del webhook configurado en Supabase
      return callRagWebhook({
        query,
        history: history?.map((item) => ({ role: item.role, content: item.content })),
      });
    },
    onSuccess: (data) => {
      const { text } = extractRagAnswer(data);
      if (!text) {
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

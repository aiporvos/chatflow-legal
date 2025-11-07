import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { extractRagAnswer } from "./useRagQuery";
import { callRagWebhook, RagAttachment, RagHistoryItem } from "@/utils/rag";
import { useToast } from "@/hooks/use-toast";

type RagChatInput = {
  userId: string;
  sessionId?: string;
  title?: string;
  message: string;
  history: RagHistoryItem[];
  attachments?: RagAttachment[];
};

type RagChatOutput = {
  sessionId: string;
  assistantMessage: {
    text: string;
    sources?: string[];
  };
};

export const useRagChat = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      userId,
      sessionId,
      title,
      message,
      history,
      attachments,
    }: RagChatInput): Promise<RagChatOutput> => {
      if (!userId) {
        throw new Error("No se encontró el usuario autenticado");
      }

      let currentSessionId = sessionId;

      if (!currentSessionId) {
        const sessionTitle =
          title?.trim() || message.slice(0, 80) || "Nueva conversación";
        const { data, error } = await supabase
          .from("rag_sessions")
          .insert({
            user_id: userId,
            title: sessionTitle,
          })
          .select("id")
          .maybeSingle();

        if (error || !data?.id) {
          throw new Error(
            error?.message || "No se pudo crear la sesión de conversación"
          );
        }

        currentSessionId = data.id;
      }

      const { error: messageError } = await supabase.from("rag_messages").insert({
        session_id: currentSessionId,
        user_id: userId,
        role: "user",
        content: message,
        attachments: attachments ?? [],
      });

      if (messageError) {
        throw new Error(
          messageError.message || "No se pudo registrar tu mensaje"
        );
      }

      const response = await callRagWebhook({
        query: message,
        history,
        attachments,
      });

      const assistant = extractRagAnswer(response);

      const { error: assistantError } = await supabase.from("rag_messages").insert({
        session_id: currentSessionId,
        user_id: userId,
        role: "assistant",
        content: assistant.text || "Sin respuesta",
        attachments: assistant.sources
          ? assistant.sources.map((source, index) => ({
              name: `Referencia ${index + 1}`,
              url: source,
              type: "reference",
              size: 0,
            }))
          : [],
      });

      if (assistantError) {
        throw new Error(
          assistantError.message || "No se pudo guardar la respuesta del asistente"
        );
      }

      await supabase
        .from("rag_sessions")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", currentSessionId);

      return {
        sessionId: currentSessionId,
        assistantMessage: assistant,
      };
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["ragSessions", variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["ragMessages", data.sessionId],
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error en el chat RAG",
        description:
          error.message || "No se pudo procesar la conversación con el RAG",
        variant: "destructive",
      });
    },
  });
};



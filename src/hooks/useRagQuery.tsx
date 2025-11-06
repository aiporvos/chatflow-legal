import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useRagQuery = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ query }: { query: string }) => {
      const { data, error } = await supabase.functions.invoke("query-rag", {
        body: { query },
      });

      if (error) {
        // Extract error message from the response
        const errorMessage = error.message || "Error desconocido";
        throw new Error(errorMessage);
      }
      
      return data;
    },
    onSuccess: (data) => {
      if (!data.answer && !data.message) {
        toast({
          title: "Sin respuesta",
          description: "No se pudo obtener una respuesta del RAG",
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      // Only show toast if it's not a webhook configuration error
      // (the UI will show a better error message with a link to settings)
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

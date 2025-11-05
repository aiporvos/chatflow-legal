import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useDocumentUpload = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file,
      caseId,
      userId,
    }: {
      file: File;
      caseId?: string;
      userId?: string;
    }) => {
      const formData = new FormData();
      formData.append("file", file);
      if (caseId) formData.append("case_id", caseId);
      if (userId) formData.append("user_id", userId);

      const { data, error } = await supabase.functions.invoke("upload-to-drive", {
        body: formData,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast({
        title: "Documento subido",
        description: "El archivo se ha subido a Google Drive y está disponible para el RAG",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error al subir documento",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

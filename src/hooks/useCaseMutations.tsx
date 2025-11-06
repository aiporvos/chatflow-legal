import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CreateCaseInput, UpdateCaseInput } from "@/lib/validations/case";
import { logError, getUserFriendlyMessage } from "@/utils/errorHandler";

export const useCaseMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createCase = useMutation({
    mutationFn: async (data: CreateCaseInput) => {
      const { data: newCase, error } = await supabase
        .from("cases")
        .insert({
          case_number: data.case_number,
          title: data.title,
          description: data.description || null,
          client_id: data.client_id || null,
          lawyer_id: data.lawyer_id || null,
          status: data.status || "new",
        })
        .select()
        .single();

      if (error) {
        const errorDetails = logError(error, { 
          operation: 'create_case',
          table: 'cases',
          data: { case_number: data.case_number, title: data.title }
        });
        throw new Error(getUserFriendlyMessage(error) || "Error al crear el expediente");
      }
      return newCase;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      toast({
        title: "Expediente creado",
        description: "El expediente ha sido creado exitosamente.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error al crear expediente",
        description: error.message || "Ocurrió un error al crear el expediente.",
        variant: "destructive",
      });
    },
  });

  const updateCase = useMutation({
    mutationFn: async (data: UpdateCaseInput) => {
      const { id, ...updateData } = data;
      
      // Remove undefined values
      const cleanData = Object.fromEntries(
        Object.entries(updateData).filter(([_, v]) => v !== undefined)
      );

      const { data: updatedCase, error } = await supabase
        .from("cases")
        .update(cleanData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        const errorDetails = logError(error, { 
          operation: 'update_case',
          table: 'cases',
          case_id: id
        });
        throw new Error(getUserFriendlyMessage(error) || "Error al actualizar el expediente");
      }
      return updatedCase;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      toast({
        title: "Expediente actualizado",
        description: "El expediente ha sido actualizado exitosamente.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error al actualizar expediente",
        description: error.message || "Ocurrió un error al actualizar el expediente.",
        variant: "destructive",
      });
    },
  });

  const deleteCase = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("cases")
        .delete()
        .eq("id", id);

      if (error) {
        const errorDetails = logError(error, { 
          operation: 'delete_case',
          table: 'cases',
          case_id: id
        });
        throw new Error(getUserFriendlyMessage(error) || "Error al eliminar el expediente");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      toast({
        title: "Expediente eliminado",
        description: "El expediente ha sido eliminado exitosamente.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error al eliminar expediente",
        description: error.message || "Ocurrió un error al eliminar el expediente.",
        variant: "destructive",
      });
    },
  });

  return {
    createCase,
    updateCase,
    deleteCase,
  };
};

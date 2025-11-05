import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

type Webhook = Tables<"n8n_webhooks">;
type WebhookInsert = TablesInsert<"n8n_webhooks">;
type WebhookUpdate = TablesUpdate<"n8n_webhooks">;

export const useWebhookMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createWebhook = useMutation({
    mutationFn: async (webhook: WebhookInsert) => {
      const { data, error } = await supabase
        .from("n8n_webhooks")
        .insert(webhook)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
      toast({
        title: "Webhook creado",
        description: "El webhook se ha configurado correctamente",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error al crear webhook",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateWebhook = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: WebhookUpdate }) => {
      const { data, error } = await supabase
        .from("n8n_webhooks")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
      toast({
        title: "Webhook actualizado",
        description: "Los cambios se han guardado correctamente",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error al actualizar webhook",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteWebhook = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("n8n_webhooks")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
      toast({
        title: "Webhook eliminado",
        description: "El webhook se ha eliminado correctamente",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error al eliminar webhook",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const toggleWebhook = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { data, error } = await supabase
        .from("n8n_webhooks")
        .update({ is_active: isActive })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
      toast({
        title: data.is_active ? "Webhook activado" : "Webhook desactivado",
        description: `El webhook "${data.name}" está ahora ${data.is_active ? "activo" : "inactivo"}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error al cambiar estado",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    createWebhook,
    updateWebhook,
    deleteWebhook,
    toggleWebhook,
  };
};

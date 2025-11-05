import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useWhatsAppMessages = (caseId?: string) => {
  return useQuery({
    queryKey: ["whatsappMessages", caseId],
    queryFn: async () => {
      let query = supabase
        .from("whatsapp_messages")
        .select(`
          *,
          case:cases(case_number, title, status)
        `)
        .order("created_at", { ascending: true });

      if (caseId) {
        query = query.eq("case_id", caseId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};

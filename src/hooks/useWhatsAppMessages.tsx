import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export const useWhatsAppMessages = (caseId?: string) => {
  const query = useQuery({
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

  // Subscribe to realtime updates
  useEffect(() => {
    const channel = supabase
      .channel("whatsapp-messages-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "whatsapp_messages",
        },
        () => {
          query.refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [query]);

  return query;
};

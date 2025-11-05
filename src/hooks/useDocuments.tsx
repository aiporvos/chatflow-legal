import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useDocuments = (caseId?: string) => {
  return useQuery({
    queryKey: ["documents", caseId],
    queryFn: async () => {
      let query = supabase
        .from("documents")
        .select("*")
        .order("created_at", { ascending: false });

      if (caseId) {
        query = query.eq("case_id", caseId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};

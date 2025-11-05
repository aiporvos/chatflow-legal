import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCases = () => {
  return useQuery({
    queryKey: ["cases"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cases")
        .select(`
          *,
          client:profiles!cases_client_id_fkey(id, full_name, email),
          lawyer:profiles!cases_lawyer_id_fkey(id, full_name, email)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

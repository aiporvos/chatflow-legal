import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { PostgrestError } from "@supabase/supabase-js";

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

      if (error) {
        console.error("Error fetching cases:", error);
        throw new Error(error.message || "Error al cargar los expedientes");
      }
      return data || [];
    },
    retry: 2,
    staleTime: 30000, // 30 seconds
  });
};

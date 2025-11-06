import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { logError, getUserFriendlyMessage } from "@/utils/errorHandler";

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
        const errorDetails = logError(error, { 
          operation: 'fetch_cases',
          table: 'cases' 
        });
        throw new Error(getUserFriendlyMessage(error) || "Error al cargar los expedientes");
      }
      return data || [];
    },
    retry: (failureCount, error) => {
      // Don't retry on 400 errors (bad request)
      if (error instanceof Error && error.message.includes('400')) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 30000, // 30 seconds
  });
};
